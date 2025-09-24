import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ExternalIdentitiesService } from '../services/external-identities.service';
import { CreateExternalIdentityDto, UpdateExternalIdentityDto } from '../dto/external-identity.dto';

@Controller('external-identities')
export class ExternalIdentitiesController {
  constructor(private readonly externalIdentitiesService: ExternalIdentitiesService) {}

  @Post()
  create(@Body() createExternalIdentityDto: CreateExternalIdentityDto) {
    return this.externalIdentitiesService.create(createExternalIdentityDto);
  }

  @Get()
  findAll() {
    return this.externalIdentitiesService.findAll();
  }

  @Get('by-entity')
  findByEntity(@Query('entityTable') entityTable: string, @Query('entityId') entityId: string) {
    return this.externalIdentitiesService.findByEntity(entityTable, entityId);
  }

  @Get('by-provider')
  findByProvider(@Query('idpKey') idpKey: string, @Query('externalId') externalId: string) {
    return this.externalIdentitiesService.findByProvider(idpKey, externalId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.externalIdentitiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateExternalIdentityDto: UpdateExternalIdentityDto) {
    return this.externalIdentitiesService.update(id, updateExternalIdentityDto);
  }

  @Patch(':id/sync-status')
  updateSyncStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string; lastSyncAt?: Date }
  ) {
    return this.externalIdentitiesService.updateSyncStatus(id, body.status, body.lastSyncAt);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.externalIdentitiesService.remove(id);
  }
}
