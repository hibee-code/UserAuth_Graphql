# 🚀 Overview

This document provides step-by-step instructions to set up the development environment for a NestJS RESTful API that supports:

User registration

Standard and biometric authentication

Prisma ORM with PostgreSQL

GraphQL integration

---

## 🛠️ Prerequisites

Before starting, ensure you have the following installed:

Node.js (v18+)

Yarn or npm

Docker & Docker Compose

Git

A code editor like VSCode

---

## 🏗️ Project Setup

1. **Clone the repository**

```bash
git clone https://github.com/hibee-code/UserAuth_Graphql.git
cd UserAuth_Graphql


```bash
yarn install


2. **Initialize a NestJS Project

npm i -g @nestjs/cli
nest new .

3. Set Up PostgreSQL with Docker

version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: nest_postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: nest_auth_db
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:

4. Start the database

docker-compose up -d

5. 🔧 Install Dependencies

yarn add @nestjs/graphql @nestjs/apollo graphql apollo-server-express
yarn add prisma @prisma/client
yarn add @nestjs/graphql @nestjs/apollo graphql apollo-server-express

6. ## Configure Environment Variables

DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/yourdb
JWT_SECRET=your_jwt_secret
PORT=3000

7. ##  Set Up the Database with Prisma

npx prisma generate
npx prisma migrate dev --name init

8. ## Start the Development Server

  yarn start:dev

