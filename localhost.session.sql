-- Create a temporary table to generate and hold real random image URLs for the first 1000 student records
WITH random_images AS (
    SELECT id,
        'https://picsum.photos/seed/' || md5(random()::text) || '/200/300' AS random_url
    FROM student
    ORDER BY id
    LIMIT 1000
) -- Update the first 1000 student records with real random image URLs
UPDATE student
SET image = random_images.random_url
FROM random_images
WHERE student.id = random_images.id;