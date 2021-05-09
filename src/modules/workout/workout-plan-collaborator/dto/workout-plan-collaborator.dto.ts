import { IsNotEmpty } from 'class-validator';
import { PublicUserDto } from '../../../user/dto/response/public-user-dto';
import { PermissionDto } from '../../../permission/dto/permission.dto';
import { RoleDto } from '../../role/dto/RoleDto';

export class WorkoutPlanCollaboratorDto {
  constructor(
    id: string,
    role: RoleDto,
    user: PublicUserDto,
    permission: PermissionDto,
  ) {
    this.id = id;
    this.user = user;
    this.role = role;
    this.permission = permission;
  }

  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  readonly user: PublicUserDto;

  @IsNotEmpty()
  readonly role: RoleDto;

  @IsNotEmpty()
  readonly permission: PermissionDto;
}
