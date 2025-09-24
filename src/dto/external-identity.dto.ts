import { IsString, IsUUID, IsOptional, IsObject, IsDateString } from 'class-validator';

export class CreateExternalIdentityDto {
  @IsString()
  entityTable: string;

  @IsUUID()
  entityId: string;

  @IsString()
  idpKey: string;

  @IsString()
  externalId: string;

  @IsOptional()
  @IsString()
  module?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsDateString()
  lastSyncAt?: Date;

  @IsOptional()
  @IsString()
  syncStatus?: string;
}

export class UpdateExternalIdentityDto {
  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsString()
  module?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsDateString()
  lastSyncAt?: Date;

  @IsOptional()
  @IsString()
  syncStatus?: string;
}
