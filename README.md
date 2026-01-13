# ília - Code Challenge NodeJS
**English**
##### Before we start ⚠️
**Please create a fork from this repository**

## The Challenge:
One of the ília Digital verticals is Financial and to level your knowledge we will do a Basic Financial Application and for that we divided this Challenge in 2 Parts.

The first part is mandatory, which is to create a Wallet microservice to store the users' transactions, the second part is optional (*for Seniors, it's mandatory*) which is to create a Users Microservice with integration between the two microservices (Wallet and Users), using internal communications between them, that can be done in any of the following strategies: gRPC, REST, Kafka or via Messaging Queues and this communication must have a different security of the external application (JWT, SSL, ...), **Development in javascript (Node) is required.**

![diagram](diagram.png)

### General Instructions:
## Part 1 - Wallet Microservice

This microservice must be a digital Wallet where the user transactions will be stored 

### The Application must have

    - Project setup documentation (readme.md).
    - Application and Database running on a container (Docker, ...).
    - This Microservice must receive HTTP Request.
    - Have a dedicated database (Postgres, MySQL, Mongo, DynamoDB, ...).
    - JWT authentication on all routes (endpoints) the PrivateKey must be ILIACHALLENGE (passed by env var).
    - Configure the Microservice port to 3001. 
    - Gitflow applied with Code Review in each step, open a feature/branch, create at least one pull request and merge it with Main(master deprecated), this step is important to simulate a team work and not just a commit.

## Part 2 - Microservice Users and Wallet Integration

### The Application must have:

    - Project setup documentation (readme.md).
    - Application and Database running on a container (Docker, ...).
    - This Microservice must receive HTTP Request.   
    - Have a dedicated database(Postgres, MySQL, Mongo, DynamoDB...), you may use an Auth service like AWS Cognito.
    - JWT authentication on all routes (endpoints) the PrivateKey must be ILIACHALLENGE (passed by env var).
    - Set the Microservice port to 3002. 
    - Gitflow applied with Code Review in each step, open a feature/branch, create at least one pull request and merge it with Main(master deprecated), this step is important to simulate a teamwork and not just a commit.
    - Internal Communication Security (JWT, SSL, ...), if it is JWT the PrivateKey must be ILIACHALLENGE_INTERNAL (passed by env var).
    - Communication between Microservices using any of the following: gRPC, REST, Kafka or via Messaging Queues (update your readme with the instructions to run if using a Docker/Container environment).

#### In the end, send us your fork repo updated. As soon as you finish, please let us know.

#### We are available to answer any questions.


Happy coding! 🤓

---

# Challenge Solution

## How to Run

```bash
docker-compose up --build
```

This starts all services:
- PostgreSQL Wallet (port 5432)
- PostgreSQL Users (port 5433)
- ms-users (port 3002)
- ms-wallet (port 3001)

Migrations run automatically on startup.

To verify:

```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
```

## Authentication Bootstrap

Since all application endpoints require JWT authentication, this introduces a bootstrap scenario when no users exist. To address this without violating the specification, the Users microservice includes a **database seeder** that creates an initial administrative user during the first startup.

### How it works:

1. On startup, the seeder checks if the database is empty
2. If empty, it creates an admin user using credentials from environment variables
3. The admin can then authenticate via `/auth` and create additional users

### Admin credentials (via .env or .env.example):

> Credentials shown below are for local development only.

```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User
```

This approach ensures:
- No public user registration (all endpoints protected)
- No hardcoded credentials in source code
- Credentials configurable per environment

## Identifier Strategy

UUIDs are used as primary identifiers to ensure uniqueness across independent microservices and databases.

## APIs

### Users Service (port 3002)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth | Login | Public |
| POST | /users | Create user | Required |
| GET | /users | List users | Required |
| GET | /users/:id | Get user | Required |
| PUT | /users/:id | Update user | Required |
| DELETE | /users/:id | Delete user | Required |

### Wallet Service (port 3001)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /transactions | Create transaction | Required |
| GET | /transactions | List transactions (filter: ?type=CREDIT or DEBIT) | Required |
| GET | /balance | Get balance | Required |

All protected endpoints require header: `Authorization: Bearer <token>`

## API Collection

An Insomnia collection with all endpoints is available at [`docs/Ilia_2026-01-12`](docs/Ilia_2026-01-12).

## Service Communication

ms-wallet validates if user_id exists in ms-users via gRPC (port 50051) before creating a transaction. Internal communication uses JWT with secret ILIACHALLENGE_INTERNAL.

## Local Development (optional)

To run without Docker:

```bash
npm install
docker-compose up postgres-wallet postgres-users -d
npm run prisma:migrate --workspace=ms-wallet
npm run prisma:migrate --workspace=ms-users
npm run dev --workspace=ms-users
npm run dev --workspace=ms-wallet
```

## Known Limitations

- **Admin seeder race condition**: If multiple instances of ms-users start simultaneously with an empty database, more than one admin could be created. This is an accepted trade-off to avoid over-engineering with distributed locks for a simple seeder.
- **Cross-service consistency**: There is a potential race condition between user validation in ms-users and transaction creation in ms-wallet. In production, this could be mitigated with event-driven approaches or soft deletes.
- **Idempotency on transaction creation**: The `POST /transactions` endpoint does not currently support idempotency keys. In scenarios involving network retries or client-side timeouts, duplicate transactions could be created. In production, this could be addressed by requiring an `Idempotency-Key` header and enforcing uniqueness at the database level.
- **No pagination**: List endpoints (`GET /users`, `GET /transactions`) return all records. For large datasets, pagination would be needed.
- **No refresh tokens**: JWT tokens expire after 1 day. Users must re-authenticate after expiration.
- **Transactions are immutable**: There are no endpoints to update or delete transactions, following financial audit best practices.
- **Balance per user only**: The `/balance` endpoint returns balance for the authenticated user. Global aggregations are not supported.
- **Concurrent balance updates**: Concurrent debit operations could lead to inconsistent balance calculations without database-level locking or transactional isolation. This challenge prioritizes simplicity over strict concurrency controls.

## Future Improvements

- **Automated tests**: Unit tests for use cases and integration tests for APIs
- **Pagination**: Add limit/offset or cursor-based pagination to list endpoints
- **Refresh tokens**: Implement token refresh mechanism to improve UX
- **Rate limiting**: Protect endpoints against abuse
- **Duplicate transaction protection**: In real-world financial systems, additional safeguards prevent rapid consecutive transactions with identical attributes within a short time window. This challenge intentionally avoids such heuristics to keep the transaction model deterministic and simple.
- **OpenAPI/Swagger**: Auto-generated API documentation
- **Structured logging**: Add correlation IDs for request tracing across services
- **Metrics**: Prometheus/Grafana for monitoring and alerting
- **Secrets management**: Use a dedicated secrets manager (e.g. AWS Secrets Manager, Vault) instead of environment files in production
- **Service mesh (optional)**: In larger production environments, a service mesh could provide mTLS, observability, and traffic management between microservices
- **Time consistency**: In production, transaction timestamps should be generated and normalized using a consistent time source (e.g. UTC or database time) to avoid clock skew issues across services
- **API versioning**: Introduce explicit API versioning (e.g. `/v1`) to allow backward-compatible evolution of the public endpoints
- **Contract evolution**: As internal gRPC contracts evolve, backward-compatible schema changes would be required to avoid breaking inter-service communication
- **Audit trail**: While transactions are immutable, a production system would typically include an append-only audit log for security and compliance purposes
- **Graceful shutdown**: Implement graceful shutdown handling to ensure in-flight requests are completed before service termination
