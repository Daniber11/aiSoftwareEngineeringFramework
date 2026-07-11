from fastapi.testclient import TestClient

from greeting_service.adapters.http import app

client = TestClient(app)


def test_health_responde_ok_con_version():
    res = client.get("/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert body["version"]


def test_greet_responde_el_saludo_localizado():
    res = client.get("/greet", params={"name": "Ada", "locale": "en"})
    assert res.status_code == 200
    assert res.json() == {"greeting": "Hello, Ada."}


def test_greet_sin_nombre_responde_400_con_error_opaco():
    res = client.get("/greet")
    assert res.status_code == 400
    assert "error" in res.json()


def test_greet_con_nombre_invalido_responde_400():
    res = client.get("/greet", params={"name": "<script>"})
    assert res.status_code == 400


def test_propaga_el_correlation_id_recibido():
    res = client.get("/health", headers={"x-correlation-id": "test-123"})
    assert res.headers["x-correlation-id"] == "test-123"
