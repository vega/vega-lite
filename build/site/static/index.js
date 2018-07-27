import { text } from 'd3-fetch';
import { event, select, selectAll } from 'd3-selection';
import * as hljs from 'highlight.js';
import * as vega from 'vega';
import { post } from 'vega-embed/build/src/post';
import { Handler } from 'vega-tooltip';
import { compile } from '../../src';
import { runStreamingExample } from './streaming';
window['runStreamingExample'] = runStreamingExample;
window['embedExample'] = embedExample;
var loader = vega.loader({
    baseURL: BASEURL
});
var editorURL = 'https://vega.github.io/editor/';
function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}
/* Anchors */
selectAll('h2, h3, h4, h5, h6').each(function () {
    var sel = select(this);
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
export function embedExample($target, spec, actions, tooltip) {
    if (actions === void 0) { actions = true; }
    if (tooltip === void 0) { tooltip = true; }
    var vgSpec = compile(spec).spec;
    var view = new vega.View(vega.parse(vgSpec), { loader: loader }).renderer('svg').initialize($target);
    if (tooltip) {
        var handler = new Handler().call;
        view.tooltip(handler);
    }
    view.run();
    if (actions) {
        select($target)
            .append('div')
            .attr('class', 'vega-actions')
            .append('a')
            .text('Open in Vega Editor')
            .attr('href', '#')
            // tslint:disable-next-line
            .on('click', function () {
            post(window, editorURL, {
                mode: 'vega-lite',
                spec: JSON.stringify(spec, null, 2),
                config: vgSpec.config,
                renderer: 'svg'
            });
            event.preventDefault();
        });
    }
    return view;
}
function getSpec(el) {
    var sel = select(el);
    var name = sel.attr('data-name');
    if (name) {
        var dir = sel.attr('data-dir');
        var fullUrl = BASEURL + '/examples/specs/' + (dir ? dir + '/' : '') + name + '.vl.json';
        text(fullUrl)
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
    select(el).attr('data-name', newSpec);
    getSpec(el);
};
window['buildSpecOpts'] = function (id, baseName) {
    var oldName = select('#' + id).attr('data-name');
    var prefixSel = select('select[name=' + id + ']');
    var inputsSel = selectAll('input[name=' + id + ']:checked');
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
selectAll('.vl-example').each(function () {
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