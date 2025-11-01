/*
  Warnings:

  - You are about to drop the column `lat` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lat",
DROP COLUMN "lng";
