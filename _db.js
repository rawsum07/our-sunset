const { getDatabase } = require('@netlify/database');

const db = getDatabase();
const sql = db.sql.bind(db);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

function json(statusCode, body) {
  return {
    statusCode,
    headers,
    body: JSON.stringify(body)
  };
}

function authorized(event) {
  let token =
    event.headers?.['x-admin-token'] ||
    event.headers?.['X-Admin-Token'];

  if (!token) {
    try {
      token = JSON.parse(event.body || '{}').token;
    } catch (e) {}
  }

  return !!process.env.ADMIN_TOKEN &&
    token === process.env.ADMIN_TOKEN;
}

module.exports = {
  sql,
  headers,
  json,
  authorized
};
