package br.ifce.gestor_estoque.dto.estoque;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

// DTO para requisições de criação e atualização de Produto
public class ProdutoRequest {
    @NotBlank(message = "O nome do produto não pode estar em branco")
    @Size(max = 255, message = "O nome do produto deve ter no máximo 255 caracteres")
    public String nome;

    @Size(max = 500, message = "A descrição do produto deve ter no máximo 500 caracteres")
    public String descricao;

    @NotNull(message = "O preço não pode ser nulo")
    @PositiveOrZero(message = "O preço deve ser zero ou positivo")
    public BigDecimal preco;

    @NotNull(message = "A quantidade em estoque não pode ser nula")
    @PositiveOrZero(message = "A quantidade em estoque deve ser zero ou positiva")
    public Integer quantidadeEstoque;

    @NotBlank(message = "A unidade de medida não pode estar em branco")
    @Size(max = 50, message = "A unidade de medida deve ter no máximo 50 caracteres")
    public String unidadeMedida;
    
    public Long fornecedorId; // ID do fornecedor associado
}
