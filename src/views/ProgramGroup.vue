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
                        <template v-for="(item, index) in treeData.node[groupIndex].node">
                            <div class="p-2 d-flex ml-auto" :key="index">
                                <input class="el-radio" type="radio" :value="item" v-model="picked">
                                <label class="ml-1" :for="item.nameTW" v-if="nowLang === true">
                                    {{ item.nameTW }}
                                </label>
                                <label class="ml-1" :for="item.nameEN" v-else-if="nowLang === false">
                                    {{ item.nameEN }}
                                </label>
                            </div>
                        </template>
                    </perfect-scrollbar>
                    <!-- 根群組(第二層) -->
                    <perfect-scrollbar class="ps" v-else-if="gp && groupIndex === undefined">
                        <template v-for="(item, index) in treeData.node">
                            <div class="p-2 d-flex ml-auto" :key="index">
                                <input class="el-radio" type="radio" :value="item" v-model="picked">
                                <label class="ml-1" :for="item.nameTW" v-if="nowLang === true">
                                    {{ item.nameTW }}
                                </label>
                                <label class="ml-1" :for="item.nameEN" v-else-if="nowLang === false">
                                    {{ item.nameEN }}
                                </label>
                            </div>
                        </template>
                    </perfect-scrollbar>
                    <!-- 程式(第二層) -->
                    <perfect-scrollbar class="ps" v-else-if="pg">
                        <template>
                            <div class="p-2 d-flex ml-auto" v-for="(item, index) in program" :key="index">
                                <input class="el-radio" type="radio" :value="item" v-model="picked">
                                <label class="ml-1" :for="item"
                                    v-if="nowLang === true">
                                    {{ item.nameTW }}{{' ('}}{{ item.programId }}{{ ')' }}
                                </label>
                                <label class="ml-1" :for="item"
                                    v-else-if="nowLang === false">
                                    {{ item.nameEN }}{{' ('}}{{ item.programId }}{{ ')' }}
                                </label>
                            </div>
                        </template>
                    </perfect-scrollbar>
                </div>
                <div class="col-5" id="box2">
                    <!-- 群組(第三層) -->
                    <template v-if="gp && insertFlag === false && groupIndex !== undefined">
                        <div class="row mt-1 px-4 d-flex justify-content-start">
                            <label for="groupName" class="mt-3" v-if="nowLang === true">
                                {{'群組名稱'}}
                            </label>
                            <label for="groupName" class="mt-3" v-else-if="nowLang === false">
                                {{'Group Name'}}
                            </label>
                            <div class="col-12 mt-1 d-flex justify-content-start">
                                <label for="tw" style="width: 50px">{{'(TW)'}}</label>
                                <input type="text" class="ml-3" v-model="groupNameTW">
                            </div>
                            <div class="col-12 mt-3 d-flex justify-content-start">
                                <label for="en" style="width: 50px">{{'(EN)'}}</label>
                                <input type="text" class="ml-3" v-model="groupNameEN">
                            </div>
                            <div class="col-12 mt-3 d-flex justify-content-start">
                                <label for="en" style="width: 50px">{{'(GRPID)'}}</label>
                                <input type="text" class="ml-3" v-model="programGroupId">
                            </div>
                        </div>
                    </template>
                    <!-- 程式(第三層) -->
                    <perfect-scrollbar class="ps" v-else-if="pg">
                        <div class="p-2 d-flex justify-content-start" v-for="(item, index) in allProgramFilter"
                            :key="index">
                            <input class="allPG-radio" type="radio" :value="item" v-model="picked">
                            <label class="ml-1" :for="item" v-if="nowLang === true">
                                {{ item.PROGRAMNAMETW }}{{' ('}}{{ item.PROGRAMID }}{{ ')' }}
                            </label>
                            <label class="ml-1" :for="item" v-else-if="nowLang === false">
                                {{ item.PROGRAMNAMEEN }}{{' ('}}{{ item.PROGRAMID }}{{ ')' }}
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
                    <button @click="deleteTreeNode()">刪除</button>
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
            picked: '',
            groupIndex: -1,
            gp: true,
            pg: false,
            allProgram: [],
            insertFlag: true,
            groupNameTW: '',
            groupNameEN: '',
            programGroupId: '',
            allTree: []
        };
    },
    methods: {
        //刪除treeData資料(遞迴)
        deleteTreeNode() {
            this.$store.dispatch('deleteItem', {
                tree: this.treeData,
                picked: this.picked
            });
        },
        //交換第二層選取的資料的上下位置
        changeLocation(status) {
            this.$store.dispatch('changeLocation', {
                tree: this.treeData,
                picked: this.picked,
                status: status
            });
        },
        //Tab切換
        //pg = program
        //gp = group
        changeTab(id) {
            this.picked = '';
            this.groupNameTW = '';
            this.groupNameEN = '';
            this.programGroupId = '';
            if (id === 'gp' && this.gp === false) {
                this.gp = true;
                this.pg = false;
                this.insertFlag = false;
            }
            else if (id === 'pg' && this.pg === false) {
                this.pg = true;
                this.gp = false;
                this.insertFlag = true;
            }
            else if (id === 'none') {
                this.pg = true;
                this.gp = false;
                this.insertFlag = true;
            } else if (id === 'root') {
                this.gp = true;
                this.pg = false;
                this.insertFlag = false;
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
            if (this.groupNameTW !== '' && this.groupNameEN !== '' && this.programGroupId !== '') {
                let len = this.treeData.node[this.groupIndex].node.length;

                this.$store.dispatch('addGroup', {
                    nameTW: this.groupNameTW,
                    nameEN: this.groupNameEN,
                    grpid: this.programGroupId,
                    index: this.groupIndex,
                    length: len
                });
            }
            this.groupNameTW = '';
            this.groupNameEN = '';
            this.programGroupId = ''
        },
        //新增程式到第二層
        newProgram() {
            let len = this.program.length;
            let obj = {};
            
            //第二層有程式
            if (this.picked && this.pg === true && this.allProgramFilter && this.allProgramFilter.length > 0 && 
                this.program.length > 0) {
                obj = {
                    systemId: this.program[0].systemId,
                    programGroupId: this.picked.PROGRAMID.substr(0, 6),
                    programId: this.picked.PROGRAMID,
                    locationNo: String(Number(this.program[len - 1].locationNo) + 1),
                    nameTW: this.picked.PROGRAMNAMETW,
                    nameEN: this.picked.PROGRAMNAMEEN,
                    node: []
                }
                this.$store.dispatch('addProgram', {
                    object: obj,
                    groupName: this.nowName
                });
              //第二層沒有程式(直接新增)
            } else if (this.picked && this.pg === true && this.allProgramFilter && this.allProgramFilter.length > 0 &&
                        this.program.length === 0) {
                obj = {
                    systemId: this.picked.PROGRAMID.substr(0, 3),
                    programGroupId: this.picked.PROGRAMID.substr(0, 6),
                    programId: this.picked.PROGRAMID,
                    locationNo: '1',
                    nameTW: this.picked.PROGRAMNAMETW,
                    nameEN: this.picked.PROGRAMNAMEEN,
                    node: []
                }
                this.$store.dispatch('addProgram', {
                    object: obj,
                    groupName: this.nowName
                });
            }

            this.picked = '';
        },
        refreshPage() {
            this.resetAllTree();
            this.reload();
        },
        resetAllTree() {
            const url = 'http://localhost:3005/row/1';
            const vm = this;

            this.$http.put(url, this.treeData)
                .then(res => {
                    console.log(res);
                    vm.test = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    computed: {
        //從store.js取得
        nowName() {
            return this.$store.state.nowName;
        },
        nowLang() {
            return this.$store.state.nowLang;
        },
        treeData() {
            return this.$store.state.treeData;
        },
        program() {
            return this.$store.state.program;
        },
        //第三層程式顯示過濾(依照system id)
        allProgramFilter() {
            const vm = this;

            //如果該群組有程式則需先過濾 否則直接顯示全部程式內容
            if (vm.program && vm.program.length > 0) {
                //先過濾出相同群組的程式
                let filters = vm.allProgram.filter(item => {
                    return item.PROGRAMID.substr(0, 3) === vm.program[0].systemId;
                });
                //再過濾掉已經在群組中的程式
                let sameFilters = filters.filter(item => {
                    let flag = false;
                    for (let i = 0; i < vm.program.length; i++) {
                        if (item.PROGRAMID === vm.program[i].programId) {
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
        bus.$on('changeToProgramTab', (id, index) => {
            this.changeTab(id);
            //傳進來的index從1開始
            if (index !== undefined)
                this.groupIndex = index - 1;
            else
                this.groupIndex = index;
        });
        //頁面reload之後nowLang會變為false 需再讀一次語系設定
        this.$store.dispatch('getNowLang');
    },
    beforeDestroy() {
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
