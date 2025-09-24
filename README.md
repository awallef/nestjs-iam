# @awallef/nestjs-iam

A comprehensive NestJS Identity and Access Management (IAM) library that provides authentication and authorization features for NestJS applications.

## Features

- 🔐 **Authentication Management**: Complete user authentication system
- 🛡️ **Authorization Controls**: Role-based and permission-based access control
- 🔗 **External Identity Providers**: Support for external authentication providers
- 📱 **Account Linking**: Link multiple accounts and identities
- 🎯 **Decorators**: Easy-to-use decorators for guards and user context
- 🏗️ **TypeORM Integration**: Built-in entities and database schema
- �️ **Database CLI**: PostgreSQL schema management utilities
- �📝 **TypeScript Support**: Full TypeScript support with type definitions

## Installation

```bash
npm install @awallef/nestjs-iam
# or
yarn add @awallef/nestjs-iam
```

### Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
npm install @nestjs/common @nestjs/core @nestjs/typeorm class-transformer class-validator typeorm reflect-metadata
```

## Database Setup

### Using the CLI Tool

The package includes a CLI tool to help you set up the database schema:

```bash
# Create IAM tables
npx nestjs-iam-cli create --database mydb --username postgres --password mypass

# Create tables in a specific schema
npx nestjs-iam-cli create --database mydb --username postgres --password mypass --schema iam

# Drop IAM tables
npx nestjs-iam-cli drop --database mydb --username postgres --password mypass
```

#### CLI Options

- `--host <host>`: Database host (default: localhost)
- `--port <port>`: Database port (default: 5432)
- `--database <db>`: Database name (required)
- `--username <user>`: Database username (required)
- `--password <pass>`: Database password (required)
- `--schema <schema>`: Schema name (optional)

### Database Schema

The CLI creates the following tables:

- **accounts**: Store account information
- **roles**: Define roles (owner, admin, member, viewer)
- **account_entity_links**: Link accounts to entities with specific roles

#### Example Schema Usage

```typescript
import { EntityAccessGuard } from '@awallef/nestjs-iam';

@Controller('companies')
@UseGuards(EntityAccessGuard)
export class CompaniesController {
  @Get(':id')
  @EntityAccess({ entityTable: 'companies', requiredRole: 'viewer' })
  async getCompany(@Param('id') id: string) {
    // Only users with 'viewer' role or higher for this company can access
    return this.companiesService.findOne(id);
  }
}
```

## Quick Start

### 1. Import the IAM Module

```typescript
import { Module } from '@nestjs/common';
import { IamModule } from '@awallef/nestjs-iam';

@Module({
  imports: [
    IamModule.forRoot({
      // Configuration options
    }),
  ],
})
export class AppModule {}
```

### 2. Use IAM Components

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard, User } from '@awallef/nestjs-iam';

@Controller('protected')
@UseGuards(AuthGuard)
export class ProtectedController {
  @Get('profile')
  getProfile(@User() user: any) {
    return user;
  }
}
```

## Core Components

### Entities

- **UserAccount**: Core user account entity
- **ExternalIdentity**: External identity provider connections
- **AccountLink**: Links between different user accounts
- **IdentityProvider**: Configuration for identity providers

### Controllers

- **UserAccountsController**: User account management
- **ExternalIdentitiesController**: External identity management
- **AccountLinksController**: Account linking operations
- **IdentityProvidersController**: Identity provider configuration

### Services

- **UserAccountsService**: User account business logic
- **ExternalIdentitiesService**: External identity operations
- **AccountLinksService**: Account linking logic
- **IdentityProvidersService**: Identity provider management

### Guards

- **AuthGuard**: Authentication verification
- **RoleGuard**: Role-based authorization
- **PermissionGuard**: Permission-based authorization
- **EntityAccessGuard**: Entity-specific access control with roles

### Decorators

- **@User()**: Inject current user into controller methods
- **@Auth()**: Authentication and authorization decorator
- **@Roles()**: Role-based access control
- **@Permissions()**: Permission-based access control
- **@EntityAccess()**: Entity-specific access control

## Configuration

The IAM module can be configured using the `forRoot()` method:

```typescript
IamModule.forRoot({
  database: {
    // TypeORM configuration
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h',
  },
  providers: {
    // External provider configurations
  },
})
```

## Database Schema

The library includes both TypeORM entities and a PostgreSQL schema for entity access control:

### TypeORM Entities
- `user_accounts`
- `external_identities`
- `account_links`
- `identity_providers`

### Entity Access Control Tables (via CLI)
- `accounts`: Core account information
- `roles`: Available roles (owner, admin, member, viewer)  
- `account_entity_links`: Links accounts to specific entities with roles

## CLI Tool

The package includes a command-line tool for database schema management:

```bash
# Install globally for easier access
npm install -g @awallef/nestjs-iam

# Or use with npx
npx nestjs-iam-cli create --help
```

## API Reference

### DTOs

All DTOs are available for request/response validation:

- `UserAccountDto`
- `ExternalIdentityDto`
- `AccountLinkDto`
- `IdentityProviderDto`

## Examples

### Basic Authentication

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { UserAccountsService } from '@awallef/nestjs-iam';

@Controller('auth')
export class AuthController {
  constructor(private userAccountsService: UserAccountsService) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    return this.userAccountsService.authenticate(loginDto);
  }
}
```

### Entity Access Control

```typescript
import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { EntityAccessGuard, EntityAccess } from '@awallef/nestjs-iam';

@Controller('companies')
@UseGuards(EntityAccessGuard)
export class CompaniesController {
  @Get(':id')
  @EntityAccess({ entityTable: 'companies', requiredRole: 'viewer' })
  async getCompany(@Param('id') id: string) {
    // Only users with 'viewer' role or higher for this company can access
    return this.companiesService.findOne(id);
  }

  @Put(':id')
  @EntityAccess({ entityTable: 'companies', requiredRole: 'admin' })
  async updateCompany(@Param('id') id: string, @Body() updateDto: any) {
    // Only users with 'admin' role for this company can update
    return this.companiesService.update(id, updateDto);
  }
}
```

### Database Management

```typescript
// Programmatic schema management
import { IamSchemaCli } from '@awallef/nestjs-iam/cli';

const cli = new IamSchemaCli({
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  username: 'postgres',
  password: 'password'
});

await cli.connect();
await cli.executeSqlFile(); // Create tables
await cli.disconnect();
```

## Identity Provider Integration & Account Mapping

The IAM system supports multiple identity providers and allows users to have multiple accounts that can be linked together. This is essential for modern applications where users might sign in with different providers (Google, GitHub, Microsoft, etc.).

### Core Concepts

- **UserAccount**: The primary account entity in your system
- **ExternalIdentity**: Represents a user's account from an external provider
- **AccountLink**: Links different accounts belonging to the same user
- **IdentityProvider**: Configuration for external authentication providers

### Data Model Relationships

```
UserAccount (1) ←→ (Many) ExternalIdentity
     ↓
UserAccount (Many) ←→ (Many) UserAccount [via AccountLink]
     ↓
UserAccount (Many) ←→ (Many) Entity [via account_entity_links table]
```

#### Example Data Structure

```typescript
// A user with multiple provider accounts
UserAccount {
  id: "user-123",
  email: "john@example.com",
  displayName: "John Doe",
  externalIdentities: [
    {
      provider: "google",
      externalId: "google-123456",
      email: "john@gmail.com",
      profileData: { /* Google profile */ }
    },
    {
      provider: "github", 
      externalId: "github-789",
      email: "john@users.noreply.github.com",
      profileData: { /* GitHub profile */ }
    }
  ],
  linkedAccounts: [
    {
      targetAccountId: "user-456", // A work account
      linkType: "merge",
      linkedAt: "2024-01-15"
    }
  ]
}
```

### Setting Up Identity Providers

```typescript
import { IdentityProvidersService } from '@awallef/nestjs-iam';

@Injectable()
export class AuthSetupService {
  constructor(
    private identityProvidersService: IdentityProvidersService,
  ) {}

  async setupProviders() {
    // Configure Google OAuth
    await this.identityProvidersService.create({
      name: 'google',
      type: 'oauth2',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
      scopes: ['email', 'profile'],
    });

    // Configure GitHub OAuth
    await this.identityProvidersService.create({
      name: 'github',
      type: 'oauth2',
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorizationUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      userInfoUrl: 'https://api.github.com/user',
      scopes: ['user:email'],
    });
  }
}
```

### Creating and Linking User Accounts

#### Scenario 1: New User Signs Up with External Provider

```typescript
import { 
  UserAccountsService, 
  ExternalIdentitiesService,
  AccountLinksService 
} from '@awallef/nestjs-iam';

@Controller('auth')
export class AuthController {
  constructor(
    private userAccountsService: UserAccountsService,
    private externalIdentitiesService: ExternalIdentitiesService,
    private accountLinksService: AccountLinksService,
  ) {}

  @Post('oauth/callback/:provider')
  async handleOAuthCallback(
    @Param('provider') provider: string,
    @Body() oauthData: { code: string, state?: string },
  ) {
    // Exchange code for user info (implement OAuth flow)
    const userInfo = await this.exchangeCodeForUserInfo(provider, oauthData.code);
    
    // Check if external identity already exists
    let externalIdentity = await this.externalIdentitiesService.findByProviderAndExternalId(
      provider,
      userInfo.id,
    );

    if (!externalIdentity) {
      // Create new user account
      const userAccount = await this.userAccountsService.create({
        email: userInfo.email,
        displayName: userInfo.name,
        avatarUrl: userInfo.picture,
      });

      // Create external identity
      externalIdentity = await this.externalIdentitiesService.create({
        userAccountId: userAccount.id,
        provider: provider,
        externalId: userInfo.id,
        email: userInfo.email,
        displayName: userInfo.name,
        profileData: userInfo,
      });
    }

    return this.generateTokens(externalIdentity.userAccount);
  }
}
```

#### Scenario 2: Existing User Adds Another Provider

```typescript
@Post('link-account/:provider')
@UseGuards(AuthGuard)
async linkExternalAccount(
  @Param('provider') provider: string,
  @Body() oauthData: { code: string },
  @User() currentUser: UserAccount,
) {
  // Exchange code for user info
  const userInfo = await this.exchangeCodeForUserInfo(provider, oauthData.code);
  
  // Check if this external account is already linked to someone else
  const existingExternalIdentity = await this.externalIdentitiesService.findByProviderAndExternalId(
    provider,
    userInfo.id,
  );

  if (existingExternalIdentity && existingExternalIdentity.userAccountId !== currentUser.id) {
    // The external account belongs to a different user
    // Option 1: Merge accounts (advanced scenario)
    return this.proposeAccountMerge(currentUser, existingExternalIdentity.userAccount);
    
    // Option 2: Reject linking
    // throw new ConflictException('This account is already linked to another user');
  }

  if (!existingExternalIdentity) {
    // Create new external identity for current user
    await this.externalIdentitiesService.create({
      userAccountId: currentUser.id,
      provider: provider,
      externalId: userInfo.id,
      email: userInfo.email,
      displayName: userInfo.name,
      profileData: userInfo,
    });
  }

  return { message: 'Account linked successfully' };
}
```

#### Scenario 3: Account Merging

```typescript
async proposeAccountMerge(
  currentUser: UserAccount,
  targetUser: UserAccount,
): Promise<{ mergeToken: string }> {
  // Create a temporary merge proposal
  const mergeProposal = await this.accountLinksService.createMergeProposal({
    sourceAccountId: currentUser.id,
    targetAccountId: targetUser.id,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  });

  // Send email to both accounts for confirmation
  await this.emailService.sendMergeConfirmation(currentUser, targetUser, mergeProposal.token);
  
  return { mergeToken: mergeProposal.token };
}

@Post('confirm-merge')
async confirmAccountMerge(@Body() { token, confirmed }: { token: string, confirmed: boolean }) {
  const mergeProposal = await this.accountLinksService.findMergeProposal(token);
  
  if (!mergeProposal || mergeProposal.expiresAt < new Date()) {
    throw new BadRequestException('Invalid or expired merge token');
  }

  if (!confirmed) {
    await this.accountLinksService.deleteMergeProposal(token);
    return { message: 'Account merge cancelled' };
  }

  // Perform the merge
  await this.mergeUserAccounts(mergeProposal.sourceAccountId, mergeProposal.targetAccountId);
  
  return { message: 'Accounts merged successfully' };
}

private async mergeUserAccounts(sourceId: string, targetId: string) {
  // Move all external identities from source to target
  await this.externalIdentitiesService.transferToAccount(sourceId, targetId);
  
  // Move all account links from source to target
  await this.accountLinksService.transferToAccount(sourceId, targetId);
  
  // Move all entity access from source to target
  await this.accountLinksService.transferEntityAccess(sourceId, targetId);
  
  // Soft delete or mark the source account as merged
  await this.userAccountsService.markAsMerged(sourceId, targetId);
}
```

### Retrieving User Accounts and Identities

#### Get All Linked Accounts for a User

```typescript
@Get('profile/accounts')
@UseGuards(AuthGuard)
async getAllLinkedAccounts(@User() user: UserAccount) {
  // Get all external identities for this user
  const externalIdentities = await this.externalIdentitiesService.findByUserAccount(user.id);
  
  // Get linked accounts (if user has merged accounts)
  const linkedAccounts = await this.accountLinksService.findLinkedAccounts(user.id);
  
  return {
    primaryAccount: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    },
    externalIdentities: externalIdentities.map(identity => ({
      provider: identity.provider,
      externalId: identity.externalId,
      email: identity.email,
      displayName: identity.displayName,
      linkedAt: identity.createdAt,
    })),
    linkedAccounts: linkedAccounts.map(account => ({
      id: account.id,
      email: account.email,
      displayName: account.displayName,
      linkedAt: account.linkedAt,
    })),
  };
}
```

#### Find User by Any Identity

```typescript
@Injectable()
export class UserLookupService {
  constructor(
    private userAccountsService: UserAccountsService,
    private externalIdentitiesService: ExternalIdentitiesService,
  ) {}

  async findUserByAnyIdentity(
    provider: string,
    externalId: string,
  ): Promise<UserAccount | null> {
    // First, look for direct external identity
    const externalIdentity = await this.externalIdentitiesService.findByProviderAndExternalId(
      provider,
      externalId,
    );

    if (externalIdentity) {
      return externalIdentity.userAccount;
    }

    return null;
  }

  async findUserByEmail(email: string): Promise<UserAccount[]> {
    // Find by primary email
    const primaryUsers = await this.userAccountsService.findByEmail(email);
    
    // Find by external identity email
    const externalIdentities = await this.externalIdentitiesService.findByEmail(email);
    const externalUsers = externalIdentities.map(identity => identity.userAccount);
    
    // Combine and deduplicate
    const allUsers = [...primaryUsers, ...externalUsers];
    const uniqueUsers = allUsers.filter((user, index, self) => 
      index === self.findIndex(u => u.id === user.id)
    );
    
    return uniqueUsers;
  }
}
```

### Authentication Flow Examples

#### Multi-Provider Login

```typescript
@Post('login')
async login(@Body() loginDto: { provider?: string, email?: string, password?: string, code?: string }) {
  if (loginDto.provider && loginDto.code) {
    // OAuth flow
    return this.handleOAuthLogin(loginDto.provider, loginDto.code);
  } else if (loginDto.email && loginDto.password) {
    // Traditional email/password
    return this.handleEmailLogin(loginDto.email, loginDto.password);
  }
  
  throw new BadRequestException('Invalid login method');
}

private async handleOAuthLogin(provider: string, code: string) {
  const userInfo = await this.exchangeCodeForUserInfo(provider, code);
  const user = await this.userLookupService.findUserByAnyIdentity(provider, userInfo.id);
  
  if (!user) {
    throw new UnauthorizedException('User not found');
  }
  
  return this.generateTokens(user);
}
```

#### Account Switching

```typescript
@Post('switch-account/:accountId')
@UseGuards(AuthGuard)
async switchAccount(
  @Param('accountId') targetAccountId: string,
  @User() currentUser: UserAccount,
) {
  // Verify the user has access to switch to this account
  const hasAccess = await this.accountLinksService.canUserAccessAccount(
    currentUser.id,
    targetAccountId,
  );
  
  if (!hasAccess) {
    throw new ForbiddenException('Cannot switch to this account');
  }
  
  const targetUser = await this.userAccountsService.findById(targetAccountId);
  return this.generateTokens(targetUser);
}
```

### Best Practices

1. **Always validate external identities** before linking accounts
2. **Implement proper consent flows** for account merging
3. **Store provider-specific data** in the `profileData` field
4. **Handle email conflicts** gracefully when multiple providers use the same email
5. **Implement audit logging** for account linking and switching activities
6. **Use secure tokens** for merge proposals and account operations
7. **Provide clear UI** for users to manage their linked accounts

## Migration Guide

### From v1.0.0 to v1.1.0

1. **Install the new PostgreSQL dependency**:
   ```bash
   npm install pg @types/pg
   ```

2. **Set up the entity access control schema**:
   ```bash
   npx nestjs-iam-cli create --database yourdb --username user --password pass
   ```

3. **Update your guards** to use the new EntityAccessGuard:
   ```typescript
   // Before
   @UseGuards(AuthGuard, RoleGuard)
   
   // After  
   @UseGuards(AuthGuard, EntityAccessGuard)
   @EntityAccess({ entityTable: 'companies', requiredRole: 'viewer' })
   ```

4. **Populate the accounts table** with your existing users:
   ```typescript
   // Migration script example
   async function migrateExistingUsers() {
     const users = await this.userAccountsService.findAll();
     
     for (const user of users) {
       await this.accountLinksService.createAccount({
         id: user.id,
         name: user.displayName,
         email: user.email,
       });
     }
   }
   ```

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on our GitHub repository or contact the maintainer.

## Changelog

### 1.1.0

- ✨ Added PostgreSQL schema for entity access control
- 🛠️ Added CLI tool for database schema management
- 🔒 Added EntityAccessGuard for fine-grained access control
- 📚 Enhanced documentation with CLI usage examples

### 1.0.0

- Initial release
- Core IAM functionality
- TypeORM integration
- Authentication and authorization features