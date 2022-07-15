<template>
  <div class="wrapper">
    <BaseHeader></BaseHeader>
    <div class="wrapper-head">
      <div class="head-left">
        <div class="left-tips">订单提交成功，请尽快付款！</div>
        <div class="left-tips-time">请您尽快完成支付，否则订单会被自动取消</div>
        <div class="left-tips-count-down">
          <mv-count-down :startTime="startTime" class="count-down"
            :endTime="overtime"
            :endText="endText"
            :dayTxt="'天'"
            :hourTxt="'小时'"
            :minutesTxt="'分钟'"
            :secondsTxt="'秒'"
            :isStart="isStart"></mv-count-down>

        </div>
      </div>
      <div class="head-right">
        <div>应付金额 <span class="price">{{ finalPrice | unitPrice }}</span>元</div>
      </div>
    </div>
    <div class="wrapper-box" v-for="payType in payTypeList">
      <div v-if="payType.type=='ALI_PAY'" class="-box-item" @click="handlePay('ALIPAY')">
        <img
          :src="payType.logo"
          alt="">
        <span>支付宝</span>
      </div>
      <div v-if="payType.type=='WECHAT_PAY'" class="-box-item" @click="handlePay('WECHAT_APY')">
        <img
          :src="payType.logo"
          alt="">
        <span>微信</span>
      </div>
<!--      <div v-if="support.includes('WALLET') && $route.query.orderType !== 'RECHARGE'" class="-box-item" @click="handlePay('WALLET')">-->
<!--        <Icon custom="icomoon icon-wallet" size="60"/>-->
<!--        <span>余额支付</span>-->
<!--        <span>当前剩余({{ walletValue | unitPrice('￥') }})</span>-->
<!--      </div>-->
    </div>
    <BaseFooter></BaseFooter>
  </div>
</template>
<script>

import {tradeDetail, pay} from '@/api/pay.js';
import MvCountDown from 'mv-count-down'
import {Message} from 'view-design';

import { tradePayInfo } from '@/api/mall-order/trade'

export default {
  components: {
    MvCountDown
  },
  data () {
    return {
      payDetail: {}, // 支付详情
      support: [], // 支持配送方式
      walletValue: 0, // 当前余额
      qrcode: '', // 支付二维码
      startTime: new Date().getTime(), // 开始时间（时间戳）
      endTime: 0, // 完成的时间（时间戳）
      endText: '订单已超时取消', // 倒计时完成的提示文本
      isStart: false, // 控制倒计时开始的时机（异步请求完成开启）
      //-------------------新增-----------------------------
      tradeTime: null,
      overtime: null,
      finalPrice: null,
      payTypeList: []
    };
  },
  methods: {
    //新增的---------------------------
    //交易信息
    getTradePayInfo() {
      var params = this.axios.paramsHandler({
        code: this.$route.query.code, //交易号
        orderType: this.$route.query.orderType,
        orderCode:  this.$route.query.orderCode //订单号
      });
      tradePayInfo(params).then(({data}) => {
        if (data && data.code=='200') {
          this.isStart = true
          this.tradeTime = data.data.tradeTime;
          this.overtime = new Date(data.data.overtime).getTime();
          this.finalPrice = data.data.finalPrice;
          this.payTypeList = data.data.payTypeList
        }
      });
    },

    // 支付
    handlePay (payType) {
      this.$router.push({
        path: '/qrpay',
        query: {
          payType: payType,
          orderType: this.$route.query.orderType,
          tradeCode: this.$route.query.code,
          orderCode: this.$route.query.orderCode
        }
      });
    }
  },
  mounted () {
    this.getTradePayInfo()
  }
};
</script>
<style scoped lang="scss">
.head-left {
  font-weight: bold;
}

.left-tips {
  font-size: 21px;

}
.-box-item {
  display: flex;
  font-size: 18px;
  font-weight: bold;
  align-items: center;
  margin: 20px 20px;
  cursor: pointer;
  @include content_color($light_content_color);

  &:hover {
    color: $theme_color;
  }

  > span {
    margin-left: 15px;
  }

  > img {
    border-radius: 10px;
    width: 60px;
    height: 60px;
  }
}

.left-tips-time {
  font-size: 16px;
}

.left-tips-count-down {
  font-size: 10px;
  color: red;
}

.wrapper-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.75;
}

.wrapper-head,
.wrapper-box {
  padding: 20px 40px;
  width: 1200px;
  margin: 20px auto;
}

.wrapper-box {
  @include white_background_color();
  height: auto;
}

.wrapper {
  width: 100%;
  height: 100%;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: $theme_color;
}

.head-right {
  font-weight: bold;
  font-size: 18px;
}
.count-down{
  font-size: 16px!important;
}
</style>
