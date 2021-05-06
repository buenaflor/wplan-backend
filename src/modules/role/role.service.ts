import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoleEntity } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async findOneById(id: string) {
    return this.roleRepository.findOne({ id });
  }

  async findOneByName(name: string) {
    return this.roleRepository.findOne({ name });
  }
}
