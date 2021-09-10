<template>
    <div>
        <li class="nav-item">
            <i class="fas fa-plus-square" @click="toggle"
                v-if="tree.group === true">
            </i>
            <i class="fas fa-folder" v-else @click="toggle"></i>
            <router-link to="/sys/sysbas/sysbast290/programGroup" v-if="nowLang === true"
                :id="tree.id" @click.prevent.stop.native="doClick(tree)">
                {{ ' ' }}{{ tree.nameTW }}
            </router-link>
            <router-link to="/sys/sysbas/sysbast290/programGroup" v-else
                :id="tree.id" @click.prevent.stop.native="doClick(tree)">
                {{ ' ' }}{{ tree.nameEN }}
            </router-link>
            <ul v-show="open" id="item"
                v-if="tree.node && tree.node.length > 0 &&
                tree.node[0].group !== undefined && tree.node[0].root !== undefined">
                <template v-if="nowLang === true">
                    <item v-for="(node, index) in tree.node" :tree="node" :key="index">
                        {{ node.nameTW }}
                    </item>
                </template>
                <template v-else>
                    <item v-for="(node, index) in tree.node" :tree="node" :key="index">
                        {{ node.nameEN }}
                    </item>
                </template>
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
            open: false,
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

            if (vm.nowLang === true)
                vm.$store.dispatch('setNowName', tree.nameTW);
            else
                vm.$store.dispatch('setNowName', tree.nameEN);
                
            //發出切換Tab訊號
            if (tree.root === false && tree.group === false)
                bus.$emit('changeToProgramTab', 'pg', undefined);
            else if (tree.group === true)
                bus.$emit('changeToProgramTab', 'gp', tree.locationNo);
            else if (tree.root === true && tree.group === false)
                bus.$emit('changeToProgramTab', 'root', undefined);

            //設定第二層程式
            if (tree.group === false && tree.root === false)
                vm.$store.dispatch('setProgram', tree.node);
        }
    },
    computed: {
        nowLang() {
            return this.$store.state.nowLang;
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
