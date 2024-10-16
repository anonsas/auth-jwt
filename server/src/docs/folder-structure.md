Controllers:

Handle HTTP requests and responses.
Perform basic validation (or delegate it to middleware).
Call the service layer for business logic.
Send a response to the client.
Why: Keeps the controller focused on request handling, ensuring clean separation of concerns. This allows controllers to stay lightweight and easy to maintain.

Models:

Define the database schema and interact with the database.
Represent the data structure of your application.
Why: Encapsulates data structure and ensures consistency when interacting with the database. Changes to data structure remain isolated here.

Services:

Handle business logic (e.g., authentication, validation, data manipulation).
Interact with the models to query or update the database.
Ensure proper separation of concerns by keeping logic outside the controller.
Why: Centralizes the business logic in one place. If the business rules change, you only need to modify the service, not the controller.

Separation of Concerns: Ensure that controllers are responsible only for handling HTTP requests and delegating logic to the service layer. Services should contain the business logic, while models should focus on interacting with the database.
