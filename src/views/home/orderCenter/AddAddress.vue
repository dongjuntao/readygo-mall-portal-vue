<template>
  <div>
    <card _Title="收货地址" />
    <div class="add-box">
      <Form :model="formData" ref="form" label-position="left" :label-width="100" :rules="rules">
        <FormItem label="收件人" prop="name">
          <i-input v-model="formData.name" placeholder="请输入收件人姓名" style="width: 600px"></i-input>
        </FormItem>
        <FormItem label="收件地区" prop="regions">
          <Select v-model="province" placeholder="请选择省份" style="width:198px" @on-change="getCity()">
            <Option v-for="item in provinceList" :value="item.id" :key="item.id" :label="item.name"></Option>
          </Select>
          <Select v-model="city" placeholder="请选择城市"  style="width:198px" @on-change="getArea()">
            <Option v-for="item in cityList" :value="item.id" :key="item.id" :label="item.name"></Option>
          </Select>
          <Select v-model="area" placeholder="请选择区县"  style="width:198px">
            <Option v-for="item in areaList" :value="item.id" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="详细地址" prop="detailAddress">
          <i-input v-model="formData.detailAddress" placeholder="请输入详细地址" style="width: 600px"></i-input>
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <i-input v-model="formData.mobile" placeholder="请输入收件人手机号" style="width: 600px"></i-input>
        </FormItem>
        <FormItem label="地址别名" prop="addressAlias">
          <i-input v-model="formData.addressAlias" length :maxlength="4" placeholder="请输入地址别名，例如公司" style="width: 600px">
          </i-input>
        </FormItem>
        <FormItem label="默认地址">
          <i-switch v-model="formData.isDefault" />
        </FormItem>
      </Form>
    </div>
    <div class="mt_20">
      <Button type="primary" class="mr_10" :loading="loading" @click="save">保存收货地址</Button>
      <Button @click="$router.back()">返回</Button>
    </div>
  </div>
</template>

<script>
import card from "@/components/card";
import { isMobile } from '@/utils/validate'
import { saveRecipientInfo, updateRecipientInfo, getRecipientInfoById} from "@/api/mall-member/recipient-info";
import { getRegionList } from '@/api/mall-admin/mall-region'
import { getUserInfo } from '@/utils/auth'

export default {
  name: "AddAddress",
  data() {
    //检验手机号
    var validateMobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      }else if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    var validateRegions = (rule, value, callback) => {
      if (!this.province){
        callback(new Error('请选择省份'));
      }else if(!this.city){
        callback(new Error('请选择城市'));
      }else if(!this.area){
        callback(new Error('请选择区县'));
      }else {
        callback()
      }
    }
    return {
      formData: {
        name: "", //收件人姓名
        regions: '',
        detailAddress: "", //详细地址
        mobile: "", //手机号码
        addressAlias: "", //地址别名
        isDefault: false, //是否默认
        memberId: null //会员id
      },
      provinceList: [], //省份
      province:"", //已选省份
      cityList: [], //城市
      city: "", //已选城市
      areaList: [], //区县
      area: "", //已选区县
      rules: {
        // 验证规则
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        detailAddress: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
        mobile: [{ required: true, validator: validateMobile, trigger: 'blur' }],
        regions: [{ required: true, validator:validateRegions, trigger: 'blur' }]
      },
      userInfo: {}, //当前登录用户信息
      loading: false // 加载状态
    };
  },
  methods: {
    //保存收货地址
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          var data = this.axios.dataHandler({
            id: this.formData.id || undefined,
            name: this.formData.name,
            regions: this.province+","+this.city+","+this.area,
            detailAddress: this.formData.detailAddress,
            mobile: this.formData.mobile,
            addressAlias: this.formData.addressAlias,
            memberId: this.userInfo.userId,//当前登录人id
            isDefault: this.formData.isDefault,
          })
          this.loading = true;
          var saveOrUpdate = this.$route.query.id ? updateRecipientInfo : saveRecipientInfo;
          saveOrUpdate(data).then(({data}) => {
            if (data && data.code === "200") {
              this.loading = false;
              this.$router.push("/home/MyAddress");
            } else {
              this.$Message.error(data.message)
            }
          });
        }
      });
    },

    //获取收货信息详情
    getRecipientInfoById(id) {
      var that = this
      var params = this.axios.paramsHandler({id: this.$route.query.id})
      getRecipientInfoById(params).then(async function ({data}) {
        if (data && data.code=='200') {
          that.formData = data.data;
          that.province = parseInt(data.data.regions.split(",")[0]);
          await that.getCity();
          that.city = parseInt(data.data.regions.split(",")[1]);
          await that.getArea();
          that.area = parseInt(data.data.regions.split(",")[2]);
        }
      });
    },

    //获取省份信息
    getProvinceData() {
      var params = this.axios.paramsHandler({parent_id: 0},false)
      getRegionList(params).then(({data}) => {
        if (data && data.code === "200") {
          this.provinceList = data.data;
        }
      })
    },
    //获取城市信息
    async getCity(){
      var params = this.axios.paramsHandler({parent_id: this.province},false)
      await getRegionList(params).then(({data}) => {
        if (data && data.code === "200") {
          this.city = null;
          this.area = null;
          this.cityList = data.data
          this.areaList = [];
        }
      })
    },
    //获取区县信息
    async getArea(){
      var params = this.axios.paramsHandler({parent_id: this.city},false)
      await getRegionList(params).then(({data}) => {
        if (data && data.code === "200") {
          this.area = null;
          this.areaList = data.data
        }
      })
    },
    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.userInfo = userInfo;
    },

  },
  mounted() {
    //说明是点击修改按钮过来的
    if (this.$route.query.id) {
      this.getRecipientInfoById(this.$route.query.id)
    }
    this.getProvinceData();
    this.getUserInfo();
  },
  components: {
    card
  },
};
</script>

<style scoped lang="scss">
.add-box {
  margin: 40px 0;
}
</style>
