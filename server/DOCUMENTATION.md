# Documentation

## API

## BOT
### Commands

### Events
## ENV VARIABLES
1. PORT 
    <p>default: 5000</p>
    <p>Set port for server</p>
2. DISCORD_CLIENT_ID
    <p>Discord client ID for Auth</p>
3. DISCORD_CLIENT_SECRET
    <p>Secret key for Auth</p>
4. DISCORD_CALLBACK_URL=
    <p>Default http://localhost:{PORT}/auth/discord/callback</p>
    <p>Callback url for Auth</p> 
5. DISCORD_BOT_TOKEN
    <p>Token for bot</p>
6. SUCCESSFUL_URL
    <p>Default: http://localhost:3000/me</p>
    <p>URL for successfully login or register user </p>
7. DISCORD_SCOPES
    <p>Scopes for discord auth (separator: ",")</p>
    <p>Example: "identify,email"</p>
8. DISCORD_BOT_PREFIX
    <p>Bot prefix</p>
## RATE LIMITS
1. All API 
    50 requests per 15 minutes 
2. Guilds count
    10 requests per 1 hour
## ERRORS


## How build
1. Build typescript app 
```bash
$ npm run build
```

2. Create configs in __dist__ folder
```json
# ormconfig.json
{
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "",
    "password": "",
    "database": "",
    "synchronize": true,
    "logging": false,
    "entities": ["./src/entities/**/*.{ts,js}"],
    "migrations": ["./src/migration/**/*.{ts,js}"],
    "subscribers": ["./src/subscriber/**/*.{ts,js}"]
}
```
```
# .env
PORT=
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
DISCORD_CALLBACK_URL=""
DISCORD_BOT_TOKEN=""
SUCCESSFUL_URL=""
DISCORD_SCOPES=""
DISCORD_BOT_TOKEN=""
DISCORD_BOT_PREFIX=""
```

3. Run app
```bash
$ cd dist
$ node ./src/index.js
```