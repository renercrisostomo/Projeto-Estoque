package br.ifce.gestor_estoque.events;

import br.ifce.gestor_estoque.domain.estoque.EntradaProduto;

public class EntradaProdutoCriadaEvent {
    private final EntradaProduto entradaProduto;

    public EntradaProdutoCriadaEvent(EntradaProduto entradaProduto) {
        this.entradaProduto = entradaProduto;
    }

    public EntradaProduto getEntradaProduto() {
        return entradaProduto;
    }
}
