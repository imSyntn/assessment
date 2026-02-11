# Assessment

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8.15.6 or higher) - Install with `npm install -g pnpm`
- **PostgreSQL database** (or a Neon database URL)

### Installation

1. **Clone the repository** (if not already done):

   ```sh
   git clone https://github.com/imSyntn/assessment.git
   cd assessment
   ```

2. **Install dependencies**:
   ```sh
   pnpm install
   ```

### Environment Setup

1. **Create a `.env` file** in the root directory with the following variables:

   ```env
   DATABASE_URL="your-postgresql-database-url"
   GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-api-key"
   ```

   > **Note**: Replace the placeholder values with your actual credentials.

   > **Note**: You can use this for demo (No need to SEED)

   ```env
   DATABASE_URL="postgresql://neondb_owner:npg_4CHXWlZktp8E@ep-blue-wave-aiuco3i8-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   ```

### Database Setup

1. **Generate Prisma client**:

   ```sh
   pnpm --filter @repo/db db:generate
   ```

2. **run migrations**:

   ```sh
   pnpm --filter @repo/db db:migrate
   ```

3. **Seed the database (if not using preseeded DB)**:

   ```sh
   pnpm --filter @repo/db db:seed
   ```

4. **(Optional) Open Prisma Studio** to view/edit data:
   ```sh
   pnpm --filter @repo/db db:studio
   ```

### Running the Application

1. **Start the development servers** (API + Web):

   ```sh
   pnpm dev
   ```

   This will start:

   - **API server** (Hono backend) - typically on `http://localhost:3001`
   - **Web app** (Vite + React frontend) - typically on `http://localhost:5173`

2. **Run individual apps**:
   - API only: `pnpm --filter @repo/api dev`
   - Web only: `pnpm --filter web dev`

### Building for Production

```sh
pnpm build
```

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `apps/web`: react [vite](https://vitejs.dev) ts app
- `apps/api`: hono ts app
- `packages/db`: prisma db
- `packages/ui`: a component library shared by `web` application.
