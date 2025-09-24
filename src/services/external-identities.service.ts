import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternalIdentity } from '../entities/external-identity.entity';
import { CreateExternalIdentityDto, UpdateExternalIdentityDto } from '../dto/external-identity.dto';

@Injectable()
export class ExternalIdentitiesService {
  constructor(
    @InjectRepository(ExternalIdentity)
    private readonly externalIdentityRepository: Repository<ExternalIdentity>,
  ) {}

  async create(createDto: CreateExternalIdentityDto): Promise<ExternalIdentity> {
    const externalIdentity = this.externalIdentityRepository.create(createDto);
    return this.externalIdentityRepository.save(externalIdentity);
  }

  async findAll(): Promise<ExternalIdentity[]> {
    return this.externalIdentityRepository.find({
      relations: ['identityProvider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ExternalIdentity> {
    const externalIdentity = await this.externalIdentityRepository.findOne({
      where: { id },
      relations: ['identityProvider'],
    });

    if (!externalIdentity) {
      throw new NotFoundException(`External Identity with ID ${id} not found`);
    }

    return externalIdentity;
  }

  async findByEntity(entityTable: string, entityId: string): Promise<ExternalIdentity[]> {
    return this.externalIdentityRepository.find({
      where: { entityTable, entityId },
      relations: ['identityProvider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProvider(idpKey: string, externalId: string): Promise<ExternalIdentity> {
    const externalIdentity = await this.externalIdentityRepository.findOne({
      where: { idpKey, externalId },
      relations: ['identityProvider'],
    });

    if (!externalIdentity) {
      throw new NotFoundException(`External Identity for provider ${idpKey} and external ID ${externalId} not found`);
    }

    return externalIdentity;
  }

  async update(id: number, updateDto: UpdateExternalIdentityDto): Promise<ExternalIdentity> {
    const externalIdentity = await this.findOne(id);
    Object.assign(externalIdentity, updateDto);
    return this.externalIdentityRepository.save(externalIdentity);
  }

  async remove(id: number): Promise<void> {
    const externalIdentity = await this.findOne(id);
    await this.externalIdentityRepository.remove(externalIdentity);
  }

  async updateSyncStatus(id: number, status: string, lastSyncAt?: Date): Promise<ExternalIdentity> {
    const externalIdentity = await this.findOne(id);
    externalIdentity.syncStatus = status;
    if (lastSyncAt) {
      externalIdentity.lastSyncAt = lastSyncAt;
    }
    return this.externalIdentityRepository.save(externalIdentity);
  }

  async findByEntityAndProvider(entityTable: string, entityId: string, idpKey: string): Promise<ExternalIdentity> {
    const externalIdentity = await this.externalIdentityRepository.findOne({
      where: { entityTable, entityId, idpKey },
      relations: ['identityProvider'],
    });

    if (!externalIdentity) {
      throw new NotFoundException(`External Identity for entity ${entityTable}:${entityId} and provider ${idpKey} not found`);
    }

    return externalIdentity;
  }
}
