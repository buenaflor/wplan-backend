import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkoutPlanTable1620670090643 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE workout_plan
        (
            id              uuid        NOT NULL DEFAULT uuid_generate_v4(),
            user_id         uuid        NOT NULL,
            name            text        NOT NULL,
            description     text,
            is_completed    boolean     NOT NULL DEFAULT false,
            is_private      boolean     NOT NULL DEFAULT true,
            start_date      date,
            end_date        date,
            email_confirmed boolean     NOT NULL DEFAULT false,
            completed_at    timestamptz,
            created_at      timestamptz NOT NULL DEFAULT current_timestamp,
            updated_at      timestamptz NOT NULL DEFAULT current_timestamp,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES "user" (id),
            CONSTRAINT name_length_check CHECK (length(name) <= 40),
            CONSTRAINT bio_length_check CHECK (length(description) <= 500),
            UNIQUE (name, user_id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE workout_plan`);
  }

}
