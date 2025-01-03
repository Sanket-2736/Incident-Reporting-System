const responderMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'responder') {
      return res.status(403).json({ success:false, message: 'Access denied' });
    }
    next();
  };
  
module.exports = responderMiddleware;  