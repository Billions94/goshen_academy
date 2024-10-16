import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsPurchasedCart1729092043525 implements MigrationInterface {
    name = 'AddIsPurchasedCart1729092043525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_invitation" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 hour'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_invitation" ALTER COLUMN "expiresAt" SET DEFAULT (now() + '01:00:00')`);
    }

}
