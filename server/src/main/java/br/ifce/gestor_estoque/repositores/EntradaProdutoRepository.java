package br.ifce.gestor_estoque.repositores;

import br.ifce.gestor_estoque.domain.estoque.EntradaProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface EntradaProdutoRepository extends JpaRepository<EntradaProduto, Long> {
    // Método para dashboard - contar entradas a partir de uma data
    @Query("SELECT COUNT(e) FROM EntradaProduto e WHERE e.dataMovimentacao >= :data")
    long countByDataMovimentacaoGreaterThanEqual(@Param("data") LocalDate data);
}
