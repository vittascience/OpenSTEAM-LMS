function parseContent(content, className, autoWidth = false) {
    let values = content.match(/\[answer\](.*?)\[\/answer\]/gi).map(match => match.replace(/\[answer\](.*?)\[\/answer\]/gi, "$1"));

    for (let i = 0; i < values.length; i++) {
        if (autoWidth) {    
            autoWidthStyle = 'style="width:' + (values[i].length + 2) + 'ch"';
        } else {
            autoWidthStyle = '';
        }

        content = content.replace(`[answer]${values[i]}[/answer]`, `[answer][/answer]`);
        content = content.replace(/\[answer\]/, `<input readonly class='${className}' value="${values[i]}" ${autoWidthStyle}>`);
        content = content.replace(/\[\/answer\]/, "</input>");
    }
    
    return content;
}