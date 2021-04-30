import { IsEmpty, IsNotEmpty } from 'class-validator';
import { PublicUserDto } from '../../user/dto/public-user-dto';
import { PermissionDto } from '../../permission/dto/permission.dto';
import { RoleDto } from '../../role/dto/RoleDto';

export class WorkoutPlanCollaboratorDto {
  constructor(
    id: number,
    role: RoleDto,
    user: PublicUserDto,
    permission: PermissionDto,
  ) {
    this.id = id;
    this.role = role;
    this.user = user;
    this.permission = permission;
  }

  @IsNotEmpty()
  readonly id: number;

  @IsNotEmpty()
  readonly role: RoleDto;

  @IsNotEmpty()
  readonly user: PublicUserDto;

  @IsNotEmpty()
  readonly permission: PermissionDto;
}
