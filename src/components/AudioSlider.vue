<template>
  <input id="range" type="range" min="0" :max="songDuration" @change="seek" :value="currentTime" />
</template>

<script>
  export default {
    name: "AudioSlider",
    props: {
      currentTime: {
        type: Number,
        required: true
      },
      songDuration: {
        type: Number,
        required: true
      },
      seek: {
        type: Function,
        required: true
      }
    }
  }
</script>

<style scoped>
  #range {
    width: 80%;
  }
  input[type=range] {
    height: 25px;
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
  }
  input[type=range]:focus {
    outline: none;
  }
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: #FF5858;
    border-radius: 1px;
    border: 0px solid #000000;
  }
  input[type=range]::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #8e1336;
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: #CC2E5D;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -7px;
  }
  input[type=range]:focus::-webkit-slider-runnable-track {
    background: #FF5858;
  }
  input[type=range]::-moz-range-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: #FF5858;
    border-radius: 1px;
    border: 0px solid #000000;
  }
  input[type=range]::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #FF5858;
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: #CC2E5D;
    cursor: pointer;
  }
  input[type=range]::-ms-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type=range]::-ms-fill-lower {
    background: #FF5858;
    border: 0px solid #000000;
    border-radius: 2px;
    box-shadow: 0px 0px 0px #000000;
  }
  input[type=range]::-ms-fill-upper {
    background: #FF5858;
    border: 0px solid #000000;
    border-radius: 2px;
    box-shadow: 0px 0px 0px #000000;
  }
  input[type=range]::-ms-thumb {
    margin-top: 1px;
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #FF5858;
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: #CC2E5D;
    cursor: pointer;
  }
  input[type=range]:focus::-ms-fill-lower {
    background: #FF5858;
  }
  input[type=range]:focus::-ms-fill-upper {
    background: #FF5858;
  }
</style>
