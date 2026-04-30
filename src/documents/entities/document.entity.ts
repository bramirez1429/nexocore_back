import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

export enum DocumentStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 180 })
  title: string;

  @Column({ length: 120 })
  category: string;

  @Column({ length: 500, nullable: true })
  fileUrl?: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.Draft,
  })
  status: DocumentStatus;

  @ManyToOne(() => Company, (company) => company.documents, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  company?: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
