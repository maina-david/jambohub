/*
  Warnings:

  - You are about to drop the column `type` on the `Chat` table. All the data in the column will be lost.
  - The values [AUTOMATED] on the enum `ChatMessage_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `category` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Chat` DROP COLUMN `type`,
    ADD COLUMN `category` ENUM('AUTOMATED', 'INTERACTIVE') NOT NULL,
    ADD COLUMN `status` ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE `ChatMessage` ADD COLUMN `category` ENUM('AUTOMATED', 'INTERACTIVE') NOT NULL,
    MODIFY `type` ENUM('TEXT', 'MEDIA', 'CONTACT', 'LOCATION', 'INTERACTIVE', 'TEMPLATE') NOT NULL;
