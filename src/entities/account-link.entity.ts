import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity({ name: 'account_links', schema: 'iam' })
export class AccountLink {
  @PrimaryColumn({ name: 'account_id', type: 'uuid' })
  accountId: string;

  @PrimaryColumn({ name: 'entity_table', type: 'text' })
  entityTable: string;

  @PrimaryColumn({ name: 'entity_id', type: 'uuid' })
  entityId: string;

  @Column({ type: 'text', default: 'user' })
  role: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'accountId' })
  userAccount: UserAccount;
}
