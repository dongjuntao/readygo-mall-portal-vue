<template>
  <div class="newGoodsSort">
    <div class="newGoodsSort-div">
      <div class="head-newGoodsSort" :style="{ background: newGoodsSort.bgColor }">
        <span>{{ newGoodsSort.name }}</span>
        <span class="hover-pointer" @click="linkTo(newGoodsSort.url)">{{ newGoodsSort.secondName }}&gt;</span>
      </div>
      <div class="newGoodsSort-content">
        <template v-for="(item, index) in newGoodsSort.data">
          <div v-if="item" :key="index" @click="goGoodsDetail(item.goodsSkuList[0].id, item.id)" class="hover-pointer">
            <img :src="item.images.split(',')[0]" width="90" height="90" alt="" />
            <div>
              <div>{{ item.name.length>50 ? item.name.substring(0,50)+"..." : item.name }}</div>
              <div style="color: red;">¥ {{ item.goodsSkuList[0].sellingPrice }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      newGoodsSort: this.data //商品推荐
    };
  },
  methods: {
    goGoodsDetail (skuId, goodsId) {
      // 跳转商品详情
      let routeUrl = this.$router.resolve({
        path: '/goodsDetail',
        query: { skuId: skuId, id: goodsId }
      });
      window.open(routeUrl.href, '_blank');
    }
  }
};
</script>
<style lang="scss" scoped>
.newGoodsSort {
  display: flex;
  justify-content: space-between;
  .newGoodsSort-div {
    width: 100%;
    .newGoodsSort-content {
      display: flex;
      padding-top: 10px;
      font-size: 12px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      > div {
        display: flex;
        align-items: center;
        width: 240px;
        height: 120px;
        img {
          margin: 0 10px;
        }
        > div:nth-child(2) {
          :nth-child(2) {
            color: #449dae;
          }
        }
      }
    }
  }
  .head-newGoodsSort {
    display: flex;
    opacity: 90%;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 10px;
    background: #f64494;
    color: #fff;
    span:nth-child(1) {
      font-size: 20px;
    }
    span:nth-child(2) {
      font-size: 12px;
    }
  }
}
</style>
