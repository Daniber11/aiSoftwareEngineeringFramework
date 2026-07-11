package com.framework.example.web;

import com.framework.example.domain.Greeting;
import com.framework.example.domain.GreetingException;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Adaptador HTTP: validación en el borde delegada al dominio, logs
 * estructurados con correlation ID. Mismo contrato observable que
 * examples/minimal-service para que los ejemplos sean comparables.
 */
@RestController
public class GreetingController {

    private static final org.slf4j.Logger LOG = org.slf4j.LoggerFactory.getLogger(GreetingController.class);
    private static final String VERSION = "1.0.0";

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "version", VERSION);
    }

    @GetMapping("/greet")
    public ResponseEntity<Map<String, String>> greet(
            @RequestParam(required = false) String name,
            @RequestParam(required = false, defaultValue = "es") String locale) {
        String correlationId = UUID.randomUUID().toString();
        try {
            String greeting = Greeting.build(name, locale);
            log(correlationId, "info", 200);
            return ResponseEntity.ok(Map.of("greeting", greeting));
        } catch (GreetingException e) {
            log(correlationId, "info", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    private void log(String correlationId, String level, int status) {
        LOG.info(
                "{\"timestamp\":\"{}\",\"level\":\"{}\",\"service\":\"java-spring-service\",\"version\":\"{}\","
                        + "\"correlationId\":\"{}\",\"status\":{}}",
                Instant.now(),
                level,
                VERSION,
                correlationId,
                status);
    }
}
