import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkoutDayTable1620670197679 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE workout_day
        (
            id              uuid        NOT NULL DEFAULT uuid_generate_v4(),
            workout_plan_id uuid        NOT NULL,
            name            text,
            description     text,
            date            date        NOT NULL UNIQUE,
            total_exercises smallint    NOT NULL DEFAULT 0,
            created_at      timestamptz NOT NULL DEFAULT current_timestamp,
            updated_at      timestamptz NOT NULL DEFAULT current_timestamp,
            PRIMARY KEY (id),
            FOREIGN KEY (workout_plan_id) REFERENCES workout_plan (id),
            CONSTRAINT name_length_check CHECK (length(name) <= 40),
            CONSTRAINT description_length_check CHECK (length(description) <= 500)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE workout_day`);
  }

}
