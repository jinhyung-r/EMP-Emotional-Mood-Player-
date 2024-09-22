-- CreateTable
CREATE TABLE `playlists` (
    `playlistId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`playlistId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tracks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `artist` VARCHAR(191) NOT NULL,
    `albumArt` VARCHAR(191) NOT NULL,
    `genre` VARCHAR(191) NOT NULL,
    `playlistId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tracks` ADD CONSTRAINT `tracks_playlistId_fkey` FOREIGN KEY (`playlistId`) REFERENCES `playlists`(`playlistId`) ON DELETE RESTRICT ON UPDATE CASCADE;
