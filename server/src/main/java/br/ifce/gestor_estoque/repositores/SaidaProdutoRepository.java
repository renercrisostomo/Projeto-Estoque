package br.ifce.gestor_estoque.repositores;

import br.ifce.gestor_estoque.domain.estoque.SaidaProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface SaidaProdutoRepository extends JpaRepository<SaidaProduto, Long> {
    // Método para dashboard - contar saídas a partir de uma data
    @Query("SELECT COUNT(s) FROM SaidaProduto s WHERE s.dataMovimentacao >= :data")
    long countByDataMovimentacaoGreaterThanEqual(@Param("data") LocalDate data);
}
