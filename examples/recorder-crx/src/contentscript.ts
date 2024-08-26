// if not running as a chrome extension, skip this...
if (typeof chrome !== 'undefined' && chrome.runtime) {
  let _port: chrome.runtime.Port | undefined;

  const wnd: any = window;

  wnd.dispatch = async function _onDispatch(data: any) {
    _port?.postMessage({ type: 'recorderEvent', ...data });
  };

  chrome.runtime.onConnect.addListener(port => {
    _port = port;

    port.onMessage.addListener(async msg => {
      if (!('type' in msg) || msg.type !== 'recorder') return;

      switch (msg.method) {
        case 'setPaused': wnd.playwrightSetPaused(msg.paused); break;
        case 'setMode': wnd.playwrightSetMode(msg.mode); break;
        case 'setSources': wnd.playwrightSetSources(msg.sources); break;
        case 'updateCallLogs': wnd.playwrightUpdateLogs(msg.callLogs); break;
        case 'setSelector': wnd.playwrightSetSelector(msg.selector, msg.userGesture); break;
        case 'setFileIfNeeded': wnd.playwrightSetFileIfNeeded(msg.file); break;
      }
    });

    port.onDisconnect.addListener(() => {
      _port = undefined;
    });
  });
}
