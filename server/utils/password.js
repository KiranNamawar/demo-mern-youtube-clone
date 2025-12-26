import bcrypt from "bcrypt";

const saltRounds = 12;

export function hashPassword(password) {
  return bcrypt.hash(password, saltRounds);
}

export function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
