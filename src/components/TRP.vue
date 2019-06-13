<template>
  <div id="container">
    <div class="ui red small header">TENNIS RAQUET PHYSICS <sup>TM</sup></div>
    <div class="ui very padded grid">
      <div class="twelve wide column">
        <div class="ui header">INPUTS</div>
        <div class="ui secondary segment">
          <div class="ui form">
            <div class="field"
                 v-for="(prop, idx) in Object.keys(viewModel)"
                 :key="idx">
              <label :for="prop">{{ viewModel[prop].label.toUpperCase() }}
                ( {{ viewModel[prop].unit }} )</label>
              <div class="ui middle aligned grid">
                <div class="twelve wide column">
                  <div class="ui blue slider"
                       :id="`slider-${prop}`"></div>
                </div>
                <div class="four wide column">
                  <!-- <input v-model="viewModel[prop].val"
                       :id="prop"
                       type="text"
                       readonly /> -->
                  <div class="ui blue large label">
                    {{ viewModel[prop].val }}
                    <div class="detail">{{ viewModel[prop].unit }} </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="four wide column">
        <div class="ui header">RESULTS</div>
        <div class="ui secondary segment">

          <div class="ui form">

            <div class="field">
              <label> MGR </label>
              <input v-model="MGRFormula"
                     type="text" />
            </div>

            <div class="field">
              <label> M </label>
              <input v-model="MFormula"
                     type="text" />
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      viewModel: {
        m: {
          label: 'weight',
          unit: 'g',
          val: 0
        },
        b: {
          label: 'balance',
          unit: 'cm',
          val: 0
        },
        sw: {
          label: 'swingweight',
          unit: 'kg*cm^2',
          val: 0
        }
      }
    }
  },
  watch: {
    m(newValue, oldValue) {},
    b(newValue, oldValue) {},
    sw(newValue, oldValue) {}
  },
  computed: {
    MinKG() {
      return this.viewModel.m.val / 1000
    },
    MGRFormula() {
      return Number.parseFloat(
        (this.MinKG * 980.6 * this.viewModel.b.val) /
          (this.viewModel.sw.val +
            20 * this.MinKG * this.viewModel.b.val -
            100 * this.MinKG)
      ).toFixed(3)
    },
    MFormula() {
      return Number.parseFloat(
        this.MinKG * this.viewModel.b.val * this.viewModel.b.val
      ).toFixed(2)
    }
  },
  mounted() {
    let vm = this

    $('#slider-m').slider({
      min: 250,
      max: 400,
      onMove(val) {
        vm.viewModel.m.val = val
      }
    })
    $('#slider-b').slider({
      min: 29,
      max: 35,
      step: 0.01,
      decimal: 2,
      pageMultiplier: 5,
      onMove(val) {
        vm.viewModel.b.val = Number.parseFloat(val).toFixed(2)
      }
    })
    $('#slider-sw').slider({
      min: 250,
      max: 400,
      onMove(val) {
        vm.viewModel.sw.val = val
      }
    })
  }
}
</script>

<style>
#container {
  padding-top: 3rem;
}
</style>
