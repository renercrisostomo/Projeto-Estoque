package br.ifce.gestor_estoque.services.interfaces;

import br.ifce.gestor_estoque.dto.estoque.ProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.ProdutoResponse;

import java.util.List;
import java.util.Optional;

public interface IProdutoService {
    List<ProdutoResponse> listarTodos();
    Optional<ProdutoResponse> getProdutoById(Long id);
    ProdutoResponse createProduto(ProdutoRequest produtoRequest);
    Optional<ProdutoResponse> updateProduto(Long id, ProdutoRequest produtoRequest);
    boolean deleteProduto(Long id);
}
