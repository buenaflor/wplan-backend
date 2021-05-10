import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMuscleGroupTable1620607530629 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE muscle_group
        (
            id          uuid NOT NULL DEFAULT uuid_generate_v4(),
            name        TEXT NOT NULL,
            description TEXT,
            CHECK ( length(name) < 64 ),
            CHECK ( length(description) < 500),
            PRIMARY KEY (id)
        );

        insert into muscle_group (name)
        values ('Abdominals');
        insert into muscle_group (name)
        values ('Adductors');
        insert into muscle_group (name)
        values ('Abductors');
        insert into muscle_group (name)
        values ('Quadriceps');
        insert into muscle_group (name)
        values ('Biceps');
        insert into muscle_group (name)
        values ('Shoulders');
        insert into muscle_group (name)
        values ('Chest');
        insert into muscle_group (name)
        values ('Hamstrings');
        insert into muscle_group (name)
        values ('Middleback');
        insert into muscle_group (name)
        values ('Calves');
        insert into muscle_group (name)
        values ('Glutes');
        insert into muscle_group (name)
        values ('Lowerback');
        insert into muscle_group (name)
        values ('Lats');
        insert into muscle_group (name)
        values ('Traps');
        insert into muscle_group (name)
        values ('Triceps');
        insert into muscle_group (name)
        values ('Forearms');
        insert into muscle_group (name)
        values ('Neck');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE muscle_group`);
  }
}
