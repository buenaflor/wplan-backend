import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLicenseTable1620520348754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE license
        (
            id         uuid        NOT NULL DEFAULT uuid_generate_v4(),
            full_name  TEXT        NOT NULL,
            short_name TEXT        NOT NULL,
            url        TEXT        NOT NULL,
            created_at timestamptz NOT NULL DEFAULT current_timestamp,
            updated_at timestamptz NOT NULL DEFAULT current_timestamp,
            CHECK ( length(full_name) < 128 ),
            CHECK ( length(short_name) < 64 ),
            CHECK ( length(url) < 255 ),
            PRIMARY KEY (id)
        );
        INSERT INTO license(full_name, short_name, url)
        VALUES ('Open Data Commons Open Database License', 'ODbL', 'https://opendatacommons.org/licenses/odbl/');
        INSERT INTO license(full_name, short_name, url)
        VALUES ('Creative Commons Attribution 4', 'CC-BY 4', 'http://creativecommons.org/licenses/by/4.0/');
        INSERT INTO license(full_name, short_name, url)
        VALUES ('Creative Commons Attribution Share Alike 4', 'CC-BY-SA 4',
                'https://creativecommons.org/licenses/by-sa/4.0/deed.en');
        INSERT INTO license(full_name, short_name, url)
        VALUES ('Creative Commons Attribution Share Alike 3', 'CC-BY-SA 3',
                'https://creativecommons.org/licenses/by-sa/3.0/deed.en');
        INSERT INTO license(full_name, short_name, url)
        VALUES ('Creative Commons Public Domain 1.0', 'CC0', 'http://creativecommons.org/publicdomain/zero/1.0/');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE license`);
  }
}

/*
INSERT INTO exercise(name, license_author, license_id)
SELECT 'ab crunch machine', 'Giancarlo Buenaflor', id FROM license where
VALUES ('ab crunch machine', 'Giancarlo Buenaflor', 1, 1);

 */
