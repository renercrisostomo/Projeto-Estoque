package br.ifce.gestor_estoque.controllers;

import br.ifce.gestor_estoque.dto.MessageDTO;
import br.ifce.gestor_estoque.dto.estoque.ProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.ProdutoResponse;
import br.ifce.gestor_estoque.services.ProdutoService; // Import ProdutoService
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService; // Use ProdutoService

    @GetMapping
    public ResponseEntity<List<ProdutoResponse>> listarTodos() {
        List<ProdutoResponse> produtos = produtoService.listarTodos();
        if (produtos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProdutoById(@PathVariable Long id) {
        Optional<ProdutoResponse> produtoResponse = produtoService.getProdutoById(id);
        if (produtoResponse.isPresent()) {
            return ResponseEntity.ok(produtoResponse.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Produto com ID " + id + " não encontrado."));
    }

    @PostMapping
    public ResponseEntity<ProdutoResponse> createProduto(@Valid @RequestBody ProdutoRequest produtoRequest) {
        ProdutoResponse novoProduto = produtoService.createProduto(produtoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProduto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduto(@PathVariable Long id, @Valid @RequestBody ProdutoRequest produtoRequest) {
        Optional<ProdutoResponse> produtoAtualizado = produtoService.updateProduto(id, produtoRequest);
        if (produtoAtualizado.isPresent()) {
            return ResponseEntity.ok(produtoAtualizado.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Produto com ID " + id + " não encontrado para atualização."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduto(@PathVariable Long id) {
        boolean deletado = produtoService.deleteProduto(id);
        if (deletado) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Produto com ID " + id + " não encontrado para exclusão."));
    }
}
