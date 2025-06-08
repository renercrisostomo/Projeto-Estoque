package br.ifce.gestor_estoque.services.interfaces;

import br.ifce.gestor_estoque.dto.estoque.EntradaProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.EntradaProdutoResponse;

import java.util.List;
import java.util.Optional;

public interface IEntradaProdutoService {
    List<EntradaProdutoResponse> listarTodas();
    Optional<EntradaProdutoResponse> getEntradaById(Long id);
    EntradaProdutoResponse createEntrada(EntradaProdutoRequest request);
    EntradaProdutoResponse updateEntrada(Long id, EntradaProdutoRequest request);
    void deleteEntrada(Long id);
}
