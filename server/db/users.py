from sqlalchemy import *

from db import Base, try_db_connect


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    # supabase has email and password details
    supabaseId = Column(String)
    username = Column(String(50))


try_db_connect(Base)
