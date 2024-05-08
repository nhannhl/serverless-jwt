const { createUser } = require("../lib/db");

module.exports.handler = async function registerUser(event) {
  const body = JSON.parse(event.body);

  return createUser(body)
  .then(user => {
    return {
      statusCode: 200,
      body: JSON.stringify({ user })
    };
  })
  .catch(error => {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ error })
    };
  });
};