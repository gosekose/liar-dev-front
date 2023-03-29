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
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjODdhZmQ0OS05NTZmLTRlNGMtOTgyOS1mMmYyNGExOTM2OTUiLCJhdXRoIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE2ODAxMTAxOTAsImV4cCI6MTY4MDEzMTgxNH0.R1VRQ-TnZZFz-gDLQ8YUY7LPR9NAOD6UAeWztCaV2vlm0sdlYplm8uz3Y4KJTmvneG8A8opso6MGHS7utZP6Dg'
      const refreshToken =
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjODdhZmQ0OS05NTZmLTRlNGMtOTgyOS1mMmYyNGExOTM2OTUiLCJhdXRoIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE2ODAxMTAxOTAsImV4cCI6MTY4MDcxNTA0NH0.kmdtldnAE5EHaoiSmRkp8uz9M1Yk3xbURwVaea3RSLK5_xDX4xcm5ht1xl0uNM5N2TcvwYu-CVH31OfUfDIPoQ'
      const userId = 'c87afd49-956f-4e4c-9829-f2f24a193695'
      const socket = new SockJS('/api/wait-service/wait-websocket', {}, {transports: ['websocket', 'xhr-streaming', 'xhr-polling']})
      // const socket = new WebSocket('/api/wait-service/wait-websocket')

      this.stompClient = Stomp.over(socket)
      this.stompClient.heartbeat.outgoing = 25000 // 클라이언트가 서버로 하트비트를 보낼 간격(밀리초)
      this.stompClient.heartbeat.incoming = 25000

      const waitRoomId = this.channel
      const headers = {
        'Authorization': accessToken,
        'RefreshToken': refreshToken,
        'UserId': userId,
        'WaitRoomId': waitRoomId,
        'destination': `/wait-service/waitroom/sub/${waitRoomId}/join`
      }

      console.log(`/api/wait-service/waitroom/sub/${waitRoomId}/join`)
      console.log('waitRoomId = ', waitRoomId)
      this.stompClient.connect(headers, (frame) => {
        console.log('frame = ', frame)
        this.stompClient.subscribe(
          `/wait-service/waitroom/sub/${waitRoomId}/join`, (chatMessageResponse) => {
            console.log('log', JSON.stringify(chatMessageResponse))
          }, (error) => {
            console.log(error)
          })

        this.stompClient.subscribe(
          `/user/queue/errors`, headers, (chatMessageResponse) => {
            console.log('log', JSON.stringify(chatMessageResponse))
          }, (error) => {
            console.log(error)
          })

        this.stompClient.send(`/wait-service/waitroom/pub/${waitRoomId}/join`, headers,
          JSON.stringify({
            userId: userId,
            roomId: waitRoomId
          }))
      })
      this.connected = true
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
