<template>
  <div class="">
    <div class="editor">
      <div class="editable"></div>
    </div>
    <div
      id="app"
      class="content-center w-full m-auto items-center flex-col"
    >
      <div class="">
        <p class="pl-4"><strong>Project folder :  </strong>{{docs.cwd}}</p>

        <JsonEditor
          :options="{
            confirmText: 'confirm',
            cancelText: 'cancel'
          }"
          :objData="data"
          :v-model="data"
          :templatesData="templatesData"
          v-on:input="passDataFromEditor"
        ></JsonEditor>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue';
// import DocEditor from '@/components/DocEditor';
// import DocsServices from '@/services/index';
// import SchemasDir from '@/components/MetadataEdit__SchemasDir';
import { mapGetters, mapState } from 'vuex';
import { buildsTemplate } from '@/utils/schemas.js'

export default {
  //   name:"JsonEditor",
  created () {
    this.$root.$on('template-selected', (event) => { this.templateSelected(event) })
  },
  data: function() {
    return {
      path: '',
      query: '',
      componentKey: 1,
      // json:this.getsJsonFromStore
    };
  },
  computed: {
    ...mapGetters({
      jsonData: 'stateData'
    }),
    ...mapState({
      docs: state => state.docs,
      dataSet: state => state.metadata.dataSet
    }),
    data: {
      get: function() {
        return this.dataSet;
      },
      set: function(newDataSet) {
        return this.$store.commit('UPDATE_DATA_SET', newDataSet);
      }
    },
    schemas: function () {
      return this.$store.state.metadata.schemasRef;
    },
    selections: function () {
      return this.schemas.map (key => key.title)
    },
    templatesData: function () {
      return {
        selections: this.selections,
        template: null, // *todo* likely not needed now
        store: this.$store  // *todo* likely not needed now
      }
    }
  },
  methods: {
    buildTemplate: function (schemaData) {
      console.log('buildTemplate: ' + JSON.stringify(schemaData))
      const template = Object.keys(schemaData.fields).map (key => {
        let value = schemaData.fields[key]
        if (!value) {
          switch (typeof value) {
            case 'string':
              value = key
              break
            case 'number':
              value = 0
              break
            case 'boolean':
              value = false
              break
            default:
              break
          }
        }
        // console.log('buildTemplate:key: ' + key + ': ' + value)
        return {
          name: key,
          type: typeof value,
          childParams: null,
          remark: value
        }
      })
      return template
    },
    templateSelected: function(templateName) {
      console.log('templateSelected:templateName: ' + templateName)
      const schemaDir = this.$store.state.metadata.schemasDir + "\\"
      const schemaFile = templateName + '.json'
      const realTemplate = buildsTemplate(schemaDir, schemaFile)
      console.log ('templateof: ' + templateName + ' is: ' + JSON.stringify(realTemplate))
      const templateData = {
        name: templateName,
        data: this.buildTemplate(realTemplate)
      }

      this.$root.$emit('template-returned', templateData)
    },

    // Listen to child emitted event to update the state based on new input
    async passDataFromEditor(input) {
      return this.$store.dispatch('updateDataset', input)
    }
  }
};
</script>
<style scoped>
.page * {
  @apply mb-2;
}

.cell {
  @apply mb-2;
}

body {
  font-size: 14px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.clearfix {
  *zoom: 1;
}

.clearfix:before,
.clearfix:after {
  content: '';
  display: table;
}

.clearfix:after {
  clear: both;
}

.t {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 60px;
}

.editor-w {
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 20px;
}

.w-2 {
  float: left;
  width: 50%;
}

.editor {
  padding: 20px 60px;
}
</style>
