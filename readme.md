# Simple css hmr
Simple css hmr provides a simple way of automatically refreshing css in the 
browser, whenever the source file changes. This can be extremely useful with 
homegrown frameworks that doesn't support webpack hmr. Pages that uses these 
frameworks can often take a while to instantiate. Or it might be useful simply 
because the part of the page that is currently being designed takes a while to
open due to some complex state that needs to be created, say a very dynamic 
editor. 

## Configure the client
To use simple css hmr a couple of small changes are needed in the client. 

First, you need to either add `dist/main.js` to the page, or include it
using a bundler like webpack. If you are using a module system like amd, 
commonjs or es6 modules, then the library also supports imports these ways. 
Simple import the dist file. 

Once that is done, a single method call to setupCssHmr is all that is needed:
```js
setupCssHmr({
    hmrLink: 'ws://localhost:8796',
    cssLinkTagSelector: '#replaceable-css-link'
});
```
`hmrLink` is the websocket link to the server, see 'Configure the server'.  
`cssLinkTagSelector` is a selector to get  link that currently loads the 
css file. [see example](example/index.html). 

## Configure the server
The server can be configured in two ways, either using the command line 
interface or programmatically. 

### Via cli
To setup the server using the cli, do `simple-css-hmr <filename>` where 
`<filename>` is the name of the build css file that should be watched. 
e.g. `simple-css-hmr example/text.css`.  
If your css file name changes after each build, (e.g. webpack file hashes)
then you can also watch the entire folder by only passing in the folder name
instead of the entire file path. e.g. `simple-css-hmr example`. 

### Programmatically
To activate the server programmatically, maybe as a part of your webpack 
setup, do the following:
```js
var startServer = require('simple-css-hmr/server/server').startServer;

startServer(options);
```
the options object has the following properites:


