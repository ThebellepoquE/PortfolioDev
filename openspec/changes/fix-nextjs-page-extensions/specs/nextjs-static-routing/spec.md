# Next.js Static Routing Specification

## Purpose

Define the file naming conventions and configuration requirements for Next.js App Router route resolution to ensure predictable build manifest generation and runtime routing without InvariantError.

## Requirements

### Requirement: Default Page Extension Resolution

The Next.js configuration (`next.config.ts`) MUST NOT define a custom `pageExtensions` property. The system SHALL rely on Next.js built-in default extensions (`tsx`, `ts`, `jsx`, `js`) for route file resolution.

#### Scenario: Configuration uses default extensions

- GIVEN `next.config.ts` does not define `pageExtensions`
- WHEN Next.js builds the application
- THEN route files matching default extensions (`page.tsx`, `layout.tsx`, etc.) are recognized
- AND `app-paths-manifest.json` contains all route entries

#### Scenario: Custom pageExtensions triggers regression

- GIVEN `next.config.ts` defines `pageExtensions: ['page.tsx', 'page.ts']`
- WHEN Next.js 15.5.x builds the application
- THEN `InvariantError: Expected clientReferenceManifest to be defined` occurs
- AND route manifest generation fails

### Requirement: Standard App Router File Naming

All route files in `src/app/` MUST follow Next.js App Router naming conventions:
- `page.tsx` for route pages
- `layout.tsx` for layout wrappers
- `error.tsx` for error boundaries
- `not-found.tsx` for 404 pages

Route files SHALL NOT use non-standard suffixes like `.page.tsx`.

#### Scenario: Standard route file is recognized

- GIVEN a file at `src/app/blog/page.tsx`
- WHEN Next.js resolves routes
- THEN `/blog` route is registered in the manifest
- AND the route is accessible at runtime

### Requirement: Co-located Test File Naming

Test files MUST follow the co-location convention defined in AGENTS.md: `ComponentName.test.tsx` or `page.test.tsx`. Test files SHALL NOT use `.page.test.tsx` naming.

#### Scenario: Test file imports resolve correctly

- GIVEN a test file at `src/app/page.test.tsx`
- WHEN the test imports from `./page`
- THEN the import resolves to `src/app/page.tsx`
- AND the test executes successfully

### Requirement: Complete Route Manifest

The build process MUST generate a complete `app-paths-manifest.json` containing all defined routes. All routes in `src/app/` SHALL appear in the manifest after a successful build.

#### Scenario: All routes appear in manifest

- GIVEN route files exist at `src/app/page.tsx`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/proyecto/[id]/page.tsx`
- WHEN `next build` completes
- THEN `app-paths-manifest.json` contains entries for `/`, `/blog`, `/blog/[slug]`, `/proyecto/[id]`
- AND all routes return HTTP 200 at runtime

### Requirement: Clean Runtime Startup

The Next.js dev server (`next dev`) MUST start without runtime errors. The system SHALL NOT throw `InvariantError` or manifest-related errors during startup.

#### Scenario: Dev server starts cleanly

- GIVEN the application is built with default page extensions
- WHEN `next dev` is executed
- THEN the dev server starts without errors
- AND no "missing required error components" warnings appear
- AND all routes are accessible

### Requirement: No Legacy Pages Router Artifacts

The `src/pages/` directory SHALL NOT exist. This directory was the original reason for the `pageExtensions` workaround and MUST be removed to prevent confusion.

#### Scenario: Legacy directory is absent

- GIVEN the project structure
- WHEN inspecting the `src/` directory
- THEN `src/pages/` does not exist
- AND no Pages Router files are present


