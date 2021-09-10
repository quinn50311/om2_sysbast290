import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,

  state: {
    //現在登入的系統的語系
    nowLang: false,
    //儲存下次登入系統時的語系
    lang: false,
    login: false,
    treeData: {},






    programGroup: [],
    program: [],
    programLang: [],
    treeProgram: [],
    nowName: '',
  },
  mutations: {
    //設定現在語系
    NOWLANG(state, payload) {
      state.nowLang = payload;
    },
    //設定重新登入後的語系
    LANG(state, payload) {
      state.lang = payload;
    },
    //判斷是否登入過
    LOGIN(state, payload) {
      state.login = payload;
    },
    NOWNAME(state, payload) {
      state.nowName = payload;
    },
    TREEDATA(state, payload) {
      state.treeData = payload;
    },
    PROGRAM(state, payload) {
      state.program = payload;
    },
    DELETEITEM(state, payload) {
      if (payload.tree.node && payload.tree.node.length > 0) {
        for (let i = 0; i < payload.tree.node.length; i++) {
          if (payload.tree.node[i] === payload.picked)
            payload.tree.node.splice(i, 1);
          else {
            if (payload.tree.node[i].node && payload.tree.node[i].node.length > 0)
              this.commit('DELETEITEM', {
                tree: payload.tree.node[i],
                picked: payload.picked
              });
          }
        }
        state.treeData = payload.tree;
      }
    },
    CHANGELOCATION(state, payload) {
      if (payload.tree.node && payload.tree.node.length > 0) {
        for (let i = 0; i < payload.tree.node.length; i++) {
          if (payload.tree.node[i] === payload.picked && payload.status === 'up' && i !== 0) {
            //交換位置
            let temp = payload.tree.node[i - 1];
            Vue.set(payload.tree.node, i - 1, payload.tree.node[i]);
            Vue.set(payload.tree.node, i, temp);

            //將id及location number的值隨著位置變更
            payload.tree.node[i - 1].locationNo = String(Number(payload.tree.node[i - 1].locationNo) - 1);
            payload.tree.node[i].locationNo = String(Number(payload.tree.node[i].locationNo) + 1);
            payload.tree.node[i - 1].id = String(Number(payload.tree.node[i - 1].id) - 1);
            payload.tree.node[i].id = String(Number(payload.tree.node[i].id) + 1);
            break;
          } else if (payload.tree.node[i] === payload.picked && payload.status === 'down' &&
                    i !== payload.tree.node.length - 1) {
            //交換位置
            let temp = payload.tree.node[i + 1];
            Vue.set(payload.tree.node, i + 1, payload.tree.node[i]);
            Vue.set(payload.tree.node, i, temp);

            //將id及location number的值隨著位置變更
            payload.tree.node[i + 1].locationNo = String(Number(payload.tree.node[i + 1].locationNo) + 1);
            payload.tree.node[i].locationNo = String(Number(payload.tree.node[i].locationNo) - 1);
            payload.tree.node[i + 1].id = String(Number(payload.tree.node[i + 1].id) + 1);
            payload.tree.node[i].id = String(Number(payload.tree.node[i].id) - 1);
            break;
          } else {
            if (payload.tree.node[i].node && payload.tree.node[i].node.length > 0)
              this.commit('CHANGELOCATION', {
                tree: payload.tree.node[i],
                picked: payload.picked,
                status: payload.status
              });
          }
        }
      }
      state.treeData = payload.tree;
    },
    //新增群組到第二層
    ADDGROUP(state, payload) {
      state.treeData.node[payload.index].node.push(payload.object);
    },
    //新增程式到第二層
    ADDPROGRAM(state, payload) {
      state.program.push(payload.object);
      this.commit('UPDATETREEDATA', {
        object: state.program,
        groupName: payload.groupName,
        tree: state.treeData
      });
    },
    UPDATETREEDATA(state, payload) {
      const vm = this;

      if (payload.tree.node && payload.tree.node.length > 0) {
        for (let i = 0; i < payload.tree.node.length; i++) {
          if (payload.tree.node[i].nameTW === payload.groupName ||
              payload.tree.node[i].nameEN === payload.groupName) {
            payload.tree.node[i].node = payload.object;
            break;
          } else {
            if (payload.tree.node[i].node && payload.tree.node[i].node.length > 0) {
              vm.commit('UPDATETREEDATA', {
                object: payload.object,
                groupName: payload.groupName,
                tree: payload.tree.node[i]
              });
            }
              
          }
        }
      }
    }
  },
  actions: {
    //讀取localStorage的語系設定並設定現在的語系
    getNowLang(context) {
      if (context.state.login === false) {
        if (localStorage.getItem('LANG') === 'TW' || localStorage.getItem('LANG') === null) {
          context.commit('NOWLANG', true);
          context.commit('LANG', true);
        } else {
          context.commit('NOWLANG', false);
          context.commit('LANG', false);
        }
        context.commit('LOGIN', true);
      }
    },
    setNowName(context, payload) {
      context.commit('NOWNAME', payload);
    },
    setTreeData(context, payload) {
        context.commit('TREEDATA', payload[0]);
    },
    setProgram(context, payload) {
      if (payload && payload.length > 0)
        context.commit('PROGRAM', payload);
      else
        context.commit('PROGRAM', []);
    },
    deleteItem(context, payload) {
      context.commit('DELETEITEM', payload);
    },
    changeLocation(context, payload) {
      context.commit('CHANGELOCATION', payload);
    },
    //新增群組
    addGroup(context, payload) {
      let TW = payload.nameTW;
      let EN = payload.nameEN;
      let grpid = payload.grpid;
      let index = payload.index;
      let len = payload.length;
      let treeNode = context.state.treeData.node[index].node;
      let obj = {};

      obj = {
        nameTW: TW,
        nameEN: EN,
        systemId: treeNode[0].systemId,
        programGroupId: grpid,
        locationNo: String(Number(treeNode[len - 1].locationNo) + 1),
        id: String(Number(treeNode[len - 1].id) + 1),
        root: false,
        group: false,
        node: []
      };

      context.commit('ADDGROUP', {
        index: index,
        object: obj
      });
    },
    //新增程式到第二層
    addProgram(context, payload) {
      context.commit('ADDPROGRAM', payload);
    }
  }
})
