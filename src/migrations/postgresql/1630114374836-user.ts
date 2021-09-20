import { MigrationInterface, QueryRunner } from "typeorm";

export class user1630114374836 implements MigrationInterface {

    name = 'user1630114374836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY, 
                "username" text NOT NULL, 
                "email" text NOT NULL, 
                "password" text NOT NULL, 
                "status" boolean,
                "confirmacao_registro" boolean,
                "confirmacao_token" text NOT NULL, 
                "user_token" text NOT NULL, 
                "date" TIMESTAMP NOT NULL DEFAULT NOW())`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
