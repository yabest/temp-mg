import 'babel-polyfill'
import promise from 'es6-promise'
promise.polyfill()


import '../css/index.css'
import '../css/normalize.css'

import Vue from 'vue/dist/vue.esm.js'
import * as Global from '../js/global'
import * as TvFn from '../js/util'

import * as Api from '../axios/api'

import QRCode from "qrcodejs2"

import Vconsole from 'vconsole'
let vConsole = new Vconsole()
process.env.NODE_ENV != 'development' ? Vue.use(vConsole) : ''


window.vm = new Vue({
  el: '#wrap',
  components: { QRCode },
  data: {
    homeFocusBtn: null,
    statusCode: 0,
    noTv: false,
    userInfo: null,
    userData: {
      show: false,
      tel: '',
      bal: 0,
    },
    user_client: '',
    userInfoKey: '',
    homeFocusedBtn: '',
    activityCode: 'fishing', // 活动代码
    channel: Global.getURLQuery('channel') ? Global.getURLQuery('channel') : '',
    activityName: '',
    userInfo: {
      version: '',
      userId: ''
    },  // 用户信息     
    mode: 'dev', // online  dev
    postUrl: process.env.NODE_ENV == 'development' ? '/apis/gulu/mgtv/' : 'http://' + window.location.host + '/gulu/mgtv/', // 本地
    shadow_data: {
      show: false,
      type: 999, // 0 通用弹窗 1 次数用完 2 中奖 3 未中奖 4 我的奖品 5 规则
      prize: 999, // 9 没有奖品 1 code 2 实物 3 都有
      nomal: ''
    },
    pageInfo: {
      vipType: 1
    },
    prizeData: {
      "prizeName": "",
      "prizeImg": "",
      "prizeType": 0
    },
    winningList: [],
    winningSw: [],
    winningCode: [],
  },
  methods: {
    hasTvJsInterface() {
      // 判断客户端方法兼不兼容
      if (process.env.NODE_ENV != 'development' && typeof TvJsInterface == 'undefined') {
        this.noTv = true
        let html = '<h4></h4><p style="padding-left: 120px;padding-right: 120px;">邀请您参加本活动，赶快升级吧(升级方法：按“返回”按键后，在“我的”里面-选择“版本升级”就可以自动更新啦</p>'
        this.openShadow(0, html)
      }

    },
    async openShadow(type, html, prize) {
      this.$refs.shadow.style.display = 'block'
      this.shadow_data.type = type
      this.shadow_data.nomal = html
      this.shadow_data.show = true
      this.shadow_data.prize = prize || 999

      this.focus_shadow_or_home(1, type)

    },
    async focus_shadow_or_home(type, btnType) {
      if (type == 'home') {
        // 让弹窗按钮不可选
        await Array.prototype.slice.call(document.getElementsByTagName('button')).myForEach(item => {

          if (item.className.indexOf('btn') != -1) {
            item.setAttribute('tabindex', -1)
            item.setAttribute('disabled', true)
          } else {
            item.setAttribute('tabindex', 1)
            item.removeAttribute('disabled')

          }
        })

        if (this.homeFocusBtn) {
          this.homeFocusBtn.focus() 
        }

        this.getConfig()
      } else {
        // 让所有按钮不可选
        await Array.prototype.slice.call(document.getElementsByTagName('button')).myForEach(item => {
          item.setAttribute('tabindex', -1)
          item.setAttribute('disabled', true)
        })

        // 给按钮添加focus状态
        await Array.prototype.slice.call(this.$refs.shadow.getElementsByTagName('button')).myForEach(item => {
          if (item.dataset.type == btnType) {
            item.setAttribute('tabindex', 1)
            item.removeAttribute('disabled')
            item.focus()
          } else {
            item.setAttribute('tabindex', -1)
            item.setAttribute('disabled', true)
          }
        })
      }
    },
    closeShadow: Global.Throttle(async function () {
      this.shadow_data = {
        show: false,
        type: 999,
        prize: 999,
        nomal: ''
      }

      this.focus_shadow_or_home('home')
    }, 800),
    async getConfig() {
      Api.getConfig({
        'activityCode': this.activityCode,
        'userInfo': this.userInfoKey
      }).then(data => {

        let gameError = [1201, 1202, 1204, 1205].mfilter(item => {
          return item == data.code
        })
        if (gameError.length) {
          this.gameStatusError(gameError[0])
          return
        }

        if (!Global.isEmpty(data.data)) {

          this.statusCode = data.code
          this.pageInfo = data.data
          console.log('this.pageInfo', this.pageInfo)
          TvFn.addSystemLog.call(this, 1, '进入页面')
          TvFn.setActivityName.call(this, data.data.activityName)
          


          // 设置用户信息           
          if (this.userInfo.userId) {
            this.userData.tel = Global.formatUserId(this.userInfo.userId)
            this.userData.bal = data.data.balance
            this.userData.show = true
          }

          // 奖品列表
          this.winningList = data.data.winningList
        }
      })

    },
    isLogin() {
      if (!this.userInfo.userId) {
        setTimeout(() => {
          TvFn.addSystemLog.call(this, '5', '去登录')
          TvJsInterface.requestLogin()  // 请求客户端登录
        }, 300)
        return false
      } else return true
    },
    gameStatusError: Global.Throttle(function (code) {
      let errorStatusArr = [
        {
          code: 1201,
          html: '<h4></h4><p style="padding-left: 120px;padding-right: 120px;">活动不存在</p>'
        },
        {
          code: 1202,
          html: '<h4></h4><p style="padding-left: 120px;padding-right: 120px;">活动未开始</p>'
        }
        ,
        {
          code: 1204,
          html: '<h4></h4><p style="padding-left: 120px;padding-right: 120px;">活动已经结束</p>'
        }
        ,
        {
          code: 1205,
          html: '<h4></h4><p style="padding-left: 120px;padding-right: 120px;">活动已关闭</p>'
        }
      ]

      let flagitem = errorStatusArr.mfilter(item => {
        return item.code == code
      })
      this.openShadow(0, flagitem[0].html)



    }, 500),
    // 垂钓
    lotterHand: Global.Throttle(
      function (event) {
        this.homeFocusBtn = event.target
        if (!this.isLogin()) return
        console.log(555)
        Api.lottery({
          'activityCode': this.activityCode,
          'userInfo': this.userInfoKey,
          'level': 1
        }).then(data => {
          if (data.code == '0000') {
            if (data.data && data.data.length) {

              this.prizeData = data.data[0]
              this.openShadow(2)
            } else {
              this.openShadow(3)

            }

          } else {
            this.openShadow(1)
          }
        })
      }, 800),

    // 拉起收银
    byVip: Global.Throttle(function () {
      TvFn.vipJsonEncrypt.call(this, 1)
    }, 800),
    // 我的奖品
    myPrize: Global.Throttle(function (event) {
      this.homeFocusBtn = event.target
      if (!this.isLogin()) return
      if (!this.winningList.length) return this.openShadow(4, null, 9)


      this.winningCode = this.winningList.mfilter(item => {
        return item.prizeType == 6
      })
      this.winningSw = this.winningList.mfilter(item => {
        return item.prizeType == 2
      })



      // 既有实物又有兑换码
      if (this.winningSw.length && this.winningCode.length) {
        this.openShadow(4, null, 3)

        this.$nextTick(() => {
          document.getElementById('all_leftcode').innerHTML = ''
          document.getElementById('all_rightcode').innerHTML = ''

          new QRCode('all_leftcode', {
            width: 280,
            height: 280,        // 高度
            text: this.winningSw[0].url,   // 二维码内容
            // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
            background: '#f0f',   // 背景色
            foreground: '#ff0'    // 前景色
          })
          new QRCode('all_rightcode', {
            width: 280,
            height: 280,        // 高度
            text: this.winningCode[0].url,   // 二维码内容
            // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
            background: '#f0f',   // 背景色
            foreground: '#ff0'    // 前景色
          })

        })
      } else if (this.winningSw.length) {
        this.openShadow(4, null, 2)

        this.$nextTick(() => {
          document.getElementById('sw_leftcode').innerHTML = ''
          new QRCode('sw_leftcode', {
            width: 280,
            height: 280,        // 高度
            text: this.winningSw[0].url,   // 二维码内容
            // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
            background: '#f0f',   // 背景色
            foreground: '#ff0'    // 前景色
          })

        })
      } else {
        this.openShadow(4, null, 1)

        this.$nextTick(() => {
          document.getElementById('code_rightcode').innerHTML = ''

          new QRCode('code_rightcode', {
            width: 280,
            height: 280,        // 高度
            text: this.winningCode[0].url,   // 二维码内容
            // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
            background: '#f0f',   // 背景色
            foreground: '#ff0'    // 前景色
          })

        })

      }
    }, 600),
    // 活动规则
    rule: Global.Throttle(function (event) {
      this.homeFocusBtn = event.target
      let html = this.pageInfo.activityRule
      this.openShadow(5, html)

    }, 600),
    closePage: Global.Throttle(function () {
      TvJsInterface.closePage()
    }),
    init() {
      TvFn.init.call(this)
    },
    addSysLog(type, text) {
      TvFn.addSystemLog.call(this, type, text)
    }
  },
  created() {

  },
  mounted() {
    Global.zoomHtml();
    window.onresize = () => {
      Global.zoomHtml();
    }

    this.hasTvJsInterface()

    if (!this.noTv) {
      this.homeFocusBtn = document.getElementById('cd')
          this.homeFocusBtn.focus()
      this.init()
    }


  },
  watch: {
    shadow_data: {
      deep: true,
      immediate: true,
      handler(n, o) {
        console.log(n)
        if (n.show) {
          this.focus_shadow_or_home(1, n.type)

        } else {
          console.log(11)
          this.focus_shadow_or_home('home')

        }
      }
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  }
})
 



