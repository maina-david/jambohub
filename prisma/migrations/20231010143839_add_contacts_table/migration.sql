/*
  Warnings:

  - The values [TIKTOK] on the enum `Contact_channel` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `customerId` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `contactId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Chat` DROP FOREIGN KEY `Chat_customerId_fkey`;

-- AlterTable
ALTER TABLE `Campaign` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Channel` MODIFY `type` ENUM('WHATSAPP', 'TWITTER', 'FACEBOOK', 'SMS') NOT NULL;

-- AlterTable
ALTER TABLE `Chat` DROP COLUMN `customerId`,
    ADD COLUMN `contactId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Contact` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `channel` ENUM('WHATSAPP', 'TWITTER', 'FACEBOOK', 'SMS') NOT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `alias` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
