-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "rank" INTEGER NOT NULL,
    "avatar" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tags" (
    "tag_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "games" (
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
    CONSTRAINT "games_black_id_fkey" FOREIGN KEY ("black_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "games_white_id_fkey" FOREIGN KEY ("white_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "game_tags" (
    "game_id" TEXT NOT NULL,
    "tag_id" INTEGER NOT NULL,

    PRIMARY KEY ("game_id", "tag_id"),
    CONSTRAINT "game_tags_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games" ("game_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "game_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags" ("tag_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GameTags" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GameTags_A_fkey" FOREIGN KEY ("A") REFERENCES "games" ("game_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GameTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags" ("tag_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "games_mode_idx" ON "games"("mode");

-- CreateIndex
CREATE INDEX "games_rule_idx" ON "games"("rule");

-- CreateIndex
CREATE INDEX "games_type_idx" ON "games"("type");

-- CreateIndex
CREATE INDEX "games_handicap_idx" ON "games"("handicap");

-- CreateIndex
CREATE UNIQUE INDEX "_GameTags_AB_unique" ON "_GameTags"("A", "B");

-- CreateIndex
CREATE INDEX "_GameTags_B_index" ON "_GameTags"("B");
