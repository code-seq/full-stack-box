/**
 * @desc    API请求接口类封装
 * @author  vic.l.zhang
 * @date    2018年12月20日13:48:37
 */

export class HTTP {
  /**
   * POST请求API
   * @param  {String}   url         接口地址
   * @param  {String}   token       请求接口时的Token
   * @param  {Object}   params      请求的参数
   * @param  {Function} successFun  接口调用成功返回的回调函数
   * @param  {Function} failFun     接口调用失败的回调函数
   * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
   */
  requestPostApi(url, token, params, successFun, failFun, completeFun) {
    this._requestApi(url, token, params, 'POST', successFun, failFun, completeFun)
  }

  /**
   * GET请求API
   * @param  {String}   url         接口地址
   * @param  {String}   token       请求接口时的Token
   * @param  {Object}   params      请求的参数
   * @param  {Function} successFun  接口调用成功返回的回调函数
   * @param  {Function} failFun     接口调用失败的回调函数
   * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
   */
  requestGetApi(url, token, params, successFun, failFun, completeFun) {
    this._requestApi(url, token, params, 'GET', successFun, failFun, completeFun)
  }

  /**
   * 请求API
   * @param  {String}   url         接口地址
   * @param  {Object}   params      请求的参数
   * @param  {String}   method      请求类型
   * @param  {Function} successFun  接口调用成功返回的回调函数
   * @param  {Function} failFun     接口调用失败的回调函数
   * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
   */
  _requestApi(url, token, params, method, successFun, failFun, completeFun) {
    if (method == 'POST') {
      var contentType = 'application/x-www-form-urlencoded'
    } else {
      var contentType = 'application/json'
    }
    wx.request({
      url: url,
      method: method,
      data: params,
      header: {
        'Content-Type': contentType,
        'token': token
      },
      success: function(res) {
        typeof successFun == 'function' && successFun(res.data);
      },
      fail: function(res) {
        typeof failFun == 'function' && failFun(res.data)
      },
      complete: function(res) {
        typeof completeFun == 'function' && completeFun(res.data)
      }
    })
  }
}