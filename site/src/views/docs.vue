<template>
    <div class="layout">
      <div class="content">
        <aside :style="asideStyle">
          <div class="menu">
            <div
              class="menu-group"
              v-for="(itemx, index) in docMenus"
              :key="index"
            >
              <span class="menu-group-title text-overflow">
                {{ index }}
              </span>
              <router-link
                v-for="(itemy, indey) in itemx"
                :key="indey"
                class="menu-item text-overflow"
                :to="`/docs/${itemy.path}`"
              >
                {{ itemy.name }}
              </router-link>
            </div>
          </div>
        </aside>
        <div class="toggle-button" @click="toggleAside" :style="toggleAsidStyle">></div>
        <main :style="mainStyle" id="doc-content-container">
          <router-view />
        </main>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { docMenus } from '../router/docs';
  
  let asideVisible = $ref(true);
  
  const toggleAside = () => {
    asideVisible = !asideVisible;
  };
  
  const asideStyle = computed(() => {
    return { left: asideVisible ? "0px" : "-272px" };
  });
  
  const toggleAsidStyle = computed(() => {
    return {
      left: asideVisible ? "272px" : "0px",
      transform: asideVisible ? "rotate(180deg) translateX(50%)" : "rotate(0deg) translateX(50%)",
    };
  });
  
  const mainStyle = computed(() => {
    return { "padding-left": asideVisible ? "302px" : "60px" };
  });
  </script>
  
  <style lang="postcss">
  .layout {
    display: flex;
    flex-direction: column;
    text-align: left;
    height: 100vh;
    > .nav {
      flex-shrink: 0;
    }
    > .content {
      display: flex;
      flex-grow: 1;
      position: absolute;
      top: 50px;
      left: 0px;
      height: calc(100% - 50px);
      width: 100%;
      transition: all 0.5 ease;
      z-index: 1;
  
      > aside {
        flex-shrink: 0;
        width: 220px;
        padding: 16px;
        height: 100%;
        background-color: #fff;
        border-right: 1px solid #efeff5;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 10;
        transition: all 250ms ease;
        overflow-y: auto;
  
        .menu,.menu-group {
          width: 100%;
        }
  
        .menu-group-title, .menu-item {
          display: flex;
          align-items: center;
          width: 100%;
        }
  
        .menu-group-title {
          height: 36px;
          padding-left: 15px;
          font-size: 13px;
          color: rgb(118, 124, 130);
          overflow: hidden;
  
          &:hover {
            cursor: default;
          }
        }
  
        .menu-item {
          height: 44px;
          padding-left: 48px;
          color: rgb(51, 54, 57);
          font-size: 14px;
  
          &:hover {
            color: #18a058 !important;
          }
        }
  
        .router-link-exact-active {
          color: #18a058 !important;
          background-color: #e7f5ee;
          border-radius: 3px;
        }
      }
      > main {
        flex-grow: 1;
        box-sizing: border-box;
        padding: 32px 24px 100px 36px;
        transition: all 250ms ease;
        overflow: auto;
  
        h1 {
          margin: 28px 0 20px 0;
        }
  
        p {
          margin: 16px 0;
          color: rgb(51, 54, 57);
          font-size: 14px;
        }
        .preview-wrapper {
          width: 80%;
        }
      }
    }
  }
  
  .toggle-button {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid rgb(239, 239, 245);
    position: absolute;
    left: 200px;
    top: 240px;
    background-color: #fff;
    box-shadow: 0 2px 4px 0px rgb(0 0 0 / 6%);
    transition: left 250ms ease, transform 0.1s ease;
    z-index: 10;
  
    > .icon {
      width: 12px;
      height: 12px;
    }
  }
  </style>