# IdentityForge AI Frontend

React + TypeScript + Vite frontend for the IdentityForge AI IAM security platform.

## Development

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The frontend typically runs at:

```text
http://localhost:5173
```

## API Configuration

The frontend uses `VITE_API_URL` to connect to the backend API.

Example local configuration:

```text
VITE_API_URL=http://localhost:8000
```

Production API configuration is provided through Vercel environment variables.

## Production Build

```powershell
npm run build
```

The generated production assets are written to:

```text
dist/
```

## Main Project Documentation

For full project documentation, architecture, deployment details, IAM capabilities, production links, and screenshots, see the root:

```text
../README.md
```
