-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'CHIEF', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "public"."FoodType" AS ENUM ('MIDDLE_EASTERN', 'LEBANESE', 'TURKISH', 'PERSIAN', 'EGYPTIAN', 'ARABIAN', 'PALESTINIAN', 'CHINESE', 'JAPANESE', 'KOREAN', 'TAIWANESE', 'MONGOLIAN', 'THAI', 'VIETNAMESE', 'FILIPINO', 'MALAYSIAN', 'INDONESIAN', 'SINGAPOREAN', 'INDIAN', 'PAKISTANI', 'BANGLADESHI', 'SRI_LANKAN', 'NEPALI', 'ITALIAN', 'FRENCH', 'SPANISH', 'PORTUGUESE', 'GREEK', 'GERMAN', 'BRITISH', 'SCANDINAVIAN', 'RUSSIAN', 'EASTERN_EUROPEAN', 'AMERICAN', 'CANADIAN', 'MEXICAN', 'BRAZILIAN', 'ARGENTINIAN', 'CARIBBEAN', 'NORTH_AFRICAN', 'ETHIOPIAN', 'MOROCCAN', 'WEST_AFRICAN', 'SOUTH_AFRICAN', 'FAST_FOOD', 'VEGAN', 'VEGETARIAN', 'FUSION', 'STREET_FOOD', 'SEAFOOD', 'BBQ', 'GRILLED', 'DESSERT', 'SNACK');

-- CreateEnum
CREATE TYPE "public"."ItemType" AS ENUM ('MAINDISH', 'DRINK', 'DESSERT', 'BEVERAGE');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'COOKING', 'DONE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nationalId" TEXT,
    "age" INTEGER,
    "lng" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "role" "public"."Role" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MenuItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "foodType" "public"."FoodType" NOT NULL,
    "itemType" "public"."ItemType" NOT NULL,
    "chief_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "chief_id" TEXT NOT NULL,
    "order_status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderItem" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "menuitem_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Order_customer_id_idx" ON "public"."Order"("customer_id");

-- CreateIndex
CREATE INDEX "Order_chief_id_idx" ON "public"."Order"("chief_id");

-- AddForeignKey
ALTER TABLE "public"."MenuItem" ADD CONSTRAINT "MenuItem_chief_id_fkey" FOREIGN KEY ("chief_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_chief_id_fkey" FOREIGN KEY ("chief_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_menuitem_id_fkey" FOREIGN KEY ("menuitem_id") REFERENCES "public"."MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
