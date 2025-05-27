package br.ifce.gestor_estoque.dto.estoque;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class SaidaProdutoRequest {

    @NotNull(message = "O ID do produto não pode ser nulo")
    public Long produtoId;

    @NotNull(message = "A quantidade não pode ser nula")
    @Positive(message = "A quantidade deve ser positiva")
    public Integer quantidade;

    @NotNull(message = "A data de saída não pode ser nula")
    @PastOrPresent(message = "A data de saída não pode ser futura")
    public LocalDate dataSaida;

    @Size(max = 255, message = "O motivo deve ter no máximo 255 caracteres")
    public String motivo;

    @Size(max = 255, message = "O cliente deve ter no máximo 255 caracteres")
    public String cliente;

    public String observacao;
}
