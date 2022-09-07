from sqlalchemy import *

from db import Base, try_db_connect


class Tag(Base):
    """
    This is a table that contains all the task tags that can be used on
    a project.
    """

    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    # tag title
    title = Column(String(15), nullable=False)
    # optional tag description
    description = Column(String)
    # the tag color in hex
    color = Column(String(6), nullable=False)
    # the project this tag belongs to
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)


try_db_connect(Base)
