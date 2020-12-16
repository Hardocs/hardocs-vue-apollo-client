<template>
  <div>
    <div
      v-if="isInit == true"
      class="pt-16 h-screen absolute w-full bg-black bg-opacity-25"
    >
      <CreateProject
        :cwd="cwd"
        :selectedAction="selectedAction"
        class="relative pt-4 bg-white w-2/5 mx-auto"
      ></CreateProject>
    </div>
    <div
      class="border-solid border-b border-gray-25 py-4 w-full flex border-b-1"
    >
      <div v-for="item in actions" :key="item.actionType" class="px-4">
        <p
          style="cursor: pointer"
          @click="openHardocsPath(item.actionType, item.initOn)"
        >
          {{ item.label }}
        </p>
      </div>
      <!-- <StandardSelector></StandardSelector> -->
      <div class="w-1/2">
        <div class="text-center flex justify-center">
          <strong>Project Folder: </strong>
          <div class="px-4">{{ cwd }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import here the modal component...
import CreateProject from '@/components/CreateProject';
// import StandardSelector from '@/components/MetadataEdit__SchemasDir';

export default {
  name: 'MenuBar',
  components: {
    CreateProject
    // StandardSelector
  },
  data() {
    return {
      init: false,
      selectedAction: '',
      actions: [
        {
          label: 'Create project',
          actionType: 'createNewProject',
          initOn: true
        },
        {
          label: 'Open project',
          actionType: 'loadProject',
          initOn: false
        }
        // {
        //   label: 'Create from folder',
        //   actionType: 'createProjectFromExisting',
        //   initOn: true
        // }
      ]
    };
  },

  computed: {
    isInit() {
      // Compute if initialization is taking place or not
      return this.$store.state.docs.initProject.on;
    },
    cwd() {
      return this.$store.state.docs.cwd;
    }
  },
  methods: {
    openHardocsPath(type, initOn) {
      console.log(type);
      this.selectedAction = type;
      this.$store.dispatch('initProject', { type: type, on: initOn });
    }
  }
};
</script>