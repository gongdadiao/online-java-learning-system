<template>
  <a-modal
    title="上传资源"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-steps :current="currentStep" :style="{ marginBottom: '28px' }" size="small">
        <a-step title="资源描述"/>
        <a-step title="类别设置"/>
        <a-step title="上传资源"/>
      </a-steps>
      <a-form :form="form">
        <!-- step1 -->
        <div v-show="currentStep === 0">
          <a-form-item
            label="资源名称"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-model="resSelection.name" v-decorator="['name',{rules:[{required:true,message:'不能为空'}]}]"/>
          </a-form-item>
          <a-form-item
            label="资源简述"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-textarea :rows="2" v-model="resSelection.desc"></a-textarea>
          </a-form-item>
          <a-form-item
            label="资源小图"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <div class="clearfix">
              <!-- 上传数据 -->
              <a-upload
                listType="picture-card"
                class="avatar-uploader"
                :showUploadList="false"
                action='http://up-z1.qiniup.com'
                :data="qiniuData"
                @change="handleUploadChange"
                :before-upload="beforeUpload"
              >
                <a-avatar v-if="imageUrl!=''" :src="imageUrl" />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
            </div>
          </a-form-item>
        </div>
        <div v-show="currentStep === 1">
          <a-form-item
            label="主题"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select v-model="resSelection.themeId" defaultValue="1" style="width: 120px">
              <a-select-option value="1">JAVA平台与面向对象基础（一）</a-select-option>
              <a-select-option value="2">JAVA平台与面向对象基础（二）</a-select-option>
              <a-select-option value="3">JAVA平台与面向对象基础（三）</a-select-option>
              <a-select-option value="4">JAVA GUI编程（一）</a-select-option>
              <a-select-option value="5">JAVA GUI编程（二）</a-select-option>
              <a-select-option value="6">输入输出流与文件操作</a-select-option>
              <a-select-option value="7">多线程编程与网络编程</a-select-option>
              <a-select-option value="8">期末测试</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="资源类型"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select v-model="resSelection.type" defaultValue="video" style="width: 120px" @change="selectResType">
              <a-select-option value="video">视频</a-select-option>
              <a-select-option value="ppt">ppt</a-select-option>
              <a-select-option value="dox">word文档</a-select-option>
              <a-select-option value="java">源码</a-select-option>
              <a-select-option value="homework" >作业</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="题目选择"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-if="resSelection.type=='homework'"
          >
            <a-transfer
              :dataSource="mockData"
              :listStyle="{
                width: '400px',
                height: '400px',
              }"
              :targetKeys="targetKeys"
              @change="handleChange"
              :render="renderItem"

              :disabled="disabled"
              :showSearch="showSearch"
              :filterOption="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
              :showSelectAll="false"
            >
            </a-transfer>
          </a-form-item>

        </div>
        <div v-show="currentStep === 2" :style="{marginTop: '20px'}" >
          <template>
            <a-form-item
              v-if="resSelection.type=='homework'"
              label="上传作业"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-button @click="uploadHomeWork">上传作业</a-button>
            </a-form-item>
            <a-form-item
              v-if="resSelection.type!='homework'"
              label="资源上传"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-upload
                :multiple="true"
                :showUploadList="false"
                action='http://up-z1.qiniup.com'
                :headers="headers"
                :data="qiniuData"
                @change="handleUploadFileChange"
                :before-upload="beforeFileUpload"
              >
                <a-button > <a-icon type="upload" /> Click to Upload </a-button>
                <div>进度:{{ this.percent }}</div>
              </a-upload>
            </a-form-item>
          </template>
        </div>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button key="back" @click="backward" v-if="currentStep > 0" :style="{ float: 'left' }">上一步</a-button>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleNext(currentStep)">
        {{ currentStep === 2 && '完成' || '下一步' }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
  // import pick from 'lodash.pick'
  import { addOneResource } from '../../../api/resource'
  import {getToken}  from '../../../api/token'
  import difference from 'lodash/difference';
  import { getQuestionList } from '../../../api/exam'

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }


  const stepForms = [
    ['name', 'elapse', 'desc', 'avatar'],
    ['radioScore', 'checkScore', 'judgeScore'],
    ['option']
  ]


  export default {
    name: 'StepByStepResourceModal',
    data () {
      return {
        percent:0,
        mockData: [],
        targetKeys: [],
        titles:['待选','已选'],
        disabled: false,
        showSearch: false,
        headers: {
          authorization: 'authorization-text',
        },
        resSelection:{
          avartar:'',
          name:'',
          desc:'',
          type:'',
          themeId:'',
          url:''
        },
        qiniu_url:this.$store.state.qiniuUrl,
        questions:[],
        disabled: false,
        showSearch: false,
//----------------------------------------------
        imageUrl: '',
        loading:false,
//-------------------
        canClick: true,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        size: 'default',
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        },
        visible: false,
        confirmLoading: false,
        currentStep: 0,
        mdl: {},
        form: this.$form.createForm(this),
        qiniuData: {
          token: '',
          key: ''
        }
      }
    },
    mounted() {
    },
    methods: {
      async beforeFileUpload(info) {
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
      uploadHomeWork(){
        this.resSelection.url=""
        for (const key of this.targetKeys) {
          this.resSelection.url+=(','+this.questions[key].questionId)
        }
        if(this.resSelection.url!=""){
          this.resSelection.url=this.resSelection.url.substr(1)
        }
      },
      selectResType(value){
        if(value=='homework'){
          this.getMock()
        }
      },
      getMock() {
        const targetKeys = [];
        const mockData = [];
        var that=this
        getQuestionList()
          .then(resp=>{
            that.questions=resp.data
            for (let i = 0; i < that.questions.length ; i++) {
              const data = {
                key: i.toString(),
                title: that.questions[i].questionContent,
                description: that.questions[i].questionDescription,
                disabled:(that.questions[i].questionTypeName=='wenda' || that.questions[i].questionTypeName=='tiankong')?true:false
              }
              mockData.push(data);
            }
            that.mockData = mockData;
            that.targetKeys = targetKeys;
          })

      },
      renderItem(item) {
        const customLabel = (
          <span class="custom-item">
          {item.title} - {item.description}
          </span>
      );
        return {
          label: customLabel, // for displayed item
          value: item.title, // for title and filter matching
        };
      },
      handleChange(targetKeys, direction, moveKeys) {
        this.targetKeys = targetKeys;
      },
      handleUploadChange(info) {
        if (info.file.status === 'uploading') {
          this.loading = true;
          return;
        }
        if (info.file.status === 'done') {
          this.resSelection.avartar = this.qiniu_url + info.file.response.key
          getBase64(info.file.originFileObj, imageUrl => {
            this.imageUrl = imageUrl;
            this.loading = false;
          });
        }
      },
      handleUploadFileChange(info){
        if (info.file.status === 'uploading') {
          this.fileloading = true;
          this.percent = info.file.percent
          return;
        }
        if (info.file.status === 'done') {
          this.fileloading = false;
          this.resSelection.url = this.qiniu_url + info.file.response.key
          this.$message.success(`${info.file.name} file uploaded successfully`);
        }
        else if (info.file.status === 'error') {
            this.$message.error(`${info.file.name} file upload failed.`);
        }
      },
      async beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          this.$message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('Image must smaller than 2MB!');
        }
        //设置上传文件的类型
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
        return isJpgOrPng && isLt2M;
      },
      submitResourceAdd(){
        let submit={
          resAvatar:this.resSelection.avartar,
          resDescription:this.resSelection.desc,
          resName:this.resSelection.name,
          resThemeId:this.resSelection.themeId,
          resType:this.resSelection.type,
          resUrl:this.resSelection.url,
          resSeq:0
        }
        var that=this
        addOneResource(submit)
          .then(resp=>{
            console.log(resp)
            if(resp.code==0){
              this.$notification.success({
                message: '创建成功',
                description: '考试资源de成功'
              })
              // 关闭弹出框
              this.visible = false
            }
          }).catch(err => {
          // 失败就弹出警告消息
          this.$notification.error({
            message: '考试资源失败',
            description: err.message
          })
        })
      },

      triggerDisable(disabled) {
        this.disabled = disabled;
      },

      triggerShowSearch(showSearch) {
        this.showSearch = showSearch;
      },
      getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
        return {
          getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
          onSelectAll(selected, selectedRows) {
            const treeSelectedKeys = selectedRows
              .filter(item => !item.disabled)
              .map(({ key }) => key);
            const diffKeys = selected
              ? difference(treeSelectedKeys, selectedKeys)
              : difference(selectedKeys, treeSelectedKeys);
            itemSelectAll(diffKeys, selected);
          },
          onSelect({ key }, selected) {
            itemSelect(key, selected);
          },
          selectedRowKeys: selectedKeys,
        };
      },
      create () {
        this.visible=true
      },
      popupScroll () {
        console.log('popupScroll')
      },
      handleNext (step) {
        // 处理下一步或者完成事件
        const { form: { validateFields } } = this
        const currentStep = step + 1
        if (currentStep <= 2) {
          // stepForms
          validateFields(stepForms[this.currentStep], (errors, values) => {
            if (!errors) {
              this.currentStep = currentStep
            }
          })
          return
        }
        // last step，最后一步，代表完成考试编写，需要点击"完成"创建考试
        this.confirmLoading = true
        validateFields((errors, values) => { // values就是表单中校验的值，后面提交到后端接口时主要就是用这个values
          this.submitResourceAdd()
          this.confirmLoading = false
        })
      },
      backward () {
        this.currentStep--
      },
      handleCancel () {
        // clear form & currentStep
        this.visible = false
        this.currentStep = 0
      },
    }
  }
</script>

<style scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
