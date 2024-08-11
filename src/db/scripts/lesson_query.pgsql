-- SELECT
--     "id" AS "lesson_id",
--     "name",
--     "contents",
--     "categoryId" AS "category_id"
-- FROM "Lesson"

-- SELECT
--     "l"."id" AS "lesson_id",
--     "l"."name",
--     "l"."contents",
--     "lc"."name" AS "lesson_category",
--     "lc"."description" AS "category_description"
-- FROM "Lesson" l
--     JOIN "LessonCategory" lc
--         ON "lc"."id" = "l"."categoryId"
-- WHERE "lc"."name" LIKE '%Low level%'

SELECT "name" AS "lesson_category_name" FROM "LessonCategory"