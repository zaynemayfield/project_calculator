-- AlterTable
ALTER TABLE `user` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `type` ENUM('user', 'admin', 'mod') NOT NULL DEFAULT 'user';
