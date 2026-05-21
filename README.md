# Rcontacts REST API

![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white)
![Made with Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun)
![Made with Hono](https://img.shields.io/badge/Hono-%23E36002.svg?style=for-the-badge&logo=hono)
![Made with Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Made with Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
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
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)
![Raw SQL](https://img.shields.io/badge/Raw--SQL-gray?style=for-the-badge&logo=postgresql&logoColor=white)

Repository containing REST API implementations for a contact-management app (`rcontacts-rest`). There are multiple server implementations in this repo:

- `bun-hono` – TypeScript implementation using Bun + Hono.
- `express` - TypeScript implementation using Node.js + Express.
- `go-fiber` – Go implementation using Fiber.
- `spring-java` – Java implementation using Spring Boot (on progress).
- `aspdotnet` - C# implementation using ASP.NET Core.
- `python-fastapi` – Python implementation using FastAPI (coming soon).

**Client implementation:** https://github.com/dist-r/rcontacts-client

The frontend/client for this API is published at the link above. You can use it to interact with this API or as a reference.

> [!IMPORTANT]
> The `express` and `aspdotnet` implementations already use the new API response format. Because of that response change, they are not fully compatible with the current client application yet. The project is currently migrating the client and API usage to the new response format.

## Bun Hono Implementation

![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun)
![Hono](https://img.shields.io/badge/Hono-%23E36002.svg?style=for-the-badge&logo=hono)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Implemented by Uzumaki Bayu (admin)**

A high-performance REST API implementation using Bun runtime and Hono framework. This project showcases a lightweight, fast alternative to traditional Node.js server implementations with support for multiple database backends and ORM options.

### How to Run

#### Prerequisites
- Bun
- Database postgresql (implemented) / mysql(planned) / msserver (planned)  - (sql)
- Database mongodb - (nosql)
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

## Express TypeScript Implementation

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**Implemented by Uzumaki Bayu (admin)**

A REST API implementation using Node.js, Express, and TypeScript. This implementation follows a modular structure with controllers, services, repositories, middleware, JWT authentication, and raw PostgreSQL data access.

> [!IMPORTANT]
> This implementation uses the new API response format, so it is not fully supported by the current client application yet. Client integration is being migrated to the new response format.

### How to Run

#### Prerequisites
- Node.js
- npm
- PostgreSQL database
- docker (optional)

#### Run Locally
1. Navigate to the folder:
   ```bash
   cd express
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

The service listens on `http://localhost:3000` by default.

#### Build and Run
```bash
npm run build
npm run preview
```

#### Run with Docker Compose
```bash
docker compose -f express/docker/docker-compose.yml up -d --build
```

### Technologies Supported

- **SQL Databases:**
  - ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) PostgreSQL (implemented with raw SQL)
  - ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) MySQL (planned)

- **NoSQL Databases:**
  - MongoDB (planned)

- **ORM/Data Layers:**
  - Raw SQL (implemented)
  - Prisma (planned)

## Go Fiber Implementation

![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Fiber](https://img.shields.io/badge/Fiber-00ADD8?style=for-the-badge&logo=fiber&logoColor=white)

**Implemented by Uzumaki Bayu (admin)**

A production-ready REST API built with Go and Fiber framework, designed for optimal performance and concurrency. This implementation demonstrates Go's strengths in building scalable backend services with excellent memory efficiency and fast execution.

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
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white)

**Implemented by Uzumaki Bayu (admin)**

An enterprise-grade REST API implementation using Spring Boot framework with Java. This project demonstrates best practices for building scalable, maintainable backend services with modern Spring ecosystem components.

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

## ASP.NET Core Implementation

![.NET](https://img.shields.io/badge/.NET_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

**Implemented by Uzumaki Bayu (admin)**

A REST API implementation using C#, .NET 8, and ASP.NET Core. This implementation uses controllers, services, repositories, JWT authentication, Swagger/OpenAPI documentation, and raw PostgreSQL access through Npgsql.

> [!IMPORTANT]
> This implementation uses the new API response format, so it is not fully supported by the current client application yet. Client integration is being migrated to the new response format.

### How to Run

#### Prerequisites
- .NET SDK 8+
- PostgreSQL database

#### Run Locally
1. Navigate to the folder:
   ```bash
   cd aspdotnet
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Run development server:
   ```bash
   dotnet run
   ```

The service listens on `http://localhost:5226` by default for the `http` launch profile. Swagger is available at `/swagger` in development.

### Technologies Supported

- **Framework and Language:**
  - ![.NET](https://img.shields.io/badge/.NET_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white) .NET 8
  - ![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white) ASP.NET Core
  - ![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white) C#

- **SQL Databases:**
  - ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) PostgreSQL (implemented with raw SQL through Npgsql)

- **Authentication and API Docs:**
  - ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) JWT Bearer Authentication
  - ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) Swagger / OpenAPI

- **ORM/Data Layers:**
  - Raw SQL (implemented)
  - Entity Framework Core (planned)

## Upcoming Implementations

- `python-fastapi` – Python implementation using FastAPI (coming soon).
- `nest-nodejs` – Node.js implementation using NestJS (coming soon).

## Database

This project uses **PostgreSQL**. SQL scripts for creating tables are in `migration/` and the Docker Compose setups mount that folder so the DB can initialize automatically.

## Environment (.env)

The implementations expect environment variables for database connection and secrets (e.g. `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_HOST`, `POSTGRES_PORT`, `JWT_SECRET`). The Docker Compose files reference an `.env` file (typically `../.env` relative to the `docker` folder), so place your `.env` accordingly or set env vars in your environment.

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
