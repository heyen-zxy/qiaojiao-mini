<template>
	<view class="tui-addr-box">
		<tui-tips ref="toast" ></tui-tips>
		<form :report-submit="true">
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">收货人</view>
					<input placeholder-class="tui-phcolor" class="tui-input" v-model="address.name" name="name" placeholder="请输入收货人姓名" maxlength="15" type="text" />
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">手机号码</view>
					<input placeholder-class="tui-phcolor" class="tui-input" v-model="address.phone" name="mobile" placeholder="请输入收货人手机号码" maxlength="11"
					 type="number" />
				</view>
			</tui-list-cell>
			<tui-list-cell :arrow="true" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title"><text class="tui-title-city-text">所在城市</text></view>
					<view @click="showAddress" style="width:100%">
					            {{ address.places.length > 0 ? this.address.places.join(' ') : '请选择地点'}}
					        </view>
					        <jc-address-picker 
					        :level='level'
					        :places='address.places' 
					        :visible.sync='visible'
					        @change='change'
					        ></jc-address-picker>
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">收货地址</view>
					<input placeholder-class="tui-phcolor" class="tui-input" v-model="address.desc" name="address" placeholder="请输入详细的收货地址" maxlength="50" type="text" />
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-cell-title">地址类型</view>
					<view class="tui-addr-label">
						<text v-for="(item,index) in lists" :data-type= 'item[0]' :key="item[0]" class="tui-label-item" :class="{'tui-label-active': item[0] == address.address_type}" @tap="selectAddressType">{{item[1]}}</text>
					</view>
				</view>
			</tui-list-cell>

			<!-- 默认地址 -->
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-swipe-cell">
					<view>设为默认地址</view>
					<switch :checked="address.default"  @change="switchChange" v-model="address.default" color="#30CC67" class="tui-switch-small" />
				</view>
			</tui-list-cell>
			<!-- 保存地址 -->
			<view class="tui-addr-save">
				<tui-button type="danger" height="88rpx" @click="confirm" :disabled="requesting">保存收货地址</tui-button>
			</view>
			<view class="tui-del" v-if="false">
				<tui-button type="gray" height="88rpx" :disabled="requesting">删除收货地址</tui-button>
			</view>
		</form>
	</view>
</template>

<script>
	import jcAddressPicker from '@/components/jc-address-picker/jc-address-picker'
	import tuiButton from "@/components/extend/button/button"
	import tuiListView from "@/components/list-view/list-view"
	import tuiListCell from "@/components/list-cell/list-cell"
	import tuiTips from "@/components/tips/tips"
	import api from "../../api.js"
	export default {
		components: {
			tuiButton,
			tuiListView,
			tuiListCell,
			jcAddressPicker,
			tuiTips
		},
		data() {
			return {
				lists: [['company', "公司"], ['home', "家"], ['other', "其他"]],
				selected: '请选择',
				visible: false,
				level: 3,
				requesting: false,
				address: {id: '', name: '', phone: '', address_type: '', default: false, address_code: '360824', places: ['江西省', '吉安市', '新干县']}
			}
		},
		onLoad:function(options){
			let _this = this
			if(options.id){
				api.address(options.id).then(function(data){
					_this.address = data
					console.log(data)
				})
			}
			
		},
		methods: {
			change(data){
				this.address.places = data.map(i=>i.name);
				console.log(data)
				this.address.address_code = data[data.length-1].id
			},
			showAddress(){
				this.visible = true;
			},
			switchChange(e){
				this.address.default = e.target.value
			},
			selectAddressType(e){
				this.address.address_type = e.currentTarget.dataset.type
			},
			confirm(){
				let _this = this
				if(!this.address.name){
					this.validMessage('请填写收货人')
					return 
				}
				if(!this.address.phone){
					this.validMessage('请填写手机号码')
					return 
				}
				if(!this.address.address_code){
					this.validMessage('请选择城市')
					return 
				}
				if(!this.address.desc){
					this.validMessage('请填写收获地址')
					return 
				}
				let addressHash = {
					name: this.address.name,
					phone: this.address.phone,
					address_code: this.address.address_code,
					address_type: this.address.address_type,
					default: this.address.default,
					desc: this.address.desc,
				}
				uni.showLoading({
					title: '请求中...'
				});
				this.requesting = true
				if(this.address.id){
					api.updateAddress(this.address.id, addressHash).then(function(data){
						uni.hideLoading()
						_this.requesting = false
						if(data.id){
							uni.redirectTo({
								url: '../address/index'
							})
						}
					}).catch(function(e){
						console.log(e)
					})
				}else{
					api.createAddress(addressHash).then(function(data){
						uni.hideLoading()
						_this.requesting = false
						if(data.id){
							uni.redirectTo({
								url: '../address/index'
							})
						}
					}).catch(function(e){
						console.log(e)
					})
				}
			},
			validMessage(msg){
				let options = {
					msg: msg,
					duration: 2000,
					type: 'danger'
				};
				this.$refs.toast.showTips(options);
			}
		}
	}
</script>

<style>
	.picker-view-column{
		text-align: center;
	}
	.tui-addr-box {
		padding: 20rpx 0;
	}

	.tui-line-cell {
		width: 100%;
		padding: 24rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-title {
		width: 180rpx;
		font-size: 28rpx;
	}

	.tui-title-city-text {
		width: 180rpx;
		height: 40rpx;
		display: block;
		line-height: 46rpx;
	}

	.tui-input {
		width: 500rpx;
	}

	.tui-input-city {
		flex: 1;
		height: 40rpx;
		font-size: 28rpx;
		padding-right: 30rpx;
	}

	.tui-phcolor {
		color: #ccc;
		font-size: 28rpx;
	}
	.tui-cell-title{
		font-size: 28rpx;
	}
	.tui-addr-label {
		margin-left: 70rpx;
	}

	.tui-label-item {
		width: 76rpx;
		height: 40rpx;
		border: 1rpx solid rgb(136, 136, 136);
		border-radius: 6rpx;
		font-size: 26rpx;
		text-align: center;
		line-height: 40rpx;
		margin-right: 20rpx;
		display: inline-block;
		transform: scale(0.9);
	}
	.tui-label-active{
		background: #E41F19;
		border-color:#E41F19;
		color: #fff;
	}
	.tui-swipe-cell {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		padding: 10rpx 24rpx;
		border-radius: 6rpx;
		overflow: hidden;
		font-size: 28rpx;
	}

	.tui-switch-small {
		transform: scale(0.8);
		transform-origin: 100% center;
	}

	/* #ifndef H5 */
	.tui-switch-small .wx-switch-input {
		margin: 0 !important;
	}

	/* #endif */

	/* #ifdef H5 */
	>>>uni-switch .uni-switch-input {
		margin-right: 0 !important;
	}

	/* #endif */

	.tui-addr-save {
		padding: 24rpx;
		margin-top: 100rpx;
	}

	.tui-del {
		padding: 24rpx;
	}
</style>
