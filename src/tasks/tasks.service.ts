import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { Employee } from '../employees/entities/employee.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const { assignedToId, companyId, ...payload } = createTaskDto;
    const task = this.tasksRepository.create(payload);

    if (companyId) {
      task.company = await this.findCompany(companyId);
    }

    if (assignedToId) {
      task.assignedTo = await this.findEmployee(assignedToId);
    }

    return this.tasksRepository.save(task);
  }

  findAll() {
    return this.tasksRepository.find({
      relations: {
        company: true,
        assignedTo: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: {
        company: true,
        assignedTo: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const { assignedToId, companyId, ...payload } = updateTaskDto;
    const task = await this.findOne(id);

    Object.assign(task, payload);

    if (companyId !== undefined) {
      task.company = companyId ? await this.findCompany(companyId) : undefined;
    }

    if (assignedToId !== undefined) {
      task.assignedTo = assignedToId
        ? await this.findEmployee(assignedToId)
        : undefined;
    }

    return this.tasksRepository.save(task);
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);

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

  private async findEmployee(id: string) {
    const employee = await this.employeesRepository.findOne({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee ${id} not found`);
    }

    return employee;
  }
}
