module.exports = {
  
  // 寄認證信
  url: function(user) {
    if (user && user.avatar) {
      return user.avatar.replace('.jpeg', '-thumb.jpeg');
    }
    
    return '/public/default.jpg';
  }
}