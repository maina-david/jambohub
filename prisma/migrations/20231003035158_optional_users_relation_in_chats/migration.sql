-- DropForeignKey
ALTER TABLE `Chat` DROP FOREIGN KEY `Chat_userId_fkey`;

-- AlterTable
ALTER TABLE `Chat` MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
