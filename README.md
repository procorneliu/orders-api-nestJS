# Practicing NestJS

---

## Environment Variables

This app is using 2 environment variable files. Depending on your scope, you should create manually these files in apps directory. These files should contains variables as examples shown bellow.

- First **(.env)** for development, running locally

```
// this is an example, you should replace (username, password and database_name) with yours data
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

- Second **(.env.production)** for production, running using docker-compose file.

```
// for these 3 you can pass any values you want
// notice how DATABASE_URL is build up on these
POSTGRES_USER=example_user
POSTGRES_PASSWORD=example_password
POSTGRES_DB=example_db

// these also can have any values
PGADMIN_DEFAULT_EMAIL=example@gmail.com
PGADMIN_DEFAULT_PASSWORD=example_password

// connection string build from POSTGRES_* variables above
DATABASE_URL="postgresql://example_user:example_password@postgres:5432/example_db"
```

---

## Seeding Database using Faker

After everything is set up and NestJS app and PostreSQL database is running, you can seed your database with fake data, used to testing purposes.

For this, just run command bellow:

- `npm run seed`

---

## How to import & run the collection

1. Open Postman
2. Top-left corner --> **Workspaces** --> choose a workspace
3. Top-left corner (near Workspaces button) --> **Import**
4. Drag and drop **/docs/collections/orders-api.postman_collection.json**
5. Repeat process dragging **/docs/collections/env.dev.template.json** _(for environment variables)_

For those interested, there is also an OpenApi json for Swagger in **/docs/openapi.json**.
