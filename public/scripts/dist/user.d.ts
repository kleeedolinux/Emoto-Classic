export declare class User {
    name: string;
    recorde: number;
    medalhas: HTMLElement;
    recordeElement: HTMLElement;
    constructor(name: string, recorde: number);
    addMedalha(channel: string): void;
}
