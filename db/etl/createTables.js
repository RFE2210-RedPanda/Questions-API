import sql from '../db.js';

const createTables = async () => {
  await sql`
  CREATE TABLE IF NOT EXISTS questions (
    question_id SERIAL PRIMARY KEY,
    product_id INT,
    question_body VARCHAR(1000),
    question_date VARCHAR(100),
    asker_name VARCHAR(60),
    email VARCHAR(60),
    question_helpfulness INT,
    reported BOOLEAN NOT NULL
  );`;

  await sql`CREATE TABLE IF NOT EXISTS temp_answers (
    id SERIAL PRIMARY KEY,
    question_id INT,
    body VARCHAR(1000),
    date VARCHAR(100),
    answerer_name VARCHAR(60),
    email VARCHAR(60),
    helpfulness INT,
    reported BOOLEAN NOT NULL
  );`;

  await sql`CREATE TABLE IF NOT EXISTS temp_photos (
    id SERIAL PRIMARY KEY,
    answer_id INT,
    url VARCHAR(300)
  );`;

}

export default createTables;