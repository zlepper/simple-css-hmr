import * as commandLineArgs from 'command-line-args';
const optionDefinitions: commandLineArgs.OptionDefinition[] = [
    {name: 'files', alias: 'f', type: String, description: 'The file or directory to watch', multiple: true, defaultOption: true},
    {name: 'push', type: Boolean, description: 'Push file content to websocket', defaultValue: false},
    {name: 'port', type: Number, description: 'The port to host the websocket on', defaultValue: 8796},
];

const result = commandLineArgs(optionDefinitions);

export interface IOptions {
    /**
     * The port to run the simple-css-hmr server on
     */
    port: number;
    /**
     * Any files or folders to watch
     */
    files: string[];
    /**
     * If the server should actively push the new css content to the client
     * or if the client should fetch it themselves. The default client will dynamically
     * handle this without any additional configuration required.
     */
    push: boolean;
}

export function getFlags(): IOptions {
    validate(result);
    return result;
}

function validate(options: IOptions) {
    if(options.files.length === 0) {
        throw new Error('No files specified for watching');
    }
}