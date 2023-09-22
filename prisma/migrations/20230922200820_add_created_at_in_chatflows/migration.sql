/*
  Warnings:

  - You are about to drop the column `active` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Chatflow` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `nodes` JSON NULL,
    ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Company` DROP COLUMN `active`;
