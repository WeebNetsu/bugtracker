import sqlalchemy, time
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.declarative import declarative_base
from dotenv import dotenv_values

config = dotenv_values()

engine = sqlalchemy.create_engine(config["DATABASE_URL"])
Session = sessionmaker(bind=engine)
session = Session()
Base = declarative_base()


def try_db_connect(base, retries: int = 0) -> None:
    """
    Attempts connection to postgresql databse up to 5 times before failing.

    base -> declarative_base

    retries -> number of retries attempted
    """
    try:
        base.metadata.create_all(engine)
    except OperationalError as e:
        if retries < 5:
            print("Connection failed, retrying again in 5 seconds...")
            time.sleep(5)
            try_db_connect(base, retries + 1)
        else:
            print("Database Connection Refused: ", e)
    except Exception as e:
        print("Unknown Error: ", e)
