import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator';
import { FinanceRecordType } from '../entities/finance-record.entity';

export class UpdateFinanceRecordDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  concept?: string;

  @IsOptional()
  @IsEnum(FinanceRecordType)
  type?: FinanceRecordType;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount?: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  occurredAt?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;
}
