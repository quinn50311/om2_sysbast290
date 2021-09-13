<template>
    <div>
        <!-- <loading :active.sync="isLoading"/> -->
        <li class="nav-item">
            <i class="fas fa-plus-square" @click="toggle"
                v-if="tree.system === true">
            </i>
            <i class="fas fa-folder" v-else @click="toggle"></i>
            <router-link to="/sys/sysbas/sysbast290/programGroup" v-if="nowLang === true"
                :id="tree.id" @click.prevent.stop.native="doClick(tree)">
                {{ ' ' }}{{ tree.nameTW }}
            </router-link>
            <router-link to="/sys/sysbas/sysbast290/programGroup" v-else-if="nowLang === false"
                :id="tree.id" @click.prevent.stop.native="doClick(tree)">
                {{ ' ' }}{{ tree.nameEN }}
            </router-link>
            <ul v-show="open" v-if="tree.node && tree.node.length > 0" id="item">
                <template v-if="nowLang === true">
                    <item v-for="(node, index) in tree.node" :tree="node" :key="index">{{ node.nameTW }}</item>
                </template>
                <template v-else>
                    <item v-for="(node, index) in tree.node" :tree="node" :key="index">{{ node.nameEN }}</item>
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
            isLoading: false
        }
    },
    methods: {
        onLoading() {
            const vm = this;

            vm.isLoading = true;

            window.setTimeout(() => {
                vm.isLoading = false;
            }, 1000);
        },
        //展開tree
        toggle() {
            if (this.tree.node && this.tree.node.length > 0)
                this.open = !this.open;
        },
        //處理點選事件 切換Tab
        doClick(tree) {
            //發出切換Tab訊號
            if (tree.root === false && tree.group === true)
                bus.$emit('changeToProgramTab', 'pg', undefined, tree);
            else if (tree.system === true)
                bus.$emit('changeToProgramTab', 'gp', tree.LOCATIONNO);
            else if (tree.root === true && tree.group === false)
                bus.$emit('changeToProgramTab', 'root', undefined);
        }
    },
    computed: {
        nowLang() {
            return this.$store.state.nowLang;
        },
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
    created() {
        this.onLoading();
    }
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
