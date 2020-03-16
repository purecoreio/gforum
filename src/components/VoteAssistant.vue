<template>
  <div>
    <v-snackbar v-model="snackbar">
      Thank you so much for voting! Thanks to you {{sites[0].network.name}} will be more popular!
      <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-expand-transition>
      <v-card v-show="voting" outlined>
        <v-stepper v-model="s">
          <v-stepper-header>
            <v-stepper-step
              @click="s=i+1"
              editable
              v-for="(site,i) in sites"
              :key="site.votingSite.uuid"
              :step="i+1"
            >
              <v-expand-x-transition>
                <div
                  v-show="sites[s-1]==site"
                  style="overflow: hidden; width: 100%;white-space: nowrap; "
                >
                  <span>{{site.votingSite.name}}</span>
                </div>
              </v-expand-x-transition>
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items style="height: 700px; position: relative">
            <v-stepper-content
              class="pa-0"
              style="position: absolute; width: 100%; height: 100%; top: 0px; left: 0px;"
              v-for="(site,i) in sites"
              :key="site.votingSite.uuid+'D'"
              :step="i+1"
            >
              <v-row
                style="position: absolute; width: 100%; height: 100%; top: 0px; left: 0px"
                align="center"
                justify="center"
              >
                <v-col>
                  <center>
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </center>
                </v-col>
              </v-row>
              <iframe
                v-if="sites[s-1]==site"
                style="position: absolute; width: 100%; height: 100%; top: 0px; left: 0px"
                :src="site.url"
                frameborder="0"
              ></iframe>
            </v-stepper-content>

            <div
              class="pa-5 text-right"
              style="position: absolute; width: 100%; bottom: 0px; left: 0px; background-color: rgba(0,0,0,0.6)"
            >
              <v-btn v-if="s>1" text @click="previous()">
                <v-icon>navigate_before</v-icon>Previous
              </v-btn>
              <v-btn v-if="s!=sites.length" color="primary" @click="next()">
                Next
                <v-icon>navigate_next</v-icon>
              </v-btn>
              <v-btn v-if="s==sites.length" color="primary" @click="finish()">
                Finish
                <v-icon>skip_next</v-icon>
              </v-btn>
            </div>
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  props: ["sites"],
  data: () => ({
    s: 1,
    voting: true,
    snackbar: false
  }),
  methods: {
    next() {
      this.s++;
    },
    previous() {
      this.s += -1;
    },
    finish() {
      this.voting = false;
      this.snackbar = true;
      setTimeout(() => {
        this.snackbar = false;
      }, 3000);
    }
  }
};
</script>