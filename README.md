## TOKENS

JWT (JSON Web Token) is a token-based authentication mechanism used for secure access to resources.  
Each JWT has an **expiry date**, after which it becomes invalid.  
This expiration is critical for **security**, limiting how long a token can be used if compromised.

For example, if a hacker steals a token and it has an expiry of **15 minutes**,  
the hacker can only access the server for 15 minutes before the token becomes invalid.  
After that, the token cannot be used to access protected resources.

### Why do we need a refresh token?

Should the user have to log in every 15 minutes when the token expires? No, that’s where **refresh tokens** come in.

- **Access Token**: Valid for a short period (typically 15-30 minutes). It's used to access the server and is usually stored in **memory** or **localStorage**.
- **Refresh Token**: Valid for a longer period (typically 15-60 days). Its role is to issue new access tokens when the current one expires.  
  This token is stored securely in **HTTP-only cookies** to prevent it from being accessed by JavaScript (which adds protection against XSS attacks).

## Token Flow:

1. **Login Flow**:

   - Client:  
     `POST /login {email: igor@gmail.com, password: abc123}`
   - Server:
     - Generates `{accessToken, refreshToken}`
     - Saves the **Refresh Token** in an HTTP-only cookie.
     - Returns the **Access Token** to the client.

2. **Authenticated Request**:

   - Client:  
     `GET /products, headers: Authorization: Bearer ${accessToken}`
   - Server:
     - Verifies **Access Token**.
     - If valid:  
       `HTTP 200 {data: products}`
     - If expired:  
       `HTTP 401 {message: "Unauthorized"}`

3. **Access Token Refresh**:
   - Client detects `HTTP 401` and sends:  
     `GET /api/refresh` (no additional token needed, the **Refresh Token** is included automatically in cookies)
   - Server:
     - Verifies **Refresh Token**.
     - If valid:
       - Issues new `{accessToken, refreshToken}`
       - Updates cookies and sends the new **Access Token** to the client for further use.
     - If invalid:  
       `HTTP 401 {message: "Invalid refresh token"}` → Client must log in again.

## Important Security Considerations:

1. **Never store sensitive tokens (like Refresh Tokens) in localStorage**. Always store them in **HTTP-only cookies** to prevent XSS attacks.
2. **Use HTTPS**: Ensure all token exchange happens over secure HTTPS to protect against man-in-the-middle attacks.
3. **Token rotation**: Consider implementing **token rotation** for enhanced security.  
   Each time the refresh token is used, issue a new one to the client, ensuring old refresh tokens cannot be reused.
4. **Logout**: When logging out, clear both the **Access Token** and **Refresh Token** (clear the HTTP-only cookie from the server).
