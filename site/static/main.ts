import {text} from 'd3-request';
import {event, select, selectAll, Selection} from 'd3-selection';
import * as hljs from 'highlight.js';
import * as vega from 'vega';
import {post} from 'vega-embed/build/post';
import {vegaLite} from 'vega-tooltip';

import {compile} from '../../src';
import {TopLevelExtendedSpec} from '../../src/spec';
import {runStreamingExample} from './streaming';

window['runStreamingExample'] = runStreamingExample;
window['embedExample'] = embedExample;

declare const BASEURL: string;

const loader = vega.loader({
  baseURL: BASEURL
});

const editorURL = 'https://vega.github.io/editor/';

function trim(str: string) {
  return str.replace(/^\s+|\s+$/g, '');
}

/* Anchors */
selectAll('h2, h3, h4, h5, h6').each(function(this: d3.BaseType) {
  const sel = select(this);
  const name = sel.attr('id');
  const title = sel.text();
  sel.html('<a href="#' + name + '" class="anchor"><span class="octicon octicon-link"></span></a>' + trim(title));
});

/* Documentation */
function renderExample($target: Selection<any, any, any, any>, specText: string) {
  $target.classed('example', true);
  $target.text('');

  const vis = $target.append('div').attr('class', 'example-vis');

  // Decrease visual noise by removing $schema and description from code examples.
  const textClean = specText.replace(/(\s)+\"(\$schema|description)\": \".*?\",/g, '');
  const code = $target.append('pre').attr('class', 'example-code')
  .append('code').attr('class', 'json').text(textClean);
  hljs.highlightBlock(code.node() as any);

  const spec = JSON.parse(specText);

  embedExample(vis.node(), spec, true, $target.classed('tooltip'));
}

function embedExample($target: any, spec: TopLevelExtendedSpec, actions=true, tooltip=false) {
  const vgSpec = compile(spec).spec;
  const view = new vega.View(vega.parse(vgSpec), {loader: loader})
    .renderer('svg')
    .initialize($target)
    .run();

  const div = select($target)
    .append('div')
    .attr('class', 'vega-actions')
    .append('a')
    .text('Open in Vega Editor')
    .attr('href', '#')
    .on('click', function () {
      post(window, editorURL, {
        mode: 'vega-lite',
        spec: JSON.stringify(spec, null, 2),
    });
    event.preventDefault();
  });

  if (tooltip) {
    vegaLite(view, spec);
  }
}

function getSpec(el: d3.BaseType) {
  const sel = select(el);
  const name = sel.attr('data-name');
  if (name) {
    const dir = sel.attr('data-dir');
    const fullUrl = BASEURL + '/examples/specs/' + (dir ? (dir + '/') : '') + name + '.vl.json';

    text(fullUrl, function(error, spec) {
      if (error) {
        console.error(error);
      } else {
        renderExample(sel, spec);
      }
    });
  } else {
    console.error('No "data-name" specified to import examples from');
  }
}

window['changeSpec'] = function(elId: string, newSpec: string) {
  const el = document.getElementById(elId);
  select(el).attr('data-name', newSpec);
  getSpec(el);
};

window['buildSpecOpts'] = function(id: string, baseName: string) {
  const oldName = select('#' + id).attr('data-name');
  const prefixSel = select('select[name=' + id + ']');
  const inputsSel = selectAll('input[name=' + id + ']:checked');
  const prefix = prefixSel.empty() ? id : prefixSel.property('value');
  const values = inputsSel.nodes().map((n: any) => n.value).sort().join('_');
  const newName = baseName + prefix + (values ? '_' + values : '');
  if (oldName !== newName) {
    window['changeSpec'](id, newName);
  }
};

selectAll('.vl-example').each(function(this: d3.BaseType) {
  getSpec(this);
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

function setSlide(slides: NodeListOf<Element>, indicators: NodeListOf<Element>, links: NodeListOf<any>, active: number) {
  return function() {
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
    } else {
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

  [].forEach.call(slides, (slide: Element) => {
    const video = slide.querySelector('video');
    if (video) {
      video.addEventListener('mouseover', () => {
        (slide.querySelector('.example-vis') as any).style.visibility = 'visible';
        video.style.display = 'none';
        video.pause();
      });
    }
  });
}
