import express from 'express';
import sql from '../db/db.js';
const app = express();
const port = 3000;

app.use(express.json());

app.get('/qa/questions', async (req, res) => {
  let product_id = Number(req.query.product_id);
  let page = req.query.page ? Number(req.query.page) : 1;
  let count = req.query.count ? Number(req.query.count) : 5;
  let start = (page - 1) * count;
  let end = page * count;

  let res_to_send = {
    "product_id": product_id,
    "results": await sql`
      SELECT q.question_id, q.question_body, q.question_date, q.asker_name, q.question_helpfulness, q.reported,
      json_agg(json_build_object('id', a.id, 'body', a.body, 'date', a.date, 'answerer_name', a.answerer_name, 'helpfulness', a.helpfulness, 'photos', a.photos)) AS answers
      FROM questions q
      INNER JOIN answers a
      ON a.question_id = q.question_id
      WHERE q.product_id = ${product_id} AND q.reported = false AND a.reported = false
      GROUP BY q.question_id;`
  }

  res_to_send.results = res_to_send.results.slice(start, end);

  res.send(res_to_send);

});

app.get('/qa/questions/:question_id/answers', async (req, res) => {
  let question_id = req.params.question_id;
  let page = req.query.page ? Number(req.query.page) : 1;
  let count = req.query.count ? Number(req.query.count) : 5;
  let start = (page - 1) * count;
  let end = page * count;

  let res_to_send = {
    "question": question_id,
    "page": page,
    "count": count,
    "results": await sql`
      SELECT id AS answer_id, body, date, answerer_name, helpfulness, photos
      FROM answers
      WHERE question_id = ${question_id} AND reported = false;
    `
  }

  res_to_send.results = res_to_send.results.slice(start, end);

  res.send(res_to_send);

});

app.post('/qa/questions', async (req, res) => {
  let body = req.body.body;
  let name = req.body.name;
  let email = req.body.email;
  let product_id = req.body.product_id;

  if (typeof body !== 'string' || typeof name !== 'string' || typeof email !== 'string' || typeof product_id !== 'number') {
    res.status(422).send();
  } else {
    await sql`
      INSERT INTO questions (product_id, question_body, question_date, asker_name, email, question_helpfulness, reported)
      VALUES (${product_id}, ${body}, ${new Date().toISOString()}, ${name}, ${email}, 0, false);
    `;
    res.status(201).send();
  }
});

app.post('/qa/questions/:question_id/answers', async (req, res) => {
  let question_id = Number(req.params.question_id);
  let body = req.body.body;
  let name = req.body.name;
  let email = req.body.email;
  let temp_photos = req.body.photos;
  let photos = [];

  if (isNaN(question_id) || typeof body !== 'string' || typeof name !== 'string' || typeof email !== 'string' || !Array.isArray(temp_photos)) {
    res.status(422).send();
  } else {

    let max_photo_id = await sql`SELECT MAX(id) FROM temp_photos;`;
    max_photo_id = Number(max_photo_id[0].max);

    let max_answer_id = await sql`SELECT MAX(id) FROM answers`;
    max_answer_id = Number(max_answer_id[0].max);

    temp_photos.forEach(async (photo) => {
      let photo_obj = {
        "id": max_photo_id + 1,
        "url": photo
      }

      photos.push(photo_obj);
      max_photo_id++;

      await sql`
        INSERT INTO temp_photos (id, answer_id, url)
        VALUES (${max_photo_id}, ${max_answer_id + 1}, ${photo});
      `
    });

    await sql`
      INSERT INTO answers (question_id, body, date, answerer_name, email, helpfulness, reported, photos)
      VALUES (${question_id}, ${body}, ${new Date().toISOString()}, ${name}, ${email}, 0, false, ${photos});
    `;
    res.status(201).send();
  }
});

app.put('/qa/questions/:question_id/helpful', async (req, res) => {
  let question_id = Number(req.params.question_id);
  await sql`
    UPDATE questions
    SET question_helpfulness = question_helpfulness + 1
    WHERE question_id = ${question_id};
  `
  res.status(204).send();
});

app.put('/qa/questions/:question_id/report', async (req, res) => {
  let question_id = Number(req.params.question_id);
  await sql`
    UPDATE questions
    SET reported = true
    WHERE question_id = ${question_id};
  `
  res.status(204).send();
});

app.put('/qa/answers/:answer_id/helpful', async (req, res) => {
  let answer_id = Number(req.params.answer_id);
  await sql`
    UPDATE anwers
    SET helpfulness = helpfulness + 1
    WHERE id = ${answer_id};
  `
  res.status(204).send();
});

app.put('/qa/answers/:answer_id/report', async (req, res) => {
  let answer_id = Number(req.params.answer_id);
  await sql`
    UPDATE anwers
    SET reported = true
    WHERE id = ${answer_id};
  `
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
});