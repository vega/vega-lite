import * as d3 from 'd3';
import {select, selectAll, Selection} from 'd3-selection';
import hljs_ from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import compactStringify from 'json-stringify-pretty-compact';
import * as vega from 'vega';
import {Handler} from 'vega-tooltip';
import {compile, TopLevelSpec} from '../../src/index.js';
import {post} from './post.js';
import {runStreamingExample} from './streaming.js';

// to work around weird type issue
const hljs = hljs_ as any;

(window as any)['runStreamingExample'] = runStreamingExample;
(window as any)['embedExample'] = embedExample;

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('diff', diff);

// highlight jekyll code blocks
hljs.highlightAll();

declare const BASEURL: string;

const loader = vega.loader({
  baseURL: BASEURL,
});

const editorURL = 'https://vega.github.io/editor/';
const MIDDLE_MOUSE_CLICK = 1;

/* Anchors */
selectAll('h2, h3, h4, h5, h6').each(function (this: d3.BaseType) {
  const sel = select(this);
  const name = sel.attr('id');
  const title = sel.html();
  sel.html(`<a href="#${name}" class="anchor"><span class="octicon octicon-link"></span></a>${title.trim()}`);
});

/* Documentation */
function renderExample($target: Selection<any, any, any, any>, specText: string, figureOnly: boolean) {
  $target.classed('example', true).text('');

  const vis = $target.append('div').attr('class', 'example-vis');

  // Decrease visual noise by removing $schema and description from code examples.
  const textClean = specText.replace(/(\s)+"(\$schema|description)": ".*?",/g, '');

  if (!figureOnly) {
    const code = $target
      .append('pre')
      .attr('class', 'example-code')
      .append('code')
      .attr('class', 'json')
      .text(textClean);
    hljs.highlightElement(code.node());
  }

  const spec = JSON.parse(specText);

  embedExample(vis.node(), spec, true, !$target.classed('no-tooltip'));
}

export function embedExample($target: any, spec: TopLevelSpec, actions = true, tooltip = true) {
  const {spec: vgSpec} = compile(spec);

  const view = new vega.View(vega.parse(vgSpec), {loader: loader}).renderer('svg').initialize($target);

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
      .on('click mouseup', (event) => {
        // Check if it's a regular left click or middle mouse click
        if (event.type === 'click' || (event.type === 'mouseup' && event.button === MIDDLE_MOUSE_CLICK)) {
          post(window, editorURL, {
            mode: 'vega-lite',
            spec: compactStringify(spec),
            config: vgSpec.config,
            renderer: 'svg',
          });
        }
        // remove as any when d3 typings are updated
        event.preventDefault();
      });
  }

  return view;
}

async function getSpec(el: d3.BaseType) {
  const sel = select(el);
  const name = sel.attr('data-name');
  const figureOnly = !!sel.attr('figure-only');
  if (name) {
    const dir = sel.attr('data-dir');
    const fullUrl = `${BASEURL}/examples/${dir ? `${dir}/` : ''}${name}.vl.json`;

    try {
      const spec = await (await fetch(fullUrl)).text();
      renderExample(sel, spec, figureOnly);
    } catch (e) {
      sel
        .html(
          `Could not load spec: ${e}. Please report this issue on <a href="https://github.com/vega/vega-lite/issues/new/choose">GitHub</a>.`,
        )
        .classed('error', true);
      console.error(e);
    }
  } else {
    console.error('No "data-name" specified to import examples from');
  }
}

(window as any)['changeSpec'] = async (elId: string, newSpec: string) => {
  const el = document.getElementById(elId);
  select(el).attr('data-name', newSpec);
  await getSpec(el);
};

(window as any)['buildSpecOpts'] = (id: string, baseName: string) => {
  const oldName = select(`#${id}`).attr('data-name');
  const prefixSel = select(`select[name=${id}]`);
  const inputsSel = selectAll(`input[name=${id}]:checked`);
  const prefix = prefixSel.empty() ? id : prefixSel.property('value');
  const values = inputsSel
    .nodes()
    .map((n: any) => n.value)
    .sort()
    .join('_');
  const newName = baseName + prefix + (values ? `_${values}` : '');
  if (oldName !== newName) {
    (window as any)['changeSpec'](id, newName);
  }
};

selectAll('.vl-example').each(async function (this: d3.BaseType) {
  await getSpec(this);
});

// caroussel for the front page
// adapted from https://codepen.io/LANparty/pen/wePYXb

const carousel = document.getElementById('carousel');

function carouselHide(slides: NodeListOf<any>, indicators: NodeListOf<any>, links: NodeListOf<any>, active: number) {
  indicators[active].setAttribute('data-state', '');
  links[active].setAttribute('data-state', '');
  slides[active].setAttribute('data-state', '');
  slides[active].style.display = 'none';

  const video = slides[active].querySelector('video');
  if (video) {
    video.pause();
  }
}

function carouselShow(slides: NodeListOf<any>, indicators: NodeListOf<any>, links: NodeListOf<any>, active: number) {
  indicators[active].checked = true;
  indicators[active].setAttribute('data-state', 'active');
  links[active].setAttribute('data-state', 'active');
  slides[active].setAttribute('data-state', 'active');

  const video = slides[active].querySelector('video');
  if (video) {
    video.currentTime = 0;
    slides[active].style.display = 'block';
    video.play();
  } else {
    slides[active].style.display = 'block';
  }
}

function setSlide(
  slides: NodeListOf<Element>,
  indicators: NodeListOf<Element>,
  links: NodeListOf<any>,
  active: number,
) {
  return () => {
    // Reset all slides
    for (const [i, indicator] of indicators.entries()) {
      indicator.setAttribute('data-state', '');
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
    } else {
      carousel.querySelector('.next-slide').textContent = 'Next step';
    }
  };
}

if (carousel) {
  const slides = carousel.querySelectorAll('.slide');
  const indicators = carousel.querySelectorAll('.indicator');
  const links = carousel.querySelectorAll('.slide-nav');

  for (const indicator of indicators) {
    indicator.addEventListener('click', setSlide(slides, indicators, links, +indicator.getAttribute('data-slide')));
  }

  for (const link of links) {
    link.addEventListener('click', setSlide(slides, indicators, links, +link.getAttribute('data-slide')));
  }

  carousel.querySelector('.next-slide').addEventListener('click', () => {
    const slide = +carousel.querySelector('.indicator[data-state=active]').getAttribute('data-slide');
    const numSlides = carousel.querySelectorAll('.indicator').length;
    setSlide(slides, indicators, links, (slide + 1) % numSlides)();
  });

  [].forEach.call(slides, (slide: Element) => {
    const video = slide.querySelector('video');
    if (video) {
      video.addEventListener('pointerover', () => {
        slide.querySelector<HTMLElement>('.example-vis').style.visibility = 'visible';
        video.style.display = 'none';
        video.pause();
      });
    }
  });
}
