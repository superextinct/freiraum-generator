const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

var ui = new Vue({
  el: '#app',
  props: {
    collapse: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "photos",
      isOpen: false,
      formatselect: ["a8", "a7", "a6", "a5", "a4", "a3", "a2"],
      settingsModal: false,
      sorting: "random",
      sequence: "fibonacci",
      colorselect: "0",
      blockselect: "medium"
    }
  },
  computed: {
    isInitial () {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving () {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess () {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed () {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  mounted () {
    app.init();
  },
  destroyed () {

  },
  methods: {
    generateGrid() {
      app.run();
    },
    updateCanvasColor() {
      app.fabric.getObjects().map( (o) => {
        return o.set('fill', colors[ui.colorselect].hex);
      });
      app.fabric.renderAll();
    },
    reset() {
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError   = null;
    },
    toggleMenu () {
      const header = document.getElementById('J-page-header')
      if (this.isOpen) {
        this.isOpen = false
        header.classList.remove('open')
      } else {
        this.isOpen = true
        header.classList.add('open')
      }
    }
  }
});
