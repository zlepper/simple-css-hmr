import {getFlags} from "./flags";
import {startServer} from './server';

export function run() {
    const options = getFlags();

    startServer(options);
}

