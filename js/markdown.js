var markdown = {
  compile: function(code) {
    var marked = require('marked');
    marked.setOptions({
      highlight: function(code) {
        return require('highlight.js').highlightAuto(code).value;
      }
    });
    compiled = marked(code);

    function replacer(match, tags, offset, string) {
      rtn = "<div>"
      tags = tags.split(",");
      for (var i = 0; i < tags.length; i++) {
        var choices = ["btn-default", "btn-primary", "btn-positive", "btn-negative", "btn-warning"]
        var num = Math.abs(utility.hashString(tags[i])) % choices.length
        var choice = choices[num]
        rtn = rtn + (["<span class='btn ", choice, "' style='margin:0.2em'>", tags[i], "</span>"].join(""));
      }
      rtn += "</div>"
      return rtn;
    }
    compiled = compiled.replace(/tag:([a-z\,-]+)/g, replacer);
    return compiled;
  }
}