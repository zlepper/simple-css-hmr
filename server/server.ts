import {Observable} from "rxjs/Observable";
import {watch} from "chokidar";
import {Server, OPEN} from "ws";
import {of} from "rxjs/observable/of";
import {merge} from "rxjs/observable/merge";
import {readFile} from "fs";
import {IOptions} from "./flags";
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'

function setupWatchers(options: IOptions): Observable<string> {
    const watchers: Observable<string>[] = options.files.map(filename => {
        return new Observable(observer => {
            watch(filename).on('change', (name) => {
                observer.next(name);
            });
        });
    });

    return merge(...watchers)
        .map(name => name.replace('\\', '/'));
}

function readFileToObs(filename: string) {
    return new Observable(observer => {
        readFile(filename, {encoding: 'utf8'}, (err, data) => {
            if(err) {
                observer.error(err);
            } else {
                observer.next(data);
                observer.complete();
            }
        });
    });
}

function broadcast(server: Server, msg: string) {
    server.clients
        .forEach(client => {
            if(client.readyState === OPEN) {
                client.send(msg);
            }
        })
}

/**
 * Starts a new simple-css-hmr websocket server
 * @param {IOptions} options
 */
export function startServer(options: IOptions) {
    const server = new Server({
        port: options.port,
    });

    server.on('error', (err) => {
        console.error(err);
    });

    setupWatchers(options)
        // We only care about changes to css files
        .filter(name => /\.css$/.test(name))
        .switchMap(name => {
            if(options.push) {
                return readFileToObs(name)
                    .map(content => ({name, content}));
            } else {
                return of({name});
            }
        })
        .subscribe((result) => {
            broadcast(server, JSON.stringify(result));
        });

    console.log(`simple-css-hmr server is now available at ws://localhost:` + options.port);
}


