# Routing & Security Guide - Kora

Complete guide to implementing routing and security in Kora applications.

## Route Protection

### Public Routes

Routes that don't require authentication:

```kora
page Login {
  @public
  
  view() {
    <div>Login form</div>
  }
}
```

### Protected Routes

Routes that require authentication:

```kora
page Dashboard {
  @requireAuth
  
  load() -> User
  view(user: User) {
    <div>Welcome {user.name}</div>
  }
}
```

### Role-Based Routes

Routes that require specific roles:

```kora
page AdminPanel {
  @requireAuth
  @requireRole(ADMIN)
  
  load() -> AdminData
  view(data: AdminData) {
    <div>Admin content</div>
  }
}
```

### Permission-Based Routes

Routes that require specific permissions:

```kora
page EditPost {
  @requireAuth
  @requirePermission(WRITE_POSTS)
  
  load(id: UUID) -> Post
  view(post: Post) {
    <div>Edit post</div>
  }
}
```

## API Security

### Public APIs

```kora
api getPublicData {
  @public
  
  input { limit: Number? }
  output Post[]
  handler {
    return PostRepo.findPublic(limit || 10)
  }
}
```

### Protected APIs

```kora
api getProfile {
  @requireAuth
  
  input {}
  output User
  handler {
    let authContext = Request.getAuthContext()
    return UserRepo.findById(authContext.userId)
  }
}
```

### Role-Based APIs

```kora
api adminAction {
  @requireAuth
  @requireRole(ADMIN)
  
  input { action: String }
  output { success: Boolean }
  handler {
    // Admin-only logic
  }
}
```

### Permission-Based APIs

```kora
api deletePost {
  @requireAuth
  @requirePermission(DELETE_POSTS)
  
  input { id: UUID }
  output Boolean
  handler {
    PostRepo.delete(id)
    return true
  }
}
```

## Authentication Flow

### 1. Login

```kora
api login {
  input {
    email: Email
    password: String
  }
  output {
    user: User
    token: String
  }
  handler {
    // Verify credentials
    // Generate JWT token
    // Create session
    // Return user and token
  }
}
```

### 2. Token Verification

```kora
api verifyToken {
  input { token: String }
  output AuthContext
  handler {
    // Verify JWT
    // Check session
    // Return auth context
  }
}
```

### 3. Logout

```kora
api logout {
  input { token: String }
  output Boolean
  handler {
    // Delete session
    return true
  }
}
```

## Middleware/Guards

### Auth Middleware

The compiler generates middleware that:

1. Extracts token from request
2. Verifies JWT token
3. Checks session validity
4. Sets auth context
5. Redirects if unauthorized

### Role Guard

Checks user role before allowing access:

```kora
@requireRole(ADMIN, MODERATOR)
```

### Permission Guard

Checks user permissions:

```kora
@requirePermission(WRITE_POSTS, DELETE_POSTS)
```

## Input Validation

### Email Validation

```kora
if (!EmailValidator.isValid(email)) {
  throw Error("Invalid email format")
}
```

### Password Validation

```kora
if (!PasswordValidator.isStrong(password)) {
  throw Error("Password must be at least 8 characters...")
}
```

### Input Sanitization

```kora
let sanitized = InputSanitizer.sanitize(userInput)
```

## Security Best Practices

### 1. Password Hashing

```kora
let passwordHash = PasswordHash.hash(password)
let isValid = PasswordHash.verify(password, hash)
```

### 2. JWT Tokens

```kora
let token = JWT.generate({
  userId: user.id,
  role: user.role
}, expiresIn)

let payload = JWT.verify(token)
```

### 3. Session Management

```kora
let session = {
  id: UUID.generate(),
  userId: user.id,
  token: token,
  expiresAt: Date.now() + expiresIn
}
SessionRepo.save(session)
```

### 4. Rate Limiting

```kora
@rateLimit(maxRequests: 100, windowMs: 60000)
api login {
  // Login logic
}
```

### 5. CORS Configuration

```kora
@cors(origins: ["https://example.com"])
api publicApi {
  // API logic
}
```

## Route Redirects

### Unauthenticated Redirect

If user is not authenticated, redirect to login:

```kora
page Dashboard {
  @requireAuth
  @redirectUnauthenticated("/login")
  
  view() {
    // Dashboard content
  }
}
```

### Unauthorized Redirect

If user lacks permission, redirect:

```kora
page AdminPanel {
  @requireRole(ADMIN)
  @redirectUnauthorized("/dashboard")
  
  view() {
    // Admin content
  }
}
```

## Generated Code

Kora generates:

1. **Route Guards** - Check authentication/authorization
2. **Middleware** - Extract and verify tokens
3. **Redirect Logic** - Handle unauthorized access
4. **Type-Safe Auth Context** - Type-safe user context

## Example: Complete Flow

```kora
// 1. Public login page
page Login {
  @public
  view() { /* Login form */ }
}

// 2. Protected dashboard
page Dashboard {
  @requireAuth
  load() -> User
  view(user: User) { /* Dashboard */ }
}

// 3. Admin-only page
page AdminPanel {
  @requireAuth
  @requireRole(ADMIN)
  load() -> AdminData
  view(data: AdminData) { /* Admin panel */ }
}

// 4. Permission-based page
page EditPost {
  @requireAuth
  @requirePermission(WRITE_POSTS)
  load(id: UUID) -> Post
  view(post: Post) { /* Edit form */ }
}
```

---

**Kora handles routing and security automatically!**

