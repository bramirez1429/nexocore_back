import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { CreateFinanceRecordDto } from './dto/create-finance-record.dto';
import { UpdateFinanceRecordDto } from './dto/update-finance-record.dto';
import { FinanceRecord } from './entities/finance-record.entity';

@Injectable()
export class FinancesService {
  constructor(
    @InjectRepository(FinanceRecord)
    private readonly financeRecordsRepository: Repository<FinanceRecord>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(createFinanceRecordDto: CreateFinanceRecordDto) {
    const { amount, companyId, ...payload } = createFinanceRecordDto;
    const financeRecord = this.financeRecordsRepository.create({
      ...payload,
      amount: amount.toFixed(2),
    });

    if (companyId) {
      financeRecord.company = await this.findCompany(companyId);
    }

    return this.financeRecordsRepository.save(financeRecord);
  }

  findAll() {
    return this.financeRecordsRepository.find({
      relations: {
        company: true,
      },
      order: {
        occurredAt: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const financeRecord = await this.financeRecordsRepository.findOne({
      where: { id },
      relations: {
        company: true,
      },
    });

    if (!financeRecord) {
      throw new NotFoundException(`Finance record ${id} not found`);
    }

    return financeRecord;
  }

  async update(id: string, updateFinanceRecordDto: UpdateFinanceRecordDto) {
    const { amount, companyId, ...payload } = updateFinanceRecordDto;
    const financeRecord = await this.findOne(id);

    Object.assign(financeRecord, payload);

    if (amount !== undefined) {
      financeRecord.amount = amount.toFixed(2);
    }

    if (companyId !== undefined) {
      financeRecord.company = companyId
        ? await this.findCompany(companyId)
        : undefined;
    }

    return this.financeRecordsRepository.save(financeRecord);
  }

  async remove(id: string) {
    const financeRecord = await this.findOne(id);
    await this.financeRecordsRepository.remove(financeRecord);

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
