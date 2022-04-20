<template>
  <div class="wrapper">
    <card _Title="用户信息" />
    <Form :model="dataForm" :rules="rules" ref="form" :label-width="80">
      <FormItem label="头像">
        <Avatar v-if="dataForm.avatar" :src="dataForm.avatar" size="80"/>
        <Avatar v-else icon="ios-person" size="80"/>
        <Upload
          action="#"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :format="['jpg','jpeg','png']">
          <Button class="mt_10">上传头像</Button>
        </Upload>
      </FormItem>
      <FormItem label="昵称" prop="nickName">
        <Input class="wrapper-user-name" style="width:187px" v-model="dataForm.nickName" placeholder="" />
      </FormItem>
      <FormItem label="生日">
        <DatePicker
          type="date"
          placeholder="选择您的生日"
          v-model="dataForm.birthday"
          format="yyyy-MM-dd">
        </DatePicker>
      </FormItem>
      <FormItem label="性别">
        <RadioGroup v-model="dataForm.sex" type="button" button-style="solid">
          <Radio :label="0">男</Radio>
          <Radio :label="1">女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="save">确认修改</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { fileUpload } from '@/api/mall-file/file'
import { memberConstant } from '@/utils/constant';
import { updateMember } from '@/api/mall-member/member'
import { getUserInfo, setUserInfo } from "@/utils/auth";


export default {
  name: 'Profile',
  data () {
    return {
      rules: { // 验证规则
        nickName: [{required: true, message: '用户昵称不能为空'}, { max: 16, message: '用户昵称不能超过15个字符' }]
      },
      dataForm: {
        id: 0,
        avatar: '', //头像
        nickName: '', //昵称
        birthday: null, //生日
        sex: null //性别
      }, // 表单数据
      file: null,
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {

    /**
     * cookie中获取当前登录的用户信息
     */
    getUserInfo() {
      var userInfo = JSON.parse(getUserInfo(sessionStorage.getItem("userNameKey")));
      this.dataForm = userInfo;
      this.dataForm.birthday = this.$options.filters.unixToDate(this.dataForm.birthday / 1000, 'yyyy-MM-dd')
    },

    save () { // 保存
      this.$refs['form'].validate(valid => {
        if (valid) {
          var putData = this.axios.dataHandler({
            id: this.dataForm.userId,
            avatar: this.dataForm.avatar,
            nickName: this.dataForm.nickName,
            birthday: this.dataForm.birthday,
            sex: this.dataForm.sex
          })
          updateMember(putData).then(({data}) => {
            if (data && data.code=='200') {
              this.$Message.success('修改成功')
              this.dataForm.birthday = this.dataForm.birthday.getTime();
              setUserInfo(sessionStorage.getItem("userNameKey"), this.dataForm);
              this.getUserInfo(); //刷新当前页数据
            }
          })
        }
      })
    },
    /**
     * 上传前校验文件
     */
    beforeUpload(file){
      this.file = file;
      const isImg = (file.size / 1024 / 1024) < 3
      const isType = file.type === "image/png"
      const isType2 = file.type === "image/jpeg"
      if (!isImg) {
        this.$Message.error('上传图片大小不能超过 3MB!')
        this.file = null;
      } else if (!isType && !isType2) {
        this.$Message.error('上传图片格式为png或jpg')
        this.file = null;
      } else {
        let formData = new FormData();
        formData.append("files", this.file);
        var params = this.axios.paramsHandler({ folderName: memberConstant.member_avatar })
        fileUpload(formData, params).then(({data}) => {
          this.$forceUpdate();
          this.$set(this.dataForm, 'avatar', data.data)
        })
      }
      return false
    }

  }

}
</script>

<style scoped lang="scss">

</style>
