class Autocomplete {
	private input: HTMLInputElement;
	private suggestions: string[];

	constructor(inputId: string, suggestions: string[]) {
		this.input = document.getElementById(inputId) as HTMLInputElement;
		this.suggestions = suggestions;
		this.init();
	}

	private init() {
		this.input.addEventListener("input", this.handleInput.bind(this));
	}

	private handleInput() {
		const value = this.input.value;
		const filteredSuggestions = this.suggestions.filter((suggestion) =>
			suggestion.toLowerCase().startsWith(value.toLowerCase())
		);
		this.renderSuggestions(filteredSuggestions);
	}

	private renderSuggestions(suggestions: string[]) {
		// Render suggestions in a dropdown below the input field
	}
}


