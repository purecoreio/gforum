<template>
  <div>
    <v-timeline dense>
      <v-timeline-item
        v-for="connection in connections"
        :key="connection.uuid"
        color="primary"
        small
        fill-dot
      >
        <v-card class="elevation-2 pa-5" v-if="connection.status.closedOn.valueOf() == 0">
          <div class="overline mb-1">#{{connection.uuid}}</div>
          <div class="overline mb-2">for {{getSexyDate(connection.status.openedOn)}}</div>
          <v-list-item-title><span style="color: #77DD77">online</span> on cool1</v-list-item-title>
        </v-card>
        <v-card class="elevation-2 pa-5" v-if="connection.status.closedOn.valueOf() != 0">
          <div class="overline mb-1">#{{connection.uuid}}</div>
          <div class="overline mb-2">for {{getSexyDate((new Date().valueOf() - (connection.status.closedOn - connection.status.openedOn)))}} {{getSexyDate(connection.status.closedOn)}} {{getSexyDate(connection.status.closedOn).includes("/") ? '' : 'ago'}}</div>
          <v-list-item-title>played on {{connection.instance.name}}</v-list-item-title>
        </v-card>
      </v-timeline-item>
      <div v-if="loading">
        <v-timeline-item v-for="index in 20" :key="index" color="primary" small fill-dot>
          <v-card class="elevation-2">
            <v-skeleton-loader class="pa-5" type="paragraph" height="93" />
          </v-card>
        </v-timeline-item>
      </div>
    </v-timeline>
    <div
      style="height:200px; width: 100%; transform: translateY(-200px)"
      v-intersect.once="onIntersect"
      v-if="!loading && !stoploading"
    ></div>
    <v-scroll-y-transition>
      <End v-show="stoploading"/>
    </v-scroll-y-transition>
  </div>
</template>

<script>
import End from '../Empty/End'
export default {
  mounted() {
    this.load();
  },
  components: {
    End: End
  },
  data: () => ({
    show: true,
    loading: false,
    stoploading: false,
    page: 0,
    connections: []
  }),
  props: ["player"],
  methods: {
    onIntersect(entries, observer, isIntersecting) {
      if (isIntersecting) {
        this.load();
      }
    },
    getSexyDate: function(date) {
      var secondsElapsed = (Date.now() - date) / 1000;
      if (secondsElapsed < 3600) {
        if (Math.floor(secondsElapsed / 60) > 1) {
          return Math.floor(secondsElapsed / 60) + " minutes";
        } else {
          return "1 minute";
        }
      } else if (secondsElapsed < 3600 * 24) {
        if (Math.floor(secondsElapsed / 3600) > 1) {
          return Math.floor(secondsElapsed / 3600) + " hours";
        } else {
          return "1 hour";
        }
      } else if (secondsElapsed > 3600 * 24 && secondsElapsed < 3600 * 24 * 7) {
        if (Math.floor(secondsElapsed / (3600 * 24)) > 1) {
          return Math.floor(secondsElapsed / (3600 * 24)) + " days";
        } else {
          return "1 day";
        }
      } else {
        return (
          date.getDate() + "/" + parseInt(date.getMonth() + 1) + "/" + date.getFullYear()
        );
      }
    },
    load: function() {
      let main = this;
      if (!main.stoploading) {
        main.loading = true;
        this.player.getConnections(null, main.page).then(function(data) {
          if (data.length > 0) {
            if (main.page == 0) {
              main.connections = data;
            } else {
              data.forEach(conn => {
                main.connections.push(conn);
              });
            }
          } else {
            main.stoploading = true;
          }
          main.loading = false;
          main.page++;
        });
      }
    }
  },
  watch: {
    player() {
      this.load();
    }
  }
};
</script>