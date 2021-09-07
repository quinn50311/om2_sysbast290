<template>
    <div>
        <li class="nav-item">
            <i class="fas fa-plus-square" @click="toggle"
                v-if="tree.group === true">
            </i>
            <i class="fas fa-folder" v-else @click="toggle"></i>
            <router-link to="/sys/sysbas/sysbast290/programGroup"
                :id="tree.id" @click.prevent.stop.native="doClick(tree)">
                {{ ' ' }}{{ tree.name }}
            </router-link>
            <ul v-show="open" v-if="tree.node && tree.node.length > 0" id="item">
                <item v-for="(node, index) in tree.node" :tree="node" :key="index">{{ node.name }}</item>
            </ul>
        </li>
    </div>
</template>

<script>
import { bus } from '../common/bus';

export default {
    name: 'item',
    props: {
        tree: Object
    },
    data() {
        return {
            open: false
        }
    },
    methods: {
        //展開tree
        toggle() {
            if (this.tree.node && this.tree.node.length > 0)
                this.open = !this.open;
        },
        //處理點選事件 切換Tab
        doClick(tree) {
            const vm = this;

            vm.$store.commit('CLEARTREEPROGRAM');
            vm.$store.commit('SETNAME', tree.name);
            
            //發出切換Tab訊號
            if (tree.root === false && tree.group === false)
                bus.$emit('changeToProgramTab', 'pg', undefined);
            else if (tree.group === true)
                bus.$emit('changeToProgramTab', 'gp', tree.locationNo);
            else if (tree.root === true && tree.group === false)
                bus.$emit('changeToProgramTab', 'root', undefined);

            window.setTimeout(() => {
                //設定第二層程式
                vm.program.forEach(item => {
                    if (item.programGroupId !== undefined && item.programGroupId === tree.programGroupId) {
                        // console.log(item.programId);
                        vm.programLang.forEach(it => {
                            if (it.programId === item.programId) {
                                // console.log(it.programNameTW);
                                vm.$store.commit('SETTREEPROGRAM', {
                                    nameTW: it.programNameTW,
                                    nameEN: it.programNameEN,
                                    systemId: it.systemId,
                                    programId: it.programId,
                                    programGroupId: item.programGroupId,
                                    locationNo: item.locationNo
                                });
                            }  
                        });
                    }
                });
            }, 500);
        }
    },
    computed: {
        programGroup() {
            return this.$store.state.programGroup;
        },
        program() {
            return this.$store.state.program;
        },
        programLang() {
            return this.$store.state.programLang;
        }
    },
}
</script>

<style lang="scss">
a {
    color: rgb(23, 26, 190);
    cursor: pointer;
}

a:hover {
    color: black;
    text-decoration: none;
}

a:active {
  color: black;
}

#item {
    padding-left: 20px;
}
</style>
