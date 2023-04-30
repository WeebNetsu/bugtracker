from fastapi.testclient import TestClient

from .. import app

client = TestClient(app)

USER_ID = "8325c33e-eab8-460e-9202-030cbda90c64"
""" Supabase ID of user in datbase to test against """
