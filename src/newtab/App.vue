<template>
  <div>

    <div class="menu">
      <router-link to="/page1">
        01 Aufrufe
      </router-link>
      <router-link to="/page2">
        02 Dauer
      </router-link>
      <router-link to="/page3">
        03 Ratio
      </router-link>
      <router-link to="/page4">
        04 Limits
      </router-link>
    </div>

    <router-view></router-view>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Fira+Mono');
body {
  margin: 0;
  padding: 0;
  font-family: 'Fira Mono', monospace;

  .menu {
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;

    a {
      padding: 0 24px;
      text-decoration: none;
      color: black;

      &.router-link-active {
        font-weight: 800;
      }
    }
  }
}
</style>
