module.exports = {
  show: function(flash, attr){
    
    var errString = '';
    
    if (flash && flash.err && flash.err.invalidAttributes && flash.err.invalidAttributes[attr]) {
      var index = 0;
      flash.err.invalidAttributes[attr].forEach(function(err) {
        errString += (index != 0 ? '<br>' : '') + err['message'];
        index ++;
      })
    }
    
    return errString;
  }
}