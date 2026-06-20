# Project: Express + TypeScript REST API

## Stack

- Runtime: Node.js 24, TypeScript 6 (strict mode)
- Framework: Express 5
- ORM: Prisma with PostgreSQL
- Auth: JWT via jsonwebtoken + bcrypt for password hashing
- Testing: Vitest + Supertest
- Linting: ESLint with @typescript-eslint, Prettier
- `tsx` used for development and production for sanity reasons

## Code style

- Use `async/await` — never raw Promise chains or callbacks
- Prefer named exports over default exports
- Use `const` by default; only use `let` when reassignment is needed
- Avoid `any` — use `unknown` and narrow types explicitly
- All functions must have explicit return type annotations
- Barrel exports (`index.ts`) for each feature folder

## Error handling

- Use custom `AppError` class for operational errors
- HTTP errors follow RFC 9110 — always include `message` and `statusCode`
- Never expose stack traces or internal details in production responses

## Project structure

```text
repo/
├── prisma/                                   # prisma schema and migrations
├── src/
│   ├── domains/                              # feature-based modules
│   │   └── [feature]/
│   │       ├── [feature].repository.ts       # prisma calls
│   │       ├── [feature].service.ts          # business logic, orchestration
│   │       ├── [feature].controller.ts       # http handlers
│   │       ├── [feature].route.ts            # express router + middleware wiring
│   │       ├── [feature].schema.ts           # zod schemas
│   │       ├── [feature].types.ts            # extra types (if need)
│   │       └── index.ts                      # barrel
│   │
│   ├── shared/                               # cross-cutting concerns
│   │   ├── errors/                           @ errors / exceptions
│   │   │   └── app-error.ts
│   │   ├── types/                            # typescript interfaces / types
│   │   │   ├── permissions.ts
│   │   │   └── pagination.ts
│   │   └── utils/                            # shared utilities
│   │       ├── hash.ts
│   │       ├── duration.ts
│   │       ├── datetime.ts
│   │       ├── numbers.ts
│   │       ├── files.ts
│   │       └── objects.ts
│   │
│   ├── infra/                                # global infra setup
│   │   ├── http/
│   │   │   ├── middlewares/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   └── not-found.middleware.ts
│   │   │   └── router.ts                     # mounts all domain routes
│   │   ├── database/
│   │   │   └── prisma.ts                     # prisma client
│   │   └── storage/
│   │       └── multer.ts
│   │
│   ├── generated/                            # prisma generated output
│   ├── app.ts
│   └── index.ts
│
└── etc.
```

## Naming conventions

- Files: kebab-case (user.service.ts, not userService.ts)
- Classes and interfaces: PascalCase
- Variables and functions: camelCase
- Zod schemas: PascalCase + Schema suffix (UserCreateSchema)
- Prisma models: PascalCase (as defined in schema.prisma)

## Do not suggest

- CommonJS require() — use ESM imports only
- Express without types — always import from `express` with typed Request/Response
- Inline SQL — use Prisma client only
