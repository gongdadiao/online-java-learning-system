const api = {
  Login: '/auth/login',
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user/info',

  //get token
  getToken: '/auth/token/',
  // 下面是自己的用户认证的接口
  UserRegister: '/user/register',
  UserLogin: '/user/login',
  UserSetting:'/user/settings',

  // 考试的接口
  ExamQuestionList: '/exam/question/list',
  ExamQuestionUpdate: '/exam/question/update',
  ExamQuestionSelection: '/exam/question/selection',
  ExamQuestionCreate: '/exam/question/create',
  ExamList: '/exam/list',
  // 获取问题列表，按照单选、多选和判断进行分类
  ExamQuestionTypeList: '/exam/question/type/list',
  ExamCreate: '/exam/create',
  ExamCardList: '/exam/card/list',
  QuestionList:'/exam/question/list/30',
  QuestionAdd: '/exam/question/create',
  // 获取考试详情
  ExamDetail: '/exam/detail/',
  // 获取考试详情
  QuestionDetail: '/exam/question/detail/',
  // 交卷
  FinishExam: '/exam/finish/',
  ExamRecordList: '/exam/record/list',
  recordDetail: '/exam/record/detail/',

  AdminRecordList: '/record/admin/list',
  AdminGetOneExamRecord:'/record/admin/detail',

  SubmitMarked: '/record/admin/marked/',
  //资源接口
  UploadHomework:'/res/upload/homework',
  ResList: '/res/themes',
  AdminResList:'/res/admin/list',
  AddRes: '/res/addRes',
  LessonDetail: '/res/themes',
  GetHomework:'/res/test/get/',
  SubmitHomework: '/res/test/submit/'
}
export default api
