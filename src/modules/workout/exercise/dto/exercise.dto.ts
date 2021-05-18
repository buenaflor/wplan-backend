import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class ExerciseDto {
  @IsUUID()
  id: string;

  @IsString()
  @Length(0, 40)
  @IsNotEmpty()
  name: string;
}
