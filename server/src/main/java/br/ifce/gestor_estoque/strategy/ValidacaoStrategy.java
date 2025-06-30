package br.ifce.gestor_estoque.strategy;

import br.ifce.gestor_estoque.domain.estoque.MovimentacaoEstoque;

public interface ValidacaoStrategy<T extends MovimentacaoEstoque> {
    void validar(T movimentacao) throws Exception;
}
