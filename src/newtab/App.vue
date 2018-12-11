<template>
  <div>
    <div class="info-container">
      <MainHeader
        v-on:click.native="getActiveRoute()"
        :links="[
          {name: 'Top Four', to: '/ratio'},
          {name: 'List', to: '/list'},
          {name: 'Limits', to: '/limit'}]"
      />

      <main>
        <!-- time mode -->
        <div class="value" v-if="activeMode === 'time' && this.activeRoute !== 'limit'">
          <h1 v-if="periodSum.time > 0" class="sum">{{formatMS(periodSum.time, true)}}</h1>
          <h1 v-else class="sum">–</h1>
        </div>

        <!-- views mode -->
        <div class="value" v-if="activeMode === 'views' && this.activeRoute !== 'limit'">
          <h1 v-if="periodSum.views > 0" class="sum">{{periodSum.views}} views</h1>
          <h1 v-else class="sum">–</h1>
        </div>

        <!-- clicks mode -->
        <div class="value" v-if="activeMode === 'clicks' && this.activeRoute !== 'limit'">
          <h1 v-if="periodSum.clicks > 0" class="sum">{{periodSum.clicks}} clicks</h1>
          <h1 v-else class="sum">–</h1>
        </div>

        <!-- scroll mode -->
        <div class="value" v-if="activeMode === 'scroll' && this.activeRoute !== 'limit'">
          <h1 v-if="periodSum.scroll > 0" class="sum">{{parseInt(periodSum.scroll/100)}}K px</h1>
          <h1 v-else-if="periodSum.scroll > 1000" class="sum">{{parseInt(periodSum.scroll/1000)}}K px</h1>
          <h1 v-else-if="periodSum.scroll > 1000000" class="sum">{{parseInt(periodSum.scroll/1000000)}}M px</h1>
          <h1 v-else class="sum">–</h1>
        </div>

        <div class="date" :class="{ active: !this.menuActive }">
          <svg v-if="activeMode === 'time' && activeRoute !== 'limit'" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g>
              <path d="M8.00002 16C3.60001 16 0 12.4 0 8.00002C0 3.60001 3.60001 0 8.00002 0C12.4 0 16 3.60001 16 8.00002C16 12.4 12.4 16 8.00002 16ZM8.00002 1.33334C4.33334 1.33334 1.33334 4.33334 1.33334 8.00002C1.33334 11.6667 4.33334 14.6667 8.00002 14.6667C11.6667 14.6667 14.6667 11.6667 14.6667 8.00002C14.6667 4.33334 11.6667 1.33334 8.00002 1.33334Z" fill="black"/>
              <path d="M8.00004 8.66676C7.60004 8.66676 7.33337 8.40009 7.33337 8.00009V3.33342C7.33337 2.93342 7.60004 2.66675 8.00004 2.66675C8.40004 2.66675 8.66671 2.93342 8.66671 3.33342V8.00009C8.66671 8.40009 8.40004 8.66676 8.00004 8.66676Z" fill="black"/>
              <path d="M10.6667 11.3333C10.4667 11.3333 10.3334 11.2666 10.2 11.1333L7.53337 8.46659C7.26671 8.19992 7.26671 7.79992 7.53337 7.53325C7.80004 7.26659 8.20004 7.26659 8.46671 7.53325L11.1334 10.1999C11.4001 10.4666 11.4001 10.8666 11.1334 11.1333C11 11.2666 10.8667 11.3333 10.6667 11.3333Z" fill="black"/>
            </g>
          </svg>

          <svg v-if="activeMode === 'views' && activeRoute !== 'limit'" width="16" height="16" viewBox="0 0 16 16">
            <g>
              <path d="M8.00005 10.6666C6.53338 10.6666 5.33337 9.46659 5.33337 7.99992C5.33337 6.53325 6.53338 5.33325 8.00005 5.33325C9.46672 5.33325 10.6667 6.53325 10.6667 7.99992C10.6667 9.46659 9.46672 10.6666 8.00005 10.6666ZM8.00005 6.66659C7.26671 6.66659 6.66671 7.26659 6.66671 7.99992C6.66671 8.73326 7.26671 9.33326 8.00005 9.33326C8.73338 9.33326 9.33338 8.73326 9.33338 7.99992C9.33338 7.26659 8.73338 6.66659 8.00005 6.66659Z" fill="#B4BBC5"/>
              <path d="M8.00012 14C3.02087 14 0.232487 8.6 0.0997071 8.375C-0.0330729 8.15 -0.0330729 7.85 0.0997071 7.625C0.232487 7.4 3.02087 2 8.00012 2C12.9794 2 15.7678 7.4 15.9005 7.625C16.0333 7.85 16.0333 8.15 15.9005 8.375C15.7678 8.6 12.9794 14 8.00012 14ZM1.4939 8C2.1578 9.125 4.48145 12.5 8.00012 12.5C11.5188 12.5 13.8424 9.125 14.5063 8C13.8424 6.875 11.5188 3.5 8.00012 3.5C4.48145 3.5 2.1578 6.875 1.4939 8Z" fill="#B4BBC5"/>
            </g>
          </svg>

          <svg v-if="activeMode === 'clicks' && activeRoute !== 'limit'" width="16" height="16" version="1.1" viewBox="0 0 16 16">
            <g transform="scale(0.666667)">
              <path fill="#000" d="M14,23c0,0 0,0 0,0c-0.4,0 -0.8,-0.3 -0.9,-0.7l-2.3,-6.9c-0.2,-0.5 0.1,-1.1 0.6,-1.3c0.5,-0.2 1.1,0.1 1.3,0.6l1.4,4.3l6.1,-15.3l-15.3,6.2l4.3,1.4c0.5,0.2 0.8,0.7 0.6,1.3c-0.2,0.5 -0.7,0.8 -1.3,0.6l-6.9,-2.3c-0.3,-0.1 -0.6,-0.5 -0.6,-0.9c0,-0.4 0.2,-0.8 0.6,-1l20,-8c0.4,-0.1 0.8,0 1.1,0.3c0.3,0.3 0.4,0.7 0.2,1.1l-8,20c-0.1,0.4 -0.5,0.6 -0.9,0.6Z"></path>
              <path fill="#000" d="M4,23c-0.8,0 -1.5,-0.3 -2.1,-0.9c-1.2,-1.2 -1.2,-3.1 0,-4.2l6.3,-6.3c0.4,-0.4 1,-0.4 1.4,0c0.4,0.4 0.4,1 0,1.4l-6.3,6.3c-0.2,0.2 -0.3,0.4 -0.3,0.7c0,0.3 0.1,0.5 0.3,0.7c0.4,0.4 1,0.4 1.4,0l6.3,-6.3c0.4,-0.4 1,-0.4 1.4,0c0.4,0.4 0.4,1 0,1.4l-6.3,6.3c-0.6,0.6 -1.3,0.9 -2.1,0.9Z"></path>
            </g>
          </svg>

          <svg v-if="activeMode === 'scroll' && activeRoute !== 'limit'" width="16" height="16" version="1.1" viewBox="0 0 16 16" >
            <g transform="scale(0.666667)">
              <path fill="#000" d="M12,24c-6.6,0 -12,-5.4 -12,-12c0,-6.6 5.4,-12 12,-12c6.6,0 12,5.4 12,12c0,6.6 -5.4,12 -12,12Zm0,-22c-5.5,0 -10,4.5 -10,10c0,5.5 4.5,10 10,10c5.5,0 10,-4.5 10,-10c0,-5.5 -4.5,-10 -10,-10Z"></path>
              <path fill="#000" d="M15,11c-0.3,0 -0.5,-0.1 -0.7,-0.3l-2.3,-2.3l-2.3,2.3c-0.4,0.4 -1,0.4 -1.4,0c-0.4,-0.4 -0.4,-1 0,-1.4l3,-3c0.4,-0.4 1,-0.4 1.4,0l3,3c0.4,0.4 0.4,1 0,1.4c-0.2,0.2 -0.4,0.3 -0.7,0.3Z"></path>
              <path fill="#000" d="M12,18c-0.3,0 -0.5,-0.1 -0.7,-0.3l-3,-3c-0.4,-0.4 -0.4,-1 0,-1.4c0.4,-0.4 1,-0.4 1.4,0l2.3,2.3l2.3,-2.3c0.4,-0.4 1,-0.4 1.4,0c0.4,0.4 0.4,1 0,1.4l-3,3c-0.2,0.2 -0.4,0.3 -0.7,0.3Z"></path>
            </g>
          </svg>

          {{formatedDate}}
        </div>

      </main>

      <footer>
        <div class="menu" :class="{ active: this.menuActive, limit: this.activeRoute === 'limit' }">

          <div class="menu-container date">
            <span v-on:click="prevDate()" class="arrow prev">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M13.3334 8H2.66669" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.66669 12L2.66669 8L6.66669 4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>

              <h2>{{formatedDate}}</h2>

            <span v-on:click="nextDate()" class="arrow next">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M13.3334 8H2.66669" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.66669 12L2.66669 8L6.66669 4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>

          <div class="menu-container period">
            <span v-on:click="prevPeriod()" class="arrow prev">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M13.3334 8H2.66669" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.66669 12L2.66669 8L6.66669 4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <ul>

              <li v-on:click="setPeriod('day')" :class="{ active: getPeriod('day') }">
                <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.67475 11.7168C7.87949 11.6144 8.12048 11.6144 8.32523 11.7168L15.5978 15.3531C15.8442 15.4763 15.9998 15.7281 15.9998 16.0036C15.9998 16.279 15.8442 16.5309 15.5978 16.654L8.32523 20.2903C8.12048 20.3927 7.87949 20.3927 7.67475 20.2903L0.402165 16.654C0.155781 16.5309 0.000146072 16.279 0.000146072 16.0036C0.000146072 15.7281 0.155781 15.4763 0.402165 15.3531L7.67475 11.7168ZM2.3536 16.0036L7.99999 18.8268L13.6464 16.0036L7.99999 13.1804L2.3536 16.0036Z" fill="black"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.076938 19.3146C0.256563 18.9553 0.693407 18.8097 1.05266 18.9894L8 22.463L14.9473 18.9894C15.3066 18.8097 15.7434 18.9553 15.9231 19.3146C16.1027 19.6738 15.9571 20.1107 15.5978 20.2903L8.32524 23.9266C8.1205 24.029 7.8795 24.029 7.67476 23.9266L0.402178 20.2903C0.0429279 20.1107 -0.102687 19.6738 0.076938 19.3146Z" fill="black"/>
                </svg>
                <span>day</span>
              </li>

              <li v-on:click="setPeriod('week')" :class="{ active: getPeriod('week') }">
                <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.67475 8.07678C7.87949 7.97441 8.12048 7.97441 8.32523 8.07678L15.5978 11.7131C15.8442 11.8363 15.9998 12.0881 15.9998 12.3635C15.9998 12.639 15.8442 12.8908 15.5978 13.014L8.32523 16.6503C8.12048 16.7527 7.87949 16.7527 7.67475 16.6503L0.402165 13.014C0.155781 12.8908 0.000146072 12.639 0.000146072 12.3635C0.000146072 12.0881 0.155781 11.8363 0.402165 11.7131L7.67475 8.07678ZM2.3536 12.3635L7.99999 15.1867L13.6464 12.3635L7.99999 9.54036L2.3536 12.3635Z" fill="#B4BBC5"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.076938 19.3108C0.256563 18.9515 0.693407 18.8059 1.05266 18.9855L8 22.4592L14.9473 18.9855C15.3066 18.8059 15.7434 18.9515 15.9231 19.3108C16.1027 19.67 15.9571 20.1069 15.5978 20.2865L8.32524 23.9228C8.1205 24.0252 7.8795 24.0252 7.67476 23.9228L0.402178 20.2865C0.0429279 20.1069 -0.102687 19.67 0.076938 19.3108Z" fill="#B4BBC5"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.076938 15.6746C0.256563 15.3153 0.693407 15.1697 1.05266 15.3493L8 18.823L14.9473 15.3493C15.3066 15.1697 15.7434 15.3153 15.9231 15.6746C16.1027 16.0338 15.9571 16.4707 15.5978 16.6503L8.32524 20.2866C8.1205 20.389 7.8795 20.389 7.67476 20.2866L0.402178 16.6503C0.0429279 16.4707 -0.102687 16.0338 0.076938 15.6746Z" fill="#B4BBC5"/>
                </svg>
                <span>week</span>
              </li>

              <li v-on:click="setPeriod('month')" :class="{ active: getPeriod('month') }">
                <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.076938 19.307C0.256563 18.9477 0.693407 18.8021 1.05266 18.9817L8 22.4554L14.9473 18.9817C15.3066 18.8021 15.7434 18.9477 15.9231 19.307C16.1027 19.6662 15.9571 20.1031 15.5978 20.2827L8.32524 23.919C8.1205 24.0213 7.8795 24.0213 7.67476 23.919L0.402178 20.2827C0.0429279 20.1031 -0.102687 19.6662 0.076938 19.307Z" fill="#B4BBC5"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.076938 15.6708C0.256563 15.3115 0.693407 15.1659 1.05266 15.3455L8 18.8192L14.9473 15.3455C15.3066 15.1659 15.7434 15.3115 15.9231 15.6708C16.1027 16.03 15.9571 16.4669 15.5978 16.6465L8.32524 20.2828C8.1205 20.3851 7.8795 20.3851 7.67476 20.2828L0.402178 16.6465C0.0429279 16.4669 -0.102687 16.03 0.076938 15.6708Z" fill="#B4BBC5"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.076938 12.0346C0.256563 11.6753 0.693407 11.5297 1.05266 11.7093L8 15.183L14.9473 11.7093C15.3066 11.5297 15.7434 11.6753 15.9231 12.0346C16.1027 12.3938 15.9571 12.8307 15.5978 13.0103L8.32524 16.6466C8.1205 16.7489 7.8795 16.7489 7.67476 16.6466L0.402178 13.0103C0.0429279 12.8307 -0.102687 12.3938 0.076938 12.0346Z" fill="#B4BBC5"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.67475 4.43676C7.87949 4.33439 8.12048 4.33439 8.32523 4.43676L15.5978 8.07306C15.8442 8.19625 15.9998 8.44807 15.9998 8.72353C15.9998 8.999 15.8442 9.25082 15.5978 9.37401L8.32523 13.0103C8.12048 13.1127 7.87949 13.1127 7.67475 13.0103L0.402165 9.37401C0.155781 9.25082 0.000146072 8.999 0.000146072 8.72353C0.000146072 8.44807 0.155781 8.19625 0.402165 8.07306L7.67475 4.43676ZM2.3536 8.72353L7.99999 11.5467L13.6464 8.72353L7.99999 5.90034L2.3536 8.72353Z" fill="#B4BBC5"/>
                </svg>
                <span>month</span>
              </li>

              <li v-on:click="setPeriod('total')" :class="{ active: getPeriod('total') }">
                <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.076938 19.307C0.256563 18.9477 0.693407 18.8021 1.05266 18.9818L8 22.4554L14.9473 18.9818C15.3066 18.8021 15.7434 18.9477 15.9231 19.307C16.1027 19.6662 15.9571 20.1031 15.5978 20.2827L8.32524 23.919C8.1205 24.0214 7.8795 24.0214 7.67476 23.919L0.402178 20.2827C0.0429279 20.1031 -0.102687 19.6662 0.076938 19.307Z" fill="#B4BBC5"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.076938 15.6708C0.256563 15.3115 0.693407 15.1659 1.05266 15.3456L8 18.8192L14.9473 15.3456C15.3066 15.1659 15.7434 15.3115 15.9231 15.6708C16.1027 16.03 15.9571 16.4669 15.5978 16.6465L8.32524 20.2828C8.1205 20.3852 7.8795 20.3852 7.67476 20.2828L0.402178 16.6465C0.0429279 16.4669 -0.102687 16.03 0.076938 15.6708Z" fill="#B4BBC5"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.076938 12.0346C0.256563 11.6753 0.693407 11.5297 1.05266 11.7093L8 15.183L14.9473 11.7093C15.3066 11.5297 15.7434 11.6753 15.9231 12.0346C16.1027 12.3938 15.9571 12.8307 15.5978 13.0103L8.32524 16.6466C8.1205 16.749 7.8795 16.749 7.67476 16.6466L0.402178 13.0103C0.0429279 12.8307 -0.102687 12.3938 0.076938 12.0346Z" fill="#B4BBC5"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.076938 8.43465C0.256563 8.0754 0.693407 7.92978 1.05266 8.10941L8 11.5831L14.9473 8.10941C15.3066 7.92978 15.7434 8.0754 15.9231 8.43465C16.1027 8.7939 15.9571 9.23074 15.5978 9.41037L8.32524 13.0467C8.1205 13.149 7.8795 13.149 7.67476 13.0467L0.402178 9.41037C0.0429279 9.23074 -0.102687 8.7939 0.076938 8.43465Z" fill="#B4BBC5"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.67485 0.836788C7.87959 0.734417 8.12058 0.734417 8.32532 0.836788L15.5979 4.47308C15.8443 4.59627 15.9999 4.84809 15.9999 5.12356C15.9999 5.39902 15.8443 5.65085 15.5979 5.77404L8.32532 9.41033C8.12058 9.5127 7.87959 9.5127 7.67485 9.41033L0.402263 5.77404C0.155879 5.65085 0.000244141 5.39902 0.000244141 5.12356C0.000244141 4.84809 0.155879 4.59627 0.402263 4.47308L7.67485 0.836788ZM2.3537 5.12356L8.00008 7.94675L13.6465 5.12356L8.00008 2.30037L2.3537 5.12356Z" fill="#B4BBC5"/>
                </svg>
                <span>total</span>
              </li>

            </ul>
            <span v-on:click="nextPeriod()" class="arrow next">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M13.3334 8H2.66669" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.66669 12L2.66669 8L6.66669 4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>

          <div class="menu-container mode">
            <span v-on:click="prevMode()" class="arrow prev">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M13.3334 8H2.66669" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.66669 12L2.66669 8L6.66669 4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <ul>
              <li v-on:click="setMode('time')" :class="{ active: getMode('time') }">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <g>
                    <path d="M8.00002 16C3.60001 16 0 12.4 0 8.00002C0 3.60001 3.60001 0 8.00002 0C12.4 0 16 3.60001 16 8.00002C16 12.4 12.4 16 8.00002 16ZM8.00002 1.33334C4.33334 1.33334 1.33334 4.33334 1.33334 8.00002C1.33334 11.6667 4.33334 14.6667 8.00002 14.6667C11.6667 14.6667 14.6667 11.6667 14.6667 8.00002C14.6667 4.33334 11.6667 1.33334 8.00002 1.33334Z" fill="black"/>
                    <path d="M8.00004 8.66676C7.60004 8.66676 7.33337 8.40009 7.33337 8.00009V3.33342C7.33337 2.93342 7.60004 2.66675 8.00004 2.66675C8.40004 2.66675 8.66671 2.93342 8.66671 3.33342V8.00009C8.66671 8.40009 8.40004 8.66676 8.00004 8.66676Z" fill="black"/>
                    <path d="M10.6667 11.3333C10.4667 11.3333 10.3334 11.2666 10.2 11.1333L7.53337 8.46659C7.26671 8.19992 7.26671 7.79992 7.53337 7.53325C7.80004 7.26659 8.20004 7.26659 8.46671 7.53325L11.1334 10.1999C11.4001 10.4666 11.4001 10.8666 11.1334 11.1333C11 11.2666 10.8667 11.3333 10.6667 11.3333Z" fill="black"/>
                  </g>
                </svg>
                <span>time</span>
              </li>

              <li v-on:click="setMode('views')" :class="{ active: getMode('views') }">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <g>
                    <path d="M8.00005 10.6666C6.53338 10.6666 5.33337 9.46659 5.33337 7.99992C5.33337 6.53325 6.53338 5.33325 8.00005 5.33325C9.46672 5.33325 10.6667 6.53325 10.6667 7.99992C10.6667 9.46659 9.46672 10.6666 8.00005 10.6666ZM8.00005 6.66659C7.26671 6.66659 6.66671 7.26659 6.66671 7.99992C6.66671 8.73326 7.26671 9.33326 8.00005 9.33326C8.73338 9.33326 9.33338 8.73326 9.33338 7.99992C9.33338 7.26659 8.73338 6.66659 8.00005 6.66659Z" fill="#B4BBC5"/>
                    <path d="M8.00012 14C3.02087 14 0.232487 8.6 0.0997071 8.375C-0.0330729 8.15 -0.0330729 7.85 0.0997071 7.625C0.232487 7.4 3.02087 2 8.00012 2C12.9794 2 15.7678 7.4 15.9005 7.625C16.0333 7.85 16.0333 8.15 15.9005 8.375C15.7678 8.6 12.9794 14 8.00012 14ZM1.4939 8C2.1578 9.125 4.48145 12.5 8.00012 12.5C11.5188 12.5 13.8424 9.125 14.5063 8C13.8424 6.875 11.5188 3.5 8.00012 3.5C4.48145 3.5 2.1578 6.875 1.4939 8Z" fill="#B4BBC5"/>
                  </g>
                </svg>
                <span>views</span>
              </li>

              <li v-on:click="setMode('clicks')" :class="{ active: getMode('clicks') }">
                <svg width="16" height="16" version="1.1" viewBox="0 0 16 16">
                  <g transform="scale(0.666667)">
                    <path fill="#000" d="M14,23c0,0 0,0 0,0c-0.4,0 -0.8,-0.3 -0.9,-0.7l-2.3,-6.9c-0.2,-0.5 0.1,-1.1 0.6,-1.3c0.5,-0.2 1.1,0.1 1.3,0.6l1.4,4.3l6.1,-15.3l-15.3,6.2l4.3,1.4c0.5,0.2 0.8,0.7 0.6,1.3c-0.2,0.5 -0.7,0.8 -1.3,0.6l-6.9,-2.3c-0.3,-0.1 -0.6,-0.5 -0.6,-0.9c0,-0.4 0.2,-0.8 0.6,-1l20,-8c0.4,-0.1 0.8,0 1.1,0.3c0.3,0.3 0.4,0.7 0.2,1.1l-8,20c-0.1,0.4 -0.5,0.6 -0.9,0.6Z"></path>
                    <path fill="#000" d="M4,23c-0.8,0 -1.5,-0.3 -2.1,-0.9c-1.2,-1.2 -1.2,-3.1 0,-4.2l6.3,-6.3c0.4,-0.4 1,-0.4 1.4,0c0.4,0.4 0.4,1 0,1.4l-6.3,6.3c-0.2,0.2 -0.3,0.4 -0.3,0.7c0,0.3 0.1,0.5 0.3,0.7c0.4,0.4 1,0.4 1.4,0l6.3,-6.3c0.4,-0.4 1,-0.4 1.4,0c0.4,0.4 0.4,1 0,1.4l-6.3,6.3c-0.6,0.6 -1.3,0.9 -2.1,0.9Z"></path>
                  </g>
                </svg>
                <span>clicks</span>
              </li>

              <li v-on:click="setMode('scroll')" :class="{ active: getMode('scroll') }">
                <svg width="16" height="16" version="1.1" viewBox="0 0 16 16" >
                  <g transform="scale(0.666667)">
                    <path fill="#000" d="M12,24c-6.6,0 -12,-5.4 -12,-12c0,-6.6 5.4,-12 12,-12c6.6,0 12,5.4 12,12c0,6.6 -5.4,12 -12,12Zm0,-22c-5.5,0 -10,4.5 -10,10c0,5.5 4.5,10 10,10c5.5,0 10,-4.5 10,-10c0,-5.5 -4.5,-10 -10,-10Z"></path>
                    <path fill="#000" d="M15,11c-0.3,0 -0.5,-0.1 -0.7,-0.3l-2.3,-2.3l-2.3,2.3c-0.4,0.4 -1,0.4 -1.4,0c-0.4,-0.4 -0.4,-1 0,-1.4l3,-3c0.4,-0.4 1,-0.4 1.4,0l3,3c0.4,0.4 0.4,1 0,1.4c-0.2,0.2 -0.4,0.3 -0.7,0.3Z"></path>
                    <path fill="#000" d="M12,18c-0.3,0 -0.5,-0.1 -0.7,-0.3l-3,-3c-0.4,-0.4 -0.4,-1 0,-1.4c0.4,-0.4 1,-0.4 1.4,0l2.3,2.3l2.3,-2.3c0.4,-0.4 1,-0.4 1.4,0c0.4,0.4 0.4,1 0,1.4l-3,3c-0.2,0.2 -0.4,0.3 -0.7,0.3Z"></path>
                  </g>
                </svg>
                <span>scroll</span>
              </li>

            </ul>
            <span v-on:click="nextMode()" class="arrow next">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M13.3334 8H2.66669" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.66669 12L2.66669 8L6.66669 4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
      
        </div>
        <button class="settings"
                :class="{ open: menuActive }"
                v-on:click="toggleMenu()">
          <span v-if="menuActive">Close</span>
          <span v-else>Settings</span>
        </button>
      </footer>
    </div>
    <div class="content-container" v-bind:class="{detail: detailPageActive}">
      <router-view :mode="activeMode"
        :data='relevantData'
        :entireData='data'
        :period='activePeriod'
        :date='storageDate'
        @detailPageActive="handleDetailPage">
      </router-view>
    </div>
  </div>
</template>

<script>
import MainHeader from './components/MainHeader.vue';

import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import formatMS from './functions/formatMS';
import getPeriodDays from './functions/getPeriodDays';
import mergeSameWebsitesInPeriod from './functions/mergeSameWebsitesInPeriod';

export default {
  name: 'app-view',
  data: function() {
    return {
      activeMode: 'time',
      activePeriod: 'day',
      date: null,
      formatedDate: '',
      storageDate: moment().format('YYYY-MM-DD'),
      data: [],
      relevantData: [],
      periodSum: {},
      detailPageActive: false,
      menuActive: false,
      activeRoute: this.$router.currentRoute.name,
    };
  },

  components: {
    MainHeader,
  },

  created: function() {
    // add key down event listener to window to detect key navigation
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        // next time period
        this.nextDate();
      } else if (e.key === 'ArrowLeft') {
        // prev time period
        this.prevDate();
      } else if (e.key === 'ArrowDown') {
        this.nextMode();
      } else if (e.key === 'ArrowUp') {
        this.prevMode();
      } else if (e.key === 'd') {
        // day mode
        this.setPeriod('day');
      } else if (e.key === 'w') {
        // week mode
        this.setPeriod('week');
      } else if (e.key === 'm') {
        // year mode
        this.setPeriod('month');
      } else if (e.key === 't') {
        // time mode
        this.setMode('time');
      } else if (e.key === 'v') {
        // views mode
        this.setMode('views');
      } else if (e.key === 'c') {
        // clicks mode
        this.setMode('clicks');
      } else if (e.key === 's') {
        // scroll mode
        this.setMode('scroll');
      }
    });

    this.date = moment();
    this.formatDate();
    this.getData();
    this.getRelevantData();
  },

  methods: {
    formatMS,

    getData: function() {
      let storageKeys = Object.keys(localStorage);
      let data = [];
      for (let i = 0; i < storageKeys.length; i++) {
        // for each key in storage build object with key(date) value(websites)
        // and push it to data array
        let key = storageKeys[i];
        if (key !== 'limits') {
          let websites = JSON.parse(localStorage.getItem(key));
          let timeSum = 0;
          let viewSum = 0;
          let clickSum = 0;
          let scrollSum = 0;
          for (let i = 0; i < websites.length; i++) {
            timeSum += websites[i].time;
            viewSum += websites[i].count;
            clickSum += websites[i].clicks;
            scrollSum += websites[i].scroll;
          }
          let object = {
            date: key,
            websites: websites,
            timeSum: timeSum,
            viewSum: viewSum,
            clickSum: clickSum,
            scrollSum: scrollSum,
          };
          data.unshift(object);
        }
      }
      this.data = data;
    },

    getRelevantData: function() {
      let entireData = this.data;

      let periodSum = {
        time: 0,
        views: 0,
        clicks: 0,
        scroll: 0,
      };

      let currentPeriod = [];
      let currentPeriodData = [];

      let relevantData = [];

      // reset data
      this.relevantData = [];
      this.periodSum = {};

      if (this.activePeriod === 'total') {
        currentPeriod = getPeriodDays(this.date, this.activePeriod, this.getFirstDate());
      } else {
        currentPeriod = getPeriodDays(this.date, this.activePeriod);
      }

      // calculate the current period
      for (let i = 0; i < currentPeriod.length; i++) {
        let periodday = moment(currentPeriod[i]).format('YYYY-MM-DD');
        for (let x = 0; x < entireData.length; x++) {
          if (entireData[x].date === periodday) {
            periodSum.time += entireData[x].timeSum;
            periodSum.views += entireData[x].viewSum;
            periodSum.clicks += entireData[x].clickSum;
            periodSum.scroll += entireData[x].scrollSum;
            currentPeriodData.push(entireData[x]);
          }
        }
      }

      this.periodSum = periodSum;
      relevantData = mergeSameWebsitesInPeriod(currentPeriodData);
      this.relevantData = relevantData;
    },

    getFirstDate: function() {
      let storageKeys = Object.keys(localStorage);
      let dates = [];
      storageKeys.forEach(element => {
        if (element !== 'limits') {
          dates.push(moment(element));
        }
      });
      let minDate = moment.min(dates);
      return moment(minDate);
    },

    getActiveRoute: function() {
      this.activeRoute = this.$router.currentRoute.name;
    },

    toggleMenu: function() {
      this.menuActive = !this.menuActive;
    },

    formatDate: function() {
      let date = cloneDeep(this.date);
      if (this.activePeriod === 'day') {
        // date.format('ddd DD/MM/YYYY') for weekday
        this.formatedDate = date.format('DD/MM/YYYY');
      } else if (this.activePeriod === 'week') {
        this.formatedDate = date.startOf('isoWeek').format('DD/MM') + ' - ' + date.endOf('isoWeek').format('DD/MM/YYYY');
      } else if (this.activePeriod === 'month') {
        this.formatedDate = date.format('MMM YYYY');
      } else if (this.activePeriod === 'total') {
        let minDay = this.getFirstDate();
        if (minDay.format('YYYY') === moment().format('YYYY')) {
          this.formatedDate = minDay.format('DD/MM') + ' – ' + moment().format('DD/MM/YYYY');
        } else {
          this.formatedDate = minDay.format('DD/MM/YYYY') + ' – ' + moment().format('DD/MM/YYYY');
        }
      }
    },

    prevDate: function() {
      if (this.activePeriod === 'day') {
        this.date = this.date.subtract(1, 'days');
      } else if (this.activePeriod === 'week') {
        this.date = this.date.subtract(1, 'weeks');
      } else if (this.activePeriod === 'month') {
        this.date = this.date.subtract(1, 'months');
      }

      this.storageDate = moment(this.date).format('YYYY-MM-DD');
      this.formatDate();
      this.getRelevantData();
    },

    nextDate: function() {
      if (this.activePeriod === 'day') {
        // if mode = day
        this.date = this.date.add(1, 'days');
      } else if (this.activePeriod === 'week') {
        // if mode = week
        this.date = this.date.add(1, 'weeks');
      } else if (this.activePeriod === 'month') {
        // if mode = year
        this.date = this.date.add(1, 'months');
      }

      this.storageDate = moment(this.date).format('YYYY-MM-DD');
      this.formatDate();
      this.getRelevantData();
    },

    nextPeriod: function() {
      if (this.activePeriod === 'day') {
        this.setPeriod('week');
      } else if (this.activePeriod === 'week') {
        this.setPeriod('month');
      } else if (this.activePeriod === 'month') {
        this.setPeriod('total');
      } else if (this.activePeriod === 'total') {
        this.setPeriod('day');
      }
    },

    prevPeriod: function() {
      if (this.activePeriod === 'day') {
        this.setPeriod('total');
      } else if (this.activePeriod === 'week') {
        this.setPeriod('day');
      } else if (this.activePeriod === 'month') {
        this.setPeriod('week');
      } else if (this.activePeriod === 'total') {
        this.setPeriod('month');
      }
    },

    nextMode: function() {
      if (this.activeMode === 'time') {
        this.setMode('views');
      } else if (this.activeMode === 'views') {
        this.setMode('clicks');
      } else if (this.activeMode === 'clicks') {
        this.setMode('scroll');
      } else if (this.activeMode === 'scroll') {
        this.setMode('time');
      }
    },

    prevMode: function() {
      if (this.activeMode === 'time') {
        this.setMode('scroll');
      } else if (this.activeMode === 'views') {
        this.setMode('time');
      } else if (this.activeMode === 'clicks') {
        this.setMode('views');
      } else if (this.activeMode === 'scroll') {
        this.setMode('clicks');
      }
    },

    getMode: function(menuItem) {
      return this.activeMode === menuItem;
    },

    setMode: function(menuItem) {
      this.activeMode = menuItem;
      this.getRelevantData();
    },

    getPeriod: function(menuItem) {
      return this.activePeriod === menuItem;
    },

    setPeriod: function(menuItem) {
      this.activePeriod = menuItem;
      this.formatDate();
      this.getRelevantData();
    },

    handleDetailPage: function(isActive) {
      this.detailPageActive = isActive;
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Fira+Mono:400,700');
@import url('https://fonts.googleapis.com/css?family=Montserrat:500');
@import 'scss/_colors.scss';

::-webkit-scrollbar {
  width: 0px; /* remove scrollbar space */
}

::selection {
  background: $primary;
}

html {
  overflow: hidden;
  height: 100%;
}

body {
  height: 100%;
  overflow: auto;
  margin: 0;
  padding: 0;
  font-family: 'Fira Mono', monospace;
  font-weight: 400;
  font-size: 12px;
  border-top: 3px solid $black;
  -webkit-font-smoothing: subpixel-antialiased;

  .info-container {
    width: 40%;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: $white;
    height: 100vh;
    border-right: 3px solid $black;

    main {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      .value {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 100%;

        h1.sum {
          font-size: 67px;
          margin: 0;
          text-align: center;
        }
      }

      .date {
        display: flex;
        align-items: center;
        font-size: 16px;
        margin-top: 16px;
        opacity: 0;
        transition: opacity 0.2s ease-out;

        &.active {
          opacity: 1;
        }

        svg {
          margin-right: 8px;

          path {
            fill: $black;
          }
        }
      }
    }

    footer {
      .menu {
        display: flex;
        flex-wrap: wrap;
        height: 0;
        margin-bottom: 96px;
        user-select: none;
        z-index: 9;
        transition: 0.3s ease-in-out;

        &.active {
          height: 360px;

          &.limit {
            height: 123px;
          }
        }

        .menu-container {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 3px solid $black;
          height: 120px;
          box-sizing: border-box;

          span.arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 117px;
            cursor: pointer;

            &.prev {
              border-right: 3px solid $black;
            }

            &.next {
              border-left: 3px solid $black;

              svg {
                transform: rotate(180deg);
              }
            }

            &:hover {
              background-color: $primary;
            }

            svg {
              height: 24px;
              width: 24px;
            }
          }

          &.period,
          &.mode {
            ul {
              margin: 0;
              padding: 0;
              display: flex;

              li {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                list-style: none;
                padding: 16px;
                cursor: pointer;
                text-decoration: none;

                svg {
                  flex: 0 0 100%;

                  path {
                    fill: $darkgrey;
                  }
                }

                span {
                  flex: 0 0 100%;
                  margin-top: 8px;
                  font-family: 'Montserrat', sans-serif;
                  font-weight: 500;
                  font-size: 10px;
                  text-transform: uppercase;
                  text-align: center;
                  letter-spacing: 2px;
                  color: $darkgrey;
                }

                &.active {
                  svg path {
                    fill: $black;
                  }

                  span {
                    color: $black;
                  }
                }

                &:hover {
                  span {
                    color: darken($darkgrey, 15%);
                  }
                  svg path {
                    fill: darken($darkgrey, 15%);
                  }

                  &.active {
                    span {
                      color: $black;
                    }
                    svg path {
                      fill: $black;
                    }
                  }
                }
              }
            }
          }

          &.date {
            h2 {
              font-size: 16px;
              font-weight: 400;
              margin: 0;
            }
          }
        }
      }

      button.settings {
        position: fixed;
        bottom: 0;
        width: 40%;
        height: 96px;
        border: none;
        outline: none;
        cursor: pointer;
        border-top: 3px solid $black;
        font-family: 'Montserrat', sans-serif;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 2px;
        z-index: 999;

        &.open {
          background-color: #ccd0d8;

          &:hover {
            background-color: $darkgrey;
          }
        }

        &:hover {
          background-color: $primary;
        }
      }
    }
  }

  .content-container {
    display: inline-block;
    margin-left: 40%;
    width: 60%;
    background-color: $lightgrey;
    min-height: 100vh;

    &.detail {
      width: 100%;
      margin: 0;
    }
  }
}
</style>
