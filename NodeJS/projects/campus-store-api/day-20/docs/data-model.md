# Campus Store Data Model

## User

Each user has an ID, name, unique email, and timestamps.

## Product

Each product has an ID, title, price, optional description, optional owner, and timestamps.

## Relationship

One User can own many Products. A Product can have one owner. The Product table stores `userId` as its foreign key.
