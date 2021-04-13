import Vue from 'vue'
import App from './App'
import store from './store'
import api from './api'
Vue.config.productionTip = false

const tui = {
	toast: function(text, duration, success) {
		uni.showToast({
			title: text,
			icon: success ? 'success' : 'none',
			duration: duration || 2000
		})
	},
	setSessionToken: function(token) {
		uni.setStorageSync("newSessionToken", token)
	},
	getSessionToken() {
		return uni.getStorageSync("newSessionToken")
	},
	isLogin: function() {
		return uni.getStorageSync("newSessionToken") ? true : false
	},
	isSubscribe: function(){
		return uni.getStorageSync("subscribe") ? true : false
	},
	setSubscribe: function(){
		uni.setStorageSync("subscribe", true)
	},
	login() {
		// uni.setStorageSync('newSessionToken', 'PmdaGX2i245s5n5K2xf6')
		// return
		if(tui.isLogin()){
			return
		}
		let _this = this;
		uni.showLoading({
			title: '登录中...'
		});
	   // 1.wx获取登录用户code
		uni.login({
			provider: 'weixin',
			success: function(loginRes) {
				let code = loginRes.code;
				console.log(code)
				//2.将用户登录code传递到后台置换用户SessionKey、OpenId等信息
				api.wxAuth(code).then(function(data){
					tui.setSessionToken(data.authentication_token)
					uni.setStorageSync('share_token', data.share_token);
					uni.hideLoading();
					if (!_this.isCanUse) {
						//非第一次授权获取用户信息
						_this.wxGetUserInfo()
					}
				}).catch(function(e){
		
				})
			},
		});
	},
	cache:function(key, value, seconds) {
		var timestamp = Date.parse(new Date()) / 1000
		 console.log(timestamp+"==="+key)
		if (key && value === null) {
			//删除缓存
			//获取缓存
			var val = uni.getStorageSync(key);
			var tmp = val.split("|")
			if (!tmp[1] || timestamp >= tmp[1]) {
				console.log("key已失效")
				uni.removeStorageSync(key)
				return ""
			} else {
				console.log("key未失效")
				return tmp[0]
			}
		} else if (key && value) {
			//设置缓存
			if (!seconds) {
				var expire = timestamp + (3600 * 24 * 28)
			}else{
				var expire = timestamp + seconds
			}
			value = value + "|" + expire
			uni.setStorageSync(key, value);
		} else {
			console.log("key不能空")
		}
	},
	showSubscribe: function(){
		console.log(111)
		if(!tui.isSubscribe()){
			console.log(222)
			uni.requestSubscribeMessage({
				tmplIds: ['h5CtjMGbiLCl7aICaxndzkAa5ExNx7_qVCYN4oiIJSM', 'YEWcpJmcPiVeAg6igaGkcW1cSFGKn8ZaZOM5RZIpBZg', 'A0-kDcODKZr7h-Zc-EEKQFzhaKABp6Ug0m5LfKcdesk'],
				success: function(){
					tui.setSubscribe()
				},
				fail: function(e){
					console.log(e)
				},
				complete: function(){
					console.log('sub complete')
				}
			})
		}
	}
}

Vue.mixin({
	data() {
		return {
			isCanUse: false,
		}
	},
	onLoad: function (options) {
		if(!uni.getStorageSync('newSessionToken')){
			if(this.$mp.page.route !== 'pages/index/index'){
				uni.reLaunch({
					url: '../index/index'
				})
			}
		}
		if(options.scene){
			var scene = decodeURIComponent(options.scene);
			if(scene){
				tui.cache("from_token", options.share_token, 3600*24)
			}
		}
		
		if(options.share_token){
			console.log("share_token:" + options.share_token)
			tui.cache("from_token", options.share_token, 3600*24)
		}
		let _this = this
		tui.login();
		// 判断是否已经授权
		// uni.setStorageSync('alreadyLogin', true) 
		let alreadyLogin = uni.getStorageSync('alreadyLogin') 
		tui.showSubscribe()
		if(!alreadyLogin){
			this.isCanUse = true;
		}
	},
	onShareAppMessage: function(res){
		return {
		  title: '佳匠服务',
		  path: '/pages/index/index?share_token=' + uni.getStorageSync("share_token"),
		  imageUrl: Vue.prototype.imageUrl + "fenxiang.jpg",
		  success: (res) => {
			console.log("转发成功", res);
		  },
		  fail: (res) => {
			console.log("转发失败", res);
		  }
		}
	},
	methods: {
		wxGetUserInfo() {
			let _this = this;
			wx.getUserProfile({
				lang: 'zh_CN',
				desc: '用于完善个人资料',
				success: function(infoRes){
					console.log(infoRes)
					try {
						uni.setStorageSync('alreadyLogin', true) // 表示已经授权
						_this.isCanUse = false
						api.userInfo(infoRes.userInfo);
						} catch (e) {}
				},
				fail: function(e){
					console.log(e)
					uni.getUserInfo({
						provider: 'weixin',
						success: function(infoRes) {
							try {
								uni.setStorageSync('alreadyLogin', true) // 表示已经授权
								_this.isCanUse = false
								api.userInfo(infoRes.userInfo);
							} catch (e) {}
						},
						fail(res) {}
					});
				},
				complete: function(e){
					
				}
			})
			// uni.getUserInfo({
			// 	provider: 'weixin',
			// 	success: function(infoRes) {
			// 		try {
			// 			uni.setStorageSync('alreadyLogin', true) // 表示已经授权
			// 			_this.isCanUse = false
			// 			api.userInfo(infoRes.userInfo);
			// 		} catch (e) {}
			// 	},
			// 	fail(res) {}
			// });
		}
	}
})

Vue.prototype.tui = tui
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
Vue.prototype.$store = store
Vue.prototype.apiUrl = 'http://qiaojiang.mynatapp.cc/api'
// Vue.prototype.apiUrl = 'https://www.jxjiajiang.com/api'
Vue.prototype.imageUrl = 'https://file.jxjiajiang.com/api/'
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
