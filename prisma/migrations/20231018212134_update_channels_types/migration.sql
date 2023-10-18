/*
  Warnings:

  - The values [FACEBOOK] on the enum `Contact_channel` will be removed. If these variants are still used in the database, this will fail.
  - The values [FACEBOOK] on the enum `Contact_channel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Channel` MODIFY `type` ENUM('WHATSAPP', 'TWITTER', 'FACEBOOK_MESSENGER', 'SMS') NOT NULL;

-- AlterTable
ALTER TABLE `Contact` MODIFY `channel` ENUM('WHATSAPP', 'TWITTER', 'FACEBOOK_MESSENGER', 'SMS') NOT NULL;
