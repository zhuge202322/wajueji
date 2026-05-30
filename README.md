# Maredigger B2B Website

Next.js website and CMS admin for an excavator and excavator spare parts export business.

## Local Setup

```bash
npm install
npm run setup:admin
npm run dev -- --port 6527
```

Open <http://localhost:6527>.

## Admin

Open <http://localhost:6527/admin/login>.

Default local credentials:

- Username: `admin`
- Password: `Admin12345`

Set production values in environment variables before deployment. Use `.env.example` as the template.

## Pages

- Home
- Products
- About us
- News
- Contact us

## Data

The public website reads products, categories, news and site media from the CMS database. If the database is empty or unavailable, the frontend falls back to the original static content.

Uploads are stored in `public/uploads/` locally and are ignored by Git except for the directory placeholder.
