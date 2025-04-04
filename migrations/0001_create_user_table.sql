-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "rank" INTEGER NOT NULL,
    "avatar" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Game" (
    "game_id" TEXT NOT NULL PRIMARY KEY,
    "mode" TEXT NOT NULL,
    "rule" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "handicap" INTEGER,
    "kif" TEXT,
    "play_time" DATETIME NOT NULL,
    "position" TEXT,
    "result" TEXT NOT NULL,
    "reason" TEXT,
    "black_id" TEXT NOT NULL,
    "white_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Game_black_id_fkey" FOREIGN KEY ("black_id") REFERENCES "User" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Game_white_id_fkey" FOREIGN KEY ("white_id") REFERENCES "User" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);
