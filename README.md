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

Since all endpoints (except `/auth`) require JWT authentication, this introduces a bootstrap scenario when no users exist. To address this without violating the specification, the Users microservice includes a **database seeder** that creates an initial administrative user during the first startup.

### How it works:

1. On startup, the seeder checks if the database is empty
2. If empty, it creates an admin user using credentials from environment variables
3. The admin can then authenticate via `/auth` and create additional users

### Admin credentials (via .env):

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
