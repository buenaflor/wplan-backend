import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkoutPlanCollaboratorInvitationTable1620676857568 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS workout_plan_collaborator_invitation
        (
            id              uuid        NOT NULL DEFAULT uuid_generate_v4(),
            workout_plan_id uuid        NOT NULL,
            invitee_user_id uuid        NOT NULL,
            inviter_user_id uuid        NOT NULL,
            role_id         uuid        NOT NULL,
            permission_id   uuid        NOT NULL,
            created_at      timestamptz NOT NULL DEFAULT current_timestamp,
            updated_at      timestamptz NOT NULL DEFAULT current_timestamp,
            PRIMARY KEY (id),
            FOREIGN KEY (workout_plan_id) REFERENCES workout_plan (id),
            FOREIGN KEY (invitee_user_id) REFERENCES "user" (id),
            FOREIGN KEY (inviter_user_id) REFERENCES "user" (id),
            FOREIGN KEY (role_id) REFERENCES workout_plan_role (id),
            FOREIGN KEY (permission_id) REFERENCES workout_plan_permission (id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE workout_plan_collaborator_invitation`)
  }

}
