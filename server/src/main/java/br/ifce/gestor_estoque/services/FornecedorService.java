package br.ifce.gestor_estoque.services;

import br.ifce.gestor_estoque.domain.estoque.Fornecedor;
import br.ifce.gestor_estoque.exceptions.NotFoundException;
import br.ifce.gestor_estoque.repositores.FornecedorRepository;
import br.ifce.gestor_estoque.services.interfaces.IFornecedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FornecedorService implements IFornecedorService {

    @Autowired
    private FornecedorRepository fornecedorRepository;

    @Override
    public List<Fornecedor> listarTodos() {
        return fornecedorRepository.findAll();
    }

    @Override
    public Optional<Fornecedor> obterPorId(Long id) {
        return fornecedorRepository.findById(id);
    }

    @Override
    @Transactional
    public Fornecedor criar(Fornecedor fornecedor) {
        return fornecedorRepository.save(fornecedor);
    }

    @Override
    @Transactional
    public Fornecedor atualizar(Long id, Fornecedor fornecedorAtualizado) {
        Fornecedor fornecedorExistente = fornecedorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Fornecedor com ID " + id + " não encontrado para atualização."));

        fornecedorExistente.setNome(fornecedorAtualizado.getNome());
        fornecedorExistente.setContatoNome(fornecedorAtualizado.getContatoNome());
        fornecedorExistente.setContatoEmail(fornecedorAtualizado.getContatoEmail());
        fornecedorExistente.setContatoTelefone(fornecedorAtualizado.getContatoTelefone());

        return fornecedorRepository.save(fornecedorExistente);
    }

    @Override
    @Transactional
    public boolean deletar(Long id) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Fornecedor com ID " + id + " não encontrado para exclusão."));

        fornecedorRepository.delete(fornecedor);
        return true;
    }
}
