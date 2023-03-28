<template>
  <div id="app">
    <noscript><h2 style="color: #ff0000">Seems your browser doesn't support Javascript! Websocket relies on Javascript being enabled. Please enable Javascript and reload this page!</h2></noscript>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <form class="form-inline">
            <div class="form-group">
              <label for="connect">WebSocket connection:</label>
              <input type="text" id="channel" class="form-control" v-model="channel" placeholder="Your name here...">
              <button @click.prevent="connect" :disabled="connected" class="btn btn-default" type="submit">Connect</button>
              <button @click.prevent="disconnect" :disabled="!connected" class="btn btn-default" type="submit">Disconnect</button>
            </div>
          </form>
        </div>
        <div class="col-md-6">
          <form class="form-inline">
            <div class="form-group">
              <label for="name">What is your name?</label>
              <input type="text" id="name" class="form-control" v-model="name" placeholder="Your name here...">
            </div>
            <button @click.prevent="send" :disabled="!connected" class="btn btn-default" type="submit">Send</button>
          </form>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <table id="conversation" class="table table-striped" v-show="connected">
            <thead>
              <tr>
                <th>Greetings</th>
              </tr>
            </thead>
            <tbody id="greetings">
              <tr v-for="greeting in greetings" :key="greeting">
                <td>{{ greeting }}</td>
              </tr>
            </tbody>
          </table>
        </div>
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
      greetings: [],
      name: '',
      channel: ''
    }
  },
  methods: {
    connect () {
      const accessToken =
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjODdhZmQ0OS05NTZmLTRlNGMtOTgyOS1mMmYyNGExOTM2OTUiLCJhdXRoIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE2ODAwMDQ1NTQsImV4cCI6MTY4MDAyNjE2N30.9wxaR-OA57RcgDVnLHkX7qhO-P-Yf-nAwX8suh8rniZR1CReh923-tERsghBd20h-g9lK4FGUQATJRxXGDwGEQ'
      const refreshToken =
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjODdhZmQ0OS05NTZmLTRlNGMtOTgyOS1mMmYyNGExOTM2OTUiLCJhdXRoIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE2ODAwMDQ1NTQsImV4cCI6MTY4MDYwOTM2N30.kzTzeGLRkgBrSkZoZXUCOMqH21RCESPhoDQYBP5nrqmgTUiR3XXXN14PMio4KIxT29NCBcsrcWmqQCK7BgQSDg'
      const userId = '1e619b70-bffa-4f4c-8fe5-deb70492c907'
      const socket = new SockJS('/api/wait-service/wait-websocket', {}, {transports: ['websocket', 'xhr-streaming', 'xhr-polling']})
      this.stompClient = Stomp.over(socket)
      this.stompClient.heartbeat.outgoing = 20000 // 클라이언트가 서버로 하트비트를 보낼 간격(밀리초)
      this.stompClient.heartbeat.incoming = 20000
      this.stompClient.connect((frame) => {
        this.connected = true
        // console.log('Connected: ' + frame)
        console.log('test Connection')

        const waitRoomId = this.channel
        this.stompClient.send(
          `/api/waitroom/pub/${waitRoomId}/join`,
          {
            'Authorization': accessToken,
            'RefreshToken': refreshToken,
            'UserId': userId
          },
          JSON.stringify({
            userId: userId,
            roomId: waitRoomId
          })
        )
        this.stompClient.subscribe(`/api/waitroom/sub/${waitRoomId}/join`, (chatMessageResponse) => {
          const message = JSON.parse(chatMessageResponse.body)
          console.log('Message:', message)
          this.showGreeting(message.content)
          console.log('UserId:', message.userId)
          console.log('JoinStatus:', message.joinStatus)
          console.log('CreatedAt:', message.createdAt)
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
