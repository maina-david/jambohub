/*
  Warnings:

  - Made the column `description` on table `Channel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Channel` MODIFY `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Subscription` MODIFY `maxCompanies` INTEGER NOT NULL DEFAULT 1,
    MODIFY `maxTeams` INTEGER NOT NULL DEFAULT 1,
    MODIFY `maxUsers` INTEGER NOT NULL DEFAULT 1,
    MODIFY `maxChannels` INTEGER NOT NULL DEFAULT 1,
    MODIFY `maxChatflows` INTEGER NOT NULL DEFAULT 1,
    MODIFY `currentPeriodEnd` DATETIME(3) NULL;
