import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

export enum EmployeeStatus {
  Active = 'active',
  OnLeave = 'on_leave',
  Inactive = 'inactive',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  firstName: string;

  @Column({ length: 120 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 120 })
  position: string;

  @Column({ length: 120, nullable: true })
  department?: string;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.Active,
  })
  status: EmployeeStatus;

  @ManyToOne(() => Company, (company) => company.employees, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  company?: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
