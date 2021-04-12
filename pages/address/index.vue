<template>
	<view class="tui-safe-area">
		<view class="tui-address">
			<block v-for="(item,index) in addressList" :key="index">
				<tui-list-cell padding="0">
					<view class="tui-address-flex" >
						<view class="tui-address-left" @click="selectAddress(item.id)">
							<view class="tui-address-main">
								<view class="tui-address-name tui-ellipsis">{{item.name}}</view>
								<view class="tui-address-tel">{{item.phone}}</view>
							</view>
							<view class="tui-address-detail">
								<view class="tui-address-label" v-if="item.default">默认</view>
								<view class="tui-address-label" v-if="item.address_type">{{item.show_address_type}}</view>
								<text>{{item.address_name}}</text>
							</view>
						</view>
						<view class="tui-address-imgbox" @click="editAddr(item.id)">
							<image class="tui-address-img" src="/static/images/mall/my/icon_addr_edit.png" />
						</view>
					</view>
				</tui-list-cell>
			</block>
		</view>
		<!-- 新增地址 -->
		<view class="tui-address-new">
			<tui-button type="danger" height="88rpx" @click="editAddr">+ 新增收货地址</tui-button>
		</view>
	</view>
</template>

<script>
	import tuiButton from "@/components/extend/button/button"
	import tuiListCell from "@/components/list-cell/list-cell"
	import api from "../../api.js"
	export default {
		components: {
			tuiButton,
			tuiListCell
		},
		data() {
			return {
				addressList: []
			}
		},
		onLoad: function(options) {
			let _this = this
			api.addresses().then(function(data){
				_this.addressList = data
				console.log(data)
			})
		},
		onShow: function() {},
		methods: {
			editAddr(id) {
				let url = id ? ("../address/edit?id=" + id) : "../address/edit"
				uni.navigateTo({
					url: url
				})
			},
			selectAddress(id){
				console.log(id)
				uni.setStorageSync('addressId', id) 
				let orderId = uni.getStorageSync('currentOrderId')
				if(orderId){
					uni.redirectTo({
						url: '../orders/show?select_address=1&id=' + orderId
					})
				}
			}
		}
	}
</script>

<style>
	.tui-address {
		width: 100%;
		padding-top: 20rpx;
		padding-bottom: 160rpx;
	}
	.tui-address-flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tui-address-main {
		width: 600rpx;
		height: 70rpx;
		display: flex;
		font-size: 30rpx;
		line-height: 86rpx;
		padding-left: 30rpx;
	}

	.tui-address-name {
		width: 120rpx;
		height: 60rpx;
	}

	.tui-address-tel {
		margin-left: 10rpx;
	}

	.tui-address-detail {
		font-size: 24rpx;
		word-break: break-all;
		padding-bottom: 25rpx;
		padding-left: 25rpx;
		padding-right: 120rpx;
	}

	.tui-address-label {
		padding: 5rpx 8rpx;
		flex-shrink: 0;
		background: #e41f19;
		border-radius: 6rpx;
		color: #fff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 25rpx;
		line-height: 25rpx;
		transform: scale(0.8);
		transform-origin: center center;
		margin-right: 6rpx;
	}

	.tui-address-imgbox {
		width: 80rpx;
		height: 100rpx;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		right: 10rpx;
	}

	.tui-address-img {
		width: 36rpx;
		height: 36rpx;
	}

	.tui-address-new {
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 999;
		padding: 20rpx 25rpx 30rpx;
		box-sizing: border-box;
		background: #fafafa;
	}

	.tui-safe-area {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
