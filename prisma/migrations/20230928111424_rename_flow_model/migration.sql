/*
  Warnings:

  - You are about to drop the `AutomationFlow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AutomationFlow` DROP FOREIGN KEY `AutomationFlow_companyId_fkey`;

-- DropTable
DROP TABLE `AutomationFlow`;

-- CreateTable
CREATE TABLE `Flow` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `nodes` JSON NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Flow` ADD CONSTRAINT `Flow_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
