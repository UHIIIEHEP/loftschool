const jwt = require('jsonwebtoken');

const Guard = (req, res, next) => {
  let decode = false;
  try {
    decode = jwt.verify(req.headers['authorization'], process.env.ACCESS_SIGNATURE);
  } catch (err) {
    throw new Error ('forbiden111');
  }
  
  const timeNow = new Date().getTime()
  
  if(decode) {
    req.body['user_id'] = decode['user_id'];
    console.log('OK')
    next();
  } else {
    res.status(403);
    res.send('unauthorized');
    throw new Error('unauthorized');
  }  
};

export default Guard;