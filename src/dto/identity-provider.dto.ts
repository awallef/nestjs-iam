import { IsString, IsBoolean, IsOptional, IsObject } from 'class-validator';

export class CreateIdentityProviderDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateIdentityProviderDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
