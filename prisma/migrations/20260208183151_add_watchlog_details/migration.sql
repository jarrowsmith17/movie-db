/*
  Warnings:

  - Added the required column `title` to the `WatchLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WatchLog" ADD COLUMN     "posterPath" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
