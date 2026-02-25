# Birthday Site

Full-stack birthday invitation app built as an Nx monorepo, with:
- **Web frontend**: Angular app (`apps/web`)
- **API backend**: ASP.NET Core minimal API (`apps/api/Birthday`)
- **Database**: SQLite (EF Core)

## Table of Contents
- [Birthday Site](#birthday-site)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Getting Started](#getting-started)
  - [Usage](#usage)
    - [Run locally](#run-locally)
    - [Run with Docker Compose](#run-with-docker-compose)
  - [Environment Variables](#environment-variables)
  - [Contributing](#contributing)
  - [License](#license)

## Project Structure

```text
project-root/
├─ apps/
│  ├─ api/
│  │  └─ Birthday/
│  │     ├─ Program.cs
│  │     ├─ Data/
│  │     ├─ Models/
│  │     ├─ Repository/
│  │     ├─ Services/
│  │     └─ Birthday.csproj
│  └─ web/
│     ├─ src/
│     ├─ angular.json
│     └─ package.json
├─ docker-compose.yml
├─ package.json
├─ nx.json
└─ README.md
```

- `apps/api/Birthday`: .NET API handling invitations, persistence, and email sending.
- `apps/web`: Angular frontend for the birthday invitation flow.
- `docker-compose.yml`: Production-like multi-container setup for API + web.
- `package.json`: Nx workspace scripts for web tasks.
- `README.md`: This file.

## Installation

### Prerequisites
- Node.js (LTS recommended) + npm
- .NET SDK (target framework in this repo is `net10.0`)
- Docker + Docker Compose (optional, for containerized run)

### Getting Started

1. Clone the repository:

```bash
git clone <your-repo-url>
cd birthdaySite
```

2. Install root dependencies:

```bash
npm install
```

3. Create your environment file from the sample:

```bash
cp .env.sample .env
```

4. Fill required values in `.env` (especially mail settings).

## Usage

### Run locally

1. Start the API:

```bash
dotnet run --project apps/api/Birthday/Birthday.csproj
```

2. Start the web app (in another terminal):

```bash
npm run web:start
```

3. Open the frontend:

```text
http://localhost:4200
```

> API CORS is configured for `http://localhost:4200` in development.

### Run with Docker Compose

```bash
docker compose up --build
```

Default exposed ports:
- Web: `http://localhost:8081`
- API: `http://localhost:5252`

## Environment Variables

Environment variables are loaded from `.env`.

Based on `.env.sample`:

```env
EmailSettings__Password=
EmailSettings__To=
EmailSettings__Username=
```

These values are used by the API email service and by Docker Compose in production-like runs.

## Contributing

Contributions are welcome. Open an issue or submit a pull request with descriptions of changes.