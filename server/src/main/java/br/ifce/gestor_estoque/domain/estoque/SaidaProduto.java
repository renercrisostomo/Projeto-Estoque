package br.ifce.gestor_estoque.domain.estoque;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
public class SaidaProduto extends MovimentacaoEstoque { // Extends MovimentacaoEstoque

    // Id, produto, quantidade, observacao are inherited
    // dataSaida will be mapped to dataMovimentacao

    @Size(max = 255, message = "O motivo deve ter no máximo 255 caracteres")
    private String motivo; // Ex: Venda, Perda, Ajuste

    @Size(max = 255, message = "O cliente deve ter no máximo 255 caracteres")
    private String cliente; // Opcional, para quem foi a saída

    // Getters e Setters for inherited fields are in MovimentacaoEstoque

    /**
     * Retorna a data de saída do produto.
     * @return a data de saída.
     */
    public java.time.LocalDate getDataSaida() {
        return getDataMovimentacao();
    }

    /**
     * Define a data de saída do produto.
     * A data de saída não pode ser nula.
     * @param dataSaida a nova data de saída.
     * @throws IllegalArgumentException se a data de saída for nula.
     */
    public void setDataSaida(java.time.LocalDate dataSaida) {
        if (dataSaida == null) {
            throw new IllegalArgumentException("A data de saída não pode ser nula.");
        }
        this.setDataMovimentacao(dataSaida);
    }

    /**
     * Retorna o motivo da saída do produto.
     * @return o motivo da saída.
     */
    public String getMotivo() {
        return motivo;
    }

    /**
     * Define o motivo da saída do produto.
     * O motivo pode ter no máximo 255 caracteres.
     * @param motivo o motivo da saída.
     */
    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    /**
     * Retorna o cliente para quem o produto foi destinado na saída.
     * @return o cliente.
     */
    public String getCliente() {
        return cliente;
    }

    /**
     * Define o cliente para quem o produto foi destinado na saída.
     * O cliente pode ter no máximo 255 caracteres.
     * @param cliente o cliente.
     */
    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    // hashCode, equals, and toString methods should be reviewed if they exist
    // For example, if they use inherited fields, they might need adjustments or can be inherited/generated.
}
