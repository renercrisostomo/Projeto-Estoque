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
        // Usando o método de domínio para saída de estoque
        produto.saidaEstoque(quantidade);
        produtoRepository.save(produto);
    }

    @EventListener
    @Transactional
    public void handleSaidaProdutoAtualizada(SaidaProdutoAtualizadaEvent event) {
        // O SaidaProdutoService já reverteu o estoque do produto antigo.
        // Este listener aplica a saída ao novo produto (ou ao mesmo produto, se não mudou).
        Produto produtoNovo = event.getSaidaProduto().getProduto();
        int quantidadeNova = event.getSaidaProduto().getQuantidade();
        // Usando o método de domínio para saída de estoque
        produtoNovo.saidaEstoque(quantidadeNova);
        produtoRepository.save(produtoNovo);
    }

    @EventListener
    @Transactional
    public void handleSaidaProdutoExcluida(SaidaProdutoExcluidaEvent event) {
        Produto produto = event.getSaidaProduto().getProduto();
        int quantidade = event.getSaidaProduto().getQuantidade();
        // Usando o método de domínio para entrada de estoque (reversão da saída)
        produto.entradaEstoque(quantidade);
        produtoRepository.save(produto);
    }
}
