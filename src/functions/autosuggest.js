import React from 'react'
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';


//import SearchBar from 'material-ui-search-bar'





export function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;

    return (
        <TextField
            fullWidth
            InputProps={{
                inputRef: ref,
                ...InputProps,
            }}
            {...other}
        />
    );
}

export function renderSuggestion(suggestion, { query }) {
    const matches = match(suggestion.label, query);
    const parts = parse(suggestion.label, matches);

    return (
        <MenuItem  component="div">
            <div>
                {parts.map((part, index) => {
                    return (
                            <strong key={String(index)} style={{ fontWeight: 500 }}>
                                {part.text}
                            </strong>
                    );
                })}
            </div>
        </MenuItem>
    );
}

export function renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
        <Paper {...containerProps} square>
            {children}
        </Paper>
    );
}

export function getSuggestions(suggestions, value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
        ? []
        : suggestions.filter(suggestion => {
            const keep =
                count < 5 && suggestion.label.toLowerCase().includes(inputValue);

            if (keep) {
                count += 1;
            }

            return keep;
        });
}
