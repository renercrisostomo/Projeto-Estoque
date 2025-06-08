package br.ifce.gestor_estoque.services.interfaces;

import br.ifce.gestor_estoque.dto.LoginRequestDTO;
import br.ifce.gestor_estoque.dto.RegisterRequestDTO;
import br.ifce.gestor_estoque.dto.ResponseDTO;

public interface IAuthService {
    ResponseDTO login(LoginRequestDTO body);
    ResponseDTO register(RegisterRequestDTO body);
}
