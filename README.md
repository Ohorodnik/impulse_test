## Installation

```bash
$ git clone https://github.com/Ohorodnik/impulse_test.git
```

## Set environment variables

Create .env file or set this variables in your shell.
```
DB_USER=
DB_PASSWORD=
DB_NAME=impulse
DB_HOST=db
DB_PORT=5432
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?
schema=public"
PORT=3000
PASSWORD_ENCRYPT_ITERATIONS=100000
PASSWORD_KEYLEN=64
JWT_SECRET=
JWT_EXPIRES_IN="1h"
```

## Running the app

```bash
$ docker compose up -d 
```

## License

[MIT licensed](LICENSE).
