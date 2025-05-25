package br.ifce.gestor_estoque.repositores;

import br.ifce.gestor_estoque.domain.estoque.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // Spring Data JPA will automatically provide methods like findAll(), findById(), save(), deleteById(), etc.
    // You can add custom query methods here if needed, for example:
    // List<Produto> findByNome(String nome);
}
