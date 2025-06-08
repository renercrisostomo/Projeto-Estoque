package br.ifce.gestor_estoque.services.interfaces;

import br.ifce.gestor_estoque.dto.estoque.SaidaProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.SaidaProdutoResponse;

import java.util.List;
import java.util.Optional;

public interface ISaidaProdutoService {
    List<SaidaProdutoResponse> listarTodas();
    Optional<SaidaProdutoResponse> getSaidaById(Long id);
    SaidaProdutoResponse createSaida(SaidaProdutoRequest request);
    SaidaProdutoResponse updateSaida(Long id, SaidaProdutoRequest request);
    void deleteSaida(Long id);
}
