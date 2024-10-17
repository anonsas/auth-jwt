## TOKENS: ACCESS, REFRESH.

# JWT Authentication in MERN Stack

JWT (JSON Web Token) is a token-based authentication mechanism used for secure access to resources.  
 Each JWT has an **expiry date**, after which it becomes invalid.  
 This expiration is critical for **security**, limiting how long a token can be used if compromised.

For example, if a hacker steals a token and it has an expiry of **15 minutes**,  
the hacker can only access the server for 15 minutes before the token becomes invalid.  
After that, the token cannot be used to access protected resources.

## Why Do We Need a Refresh Token?

Should the user have to log in every 15 minutes when the access token expires?  
 No, that’s where **refresh tokens** come in.

- **Access Token**: Valid for a short period (typically 15-30 minutes).  
  It's used to access the server and is usually stored in **memory** or **localStorage**.
- **Refresh Token**: Valid for a longer period (typically 15-60 days).  
  Its role is to issue new access token when the current one expires.  
  This token is stored securely in **HTTP-only cookies** to prevent it from being accessed  
  by JavaScript (which adds protection against XSS attacks).

## Token Flow

### 1. Login Flow

- **Client**:
  ```http
  POST /login {email: igor@gmail.com, password: abc123}
  ```
- **Server**:
  - Generates `{accessToken, refreshToken}`
  - Saves the **Refresh Token** in an HTTP-only cookie.
  - Returns the **Access Token** to the client.

### 2. Authenticated Request

- **Client**:
  ```http
  GET /products, headers: Authorization: Bearer ${accessToken}
  ```
- **Server**:
  - Verifies **Access Token**.
  - If valid:
    ```http
    HTTP 200 {data: products}
    ```
  - If expired:
    ```http
    HTTP 401 {message: "Unauthorized"}
    ```

### 3. Access Token Refresh

- **Client** detects `HTTP 401` and sends:
  ```http
  GET /api/refresh
  ```
  (no additional token needed, the **Refresh Token** is included automatically in cookies)
- **Server**:
  - Verifies **Refresh Token**.
  - If valid:
    - Issues new `{accessToken, refreshToken}`
    - Updates cookies and sends the new **Access Token** to the client for further use.
  - If invalid:
    ```http
    HTTP 401 {message: "Invalid refresh token"}
    ```
    → Client must log in again.

## Important Security Considerations

1. **Never store sensitive tokens (like Refresh Tokens) in localStorage**. Always store them in **HTTP-only cookies** to prevent XSS attacks.
2. **Use HTTPS**: Ensure all token exchange happens over secure HTTPS to protect against man-in-the-middle attacks.
3. **Token rotation**: Consider implementing **token rotation** for enhanced security. Each time the refresh token is used, issue a new one to the client, ensuring old refresh tokens cannot be reused.
4. **Logout**: When logging out, clear both the **Access Token** and **Refresh Token** (clear the HTTP-only cookie from the server).

---

# How Refresh Tokens with HTTP-only Cookies Work

HTTP-only cookies are a secure way to handle **Refresh Tokens** because they are not accessible  
via JavaScript and are automatically sent by the browser with every request to the appropriate server endpoint.

### Flow of Storing and Using the Refresh Token

#### 1. Server-side Storage

- When a user logs in, the server sends a **Set-Cookie** header containing the **Refresh Token** in the HTTP response.
- The cookie is marked as **HTTP-only**, meaning that it is inaccessible from JavaScript, which protects against **Cross-Site Scripting (XSS)** attacks.

Example of **Set-Cookie** header:

- **HttpOnly**: Prevents JavaScript access to the cookie.
- **Secure**: Ensures the cookie is only sent over **HTTPS**.
- **Max-Age**: Defines the validity period of the cookie (e.g., 30 days).
- **SameSite**: Restricts the cookie from being sent with cross-site requests.

### Example of Setting HTTP-only Cookie in Node.js

To set an HTTP-only cookie in a Node.js server, you can use the `res.cookie` method provided by the `express` framework. Here's an example:

```javascript
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Authenticate user and generate tokens
  const accessToken = generateAccessToken(email);
  const refreshToken = generateRefreshToken(email);

  // Set the HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // Ensure this is set to true in production
    path: "/api/refresh",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: "Strict",
  });

  // Send the access token in the response
  res.json({ accessToken });
});
```

In this example:

- `httpOnly: true` ensures the cookie is not accessible via JavaScript.
- `secure: true` ensures the cookie is only sent over HTTPS.
- `path: '/api/refresh'` restricts the cookie to the `/api/refresh` endpoint.
- `maxAge` sets the cookie's expiration time.
- `sameSite: 'Strict'` prevents the cookie from being sent with cross-site requests.

This setup helps in securely storing the refresh token and protecting it from potential attacks.

#### 2. Client-side Handling

- After the server sets the **Refresh Token** as an **HTTP-only cookie**, it is automatically stored by the browser.
- Whenever the client makes requests to a specific path (e.g., `/api/refresh`), the browser automatically  
  sends the **Refresh Token** from the cookie, without any manual effort required by the client.
