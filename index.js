import { ScriptManager } from './scriptManager.js'

// store the current window/tab connection index
let connectionIndex

// make a connection to the Shared Worker
const worker = new SharedWorker("sw.js");
worker.port.start();

// listen to shared worker messages
worker.port.onmessage = function (event) {

  // When a new window/tab is opened the shared worker
  // posts an `init` event with the window/tab index
  if(event.data.key === 'init') {

    // get the new(current) window/tab connection index from event
    connectionIndex = event.data.connectionIndex

    // if current connectionIndex equals to 0 means this window
    // should handle running the script because its the first
    // window to be openned
    if(connectionIndex === 0) {
      ScriptManager.run()
    }
  }

  // listening to closed connections (any window/tab is closed)
  // and update the current window/tab connection index
  if(event.data.key === 'connection-removed') {

    // if the window/tab index is larger than the current
    // window/tab index then do nothing
    if(event.data.connectionIndex > connectionIndex) return

    // if a window/tab with a connection index is smaller
    // than the current window/tab index then reduce the current index
    connectionIndex--

    // after updating the index, ifcurrent connectionIndex equals to 0
    // means this window is the new candidate to handle running the script
    // because all prior windows/tabs has been closed
    if(connectionIndex === 0) {
      ScriptManager.run()
    }
  }
};

// add an event listener to windows/tabs closing
window.addEventListener('beforeunload', function (e) {
  // post a message to the worker about the event and the window/tab index
  worker.port.postMessage({ key: "window-unload", connectionIndex })
});