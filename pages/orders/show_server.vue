<template>
	<view class="container">
		<tui-tips position="center" ref="toast" ></tui-tips>
		<tui-list-cell :last="true" :radius="true" @click="phoneCall" >
			<view class="tui-address">
				<view class="tui-userinfo">
					<text class="tui-name">{{address.name}}</text> {{address.phone}}
				</view>
				<view class="tui-addr">
					<view class="tui-addr-tag">{{address.address_type}}</view>
					<text>{{address.address_name}}</text>
				</view>
			</view>
			<view class="tui-phone">
				<tui-icon name="voipphone" size="30" color="grey"></tui-icon>
			</view>
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
				<view class="tui-order-flex">
					<view class="tui-item-title">订单备注:</view>
					<view class="tui-item-content">{{order.desc}}</view>
				</view>
			</view>
		</view>
		<view class="tui-order-info">
			<tui-list-cell :hover="false">
				<view class="tui-order-title">
					服务证据
				</view>
			</tui-list-cell>
			<view class="tui-news-flex tui-flex-column tui-order-content" >
				<view class="tui-news-picbox tui-w-full tui-flex-between" >
					<block v-for="(attachment,index) in order.attachments" :key="attachment.id">
						<image :src="attachment.preview_url" mode="widthFix" class="tui-block tui-one-third"></image>
					</block>
				</view>
			</view>	
		</view>
		<view class="tui-safe-area"></view>
		<view class="tui-tabbar tui-order-btn">
			<view class="tui-btn-mr">
				<tui-button type="green" width="148rpx" height="56rpx" :size="26" shape="circle" @click="upload">上传证据</tui-button>
			</view>
			<view class="tui-btn-mr" v-if="order.status == 'paid'">
				<tui-button type="danger" width="148rpx" height="56rpx" :size="26" shape="circle" @click="served">完成服务</tui-button>
			</view>
		</view>
		<tui-modal :show="modal1" @click="handleClick1" @cancel="hide1" title="提示" content="确定完成服务吗？"></tui-modal>
		<tui-modal :show="modal2" @click="handleClick2" @cancel="hide2" content="请先上传上传服务证据图" :button="button"></tui-modal>
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
				order: {attachments: []},
				address: {
					id: null
				},
				timer: '',
				desc: '',
				modal1: false,
				modal2: false,
				button: [{
					text: "确定",
					type: 'red'
				}],
			}
			
		},
		onLoad: function(options) {
			uni.setStorageSync('currentOrderId', options.id)
			let _this = this
			api.order(options.id).then(function(data){
				_this.order = data
				console.log(data)
				if(data.address){
					_this.address = data.address
				}
			}).catch(function(error){
				console.log(error)
			})
		},
		methods: {
			phoneCall: function(){
				if(this.address.phone){
					uni.makePhoneCall({
					    phoneNumber: this.address.phone //仅为示例
					});
				}
			},
			upload: function(){
				let _this = this
				uni.chooseImage({
					count: 1,
					sizeType: 'original',
					success: function(res){
						uni.showLoading({
							mask: true,
							title: '上传中...'
						})
						api.serverFile(_this.order.id, res.tempFilePaths[0]).then(function(data){
							_this.order = JSON.parse(data)
							uni.hideLoading()
						}).catch(function(e){
							console.log(e)
						})
					},
					fail: function(e){
						console.log('fail')
					},
					complete: function(e){
						console.log('complete')
					}
						
				})
			},
			hide1: function() {
				this.modal1 = false
			},
			hide2: function() {
				this.modal2 = false
			},
			handleClick1(e) {
				let index = e.index;
				let _this = this
				console.log(1);
				if (index != 0) {
					uni.showLoading({
						mask: true,
						title: '请求中...'
					})
					api.server_order(this.order.id).then(function(data){
						_this.order = data
						uni.hideLoading()
					}).catch(function(e){
						console.log(e)
					})
				}
				this.hide1()
			},
			handleClick2: function(){
				this.hide2()
			},
			served: function(){
				let _this = this
				_this.model1 = true
				console.log(this.order.attachments)
				if(this.order.attachments && this.order.attachments[0]){
					_this.modal1 = true
				}else{
					_this.modal2 = true
				}
			}
		}
	}
</script>

<style>
	.container {
		padding-bottom: 118rpx;
	}
	
	.tui-news-flex {
		width: 100%;
		display: flex;
	}
	
	.tui-flex-column {
		flex-direction: column !important;
	}
	
	.tui-news-picbox {
		display: flex;
		position: relative;
	}
	
	.tui-w-full {
		width: 100%;
	}
	
	.tui-block {
		display: block;
	}
	
	.tui-one-third {
		width: 33%;
	}
	
	.tui-flex-between {
		justify-content: space-between !important;
	}
	
	.tui-address {
		width: 100%;
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
