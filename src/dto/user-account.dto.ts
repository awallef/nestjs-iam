import { IsString, IsUUID, IsOptional, IsEmail, IsDateString } from 'class-validator';

export class CreateUserAccountDto {
  @IsUUID()
  accountId: string;

  @IsOptional()
  @IsString()
  keycloakSub?: string;

  @IsOptional()
  @IsEmail()
  emailNorm?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  lastLoginAt?: Date;
}

export class UpdateUserAccountDto {
  @IsOptional()
  @IsString()
  keycloakSub?: string;

  @IsOptional()
  @IsEmail()
  emailNorm?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  lastLoginAt?: Date;
}
