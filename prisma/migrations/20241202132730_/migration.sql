-- CreateTable
CREATE TABLE "healthprofile" (
    "id" TEXT NOT NULL,
    "allergies" TEXT[],
    "chronicConditions" TEXT[],
    "pastSurgeries" TEXT[],
    "dietaryPreferences" TEXT[],
    "familyMedicalHistory" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "healthprofile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playing_with_neon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" REAL,

    CONSTRAINT "playing_with_neon_pkey" PRIMARY KEY ("id")
);
