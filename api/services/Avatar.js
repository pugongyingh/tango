module.exports = {
  
  // 寄認證信
  url: function(user) {
    if (user && user.avatar) {
      return user.avatar;
    }
    
    return '/public/default.jpg';
  }
}