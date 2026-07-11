package com.framework.example.domain;

/** Error de negocio: entrada inválida según las reglas del dominio de saludo. */
public class GreetingException extends RuntimeException {
    public GreetingException(String message) {
        super(message);
    }
}
