/*
  Warnings:

  - You are about to drop the column `usersLiked` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "usersLiked";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "usersLiked" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
