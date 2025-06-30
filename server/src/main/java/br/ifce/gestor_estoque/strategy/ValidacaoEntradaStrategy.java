package br.ifce.gestor_estoque.strategy;

import br.ifce.gestor_estoque.domain.estoque.EntradaProduto;
import br.ifce.gestor_estoque.exceptions.BusinessException;

public class ValidacaoEntradaStrategy implements ValidacaoStrategy<EntradaProduto> {
    @Override
    public void validar(EntradaProduto entrada) throws BusinessException {
        if (entrada.getProduto() == null) {
            throw new BusinessException("Produto não pode ser nulo na entrada.");
        }
        if (entrada.getFornecedor() == null) {
            throw new BusinessException("Fornecedor não pode ser nulo na entrada.");
        }
        if (entrada.getQuantidade() <= 0) {
            throw new BusinessException("Quantidade da entrada deve ser positiva.");
        }
        if (entrada.getDataMovimentacao() == null) {
            throw new BusinessException("Data da entrada não pode ser nula.");
        }
    }
}
