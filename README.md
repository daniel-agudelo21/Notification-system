# Take Home Challenge - Notification System

## Description

This project implements a notification management system for authenticated users.
Each user can:

- Create notifications
- Manage their own notifications
- Send notifications through different channels

Supported channels:

- EMAIL
- SMS
- Push notifications

The system is designed to be extensible, allowing new channels to be added without modifying existing logic.

## Tech Stack

- Backend: NestJS (TypeScript)
- ORM: Prisma
- Database: PostgreSQL (Docker)
- Authentication: JWT (Passport)
- Testing: Jest (E2E)

## Requirements

- Node.js 18+
- Docker + Docker Compose

## Installation & Setup

```bash
npm install
docker compose up -d
```

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/notifications?schema=public"
JWT_SECRET="super-secret-dev"
JWT_EXPIRES_IN="1h"
BCRYPT_ROUNDS="10"
```

## Database

### Run migration

```bash
npx prisma migrate dev --name init
```

## Running the application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Running tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

> Note: E2E tests are executed using --runInBand to avoid race conditions due to shared database usage.

## Authentication

- JWT-based authentication
- Protected routes require:

```code
Authorization: Bearer <token>
```

## API Endpoints

### Auth

| Method | Endpoint       | Description   |
| ------ | -------------- | ------------- |
| POST   | /auth/register | Register user |
| POST   | /auth/login    | Login user    |

### Notifications (Protected)

| Method | Endpoint                       | Description            |
| ------ | ------------------------------ | ---------------------- |
| POST   | /notifications                 | Create notification    |
| GET    | /notifications                 | Get user notifications |
| PUT    | /notifications/:notificationId | Update notification    |
| DELETE | /notifications/:notificationId | Delete notification    |

## Architecture

The system follows a modular and decoupled architecture, aligned with clean code principles.

### Key modules

- AuthModule
- UsersModule
- NotificationsModule
- ChannelsModule
- PrismaModule

## Notification Flow

1. User creates a notification
2. Notification is persisted in DB
3. Dispatcher selects the correct channel strategy
4. Channel logic is executed
5. Result is stored:
   - status: SENT / FAILED
   - metadata: JSON with channel-specific data

## Channel System (Strategy Pattern)

Each channel implements a common interface:

```ts
interface ChannelSender {
  supports(channel: Channel): boolean;
  send(ctx: SendContext): Promise<SendResult>;
}
```

### Implementations

- EmailSender
- SmsSender
- PushSender

### Benefits

- Open/Closed Principle
- Easy extensibility
- No need to modify existing logic to add new channels

## Metadata Handling

Each notification stores a metadata JSON field with:

- Email -> template info, provider
- SMS -> length, timestamp
- Push -> payload, device token

This enables:

- auditability
- extensibility
- future retries / queue integration

## Security

- Password hashing with bcrypt
- DTO validation with ValidationPipe
- JWT authentication for protected routes

## Testing Strategy

- Integration/E2E tests using Jest
- Tests cover:
  - Auth flow (register/login)
  - Protected routes
  - Channel validation logic
  - Notification lifecycle

## Important note

Tests run sequentially (--runInBand) because:

- Shared PostgreSQL instance
- Database is cleaned between tests
- Avoids race conditions

## Design Decisions

1. Strategy Pattern for channels:
   - Allows adding new notification channels without modifying core logic.

2. Dispatcher Layer:
   - Centralizes channel resolution and keeps service clean.

3. Metadata as JSON:
   - Avoids rigid schemas and allows flexible storage per channel.

4. E2E testing over unit-heavy testing:
   - Focus on real behavior instead of isolated functions.

## Improvements (Future Work)

- Queue system (BullMQ / RabbitMQ) for async delivery
- Retry mechanisms for failed notifications
- Rate limiting
- User contact data (phone, device tokens)
- Separate NotificationDelivery table (audit logs)
- CI/CD pipeline
- Dockerized test environment

## API Docs

```code
http://localhost:3000/api
```
