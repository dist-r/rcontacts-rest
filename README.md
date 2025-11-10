# Rcontacts REST API

![Made with Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun)
![Made with Hono](https://img.shields.io/badge/Hono-%23E36002.svg?style=for-the-badge&logo=hono)
![Made with Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Made with Fiber](https://img.shields.io/badge/Fiber-00ADD8?style=for-the-badge&logo=fiber&logoColor=white)
![Made with TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Made with PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

This repository contains REST API implementations for a contact management application (`rcontacts-rest`) built using various technologies and programming languages.

## Implementations

This project provides several different backend implementations:

1.  **Bun + Hono (TypeScript):** A fast and modern implementation using Bun as the JavaScript runtime and Hono as the web framework.
2.  **Go + Fiber (Golang):** A high-performance implementation using the Go language and the Fiber framework. (Under development)

## Project Structure

```
rcontacts-rest/
├── .gitignore
├── README.md
├── bun-hono/            # Bun + Hono Implementation
│   ├── .env
│   ├── bun.lock
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── bootstrapp/
│   │   ├── common/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/       # Business logic for each module (User, Contact)
│   │   ├── repository/    # Data access abstraction (Raw PG, Drizzle, Prisma)
│   │   ├── routes/        # API route definitions
│   │   └── utils/
│   └── test/
├── docs/
├── go-fiber/            # Go + Fiber Implementation (Coming soon)
└── migration/           # SQL database migration scripts
    ├── 01_user.sql
    └── 02_contact.sql
```

## Database

This project uses **PostgreSQL** as its database. Scripts for creating tables (`users` and `contacts`) can be found in the `migration/` directory.

## How to Run (Bun + Hono)

1.  **Install Dependencies:**
    ```bash
    cd bun-hono
    bun install
    ```

2.  **Set Up Environment:**
    Copy the `.env.example` file to `.env` and configure environment variables, especially for database connection.

3.  **Run the Application:**
    ```bash
    bun run dev
    ```
    The application will run in hot-reload mode at `http://localhost:3000`.

## API Documentation

Detailed API documentation can be found in the `docs/openapi.yaml` file. You can use tools like Swagger UI or Postman to view and interact with the API documentation.