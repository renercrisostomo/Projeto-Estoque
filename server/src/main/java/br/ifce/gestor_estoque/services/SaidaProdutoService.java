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
import br.ifce.gestor_estoque.strategy.ValidacaoSaidaStrategy;
import br.ifce.gestor_estoque.strategy.ValidacaoStrategy;
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

    private final ValidacaoStrategy<SaidaProduto> validacaoSaidaStrategy;

    @Autowired
    public SaidaProdutoService(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
        this.validacaoSaidaStrategy = new ValidacaoSaidaStrategy();
    }

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

        SaidaProduto saidaProduto = new SaidaProduto();
        saidaProduto.setProduto(produto);
        saidaProduto.setQuantidade(request.quantidade);
        saidaProduto.setDataSaida(request.dataSaida);
        saidaProduto.setMotivo(request.motivo);
        saidaProduto.setCliente(request.cliente);
        saidaProduto.setObservacao(request.observacao);

        try {
            validacaoSaidaStrategy.validar(saidaProduto);
        } catch (Exception e) {
            throw new BusinessException(e.getMessage());
        }

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

        // ... Store old values ...
        Produto produtoAntigo = saidaProduto.getProduto();
        int quantidadeAntigaNaSaida = saidaProduto.getQuantidade();

        // Update saidaProduto fields
        saidaProduto.setProduto(produtoNovo);
        saidaProduto.setQuantidade(request.quantidade);
        saidaProduto.setDataSaida(request.dataSaida);
        saidaProduto.setMotivo(request.motivo);
        saidaProduto.setCliente(request.cliente);
        saidaProduto.setObservacao(request.observacao);

        try {
            // Validate before attempting to fetch the product for stock check to avoid unnecessary DB call if basic validation fails
            validacaoSaidaStrategy.validar(saidaProduto); 
        } catch (Exception e) {
            throw new BusinessException(e.getMessage());
        }

        // Logic to revert old stock and apply new stock (potentially moved to listeners or kept here if simple)
        produtoAntigo.entradaEstoque(quantidadeAntigaNaSaida);
        if (!produtoAntigo.getId().equals(produtoNovo.getId())) {
            produtoRepository.save(produtoAntigo); 
        } else {
             // If it's the same product, the earlier entradaEstoque call modified it, so save it.
            produtoRepository.save(produtoAntigo); 
        }
        
        // Re-fetch productParaNovaSaida to ensure we have the latest state after potential save of produtoAntigo
        Produto produtoParaNovaSaida = produtoRepository.findById(produtoNovo.getId())
           .orElseThrow(() -> new NotFoundException("Produto (para nova saída) com ID " + produtoNovo.getId() + " não encontrado após tentativa de atualização."));

        // This check was part of the original ValidacaoSaidaStrategy, 
        // but since stock levels change, it's re-evaluated here after reverting old stock.
        if (!produtoParaNovaSaida.temEstoqueSuficiente(request.quantidade)) {
            throw new BusinessException("Quantidade em estoque insuficiente para o produto ID " + request.produtoId + ". Estoque disponível: " + produtoParaNovaSaida.getQuantidadeEstoque());
        }

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
