<template>
  <div class="hardocsApp">
    <div>
      <MenuBar class="fixed bg-white z-40 w-full"></MenuBar>
    </div>
    <div class="py-16 w-full layout flex gap-8">
      <aside
        class="fixed h-screen pl-6 pr-4 w-1/5 border-r border-solid border-gray-25"
      >
        <DocsContents></DocsContents>
      </aside>
      <div class="w-1/5"></div>
      <div class="w-4/5 pl-16">
        <slot />
      </div>
      <div
        :class="{ active: metadata }"
        class="fixed pt-10 top-0 right-0 h-screen flex "
      >
        <div class="flex items-center transform -rotate-90 w-4">
          <div class="bg-primary-100 text-white">
            <p class="pl-3 pr-3" style="cursor:pointer;" @click="toggleOpen()">
              METADATA
            </p>
          </div>
        </div>
        <div class="bg-primary-100 w-3"></div>
        <div
          id="app"
          :class="{ hidden: !metadata }"
          class="bg-gray-15 w-full pr-4 border-r border-solid border-gray-25 overflow-auto"
        >
          <div class="">
            <MetadataPanel></MetadataPanel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DocsContents from '@/components/DocsContents';
import MenuBar from '@/components/MenuBar';
import MetadataPanel from '@/components/MetadataPanel';

export default {
  name: 'LayoutDefault',
  components: {
    DocsContents,
    MenuBar,
    MetadataPanel
  },
  data: () => {
    return {
      metadata: false
    };
  },
  methods: {
    toggleOpen() {
      this.metadata = !this.metadata;
    }
  },
  created(){
    console.log("WELCOME TO HARDOCS")
  }
};
</script>
<style scoped>
.hardocsApp{
  overflow: hidden; /* Hide scrollbars */
}
.active {
/* *todo* really this should be draggable, full templs will show, but bigger an improvement */
  @apply w-4/5;
}
</style>
