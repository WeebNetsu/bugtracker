from . import client


URL = "/projects"


def test_create_project():
    response = client.post(f"{URL}")
    assert response.status_code == 200
    # assert response.json() == {"msg": "Hello World"}
