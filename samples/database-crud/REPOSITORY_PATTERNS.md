# Repository Implementation Patterns

Complete examples of implementing repositories for different databases with Stratum.

## MongoDB Repository

```typescript
import { Collection, MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
await client.connect();
const db = client.db('myapp');

export class UserRepo {
  private static collection: Collection = db.collection('users');

  static async findById(id: string): Promise<User | null> {
    return await this.collection.findOne({ id });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await this.collection.findOne({ email });
  }

  static async find(
    query: any,
    limit: number,
    offset: number
  ): Promise<User[]> {
    return await this.collection
      .find(query)
      .limit(limit)
      .skip(offset)
      .toArray();
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

## PostgreSQL Repository

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export class UserRepo {
  static async findById(id: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  static async query(
    sql: string,
    params: any[]
  ): Promise<User[]> {
    const result = await pool.query(sql, params);
    return result.rows;
  }

  static async save(user: User): Promise<User> {
    await pool.query(
      `INSERT INTO users (id, name, email, age, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
       name = $2, email = $3, age = $4, role = $5, updated_at = $7`,
      [
        user.id, user.name, user.email, user.age,
        user.role, user.createdAt, user.updatedAt
      ]
    );
    return user;
  }

  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }

  static async beginTransaction(): Promise<void> {
    await pool.query('BEGIN');
  }

  static async commit(): Promise<void> {
    await pool.query('COMMIT');
  }

  static async rollback(): Promise<void> {
    await pool.query('ROLLBACK');
  }
}
```

## MySQL Repository

```typescript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

export class UserRepo {
  static async findById(id: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return (rows as User[])[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return (rows as User[])[0] || null;
  }

  static async query(sql: string, params: any[]): Promise<User[]> {
    const [rows] = await pool.execute(sql, params);
    return rows as User[];
  }

  static async save(user: User): Promise<User> {
    await pool.execute(
      `INSERT INTO users (id, name, email, age, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       name = ?, email = ?, age = ?, role = ?, updated_at = ?`,
      [
        user.id, user.name, user.email, user.age, user.role,
        user.createdAt, user.updatedAt,
        user.name, user.email, user.age, user.role, user.updatedAt
      ]
    );
    return user;
  }

  static async delete(id: string): Promise<void> {
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  }
}
```

## Prisma Repository

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepo {
  static async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });
  }

  static async find(
    where: any,
    limit: number,
    offset: number
  ): Promise<User[]> {
    return await prisma.user.findMany({
      where,
      take: limit,
      skip: offset,
      include: { profile: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async save(user: User): Promise<User> {
    return await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        age: user.age,
        role: user.role,
        updatedAt: user.updatedAt
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      include: { profile: true }
    });
  }

  static async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }
}
```

## Key Points

1. **Same Stratum Code** - Domain, API, UI stay the same
2. **Different Repository** - Implement for your database
3. **Type Safety** - Stratum types flow to repository
4. **Flexibility** - Choose any database or ORM

---

**Stratum defines the structure, you implement the data layer!**


