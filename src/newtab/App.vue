<template>
  <div>
    <div class="info-container">
      <MainHeader
        :links="[
          {name: 'Top Five', to: '/ratio'},
          {name: 'List', to: '/list'},
          {name: 'Limits', to: '/limit'}]"
      />

      <main>
        <!-- time mode -->
        <div v-if="activeMode === 'time'">
          <h1 v-if="periodSum.time > 0" class="sum">{{formatMS(periodSum.time, true)}}</h1>
          <h1 v-else class="sum">–</h1>
        </div>

        <!-- views mode -->
        <div v-if="activeMode === 'views'">
            <h1 v-if="periodSum.views > 0" class="sum">{{periodSum.views}} views</h1>
            <h1 v-else class="sum">–</h1>
        </div>

        <!-- clicks mode -->
        <div v-if="activeMode === 'clicks'">
            <h1 v-if="periodSum.clicks > 0" class="sum">{{periodSum.clicks}} clicks</h1>
            <h1 v-else class="sum">–</h1>
        </div>

        <!-- scroll mode -->
        <div v-if="activeMode === 'scroll'">
            <h1 v-if="periodSum.scroll > 0" class="sum">{{parseInt(periodSum.scroll/100)}}K px</h1>
            <h1 v-else class="sum">–</h1>
        </div>

      </main>

      <footer>
        <div class="menu" :class="{ active: this.menuActive }">

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
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.70182 8.0738C7.88951 7.97996 8.11042 7.97996 8.29811 8.0738L14.9648 11.4071C15.1906 11.5201 15.3333 11.7509 15.3333 12.0034C15.3333 12.2559 15.1906 12.4868 14.9648 12.5997L8.29811 15.933C8.11042 16.0269 7.88951 16.0269 7.70182 15.933L1.03515 12.5997C0.809294 12.4868 0.666626 12.2559 0.666626 12.0034C0.666626 11.7509 0.809294 11.5201 1.03515 11.4071L7.70182 8.0738ZM2.82401 12.0034L7.99996 14.5914L13.1759 12.0034L7.99996 9.41544L2.82401 12.0034Z" fill="black"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.737032 15.0386C0.901691 14.7093 1.30214 14.5758 1.63146 14.7404L7.99999 17.9247L14.3685 14.7404C14.6978 14.5758 15.0983 14.7093 15.2629 15.0386C15.4276 15.3679 15.2941 15.7684 14.9648 15.933L8.29813 19.2664C8.11044 19.3602 7.88953 19.3602 7.70184 19.2664L1.03517 15.933C0.705855 15.7684 0.572372 15.3679 0.737032 15.0386Z" fill="black"/>
                </svg>
                <span>day</span>
              </li>

              <li v-on:click="setPeriod('week')" :class="{ active: getPeriod('week') }">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.70182 4.73689C7.88951 4.64304 8.11042 4.64304 8.29811 4.73689L14.9648 8.07022C15.1906 8.18315 15.3333 8.41399 15.3333 8.66651C15.3333 8.91902 15.1906 9.14986 14.9648 9.26279L8.29811 12.5961C8.11042 12.69 7.88951 12.69 7.70182 12.5961L1.03515 9.26279C0.809294 9.14986 0.666626 8.91902 0.666626 8.66651C0.666626 8.41399 0.809294 8.18315 1.03515 8.07022L7.70182 4.73689ZM2.82401 8.66651L7.99996 11.2545L13.1759 8.66651L7.99996 6.07853L2.82401 8.66651Z" fill="black"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.737032 15.0349C0.901691 14.7056 1.30214 14.5721 1.63146 14.7368L7.99999 17.9211L14.3685 14.7368C14.6978 14.5721 15.0983 14.7056 15.2629 15.0349C15.4276 15.3642 15.2941 15.7647 14.9648 15.9294L8.29813 19.2627C8.11044 19.3565 7.88953 19.3565 7.70184 19.2627L1.03517 15.9294C0.705855 15.7647 0.572372 15.3642 0.737032 15.0349Z" fill="black"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.737032 11.7017C0.901691 11.3724 1.30214 11.2389 1.63146 11.4035L7.99999 14.5878L14.3685 11.4035C14.6978 11.2389 15.0983 11.3724 15.2629 11.7017C15.4276 12.031 15.2941 12.4314 14.9648 12.5961L8.29813 15.9294C8.11044 16.0233 7.88953 16.0233 7.70184 15.9294L1.03517 12.5961C0.705855 12.4314 0.572372 12.031 0.737032 11.7017Z" fill="black"/>
                </svg>
                <span>week</span>
              </li>

              <li v-on:click="setPeriod('month')" :class="{ active: getPeriod('month') }">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.737032 15.0349C0.901691 14.7056 1.30214 14.5721 1.63146 14.7368L7.99999 17.9211L14.3685 14.7368C14.6978 14.5721 15.0983 14.7056 15.2629 15.0349C15.4276 15.3642 15.2941 15.7647 14.9648 15.9294L8.29813 19.2627C8.11044 19.3565 7.88953 19.3565 7.70184 19.2627L1.03517 15.9294C0.705855 15.7647 0.572372 15.3642 0.737032 15.0349Z" fill="black"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.737032 11.7017C0.901691 11.3724 1.30214 11.2389 1.63146 11.4035L7.99999 14.5878L14.3685 11.4035C14.6978 11.2389 15.0983 11.3724 15.2629 11.7017C15.4276 12.031 15.2941 12.4314 14.9648 12.5961L8.29813 15.9294C8.11044 16.0233 7.88953 16.0233 7.70184 15.9294L1.03517 12.5961C0.705855 12.4314 0.572372 12.031 0.737032 11.7017Z" fill="black"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.737032 8.36843C0.901691 8.03911 1.30214 7.90562 1.63146 8.07028L7.99999 11.2545L14.3685 8.07028C14.6978 7.90562 15.0983 8.03911 15.2629 8.36843C15.4276 8.69775 15.2941 9.09819 14.9648 9.26285L8.29813 12.5962C8.11044 12.69 7.88953 12.69 7.70184 12.5962L1.03517 9.26285C0.705855 9.09819 0.572372 8.69775 0.737032 8.36843Z" fill="black"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.70182 1.40363C7.88951 1.30979 8.11042 1.30979 8.29811 1.40363L14.9648 4.73697C15.1906 4.8499 15.3333 5.08074 15.3333 5.33325C15.3333 5.58577 15.1906 5.81661 14.9648 5.92954L8.29811 9.26287C8.11042 9.35672 7.88951 9.35672 7.70182 9.26287L1.03515 5.92954C0.809294 5.81661 0.666626 5.58577 0.666626 5.33325C0.666626 5.08074 0.809294 4.8499 1.03515 4.73697L7.70182 1.40363ZM2.82401 5.33325L7.99996 7.92123L13.1759 5.33325L7.99996 2.74528L2.82401 5.33325Z" fill="black"/>
                </svg>
                <span>month</span>
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
                v-on:click="toggleMenu()"
                :style="[menuActive ? { 'background-color' : '#CCD0D8' } : { 'background-color' : '#fff' }]">
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
      formatedDate: null,
      data: [],
      relevantData: [],
      periodSum: {},
      detailPageActive: false,
      menuActive: false,
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

      currentPeriod = getPeriodDays('current', this.date, this.activePeriod);

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

      this.nextAvailable = true;
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

      this.formatDate();
      this.getRelevantData();
    },

    nextPeriod: function() {
      if (this.activePeriod === 'day') {
        this.setPeriod('week');
      } else if (this.activePeriod === 'week') {
        this.setPeriod('month');
      } else if (this.activePeriod === 'month') {
        this.setPeriod('day');
      }
    },

    prevPeriod: function() {
      if (this.activePeriod === 'day') {
        this.setPeriod('month');
      } else if (this.activePeriod === 'week') {
        this.setPeriod('day');
      } else if (this.activePeriod === 'month') {
        this.setPeriod('week');
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
  border: 3px solid $black;

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
      padding: 0 80px;

      h1.sum {
        font-size: 67px;
        margin: 0;
        text-align: center;
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
              }
            }
          }

          &.date {
            h2 {
              font-size: 21px;
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
      position: absolute;
      width: 100%;
      margin: 0;
    }
  }
}
</style>
