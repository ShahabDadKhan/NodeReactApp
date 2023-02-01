import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    // Taking Authorization from frontend header
    let token = req.header("Authorization");

    // If token doesn't exist
    if (!token) return res.send(403).send("Access Denied");

    // If token exist and starts with Bearer
    if (token.startsWith("Bearer")) {
      token = token.slice(7, token.lenght).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT__SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.send(500).json({ error: err.message });
  }
};
