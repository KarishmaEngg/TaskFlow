const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // 1. Header se token nikalna
  const authHeader = req.header("Authorization");
  
  // Check agar header hi nahi hai
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Token format: "Bearer <token>" hota hai, isliye split karke second part lenge
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing, access denied" });
  }

  try {
    // 2. Token verify karna
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. User data ko request object mein attach karna
    // decoded mein { id: ... } hoga jo humne login/register ke waqt set kiya tha
    req.user = decoded;

    // 4. Agle function (Controller) par bhej dena
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;