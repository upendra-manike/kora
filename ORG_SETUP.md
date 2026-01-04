# Setting Up @kora-lang Organization

## Steps to Publish Under Organization

### 1. Add Yourself to the Organization

1. Go to: https://www.npmjs.com/org/kora-lang
2. Click "Members" or "Settings"
3. Add yourself (`upendra.manike`) as a member with **publish** permissions
4. Accept the invitation if sent

### 2. Refresh Access Token

The access token may have expired. You can:

**Option A: Use the token again**
```bash
npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN_HERE
```

**Option B: Login again**
```bash
npm login
```

### 3. Verify Organization Access

Check if you can access the organization:
```bash
npm org ls kora-lang
```

### 4. Publish

Once you're added to the organization, try publishing:

```bash
npm publish --access public
```

## Alternative: Publish as Organization Owner

If you created the organization, you should automatically be the owner. The issue might be:

1. **Token permissions** - Make sure your token has organization publish permissions
2. **Organization settings** - Check organization settings on npmjs.com
3. **Package name** - Ensure the package name matches exactly: `@kora-lang/kora`

## Quick Check

Run this to see your organizations:
```bash
npm org ls
```

If `kora-lang` appears, you're a member. If not, you need to add yourself.

---

**After adding yourself to the organization, try publishing again!**

