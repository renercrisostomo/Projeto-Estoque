package br.ifce.gestor_estoque.repositores;

import br.ifce.gestor_estoque.domain.estoque.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // Métodos para dashboard
    long countByQuantidadeEstoqueLessThanEqual(int quantidade);
    List<Produto> findTop5ByOrderByQuantidadeEstoqueDesc();
}
