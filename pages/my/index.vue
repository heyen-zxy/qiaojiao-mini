<template>
	<view>
		<!--header-->
		<view class="tui-header-box" :style="{height:height+'px',background:'rgba(255,255,255,'+opcity+')'}">
			<view class="tui-header" :style="{paddingTop:top+'px', opacity:opcity}">
				我的
			</view>
			
		</view>
		<!--header-->
		<view class="tui-mybg-box">
			<image src="https://www.thorui.cn/wx/static/images/mall/my/img_bg_3x.png" class="tui-my-bg" mode="widthFix"></image>
			<view class="tui-header-center">
				<image :src="user.avatar_url" class="tui-avatar" ></image>
				<view class="tui-info">
					<view class="tui-nickname">{{user.nick_name}}
					</view>
				</view>
			</view>
		</view>
		<view class="tui-content-box">
			<view class="tui-box tui-order-box">
				<tui-list-cell :arrow="true" padding="0" :lineLeft="false" @click="orders()">
					<view class="tui-cell-header">
						<view class="tui-cell-title">我的订单</view>
						<view class="tui-cell-sub">查看全部订单</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-list">
					<view class="tui-order-item" @tap="orders('wait')">
						<view class="tui-icon-box">
							<image src="/static/images/mall/my/icon_daifukuan_3x.png" class="tui-order-icon"></image>
							<view class="tui-badge tui-badge-red">{{myData.wait_order}}</view>
						</view>
						<view class="tui-order-text">待付款</view>
					</view>
					<view class="tui-order-item" @tap="orders('paid')">
						<view class="tui-icon-box">
							<image src="/static/images/mall/my/icon_daifahuo_3x.png" class="tui-order-icon"></image>
							<view class="tui-badge tui-badge-red">{{myData.paid_order}}</view>
						</view>
						<view class="tui-order-text">待服务</view>
					</view>
					<view class="tui-order-item" @tap="orders('served')">
						<view class="tui-icon-box">
							<image src="/static/images/mall/my/icon_daishouhuo_3x.png" class="tui-order-icon"></image>
						</view>
						<view class="tui-order-text">已完成</view>
					</view>
				</view>
			</view>

			<view class="tui-box tui-assets-box"  >
				<tui-list-cell padding="0" :last="true" :hover="false">
					<view class="tui-cell-header">
						<view class="tui-cell-title">我的佣金</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-list tui-assets-list">
					<view class="tui-order-item" @tap="shareOrders()">
						<view class="tui-assets-num">
							<text>{{myData.share_order}}</text>
						</view>
						<view class="tui-assets-text">订单数</view>
					</view>
					<view class="tui-order-item" @tap="userCommission()">
						<view class="tui-assets-num" >
							<text>{{myData.commission_wait}}</text>
						</view>
						<view class="tui-assets-text">可提现</view>
					</view>
					<view class="tui-order-item" @tap="userCommissionList()">
						<view class="tui-assets-num">
							<text>{{myData.commission_paid}}</text>
						</view>
						<view class="tui-assets-text">已提现</view>
					</view>
					<view class="tui-order-item" @tap="userCommissionList()">
						<view class="tui-assets-num">
							<text>{{myData.commission}}</text>
						</view>
						<view class="tui-assets-text">累计佣金</view>
					</view>
				</view>
			</view>

			<view class="tui-box tui-assets-box"  v-if="isAdmin">
				<tui-list-cell padding="0" :last="true" :hover="false">
					<view class="tui-cell-header">
						<view class="tui-cell-title">订单服务佣金</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-list tui-assets-list">
					<view class="tui-order-item" @tap="serverOrders('paid')">
						<view class="tui-assets-num">
							<text>{{myData.admin_paid_order}}</text>
							<view class="tui-badge-dot" v-if="myData.admin_paid_order > 0"></view>
						</view>
						<view class="tui-assets-text">待服务</view>
					</view>
					<view class="tui-order-item" @tap="serverOrders('served')">
						<view class="tui-assets-num">
							<text>{{myData.admin_served_order}}</text>
						</view>
						<view class="tui-assets-text">已服务</view>
					</view>
					<view class="tui-order-item" @tap="adminCommission()">
						<view class="tui-assets-num">
							<text>{{myData.admin_commission_wait}}</text>
						</view>
						<view class="tui-assets-text">可提现</view>
					</view>
					<view class="tui-order-item" @tap="adminCommissionList()">
						<view class="tui-assets-num">
							<text>{{myData.admin_commission_paid}}</text>
						</view>
						<view class="tui-assets-text">已经提现</view>
					</view>
				</view>
			</view>
			
			<view class="tui-box tui-assets-box" >
				<tui-list-cell padding="0" :last="true" :hover="false">
					<view class="tui-cell-header">
						<view class="tui-cell-title">其它服务</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-list tui-assets-list">
					<view class="tui-order-item" @tap="phoneCall">
						<view class="tui-assets-num" style="margin-bottom: 15rpx;">
							<tui-icon name="voipphone" size="20" color="grey"></tui-icon>
						</view>
						<view class="tui-assets-text">客服电话</view>
					</view>
					<view class="tui-order-item">
						<view class="tui-assets-num">
							<image src="../../static/images/user.png" style="width: 50rpx;height:50rpx;"></image>
						</view>
						<view >
							<button open-type="contact" class="tui-assets-text" style="background-color: white;">微信客服</button
						</view>
					</view>
					<view class="tui-order-item" >
					</view>
				</view>
			</view>

			<!--为你推荐-->
			<tui-divider :size="28" :bold="true" color="#333" width="50%">为您推荐</tui-divider>
			<view class="tui-product-list">
				<view class="tui-product-container">
					<block v-for="(item,index) in products" :key="index" v-if="(index+1)%2!=0">
						<!--商品列表-->
						<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="detail(item.id)">
							<image :src="item.attachments[0].preview_url" class="tui-pro-img" mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{item.name}}</view>
								<view>
									<view class="tui-pro-price">
										<text class="tui-sale-price">￥{{item.price}}</text>
										<!-- <text class="tui-factory-price" v-if="item.view_commission">佣:最高￥{{item.view_commission}}</text> -->
									</view>
									<view class="tui-pro-pay">{{item.sale}}人付款</view>
								</view>
							</view>
						</view>
						<!--商品列表-->
						<!-- <template is="productItem" data="{{item,index:index}}" /> -->
					</block>
				</view>
				<view class="tui-product-container">
					<block v-for="(item,index) in products" :key="index" v-if="(index+1)%2==0">
						<!--商品列表-->
						<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="detail(item.id)">
							<image :src="item.attachments[0].preview_url" class="tui-pro-img" mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{item.name}}</view>
								<view>
									<view class="tui-pro-price">
										<text class="tui-sale-price">￥{{item.price}}</text>
										<!-- <text class="tui-factory-price" v-if="item.view_commission">佣:最高￥{{item.view_commission}}</text> -->
									</view>
									<view class="tui-pro-pay">{{item.sale}}人付款</view>
								</view>
							</view>
						</view>
						<!--商品列表-->
						<!-- <template is="productItem" data="{{item,index:index}}" /> -->
					</block>
				</view>
			</view>
			</view>
			<!--加载loadding-->
			<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
			<tui-modal :show="modal" @cancel="hide" :custom="true" :fadein="true">
				<view class="tui-modal-custom">
					<view class="tui-prompt-title">提现金额</view>
					<input placeholder="请输入提现金额" class="tui-input" v-model="cash" type="number" />
					<tui-button shape="circle" type="green" @click="handleClick" :size="26">立即提现</tui-button>
				</view>
			</tui-modal>
		</view>
	</view>
</template>

<script>
	import tuiIcon from "@/components/icon/icon"
	import tuiButton from "@/components/extend/button/button"
	import tuiListCell from "@/components/list-cell/list-cell"
	import tuiDivider from "@/components/divider/divider"
	import tuiLoadmore from "@/components/loadmore/loadmore"
	import tuiModal from "@/components/modal/modal"
	import api from "../../api.js"
	export default {
		components: {
			tuiIcon,
			tuiButton,
			tuiListCell,
			tuiDivider,
			tuiLoadmore,
			tuiModal
		},
		onShow: function(options){
			let _this = this
			api.me().then(function(data){
				_this.user = data
				_this.isAdmin = data.admin_id
			}).catch(function(e){
				console.log(e)
			})
			api.my().then(function(data){
				_this.myData = data
			}).catch(function(e){
				console.log(e)
			})
		},
		onLoad: function(options) {
			let _this = this
			let obj = {};
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-BAIDU
			obj = swan.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif

			uni.getSystemInfo({
				success: (res) => {
					this.width = obj.left || res.windowWidth;
					this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
					this.top = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6);
					this.scrollH = res.windowWidth * 0.6
				}
			})
			api.recommendProducts().then(function(data){
				_this.products = data
				console.log(data.length)
			}).catch(function(error){console.log(error)})
		},
		data() {
			return {
				height: 64, //header高度
				top: 0, //标题图标距离顶部距离
				scrollH: 0, //滚动总高度
				opcity: 0,
				iconOpcity: 0.5,
				productList: [
				],
				pageIndex: 1,
				loadding: false,
				pullUpOn: true,
				user: {},
				isAdmin: false,
				modal: false,
				cash: 0,
				myData: {
					wait_order: 0,
					paid_order: 0,
					served_order: 0,
					share_order: 0,
					commission: 0,
					commission_wait: 0,
					commission_paid: 0,
					admin_paid_order: 0,
					admin_served_order: 0,
					admin_commission_wait: 0,
					admin_commission_paid: 0,
					can_cash: false
				},
				products: [
				]
			}
		},
		methods: {
			phoneCall(){
				uni.makePhoneCall({
				    phoneNumber: '15170802003' //仅为示例
				});
			},
			orders(status){
				uni.navigateTo({
					url: "../orders/index?status=" + status 
				})
			},
			userCommission(){
				
				if(this.myData.can_cash){
					this.modal = true
				}else{
					this.tui.toast("因商户号正常交易90天才可提现所以到2021年7月31号之后可以提取您的佣金到微信零钱，请您耐心等待")
				}
			},
			userCommissionList(){
				uni.navigateTo({
					url: "../my/user_commissions"
				})
			},
			adminCommission(){
				this.tui.toast("师傅的服务费用需要线下结算，了解更多信息拨打下面的客服电话。")
			},
			adminCommissionList(){
				uni.navigateTo({
					url: "../my/admin_commissions"
				})
			},
			serverOrders(status){
				if(status){
					uni.navigateTo({
						url: "../orders/server?status=" + status 
					})
				}else{
					uni.navigateTo({
						url: "../orders/server"
					})
				}
				
			},
			shareOrders(status){
				if(status){
					uni.navigateTo({
						url: "../orders/share?status=" + status 
					})
				}else{
					uni.navigateTo({
						url: "../orders/share"
					})
				}
				
			},
			detail: function(id) {
				uni.navigateTo({
					url: '../products/show?id=' + id
				})
			},
			hide: function(){
				this.modal = false
			},
			handleClick() {
				console.log(this.cash)
				let _this = this
				if(_this.cash && _this.cash > 10){
					api.cash(this.cash).then(function(data){
						_this.hide()
						if(data.status == 'success'){
							_this.tui.toast("提现请求已发送，请关注微信到账信息")
						}else{
							_this.tui.toast(data.message)
						}
					}).catch(function(e){
						console.log(e)
					})
				}else{
					_this.tui.toast("请输出正确的提现金额，最低提现金额为10元")
				}
				
				
			}
		},
		onPageScroll(e) {
			let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
			let opcity = scroll / this.scrollH;
			if (this.opcity >= 1 && opcity >= 1) {
				return;
			}
			this.opcity = opcity;
			this.iconOpcity = 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity)
		},
		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 200)
		},
		onReachBottom: function() {
			if (!this.pullUpOn) return;
			this.loadding = true;
			if (this.pageIndex == 4) {
				this.loadding = false;
				this.pullUpOn = false
			} else {
				let loadData = JSON.parse(JSON.stringify(this.productList));
				loadData = loadData.splice(0, 10)
				if (this.pageIndex == 1) {
					loadData = loadData.reverse();
				}
				this.productList = this.productList.concat(loadData);
				this.pageIndex = this.pageIndex + 1;
				this.loadding = false
			}
		}
	}
</script>

<style>
	.tui-header-box {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 9998;
	}

	.tui-header {
		width: 100%;
		font-size: 18px;
		line-height: 18px;
		font-weight: 500;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* #ifndef MP */
	.tui-header-icon {
		position: fixed;
		top: 0;
		right: 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 32px;
		transform: translateZ(0);
		z-index: 99999;
	}

	/* #endif */
	/* #ifdef MP */
	.tui-set-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/* #endif */
	.tui-icon-box {
		position: relative;
	}

	.tui-icon-setup {
		margin-left: 8rpx;
	}

	.tui-badge {
		position: absolute;
		font-size: 24rpx;
		height: 32rpx;
		min-width: 20rpx;
		padding: 0 6rpx;
		border-radius: 40rpx;
		right: 10rpx;
		top: -5rpx;
		transform: scale(0.8) translateX(60%);
		transform-origin: center center;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.tui-badge-red {
		background: #F74D54;
		color: #fff;
	}

	.tui-badge-white {
		background: #fff;
		color: #F74D54;
	}

	.tui-badge-dot {
		position: absolute;
		height: 12rpx;
		width: 12rpx;
		border-radius: 50%;
		right: -12rpx;
		top: 0;
		background: #F74D54;
	}

	.tui-mybg-box {
		width: 100%;
		height: 350rpx;
		position: relative;
	}

	.tui-my-bg {
		width: 100%;
		height: 350rpx;
		display: block;
	}

	.tui-header-center {
		position: absolute;
		width: 100%;
		height: 128rpx;
		left: 0;
		top: 120rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-avatar {
		flex-shrink: 0;
		width: 128rpx;
		height: 128rpx;
		display: block;
	}

	.tui-info {
		width: 60%;
		padding-left: 30rpx;

	}

	.tui-nickname {
		font-size: 30rpx;
		font-weight: 500;
		color: #fff;
		display: flex;
		align-items: center;
	}

	.tui-img-vip {
		width: 56rpx;
		height: 24rpx;
		margin-left: 18rpx;
	}

	.tui-explain {
		width: 80%;
		font-size: 24rpx;
		font-weight: 400;
		color: #fff;
		opacity: 0.75;
		padding-top: 8rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-btn-edit {
		flex-shrink: 0;
		padding-right: 22rpx;
	}

	.tui-header-btm {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: absolute;
		left: 0;
		top: 280rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #fff;
	}

	.tui-btm-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.tui-btm-num {
		font-size: 32rpx;
		font-weight: 600;
		position: relative;
	}

	.tui-btm-text {
		font-size: 24rpx;
		opacity: 0.85;
		padding-top: 4rpx;
	}

	.tui-content-box {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: relative;
		top: -72rpx;
		z-index: 10;
	}

	.tui-box {
		width: 100%;
		background: #fff;
		box-shadow: 0 3rpx 20rpx rgba(183, 183, 183, 0.1);
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-order-box {
		height: 208rpx;
	}

	.tui-cell-header {
		width: 100%;
		height: 74rpx;
		padding: 0 26rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-cell-title {
		font-size: 30rpx;
		line-height: 30rpx;
		font-weight: 600;
		color: #333;
	}

	.tui-cell-sub {
		font-size: 26rpx;
		font-weight: 400;
		color: #999;
		padding-right: 28rpx;
	}

	.tui-order-list {
		width: 100%;
		height: 134rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;

	}

	.tui-order-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tui-order-text,
	.tui-tool-text {
		font-size: 26rpx;
		font-weight: 400;
		color: #666;
		padding-top: 4rpx;
	}

	.tui-tool-text {
		font-size: 24rpx;
	}

	.tui-order-icon {
		width: 56rpx;
		height: 56rpx;
		display: block;
	}

	.tui-assets-box {
		height: 178rpx;
		margin-top: 20rpx;
	}

	.tui-assets-list {
		height: 84rpx;
	}

	.tui-assets-num {
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
		position: relative;
	}

	.tui-assets-text {
		font-size: 24rpx;
		font-weight: 400;
		color: #666;
		padding-top: 6rpx;
	}

	.tui-tool-box {
		margin-top: 20rpx;
	}

	.tui-flex-wrap {
		flex-wrap: wrap;
		height: auto;
		padding-bottom: 30rpx;
	}

	.tui-tool-item {
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-top: 30rpx;
	}

	.tui-tool-icon {
		width: 64rpx;
		height: 64rpx;
		display: block;
	}

	.tui-badge-icon {
		width: 66rpx;
		height: 30rpx;
		position: absolute;
		right: 0;
		transform: translateX(88%);
		top: -15rpx;
	}

	/*为你推荐*/
	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
	}

	.tui-product-container {
		flex: 1;
		margin-right: 2%;
	}

	.tui-product-container:last-child {
		margin-right: 0;
	}

	.tui-pro-item {
		width: 100%;
		margin-bottom: 4%;
		background: #fff;
		box-sizing: border-box;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.tui-pro-img {
		width: 100%;
		display: block;
	}

	.tui-pro-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.tui-pro-tit {
		color: #2e2e2e;
		font-size: 26rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-pro-price {
		padding-top: 18rpx;
	}

	.tui-sale-price {
		font-size: 25rpx;
		font-weight: 500;
		color: #e41f19;
	}

	.tui-factory-price {
		font-size: 18rpx;
		color: white;
		padding-left: 5rpx;
		padding-right: 5rpx;
		margin-left: 12rpx;
		background-color: #e41f19;
	}

	.tui-pro-pay {
		padding-top: 10rpx;
		font-size: 18rpx;
		color: #656565;
	}
	
	.tui-modal-custom {
		text-align: center
	}
	
	.tui-prompt-title {
		padding-bottom: 20rpx;
		font-size: 34rpx;
	}
	
	.tui-input {
		margin: 30rpx 40rpx;
		border-bottom: 1rpx solid #E6E6E6;
		padding-bottom: 20rpx;
		font-size: 32rpx;
	}
</style>
