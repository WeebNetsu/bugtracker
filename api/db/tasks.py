from sqlalchemy import *

from db import Base, try_db_connect
from models import STATUS


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    # supabase has email and password details
    text = Column(String, nullable=False)
    # in progress / todo / completed
    status = Column(String, default=STATUS.TODO, nullable=False)
    # task description
    description = Column(String)
    # list of tags (their IDs) that are on this task
    tags = Column(ARRAY(Integer))
    # id of the user who created this task
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # project task belongs to
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)


try_db_connect(Base)
