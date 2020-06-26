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

      <div class="ui basic fitted segment">
        <button class="ui red labeled icon button"
                @click="parse"
                v-if="filesLoaded">
          <i class="sync icon"></i>
          Merge
        </button>

        <button v-if="mergedJson"
                class="ui green right floated labeled icon button"
                @click="downloadCSV">
          <i class="download icon"></i>
          Download CSV
        </button>
      </div>

      <div class="ui sub header"
           v-if="csvFrom.json && csvTo.json">Results</div>
      <div class="ui segment"
           v-if="csvFrom.json && csvTo.json">
        <div class="ui equal width very relaxed divided grid">
          <div class="column">
            <span class="ui blue text">FROM ( {{ csvFrom.json.length }} )</span>
            <pre>{{ csvFrom.json | pretty }}</pre>
          </div>
          <div class="column">
            <span class="ui blue text">TO ( {{ csvTo.json.length }} )</span>
            <pre>{{ csvTo.json | pretty }}</pre>
          </div>
          <div class="column">
            <span class="ui blue text">FINAL ( {{ mergedJson.length }} )</span>
            <pre>{{ mergedJson | pretty }}</pre>
          </div>
        </div>
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
      },
      mergedJson: null,
      finalCSVText: null
    }
  },
  computed: {
    filesLoaded() {
      return this.csvFrom.file && this.csvTo.file
    },
    jsonCreated() {
      return this.csvFrom.json && this.csvTo.json
    }
  },
  watch: {
    jsonCreated() {
      const _fromKeys = Object.keys(this.csvFrom.json[0])
      const _toKeys = Object.keys(this.csvTo.json[0])
      let _mergedKeys = [..._toKeys, ..._fromKeys]

      let _mergedJson = []

      // Merge or Copy the FROM records
      this.csvFrom.json.forEach(fromElement => {
        let matchingElement = this.csvTo.json.find(
          toElement => toElement['Last name'] === fromElement['Last Name']
        )

        // If record exists in the TO file, copy the data from FROM to TO in copy and push to merged records
        if (matchingElement) {
          _mergedJson.push(Object.assign({ ...matchingElement }, fromElement))
        } else {
          let newRecord = {}
          _mergedKeys.forEach(e => (newRecord[e] = null))

          for (const key in fromElement) {
            if (fromElement.hasOwnProperty(key)) {
              if (newRecord.hasOwnProperty(key)) {
                newRecord[key] = fromElement[key]
              }
            }
          }

          _mergedJson.push(newRecord)
        }
      })

      // bring over the TO records
      this.csvTo.json.forEach(toElement => {
        // skip already merged record
        if (
          _mergedJson.find(
            mergedElement =>
              mergedElement['Last name'] === toElement['Last name']
          )
        ) {
          return
        }

        let newRecord = {}
        _mergedKeys.forEach(e => (newRecord[e] = null))

        for (const key in toElement) {
          if (toElement.hasOwnProperty(key)) {
            if (newRecord.hasOwnProperty(key)) {
              newRecord[key] = toElement[key]
            }
          }
        }

        _mergedJson.push(newRecord)
      })

      this.mergedJson = _mergedJson
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
    parse() {
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
    },
    downloadCSV() {
      this.finalCSVText = Papa.unparse(this.mergedJson)
      var csvContent = this.finalCSVText
      if (!csvContent.match(/^data:text\/csv/i)) {
        csvContent = 'data:text/csv;charset=utf-8,' + csvContent // use 'data:text/csv;charset=utf-8,\ufeff', if you consider using the excel
      }
      var data = encodeURI(csvContent)

      var link = document.createElement('a')
      link.href = data
      link.download = 'MergedRecords.csv'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style lang="stylus" scoped>
pre {
  font-size: 0.7rem;
  color: blue;
}
</style>