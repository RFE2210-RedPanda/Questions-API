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
    await sql`
    INSERT INTO answers (id, question_id, answer_body, answer_date, answerer_name, email, answer_helpfulness, reported)
    VALUES (${row.id}, ${row.question_id}, ${row.body}, ${row.date_written}, ${row.answerer_name}, ${row.answerer_email}, ${row.helpful}, ${row.reported});
    `;
  })
  .on('end', async () => {
    console.log('All answers queued to be added to database, check number and once it stops going up you can end this process');
  });
}

importAnswers();

export default importAnswers;