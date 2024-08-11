-- INSERT INTO "Lesson" ("name", "contents")
--     VALUES (
--         'Javascript',
--         'Javascript is a programming language mostly used in web development'
--         ),
--         (
--             'C++',
--             'C++ is a high level programming with object oriented programming paradigm, used for embedded system, operating system'
--         ),
--         (
--             'Java',
--             'Java is a programming language object oriented programming paradigm, used for developing robust backend APIs'
--         )

-- INSERT INTO "LessonCategory" ("name", "description")
--     VALUES (
--         'High level programming Langauges',
--         'A lesson on the topics and definitions of of high level programming languages'
--         ),
--         (
--         'Low level programming Langauges',
--         'A lesson on the topics and definitions of of level level programming languages'
--         )

UPDATE "Lesson"
SET "categoryId" = 3
WHERE "Lesson"."id" = 1