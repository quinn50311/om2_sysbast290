<template>
    <div>
        <nav id="sidebarMenu" class="col-md-3 col-lg-3 d-md-block bg-light sidebar collapse">
            <div class="sidebar-sticky pt-3">
                    <MenuTree />
            </div>
        </nav>
    </div>
</template>

<script>
import MenuTree from './MenuTree.vue'

export default {
    components: {
        MenuTree
    },
    data() {
        return {
            
        }
    }
}
</script>

<style lang="scss">

</style>
