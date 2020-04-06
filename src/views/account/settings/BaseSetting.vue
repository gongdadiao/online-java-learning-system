<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form layout="vertical" :form="form">
          <a-form-item
            label="昵称"
          >
            <a-input
              v-decorator="['nickName', {rules: [{ required: true, message: '请输入邮箱',type:'email' }], validateTrigger: ['change', 'blur']}]"
              placeholder="给自己起个名字" />
          </a-form-item>
          <a-form-item
            label="Bio"
          >
            <a-textarea
              v-decorator="['bio', {rules: [{ required: true, message: '请输入邮箱',type:'email' }], validateTrigger: ['change', 'blur']}]"
              rows="4" placeholder="You are not alone."/>
          </a-form-item>

          <a-form-item
            label="电子邮件"
            :required="false"
           >
            <a-input
              v-decorator="['email', {rules: [{ required: true, message: '请输入邮箱',type:'email' }], validateTrigger: ['change', 'blur']}]"
              placeholder="exp@admin.com"/>
          </a-form-item>
<!--          <a-form-item-->
<!--            label="登录密码"-->
<!--            :required="false"-->
<!--          >-->
<!--            <a-input placeholder="密码"/>-->
<!--          </a-form-item>-->

          <a-form-item>
            <a-button type="primary" @click="handleSubmitSettings">提交</a-button>
            <a-button style="margin-left: 8px">保存</a-button>
          </a-form-item>
        </a-form>

      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <a-upload
          listType="picture-card"
          :showUploadList="false"
          action='http://up-z1.qiniup.com'
          :data="qiniuData"
          @change="handleUploadChange"
          class="ant-upload-preview"
          :before-upload="beforeAvartarUpload"
        >
          <div  >
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src=imageUrl />
        </div>
        </a-upload>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import {getToken}  from '../../../api/token'
  import {SubmitSettings} from '../../../api/user'
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
export default {
  components: {},
  data () {
    return {
      avartar_url:null,
      imageUrl:'/avatar2.jpg',
      qiniuData: {
        token: '',
        key: ''
      },
      qiniu_url:this.$store.state.qiniuUrl,
      form: this.$form.createForm(this),
      // cropper
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      }
    }
  },
  mounted() {
  },
  methods: {
    async beforeAvartarUpload(info) {
      var type = ''
      let name = info.name.toString()
      for (var i = name.length - 1; i >= 0; i--) {
        if (name.charAt(i) != '.') {
          type = name.charAt(i) + type
        } else
          break
      }
      var that = this
      console.log(type)
      await getToken(type)
        .then(resp => {
          that.qiniuData.key = resp.key
          that.qiniuData.token = resp.token
        })
    },
    handleSubmitSettings(){
      var that=this
      const { form: { validateFields }, $router, $message } = this
      validateFields({ force: true }, (err, values) => {
        values.avartar=that.avartar_url
        SubmitSettings(values)
          .then(resp=>{
            if(resp.code==0){
              this.$message.info(resp.msg)
            }else {
              this.$message.info('设置失败')
            }
          })
      })

    },

    handleUploadChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        this.avartar_url=this.qiniu_url + info.file.response.key
        getBase64(info.file.originFileObj, imageUrl => {
          this.option.img=imageUrl
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
    },
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
