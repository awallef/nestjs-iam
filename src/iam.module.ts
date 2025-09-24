import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
  IdentityProvider,
  ExternalIdentity,
  UserAccount,
  AccountLink,
} from './entities';

// Services
import {
  IdentityProvidersService,
  ExternalIdentitiesService,
  UserAccountsService,
  AccountLinksService,
} from './services';

// Controllers
import {
  IdentityProvidersController,
  ExternalIdentitiesController,
  UserAccountsController,
  AccountLinksController,
} from './controllers';

// Guards
import { EntityAccessGuard } from './guards';

export interface IamModuleOptions {
  exposeControllers?: boolean;
}

@Module({})
export class IamModule {
  static forRoot(options: IamModuleOptions = {}): DynamicModule {
    const controllers = options.exposeControllers
      ? [
          IdentityProvidersController,
          ExternalIdentitiesController,
          UserAccountsController,
          AccountLinksController,
        ]
      : [];

    return {
      module: IamModule,
      imports: [
        TypeOrmModule.forFeature([
          IdentityProvider,
          ExternalIdentity,
          UserAccount,
          AccountLink,
        ]),
      ],
      providers: [
        IdentityProvidersService,
        ExternalIdentitiesService,
        UserAccountsService,
        AccountLinksService,
        EntityAccessGuard,
      ],
      controllers,
      exports: [
        IdentityProvidersService,
        ExternalIdentitiesService,
        UserAccountsService,
        AccountLinksService,
        EntityAccessGuard,
        TypeOrmModule,
      ],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: IamModule,
      imports: [
        TypeOrmModule.forFeature([
          IdentityProvider,
          ExternalIdentity,
          UserAccount,
          AccountLink,
        ]),
      ],
      providers: [
        IdentityProvidersService,
        ExternalIdentitiesService,
        UserAccountsService,
        AccountLinksService,
        EntityAccessGuard,
      ],
      exports: [
        IdentityProvidersService,
        ExternalIdentitiesService,
        UserAccountsService,
        AccountLinksService,
        EntityAccessGuard,
      ],
    };
  }
}
