import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExerciseTable1620608877630 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE exercise
        (
            id              uuid        NOT NULL DEFAULT uuid_generate_v4(),
            name            TEXT        NOT NULL,
            description     TEXT,
            license_author  TEXT        NOT NULL,
            license_id      uuid        NOT NULL,
            muscle_group_id uuid        NOT NULL,
            created_at      timestamptz NOT NULL DEFAULT current_timestamp,
            updated_at      timestamptz NOT NULL DEFAULT current_timestamp,
            CHECK ( length(name) < 128 ),
            CHECK ( length(description) < 500 ),
            CHECK ( length(license_author) < 64 ),
            PRIMARY KEY (id),
            FOREIGN KEY (license_id) REFERENCES license (id),
            FOREIGN KEY (muscle_group_id) REFERENCES muscle_group (id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE exercise`);
  }
}
