<template>
  <div>
    <v-navigation-drawer
      permanent
      width="300"
      :expand-on-hover="$vuetify.breakpoint.smAndDown"
      app
    >
      <v-list dense nav>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-icon>
                <v-icon>mdi-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Add Doc</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in docType"
              :key="index"
              @click="addDoc"
            >
              <v-list-item-title :name="item">{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

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

    <v-dialog v-model="open" width="500" persistent>
      <template>
        <v-card>
          <v-container>
            <v-form>
              <v-text-field
                v-model="schemaUrl"
                label="Schema URL"
              ></v-text-field>
              <v-text-field
                v-model="schemaName"
                aria-required="true"
                label="Schema Name"
              ></v-text-field>
              <v-btn @click="loadSchema">Create</v-btn>
            </v-form>
          </v-container>
        </v-card>
      </template>
    </v-dialog>
  </div>
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
      mini: true,
      open: false,
      schemaUrl: '',
      schemaName: '',
      docType: ['Metadata', 'Document']
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

    addDoc(e) {
      if (e.target.innerHTML.toLowerCase() === 'document') {
        this.$store.dispatch('addDoc');
      } else {
        this.open = true;
      }
    },

    async loadSchema() {
      this.$store.dispatch('schemaFromURL', {
        url: this.schemaUrl,
        name: this.schemaName
      });
      this.open = false;
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
</script>
<style>
.docs-contents:focus {
  font-weight: 700;
}
.table-of-contents {
  position: fixed;
  height: 100vh;
}
</style>
