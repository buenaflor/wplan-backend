import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  async findOneById(id: string) {
    return this.permissionRepository.findOne({ id });
  }

  async findOneByName(name: string) {
    return this.permissionRepository.findOne({ name });
  }
}
