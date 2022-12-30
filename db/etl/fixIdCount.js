import sql from '../db.js';

await sql`
  CREATE TABLE answers
  AS (SELECT a.*, json_agg(json_build_object('id', p.id, 'url', p.url)) AS photos
  FROM temp_answers a
  LEFT JOIN temp_photos p
  ON a.id = p.answer_id
  GROUP BY a.id);
`;

await sql`CREATE SEQUENCE answers_id_seq OWNED BY answers.id;`;
await sql`SELECT setval('answers_id_seq', coalesce(max(id), 0) + 1, false) FROM answers;`;
await sql`ALTER TABLE answers ALTER COLUMN id SET DEFAULT nextval('answers_id_seq');`;
await sql`UPDATE answers SET photos = '[]' WHERE photos->0->>'id' IS NULL;`;
await sql`ALTER TABLE answers ADD PRIMARY KEY (id);`;

await sql`DROP TABLE temp_answers;`

let questionsSeq = 'questions_question_id_seq';
let questionsMax = await sql`SELECT MAX(question_id) from questions;`;
questionsMax = questionsMax[0].max;
await sql`SELECT setval(${questionsSeq}, ${questionsMax})`;

let photosSeq = 'photos_id_seq';
let photosMax = await sql`SELECT MAX(id) from temp_photos;`;
photosMax = questionsMax[0].max;
await sql`SELECT setval(${photosSeq}, ${photosMax})`;

await sql`CREATE INDEX product_id_index ON questions (product_id);`;
await sql`CREATE INDEX question_id_index ON answers (question_id);`;

await sql.end();

console.log('ID counts fixed');

