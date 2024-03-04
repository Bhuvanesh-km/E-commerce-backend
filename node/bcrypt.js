const bcrypt = require("bcrypt");

const password = "Bhuvi@123";

async function hashPassword(password) {
  console.time("hashing time");
  const salt = await bcrypt.genSalt(12);
  console.log("salt", salt);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("hashed password", hashedPassword);
  console.timeEnd("hashing time");
  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log("isMatch", isMatch);
  return hashedPassword;
}

hashPassword(password);
