import Vue from 'vue'
import App from './App'

const api = {
	banners: function(){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/banners', 
				method: 'GET',
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	news: function(){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/news', 
				method: 'GET',
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	wxPay: function(id, address_id, desc){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/orders/' + id + '/wx_pay', 
				method: 'POST',
				data: {
					address_id: address_id,
					desc: desc
				},
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	me: function(){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/users/me', 
				method: 'GET',
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	my: function(){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/users/my', 
				method: 'GET',
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	address: function(id){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/addresses/' + id, 
				method: 'GET',
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	defaultAddress: function(){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/addresses/default', 
				method: 'GET',
				success: (res) => {
					console.log(res)
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	addresses: function(){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/addresses', 
				method: 'GET',
				success: (res) => {
					console.log(res)
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	createAddress: function(data){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/addresses', 
				method: 'POST',
				data: data,
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	updateAddress: function(id, data){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/addresses/' + id, 
				method: 'PUT',
				data: data,
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	orders: function(status, page){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/users/orders', 
				method: 'GET',
				data: {
					page: page,
					status: status
				},
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	serverOrders: function(status, page){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/users/server_orders', 
				method: 'GET',
				data: {
					page: page,
					status: status
				},
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	shareOrders: function(page){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/users/share_orders', 
				method: 'GET',
				data: {
					page: page
				},
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	express: function(id){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/users/orders/' + id+ '/express', 
				method: 'GET',
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	order: function(id){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/orders/' + id, 
				method: 'GET',
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	server_order: function(id){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/orders/' + id + '/server_order', 
				method: 'POST',
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	serverFile: function(id, file){
		console.log(file)
		return new Promise(function(resolve, reject) {
			const uploadTask = uni.uploadFile({
				url: Vue.prototype.apiUrl + '/v1/orders/' + id + '/server_files',
				filePath: file,
				name: 'server',
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				success: function(res){
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				fail: function(res){
					reject(res)
				},
				complete: function(res){
					
				},
			})
			uploadTask.onProgressUpdate((res) => {
			            console.log('上传进度' + res.progress);
			            console.log('已经上传的数据长度' + res.totalBytesSent);
			            console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
			
			            // 测试条件，取消上传任务。
			            // if (res.progress > 50) {
			            //     uploadTask.abort();
			            // }
			        });
		})
	},
	applyOrder: function(norm_array){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/users/apply_orders', 
				method: 'POST',
				data: {
					norm_array: norm_array,
					from_token: uni.getStorageSync('form_token')
				},
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						Vue.prototype.tui.setSessionToken(null)
					}
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	deleteOrder: function(id){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/orders/' + id, 
				method: 'DELETE',
				success: (res) => {
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	cash: function(cash){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/users/cash', 
				method: 'POST',
				data: {
					cash: cash
				},
				success: (res) => {
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	userCommissions: function(page){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/users/user_commission_logs', 
				method: 'GET',
				data: {
					page: page
				},
				success: (res) => {
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	adminCommissions: function(page){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/users/admin_commission_logs', 
				method: 'GET',
				data: {
					page: page
				},
				success: (res) => {
					resolve(res.data)
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	categories: function() {
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/categories', 
				method: 'GET',
				success: (res) => {
					resolve(res.data)
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	categoryProducts: function(id, tagId) {
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/categories/' + id + '/products', 
				method: 'GET',
				data: {
					tag_id: tagId
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				success: (res) => {
					resolve(res.data)
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	tags: function(id) {
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/categories/' + id + '/tags', 
				method: 'GET',
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				success: (res) => {
					resolve(res.data)
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	messages: function(page, messageTypeId){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/messages', 
				method: 'GET',
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				data: {
					message_type_id: messageTypeId,
					page: page
				},
				success: (res) => {
					resolve(res.data)
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	messageTypes: function(){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/messages/types', 
				method: 'GET',
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				success: (res) => {
					resolve(res.data)
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	userInfo: function(userInfo){
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/users/set_user_info', 
				method: 'POST',
				data: userInfo,
				header: {
					// 'Access-Control-Allow-Origin': '*'
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				success: (res) => {
					console.log(res)
					resolve(res.data)
				},
				fail: (res) => {
					console.log(res)
					reject(res)
				}
			});
		})
	},
	wxAuth: function(code) {
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/users/wx_login', 
				method: 'POST',
				data: {
					code: code
				},
				header: {
					// 'Access-Control-Allow-Origin': '*'
				},
				success: (res) => {
					console.log(res)
					resolve(res.data)
				},
				fail: (res) => {
					console.log(res)
					reject(res)
				}
			});
		})
	},
	products: function(searchOptions) {
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/products', 
				method: 'GET',
				data: searchOptions,
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				success: (res) => {
					resolve(res.data)
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	recommendProducts: function(category_id) {
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/products/recommend', 
				method: 'GET',
				data: {
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				success: (res) => {
					resolve(res.data)
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	product: function(id) {
		return new Promise(function(resolve, reject) {
			console.log(Vue.prototype.apiUrl)
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/products/' + id, 
				method: 'GET',
				success: (res) => {
					resolve(res.data)
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},
	getJssdk: function() {
		return new Promise(function(resolve, reject) {
			uni.request({
				url: Vue.prototype.apiUrl + '/v1/weixin/jssdk', 
				method: 'POST',
				data: {
					url: window.location.href,
				},
				header: {
					'X-Auth-Token': Vue.prototype.tui.getSessionToken()
				},
				success: (res) => {
					if (res.data && res.data.error && res.data && res.data.error === "401 Unauthorized") {
						uni.setStorageSync('newSessionToken', null)
					}
					resolve(res.data)
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},

}

export default api
