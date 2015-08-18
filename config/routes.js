/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  //'/': {view: 'homepage', locals:{title: '首頁'}},
  
  '/': '/voc',
  
  
  'get  /login':   'UserController.login',
  'post /login':   'UserController.checkLogin',
  '/logout':       'UserController.logout',
  
  'get  /signup':  'UserController.signup',
  'post /signup':  'UserController.create',
  
  'get  /profile': 'UserController.profile',
  'post /profile': 'UserController.saveProfile',
  'post /profile/avatar': 'UserController.saveAvatar',
  
  '/active':          {view: 'user/active',         locals:{title: '請認證您的帳號'}},
  '/active/success':  {view: 'user/activesuccess',  locals:{title: '您的帳號已認證'}},
  '/active/inactive': {view: 'user/inactive',       locals:{title: '帳號尚未認證'}},
  '/active/error':    {view: 'user/activeerror',    locals:{title: '帳號認證錯誤'}},
  'get /active/:code':       'UserController.active',
  'post /resendActiveEmail': 'UserController.resendActiveEmail',
  
  'get  /forget_password': {view: 'user/forget',         locals:{title: '忘記密碼'}},
  'post /forget_password': 'UserController.forget',
  '/forget/success':       {view: 'user/forgetsuccess',  locals:{title: '已將重設密碼信寄到您的信箱'}},
  '/forget/error':         {view: 'user/forgeterror',    locals:{title: '該帳號並不是會員'}},
  
  
  'get  /reset_password/:code': {view: 'user/reset',         locals:{title: '重設密碼'}},
  'post /reset_password/:code': 'UserController.reset',
  '/reset/success':             {view: 'user/resetsuccess',  locals:{title: '重設密碼成功'}},
  '/reset/error':               {view: 'user/reseterror',    locals:{title: '重設密碼失敗'}},
  
  
  '/user/all': 'UserController.all',
  '/user/:id': 'UserController.showUser',
  
  
  '/voc':             'VocController.all',
  'get /voc/search/': 'VocController.search',
  '/voc/me':          'VocController.me',
  'get  /voc/new':    'VocController.new',
  'post /voc/new':    'VocController.create',
  '/voc/:word':       'VocController.show'
  
  
  
  
};
