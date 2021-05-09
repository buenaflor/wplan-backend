import { RoleEnum } from '../../role/role.enum';
import { PermissionEnum } from '../../../permission/permission.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class InviteCollaboratorRequestDto {
  @IsNotEmpty()
  @IsEnum(PermissionEnum)
  readonly permission: PermissionEnum;

  @IsNotEmpty()
  @IsEnum(RoleEnum)
  readonly role: RoleEnum;
}
