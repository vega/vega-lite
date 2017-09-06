import {text} from 'd3-request';
import {select, selectAll, Selection} from 'd3-selection';
import * as hljs from 'highlight.js';
import embed, {vega} from 'vega-embed';
import {vegaLite} from 'vega-tooltip';
import {runStreamingExample} from './streaming';

window['runStreamingExample'] = runStreamingExample;

declare const BASEURL: string;

function trim(str: string) {
  return str.replace(/^\s+|\s+$/g, '');
}

/* Anchors */
selectAll('h2, h3, h4, h5, h6').each(function(this: Element) {
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

  embed(vis.node(), spec, {
    mode: 'vega-lite',
    renderer: 'svg',
    actions: {
      source: false,
      export: false
    },
    viewConfig: {
      loader: new vega.loader({
        baseURL: BASEURL
      })
    }
  }).then(result => {
    if ($target.classed('tooltip')) {
      vegaLite(result.view, JSON.parse(specText) as any);
    }
  }).catch(console.error);
}

function getSpec(el: Element) {
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

selectAll('.vl-example').each(function(this: Element) {
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
  };
}

if (carousel) {
  const slides = carousel.querySelectorAll('.slide');
  const indicators = carousel.querySelectorAll('.indicator');
  const links = carousel.querySelectorAll('.slide-nav');

  for (let i = 0; i < indicators.length; i++) {
    indicators[i].addEventListener('click', setSlide(slides, indicators, links, i));
  }

  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', setSlide(slides, indicators, links, i));
  }

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
