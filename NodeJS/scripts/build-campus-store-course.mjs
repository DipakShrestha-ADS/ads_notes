import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const nodeDir = path.resolve(scriptDir, '..');
const projectDir = path.join(nodeDir, 'projects', 'campus-store-api');

const noteFiles = fs.readdirSync(nodeDir)
  .filter(name => /^Day\d+-.*\.md$/.test(name))
  .sort((left, right) => dayFromName(left) - dayFromName(right));

if (noteFiles.length !== 25) {
  throw new Error(`Expected 25 daily notes, found ${noteFiles.length}.`);
}

function dayFromName(name) {
  return Number(name.match(/^Day(\d+)/)?.[1] || 0);
}

function padDay(day) {
  return String(day).padStart(2, '0');
}

function clean(value) {
  return String(value).trim();
}

const levels = [
  {
    title: 'The Store Status Script',
    upgrade: 'You turn the Campus Store idea into its first runnable Node.js program.',
    transfer: 'Turn an assigned project idea into a small program that clearly states what the system will manage.',
    actions: [
      ['Create', 'app.js', 'Print the project name, purpose, first resource, and today’s date.'],
    ],
    install: 'No package installation is needed on this level.',
    behaviors: ['Runs outside the browser with Node.js.', 'Prints a clear Campus Store project introduction.'],
    test: 'Run `node app.js`. The terminal should print the store name, purpose, and current date.',
    next: 'The script works, but it is not yet a real npm project. Level 2 gives it a standard project structure.',
  },
  {
    title: 'A Real npm Project',
    upgrade: 'You move the practice script into the official backend structure and add configuration through npm and environment variables.',
    transfer: 'Create a repeatable foundation that any assigned backend project can use.',
    actions: [
      ['Delete', 'app.js', 'The Day 1 practice entry point is replaced by the course-standard entry point.'],
      ['Create', 'package.json', 'Define ES modules and the start and development commands.'],
      ['Generate', 'package-lock.json', 'Lock the exact dependency versions after running `npm install`.'],
      ['Create', '.env.example', 'Document the environment values without committing real secrets.'],
      ['Create', '.gitignore', 'Keep installed dependencies and real environment secrets out of Git.'],
      ['Create', 'src/server.js', 'Load and print the Campus Store configuration.'],
    ],
    install: 'Run `npm install`, then copy `.env.example` to `.env`.',
    behaviors: ['Uses ES module syntax.', 'Reads `PORT` and `STORE_NAME` from `.env`.', 'Runs through `npm start` or `npm run dev`.'],
    test: 'Run `npm start`. You should see the store name and port `8888` in the terminal.',
    next: 'The project has a foundation, but it does not yet have an API design. Level 3 plans the routes before coding them.',
  },
  {
    title: 'The API Blueprint',
    upgrade: 'You design the users, products, and orders API before writing route handlers.',
    transfer: 'Identify the nouns, URLs, request bodies, and responses for any project before implementation begins.',
    actions: [
      ['Create', 'docs/api-plan.md', 'Record resources, routes, sample bodies, status codes, and ownership rules.'],
      ['Keep', 'src/server.js', 'The runtime checkpoint from Level 2 still runs unchanged.'],
    ],
    install: 'No new package is required.',
    behaviors: ['Documents RESTful product and user URLs.', 'Distinguishes route parameters, query parameters, and request bodies.'],
    test: 'Review every planned URL and confirm it uses a resource noun such as `/products`, not an action such as `/getProducts`.',
    next: 'The route contract is clear, but no client can call it. Level 4 creates the first Express server.',
  },
  {
    title: 'The First Express Counter',
    upgrade: 'You open the Campus Store API counter and accept the first HTTP requests.',
    transfer: 'Create a health route and simple JSON routes for any assigned backend.',
    actions: [
      ['Edit', 'package.json', 'Add Express as today’s only new runtime dependency.'],
      ['Regenerate', 'package-lock.json', 'Record the installed Express dependency tree.'],
      ['Replace', 'src/server.js', 'Create the Express application, JSON parser, routes, and listener.'],
    ],
    install: 'Run `npm install` if you did not complete Level 2.',
    behaviors: ['`GET /` confirms the API is running.', '`GET /about` explains the Campus Store.', '`POST /messages` accepts a JSON message.'],
    test: 'Run `npm run dev`, open `http://localhost:8888`, and test `POST /messages` in Postman or Thunder Client.',
    next: 'The server responds, but it cannot manage store data. Level 5 adds complete product CRUD.',
  },
  {
    title: 'In-Memory Product CRUD',
    upgrade: 'You add products and let a client create, read, update, and delete them.',
    transfer: 'Apply the same CRUD pattern to books, courses, posts, tasks, jobs, vehicles, or another main resource.',
    actions: [
      ['Replace', 'src/server.js', 'Add the product array and all five CRUD route handlers.'],
    ],
    install: 'No new package is required.',
    behaviors: ['Lists and reads products.', 'Creates products with `201 Created`.', 'Updates and deletes products.', 'Returns `404` for missing product IDs.'],
    test: 'Test `GET /products`, `POST /products`, `GET /products/:id`, `PUT /products/:id`, and `DELETE /products/:id`.',
    next: 'CRUD works, but every request reaches a route without common checks. Level 6 introduces middleware.',
  },
  {
    title: 'The Request Checkpoint',
    upgrade: 'You add middleware that logs every request and protects a temporary manager report.',
    transfer: 'Use middleware for work that must happen before many routes, such as logging, authentication, validation, or permissions.',
    actions: [
      ['Edit', '.env.example', 'Document the temporary store key used by the protected middleware.'],
      ['Create', 'src/middlewares/requestLogger.js', 'Log the time, method, and URL for every request.'],
      ['Create', 'src/middlewares/requireStoreKey.js', 'Check the `x-store-key` header on the protected report route.'],
      ['Replace', 'src/server.js', 'Register middleware in the correct order and add `GET /admin/report`.'],
    ],
    install: 'No new package is required.',
    behaviors: ['Logs all requests.', 'Rejects a missing or incorrect store key with `401`.', 'Allows the correct key to reach the report route.'],
    test: 'Call `GET /admin/report` without a header, then repeat with `x-store-key: campus-secret`.',
    next: 'Features work, but `src/server.js` is becoming crowded. Level 7 separates responsibilities into folders.',
  },
  {
    title: 'A Professional Folder Structure',
    upgrade: 'You separate product data, controller logic, routes, middleware, and server startup.',
    transfer: 'Use the same folder responsibilities no matter which entities an assigned project contains.',
    actions: [
      ['Create', 'src/data/products.js', 'Hold temporary product data and ID generation.'],
      ['Create', 'src/controllers/productController.js', 'Move product request and response logic out of the server.'],
      ['Create', 'src/routes/productRoutes.js', 'Map product URLs to controller functions.'],
      ['Edit', 'src/server.js', 'Mount the product router and keep only application wiring.'],
    ],
    install: 'No new package is required.',
    behaviors: ['Keeps all product CRUD routes working.', 'Makes each file responsible for one part of the request flow.'],
    test: 'Repeat every Level 5 product request. The responses should be unchanged after the refactor.',
    next: 'The structure is clean, but logs disappear when the terminal closes. Level 8 writes them to a file.',
  },
  {
    title: 'Persistent Request Logs',
    upgrade: 'You use Node core modules to save request logs and report system information.',
    transfer: 'Use `fs`, `path`, `os`, and `process` whenever an assigned project needs local files or runtime information.',
    actions: [
      ['Create', 'src/middlewares/fileLogger.js', 'Append request details to `logs/requests.log`.'],
      ['Edit', 'src/server.js', 'Register the file logger and add `GET /system`.'],
      ['Create', 'logs/.gitkeep', 'Keep the empty log directory in Git without committing log content.'],
      ['Edit', '.gitignore', 'Ignore generated `.log` files.'],
    ],
    install: 'No new package is required because these modules are built into Node.js.',
    behaviors: ['Writes one log line for every request.', 'Returns platform, Node version, uptime, and free memory.'],
    test: 'Call two routes, open `logs/requests.log`, then call `GET /system`.',
    next: 'The API still forgets products after a restart. Level 9 prepares a PostgreSQL database.',
  },
  {
    title: 'The Database Foundation',
    upgrade: 'You model users and products and start PostgreSQL in a Podman container.',
    transfer: 'Convert real project objects into tables, columns, keys, and relationships.',
    actions: [
      ['Create', 'docker-compose.yaml', 'Define the PostgreSQL service and persistent volume.'],
      ['Create', 'docs/data-model.md', 'Document User and Product tables and their relationship.'],
      ['Edit', '.env.example', 'Add PostgreSQL variables and `DATABASE_URL`.'],
    ],
    install: 'Run `podman compose up -d` to start PostgreSQL.',
    behaviors: ['Runs PostgreSQL on host port `5555`.', 'Preserves database data in a named volume.', 'Documents how a user can own many products.'],
    test: 'Run `podman compose ps`. The `postgres` service should be running.',
    next: 'The database is available, but the API still reads its array. Level 10 connects Node.js with raw SQL.',
  },
  {
    title: 'Products in PostgreSQL',
    upgrade: 'You replace the temporary product array with parameterized PostgreSQL queries.',
    transfer: 'Move any main resource from memory into persistent SQL storage.',
    actions: [
      ['Edit', 'package.json', 'Add the PostgreSQL driver used by the raw SQL connection pool.'],
      ['Regenerate', 'package-lock.json', 'Record the installed PostgreSQL driver dependency tree.'],
      ['Create', 'database/init.sql', 'Create and seed the products table.'],
      ['Create', 'src/db/pool.js', 'Create the shared PostgreSQL connection pool.'],
      ['Replace', 'src/controllers/productController.js', 'Use parameterized CRUD queries.'],
      ['Edit', 'docker-compose.yaml', 'Mount the initialization SQL file.'],
    ],
    install: 'Start with `podman compose up -d`, then run `npm run dev`.',
    behaviors: ['Persists products across API restarts.', 'Uses `$1`, `$2`, and `$3` placeholders instead of unsafe string construction.'],
    test: 'Create a product, restart Node.js, then confirm the product still appears in `GET /products`.',
    next: 'Raw SQL works, but every query is handwritten. Level 11 replaces it with Prisma.',
  },
  {
    title: 'Prisma Replaces Raw SQL',
    upgrade: 'You describe products in a Prisma schema and use Prisma Client for CRUD.',
    transfer: 'Use models and migrations to keep database structure and application code synchronized.',
    actions: [
      ['Edit', 'package.json', 'Add Prisma, Prisma Client, and the PostgreSQL adapter plus database scripts.'],
      ['Regenerate', 'package-lock.json', 'Record the Prisma dependency tree.'],
      ['Edit', '.gitignore', 'Ignore the generated Prisma client.'],
      ['Delete', 'database/init.sql', 'Prisma migrations now own the database structure.'],
      ['Delete', 'src/db/pool.js', 'Controllers use the Prisma client instead of the raw pool.'],
      ['Create', 'prisma/schema.prisma', 'Define the Product model.'],
      ['Create', 'prisma/prisma.config.js', 'Point Prisma to the schema, migrations, and environment URL.'],
      ['Create', 'prisma/migrations/20260731000100_create_products/migration.sql', 'Record the first reproducible schema change.'],
      ['Create', 'src/db/prisma.js', 'Export one configured Prisma client.'],
      ['Replace', 'src/controllers/productController.js', 'Use Prisma CRUD methods.'],
    ],
    install: 'Run `npx prisma generate --config prisma/prisma.config.js`, then `npx prisma migrate dev --config prisma/prisma.config.js --name create_products`.',
    behaviors: ['Uses a generated type-safe query client.', 'Tracks database changes through migrations.'],
    test: 'Open `npx prisma studio --config prisma/prisma.config.js`, create a product through the API, and confirm the row appears.',
    next: 'Database operations work, but invalid input can still enter the system. Level 12 adds validation and consistent errors.',
  },
  {
    title: 'Validation and Safe Errors',
    upgrade: 'You validate product input with Zod and send errors through one global handler.',
    transfer: 'Define clear input rules for every create and update operation in an assigned project.',
    actions: [
      ['Edit', 'package.json', 'Add Zod as today’s input-validation dependency.'],
      ['Regenerate', 'package-lock.json', 'Record the installed Zod dependency.'],
      ['Create', 'src/schemas/productSchemas.js', 'Define create and update validation rules.'],
      ['Create', 'src/middlewares/errorHandler.js', 'Convert unexpected failures into safe JSON responses.'],
      ['Replace', 'src/controllers/productController.js', 'Validate input before calling Prisma and forward unexpected errors.'],
      ['Edit', 'src/server.js', 'Register the error handler after every route.'],
    ],
    install: 'Run `npm install` to install Zod from this checkpoint.',
    behaviors: ['Rejects missing titles and non-positive prices.', 'Returns field-level validation details.', 'Prevents internal error details from leaking to clients.'],
    test: 'Send a product with an empty title and negative price. Expect `400` with field errors.',
    next: 'Products are safe, but the store has no persistent users. Level 13 completes the first two-module milestone.',
  },
  {
    title: 'Milestone One: Users and Products',
    upgrade: 'You add users, connect products to their owners, and complete a structured two-module API.',
    transfer: 'Add a second related resource and keep both modules consistent.',
    actions: [
      ['Replace', 'prisma/schema.prisma', 'Add User and the optional Product owner relationship.'],
      ['Create', 'src/schemas/userSchemas.js', 'Validate user creation and updates.'],
      ['Create', 'src/controllers/userController.js', 'Implement user CRUD with Prisma.'],
      ['Create', 'src/routes/userRoutes.js', 'Expose the user endpoints.'],
      ['Edit', 'src/controllers/productController.js', 'Accept and return the owning user.'],
      ['Edit', 'src/server.js', 'Mount `/users`.'],
    ],
    install: 'Run `npx prisma migrate dev --config prisma/prisma.config.js --name add_users_and_product_owner` and `npx prisma generate --config prisma/prisma.config.js`.',
    behaviors: ['Provides User and Product CRUD.', 'Can assign a product to a user.', 'Returns product owner information.'],
    test: 'Create a user, create a product with that `userId`, then read the product and confirm the owner is included.',
    next: 'Users exist, but anyone can pretend to be any user. Level 14 adds real authentication.',
  },
  {
    title: 'Registration and Login',
    upgrade: 'You hash passwords, issue JWTs, and add a protected profile route.',
    transfer: 'Add identity whenever an assigned project must know who is making a request.',
    actions: [
      ['Edit', 'package.json', 'Add bcrypt and JSON Web Token for secure identity handling.'],
      ['Regenerate', 'package-lock.json', 'Record the authentication dependency tree.'],
      ['Replace', 'prisma/schema.prisma', 'Add the hashed password field to User.'],
      ['Create', 'src/schemas/authSchemas.js', 'Validate registration and login bodies.'],
      ['Create', 'src/controllers/authController.js', 'Register users, compare passwords, issue tokens, and return profiles.'],
      ['Create', 'src/middlewares/authenticate.js', 'Verify bearer tokens and attach the user identity.'],
      ['Create', 'src/routes/authRoutes.js', 'Expose register, login, and profile endpoints.'],
      ['Edit', '.env.example', 'Document `JWT_SECRET`.'],
    ],
    install: 'Run `npm install`, migrate with `add_authentication`, and restart the server.',
    behaviors: ['Never stores plain-text passwords.', 'Returns a token after login.', 'Protects `GET /auth/profile`.'],
    test: 'Register, log in, copy the token, then request `/auth/profile` with `Authorization: Bearer <token>`.',
    next: 'A valid token proves identity, but it does not decide permissions. Level 15 adds roles.',
  },
  {
    title: 'Customer and Admin Permissions',
    upgrade: 'You add CUSTOMER and ADMIN roles and protect product-changing routes.',
    transfer: 'Create permission rules that match the responsibilities in an assigned system.',
    actions: [
      ['Edit', 'package.json', 'Add the repeatable database seed command.'],
      ['Replace', 'prisma/schema.prisma', 'Add the Role enum and User role field.'],
      ['Edit', 'src/controllers/authController.js', 'Include the role in JWTs and profile responses.'],
      ['Create', 'src/middlewares/authorize.js', 'Allow only listed roles to continue.'],
      ['Edit', 'src/routes/productRoutes.js', 'Require ADMIN for create, update, and delete.'],
      ['Create', 'prisma/seed.js', 'Create a repeatable development administrator account.'],
    ],
    install: 'Run the role migration, generate Prisma Client, then run `npm run seed`.',
    behaviors: ['Allows everyone to browse products.', 'Allows only administrators to change products.', 'Returns `403` for authenticated users without permission.'],
    test: 'Try to create a product with a CUSTOMER token, then repeat with an ADMIN token.',
    next: 'The catalogue is protected, but a large list is difficult to browse. Level 16 adds professional query features.',
  },
  {
    title: 'A Searchable Product Catalogue',
    upgrade: 'You add pagination, category filters, search, price ranges, and sorting.',
    transfer: 'Build flexible list endpoints without creating a separate route for every filter.',
    actions: [
      ['Replace', 'prisma/schema.prisma', 'Add the Product category field.'],
      ['Edit', 'src/schemas/productSchemas.js', 'Validate the new category field.'],
      ['Replace', 'src/controllers/productController.js', 'Build Prisma `where`, `orderBy`, `skip`, and `take` values from query parameters.'],
    ],
    install: 'Run the category migration and regenerate Prisma Client.',
    behaviors: ['Returns pagination metadata.', 'Combines search, category, price, and sorting filters.', 'Rejects invalid pagination values safely.'],
    test: 'Call `/products?search=book&category=Books&sortBy=price&order=asc&page=1&limit=5`.',
    next: 'Products are easy to find, but they have no images. Level 17 adds file uploads.',
  },
  {
    title: 'Product Image Uploads',
    upgrade: 'You upload a validated image, save its public URL, and serve uploaded files.',
    transfer: 'Use the same flow for avatars, book covers, documents, certificates, or vehicle photos.',
    actions: [
      ['Edit', 'package.json', 'Add Multer as today’s upload dependency.'],
      ['Regenerate', 'package-lock.json', 'Record the installed upload dependency.'],
      ['Edit', '.gitignore', 'Ignore uploaded runtime files while keeping the empty directory.'],
      ['Replace', 'prisma/schema.prisma', 'Add the optional Product image URL.'],
      ['Create', 'src/middlewares/uploadProductImage.js', 'Configure Multer storage, size limits, and image type checks.'],
      ['Edit', 'src/controllers/productController.js', 'Save the uploaded image URL on the product.'],
      ['Edit', 'src/routes/productRoutes.js', 'Add `POST /products/:id/image`.'],
      ['Create', 'uploads/.gitkeep', 'Keep the upload directory while ignoring uploaded content.'],
      ['Edit', 'src/server.js', 'Serve `/uploads` statically.'],
    ],
    install: 'Run `npm install`, migrate with `add_product_image`, and restart the server.',
    behaviors: ['Accepts one product image.', 'Rejects unsupported file types and oversized files.', 'Serves saved files through a public URL.'],
    test: 'Upload an image with form-data field `image`, then open the returned image URL in the browser.',
    next: 'The API works, but another developer must guess how to call it. Level 18 adds interactive documentation.',
  },
  {
    title: 'Interactive API Documentation',
    upgrade: 'You describe the store API with OpenAPI and expose Swagger UI.',
    transfer: 'Document routes, parameters, bodies, security, and examples for any assigned project.',
    actions: [
      ['Edit', 'package.json', 'Add the Swagger document generator and interactive UI packages.'],
      ['Regenerate', 'package-lock.json', 'Record the installed documentation dependencies.'],
      ['Create', 'src/config/swagger.js', 'Define the OpenAPI document and bearer authentication scheme.'],
      ['Edit', 'src/routes/productRoutes.js', 'Add OpenAPI route descriptions and schemas.'],
      ['Edit', 'src/server.js', 'Mount Swagger UI at `/api-docs`.'],
    ],
    install: 'Run `npm install` to install Swagger packages.',
    behaviors: ['Shows interactive documentation at `/api-docs`.', 'Explains bearer tokens and product query parameters.'],
    test: 'Open `http://localhost:8888/api-docs`, authorize with an admin token, and call a documented route.',
    next: 'Documented routes are easier to use, but public APIs also need defensive limits. Level 19 adds security middleware.',
  },
  {
    title: 'Security at the Front Door',
    upgrade: 'You add security headers, restricted CORS, and request rate limits.',
    transfer: 'Apply a minimum security baseline before publishing any assigned project.',
    actions: [
      ['Edit', 'package.json', 'Add Helmet, CORS, and Express Rate Limit.'],
      ['Regenerate', 'package-lock.json', 'Record the installed security dependency tree.'],
      ['Create', 'src/config/security.js', 'Build the shared CORS and rate-limit configuration.'],
      ['Edit', 'src/server.js', 'Register Helmet, CORS, general limits, and stricter authentication limits.'],
      ['Edit', '.env.example', 'Document `ALLOWED_ORIGIN`.'],
    ],
    install: 'Run `npm install` to install Helmet, CORS, and Express Rate Limit.',
    behaviors: ['Adds defensive HTTP headers.', 'Allows only the configured frontend origin.', 'Slows repeated authentication attacks.'],
    test: 'Inspect response headers, test an unapproved browser origin, and exceed the authentication request limit.',
    next: 'The API blocks common abuse, but diagnosing real failures still needs durable logs. Level 20 adds structured logging.',
  },
  {
    title: 'Evidence-Based Debugging',
    upgrade: 'You add Morgan request logs and Winston application and error logs.',
    transfer: 'Record enough context to reproduce failures instead of guessing what happened.',
    actions: [
      ['Edit', 'package.json', 'Add Morgan and Winston for request and application logging.'],
      ['Regenerate', 'package-lock.json', 'Record the installed logging dependency tree.'],
      ['Create', 'src/config/logger.js', 'Configure console and file transports.'],
      ['Edit', 'src/middlewares/errorHandler.js', 'Log method, URL, message, and stack before responding.'],
      ['Edit', 'src/server.js', 'Connect Morgan output to Winston.'],
    ],
    install: 'Run `npm install` to install Morgan and Winston.',
    behaviors: ['Records structured request and error events.', 'Keeps sensitive response details away from clients.', 'Provides stack traces during development.'],
    test: 'Call a valid route and an intentionally invalid one, then inspect `logs/combined.log` and `logs/error.log`.',
    next: 'Logs explain failures after they happen. Level 21 adds automated tests that catch failures earlier.',
  },
  {
    title: 'Automated API Tests',
    upgrade: 'You separate Express configuration from network startup and test the app with Jest and Supertest.',
    transfer: 'Test behavior through HTTP without manually opening Postman for every change.',
    actions: [
      ['Edit', 'package.json', 'Add Jest, Supertest, and the test command.'],
      ['Regenerate', 'package-lock.json', 'Record the installed test dependency tree.'],
      ['Edit', '.gitignore', 'Ignore generated test coverage.'],
      ['Create', 'src/app.js', 'Configure and export Express without calling `listen`.'],
      ['Replace', 'src/server.js', 'Import the configured app and start the network listener.'],
      ['Create', 'tests/health.test.js', 'Test the health route, unknown routes, and security headers.'],
      ['Edit', 'package.json', 'Add the Jest test command.'],
    ],
    install: 'Run `npm install`, then run `npm test`.',
    behaviors: ['Keeps `src/server.js` as the entry point.', 'Runs API integration tests without opening port `8888`.'],
    test: 'Run `npm test`. Every health, 404, and security test should pass.',
    next: 'Tests prove behavior on your machine, but setup can still differ elsewhere. Level 22 containerizes the full stack.',
  },
  {
    title: 'A Reproducible Container Stack',
    upgrade: 'You package the API and run it beside PostgreSQL through Podman Compose.',
    transfer: 'Give another machine the same runtime, dependencies, commands, and service network.',
    actions: [
      ['Create', 'Dockerfile', 'Build the production Node.js image.'],
      ['Create', '.dockerignore', 'Keep local dependencies, secrets, logs, and uploads out of the image.'],
      ['Replace', 'docker-compose.yaml', 'Run the app and database as connected services.'],
    ],
    install: 'Run `podman compose up --build`.',
    behaviors: ['Builds the API image reproducibly.', 'Connects to PostgreSQL using service hostname `postgres`.', 'Keeps secrets outside the image.'],
    test: 'Open `http://localhost:8888` while both compose services are running, then inspect `podman compose logs app`.',
    next: 'The stack is portable, but it is not yet prepared for a public host. Level 23 adds production deployment configuration.',
  },
  {
    title: 'Production Preparation',
    upgrade: 'You add a production health check, build command, and Render service definition.',
    transfer: 'Separate local and production configuration without changing application code.',
    actions: [
      ['Create', 'render.yaml', 'Describe the web service, build command, start command, health path, and environment variables.'],
      ['Edit', 'package.json', 'Add a production build command that generates Prisma Client.'],
      ['Edit', '.env.example', 'Document production-safe placeholders.'],
    ],
    install: 'No new package is required.',
    behaviors: ['Uses the host-provided `PORT` and `DATABASE_URL`.', 'Generates Prisma Client during the build.', 'Exposes `/` as a deployment health check.'],
    test: 'Run `npm run build && npm start` locally with production-style environment values.',
    next: 'The first milestone can be deployed, but the final story still needs a transaction connecting users and products. Level 24 adds orders.',
  },
  {
    title: 'The Orders Module',
    upgrade: 'You combine users and products through an authenticated order transaction.',
    transfer: 'Replace Order with Enrollment, Borrowing, Booking, Application, Submission, Rental, or another project relationship.',
    actions: [
      ['Replace', 'prisma/schema.prisma', 'Add Order and its relationships to User and Product.'],
      ['Create', 'src/schemas/orderSchemas.js', 'Validate product ID and quantity.'],
      ['Create', 'src/controllers/orderController.js', 'Create and list the current user’s orders.'],
      ['Create', 'src/routes/orderRoutes.js', 'Protect order routes with authentication.'],
      ['Edit', 'src/app.js', 'Mount `/orders`.'],
    ],
    install: 'Run the order migration, generate Prisma Client, and restart the API.',
    behaviors: ['Creates an order for the authenticated user.', 'Reads only that user’s orders.', 'Returns related product information.'],
    test: 'Log in, create an order with a valid product ID, then call `GET /orders` with the same token.',
    next: 'The full business flow works. Level 25 verifies, documents, and presents the finished project.',
  },
  {
    title: 'The Complete Campus Store API',
    upgrade: 'You finish the README, final checks, documentation, tests, and presentation path.',
    transfer: 'Use the same completion checklist to submit any assigned backend confidently.',
    actions: [
      ['Create', 'README.md', 'Explain setup, architecture, routes, security, tests, containers, and deployment.'],
      ['Edit', 'tests/health.test.js', 'Keep the final public behavior covered.'],
      ['Review', 'prisma/schema.prisma', 'Confirm User, Product, Role, and Order relationships.'],
      ['Review', 'src/', 'Confirm routes, controllers, schemas, middleware, configuration, and startup are clearly separated.'],
    ],
    install: 'Run `npm install`, `npx prisma generate --config prisma/prisma.config.js`, `npm test`, and `npm start`.',
    behaviors: ['Provides the complete documented Campus Store reference API.', 'Demonstrates the reusable architecture for another assigned domain.'],
    test: 'Run the automated tests, walk through one authenticated order flow, open Swagger UI, and rehearse the README presentation order.',
    next: 'This reference journey is complete. Reuse the same levels to plan, build, test, document, and deploy your own project.',
  },
];

if (levels.length !== 25) {
  throw new Error(`Expected 25 project levels, found ${levels.length}.`);
}

const baseDependencies = {
  dotenv: '^16.6.1',
};

const baseDevDependencies = {
  nodemon: '^3.1.10',
};

function dependenciesForDay(day) {
  const dependencies = { ...baseDependencies };
  if (day >= 4) dependencies.express = '^5.1.0';
  if (day >= 10) dependencies.pg = '^8.16.3';
  if (day >= 11) {
    dependencies['@prisma/adapter-pg'] = '^6.19.0';
    dependencies['@prisma/client'] = '^6.19.0';
  }
  if (day >= 12) dependencies.zod = '^4.1.12';
  if (day >= 14) {
    dependencies.bcrypt = '^6.0.0';
    dependencies.jsonwebtoken = '^9.0.2';
  }
  if (day >= 17) dependencies.multer = '^2.0.2';
  if (day >= 18) {
    dependencies['swagger-jsdoc'] = '^6.2.8';
    dependencies['swagger-ui-express'] = '^5.0.1';
  }
  if (day >= 19) {
    dependencies.cors = '^2.8.5';
    dependencies.helmet = '^8.1.0';
    dependencies['express-rate-limit'] = '^8.1.0';
  }
  if (day >= 20) {
    dependencies.morgan = '^1.10.1';
    dependencies.winston = '^3.18.3';
  }
  return dependencies;
}

function devDependenciesForDay(day) {
  const dependencies = { ...baseDevDependencies };
  if (day >= 11) dependencies.prisma = '^6.19.0';
  if (day >= 21) {
    dependencies.jest = '^30.2.0';
    dependencies.supertest = '^7.1.4';
  }
  return dependencies;
}

function packageJson(day) {
  const scripts = {
    start: 'node src/server.js',
    dev: 'nodemon src/server.js',
  };
  if (day >= 11) {
    scripts['db:generate'] = 'prisma generate --config prisma/prisma.config.js';
    scripts['db:migrate'] = 'prisma migrate dev --config prisma/prisma.config.js';
    scripts['db:studio'] = 'prisma studio --config prisma/prisma.config.js';
  }
  if (day >= 15) scripts.seed = 'node prisma/seed.js';
  if (day >= 21) scripts.test = 'npm run db:generate && NODE_OPTIONS=--experimental-vm-modules jest --runInBand';
  if (day >= 23) scripts.build = 'prisma generate --config prisma/prisma.config.js';

  return `${JSON.stringify({
    name: 'campus-store-api',
    version: '1.0.0',
    private: true,
    description: 'Cumulative Campus Store API course project',
    type: 'module',
    main: 'src/server.js',
    scripts,
    dependencies: dependenciesForDay(day),
    devDependencies: devDependenciesForDay(day),
  }, null, 2)}\n`;
}

const envBase = `# Copy this file to .env, then replace every example value.
PORT=8888
STORE_NAME="Campus Store"
`;

const envStoreKey = `${envBase}STORE_KEY=campus-secret
`;

const envDatabase = `${envStoreKey}POSTGRES_USER=campus_user
POSTGRES_PASSWORD=campus_password
POSTGRES_DB=campus_store
POSTGRES_HOST=localhost
POSTGRES_PORT=5555
DATABASE_URL="postgresql://campus_user:campus_password@localhost:5555/campus_store?schema=public"
`;

const envAuth = `${envDatabase}JWT_SECRET=replace_this_with_a_long_random_secret
`;

const envProduction = `${envAuth}ALLOWED_ORIGIN=http://localhost:5173
NODE_ENV=development
`;

function gitignoreForDay(day) {
  const entries = [
    'node_modules/',
    '.env',
  ];
  if (day >= 8) entries.push('logs/*.log', '!logs/.gitkeep');
  if (day >= 11) entries.push('src/generated/');
  if (day >= 17) entries.push('uploads/*', '!uploads/.gitkeep');
  if (day >= 21) entries.push('coverage/');
  return `${entries.join('\n')}\n`;
}

const expressProductData = `export const products = [
  { id: 1, title: 'Notebook', price: 4.5, description: 'A ruled notebook' },
  { id: 2, title: 'Campus Hoodie', price: 28, description: 'A warm campus hoodie' },
];

let nextId = 3;

export function createProductId() {
  const id = nextId;
  nextId += 1;
  return id;
}
`;

const requestLogger = `export function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(\`[\${timestamp}] \${req.method} \${req.originalUrl}\`);
  next();
}
`;

const requireStoreKey = `export function requireStoreKey(req, res, next) {
  const providedKey = req.get('x-store-key');
  const expectedKey = process.env.STORE_KEY || 'campus-secret';

  if (providedKey !== expectedKey) {
    return res.status(401).json({ message: 'A valid store key is required' });
  }

  next();
}
`;

const inMemoryProductController = `import { createProductId, products } from '../data/products.js';

export function getAllProducts(req, res) {
  res.json({ data: products });
}

export function getProductById(req, res) {
  const product = products.find(item => item.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ data: product });
}

export function createProduct(req, res) {
  const { title, price, description = '' } = req.body;
  if (!title || typeof price !== 'number') {
    return res.status(400).json({ message: 'title and numeric price are required' });
  }
  const product = { id: createProductId(), title, price, description };
  products.push(product);
  res.status(201).json({ data: product });
}

export function updateProduct(req, res) {
  const index = products.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  const { title, price, description = '' } = req.body;
  if (!title || typeof price !== 'number') {
    return res.status(400).json({ message: 'title and numeric price are required' });
  }
  products[index] = { ...products[index], title, price, description };
  res.json({ data: products[index] });
}

export function deleteProduct(req, res) {
  const index = products.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  products.splice(index, 1);
  res.status(204).send();
}
`;

const productRoutesBasic = `import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
`;

const composeDatabase = `services:
  postgres:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    ports:
      - "\${POSTGRES_PORT}:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
`;

const prismaConfig = `import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'schema.prisma',
  migrations: {
    path: 'migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
`;

const prismaClient = `import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
`;

const productSchemas = `import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().trim().min(2, 'Title must contain at least 2 characters'),
  price: z.number().positive('Price must be greater than zero'),
  description: z.string().trim().optional(),
  category: z.string().trim().min(2).optional(),
  userId: z.number().int().positive().nullable().optional(),
});

export const updateProductSchema = createProductSchema.partial();
`;

const errorHandler = `export function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : 'An unexpected server error occurred',
  });
}
`;

const prismaProductControllerValidated = `import prisma from '../db/prisma.js';
import { createProductSchema, updateProductSchema } from '../schemas/productSchemas.js';

function validationFailure(res, result) {
  return res.status(400).json({
    message: 'Validation failed',
    errors: result.error.flatten().fieldErrors,
  });
}

export async function getAllProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: products });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  const result = createProductSchema.safeParse(req.body);
  if (!result.success) return validationFailure(res, result);
  try {
    const product = await prisma.product.create({ data: result.data });
    res.status(201).json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  const result = updateProductSchema.safeParse(req.body);
  if (!result.success) return validationFailure(res, result);
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: result.data,
    });
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
`;

const userSchemas = `import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
});

export const updateUserSchema = createUserSchema.partial();
`;

const userController = `import prisma from '../db/prisma.js';
import { createUserSchema, updateUserSchema } from '../schemas/userSchemas.js';

function invalid(res, result) {
  return res.status(400).json({
    message: 'Validation failed',
    errors: result.error.flatten().fieldErrors,
  });
}

export async function getAllUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
    });
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: { products: true },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) return invalid(res, result);
  try {
    const user = await prisma.user.create({ data: result.data });
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) return invalid(res, result);
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: result.data,
    });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
`;

const userRoutes = `import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../controllers/userController.js';

const router = Router();
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
`;

const authSchemas = `import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
`;

const authenticate = `import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const [scheme, token] = (req.get('authorization') || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Bearer token required' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
}
`;

const authorize = `export function authorize(...allowedRoles) {
  return function requireAllowedRole(req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission for this action' });
    }
    next();
  };
}
`;

const authController = `import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';
import { loginSchema, registerSchema } from '../schemas/authSchemas.js';

function tokenFor(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
}

export async function register(req, res, next) {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Validation failed', errors: result.error.flatten().fieldErrors });
  }
  try {
    const existing = await prisma.user.findUnique({ where: { email: result.data.email } });
    if (existing) return res.status(409).json({ message: 'Email is already registered' });
    const password = await bcrypt.hash(result.data.password, 12);
    const user = await prisma.user.create({
      data: { ...result.data, password },
      select: { id: true, name: true, email: true, role: true },
    });
    res.status(201).json({ data: user, token: tokenFor(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ message: 'Invalid login body' });
  try {
    const user = await prisma.user.findUnique({ where: { email: result.data.email } });
    const valid = user && await bcrypt.compare(result.data.password, user.password);
    if (!valid) return res.status(401).json({ message: 'Email or password is incorrect' });
    res.json({ token: tokenFor(user) });
  } catch (error) {
    next(error);
  }
}

export async function profile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}
`;

const authRoutes = `import { Router } from 'express';
import { login, profile, register } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, profile);

export default router;
`;

const seed = `import bcrypt from 'bcrypt';
import prisma from '../src/db/prisma.js';

const password = await bcrypt.hash('Admin123!', 12);
await prisma.user.upsert({
  where: { email: 'admin@campus.test' },
  update: { role: 'ADMIN' },
  create: {
    name: 'Campus Administrator',
    email: 'admin@campus.test',
    password,
    role: 'ADMIN',
  },
});

await prisma.$disconnect();
console.log('Development administrator is ready.');
`;

const productControllerAdvanced = `import prisma from '../db/prisma.js';
import { createProductSchema, updateProductSchema } from '../schemas/productSchemas.js';

function invalid(res, result) {
  return res.status(400).json({ message: 'Validation failed', errors: result.error.flatten().fieldErrors });
}

export async function getAllProducts(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const sortBy = ['title', 'price', 'createdAt'].includes(req.query.sortBy) ? req.query.sortBy : 'createdAt';
    const order = req.query.order === 'asc' ? 'asc' : 'desc';
    const where = {
      ...(req.query.category ? { category: req.query.category } : {}),
      ...(req.query.search ? { title: { contains: req.query.search, mode: 'insensitive' } } : {}),
      ...((req.query.minPrice || req.query.maxPrice) ? {
        price: {
          ...(req.query.minPrice ? { gte: Number(req.query.minPrice) } : {}),
          ...(req.query.maxPrice ? { lte: Number(req.query.maxPrice) } : {}),
        },
      } : {}),
    };
    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);
    res.json({ data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  const result = createProductSchema.safeParse(req.body);
  if (!result.success) return invalid(res, result);
  try {
    const product = await prisma.product.create({ data: result.data });
    res.status(201).json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  const result = updateProductSchema.safeParse(req.body);
  if (!result.success) return invalid(res, result);
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: result.data,
    });
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function uploadProductImage(req, res, next) {
  if (!req.file) return res.status(400).json({ message: 'Select one image file' });
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { imageUrl: \`/uploads/\${req.file.filename}\` },
    });
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
}
`;

const uploadProductImage = `import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(currentDir, '../../uploads');

const storage = multer.diskStorage({
  destination: uploadDir,
  filename(req, file, callback) {
    const safeExtension = path.extname(file.originalname).toLowerCase();
    callback(null, \`\${Date.now()}-\${Math.round(Math.random() * 1e9)}\${safeExtension}\`);
  },
});

export const uploadProductImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    callback(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype));
  },
});
`;

const swaggerConfig = `import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerDocument = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Campus Store API',
      version: '1.0.0',
      description: 'The cumulative reference project for the Node.js course.',
    },
    servers: [{ url: 'http://localhost:8888' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/routes/*.js'],
});
`;

const securityConfig = `import cors from 'cors';
import rateLimit from 'express-rate-limit';

export const corsMiddleware = cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});
`;

const loggerConfig = `import path from 'node:path';
import winston from 'winston';

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new winston.transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join('logs', 'combined.log') }),
  ],
});

export default logger;
`;

const loggedErrorHandler = `import logger from '../config/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error('Request failed', {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: err.stack,
  });
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : 'An unexpected server error occurred',
  });
}
`;

const orderSchemas = `import { z } from 'zod';

export const createOrderSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(20),
});
`;

const orderController = `import prisma from '../db/prisma.js';
import { createOrderSchema } from '../schemas/orderSchemas.js';

export async function createOrder(req, res, next) {
  const result = createOrderSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Validation failed', errors: result.error.flatten().fieldErrors });
  }
  try {
    const product = await prisma.product.findUnique({ where: { id: result.data.productId } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        productId: product.id,
        quantity: result.data.quantity,
        unitPrice: product.price,
      },
      include: { product: true },
    });
    res.status(201).json({ data: order });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: orders });
  } catch (error) {
    next(error);
  }
}
`;

const orderRoutes = `import { Router } from 'express';
import { createOrder, getMyOrders } from '../controllers/orderController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();
router.use(authenticate);
router.get('/', getMyOrders);
router.post('/', createOrder);

export default router;
`;

function schemaForDay(day) {
  const hasUsers = day >= 13;
  const hasAuth = day >= 14;
  const hasRole = day >= 15;
  const hasCategory = day >= 16;
  const hasImage = day >= 17;
  const hasOrders = day >= 24;

  const roleBlock = hasRole ? `enum Role {
  CUSTOMER
  ADMIN
}

` : '';
  const userBlock = hasUsers ? `model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
${hasAuth ? '  password  String\n' : ''}${hasRole ? '  role      Role      @default(CUSTOMER)\n' : ''}  products  Product[]
${hasOrders ? '  orders    Order[]\n' : ''}  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

` : '';
  const orderBlock = hasOrders ? `
model Order {
  id        Int      @id @default(autoincrement())
  quantity  Int
  unitPrice Float
  userId    Int
  productId Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  createdAt DateTime @default(now())
}
` : '';

  return `generator client {
  provider     = "prisma-client-js"
  output       = "../src/generated/prisma"
  moduleFormat = "esm"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

${roleBlock}${userBlock}model Product {
  id          Int       @id @default(autoincrement())
  title       String
  price       Float
  description String?
${hasCategory ? '  category    String    @default("General")\n' : ''}${hasImage ? '  imageUrl    String?\n' : ''}${hasUsers ? '  userId      Int?\n  user        User?     @relation(fields: [userId], references: [id], onDelete: SetNull)\n' : ''}${hasOrders ? '  orders      Order[]\n' : ''}  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
${orderBlock}`;
}

function migrationForDay(day) {
  if (day === 11) {
    return `CREATE TABLE "Product" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
`;
  }
  if (day === 13) {
    return `CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
ALTER TABLE "Product" ADD COLUMN "userId" INTEGER;
ALTER TABLE "Product"
  ADD CONSTRAINT "Product_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
`;
  }
  if (day === 14) {
    return `ALTER TABLE "User" ADD COLUMN "password" TEXT NOT NULL;
`;
  }
  if (day === 15) {
    return `CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN');
ALTER TABLE "User" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'CUSTOMER';
`;
  }
  if (day === 16) {
    return `ALTER TABLE "Product" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'General';
`;
  }
  if (day === 17) {
    return `ALTER TABLE "Product" ADD COLUMN "imageUrl" TEXT;
`;
  }
  if (day === 24) {
    return `CREATE TABLE "Order" (
  "id" SERIAL PRIMARY KEY,
  "quantity" INTEGER NOT NULL,
  "unitPrice" DOUBLE PRECISION NOT NULL,
  "userId" INTEGER NOT NULL,
  "productId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Order"
  ADD CONSTRAINT "Order_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Order"
  ADD CONSTRAINT "Order_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
`;
  }
  return `-- This checkpoint represents the schema shown in prisma/schema.prisma.
-- Run the migration command from the daily note to generate environment-specific SQL.
`;
}

function baseServer(imports = '', middleware = '', routes = '', extras = '') {
  return `import 'dotenv/config';
import express from 'express';
${imports}
const app = express();
app.use(express.json());
${middleware}
app.get('/', (req, res) => {
  res.json({ message: 'Campus Store API is running' });
});

${routes}
${extras}
const port = Number(process.env.PORT) || 8888;
app.listen(port, () => {
  console.log(\`Campus Store API running at http://localhost:\${port}\`);
});
`;
}

function appModule({ imports = '', middleware = '', routes = '', extras = '' } = {}) {
  return `import 'dotenv/config';
import express from 'express';
${imports}
const app = express();
app.use(express.json());
${middleware}
app.get('/', (req, res) => {
  res.json({ message: 'Campus Store API is running' });
});

${routes}
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

${extras}
export default app;
`;
}

function productRoutesForDay(day) {
  const imports = day >= 17 ? `  uploadProductImage,\n` : '';
  const uploadImport = day >= 17 ? `import { uploadProductImage as imageUpload } from '../middlewares/uploadProductImage.js';\n` : '';
  const authImports = day >= 15
    ? `import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
`
    : '';
  const protection = day >= 15 ? `authenticate, authorize('ADMIN'), ` : '';
  const docs = day >= 18 ? `/**
 * @openapi
 * /products:
 *   get:
 *     summary: Browse products
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product list
 */
` : '';

  return `import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
${imports}  updateProduct,
} from '../controllers/productController.js';
${uploadImport}${authImports}
const router = Router();

${docs}router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', ${protection}createProduct);
router.put('/:id', ${protection}updateProduct);
router.delete('/:id', ${protection}deleteProduct);
${day >= 17 ? `router.post('/:id/image', authenticate, authorize('ADMIN'), imageUpload.single('image'), uploadProductImage);\n` : ''}
export default router;
`;
}

function buildSnapshots() {
  const savedLocks = new Map();
  for (let day = 2; day <= 25; day += 1) {
    const lockPath = path.join(projectDir, `day-${padDay(day)}`, 'package-lock.json');
    if (fs.existsSync(lockPath)) savedLocks.set(day, fs.readFileSync(lockPath, 'utf8'));
  }

  fs.rmSync(projectDir, { recursive: true, force: true });
  fs.mkdirSync(projectDir, { recursive: true });

  const files = new Map();
  const manifestDays = [];

  for (let day = 1; day <= 25; day += 1) {
    applyDayChanges(day, files);
    const root = path.join(projectDir, `day-${padDay(day)}`);
    fs.mkdirSync(root, { recursive: true });
    const snapshotFiles = new Map(files);
    if (savedLocks.has(day)) snapshotFiles.set('package-lock.json', savedLocks.get(day));

    for (const [relativePath, contents] of [...snapshotFiles.entries()].sort(([left], [right]) => left.localeCompare(right))) {
      const target = path.join(root, relativePath);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, contents);
    }

    const noteName = noteFiles.find(name => dayFromName(name) === day);
    const orderedFiles = [...snapshotFiles.entries()]
      .sort(([left], [right]) => left.localeCompare(right));
    const orderedFolders = [...new Set(orderedFiles.flatMap(([filePath]) => {
      const segments = filePath.split('/');
      return segments.slice(0, -1).map((_, index) => segments.slice(0, index + 1).join('/'));
    }))].sort();
    manifestDays.push({
      day,
      title: levels[day - 1].title,
      notePath: `NodeJS/${noteName}`,
      rootPath: `NodeJS/projects/campus-store-api/day-${padDay(day)}`,
      entryFile: day === 1 ? 'app.js' : 'src/server.js',
      folders: orderedFolders,
      files: orderedFiles.map(([filePath, contents]) => ({
          path: filePath,
          language: languageFor(filePath),
          size: Buffer.byteLength(contents),
          description: descriptionFor(filePath),
        })),
    });
  }

  const manifest = {
    schemaVersion: 1,
    projectId: 'campus-store-api',
    title: 'Campus Store API',
    description: 'Cumulative runnable checkpoints for the 25-day Node.js course.',
    days: manifestDays,
  };
  fs.writeFileSync(path.join(projectDir, 'snapshots.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

function applyDayChanges(day, files) {
  if (day === 1) {
    files.set('app.js', `const projectName = 'Campus Store';
const purpose = 'Help people browse and manage useful campus products';
const firstResource = 'Product';

console.log(\`Project: \${projectName}\`);
console.log(\`Purpose: \${purpose}\`);
console.log(\`First resource: \${firstResource}\`);
console.log(\`Started on: \${new Date().toLocaleDateString()}\`);
`);
    return;
  }

  if (day === 2) {
    files.delete('app.js');
    files.set('package.json', packageJson(day));
    files.set('.env.example', envBase);
    files.set('.gitignore', gitignoreForDay(day));
    files.set('src/server.js', `import 'dotenv/config';

const port = Number(process.env.PORT) || 8888;
const storeName = process.env.STORE_NAME || 'Campus Store';

console.log(\`\${storeName} project configuration loaded.\`);
console.log(\`The future API will use port \${port}.\`);
`);
    return;
  }

  files.set('package.json', packageJson(day));
  files.set('.gitignore', gitignoreForDay(day));

  if (day === 3) {
    files.set('docs/api-plan.md', `# Campus Store API Plan

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
`);
    return;
  }

  if (day === 4) {
    files.set('src/server.js', `import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Campus Store API is running' });
});

app.get('/about', (req, res) => {
  res.json({ name: 'Campus Store API', purpose: 'Manage campus products' });
});

app.post('/messages', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'message is required' });
  res.status(201).json({ received: message });
});

const port = Number(process.env.PORT) || 8888;
app.listen(port, () => console.log(\`Campus Store API running at http://localhost:\${port}\`));
`);
    return;
  }

  if (day === 5) {
    files.set('src/server.js', `import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

const products = [
  { id: 1, title: 'Notebook', price: 4.5 },
  { id: 2, title: 'Campus Hoodie', price: 28 },
];
let nextId = 3;

app.get('/', (req, res) => res.json({ message: 'Campus Store API is running' }));
app.get('/products', (req, res) => res.json({ data: products }));
app.get('/products/:id', (req, res) => {
  const product = products.find(item => item.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ data: product });
});
app.post('/products', (req, res) => {
  const { title, price } = req.body;
  if (!title || typeof price !== 'number') return res.status(400).json({ message: 'title and numeric price are required' });
  const product = { id: nextId++, title, price };
  products.push(product);
  res.status(201).json({ data: product });
});
app.put('/products/:id', (req, res) => {
  const product = products.find(item => item.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const { title, price } = req.body;
  if (!title || typeof price !== 'number') return res.status(400).json({ message: 'title and numeric price are required' });
  product.title = title;
  product.price = price;
  res.json({ data: product });
});
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  products.splice(index, 1);
  res.status(204).send();
});

const port = Number(process.env.PORT) || 8888;
app.listen(port, () => console.log(\`Campus Store API running at http://localhost:\${port}\`));
`);
    return;
  }

  if (day === 6) {
    files.set('.env.example', envStoreKey);
    files.set('src/middlewares/requestLogger.js', requestLogger);
    files.set('src/middlewares/requireStoreKey.js', requireStoreKey);
    const previous = files.get('src/server.js')
      .replace("import express from 'express';", "import express from 'express';\nimport { requestLogger } from './middlewares/requestLogger.js';\nimport { requireStoreKey } from './middlewares/requireStoreKey.js';")
      .replace('app.use(express.json());', 'app.use(express.json());\napp.use(requestLogger);')
      .replace("app.get('/',", "app.get('/admin/report', requireStoreKey, (req, res) => {\n  res.json({ productCount: products.length, status: 'private manager report' });\n});\n\napp.get('/',");
    files.set('src/server.js', previous);
    return;
  }

  if (day === 7) {
    files.set('src/data/products.js', expressProductData);
    files.set('src/controllers/productController.js', inMemoryProductController);
    files.set('src/routes/productRoutes.js', productRoutesBasic);
    files.set('src/server.js', baseServer(
      `import productRoutes from './routes/productRoutes.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { requireStoreKey } from './middlewares/requireStoreKey.js';
`,
      'app.use(requestLogger);',
      `app.use('/products', productRoutes);
app.get('/admin/report', requireStoreKey, (req, res) => {
  res.json({ status: 'private manager report' });
});`,
    ));
    return;
  }

  if (day === 8) {
    files.set('logs/.gitkeep', '');
    files.set('src/middlewares/fileLogger.js', `import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const logDirectory = path.resolve(currentDir, '../../logs');
const logFile = path.join(logDirectory, 'requests.log');

export async function fileLogger(req, res, next) {
  try {
    await mkdir(logDirectory, { recursive: true });
    await appendFile(logFile, \`\${new Date().toISOString()} \${req.method} \${req.originalUrl}\\n\`);
  } catch (error) {
    console.error('Could not write request log:', error.message);
  }
  next();
}
`);
    files.set('src/server.js', baseServer(
      `import os from 'node:os';
import productRoutes from './routes/productRoutes.js';
import { fileLogger } from './middlewares/fileLogger.js';
import { requestLogger } from './middlewares/requestLogger.js';
`,
      `app.use(requestLogger);
app.use(fileLogger);`,
      `app.use('/products', productRoutes);
app.get('/system', (req, res) => {
  res.json({
    nodeVersion: process.version,
    platform: os.platform(),
    uptimeSeconds: Math.round(process.uptime()),
    freeMemoryBytes: os.freemem(),
  });
});`,
    ));
    return;
  }

  if (day === 9) {
    files.set('.env.example', envDatabase);
    files.set('docker-compose.yaml', composeDatabase);
    files.set('docs/data-model.md', `# Campus Store Data Model

## User

Each user has an ID, name, unique email, and timestamps.

## Product

Each product has an ID, title, price, optional description, optional owner, and timestamps.

## Relationship

One User can own many Products. A Product can have one owner. The Product table stores \`userId\` as its foreign key.
`);
    return;
  }

  if (day === 10) {
    files.set('database/init.sql', `CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO products (title, price, description)
VALUES ('Notebook', 4.50, 'A ruled notebook')
ON CONFLICT DO NOTHING;
`);
    files.set('docker-compose.yaml', composeDatabase.replace('      - pgdata:/var/lib/postgresql/data', '      - pgdata:/var/lib/postgresql/data\n      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql:ro'));
    files.set('src/db/pool.js', `import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default pool;
`);
    files.set('src/controllers/productController.js', `import pool from '../db/pool.js';

export async function getAllProducts(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json({ data: result.rows });
  } catch (error) { next(error); }
}

export async function getProductById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.json({ data: result.rows[0] });
  } catch (error) { next(error); }
}

export async function createProduct(req, res, next) {
  try {
    const { title, price, description = null } = req.body;
    const result = await pool.query(
      'INSERT INTO products (title, price, description) VALUES ($1, $2, $3) RETURNING *',
      [title, price, description],
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (error) { next(error); }
}

export async function updateProduct(req, res, next) {
  try {
    const { title, price, description = null } = req.body;
    const result = await pool.query(
      'UPDATE products SET title = $1, price = $2, description = $3 WHERE id = $4 RETURNING *',
      [title, price, description, req.params.id],
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.json({ data: result.rows[0] });
  } catch (error) { next(error); }
}

export async function deleteProduct(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.status(204).send();
  } catch (error) { next(error); }
}
`);
    files.set('src/server.js', baseServer(
      `import productRoutes from './routes/productRoutes.js';
import { requestLogger } from './middlewares/requestLogger.js';
`,
      'app.use(requestLogger);',
      "app.use('/products', productRoutes);",
      `app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Database request failed' });
});`,
    ));
    return;
  }

  if (day === 11) {
    files.delete('database/init.sql');
    files.delete('src/db/pool.js');
    files.set('docker-compose.yaml', composeDatabase);
    files.set('prisma/schema.prisma', schemaForDay(day));
    files.set('prisma/prisma.config.js', prismaConfig);
    files.set('prisma/migrations/20260731000100_create_products/migration.sql', migrationForDay(day));
    files.set('src/db/prisma.js', prismaClient);
    files.set('src/controllers/productController.js', prismaProductControllerValidated
      .replace("import { createProductSchema, updateProductSchema } from '../schemas/productSchemas.js';\n", '')
      .replace(/  const result = createProductSchema\.safeParse\(req\.body\);[\s\S]*?try \{\n    const product = await prisma\.product\.create\(\{ data: result\.data \}\);/, '  try {\n    const product = await prisma.product.create({ data: req.body });')
      .replace(/  const result = updateProductSchema\.safeParse\(req\.body\);[\s\S]*?try \{\n    const product = await prisma\.product\.update\(\{([\s\S]*?)data: result\.data,/, '  try {\n    const product = await prisma.product.update({$1data: req.body,')
      .replace(/function validationFailure[\s\S]*?\n}\n\n/, '')
      .replaceAll("include: { user: { select: { id: true, name: true, email: true } } },\n      ", '')
    );
    return;
  }

  if (day === 12) {
    files.set('src/schemas/productSchemas.js', productSchemas);
    files.set('src/middlewares/errorHandler.js', errorHandler);
    files.set('src/controllers/productController.js', prismaProductControllerValidated
      .replaceAll("include: { user: { select: { id: true, name: true, email: true } } },\n      ", '')
    );
    files.set('src/server.js', baseServer(
      `import productRoutes from './routes/productRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';
`,
      'app.use(requestLogger);',
      "app.use('/products', productRoutes);",
      'app.use(errorHandler);',
    ));
    return;
  }

  if (day === 13) {
    files.set('prisma/schema.prisma', schemaForDay(day));
    files.set('prisma/migrations/20260731000200_add_users/migration.sql', migrationForDay(day));
    files.set('src/schemas/userSchemas.js', userSchemas);
    files.set('src/controllers/userController.js', userController);
    files.set('src/routes/userRoutes.js', userRoutes);
    files.set('src/controllers/productController.js', prismaProductControllerValidated);
    files.set('src/server.js', baseServer(
      `import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';
`,
      'app.use(requestLogger);',
      `app.use('/products', productRoutes);
app.use('/users', userRoutes);`,
      'app.use(errorHandler);',
    ));
    return;
  }

  if (day === 14) {
    files.set('.env.example', envAuth);
    files.set('prisma/schema.prisma', schemaForDay(day));
    files.set('prisma/migrations/20260731000300_add_authentication/migration.sql', migrationForDay(day));
    files.set('src/schemas/authSchemas.js', authSchemas);
    files.set('src/controllers/authController.js', authController);
    files.set('src/middlewares/authenticate.js', authenticate);
    files.set('src/routes/authRoutes.js', authRoutes);
    files.set('src/server.js', baseServer(
      `import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
`,
      '',
      `app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);`,
      'app.use(errorHandler);',
    ));
    return;
  }

  if (day === 15) {
    files.set('prisma/schema.prisma', schemaForDay(day));
    files.set('prisma/migrations/20260731000400_add_roles/migration.sql', migrationForDay(day));
    files.set('src/middlewares/authorize.js', authorize);
    files.set('src/controllers/authController.js', authController);
    files.set('src/routes/productRoutes.js', productRoutesForDay(day));
    files.set('prisma/seed.js', seed);
    return;
  }

  if (day === 16) {
    files.set('prisma/schema.prisma', schemaForDay(day));
    files.set('prisma/migrations/20260731000500_add_category/migration.sql', migrationForDay(day));
    files.set('src/schemas/productSchemas.js', productSchemas);
    files.set('src/controllers/productController.js', productControllerAdvanced);
    return;
  }

  if (day === 17) {
    files.set('prisma/schema.prisma', schemaForDay(day));
    files.set('prisma/migrations/20260731000600_add_product_image/migration.sql', migrationForDay(day));
    files.set('src/middlewares/uploadProductImage.js', uploadProductImage);
    files.set('src/controllers/productController.js', productControllerAdvanced);
    files.set('src/routes/productRoutes.js', productRoutesForDay(day));
    files.set('uploads/.gitkeep', '');
    files.set('src/server.js', baseServer(
      `import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
`,
      `const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.resolve(currentDir, '../uploads')));`,
      `app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);`,
      'app.use(errorHandler);',
    ));
    return;
  }

  if (day === 18) {
    files.set('src/config/swagger.js', swaggerConfig);
    files.set('src/routes/productRoutes.js', productRoutesForDay(day));
    files.set('src/server.js', baseServer(
      `import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
`,
      `const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.resolve(currentDir, '../uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));`,
      `app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);`,
      'app.use(errorHandler);',
    ));
    return;
  }

  if (day === 19) {
    files.set('.env.example', envProduction);
    files.set('src/config/security.js', securityConfig);
    files.set('src/server.js', baseServer(
      `import path from 'node:path';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger.js';
import { authLimiter, corsMiddleware, generalLimiter } from './config/security.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
`,
      `const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use(helmet());
app.use(corsMiddleware);
app.use(generalLimiter);
app.use('/uploads', express.static(path.resolve(currentDir, '../uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));`,
      `app.use('/auth', authLimiter, authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);`,
      'app.use(errorHandler);',
    ));
    return;
  }

  if (day === 20) {
    files.set('src/config/logger.js', loggerConfig);
    files.set('src/middlewares/errorHandler.js', loggedErrorHandler);
    files.set('src/server.js', baseServer(
      `import path from 'node:path';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import logger from './config/logger.js';
import { swaggerDocument } from './config/swagger.js';
import { authLimiter, corsMiddleware, generalLimiter } from './config/security.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
`,
      `const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use(helmet());
app.use(corsMiddleware);
app.use(generalLimiter);
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use('/uploads', express.static(path.resolve(currentDir, '../uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));`,
      `app.use('/auth', authLimiter, authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);`,
      'app.use(errorHandler);',
    ));
    return;
  }

  if (day === 21) {
    const imports = `import path from 'node:path';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import logger from './config/logger.js';
import { swaggerDocument } from './config/swagger.js';
import { authLimiter, corsMiddleware, generalLimiter } from './config/security.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
`;
    files.set('src/app.js', appModule({
      imports,
      middleware: `const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use(helmet());
app.use(corsMiddleware);
app.use(generalLimiter);
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use('/uploads', express.static(path.resolve(currentDir, '../uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));`,
      routes: `app.use('/auth', authLimiter, authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);`,
      extras: 'app.use(errorHandler);',
    }));
    files.set('src/server.js', `import 'dotenv/config';
import app from './app.js';

const port = Number(process.env.PORT) || 8888;
app.listen(port, () => {
  console.log(\`Campus Store API running at http://localhost:\${port}\`);
});
`);
    files.set('tests/health.test.js', `import request from 'supertest';
import app from '../src/app.js';

describe('Campus Store public API', () => {
  test('GET / returns the health message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/Campus Store API/);
  });

  test('an unknown route returns 404 JSON', async () => {
    const response = await request(app).get('/does-not-exist');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });

  test('Helmet adds a content security policy header', async () => {
    const response = await request(app).get('/');
    expect(response.headers['content-security-policy']).toBeDefined();
  });
});
`);
    return;
  }

  if (day === 22) {
    files.set('Dockerfile', `FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 8888
CMD ["npm", "start"]
`);
    files.set('.dockerignore', `node_modules
.env
.git
logs
uploads
coverage
`);
    files.set('docker-compose.yaml', `services:
  postgres:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    ports:
      - "\${POSTGRES_PORT}:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  app:
    build: .
    restart: always
    depends_on:
      - postgres
    environment:
      PORT: 8888
      DATABASE_URL: "postgresql://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@postgres:5432/\${POSTGRES_DB}?schema=public"
      JWT_SECRET: \${JWT_SECRET}
      ALLOWED_ORIGIN: \${ALLOWED_ORIGIN}
      NODE_ENV: production
    ports:
      - "8888:8888"

volumes:
  pgdata:
`);
    return;
  }

  if (day === 23) {
    files.set('render.yaml', `services:
  - type: web
    name: campus-store-api
    runtime: node
    plan: free
    buildCommand: npm ci && npm run build
    startCommand: npm start
    healthCheckPath: /
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: ALLOWED_ORIGIN
        sync: false
`);
    return;
  }

  if (day === 24) {
    files.set('prisma/schema.prisma', schemaForDay(day));
    files.set('prisma/migrations/20260731000700_add_orders/migration.sql', migrationForDay(day));
    files.set('src/schemas/orderSchemas.js', orderSchemas);
    files.set('src/controllers/orderController.js', orderController);
    files.set('src/routes/orderRoutes.js', orderRoutes);
    files.set('src/app.js', files.get('src/app.js')
      .replace("import userRoutes from './routes/userRoutes.js';", "import userRoutes from './routes/userRoutes.js';\nimport orderRoutes from './routes/orderRoutes.js';")
      .replace("app.use('/users', userRoutes);", "app.use('/users', userRoutes);\napp.use('/orders', orderRoutes);")
    );
    return;
  }

  if (day === 25) {
    files.set('README.md', `# Campus Store API

This project is the cumulative reference implementation for the 25-day Node.js REST API course.

## Run locally

1. Copy \`.env.example\` to \`.env\`.
2. Run \`npm install\`.
3. Start PostgreSQL with \`podman compose up -d postgres\`.
4. Run \`npm run db:migrate\` and \`npm run db:generate\`.
5. Run \`npm run seed\`.
6. Start the API with \`npm run dev\`.

## Main routes

- \`POST /auth/register\`
- \`POST /auth/login\`
- \`GET /auth/profile\`
- \`GET /products\`
- \`POST /products\` for administrators
- \`POST /products/:id/image\` for administrators
- \`GET /orders\` for the authenticated user
- \`POST /orders\` for the authenticated user
- \`GET /api-docs\`

## Verify

Run \`npm test\`, open Swagger UI, and complete one register, login, browse, and order flow.

## Adapt the reference

Keep the architecture and replace Product and Order with the main resource and transaction from your assigned project.
`);
  }
}

function languageFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (path.basename(filePath) === 'Dockerfile') return 'dockerfile';
  if (extension === '.js') return 'javascript';
  if (extension === '.json') return 'json';
  if (extension === '.yaml' || extension === '.yml') return 'yaml';
  if (extension === '.prisma') return 'prisma';
  if (extension === '.sql') return 'sql';
  if (extension === '.md') return 'markdown';
  if (path.basename(filePath).startsWith('.env')) return 'properties';
  if (path.basename(filePath).startsWith('.git')) return 'text';
  return 'text';
}

function descriptionFor(filePath) {
  const name = path.basename(filePath);
  const descriptions = {
    'server.js': 'Application entry point that starts the HTTP server',
    'app.js': 'Express application configuration without network startup',
    'package.json': 'Project scripts and dependency declarations',
    'schema.prisma': 'Prisma database models and relationships',
    'docker-compose.yaml': 'Podman Compose services and volumes',
    'Dockerfile': 'Production container image instructions',
    'README.md': 'Project setup, routes, verification, and adaptation guide',
  };
  return descriptions[name] || `Campus Store project file: ${filePath}`;
}

function treeFor(files) {
  const root = {};
  for (const file of files) {
    let node = root;
    const parts = file.path.split('/');
    parts.forEach((part, index) => {
      if (index === parts.length - 1) node[part] = null;
      else node = node[part] ||= {};
    });
  }

  const lines = ['campus-store-api/'];
  function visit(node, prefix) {
    const entries = Object.entries(node).sort(([leftName, leftValue], [rightName, rightValue]) => {
      if ((leftValue === null) !== (rightValue === null)) return leftValue === null ? 1 : -1;
      return leftName.localeCompare(rightName);
    });
    entries.forEach(([name, value], index) => {
      const last = index === entries.length - 1;
      lines.push(`${prefix}${last ? '└── ' : '├── '}${name}${value === null ? '' : '/'}`);
      if (value !== null) visit(value, `${prefix}${last ? '    ' : '│   '}`);
    });
  }
  visit(root, '');
  return lines.join('\n');
}

function compactSetup(day, headingNumber = 2) {
  if (day < 10 || day > 23) return null;
  const previous = noteFiles.find(name => dayFromName(name) === day - 1);
  const install = levels[day - 1].install;
  const actionLines = levels[day - 1].actions
    .map(([action, filePath, purpose]) => `- **${action} \`${filePath}\`**: ${purpose}`)
    .join('\n');

  return `## ${headingNumber}. Continue the Campus Store Project

Start with the completed Level ${day - 1} checkpoint from [Day ${day - 1}](<${previous}>). If you missed that class, open its project preview and copy that checkpoint before continuing.

${install}

For today’s lesson, work only with these project files:

${actionLines}

The detailed lesson below explains the new concept. The connected Campus Store upgrade at the end shows how these changes fit into the growing project.

`;
}

function storySection(day, manifestDay) {
  const level = levels[day - 1];
  const previous = day > 1 ? noteFiles.find(name => dayFromName(name) === day - 1) : null;
  const next = day < 25 ? noteFiles.find(name => dayFromName(name) === day + 1) : null;
  const guidedStart = day === 1
    ? 'Create a new folder named `campus-store-api`, open it in your code editor, and use it as the project root.'
    : `Copy the complete Level ${day - 1} checkpoint into your working \`campus-store-api\` folder. Keep every existing file unless today’s action table explicitly says to edit, move, or delete it.`;
  const actionRows = level.actions
    .map(([action, filePath, purpose]) => `| ${action} | \`${filePath}\` | ${purpose} |`)
    .join('\n');
  const behaviorLines = level.behaviors.map(value => `- ${value}`).join('\n');
  const tree = treeFor(manifestDay.files);
  const examples = [
    ['Library API', 'Book', 'Member', 'Borrowing'],
    ['Course API', 'Course', 'Learner', 'Enrollment'],
    ['Blog API', 'Post', 'Author', 'Comment or Subscription'],
    ['Job Portal API', 'Job', 'Applicant', 'Application'],
    ['Vehicle Rental API', 'Vehicle', 'Customer', 'Booking'],
  ];
  const mappingRows = examples
    .map(([project, resource, person, transaction]) => `| ${project} | ${resource} | ${person} | ${transaction} |`)
    .join('\n');
  const guidedDetails = level.actions.map(([action, filePath, purpose], index) => {
    const heading = `#### Step ${index + 1} — ${action} \`${filePath}\``;
    const normalizedAction = action.toLowerCase();

    if (normalizedAction === 'delete') {
      return `${heading}

Delete \`${filePath}\` from the project root. ${purpose} After deletion, confirm the path no longer appears in **View Day ${day} Project**.`;
    }

    if (filePath === 'package-lock.json') {
      return `${heading}

Do not type or edit \`package-lock.json\` by hand. ${purpose} Run \`npm install\` from the \`campus-store-api/\` root; npm will create or refresh this exact file automatically.`;
    }

    const fileMeta = manifestDay.files.find(file => file.path === filePath);
    if (!fileMeta) {
      const kind = filePath.endsWith('/') ? 'folder' : 'path';
      return `${heading}

Open the \`${filePath}\` ${kind} and check it against the action table. ${purpose} No code is copied for this step because the checkpoint asks you to ${normalizedAction} an existing ${kind}, not introduce a new code sample.`;
    }

    if (normalizedAction === 'keep') {
      return `${heading}

Leave \`${filePath}\` unchanged. ${purpose} Run today’s test after the other steps to prove that this existing file still behaves correctly.`;
    }

    const absoluteFile = path.join(projectDir, `day-${padDay(day)}`, filePath);
    const contents = fs.readFileSync(absoluteFile, 'utf8').trimEnd();
    return `${heading}

${purpose}

**File: \`${filePath}\`**

~~~${fileMeta.language}
${contents}
~~~

This is the complete Level ${day} version of \`${filePath}\`. ${purpose} Save it at exactly this path before continuing; imports in the checkpoint assume this location.`;
  }).join('\n\n');

  return `## Campus Store Storyline Project - Level ${day}

This section applies today’s lesson to one project that grows throughout the course. Open **View Day ${day} Project** in the notes viewer whenever you want to inspect the complete files for this exact level.

### Story So Far

${day === 1
    ? 'The Campus Store is only an idea. You are about to give that idea its first runnable program.'
    : `Level ${day - 1} is your starting checkpoint. ${previous ? `You can review it in [Day ${day - 1}](<${previous}>).` : ''}`}

${level.upgrade}

### Today’s Project Level

${level.install}

| Action | Path from \`campus-store-api/\` | Why |
| --- | --- | --- |
${actionRows}

Use the paths exactly as shown. A path beginning with \`src/\` belongs inside the \`src\` folder. A file without a folder prefix belongs in the project root beside \`package.json\`.

### Guided Upgrade

1. ${guidedStart}
2. Complete the following file steps from top to bottom. Each heading gives the exact action and path.
3. Run today’s install or migration command from the \`campus-store-api/\` root.
4. Open **View Day ${day} Project** to compare every saved file with the completed checkpoint.

${guidedDetails}

#### Expected result

${level.test}

If a request fails, read the status code and response body first. Then check the terminal, confirm the file path and import path, and restart \`npm run dev\` after configuration changes.

### Completed Level

At the end of Level ${day}, your reference project has this cumulative structure:

\`\`\`text
${tree}
\`\`\`

Your completed checkpoint now:

${behaviorLines}

Completion checklist:

- Every file is stored at the path shown above.
- The project starts without a syntax or missing-module error.
- ${level.test}
- You can explain what today’s new files do without reading the code word for word.

### Use This in Your Assigned Project

${level.transfer}

Keep the architecture and replace the Campus Store nouns with the nouns from your assigned project:

| Example project | Campus Store \`Product\` becomes | Campus Store \`User\` becomes | Campus Store \`Order\` becomes |
| --- | --- | --- | --- |
${mappingRows}

For your own project:

1. Write the name of your main resource.
2. Write the person or role that uses the system.
3. Write the transaction or relationship connecting them.
4. Apply today’s file structure and request flow using those names.
5. Test the same success, invalid-input, and missing-resource situations shown in the Campus Store reference.

### Next Level

${level.next}${next ? ` Continue with [Day ${day + 1}](<${next}>).` : ''}
`;
}

function refineNotes(manifest) {
  const duplicateStarts = {
    2: '\n## 1. What Is the Node.js Runtime\n',
    4: '\n## 1. What Is Express.js\n',
    5: '\n## 1. What Is CRUD\n',
    6: '\n## 1. What Is Middleware\n',
    7: '\n## 1. Why Project Structure Matters\n',
    8: '\n## 1. What Are Core Modules\n',
  };

  for (const noteName of noteFiles) {
    const day = dayFromName(noteName);
    const notePath = path.join(nodeDir, noteName);
    let markdown = fs.readFileSync(notePath, 'utf8').replace(/\r\n/g, '\n');

    const existingStory = markdown.indexOf('\n## Campus Store Storyline Project - Level ');
    if (existingStory !== -1) {
      markdown = markdown
        .slice(0, existingStory)
        .replace(/(?:\n+---\s*)+$/g, '')
        .trimEnd();
    }

    const duplicateStart = duplicateStarts[day];
    if (duplicateStart) {
      const first = markdown.indexOf(duplicateStart);
      const second = markdown.indexOf(duplicateStart, first + duplicateStart.length);
      if (second !== -1) markdown = markdown.slice(0, second).trimEnd();
    }

    if (day >= 10 && day <= 23) {
      const setupPattern = /^## (\d+)\. Project Setup\n[\s\S]*?(?=^## \d+\.)/m;
      const setupMatch = markdown.match(setupPattern);
      if (setupMatch) {
        markdown = markdown.replace(
          setupPattern,
          compactSetup(day, Number(setupMatch[1])),
        );
      }
    }

    markdown = markdown.replaceAll('http://localhost:3000', 'http://localhost:8888');
    markdown = markdown.replace(
      /datasource db \{\n  provider = "postgresql"\n\}/g,
      'datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}',
    );
    markdown = markdown
      .replace(/npx prisma generate(?! --config)/g, 'npx prisma generate --config prisma/prisma.config.js')
      .replace(/npx prisma studio(?! --config)/g, 'npx prisma studio --config prisma/prisma.config.js')
      .replace(/npx prisma migrate reset(?! --config)/g, 'npx prisma migrate reset --config prisma/prisma.config.js')
      .replace(/npx prisma migrate dev(?! --config)/g, 'npx prisma migrate dev --config prisma/prisma.config.js')
      .replace(/npx prisma migrate deploy(?! --config)/g, 'npx prisma migrate deploy --config prisma/prisma.config.js');
    markdown = markdown
      .replace(/\bStudents\b/g, 'Learners')
      .replace(/\bstudents\b/g, 'learners')
      .replace(/\bStudent\b/g, 'Learner')
      .replace(/\bstudent\b/g, 'learner');

    const manifestDay = manifest.days.find(item => item.day === day);
    markdown = `${markdown.trimEnd()}\n\n---\n\n${storySection(day, manifestDay).trim()}\n`;
    fs.writeFileSync(notePath, markdown);
  }
}

const manifest = buildSnapshots();
refineNotes(manifest);

console.log(`Built ${manifest.days.length} Campus Store checkpoints.`);
console.log(`Refined ${noteFiles.length} daily notes without reading or writing lesson-plan.md.`);
