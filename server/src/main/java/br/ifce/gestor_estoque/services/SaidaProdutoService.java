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

        // Usando o método de domínio para verificar o estoque
        if (!produto.temEstoqueSuficiente(request.quantidade)) {
            throw new BusinessException("Quantidade em estoque insuficiente para o produto ID " + request.produtoId + ". Estoque atual: " + produto.getQuantidadeEstoque());
        }

        SaidaProduto saidaProduto = new SaidaProduto();
        saidaProduto.setProduto(produto);
        saidaProduto.setQuantidade(request.quantidade);
        saidaProduto.setDataSaida(request.dataSaida);
        saidaProduto.setMotivo(request.motivo);
        saidaProduto.setCliente(request.cliente);
        saidaProduto.setObservacao(request.observacao);

        // A lógica de atualização de estoque foi movida para o SaidaProdutoEventListener
        // e agora utiliza o método de domínio do Produto.

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
        // Usando o método de domínio para entrada de estoque
        produtoAntigo.entradaEstoque(quantidadeAntigaNaSaida);
        if (!produtoAntigo.getId().equals(produtoNovo.getId())) {
            produtoRepository.save(produtoAntigo);
        } else {
            produtoRepository.save(produtoAntigo); 
        }

        Produto produtoParaNovaSaida = produtoRepository.findById(produtoNovo.getId())
            .orElseThrow(() -> new NotFoundException("Produto (para nova saída) com ID " + produtoNovo.getId() + " não encontrado após tentativa de atualização.")); // Re-fetch to get latest state

        // Usando o método de domínio para verificar o estoque no produtoParaNovaSaida
        if (!produtoParaNovaSaida.temEstoqueSuficiente(quantidadeNovaNaSaida)) {
            throw new BusinessException("Quantidade em estoque insuficiente para o produto ID " + request.produtoId + ". Estoque disponível: " + produtoParaNovaSaida.getQuantidadeEstoque());
        }

        saidaProduto.setProduto(produtoNovo); 
        saidaProduto.setQuantidade(quantidadeNovaNaSaida);
        saidaProduto.setDataSaida(request.dataSaida);
        saidaProduto.setMotivo(request.motivo);
        saidaProduto.setCliente(request.cliente);
        saidaProduto.setObservacao(request.observacao);

        // A lógica de atualização de estoque para o produtoNovo será tratada pelo listener
        // que chamará produtoNovo.saidaEstoque(request.quantidade)

        SaidaProduto saidaAtualizada = saidaProdutoRepository.save(saidaProduto);
        eventPublisher.publishEvent(new SaidaProdutoAtualizadaEvent(saidaAtualizada));
        return new SaidaProdutoResponse(saidaAtualizada);
    }

    @Override
    @Transactional
    public void deleteSaida(Long id) {
        SaidaProduto saidaProduto = saidaProdutoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Saída de produto com ID " + id + " não encontrada para exclusão."));

        // A lógica de atualização de estoque (reversão) será tratada pelo listener
        // que chamará produto.entradaEstoque(quantidadeNaSaida)

        eventPublisher.publishEvent(new SaidaProdutoExcluidaEvent(saidaProduto));
        saidaProdutoRepository.delete(saidaProduto);
    }
}
