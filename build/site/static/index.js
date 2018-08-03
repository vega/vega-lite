"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var d3_fetch_1 = require("d3-fetch");
var d3_selection_1 = require("d3-selection");
var hljs = tslib_1.__importStar(require("highlight.js"));
var vega = tslib_1.__importStar(require("vega"));
var post_1 = require("vega-embed/build/src/post");
var vega_tooltip_1 = require("vega-tooltip");
var src_1 = require("../../src");
var streaming_1 = require("./streaming");
window['runStreamingExample'] = streaming_1.runStreamingExample;
window['embedExample'] = embedExample;
var loader = vega.loader({
    baseURL: BASEURL
});
var editorURL = 'https://vega.github.io/editor/';
function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}
/* Anchors */
d3_selection_1.selectAll('h2, h3, h4, h5, h6').each(function () {
    var sel = d3_selection_1.select(this);
    var name = sel.attr('id');
    var title = sel.text();
    sel.html('<a href="#' + name + '" class="anchor"><span class="octicon octicon-link"></span></a>' + trim(title));
});
/* Documentation */
function renderExample($target, specText) {
    $target.classed('example', true);
    $target.text('');
    var vis = $target.append('div').attr('class', 'example-vis');
    // Decrease visual noise by removing $schema and description from code examples.
    var textClean = specText.replace(/(\s)+\"(\$schema|description)\": \".*?\",/g, '');
    var code = $target
        .append('pre')
        .attr('class', 'example-code')
        .append('code')
        .attr('class', 'json')
        .text(textClean);
    hljs.highlightBlock(code.node());
    var spec = JSON.parse(specText);
    embedExample(vis.node(), spec, true, !$target.classed('no-tooltip'));
}
function embedExample($target, spec, actions, tooltip) {
    if (actions === void 0) { actions = true; }
    if (tooltip === void 0) { tooltip = true; }
    var vgSpec = src_1.compile(spec).spec;
    var view = new vega.View(vega.parse(vgSpec), { loader: loader }).renderer('svg').initialize($target);
    if (tooltip) {
        var handler = new vega_tooltip_1.Handler().call;
        view.tooltip(handler);
    }
    view.run();
    if (actions) {
        d3_selection_1.select($target)
            .append('div')
            .attr('class', 'vega-actions')
            .append('a')
            .text('Open in Vega Editor')
            .attr('href', '#')
            // tslint:disable-next-line
            .on('click', function () {
            post_1.post(window, editorURL, {
                mode: 'vega-lite',
                spec: JSON.stringify(spec, null, 2),
                config: vgSpec.config,
                renderer: 'svg'
            });
            d3_selection_1.event.preventDefault();
        });
    }
    return view;
}
exports.embedExample = embedExample;
function getSpec(el) {
    var sel = d3_selection_1.select(el);
    var name = sel.attr('data-name');
    if (name) {
        var dir = sel.attr('data-dir');
        var fullUrl = BASEURL + '/examples/specs/' + (dir ? dir + '/' : '') + name + '.vl.json';
        d3_fetch_1.text(fullUrl)
            .then(function (spec) {
            renderExample(sel, spec);
        })
            .catch(console.error);
    }
    else {
        console.error('No "data-name" specified to import examples from');
    }
}
window['changeSpec'] = function (elId, newSpec) {
    var el = document.getElementById(elId);
    d3_selection_1.select(el).attr('data-name', newSpec);
    getSpec(el);
};
window['buildSpecOpts'] = function (id, baseName) {
    var oldName = d3_selection_1.select('#' + id).attr('data-name');
    var prefixSel = d3_selection_1.select('select[name=' + id + ']');
    var inputsSel = d3_selection_1.selectAll('input[name=' + id + ']:checked');
    var prefix = prefixSel.empty() ? id : prefixSel.property('value');
    var values = inputsSel
        .nodes()
        .map(function (n) { return n.value; })
        .sort()
        .join('_');
    var newName = baseName + prefix + (values ? '_' + values : '');
    if (oldName !== newName) {
        window['changeSpec'](id, newName);
    }
};
d3_selection_1.selectAll('.vl-example').each(function () {
    getSpec(this);
});
// caroussel for the front page
// adapted from https://codepen.io/LANparty/pen/wePYXb
var carousel = document.getElementById('carousel');
function carouselHide(slides, indicators, links, active) {
    indicators[active].setAttribute('data-state', '');
    links[active].setAttribute('data-state', '');
    slides[active].setAttribute('data-state', '');
    slides[active].style.display = 'none';
    var video = slides[active].querySelector('video');
    if (video) {
        video.pause();
    }
}
function carouselShow(slides, indicators, links, active) {
    indicators[active].checked = true;
    indicators[active].setAttribute('data-state', 'active');
    links[active].setAttribute('data-state', 'active');
    slides[active].setAttribute('data-state', 'active');
    var video = slides[active].querySelector('video');
    if (video) {
        video.currentTime = 0;
        slides[active].style.display = 'block';
        video.play();
    }
    else {
        slides[active].style.display = 'block';
    }
}
function setSlide(slides, indicators, links, active) {
    return function () {
        // Reset all slides
        for (var i = 0; i < indicators.length; i++) {
            indicators[i].setAttribute('data-state', '');
            slides[i].setAttribute('data-state', '');
            carouselHide(slides, indicators, links, i);
        }
        // Set defined slide as active
        indicators[active].setAttribute('data-state', 'active');
        slides[active].setAttribute('data-state', 'active');
        carouselShow(slides, indicators, links, active);
        // Switch button text
        var numSlides = carousel.querySelectorAll('.indicator').length;
        if (numSlides === active + 1) {
            carousel.querySelector('.next-slide').textContent = 'Start over';
        }
        else {
            carousel.querySelector('.next-slide').textContent = 'Next step';
        }
    };
}
if (carousel) {
    var slides_1 = carousel.querySelectorAll('.slide');
    var indicators_1 = carousel.querySelectorAll('.indicator');
    var links_1 = carousel.querySelectorAll('.slide-nav');
    // tslint:disable-next-line:prefer-for-of
    for (var i = 0; i < indicators_1.length; i++) {
        indicators_1[i].addEventListener('click', setSlide(slides_1, indicators_1, links_1, +indicators_1[i].getAttribute('data-slide')));
    }
    // tslint:disable-next-line:prefer-for-of
    for (var i = 0; i < links_1.length; i++) {
        links_1[i].addEventListener('click', setSlide(slides_1, indicators_1, links_1, +links_1[i].getAttribute('data-slide')));
    }
    carousel.querySelector('.next-slide').addEventListener('click', function () {
        var slide = +carousel.querySelector('.indicator[data-state=active]').getAttribute('data-slide');
        var numSlides = carousel.querySelectorAll('.indicator').length;
        setSlide(slides_1, indicators_1, links_1, (slide + 1) % numSlides)();
    });
    [].forEach.call(slides_1, function (slide) {
        var video = slide.querySelector('video');
        if (video) {
            video.addEventListener('mouseover', function () {
                slide.querySelector('.example-vis').style.visibility = 'visible';
                video.style.display = 'none';
                video.pause();
            });
        }
    });
}
//# sourceMappingURL=index.js.map