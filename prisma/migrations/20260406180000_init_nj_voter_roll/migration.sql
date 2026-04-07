-- CreateTable
CREATE TABLE "nj_voter_roll" (
    "display_id" TEXT NOT NULL,
    "leg_id" BIGINT,
    "party" TEXT,
    "status" TEXT,
    "reg_date" DATE,
    "dob" DATE,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle" TEXT,
    "suffix" TEXT,
    "street_num" INTEGER,
    "street_pre" TEXT,
    "street_post" TEXT,
    "street_base" TEXT,
    "street_suff" TEXT,
    "street_name" TEXT,
    "apt_unit" TEXT,
    "city" TEXT,
    "address" TEXT,
    "zip" TEXT NOT NULL,
    "county" TEXT,
    "congressional" INTEGER,
    "first_normalized" TEXT NOT NULL,
    "last_normalized" TEXT NOT NULL,

    CONSTRAINT "nj_voter_roll_pkey" PRIMARY KEY ("display_id")
);

-- CreateIndex
CREATE INDEX "nj_voter_roll_first_normalized_last_normalized_zip_idx" ON "nj_voter_roll"("first_normalized", "last_normalized", "zip");
