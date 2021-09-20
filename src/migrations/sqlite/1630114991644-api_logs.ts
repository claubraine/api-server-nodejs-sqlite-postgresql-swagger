import {MigrationInterface, QueryRunner} from "typeorm";

export class apiLogs1630114991644 implements MigrationInterface {

    name = 'apiLogs1630114991644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "api_logs" (
                "id" varchar PRIMARY KEY NOT NULL, 
                "token" text NOT NULL, 
                "userId" text NOT NULL, 
                "originalUrl" text NOT NULL, 
                "method" text NOT NULL,                 
                "date" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`
        );       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "api_logs"`);
    }

}
