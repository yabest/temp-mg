console.log(process.env.NODE_ENV)
// 定义全局变量
export let config = {
  homeFocusedBtn: '',
  activityCode: window.location.href.substring(window.location.href.lastIndexOf('\/') + 1, window.location.href.indexOf('.html')), // 活动代码
  channel: getURLQuery('channel') ? getURLQuery('channel') : '',
  activityName: '',
  userInfo: {},  // 用户信息
  vipType: '',
  userInfoKey: '',
  mode: 'dev', // online  dev
  postUrl: process.env.NODE_ENV == 'development' ? '/apis/gulu/mgtv/' : 'http://' + window.location.host + '/gulu/mgtv/' // 本地
}
// 获取地址栏的字段值
export function getURLQuery(key) {
  var hrefStr = window.location.href
  var url = decodeURI(hrefStr.substring(hrefStr.indexOf('?'), hrefStr.length))
  var theRequest = new Object()
  if (url.indexOf('?') !== -1) {
    var str = url.substr(1)
    var strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
  }
  return theRequest[key]
}
// 关闭弹窗恢复焦点
export function reservefocus() {
  $('.shadow').hide()

  $('.shadow div').each(function (i, v) {
    if ($(v).attr('id')) {
      $(v).hide()
    }
  })
  $('#wrap button').each(function (i, v) {
    $(v).attr('tabindex', '1')
    $(v).attr('disabled', false)

  })
  $('.progress-bar').attr('tabindex', 1)

  homeFocusedBtn.focus()
  $('.progress-bar').show()

}
// 弹窗
export function openShadow(dom, html, btnClickType, isFocus, parentShow) {
  console.log(dom, html, btnClickType, isFocus, parentShow)

  $('.shadow').show()
  parentShow ? $('.shadow ' + dom + '').parent().show() : ''

  html ? $('.shadow ' + dom + ' .content').html(html) : ''
  $('.shadow ' + dom + '').show()

  $('.shadow ' + dom + ' button').attr('data-type', btnClickType)

  $('#wrap button').each(function (i, v) {
    $(v).attr('tabindex', '-1')
    $(v).attr('disabled', true)
  })
  $('.shadow ' + dom + ' button').attr('tabindex', '1')
  $('.shadow ' + dom + ' button').attr('disabled', false)
  $('.shadow ' + dom + ' button').focus()
  isFocus ? homeFocusedBtn = $('.shadow ' + dom + '') : ''
  shadowBtnFocus()
  $('.progress-bar').hide()
}
// 弹窗内按钮聚焦
export function shadowBtnFocus() {
  $('#wrap button').each(function (i, v) {
    if ($(v).attr('tabindex') == 1) {
      $(v).attr('disabled', false)
      $(v).focus()
    } else {
      $(v).attr('disabled', true)

    }
  })
  $('.progress-bar').attr('tabindex', -1)
}
// 过滤请求状态
export function shadowByAjaxStatus(data) {
  if (data.code == '1202') {
    openShadow('#box-normal', '活动未开始', 'closePage')
  } else if (data.code == '1204') {

    openShadow('#box-normal', '活动已结束', 'closePage')
  } else if (data.code == '1201') {

    openShadow('#box-normal', '活动不存在', 'closePage')
  } else if (data.code == '1205') {
    openShadow('#box-normal', '活动已关闭', 'closePage')

  } else if (data.code == '1904') {

    openShadow('#box-normal', '请先登录', 'login')
  } else if (data.code == '1901') {
    openShadow('#box-normal', '今日已参加过活动', 'closePage')

  } else {
    openShadow('#box-normal', data.message, 'closePage')
  }
}
// 节流函数
export function throttle(fn, delay) {
  console.log(33)
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};

export const Throttle = (fn, delay) => {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}
// 页面初始化缩放
export function zoomHtml() {
  var width = document.documentElement.clientWidth;
  var zoomNum = width / 1920;
  var zoom = zoomNum.toFixed(2);
  document.getElementsByTagName('html')[0].style.zoom = zoom

}

//判断字符是否为空的方法
export function isEmpty(obj) {
  if (typeof obj == 'undefined' || obj == null || obj == '') {
    return true;
  } else {
    return false;
  }
}
// 产生随机数
export function getRandom(m, n) {
  return Math.floor(Math.random() * (m - n) + n);
}

// 格式化手机号-将中几位数字加星号
export function formatTel(tel) {
  var reg = /^(\d{3})\d*(\d{4})$/;
  return tel.replace(reg, '$1****$2')
}

// 格式化账号 3-4-4
export function formatUserId(id) {
  if (id && id.length >= 7) {
    var one = id.substr(0, 3)
    var two = id.substr(id.length - 4, 4)
    return one + '****' + two
  } else {
    return id
  }
}

// 获取当前日期
export function getNowFormatDate(flag) {
  if (flag) {
    return new Date(new Date().getTime() + 24 * 60 * 60 * 1000).format("yyyy-MM-dd");
  } else {
    return new Date(new Date().getTime()).format("yyyy-MM-dd");
  }
}


export function addClass(obj, className) {
  if (obj.className == " ") {
    obj.className = className;
  } else {
    var _index = arrIndex(obj.className.split(" "), className)
    if (_index == -1) {
      obj.className += " " + className;
    }
  }
}
Array.prototype.mfilter = function (filterFn, thisArg) {
  var newArr = [];
  var _this = this.slice(0)
  for (var i = 0; i < _this.length; i++) {
    var _this = this.slice(0);//注意，务必要先复制一份
    filterFn.call(thisArg, _this[i], i, this) && newArr.push(_this[i]);
  }
  return newArr;
}
Array.prototype.myForEach = function myForEach(callBack, context) {
  typeof context === "undefined" ? context = window : null;

  if ("forEach" in Array.prototype) {
    this.forEach(callBack, context);
    return;
  }

  //->不兼容处理
  for (var i = 0; i < this.length; i++) {
    typeof callBack === "function" ? callBack.call(context, this[i], i, this) : null;
  }
};
Array.prototype.myEvery = function (callback) {
  for (var i = 0; i < this.length; i++) {
    var item = this[i];
    if (!callback(item, i, this)) {
      return false;
    }
  }
  return true;
}
Array.prototype.mySome = function (callback) {
  for (var i = 0; i < this.length; i++) {
    var item = this[i];
    if (callback(item, i, this)) {
      return true;
    }

  }
  return false;
}