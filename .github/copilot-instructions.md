# Copilot Instructions

This is a Next.js-based web application that serves as a music cataloging application. It allows users to search for music, and interact with songs/albums (e.g., favorite, save, rate, review, etc.). The application is built using TypeScript and follows best practices for code organization and structure.

## Project Structure

The project is organized into the following main directories:

- `app/` - Contains the main application with defined routes and pages.
  - `_actions/` - Contains server actions for interacting with the database.
  - `(routes)/` - Contains all external routes.
    - `layout.tsx` - The layout for all routes apart from the root.
    - `...` - All other routes (e.g., `/search`, `/profile`, `/track`, etc.).
  - `api/` - Contains API routes for server-side functionality.
- `components/` - Contains reusable components used throughout the application.
- `contexts/` - Contains context providers for managing global state.
- `hooks/` - Contains custom hooks for managing state and side effects.
- `lib/` - Contains utility functions and libraries used in the application.
- `styles/` - Contains global styles and CSS modules.
- `public/` - Contains static assets such as images and fonts.
- `types/` - Contains TypeScript type definitions and interfaces.
- `util/` - Contains utility functions and helpers.
- `mdx-components.tsx` - Contains the `useMDXComponents` function for rendering MDX content.
- `middleware.ts` - Contains middleware for handling authentication and authorization.
- `next.config.ts` - Contains Next.js configuration settings.
