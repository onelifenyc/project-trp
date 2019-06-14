<template>
  <div id="container">
    <div class="ui red small header">TENNIS RAQUET PHYSICS <sup>TM</sup></div>
    <div class="ui stackable grid">
      <div class="twelve wide column">
        <div class="ui header">parameters</div>
        <div class="ui secondary padded segment">
          <div class="ui form">
            <div class="field"
                 v-for="(prop, idx) in Object.keys(viewModel)"
                 :key="idx">
              <label :for="prop">{{ viewModel[prop].label.toUpperCase() }}
                ( {{ viewModel[prop].unit }} )</label>
              <div class="ui middle aligned grid">
                <div class="ten wide column">
                  <div class="ui blue large slider"
                       :id="`slider-${prop}`"></div>
                </div>
                <div class="five wide computer column">
                  <!-- <input v-model="viewModel[prop].val"
                       :id="prop"
                       type="text"
                       readonly /> -->
                  <div class="ui large blue label">
                    {{ viewModel[prop].val }}
                    <div class="detail">{{ viewModel[prop].unit }} </div>
                  </div>
                </div>
                <div class="column"
                     style="padding:0;">
                  <i class="link large icon"
                     :class="[viewModel[prop].locked ? 'red lock' : 'green lock open']"
                     @click="viewModel[prop].locked = !viewModel[prop].locked"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="four wide column">
        <div class="ui header">results</div>
        <div class="ui secondary padded segment">
          <div class="ui form">
            <div class="field">
              <label> MGR </label>
              <input v-model.lazy="MGR"
                     type="number"
                     readonly />
            </div>
            <div class="field">
              <label> M </label>
              <input v-model.lazy="M"
                     type="number" />
            </div>
            <br><br><br><br>
            <div class="field">
              <button class="ui black fluid button"
                      @click="reset">Reset</button>
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
          val: 0,
          locked: false
        },
        b: {
          label: 'balance',
          unit: 'cm',
          val: 0,
          locked: false
        },
        sw: {
          label: 'swingweight',
          unit: 'kg*cm^2',
          val: 0,
          locked: false
        }
      }
    }
  },
  computed: {
    massInKG() {
      return this.viewModel.m.val / 1000
    },
    MGR: {
      get() {
        return Number.parseFloat(
          (this.massInKG * 980.6 * this.viewModel.b.val) /
            (this.viewModel.sw.val +
              20 * this.massInKG * this.viewModel.b.val -
              100 * this.massInKG)
        ).toFixed(3)
      },
      set(newValue) {
        console.log(newValue)
      }
    },
    M: {
      get() {
        return Number.parseFloat(
          this.massInKG * this.viewModel.b.val * this.viewModel.b.val
        ).toFixed(2)
      },
      set(newValue) {
        if (!this.viewModel.m.locked) {
          this.viewModel.m.val = this.massInGrams(newValue)
          this.$nextTick(() => {
            $('#slider-m').slider('set value', this.viewModel.m.val)
          })
        }

        if (!this.viewModel.b.locked) {
          this.viewModel.b.val = this.balance(newValue)
          this.$nextTick(() => {
            $('#slider-b').slider('set value', this.viewModel.b.val)
          })
        }
      }
    }
  },
  methods: {
    massInGrams(M) {
      let m = (M / (this.viewModel.b.val * this.viewModel.b.val)) * 1000
      let mRounded = Math.round(
        (M / (this.viewModel.b.val * this.viewModel.b.val)) * 1000
      )

      console.log(m + ' >> ' + mRounded)

      return mRounded
    },
    balance(M) {
      let bal = Math.sqrt(M / this.massInKG)

      console.log(bal)

      return bal
    },
    reset() {
      this.init()
    },
    init() {
      let vm = this

      for (const prop in this.viewModel) {
        if (this.viewModel.hasOwnProperty(prop)) {
          this.viewModel[prop].locked = false
        }
      }

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
  },
  mounted() {
    let vm = this

    this.init()
  }
}
</script>

<style>
#container {
  padding-top: 3rem;
}
</style>
