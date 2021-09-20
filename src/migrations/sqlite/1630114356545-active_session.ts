import {MigrationInterface, QueryRunner} from "typeorm";

export class activeSession1630114356545 implements MigrationInterface {

    name = 'activeSession1630114356545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "active_session" (
                "id" varchar PRIMARY KEY NOT NULL, 
                "token" text NOT NULL, 
                "userId" text NOT NULL, 
                "status" boolean, 
                "date" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "active_session"`);
    }

}
