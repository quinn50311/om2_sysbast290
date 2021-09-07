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
      treeData: {
        name: 'Menu',
        locationNo: 1,
        root: true,
        group: false,
        node: []
      },
    };
  },
  methods: {
    //取得menu tree資料
    getTree() {
      const vm = this;
      let api = 'http://localhost:3000/row';

      vm.$store.commit('CLEARPROGRAMGROUP');

      vm.$http.get(api)
        .then(res => {
          res.data.forEach((item, index) => {
            vm.treeData.node.push({
              name: item.MODULENAMETW,
              locationNo: item.LOCATIONNO,
              root: false,
              group: true,
              node: [],
            });
            if (item.PROGRAMHEAD.length > 0) {
              item.PROGRAMHEAD.forEach(it => {
                vm.treeData.node[index].node.push({
                  name: it.PROGRAMGROUPNAMETW,
                  systemId: it.SYSTEMID,
                  programGroupId: it.PROGRAMGROUPID,
                  locationNo: it.LOCATIONNO,
                  root: false,
                  group: false,
                  node: [],
                });
                vm.$store.commit('SETPROGRAMGROUP', {
                  name: it.PROGRAMGROUPNAMETW,
                  programGroupId: it.PROGRAMGROUPID,
                  locationGroupHead: index,
                  locationNo: it.LOCATIONNO,
                  root: false,
                  group: false,
                  node: [],
                });
              });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //傳送menu tree資料到第二層畫面
    sendTreeData() {
      bus.$emit('getTree', this.treeData);
    },
    //menu tree群組位置更新
    updateTreeData(programGroup, programGroupHead) {
      const vm = this;
      let headId = 0;

      let find = vm.treeData.node.find((item, index) => {
        if (index === programGroupHead) {
          headId = index;
          return true;
        }
      });

      if (find) {
        var filter = programGroup.filter(item => {
          return item.locationGroupHead === headId;
        });

        vm.treeData.node[headId].node = filter;
      } else {
        console.log('Not find (NenuTree.vue => updateTreeData)');
      }
    }
  },
  created() {
    this.getTree();
    bus.$on('sendTreeData', this.sendTreeData);
    this.$store.dispatch('getProgramLang');
    bus.$on('sendSortTree', (programGroup, programGroupHead) => { this.updateTreeData(programGroup, programGroupHead); })
  },
  beforeDestroy() {
    bus.$off('sendTreeData');
  }
}
</script>

<style lang="scss">
#root {
  padding-left: 20px;
}
</style>
