export default function usePrettify() {
// prettify time from seconds to "mins:seconds"
  const prettyTime = (time) => {
    const mins = Math.floor(time / 60)
    let seconds = Math.round(time % 60)
    seconds = seconds < 10 ? '0' + seconds : seconds
    return `${mins}:${seconds}`
  }

  return { prettyTime }
}
