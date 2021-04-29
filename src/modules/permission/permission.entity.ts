import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'permission' })
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '32' })
  name: string;
}
