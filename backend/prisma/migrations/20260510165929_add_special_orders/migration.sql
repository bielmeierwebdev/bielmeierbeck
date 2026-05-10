-- CreateTable
CREATE TABLE "SpecialOrder" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "pickupDate" TIMESTAMP(3) NOT NULL,
    "pickupTime" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpecialOrder_pkey" PRIMARY KEY ("id")
);
