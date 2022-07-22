<template>
  <div>
    <div class="wrapper" :style="{right:handleDrawer ? '300px' : '0px'}">

      <div class="barItem" @click="clickBar(item)" v-for="(item,index) in resetConfig.menuList" :key="index">
        <Tooltip placement="left" :content="item.title">
          <Icon size="20" :type="item.icon"/>
          <p class="barTitle" v-if="item.titleShow"> {{item.title}}</p>
          <div class="circle" v-if="item.title === '购物车'">
            {{cartNum < 100 ? cartNum : 99}}
          </div>
        </Tooltip>
      </div>

    </div>
    <Drawer width="300" class="popup" :title="drawerData.title" :mask="resetConfig.mask" :closable="resetConfig.closable"
      v-model="handleDrawer">
      <drawerPage :title="drawerData.title" />
    </Drawer>
  </div>
</template>

<script>
import Storage from '@/plugins/storage.js';
import Configuration from './config';
import drawerPage from './Drawer'
import {cartCount} from '@/api/cart.js'
import {getUserInfo} from '@/utils/auth'
import {getCartList} from '@/api/mall-cart/cart'
export default {
  name: 'Main',
  data () {
    return {
      resetConfig: Configuration, // 菜单项
      handleDrawer: false, // 是否可展开
      drawerData: '', // 菜单基础数据
      userInfo: {}, //用户信息
      cartNum: 0 //购物车数量
    }
  },
  components: {drawerPage},

  created () {
    this.getCartList();
  },
  methods: {

    clickBar (val) { // tabbar点击操作
      if (!this.userInfo) {
        this.$Modal.confirm({
          title: '请登录',
          content: '<p>请登录后执行此操作</p>',
          okText: '立即登录',
          cancelText: '继续浏览',
          onOk: () => {
            this.$router.push({
              path: '/login',
              query: {
                rePath: this.$router.history.current.path,
                query: JSON.stringify(this.$router.history.current.query)
              }
            });
          }
        });
      } else {
        if (val.display) {
          this.handleDrawer = true
          this.drawerData = val
        } else {
          this.handleDrawer = false
          switch (val.title) {
            case '会员中心':
              this.openBlank('/home')
              break;
            case '我的资产':
              this.openBlank('/home/MoneyManagement')
              break;
          }
        }
      }
    },
    openBlank (path) { // 新页面打开地址
      let routerUrl = this.$router.resolve({
        path: path
      })
      window.open(routerUrl.href, '_blank')
    },
    getCartList () { // 获取购物车列表
      var params = this.axios.paramsHandler({})
      getCartList(params).then(({data}) => {
        if (data && data.code=='200') {
          var result = data.data.cartMerchantList;
          if (result) {
            this.cartNum = data.data.checkedTotalCount
          }
        }
      });
    },

    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.userInfo = userInfo;
    }
  }
}
</script>

<style scoped lang="scss">
  .wrapper {
    background-color: #000!important;
  }
  .barItem {
    text-align: center;
    padding: 13px 0;

    cursor: pointer;
    color: #fff;
    &:hover{
      background-color: $theme_color;
      .circle{
        color: $theme_color;
        background-color: #fff;
      }
    }
  }

  .barTitle {
    writing-mode: vertical-lr;
    letter-spacing: 2px;
    padding: 4px 0;

  }

  .circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    color: #fff;
    background: $theme_color;
  }

  .wrapper {
    width: 40px;
    position: fixed;
    transition: .35s;
    height: 100%;
    z-index: 9999;
    background: $dark_background_color;
    top: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  /deep/.popup .ivu-drawer-body{
    padding: 0!important;
    background-color: #eee;
  }
  /deep/.popup .ivu-drawer-wrap{
    z-index: 3001;
  }
</style>
