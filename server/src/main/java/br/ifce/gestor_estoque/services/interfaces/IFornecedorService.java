package br.ifce.gestor_estoque.services.interfaces;

import br.ifce.gestor_estoque.domain.estoque.Fornecedor;
import java.util.List;
import java.util.Optional;

public interface IFornecedorService {
    List<Fornecedor> listarTodos();
    Optional<Fornecedor> obterPorId(Long id);
    Fornecedor criar(Fornecedor fornecedor);
    Fornecedor atualizar(Long id, Fornecedor fornecedorAtualizado);
    boolean deletar(Long id);
}
