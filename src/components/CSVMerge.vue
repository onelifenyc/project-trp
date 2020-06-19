<template>
  <div class="ui secondary piled padded segment">

    <div class="ui equal width form"
         :class="{ 'double loading' : isLoading }">

      <div class="fields">
        <div class="field">
          <label>{{ csvFrom.display }}</label>
          <div class="ui input">
            <input type="file"
                   :id="csvFrom.id"
                   :accept="CSV_EXT"
                   @change="loadFile">
          </div>
        </div>
        <div class="field">
          <label>{{ csvTo.display }}</label>
          <div class="ui input">
            <input type="file"
                   :id="csvTo.id"
                   :accept="CSV_EXT"
                   @change="loadFile">
          </div>
        </div>
      </div>

      <div class="ui basic segment"
           v-if="filesLoaded">
        <div class="ui red labeled icon button"
             @click="parseToJSON">
          <i class="sync icon"></i>
          Merge
        </div>
      </div>

      <div class="ui segment"
           v-if="csvFrom.json && csvTo.json">
        <div class="ui sub header">Results</div>
        <div class="ui two column very relaxed grid">
          <div class="column">
            <span class="ui blue text">FROM</span>
            <pre>{{ csvFrom.json | pretty }}</pre>
          </div>
          <div class="column">
            <span class="ui blue text">TO</span>
            <pre>{{ csvTo.json | pretty }}</pre>
          </div>
        </div>
        <div class="ui vertical divider"></div>
      </div>
    </div>

  </div>
</template>

<script>
import Papa from 'papaparse'

export default {
  data() {
    return {
      isLoading: false,
      error: null,
      CSV_EXT: '.csv',
      CSV_MIME_TYPE: 'application/vnd.ms-excel',
      csvFrom: {
        id: 'csvFrom',
        display: 'CSV File FROM',
        file: null,
        json: null
      },
      csvTo: {
        id: 'csvTo',
        display: 'CSV File TO',
        file: null,
        json: null
      }
    }
  },
  computed: {
    filesLoaded() {
      return this.csvFrom.file && this.csvTo.file
    }
  },
  filters: {
    pretty: function(value) {
      return JSON.stringify(value, null, 2)
    }
  },
  methods: {
    loadFile($event) {
      let _file = $event.target.files[0] || null

      // If EXCEL is not installed on a machine. file.type will be ""
      if (_file && _file.type !== this.CSV_MIME_TYPE && _file.type !== '') {
        this.error = 'Incorrect File Type'

        return
      }

      let _id = $event.target.id
      this[_id].file = _file
    },
    parseToJSON() {
      let vm = this
      vm.isLoading = true
      Papa.parse(vm.csvFrom.file, {
        header: true,
        complete(results) {
          vm.isLoading = false
          //   if (results.errors) {
          //     vm.error = results.errors
          //     return
          //   }
          vm.csvFrom.json = results.data
        }
      })

      Papa.parse(vm.csvTo.file, {
        header: true,
        complete(results) {
          vm.isLoading = false
          //   if (results.errors) {
          //     vm.error = results.errors
          //     return
          //   }
          vm.csvTo.json = results.data
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped></style>