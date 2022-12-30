import sql from '../db.js';
import fs from 'fs';
import { parse } from 'csv-parse';

const importQuestions = async () => {
  fs.createReadStream("./db/backup-data/questions.csv")
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on('data', async (row) => {
    let timestamp = new Date(Number(row.date_written)).toISOString();
    await sql`
    INSERT INTO questions (question_id, product_id, question_body, question_date, asker_name, email, question_helpfulness, reported)
    VALUES (${row.id}, ${row.product_id}, ${row.body}, ${timestamp}, ${row.asker_name}, ${row.asker_email}, ${row.helpful}, ${row.reported === '1' ? true : false});
    `;
  })
  .on('end', async () => {
    console.log('All questions queued to be added to database, check number and once it stops going up you can end this process');
  });
}

importQuestions();

export default importQuestions;