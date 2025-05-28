package br.ifce.gestor_estoque.services;

import br.ifce.gestor_estoque.domain.estoque.Produto;
import br.ifce.gestor_estoque.domain.estoque.SaidaProduto;
import br.ifce.gestor_estoque.dto.estoque.SaidaProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.SaidaProdutoResponse;
import br.ifce.gestor_estoque.exceptions.BusinessException;
import br.ifce.gestor_estoque.exceptions.NotFoundException;
import br.ifce.gestor_estoque.repositores.ProdutoRepository;
import br.ifce.gestor_estoque.repositores.SaidaProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SaidaProdutoService {

    @Autowired
    private SaidaProdutoRepository saidaProdutoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<SaidaProdutoResponse> listarTodas() {
        return saidaProdutoRepository.findAll().stream()
                .map(SaidaProdutoResponse::new)
                .collect(Collectors.toList());
    }

    public Optional<SaidaProdutoResponse> getSaidaById(Long id) {
        return saidaProdutoRepository.findById(id)
                .map(SaidaProdutoResponse::new);
    }

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

        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - request.quantidade);
        produtoRepository.save(produto);

        SaidaProduto novaSaida = saidaProdutoRepository.save(saidaProduto);
        return new SaidaProdutoResponse(novaSaida);
    }

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
        }

        int estoqueDisponivelParaNovaSaida = produtoNovo.getId().equals(produtoAntigo.getId()) ? 
                                            produtoAntigo.getQuantidadeEstoque() : produtoNovo.getQuantidadeEstoque();

        if (estoqueDisponivelParaNovaSaida < quantidadeNovaNaSaida) {
            throw new BusinessException("Quantidade em estoque insuficiente para o produto ID " + request.produtoId + ". Estoque disponível: " + estoqueDisponivelParaNovaSaida);
        }

        saidaProduto.setProduto(produtoNovo);
        saidaProduto.setQuantidade(quantidadeNovaNaSaida);
        saidaProduto.setDataSaida(request.dataSaida);
        saidaProduto.setMotivo(request.motivo);
        saidaProduto.setCliente(request.cliente);
        saidaProduto.setObservacao(request.observacao);

        produtoNovo.setQuantidadeEstoque(estoqueDisponivelParaNovaSaida - quantidadeNovaNaSaida);
        produtoRepository.save(produtoNovo);

        SaidaProduto saidaAtualizada = saidaProdutoRepository.save(saidaProduto);
        return new SaidaProdutoResponse(saidaAtualizada);
    }

    @Transactional
    public boolean deleteSaida(Long id) {
        SaidaProduto saidaProduto = saidaProdutoRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Saída de produto com ID " + id + " não encontrada para exclusão."));

        Produto produto = saidaProduto.getProduto();
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + saidaProduto.getQuantidade());
        produtoRepository.save(produto);

        saidaProdutoRepository.delete(saidaProduto);
        return true;
    }
}
