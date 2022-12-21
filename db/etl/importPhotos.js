import sql from '../db.js';
import fs from 'fs';
import { parse } from 'csv-parse';

const importPhotos = async () => {
  fs.createReadStream("./db/backup-data/answers_photos.csv")
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on('data', async (row) => {
    await sql`
    INSERT INTO photos (id, answer_id, url)
    VALUES (${row.id}, ${row.answer_id}, ${row.url});
    `;
  })
  .on('end', async () => {
    console.log('All photos queued to be added to database, check number and once it stops going up you can end this process');
  });
}

importPhotos();

export default importPhotos;