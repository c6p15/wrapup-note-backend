require("dotenv").config();
const jwt = require("jsonwebtoken");


const auth = (req, res, next) => {
  const token = req.cookies.token

  if (!token) return res.sendStatus(401)

  try {
    const user = jwt.verify(token, process.env.SECRET);
    req.user = user;
    
    next();

  } catch (error) {
    return res.sendStatus(403);
  }
};

module.exports = auth
