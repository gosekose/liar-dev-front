<template>
  <div id="app">
    <button @click="connect" :disabled="connected" id="connect">Connect</button>
    <button @click="disconnect" :disabled="!connected" id="disconnect">Disconnect</button>
    <div id="conversation" v-show="connected">
      <h2>Greetings</h2>
      <div id="greetings">
        <p v-for="greeting in greetings" :key="greeting">{{ greeting }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export default {
  data () {
    return {
      stompClient: null,
      connected: false,
      greetings: []
    }
  },
  methods: {
    connect () {
      const accessToken =
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjOANMz2gvx0ywJNRlzZR9v4MHeZMTo3Sm9n-YcawpcmoauyYc9uYw'
      const refreshToken =
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWqRUIvVHdefWopYRrj4HOnc04ehSSGXEHe3B-TEaPQ8fdN5drevWkTvFg'
      const userId = 'c87afd49-956f-4e4c-9829-f2f24a193695'

      const socket = new SockJS('http://localhost:8000/wait-service/wait-websocket')
      const customHeaders = {
        Authorization: accessToken,
        RefreshToken: refreshToken,
        UserId: userId
      }

      this.stompClient = Stomp.over(socket)
      this.stompClient.heartbeat.outgoing = 0
      this.stompClient.heartbeat.incoming = 0
      this.stompClient.connect(customHeaders, (frame) => {
        this.connected = true
        console.log('Connected: ' + frame)

        this.stompClient.subscribe('/waitroom/sub/channel_id/join', (greeting) => {
          this.showGreeting(JSON.parse(greeting.body).content)
          console.log(JSON.parse(greeting.body).content)
        })
      })
    },
    disconnect () {
      if (this.stompClient !== null) {
        this.stompClient.disconnect()
      }
      this.connected = false
      console.log('Disconnected')
    },
    showGreeting (message) {
      this.greetings.push(message)
    }
  }
}
</script>

<style scoped>
button {
  margin: 0 1rem;
}
</style>
