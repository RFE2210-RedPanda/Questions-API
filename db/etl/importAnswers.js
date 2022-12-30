import sql from '../db.js';
import fs from 'fs';
import { parse } from 'csv-parse';

const importAnswers = async () => {
  fs.createReadStream("./db/backup-data/answers.csv")
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
    INSERT INTO temp_answers (id, question_id, body, date, answerer_name, email, helpfulness, reported)
    VALUES (${row.id}, ${row.question_id}, ${row.body}, ${timestamp}, ${row.answerer_name}, ${row.answerer_email}, ${row.helpful}, ${row.reported === '1' ? true : false});
    `;
  })
  .on('end', async () => {
    console.log('All answers queued to be added to database, check number and once it stops going up you can end this process');
  });
}

importAnswers();

export default importAnswers;