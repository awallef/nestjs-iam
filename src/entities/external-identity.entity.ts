import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { IdentityProvider } from './identity-provider.entity';

@Entity({ name: 'external_identities', schema: 'iam' })
@Index('extid_uq_provider_external', ['idpKey', 'externalId'], { unique: true })
@Index('extid_uq_entity_provider', ['entityTable', 'entityId', 'idpKey'], { unique: true })
@Index('extid_idx_entity', ['entityTable', 'entityId'])
export class ExternalIdentity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ name: 'entity_table', type: 'text' })
  entityTable: string;

  @Column({ name: 'entity_id', type: 'uuid' })
  entityId: string;

  @Column({ name: 'idp_key', type: 'text' })
  idpKey: string;

  @Column({ name: 'external_id', type: 'text' })
  externalId: string;

  @Column({ type: 'text', nullable: true })
  module?: string;

  @Column({ type: 'jsonb', default: '{}' })
  metadata: Record<string, any>;

  @Column({ name: 'last_sync_at', type: 'timestamptz', nullable: true })
  lastSyncAt?: Date;

  @Column({ name: 'sync_status', type: 'text', default: 'ok' })
  syncStatus: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => IdentityProvider)
  @JoinColumn({ name: 'idp_key', referencedColumnName: 'key' })
  identityProvider: IdentityProvider;
}
