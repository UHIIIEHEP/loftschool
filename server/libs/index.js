const jwt = require('jsonwebtoken');
const sha256 = require('crypto-js/sha256');
const Base64 = require('crypto-js/enc-base64');
const hmacSHA512 = require('crypto-js/hmac-sha512');

require('dotenv').config();

module.exports = {
  generateToken(payload) {
    const {
      role,
    } = payload;

    const token = jwt.sign({ role}, process.env.JWT_SIGNATURE);
    return token;
  },

  generateHach(str) {
    const hashDigest = sha256(str+ process.env.SALT);
    return Base64.stringify(hmacSHA512(hashDigest, process.env.PRIVATE_KEY));
  }
};
