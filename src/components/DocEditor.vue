<template>
  <div class="editor">
    <div
      v-if="$store.state.docs.devFeatures == true"
      class="flex gap-2 py-3 justify-end"
    >
      <button class="primary-button" v-on:click="setStateTo('active')">
        Edit
      </button>
      <button class="primary-button" v-on:click="setStateTo('preview')">
        Preview
      </button>
      <button class="primary-button" v-on:click="setStateTo('data')">
        Doc data
      </button>
    </div>

    <div v-if="state === 'active'">
      <ckeditor
        :editor="editor"
        v-model="editorData"
        :config="editorConfig"
        @input="onChange"
        class=""
      ></ckeditor>
    </div>
    <div v-else-if="state === 'data'" class="export">
      <h3>JSON</h3>
      <pre class="p-2 bg-gray-15"><code v-html="json"></code></pre>
    </div>
    <div v-else>
      <h2 class="text-primary-100">This is the HTML</h2>
      <div class="p-2 bg-gray-15" v-html="html"></div>
    </div>
    <!-- <img src="../assets/logo.png" alt="logo" /> -->
  </div>
</template>

<script>
import ClassicEditor from 'hardocs-ck-editor';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic/build/ckeditor';

// import CKEditor from '@ckeditor/ckeditor5-vue/dist/ckeditor';
// import Base64ImagePlugin from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';

export default {
  components: {
    // ckeditor: CKEditor.component
  },
  name: 'Doc',
  props: {
    id: {
      // type: any,
      required: true
    },
    content: {
      type: String,
      required: false,
      default: `
          <h2>
            Hi there,
          </h2>
          <p>
            this is a very <em>basic</em> example of tiptap.
          </p>
          <pre><code>body { display: none; }</code></pre>
          <ul>
            <li>
              A regular list
            </li>
            <li>
              With regular items
            </li>
          </ul>
          <blockquote>
            It's amazing 👏
            <br />
            – mom
          </blockquote>
        `
    }
  },
  data() {
    return {
      editor: ClassicEditor,
      state: 'active',
      json: 'edit content',
      html: this.content,
      editorData: this.content,
      editorConfig: {
        toolbar: {
          viewportTopOffset: 55
        }
      }
    };
  },
  methods: {
    setStateTo: function(value) {
      this.state = value;
    },
    onChange: function(data) {
      this.$store.dispatch('setSaved', false);
      let regex = /<[^>].+?>(.*?)<\/.+?>/m;
      // let regex = /(# |## |### |#### )[\w]*[\s\S]*?\n/gis;

      if (data.length && data.match(regex)) {
        let title = data.match(regex)[0];
        regex = /(<([^>]+)>)/gi;
        // regex = /(# |## |### |#### )/gi;
        // Set conditional statement here
        title = title.replace(regex, '').trim();
        title = title.replace(/&nbsp;/g, '');

        this.$store.commit('UPDATE_DOC_CONTENT', {
          id: this.id,
          content: data,
          title
        });
        // console.log(data);
      }
    }
  }
};
</script>

<style scoped>
.text-icon {
  font-size: 1rem;
}
.grid__menubar {
  display: flex;
  align-items: center;
}
.grid__menubar > * {
  padding: 0.5rem;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 5px;
  margin: 0 4px;
}
.grid__menubar > *:hover {
  background-color: #dbdbdb;
}

.is-active {
  background-color: #cecece;
}
</style>
