module.exports = function(req, res, next) {
  
  if (req.session.me.status == 1) {
    return next();
  }

  return res.redirect('/active/inactive');
};
