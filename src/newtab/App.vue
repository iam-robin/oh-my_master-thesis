<template>
  <div>
    <div class="info">
      <h1>fixed</h1>
      <!--<div class="menu">
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
      </div>-->
    </div>
    <div class="content">
      <h1>variable</h1>
      <!--<router-view></router-view>-->
    </div>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Fira+Mono');
body {
  margin: 0;
  padding: 0;
  font-family: 'Fira Mono', monospace;

  .info {
    width: 40%;
    position: fixed;
    background-color: #e5e5e5;
    height: 100vh;
  }

  .content {
    display: inline-block;
    margin-left: 40%;
    width: 60%;
    background-color: #fece60;
    min-height: 8000px;
  }

  .menu {
    display: flex;
    justify-content: left;

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
