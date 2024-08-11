SELECT
    "firstName" AS "first_name",
    "lastName" AS "last_name"
FROM "Student"
WHERE "Student"."firstName" LIKE '%o%'
ORDER BY "Student"."lastName";

-- INSERT INTO "Student" (
--     "studentId",
--     "firstName",
--     "lastName",
--     "age",
--     "email",
--     "password",
--     "createdAt"
--     )
--     VALUES (
--         '2342GA',
--         'Prince',
--         'Benjamin',
--         40,
--         'pb@gmail.com',
--         '123456',
--         '2024-08-10'
--     ),
--     (
--         '0071GA',
--         'Wilson',
--         'Ocode',
--         37,
--         'ocode@gmail.com',
--         '123456',
--         '2024-08-10'
--     )
