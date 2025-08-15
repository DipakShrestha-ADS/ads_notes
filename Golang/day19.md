## Day 19: Deploying to a Cloud Provider ☁️

Your application is running perfectly on your local machine inside Docker containers. The final step is to make it accessible to the world. Today, we'll cover the concepts of **cloud deployment**, taking your containerized application and running it on a public cloud provider's infrastructure.

-----

### Introduction to Cloud Deployment

**Cloud deployment** is the process of deploying your application on remote servers hosted on the internet ("the cloud") instead of on your own local hardware. Cloud providers manage the physical servers, networking, and infrastructure, allowing you to focus on your code.

#### Overview of Major Cloud Providers

There are three dominant players in the cloud market, all of which offer generous free tiers for new users:

1.  **Amazon Web Services (AWS):** The oldest and largest provider. It has the most extensive portfolio of services, from simple virtual machines (EC2) to complex serverless and machine learning platforms. It's powerful but can have a steep learning curve.
2.  **Google Cloud Platform (GCP):** Known for its excellence in networking, data analytics (BigQuery), and container orchestration (Google Kubernetes Engine - GKE). Many find its user interface and pricing to be more straightforward than AWS.
3.  **Microsoft Azure:** A strong competitor, especially popular with large enterprises that already use Microsoft products. It has deep integration with the Windows ecosystem and offers a comprehensive set of services comparable to AWS and GCP.

-----

### Deploying a Dockerized App

The easiest way to get started with deploying a container is to use a **managed container platform** or **"Serverless Containers"** service. These services abstract away all the complexity of managing servers. You simply provide your container image, and the platform handles the rest—provisioning, networking, scaling, and security.

**Popular Choices for Beginners:**

  * **Google Cloud Run:** An excellent, easy-to-use service. You give it a container image, and it runs it, automatically scaling up or down (even to zero) based on traffic. You only pay for the exact resources you use when requests are being processed.
  * **AWS App Runner:** AWS's competitor to Cloud Run. It provides a similarly simple experience for deploying containerized applications directly from an image.
  * **DigitalOcean App Platform:** Known for its simplicity and developer-friendly user experience. It's a great choice if you find the major cloud providers overwhelming.

**The General Deployment Process:**

1.  **Containerize Your App:** You've already done this by creating a `Dockerfile`.
2.  **Push Image to a Registry:** You need to upload your built Docker image to a **container registry**. This is a storage service for your images. You can use Docker Hub, or a private registry provided by your cloud provider (e.g., Google Artifact Registry, Amazon Elastic Container Registry).
3.  **Create a Cloud Database:** You'll need a managed database service in the cloud (e.g., AWS RDS, Google Cloud SQL) to act as your production database.
4.  **Create a Cloud Service:** In your chosen platform (like Google Cloud Run), you'll create a new "service," point it to the image in your registry, and configure environment variables.
5.  **Connect and Deploy:** The platform will pull your image, start the container, and provide you with a public URL to access your application.

-----

### Task Solutions

#### Task 1: Create a free-tier account with a cloud provider.

**Solution:**
This is your first step. You will typically need a credit card for verification, but you won't be charged as long as you stay within the free tier limits.

  * **Google Cloud Free Tier:** [https://cloud.google.com/free](https://cloud.google.com/free)
  * **AWS Free Tier:** [https://aws.amazon.com/free/](https://aws.amazon.com/free/)
  * **Azure Free Account:** [https://azure.microsoft.com/en-us/free/](https://azure.microsoft.com/en-us/free/)

Follow the on-screen instructions to create your account.

#### Task 2: Deploy your Dockerized application to the cloud.

**Solution:**
Let's outline the conceptual steps, using **Google Cloud Run** as the example service.

1.  **Push Your Image to a Registry:**

      * First, you'll need to enable the Artifact Registry API in your Google Cloud project.
      * Authenticate your local Docker client with Google Cloud.
      * Tag your local image with the registry's address:
        ```sh
        docker build -t us-central1-docker.pkg.dev/your-gcp-project-id/my-repo/gin-api:latest .
        ```
      * Push the image:
        ```sh
        docker push us-central1-docker.pkg.dev/your-gcp-project-id/my-repo/gin-api:latest
        ```

2.  **Create a Managed Database:**

      * Navigate to the "Cloud SQL" section in the Google Cloud Console.
      * Create a new PostgreSQL instance. Choose a small machine type to stay within the free tier.
      * Set a password for the `postgres` user.
      * Once the database is created, find its **connection details** (IP address, user, password, database name).

3.  **Create the Cloud Run Service:**

      * Navigate to "Cloud Run" in the Google Cloud Console.
      * Click "Create Service".
      * Select the container image you just pushed to the Artifact Registry.
      * Give your service a name (e.g., `gin-api-prod`).
      * Choose a region.
      * Under "Authentication," select **"Allow unauthenticated invocations"** to make your API public.
      * Open the "Variables & Secrets" section to configure your environment variables (see next task).
      * Click "Create". Cloud Run will now pull your image and deploy it.

#### Task 3: Configure production environment variables.

**Solution:**
During the Cloud Run service creation (or by editing the service after creation), you will find a section for **Environment Variables**. This is where you securely provide your production configuration.

You need to add two crucial variables:

1.  **`DATABASE_DSN`**:

      * **Variable Name:** `DATABASE_DSN`
      * **Variable Value:** Use the connection details from the Cloud SQL database you created. It will look something like this: `host=<DB_IP_ADDRESS> user=postgres password=<YOUR_DB_PASSWORD> dbname=postgres sslmode=disable` (you may need to configure networking for your service to reach the database).

2.  **`JWT_SECRET_KEY`**:

      * **Variable Name:** `JWT_SECRET_KEY`
      * **Variable Value:** Generate a new, long, random string to use as your production JWT secret. **Do not reuse your development secret.**

By setting these here, you ensure your application connects to the correct production database and uses a secure key for signing tokens, all without hardcoding secrets in your code or Docker image.

#### Task 4: Expose your application and test the live endpoints.

**Solution:**
Once your Cloud Run service is successfully deployed, the dashboard will display a public **URL** (e.g., `https://gin-api-prod-abcdefg-uc.a.run.app`). This is the live address of your API.

Use a tool like Postman or `curl` to test it, just like you did locally:

1.  **Register a new user:**

    ```sh
    curl -X POST https://<your-live-url>/auth/register \
      -H "Content-Type: application/json" \
      -d '{"name":"produser", "city":"cloud", "password":"somepassword"}'
    ```

2.  **Log in to get a token:**

    ```sh
    curl -X POST https://<your-live-url>/auth/login \
      -H "Content-Type: application/json" \
      -d '{"name":"produser", "password":"somepassword"}'
    ```

3.  **Access a protected endpoint using the token:**

    ```sh
    TOKEN="<paste_your_token_here>"
    curl -X GET https://<your-live-url>/users \
      -H "Authorization: Bearer $TOKEN"
    ```

If you get the expected responses, congratulations\! Your API is live on the internet.

#### Task 5: Explore the scaling and monitoring features.

**Solution:**
In the Cloud Run dashboard for your service, you'll find several tabs for managing its behavior:

  * **Metrics:** This tab provides real-time graphs of key performance indicators like **Request Count**, **Latency**, **CPU Utilization**, and **Memory Utilization**. This is your first stop for diagnosing performance issues.
  * **Logs:** Here you can see all the output (from `fmt.Println`, `log.Println`, etc.) that your application writes to the console. This is essential for debugging runtime errors.
  * **Revisions / Settings:** In this area, you can configure the **auto-scaling** behavior. For Cloud Run, this is typically defined by:
      * **Minimum number of instances:** Set this to `0` for cost-effectiveness (it will "scale to zero" when idle) or `1` to avoid "cold starts" for faster response times.
      * **Maximum number of instances:** This is the upper limit on how many container instances the service can scale out to under heavy load. This acts as a safety rail to control costs.
      * **Concurrency:** You can set how many requests a single container instance can handle simultaneously.

By exploring these settings, you can see how managed platforms give you powerful control over your application's performance and cost without needing to manage the underlying infrastructure yourself.