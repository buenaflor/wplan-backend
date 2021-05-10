import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkoutPlanCollaboratorTable1620674664962 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE workout_plan_collaborator
        (
            id              uuid NOT NULL DEFAULT uuid_generate_v4(),
            workout_plan_id uuid NOT NULL,
            user_id         uuid NOT NULL,
            role_id         uuid NOT NULL,
            permission_id   uuid NOT NULL,
            created_at timestamptz NOT NULL DEFAULT current_timestamp,
            updated_at timestamptz NOT NULL DEFAULT current_timestamp,
            PRIMARY KEY (id),
            FOREIGN KEY (workout_plan_id) REFERENCES workout_plan (id),
            FOREIGN KEY (user_id) REFERENCES "user" (id),
            FOREIGN KEY (role_id) REFERENCES workout_plan_role (id),
            FOREIGN KEY (permission_id) REFERENCES workout_plan_permission (id)
        );

    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE workout_plan_collaborator`);
  }

}
