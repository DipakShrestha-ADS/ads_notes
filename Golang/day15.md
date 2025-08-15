## Day 15: CI/CD with Go 🤖

Writing code and tests is great, but manually running tests and deploying your application every time you make a change is slow and error-prone. **CI/CD** is the practice of automating this process, allowing you to deliver features faster and more reliably. Today, we'll use **GitHub Actions** to build a simple CI/CD pipeline for our Go project.

-----

### What is CI/CD?

**CI/CD** is a cornerstone of modern software development that stands for:

  * **Continuous Integration (CI):** This is the practice of frequently merging code changes from multiple developers into a central repository. After each merge, an automated process kicks off to **build** the code and run **tests**. This ensures that new changes don't break the existing application. The goal is to find and fix bugs early.

  * **Continuous Deployment (or Delivery) (CD):** This is the step that happens after a successful CI build.

      * **Continuous Delivery** means the code is automatically prepared and released to a staging environment, but a manual approval is needed to push it to production.
      * **Continuous Deployment** goes one step further, automatically deploying every change that passes the CI stage directly to production.

**GitHub Actions** is a CI/CD platform built directly into GitHub. It allows you to create custom workflows that are triggered by events in your repository, like a `push` to a branch or the creation of a `pull request`.

-----

### Task 1: Create a GitHub repository for your project.

**Solution:**

If you haven't already, this is a straightforward process:

1.  Log in to your GitHub account.
2.  Click the **"+"** icon in the top-right corner and select **"New repository"**.
3.  Give your repository a name (e.g., `go-gin-api-course`).
4.  Choose whether it should be public or private.
5.  Click **"Create repository"**.
6.  Follow the on-screen instructions to push your existing local code to the new repository. This usually involves commands like:
    ```sh
    git remote add origin https://github.com/your-username/your-repo-name.git
    git branch -M main
    git push -u origin main
    ```

-----

### Task 2: Set up a GitHub Actions workflow that runs `go build` and `go test`.

**Solution:**

GitHub Actions workflows are defined in YAML files located in the `.github/workflows/` directory of your repository.

1.  In your project's root, create a new directory structure: `.github/workflows/`.
2.  Inside that directory, create a new file named `ci.yml`.

**`.github/workflows/ci.yml`**

```yaml
# This is the name of your workflow. It will be displayed in the Actions tab of your GitHub repository.
name: Go CI Pipeline

# This section defines the triggers for the workflow.
on:
  push:
    branches: [ "main" ] # Run on every push to the main branch.
  pull_request:
    branches: [ "main" ] # Run on every pull request targeting the main branch.

# This section defines the jobs that will be executed.
jobs:
  # 'build' is the ID of our job. You can name it anything.
  build:
    # 'runs-on' specifies the type of virtual machine to run the job on.
    runs-on: ubuntu-latest

    # 'steps' are the sequence of tasks that will be executed as part of the job.
    steps:
    # Step 1: Check out your repository's code so the workflow can access it.
    - name: Checkout code
      uses: actions/checkout@v4

    # Step 2: Set up the Go environment on the runner.
    - name: Set up Go
      uses: actions/setup-go@v5
      with:
        go-version: '1.22' # Specify the version of Go you are using.

    # Step 3: Build the application.
    # The `go build` command compiles your packages and dependencies.
    - name: Build
      run: go build -v ./...

    # Step 4: Run the tests.
    # The `go test` command runs all tests in your project.
    - name: Test
      run: go test -v ./...
```

**How it works:**

1.  Commit this `ci.yml` file and push it to your `main` branch on GitHub.
2.  Go to the **"Actions"** tab in your GitHub repository.
3.  You will see your "Go CI Pipeline" workflow running. It will automatically execute the build and test steps every time you push a new change.

-----

### Task 3: Add a step to your workflow to run your linter.

**Solution:**

We can easily add another step to our `ci.yml` file to run `golangci-lint`.

**`.github/workflows/ci.yml` (Updated)**

```yaml
name: Go CI Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Set up Go
      uses: actions/setup-go@v5
      with:
        go-version: '1.22'

    # New Step: Run the linter.
    - name: Run linter
      # 'uses' specifies a pre-built action from the GitHub Marketplace.
      # This action automatically downloads and runs golangci-lint.
      uses: golangci/golangci-lint-action@v6
      with:
        # We specify the version of the linter to use.
        version: v1.57

    - name: Build
      run: go build -v ./...

    - name: Test
      run: go test -v ./...
```

Now, your CI pipeline will fail if the linter finds any issues, forcing you to maintain a high standard of code quality before merging changes.

-----

### Task 4: Explore how to build a Docker image within your CI pipeline.

**Solution:**

Building a Docker image is a common CI step that prepares your application for deployment. GitHub Actions has excellent support for this.

**`.github/workflows/ci.yml` (Updated with Docker build)**

```yaml
name: Go CI/CD Pipeline

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-test: # Renamed the first job for clarity
    runs-on: ubuntu-latest
    steps:
      # ... (Checkout, Set up Go, Linter, Build, Test steps are the same)
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Set up Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - name: Run linter
        uses: golangci/golangci-lint-action@v6
        with:
          version: v1.57
      - name: Build
        run: go build -v ./...
      - name: Test
        run: go test -v ./...

  # New Job: Build and push a Docker image.
  build-and-push-docker-image:
    # This job will only run if the 'build-and-test' job succeeds.
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      # Step 1: Log in to a container registry (e.g., Docker Hub, GitHub Container Registry).
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      # Step 2: Build the Docker image and push it to the registry.
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true # Actually push the image.
          tags: your-dockerhub-username/your-image-name:latest # Tag the image.
```

This new job, `build-and-push-docker-image`, depends on the first job succeeding. It uses pre-built actions to log in to a container registry and then uses your project's `Dockerfile` to build and push the image.

-----

### Task 5: Read about managing secrets in GitHub Actions.

**Solution:**

In the Docker example above, you saw this line: `password: ${{ secrets.DOCKERHUB_TOKEN }}`. This is how you manage **secrets** in GitHub Actions.

  * **What are secrets?** Secrets are encrypted environment variables for storing sensitive information like API keys, database passwords, or access tokens. You should **never** hardcode secrets directly in your workflow files.

  * **How to create them:**

    1.  In your GitHub repository, go to **Settings \> Secrets and variables \> Actions**.
    2.  Click the **"New repository secret"** button.
    3.  Give the secret a name (e.g., `DOCKERHUB_TOKEN`). This is the name you will use in your workflow file.
    4.  Paste the secret value into the "Value" field.
    5.  Click **"Add secret"**.

  * **How they work:** GitHub encrypts these values and only makes them available to the workflow runner at runtime. They are never printed in logs. By using `${{ secrets.YOUR_SECRET_NAME }}`, you can securely access these values in your workflow without exposing them. This is the standard and secure way to provide credentials to your CI/CD pipeline.