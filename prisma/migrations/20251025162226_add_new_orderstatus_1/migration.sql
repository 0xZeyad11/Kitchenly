/*
  Warnings:

  - The values [CANCELED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."OrderStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'COOKING', 'DONE');
ALTER TABLE "public"."Order" ALTER COLUMN "order_status" DROP DEFAULT;
ALTER TABLE "public"."Order" ALTER COLUMN "order_status" TYPE "public"."OrderStatus_new" USING ("order_status"::text::"public"."OrderStatus_new");
ALTER TYPE "public"."OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "public"."OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "public"."Order" ALTER COLUMN "order_status" SET DEFAULT 'PENDING';
COMMIT;
