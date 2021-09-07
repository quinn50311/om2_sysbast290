<template>
    <div>
        <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
            <router-link class="navbar-brand col-md-3 col-lg-2 mr-0 px-3" to="/">首頁</router-link>
            <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-toggle="collapse" data-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search">
            <ul class="navbar-nav px-3">
                <li class="nav-item text-nowrap">
                    <router-link id="signOut" to="/">Sign out</router-link>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
#signOut {
    text-decoration: none;
    color: rgb(29, 167, 231);
}
</style>
