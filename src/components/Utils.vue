<template>
  <table class="utils">
    <tr>
      <td>
        Local Storage <button class="btn btn-sm btn-secondary smaller-font" @click="loadLocalStorage()">
          Load
        </button>
      </td>
      <td>
        <table>
          <tr v-for="(item, index) in storage" :key="index">
            <td>{{ item.key }}</td>
            <td>{{ item.value }}</td>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" @click="deleteLocalStorage(item.key)">
                Delete
              </button>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  data() {
    return {
      storage: []
    }
  },
  methods: {
    loadLocalStorage() {
      this.storage = []
      for (let i = 0; i < localStorage.length; i++)   {
        this.storage.push({
          key: localStorage.key(i),
          value: localStorage.getItem(localStorage.key(i))
        })
      }
    },
    deleteLocalStorage(key) {
      localStorage.removeItem(key)
      this.loadLocalStorage()
    }
  }
}
</script>

<style lang="scss">
  .utils, .utils td {
    color: #444;
    border: 1px solid;
  }
</style>
