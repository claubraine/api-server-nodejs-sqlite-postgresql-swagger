import {MigrationInterface, QueryRunner} from "typeorm";

export class activeSession1630114356545 implements MigrationInterface {

    name = 'activeSession1630114356545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "active_session" (
                "id" SERIAL PRIMARY KEY, 
                "token" text NOT NULL, 
                "userId" text NOT NULL, 
                "status" boolean, 
                "date" TIMESTAMP NOT NULL DEFAULT NOW())`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "active_session"`);
    }

}
