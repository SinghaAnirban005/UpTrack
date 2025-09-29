-- CreateEnum
CREATE TYPE "public"."websiteStatus" AS ENUM ('Up', 'Down', 'Unknown');

-- CreateTable
CREATE TABLE "public"."website" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "time_added" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."websiteTick" (
    "id" TEXT NOT NULL,
    "status" "public"."websiteStatus" NOT NULL,
    "response_time_ms" INTEGER NOT NULL,
    "website_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "websiteTick_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."website" ADD CONSTRAINT "website_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."websiteTick" ADD CONSTRAINT "websiteTick_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "public"."region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."websiteTick" ADD CONSTRAINT "websiteTick_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "public"."website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
