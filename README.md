## Mito Shogi API

### Prisma + Cloudflare D1

```zsh
bunx prisma init --datasource-provider sqlite
```

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}
```

#### Create database

```zsh
vscode ➜ ~/app (develop) $ bunx wrangler d1 create mito-shogi

 ⛅️ wrangler 4.7.0
------------------

✅ Successfully created DB 'mito-shogi' in region APAC
Created your new D1 database.

[[d1_databases]]
binding = "DB"
database_name = "mito-shogi"
database_id = "3aa4f6e7-4514-4bf0-98bd-df87e7cd2be5"
```

```toml
d1_databases = [
  { binding = "DB", database_name = "mito-shogi", database_id = "3aa4f6e7-4514-4bf0-98bd-df87e7cd2be5" },
]
```

#### Prisma Schema

```zsh
bunx wrangler d1 migrations create mito-shogi create_user_table
```

#### Migrate and Apply

```zsh
# First time
bunx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_create_user_table.sql

# Otherwise
bunx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_create_user_table.sql
```

```zsh
vscode ➜ ~/app (master) $ bunx wrangler d1 migrations apply mito-shogi --local

 ⛅️ wrangler 4.7.0
------------------

Migrations to be applied:
┌────────────────────────────┐
│ name                       │
├────────────────────────────┤
│ 0001_create_user_table.sql │
└────────────────────────────┘
✔ About to apply 1 migration(s)
Your database may not be available to serve requests during the migration, continue? … yes
🌀 Executing on local database mito-shogi (f591c2f3-e3bc-4770-8ac3-d883316e1f29) from .wrangler/state/v3/d1:
🌀 To execute on your remote database, add a --remote flag to your wrangler command.
🚣 3 commands executed successfully.
┌────────────────────────────┬────────┐
│ name                       │ status │
├────────────────────────────┼────────┤
│ 0001_create_user_table.sql │ ✅     │
└────────────────────────────┴────────┘
```

#### Bindings

```ts
export type Bindings = {
  DB: D1Database
}
```

#### PrismaClient

```ts
import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient, type User } from '@prisma/client'
import type { Bindings } from './bindings'

class Prisma {
  private prisma: PrismaClient

  constructor(env: Bindings) {
    const adapter = new PrismaD1(env.DB)
    this.prisma = new PrismaClient({ adapter })
  }
}
```

```ts
app.use('*', async (c: Context, next: Next) => {
  c.env = { ...process.env, ...c.env }
  if (!c.env.prisma) {
    console.info('Initializing Prisma')
    c.env.prisma = new Prisma(c.env)
  }
  await next()
})
```

#### Generate

```zsh
vscode ➜ ~/app (master) $ bunx prisma generate
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 46ms

Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)

Help us improve the Prisma ORM for everyone. Share your feedback in a short 2-min survey: https://pris.ly/orm/survey/release-5-22
```

## Environment Variables

```zsh
# .dev.vars
WARS_AUTHENTICITY_TOKEN=
WARS_SECRET=
WARS_USER_ID=
WARS_WEB_SESSION=
```

```zsh
# .env
DATABASE_URL="file:./dev.db"
CLOUDFLARE_API_TOKEN=
```
