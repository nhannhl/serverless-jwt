const { Model } = require("dynamodb-toolbox");
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");

const User = new Model("User", {
  table: "users-table",
  partitionKey: "pkey",
  sortKey: "skey",
  schema: {
    pkey: { type: "string" },
    skey: { type: "string" },
    id: { type: "string" },
    passwordHash: { type: "string" },
    createdAt: { type: "string" }
  }
});

AWS.config.update({ region: "ap-southeast-1" });

const docClient = new AWS.DynamoDB.DocumentClient();

const createUser = async (data) => {
  const passwordHash = await bcrypt.hash(data.password, 8);
  data = omit(data, ['password']);

  const params = User.put({
    pkey: "User",
    skey: data.email,
    id: uuidv4(),
    passwordHash: passwordHash,
    createdAt: new Date().valueOf()
  });

  const response = await docClient.put(params).promise();

  return User.parse(response);
}

const getUserByEmail = async (email) => {
  const params = User.get({ pkey: "User", skey: email });
  const response = await docClient.get(params).promise();

  return User.parse(response);
}

module.exports = {
  createUser,
  getUserByEmail
};