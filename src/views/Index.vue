<template>
  <div class="container">
    <drawer></drawer>
    <!-- 固定头部 -->
    <hover-search class="hover-search" :class="{show: topSearchShow}"></hover-search>
    <!-- 头部 包括登录，我的订单等 -->
    <BaseHeader></BaseHeader>
    <!-- 搜索框、logo -->
    <Search></Search>
    <!-- 商品分类 -->
    <cateNav :showAlways="true" v-if="showNav" :large="carouselLarge" :opacity="carouselOpacity"></cateNav>
    <!-- 楼层装修部分 -->
    <model-form ref="modelForm" :data="modelForm"></model-form>
    <!-- 底部栏 -->
    <BaseFooter></BaseFooter>
  </div>
</template>

<script>
import Search from '@/components/Search';
import ModelForm from '@/components/indexDecorate/ModelForm';
import HoverSearch from '@/components/header/hoverSearch';
import { getNavbarData, getCarouselData, getPlateData, getSeckillData } from '@/api/mall-admin/mall-homepage-data'
import {seckillByDay} from '@/api/promotion'

export default {
  name: 'Index',
  mounted () {

    this.getNavbarData();
    this.getCarouselData();
    this.getPlateData();
    this.getSeckillData();

    let that = this;
    window.onscroll = function () {
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      if (top > 300) {
        that.topSearchShow = true;
      } else {
        that.topSearchShow = false;
      }
    };
  },
  data () {
    return {
      // modelForm: { list: [] }, // 楼层装修数据
      modelForm: [], //楼层装修数据
      topAdvert: {}, // 顶部广告
      showNav: true, // 是否展示分类栏
      topSearchShow: false, // 滚动后顶部搜索栏展示
      carouselLarge: false, // 不同轮播分类尺寸
      carouselOpacity: false // 不同轮播分类样式
    };
  },
  methods: {
    //获取首页导航数据
    getNavbarData () {
      getNavbarData().then(({data}) => {
        if (data && data.code == '200') {
          for (var i=0; i<data.data.length; i++) {
            this.modelForm.push(data.data[i])
          }
          sessionStorage.setItem("navList", JSON.stringify(data.data[0]) )
        }
      });
    },
    // 获取首页轮播图数据
    getCarouselData () {
      getCarouselData().then(({data}) => {
        if (data && data.code == '200') {
          for (var i=0; i<data.data.length; i++) {
            this.modelForm.push(data.data[i])
          }
        }
      });
    },
    //获取首页板块数据
    getPlateData () {
      getPlateData().then(({data}) => {
        if (data && data.code == '200') {
          for (var i=0; i<data.data.length; i++) {
            this.modelForm.push(data.data[i])
          }
        }
      });
    },

    //获取首页秒杀数据
    getSeckillData () {
      getSeckillData().then(({data}) => {
        if (data && data.code == '200') {
          for (var i=0; i<data.data.length; i++) {
            this.modelForm.push(data.data[i])
          }
        }
      });
    }


  },
  components: {
    Search,
    ModelForm,
    HoverSearch
  }
};
</script>

<style scoped lang="scss">
.container {
  @include sub_background_color($light_background_color);
}
</style>
<style>
.hover-search {
  width: 100%;
  height: 60px;
  transform: translateY(-200px);
  background-color: #fff;
  position: fixed;
  top: 0;
  z-index: 3000;
  box-shadow:0 0 10px 2px rgb(90 90 90 / 60%);
  transition: 0.35s;
}
.show {
  transform: translateY(0);
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  top: 0;
}
</style>
