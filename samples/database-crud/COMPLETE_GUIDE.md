# Complete Database CRUD Guide with Kora

A comprehensive guide to building full-stack applications with databases using Kora.

## Overview

Kora generates the API structure and types. You implement the repository layer for your chosen database.

## Architecture

```
Kora Code (Domain/API/UI)
    ↓
Compiler generates TypeScript
    ↓
Repository Layer (Your Implementation)
    ↓
Database (MongoDB/PostgreSQL/MySQL/etc.)
```

## Step 1: Define Domain

```kora
module domain User {
  type User {
    id: UUID
    name: String
    email: Email
    age: Number?
    role: UserRole
    createdAt: Date
  }
}
```

## Step 2: Create CRUD APIs

### Create

```kora
api createUser {
  input {
    name: String
    email: Email
    age: Number?
  }
  output User
  handler {
    let user = {
      id: UUID.generate(),
      name: name,
      email: email,
      age: age,
      createdAt: Date.now()
    }
    return UserRepo.save(user)
  }
}
```

### Read

```kora
api getUser {
  input { id: UUID }
  output User
  handler {
    return UserRepo.findById(id)
  }
}

api listUsers {
  input {
    role: UserRole?
    limit: Number?
  }
  output User[]
  handler {
    return UserRepo.findByRole(role, limit || 20)
  }
}
```

### Update

```kora
api updateUser {
  input {
    id: UUID
    name: String?
    email: Email?
    age: Number?
  }
  output User
  handler {
    let user = UserRepo.findById(id)
    if (name != null) user.name = name
    if (email != null) user.email = email
    if (age != null) user.age = age
    return UserRepo.save(user)
  }
}
```

### Delete

```kora
api deleteUser {
  input { id: UUID }
  output Boolean
  handler {
    UserRepo.delete(id)
    return true
  }
}
```

## Step 3: Implement Repository

### MongoDB Example

```typescript
import { Collection } from 'mongodb';

export class UserRepo {
  private static collection: Collection;

  static async findById(id: string): Promise<User | null> {
    return await this.collection.findOne({ id });
  }

  static async save(user: User): Promise<User> {
    await this.collection.updateOne(
      { id: user.id },
      { $set: user },
      { upsert: true }
    );
    return user;
  }

  static async delete(id: string): Promise<void> {
    await this.collection.deleteOne({ id });
  }
}
```

### PostgreSQL Example

```typescript
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export class UserRepo {
  static async findById(id: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async save(user: User): Promise<User> {
    await pool.query(
      `INSERT INTO users (id, name, email, age, created_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET
       name = $2, email = $3, age = $4`,
      [user.id, user.name, user.email, user.age, user.createdAt]
    );
    return user;
  }
}
```

## Step 4: Build UI

```kora
page UserManagement {
  load() -> User[]
  
  view(users: User[]) {
    <div>
      <h1>Users</h1>
      {for user in users {
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      }}
    </div>
  }
}
```

## Step 5: Compile and Use

```bash
kora build
```

Import in your app:

```typescript
import { createUserHandler } from '@/dist/api/create-user';
import { UserRepo } from '@/repositories/user-repo';

// Use the handler
const user = await createUserHandler({
  name: "John Doe",
  email: "john@example.com"
});
```

## Database-Specific Examples

### MongoDB
- Location: `samples/database-crud/mongodb/`
- Uses: MongoDB native driver or Mongoose
- Best for: Flexible schemas, JSON documents

### PostgreSQL
- Location: `samples/database-crud/postgresql/`
- Uses: pg library or Prisma
- Best for: Relational data, ACID transactions

### Prisma ORM
- Location: `samples/database-crud/prisma-orm/`
- Uses: Prisma Client
- Best for: Type-safe database access

## Key Benefits

✅ **Database Agnostic** - Same Kora code works with any database  
✅ **Type Safe** - Types flow from domain to API to UI  
✅ **No Boilerplate** - Compiler generates API structure  
✅ **Flexible** - Implement repository for your database choice  

## Best Practices

1. **Keep repositories simple** - Just data access
2. **Handle errors** - Throw meaningful errors
3. **Use transactions** - For multi-step operations
4. **Validate input** - In API handlers
5. **Index properly** - For performance

---

**Kora handles the structure, you handle the data!**

