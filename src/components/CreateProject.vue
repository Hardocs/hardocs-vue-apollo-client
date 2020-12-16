<template>
  <div class="create-project">
    <div style="cursor:pointer" class="float-right px-4" @click="cancel()">
      ❌
    </div>
    <FormSchema
      class="create-project pb-6 create-project"
      ref="formSchema"
      v-model="model"
      @submit.prevent
    >
      <div class="buttons">
        <button type="button" class="primary-button" @click="onSubmit()">
          Create project
        </button>
      </div>
    </FormSchema>
    <pre class="model">{{ model }}</pre>
  </div>
</template>

<script>
import FormSchema from '@formschema/native';

export default {
  components: { FormSchema },
  props: {
    selectedAction: {
      type: String,
      required: true
    },
    cwd: {
      type: String,
      required: true
    }
  },
  computed: {
    currentCwd() {
      console.log('CreateProject:currentCwd: ' + this.$store.state.docs.cwd);
      return this.$store.state.docs.cwd;
    }
  },
  data: () => ({
    created: false,
    schema: Promise.resolve(require('@/schemas/project.schema.json')),
    model: {},
    modelExample: {
      path: 'D:\\my-projects\\COVID-19\\DESTROY',
      name: 'EK Evaluation kit',
      shortTitle: 'A kit to evaluate EK',
      docsDir: 'docs\\',
      entryFile: 'index.html'
    }
  }),
  created() {
    this.schema.then((schema) => {
      return this.$refs.formSchema.load(schema);
    });
    this.model.path = this.cwd;
    this.model.docsDir = 'docs';
    this.model.entryFile = 'index.html';
  },
  methods: {
    onSubmit() {
      console.log(this.selectedAction);
      // Check validity here
      // If valid, toggle button to active class....
      this.$store.dispatch(this.selectedAction, this.model);
      this.cancel();
    },
    cancel() {
      this.$store.commit('SET_INIT_PROJECT', {
        on: false,
        type: undefined
      });
    }
  }
};
</script>

<style>
.container {
  @apply bg-gray-15 py-4;
  text-align: left;
  max-width: 1024px;
  /* margin: auto; */
  display: flex;
}
.create-project .form,
.model {
  padding: 20px;
  margin: 0 auto;
}

.create-project .form {
  background-color: #c5cdd6;
}

.create-project .model {
  margin: 0;
  background-color: #eff0f1;
  @apply bg-gray-100 text-white;
}

.create-project > h1 {
  font-size: 1.7em;
  /* text-align: center; */
  @apply px-4 py-2;
  margin-top: 0;
  margin-bottom: 0.2em;
}

.create-project > h1 + p {
  @apply px-4 py-0;
  display: block;
  /* text-align: center; */
  margin-bottom: 1.2em;
}

.create-project > small {
  line-height: 20px;
  display: block;
}

.create-project [data-fs-field] {
  display: flex;
  margin-bottom: 5px;
  @apply py-2 px-1;
}

.create-project label {
  display: block;
  width: 120px;
  text-align: right;
  margin-right: 10px;
}

.create-project [data-fs-field-input] {
  @apply w-1/2;
}

.buttons {
  padding-left: 130px;
}

.create-project input {
  @apply w-full py-1 px-2 bg-gray-15 !important;
}
</style>
