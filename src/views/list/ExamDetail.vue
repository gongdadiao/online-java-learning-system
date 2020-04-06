<template>
  <a-layout>
    <a-layout-header class="header" style="color: #fff">
      <!--   v-if="examDetail.exam" 是为了防止 异步请求时页面渲染的时候还没有拿到这个值而报错， 下面多处这个判断都是这个道理 -->
      <span style="font-size:25px;margin-left: 0px;" v-if="examDetail.exam">
        <a-avatar slot="avatar" size="large" shape="circle" :src="examDetail.exam.examAvatar"/>
        {{ examDetail.exam.examName }}
        <span style="font-size:15px;">{{ examDetail.exam.examDescription }} </span>
      </span>
      <span style="float: right;">
        <span  style="margin-right: 60px; font-size: 20px" v-if="examDetail.exam">考试还剩：<count-down :target=" nowTime + examDetail.restSeconds*1000"  :on-end="onExamTimeFinished" /></span>

        <a-button type="danger" ghost style="margin-right: 60px;" @click="finishExam()">交卷</a-button>
        <a-avatar class="avatar" size="small" :src="avatar()"/>
        <span style="margin-left: 12px">{{ nickname() }}</span>
      </span>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="190" :style="{background: '#444',overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
        <a-menu
          mode="inline"
          :defaultSelectedKeys="['1']"
          :defaultOpenKeys="['question_radio', 'question_check', 'question_judge']"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-sub-menu key="question_danxuan">
            <span slot="title" v-if="examDetail.exam"><a-icon type="check-circle" theme="twoTone"/>单选题(每题{{ examDetail.exam.examScoreDanxuan }}分)</span>
            <a-menu-item v-for="(item, index) in examDetail.danxuanList" :key="item.id" @click="getQuestionDetail(item.id)">
              <a-icon type="eye" theme="twoTone" twoToneColor="#52c41a" v-if="answersMap.get(item)"/>
              题目{{ index + 1 }}
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="question_duoxuan">
            <span slot="title" v-if="examDetail.exam"><a-icon type="check-square" theme="twoTone"/>多选题(每题{{ examDetail.exam.examScoreDuoxuan }}分)</span>
            <a-menu-item v-for="(item, index) in examDetail.duoxuanList" :key="item.id" @click="getQuestionDetail(item.id)">
              <a-icon type="eye" theme="twoTone" twoToneColor="#52c41a" v-if="answersMap.get(item.id)"/>
              题目{{ index + 1 }}
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="question_panduan">
            <span slot="title" v-if="examDetail.exam"><a-icon type="like" theme="twoTone"/>判断题(每题{{ examDetail.exam.examScorePanduan }}分)</span>
            <a-menu-item v-for="(item, index) in examDetail.panduanList" :key="item.id" @click="getQuestionDetail(item.id)">
              <a-icon type="eye" theme="twoTone" twoToneColor="#52c41a" v-if="answersMap.get(item.id)"/>
              题目{{ index + 1 }}
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="question_tiankong">
            <span slot="title" v-if="examDetail.exam"><a-icon type="like" theme="twoTone"/>填空题(每题{{ examDetail.exam.examScoreTiankong}}分) </span>
            <a-menu-item v-for="(item, index) in examDetail.tiankongList" :key="item.id" @click="getQuestionDetail(item.id)" >
              <a-icon type="eye" theme="twoTone" twoToneColor="#52c41a" v-if="answersMap.get(item.id)"/>
              题目{{ index+1 }}
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="question_wenda">
            <span slot="title" v-if="examDetail.exam"><a-icon type="like" theme="twoTone"/>问答题(每题{{ examDetail.exam.examScoreWenda}}分) </span>
            <a-menu-item v-for="(item, index) in examDetail.wendaList" :key="item.id" @click="getQuestionDetail(item.id)" >
              <a-icon type="eye" theme="twoTone" twoToneColor="#52c41a" v-if="answersMap.get(item.id)"/>
              题目{{ index+1 }}
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout :style="{ marginLeft: '200px' }">
        <a-layout-content :style="{ margin: '24px 16px 0',height: '84vh', overflow: 'initial' }">
          <div :style="{ padding: '24px', background: '#fff',height: '84vh'}">
            <span v-show="currentQuestion === ''" style="font-size: 30px;font-family: Consolas">欢迎参加考试，请点击左侧题目编号开始答题</span>
            <strong>[{{ currentQuestion.type }}] </strong> {{ currentQuestion.content }}
            <br><br>
            <!-- 单选题 --> <!-- key不重复只需要在一个for循环中保证即可 -->
            <a-radio-group  v-model="currentQuestion.userAnswer" v-if="currentQuestion.type === 'danxuan'">
              <a-radio v-for="(option,index) in currentQuestion.options" :key="index" :style="optionStyle" :value="String.fromCharCode(65+index)">
                {{String.fromCharCode(65+index)}}:{{ option }}
              </a-radio>
            </a-radio-group>

            <!-- 判断 -->
            <a-radio-group  v-model="currentQuestion.userAnswer"  v-if="currentQuestion.type === 'panduan'">
              <a-radio :style="optionStyle" value="right">
                正确
              </a-radio>
              <a-radio  :style="optionStyle" value="wrong">
                错误
              </a-radio>
            </a-radio-group>
            <template v-if="currentQuestion.type === 'duoxuan'">
            <a-checkbox-group   v-model="checkValues" @change="onQuestionCheckBoxChange" >
              <a-row>
                <template v-for="(option,index) in currentQuestion.options" >
                  <a-checkbox :key="index" :style="optionStyle" :value=String.fromCharCode(65+index) >
                    {{String.fromCharCode(65+index)}}:{{ option }}
                  </a-checkbox>
                </template>
              </a-row>
            </a-checkbox-group>
            </template>

            <!-- 填空 -->
            <a-input v-model="currentQuestion.userAnswer" v-decorator="['tiankongAnswer',{rules:[{required:true,message:'不能为空'}]}]" v-if="currentQuestion.type === 'tiankong'" placeholder="请输入答案"></a-input>

            <!-- 问答 -->
            <a-input v-model="currentQuestion.userAnswer" v-decorator="['wendaAnswer',{rules:[{required:true,message:'不能为空'}]}]" v-if="currentQuestion.type === 'wenda'"></a-input>
            <br/>
            <br/>
            <br/>
            <br/>
            <div v-if="currentQuestion.type === 'wenda'">
              <div v-if="status=='done'">
                <a-card  title="结果" style="width: 300px">
                  <p>您的得分是：{{currentQuestion.finalScore}}</p>
                  <p>老师的点评：{{currentQuestion.rightAnswer}}</p>
                </a-card>
              </div>
            </div>
            <div v-else>
              <div v-if="status=='done'">
                <a-card title="结果" style="width: 300px">
                  <p>您的得分是：{{currentQuestion.finalScore}}</p>
                  <p>您选择的答案:{{currentQuestion.userAnswer}}</p>
                  <p>正确答案是:{{currentQuestion.rightAnswer}}</p>
                </a-card>
              </div>
            </div>
          </div>
        </a-layout-content>
        <a-layout-footer :style="{ textAlign: 'center' }">
          Java Online Learn System ©2020 Crated by Gong Yan
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getExamDetail, getQuestionDetail, finishExam } from '../../api/exam'
import UserMenu from '../../components/tools/UserMenu'
import { mapGetters } from 'vuex'
import CountDown from '../../components/CountDown'

export default {
  name: 'ExamDetail',
  components: {
    UserMenu,
    CountDown
  },
  data () {
    return {
      nowTime:new Date().getTime(),
      status:"doing",
      // 考试详情对象
      examDetail: {},
      // 用户做过的问题都放到这个数组中，键为问题id, 值为currentQuestion(其属性answers属性用于存放答案选项地id或ids),，用于存放用户勾选的答案
      answersMap: {},
      questionMap: {},
      // 当前用户的问题
      currentQuestion: '',
      // 单选或判断题的绑定值，用于从answersMap中初始化做题状态
      radioValue: '',
      // 多选题的绑定值，用于从answersMap中初始化做题状态
      checkValues: [],

      answerPage:{
        examId:'',
        examName:'',
        examTimeCost:'',
        danxuanList: [],
        duoxuanList: [],
        panduanList: [],
        tiankongList: [],
        wendaList: []
      },
      optionStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
        marginLeft: '0px'
      }
    }
  },
  mounted () {
    this.answersMap = new Map()
    this.questionMap = new Map()
    const that = this
    // 从后端获取考试的详细信息，渲染到考试详情里
    getExamDetail(this.$route.params.id)
      .then(res => {
        if(res.code==-1){
          this.$message.info('获取试卷失败')
          return
        }
        if(res.code==-2){
          this.$message.info('等待老师批改')
          return
        }
        if(res.code==-3){
          this.$message.info('你没有按时交卷')
          return
        }
        if(res.code==1){
          this.status="done"
        }
        if (res.code == 0 || res.code==1) {
          // 赋值考试对象
          that.examDetail = res.data
          for (var item of that.examDetail.danxuanList) {
            that.questionMap.set(item.id, item)
          }
          for (var duoxuan of that.examDetail.duoxuanList) {
            that.questionMap.set(duoxuan.id, duoxuan)
          }
          for (var panduan of that.examDetail.panduanList) {
            that.questionMap.set(panduan.id, panduan)
          }
          for (var tiankong of that.examDetail.tiankongList) {
            that.questionMap.set(tiankong.id, tiankong)
          }
          for (var wenda of that.examDetail.wendaList) {
            that.questionMap.set(wenda.id, wenda)
          }
          return res.data
        }
      })
  },
  methods: {
    onExamTimeFinished(){
      this.$message.info('考试结束')
    },
    onQuestionCheckBoxChange(checkedValues){
      this.answersMap.set(this.currentQuestion.id, checkedValues)
    },
    // 从全局变量中获取用户昵称和头像,
    ...mapGetters(['nickname', 'avatar']),
    getQuestionDetail (questionId) {
      // 问题切换时从后端拿到问题详情，渲染到前端content中
      this.radioValue = ''
      this.checkValues = []
      this.currentQuestion = this.questionMap.get(questionId)
      Object.assign(this.checkValues,this.answersMap.get(this.currentQuestion.id))
    },
    /**
     * 单选题勾选是触发的变化事件
     * @param e
     */
    onRadioChange (e) {
      //const userOptions = []
      // userOptions.push(e.target.value)
      // 更新做题者选择的答案
      // this.answersMap.set(this.currentQuestion.id, userOptions)
    },
    /**
     * 多选题触发的变化事件
     * @param checkedValues
     */
    onCheckChange (checkedValues) {
      // 更新做题者选择的答案
    //  this.answersMap.set(this.currentQuestion.id, checkedValues)
    },
    _strMapToObj (strMap) {
      const obj = Object.create(null)
      for (const [k, v] of strMap) {
        obj[k] = v
      }
      return obj
    },
    /**
     *map转换为json
     */
    _mapToJson (map) {
      return JSON.stringify(this._strMapToObj(map))
    },
    /**
     * 结束考试并交卷
     */
    finishExam () {
      this.answerPage.examId = this.examDetail.exam.examId
      this.answerPage.examName = this.examDetail.exam.examName
      this.answerPage.danxuanList = this.examDetail.danxuanList
      this.answerPage.duoxuanList = this.examDetail.duoxuanList
      for (const item of this.answerPage.duoxuanList) {
        var clist = this.answersMap.get(item.id)
        var ans=''
        for (const element of clist) {
          ans+=(','+element)
        }
        if(ans!=''){
          ans = ans.substr(1)
        }
        item.userAnswer=ans
      }
      this.answerPage.panduanList = this.examDetail.panduanList
      this.answerPage.tiankongList = this.examDetail.tiankongList
      this.answerPage.wendaList = this.examDetail.wendaList
      // Todo:向后端提交作答信息数组answersMap
      finishExam(this.$route.params.id, JSON.stringify(this.answerPage))
        .then(res => {
          if (res.code === 0) {
            // 考试交卷，后端判分完成，然后跳转到我的考试界面
            this.$notification.success({
              message: '考卷提交成功！'
            })
            this.$router.push('/list/exam-record-list')
            return res.data
          } else {
            this.$notification.error({
              message: '交卷失败！',
              description: res.msg
            })
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
