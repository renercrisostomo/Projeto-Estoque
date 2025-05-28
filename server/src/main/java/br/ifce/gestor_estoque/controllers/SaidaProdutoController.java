package br.ifce.gestor_estoque.controllers;

import br.ifce.gestor_estoque.dto.MessageDTO;
import br.ifce.gestor_estoque.dto.estoque.SaidaProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.SaidaProdutoResponse;
import br.ifce.gestor_estoque.exceptions.BusinessException;
import br.ifce.gestor_estoque.exceptions.NotFoundException;
import br.ifce.gestor_estoque.services.SaidaProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/saidas")
public class SaidaProdutoController {

    @Autowired
    private SaidaProdutoService saidaProdutoService;

    @GetMapping
    public ResponseEntity<List<SaidaProdutoResponse>> listarTodas() {
        List<SaidaProdutoResponse> saidas = saidaProdutoService.listarTodas();
        if (saidas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(saidas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSaidaById(@PathVariable Long id) {
        Optional<SaidaProdutoResponse> saidaResponse = saidaProdutoService.getSaidaById(id);
        return saidaResponse.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Saída de produto com ID " + id + " não encontrada.")));
    }

    @PostMapping
    public ResponseEntity<?> createSaida(@Valid @RequestBody SaidaProdutoRequest request) {
        try {
            SaidaProdutoResponse novaSaida = saidaProdutoService.createSaida(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaSaida);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDTO(e.getMessage()));
        } catch (BusinessException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDTO(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSaida(@PathVariable Long id, @Valid @RequestBody SaidaProdutoRequest request) {
        try {
            SaidaProdutoResponse saidaAtualizada = saidaProdutoService.updateSaida(id, request);
            return ResponseEntity.ok(saidaAtualizada);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO(e.getMessage()));
        } catch (BusinessException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDTO(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSaida(@PathVariable Long id) {
        try {
            boolean deletado = saidaProdutoService.deleteSaida(id);
            if (deletado) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Recurso não encontrado ou não pôde ser excluído."));
        } catch (NotFoundException e) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO(e.getMessage()));
        }
    }
}
