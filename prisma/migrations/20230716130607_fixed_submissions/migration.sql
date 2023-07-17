-- CreateTable
CREATE TABLE "Submissions" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "uniqueCode" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "folderName" TEXT NOT NULL,
    "locations" TEXT[],

    CONSTRAINT "Submissions_pkey" PRIMARY KEY ("id")
);
