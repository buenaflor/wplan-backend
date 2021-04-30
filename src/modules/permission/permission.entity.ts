import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionDto } from './dto/permission.dto';
import { Permission } from './permission.enum';

@Entity({ name: 'permission' })
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '32' })
  name: Permission;

  createPermissionDto() {
    return new PermissionDto(this.id, this.name);
  }
}
