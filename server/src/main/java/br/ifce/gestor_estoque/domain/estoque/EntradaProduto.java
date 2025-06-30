package br.ifce.gestor_estoque.domain.estoque;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
public class EntradaProduto extends MovimentacaoEstoque {


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fornecedor_id")
    @NotNull(message = "O fornecedor não pode ser nulo")
    private Fornecedor fornecedor;

    @Column(precision = 10, scale = 2)
    private BigDecimal precoCusto;
    
    public java.time.LocalDate getDataEntrada() {
        return getDataMovimentacao();
    }

    /**
     * Define a data de entrada do produto.
     * A data de entrada não pode ser nula.
     * @param dataEntrada a nova data de entrada.
     * @throws IllegalArgumentException se a data de entrada for nula.
     */
    public void setDataEntrada(java.time.LocalDate dataEntrada) {
        if (dataEntrada == null) {
            throw new IllegalArgumentException("A data de entrada não pode ser nula.");
        }
        this.setDataMovimentacao(dataEntrada);
    }

    /**
     * Retorna o fornecedor associado a esta entrada.
     * @return o fornecedor.
     */
    public Fornecedor getFornecedor() {
        return fornecedor;
    }

    /**
     * Define o fornecedor associado a esta entrada.
     * O fornecedor não pode ser nulo.
     * @param fornecedor o fornecedor a ser associado.
     * @throws IllegalArgumentException se o fornecedor for nulo.
     */
    public void setFornecedor(Fornecedor fornecedor) {
        if (fornecedor == null) {
            throw new IllegalArgumentException("O fornecedor não pode ser nulo.");
        }
        this.fornecedor = fornecedor;
    }

    /**
     * Retorna o preço de custo unitário do produto no momento da entrada.
     * @return o preço de custo.
     */
    public BigDecimal getPrecoCusto() {
        return precoCusto;
    }

    /**
     * Define o preço de custo unitário do produto no momento da entrada.
     * @param precoCusto o novo preço de custo.
     */
    public void setPrecoCusto(BigDecimal precoCusto) {
        this.precoCusto = precoCusto;
    }

    /**
     * Calcula o valor total da entrada.
     * @return O valor total (quantidade * precoCusto). Retorna BigDecimal.ZERO se precoCusto ou quantidade for nulo.
     */
    public BigDecimal calcularValorTotalEntrada() {
        if (this.getQuantidade() == null || this.precoCusto == null) {
            return BigDecimal.ZERO;
        }
        return this.precoCusto.multiply(new BigDecimal(this.getQuantidade()));
    }

    // hashCode, equals, and toString methods should be reviewed if they exist
    // For example, if they use inherited fields, they might need adjustments or can be inherited/generated.
}
