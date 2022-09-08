from sqlalchemy import *

from db import Base, try_db_connect


class Project(Base):
    """
    This is a table that contains details of specific projects for each
    user, so a user can have multiple projects
    """

    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    # project title
    title = Column(String(50), nullable=False)
    # project description
    description = Column(String)
    # this is the owner ID, the creator of the project
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # this is an array of user IDs, if a user ID is in here, they have
    # access to read the project content (but not modify)
    read_team = Column(ARRAY(String))
    # this is an array of user IDs, if a user ID is in here, they have
    # access to read and write the project content
    write_team = Column(ARRAY(String))
    # this is an array of user IDs, if a user ID is in here, they have
    # access to the project as admins, so they can remove other users, add
    # new users etc. They cannot remove the project owner
    admin_team = Column(ARRAY(String))


try_db_connect(Base)
