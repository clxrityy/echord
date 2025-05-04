# CHANGELOG

###### All bulk changes to this project will be documented in this file.

For a rough roadmap of the project, see the [ROADMAP](./assets/markdown/ROADMAP.md).

- [Authentication Refactor](#authentication-refactor) (21-04-2025)
- [Interaction API Refactor](#interaction-api-refactor) (24-04-2025)
- [Context Refactor](#context-refactor) (04-05-2025)

## Authentication Refactor

> - [b6afe3e](https://github.com/clxrityy/echord/commit/b6afe3ea49b85a9476ac2d76f1a9c4b68015380f) > `April 21, 2025`

- [x] Remove `jsonwebtoken` & `cookie` packages
  - [x] Replaced with `jose`
    - [x] Use `SignJWT` to create a JWT token
    - [x] Use `jwtVerify` to verify/decrypt the JWT token
- [x] No longer create a cookie when handling the database session (anytime a page is loaded).
  - [x] Remove the `handleSession()` function from the server actions.
  - [x] Instead, create a JWT token and store it in a cookie upon authentication.
  - [x] Use middleware to update the session.
    - [x] Get the session from the cookie
    - [x] Decrypt the JWT token
    - [x] Update the expiration date of the session

## Interaction API Refactor

> - [fb71739](https://github.com/clxrityy/echord/commit/fb71739ea419d54e5a9b854c262222844d4c4dfe) > `April 24, 2025`

- [x] User interactions are now stored in **interaction context** on the client side.
  - [`@/contexts/interaction`](./contexts/interaction/)
  - This allows for a more efficient way to handle interactions.
    - [x] Check if the interaction is already in the context before sending it to the server.
    - [x] Store the interaction context in [state](https://react.dev/reference/react/useState) to reflect the changes in the UI.
      ##### Interactions
      - [x] `RATE`
        - [x] When searching, the user can rate a song.
        - [ ] Displays the previous (if existing) rating from the user.
        - [ ] Displays the average rating of the song.
        - [x] Rate again to change the rating.
      - [x] `SAVE`
        - When searching, the user can save a song to their library.
        - Displays whether the song is already saved or not.
        - [ ] Click again to remove the song from user saves.
      - [x] `FAVORITE`
        - When searching, the user can favorite a song to their library.
        - Displays whether the song is already favorited or not.
        - [ ] Click again to remove the song from user favorites.
- Changed some **component** file/structure conventions
  - [x] Added default exports to all component [categories](./components/categories/)
    ###### Example
    ```tsx
    // ❌ Before
    import { Hero } from '@/components/categories/elements/Hero';
    // ✅ After
    import { Hero } from '@/components/categories/elements';
    ```
  - Added an [interactions](./components/categories/interactions/) component category.
    - [x] [`Favorite`](./components/categories/interactions/FavoriteInteraction.tsx)
    - [x] [`Rate`](./components/categories/interactions/RateInteraction.tsx)
    - [x] [`Save`](./components/categories/interactions/SaveInteraction.tsx)
- Added new files:
  - [x] [CHANGELOG.md](./CHANGELOG.md)
  - [x] [ROADMAP.md](./assets/markdown/ROADMAP.md)
  - [ ] [INTERACTIONS.md](./assets/markdown/INTERACTIONS.md)
  - [x] [README.md](./README.md)
- Tweaked [middleware](./middleware.ts) to only update a user session when the user is authenticated.

  ```ts
  export async function middleware(request: NextRequest) {
    if (await getUserSessionId()) {
      return await updateSession(request);
    }
    return NextResponse.rewrite(request.url);
  }
  ```

- Added [metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) to the `/search` route.

## Context Refactor

> - [fc2722e](https://github.com/clxrityy/echord/commit/fc2722e0c0a4d14575fcc825f5b290259e2e57ea) > `May 4, 2025`

**Previously**, the context factory was created as a hook like so:

```tsx
// hooks/useContextFactory.tsx
'use client';
import { createContext, FC, ReactNode, useContext } from 'react';

export type ContextFactory = <T>(
  _initialContextState: T,
  _useContextState: () => T
) => {
  Provider: FC<{ children: ReactNode }>;
  useContext: () => T;
};

export const useContextFactory: ContextFactory = (
  initialContextState,
  useContextState
) => {
  const Context = createContext(initialContextState);

  return {
    Provider: ({ children }) => {
      const contextValue = useContextState();
      return (
        <Context.Provider value={contextValue}>{children}</Context.Provider>
      );
    },
    useContext: () => useContext(Context),
  };
};
```

> - ❌ Calls hooks at the module top level.
>   - Hooks can only be called at the top level of a React function component or a custom hook.
> - ✅ This is a violation of the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks).

**Now**, the context factory is created as a function like so:

```tsx
// hooks/createContextFactory.tsx

'use client';
import { createContext, FC, ReactNode, useContext } from 'react';

export type ContextFactory = <T>(
  _initialContextState: T, // Initial context state
  _useContextState: () => T // Function to get the context state
) => // Returns a context provider and a hook to use the context
{
  Provider: FC<{ children: ReactNode }>;
  useContext: () => T;
};

export const createContextFactory: ContextFactory = (
  initialContextState,
  useContextState
) => {
  /**
   * - Create a context with the initial state
   * - This context will be used to provide the state to the components
   * - The context will be created using the createContext function from React
   */
  const Context = createContext(initialContextState);

  return {
    Provider: ({ children }) => {
      /*
        - Create the context value using the function passed as a parameter
        - This function will be called to get the context state
        - This allows to create the context value at the time of rendering
            - and not at the time of creating the context
            - This is important because the context value can change
      */
      const contextValue = useContextState();

      return (
        <Context.Provider value={contextValue}>{children}</Context.Provider>
      );
    },
    useContext: () => useContext(Context),
  };
};
```
