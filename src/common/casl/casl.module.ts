import { Module } from '@nestjs/common';
import { WorkoutAbilityFactory } from './workout-ability-factory.service';

@Module({
  providers: [WorkoutAbilityFactory],
  exports: [WorkoutAbilityFactory],
})
export class CaslModule {}
