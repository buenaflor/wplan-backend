import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionDto } from './dto/permission.dto';
import { PermissionEnum } from './permission.enum';

@Entity({ name: 'permission' })
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: '32' })
  name: string;

  createPermissionDto() {
    return new PermissionDto(this.id, this.name);
  }
}
