# Publishing to @kora-lang Organization

## Current Issue

The access token needs organization permissions. Here's how to fix it:

## Solution: Generate New Token with Organization Access

### Step 1: Create Granular Access Token

1. Go to: https://www.npmjs.com/settings/upendra.manike/tokens
2. Click "Generate New Token"
3. Select **"Granular Access Token"**
4. Configure:
   - **Token Name**: `kora-lang-publish`
   - **Expiration**: Choose your preference
   - **Type**: Automation
   - **Packages**: Select `@kora-lang/kora` (or all packages)
   - **Permissions**: 
     - ✅ Read packages
     - ✅ Publish packages
5. Click "Generate Token"
6. **Copy the token immediately** (you won't see it again!

### Step 2: Use the New Token

```bash
npm config set //registry.npmjs.org/:_authToken YOUR_NEW_TOKEN_HERE
```

### Step 3: Verify Access

```bash
npm whoami
```

### Step 4: Publish

```bash
npm publish --access public
```

## Alternative: Login with npm CLI

If token doesn't work, try logging in directly:

```bash
npm login
```

Then publish:
```bash
npm publish --access public
```

## Important: Organization Membership

Make sure you're a member of the `@kora-lang` organization:

1. Go to: https://www.npmjs.com/org/kora-lang
2. Check "Members" tab
3. Ensure `upendra.manike` is listed with publish permissions
4. If not, add yourself or have the org owner add you

## Quick Test

After setting up the token, test with:

```bash
npm whoami
npm view @kora-lang/kora
```

If both work, you're ready to publish!

---

**Once you have the new token, run:**
```bash
npm config set //registry.npmjs.org/:_authToken YOUR_NEW_TOKEN
npm publish --access public
```


