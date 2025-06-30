package br.ifce.gestor_estoque.services;

import br.ifce.gestor_estoque.domain.estoque.EntradaProduto;
import br.ifce.gestor_estoque.domain.estoque.Fornecedor;
import br.ifce.gestor_estoque.domain.estoque.Produto;
import br.ifce.gestor_estoque.dto.estoque.EntradaProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.EntradaProdutoResponse;
import br.ifce.gestor_estoque.events.EntradaProdutoAtualizadaEvent;
import br.ifce.gestor_estoque.events.EntradaProdutoCriadaEvent;
import br.ifce.gestor_estoque.events.EntradaProdutoExcluidaEvent;
import br.ifce.gestor_estoque.exceptions.BusinessException;
import br.ifce.gestor_estoque.exceptions.NotFoundException;
import br.ifce.gestor_estoque.repositores.EntradaProdutoRepository;
import br.ifce.gestor_estoque.repositores.FornecedorRepository;
import br.ifce.gestor_estoque.repositores.ProdutoRepository;
import br.ifce.gestor_estoque.services.interfaces.IEntradaProdutoService;
import br.ifce.gestor_estoque.strategy.ValidacaoEntradaStrategy;
import br.ifce.gestor_estoque.strategy.ValidacaoStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EntradaProdutoService implements IEntradaProdutoService {

    @Autowired
    private EntradaProdutoRepository entradaProdutoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private FornecedorRepository fornecedorRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    private final ValidacaoStrategy<EntradaProduto> validacaoEntradaStrategy;

    @Autowired
    public EntradaProdutoService(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
        this.validacaoEntradaStrategy = new ValidacaoEntradaStrategy();
    }

    @Override
    public List<EntradaProdutoResponse> listarTodas() {
        return entradaProdutoRepository.findAll().stream()
                .map(EntradaProdutoResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<EntradaProdutoResponse> getEntradaById(Long id) {
        return entradaProdutoRepository.findById(id)
                .map(EntradaProdutoResponse::new);
    }

    @Override
    @Transactional
    public EntradaProdutoResponse createEntrada(EntradaProdutoRequest request) {
        Produto produto = produtoRepository.findById(request.produtoId)
                .orElseThrow(() -> new NotFoundException("Produto com ID " + request.produtoId + " não encontrado."));

        Fornecedor fornecedor = fornecedorRepository.findById(request.fornecedorId)
                .orElseThrow(() -> new NotFoundException("Fornecedor com ID " + request.fornecedorId + " não encontrado."));

        EntradaProduto entradaProduto = new EntradaProduto();
        entradaProduto.setProduto(produto);
        entradaProduto.setFornecedor(fornecedor);
        entradaProduto.setQuantidade(request.quantidade);
        entradaProduto.setDataEntrada(request.dataEntrada);
        entradaProduto.setPrecoCusto(request.precoCusto);
        entradaProduto.setObservacao(request.observacao);

        try {
            validacaoEntradaStrategy.validar(entradaProduto);
        } catch (Exception e) {
            throw new BusinessException(e.getMessage());
        }

        // A lógica de atualização de estoque foi movida para o ProdutoEventListener
        // e agora utiliza o método de domínio do Produto.

        EntradaProduto novaEntrada = entradaProdutoRepository.save(entradaProduto);
        eventPublisher.publishEvent(new EntradaProdutoCriadaEvent(novaEntrada));
        return new EntradaProdutoResponse(novaEntrada);
    }

    @Override
    @Transactional
    public EntradaProdutoResponse updateEntrada(Long id, EntradaProdutoRequest request) {
        EntradaProduto entradaProduto = entradaProdutoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Entrada de produto com ID " + id + " não encontrada para atualização."));

        Produto produtoNovo = produtoRepository.findById(request.produtoId)
                .orElseThrow(() -> new NotFoundException("Produto com ID " + request.produtoId + " não encontrado."));

        Fornecedor fornecedorNovo = fornecedorRepository.findById(request.fornecedorId)
                .orElseThrow(() -> new NotFoundException("Fornecedor com ID " + request.fornecedorId + " não encontrado."));

        // ... Store old values before making changes for event or other logic ...
        Produto produtoAntigoNaEntrada = entradaProduto.getProduto();
        int quantidadeAntigaNaEntrada = entradaProduto.getQuantidade();

        // Update entradaProduto fields
        entradaProduto.setProduto(produtoNovo);
        entradaProduto.setFornecedor(fornecedorNovo);
        entradaProduto.setQuantidade(request.quantidade);
        entradaProduto.setDataEntrada(request.dataEntrada);
        entradaProduto.setPrecoCusto(request.precoCusto);
        entradaProduto.setObservacao(request.observacao);

        try {
            validacaoEntradaStrategy.validar(entradaProduto);
        } catch (Exception e) {
            throw new BusinessException(e.getMessage());
        }
        
        // Logic to revert old stock and apply new stock (potentially moved to listeners or kept here if simple)
        // For simplicity, assuming direct manipulation here, but listeners are better for decoupling
        produtoAntigoNaEntrada.saidaEstoque(quantidadeAntigaNaEntrada);
        produtoRepository.save(produtoAntigoNaEntrada); 
        // Note: If produtoNovo is the same as produtoAntigoNaEntrada, this save might be redundant or need careful handling

        EntradaProduto entradaAtualizada = entradaProdutoRepository.save(entradaProduto);
        eventPublisher.publishEvent(new EntradaProdutoAtualizadaEvent(entradaAtualizada)); // Pass the updated entity
        return new EntradaProdutoResponse(entradaAtualizada);
    }

    @Override
    @Transactional
    public void deleteEntrada(Long id) {
        EntradaProduto entradaProduto = entradaProdutoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Entrada de produto com ID " + id + " não encontrada para exclusão."));

        // A lógica de atualização de estoque (reversão) será tratada pelo listener
        // que chamará produto.saidaEstoque(quantidadeNaEntrada)
        
        eventPublisher.publishEvent(new EntradaProdutoExcluidaEvent(entradaProduto));
        entradaProdutoRepository.delete(entradaProduto);
    }
}
