# Setting Up npm 2FA for Publishing

## The Issue

npm requires **Two-Factor Authentication (2FA)** to publish packages. This is a security requirement.

## Solution: Enable 2FA on npm

### Option 1: Enable 2FA via Web (Recommended)

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/two-factor-auth
2. Click "Enable Two-Factor Authentication"
3. Choose your preferred method:
   - **Authenticator App** (Google Authenticator, Authy, etc.) - Recommended
   - **SMS** - Less secure but easier
4. Follow the setup instructions
5. Save your backup codes in a safe place!

### Option 2: Use Granular Access Token (Alternative)

If you don't want to enable 2FA on your account, you can use a granular access token:

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click "Generate New Token"
3. Select "Granular Access Token"
4. Set permissions:
   - **Read and Publish** for `@kora-lang/kora`
5. Copy the token
6. Use it to login:

```bash
npm login --auth-type=legacy
# When prompted for password, paste your token
```

Or set it directly:
```bash
npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN_HERE
```

## After Enabling 2FA

Once 2FA is enabled, try publishing again:

```bash
npm publish --access public
```

You'll be prompted for:
1. Your npm password
2. Your 2FA code (from your authenticator app)

## Quick Steps Summary

1. ✅ Enable 2FA on npmjs.com
2. ✅ Try publishing: `npm publish --access public`
3. ✅ Enter password + 2FA code when prompted

## Why 2FA is Required

npm requires 2FA for publishing to:
- Protect your account
- Prevent unauthorized package publishing
- Meet security best practices
- Required for scoped packages like `@kora-lang/kora`

---

**Once 2FA is enabled, you're ready to publish!** 🚀


