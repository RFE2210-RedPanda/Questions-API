import sql from '../db.js';

let photosSeq = 'photos_id_seq';
let photosMax = await sql`SELECT MAX(id) from photos;`;
photosMax = photosMax[0].max;
await sql`SELECT setval(${photosSeq}, ${photosMax})`;

let answersSeq = 'answers_id_seq';
let answersMax = await sql`SELECT MAX(id) from answers;`;
answersMax = answersMax[0].max;
await sql`SELECT setval(${answersSeq}, ${answersMax})`;

let questionsSeq = 'questions_id_seq';
let questionsMax = await sql`SELECT MAX(id) from questions;`;
questionsMax = questionsMax[0].max;
await sql`SELECT setval(${questionsSeq}, ${questionsMax})`;

await sql.end();

console.log('ID counts fixed');

