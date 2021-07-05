<div style="padding: 5%; margin: 2.5%; 0" align="center">
    <img src="../github-logo.png" />
</div>
<h1 align="center">Server for TopCord</h1>

<div align="center">
    <a href="https://discord.gg/ryk4K5kRJq">
        <img src="https://img.shields.io/discord/761596363795988561" />
    </a>
       <a href="https://github.com/vitaliyirtlach/riod.js">
        <img src="https://img.shields.io/github/stars/TopCord-Team/bots.topcord.ru?style=social" />
    </a>
</div>


## How run locally?
1. Install PostgreSQL 13+
2. Install dependencies
```bash
    $ npm install 
```
3. Create .env file with your variables
```env
    NODE_ENV=""
    PORT=5000
    WEB_URL=""
    DISCORD_CLIENT_ID=""
    DISCORD_CLIENT_SECRET=""
    DISCORD_CALLBACK_URL=""
    SUCCESSFUL_AUTH_URL=""
    DISCORD_AUTH_SCOPES=""
    DISCORD_BOT_TOKEN=""
    DISCORD_BOT_PREFIX=""
```

4. Create ormconfig.json file for PostgreSQL and TypeORM
```json
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

5. Run project
```bash
    $ npm run dev
```