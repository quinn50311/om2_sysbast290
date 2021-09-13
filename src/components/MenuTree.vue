<template>
  <div>
    <ul class="nav flex-column" id="root">
      <GroupTree style="text-align: left;" :tree="treeData" />
    </ul>
  </div>
</template>

<script>
import GroupTree from './GroupTree.vue';

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
    //清除所有陣列內容
    clearArray() {
      this.$store.dispatch('clearArray');
    },
    //取得system資料
    getSystemGroup() {
      const vm = this;
      const url = 'http://localhost:3000/row';

      vm.$http.get(url)
        .then(res => {
          vm.$store.dispatch('setSystemGroup', res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //取得group資料
    getProgramGroup() {
      const vm = this;
      const url = 'http://localhost:3001/row';

      vm.$http.get(url)
        .then(res => {
          vm.$store.dispatch('setProgramGroup', res.data);
        })
        .catch(err => {
          console.log(err);
        });

    },
    //取得program資料
    getProgram() {
      const vm = this;
      const url = 'http://localhost:3002/row';

      vm.$http.get(url)
        .then(res => {
          vm.$store.dispatch('setProgram', res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //取得programLang資料
    getProgramLang() {
      const vm = this;
      const url = 'http://localhost:3003/row';

      vm.$http.get(url)
        .then(res => {
          vm.$store.dispatch('setProgramLang', res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //取得programAll資料
    getProgramAll() {
      const vm = this;
      const url = 'http://localhost:3005/row';

      vm.$http.get(url)
        .then(res => {
          vm.$store.dispatch('setProgramAll', res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //組成menu tree
    setTreeData() {
      const vm = this;

      if (this.systemGroup && this.systemGroup.length > 0 &&
            this.programGroup && this.programGroup.length > 0 &&
            this.program && this.program.length > 0 &&
            this.programLang && this.programLang.length > 0 &&
            this.programAll && this.programAll.length > 0) {
        this.$store.dispatch('setTreeData');
      } else {
        window.setTimeout(() => {
          vm.setTreeData();
        }, 100);
      }
    }
  },
  computed: {
    treeData() {
      return this.$store.state.treeData;
    },
    systemGroup() {
      return this.$store.state.systemGroup;
    },
    programGroup() {
      return this.$store.state.programGroup;
    },
    program() {
      return this.$store.state.program;
    },
    programLang() {
      return this.$store.state.programLang;
    },
    programAll() {
      return this.$store.state.programAll;
    },
  },
  created() {
    this.clearArray();
    this.getSystemGroup();
    this.getProgramGroup();
    this.getProgram();
    this.getProgramLang();
    this.getProgramAll();
    this.setTreeData();
  }
}
</script>

<style lang="scss">
#root {
  padding-left: 20px;
}
</style>
