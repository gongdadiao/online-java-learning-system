<template>
  <div id="codeEditor">
  </div>
</template>

<script>
export default {
  data(){
    return{
      file:{
        content:'aaa',
      },
      status: {
        row: 1,
        column: 1,
        mode: 'java'
      }
    }
  },
  mounted() {
    var editor = this._editor = ace.edit('codeEditor')
    editor.setTheme("ace/theme/monokai_new")
    editor.session.setMode("ace/mode/java")
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true
    })
    editor.focus()
    // this.tokens = {
    //   undo: PubSub.subscribe('edit-undo', () => {
    //     if (this.file.active) {
    //       editor.execCommand('undo')
    //     }
    //   }),
    //   redo: PubSub.subscribe('edit-redo', () => {
    //     if (this.file.active) {
    //       editor.execCommand('redo')
    //     }
    //   }),
    //   cut: PubSub.subscribe('edit-cut', () => {
    //     if (this.file.active) {
    //       editor.execCommand('cut')
    //     }
    //   }),
    //   copy: PubSub.subscribe('edit-copy', () => {
    //     if (this.file.active) {
    //       editor.execCommand('copy');
    //     }
    //   }),
    //   paste: PubSub.subscribe('edit-paste', () => {
    //     if (this.file.active) {
    //       editor.execCommand('paste')
    //     }
    //   }),
    //   selectAll: PubSub.subscribe('edit-select-all', () => {
    //     if (this.file.active) {
    //       editor.execCommand('selectall')
    //     }
    //   })
    // }
  }
}
</script>

<style >

</style>