# Bug Tracker App

This is a bug tracker app inspired by Trello & ClickUp... We use Supabase for file storage and user auth, PostgreSQL for storing data, FastAPI for our API and React.js (TypeScript) as our frontend!

[<img alt="Next.js" src="https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=Next.js&logoColor=white" />](https://nextjs.org)
[<img alt="Supabase" src="https://img.shields.io/badge/-Supabase-33A870?style=flat-square&logo=Supabase&logoColor=white" />](https://supabase.com)
[<img alt="MongoDB" src="https://img.shields.io/badge/-MongoDB-116149?style=flat-square&logo=MongoDB&logoColor=white" />](https://www.mongodb.com)
[<img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-0077C7?style=flat-square&logo=TypeScript&logoColor=white" />](https://www.typescriptlang.org/)
[<img alt="Docker" src="https://img.shields.io/badge/-Docker-003f8c?style=flat-square&logo=Docker&logoColor=white" />](https://www.docker.com)
[<img alt="AntDesign" src="https://img.shields.io/badge/-Ant Design-3987ff?style=flat-square&logo=AntDesign&logoColor=white" />](https://ant.design)

---

<!-- NOTE: I'm currently busy implementing a server, tracker will be wonky until switch from JSON-server to FastAPI has been completed. For a working example, go to commit: [9e438b607f7cef298c17deec07f8bbb68d4c3cd4](https://github.com/WeebNetsu/bugtracker/commit/9e438b607f7cef298c17deec07f8bbb68d4c3cd4) -->

## Contents

-   [Requirements](#requirements)
-   [Env Variables](#env-variables)
-   [Run App](#run-app)
    -   [Installing Dependencies](#install-all-deps)
    -   [Running App](#run)
    -   [Using Docker (Recommended)](#using-docker)
    -   [Checking Logs](#checking-logs)
-   [Project Structure](#project-structure)
-   [Helpful Links](#helpful-links)
-   [Support Me](#support)
-   [Changelog](#changelog)

---

## Requirements

-   Node.js 16.0+
-   MongoDB 5+

## ENV Variables

Add your variables to a `.env.local` file:

```
MONGO_URL=MONGO_URL=mongodb://localhost:27017

NEXT_PUBLIC_SUPABASE_URL=https://whatever.supabase.co

NEXT_PUBLIC_SUPABASE_KEY=averylonganonkeythatissafetoshowontheui
```

## Run App:

### Install All Deps

`npm i`

### Run

`npm start` - Note that using docker is the preferred method to run this app.

### Using Docker

Note that docker will only run the database.

`docker-compose up -d`

<!-- -   Client: http://localhost:3000 -->

-   MongoDB: mongodb://localhost:27017
<!-- -   Portainer: https://localhost:9443 -->

### Checking Logs

`docker-compose logs`

These logs will contain all the logs from the client, api and database viewer, you can use `grep` to filter commands, such as `sudo docker-compose logs | grep -i "bug-tracker-db-1"`. To remove a specific result from the logs, you can use `sudo docker-compose logs | grep -wv "bug-tracker-pgadmin-compose-1"`, this will hide the logs that contains the text in the quotes.

## Project Structure

```
├── mongo - Dockers MongoDB storage
└── src - Site source code
    ├── constants - All site constants
    ├── db - Database connection and collections
    ├── models - TypeScript data models
    ├── pages - Site UI
    ├── styles - Site styling
    ├── types - Custom project types
    └── utils - Utils such as custom functions
```

## Helpful Links

-   [Next.js](https://nextjs.org/docs/getting-started)
-   [Supabase](https://supabase.com/docs/reference/javascript/installing)
<!-- note that I use the supabase-bin AUR package instead -->
-   [Supabase CLI](https://supabase.com/docs/guides/cli)

## Support

If you want to support me and what I do, please consider subscribing to my YouTube channel, [Steve's teacher](https://www.youtube.com/stevesteacher)!

## Changelog

## v1

-   json-server -> FastAPI
-   json-server -> PostgreSQL

## v2

-   FastAPI -> Next.js
-   React -> Next.js
-   MUI -> Ant Design
-   Postgres -> MongoDB
