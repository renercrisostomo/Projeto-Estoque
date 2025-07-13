package br.ifce.gestor_estoque.config;

import br.ifce.gestor_estoque.domain.estoque.EntradaProduto;
import br.ifce.gestor_estoque.domain.estoque.Fornecedor;
import br.ifce.gestor_estoque.domain.estoque.Produto;
import br.ifce.gestor_estoque.domain.estoque.SaidaProduto;
import br.ifce.gestor_estoque.domain.user.User;
import br.ifce.gestor_estoque.repositores.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProdutoRepository produtoRepository;
    private final FornecedorRepository fornecedorRepository;
    private final EntradaProdutoRepository entradaProdutoRepository;
    private final SaidaProdutoRepository saidaProdutoRepository;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           ProdutoRepository produtoRepository,
                           FornecedorRepository fornecedorRepository,
                           EntradaProdutoRepository entradaProdutoRepository,
                           SaidaProdutoRepository saidaProdutoRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.produtoRepository = produtoRepository;
        this.fornecedorRepository = fornecedorRepository;
        this.entradaProdutoRepository = entradaProdutoRepository;
        this.saidaProdutoRepository = saidaProdutoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@admin.com").isEmpty()) {
            User adminUser = new User();
            adminUser.setName("Admin User");
            adminUser.setEmail("admin@admin.com");
            adminUser.setPassword(passwordEncoder.encode("admin"));
            userRepository.save(adminUser);
            System.out.println("Created admin user with email: admin@admin.com and password: admin");
        }

        List<Fornecedor> fornecedores = fornecedorRepository.findAll();
        if (fornecedores.isEmpty()) {
            Fornecedor f1 = new Fornecedor();
            f1.setNome("Fornecedor Alpha");
            f1.setContatoNome("Carlos Alpha");
            f1.setContatoEmail("carlos.alpha@example.com");
            f1.setContatoTelefone("1111-1111");

            Fornecedor f2 = new Fornecedor();
            f2.setNome("Fornecedor Beta");
            f2.setContatoNome("Beatriz Beta");
            f2.setContatoEmail("beatriz.beta@example.com");
            f2.setContatoTelefone("2222-2222");

            fornecedores = fornecedorRepository.saveAll(Arrays.asList(f1, f2));
            System.out.println("Created sample suppliers.");
        }

        List<Produto> produtos = produtoRepository.findAll();
        if (produtos.isEmpty()) {
            Produto p1 = new Produto();
            p1.setNome("Notebook Gamer XYZ");
            p1.setDescricao("Notebook de alta performance para jogos");
            p1.setPreco(new BigDecimal("7500.00"));
            p1.setQuantidadeEstoque(75);
            p1.setUnidadeMedida("UN");

            Produto p2 = new Produto();
            p2.setNome("Mouse Sem Fio Ergonômico");
            p2.setDescricao("Mouse sem fio com design ergonômico para maior conforto");
            p2.setPreco(new BigDecimal("120.50"));
            p2.setQuantidadeEstoque(120);
            p2.setUnidadeMedida("UN");

            Produto p3 = new Produto();
            p3.setNome("Teclado Mecânico RGB");
            p3.setDescricao("Teclado mecânico com iluminação RGB customizável");
            p3.setPreco(new BigDecimal("350.00"));
            p3.setQuantidadeEstoque(90);
            p3.setUnidadeMedida("UN");

            Produto p4 = new Produto();
            p4.setNome("Monitor Ultrawide 34\"");
            p4.setDescricao("Monitor ultrawide de 34 polegadas para produtividade e jogos");
            p4.setPreco(new BigDecimal("2800.00"));
            p4.setQuantidadeEstoque(45);
            p4.setUnidadeMedida("UN");

            Produto p5 = new Produto();
            p5.setNome("SSD NVMe 1TB");
            p5.setDescricao("SSD NVMe de 1TB para alta velocidade de leitura e escrita");
            p5.setPreco(new BigDecimal("450.00"));
            p5.setQuantidadeEstoque(200);
            p5.setUnidadeMedida("UN");

            produtos = produtoRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5));
            System.out.println("Created sample products.");
        }

        if (entradaProdutoRepository.count() == 0 && !produtos.isEmpty() && !fornecedores.isEmpty()) {
            Produto p1 = produtos.stream().filter(p -> p.getNome().equals("Notebook Gamer XYZ")).findFirst().orElse(null);
            Produto p2 = produtos.stream().filter(p -> p.getNome().equals("Mouse Sem Fio Ergonômico")).findFirst().orElse(null);
            Fornecedor f1 = fornecedores.stream().filter(f -> f.getNome().equals("Fornecedor Alpha")).findFirst().orElse(null);

            if (p1 != null && f1 != null) {
                EntradaProduto entrada1 = new EntradaProduto();
                entrada1.setProduto(p1);
                entrada1.setFornecedor(f1);
                entrada1.setQuantidade(10);
                entrada1.setDataEntrada(LocalDate.now().minusDays(5));
                entrada1.setPrecoCusto(new BigDecimal("7000.00"));
                entrada1.setObservacao("Primeira remessa de notebooks");
                entradaProdutoRepository.save(entrada1);
                p1.setQuantidadeEstoque(p1.getQuantidadeEstoque() + entrada1.getQuantidade());
                produtoRepository.save(p1);
                System.out.println("Created sample entry for Notebook Gamer XYZ.");
            }

            if (p2 != null && f1 != null) {
                EntradaProduto entrada2 = new EntradaProduto();
                entrada2.setProduto(p2);
                entrada2.setFornecedor(f1);
                entrada2.setQuantidade(50);
                entrada2.setDataEntrada(LocalDate.now().minusDays(3));
                entrada2.setPrecoCusto(new BigDecimal("100.00"));
                entradaProdutoRepository.save(entrada2);
                p2.setQuantidadeEstoque(p2.getQuantidadeEstoque() + entrada2.getQuantidade());
                produtoRepository.save(p2);
                System.out.println("Created sample entry for Mouse Sem Fio Ergonômico.");
            }
        }

        if (saidaProdutoRepository.count() == 0 && !produtos.isEmpty()) {
            Produto p1 = produtos.stream().filter(p -> p.getNome().equals("Notebook Gamer XYZ")).findFirst().orElse(null);

            if (p1 != null && p1.getQuantidadeEstoque() >= 2) {
                SaidaProduto saida1 = new SaidaProduto();
                saida1.setProduto(p1);
                saida1.setQuantidade(2);
                saida1.setDataSaida(LocalDate.now().minusDays(1));
                saida1.setMotivo("Venda");
                saida1.setCliente("Cliente Exemplo A");
                saidaProdutoRepository.save(saida1);
                p1.setQuantidadeEstoque(p1.getQuantidadeEstoque() - saida1.getQuantidade());
                produtoRepository.save(p1);
                System.out.println("Created sample exit for Notebook Gamer XYZ.");
            }
        }
    }
}
