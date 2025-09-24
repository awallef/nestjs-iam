import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdentityProvider } from '../entities/identity-provider.entity';
import { CreateIdentityProviderDto, UpdateIdentityProviderDto } from '../dto/identity-provider.dto';

@Injectable()
export class IdentityProvidersService {
  constructor(
    @InjectRepository(IdentityProvider)
    private readonly identityProviderRepository: Repository<IdentityProvider>,
  ) {}

  async create(createDto: CreateIdentityProviderDto): Promise<IdentityProvider> {
    const identityProvider = this.identityProviderRepository.create(createDto);
    return this.identityProviderRepository.save(identityProvider);
  }

  async findAll(): Promise<IdentityProvider[]> {
    return this.identityProviderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<IdentityProvider> {
    const identityProvider = await this.identityProviderRepository.findOne({
      where: { id },
    });

    if (!identityProvider) {
      throw new NotFoundException(`Identity Provider with ID ${id} not found`);
    }

    return identityProvider;
  }

  async findByKey(key: string): Promise<IdentityProvider> {
    const identityProvider = await this.identityProviderRepository.findOne({
      where: { key },
    });

    if (!identityProvider) {
      throw new NotFoundException(`Identity Provider with key ${key} not found`);
    }

    return identityProvider;
  }

  async update(id: number, updateDto: UpdateIdentityProviderDto): Promise<IdentityProvider> {
    const identityProvider = await this.findOne(id);
    Object.assign(identityProvider, updateDto);
    return this.identityProviderRepository.save(identityProvider);
  }

  async remove(id: number): Promise<void> {
    const identityProvider = await this.findOne(id);
    await this.identityProviderRepository.remove(identityProvider);
  }

  async toggleStatus(id: number): Promise<IdentityProvider> {
    const identityProvider = await this.findOne(id);
    identityProvider.isActive = !identityProvider.isActive;
    return this.identityProviderRepository.save(identityProvider);
  }
}
