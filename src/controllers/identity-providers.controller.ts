import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { IdentityProvidersService } from '../services/identity-providers.service';
import { CreateIdentityProviderDto, UpdateIdentityProviderDto } from '../dto/identity-provider.dto';

@Controller('identity-providers')
export class IdentityProvidersController {
  constructor(private readonly identityProvidersService: IdentityProvidersService) {}

  @Post()
  create(@Body() createIdentityProviderDto: CreateIdentityProviderDto) {
    return this.identityProvidersService.create(createIdentityProviderDto);
  }

  @Get()
  findAll() {
    return this.identityProvidersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.identityProvidersService.findOne(id);
  }

  @Get('key/:key')
  findByKey(@Param('key') key: string) {
    return this.identityProvidersService.findByKey(key);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateIdentityProviderDto: UpdateIdentityProviderDto) {
    return this.identityProvidersService.update(id, updateIdentityProviderDto);
  }

  @Patch(':id/toggle-status')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.identityProvidersService.toggleStatus(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.identityProvidersService.remove(id);
  }
}
