import sql from '../db.js';

const createTables = async () => {
  await sql`
  CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    product_id INT,
    question_body VARCHAR(1000),
    question_date VARCHAR(20),
    asker_name VARCHAR(60),
    email VARCHAR(60),
    question_helpfulness INT,
    reported INT
  );`;

  await sql`CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    question_id INT,
    answer_body VARCHAR(1000),
    answer_date VARCHAR(20),
    answerer_name VARCHAR(60),
    email VARCHAR(60),
    answer_helpfulness INT,
    reported INT
  );`;

  await sql`CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    answer_id INT,
    url VARCHAR(300)
  );`;

}

export default createTables;