export type Bindings = {
  WARS_WEB_SESSION: string
  WARS_USER_ID: string
  WARS_SECRET: string
  WARS_AUTHENTICITY_TOKEN: string
  DISCORD_WEBHOOK_URL: string
  APP_REDIRECT_URI: string
  APP_JWT_SECRET: string
  CACHE: KVNamespace
  USERS: KVNamespace
  GAMES: KVNamespace
  CSA: KVNamespace
  DB: D1Database
}
