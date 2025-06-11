module.exports = function (req, res, next) {
  console.log(req.user);
  
  if (req.user && req.user.role === 'admin') {
    console.log(
      'access granted to admin user',
    );
    next()
  } else {
    console.log('access denied to non-admin user');
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};
