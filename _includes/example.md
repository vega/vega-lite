{% assign id = include.spec | replace:'/', '-' %}

<div class="example">
  <div class="embed">
    <div id="{{id}}" class="view"></div>
  </div>
</div>

<script>
window.onload = function() {
  var spec = {% include_relative specs/{{ include.spec }}.vl.json %};

  embedExample('#{{id}}', spec, false);
}
</script>

<div class="editor-link">
  <a href="https://vega.github.io/editor/#/examples/vega-lite/{{ include.spec }}">View in Online Editor</a>
</div>

### Vega-Lite JSON Specification

{: .example-spec}
```json
{% include_relative specs/{{ include.spec }}.vl.json %}
```
