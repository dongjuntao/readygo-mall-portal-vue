<template>
  <div class="seckill-list">
    <BaseHeader></BaseHeader>
    <Search />
    <!-- 秒杀时间段 -->
    <div class="promotion-decorate">限时秒杀</div>
    <ul class="time-line">
      <template v-for="(time, index) in list">
        <li v-if="index < 5" @click="currIndex = index" :key="index" :class="{'currTimeline': currIndex === index}">
          <div>{{time.isTomorrow ? "明日"+time.timeLine+':00' : time.timeLine+':00'}}</div>
          <div v-if="currIndex === index">
            <p>{{nowHour >= time.timeLine && !time.isTomorrow ? '秒杀中' : '即将开始'}}</p>
            <p>{{nowHour >= time.timeLine && !time.isTomorrow ? '距结束' : '距开始'}}&nbsp;{{currTime}}</p>
          </div>
          <div v-else class="not-curr">
            {{nowHour >= time.timeLine && !time.isTomorrow ? '秒杀中' : '即将开始'}}
          </div>
        </li>
      </template>
    </ul>
    <!-- 秒杀商品列表 -->
    <div class="goods-list">
      <empty v-if="goodsList.length === 0" />
      <div
        v-else
        class="goods-show-info"
        v-for="(item, index) in goodsList"
        :key="index"
        @click="goGoodsDetail(item.goodsSkuList[0].id, item.id)"
      >
        <div class="goods-show-img">
          <img width="220" height="220" :src="item.images.split(',')[0]" />
        </div>
        <div class="goods-show-price">
          <span>
            <span class="seckill-price text-danger">
              {{ item.seckillGoodsInfo.seckillGoodsSkuList[0].seckillPrice | unitPrice('￥') }}
            </span>
            <span style="color:#999;text-decoration:line-through;">{{item.goodsSkuList[0].originalPrice | unitPrice('￥')}}</span>
          </span>
        </div>
        <div class="goods-show-detail">
          <span>{{ item.name }}</span>
        </div>
        <div class="goods-seckill-btn" :class="{'goods-seckill-btn-gray' : nowHour < list[currIndex].timeLine}">{{nowHour >= list[currIndex].timeLine ? '立即抢购' : '即将开始'}}</div>
        <div class="goods-show-num">
          已售<Progress style="width:110px"  class="ml_10" :percent="Math.floor(item.salesNum/item.quantity)" />
        </div>
        <div class="goods-show-seller">
          <span>{{ item.storeName }}</span>
        </div>
      </div>
    </div>
    <BaseFooter />
  </div>
</template>
<script>
import { afterFiveBatch, getSeckillData } from '@/api/mall-admin/mall-homepage-data'
import {deleteOrder} from '@/api/mall-order/order'

export default {
  data () {
    return {
      list: [], // 秒杀时段列表
      goodsList: [], // 商品列表
      interval: null, // 定时器
      currIndex: 0, // 当前时间段的下标
      currTime: 0, // 当前显示的倒计时
      diffSeconds: 0, // 倒计时时间戳
      nowHour: new Date().getHours() // 当前小时数
    }
  },
  beforeDestroy () {
    // 销毁前清除定时器
    clearInterval(this.interval);
  },
  watch: {
    currIndex (val) {
      clearInterval(this.interval)
      this.interval = null
      this.nowHour = new Date().getHours()
      this.countDown(val)
      this.getSeckillData(this.list[val].dateTime)
    },
    diffSeconds (val) {
      const hours = Math.floor(val / 3600);
      // 当前秒数 / 60，向下取整
      // 获取到所有分钟数 3600 / 60 = 60分钟
      // 对60取模，超过小时数的分钟数
      const minutes = Math.floor(val / 60) % 60;
      // 当前的秒数 % 60，获取到 超过小时数、分钟数的秒数（秒数）
      const seconds = val % 60;
      this.currTime = filteTime(hours) + ':' + filteTime(minutes) + ':' + filteTime(seconds)
      if (val <= 0) {
        clearInterval(this.interval)
        this.interval = null;
        //当前这轮秒杀结束，弹出提示信息，用户确认后刷新页面，重新加载数据
        this.$Modal.confirm({
          title: '秒杀结束',
          content: '本轮秒杀结束，请关注下一轮秒杀</p>',
          onOk: () => {
            this.afterFiveBatch();
          },
          onCancel: () => {}
        });

      }
      function filteTime (time) {
        if (time < 10) {
          return '0' + time
        } else {
          return time
        }
      }
    }
  },
  methods: {
    //获取首页秒杀数据
    getSeckillData (dateTime) {
      var params = this.axios.paramsHandler({dateTime: !dateTime?null:dateTime})
      getSeckillData(params).then(({data}) => {
        if (data && data.code == '200') {
          this.goodsList = data.data[0].data
        }
      });
    },
    // 获取分类数据
    afterFiveBatch () {
      afterFiveBatch().then(({data}) => {
        if (data && data.code == '200') {
          var result = data.data;
          var list = [];
          for (var i=0; i<result.length; i++) {
            var dateTime = result[i];
            list.push({
              timeLine: getTimeLine(dateTime).hour,
              isTomorrow: getTimeLine(dateTime).isTomorrow,
              dateTime: dateTime
            });
          }
          this.list = list;
          this.countDown(this.currIndex)
          this.getSeckillData(result[0]);//进入页面默认显示正在秒杀中的数据
        }
      });
    },

    goGoodsDetail (skuId, id) {
      // 跳转商品详情
      let routeUrl = this.$router.resolve({
        path: '/goodsDetail',
        query: { skuId, id }
      });
      window.open(routeUrl.href, '_blank');
    },
    countDown (currIndex) { // 倒计时
      // 0点时间戳
      let zeroTime = new Date(new Date().toLocaleDateString()).getTime();
      let currTime = new Date().getTime()
      let actTime = 0;
      let nowHour = new Date().getHours(); // 当前小时数
      if (nowHour < this.list[currIndex].timeLine) { // 活动未开始（即将开始）
        actTime = zeroTime + this.list[currIndex].timeLine * 3600 * 1000
      } else if (nowHour >= this.list[currIndex].timeLine && !this.list[currIndex].isTomorrow) { // 活动进行中（当日内）
        actTime = zeroTime + (this.list[currIndex].timeLine+2) * 3600 * 1000 //当日内每个批次两小时，所以加2小时作为结束时间
      } else if (nowHour >= this.list[currIndex].timeLine && this.list[currIndex].isTomorrow) { // 次日凌晨
        actTime = zeroTime + (this.list[currIndex].timeLine+24) * 3600 * 1000
      }
      this.diffSeconds = Math.floor((actTime - currTime) / 1000)
      this.interval = setInterval(() => {
        this.diffSeconds--
      }, 1000)
    }
  },

  mounted () {
    this.afterFiveBatch()
  }
}

function getTimeLine(dateTime) {
  var newDateTime = new Date(dateTime);
  var hour = newDateTime.getHours();
  var date = newDateTime.getDate();
  //表示不是同一天，是次日
  if (date != (new Date()).getDate()) {
    return {
      isTomorrow: true,
      hour: hour%2==0 ? hour : hour - 1
    }
  }else {
    return {
      isTomorrow: false,
      hour: hour%2==0 ? hour : hour - 1
    }
  }
}

</script>
<style lang="scss" scoped>
@import '../../assets/styles/goodsList.scss';
.goods-seckill-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 80px;
  color: #fff;
  height: 35px;
  text-align: center;
  line-height: 35px;
  font-size: 14px;
  background-color: $theme_color;
}
.goods-seckill-btn-gray {
  background-color: #666;
}
.promotion-decorate::before,.promotion-decorate::after{
  background-image: url('/src/assets/images/sprite@2x.png');
}
.time-line{
  width: 1200px;
  height: 60px;
  margin: 0 auto;
  background-color: #fff;
  display: flex;
  li{
    padding: 0 30px;
    font-size: 16px;
    font-weight: bold;
    width: 240px;
    height: 100%;
    display: flex;
    align-items: center;
    &:hover{
      cursor: pointer;
    }
    .not-curr {
      border: 1px solid #999;
      border-radius: 20px;
      padding: 3px 10px;
      margin-left: 15px;
      font-size: 12px;
      font-weight: normal;
    }
  }
  .currTimeline{
    background-color: $theme_color;
    color: #fff;
    >div:nth-child(1) {
      font-size: 15px;
    }
    >div:nth-child(2) {
      font-size: 14px;
      margin-left: 15px;
    }
  }
}
</style>
