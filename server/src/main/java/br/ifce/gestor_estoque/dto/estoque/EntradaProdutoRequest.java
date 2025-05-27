package br.ifce.gestor_estoque.dto.estoque;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PastOrPresent;
import java.math.BigDecimal;
import java.time.LocalDate;

public class EntradaProdutoRequest {

    @NotNull(message = "O ID do produto não pode ser nulo")
    public Long produtoId;

    @NotNull(message = "O ID do fornecedor não pode ser nulo")
    public Long fornecedorId;

    @NotNull(message = "A quantidade não pode ser nula")
    @Positive(message = "A quantidade deve ser positiva")
    public Integer quantidade;

    @NotNull(message = "A data de entrada não pode ser nula")
    @PastOrPresent(message = "A data de entrada não pode ser futura")
    public LocalDate dataEntrada;

    // O preço de custo é opcional no request, pode ser nulo
    public BigDecimal precoCusto;

    public String observacao;
}
