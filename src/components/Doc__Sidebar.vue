<template>
  <v-navigation-drawer
    permanent
    width="300"
    :expand-on-hover="$vuetify.breakpoint.smAndDown"
    app
    class="docs__sidebar"
  >
    <v-list dense nav>
      <v-list-item
        @click="addDoc"
        v-shortkey="['ctrl', 'shift', 'n']"
        @shortkey="addDoc"
        class="mt-8"
      >
        <v-list-item-icon>
          <v-icon>mdi-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Add Doc</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="my-3"></v-divider>
      <v-list-item
        v-for="doc in docs"
        :key="doc.id"
        link
        @click="setCurrentDoc(doc.id)"
      >
        <v-list-item-icon>
          <v-icon>mdi-file-outline</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title
            :class="{ 'font-weight-bold': doc.id == currentDocId }"
            >{{ doc.title }}</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'DocsSidebar',
  data() {
    return {
      showModal: false,
      docToDelete: null,
      projectPath: '',
      currentDoc: '',
      mini: true
    };
  },

  computed: {
    ...mapGetters({
      docId: 'currentDocId'
    }),

    currentDocId: {
      get() {
        return this.docId;
      },
      set(docId) {
        this.setCurrentDoc(docId);
      }
    },
    docs() {
      return this.$store.state.docs.allDocs;
    },
    entryFile() {
      return this.$store.state.docs.entryFile;
    },
    cwd: {
      get() {
        return this.$store.state.docs.cwd;
      }
    },
    appPath: {
      get() {
        return this.$store.state.docs.appPath;
      }
    }
  },
  methods: {
    createPath(id) {
      return `/doc/${id}`;
    },

    async backToProject() {
      await this.$store.commit('SET_CWD', this.projectPath);
      await this.$store.dispatch('loadProject');
      this.setCurrentDoc(this.currentDoc);
    },

    async setCurrentDoc(id) {
      await this.$store.dispatch('setCurrentDoc', id);
    },

    addDoc() {
      this.$store.dispatch('addDoc');
    },

    removeDoc(id) {
      this.$store.dispatch('removeDoc', id);
    },

    confirmDelete(id) {
      if (confirm('are you sure you want to delete this document ?')) {
        this.$store.dispatch('removeDoc', id);
      }
    }
  },
  watch: {
    cwd() {
      // if (this.cwd !== this.appPath) this.guidesIsActive = false;
    }
  }
};

/**
 * <v-list-item-icon
          v-if="doc.fileName !== entryFile"
          @click="confirmDelete(doc.id)"
        >
          <v-icon>&times;</v-icon>
        </v-list-item-icon>
 */
</script>
<style>
.docs-contents:focus {
  font-weight: 700;
}
.table-of-contents {
  position: fixed;
  height: 100vh;
}
.docs__sidebar {
  z-index: 9999 !important;
}
.ck-editor__top {
  z-index: 99 !important;
}
</style>
