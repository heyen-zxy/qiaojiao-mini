<template>
	<view class="container">
		<tui-tips position="center" ref="toast" ></tui-tips>
		<tui-list-cell :arrow="true" :last="true" :radius="true" @click="chooseAddr" >
			<view class="tui-address">
				<view v-if="address.id">
					<view class="tui-userinfo">
						<text class="tui-name">{{address.name}}</text> {{address.phone}}
					</view>
					<view class="tui-addr">
						<view class="tui-addr-tag">{{address.address_type}}</view>
						<text>{{address.address_name}}</text>
					</view>
				</view>
				<view class="tui-none-addr" v-else>
					<image src="/static/images/index/map.png" class="tui-addr-img" mode="widthFix"></image>
					<text>选择收货地址</text>
				</view>
			</view>
			<view class="tui-bg-img"></view>
		</tui-list-cell>

		<view class="tui-order-item">
			<tui-list-cell :hover="false" :lineLeft="false">
				<view class="tui-goods-title">
					商品信息
				</view>
			</tui-list-cell>
			<block v-for="(item,index) in order.order_norms" :key="index">
				<tui-list-cell padding="0">
					<view class="tui-goods-item">
						<image :src="item.product.attachments[0].preview_url" class="tui-goods-img"></image>
						<view class="tui-goods-center">
							<view class="tui-goods-name">{{item.product.name}}</view>
							<view class="tui-goods-attr">{{item.norm.name}}</view>
						</view>
						<view class="tui-price-right">
							<view>￥{{item.view_price}}</view>
							<view>x{{item.number}}</view>
						</view>
					</view>
				</tui-list-cell>
			</block>
			<view class="tui-goods-info">
				<view class="tui-price-flex tui-size24">
					<view>商品总额</view>
					<view>￥{{order.view_amount}}</view>
				</view>
				<view class="tui-price-flex  tui-size24">
					<view>配送费</view>
					<view>￥0.00</view>
				</view>
				<view class="tui-price-flex tui-size32 tui-pbtm20">
					<view class="tui-flex-shrink">合计</view>
					<view class="tui-goods-price">
						<view class="tui-size-24">￥</view>
						<view class="tui-price-large">{{order.view_amount}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="tui-order-info">
			<tui-list-cell :hover="false">
				<view class="tui-order-title">
					订单信息
				</view>
			</tui-list-cell>
			<view class="tui-order-content">
				<view class="tui-order-flex">
					<view class="tui-item-title">订单号:</view>
					<view class="tui-item-content">{{order.no}}</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">创建时间:</view>
					<view class="tui-item-content">{{order.created_at}}</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">付款时间:</view>
					<view class="tui-item-content">{{order.payment_at}}</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">配送方式:</view>
					<view class="tui-item-content">送货上门</view>
				</view>
				<view class="tui-order-flex" v-if="order.desc || order.status != 'wait'">
					<view class="tui-item-title">订单备注:</view>
					<view class="tui-item-content">{{order.desc}}</view>
				</view>
				<view class="tui-order-flex" v-else>
					<view class="tui-item-title">订单备注:</view>
					<input type="text" class="tui-remark" placeholder="选填: 请先和商家协商一致" placeholder-class="tui-phcolor" @input="changDesc"></input>
				</view>
			</view>
		</view>
		<view class="tui-safe-area"></view>
		<view class="tui-tabbar tui-order-btn">
			<view class="tui-btn-mr" v-if="chargeProductId && (order.status == 'paid' || order.status == 'served')">
				<tui-button type="danger" width="148rpx" height="56rpx" :size="26" shape="circle" @click="charge">补差价</tui-button>
			</view>
			<view class="tui-btn-mr" v-if="order.status == 'wait'">
				<tui-button type="green" width="148rpx" height="56rpx" :size="26" shape="circle" @click="pay">立即支付</tui-button>
			</view>
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" content="确定删除该订单吗？"></tui-modal>
	</view>
	
</template>

<script>
	import tuiIcon from '@/components/icon/icon'
	import tuiButton from "@/components/extend/button/button"
	import tuiCountdown from "@/components/countdown/countdown"
	import tuiListCell from "@/components/list-cell/list-cell"
	import api from "../../api.js"
	import tuiTips from "@/components/tips/tips"
	import tuiModal from "@/components/modal/modal"
	export default {
		components: {
			tuiIcon,
			tuiButton,
			tuiCountdown,
			tuiListCell,
			tuiTips,
			tuiModal
		},
		data() {
			return {
				webURL: "https://www.thorui.cn/wx/static/images/mall/order/",
				//1-待付款 2-付款成功 3-待收货 4-订单已完成 5-交易关闭
				status: 1,
				order: {},
				address: {
					id: null
				},
				timer: '',
				desc: '',
				modal: false,
				chargeProductId: ''
			}
			
		},
		onLoad: function(options) {
			uni.setStorageSync('currentOrderId', options.id)
			let _this = this
			api.order(options.id).then(function(data){
				_this.order = data
				if(data.address){
					_this.address = data.address
				}
			}).catch(function(error){
				console.log(error)
			})
			api.chargeProductId().then(function(data){
				console.log(data)
				_this.chargeProductId = data.charge_product_id
			}).catch(function(error){
				console.log(error)
			})
			if(options.select_address == 1){
				if(!_this.address.id){
					_this.address.id = uni.getStorageSync('addressId')
					console.log(_this.address.id )
					if(_this.address.id){
						api.address(_this.address.id).then(function(data){
							_this.address = data
							console.log(_this.address.id)
						}).catch(function(error){
						console.log(error)
						})
					}
				}
			}
		},
		methods: {
			getImg: function(status) {
				return this.webURL + ["img_order_payment3x.png", "img_order_send3x.png", "img_order_received3x.png",
					"img_order_signed3x.png", "img_order_closed3x.png"
				][status - 1]
			},
			getStatusText: function(status) {
				return ["等待您付款", "付款成功", "待收货", "订单已完成", "交易关闭"][status - 1]
			},
			getReason: function(status) {
				return ["剩余时间", "等待卖家发货", "还剩X天XX小时自动确认", "", "超时未付款，订单自动取消"][status - 1]
			},
			chooseAddr: function(){
				if(this.order.status == 'wait' && !this.order.addressId){
					uni.navigateTo({
						url: '../address/index'
					})
				}
			},
			changDesc: function(e){
				this.desc = e.detail.value
			},
			checkOrder: function(){
				let _this = this
				api.order(_this.order.id).then(function(data){
					uni.hideLoading()
					_this.order = data
					console.log(data.status)
					if(data.status == 'paid'){
						clearInterval(_this.timer);
						uni.reLaunch({
							url: '../orders/result?id=' + _this.order.id
						})
					}
				}).catch(function(e){
					
				})
			},
			destroy: function(){
				this.modal = true
			},
			handleClick: function(e){
				this.modal = false
				let index = e.index;
				let _this = this
				if (index != 0) {
					uni.showLoading({
						mask: true,
						title: '请求中...'
					})
					api.deleteOrder(_this.order.id).then(function(data){
						if(data.req_status == 'success'){
							uni.redirectTo({
								url: '../orders/index'
							})
						}
					}).catch(function(e){
						console.log(data)
					})
				}
				
			},
			hide: function(){
				this.modal = false
			},
			charge: function(){
				if(this.chargeProductId){
					uni.navigateTo({
						url: '../products/show?id=' + this.chargeProductId + "&server_user_id=" + this.order.admin_id
					})
				}
			},
			pay: function(){
				let _this = this
				let addressId = _this.order.address_id || _this.address.id
				if(!addressId){
					this.$refs.toast.showTips({
						msg: '请先选择地址',
						duration: 2000,
						type: 'danger'
					});
					return
				}
				if(this.order.status != 'wait'){
					return
				}
				uni.showLoading({
					mask: true,
					title: '支付中...'
				})
				api.wxPay(_this.order.id, addressId, _this.desc).then(function(data){
					if(data.package){
						uni.requestPayment({
							provider: 'wxpay',
							orderInfo: '佳匠服务',
							timeStamp: data.timeStamp,
							nonceStr: data.nonceStr,
							package: data.package,
							signType: 'MD5',
							paySign: data.paySign,
							success: (e) => {
								console.log("success", e);
							},
							fail: (e) => {
								console.log("fail", e);
								uni.hideLoading()
								uni.showModal({
									content: "支付失败,原因为: " + e.errMsg,
									showCancel: false
								})
							},
							complete: () => {
								console.log('completed')
							}
						})
						_this.timer = setInterval(function() {
							_this.checkOrder()
						}, 2000);
					}else{
						uni.hideLoading()
						uni.showModal({
							content: data.message,
							showCancel: false
						})
					}
				}).catch(function(e){
					console.log(data)
				})
			}
		}
	}
</script>

<style>
	.container {
		padding-bottom: 118rpx;
	}
	.tui-address {
		min-height: 80rpx;
		padding: 10rpx 0;
		box-sizing: border-box;
		position: relative;
	}
	.tui-userinfo {
		font-size: 30rpx;
		font-weight: 500;
		line-height: 30rpx;
		padding-bottom: 12rpx;
	}
	
	.tui-name {
		padding-right: 40rpx;
	}
	
	.tui-addr {
		font-size: 24rpx;
		word-break: break-all;
		padding-right: 25rpx;
	}
	.tui-addr-tag {
		padding: 5rpx 8rpx;
		flex-shrink: 0;
		background: #EB0909;
		color: #fff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 25rpx;
		line-height: 25rpx;
		transform: scale(0.8);
		transform-origin: 0 center;
		border-radius: 6rpx;
	}
	
	.tui-none-addr {
		height: 80rpx;
		padding-left: 5rpx;
		display: flex;
		align-items: center;
	}
	
	.tui-addr-img {
		width: 36rpx;
		height: 46rpx;
		display: block;
		margin-right: 15rpx;
	}

	.tui-order-header {
		width: 100%;
		height: 160rpx;
		position: relative;
	}

	.tui-img-bg {
		width: 100%;
		height: 160rpx;
	}

	.tui-header-content {
		width: 100%;
		height: 160rpx;
		position: absolute;
		z-index: 10;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 70rpx;
		box-sizing: border-box;
	}

	.tui-status-text {
		font-size: 36rpx;
		line-height: 36rpx;
		color: #FEFEFE;
	}

	.tui-reason {
		font-size: 24rpx;
		line-height: 24rpx;
		color: rgba(254, 254, 254, 0.75);
		padding-top: 15rpx;
		display: flex;
		align-items: center;
	}

	.tui-reason-text {
		padding-right: 12rpx;
	}

	.tui-status-img {
		width: 80rpx;
		height: 80rpx;
		display: block;
	}

	.tui-flex-box {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.tui-icon-img {
		width: 44rpx;
		height: 44rpx;
		flex-shrink: 0;
	}

	.tui-logistics {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 24rpx 0 20rpx;
		box-sizing: border-box;
	}

	.tui-logistics-text {
		font-size: 28rpx;
		line-height: 32rpx;
	}

	.tui-logistics-time {
		font-size: 24rpx;
		line-height: 24rpx;
		padding-top: 16rpx;
		color: #666;
	}


	.tui-addr-userinfo {
		font-size: 30rpx;
		line-height: 30rpx;
		font-weight: bold;
	}

	.tui-addr-text {
		font-size: 24rpx;
		line-height: 30rpx;
		padding-top: 16rpx;
	}

	.tui-addr-tel {
		padding-left: 40rpx;
	}

	.tui-order-item {
		margin-top: 20rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-goods-title {
		width: 100%;
		font-size: 28rpx;
		line-height: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}


	.tui-goods-item {
		width: 100%;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.tui-goods-img {
		width: 180rpx;
		height: 180rpx;
		display: block;
		flex-shrink: 0;
	}

	.tui-goods-center {
		flex: 1;
		padding: 20rpx 8rpx;
		box-sizing: border-box;
	}

	.tui-goods-name {
		max-width: 310rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 26rpx;
		line-height: 32rpx;
	}

	.tui-goods-attr {
		font-size: 22rpx;
		color: #888888;
		line-height: 32rpx;
		padding-top: 20rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-price-right {
		text-align: right;
		font-size: 24rpx;
		color: #888888;
		line-height: 30rpx;
		padding-top: 20rpx;
	}

	.tui-color-red {
		color: #E41F19;
		padding-right: 30rpx;
	}

	.tui-goods-price {
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		font-size: 24rpx;
	}

	.tui-size-24 {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-price-large {
		font-size: 32rpx;
		line-height: 30rpx;
	}

	.tui-goods-info {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		background: #fff;
	}

	.tui-price-flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-size24 {
		padding-bottom: 20rpx;
		font-size: 24rpx;
		line-height: 24rpx;
		color: #888;
	}

	.tui-size32 {
		font-size: 32rpx;
		line-height: 32rpx;
		font-weight: 500;
	}

	.tui-pbtm20 {
		padding-bottom: 20rpx;
	}

	.tui-flex-shrink {
		flex-shrink: 0;
	}

	.tui-primary-color {
		color: #EB0909;
	}

	.tui-order-info {
		margin-top: 20rpx;
	}

	.tui-order-title {
		position: relative;
		font-size: 28rpx;
		line-height: 28rpx;
		padding-left: 12rpx;
		box-sizing: border-box;
	}

	.tui-order-title::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		border-left: 4rpx solid #EB0909;
		height: 100%;
	}

	.tui-order-content {
		width: 100%;
		padding: 24rpx 30rpx;
		box-sizing: border-box;
		background: #fff;
		font-size: 24rpx;
		line-height: 30rpx;
	}

	.tui-order-flex {
		display: flex;
		padding-top: 18rpx;
	}

	.tui-order-flex:first-child {
		padding-top: 0
	}

	.tui-item-title {
		width: 132rpx;
		flex-shrink: 0;
	}

	.tui-item-content {
		color: #666;
	}

	.tui-safe-area {
		height: 1rpx;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-tabbar {
		width: 100%;
		height: 98rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-size: 26rpx;
		box-shadow: 0 0 1px rgba(0, 0, 0, .3);
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 999;
	}
	
	.tui-btn-mr {
		margin-right: 30rpx;
	}
	.tui-remark {
		font-size: 26rpx
	}
	.uni-input-input{
		font-size: 26rpx
	}
</style>
