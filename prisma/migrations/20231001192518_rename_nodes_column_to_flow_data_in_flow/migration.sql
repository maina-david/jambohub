/*
  Warnings:

  - You are about to drop the column `nodes` on the `Flow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Flow` DROP COLUMN `nodes`,
    ADD COLUMN `flowData` JSON NULL;
