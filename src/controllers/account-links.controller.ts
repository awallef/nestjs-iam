import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { AccountLinksService } from '../services/account-links.service';
import { CreateAccountLinkDto } from '../dto/account-link.dto';

@Controller('account-links')
export class AccountLinksController {
  constructor(private readonly accountLinksService: AccountLinksService) {}

  @Post()
  create(@Body() createAccountLinkDto: CreateAccountLinkDto) {
    return this.accountLinksService.create(createAccountLinkDto);
  }

  @Get()
  findAll() {
    return this.accountLinksService.findAll();
  }

  @Get('by-account/:accountId')
  findByAccount(@Param('accountId') accountId: string) {
    return this.accountLinksService.findByAccount(accountId);
  }

  @Get('by-entity')
  findByEntity(@Query('entityTable') entityTable: string, @Query('entityId') entityId: string) {
    return this.accountLinksService.findByEntity(entityTable, entityId);
  }

  @Get(':accountId/:entityTable/:entityId')
  findOne(
    @Param('accountId') accountId: string,
    @Param('entityTable') entityTable: string,
    @Param('entityId') entityId: string
  ) {
    return this.accountLinksService.findOne(accountId, entityTable, entityId);
  }

  @Patch(':accountId/:entityTable/:entityId/role')
  updateRole(
    @Param('accountId') accountId: string,
    @Param('entityTable') entityTable: string,
    @Param('entityId') entityId: string,
    @Body() body: { role: string }
  ) {
    return this.accountLinksService.updateRole(accountId, entityTable, entityId, body.role);
  }

  @Get(':accountId/:entityTable/:entityId/has-access')
  hasAccess(
    @Param('accountId') accountId: string,
    @Param('entityTable') entityTable: string,
    @Param('entityId') entityId: string,
    @Query('requiredRole') requiredRole?: string
  ) {
    return this.accountLinksService.hasAccess(accountId, entityTable, entityId, requiredRole);
  }

  @Delete(':accountId/:entityTable/:entityId')
  remove(
    @Param('accountId') accountId: string,
    @Param('entityTable') entityTable: string,
    @Param('entityId') entityId: string
  ) {
    return this.accountLinksService.remove(accountId, entityTable, entityId);
  }
}
