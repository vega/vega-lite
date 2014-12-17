var datasets = [
  {
    name: "-"
  },{
    name: "Barley",
    url: "data/barley.json",
    table: "barley_json"
  },{
    name: "Cars",
    url: "data/cars.json",
    table: "cars_json"
  },{
    name: "Crimea",
    url: "data/crimea.json",
    table: "crimea"
  },{
    name: "Driving",
    url: "data/driving.json",
    table: "driving_json"
  },{
    name: "Iris",
    url: "data/iris.json",
    table: "iris_json"
  },{
    name: "Jobs",
    url: "data/jobs.json",
    table: "jobs_json"
  },{
    name: "Population",
    url: "data/population.json",
    table: "population_json"
  },{
    name: "Movies",
    url: "data/movies.json",
    table: "movies_json"
  },{
    name: "Birdstrikes",
    url: "data/birdstrikes.json",
    table: "birdstrikes_json"
  }
];

var TYPE_LIST = {
      Q: ["Q", "O", "T"],
      O: ["O"],
      T: ["T", "O"],
      "-": ["-"]
    },
    FN_LIST = {
      O: ["-", "count"],
      Q: ["-"].concat(vl.quantAggTypes).concat(["bin"]),
      T: vl.timeFuncs,
      "-": ["-", "count"]
    };

var LOG_UI = false;

// http://stackoverflow.com/a/1830844
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

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

  // Hack to override vl config
  for(param in params) {
    if (param in vl.DEFAULTS) {
      var value = params[param];
      vl.DEFAULTS[param] = value == "true" ? true : (isNumber(value) ? parseFloat(value) : value);
    }
  }

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
      var item = this.options[this.selectedIndex].__data__;
      datasetUpdated(item, update);
    })
    .selectAll("option")
      .data(datasets)
    .enter().append("option")
      .attr("selected", function(d){
        return d.name==params.data ? true : undefined;
      })
      .text(function(d) { return d.name; });

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
      typeUpdated(d);
      fnUpdated(d);
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
      fnUpdated(d);
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

  marktypeUpdated("point");
  if(params.data){
    datasets.forEach(function(item) {
      if (params.data == item.name) {
        datasetUpdated(item);
      }
    });
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

function datasetUpdated(dataset, callback) {
  if(LOG_UI) console.log("datasetUpdated", dataset);

  var vscfg = vegaServerConfig(),
    useVegaServer = vscfg[0],
    vegaServerUrl = vscfg[1];

  console.log(vscfg)

  if (useVegaServer && dataset.table !== undefined) {
    self.table = dataset.table;

    var url = vegaServerUrl + "/stats/?name=" + dataset.table;

    d3.csv(url, function(err, data) {
      if (err) return alert("Error loading stats " + err.statusText);
      var stats = {};

      data.forEach(function(row) {
        var stat = {}
        stat.min = +row.min;
        stat.max = +row.max;
        stat.cardinality = +row.cardinality;
        stat.type = row.type === "integer" || row.type === "real" ? vl.dataTypes.Q : vl.dataTypes.O;
        stats[row.name] = stat;
      });

      // CURRENTLY EXPECTED AS GLOBAL VARS...
      self.stats = stats;

      updateShelves();

      if(callback) callback();
    });
  } else if (dataset.url !== undefined) {
    self.dataUrl = dataset.url;
    var url = dataset.url;

    d3.json(url, function(err, data) {
      if (err) return alert("Error loading data " + err.statusText);

      // CURRENTLY EXPECTED AS GLOBAL VARS...
      self.stats = vl.getStats(data);

      updateShelves();

      if(callback) callback();
    });
  } else {
    // this may initially be the case
    return;
  }
}

function updateShelves() {
  // update available data field in the each shelf
  var s = d3.selectAll("select.shelf").selectAll("option")
    .data(["-"].concat(d3.keys(self.stats)), function(d) { return d; });
  s.enter().append("option");
  s.attr("value", function(d) { return d; })
    .text(function(d) { return d; })
  s.exit().remove();

  d3.selectAll("select.shelf").each(function(d){
    shelfUpdated(d);
    typeUpdated(d);
    fnUpdated(d);
  })
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

  fn = fn || d3.select("select#aggr-"+encType).node().value;
  if(LOG_UI) console.log("fnUpdated", encType, fn);

  if(fn === "count"){ // disable shelf, type
    d3.select("select#shelf-"+encType).attr("disabled", true);
    d3.select("select#type-"+encType).attr("disabled", true);
  }else{
    // enable shelf, type if it's supported by the marktype
    var marktype = d3.select("select.mark").node().value,
      supportedEncoding = vl.marks[marktype].supportedEncoding,
      disabled =  function(d){
        return supportedEncoding[d] ? undefined : "true";
      };

    d3.select("select#shelf-"+encType).attr("disabled", disabled);
    d3.select("select#type-"+encType).attr("disabled", disabled);
  }
}

function shelfUpdated(encType, field){
  field = field || d3.select("select#shelf-"+encType).node().value;
  if(LOG_UI) console.log("shelfUpdated", encType, field);

  var type = field === "-" ? "-" : vl.dataTypeNames[self.stats[field].type],
    types = type !== "-" && (encType == "row" || encType == "col") ? TYPE_LIST.O : TYPE_LIST[type],
    typesel = d3.select("select#type-"+encType).node()

  if(types.indexOf(typesel.value) === -1){
    typesel.value = types[0];
  }

  // update available type!
  var s = d3.select("select#type-"+encType).selectAll("option").data(types);
  s.enter().append("option");
  s.attr("value", function(d) { return d; })
    .text(function(d) { return d; });
  s.exit().remove();
}

function typeUpdated(encType, type){
  type = type || d3.select("select#type-"+encType).node().value;
  if(LOG_UI) console.log("typeUpdated", encType, type);

  var fns = FN_LIST[type] || FN_LIST["-"],
    fnsel = d3.select("select#aggr-"+encType).node(),
    s = d3.select("select#aggr-"+encType).selectAll("option").data(fns);

  if(fns.indexOf(fnsel.value) === -1){
    // if new type doesn't support pre-selected function
    // reset fn to "-"
    fnsel.value = "-";
  }

  s.enter().append("option");
  s.attr("value", function(d) { return d; })
    .text(function(d) { return d; });
  s.exit().remove();
}

// Load config from DOM.
// These properties will be updated in loadEncoding before this function is called.
function vegaServerConfig() {
  var useVegaServer = vl.DEFAULTS.useVegaServer,
    vegaServerUrl = vl.DEFAULTS.vegaServerUrl;
  d3.selectAll("#ctrl div.cfg input").each(function(d){
    if (d == "useVegaServer" && this.value) {
      useVegaServer = this.value == "true";
    } else if (d == "vegaServerUrl" && this.value) {
      vegaServerUrl = this.value;
    }
  });

  return [useVegaServer, vegaServerUrl];
}

function update() {
  var useVegaServer = vegaServerConfig()[0];

  var cfg = {
    dataFormatType: useVegaServer ? "csv" : "json",
  }
  if (useVegaServer) {
    cfg.vegaServerTable = self.table;
  } else {
    cfg.dataUrl = self.dataUrl;
  }

  var enc = encodings(cfg),
    stats = self.stats,
    // TODO: why convert to spec twice if data has to be included?
    spec = vl.toVegaSpec(enc, stats);

  self.enc = enc; // DEBUG
  self.spec = spec;

  var inclData = d3.select("#inclData").node().checked;

  if(!inclData){ // if "include data" is checked, include data url in the output
    enc = encodings();
    spec = vl.toVegaSpec(enc, stats);
  }
  d3.select(".shorthand").node().value = enc.toShorthand();
  d3.select("textarea.vlcode").node().value = JSON.stringify(enc.toJSON(), null, "  ", 80);
  d3.select("textarea.vgcode").node().value = JSON.stringify(spec, null, "  ", 80);
  parse(self.spec);
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
  var dataUrl = encoding.config("dataUrl"),
    useVegaServer = encoding.config("useVegaServer");
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
          e.bin ? "bin" : e.aggr || e.fn || "-",
          vl.dataTypeNames[e.type] || "-"
        );
      }else{
        loadEnc(this, d, "-", "-", "-");
      }
    });

    if (callback) callback();
  };

  // update configs first -- so useVegaServer in the DOM is correctly updated
  d3.selectAll("#ctrl div.cfg input").each(function(d){
    if(encoding._cfg.hasOwnProperty(d)){
      this.value = encoding.config(d);
    }
  });

  if(dataUrl){
    var dataset = null;
    for(var i=0; i<datasets.length ; i++){
      if(datasets[i].url == dataUrl){
        dataset = datasets[i];
        break;
      }
    }
    d3.select("select.data").node().value = dataset.name;
    datasetUpdated(dataset, _load); //need to load data first!
  }else if(useVegaServer){
    var dataset = null, table = encoding.config("vegaServerTable");
    for(var i=0; i<datasets.length ; i++){
      if(datasets[i].table == table){
        dataset = datasets[i];
        break;
      }
    }
    d3.select("select.data").node().value = dataset.name;
    datasetUpdated(dataset, _load); //need to load data first!
  } else{
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
  var s = d3.select(dom).select("select.shelf");
  var v = s.attr("disabled") ? undefined : s.node().value; // return "-"

  var s = d3.select(dom).select("select.type");
  var t = s.attr("disabled") ? undefined : s.node().value;

  var s = d3.select(dom).select("select.aggr");
  var a = s.attr("disabled") ? undefined : s.node().value;

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

    if ((v && v !== "-") || a === "count") {
      enc[x] = {
        name: v,
        type: (a==="count" ? types.Q :
          t==="-" ?
            (x==="row" || x==="col" ? types.O : stats[v].type)
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

function parse(spec) {
  self.vis = null; // DEBUG
  vg.parse.spec(spec, function(chart) {
    self.vis = chart({el:"#vis", renderer: "svg"});

    if(!spec.data[0].url){
      // FIXME still need to load data this way without dataUrl
      // but the problem is they we need to make sure that the data get parsed.
      //vis.data({table: data});
    }

    vis.update();
    vis.on('mouseover', function(event, item) { console.log(item); });
  });
}

init();