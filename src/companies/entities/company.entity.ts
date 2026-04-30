import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Document } from '../../documents/entities/document.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { FinanceRecord } from '../../finances/entities/finance-record.entity';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 160 })
  name: string;

  @Column({ length: 120, nullable: true })
  legalName?: string;

  @Column({ length: 50, nullable: true })
  taxId?: string;

  @Column({ length: 120, nullable: true })
  industry?: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Employee, (employee) => employee.company)
  employees: Employee[];

  @OneToMany(() => Client, (client) => client.company)
  clients: Client[];

  @OneToMany(() => FinanceRecord, (financeRecord) => financeRecord.company)
  financeRecords: FinanceRecord[];

  @OneToMany(() => Task, (task) => task.company)
  tasks: Task[];

  @OneToMany(() => Document, (document) => document.company)
  documents: Document[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
