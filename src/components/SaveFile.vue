<template>
  <div v-if="saved == false">
    <button class="primary-button" @click="saveDocFile()">Save</button>
  </div>
</template>
<script>
export default {
  name: 'SaveFile',
  props: {
    docId: Number
  },
  data() {
    return {
      dummy: {
        title: 'Name',
        path: 'docs/',
        content: 'this is a content',
        fileName: 'hello.html'
      }
    };
  },
  computed: {
    saved() {
      return this.$store.state.docs.currentDoc.saved;
    },
    guidesIsActive() {
      return this.$store.getters.guidesIsActive;
    }
  },
  methods: {
    saveDocFile() {
      if (this.guidesIsActive) {
        if (process.env.NODE_ENV === 'production')
          alert('Save is disabled for GUIDES documents');
        else {
          this.$store.dispatch('saveDocFile');
          this.$store.commit(
            'SET_TO_SAVED',
            this.$store.state.docs.currentDoc.id
          );
        }
      } else {
        this.$store.dispatch('saveDocFile')
      }
    }
  }
};
</script>
