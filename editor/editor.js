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

var TYPE_LIST = {
      Q: ["Q", "O", "T"],
      O: ["O"],
      T: ["T", "O"],
      "-": ["-"]
    },
    FN_LIST = {
      O: ["-", "count"],
      Q: ["-", "avg", "sum", "min", "max", "count", "bin"],
      T: ["month", "year", "day", "date", "hour", "minute", "second"],
      "-": ["-", "count"]
    }

var LOG_UI = true;

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
        datasetUpdated(url);
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
    .on("change", function(){
      var marktype = d3.select(this).node().value;
      marktypeUpdated(marktype);
      update();
    })
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
    .attr("id", function(d){ return "aggr-"+d;})
    .on("change", function(d){
      var fn = d3.select(this).node().value;
      fnUpdated(d, fn);
      update();
    })
    .selectAll("option")
      .data(["-", "avg", "sum", "min", "max", "count", "bin"])
    .enter().append("option")
      .attr("value", function(d) { return d; })
      .text(function(d) { return d; });

  // data variable
  ctrl.append("select")
    .attr("class", "shelf")
    .attr("id", function(d){ return "shelf-"+d;})
    .on("change", function(d){
      var field = d3.select(this).node().value;
      shelfUpdated(d, field);
      update();
    })
    .selectAll("option")
      .data(["-"], function(d) { return d; })
    .enter().append("option")
      .attr("value", function(d) { return d; })
      .text(function(d) { return d; });

  // data type (ordinal, quantitative or time)
  ctrl.append("select")
    .attr("class", "type")
    .attr("id", function(d){ return "type-"+d;})
    .on("change", function(d){
      var type = d3.select(this).node().value;
      typeUpdated(d, type);
      update();
    })
    .selectAll("option")
      .data(["-", "O", "Q", "T"])
    .enter().append("option")
      .attr("value", function(d) { return d; })
      .text(function(d) { return d; });

  // x btn
  ctrl.append("a").attr({"class":"action", "href":"#"}).text("x")
    .on('click', removeEnc)

  // swap btn
  ctrl.selectAll(function(d){ return d==="x" ? [this] : []; })
    .append("a").attr({"class":"action", "href":"#"}).text("swap")
    .on('click', swapXY);

  // Toggle Inspect / Config Form
  var toggles = main.append("div").attr("class","toggles");

  var showDiv = toggles.append("div").attr("class","show");

  var codeToggle = showDiv.append("a");
  codeToggle
    .text("hide code")
    .attr("href", "#")
    .attr("class", "action toggle")
    .on("click", function(){
      var expanded = code.style("display") === "block";
      code.style("display", expanded ? "none" : "block");
      this.innerText = expanded ? "show code" : "hide code";
    });


  var configToggle = showDiv.append("a");
  configToggle
    .text("show config")
    .attr("href", "#")
    .attr("class", "action toggle")
    .on("click", function(){
      var expanded = config.style("display") === "block";
      config.style("display", expanded ? "none" : "block");
      this.innerText = expanded ? "show config" : "hide config";
    });


  // Code Pane
  code.append("span").text("Shorthand");
  code.append("a").attr({"class": "right action", "href":"#"}).text("load")
    .on("click", function (){
      if(d3.select("select.data").node().value=="-"){
        alert("Please select dataset first.  (Shorthand doesn't contain data info)")
        return;
      }
      var s = d3.select("input.shorthand").node().value;

      e = vl.Encoding.parseShorthand(s);
      loadEncoding(e, update);
    });
  code.append("div")
    .append("input").attr({"class": "shorthand", "type": "text"});

  code.append("span").text("Vegalite");
  code.append("a").attr({"class": "right action", "href":"#"}).text("load")
    .on("click", function (){
      var s = d3.select("textarea.vlcode").node().value,
        json = JSON.parse(s);
      e = vl.Encoding.parseJSON(json);
      loadEncoding(e, update);
    })

  var inclDataGrp = code.append("span").attr("class", "right");

  inclDataGrp.append("span").text(" (")
  var inclData = inclDataGrp.append("label");
  inclData.append("input").attr({"type": "checkbox", "id":"inclData", "checked": true})
    .on("change", update);
  inclData.append("span").text("include data");
  inclDataGrp.append("span").text(") ").style("margin-right","12px");


  var vlTextarea = code.append("textarea").attr("class", "vlcode");

  code.append("span").text("Vega")
  var vgTextarea = code.append("textarea").attr("class", "vgcode");

  // Config Pane
  config.append("input").attr("type","button").attr("value","Update Config")
    .on("click", update);

  var configs = config.selectAll("div")
    .data(vl.keys(vl.DEFAULTS).filter(function(k){ return k[0] != "_";}))
    .enter().append("div").attr("class", "cfg")
      .append("label");

  configs.append("span").attr("class","label").text(function(d){return d;});
  configs.append("input")
    .attr("placeholder", function(d){return vl.DEFAULTS[d];});

  if(params.data){
    datasetUpdated(params.data);
  }
}

function removeEnc(d){
  d3.select("#shelf-"+d).node().value = "-";
  shelfUpdated(d, "-");
  d3.select("#type-"+d).node().value = "-";
  typeUpdated(d, "-");
  d3.select("#aggr-"+d).node().value = "-";
  fnUpdated(d, "-");
  update();
}

function datasetUpdated(url, callback) {
  if(url==="-"){
    return;
  }
  self.dataUrl = url;
  d3.json(url, function(err, data) {
    if (err) return alert("Error loading data " + err.statusText);
    var schema = {};
    for (var k in data[0]) {
      //TODO(kanitw): better type inference here
      schema[k] = (typeof data[0][k] === "number") ? vl.dataTypes.Q :
        isNaN(Date.parse(data[0][k])) ? vl.dataTypes.O : vl.dataTypes.T;
    }

    // CURRENTLY EXPECTED AS GLOBAL VARS...
    self.data = data;
    self.schema = schema;

    // update available data field in the each shelf
    var s = d3.selectAll("select.shelf").selectAll("option")
      .data(["-"].concat(d3.keys(schema)), function(d) { return d; });
    s.enter().append("option");
    s.attr("value", function(d) { return d; })
      .text(function(d) { return d; })
    s.exit().remove();

    if(callback) callback();
  });
}

function marktypeUpdated(marktype){
  if(LOG_UI) console.log("marktypeUpdated", marktype);
  var supportedEncoding = vl.marks[marktype].supportedEncoding,
    disabled =  function(d){
      return supportedEncoding[d] ? undefined : "true";
    };

  d3.selectAll("select.aggr").attr("disabled", disabled);
  d3.selectAll("select.shelf").attr("disabled", disabled);
  d3.selectAll("select.type").attr("disabled", disabled);
}

function fnUpdated(encType, fn){
  if(LOG_UI) console.log("fnUpdated", encType, fn);

  if(fn === "count"){ //reset shelf, type
    d3.select("select#shelf-"+encType).node().value = "-";
    shelfUpdated(encType, "-");
  }
}

function shelfUpdated(encType, field){
  if(LOG_UI) console.log("shelfUpdated", encType, field);

  var type = field !== "-" ? vl.dataTypeNames[self.schema[field]] : "-";
    types = TYPE_LIST[type];

  // update available type!
  var s = d3.select("select#type-"+encType).selectAll("option").data(types);
  s.enter().append("option");
  s.attr("value", function(d) { return d; })
    .text(function(d) { return d; });
  s.exit().remove();
}

function typeUpdated(encType, type){
  if(LOG_UI) console.log("typeUpdated", encType, type);
  var fns = FN_LIST[type];

  var s = d3.select("select#aggr-"+encType).selectAll("option").data(fns);
  s.enter().append("option");
  s.attr("value", function(d) { return d; })
    .text(function(d) { return d; });
  s.exit().remove();
}

function update() {
  var enc = encodings(),
    data = self.data,
    stats = vl.getStats(enc, data),
    spec = vl.toVegaSpec(enc, stats);

  self.enc = enc; // DEBUG
  self.spec = spec;

  var inclData = d3.select("#inclData").node().checked;

  if(inclData){ // if "include data" is checked, include data url in the output
    enc = encodings({dataUrl: self.dataUrl});
    spec = vl.toVegaSpec(enc, stats);
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
    loadEnc(this, d, e.shelf, e.aggr, e.type);
  })

  update();
}

function loadEncoding(encoding, callback){
  var dataUrl = encoding.config("dataUrl");
  var _load = function(){
    //update marktype
    d3.select("select.mark").node().value = encoding.marktype();
    marktypeUpdated(encoding.marktype());

    //update encoding UI
    d3.selectAll("#ctrl div.enc").each(function(d) {
      if(encoding.has(d)){
        var e = encoding._enc[d];
        loadEnc(
          this, d,
          e.name || "-",
          e.bin ? "bin" : e.aggr || "-",
          vl.dataTypeNames[e.type] || "-"
        );
      }else{
        loadEnc(this, d, "-", "-", "-");
      }
    });

    //update configs
    d3.selectAll("#ctrl div.cfg input").each(function(d){
      if(encoding._cfg.hasOwnProperty(d)){
        this.value = encoding.config(d);
      }
    })

    if (callback) callback();
  }
  if(dataUrl){
    d3.select("select.data").node().value = dataUrl;
    datasetUpdated(dataUrl, _load); //need to load data first!
  }else{
    _load();
  }
}

function loadEnc(dom, e, v, a ,t){
  var s = d3.select(dom);
  s.select("select.shelf").node().value = v;
  shelfUpdated(e, v);
  s.select("select.type").node().value = t;
  typeUpdated(e, t);
  s.select("select.aggr").node().value = a;
  fnUpdated(e, a);
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
        type: (a==="count" ? types.Q :
          t==="-" ?
            (x==="row" || x==="col" ? types.O : schema[v])
          : types[t])
      };

      if( t==="T"){
        enc[x].fn = a;
      }else{
        if (a === "bin") {
          enc[x].bin = true;
        } else if (a !== "-") {
          enc[x].aggr = a;
        }
      }
    }
  });

  d3.selectAll("#ctrl div.cfg input").each(function(d){
    var val = this.value;
    if(val && val.length > 0){
      cfg[d] = val == "true" ? true :
        val == "false" ? false : val;
    }
  });
  return new vl.Encoding(marktype, enc, cfg);
}

function parse(spec, data) {
  self.vis = null; // DEBUG
  vg.parse.spec(spec, function(chart) {
    self.vis = chart({el:"#vis", renderer: "svg"});

    if(!spec.data[0].url){
      // FIXME still need to load data this way without dataUrl
      // but the problem is they we need to make sure that the data get parsed.
      vis.data({table: data});
    }

    vis.update();
    vis.on('mouseover', function(event, item) { console.log(item); });
  });
}

init();