# News Hub Backend

This is a Next.js frontend for the News Hub project. It is fully containerized using Docker Compose for easy local development and deployment.

## Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/) installed
- [Git](https://git-scm.com/) for cloning the repository

## Quick Start

1. **Clone the repository:**
   ```sh
   git clone https://github.com/ore-codes/news-hub-fe.git
   cd news-hub-fe
   ```

2. **Copy the example environment file and edit as needed:**
   ```sh
   cp .env.local.example .env.local
   # Edit .env.local if necessary
   ```

3. **Build and start app:**
   ```sh
   docker compose up --build -d
   ```
   Or if you have npm installed, you can run
   ```sh
   npm run docker:prod
   ```
   This will build the Next.js and nginx containers with production settings.

4. **For hot reloading**
   ```sh
   docker-compose -f docker-compose.dev.yml up --build -d
   ```
   Or if you have npm installed, you can run
   ```sh
   npm run docker:dev
   ```
   This will build the Next.js and nginx containers with development settings.

5. **Access the application:**
   - Prod: [http://localhost:3000](http://localhost:3000)
   - Dev: [http://localhost:5173](http://localhost:5173)
