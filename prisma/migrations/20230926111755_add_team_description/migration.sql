/*
  Warnings:

  - Added the required column `description` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Team` ADD COLUMN `description` VARCHAR(191) NOT NULL;
