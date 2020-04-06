<template>
    <div>
      <a-layout id="components-layout-demo-fixed-sider">
        <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
          <div class="logo"></div>
          <a-menu
            @click="handleClick"
            style="width: 300px"
            mode="inline"
          >
            <template v-for="(item,index) in this.themes" >
              <a-sub-menu :key="item.themeId.toString()">
                <template slot="title">
                  <span>{{item.themeName}}</span>
                </template>
                <a-menu-item v-for="(jitem,jindex) in item.resourceList" :key="jitem.resId" @click="handleSelectRes(jitem)">
                  <span>{{jitem.resName}}</span>
                </a-menu-item>
              </a-sub-menu>
            </template>
          </a-menu>
        </a-layout-sider>
        <a-layout :style="{ marginLeft: '200px' }">
          <a-layout-header :style="{ background: '#fff', padding: 0 }" />
          <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
            <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
              ...
              <br />
              Really
              <br />...<br />...<br />...<br />
              long
              <br />...<br />...<br />...<br />...<br />...<br />...
              <br />...<br />...<br />...<br />...<br />...<br />...
              <br />...<br />...<br />...<br />...<br />...<br />...
              <br />...<br />...<br />...<br />...<br />...<br />...
              <br />...<br />...<br />...<br />...<br />...<br />...
              <br />...<br />...<br />...<br />...<br />...<br />...
              <br />...<br />...<br />...<br />...<br />...<br />
              content
            </div>
          </a-layout-content>
          <a-layout-footer :style="{ textAlign: 'center' }">
            Ant Design ©2018 Created by Ant UED
          </a-layout-footer>
        </a-layout>
      </a-layout>
    </div>
</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import { getResourceList } from '../../api/resource'
  import UserMenu from '../../components/tools/UserMenu'
  import { mapGetters } from 'vuex'

  export default {
    name: 'ResourceList',
    data() {
      return {
        themes:[]
      };
    },
    mounted(){
      var that=this
      getResourceList()
        .then(resp=>{
          console.log(resp)
          that.themes=resp.data
        })
    },
    methods: {
      handleClick(e) {
        console.log('click', e);
      },
      titleClick(e) {
        console.log('titleClick', e);
      },
      handleSelectRes(item){
        console.log(item)
        if(item.resType="video"){
          this.$router.push({name: "VideoDetail"})
        }
      }
    },
    watch: {
    }
  };

</script>

<style scoped>
  #components-layout-demo-fixed-sider .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
</style>