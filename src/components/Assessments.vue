<template>
  <table class="assessments">
    <tr>
      <td>
        Team Health Check {{ assessments }}
      </td>
      <td>
        <table>
          <thead>
            <tr>
              <th>
                Date
              </th>
              <th>
                Name
              </th>
              <th>
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(healthCheck, tindex) in assessments.healthCheck" :key="tindex">
              <td>
                {{ healthCheck.date }}
              </td>
              <td>
                {{ healthCheck.assessment.name }}
              </td>
              <td>
                {{ healthCheck.assessment.email }}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        5 Dysfunctions
      </td>
      <td>
        <table>
          <thead>
            <tr>
              <th>
                Date
              </th>
              <th>
                Name
              </th>
              <th>
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dysfunctions, dindex) in assessments.fiveDysfunctions" :key="dindex">
              <td>
                {{ dysfunctions.date }}
              </td>
              <td>
                {{ dysfunctions.assessment.name }}
              </td>
              <td>
                {{ dysfunctions.assessment.email }}
              </td>
            </tr>
          </tbody>
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
      assessments: {}
    }
  },
  created() {
    bus.$emit('sendLoadAssessments')

    setInterval(() => {
      bus.$emit('sendLoadAssessments')
    }, 60000)

    bus.$on('loadAssessments', (data) => {
      console.log('assessment', data)
      this.assessments[data.type] = data.results
      console.log(this.assessments)
    })
  }
}
</script>

<style lang="scss">
.assessments {
  td {
    color: #444;
  }
}
</style>
