/*
  Warnings:

  - Added the required column `maxChatflows` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTeams` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Subscription` ADD COLUMN `maxChatflows` INTEGER NOT NULL,
    ADD COLUMN `maxTeams` INTEGER NOT NULL;
