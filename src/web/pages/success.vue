<template>
<v-container fluid fill-height>
<v-layout align-center justify-center color="success">
  <v-flex xs12 sm6 lg3>
    <v-card class="pa-5 text-xs-center">
      <div class="pa-3 display-1">
        <v-icon large color="success">check_circle</v-icon>
        Login Success
      </div>
      <div class="ma-3" id="extra-message">You can close this page</div>
    </v-card>
  </v-flex>
</v-layout>
</v-container>
</template>
<script>
export default {
  layout: 'app',
}
</script>
