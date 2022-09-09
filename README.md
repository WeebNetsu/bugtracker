# Bug Tracker App

This is a simple basic bug tracker app inspired by Trello & ClickUp... We use Supabase for file storage and user signup!

---

<!-- NOTE: I'm currently busy implementing a server, tracker will be wonky until switch from JSON-server to FastAPI has been completed. For a working example, go to commit: [9e438b607f7cef298c17deec07f8bbb68d4c3cd4](https://github.com/WeebNetsu/bugtracker/commit/9e438b607f7cef298c17deec07f8bbb68d4c3cd4) -->

## Requirements

- Python 3.10+ (and PIP)
- Node.js 16.0+
- MongoDB 5.0+

## ENV Variables

CLIENT:

```
REACT_APP_API_URL=http://localhost:8000
<!--
    These supabase values are save on the client as long as you
    have row level security (RLS) enabled on Supabase
 -->
REACT_APP_SUPABASE_URL=SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY=SUPABASE_ANON_KEY
```

API:

```
DATABASE_URL="postgresql://postgres:postgres@db:5432/bug-tracker"
```

## Run App:

### Install All Deps

`npm run install:all`

### Run

`npm start`

### Using Docker

#### Windows

docker-compose up -d

NOTE: to find your IP, use ipconfig, example: your ip
e.g. http://172.71.17.1:8000/docs
the inserted IP is IP4 Address

#### Linux

sudo docker-compose up -d

Open localhost:8000/docs in your browser

### Checking Logs

`docker-compose logs`

## Database

### Generating a New Database

To generate a new database (delete old data, this could fix some database bugs), delete the `pgdata` folder and rebuild the container.

### Viewing databases

If the container is running, then you can navigate to `localhost:16543` in your browser.

Credentials:

- email: admin@gmail.com
- password: admin

For more help: https://onexlab-io.medium.com/docker-compose-postgres-initdb-ba0021deef76

#### Connecting Database to SQL Admin

**You can view the database and tables with the sql admin dashboard, first find your local ip address (hostname used to connect) (on Linux you can use `ip addr`, yours should be similar to `192.168.122.1`)**

Steps:

1. Right click on `Servers` > `Register` > `Server...`
1. Add any name you want
1. Select `Connection`
1. Host (Similar to `192.168.122.1`)
1. Port: `5432`
1. Maintenance Database: `bug-tracker`
1. Username: `postgres`
1. Password: `postgres`

Bob's your uncle! You are connected!

## Running Migrations

Running migrations allows us to fix any changes made to the database without having to drop all the tables and rebuild it!

### Steps:

1. Connect to the API docker instance `docker exec -it bug-tracker-api-1 /bin/sh`, this will put you inside the container (like using it as the computer)
1. Run your, create migration, upgrade or downgrade!
   .5 **If this is your first time**, make sure to run the first migrations to get the latest version of the db! `alembic upgrade head`. (**NOTE: If this is the first time you're starting up the application, running migrations will most likely cause errors, just remove all the "add_column" functions in the migration files, because [alembic does not cover the first run case](https://stackoverflow.com/a/46463471/15586166).**)

### Creating Migrations

For more information on alembic and migrations:

- [Database Migrations](https://www.youtube.com/watch?v=x96OwF3jQrg)
- [Alembic](https://alembic.sqlalchemy.org)
- [Alembic Setup and Usage](https://youtu.be/SdcH6IEi6nE)

**NOTE: If you create a new table, or remove an old one, remember to add/remove the import in `migrations/env.py`!**

_NOTE: Now that we use migrations, you don't have to delete `pgdata/` anymore, unless you want to clear your database_

Whenever you change the database (add/remove/modify a field), you should create a migration for us to use.

#### Steps:

1. Be inside your container (`docker exec -it bug-tracker-api-1 /bin/sh`)
1. create a new revision of the database for us to use `alembic revision --autogenerate -m "What you changed"`
1. Upgrade to the new revision `alembic upgrade +1`

### Downgrading Migration

Sometimes you realise creating a revision was not a good idea, you changed something you didn't want to have changed in the first place. Luckily alembic got you covered!

#### Steps:

1. Be inside your container (`docker exec -it bug-tracker-api-1 /bin/sh`)
1. Downgrade to the previous revision `alembic downgrade -1` OR downgrade to a specific revision `alembic downgrade abcdef` (abcdef is refering to the first 6 letters/numbers of the revision you want to downgrade to, just look at the file name)

### NOTES:

If you update the database name or connection URL, be sure to update `sqlalchemy.url = postgresql://postgres:postgres@db:5432/bug-tracker` in **alembic.ini**.

## Tests

Tests use Pytest to run, the inital setup is in tests.py with the tests going inside the `api/tests` directory. Each file that should be tested should start with "test" (ie. _test_projects.py_), and all the functions (route tests) that should be ran should also start with "test" (ie. _test_create_project_), if a file or function does not start with test, it will be ignored when running tests.

### Running Tests

Inside the **api folder**, to run tests, just execute `python tests.py`, and it will spend 51 years running a single test.

![This will take us 51 years meme](docs/src/images/maneuver.jpg)

## View API Docs

`http://localhost:8000/docs` or `http://localhost:8000/redoc`

## Project Structure

### Client

```
├── api -> API communications (requests/axios)
├── components -> Components that will be used globally
├── models -> Structures for types in code
├── slices -> Redux slices
├── supabase -> Supabase configurations
├── utils -> Extra functions that can be useful
└── views -> Pages
```

### API

```
├── db -> Database structure and management
├── migrations -> Database migrations happen here
├── models -> All request/response structures
├── routes -> All API routes
├── tests -> Tests that can be ran
└── utils -> Extra functions and classes that can be useful
```

## Helpful Links

**Supabase:** https://supabase.com/docs
**FastAPI:** https://fastapi.tiangolo.com
