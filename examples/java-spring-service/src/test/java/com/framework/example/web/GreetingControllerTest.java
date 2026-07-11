package com.framework.example.web;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Prueba de integración real: levanta el contexto de Spring Boot en un
 * puerto efímero y hace peticiones HTTP reales, igual que server.test.ts
 * en examples/minimal-service y typescript-node-service.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class GreetingControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String url(String path) {
        return "http://localhost:" + port + path;
    }

    @Test
    void healthRespondeOkConVersion() {
        ResponseEntity<java.util.Map> res = restTemplate.getForEntity(url("/health"), java.util.Map.class);
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).containsEntry("status", "ok").containsKey("version");
    }

    @Test
    void greetRespondeElSaludoLocalizado() {
        ResponseEntity<java.util.Map> res =
                restTemplate.getForEntity(url("/greet?name=Ada&locale=en"), java.util.Map.class);
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(res.getBody()).containsEntry("greeting", "Hello, Ada.");
    }

    @Test
    void greetSinNombreResponde400ConErrorOpaco() {
        ResponseEntity<java.util.Map> res = restTemplate.getForEntity(url("/greet"), java.util.Map.class);
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(res.getBody()).containsKey("error");
    }

    @Test
    void greetConNombreInvalidoResponde400() {
        ResponseEntity<java.util.Map> res =
                restTemplate.getForEntity(url("/greet?name=%3Cscript%3E"), java.util.Map.class);
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
