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

  async findOneById(id: number) {
    return await this.permissionRepository.find({ id });
  }
}
