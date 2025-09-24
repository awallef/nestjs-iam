import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserAccountsService } from '../services/user-accounts.service';
import { CreateUserAccountDto, UpdateUserAccountDto } from '../dto/user-account.dto';

@Controller('user-accounts')
export class UserAccountsController {
  constructor(private readonly userAccountsService: UserAccountsService) {}

  @Post()
  create(@Body() createUserAccountDto: CreateUserAccountDto) {
    return this.userAccountsService.create(createUserAccountDto);
  }

  @Get()
  findAll() {
    return this.userAccountsService.findAll();
  }

  @Get('by-keycloak-sub/:keycloakSub')
  findByKeycloakSub(@Param('keycloakSub') keycloakSub: string) {
    return this.userAccountsService.findByKeycloakSub(keycloakSub);
  }

  @Get('by-email')
  findByEmail(@Query('email') email: string) {
    return this.userAccountsService.findByEmail(email);
  }

  @Get('by-username/:username')
  findByUsername(@Param('username') username: string) {
    return this.userAccountsService.findByUsername(username);
  }

  @Get(':accountId')
  findOne(@Param('accountId') accountId: string) {
    return this.userAccountsService.findOne(accountId);
  }

  @Patch(':accountId')
  update(@Param('accountId') accountId: string, @Body() updateUserAccountDto: UpdateUserAccountDto) {
    return this.userAccountsService.update(accountId, updateUserAccountDto);
  }

  @Patch(':accountId/last-login')
  updateLastLogin(@Param('accountId') accountId: string) {
    return this.userAccountsService.updateLastLogin(accountId);
  }

  @Patch(':accountId/status')
  updateStatus(@Param('accountId') accountId: string, @Body() body: { status: string }) {
    return this.userAccountsService.updateStatus(accountId, body.status);
  }

  @Delete(':accountId')
  remove(@Param('accountId') accountId: string) {
    return this.userAccountsService.remove(accountId);
  }
}
