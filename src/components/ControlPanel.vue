<template>
    <div class="control-panel">
        <div v-if="readingMode" class="listener">
            <div class="ctrl-left"></div>
            <div class="ctrl-center"></div>
            <div class="ctrl-right"></div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            
        }
    },
    props:{
        readingMode:{//标记是否处于阅读模式。打开控制界面后置为false
            type:Boolean,
            default(){return true}
        }
    }
}
</script>
<style lang="scss" scoped>
.read-control{
    position: absolute;
    // left: 0;
    // top: 0;
    width: 100%;
    height: 100%;
    // background-color: green;
    // z-index: 1000;
}
</style>