## Rcontacts REST API

![Made with Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun)
![Made with Hono](https://img.shields.io/badge/Hono-%23E36002.svg?style=for-the-badge&logo=hono)
![Made with Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Made with Fiber](https://img.shields.io/badge/Fiber-00ADD8?style=for-the-badge&logo=fiber&logoColor=white)
![Made with TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Made with PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Made with MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker)
![OpenAPI](https://img.shields.io/badge/OpenAPI-Swagger-brightgreen?style=for-the-badge&logo=swagger)
![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

![Raw SQL](https://img.shields.io/badge/Raw--SQL-gray?style=for-the-badge&logo=postgresql&logoColor=white)

Repository containing REST API implementations for a contact-management app (`rcontacts-rest`). There are multiple server implementations in this repo:

- `bun-hono` – TypeScript implementation using Bun + Hono.
- `go-fiber` – Go implementation using Fiber.
- `python-fastapi` – Python implementation using FastAPI (coming soon).
- `java-spring` – Java implementation using Javalin (coming soon).

**Client implementation:** https://github.com/dist-r/rcontacts-client

The frontend/client for this API is published at the link above. You can use it to interact with this API or as a reference.

## Project Structure (high level)

```
rcontacts-rest/
├── bun-hono/           # Bun + Hono (TypeScript)
├── go-fiber/           # Go + Fiber (Go)
├── python-fastapi/     # Python + FastAPI (coming soon)
├── java-spring-boot/       # Java + Javalin (coming soon)
├── docs/               # OpenAPI / API docs
├── migration/          # SQL migration scripts
└── README.md
```

## Tech & ORM Support

Berikut teknologi, framework, database, dan ORM yang ada atau direncanakan untuk proyek ini (ikon hanya untuk referensi):

- Backend / Frameworks:
	- ![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun) `bun-hono` (TypeScript)
	- ![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white) `go-fiber` (Go)
	- ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) `python-fastapi` (FastAPI) — coming soon
	- ![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white) `java-sping-boot` (Javalin) — coming soon

- Databases:
	- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) PostgreSQL
	- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) MongoDB
	- ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) MySQL (planned)

- ORM / Data Layers (current vs planned):
	- ![Raw SQL](https://img.shields.io/badge/Raw--SQL-gray?style=for-the-badge&logo=postgresql&logoColor=white) Raw SQL / repository (currently implemented)
	- ![Drizzle](https://img.shields.io/badge/Drizzle-7C3AED?style=for-the-badge&logo=drizzle&logoColor=white) Drizzle (TypeScript) — planned/partial
	- ![Prisma](https://img.shields.io/badge/Prisma-0EA5A8?style=for-the-badge&logo=prisma&logoColor=white) Prisma (TypeScript/Node) — planned
	- ![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-31648A?style=for-the-badge&logo=sqlalchemy&logoColor=white) SQLAlchemy (Python) — planned
	- ![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white) Hibernate (Java) — planned

Note: badge/icon daftar di atas bersifat informatif — bukan semua ORM/DB sudah diimplementasikan; beberapa hanya direncanakan.

## Database

This project uses **PostgreSQL**. SQL scripts for creating tables are in `migration/` and the Docker Compose setups mount that folder so the DB can initialize automatically.

## Environment (.env)

Both implementations expect environment variables for database connection and secrets (e.g. `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_HOST`, `POSTGRES_PORT`, `JWT_SECRET`). The Docker Compose files reference an `.env` file (typically `../.env` relative to the `docker` folder), so place your `.env` accordingly or set env vars in your environment.

If a `.env.example` exists, copy it and update values:

```bash
cp .env.example .env
# edit .env
```

## How to Run (Overview)

Two options:

- Run locally without containers (use Bun/Node and Go directly).
- Run with Docker Compose (includes Postgres and the app container).

### 1) Run Locally (without Docker)

1. Bun + Hono (TypeScript)

Prerequisites: Bun (recommended). Node.js may be used but Bun provides the intended experience (hot reload).

```bash
cd bun-hono
# install dependencies (Bun)
bun install

# run development server (hot reload)
bun run dev
```

The service listens on `http://localhost:3000` by default. Make sure your `.env` points the app to a running Postgres instance.

2. Go + Fiber

Prerequisites: Go (module-aware, Go 1.20+ recommended).

```bash
cd go-fiber
# run the cmd package
go run ./cmd

# or build, then run
go build -o rcontacts ./cmd
./rcontacts
```

The Go service listens on port `3000` by default. Configure database and secrets via the `.env` used by the application.

### 2) Run With Docker Compose

Each implementation contains a `docker/docker-compose.yml` that spins up Postgres + the app. From the repository root you can run either implementation's compose file.

Run Bun + Hono with Docker Compose:

```bash
docker compose -f bun-hono/docker/docker-compose.yml up -d --build
```

Run Go + Fiber with Docker Compose:

```bash
docker compose -f go-fiber/docker/docker-compose.yml up -d --build
```

Notes:

- Both compose files mount `migration/` into the Postgres container to run the SQL scripts at initialization.
- Ensure your `.env` is present and contains Postgres credentials and any other required secrets. The compose files refer to `../.env` relative to each `docker` folder.

### Stopping and Removing Containers

```bash
docker compose -f bun-hono/docker/docker-compose.yml down
docker compose -f go-fiber/docker/docker-compose.yml down
```

## Troubleshooting

- If the app cannot connect to the database when running locally, verify `POSTGRES_HOST` and that Postgres is reachable on the configured port.
- If ports conflict on Windows, change the ports in the compose file or stop other services using those ports.
- For Bun-specific commands, install Bun from https://bun.sh/ for best compatibility.

## API Documentation

OpenAPI definition is in `docs/openapi.yaml`. Use Swagger UI or Postman to import and explore the API endpoints.

---

If you want, I can also:

- Add an example `.env.example` file in the repo showing required environment variables.
- Add a short script to run both implementations with Docker Compose from the repository root.

Feel free to tell me which follow-up you'd like.