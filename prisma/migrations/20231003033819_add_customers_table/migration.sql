/*
  Warnings:

  - You are about to drop the column `leadId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `customerId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Chat` DROP FOREIGN KEY `Chat_leadId_fkey`;

-- DropForeignKey
ALTER TABLE `Lead` DROP FOREIGN KEY `Lead_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `Lead` DROP FOREIGN KEY `Lead_ownerId_fkey`;

-- AlterTable
ALTER TABLE `Chat` DROP COLUMN `leadId`,
    ADD COLUMN `customerId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Lead`;

-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `fullNames` VARCHAR(191) NOT NULL,
    `identification` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `occupation` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `companyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Customer_identification_key`(`identification`),
    UNIQUE INDEX `Customer_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
