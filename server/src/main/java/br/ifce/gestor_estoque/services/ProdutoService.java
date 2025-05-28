package br.ifce.gestor_estoque.services;

import br.ifce.gestor_estoque.domain.estoque.Produto;
import br.ifce.gestor_estoque.dto.estoque.ProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.ProdutoResponse;
import br.ifce.gestor_estoque.repositores.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<ProdutoResponse> listarTodos() {
        return produtoRepository.findAll().stream()
                .map(ProdutoResponse::new)
                .collect(Collectors.toList());
    }

    public Optional<ProdutoResponse> getProdutoById(Long id) {
        return produtoRepository.findById(id)
                .map(ProdutoResponse::new);
    }

    @Transactional
    public ProdutoResponse createProduto(ProdutoRequest produtoRequest) {
        Produto produto = new Produto();
        produto.setNome(produtoRequest.nome);
        produto.setDescricao(produtoRequest.descricao);
        produto.setPreco(produtoRequest.preco);
        produto.setQuantidadeEstoque(produtoRequest.quantidadeEstoque);
        produto.setUnidadeMedida(produtoRequest.unidadeMedida);
        
        Produto novoProduto = produtoRepository.save(produto);
        return new ProdutoResponse(novoProduto);
    }

    @Transactional
    public Optional<ProdutoResponse> updateProduto(Long id, ProdutoRequest produtoRequest) {
        Optional<Produto> produtoOptional = produtoRepository.findById(id);
        if (produtoOptional.isEmpty()) {
            return Optional.empty();
        }

        Produto produto = produtoOptional.get();
        produto.setNome(produtoRequest.nome);
        produto.setDescricao(produtoRequest.descricao);
        produto.setPreco(produtoRequest.preco);
        produto.setQuantidadeEstoque(produtoRequest.quantidadeEstoque);
        produto.setUnidadeMedida(produtoRequest.unidadeMedida);

        Produto produtoAtualizado = produtoRepository.save(produto);
        return Optional.of(new ProdutoResponse(produtoAtualizado));
    }

    @Transactional
    public boolean deleteProduto(Long id) {
        Optional<Produto> produtoOptional = produtoRepository.findById(id);
        if (produtoOptional.isPresent()) {
            produtoRepository.delete(produtoOptional.get());
            return true;
        }
        return false;
    }
}
