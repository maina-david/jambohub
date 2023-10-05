/*
  Warnings:

  - You are about to drop the column `type` on the `Campaign` table. All the data in the column will be lost.
  - Added the required column `audience` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Campaign` DROP COLUMN `type`,
    ADD COLUMN `audience` ENUM('INTERNAL', 'GLOBAL') NOT NULL;
