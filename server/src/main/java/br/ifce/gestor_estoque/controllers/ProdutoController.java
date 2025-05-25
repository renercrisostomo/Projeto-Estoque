package br.ifce.gestor_estoque.controllers;

import br.ifce.gestor_estoque.domain.estoque.Fornecedor;
import br.ifce.gestor_estoque.domain.estoque.Produto;
import br.ifce.gestor_estoque.dto.estoque.ProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.ProdutoResponse;
import br.ifce.gestor_estoque.repositores.FornecedorRepository;
import br.ifce.gestor_estoque.repositores.ProdutoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    ProdutoRepository produtoRepository;

    @Autowired
    FornecedorRepository fornecedorRepository;

    @GetMapping
    public ResponseEntity<List<ProdutoResponse>> listarTodos() {
        List<ProdutoResponse> produtos = produtoRepository.findAll().stream()
                .map(ProdutoResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponse> getProdutoById(@PathVariable Long id) {
        return produtoRepository.findById(id)
                .map(produto -> ResponseEntity.ok(new ProdutoResponse(produto)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createProduto(@Valid @RequestBody ProdutoRequest produtoRequest) { // Changed to ResponseEntity<?> for mixed return types
        Fornecedor fornecedor = fornecedorRepository.findById(produtoRequest.fornecedorId)
                .orElse(null); // Get Fornecedor or null

        if (fornecedor == null && produtoRequest.fornecedorId != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Fornecedor com ID " + produtoRequest.fornecedorId + " não encontrado.");
        }

        Produto produto = new Produto();
        produto.setNome(produtoRequest.nome);
        produto.setDescricao(produtoRequest.descricao);
        produto.setPreco(produtoRequest.preco);
        produto.setQuantidadeEstoque(produtoRequest.quantidadeEstoque);
        produto.setUnidadeMedida(produtoRequest.unidadeMedida);
        produto.setFornecedor(fornecedor); // Set Fornecedor (can be null if fornecedorId was null)

        Produto novoProduto = produtoRepository.save(produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ProdutoResponse(novoProduto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduto(@PathVariable Long id, @Valid @RequestBody ProdutoRequest produtoRequest) { // Changed to ResponseEntity<?> for mixed return types
        return produtoRepository.findById(id)
                .map(produto -> {
                    Fornecedor fornecedor = null;
                    if (produtoRequest.fornecedorId != null) {
                        fornecedor = fornecedorRepository.findById(produtoRequest.fornecedorId)
                                .orElse(null);
                        if (fornecedor == null) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body("Fornecedor com ID " + produtoRequest.fornecedorId + " não encontrado para atualização do produto.");
                        }
                    }

                    produto.setNome(produtoRequest.nome);
                    produto.setDescricao(produtoRequest.descricao);
                    produto.setPreco(produtoRequest.preco);
                    produto.setQuantidadeEstoque(produtoRequest.quantidadeEstoque);
                    produto.setUnidadeMedida(produtoRequest.unidadeMedida);
                    produto.setFornecedor(fornecedor);

                    Produto produtoAtualizado = produtoRepository.save(produto);
                    return ResponseEntity.ok(new ProdutoResponse(produtoAtualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduto(@PathVariable Long id) {
        return produtoRepository.findById(id)
                .map(produto -> {
                    produtoRepository.delete(produto);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
