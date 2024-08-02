-- CreateTable
CREATE TABLE "Avatar" (
    "uuid" UUID NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
