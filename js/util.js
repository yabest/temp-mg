import * as Api from '../axios/api'
import * as Global from '../js/global'

 
// 设置用户信息
export function setUserInfo(userId, vipType) {
  // 显示手机号
  if (userId) {
    $('.progress-bar ').show()
    $('.user-info').show()
    $('#tel').html(formatUserId(userId))
    $('.user-info').css('visibility', 'visible')
  } else {
    $('.user-info').hide()
    $('.progress-bar ').hide()
  }
  // 如果是会员
  if (vipType) {
    $('.user-info .icon-head').addClass('vip' + vipType)
  }
}

// 记录系统日志接口
export function addSystemLog(logType, logAction, eleName) {
  Api.addSystemLog({
    'currentPage': window.location.href,
    'channel': this.channel,
    'activityId': this.activityCode,
    'logType': logType,  // logType 日志类型：1登录页面 2点击 3提交 4接口 5其它
    'logAction': logAction,
    'pageName': this.activityName,
    'userIdentity': 'isVip' in this.userInfo ? this.userInfo.isVip : '',
    'phone':
      this.userInfo.userId ? this.userInfo.userId : '',
    'mac':
      this.userInfo.mac ? this.userInfo.mac : '',
    'extendinfo':
      this.userInfo.channelCode ? this.userInfo.channelCode : '',
    'campanyId':
      this.userInfo.deviceId ? this.userInfo.deviceId : '',
    'osType':
      this.userInfo.version ? this.userInfo.version : '',
    'request': eleName
  }).then(data => {
    console.log('埋点 --', logAction)
  })
  return
  var param = {
    url: this.postUrl + 'addSystemLog',
    data: {
      'currentPage': window.location.href,
      'channel': this.channel,
      'activityId': this.activityCode,
      'logType': logType,  // logType 日志类型：1登录页面 2点击 3提交 4接口 5其它
      'logAction': logAction,
      'pageName': this.activityName,
      'userIdentity': this.userInfo.isVip,
      'phone': this.userInfo.userId,
      'mac': this.userInfo.mac,
      'extendinfo': this.userInfo.channelCode,
      'campanyId': this.userInfo.deviceId,
      'osType': this.userInfo.version,
      'request': eleName
    }
  }
  $.ajax({
    type: 'post',
    url: param.url,
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(param.data),
    success: function (data) {
      console.log('ajax addSystemLog success', data)
    },
    error: function (err) {
      console.log('ajax addSystemLog error', err)
    }
  });
}

// 解密用户信息的接口
export function userInfoDecrypt(info) {
  if (process.env.NODE_ENV == 'development') {
    this.userInfo = info
    this.getConfig()
  } else {
    Api.userInfoDecrypt({
      'userInfo': info,
      'activityCode': this.activityCode
    }).then(data => {
      if (data.code == '1') {
        this.userInfo = data.userDecrypt
        console.log('userInfo', JSON.stringify(this.userInfo))
        this.getConfig()
        // 判断客户端版本兼不兼容
        if (Global.isEmpty(this.userInfo.version) || this.userInfo.version < 6460) { // 无需升级测试, 版本低

          this.noTv = true
          let html = '<h4></h4><p style="padding-left: 120px;padding-right: 120px;">邀请您参加本活动，赶快升级吧(升级方法：按“返回”按键后，在“我的”里面-选择“版本升级”就可以自动更新啦</p>'
          this.openShadow(0, html)

        }
      }
    })
    return

    var param = {
      url: postUrl + 'userInfoDecrypt',
      data: {
        'userInfo': info,
        'activityCode': this.activityCode
      }
    }
    $.ajax({
      type: 'post',
      url: param.url,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(param.data),
      success: function (data) {
        console.log('ajax userInfoDecrypt success', data)
        if (data.code == 1) {
          this.userInfo = data.userDecrypt
          console.log('userInfo', JSON.stringify(userInfo))
          // setUserInfo(userInfo.userId)
          // 获取页面信息
          this.getConfig()

          // 判断客户端版本兼不兼容
          if (isEmpty(userInfo.version) || userInfo.version < 6460) { // 无需升级测试, 版本低
            setTimeout(function () {
              openShadow('#box-normal', '邀请您参加本活动，赶快升级吧(升级方法：在“我的”里面-选择“版本升级”就可以自动更新啦)', 'closePage');
            }, 300)
            return
          }
        }
      },
      error: function (err) {
        console.log('ajax userInfoDecrypt error', err)
        openShadow('#box-normal', '网络出错啦，请稍后重试~', 'closePage')
      }
    });
  }



}

// 收银台信息加密
export function vipJsonEncrypt(type) {
  Api.vipJsonEncrypt({
    'userPhone': this.userInfo.userId,
    'activityCode': this.activityCode
  }).then(data => {
    if (this.userInfo.version >= 6460 && this.userInfo.version < 6520) {
      console.log('老版本需要传参')
      // 老版本需要传参
      TvJsInterface.goOrderPage(data.vipJsonEncrypt);
    } else if (this.userInfo.version >= 6520 && this.userInfo.version < 6540) {
      // 新版本不需要传参
      console.log('新版本不需要传参')
      TvJsInterface.goOrderPage();
    } else if (this.userInfo.version >= 6540) {
      // 6540及以上的版本需要传参
      console.log('6540及以上的版本需要传参')
      TvJsInterface.goOrderPageWithPayType(type)
    }
  })

  return
  var param = {
    url: postUrl + 'vipJsonEncrypt',
    data: {
      'userPhone': userInfo.userId,
      'activityCode': activityCode
    }
  }
  $.ajax({
    type: 'post',
    url: param.url,
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(param.data),
    success: function (data) {
      console.log('ajax vipJsonEncrypt success', data)
      if (userInfo.version >= 6460 && userInfo.version < 6520) {
        console.log('老版本需要传参')
        // 老版本需要传参
        TvJsInterface.goOrderPage(data.vipJsonEncrypt);
      } else if (userInfo.version >= 6520 && userInfo.version < 6540) {
        // 新版本不需要传参
        console.log('新版本不需要传参')
        TvJsInterface.goOrderPage();
      } else if (userInfo.version >= 6540) {
        // 6540及以上的版本需要传参
        console.log('6540及以上的版本需要传参')
        TvJsInterface.goOrderPageWithPayType(type)
      }
    },
    error: function (err) {
      console.log('ajax vipJsonEncrypt error', err)
    }
  });
}
// 给客户端传活动名称
export function setActivityName(name) {
  console.log('activityName', name)
  console.log('userInfo', this.userInfo)
  if (process.env.NODE_ENV != 'development' && this.userInfo.version >= 6520) TvJsInterface.setActivityName(name)
}
// 初始化
export function init(openbox) {
  // 通过客户端方法 获取用户信息(加密)
  var user_client = ''
  if (process.env.NODE_ENV == 'development') {
    this.user_client = { 'channelCode': '10004029027', 'deviceId': '614f7f5d4092babc', 'userId': '13913396121', 'isVip': false, 'version': '6650' };  // 已登录
    this.userInfoKey = 'ZUy8U9eIxDMXnoXDlAso8MW+yUb7qodHZBy6JvMXaF89PyDlhUxNvM359KJylRjDnq1IkyUontFMu7Qu6rX31Kot4dnh2BlFbBcuekDMFgp9HTjiW6nOZbHaDNxiutpNGzcp7YfvknC1yCUdYB5FUUVBbp7COJH4xpifXDsxxzX1iJeDnwFF7Tf+x7EbFTVH0YWDdnAKS+IZTKJNa5ZMwyhiEguiFuJvyo6HahhNwZDstlEN8B3K1ufvkeY90F6QRwA7B6umDG2IK5PHlMmR1MBhaFAzR3uzsLlk3VLu8ZM='
  } else {
    this.user_client = TvJsInterface.getUserInfo()
    this.userInfoKey = this.user_client
  }


  // 将加密的用户信息解密
  userInfoDecrypt.call(this, this.user_client, openbox)



}






