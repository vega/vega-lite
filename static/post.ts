// copied from https://github.com/vega/vega-embed/blob/master/src/post.ts

import {Renderers} from 'vega';

/**
 * Open editor url in a new window, and pass a message.
 */
export function post(window: Window, url: string, data: {config?: any; mode: any; renderer?: Renderers; spec: string}) {
  const editor = window.open(url);
  const wait = 10000;
  const step = 250;
  let count = ~~(wait / step);

  function listen(evt: MessageEvent) {
    if (evt.source === editor) {
      count = 0;
      window.removeEventListener('message', listen, false);
    }
  }
  window.addEventListener('message', listen, false);

  // send message
  // periodically resend until ack received or timeout
  function send() {
    if (count <= 0) {
      return;
    }
    editor.postMessage(data, '*');
    setTimeout(send, step);
    count -= 1;
  }
  setTimeout(send, step);
}
