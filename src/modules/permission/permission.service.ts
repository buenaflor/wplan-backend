import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PermissionEntity } from './permission.entity';

@Injectable()
export class PermissionService {
  constructor(private permissionRepository: Repository<PermissionEntity>) {}

  async findOneById(id: number) {
    return this.permissionRepository.find({ id });
  }
}
