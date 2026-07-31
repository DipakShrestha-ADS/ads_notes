# Campus Store API Plan

## Resources

- User: a person who registers, logs in, and may own products.
- Product: the main resource that people browse and administrators manage.
- Order: a later transaction connecting a user to a product.

## Planned Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /products | Browse products |
| GET | /products/:id | Read one product |
| POST | /products | Create a product |
| PUT | /products/:id | Replace product details |
| DELETE | /products/:id | Delete a product |
| POST | /auth/register | Register a user |
| POST | /auth/login | Log in |
| GET | /orders | Read the current user's orders |
| POST | /orders | Create an order |

Route parameters identify one resource. Query parameters filter a list. JSON request bodies carry create or update data.
