package br.ifce.gestor_estoque.services;

import br.ifce.gestor_estoque.domain.estoque.Produto;
import br.ifce.gestor_estoque.domain.estoque.SaidaProduto;
import br.ifce.gestor_estoque.dto.estoque.SaidaProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.SaidaProdutoResponse;
import br.ifce.gestor_estoque.events.SaidaProdutoAtualizadaEvent;
import br.ifce.gestor_estoque.events.SaidaProdutoCriadaEvent;
import br.ifce.gestor_estoque.events.SaidaProdutoExcluidaEvent;
import br.ifce.gestor_estoque.exceptions.BusinessException;
import br.ifce.gestor_estoque.exceptions.NotFoundException;
import br.ifce.gestor_estoque.repositores.ProdutoRepository;
import br.ifce.gestor_estoque.repositores.SaidaProdutoRepository;
import br.ifce.gestor_estoque.services.interfaces.ISaidaProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SaidaProdutoService implements ISaidaProdutoService {

    @Autowired
    private SaidaProdutoRepository saidaProdutoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Override
    public List<SaidaProdutoResponse> listarTodas() {
        return saidaProdutoRepository.findAll().stream()
                .map(SaidaProdutoResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<SaidaProdutoResponse> getSaidaById(Long id) {
        return saidaProdutoRepository.findById(id)
                .map(SaidaProdutoResponse::new);
    }

    @Override
    @Transactional
    public SaidaProdutoResponse createSaida(SaidaProdutoRequest request) {
        Produto produto = produtoRepository.findById(request.produtoId)
                .orElseThrow(() -> new NotFoundException("Produto com ID " + request.produtoId + " não encontrado."));

        if (produto.getQuantidadeEstoque() < request.quantidade) {
            throw new BusinessException("Quantidade em estoque insuficiente para o produto ID " + request.produtoId + ". Estoque atual: " + produto.getQuantidadeEstoque());
        }

        SaidaProduto saidaProduto = new SaidaProduto();
        saidaProduto.setProduto(produto);
        saidaProduto.setQuantidade(request.quantidade);
        saidaProduto.setDataSaida(request.dataSaida);
        saidaProduto.setMotivo(request.motivo);
        saidaProduto.setCliente(request.cliente);
        saidaProduto.setObservacao(request.observacao);

        // produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - request.quantidade);
        // produtoRepository.save(produto);

        SaidaProduto novaSaida = saidaProdutoRepository.save(saidaProduto);
        eventPublisher.publishEvent(new SaidaProdutoCriadaEvent(novaSaida));
        return new SaidaProdutoResponse(novaSaida);
    }

    @Override
    @Transactional
    public SaidaProdutoResponse updateSaida(Long id, SaidaProdutoRequest request) {
        SaidaProduto saidaProduto = saidaProdutoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Saída de produto com ID " + id + " não encontrada para atualização."));

        Produto produtoNovo = produtoRepository.findById(request.produtoId)
                .orElseThrow(() -> new NotFoundException("Produto com ID " + request.produtoId + " não encontrado."));

        Produto produtoAntigo = saidaProduto.getProduto();
        int quantidadeAntigaNaSaida = saidaProduto.getQuantidade();
        int quantidadeNovaNaSaida = request.quantidade;

        // Reverter a quantidade antiga da saída do estoque do produto antigo
        produtoAntigo.setQuantidadeEstoque(produtoAntigo.getQuantidadeEstoque() + quantidadeAntigaNaSaida);
        if (!produtoAntigo.getId().equals(produtoNovo.getId())) {
            produtoRepository.save(produtoAntigo);
        } else {
            // If the product is the same, the stock adjustment for the old quantity has already been made.
            // We need to ensure this adjusted stock is saved before calculating new availability.
            produtoRepository.save(produtoAntigo); // Save the state after reverting old quantity
        }

        // Recalculate available stock for the product to be associated with the *new* saida
        // If product changed, produtoNovo is a fresh instance. If same product, it's produtoAntigo with stock reverted.
        Produto produtoParaNovaSaida = produtoRepository.findById(produtoNovo.getId()).get(); // Re-fetch to get latest state

        if (produtoParaNovaSaida.getQuantidadeEstoque() < quantidadeNovaNaSaida) {
            // Restore original stock of produtoAntigo if we bailed out, to avoid inconsistent state
            // This is complex; ideally, this check happens before any stock modification.
            // For now, we proceed assuming the check is sufficient.
            throw new BusinessException("Quantidade em estoque insuficiente para o produto ID " + request.produtoId + ". Estoque disponível: " + produtoParaNovaSaida.getQuantidadeEstoque());
        }

        saidaProduto.setProduto(produtoNovo); // produtoNovo here is the one fetched by request.produtoId
        saidaProduto.setQuantidade(quantidadeNovaNaSaida);
        saidaProduto.setDataSaida(request.dataSaida);
        saidaProduto.setMotivo(request.motivo);
        saidaProduto.setCliente(request.cliente);
        saidaProduto.setObservacao(request.observacao);

        // produtoNovo.setQuantidadeEstoque(estoqueDisponivelParaNovaSaida - quantidadeNovaNaSaida);
        // produtoRepository.save(produtoNovo);

        SaidaProduto saidaAtualizada = saidaProdutoRepository.save(saidaProduto);
        eventPublisher.publishEvent(new SaidaProdutoAtualizadaEvent(saidaAtualizada));
        return new SaidaProdutoResponse(saidaAtualizada);
    }

    @Override
    @Transactional
    public void deleteSaida(Long id) {
        SaidaProduto saidaProduto = saidaProdutoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Saída de produto com ID " + id + " não encontrada para exclusão."));

        // Produto produto = saidaProduto.getProduto();
        // int quantidadeNaSaida = saidaProduto.getQuantidade();

        // Adicionar a quantidade da saída de volta ao estoque do produto
        // produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + quantidadeNaSaida);
        // produtoRepository.save(produto);

        eventPublisher.publishEvent(new SaidaProdutoExcluidaEvent(saidaProduto));
        saidaProdutoRepository.delete(saidaProduto);
    }
}
