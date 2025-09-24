# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-24

### Added
- Initial release of `@awallef/nestjs-iam`
- Complete IAM (Identity and Access Management) system for NestJS
- User account management with TypeORM entities
- External identity provider integration
- Account linking functionality
- Identity provider configuration management
- Authentication and authorization decorators
- Guards for role-based and permission-based access control
- Comprehensive DTOs for all entities
- TypeScript support with full type definitions
- Jest testing configuration
- ESLint and Prettier configuration
- Complete documentation and examples

### Features
- **UserAccount Entity**: Core user account management
- **ExternalIdentity Entity**: External identity provider connections
- **AccountLink Entity**: Account linking capabilities  
- **IdentityProvider Entity**: Identity provider configuration
- **Controllers**: RESTful APIs for all entities
- **Services**: Business logic layer for all operations
- **Guards**: Authentication and authorization guards
- **Decorators**: Easy-to-use auth decorators (@User, @Auth, @Roles, etc.)

### Migration
- Migrated from internal `@clinik/iam` library to standalone npm package
- Updated import paths in consuming applications
- Maintained backward compatibility for all exported APIs