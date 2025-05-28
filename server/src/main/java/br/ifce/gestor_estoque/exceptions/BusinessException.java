package br.ifce.gestor_estoque.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST) // Ou outro status apropriado, como UNPROCESSABLE_ENTITY
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
