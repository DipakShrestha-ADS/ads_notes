export function requireStoreKey(req, res, next) {
  const providedKey = req.get('x-store-key');
  const expectedKey = process.env.STORE_KEY || 'campus-secret';

  if (providedKey !== expectedKey) {
    return res.status(401).json({ message: 'A valid store key is required' });
  }

  next();
}
