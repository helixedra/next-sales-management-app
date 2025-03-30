This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Password

To generate a hashed password for the admin user, run the following script in the project root:

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('<YOU_PASSWORD>', 10).then(hash => console.log(hash));"
```

## Database

This project includes a database preloaded with dummy data for testing purposes. No additional setup is required to use the database.

## File Uploads

Please note that file upload functionality is disabled in this test project. Any attempts to upload files will not be processed.

## Image Storage

To enable image saving functionality, you need to connect the application to a bucket storage service (e.g., AWS S3, Google Cloud Storage, etc.). Configure the storage settings in the environment variables.

## Configuration

To enable images for your custom image bucket, update the `next.config.js` file in the project root with the following configuration:

```javascript
    images: {
        domains: ["your-image-domain.com"], // Replace with your image domain
    }
```

## Environment Variables

The project requires the following environment variables to be set in a `.env` file at the root of the project:

```env
# Authentication
NEXTAUTH_SECRET=<secret_string> # random string
NEXTAUTH_URL=<full_path> # http://localhost:3500

# R2 Storage Configuration
NEXT_PRIVATE_R2_TOKEN_VALUE=<valid_token>
NEXT_PRIVATE_R2_ACCESS_KEY_ID=<valid_token>
NEXT_PRIVATE_R2_SECRET_ACCESS_KEY=<valid_token>
NEXT_PUBLIC_R2_ENDPOINT=<valid_url>
NEXT_PUBLIC_R2_BUCKET_NAME=<valid_bucket_name>
NEXT_PUBLIC_UPLOADS_PATH=<valid_path>
```

Ensure you replace `<valid_token>`, `<valid_url>`, `<valid_bucket_name>`, and `<valid_path>` with the appropriate values for your setup.

## R2 Cloudflare Configuration

To configure R2 Cloudflare for this project, follow these steps:

1. Log in to your Cloudflare account and navigate to the R2 section.
2. Create a new bucket or use an existing one.
3. Obtain the following details:

   - **Access Key ID**
   - **Secret Access Key**
   - **Bucket Name**
   - **Endpoint URL**

4. Update the `.env` file in the project root with the R2 credentials:

```env
NEXT_PRIVATE_R2_ACCESS_KEY_ID=<your_access_key_id>
NEXT_PRIVATE_R2_SECRET_ACCESS_KEY=<your_secret_access_key>
NEXT_PUBLIC_R2_BUCKET_NAME=<your_bucket_name>
NEXT_PUBLIC_R2_ENDPOINT=<your_endpoint_url>
```

5. Ensure the bucket permissions are configured to allow access from your application.

6. Test the configuration by running the application and verifying that the R2 integration works as expected.

## Run project

Open [http://localhost:3500](http://localhost:3500) with your browser to see the result.
