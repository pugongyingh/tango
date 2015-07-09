module.exports = {
  
  // 寄認證信
  url: function(user) {
    if (user && user.avatar) {
      return '/public/' + session.me.avatar + '.jpg';
    }
    
    return '/public/default.jpg';
  }
}