/*
  Warnings:

  - You are about to drop the column `photoId` on the `post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_photoId_fkey";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "photoId",
ADD COLUMN     "caption" TEXT,
ADD COLUMN     "isCarousel" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "post_photo" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "photoId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_photo_postId_order_key" ON "post_photo"("postId", "order");

-- AddForeignKey
ALTER TABLE "post_photo" ADD CONSTRAINT "post_photo_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_photo" ADD CONSTRAINT "post_photo_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
