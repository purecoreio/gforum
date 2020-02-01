<template>
  <div>
    <center>
      <v-scroll-y-transition>
        <div v-show="error!=''" style="max-width: 600px">
          <Privacy class="mb-6" />
          <v-alert text color="primary">{{error}}</v-alert>
        </div>
      </v-scroll-y-transition>
    </center>
    <div v-if="offences!=null">
      <center>
        <v-scroll-y-transition>
          <div v-show="offences.length==0 && error==''" style="max-width: 600px">
            <Perks class="mb-6" />
          </div>
        </v-scroll-y-transition>
      </center>
    </div>
    <div v-if="offences==null && error==''">
      <v-row>
        <v-col cols="12" v-for="i in 10" :key="i">
          <v-skeleton-loader type="list-item-avatar-two-line" />
        </v-col>
      </v-row>
    </div>
    <div v-if="offences!=null && error==''">
      <div v-if="offences.length>0">
        <v-card outlined class="pa-5 mb-4">
          <v-card-title>Chat Offences</v-card-title>
          <v-card-subtitle>Offences related to direct community interactions</v-card-subtitle>
          <v-divider class="mb-4" />
          <v-list-item-group>
            <div v-for="offence in offences" :key="offence.uuid">
              <v-list-item v-if="offence.type=='CHT'">
                <v-list-item-avatar>
                  <v-avatar>-{{offence.negativePoints}}</v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{offence.name}}</v-list-item-title>
                  <v-list-item-subtitle>{{offence.description}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-list-item-group>
        </v-card>
        <v-card outlined class="pa-5 mb-4">
          <v-card-title>Gameplay Offences</v-card-title>
          <v-card-subtitle>Offences related to direct game behavior</v-card-subtitle>
          <v-divider class="mb-4" />
          <v-list-item-group>
            <div v-for="offence in offences" :key="offence.uuid">
              <v-list-item v-if="offence.type=='GMP'">
                <v-list-item-avatar>
                  <v-avatar>-{{offence.negativePoints}}</v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{offence.name}}</v-list-item-title>
                  <v-list-item-subtitle>{{offence.description}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-list-item-group>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import Privacy from "../Empty/Privacy";
import Perks from "../Empty/PunishmentPerks";

export default {
  components: {
    Privacy: Privacy,
    Perks: Perks
  },
  props: ["network"],
  mounted() {
    let main = this;
    this.$nextTick(() => {
      this.network
        .getOffences()
        .then(function(offences) {
          main.offences = offences;
        })
        .catch(function(error) {
          main.error = error.message;
        });
    });
  },
  data: () => ({
    show: true,
    error: "",
    offences: null
  })
};
</script>