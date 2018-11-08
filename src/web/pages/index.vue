<template>
</template>
<script>
export default {
  layout: 'app',
  fetch({store, redirect}) {
    if (store.state.uid) {
      return redirect('/info')
    } else {
      return redirect('/login')
    }
  },
}
</script>
