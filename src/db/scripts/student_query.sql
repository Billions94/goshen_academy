-- INSERT INTO lesson_category (name, description)
-- VALUES (
--         'Mathematics',
--         'A class focused on mathematical concepts and operations.'
--     ),
--     (
--         'Science',
--         'A class focused on scientific concepts and experiments.'
--     ),
--     (
--         'English',
--         'A class focused on the written and spoken language.'
--     ),
--     (
--         'Social Studies',
--         'A class focused on understanding human behavior and society.'
--     ),
--     (
--         'Computer Science',
--         'A class focused on the principles of computer science and programming.'
--     ),
--     (
--         'Physics',
--         'A class focused on the fundamental principles of physics.'
--     ),
--     (
--         'Chemistry',
--         'A class focused on the principles of chemistry.'
--     ),
--     (
--         'Biology',
--         'A class focused on the principles of biology.'
--     ),
--     (
--         'History',
--         'A class focused on the history of various cultures.'
--     )
-- ALTER TABLE lesson
-- ADD COLUMN student_id BIGSERIAL,
--     ADD CONSTRAINT fk_student_lesson FOREIGN KEY (student_id) REFERENCES student (id) ON DELETE NO ACTION ON UPDATE NO ACTION
-- SELECT l.id AS lesson_id,
--     l.name AS lesson_name,
--     s.first_name,
--     s.date_of_birth AS dob,
--     s.nationality AS county_of_birth
-- FROM lesson l
--     JOIN student s ON l.student_id = s.id
-- ORDER BY s.first_name
SELECT first_name,
    last_name,
    EXTRACT(
        YEAR
        FROM AGE(CURRENT_DATE, date_of_birth::date)
    ) AS age,
    nationality
FROM student
WHERE date_of_birth BETWEEN '1990-01-01' AND '2003-05-01'
ORDER BY first_name
LIMIT 50