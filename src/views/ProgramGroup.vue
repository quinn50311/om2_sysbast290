<template>
    <div v-if="groupIndex !== -1">
        <div class="container m-0 p-0">
            <div class="row d-flex justify-content-around">
                <div class="col-lg-2 ml-5">
                    <ul class="nav nav-pills">
                        <li class="nav-item">
                            <a class="nav-link p-1" aria-current="page" :class="{ active : gp }"
                                @click.prevent="changeTab('gp'), showThirdGroup()">
                                {{ '群組' }}
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link p-1" aria-current="page" :class="{ active : pg }"
                                @click.prevent="changeTab('pg'), searchAllProgram()">
                                {{ '程式' }}
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="col-lg-1">
                    {{ ' ' }}
                </div>
            </div>
            <div class="row d-flex justify-content-start">
                <div class="d-flex flex-column col-7" id="box">
                    <!-- 群組(第二層) -->
                    <perfect-scrollbar class="ps" v-if="gp && groupIndex !== undefined">
                        <template v-for="(item, index) in programGroup">
                            <div class="p-2 d-flex ml-auto" 
                                v-if="item.locationGroupHead === groupIndex && nowLang === true" :key="index">
                                <input class="el-radio" type="radio" :value="item.name" v-model="picked">
                                <label class="ml-1" :for="item.name">{{ item.nameTW }}</label>
                            </div>
                            <div class="p-2 d-flex ml-auto" 
                                v-if="item.locationGroupHead === groupIndex && nowLang === false" :key="index">
                                <input class="el-radio" type="radio" :value="item.name" v-model="picked">
                                <label class="ml-1" :for="item.name">{{ item.nameEN }}</label>
                            </div>
                        </template>
                    </perfect-scrollbar>
                    <!-- 根群組(第二層) -->
                    <perfect-scrollbar class="ps" v-else-if="gp && groupIndex === undefined">
                        <template v-for="(item, index) in treeData.node">
                            <div class="p-2 d-flex ml-auto" :key="index" v-if="nowLang === true">
                                <input class="el-radio" type="radio" :value="item.name" v-model="picked">
                                <label class="ml-1" :for="item.name">{{ item.nameTW }}</label>
                            </div>
                            <div class="p-2 d-flex ml-auto" :key="index" v-else>
                                <input class="el-radio" type="radio" :value="item.name" v-model="picked">
                                <label class="ml-1" :for="item.name">{{ item.nameEN }}</label>
                            </div>
                        </template>
                    </perfect-scrollbar>
                    <!-- 程式(第二層) -->
                    <perfect-scrollbar class="ps" v-else-if="pg">
                        <template>
                            <div class="p-2 d-flex ml-auto" v-for="(item, index) in treeProgram" :key="index">
                                <input class="el-radio" type="radio" :value="item" v-model="picked">
                                <label class="ml-1" :for="item" v-if="nowLang === true">{{ item.nameTW }}{{' '}}{{ item.programId }}</label>
                                <label class="ml-1" :for="item" v-else-if="nowLang === false">{{ item.nameEN }}{{' '}}{{ item.programId }}</label>
                            </div>
                        </template>
                    </perfect-scrollbar>
                </div>
                <div class="col-5" id="box2">
                    <!-- 群組(第三層) -->
                    <template v-if="gp && insertFlag === false && groupIndex !== undefined">
                        <div class="row mt-1 px-4 d-flex justify-content-start">
                            <label for="groupName" class="mt-5">{{'群組名稱'}}</label>
                            <br>
                            <div class="col-12 mt-1 d-flex justify-content-start">
                                <label for="tw" style="width: 50px">{{'(TW)'}}</label>
                                <input type="text" class="ml-3" v-model="groupNameTW">
                            </div>
                            <div class="col-12 mt-3 d-flex justify-content-start">
                                <label for="en" style="width: 50px">{{'(EN)'}}</label>
                                <input type="text" class="ml-3" v-model="groupNameEN">
                            </div>
                        </div>
                    </template>
                    <!-- 程式(第三層) -->
                    <perfect-scrollbar class="ps" v-else-if="pg">
                        <div class="p-2 d-flex justify-content-start" v-for="(item, index) in allProgramFilter"
                            :key="index">
                            <input class="allPG-radio" type="radio" :value="item" v-model="picked">
                            <label class="ml-1" :for="item" v-if="nowLang === true">
                                {{ item.PROGRAMNAMETW }}{{' '}}{{ item.PROGRAMID }}
                            </label>
                            <label class="ml-1" :for="item" v-else-if="nowLang === false">
                                {{ item.PROGRAMNAMEEN }}{{' '}}{{ item.PROGRAMID }}
                            </label>
                        </div>
                    </perfect-scrollbar>
                </div>
            </div>
        </div>
        <div class="row d-flex justify-content-end mr-5 px-5" id="btn">
                <div class="p-2">
                    <button @click="insertFlag ? newProgram() : newGroup()">新增</button>
                </div>
                <div class="p-2">
                    <button @click="deleteTreeNode(treeData)">刪除</button>
                </div>
                <div class="p-2">
                    <button @click="changeLocation('up')">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                </div>
                <div class="p-2">
                    <button @click="changeLocation('down')">
                        <i class="fas fa-arrow-down"></i>
                    </button>
                </div>
                <div class="p-2">
                    <button @click="refreshPage()">
                        {{ '刷新測試' }}
                    </button>
                </div>
            </div>
    </div>
</template>

<script>
import { bus } from '../common/bus';

export default {
    inject: ['reload'],
    data() {
        return {
            treeData: {},
            picked: '',
            groupIndex: -1,
            gp: true,
            pg: false,
            allProgram: [],
            insertFlag: true,
            groupNameTW: '',
            groupNameEN: '',
            allTree: []
        };
    },
    methods: {
        //要求treeData資料
        getTreeData() {
            bus.$emit('sendTreeData');
        },
        //透過api先抓取程式的program id 之後須額外抓中英文顯示
        getProgramList() {
            const vm = this;
            const url = 'http://localhost:3001/row';

            vm.$store.commit('CLEARPROGRAM');

            vm.$http.get(url)
                .then(res => {
                    // console.log(res.data);
                    vm.$store.dispatch('setProgram', res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //刪除treeData資料(遞迴)
        deleteTreeNode(tree) {
            const vm = this;

            if (vm.gp === true) {
                //刪除群組
                if (tree.node && tree.node.length > 0) {
                    for (let i = 0; i < tree.node.length; i++) {
                        if (tree.node[i].name === vm.picked) {
                            //刪除整個根群組
                            if (tree.node[i].group === true)
                                vm.$store.commit('CLEARPROGRAMGROUP', tree.node[i]);
                            //刪除單一小群組
                            else
                                vm.$store.commit('DELETEPROGRAMGROUPELE', tree.node[i]);
                            tree.node.splice(i, 1);
                            break;
                        }
                        else {
                            if (tree.node[i].node && tree.node[i].node.length > 0)
                                vm.deleteTreeNode(tree.node[i]);
                        }
                    }
                }
            } else {
                //刪除程式
                if (tree.node && tree.node.length > 0 && vm.picked !== '') {
                    let index = 0;
                    let find = vm.treeProgram.find((item, i) => {
                        if (item.programId === vm.picked.programId) {
                            index = i;
                            return true;
                        }
                    });
                    if (find)
                        vm.$store.commit('DELETETREEPROGRAMELE', index);
                    
                }
            }

            vm.picked = '';
        },
        //交換第二層選取的資料的上下位置
        changeLocation(status) {
            const vm = this;

            //交換程式位置
            if (vm.pg === true) {
                for(let i = 0; i < vm.treeProgram.length; i++) {
                    if (vm.treeProgram[i] === vm.picked) {
                        vm.$store.dispatch('replacePGEle', {
                            index: i,
                            upOrdown: status,
                            tab: 'pg'
                        });
                        break;
                    }
                }

                let index = 0;
                vm.allTree[0].node.forEach(item => {
                    if (item.node && item.node.length > 0) {
                        let find = item.node.find((it, i) => {
                            if (it.systemId === vm.picked.systemId &&
                                it.programGroupId === vm.picked.programGroupId) {
                                    index = i;
                                    return true;
                                }
                        });
                        item.node[index] = vm.treeProgram;
                    }
                });
                console.log(vm.allTree);
              //交換根群組位置
            } else if (vm.gp === true && vm.groupIndex === undefined) {
                let index = 0;
                let find = vm.treeData.node.find((item, i) => {
                    if (item.name === vm.picked) {
                        index = i;
                        return true;
                    }
                });

                if (status === 'down' && find && find !== vm.treeData.node[vm.treeData.node.length - 1]) {
                    let temp = vm.treeData.node[index + 1];
                    vm.$set(vm.treeData.node, index + 1, find);
                    vm.$set(vm.treeData.node, index, temp);
                    vm.treeData.node[index + 1].locationNo++;
                    vm.treeData.node[index].locationNo--;
                } else if (status === 'up' && find && find !== vm.treeData.node[0]) {
                    let temp = vm.treeData.node[index - 1];
                    vm.$set(vm.treeData.node, index - 1, find);
                    vm.$set(vm.treeData.node, index, temp);
                    vm.treeData.node[index - 1].locationNo--;
                    vm.treeData.node[index].locationNo++;
                }
              //交換小群組位置
            } else {
                for(let i = 0; i < vm.programGroup.length; i++) {
                    if (vm.programGroup[i].name === vm.picked) {
                        vm.$store.dispatch('replaceGPEle', {
                            index: i,
                            upOrdown: status,
                            tab: 'gp'
                        });
                        //傳送至root層刷新排序
                        bus.$emit('sendSortTree', vm.programGroup, vm.programGroup[i].locationGroupHead);
                        break;
                    }
                }
            }
        },
        //Tab切換
        //pg = program
        //gp = group
        changeTab(id) {
            this.picked = '';
            if (id === 'gp' && this.gp === false) {
                this.gp = true;
                this.pg = false;
            }
            else if (id === 'pg' && this.pg === false) {
                this.pg = true;
                this.gp = false;
            }
            else if (id === 'none') {
                this.pg = true;
                this.gp = false;
            } else if (id === 'root') {
                this.gp = true;
                this.pg = false;
            }
        },
        //設定新增程式或群組flag
        showThirdGroup() {
            this.insertFlag = false;
        },
        //設定新增程式或群組flag並抓取所有的程式
        searchAllProgram() {
            const url = 'http://localhost:3003/row';
            this.insertFlag = true;

            this.$http.get(url)
                .then(res => {
                    this.allProgram = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //新增群組到第二層
        newGroup() {
            let obj = {};
            let name = '';
            let len = this.treeData.node[this.groupIndex].node.length;

            // console.log(this.groupNameTW, this.groupNameEN);
            this.$store.dispatch('addGroup', {
                TWName: this.groupNameTW,
                ENName: this.groupNameEN,
                index: this.groupIndex
            });

            if (this.nowLang === true)
                name = this.groupNameTW;
            else
                name = this.groupNameEN;
            obj = {
                name: name,
                systemId: this.treeData.node[this.groupIndex].node[0].systemId,
                programGroupId: '',
                locationNo: String(Number(this.treeData.node[this.groupIndex].node[len - 1].locationNo) + 1),
                root: false,
                group: false,
                node: [],
            }

            this.treeData.node[this.groupIndex].node.push(obj);

            this.insertFlag = true;
            this.groupNameTW = '';
            this.groupNameEN = '';
        },
        //新增程式到第二層
        newProgram() {
            const vm = this;
            let obj = {};
            let len = vm.treeProgram.length;
            
            //第二層有程式
            if (vm.picked && vm.pg === true && vm.allProgramFilter && vm.allProgramFilter.length > 0 && 
                vm.treeProgram && vm.treeProgram.length > 0) {
                // console.log(vm.picked);
                obj = {
                    nameTW: vm.picked.PROGRAMNAMETW,
                    nameEN: vm.picked.PROGRAMNAMEEN,
                    systemId: vm.treeProgram[0].systemId,
                    programId: vm.picked.PROGRAMID,
                    programGroupId: vm.treeProgram[0].programGroupId,
                    locationNo: String(Number(vm.treeProgram[len - 1].locationNo) + 1)
                }
                vm.$store.dispatch('addProgram', obj);
              //第二層沒有程式(直接新增)
            } else if (vm.picked && vm.pg === true && vm.allProgramFilter && vm.allProgramFilter.length > 0 &&
                        vm.treeProgram && vm.treeProgram.length === 0) {
                // console.log(vm.picked);
                obj = {
                    nameTW: vm.picked.PROGRAMNAMETW,
                    nameEN: vm.picked.PROGRAMNAMEEN,
                    systemId: vm.picked.PROGRAMID.substr(0, 3),
                    programId: vm.picked.PROGRAMID,
                    programGroupId: vm.picked.PROGRAMID.substr(0, 6),
                    locationNo: '1'
                }
                vm.$store.dispatch('addProgram', obj);
            }
        },
        refreshPage() {
            this.reload();
            this.resetAllTree();
        },
        resetAllTree() {
            const url = 'http://localhost:3005/row';
            const vm = this;

            // this.$http.get(url)
            //     .then(res => {
            //         console.log(res);
            //         vm.test = res.data;
            //     })
            //     .catch(err => {
            //         console.log(err);
            //     });
        },
        getAllTree() {
            const url = 'http://localhost:3005/row';
            const vm = this;

            this.$http.get(url)
                .then(res => {
                    console.log(res);
                    vm.allTree = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // test1() {
        //     const url = 'http://localhost:3005/row/1';
        //     let data = this.treeData;
        //     const vm = this;

        //     data._id = "1";

        //     data.node.forEach(groupHead => {
        //         groupHead.node.forEach(program => {
        //             vm.program.forEach(item => {
        //                 if (item.programGroupId === program.programGroupId) {
        //                     let find = vm.programLang.find(it => {
        //                         if (it.programId === item.programId)
        //                             return true;
        //                     });
        //                     if (find) {
        //                         program.node.push({
        //                             systemId: find.systemId,
        //                             programGroupId: item.programGroupId,
        //                             programId: item.programId,
        //                             locationNo: item.locationNo,
        //                             nameTW: find.programNameTW,
        //                             nameEN: find.programNameEN,
        //                             node: []
        //                         });
        //                     }
        //                 }
        //             });
        //         });
        //     });

        //     vm.$http.put(url, data)
        //         .then(res => {
        //             console.log(res.data);
        //         })
        // }
    },
    computed: {
        //從store.js取得
        programGroup() {
            return this.$store.state.programGroup;
        },
        nowName() {
            return this.$store.state.nowName;
        },
        treeProgram() {
            return this.$store.state.treeProgram;
        },
        nowLang() {
            return this.$store.state.nowLang;
        },
        programLang() {
            return this.$store.state.programLang;
        },
        program() {
            return this.$store.state.program;
        },
        //第三層程式顯示過濾(依照system id)
        allProgramFilter() {
            const vm = this;

            //如果該群組有程式則需先過濾 否則直接顯示全部程式內容
            if (vm.treeProgram && vm.treeProgram.length > 0) {
                //先過濾出相同群組的程式
                let filters = vm.allProgram.filter(item => {
                    return item.PROGRAMID.substr(0, 3) === vm.treeProgram[0].systemId;
                });
                //再過濾掉已經在群組中的程式
                let sameFilters = filters.filter(item => {
                    let flag = false;
                    for (let i = 0; i < vm.treeProgram.length; i++) {
                        if (item.PROGRAMID === vm.treeProgram[i].programId) {
                            flag = false;
                            break;
                        } else
                            flag = true;
                    }
                    if (flag)
                        return item;
                });
                return sameFilters;
            } else {
                return vm.allProgram;
            }
        }
    },
    created() {
        //訂閱getTree並在收到emit值後assign到treeData
        bus.$on('getTree', tree => { this.treeData = Object.assign({}, tree); });
        bus.$on('changeToProgramTab', (id, index) => {
            this.changeTab(id);
            //傳進來的index從1開始
            if (index !== undefined)
                this.groupIndex = index - 1;
            else
                this.groupIndex = index;
        });
        this.getTreeData();
        this.getProgramList();
        //頁面reload之後nowLang會變為false 需再讀一次語系設定
        this.$store.dispatch('getNowLang');
        this.getAllTree();
    },
    beforeDestroy() {
        bus.$off('getTree');
        bus.$off('changeToProgramTab');
    }
}
</script>

<style scoped>
#box {
    background-color: rgb(231, 226, 226);
    width: 60%;
    border-right-style: solid;
    border-color: black;
    padding-right: 0px;
}

#box2 {
    background-color: rgb(231, 226, 226);
    width: 60%;
    border-left-style: solid;
    border-color: black;
    padding: 0;
}

/deep/ #box .ps .ps__thumb-y {
    background-color: yellowgreen;
}

#btn {
    height: calc(100vh - 93vh);
    position: relative;
}

/deep/ .ps {
    height: calc(100vh - 136px);
    width: 100%;
    position: relative;
}

/deep/ .el-radio {
    display: block;
    margin-left: 250px;
}

/deep/ .allPG-radio {
    display: block;
    margin-left: 0px;
}

/deep/ .nav-item .active {
    background-color: rgb(82, 124, 148);
}
</style>
