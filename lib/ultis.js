const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getUserByEmail } = require("./db");

async function login(args) {
  try {
    const user = await getUserByEmail(args.email);

    const isValidPassword = await comparePassword(
      args.password,
      user.passwordHash
    );

    if (isValidPassword) {
      const token = await signToken(user);
      return Promise.resolve({ auth: true, token: token, status: "SUCCESS" });
    }
  } catch (err) {
    console.info("Error login", err);
    return Promise.reject(new Error(err));
  }
}

function comparePassword(eventPassword, userPassword) {
  return bcrypt.compare(eventPassword, userPassword);
}

async function signToken(user) {
  const secret = Buffer.from(process.env.JWT_SECRET, "base64");

  return jwt.sign({ email: user.skey, id: user.id, roles: ["USER"] }, secret, {
    expiresIn: 86400
  });
}

async function getUserFromToken(token) {
  const secret = Buffer.from(process.env.JWT_SECRET, "base64");

  const decoded = jwt.verify(token.replace("Bearer ", ""), secret);

  return decoded;
}

module.exports = {
  signToken,
  getUserFromToken,
  login
};