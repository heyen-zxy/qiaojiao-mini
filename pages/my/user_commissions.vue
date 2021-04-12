<template>
	<view class="container">
		<tui-swipe-action @click="handlerButton" v-for="(commission,index) in commissions"
		 :key="index" :params="item">
			<template v-slot:content>
				<view class="list-item">
					<view class="item-box">
						<view class="item-title" :style="{'color': commission.view_commission > 0 ? '#19BE6B' : '#e41f19'}">{{commission.get_commission_type}}: {{commission.view_commission > 0 ? '+' : ''}} {{commission.view_commission}}</view>
						<view class="item-time">账户余额：{{commission.view_commission_after}}</view>
					</view>
					<view class="tui-msg-right">
						<view class="tui-msg-time">{{commission.updated_at}}</view>
					</view>
				</view>
			</template>
		</tui-swipe-action>
		<!--加载loadding-->
		<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
		<tui-nomore :visible="!pullUpOn" bgcolor="#fafafa"></tui-nomore>
		<!--加载loadding-->
	</view>
</template>

<script>
	import tuiSwipeAction from "@/components/swipe-action/swipe-action"
	import tuiLoadmore from "@/components/loadmore/loadmore"
	import tuiNomore from "@/components/nomore/nomore"
	import api from "../../api.js"
	export default {
		components:{
			tuiSwipeAction,
			tuiLoadmore,
			tuiNomore
		},
		data() {
			return {
				commissions: [],
				page: 1,
				cash: '',
				loadding: false,
				pullUpOn: true
			}
		},
		onLoad(){
			let _this = this
			_this.getData()
		},
		methods: {
			onReachBottom() {
				if(this.loadding){
					return
				}
				//只是测试效果，逻辑以实际数据为准
				this.loadding = true
				this.pullUpOn = true
				this.page =  this.page + 1
				this.getData()
				console.log(1111)
			},
			getData(){
				let _this = this
				api.userCommissions(this.page).then(function(data){
					if(data){
						_this.commissions = _this.commissions.concat(data)
					}
					_this.loadding = false
					_this.pullUpOn = false
				}).catch(function(e){
					console.log(e)
				})
			}
		}
	}
</script>

<style>
	.container {
		background: #fff;
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.red {
		color: #e41f19
	}
	
	.green {
		color: #19BE6B
	}

	.list-item {
		padding: 30upx 30upx;
		display: flex;
		align-items: item;
	}

	.item-img {
		height: 120upx;
		width: 120upx;
		margin-right: 20upx;
		display: block
	}

	.item-box {
		flex: 1;
		width: 70%;
		display: flex;
		flex-direction: column;
		justify-content: space-between
	}

	.item-title {
		font-size: 32upx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

	}

	.item-time {
		color: #999;
		font-size: 24upx;
	}
	
	.tui-msg-right {
		max-width: 120upx;
		height: 88upx;
		margin-left: auto;
		text-align: right;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
	}
</style>
