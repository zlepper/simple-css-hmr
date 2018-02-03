export interface ISetupCssHmrArgs {
    /**
     * The link to the websocker serving the hmr
     */
    hmrLink: string;

    /**
     * The css selector for the <link> tag that normally loads the css
     */
    cssLinkTagSelector: string;
}

/**
 * Starts the hmr replacement
 * @param {string} hrmLink
 */
export function setupCssHmr({hmrLink, cssLinkTagSelector}: ISetupCssHmrArgs) {
    // Get the link element, so we can disable once we have some styling
    const link: HTMLLinkElement | null = document.querySelector(cssLinkTagSelector);
    if (link === null) {
        throw new Error('cssLinkTagSelector did not match any elements.');
    }

    const cssOutput = document.createElement('style');
    document.head.appendChild(cssOutput);

    setupWebSocket(hmrLink, ({name, content}) => {
        if (content) {
            link.remove();
            cssOutput.innerHTML = content;
        } else {
            console.log('css changed, reloading...');
            const src = link.href;
            loadFile(src, content => {
                cssOutput.innerHTML = content;
                console.log('css reloaded');
                link.remove();
            });
        }
    });
}

function loadFile(url: string, cb: (content: string) => void) {
    const request = new XMLHttpRequest();
    url += url.indexOf('?') === -1 ? '?' : '&';
    url += 'cache_buster9001=' + Date.now();

    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                cb(request.responseText);
            } else {
                console.error('Failed to load css file: ' + url);
            }

        }
    };

    request.open('GET', url, true);
    request.send();

}

function setupWebSocket(hmrLink: string, cb: (data: { name: string, content?: string }) => void) {
    // Connect to the web socket to stream updates
    const ws = new WebSocket(hmrLink);

    ws.addEventListener('open', () => {
        console.log('websocket for css HMR is ready!');
        ws.addEventListener('message', ({data}) => {
            cb(JSON.parse(data));
        })
    });

    // We need to explicitly close the websocket, or the server will die.. For some odd reason that node can't handle
    // see: https://github.com/websockets/ws/issues/1256
    window.addEventListener('beforeunload', () => {
        ws.close();
    });
}
