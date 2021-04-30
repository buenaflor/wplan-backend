import { IsEnum, IsNotEmpty } from 'class-validator';
import { Permission } from '../../permission/permission.enum';

export class InviteCollaboratorDto {
  @IsNotEmpty()
  @IsEnum(Permission, { each: true })
  readonly permission: Permission;
}
