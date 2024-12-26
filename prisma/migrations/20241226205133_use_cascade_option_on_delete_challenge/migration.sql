-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_challengeId_fkey";

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
