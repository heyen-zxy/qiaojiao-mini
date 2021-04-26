<template>
	<view class="tui-container">
		<!--新闻列表-->
		<scroll-view scroll-x scroll-with-animation class="tab-view" :scroll-left="scrollLeft">
			<view v-for="(messageType,index) in messageTypes" :key="messageType.id" class="tab-bar-item" :class="[currentTab==messageType.id ? 'active' : '']"
			 :data-current="messageType.id" @tap.stop="swichNav">
				<text class="tab-bar-title">{{messageType.name}}</text>
			</view>
		</scroll-view>
		
		<view class="tui-news-view">
			<tui-list-cell class="tui-pt20 cell" v-for="(message,index2) in messages" :key="message.id">
				<view class="tui-news-flex tui-flex-column" >
					<view class="tui-sub-box tui-pt20" >
						<view class="tui-cmt-user">
							<image :src="message.image_path ? message.image_path : '../../static/images/user.png'" class="tui-acatar"></image>
							<view>{{message.show_name}}</view>
						</view>
						<view class="tui-sub-cmt" v-if="message.phone" @tap="phoneCall(message.phone)">
							<view class="tui-scale">
								<view><tui-icon name="voipphone" size="25" color="#999"></tui-icon></view>
							</view>
						</view>
					</view>
					<view class="tui-news-tbox tui-flex-column tui-flex-between">
						<view class="tui-news-title tui-pt20">{{message.content}}</view>
						<view class="tui-news-picbox tui-w-full tui-pt20">
							<image :src="attachment.preview_url" mode="widthFix" class="tui-block tui-one-four" v-for="(attachment,index3) in message.attachments" :key="attachment.id" @tap="previewImg(message.id, attachment.preview_url)"></image>
						</view>
					</view>
					<view class="tui-sub-box tui-pt20">
						<text class="tui-sub-source">{{message.updated_at}}</text>
					</view>
				</view>
			</tui-list-cell>
		</view>
		<tui-tips ref="toast"></tui-tips>
		<!--加载loadding-->
		<tui-loadmore :visible="loadding" :index="3" type="primary"></tui-loadmore>
		<tui-nomore :visible="!pullUpOn" bgcolor="#f2f2f2"></tui-nomore>
		<!--加载loadding-->
	</view>
</template>

<script>
	import tuiIcon from "@/components/icon/icon"
	import tuiTag from "@/components/tag/tag"
	import tuiListCell from "@/components/list-cell/list-cell"
	import tuiLoadmore from "@/components/loadmore/loadmore"
	import tuiNomore from "@/components/nomore/nomore"
	import tuiTips from "@/components/tips/tips"
	import tuiTabs from "@/components/tui-tabs/tui-tabs"
	import api from "../../api.js"
	export default {
		components: {
			tuiIcon,
			tuiTag,
			tuiListCell,
			tuiLoadmore,
			tuiNomore,
			tuiTips,
			tuiTabs
		},
		computed: {
			
		},
		data() {
			return {
				messageTypes: [{
					name: "全部",
					id: 0
				}],
				messages: [],
				scrollLeft: true,
				pageIndex: 1,
				loadding: false,
				pullUpOn: true,
				currentTab: 0,
				bgColor: "linear-gradient(90deg, rgb(255, 118, 38), rgb(252, 30, 82))"
			}
		},
		onLoad: function(options) {
			let _this = this
			api.messageTypes().then(function(data){
				console.log(data)
				_this.messageTypes = _this.messageTypes.concat(data)
				console.log(_this.messageTypes)
			}).catch(function(e){
				console.log(e)
			})
			_this.getData()
		},
		methods: {
			previewImg: function(messageId, url){
				let message = this.messages.find(function(m, i, arr){
					console.log(m.id)
					console.log(messageId)
					return m.id == messageId
				})
				let imgs = [] 
				message.attachments.forEach(function(m, i, arr){
					imgs.push(m.preview_url)
				})
				uni.previewImage({
					current: url,
					urls: imgs
				})
			},
			swichNav: function(e) {
				let cur = e.currentTarget.dataset.current;
				this.currentTab = cur
				this.messages = []
				this.pageIndex = 1
				this.getData()
			},
			getData: function(){
				let _this = this
				api.messages(this.pageIndex, _this.currentTab).then(function(data){
					_this.messages = _this.messages.concat(data)
					uni.stopPullDownRefresh();
					_this.loadding = false;
					if(!data[0]){
						_this.pullUpOn = false
					}
				}).catch(function(e){
					console.log(e)
				})
			},
			phoneCall: function(phone){
				uni.makePhoneCall({
				    phoneNumber: phone //仅为示例
				});
			}
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh: function() {
			this.pageIndex = 1;
			this.messages = []
			this.getData();
			this.pullUpOn = true;
			this.loadding = false;
		},
		// 页面上拉触底事件的处理函数
		onReachBottom: function() {
			if (this.loadding || !this.pullUpOn) return;
			this.loadding = true;
			this.pageIndex = this.pageIndex + 1;
			this.getData()
		}
	}
</script>

<style>
	page {
		background: #f2f2f2;
	}
	.tab-view::before {
		content: '';
		position: absolute;
		border-bottom: 1upx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}
	
	.tab-view {
		width: 100%;
		height: 100upx;
		overflow: hidden;
		box-sizing: border-box;
		position: fixed;
		top: 0;
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		left: 0;
		z-index: 99;
		background: #fff;
		white-space: nowrap;
		background: linear-gradient(90deg, rgb(255, 118, 38), rgb(252, 30, 82))
	}
	
	.tab-bar-item {
		padding: 0;
		min-width: 80upx;
		display: inline-block;
		text-align: center;
		box-sizing: border-box;
		margin-top: 25rpx;
		min-width: 150rpx;
	}
	
	.tab-bar-title {
		height: 100upx;
		color: white;
		font-weight: 400;
		font-size: 28rpx;
		
	}
	
	.active {
		background-color: white;
		border-radius: 15px;
		padding: 5rpx;
	}
	
	.active .tab-bar-title {
		color: rgb(252, 30, 82) !important;
		font-weight: bold;
		background-color: white;
		border-radius: 25rpx;
		padding: 5rpx;
	}
	
	.tui-news-view{
		margin-top: 90rpx;
	}
	.tui-container {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-searchbox {
		padding: 16rpx 20rpx;
		box-sizing: border-box;
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

	.tui-banner-swiper {
		width: 100%;
		height: 300rpx;
		position: relative;
	}

	.tui-slide-image {
		width: 100%;
		height: 300rpx;
		display: block;
	}

	.tui-banner-title {
		width: 100%;
		height: 100rpx;
		position: absolute;
		z-index: 9999;
		color: #fff;
		bottom: 0;
		padding: 0 30rpx;
		padding-top: 25rpx;
		font-size: 34rpx;
		font-weight: bold;
		background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7));
		box-sizing: border-box;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* #ifdef APP-PLUS || MP */
	.tui-banner-swiper .wx-swiper-dots.wx-swiper-dots-horizontal {
		width: 100%;
		top: 280rpx;
		text-align: right;
		padding-right: 30rpx;
		box-sizing: border-box;
	}

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
		background: rgba(255, 255, 255, 0.9);
		border-radius: 8rpx;
	}

	.tui-banner-swiper .wx-swiper-dot-active::before {
		background: #5677fc;
	}

	.tui-banner-swiper .wx-swiper-dot.wx-swiper-dot-active {
		width: 18rpx;
	}

	/* #endif */

	/* #ifdef H5 */
	>>>.tui-banner-swiper .uni-swiper-dots.uni-swiper-dots-horizontal {
		width: 100%;
		top: 280rpx;
		text-align: right;
		padding-right: 30rpx;
		box-sizing: border-box;
	}

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
		background: rgba(255, 255, 255, 0.9);
		border-radius: 8rpx;
	}

	>>>.tui-banner-swiper .uni-swiper-dot-active::before {
		background: #5677fc;
	}

	>>>.tui-banner-swiper .uni-swiper-dot.uni-swiper-dot-active {
		width: 18rpx;
	}

	/* #endif */

	.tui-news-flex {
		width: 100%;
		display: flex;
	}

	.tui-flex-start {
		align-items: flex-start !important;
	}

	.tui-flex-center {
		align-items: center !important;
	}

	.tui-flex-column {
		flex-direction: column !important;
	}

	.tui-flex-between {
		justify-content: space-between !important;
	}

	.tui-news-cell {
		display: flex;
		padding: 20rpx 30rpx;
	}

	.tui-news-tbox {
		flex: 1;
		width: 100%;
		box-sizing: border-box;
		display: flex;
	}

	.tui-news-picbox {
		display: flex;
		position: relative;
	}

	.tui-w220 {
		width: 220rpx;
	}

	.tui-h165 {
		height: 165rpx;
	}

	.tui-block {
		display: block;
	}

	.tui-w-full {
		width: 100%;
	}

	.tui-one-four {
		width: 25%;
		padding: 5rpx;
	}

	.tui-news-title {
		width: 100%;
		font-size: 34rpx;
		word-break: break-all;
		word-wrap: break-word;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		box-sizing: border-box;
	}

	.tui-pl-20 {
		padding-left: 20rpx;
	}

	.tui-pt20 {
		padding-top: 20rpx;
	}

	.tui-sub-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #999;
		box-sizing: border-box;
		line-height: 24rpx;
	}

	.tui-sub-source {
		font-size: 26rpx;
	}

	.tui-sub-cmt {
		font-size: 24rpx;
		line-height: 24rpx;
		display: flex;
		align-items: center;
	}

	.tui-tag {
		padding: 2rpx 6rpx !important;
		margin-left: 10rpx;
	}

	.tui-scale {
		transform: scale(0.6);
		transform-origin: center center;
	}

	.tui-btm-badge {
		position: absolute;
		right: 0;
		bottom: 0;
		font-size: 24rpx;
		color: #fff;
		padding: 2rpx 12rpx;
		background: rgba(0, 0, 0, 0.6);
		z-index: 20;
		transform: scale(0.8);
		transform-origin: 100% 100%;
	}

	.tui-video {
		position: absolute;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		transform-origin: 0 0;
	}

	.tui-icon-box .tui-icon {
		background: none;
		padding: 0;
		border-radius: 0;
	}
	
	.tui-cmt-user {
		display: flex;
		align-items: center;
	}
	
	.tui-acatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		display: block;
		margin-right: 16rpx;
	}
	.cell::after {
		content: '';
		position: absolute;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}
</style>
