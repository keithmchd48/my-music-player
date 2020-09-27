<template>
  <div id="app">
    <header>
      <h1>My Playlist Player</h1>
    </header>
    <main>
      <section class="player">
        <h2 class="song-title">{{ current.title }} - <span>{{ current.artist }}</span></h2>
        <div class="settings">
          <button class="next" @click="skip5s('backward')">Back-up 5s</button>
          <div class="time_slider">
            {{displayCurrentTime}}   <input id="range" type="range" min="0" :max="songDuration" @change="seek" :value="currentTime" /> {{dispayDuration}}
          </div>
          <button class="next" @click="skip5s('forward')">Forward 5s</button>
        </div>
        <div class="controls">
          <button class="prev" @click="previousSong">Prev</button>
          <button class="play" v-if="!isPlaying" @click="playSong">Play</button>
          <button class="pause" v-else @click="pauseSong">Pause</button>
          <button class="next" @click="nextSong">Next</button>
        </div>
      </section>
      <section class="playlist">
        <h3>The Playlist</h3>
        <button class="song"
                v-for="song in songs"
                :key="song.src"
                @click="playSong(song)"
                :class="{'playing': (song.src == current.src)}">
          {{ song.title }} - {{ song.artist }}
        </button>
      </section>
    </main>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
export default {
  name: 'App',
  setup () {
    // prettify time from seconds to "mins:seconds"
    function prettyTime(time) {
      let mins = Math.floor(time / 60)
      let seconds = Math.round(time % 60)
      seconds = seconds < 10 ? '0' + seconds : seconds
      return `${mins}:${seconds}`
    }
    // current song from the "songs" array
    const current = ref({})
    // index to keep track of "songs" array
    const index = ref(0)
    // determine if the song is playing or paused
    const isPlaying = ref(false)
    // the Web Audio API object
    const player = ref(new Audio())
    // the current time in seconds of the song's position
    const currentTime = ref(0)
    // prettify "currentTime"
    const displayCurrentTime = computed(function () {
      return prettyTime(currentTime.value)
    })
    // the total length of the song
    const songDuration = ref(0)
    // prettify "songDuration"
    const dispayDuration = computed(function () {
      return prettyTime(songDuration.value)
    })
    // all the songs in the array
    const songs = ref([
      {
        title: 'A Window to the past',
        artist: 'John Williams',
        src: require('./assets/a-window-to-the-past.mp3')
      },
      {
        title: 'Nobody But Me',
        artist: 'The Human Beinz',
        src: require('./assets/nobody-but-me.mp3')
      },
      {
        title: 'The Other Side',
        artist: 'Hugh Jackman & Zac Efron',
        src: require('./assets/the-other-side.mp3')
      },
      {
        title: 'O Children',
        artist: 'Nick Cave & The Bad Seeds',
        src: require('./assets/o-children.mp3')
      }
    ])

    // as the song proceeds, update the currentTime of the song
    player.value.addEventListener('timeupdate', function () {
      currentTime.value = player.value.currentTime
    })
    // when the song changes, the songDuration variable changes
    watch(current, function () {
      player.value.onloadedmetadata = function() {
        // update the duration variable to the length of the selected song
        songDuration.value = player.value.duration
      };
    })

    // by default, set the current song as the first one in the array
    current.value = songs.value[index.value]
    player.value.src = current.value.src

    // using the Web Audio API object "player", we play the song by calling the .play() method on the object
    function playSong (song = null) {
      if (song.src) {
        current.value = song
        player.value.src = song.src
      }
      player.value.play()
      // when current song ends, automatically switch to the next song in the songs array
      player.value.addEventListener('ended', () => {
        nextSong()
      })
      isPlaying.value = true
    }
    // switch to the next song in the array
    function nextSong () {
     index.value++
      // if the index has gone beyond the songs array length, the set index to first song in the array
      if (index.value > songs.value.length - 1) {
        index.value = 0
      }
      current.value = songs.value[index.value]
      playSong(current.value)
    }
    function pauseSong () {
      player.value.pause()
      isPlaying.value = false
    }
    function previousSong () {
      index.value--
      // if the index has gone to negative integer, then set the index to last song in the array
      if (index.value < 0) {
        index.value = songs.value.length - 1
      }
      current.value = songs.value[index.value]
      playSong(current.value)
    }
    // skip (either backwards or forwards) the current song by 5 seconds
    function skip5s(skip) {
      if (skip === 'forward') player.value.currentTime += 5
      else player.value.currentTime -= 5
    }
    // when user makes changes to the slider, we call this function
    function seek(event) {
      // change the "currentTime" property of the Web Audio API object
      player.value.currentTime = event.target.value
      // change the "currentTime" ref variable to target time
      currentTime.value = event.target.value
    }
    return {
      current,
      isPlaying,
      songs,
      songDuration,
      dispayDuration,
      currentTime,
      displayCurrentTime,
      seek,
      playSong,
      pauseSong,
      nextSong,
      previousSong,
      skip5s
    }
  },
  // data () {
  //   return {
  //     current: {},
  //     index: 0,
  //     isPlaying: false,
  //     songs: [
  //       {
  //         title: 'A Window to the past',
  //         artist: 'John Williams',
  //         src: require('./assets/a-window-to-the-past.mp3')
  //       },
  //       {
  //         title: 'Nobody But Me',
  //         artist: 'The Human Beinz',
  //         src: require('./assets/nobody-but-me.mp3')
  //       },
  //       {
  //         title: 'The Other Side',
  //         artist: 'Hugh Jackman & Zac Efron',
  //         src: require('./assets/the-other-side.mp3')
  //       }
  //     ],
  //     player: new Audio()
  //   }
  // },
  // created () {
  //   this.current = this.songs[this.index]
  //   this.player.src = this.current.src
  //   // this.player.play()
  // },
  // methods: {
    // play (song = null) {
    //   if (song.src) {
    //     this.current = song
    //     this.player.src = song.src
    //   }
    //   this.player.play()
    //   // when current song ends, automatically switch to the next song in the songs array
    //   this.player.addEventListener('ended', () => {
    //     this.next()
    //   })
    //   this.isPlaying = true
    // },
    // pause () {
    //   this.player.pause()
    //   this.isPlaying = false
    // },
    // next () {
    //   this.index++
    //   // if the index has gone beyond the songs array length, the set index to first song in the array
    //   if (this.index > this.songs.length - 1) {
    //     this.index = 0
    //   }
    //   this.current = this.songs[this.index]
    //   this.play(this.current)
    // },
    // previous () {
    //   this.index--
    //   // if the index has gone to negative integer, then set the index to last song in the array
    //   if (this.index < 0) {
    //     this.index = this.songs.length - 1
    //   }
    //   this.current = this.songs[this.index]
    //   this.play(this.current)
    // }
  // }
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: sans-serif;
  }
  header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px;
    background-color: #212121;
    color: #FFF;
  }
  main {
    width: 100%;
    max-width: 768px;
    margin: 0 auto;
    padding: 25px;
  }
  .song-title {
    color: #53565A;
    font-size: 32px;
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
  }
  .song-title span {
    font-weight: 400;
    font-style: italic;
  }
  .controls {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 15px;
  }
  button {
    appearance: none;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
  }
  button:hover {
    opacity: 0.8;
  }
  .play, .pause {
    font-size: 20px;
    font-weight: 700;
    padding: 15px 25px;
    margin: 0px 15px;
    border-radius: 8px;
    color: #FFF;
    background-color: #CC2E5D;
  }
  .next, .prev {
    font-size: 16px;
    font-weight: 700;
    padding: 10px 20px;
    margin: 0px 15px;
    border-radius: 6px;
    color: #FFF;
    background-color: #FF5858;
  }
  .playlist {
    padding: 0px 30px;
  }
  .playlist h3 {
    color: #212121;
    font-size: 28px;
    font-weight: 400;
    margin-bottom: 30px;
    text-align: center;
  }
  .playlist .song {
    display: block;
    width: 100%;
    padding: 15px;
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
  }
  .playlist .song:hover {
    color: #FF5858;
  }
  .playlist .song.playing {
    color: #FFF;
    background-image: linear-gradient(to right, #CC2E5D, #FF5858);
  }
  .settings {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .time_slider {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #range {
    width: 80%;
  }
</style>
