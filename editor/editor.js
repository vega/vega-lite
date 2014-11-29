var datasets = [
  "-",
  "data/barley.json",
  "data/cars.json",
  "data/crimea.json",
  "data/driving.json",
  "data/iris.json",
  "data/jobs.json",
  "data/population.json",
  "data/movies.json",
  "data/birdstrikes.json"
];

function load(url, callback) {
  self.dataUrl = url;
  d3.json(url, function(err, data) {
    var schema = {};
    for (var k in data[0]) {
      //TODO(kanitw): better type inference here
      schema[k] = (typeof data[0][k] === "number") ? vl.dataTypes.Q : vl.dataTypes.O;
    }
    run(data, schema);

    if(callback) callback();
  });
}

// ------


function getParams() {
  var params = location.search.slice(1);

  // remove trailing slash that chrome adds automatically
  if(params[params.length-1] == "/") params = params.substring(0, params.length-1);

  return params.split("&")
    .map(function(x) { return x.split("="); })
    .reduce(function(a, b) {
      a[b[0]] = b[1]; return a;
    }, {});
};

function init() {
  var params = getParams();

  var root = d3.select("#ctrl");

  var main = root.append("div").attr("class","main");
  var code = root.append("div").attr("class", "main")
    .style("display","block");
  var config = root.append("div").attr("class","main")
    .style("display","none");


  // data set selector
  var dsel = main.append("div").attr("class","dsel");
  dsel.append("span").attr("class","label").text("data");
  dsel.append("select")
    .attr("class", "data")
    .on("change", function() {
        var url = this.options[this.selectedIndex].value;
        load(url);
      })
    .selectAll("option")
      .data(datasets)
    .enter().append("option")
      .attr("value", function(d) { return d; })
      .attr("selected", function(d){
        return d==params.data ? true : undefined;
      })
      .text(function(d) { return d; });

  // choose mark type
  var mark = main.append("div").attr("class", "mark");
  mark.append("span").attr("class","label").text("mark");
  mark.append("select")
    .attr("class", "mark")
    .on("change", update)
    .selectAll("option")
      .data(["point", "bar", "line", "area", "circle", "square", "text"])
    .enter().append("option")
      .attr("value", function(d) { return d; })
      .text(function(d) { return d; });

  // header labels
  var head = main.append("div").selectAll("span.header")
      .data(["","function","data","type"])
    .enter().append("span")
      .attr("class", function(d,i) { return "header label h"+i; })
      .text(function(d) { return d; });

  // controls for each visual encoding variable
  var ctrl = main.selectAll("div.enc")
      .data(["x","y","row","col","size","color","alpha","shape","text"])
    .enter().append("div").attr("class", "enc");

  ctrl.append("span").attr("class","label").text(function(d) { return d; });

  // aggregation function
  ctrl.append("select")
    .attr("class", "aggr")
    .on("change", update)
    .selectAll("option")
      .data(["-", "avg", "sum", "min", "max", "count", "bin"])
    .enter().append("option")
      .attr("value", function(d) { return d; })
      .text(function(d) { return d; });

  // data variable
  ctrl.append("select")
    .attr("class", "shelf")
    .on("change", update)
    .selectAll("option")
      .data(["-"], function(d) { return d; })
    .enter().append("option")
      .attr("value", function(d) { return d; })
      .text(function(d) { return d; });

  // data type (ordinal, quantitative or time)
  ctrl.append("select")
    .attr("class", "type")
    .on("change", update)
    .selectAll("option")
      .data(["-", "O", "Q", "T"])
    .enter().append("option")
      .attr("value", function(d) { return d; })
      .text(function(d) { return d; });

  // swap btn
  ctrl.selectAll(function(d){ return d==="x" ? [this] : []; })
    .append("a").attr({"class":"action", "href":"#"}).text("swap")
    .on('click', swapXY);

  // Toggle Inspect / Config Form
  var toggles = main.append("div").attr("class","toggles");

  var showDiv = toggles.append("div").attr("class","show");
  showDiv.append("span").attr("class","label").text("show");

  var codeToggle = showDiv.append("label");
  codeToggle.append("input").attr("type", "checkbox").attr("checked", true)
    .on("change", function(){
      code.style("display", this.checked ? "block" : "none");
    });
  codeToggle.append("span").text("code");

  showDiv.append("span").text(" (")
  var inclData = showDiv.append("label");
  inclData.append("input").attr({"type": "checkbox", "id":"inclData", "checked": true})
    .on("change", update);
  inclData.append("span").text("include data");
  showDiv.append("span").text(") ").style("margin-right","12px");

  var configToggle = showDiv.append("label");
  configToggle.append("input").attr("type", "checkbox")
    .on("change", function(){
      config.style("display", this.checked ? "block" : "none");
    });
  configToggle.append("span").text("config");


  // Code Pane
  code.append("span").text("Shorthand");
  code.append("div")
    .append("input").attr({"class": "shorthand", "type": "text", "readonly": "true"});

  code.append("span").text("Vegalite");
  code.append("a").attr({"class": "right action", "href":"#"}).text("load")
    .on("click", function (){
      var s = d3.select("textarea.vlcode").node().value,
        json = JSON.parse(s);
      e = vl.Encoding.parseJSON(json);
      loadEncoding(e, update);
    })
  var vlTextarea = code.append("textarea").attr("class", "vlcode");

  code.append("span").text("Vega")
  var vgTextarea = code.append("textarea").attr("class", "vgcode");

  // Config Pane
  config.append("input").attr("type","button").attr("value","Update Config")
    .on("click", update);

  var configs = config.selectAll("div")
    .data(vl.keys(vl.DEFAULTS))
    .enter().append("div").attr("class", "cfg")
      .append("label");

  configs.append("span").attr("class","label").text(function(d){return d;});
  configs.append("input")
    .attr("placeholder", function(d){return vl.DEFAULTS[d];});

  if(params.data){
    load(params.data);
  }
}

function run(data, schema) {
  // CURRENTLY EXPECTED AS GLOBAL VARS...
  self.data = data;
  self.schema = schema;

  var s = d3.selectAll("select.shelf").selectAll("option")
    .data(["-"].concat(d3.keys(schema)), function(d) { return d; });
  s.enter().append("option")
    .attr("value", function(d) { return d; })
    .text(function(d) { return d; })
  s.exit().remove();
}

function update() {
  var enc = encodings(),
    data = self.data,
    spec = vl.toVegaSpec(enc, data);
  self.enc = enc; // DEBUG
  self.spec = spec;

  var inclData = d3.select("#inclData").node().checked;

  if(inclData){ // if "include data" is checked, include data url in the output
    enc = encodings({dataUrl: {value:self.dataUrl}});
    spec = vl.toVegaSpec(enc, data);
  }
  d3.select(".shorthand").attr("value", enc.toShorthand());
  d3.select("textarea.vlcode").node().value = JSON.stringify(enc.toJSON(), null, "  ", 80);
  d3.select("textarea.vgcode").node().value = JSON.stringify(spec, null, "  ", 80);
  parse(self.spec, data);
}

function swapXY(){
  var o = {};
  var encXY = d3.selectAll("#ctrl div.enc").selectAll(function(d){
    return d==="x" || d==="y" ? [this] : [];
  });
  encXY.each(function(d) {
    o[d] = readEnc(this);
  });
  encXY.each(function(d){
    var e = o[d==="x" ? "y": "x"];
    loadEnc(this, e.shelf, e.aggr, e.type);
  })

  update();
}

function loadEncoding(encoding, callback){
  var dataUrl = encoding.config("dataUrl");
  var _load = function(){
    d3.select("select.mark").node().value = encoding.marktype();

    d3.selectAll("#ctrl div.enc").each(function(d) {
      if(encoding.has(d)){
        var e = encoding._enc[d];
        loadEnc(this, e.name || "-",
          e.bin ? "bin" : e.aggr || "-",
          vl.dataTypeNames[e.type] || "-");
      }else{
        loadEnc(this, "-", "-", "-");
      }
    });
    if (callback) callback();
  }
  if(dataUrl){
    d3.select("select.data").node().value = dataUrl;
    load(dataUrl, _load); //need to load data first!
  }else{
    _load();
  }
}

function loadEnc(dom, v, a ,t){
  var s = d3.select(dom);
  s.select("select.shelf").node().value = v;
  s.select("select.type").node().value = t;
  s.select("select.aggr").node().value = a;
}

function readEnc(dom){
  //read encoding from the UI
  var s = d3.select(dom).select("select.shelf").node();
  var v = s.options[s.selectedIndex].value;

  var s = d3.select(dom).select("select.type").node();
  var t = s.options[s.selectedIndex].value;

  var s = d3.select(dom).select("select.aggr").node();
  var a = s.options[s.selectedIndex].value;

  return {shelf:v, type:t, aggr:a};
}

function encodings(cfg) {
  var marktype = "bar",
      bin = null,
      enc = {};
  cfg = cfg || {};

  var types = vl.dataTypes;

  var s = d3.select("select.mark").node();
  marktype = s.options[s.selectedIndex].value;

  d3.selectAll("#ctrl div.enc").each(function(d) {
    var x = d, e=readEnc(this),
      v=e.shelf, a=e.aggr, t=e.type;

    if (v !== "-" || a === "count") {
      enc[x] = {
        name: v,
        type: (a==="count" ? types.Q : t==="-" ? schema[v] : types[t])
      };

      if (a === "bin") {
        enc[x].bin = true;
      } else if (a !== "-") {
        enc[x].aggr = a;
      }
    }
  });

  d3.selectAll("#ctrl div.cfg input").each(function(d){
    var val = this.value;
    if(val && val.length > 0){
      cfg[d] = {value: val};
    }
  });
  return new vl.Encoding(marktype, enc, cfg);
}

function parse(spec, data) {
  self.vis = null; // DEBUG
  vg.parse.spec(spec, function(chart) {
    self.vis = chart({el:"#vis", renderer: "svg"});
    vis.data({table: data}).update();
  });
}

init();