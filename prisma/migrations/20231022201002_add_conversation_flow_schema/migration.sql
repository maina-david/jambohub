-- CreateTable
CREATE TABLE `ConversationFlow` (
    `id` VARCHAR(191) NOT NULL,
    `nodeId` VARCHAR(191) NOT NULL,
    `parentNodeId` VARCHAR(191) NULL,
    `childNodeId` VARCHAR(191) NULL,
    `nodeType` VARCHAR(191) NOT NULL,
    `nodeOption` VARCHAR(191) NULL,
    `nodeData` VARCHAR(191) NOT NULL,
    `flowId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ConversationFlow` ADD CONSTRAINT `ConversationFlow_flowId_fkey` FOREIGN KEY (`flowId`) REFERENCES `Flow`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
