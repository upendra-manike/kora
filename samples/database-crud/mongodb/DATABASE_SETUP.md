# MongoDB Setup for Kora

## Installation

```bash
npm install mongodb
# or
npm install mongoose
```

## Database Connection

### Using MongoDB Native Driver

```typescript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
await client.connect();
const db = client.db('myapp');
const usersCollection = db.collection('users');
```

### Using Mongoose

```typescript
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGODB_URI!);
```

## Repository Implementation

### UserRepo for MongoDB

```typescript
import { Collection } from 'mongodb';

export class UserRepo {
  private static collection: Collection = db.collection('users');

  static async findById(id: string): Promise<User | null> {
    return await this.collection.findOne({ id });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await this.collection.findOne({ email });
  }

  static async find(query: any, limit: number, offset: number): Promise<User[]> {
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

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/myapp
# or
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/myapp
```

## Using with Kora

1. Write Kora code (domain, API, UI)
2. Compile with `kora build`
3. Implement repository layer with MongoDB
4. Use generated API handlers

---

**Kora generates the structure, you implement the database layer!**

