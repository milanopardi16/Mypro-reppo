# Production Secrets Example

Use these example secrets only as a template. Generate unique values in Railway or a secrets manager before deployment.

## Required Production Secret Samples

- `NEXTAUTH_SECRET`
  - Example: `C3NkLVB4QjJzc0FjNm9LS0pWbGhqV1hYdUlnUWZ5cEM=`
  - Notes: Must be cryptographically random and at least 32 characters.

- `JWT_ACCESS_SECRET`
  - Example: `rV9tV1d5eU1aWm11X3h0eWZ2dXVkZXVnY2Q4cWFaTmE=`
  - Notes: Must be different from `JWT_REFRESH_SECRET` and at least 32 characters.

- `JWT_REFRESH_SECRET`
  - Example: `bENtV2xvZ3dYcGx5V3h1U2p4aW9vZ2VyTnV6Y2RrWmE=`
  - Notes: For refresh tokens, long-lived session signing and rotation.

- `ADMIN_PASSWORD_SALT`
  - Example: `R0dBMjF3Z2VqNWhtV2d6dHJ2bWp4ZmlmV3JvY1V5Q1E=`
  - Notes: Use a random salt string and never reuse across environments.

## How to Generate Secure Values

Use Node.js or a secure secrets manager.

Example command:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

## Reminder

- Never store these values in source control.
- Use Railway project variables or a managed secrets service.
- Rotate secrets before production launch and after any incident.
