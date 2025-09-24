import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from '../entities/user-account.entity';
import { CreateUserAccountDto, UpdateUserAccountDto } from '../dto/user-account.dto';

@Injectable()
export class UserAccountsService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async create(createDto: CreateUserAccountDto): Promise<UserAccount> {
    const userAccount = this.userAccountRepository.create(createDto);
    return this.userAccountRepository.save(userAccount);
  }

  async findAll(): Promise<UserAccount[]> {
    return this.userAccountRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(accountId: string): Promise<UserAccount> {
    const userAccount = await this.userAccountRepository.findOne({
      where: { accountId },
    });

    if (!userAccount) {
      throw new NotFoundException(`User Account with ID ${accountId} not found`);
    }

    return userAccount;
  }

  async findByKeycloakSub(keycloakSub: string): Promise<UserAccount> {
    const userAccount = await this.userAccountRepository.findOne({
      where: { keycloakSub },
    });

    if (!userAccount) {
      throw new NotFoundException(`User Account with Keycloak sub ${keycloakSub} not found`);
    }

    return userAccount;
  }

  async findByEmail(emailNorm: string): Promise<UserAccount> {
    const userAccount = await this.userAccountRepository.findOne({
      where: { emailNorm },
    });

    if (!userAccount) {
      throw new NotFoundException(`User Account with email ${emailNorm} not found`);
    }

    return userAccount;
  }

  async findByUsername(username: string): Promise<UserAccount> {
    const userAccount = await this.userAccountRepository.findOne({
      where: { username },
    });

    if (!userAccount) {
      throw new NotFoundException(`User Account with username ${username} not found`);
    }

    return userAccount;
  }

  async update(accountId: string, updateDto: UpdateUserAccountDto): Promise<UserAccount> {
    const userAccount = await this.findOne(accountId);
    Object.assign(userAccount, updateDto);
    return this.userAccountRepository.save(userAccount);
  }

  async remove(accountId: string): Promise<void> {
    const userAccount = await this.findOne(accountId);
    await this.userAccountRepository.remove(userAccount);
  }

  async updateLastLogin(accountId: string): Promise<UserAccount> {
    const userAccount = await this.findOne(accountId);
    userAccount.lastLoginAt = new Date();
    return this.userAccountRepository.save(userAccount);
  }

  async updateStatus(accountId: string, status: string): Promise<UserAccount> {
    const userAccount = await this.findOne(accountId);
    userAccount.status = status;
    return this.userAccountRepository.save(userAccount);
  }
}
