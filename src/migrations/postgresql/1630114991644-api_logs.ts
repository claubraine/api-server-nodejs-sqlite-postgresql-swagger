import {MigrationInterface, QueryRunner} from "typeorm";

export class apiLogs1630114991644 implements MigrationInterface {

    name = 'apiLogs1630114991644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "api_logs" (
                "id" SERIAL PRIMARY KEY, 
                "token" text NOT NULL, 
                "userId" text NOT NULL, 
                "originalUrl" text NOT NULL, 
                "method" text NOT NULL,                 
                "date" TIMESTAMP NOT NULL DEFAULT NOW())`
        );       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "api_logs"`);
    }

}
