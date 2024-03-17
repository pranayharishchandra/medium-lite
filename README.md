# Blogging Website

## Overview
This is a basic blogging website built with the "hono" framework. It serves as a practical exploration of serverless deployments using Cloudflare Workers. The project implements core blogging functionalities and emphasizes code optimization, error handling, and security.

## Features
- User authentication for sign-up and login
- Creation, editing, and deletion of blog posts
- Retrieval of individual posts and bulk post fetching
- Secure authentication with JWT tokens
- Error handling for a smooth user experience

## Usage
1. Clone the repository: `git clone https://github.com/your-username/blogging-website.git`
2. Install dependencies: `npm install`
3. Set up environment variables:
   - `DATABASE_URL`: Your Prisma database URL
   - `JWT_SECRET`: Secret key for JWT token generation
4. Run the development server: `npm run dev`
5. Access the website locally: `http://localhost:8787`

## Deployment
1. Register a workers.dev subdomain with Wrangler: `npx wrangler login`
2. Configure your Cloudflare account: `npx wrangler config`
3. Deploy the website: `npm run deploy`

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
