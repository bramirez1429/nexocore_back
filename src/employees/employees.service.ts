import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { companyId, ...payload } = createEmployeeDto;
    const employee = this.employeesRepository.create(payload);

    if (companyId) {
      employee.company = await this.findCompany(companyId);
    }

    return this.employeesRepository.save(employee);
  }

  findAll() {
    return this.employeesRepository.find({
      relations: {
        company: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const employee = await this.employeesRepository.findOne({
      where: { id },
      relations: {
        company: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee ${id} not found`);
    }

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const { companyId, ...payload } = updateEmployeeDto;
    const employee = await this.findOne(id);

    Object.assign(employee, payload);

    if (companyId !== undefined) {
      employee.company = companyId
        ? await this.findCompany(companyId)
        : undefined;
    }

    return this.employeesRepository.save(employee);
  }

  async remove(id: string) {
    const employee = await this.findOne(id);
    await this.employeesRepository.remove(employee);

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
