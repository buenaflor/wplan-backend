import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkoutPlanRoleTable1620674365216 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE workout_plan_role
       (
           id   uuid NOT NULL DEFAULT uuid_generate_v4(),
           name text NOT NULL,
           created_at timestamptz NOT NULL DEFAULT current_timestamp,
           updated_at timestamptz NOT NULL DEFAULT current_timestamp,
           PRIMARY KEY (id),
           CONSTRAINT name_length_check CHECK (length(name) <= 32)
       );
      INSERT INTO workout_plan_role (name) VALUES ('coach');
      INSERT INTO workout_plan_role (name) VALUES ('trainee');
      INSERT INTO workout_plan_role (name) VALUES ('viewer');
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE workout_plan_role`
    );
  }

}
