// store for all connections
const allPorts = [];

onconnect = e => {
  const port = e.ports[0]

  // each window connectes to the worker we post back to the same window
  // and assigning it an index based on the connections count
  port.postMessage({ key: 'init', connectionIndex: allPorts.length - 1 })

  // listening to any message from any window/tab
  port.onmessage = e => {
    if(e.data.key === 'window-unload') {// if its a window/tab closed event
      // remove the closed window connection from the pool
      allPorts.splice(e.data.connectionIndex, 1)

      // post a message to all other connections notifying about the closed connection
      allPorts.forEach(port => {
        port.postMessage({ 
          key: 'connection-removed',
          connectionIndex: e.data.connectionIndex
        });
      })
    }
  }
}