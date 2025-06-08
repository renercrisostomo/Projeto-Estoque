package br.ifce.gestor_estoque.listeners;

import br.ifce.gestor_estoque.domain.estoque.Produto;
import br.ifce.gestor_estoque.events.SaidaProdutoCriadaEvent;
import br.ifce.gestor_estoque.events.SaidaProdutoExcluidaEvent;
import br.ifce.gestor_estoque.events.SaidaProdutoAtualizadaEvent;
import br.ifce.gestor_estoque.repositores.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class SaidaProdutoEventListener {

    @Autowired
    private ProdutoRepository produtoRepository;

    @EventListener
    @Transactional
    public void handleSaidaProdutoCriada(SaidaProdutoCriadaEvent event) {
        Produto produto = event.getSaidaProduto().getProduto();
        int quantidade = event.getSaidaProduto().getQuantidade();
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - quantidade);
        produtoRepository.save(produto);
    }

    @EventListener
    @Transactional
    public void handleSaidaProdutoAtualizada(SaidaProdutoAtualizadaEvent event) {
        // This event listener will handle the stock adjustment when a saida is updated.
        // The SaidaProdutoService will publish this event with the *new* state of SaidaProduto.
        // It's assumed that the service has already reverted the stock from the *old* state of SaidaProduto.
        Produto produtoNovo = event.getSaidaProduto().getProduto();
        int quantidadeNova = event.getSaidaProduto().getQuantidade();
        produtoNovo.setQuantidadeEstoque(produtoNovo.getQuantidadeEstoque() - quantidadeNova);
        produtoRepository.save(produtoNovo);
    }

    @EventListener
    @Transactional
    public void handleSaidaProdutoExcluida(SaidaProdutoExcluidaEvent event) {
        Produto produto = event.getSaidaProduto().getProduto();
        int quantidade = event.getSaidaProduto().getQuantidade();
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + quantidade);
        produtoRepository.save(produto);
    }
}
