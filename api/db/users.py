from sqlalchemy import *

from db import Base, try_db_connect


class User(Base):
    """
    User table in database.
    Supabase contains the user email and password
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    supabase_id = Column(String)
    username = Column(String(50))


try_db_connect(Base)
