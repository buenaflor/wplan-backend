import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleDto } from './dto/RoleDto';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: '32' })
  name: string;

  createRoleDto() {
    return new RoleDto(this.id, this.name);
  }
}
