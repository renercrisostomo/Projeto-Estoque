package br.ifce.gestor_estoque.strategy;

import br.ifce.gestor_estoque.domain.estoque.SaidaProduto;
import br.ifce.gestor_estoque.exceptions.BusinessException;

public class ValidacaoSaidaStrategy implements ValidacaoStrategy<SaidaProduto> {
    @Override
    public void validar(SaidaProduto saida) throws BusinessException {
        if (saida.getProduto() == null) {
            throw new BusinessException("Produto não pode ser nulo na saída.");
        }
        if (saida.getQuantidade() <= 0) {
            throw new BusinessException("Quantidade da saída deve ser positiva.");
        }
        if (saida.getDataMovimentacao() == null) {
            throw new BusinessException("Data da saída não pode ser nula.");
        }
        if (saida.getProduto().getQuantidadeEstoque() < saida.getQuantidade()) {
            throw new BusinessException("Quantidade em estoque insuficiente para a saída.");
        }
    }
}
