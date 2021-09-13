<template>
  <div>
    <ul class="nav flex-column" id="root">
      <GroupTree style="text-align: left;" :tree="treeData" />
    </ul>
  </div>
</template>

<script>
import GroupTree from './GroupTree.vue';
import { bus } from '../common/bus';

export default {
  name: 'MenuTree',
  components: {
    GroupTree
  },
  data() {
    return {
      
    };
  },
  methods: {
    //取得menu tree資料
    getTree() {
      const url = 'http://localhost:3006/row';
      const vm = this;

      vm.$http.get(url)
        .then(res => {
          console.log('AllTreeData: ', res.data);
          vm.$store.dispatch('setTreeData', res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },












    // //傳送menu tree資料到第二層畫面
    // sendTreeData() {
    //   bus.$emit('getTree', this.treeData);
    // },
    // //menu tree群組位置更新
    // updateTreeData(programGroup, programGroupHead) {
    //   const vm = this;
    //   let headId = 0;

    //   let find = vm.treeData.node.find((item, index) => {
    //     if (index === programGroupHead) {
    //       headId = index;
    //       return true;
    //     }
    //   });

    //   if (find) {
    //     var filter = programGroup.filter(item => {
    //       return item.locationGroupHead === headId;
    //     });

    //     vm.treeData.node[headId].node = filter;
    //   } else {
    //     console.log('Not find (NenuTree.vue => updateTreeData)');
    //   }
    // }
  },
  computed: {
    treeData() {
      return this.$store.state.treeData;
    }
  },
  created() {
    this.getTree();








    // bus.$on('sendTreeData', this.sendTreeData);
    // this.$store.dispatch('getProgramLang');
    // bus.$on('sendSortTree', (programGroup, programGroupHead) => { this.updateTreeData(programGroup, programGroupHead); })
  },
  beforeDestroy() {
    // bus.$off('sendTreeData');
  }
}
</script>

<style lang="scss">
#root {
  padding-left: 20px;
}
</style>
