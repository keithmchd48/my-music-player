<template>
  <div class="music-player">
    <div class="time_slider">
      <span class="current-time">{{displayCurrentTime}}</span>
      <slot></slot>
      <span class="duration-time">{{displayDuration}}</span>
    </div>
    <div class="skip-wrapper">
      <button class="next skip-5" @click="skip5sBackward"><i class="fas fa-angle-double-left"></i> 5s</button>
      <button class="next skip-5" @click="skip5sForward">5s <i class="fas fa-angle-double-right"></i></button>
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "MusicPlayer",
  props: {
    displayCurrentTime: {
      type: String,
      required: true
    },
    displayDuration: {
      type: String,
      required: true
    }
  },
  setup(props, {emit}) {
    const skip5sForward = () => {
      emit('skip5s', 'forward')
    }
    const skip5sBackward = () => {
      emit('skip5s', 'backward')
    }

    return {skip5sForward, skip5sBackward}
  }
})
</script>

<style scoped>
.music-player {
  max-width: 81%;
  margin: 0 auto;
  margin-top: 1.5rem;
}
.skip-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 30%;
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
