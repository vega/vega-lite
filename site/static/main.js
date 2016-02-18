function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}
d3.selectAll('h2, h3, h4, h5, h6').each(function () {
    var sel = d3.select(this);
    var link = sel.select('a');
    var name = sel.attr('id');
    var title = sel.text();
    sel.html('<a href="#' + name + '" class="anchor"><span class="octicon octicon-link"></span></a>' + trim(title));
});
function renderExample($target, text) {
    $target.classed('example', true);
    $target.classed('side', true);
    $target.text('');
    var code = $target.insert('pre', 'div.example-vis').attr('class', 'example-code')
        .append('code').attr('class', 'json').text(text);
    hljs.highlightBlock(code.node());
    var vis = $target.select('div.example-vis');
    if (vis.empty()) {
        vis = $target.append('div').attr('class', 'example-vis');
    }
    var spec = JSON.parse(text);
    if (spec.data.url) {
        spec.data.url = BASEURL + '/' + spec.data.url;
    }
    vg.embed(vis.node(), {
        mode: 'vega-lite',
        spec: spec,
        renderer: 'svg',
        actions: {
            source: false,
            export: false
        }
    });
}
d3.selectAll('.vl-example').each(function () {
    var sel = d3.select(this);
    var name = sel.attr('data-name');
    if (name) {
        var dir = sel.attr('data-dir');
        var fullUrl = BASEURL + '/examples/specs/' + (dir ? (dir + '/') : '') + name + '.json';
        d3.text(fullUrl, function (error, spec) {
            if (error) {
                console.error(error);
            }
            else {
                renderExample(sel, spec);
            }
        });
    }
    else {
        var spec = trim(sel.text());
        renderExample(sel, spec);
    }
});
//# sourceMappingURL=main.js.map