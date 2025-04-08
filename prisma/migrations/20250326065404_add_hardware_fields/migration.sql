-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `matricNo` VARCHAR(191) NULL,
    `level` VARCHAR(191) NULL,
    `staffId` VARCHAR(191) NULL,
    `rfidId` VARCHAR(191) NULL,
    `fingerprintId` VARCHAR(191) NULL,
    `hardwareRegistrationComplete` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_matricNo_key`(`matricNo`),
    UNIQUE INDEX `User_staffId_key`(`staffId`),
    UNIQUE INDEX `User_rfidId_key`(`rfidId`),
    UNIQUE INDEX `User_fingerprintId_key`(`fingerprintId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
