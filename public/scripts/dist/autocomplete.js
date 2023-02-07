"use strict";
var Autocomplete = /** @class */ (function () {
    function Autocomplete(inputId, suggestions) {
        this.input = document.getElementById(inputId);
        this.suggestions = suggestions;
        this.init();
    }
    Autocomplete.prototype.init = function () {
        this.input.addEventListener("input", this.handleInput.bind(this));
    };
    Autocomplete.prototype.handleInput = function () {
        var value = this.input.value;
        var filteredSuggestions = this.suggestions.filter(function (suggestion) {
            return suggestion.toLowerCase().startsWith(value.toLowerCase());
        });
        this.renderSuggestions(filteredSuggestions);
    };
    Autocomplete.prototype.renderSuggestions = function (suggestions) {
        // Render suggestions in a dropdown below the input field
    };
    return Autocomplete;
}());
//# sourceMappingURL=autocomplete.js.map