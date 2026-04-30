import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

export enum ClientStatus {
  Lead = 'lead',
  Active = 'active',
  Inactive = 'inactive',
}

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 160 })
  name: string;

  @Column({ length: 160, nullable: true })
  contactName?: string;

  @Column({ length: 160, nullable: true })
  email?: string;

  @Column({ length: 50, nullable: true })
  phone?: string;

  @Column({
    type: 'enum',
    enum: ClientStatus,
    default: ClientStatus.Lead,
  })
  status: ClientStatus;

  @ManyToOne(() => Company, (company) => company.clients, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  company?: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
