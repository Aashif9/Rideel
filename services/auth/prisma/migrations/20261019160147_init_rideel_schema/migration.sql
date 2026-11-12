/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SENDER', 'TRAVELER', 'BUSINESS', 'ADMIN');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('POSTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ParcelStatus" AS ENUM ('CREATED', 'MATCHING', 'TRAVELER_SELECTED', 'PAYMENT_PENDING', 'PAYMENT_SECURED', 'PICKUP_PENDING', 'PICKUP_CONFIRMED', 'HANDED_TO_TRAVELER', 'IN_TRANSIT', 'ARRIVED', 'DELIVERY_PENDING', 'DELIVERED', 'ESCROW_RELEASED', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "HandoffMethod" AS ENUM ('DIRECT', 'PARTNER_HUB');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isKycVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "image" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'SENDER';

-- CreateTable
CREATE TABLE "TravelerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "totalDeliveries" INTEGER NOT NULL DEFAULT 0,
    "successfulTrips" INTEGER NOT NULL DEFAULT 0,
    "cancellationRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "vehicleDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "travelerId" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "travelDate" TEXT NOT NULL,
    "departureTime" TEXT NOT NULL,
    "estimatedArrival" TEXT NOT NULL,
    "totalCapacityKg" DOUBLE PRECISION NOT NULL,
    "remainingCapacityKg" DOUBLE PRECISION NOT NULL,
    "maxWeightPerItemKg" DOUBLE PRECISION NOT NULL,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'POSTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parcel" (
    "id" TEXT NOT NULL,
    "parcelCode" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "travelerId" TEXT,
    "tripId" TEXT,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "dispatchDate" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "estimatedValue" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "isFragile" BOOLEAN NOT NULL DEFAULT false,
    "specialHandling" TEXT,
    "receiverName" TEXT NOT NULL,
    "receiverPhone" TEXT NOT NULL,
    "destinationAddress" TEXT NOT NULL,
    "pickupMethod" "HandoffMethod" NOT NULL DEFAULT 'DIRECT',
    "deliveryMethod" "HandoffMethod" NOT NULL DEFAULT 'DIRECT',
    "status" "ParcelStatus" NOT NULL DEFAULT 'CREATED',
    "ratePerKg" DOUBLE PRECISION,
    "deliveryFee" DOUBLE PRECISION,
    "platformFee" DOUBLE PRECISION,
    "totalAmount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscrowTransaction" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'HELD',
    "paymentGateway" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EscrowTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpVerification" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "pickupOtp" TEXT NOT NULL,
    "deliveryOtp" TEXT NOT NULL,
    "isPickupVerified" BOOLEAN NOT NULL DEFAULT false,
    "isDeliveryVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerHub" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "openingHours" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerHub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "reviewerId" TEXT NOT NULL,
    "revieweeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TravelerProfile_userId_key" ON "TravelerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Parcel_parcelCode_key" ON "Parcel"("parcelCode");

-- CreateIndex
CREATE UNIQUE INDEX "EscrowTransaction_parcelId_key" ON "EscrowTransaction"("parcelId");

-- CreateIndex
CREATE UNIQUE INDEX "OtpVerification_parcelId_key" ON "OtpVerification"("parcelId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "TravelerProfile" ADD CONSTRAINT "TravelerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_travelerId_fkey" FOREIGN KEY ("travelerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscrowTransaction" ADD CONSTRAINT "EscrowTransaction_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtpVerification" ADD CONSTRAINT "OtpVerification_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
