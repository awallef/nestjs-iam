import { IsString, IsUUID } from 'class-validator';

export class CreateAccountLinkDto {
  @IsUUID()
  accountId: string;

  @IsString()
  entityTable: string;

  @IsUUID()
  entityId: string;

  @IsString()
  role: string;
}
