<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" class="view" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" class="view" />
  </div>
</template>
<script>
;<style lang="stylus">@import '~common/stylus/index'</style>
