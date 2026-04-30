import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

export enum FinanceRecordType {
  Income = 'income',
  Expense = 'expense',
}

@Entity('finance_records')
export class FinanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 160 })
  concept: string;

  @Column({
    type: 'enum',
    enum: FinanceRecordType,
  })
  type: FinanceRecordType;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  amount: string;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'date' })
  occurredAt: string;

  @ManyToOne(() => Company, (company) => company.financeRecords, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  company?: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
