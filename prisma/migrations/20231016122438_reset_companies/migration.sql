/*
  Warnings:

  - Made the column `email` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `website` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dialingCode` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `streetAddress` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zipCode` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `timeZone` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Company` MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `website` VARCHAR(191) NOT NULL,
    MODIFY `dialingCode` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL,
    MODIFY `streetAddress` VARCHAR(191) NOT NULL,
    MODIFY `city` VARCHAR(191) NOT NULL,
    MODIFY `state` VARCHAR(191) NOT NULL,
    MODIFY `zipCode` VARCHAR(191) NOT NULL,
    MODIFY `country` VARCHAR(191) NOT NULL,
    MODIFY `timeZone` VARCHAR(191) NOT NULL;
