<template>
	<view class="container">
		<view class="tui-searchbox">
			<view class="tui-search-input">
				<!-- #ifdef APP-PLUS || MP -->
				<icon type="search" :size='13' color='#333'></icon>
				<!-- #endif -->
				<input confirm-type="search" placeholder="搜索商品名" placeholder-class="tui-input-plholder"
				@confirm="confirmSearch" :value="search"
				 class="tui-input" />
			</view>
			<view class="tui-category" hover-class="opcity" :hover-stay-time="150" @tap="screen" v-if="tags[0]">
				<tui-icon name="manage-fill" color="#E41F19" :size="22"></tui-icon>
				<view class="tui-category-scale">品牌</view>
			</view>
		</view>
		<scroll-view scroll-y scroll-with-animation class="tab-view" :scroll-top="scrollTop" :style="{height:height+'px',top:top+'px'}">
			<view v-for="(item,index) in categories" :key="index" :id="item.id"  class="tab-bar-item" :class="[currentTab==item.id ? 'active' : '']"
			 :data-current="item.id" @tap.stop="swichNav">
				<text>{{item.name}}</text>
			</view>
		</scroll-view>
		<block >
			<scroll-view scroll-y class="right-box" :style="{height:height+'px',top:top+'px'}">
				<!--内容部分 start 自定义可删除-->
				<view class="tui-product-container">
					<block v-for="(product,index) in products" :key="product.id">
						<!-- <template is="productItem" data="{{item,index:index,isList:isList}}" /> -->
						<!--商品列表-->
						<view class="tui-pro-item tui-flex-list" hover-class="hover" :hover-start-time="150" @tap="detail(product.id)">
							<image :src="product.main_attachment.preview_url" class="tui-pro-img tui-proimg-list" mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{product.name}}</view>
								<view>
									<view class="tui-pro-price">
										<text class="tui-sale-price">￥{{product.price}}</text>
										<!-- <text class="tui-factory-price" v-if="item.view_commission">佣￥{{product.view_commission}}</text> -->
									</view>
									<view class="tui-pro-pay">{{product.sale}}人付款</view>
								</view>
							</view>
						</view>
						<!--商品列表-->
					</block>
				</view>
				<!--内容部分 end 自定义可删除-->
			</scroll-view>
		</block>
		<tui-drawer mode="right" :visible="drawer" @close="closeDrawer">
			<view class="tui-drawer-box" >
				<scroll-view class="tui-drawer-scroll" scroll-y :style="{height:drawerH+'px'}">
					<view class="tui-drawer-title">
						<text class="tui-title-bold">品牌</text>
					</view>
					<view class="tui-drawer-content tui-flex-attr">
						<view class="tui-attr-item" @tap="selectTag(tag.id )" :class="tag.id == tagId ? 'tui-btmItem-active' : '' " v-for="(tag, index) in tags" :key="tag.id">
							<view class="tui-attr-ellipsis">{{tag.name}}</view>
						</view>
					</view>
				</scroll-view>
				<view class="tui-attr-btnbox">
					<view class="tui-attr-safearea">
						<view class="tui-drawer-btn tui-drawerbtn-black" hover-class="tui-white-hover" :hover-stay-time="150" @tap="resetTag">重置</view>
						<view class="tui-drawer-btn tui-drawerbtn-primary" hover-class="tui-red-hover" :hover-stay-time="150" @tap="searchTag">确定</view>
					</view>
				</view>
			</view>
		</tui-drawer>		
	</view>
</template>

<script>
	import api from "../../api.js"
	import tuiIcon from "@/components/icon/icon"
	import tuiDrawer from "@/components/drawer/drawer"
	export default {
		components: {
			tuiIcon,
			tuiDrawer
		},
		data() {
			return {
				categories: [],
				products: [],
				categoryId: '',
				height: 0, //scroll-view高度
				top: 0,
				currentTab: 0, //预设当前项的值
				scrollTop: 0, //tab标题的滚动条位置
				search: '',
				drawer: false,
				tags: [],
				tagId: '',
				drawerH: 0
			}
		},
		onLoad: function(options) {
			setTimeout(() => {
				uni.getSystemInfo({
					success: (res) => {
						let header = 0;
						let top = 0;
						//#ifdef H5
						top = 44;
						//#endif
						this.height = res.windowHeight - uni.upx2px(header) - 50
						this.top = top + uni.upx2px(header) + 50
					}
				});
			}, 50)
			uni.getSystemInfo({
				success: (res) => {
					this.drawerH = res.windowHeight - uni.upx2px(100) - this.height
				}
			})
			let _this = this
			api.categories().then(function(data){
				_this.categories = data
				_this.currentTab = _this.categories[0].id
				_this.categoryId = data[0].id
				console.log(options.id)
				if(options.id){
					_this.categoryId = options.id
					_this.currentTab = options.id
				}
				_this.getProducts(_this.categoryId)
			})
			
		},
		methods: {
			screen: function(){
				this.drawer = true
			},
			closeDrawer: function(){
				this.drawer = false
			},
			selectTag: function(id){
				this.tagId = id
			},
			resetTag: function(){
				this.tagId = ''
			},
			searchTag: function(){
				this.getProducts(this.categoryId, this.tagId)
			},
			confirmSearch: function(e) {
				this.search = e.detail.value;
				this.categoryId = 0
				this.currentTab = 0
				let _this = this
				_this.tags = []
				_this.tagId = ''
				api.products({table_search: this.search}).then(function(data){
					_this.products = data
				}).catch(function(e){
					console.log(e)
				})
			},
			getProducts: function(id){
				let _this = this
				api.categoryProducts(id, _this.tagId).then(function(data){
					console.log(data)
					_this.drawer = false
					_this.products = data
				})
				_this.getTags(id)
			},
			getTags: function(id){
				let _this = this
				api.tags(id).then(function(data){
					console.log(data)
					_this.tags = data
				})
			},
			// 点击标题切换当前页时改变样式
			swichNav: function(e) {
				this.search = ''
				let cur = e.currentTarget.dataset.current
				this.tagId = ''
				this.getProducts(e.currentTarget.id)
				this.categoryId = e.currentTarget.id
				if (this.currentTab == cur) {
					return false;
				} else {
					this.currentTab = cur;
					this.checkCor();
				}
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor: function() {
				let that = this;
				//这里计算按照实际情况进行修改，动态数据要进行动态分析
				//思路：窗体高度/单个分类高度 200rpx 转px计算 =>得到一屏幕所显示的个数，结合后台传回分类总数进行计算
				//数据很多可以多次if判断然后进行滚动距离计算即可
				// if (that.currentTab > 7) {
				// 	that.scrollTop = 500
				// } else {
				// 	that.scrollTop = 0
				// }
			},
			detail: function(id) {
				uni.navigateTo({
					url: '../products/show?id=' + id
				})
			}
		}
	}
</script>

<style>
	page {
		background: #fcfcfc;
	}

	/* 左侧导航布局 start*/

	/* 隐藏scroll-view滚动条*/

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
	
	/*顶部下拉选择 综合*/
	
	.tui-drawer-box {
		width: 686rpx;
		font-size: 24rpx;
		overflow: hidden;
		position: relative;
		padding-bottom: 100rpx;
	}
	
	.tui-drawer-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
		height: 80rpx;
	}
	
	.tui-title-bold {
		font-size: 26rpx;
		font-weight: bold;
		flex-shrink: 0;
	}
	
	.tui-location {
		margin-right: 6rpx;
	}
	
	.tui-attr-right {
		width: 70%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: right;
	}
	
	.tui-all-box {
		width: 90%;
		white-space: nowrap;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	
	.tui-drawer-content {
		padding: 16rpx 30rpx 30rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}
	
	.tui-attr-item {
		width: 30%;
		height: 64rpx;
		background: #f7f7f7;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 4rpx;
		box-sizing: border-box;
		border-radius: 32rpx;
		margin-right: 5%;
		margin-bottom: 5%;
	}
	
	.tui-attr-ellipsis {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		width: 96%;
		text-align: center;
	}
	
	.tui-attr-item:nth-of-type(3n) {
		margin-right: 0%;
	}
	
	.tui-attr-btnbox {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		padding: 0 30rpx;
		background: #fff;
	}
	
	.tui-attr-safearea {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.tui-drawerbtn-primary {
		background: #e41f19;
		color: #fff;
	}
	
	.tui-category {
		font-size: 24rpx;
		color: #E41F19;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin: 0;
		margin-left: 22rpx;
		flex-shrink: 0;
	}
	
	.tui-btmItem-active {
		background: #fcedea !important;
		color: #e41f19;
		font-weight: bold;
		position: relative;
	}
	
	.tui-btmItem-active::after {
		content: "";
		position: absolute;
		border: 1rpx solid #e41f19;
		width: 100%;
		height: 100%;
		border-radius: 40rpx;
		left: 0;
		top: 0;
	}
	
	.tui-drawer-btn {
		width: 47%;
		text-align: center;
		height: 60rpx;
		border-radius: 30rpx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}
	
	.tui-drawerbtn-black {
		border: 1rpx solid #555;
	}
	
	.tui-drawerbtn-primary {
		background: #e41f19;
		color: #fff;
	}
	
	.tui-category-scale {
		transform: scale(0.7);
		line-height: 15rpx;
	}

	.tui-searchbox {
		width: 100%;
		height: 92upx;
		padding: 0 30upx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		left: 0;
		top: 0;
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		z-index: 100;
		border-bottom: 1upx solid #d2d2d2;
	}

	.tui-searchbox::after {
		content: '';
		position: absolute;
		border-bottom: 1upx solid #d2d2d2;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.tui-search-input {
		width: 100%;
		height: 60upx;
		background: #f1f1f1;
		border-radius: 30upx;
		font-size: 26upx;
		color: #999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-search-text {
		padding-left: 16upx;
	}

	.tab-view {
		/* height: 100%; */
		width: 200upx;
		position: fixed;
		left: 0;
		z-index: 10;
	}

	.tab-bar-item {
		width: 200upx;
		height: 110upx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26upx;
		color: #444;
		font-weight: 400;
	}

	.active {
		position: relative;
		color: #000;
		font-size: 30upx;
		font-weight: 600;
		background: #fcfcfc;
	}

	.active::before {
		content: "";
		position: absolute;
		border-left: 8upx solid #E41F19;
		height: 30upx;
		left: 0;
	}
	
	.tui-attr-btnbox::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}
	
	/* 左侧导航布局 end*/
	
	.tui-product-container {
		flex: 1;
		margin-right: 10rpx;
	}
	
	.tui-pro-item {
		width: 100%;
		margin-bottom: 10rpx;
		background: #fff;
		box-sizing: border-box;
		border-radius: 12rpx;
		overflow: hidden;
		transition: all 0.15s ease-in-out;
		margin-top: 3px;
	}
	
	.tui-flex-list {
		display: flex;
		margin-bottom: 1rpx !important;
	}
	
	.tui-pro-img {
		width: 100%;
		display: block;
	}
	
	.tui-proimg-list {
		width: 180rpx;
		height: 180rpx !important;
		flex-shrink: 0;
		border-radius: 12rpx;
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
		font-size: 20rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	
	.tui-active {
		color: #e41f19;
	}
	
	.tui-sale-price {
		font-size: 25rpx;
		font-weight: 500;
		color: #e41f19;
	}
	
	.tui-factory-price {
		font-size: 20rpx;
		color: #a0a0a0;
		padding-left: 12rpx;
	}
	
	.tui-pro-pay {
		padding-top: 10rpx;
		font-size: 20rpx;
		color: #656565;
	}
	/* 商品列表 end*/

	.right-box {
		width: 100%;
		position: fixed;
		padding-left: 220upx;
		box-sizing: border-box;
		left: 0;
	}

	.page-view {
		width: 100%;
		overflow: hidden;
		padding-top: 20upx;
		padding-right: 20upx;
		box-sizing: border-box;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.swiper {
		width: 100%;
		height: 220upx;
		border-radius: 12upx;
		overflow: hidden;
		transform: translateZ(0);
	}

	/* #ifdef APP-PLUS || MP */
	.swiper .wx-swiper-dot {
		width: 8upx;
		height: 8upx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}

	.swiper .wx-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 16upx;
		overflow: hidden;
	}

	.swiper .wx-swiper-dot-active::before {
		background: #fff;
	}

	.swiper .wx-swiper-dot.wx-swiper-dot-active {
		width: 16upx;
	}

	/* #endif */

	/* #ifdef H5 */
	>>>.swiper .uni-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}

	>>>.swiper .uni-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}

	>>>.swiper .uni-swiper-dot-active::before {
		background: #fff;
	}

	>>>.swiper .uni-swiper-dot.uni-swiper-dot-active {
		width: 16rpx;
	}

	/* #endif */

	.slide-image {
		width: 100%;
		height: 220upx;
	}

	.class-box {
		padding-top: 30upx;
	}

	.class-item {
		background: #fff;
		width: 100%;
		box-sizing: border-box;
		padding: 20upx;
		margin-bottom: 20upx;
		border-radius: 12upx;
	}

	.class-name {
		font-size: 22upx;
	}

	.g-container {
		/* padding-top: 20upx; */
		display: flex;
		display: -webkit-flex;
		justify-content: flex-start;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.g-box {
		width: 33.3333%;
		text-align: center;
		padding-top: 40upx;
	}

	.g-image {
		width: 120upx;
		height: 120upx;
	}

	.g-title {
		font-size: 22upx;
	}
</style>
