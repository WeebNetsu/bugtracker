from sqlalchemy import *

from db import Base, try_db_connect


class LoginToken(Base):
    """
    Token used to store login credentials are stored here
    """

    __tablename__ = "login_tokens"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    token = Column(String)


try_db_connect(Base)
