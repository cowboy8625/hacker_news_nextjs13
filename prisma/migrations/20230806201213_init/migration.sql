-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hackerPostId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
