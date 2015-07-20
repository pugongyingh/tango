module.exports = {
  show: function(flash, attr){
    return (flash && flash.params && flash.params[attr])? flash.params[attr] : '';
  }
}