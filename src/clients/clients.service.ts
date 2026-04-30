import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const { companyId, ...payload } = createClientDto;
    const client = this.clientsRepository.create(payload);

    if (companyId) {
      client.company = await this.findCompany(companyId);
    }

    return this.clientsRepository.save(client);
  }

  findAll() {
    return this.clientsRepository.find({
      relations: {
        company: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const client = await this.clientsRepository.findOne({
      where: { id },
      relations: {
        company: true,
      },
    });

    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const { companyId, ...payload } = updateClientDto;
    const client = await this.findOne(id);

    Object.assign(client, payload);

    if (companyId !== undefined) {
      client.company = companyId ? await this.findCompany(companyId) : undefined;
    }

    return this.clientsRepository.save(client);
  }

  async remove(id: string) {
    const client = await this.findOne(id);
    await this.clientsRepository.remove(client);

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
