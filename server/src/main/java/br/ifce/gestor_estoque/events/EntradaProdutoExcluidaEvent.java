package br.ifce.gestor_estoque.events;

import br.ifce.gestor_estoque.domain.estoque.EntradaProduto;

public class EntradaProdutoExcluidaEvent {
    private final EntradaProduto entradaProduto; // The state BEFORE deletion

    public EntradaProdutoExcluidaEvent(EntradaProduto entradaProduto) {
        this.entradaProduto = entradaProduto;
    }

    public EntradaProduto getEntradaProduto() {
        return entradaProduto;
    }
}
