import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'user_accounts', schema: 'iam' })
export class UserAccount {
  @PrimaryColumn({ name: 'account_id', type: 'uuid' })
  accountId: string;

  @Column({ name: 'keycloak_sub', type: 'text', unique: true, nullable: true })
  keycloakSub?: string;

  @Column({ name: 'email_norm', type: 'text', nullable: true })
  emailNorm?: string;

  @Column({ type: 'text', nullable: true })
  username?: string;

  @Column({ name: 'display_name', type: 'text', nullable: true })
  displayName?: string;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'text', default: 'active' })
  status: string;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
