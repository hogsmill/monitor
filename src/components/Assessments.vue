<template>
  <table class="assessments">
    <tr>
      <td>Local Storage <button class="btn btn-sm btn-secondary smaller-font" @click="loadLocalStorage()">Load</button></td>
      <td>
        <table>
          <tr v-for="(item, index) in storage" :key="index">
            <td>{{ item.key }}</td>
            <td>{{ item.value }}</td>
            <td><button class="btn btn-sm btn-secondary smaller-font" @click="deleteLocalStorage(item.key)">Delete</button></td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../socket.js'

export default {
  data() {
    return {
      storage: []
    }
  },
  creeated() {
    bus.$on('loadAsessments', (data) => {
    console.log(data)
      this.assessments = data
    })
  },
  methods: {
    loadAssessments() {
      bus.$emit('sendLoadAssessments')
    }
  }
}
</script>

<style lang="scss">
</style>
