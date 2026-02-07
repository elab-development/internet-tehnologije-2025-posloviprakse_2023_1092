import jwt from 'jsonwebtoken';

export const generateToken = (id, email, role) => {
  const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_fallback';
  const jwtExpire = process.env.JWT_EXPIRE || '7d';
  
  console.log('🎫 Generating JWT with expiresIn:', jwtExpire);
  
  return jwt.sign(
    { id, email, role },
    jwtSecret,
    { expiresIn: jwtExpire }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
