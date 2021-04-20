import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutplanModule } from './workoutplan/workoutplan.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'bububu',
      database: 'wplan_dev',
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    WorkoutplanModule,
  ],
})
export class AppModule {}
