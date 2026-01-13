# Rcontacts REST API

![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white)
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
![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)
![Raw SQL](https://img.shields.io/badge/Raw--SQL-gray?style=for-the-badge&logo=postgresql&logoColor=white)

Repository containing REST API implementations for a contact-management app (`rcontacts-rest`). There are multiple server implementations in this repo:

- `bun-hono` – TypeScript implementation using Bun + Hono.
- `go-fiber` – Go implementation using Fiber.
- `spring-java` – Java implementation using Spring Boot (on progress).
- `ASP .NET` - C# implementation using ASP.NET Core (coming soon).
- `python-fastapi` – Python implementation using FastAPI (coming soon).

**Client implementation:** https://github.com/dist-r/rcontacts-client

The frontend/client for this API is published at the link above. You can use it to interact with this API or as a reference.

## Bun Hono Implementation

![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun)
![Hono](https://img.shields.io/badge/Hono-%23E36002.svg?style=for-the-badge&logo=hono)

**Implemented by Uzumaki Bayu (admin)**

### Project Structure

The `bun-hono/` folder contains the TypeScript implementation using Bun runtime and Hono framework.

```
bun-hono/
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── docker/
│   ├── docker-compose.yml # Docker Compose for Postgres + app
│   └── Dockerfile         # Docker build instructions
├── src/
│   ├── index.ts          # Main entry point
│   ├── bootstrapp/
│   │   └── bootstrapp.ts # Application bootstrap
│   ├── common/
│   │   └── api.error.ts  # Common API error handling
│   ├── config/
│   │   ├── logger.pino.ts # Pino logger configuration
│   │   ├── mongo.db.ts    # MongoDB connection
│   │   └── postgres.raw.ts # Raw PostgreSQL connection
│   ├── middleware/
│   │   └── auth.middleware.ts # Authentication middleware
│   ├── modules/
│   │   ├── contact/
│   │   │   ├── contact.controller.ts
│   │   │   ├── contact.repository.ts
│   │   │   ├── contact.service.ts
│   │   │   ├── contact.ts
│   │   │   └── __test__/
│   │   └── user/
│   │       ├── user.controller.ts
│   │       ├── user.repository.ts
│   │       ├── user.service.ts
│   │       ├── user.ts
│   │       └── __test__/
│   ├── repository/
│   │   ├── inmemo/
│   │   │   ├── inMemo.contact.ts
│   │   │   └── inMemo.user.ts
│   │   ├── nosql/
│   │   │   ├── mongo.contact.ts
│   │   │   └── mongo.user.ts
│   │   ├── orm/
│   │   │   ├── drizzle.repository.ts
│   │   │   └── prisma.repository.ts
│   │   └── raw/
│   │       ├── pg.contact.ts
│   │       └── pg.user.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── contact.routes.ts
│   │   └── user.routes.ts
│   └── utils/
│       ├── hash.utils.ts
│       └── jwt.utils.ts
```

### How to Run

#### Prerequisites
- Bun
- PostgreSQL database
- MongoDB database
- docker (optional)

#### Run Locally
1. Navigate to the folder:
   ```bash
   cd bun-hono
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Run development server:
   ```bash
   bun run dev
   ```

The service listens on `http://localhost:3000` by default.

#### Run with Docker Compose
```bash
docker compose -f bun-hono/docker/docker-compose.yml up -d --build
```

### Technologies Supported

- **SQL Databases:**
  - ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) PostgreSQL (implemented with raw SQL)
  - ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) MySQL (planned)

- **NoSQL Databases:**
  - ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) MongoDB (implemented)

- **ORM/Data Layers:**
  - Raw SQL (implemented)
  - ![Drizzle](https://img.shields.io/badge/Drizzle-7C3AED?style=for-the-badge&logo=drizzle&logoColor=white) Drizzle (planned)
  - ![Prisma](https://img.shields.io/badge/Prisma-0EA5A8?style=for-the-badge&logo=prisma&logoColor=white) Prisma (planned)

## Go Fiber Implementation

![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Fiber](https://img.shields.io/badge/Fiber-00ADD8?style=for-the-badge&logo=fiber&logoColor=white)

**Implemented by Uzumaki Bayu (admin)**

### Project Structure

The `go-fiber/` folder contains the Go implementation using Fiber framework.

```
go-fiber/
├── go.mod               # Go module file
├── cmd/
│   └── main.go          # Main entry point
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfile
├── internal/
│   ├── bootstrapp/
│   │   └── app.go       # Application bootstrap
│   ├── modules/
│   │   ├── auth/
│   │   │   └── auth.go
│   │   ├── contact/
│   │   │   ├── contact.go
│   │   │   ├── handler.go
│   │   │   ├── mock_repo_test.go
│   │   │   ├── repository.go
│   │   │   ├── routes.go
│   │   │   ├── service_test.go
│   │   │   └── service.go
│   │   └── user/
│   │       ├── handler.go
│   │       ├── mock_repo_test.go
│   │       ├── repository.go
│   │       ├── routes.go
│   │       ├── service_test.go
│   │       └── service.go
│   │       └── user.go
│   └── repository/
│       └── raw/
│           ├── pg_raw_contact.go
│           └── ...
├── pkg/
│   ├── app/
│   │   └── app_error.go
│   ├── config/
│   │   └── db_pgx.go
│   ├── middleware/
│   │   └── auth_middleware.go
│   └── utils/
│       ├── hashed.go
│       └── jwt.go
```

### How to Run

#### Prerequisites
- Go 1.20+
- PostgreSQL database

#### Run Locally
1. Navigate to the folder:
   ```bash
   cd go-fiber
   ```

2. Run the application:
   ```bash
   go run ./cmd
   ```

Or build and run:
```bash
go build -o rcontacts ./cmd
./rcontacts
```

The service listens on port `3000` by default.

#### Run with Docker Compose
```bash
docker compose -f go-fiber/docker/docker-compose.yml up -d --build
```

### Technologies Supported

- **SQL Databases:**
  - ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) PostgreSQL (implemented with raw SQL)
  - ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) MySQL (planned)

- **NoSQL Databases:**
  - ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) MongoDB (planned)

- **ORM/Data Layers:**
  - Raw SQL (implemented)
  - ORM integration (planned)

## Spring Java Implementation

![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white)

**Implemented by Uzumaki Bayu (admin)**

### Project Structure

The `spring-java/` folder contains the Java implementation using Spring Boot.

```
spring-java/
├── mvnw
├── mvnw.cmd
├── pom.xml
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfile
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   └── test/
│       └── java/

```

### How to Run

#### Prerequisites
- Java 17+
- Maven

#### Run Locally
1. Navigate to the folder:
   ```bash
   cd spring-java
   ```

2. Run with Maven:
   ```bash
   ./mvnw spring-boot:run
   ```

#### Run with Docker Compose
```bash
docker compose -f spring-java/docker/docker-compose.yml up -d --build
```

### Technologies Supported

- **SQL Databases:**
  - ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) PostgreSQL (implemented with raw SQL)
  - ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) MySQL (planned)

- **NoSQL Databases:**
  - ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) MongoDB (palnned)

- **ORM/Data Layers:**
  - Raw SQL (implemented)
  - ![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white) Hibernate (planned)

## Upcoming Implementations

- `ASP .NET` - C# implementation using ASP.NET Core (coming soon).
- `python-fastapi` – Python implementation using FastAPI (coming soon).
- `nodejs-express` – Node.js implementation using Express (coming soon).
- `nest-nodejs` – Node.js implementation using NestJS (coming soon).

## Database

This project uses **PostgreSQL**. SQL scripts for creating tables are in `migration/` and the Docker Compose setups mount that folder so the DB can initialize automatically.

## Environment (.env)

Both implementations expect environment variables for database connection and secrets (e.g. `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_HOST`, `POSTGRES_PORT`, `JWT_SECRET`). The Docker Compose files reference an `.env` file (typically `../.env` relative to the `docker` folder), so place your `.env` accordingly or set env vars in your environment.

If a `.env.example` exists, copy it and update values:

```bash
cp .env.example .env
# edit .env
```

## API Documentation

OpenAPI definition is in `docs/openapi.yaml`. Use Swagger UI or Postman to import and explore the API endpoints.

## Troubleshooting

- If the app cannot connect to the database when running locally, verify `POSTGRES_HOST` and that Postgres is reachable on the configured port.
- If ports conflict on Windows, change the ports in the compose file or stop other services using those ports.
- For Bun-specific commands, install Bun from https://bun.sh/ for best compatibility.

---

If you want, I can also:

- Add an example `.env.example` file in the repo showing required environment variables.
- Add a short script to run both implementations with Docker Compose from the repository root.

Feel free to tell me which follow-up you'd like.