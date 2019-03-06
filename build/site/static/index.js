// @ts-ignore
import hljs from 'highlight.js/lib/highlight';
// @ts-ignore
import css from 'highlight.js/lib/languages/css';
// @ts-ignore
import diff from 'highlight.js/lib/languages/diff';
// @ts-ignore
import javascript from 'highlight.js/lib/languages/javascript';
// @ts-ignore
import json from 'highlight.js/lib/languages/json';
// @ts-ignore
import xml from 'highlight.js/lib/languages/xml';
import { event, select, selectAll } from 'd3-selection';
import compactStringify from 'json-stringify-pretty-compact';
import * as vega from 'vega';
import { Handler } from 'vega-tooltip';
import { compile } from '../../src';
import { post } from './post';
import { runStreamingExample } from './streaming';
window['runStreamingExample'] = runStreamingExample;
window['embedExample'] = embedExample;
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('diff', diff);
// highlight jekyll code blocks
hljs.initHighlightingOnLoad();
const loader = vega.loader({
    baseURL: BASEURL
});
const editorURL = 'https://vega.github.io/editor/';
function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}
/* Anchors */
selectAll('h2, h3, h4, h5, h6').each(function () {
    const sel = select(this);
    const name = sel.attr('id');
    const title = sel.text();
    sel.html('<a href="#' + name + '" class="anchor"><span class="octicon octicon-link"></span></a>' + trim(title));
});
/* Documentation */
function renderExample($target, specText) {
    $target.classed('example', true);
    $target.text('');
    const vis = $target.append('div').attr('class', 'example-vis');
    // Decrease visual noise by removing $schema and description from code examples.
    const textClean = specText.replace(/(\s)+\"(\$schema|description)\": \".*?\",/g, '');
    const code = $target
        .append('pre')
        .attr('class', 'example-code')
        .append('code')
        .attr('class', 'json')
        .text(textClean);
    hljs.highlightBlock(code.node());
    const spec = JSON.parse(specText);
    embedExample(vis.node(), spec, true, !$target.classed('no-tooltip'));
}
export function embedExample($target, spec, actions = true, tooltip = true) {
    const vgSpec = compile(spec).spec;
    const view = new vega.View(vega.parse(vgSpec), { loader: loader }).renderer('svg').initialize($target);
    if (tooltip) {
        const handler = new Handler().call;
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
                spec: compactStringify(spec),
                config: vgSpec.config,
                renderer: 'svg'
            });
            event.preventDefault();
        });
    }
    return view;
}
function getSpec(el) {
    const sel = select(el);
    const name = sel.attr('data-name');
    if (name) {
        const dir = sel.attr('data-dir');
        const fullUrl = BASEURL + '/examples/specs/' + (dir ? dir + '/' : '') + name + '.vl.json';
        fetch(fullUrl)
            .then(response => {
            response
                .text()
                .then(spec => {
                renderExample(sel, spec);
            })
                .catch(console.error);
        })
            .catch(console.error);
    }
    else {
        console.error('No "data-name" specified to import examples from');
    }
}
window['changeSpec'] = (elId, newSpec) => {
    const el = document.getElementById(elId);
    select(el).attr('data-name', newSpec);
    getSpec(el);
};
window['buildSpecOpts'] = (id, baseName) => {
    const oldName = select('#' + id).attr('data-name');
    const prefixSel = select('select[name=' + id + ']');
    const inputsSel = selectAll('input[name=' + id + ']:checked');
    const prefix = prefixSel.empty() ? id : prefixSel.property('value');
    const values = inputsSel
        .nodes()
        .map((n) => n.value)
        .sort()
        .join('_');
    const newName = baseName + prefix + (values ? '_' + values : '');
    if (oldName !== newName) {
        window['changeSpec'](id, newName);
    }
};
selectAll('.vl-example').each(function () {
    getSpec(this);
});
// caroussel for the front page
// adapted from https://codepen.io/LANparty/pen/wePYXb
const carousel = document.getElementById('carousel');
function carouselHide(slides, indicators, links, active) {
    indicators[active].setAttribute('data-state', '');
    links[active].setAttribute('data-state', '');
    slides[active].setAttribute('data-state', '');
    slides[active].style.display = 'none';
    const video = slides[active].querySelector('video');
    if (video) {
        video.pause();
    }
}
function carouselShow(slides, indicators, links, active) {
    indicators[active].checked = true;
    indicators[active].setAttribute('data-state', 'active');
    links[active].setAttribute('data-state', 'active');
    slides[active].setAttribute('data-state', 'active');
    const video = slides[active].querySelector('video');
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
    return () => {
        // Reset all slides
        for (let i = 0; i < indicators.length; i++) {
            indicators[i].setAttribute('data-state', '');
            slides[i].setAttribute('data-state', '');
            carouselHide(slides, indicators, links, i);
        }
        // Set defined slide as active
        indicators[active].setAttribute('data-state', 'active');
        slides[active].setAttribute('data-state', 'active');
        carouselShow(slides, indicators, links, active);
        // Switch button text
        const numSlides = carousel.querySelectorAll('.indicator').length;
        if (numSlides === active + 1) {
            carousel.querySelector('.next-slide').textContent = 'Start over';
        }
        else {
            carousel.querySelector('.next-slide').textContent = 'Next step';
        }
    };
}
if (carousel) {
    const slides = carousel.querySelectorAll('.slide');
    const indicators = carousel.querySelectorAll('.indicator');
    const links = carousel.querySelectorAll('.slide-nav');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < indicators.length; i++) {
        indicators[i].addEventListener('click', setSlide(slides, indicators, links, +indicators[i].getAttribute('data-slide')));
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', setSlide(slides, indicators, links, +links[i].getAttribute('data-slide')));
    }
    carousel.querySelector('.next-slide').addEventListener('click', () => {
        const slide = +carousel.querySelector('.indicator[data-state=active]').getAttribute('data-slide');
        const numSlides = carousel.querySelectorAll('.indicator').length;
        setSlide(slides, indicators, links, (slide + 1) % numSlides)();
    });
    [].forEach.call(slides, (slide) => {
        const video = slide.querySelector('video');
        if (video) {
            video.addEventListener('mouseover', () => {
                slide.querySelector('.example-vis').style.visibility = 'visible';
                video.style.display = 'none';
                video.pause();
            });
        }
    });
}
//# sourceMappingURL=index.js.map