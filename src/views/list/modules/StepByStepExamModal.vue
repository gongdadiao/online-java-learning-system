<template>
  <a-modal
    title="创建考试"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-steps :current="currentStep" :style="{ marginBottom: '28px' }" size="small">
        <a-step title="考试描述"/>
        <a-step title="每题分数"/>
        <a-step title="选择题目"/>
      </a-steps>
      <a-form :form="form">
        <!-- step1 -->
        <div v-show="currentStep === 0">
          <a-form-item
            label="考试名称"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-model="examSelection.name" v-decorator="['examName',{rules:[{required:true,message:'不能为空'}]}]"/>
          </a-form-item>
          <a-form-item
            label="考试限时"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input-number
              :min="1"
              :max="200"
              v-model="examSelection.limit"
            />
            分钟
          </a-form-item>
          <a-form-item
            label="考试简述"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-textarea :rows="2" v-model="examSelection.desc"></a-textarea>
          </a-form-item>
          <a-form-item
            label="考试小图"
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
                :beforeUpload="beforeUpload"
                :data="qiniuData"
                @change="handleUploadChange"
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
            label="单选题"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input-number
              :min="1"
              :max="20"
              v-model="examSelection.danxuanScore"
            />
            分
          </a-form-item>

          <a-form-item
            label="多选题"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input-number
              :min="1"
              :max="20"
              v-model="examSelection.duoxuanScore"
            />
            分
          </a-form-item>

          <a-form-item
            label="判断题"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input-number
              :min="1"
              :max="20"
              v-model="examSelection.panduanScore"
            />
            分
          </a-form-item>
          <a-form-item
            label="填空题"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input-number
              :min="1"
              :max="20"
              v-model="examSelection.tiankongScore"
            />
            分
          </a-form-item>
          <a-form-item
            label="问答题"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input-number
              :min="1"
              :max="20"
              v-model="examSelection.wendaScore"
            />
            分
          </a-form-item>
        </div>
        <div v-show="currentStep === 2" :style="{marginTop: '20px'}" >
          <template>
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
            <div>
            </div>
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
import { getExamQuestionTypeList, examCreate,getQuestionList,addOneQuestion,addOneExam } from '../../../api/exam'
import {getToken}  from '../../../api/token'
import difference from 'lodash/difference';

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
  name: 'StepByStepExamModal',
  data () {
    return {
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      qiniu_url:this.$store.state.qiniuUrl,
      examSelection: {
        avartar:'',
        name:'',
        examAvatar: '',
        desc:'',
        danxuanScore:0,
        duoxuanScore:0,
        panduanScore:0,
        tiankongScore:0,
        wendaScore:0,
        limit:90
      },
      mockData: [],
      targetKeys: [],
      titles:['待选','已选'],
      disabled: false,
      showSearch: false,
      questions:[],
//----------------------------------------------
      imageUrl: '',
      loading:false,
      fileloading:false,
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
    this.getMock();
  },
  methods: {
    onQuestionCheckBoxChange(checkedValues){
      console.log(checkedValues)
    },
    handleUploadChange(info) {
      //console.log(info)
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        this.examSelection.avartar = this.qiniu_url + info.file.response.key
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
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
              description: that.questions[i].questionDescription
            }
            mockData.push(data);
            //targetKeys.push(data.key)
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
        console.log('提交数据到后端')
        this.confirmLoading = false
        if (!errors) {
          console.log(this.targetKeys)
          var danxuanList = []
          var duoxuanList = []
          var panduanList = []
          var tiankongList = []
          var wendaList = []
          for (var i = 0; i < this.targetKeys.length; i++) {
            let question = this.questions[this.targetKeys[i]]
            let selections = question.questionSelections
            var optionsList = selections.split("#$")
            let onequestion = {
              questionId: question.questionId,
              questionContent: question.questionContent,
              questionType: question.questionTypeName,
              questionOptions: optionsList,
              answer: question.questionAnswers,
              questionDescription: question.questionDescription
            }
            if (onequestion.questionType == 'danxuan') {
              danxuanList.push(onequestion)
            } else if (onequestion.questionType == 'duoxuan') {
              duoxuanList.push(onequestion)
            } else if (onequestion.questionType == 'panduan') {
              panduanList.push(onequestion)
            } else if (onequestion.questionType == 'tiankong') {
              tiankongList.push(onequestion)
            } else if (onequestion.questionType == 'wenda') {
              wendaList.push(onequestion)
            } else {
              console.log("类型错误")
            }
          }
          var that = this
          let oneExam = {
            examAvatar: this.examSelection.avartar,
            examName: this.examSelection.name,
            examDescription: this.examSelection.desc,
            examScoreDanxuan: this.examSelection.danxuanScore,
            examScoreDuoxuan: this.examSelection.duoxuanScore,
            examScorePanduan: this.examSelection.panduanScore,
            examScoreTiankong: this.examSelection.tiankongScore,
            examScoreWenda: this.examSelection.wendaScore,
            examTimeLimit: this.examSelection.limit,
            danxuanList: danxuanList,
            duoxuanList: duoxuanList,
            panduanList: panduanList,
            tiankongList: tiankongList,
            wendaList: wendaList
          }
          addOneExam(JSON.stringify(oneExam)).then(res => {
            // 成功就跳转到结果页面
            console.log(res)
            if (res.code === 0) {
              this.$notification.success({
                message: '创建成功',
                description: '考试创建成功'
              })
              // 关闭弹出框
              this.visible = false
            }
          }).catch(err => {
            // 失败就弹出警告消息
            this.$notification.error({
              message: '考试创建失败',
              description: err.message
            })
          })
          // } else {
          //   this.confirmLoading = false
          // }
        }else{
          this.$message.info("请填写所有必要信息")
        }
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
