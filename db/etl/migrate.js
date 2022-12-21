import sql from '../db.js';
import createTables from './createTables.js';
// import importQuestions from './importQuestions.js';
// import importAnswers from './importAnswers.js';
// import importPhotos from './importPhotos.js';

//This will not work ATM because of memory limits

await createTables();
await sql.end();

// importQuestions()
//   .then(() => {
//     importAnswers()
//       .then (() => {
//         importPhotos();
//       });
//   });