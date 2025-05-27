package br.ifce.gestor_estoque.repositores;

import br.ifce.gestor_estoque.domain.estoque.EntradaProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntradaProdutoRepository extends JpaRepository<EntradaProduto, Long> {
}
