const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {

    return res.json({
      message: "Token Missing"
    });

  }

  try {

    const verified = jwt.verify(

      token,

      "secretkey"

    );

    req.user = verified;

    next();

  }

  catch {

    res.json({
      message: "Invalid Token"
    });

  }

};

module.exports = authMiddleware;