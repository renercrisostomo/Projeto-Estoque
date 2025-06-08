package br.ifce.gestor_estoque.services;

import br.ifce.gestor_estoque.domain.estoque.EntradaProduto;
import br.ifce.gestor_estoque.domain.estoque.Fornecedor;
import br.ifce.gestor_estoque.domain.estoque.Produto;
import br.ifce.gestor_estoque.dto.estoque.EntradaProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.EntradaProdutoResponse;
import br.ifce.gestor_estoque.exceptions.NotFoundException;
import br.ifce.gestor_estoque.repositores.EntradaProdutoRepository;
import br.ifce.gestor_estoque.repositores.FornecedorRepository;
import br.ifce.gestor_estoque.repositores.ProdutoRepository;
import br.ifce.gestor_estoque.services.interfaces.IEntradaProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
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

        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + request.quantidade);
        produtoRepository.save(produto);

        EntradaProduto novaEntrada = entradaProdutoRepository.save(entradaProduto);
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

        Produto produtoAntigoNaEntrada = entradaProduto.getProduto();
        int quantidadeAntigaNaEntrada = entradaProduto.getQuantidade();

        // Reverter a quantidade antiga do estoque do produto antigo da entrada
        produtoAntigoNaEntrada.setQuantidadeEstoque(produtoAntigoNaEntrada.getQuantidadeEstoque() - quantidadeAntigaNaEntrada);
        produtoRepository.save(produtoAntigoNaEntrada);

        // Atualizar dados da entrada
        entradaProduto.setProduto(produtoNovo);
        entradaProduto.setFornecedor(fornecedorNovo);
        entradaProduto.setQuantidade(request.quantidade);
        entradaProduto.setDataEntrada(request.dataEntrada);
        entradaProduto.setPrecoCusto(request.precoCusto);
        entradaProduto.setObservacao(request.observacao);

        // Adicionar a nova quantidade ao estoque do produto novo/atualizado da entrada
        // Se o produto foi alterado, o produtoAntigoNaEntrada já teve seu estoque corrigido.
        // Agora, o produtoNovo (que pode ser o mesmo que o antigo ou um diferente) tem seu estoque atualizado.
        produtoNovo.setQuantidadeEstoque(produtoNovo.getQuantidadeEstoque() + request.quantidade);
        produtoRepository.save(produtoNovo);

        EntradaProduto entradaAtualizada = entradaProdutoRepository.save(entradaProduto);
        return new EntradaProdutoResponse(entradaAtualizada);
    }

    @Override
    @Transactional
    public void deleteEntrada(Long id) {
        EntradaProduto entradaProduto = entradaProdutoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Entrada de produto com ID " + id + " não encontrada para exclusão."));

        Produto produto = entradaProduto.getProduto();
        int quantidadeNaEntrada = entradaProduto.getQuantidade();

        // Reverter a quantidade da entrada do estoque do produto
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - quantidadeNaEntrada);
        produtoRepository.save(produto);

        entradaProdutoRepository.delete(entradaProduto);
    }
}
