<template>
	<view class="container">
		
		<view class="tui-header-banner">
			<view class="tui-banner-bg">
				<view class="tui-primary-bg tui-route-left"></view>
				<view class="tui-primary-bg tui-route-right"></view>
				<!--banner-->
				<view class="tui-banner-box">
					<swiper :indicator-dots="true" :autoplay="true" :interval="5000" :duration="150" class="tui-banner-swiper"
					 :circular="true" indicator-color="rgba(255, 255, 255, 0.8)" indicator-active-color="#fff">
						<swiper-item v-for="(item,index) in banners" :key="index" @tap.stop="detail(item.id)">
							<image :src="item.banner_attachment.preview_url" class="tui-slide-image" mode="scaleToFill" />
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		
		

		<view class="tui-product-category">
			<view class='tui-notice-board' v-if="content">
				<view class="tui-icon-bg">
					<tui-icon name="news-fill" :size='24' color='#f54f46'></tui-icon>
				</view>
				<view class="tui-scorll-view">
					<view class="tui-notice tui-animation">{{content}}</view>
				</view>
			</view>
			<view class="tui-category-item" v-for="(item,index) in categories" :key="index" :data-key="item.name" @tap="more(item.id)">
				<image :src="'../../static/images/mall/category/'+item.img" class="tui-category-img" mode="scaleToFill"></image>
				<view class="tui-category-name">{{item.name}}</view>
			</view>
		</view>

		<view class="tui-product-box">
			<view class="tui-group-name">
				<text>热门推荐</text>
			</view>
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
		<tui-modal :show="isCanUse" @cancel="hideUserInfo" :custom="true" :maskClosable="false">
			<view class="tui-modal-custom">
				<image src="/static/images/logo.png" class="tui-tips-img"></image>
				<view class="tui-modal-custom-text">申请获取以下权限</view>
				<view class="tui-modal-custom-text-small">获取您的公开信息(昵称，头像，性别)</view>
				<button class="bottom danger tui-btn" type="primary" open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">授权登录</button>
			
			</view>
		</tui-modal>
		<!--加载loadding-->
	</view>
</template>
<script>
	import tuiIcon from "@/components/icon/icon"
	import tuiTag from "@/components/tag/tag"
	import tuiModal from "@/components/modal/modal"
	import tuiButton from "@/components/extend/button/button"
	import tuiLoadmore from "@/components/loadmore/loadmore"
	import tuiNomore from "@/components/nomore/nomore"
	import api from "../../api.js"
	export default {
		components: {
			tuiIcon,
			tuiTag,
			tuiLoadmore,
			tuiNomore,
			tuiModal,
			tuiButton
		},
		data() {
			return {
				current: 0,
				SessionKey: '',
				OpenId: '',
				nickName: null,
				avatarUrl: null,
				news: [],
				newsIndex: 0,
				content: '',
				banners: [
				],
				categories: [
				{
					img: "3.png",
					name: "上门安装",
					id: '',
					parentId: ''
				}, {
					img: "1.png",
					name: "家电清洗",
					id: '',
					parentId: ''
				},{
					img: "4.png",
					name: "家电维修",
					id: '',
					parentId: ''
				}, {
					img: "6.png",
					name: "水电维修",
					id: '',
					parentId: ''
				}, {
					img: "5.png",
					name: "家政保洁",
					id: '',
					parentId: ''
				}, {
					img: "2.png",
					name: "电机维修",
					id: '',
					parentId: ''
				}, {
					img: "7.png",
					name: "二手租售",
					id: '',
					parentId: ''
				}, {
					img: "8.png",
					name: "全屋装修",
					id: '',
					parentId: ''
					
				}],
				products: [
				],
				pageIndex: 1,
				loadding: false,
				pullUpOn: true
			}
		},
		onLoad() {//默认加载
			this.getData();
			this.tui.showSubscribe()
		},
		methods: {
			setNews(){
				if(this.news[0]){
					if(this.newsIndex == this.news.length - 1){
						this.newsIndex  = 0
					}else{
						this.newsIndex  += 1
					}
				}
				this.content = this.news[this.newsIndex].content
			},
			getData(){
				let _this = this
				api.banners().then(function(data){
					_this.banners = data
				}).catch(function(error){console.log(error)})
				api.news().then(function(data){
					_this.news = data
					if(_this.news[0]){
						console.log(_this.news)
						_this.content = _this.news[0].content
					}
					setInterval(_this.setNews,15*1000)
				}).catch(function(error){console.log(error)})
				api.categories().then(function(data){
					data.forEach(function(item,index,arr){
						_this.setCategoryId(item.name, item.id)
					})
				}).catch(function(error){console.log(error)})
				
				api.recommendProducts().then(function(data){
					_this.products = data
					console.log(data.length)
				}).catch(function(error){console.log(error)})
			},
			setCategoryId(name, id){
				let _this = this
				this.categories.forEach(function(category, index, categories){
					if(category.name == name){
						_this.categories[index].id = id
					}
				})
			},
			tabbarSwitch: function(e) {
				let index = e.currentTarget.dataset.index;
				this.current = index;
				if (index != 0) {
					if (index == 1) {
						uni.navigateTo({
							url: '../products/index'
						})
					} else if (index == 2) {
						uni.navigateTo({
							url: '../carts/index'
						})
					} else if (index == 3) {
						uni.navigateTo({
							url: '../orders/index'
						})
					}
				}
			},
			detail: function(id) {
				uni.navigateTo({
					url: '../products/show?id=' + id
				})
			},
			classify: function() {
				uni.navigateTo({
					url: '/pages/navbar-2/navbar-2'
				})

			},
			more: function(id) {
				uni.reLaunch({
					url: '../products/list?id=' + id
				})

			},
			search: function() {
				uni.reLaunch({
					url: '../products/index'
				})
			}
		},
		onPullDownRefresh: function() {
			this.pullUpOn = true;
			this.loadding = false
			this.getData()
			uni.stopPullDownRefresh()
		},
		onReachBottom: function() {
			
		}
	}
</script>

<style>
	page {
		background: #f7f7f7;
	}

	.container {
		padding-bottom: 100rpx;
		color: #333;
	}
	
	.tui-notice-board {
		width: 110%;
		padding-right: 30upx;
		box-sizing: border-box;
		font-size: 28upx;
		height: 60upx;
		background: #fff8d5;
		display: flex;
		align-items: center;
		z-index: 999;
		margin-left: -20rpx;
	}
	
	.tui-notice {
		transform: translateX(100%);
	}
	
	.tui-animation {
		-webkit-animation: tui-rolling 15s linear infinite;
		animation: tui-rolling 15s linear infinite;
	}
	
	@-webkit-keyframes tui-rolling {
		0% {
			transform: translateX(100%);
		}
	
		100% {
			transform: translateX(-170%);
		}
	}
	
	.tui-scorll-view {
		flex: 1;
		line-height: 1;
		white-space: nowrap;
		overflow: hidden;
		color: #f54f46;
	}
	
	.tui-icon-bg {
		background: #fff8d5;
		padding-left: 30upx;
		position: relative;
		z-index: 10;
	}

	/*tabbar*/
	.tui-btn{
		width: 100%;
		position: relative;
		border: 0 !important;
		border-radius: 3px;
		padding-left: 0;
		padding-right: 0;
		overflow: visible;
		height: 38px;
		line-height: 38px;
		font-size: 14px;
	}
	.danger{
		background: #EB0909 !important;
		color: #fff
	}
	.tui-modal-custom {
		text-align: center;
	}
	
	.tui-modal-custom-text {
		font-size: 30rpx;
		color: #333;
	}
	.tui-modal-custom-text-small {
		font-size: 18rpx;
		color: grey;
		padding: 0rpx 0 50rpx;
	}
	.tui-tips-img {
		width: 200rpx;
		height: 200rpx;
		margin-top: 20rpx;
	}
	
	.tui-tabbar {
		width: 100%;
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 99999;
		background: #fff;
		height: 100rpx;
		left: 0;
		bottom: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.tui-tabbar::before {
		content: '';
		width: 100%;
		border-top: 1rpx solid #d9d9d9;
		position: absolute;
		top: 0;
		left: 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-tabbar-item {
		flex: 1;
		width: 25%;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: space-between;
		font-size: 24rpx;
		color: #666;
		height: 80rpx;
	}

	.tui-ptop-4 {
		padding-top: 4rpx;
	}

	.tui-scale {
		font-weight: bold;
		transform: scale(0.8);
		transform-origin: center 100%;
		line-height: 30rpx;
	}

	.tui-item-active {
		color: #e41f19 !important;
	}

	/*tabbar*/

	.tui-header {
		width: 100%;
		height: 100rpx;
		padding: 0 30rpx 0 20rpx;
		box-sizing: border-box;
		background: #e41f19;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		left: 0;
		top: 0;
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		z-index: 999;
	}

	.tui-rolling-search {
		width: 100%;
		height: 60rpx;
		border-radius: 35rpx;
		padding: 0 40rpx 0 30rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		color: #999;
	}

	.tui-category {
		font-size: 24rpx;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin: 0;
		margin-right: 22rpx;
		flex-shrink: 0;
	}

	.tui-category-scale {
		transform: scale(0.7);
		line-height: 24rpx;
	}

	.tui-icon-category {
		line-height: 20px !important;
		margin-bottom: 0 !important;
	}

	.tui-swiper {
		font-size: 26rpx;
		height: 60rpx;
		flex: 1;
		padding-left: 12rpx;
	}

	.tui-swiper-item {
		display: flex;
		align-items: center;
	}

	.tui-hot-item {
		line-height: 26rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-header-banner {
		/* padding-top: 100rpx; */
		box-sizing: border-box;
		background: #e41f19;
	}

	.tui-hot-search {
		color: #fff;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
	}

	.tui-hot-tag {
		background: rgba(255, 255, 255, 0.15);
		padding: 10rpx 24rpx;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 24rpx;
		/* margin-left: 20rpx; */
	}

	.tui-banner-bg {
		display: flex;
		height: 180rpx;
		background: #e41f19;
		position: relative;
	}

	.tui-primary-bg {
		width: 50%;
		display: inline-block;
		height: 224rpx;
		border: 1px solid transparent;
		position: relative;
		z-index: 1;
		background: #e41f19;
	}

	.tui-route-left {
		transform: skewY(8deg);
	}

	.tui-route-right {
		transform: skewY(-8deg);
	}

	.tui-banner-box {
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
		position: absolute;
		/* overflow: hidden; */
		z-index: 99;
		bottom: -80rpx;
		left: 0;
	}

	.tui-banner-swiper {
		width: 100%;
		height: 240rpx;
		border-radius: 12rpx;
		overflow: hidden;
		transform: translateY(0);
	}

	.tui-slide-image {
		width: 100%;
		height: 240rpx;
		display: block;
	}

	/* #ifdef APP-PLUS || MP */
	.tui-banner-swiper .wx-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}

	.tui-banner-swiper .wx-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}

	.tui-banner-swiper .wx-swiper-dot-active::before {
		background: #fff;
	}

	.tui-banner-swiper .wx-swiper-dot.wx-swiper-dot-active {
		width: 16rpx;
	}

	/* #endif */

	/* #ifdef H5 */
	>>>.tui-banner-swiper .uni-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}

	>>>.tui-banner-swiper .uni-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}

	>>>.tui-banner-swiper .uni-swiper-dot-active::before {
		background: #fff;
	}

	>>>.tui-banner-swiper .uni-swiper-dot.uni-swiper-dot-active {
		width: 16rpx;
	}

	/* #endif */

	.tui-product-category {
		background: #fff;
		padding: 80rpx 20rpx 30rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		font-size: 24rpx;
		color: #555;
		margin-bottom: 20rpx;
	}

	.tui-category-item {
		width: 25%;
		height: 118rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
		padding-top: 30rpx;
	}

	.tui-category-img {
		height: 80rpx;
		width: 80rpx;
		display: block;
	}

	.tui-category-name {
		line-height: 24rpx;
	}

	.tui-product-box {
		margin-top: 20rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.tui-pb-20 {
		padding-bottom: 20rpx;
	}

	.tui-bg-white {
		background: #fff;
	}

	.tui-group-name {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		padding: 24rpx 0;
	}

	.tui-activity-box {
		display: flex;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.tui-activity-img {
		width: 50%;
		display: block;
	}

	.tui-new-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.tui-new-item {
		width: 49%;
		height: 200rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		background: #f5f2f9;
		position: relative;
		border-radius: 12rpx;
	}

	.tui-new-mtop {
		margin-top: 2%;
	}

	.tui-title-box {
		font-size: 24rpx;
	}

	.tui-new-title {
		line-height: 32rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-new-price {
		padding-top: 18rpx;
	}

	.tui-new-present {
		color: #ff201f;
		font-weight: bold;
	}

	.tui-new-original {
		display: inline-block;
		color: #a0a0a0;
		text-decoration: line-through;
		padding-left: 12rpx;
		transform: scale(0.8);
		transform-origin: center center;
	}

	.tui-new-img {
		width: 160rpx;
		height: 160rpx;
		display: block;
		flex-shrink: 0;
	}

	.tui-new-label {
		width: 56rpx;
		height: 56rpx;
		border-top-left-radius: 12rpx;
		position: absolute;
		left: 0;
		top: 0;
	}

	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
		/* padding-top: 20rpx; */
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
</style>
