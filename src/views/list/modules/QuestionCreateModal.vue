<template>
  <a-modal
    title="创建题目"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel">
    <div>
      <div>
        <template>
          <a-form :form="form"  >
            <a-form-item label="内容">
              <a-input
                v-model="questionSelection.questionContent"
                v-decorator="['note', { rules: [{ required: true, message: '输入题目' }] }]"
                style="width: 300px"
              />
            </a-form-item>
            <a-form-item label="描述">
              <a-input
                v-model="questionSelection.questionDescription"
                style="width: 300px"
              />
            </a-form-item>
            <a-form-item label="类型">
              <a-select
                style="width: 100px"
                defaultValue="danxuan"
                v-model="questionSelection.questionTypeSelection"
                @change="onTypeChange"
              >
                <a-select-option value="danxuan">
                  单选
                </a-select-option>
                <a-select-option value="duoxuan">
                  多选
                </a-select-option>
                <a-select-option value="panduan">
                  判断
                </a-select-option>
                <a-select-option value="tiankong">
                  填空
                </a-select-option>
                <a-select-option value="wenda">
                  问答
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="选项" v-if="questionSelection.questionTypeSelection=='danxuan' || questionSelection.questionTypeSelection=='duoxuan'">
              <a-input-number style="width: 100px" v-model="questionSelection.questionOptionNumber" size="small" :min="0" :max="4" :defaultValue="0" @change="optionNumberChange"></a-input-number>
              <template v-for="(item,index) in questionSelection.questionOptionList">
                <a-input style="width: 100px" v-decorator="['itemContent'+index,{rules:[{required:true,message:'不能为空'}]}]" v-model="item.content" size="small"  />
              </template>
            </a-form-item>
            <a-form-item label="答案" style="width: 100px" v-if="questionSelection.questionTypeSelection!='wenda'">
              <a-input v-if="questionSelection.questionTypeSelection=='tiankong'" v-decorator="['tiankong',{rules:[{required:true,message:'不能为空'}]}]" style="width: 100px" v-model="questionSelection.questionAnswer" size="small"></a-input>
              <template v-if="questionSelection.questionTypeSelection=='danxuan'">
                <a-radio-group v-model="questionSelection.questionAnswer" >
                  <template v-for="num of questionSelection.questionOptionNumber">
                    <a-radio :style="radioStyle" :value=String.fromCharCode(64+num)>{{String.fromCharCode(64+num)}}</a-radio>
                  </template>
                </a-radio-group>
              </template>
              <template v-if="questionSelection.questionTypeSelection=='panduan'">
                <a-radio-group v-model="questionSelection.questionAnswer" >
                  <a-radio :style="radioStyle" value="right">正确</a-radio>
                  <a-radio :style="radioStyle" value="wrong">错误</a-radio>
                </a-radio-group>
              </template>
              <template v-if="questionSelection.questionTypeSelection=='duoxuan'">
                <a-checkbox-group @change="onQuestionCheckBoxChange">
                  <a-row>
                    <template v-for="num of questionSelection.questionOptionNumber">
                      <a-col :span="8"><a-checkbox :value=String.fromCharCode(64+num) >{{String.fromCharCode(64+num)}}</a-checkbox></a-col>
                    </template>
                  </a-row>
                </a-checkbox-group>
              </template>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
              <a-button type="primary" @click="submitQuestionAdd">
                添加题目
              </a-button>
            </a-form-item>
          </a-form>
        </template>
      </div>
    </div>
  </a-modal>
</template>

<script>
  import { getExamQuestionTypeList, examCreate,getQuestionList,addOneQuestion,addOneExam } from '../../../api/exam'


  export default {
    name: 'QuestionCreateModal',
    data(){
      return{
        radioStyle: {
          display: 'block',
          height: '30px',
          lineHeight: '30px',
        },
        visible:false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        questionSelection:{
          questionContent:'',
          questionTypeSelection:'danxuan',
          questionOptionNumber:0,
          questionOptionList:[],
          questionAnswer:'',
          questionDescription:''
        }
      }
    },
    methods:{
      onTypeChange(){
        this.questionSelection.questionAnswer=''
      },
      onQuestionCheckBoxChange(checkedValues){

        this.questionSelection.questionAnswer=''
        for (const value of arguments) {
          this.questionSelection.questionAnswer+=value
        }
        console.log(this.questionSelection.questionAnswer)
      },
      handleCancel () {
        this.visible = false
      },
      create () {
        this.visible=true
      },
      submitQuestionAdd(){
        this.form.validateFields((errors,values)=>{
          if(!errors){
            var options=[]
            for (const item of this.questionSelection.questionOptionList) {
              options.push(item.content)
            }
            let submit={
              questionContent:this.questionSelection.questionContent,
              questionType:this.questionSelection.questionTypeSelection,
              questionOptions:options,
              answer:this.questionSelection.questionAnswer,
              questionDescription:this.questionSelection.questionDescription
            }
            var that=this
            addOneQuestion(submit)
              .then(resp=>{
                console.log(resp)
                that.getMock();
              })
          }else{
            this.$message.info('请输入必要信息')
          }
        })

      },
      optionNumberChange(value){
        var list = this.questionSelection.questionOptionList
        while(list.length != value){
          if(list.length < value){
            list.push({content:''})
          }
          else{
            list.pop()
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>