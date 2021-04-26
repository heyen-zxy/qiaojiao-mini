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
		uni.setStorageSync("subscribe", '1')
	},
	cache:function(key, value, seconds) {
		var timestamp = Date.parse(new Date()) / 1000
		if (key && !value) {
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
		let that = this
		uni.requestSubscribeMessage({
			tmplIds: ['h5CtjMGbiLCl7aICaxndzkAa5ExNx7_qVCYN4oiIJSM', 'YEWcpJmcPiVeAg6igaGkcW1cSFGKn8ZaZOM5RZIpBZg', 'A0-kDcODKZr7h-Zc-EEKQFzhaKABp6Ug0m5LfKcdesk'],
			success: function(){
				// tui.setSubscribe()
				tui.cache('subscribe', '1', 3600 * 24 * 3)
				that.showSubscribeModal = false
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

Vue.mixin({
	data() {
		return {
			isCanUse: false,
			showSubscribeModal: false
		}
	},
	onLoad: function (options) {
		// 唤起订阅后 三天内不在唤起
		this.showSubscribeModal = !tui.cache('subscribe');
		if(options.scene){
			console.log(options.scene)
			var scene = decodeURIComponent(options.scene);
			var arr = scene.split(';')
			var ops = {}
			arr.forEach(function(v, i, ar){
				let r = v.split('=')
				ops[r[0]] = r[1]
			})
			console.log(ops)
			if(ops.share_token){
				tui.cache("from_token", ops.share_token, 3600*24)
			}
		}
		
		if(options.share_token){
			console.log("share_token:" + options.share_token)
			tui.cache("from_token", options.share_token, 3600*24)
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
		notUse: function(){
			this.isCanUse = false
		},
		notSubscribe: function(){
			this.showSubscribeModal = false
		},
		subscribe: function(){
			this.tui.showSubscribe()
		},
		wxGetUserInfo() {
			let _this = this;
			_this.isCanUse = false
			wx.getUserProfile({
				lang: 'zh_CN',
				desc: '用于完善个人资料',
				success: function(res){
					_this.login(res.userInfo)
				},
				fail: function(e){
					wx.getUserInfo({
						success: function(res){
							_this.login(res.userInfo)
							console.log(res.userInfo)
						}
					})
				},
				complete: function(e){
					console.log(e)
				}
			})
		},	
		login: function(userInfo){
			if(this.tui.isLogin()){
				return
			}
			let _this = this;
			uni.showLoading({
				title: '登录中...'
			});
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					let code = loginRes.code;
					api.wxAuth(code).then(function(data){
						_this.tui.setSessionToken(data.authentication_token)
						uni.setStorageSync('share_token', data.share_token);
						api.userInfo(userInfo).then(function(data){
							uni.hideLoading();
							console.log(_this.$mp.page.route)
							if(_this.$mp.page.route == 'pages/my/index'){
							  _this.getData()
						    }
						});
					}).catch(function(e){
			
					})
				},
			});	
		}
	}
})

Vue.prototype.tui = tui
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
Vue.prototype.$store = store
// Vue.prototype.apiUrl = 'http://qiaojiang.mynatapp.cc/api'
Vue.prototype.apiUrl = 'https://www.jxjiajiang.com/api'
Vue.prototype.imageUrl = 'https://file.jxjiajiang.com/api/'
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
