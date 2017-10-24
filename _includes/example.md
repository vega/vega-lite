<div class="example">
  {% include embed.html spec=include.spec %}
</div>

<div class="editor-link">
  <a href="https://vega.github.io/editor/#/examples/vega-lite/{{ include.spec }}">View in Online Editor</a>
</div>

### Vega-Lite JSON Specification

{: .example-spec}
```json
{% include_relative {{ include.spec }}.vl.json %}
```
