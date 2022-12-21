import postgres from 'postgres';

const sql = postgres('postgres://julian:login@localhost:5432/pandaware');

export default sql;