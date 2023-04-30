import uuid
from . import USER_ID, client


URL = "/projects"

# todo getting database connection error?
def test_create_project():
    # uuid to not have non-allowed duplicate values in db during testing
    rand_id = uuid.uuid4()
    response = client.post(
        f"{URL}",
        json={
            "userId": USER_ID,
            "title": f"test {rand_id}",
            "description": "This is a test project.",
            # todo add teams
            "read_team": [],
            "write_team": [],
            "admin_team": [],
        },
    )

    assert response.status_code == 200
    print(response.json())
    # assert response.json() == {"msg": "Hello World"}
