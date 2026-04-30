import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto) {
    const { companyId, ...payload } = createDocumentDto;
    const document = this.documentsRepository.create(payload);

    if (companyId) {
      document.company = await this.findCompany(companyId);
    }

    return this.documentsRepository.save(document);
  }

  findAll() {
    return this.documentsRepository.find({
      relations: {
        company: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const document = await this.documentsRepository.findOne({
      where: { id },
      relations: {
        company: true,
      },
    });

    if (!document) {
      throw new NotFoundException(`Document ${id} not found`);
    }

    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    const { companyId, ...payload } = updateDocumentDto;
    const document = await this.findOne(id);

    Object.assign(document, payload);

    if (companyId !== undefined) {
      document.company = companyId
        ? await this.findCompany(companyId)
        : undefined;
    }

    return this.documentsRepository.save(document);
  }

  async remove(id: string) {
    const document = await this.findOne(id);
    await this.documentsRepository.remove(document);

    return { deleted: true };
  }

  private async findCompany(id: string) {
    const company = await this.companiesRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company ${id} not found`);
    }

    return company;
  }
}
