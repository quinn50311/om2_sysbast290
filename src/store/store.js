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
    //初始programGroup
    CLEARPROGRAMGROUP(state, payload) {
      if (payload === undefined)
        state.programGroup = [];
      else {
        let index = 0;
        let find = state.programGroup.find((item, i) => {
          if (item.name === payload.node[0].name) {
            index = i;
            return true;
          }
        });

        if (find)
          state.programGroup.splice(index, payload.node.length);
      }
    },
    //初始program
    CLEARPROGRAM(state) {
      state.program = [];
    },
    //初始programLang
    CLEARPROGRAMLANG(state) {
      state.programLang = [];
    },
    //初始treeProgram
    CLEARTREEPROGRAM(state) {
      state.treeProgram = [];
    },
    /*
      設定menu tree的 programGroup
      {
        name: ''
        programGroupId: ''
        locationGroupHead: 0、1...
        locationNo: 0、1...
        root: true / false
        group: true / false
        node: []
      }
    */
    SETPROGRAMGROUP(state, payload) {
      state.programGroup.push(payload);
    },
    //設定所有群組中的program
    SETPROGRAM(state, payload) {
      state.program.push({
        programGroupId: payload.PROGRAMGROUPID,
        programId: payload.PROGRAMID,
        locationNo: payload.LOCATIONNO
      });
    },
    //設定所有programLang
    SETPROGRAMLANG(state, payload) {
      state.programLang.push({
        systemId: payload.SYSID,
        programId: payload.PRGID,
        programNameTW: payload.PRGNAMETW,
        programNameEN: payload.PRGNAMEEN
      })
    },
    //設定第二層顯示的程式
    SETTREEPROGRAM(state, payload) {
      state.treeProgram.push(payload);
    },
    //設定游標點擊到的名稱
    SETNAME(state, payload) {
      state.nowName = payload;
    },
    //刪除一筆tree program
    DELETETREEPROGRAMELE(state, payload) {
      state.treeProgram.splice(payload, 1);
    },
    //刪除一筆programGroup
    DELETEPROGRAMGROUPELE(state, payload) {
      let index = 0;
      let find = state.programGroup.find((item, i) => {
        if (item.name === payload.name && item.locationNo === payload.locationNo) {
          index = i;
          return true;
        }
      });

      if (find)
        state.programGroup.splice(index, 1);
      else
        console.log('not find');
    },
    //交換程式的上下位置(第二層)
    REPLACEPGELE(state, payload) {
      if (payload.upOrdown === 'up' && payload.tab === 'pg') {
        let temp = state.treeProgram[payload.index - 1];
        Vue.set(state.treeProgram, payload.index - 1, state.treeProgram[payload.index]);
        Vue.set(state.treeProgram, payload.index, temp);
        state.treeProgram[payload.index].locationNo++;
        state.treeProgram[payload.index - 1].locationNo--;
      } else if (payload.upOrdown === 'down' && payload.tab === 'pg') {
        let temp = state.treeProgram[payload.index + 1];
        Vue.set(state.treeProgram, payload.index + 1, state.treeProgram[payload.index]);
        Vue.set(state.treeProgram, payload.index, temp);
        state.treeProgram[payload.index].locationNo--;
        state.treeProgram[payload.index + 1].locationNo++;
      }
    },
    //交換群組的上下位置(第二層)
    REPLACEGPELE(state, payload) {
      if (payload.upOrdown === 'up' && payload.tab === 'gp') {
        let temp = state.programGroup[payload.index - 1];
        Vue.set(state.programGroup, payload.index - 1, state.programGroup[payload.index]);
        Vue.set(state.programGroup, payload.index, temp);
        state.programGroup[payload.index].locationNo++;
        state.programGroup[payload.index - 1].locationNo--;
      } else if (payload.upOrdown === 'down' && payload.tab === 'gp') {
        let temp = state.programGroup[payload.index + 1];
        Vue.set(state.programGroup, payload.index + 1, state.programGroup[payload.index]);
        Vue.set(state.programGroup, payload.index, temp);
        state.programGroup[payload.index].locationNo--;
        state.programGroup[payload.index + 1].locationNo++;
      }
    },
    //新增群組到第二層
    ADDGROUP(state, payload) {
      state.programGroup.splice(payload.index, 0, payload.object);
    },
    //新增程式到第二層
    ADDPROGRAM(state, payload) {
      state.treeProgram.push(payload);
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
    // updateLoginCount(context) {
    //   context.commit('LOGINCOUNT', context.state.loginCount);
    // },
    //將所有群組中的程式透過api抓進來
    setProgram(context, payload) {
      payload.forEach(item => {
        context.commit('SETPROGRAM', item);
      });
    },
    //透過api抓所有程式的語系資料
    getProgramLang(context) {
      const url = 'http://localhost:3002/row';

      context.commit('CLEARPROGRAMLANG');
      axios.get(url)
        .then(res => {
          //context.commit('SETPROGRAMLANG', res.data);
          res.data.forEach(item => {
            context.commit('SETPROGRAMLANG', item);
          });
        })
        .catch(err => {
            console.log(err);
        });
    },
    //交換程式的上下位置(第二層)
    replacePGEle(context, payload) {
      if (payload.upOrdown === 'up' && payload.index !== 0 || 
          payload.upOrdown === 'down' && payload.index !== context.state.treeProgram.length - 1) {
            context.commit('REPLACEPGELE', payload);
      }
    },
    //交換群組的上下位置(第二層)
    replaceGPEle(context, payload) {
      if (payload.upOrdown === 'up' && context.state.programGroup[payload.index].locationNo - 1 !== 0 || 
          payload.upOrdown === 'down' && payload.index !== context.state.programGroup.length - 1) {
            if (payload.upOrdown === 'down' && 
                context.state.programGroup[payload.index + 1].locationNo - 1 !== 0)
              context.commit('REPLACEGPELE', payload);
            else if (payload.upOrdown === 'up')
              context.commit('REPLACEGPELE', payload);
          }
    },
    //新增群組
    addGroup(context, payload) {
      let TW = payload.TWName;
      let EN = payload.ENName;
      let index = payload.index;
      let programGroupIndex = 0;
      let obj = {};

      let find = context.state.programGroup.find(item => {
        if (item.locationGroupHead === index + 1)
          return true;
      });

      if (find)
        programGroupIndex = context.state.programGroup.indexOf(find);
      else
        programGroupIndex = context.state.programGroup.length;

      if (context.state.nowLang === true) {
        obj = {
          name: TW,
          locationGroupHead: index,
          locationNo: String(Number(context.state.programGroup[programGroupIndex - 1].locationNo) + 1),
          root: false,
          group: false,
          node: []
        };
      } else {
        obj = {
          name: EN,
          locationGroupHead: index,
          locationNo: String(Number(context.state.programGroup[programGroupIndex - 1].locationNo) + 1),
          root: false,
          group: false,
          node: []
        };
      }
      context.commit('ADDGROUP', {
        index: programGroupIndex,
        object: obj
      });
    },
    //新增程式到第二層
    addProgram(context, payload) {
      console.log(payload);
      context.commit('ADDPROGRAM', payload);
    }
  }
})
