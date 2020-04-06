<template>
  <div>
<!--    <object width="100%" height="100%" id="_1585109740848">-->
<!--      <embed src="https://view.officeapps.live.com/op/view.aspx?src=http://q6lxlrdig.bkt.clouddn.com/%E4%B8%AA%E4%BA%BA%E7%AE%80%E5%8E%86.pptx"-->
<!--             n-->
<!--             width="100%"-->
<!--             height="100%"-->
<!--             >-->
<!--    </object>-->
    <a-form :form="form">
      <a-form-item >
        <a-input v-model="a" v-decorator="['a',{rules:[{required:true,message:'必须给我填好了'},{validator:this.handleDec}]}]"></a-input>
      </a-form-item>
      <a-form-item>
        <a-input v-model="b" v-decorator="['b',{rules:[{required:true,message:'必须给我填好了'}]}]"></a-input>
      </a-form-item>
      <a-button @click="handleOk">确定</a-button>
    </a-form>
  </div>
</template>

<script>
  export default {
    name: 'TestHome',
    data(){
      return{
        form:this.$form.createForm(),
        a:'',
        b:'',
        c:''
      }
    },
    methods:{
      handleOk(){
        this.form.validateFields((error,values)=>{
          if(error != null){
            console.log(this.a)
            console.log(this.b)
            console.log('存在问题')
          }else {
            console.log(this.a)
            console.log(this.b)
            console.log('没有问题')
          }
        })
      },
      handleDec(rule,value,callback){
        if(/[1-9]/.test(value)){
          callback(new Error('不可以包含数字'))
        }
        callback()
      }
    }
  }
</script>


<style scoped>
  .object{
    font: 12px/1.5 "Arial", "Hiragino Sans GB", "SimSun",\5b8b\4f53, "serif";
    color: #333;
    font-size: 12px;
    font-family: "Arial","Hiragino Sans GB","Microsoft YaHei", \5fae\8f6f\96c5\9ed1, "Helvetica", "sans-serif";
    width: 100%;
    height: 100%;
  }

</style>