import {Client, Collection, Message, PartialMessage} from "discord.js";

export class DiscordClient extends Client {

}

export class Command {
    public args: Array<string>;
    public prefix: string;
    public message: Message | PartialMessage;
    public type: 'NO_ARG' | 'ONE_ARG' | 'ARGS';

    constructor();
    run(message: Message | PartialMessage);
    parseCommand();
    valid(): boolean;
    execute();
}

export class AppProvider {
    public commands: Array<Command>;

    constructor();

    boot();
}

export class BdoProvider extends AppProvider {

}

export class Character {
    public static getCharacterByName(name): Object;
}