-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "location" geography(Point,4326);
