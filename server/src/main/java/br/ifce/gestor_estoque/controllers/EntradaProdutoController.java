package br.ifce.gestor_estoque.controllers;

import br.ifce.gestor_estoque.dto.MessageDTO;
import br.ifce.gestor_estoque.dto.estoque.EntradaProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.EntradaProdutoResponse;
import br.ifce.gestor_estoque.exceptions.BusinessException;
import br.ifce.gestor_estoque.exceptions.NotFoundException;
import br.ifce.gestor_estoque.services.EntradaProdutoService; // Import EntradaProdutoService
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/entradas")
public class EntradaProdutoController {

    @Autowired
    private EntradaProdutoService entradaProdutoService; // Use EntradaProdutoService

    @GetMapping
    public ResponseEntity<List<EntradaProdutoResponse>> listarTodas() {
        List<EntradaProdutoResponse> entradas = entradaProdutoService.listarTodas();
        if (entradas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(entradas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEntradaById(@PathVariable Long id) {
        Optional<EntradaProdutoResponse> entradaResponse = entradaProdutoService.getEntradaById(id);
        return entradaResponse.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Entrada de produto com ID " + id + " não encontrada.")));
    }

    @PostMapping
    public ResponseEntity<?> createEntrada(@Valid @RequestBody EntradaProdutoRequest request) {
        try {
            EntradaProdutoResponse novaEntrada = entradaProdutoService.createEntrada(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaEntrada);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDTO(e.getMessage()));
        } catch (BusinessException e) { // Though BusinessException is not explicitly thrown in current service version for create
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDTO(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEntrada(@PathVariable Long id, @Valid @RequestBody EntradaProdutoRequest request) {
        try {
            EntradaProdutoResponse entradaAtualizada = entradaProdutoService.updateEntrada(id, request);
            return ResponseEntity.ok(entradaAtualizada);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO(e.getMessage()));
        } catch (BusinessException e) { // Though BusinessException is not explicitly thrown in current service version for update
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDTO(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEntrada(@PathVariable Long id) {
        try {
            entradaProdutoService.deleteEntrada(id);
            return ResponseEntity.noContent().build();
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO(e.getMessage()));
        }
    }
}
