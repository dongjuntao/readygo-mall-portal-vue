<template>
  <div>
    <card _Title="收货地址" _More="添加新地址" _Src="/home/addAddress"></card>
    <div class="address-box" v-for="(item, index) in list" :key="index">
      <div class="address-header">
        <span>
          {{ item.name }}
          <Tag class="ml_10" v-if="item.isDefault" color="red">默认地址</Tag>
          <Tag class="ml_10" v-if="item.addressAlias" color="warning">{{item.addressAlias}}</Tag>
        </span>
        <div class="address-action">
          <span v-if="!item.isDefault" @click="setDefault(item.id,true)"><Icon type="edit"></Icon>设为默认</span>
          <span v-if="item.isDefault" @click="setDefault(item.id,false)"><Icon type="edit"></Icon>取消默认</span>
          <span @click="edit(item.id)"><Icon type="edit"></Icon>修改</span>
          <span @click="del(item.id)"><Icon type="trash-a"></Icon>删除</span>
        </div>
      </div>
      <div class="address-content">
        <p>
          <span class="address-content-title"> 收 货 人 ：</span> {{ item.name }}
        </p>
        <p>
          <span class="address-content-title">收货地区：</span
          >{{ item.regionNames }}
        </p>
        <p>
          <span class="address-content-title">详细地址：</span> {{ item.detailAddress }}
        </p>
        <p>
          <span class="address-content-title">手机号码：</span> {{ item.mobile }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card';
import { getRecipientInfoList, updateIsDefault, deleteRecipientInfo } from "@/api/mall-member/recipient-info";
import { getUserInfo } from "@/utils/auth";

export default {
  name: 'MyAddress',

  data () {
    return {
      list: [], // 地址列表
      userInfo: {
        userId: 0
      }
    };
  },
  methods: {

    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.userInfo = userInfo;
    },

    edit (id) {
      // 编辑地址
      this.$router.push({ path: '/home/addAddress', query: { id: id } });
    },
    del (id) {
      // 删除地址
      this.$Modal.confirm({
        title: '提示',
        content: '你确定删除这个收货地址',
        onOk: () => {
          var params =  this.axios.paramsHandler({id: id});
          deleteRecipientInfo(params).then(({data}) => {
            if (data && data.code=='200') {
              this.$Message.success('删除成功');
              this.getRecipientInfoList();
            } else {
              this.$Message.error('删除失败');
            }
          });
        },
        onCancel: () => {
          this.$Message.info('取消删除');
        }
      });
    },

    //获取收货信息
    getRecipientInfoList() {
      var params = this.axios.paramsHandler({});
      getRecipientInfoList(params).then(({data}) => {
        if (data && data.code === "200") {
          this.list = data.data;
        }
      });
    },

    /**
     * 设为默认 1/ 取消默认2
     */
    setDefault(id, isDefault){
      var params =  this.axios.paramsHandler({
        id: id,
        isDefault: isDefault
      });
      updateIsDefault(params).then(({data}) => {
        if (data && data.code === "200") {
          this.$Message.success('设置成功');
          this.getRecipientInfoList();
        } else {
          this.$Message.error(data.message)
        }
      });
    },
  },
  mounted () {
    this.getUserInfo()
    this.getRecipientInfoList();
  }
};
</script>

<style scoped lang="scss">
.address-box {
  padding: 15px;
  margin: 15px;

  border-bottom: 1px solid $border_color;
}

.address-header {
  cursor: pointer;
  height: 35px;
  display: flex;
  justify-content: space-between;
  @include title_color($light_title_color);
  font-size: 18px;
}

.address-content {
  cursor: pointer;
  font-size: 14px;

  > p {
    padding: 12px 0;
  }
}

.address-content-title {

}

.address-action span {
  margin-left: 15px;
  font-size: 14px;
  color: $theme_color;
  cursor: pointer;
}

#map-container {
  width: 500px;
  height: 300px;
}
</style>
