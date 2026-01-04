# Security Best Practices - Kora

Complete security implementation guide for Kora applications.

## Authentication

### Password Security

```kora
// Hash passwords (never store plain text)
let passwordHash = PasswordHash.hash(password)

// Verify passwords
let isValid = PasswordHash.verify(password, hash)
```

**Best Practices:**
- Use bcrypt or Argon2
- Minimum 12 rounds
- Never store plain passwords
- Use salt automatically

### JWT Tokens

```kora
// Generate token
let token = JWT.generate({
  userId: user.id,
  role: user.role,
  permissions: user.permissions
}, expiresIn)

// Verify token
let payload = JWT.verify(token)
```

**Best Practices:**
- Use short expiration (1 hour for access tokens)
- Use refresh tokens for longer sessions
- Store tokens in httpOnly cookies when possible
- Include minimal data in token

### Session Management

```kora
// Create session
let session = {
  id: UUID.generate(),
  userId: user.id,
  token: token,
  expiresAt: Date.now() + expiresIn,
  ipAddress: Request.getIpAddress(),
  userAgent: Request.getUserAgent()
}
SessionRepo.save(session)

// Validate session
let session = SessionRepo.findByToken(token)
if (session == null || session.expiresAt < Date.now()) {
  throw Error("Session expired")
}
```

**Best Practices:**
- Store sessions in database
- Track IP and user agent
- Implement session rotation
- Clean up expired sessions

## Authorization

### Role-Based Access Control (RBAC)

```kora
// Check role
if (authContext.role != UserRole.ADMIN) {
  throw Error("Admin access required")
}

// Multiple roles
if (authContext.role != UserRole.ADMIN && 
    authContext.role != UserRole.MODERATOR) {
  throw Error("Insufficient permissions")
}
```

### Permission-Based Access

```kora
// Check permission
if (!authContext.permissions.contains(Permission.DELETE_POSTS)) {
  throw Error("Insufficient permissions")
}

// Multiple permissions
if (!authContext.permissions.contains(Permission.WRITE_POSTS) ||
    !authContext.permissions.contains(Permission.READ_POSTS)) {
  throw Error("Insufficient permissions")
}
```

## Input Validation

### Email Validation

```kora
if (!EmailValidator.isValid(email)) {
  throw Error("Invalid email format")
}
```

### Password Strength

```kora
if (!PasswordValidator.isStrong(password)) {
  throw Error("Password must be at least 8 characters with uppercase, lowercase, number, and special character")
}
```

### Input Sanitization

```kora
// Sanitize user input
let sanitized = InputSanitizer.sanitize(userInput)

// Validate types
if (typeof value != "string") {
  throw Error("Invalid input type")
}
```

### SQL Injection Prevention

```kora
// Use parameterized queries (in repository)
UserRepo.query("SELECT * FROM users WHERE id = ?", [id])
// NOT: "SELECT * FROM users WHERE id = " + id
```

## API Security

### Rate Limiting

```kora
@rateLimit(maxRequests: 100, windowMs: 60000)
api login {
  // Login logic
}
```

### CORS Configuration

```kora
@cors(origins: ["https://example.com"])
api publicApi {
  // API logic
}
```

### HTTPS Only

```kora
@requireHttps
api sensitiveApi {
  // API logic
}
```

## Data Protection

### Sensitive Data

```kora
// Never return password hashes
return {
  id: user.id,
  email: user.email,
  name: user.name
  // passwordHash: NOT INCLUDED
}
```

### Data Encryption

```kora
// Encrypt sensitive data
let encrypted = Encryption.encrypt(sensitiveData, key)

// Decrypt when needed
let decrypted = Encryption.decrypt(encrypted, key)
```

## Error Handling

### Don't Leak Information

```kora
// Bad
throw Error("User with email admin@example.com not found")

// Good
throw Error("Invalid email or password")
```

### Logging

```kora
// Log security events
SecurityLogger.log({
  event: "failed_login",
  email: email,
  ipAddress: Request.getIpAddress(),
  timestamp: Date.now()
})
```

## Route Protection

### Public Routes

```kora
page Login {
  @public
  view() { /* Login form */ }
}
```

### Protected Routes

```kora
page Dashboard {
  @requireAuth
  @redirectUnauthenticated("/login")
  view() { /* Dashboard */ }
}
```

### Role-Based Routes

```kora
page AdminPanel {
  @requireAuth
  @requireRole(ADMIN)
  @redirectUnauthorized("/dashboard")
  view() { /* Admin panel */ }
}
```

## Security Headers

Kora automatically adds security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

## Checklist

- [ ] Passwords are hashed (never plain text)
- [ ] JWT tokens have short expiration
- [ ] Sessions are validated
- [ ] Input is validated and sanitized
- [ ] SQL injection prevented (parameterized queries)
- [ ] Role-based access control implemented
- [ ] Permission checks in place
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] HTTPS enforced
- [ ] Sensitive data not exposed
- [ ] Error messages don't leak information
- [ ] Security events logged

---

**Security is built into Kora's architecture!**

