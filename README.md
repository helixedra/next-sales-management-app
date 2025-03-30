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
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin', 10).then(hash => console.log(hash));"
```

## Run project

Open [http://localhost:3500](http://localhost:3500) with your browser to see the result.
