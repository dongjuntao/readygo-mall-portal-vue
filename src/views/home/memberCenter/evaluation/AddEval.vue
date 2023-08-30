<template>
  <div class="add-eval">
    <div class="title">
      <card _Title="订单评价" :_Size="16"></card>
      <p>
        <span class="color999">订单号：</span><span>{{ $route.query.subCode }}</span>
        <span class="color999 ml_20" v-if="orderDetail">{{ orderDetail.createTime | formatDateTime }}</span>
      </p>
    </div>
    <!-- 物流评分、服务评分 -->
    <div class="delivery-rate">
      <div class="fontsize_16">物流服务评价：</div>
      <div class="color999">
        <span>物流评价：<Rate v-model="form.logisticsEvaluationLevel" /></span>
        <span>服务评价：<Rate v-model="form.serviceEvaluationLevel" /></span>
        <span>描述评价：<Rate v-model="form.descriptionEvaluationLevel" /></span>
      </div>
    </div>
    <!-- 添加订单评价  左侧商品详情  右侧评价框 -->
    <ul class="goods-eval">
      <li >
        <div class="goods-con">
          <img :src="orderDetail.goodsImage" class="hover-pointer" alt="" width="100" @click="goGoodsDetail(orderDetail.goodsSkuId, orderDetail.goodsId)">
          <p class="hover-pointer color999" @click="goGoodsDetail(orderDetail.goodsSkuId, orderDetail.goodsId)">{{orderDetail.goodsName}}</p>
          <p>{{orderDetail.goodsSellingPrice | unitPrice('￥')}}</p>
        </div>

        <div class="eval-con">
          <div>
            <span class="color999">商品评价：</span>
            <RadioGroup style="margin-bottom:5px;color:#999" v-model="form.goodsEvaluationLevel" type="button" button-style="solid">
              <Radio :label="3">好评</Radio>
              <Radio :label="2">中评</Radio>
              <Radio :label="1">差评</Radio>
            </RadioGroup>
            <Input type="textarea" maxlength="500" show-word-limit :rows="4" v-model="form.evaluateContent" />
          </div>
          <div style="display:flex;align-items:center;">
            <div class="demo-upload-list" v-for="(img, index) in form.uploadList" :key="index">
              <img :src="img">
              <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(img)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
              </div>
            </div>
            <Upload
              action="#"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :before-upload="handleBeforeUpload"
              :format="['jpg','jpeg','png']"
              :headers="accessToken"
              style="display: inline-block;width:58px;">
              <div class="hover-pointer icon-upload" style="">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
          </div>
        </div>
      </li>
    </ul>
    <Button type="primary" class="mt_10" :loading="loading" @click="save">发表</Button>
    <Modal title="View Image" v-model="visible">
        <img :src="previewImage" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import storage from '@/plugins/storage';
import { getOrderDetailByParams } from '@/api/mall-order/order'
import { commentConstant } from '@/utils/constant'
import { fileUpload } from '@/api/mall-file/file'
import { saveEvaluation } from '@/api/mall-goods/evaluation'

export default {
  data () {
    return {
      orderDetail: {}, //订单商品详情
      form: { // 评分展示
        logisticsEvaluationLevel: 5, //物流评价
        serviceEvaluationLevel: 5, //服务评价
        descriptionEvaluationLevel: 5, //描述评价
        goodsEvaluationLevel: 3, //好中差评
        evaluateContent: '', //评价内容
        uploadList: [] //上传的图片
      }, // 表单
      visible: false, // 图片预览
      accessToken: {}, // 验证token
      previewImage: '', // 预览图片地址
      loading: false // 提交加载状态
    }
  },
  methods: {
    getOrderDetail () { // 获取订单详情
      var params = this.axios.paramsHandler({subCode: this.$route.query.subCode});
      getOrderDetailByParams(params).then(({data}) => {
        this.orderDetail = data.data;
        this.form.uploadList = []
      })
    },

    save () { // 保存评价
      if (!this.form.logisticsEvaluationLevel || !this.form.serviceEvaluationLevel) {
        this.$Message.warning('物流服务评价不能为空')
        return false;
      }
      if (!this.form.descriptionEvaluationLevel) {
        this.$Message.warning('描述评价不能为空')
      }
      this.loading = true;
      let params = {
        goodsId: this.orderDetail.goodsId,
        skuId: this.orderDetail.goodsSkuId,
        merchantId: this.$route.query.merchantId,
        logisticsEvaluationLevel: this.form.descriptionEvaluationLevel,
        serviceEvaluationLevel: this.form.serviceEvaluationLevel,
        descriptionEvaluationLevel: this.form.descriptionEvaluationLevel,
        goodsEvaluationLevel: this.form.goodsEvaluationLevel,
        evaluateContent: this.form.evaluateContent,
        images: this.form.uploadList.toString(),
        orderCode: this.$route.query.code,
        subOrderCode: this.$route.query.subCode
      }
      var postData = this.axios.dataHandler(params);
      saveEvaluation(postData).then(({data}) => {
        this.loading = false
        if (data && data.code == 200) {
          this.$Message.success('评价成功')
          this.$router.push('/home/CommentList')
        }
      }).catch(() => {
        this.loading = false;
      })
    },
    goGoodsDetail (skuId, goodsId) { // 跳转商品详情
      let routerUrl = this.$router.resolve({
        path: '/goodsDetail',
        query: { skuId: skuId, id: goodsId }
      })
      window.open(routerUrl.href, '_blank')
    },
    handleView (name) { // 预览图片
      this.previewImage = name;
      this.visible = true;
    },
    handleRemove (index) { // 移除图片
      this.form.uploadList.splice(index, 1)
      this.$forceUpdate()
    },
    handleSuccess (res, file) { // 上传成功回调
      this.form.uploadList.push(res.result)
      this.$forceUpdate()
    },

    /**
     * 上传前校验文件
     */
    handleBeforeUpload(file){
      const check = this.form.uploadList.length < 9;
      if (!check) {
        this.$Message.warning('最多可以上传九张图片');
        return check;
      }
      this.file = file;
      const isImg = (file.size / 1024 / 1024) < 3
      const isType = file.type === "image/png"
      const isType2 = file.type === "image/jpeg"
      if (!isImg) {
        this.$Message.error('上传图片大小不能超过 3MB!')
      } else if (!isType && !isType2) {
        this.$Message.error('上传图片格式为png或jpg')
      } else {
        let formData = new FormData();
        formData.append("files", this.file);
        var params = this.axios.paramsHandler({ folderName: commentConstant.comment_pictures_folder_name })
        fileUpload(formData, params).then(({data}) => {
          this.form.uploadList.push(data.data)
          this.$forceUpdate()
        })
      }
      return false
    }

  },
  mounted () {
    window.scrollTo(0, 0)
    this.accessToken.accessToken = storage.getItem('accessToken');
    this.getOrderDetail()
  }
}
</script>
<style lang="scss" scoped>
.delivery-rate {
  display: flex;
  align-items: center;
  margin-top: 20px;
  height: 50px;
  border-bottom: 1px solid #eee;
  >div:nth-child(1) {
    width: 120px;
    font-weight: bold;
  }
}
.goods-eval li{
  display: flex;
  border-bottom: 1px solid #eee;

  .goods-con {
    width: 30%;
    padding: 20px;
    text-align: center;
    p {
      word-wrap: wrap;
      &:hover{ color: $theme_color; }
    }
  }
  .eval-con {
    width: 70%;
    padding: 20px;
  }
}

.demo-upload-list{
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
  margin-top: 10px;
}
.demo-upload-list img{
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
  display: block;
}
.demo-upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.icon-upload {
  width: 58px;
  height:58px;
  line-height: 58px;
  text-align:center;
  display: inline-block;
  border:1px dashed #999;
  border-radius: 4px;
  margin-top: 10px;
  &:hover{
    cursor: pointer;
    border-color: $theme_color;
  }
}
</style>
