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

#### Migrate

```zsh
bunx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_create_user_table.sql
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
