# Lambda LAP Frontend

The frontend of Lambda LAP - A React + TypeScript application built with Vite.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM 7
- **HTTP Client:** Axios
- **Testing:** Vitest + React Testing Library
- **Code Quality:** ESLint + Prettier + Husky

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Testing

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Project Structure

```
src/
├── components/    # Reusable UI components
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # API services
├── test/          # Test setup and utilities
└── types/         # TypeScript type definitions
```

## API Configuration

The API service is configured in `src/services/api.ts`. Set the `VITE_API_BASE_URL` environment variable to configure the API base URL.
