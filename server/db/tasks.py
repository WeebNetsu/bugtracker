from sqlalchemy import *

from db import Base, try_db_connect
from server.models import STATUS


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    # supabase has email and password details
    text = Column(String)
    # in progress / todo / completed
    status = Column(String, default=STATUS.TODO, nullable=False)
    # task description
    description = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))


try_db_connect(Base)
