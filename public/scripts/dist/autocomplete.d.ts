declare class Autocomplete {
    private input;
    private suggestions;
    constructor(inputId: string, suggestions: string[]);
    private init;
    private handleInput;
    private renderSuggestions;
}
