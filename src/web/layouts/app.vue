<template>
<v-app>
  <v-content>
    <nuxt></nuxt>
  </v-content>
</v-app>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  mounted() {
    this.loadToken()
  },
  methods: {
    loadToken() {
      if (!localStorage._BOSS_TOKEN) {
        if (Cookies.get('auth')) {
          localStorage._BOSS_TOKEN = Cookies.get('auth')
        }
      }
    }
  }
}
</script>
