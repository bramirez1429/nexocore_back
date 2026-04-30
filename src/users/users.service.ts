import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { companyId, ...payload } = createUserDto;
    const user = this.usersRepository.create(payload);

    if (companyId) {
      user.company = await this.findCompany(companyId);
    }

    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find({
      relations: {
        company: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        company: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { companyId, ...payload } = updateUserDto;
    const user = await this.findOne(id);

    Object.assign(user, payload);

    if (companyId !== undefined) {
      user.company = companyId ? await this.findCompany(companyId) : undefined;
    }

    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);

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
