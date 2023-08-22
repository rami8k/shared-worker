
export const ScriptManager = {
  run: async (interval) => {
    setInterval(async () => {
      console.log('running')
    }, interval || 10000)
  }
}
