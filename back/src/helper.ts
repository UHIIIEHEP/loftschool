import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import hmacSHA512 from 'crypto-js/hmac-sha512';
const jwt = require('jsonwebtoken');
import { IPayloadToken } from './controllers/interface/user.interface';

const generateHach = (str:string): string => {
  const hashDigest = sha256(str + process.env.USER_SALT);
  return Base64.stringify(hmacSHA512(hashDigest, process.env.PRIVATE_KEY));
}

const generateToken = (payload: any, type: string) => {
  let signature, dateDead;
  switch(type) {
    case 'access':
      signature = process.env.ACCESS_SIGNATURE;
      dateDead = generateDate(Number(process.env.ACCESS_TIME), process.env.ACCESS_UNION);
      break;
    case 'refresh':
      signature = process.env.REFRESH_SIGNATURE;
      dateDead = generateDate(Number(process.env.REFRESH_TIME), process.env.REFRESH_UNION);
      break;
  };

  const token = jwt.sign(
    payload,
    signature,
    {
      expiresIn: dateDead
    }
  );

  return {
    token,
    dateDead,
  };
}

const vertifyToken = (token: string, signature: string) => {
  const decoded = jwt.verify(token, signature);
  return decoded;
}

const generateDate = (interval: number, union: string) => {
  let koef = 1;

  switch (union) {
    case 'day': koef = koef * 24;
    case 'hour': koef = koef * 60;
    case 'min': koef = koef * 60;
    case 'sec': koef = koef * 1000;
    case 'msec': koef = koef;
  };

  return Date.now() + interval * koef;
}

export {
  generateHach,
  generateToken,
  vertifyToken,
  generateDate,
}
