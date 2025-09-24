import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountLink } from '../entities/account-link.entity';
import { CreateAccountLinkDto } from '../dto/account-link.dto';

@Injectable()
export class AccountLinksService {
  constructor(
    @InjectRepository(AccountLink)
    private readonly accountLinkRepository: Repository<AccountLink>,
  ) {}

  async create(createDto: CreateAccountLinkDto): Promise<AccountLink> {
    const accountLink = this.accountLinkRepository.create(createDto);
    return this.accountLinkRepository.save(accountLink);
  }

  async findAll(): Promise<AccountLink[]> {
    return this.accountLinkRepository.find({
      relations: ['userAccount'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByAccount(accountId: string): Promise<AccountLink[]> {
    return this.accountLinkRepository.find({
      where: { accountId },
      relations: ['userAccount'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEntity(entityTable: string, entityId: string): Promise<AccountLink[]> {
    return this.accountLinkRepository.find({
      where: { entityTable, entityId },
      relations: ['userAccount'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(accountId: string, entityTable: string, entityId: string): Promise<AccountLink> {
    const accountLink = await this.accountLinkRepository.findOne({
      where: { accountId, entityTable, entityId },
      relations: ['userAccount'],
    });

    if (!accountLink) {
      throw new NotFoundException(`Account Link not found`);
    }

    return accountLink;
  }

  async remove(accountId: string, entityTable: string, entityId: string): Promise<void> {
    const accountLink = await this.findOne(accountId, entityTable, entityId);
    await this.accountLinkRepository.remove(accountLink);
  }

  async updateRole(accountId: string, entityTable: string, entityId: string, role: string): Promise<AccountLink> {
    const accountLink = await this.findOne(accountId, entityTable, entityId);
    accountLink.role = role;
    return this.accountLinkRepository.save(accountLink);
  }

  async hasAccess(accountId: string, entityTable: string, entityId: string, requiredRole?: string): Promise<boolean> {
    const accountLink = await this.accountLinkRepository.findOne({
      where: { accountId, entityTable, entityId },
    });

    if (!accountLink) {
      return false;
    }

    if (!requiredRole) {
      return true;
    }

    // Simple role hierarchy: admin > user > readonly
    const roleHierarchy: Record<string, number> = { readonly: 0, user: 1, admin: 2 };
    const userRoleLevel = roleHierarchy[accountLink.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    return userRoleLevel >= requiredRoleLevel;
  }
}
