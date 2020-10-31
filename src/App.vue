<template>
  <div id="app">
    <header>
      <h1>My Playlist</h1>
    </header>
    <main>
      <section class="player">
        <div class="song">
          <h2 class="song-title">{{ current.title }}</h2>
          <span class="song-artist">{{ current.artist }}</span>
        </div>
        <div class="music-player">
          <div class="time_slider">
            <span class="current-time">{{displayCurrentTime}}</span>
            <AudioSlider :songDuration="songDuration" :seek="seek" :currentTime="currentTime"></AudioSlider>
            <span class="duration-time">{{dispayDuration}}</span>
          </div>
          <div class="skip-wrapper">
            <button class="next skip-5" @click="skip5s('backward')">5s <i class="fas fa-angle-double-left"></i></button>
            <button class="next skip-5" @click="skip5s('forward')"><i class="fas fa-angle-double-right"></i> 5s</button>
          </div>
        </div>
        <div class="controls">
          <button class="prev" @click="previousSong"><i class="fas fa-backward"></i></button>
          <button class="play" v-if="!isPlaying" @click="playSong"><i class="fas fa-play"></i></button>
          <button class="pause" v-else @click="pauseSong"><i class="fas fa-pause"></i></button>
          <button class="next" @click="nextSong"><i class="fas fa-forward"></i></button>
        </div>
      </section>
      <section class="playlist">
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
import songList from '@/songList'
import AudioSlider from "@/components/AudioSlider";
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
    const songs = ref([...songList])

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
        index.value = current.value.id
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
      skip5s,
      AudioSlider,
      index
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
    margin: 1rem auto;
    padding: 25px;
    border-radius: 16px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  }
  .song {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .song-title {
    color: #53565A;
    font-size: 32px;
    font-weight: 700;
    text-align: center;
  }
  .song-artist {
    color: #9fa2a7;
    font-size: 1rem;
  }
  .controls {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 15px;
  }
  .music-player {
    max-width: 81%;
    margin: 0 auto;
    margin-top: 1.5rem;
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
  .skip-wrapper {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 30%;
  }
  .play, .pause {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #FE4880;
    color: #FFF;
    margin: 0 30px;
    border: none;
    appearance: none;
    outline: none;
    cursor: pointer;
    box-shadow: 0 0 12px rgba(254, 72, 128, 0.6);
  }
  .next, .prev {
    background: none;
    border: none;
    appearance: none;
    cursor: pointer;
    outline: none;
    font-size: 1rem;
    color: #CCC;
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
  .time_slider {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  @media only screen and (max-width: 425px) {
    .music-player {
      max-width: 100%;
    }
    .current-time {
      margin-right: 0.5rem;
    }
    .duration-time {
      margin-left: 0.5rem;
    }
  }
</style>
