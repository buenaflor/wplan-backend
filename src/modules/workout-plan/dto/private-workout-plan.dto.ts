import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { PrivateUserDto } from '../../user/dto/private-user.dto';

export class PrivateWorkoutPlanDto {
  constructor(
    id: number,
    name: string,
    description: string,
    isCompleted: boolean,
    isPrivate: boolean,
    startDate: Date,
    endDate: Date,
    owner: PrivateUserDto,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isCompleted = isCompleted;
    this.isPrivate = isPrivate;
    this.startDate = startDate;
    this.endDate = endDate;
    this.owner = owner;
  }

  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isCompleted: boolean;

  @IsBoolean()
  isPrivate: boolean;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsObject()
  owner: PrivateUserDto;
}
