/*
  Warnings:

  - You are about to drop the column `items` on the `ProductionList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductionList" DROP COLUMN "items";

-- CreateTable
CREATE TABLE "ProductionListItem" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "orderedQuantity" INTEGER NOT NULL,
    "productionAmount" INTEGER NOT NULL,
    "productionListId" INTEGER NOT NULL,

    CONSTRAINT "ProductionListItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductionListItem" ADD CONSTRAINT "ProductionListItem_productionListId_fkey" FOREIGN KEY ("productionListId") REFERENCES "ProductionList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
