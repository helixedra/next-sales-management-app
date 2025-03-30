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

## Run project

Open [http://localhost:3500](http://localhost:3500) with your browser to see the result.
