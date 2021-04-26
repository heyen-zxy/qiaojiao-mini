<template>
	<view class="container">
		<tui-tabs :tabs="tabs" :isFixed="scrollTop>=0" :currentTab="currentTab" selectedColor="#E41F19" sliderBgColor="#E41F19"
		 @change="change"></tui-tabs>
		<!--选项卡逻辑自己实现即可，此处未做处理-->
		<view :class="{'tui-order-list':scrollTop>=0}">
			<view class="tui-order-item" v-for="(order,orderIndex) in orders" :key="order.id">
				<tui-list-cell :hover="false" :lineLeft="false">
					<view class="tui-goods-title">
						<view>订单号：{{order.no}}</view>
						<view class="tui-order-status">{{order.get_status}}</view>
					</view>
				</tui-list-cell>
				<block v-for="(order_norm,index) in order.order_norms" :key="order_norm.id">
					<tui-list-cell padding="0" @click="detail(order.id)">
						<view class="tui-goods-item">
							<image :src="order_norm.product.attachments[0].preview_url" class="tui-goods-img"></image>
							<view class="tui-goods-center">
								<view class="tui-goods-name">{{order_norm.product.name}}</view>
								<view class="tui-goods-attr">{{order_norm.norm.name}}</view>
							</view>
							<view class="tui-price-right">
								<view>￥{{order_norm.view_price}}</view>
								<view>x{{order_norm.number}}</view>
							</view>
						</view>
					</tui-list-cell>
				</block>
				<tui-list-cell :hover="false" :last="true">
					<view class="tui-goods-price">
						<view>合计：</view>
						<view class="tui-size-24">￥</view>
						<view class="tui-price-large">{{order.view_amount}}</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-btn" v-if="order.status =='wait'" @click="destroy(order.id)">
					<view class="tui-btn-ml">
						<tui-button type="danger" :plain="true" width="148rpx" height="56rpx" :size="26" shape="circle">删除</tui-button>
					</view>
				</view>
			</view>
			<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" content="确定删除该订单吗？"></tui-modal>
		</view>
		<!--加载loadding-->
		<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
		<tui-nomore :visible="!pullUpOn" bgcolor="#fafafa"></tui-nomore>
		<!--加载loadding-->

	</view>
</template>

<script>
	import tuiTabs from "@/components/tui-tabs/tui-tabs"
	import tuiButton from "@/components/extend/button/button"
	import tuiLoadmore from "@/components/loadmore/loadmore"
	import tuiNomore from "@/components/nomore/nomore"
	import tuiListCell from "@/components/list-cell/list-cell"
	import tuiSticky from "@/components/sticky/sticky"
	import api from "../../api.js"
	import tuiModal from "@/components/modal/modal"
	export default {
		components: {
			tuiTabs,
			tuiButton,
			tuiLoadmore,
			tuiNomore,
			tuiListCell,
			tuiSticky,
			tuiModal
		},
		data() {
			return {
				tabs: [{
					name: "全部"
				}, {
					name: "待付款"
				}, {
					name: "待服务"
				}, {
					name: "已完成"
				}],
				modal: false,
				orders: [],
				currentTab: 'all',
				currentDelteOrderId: '',
				pageIndex: 1,
				loadding: false,
				pullUpOn: true,
				scrollTop: 0,
				status: '',
				statuses: ['', 'wait', 'paid', 'served']
			}
		},
		onShow: function(){
			this.orders = []
			this.pageIndex = 1
			this.getOrders()
		},
		onLoad: function(options){
			console.log(2)
			if(options.status){
				this.status = options.status
				this.currentTab = this.statuses.indexOf(options.status)
			}
		},
		methods: {
			change(e) {
				this.currentTab = e.index
				this.status = this.statuses[e.index]
				this.orders = []
				this.pageIndex = 1
				this.getOrders()
			},
			detail(id) {
				uni.navigateTo({
					url: '../orders/show?id=' + id
				})
			},
			getOrders(){
				let _this = this
				api.orders(_this.status, _this.pageIndex).then(function(data){
					if(data){
						_this.orders = _this.orders.concat(data)
					}
					uni.stopPullDownRefresh()
					_this.loadding = false
					if(!data[0]){
						_this.pullUpOn = false
					}
				}).catch(function(e){
					
				})
			},
			destroy: function(id){
				this.currentDelteOrderId = id
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
					api.deleteOrder(_this.currentDelteOrderId).then(function(data){
						if(data.req_status == 'success'){
							let index = _this.orders.findIndex((o) => o.id == _this.currentDelteOrderId)
							if(index >= 0){
								_this.orders.splice(index, 1)
							}
							uni.hideLoading()
						}
					}).catch(function(e){
						console.log(e)
					})
				}
				
			},
			hide: function(){
				this.modal = false
			},
		},
		onPullDownRefresh() {
			this.pageIndex =  0
			this.orders = []
			this.getOrders()
		},
		onReachBottom() {
			if(this.loadding || !this.pullUpOn){
				return
			}
			//只是测试效果，逻辑以实际数据为准
			this.pageIndex =  this.pageIndex + 1
			this.getOrders()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		}
	}
</script>

<style>
	.container {
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-order-list {
		margin-top: 80rpx;
	}

	.tui-order-item {
		margin-top: 20rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-goods-title {
		width: 100%;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-order-status {
		color: #888;
		font-size: 26rpx;
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
		font-weight: 500;
	}

	.tui-order-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		background: #fff;
		padding: 10rpx 30rpx 20rpx;
		box-sizing: border-box;
	}

	.tui-btn-ml {
		margin-left: 20rpx;
	}
</style>
