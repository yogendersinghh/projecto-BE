const jwt = require("jsonwebtoken");

const { unless } = require("express-unless");

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      errors: [
        {
          msg: "Token is required",
        },
      ],
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).send({
      errors: [
        {
          msg: "Invalid token",
        },
      ],
    });
  }
};

authenticate.unless = unless;

module.exports = authenticate;
