# Sobre
O conteúdo abaixo foi criado pela AI (Copilot GPT-5.6) e descreve bem o "paranauê", ora maisssss.

# User API
A small Spring Boot REST API for managing users in memory.

## Requirements
- Java 17 or later
- Maven 3.8 or later

## Run locally
On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The API is available at `http://localhost:8081`.

## API
### Create a user
```http
POST /api/user
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com"
}
```

Names and emails are required, and emails must use a valid format.

### Get a user by ID
```http
GET /api/user/{id}
```

### List users
```http
GET /api/user
```

Optional exact-match filters can be used independently or together:

```http
GET /api/user?name=Alice
GET /api/user?email=alice@example.com
GET /api/user?name=Alice&email=alice@example.com
```

### Update a user
```http
PUT /api/user/{id}
Content-Type: application/json

{
  "name": "Alice Smith",
  "email": "alice.smith@example.com"
}
```

### Delete a user
```http
DELETE /api/user/{id}
```

## CORS
CORS is enabled for API routes from:

- `http://localhost:4173`
- `http://localhost:5173`
