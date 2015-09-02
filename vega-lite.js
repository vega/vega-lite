(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.vl = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
// This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).
// JavaScript specs as packaged in the D3 library (d3js.org). Please see license at http://colorbrewer.org/export/LICENSE.txt
!function() {

var colorbrewer = {YlGn: {
3: ["#f7fcb9","#addd8e","#31a354"],
4: ["#ffffcc","#c2e699","#78c679","#238443"],
5: ["#ffffcc","#c2e699","#78c679","#31a354","#006837"],
6: ["#ffffcc","#d9f0a3","#addd8e","#78c679","#31a354","#006837"],
7: ["#ffffcc","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],
8: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],
9: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"]
},YlGnBu: {
3: ["#edf8b1","#7fcdbb","#2c7fb8"],
4: ["#ffffcc","#a1dab4","#41b6c4","#225ea8"],
5: ["#ffffcc","#a1dab4","#41b6c4","#2c7fb8","#253494"],
6: ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#2c7fb8","#253494"],
7: ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],
8: ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],
9: ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]
},GnBu: {
3: ["#e0f3db","#a8ddb5","#43a2ca"],
4: ["#f0f9e8","#bae4bc","#7bccc4","#2b8cbe"],
5: ["#f0f9e8","#bae4bc","#7bccc4","#43a2ca","#0868ac"],
6: ["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#43a2ca","#0868ac"],
7: ["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],
8: ["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],
9: ["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"]
},BuGn: {
3: ["#e5f5f9","#99d8c9","#2ca25f"],
4: ["#edf8fb","#b2e2e2","#66c2a4","#238b45"],
5: ["#edf8fb","#b2e2e2","#66c2a4","#2ca25f","#006d2c"],
6: ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"],
7: ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],
8: ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],
9: ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"]
},PuBuGn: {
3: ["#ece2f0","#a6bddb","#1c9099"],
4: ["#f6eff7","#bdc9e1","#67a9cf","#02818a"],
5: ["#f6eff7","#bdc9e1","#67a9cf","#1c9099","#016c59"],
6: ["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#1c9099","#016c59"],
7: ["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],
8: ["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],
9: ["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016c59","#014636"]
},PuBu: {
3: ["#ece7f2","#a6bddb","#2b8cbe"],
4: ["#f1eef6","#bdc9e1","#74a9cf","#0570b0"],
5: ["#f1eef6","#bdc9e1","#74a9cf","#2b8cbe","#045a8d"],
6: ["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#2b8cbe","#045a8d"],
7: ["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],
8: ["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],
9: ["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d","#023858"]
},BuPu: {
3: ["#e0ecf4","#9ebcda","#8856a7"],
4: ["#edf8fb","#b3cde3","#8c96c6","#88419d"],
5: ["#edf8fb","#b3cde3","#8c96c6","#8856a7","#810f7c"],
6: ["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8856a7","#810f7c"],
7: ["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],
8: ["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],
9: ["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]
},RdPu: {
3: ["#fde0dd","#fa9fb5","#c51b8a"],
4: ["#feebe2","#fbb4b9","#f768a1","#ae017e"],
5: ["#feebe2","#fbb4b9","#f768a1","#c51b8a","#7a0177"],
6: ["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#c51b8a","#7a0177"],
7: ["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],
8: ["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],
9: ["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"]
},PuRd: {
3: ["#e7e1ef","#c994c7","#dd1c77"],
4: ["#f1eef6","#d7b5d8","#df65b0","#ce1256"],
5: ["#f1eef6","#d7b5d8","#df65b0","#dd1c77","#980043"],
6: ["#f1eef6","#d4b9da","#c994c7","#df65b0","#dd1c77","#980043"],
7: ["#f1eef6","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],
8: ["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],
9: ["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"]
},OrRd: {
3: ["#fee8c8","#fdbb84","#e34a33"],
4: ["#fef0d9","#fdcc8a","#fc8d59","#d7301f"],
5: ["#fef0d9","#fdcc8a","#fc8d59","#e34a33","#b30000"],
6: ["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#e34a33","#b30000"],
7: ["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],
8: ["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],
9: ["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]
},YlOrRd: {
3: ["#ffeda0","#feb24c","#f03b20"],
4: ["#ffffb2","#fecc5c","#fd8d3c","#e31a1c"],
5: ["#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026"],
6: ["#ffffb2","#fed976","#feb24c","#fd8d3c","#f03b20","#bd0026"],
7: ["#ffffb2","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],
8: ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],
9: ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]
},YlOrBr: {
3: ["#fff7bc","#fec44f","#d95f0e"],
4: ["#ffffd4","#fed98e","#fe9929","#cc4c02"],
5: ["#ffffd4","#fed98e","#fe9929","#d95f0e","#993404"],
6: ["#ffffd4","#fee391","#fec44f","#fe9929","#d95f0e","#993404"],
7: ["#ffffd4","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],
8: ["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],
9: ["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"]
},Purples: {
3: ["#efedf5","#bcbddc","#756bb1"],
4: ["#f2f0f7","#cbc9e2","#9e9ac8","#6a51a3"],
5: ["#f2f0f7","#cbc9e2","#9e9ac8","#756bb1","#54278f"],
6: ["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#756bb1","#54278f"],
7: ["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],
8: ["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],
9: ["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"]
},Blues: {
3: ["#deebf7","#9ecae1","#3182bd"],
4: ["#eff3ff","#bdd7e7","#6baed6","#2171b5"],
5: ["#eff3ff","#bdd7e7","#6baed6","#3182bd","#08519c"],
6: ["#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"],
7: ["#eff3ff","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],
8: ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],
9: ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]
},Greens: {
3: ["#e5f5e0","#a1d99b","#31a354"],
4: ["#edf8e9","#bae4b3","#74c476","#238b45"],
5: ["#edf8e9","#bae4b3","#74c476","#31a354","#006d2c"],
6: ["#edf8e9","#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"],
7: ["#edf8e9","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],
8: ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],
9: ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"]
},Oranges: {
3: ["#fee6ce","#fdae6b","#e6550d"],
4: ["#feedde","#fdbe85","#fd8d3c","#d94701"],
5: ["#feedde","#fdbe85","#fd8d3c","#e6550d","#a63603"],
6: ["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d","#a63603"],
7: ["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],
8: ["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],
9: ["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"]
},Reds: {
3: ["#fee0d2","#fc9272","#de2d26"],
4: ["#fee5d9","#fcae91","#fb6a4a","#cb181d"],
5: ["#fee5d9","#fcae91","#fb6a4a","#de2d26","#a50f15"],
6: ["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"],
7: ["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],
8: ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],
9: ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]
},Greys: {
3: ["#f0f0f0","#bdbdbd","#636363"],
4: ["#f7f7f7","#cccccc","#969696","#525252"],
5: ["#f7f7f7","#cccccc","#969696","#636363","#252525"],
6: ["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#636363","#252525"],
7: ["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],
8: ["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],
9: ["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"]
},PuOr: {
3: ["#f1a340","#f7f7f7","#998ec3"],
4: ["#e66101","#fdb863","#b2abd2","#5e3c99"],
5: ["#e66101","#fdb863","#f7f7f7","#b2abd2","#5e3c99"],
6: ["#b35806","#f1a340","#fee0b6","#d8daeb","#998ec3","#542788"],
7: ["#b35806","#f1a340","#fee0b6","#f7f7f7","#d8daeb","#998ec3","#542788"],
8: ["#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788"],
9: ["#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788"],
10: ["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"],
11: ["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"]
},BrBG: {
3: ["#d8b365","#f5f5f5","#5ab4ac"],
4: ["#a6611a","#dfc27d","#80cdc1","#018571"],
5: ["#a6611a","#dfc27d","#f5f5f5","#80cdc1","#018571"],
6: ["#8c510a","#d8b365","#f6e8c3","#c7eae5","#5ab4ac","#01665e"],
7: ["#8c510a","#d8b365","#f6e8c3","#f5f5f5","#c7eae5","#5ab4ac","#01665e"],
8: ["#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e"],
9: ["#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e"],
10: ["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"],
11: ["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"]
},PRGn: {
3: ["#af8dc3","#f7f7f7","#7fbf7b"],
4: ["#7b3294","#c2a5cf","#a6dba0","#008837"],
5: ["#7b3294","#c2a5cf","#f7f7f7","#a6dba0","#008837"],
6: ["#762a83","#af8dc3","#e7d4e8","#d9f0d3","#7fbf7b","#1b7837"],
7: ["#762a83","#af8dc3","#e7d4e8","#f7f7f7","#d9f0d3","#7fbf7b","#1b7837"],
8: ["#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837"],
9: ["#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837"],
10: ["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"],
11: ["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"]
},PiYG: {
3: ["#e9a3c9","#f7f7f7","#a1d76a"],
4: ["#d01c8b","#f1b6da","#b8e186","#4dac26"],
5: ["#d01c8b","#f1b6da","#f7f7f7","#b8e186","#4dac26"],
6: ["#c51b7d","#e9a3c9","#fde0ef","#e6f5d0","#a1d76a","#4d9221"],
7: ["#c51b7d","#e9a3c9","#fde0ef","#f7f7f7","#e6f5d0","#a1d76a","#4d9221"],
8: ["#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221"],
9: ["#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221"],
10: ["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"],
11: ["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"]
},RdBu: {
3: ["#ef8a62","#f7f7f7","#67a9cf"],
4: ["#ca0020","#f4a582","#92c5de","#0571b0"],
5: ["#ca0020","#f4a582","#f7f7f7","#92c5de","#0571b0"],
6: ["#b2182b","#ef8a62","#fddbc7","#d1e5f0","#67a9cf","#2166ac"],
7: ["#b2182b","#ef8a62","#fddbc7","#f7f7f7","#d1e5f0","#67a9cf","#2166ac"],
8: ["#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac"],
9: ["#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac"],
10: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],
11: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"]
},RdGy: {
3: ["#ef8a62","#ffffff","#999999"],
4: ["#ca0020","#f4a582","#bababa","#404040"],
5: ["#ca0020","#f4a582","#ffffff","#bababa","#404040"],
6: ["#b2182b","#ef8a62","#fddbc7","#e0e0e0","#999999","#4d4d4d"],
7: ["#b2182b","#ef8a62","#fddbc7","#ffffff","#e0e0e0","#999999","#4d4d4d"],
8: ["#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d"],
9: ["#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d"],
10: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"],
11: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"]
},RdYlBu: {
3: ["#fc8d59","#ffffbf","#91bfdb"],
4: ["#d7191c","#fdae61","#abd9e9","#2c7bb6"],
5: ["#d7191c","#fdae61","#ffffbf","#abd9e9","#2c7bb6"],
6: ["#d73027","#fc8d59","#fee090","#e0f3f8","#91bfdb","#4575b4"],
7: ["#d73027","#fc8d59","#fee090","#ffffbf","#e0f3f8","#91bfdb","#4575b4"],
8: ["#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4"],
9: ["#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4"],
10: ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],
11: ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"]
},Spectral: {
3: ["#fc8d59","#ffffbf","#99d594"],
4: ["#d7191c","#fdae61","#abdda4","#2b83ba"],
5: ["#d7191c","#fdae61","#ffffbf","#abdda4","#2b83ba"],
6: ["#d53e4f","#fc8d59","#fee08b","#e6f598","#99d594","#3288bd"],
7: ["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"],
8: ["#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd"],
9: ["#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd"],
10: ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],
11: ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"]
},RdYlGn: {
3: ["#fc8d59","#ffffbf","#91cf60"],
4: ["#d7191c","#fdae61","#a6d96a","#1a9641"],
5: ["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"],
6: ["#d73027","#fc8d59","#fee08b","#d9ef8b","#91cf60","#1a9850"],
7: ["#d73027","#fc8d59","#fee08b","#ffffbf","#d9ef8b","#91cf60","#1a9850"],
8: ["#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850"],
9: ["#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850"],
10: ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"],
11: ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]
},Accent: {
3: ["#7fc97f","#beaed4","#fdc086"],
4: ["#7fc97f","#beaed4","#fdc086","#ffff99"],
5: ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0"],
6: ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f"],
7: ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17"],
8: ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"]
},Dark2: {
3: ["#1b9e77","#d95f02","#7570b3"],
4: ["#1b9e77","#d95f02","#7570b3","#e7298a"],
5: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e"],
6: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02"],
7: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d"],
8: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]
},Paired: {
3: ["#a6cee3","#1f78b4","#b2df8a"],
4: ["#a6cee3","#1f78b4","#b2df8a","#33a02c"],
5: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99"],
6: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c"],
7: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f"],
8: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00"],
9: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6"],
10: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a"],
11: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99"],
12: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]
},Pastel1: {
3: ["#fbb4ae","#b3cde3","#ccebc5"],
4: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4"],
5: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6"],
6: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc"],
7: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd"],
8: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec"],
9: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]
},Pastel2: {
3: ["#b3e2cd","#fdcdac","#cbd5e8"],
4: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4"],
5: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9"],
6: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae"],
7: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc"],
8: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc","#cccccc"]
},Set1: {
3: ["#e41a1c","#377eb8","#4daf4a"],
4: ["#e41a1c","#377eb8","#4daf4a","#984ea3"],
5: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00"],
6: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33"],
7: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628"],
8: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf"],
9: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]
},Set2: {
3: ["#66c2a5","#fc8d62","#8da0cb"],
4: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3"],
5: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"],
6: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f"],
7: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494"],
8: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"]
},Set3: {
3: ["#8dd3c7","#ffffb3","#bebada"],
4: ["#8dd3c7","#ffffb3","#bebada","#fb8072"],
5: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3"],
6: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462"],
7: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69"],
8: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5"],
9: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9"],
10: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd"],
11: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5"],
12: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]
}};

if (typeof define === "function" && define.amd) {
    define(colorbrewer);
} else if (typeof module === "object" && module.exports) {
    module.exports = colorbrewer;
} else {
    this.colorbrewer = colorbrewer;
}

}();

},{}],3:[function(require,module,exports){
module.exports = require('./colorbrewer.js');

},{"./colorbrewer.js":2}],4:[function(require,module,exports){
if (typeof Map === "undefined") {
  Map = function() { this.clear(); };
  Map.prototype = {
    set: function(k, v) { this._[k] = v; return this; },
    get: function(k) { return this._[k]; },
    has: function(k) { return k in this._; },
    delete: function(k) { return k in this._ && delete this._[k]; },
    clear: function() { this._ = Object.create(null); },
    get size() { var n = 0; for (var k in this._) ++n; return n; },
    forEach: function(c) { for (var k in this._) c(this._[k], k, this); }
  };
} else (function() {
  var m = new Map;
  if (m.set(0, 0) !== m) {
    m = m.set;
    Map.prototype.set = function() { m.apply(this, arguments); return this; };
  }
})();

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.color = {}));
}(this, function (exports) { 'use strict';

  function deltaHue(h1, h0) {
    var delta = h1 - h0;
    return delta > 180 || delta < -180
        ? delta - 360 * Math.round(delta / 360)
        : delta;
  }

  function Color() {}

  var reHex3 = /^#([0-9a-f]{3})$/;
  var reHex6 = /^#([0-9a-f]{6})$/;
  var reRgbInteger = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/;
  var reRgbPercent = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
  var reHslPercent = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;

  color.prototype = Color.prototype = {
    displayable: function() {
      return this.rgb().displayable();
    },
    toString: function() {
      return this.rgb() + "";
    }
  };

  function color(format) {
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf))) // #f00
        : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
        : (m = reRgbInteger.exec(format)) ? rgb(m[1], m[2], m[3]) // rgb(255,0,0)
        : (m = reRgbPercent.exec(format)) ? rgb(m[1] * 2.55, m[2] * 2.55, m[3] * 2.55) // rgb(100%,0%,0%)
        : (m = reHslPercent.exec(format)) ? hsl(m[1], m[2] * .01, m[3] * .01) // hsl(120,50%,50%)
        : named.has(format) ? rgbn(named.get(format))
        : null;
  }

  function rgbn(n) {
    return rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff);
  }

  var named = (new Map)
      .set("aliceblue", 0xf0f8ff)
      .set("antiquewhite", 0xfaebd7)
      .set("aqua", 0x00ffff)
      .set("aquamarine", 0x7fffd4)
      .set("azure", 0xf0ffff)
      .set("beige", 0xf5f5dc)
      .set("bisque", 0xffe4c4)
      .set("black", 0x000000)
      .set("blanchedalmond", 0xffebcd)
      .set("blue", 0x0000ff)
      .set("blueviolet", 0x8a2be2)
      .set("brown", 0xa52a2a)
      .set("burlywood", 0xdeb887)
      .set("cadetblue", 0x5f9ea0)
      .set("chartreuse", 0x7fff00)
      .set("chocolate", 0xd2691e)
      .set("coral", 0xff7f50)
      .set("cornflowerblue", 0x6495ed)
      .set("cornsilk", 0xfff8dc)
      .set("crimson", 0xdc143c)
      .set("cyan", 0x00ffff)
      .set("darkblue", 0x00008b)
      .set("darkcyan", 0x008b8b)
      .set("darkgoldenrod", 0xb8860b)
      .set("darkgray", 0xa9a9a9)
      .set("darkgreen", 0x006400)
      .set("darkgrey", 0xa9a9a9)
      .set("darkkhaki", 0xbdb76b)
      .set("darkmagenta", 0x8b008b)
      .set("darkolivegreen", 0x556b2f)
      .set("darkorange", 0xff8c00)
      .set("darkorchid", 0x9932cc)
      .set("darkred", 0x8b0000)
      .set("darksalmon", 0xe9967a)
      .set("darkseagreen", 0x8fbc8f)
      .set("darkslateblue", 0x483d8b)
      .set("darkslategray", 0x2f4f4f)
      .set("darkslategrey", 0x2f4f4f)
      .set("darkturquoise", 0x00ced1)
      .set("darkviolet", 0x9400d3)
      .set("deeppink", 0xff1493)
      .set("deepskyblue", 0x00bfff)
      .set("dimgray", 0x696969)
      .set("dimgrey", 0x696969)
      .set("dodgerblue", 0x1e90ff)
      .set("firebrick", 0xb22222)
      .set("floralwhite", 0xfffaf0)
      .set("forestgreen", 0x228b22)
      .set("fuchsia", 0xff00ff)
      .set("gainsboro", 0xdcdcdc)
      .set("ghostwhite", 0xf8f8ff)
      .set("gold", 0xffd700)
      .set("goldenrod", 0xdaa520)
      .set("gray", 0x808080)
      .set("green", 0x008000)
      .set("greenyellow", 0xadff2f)
      .set("grey", 0x808080)
      .set("honeydew", 0xf0fff0)
      .set("hotpink", 0xff69b4)
      .set("indianred", 0xcd5c5c)
      .set("indigo", 0x4b0082)
      .set("ivory", 0xfffff0)
      .set("khaki", 0xf0e68c)
      .set("lavender", 0xe6e6fa)
      .set("lavenderblush", 0xfff0f5)
      .set("lawngreen", 0x7cfc00)
      .set("lemonchiffon", 0xfffacd)
      .set("lightblue", 0xadd8e6)
      .set("lightcoral", 0xf08080)
      .set("lightcyan", 0xe0ffff)
      .set("lightgoldenrodyellow", 0xfafad2)
      .set("lightgray", 0xd3d3d3)
      .set("lightgreen", 0x90ee90)
      .set("lightgrey", 0xd3d3d3)
      .set("lightpink", 0xffb6c1)
      .set("lightsalmon", 0xffa07a)
      .set("lightseagreen", 0x20b2aa)
      .set("lightskyblue", 0x87cefa)
      .set("lightslategray", 0x778899)
      .set("lightslategrey", 0x778899)
      .set("lightsteelblue", 0xb0c4de)
      .set("lightyellow", 0xffffe0)
      .set("lime", 0x00ff00)
      .set("limegreen", 0x32cd32)
      .set("linen", 0xfaf0e6)
      .set("magenta", 0xff00ff)
      .set("maroon", 0x800000)
      .set("mediumaquamarine", 0x66cdaa)
      .set("mediumblue", 0x0000cd)
      .set("mediumorchid", 0xba55d3)
      .set("mediumpurple", 0x9370db)
      .set("mediumseagreen", 0x3cb371)
      .set("mediumslateblue", 0x7b68ee)
      .set("mediumspringgreen", 0x00fa9a)
      .set("mediumturquoise", 0x48d1cc)
      .set("mediumvioletred", 0xc71585)
      .set("midnightblue", 0x191970)
      .set("mintcream", 0xf5fffa)
      .set("mistyrose", 0xffe4e1)
      .set("moccasin", 0xffe4b5)
      .set("navajowhite", 0xffdead)
      .set("navy", 0x000080)
      .set("oldlace", 0xfdf5e6)
      .set("olive", 0x808000)
      .set("olivedrab", 0x6b8e23)
      .set("orange", 0xffa500)
      .set("orangered", 0xff4500)
      .set("orchid", 0xda70d6)
      .set("palegoldenrod", 0xeee8aa)
      .set("palegreen", 0x98fb98)
      .set("paleturquoise", 0xafeeee)
      .set("palevioletred", 0xdb7093)
      .set("papayawhip", 0xffefd5)
      .set("peachpuff", 0xffdab9)
      .set("peru", 0xcd853f)
      .set("pink", 0xffc0cb)
      .set("plum", 0xdda0dd)
      .set("powderblue", 0xb0e0e6)
      .set("purple", 0x800080)
      .set("rebeccapurple", 0x663399)
      .set("red", 0xff0000)
      .set("rosybrown", 0xbc8f8f)
      .set("royalblue", 0x4169e1)
      .set("saddlebrown", 0x8b4513)
      .set("salmon", 0xfa8072)
      .set("sandybrown", 0xf4a460)
      .set("seagreen", 0x2e8b57)
      .set("seashell", 0xfff5ee)
      .set("sienna", 0xa0522d)
      .set("silver", 0xc0c0c0)
      .set("skyblue", 0x87ceeb)
      .set("slateblue", 0x6a5acd)
      .set("slategray", 0x708090)
      .set("slategrey", 0x708090)
      .set("snow", 0xfffafa)
      .set("springgreen", 0x00ff7f)
      .set("steelblue", 0x4682b4)
      .set("tan", 0xd2b48c)
      .set("teal", 0x008080)
      .set("thistle", 0xd8bfd8)
      .set("tomato", 0xff6347)
      .set("turquoise", 0x40e0d0)
      .set("violet", 0xee82ee)
      .set("wheat", 0xf5deb3)
      .set("white", 0xffffff)
      .set("whitesmoke", 0xf5f5f5)
      .set("yellow", 0xffff00)
      .set("yellowgreen", 0x9acd32);

  var darker = .7;
  var brighter = 1 / darker;

  function rgb(r, g, b) {
    if (arguments.length === 1) {
      if (!(r instanceof Color)) r = color(r);
      if (r) {
        r = r.rgb();
        b = r.b;
        g = r.g;
        r = r.r;
      } else {
        r = g = b = NaN;
      }
    }
    return new Rgb(r, g, b);
  }

  function Rgb(r, g, b) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
  }

  var _prototype = rgb.prototype = Rgb.prototype = new Color;

  _prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k);
  };

  _prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k);
  };

  _prototype.rgb = function() {
    return this;
  };

  _prototype.displayable = function() {
    return (0 <= this.r && this.r <= 255)
        && (0 <= this.g && this.g <= 255)
        && (0 <= this.b && this.b <= 255);
  };

  _prototype.toString = function() {
    return format(this.r, this.g, this.b);
  };

  function format(r, g, b) {
    return "#"
        + (isNaN(r) ? "00" : (r = Math.round(r)) < 16 ? "0" + Math.max(0, r).toString(16) : Math.min(255, r).toString(16))
        + (isNaN(g) ? "00" : (g = Math.round(g)) < 16 ? "0" + Math.max(0, g).toString(16) : Math.min(255, g).toString(16))
        + (isNaN(b) ? "00" : (b = Math.round(b)) < 16 ? "0" + Math.max(0, b).toString(16) : Math.min(255, b).toString(16));
  }

  function hsl(h, s, l) {
    if (arguments.length === 1) {
      if (h instanceof Hsl) {
        l = h.l;
        s = h.s;
        h = h.h;
      } else {
        if (!(h instanceof Color)) h = color(h);
        if (h) {
          if (h instanceof Hsl) return h;
          h = h.rgb();
          var r = h.r / 255,
              g = h.g / 255,
              b = h.b / 255,
              min = Math.min(r, g, b),
              max = Math.max(r, g, b),
              range = max - min;
          l = (max + min) / 2;
          if (range) {
            s = l < .5 ? range / (max + min) : range / (2 - max - min);
            if (r === max) h = (g - b) / range + (g < b) * 6;
            else if (g === max) h = (b - r) / range + 2;
            else h = (r - g) / range + 4;
            h *= 60;
          } else {
            h = NaN;
            s = l > 0 && l < 1 ? 0 : h;
          }
        } else {
          h = s = l = NaN;
        }
      }
    }
    return new Hsl(h, s, l);
  }

  function Hsl(h, s, l) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
  }

  var __prototype = hsl.prototype = Hsl.prototype = new Color;

  __prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k);
  };

  __prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k);
  };

  __prototype.rgb = function() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < .5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2)
    );
  };

  __prototype.displayable = function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1);
  };

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var Kn = 18;

  var Xn = 0.950470;
  var Yn = 1;
  var Zn = 1.088830;
  var t0 = 4 / 29;
  var t1 = 6 / 29;
  var t2 = 3 * t1 * t1;
  var t3 = t1 * t1 * t1;

  function lab(l, a, b) {
    if (arguments.length === 1) {
      if (l instanceof Lab) {
        b = l.b;
        a = l.a;
        l = l.l;
      } else if (l instanceof Hcl) {
        var h = l.h * deg2rad;
        b = Math.sin(h) * l.c;
        a = Math.cos(h) * l.c;
        l = l.l;
      } else {
        if (!(l instanceof Rgb)) l = rgb(l);
        var r = rgb2xyz(l.r),
            g = rgb2xyz(l.g),
            b = rgb2xyz(l.b),
            x = xyz2lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / Xn),
            y = xyz2lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / Yn),
            z = xyz2lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / Zn);
        b = 200 * (y - z);
        a = 500 * (x - y);
        l = 116 * y - 16;
      }
    }
    return new Lab(l, a, b);
  }

  function Lab(l, a, b) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
  }

  var ___prototype = lab.prototype = Lab.prototype = new Color;

  ___prototype.brighter = function(k) {
    return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b);
  };

  ___prototype.darker = function(k) {
    return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b);
  };

  ___prototype.rgb = function() {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    y = Yn * lab2xyz(y);
    x = Xn * lab2xyz(x);
    z = Zn * lab2xyz(z);
    return new Rgb(
      xyz2rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
      xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
      xyz2rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z)
    );
  };

  function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
  }

  function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
  }

  function xyz2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  function rgb2xyz(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  var deg2rad = Math.PI / 180;
  var rad2deg = 180 / Math.PI;

  function hcl(h, c, l) {
    if (arguments.length === 1) {
      if (h instanceof Hcl) {
        l = h.l;
        c = h.c;
        h = h.h;
      } else {
        if (!(h instanceof Lab)) h = lab(h);
        l = h.l;
        c = Math.sqrt(h.a * h.a + h.b * h.b);
        h = Math.atan2(h.b, h.a) * rad2deg;
        if (h < 0) h += 360;
      }
    }
    return new Hcl(h, c, l);
  }

  function Hcl(h, c, l) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
  }

  var ____prototype = hcl.prototype = Hcl.prototype = new Color;

  ____prototype.brighter = function(k) {
    return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k));
  };

  ____prototype.darker = function(k) {
    return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k));
  };

  ____prototype.rgb = function() {
    return lab(this).rgb();
  };

  var A = -0.14861;
  var B = +1.78277;
  var C = -0.29227;
  var D = -0.90649;
  var E = +1.97294;
  var ED = E * D;
  var EB = E * B;
  var BC_DA = B * C - D * A;

  function cubehelix(h, s, l) {
    if (arguments.length === 1) {
      if (h instanceof Cubehelix) {
        l = h.l;
        s = h.s;
        h = h.h;
      } else {
        if (!(h instanceof Rgb)) h = rgb(h);
        var r = h.r / 255, g = h.g / 255, b = h.b / 255;
        l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB);
        var bl = b - l, k = (E * (g - l) - C * bl) / D;
        s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)); // NaN if l=0 or l=1
        h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
        if (h < 0) h += 360;
      }
    }
    return new Cubehelix(h, s, l);
  }

  function Cubehelix(h, s, l) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
  }

  var prototype = cubehelix.prototype = Cubehelix.prototype = new Color;

  prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k);
  };

  prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Cubehelix(this.h, this.s, this.l * k);
  };

  prototype.rgb = function() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new Rgb(
      255 * (l + a * (A * cosh + B * sinh)),
      255 * (l + a * (C * cosh + D * sinh)),
      255 * (l + a * (E * cosh))
    );
  };

  function interpolateCubehelixGamma(gamma) {
    return function(a, b) {
      a = cubehelix(a);
      b = cubehelix(b);
      var ah = isNaN(a.h) ? b.h : a.h,
          as = isNaN(a.s) ? b.s : a.s,
          al = a.l,
          bh = isNaN(b.h) ? 0 : deltaHue(b.h, ah),
          bs = isNaN(b.s) ? 0 : b.s - as,
          bl = b.l - al;
      return function(t) {
        a.h = ah + bh * t;
        a.s = as + bs * t;
        a.l = al + bl * Math.pow(t, gamma);
        return a + "";
      };
    };
  }

  function interpolateCubehelixGammaLong(gamma) {
    return function(a, b) {
      a = cubehelix(a);
      b = cubehelix(b);
      var ah = isNaN(a.h) ? b.h : a.h,
          as = isNaN(a.s) ? b.s : a.s,
          al = a.l,
          bh = isNaN(b.h) ? 0 : b.h - ah,
          bs = isNaN(b.s) ? 0 : b.s - as,
          bl = b.l - al;
      return function(t) {
        a.h = ah + bh * t;
        a.s = as + bs * t;
        a.l = al + bl * Math.pow(t, gamma);
        return a + "";
      };
    };
  }

  function interpolateHclLong(a, b) {
    a = hcl(a);
    b = hcl(b);
    var ah = isNaN(a.h) ? b.h : a.h,
        ac = isNaN(a.c) ? b.c : a.c,
        al = a.l,
        bh = isNaN(b.h) ? 0 : b.h - ah,
        bc = isNaN(b.c) ? 0 : b.c - ac,
        bl = b.l - al;
    return function(t) {
      a.h = ah + bh * t;
      a.c = ac + bc * t;
      a.l = al + bl * t;
      return a + "";
    };
  }

  function interpolateHcl(a, b) {
    a = hcl(a);
    b = hcl(b);
    var ah = isNaN(a.h) ? b.h : a.h,
        ac = isNaN(a.c) ? b.c : a.c,
        al = a.l,
        bh = isNaN(b.h) ? 0 : deltaHue(b.h, ah),
        bc = isNaN(b.c) ? 0 : b.c - ac,
        bl = b.l - al;
    return function(t) {
      a.h = ah + bh * t;
      a.c = ac + bc * t;
      a.l = al + bl * t;
      return a + "";
    };
  }

  function interpolateLab(a, b) {
    a = lab(a);
    b = lab(b);
    var al = a.l,
        aa = a.a,
        ab = a.b,
        bl = b.l - al,
        ba = b.a - aa,
        bb = b.b - ab;
    return function(t) {
      a.l = al + bl * t;
      a.a = aa + ba * t;
      a.b = ab + bb * t;
      return a + "";
    };
  }

  function interpolateHslLong(a, b) {
    a = hsl(a);
    b = hsl(b);
    var ah = isNaN(a.h) ? b.h : a.h,
        as = isNaN(a.s) ? b.s : a.s,
        al = a.l,
        bh = isNaN(b.h) ? 0 : b.h - ah,
        bs = isNaN(b.s) ? 0 : b.s - as,
        bl = b.l - al;
    return function(t) {
      a.h = ah + bh * t;
      a.s = as + bs * t;
      a.l = al + bl * t;
      return a + "";
    };
  }

  function interpolateHsl(a, b) {
    a = hsl(a);
    b = hsl(b);
    var ah = isNaN(a.h) ? b.h : a.h,
        as = isNaN(a.s) ? b.s : a.s,
        al = a.l,
        bh = isNaN(b.h) ? 0 : deltaHue(b.h, ah),
        bs = isNaN(b.s) ? 0 : b.s - as,
        bl = b.l - al;
    return function(t) {
      a.h = ah + bh * t;
      a.s = as + bs * t;
      a.l = al + bl * t;
      return a + "";
    };
  }

  function interpolateRgb(a, b) {
    a = rgb(a);
    b = rgb(b);
    var ar = a.r,
        ag = a.g,
        ab = a.b,
        br = b.r - ar,
        bg = b.g - ag,
        bb = b.b - ab;
    return function(t) {
      return format(Math.round(ar + br * t), Math.round(ag + bg * t), Math.round(ab + bb * t));
    };
  }

  exports.interpolateCubehelix = interpolateCubehelixGamma(1);
  exports.interpolateCubehelixLong = interpolateCubehelixGammaLong(1);

  exports.color = color;
  exports.rgb = rgb;
  exports.hsl = hsl;
  exports.lab = lab;
  exports.hcl = hcl;
  exports.cubehelix = cubehelix;
  exports.interpolateRgb = interpolateRgb;
  exports.interpolateHsl = interpolateHsl;
  exports.interpolateHslLong = interpolateHslLong;
  exports.interpolateLab = interpolateLab;
  exports.interpolateHcl = interpolateHcl;
  exports.interpolateHclLong = interpolateHclLong;
  exports.interpolateCubehelixGamma = interpolateCubehelixGamma;
  exports.interpolateCubehelixGammaLong = interpolateCubehelixGammaLong;

}));
},{}],5:[function(require,module,exports){
if (typeof Map === "undefined") {
  Map = function() { this.clear(); };
  Map.prototype = {
    set: function(k, v) { this._[k] = v; return this; },
    get: function(k) { return this._[k]; },
    has: function(k) { return k in this._; },
    delete: function(k) { return k in this._ && delete this._[k]; },
    clear: function() { this._ = Object.create(null); },
    get size() { var n = 0; for (var k in this._) ++n; return n; },
    forEach: function(c) { for (var k in this._) c(this._[k], k, this); }
  };
} else (function() {
  var m = new Map;
  if (m.set(0, 0) !== m) {
    m = m.set;
    Map.prototype.set = function() { m.apply(this, arguments); return this; };
  }
})();

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.format = {}));
}(this, function (exports) { 'use strict';

  var zhCn = {
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["¥", ""]
  };

  var ruRu = {
    decimal: ",",
    thousands: "\xa0",
    grouping: [3],
    currency: ["", "\xa0руб."]
  };

  var ptBr = {
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["R$", ""]
  };

  var plPl = {
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", "zł"]
  };

  var nlNl = {
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["€\xa0", ""]
  };

  var mkMk = {
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", "\xa0ден."]
  };

  var itIt = {
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["€", ""]
  };

  var heIl = {
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["₪", ""]
  };

  var frFr = {
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", "\xa0€"]
  };

  var frCa = {
    decimal: ",",
    thousands: "\xa0",
    grouping: [3],
    currency: ["", "$"]
  };

  var fiFi = {
    decimal: ",",
    thousands: "\xa0",
    grouping: [3],
    currency: ["", "\xa0€"]
  };

  var esEs = {
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", "\xa0€"]
  };

  var enUs = {
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  };

  var enGb = {
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["£", ""]
  };

  var enCa = {
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  };

  var deDe = {
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", "\xa0€"]
  };

  var caEs = {
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", "\xa0€"]
  };


  // Computes the decimal coefficient and exponent of the specified number x with
  // significant digits p, where x is positive and p is in [1, 21] or undefined.
  // For example, formatDecimal(1.23) returns ["123", 0].
  function formatDecimal(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
    var i, coefficient = x.slice(0, i);

    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  }

  function exponent(x) {
    return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
  }

  var prefixExponent;

  function formatPrefixAuto(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient
        : i > n ? coefficient + new Array(i - n + 1).join("0")
        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
        : "0." + new Array(1 - i).join("0") + formatDecimal(x, p + i - 1)[0]; // less than 1y!
  }

  function formatRounded(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }

  function formatDefault(x, p) {
    x = x.toPrecision(p);

    out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (x[i]) {
        case ".": i0 = i1 = i; break;
        case "0": if (i0 === 0) i0 = i; i1 = i; break;
        case "e": break out;
        default: if (i0 > 0) i0 = 0; break;
      }
    }

    return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
  }

  var formatTypes = {
    "": formatDefault,
    "%": function(x, p) { return (x * 100).toFixed(p); },
    "b": function(x) { return Math.round(x).toString(2); },
    "c": function(x) { return x + ""; },
    "d": function(x) { return Math.round(x).toString(10); },
    "e": function(x, p) { return x.toExponential(p); },
    "f": function(x, p) { return x.toFixed(p); },
    "g": function(x, p) { return x.toPrecision(p); },
    "o": function(x) { return Math.round(x).toString(8); },
    "p": function(x, p) { return formatRounded(x * 100, p); },
    "r": formatRounded,
    "s": formatPrefixAuto,
    "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
    "x": function(x) { return Math.round(x).toString(16); }
  };


  // [[fill]align][sign][symbol][0][width][,][.precision][type]
  var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

  function formatSpecifier(specifier) {
    return new FormatSpecifier(specifier);
  }

  function FormatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

    var match,
        fill = match[1] || " ",
        align = match[2] || ">",
        sign = match[3] || "-",
        symbol = match[4] || "",
        zero = !!match[5],
        width = match[6] && +match[6],
        comma = !!match[7],
        precision = match[8] && +match[8].slice(1),
        type = match[9] || "";

    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";

    // Map invalid types to the default format.
    else if (!formatTypes[type]) type = "";

    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

    this.fill = fill;
    this.align = align;
    this.sign = sign;
    this.symbol = symbol;
    this.zero = zero;
    this.width = width;
    this.comma = comma;
    this.precision = precision;
    this.type = type;
  }

  FormatSpecifier.prototype.toString = function() {
    return this.fill
        + this.align
        + this.sign
        + this.symbol
        + (this.zero ? "0" : "")
        + (this.width == null ? "" : Math.max(1, this.width | 0))
        + (this.comma ? "," : "")
        + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
        + this.type;
  };

  function formatGroup(grouping, thousands) {
    return function(value, width) {
      var i = value.length,
          t = [],
          j = 0,
          g = grouping[0],
          length = 0;

      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      }

      return t.reverse().join(thousands);
    };
  }

  var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

  function identity(x) {
    return x;
  }

  function locale(locale) {
    var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity,
        currency = locale.currency,
        decimal = locale.decimal;

    function format(specifier) {
      specifier = formatSpecifier(specifier);

      var fill = specifier.fill,
          align = specifier.align,
          sign = specifier.sign,
          symbol = specifier.symbol,
          zero = specifier.zero,
          width = specifier.width,
          comma = specifier.comma,
          precision = specifier.precision,
          type = specifier.type;

      // Compute the prefix and suffix.
      // For SI-prefix, the suffix is lazily computed.
      var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
          suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";

      // What format function should we use?
      // Is this an integer type?
      // Can this type generate exponential notation?
      var formatType = formatTypes[type],
          maybeSuffix = !type || /[defgprs%]/.test(type);

      // Set the default precision if not specified,
      // or clamp the specified precision to the supported range.
      // For significant precision, it must be in [1, 21].
      // For fixed precision, it must be in [0, 20].
      precision = precision == null ? (type ? 6 : 12)
          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
          : Math.max(0, Math.min(20, precision));

      return function(value) {
        var valuePrefix = prefix,
            valueSuffix = suffix;

        if (type === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;

          // Convert negative to positive, and compute the prefix.
          // Note that -0 is not less than 0, but 1 / -0 is!
          var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);

          // Perform the initial formatting.
          value = formatType(value, precision);

          // Compute the prefix and suffix.
          valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

          // Break the formatted value into the integer “value” part that can be
          // grouped, and fractional or exponential “suffix” part that is not.
          if (maybeSuffix) {
            var i = -1, n = value.length, c;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }

        // If the fill character is not "0", grouping is applied before padding.
        if (comma && !zero) value = group(value, Infinity);

        // Compute the padding.
        var length = valuePrefix.length + value.length + valueSuffix.length,
            padding = length < width ? new Array(width - length + 1).join(fill) : "";

        // If the fill character is "0", grouping is applied after padding.
        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

        // Reconstruct the final output based on the desired alignment.
        switch (align) {
          case "<": return valuePrefix + value + valueSuffix + padding;
          case "=": return valuePrefix + padding + value + valueSuffix;
          case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
        }
        return padding + valuePrefix + value + valueSuffix;
      };
    }

    function formatPrefix(specifier, value) {
      var f = format((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
          e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
          k = Math.pow(10, -e),
          prefix = prefixes[8 + e / 3];
      return function(value) {
        return f(k * value) + prefix;
      };
    }

    return {
      format: format,
      formatPrefix: formatPrefix
    };
  }

  function precisionRound(step, max) {
    return Math.max(0, exponent(Math.abs(max)) - exponent(Math.abs(step))) + 1;
  }

  function precisionPrefix(step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
  }

  function precisionFixed(step) {
    return Math.max(0, -exponent(Math.abs(step)));
  }

  var localeDefinitions = (new Map)
      .set("ca-ES", caEs)
      .set("de-DE", deDe)
      .set("en-CA", enCa)
      .set("en-GB", enGb)
      .set("en-US", enUs)
      .set("es-ES", esEs)
      .set("fi-FI", fiFi)
      .set("fr-CA", frCa)
      .set("fr-FR", frFr)
      .set("he-IL", heIl)
      .set("it-IT", itIt)
      .set("mk-MK", mkMk)
      .set("nl-NL", nlNl)
      .set("pl-PL", plPl)
      .set("pt-BR", ptBr)
      .set("ru-RU", ruRu)
      .set("zh-CN", zhCn);

  var defaultLocale = locale(enUs);
  exports.format = defaultLocale.format;
  exports.formatPrefix = defaultLocale.formatPrefix;

  function localeFormat(definition) {
    if (typeof definition === "string") {
      definition = localeDefinitions.get(definition);
      if (!definition) return null;
    }
    return locale(definition);
  }
  ;

  exports.localeFormat = localeFormat;
  exports.formatSpecifier = formatSpecifier;
  exports.precisionFixed = precisionFixed;
  exports.precisionPrefix = precisionPrefix;
  exports.precisionRound = precisionRound;

}));
},{}],6:[function(require,module,exports){
if (typeof Map === "undefined") {
  Map = function() { this.clear(); };
  Map.prototype = {
    set: function(k, v) { this._[k] = v; return this; },
    get: function(k) { return this._[k]; },
    has: function(k) { return k in this._; },
    delete: function(k) { return k in this._ && delete this._[k]; },
    clear: function() { this._ = Object.create(null); },
    get size() { var n = 0; for (var k in this._) ++n; return n; },
    forEach: function(c) { for (var k in this._) c(this._[k], k, this); }
  };
} else (function() {
  var m = new Map;
  if (m.set(0, 0) !== m) {
    m = m.set;
    Map.prototype.set = function() { m.apply(this, arguments); return this; };
  }
})();

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.timeFormat = {}));
}(this, function (exports) { 'use strict';

  var zhCn = {
    dateTime: "%a %b %e %X %Y",
    date: "%Y/%-m/%-d",
    time: "%H:%M:%S",
    periods: ["上午", "下午"],
    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    shortDays: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    shortMonths: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
  };

  var ruRu = {
    dateTime: "%A, %e %B %Y г. %X",
    date: "%d.%m.%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
    shortDays: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
    months: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
    shortMonths: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
  };

  var ptBr = {
    dateTime: "%A, %e de %B de %Y. %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    shortDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    shortMonths: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
  };

  var plPl = {
    dateTime: "%A, %e %B %Y, %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"], // unused
    days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
    shortDays: ["Niedz.", "Pon.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob."],
    months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
    shortMonths: ["Stycz.", "Luty", "Marz.", "Kwie.", "Maj", "Czerw.", "Lipc.", "Sierp.", "Wrz.", "Paźdz.", "Listop.", "Grudz."]/* In Polish language abbraviated months are not commonly used so there is a dispute about the proper abbraviations. */
  };

  var nlNl = {
    dateTime: "%a %e %B %Y %T",
    date: "%d-%m-%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"], // unused
    days: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
    shortDays: ["zo", "ma", "di", "wo", "do", "vr", "za"],
    months: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
    shortMonths: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
  };

  var mkMk = {
    dateTime: "%A, %e %B %Y г. %X",
    date: "%d.%m.%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["недела", "понеделник", "вторник", "среда", "четврток", "петок", "сабота"],
    shortDays: ["нед", "пон", "вто", "сре", "чет", "пет", "саб"],
    months: ["јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември"],
    shortMonths: ["јан", "фев", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "ное", "дек"]
  };

  var itIt = {
    dateTime: "%A %e %B %Y, %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"], // unused
    days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
    shortDays: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
    months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
    shortMonths: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"]
  };

  var heIl = {
    dateTime: "%A, %e ב%B %Y %X",
    date: "%d.%m.%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
    shortDays: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"],
    months: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
    shortMonths: ["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני", "יולי", "אוג׳", "ספט׳", "אוק׳", "נוב׳", "דצמ׳"]
  };

  var frFr = {
    dateTime: "%A, le %e %B %Y, %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"], // unused
    days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    shortDays: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
    months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    shortMonths: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]
  };

  var frCa = {
    dateTime: "%a %e %b %Y %X",
    date: "%Y-%m-%d",
    time: "%H:%M:%S",
    periods: ["", ""],
    days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    shortDays: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
    months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    shortMonths: ["jan", "fév", "mar", "avr", "mai", "jui", "jul", "aoû", "sep", "oct", "nov", "déc"]
  };

  var fiFi = {
    dateTime: "%A, %-d. %Bta %Y klo %X",
    date: "%-d.%-m.%Y",
    time: "%H:%M:%S",
    periods: ["a.m.", "p.m."],
    days: ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"],
    shortDays: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
    months: ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
    shortMonths: ["Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä", "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"]
  };

  var esEs = {
    dateTime: "%A, %e de %B de %Y, %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
    shortDays: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    shortMonths: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
  };

  var enUs = {
    dateTime: "%a %b %e %X %Y",
    date: "%m/%d/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  };

  var enGb = {
    dateTime: "%a %e %b %X %Y",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  };

  var enCa = {
    dateTime: "%a %b %e %X %Y",
    date: "%Y-%m-%d",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  };

  var deDe = {
    dateTime: "%A, der %e. %B %Y, %X",
    date: "%d.%m.%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"], // unused
    days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    shortMonths: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
  };

  var caEs = {
    dateTime: "%A, %e de %B de %Y, %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"],
    shortDays: ["dg.", "dl.", "dt.", "dc.", "dj.", "dv.", "ds."],
    months: ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"],
    shortMonths: ["gen.", "febr.", "març", "abr.", "maig", "juny", "jul.", "ag.", "set.", "oct.", "nov.", "des."]
  };

  var t0 = new Date;
  var t1 = new Date;

  function newInterval(floori, offseti, count) {

    function interval(date) {
      return floori(date = new Date(+date)), date;
    }

    interval.floor = interval;

    interval.round = function(date) {
      var d0 = new Date(+date),
          d1 = new Date(date - 1);
      floori(d0), floori(d1), offseti(d1, 1);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), date;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [];
      start = new Date(start - 1);
      stop = new Date(+stop);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      offseti(start, 1), floori(start);
      if (start < stop) range.push(new Date(+start));
      while (offseti(start, step), floori(start), start < stop) range.push(new Date(+start));
      return range;
    };

    interval.filter = function(test) {
      return newInterval(function(date) {
        while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        while (--step >= 0) while (offseti(date, 1), !test(date));
      });
    };

    if (count) interval.count = function(start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };

    return interval;
  }

  var day = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 864e5;
  });

  function weekday(i) {
    return newInterval(function(date) {
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 6048e5;
    });
  }

  var sunday = weekday(0);
  var monday = weekday(1);

  var year = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setMonth(0, 1);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  });

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / 864e5;
  });

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / 6048e5;
    });
  }

  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);

  var utcYear = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCMonth(0, 1);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  });

  function localDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  function newYear(y) {
    return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
  }

  function locale(locale) {
    var locale_dateTime = locale.dateTime,
        locale_date = locale.date,
        locale_time = locale.time,
        locale_periods = locale.periods,
        locale_weekdays = locale.days,
        locale_shortWeekdays = locale.shortDays,
        locale_months = locale.months,
        locale_shortMonths = locale.shortMonths;

    var periodLookup = formatLookup(locale_periods),
        weekdayRe = formatRe(locale_weekdays),
        weekdayLookup = formatLookup(locale_weekdays),
        shortWeekdayRe = formatRe(locale_shortWeekdays),
        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
        monthRe = formatRe(locale_months),
        monthLookup = formatLookup(locale_months),
        shortMonthRe = formatRe(locale_shortMonths),
        shortMonthLookup = formatLookup(locale_shortMonths);

    var formats = {
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth,
      "e": formatDayOfMonth,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "S": formatSeconds,
      "U": formatWeekNumberSunday,
      "w": formatWeekdayNumber,
      "W": formatWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatYear,
      "Y": formatFullYear,
      "Z": formatZone,
      "%": formatLiteralPercent
    };

    var utcFormats = {
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth,
      "e": formatUTCDayOfMonth,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "S": formatUTCSeconds,
      "U": formatUTCWeekNumberSunday,
      "w": formatUTCWeekdayNumber,
      "W": formatUTCWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatUTCYear,
      "Y": formatUTCFullYear,
      "Z": formatUTCZone,
      "%": formatLiteralPercent
    };

    var parses = {
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth,
      "e": parseDayOfMonth,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "S": parseSeconds,
      "U": parseWeekNumberSunday,
      "w": parseWeekdayNumber,
      "W": parseWeekNumberMonday,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear,
      "Y": parseFullYear,
      "Z": parseZone,
      "%": parseLiteralPercent
    };

    // These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);

    function newFormat(specifier, formats) {
      return function(date) {
        var string = [],
            i = -1,
            j = 0,
            n = specifier.length,
            c,
            pad,
            format;

        while (++i < n) {
          if (specifier.charCodeAt(i) === 37) {
            string.push(specifier.slice(j, i));
            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
            if (format = formats[c]) c = format(date, pad == null ? (c === "e" ? " " : "0") : pad);
            string.push(c);
            j = i + 1;
          }
        }

        string.push(specifier.slice(j, i));
        return string.join("");
      };
    }

    function newParse(specifier, newDate) {
      return function(string) {
        var d = newYear(1900),
            i = parseSpecifier(d, specifier, string, 0);
        if (i != string.length) return null;

        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;

        // If a time zone is specified, all fields are interpreted as UTC and then
        // offset according to the specified time zone.
        if ("Z" in d) {
          if ("w" in d && ("W" in d || "U" in d)) {
            var day = utcDate(newYear(d.y)).getUTCDay();
            if ("W" in d) d.U = d.W, d.w = (d.w + 6) % 7, --day;
            d.m = 0;
            d.d = d.w + d.U * 7 - (day + 6) % 7;
          }
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate(d);
        }

        // Otherwise, all fields are in local time.
        if ("w" in d && ("W" in d || "U" in d)) {
          var day = newDate(newYear(d.y)).getDay();
          if ("W" in d) d.U = d.W, d.w = (d.w + 6) % 7, --day;
          d.m = 0;
          d.d = d.w + d.U * 7 - (day + 6) % 7;
        }
        return newDate(d);
      };
    }

    function parseSpecifier(d, specifier, string, j) {
      var i = 0,
          n = specifier.length,
          m = string.length,
          c,
          parse;

      while (i < n) {
        if (j >= m) return -1;
        c = specifier.charCodeAt(i++);
        if (c === 37) {
          c = specifier.charAt(i++);
          parse = parses[c in pads ? specifier.charAt(i++) : c];
          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }

      return j;
    }

    function parseShortWeekday(d, string, i) {
      var n = shortWeekdayRe.exec(string.slice(i));
      return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseWeekday(d, string, i) {
      var n = weekdayRe.exec(string.slice(i));
      return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseShortMonth(d, string, i) {
      var n = shortMonthRe.exec(string.slice(i));
      return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseMonth(d, string, i) {
      var n = monthRe.exec(string.slice(i));
      return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseLocaleDateTime(d, string, i) {
      return parseSpecifier(d, locale_dateTime, string, i);
    }

    function parseLocaleDate(d, string, i) {
      return parseSpecifier(d, locale_date, string, i);
    }

    function parseLocaleTime(d, string, i) {
      return parseSpecifier(d, locale_time, string, i);
    }

    function parsePeriod(d, string, i) {
      var n = periodLookup.get(string.slice(i, i += 2).toLowerCase());
      return n == null ? -1 : (d.p = n, i);
    }

    function formatShortWeekday(d) {
      return locale_shortWeekdays[d.getDay()];
    }

    function formatWeekday(d) {
      return locale_weekdays[d.getDay()];
    }

    function formatShortMonth(d) {
      return locale_shortMonths[d.getMonth()];
    }

    function formatMonth(d) {
      return locale_months[d.getMonth()];
    }

    function formatPeriod(d) {
      return locale_periods[+(d.getHours() >= 12)];
    }

    function formatUTCShortWeekday(d) {
      return locale_shortWeekdays[d.getUTCDay()];
    }

    function formatUTCWeekday(d) {
      return locale_weekdays[d.getUTCDay()];
    }

    function formatUTCShortMonth(d) {
      return locale_shortMonths[d.getUTCMonth()];
    }

    function formatUTCMonth(d) {
      return locale_months[d.getUTCMonth()];
    }

    function formatUTCPeriod(d) {
      return locale_periods[+(d.getUTCHours() >= 12)];
    }

    return {
      format: function(specifier) {
        var f = newFormat(specifier += "", formats);
        f.parse = newParse(specifier, localDate);
        f.toString = function() { return specifier; };
        return f;
      },
      utcFormat: function(specifier) {
        var f = newFormat(specifier += "", utcFormats);
        f.parse = newParse(specifier, utcDate);
        f.toString = function() { return specifier; };
        return f;
      }
    };
  }

  var pads = {"-": "", "_": " ", "0": "0"};
  var numberRe = /^\s*\d+/;
  var percentRe = /^%/;
  var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

  function pad(value, fill, width) {
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  function requote(s) {
    return s.replace(requoteRe, "\\$&");
  }

  function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }

  function formatLookup(names) {
    var map = new Map, i = -1, n = names.length;
    while (++i < n) map.set(names[i].toLowerCase(), i);
    return map;
  }

  function parseWeekdayNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
  }

  function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  }

  function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  }

  function parseZone(d, string, i) {
    return /^[+-]\d{4}$/.test(string = string.slice(i, i + 5))
        ? (d.Z = -string, i + 5) // sign differs from getTimezoneOffset!
        : -1;
  }

  function parseMonthNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  }

  function parseDayOfMonth(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
  }

  function parseDayOfYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  }

  function parseHour24(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
  }

  function parseMinutes(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
  }

  function parseSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
  }

  function parseMilliseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
  }

  function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function formatDayOfMonth(d, p) {
    return pad(d.getDate(), p, 2);
  }

  function formatHour24(d, p) {
    return pad(d.getHours(), p, 2);
  }

  function formatHour12(d, p) {
    return pad(d.getHours() % 12 || 12, p, 2);
  }

  function formatDayOfYear(d, p) {
    return pad(1 + day.count(year(d), d), p, 3);
  }

  function formatMilliseconds(d, p) {
    return pad(d.getMilliseconds(), p, 3);
  }

  function formatMonthNumber(d, p) {
    return pad(d.getMonth() + 1, p, 2);
  }

  function formatMinutes(d, p) {
    return pad(d.getMinutes(), p, 2);
  }

  function formatSeconds(d, p) {
    return pad(d.getSeconds(), p, 2);
  }

  function formatWeekNumberSunday(d, p) {
    return pad(sunday.count(year(d), d), p, 2);
  }

  function formatWeekdayNumber(d) {
    return d.getDay();
  }

  function formatWeekNumberMonday(d, p) {
    return pad(monday.count(year(d), d), p, 2);
  }

  function formatYear(d, p) {
    return pad(d.getFullYear() % 100, p, 2);
  }

  function formatFullYear(d, p) {
    return pad(d.getFullYear() % 10000, p, 4);
  }

  function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+"))
        + pad(z / 60 | 0, "0", 2)
        + pad(z % 60, "0", 2);
  }

  function formatUTCDayOfMonth(d, p) {
    return pad(d.getUTCDate(), p, 2);
  }

  function formatUTCHour24(d, p) {
    return pad(d.getUTCHours(), p, 2);
  }

  function formatUTCHour12(d, p) {
    return pad(d.getUTCHours() % 12 || 12, p, 2);
  }

  function formatUTCDayOfYear(d, p) {
    return pad(1 + utcDay.count(utcYear(d), d), p, 3);
  }

  function formatUTCMilliseconds(d, p) {
    return pad(d.getUTCMilliseconds(), p, 3);
  }

  function formatUTCMonthNumber(d, p) {
    return pad(d.getUTCMonth() + 1, p, 2);
  }

  function formatUTCMinutes(d, p) {
    return pad(d.getUTCMinutes(), p, 2);
  }

  function formatUTCSeconds(d, p) {
    return pad(d.getUTCSeconds(), p, 2);
  }

  function formatUTCWeekNumberSunday(d, p) {
    return pad(utcSunday.count(utcYear(d), d), p, 2);
  }

  function formatUTCWeekdayNumber(d) {
    return d.getUTCDay();
  }

  function formatUTCWeekNumberMonday(d, p) {
    return pad(utcMonday.count(utcYear(d), d), p, 2);
  }

  function formatUTCYear(d, p) {
    return pad(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCFullYear(d, p) {
    return pad(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCZone() {
    return "+0000";
  }

  function formatLiteralPercent() {
    return "%";
  }

  var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

  function formatIsoNative(date) {
    return date.toISOString();
  }

  formatIsoNative.parse = function(string) {
    var date = new Date(string);
    return isNaN(date) ? null : date;
  };

  formatIsoNative.toString = function() {
    return isoSpecifier;
  };

  var formatIso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z")
      ? formatIsoNative
      : enUs.utcFormat(isoSpecifier);

  var isoFormat = formatIso;

  var localeDefinitions = (new Map)
      .set("ca-ES", caEs)
      .set("de-DE", deDe)
      .set("en-CA", enCa)
      .set("en-GB", enGb)
      .set("en-US", enUs)
      .set("es-ES", esEs)
      .set("fi-FI", fiFi)
      .set("fr-CA", frCa)
      .set("fr-FR", frFr)
      .set("he-IL", heIl)
      .set("it-IT", itIt)
      .set("mk-MK", mkMk)
      .set("nl-NL", nlNl)
      .set("pl-PL", plPl)
      .set("pt-BR", ptBr)
      .set("ru-RU", ruRu)
      .set("zh-CN", zhCn);

  var defaultLocale = locale(enUs);
  exports.format = defaultLocale.format;
  exports.utcFormat = defaultLocale.utcFormat;

  function localeFormat(definition) {
    if (typeof definition === "string") {
      definition = localeDefinitions.get(definition);
      if (!definition) return null;
    }
    return locale(definition);
  }
  ;

  exports.localeFormat = localeFormat;
  exports.isoFormat = isoFormat;

}));
},{}],7:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.time = {}));
}(this, function (exports) { 'use strict';

  var t1 = new Date;

  var t0 = new Date;

  function newInterval(floori, offseti, count) {

    function interval(date) {
      return floori(date = new Date(+date)), date;
    }

    interval.floor = interval;

    interval.round = function(date) {
      var d0 = new Date(+date),
          d1 = new Date(date - 1);
      floori(d0), floori(d1), offseti(d1, 1);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), date;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [];
      start = new Date(start - 1);
      stop = new Date(+stop);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      offseti(start, 1), floori(start);
      if (start < stop) range.push(new Date(+start));
      while (offseti(start, step), floori(start), start < stop) range.push(new Date(+start));
      return range;
    };

    interval.filter = function(test) {
      return newInterval(function(date) {
        while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        while (--step >= 0) while (offseti(date, 1), !test(date));
      });
    };

    if (count) interval.count = function(start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };

    return interval;
  }

  var second = newInterval(function(date) {
    date.setMilliseconds(0);
  }, function(date, step) {
    date.setTime(+date + step * 1e3);
  }, function(start, end) {
    return (end - start) / 1e3;
  });

  exports.seconds = second.range;

  var minute = newInterval(function(date) {
    date.setSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 6e4);
  }, function(start, end) {
    return (end - start) / 6e4;
  });

  exports.minutes = minute.range;

  var hour = newInterval(function(date) {
    date.setMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 36e5);
  }, function(start, end) {
    return (end - start) / 36e5;
  });

  exports.hours = hour.range;

  var day = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 864e5;
  });

  exports.days = day.range;

  function weekday(i) {
    return newInterval(function(date) {
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 6048e5;
    });
  }

  exports.sunday = weekday(0);

  exports.sundays = exports.sunday.range;

  exports.monday = weekday(1);

  exports.mondays = exports.monday.range;

  exports.tuesday = weekday(2);

  exports.tuesdays = exports.tuesday.range;

  exports.wednesday = weekday(3);

  exports.wednesdays = exports.wednesday.range;

  exports.thursday = weekday(4);

  exports.thursdays = exports.thursday.range;

  exports.friday = weekday(5);

  exports.fridays = exports.friday.range;

  exports.saturday = weekday(6);

  exports.saturdays = exports.saturday.range;

  var week = exports.sunday;

  exports.weeks = week.range;

  var month = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setDate(1);
  }, function(date, step) {
    date.setMonth(date.getMonth() + step);
  }, function(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  });

  exports.months = month.range;

  var year = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setMonth(0, 1);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  });

  exports.years = year.range;

  var utcSecond = newInterval(function(date) {
    date.setUTCMilliseconds(0);
  }, function(date, step) {
    date.setTime(+date + step * 1e3);
  }, function(start, end) {
    return (end - start) / 1e3;
  });

  exports.utcSeconds = utcSecond.range;

  var utcMinute = newInterval(function(date) {
    date.setUTCSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 6e4);
  }, function(start, end) {
    return (end - start) / 6e4;
  });

  exports.utcMinutes = utcMinute.range;

  var utcHour = newInterval(function(date) {
    date.setUTCMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 36e5);
  }, function(start, end) {
    return (end - start) / 36e5;
  });

  exports.utcHours = utcHour.range;

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / 864e5;
  });

  exports.utcDays = utcDay.range;

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / 6048e5;
    });
  }

  exports.utcSunday = utcWeekday(0);

  exports.utcSundays = exports.utcSunday.range;

  exports.utcMonday = utcWeekday(1);

  exports.utcMondays = exports.utcMonday.range;

  exports.utcTuesday = utcWeekday(2);

  exports.utcTuesdays = exports.utcTuesday.range;

  exports.utcWednesday = utcWeekday(3);

  exports.utcWednesdays = exports.utcWednesday.range;

  exports.utcThursday = utcWeekday(4);

  exports.utcThursdays = exports.utcThursday.range;

  exports.utcFriday = utcWeekday(5);

  exports.utcFridays = exports.utcFriday.range;

  exports.utcSaturday = utcWeekday(6);

  exports.utcSaturdays = exports.utcSaturday.range;

  var utcWeek = exports.utcSunday;

  exports.utcWeeks = utcWeek.range;

  var utcMonth = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(1);
  }, function(date, step) {
    date.setUTCMonth(date.getUTCMonth() + step);
  }, function(start, end) {
    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
  });

  exports.utcMonths = utcMonth.range;

  var utcYear = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCMonth(0, 1);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  });

  exports.utcYears = utcYear.range;

  exports.interval = newInterval;
  exports.second = second;
  exports.minute = minute;
  exports.hour = hour;
  exports.day = day;
  exports.week = week;
  exports.month = month;
  exports.year = year;
  exports.utcSecond = utcSecond;
  exports.utcMinute = utcMinute;
  exports.utcHour = utcHour;
  exports.utcDay = utcDay;
  exports.utcWeek = utcWeek;
  exports.utcMonth = utcMonth;
  exports.utcYear = utcYear;

}));
},{}],8:[function(require,module,exports){
var util = require('../util'),
    time = require('../time'),
    EPSILON = 1e-15;

function bins(opt) {
  if (!opt) { throw Error("Missing binning options."); }

  // determine range
  var maxb = opt.maxbins || 15,
      base = opt.base || 10,
      logb = Math.log(base),
      div = opt.div || [5, 2],      
      min = opt.min,
      max = opt.max,
      span = max - min,
      step, level, minstep, precision, v, i, eps;

  if (opt.step) {
    // if step size is explicitly given, use that
    step = opt.step;
  } else if (opt.steps) {
    // if provided, limit choice to acceptable step sizes
    step = opt.steps[Math.min(
      opt.steps.length - 1,
      bisect(opt.steps, span/maxb, 0, opt.steps.length)
    )];
  } else {
    // else use span to determine step size
    level = Math.ceil(Math.log(maxb) / logb);
    minstep = opt.minstep || 0;
    step = Math.max(
      minstep,
      Math.pow(base, Math.round(Math.log(span) / logb) - level)
    );
    
    // increase step size if too many bins
    do { step *= base; } while (Math.ceil(span/step) > maxb);

    // decrease step size if allowed
    for (i=0; i<div.length; ++i) {
      v = step / div[i];
      if (v >= minstep && span / v <= maxb) step = v;
    }
  }

  // update precision, min and max
  v = Math.log(step);
  precision = v >= 0 ? 0 : ~~(-v / logb) + 1;
  eps = Math.pow(base, -precision - 1);
  min = Math.min(min, Math.floor(min / step + eps) * step);
  max = Math.ceil(max / step) * step;

  return {
    start: min,
    stop:  max,
    step:  step,
    unit:  {precision: precision},
    value: value,
    index: index
  };
}

function bisect(a, x, lo, hi) {
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (util.cmp(a[mid], x) < 0) { lo = mid + 1; }
    else { hi = mid; }
  }
  return lo;
}

function value(v) {
  return this.step * Math.floor(v / this.step + EPSILON);
}

function index(v) {
  return Math.floor((v - this.start) / this.step + EPSILON);
}

function date_value(v) {
  return this.unit.date(value.call(this, v));
}

function date_index(v) {
  return index.call(this, this.unit.unit(v));
}

bins.date = function(opt) {
  if (!opt) { throw Error("Missing date binning options."); }

  // find time step, then bin
  var units = opt.utc ? time.utc : time,
      dmin = opt.min,
      dmax = opt.max,
      maxb = opt.maxbins || 20,
      minb = opt.minbins || 4,
      span = (+dmax) - (+dmin),
      unit = opt.unit ? units[opt.unit] : units.find(span, minb, maxb),
      spec = bins({
        min:     unit.min != null ? unit.min : unit.unit(dmin),
        max:     unit.max != null ? unit.max : unit.unit(dmax),
        maxbins: maxb,
        minstep: unit.minstep,
        steps:   unit.step
      });

  spec.unit = unit;
  spec.index = date_index;
  if (!opt.raw) spec.value = date_value;
  return spec;
};

module.exports = bins;

},{"../time":12,"../util":13}],9:[function(require,module,exports){
var gen = module.exports = {};

gen.repeat = function(val, n) {
  var a = Array(n), i;
  for (i=0; i<n; ++i) a[i] = val;
  return a;
};

gen.zeros = function(n) {
  return gen.repeat(0, n);
};

gen.range = function(start, stop, step) {
  if (arguments.length < 3) {
    step = 1;
    if (arguments.length < 2) {
      stop = start;
      start = 0;
    }
  }
  if ((stop - start) / step == Infinity) throw new Error('Infinite range');
  var range = [], i = -1, j;
  if (step < 0) while ((j = start + step * ++i) > stop) range.push(j);
  else while ((j = start + step * ++i) < stop) range.push(j);
  return range;
};

gen.random = {};

gen.random.uniform = function(min, max) {
  if (max === undefined) {
    max = min === undefined ? 1 : min;
    min = 0;
  }
  var d = max - min;
  var f = function() {
    return min + d * Math.random();
  };
  f.samples = function(n) { return gen.zeros(n).map(f); };
  return f;
};

gen.random.integer = function(a, b) {
  if (b === undefined) {
    b = a;
    a = 0;
  }
  var d = b - a;
  var f = function() {
    return a + Math.floor(d * Math.random());
  };
  f.samples = function(n) { return gen.zeros(n).map(f); };
  return f;
};

gen.random.normal = function(mean, stdev) {
  mean = mean || 0;
  stdev = stdev || 1;
  var next;
  var f = function() {
    var x = 0, y = 0, rds, c;
    if (next !== undefined) {
      x = next;
      next = undefined;
      return x;
    }
    do {
      x = Math.random()*2-1;
      y = Math.random()*2-1;
      rds = x*x + y*y;
    } while (rds === 0 || rds > 1);
    c = Math.sqrt(-2*Math.log(rds)/rds); // Box-Muller transform
    next = mean + y*c*stdev;
    return mean + x*c*stdev;
  };
  f.samples = function(n) { return gen.zeros(n).map(f); };
  return f;
};
},{}],10:[function(require,module,exports){
var util = require('../util');

var TYPES = '__types__';

var PARSERS = {
  boolean: util.boolean,
  integer: util.number,
  number:  util.number,
  date:    util.date,
  string:  function(x) { return x==='' ? null : x; }
};

var TESTS = {
  boolean: function(x) { return x==='true' || x==='false' || util.isBoolean(x); },
  integer: function(x) { return TESTS.number(x) && (x=+x) === ~~x; },
  number: function(x) { return !isNaN(+x) && !util.isDate(x); },
  date: function(x) { return !isNaN(Date.parse(x)); }
};

function annotation(data, types) {
  if (!types) return data && data[TYPES] || null;
  data[TYPES] = types;
}

function type(values, f) {
  f = util.$(f);
  var v, i, n;

  // if data array has type annotations, use them
  if (values[TYPES]) {
    v = f(values[TYPES]);
    if (util.isString(v)) return v;
  }

  for (i=0, n=values.length; !util.isValid(v) && i<n; ++i) {
    v = f ? f(values[i]) : values[i];
  }

  return util.isDate(v) ? 'date' :
    util.isNumber(v)    ? 'number' :
    util.isBoolean(v)   ? 'boolean' :
    util.isString(v)    ? 'string' : null;
}

function typeAll(data, fields) {
  if (!data.length) return;
  fields = fields || util.keys(data[0]);
  return fields.reduce(function(types, f) {
    return (types[f] = type(data, f), types);
  }, {});
}

function infer(values, f) {
  f = util.$(f);
  var i, j, v;

  // types to test for, in precedence order
  var types = ['boolean', 'integer', 'number', 'date'];

  for (i=0; i<values.length; ++i) {
    // get next value to test
    v = f ? f(values[i]) : values[i];
    // test value against remaining types
    for (j=0; j<types.length; ++j) {
      if (util.isValid(v) && !TESTS[types[j]](v)) {
        types.splice(j, 1);
        j -= 1;
      }
    }
    // if no types left, return 'string'
    if (types.length === 0) return 'string';
  }

  return types[0];
}

function inferAll(data, fields) {
  fields = fields || util.keys(data[0]);
  return fields.reduce(function(types, f) {
    types[f] = infer(data, f);
    return types;
  }, {});
}

type.annotation = annotation;
type.all = typeAll;
type.infer = infer;
type.inferAll = inferAll;
type.parsers = PARSERS;
module.exports = type;
},{"../util":13}],11:[function(require,module,exports){
var util = require('./util');
var type = require('./import/type');
var gen = require('./generate');
var stats = {};

// Collect unique values.
// Output: an array of unique values, in first-observed order
stats.unique = function(values, f, results) {
  f = util.$(f);
  results = results || [];
  var u = {}, v, i, n;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v in u) continue;
    u[v] = 1;
    results.push(v);
  }
  return results;
};

// Return the length of the input array.
stats.count = function(values) {
  return values && values.length || 0;
};

// Count the number of non-null, non-undefined, non-NaN values.
stats.count.valid = function(values, f) {
  f = util.$(f);
  var v, i, n, valid = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) valid += 1;
  }
  return valid;
};

// Count the number of null or undefined values.
stats.count.missing = function(values, f) {
  f = util.$(f);
  var v, i, n, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v == null) count += 1;
  }
  return count;
};

// Count the number of distinct values.
// Null, undefined and NaN are each considered distinct values.
stats.count.distinct = function(values, f) {
  f = util.$(f);
  var u = {}, v, i, n, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v in u) continue;
    u[v] = 1;
    count += 1;
  }
  return count;
};

// Construct a map from distinct values to occurrence counts.
stats.count.map = function(values, f) {
  f = util.$(f);
  var map = {}, v, i, n;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    map[v] = (v in map) ? map[v] + 1 : 1;
  }
  return map;
};

// Compute the median of an array of numbers.
stats.median = function(values, f) {
  if (f) values = values.map(util.$(f));
  values = values.filter(util.isValid).sort(util.cmp);
  return stats.quantile(values, 0.5);
};

// Computes the quartile boundaries of an array of numbers.
stats.quartile = function(values, f) {
  if (f) values = values.map(util.$(f));
  values = values.filter(util.isValid).sort(util.cmp);
  var q = stats.quantile;
  return [q(values, 0.25), q(values, 0.50), q(values, 0.75)];
};

// Compute the quantile of a sorted array of numbers.
// Adapted from the D3.js implementation.
stats.quantile = function(values, f, p) {
  if (p === undefined) { p = f; f = util.identity; }
  f = util.$(f);
  var H = (values.length - 1) * p + 1,
      h = Math.floor(H),
      v = +f(values[h - 1]),
      e = H - h;
  return e ? v + e * (f(values[h]) - v) : v;
};

// Compute the sum of an array of numbers.
stats.sum = function(values, f) {
  f = util.$(f);
  for (var sum=0, i=0, n=values.length, v; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) sum += v;
  }
  return sum;
};

// Compute the mean (average) of an array of numbers.
stats.mean = function(values, f) {
  f = util.$(f);
  var mean = 0, delta, i, n, c, v;
  for (i=0, c=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      delta = v - mean;
      mean = mean + delta / (++c);
    }
  }
  return mean;
};

// Compute the sample variance of an array of numbers.
stats.variance = function(values, f) {
  f = util.$(f);
  if (!util.isArray(values) || values.length < 2) return 0;
  var mean = 0, M2 = 0, delta, i, c, v;
  for (i=0, c=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      delta = v - mean;
      mean = mean + delta / (++c);
      M2 = M2 + delta * (v - mean);
    }
  }
  M2 = M2 / (c - 1);
  return M2;
};

// Compute the sample standard deviation of an array of numbers.
stats.stdev = function(values, f) {
  return Math.sqrt(stats.variance(values, f));
};

// Compute the Pearson mode skewness ((median-mean)/stdev) of an array of numbers.
stats.modeskew = function(values, f) {
  var avg = stats.mean(values, f),
      med = stats.median(values, f),
      std = stats.stdev(values, f);
  return std === 0 ? 0 : (avg - med) / std;
};

// Find the minimum value in an array.
stats.min = function(values, f) {
  return stats.extent(values, f)[0];
};

// Find the maximum value in an array.
stats.max = function(values, f) {
  return stats.extent(values, f)[1];
};

// Find the minimum and maximum of an array of values.
stats.extent = function(values, f) {
  f = util.$(f);
  var a, b, v, i, n = values.length;
  for (i=0; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) { a = b = v; break; }
  }
  for (; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      if (v < a) a = v;
      if (v > b) b = v;
    }
  }
  return [a, b];
};

// Find the integer indices of the minimum and maximum values.
stats.extent.index = function(values, f) {
  f = util.$(f);
  var x = -1, y = -1, a, b, v, i, n = values.length;
  for (i=0; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) { a = b = v; x = y = i; break; }
  }
  for (; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      if (v < a) { a = v; x = i; }
      if (v > b) { b = v; y = i; }
    }
  }
  return [x, y];
};

// Compute the dot product of two arrays of numbers.
stats.dot = function(values, a, b) {
  var sum = 0, i, v;
  if (!b) {
    if (values.length !== a.length) {
      throw Error('Array lengths must match.');
    }
    for (i=0; i<values.length; ++i) {
      v = values[i] * a[i];
      if (v === v) sum += v;
    }
  } else {
    a = util.$(a);
    b = util.$(b);
    for (i=0; i<values.length; ++i) {
      v = a(values[i]) * b(values[i]);
      if (v === v) sum += v;
    }
  }
  return sum;
};

// Compute ascending rank scores for an array of values.
// Ties are assigned their collective mean rank.
stats.rank = function(values, f) {
  f = util.$(f) || util.identity;
  var a = values.map(function(v, i) {
      return {idx: i, val: f(v)};
    })
    .sort(util.comparator('val'));

  var n = values.length,
      r = Array(n),
      tie = -1, p = {}, i, v, mu;

  for (i=0; i<n; ++i) {
    v = a[i].val;
    if (tie < 0 && p === v) {
      tie = i - 1;
    } else if (tie > -1 && p !== v) {
      mu = 1 + (i-1 + tie) / 2;
      for (; tie<i; ++tie) r[a[tie].idx] = mu;
      tie = -1;
    }
    r[a[i].idx] = i + 1;
    p = v;
  }

  if (tie > -1) {
    mu = 1 + (n-1 + tie) / 2;
    for (; tie<n; ++tie) r[a[tie].idx] = mu;
  }

  return r;
};

// Compute the sample Pearson product-moment correlation of two arrays of numbers.
stats.cor = function(values, a, b) {
  var fn = b;
  b = fn ? values.map(util.$(b)) : a;
  a = fn ? values.map(util.$(a)) : values;

  var dot = stats.dot(a, b),
      mua = stats.mean(a),
      mub = stats.mean(b),
      sda = stats.stdev(a),
      sdb = stats.stdev(b),
      n = values.length;

  return (dot - n*mua*mub) / ((n-1) * sda * sdb);
};

// Compute the Spearman rank correlation of two arrays of values.
stats.cor.rank = function(values, a, b) {
  var ra = b ? stats.rank(values, util.$(a)) : stats.rank(values),
      rb = b ? stats.rank(values, util.$(b)) : stats.rank(a),
      n = values.length, i, s, d;

  for (i=0, s=0; i<n; ++i) {
    d = ra[i] - rb[i];
    s += d * d;
  }

  return 1 - 6*s / (n * (n*n-1));
};

// Compute the distance correlation of two arrays of numbers.
// http://en.wikipedia.org/wiki/Distance_correlation
stats.cor.dist = function(values, a, b) {
  var X = b ? values.map(util.$(a)) : values,
      Y = b ? values.map(util.$(b)) : a;

  var A = stats.dist.mat(X),
      B = stats.dist.mat(Y),
      n = A.length,
      i, aa, bb, ab;

  for (i=0, aa=0, bb=0, ab=0; i<n; ++i) {
    aa += A[i]*A[i];
    bb += B[i]*B[i];
    ab += A[i]*B[i];
  }

  return Math.sqrt(ab / Math.sqrt(aa*bb));
};

// Compute the vector distance between two arrays of numbers.
// Default is Euclidean (exp=2) distance, configurable via exp argument.
stats.dist = function(values, a, b, exp) {
  var f = util.isFunction(b) || util.isString(b),
      X = values,
      Y = f ? values : a,
      e = f ? exp : b,
      L2 = e === 2 || e == null,
      n = values.length, s = 0, d, i;
  if (f) {
    a = util.$(a);
    b = util.$(b);
  }
  for (i=0; i<n; ++i) {
    d = f ? (a(X[i])-b(Y[i])) : (X[i]-Y[i]);
    s += L2 ? d*d : Math.pow(Math.abs(d), e);
  }
  return L2 ? Math.sqrt(s) : Math.pow(s, 1/e);
};

// Construct a mean-centered distance matrix for an array of numbers.
stats.dist.mat = function(X) {
  var n = X.length,
      m = n*n,
      A = Array(m),
      R = gen.zeros(n),
      M = 0, v, i, j;

  for (i=0; i<n; ++i) {
    A[i*n+i] = 0;
    for (j=i+1; j<n; ++j) {
      A[i*n+j] = (v = Math.abs(X[i] - X[j]));
      A[j*n+i] = v;
      R[i] += v;
      R[j] += v;
    }
  }

  for (i=0; i<n; ++i) {
    M += R[i];
    R[i] /= n;
  }
  M /= m;

  for (i=0; i<n; ++i) {
    for (j=i; j<n; ++j) {
      A[i*n+j] += M - R[i] - R[j];
      A[j*n+i] = A[i*n+j];
    }
  }

  return A;
};

// Compute the Shannon entropy (log base 2) of an array of counts.
stats.entropy = function(counts, f) {
  f = util.$(f);
  var i, p, s = 0, H = 0, n = counts.length;
  for (i=0; i<n; ++i) {
    s += (f ? f(counts[i]) : counts[i]);
  }
  if (s === 0) return 0;
  for (i=0; i<n; ++i) {
    p = (f ? f(counts[i]) : counts[i]) / s;
    if (p) H += p * Math.log(p);
  }
  return -H / Math.LN2;
};

// Compute the mutual information between two discrete variables.
// Returns an array of the form [MI, MI_distance] 
// MI_distance is defined as 1 - I(a,b) / H(a,b).
// http://en.wikipedia.org/wiki/Mutual_information
stats.mutual = function(values, a, b, counts) {
  var x = counts ? values.map(util.$(a)) : values,
      y = counts ? values.map(util.$(b)) : a,
      z = counts ? values.map(util.$(counts)) : b;

  var px = {},
      py = {},
      n = z.length,
      s = 0, I = 0, H = 0, p, t, i;

  for (i=0; i<n; ++i) {
    px[x[i]] = 0;
    py[y[i]] = 0;
  }

  for (i=0; i<n; ++i) {
    px[x[i]] += z[i];
    py[y[i]] += z[i];
    s += z[i];
  }

  t = 1 / (s * Math.LN2);
  for (i=0; i<n; ++i) {
    if (z[i] === 0) continue;
    p = (s * z[i]) / (px[x[i]] * py[y[i]]);
    I += z[i] * t * Math.log(p);
    H += z[i] * t * Math.log(z[i]/s);
  }

  return [I, 1 + I/H];
};

// Compute the mutual information between two discrete variables.
stats.mutual.info = function(values, a, b, counts) {
  return stats.mutual(values, a, b, counts)[0];
};

// Compute the mutual information distance between two discrete variables.
// MI_distance is defined as 1 - I(a,b) / H(a,b).
stats.mutual.dist = function(values, a, b, counts) {
  return stats.mutual(values, a, b, counts)[1];
};

// Compute a profile of summary statistics for a variable.
stats.profile = function(values, f) {
  var mean = 0,
      valid = 0,
      missing = 0,
      distinct = 0,
      min = null,
      max = null,
      M2 = 0,
      vals = [],
      u = {}, delta, sd, i, v, x;

  // compute summary stats
  for (i=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];

    // update unique values
    u[v] = (v in u) ? u[v] + 1 : (distinct += 1, 1);

    if (v == null) {
      ++missing;
    } else if (util.isValid(v)) {
      // update stats
      x = (typeof v === 'string') ? v.length : v;
      if (min===null || x < min) min = x;
      if (max===null || x > max) max = x;
      delta = x - mean;
      mean = mean + delta / (++valid);
      M2 = M2 + delta * (x - mean);
      vals.push(x);
    }
  }
  M2 = M2 / (valid - 1);
  sd = Math.sqrt(M2);

  // sort values for median and iqr
  vals.sort(util.cmp);

  return {
    type:     type(values, f),
    unique:   u,
    count:    values.length,
    valid:    valid,
    missing:  missing,
    distinct: distinct,
    min:      min,
    max:      max,
    mean:     mean,
    stdev:    sd,
    median:   (v = stats.quantile(vals, 0.5)),
    q1:       stats.quantile(vals, 0.25),
    q3:       stats.quantile(vals, 0.75),
    modeskew: sd === 0 ? 0 : (mean - v) / sd
  };
};

// Compute profiles for all variables in a data set.
stats.summary = function(data, fields) {
  fields = fields || util.keys(data[0]);
  var s = fields.map(function(f) {
    var p = stats.profile(data, util.$(f));
    return (p.field = f, p);
  });
  return (s.__summary__ = true, s);
};

module.exports = stats;
},{"./generate":9,"./import/type":10,"./util":13}],12:[function(require,module,exports){
var d3_time = require('d3-time');

var tempDate = new Date(),
    baseDate = new Date(0, 0, 1).setFullYear(0), // Jan 1, 0 AD
    utcBaseDate = new Date(Date.UTC(0, 0, 1)).setUTCFullYear(0);

function date(d) {
  return (tempDate.setTime(+d), tempDate);
}

// create a time unit entry
function entry(type, date, unit, step, min, max) {
  var e = {
    type: type,
    date: date,
    unit: unit
  };
  if (step) {
    e.step = step;
  } else {
    e.minstep = 1;
  }
  if (min != null) e.min = min;
  if (max != null) e.max = max;
  return e;
}

function create(type, unit, base, step, min, max) {
  return entry(type,
    function(d) { return unit.offset(base, d); },
    function(d) { return unit.count(base, d); },
    step, min, max);
}

var locale = [
  create('second', d3_time.second, baseDate),
  create('minute', d3_time.minute, baseDate),
  create('hour',   d3_time.hour,   baseDate),
  create('day',    d3_time.day,    baseDate, [1, 7]),
  create('month',  d3_time.month,  baseDate, [1, 3, 6]),
  create('year',   d3_time.year,   baseDate),

  // periodic units
  entry('seconds',
    function(d) { return new Date(1970, 0, 1, 0, 0, d); },
    function(d) { return date(d).getSeconds(); },
    null, 0, 59
  ),
  entry('minutes',
    function(d) { return new Date(1970, 0, 1, 0, d); },
    function(d) { return date(d).getMinutes(); },
    null, 0, 59
  ),
  entry('hours',
    function(d) { return new Date(1970, 0, 1, d); },
    function(d) { return date(d).getHours(); },
    null, 0, 23
  ),
  entry('weekdays',
    function(d) { return new Date(1970, 0, 4+d); },
    function(d) { return date(d).getDay(); },
    [1], 0, 6
  ),
  entry('dates',
    function(d) { return new Date(1970, 0, d); },
    function(d) { return date(d).getDate(); },
    [1], 1, 31
  ),
  entry('months',
    function(d) { return new Date(1970, d % 12, 1); },
    function(d) { return date(d).getMonth(); },
    [1], 0, 11
  )
];

var utc = [
  create('second', d3_time.utcSecond, utcBaseDate),
  create('minute', d3_time.utcMinute, utcBaseDate),
  create('hour',   d3_time.utcHour,   utcBaseDate),
  create('day',    d3_time.utcDay,    utcBaseDate, [1, 7]),
  create('month',  d3_time.utcMonth,  utcBaseDate, [1, 3, 6]),
  create('year',   d3_time.utcYear,   utcBaseDate),

  // periodic units
  entry('seconds',
    function(d) { return new Date(Date.UTC(1970, 0, 1, 0, 0, d)); },
    function(d) { return date(d).getUTCSeconds(); },
    null, 0, 59
  ),
  entry('minutes',
    function(d) { return new Date(Date.UTC(1970, 0, 1, 0, d)); },
    function(d) { return date(d).getUTCMinutes(); },
    null, 0, 59
  ),
  entry('hours',
    function(d) { return new Date(Date.UTC(1970, 0, 1, d)); },
    function(d) { return date(d).getUTCHours(); },
    null, 0, 23
  ),
  entry('weekdays',
    function(d) { return new Date(Date.UTC(1970, 0, 4+d)); },
    function(d) { return date(d).getUTCDay(); },
    [1], 0, 6
  ),
  entry('dates',
    function(d) { return new Date(Date.UTC(1970, 0, d)); },
    function(d) { return date(d).getUTCDate(); },
    [1], 1, 31
  ),
  entry('months',
    function(d) { return new Date(Date.UTC(1970, d % 12, 1)); },
    function(d) { return date(d).getUTCMonth(); },
    [1], 0, 11
  )
];

var STEPS = [
  [31536e6, 5],  // 1-year
  [7776e6, 4],   // 3-month
  [2592e6, 4],   // 1-month
  [12096e5, 3],  // 2-week
  [6048e5, 3],   // 1-week
  [1728e5, 3],   // 2-day
  [864e5, 3],    // 1-day
  [432e5, 2],    // 12-hour
  [216e5, 2],    // 6-hour
  [108e5, 2],    // 3-hour
  [36e5, 2],     // 1-hour
  [18e5, 1],     // 30-minute
  [9e5, 1],      // 15-minute
  [3e5, 1],      // 5-minute
  [6e4, 1],      // 1-minute
  [3e4, 0],      // 30-second
  [15e3, 0],     // 15-second
  [5e3, 0],      // 5-second
  [1e3, 0]       // 1-second
];

function find(units, span, minb, maxb) {
  var step = STEPS[0], i, n, bins;

  for (i=1, n=STEPS.length; i<n; ++i) {
    step = STEPS[i];
    if (span > step[0]) {
      bins = span / step[0];
      if (bins > maxb) {
        return units[STEPS[i-1][1]];
      }
      if (bins >= minb) {
        return units[step[1]];
      }
    }
  }
  return units[STEPS[n-1][1]];
}

function toUnitMap(units) {
  var map = {}, i, n;
  for (i=0, n=units.length; i<n; ++i) {
    map[units[i].type] = units[i];
  }
  map.find = function(span, minb, maxb) {
    return find(units, span, minb, maxb);
  };
  return map;
}

module.exports = toUnitMap(locale);
module.exports.utc = toUnitMap(utc);

},{"d3-time":7}],13:[function(require,module,exports){
var buffer = require('buffer'),
    time = require('./time'),
    utc = time.utc;

var u = module.exports = {};

// utility functions

var FNAME = '__name__';

u.namedfunc = function(name, f) { return (f[FNAME] = name, f); };

u.name = function(f) { return f==null ? null : f[FNAME]; };

u.identity = function(x) { return x; };

u.true = u.namedfunc('true', function() { return true; });

u.false = u.namedfunc('false', function() { return false; });

u.duplicate = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

u.equal = function(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
};

u.extend = function(obj) {
  for (var x, name, i=1, len=arguments.length; i<len; ++i) {
    x = arguments[i];
    for (name in x) { obj[name] = x[name]; }
  }
  return obj;
};

u.length = function(x) {
  return x != null && x.length != null ? x.length : null;
};

u.keys = function(x) {
  var keys = [], k;
  for (k in x) keys.push(k);
  return keys;
};

u.vals = function(x) {
  var vals = [], k;
  for (k in x) vals.push(x[k]);
  return vals;
};

u.toMap = function(list, f) {
  return (f = u.$(f)) ?
    list.reduce(function(obj, x) { return (obj[f(x)] = 1, obj); }, {}) :
    list.reduce(function(obj, x) { return (obj[x] = 1, obj); }, {});
};

u.keystr = function(values) {
  // use to ensure consistent key generation across modules
  var n = values.length;
  if (!n) return '';
  for (var s=String(values[0]), i=1; i<n; ++i) {
    s += '|' + String(values[i]);
  }
  return s;
};

// type checking functions

var toString = Object.prototype.toString;

u.isObject = function(obj) {
  return obj === Object(obj);
};

u.isFunction = function(obj) {
  return toString.call(obj) === '[object Function]';
};

u.isString = function(obj) {
  return typeof value === 'string' || toString.call(obj) === '[object String]';
};

u.isArray = Array.isArray || function(obj) {
  return toString.call(obj) === '[object Array]';
};

u.isNumber = function(obj) {
  return typeof obj === 'number' || toString.call(obj) === '[object Number]';
};

u.isBoolean = function(obj) {
  return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
};

u.isDate = function(obj) {
  return toString.call(obj) === '[object Date]';
};

u.isValid = function(obj) {
  return obj != null && obj === obj;
};

u.isBuffer = (buffer.Buffer && buffer.Buffer.isBuffer) || u.false;

// type coercion functions

u.number = function(s) {
  return s == null || s === '' ? null : +s;
};

u.boolean = function(s) {
  return s == null || s === '' ? null : s==='false' ? false : !!s;
};

u.date = function(s) {
  return s == null || s === '' ? null : Date.parse(s);
};

u.array = function(x) {
  return x != null ? (u.isArray(x) ? x : [x]) : [];
};

u.str = function(x) {
  return u.isArray(x) ? '[' + x.map(u.str) + ']'
    : u.isObject(x) ? JSON.stringify(x)
    : u.isString(x) ? ('\''+util_escape_str(x)+'\'') : x;
};

var escape_str_re = /(^|[^\\])'/g;

function util_escape_str(x) {
  return x.replace(escape_str_re, '$1\\\'');
}

// data access functions

var field_re = /\[(.*?)\]|[^.\[]+/g;

u.field = function(f) {
  return String(f).match(field_re).map(function(d) {
    return d[0] !== '[' ? d :
      d[1] !== "'" && d[1] !== '"' ? d.slice(1, -1) :
      d.slice(2, -2).replace(/\\(["'])/g, '$1');
  });
};

u.accessor = function(f) {
  var s;
  return f==null || u.isFunction(f) ? f :
    u.namedfunc(f, (s = u.field(f)).length > 1 ?
      function(x) { return s.reduce(function(x,f) { return x[f]; }, x); } :
      function(x) { return x[f]; }
    );
};

// short-cut for accessor
u.$ = u.accessor;

u.mutator = function(f) {
  var s;
  return u.isString(f) && (s=u.field(f)).length > 1 ?
    function(x, v) {
      for (var i=0; i<s.length-1; ++i) x = x[s[i]];
      x[s[i]] = v;
    } :
    function(x, v) { x[f] = v; };
};


u.$func = function(name, op) {
  return function(f) {
    f = u.$(f) || u.identity;
    var n = name + (u.name(f) ? '_'+u.name(f) : '');
    return u.namedfunc(n, function(d) { return op(f(d)); });
  };
};

u.$valid  = u.$func('valid', u.isValid);
u.$length = u.$func('length', u.length);

u.$in = function(f, values) {
  f = u.$(f);
  var map = u.isArray(values) ? u.toMap(values) : values;
  return function(d) { return !!map[f(d)]; };
};

u.$year   = u.$func('year', time.year.unit);
u.$month  = u.$func('month', time.months.unit);
u.$date   = u.$func('date', time.dates.unit);
u.$day    = u.$func('day', time.weekdays.unit);
u.$hour   = u.$func('hour', time.hours.unit);
u.$minute = u.$func('minute', time.minutes.unit);
u.$second = u.$func('second', time.seconds.unit);

u.$utcYear   = u.$func('utcYear', utc.year.unit);
u.$utcMonth  = u.$func('utcMonth', utc.months.unit);
u.$utcDate   = u.$func('utcDate', utc.dates.unit);
u.$utcDay    = u.$func('utcDay', utc.weekdays.unit);
u.$utcHour   = u.$func('utcHour', utc.hours.unit);
u.$utcMinute = u.$func('utcMinute', utc.minutes.unit);
u.$utcSecond = u.$func('utcSecond', utc.seconds.unit);

// comparison / sorting functions

u.comparator = function(sort) {
  var sign = [];
  if (sort === undefined) sort = [];
  sort = u.array(sort).map(function(f) {
    var s = 1;
    if      (f[0] === '-') { s = -1; f = f.slice(1); }
    else if (f[0] === '+') { s = +1; f = f.slice(1); }
    sign.push(s);
    return u.accessor(f);
  });
  return function(a,b) {
    var i, n, f, x, y;
    for (i=0, n=sort.length; i<n; ++i) {
      f = sort[i]; x = f(a); y = f(b);
      if (x < y) return -1 * sign[i];
      if (x > y) return sign[i];
    }
    return 0;
  };
};

u.cmp = function(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else if (a >= b) {
    return 0;
  } else if (a === null) {
    return -1;
  } else if (b === null) {
    return 1;
  }
  return NaN;
};

u.numcmp = function(a, b) { return a - b; };

u.stablesort = function(array, sortBy, keyFn) {
  var indices = array.reduce(function(idx, v, i) {
    return (idx[keyFn(v)] = i, idx);
  }, {});

  array.sort(function(a, b) {
    var sa = sortBy(a),
        sb = sortBy(b);
    return sa < sb ? -1 : sa > sb ? 1
         : (indices[keyFn(a)] - indices[keyFn(b)]);
  });

  return array;
};


// string functions

u.pad = function(s, length, pos, padchar) {
  padchar = padchar || " ";
  var d = length - s.length;
  if (d <= 0) return s;
  switch (pos) {
    case 'left':
      return strrep(d, padchar) + s;
    case 'middle':
    case 'center':
      return strrep(Math.floor(d/2), padchar) +
         s + strrep(Math.ceil(d/2), padchar);
    default:
      return s + strrep(d, padchar);
  }
};

function strrep(n, str) {
  var s = "", i;
  for (i=0; i<n; ++i) s += str;
  return s;
}

u.truncate = function(s, length, pos, word, ellipsis) {
  var len = s.length;
  if (len <= length) return s;
  ellipsis = ellipsis !== undefined ? String(ellipsis) : '\u2026';
  var l = Math.max(0, length - ellipsis.length);

  switch (pos) {
    case 'left':
      return ellipsis + (word ? truncateOnWord(s,l,1) : s.slice(len-l));
    case 'middle':
    case 'center':
      var l1 = Math.ceil(l/2), l2 = Math.floor(l/2);
      return (word ? truncateOnWord(s,l1) : s.slice(0,l1)) +
        ellipsis + (word ? truncateOnWord(s,l2,1) : s.slice(len-l2));
    default:
      return (word ? truncateOnWord(s,l) : s.slice(0,l)) + ellipsis;
  }
};

function truncateOnWord(s, len, rev) {
  var cnt = 0, tok = s.split(truncate_word_re);
  if (rev) {
    s = (tok = tok.reverse())
      .filter(function(w) { cnt += w.length; return cnt <= len; })
      .reverse();
  } else {
    s = tok.filter(function(w) { cnt += w.length; return cnt <= len; });
  }
  return s.length ? s.join('').trim() : tok[0].slice(0, len);
}

var truncate_word_re = /([\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF])/;

},{"./time":12,"buffer":1}],14:[function(require,module,exports){
'use strict';

require('./globals');

var consts = require('./consts'),
  util = require('./util'),
  vlfield = require('./field'),
  vlenc = require('./enc'),
  schema = require('./schema/schema');

module.exports = (function() {
  function Encoding(spec, theme) {
    var defaults = schema.instantiate(),
      specExtended = schema.util.merge(defaults, theme || {}, spec) ;

    this._data = specExtended.data;
    this._marktype = specExtended.marktype;
    this._enc = specExtended.encoding;
    this._config = specExtended.config;
    this._filter = specExtended.filter;
    // this._vega2 = true;
  }

  var proto = Encoding.prototype;

  Encoding.fromShorthand = function(shorthand, data, config, theme) {
    var c = consts.shorthand,
        split = shorthand.split(c.delim),
        marktype = split.shift().split(c.assign)[1].trim(),
        enc = vlenc.fromShorthand(split);

    return new Encoding({
      data: data,
      marktype: marktype,
      encoding: enc,
      config: config,
      filter: []
    }, theme);
  };

  Encoding.fromSpec = function(spec, theme) {
    return new Encoding(spec, theme);
  };

  proto.toShorthand = function() {
    var c = consts.shorthand;
    return 'mark' + c.assign + this._marktype +
      c.delim + vlenc.shorthand(this._enc);
  };

  Encoding.shorthand = function (spec) {
    var c = consts.shorthand;
    return 'mark' + c.assign + spec.marktype +
      c.delim + vlenc.shorthand(spec.encoding);
  };

  Encoding.specFromShorthand = function(shorthand, data, config, excludeConfig) {
    return Encoding.fromShorthand(shorthand, data, config).toSpec(excludeConfig);
  };

  proto.toSpec = function(excludeConfig, excludeData) {
    var enc = util.duplicate(this._enc),
      spec;

    spec = {
      marktype: this._marktype,
      encoding: enc,
      filter: this._filter
    };

    if (!excludeConfig) {
      spec.config = util.duplicate(this._config);
    }

    if (!excludeData) {
      spec.data = util.duplicate(this._data);
    }

    // remove defaults
    var defaults = schema.instantiate();
    return schema.util.subtract(spec, defaults);
  };


  proto.marktype = function() {
    return this._marktype;
  };

  proto.is = function(m) {
    return this._marktype === m;
  };

  proto.has = function(encType) {
    // equivalent to calling vlenc.has(this._enc, encType)
    return this._enc[encType].name !== undefined;
  };

  proto.field = function(et) {
    return this._enc[et];
  };

  proto.filter = function() {
    var filterNull = [],
      fields = this.fields(),
      self = this;

    util.forEach(fields, function(fieldList, fieldName) {
      if (fieldName === '*') return; //count

      if ((self.config('filterNull').Q && fieldList.containsType[Q]) ||
          (self.config('filterNull').T && fieldList.containsType[T]) ||
          (self.config('filterNull').O && fieldList.containsType[O]) ||
          (self.config('filterNull').N && fieldList.containsType[N])) {
        filterNull.push({
          operands: [fieldName],
          operator: 'notNull'
        });
      }
    });

    return filterNull.concat(this._filter);
  };

  // get "field" reference for vega
  proto.fieldRef = function(et, opt) {
    opt = opt || {};
    opt.data = !this._vega2 && (opt.data !== false);
    return vlfield.fieldRef(this._enc[et], opt);
  };

  proto.fieldName = function(et) {
    return this._enc[et].name;
  };

  /*
   * return key-value pairs of field name and list of fields of that field name
   */
  proto.fields = function() {
    return vlenc.fields(this._enc);
  };

  proto.fieldTitle = function(et) {
    if (vlfield.isCount(this._enc[et])) {
      return vlfield.count.displayName;
    }
    var fn = this._enc[et].aggregate || this._enc[et].timeUnit || (this._enc[et].bin && 'bin');
    if (fn) {
      var uppercase = fn === 'avg' ? 'MEAN' :fn.toUpperCase();
      return uppercase + '(' + this._enc[et].name + ')';
    } else {
      return this._enc[et].name;
    }
  };

  proto.scale = function(et) {
    return this._enc[et].scale || {};
  };

  proto.axis = function(et) {
    return this._enc[et].axis || {};
  };

  proto.bandSize = function(encType, useSmallBand) {
    useSmallBand = useSmallBand ||
      //isBandInSmallMultiples
      (encType === Y && this.has(ROW) && this.has(Y)) ||
      (encType === X && this.has(COL) && this.has(X));

    // if band.size is explicitly specified, follow the specification, otherwise draw value from config.
    return this.field(encType).band.size ||
      this.config(useSmallBand ? 'smallBandSize' : 'largeBandSize');
  };

  proto.aggregate = function(et) {
    return this._enc[et].aggregate;
  };

  // returns false if binning is disabled, otherwise an object with binning properties
  proto.bin = function(et) {
    var bin = this._enc[et].bin;
    if (bin === {})
      return false;
    if (bin === true)
      return {
        maxbins: schema.MAXBINS_DEFAULT
      };
    return bin;
  };

  proto.value = function(et) {
    return this._enc[et].value;
  };

  proto.numberFormat = function(fieldStats) {
    var formatConfig = fieldStats.max > this.config('maxSmallNumber') ?
      'largeNumberFormat': 'smallNumberFormat';
    return this.config(formatConfig);
  };

  proto.sort = function(et, stats) {
    var sort = this._enc[et].sort,
      enc = this._enc,
      isTypes = vlfield.isTypes;

    if ((!sort || sort.length===0) &&
        // FIXME
        Encoding.toggleSort.support({encoding:this._enc}, stats, true) && //HACK
        this.config('toggleSort') === Q
      ) {
      var qField = isTypes(enc.x, [N, O]) ? enc.y : enc.x;

      if (isTypes(enc[et], [N, O])) {
        sort = [{
          name: qField.name,
          aggregate: qField.aggregate,
          type: qField.type,
          reverse: true
        }];
      }
    }

    return sort;
  };

  proto.map = function(f) {
    return vlenc.map(this._enc, f);
  };

  proto.reduce = function(f, init) {
    return vlenc.reduce(this._enc, f, init);
  };

  proto.forEach = function(f) {
    return vlenc.forEach(this._enc, f);
  };

  proto.type = function(et) {
    return this.has(et) ? this._enc[et].type : null;
  };

  proto.isType = function(et, type) {
    var field = this.field(et);
    return field && vlfield.isType(field, type);
  };


  proto.isTypes = function(et, type) {
    var field = this.field(et);
    return field && vlfield.isTypes(field, type);
  };

  Encoding.isOrdinalScale = function(encoding, encType) {
    return vlfield.isOrdinalScale(encoding.field(encType));
  };

  Encoding.isDimension = function(encoding, encType) {
    return vlfield.isDimension(encoding.field(encType));
  };

  Encoding.isMeasure = function(encoding, encType) {
    return vlfield.isMeasure(encoding.field(encType));
  };

  proto.isOrdinalScale = function(encType) {
    return this.has(encType) && Encoding.isOrdinalScale(this, encType);
  };

  proto.isDimension = function(encType) {
    return this.has(encType) && Encoding.isDimension(this, encType);
  };

  proto.isMeasure = function(encType) {
    return this.has(encType) && Encoding.isMeasure(this, encType);
  };

  proto.isAggregate = function() {
    return vlenc.isAggregate(this._enc);
  };

  proto.dataTable = function() {
    return this.isAggregate() ? AGGREGATE : RAW;
  };

  Encoding.isAggregate = function(spec) {
    return vlenc.isAggregate(spec.encoding);
  };

  Encoding.alwaysNoOcclusion = function(spec) {
    // FIXME raw OxQ with # of rows = # of O
    return vlenc.isAggregate(spec.encoding);
  };

  Encoding.isStack = function(spec) {
    // FIXME update this once we have control for stack ...
    return (spec.marktype === 'bar' || spec.marktype === 'area') &&
      spec.encoding.color;
  };

  proto.isStack = function() {
    // FIXME update this once we have control for stack ...
    return (this.is('bar') || this.is('area')) && this.has('color');
  };

  proto.details = function() {
    var encoding = this;
    return this.reduce(function(refs, field, encType) {
      if (!field.aggregate && (encType !== X && encType !== Y)) {
        refs.push(encoding.fieldRef(encType));
      }
      return refs;
    }, []);
  };

  proto.facets = function() {
    var encoding = this;
    return this.reduce(function(refs, field, encType) {
      if (!field.aggregate && (encType == ROW || encType == COL)) {
        refs.push(encoding.fieldRef(encType));
      }
      return refs;
    }, []);
  };

  proto.cardinality = function(encType, stats) {
    return vlfield.cardinality(this.field(encType), stats, this.config('filterNull'));
  };

  proto.isRaw = function() {
    return !this.isAggregate();
  };

  proto.data = function() {
    return this._data;
  };

   // returns whether the encoding has values embedded
  proto.hasValues = function() {
    var vals = this.data().values;
    return vals && vals.length;
  };

  proto.config = function(name) {
    return this._config[name];
  };

  Encoding.transpose = function(spec) {
    var oldenc = spec.encoding,
      enc = util.duplicate(spec.encoding);
    enc.x = oldenc.y;
    enc.y = oldenc.x;
    enc.row = oldenc.col;
    enc.col = oldenc.row;
    spec.encoding = enc;
    return spec;
  };

  // FIXME: REMOVE everything below here

  Encoding.toggleSort = function(spec) {
    spec.config = spec.config || {};
    spec.config.toggleSort = spec.config.toggleSort === Q ? N : Q;
    return spec;
  };


  Encoding.toggleSort.direction = function(spec) {
    if (!Encoding.toggleSort.support(spec)) { return; }
    var enc = spec.encoding;
    return enc.x.type === N ? 'x' : 'y';
  };

  Encoding.toggleSort.mode = function(spec) {
    return spec.config.toggleSort;
  };

  Encoding.toggleSort.support = function(spec, stats) {
    var enc = spec.encoding,
      isTypes = vlfield.isTypes;

    if (vlenc.has(enc, ROW) || vlenc.has(enc, COL) ||
      !vlenc.has(enc, X) || !vlenc.has(enc, Y) ||
      !Encoding.alwaysNoOcclusion(spec, stats)) {
      return false;
    }

    return ( isTypes(enc.x, [N,O]) && vlfield.isMeasure(enc.y)) ? 'x' :
      ( isTypes(enc.y, [N,O]) && vlfield.isMeasure(enc.x)) ? 'y' : false;
  };

  Encoding.toggleFilterNullO = function(spec) {
    spec.config = spec.config || {};
    spec.config.filterNull = spec.config.filterNull || { //FIXME
      T: true,
      Q: true
    };
    spec.config.filterNull.O = !spec.config.filterNull.O;
    return spec;
  };

  Encoding.toggleFilterNullO.support = function(spec, stats) {
    var fields = vlenc.fields(spec.encoding);
    for (var fieldName in fields) {
      var fieldList = fields[fieldName];
      if (fieldList.containsType.O && fieldName in stats && stats[fieldName].nulls > 0) {
        return true;
      }
    }
    return false;
  };

  return Encoding;
})();

},{"./consts":29,"./enc":31,"./field":32,"./globals":33,"./schema/schema":35,"./util":37}],15:[function(require,module,exports){
'use strict';

require('../globals');

var util = require('../util'),
  setter = util.setter,
  getter = util.getter,
  time = require('./time');

var axis = module.exports = {};

axis.def = function(name, encoding, layout, stats, opt) {
  var isCol = name == COL,
    isRow = name == ROW,
    type = isCol ? 'x' : isRow ? 'y' : name;

  var def = {
    type: type,
    scale: name,
    properties: {},
    layer: encoding.field(name).axis.layer,
    orient: axis.orient(name, encoding, stats)
  };

  // Add axis label custom scale (for bin / time)
  def = axis.labels.scale(def, encoding, name);
  def = axis.labels.format(def, name, encoding, stats);
  def = axis.labels.angle(def, encoding, name);

  // for x-axis, set ticks for Q or rotate scale for ordinal scale
  if (name == X) {
    if ((encoding.isDimension(X) || encoding.isType(X, T)) &&
        !('angle' in getter(def, ['properties', 'labels']))) {
      // TODO(kanitw): Jul 19, 2015 - #506 add condition for rotation
      def = axis.labels.rotate(def);
    } else { // Q
      def.ticks = encoding.field(name).axis.ticks;
    }
  }

  // TitleOffset depends on labels rotation
  def.titleOffset = axis.titleOffset(encoding, layout, name);

  //def.offset is used in axis.grid
  if(isRow) def.offset = axis.titleOffset(encoding, layout, Y) + 20;
  // FIXME(kanitw): Jul 19, 2015 - offset for column when x is put on top

  def = axis.grid(def, name, encoding, layout);
  def = axis.title(def, name, encoding, layout, opt);

  if (isRow || isCol) def = axis.hideTicks(def);

  return def;
};

axis.orient = function(name, encoding, stats) {
  var orient = encoding.field(name).axis.orient;
  if (orient) return orient;

  if (name===COL) return 'top';

  // x-axis for long y - put on top
  if (name===X && encoding.has(Y) && encoding.isOrdinalScale(Y) && encoding.cardinality(Y, stats) > 30) {
    return 'top';
  }

  return undefined;
};

axis.grid = function(def, name, encoding, layout) {
  var cellPadding = layout.cellPadding,
    isCol = name == COL,
    isRow = name == ROW;

  if (encoding.axis(name).grid) {
    def.grid = true;

    if (isCol) {
      // set grid property -- put the lines on the right the cell
      def.properties.grid = {
        x: {
          offset: layout.cellWidth * (1+ cellPadding/2.0),
          // default value(s) -- vega doesn't do recursive merge
          scale: 'col'
        },
        y: {
          value: -layout.cellHeight * (cellPadding/2),
        },
        stroke: { value: encoding.config('cellGridColor') },
        opacity: { value: encoding.config('cellGridOpacity') }
      };
    } else if (isRow) {
      // set grid property -- put the lines on the top
      def.properties.grid = {
        y: {
          offset: -layout.cellHeight * (cellPadding/2),
          // default value(s) -- vega doesn't do recursive merge
          scale: 'row'
        },
        x: {
          value: def.offset
        },
        x2: {
          offset: def.offset + (layout.cellWidth * 0.05),
          // default value(s) -- vega doesn't do recursive merge
          group: 'mark.group.width',
          mult: 1
        },
        stroke: { value: encoding.config('cellGridColor') },
        opacity: { value: encoding.config('cellGridOpacity') }
      };
    } else {
      def.properties.grid = {
        stroke: { value: encoding.config('gridColor') },
        opacity: { value: encoding.config('gridOpacity') }
      };
    }
  }
  return def;
};

axis.hideTicks = function(def) {
  def.properties.ticks = {opacity: {value: 0}};
  def.properties.majorTicks = {opacity: {value: 0}};
  def.properties.axis = {opacity: {value: 0}};
  return def;
};

axis.title = function (def, name, encoding, layout) {
  var ax = encoding.field(name).axis;

  if (ax.title) {
    def.title = ax.title;
  } else {
    // if not defined, automatically determine axis title from field def
    var fieldTitle = encoding.fieldTitle(name),
      maxLength;

    if (ax.titleMaxLength) {
      maxLength = ax.titleMaxLength;
    } else if (name===X) {
      maxLength = layout.cellWidth / encoding.config('characterWidth');
    } else if (name === Y) {
      maxLength = layout.cellHeight / encoding.config('characterWidth');
    }

    def.title = maxLength ? util.truncate(fieldTitle, maxLength) : fieldTitle;
  }

  if (name === ROW) {
    def.properties.title = {
      angle: {value: 0},
      align: {value: 'right'},
      baseline: {value: 'middle'},
      dy: {value: (-layout.height/2) -20}
    };
  }

  return def;
};

axis.labels = {};

/** add custom label for time type and bin */
axis.labels.scale = function(def, encoding, name) {
  // time
  var timeUnit = encoding.field(name).timeUnit;
  if (encoding.isType(name, T) && timeUnit && (time.hasScale(timeUnit))) {
    setter(def, ['properties','labels','text','scale'], 'time-'+ timeUnit);
  }
  // FIXME bin
  return def;
};

/**
 * Determine number format or truncate if maxLabel length is presented.
 */
axis.labels.format = function (def, name, encoding, stats) {
  var fieldStats = stats[encoding.field(name).name];

  if (encoding.axis(name).format) {
    def.format = encoding.axis(name).format;
  } else if (encoding.isType(name, Q) || fieldStats.type === 'number') {
    def.format = encoding.numberFormat(fieldStats);
  } else if (encoding.isType(name, T)) {
    var timeUnit = encoding.field(name).timeUnit;
    if (!timeUnit) {
      def.format = encoding.config('timeFormat');
    } else if (timeUnit === 'year') {
      def.format = 'd';
    }
  } else if (encoding.isTypes(name, [N, O]) && encoding.axis(name).maxLabelLength) {
    setter(def,
      ['properties','labels','text','template'],
      '{{data | truncate:' + encoding.axis(name).maxLabelLength + '}}'
      );
  }

  return def;
};

axis.labels.angle = function(def, encoding, name) {
  var angle = encoding.axis(name).labelAngle;
  if (typeof angle === 'undefined') return def;

  setter(def, ['properties', 'labels', 'angle', 'value'], angle);
  return def;
};

axis.labels.rotate = function(def) {
 var align = def.orient ==='top' ? 'left' : 'right';
 setter(def, ['properties','labels', 'angle', 'value'], 270);
 setter(def, ['properties','labels', 'align', 'value'], align);
 setter(def, ['properties','labels', 'baseline', 'value'], 'middle');
 return def;
};

axis.titleOffset = function (encoding, layout, name) {
  // return specified value if specified
  var value = encoding.axis(name).titleOffset;
  if (value)  return value;

  switch (name) {
    //FIXME make this adjustable
    case ROW: return 0;
    case COL: return 35;
  }
  return getter(layout, [name, 'axisTitleOffset']);
};

},{"../globals":33,"../util":37,"./time":28}],16:[function(require,module,exports){
'use strict';

var summary = module.exports = require('datalib/src/stats').summary;

require('../globals');

var compiler = module.exports = {};

var Encoding = require('../Encoding'),
  axis = compiler.axis = require('./axis'),
  legend = compiler.legend = require('./legend'),
  marks = compiler.marks = require('./marks'),
  scale = compiler.scale = require('./scale');

compiler.data = require('./data');
compiler.facet = require('./facet');
compiler.group = require('./group');
compiler.layout = require('./layout');
compiler.sort = require('./sort');
compiler.stack = require('./stack');
compiler.style = require('./style');
compiler.subfacet = require('./subfacet');
compiler.time = require('./time');

compiler.compile = function (spec, stats, theme) {
  return compiler.compileEncoding(Encoding.fromSpec(spec, theme), stats);
};

compiler.shorthand = function (shorthand, stats, config, theme) {
  return compiler.compileEncoding(Encoding.fromShorthand(shorthand, config, theme), stats);
};


compiler.compileEncoding = function (encoding, stats) {
  // no need to pass stats if you pass in the data
  if (!stats) {
    if (encoding.hasValues()) {
        stats = summary(encoding.data().values).reduce(function(s, p) {
        s[p.field] = p;
        return s;
      }, {});
    } else {
      console.error('No stats provided and data is not embedded.');
    }
  }

  var layout = compiler.layout(encoding, stats);

  var spec = {
      width: layout.width,
      height: layout.height,
      padding: 'auto',
      data: compiler.data(encoding),
      // global scales contains only time unit scales
      scales: compiler.time.scales(encoding)
    };

  // FIXME remove compiler.sort after migrating to vega 2.
  spec.data = compiler.sort(spec.data, encoding, stats); // append new data

  // marks

  // TODO this line is temporary and should be refactored
  spec.marks = [compiler.group.def('cell', {
    width: layout.cellWidth ? {value: layout.cellWidth} : undefined,
    height: layout.cellHeight ? {value: layout.cellHeight} : undefined
  })];

  var style = compiler.style(encoding, stats),
    group = spec.marks[0],
    mdefs = marks.def(encoding, layout, style, stats),
    mdef = mdefs[mdefs.length - 1];  // TODO: remove this dirty hack by refactoring the whole flow

  for (var i = 0; i < mdefs.length; i++) {
    group.marks.push(mdefs[i]);
  }

  var lineType = marks[encoding.marktype()].line;

  // handle subfacets

  var details = encoding.details(),
    stack = encoding.isAggregate() && details.length > 0 && compiler.stack(spec.data, encoding, mdef); // modify spec.data, mdef.{from,properties}

  if (details.length > 0 && (stack || lineType)) {
    //subfacet to group stack / line together in one group
    compiler.subfacet(group, mdef, details, stack, encoding);
  }

  // auto-sort line/area values
  if (lineType && encoding.config('autoSortLine')) {
    var f = (encoding.isMeasure(X) && encoding.isDimension(Y)) ? Y : X;
    if (!mdef.from) mdef.from = {};
    // TODO: why - ?
    mdef.from.transform = [{type: 'sort', by: '-' + encoding.fieldRef(f)}];
  }

  // get a flattened list of all scale names that are used in the vl spec
  var singleScaleNames = [].concat.apply([], mdefs.map(function(markProps) {
    return scale.names(markProps.properties.update);
  }));

  // Small Multiples
  if (encoding.has(ROW) || encoding.has(COL)) {
    spec = compiler.facet(group, encoding, layout, spec, singleScaleNames, stack, stats);
    spec.legends = legend.defs(encoding, style);
  } else {
    group.scales = scale.defs(singleScaleNames, encoding, layout, stats, {stack: stack});

    group.axes = [];
    if (encoding.has(X)) group.axes.push(axis.def(X, encoding, layout, stats));
    if (encoding.has(Y)) group.axes.push(axis.def(Y, encoding, layout, stats));

    group.legends = legend.defs(encoding, style);
  }



  return spec;
};


},{"../Encoding":14,"../globals":33,"./axis":15,"./data":17,"./facet":18,"./group":19,"./layout":20,"./legend":21,"./marks":22,"./scale":23,"./sort":24,"./stack":25,"./style":26,"./subfacet":27,"./time":28,"datalib/src/stats":11}],17:[function(require,module,exports){
'use strict';

require('../globals');

module.exports = data;

var vlfield = require('../field'),
  util = require('../util'),
  time = require('./time');

function data(encoding) {
  var def = [data.raw(encoding)];

  var aggregate = data.aggregate(encoding);
  if (aggregate) def.push(data.aggregate(encoding));

  // TODO add "having" filter here

  // append non-positive filter at the end for the data table
  data.filterNonPositive(def[def.length - 1], encoding);

  return def;
}

data.raw = function(encoding) {
  var raw = {name: RAW};

  // Data source (url or inline)
  if (encoding.hasValues()) {
    raw.values = encoding.data().values;
  } else {
    raw.url = encoding.data().url;
    raw.format = {type: encoding.data().formatType};
  }

  // Set format.parse if needed
  var parse = data.raw.formatParse(encoding);
  if (parse) {
    raw.format = raw.format || {};
    raw.format.parse = parse;
  }

  raw.transform = data.raw.transform(encoding);
  return raw;
};

data.raw.formatParse = function(encoding) {
  var parse;

  encoding.forEach(function(field) {
    if (field.type == T) {
      parse = parse || {};
      parse[field.name] = 'date';
    } else if (field.type == Q) {
      if (vlfield.isCount(field)) return;
      parse = parse || {};
      parse[field.name] = 'number';
    }
  });

  return parse;
};

data.raw.transform = function(encoding) {
  // time and bin should come before filter so we can filter by time and bin
  return data.raw.transform.time(encoding).concat(
    data.raw.transform.bin(encoding),
    data.raw.transform.filter(encoding)
  );
};

var BINARY = {
  '>':  true,
  '>=': true,
  '=':  true,
  '!=': true,
  '<':  true,
  '<=': true
};

data.raw.transform.time = function(encoding) {
  return encoding.reduce(function(transform, field, encType) {
    if (field.type === T && field.timeUnit) {
      transform.push({
        type: 'formula',
        field: encoding.fieldRef(encType),
        expr: time.formula(field.timeUnit, encoding.fieldRef(encType, {nofn: true, d: true}))
      });
    }
    return transform;
  }, []);
};

data.raw.transform.bin = function(encoding) {
  return encoding.reduce(function(transform, field, encType) {
    if (encoding.bin(encType)) {
      transform.push({
        type: 'bin',
        field: encoding.fieldRef(encType, {nofn: true}),
        output: encoding.fieldRef(encType),
        maxbins: encoding.bin(encType).maxbins
      });
    }
    return transform;
  }, []);
};

data.raw.transform.filter = function(encoding) {
  var filters = encoding.filter().reduce(function(f, filter) {
    var condition = '';
    var operator = filter.operator;
    var operands = filter.operands;

    var d = 'd.' + (encoding._vega2 ? '' : 'data.');

    if (BINARY[operator]) {
      // expects a field and a value
      if (operator === '=') {
        operator = '==';
      }

      var op1 = operands[0];
      var op2 = operands[1];
      condition = d + op1 + ' ' + operator + ' ' + op2;
    } else if (operator === 'notNull') {
      // expects a number of fields
      for (var j=0; j<operands.length; j++) {
        condition += d + operands[j] + '!==null';
        if (j < operands.length - 1) {
          condition += ' && ';
        }
      }
    } else {
      util.warn('Unsupported operator: ', operator);
      return f;
    }
    f.push('(' + condition + ')');
    return f;
  }, []);
  if (filters.length === 0) return [];

  return [{
      type: 'filter',
      test: filters.join(' && ')
  }];
};

data.aggregate = function(encoding) {
  var dims = {}, meas = {};

  encoding.forEach(function(field, encType) {
    if (field.aggregate) {
      if (field.aggregate === 'count') {
        meas.count = {op: 'count', field: '*'};
      }else {
        meas[field.aggregate + '|' + field.name] = {
          op: field.aggregate,
          field: encoding.fieldRef(encType, {nofn: true})
        };
      }
    } else {
      dims[field.name] = encoding.fieldRef(encType);
    }
  });

  dims = util.vals(dims);
  meas = util.vals(meas);

  if (meas.length > 0) {
    return {
      name: AGGREGATE,
      source: RAW,
      transform: [{
        type: 'aggregate',
        groupby: dims,
        fields: meas
      }]
    };
  }

  return null;
};

data.filterNonPositive = function(dataTable, encoding) {
  encoding.forEach(function(field, encType) {
    if (encoding.scale(encType).type === 'log') {
      dataTable.transform.push({
        type: 'filter',
        test: encoding.fieldRef(encType, {d: 1}) + ' > 0'
      });
    }
  });
};

},{"../field":32,"../globals":33,"../util":37,"./time":28}],18:[function(require,module,exports){
'use strict';

require('../globals');

var util = require('../util');

var axis = require('./axis'),
  groupdef = require('./group').def,
  scale = require('./scale');

module.exports = faceting;

function faceting(group, encoding, layout, spec, singleScaleNames, stack, stats) {
  var enter = group.properties.enter;
  var facetKeys = [], cellAxes = [], from, axesGrp;

  var hasRow = encoding.has(ROW), hasCol = encoding.has(COL);

  enter.fill = {value: encoding.config('cellBackgroundColor')};

  //move "from" to cell level and add facet transform
  group.from = {data: group.marks[0].from.data};

  // Hack, this needs to be refactored
  for (var i = 0; i < group.marks.length; i++) {
    var mark = group.marks[i];
    if (mark.from.transform) {
      delete mark.from.data; //need to keep transform for subfacetting case
    } else {
      delete mark.from;
    }
  }

  if (hasRow) {
    if (!encoding.isDimension(ROW)) {
      util.error('Row encoding should be ordinal.');
    }
    enter.y = {scale: ROW, field: 'keys.' + facetKeys.length};
    enter.height = {'value': layout.cellHeight}; // HACK

    facetKeys.push(encoding.fieldRef(ROW));

    if (hasCol) {
      from = util.duplicate(group.from);
      from.transform = from.transform || [];
      from.transform.unshift({type: 'facet', keys: [encoding.fieldRef(COL)]});
    }

    axesGrp = groupdef('x-axes', {
        axes: encoding.has(X) ? [axis.def(X, encoding, layout, stats)] : undefined,
        x: hasCol ? {scale: COL, field: 'keys.0'} : {value: 0},
        width: hasCol && {'value': layout.cellWidth}, //HACK?
        from: from
      });

    spec.marks.unshift(axesGrp); // need to prepend so it appears under the plots
    (spec.axes = spec.axes || []);
    spec.axes.push(axis.def(ROW, encoding, layout, stats));
  } else { // doesn't have row
    if (encoding.has(X)) {
      //keep x axis in the cell
      cellAxes.push(axis.def(X, encoding, layout, stats));
    }
  }

  if (hasCol) {
    if (!encoding.isDimension(COL)) {
      util.error('Col encoding should be ordinal.');
    }
    enter.x = {scale: COL, field: 'keys.' + facetKeys.length};
    enter.width = {'value': layout.cellWidth}; // HACK

    facetKeys.push(encoding.fieldRef(COL));

    if (hasRow) {
      from = util.duplicate(group.from);
      from.transform = from.transform || [];
      from.transform.unshift({type: 'facet', keys: [encoding.fieldRef(ROW)]});
    }

    axesGrp = groupdef('y-axes', {
      axes: encoding.has(Y) ? [axis.def(Y, encoding, layout, stats)] : undefined,
      y: hasRow && {scale: ROW, field: 'keys.0'},
      x: hasRow && {value: 0},
      height: hasRow && {'value': layout.cellHeight}, //HACK?
      from: from
    });

    spec.marks.unshift(axesGrp); // need to prepend so it appears under the plots
    (spec.axes = spec.axes || []);
    spec.axes.push(axis.def(COL, encoding, layout, stats));
  } else { // doesn't have col
    if (encoding.has(Y)) {
      cellAxes.push(axis.def(Y, encoding, layout, stats));
    }
  }

  // assuming equal cellWidth here
  // TODO: support heterogenous cellWidth (maybe by using multiple scales?)
  spec.scales = (spec.scales || []).concat(scale.defs(
    scale.names(enter).concat(singleScaleNames),
    encoding,
    layout,
    stats,
    {stack: stack, facet: true}
  )); // row/col scales + cell scales

  if (cellAxes.length > 0) {
    group.axes = cellAxes;
  }

  // add facet transform
  var trans = (group.from.transform || (group.from.transform = []));
  trans.unshift({type: 'facet', keys: facetKeys});

  return spec;
}

},{"../globals":33,"../util":37,"./axis":15,"./group":19,"./scale":23}],19:[function(require,module,exports){
'use strict';

module.exports = {
  def: groupdef
};

function groupdef(name, opt) {
  opt = opt || {};
  return {
    _name: name || undefined,
    type: 'group',
    from: opt.from,
    properties: {
      enter: {
        x: opt.x || undefined,
        y: opt.y || undefined,
        width: opt.width || {group: 'width'},
        height: opt.height || {group: 'height'}
      }
    },
    scales: opt.scales || undefined,
    axes: opt.axes || undefined,
    marks: opt.marks || []
  };
}

},{}],20:[function(require,module,exports){
'use strict';

require('../globals');

var util = require('../util'),
  setter = util.setter,
  time = require('./time'),
  d3_format = require('d3-format');

module.exports = vllayout;

function vllayout(encoding, stats) {
  var layout = box(encoding, stats);
  layout = offset(encoding, stats, layout);
  return layout;
}

/*
  HACK to set chart size
  NOTE: this fails for plots driven by derived values (e.g., aggregates)
  One solution is to update Vega to support auto-sizing
  In the meantime, auto-padding (mostly) does the trick
 */
function box(encoding, stats) {
  var hasRow = encoding.has(ROW),
      hasCol = encoding.has(COL),
      hasX = encoding.has(X),
      hasY = encoding.has(Y),
      marktype = encoding.marktype();

  // FIXME/HACK we need to take filter into account
  var xCardinality = hasX && encoding.isDimension(X) ? encoding.cardinality(X, stats) : 1,
    yCardinality = hasY && encoding.isDimension(Y) ? encoding.cardinality(Y, stats) : 1;

  var useSmallBand = xCardinality > encoding.config('largeBandMaxCardinality') ||
    yCardinality > encoding.config('largeBandMaxCardinality');

  var cellWidth, cellHeight, cellPadding = encoding.config('cellPadding');

  // set cellWidth
  if (hasX) {
    if (encoding.isOrdinalScale(X)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      cellWidth = (xCardinality + encoding.field(X).band.padding) * encoding.bandSize(X, useSmallBand);
    } else {
      cellWidth = hasCol || hasRow ? encoding.field(COL).width :  encoding.config('singleWidth');
    }
  } else {
    if (marktype === TEXT) {
      cellWidth = encoding.config('textCellWidth');
    } else {
      cellWidth = encoding.bandSize(X);
    }
  }

  // set cellHeight
  if (hasY) {
    if (encoding.isOrdinalScale(Y)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      cellHeight = (yCardinality + encoding.field(Y).band.padding) * encoding.bandSize(Y, useSmallBand);
    } else {
      cellHeight = hasCol || hasRow ? encoding.field(ROW).height :  encoding.config('singleHeight');
    }
  } else {
    cellHeight = encoding.bandSize(Y);
  }

  // Cell bands use rangeBands(). There are n-1 padding.  Outerpadding = 0 for cells

  var width = cellWidth, height = cellHeight;
  if (hasCol) {
    var colCardinality = encoding.cardinality(COL, stats);
    width = cellWidth * ((1 + cellPadding) * (colCardinality - 1) + 1);
  }
  if (hasRow) {
    var rowCardinality =  encoding.cardinality(ROW, stats);
    height = cellHeight * ((1 + cellPadding) * (rowCardinality - 1) + 1);
  }

  return {
    // width and height of the whole cell
    cellWidth: cellWidth,
    cellHeight: cellHeight,
    cellPadding: cellPadding,
    // width and height of the chart
    width: width,
    height: height,
    // information about x and y, such as band size
    x: {useSmallBand: useSmallBand},
    y: {useSmallBand: useSmallBand}
  };
}


// FIXME fieldStats.max isn't always the longest
function getMaxNumberLength(encoding, et, fieldStats) {
  var format = encoding.numberFormat(et, fieldStats);

  return d3_format.format(format)(fieldStats.max).length;
}

function getMaxLength(encoding, stats, et) {
  var field = encoding.field(et),
    fieldStats = stats[field.name];

  if (field.bin) {
    // TODO once bin support range, need to update this
    return getMaxNumberLength(encoding, et, fieldStats);
  } if (encoding.isType(et, Q)) {
    return getMaxNumberLength(encoding, et, fieldStats);
  } else if (encoding.isType(et, T)) {
    return time.maxLength(encoding.field(et).timeUnit, encoding);
  } else if (encoding.isTypes(et, [N, O])) {
    if(fieldStats.type === 'number') {
      return getMaxNumberLength(encoding, et, fieldStats);
    } else {
      return Math.min(fieldStats.max, encoding.axis(et).maxLabelLength || Infinity);
    }
  }
}

function offset(encoding, stats, layout) {
  [X, Y].forEach(function (et) {
    // TODO(kanitw): Jul 19, 2015 - create a set of visual test for extraOffset
    var extraOffset = et === X ? 20 : 22,
      maxLength;
    if (encoding.isDimension(et) || encoding.isType(et, T)) {
      maxLength = getMaxLength(encoding, stats, et);
    } else if (
      // TODO once we have #512 (allow using inferred type)
      // Need to adjust condition here.
      encoding.isType(et, Q) ||
      encoding.aggregate(et) === 'count'
    ) {
      if (
        et===Y
        // || (et===X && false)
        // FIXME determine when X would rotate, but should move this to axis.js first #506
      ) {
        maxLength = getMaxLength(encoding, stats, et);
      }
    } else {
      // nothing
    }

    if (maxLength) {
      setter(layout,[et, 'axisTitleOffset'], encoding.config('characterWidth') *  maxLength + extraOffset);
    } else {
      // if no max length (no rotation case), use maxLength = 3
      setter(layout,[et, 'axisTitleOffset'], encoding.config('characterWidth') * 3 + extraOffset);
    }

  });
  return layout;
}

},{"../globals":33,"../util":37,"./time":28,"d3-format":5}],21:[function(require,module,exports){
'use strict';

require('../globals');

var time = require('./time'),
  util = require('../util'),
  setter = util.setter,
  getter = util.getter;

var legend = module.exports = {};

legend.defs = function(encoding, style) {
  var defs = [];

  if (encoding.has(COLOR) && encoding.field(COLOR).legend) {
    defs.push(legend.def(COLOR, encoding, {
      fill: COLOR,
      orient: 'right'
    }, style));
  }

  if (encoding.has(SIZE) && encoding.field(SIZE).legend) {
    defs.push(legend.def(SIZE, encoding, {
      size: SIZE,
      orient: defs.length === 1 ? 'left' : 'right'
    }, style));
  }

  if (encoding.has(SHAPE) && encoding.field(SHAPE).legend) {
    if (defs.length === 2) {
      console.error('Vega-lite currently only supports two legends');
    }
    defs.push(legend.def(SHAPE, encoding, {
      shape: SHAPE,
      orient: defs.length === 1 ? 'left' : 'right'
    }, style));
  }
  return defs;
};

legend.def = function(name, encoding, def, style) {
  var timeUnit = encoding.field(name).timeUnit;

  def.title = legend.title(name, encoding);
  def = legend.style(name, encoding, def, style);

  if (encoding.isType(name, T) &&
    timeUnit &&
    time.hasScale(timeUnit)
  ) {
    setter(def, ['properties', 'labels', 'text', 'scale'], 'time-'+ timeUnit);
  }

  return def;
};

legend.style = function(name, e, def, style) {
  var symbols = getter(def, ['properties', 'symbols']),
    marktype = e.marktype();

  switch (marktype) {
    case 'bar':
    case 'tick':
    case 'text':
      symbols.stroke = {value: 'transparent'};
      symbols.shape = {value: 'square'};
      break;

    case 'circle':
    case 'square':
      symbols.shape = {value: marktype};
      /* fall through */
    case 'point':
      // fill or stroke
      if (e.field(SHAPE).filled) {
        if (e.has(COLOR) && name === COLOR) {
          symbols.fill = {scale: COLOR, field: 'data'};
        } else {
          symbols.fill = {value: e.value(COLOR)};
        }
        symbols.stroke = {value: 'transparent'};
      } else {
        if (e.has(COLOR) && name === COLOR) {
          symbols.stroke = {scale: COLOR, field: 'data'};
        } else {
          symbols.stroke = {value: e.value(COLOR)};
        }
        symbols.fill = {value: 'transparent'};
        symbols.strokeWidth = {value: e.config('strokeWidth')};
      }

      break;
    case 'line':
    case 'area':
      // TODO use shape here after implementing #508
      break;
  }

  var opacity = e.field(COLOR).opacity || style.opacity;
  if (opacity) {
    symbols.opacity = {value: opacity};
  }
  return def;
};

legend.title = function(name, encoding) {
  var leg = encoding.field(name).legend;

  if (leg.title) return leg.title;

  return encoding.fieldTitle(name);
};

},{"../globals":33,"../util":37,"./time":28}],22:[function(require,module,exports){
'use strict';

require('../globals');

var marks = module.exports = {};

marks.def = function(encoding, layout, style, stats) {

  var defs = [],
    mark = marks[encoding.marktype()],
    from = encoding.dataTable();

  // to add a background to text, we need to add it before the text
  if (encoding.marktype() === TEXT && encoding.has(COLOR)) {
    var bg = {
      x: {value: 0},
      y: {value: 0},
      x2: {value: layout.cellWidth},
      y2: {value: layout.cellHeight},
      fill: {scale: COLOR, field: encoding.fieldRef(COLOR)}
    };
    defs.push({
      type: 'rect',
      from: {data: from},
      properties: {enter: bg, update: bg}
    });
  }

  // add the mark def for the main thing
  var p = mark.prop(encoding, layout, style, stats);
  defs.push({
    type: mark.type,
    from: {data: from},
    properties: {enter: p, update: p}
  });

  return defs;
};

marks.bar = {
  type: 'rect',
  stack: true,
  prop: bar_props,
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, size: 1, color: 1}
};

marks.line = {
  type: 'line',
  line: true,
  prop: line_props,
  requiredEncoding: ['x', 'y'],
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, color: 1, detail:1}
};

marks.area = {
  type: 'area',
  stack: true,
  line: true,
  requiredEncoding: ['x', 'y'],
  prop: area_props,
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, color: 1}
};

marks.tick = {
  type: 'rect',
  prop: tick_props,
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, color: 1, detail: 1}
};

marks.circle = {
  type: 'symbol',
  prop: filled_point_props('circle'),
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, size: 1, color: 1, detail: 1}
};

marks.square = {
  type: 'symbol',
  prop: filled_point_props('square'),
  supportedEncoding: marks.circle.supportedEncoding
};

marks.point = {
  type: 'symbol',
  prop: point_props,
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, size: 1, color: 1, shape: 1, detail: 1}
};

marks.text = {
  type: 'text',
  prop: text_props,
  requiredEncoding: ['text'],
  supportedEncoding: {row: 1, col: 1, size: 1, color: 1, text: 1}
};

function bar_props(e, layout, style) {
  // jshint unused:false

  var p = {};

  // x's and width
  if (e.isMeasure(X)) {
    p.x = {scale: X, field: e.fieldRef(X)};
    if (!e.has(Y) || e.isDimension(Y)) {
      p.x2 = {value: 0};
    }
  } else {
    if (e.has(X)) { // is ordinal
       p.xc = {scale: X, field: e.fieldRef(X)};
    } else {
       p.x = {value: 0, offset: e.config('singleBarOffset')};
    }
  }

  // width
  if (!p.x2) {
    if (!e.has(X) || e.isOrdinalScale(X)) { // no X or X is ordinal
      if (e.has(SIZE)) {
        p.width = {scale: SIZE, field: e.fieldRef(SIZE)};
      } else {
        p.width = {
          value: e.bandSize(X, layout.x.useSmallBand),
          offset: -1
        };
      }
    } else { // X is Quant or Time Scale
      p.width = {value: 2};
    }
  }

  // y's & height
  if (e.isMeasure(Y)) {
    p.y = {scale: Y, field: e.fieldRef(Y)};
    p.y2 = {group: 'height'};
  } else {
    if (e.has(Y)) { // is ordinal
      p.yc = {scale: Y, field: e.fieldRef(Y)};
    } else {
      p.y2 = {group: 'height', offset: -e.config('singleBarOffset')};
    }

    if (e.has(SIZE)) {
      p.height = {scale: SIZE, field: e.fieldRef(SIZE)};
    } else {
      p.height = {
        value: e.bandSize(Y, layout.y.useSmallBand),
        offset: -1
      };
    }
  }

  // fill
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.fieldRef(COLOR)};
  } else {
    p.fill = {value: e.value(COLOR)};
  }

  // opacity
  var opacity = e.field(COLOR).opacity;
  if (opacity) p.opacity = {value: opacity};

  return p;
}

function point_props(e, layout, style) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.fieldRef(X)};
  } else if (!e.has(X)) {
    p.x = {value: e.bandSize(X, layout.x.useSmallBand) / 2};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.fieldRef(Y)};
  } else if (!e.has(Y)) {
    p.y = {value: e.bandSize(Y, layout.y.useSmallBand) / 2};
  }

  // size
  if (e.has(SIZE)) {
    p.size = {scale: SIZE, field: e.fieldRef(SIZE)};
  } else if (!e.has(SIZE)) {
    p.size = {value: e.value(SIZE)};
  }

  // shape
  if (e.has(SHAPE)) {
    p.shape = {scale: SHAPE, field: e.fieldRef(SHAPE)};
  } else if (!e.has(SHAPE)) {
    p.shape = {value: e.value(SHAPE)};
  }

  // fill or stroke
  if (e.field(SHAPE).filled) {
    if (e.has(COLOR)) {
      p.fill = {scale: COLOR, field: e.fieldRef(COLOR)};
    } else if (!e.has(COLOR)) {
      p.fill = {value: e.value(COLOR)};
    }
  } else {
    if (e.has(COLOR)) {
      p.stroke = {scale: COLOR, field: e.fieldRef(COLOR)};
    } else if (!e.has(COLOR)) {
      p.stroke = {value: e.value(COLOR)};
    }
    p.strokeWidth = {value: e.config('strokeWidth')};
  }

  // opacity
  var opacity = e.field(COLOR).opacity || style.opacity;
  if (opacity) p.opacity = {value: opacity};

  return p;
}

function line_props(e,layout, style) {
  // jshint unused:false
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.fieldRef(X)};
  } else if (!e.has(X)) {
    p.x = {value: 0};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.fieldRef(Y)};
  } else if (!e.has(Y)) {
    p.y = {group: 'height'};
  }

  // stroke
  if (e.has(COLOR)) {
    p.stroke = {scale: COLOR, field: e.fieldRef(COLOR)};
  } else if (!e.has(COLOR)) {
    p.stroke = {value: e.value(COLOR)};
  }

  var opacity = e.field(COLOR).opacity;
  if (opacity) p.opacity = {value: opacity};

  p.strokeWidth = {value: e.config('strokeWidth')};

  return p;
}

function area_props(e, layout, style) {
  // jshint unused:false
  var p = {};

  // x
  if (e.isMeasure(X)) {
    p.x = {scale: X, field: e.fieldRef(X)};
    if (e.isDimension(Y)) {
      p.x2 = {scale: X, value: 0};
      p.orient = {value: 'horizontal'};
    }
  } else if (e.has(X)) {
    p.x = {scale: X, field: e.fieldRef(X)};
  } else {
    p.x = {value: 0};
  }

  // y
  if (e.isMeasure(Y)) {
    p.y = {scale: Y, field: e.fieldRef(Y)};
    p.y2 = {scale: Y, value: 0};
  } else if (e.has(Y)) {
    p.y = {scale: Y, field: e.fieldRef(Y)};
  } else {
    p.y = {group: 'height'};
  }

  // fill
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.fieldRef(COLOR)};
  } else if (!e.has(COLOR)) {
    p.fill = {value: e.value(COLOR)};
  }

  var opacity = e.field(COLOR).opacity;
  if (opacity) p.opacity = {value: opacity};

  return p;
}

function tick_props(e, layout, style) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.fieldRef(X)};
    if (e.isDimension(X)) {
      p.x.offset = -e.bandSize(X, layout.x.useSmallBand) / 3;
    }
  } else if (!e.has(X)) {
    p.x = {value: 0};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.fieldRef(Y)};
    if (e.isDimension(Y)) {
      p.y.offset = -e.bandSize(Y, layout.y.useSmallBand) / 3;
    }
  } else if (!e.has(Y)) {
    p.y = {value: 0};
  }

  // width
  if (!e.has(X) || e.isDimension(X)) {
    p.width = {value: e.bandSize(X, layout.y.useSmallBand) / 1.5};
  } else {
    p.width = {value: 1};
  }

  // height
  if (!e.has(Y) || e.isDimension(Y)) {
    p.height = {value: e.bandSize(Y, layout.y.useSmallBand) / 1.5};
  } else {
    p.height = {value: 1};
  }

  // fill
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.fieldRef(COLOR)};
  } else {
    p.fill = {value: e.value(COLOR)};
  }

  var opacity = e.field(COLOR).opacity  || style.opacity;
  if(opacity) p.opacity = {value: opacity};

  return p;
}

function filled_point_props(shape) {
  return function(e, layout, style) {
    var p = {};

    // x
    if (e.has(X)) {
      p.x = {scale: X, field: e.fieldRef(X)};
    } else if (!e.has(X)) {
      p.x = {value: e.bandSize(X, layout.x.useSmallBand) / 2};
    }

    // y
    if (e.has(Y)) {
      p.y = {scale: Y, field: e.fieldRef(Y)};
    } else if (!e.has(Y)) {
      p.y = {value: e.bandSize(Y, layout.y.useSmallBand) / 2};
    }

    // size
    if (e.has(SIZE)) {
      p.size = {scale: SIZE, field: e.fieldRef(SIZE)};
    } else if (!e.has(X)) {
      p.size = {value: e.value(SIZE)};
    }

    // shape
    p.shape = {value: shape};

    // fill
    if (e.has(COLOR)) {
      p.fill = {scale: COLOR, field: e.fieldRef(COLOR)};
    } else if (!e.has(COLOR)) {
      p.fill = {value: e.value(COLOR)};
    }

    var opacity = e.field(COLOR).opacity  || style.opacity;
    if(opacity) p.opacity = {value: opacity};

    return p;
  };
}

function text_props(e, layout, style, stats) {
  var p = {},
    field = e.field(TEXT);

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.fieldRef(X)};
  } else if (!e.has(X)) {
    if (e.has(TEXT) && e.isType(TEXT, Q)) {
      p.x = {value: layout.cellWidth-5};
    } else {
      p.x = {value: e.bandSize(X, layout.x.useSmallBand) / 2};
    }
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.fieldRef(Y)};
  } else if (!e.has(Y)) {
    p.y = {value: e.bandSize(Y, layout.y.useSmallBand) / 2};
  }

  // size
  if (e.has(SIZE)) {
    p.fontSize = {scale: SIZE, field: e.fieldRef(SIZE)};
  } else if (!e.has(SIZE)) {
    p.fontSize = {value: field.font.size};
  }

  // fill
  // color should be set to background
  p.fill = {value: field.color};

  var opacity = e.field(COLOR).opacity  || style.opacity;
  if(opacity) p.opacity = {value: opacity};

  // text
  if (e.has(TEXT)) {
    if (e.isType(TEXT, Q)) {
      var fieldStats = stats[e.fieldName(TEXT)],
        numberFormat = field.format || e.numberFormat(fieldStats);

      p.text = {template: '{{' + e.fieldRef(TEXT) + ' | number:\'' +
        numberFormat +'\'}}'};
      p.align = {value: field.align};
    } else {
      p.text = {field: e.fieldRef(TEXT)};
    }
  } else {
    p.text = {value: field.placeholder};
  }

  p.font = {value: field.font.family};
  p.fontWeight = {value: field.font.weight};
  p.fontStyle = {value: field.font.style};
  p.baseline = {value: field.baseline};

  return p;
}

},{"../globals":33}],23:[function(require,module,exports){
'use strict';
require('../globals');
var util = require('../util'),
  time = require('./time'),
  colorbrewer = require('colorbrewer'),
  interpolate = require('d3-color').interpolateHsl,
  schema = require('../schema/schema'),
  vlsort = require('./sort');

var scale = module.exports = {};

scale.names = function(props) {
  return util.keys(util.keys(props).reduce(function(a, x) {
    if (props[x] && props[x].scale) a[props[x].scale] = 1;
    return a;
  }, {}));
};

scale.defs = function(names, encoding, layout, stats, opt) {
  opt = opt || {};

  return names.reduce(function(a, name) {
    var s = {
      name: name,
      type: scale.type(name, encoding),
      domain: scale.domain(name, encoding, stats, opt)
    };

    s.sort = scale.sort(s, encoding, name) || undefined;

    scale.range(s, encoding, layout, stats, opt);

    return (a.push(s), a);
  }, []);
};

scale.sort = function(s, encoding, name) {
  return s.type === 'ordinal' && (
    !!encoding.bin(name) ||
    encoding.sort(name).length === 0
  );
};

scale.type = function(name, encoding) {

  switch (encoding.type(name)) {
    case N: //fall through
    case O: return 'ordinal';
    case T:
      var timeUnit = encoding.field(name).timeUnit;
      return timeUnit ? time.scale.type(timeUnit, name) : 'time';
    case Q:
      if (encoding.bin(name)) {
        return name === COLOR ? 'linear' : 'ordinal';
      }
      return encoding.scale(name).type;
  }
};

scale.domain = function (name, encoding, stats, opt) {
  var field = encoding.field(name);

  if (encoding.isType(name, T)) {
    var range = time.scale.domain(field.timeUnit, name);
    if(range) return range;
  }

  if (field.bin) {
    // TODO(kanitw): this must be changed in vg2
    var fieldStat = stats[field.name],
      bins = util.getbins(fieldStat, field.bin.maxbins || schema.MAXBINS_DEFAULT),
      numbins = (bins.stop - bins.start) / bins.step;
    return util.range(numbins).map(function(i) {
      return bins.start + bins.step * i;
    });
  }

  if (name == opt.stack) {
    return {
      data: STACKED,
      field: encoding.fieldRef(name, {
        data: !encoding._vega2,
        prefn: (opt.facet ? 'max_' : '') + 'sum_'
      })
    };
  }
  var aggregate = encoding.aggregate(name),
    timeUnit = field.timeUnit,
    scaleUseRawDomain = encoding.scale(name).useRawDomain,
    useRawDomain = scaleUseRawDomain !== undefined ?
      scaleUseRawDomain : encoding.config('useRawDomain'),
    notCountOrSum = !aggregate || (aggregate !=='count' && aggregate !== 'sum');

  // FIXME revise this part

  if ( useRawDomain && notCountOrSum && (
      // Q always uses non-ordinal scale except when it's binned and thus uses ordinal scale.
      (encoding.isType(name, Q) && !field.bin) ||
      // T uses non-ordinal scale when there's no unit or when the unit is not ordinal.
      (encoding.isType(name, T) && (!timeUnit || !time.isOrdinalFn(timeUnit)))
    )
  ) {
    return {data: RAW, field: encoding.fieldRef(name, {nofn: !timeUnit})};
  }

  var data = encoding.sort(name, stats).length > 0 ?
    vlsort.getDataName(name):
    encoding.dataTable();

  return {data: data, field: encoding.fieldRef(name)};
};


scale.range = function (s, encoding, layout, stats) {
  var spec = encoding.scale(s.name),
    field = encoding.field(s.name),
    timeUnit = field.timeUnit;

  switch (s.name) {
    case X:
      s.range = layout.cellWidth ? [0, layout.cellWidth] : 'width';
      if (s.type === 'ordinal') {
        s.bandWidth = encoding.bandSize(X, layout.x.useSmallBand);
      } else {
        if (encoding.isType(s.name,T) && timeUnit === 'year') {
          s.zero = false;
        } else {
          s.zero = spec.zero === undefined ? true : spec.zero;
        }

        s.reverse = spec.reverse;
      }
      s.round = true;
      if (s.type === 'time') {
        s.nice = timeUnit || encoding.config('timeScaleNice');
      }else {
        s.nice = true;
      }
      break;
    case Y:
      if (s.type === 'ordinal') {
        s.range = layout.cellHeight ?
          (field.bin ? [layout.cellHeight, 0] : [0, layout.cellHeight]) :
          'height';
        s.bandWidth = encoding.bandSize(Y, layout.y.useSmallBand);
      } else {
        s.range = layout.cellHeight ? [layout.cellHeight, 0] : 'height';
        if (encoding.isType(s.name,T) && timeUnit === 'year') {
          s.zero = false;
        } else {
          s.zero = spec.zero === undefined ? true : spec.zero;
        }

        s.reverse = spec.reverse;
      }

      s.round = true;

      if (s.type === 'time') {
        s.nice = timeUnit || encoding.config('timeScaleNice');
      }else {
        s.nice = true;
      }
      break;
    case ROW: // support only ordinal
      s.bandWidth = layout.cellHeight;
      s.round = true;
      s.nice = true;
      break;
    case COL: // support only ordinal
      s.bandWidth = layout.cellWidth;
      s.round = true;
      s.nice = true;
      break;
    case SIZE:
      if (encoding.is('bar')) {
        // FIXME this is definitely incorrect
        // but let's fix it later since bar size is a bad encoding anyway
        s.range = [3, Math.max(encoding.bandSize(X), encoding.bandSize(Y))];
      } else if (encoding.is(TEXT)) {
        s.range = [8, 40];
      } else { //point
        var bandSize = Math.min(encoding.bandSize(X), encoding.bandSize(Y)) - 1;
        s.range = [10, 0.8 * bandSize*bandSize];
      }
      s.round = true;
      s.zero = false;
      break;
    case SHAPE:
      s.range = 'shapes';
      break;
    case COLOR:
      s.range = scale.color(s, encoding, stats);
      if (s.type !== 'ordinal') s.zero = false;
      break;
    default:
      throw new Error('Unknown encoding name: '+ s.name);
  }

  // FIXME(kanitw): Jul 29, 2015 - consolidate this with above
  switch (s.name) {
    case ROW:
    case COL:
      s.padding = encoding.config('cellPadding');
      s.outerPadding = 0;
      break;
    case X:
    case Y:
      if (s.type === 'ordinal') { //&& !s.bandWidth
        s.points = true;
        s.padding = encoding.field(s.name).band.padding;
      }
  }
};

scale.color = function(s, encoding, stats) {
  var colorScale = encoding.scale(COLOR),
    range = colorScale.range,
    cardinality = encoding.cardinality(COLOR, stats),
    type = encoding.type(COLOR);

  if (range === undefined) {
    var ordinalPalette = colorScale.ordinalPalette,
      quantitativeRange = colorScale.quantitativeRange;

    if (s.type === 'ordinal') {
      if (type === N) {
        // use categorical color scale
        if (cardinality <= 10) {
          range = colorScale.c10palette;
        } else {
          range = colorScale.c20palette;
        }
        return scale.color.palette(range, cardinality, type);
      } else {
        if (ordinalPalette) {
          return scale.color.palette(ordinalPalette, cardinality, type);
        }
        return scale.color.interpolate(quantitativeRange[0], quantitativeRange[1], cardinality);
      }
    } else { //time or quantitative
      return [quantitativeRange[0], quantitativeRange[1]];
    }
  }
};

scale.color.palette = function(range, cardinality, type) {
  // FIXME(kanitw): Jul 29, 2015 - check range is string
  switch (range) {
    case 'category10k':
      // tableau's category 10, ordered by perceptual kernel study results
      // https://github.com/uwdata/perceptual-kernels
      return ['#2ca02c', '#e377c2', '#7f7f7f', '#17becf', '#8c564b', '#d62728', '#bcbd22', '#9467bd', '#ff7f0e', '#1f77b4'];

    // d3/tableau category10/20/20b/20c
    case 'category10':
      return ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

    case 'category20':
      return ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];

    case 'category20b':
      return ['#393b79', '#5254a3', '#6b6ecf', '#9c9ede', '#637939', '#8ca252', '#b5cf6b', '#cedb9c', '#8c6d31', '#bd9e39', '#e7ba52', '#e7cb94', '#843c39', '#ad494a', '#d6616b', '#e7969c', '#7b4173', '#a55194', '#ce6dbd', '#de9ed6'];

    case 'category20c':
      return ['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d', '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476', '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc', '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9'];
  }

  // TODO add our own set of custom ordinal color palette

  if (range in colorbrewer) {
    var palette = colorbrewer[range];

    // if cardinality pre-defined, use it.
    if (cardinality in palette) return palette[cardinality];

    // if not, use the highest cardinality one for nominal
    if (type === N) {
      return palette[Math.max.apply(null, util.keys(palette))];
    }

    // otherwise, interpolate
    var ps = cardinality < 3 ? 3 : Math.max.apply(null, util.keys(palette)),
      from = 0 , to = ps - 1;
    // FIXME add config for from / to

    return scale.color.interpolate(palette[ps][from], palette[ps][to], cardinality);
  }

  return range;
};

scale.color.interpolate = function (start, end, cardinality) {

  var interpolator = interpolate(start, end);
  return util.range(cardinality).map(function(i) { return interpolator(i*1.0/(cardinality-1)); });
};

},{"../globals":33,"../schema/schema":35,"../util":37,"./sort":24,"./time":28,"colorbrewer":3,"d3-color":4}],24:[function(require,module,exports){
'use strict';

require('../globals');

var vlfield = require('../field');

module.exports = sort;

// adds new transforms that produce sorted fields
function sort(data, encoding, stats, opt) {
  // jshint unused:false

  var datasetMapping = {};

  encoding.forEach(function(field, encType) {
    var sortBy = encoding.sort(encType, stats);
    if (sortBy.length > 0) {
      var fields = sortBy.map(function(d) {
        return {
          op: d.aggregate,
          field: vlfield.fieldRef(d, {nofn: true, data: !encoding._vega2})
        };
      });

      var byClause = sortBy.map(function(d) {
        var reverse = (d.reverse ? '-' : '');
        return reverse + vlfield.fieldRef(d, {data: !encoding._vega2});
      });

      var dataName = sort.getDataName(encType);

      var transforms = [
        {
          type: 'aggregate',
          groupby: [ encoding.fieldRef(encType) ],
          fields: fields
        },
        {
          type: 'sort',
          by: byClause
        }
      ];

      data.push({
        name: dataName,
        source: RAW,
        transform: transforms
      });

      datasetMapping[encType] = dataName;
    }
  });

  return data;
}

sort.getDataName = function(encType) {
  return 'sorted-' + encType;
};


},{"../field":32,"../globals":33}],25:[function(require,module,exports){
'use strict';

require('../globals');

var  marks = require('./marks');

module.exports = stacking;

function stacking(data, encoding, mdef) {
  if (!marks[encoding.marktype()].stack) return false;

  // TODO: add || encoding.has(LOD) here once LOD is implemented
  if (!encoding.has(COLOR)) return false;

  var dim=null, val=null, idx =null,
    isXMeasure = encoding.isMeasure(X),
    isYMeasure = encoding.isMeasure(Y),
    facets = encoding.facets();

  if (isXMeasure && !isYMeasure) {
    dim = Y;
    val = X;
    idx = 0;
  } else if (isYMeasure && !isXMeasure) {
    dim = X;
    val = Y;
    idx = 1;
  } else {
    return null; // no stack encoding
  }

  // add transform to compute sums for scale
  var stacked = {
    name: STACKED,
    source: encoding.dataTable(),
    transform: [{
      type: 'aggregate',
      groupby: [encoding.fieldRef(dim)].concat(facets), // dim and other facets
      fields: [{op: 'sum', field: encoding.fieldRef(val)}] // TODO check if field with aggregate is correct?
    }]
  };

  if (facets && facets.length > 0) {
    stacked.transform.push({ //calculate max for each facet
      type: 'aggregate',
      groupby: facets,
      fields: [{
        op: 'max',
        field: encoding.fieldName(val, {fn: 'sum'})
      }]
    });
  }

  data.push(stacked);

  // add stack transform to mark
  mdef.from.transform = [{
    type: 'stack',
    point: encoding.fieldRef(dim),
    height: encoding.fieldRef(val),
    output: {y1: val, y0: val + '2'}
  }];

  // TODO: This is super hack-ish -- consolidate into modular mark properties?
  mdef.properties.update[val] = mdef.properties.enter[val] = {scale: val, field: val};
  mdef.properties.update[val + '2'] = mdef.properties.enter[val + '2'] = {scale: val, field: val + '2'};

  return val; //return stack encoding
}

},{"../globals":33,"./marks":22}],26:[function(require,module,exports){
'use strict';

require('../globals');

var vlfield = require('../field');

module.exports = function(encoding, stats) {
  return {
    opacity: estimateOpacity(encoding, stats),
  };
};

function estimateOpacity(encoding,stats) {
  if (!stats) {
    return 1;
  }

  var numPoints = 0;

  if (encoding.isAggregate()) { // aggregate plot
    numPoints = 1;

    //  get number of points in each "cell"
    //  by calculating product of cardinality
    //  for each non faceting and non-ordinal X / Y fields
    //  note that ordinal x,y are not include since we can
    //  consider that ordinal x are subdividing the cell into subcells anyway
    encoding.forEach(function(field, encType) {

      if (encType !== ROW && encType !== COL &&
          !((encType === X || encType === Y) &&
          vlfield.isOrdinalScale(field))
        ) {
        numPoints *= encoding.cardinality(encType, stats);
      }
    });

  } else { // raw plot

    // TODO: error handling
    if (!stats['*'])
      return 1;

    numPoints = stats['*'].max;  // count

    // small multiples divide number of points
    var numMultiples = 1;
    if (encoding.has(ROW)) {
      numMultiples *= encoding.cardinality(ROW, stats);
    }
    if (encoding.has(COL)) {
      numMultiples *= encoding.cardinality(COL, stats);
    }
    numPoints /= numMultiples;
  }

  var opacity = 0;
  if (numPoints <= 25) {
    opacity = 1;
  } else if (numPoints < 200) {
    opacity = 0.8;
  } else if (numPoints < 1000 || encoding.is('tick')) {
    opacity = 0.7;
  } else {
    opacity = 0.3;
  }

  return opacity;
}


},{"../field":32,"../globals":33}],27:[function(require,module,exports){
'use strict';

require('../globals');

var groupdef = require('./group').def;

module.exports = subfaceting;

function subfaceting(group, mdef, details, stack, encoding) {
  var m = group.marks,
    g = groupdef('subfacet', {marks: m});

  group.marks = [g];
  g.from = mdef.from;
  delete mdef.from;

  //TODO test LOD -- we should support stack / line without color (LOD) field
  var trans = (g.from.transform || (g.from.transform = []));
  trans.unshift({type: 'facet', keys: details});

  if (stack && encoding.has(COLOR)) {
    trans.unshift({type: 'sort', by: encoding.fieldRef(COLOR)});
  }
}

},{"../globals":33,"./group":19}],28:[function(require,module,exports){
'use strict';

var util = require('../util'),
  d3_time_format = require('d3-time-format');

var time = module.exports = {};

var LONG_DATE = new Date(2014, 8, 17);

time.cardinality = function(field, stats, filterNull, type) {
  var timeUnit = field.timeUnit;
  switch (timeUnit) {
    case 'seconds': return 60;
    case 'minutes': return 60;
    case 'hours': return 24;
    case 'day': return 7;
    case 'date': return 31;
    case 'month': return 12;
    case 'year':
      var stat = stats[field.name],
        yearstat = stats['year_'+field.name];

      if (!yearstat) { return null; }

      return yearstat.distinct -
        (stat.nulls > 0 && filterNull[type] ? 1 : 0);
  }

  return null;
};

time.formula = function(timeUnit, fieldRef) {
  // TODO(kanitw): add formula to other time format
  var fn = 'utc' + timeUnit;
  return fn + '(' + fieldRef + ')';
};

time.maxLength = function(timeUnit, encoding) {
  switch (timeUnit) {
    case 'seconds':
    case 'minutes':
    case 'hours':
    case 'date':
      return 2;
    case 'month':
    case 'day':
      var range = time.range(timeUnit, encoding);
      if (range) {
        // return the longest name in the range
        return Math.max.apply(null, range.map(function(r) {return r.length;}));
      }
      return 2;
    case 'year':
      return 4; //'1998'
  }
  // no time unit
  var timeFormat = encoding.config('timeFormat');
  return d3_time_format.utcFormat(timeFormat)(LONG_DATE).length;
};

time.range = function(timeUnit, encoding) {
  var labelLength = encoding.config('timeScaleLabelLength'),
    scaleLabel;
  switch (timeUnit) {
    case 'day':
      scaleLabel = encoding.config('dayScaleLabel');
      break;
    case 'month':
      scaleLabel = encoding.config('monthScaleLabel');
      break;
  }
  if (scaleLabel) {
    return labelLength ? scaleLabel.map(
        function(s) { return s.substr(0, labelLength);}
      ) : scaleLabel;
  }
  return;
};


/**
 * @param  {Object} encoding
 * @return {Array}  scales for time unit names
 */
time.scales = function(encoding) {
  var scales = encoding.reduce(function(scales, field) {
    var timeUnit = field.timeUnit;
    if (field.type === T && timeUnit && !scales[timeUnit]) {
      var scale = time.scale.def(field.timeUnit, encoding);
      if (scale) scales[timeUnit] = scale;
    }
    return scales;
  }, {});

  return util.vals(scales);
};


time.scale = {};

/** append custom time scales for axis label */
time.scale.def = function(timeUnit, encoding) {
  var range = time.range(timeUnit, encoding);

  if (range) {
    return {
      name: 'time-'+timeUnit,
      type: 'ordinal',
      domain: time.scale.domain(timeUnit),
      range: range
    };
  }
  return null;
};

time.isOrdinalFn = function(timeUnit) {
  switch (timeUnit) {
    case 'seconds':
    case 'minutes':
    case 'hours':
    case 'day':
    case 'date':
    case 'month':
      return true;
  }
  return false;
};

time.scale.type = function(timeUnit, name) {
  if (name === COLOR) {
    return 'linear'; // time has order, so use interpolated ordinal color scale.
  }

  return time.isOrdinalFn(timeUnit) || name === COL || name === ROW ? 'ordinal' : 'linear';
};

time.scale.domain = function(timeUnit, name) {
  var isColor = name === COLOR;
  switch (timeUnit) {
    case 'seconds':
    case 'minutes': return isColor ? [0,59] : util.range(0, 60);
    case 'hours': return isColor ? [0,23] : util.range(0, 24);
    case 'day': return isColor ? [0,6] : util.range(0, 7);
    case 'date': return isColor ? [1,31] : util.range(1, 32);
    case 'month': return isColor ? [0,11] : util.range(0, 12);
  }
  return null;
};

/** whether a particular time function has custom scale for labels implemented in time.scale */
time.hasScale = function(timeUnit) {
  switch (timeUnit) {
    case 'day':
    case 'month':
      return true;
  }
  return false;
};

},{"../util":37,"d3-time-format":6}],29:[function(require,module,exports){
'use strict';

require('./globals');

var consts = module.exports = {};

consts.encodingTypes = [X, Y, ROW, COL, SIZE, SHAPE, COLOR, TEXT, DETAIL];

consts.shorthand = {
  delim:  '|',
  assign: '=',
  type:   ',',
  func:   '_'
};

},{"./globals":33}],30:[function(require,module,exports){
'use strict';

require('./globals');

var stats = require('datalib/src/stats');

var vldata = module.exports = {};

/** Mapping from datalib's inferred type to Vega-lite's type */
vldata.types = {
  'boolean': N,
  'number': Q,
  'integer': Q,
  'date': T,
  'string': N
};

vldata.stats = function(data) {
  var summary = stats.summary(data);

  return summary.reduce(function(s, profile) {
    s[profile.field] = profile;
    return s;
  }, {
    '*': {
      max: data.length,
      min: 0
    }
  });
};
},{"./globals":33,"datalib/src/stats":11}],31:[function(require,module,exports){
// utility for enc

'use strict';

var consts = require('./consts'),
  c = consts.shorthand,
  vlfield = require('./field'),
  util = require('./util'),
  schema = require('./schema/schema'),
  encTypes = schema.encTypes;

var vlenc = module.exports = {};

vlenc.countRetinal = function(enc) {
  var count = 0;
  if (enc.color) count++;
  if (enc.size) count++;
  if (enc.shape) count++;
  return count;
};

vlenc.has = function(enc, encType) {
  var fieldDef = enc && enc[encType];
  return fieldDef && fieldDef.name;
};

vlenc.isAggregate = function(enc) {
  for (var k in enc) {
    if (vlenc.has(enc, k) && enc[k].aggregate) {
      return true;
    }
  }
  return false;
};

vlenc.forEach = function(enc, f) {
  var i = 0;
  encTypes.forEach(function(k) {
    if (vlenc.has(enc, k)) {
      f(enc[k], k, i++);
    }
  });
};

vlenc.map = function(enc, f) {
  var arr = [];
  encTypes.forEach(function(k) {
    if (vlenc.has(enc, k)) {
      arr.push(f(enc[k], k, enc));
    }
  });
  return arr;
};

vlenc.reduce = function(enc, f, init) {
  var r = init;
  encTypes.forEach(function(k) {
    if (vlenc.has(enc, k)) {
      r = f(r, enc[k], k,  enc);
    }
  });
  return r;
};

/*
 * return key-value pairs of field name and list of fields of that field name
 */
vlenc.fields = function(enc) {
  return vlenc.reduce(enc, function (m, field) {
    var fieldList = m[field.name] = m[field.name] || [],
      containsType = fieldList.containsType = fieldList.containsType || {};

    if (fieldList.indexOf(field) === -1) {
      fieldList.push(field);
      // augment the array with containsType.Q / O / N / T
      containsType[field.type] = true;
    }
    return m;
  }, {});
};

vlenc.shorthand = function(enc) {
  return vlenc.map(enc, function(field, et) {
    return et + c.assign + vlfield.shorthand(field);
  }).join(c.delim);
};

vlenc.fromShorthand = function(shorthand) {
  var enc = util.isArray(shorthand) ? shorthand : shorthand.split(c.delim);
  return enc.reduce(function(m, e) {
    var split = e.split(c.assign),
        enctype = split[0].trim(),
        field = split[1];

    m[enctype] = vlfield.fromShorthand(field);
    return m;
  }, {});
};
},{"./consts":29,"./field":32,"./schema/schema":35,"./util":37}],32:[function(require,module,exports){
'use strict';

// utility for field

require('./globals');

var consts = require('./consts'),
  c = consts.shorthand,
  time = require('./compiler/time'),
  util = require('./util'),
  schema = require('./schema/schema');

var vlfield = module.exports = {};

/**
 * @param field
 * @param opt
 *   opt.nofn -- exclude bin, aggregate, timeUnit
 *   opt.data - include 'data.'
 *   opt.d - include 'd.'
 *   opt.fn - replace fn with custom function prefix
 *   opt.prefn - prepend fn with custom function prefix

 * @return {[type]}       [description]
 */
vlfield.fieldRef = function(field, opt) {
  opt = opt || {};

  var f = (opt.d ? 'd.' : '') +
          (opt.data ? 'data.' : '') +
          (opt.prefn || ''),
    nofn = opt.nofn || opt.fn,
    name = field.name;

  if (vlfield.isCount(field)) {
    return f + 'count';
  } else if (!nofn && field.bin) {
    return f + 'bin_' + name;
  } else if (!nofn && field.aggregate) {
    return f + field.aggregate + '_' + name;
  } else if (!nofn && field.timeUnit) {
    return f + field.timeUnit + '_' + name;
  } else if (opt.fn) {
    return f + opt.fn + '_' + name;
  } else {
    return f + name;
  }
};

vlfield.shorthand = function(f) {
  var c = consts.shorthand;
  return (f.aggregate ? f.aggregate + c.func : '') +
    (f.timeUnit ? f.timeUnit + c.func : '') +
    (f.bin ? 'bin' + c.func : '') +
    (f.name || '') + c.type + f.type;
};

vlfield.shorthands = function(fields, delim) {
  delim = delim || c.delim;
  return fields.map(vlfield.shorthand).join(delim);
};

vlfield.fromShorthand = function(shorthand) {
  var split = shorthand.split(c.type), i;
  var o = {
    name: split[0].trim(),
    type: split[1].trim()
  };

  // check aggregate type
  for (i in schema.aggregate.enum) {
    var a = schema.aggregate.enum[i];
    if (o.name.indexOf(a + '_') === 0) {
      o.name = o.name.substr(a.length + 1);
      if (a == 'count' && o.name.length === 0) o.name = '*';
      o.aggregate = a;
      break;
    }
  }

  // check time timeUnit
  for (i in schema.timefns) {
    var tu = schema.timefns[i];
    if (o.name && o.name.indexOf(tu + '_') === 0) {
      o.name = o.name.substr(o.length + 1);
      o.timeUnit = tu;
      break;
    }
  }

  // check bin
  if (o.name && o.name.indexOf('bin_') === 0) {
    o.name = o.name.substr(4);
    o.bin = true;
  }

  return o;
};

var isType = vlfield.isType = function (fieldDef, type) {
  return fieldDef.type === type;
};

var isTypes = vlfield.isTypes = function (fieldDef, types) {
  for (var t=0; t<types.length; t++) {
    if(fieldDef.type === types[t]) return true;
  }
  return false;
};

/*
 * Most fields that use ordinal scale are dimensions.
 * However, YEAR(T), YEARMONTH(T) use time scale, not ordinal but are dimensions too.
 */
vlfield.isOrdinalScale = function(field) {
  return  isTypes(field, [N, O]) || field.bin ||
    ( isType(field, T) && field.timeUnit && time.isOrdinalFn(field.timeUnit) );
};

function isDimension(field) {
  return  isTypes(field, [N, O]) || !!field.bin ||
    ( isType(field, T) && !!field.timeUnit );
}

/**
 * For encoding, use encoding.isDimension() to avoid confusion.
 * Or use Encoding.isType if your field is from Encoding (and thus have numeric data type).
 * otherwise, do not specific isType so we can use the default isTypeName here.
 */
vlfield.isDimension = function(field) {
  return field && isDimension(field);
};

vlfield.isMeasure = function(field) {
  return field && !isDimension(field);
};

vlfield.count = function() {
  return {name:'*', aggregate: 'count', type: Q, displayName: vlfield.count.displayName};
};

vlfield.count.displayName = 'Number of Records';

vlfield.isCount = function(field) {
  return field.aggregate === 'count';
};

/**
 * For encoding, use encoding.cardinality() to avoid confusion.  Or use Encoding.isType if your field is from Encoding (and thus have numeric data type).
 * otherwise, do not specific isType so we can use the default isTypeName here.
 */
vlfield.cardinality = function(field, stats, filterNull) {
  // FIXME need to take filter into account

  var stat = stats[field.name];
  var type = field.type;

  filterNull = filterNull || {};

  if (field.bin) {
    var bins = util.getbins(stat, field.bin.maxbins || schema.MAXBINS_DEFAULT);
    return (bins.stop - bins.start) / bins.step;
  }
  if (isType(field, T)) {
    var cardinality = time.cardinality(field, stats, filterNull, type);
    if(cardinality !== null) return cardinality;
    //otherwise use calculation below
  }
  if (field.aggregate) {
    return 1;
  }

  // remove null
  return stat.distinct -
    (stat.nulls > 0 && filterNull[type] ? 1 : 0);
};

},{"./compiler/time":28,"./consts":29,"./globals":33,"./schema/schema":35,"./util":37}],33:[function(require,module,exports){
(function (global){
'use strict';

// declare global constant
var g = global || window;

g.AGGREGATE = 'aggregate';
g.RAW = 'raw';
g.STACKED = 'stacked';
g.INDEX = 'index';

g.X = 'x';
g.Y = 'y';
g.ROW = 'row';
g.COL = 'col';
g.SIZE = 'size';
g.SHAPE = 'shape';
g.COLOR = 'color';
g.TEXT = 'text';
g.DETAIL = 'detail';

g.N = 'N';
g.O = 'O';
g.Q = 'Q';
g.T = 'T';

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],34:[function(require,module,exports){
'use strict';

// TODO(kanitw): chat with Vega team and possibly move this to vega-logging
module.exports = function(prefix) {
  // Borrowed some ideas from http://stackoverflow.com/a/15653260/866989
  // and https://github.com/patik/console.log-wrapper/blob/master/consolelog.js
  var METHODS = ['error', 'info', 'debug', 'warn', 'log'];

  return METHODS.reduce(function(logger, fn) {
    var cfn = console[fn] ? fn : 'log';
    if (console[cfn].bind === 'undefined') { // IE < 10
        logger[fn] = Function.prototype.bind.call(console[cfn], console, prefix);
    }
    else {
        logger[fn] = console[cfn].bind(console, prefix);
    }
    return logger;
  }, {});
};
},{}],35:[function(require,module,exports){
// Package of defining Vega-lite Specification's json schema
'use strict';

require('../globals');

var schema = module.exports = {},
  util = require('../util'),
  toMap = util.toMap,
  colorbrewer = require('colorbrewer');

schema.util = require('./schemautil');

schema.marktype = {
  type: 'string',
  enum: ['point', 'tick', 'bar', 'line', 'area', 'circle', 'square', 'text']
};

schema.aggregate = {
  type: 'string',
  enum: ['avg', 'sum', 'median', 'min', 'max', 'count'],
  supportedEnums: {
    Q: ['avg', 'median', 'sum', 'min', 'max', 'count'],
    O: ['median','min','max'],
    N: [],
    T: ['avg', 'median', 'min', 'max'],
    '': ['count']
  },
  supportedTypes: toMap([Q, N, O, T, ''])
};

schema.getSupportedRole = function(encType) {
  return schema.schema.properties.encoding.properties[encType].supportedRole;
};

schema.timeUnits = ['year', 'month', 'day', 'date', 'hours', 'minutes', 'seconds'];

schema.defaultTimeFn = 'month';

schema.timeUnit = {
  type: 'string',
  enum: schema.timeUnits,
  supportedTypes: toMap([T])
};

schema.scale_type = {
  type: 'string',
  // TODO(kanitw) read vega's schema here, add description
  enum: ['linear', 'log', 'pow', 'sqrt', 'quantile'],
  default: 'linear',
  supportedTypes: toMap([Q])
};

schema.field = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    }
  }
};

var clone = util.duplicate;
var merge = schema.util.merge;

schema.MAXBINS_DEFAULT = 15;

var bin = {
  type: ['boolean', 'object'],
  default: false,
  properties: {
    maxbins: {
      type: 'integer',
      default: schema.MAXBINS_DEFAULT,
      minimum: 2,
      description: 'Maximum number of bins.'
    }
  },
  supportedTypes: toMap([Q]) // TODO: add O after finishing #81
};

var typicalField = merge(clone(schema.field), {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: [N, O, Q, T]
    },
    aggregate: schema.aggregate,
    timeUnit: schema.timeUnit,
    bin: bin,
    scale: {
      type: 'object',
      properties: {
        type: schema.scale_type,
        reverse: {
          type: 'boolean',
          default: false,
          supportedTypes: toMap([Q, T])
        },
        zero: {
          type: 'boolean',
          description: 'Include zero',
          default: true,
          supportedTypes: toMap([Q, T])
        },
        nice: {
          type: 'string',
          enum: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'],
          supportedTypes: toMap([T])
        },
        useRawDomain: {
          type: 'boolean',
          default: undefined,
          description: 'Use the raw data range as scale domain instead of ' +
                       'aggregated data for aggregate axis. ' +
                       'This option does not work with sum or count aggregate' +
                       'as they might have a substantially larger scale range.' +
                       'By default, use value from config.useRawDomain.'
        }
      }
    }
  }
});

var onlyOrdinalField = merge(clone(schema.field), {
  type: 'object',
  supportedRole: {
    dimension: true
  },
  properties: {
    type: {
      type: 'string',
      enum: [N, O, Q, T] // ordinal-only field supports Q when bin is applied and T when time unit is applied.
    },
    timeUnit: schema.timeUnit,
    bin: bin,
    aggregate: {
      type: 'string',
      enum: ['count'],
      supportedTypes: toMap([N, O]) // FIXME this looks weird to me
    }
  }
});

var axisMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true},
  properties: {
    axis: {
      type: 'object',
      properties: {
        grid: {
          type: 'boolean',
          default: true,
          description: 'A flag indicate if gridlines should be created in addition to ticks.'
        },
        layer: {
          type: 'string',
          default: 'back',
          description: 'A string indicating if the axis (and any gridlines) should be placed above or below the data marks.'
        },
        orient: {
          type: 'string',
          default: undefined,
          enum: ['top', 'right', 'left', 'bottom'],
          description: 'The orientation of the axis. One of top, bottom, left or right. The orientation can be used to further specialize the axis type (e.g., a y axis oriented for the right edge of the chart).'
        },
        ticks: {
          type: 'integer',
          default: 5,
          minimum: 0,
          description: 'A desired number of ticks, for axes visualizing quantitative scales. The resulting number may be different so that values are "nice" (multiples of 2, 5, 10) and lie within the underlying scale\'s range.'
        },
        title: {
          type: 'string',
          default: undefined,
          description: 'A title for the axis. (Shows field name and its function by default.)'
        },
        titleMaxLength: {
          type: 'integer',
          default: undefined,
          minimum: 0,
          description: 'Max length for axis title if the title is automatically generated from the field\'s description'
        },
        titleOffset: {
          type: 'integer',
          default: undefined,  // auto
          description: 'A title offset value for the axis.'
        },
        format: {
          type: 'string',
          default: undefined,  // auto
          description: 'The formatting pattern for axis labels. '+
                       'If not undefined, this will be determined by ' +
                       'small/largeNumberFormat and the max value ' +
                       'of the field.'
        },
        maxLabelLength: {
          type: 'integer',
          default: 25,
          minimum: 0,
          description: 'Truncate labels that are too long.'
        },
        labelAngle: {
          type: 'integer',
          default: undefined, // auto
          minimum: 0,
          maximum: 360,
          description: 'Angle by which to rotate labels. Set to 0 to force horizontal.'
        },
      }
    }
  }
};

var sortMixin = {
  type: 'object',
  properties: {
    sort: {
      type: 'array',
      default: [],
      items: {
        type: 'object',
        supportedTypes: toMap([N, O]),
        required: ['name', 'aggregate'],
        properties: {
          name: {
            type: 'string'
          },
          aggregate: {
            type: 'string',
            enum: ['avg', 'sum', 'min', 'max', 'count']
          },
          reverse: {
            type: 'boolean',
            default: false
          }
        }
      }
    }
  }
};

var bandMixin = {
  type: 'object',
  properties: {
    band: {
      type: 'object',
      properties: {
        size: {
          type: 'integer',
          minimum: 0,
          default: undefined
        },
        padding: {
          type: 'integer',
          minimum: 0,
          default: 1
        }
      }
    }
  }
};

var legendMixin = {
  type: 'object',
  properties: {
    legend: {
      type: 'object',
      description: 'Properties of a legend.',
      properties: {
        title: {
          type: 'string',
          default: undefined,
          description: 'A title for the legend. (Shows field name and its function by default.)'
        }
      }
    }
  }
};

var textMixin = {
  type: 'object',
  supportedMarktypes: {'text': true},
  properties: {
    align: {
      type: 'string',
      default: 'right'
    },
    baseline: {
      type: 'string',
      default: 'middle'
    },
    color: {
      type: 'string',
      role: 'color',
      default: '#000000'
    },
    margin: {
      type: 'integer',
      default: 4,
      minimum: 0
    },
    placeholder: {
      type: 'string',
      default: 'Abc'
    },
    font: {
      type: 'object',
      properties: {
        weight: {
          type: 'string',
          enum: ['normal', 'bold'],
          default: 'normal'
        },
        size: {
          type: 'integer',
          default: 10,
          minimum: 0
        },
        family: {
          type: 'string',
          default: 'Helvetica Neue'
        },
        style: {
          type: 'string',
          default: 'normal',
          enum: ['normal', 'italic']
        }
      }
    },
    format: {
      type: 'string',
      default: undefined,  // auto
      description: 'The formatting pattern for text value. '+
                   'If not undefined, this will be determined by ' +
                   'small/largeNumberFormat and the max value ' +
                   'of the field.'
    },
  }
};

var sizeMixin = {
  type: 'object',
  supportedMarktypes: {point: true, bar: true, circle: true, square: true, text: true},
  properties: {
    value: {
      type: 'integer',
      default: 30,
      minimum: 0,
      description: 'Size of marks.'
    }
  }
};

var colorMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true, 'text': true},
  properties: {
    value: {
      type: 'string',
      role: 'color',
      default: '#4682b4',
      description: 'Color to be used for marks.'
    },
    opacity: {
      type: 'number',
      default: undefined,  // auto
      minimum: 0,
      maximum: 1
    },
    scale: {
      type: 'object',
      properties: {
        range: {
          type: ['string', 'array'],
          default: undefined,
          description:
            'Color palette, if undefined vega-lite will use data property' +
            'to pick one from c10palette, c20palette, or ordinalPalette.'
            //FIXME
        },
        c10palette: {
          type: 'string',
          default: 'category10',
          enum: [
            // Tableau
            'category10', 'category10k',
            // Color Brewer
            'Pastel1', 'Pastel2', 'Set1', 'Set2', 'Set3'
          ]
        },
        c20palette: {
          type: 'string',
          default: 'category20',
          enum: ['category20', 'category20b', 'category20c']
        },
        ordinalPalette: {
          type: 'string',
          default: undefined,
          description: 'Color palette to encode ordinal variables.',
          enum: util.keys(colorbrewer)
        },
        quantitativeRange: {
          type: 'array',
          default: ['#AFC6A3', '#09622A'], // tableau greens
          // default: ['#ccece6', '#00441b'], // BuGn.9 [2-8]
          description: 'Color range to encode quantitative variables.',
          minItems: 2,
          maxItems: 2,
          items: {
            type: 'string',
            role: 'color'
          }
        }
      }
    }
  }
};

var shapeMixin = {
  type: 'object',
  supportedMarktypes: {point: true, circle: true, square: true},
  properties: {
    value: {
      type: 'string',
      enum: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down'],
      default: 'circle',
      description: 'Mark to be used.'
    },
    filled: {
      type: 'boolean',
      default: false,
      description: 'Whether the shape\'s color should be used as fill color instead of stroke color.'
    }
  }
};

var detailMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, line: true, circle: true, square: true}
};

var rowMixin = {
  properties: {
    height: {
      type: 'number',
      minimum: 0,
      default: 150
    }
  }
};

var colMixin = {
  properties: {
    width: {
      type: 'number',
      minimum: 0,
      default: 150
    },
    axis: {
      properties: {
        maxLabelLength: {
          type: 'integer',
          default: 12,
          minimum: 0,
          description: 'Truncate labels that are too long.'
        }
      }
    }
  }
};

var facetMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true, text: true},
  properties: {
    padding: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      default: 0.1
    }
  }
};

var requiredNameType = {
  required: ['name', 'type']
};

var multiRoleField = merge(clone(typicalField), {
  supportedRole: {
    measure: true,
    dimension: true
  }
});

var quantitativeField = merge(clone(typicalField), {
  supportedRole: {
    measure: true,
    dimension: 'ordinal-only' // using size to encoding category lead to order interpretation
  }
});

var onlyQuantitativeField = merge(clone(typicalField), {
  supportedRole: {
    measure: true
  }
});

var x = merge(clone(multiRoleField), axisMixin, bandMixin, requiredNameType, sortMixin);
var y = clone(x);

var facet = merge(clone(onlyOrdinalField), requiredNameType, facetMixin, sortMixin);
var row = merge(clone(facet), axisMixin, rowMixin);
var col = merge(clone(facet), axisMixin, colMixin);

var size = merge(clone(quantitativeField), legendMixin, sizeMixin, sortMixin);
var color = merge(clone(multiRoleField), legendMixin, colorMixin, sortMixin);

var shape = merge(clone(onlyOrdinalField), legendMixin, shapeMixin, sortMixin);
var detail = merge(clone(onlyOrdinalField), detailMixin, sortMixin);

// we only put aggregated measure in pivot table
var text = merge(clone(onlyQuantitativeField), textMixin, sortMixin);

// TODO add label

var filter = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      operands: {
        type: 'array',
        items: {
          type: ['string', 'boolean', 'integer', 'number']
        }
      },
      operator: {
        type: 'string',
        enum: ['>', '>=', '=', '!=', '<', '<=', 'notNull']
      }
    }
  }
};

var data = {
  type: 'object',
  properties: {
    // data source
    formatType: {
      type: 'string',
      enum: ['json', 'csv'],
      default: 'json'
    },
    url: {
      type: 'string',
      default: undefined
    },
    values: {
      type: 'array',
      default: undefined,
      description: 'Pass array of objects instead of a url to a file.',
      items: {
        type: 'object',
        additionalProperties: true
      }
    }
  }
};

var config = {
  type: 'object',
  properties: {
    // template
    width: {
      type: 'integer',
      default: undefined
    },
    height: {
      type: 'integer',
      default: undefined
    },
    viewport: {
      type: 'array',
      items: {
        type: 'integer'
      },
      default: undefined
    },
    gridColor: {
      type: 'string',
      role: 'color',
      default: '#000000'
    },
    gridOpacity: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      default: 0.08
    },

    // filter null
    filterNull: {
      type: 'object',
      properties: {
        O: {type:'boolean', default: false},
        Q: {type:'boolean', default: true},
        T: {type:'boolean', default: true}
      }
    },
    toggleSort: {
      type: 'string',
      default: O
    },
    autoSortLine: {
      type: 'boolean',
      default: true
    },

    // single plot
    singleHeight: {
      // will be overwritten by bandWidth * (cardinality + padding)
      type: 'integer',
      default: 200,
      minimum: 0
    },
    singleWidth: {
      // will be overwritten by bandWidth * (cardinality + padding)
      type: 'integer',
      default: 200,
      minimum: 0
    },
    // band size
    largeBandSize: {
      type: 'integer',
      default: 21,
      minimum: 0
    },
    smallBandSize: {
      //small multiples or single plot with high cardinality
      type: 'integer',
      default: 12,
      minimum: 0
    },
    largeBandMaxCardinality: {
      type: 'integer',
      default: 10
    },
    // small multiples
    cellPadding: {
      type: 'number',
      default: 0.1
    },
    cellGridColor: {
      type: 'string',
      role: 'color',
      default: '#000000'
    },
    cellGridOpacity: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      default: 0.15
    },
    cellBackgroundColor: {
      type: 'string',
      role: 'color',
      default: 'rgba(0,0,0,0)'
    },
    textCellWidth: {
      type: 'integer',
      default: 90,
      minimum: 0
    },

    // marks
    strokeWidth: {
      type: 'integer',
      default: 2,
      minimum: 0
    },
    singleBarOffset: {
      type: 'integer',
      default: 5,
      minimum: 0
    },
    // scales
    timeScaleLabelLength: {
      type: 'integer',
      default: 3,
      minimum: 0,
      description: 'Max length for values in dayScaleLabel and monthScaleLabel.  Zero means using full names in dayScaleLabel/monthScaleLabel.'
    },
    dayScaleLabel: {
      type: 'array',
      items: {
        type: 'string'
      },
      default: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      description: 'Axis labels for day of week, starting from Sunday.' +
        '(Consistent with Javascript -- See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay.'
    },
    monthScaleLabel: {
      type: 'array',
      items: {
        type: 'string'
      },
      default: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      description: 'Axis labels for month.'
    },
    // other
    characterWidth: {
      type: 'integer',
      default: 6
    },
    maxSmallNumber: {
      type: 'number',
      default: 10000,
      description: 'maximum number that a field will be considered smallNumber.'+
                   'Used for axis labelling.'
    },
    smallNumberFormat: {
      type: 'string',
      default: '',
      description: 'D3 Number format for axis labels and text tables '+
                   'for number <= maxSmallNumber. Used for axis labelling.'
    },
    largeNumberFormat: {
      type: 'string',
      default: '.3s',
      description: 'D3 Number format for axis labels and text tables ' +
                   'for number > maxSmallNumber.'
    },
    timeFormat: {
      type: 'string',
      default: '%Y-%m-%d',
      description: 'Date format for axis labels.'
    },
    useRawDomain: {
      type: 'boolean',
      default: false,
      description: 'Use the raw data range as scale domain instead of ' +
                   'aggregated data for aggregate axis. ' +
                   'This option does not work with sum or count aggregate' +
                   'as they might have a substantially larger scale range.' +
                   'By default, use value from config.useRawDomain.'
    }
  }
};

/** @type Object Schema of a vega-lite specification */
schema.schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: 'Schema for Vega-lite specification',
  type: 'object',
  required: ['marktype', 'encoding', 'data'],
  properties: {
    data: data,
    marktype: schema.marktype,
    encoding: {
      type: 'object',
      properties: {
        x: x,
        y: y,
        row: row,
        col: col,
        size: size,
        color: color,
        shape: shape,
        text: text,
        detail: detail
      }
    },
    filter: filter,
    config: config
  }
};

schema.encTypes = util.keys(schema.schema.properties.encoding.properties);

/** Instantiate a verbose vl spec from the schema */
schema.instantiate = function() {
  return schema.util.instantiate(schema.schema);
};

},{"../globals":33,"../util":37,"./schemautil":36,"colorbrewer":3}],36:[function(require,module,exports){
'use strict';

var schemautil = module.exports = {},
  util = require('../util');

var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
};

schemautil.extend = function(instance, schema) {
  return schemautil.merge(schemautil.instantiate(schema), instance);
};

// instantiate a schema
schemautil.instantiate = function(schema) {
  var val;
  if (schema === undefined) {
    return undefined;
  } else if ('default' in schema) {
    val = schema.default;
    return util.isObject(val) ? util.duplicate(val) : val;
  } else if (schema.type === 'object') {
    var instance = {};
    for (var name in schema.properties) {
      val = schemautil.instantiate(schema.properties[name]);
      if (val !== undefined) {
        instance[name] = val;
      }
    }
    return instance;
  } else if (schema.type === 'array') {
    return [];
  }
  return undefined;
};

// remove all defaults from an instance
schemautil.subtract = function(instance, defaults) {
  var changes = {};
  for (var prop in instance) {
    var def = defaults[prop];
    var ins = instance[prop];
    // Note: does not properly subtract arrays
    if (!defaults || def !== ins) {
      if (typeof ins === 'object' && !util.isArray(ins) && def) {
        var c = schemautil.subtract(ins, def);
        if (!isEmpty(c))
          changes[prop] = c;
      } else if (!util.isArray(ins) || ins.length > 0) {
        changes[prop] = ins;
      }
    }
  }
  return changes;
};

schemautil.merge = function(/*dest*, src0, src1, ...*/){
  var dest = arguments[0];
  for (var i=1 ; i<arguments.length; i++) {
    dest = merge(dest, arguments[i]);
  }
  return dest;
};

// recursively merges src into dest
function merge(dest, src) {
  if (typeof src !== 'object' || src === null) {
    return dest;
  }

  for (var p in src) {
    if (!src.hasOwnProperty(p)) {
      continue;
    }
    if (src[p] === undefined) {
      continue;
    }
    if (typeof src[p] !== 'object' || src[p] === null) {
      dest[p] = src[p];
    } else if (typeof dest[p] !== 'object' || dest[p] === null) {
      dest[p] = merge(src[p].constructor === Array ? [] : {}, src[p]);
    } else {
      merge(dest[p], src[p]);
    }
  }
  return dest;
}
},{"../util":37}],37:[function(require,module,exports){
'use strict';

var util = module.exports = require('datalib/src/util');

util.extend(util, require('datalib/src/generate'));
util.extend(util, require('datalib/src/stats'));
util.extend(util, require('./logger')('[VL Error]'));
util.bin = require('datalib/src/bins/bins');

util.isin = function(item, array) {
  return array.indexOf(item) !== -1;
};

util.forEach = function(obj, f, thisArg) {
  if (obj.forEach) {
    obj.forEach.call(thisArg, f);
  } else {
    for (var k in obj) {
      f.call(thisArg, obj[k], k , obj);
    }
  }
};

util.reduce = function(obj, f, init, thisArg) {
  if (obj.reduce) {
    return obj.reduce.call(thisArg, f, init);
  } else {
    for (var k in obj) {
      init = f.call(thisArg, init, obj[k], k, obj);
    }
    return init;
  }
};

util.map = function(obj, f, thisArg) {
  if (obj.map) {
    return obj.map.call(thisArg, f);
  } else {
    var output = [];
    for (var k in obj) {
      output.push( f.call(thisArg, obj[k], k, obj));
    }
  }
};

util.any = function(arr, f) {
  var i = 0, k;
  for (k in arr) {
    if (f(arr[k], k, i++)) return true;
  }
  return false;
};

util.all = function(arr, f) {
  var i = 0, k;
  for (k in arr) {
    if (!f(arr[k], k, i++)) return false;
  }
  return true;
};

util.getbins = function(stats, maxbins) {
  return util.bin({
    min: stats.min,
    max: stats.max,
    maxbins: maxbins
  });
};

/**
 * x[p[0]]...[p[n]] = val
 * @param noaugment determine whether new object should be added f
 * or non-existing properties along the path
 */
util.setter = function(x, p, val, noaugment) {
  for (var i=0; i<p.length-1; ++i) {
    if (!noaugment && !(p[i] in x)){
      x = x[p[i]] = {};
    } else {
      x = x[p[i]];
    }
  }
  x[p[i]] = val;
};


/**
 * returns x[p[0]]...[p[n]]
 * @param augment determine whether new object should be added f
 * or non-existing properties along the path
 */
util.getter = function(x, p, noaugment) {
  for (var i=0; i<p.length; ++i) {
    if (!noaugment && !(p[i] in x)){
      x = x[p[i]] = {};
    } else {
      x = x[p[i]];
    }
  }
  return x;
};


},{"./logger":34,"datalib/src/bins/bins":8,"datalib/src/generate":9,"datalib/src/stats":11,"datalib/src/util":13}],38:[function(require,module,exports){
'use strict';

require('./globals');

var util = require('./util'),
    consts = require('./consts');

var vl = {};

util.extend(vl, consts, util);

vl.Encoding = require('./Encoding');
vl.compiler = require('./compiler/compiler');
vl.compile = vl.compiler.compile;
vl.data = require('./data');
vl.enc = require('./enc');
vl.field = require('./field');
vl.schema = require('./schema/schema');
vl.toShorthand = vl.Encoding.shorthand;
vl.format = require('d3-format').format;

module.exports = vl;
},{"./Encoding":14,"./compiler/compiler":16,"./consts":29,"./data":30,"./enc":31,"./field":32,"./globals":33,"./schema/schema":35,"./util":37,"d3-format":5}]},{},[38])(38)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2NvbG9yYnJld2VyL2NvbG9yYnJld2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvbG9yYnJld2VyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2QzLWNvbG9yL2J1aWxkL2NvbG9yLmpzIiwibm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9idWlsZC9mb3JtYXQuanMiLCJub2RlX21vZHVsZXMvZDMtdGltZS1mb3JtYXQvYnVpbGQvdGltZUZvcm1hdC5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL25vZGVfbW9kdWxlcy9kMy10aW1lL2J1aWxkL3RpbWUuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvYmlucy9iaW5zLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL2dlbmVyYXRlLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL2ltcG9ydC90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL3N0YXRzLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL3RpbWUuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvdXRpbC5qcyIsInNyYy9FbmNvZGluZy5qcyIsInNyYy9jb21waWxlci9heGlzLmpzIiwic3JjL2NvbXBpbGVyL2NvbXBpbGVyLmpzIiwic3JjL2NvbXBpbGVyL2RhdGEuanMiLCJzcmMvY29tcGlsZXIvZmFjZXQuanMiLCJzcmMvY29tcGlsZXIvZ3JvdXAuanMiLCJzcmMvY29tcGlsZXIvbGF5b3V0LmpzIiwic3JjL2NvbXBpbGVyL2xlZ2VuZC5qcyIsInNyYy9jb21waWxlci9tYXJrcy5qcyIsInNyYy9jb21waWxlci9zY2FsZS5qcyIsInNyYy9jb21waWxlci9zb3J0LmpzIiwic3JjL2NvbXBpbGVyL3N0YWNrLmpzIiwic3JjL2NvbXBpbGVyL3N0eWxlLmpzIiwic3JjL2NvbXBpbGVyL3N1YmZhY2V0LmpzIiwic3JjL2NvbXBpbGVyL3RpbWUuanMiLCJzcmMvY29uc3RzLmpzIiwic3JjL2RhdGEuanMiLCJzcmMvZW5jLmpzIiwic3JjL2ZpZWxkLmpzIiwic3JjL2dsb2JhbHMuanMiLCJzcmMvbG9nZ2VyLmpzIiwic3JjL3NjaGVtYS9zY2hlbWEuanMiLCJzcmMvc2NoZW1hL3NjaGVtYXV0aWwuanMiLCJzcmMvdXRpbC5qcyIsInNyYy92bCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNUQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMTRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2x4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIixudWxsLCIvLyBUaGlzIHByb2R1Y3QgaW5jbHVkZXMgY29sb3Igc3BlY2lmaWNhdGlvbnMgYW5kIGRlc2lnbnMgZGV2ZWxvcGVkIGJ5IEN5bnRoaWEgQnJld2VyIChodHRwOi8vY29sb3JicmV3ZXIub3JnLykuXG4vLyBKYXZhU2NyaXB0IHNwZWNzIGFzIHBhY2thZ2VkIGluIHRoZSBEMyBsaWJyYXJ5IChkM2pzLm9yZykuIFBsZWFzZSBzZWUgbGljZW5zZSBhdCBodHRwOi8vY29sb3JicmV3ZXIub3JnL2V4cG9ydC9MSUNFTlNFLnR4dFxuIWZ1bmN0aW9uKCkge1xuXG52YXIgY29sb3JicmV3ZXIgPSB7WWxHbjoge1xuMzogW1wiI2Y3ZmNiOVwiLFwiI2FkZGQ4ZVwiLFwiIzMxYTM1NFwiXSxcbjQ6IFtcIiNmZmZmY2NcIixcIiNjMmU2OTlcIixcIiM3OGM2NzlcIixcIiMyMzg0NDNcIl0sXG41OiBbXCIjZmZmZmNjXCIsXCIjYzJlNjk5XCIsXCIjNzhjNjc5XCIsXCIjMzFhMzU0XCIsXCIjMDA2ODM3XCJdLFxuNjogW1wiI2ZmZmZjY1wiLFwiI2Q5ZjBhM1wiLFwiI2FkZGQ4ZVwiLFwiIzc4YzY3OVwiLFwiIzMxYTM1NFwiLFwiIzAwNjgzN1wiXSxcbjc6IFtcIiNmZmZmY2NcIixcIiNkOWYwYTNcIixcIiNhZGRkOGVcIixcIiM3OGM2NzlcIixcIiM0MWFiNWRcIixcIiMyMzg0NDNcIixcIiMwMDVhMzJcIl0sXG44OiBbXCIjZmZmZmU1XCIsXCIjZjdmY2I5XCIsXCIjZDlmMGEzXCIsXCIjYWRkZDhlXCIsXCIjNzhjNjc5XCIsXCIjNDFhYjVkXCIsXCIjMjM4NDQzXCIsXCIjMDA1YTMyXCJdLFxuOTogW1wiI2ZmZmZlNVwiLFwiI2Y3ZmNiOVwiLFwiI2Q5ZjBhM1wiLFwiI2FkZGQ4ZVwiLFwiIzc4YzY3OVwiLFwiIzQxYWI1ZFwiLFwiIzIzODQ0M1wiLFwiIzAwNjgzN1wiLFwiIzAwNDUyOVwiXVxufSxZbEduQnU6IHtcbjM6IFtcIiNlZGY4YjFcIixcIiM3ZmNkYmJcIixcIiMyYzdmYjhcIl0sXG40OiBbXCIjZmZmZmNjXCIsXCIjYTFkYWI0XCIsXCIjNDFiNmM0XCIsXCIjMjI1ZWE4XCJdLFxuNTogW1wiI2ZmZmZjY1wiLFwiI2ExZGFiNFwiLFwiIzQxYjZjNFwiLFwiIzJjN2ZiOFwiLFwiIzI1MzQ5NFwiXSxcbjY6IFtcIiNmZmZmY2NcIixcIiNjN2U5YjRcIixcIiM3ZmNkYmJcIixcIiM0MWI2YzRcIixcIiMyYzdmYjhcIixcIiMyNTM0OTRcIl0sXG43OiBbXCIjZmZmZmNjXCIsXCIjYzdlOWI0XCIsXCIjN2ZjZGJiXCIsXCIjNDFiNmM0XCIsXCIjMWQ5MWMwXCIsXCIjMjI1ZWE4XCIsXCIjMGMyYzg0XCJdLFxuODogW1wiI2ZmZmZkOVwiLFwiI2VkZjhiMVwiLFwiI2M3ZTliNFwiLFwiIzdmY2RiYlwiLFwiIzQxYjZjNFwiLFwiIzFkOTFjMFwiLFwiIzIyNWVhOFwiLFwiIzBjMmM4NFwiXSxcbjk6IFtcIiNmZmZmZDlcIixcIiNlZGY4YjFcIixcIiNjN2U5YjRcIixcIiM3ZmNkYmJcIixcIiM0MWI2YzRcIixcIiMxZDkxYzBcIixcIiMyMjVlYThcIixcIiMyNTM0OTRcIixcIiMwODFkNThcIl1cbn0sR25CdToge1xuMzogW1wiI2UwZjNkYlwiLFwiI2E4ZGRiNVwiLFwiIzQzYTJjYVwiXSxcbjQ6IFtcIiNmMGY5ZThcIixcIiNiYWU0YmNcIixcIiM3YmNjYzRcIixcIiMyYjhjYmVcIl0sXG41OiBbXCIjZjBmOWU4XCIsXCIjYmFlNGJjXCIsXCIjN2JjY2M0XCIsXCIjNDNhMmNhXCIsXCIjMDg2OGFjXCJdLFxuNjogW1wiI2YwZjllOFwiLFwiI2NjZWJjNVwiLFwiI2E4ZGRiNVwiLFwiIzdiY2NjNFwiLFwiIzQzYTJjYVwiLFwiIzA4NjhhY1wiXSxcbjc6IFtcIiNmMGY5ZThcIixcIiNjY2ViYzVcIixcIiNhOGRkYjVcIixcIiM3YmNjYzRcIixcIiM0ZWIzZDNcIixcIiMyYjhjYmVcIixcIiMwODU4OWVcIl0sXG44OiBbXCIjZjdmY2YwXCIsXCIjZTBmM2RiXCIsXCIjY2NlYmM1XCIsXCIjYThkZGI1XCIsXCIjN2JjY2M0XCIsXCIjNGViM2QzXCIsXCIjMmI4Y2JlXCIsXCIjMDg1ODllXCJdLFxuOTogW1wiI2Y3ZmNmMFwiLFwiI2UwZjNkYlwiLFwiI2NjZWJjNVwiLFwiI2E4ZGRiNVwiLFwiIzdiY2NjNFwiLFwiIzRlYjNkM1wiLFwiIzJiOGNiZVwiLFwiIzA4NjhhY1wiLFwiIzA4NDA4MVwiXVxufSxCdUduOiB7XG4zOiBbXCIjZTVmNWY5XCIsXCIjOTlkOGM5XCIsXCIjMmNhMjVmXCJdLFxuNDogW1wiI2VkZjhmYlwiLFwiI2IyZTJlMlwiLFwiIzY2YzJhNFwiLFwiIzIzOGI0NVwiXSxcbjU6IFtcIiNlZGY4ZmJcIixcIiNiMmUyZTJcIixcIiM2NmMyYTRcIixcIiMyY2EyNWZcIixcIiMwMDZkMmNcIl0sXG42OiBbXCIjZWRmOGZiXCIsXCIjY2NlY2U2XCIsXCIjOTlkOGM5XCIsXCIjNjZjMmE0XCIsXCIjMmNhMjVmXCIsXCIjMDA2ZDJjXCJdLFxuNzogW1wiI2VkZjhmYlwiLFwiI2NjZWNlNlwiLFwiIzk5ZDhjOVwiLFwiIzY2YzJhNFwiLFwiIzQxYWU3NlwiLFwiIzIzOGI0NVwiLFwiIzAwNTgyNFwiXSxcbjg6IFtcIiNmN2ZjZmRcIixcIiNlNWY1ZjlcIixcIiNjY2VjZTZcIixcIiM5OWQ4YzlcIixcIiM2NmMyYTRcIixcIiM0MWFlNzZcIixcIiMyMzhiNDVcIixcIiMwMDU4MjRcIl0sXG45OiBbXCIjZjdmY2ZkXCIsXCIjZTVmNWY5XCIsXCIjY2NlY2U2XCIsXCIjOTlkOGM5XCIsXCIjNjZjMmE0XCIsXCIjNDFhZTc2XCIsXCIjMjM4YjQ1XCIsXCIjMDA2ZDJjXCIsXCIjMDA0NDFiXCJdXG59LFB1QnVHbjoge1xuMzogW1wiI2VjZTJmMFwiLFwiI2E2YmRkYlwiLFwiIzFjOTA5OVwiXSxcbjQ6IFtcIiNmNmVmZjdcIixcIiNiZGM5ZTFcIixcIiM2N2E5Y2ZcIixcIiMwMjgxOGFcIl0sXG41OiBbXCIjZjZlZmY3XCIsXCIjYmRjOWUxXCIsXCIjNjdhOWNmXCIsXCIjMWM5MDk5XCIsXCIjMDE2YzU5XCJdLFxuNjogW1wiI2Y2ZWZmN1wiLFwiI2QwZDFlNlwiLFwiI2E2YmRkYlwiLFwiIzY3YTljZlwiLFwiIzFjOTA5OVwiLFwiIzAxNmM1OVwiXSxcbjc6IFtcIiNmNmVmZjdcIixcIiNkMGQxZTZcIixcIiNhNmJkZGJcIixcIiM2N2E5Y2ZcIixcIiMzNjkwYzBcIixcIiMwMjgxOGFcIixcIiMwMTY0NTBcIl0sXG44OiBbXCIjZmZmN2ZiXCIsXCIjZWNlMmYwXCIsXCIjZDBkMWU2XCIsXCIjYTZiZGRiXCIsXCIjNjdhOWNmXCIsXCIjMzY5MGMwXCIsXCIjMDI4MThhXCIsXCIjMDE2NDUwXCJdLFxuOTogW1wiI2ZmZjdmYlwiLFwiI2VjZTJmMFwiLFwiI2QwZDFlNlwiLFwiI2E2YmRkYlwiLFwiIzY3YTljZlwiLFwiIzM2OTBjMFwiLFwiIzAyODE4YVwiLFwiIzAxNmM1OVwiLFwiIzAxNDYzNlwiXVxufSxQdUJ1OiB7XG4zOiBbXCIjZWNlN2YyXCIsXCIjYTZiZGRiXCIsXCIjMmI4Y2JlXCJdLFxuNDogW1wiI2YxZWVmNlwiLFwiI2JkYzllMVwiLFwiIzc0YTljZlwiLFwiIzA1NzBiMFwiXSxcbjU6IFtcIiNmMWVlZjZcIixcIiNiZGM5ZTFcIixcIiM3NGE5Y2ZcIixcIiMyYjhjYmVcIixcIiMwNDVhOGRcIl0sXG42OiBbXCIjZjFlZWY2XCIsXCIjZDBkMWU2XCIsXCIjYTZiZGRiXCIsXCIjNzRhOWNmXCIsXCIjMmI4Y2JlXCIsXCIjMDQ1YThkXCJdLFxuNzogW1wiI2YxZWVmNlwiLFwiI2QwZDFlNlwiLFwiI2E2YmRkYlwiLFwiIzc0YTljZlwiLFwiIzM2OTBjMFwiLFwiIzA1NzBiMFwiLFwiIzAzNGU3YlwiXSxcbjg6IFtcIiNmZmY3ZmJcIixcIiNlY2U3ZjJcIixcIiNkMGQxZTZcIixcIiNhNmJkZGJcIixcIiM3NGE5Y2ZcIixcIiMzNjkwYzBcIixcIiMwNTcwYjBcIixcIiMwMzRlN2JcIl0sXG45OiBbXCIjZmZmN2ZiXCIsXCIjZWNlN2YyXCIsXCIjZDBkMWU2XCIsXCIjYTZiZGRiXCIsXCIjNzRhOWNmXCIsXCIjMzY5MGMwXCIsXCIjMDU3MGIwXCIsXCIjMDQ1YThkXCIsXCIjMDIzODU4XCJdXG59LEJ1UHU6IHtcbjM6IFtcIiNlMGVjZjRcIixcIiM5ZWJjZGFcIixcIiM4ODU2YTdcIl0sXG40OiBbXCIjZWRmOGZiXCIsXCIjYjNjZGUzXCIsXCIjOGM5NmM2XCIsXCIjODg0MTlkXCJdLFxuNTogW1wiI2VkZjhmYlwiLFwiI2IzY2RlM1wiLFwiIzhjOTZjNlwiLFwiIzg4NTZhN1wiLFwiIzgxMGY3Y1wiXSxcbjY6IFtcIiNlZGY4ZmJcIixcIiNiZmQzZTZcIixcIiM5ZWJjZGFcIixcIiM4Yzk2YzZcIixcIiM4ODU2YTdcIixcIiM4MTBmN2NcIl0sXG43OiBbXCIjZWRmOGZiXCIsXCIjYmZkM2U2XCIsXCIjOWViY2RhXCIsXCIjOGM5NmM2XCIsXCIjOGM2YmIxXCIsXCIjODg0MTlkXCIsXCIjNmUwMTZiXCJdLFxuODogW1wiI2Y3ZmNmZFwiLFwiI2UwZWNmNFwiLFwiI2JmZDNlNlwiLFwiIzllYmNkYVwiLFwiIzhjOTZjNlwiLFwiIzhjNmJiMVwiLFwiIzg4NDE5ZFwiLFwiIzZlMDE2YlwiXSxcbjk6IFtcIiNmN2ZjZmRcIixcIiNlMGVjZjRcIixcIiNiZmQzZTZcIixcIiM5ZWJjZGFcIixcIiM4Yzk2YzZcIixcIiM4YzZiYjFcIixcIiM4ODQxOWRcIixcIiM4MTBmN2NcIixcIiM0ZDAwNGJcIl1cbn0sUmRQdToge1xuMzogW1wiI2ZkZTBkZFwiLFwiI2ZhOWZiNVwiLFwiI2M1MWI4YVwiXSxcbjQ6IFtcIiNmZWViZTJcIixcIiNmYmI0YjlcIixcIiNmNzY4YTFcIixcIiNhZTAxN2VcIl0sXG41OiBbXCIjZmVlYmUyXCIsXCIjZmJiNGI5XCIsXCIjZjc2OGExXCIsXCIjYzUxYjhhXCIsXCIjN2EwMTc3XCJdLFxuNjogW1wiI2ZlZWJlMlwiLFwiI2ZjYzVjMFwiLFwiI2ZhOWZiNVwiLFwiI2Y3NjhhMVwiLFwiI2M1MWI4YVwiLFwiIzdhMDE3N1wiXSxcbjc6IFtcIiNmZWViZTJcIixcIiNmY2M1YzBcIixcIiNmYTlmYjVcIixcIiNmNzY4YTFcIixcIiNkZDM0OTdcIixcIiNhZTAxN2VcIixcIiM3YTAxNzdcIl0sXG44OiBbXCIjZmZmN2YzXCIsXCIjZmRlMGRkXCIsXCIjZmNjNWMwXCIsXCIjZmE5ZmI1XCIsXCIjZjc2OGExXCIsXCIjZGQzNDk3XCIsXCIjYWUwMTdlXCIsXCIjN2EwMTc3XCJdLFxuOTogW1wiI2ZmZjdmM1wiLFwiI2ZkZTBkZFwiLFwiI2ZjYzVjMFwiLFwiI2ZhOWZiNVwiLFwiI2Y3NjhhMVwiLFwiI2RkMzQ5N1wiLFwiI2FlMDE3ZVwiLFwiIzdhMDE3N1wiLFwiIzQ5MDA2YVwiXVxufSxQdVJkOiB7XG4zOiBbXCIjZTdlMWVmXCIsXCIjYzk5NGM3XCIsXCIjZGQxYzc3XCJdLFxuNDogW1wiI2YxZWVmNlwiLFwiI2Q3YjVkOFwiLFwiI2RmNjViMFwiLFwiI2NlMTI1NlwiXSxcbjU6IFtcIiNmMWVlZjZcIixcIiNkN2I1ZDhcIixcIiNkZjY1YjBcIixcIiNkZDFjNzdcIixcIiM5ODAwNDNcIl0sXG42OiBbXCIjZjFlZWY2XCIsXCIjZDRiOWRhXCIsXCIjYzk5NGM3XCIsXCIjZGY2NWIwXCIsXCIjZGQxYzc3XCIsXCIjOTgwMDQzXCJdLFxuNzogW1wiI2YxZWVmNlwiLFwiI2Q0YjlkYVwiLFwiI2M5OTRjN1wiLFwiI2RmNjViMFwiLFwiI2U3Mjk4YVwiLFwiI2NlMTI1NlwiLFwiIzkxMDAzZlwiXSxcbjg6IFtcIiNmN2Y0ZjlcIixcIiNlN2UxZWZcIixcIiNkNGI5ZGFcIixcIiNjOTk0YzdcIixcIiNkZjY1YjBcIixcIiNlNzI5OGFcIixcIiNjZTEyNTZcIixcIiM5MTAwM2ZcIl0sXG45OiBbXCIjZjdmNGY5XCIsXCIjZTdlMWVmXCIsXCIjZDRiOWRhXCIsXCIjYzk5NGM3XCIsXCIjZGY2NWIwXCIsXCIjZTcyOThhXCIsXCIjY2UxMjU2XCIsXCIjOTgwMDQzXCIsXCIjNjcwMDFmXCJdXG59LE9yUmQ6IHtcbjM6IFtcIiNmZWU4YzhcIixcIiNmZGJiODRcIixcIiNlMzRhMzNcIl0sXG40OiBbXCIjZmVmMGQ5XCIsXCIjZmRjYzhhXCIsXCIjZmM4ZDU5XCIsXCIjZDczMDFmXCJdLFxuNTogW1wiI2ZlZjBkOVwiLFwiI2ZkY2M4YVwiLFwiI2ZjOGQ1OVwiLFwiI2UzNGEzM1wiLFwiI2IzMDAwMFwiXSxcbjY6IFtcIiNmZWYwZDlcIixcIiNmZGQ0OWVcIixcIiNmZGJiODRcIixcIiNmYzhkNTlcIixcIiNlMzRhMzNcIixcIiNiMzAwMDBcIl0sXG43OiBbXCIjZmVmMGQ5XCIsXCIjZmRkNDllXCIsXCIjZmRiYjg0XCIsXCIjZmM4ZDU5XCIsXCIjZWY2NTQ4XCIsXCIjZDczMDFmXCIsXCIjOTkwMDAwXCJdLFxuODogW1wiI2ZmZjdlY1wiLFwiI2ZlZThjOFwiLFwiI2ZkZDQ5ZVwiLFwiI2ZkYmI4NFwiLFwiI2ZjOGQ1OVwiLFwiI2VmNjU0OFwiLFwiI2Q3MzAxZlwiLFwiIzk5MDAwMFwiXSxcbjk6IFtcIiNmZmY3ZWNcIixcIiNmZWU4YzhcIixcIiNmZGQ0OWVcIixcIiNmZGJiODRcIixcIiNmYzhkNTlcIixcIiNlZjY1NDhcIixcIiNkNzMwMWZcIixcIiNiMzAwMDBcIixcIiM3ZjAwMDBcIl1cbn0sWWxPclJkOiB7XG4zOiBbXCIjZmZlZGEwXCIsXCIjZmViMjRjXCIsXCIjZjAzYjIwXCJdLFxuNDogW1wiI2ZmZmZiMlwiLFwiI2ZlY2M1Y1wiLFwiI2ZkOGQzY1wiLFwiI2UzMWExY1wiXSxcbjU6IFtcIiNmZmZmYjJcIixcIiNmZWNjNWNcIixcIiNmZDhkM2NcIixcIiNmMDNiMjBcIixcIiNiZDAwMjZcIl0sXG42OiBbXCIjZmZmZmIyXCIsXCIjZmVkOTc2XCIsXCIjZmViMjRjXCIsXCIjZmQ4ZDNjXCIsXCIjZjAzYjIwXCIsXCIjYmQwMDI2XCJdLFxuNzogW1wiI2ZmZmZiMlwiLFwiI2ZlZDk3NlwiLFwiI2ZlYjI0Y1wiLFwiI2ZkOGQzY1wiLFwiI2ZjNGUyYVwiLFwiI2UzMWExY1wiLFwiI2IxMDAyNlwiXSxcbjg6IFtcIiNmZmZmY2NcIixcIiNmZmVkYTBcIixcIiNmZWQ5NzZcIixcIiNmZWIyNGNcIixcIiNmZDhkM2NcIixcIiNmYzRlMmFcIixcIiNlMzFhMWNcIixcIiNiMTAwMjZcIl0sXG45OiBbXCIjZmZmZmNjXCIsXCIjZmZlZGEwXCIsXCIjZmVkOTc2XCIsXCIjZmViMjRjXCIsXCIjZmQ4ZDNjXCIsXCIjZmM0ZTJhXCIsXCIjZTMxYTFjXCIsXCIjYmQwMDI2XCIsXCIjODAwMDI2XCJdXG59LFlsT3JCcjoge1xuMzogW1wiI2ZmZjdiY1wiLFwiI2ZlYzQ0ZlwiLFwiI2Q5NWYwZVwiXSxcbjQ6IFtcIiNmZmZmZDRcIixcIiNmZWQ5OGVcIixcIiNmZTk5MjlcIixcIiNjYzRjMDJcIl0sXG41OiBbXCIjZmZmZmQ0XCIsXCIjZmVkOThlXCIsXCIjZmU5OTI5XCIsXCIjZDk1ZjBlXCIsXCIjOTkzNDA0XCJdLFxuNjogW1wiI2ZmZmZkNFwiLFwiI2ZlZTM5MVwiLFwiI2ZlYzQ0ZlwiLFwiI2ZlOTkyOVwiLFwiI2Q5NWYwZVwiLFwiIzk5MzQwNFwiXSxcbjc6IFtcIiNmZmZmZDRcIixcIiNmZWUzOTFcIixcIiNmZWM0NGZcIixcIiNmZTk5MjlcIixcIiNlYzcwMTRcIixcIiNjYzRjMDJcIixcIiM4YzJkMDRcIl0sXG44OiBbXCIjZmZmZmU1XCIsXCIjZmZmN2JjXCIsXCIjZmVlMzkxXCIsXCIjZmVjNDRmXCIsXCIjZmU5OTI5XCIsXCIjZWM3MDE0XCIsXCIjY2M0YzAyXCIsXCIjOGMyZDA0XCJdLFxuOTogW1wiI2ZmZmZlNVwiLFwiI2ZmZjdiY1wiLFwiI2ZlZTM5MVwiLFwiI2ZlYzQ0ZlwiLFwiI2ZlOTkyOVwiLFwiI2VjNzAxNFwiLFwiI2NjNGMwMlwiLFwiIzk5MzQwNFwiLFwiIzY2MjUwNlwiXVxufSxQdXJwbGVzOiB7XG4zOiBbXCIjZWZlZGY1XCIsXCIjYmNiZGRjXCIsXCIjNzU2YmIxXCJdLFxuNDogW1wiI2YyZjBmN1wiLFwiI2NiYzllMlwiLFwiIzllOWFjOFwiLFwiIzZhNTFhM1wiXSxcbjU6IFtcIiNmMmYwZjdcIixcIiNjYmM5ZTJcIixcIiM5ZTlhYzhcIixcIiM3NTZiYjFcIixcIiM1NDI3OGZcIl0sXG42OiBbXCIjZjJmMGY3XCIsXCIjZGFkYWViXCIsXCIjYmNiZGRjXCIsXCIjOWU5YWM4XCIsXCIjNzU2YmIxXCIsXCIjNTQyNzhmXCJdLFxuNzogW1wiI2YyZjBmN1wiLFwiI2RhZGFlYlwiLFwiI2JjYmRkY1wiLFwiIzllOWFjOFwiLFwiIzgwN2RiYVwiLFwiIzZhNTFhM1wiLFwiIzRhMTQ4NlwiXSxcbjg6IFtcIiNmY2ZiZmRcIixcIiNlZmVkZjVcIixcIiNkYWRhZWJcIixcIiNiY2JkZGNcIixcIiM5ZTlhYzhcIixcIiM4MDdkYmFcIixcIiM2YTUxYTNcIixcIiM0YTE0ODZcIl0sXG45OiBbXCIjZmNmYmZkXCIsXCIjZWZlZGY1XCIsXCIjZGFkYWViXCIsXCIjYmNiZGRjXCIsXCIjOWU5YWM4XCIsXCIjODA3ZGJhXCIsXCIjNmE1MWEzXCIsXCIjNTQyNzhmXCIsXCIjM2YwMDdkXCJdXG59LEJsdWVzOiB7XG4zOiBbXCIjZGVlYmY3XCIsXCIjOWVjYWUxXCIsXCIjMzE4MmJkXCJdLFxuNDogW1wiI2VmZjNmZlwiLFwiI2JkZDdlN1wiLFwiIzZiYWVkNlwiLFwiIzIxNzFiNVwiXSxcbjU6IFtcIiNlZmYzZmZcIixcIiNiZGQ3ZTdcIixcIiM2YmFlZDZcIixcIiMzMTgyYmRcIixcIiMwODUxOWNcIl0sXG42OiBbXCIjZWZmM2ZmXCIsXCIjYzZkYmVmXCIsXCIjOWVjYWUxXCIsXCIjNmJhZWQ2XCIsXCIjMzE4MmJkXCIsXCIjMDg1MTljXCJdLFxuNzogW1wiI2VmZjNmZlwiLFwiI2M2ZGJlZlwiLFwiIzllY2FlMVwiLFwiIzZiYWVkNlwiLFwiIzQyOTJjNlwiLFwiIzIxNzFiNVwiLFwiIzA4NDU5NFwiXSxcbjg6IFtcIiNmN2ZiZmZcIixcIiNkZWViZjdcIixcIiNjNmRiZWZcIixcIiM5ZWNhZTFcIixcIiM2YmFlZDZcIixcIiM0MjkyYzZcIixcIiMyMTcxYjVcIixcIiMwODQ1OTRcIl0sXG45OiBbXCIjZjdmYmZmXCIsXCIjZGVlYmY3XCIsXCIjYzZkYmVmXCIsXCIjOWVjYWUxXCIsXCIjNmJhZWQ2XCIsXCIjNDI5MmM2XCIsXCIjMjE3MWI1XCIsXCIjMDg1MTljXCIsXCIjMDgzMDZiXCJdXG59LEdyZWVuczoge1xuMzogW1wiI2U1ZjVlMFwiLFwiI2ExZDk5YlwiLFwiIzMxYTM1NFwiXSxcbjQ6IFtcIiNlZGY4ZTlcIixcIiNiYWU0YjNcIixcIiM3NGM0NzZcIixcIiMyMzhiNDVcIl0sXG41OiBbXCIjZWRmOGU5XCIsXCIjYmFlNGIzXCIsXCIjNzRjNDc2XCIsXCIjMzFhMzU0XCIsXCIjMDA2ZDJjXCJdLFxuNjogW1wiI2VkZjhlOVwiLFwiI2M3ZTljMFwiLFwiI2ExZDk5YlwiLFwiIzc0YzQ3NlwiLFwiIzMxYTM1NFwiLFwiIzAwNmQyY1wiXSxcbjc6IFtcIiNlZGY4ZTlcIixcIiNjN2U5YzBcIixcIiNhMWQ5OWJcIixcIiM3NGM0NzZcIixcIiM0MWFiNWRcIixcIiMyMzhiNDVcIixcIiMwMDVhMzJcIl0sXG44OiBbXCIjZjdmY2Y1XCIsXCIjZTVmNWUwXCIsXCIjYzdlOWMwXCIsXCIjYTFkOTliXCIsXCIjNzRjNDc2XCIsXCIjNDFhYjVkXCIsXCIjMjM4YjQ1XCIsXCIjMDA1YTMyXCJdLFxuOTogW1wiI2Y3ZmNmNVwiLFwiI2U1ZjVlMFwiLFwiI2M3ZTljMFwiLFwiI2ExZDk5YlwiLFwiIzc0YzQ3NlwiLFwiIzQxYWI1ZFwiLFwiIzIzOGI0NVwiLFwiIzAwNmQyY1wiLFwiIzAwNDQxYlwiXVxufSxPcmFuZ2VzOiB7XG4zOiBbXCIjZmVlNmNlXCIsXCIjZmRhZTZiXCIsXCIjZTY1NTBkXCJdLFxuNDogW1wiI2ZlZWRkZVwiLFwiI2ZkYmU4NVwiLFwiI2ZkOGQzY1wiLFwiI2Q5NDcwMVwiXSxcbjU6IFtcIiNmZWVkZGVcIixcIiNmZGJlODVcIixcIiNmZDhkM2NcIixcIiNlNjU1MGRcIixcIiNhNjM2MDNcIl0sXG42OiBbXCIjZmVlZGRlXCIsXCIjZmRkMGEyXCIsXCIjZmRhZTZiXCIsXCIjZmQ4ZDNjXCIsXCIjZTY1NTBkXCIsXCIjYTYzNjAzXCJdLFxuNzogW1wiI2ZlZWRkZVwiLFwiI2ZkZDBhMlwiLFwiI2ZkYWU2YlwiLFwiI2ZkOGQzY1wiLFwiI2YxNjkxM1wiLFwiI2Q5NDgwMVwiLFwiIzhjMmQwNFwiXSxcbjg6IFtcIiNmZmY1ZWJcIixcIiNmZWU2Y2VcIixcIiNmZGQwYTJcIixcIiNmZGFlNmJcIixcIiNmZDhkM2NcIixcIiNmMTY5MTNcIixcIiNkOTQ4MDFcIixcIiM4YzJkMDRcIl0sXG45OiBbXCIjZmZmNWViXCIsXCIjZmVlNmNlXCIsXCIjZmRkMGEyXCIsXCIjZmRhZTZiXCIsXCIjZmQ4ZDNjXCIsXCIjZjE2OTEzXCIsXCIjZDk0ODAxXCIsXCIjYTYzNjAzXCIsXCIjN2YyNzA0XCJdXG59LFJlZHM6IHtcbjM6IFtcIiNmZWUwZDJcIixcIiNmYzkyNzJcIixcIiNkZTJkMjZcIl0sXG40OiBbXCIjZmVlNWQ5XCIsXCIjZmNhZTkxXCIsXCIjZmI2YTRhXCIsXCIjY2IxODFkXCJdLFxuNTogW1wiI2ZlZTVkOVwiLFwiI2ZjYWU5MVwiLFwiI2ZiNmE0YVwiLFwiI2RlMmQyNlwiLFwiI2E1MGYxNVwiXSxcbjY6IFtcIiNmZWU1ZDlcIixcIiNmY2JiYTFcIixcIiNmYzkyNzJcIixcIiNmYjZhNGFcIixcIiNkZTJkMjZcIixcIiNhNTBmMTVcIl0sXG43OiBbXCIjZmVlNWQ5XCIsXCIjZmNiYmExXCIsXCIjZmM5MjcyXCIsXCIjZmI2YTRhXCIsXCIjZWYzYjJjXCIsXCIjY2IxODFkXCIsXCIjOTkwMDBkXCJdLFxuODogW1wiI2ZmZjVmMFwiLFwiI2ZlZTBkMlwiLFwiI2ZjYmJhMVwiLFwiI2ZjOTI3MlwiLFwiI2ZiNmE0YVwiLFwiI2VmM2IyY1wiLFwiI2NiMTgxZFwiLFwiIzk5MDAwZFwiXSxcbjk6IFtcIiNmZmY1ZjBcIixcIiNmZWUwZDJcIixcIiNmY2JiYTFcIixcIiNmYzkyNzJcIixcIiNmYjZhNGFcIixcIiNlZjNiMmNcIixcIiNjYjE4MWRcIixcIiNhNTBmMTVcIixcIiM2NzAwMGRcIl1cbn0sR3JleXM6IHtcbjM6IFtcIiNmMGYwZjBcIixcIiNiZGJkYmRcIixcIiM2MzYzNjNcIl0sXG40OiBbXCIjZjdmN2Y3XCIsXCIjY2NjY2NjXCIsXCIjOTY5Njk2XCIsXCIjNTI1MjUyXCJdLFxuNTogW1wiI2Y3ZjdmN1wiLFwiI2NjY2NjY1wiLFwiIzk2OTY5NlwiLFwiIzYzNjM2M1wiLFwiIzI1MjUyNVwiXSxcbjY6IFtcIiNmN2Y3ZjdcIixcIiNkOWQ5ZDlcIixcIiNiZGJkYmRcIixcIiM5Njk2OTZcIixcIiM2MzYzNjNcIixcIiMyNTI1MjVcIl0sXG43OiBbXCIjZjdmN2Y3XCIsXCIjZDlkOWQ5XCIsXCIjYmRiZGJkXCIsXCIjOTY5Njk2XCIsXCIjNzM3MzczXCIsXCIjNTI1MjUyXCIsXCIjMjUyNTI1XCJdLFxuODogW1wiI2ZmZmZmZlwiLFwiI2YwZjBmMFwiLFwiI2Q5ZDlkOVwiLFwiI2JkYmRiZFwiLFwiIzk2OTY5NlwiLFwiIzczNzM3M1wiLFwiIzUyNTI1MlwiLFwiIzI1MjUyNVwiXSxcbjk6IFtcIiNmZmZmZmZcIixcIiNmMGYwZjBcIixcIiNkOWQ5ZDlcIixcIiNiZGJkYmRcIixcIiM5Njk2OTZcIixcIiM3MzczNzNcIixcIiM1MjUyNTJcIixcIiMyNTI1MjVcIixcIiMwMDAwMDBcIl1cbn0sUHVPcjoge1xuMzogW1wiI2YxYTM0MFwiLFwiI2Y3ZjdmN1wiLFwiIzk5OGVjM1wiXSxcbjQ6IFtcIiNlNjYxMDFcIixcIiNmZGI4NjNcIixcIiNiMmFiZDJcIixcIiM1ZTNjOTlcIl0sXG41OiBbXCIjZTY2MTAxXCIsXCIjZmRiODYzXCIsXCIjZjdmN2Y3XCIsXCIjYjJhYmQyXCIsXCIjNWUzYzk5XCJdLFxuNjogW1wiI2IzNTgwNlwiLFwiI2YxYTM0MFwiLFwiI2ZlZTBiNlwiLFwiI2Q4ZGFlYlwiLFwiIzk5OGVjM1wiLFwiIzU0Mjc4OFwiXSxcbjc6IFtcIiNiMzU4MDZcIixcIiNmMWEzNDBcIixcIiNmZWUwYjZcIixcIiNmN2Y3ZjdcIixcIiNkOGRhZWJcIixcIiM5OThlYzNcIixcIiM1NDI3ODhcIl0sXG44OiBbXCIjYjM1ODA2XCIsXCIjZTA4MjE0XCIsXCIjZmRiODYzXCIsXCIjZmVlMGI2XCIsXCIjZDhkYWViXCIsXCIjYjJhYmQyXCIsXCIjODA3M2FjXCIsXCIjNTQyNzg4XCJdLFxuOTogW1wiI2IzNTgwNlwiLFwiI2UwODIxNFwiLFwiI2ZkYjg2M1wiLFwiI2ZlZTBiNlwiLFwiI2Y3ZjdmN1wiLFwiI2Q4ZGFlYlwiLFwiI2IyYWJkMlwiLFwiIzgwNzNhY1wiLFwiIzU0Mjc4OFwiXSxcbjEwOiBbXCIjN2YzYjA4XCIsXCIjYjM1ODA2XCIsXCIjZTA4MjE0XCIsXCIjZmRiODYzXCIsXCIjZmVlMGI2XCIsXCIjZDhkYWViXCIsXCIjYjJhYmQyXCIsXCIjODA3M2FjXCIsXCIjNTQyNzg4XCIsXCIjMmQwMDRiXCJdLFxuMTE6IFtcIiM3ZjNiMDhcIixcIiNiMzU4MDZcIixcIiNlMDgyMTRcIixcIiNmZGI4NjNcIixcIiNmZWUwYjZcIixcIiNmN2Y3ZjdcIixcIiNkOGRhZWJcIixcIiNiMmFiZDJcIixcIiM4MDczYWNcIixcIiM1NDI3ODhcIixcIiMyZDAwNGJcIl1cbn0sQnJCRzoge1xuMzogW1wiI2Q4YjM2NVwiLFwiI2Y1ZjVmNVwiLFwiIzVhYjRhY1wiXSxcbjQ6IFtcIiNhNjYxMWFcIixcIiNkZmMyN2RcIixcIiM4MGNkYzFcIixcIiMwMTg1NzFcIl0sXG41OiBbXCIjYTY2MTFhXCIsXCIjZGZjMjdkXCIsXCIjZjVmNWY1XCIsXCIjODBjZGMxXCIsXCIjMDE4NTcxXCJdLFxuNjogW1wiIzhjNTEwYVwiLFwiI2Q4YjM2NVwiLFwiI2Y2ZThjM1wiLFwiI2M3ZWFlNVwiLFwiIzVhYjRhY1wiLFwiIzAxNjY1ZVwiXSxcbjc6IFtcIiM4YzUxMGFcIixcIiNkOGIzNjVcIixcIiNmNmU4YzNcIixcIiNmNWY1ZjVcIixcIiNjN2VhZTVcIixcIiM1YWI0YWNcIixcIiMwMTY2NWVcIl0sXG44OiBbXCIjOGM1MTBhXCIsXCIjYmY4MTJkXCIsXCIjZGZjMjdkXCIsXCIjZjZlOGMzXCIsXCIjYzdlYWU1XCIsXCIjODBjZGMxXCIsXCIjMzU5NzhmXCIsXCIjMDE2NjVlXCJdLFxuOTogW1wiIzhjNTEwYVwiLFwiI2JmODEyZFwiLFwiI2RmYzI3ZFwiLFwiI2Y2ZThjM1wiLFwiI2Y1ZjVmNVwiLFwiI2M3ZWFlNVwiLFwiIzgwY2RjMVwiLFwiIzM1OTc4ZlwiLFwiIzAxNjY1ZVwiXSxcbjEwOiBbXCIjNTQzMDA1XCIsXCIjOGM1MTBhXCIsXCIjYmY4MTJkXCIsXCIjZGZjMjdkXCIsXCIjZjZlOGMzXCIsXCIjYzdlYWU1XCIsXCIjODBjZGMxXCIsXCIjMzU5NzhmXCIsXCIjMDE2NjVlXCIsXCIjMDAzYzMwXCJdLFxuMTE6IFtcIiM1NDMwMDVcIixcIiM4YzUxMGFcIixcIiNiZjgxMmRcIixcIiNkZmMyN2RcIixcIiNmNmU4YzNcIixcIiNmNWY1ZjVcIixcIiNjN2VhZTVcIixcIiM4MGNkYzFcIixcIiMzNTk3OGZcIixcIiMwMTY2NWVcIixcIiMwMDNjMzBcIl1cbn0sUFJHbjoge1xuMzogW1wiI2FmOGRjM1wiLFwiI2Y3ZjdmN1wiLFwiIzdmYmY3YlwiXSxcbjQ6IFtcIiM3YjMyOTRcIixcIiNjMmE1Y2ZcIixcIiNhNmRiYTBcIixcIiMwMDg4MzdcIl0sXG41OiBbXCIjN2IzMjk0XCIsXCIjYzJhNWNmXCIsXCIjZjdmN2Y3XCIsXCIjYTZkYmEwXCIsXCIjMDA4ODM3XCJdLFxuNjogW1wiIzc2MmE4M1wiLFwiI2FmOGRjM1wiLFwiI2U3ZDRlOFwiLFwiI2Q5ZjBkM1wiLFwiIzdmYmY3YlwiLFwiIzFiNzgzN1wiXSxcbjc6IFtcIiM3NjJhODNcIixcIiNhZjhkYzNcIixcIiNlN2Q0ZThcIixcIiNmN2Y3ZjdcIixcIiNkOWYwZDNcIixcIiM3ZmJmN2JcIixcIiMxYjc4MzdcIl0sXG44OiBbXCIjNzYyYTgzXCIsXCIjOTk3MGFiXCIsXCIjYzJhNWNmXCIsXCIjZTdkNGU4XCIsXCIjZDlmMGQzXCIsXCIjYTZkYmEwXCIsXCIjNWFhZTYxXCIsXCIjMWI3ODM3XCJdLFxuOTogW1wiIzc2MmE4M1wiLFwiIzk5NzBhYlwiLFwiI2MyYTVjZlwiLFwiI2U3ZDRlOFwiLFwiI2Y3ZjdmN1wiLFwiI2Q5ZjBkM1wiLFwiI2E2ZGJhMFwiLFwiIzVhYWU2MVwiLFwiIzFiNzgzN1wiXSxcbjEwOiBbXCIjNDAwMDRiXCIsXCIjNzYyYTgzXCIsXCIjOTk3MGFiXCIsXCIjYzJhNWNmXCIsXCIjZTdkNGU4XCIsXCIjZDlmMGQzXCIsXCIjYTZkYmEwXCIsXCIjNWFhZTYxXCIsXCIjMWI3ODM3XCIsXCIjMDA0NDFiXCJdLFxuMTE6IFtcIiM0MDAwNGJcIixcIiM3NjJhODNcIixcIiM5OTcwYWJcIixcIiNjMmE1Y2ZcIixcIiNlN2Q0ZThcIixcIiNmN2Y3ZjdcIixcIiNkOWYwZDNcIixcIiNhNmRiYTBcIixcIiM1YWFlNjFcIixcIiMxYjc4MzdcIixcIiMwMDQ0MWJcIl1cbn0sUGlZRzoge1xuMzogW1wiI2U5YTNjOVwiLFwiI2Y3ZjdmN1wiLFwiI2ExZDc2YVwiXSxcbjQ6IFtcIiNkMDFjOGJcIixcIiNmMWI2ZGFcIixcIiNiOGUxODZcIixcIiM0ZGFjMjZcIl0sXG41OiBbXCIjZDAxYzhiXCIsXCIjZjFiNmRhXCIsXCIjZjdmN2Y3XCIsXCIjYjhlMTg2XCIsXCIjNGRhYzI2XCJdLFxuNjogW1wiI2M1MWI3ZFwiLFwiI2U5YTNjOVwiLFwiI2ZkZTBlZlwiLFwiI2U2ZjVkMFwiLFwiI2ExZDc2YVwiLFwiIzRkOTIyMVwiXSxcbjc6IFtcIiNjNTFiN2RcIixcIiNlOWEzYzlcIixcIiNmZGUwZWZcIixcIiNmN2Y3ZjdcIixcIiNlNmY1ZDBcIixcIiNhMWQ3NmFcIixcIiM0ZDkyMjFcIl0sXG44OiBbXCIjYzUxYjdkXCIsXCIjZGU3N2FlXCIsXCIjZjFiNmRhXCIsXCIjZmRlMGVmXCIsXCIjZTZmNWQwXCIsXCIjYjhlMTg2XCIsXCIjN2ZiYzQxXCIsXCIjNGQ5MjIxXCJdLFxuOTogW1wiI2M1MWI3ZFwiLFwiI2RlNzdhZVwiLFwiI2YxYjZkYVwiLFwiI2ZkZTBlZlwiLFwiI2Y3ZjdmN1wiLFwiI2U2ZjVkMFwiLFwiI2I4ZTE4NlwiLFwiIzdmYmM0MVwiLFwiIzRkOTIyMVwiXSxcbjEwOiBbXCIjOGUwMTUyXCIsXCIjYzUxYjdkXCIsXCIjZGU3N2FlXCIsXCIjZjFiNmRhXCIsXCIjZmRlMGVmXCIsXCIjZTZmNWQwXCIsXCIjYjhlMTg2XCIsXCIjN2ZiYzQxXCIsXCIjNGQ5MjIxXCIsXCIjMjc2NDE5XCJdLFxuMTE6IFtcIiM4ZTAxNTJcIixcIiNjNTFiN2RcIixcIiNkZTc3YWVcIixcIiNmMWI2ZGFcIixcIiNmZGUwZWZcIixcIiNmN2Y3ZjdcIixcIiNlNmY1ZDBcIixcIiNiOGUxODZcIixcIiM3ZmJjNDFcIixcIiM0ZDkyMjFcIixcIiMyNzY0MTlcIl1cbn0sUmRCdToge1xuMzogW1wiI2VmOGE2MlwiLFwiI2Y3ZjdmN1wiLFwiIzY3YTljZlwiXSxcbjQ6IFtcIiNjYTAwMjBcIixcIiNmNGE1ODJcIixcIiM5MmM1ZGVcIixcIiMwNTcxYjBcIl0sXG41OiBbXCIjY2EwMDIwXCIsXCIjZjRhNTgyXCIsXCIjZjdmN2Y3XCIsXCIjOTJjNWRlXCIsXCIjMDU3MWIwXCJdLFxuNjogW1wiI2IyMTgyYlwiLFwiI2VmOGE2MlwiLFwiI2ZkZGJjN1wiLFwiI2QxZTVmMFwiLFwiIzY3YTljZlwiLFwiIzIxNjZhY1wiXSxcbjc6IFtcIiNiMjE4MmJcIixcIiNlZjhhNjJcIixcIiNmZGRiYzdcIixcIiNmN2Y3ZjdcIixcIiNkMWU1ZjBcIixcIiM2N2E5Y2ZcIixcIiMyMTY2YWNcIl0sXG44OiBbXCIjYjIxODJiXCIsXCIjZDY2MDRkXCIsXCIjZjRhNTgyXCIsXCIjZmRkYmM3XCIsXCIjZDFlNWYwXCIsXCIjOTJjNWRlXCIsXCIjNDM5M2MzXCIsXCIjMjE2NmFjXCJdLFxuOTogW1wiI2IyMTgyYlwiLFwiI2Q2NjA0ZFwiLFwiI2Y0YTU4MlwiLFwiI2ZkZGJjN1wiLFwiI2Y3ZjdmN1wiLFwiI2QxZTVmMFwiLFwiIzkyYzVkZVwiLFwiIzQzOTNjM1wiLFwiIzIxNjZhY1wiXSxcbjEwOiBbXCIjNjcwMDFmXCIsXCIjYjIxODJiXCIsXCIjZDY2MDRkXCIsXCIjZjRhNTgyXCIsXCIjZmRkYmM3XCIsXCIjZDFlNWYwXCIsXCIjOTJjNWRlXCIsXCIjNDM5M2MzXCIsXCIjMjE2NmFjXCIsXCIjMDUzMDYxXCJdLFxuMTE6IFtcIiM2NzAwMWZcIixcIiNiMjE4MmJcIixcIiNkNjYwNGRcIixcIiNmNGE1ODJcIixcIiNmZGRiYzdcIixcIiNmN2Y3ZjdcIixcIiNkMWU1ZjBcIixcIiM5MmM1ZGVcIixcIiM0MzkzYzNcIixcIiMyMTY2YWNcIixcIiMwNTMwNjFcIl1cbn0sUmRHeToge1xuMzogW1wiI2VmOGE2MlwiLFwiI2ZmZmZmZlwiLFwiIzk5OTk5OVwiXSxcbjQ6IFtcIiNjYTAwMjBcIixcIiNmNGE1ODJcIixcIiNiYWJhYmFcIixcIiM0MDQwNDBcIl0sXG41OiBbXCIjY2EwMDIwXCIsXCIjZjRhNTgyXCIsXCIjZmZmZmZmXCIsXCIjYmFiYWJhXCIsXCIjNDA0MDQwXCJdLFxuNjogW1wiI2IyMTgyYlwiLFwiI2VmOGE2MlwiLFwiI2ZkZGJjN1wiLFwiI2UwZTBlMFwiLFwiIzk5OTk5OVwiLFwiIzRkNGQ0ZFwiXSxcbjc6IFtcIiNiMjE4MmJcIixcIiNlZjhhNjJcIixcIiNmZGRiYzdcIixcIiNmZmZmZmZcIixcIiNlMGUwZTBcIixcIiM5OTk5OTlcIixcIiM0ZDRkNGRcIl0sXG44OiBbXCIjYjIxODJiXCIsXCIjZDY2MDRkXCIsXCIjZjRhNTgyXCIsXCIjZmRkYmM3XCIsXCIjZTBlMGUwXCIsXCIjYmFiYWJhXCIsXCIjODc4Nzg3XCIsXCIjNGQ0ZDRkXCJdLFxuOTogW1wiI2IyMTgyYlwiLFwiI2Q2NjA0ZFwiLFwiI2Y0YTU4MlwiLFwiI2ZkZGJjN1wiLFwiI2ZmZmZmZlwiLFwiI2UwZTBlMFwiLFwiI2JhYmFiYVwiLFwiIzg3ODc4N1wiLFwiIzRkNGQ0ZFwiXSxcbjEwOiBbXCIjNjcwMDFmXCIsXCIjYjIxODJiXCIsXCIjZDY2MDRkXCIsXCIjZjRhNTgyXCIsXCIjZmRkYmM3XCIsXCIjZTBlMGUwXCIsXCIjYmFiYWJhXCIsXCIjODc4Nzg3XCIsXCIjNGQ0ZDRkXCIsXCIjMWExYTFhXCJdLFxuMTE6IFtcIiM2NzAwMWZcIixcIiNiMjE4MmJcIixcIiNkNjYwNGRcIixcIiNmNGE1ODJcIixcIiNmZGRiYzdcIixcIiNmZmZmZmZcIixcIiNlMGUwZTBcIixcIiNiYWJhYmFcIixcIiM4Nzg3ODdcIixcIiM0ZDRkNGRcIixcIiMxYTFhMWFcIl1cbn0sUmRZbEJ1OiB7XG4zOiBbXCIjZmM4ZDU5XCIsXCIjZmZmZmJmXCIsXCIjOTFiZmRiXCJdLFxuNDogW1wiI2Q3MTkxY1wiLFwiI2ZkYWU2MVwiLFwiI2FiZDllOVwiLFwiIzJjN2JiNlwiXSxcbjU6IFtcIiNkNzE5MWNcIixcIiNmZGFlNjFcIixcIiNmZmZmYmZcIixcIiNhYmQ5ZTlcIixcIiMyYzdiYjZcIl0sXG42OiBbXCIjZDczMDI3XCIsXCIjZmM4ZDU5XCIsXCIjZmVlMDkwXCIsXCIjZTBmM2Y4XCIsXCIjOTFiZmRiXCIsXCIjNDU3NWI0XCJdLFxuNzogW1wiI2Q3MzAyN1wiLFwiI2ZjOGQ1OVwiLFwiI2ZlZTA5MFwiLFwiI2ZmZmZiZlwiLFwiI2UwZjNmOFwiLFwiIzkxYmZkYlwiLFwiIzQ1NzViNFwiXSxcbjg6IFtcIiNkNzMwMjdcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOTBcIixcIiNlMGYzZjhcIixcIiNhYmQ5ZTlcIixcIiM3NGFkZDFcIixcIiM0NTc1YjRcIl0sXG45OiBbXCIjZDczMDI3XCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDkwXCIsXCIjZmZmZmJmXCIsXCIjZTBmM2Y4XCIsXCIjYWJkOWU5XCIsXCIjNzRhZGQxXCIsXCIjNDU3NWI0XCJdLFxuMTA6IFtcIiNhNTAwMjZcIixcIiNkNzMwMjdcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOTBcIixcIiNlMGYzZjhcIixcIiNhYmQ5ZTlcIixcIiM3NGFkZDFcIixcIiM0NTc1YjRcIixcIiMzMTM2OTVcIl0sXG4xMTogW1wiI2E1MDAyNlwiLFwiI2Q3MzAyN1wiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA5MFwiLFwiI2ZmZmZiZlwiLFwiI2UwZjNmOFwiLFwiI2FiZDllOVwiLFwiIzc0YWRkMVwiLFwiIzQ1NzViNFwiLFwiIzMxMzY5NVwiXVxufSxTcGVjdHJhbDoge1xuMzogW1wiI2ZjOGQ1OVwiLFwiI2ZmZmZiZlwiLFwiIzk5ZDU5NFwiXSxcbjQ6IFtcIiNkNzE5MWNcIixcIiNmZGFlNjFcIixcIiNhYmRkYTRcIixcIiMyYjgzYmFcIl0sXG41OiBbXCIjZDcxOTFjXCIsXCIjZmRhZTYxXCIsXCIjZmZmZmJmXCIsXCIjYWJkZGE0XCIsXCIjMmI4M2JhXCJdLFxuNjogW1wiI2Q1M2U0ZlwiLFwiI2ZjOGQ1OVwiLFwiI2ZlZTA4YlwiLFwiI2U2ZjU5OFwiLFwiIzk5ZDU5NFwiLFwiIzMyODhiZFwiXSxcbjc6IFtcIiNkNTNlNGZcIixcIiNmYzhkNTlcIixcIiNmZWUwOGJcIixcIiNmZmZmYmZcIixcIiNlNmY1OThcIixcIiM5OWQ1OTRcIixcIiMzMjg4YmRcIl0sXG44OiBbXCIjZDUzZTRmXCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDhiXCIsXCIjZTZmNTk4XCIsXCIjYWJkZGE0XCIsXCIjNjZjMmE1XCIsXCIjMzI4OGJkXCJdLFxuOTogW1wiI2Q1M2U0ZlwiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA4YlwiLFwiI2ZmZmZiZlwiLFwiI2U2ZjU5OFwiLFwiI2FiZGRhNFwiLFwiIzY2YzJhNVwiLFwiIzMyODhiZFwiXSxcbjEwOiBbXCIjOWUwMTQyXCIsXCIjZDUzZTRmXCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDhiXCIsXCIjZTZmNTk4XCIsXCIjYWJkZGE0XCIsXCIjNjZjMmE1XCIsXCIjMzI4OGJkXCIsXCIjNWU0ZmEyXCJdLFxuMTE6IFtcIiM5ZTAxNDJcIixcIiNkNTNlNGZcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOGJcIixcIiNmZmZmYmZcIixcIiNlNmY1OThcIixcIiNhYmRkYTRcIixcIiM2NmMyYTVcIixcIiMzMjg4YmRcIixcIiM1ZTRmYTJcIl1cbn0sUmRZbEduOiB7XG4zOiBbXCIjZmM4ZDU5XCIsXCIjZmZmZmJmXCIsXCIjOTFjZjYwXCJdLFxuNDogW1wiI2Q3MTkxY1wiLFwiI2ZkYWU2MVwiLFwiI2E2ZDk2YVwiLFwiIzFhOTY0MVwiXSxcbjU6IFtcIiNkNzE5MWNcIixcIiNmZGFlNjFcIixcIiNmZmZmYmZcIixcIiNhNmQ5NmFcIixcIiMxYTk2NDFcIl0sXG42OiBbXCIjZDczMDI3XCIsXCIjZmM4ZDU5XCIsXCIjZmVlMDhiXCIsXCIjZDllZjhiXCIsXCIjOTFjZjYwXCIsXCIjMWE5ODUwXCJdLFxuNzogW1wiI2Q3MzAyN1wiLFwiI2ZjOGQ1OVwiLFwiI2ZlZTA4YlwiLFwiI2ZmZmZiZlwiLFwiI2Q5ZWY4YlwiLFwiIzkxY2Y2MFwiLFwiIzFhOTg1MFwiXSxcbjg6IFtcIiNkNzMwMjdcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOGJcIixcIiNkOWVmOGJcIixcIiNhNmQ5NmFcIixcIiM2NmJkNjNcIixcIiMxYTk4NTBcIl0sXG45OiBbXCIjZDczMDI3XCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDhiXCIsXCIjZmZmZmJmXCIsXCIjZDllZjhiXCIsXCIjYTZkOTZhXCIsXCIjNjZiZDYzXCIsXCIjMWE5ODUwXCJdLFxuMTA6IFtcIiNhNTAwMjZcIixcIiNkNzMwMjdcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOGJcIixcIiNkOWVmOGJcIixcIiNhNmQ5NmFcIixcIiM2NmJkNjNcIixcIiMxYTk4NTBcIixcIiMwMDY4MzdcIl0sXG4xMTogW1wiI2E1MDAyNlwiLFwiI2Q3MzAyN1wiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA4YlwiLFwiI2ZmZmZiZlwiLFwiI2Q5ZWY4YlwiLFwiI2E2ZDk2YVwiLFwiIzY2YmQ2M1wiLFwiIzFhOTg1MFwiLFwiIzAwNjgzN1wiXVxufSxBY2NlbnQ6IHtcbjM6IFtcIiM3ZmM5N2ZcIixcIiNiZWFlZDRcIixcIiNmZGMwODZcIl0sXG40OiBbXCIjN2ZjOTdmXCIsXCIjYmVhZWQ0XCIsXCIjZmRjMDg2XCIsXCIjZmZmZjk5XCJdLFxuNTogW1wiIzdmYzk3ZlwiLFwiI2JlYWVkNFwiLFwiI2ZkYzA4NlwiLFwiI2ZmZmY5OVwiLFwiIzM4NmNiMFwiXSxcbjY6IFtcIiM3ZmM5N2ZcIixcIiNiZWFlZDRcIixcIiNmZGMwODZcIixcIiNmZmZmOTlcIixcIiMzODZjYjBcIixcIiNmMDAyN2ZcIl0sXG43OiBbXCIjN2ZjOTdmXCIsXCIjYmVhZWQ0XCIsXCIjZmRjMDg2XCIsXCIjZmZmZjk5XCIsXCIjMzg2Y2IwXCIsXCIjZjAwMjdmXCIsXCIjYmY1YjE3XCJdLFxuODogW1wiIzdmYzk3ZlwiLFwiI2JlYWVkNFwiLFwiI2ZkYzA4NlwiLFwiI2ZmZmY5OVwiLFwiIzM4NmNiMFwiLFwiI2YwMDI3ZlwiLFwiI2JmNWIxN1wiLFwiIzY2NjY2NlwiXVxufSxEYXJrMjoge1xuMzogW1wiIzFiOWU3N1wiLFwiI2Q5NWYwMlwiLFwiIzc1NzBiM1wiXSxcbjQ6IFtcIiMxYjllNzdcIixcIiNkOTVmMDJcIixcIiM3NTcwYjNcIixcIiNlNzI5OGFcIl0sXG41OiBbXCIjMWI5ZTc3XCIsXCIjZDk1ZjAyXCIsXCIjNzU3MGIzXCIsXCIjZTcyOThhXCIsXCIjNjZhNjFlXCJdLFxuNjogW1wiIzFiOWU3N1wiLFwiI2Q5NWYwMlwiLFwiIzc1NzBiM1wiLFwiI2U3Mjk4YVwiLFwiIzY2YTYxZVwiLFwiI2U2YWIwMlwiXSxcbjc6IFtcIiMxYjllNzdcIixcIiNkOTVmMDJcIixcIiM3NTcwYjNcIixcIiNlNzI5OGFcIixcIiM2NmE2MWVcIixcIiNlNmFiMDJcIixcIiNhNjc2MWRcIl0sXG44OiBbXCIjMWI5ZTc3XCIsXCIjZDk1ZjAyXCIsXCIjNzU3MGIzXCIsXCIjZTcyOThhXCIsXCIjNjZhNjFlXCIsXCIjZTZhYjAyXCIsXCIjYTY3NjFkXCIsXCIjNjY2NjY2XCJdXG59LFBhaXJlZDoge1xuMzogW1wiI2E2Y2VlM1wiLFwiIzFmNzhiNFwiLFwiI2IyZGY4YVwiXSxcbjQ6IFtcIiNhNmNlZTNcIixcIiMxZjc4YjRcIixcIiNiMmRmOGFcIixcIiMzM2EwMmNcIl0sXG41OiBbXCIjYTZjZWUzXCIsXCIjMWY3OGI0XCIsXCIjYjJkZjhhXCIsXCIjMzNhMDJjXCIsXCIjZmI5YTk5XCJdLFxuNjogW1wiI2E2Y2VlM1wiLFwiIzFmNzhiNFwiLFwiI2IyZGY4YVwiLFwiIzMzYTAyY1wiLFwiI2ZiOWE5OVwiLFwiI2UzMWExY1wiXSxcbjc6IFtcIiNhNmNlZTNcIixcIiMxZjc4YjRcIixcIiNiMmRmOGFcIixcIiMzM2EwMmNcIixcIiNmYjlhOTlcIixcIiNlMzFhMWNcIixcIiNmZGJmNmZcIl0sXG44OiBbXCIjYTZjZWUzXCIsXCIjMWY3OGI0XCIsXCIjYjJkZjhhXCIsXCIjMzNhMDJjXCIsXCIjZmI5YTk5XCIsXCIjZTMxYTFjXCIsXCIjZmRiZjZmXCIsXCIjZmY3ZjAwXCJdLFxuOTogW1wiI2E2Y2VlM1wiLFwiIzFmNzhiNFwiLFwiI2IyZGY4YVwiLFwiIzMzYTAyY1wiLFwiI2ZiOWE5OVwiLFwiI2UzMWExY1wiLFwiI2ZkYmY2ZlwiLFwiI2ZmN2YwMFwiLFwiI2NhYjJkNlwiXSxcbjEwOiBbXCIjYTZjZWUzXCIsXCIjMWY3OGI0XCIsXCIjYjJkZjhhXCIsXCIjMzNhMDJjXCIsXCIjZmI5YTk5XCIsXCIjZTMxYTFjXCIsXCIjZmRiZjZmXCIsXCIjZmY3ZjAwXCIsXCIjY2FiMmQ2XCIsXCIjNmEzZDlhXCJdLFxuMTE6IFtcIiNhNmNlZTNcIixcIiMxZjc4YjRcIixcIiNiMmRmOGFcIixcIiMzM2EwMmNcIixcIiNmYjlhOTlcIixcIiNlMzFhMWNcIixcIiNmZGJmNmZcIixcIiNmZjdmMDBcIixcIiNjYWIyZDZcIixcIiM2YTNkOWFcIixcIiNmZmZmOTlcIl0sXG4xMjogW1wiI2E2Y2VlM1wiLFwiIzFmNzhiNFwiLFwiI2IyZGY4YVwiLFwiIzMzYTAyY1wiLFwiI2ZiOWE5OVwiLFwiI2UzMWExY1wiLFwiI2ZkYmY2ZlwiLFwiI2ZmN2YwMFwiLFwiI2NhYjJkNlwiLFwiIzZhM2Q5YVwiLFwiI2ZmZmY5OVwiLFwiI2IxNTkyOFwiXVxufSxQYXN0ZWwxOiB7XG4zOiBbXCIjZmJiNGFlXCIsXCIjYjNjZGUzXCIsXCIjY2NlYmM1XCJdLFxuNDogW1wiI2ZiYjRhZVwiLFwiI2IzY2RlM1wiLFwiI2NjZWJjNVwiLFwiI2RlY2JlNFwiXSxcbjU6IFtcIiNmYmI0YWVcIixcIiNiM2NkZTNcIixcIiNjY2ViYzVcIixcIiNkZWNiZTRcIixcIiNmZWQ5YTZcIl0sXG42OiBbXCIjZmJiNGFlXCIsXCIjYjNjZGUzXCIsXCIjY2NlYmM1XCIsXCIjZGVjYmU0XCIsXCIjZmVkOWE2XCIsXCIjZmZmZmNjXCJdLFxuNzogW1wiI2ZiYjRhZVwiLFwiI2IzY2RlM1wiLFwiI2NjZWJjNVwiLFwiI2RlY2JlNFwiLFwiI2ZlZDlhNlwiLFwiI2ZmZmZjY1wiLFwiI2U1ZDhiZFwiXSxcbjg6IFtcIiNmYmI0YWVcIixcIiNiM2NkZTNcIixcIiNjY2ViYzVcIixcIiNkZWNiZTRcIixcIiNmZWQ5YTZcIixcIiNmZmZmY2NcIixcIiNlNWQ4YmRcIixcIiNmZGRhZWNcIl0sXG45OiBbXCIjZmJiNGFlXCIsXCIjYjNjZGUzXCIsXCIjY2NlYmM1XCIsXCIjZGVjYmU0XCIsXCIjZmVkOWE2XCIsXCIjZmZmZmNjXCIsXCIjZTVkOGJkXCIsXCIjZmRkYWVjXCIsXCIjZjJmMmYyXCJdXG59LFBhc3RlbDI6IHtcbjM6IFtcIiNiM2UyY2RcIixcIiNmZGNkYWNcIixcIiNjYmQ1ZThcIl0sXG40OiBbXCIjYjNlMmNkXCIsXCIjZmRjZGFjXCIsXCIjY2JkNWU4XCIsXCIjZjRjYWU0XCJdLFxuNTogW1wiI2IzZTJjZFwiLFwiI2ZkY2RhY1wiLFwiI2NiZDVlOFwiLFwiI2Y0Y2FlNFwiLFwiI2U2ZjVjOVwiXSxcbjY6IFtcIiNiM2UyY2RcIixcIiNmZGNkYWNcIixcIiNjYmQ1ZThcIixcIiNmNGNhZTRcIixcIiNlNmY1YzlcIixcIiNmZmYyYWVcIl0sXG43OiBbXCIjYjNlMmNkXCIsXCIjZmRjZGFjXCIsXCIjY2JkNWU4XCIsXCIjZjRjYWU0XCIsXCIjZTZmNWM5XCIsXCIjZmZmMmFlXCIsXCIjZjFlMmNjXCJdLFxuODogW1wiI2IzZTJjZFwiLFwiI2ZkY2RhY1wiLFwiI2NiZDVlOFwiLFwiI2Y0Y2FlNFwiLFwiI2U2ZjVjOVwiLFwiI2ZmZjJhZVwiLFwiI2YxZTJjY1wiLFwiI2NjY2NjY1wiXVxufSxTZXQxOiB7XG4zOiBbXCIjZTQxYTFjXCIsXCIjMzc3ZWI4XCIsXCIjNGRhZjRhXCJdLFxuNDogW1wiI2U0MWExY1wiLFwiIzM3N2ViOFwiLFwiIzRkYWY0YVwiLFwiIzk4NGVhM1wiXSxcbjU6IFtcIiNlNDFhMWNcIixcIiMzNzdlYjhcIixcIiM0ZGFmNGFcIixcIiM5ODRlYTNcIixcIiNmZjdmMDBcIl0sXG42OiBbXCIjZTQxYTFjXCIsXCIjMzc3ZWI4XCIsXCIjNGRhZjRhXCIsXCIjOTg0ZWEzXCIsXCIjZmY3ZjAwXCIsXCIjZmZmZjMzXCJdLFxuNzogW1wiI2U0MWExY1wiLFwiIzM3N2ViOFwiLFwiIzRkYWY0YVwiLFwiIzk4NGVhM1wiLFwiI2ZmN2YwMFwiLFwiI2ZmZmYzM1wiLFwiI2E2NTYyOFwiXSxcbjg6IFtcIiNlNDFhMWNcIixcIiMzNzdlYjhcIixcIiM0ZGFmNGFcIixcIiM5ODRlYTNcIixcIiNmZjdmMDBcIixcIiNmZmZmMzNcIixcIiNhNjU2MjhcIixcIiNmNzgxYmZcIl0sXG45OiBbXCIjZTQxYTFjXCIsXCIjMzc3ZWI4XCIsXCIjNGRhZjRhXCIsXCIjOTg0ZWEzXCIsXCIjZmY3ZjAwXCIsXCIjZmZmZjMzXCIsXCIjYTY1NjI4XCIsXCIjZjc4MWJmXCIsXCIjOTk5OTk5XCJdXG59LFNldDI6IHtcbjM6IFtcIiM2NmMyYTVcIixcIiNmYzhkNjJcIixcIiM4ZGEwY2JcIl0sXG40OiBbXCIjNjZjMmE1XCIsXCIjZmM4ZDYyXCIsXCIjOGRhMGNiXCIsXCIjZTc4YWMzXCJdLFxuNTogW1wiIzY2YzJhNVwiLFwiI2ZjOGQ2MlwiLFwiIzhkYTBjYlwiLFwiI2U3OGFjM1wiLFwiI2E2ZDg1NFwiXSxcbjY6IFtcIiM2NmMyYTVcIixcIiNmYzhkNjJcIixcIiM4ZGEwY2JcIixcIiNlNzhhYzNcIixcIiNhNmQ4NTRcIixcIiNmZmQ5MmZcIl0sXG43OiBbXCIjNjZjMmE1XCIsXCIjZmM4ZDYyXCIsXCIjOGRhMGNiXCIsXCIjZTc4YWMzXCIsXCIjYTZkODU0XCIsXCIjZmZkOTJmXCIsXCIjZTVjNDk0XCJdLFxuODogW1wiIzY2YzJhNVwiLFwiI2ZjOGQ2MlwiLFwiIzhkYTBjYlwiLFwiI2U3OGFjM1wiLFwiI2E2ZDg1NFwiLFwiI2ZmZDkyZlwiLFwiI2U1YzQ5NFwiLFwiI2IzYjNiM1wiXVxufSxTZXQzOiB7XG4zOiBbXCIjOGRkM2M3XCIsXCIjZmZmZmIzXCIsXCIjYmViYWRhXCJdLFxuNDogW1wiIzhkZDNjN1wiLFwiI2ZmZmZiM1wiLFwiI2JlYmFkYVwiLFwiI2ZiODA3MlwiXSxcbjU6IFtcIiM4ZGQzYzdcIixcIiNmZmZmYjNcIixcIiNiZWJhZGFcIixcIiNmYjgwNzJcIixcIiM4MGIxZDNcIl0sXG42OiBbXCIjOGRkM2M3XCIsXCIjZmZmZmIzXCIsXCIjYmViYWRhXCIsXCIjZmI4MDcyXCIsXCIjODBiMWQzXCIsXCIjZmRiNDYyXCJdLFxuNzogW1wiIzhkZDNjN1wiLFwiI2ZmZmZiM1wiLFwiI2JlYmFkYVwiLFwiI2ZiODA3MlwiLFwiIzgwYjFkM1wiLFwiI2ZkYjQ2MlwiLFwiI2IzZGU2OVwiXSxcbjg6IFtcIiM4ZGQzYzdcIixcIiNmZmZmYjNcIixcIiNiZWJhZGFcIixcIiNmYjgwNzJcIixcIiM4MGIxZDNcIixcIiNmZGI0NjJcIixcIiNiM2RlNjlcIixcIiNmY2NkZTVcIl0sXG45OiBbXCIjOGRkM2M3XCIsXCIjZmZmZmIzXCIsXCIjYmViYWRhXCIsXCIjZmI4MDcyXCIsXCIjODBiMWQzXCIsXCIjZmRiNDYyXCIsXCIjYjNkZTY5XCIsXCIjZmNjZGU1XCIsXCIjZDlkOWQ5XCJdLFxuMTA6IFtcIiM4ZGQzYzdcIixcIiNmZmZmYjNcIixcIiNiZWJhZGFcIixcIiNmYjgwNzJcIixcIiM4MGIxZDNcIixcIiNmZGI0NjJcIixcIiNiM2RlNjlcIixcIiNmY2NkZTVcIixcIiNkOWQ5ZDlcIixcIiNiYzgwYmRcIl0sXG4xMTogW1wiIzhkZDNjN1wiLFwiI2ZmZmZiM1wiLFwiI2JlYmFkYVwiLFwiI2ZiODA3MlwiLFwiIzgwYjFkM1wiLFwiI2ZkYjQ2MlwiLFwiI2IzZGU2OVwiLFwiI2ZjY2RlNVwiLFwiI2Q5ZDlkOVwiLFwiI2JjODBiZFwiLFwiI2NjZWJjNVwiXSxcbjEyOiBbXCIjOGRkM2M3XCIsXCIjZmZmZmIzXCIsXCIjYmViYWRhXCIsXCIjZmI4MDcyXCIsXCIjODBiMWQzXCIsXCIjZmRiNDYyXCIsXCIjYjNkZTY5XCIsXCIjZmNjZGU1XCIsXCIjZDlkOWQ5XCIsXCIjYmM4MGJkXCIsXCIjY2NlYmM1XCIsXCIjZmZlZDZmXCJdXG59fTtcblxuaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGNvbG9yYnJld2VyKTtcbn0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gY29sb3JicmV3ZXI7XG59IGVsc2Uge1xuICAgIHRoaXMuY29sb3JicmV3ZXIgPSBjb2xvcmJyZXdlcjtcbn1cblxufSgpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvbG9yYnJld2VyLmpzJyk7XG4iLCJpZiAodHlwZW9mIE1hcCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICBNYXAgPSBmdW5jdGlvbigpIHsgdGhpcy5jbGVhcigpOyB9O1xuICBNYXAucHJvdG90eXBlID0ge1xuICAgIHNldDogZnVuY3Rpb24oaywgdikgeyB0aGlzLl9ba10gPSB2OyByZXR1cm4gdGhpczsgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIHRoaXMuX1trXTsgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIGsgaW4gdGhpcy5fOyB9LFxuICAgIGRlbGV0ZTogZnVuY3Rpb24oaykgeyByZXR1cm4gayBpbiB0aGlzLl8gJiYgZGVsZXRlIHRoaXMuX1trXTsgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7IHRoaXMuXyA9IE9iamVjdC5jcmVhdGUobnVsbCk7IH0sXG4gICAgZ2V0IHNpemUoKSB7IHZhciBuID0gMDsgZm9yICh2YXIgayBpbiB0aGlzLl8pICsrbjsgcmV0dXJuIG47IH0sXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oYykgeyBmb3IgKHZhciBrIGluIHRoaXMuXykgYyh0aGlzLl9ba10sIGssIHRoaXMpOyB9XG4gIH07XG59IGVsc2UgKGZ1bmN0aW9uKCkge1xuICB2YXIgbSA9IG5ldyBNYXA7XG4gIGlmIChtLnNldCgwLCAwKSAhPT0gbSkge1xuICAgIG0gPSBtLnNldDtcbiAgICBNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKCkgeyBtLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IHJldHVybiB0aGlzOyB9O1xuICB9XG59KSgpO1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gIGZhY3RvcnkoKGdsb2JhbC5jb2xvciA9IHt9KSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICBmdW5jdGlvbiBkZWx0YUh1ZShoMSwgaDApIHtcbiAgICB2YXIgZGVsdGEgPSBoMSAtIGgwO1xuICAgIHJldHVybiBkZWx0YSA+IDE4MCB8fCBkZWx0YSA8IC0xODBcbiAgICAgICAgPyBkZWx0YSAtIDM2MCAqIE1hdGgucm91bmQoZGVsdGEgLyAzNjApXG4gICAgICAgIDogZGVsdGE7XG4gIH1cblxuICBmdW5jdGlvbiBDb2xvcigpIHt9XG5cbiAgdmFyIHJlSGV4MyA9IC9eIyhbMC05YS1mXXszfSkkLztcbiAgdmFyIHJlSGV4NiA9IC9eIyhbMC05YS1mXXs2fSkkLztcbiAgdmFyIHJlUmdiSW50ZWdlciA9IC9ecmdiXFwoXFxzKihbLStdP1xcZCspXFxzKixcXHMqKFstK10/XFxkKylcXHMqLFxccyooWy0rXT9cXGQrKVxccypcXCkkLztcbiAgdmFyIHJlUmdiUGVyY2VudCA9IC9ecmdiXFwoXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccypcXCkkLztcbiAgdmFyIHJlSHNsUGVyY2VudCA9IC9eaHNsXFwoXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKlxcKSQvO1xuXG4gIGNvbG9yLnByb3RvdHlwZSA9IENvbG9yLnByb3RvdHlwZSA9IHtcbiAgICBkaXNwbGF5YWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZ2IoKS5kaXNwbGF5YWJsZSgpO1xuICAgIH0sXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmdiKCkgKyBcIlwiO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBjb2xvcihmb3JtYXQpIHtcbiAgICB2YXIgbTtcbiAgICBmb3JtYXQgPSAoZm9ybWF0ICsgXCJcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIChtID0gcmVIZXgzLmV4ZWMoZm9ybWF0KSkgPyAobSA9IHBhcnNlSW50KG1bMV0sIDE2KSwgcmdiKChtID4+IDggJiAweGYpIHwgKG0gPj4gNCAmIDB4MGYwKSwgKG0gPj4gNCAmIDB4ZikgfCAobSAmIDB4ZjApLCAoKG0gJiAweGYpIDw8IDQpIHwgKG0gJiAweGYpKSkgLy8gI2YwMFxuICAgICAgICA6IChtID0gcmVIZXg2LmV4ZWMoZm9ybWF0KSkgPyByZ2JuKHBhcnNlSW50KG1bMV0sIDE2KSkgLy8gI2ZmMDAwMFxuICAgICAgICA6IChtID0gcmVSZ2JJbnRlZ2VyLmV4ZWMoZm9ybWF0KSkgPyByZ2IobVsxXSwgbVsyXSwgbVszXSkgLy8gcmdiKDI1NSwwLDApXG4gICAgICAgIDogKG0gPSByZVJnYlBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IHJnYihtWzFdICogMi41NSwgbVsyXSAqIDIuNTUsIG1bM10gKiAyLjU1KSAvLyByZ2IoMTAwJSwwJSwwJSlcbiAgICAgICAgOiAobSA9IHJlSHNsUGVyY2VudC5leGVjKGZvcm1hdCkpID8gaHNsKG1bMV0sIG1bMl0gKiAuMDEsIG1bM10gKiAuMDEpIC8vIGhzbCgxMjAsNTAlLDUwJSlcbiAgICAgICAgOiBuYW1lZC5oYXMoZm9ybWF0KSA/IHJnYm4obmFtZWQuZ2V0KGZvcm1hdCkpXG4gICAgICAgIDogbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJnYm4obikge1xuICAgIHJldHVybiByZ2IobiA+PiAxNiAmIDB4ZmYsIG4gPj4gOCAmIDB4ZmYsIG4gJiAweGZmKTtcbiAgfVxuXG4gIHZhciBuYW1lZCA9IChuZXcgTWFwKVxuICAgICAgLnNldChcImFsaWNlYmx1ZVwiLCAweGYwZjhmZilcbiAgICAgIC5zZXQoXCJhbnRpcXVld2hpdGVcIiwgMHhmYWViZDcpXG4gICAgICAuc2V0KFwiYXF1YVwiLCAweDAwZmZmZilcbiAgICAgIC5zZXQoXCJhcXVhbWFyaW5lXCIsIDB4N2ZmZmQ0KVxuICAgICAgLnNldChcImF6dXJlXCIsIDB4ZjBmZmZmKVxuICAgICAgLnNldChcImJlaWdlXCIsIDB4ZjVmNWRjKVxuICAgICAgLnNldChcImJpc3F1ZVwiLCAweGZmZTRjNClcbiAgICAgIC5zZXQoXCJibGFja1wiLCAweDAwMDAwMClcbiAgICAgIC5zZXQoXCJibGFuY2hlZGFsbW9uZFwiLCAweGZmZWJjZClcbiAgICAgIC5zZXQoXCJibHVlXCIsIDB4MDAwMGZmKVxuICAgICAgLnNldChcImJsdWV2aW9sZXRcIiwgMHg4YTJiZTIpXG4gICAgICAuc2V0KFwiYnJvd25cIiwgMHhhNTJhMmEpXG4gICAgICAuc2V0KFwiYnVybHl3b29kXCIsIDB4ZGViODg3KVxuICAgICAgLnNldChcImNhZGV0Ymx1ZVwiLCAweDVmOWVhMClcbiAgICAgIC5zZXQoXCJjaGFydHJldXNlXCIsIDB4N2ZmZjAwKVxuICAgICAgLnNldChcImNob2NvbGF0ZVwiLCAweGQyNjkxZSlcbiAgICAgIC5zZXQoXCJjb3JhbFwiLCAweGZmN2Y1MClcbiAgICAgIC5zZXQoXCJjb3JuZmxvd2VyYmx1ZVwiLCAweDY0OTVlZClcbiAgICAgIC5zZXQoXCJjb3Juc2lsa1wiLCAweGZmZjhkYylcbiAgICAgIC5zZXQoXCJjcmltc29uXCIsIDB4ZGMxNDNjKVxuICAgICAgLnNldChcImN5YW5cIiwgMHgwMGZmZmYpXG4gICAgICAuc2V0KFwiZGFya2JsdWVcIiwgMHgwMDAwOGIpXG4gICAgICAuc2V0KFwiZGFya2N5YW5cIiwgMHgwMDhiOGIpXG4gICAgICAuc2V0KFwiZGFya2dvbGRlbnJvZFwiLCAweGI4ODYwYilcbiAgICAgIC5zZXQoXCJkYXJrZ3JheVwiLCAweGE5YTlhOSlcbiAgICAgIC5zZXQoXCJkYXJrZ3JlZW5cIiwgMHgwMDY0MDApXG4gICAgICAuc2V0KFwiZGFya2dyZXlcIiwgMHhhOWE5YTkpXG4gICAgICAuc2V0KFwiZGFya2toYWtpXCIsIDB4YmRiNzZiKVxuICAgICAgLnNldChcImRhcmttYWdlbnRhXCIsIDB4OGIwMDhiKVxuICAgICAgLnNldChcImRhcmtvbGl2ZWdyZWVuXCIsIDB4NTU2YjJmKVxuICAgICAgLnNldChcImRhcmtvcmFuZ2VcIiwgMHhmZjhjMDApXG4gICAgICAuc2V0KFwiZGFya29yY2hpZFwiLCAweDk5MzJjYylcbiAgICAgIC5zZXQoXCJkYXJrcmVkXCIsIDB4OGIwMDAwKVxuICAgICAgLnNldChcImRhcmtzYWxtb25cIiwgMHhlOTk2N2EpXG4gICAgICAuc2V0KFwiZGFya3NlYWdyZWVuXCIsIDB4OGZiYzhmKVxuICAgICAgLnNldChcImRhcmtzbGF0ZWJsdWVcIiwgMHg0ODNkOGIpXG4gICAgICAuc2V0KFwiZGFya3NsYXRlZ3JheVwiLCAweDJmNGY0ZilcbiAgICAgIC5zZXQoXCJkYXJrc2xhdGVncmV5XCIsIDB4MmY0ZjRmKVxuICAgICAgLnNldChcImRhcmt0dXJxdW9pc2VcIiwgMHgwMGNlZDEpXG4gICAgICAuc2V0KFwiZGFya3Zpb2xldFwiLCAweDk0MDBkMylcbiAgICAgIC5zZXQoXCJkZWVwcGlua1wiLCAweGZmMTQ5MylcbiAgICAgIC5zZXQoXCJkZWVwc2t5Ymx1ZVwiLCAweDAwYmZmZilcbiAgICAgIC5zZXQoXCJkaW1ncmF5XCIsIDB4Njk2OTY5KVxuICAgICAgLnNldChcImRpbWdyZXlcIiwgMHg2OTY5NjkpXG4gICAgICAuc2V0KFwiZG9kZ2VyYmx1ZVwiLCAweDFlOTBmZilcbiAgICAgIC5zZXQoXCJmaXJlYnJpY2tcIiwgMHhiMjIyMjIpXG4gICAgICAuc2V0KFwiZmxvcmFsd2hpdGVcIiwgMHhmZmZhZjApXG4gICAgICAuc2V0KFwiZm9yZXN0Z3JlZW5cIiwgMHgyMjhiMjIpXG4gICAgICAuc2V0KFwiZnVjaHNpYVwiLCAweGZmMDBmZilcbiAgICAgIC5zZXQoXCJnYWluc2Jvcm9cIiwgMHhkY2RjZGMpXG4gICAgICAuc2V0KFwiZ2hvc3R3aGl0ZVwiLCAweGY4ZjhmZilcbiAgICAgIC5zZXQoXCJnb2xkXCIsIDB4ZmZkNzAwKVxuICAgICAgLnNldChcImdvbGRlbnJvZFwiLCAweGRhYTUyMClcbiAgICAgIC5zZXQoXCJncmF5XCIsIDB4ODA4MDgwKVxuICAgICAgLnNldChcImdyZWVuXCIsIDB4MDA4MDAwKVxuICAgICAgLnNldChcImdyZWVueWVsbG93XCIsIDB4YWRmZjJmKVxuICAgICAgLnNldChcImdyZXlcIiwgMHg4MDgwODApXG4gICAgICAuc2V0KFwiaG9uZXlkZXdcIiwgMHhmMGZmZjApXG4gICAgICAuc2V0KFwiaG90cGlua1wiLCAweGZmNjliNClcbiAgICAgIC5zZXQoXCJpbmRpYW5yZWRcIiwgMHhjZDVjNWMpXG4gICAgICAuc2V0KFwiaW5kaWdvXCIsIDB4NGIwMDgyKVxuICAgICAgLnNldChcIml2b3J5XCIsIDB4ZmZmZmYwKVxuICAgICAgLnNldChcImtoYWtpXCIsIDB4ZjBlNjhjKVxuICAgICAgLnNldChcImxhdmVuZGVyXCIsIDB4ZTZlNmZhKVxuICAgICAgLnNldChcImxhdmVuZGVyYmx1c2hcIiwgMHhmZmYwZjUpXG4gICAgICAuc2V0KFwibGF3bmdyZWVuXCIsIDB4N2NmYzAwKVxuICAgICAgLnNldChcImxlbW9uY2hpZmZvblwiLCAweGZmZmFjZClcbiAgICAgIC5zZXQoXCJsaWdodGJsdWVcIiwgMHhhZGQ4ZTYpXG4gICAgICAuc2V0KFwibGlnaHRjb3JhbFwiLCAweGYwODA4MClcbiAgICAgIC5zZXQoXCJsaWdodGN5YW5cIiwgMHhlMGZmZmYpXG4gICAgICAuc2V0KFwibGlnaHRnb2xkZW5yb2R5ZWxsb3dcIiwgMHhmYWZhZDIpXG4gICAgICAuc2V0KFwibGlnaHRncmF5XCIsIDB4ZDNkM2QzKVxuICAgICAgLnNldChcImxpZ2h0Z3JlZW5cIiwgMHg5MGVlOTApXG4gICAgICAuc2V0KFwibGlnaHRncmV5XCIsIDB4ZDNkM2QzKVxuICAgICAgLnNldChcImxpZ2h0cGlua1wiLCAweGZmYjZjMSlcbiAgICAgIC5zZXQoXCJsaWdodHNhbG1vblwiLCAweGZmYTA3YSlcbiAgICAgIC5zZXQoXCJsaWdodHNlYWdyZWVuXCIsIDB4MjBiMmFhKVxuICAgICAgLnNldChcImxpZ2h0c2t5Ymx1ZVwiLCAweDg3Y2VmYSlcbiAgICAgIC5zZXQoXCJsaWdodHNsYXRlZ3JheVwiLCAweDc3ODg5OSlcbiAgICAgIC5zZXQoXCJsaWdodHNsYXRlZ3JleVwiLCAweDc3ODg5OSlcbiAgICAgIC5zZXQoXCJsaWdodHN0ZWVsYmx1ZVwiLCAweGIwYzRkZSlcbiAgICAgIC5zZXQoXCJsaWdodHllbGxvd1wiLCAweGZmZmZlMClcbiAgICAgIC5zZXQoXCJsaW1lXCIsIDB4MDBmZjAwKVxuICAgICAgLnNldChcImxpbWVncmVlblwiLCAweDMyY2QzMilcbiAgICAgIC5zZXQoXCJsaW5lblwiLCAweGZhZjBlNilcbiAgICAgIC5zZXQoXCJtYWdlbnRhXCIsIDB4ZmYwMGZmKVxuICAgICAgLnNldChcIm1hcm9vblwiLCAweDgwMDAwMClcbiAgICAgIC5zZXQoXCJtZWRpdW1hcXVhbWFyaW5lXCIsIDB4NjZjZGFhKVxuICAgICAgLnNldChcIm1lZGl1bWJsdWVcIiwgMHgwMDAwY2QpXG4gICAgICAuc2V0KFwibWVkaXVtb3JjaGlkXCIsIDB4YmE1NWQzKVxuICAgICAgLnNldChcIm1lZGl1bXB1cnBsZVwiLCAweDkzNzBkYilcbiAgICAgIC5zZXQoXCJtZWRpdW1zZWFncmVlblwiLCAweDNjYjM3MSlcbiAgICAgIC5zZXQoXCJtZWRpdW1zbGF0ZWJsdWVcIiwgMHg3YjY4ZWUpXG4gICAgICAuc2V0KFwibWVkaXVtc3ByaW5nZ3JlZW5cIiwgMHgwMGZhOWEpXG4gICAgICAuc2V0KFwibWVkaXVtdHVycXVvaXNlXCIsIDB4NDhkMWNjKVxuICAgICAgLnNldChcIm1lZGl1bXZpb2xldHJlZFwiLCAweGM3MTU4NSlcbiAgICAgIC5zZXQoXCJtaWRuaWdodGJsdWVcIiwgMHgxOTE5NzApXG4gICAgICAuc2V0KFwibWludGNyZWFtXCIsIDB4ZjVmZmZhKVxuICAgICAgLnNldChcIm1pc3R5cm9zZVwiLCAweGZmZTRlMSlcbiAgICAgIC5zZXQoXCJtb2NjYXNpblwiLCAweGZmZTRiNSlcbiAgICAgIC5zZXQoXCJuYXZham93aGl0ZVwiLCAweGZmZGVhZClcbiAgICAgIC5zZXQoXCJuYXZ5XCIsIDB4MDAwMDgwKVxuICAgICAgLnNldChcIm9sZGxhY2VcIiwgMHhmZGY1ZTYpXG4gICAgICAuc2V0KFwib2xpdmVcIiwgMHg4MDgwMDApXG4gICAgICAuc2V0KFwib2xpdmVkcmFiXCIsIDB4NmI4ZTIzKVxuICAgICAgLnNldChcIm9yYW5nZVwiLCAweGZmYTUwMClcbiAgICAgIC5zZXQoXCJvcmFuZ2VyZWRcIiwgMHhmZjQ1MDApXG4gICAgICAuc2V0KFwib3JjaGlkXCIsIDB4ZGE3MGQ2KVxuICAgICAgLnNldChcInBhbGVnb2xkZW5yb2RcIiwgMHhlZWU4YWEpXG4gICAgICAuc2V0KFwicGFsZWdyZWVuXCIsIDB4OThmYjk4KVxuICAgICAgLnNldChcInBhbGV0dXJxdW9pc2VcIiwgMHhhZmVlZWUpXG4gICAgICAuc2V0KFwicGFsZXZpb2xldHJlZFwiLCAweGRiNzA5MylcbiAgICAgIC5zZXQoXCJwYXBheWF3aGlwXCIsIDB4ZmZlZmQ1KVxuICAgICAgLnNldChcInBlYWNocHVmZlwiLCAweGZmZGFiOSlcbiAgICAgIC5zZXQoXCJwZXJ1XCIsIDB4Y2Q4NTNmKVxuICAgICAgLnNldChcInBpbmtcIiwgMHhmZmMwY2IpXG4gICAgICAuc2V0KFwicGx1bVwiLCAweGRkYTBkZClcbiAgICAgIC5zZXQoXCJwb3dkZXJibHVlXCIsIDB4YjBlMGU2KVxuICAgICAgLnNldChcInB1cnBsZVwiLCAweDgwMDA4MClcbiAgICAgIC5zZXQoXCJyZWJlY2NhcHVycGxlXCIsIDB4NjYzMzk5KVxuICAgICAgLnNldChcInJlZFwiLCAweGZmMDAwMClcbiAgICAgIC5zZXQoXCJyb3N5YnJvd25cIiwgMHhiYzhmOGYpXG4gICAgICAuc2V0KFwicm95YWxibHVlXCIsIDB4NDE2OWUxKVxuICAgICAgLnNldChcInNhZGRsZWJyb3duXCIsIDB4OGI0NTEzKVxuICAgICAgLnNldChcInNhbG1vblwiLCAweGZhODA3MilcbiAgICAgIC5zZXQoXCJzYW5keWJyb3duXCIsIDB4ZjRhNDYwKVxuICAgICAgLnNldChcInNlYWdyZWVuXCIsIDB4MmU4YjU3KVxuICAgICAgLnNldChcInNlYXNoZWxsXCIsIDB4ZmZmNWVlKVxuICAgICAgLnNldChcInNpZW5uYVwiLCAweGEwNTIyZClcbiAgICAgIC5zZXQoXCJzaWx2ZXJcIiwgMHhjMGMwYzApXG4gICAgICAuc2V0KFwic2t5Ymx1ZVwiLCAweDg3Y2VlYilcbiAgICAgIC5zZXQoXCJzbGF0ZWJsdWVcIiwgMHg2YTVhY2QpXG4gICAgICAuc2V0KFwic2xhdGVncmF5XCIsIDB4NzA4MDkwKVxuICAgICAgLnNldChcInNsYXRlZ3JleVwiLCAweDcwODA5MClcbiAgICAgIC5zZXQoXCJzbm93XCIsIDB4ZmZmYWZhKVxuICAgICAgLnNldChcInNwcmluZ2dyZWVuXCIsIDB4MDBmZjdmKVxuICAgICAgLnNldChcInN0ZWVsYmx1ZVwiLCAweDQ2ODJiNClcbiAgICAgIC5zZXQoXCJ0YW5cIiwgMHhkMmI0OGMpXG4gICAgICAuc2V0KFwidGVhbFwiLCAweDAwODA4MClcbiAgICAgIC5zZXQoXCJ0aGlzdGxlXCIsIDB4ZDhiZmQ4KVxuICAgICAgLnNldChcInRvbWF0b1wiLCAweGZmNjM0NylcbiAgICAgIC5zZXQoXCJ0dXJxdW9pc2VcIiwgMHg0MGUwZDApXG4gICAgICAuc2V0KFwidmlvbGV0XCIsIDB4ZWU4MmVlKVxuICAgICAgLnNldChcIndoZWF0XCIsIDB4ZjVkZWIzKVxuICAgICAgLnNldChcIndoaXRlXCIsIDB4ZmZmZmZmKVxuICAgICAgLnNldChcIndoaXRlc21va2VcIiwgMHhmNWY1ZjUpXG4gICAgICAuc2V0KFwieWVsbG93XCIsIDB4ZmZmZjAwKVxuICAgICAgLnNldChcInllbGxvd2dyZWVuXCIsIDB4OWFjZDMyKTtcblxuICB2YXIgZGFya2VyID0gLjc7XG4gIHZhciBicmlnaHRlciA9IDEgLyBkYXJrZXI7XG5cbiAgZnVuY3Rpb24gcmdiKHIsIGcsIGIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKCEociBpbnN0YW5jZW9mIENvbG9yKSkgciA9IGNvbG9yKHIpO1xuICAgICAgaWYgKHIpIHtcbiAgICAgICAgciA9IHIucmdiKCk7XG4gICAgICAgIGIgPSByLmI7XG4gICAgICAgIGcgPSByLmc7XG4gICAgICAgIHIgPSByLnI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByID0gZyA9IGIgPSBOYU47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgUmdiKHIsIGcsIGIpO1xuICB9XG5cbiAgZnVuY3Rpb24gUmdiKHIsIGcsIGIpIHtcbiAgICB0aGlzLnIgPSArcjtcbiAgICB0aGlzLmcgPSArZztcbiAgICB0aGlzLmIgPSArYjtcbiAgfVxuXG4gIHZhciBfcHJvdG90eXBlID0gcmdiLnByb3RvdHlwZSA9IFJnYi5wcm90b3R5cGUgPSBuZXcgQ29sb3I7XG5cbiAgX3Byb3RvdHlwZS5icmlnaHRlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gYnJpZ2h0ZXIgOiBNYXRoLnBvdyhicmlnaHRlciwgayk7XG4gICAgcmV0dXJuIG5ldyBSZ2IodGhpcy5yICogaywgdGhpcy5nICogaywgdGhpcy5iICogayk7XG4gIH07XG5cbiAgX3Byb3RvdHlwZS5kYXJrZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBSZ2IodGhpcy5yICogaywgdGhpcy5nICogaywgdGhpcy5iICogayk7XG4gIH07XG5cbiAgX3Byb3RvdHlwZS5yZ2IgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBfcHJvdG90eXBlLmRpc3BsYXlhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICgwIDw9IHRoaXMuciAmJiB0aGlzLnIgPD0gMjU1KVxuICAgICAgICAmJiAoMCA8PSB0aGlzLmcgJiYgdGhpcy5nIDw9IDI1NSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5iICYmIHRoaXMuYiA8PSAyNTUpO1xuICB9O1xuXG4gIF9wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZm9ybWF0KHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGZvcm1hdChyLCBnLCBiKSB7XG4gICAgcmV0dXJuIFwiI1wiXG4gICAgICAgICsgKGlzTmFOKHIpID8gXCIwMFwiIDogKHIgPSBNYXRoLnJvdW5kKHIpKSA8IDE2ID8gXCIwXCIgKyBNYXRoLm1heCgwLCByKS50b1N0cmluZygxNikgOiBNYXRoLm1pbigyNTUsIHIpLnRvU3RyaW5nKDE2KSlcbiAgICAgICAgKyAoaXNOYU4oZykgPyBcIjAwXCIgOiAoZyA9IE1hdGgucm91bmQoZykpIDwgMTYgPyBcIjBcIiArIE1hdGgubWF4KDAsIGcpLnRvU3RyaW5nKDE2KSA6IE1hdGgubWluKDI1NSwgZykudG9TdHJpbmcoMTYpKVxuICAgICAgICArIChpc05hTihiKSA/IFwiMDBcIiA6IChiID0gTWF0aC5yb3VuZChiKSkgPCAxNiA/IFwiMFwiICsgTWF0aC5tYXgoMCwgYikudG9TdHJpbmcoMTYpIDogTWF0aC5taW4oMjU1LCBiKS50b1N0cmluZygxNikpO1xuICB9XG5cbiAgZnVuY3Rpb24gaHNsKGgsIHMsIGwpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKGggaW5zdGFuY2VvZiBIc2wpIHtcbiAgICAgICAgbCA9IGgubDtcbiAgICAgICAgcyA9IGgucztcbiAgICAgICAgaCA9IGguaDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghKGggaW5zdGFuY2VvZiBDb2xvcikpIGggPSBjb2xvcihoKTtcbiAgICAgICAgaWYgKGgpIHtcbiAgICAgICAgICBpZiAoaCBpbnN0YW5jZW9mIEhzbCkgcmV0dXJuIGg7XG4gICAgICAgICAgaCA9IGgucmdiKCk7XG4gICAgICAgICAgdmFyIHIgPSBoLnIgLyAyNTUsXG4gICAgICAgICAgICAgIGcgPSBoLmcgLyAyNTUsXG4gICAgICAgICAgICAgIGIgPSBoLmIgLyAyNTUsXG4gICAgICAgICAgICAgIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpLFxuICAgICAgICAgICAgICBtYXggPSBNYXRoLm1heChyLCBnLCBiKSxcbiAgICAgICAgICAgICAgcmFuZ2UgPSBtYXggLSBtaW47XG4gICAgICAgICAgbCA9IChtYXggKyBtaW4pIC8gMjtcbiAgICAgICAgICBpZiAocmFuZ2UpIHtcbiAgICAgICAgICAgIHMgPSBsIDwgLjUgPyByYW5nZSAvIChtYXggKyBtaW4pIDogcmFuZ2UgLyAoMiAtIG1heCAtIG1pbik7XG4gICAgICAgICAgICBpZiAociA9PT0gbWF4KSBoID0gKGcgLSBiKSAvIHJhbmdlICsgKGcgPCBiKSAqIDY7XG4gICAgICAgICAgICBlbHNlIGlmIChnID09PSBtYXgpIGggPSAoYiAtIHIpIC8gcmFuZ2UgKyAyO1xuICAgICAgICAgICAgZWxzZSBoID0gKHIgLSBnKSAvIHJhbmdlICsgNDtcbiAgICAgICAgICAgIGggKj0gNjA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGggPSBOYU47XG4gICAgICAgICAgICBzID0gbCA+IDAgJiYgbCA8IDEgPyAwIDogaDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaCA9IHMgPSBsID0gTmFOO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgSHNsKGgsIHMsIGwpO1xuICB9XG5cbiAgZnVuY3Rpb24gSHNsKGgsIHMsIGwpIHtcbiAgICB0aGlzLmggPSAraDtcbiAgICB0aGlzLnMgPSArcztcbiAgICB0aGlzLmwgPSArbDtcbiAgfVxuXG4gIHZhciBfX3Byb3RvdHlwZSA9IGhzbC5wcm90b3R5cGUgPSBIc2wucHJvdG90eXBlID0gbmV3IENvbG9yO1xuXG4gIF9fcHJvdG90eXBlLmJyaWdodGVyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogayk7XG4gIH07XG5cbiAgX19wcm90b3R5cGUuZGFya2VyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgSHNsKHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrKTtcbiAgfTtcblxuICBfX3Byb3RvdHlwZS5yZ2IgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaCA9IHRoaXMuaCAlIDM2MCArICh0aGlzLmggPCAwKSAqIDM2MCxcbiAgICAgICAgcyA9IGlzTmFOKGgpIHx8IGlzTmFOKHRoaXMucykgPyAwIDogdGhpcy5zLFxuICAgICAgICBsID0gdGhpcy5sLFxuICAgICAgICBtMiA9IGwgKyAobCA8IC41ID8gbCA6IDEgLSBsKSAqIHMsXG4gICAgICAgIG0xID0gMiAqIGwgLSBtMjtcbiAgICByZXR1cm4gbmV3IFJnYihcbiAgICAgIGhzbDJyZ2IoaCA+PSAyNDAgPyBoIC0gMjQwIDogaCArIDEyMCwgbTEsIG0yKSxcbiAgICAgIGhzbDJyZ2IoaCwgbTEsIG0yKSxcbiAgICAgIGhzbDJyZ2IoaCA8IDEyMCA/IGggKyAyNDAgOiBoIC0gMTIwLCBtMSwgbTIpXG4gICAgKTtcbiAgfTtcblxuICBfX3Byb3RvdHlwZS5kaXNwbGF5YWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoMCA8PSB0aGlzLnMgJiYgdGhpcy5zIDw9IDEgfHwgaXNOYU4odGhpcy5zKSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5sICYmIHRoaXMubCA8PSAxKTtcbiAgfTtcblxuICAvKiBGcm9tIEZ2RCAxMy4zNywgQ1NTIENvbG9yIE1vZHVsZSBMZXZlbCAzICovXG4gIGZ1bmN0aW9uIGhzbDJyZ2IoaCwgbTEsIG0yKSB7XG4gICAgcmV0dXJuIChoIDwgNjAgPyBtMSArIChtMiAtIG0xKSAqIGggLyA2MFxuICAgICAgICA6IGggPCAxODAgPyBtMlxuICAgICAgICA6IGggPCAyNDAgPyBtMSArIChtMiAtIG0xKSAqICgyNDAgLSBoKSAvIDYwXG4gICAgICAgIDogbTEpICogMjU1O1xuICB9XG5cbiAgdmFyIEtuID0gMTg7XG5cbiAgdmFyIFhuID0gMC45NTA0NzA7XG4gIHZhciBZbiA9IDE7XG4gIHZhciBabiA9IDEuMDg4ODMwO1xuICB2YXIgdDAgPSA0IC8gMjk7XG4gIHZhciB0MSA9IDYgLyAyOTtcbiAgdmFyIHQyID0gMyAqIHQxICogdDE7XG4gIHZhciB0MyA9IHQxICogdDEgKiB0MTtcblxuICBmdW5jdGlvbiBsYWIobCwgYSwgYikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAobCBpbnN0YW5jZW9mIExhYikge1xuICAgICAgICBiID0gbC5iO1xuICAgICAgICBhID0gbC5hO1xuICAgICAgICBsID0gbC5sO1xuICAgICAgfSBlbHNlIGlmIChsIGluc3RhbmNlb2YgSGNsKSB7XG4gICAgICAgIHZhciBoID0gbC5oICogZGVnMnJhZDtcbiAgICAgICAgYiA9IE1hdGguc2luKGgpICogbC5jO1xuICAgICAgICBhID0gTWF0aC5jb3MoaCkgKiBsLmM7XG4gICAgICAgIGwgPSBsLmw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIShsIGluc3RhbmNlb2YgUmdiKSkgbCA9IHJnYihsKTtcbiAgICAgICAgdmFyIHIgPSByZ2IyeHl6KGwuciksXG4gICAgICAgICAgICBnID0gcmdiMnh5eihsLmcpLFxuICAgICAgICAgICAgYiA9IHJnYjJ4eXoobC5iKSxcbiAgICAgICAgICAgIHggPSB4eXoybGFiKCgwLjQxMjQ1NjQgKiByICsgMC4zNTc1NzYxICogZyArIDAuMTgwNDM3NSAqIGIpIC8gWG4pLFxuICAgICAgICAgICAgeSA9IHh5ejJsYWIoKDAuMjEyNjcyOSAqIHIgKyAwLjcxNTE1MjIgKiBnICsgMC4wNzIxNzUwICogYikgLyBZbiksXG4gICAgICAgICAgICB6ID0geHl6MmxhYigoMC4wMTkzMzM5ICogciArIDAuMTE5MTkyMCAqIGcgKyAwLjk1MDMwNDEgKiBiKSAvIFpuKTtcbiAgICAgICAgYiA9IDIwMCAqICh5IC0geik7XG4gICAgICAgIGEgPSA1MDAgKiAoeCAtIHkpO1xuICAgICAgICBsID0gMTE2ICogeSAtIDE2O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IExhYihsLCBhLCBiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIExhYihsLCBhLCBiKSB7XG4gICAgdGhpcy5sID0gK2w7XG4gICAgdGhpcy5hID0gK2E7XG4gICAgdGhpcy5iID0gK2I7XG4gIH1cblxuICB2YXIgX19fcHJvdG90eXBlID0gbGFiLnByb3RvdHlwZSA9IExhYi5wcm90b3R5cGUgPSBuZXcgQ29sb3I7XG5cbiAgX19fcHJvdG90eXBlLmJyaWdodGVyID0gZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgTGFiKHRoaXMubCArIEtuICogKGsgPT0gbnVsbCA/IDEgOiBrKSwgdGhpcy5hLCB0aGlzLmIpO1xuICB9O1xuXG4gIF9fX3Byb3RvdHlwZS5kYXJrZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIG5ldyBMYWIodGhpcy5sIC0gS24gKiAoayA9PSBudWxsID8gMSA6IGspLCB0aGlzLmEsIHRoaXMuYik7XG4gIH07XG5cbiAgX19fcHJvdG90eXBlLnJnYiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB5ID0gKHRoaXMubCArIDE2KSAvIDExNixcbiAgICAgICAgeCA9IGlzTmFOKHRoaXMuYSkgPyB5IDogeSArIHRoaXMuYSAvIDUwMCxcbiAgICAgICAgeiA9IGlzTmFOKHRoaXMuYikgPyB5IDogeSAtIHRoaXMuYiAvIDIwMDtcbiAgICB5ID0gWW4gKiBsYWIyeHl6KHkpO1xuICAgIHggPSBYbiAqIGxhYjJ4eXooeCk7XG4gICAgeiA9IFpuICogbGFiMnh5eih6KTtcbiAgICByZXR1cm4gbmV3IFJnYihcbiAgICAgIHh5ejJyZ2IoIDMuMjQwNDU0MiAqIHggLSAxLjUzNzEzODUgKiB5IC0gMC40OTg1MzE0ICogeiksIC8vIEQ2NSAtPiBzUkdCXG4gICAgICB4eXoycmdiKC0wLjk2OTI2NjAgKiB4ICsgMS44NzYwMTA4ICogeSArIDAuMDQxNTU2MCAqIHopLFxuICAgICAgeHl6MnJnYiggMC4wNTU2NDM0ICogeCAtIDAuMjA0MDI1OSAqIHkgKyAxLjA1NzIyNTIgKiB6KVxuICAgICk7XG4gIH07XG5cbiAgZnVuY3Rpb24geHl6MmxhYih0KSB7XG4gICAgcmV0dXJuIHQgPiB0MyA/IE1hdGgucG93KHQsIDEgLyAzKSA6IHQgLyB0MiArIHQwO1xuICB9XG5cbiAgZnVuY3Rpb24gbGFiMnh5eih0KSB7XG4gICAgcmV0dXJuIHQgPiB0MSA/IHQgKiB0ICogdCA6IHQyICogKHQgLSB0MCk7XG4gIH1cblxuICBmdW5jdGlvbiB4eXoycmdiKHgpIHtcbiAgICByZXR1cm4gMjU1ICogKHggPD0gMC4wMDMxMzA4ID8gMTIuOTIgKiB4IDogMS4wNTUgKiBNYXRoLnBvdyh4LCAxIC8gMi40KSAtIDAuMDU1KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJnYjJ4eXooeCkge1xuICAgIHJldHVybiAoeCAvPSAyNTUpIDw9IDAuMDQwNDUgPyB4IC8gMTIuOTIgOiBNYXRoLnBvdygoeCArIDAuMDU1KSAvIDEuMDU1LCAyLjQpO1xuICB9XG5cbiAgdmFyIGRlZzJyYWQgPSBNYXRoLlBJIC8gMTgwO1xuICB2YXIgcmFkMmRlZyA9IDE4MCAvIE1hdGguUEk7XG5cbiAgZnVuY3Rpb24gaGNsKGgsIGMsIGwpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKGggaW5zdGFuY2VvZiBIY2wpIHtcbiAgICAgICAgbCA9IGgubDtcbiAgICAgICAgYyA9IGguYztcbiAgICAgICAgaCA9IGguaDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghKGggaW5zdGFuY2VvZiBMYWIpKSBoID0gbGFiKGgpO1xuICAgICAgICBsID0gaC5sO1xuICAgICAgICBjID0gTWF0aC5zcXJ0KGguYSAqIGguYSArIGguYiAqIGguYik7XG4gICAgICAgIGggPSBNYXRoLmF0YW4yKGguYiwgaC5hKSAqIHJhZDJkZWc7XG4gICAgICAgIGlmIChoIDwgMCkgaCArPSAzNjA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgSGNsKGgsIGMsIGwpO1xuICB9XG5cbiAgZnVuY3Rpb24gSGNsKGgsIGMsIGwpIHtcbiAgICB0aGlzLmggPSAraDtcbiAgICB0aGlzLmMgPSArYztcbiAgICB0aGlzLmwgPSArbDtcbiAgfVxuXG4gIHZhciBfX19fcHJvdG90eXBlID0gaGNsLnByb3RvdHlwZSA9IEhjbC5wcm90b3R5cGUgPSBuZXcgQ29sb3I7XG5cbiAgX19fX3Byb3RvdHlwZS5icmlnaHRlciA9IGZ1bmN0aW9uKGspIHtcbiAgICByZXR1cm4gbmV3IEhjbCh0aGlzLmgsIHRoaXMuYywgdGhpcy5sICsgS24gKiAoayA9PSBudWxsID8gMSA6IGspKTtcbiAgfTtcblxuICBfX19fcHJvdG90eXBlLmRhcmtlciA9IGZ1bmN0aW9uKGspIHtcbiAgICByZXR1cm4gbmV3IEhjbCh0aGlzLmgsIHRoaXMuYywgdGhpcy5sIC0gS24gKiAoayA9PSBudWxsID8gMSA6IGspKTtcbiAgfTtcblxuICBfX19fcHJvdG90eXBlLnJnYiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBsYWIodGhpcykucmdiKCk7XG4gIH07XG5cbiAgdmFyIEEgPSAtMC4xNDg2MTtcbiAgdmFyIEIgPSArMS43ODI3NztcbiAgdmFyIEMgPSAtMC4yOTIyNztcbiAgdmFyIEQgPSAtMC45MDY0OTtcbiAgdmFyIEUgPSArMS45NzI5NDtcbiAgdmFyIEVEID0gRSAqIEQ7XG4gIHZhciBFQiA9IEUgKiBCO1xuICB2YXIgQkNfREEgPSBCICogQyAtIEQgKiBBO1xuXG4gIGZ1bmN0aW9uIGN1YmVoZWxpeChoLCBzLCBsKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmIChoIGluc3RhbmNlb2YgQ3ViZWhlbGl4KSB7XG4gICAgICAgIGwgPSBoLmw7XG4gICAgICAgIHMgPSBoLnM7XG4gICAgICAgIGggPSBoLmg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIShoIGluc3RhbmNlb2YgUmdiKSkgaCA9IHJnYihoKTtcbiAgICAgICAgdmFyIHIgPSBoLnIgLyAyNTUsIGcgPSBoLmcgLyAyNTUsIGIgPSBoLmIgLyAyNTU7XG4gICAgICAgIGwgPSAoQkNfREEgKiBiICsgRUQgKiByIC0gRUIgKiBnKSAvIChCQ19EQSArIEVEIC0gRUIpO1xuICAgICAgICB2YXIgYmwgPSBiIC0gbCwgayA9IChFICogKGcgLSBsKSAtIEMgKiBibCkgLyBEO1xuICAgICAgICBzID0gTWF0aC5zcXJ0KGsgKiBrICsgYmwgKiBibCkgLyAoRSAqIGwgKiAoMSAtIGwpKTsgLy8gTmFOIGlmIGw9MCBvciBsPTFcbiAgICAgICAgaCA9IHMgPyBNYXRoLmF0YW4yKGssIGJsKSAqIHJhZDJkZWcgLSAxMjAgOiBOYU47XG4gICAgICAgIGlmIChoIDwgMCkgaCArPSAzNjA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ3ViZWhlbGl4KGgsIHMsIGwpO1xuICB9XG5cbiAgZnVuY3Rpb24gQ3ViZWhlbGl4KGgsIHMsIGwpIHtcbiAgICB0aGlzLmggPSAraDtcbiAgICB0aGlzLnMgPSArcztcbiAgICB0aGlzLmwgPSArbDtcbiAgfVxuXG4gIHZhciBwcm90b3R5cGUgPSBjdWJlaGVsaXgucHJvdG90eXBlID0gQ3ViZWhlbGl4LnByb3RvdHlwZSA9IG5ldyBDb2xvcjtcblxuICBwcm90b3R5cGUuYnJpZ2h0ZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgQ3ViZWhlbGl4KHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrKTtcbiAgfTtcblxuICBwcm90b3R5cGUuZGFya2VyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgQ3ViZWhlbGl4KHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrKTtcbiAgfTtcblxuICBwcm90b3R5cGUucmdiID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGggPSBpc05hTih0aGlzLmgpID8gMCA6ICh0aGlzLmggKyAxMjApICogZGVnMnJhZCxcbiAgICAgICAgbCA9ICt0aGlzLmwsXG4gICAgICAgIGEgPSBpc05hTih0aGlzLnMpID8gMCA6IHRoaXMucyAqIGwgKiAoMSAtIGwpLFxuICAgICAgICBjb3NoID0gTWF0aC5jb3MoaCksXG4gICAgICAgIHNpbmggPSBNYXRoLnNpbihoKTtcbiAgICByZXR1cm4gbmV3IFJnYihcbiAgICAgIDI1NSAqIChsICsgYSAqIChBICogY29zaCArIEIgKiBzaW5oKSksXG4gICAgICAyNTUgKiAobCArIGEgKiAoQyAqIGNvc2ggKyBEICogc2luaCkpLFxuICAgICAgMjU1ICogKGwgKyBhICogKEUgKiBjb3NoKSlcbiAgICApO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlQ3ViZWhlbGl4R2FtbWEoZ2FtbWEpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYSwgYikge1xuICAgICAgYSA9IGN1YmVoZWxpeChhKTtcbiAgICAgIGIgPSBjdWJlaGVsaXgoYik7XG4gICAgICB2YXIgYWggPSBpc05hTihhLmgpID8gYi5oIDogYS5oLFxuICAgICAgICAgIGFzID0gaXNOYU4oYS5zKSA/IGIucyA6IGEucyxcbiAgICAgICAgICBhbCA9IGEubCxcbiAgICAgICAgICBiaCA9IGlzTmFOKGIuaCkgPyAwIDogZGVsdGFIdWUoYi5oLCBhaCksXG4gICAgICAgICAgYnMgPSBpc05hTihiLnMpID8gMCA6IGIucyAtIGFzLFxuICAgICAgICAgIGJsID0gYi5sIC0gYWw7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgICBhLmggPSBhaCArIGJoICogdDtcbiAgICAgICAgYS5zID0gYXMgKyBicyAqIHQ7XG4gICAgICAgIGEubCA9IGFsICsgYmwgKiBNYXRoLnBvdyh0LCBnYW1tYSk7XG4gICAgICAgIHJldHVybiBhICsgXCJcIjtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlQ3ViZWhlbGl4R2FtbWFMb25nKGdhbW1hKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIGEgPSBjdWJlaGVsaXgoYSk7XG4gICAgICBiID0gY3ViZWhlbGl4KGIpO1xuICAgICAgdmFyIGFoID0gaXNOYU4oYS5oKSA/IGIuaCA6IGEuaCxcbiAgICAgICAgICBhcyA9IGlzTmFOKGEucykgPyBiLnMgOiBhLnMsXG4gICAgICAgICAgYWwgPSBhLmwsXG4gICAgICAgICAgYmggPSBpc05hTihiLmgpID8gMCA6IGIuaCAtIGFoLFxuICAgICAgICAgIGJzID0gaXNOYU4oYi5zKSA/IDAgOiBiLnMgLSBhcyxcbiAgICAgICAgICBibCA9IGIubCAtIGFsO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgYS5oID0gYWggKyBiaCAqIHQ7XG4gICAgICAgIGEucyA9IGFzICsgYnMgKiB0O1xuICAgICAgICBhLmwgPSBhbCArIGJsICogTWF0aC5wb3codCwgZ2FtbWEpO1xuICAgICAgICByZXR1cm4gYSArIFwiXCI7XG4gICAgICB9O1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZUhjbExvbmcoYSwgYikge1xuICAgIGEgPSBoY2woYSk7XG4gICAgYiA9IGhjbChiKTtcbiAgICB2YXIgYWggPSBpc05hTihhLmgpID8gYi5oIDogYS5oLFxuICAgICAgICBhYyA9IGlzTmFOKGEuYykgPyBiLmMgOiBhLmMsXG4gICAgICAgIGFsID0gYS5sLFxuICAgICAgICBiaCA9IGlzTmFOKGIuaCkgPyAwIDogYi5oIC0gYWgsXG4gICAgICAgIGJjID0gaXNOYU4oYi5jKSA/IDAgOiBiLmMgLSBhYyxcbiAgICAgICAgYmwgPSBiLmwgLSBhbDtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgYS5oID0gYWggKyBiaCAqIHQ7XG4gICAgICBhLmMgPSBhYyArIGJjICogdDtcbiAgICAgIGEubCA9IGFsICsgYmwgKiB0O1xuICAgICAgcmV0dXJuIGEgKyBcIlwiO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZUhjbChhLCBiKSB7XG4gICAgYSA9IGhjbChhKTtcbiAgICBiID0gaGNsKGIpO1xuICAgIHZhciBhaCA9IGlzTmFOKGEuaCkgPyBiLmggOiBhLmgsXG4gICAgICAgIGFjID0gaXNOYU4oYS5jKSA/IGIuYyA6IGEuYyxcbiAgICAgICAgYWwgPSBhLmwsXG4gICAgICAgIGJoID0gaXNOYU4oYi5oKSA/IDAgOiBkZWx0YUh1ZShiLmgsIGFoKSxcbiAgICAgICAgYmMgPSBpc05hTihiLmMpID8gMCA6IGIuYyAtIGFjLFxuICAgICAgICBibCA9IGIubCAtIGFsO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBhLmggPSBhaCArIGJoICogdDtcbiAgICAgIGEuYyA9IGFjICsgYmMgKiB0O1xuICAgICAgYS5sID0gYWwgKyBibCAqIHQ7XG4gICAgICByZXR1cm4gYSArIFwiXCI7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlTGFiKGEsIGIpIHtcbiAgICBhID0gbGFiKGEpO1xuICAgIGIgPSBsYWIoYik7XG4gICAgdmFyIGFsID0gYS5sLFxuICAgICAgICBhYSA9IGEuYSxcbiAgICAgICAgYWIgPSBhLmIsXG4gICAgICAgIGJsID0gYi5sIC0gYWwsXG4gICAgICAgIGJhID0gYi5hIC0gYWEsXG4gICAgICAgIGJiID0gYi5iIC0gYWI7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGEubCA9IGFsICsgYmwgKiB0O1xuICAgICAgYS5hID0gYWEgKyBiYSAqIHQ7XG4gICAgICBhLmIgPSBhYiArIGJiICogdDtcbiAgICAgIHJldHVybiBhICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGVIc2xMb25nKGEsIGIpIHtcbiAgICBhID0gaHNsKGEpO1xuICAgIGIgPSBoc2woYik7XG4gICAgdmFyIGFoID0gaXNOYU4oYS5oKSA/IGIuaCA6IGEuaCxcbiAgICAgICAgYXMgPSBpc05hTihhLnMpID8gYi5zIDogYS5zLFxuICAgICAgICBhbCA9IGEubCxcbiAgICAgICAgYmggPSBpc05hTihiLmgpID8gMCA6IGIuaCAtIGFoLFxuICAgICAgICBicyA9IGlzTmFOKGIucykgPyAwIDogYi5zIC0gYXMsXG4gICAgICAgIGJsID0gYi5sIC0gYWw7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGEuaCA9IGFoICsgYmggKiB0O1xuICAgICAgYS5zID0gYXMgKyBicyAqIHQ7XG4gICAgICBhLmwgPSBhbCArIGJsICogdDtcbiAgICAgIHJldHVybiBhICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGVIc2woYSwgYikge1xuICAgIGEgPSBoc2woYSk7XG4gICAgYiA9IGhzbChiKTtcbiAgICB2YXIgYWggPSBpc05hTihhLmgpID8gYi5oIDogYS5oLFxuICAgICAgICBhcyA9IGlzTmFOKGEucykgPyBiLnMgOiBhLnMsXG4gICAgICAgIGFsID0gYS5sLFxuICAgICAgICBiaCA9IGlzTmFOKGIuaCkgPyAwIDogZGVsdGFIdWUoYi5oLCBhaCksXG4gICAgICAgIGJzID0gaXNOYU4oYi5zKSA/IDAgOiBiLnMgLSBhcyxcbiAgICAgICAgYmwgPSBiLmwgLSBhbDtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgYS5oID0gYWggKyBiaCAqIHQ7XG4gICAgICBhLnMgPSBhcyArIGJzICogdDtcbiAgICAgIGEubCA9IGFsICsgYmwgKiB0O1xuICAgICAgcmV0dXJuIGEgKyBcIlwiO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZVJnYihhLCBiKSB7XG4gICAgYSA9IHJnYihhKTtcbiAgICBiID0gcmdiKGIpO1xuICAgIHZhciBhciA9IGEucixcbiAgICAgICAgYWcgPSBhLmcsXG4gICAgICAgIGFiID0gYS5iLFxuICAgICAgICBiciA9IGIuciAtIGFyLFxuICAgICAgICBiZyA9IGIuZyAtIGFnLFxuICAgICAgICBiYiA9IGIuYiAtIGFiO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gZm9ybWF0KE1hdGgucm91bmQoYXIgKyBiciAqIHQpLCBNYXRoLnJvdW5kKGFnICsgYmcgKiB0KSwgTWF0aC5yb3VuZChhYiArIGJiICogdCkpO1xuICAgIH07XG4gIH1cblxuICBleHBvcnRzLmludGVycG9sYXRlQ3ViZWhlbGl4ID0gaW50ZXJwb2xhdGVDdWJlaGVsaXhHYW1tYSgxKTtcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUN1YmVoZWxpeExvbmcgPSBpbnRlcnBvbGF0ZUN1YmVoZWxpeEdhbW1hTG9uZygxKTtcblxuICBleHBvcnRzLmNvbG9yID0gY29sb3I7XG4gIGV4cG9ydHMucmdiID0gcmdiO1xuICBleHBvcnRzLmhzbCA9IGhzbDtcbiAgZXhwb3J0cy5sYWIgPSBsYWI7XG4gIGV4cG9ydHMuaGNsID0gaGNsO1xuICBleHBvcnRzLmN1YmVoZWxpeCA9IGN1YmVoZWxpeDtcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZVJnYiA9IGludGVycG9sYXRlUmdiO1xuICBleHBvcnRzLmludGVycG9sYXRlSHNsID0gaW50ZXJwb2xhdGVIc2w7XG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVIc2xMb25nID0gaW50ZXJwb2xhdGVIc2xMb25nO1xuICBleHBvcnRzLmludGVycG9sYXRlTGFiID0gaW50ZXJwb2xhdGVMYWI7XG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVIY2wgPSBpbnRlcnBvbGF0ZUhjbDtcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUhjbExvbmcgPSBpbnRlcnBvbGF0ZUhjbExvbmc7XG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVDdWJlaGVsaXhHYW1tYSA9IGludGVycG9sYXRlQ3ViZWhlbGl4R2FtbWE7XG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVDdWJlaGVsaXhHYW1tYUxvbmcgPSBpbnRlcnBvbGF0ZUN1YmVoZWxpeEdhbW1hTG9uZztcblxufSkpOyIsImlmICh0eXBlb2YgTWFwID09PSBcInVuZGVmaW5lZFwiKSB7XG4gIE1hcCA9IGZ1bmN0aW9uKCkgeyB0aGlzLmNsZWFyKCk7IH07XG4gIE1hcC5wcm90b3R5cGUgPSB7XG4gICAgc2V0OiBmdW5jdGlvbihrLCB2KSB7IHRoaXMuX1trXSA9IHY7IHJldHVybiB0aGlzOyB9LFxuICAgIGdldDogZnVuY3Rpb24oaykgeyByZXR1cm4gdGhpcy5fW2tdOyB9LFxuICAgIGhhczogZnVuY3Rpb24oaykgeyByZXR1cm4gayBpbiB0aGlzLl87IH0sXG4gICAgZGVsZXRlOiBmdW5jdGlvbihrKSB7IHJldHVybiBrIGluIHRoaXMuXyAmJiBkZWxldGUgdGhpcy5fW2tdOyB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHsgdGhpcy5fID0gT2JqZWN0LmNyZWF0ZShudWxsKTsgfSxcbiAgICBnZXQgc2l6ZSgpIHsgdmFyIG4gPSAwOyBmb3IgKHZhciBrIGluIHRoaXMuXykgKytuOyByZXR1cm4gbjsgfSxcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihjKSB7IGZvciAodmFyIGsgaW4gdGhpcy5fKSBjKHRoaXMuX1trXSwgaywgdGhpcyk7IH1cbiAgfTtcbn0gZWxzZSAoZnVuY3Rpb24oKSB7XG4gIHZhciBtID0gbmV3IE1hcDtcbiAgaWYgKG0uc2V0KDAsIDApICE9PSBtKSB7XG4gICAgbSA9IG0uc2V0O1xuICAgIE1hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oKSB7IG0uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgcmV0dXJuIHRoaXM7IH07XG4gIH1cbn0pKCk7XG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgZmFjdG9yeSgoZ2xvYmFsLmZvcm1hdCA9IHt9KSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICB2YXIgemhDbiA9IHtcbiAgICBkZWNpbWFsOiBcIi5cIixcbiAgICB0aG91c2FuZHM6IFwiLFwiLFxuICAgIGdyb3VwaW5nOiBbM10sXG4gICAgY3VycmVuY3k6IFtcIsKlXCIsIFwiXCJdXG4gIH07XG5cbiAgdmFyIHJ1UnUgPSB7XG4gICAgZGVjaW1hbDogXCIsXCIsXG4gICAgdGhvdXNhbmRzOiBcIlxceGEwXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wiXCIsIFwiXFx4YTDRgNGD0LEuXCJdXG4gIH07XG5cbiAgdmFyIHB0QnIgPSB7XG4gICAgZGVjaW1hbDogXCIsXCIsXG4gICAgdGhvdXNhbmRzOiBcIi5cIixcbiAgICBncm91cGluZzogWzNdLFxuICAgIGN1cnJlbmN5OiBbXCJSJFwiLCBcIlwiXVxuICB9O1xuXG4gIHZhciBwbFBsID0ge1xuICAgIGRlY2ltYWw6IFwiLFwiLFxuICAgIHRob3VzYW5kczogXCIuXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wiXCIsIFwiesWCXCJdXG4gIH07XG5cbiAgdmFyIG5sTmwgPSB7XG4gICAgZGVjaW1hbDogXCIsXCIsXG4gICAgdGhvdXNhbmRzOiBcIi5cIixcbiAgICBncm91cGluZzogWzNdLFxuICAgIGN1cnJlbmN5OiBbXCLigqxcXHhhMFwiLCBcIlwiXVxuICB9O1xuXG4gIHZhciBta01rID0ge1xuICAgIGRlY2ltYWw6IFwiLFwiLFxuICAgIHRob3VzYW5kczogXCIuXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wiXCIsIFwiXFx4YTDQtNC10L0uXCJdXG4gIH07XG5cbiAgdmFyIGl0SXQgPSB7XG4gICAgZGVjaW1hbDogXCIsXCIsXG4gICAgdGhvdXNhbmRzOiBcIi5cIixcbiAgICBncm91cGluZzogWzNdLFxuICAgIGN1cnJlbmN5OiBbXCLigqxcIiwgXCJcIl1cbiAgfTtcblxuICB2YXIgaGVJbCA9IHtcbiAgICBkZWNpbWFsOiBcIi5cIixcbiAgICB0aG91c2FuZHM6IFwiLFwiLFxuICAgIGdyb3VwaW5nOiBbM10sXG4gICAgY3VycmVuY3k6IFtcIuKCqlwiLCBcIlwiXVxuICB9O1xuXG4gIHZhciBmckZyID0ge1xuICAgIGRlY2ltYWw6IFwiLFwiLFxuICAgIHRob3VzYW5kczogXCIuXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wiXCIsIFwiXFx4YTDigqxcIl1cbiAgfTtcblxuICB2YXIgZnJDYSA9IHtcbiAgICBkZWNpbWFsOiBcIixcIixcbiAgICB0aG91c2FuZHM6IFwiXFx4YTBcIixcbiAgICBncm91cGluZzogWzNdLFxuICAgIGN1cnJlbmN5OiBbXCJcIiwgXCIkXCJdXG4gIH07XG5cbiAgdmFyIGZpRmkgPSB7XG4gICAgZGVjaW1hbDogXCIsXCIsXG4gICAgdGhvdXNhbmRzOiBcIlxceGEwXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wiXCIsIFwiXFx4YTDigqxcIl1cbiAgfTtcblxuICB2YXIgZXNFcyA9IHtcbiAgICBkZWNpbWFsOiBcIixcIixcbiAgICB0aG91c2FuZHM6IFwiLlwiLFxuICAgIGdyb3VwaW5nOiBbM10sXG4gICAgY3VycmVuY3k6IFtcIlwiLCBcIlxceGEw4oKsXCJdXG4gIH07XG5cbiAgdmFyIGVuVXMgPSB7XG4gICAgZGVjaW1hbDogXCIuXCIsXG4gICAgdGhvdXNhbmRzOiBcIixcIixcbiAgICBncm91cGluZzogWzNdLFxuICAgIGN1cnJlbmN5OiBbXCIkXCIsIFwiXCJdXG4gIH07XG5cbiAgdmFyIGVuR2IgPSB7XG4gICAgZGVjaW1hbDogXCIuXCIsXG4gICAgdGhvdXNhbmRzOiBcIixcIixcbiAgICBncm91cGluZzogWzNdLFxuICAgIGN1cnJlbmN5OiBbXCLCo1wiLCBcIlwiXVxuICB9O1xuXG4gIHZhciBlbkNhID0ge1xuICAgIGRlY2ltYWw6IFwiLlwiLFxuICAgIHRob3VzYW5kczogXCIsXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wiJFwiLCBcIlwiXVxuICB9O1xuXG4gIHZhciBkZURlID0ge1xuICAgIGRlY2ltYWw6IFwiLFwiLFxuICAgIHRob3VzYW5kczogXCIuXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wiXCIsIFwiXFx4YTDigqxcIl1cbiAgfTtcblxuICB2YXIgY2FFcyA9IHtcbiAgICBkZWNpbWFsOiBcIixcIixcbiAgICB0aG91c2FuZHM6IFwiLlwiLFxuICAgIGdyb3VwaW5nOiBbM10sXG4gICAgY3VycmVuY3k6IFtcIlwiLCBcIlxceGEw4oKsXCJdXG4gIH07XG5cblxuICAvLyBDb21wdXRlcyB0aGUgZGVjaW1hbCBjb2VmZmljaWVudCBhbmQgZXhwb25lbnQgb2YgdGhlIHNwZWNpZmllZCBudW1iZXIgeCB3aXRoXG4gIC8vIHNpZ25pZmljYW50IGRpZ2l0cyBwLCB3aGVyZSB4IGlzIHBvc2l0aXZlIGFuZCBwIGlzIGluIFsxLCAyMV0gb3IgdW5kZWZpbmVkLlxuICAvLyBGb3IgZXhhbXBsZSwgZm9ybWF0RGVjaW1hbCgxLjIzKSByZXR1cm5zIFtcIjEyM1wiLCAwXS5cbiAgZnVuY3Rpb24gZm9ybWF0RGVjaW1hbCh4LCBwKSB7XG4gICAgaWYgKChpID0gKHggPSBwID8geC50b0V4cG9uZW50aWFsKHAgLSAxKSA6IHgudG9FeHBvbmVudGlhbCgpKS5pbmRleE9mKFwiZVwiKSkgPCAwKSByZXR1cm4gbnVsbDsgLy8gTmFOLCDCsUluZmluaXR5XG4gICAgdmFyIGksIGNvZWZmaWNpZW50ID0geC5zbGljZSgwLCBpKTtcblxuICAgIC8vIFRoZSBzdHJpbmcgcmV0dXJuZWQgYnkgdG9FeHBvbmVudGlhbCBlaXRoZXIgaGFzIHRoZSBmb3JtIFxcZFxcLlxcZCtlWy0rXVxcZCtcbiAgICAvLyAoZS5nLiwgMS4yZSszKSBvciB0aGUgZm9ybSBcXGRlWy0rXVxcZCsgKGUuZy4sIDFlKzMpLlxuICAgIHJldHVybiBbXG4gICAgICBjb2VmZmljaWVudC5sZW5ndGggPiAxID8gY29lZmZpY2llbnRbMF0gKyBjb2VmZmljaWVudC5zbGljZSgyKSA6IGNvZWZmaWNpZW50LFxuICAgICAgK3guc2xpY2UoaSArIDEpXG4gICAgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGV4cG9uZW50KHgpIHtcbiAgICByZXR1cm4geCA9IGZvcm1hdERlY2ltYWwoTWF0aC5hYnMoeCkpLCB4ID8geFsxXSA6IE5hTjtcbiAgfVxuXG4gIHZhciBwcmVmaXhFeHBvbmVudDtcblxuICBmdW5jdGlvbiBmb3JtYXRQcmVmaXhBdXRvKHgsIHApIHtcbiAgICB2YXIgZCA9IGZvcm1hdERlY2ltYWwoeCwgcCk7XG4gICAgaWYgKCFkKSByZXR1cm4geCArIFwiXCI7XG4gICAgdmFyIGNvZWZmaWNpZW50ID0gZFswXSxcbiAgICAgICAgZXhwb25lbnQgPSBkWzFdLFxuICAgICAgICBpID0gZXhwb25lbnQgLSAocHJlZml4RXhwb25lbnQgPSBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCAvIDMpKSkgKiAzKSArIDEsXG4gICAgICAgIG4gPSBjb2VmZmljaWVudC5sZW5ndGg7XG4gICAgcmV0dXJuIGkgPT09IG4gPyBjb2VmZmljaWVudFxuICAgICAgICA6IGkgPiBuID8gY29lZmZpY2llbnQgKyBuZXcgQXJyYXkoaSAtIG4gKyAxKS5qb2luKFwiMFwiKVxuICAgICAgICA6IGkgPiAwID8gY29lZmZpY2llbnQuc2xpY2UoMCwgaSkgKyBcIi5cIiArIGNvZWZmaWNpZW50LnNsaWNlKGkpXG4gICAgICAgIDogXCIwLlwiICsgbmV3IEFycmF5KDEgLSBpKS5qb2luKFwiMFwiKSArIGZvcm1hdERlY2ltYWwoeCwgcCArIGkgLSAxKVswXTsgLy8gbGVzcyB0aGFuIDF5IVxuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0Um91bmRlZCh4LCBwKSB7XG4gICAgdmFyIGQgPSBmb3JtYXREZWNpbWFsKHgsIHApO1xuICAgIGlmICghZCkgcmV0dXJuIHggKyBcIlwiO1xuICAgIHZhciBjb2VmZmljaWVudCA9IGRbMF0sXG4gICAgICAgIGV4cG9uZW50ID0gZFsxXTtcbiAgICByZXR1cm4gZXhwb25lbnQgPCAwID8gXCIwLlwiICsgbmV3IEFycmF5KC1leHBvbmVudCkuam9pbihcIjBcIikgKyBjb2VmZmljaWVudFxuICAgICAgICA6IGNvZWZmaWNpZW50Lmxlbmd0aCA+IGV4cG9uZW50ICsgMSA/IGNvZWZmaWNpZW50LnNsaWNlKDAsIGV4cG9uZW50ICsgMSkgKyBcIi5cIiArIGNvZWZmaWNpZW50LnNsaWNlKGV4cG9uZW50ICsgMSlcbiAgICAgICAgOiBjb2VmZmljaWVudCArIG5ldyBBcnJheShleHBvbmVudCAtIGNvZWZmaWNpZW50Lmxlbmd0aCArIDIpLmpvaW4oXCIwXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0RGVmYXVsdCh4LCBwKSB7XG4gICAgeCA9IHgudG9QcmVjaXNpb24ocCk7XG5cbiAgICBvdXQ6IGZvciAodmFyIG4gPSB4Lmxlbmd0aCwgaSA9IDEsIGkwID0gLTEsIGkxOyBpIDwgbjsgKytpKSB7XG4gICAgICBzd2l0Y2ggKHhbaV0pIHtcbiAgICAgICAgY2FzZSBcIi5cIjogaTAgPSBpMSA9IGk7IGJyZWFrO1xuICAgICAgICBjYXNlIFwiMFwiOiBpZiAoaTAgPT09IDApIGkwID0gaTsgaTEgPSBpOyBicmVhaztcbiAgICAgICAgY2FzZSBcImVcIjogYnJlYWsgb3V0O1xuICAgICAgICBkZWZhdWx0OiBpZiAoaTAgPiAwKSBpMCA9IDA7IGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpMCA+IDAgPyB4LnNsaWNlKDAsIGkwKSArIHguc2xpY2UoaTEgKyAxKSA6IHg7XG4gIH1cblxuICB2YXIgZm9ybWF0VHlwZXMgPSB7XG4gICAgXCJcIjogZm9ybWF0RGVmYXVsdCxcbiAgICBcIiVcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4gKHggKiAxMDApLnRvRml4ZWQocCk7IH0sXG4gICAgXCJiXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMik7IH0sXG4gICAgXCJjXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKyBcIlwiOyB9LFxuICAgIFwiZFwiOiBmdW5jdGlvbih4KSB7IHJldHVybiBNYXRoLnJvdW5kKHgpLnRvU3RyaW5nKDEwKTsgfSxcbiAgICBcImVcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4geC50b0V4cG9uZW50aWFsKHApOyB9LFxuICAgIFwiZlwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiB4LnRvRml4ZWQocCk7IH0sXG4gICAgXCJnXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuIHgudG9QcmVjaXNpb24ocCk7IH0sXG4gICAgXCJvXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoOCk7IH0sXG4gICAgXCJwXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuIGZvcm1hdFJvdW5kZWQoeCAqIDEwMCwgcCk7IH0sXG4gICAgXCJyXCI6IGZvcm1hdFJvdW5kZWQsXG4gICAgXCJzXCI6IGZvcm1hdFByZWZpeEF1dG8sXG4gICAgXCJYXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7IH0sXG4gICAgXCJ4XCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTYpOyB9XG4gIH07XG5cblxuICAvLyBbW2ZpbGxdYWxpZ25dW3NpZ25dW3N5bWJvbF1bMF1bd2lkdGhdWyxdWy5wcmVjaXNpb25dW3R5cGVdXG4gIHZhciByZSA9IC9eKD86KC4pPyhbPD49Xl0pKT8oWytcXC1cXCggXSk/KFskI10pPygwKT8oXFxkKyk/KCwpPyhcXC5cXGQrKT8oW2EteiVdKT8kL2k7XG5cbiAgZnVuY3Rpb24gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcikge1xuICAgIHJldHVybiBuZXcgRm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcik7XG4gIH1cblxuICBmdW5jdGlvbiBGb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKSB7XG4gICAgaWYgKCEobWF0Y2ggPSByZS5leGVjKHNwZWNpZmllcikpKSB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIGZvcm1hdDogXCIgKyBzcGVjaWZpZXIpO1xuXG4gICAgdmFyIG1hdGNoLFxuICAgICAgICBmaWxsID0gbWF0Y2hbMV0gfHwgXCIgXCIsXG4gICAgICAgIGFsaWduID0gbWF0Y2hbMl0gfHwgXCI+XCIsXG4gICAgICAgIHNpZ24gPSBtYXRjaFszXSB8fCBcIi1cIixcbiAgICAgICAgc3ltYm9sID0gbWF0Y2hbNF0gfHwgXCJcIixcbiAgICAgICAgemVybyA9ICEhbWF0Y2hbNV0sXG4gICAgICAgIHdpZHRoID0gbWF0Y2hbNl0gJiYgK21hdGNoWzZdLFxuICAgICAgICBjb21tYSA9ICEhbWF0Y2hbN10sXG4gICAgICAgIHByZWNpc2lvbiA9IG1hdGNoWzhdICYmICttYXRjaFs4XS5zbGljZSgxKSxcbiAgICAgICAgdHlwZSA9IG1hdGNoWzldIHx8IFwiXCI7XG5cbiAgICAvLyBUaGUgXCJuXCIgdHlwZSBpcyBhbiBhbGlhcyBmb3IgXCIsZ1wiLlxuICAgIGlmICh0eXBlID09PSBcIm5cIikgY29tbWEgPSB0cnVlLCB0eXBlID0gXCJnXCI7XG5cbiAgICAvLyBNYXAgaW52YWxpZCB0eXBlcyB0byB0aGUgZGVmYXVsdCBmb3JtYXQuXG4gICAgZWxzZSBpZiAoIWZvcm1hdFR5cGVzW3R5cGVdKSB0eXBlID0gXCJcIjtcblxuICAgIC8vIElmIHplcm8gZmlsbCBpcyBzcGVjaWZpZWQsIHBhZGRpbmcgZ29lcyBhZnRlciBzaWduIGFuZCBiZWZvcmUgZGlnaXRzLlxuICAgIGlmICh6ZXJvIHx8IChmaWxsID09PSBcIjBcIiAmJiBhbGlnbiA9PT0gXCI9XCIpKSB6ZXJvID0gdHJ1ZSwgZmlsbCA9IFwiMFwiLCBhbGlnbiA9IFwiPVwiO1xuXG4gICAgdGhpcy5maWxsID0gZmlsbDtcbiAgICB0aGlzLmFsaWduID0gYWxpZ247XG4gICAgdGhpcy5zaWduID0gc2lnbjtcbiAgICB0aGlzLnN5bWJvbCA9IHN5bWJvbDtcbiAgICB0aGlzLnplcm8gPSB6ZXJvO1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmNvbW1hID0gY29tbWE7XG4gICAgdGhpcy5wcmVjaXNpb24gPSBwcmVjaXNpb247XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgfVxuXG4gIEZvcm1hdFNwZWNpZmllci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5maWxsXG4gICAgICAgICsgdGhpcy5hbGlnblxuICAgICAgICArIHRoaXMuc2lnblxuICAgICAgICArIHRoaXMuc3ltYm9sXG4gICAgICAgICsgKHRoaXMuemVybyA/IFwiMFwiIDogXCJcIilcbiAgICAgICAgKyAodGhpcy53aWR0aCA9PSBudWxsID8gXCJcIiA6IE1hdGgubWF4KDEsIHRoaXMud2lkdGggfCAwKSlcbiAgICAgICAgKyAodGhpcy5jb21tYSA/IFwiLFwiIDogXCJcIilcbiAgICAgICAgKyAodGhpcy5wcmVjaXNpb24gPT0gbnVsbCA/IFwiXCIgOiBcIi5cIiArIE1hdGgubWF4KDAsIHRoaXMucHJlY2lzaW9uIHwgMCkpXG4gICAgICAgICsgdGhpcy50eXBlO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGZvcm1hdEdyb3VwKGdyb3VwaW5nLCB0aG91c2FuZHMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUsIHdpZHRoKSB7XG4gICAgICB2YXIgaSA9IHZhbHVlLmxlbmd0aCxcbiAgICAgICAgICB0ID0gW10sXG4gICAgICAgICAgaiA9IDAsXG4gICAgICAgICAgZyA9IGdyb3VwaW5nWzBdLFxuICAgICAgICAgIGxlbmd0aCA9IDA7XG5cbiAgICAgIHdoaWxlIChpID4gMCAmJiBnID4gMCkge1xuICAgICAgICBpZiAobGVuZ3RoICsgZyArIDEgPiB3aWR0aCkgZyA9IE1hdGgubWF4KDEsIHdpZHRoIC0gbGVuZ3RoKTtcbiAgICAgICAgdC5wdXNoKHZhbHVlLnN1YnN0cmluZyhpIC09IGcsIGkgKyBnKSk7XG4gICAgICAgIGlmICgobGVuZ3RoICs9IGcgKyAxKSA+IHdpZHRoKSBicmVhaztcbiAgICAgICAgZyA9IGdyb3VwaW5nW2ogPSAoaiArIDEpICUgZ3JvdXBpbmcubGVuZ3RoXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHQucmV2ZXJzZSgpLmpvaW4odGhvdXNhbmRzKTtcbiAgICB9O1xuICB9XG5cbiAgdmFyIHByZWZpeGVzID0gW1wieVwiLFwielwiLFwiYVwiLFwiZlwiLFwicFwiLFwiblwiLFwiwrVcIixcIm1cIixcIlwiLFwia1wiLFwiTVwiLFwiR1wiLFwiVFwiLFwiUFwiLFwiRVwiLFwiWlwiLFwiWVwiXTtcblxuICBmdW5jdGlvbiBpZGVudGl0eSh4KSB7XG4gICAgcmV0dXJuIHg7XG4gIH1cblxuICBmdW5jdGlvbiBsb2NhbGUobG9jYWxlKSB7XG4gICAgdmFyIGdyb3VwID0gbG9jYWxlLmdyb3VwaW5nICYmIGxvY2FsZS50aG91c2FuZHMgPyBmb3JtYXRHcm91cChsb2NhbGUuZ3JvdXBpbmcsIGxvY2FsZS50aG91c2FuZHMpIDogaWRlbnRpdHksXG4gICAgICAgIGN1cnJlbmN5ID0gbG9jYWxlLmN1cnJlbmN5LFxuICAgICAgICBkZWNpbWFsID0gbG9jYWxlLmRlY2ltYWw7XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQoc3BlY2lmaWVyKSB7XG4gICAgICBzcGVjaWZpZXIgPSBmb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKTtcblxuICAgICAgdmFyIGZpbGwgPSBzcGVjaWZpZXIuZmlsbCxcbiAgICAgICAgICBhbGlnbiA9IHNwZWNpZmllci5hbGlnbixcbiAgICAgICAgICBzaWduID0gc3BlY2lmaWVyLnNpZ24sXG4gICAgICAgICAgc3ltYm9sID0gc3BlY2lmaWVyLnN5bWJvbCxcbiAgICAgICAgICB6ZXJvID0gc3BlY2lmaWVyLnplcm8sXG4gICAgICAgICAgd2lkdGggPSBzcGVjaWZpZXIud2lkdGgsXG4gICAgICAgICAgY29tbWEgPSBzcGVjaWZpZXIuY29tbWEsXG4gICAgICAgICAgcHJlY2lzaW9uID0gc3BlY2lmaWVyLnByZWNpc2lvbixcbiAgICAgICAgICB0eXBlID0gc3BlY2lmaWVyLnR5cGU7XG5cbiAgICAgIC8vIENvbXB1dGUgdGhlIHByZWZpeCBhbmQgc3VmZml4LlxuICAgICAgLy8gRm9yIFNJLXByZWZpeCwgdGhlIHN1ZmZpeCBpcyBsYXppbHkgY29tcHV0ZWQuXG4gICAgICB2YXIgcHJlZml4ID0gc3ltYm9sID09PSBcIiRcIiA/IGN1cnJlbmN5WzBdIDogc3ltYm9sID09PSBcIiNcIiAmJiAvW2JveFhdLy50ZXN0KHR5cGUpID8gXCIwXCIgKyB0eXBlLnRvTG93ZXJDYXNlKCkgOiBcIlwiLFxuICAgICAgICAgIHN1ZmZpeCA9IHN5bWJvbCA9PT0gXCIkXCIgPyBjdXJyZW5jeVsxXSA6IC9bJXBdLy50ZXN0KHR5cGUpID8gXCIlXCIgOiBcIlwiO1xuXG4gICAgICAvLyBXaGF0IGZvcm1hdCBmdW5jdGlvbiBzaG91bGQgd2UgdXNlP1xuICAgICAgLy8gSXMgdGhpcyBhbiBpbnRlZ2VyIHR5cGU/XG4gICAgICAvLyBDYW4gdGhpcyB0eXBlIGdlbmVyYXRlIGV4cG9uZW50aWFsIG5vdGF0aW9uP1xuICAgICAgdmFyIGZvcm1hdFR5cGUgPSBmb3JtYXRUeXBlc1t0eXBlXSxcbiAgICAgICAgICBtYXliZVN1ZmZpeCA9ICF0eXBlIHx8IC9bZGVmZ3BycyVdLy50ZXN0KHR5cGUpO1xuXG4gICAgICAvLyBTZXQgdGhlIGRlZmF1bHQgcHJlY2lzaW9uIGlmIG5vdCBzcGVjaWZpZWQsXG4gICAgICAvLyBvciBjbGFtcCB0aGUgc3BlY2lmaWVkIHByZWNpc2lvbiB0byB0aGUgc3VwcG9ydGVkIHJhbmdlLlxuICAgICAgLy8gRm9yIHNpZ25pZmljYW50IHByZWNpc2lvbiwgaXQgbXVzdCBiZSBpbiBbMSwgMjFdLlxuICAgICAgLy8gRm9yIGZpeGVkIHByZWNpc2lvbiwgaXQgbXVzdCBiZSBpbiBbMCwgMjBdLlxuICAgICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uID09IG51bGwgPyAodHlwZSA/IDYgOiAxMilcbiAgICAgICAgICA6IC9bZ3Byc10vLnRlc3QodHlwZSkgPyBNYXRoLm1heCgxLCBNYXRoLm1pbigyMSwgcHJlY2lzaW9uKSlcbiAgICAgICAgICA6IE1hdGgubWF4KDAsIE1hdGgubWluKDIwLCBwcmVjaXNpb24pKTtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhciB2YWx1ZVByZWZpeCA9IHByZWZpeCxcbiAgICAgICAgICAgIHZhbHVlU3VmZml4ID0gc3VmZml4O1xuXG4gICAgICAgIGlmICh0eXBlID09PSBcImNcIikge1xuICAgICAgICAgIHZhbHVlU3VmZml4ID0gZm9ybWF0VHlwZSh2YWx1ZSkgKyB2YWx1ZVN1ZmZpeDtcbiAgICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSArdmFsdWU7XG5cbiAgICAgICAgICAvLyBDb252ZXJ0IG5lZ2F0aXZlIHRvIHBvc2l0aXZlLCBhbmQgY29tcHV0ZSB0aGUgcHJlZml4LlxuICAgICAgICAgIC8vIE5vdGUgdGhhdCAtMCBpcyBub3QgbGVzcyB0aGFuIDAsIGJ1dCAxIC8gLTAgaXMhXG4gICAgICAgICAgdmFyIHZhbHVlTmVnYXRpdmUgPSAodmFsdWUgPCAwIHx8IDEgLyB2YWx1ZSA8IDApICYmICh2YWx1ZSAqPSAtMSwgdHJ1ZSk7XG5cbiAgICAgICAgICAvLyBQZXJmb3JtIHRoZSBpbml0aWFsIGZvcm1hdHRpbmcuXG4gICAgICAgICAgdmFsdWUgPSBmb3JtYXRUeXBlKHZhbHVlLCBwcmVjaXNpb24pO1xuXG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgcHJlZml4IGFuZCBzdWZmaXguXG4gICAgICAgICAgdmFsdWVQcmVmaXggPSAodmFsdWVOZWdhdGl2ZSA/IChzaWduID09PSBcIihcIiA/IHNpZ24gOiBcIi1cIikgOiBzaWduID09PSBcIi1cIiB8fCBzaWduID09PSBcIihcIiA/IFwiXCIgOiBzaWduKSArIHZhbHVlUHJlZml4O1xuICAgICAgICAgIHZhbHVlU3VmZml4ID0gdmFsdWVTdWZmaXggKyAodHlwZSA9PT0gXCJzXCIgPyBwcmVmaXhlc1s4ICsgcHJlZml4RXhwb25lbnQgLyAzXSA6IFwiXCIpICsgKHZhbHVlTmVnYXRpdmUgJiYgc2lnbiA9PT0gXCIoXCIgPyBcIilcIiA6IFwiXCIpO1xuXG4gICAgICAgICAgLy8gQnJlYWsgdGhlIGZvcm1hdHRlZCB2YWx1ZSBpbnRvIHRoZSBpbnRlZ2VyIOKAnHZhbHVl4oCdIHBhcnQgdGhhdCBjYW4gYmVcbiAgICAgICAgICAvLyBncm91cGVkLCBhbmQgZnJhY3Rpb25hbCBvciBleHBvbmVudGlhbCDigJxzdWZmaXjigJ0gcGFydCB0aGF0IGlzIG5vdC5cbiAgICAgICAgICBpZiAobWF5YmVTdWZmaXgpIHtcbiAgICAgICAgICAgIHZhciBpID0gLTEsIG4gPSB2YWx1ZS5sZW5ndGgsIGM7XG4gICAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgICBpZiAoYyA9IHZhbHVlLmNoYXJDb2RlQXQoaSksIDQ4ID4gYyB8fCBjID4gNTcpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IChjID09PSA0NiA/IGRlY2ltYWwgKyB2YWx1ZS5zbGljZShpICsgMSkgOiB2YWx1ZS5zbGljZShpKSkgKyB2YWx1ZVN1ZmZpeDtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIGkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIGZpbGwgY2hhcmFjdGVyIGlzIG5vdCBcIjBcIiwgZ3JvdXBpbmcgaXMgYXBwbGllZCBiZWZvcmUgcGFkZGluZy5cbiAgICAgICAgaWYgKGNvbW1hICYmICF6ZXJvKSB2YWx1ZSA9IGdyb3VwKHZhbHVlLCBJbmZpbml0eSk7XG5cbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUgcGFkZGluZy5cbiAgICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlUHJlZml4Lmxlbmd0aCArIHZhbHVlLmxlbmd0aCArIHZhbHVlU3VmZml4Lmxlbmd0aCxcbiAgICAgICAgICAgIHBhZGRpbmcgPSBsZW5ndGggPCB3aWR0aCA/IG5ldyBBcnJheSh3aWR0aCAtIGxlbmd0aCArIDEpLmpvaW4oZmlsbCkgOiBcIlwiO1xuXG4gICAgICAgIC8vIElmIHRoZSBmaWxsIGNoYXJhY3RlciBpcyBcIjBcIiwgZ3JvdXBpbmcgaXMgYXBwbGllZCBhZnRlciBwYWRkaW5nLlxuICAgICAgICBpZiAoY29tbWEgJiYgemVybykgdmFsdWUgPSBncm91cChwYWRkaW5nICsgdmFsdWUsIHBhZGRpbmcubGVuZ3RoID8gd2lkdGggLSB2YWx1ZVN1ZmZpeC5sZW5ndGggOiBJbmZpbml0eSksIHBhZGRpbmcgPSBcIlwiO1xuXG4gICAgICAgIC8vIFJlY29uc3RydWN0IHRoZSBmaW5hbCBvdXRwdXQgYmFzZWQgb24gdGhlIGRlc2lyZWQgYWxpZ25tZW50LlxuICAgICAgICBzd2l0Y2ggKGFsaWduKSB7XG4gICAgICAgICAgY2FzZSBcIjxcIjogcmV0dXJuIHZhbHVlUHJlZml4ICsgdmFsdWUgKyB2YWx1ZVN1ZmZpeCArIHBhZGRpbmc7XG4gICAgICAgICAgY2FzZSBcIj1cIjogcmV0dXJuIHZhbHVlUHJlZml4ICsgcGFkZGluZyArIHZhbHVlICsgdmFsdWVTdWZmaXg7XG4gICAgICAgICAgY2FzZSBcIl5cIjogcmV0dXJuIHBhZGRpbmcuc2xpY2UoMCwgbGVuZ3RoID0gcGFkZGluZy5sZW5ndGggPj4gMSkgKyB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXggKyBwYWRkaW5nLnNsaWNlKGxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZGRpbmcgKyB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXg7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFByZWZpeChzcGVjaWZpZXIsIHZhbHVlKSB7XG4gICAgICB2YXIgZiA9IGZvcm1hdCgoc3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllciksIHNwZWNpZmllci50eXBlID0gXCJmXCIsIHNwZWNpZmllcikpLFxuICAgICAgICAgIGUgPSBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCh2YWx1ZSkgLyAzKSkpICogMyxcbiAgICAgICAgICBrID0gTWF0aC5wb3coMTAsIC1lKSxcbiAgICAgICAgICBwcmVmaXggPSBwcmVmaXhlc1s4ICsgZSAvIDNdO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmKGsgKiB2YWx1ZSkgKyBwcmVmaXg7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBmb3JtYXQ6IGZvcm1hdCxcbiAgICAgIGZvcm1hdFByZWZpeDogZm9ybWF0UHJlZml4XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZWNpc2lvblJvdW5kKHN0ZXAsIG1heCkge1xuICAgIHJldHVybiBNYXRoLm1heCgwLCBleHBvbmVudChNYXRoLmFicyhtYXgpKSAtIGV4cG9uZW50KE1hdGguYWJzKHN0ZXApKSkgKyAxO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJlY2lzaW9uUHJlZml4KHN0ZXAsIHZhbHVlKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWF4KC04LCBNYXRoLm1pbig4LCBNYXRoLmZsb29yKGV4cG9uZW50KHZhbHVlKSAvIDMpKSkgKiAzIC0gZXhwb25lbnQoTWF0aC5hYnMoc3RlcCkpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZWNpc2lvbkZpeGVkKHN0ZXApIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgLWV4cG9uZW50KE1hdGguYWJzKHN0ZXApKSk7XG4gIH1cblxuICB2YXIgbG9jYWxlRGVmaW5pdGlvbnMgPSAobmV3IE1hcClcbiAgICAgIC5zZXQoXCJjYS1FU1wiLCBjYUVzKVxuICAgICAgLnNldChcImRlLURFXCIsIGRlRGUpXG4gICAgICAuc2V0KFwiZW4tQ0FcIiwgZW5DYSlcbiAgICAgIC5zZXQoXCJlbi1HQlwiLCBlbkdiKVxuICAgICAgLnNldChcImVuLVVTXCIsIGVuVXMpXG4gICAgICAuc2V0KFwiZXMtRVNcIiwgZXNFcylcbiAgICAgIC5zZXQoXCJmaS1GSVwiLCBmaUZpKVxuICAgICAgLnNldChcImZyLUNBXCIsIGZyQ2EpXG4gICAgICAuc2V0KFwiZnItRlJcIiwgZnJGcilcbiAgICAgIC5zZXQoXCJoZS1JTFwiLCBoZUlsKVxuICAgICAgLnNldChcIml0LUlUXCIsIGl0SXQpXG4gICAgICAuc2V0KFwibWstTUtcIiwgbWtNaylcbiAgICAgIC5zZXQoXCJubC1OTFwiLCBubE5sKVxuICAgICAgLnNldChcInBsLVBMXCIsIHBsUGwpXG4gICAgICAuc2V0KFwicHQtQlJcIiwgcHRCcilcbiAgICAgIC5zZXQoXCJydS1SVVwiLCBydVJ1KVxuICAgICAgLnNldChcInpoLUNOXCIsIHpoQ24pO1xuXG4gIHZhciBkZWZhdWx0TG9jYWxlID0gbG9jYWxlKGVuVXMpO1xuICBleHBvcnRzLmZvcm1hdCA9IGRlZmF1bHRMb2NhbGUuZm9ybWF0O1xuICBleHBvcnRzLmZvcm1hdFByZWZpeCA9IGRlZmF1bHRMb2NhbGUuZm9ybWF0UHJlZml4O1xuXG4gIGZ1bmN0aW9uIGxvY2FsZUZvcm1hdChkZWZpbml0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbml0aW9uID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBkZWZpbml0aW9uID0gbG9jYWxlRGVmaW5pdGlvbnMuZ2V0KGRlZmluaXRpb24pO1xuICAgICAgaWYgKCFkZWZpbml0aW9uKSByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGxvY2FsZShkZWZpbml0aW9uKTtcbiAgfVxuICA7XG5cbiAgZXhwb3J0cy5sb2NhbGVGb3JtYXQgPSBsb2NhbGVGb3JtYXQ7XG4gIGV4cG9ydHMuZm9ybWF0U3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyO1xuICBleHBvcnRzLnByZWNpc2lvbkZpeGVkID0gcHJlY2lzaW9uRml4ZWQ7XG4gIGV4cG9ydHMucHJlY2lzaW9uUHJlZml4ID0gcHJlY2lzaW9uUHJlZml4O1xuICBleHBvcnRzLnByZWNpc2lvblJvdW5kID0gcHJlY2lzaW9uUm91bmQ7XG5cbn0pKTsiLCJpZiAodHlwZW9mIE1hcCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICBNYXAgPSBmdW5jdGlvbigpIHsgdGhpcy5jbGVhcigpOyB9O1xuICBNYXAucHJvdG90eXBlID0ge1xuICAgIHNldDogZnVuY3Rpb24oaywgdikgeyB0aGlzLl9ba10gPSB2OyByZXR1cm4gdGhpczsgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIHRoaXMuX1trXTsgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIGsgaW4gdGhpcy5fOyB9LFxuICAgIGRlbGV0ZTogZnVuY3Rpb24oaykgeyByZXR1cm4gayBpbiB0aGlzLl8gJiYgZGVsZXRlIHRoaXMuX1trXTsgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7IHRoaXMuXyA9IE9iamVjdC5jcmVhdGUobnVsbCk7IH0sXG4gICAgZ2V0IHNpemUoKSB7IHZhciBuID0gMDsgZm9yICh2YXIgayBpbiB0aGlzLl8pICsrbjsgcmV0dXJuIG47IH0sXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oYykgeyBmb3IgKHZhciBrIGluIHRoaXMuXykgYyh0aGlzLl9ba10sIGssIHRoaXMpOyB9XG4gIH07XG59IGVsc2UgKGZ1bmN0aW9uKCkge1xuICB2YXIgbSA9IG5ldyBNYXA7XG4gIGlmIChtLnNldCgwLCAwKSAhPT0gbSkge1xuICAgIG0gPSBtLnNldDtcbiAgICBNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKCkgeyBtLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IHJldHVybiB0aGlzOyB9O1xuICB9XG59KSgpO1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gIGZhY3RvcnkoKGdsb2JhbC50aW1lRm9ybWF0ID0ge30pKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciB6aENuID0ge1xuICAgIGRhdGVUaW1lOiBcIiVhICViICVlICVYICVZXCIsXG4gICAgZGF0ZTogXCIlWS8lLW0vJS1kXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIuS4iuWNiFwiLCBcIuS4i+WNiFwiXSxcbiAgICBkYXlzOiBbXCLmmJ/mnJ/ml6VcIiwgXCLmmJ/mnJ/kuIBcIiwgXCLmmJ/mnJ/kuoxcIiwgXCLmmJ/mnJ/kuIlcIiwgXCLmmJ/mnJ/lm5tcIiwgXCLmmJ/mnJ/kupRcIiwgXCLmmJ/mnJ/lha1cIl0sXG4gICAgc2hvcnREYXlzOiBbXCLmmJ/mnJ/ml6VcIiwgXCLmmJ/mnJ/kuIBcIiwgXCLmmJ/mnJ/kuoxcIiwgXCLmmJ/mnJ/kuIlcIiwgXCLmmJ/mnJ/lm5tcIiwgXCLmmJ/mnJ/kupRcIiwgXCLmmJ/mnJ/lha1cIl0sXG4gICAgbW9udGhzOiBbXCLkuIDmnIhcIiwgXCLkuozmnIhcIiwgXCLkuInmnIhcIiwgXCLlm5vmnIhcIiwgXCLkupTmnIhcIiwgXCLlha3mnIhcIiwgXCLkuIPmnIhcIiwgXCLlhavmnIhcIiwgXCLkuZ3mnIhcIiwgXCLljYHmnIhcIiwgXCLljYHkuIDmnIhcIiwgXCLljYHkuozmnIhcIl0sXG4gICAgc2hvcnRNb250aHM6IFtcIuS4gOaciFwiLCBcIuS6jOaciFwiLCBcIuS4ieaciFwiLCBcIuWbm+aciFwiLCBcIuS6lOaciFwiLCBcIuWFreaciFwiLCBcIuS4g+aciFwiLCBcIuWFq+aciFwiLCBcIuS5neaciFwiLCBcIuWNgeaciFwiLCBcIuWNgeS4gOaciFwiLCBcIuWNgeS6jOaciFwiXVxuICB9O1xuXG4gIHZhciBydVJ1ID0ge1xuICAgIGRhdGVUaW1lOiBcIiVBLCAlZSAlQiAlWSDQsy4gJVhcIixcbiAgICBkYXRlOiBcIiVkLiVtLiVZXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gICAgZGF5czogW1wi0LLQvtGB0LrRgNC10YHQtdC90YzQtVwiLCBcItC/0L7QvdC10LTQtdC70YzQvdC40LpcIiwgXCLQstGC0L7RgNC90LjQulwiLCBcItGB0YDQtdC00LBcIiwgXCLRh9C10YLQstC10YDQs1wiLCBcItC/0Y/RgtC90LjRhtCwXCIsIFwi0YHRg9Cx0LHQvtGC0LBcIl0sXG4gICAgc2hvcnREYXlzOiBbXCLQstGBXCIsIFwi0L/QvVwiLCBcItCy0YJcIiwgXCLRgdGAXCIsIFwi0YfRglwiLCBcItC/0YJcIiwgXCLRgdCxXCJdLFxuICAgIG1vbnRoczogW1wi0Y/QvdCy0LDRgNGPXCIsIFwi0YTQtdCy0YDQsNC70Y9cIiwgXCLQvNCw0YDRgtCwXCIsIFwi0LDQv9GA0LXQu9GPXCIsIFwi0LzQsNGPXCIsIFwi0LjRjtC90Y9cIiwgXCLQuNGO0LvRj1wiLCBcItCw0LLQs9GD0YHRgtCwXCIsIFwi0YHQtdC90YLRj9Cx0YDRj1wiLCBcItC+0LrRgtGP0LHRgNGPXCIsIFwi0L3QvtGP0LHRgNGPXCIsIFwi0LTQtdC60LDQsdGA0Y9cIl0sXG4gICAgc2hvcnRNb250aHM6IFtcItGP0L3QslwiLCBcItGE0LXQslwiLCBcItC80LDRgFwiLCBcItCw0L/RgFwiLCBcItC80LDQuVwiLCBcItC40Y7QvVwiLCBcItC40Y7Qu1wiLCBcItCw0LLQs1wiLCBcItGB0LXQvVwiLCBcItC+0LrRglwiLCBcItC90L7Rj1wiLCBcItC00LXQulwiXVxuICB9O1xuXG4gIHZhciBwdEJyID0ge1xuICAgIGRhdGVUaW1lOiBcIiVBLCAlZSBkZSAlQiBkZSAlWS4gJVhcIixcbiAgICBkYXRlOiBcIiVkLyVtLyVZXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gICAgZGF5czogW1wiRG9taW5nb1wiLCBcIlNlZ3VuZGFcIiwgXCJUZXLDp2FcIiwgXCJRdWFydGFcIiwgXCJRdWludGFcIiwgXCJTZXh0YVwiLCBcIlPDoWJhZG9cIl0sXG4gICAgc2hvcnREYXlzOiBbXCJEb21cIiwgXCJTZWdcIiwgXCJUZXJcIiwgXCJRdWFcIiwgXCJRdWlcIiwgXCJTZXhcIiwgXCJTw6FiXCJdLFxuICAgIG1vbnRoczogW1wiSmFuZWlyb1wiLCBcIkZldmVyZWlyb1wiLCBcIk1hcsOnb1wiLCBcIkFicmlsXCIsIFwiTWFpb1wiLCBcIkp1bmhvXCIsIFwiSnVsaG9cIiwgXCJBZ29zdG9cIiwgXCJTZXRlbWJyb1wiLCBcIk91dHVicm9cIiwgXCJOb3ZlbWJyb1wiLCBcIkRlemVtYnJvXCJdLFxuICAgIHNob3J0TW9udGhzOiBbXCJKYW5cIiwgXCJGZXZcIiwgXCJNYXJcIiwgXCJBYnJcIiwgXCJNYWlcIiwgXCJKdW5cIiwgXCJKdWxcIiwgXCJBZ29cIiwgXCJTZXRcIiwgXCJPdXRcIiwgXCJOb3ZcIiwgXCJEZXpcIl1cbiAgfTtcblxuICB2YXIgcGxQbCA9IHtcbiAgICBkYXRlVGltZTogXCIlQSwgJWUgJUIgJVksICVYXCIsXG4gICAgZGF0ZTogXCIlZC8lbS8lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLCAvLyB1bnVzZWRcbiAgICBkYXlzOiBbXCJOaWVkemllbGFcIiwgXCJQb25pZWR6aWHFgmVrXCIsIFwiV3RvcmVrXCIsIFwixZpyb2RhXCIsIFwiQ3p3YXJ0ZWtcIiwgXCJQacSFdGVrXCIsIFwiU29ib3RhXCJdLFxuICAgIHNob3J0RGF5czogW1wiTmllZHouXCIsIFwiUG9uLlwiLCBcIld0LlwiLCBcIsWaci5cIiwgXCJDencuXCIsIFwiUHQuXCIsIFwiU29iLlwiXSxcbiAgICBtb250aHM6IFtcIlN0eWN6ZcWEXCIsIFwiTHV0eVwiLCBcIk1hcnplY1wiLCBcIkt3aWVjaWXFhFwiLCBcIk1halwiLCBcIkN6ZXJ3aWVjXCIsIFwiTGlwaWVjXCIsIFwiU2llcnBpZcWEXCIsIFwiV3J6ZXNpZcWEXCIsIFwiUGHFumR6aWVybmlrXCIsIFwiTGlzdG9wYWRcIiwgXCJHcnVkemllxYRcIl0sXG4gICAgc2hvcnRNb250aHM6IFtcIlN0eWN6LlwiLCBcIkx1dHlcIiwgXCJNYXJ6LlwiLCBcIkt3aWUuXCIsIFwiTWFqXCIsIFwiQ3plcncuXCIsIFwiTGlwYy5cIiwgXCJTaWVycC5cIiwgXCJXcnouXCIsIFwiUGHFumR6LlwiLCBcIkxpc3RvcC5cIiwgXCJHcnVkei5cIl0vKiBJbiBQb2xpc2ggbGFuZ3VhZ2UgYWJicmF2aWF0ZWQgbW9udGhzIGFyZSBub3QgY29tbW9ubHkgdXNlZCBzbyB0aGVyZSBpcyBhIGRpc3B1dGUgYWJvdXQgdGhlIHByb3BlciBhYmJyYXZpYXRpb25zLiAqL1xuICB9O1xuXG4gIHZhciBubE5sID0ge1xuICAgIGRhdGVUaW1lOiBcIiVhICVlICVCICVZICVUXCIsXG4gICAgZGF0ZTogXCIlZC0lbS0lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLCAvLyB1bnVzZWRcbiAgICBkYXlzOiBbXCJ6b25kYWdcIiwgXCJtYWFuZGFnXCIsIFwiZGluc2RhZ1wiLCBcIndvZW5zZGFnXCIsIFwiZG9uZGVyZGFnXCIsIFwidnJpamRhZ1wiLCBcInphdGVyZGFnXCJdLFxuICAgIHNob3J0RGF5czogW1wiem9cIiwgXCJtYVwiLCBcImRpXCIsIFwid29cIiwgXCJkb1wiLCBcInZyXCIsIFwiemFcIl0sXG4gICAgbW9udGhzOiBbXCJqYW51YXJpXCIsIFwiZmVicnVhcmlcIiwgXCJtYWFydFwiLCBcImFwcmlsXCIsIFwibWVpXCIsIFwianVuaVwiLCBcImp1bGlcIiwgXCJhdWd1c3R1c1wiLCBcInNlcHRlbWJlclwiLCBcIm9rdG9iZXJcIiwgXCJub3ZlbWJlclwiLCBcImRlY2VtYmVyXCJdLFxuICAgIHNob3J0TW9udGhzOiBbXCJqYW5cIiwgXCJmZWJcIiwgXCJtcnRcIiwgXCJhcHJcIiwgXCJtZWlcIiwgXCJqdW5cIiwgXCJqdWxcIiwgXCJhdWdcIiwgXCJzZXBcIiwgXCJva3RcIiwgXCJub3ZcIiwgXCJkZWNcIl1cbiAgfTtcblxuICB2YXIgbWtNayA9IHtcbiAgICBkYXRlVGltZTogXCIlQSwgJWUgJUIgJVkg0LMuICVYXCIsXG4gICAgZGF0ZTogXCIlZC4lbS4lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLFxuICAgIGRheXM6IFtcItC90LXQtNC10LvQsFwiLCBcItC/0L7QvdC10LTQtdC70L3QuNC6XCIsIFwi0LLRgtC+0YDQvdC40LpcIiwgXCLRgdGA0LXQtNCwXCIsIFwi0YfQtdGC0LLRgNGC0L7QulwiLCBcItC/0LXRgtC+0LpcIiwgXCLRgdCw0LHQvtGC0LBcIl0sXG4gICAgc2hvcnREYXlzOiBbXCLQvdC10LRcIiwgXCLQv9C+0L1cIiwgXCLQstGC0L5cIiwgXCLRgdGA0LVcIiwgXCLRh9C10YJcIiwgXCLQv9C10YJcIiwgXCLRgdCw0LFcIl0sXG4gICAgbW9udGhzOiBbXCLRmNCw0L3Rg9Cw0YDQuFwiLCBcItGE0LXQstGA0YPQsNGA0LhcIiwgXCLQvNCw0YDRglwiLCBcItCw0L/RgNC40LtcIiwgXCLQvNCw0ZhcIiwgXCLRmNGD0L3QuFwiLCBcItGY0YPQu9C4XCIsIFwi0LDQstCz0YPRgdGCXCIsIFwi0YHQtdC/0YLQtdC80LLRgNC4XCIsIFwi0L7QutGC0L7QvNCy0YDQuFwiLCBcItC90L7QtdC80LLRgNC4XCIsIFwi0LTQtdC60LXQvNCy0YDQuFwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wi0ZjQsNC9XCIsIFwi0YTQtdCyXCIsIFwi0LzQsNGAXCIsIFwi0LDQv9GAXCIsIFwi0LzQsNGYXCIsIFwi0ZjRg9C9XCIsIFwi0ZjRg9C7XCIsIFwi0LDQstCzXCIsIFwi0YHQtdC/XCIsIFwi0L7QutGCXCIsIFwi0L3QvtC1XCIsIFwi0LTQtdC6XCJdXG4gIH07XG5cbiAgdmFyIGl0SXQgPSB7XG4gICAgZGF0ZVRpbWU6IFwiJUEgJWUgJUIgJVksICVYXCIsXG4gICAgZGF0ZTogXCIlZC8lbS8lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLCAvLyB1bnVzZWRcbiAgICBkYXlzOiBbXCJEb21lbmljYVwiLCBcIkx1bmVkw6xcIiwgXCJNYXJ0ZWTDrFwiLCBcIk1lcmNvbGVkw6xcIiwgXCJHaW92ZWTDrFwiLCBcIlZlbmVyZMOsXCIsIFwiU2FiYXRvXCJdLFxuICAgIHNob3J0RGF5czogW1wiRG9tXCIsIFwiTHVuXCIsIFwiTWFyXCIsIFwiTWVyXCIsIFwiR2lvXCIsIFwiVmVuXCIsIFwiU2FiXCJdLFxuICAgIG1vbnRoczogW1wiR2VubmFpb1wiLCBcIkZlYmJyYWlvXCIsIFwiTWFyem9cIiwgXCJBcHJpbGVcIiwgXCJNYWdnaW9cIiwgXCJHaXVnbm9cIiwgXCJMdWdsaW9cIiwgXCJBZ29zdG9cIiwgXCJTZXR0ZW1icmVcIiwgXCJPdHRvYnJlXCIsIFwiTm92ZW1icmVcIiwgXCJEaWNlbWJyZVwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wiR2VuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWFnXCIsIFwiR2l1XCIsIFwiTHVnXCIsIFwiQWdvXCIsIFwiU2V0XCIsIFwiT3R0XCIsIFwiTm92XCIsIFwiRGljXCJdXG4gIH07XG5cbiAgdmFyIGhlSWwgPSB7XG4gICAgZGF0ZVRpbWU6IFwiJUEsICVlINeRJUIgJVkgJVhcIixcbiAgICBkYXRlOiBcIiVkLiVtLiVZXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gICAgZGF5czogW1wi16jXkNep15XXn1wiLCBcItep16DXmVwiLCBcItep15zXmdep15lcIiwgXCLXqNeR15nXoteZXCIsIFwi15fXnteZ16nXmVwiLCBcItep15nXqdeZXCIsIFwi16nXkdeqXCJdLFxuICAgIHNob3J0RGF5czogW1wi15DXs1wiLCBcIteR17NcIiwgXCLXktezXCIsIFwi15PXs1wiLCBcIteU17NcIiwgXCLXldezXCIsIFwi16nXs1wiXSxcbiAgICBtb250aHM6IFtcIteZ16DXldeQ16hcIiwgXCLXpNeR16jXldeQ16hcIiwgXCLXnteo16VcIiwgXCLXkNek16jXmdecXCIsIFwi157XkNeZXCIsIFwi15nXldeg15lcIiwgXCLXmdeV15zXmVwiLCBcIteQ15XXkteV16HXmFwiLCBcIteh16TXmNee15HXqFwiLCBcIteQ15XXp9eY15XXkdeoXCIsIFwi16DXldeR157XkdeoXCIsIFwi15PXptee15HXqFwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wi15nXoNeV17NcIiwgXCLXpNeR16jXs1wiLCBcItee16jXpVwiLCBcIteQ16TXqNezXCIsIFwi157XkNeZXCIsIFwi15nXldeg15lcIiwgXCLXmdeV15zXmVwiLCBcIteQ15XXktezXCIsIFwi16HXpNeY17NcIiwgXCLXkNeV16fXs1wiLCBcIteg15XXkdezXCIsIFwi15PXptee17NcIl1cbiAgfTtcblxuICB2YXIgZnJGciA9IHtcbiAgICBkYXRlVGltZTogXCIlQSwgbGUgJWUgJUIgJVksICVYXCIsXG4gICAgZGF0ZTogXCIlZC8lbS8lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLCAvLyB1bnVzZWRcbiAgICBkYXlzOiBbXCJkaW1hbmNoZVwiLCBcImx1bmRpXCIsIFwibWFyZGlcIiwgXCJtZXJjcmVkaVwiLCBcImpldWRpXCIsIFwidmVuZHJlZGlcIiwgXCJzYW1lZGlcIl0sXG4gICAgc2hvcnREYXlzOiBbXCJkaW0uXCIsIFwibHVuLlwiLCBcIm1hci5cIiwgXCJtZXIuXCIsIFwiamV1LlwiLCBcInZlbi5cIiwgXCJzYW0uXCJdLFxuICAgIG1vbnRoczogW1wiamFudmllclwiLCBcImbDqXZyaWVyXCIsIFwibWFyc1wiLCBcImF2cmlsXCIsIFwibWFpXCIsIFwianVpblwiLCBcImp1aWxsZXRcIiwgXCJhb8O7dFwiLCBcInNlcHRlbWJyZVwiLCBcIm9jdG9icmVcIiwgXCJub3ZlbWJyZVwiLCBcImTDqWNlbWJyZVwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wiamFudi5cIiwgXCJmw6l2ci5cIiwgXCJtYXJzXCIsIFwiYXZyLlwiLCBcIm1haVwiLCBcImp1aW5cIiwgXCJqdWlsLlwiLCBcImFvw7t0XCIsIFwic2VwdC5cIiwgXCJvY3QuXCIsIFwibm92LlwiLCBcImTDqWMuXCJdXG4gIH07XG5cbiAgdmFyIGZyQ2EgPSB7XG4gICAgZGF0ZVRpbWU6IFwiJWEgJWUgJWIgJVkgJVhcIixcbiAgICBkYXRlOiBcIiVZLSVtLSVkXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIlwiLCBcIlwiXSxcbiAgICBkYXlzOiBbXCJkaW1hbmNoZVwiLCBcImx1bmRpXCIsIFwibWFyZGlcIiwgXCJtZXJjcmVkaVwiLCBcImpldWRpXCIsIFwidmVuZHJlZGlcIiwgXCJzYW1lZGlcIl0sXG4gICAgc2hvcnREYXlzOiBbXCJkaW1cIiwgXCJsdW5cIiwgXCJtYXJcIiwgXCJtZXJcIiwgXCJqZXVcIiwgXCJ2ZW5cIiwgXCJzYW1cIl0sXG4gICAgbW9udGhzOiBbXCJqYW52aWVyXCIsIFwiZsOpdnJpZXJcIiwgXCJtYXJzXCIsIFwiYXZyaWxcIiwgXCJtYWlcIiwgXCJqdWluXCIsIFwianVpbGxldFwiLCBcImFvw7t0XCIsIFwic2VwdGVtYnJlXCIsIFwib2N0b2JyZVwiLCBcIm5vdmVtYnJlXCIsIFwiZMOpY2VtYnJlXCJdLFxuICAgIHNob3J0TW9udGhzOiBbXCJqYW5cIiwgXCJmw6l2XCIsIFwibWFyXCIsIFwiYXZyXCIsIFwibWFpXCIsIFwianVpXCIsIFwianVsXCIsIFwiYW/Du1wiLCBcInNlcFwiLCBcIm9jdFwiLCBcIm5vdlwiLCBcImTDqWNcIl1cbiAgfTtcblxuICB2YXIgZmlGaSA9IHtcbiAgICBkYXRlVGltZTogXCIlQSwgJS1kLiAlQnRhICVZIGtsbyAlWFwiLFxuICAgIGRhdGU6IFwiJS1kLiUtbS4lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJhLm0uXCIsIFwicC5tLlwiXSxcbiAgICBkYXlzOiBbXCJzdW5udW50YWlcIiwgXCJtYWFuYW50YWlcIiwgXCJ0aWlzdGFpXCIsIFwia2Vza2l2aWlra29cIiwgXCJ0b3JzdGFpXCIsIFwicGVyamFudGFpXCIsIFwibGF1YW50YWlcIl0sXG4gICAgc2hvcnREYXlzOiBbXCJTdVwiLCBcIk1hXCIsIFwiVGlcIiwgXCJLZVwiLCBcIlRvXCIsIFwiUGVcIiwgXCJMYVwiXSxcbiAgICBtb250aHM6IFtcInRhbW1pa3V1XCIsIFwiaGVsbWlrdXVcIiwgXCJtYWFsaXNrdXVcIiwgXCJodWh0aWt1dVwiLCBcInRvdWtva3V1XCIsIFwia2Vzw6RrdXVcIiwgXCJoZWluw6RrdXVcIiwgXCJlbG9rdXVcIiwgXCJzeXlza3V1XCIsIFwibG9rYWt1dVwiLCBcIm1hcnJhc2t1dVwiLCBcImpvdWx1a3V1XCJdLFxuICAgIHNob3J0TW9udGhzOiBbXCJUYW1taVwiLCBcIkhlbG1pXCIsIFwiTWFhbGlzXCIsIFwiSHVodGlcIiwgXCJUb3Vrb1wiLCBcIktlc8OkXCIsIFwiSGVpbsOkXCIsIFwiRWxvXCIsIFwiU3l5c1wiLCBcIkxva2FcIiwgXCJNYXJyYXNcIiwgXCJKb3VsdVwiXVxuICB9O1xuXG4gIHZhciBlc0VzID0ge1xuICAgIGRhdGVUaW1lOiBcIiVBLCAlZSBkZSAlQiBkZSAlWSwgJVhcIixcbiAgICBkYXRlOiBcIiVkLyVtLyVZXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gICAgZGF5czogW1wiZG9taW5nb1wiLCBcImx1bmVzXCIsIFwibWFydGVzXCIsIFwibWnDqXJjb2xlc1wiLCBcImp1ZXZlc1wiLCBcInZpZXJuZXNcIiwgXCJzw6FiYWRvXCJdLFxuICAgIHNob3J0RGF5czogW1wiZG9tXCIsIFwibHVuXCIsIFwibWFyXCIsIFwibWnDqVwiLCBcImp1ZVwiLCBcInZpZVwiLCBcInPDoWJcIl0sXG4gICAgbW9udGhzOiBbXCJlbmVyb1wiLCBcImZlYnJlcm9cIiwgXCJtYXJ6b1wiLCBcImFicmlsXCIsIFwibWF5b1wiLCBcImp1bmlvXCIsIFwianVsaW9cIiwgXCJhZ29zdG9cIiwgXCJzZXB0aWVtYnJlXCIsIFwib2N0dWJyZVwiLCBcIm5vdmllbWJyZVwiLCBcImRpY2llbWJyZVwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wiZW5lXCIsIFwiZmViXCIsIFwibWFyXCIsIFwiYWJyXCIsIFwibWF5XCIsIFwianVuXCIsIFwianVsXCIsIFwiYWdvXCIsIFwic2VwXCIsIFwib2N0XCIsIFwibm92XCIsIFwiZGljXCJdXG4gIH07XG5cbiAgdmFyIGVuVXMgPSB7XG4gICAgZGF0ZVRpbWU6IFwiJWEgJWIgJWUgJVggJVlcIixcbiAgICBkYXRlOiBcIiVtLyVkLyVZXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gICAgZGF5czogW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl0sXG4gICAgc2hvcnREYXlzOiBbXCJTdW5cIiwgXCJNb25cIiwgXCJUdWVcIiwgXCJXZWRcIiwgXCJUaHVcIiwgXCJGcmlcIiwgXCJTYXRcIl0sXG4gICAgbW9udGhzOiBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPY3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wiSmFuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWF5XCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCJdXG4gIH07XG5cbiAgdmFyIGVuR2IgPSB7XG4gICAgZGF0ZVRpbWU6IFwiJWEgJWUgJWIgJVggJVlcIixcbiAgICBkYXRlOiBcIiVkLyVtLyVZXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gICAgZGF5czogW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl0sXG4gICAgc2hvcnREYXlzOiBbXCJTdW5cIiwgXCJNb25cIiwgXCJUdWVcIiwgXCJXZWRcIiwgXCJUaHVcIiwgXCJGcmlcIiwgXCJTYXRcIl0sXG4gICAgbW9udGhzOiBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPY3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wiSmFuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWF5XCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCJdXG4gIH07XG5cbiAgdmFyIGVuQ2EgPSB7XG4gICAgZGF0ZVRpbWU6IFwiJWEgJWIgJWUgJVggJVlcIixcbiAgICBkYXRlOiBcIiVZLSVtLSVkXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gICAgZGF5czogW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl0sXG4gICAgc2hvcnREYXlzOiBbXCJTdW5cIiwgXCJNb25cIiwgXCJUdWVcIiwgXCJXZWRcIiwgXCJUaHVcIiwgXCJGcmlcIiwgXCJTYXRcIl0sXG4gICAgbW9udGhzOiBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPY3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wiSmFuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWF5XCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCJdXG4gIH07XG5cbiAgdmFyIGRlRGUgPSB7XG4gICAgZGF0ZVRpbWU6IFwiJUEsIGRlciAlZS4gJUIgJVksICVYXCIsXG4gICAgZGF0ZTogXCIlZC4lbS4lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLCAvLyB1bnVzZWRcbiAgICBkYXlzOiBbXCJTb25udGFnXCIsIFwiTW9udGFnXCIsIFwiRGllbnN0YWdcIiwgXCJNaXR0d29jaFwiLCBcIkRvbm5lcnN0YWdcIiwgXCJGcmVpdGFnXCIsIFwiU2Ftc3RhZ1wiXSxcbiAgICBzaG9ydERheXM6IFtcIlNvXCIsIFwiTW9cIiwgXCJEaVwiLCBcIk1pXCIsIFwiRG9cIiwgXCJGclwiLCBcIlNhXCJdLFxuICAgIG1vbnRoczogW1wiSmFudWFyXCIsIFwiRmVicnVhclwiLCBcIk3DpHJ6XCIsIFwiQXByaWxcIiwgXCJNYWlcIiwgXCJKdW5pXCIsIFwiSnVsaVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9rdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlemVtYmVyXCJdLFxuICAgIHNob3J0TW9udGhzOiBbXCJKYW5cIiwgXCJGZWJcIiwgXCJNcnpcIiwgXCJBcHJcIiwgXCJNYWlcIiwgXCJKdW5cIiwgXCJKdWxcIiwgXCJBdWdcIiwgXCJTZXBcIiwgXCJPa3RcIiwgXCJOb3ZcIiwgXCJEZXpcIl1cbiAgfTtcblxuICB2YXIgY2FFcyA9IHtcbiAgICBkYXRlVGltZTogXCIlQSwgJWUgZGUgJUIgZGUgJVksICVYXCIsXG4gICAgZGF0ZTogXCIlZC8lbS8lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLFxuICAgIGRheXM6IFtcImRpdW1lbmdlXCIsIFwiZGlsbHVuc1wiLCBcImRpbWFydHNcIiwgXCJkaW1lY3Jlc1wiLCBcImRpam91c1wiLCBcImRpdmVuZHJlc1wiLCBcImRpc3NhYnRlXCJdLFxuICAgIHNob3J0RGF5czogW1wiZGcuXCIsIFwiZGwuXCIsIFwiZHQuXCIsIFwiZGMuXCIsIFwiZGouXCIsIFwiZHYuXCIsIFwiZHMuXCJdLFxuICAgIG1vbnRoczogW1wiZ2VuZXJcIiwgXCJmZWJyZXJcIiwgXCJtYXLDp1wiLCBcImFicmlsXCIsIFwibWFpZ1wiLCBcImp1bnlcIiwgXCJqdWxpb2xcIiwgXCJhZ29zdFwiLCBcInNldGVtYnJlXCIsIFwib2N0dWJyZVwiLCBcIm5vdmVtYnJlXCIsIFwiZGVzZW1icmVcIl0sXG4gICAgc2hvcnRNb250aHM6IFtcImdlbi5cIiwgXCJmZWJyLlwiLCBcIm1hcsOnXCIsIFwiYWJyLlwiLCBcIm1haWdcIiwgXCJqdW55XCIsIFwianVsLlwiLCBcImFnLlwiLCBcInNldC5cIiwgXCJvY3QuXCIsIFwibm92LlwiLCBcImRlcy5cIl1cbiAgfTtcblxuICB2YXIgdDAgPSBuZXcgRGF0ZTtcbiAgdmFyIHQxID0gbmV3IERhdGU7XG5cbiAgZnVuY3Rpb24gbmV3SW50ZXJ2YWwoZmxvb3JpLCBvZmZzZXRpLCBjb3VudCkge1xuXG4gICAgZnVuY3Rpb24gaW50ZXJ2YWwoZGF0ZSkge1xuICAgICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoK2RhdGUpKSwgZGF0ZTtcbiAgICB9XG5cbiAgICBpbnRlcnZhbC5mbG9vciA9IGludGVydmFsO1xuXG4gICAgaW50ZXJ2YWwucm91bmQgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICB2YXIgZDAgPSBuZXcgRGF0ZSgrZGF0ZSksXG4gICAgICAgICAgZDEgPSBuZXcgRGF0ZShkYXRlIC0gMSk7XG4gICAgICBmbG9vcmkoZDApLCBmbG9vcmkoZDEpLCBvZmZzZXRpKGQxLCAxKTtcbiAgICAgIHJldHVybiBkYXRlIC0gZDAgPCBkMSAtIGRhdGUgPyBkMCA6IGQxO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5jZWlsID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoZGF0ZSAtIDEpKSwgb2Zmc2V0aShkYXRlLCAxKSwgZGF0ZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwub2Zmc2V0ID0gZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgcmV0dXJuIG9mZnNldGkoZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKSwgc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCkpLCBkYXRlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgICB2YXIgcmFuZ2UgPSBbXTtcbiAgICAgIHN0YXJ0ID0gbmV3IERhdGUoc3RhcnQgLSAxKTtcbiAgICAgIHN0b3AgPSBuZXcgRGF0ZSgrc3RvcCk7XG4gICAgICBzdGVwID0gc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCk7XG4gICAgICBpZiAoIShzdGFydCA8IHN0b3ApIHx8ICEoc3RlcCA+IDApKSByZXR1cm4gcmFuZ2U7IC8vIGFsc28gaGFuZGxlcyBJbnZhbGlkIERhdGVcbiAgICAgIG9mZnNldGkoc3RhcnQsIDEpLCBmbG9vcmkoc3RhcnQpO1xuICAgICAgaWYgKHN0YXJ0IDwgc3RvcCkgcmFuZ2UucHVzaChuZXcgRGF0ZSgrc3RhcnQpKTtcbiAgICAgIHdoaWxlIChvZmZzZXRpKHN0YXJ0LCBzdGVwKSwgZmxvb3JpKHN0YXJ0KSwgc3RhcnQgPCBzdG9wKSByYW5nZS5wdXNoKG5ldyBEYXRlKCtzdGFydCkpO1xuICAgICAgcmV0dXJuIHJhbmdlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5maWx0ZXIgPSBmdW5jdGlvbih0ZXN0KSB7XG4gICAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICB3aGlsZSAoZmxvb3JpKGRhdGUpLCAhdGVzdChkYXRlKSkgZGF0ZS5zZXRUaW1lKGRhdGUgLSAxKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgICAgd2hpbGUgKC0tc3RlcCA+PSAwKSB3aGlsZSAob2Zmc2V0aShkYXRlLCAxKSwgIXRlc3QoZGF0ZSkpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmIChjb3VudCkgaW50ZXJ2YWwuY291bnQgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICB0MC5zZXRUaW1lKCtzdGFydCksIHQxLnNldFRpbWUoK2VuZCk7XG4gICAgICBmbG9vcmkodDApLCBmbG9vcmkodDEpO1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoY291bnQodDAsIHQxKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBpbnRlcnZhbDtcbiAgfVxuXG4gIHZhciBkYXkgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCAtIChlbmQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNmU0KSAvIDg2NGU1O1xuICB9KTtcblxuICBmdW5jdGlvbiB3ZWVrZGF5KGkpIHtcbiAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIChkYXRlLmdldERheSgpICsgNyAtIGkpICUgNyk7XG4gICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgc3RlcCAqIDcpO1xuICAgIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiAoZW5kIC0gc3RhcnQgLSAoZW5kLmdldFRpbWV6b25lT2Zmc2V0KCkgLSBzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpKSAqIDZlNCkgLyA2MDQ4ZTU7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgc3VuZGF5ID0gd2Vla2RheSgwKTtcbiAgdmFyIG1vbmRheSA9IHdlZWtkYXkoMSk7XG5cbiAgdmFyIHllYXIgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldE1vbnRoKDAsIDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCk7XG4gIH0pO1xuXG4gIHZhciB1dGNEYXkgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA4NjRlNTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gdXRjV2Vla2RheShpKSB7XG4gICAgcmV0dXJuIG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gICAgICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgLSAoZGF0ZS5nZXRVVENEYXkoKSArIDcgLSBpKSAlIDcpO1xuICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIHN0ZXAgKiA3KTtcbiAgICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDYwNDhlNTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciB1dGNTdW5kYXkgPSB1dGNXZWVrZGF5KDApO1xuICB2YXIgdXRjTW9uZGF5ID0gdXRjV2Vla2RheSgxKTtcblxuICB2YXIgdXRjWWVhciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0VVRDTW9udGgoMCwgMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRVVENGdWxsWWVhcigpIC0gc3RhcnQuZ2V0VVRDRnVsbFllYXIoKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gbG9jYWxEYXRlKGQpIHtcbiAgICBpZiAoMCA8PSBkLnkgJiYgZC55IDwgMTAwKSB7XG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKC0xLCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKTtcbiAgICAgIGRhdGUuc2V0RnVsbFllYXIoZC55KTtcbiAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IERhdGUoZC55LCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHV0Y0RhdGUoZCkge1xuICAgIGlmICgwIDw9IGQueSAmJiBkLnkgPCAxMDApIHtcbiAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMoLTEsIGQubSwgZC5kLCBkLkgsIGQuTSwgZC5TLCBkLkwpKTtcbiAgICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoZC55KTtcbiAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoZC55LCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKSk7XG4gIH1cblxuICBmdW5jdGlvbiBuZXdZZWFyKHkpIHtcbiAgICByZXR1cm4ge3k6IHksIG06IDAsIGQ6IDEsIEg6IDAsIE06IDAsIFM6IDAsIEw6IDB9O1xuICB9XG5cbiAgZnVuY3Rpb24gbG9jYWxlKGxvY2FsZSkge1xuICAgIHZhciBsb2NhbGVfZGF0ZVRpbWUgPSBsb2NhbGUuZGF0ZVRpbWUsXG4gICAgICAgIGxvY2FsZV9kYXRlID0gbG9jYWxlLmRhdGUsXG4gICAgICAgIGxvY2FsZV90aW1lID0gbG9jYWxlLnRpbWUsXG4gICAgICAgIGxvY2FsZV9wZXJpb2RzID0gbG9jYWxlLnBlcmlvZHMsXG4gICAgICAgIGxvY2FsZV93ZWVrZGF5cyA9IGxvY2FsZS5kYXlzLFxuICAgICAgICBsb2NhbGVfc2hvcnRXZWVrZGF5cyA9IGxvY2FsZS5zaG9ydERheXMsXG4gICAgICAgIGxvY2FsZV9tb250aHMgPSBsb2NhbGUubW9udGhzLFxuICAgICAgICBsb2NhbGVfc2hvcnRNb250aHMgPSBsb2NhbGUuc2hvcnRNb250aHM7XG5cbiAgICB2YXIgcGVyaW9kTG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV9wZXJpb2RzKSxcbiAgICAgICAgd2Vla2RheVJlID0gZm9ybWF0UmUobG9jYWxlX3dlZWtkYXlzKSxcbiAgICAgICAgd2Vla2RheUxvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfd2Vla2RheXMpLFxuICAgICAgICBzaG9ydFdlZWtkYXlSZSA9IGZvcm1hdFJlKGxvY2FsZV9zaG9ydFdlZWtkYXlzKSxcbiAgICAgICAgc2hvcnRXZWVrZGF5TG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV9zaG9ydFdlZWtkYXlzKSxcbiAgICAgICAgbW9udGhSZSA9IGZvcm1hdFJlKGxvY2FsZV9tb250aHMpLFxuICAgICAgICBtb250aExvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfbW9udGhzKSxcbiAgICAgICAgc2hvcnRNb250aFJlID0gZm9ybWF0UmUobG9jYWxlX3Nob3J0TW9udGhzKSxcbiAgICAgICAgc2hvcnRNb250aExvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfc2hvcnRNb250aHMpO1xuXG4gICAgdmFyIGZvcm1hdHMgPSB7XG4gICAgICBcImFcIjogZm9ybWF0U2hvcnRXZWVrZGF5LFxuICAgICAgXCJBXCI6IGZvcm1hdFdlZWtkYXksXG4gICAgICBcImJcIjogZm9ybWF0U2hvcnRNb250aCxcbiAgICAgIFwiQlwiOiBmb3JtYXRNb250aCxcbiAgICAgIFwiY1wiOiBudWxsLFxuICAgICAgXCJkXCI6IGZvcm1hdERheU9mTW9udGgsXG4gICAgICBcImVcIjogZm9ybWF0RGF5T2ZNb250aCxcbiAgICAgIFwiSFwiOiBmb3JtYXRIb3VyMjQsXG4gICAgICBcIklcIjogZm9ybWF0SG91cjEyLFxuICAgICAgXCJqXCI6IGZvcm1hdERheU9mWWVhcixcbiAgICAgIFwiTFwiOiBmb3JtYXRNaWxsaXNlY29uZHMsXG4gICAgICBcIm1cIjogZm9ybWF0TW9udGhOdW1iZXIsXG4gICAgICBcIk1cIjogZm9ybWF0TWludXRlcyxcbiAgICAgIFwicFwiOiBmb3JtYXRQZXJpb2QsXG4gICAgICBcIlNcIjogZm9ybWF0U2Vjb25kcyxcbiAgICAgIFwiVVwiOiBmb3JtYXRXZWVrTnVtYmVyU3VuZGF5LFxuICAgICAgXCJ3XCI6IGZvcm1hdFdlZWtkYXlOdW1iZXIsXG4gICAgICBcIldcIjogZm9ybWF0V2Vla051bWJlck1vbmRheSxcbiAgICAgIFwieFwiOiBudWxsLFxuICAgICAgXCJYXCI6IG51bGwsXG4gICAgICBcInlcIjogZm9ybWF0WWVhcixcbiAgICAgIFwiWVwiOiBmb3JtYXRGdWxsWWVhcixcbiAgICAgIFwiWlwiOiBmb3JtYXRab25lLFxuICAgICAgXCIlXCI6IGZvcm1hdExpdGVyYWxQZXJjZW50XG4gICAgfTtcblxuICAgIHZhciB1dGNGb3JtYXRzID0ge1xuICAgICAgXCJhXCI6IGZvcm1hdFVUQ1Nob3J0V2Vla2RheSxcbiAgICAgIFwiQVwiOiBmb3JtYXRVVENXZWVrZGF5LFxuICAgICAgXCJiXCI6IGZvcm1hdFVUQ1Nob3J0TW9udGgsXG4gICAgICBcIkJcIjogZm9ybWF0VVRDTW9udGgsXG4gICAgICBcImNcIjogbnVsbCxcbiAgICAgIFwiZFwiOiBmb3JtYXRVVENEYXlPZk1vbnRoLFxuICAgICAgXCJlXCI6IGZvcm1hdFVUQ0RheU9mTW9udGgsXG4gICAgICBcIkhcIjogZm9ybWF0VVRDSG91cjI0LFxuICAgICAgXCJJXCI6IGZvcm1hdFVUQ0hvdXIxMixcbiAgICAgIFwialwiOiBmb3JtYXRVVENEYXlPZlllYXIsXG4gICAgICBcIkxcIjogZm9ybWF0VVRDTWlsbGlzZWNvbmRzLFxuICAgICAgXCJtXCI6IGZvcm1hdFVUQ01vbnRoTnVtYmVyLFxuICAgICAgXCJNXCI6IGZvcm1hdFVUQ01pbnV0ZXMsXG4gICAgICBcInBcIjogZm9ybWF0VVRDUGVyaW9kLFxuICAgICAgXCJTXCI6IGZvcm1hdFVUQ1NlY29uZHMsXG4gICAgICBcIlVcIjogZm9ybWF0VVRDV2Vla051bWJlclN1bmRheSxcbiAgICAgIFwid1wiOiBmb3JtYXRVVENXZWVrZGF5TnVtYmVyLFxuICAgICAgXCJXXCI6IGZvcm1hdFVUQ1dlZWtOdW1iZXJNb25kYXksXG4gICAgICBcInhcIjogbnVsbCxcbiAgICAgIFwiWFwiOiBudWxsLFxuICAgICAgXCJ5XCI6IGZvcm1hdFVUQ1llYXIsXG4gICAgICBcIllcIjogZm9ybWF0VVRDRnVsbFllYXIsXG4gICAgICBcIlpcIjogZm9ybWF0VVRDWm9uZSxcbiAgICAgIFwiJVwiOiBmb3JtYXRMaXRlcmFsUGVyY2VudFxuICAgIH07XG5cbiAgICB2YXIgcGFyc2VzID0ge1xuICAgICAgXCJhXCI6IHBhcnNlU2hvcnRXZWVrZGF5LFxuICAgICAgXCJBXCI6IHBhcnNlV2Vla2RheSxcbiAgICAgIFwiYlwiOiBwYXJzZVNob3J0TW9udGgsXG4gICAgICBcIkJcIjogcGFyc2VNb250aCxcbiAgICAgIFwiY1wiOiBwYXJzZUxvY2FsZURhdGVUaW1lLFxuICAgICAgXCJkXCI6IHBhcnNlRGF5T2ZNb250aCxcbiAgICAgIFwiZVwiOiBwYXJzZURheU9mTW9udGgsXG4gICAgICBcIkhcIjogcGFyc2VIb3VyMjQsXG4gICAgICBcIklcIjogcGFyc2VIb3VyMjQsXG4gICAgICBcImpcIjogcGFyc2VEYXlPZlllYXIsXG4gICAgICBcIkxcIjogcGFyc2VNaWxsaXNlY29uZHMsXG4gICAgICBcIm1cIjogcGFyc2VNb250aE51bWJlcixcbiAgICAgIFwiTVwiOiBwYXJzZU1pbnV0ZXMsXG4gICAgICBcInBcIjogcGFyc2VQZXJpb2QsXG4gICAgICBcIlNcIjogcGFyc2VTZWNvbmRzLFxuICAgICAgXCJVXCI6IHBhcnNlV2Vla051bWJlclN1bmRheSxcbiAgICAgIFwid1wiOiBwYXJzZVdlZWtkYXlOdW1iZXIsXG4gICAgICBcIldcIjogcGFyc2VXZWVrTnVtYmVyTW9uZGF5LFxuICAgICAgXCJ4XCI6IHBhcnNlTG9jYWxlRGF0ZSxcbiAgICAgIFwiWFwiOiBwYXJzZUxvY2FsZVRpbWUsXG4gICAgICBcInlcIjogcGFyc2VZZWFyLFxuICAgICAgXCJZXCI6IHBhcnNlRnVsbFllYXIsXG4gICAgICBcIlpcIjogcGFyc2Vab25lLFxuICAgICAgXCIlXCI6IHBhcnNlTGl0ZXJhbFBlcmNlbnRcbiAgICB9O1xuXG4gICAgLy8gVGhlc2UgcmVjdXJzaXZlIGRpcmVjdGl2ZSBkZWZpbml0aW9ucyBtdXN0IGJlIGRlZmVycmVkLlxuICAgIGZvcm1hdHMueCA9IG5ld0Zvcm1hdChsb2NhbGVfZGF0ZSwgZm9ybWF0cyk7XG4gICAgZm9ybWF0cy5YID0gbmV3Rm9ybWF0KGxvY2FsZV90aW1lLCBmb3JtYXRzKTtcbiAgICBmb3JtYXRzLmMgPSBuZXdGb3JtYXQobG9jYWxlX2RhdGVUaW1lLCBmb3JtYXRzKTtcbiAgICB1dGNGb3JtYXRzLnggPSBuZXdGb3JtYXQobG9jYWxlX2RhdGUsIHV0Y0Zvcm1hdHMpO1xuICAgIHV0Y0Zvcm1hdHMuWCA9IG5ld0Zvcm1hdChsb2NhbGVfdGltZSwgdXRjRm9ybWF0cyk7XG4gICAgdXRjRm9ybWF0cy5jID0gbmV3Rm9ybWF0KGxvY2FsZV9kYXRlVGltZSwgdXRjRm9ybWF0cyk7XG5cbiAgICBmdW5jdGlvbiBuZXdGb3JtYXQoc3BlY2lmaWVyLCBmb3JtYXRzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICB2YXIgc3RyaW5nID0gW10sXG4gICAgICAgICAgICBpID0gLTEsXG4gICAgICAgICAgICBqID0gMCxcbiAgICAgICAgICAgIG4gPSBzcGVjaWZpZXIubGVuZ3RoLFxuICAgICAgICAgICAgYyxcbiAgICAgICAgICAgIHBhZCxcbiAgICAgICAgICAgIGZvcm1hdDtcblxuICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgIGlmIChzcGVjaWZpZXIuY2hhckNvZGVBdChpKSA9PT0gMzcpIHtcbiAgICAgICAgICAgIHN0cmluZy5wdXNoKHNwZWNpZmllci5zbGljZShqLCBpKSk7XG4gICAgICAgICAgICBpZiAoKHBhZCA9IHBhZHNbYyA9IHNwZWNpZmllci5jaGFyQXQoKytpKV0pICE9IG51bGwpIGMgPSBzcGVjaWZpZXIuY2hhckF0KCsraSk7XG4gICAgICAgICAgICBpZiAoZm9ybWF0ID0gZm9ybWF0c1tjXSkgYyA9IGZvcm1hdChkYXRlLCBwYWQgPT0gbnVsbCA/IChjID09PSBcImVcIiA/IFwiIFwiIDogXCIwXCIpIDogcGFkKTtcbiAgICAgICAgICAgIHN0cmluZy5wdXNoKGMpO1xuICAgICAgICAgICAgaiA9IGkgKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0cmluZy5wdXNoKHNwZWNpZmllci5zbGljZShqLCBpKSk7XG4gICAgICAgIHJldHVybiBzdHJpbmcuam9pbihcIlwiKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV3UGFyc2Uoc3BlY2lmaWVyLCBuZXdEYXRlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICAgIHZhciBkID0gbmV3WWVhcigxOTAwKSxcbiAgICAgICAgICAgIGkgPSBwYXJzZVNwZWNpZmllcihkLCBzcGVjaWZpZXIsIHN0cmluZywgMCk7XG4gICAgICAgIGlmIChpICE9IHN0cmluZy5sZW5ndGgpIHJldHVybiBudWxsO1xuXG4gICAgICAgIC8vIFRoZSBhbS1wbSBmbGFnIGlzIDAgZm9yIEFNLCBhbmQgMSBmb3IgUE0uXG4gICAgICAgIGlmIChcInBcIiBpbiBkKSBkLkggPSBkLkggJSAxMiArIGQucCAqIDEyO1xuXG4gICAgICAgIC8vIElmIGEgdGltZSB6b25lIGlzIHNwZWNpZmllZCwgYWxsIGZpZWxkcyBhcmUgaW50ZXJwcmV0ZWQgYXMgVVRDIGFuZCB0aGVuXG4gICAgICAgIC8vIG9mZnNldCBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmllZCB0aW1lIHpvbmUuXG4gICAgICAgIGlmIChcIlpcIiBpbiBkKSB7XG4gICAgICAgICAgaWYgKFwid1wiIGluIGQgJiYgKFwiV1wiIGluIGQgfHwgXCJVXCIgaW4gZCkpIHtcbiAgICAgICAgICAgIHZhciBkYXkgPSB1dGNEYXRlKG5ld1llYXIoZC55KSkuZ2V0VVRDRGF5KCk7XG4gICAgICAgICAgICBpZiAoXCJXXCIgaW4gZCkgZC5VID0gZC5XLCBkLncgPSAoZC53ICsgNikgJSA3LCAtLWRheTtcbiAgICAgICAgICAgIGQubSA9IDA7XG4gICAgICAgICAgICBkLmQgPSBkLncgKyBkLlUgKiA3IC0gKGRheSArIDYpICUgNztcbiAgICAgICAgICB9XG4gICAgICAgICAgZC5IICs9IGQuWiAvIDEwMCB8IDA7XG4gICAgICAgICAgZC5NICs9IGQuWiAlIDEwMDtcbiAgICAgICAgICByZXR1cm4gdXRjRGF0ZShkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgYWxsIGZpZWxkcyBhcmUgaW4gbG9jYWwgdGltZS5cbiAgICAgICAgaWYgKFwid1wiIGluIGQgJiYgKFwiV1wiIGluIGQgfHwgXCJVXCIgaW4gZCkpIHtcbiAgICAgICAgICB2YXIgZGF5ID0gbmV3RGF0ZShuZXdZZWFyKGQueSkpLmdldERheSgpO1xuICAgICAgICAgIGlmIChcIldcIiBpbiBkKSBkLlUgPSBkLlcsIGQudyA9IChkLncgKyA2KSAlIDcsIC0tZGF5O1xuICAgICAgICAgIGQubSA9IDA7XG4gICAgICAgICAgZC5kID0gZC53ICsgZC5VICogNyAtIChkYXkgKyA2KSAlIDc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RhdGUoZCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlU3BlY2lmaWVyKGQsIHNwZWNpZmllciwgc3RyaW5nLCBqKSB7XG4gICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgbiA9IHNwZWNpZmllci5sZW5ndGgsXG4gICAgICAgICAgbSA9IHN0cmluZy5sZW5ndGgsXG4gICAgICAgICAgYyxcbiAgICAgICAgICBwYXJzZTtcblxuICAgICAgd2hpbGUgKGkgPCBuKSB7XG4gICAgICAgIGlmIChqID49IG0pIHJldHVybiAtMTtcbiAgICAgICAgYyA9IHNwZWNpZmllci5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgIGlmIChjID09PSAzNykge1xuICAgICAgICAgIGMgPSBzcGVjaWZpZXIuY2hhckF0KGkrKyk7XG4gICAgICAgICAgcGFyc2UgPSBwYXJzZXNbYyBpbiBwYWRzID8gc3BlY2lmaWVyLmNoYXJBdChpKyspIDogY107XG4gICAgICAgICAgaWYgKCFwYXJzZSB8fCAoKGogPSBwYXJzZShkLCBzdHJpbmcsIGopKSA8IDApKSByZXR1cm4gLTE7XG4gICAgICAgIH0gZWxzZSBpZiAoYyAhPSBzdHJpbmcuY2hhckNvZGVBdChqKyspKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBqO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlU2hvcnRXZWVrZGF5KGQsIHN0cmluZywgaSkge1xuICAgICAgdmFyIG4gPSBzaG9ydFdlZWtkYXlSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgICByZXR1cm4gbiA/IChkLncgPSBzaG9ydFdlZWtkYXlMb29rdXAuZ2V0KG5bMF0udG9Mb3dlckNhc2UoKSksIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVdlZWtkYXkoZCwgc3RyaW5nLCBpKSB7XG4gICAgICB2YXIgbiA9IHdlZWtkYXlSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgICByZXR1cm4gbiA/IChkLncgPSB3ZWVrZGF5TG9va3VwLmdldChuWzBdLnRvTG93ZXJDYXNlKCkpLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VTaG9ydE1vbnRoKGQsIHN0cmluZywgaSkge1xuICAgICAgdmFyIG4gPSBzaG9ydE1vbnRoUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgICAgcmV0dXJuIG4gPyAoZC5tID0gc2hvcnRNb250aExvb2t1cC5nZXQoblswXS50b0xvd2VyQ2FzZSgpKSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTW9udGgoZCwgc3RyaW5nLCBpKSB7XG4gICAgICB2YXIgbiA9IG1vbnRoUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgICAgcmV0dXJuIG4gPyAoZC5tID0gbW9udGhMb29rdXAuZ2V0KG5bMF0udG9Mb3dlckNhc2UoKSksIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZUxvY2FsZURhdGVUaW1lKGQsIHN0cmluZywgaSkge1xuICAgICAgcmV0dXJuIHBhcnNlU3BlY2lmaWVyKGQsIGxvY2FsZV9kYXRlVGltZSwgc3RyaW5nLCBpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZUxvY2FsZURhdGUoZCwgc3RyaW5nLCBpKSB7XG4gICAgICByZXR1cm4gcGFyc2VTcGVjaWZpZXIoZCwgbG9jYWxlX2RhdGUsIHN0cmluZywgaSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VMb2NhbGVUaW1lKGQsIHN0cmluZywgaSkge1xuICAgICAgcmV0dXJuIHBhcnNlU3BlY2lmaWVyKGQsIGxvY2FsZV90aW1lLCBzdHJpbmcsIGkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlUGVyaW9kKGQsIHN0cmluZywgaSkge1xuICAgICAgdmFyIG4gPSBwZXJpb2RMb29rdXAuZ2V0KHN0cmluZy5zbGljZShpLCBpICs9IDIpLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgcmV0dXJuIG4gPT0gbnVsbCA/IC0xIDogKGQucCA9IG4sIGkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFNob3J0V2Vla2RheShkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX3Nob3J0V2Vla2RheXNbZC5nZXREYXkoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0V2Vla2RheShkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX3dlZWtkYXlzW2QuZ2V0RGF5KCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFNob3J0TW9udGgoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV9zaG9ydE1vbnRoc1tkLmdldE1vbnRoKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdE1vbnRoKGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfbW9udGhzW2QuZ2V0TW9udGgoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0UGVyaW9kKGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfcGVyaW9kc1srKGQuZ2V0SG91cnMoKSA+PSAxMildO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFVUQ1Nob3J0V2Vla2RheShkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX3Nob3J0V2Vla2RheXNbZC5nZXRVVENEYXkoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VVRDV2Vla2RheShkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX3dlZWtkYXlzW2QuZ2V0VVRDRGF5KCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFVUQ1Nob3J0TW9udGgoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV9zaG9ydE1vbnRoc1tkLmdldFVUQ01vbnRoKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFVUQ01vbnRoKGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfbW9udGhzW2QuZ2V0VVRDTW9udGgoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VVRDUGVyaW9kKGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfcGVyaW9kc1srKGQuZ2V0VVRDSG91cnMoKSA+PSAxMildO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBmb3JtYXQ6IGZ1bmN0aW9uKHNwZWNpZmllcikge1xuICAgICAgICB2YXIgZiA9IG5ld0Zvcm1hdChzcGVjaWZpZXIgKz0gXCJcIiwgZm9ybWF0cyk7XG4gICAgICAgIGYucGFyc2UgPSBuZXdQYXJzZShzcGVjaWZpZXIsIGxvY2FsRGF0ZSk7XG4gICAgICAgIGYudG9TdHJpbmcgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHNwZWNpZmllcjsgfTtcbiAgICAgICAgcmV0dXJuIGY7XG4gICAgICB9LFxuICAgICAgdXRjRm9ybWF0OiBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgICAgICAgdmFyIGYgPSBuZXdGb3JtYXQoc3BlY2lmaWVyICs9IFwiXCIsIHV0Y0Zvcm1hdHMpO1xuICAgICAgICBmLnBhcnNlID0gbmV3UGFyc2Uoc3BlY2lmaWVyLCB1dGNEYXRlKTtcbiAgICAgICAgZi50b1N0cmluZyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gc3BlY2lmaWVyOyB9O1xuICAgICAgICByZXR1cm4gZjtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgdmFyIHBhZHMgPSB7XCItXCI6IFwiXCIsIFwiX1wiOiBcIiBcIiwgXCIwXCI6IFwiMFwifTtcbiAgdmFyIG51bWJlclJlID0gL15cXHMqXFxkKy87XG4gIHZhciBwZXJjZW50UmUgPSAvXiUvO1xuICB2YXIgcmVxdW90ZVJlID0gL1tcXFxcXFxeXFwkXFwqXFwrXFw/XFx8XFxbXFxdXFwoXFwpXFwuXFx7XFx9XS9nO1xuXG4gIGZ1bmN0aW9uIHBhZCh2YWx1ZSwgZmlsbCwgd2lkdGgpIHtcbiAgICB2YXIgc2lnbiA9IHZhbHVlIDwgMCA/IFwiLVwiIDogXCJcIixcbiAgICAgICAgc3RyaW5nID0gKHNpZ24gPyAtdmFsdWUgOiB2YWx1ZSkgKyBcIlwiLFxuICAgICAgICBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHJldHVybiBzaWduICsgKGxlbmd0aCA8IHdpZHRoID8gbmV3IEFycmF5KHdpZHRoIC0gbGVuZ3RoICsgMSkuam9pbihmaWxsKSArIHN0cmluZyA6IHN0cmluZyk7XG4gIH1cblxuICBmdW5jdGlvbiByZXF1b3RlKHMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKHJlcXVvdGVSZSwgXCJcXFxcJCZcIik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRSZShuYW1lcykge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKFwiXig/OlwiICsgbmFtZXMubWFwKHJlcXVvdGUpLmpvaW4oXCJ8XCIpICsgXCIpXCIsIFwiaVwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdExvb2t1cChuYW1lcykge1xuICAgIHZhciBtYXAgPSBuZXcgTWFwLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIG1hcC5zZXQobmFtZXNbaV0udG9Mb3dlckNhc2UoKSwgaSk7XG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlV2Vla2RheU51bWJlcihkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAxKSk7XG4gICAgcmV0dXJuIG4gPyAoZC53ID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlV2Vla051bWJlclN1bmRheShkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICByZXR1cm4gbiA/IChkLlUgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VXZWVrTnVtYmVyTW9uZGF5KGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgIHJldHVybiBuID8gKGQuVyA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUZ1bGxZZWFyKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDQpKTtcbiAgICByZXR1cm4gbiA/IChkLnkgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VZZWFyKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgICByZXR1cm4gbiA/IChkLnkgPSArblswXSArICgrblswXSA+IDY4ID8gMTkwMCA6IDIwMDApLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVpvbmUoZCwgc3RyaW5nLCBpKSB7XG4gICAgcmV0dXJuIC9eWystXVxcZHs0fSQvLnRlc3Qoc3RyaW5nID0gc3RyaW5nLnNsaWNlKGksIGkgKyA1KSlcbiAgICAgICAgPyAoZC5aID0gLXN0cmluZywgaSArIDUpIC8vIHNpZ24gZGlmZmVycyBmcm9tIGdldFRpbWV6b25lT2Zmc2V0IVxuICAgICAgICA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VNb250aE51bWJlcihkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5tID0gblswXSAtIDEsIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlRGF5T2ZNb250aChkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5kID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlRGF5T2ZZZWFyKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDMpKTtcbiAgICByZXR1cm4gbiA/IChkLm0gPSAwLCBkLmQgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VIb3VyMjQoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICAgIHJldHVybiBuID8gKGQuSCA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZU1pbnV0ZXMoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICAgIHJldHVybiBuID8gKGQuTSA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVNlY29uZHMoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICAgIHJldHVybiBuID8gKGQuUyA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZU1pbGxpc2Vjb25kcyhkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAzKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5MID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlTGl0ZXJhbFBlcmNlbnQoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBwZXJjZW50UmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDEpKTtcbiAgICByZXR1cm4gbiA/IGkgKyBuWzBdLmxlbmd0aCA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0RGF5T2ZNb250aChkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldERhdGUoKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRIb3VyMjQoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRIb3VycygpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdEhvdXIxMihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldEhvdXJzKCkgJSAxMiB8fCAxMiwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXREYXlPZlllYXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoMSArIGRheS5jb3VudCh5ZWFyKGQpLCBkKSwgcCwgMyk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRNaWxsaXNlY29uZHMoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRNaWxsaXNlY29uZHMoKSwgcCwgMyk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRNb250aE51bWJlcihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldE1vbnRoKCkgKyAxLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdE1pbnV0ZXMoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRNaW51dGVzKCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0U2Vjb25kcyhkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldFNlY29uZHMoKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRXZWVrTnVtYmVyU3VuZGF5KGQsIHApIHtcbiAgICByZXR1cm4gcGFkKHN1bmRheS5jb3VudCh5ZWFyKGQpLCBkKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRXZWVrZGF5TnVtYmVyKGQpIHtcbiAgICByZXR1cm4gZC5nZXREYXkoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFdlZWtOdW1iZXJNb25kYXkoZCwgcCkge1xuICAgIHJldHVybiBwYWQobW9uZGF5LmNvdW50KHllYXIoZCksIGQpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFllYXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRGdWxsWWVhcigpICUgMTAwLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdEZ1bGxZZWFyKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0RnVsbFllYXIoKSAlIDEwMDAwLCBwLCA0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFpvbmUoZCkge1xuICAgIHZhciB6ID0gZC5nZXRUaW1lem9uZU9mZnNldCgpO1xuICAgIHJldHVybiAoeiA+IDAgPyBcIi1cIiA6ICh6ICo9IC0xLCBcIitcIikpXG4gICAgICAgICsgcGFkKHogLyA2MCB8IDAsIFwiMFwiLCAyKVxuICAgICAgICArIHBhZCh6ICUgNjAsIFwiMFwiLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ0RheU9mTW9udGgoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENEYXRlKCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDSG91cjI0KGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0VVRDSG91cnMoKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENIb3VyMTIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENIb3VycygpICUgMTIgfHwgMTIsIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDRGF5T2ZZZWFyKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKDEgKyB1dGNEYXkuY291bnQodXRjWWVhcihkKSwgZCksIHAsIDMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDTWlsbGlzZWNvbmRzKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0VVRDTWlsbGlzZWNvbmRzKCksIHAsIDMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDTW9udGhOdW1iZXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENNb250aCgpICsgMSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENNaW51dGVzKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0VVRDTWludXRlcygpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ1NlY29uZHMoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENTZWNvbmRzKCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDV2Vla051bWJlclN1bmRheShkLCBwKSB7XG4gICAgcmV0dXJuIHBhZCh1dGNTdW5kYXkuY291bnQodXRjWWVhcihkKSwgZCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDV2Vla2RheU51bWJlcihkKSB7XG4gICAgcmV0dXJuIGQuZ2V0VVRDRGF5KCk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENXZWVrTnVtYmVyTW9uZGF5KGQsIHApIHtcbiAgICByZXR1cm4gcGFkKHV0Y01vbmRheS5jb3VudCh1dGNZZWFyKGQpLCBkKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENZZWFyKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0VVRDRnVsbFllYXIoKSAlIDEwMCwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENGdWxsWWVhcihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldFVUQ0Z1bGxZZWFyKCkgJSAxMDAwMCwgcCwgNCk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENab25lKCkge1xuICAgIHJldHVybiBcIiswMDAwXCI7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRMaXRlcmFsUGVyY2VudCgpIHtcbiAgICByZXR1cm4gXCIlXCI7XG4gIH1cblxuICB2YXIgaXNvU3BlY2lmaWVyID0gXCIlWS0lbS0lZFQlSDolTTolUy4lTFpcIjtcblxuICBmdW5jdGlvbiBmb3JtYXRJc29OYXRpdmUoZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCk7XG4gIH1cblxuICBmb3JtYXRJc29OYXRpdmUucGFyc2UgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHN0cmluZyk7XG4gICAgcmV0dXJuIGlzTmFOKGRhdGUpID8gbnVsbCA6IGRhdGU7XG4gIH07XG5cbiAgZm9ybWF0SXNvTmF0aXZlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGlzb1NwZWNpZmllcjtcbiAgfTtcblxuICB2YXIgZm9ybWF0SXNvID0gRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcgJiYgK25ldyBEYXRlKFwiMjAwMC0wMS0wMVQwMDowMDowMC4wMDBaXCIpXG4gICAgICA/IGZvcm1hdElzb05hdGl2ZVxuICAgICAgOiBlblVzLnV0Y0Zvcm1hdChpc29TcGVjaWZpZXIpO1xuXG4gIHZhciBpc29Gb3JtYXQgPSBmb3JtYXRJc287XG5cbiAgdmFyIGxvY2FsZURlZmluaXRpb25zID0gKG5ldyBNYXApXG4gICAgICAuc2V0KFwiY2EtRVNcIiwgY2FFcylcbiAgICAgIC5zZXQoXCJkZS1ERVwiLCBkZURlKVxuICAgICAgLnNldChcImVuLUNBXCIsIGVuQ2EpXG4gICAgICAuc2V0KFwiZW4tR0JcIiwgZW5HYilcbiAgICAgIC5zZXQoXCJlbi1VU1wiLCBlblVzKVxuICAgICAgLnNldChcImVzLUVTXCIsIGVzRXMpXG4gICAgICAuc2V0KFwiZmktRklcIiwgZmlGaSlcbiAgICAgIC5zZXQoXCJmci1DQVwiLCBmckNhKVxuICAgICAgLnNldChcImZyLUZSXCIsIGZyRnIpXG4gICAgICAuc2V0KFwiaGUtSUxcIiwgaGVJbClcbiAgICAgIC5zZXQoXCJpdC1JVFwiLCBpdEl0KVxuICAgICAgLnNldChcIm1rLU1LXCIsIG1rTWspXG4gICAgICAuc2V0KFwibmwtTkxcIiwgbmxObClcbiAgICAgIC5zZXQoXCJwbC1QTFwiLCBwbFBsKVxuICAgICAgLnNldChcInB0LUJSXCIsIHB0QnIpXG4gICAgICAuc2V0KFwicnUtUlVcIiwgcnVSdSlcbiAgICAgIC5zZXQoXCJ6aC1DTlwiLCB6aENuKTtcblxuICB2YXIgZGVmYXVsdExvY2FsZSA9IGxvY2FsZShlblVzKTtcbiAgZXhwb3J0cy5mb3JtYXQgPSBkZWZhdWx0TG9jYWxlLmZvcm1hdDtcbiAgZXhwb3J0cy51dGNGb3JtYXQgPSBkZWZhdWx0TG9jYWxlLnV0Y0Zvcm1hdDtcblxuICBmdW5jdGlvbiBsb2NhbGVGb3JtYXQoZGVmaW5pdGlvbikge1xuICAgIGlmICh0eXBlb2YgZGVmaW5pdGlvbiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgZGVmaW5pdGlvbiA9IGxvY2FsZURlZmluaXRpb25zLmdldChkZWZpbml0aW9uKTtcbiAgICAgIGlmICghZGVmaW5pdGlvbikgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBsb2NhbGUoZGVmaW5pdGlvbik7XG4gIH1cbiAgO1xuXG4gIGV4cG9ydHMubG9jYWxlRm9ybWF0ID0gbG9jYWxlRm9ybWF0O1xuICBleHBvcnRzLmlzb0Zvcm1hdCA9IGlzb0Zvcm1hdDtcblxufSkpOyIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgZmFjdG9yeSgoZ2xvYmFsLnRpbWUgPSB7fSkpO1xufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgdmFyIHQxID0gbmV3IERhdGU7XG5cbiAgdmFyIHQwID0gbmV3IERhdGU7XG5cbiAgZnVuY3Rpb24gbmV3SW50ZXJ2YWwoZmxvb3JpLCBvZmZzZXRpLCBjb3VudCkge1xuXG4gICAgZnVuY3Rpb24gaW50ZXJ2YWwoZGF0ZSkge1xuICAgICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoK2RhdGUpKSwgZGF0ZTtcbiAgICB9XG5cbiAgICBpbnRlcnZhbC5mbG9vciA9IGludGVydmFsO1xuXG4gICAgaW50ZXJ2YWwucm91bmQgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICB2YXIgZDAgPSBuZXcgRGF0ZSgrZGF0ZSksXG4gICAgICAgICAgZDEgPSBuZXcgRGF0ZShkYXRlIC0gMSk7XG4gICAgICBmbG9vcmkoZDApLCBmbG9vcmkoZDEpLCBvZmZzZXRpKGQxLCAxKTtcbiAgICAgIHJldHVybiBkYXRlIC0gZDAgPCBkMSAtIGRhdGUgPyBkMCA6IGQxO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5jZWlsID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoZGF0ZSAtIDEpKSwgb2Zmc2V0aShkYXRlLCAxKSwgZGF0ZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwub2Zmc2V0ID0gZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgcmV0dXJuIG9mZnNldGkoZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKSwgc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCkpLCBkYXRlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgICB2YXIgcmFuZ2UgPSBbXTtcbiAgICAgIHN0YXJ0ID0gbmV3IERhdGUoc3RhcnQgLSAxKTtcbiAgICAgIHN0b3AgPSBuZXcgRGF0ZSgrc3RvcCk7XG4gICAgICBzdGVwID0gc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCk7XG4gICAgICBpZiAoIShzdGFydCA8IHN0b3ApIHx8ICEoc3RlcCA+IDApKSByZXR1cm4gcmFuZ2U7IC8vIGFsc28gaGFuZGxlcyBJbnZhbGlkIERhdGVcbiAgICAgIG9mZnNldGkoc3RhcnQsIDEpLCBmbG9vcmkoc3RhcnQpO1xuICAgICAgaWYgKHN0YXJ0IDwgc3RvcCkgcmFuZ2UucHVzaChuZXcgRGF0ZSgrc3RhcnQpKTtcbiAgICAgIHdoaWxlIChvZmZzZXRpKHN0YXJ0LCBzdGVwKSwgZmxvb3JpKHN0YXJ0KSwgc3RhcnQgPCBzdG9wKSByYW5nZS5wdXNoKG5ldyBEYXRlKCtzdGFydCkpO1xuICAgICAgcmV0dXJuIHJhbmdlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5maWx0ZXIgPSBmdW5jdGlvbih0ZXN0KSB7XG4gICAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICB3aGlsZSAoZmxvb3JpKGRhdGUpLCAhdGVzdChkYXRlKSkgZGF0ZS5zZXRUaW1lKGRhdGUgLSAxKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgICAgd2hpbGUgKC0tc3RlcCA+PSAwKSB3aGlsZSAob2Zmc2V0aShkYXRlLCAxKSwgIXRlc3QoZGF0ZSkpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmIChjb3VudCkgaW50ZXJ2YWwuY291bnQgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICB0MC5zZXRUaW1lKCtzdGFydCksIHQxLnNldFRpbWUoK2VuZCk7XG4gICAgICBmbG9vcmkodDApLCBmbG9vcmkodDEpO1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoY291bnQodDAsIHQxKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBpbnRlcnZhbDtcbiAgfVxuXG4gIHZhciBzZWNvbmQgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRNaWxsaXNlY29uZHMoMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMWUzKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMWUzO1xuICB9KTtcblxuICBleHBvcnRzLnNlY29uZHMgPSBzZWNvbmQucmFuZ2U7XG5cbiAgdmFyIG1pbnV0ZSA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFNlY29uZHMoMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogNmU0KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gNmU0O1xuICB9KTtcblxuICBleHBvcnRzLm1pbnV0ZXMgPSBtaW51dGUucmFuZ2U7XG5cbiAgdmFyIGhvdXIgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRNaW51dGVzKDAsIDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDM2ZTUpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyAzNmU1O1xuICB9KTtcblxuICBleHBvcnRzLmhvdXJzID0gaG91ci5yYW5nZTtcblxuICB2YXIgZGF5ID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQgLSAoZW5kLmdldFRpbWV6b25lT2Zmc2V0KCkgLSBzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpKSAqIDZlNCkgLyA4NjRlNTtcbiAgfSk7XG5cbiAgZXhwb3J0cy5kYXlzID0gZGF5LnJhbmdlO1xuXG4gIGZ1bmN0aW9uIHdlZWtkYXkoaSkge1xuICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gKGRhdGUuZ2V0RGF5KCkgKyA3IC0gaSkgJSA3KTtcbiAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyBzdGVwICogNyk7XG4gICAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgcmV0dXJuIChlbmQgLSBzdGFydCAtIChlbmQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNmU0KSAvIDYwNDhlNTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuc3VuZGF5ID0gd2Vla2RheSgwKTtcblxuICBleHBvcnRzLnN1bmRheXMgPSBleHBvcnRzLnN1bmRheS5yYW5nZTtcblxuICBleHBvcnRzLm1vbmRheSA9IHdlZWtkYXkoMSk7XG5cbiAgZXhwb3J0cy5tb25kYXlzID0gZXhwb3J0cy5tb25kYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy50dWVzZGF5ID0gd2Vla2RheSgyKTtcblxuICBleHBvcnRzLnR1ZXNkYXlzID0gZXhwb3J0cy50dWVzZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMud2VkbmVzZGF5ID0gd2Vla2RheSgzKTtcblxuICBleHBvcnRzLndlZG5lc2RheXMgPSBleHBvcnRzLndlZG5lc2RheS5yYW5nZTtcblxuICBleHBvcnRzLnRodXJzZGF5ID0gd2Vla2RheSg0KTtcblxuICBleHBvcnRzLnRodXJzZGF5cyA9IGV4cG9ydHMudGh1cnNkYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy5mcmlkYXkgPSB3ZWVrZGF5KDUpO1xuXG4gIGV4cG9ydHMuZnJpZGF5cyA9IGV4cG9ydHMuZnJpZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMuc2F0dXJkYXkgPSB3ZWVrZGF5KDYpO1xuXG4gIGV4cG9ydHMuc2F0dXJkYXlzID0gZXhwb3J0cy5zYXR1cmRheS5yYW5nZTtcblxuICB2YXIgd2VlayA9IGV4cG9ydHMuc3VuZGF5O1xuXG4gIGV4cG9ydHMud2Vla3MgPSB3ZWVrLnJhbmdlO1xuXG4gIHZhciBtb250aCA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0RGF0ZSgxKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZW5kLmdldE1vbnRoKCkgLSBzdGFydC5nZXRNb250aCgpICsgKGVuZC5nZXRGdWxsWWVhcigpIC0gc3RhcnQuZ2V0RnVsbFllYXIoKSkgKiAxMjtcbiAgfSk7XG5cbiAgZXhwb3J0cy5tb250aHMgPSBtb250aC5yYW5nZTtcblxuICB2YXIgeWVhciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0TW9udGgoMCwgMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRGdWxsWWVhcigpIC0gc3RhcnQuZ2V0RnVsbFllYXIoKTtcbiAgfSk7XG5cbiAgZXhwb3J0cy55ZWFycyA9IHllYXIucmFuZ2U7XG5cbiAgdmFyIHV0Y1NlY29uZCA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ01pbGxpc2Vjb25kcygwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiAxZTMpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyAxZTM7XG4gIH0pO1xuXG4gIGV4cG9ydHMudXRjU2Vjb25kcyA9IHV0Y1NlY29uZC5yYW5nZTtcblxuICB2YXIgdXRjTWludXRlID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDU2Vjb25kcygwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiA2ZTQpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA2ZTQ7XG4gIH0pO1xuXG4gIGV4cG9ydHMudXRjTWludXRlcyA9IHV0Y01pbnV0ZS5yYW5nZTtcblxuICB2YXIgdXRjSG91ciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ01pbnV0ZXMoMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMzZlNSk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDM2ZTU7XG4gIH0pO1xuXG4gIGV4cG9ydHMudXRjSG91cnMgPSB1dGNIb3VyLnJhbmdlO1xuXG4gIHZhciB1dGNEYXkgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA4NjRlNTtcbiAgfSk7XG5cbiAgZXhwb3J0cy51dGNEYXlzID0gdXRjRGF5LnJhbmdlO1xuXG4gIGZ1bmN0aW9uIHV0Y1dlZWtkYXkoaSkge1xuICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpIC0gKGRhdGUuZ2V0VVRDRGF5KCkgKyA3IC0gaSkgJSA3KTtcbiAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgKyBzdGVwICogNyk7XG4gICAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA2MDQ4ZTU7XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLnV0Y1N1bmRheSA9IHV0Y1dlZWtkYXkoMCk7XG5cbiAgZXhwb3J0cy51dGNTdW5kYXlzID0gZXhwb3J0cy51dGNTdW5kYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy51dGNNb25kYXkgPSB1dGNXZWVrZGF5KDEpO1xuXG4gIGV4cG9ydHMudXRjTW9uZGF5cyA9IGV4cG9ydHMudXRjTW9uZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMudXRjVHVlc2RheSA9IHV0Y1dlZWtkYXkoMik7XG5cbiAgZXhwb3J0cy51dGNUdWVzZGF5cyA9IGV4cG9ydHMudXRjVHVlc2RheS5yYW5nZTtcblxuICBleHBvcnRzLnV0Y1dlZG5lc2RheSA9IHV0Y1dlZWtkYXkoMyk7XG5cbiAgZXhwb3J0cy51dGNXZWRuZXNkYXlzID0gZXhwb3J0cy51dGNXZWRuZXNkYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy51dGNUaHVyc2RheSA9IHV0Y1dlZWtkYXkoNCk7XG5cbiAgZXhwb3J0cy51dGNUaHVyc2RheXMgPSBleHBvcnRzLnV0Y1RodXJzZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMudXRjRnJpZGF5ID0gdXRjV2Vla2RheSg1KTtcblxuICBleHBvcnRzLnV0Y0ZyaWRheXMgPSBleHBvcnRzLnV0Y0ZyaWRheS5yYW5nZTtcblxuICBleHBvcnRzLnV0Y1NhdHVyZGF5ID0gdXRjV2Vla2RheSg2KTtcblxuICBleHBvcnRzLnV0Y1NhdHVyZGF5cyA9IGV4cG9ydHMudXRjU2F0dXJkYXkucmFuZ2U7XG5cbiAgdmFyIHV0Y1dlZWsgPSBleHBvcnRzLnV0Y1N1bmRheTtcblxuICBleHBvcnRzLnV0Y1dlZWtzID0gdXRjV2Vlay5yYW5nZTtcblxuICB2YXIgdXRjTW9udGggPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldFVUQ0RhdGUoMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ01vbnRoKGRhdGUuZ2V0VVRDTW9udGgoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRVVENNb250aCgpIC0gc3RhcnQuZ2V0VVRDTW9udGgoKSArIChlbmQuZ2V0VVRDRnVsbFllYXIoKSAtIHN0YXJ0LmdldFVUQ0Z1bGxZZWFyKCkpICogMTI7XG4gIH0pO1xuXG4gIGV4cG9ydHMudXRjTW9udGhzID0gdXRjTW9udGgucmFuZ2U7XG5cbiAgdmFyIHV0Y1llYXIgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldFVUQ01vbnRoKDAsIDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRVVENGdWxsWWVhcihkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0VVRDRnVsbFllYXIoKSAtIHN0YXJ0LmdldFVUQ0Z1bGxZZWFyKCk7XG4gIH0pO1xuXG4gIGV4cG9ydHMudXRjWWVhcnMgPSB1dGNZZWFyLnJhbmdlO1xuXG4gIGV4cG9ydHMuaW50ZXJ2YWwgPSBuZXdJbnRlcnZhbDtcbiAgZXhwb3J0cy5zZWNvbmQgPSBzZWNvbmQ7XG4gIGV4cG9ydHMubWludXRlID0gbWludXRlO1xuICBleHBvcnRzLmhvdXIgPSBob3VyO1xuICBleHBvcnRzLmRheSA9IGRheTtcbiAgZXhwb3J0cy53ZWVrID0gd2VlaztcbiAgZXhwb3J0cy5tb250aCA9IG1vbnRoO1xuICBleHBvcnRzLnllYXIgPSB5ZWFyO1xuICBleHBvcnRzLnV0Y1NlY29uZCA9IHV0Y1NlY29uZDtcbiAgZXhwb3J0cy51dGNNaW51dGUgPSB1dGNNaW51dGU7XG4gIGV4cG9ydHMudXRjSG91ciA9IHV0Y0hvdXI7XG4gIGV4cG9ydHMudXRjRGF5ID0gdXRjRGF5O1xuICBleHBvcnRzLnV0Y1dlZWsgPSB1dGNXZWVrO1xuICBleHBvcnRzLnV0Y01vbnRoID0gdXRjTW9udGg7XG4gIGV4cG9ydHMudXRjWWVhciA9IHV0Y1llYXI7XG5cbn0pKTsiLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgICB0aW1lID0gcmVxdWlyZSgnLi4vdGltZScpLFxuICAgIEVQU0lMT04gPSAxZS0xNTtcblxuZnVuY3Rpb24gYmlucyhvcHQpIHtcbiAgaWYgKCFvcHQpIHsgdGhyb3cgRXJyb3IoXCJNaXNzaW5nIGJpbm5pbmcgb3B0aW9ucy5cIik7IH1cblxuICAvLyBkZXRlcm1pbmUgcmFuZ2VcbiAgdmFyIG1heGIgPSBvcHQubWF4YmlucyB8fCAxNSxcbiAgICAgIGJhc2UgPSBvcHQuYmFzZSB8fCAxMCxcbiAgICAgIGxvZ2IgPSBNYXRoLmxvZyhiYXNlKSxcbiAgICAgIGRpdiA9IG9wdC5kaXYgfHwgWzUsIDJdLCAgICAgIFxuICAgICAgbWluID0gb3B0Lm1pbixcbiAgICAgIG1heCA9IG9wdC5tYXgsXG4gICAgICBzcGFuID0gbWF4IC0gbWluLFxuICAgICAgc3RlcCwgbGV2ZWwsIG1pbnN0ZXAsIHByZWNpc2lvbiwgdiwgaSwgZXBzO1xuXG4gIGlmIChvcHQuc3RlcCkge1xuICAgIC8vIGlmIHN0ZXAgc2l6ZSBpcyBleHBsaWNpdGx5IGdpdmVuLCB1c2UgdGhhdFxuICAgIHN0ZXAgPSBvcHQuc3RlcDtcbiAgfSBlbHNlIGlmIChvcHQuc3RlcHMpIHtcbiAgICAvLyBpZiBwcm92aWRlZCwgbGltaXQgY2hvaWNlIHRvIGFjY2VwdGFibGUgc3RlcCBzaXplc1xuICAgIHN0ZXAgPSBvcHQuc3RlcHNbTWF0aC5taW4oXG4gICAgICBvcHQuc3RlcHMubGVuZ3RoIC0gMSxcbiAgICAgIGJpc2VjdChvcHQuc3RlcHMsIHNwYW4vbWF4YiwgMCwgb3B0LnN0ZXBzLmxlbmd0aClcbiAgICApXTtcbiAgfSBlbHNlIHtcbiAgICAvLyBlbHNlIHVzZSBzcGFuIHRvIGRldGVybWluZSBzdGVwIHNpemVcbiAgICBsZXZlbCA9IE1hdGguY2VpbChNYXRoLmxvZyhtYXhiKSAvIGxvZ2IpO1xuICAgIG1pbnN0ZXAgPSBvcHQubWluc3RlcCB8fCAwO1xuICAgIHN0ZXAgPSBNYXRoLm1heChcbiAgICAgIG1pbnN0ZXAsXG4gICAgICBNYXRoLnBvdyhiYXNlLCBNYXRoLnJvdW5kKE1hdGgubG9nKHNwYW4pIC8gbG9nYikgLSBsZXZlbClcbiAgICApO1xuICAgIFxuICAgIC8vIGluY3JlYXNlIHN0ZXAgc2l6ZSBpZiB0b28gbWFueSBiaW5zXG4gICAgZG8geyBzdGVwICo9IGJhc2U7IH0gd2hpbGUgKE1hdGguY2VpbChzcGFuL3N0ZXApID4gbWF4Yik7XG5cbiAgICAvLyBkZWNyZWFzZSBzdGVwIHNpemUgaWYgYWxsb3dlZFxuICAgIGZvciAoaT0wOyBpPGRpdi5sZW5ndGg7ICsraSkge1xuICAgICAgdiA9IHN0ZXAgLyBkaXZbaV07XG4gICAgICBpZiAodiA+PSBtaW5zdGVwICYmIHNwYW4gLyB2IDw9IG1heGIpIHN0ZXAgPSB2O1xuICAgIH1cbiAgfVxuXG4gIC8vIHVwZGF0ZSBwcmVjaXNpb24sIG1pbiBhbmQgbWF4XG4gIHYgPSBNYXRoLmxvZyhzdGVwKTtcbiAgcHJlY2lzaW9uID0gdiA+PSAwID8gMCA6IH5+KC12IC8gbG9nYikgKyAxO1xuICBlcHMgPSBNYXRoLnBvdyhiYXNlLCAtcHJlY2lzaW9uIC0gMSk7XG4gIG1pbiA9IE1hdGgubWluKG1pbiwgTWF0aC5mbG9vcihtaW4gLyBzdGVwICsgZXBzKSAqIHN0ZXApO1xuICBtYXggPSBNYXRoLmNlaWwobWF4IC8gc3RlcCkgKiBzdGVwO1xuXG4gIHJldHVybiB7XG4gICAgc3RhcnQ6IG1pbixcbiAgICBzdG9wOiAgbWF4LFxuICAgIHN0ZXA6ICBzdGVwLFxuICAgIHVuaXQ6ICB7cHJlY2lzaW9uOiBwcmVjaXNpb259LFxuICAgIHZhbHVlOiB2YWx1ZSxcbiAgICBpbmRleDogaW5kZXhcbiAgfTtcbn1cblxuZnVuY3Rpb24gYmlzZWN0KGEsIHgsIGxvLCBoaSkge1xuICB3aGlsZSAobG8gPCBoaSkge1xuICAgIHZhciBtaWQgPSBsbyArIGhpID4+PiAxO1xuICAgIGlmICh1dGlsLmNtcChhW21pZF0sIHgpIDwgMCkgeyBsbyA9IG1pZCArIDE7IH1cbiAgICBlbHNlIHsgaGkgPSBtaWQ7IH1cbiAgfVxuICByZXR1cm4gbG87XG59XG5cbmZ1bmN0aW9uIHZhbHVlKHYpIHtcbiAgcmV0dXJuIHRoaXMuc3RlcCAqIE1hdGguZmxvb3IodiAvIHRoaXMuc3RlcCArIEVQU0lMT04pO1xufVxuXG5mdW5jdGlvbiBpbmRleCh2KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKCh2IC0gdGhpcy5zdGFydCkgLyB0aGlzLnN0ZXAgKyBFUFNJTE9OKTtcbn1cblxuZnVuY3Rpb24gZGF0ZV92YWx1ZSh2KSB7XG4gIHJldHVybiB0aGlzLnVuaXQuZGF0ZSh2YWx1ZS5jYWxsKHRoaXMsIHYpKTtcbn1cblxuZnVuY3Rpb24gZGF0ZV9pbmRleCh2KSB7XG4gIHJldHVybiBpbmRleC5jYWxsKHRoaXMsIHRoaXMudW5pdC51bml0KHYpKTtcbn1cblxuYmlucy5kYXRlID0gZnVuY3Rpb24ob3B0KSB7XG4gIGlmICghb3B0KSB7IHRocm93IEVycm9yKFwiTWlzc2luZyBkYXRlIGJpbm5pbmcgb3B0aW9ucy5cIik7IH1cblxuICAvLyBmaW5kIHRpbWUgc3RlcCwgdGhlbiBiaW5cbiAgdmFyIHVuaXRzID0gb3B0LnV0YyA/IHRpbWUudXRjIDogdGltZSxcbiAgICAgIGRtaW4gPSBvcHQubWluLFxuICAgICAgZG1heCA9IG9wdC5tYXgsXG4gICAgICBtYXhiID0gb3B0Lm1heGJpbnMgfHwgMjAsXG4gICAgICBtaW5iID0gb3B0Lm1pbmJpbnMgfHwgNCxcbiAgICAgIHNwYW4gPSAoK2RtYXgpIC0gKCtkbWluKSxcbiAgICAgIHVuaXQgPSBvcHQudW5pdCA/IHVuaXRzW29wdC51bml0XSA6IHVuaXRzLmZpbmQoc3BhbiwgbWluYiwgbWF4YiksXG4gICAgICBzcGVjID0gYmlucyh7XG4gICAgICAgIG1pbjogICAgIHVuaXQubWluICE9IG51bGwgPyB1bml0Lm1pbiA6IHVuaXQudW5pdChkbWluKSxcbiAgICAgICAgbWF4OiAgICAgdW5pdC5tYXggIT0gbnVsbCA/IHVuaXQubWF4IDogdW5pdC51bml0KGRtYXgpLFxuICAgICAgICBtYXhiaW5zOiBtYXhiLFxuICAgICAgICBtaW5zdGVwOiB1bml0Lm1pbnN0ZXAsXG4gICAgICAgIHN0ZXBzOiAgIHVuaXQuc3RlcFxuICAgICAgfSk7XG5cbiAgc3BlYy51bml0ID0gdW5pdDtcbiAgc3BlYy5pbmRleCA9IGRhdGVfaW5kZXg7XG4gIGlmICghb3B0LnJhdykgc3BlYy52YWx1ZSA9IGRhdGVfdmFsdWU7XG4gIHJldHVybiBzcGVjO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBiaW5zO1xuIiwidmFyIGdlbiA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmdlbi5yZXBlYXQgPSBmdW5jdGlvbih2YWwsIG4pIHtcbiAgdmFyIGEgPSBBcnJheShuKSwgaTtcbiAgZm9yIChpPTA7IGk8bjsgKytpKSBhW2ldID0gdmFsO1xuICByZXR1cm4gYTtcbn07XG5cbmdlbi56ZXJvcyA9IGZ1bmN0aW9uKG4pIHtcbiAgcmV0dXJuIGdlbi5yZXBlYXQoMCwgbik7XG59O1xuXG5nZW4ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICBzdGVwID0gMTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHN0b3AgPSBzdGFydDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gIH1cbiAgaWYgKChzdG9wIC0gc3RhcnQpIC8gc3RlcCA9PSBJbmZpbml0eSkgdGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSByYW5nZScpO1xuICB2YXIgcmFuZ2UgPSBbXSwgaSA9IC0xLCBqO1xuICBpZiAoc3RlcCA8IDApIHdoaWxlICgoaiA9IHN0YXJ0ICsgc3RlcCAqICsraSkgPiBzdG9wKSByYW5nZS5wdXNoKGopO1xuICBlbHNlIHdoaWxlICgoaiA9IHN0YXJ0ICsgc3RlcCAqICsraSkgPCBzdG9wKSByYW5nZS5wdXNoKGopO1xuICByZXR1cm4gcmFuZ2U7XG59O1xuXG5nZW4ucmFuZG9tID0ge307XG5cbmdlbi5yYW5kb20udW5pZm9ybSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gIGlmIChtYXggPT09IHVuZGVmaW5lZCkge1xuICAgIG1heCA9IG1pbiA9PT0gdW5kZWZpbmVkID8gMSA6IG1pbjtcbiAgICBtaW4gPSAwO1xuICB9XG4gIHZhciBkID0gbWF4IC0gbWluO1xuICB2YXIgZiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBtaW4gKyBkICogTWF0aC5yYW5kb20oKTtcbiAgfTtcbiAgZi5zYW1wbGVzID0gZnVuY3Rpb24obikgeyByZXR1cm4gZ2VuLnplcm9zKG4pLm1hcChmKTsgfTtcbiAgcmV0dXJuIGY7XG59O1xuXG5nZW4ucmFuZG9tLmludGVnZXIgPSBmdW5jdGlvbihhLCBiKSB7XG4gIGlmIChiID09PSB1bmRlZmluZWQpIHtcbiAgICBiID0gYTtcbiAgICBhID0gMDtcbiAgfVxuICB2YXIgZCA9IGIgLSBhO1xuICB2YXIgZiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBhICsgTWF0aC5mbG9vcihkICogTWF0aC5yYW5kb20oKSk7XG4gIH07XG4gIGYuc2FtcGxlcyA9IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIGdlbi56ZXJvcyhuKS5tYXAoZik7IH07XG4gIHJldHVybiBmO1xufTtcblxuZ2VuLnJhbmRvbS5ub3JtYWwgPSBmdW5jdGlvbihtZWFuLCBzdGRldikge1xuICBtZWFuID0gbWVhbiB8fCAwO1xuICBzdGRldiA9IHN0ZGV2IHx8IDE7XG4gIHZhciBuZXh0O1xuICB2YXIgZiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB4ID0gMCwgeSA9IDAsIHJkcywgYztcbiAgICBpZiAobmV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB4ID0gbmV4dDtcbiAgICAgIG5leHQgPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4geDtcbiAgICB9XG4gICAgZG8ge1xuICAgICAgeCA9IE1hdGgucmFuZG9tKCkqMi0xO1xuICAgICAgeSA9IE1hdGgucmFuZG9tKCkqMi0xO1xuICAgICAgcmRzID0geCp4ICsgeSp5O1xuICAgIH0gd2hpbGUgKHJkcyA9PT0gMCB8fCByZHMgPiAxKTtcbiAgICBjID0gTWF0aC5zcXJ0KC0yKk1hdGgubG9nKHJkcykvcmRzKTsgLy8gQm94LU11bGxlciB0cmFuc2Zvcm1cbiAgICBuZXh0ID0gbWVhbiArIHkqYypzdGRldjtcbiAgICByZXR1cm4gbWVhbiArIHgqYypzdGRldjtcbiAgfTtcbiAgZi5zYW1wbGVzID0gZnVuY3Rpb24obikgeyByZXR1cm4gZ2VuLnplcm9zKG4pLm1hcChmKTsgfTtcbiAgcmV0dXJuIGY7XG59OyIsInZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgVFlQRVMgPSAnX190eXBlc19fJztcblxudmFyIFBBUlNFUlMgPSB7XG4gIGJvb2xlYW46IHV0aWwuYm9vbGVhbixcbiAgaW50ZWdlcjogdXRpbC5udW1iZXIsXG4gIG51bWJlcjogIHV0aWwubnVtYmVyLFxuICBkYXRlOiAgICB1dGlsLmRhdGUsXG4gIHN0cmluZzogIGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHg9PT0nJyA/IG51bGwgOiB4OyB9XG59O1xuXG52YXIgVEVTVFMgPSB7XG4gIGJvb2xlYW46IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHg9PT0ndHJ1ZScgfHwgeD09PSdmYWxzZScgfHwgdXRpbC5pc0Jvb2xlYW4oeCk7IH0sXG4gIGludGVnZXI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIFRFU1RTLm51bWJlcih4KSAmJiAoeD0reCkgPT09IH5+eDsgfSxcbiAgbnVtYmVyOiBmdW5jdGlvbih4KSB7IHJldHVybiAhaXNOYU4oK3gpICYmICF1dGlsLmlzRGF0ZSh4KTsgfSxcbiAgZGF0ZTogZnVuY3Rpb24oeCkgeyByZXR1cm4gIWlzTmFOKERhdGUucGFyc2UoeCkpOyB9XG59O1xuXG5mdW5jdGlvbiBhbm5vdGF0aW9uKGRhdGEsIHR5cGVzKSB7XG4gIGlmICghdHlwZXMpIHJldHVybiBkYXRhICYmIGRhdGFbVFlQRVNdIHx8IG51bGw7XG4gIGRhdGFbVFlQRVNdID0gdHlwZXM7XG59XG5cbmZ1bmN0aW9uIHR5cGUodmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciB2LCBpLCBuO1xuXG4gIC8vIGlmIGRhdGEgYXJyYXkgaGFzIHR5cGUgYW5ub3RhdGlvbnMsIHVzZSB0aGVtXG4gIGlmICh2YWx1ZXNbVFlQRVNdKSB7XG4gICAgdiA9IGYodmFsdWVzW1RZUEVTXSk7XG4gICAgaWYgKHV0aWwuaXNTdHJpbmcodikpIHJldHVybiB2O1xuICB9XG5cbiAgZm9yIChpPTAsIG49dmFsdWVzLmxlbmd0aDsgIXV0aWwuaXNWYWxpZCh2KSAmJiBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICB9XG5cbiAgcmV0dXJuIHV0aWwuaXNEYXRlKHYpID8gJ2RhdGUnIDpcbiAgICB1dGlsLmlzTnVtYmVyKHYpICAgID8gJ251bWJlcicgOlxuICAgIHV0aWwuaXNCb29sZWFuKHYpICAgPyAnYm9vbGVhbicgOlxuICAgIHV0aWwuaXNTdHJpbmcodikgICAgPyAnc3RyaW5nJyA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIHR5cGVBbGwoZGF0YSwgZmllbGRzKSB7XG4gIGlmICghZGF0YS5sZW5ndGgpIHJldHVybjtcbiAgZmllbGRzID0gZmllbGRzIHx8IHV0aWwua2V5cyhkYXRhWzBdKTtcbiAgcmV0dXJuIGZpZWxkcy5yZWR1Y2UoZnVuY3Rpb24odHlwZXMsIGYpIHtcbiAgICByZXR1cm4gKHR5cGVzW2ZdID0gdHlwZShkYXRhLCBmKSwgdHlwZXMpO1xuICB9LCB7fSk7XG59XG5cbmZ1bmN0aW9uIGluZmVyKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgaSwgaiwgdjtcblxuICAvLyB0eXBlcyB0byB0ZXN0IGZvciwgaW4gcHJlY2VkZW5jZSBvcmRlclxuICB2YXIgdHlwZXMgPSBbJ2Jvb2xlYW4nLCAnaW50ZWdlcicsICdudW1iZXInLCAnZGF0ZSddO1xuXG4gIGZvciAoaT0wOyBpPHZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgIC8vIGdldCBuZXh0IHZhbHVlIHRvIHRlc3RcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICAvLyB0ZXN0IHZhbHVlIGFnYWluc3QgcmVtYWluaW5nIHR5cGVzXG4gICAgZm9yIChqPTA7IGo8dHlwZXMubGVuZ3RoOyArK2opIHtcbiAgICAgIGlmICh1dGlsLmlzVmFsaWQodikgJiYgIVRFU1RTW3R5cGVzW2pdXSh2KSkge1xuICAgICAgICB0eXBlcy5zcGxpY2UoaiwgMSk7XG4gICAgICAgIGogLT0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gaWYgbm8gdHlwZXMgbGVmdCwgcmV0dXJuICdzdHJpbmcnXG4gICAgaWYgKHR5cGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICdzdHJpbmcnO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVzWzBdO1xufVxuXG5mdW5jdGlvbiBpbmZlckFsbChkYXRhLCBmaWVsZHMpIHtcbiAgZmllbGRzID0gZmllbGRzIHx8IHV0aWwua2V5cyhkYXRhWzBdKTtcbiAgcmV0dXJuIGZpZWxkcy5yZWR1Y2UoZnVuY3Rpb24odHlwZXMsIGYpIHtcbiAgICB0eXBlc1tmXSA9IGluZmVyKGRhdGEsIGYpO1xuICAgIHJldHVybiB0eXBlcztcbiAgfSwge30pO1xufVxuXG50eXBlLmFubm90YXRpb24gPSBhbm5vdGF0aW9uO1xudHlwZS5hbGwgPSB0eXBlQWxsO1xudHlwZS5pbmZlciA9IGluZmVyO1xudHlwZS5pbmZlckFsbCA9IGluZmVyQWxsO1xudHlwZS5wYXJzZXJzID0gUEFSU0VSUztcbm1vZHVsZS5leHBvcnRzID0gdHlwZTsiLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHR5cGUgPSByZXF1aXJlKCcuL2ltcG9ydC90eXBlJyk7XG52YXIgZ2VuID0gcmVxdWlyZSgnLi9nZW5lcmF0ZScpO1xudmFyIHN0YXRzID0ge307XG5cbi8vIENvbGxlY3QgdW5pcXVlIHZhbHVlcy5cbi8vIE91dHB1dDogYW4gYXJyYXkgb2YgdW5pcXVlIHZhbHVlcywgaW4gZmlyc3Qtb2JzZXJ2ZWQgb3JkZXJcbnN0YXRzLnVuaXF1ZSA9IGZ1bmN0aW9uKHZhbHVlcywgZiwgcmVzdWx0cykge1xuICBmID0gdXRpbC4kKGYpO1xuICByZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcbiAgdmFyIHUgPSB7fSwgdiwgaSwgbjtcbiAgZm9yIChpPTAsIG49dmFsdWVzLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodiBpbiB1KSBjb250aW51ZTtcbiAgICB1W3ZdID0gMTtcbiAgICByZXN1bHRzLnB1c2godik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdHM7XG59O1xuXG4vLyBSZXR1cm4gdGhlIGxlbmd0aCBvZiB0aGUgaW5wdXQgYXJyYXkuXG5zdGF0cy5jb3VudCA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICByZXR1cm4gdmFsdWVzICYmIHZhbHVlcy5sZW5ndGggfHwgMDtcbn07XG5cbi8vIENvdW50IHRoZSBudW1iZXIgb2Ygbm9uLW51bGwsIG5vbi11bmRlZmluZWQsIG5vbi1OYU4gdmFsdWVzLlxuc3RhdHMuY291bnQudmFsaWQgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIHYsIGksIG4sIHZhbGlkID0gMDtcbiAgZm9yIChpPTAsIG49dmFsdWVzLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodXRpbC5pc1ZhbGlkKHYpKSB2YWxpZCArPSAxO1xuICB9XG4gIHJldHVybiB2YWxpZDtcbn07XG5cbi8vIENvdW50IHRoZSBudW1iZXIgb2YgbnVsbCBvciB1bmRlZmluZWQgdmFsdWVzLlxuc3RhdHMuY291bnQubWlzc2luZyA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgdiwgaSwgbiwgY291bnQgPSAwO1xuICBmb3IgKGk9MCwgbj12YWx1ZXMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh2ID09IG51bGwpIGNvdW50ICs9IDE7XG4gIH1cbiAgcmV0dXJuIGNvdW50O1xufTtcblxuLy8gQ291bnQgdGhlIG51bWJlciBvZiBkaXN0aW5jdCB2YWx1ZXMuXG4vLyBOdWxsLCB1bmRlZmluZWQgYW5kIE5hTiBhcmUgZWFjaCBjb25zaWRlcmVkIGRpc3RpbmN0IHZhbHVlcy5cbnN0YXRzLmNvdW50LmRpc3RpbmN0ID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciB1ID0ge30sIHYsIGksIG4sIGNvdW50ID0gMDtcbiAgZm9yIChpPTAsIG49dmFsdWVzLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodiBpbiB1KSBjb250aW51ZTtcbiAgICB1W3ZdID0gMTtcbiAgICBjb3VudCArPSAxO1xuICB9XG4gIHJldHVybiBjb3VudDtcbn07XG5cbi8vIENvbnN0cnVjdCBhIG1hcCBmcm9tIGRpc3RpbmN0IHZhbHVlcyB0byBvY2N1cnJlbmNlIGNvdW50cy5cbnN0YXRzLmNvdW50Lm1hcCA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgbWFwID0ge30sIHYsIGksIG47XG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgbWFwW3ZdID0gKHYgaW4gbWFwKSA/IG1hcFt2XSArIDEgOiAxO1xuICB9XG4gIHJldHVybiBtYXA7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBtZWRpYW4gb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLm1lZGlhbiA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBpZiAoZikgdmFsdWVzID0gdmFsdWVzLm1hcCh1dGlsLiQoZikpO1xuICB2YWx1ZXMgPSB2YWx1ZXMuZmlsdGVyKHV0aWwuaXNWYWxpZCkuc29ydCh1dGlsLmNtcCk7XG4gIHJldHVybiBzdGF0cy5xdWFudGlsZSh2YWx1ZXMsIDAuNSk7XG59O1xuXG4vLyBDb21wdXRlcyB0aGUgcXVhcnRpbGUgYm91bmRhcmllcyBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMucXVhcnRpbGUgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgaWYgKGYpIHZhbHVlcyA9IHZhbHVlcy5tYXAodXRpbC4kKGYpKTtcbiAgdmFsdWVzID0gdmFsdWVzLmZpbHRlcih1dGlsLmlzVmFsaWQpLnNvcnQodXRpbC5jbXApO1xuICB2YXIgcSA9IHN0YXRzLnF1YW50aWxlO1xuICByZXR1cm4gW3EodmFsdWVzLCAwLjI1KSwgcSh2YWx1ZXMsIDAuNTApLCBxKHZhbHVlcywgMC43NSldO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgcXVhbnRpbGUgb2YgYSBzb3J0ZWQgYXJyYXkgb2YgbnVtYmVycy5cbi8vIEFkYXB0ZWQgZnJvbSB0aGUgRDMuanMgaW1wbGVtZW50YXRpb24uXG5zdGF0cy5xdWFudGlsZSA9IGZ1bmN0aW9uKHZhbHVlcywgZiwgcCkge1xuICBpZiAocCA9PT0gdW5kZWZpbmVkKSB7IHAgPSBmOyBmID0gdXRpbC5pZGVudGl0eTsgfVxuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgSCA9ICh2YWx1ZXMubGVuZ3RoIC0gMSkgKiBwICsgMSxcbiAgICAgIGggPSBNYXRoLmZsb29yKEgpLFxuICAgICAgdiA9ICtmKHZhbHVlc1toIC0gMV0pLFxuICAgICAgZSA9IEggLSBoO1xuICByZXR1cm4gZSA/IHYgKyBlICogKGYodmFsdWVzW2hdKSAtIHYpIDogdjtcbn07XG5cbi8vIENvbXB1dGUgdGhlIHN1bSBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMuc3VtID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIGZvciAodmFyIHN1bT0wLCBpPTAsIG49dmFsdWVzLmxlbmd0aCwgdjsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodXRpbC5pc1ZhbGlkKHYpKSBzdW0gKz0gdjtcbiAgfVxuICByZXR1cm4gc3VtO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgbWVhbiAoYXZlcmFnZSkgb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLm1lYW4gPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIG1lYW4gPSAwLCBkZWx0YSwgaSwgbiwgYywgdjtcbiAgZm9yIChpPTAsIGM9MCwgbj12YWx1ZXMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzVmFsaWQodikpIHtcbiAgICAgIGRlbHRhID0gdiAtIG1lYW47XG4gICAgICBtZWFuID0gbWVhbiArIGRlbHRhIC8gKCsrYyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtZWFuO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgc2FtcGxlIHZhcmlhbmNlIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy52YXJpYW5jZSA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICBpZiAoIXV0aWwuaXNBcnJheSh2YWx1ZXMpIHx8IHZhbHVlcy5sZW5ndGggPCAyKSByZXR1cm4gMDtcbiAgdmFyIG1lYW4gPSAwLCBNMiA9IDAsIGRlbHRhLCBpLCBjLCB2O1xuICBmb3IgKGk9MCwgYz0wOyBpPHZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzVmFsaWQodikpIHtcbiAgICAgIGRlbHRhID0gdiAtIG1lYW47XG4gICAgICBtZWFuID0gbWVhbiArIGRlbHRhIC8gKCsrYyk7XG4gICAgICBNMiA9IE0yICsgZGVsdGEgKiAodiAtIG1lYW4pO1xuICAgIH1cbiAgfVxuICBNMiA9IE0yIC8gKGMgLSAxKTtcbiAgcmV0dXJuIE0yO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgc2FtcGxlIHN0YW5kYXJkIGRldmlhdGlvbiBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMuc3RkZXYgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgcmV0dXJuIE1hdGguc3FydChzdGF0cy52YXJpYW5jZSh2YWx1ZXMsIGYpKTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIFBlYXJzb24gbW9kZSBza2V3bmVzcyAoKG1lZGlhbi1tZWFuKS9zdGRldikgb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLm1vZGVza2V3ID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIHZhciBhdmcgPSBzdGF0cy5tZWFuKHZhbHVlcywgZiksXG4gICAgICBtZWQgPSBzdGF0cy5tZWRpYW4odmFsdWVzLCBmKSxcbiAgICAgIHN0ZCA9IHN0YXRzLnN0ZGV2KHZhbHVlcywgZik7XG4gIHJldHVybiBzdGQgPT09IDAgPyAwIDogKGF2ZyAtIG1lZCkgLyBzdGQ7XG59O1xuXG4vLyBGaW5kIHRoZSBtaW5pbXVtIHZhbHVlIGluIGFuIGFycmF5Llxuc3RhdHMubWluID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIHJldHVybiBzdGF0cy5leHRlbnQodmFsdWVzLCBmKVswXTtcbn07XG5cbi8vIEZpbmQgdGhlIG1heGltdW0gdmFsdWUgaW4gYW4gYXJyYXkuXG5zdGF0cy5tYXggPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgcmV0dXJuIHN0YXRzLmV4dGVudCh2YWx1ZXMsIGYpWzFdO1xufTtcblxuLy8gRmluZCB0aGUgbWluaW11bSBhbmQgbWF4aW11bSBvZiBhbiBhcnJheSBvZiB2YWx1ZXMuXG5zdGF0cy5leHRlbnQgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIGEsIGIsIHYsIGksIG4gPSB2YWx1ZXMubGVuZ3RoO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodXRpbC5pc1ZhbGlkKHYpKSB7IGEgPSBiID0gdjsgYnJlYWs7IH1cbiAgfVxuICBmb3IgKDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodXRpbC5pc1ZhbGlkKHYpKSB7XG4gICAgICBpZiAodiA8IGEpIGEgPSB2O1xuICAgICAgaWYgKHYgPiBiKSBiID0gdjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFthLCBiXTtcbn07XG5cbi8vIEZpbmQgdGhlIGludGVnZXIgaW5kaWNlcyBvZiB0aGUgbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXMuXG5zdGF0cy5leHRlbnQuaW5kZXggPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIHggPSAtMSwgeSA9IC0xLCBhLCBiLCB2LCBpLCBuID0gdmFsdWVzLmxlbmd0aDtcbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkgeyBhID0gYiA9IHY7IHggPSB5ID0gaTsgYnJlYWs7IH1cbiAgfVxuICBmb3IgKDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodXRpbC5pc1ZhbGlkKHYpKSB7XG4gICAgICBpZiAodiA8IGEpIHsgYSA9IHY7IHggPSBpOyB9XG4gICAgICBpZiAodiA+IGIpIHsgYiA9IHY7IHkgPSBpOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiBbeCwgeV07XG59O1xuXG4vLyBDb21wdXRlIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gYXJyYXlzIG9mIG51bWJlcnMuXG5zdGF0cy5kb3QgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIpIHtcbiAgdmFyIHN1bSA9IDAsIGksIHY7XG4gIGlmICghYikge1xuICAgIGlmICh2YWx1ZXMubGVuZ3RoICE9PSBhLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0FycmF5IGxlbmd0aHMgbXVzdCBtYXRjaC4nKTtcbiAgICB9XG4gICAgZm9yIChpPTA7IGk8dmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2ID0gdmFsdWVzW2ldICogYVtpXTtcbiAgICAgIGlmICh2ID09PSB2KSBzdW0gKz0gdjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYSA9IHV0aWwuJChhKTtcbiAgICBiID0gdXRpbC4kKGIpO1xuICAgIGZvciAoaT0wOyBpPHZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgICAgdiA9IGEodmFsdWVzW2ldKSAqIGIodmFsdWVzW2ldKTtcbiAgICAgIGlmICh2ID09PSB2KSBzdW0gKz0gdjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN1bTtcbn07XG5cbi8vIENvbXB1dGUgYXNjZW5kaW5nIHJhbmsgc2NvcmVzIGZvciBhbiBhcnJheSBvZiB2YWx1ZXMuXG4vLyBUaWVzIGFyZSBhc3NpZ25lZCB0aGVpciBjb2xsZWN0aXZlIG1lYW4gcmFuay5cbnN0YXRzLnJhbmsgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKSB8fCB1dGlsLmlkZW50aXR5O1xuICB2YXIgYSA9IHZhbHVlcy5tYXAoZnVuY3Rpb24odiwgaSkge1xuICAgICAgcmV0dXJuIHtpZHg6IGksIHZhbDogZih2KX07XG4gICAgfSlcbiAgICAuc29ydCh1dGlsLmNvbXBhcmF0b3IoJ3ZhbCcpKTtcblxuICB2YXIgbiA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICByID0gQXJyYXkobiksXG4gICAgICB0aWUgPSAtMSwgcCA9IHt9LCBpLCB2LCBtdTtcblxuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICB2ID0gYVtpXS52YWw7XG4gICAgaWYgKHRpZSA8IDAgJiYgcCA9PT0gdikge1xuICAgICAgdGllID0gaSAtIDE7XG4gICAgfSBlbHNlIGlmICh0aWUgPiAtMSAmJiBwICE9PSB2KSB7XG4gICAgICBtdSA9IDEgKyAoaS0xICsgdGllKSAvIDI7XG4gICAgICBmb3IgKDsgdGllPGk7ICsrdGllKSByW2FbdGllXS5pZHhdID0gbXU7XG4gICAgICB0aWUgPSAtMTtcbiAgICB9XG4gICAgclthW2ldLmlkeF0gPSBpICsgMTtcbiAgICBwID0gdjtcbiAgfVxuXG4gIGlmICh0aWUgPiAtMSkge1xuICAgIG11ID0gMSArIChuLTEgKyB0aWUpIC8gMjtcbiAgICBmb3IgKDsgdGllPG47ICsrdGllKSByW2FbdGllXS5pZHhdID0gbXU7XG4gIH1cblxuICByZXR1cm4gcjtcbn07XG5cbi8vIENvbXB1dGUgdGhlIHNhbXBsZSBQZWFyc29uIHByb2R1Y3QtbW9tZW50IGNvcnJlbGF0aW9uIG9mIHR3byBhcnJheXMgb2YgbnVtYmVycy5cbnN0YXRzLmNvciA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYikge1xuICB2YXIgZm4gPSBiO1xuICBiID0gZm4gPyB2YWx1ZXMubWFwKHV0aWwuJChiKSkgOiBhO1xuICBhID0gZm4gPyB2YWx1ZXMubWFwKHV0aWwuJChhKSkgOiB2YWx1ZXM7XG5cbiAgdmFyIGRvdCA9IHN0YXRzLmRvdChhLCBiKSxcbiAgICAgIG11YSA9IHN0YXRzLm1lYW4oYSksXG4gICAgICBtdWIgPSBzdGF0cy5tZWFuKGIpLFxuICAgICAgc2RhID0gc3RhdHMuc3RkZXYoYSksXG4gICAgICBzZGIgPSBzdGF0cy5zdGRldihiKSxcbiAgICAgIG4gPSB2YWx1ZXMubGVuZ3RoO1xuXG4gIHJldHVybiAoZG90IC0gbiptdWEqbXViKSAvICgobi0xKSAqIHNkYSAqIHNkYik7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBTcGVhcm1hbiByYW5rIGNvcnJlbGF0aW9uIG9mIHR3byBhcnJheXMgb2YgdmFsdWVzLlxuc3RhdHMuY29yLnJhbmsgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIpIHtcbiAgdmFyIHJhID0gYiA/IHN0YXRzLnJhbmsodmFsdWVzLCB1dGlsLiQoYSkpIDogc3RhdHMucmFuayh2YWx1ZXMpLFxuICAgICAgcmIgPSBiID8gc3RhdHMucmFuayh2YWx1ZXMsIHV0aWwuJChiKSkgOiBzdGF0cy5yYW5rKGEpLFxuICAgICAgbiA9IHZhbHVlcy5sZW5ndGgsIGksIHMsIGQ7XG5cbiAgZm9yIChpPTAsIHM9MDsgaTxuOyArK2kpIHtcbiAgICBkID0gcmFbaV0gLSByYltpXTtcbiAgICBzICs9IGQgKiBkO1xuICB9XG5cbiAgcmV0dXJuIDEgLSA2KnMgLyAobiAqIChuKm4tMSkpO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgZGlzdGFuY2UgY29ycmVsYXRpb24gb2YgdHdvIGFycmF5cyBvZiBudW1iZXJzLlxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9EaXN0YW5jZV9jb3JyZWxhdGlvblxuc3RhdHMuY29yLmRpc3QgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIpIHtcbiAgdmFyIFggPSBiID8gdmFsdWVzLm1hcCh1dGlsLiQoYSkpIDogdmFsdWVzLFxuICAgICAgWSA9IGIgPyB2YWx1ZXMubWFwKHV0aWwuJChiKSkgOiBhO1xuXG4gIHZhciBBID0gc3RhdHMuZGlzdC5tYXQoWCksXG4gICAgICBCID0gc3RhdHMuZGlzdC5tYXQoWSksXG4gICAgICBuID0gQS5sZW5ndGgsXG4gICAgICBpLCBhYSwgYmIsIGFiO1xuXG4gIGZvciAoaT0wLCBhYT0wLCBiYj0wLCBhYj0wOyBpPG47ICsraSkge1xuICAgIGFhICs9IEFbaV0qQVtpXTtcbiAgICBiYiArPSBCW2ldKkJbaV07XG4gICAgYWIgKz0gQVtpXSpCW2ldO1xuICB9XG5cbiAgcmV0dXJuIE1hdGguc3FydChhYiAvIE1hdGguc3FydChhYSpiYikpO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgdmVjdG9yIGRpc3RhbmNlIGJldHdlZW4gdHdvIGFycmF5cyBvZiBudW1iZXJzLlxuLy8gRGVmYXVsdCBpcyBFdWNsaWRlYW4gKGV4cD0yKSBkaXN0YW5jZSwgY29uZmlndXJhYmxlIHZpYSBleHAgYXJndW1lbnQuXG5zdGF0cy5kaXN0ID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiLCBleHApIHtcbiAgdmFyIGYgPSB1dGlsLmlzRnVuY3Rpb24oYikgfHwgdXRpbC5pc1N0cmluZyhiKSxcbiAgICAgIFggPSB2YWx1ZXMsXG4gICAgICBZID0gZiA/IHZhbHVlcyA6IGEsXG4gICAgICBlID0gZiA/IGV4cCA6IGIsXG4gICAgICBMMiA9IGUgPT09IDIgfHwgZSA9PSBudWxsLFxuICAgICAgbiA9IHZhbHVlcy5sZW5ndGgsIHMgPSAwLCBkLCBpO1xuICBpZiAoZikge1xuICAgIGEgPSB1dGlsLiQoYSk7XG4gICAgYiA9IHV0aWwuJChiKTtcbiAgfVxuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBkID0gZiA/IChhKFhbaV0pLWIoWVtpXSkpIDogKFhbaV0tWVtpXSk7XG4gICAgcyArPSBMMiA/IGQqZCA6IE1hdGgucG93KE1hdGguYWJzKGQpLCBlKTtcbiAgfVxuICByZXR1cm4gTDIgPyBNYXRoLnNxcnQocykgOiBNYXRoLnBvdyhzLCAxL2UpO1xufTtcblxuLy8gQ29uc3RydWN0IGEgbWVhbi1jZW50ZXJlZCBkaXN0YW5jZSBtYXRyaXggZm9yIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5kaXN0Lm1hdCA9IGZ1bmN0aW9uKFgpIHtcbiAgdmFyIG4gPSBYLmxlbmd0aCxcbiAgICAgIG0gPSBuKm4sXG4gICAgICBBID0gQXJyYXkobSksXG4gICAgICBSID0gZ2VuLnplcm9zKG4pLFxuICAgICAgTSA9IDAsIHYsIGksIGo7XG5cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgQVtpKm4raV0gPSAwO1xuICAgIGZvciAoaj1pKzE7IGo8bjsgKytqKSB7XG4gICAgICBBW2kqbitqXSA9ICh2ID0gTWF0aC5hYnMoWFtpXSAtIFhbal0pKTtcbiAgICAgIEFbaipuK2ldID0gdjtcbiAgICAgIFJbaV0gKz0gdjtcbiAgICAgIFJbal0gKz0gdjtcbiAgICB9XG4gIH1cblxuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBNICs9IFJbaV07XG4gICAgUltpXSAvPSBuO1xuICB9XG4gIE0gLz0gbTtcblxuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBmb3IgKGo9aTsgajxuOyArK2opIHtcbiAgICAgIEFbaSpuK2pdICs9IE0gLSBSW2ldIC0gUltqXTtcbiAgICAgIEFbaipuK2ldID0gQVtpKm4ral07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIEE7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBTaGFubm9uIGVudHJvcHkgKGxvZyBiYXNlIDIpIG9mIGFuIGFycmF5IG9mIGNvdW50cy5cbnN0YXRzLmVudHJvcHkgPSBmdW5jdGlvbihjb3VudHMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIGksIHAsIHMgPSAwLCBIID0gMCwgbiA9IGNvdW50cy5sZW5ndGg7XG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHMgKz0gKGYgPyBmKGNvdW50c1tpXSkgOiBjb3VudHNbaV0pO1xuICB9XG4gIGlmIChzID09PSAwKSByZXR1cm4gMDtcbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgcCA9IChmID8gZihjb3VudHNbaV0pIDogY291bnRzW2ldKSAvIHM7XG4gICAgaWYgKHApIEggKz0gcCAqIE1hdGgubG9nKHApO1xuICB9XG4gIHJldHVybiAtSCAvIE1hdGguTE4yO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgbXV0dWFsIGluZm9ybWF0aW9uIGJldHdlZW4gdHdvIGRpc2NyZXRlIHZhcmlhYmxlcy5cbi8vIFJldHVybnMgYW4gYXJyYXkgb2YgdGhlIGZvcm0gW01JLCBNSV9kaXN0YW5jZV0gXG4vLyBNSV9kaXN0YW5jZSBpcyBkZWZpbmVkIGFzIDEgLSBJKGEsYikgLyBIKGEsYikuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL011dHVhbF9pbmZvcm1hdGlvblxuc3RhdHMubXV0dWFsID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiLCBjb3VudHMpIHtcbiAgdmFyIHggPSBjb3VudHMgPyB2YWx1ZXMubWFwKHV0aWwuJChhKSkgOiB2YWx1ZXMsXG4gICAgICB5ID0gY291bnRzID8gdmFsdWVzLm1hcCh1dGlsLiQoYikpIDogYSxcbiAgICAgIHogPSBjb3VudHMgPyB2YWx1ZXMubWFwKHV0aWwuJChjb3VudHMpKSA6IGI7XG5cbiAgdmFyIHB4ID0ge30sXG4gICAgICBweSA9IHt9LFxuICAgICAgbiA9IHoubGVuZ3RoLFxuICAgICAgcyA9IDAsIEkgPSAwLCBIID0gMCwgcCwgdCwgaTtcblxuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBweFt4W2ldXSA9IDA7XG4gICAgcHlbeVtpXV0gPSAwO1xuICB9XG5cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgcHhbeFtpXV0gKz0geltpXTtcbiAgICBweVt5W2ldXSArPSB6W2ldO1xuICAgIHMgKz0geltpXTtcbiAgfVxuXG4gIHQgPSAxIC8gKHMgKiBNYXRoLkxOMik7XG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIGlmICh6W2ldID09PSAwKSBjb250aW51ZTtcbiAgICBwID0gKHMgKiB6W2ldKSAvIChweFt4W2ldXSAqIHB5W3lbaV1dKTtcbiAgICBJICs9IHpbaV0gKiB0ICogTWF0aC5sb2cocCk7XG4gICAgSCArPSB6W2ldICogdCAqIE1hdGgubG9nKHpbaV0vcyk7XG4gIH1cblxuICByZXR1cm4gW0ksIDEgKyBJL0hdO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgbXV0dWFsIGluZm9ybWF0aW9uIGJldHdlZW4gdHdvIGRpc2NyZXRlIHZhcmlhYmxlcy5cbnN0YXRzLm11dHVhbC5pbmZvID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiLCBjb3VudHMpIHtcbiAgcmV0dXJuIHN0YXRzLm11dHVhbCh2YWx1ZXMsIGEsIGIsIGNvdW50cylbMF07XG59O1xuXG4vLyBDb21wdXRlIHRoZSBtdXR1YWwgaW5mb3JtYXRpb24gZGlzdGFuY2UgYmV0d2VlbiB0d28gZGlzY3JldGUgdmFyaWFibGVzLlxuLy8gTUlfZGlzdGFuY2UgaXMgZGVmaW5lZCBhcyAxIC0gSShhLGIpIC8gSChhLGIpLlxuc3RhdHMubXV0dWFsLmRpc3QgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIsIGNvdW50cykge1xuICByZXR1cm4gc3RhdHMubXV0dWFsKHZhbHVlcywgYSwgYiwgY291bnRzKVsxXTtcbn07XG5cbi8vIENvbXB1dGUgYSBwcm9maWxlIG9mIHN1bW1hcnkgc3RhdGlzdGljcyBmb3IgYSB2YXJpYWJsZS5cbnN0YXRzLnByb2ZpbGUgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgdmFyIG1lYW4gPSAwLFxuICAgICAgdmFsaWQgPSAwLFxuICAgICAgbWlzc2luZyA9IDAsXG4gICAgICBkaXN0aW5jdCA9IDAsXG4gICAgICBtaW4gPSBudWxsLFxuICAgICAgbWF4ID0gbnVsbCxcbiAgICAgIE0yID0gMCxcbiAgICAgIHZhbHMgPSBbXSxcbiAgICAgIHUgPSB7fSwgZGVsdGEsIHNkLCBpLCB2LCB4O1xuXG4gIC8vIGNvbXB1dGUgc3VtbWFyeSBzdGF0c1xuICBmb3IgKGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcblxuICAgIC8vIHVwZGF0ZSB1bmlxdWUgdmFsdWVzXG4gICAgdVt2XSA9ICh2IGluIHUpID8gdVt2XSArIDEgOiAoZGlzdGluY3QgKz0gMSwgMSk7XG5cbiAgICBpZiAodiA9PSBudWxsKSB7XG4gICAgICArK21pc3Npbmc7XG4gICAgfSBlbHNlIGlmICh1dGlsLmlzVmFsaWQodikpIHtcbiAgICAgIC8vIHVwZGF0ZSBzdGF0c1xuICAgICAgeCA9ICh0eXBlb2YgdiA9PT0gJ3N0cmluZycpID8gdi5sZW5ndGggOiB2O1xuICAgICAgaWYgKG1pbj09PW51bGwgfHwgeCA8IG1pbikgbWluID0geDtcbiAgICAgIGlmIChtYXg9PT1udWxsIHx8IHggPiBtYXgpIG1heCA9IHg7XG4gICAgICBkZWx0YSA9IHggLSBtZWFuO1xuICAgICAgbWVhbiA9IG1lYW4gKyBkZWx0YSAvICgrK3ZhbGlkKTtcbiAgICAgIE0yID0gTTIgKyBkZWx0YSAqICh4IC0gbWVhbik7XG4gICAgICB2YWxzLnB1c2goeCk7XG4gICAgfVxuICB9XG4gIE0yID0gTTIgLyAodmFsaWQgLSAxKTtcbiAgc2QgPSBNYXRoLnNxcnQoTTIpO1xuXG4gIC8vIHNvcnQgdmFsdWVzIGZvciBtZWRpYW4gYW5kIGlxclxuICB2YWxzLnNvcnQodXRpbC5jbXApO1xuXG4gIHJldHVybiB7XG4gICAgdHlwZTogICAgIHR5cGUodmFsdWVzLCBmKSxcbiAgICB1bmlxdWU6ICAgdSxcbiAgICBjb3VudDogICAgdmFsdWVzLmxlbmd0aCxcbiAgICB2YWxpZDogICAgdmFsaWQsXG4gICAgbWlzc2luZzogIG1pc3NpbmcsXG4gICAgZGlzdGluY3Q6IGRpc3RpbmN0LFxuICAgIG1pbjogICAgICBtaW4sXG4gICAgbWF4OiAgICAgIG1heCxcbiAgICBtZWFuOiAgICAgbWVhbixcbiAgICBzdGRldjogICAgc2QsXG4gICAgbWVkaWFuOiAgICh2ID0gc3RhdHMucXVhbnRpbGUodmFscywgMC41KSksXG4gICAgcTE6ICAgICAgIHN0YXRzLnF1YW50aWxlKHZhbHMsIDAuMjUpLFxuICAgIHEzOiAgICAgICBzdGF0cy5xdWFudGlsZSh2YWxzLCAwLjc1KSxcbiAgICBtb2Rlc2tldzogc2QgPT09IDAgPyAwIDogKG1lYW4gLSB2KSAvIHNkXG4gIH07XG59O1xuXG4vLyBDb21wdXRlIHByb2ZpbGVzIGZvciBhbGwgdmFyaWFibGVzIGluIGEgZGF0YSBzZXQuXG5zdGF0cy5zdW1tYXJ5ID0gZnVuY3Rpb24oZGF0YSwgZmllbGRzKSB7XG4gIGZpZWxkcyA9IGZpZWxkcyB8fCB1dGlsLmtleXMoZGF0YVswXSk7XG4gIHZhciBzID0gZmllbGRzLm1hcChmdW5jdGlvbihmKSB7XG4gICAgdmFyIHAgPSBzdGF0cy5wcm9maWxlKGRhdGEsIHV0aWwuJChmKSk7XG4gICAgcmV0dXJuIChwLmZpZWxkID0gZiwgcCk7XG4gIH0pO1xuICByZXR1cm4gKHMuX19zdW1tYXJ5X18gPSB0cnVlLCBzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhdHM7IiwidmFyIGQzX3RpbWUgPSByZXF1aXJlKCdkMy10aW1lJyk7XG5cbnZhciB0ZW1wRGF0ZSA9IG5ldyBEYXRlKCksXG4gICAgYmFzZURhdGUgPSBuZXcgRGF0ZSgwLCAwLCAxKS5zZXRGdWxsWWVhcigwKSwgLy8gSmFuIDEsIDAgQURcbiAgICB1dGNCYXNlRGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDKDAsIDAsIDEpKS5zZXRVVENGdWxsWWVhcigwKTtcblxuZnVuY3Rpb24gZGF0ZShkKSB7XG4gIHJldHVybiAodGVtcERhdGUuc2V0VGltZSgrZCksIHRlbXBEYXRlKTtcbn1cblxuLy8gY3JlYXRlIGEgdGltZSB1bml0IGVudHJ5XG5mdW5jdGlvbiBlbnRyeSh0eXBlLCBkYXRlLCB1bml0LCBzdGVwLCBtaW4sIG1heCkge1xuICB2YXIgZSA9IHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGU6IGRhdGUsXG4gICAgdW5pdDogdW5pdFxuICB9O1xuICBpZiAoc3RlcCkge1xuICAgIGUuc3RlcCA9IHN0ZXA7XG4gIH0gZWxzZSB7XG4gICAgZS5taW5zdGVwID0gMTtcbiAgfVxuICBpZiAobWluICE9IG51bGwpIGUubWluID0gbWluO1xuICBpZiAobWF4ICE9IG51bGwpIGUubWF4ID0gbWF4O1xuICByZXR1cm4gZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlKHR5cGUsIHVuaXQsIGJhc2UsIHN0ZXAsIG1pbiwgbWF4KSB7XG4gIHJldHVybiBlbnRyeSh0eXBlLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHVuaXQub2Zmc2V0KGJhc2UsIGQpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHVuaXQuY291bnQoYmFzZSwgZCk7IH0sXG4gICAgc3RlcCwgbWluLCBtYXgpO1xufVxuXG52YXIgbG9jYWxlID0gW1xuICBjcmVhdGUoJ3NlY29uZCcsIGQzX3RpbWUuc2Vjb25kLCBiYXNlRGF0ZSksXG4gIGNyZWF0ZSgnbWludXRlJywgZDNfdGltZS5taW51dGUsIGJhc2VEYXRlKSxcbiAgY3JlYXRlKCdob3VyJywgICBkM190aW1lLmhvdXIsICAgYmFzZURhdGUpLFxuICBjcmVhdGUoJ2RheScsICAgIGQzX3RpbWUuZGF5LCAgICBiYXNlRGF0ZSwgWzEsIDddKSxcbiAgY3JlYXRlKCdtb250aCcsICBkM190aW1lLm1vbnRoLCAgYmFzZURhdGUsIFsxLCAzLCA2XSksXG4gIGNyZWF0ZSgneWVhcicsICAgZDNfdGltZS55ZWFyLCAgIGJhc2VEYXRlKSxcblxuICAvLyBwZXJpb2RpYyB1bml0c1xuICBlbnRyeSgnc2Vjb25kcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoMTk3MCwgMCwgMSwgMCwgMCwgZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRTZWNvbmRzKCk7IH0sXG4gICAgbnVsbCwgMCwgNTlcbiAgKSxcbiAgZW50cnkoJ21pbnV0ZXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIDEsIDAsIGQpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0TWludXRlcygpOyB9LFxuICAgIG51bGwsIDAsIDU5XG4gICksXG4gIGVudHJ5KCdob3VycycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoMTk3MCwgMCwgMSwgZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRIb3VycygpOyB9LFxuICAgIG51bGwsIDAsIDIzXG4gICksXG4gIGVudHJ5KCd3ZWVrZGF5cycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoMTk3MCwgMCwgNCtkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldERheSgpOyB9LFxuICAgIFsxXSwgMCwgNlxuICApLFxuICBlbnRyeSgnZGF0ZXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIGQpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0RGF0ZSgpOyB9LFxuICAgIFsxXSwgMSwgMzFcbiAgKSxcbiAgZW50cnkoJ21vbnRocycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoMTk3MCwgZCAlIDEyLCAxKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldE1vbnRoKCk7IH0sXG4gICAgWzFdLCAwLCAxMVxuICApXG5dO1xuXG52YXIgdXRjID0gW1xuICBjcmVhdGUoJ3NlY29uZCcsIGQzX3RpbWUudXRjU2Vjb25kLCB1dGNCYXNlRGF0ZSksXG4gIGNyZWF0ZSgnbWludXRlJywgZDNfdGltZS51dGNNaW51dGUsIHV0Y0Jhc2VEYXRlKSxcbiAgY3JlYXRlKCdob3VyJywgICBkM190aW1lLnV0Y0hvdXIsICAgdXRjQmFzZURhdGUpLFxuICBjcmVhdGUoJ2RheScsICAgIGQzX3RpbWUudXRjRGF5LCAgICB1dGNCYXNlRGF0ZSwgWzEsIDddKSxcbiAgY3JlYXRlKCdtb250aCcsICBkM190aW1lLnV0Y01vbnRoLCAgdXRjQmFzZURhdGUsIFsxLCAzLCA2XSksXG4gIGNyZWF0ZSgneWVhcicsICAgZDNfdGltZS51dGNZZWFyLCAgIHV0Y0Jhc2VEYXRlKSxcblxuICAvLyBwZXJpb2RpYyB1bml0c1xuICBlbnRyeSgnc2Vjb25kcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgMSwgMCwgMCwgZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDU2Vjb25kcygpOyB9LFxuICAgIG51bGwsIDAsIDU5XG4gICksXG4gIGVudHJ5KCdtaW51dGVzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCAxLCAwLCBkKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENNaW51dGVzKCk7IH0sXG4gICAgbnVsbCwgMCwgNTlcbiAgKSxcbiAgZW50cnkoJ2hvdXJzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCAxLCBkKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENIb3VycygpOyB9LFxuICAgIG51bGwsIDAsIDIzXG4gICksXG4gIGVudHJ5KCd3ZWVrZGF5cycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgNCtkKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENEYXkoKTsgfSxcbiAgICBbMV0sIDAsIDZcbiAgKSxcbiAgZW50cnkoJ2RhdGVzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCBkKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENEYXRlKCk7IH0sXG4gICAgWzFdLCAxLCAzMVxuICApLFxuICBlbnRyeSgnbW9udGhzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCBkICUgMTIsIDEpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ01vbnRoKCk7IH0sXG4gICAgWzFdLCAwLCAxMVxuICApXG5dO1xuXG52YXIgU1RFUFMgPSBbXG4gIFszMTUzNmU2LCA1XSwgIC8vIDEteWVhclxuICBbNzc3NmU2LCA0XSwgICAvLyAzLW1vbnRoXG4gIFsyNTkyZTYsIDRdLCAgIC8vIDEtbW9udGhcbiAgWzEyMDk2ZTUsIDNdLCAgLy8gMi13ZWVrXG4gIFs2MDQ4ZTUsIDNdLCAgIC8vIDEtd2Vla1xuICBbMTcyOGU1LCAzXSwgICAvLyAyLWRheVxuICBbODY0ZTUsIDNdLCAgICAvLyAxLWRheVxuICBbNDMyZTUsIDJdLCAgICAvLyAxMi1ob3VyXG4gIFsyMTZlNSwgMl0sICAgIC8vIDYtaG91clxuICBbMTA4ZTUsIDJdLCAgICAvLyAzLWhvdXJcbiAgWzM2ZTUsIDJdLCAgICAgLy8gMS1ob3VyXG4gIFsxOGU1LCAxXSwgICAgIC8vIDMwLW1pbnV0ZVxuICBbOWU1LCAxXSwgICAgICAvLyAxNS1taW51dGVcbiAgWzNlNSwgMV0sICAgICAgLy8gNS1taW51dGVcbiAgWzZlNCwgMV0sICAgICAgLy8gMS1taW51dGVcbiAgWzNlNCwgMF0sICAgICAgLy8gMzAtc2Vjb25kXG4gIFsxNWUzLCAwXSwgICAgIC8vIDE1LXNlY29uZFxuICBbNWUzLCAwXSwgICAgICAvLyA1LXNlY29uZFxuICBbMWUzLCAwXSAgICAgICAvLyAxLXNlY29uZFxuXTtcblxuZnVuY3Rpb24gZmluZCh1bml0cywgc3BhbiwgbWluYiwgbWF4Yikge1xuICB2YXIgc3RlcCA9IFNURVBTWzBdLCBpLCBuLCBiaW5zO1xuXG4gIGZvciAoaT0xLCBuPVNURVBTLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICBzdGVwID0gU1RFUFNbaV07XG4gICAgaWYgKHNwYW4gPiBzdGVwWzBdKSB7XG4gICAgICBiaW5zID0gc3BhbiAvIHN0ZXBbMF07XG4gICAgICBpZiAoYmlucyA+IG1heGIpIHtcbiAgICAgICAgcmV0dXJuIHVuaXRzW1NURVBTW2ktMV1bMV1dO1xuICAgICAgfVxuICAgICAgaWYgKGJpbnMgPj0gbWluYikge1xuICAgICAgICByZXR1cm4gdW5pdHNbc3RlcFsxXV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB1bml0c1tTVEVQU1tuLTFdWzFdXTtcbn1cblxuZnVuY3Rpb24gdG9Vbml0TWFwKHVuaXRzKSB7XG4gIHZhciBtYXAgPSB7fSwgaSwgbjtcbiAgZm9yIChpPTAsIG49dW5pdHMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIG1hcFt1bml0c1tpXS50eXBlXSA9IHVuaXRzW2ldO1xuICB9XG4gIG1hcC5maW5kID0gZnVuY3Rpb24oc3BhbiwgbWluYiwgbWF4Yikge1xuICAgIHJldHVybiBmaW5kKHVuaXRzLCBzcGFuLCBtaW5iLCBtYXhiKTtcbiAgfTtcbiAgcmV0dXJuIG1hcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1VuaXRNYXAobG9jYWxlKTtcbm1vZHVsZS5leHBvcnRzLnV0YyA9IHRvVW5pdE1hcCh1dGMpO1xuIiwidmFyIGJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLFxuICAgIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKSxcbiAgICB1dGMgPSB0aW1lLnV0YztcblxudmFyIHUgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyB1dGlsaXR5IGZ1bmN0aW9uc1xuXG52YXIgRk5BTUUgPSAnX19uYW1lX18nO1xuXG51Lm5hbWVkZnVuYyA9IGZ1bmN0aW9uKG5hbWUsIGYpIHsgcmV0dXJuIChmW0ZOQU1FXSA9IG5hbWUsIGYpOyB9O1xuXG51Lm5hbWUgPSBmdW5jdGlvbihmKSB7IHJldHVybiBmPT1udWxsID8gbnVsbCA6IGZbRk5BTUVdOyB9O1xuXG51LmlkZW50aXR5ID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geDsgfTtcblxudS50cnVlID0gdS5uYW1lZGZ1bmMoJ3RydWUnLCBmdW5jdGlvbigpIHsgcmV0dXJuIHRydWU7IH0pO1xuXG51LmZhbHNlID0gdS5uYW1lZGZ1bmMoJ2ZhbHNlJywgZnVuY3Rpb24oKSB7IHJldHVybiBmYWxzZTsgfSk7XG5cbnUuZHVwbGljYXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xufTtcblxudS5lcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGEpID09PSBKU09OLnN0cmluZ2lmeShiKTtcbn07XG5cbnUuZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gIGZvciAodmFyIHgsIG5hbWUsIGk9MSwgbGVuPWFyZ3VtZW50cy5sZW5ndGg7IGk8bGVuOyArK2kpIHtcbiAgICB4ID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAobmFtZSBpbiB4KSB7IG9ialtuYW1lXSA9IHhbbmFtZV07IH1cbiAgfVxuICByZXR1cm4gb2JqO1xufTtcblxudS5sZW5ndGggPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiB4ICE9IG51bGwgJiYgeC5sZW5ndGggIT0gbnVsbCA/IHgubGVuZ3RoIDogbnVsbDtcbn07XG5cbnUua2V5cyA9IGZ1bmN0aW9uKHgpIHtcbiAgdmFyIGtleXMgPSBbXSwgaztcbiAgZm9yIChrIGluIHgpIGtleXMucHVzaChrKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG51LnZhbHMgPSBmdW5jdGlvbih4KSB7XG4gIHZhciB2YWxzID0gW10sIGs7XG4gIGZvciAoayBpbiB4KSB2YWxzLnB1c2goeFtrXSk7XG4gIHJldHVybiB2YWxzO1xufTtcblxudS50b01hcCA9IGZ1bmN0aW9uKGxpc3QsIGYpIHtcbiAgcmV0dXJuIChmID0gdS4kKGYpKSA/XG4gICAgbGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCB4KSB7IHJldHVybiAob2JqW2YoeCldID0gMSwgb2JqKTsgfSwge30pIDpcbiAgICBsaXN0LnJlZHVjZShmdW5jdGlvbihvYmosIHgpIHsgcmV0dXJuIChvYmpbeF0gPSAxLCBvYmopOyB9LCB7fSk7XG59O1xuXG51LmtleXN0ciA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICAvLyB1c2UgdG8gZW5zdXJlIGNvbnNpc3RlbnQga2V5IGdlbmVyYXRpb24gYWNyb3NzIG1vZHVsZXNcbiAgdmFyIG4gPSB2YWx1ZXMubGVuZ3RoO1xuICBpZiAoIW4pIHJldHVybiAnJztcbiAgZm9yICh2YXIgcz1TdHJpbmcodmFsdWVzWzBdKSwgaT0xOyBpPG47ICsraSkge1xuICAgIHMgKz0gJ3wnICsgU3RyaW5nKHZhbHVlc1tpXSk7XG4gIH1cbiAgcmV0dXJuIHM7XG59O1xuXG4vLyB0eXBlIGNoZWNraW5nIGZ1bmN0aW9uc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG51LmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xufTtcblxudS5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59O1xuXG51LmlzU3RyaW5nID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG59O1xuXG51LmlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxudS5pc051bWJlciA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ251bWJlcicgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBOdW1iZXJdJztcbn07XG5cbnUuaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xufTtcblxudS5pc0RhdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufTtcblxudS5pc1ZhbGlkID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiBvYmogPT09IG9iajtcbn07XG5cbnUuaXNCdWZmZXIgPSAoYnVmZmVyLkJ1ZmZlciAmJiBidWZmZXIuQnVmZmVyLmlzQnVmZmVyKSB8fCB1LmZhbHNlO1xuXG4vLyB0eXBlIGNvZXJjaW9uIGZ1bmN0aW9uc1xuXG51Lm51bWJlciA9IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMgPT0gbnVsbCB8fCBzID09PSAnJyA/IG51bGwgOiArcztcbn07XG5cbnUuYm9vbGVhbiA9IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMgPT0gbnVsbCB8fCBzID09PSAnJyA/IG51bGwgOiBzPT09J2ZhbHNlJyA/IGZhbHNlIDogISFzO1xufTtcblxudS5kYXRlID0gZnVuY3Rpb24ocykge1xuICByZXR1cm4gcyA9PSBudWxsIHx8IHMgPT09ICcnID8gbnVsbCA6IERhdGUucGFyc2Uocyk7XG59O1xuXG51LmFycmF5ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4geCAhPSBudWxsID8gKHUuaXNBcnJheSh4KSA/IHggOiBbeF0pIDogW107XG59O1xuXG51LnN0ciA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHUuaXNBcnJheSh4KSA/ICdbJyArIHgubWFwKHUuc3RyKSArICddJ1xuICAgIDogdS5pc09iamVjdCh4KSA/IEpTT04uc3RyaW5naWZ5KHgpXG4gICAgOiB1LmlzU3RyaW5nKHgpID8gKCdcXCcnK3V0aWxfZXNjYXBlX3N0cih4KSsnXFwnJykgOiB4O1xufTtcblxudmFyIGVzY2FwZV9zdHJfcmUgPSAvKF58W15cXFxcXSknL2c7XG5cbmZ1bmN0aW9uIHV0aWxfZXNjYXBlX3N0cih4KSB7XG4gIHJldHVybiB4LnJlcGxhY2UoZXNjYXBlX3N0cl9yZSwgJyQxXFxcXFxcJycpO1xufVxuXG4vLyBkYXRhIGFjY2VzcyBmdW5jdGlvbnNcblxudmFyIGZpZWxkX3JlID0gL1xcWyguKj8pXFxdfFteLlxcW10rL2c7XG5cbnUuZmllbGQgPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiBTdHJpbmcoZikubWF0Y2goZmllbGRfcmUpLm1hcChmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuIGRbMF0gIT09ICdbJyA/IGQgOlxuICAgICAgZFsxXSAhPT0gXCInXCIgJiYgZFsxXSAhPT0gJ1wiJyA/IGQuc2xpY2UoMSwgLTEpIDpcbiAgICAgIGQuc2xpY2UoMiwgLTIpLnJlcGxhY2UoL1xcXFwoW1wiJ10pL2csICckMScpO1xuICB9KTtcbn07XG5cbnUuYWNjZXNzb3IgPSBmdW5jdGlvbihmKSB7XG4gIHZhciBzO1xuICByZXR1cm4gZj09bnVsbCB8fCB1LmlzRnVuY3Rpb24oZikgPyBmIDpcbiAgICB1Lm5hbWVkZnVuYyhmLCAocyA9IHUuZmllbGQoZikpLmxlbmd0aCA+IDEgP1xuICAgICAgZnVuY3Rpb24oeCkgeyByZXR1cm4gcy5yZWR1Y2UoZnVuY3Rpb24oeCxmKSB7IHJldHVybiB4W2ZdOyB9LCB4KTsgfSA6XG4gICAgICBmdW5jdGlvbih4KSB7IHJldHVybiB4W2ZdOyB9XG4gICAgKTtcbn07XG5cbi8vIHNob3J0LWN1dCBmb3IgYWNjZXNzb3JcbnUuJCA9IHUuYWNjZXNzb3I7XG5cbnUubXV0YXRvciA9IGZ1bmN0aW9uKGYpIHtcbiAgdmFyIHM7XG4gIHJldHVybiB1LmlzU3RyaW5nKGYpICYmIChzPXUuZmllbGQoZikpLmxlbmd0aCA+IDEgP1xuICAgIGZ1bmN0aW9uKHgsIHYpIHtcbiAgICAgIGZvciAodmFyIGk9MDsgaTxzLmxlbmd0aC0xOyArK2kpIHggPSB4W3NbaV1dO1xuICAgICAgeFtzW2ldXSA9IHY7XG4gICAgfSA6XG4gICAgZnVuY3Rpb24oeCwgdikgeyB4W2ZdID0gdjsgfTtcbn07XG5cblxudS4kZnVuYyA9IGZ1bmN0aW9uKG5hbWUsIG9wKSB7XG4gIHJldHVybiBmdW5jdGlvbihmKSB7XG4gICAgZiA9IHUuJChmKSB8fCB1LmlkZW50aXR5O1xuICAgIHZhciBuID0gbmFtZSArICh1Lm5hbWUoZikgPyAnXycrdS5uYW1lKGYpIDogJycpO1xuICAgIHJldHVybiB1Lm5hbWVkZnVuYyhuLCBmdW5jdGlvbihkKSB7IHJldHVybiBvcChmKGQpKTsgfSk7XG4gIH07XG59O1xuXG51LiR2YWxpZCAgPSB1LiRmdW5jKCd2YWxpZCcsIHUuaXNWYWxpZCk7XG51LiRsZW5ndGggPSB1LiRmdW5jKCdsZW5ndGgnLCB1Lmxlbmd0aCk7XG5cbnUuJGluID0gZnVuY3Rpb24oZiwgdmFsdWVzKSB7XG4gIGYgPSB1LiQoZik7XG4gIHZhciBtYXAgPSB1LmlzQXJyYXkodmFsdWVzKSA/IHUudG9NYXAodmFsdWVzKSA6IHZhbHVlcztcbiAgcmV0dXJuIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICEhbWFwW2YoZCldOyB9O1xufTtcblxudS4keWVhciAgID0gdS4kZnVuYygneWVhcicsIHRpbWUueWVhci51bml0KTtcbnUuJG1vbnRoICA9IHUuJGZ1bmMoJ21vbnRoJywgdGltZS5tb250aHMudW5pdCk7XG51LiRkYXRlICAgPSB1LiRmdW5jKCdkYXRlJywgdGltZS5kYXRlcy51bml0KTtcbnUuJGRheSAgICA9IHUuJGZ1bmMoJ2RheScsIHRpbWUud2Vla2RheXMudW5pdCk7XG51LiRob3VyICAgPSB1LiRmdW5jKCdob3VyJywgdGltZS5ob3Vycy51bml0KTtcbnUuJG1pbnV0ZSA9IHUuJGZ1bmMoJ21pbnV0ZScsIHRpbWUubWludXRlcy51bml0KTtcbnUuJHNlY29uZCA9IHUuJGZ1bmMoJ3NlY29uZCcsIHRpbWUuc2Vjb25kcy51bml0KTtcblxudS4kdXRjWWVhciAgID0gdS4kZnVuYygndXRjWWVhcicsIHV0Yy55ZWFyLnVuaXQpO1xudS4kdXRjTW9udGggID0gdS4kZnVuYygndXRjTW9udGgnLCB1dGMubW9udGhzLnVuaXQpO1xudS4kdXRjRGF0ZSAgID0gdS4kZnVuYygndXRjRGF0ZScsIHV0Yy5kYXRlcy51bml0KTtcbnUuJHV0Y0RheSAgICA9IHUuJGZ1bmMoJ3V0Y0RheScsIHV0Yy53ZWVrZGF5cy51bml0KTtcbnUuJHV0Y0hvdXIgICA9IHUuJGZ1bmMoJ3V0Y0hvdXInLCB1dGMuaG91cnMudW5pdCk7XG51LiR1dGNNaW51dGUgPSB1LiRmdW5jKCd1dGNNaW51dGUnLCB1dGMubWludXRlcy51bml0KTtcbnUuJHV0Y1NlY29uZCA9IHUuJGZ1bmMoJ3V0Y1NlY29uZCcsIHV0Yy5zZWNvbmRzLnVuaXQpO1xuXG4vLyBjb21wYXJpc29uIC8gc29ydGluZyBmdW5jdGlvbnNcblxudS5jb21wYXJhdG9yID0gZnVuY3Rpb24oc29ydCkge1xuICB2YXIgc2lnbiA9IFtdO1xuICBpZiAoc29ydCA9PT0gdW5kZWZpbmVkKSBzb3J0ID0gW107XG4gIHNvcnQgPSB1LmFycmF5KHNvcnQpLm1hcChmdW5jdGlvbihmKSB7XG4gICAgdmFyIHMgPSAxO1xuICAgIGlmICAgICAgKGZbMF0gPT09ICctJykgeyBzID0gLTE7IGYgPSBmLnNsaWNlKDEpOyB9XG4gICAgZWxzZSBpZiAoZlswXSA9PT0gJysnKSB7IHMgPSArMTsgZiA9IGYuc2xpY2UoMSk7IH1cbiAgICBzaWduLnB1c2gocyk7XG4gICAgcmV0dXJuIHUuYWNjZXNzb3IoZik7XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24oYSxiKSB7XG4gICAgdmFyIGksIG4sIGYsIHgsIHk7XG4gICAgZm9yIChpPTAsIG49c29ydC5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgICBmID0gc29ydFtpXTsgeCA9IGYoYSk7IHkgPSBmKGIpO1xuICAgICAgaWYgKHggPCB5KSByZXR1cm4gLTEgKiBzaWduW2ldO1xuICAgICAgaWYgKHggPiB5KSByZXR1cm4gc2lnbltpXTtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH07XG59O1xuXG51LmNtcCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgaWYgKGEgPCBiKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKGEgPiBiKSB7XG4gICAgcmV0dXJuIDE7XG4gIH0gZWxzZSBpZiAoYSA+PSBiKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAoYSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAtMTtcbiAgfSBlbHNlIGlmIChiID09PSBudWxsKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcmV0dXJuIE5hTjtcbn07XG5cbnUubnVtY21wID0gZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYSAtIGI7IH07XG5cbnUuc3RhYmxlc29ydCA9IGZ1bmN0aW9uKGFycmF5LCBzb3J0QnksIGtleUZuKSB7XG4gIHZhciBpbmRpY2VzID0gYXJyYXkucmVkdWNlKGZ1bmN0aW9uKGlkeCwgdiwgaSkge1xuICAgIHJldHVybiAoaWR4W2tleUZuKHYpXSA9IGksIGlkeCk7XG4gIH0sIHt9KTtcblxuICBhcnJheS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgc2EgPSBzb3J0QnkoYSksXG4gICAgICAgIHNiID0gc29ydEJ5KGIpO1xuICAgIHJldHVybiBzYSA8IHNiID8gLTEgOiBzYSA+IHNiID8gMVxuICAgICAgICAgOiAoaW5kaWNlc1trZXlGbihhKV0gLSBpbmRpY2VzW2tleUZuKGIpXSk7XG4gIH0pO1xuXG4gIHJldHVybiBhcnJheTtcbn07XG5cblxuLy8gc3RyaW5nIGZ1bmN0aW9uc1xuXG51LnBhZCA9IGZ1bmN0aW9uKHMsIGxlbmd0aCwgcG9zLCBwYWRjaGFyKSB7XG4gIHBhZGNoYXIgPSBwYWRjaGFyIHx8IFwiIFwiO1xuICB2YXIgZCA9IGxlbmd0aCAtIHMubGVuZ3RoO1xuICBpZiAoZCA8PSAwKSByZXR1cm4gcztcbiAgc3dpdGNoIChwb3MpIHtcbiAgICBjYXNlICdsZWZ0JzpcbiAgICAgIHJldHVybiBzdHJyZXAoZCwgcGFkY2hhcikgKyBzO1xuICAgIGNhc2UgJ21pZGRsZSc6XG4gICAgY2FzZSAnY2VudGVyJzpcbiAgICAgIHJldHVybiBzdHJyZXAoTWF0aC5mbG9vcihkLzIpLCBwYWRjaGFyKSArXG4gICAgICAgICBzICsgc3RycmVwKE1hdGguY2VpbChkLzIpLCBwYWRjaGFyKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHMgKyBzdHJyZXAoZCwgcGFkY2hhcik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHN0cnJlcChuLCBzdHIpIHtcbiAgdmFyIHMgPSBcIlwiLCBpO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHMgKz0gc3RyO1xuICByZXR1cm4gcztcbn1cblxudS50cnVuY2F0ZSA9IGZ1bmN0aW9uKHMsIGxlbmd0aCwgcG9zLCB3b3JkLCBlbGxpcHNpcykge1xuICB2YXIgbGVuID0gcy5sZW5ndGg7XG4gIGlmIChsZW4gPD0gbGVuZ3RoKSByZXR1cm4gcztcbiAgZWxsaXBzaXMgPSBlbGxpcHNpcyAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKGVsbGlwc2lzKSA6ICdcXHUyMDI2JztcbiAgdmFyIGwgPSBNYXRoLm1heCgwLCBsZW5ndGggLSBlbGxpcHNpcy5sZW5ndGgpO1xuXG4gIHN3aXRjaCAocG9zKSB7XG4gICAgY2FzZSAnbGVmdCc6XG4gICAgICByZXR1cm4gZWxsaXBzaXMgKyAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbCwxKSA6IHMuc2xpY2UobGVuLWwpKTtcbiAgICBjYXNlICdtaWRkbGUnOlxuICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICB2YXIgbDEgPSBNYXRoLmNlaWwobC8yKSwgbDIgPSBNYXRoLmZsb29yKGwvMik7XG4gICAgICByZXR1cm4gKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwxKSA6IHMuc2xpY2UoMCxsMSkpICtcbiAgICAgICAgZWxsaXBzaXMgKyAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbDIsMSkgOiBzLnNsaWNlKGxlbi1sMikpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwpIDogcy5zbGljZSgwLGwpKSArIGVsbGlwc2lzO1xuICB9XG59O1xuXG5mdW5jdGlvbiB0cnVuY2F0ZU9uV29yZChzLCBsZW4sIHJldikge1xuICB2YXIgY250ID0gMCwgdG9rID0gcy5zcGxpdCh0cnVuY2F0ZV93b3JkX3JlKTtcbiAgaWYgKHJldikge1xuICAgIHMgPSAodG9rID0gdG9rLnJldmVyc2UoKSlcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24odykgeyBjbnQgKz0gdy5sZW5ndGg7IHJldHVybiBjbnQgPD0gbGVuOyB9KVxuICAgICAgLnJldmVyc2UoKTtcbiAgfSBlbHNlIHtcbiAgICBzID0gdG9rLmZpbHRlcihmdW5jdGlvbih3KSB7IGNudCArPSB3Lmxlbmd0aDsgcmV0dXJuIGNudCA8PSBsZW47IH0pO1xuICB9XG4gIHJldHVybiBzLmxlbmd0aCA/IHMuam9pbignJykudHJpbSgpIDogdG9rWzBdLnNsaWNlKDAsIGxlbik7XG59XG5cbnZhciB0cnVuY2F0ZV93b3JkX3JlID0gLyhbXFx1MDAwOVxcdTAwMEFcXHUwMDBCXFx1MDAwQ1xcdTAwMERcXHUwMDIwXFx1MDBBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTIwMjhcXHUyMDI5XFx1MzAwMFxcdUZFRkZdKS87XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vZ2xvYmFscycpO1xuXG52YXIgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICB2bGZpZWxkID0gcmVxdWlyZSgnLi9maWVsZCcpLFxuICB2bGVuYyA9IHJlcXVpcmUoJy4vZW5jJyksXG4gIHNjaGVtYSA9IHJlcXVpcmUoJy4vc2NoZW1hL3NjaGVtYScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gRW5jb2Rpbmcoc3BlYywgdGhlbWUpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSBzY2hlbWEuaW5zdGFudGlhdGUoKSxcbiAgICAgIHNwZWNFeHRlbmRlZCA9IHNjaGVtYS51dGlsLm1lcmdlKGRlZmF1bHRzLCB0aGVtZSB8fCB7fSwgc3BlYykgO1xuXG4gICAgdGhpcy5fZGF0YSA9IHNwZWNFeHRlbmRlZC5kYXRhO1xuICAgIHRoaXMuX21hcmt0eXBlID0gc3BlY0V4dGVuZGVkLm1hcmt0eXBlO1xuICAgIHRoaXMuX2VuYyA9IHNwZWNFeHRlbmRlZC5lbmNvZGluZztcbiAgICB0aGlzLl9jb25maWcgPSBzcGVjRXh0ZW5kZWQuY29uZmlnO1xuICAgIHRoaXMuX2ZpbHRlciA9IHNwZWNFeHRlbmRlZC5maWx0ZXI7XG4gICAgLy8gdGhpcy5fdmVnYTIgPSB0cnVlO1xuICB9XG5cbiAgdmFyIHByb3RvID0gRW5jb2RpbmcucHJvdG90eXBlO1xuXG4gIEVuY29kaW5nLmZyb21TaG9ydGhhbmQgPSBmdW5jdGlvbihzaG9ydGhhbmQsIGRhdGEsIGNvbmZpZywgdGhlbWUpIHtcbiAgICB2YXIgYyA9IGNvbnN0cy5zaG9ydGhhbmQsXG4gICAgICAgIHNwbGl0ID0gc2hvcnRoYW5kLnNwbGl0KGMuZGVsaW0pLFxuICAgICAgICBtYXJrdHlwZSA9IHNwbGl0LnNoaWZ0KCkuc3BsaXQoYy5hc3NpZ24pWzFdLnRyaW0oKSxcbiAgICAgICAgZW5jID0gdmxlbmMuZnJvbVNob3J0aGFuZChzcGxpdCk7XG5cbiAgICByZXR1cm4gbmV3IEVuY29kaW5nKHtcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBtYXJrdHlwZTogbWFya3R5cGUsXG4gICAgICBlbmNvZGluZzogZW5jLFxuICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICBmaWx0ZXI6IFtdXG4gICAgfSwgdGhlbWUpO1xuICB9O1xuXG4gIEVuY29kaW5nLmZyb21TcGVjID0gZnVuY3Rpb24oc3BlYywgdGhlbWUpIHtcbiAgICByZXR1cm4gbmV3IEVuY29kaW5nKHNwZWMsIHRoZW1lKTtcbiAgfTtcblxuICBwcm90by50b1Nob3J0aGFuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjID0gY29uc3RzLnNob3J0aGFuZDtcbiAgICByZXR1cm4gJ21hcmsnICsgYy5hc3NpZ24gKyB0aGlzLl9tYXJrdHlwZSArXG4gICAgICBjLmRlbGltICsgdmxlbmMuc2hvcnRoYW5kKHRoaXMuX2VuYyk7XG4gIH07XG5cbiAgRW5jb2Rpbmcuc2hvcnRoYW5kID0gZnVuY3Rpb24gKHNwZWMpIHtcbiAgICB2YXIgYyA9IGNvbnN0cy5zaG9ydGhhbmQ7XG4gICAgcmV0dXJuICdtYXJrJyArIGMuYXNzaWduICsgc3BlYy5tYXJrdHlwZSArXG4gICAgICBjLmRlbGltICsgdmxlbmMuc2hvcnRoYW5kKHNwZWMuZW5jb2RpbmcpO1xuICB9O1xuXG4gIEVuY29kaW5nLnNwZWNGcm9tU2hvcnRoYW5kID0gZnVuY3Rpb24oc2hvcnRoYW5kLCBkYXRhLCBjb25maWcsIGV4Y2x1ZGVDb25maWcpIHtcbiAgICByZXR1cm4gRW5jb2RpbmcuZnJvbVNob3J0aGFuZChzaG9ydGhhbmQsIGRhdGEsIGNvbmZpZykudG9TcGVjKGV4Y2x1ZGVDb25maWcpO1xuICB9O1xuXG4gIHByb3RvLnRvU3BlYyA9IGZ1bmN0aW9uKGV4Y2x1ZGVDb25maWcsIGV4Y2x1ZGVEYXRhKSB7XG4gICAgdmFyIGVuYyA9IHV0aWwuZHVwbGljYXRlKHRoaXMuX2VuYyksXG4gICAgICBzcGVjO1xuXG4gICAgc3BlYyA9IHtcbiAgICAgIG1hcmt0eXBlOiB0aGlzLl9tYXJrdHlwZSxcbiAgICAgIGVuY29kaW5nOiBlbmMsXG4gICAgICBmaWx0ZXI6IHRoaXMuX2ZpbHRlclxuICAgIH07XG5cbiAgICBpZiAoIWV4Y2x1ZGVDb25maWcpIHtcbiAgICAgIHNwZWMuY29uZmlnID0gdXRpbC5kdXBsaWNhdGUodGhpcy5fY29uZmlnKTtcbiAgICB9XG5cbiAgICBpZiAoIWV4Y2x1ZGVEYXRhKSB7XG4gICAgICBzcGVjLmRhdGEgPSB1dGlsLmR1cGxpY2F0ZSh0aGlzLl9kYXRhKTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgZGVmYXVsdHNcbiAgICB2YXIgZGVmYXVsdHMgPSBzY2hlbWEuaW5zdGFudGlhdGUoKTtcbiAgICByZXR1cm4gc2NoZW1hLnV0aWwuc3VidHJhY3Qoc3BlYywgZGVmYXVsdHMpO1xuICB9O1xuXG5cbiAgcHJvdG8ubWFya3R5cGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFya3R5cGU7XG4gIH07XG5cbiAgcHJvdG8uaXMgPSBmdW5jdGlvbihtKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcmt0eXBlID09PSBtO1xuICB9O1xuXG4gIHByb3RvLmhhcyA9IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgICAvLyBlcXVpdmFsZW50IHRvIGNhbGxpbmcgdmxlbmMuaGFzKHRoaXMuX2VuYywgZW5jVHlwZSlcbiAgICByZXR1cm4gdGhpcy5fZW5jW2VuY1R5cGVdLm5hbWUgIT09IHVuZGVmaW5lZDtcbiAgfTtcblxuICBwcm90by5maWVsZCA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF07XG4gIH07XG5cbiAgcHJvdG8uZmlsdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbHRlck51bGwgPSBbXSxcbiAgICAgIGZpZWxkcyA9IHRoaXMuZmllbGRzKCksXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIHV0aWwuZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkTGlzdCwgZmllbGROYW1lKSB7XG4gICAgICBpZiAoZmllbGROYW1lID09PSAnKicpIHJldHVybjsgLy9jb3VudFxuXG4gICAgICBpZiAoKHNlbGYuY29uZmlnKCdmaWx0ZXJOdWxsJykuUSAmJiBmaWVsZExpc3QuY29udGFpbnNUeXBlW1FdKSB8fFxuICAgICAgICAgIChzZWxmLmNvbmZpZygnZmlsdGVyTnVsbCcpLlQgJiYgZmllbGRMaXN0LmNvbnRhaW5zVHlwZVtUXSkgfHxcbiAgICAgICAgICAoc2VsZi5jb25maWcoJ2ZpbHRlck51bGwnKS5PICYmIGZpZWxkTGlzdC5jb250YWluc1R5cGVbT10pIHx8XG4gICAgICAgICAgKHNlbGYuY29uZmlnKCdmaWx0ZXJOdWxsJykuTiAmJiBmaWVsZExpc3QuY29udGFpbnNUeXBlW05dKSkge1xuICAgICAgICBmaWx0ZXJOdWxsLnB1c2goe1xuICAgICAgICAgIG9wZXJhbmRzOiBbZmllbGROYW1lXSxcbiAgICAgICAgICBvcGVyYXRvcjogJ25vdE51bGwnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZpbHRlck51bGwuY29uY2F0KHRoaXMuX2ZpbHRlcik7XG4gIH07XG5cbiAgLy8gZ2V0IFwiZmllbGRcIiByZWZlcmVuY2UgZm9yIHZlZ2FcbiAgcHJvdG8uZmllbGRSZWYgPSBmdW5jdGlvbihldCwgb3B0KSB7XG4gICAgb3B0ID0gb3B0IHx8IHt9O1xuICAgIG9wdC5kYXRhID0gIXRoaXMuX3ZlZ2EyICYmIChvcHQuZGF0YSAhPT0gZmFsc2UpO1xuICAgIHJldHVybiB2bGZpZWxkLmZpZWxkUmVmKHRoaXMuX2VuY1tldF0sIG9wdCk7XG4gIH07XG5cbiAgcHJvdG8uZmllbGROYW1lID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5uYW1lO1xuICB9O1xuXG4gIC8qXG4gICAqIHJldHVybiBrZXktdmFsdWUgcGFpcnMgb2YgZmllbGQgbmFtZSBhbmQgbGlzdCBvZiBmaWVsZHMgb2YgdGhhdCBmaWVsZCBuYW1lXG4gICAqL1xuICBwcm90by5maWVsZHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmxlbmMuZmllbGRzKHRoaXMuX2VuYyk7XG4gIH07XG5cbiAgcHJvdG8uZmllbGRUaXRsZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgaWYgKHZsZmllbGQuaXNDb3VudCh0aGlzLl9lbmNbZXRdKSkge1xuICAgICAgcmV0dXJuIHZsZmllbGQuY291bnQuZGlzcGxheU5hbWU7XG4gICAgfVxuICAgIHZhciBmbiA9IHRoaXMuX2VuY1tldF0uYWdncmVnYXRlIHx8IHRoaXMuX2VuY1tldF0udGltZVVuaXQgfHwgKHRoaXMuX2VuY1tldF0uYmluICYmICdiaW4nKTtcbiAgICBpZiAoZm4pIHtcbiAgICAgIHZhciB1cHBlcmNhc2UgPSBmbiA9PT0gJ2F2ZycgPyAnTUVBTicgOmZuLnRvVXBwZXJDYXNlKCk7XG4gICAgICByZXR1cm4gdXBwZXJjYXNlICsgJygnICsgdGhpcy5fZW5jW2V0XS5uYW1lICsgJyknO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5uYW1lO1xuICAgIH1cbiAgfTtcblxuICBwcm90by5zY2FsZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF0uc2NhbGUgfHwge307XG4gIH07XG5cbiAgcHJvdG8uYXhpcyA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF0uYXhpcyB8fCB7fTtcbiAgfTtcblxuICBwcm90by5iYW5kU2l6ZSA9IGZ1bmN0aW9uKGVuY1R5cGUsIHVzZVNtYWxsQmFuZCkge1xuICAgIHVzZVNtYWxsQmFuZCA9IHVzZVNtYWxsQmFuZCB8fFxuICAgICAgLy9pc0JhbmRJblNtYWxsTXVsdGlwbGVzXG4gICAgICAoZW5jVHlwZSA9PT0gWSAmJiB0aGlzLmhhcyhST1cpICYmIHRoaXMuaGFzKFkpKSB8fFxuICAgICAgKGVuY1R5cGUgPT09IFggJiYgdGhpcy5oYXMoQ09MKSAmJiB0aGlzLmhhcyhYKSk7XG5cbiAgICAvLyBpZiBiYW5kLnNpemUgaXMgZXhwbGljaXRseSBzcGVjaWZpZWQsIGZvbGxvdyB0aGUgc3BlY2lmaWNhdGlvbiwgb3RoZXJ3aXNlIGRyYXcgdmFsdWUgZnJvbSBjb25maWcuXG4gICAgcmV0dXJuIHRoaXMuZmllbGQoZW5jVHlwZSkuYmFuZC5zaXplIHx8XG4gICAgICB0aGlzLmNvbmZpZyh1c2VTbWFsbEJhbmQgPyAnc21hbGxCYW5kU2l6ZScgOiAnbGFyZ2VCYW5kU2l6ZScpO1xuICB9O1xuXG4gIHByb3RvLmFnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF0uYWdncmVnYXRlO1xuICB9O1xuXG4gIC8vIHJldHVybnMgZmFsc2UgaWYgYmlubmluZyBpcyBkaXNhYmxlZCwgb3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGJpbm5pbmcgcHJvcGVydGllc1xuICBwcm90by5iaW4gPSBmdW5jdGlvbihldCkge1xuICAgIHZhciBiaW4gPSB0aGlzLl9lbmNbZXRdLmJpbjtcbiAgICBpZiAoYmluID09PSB7fSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAoYmluID09PSB0cnVlKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWF4Ymluczogc2NoZW1hLk1BWEJJTlNfREVGQVVMVFxuICAgICAgfTtcbiAgICByZXR1cm4gYmluO1xuICB9O1xuXG4gIHByb3RvLnZhbHVlID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS52YWx1ZTtcbiAgfTtcblxuICBwcm90by5udW1iZXJGb3JtYXQgPSBmdW5jdGlvbihmaWVsZFN0YXRzKSB7XG4gICAgdmFyIGZvcm1hdENvbmZpZyA9IGZpZWxkU3RhdHMubWF4ID4gdGhpcy5jb25maWcoJ21heFNtYWxsTnVtYmVyJykgP1xuICAgICAgJ2xhcmdlTnVtYmVyRm9ybWF0JzogJ3NtYWxsTnVtYmVyRm9ybWF0JztcbiAgICByZXR1cm4gdGhpcy5jb25maWcoZm9ybWF0Q29uZmlnKTtcbiAgfTtcblxuICBwcm90by5zb3J0ID0gZnVuY3Rpb24oZXQsIHN0YXRzKSB7XG4gICAgdmFyIHNvcnQgPSB0aGlzLl9lbmNbZXRdLnNvcnQsXG4gICAgICBlbmMgPSB0aGlzLl9lbmMsXG4gICAgICBpc1R5cGVzID0gdmxmaWVsZC5pc1R5cGVzO1xuXG4gICAgaWYgKCghc29ydCB8fCBzb3J0Lmxlbmd0aD09PTApICYmXG4gICAgICAgIC8vIEZJWE1FXG4gICAgICAgIEVuY29kaW5nLnRvZ2dsZVNvcnQuc3VwcG9ydCh7ZW5jb2Rpbmc6dGhpcy5fZW5jfSwgc3RhdHMsIHRydWUpICYmIC8vSEFDS1xuICAgICAgICB0aGlzLmNvbmZpZygndG9nZ2xlU29ydCcpID09PSBRXG4gICAgICApIHtcbiAgICAgIHZhciBxRmllbGQgPSBpc1R5cGVzKGVuYy54LCBbTiwgT10pID8gZW5jLnkgOiBlbmMueDtcblxuICAgICAgaWYgKGlzVHlwZXMoZW5jW2V0XSwgW04sIE9dKSkge1xuICAgICAgICBzb3J0ID0gW3tcbiAgICAgICAgICBuYW1lOiBxRmllbGQubmFtZSxcbiAgICAgICAgICBhZ2dyZWdhdGU6IHFGaWVsZC5hZ2dyZWdhdGUsXG4gICAgICAgICAgdHlwZTogcUZpZWxkLnR5cGUsXG4gICAgICAgICAgcmV2ZXJzZTogdHJ1ZVxuICAgICAgICB9XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc29ydDtcbiAgfTtcblxuICBwcm90by5tYXAgPSBmdW5jdGlvbihmKSB7XG4gICAgcmV0dXJuIHZsZW5jLm1hcCh0aGlzLl9lbmMsIGYpO1xuICB9O1xuXG4gIHByb3RvLnJlZHVjZSA9IGZ1bmN0aW9uKGYsIGluaXQpIHtcbiAgICByZXR1cm4gdmxlbmMucmVkdWNlKHRoaXMuX2VuYywgZiwgaW5pdCk7XG4gIH07XG5cbiAgcHJvdG8uZm9yRWFjaCA9IGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gdmxlbmMuZm9yRWFjaCh0aGlzLl9lbmMsIGYpO1xuICB9O1xuXG4gIHByb3RvLnR5cGUgPSBmdW5jdGlvbihldCkge1xuICAgIHJldHVybiB0aGlzLmhhcyhldCkgPyB0aGlzLl9lbmNbZXRdLnR5cGUgOiBudWxsO1xuICB9O1xuXG4gIHByb3RvLmlzVHlwZSA9IGZ1bmN0aW9uKGV0LCB0eXBlKSB7XG4gICAgdmFyIGZpZWxkID0gdGhpcy5maWVsZChldCk7XG4gICAgcmV0dXJuIGZpZWxkICYmIHZsZmllbGQuaXNUeXBlKGZpZWxkLCB0eXBlKTtcbiAgfTtcblxuXG4gIHByb3RvLmlzVHlwZXMgPSBmdW5jdGlvbihldCwgdHlwZSkge1xuICAgIHZhciBmaWVsZCA9IHRoaXMuZmllbGQoZXQpO1xuICAgIHJldHVybiBmaWVsZCAmJiB2bGZpZWxkLmlzVHlwZXMoZmllbGQsIHR5cGUpO1xuICB9O1xuXG4gIEVuY29kaW5nLmlzT3JkaW5hbFNjYWxlID0gZnVuY3Rpb24oZW5jb2RpbmcsIGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdmxmaWVsZC5pc09yZGluYWxTY2FsZShlbmNvZGluZy5maWVsZChlbmNUeXBlKSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNEaW1lbnNpb24gPSBmdW5jdGlvbihlbmNvZGluZywgZW5jVHlwZSkge1xuICAgIHJldHVybiB2bGZpZWxkLmlzRGltZW5zaW9uKGVuY29kaW5nLmZpZWxkKGVuY1R5cGUpKTtcbiAgfTtcblxuICBFbmNvZGluZy5pc01lYXN1cmUgPSBmdW5jdGlvbihlbmNvZGluZywgZW5jVHlwZSkge1xuICAgIHJldHVybiB2bGZpZWxkLmlzTWVhc3VyZShlbmNvZGluZy5maWVsZChlbmNUeXBlKSk7XG4gIH07XG5cbiAgcHJvdG8uaXNPcmRpbmFsU2NhbGUgPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGVuY1R5cGUpICYmIEVuY29kaW5nLmlzT3JkaW5hbFNjYWxlKHRoaXMsIGVuY1R5cGUpO1xuICB9O1xuXG4gIHByb3RvLmlzRGltZW5zaW9uID0gZnVuY3Rpb24oZW5jVHlwZSkge1xuICAgIHJldHVybiB0aGlzLmhhcyhlbmNUeXBlKSAmJiBFbmNvZGluZy5pc0RpbWVuc2lvbih0aGlzLCBlbmNUeXBlKTtcbiAgfTtcblxuICBwcm90by5pc01lYXN1cmUgPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGVuY1R5cGUpICYmIEVuY29kaW5nLmlzTWVhc3VyZSh0aGlzLCBlbmNUeXBlKTtcbiAgfTtcblxuICBwcm90by5pc0FnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2bGVuYy5pc0FnZ3JlZ2F0ZSh0aGlzLl9lbmMpO1xuICB9O1xuXG4gIHByb3RvLmRhdGFUYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlzQWdncmVnYXRlKCkgPyBBR0dSRUdBVEUgOiBSQVc7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNBZ2dyZWdhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHZsZW5jLmlzQWdncmVnYXRlKHNwZWMuZW5jb2RpbmcpO1xuICB9O1xuXG4gIEVuY29kaW5nLmFsd2F5c05vT2NjbHVzaW9uID0gZnVuY3Rpb24oc3BlYykge1xuICAgIC8vIEZJWE1FIHJhdyBPeFEgd2l0aCAjIG9mIHJvd3MgPSAjIG9mIE9cbiAgICByZXR1cm4gdmxlbmMuaXNBZ2dyZWdhdGUoc3BlYy5lbmNvZGluZyk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNTdGFjayA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICAvLyBGSVhNRSB1cGRhdGUgdGhpcyBvbmNlIHdlIGhhdmUgY29udHJvbCBmb3Igc3RhY2sgLi4uXG4gICAgcmV0dXJuIChzcGVjLm1hcmt0eXBlID09PSAnYmFyJyB8fCBzcGVjLm1hcmt0eXBlID09PSAnYXJlYScpICYmXG4gICAgICBzcGVjLmVuY29kaW5nLmNvbG9yO1xuICB9O1xuXG4gIHByb3RvLmlzU3RhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBGSVhNRSB1cGRhdGUgdGhpcyBvbmNlIHdlIGhhdmUgY29udHJvbCBmb3Igc3RhY2sgLi4uXG4gICAgcmV0dXJuICh0aGlzLmlzKCdiYXInKSB8fCB0aGlzLmlzKCdhcmVhJykpICYmIHRoaXMuaGFzKCdjb2xvcicpO1xuICB9O1xuXG4gIHByb3RvLmRldGFpbHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZW5jb2RpbmcgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLnJlZHVjZShmdW5jdGlvbihyZWZzLCBmaWVsZCwgZW5jVHlwZSkge1xuICAgICAgaWYgKCFmaWVsZC5hZ2dyZWdhdGUgJiYgKGVuY1R5cGUgIT09IFggJiYgZW5jVHlwZSAhPT0gWSkpIHtcbiAgICAgICAgcmVmcy5wdXNoKGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZWZzO1xuICAgIH0sIFtdKTtcbiAgfTtcblxuICBwcm90by5mYWNldHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZW5jb2RpbmcgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLnJlZHVjZShmdW5jdGlvbihyZWZzLCBmaWVsZCwgZW5jVHlwZSkge1xuICAgICAgaWYgKCFmaWVsZC5hZ2dyZWdhdGUgJiYgKGVuY1R5cGUgPT0gUk9XIHx8IGVuY1R5cGUgPT0gQ09MKSkge1xuICAgICAgICByZWZzLnB1c2goZW5jb2RpbmcuZmllbGRSZWYoZW5jVHlwZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlZnM7XG4gICAgfSwgW10pO1xuICB9O1xuXG4gIHByb3RvLmNhcmRpbmFsaXR5ID0gZnVuY3Rpb24oZW5jVHlwZSwgc3RhdHMpIHtcbiAgICByZXR1cm4gdmxmaWVsZC5jYXJkaW5hbGl0eSh0aGlzLmZpZWxkKGVuY1R5cGUpLCBzdGF0cywgdGhpcy5jb25maWcoJ2ZpbHRlck51bGwnKSk7XG4gIH07XG5cbiAgcHJvdG8uaXNSYXcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNBZ2dyZWdhdGUoKTtcbiAgfTtcblxuICBwcm90by5kYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gIH07XG5cbiAgIC8vIHJldHVybnMgd2hldGhlciB0aGUgZW5jb2RpbmcgaGFzIHZhbHVlcyBlbWJlZGRlZFxuICBwcm90by5oYXNWYWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmFscyA9IHRoaXMuZGF0YSgpLnZhbHVlcztcbiAgICByZXR1cm4gdmFscyAmJiB2YWxzLmxlbmd0aDtcbiAgfTtcblxuICBwcm90by5jb25maWcgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbmZpZ1tuYW1lXTtcbiAgfTtcblxuICBFbmNvZGluZy50cmFuc3Bvc2UgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgdmFyIG9sZGVuYyA9IHNwZWMuZW5jb2RpbmcsXG4gICAgICBlbmMgPSB1dGlsLmR1cGxpY2F0ZShzcGVjLmVuY29kaW5nKTtcbiAgICBlbmMueCA9IG9sZGVuYy55O1xuICAgIGVuYy55ID0gb2xkZW5jLng7XG4gICAgZW5jLnJvdyA9IG9sZGVuYy5jb2w7XG4gICAgZW5jLmNvbCA9IG9sZGVuYy5yb3c7XG4gICAgc3BlYy5lbmNvZGluZyA9IGVuYztcbiAgICByZXR1cm4gc3BlYztcbiAgfTtcblxuICAvLyBGSVhNRTogUkVNT1ZFIGV2ZXJ5dGhpbmcgYmVsb3cgaGVyZVxuXG4gIEVuY29kaW5nLnRvZ2dsZVNvcnQgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgc3BlYy5jb25maWcgPSBzcGVjLmNvbmZpZyB8fCB7fTtcbiAgICBzcGVjLmNvbmZpZy50b2dnbGVTb3J0ID0gc3BlYy5jb25maWcudG9nZ2xlU29ydCA9PT0gUSA/IE4gOiBRO1xuICAgIHJldHVybiBzcGVjO1xuICB9O1xuXG5cbiAgRW5jb2RpbmcudG9nZ2xlU29ydC5kaXJlY3Rpb24gPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgaWYgKCFFbmNvZGluZy50b2dnbGVTb3J0LnN1cHBvcnQoc3BlYykpIHsgcmV0dXJuOyB9XG4gICAgdmFyIGVuYyA9IHNwZWMuZW5jb2Rpbmc7XG4gICAgcmV0dXJuIGVuYy54LnR5cGUgPT09IE4gPyAneCcgOiAneSc7XG4gIH07XG5cbiAgRW5jb2RpbmcudG9nZ2xlU29ydC5tb2RlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBzcGVjLmNvbmZpZy50b2dnbGVTb3J0O1xuICB9O1xuXG4gIEVuY29kaW5nLnRvZ2dsZVNvcnQuc3VwcG9ydCA9IGZ1bmN0aW9uKHNwZWMsIHN0YXRzKSB7XG4gICAgdmFyIGVuYyA9IHNwZWMuZW5jb2RpbmcsXG4gICAgICBpc1R5cGVzID0gdmxmaWVsZC5pc1R5cGVzO1xuXG4gICAgaWYgKHZsZW5jLmhhcyhlbmMsIFJPVykgfHwgdmxlbmMuaGFzKGVuYywgQ09MKSB8fFxuICAgICAgIXZsZW5jLmhhcyhlbmMsIFgpIHx8ICF2bGVuYy5oYXMoZW5jLCBZKSB8fFxuICAgICAgIUVuY29kaW5nLmFsd2F5c05vT2NjbHVzaW9uKHNwZWMsIHN0YXRzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiAoIGlzVHlwZXMoZW5jLngsIFtOLE9dKSAmJiB2bGZpZWxkLmlzTWVhc3VyZShlbmMueSkpID8gJ3gnIDpcbiAgICAgICggaXNUeXBlcyhlbmMueSwgW04sT10pICYmIHZsZmllbGQuaXNNZWFzdXJlKGVuYy54KSkgPyAneScgOiBmYWxzZTtcbiAgfTtcblxuICBFbmNvZGluZy50b2dnbGVGaWx0ZXJOdWxsTyA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICBzcGVjLmNvbmZpZyA9IHNwZWMuY29uZmlnIHx8IHt9O1xuICAgIHNwZWMuY29uZmlnLmZpbHRlck51bGwgPSBzcGVjLmNvbmZpZy5maWx0ZXJOdWxsIHx8IHsgLy9GSVhNRVxuICAgICAgVDogdHJ1ZSxcbiAgICAgIFE6IHRydWVcbiAgICB9O1xuICAgIHNwZWMuY29uZmlnLmZpbHRlck51bGwuTyA9ICFzcGVjLmNvbmZpZy5maWx0ZXJOdWxsLk87XG4gICAgcmV0dXJuIHNwZWM7XG4gIH07XG5cbiAgRW5jb2RpbmcudG9nZ2xlRmlsdGVyTnVsbE8uc3VwcG9ydCA9IGZ1bmN0aW9uKHNwZWMsIHN0YXRzKSB7XG4gICAgdmFyIGZpZWxkcyA9IHZsZW5jLmZpZWxkcyhzcGVjLmVuY29kaW5nKTtcbiAgICBmb3IgKHZhciBmaWVsZE5hbWUgaW4gZmllbGRzKSB7XG4gICAgICB2YXIgZmllbGRMaXN0ID0gZmllbGRzW2ZpZWxkTmFtZV07XG4gICAgICBpZiAoZmllbGRMaXN0LmNvbnRhaW5zVHlwZS5PICYmIGZpZWxkTmFtZSBpbiBzdGF0cyAmJiBzdGF0c1tmaWVsZE5hbWVdLm51bGxzID4gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIHJldHVybiBFbmNvZGluZztcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHNldHRlciA9IHV0aWwuc2V0dGVyLFxuICBnZXR0ZXIgPSB1dGlsLmdldHRlcixcbiAgdGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xuXG52YXIgYXhpcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmF4aXMuZGVmID0gZnVuY3Rpb24obmFtZSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMsIG9wdCkge1xuICB2YXIgaXNDb2wgPSBuYW1lID09IENPTCxcbiAgICBpc1JvdyA9IG5hbWUgPT0gUk9XLFxuICAgIHR5cGUgPSBpc0NvbCA/ICd4JyA6IGlzUm93ID8gJ3knIDogbmFtZTtcblxuICB2YXIgZGVmID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgc2NhbGU6IG5hbWUsXG4gICAgcHJvcGVydGllczoge30sXG4gICAgbGF5ZXI6IGVuY29kaW5nLmZpZWxkKG5hbWUpLmF4aXMubGF5ZXIsXG4gICAgb3JpZW50OiBheGlzLm9yaWVudChuYW1lLCBlbmNvZGluZywgc3RhdHMpXG4gIH07XG5cbiAgLy8gQWRkIGF4aXMgbGFiZWwgY3VzdG9tIHNjYWxlIChmb3IgYmluIC8gdGltZSlcbiAgZGVmID0gYXhpcy5sYWJlbHMuc2NhbGUoZGVmLCBlbmNvZGluZywgbmFtZSk7XG4gIGRlZiA9IGF4aXMubGFiZWxzLmZvcm1hdChkZWYsIG5hbWUsIGVuY29kaW5nLCBzdGF0cyk7XG4gIGRlZiA9IGF4aXMubGFiZWxzLmFuZ2xlKGRlZiwgZW5jb2RpbmcsIG5hbWUpO1xuXG4gIC8vIGZvciB4LWF4aXMsIHNldCB0aWNrcyBmb3IgUSBvciByb3RhdGUgc2NhbGUgZm9yIG9yZGluYWwgc2NhbGVcbiAgaWYgKG5hbWUgPT0gWCkge1xuICAgIGlmICgoZW5jb2RpbmcuaXNEaW1lbnNpb24oWCkgfHwgZW5jb2RpbmcuaXNUeXBlKFgsIFQpKSAmJlxuICAgICAgICAhKCdhbmdsZScgaW4gZ2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywgJ2xhYmVscyddKSkpIHtcbiAgICAgIC8vIFRPRE8oa2FuaXR3KTogSnVsIDE5LCAyMDE1IC0gIzUwNiBhZGQgY29uZGl0aW9uIGZvciByb3RhdGlvblxuICAgICAgZGVmID0gYXhpcy5sYWJlbHMucm90YXRlKGRlZik7XG4gICAgfSBlbHNlIHsgLy8gUVxuICAgICAgZGVmLnRpY2tzID0gZW5jb2RpbmcuZmllbGQobmFtZSkuYXhpcy50aWNrcztcbiAgICB9XG4gIH1cblxuICAvLyBUaXRsZU9mZnNldCBkZXBlbmRzIG9uIGxhYmVscyByb3RhdGlvblxuICBkZWYudGl0bGVPZmZzZXQgPSBheGlzLnRpdGxlT2Zmc2V0KGVuY29kaW5nLCBsYXlvdXQsIG5hbWUpO1xuXG4gIC8vZGVmLm9mZnNldCBpcyB1c2VkIGluIGF4aXMuZ3JpZFxuICBpZihpc1JvdykgZGVmLm9mZnNldCA9IGF4aXMudGl0bGVPZmZzZXQoZW5jb2RpbmcsIGxheW91dCwgWSkgKyAyMDtcbiAgLy8gRklYTUUoa2FuaXR3KTogSnVsIDE5LCAyMDE1IC0gb2Zmc2V0IGZvciBjb2x1bW4gd2hlbiB4IGlzIHB1dCBvbiB0b3BcblxuICBkZWYgPSBheGlzLmdyaWQoZGVmLCBuYW1lLCBlbmNvZGluZywgbGF5b3V0KTtcbiAgZGVmID0gYXhpcy50aXRsZShkZWYsIG5hbWUsIGVuY29kaW5nLCBsYXlvdXQsIG9wdCk7XG5cbiAgaWYgKGlzUm93IHx8IGlzQ29sKSBkZWYgPSBheGlzLmhpZGVUaWNrcyhkZWYpO1xuXG4gIHJldHVybiBkZWY7XG59O1xuXG5heGlzLm9yaWVudCA9IGZ1bmN0aW9uKG5hbWUsIGVuY29kaW5nLCBzdGF0cykge1xuICB2YXIgb3JpZW50ID0gZW5jb2RpbmcuZmllbGQobmFtZSkuYXhpcy5vcmllbnQ7XG4gIGlmIChvcmllbnQpIHJldHVybiBvcmllbnQ7XG5cbiAgaWYgKG5hbWU9PT1DT0wpIHJldHVybiAndG9wJztcblxuICAvLyB4LWF4aXMgZm9yIGxvbmcgeSAtIHB1dCBvbiB0b3BcbiAgaWYgKG5hbWU9PT1YICYmIGVuY29kaW5nLmhhcyhZKSAmJiBlbmNvZGluZy5pc09yZGluYWxTY2FsZShZKSAmJiBlbmNvZGluZy5jYXJkaW5hbGl0eShZLCBzdGF0cykgPiAzMCkge1xuICAgIHJldHVybiAndG9wJztcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5heGlzLmdyaWQgPSBmdW5jdGlvbihkZWYsIG5hbWUsIGVuY29kaW5nLCBsYXlvdXQpIHtcbiAgdmFyIGNlbGxQYWRkaW5nID0gbGF5b3V0LmNlbGxQYWRkaW5nLFxuICAgIGlzQ29sID0gbmFtZSA9PSBDT0wsXG4gICAgaXNSb3cgPSBuYW1lID09IFJPVztcblxuICBpZiAoZW5jb2RpbmcuYXhpcyhuYW1lKS5ncmlkKSB7XG4gICAgZGVmLmdyaWQgPSB0cnVlO1xuXG4gICAgaWYgKGlzQ29sKSB7XG4gICAgICAvLyBzZXQgZ3JpZCBwcm9wZXJ0eSAtLSBwdXQgdGhlIGxpbmVzIG9uIHRoZSByaWdodCB0aGUgY2VsbFxuICAgICAgZGVmLnByb3BlcnRpZXMuZ3JpZCA9IHtcbiAgICAgICAgeDoge1xuICAgICAgICAgIG9mZnNldDogbGF5b3V0LmNlbGxXaWR0aCAqICgxKyBjZWxsUGFkZGluZy8yLjApLFxuICAgICAgICAgIC8vIGRlZmF1bHQgdmFsdWUocykgLS0gdmVnYSBkb2Vzbid0IGRvIHJlY3Vyc2l2ZSBtZXJnZVxuICAgICAgICAgIHNjYWxlOiAnY29sJ1xuICAgICAgICB9LFxuICAgICAgICB5OiB7XG4gICAgICAgICAgdmFsdWU6IC1sYXlvdXQuY2VsbEhlaWdodCAqIChjZWxsUGFkZGluZy8yKSxcbiAgICAgICAgfSxcbiAgICAgICAgc3Ryb2tlOiB7IHZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2NlbGxHcmlkQ29sb3InKSB9LFxuICAgICAgICBvcGFjaXR5OiB7IHZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2NlbGxHcmlkT3BhY2l0eScpIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChpc1Jvdykge1xuICAgICAgLy8gc2V0IGdyaWQgcHJvcGVydHkgLS0gcHV0IHRoZSBsaW5lcyBvbiB0aGUgdG9wXG4gICAgICBkZWYucHJvcGVydGllcy5ncmlkID0ge1xuICAgICAgICB5OiB7XG4gICAgICAgICAgb2Zmc2V0OiAtbGF5b3V0LmNlbGxIZWlnaHQgKiAoY2VsbFBhZGRpbmcvMiksXG4gICAgICAgICAgLy8gZGVmYXVsdCB2YWx1ZShzKSAtLSB2ZWdhIGRvZXNuJ3QgZG8gcmVjdXJzaXZlIG1lcmdlXG4gICAgICAgICAgc2NhbGU6ICdyb3cnXG4gICAgICAgIH0sXG4gICAgICAgIHg6IHtcbiAgICAgICAgICB2YWx1ZTogZGVmLm9mZnNldFxuICAgICAgICB9LFxuICAgICAgICB4Mjoge1xuICAgICAgICAgIG9mZnNldDogZGVmLm9mZnNldCArIChsYXlvdXQuY2VsbFdpZHRoICogMC4wNSksXG4gICAgICAgICAgLy8gZGVmYXVsdCB2YWx1ZShzKSAtLSB2ZWdhIGRvZXNuJ3QgZG8gcmVjdXJzaXZlIG1lcmdlXG4gICAgICAgICAgZ3JvdXA6ICdtYXJrLmdyb3VwLndpZHRoJyxcbiAgICAgICAgICBtdWx0OiAxXG4gICAgICAgIH0sXG4gICAgICAgIHN0cm9rZTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsR3JpZENvbG9yJykgfSxcbiAgICAgICAgb3BhY2l0eTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsR3JpZE9wYWNpdHknKSB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWYucHJvcGVydGllcy5ncmlkID0ge1xuICAgICAgICBzdHJva2U6IHsgdmFsdWU6IGVuY29kaW5nLmNvbmZpZygnZ3JpZENvbG9yJykgfSxcbiAgICAgICAgb3BhY2l0eTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdncmlkT3BhY2l0eScpIH1cbiAgICAgIH07XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWY7XG59O1xuXG5heGlzLmhpZGVUaWNrcyA9IGZ1bmN0aW9uKGRlZikge1xuICBkZWYucHJvcGVydGllcy50aWNrcyA9IHtvcGFjaXR5OiB7dmFsdWU6IDB9fTtcbiAgZGVmLnByb3BlcnRpZXMubWFqb3JUaWNrcyA9IHtvcGFjaXR5OiB7dmFsdWU6IDB9fTtcbiAgZGVmLnByb3BlcnRpZXMuYXhpcyA9IHtvcGFjaXR5OiB7dmFsdWU6IDB9fTtcbiAgcmV0dXJuIGRlZjtcbn07XG5cbmF4aXMudGl0bGUgPSBmdW5jdGlvbiAoZGVmLCBuYW1lLCBlbmNvZGluZywgbGF5b3V0KSB7XG4gIHZhciBheCA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLmF4aXM7XG5cbiAgaWYgKGF4LnRpdGxlKSB7XG4gICAgZGVmLnRpdGxlID0gYXgudGl0bGU7XG4gIH0gZWxzZSB7XG4gICAgLy8gaWYgbm90IGRlZmluZWQsIGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lIGF4aXMgdGl0bGUgZnJvbSBmaWVsZCBkZWZcbiAgICB2YXIgZmllbGRUaXRsZSA9IGVuY29kaW5nLmZpZWxkVGl0bGUobmFtZSksXG4gICAgICBtYXhMZW5ndGg7XG5cbiAgICBpZiAoYXgudGl0bGVNYXhMZW5ndGgpIHtcbiAgICAgIG1heExlbmd0aCA9IGF4LnRpdGxlTWF4TGVuZ3RoO1xuICAgIH0gZWxzZSBpZiAobmFtZT09PVgpIHtcbiAgICAgIG1heExlbmd0aCA9IGxheW91dC5jZWxsV2lkdGggLyBlbmNvZGluZy5jb25maWcoJ2NoYXJhY3RlcldpZHRoJyk7XG4gICAgfSBlbHNlIGlmIChuYW1lID09PSBZKSB7XG4gICAgICBtYXhMZW5ndGggPSBsYXlvdXQuY2VsbEhlaWdodCAvIGVuY29kaW5nLmNvbmZpZygnY2hhcmFjdGVyV2lkdGgnKTtcbiAgICB9XG5cbiAgICBkZWYudGl0bGUgPSBtYXhMZW5ndGggPyB1dGlsLnRydW5jYXRlKGZpZWxkVGl0bGUsIG1heExlbmd0aCkgOiBmaWVsZFRpdGxlO1xuICB9XG5cbiAgaWYgKG5hbWUgPT09IFJPVykge1xuICAgIGRlZi5wcm9wZXJ0aWVzLnRpdGxlID0ge1xuICAgICAgYW5nbGU6IHt2YWx1ZTogMH0sXG4gICAgICBhbGlnbjoge3ZhbHVlOiAncmlnaHQnfSxcbiAgICAgIGJhc2VsaW5lOiB7dmFsdWU6ICdtaWRkbGUnfSxcbiAgICAgIGR5OiB7dmFsdWU6ICgtbGF5b3V0LmhlaWdodC8yKSAtMjB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBkZWY7XG59O1xuXG5heGlzLmxhYmVscyA9IHt9O1xuXG4vKiogYWRkIGN1c3RvbSBsYWJlbCBmb3IgdGltZSB0eXBlIGFuZCBiaW4gKi9cbmF4aXMubGFiZWxzLnNjYWxlID0gZnVuY3Rpb24oZGVmLCBlbmNvZGluZywgbmFtZSkge1xuICAvLyB0aW1lXG4gIHZhciB0aW1lVW5pdCA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLnRpbWVVbml0O1xuICBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFQpICYmIHRpbWVVbml0ICYmICh0aW1lLmhhc1NjYWxlKHRpbWVVbml0KSkpIHtcbiAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCdsYWJlbHMnLCd0ZXh0Jywnc2NhbGUnXSwgJ3RpbWUtJysgdGltZVVuaXQpO1xuICB9XG4gIC8vIEZJWE1FIGJpblxuICByZXR1cm4gZGVmO1xufTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgbnVtYmVyIGZvcm1hdCBvciB0cnVuY2F0ZSBpZiBtYXhMYWJlbCBsZW5ndGggaXMgcHJlc2VudGVkLlxuICovXG5heGlzLmxhYmVscy5mb3JtYXQgPSBmdW5jdGlvbiAoZGVmLCBuYW1lLCBlbmNvZGluZywgc3RhdHMpIHtcbiAgdmFyIGZpZWxkU3RhdHMgPSBzdGF0c1tlbmNvZGluZy5maWVsZChuYW1lKS5uYW1lXTtcblxuICBpZiAoZW5jb2RpbmcuYXhpcyhuYW1lKS5mb3JtYXQpIHtcbiAgICBkZWYuZm9ybWF0ID0gZW5jb2RpbmcuYXhpcyhuYW1lKS5mb3JtYXQ7XG4gIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFEpIHx8IGZpZWxkU3RhdHMudHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICBkZWYuZm9ybWF0ID0gZW5jb2RpbmcubnVtYmVyRm9ybWF0KGZpZWxkU3RhdHMpO1xuICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSkge1xuICAgIHZhciB0aW1lVW5pdCA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLnRpbWVVbml0O1xuICAgIGlmICghdGltZVVuaXQpIHtcbiAgICAgIGRlZi5mb3JtYXQgPSBlbmNvZGluZy5jb25maWcoJ3RpbWVGb3JtYXQnKTtcbiAgICB9IGVsc2UgaWYgKHRpbWVVbml0ID09PSAneWVhcicpIHtcbiAgICAgIGRlZi5mb3JtYXQgPSAnZCc7XG4gICAgfVxuICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZXMobmFtZSwgW04sIE9dKSAmJiBlbmNvZGluZy5heGlzKG5hbWUpLm1heExhYmVsTGVuZ3RoKSB7XG4gICAgc2V0dGVyKGRlZixcbiAgICAgIFsncHJvcGVydGllcycsJ2xhYmVscycsJ3RleHQnLCd0ZW1wbGF0ZSddLFxuICAgICAgJ3t7ZGF0YSB8IHRydW5jYXRlOicgKyBlbmNvZGluZy5heGlzKG5hbWUpLm1heExhYmVsTGVuZ3RoICsgJ319J1xuICAgICAgKTtcbiAgfVxuXG4gIHJldHVybiBkZWY7XG59O1xuXG5heGlzLmxhYmVscy5hbmdsZSA9IGZ1bmN0aW9uKGRlZiwgZW5jb2RpbmcsIG5hbWUpIHtcbiAgdmFyIGFuZ2xlID0gZW5jb2RpbmcuYXhpcyhuYW1lKS5sYWJlbEFuZ2xlO1xuICBpZiAodHlwZW9mIGFuZ2xlID09PSAndW5kZWZpbmVkJykgcmV0dXJuIGRlZjtcblxuICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCAnbGFiZWxzJywgJ2FuZ2xlJywgJ3ZhbHVlJ10sIGFuZ2xlKTtcbiAgcmV0dXJuIGRlZjtcbn07XG5cbmF4aXMubGFiZWxzLnJvdGF0ZSA9IGZ1bmN0aW9uKGRlZikge1xuIHZhciBhbGlnbiA9IGRlZi5vcmllbnQgPT09J3RvcCcgPyAnbGVmdCcgOiAncmlnaHQnO1xuIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsJ2xhYmVscycsICdhbmdsZScsICd2YWx1ZSddLCAyNzApO1xuIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsJ2xhYmVscycsICdhbGlnbicsICd2YWx1ZSddLCBhbGlnbik7XG4gc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywnbGFiZWxzJywgJ2Jhc2VsaW5lJywgJ3ZhbHVlJ10sICdtaWRkbGUnKTtcbiByZXR1cm4gZGVmO1xufTtcblxuYXhpcy50aXRsZU9mZnNldCA9IGZ1bmN0aW9uIChlbmNvZGluZywgbGF5b3V0LCBuYW1lKSB7XG4gIC8vIHJldHVybiBzcGVjaWZpZWQgdmFsdWUgaWYgc3BlY2lmaWVkXG4gIHZhciB2YWx1ZSA9IGVuY29kaW5nLmF4aXMobmFtZSkudGl0bGVPZmZzZXQ7XG4gIGlmICh2YWx1ZSkgIHJldHVybiB2YWx1ZTtcblxuICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAvL0ZJWE1FIG1ha2UgdGhpcyBhZGp1c3RhYmxlXG4gICAgY2FzZSBST1c6IHJldHVybiAwO1xuICAgIGNhc2UgQ09MOiByZXR1cm4gMzU7XG4gIH1cbiAgcmV0dXJuIGdldHRlcihsYXlvdXQsIFtuYW1lLCAnYXhpc1RpdGxlT2Zmc2V0J10pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN1bW1hcnkgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ2RhdGFsaWIvc3JjL3N0YXRzJykuc3VtbWFyeTtcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgY29tcGlsZXIgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG52YXIgRW5jb2RpbmcgPSByZXF1aXJlKCcuLi9FbmNvZGluZycpLFxuICBheGlzID0gY29tcGlsZXIuYXhpcyA9IHJlcXVpcmUoJy4vYXhpcycpLFxuICBsZWdlbmQgPSBjb21waWxlci5sZWdlbmQgPSByZXF1aXJlKCcuL2xlZ2VuZCcpLFxuICBtYXJrcyA9IGNvbXBpbGVyLm1hcmtzID0gcmVxdWlyZSgnLi9tYXJrcycpLFxuICBzY2FsZSA9IGNvbXBpbGVyLnNjYWxlID0gcmVxdWlyZSgnLi9zY2FsZScpO1xuXG5jb21waWxlci5kYXRhID0gcmVxdWlyZSgnLi9kYXRhJyk7XG5jb21waWxlci5mYWNldCA9IHJlcXVpcmUoJy4vZmFjZXQnKTtcbmNvbXBpbGVyLmdyb3VwID0gcmVxdWlyZSgnLi9ncm91cCcpO1xuY29tcGlsZXIubGF5b3V0ID0gcmVxdWlyZSgnLi9sYXlvdXQnKTtcbmNvbXBpbGVyLnNvcnQgPSByZXF1aXJlKCcuL3NvcnQnKTtcbmNvbXBpbGVyLnN0YWNrID0gcmVxdWlyZSgnLi9zdGFjaycpO1xuY29tcGlsZXIuc3R5bGUgPSByZXF1aXJlKCcuL3N0eWxlJyk7XG5jb21waWxlci5zdWJmYWNldCA9IHJlcXVpcmUoJy4vc3ViZmFjZXQnKTtcbmNvbXBpbGVyLnRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKTtcblxuY29tcGlsZXIuY29tcGlsZSA9IGZ1bmN0aW9uIChzcGVjLCBzdGF0cywgdGhlbWUpIHtcbiAgcmV0dXJuIGNvbXBpbGVyLmNvbXBpbGVFbmNvZGluZyhFbmNvZGluZy5mcm9tU3BlYyhzcGVjLCB0aGVtZSksIHN0YXRzKTtcbn07XG5cbmNvbXBpbGVyLnNob3J0aGFuZCA9IGZ1bmN0aW9uIChzaG9ydGhhbmQsIHN0YXRzLCBjb25maWcsIHRoZW1lKSB7XG4gIHJldHVybiBjb21waWxlci5jb21waWxlRW5jb2RpbmcoRW5jb2RpbmcuZnJvbVNob3J0aGFuZChzaG9ydGhhbmQsIGNvbmZpZywgdGhlbWUpLCBzdGF0cyk7XG59O1xuXG5cbmNvbXBpbGVyLmNvbXBpbGVFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhdHMpIHtcbiAgLy8gbm8gbmVlZCB0byBwYXNzIHN0YXRzIGlmIHlvdSBwYXNzIGluIHRoZSBkYXRhXG4gIGlmICghc3RhdHMpIHtcbiAgICBpZiAoZW5jb2RpbmcuaGFzVmFsdWVzKCkpIHtcbiAgICAgICAgc3RhdHMgPSBzdW1tYXJ5KGVuY29kaW5nLmRhdGEoKS52YWx1ZXMpLnJlZHVjZShmdW5jdGlvbihzLCBwKSB7XG4gICAgICAgIHNbcC5maWVsZF0gPSBwO1xuICAgICAgICByZXR1cm4gcztcbiAgICAgIH0sIHt9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcignTm8gc3RhdHMgcHJvdmlkZWQgYW5kIGRhdGEgaXMgbm90IGVtYmVkZGVkLicpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBsYXlvdXQgPSBjb21waWxlci5sYXlvdXQoZW5jb2RpbmcsIHN0YXRzKTtcblxuICB2YXIgc3BlYyA9IHtcbiAgICAgIHdpZHRoOiBsYXlvdXQud2lkdGgsXG4gICAgICBoZWlnaHQ6IGxheW91dC5oZWlnaHQsXG4gICAgICBwYWRkaW5nOiAnYXV0bycsXG4gICAgICBkYXRhOiBjb21waWxlci5kYXRhKGVuY29kaW5nKSxcbiAgICAgIC8vIGdsb2JhbCBzY2FsZXMgY29udGFpbnMgb25seSB0aW1lIHVuaXQgc2NhbGVzXG4gICAgICBzY2FsZXM6IGNvbXBpbGVyLnRpbWUuc2NhbGVzKGVuY29kaW5nKVxuICAgIH07XG5cbiAgLy8gRklYTUUgcmVtb3ZlIGNvbXBpbGVyLnNvcnQgYWZ0ZXIgbWlncmF0aW5nIHRvIHZlZ2EgMi5cbiAgc3BlYy5kYXRhID0gY29tcGlsZXIuc29ydChzcGVjLmRhdGEsIGVuY29kaW5nLCBzdGF0cyk7IC8vIGFwcGVuZCBuZXcgZGF0YVxuXG4gIC8vIG1hcmtzXG5cbiAgLy8gVE9ETyB0aGlzIGxpbmUgaXMgdGVtcG9yYXJ5IGFuZCBzaG91bGQgYmUgcmVmYWN0b3JlZFxuICBzcGVjLm1hcmtzID0gW2NvbXBpbGVyLmdyb3VwLmRlZignY2VsbCcsIHtcbiAgICB3aWR0aDogbGF5b3V0LmNlbGxXaWR0aCA/IHt2YWx1ZTogbGF5b3V0LmNlbGxXaWR0aH0gOiB1bmRlZmluZWQsXG4gICAgaGVpZ2h0OiBsYXlvdXQuY2VsbEhlaWdodCA/IHt2YWx1ZTogbGF5b3V0LmNlbGxIZWlnaHR9IDogdW5kZWZpbmVkXG4gIH0pXTtcblxuICB2YXIgc3R5bGUgPSBjb21waWxlci5zdHlsZShlbmNvZGluZywgc3RhdHMpLFxuICAgIGdyb3VwID0gc3BlYy5tYXJrc1swXSxcbiAgICBtZGVmcyA9IG1hcmtzLmRlZihlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgc3RhdHMpLFxuICAgIG1kZWYgPSBtZGVmc1ttZGVmcy5sZW5ndGggLSAxXTsgIC8vIFRPRE86IHJlbW92ZSB0aGlzIGRpcnR5IGhhY2sgYnkgcmVmYWN0b3JpbmcgdGhlIHdob2xlIGZsb3dcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG1kZWZzLmxlbmd0aDsgaSsrKSB7XG4gICAgZ3JvdXAubWFya3MucHVzaChtZGVmc1tpXSk7XG4gIH1cblxuICB2YXIgbGluZVR5cGUgPSBtYXJrc1tlbmNvZGluZy5tYXJrdHlwZSgpXS5saW5lO1xuXG4gIC8vIGhhbmRsZSBzdWJmYWNldHNcblxuICB2YXIgZGV0YWlscyA9IGVuY29kaW5nLmRldGFpbHMoKSxcbiAgICBzdGFjayA9IGVuY29kaW5nLmlzQWdncmVnYXRlKCkgJiYgZGV0YWlscy5sZW5ndGggPiAwICYmIGNvbXBpbGVyLnN0YWNrKHNwZWMuZGF0YSwgZW5jb2RpbmcsIG1kZWYpOyAvLyBtb2RpZnkgc3BlYy5kYXRhLCBtZGVmLntmcm9tLHByb3BlcnRpZXN9XG5cbiAgaWYgKGRldGFpbHMubGVuZ3RoID4gMCAmJiAoc3RhY2sgfHwgbGluZVR5cGUpKSB7XG4gICAgLy9zdWJmYWNldCB0byBncm91cCBzdGFjayAvIGxpbmUgdG9nZXRoZXIgaW4gb25lIGdyb3VwXG4gICAgY29tcGlsZXIuc3ViZmFjZXQoZ3JvdXAsIG1kZWYsIGRldGFpbHMsIHN0YWNrLCBlbmNvZGluZyk7XG4gIH1cblxuICAvLyBhdXRvLXNvcnQgbGluZS9hcmVhIHZhbHVlc1xuICBpZiAobGluZVR5cGUgJiYgZW5jb2RpbmcuY29uZmlnKCdhdXRvU29ydExpbmUnKSkge1xuICAgIHZhciBmID0gKGVuY29kaW5nLmlzTWVhc3VyZShYKSAmJiBlbmNvZGluZy5pc0RpbWVuc2lvbihZKSkgPyBZIDogWDtcbiAgICBpZiAoIW1kZWYuZnJvbSkgbWRlZi5mcm9tID0ge307XG4gICAgLy8gVE9ETzogd2h5IC0gP1xuICAgIG1kZWYuZnJvbS50cmFuc2Zvcm0gPSBbe3R5cGU6ICdzb3J0JywgYnk6ICctJyArIGVuY29kaW5nLmZpZWxkUmVmKGYpfV07XG4gIH1cblxuICAvLyBnZXQgYSBmbGF0dGVuZWQgbGlzdCBvZiBhbGwgc2NhbGUgbmFtZXMgdGhhdCBhcmUgdXNlZCBpbiB0aGUgdmwgc3BlY1xuICB2YXIgc2luZ2xlU2NhbGVOYW1lcyA9IFtdLmNvbmNhdC5hcHBseShbXSwgbWRlZnMubWFwKGZ1bmN0aW9uKG1hcmtQcm9wcykge1xuICAgIHJldHVybiBzY2FsZS5uYW1lcyhtYXJrUHJvcHMucHJvcGVydGllcy51cGRhdGUpO1xuICB9KSk7XG5cbiAgLy8gU21hbGwgTXVsdGlwbGVzXG4gIGlmIChlbmNvZGluZy5oYXMoUk9XKSB8fCBlbmNvZGluZy5oYXMoQ09MKSkge1xuICAgIHNwZWMgPSBjb21waWxlci5mYWNldChncm91cCwgZW5jb2RpbmcsIGxheW91dCwgc3BlYywgc2luZ2xlU2NhbGVOYW1lcywgc3RhY2ssIHN0YXRzKTtcbiAgICBzcGVjLmxlZ2VuZHMgPSBsZWdlbmQuZGVmcyhlbmNvZGluZywgc3R5bGUpO1xuICB9IGVsc2Uge1xuICAgIGdyb3VwLnNjYWxlcyA9IHNjYWxlLmRlZnMoc2luZ2xlU2NhbGVOYW1lcywgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMsIHtzdGFjazogc3RhY2t9KTtcblxuICAgIGdyb3VwLmF4ZXMgPSBbXTtcbiAgICBpZiAoZW5jb2RpbmcuaGFzKFgpKSBncm91cC5heGVzLnB1c2goYXhpcy5kZWYoWCwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpKTtcbiAgICBpZiAoZW5jb2RpbmcuaGFzKFkpKSBncm91cC5heGVzLnB1c2goYXhpcy5kZWYoWSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpKTtcblxuICAgIGdyb3VwLmxlZ2VuZHMgPSBsZWdlbmQuZGVmcyhlbmNvZGluZywgc3R5bGUpO1xuICB9XG5cblxuXG4gIHJldHVybiBzcGVjO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGF0YTtcblxudmFyIHZsZmllbGQgPSByZXF1aXJlKCcuLi9maWVsZCcpLFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICB0aW1lID0gcmVxdWlyZSgnLi90aW1lJyk7XG5cbmZ1bmN0aW9uIGRhdGEoZW5jb2RpbmcpIHtcbiAgdmFyIGRlZiA9IFtkYXRhLnJhdyhlbmNvZGluZyldO1xuXG4gIHZhciBhZ2dyZWdhdGUgPSBkYXRhLmFnZ3JlZ2F0ZShlbmNvZGluZyk7XG4gIGlmIChhZ2dyZWdhdGUpIGRlZi5wdXNoKGRhdGEuYWdncmVnYXRlKGVuY29kaW5nKSk7XG5cbiAgLy8gVE9ETyBhZGQgXCJoYXZpbmdcIiBmaWx0ZXIgaGVyZVxuXG4gIC8vIGFwcGVuZCBub24tcG9zaXRpdmUgZmlsdGVyIGF0IHRoZSBlbmQgZm9yIHRoZSBkYXRhIHRhYmxlXG4gIGRhdGEuZmlsdGVyTm9uUG9zaXRpdmUoZGVmW2RlZi5sZW5ndGggLSAxXSwgZW5jb2RpbmcpO1xuXG4gIHJldHVybiBkZWY7XG59XG5cbmRhdGEucmF3ID0gZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgdmFyIHJhdyA9IHtuYW1lOiBSQVd9O1xuXG4gIC8vIERhdGEgc291cmNlICh1cmwgb3IgaW5saW5lKVxuICBpZiAoZW5jb2RpbmcuaGFzVmFsdWVzKCkpIHtcbiAgICByYXcudmFsdWVzID0gZW5jb2RpbmcuZGF0YSgpLnZhbHVlcztcbiAgfSBlbHNlIHtcbiAgICByYXcudXJsID0gZW5jb2RpbmcuZGF0YSgpLnVybDtcbiAgICByYXcuZm9ybWF0ID0ge3R5cGU6IGVuY29kaW5nLmRhdGEoKS5mb3JtYXRUeXBlfTtcbiAgfVxuXG4gIC8vIFNldCBmb3JtYXQucGFyc2UgaWYgbmVlZGVkXG4gIHZhciBwYXJzZSA9IGRhdGEucmF3LmZvcm1hdFBhcnNlKGVuY29kaW5nKTtcbiAgaWYgKHBhcnNlKSB7XG4gICAgcmF3LmZvcm1hdCA9IHJhdy5mb3JtYXQgfHwge307XG4gICAgcmF3LmZvcm1hdC5wYXJzZSA9IHBhcnNlO1xuICB9XG5cbiAgcmF3LnRyYW5zZm9ybSA9IGRhdGEucmF3LnRyYW5zZm9ybShlbmNvZGluZyk7XG4gIHJldHVybiByYXc7XG59O1xuXG5kYXRhLnJhdy5mb3JtYXRQYXJzZSA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gIHZhciBwYXJzZTtcblxuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT0gVCkge1xuICAgICAgcGFyc2UgPSBwYXJzZSB8fCB7fTtcbiAgICAgIHBhcnNlW2ZpZWxkLm5hbWVdID0gJ2RhdGUnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PSBRKSB7XG4gICAgICBpZiAodmxmaWVsZC5pc0NvdW50KGZpZWxkKSkgcmV0dXJuO1xuICAgICAgcGFyc2UgPSBwYXJzZSB8fCB7fTtcbiAgICAgIHBhcnNlW2ZpZWxkLm5hbWVdID0gJ251bWJlcic7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2U7XG59O1xuXG5kYXRhLnJhdy50cmFuc2Zvcm0gPSBmdW5jdGlvbihlbmNvZGluZykge1xuICAvLyB0aW1lIGFuZCBiaW4gc2hvdWxkIGNvbWUgYmVmb3JlIGZpbHRlciBzbyB3ZSBjYW4gZmlsdGVyIGJ5IHRpbWUgYW5kIGJpblxuICByZXR1cm4gZGF0YS5yYXcudHJhbnNmb3JtLnRpbWUoZW5jb2RpbmcpLmNvbmNhdChcbiAgICBkYXRhLnJhdy50cmFuc2Zvcm0uYmluKGVuY29kaW5nKSxcbiAgICBkYXRhLnJhdy50cmFuc2Zvcm0uZmlsdGVyKGVuY29kaW5nKVxuICApO1xufTtcblxudmFyIEJJTkFSWSA9IHtcbiAgJz4nOiAgdHJ1ZSxcbiAgJz49JzogdHJ1ZSxcbiAgJz0nOiAgdHJ1ZSxcbiAgJyE9JzogdHJ1ZSxcbiAgJzwnOiAgdHJ1ZSxcbiAgJzw9JzogdHJ1ZVxufTtcblxuZGF0YS5yYXcudHJhbnNmb3JtLnRpbWUgPSBmdW5jdGlvbihlbmNvZGluZykge1xuICByZXR1cm4gZW5jb2RpbmcucmVkdWNlKGZ1bmN0aW9uKHRyYW5zZm9ybSwgZmllbGQsIGVuY1R5cGUpIHtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gVCAmJiBmaWVsZC50aW1lVW5pdCkge1xuICAgICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgIGZpZWxkOiBlbmNvZGluZy5maWVsZFJlZihlbmNUeXBlKSxcbiAgICAgICAgZXhwcjogdGltZS5mb3JtdWxhKGZpZWxkLnRpbWVVbml0LCBlbmNvZGluZy5maWVsZFJlZihlbmNUeXBlLCB7bm9mbjogdHJ1ZSwgZDogdHJ1ZX0pKVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cmFuc2Zvcm07XG4gIH0sIFtdKTtcbn07XG5cbmRhdGEucmF3LnRyYW5zZm9ybS5iaW4gPSBmdW5jdGlvbihlbmNvZGluZykge1xuICByZXR1cm4gZW5jb2RpbmcucmVkdWNlKGZ1bmN0aW9uKHRyYW5zZm9ybSwgZmllbGQsIGVuY1R5cGUpIHtcbiAgICBpZiAoZW5jb2RpbmcuYmluKGVuY1R5cGUpKSB7XG4gICAgICB0cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgIHR5cGU6ICdiaW4nLFxuICAgICAgICBmaWVsZDogZW5jb2RpbmcuZmllbGRSZWYoZW5jVHlwZSwge25vZm46IHRydWV9KSxcbiAgICAgICAgb3V0cHV0OiBlbmNvZGluZy5maWVsZFJlZihlbmNUeXBlKSxcbiAgICAgICAgbWF4YmluczogZW5jb2RpbmcuYmluKGVuY1R5cGUpLm1heGJpbnNcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJhbnNmb3JtO1xuICB9LCBbXSk7XG59O1xuXG5kYXRhLnJhdy50cmFuc2Zvcm0uZmlsdGVyID0gZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgdmFyIGZpbHRlcnMgPSBlbmNvZGluZy5maWx0ZXIoKS5yZWR1Y2UoZnVuY3Rpb24oZiwgZmlsdGVyKSB7XG4gICAgdmFyIGNvbmRpdGlvbiA9ICcnO1xuICAgIHZhciBvcGVyYXRvciA9IGZpbHRlci5vcGVyYXRvcjtcbiAgICB2YXIgb3BlcmFuZHMgPSBmaWx0ZXIub3BlcmFuZHM7XG5cbiAgICB2YXIgZCA9ICdkLicgKyAoZW5jb2RpbmcuX3ZlZ2EyID8gJycgOiAnZGF0YS4nKTtcblxuICAgIGlmIChCSU5BUllbb3BlcmF0b3JdKSB7XG4gICAgICAvLyBleHBlY3RzIGEgZmllbGQgYW5kIGEgdmFsdWVcbiAgICAgIGlmIChvcGVyYXRvciA9PT0gJz0nKSB7XG4gICAgICAgIG9wZXJhdG9yID0gJz09JztcbiAgICAgIH1cblxuICAgICAgdmFyIG9wMSA9IG9wZXJhbmRzWzBdO1xuICAgICAgdmFyIG9wMiA9IG9wZXJhbmRzWzFdO1xuICAgICAgY29uZGl0aW9uID0gZCArIG9wMSArICcgJyArIG9wZXJhdG9yICsgJyAnICsgb3AyO1xuICAgIH0gZWxzZSBpZiAob3BlcmF0b3IgPT09ICdub3ROdWxsJykge1xuICAgICAgLy8gZXhwZWN0cyBhIG51bWJlciBvZiBmaWVsZHNcbiAgICAgIGZvciAodmFyIGo9MDsgajxvcGVyYW5kcy5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25kaXRpb24gKz0gZCArIG9wZXJhbmRzW2pdICsgJyE9PW51bGwnO1xuICAgICAgICBpZiAoaiA8IG9wZXJhbmRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBjb25kaXRpb24gKz0gJyAmJiAnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHV0aWwud2FybignVW5zdXBwb3J0ZWQgb3BlcmF0b3I6ICcsIG9wZXJhdG9yKTtcbiAgICAgIHJldHVybiBmO1xuICAgIH1cbiAgICBmLnB1c2goJygnICsgY29uZGl0aW9uICsgJyknKTtcbiAgICByZXR1cm4gZjtcbiAgfSwgW10pO1xuICBpZiAoZmlsdGVycy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICByZXR1cm4gW3tcbiAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgdGVzdDogZmlsdGVycy5qb2luKCcgJiYgJylcbiAgfV07XG59O1xuXG5kYXRhLmFnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gIHZhciBkaW1zID0ge30sIG1lYXMgPSB7fTtcblxuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgaWYgKGZpZWxkLmFnZ3JlZ2F0ZSkge1xuICAgICAgaWYgKGZpZWxkLmFnZ3JlZ2F0ZSA9PT0gJ2NvdW50Jykge1xuICAgICAgICBtZWFzLmNvdW50ID0ge29wOiAnY291bnQnLCBmaWVsZDogJyonfTtcbiAgICAgIH1lbHNlIHtcbiAgICAgICAgbWVhc1tmaWVsZC5hZ2dyZWdhdGUgKyAnfCcgKyBmaWVsZC5uYW1lXSA9IHtcbiAgICAgICAgICBvcDogZmllbGQuYWdncmVnYXRlLFxuICAgICAgICAgIGZpZWxkOiBlbmNvZGluZy5maWVsZFJlZihlbmNUeXBlLCB7bm9mbjogdHJ1ZX0pXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpbXNbZmllbGQubmFtZV0gPSBlbmNvZGluZy5maWVsZFJlZihlbmNUeXBlKTtcbiAgICB9XG4gIH0pO1xuXG4gIGRpbXMgPSB1dGlsLnZhbHMoZGltcyk7XG4gIG1lYXMgPSB1dGlsLnZhbHMobWVhcyk7XG5cbiAgaWYgKG1lYXMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBBR0dSRUdBVEUsXG4gICAgICBzb3VyY2U6IFJBVyxcbiAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGdyb3VwYnk6IGRpbXMsXG4gICAgICAgIGZpZWxkczogbWVhc1xuICAgICAgfV1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5kYXRhLmZpbHRlck5vblBvc2l0aXZlID0gZnVuY3Rpb24oZGF0YVRhYmxlLCBlbmNvZGluZykge1xuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgaWYgKGVuY29kaW5nLnNjYWxlKGVuY1R5cGUpLnR5cGUgPT09ICdsb2cnKSB7XG4gICAgICBkYXRhVGFibGUudHJhbnNmb3JtLnB1c2goe1xuICAgICAgICB0eXBlOiAnZmlsdGVyJyxcbiAgICAgICAgdGVzdDogZW5jb2RpbmcuZmllbGRSZWYoZW5jVHlwZSwge2Q6IDF9KSArICcgPiAwJ1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbnZhciBheGlzID0gcmVxdWlyZSgnLi9heGlzJyksXG4gIGdyb3VwZGVmID0gcmVxdWlyZSgnLi9ncm91cCcpLmRlZixcbiAgc2NhbGUgPSByZXF1aXJlKCcuL3NjYWxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjZXRpbmc7XG5cbmZ1bmN0aW9uIGZhY2V0aW5nKGdyb3VwLCBlbmNvZGluZywgbGF5b3V0LCBzcGVjLCBzaW5nbGVTY2FsZU5hbWVzLCBzdGFjaywgc3RhdHMpIHtcbiAgdmFyIGVudGVyID0gZ3JvdXAucHJvcGVydGllcy5lbnRlcjtcbiAgdmFyIGZhY2V0S2V5cyA9IFtdLCBjZWxsQXhlcyA9IFtdLCBmcm9tLCBheGVzR3JwO1xuXG4gIHZhciBoYXNSb3cgPSBlbmNvZGluZy5oYXMoUk9XKSwgaGFzQ29sID0gZW5jb2RpbmcuaGFzKENPTCk7XG5cbiAgZW50ZXIuZmlsbCA9IHt2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsQmFja2dyb3VuZENvbG9yJyl9O1xuXG4gIC8vbW92ZSBcImZyb21cIiB0byBjZWxsIGxldmVsIGFuZCBhZGQgZmFjZXQgdHJhbnNmb3JtXG4gIGdyb3VwLmZyb20gPSB7ZGF0YTogZ3JvdXAubWFya3NbMF0uZnJvbS5kYXRhfTtcblxuICAvLyBIYWNrLCB0aGlzIG5lZWRzIHRvIGJlIHJlZmFjdG9yZWRcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBncm91cC5tYXJrcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBtYXJrID0gZ3JvdXAubWFya3NbaV07XG4gICAgaWYgKG1hcmsuZnJvbS50cmFuc2Zvcm0pIHtcbiAgICAgIGRlbGV0ZSBtYXJrLmZyb20uZGF0YTsgLy9uZWVkIHRvIGtlZXAgdHJhbnNmb3JtIGZvciBzdWJmYWNldHRpbmcgY2FzZVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgbWFyay5mcm9tO1xuICAgIH1cbiAgfVxuXG4gIGlmIChoYXNSb3cpIHtcbiAgICBpZiAoIWVuY29kaW5nLmlzRGltZW5zaW9uKFJPVykpIHtcbiAgICAgIHV0aWwuZXJyb3IoJ1JvdyBlbmNvZGluZyBzaG91bGQgYmUgb3JkaW5hbC4nKTtcbiAgICB9XG4gICAgZW50ZXIueSA9IHtzY2FsZTogUk9XLCBmaWVsZDogJ2tleXMuJyArIGZhY2V0S2V5cy5sZW5ndGh9O1xuICAgIGVudGVyLmhlaWdodCA9IHsndmFsdWUnOiBsYXlvdXQuY2VsbEhlaWdodH07IC8vIEhBQ0tcblxuICAgIGZhY2V0S2V5cy5wdXNoKGVuY29kaW5nLmZpZWxkUmVmKFJPVykpO1xuXG4gICAgaWYgKGhhc0NvbCkge1xuICAgICAgZnJvbSA9IHV0aWwuZHVwbGljYXRlKGdyb3VwLmZyb20pO1xuICAgICAgZnJvbS50cmFuc2Zvcm0gPSBmcm9tLnRyYW5zZm9ybSB8fCBbXTtcbiAgICAgIGZyb20udHJhbnNmb3JtLnVuc2hpZnQoe3R5cGU6ICdmYWNldCcsIGtleXM6IFtlbmNvZGluZy5maWVsZFJlZihDT0wpXX0pO1xuICAgIH1cblxuICAgIGF4ZXNHcnAgPSBncm91cGRlZigneC1heGVzJywge1xuICAgICAgICBheGVzOiBlbmNvZGluZy5oYXMoWCkgPyBbYXhpcy5kZWYoWCwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgeDogaGFzQ29sID8ge3NjYWxlOiBDT0wsIGZpZWxkOiAna2V5cy4wJ30gOiB7dmFsdWU6IDB9LFxuICAgICAgICB3aWR0aDogaGFzQ29sICYmIHsndmFsdWUnOiBsYXlvdXQuY2VsbFdpZHRofSwgLy9IQUNLP1xuICAgICAgICBmcm9tOiBmcm9tXG4gICAgICB9KTtcblxuICAgIHNwZWMubWFya3MudW5zaGlmdChheGVzR3JwKTsgLy8gbmVlZCB0byBwcmVwZW5kIHNvIGl0IGFwcGVhcnMgdW5kZXIgdGhlIHBsb3RzXG4gICAgKHNwZWMuYXhlcyA9IHNwZWMuYXhlcyB8fCBbXSk7XG4gICAgc3BlYy5heGVzLnB1c2goYXhpcy5kZWYoUk9XLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykpO1xuICB9IGVsc2UgeyAvLyBkb2Vzbid0IGhhdmUgcm93XG4gICAgaWYgKGVuY29kaW5nLmhhcyhYKSkge1xuICAgICAgLy9rZWVwIHggYXhpcyBpbiB0aGUgY2VsbFxuICAgICAgY2VsbEF4ZXMucHVzaChheGlzLmRlZihYLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChoYXNDb2wpIHtcbiAgICBpZiAoIWVuY29kaW5nLmlzRGltZW5zaW9uKENPTCkpIHtcbiAgICAgIHV0aWwuZXJyb3IoJ0NvbCBlbmNvZGluZyBzaG91bGQgYmUgb3JkaW5hbC4nKTtcbiAgICB9XG4gICAgZW50ZXIueCA9IHtzY2FsZTogQ09MLCBmaWVsZDogJ2tleXMuJyArIGZhY2V0S2V5cy5sZW5ndGh9O1xuICAgIGVudGVyLndpZHRoID0geyd2YWx1ZSc6IGxheW91dC5jZWxsV2lkdGh9OyAvLyBIQUNLXG5cbiAgICBmYWNldEtleXMucHVzaChlbmNvZGluZy5maWVsZFJlZihDT0wpKTtcblxuICAgIGlmIChoYXNSb3cpIHtcbiAgICAgIGZyb20gPSB1dGlsLmR1cGxpY2F0ZShncm91cC5mcm9tKTtcbiAgICAgIGZyb20udHJhbnNmb3JtID0gZnJvbS50cmFuc2Zvcm0gfHwgW107XG4gICAgICBmcm9tLnRyYW5zZm9ybS51bnNoaWZ0KHt0eXBlOiAnZmFjZXQnLCBrZXlzOiBbZW5jb2RpbmcuZmllbGRSZWYoUk9XKV19KTtcbiAgICB9XG5cbiAgICBheGVzR3JwID0gZ3JvdXBkZWYoJ3ktYXhlcycsIHtcbiAgICAgIGF4ZXM6IGVuY29kaW5nLmhhcyhZKSA/IFtheGlzLmRlZihZLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cyldIDogdW5kZWZpbmVkLFxuICAgICAgeTogaGFzUm93ICYmIHtzY2FsZTogUk9XLCBmaWVsZDogJ2tleXMuMCd9LFxuICAgICAgeDogaGFzUm93ICYmIHt2YWx1ZTogMH0sXG4gICAgICBoZWlnaHQ6IGhhc1JvdyAmJiB7J3ZhbHVlJzogbGF5b3V0LmNlbGxIZWlnaHR9LCAvL0hBQ0s/XG4gICAgICBmcm9tOiBmcm9tXG4gICAgfSk7XG5cbiAgICBzcGVjLm1hcmtzLnVuc2hpZnQoYXhlc0dycCk7IC8vIG5lZWQgdG8gcHJlcGVuZCBzbyBpdCBhcHBlYXJzIHVuZGVyIHRoZSBwbG90c1xuICAgIChzcGVjLmF4ZXMgPSBzcGVjLmF4ZXMgfHwgW10pO1xuICAgIHNwZWMuYXhlcy5wdXNoKGF4aXMuZGVmKENPTCwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpKTtcbiAgfSBlbHNlIHsgLy8gZG9lc24ndCBoYXZlIGNvbFxuICAgIGlmIChlbmNvZGluZy5oYXMoWSkpIHtcbiAgICAgIGNlbGxBeGVzLnB1c2goYXhpcy5kZWYoWSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpKTtcbiAgICB9XG4gIH1cblxuICAvLyBhc3N1bWluZyBlcXVhbCBjZWxsV2lkdGggaGVyZVxuICAvLyBUT0RPOiBzdXBwb3J0IGhldGVyb2dlbm91cyBjZWxsV2lkdGggKG1heWJlIGJ5IHVzaW5nIG11bHRpcGxlIHNjYWxlcz8pXG4gIHNwZWMuc2NhbGVzID0gKHNwZWMuc2NhbGVzIHx8IFtdKS5jb25jYXQoc2NhbGUuZGVmcyhcbiAgICBzY2FsZS5uYW1lcyhlbnRlcikuY29uY2F0KHNpbmdsZVNjYWxlTmFtZXMpLFxuICAgIGVuY29kaW5nLFxuICAgIGxheW91dCxcbiAgICBzdGF0cyxcbiAgICB7c3RhY2s6IHN0YWNrLCBmYWNldDogdHJ1ZX1cbiAgKSk7IC8vIHJvdy9jb2wgc2NhbGVzICsgY2VsbCBzY2FsZXNcblxuICBpZiAoY2VsbEF4ZXMubGVuZ3RoID4gMCkge1xuICAgIGdyb3VwLmF4ZXMgPSBjZWxsQXhlcztcbiAgfVxuXG4gIC8vIGFkZCBmYWNldCB0cmFuc2Zvcm1cbiAgdmFyIHRyYW5zID0gKGdyb3VwLmZyb20udHJhbnNmb3JtIHx8IChncm91cC5mcm9tLnRyYW5zZm9ybSA9IFtdKSk7XG4gIHRyYW5zLnVuc2hpZnQoe3R5cGU6ICdmYWNldCcsIGtleXM6IGZhY2V0S2V5c30pO1xuXG4gIHJldHVybiBzcGVjO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGVmOiBncm91cGRlZlxufTtcblxuZnVuY3Rpb24gZ3JvdXBkZWYobmFtZSwgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcbiAgcmV0dXJuIHtcbiAgICBfbmFtZTogbmFtZSB8fCB1bmRlZmluZWQsXG4gICAgdHlwZTogJ2dyb3VwJyxcbiAgICBmcm9tOiBvcHQuZnJvbSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBlbnRlcjoge1xuICAgICAgICB4OiBvcHQueCB8fCB1bmRlZmluZWQsXG4gICAgICAgIHk6IG9wdC55IHx8IHVuZGVmaW5lZCxcbiAgICAgICAgd2lkdGg6IG9wdC53aWR0aCB8fCB7Z3JvdXA6ICd3aWR0aCd9LFxuICAgICAgICBoZWlnaHQ6IG9wdC5oZWlnaHQgfHwge2dyb3VwOiAnaGVpZ2h0J31cbiAgICAgIH1cbiAgICB9LFxuICAgIHNjYWxlczogb3B0LnNjYWxlcyB8fCB1bmRlZmluZWQsXG4gICAgYXhlczogb3B0LmF4ZXMgfHwgdW5kZWZpbmVkLFxuICAgIG1hcmtzOiBvcHQubWFya3MgfHwgW11cbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgc2V0dGVyID0gdXRpbC5zZXR0ZXIsXG4gIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKSxcbiAgZDNfZm9ybWF0ID0gcmVxdWlyZSgnZDMtZm9ybWF0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gdmxsYXlvdXQ7XG5cbmZ1bmN0aW9uIHZsbGF5b3V0KGVuY29kaW5nLCBzdGF0cykge1xuICB2YXIgbGF5b3V0ID0gYm94KGVuY29kaW5nLCBzdGF0cyk7XG4gIGxheW91dCA9IG9mZnNldChlbmNvZGluZywgc3RhdHMsIGxheW91dCk7XG4gIHJldHVybiBsYXlvdXQ7XG59XG5cbi8qXG4gIEhBQ0sgdG8gc2V0IGNoYXJ0IHNpemVcbiAgTk9URTogdGhpcyBmYWlscyBmb3IgcGxvdHMgZHJpdmVuIGJ5IGRlcml2ZWQgdmFsdWVzIChlLmcuLCBhZ2dyZWdhdGVzKVxuICBPbmUgc29sdXRpb24gaXMgdG8gdXBkYXRlIFZlZ2EgdG8gc3VwcG9ydCBhdXRvLXNpemluZ1xuICBJbiB0aGUgbWVhbnRpbWUsIGF1dG8tcGFkZGluZyAobW9zdGx5KSBkb2VzIHRoZSB0cmlja1xuICovXG5mdW5jdGlvbiBib3goZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHZhciBoYXNSb3cgPSBlbmNvZGluZy5oYXMoUk9XKSxcbiAgICAgIGhhc0NvbCA9IGVuY29kaW5nLmhhcyhDT0wpLFxuICAgICAgaGFzWCA9IGVuY29kaW5nLmhhcyhYKSxcbiAgICAgIGhhc1kgPSBlbmNvZGluZy5oYXMoWSksXG4gICAgICBtYXJrdHlwZSA9IGVuY29kaW5nLm1hcmt0eXBlKCk7XG5cbiAgLy8gRklYTUUvSEFDSyB3ZSBuZWVkIHRvIHRha2UgZmlsdGVyIGludG8gYWNjb3VudFxuICB2YXIgeENhcmRpbmFsaXR5ID0gaGFzWCAmJiBlbmNvZGluZy5pc0RpbWVuc2lvbihYKSA/IGVuY29kaW5nLmNhcmRpbmFsaXR5KFgsIHN0YXRzKSA6IDEsXG4gICAgeUNhcmRpbmFsaXR5ID0gaGFzWSAmJiBlbmNvZGluZy5pc0RpbWVuc2lvbihZKSA/IGVuY29kaW5nLmNhcmRpbmFsaXR5KFksIHN0YXRzKSA6IDE7XG5cbiAgdmFyIHVzZVNtYWxsQmFuZCA9IHhDYXJkaW5hbGl0eSA+IGVuY29kaW5nLmNvbmZpZygnbGFyZ2VCYW5kTWF4Q2FyZGluYWxpdHknKSB8fFxuICAgIHlDYXJkaW5hbGl0eSA+IGVuY29kaW5nLmNvbmZpZygnbGFyZ2VCYW5kTWF4Q2FyZGluYWxpdHknKTtcblxuICB2YXIgY2VsbFdpZHRoLCBjZWxsSGVpZ2h0LCBjZWxsUGFkZGluZyA9IGVuY29kaW5nLmNvbmZpZygnY2VsbFBhZGRpbmcnKTtcblxuICAvLyBzZXQgY2VsbFdpZHRoXG4gIGlmIChoYXNYKSB7XG4gICAgaWYgKGVuY29kaW5nLmlzT3JkaW5hbFNjYWxlKFgpKSB7XG4gICAgICAvLyBmb3Igb3JkaW5hbCwgaGFzQ29sIG9yIG5vdCBkb2Vzbid0IG1hdHRlciAtLSB3ZSBzY2FsZSBiYXNlZCBvbiBjYXJkaW5hbGl0eVxuICAgICAgY2VsbFdpZHRoID0gKHhDYXJkaW5hbGl0eSArIGVuY29kaW5nLmZpZWxkKFgpLmJhbmQucGFkZGluZykgKiBlbmNvZGluZy5iYW5kU2l6ZShYLCB1c2VTbWFsbEJhbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjZWxsV2lkdGggPSBoYXNDb2wgfHwgaGFzUm93ID8gZW5jb2RpbmcuZmllbGQoQ09MKS53aWR0aCA6ICBlbmNvZGluZy5jb25maWcoJ3NpbmdsZVdpZHRoJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChtYXJrdHlwZSA9PT0gVEVYVCkge1xuICAgICAgY2VsbFdpZHRoID0gZW5jb2RpbmcuY29uZmlnKCd0ZXh0Q2VsbFdpZHRoJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNlbGxXaWR0aCA9IGVuY29kaW5nLmJhbmRTaXplKFgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNldCBjZWxsSGVpZ2h0XG4gIGlmIChoYXNZKSB7XG4gICAgaWYgKGVuY29kaW5nLmlzT3JkaW5hbFNjYWxlKFkpKSB7XG4gICAgICAvLyBmb3Igb3JkaW5hbCwgaGFzQ29sIG9yIG5vdCBkb2Vzbid0IG1hdHRlciAtLSB3ZSBzY2FsZSBiYXNlZCBvbiBjYXJkaW5hbGl0eVxuICAgICAgY2VsbEhlaWdodCA9ICh5Q2FyZGluYWxpdHkgKyBlbmNvZGluZy5maWVsZChZKS5iYW5kLnBhZGRpbmcpICogZW5jb2RpbmcuYmFuZFNpemUoWSwgdXNlU21hbGxCYW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VsbEhlaWdodCA9IGhhc0NvbCB8fCBoYXNSb3cgPyBlbmNvZGluZy5maWVsZChST1cpLmhlaWdodCA6ICBlbmNvZGluZy5jb25maWcoJ3NpbmdsZUhlaWdodCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjZWxsSGVpZ2h0ID0gZW5jb2RpbmcuYmFuZFNpemUoWSk7XG4gIH1cblxuICAvLyBDZWxsIGJhbmRzIHVzZSByYW5nZUJhbmRzKCkuIFRoZXJlIGFyZSBuLTEgcGFkZGluZy4gIE91dGVycGFkZGluZyA9IDAgZm9yIGNlbGxzXG5cbiAgdmFyIHdpZHRoID0gY2VsbFdpZHRoLCBoZWlnaHQgPSBjZWxsSGVpZ2h0O1xuICBpZiAoaGFzQ29sKSB7XG4gICAgdmFyIGNvbENhcmRpbmFsaXR5ID0gZW5jb2RpbmcuY2FyZGluYWxpdHkoQ09MLCBzdGF0cyk7XG4gICAgd2lkdGggPSBjZWxsV2lkdGggKiAoKDEgKyBjZWxsUGFkZGluZykgKiAoY29sQ2FyZGluYWxpdHkgLSAxKSArIDEpO1xuICB9XG4gIGlmIChoYXNSb3cpIHtcbiAgICB2YXIgcm93Q2FyZGluYWxpdHkgPSAgZW5jb2RpbmcuY2FyZGluYWxpdHkoUk9XLCBzdGF0cyk7XG4gICAgaGVpZ2h0ID0gY2VsbEhlaWdodCAqICgoMSArIGNlbGxQYWRkaW5nKSAqIChyb3dDYXJkaW5hbGl0eSAtIDEpICsgMSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIHdob2xlIGNlbGxcbiAgICBjZWxsV2lkdGg6IGNlbGxXaWR0aCxcbiAgICBjZWxsSGVpZ2h0OiBjZWxsSGVpZ2h0LFxuICAgIGNlbGxQYWRkaW5nOiBjZWxsUGFkZGluZyxcbiAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBjaGFydFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAvLyBpbmZvcm1hdGlvbiBhYm91dCB4IGFuZCB5LCBzdWNoIGFzIGJhbmQgc2l6ZVxuICAgIHg6IHt1c2VTbWFsbEJhbmQ6IHVzZVNtYWxsQmFuZH0sXG4gICAgeToge3VzZVNtYWxsQmFuZDogdXNlU21hbGxCYW5kfVxuICB9O1xufVxuXG5cbi8vIEZJWE1FIGZpZWxkU3RhdHMubWF4IGlzbid0IGFsd2F5cyB0aGUgbG9uZ2VzdFxuZnVuY3Rpb24gZ2V0TWF4TnVtYmVyTGVuZ3RoKGVuY29kaW5nLCBldCwgZmllbGRTdGF0cykge1xuICB2YXIgZm9ybWF0ID0gZW5jb2RpbmcubnVtYmVyRm9ybWF0KGV0LCBmaWVsZFN0YXRzKTtcblxuICByZXR1cm4gZDNfZm9ybWF0LmZvcm1hdChmb3JtYXQpKGZpZWxkU3RhdHMubWF4KS5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGdldE1heExlbmd0aChlbmNvZGluZywgc3RhdHMsIGV0KSB7XG4gIHZhciBmaWVsZCA9IGVuY29kaW5nLmZpZWxkKGV0KSxcbiAgICBmaWVsZFN0YXRzID0gc3RhdHNbZmllbGQubmFtZV07XG5cbiAgaWYgKGZpZWxkLmJpbikge1xuICAgIC8vIFRPRE8gb25jZSBiaW4gc3VwcG9ydCByYW5nZSwgbmVlZCB0byB1cGRhdGUgdGhpc1xuICAgIHJldHVybiBnZXRNYXhOdW1iZXJMZW5ndGgoZW5jb2RpbmcsIGV0LCBmaWVsZFN0YXRzKTtcbiAgfSBpZiAoZW5jb2RpbmcuaXNUeXBlKGV0LCBRKSkge1xuICAgIHJldHVybiBnZXRNYXhOdW1iZXJMZW5ndGgoZW5jb2RpbmcsIGV0LCBmaWVsZFN0YXRzKTtcbiAgfSBlbHNlIGlmIChlbmNvZGluZy5pc1R5cGUoZXQsIFQpKSB7XG4gICAgcmV0dXJuIHRpbWUubWF4TGVuZ3RoKGVuY29kaW5nLmZpZWxkKGV0KS50aW1lVW5pdCwgZW5jb2RpbmcpO1xuICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZXMoZXQsIFtOLCBPXSkpIHtcbiAgICBpZihmaWVsZFN0YXRzLnR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gZ2V0TWF4TnVtYmVyTGVuZ3RoKGVuY29kaW5nLCBldCwgZmllbGRTdGF0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBNYXRoLm1pbihmaWVsZFN0YXRzLm1heCwgZW5jb2RpbmcuYXhpcyhldCkubWF4TGFiZWxMZW5ndGggfHwgSW5maW5pdHkpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBvZmZzZXQoZW5jb2RpbmcsIHN0YXRzLCBsYXlvdXQpIHtcbiAgW1gsIFldLmZvckVhY2goZnVuY3Rpb24gKGV0KSB7XG4gICAgLy8gVE9ETyhrYW5pdHcpOiBKdWwgMTksIDIwMTUgLSBjcmVhdGUgYSBzZXQgb2YgdmlzdWFsIHRlc3QgZm9yIGV4dHJhT2Zmc2V0XG4gICAgdmFyIGV4dHJhT2Zmc2V0ID0gZXQgPT09IFggPyAyMCA6IDIyLFxuICAgICAgbWF4TGVuZ3RoO1xuICAgIGlmIChlbmNvZGluZy5pc0RpbWVuc2lvbihldCkgfHwgZW5jb2RpbmcuaXNUeXBlKGV0LCBUKSkge1xuICAgICAgbWF4TGVuZ3RoID0gZ2V0TWF4TGVuZ3RoKGVuY29kaW5nLCBzdGF0cywgZXQpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAvLyBUT0RPIG9uY2Ugd2UgaGF2ZSAjNTEyIChhbGxvdyB1c2luZyBpbmZlcnJlZCB0eXBlKVxuICAgICAgLy8gTmVlZCB0byBhZGp1c3QgY29uZGl0aW9uIGhlcmUuXG4gICAgICBlbmNvZGluZy5pc1R5cGUoZXQsIFEpIHx8XG4gICAgICBlbmNvZGluZy5hZ2dyZWdhdGUoZXQpID09PSAnY291bnQnXG4gICAgKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGV0PT09WVxuICAgICAgICAvLyB8fCAoZXQ9PT1YICYmIGZhbHNlKVxuICAgICAgICAvLyBGSVhNRSBkZXRlcm1pbmUgd2hlbiBYIHdvdWxkIHJvdGF0ZSwgYnV0IHNob3VsZCBtb3ZlIHRoaXMgdG8gYXhpcy5qcyBmaXJzdCAjNTA2XG4gICAgICApIHtcbiAgICAgICAgbWF4TGVuZ3RoID0gZ2V0TWF4TGVuZ3RoKGVuY29kaW5nLCBzdGF0cywgZXQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBub3RoaW5nXG4gICAgfVxuXG4gICAgaWYgKG1heExlbmd0aCkge1xuICAgICAgc2V0dGVyKGxheW91dCxbZXQsICdheGlzVGl0bGVPZmZzZXQnXSwgZW5jb2RpbmcuY29uZmlnKCdjaGFyYWN0ZXJXaWR0aCcpICogIG1heExlbmd0aCArIGV4dHJhT2Zmc2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgbm8gbWF4IGxlbmd0aCAobm8gcm90YXRpb24gY2FzZSksIHVzZSBtYXhMZW5ndGggPSAzXG4gICAgICBzZXR0ZXIobGF5b3V0LFtldCwgJ2F4aXNUaXRsZU9mZnNldCddLCBlbmNvZGluZy5jb25maWcoJ2NoYXJhY3RlcldpZHRoJykgKiAzICsgZXh0cmFPZmZzZXQpO1xuICAgIH1cblxuICB9KTtcbiAgcmV0dXJuIGxheW91dDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgdGltZSA9IHJlcXVpcmUoJy4vdGltZScpLFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICBzZXR0ZXIgPSB1dGlsLnNldHRlcixcbiAgZ2V0dGVyID0gdXRpbC5nZXR0ZXI7XG5cbnZhciBsZWdlbmQgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5sZWdlbmQuZGVmcyA9IGZ1bmN0aW9uKGVuY29kaW5nLCBzdHlsZSkge1xuICB2YXIgZGVmcyA9IFtdO1xuXG4gIGlmIChlbmNvZGluZy5oYXMoQ09MT1IpICYmIGVuY29kaW5nLmZpZWxkKENPTE9SKS5sZWdlbmQpIHtcbiAgICBkZWZzLnB1c2gobGVnZW5kLmRlZihDT0xPUiwgZW5jb2RpbmcsIHtcbiAgICAgIGZpbGw6IENPTE9SLFxuICAgICAgb3JpZW50OiAncmlnaHQnXG4gICAgfSwgc3R5bGUpKTtcbiAgfVxuXG4gIGlmIChlbmNvZGluZy5oYXMoU0laRSkgJiYgZW5jb2RpbmcuZmllbGQoU0laRSkubGVnZW5kKSB7XG4gICAgZGVmcy5wdXNoKGxlZ2VuZC5kZWYoU0laRSwgZW5jb2RpbmcsIHtcbiAgICAgIHNpemU6IFNJWkUsXG4gICAgICBvcmllbnQ6IGRlZnMubGVuZ3RoID09PSAxID8gJ2xlZnQnIDogJ3JpZ2h0J1xuICAgIH0sIHN0eWxlKSk7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuaGFzKFNIQVBFKSAmJiBlbmNvZGluZy5maWVsZChTSEFQRSkubGVnZW5kKSB7XG4gICAgaWYgKGRlZnMubGVuZ3RoID09PSAyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdWZWdhLWxpdGUgY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgdHdvIGxlZ2VuZHMnKTtcbiAgICB9XG4gICAgZGVmcy5wdXNoKGxlZ2VuZC5kZWYoU0hBUEUsIGVuY29kaW5nLCB7XG4gICAgICBzaGFwZTogU0hBUEUsXG4gICAgICBvcmllbnQ6IGRlZnMubGVuZ3RoID09PSAxID8gJ2xlZnQnIDogJ3JpZ2h0J1xuICAgIH0sIHN0eWxlKSk7XG4gIH1cbiAgcmV0dXJuIGRlZnM7XG59O1xuXG5sZWdlbmQuZGVmID0gZnVuY3Rpb24obmFtZSwgZW5jb2RpbmcsIGRlZiwgc3R5bGUpIHtcbiAgdmFyIHRpbWVVbml0ID0gZW5jb2RpbmcuZmllbGQobmFtZSkudGltZVVuaXQ7XG5cbiAgZGVmLnRpdGxlID0gbGVnZW5kLnRpdGxlKG5hbWUsIGVuY29kaW5nKTtcbiAgZGVmID0gbGVnZW5kLnN0eWxlKG5hbWUsIGVuY29kaW5nLCBkZWYsIHN0eWxlKTtcblxuICBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFQpICYmXG4gICAgdGltZVVuaXQgJiZcbiAgICB0aW1lLmhhc1NjYWxlKHRpbWVVbml0KVxuICApIHtcbiAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCAnbGFiZWxzJywgJ3RleHQnLCAnc2NhbGUnXSwgJ3RpbWUtJysgdGltZVVuaXQpO1xuICB9XG5cbiAgcmV0dXJuIGRlZjtcbn07XG5cbmxlZ2VuZC5zdHlsZSA9IGZ1bmN0aW9uKG5hbWUsIGUsIGRlZiwgc3R5bGUpIHtcbiAgdmFyIHN5bWJvbHMgPSBnZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCAnc3ltYm9scyddKSxcbiAgICBtYXJrdHlwZSA9IGUubWFya3R5cGUoKTtcblxuICBzd2l0Y2ggKG1hcmt0eXBlKSB7XG4gICAgY2FzZSAnYmFyJzpcbiAgICBjYXNlICd0aWNrJzpcbiAgICBjYXNlICd0ZXh0JzpcbiAgICAgIHN5bWJvbHMuc3Ryb2tlID0ge3ZhbHVlOiAndHJhbnNwYXJlbnQnfTtcbiAgICAgIHN5bWJvbHMuc2hhcGUgPSB7dmFsdWU6ICdzcXVhcmUnfTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnY2lyY2xlJzpcbiAgICBjYXNlICdzcXVhcmUnOlxuICAgICAgc3ltYm9scy5zaGFwZSA9IHt2YWx1ZTogbWFya3R5cGV9O1xuICAgICAgLyogZmFsbCB0aHJvdWdoICovXG4gICAgY2FzZSAncG9pbnQnOlxuICAgICAgLy8gZmlsbCBvciBzdHJva2VcbiAgICAgIGlmIChlLmZpZWxkKFNIQVBFKS5maWxsZWQpIHtcbiAgICAgICAgaWYgKGUuaGFzKENPTE9SKSAmJiBuYW1lID09PSBDT0xPUikge1xuICAgICAgICAgIHN5bWJvbHMuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiAnZGF0YSd9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN5bWJvbHMuZmlsbCA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICAgICAgICB9XG4gICAgICAgIHN5bWJvbHMuc3Ryb2tlID0ge3ZhbHVlOiAndHJhbnNwYXJlbnQnfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChlLmhhcyhDT0xPUikgJiYgbmFtZSA9PT0gQ09MT1IpIHtcbiAgICAgICAgICBzeW1ib2xzLnN0cm9rZSA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiAnZGF0YSd9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN5bWJvbHMuc3Ryb2tlID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gICAgICAgIH1cbiAgICAgICAgc3ltYm9scy5maWxsID0ge3ZhbHVlOiAndHJhbnNwYXJlbnQnfTtcbiAgICAgICAgc3ltYm9scy5zdHJva2VXaWR0aCA9IHt2YWx1ZTogZS5jb25maWcoJ3N0cm9rZVdpZHRoJyl9O1xuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgICBjYXNlICdsaW5lJzpcbiAgICBjYXNlICdhcmVhJzpcbiAgICAgIC8vIFRPRE8gdXNlIHNoYXBlIGhlcmUgYWZ0ZXIgaW1wbGVtZW50aW5nICM1MDhcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIG9wYWNpdHkgPSBlLmZpZWxkKENPTE9SKS5vcGFjaXR5IHx8IHN0eWxlLm9wYWNpdHk7XG4gIGlmIChvcGFjaXR5KSB7XG4gICAgc3ltYm9scy5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcbiAgfVxuICByZXR1cm4gZGVmO1xufTtcblxubGVnZW5kLnRpdGxlID0gZnVuY3Rpb24obmFtZSwgZW5jb2RpbmcpIHtcbiAgdmFyIGxlZyA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLmxlZ2VuZDtcblxuICBpZiAobGVnLnRpdGxlKSByZXR1cm4gbGVnLnRpdGxlO1xuXG4gIHJldHVybiBlbmNvZGluZy5maWVsZFRpdGxlKG5hbWUpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgbWFya3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5tYXJrcy5kZWYgPSBmdW5jdGlvbihlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgc3RhdHMpIHtcblxuICB2YXIgZGVmcyA9IFtdLFxuICAgIG1hcmsgPSBtYXJrc1tlbmNvZGluZy5tYXJrdHlwZSgpXSxcbiAgICBmcm9tID0gZW5jb2RpbmcuZGF0YVRhYmxlKCk7XG5cbiAgLy8gdG8gYWRkIGEgYmFja2dyb3VuZCB0byB0ZXh0LCB3ZSBuZWVkIHRvIGFkZCBpdCBiZWZvcmUgdGhlIHRleHRcbiAgaWYgKGVuY29kaW5nLm1hcmt0eXBlKCkgPT09IFRFWFQgJiYgZW5jb2RpbmcuaGFzKENPTE9SKSkge1xuICAgIHZhciBiZyA9IHtcbiAgICAgIHg6IHt2YWx1ZTogMH0sXG4gICAgICB5OiB7dmFsdWU6IDB9LFxuICAgICAgeDI6IHt2YWx1ZTogbGF5b3V0LmNlbGxXaWR0aH0sXG4gICAgICB5Mjoge3ZhbHVlOiBsYXlvdXQuY2VsbEhlaWdodH0sXG4gICAgICBmaWxsOiB7c2NhbGU6IENPTE9SLCBmaWVsZDogZW5jb2RpbmcuZmllbGRSZWYoQ09MT1IpfVxuICAgIH07XG4gICAgZGVmcy5wdXNoKHtcbiAgICAgIHR5cGU6ICdyZWN0JyxcbiAgICAgIGZyb206IHtkYXRhOiBmcm9tfSxcbiAgICAgIHByb3BlcnRpZXM6IHtlbnRlcjogYmcsIHVwZGF0ZTogYmd9XG4gICAgfSk7XG4gIH1cblxuICAvLyBhZGQgdGhlIG1hcmsgZGVmIGZvciB0aGUgbWFpbiB0aGluZ1xuICB2YXIgcCA9IG1hcmsucHJvcChlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgc3RhdHMpO1xuICBkZWZzLnB1c2goe1xuICAgIHR5cGU6IG1hcmsudHlwZSxcbiAgICBmcm9tOiB7ZGF0YTogZnJvbX0sXG4gICAgcHJvcGVydGllczoge2VudGVyOiBwLCB1cGRhdGU6IHB9XG4gIH0pO1xuXG4gIHJldHVybiBkZWZzO1xufTtcblxubWFya3MuYmFyID0ge1xuICB0eXBlOiAncmVjdCcsXG4gIHN0YWNrOiB0cnVlLFxuICBwcm9wOiBiYXJfcHJvcHMsXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OiAxLCBjb2w6IDEsIHg6IDEsIHk6IDEsIHNpemU6IDEsIGNvbG9yOiAxfVxufTtcblxubWFya3MubGluZSA9IHtcbiAgdHlwZTogJ2xpbmUnLFxuICBsaW5lOiB0cnVlLFxuICBwcm9wOiBsaW5lX3Byb3BzLFxuICByZXF1aXJlZEVuY29kaW5nOiBbJ3gnLCAneSddLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBjb2xvcjogMSwgZGV0YWlsOjF9XG59O1xuXG5tYXJrcy5hcmVhID0ge1xuICB0eXBlOiAnYXJlYScsXG4gIHN0YWNrOiB0cnVlLFxuICBsaW5lOiB0cnVlLFxuICByZXF1aXJlZEVuY29kaW5nOiBbJ3gnLCAneSddLFxuICBwcm9wOiBhcmVhX3Byb3BzLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBjb2xvcjogMX1cbn07XG5cbm1hcmtzLnRpY2sgPSB7XG4gIHR5cGU6ICdyZWN0JyxcbiAgcHJvcDogdGlja19wcm9wcyxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgY29sb3I6IDEsIGRldGFpbDogMX1cbn07XG5cbm1hcmtzLmNpcmNsZSA9IHtcbiAgdHlwZTogJ3N5bWJvbCcsXG4gIHByb3A6IGZpbGxlZF9wb2ludF9wcm9wcygnY2lyY2xlJyksXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OiAxLCBjb2w6IDEsIHg6IDEsIHk6IDEsIHNpemU6IDEsIGNvbG9yOiAxLCBkZXRhaWw6IDF9XG59O1xuXG5tYXJrcy5zcXVhcmUgPSB7XG4gIHR5cGU6ICdzeW1ib2wnLFxuICBwcm9wOiBmaWxsZWRfcG9pbnRfcHJvcHMoJ3NxdWFyZScpLFxuICBzdXBwb3J0ZWRFbmNvZGluZzogbWFya3MuY2lyY2xlLnN1cHBvcnRlZEVuY29kaW5nXG59O1xuXG5tYXJrcy5wb2ludCA9IHtcbiAgdHlwZTogJ3N5bWJvbCcsXG4gIHByb3A6IHBvaW50X3Byb3BzLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBzaXplOiAxLCBjb2xvcjogMSwgc2hhcGU6IDEsIGRldGFpbDogMX1cbn07XG5cbm1hcmtzLnRleHQgPSB7XG4gIHR5cGU6ICd0ZXh0JyxcbiAgcHJvcDogdGV4dF9wcm9wcyxcbiAgcmVxdWlyZWRFbmNvZGluZzogWyd0ZXh0J10sXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OiAxLCBjb2w6IDEsIHNpemU6IDEsIGNvbG9yOiAxLCB0ZXh0OiAxfVxufTtcblxuZnVuY3Rpb24gYmFyX3Byb3BzKGUsIGxheW91dCwgc3R5bGUpIHtcbiAgLy8ganNoaW50IHVudXNlZDpmYWxzZVxuXG4gIHZhciBwID0ge307XG5cbiAgLy8geCdzIGFuZCB3aWR0aFxuICBpZiAoZS5pc01lYXN1cmUoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkUmVmKFgpfTtcbiAgICBpZiAoIWUuaGFzKFkpIHx8IGUuaXNEaW1lbnNpb24oWSkpIHtcbiAgICAgIHAueDIgPSB7dmFsdWU6IDB9O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZS5oYXMoWCkpIHsgLy8gaXMgb3JkaW5hbFxuICAgICAgIHAueGMgPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkUmVmKFgpfTtcbiAgICB9IGVsc2Uge1xuICAgICAgIHAueCA9IHt2YWx1ZTogMCwgb2Zmc2V0OiBlLmNvbmZpZygnc2luZ2xlQmFyT2Zmc2V0Jyl9O1xuICAgIH1cbiAgfVxuXG4gIC8vIHdpZHRoXG4gIGlmICghcC54Mikge1xuICAgIGlmICghZS5oYXMoWCkgfHwgZS5pc09yZGluYWxTY2FsZShYKSkgeyAvLyBubyBYIG9yIFggaXMgb3JkaW5hbFxuICAgICAgaWYgKGUuaGFzKFNJWkUpKSB7XG4gICAgICAgIHAud2lkdGggPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkUmVmKFNJWkUpfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHAud2lkdGggPSB7XG4gICAgICAgICAgdmFsdWU6IGUuYmFuZFNpemUoWCwgbGF5b3V0LngudXNlU21hbGxCYW5kKSxcbiAgICAgICAgICBvZmZzZXQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8gWCBpcyBRdWFudCBvciBUaW1lIFNjYWxlXG4gICAgICBwLndpZHRoID0ge3ZhbHVlOiAyfTtcbiAgICB9XG4gIH1cblxuICAvLyB5J3MgJiBoZWlnaHRcbiAgaWYgKGUuaXNNZWFzdXJlKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZFJlZihZKX07XG4gICAgcC55MiA9IHtncm91cDogJ2hlaWdodCd9O1xuICB9IGVsc2Uge1xuICAgIGlmIChlLmhhcyhZKSkgeyAvLyBpcyBvcmRpbmFsXG4gICAgICBwLnljID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZFJlZihZKX07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueTIgPSB7Z3JvdXA6ICdoZWlnaHQnLCBvZmZzZXQ6IC1lLmNvbmZpZygnc2luZ2xlQmFyT2Zmc2V0Jyl9O1xuICAgIH1cblxuICAgIGlmIChlLmhhcyhTSVpFKSkge1xuICAgICAgcC5oZWlnaHQgPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkUmVmKFNJWkUpfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC5oZWlnaHQgPSB7XG4gICAgICAgIHZhbHVlOiBlLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCksXG4gICAgICAgIG9mZnNldDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLy8gZmlsbFxuICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5maWxsID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGRSZWYoQ09MT1IpfTtcbiAgfSBlbHNlIHtcbiAgICBwLmZpbGwgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgfVxuXG4gIC8vIG9wYWNpdHlcbiAgdmFyIG9wYWNpdHkgPSBlLmZpZWxkKENPTE9SKS5vcGFjaXR5O1xuICBpZiAob3BhY2l0eSkgcC5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gcG9pbnRfcHJvcHMoZSwgbGF5b3V0LCBzdHlsZSkge1xuICB2YXIgcCA9IHt9O1xuXG4gIC8vIHhcbiAgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZFJlZihZKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgfVxuXG4gIC8vIHNpemVcbiAgaWYgKGUuaGFzKFNJWkUpKSB7XG4gICAgcC5zaXplID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZFJlZihTSVpFKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFNJWkUpKSB7XG4gICAgcC5zaXplID0ge3ZhbHVlOiBlLnZhbHVlKFNJWkUpfTtcbiAgfVxuXG4gIC8vIHNoYXBlXG4gIGlmIChlLmhhcyhTSEFQRSkpIHtcbiAgICBwLnNoYXBlID0ge3NjYWxlOiBTSEFQRSwgZmllbGQ6IGUuZmllbGRSZWYoU0hBUEUpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoU0hBUEUpKSB7XG4gICAgcC5zaGFwZSA9IHt2YWx1ZTogZS52YWx1ZShTSEFQRSl9O1xuICB9XG5cbiAgLy8gZmlsbCBvciBzdHJva2VcbiAgaWYgKGUuZmllbGQoU0hBUEUpLmZpbGxlZCkge1xuICAgIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICAgIHAuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkUmVmKENPTE9SKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLmZpbGwgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgICAgcC5zdHJva2UgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZFJlZihDT0xPUil9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgICAgcC5zdHJva2UgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgICB9XG4gICAgcC5zdHJva2VXaWR0aCA9IHt2YWx1ZTogZS5jb25maWcoJ3N0cm9rZVdpZHRoJyl9O1xuICB9XG5cbiAgLy8gb3BhY2l0eVxuICB2YXIgb3BhY2l0eSA9IGUuZmllbGQoQ09MT1IpLm9wYWNpdHkgfHwgc3R5bGUub3BhY2l0eTtcbiAgaWYgKG9wYWNpdHkpIHAub3BhY2l0eSA9IHt2YWx1ZTogb3BhY2l0eX07XG5cbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIGxpbmVfcHJvcHMoZSxsYXlvdXQsIHN0eWxlKSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmhhcyhYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGRSZWYoWCl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgIHAueCA9IHt2YWx1ZTogMH07XG4gIH1cblxuICAvLyB5XG4gIGlmIChlLmhhcyhZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgIHAueSA9IHtncm91cDogJ2hlaWdodCd9O1xuICB9XG5cbiAgLy8gc3Ryb2tlXG4gIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICBwLnN0cm9rZSA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkUmVmKENPTE9SKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgIHAuc3Ryb2tlID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gIH1cblxuICB2YXIgb3BhY2l0eSA9IGUuZmllbGQoQ09MT1IpLm9wYWNpdHk7XG4gIGlmIChvcGFjaXR5KSBwLm9wYWNpdHkgPSB7dmFsdWU6IG9wYWNpdHl9O1xuXG4gIHAuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IGUuY29uZmlnKCdzdHJva2VXaWR0aCcpfTtcblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gYXJlYV9wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmlzTWVhc3VyZShYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGRSZWYoWCl9O1xuICAgIGlmIChlLmlzRGltZW5zaW9uKFkpKSB7XG4gICAgICBwLngyID0ge3NjYWxlOiBYLCB2YWx1ZTogMH07XG4gICAgICBwLm9yaWVudCA9IHt2YWx1ZTogJ2hvcml6b250YWwnfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkUmVmKFgpfTtcbiAgfSBlbHNlIHtcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5pc01lYXN1cmUoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkUmVmKFkpfTtcbiAgICBwLnkyID0ge3NjYWxlOiBZLCB2YWx1ZTogMH07XG4gIH0gZWxzZSBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkUmVmKFkpfTtcbiAgfSBlbHNlIHtcbiAgICBwLnkgPSB7Z3JvdXA6ICdoZWlnaHQnfTtcbiAgfVxuXG4gIC8vIGZpbGxcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkUmVmKENPTE9SKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICB9XG5cbiAgdmFyIG9wYWNpdHkgPSBlLmZpZWxkKENPTE9SKS5vcGFjaXR5O1xuICBpZiAob3BhY2l0eSkgcC5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gdGlja19wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkUmVmKFgpfTtcbiAgICBpZiAoZS5pc0RpbWVuc2lvbihYKSkge1xuICAgICAgcC54Lm9mZnNldCA9IC1lLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCkgLyAzO1xuICAgIH1cbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkUmVmKFkpfTtcbiAgICBpZiAoZS5pc0RpbWVuc2lvbihZKSkge1xuICAgICAgcC55Lm9mZnNldCA9IC1lLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCkgLyAzO1xuICAgIH1cbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8gd2lkdGhcbiAgaWYgKCFlLmhhcyhYKSB8fCBlLmlzRGltZW5zaW9uKFgpKSB7XG4gICAgcC53aWR0aCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShYLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMS41fTtcbiAgfSBlbHNlIHtcbiAgICBwLndpZHRoID0ge3ZhbHVlOiAxfTtcbiAgfVxuXG4gIC8vIGhlaWdodFxuICBpZiAoIWUuaGFzKFkpIHx8IGUuaXNEaW1lbnNpb24oWSkpIHtcbiAgICBwLmhlaWdodCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMS41fTtcbiAgfSBlbHNlIHtcbiAgICBwLmhlaWdodCA9IHt2YWx1ZTogMX07XG4gIH1cblxuICAvLyBmaWxsXG4gIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZFJlZihDT0xPUil9O1xuICB9IGVsc2Uge1xuICAgIHAuZmlsbCA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICB9XG5cbiAgdmFyIG9wYWNpdHkgPSBlLmZpZWxkKENPTE9SKS5vcGFjaXR5ICB8fCBzdHlsZS5vcGFjaXR5O1xuICBpZihvcGFjaXR5KSBwLm9wYWNpdHkgPSB7dmFsdWU6IG9wYWNpdHl9O1xuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBmaWxsZWRfcG9pbnRfcHJvcHMoc2hhcGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUsIGxheW91dCwgc3R5bGUpIHtcbiAgICB2YXIgcCA9IHt9O1xuXG4gICAgLy8geFxuICAgIGlmIChlLmhhcyhYKSkge1xuICAgICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICAgIHAueCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpIC8gMn07XG4gICAgfVxuXG4gICAgLy8geVxuICAgIGlmIChlLmhhcyhZKSkge1xuICAgICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZFJlZihZKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICAgIHAueSA9IHt2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMn07XG4gICAgfVxuXG4gICAgLy8gc2l6ZVxuICAgIGlmIChlLmhhcyhTSVpFKSkge1xuICAgICAgcC5zaXplID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZFJlZihTSVpFKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICAgIHAuc2l6ZSA9IHt2YWx1ZTogZS52YWx1ZShTSVpFKX07XG4gICAgfVxuXG4gICAgLy8gc2hhcGVcbiAgICBwLnNoYXBlID0ge3ZhbHVlOiBzaGFwZX07XG5cbiAgICAvLyBmaWxsXG4gICAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgICAgcC5maWxsID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGRSZWYoQ09MT1IpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICAgIHAuZmlsbCA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICAgIH1cblxuICAgIHZhciBvcGFjaXR5ID0gZS5maWVsZChDT0xPUikub3BhY2l0eSAgfHwgc3R5bGUub3BhY2l0eTtcbiAgICBpZihvcGFjaXR5KSBwLm9wYWNpdHkgPSB7dmFsdWU6IG9wYWNpdHl9O1xuXG4gICAgcmV0dXJuIHA7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRleHRfcHJvcHMoZSwgbGF5b3V0LCBzdHlsZSwgc3RhdHMpIHtcbiAgdmFyIHAgPSB7fSxcbiAgICBmaWVsZCA9IGUuZmllbGQoVEVYVCk7XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkUmVmKFgpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBpZiAoZS5oYXMoVEVYVCkgJiYgZS5pc1R5cGUoVEVYVCwgUSkpIHtcbiAgICAgIHAueCA9IHt2YWx1ZTogbGF5b3V0LmNlbGxXaWR0aC01fTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC54ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgICB9XG4gIH1cblxuICAvLyB5XG4gIGlmIChlLmhhcyhZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgIHAueSA9IHt2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMn07XG4gIH1cblxuICAvLyBzaXplXG4gIGlmIChlLmhhcyhTSVpFKSkge1xuICAgIHAuZm9udFNpemUgPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkUmVmKFNJWkUpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoU0laRSkpIHtcbiAgICBwLmZvbnRTaXplID0ge3ZhbHVlOiBmaWVsZC5mb250LnNpemV9O1xuICB9XG5cbiAgLy8gZmlsbFxuICAvLyBjb2xvciBzaG91bGQgYmUgc2V0IHRvIGJhY2tncm91bmRcbiAgcC5maWxsID0ge3ZhbHVlOiBmaWVsZC5jb2xvcn07XG5cbiAgdmFyIG9wYWNpdHkgPSBlLmZpZWxkKENPTE9SKS5vcGFjaXR5ICB8fCBzdHlsZS5vcGFjaXR5O1xuICBpZihvcGFjaXR5KSBwLm9wYWNpdHkgPSB7dmFsdWU6IG9wYWNpdHl9O1xuXG4gIC8vIHRleHRcbiAgaWYgKGUuaGFzKFRFWFQpKSB7XG4gICAgaWYgKGUuaXNUeXBlKFRFWFQsIFEpKSB7XG4gICAgICB2YXIgZmllbGRTdGF0cyA9IHN0YXRzW2UuZmllbGROYW1lKFRFWFQpXSxcbiAgICAgICAgbnVtYmVyRm9ybWF0ID0gZmllbGQuZm9ybWF0IHx8IGUubnVtYmVyRm9ybWF0KGZpZWxkU3RhdHMpO1xuXG4gICAgICBwLnRleHQgPSB7dGVtcGxhdGU6ICd7eycgKyBlLmZpZWxkUmVmKFRFWFQpICsgJyB8IG51bWJlcjpcXCcnICtcbiAgICAgICAgbnVtYmVyRm9ybWF0ICsnXFwnfX0nfTtcbiAgICAgIHAuYWxpZ24gPSB7dmFsdWU6IGZpZWxkLmFsaWdufTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC50ZXh0ID0ge2ZpZWxkOiBlLmZpZWxkUmVmKFRFWFQpfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcC50ZXh0ID0ge3ZhbHVlOiBmaWVsZC5wbGFjZWhvbGRlcn07XG4gIH1cblxuICBwLmZvbnQgPSB7dmFsdWU6IGZpZWxkLmZvbnQuZmFtaWx5fTtcbiAgcC5mb250V2VpZ2h0ID0ge3ZhbHVlOiBmaWVsZC5mb250LndlaWdodH07XG4gIHAuZm9udFN0eWxlID0ge3ZhbHVlOiBmaWVsZC5mb250LnN0eWxlfTtcbiAgcC5iYXNlbGluZSA9IHt2YWx1ZTogZmllbGQuYmFzZWxpbmV9O1xuXG4gIHJldHVybiBwO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKSxcbiAgY29sb3JicmV3ZXIgPSByZXF1aXJlKCdjb2xvcmJyZXdlcicpLFxuICBpbnRlcnBvbGF0ZSA9IHJlcXVpcmUoJ2QzLWNvbG9yJykuaW50ZXJwb2xhdGVIc2wsXG4gIHNjaGVtYSA9IHJlcXVpcmUoJy4uL3NjaGVtYS9zY2hlbWEnKSxcbiAgdmxzb3J0ID0gcmVxdWlyZSgnLi9zb3J0Jyk7XG5cbnZhciBzY2FsZSA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnNjYWxlLm5hbWVzID0gZnVuY3Rpb24ocHJvcHMpIHtcbiAgcmV0dXJuIHV0aWwua2V5cyh1dGlsLmtleXMocHJvcHMpLnJlZHVjZShmdW5jdGlvbihhLCB4KSB7XG4gICAgaWYgKHByb3BzW3hdICYmIHByb3BzW3hdLnNjYWxlKSBhW3Byb3BzW3hdLnNjYWxlXSA9IDE7XG4gICAgcmV0dXJuIGE7XG4gIH0sIHt9KSk7XG59O1xuXG5zY2FsZS5kZWZzID0gZnVuY3Rpb24obmFtZXMsIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzLCBvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gIHJldHVybiBuYW1lcy5yZWR1Y2UoZnVuY3Rpb24oYSwgbmFtZSkge1xuICAgIHZhciBzID0ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHR5cGU6IHNjYWxlLnR5cGUobmFtZSwgZW5jb2RpbmcpLFxuICAgICAgZG9tYWluOiBzY2FsZS5kb21haW4obmFtZSwgZW5jb2RpbmcsIHN0YXRzLCBvcHQpXG4gICAgfTtcblxuICAgIHMuc29ydCA9IHNjYWxlLnNvcnQocywgZW5jb2RpbmcsIG5hbWUpIHx8IHVuZGVmaW5lZDtcblxuICAgIHNjYWxlLnJhbmdlKHMsIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzLCBvcHQpO1xuXG4gICAgcmV0dXJuIChhLnB1c2gocyksIGEpO1xuICB9LCBbXSk7XG59O1xuXG5zY2FsZS5zb3J0ID0gZnVuY3Rpb24ocywgZW5jb2RpbmcsIG5hbWUpIHtcbiAgcmV0dXJuIHMudHlwZSA9PT0gJ29yZGluYWwnICYmIChcbiAgICAhIWVuY29kaW5nLmJpbihuYW1lKSB8fFxuICAgIGVuY29kaW5nLnNvcnQobmFtZSkubGVuZ3RoID09PSAwXG4gICk7XG59O1xuXG5zY2FsZS50eXBlID0gZnVuY3Rpb24obmFtZSwgZW5jb2RpbmcpIHtcblxuICBzd2l0Y2ggKGVuY29kaW5nLnR5cGUobmFtZSkpIHtcbiAgICBjYXNlIE46IC8vZmFsbCB0aHJvdWdoXG4gICAgY2FzZSBPOiByZXR1cm4gJ29yZGluYWwnO1xuICAgIGNhc2UgVDpcbiAgICAgIHZhciB0aW1lVW5pdCA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLnRpbWVVbml0O1xuICAgICAgcmV0dXJuIHRpbWVVbml0ID8gdGltZS5zY2FsZS50eXBlKHRpbWVVbml0LCBuYW1lKSA6ICd0aW1lJztcbiAgICBjYXNlIFE6XG4gICAgICBpZiAoZW5jb2RpbmcuYmluKG5hbWUpKSB7XG4gICAgICAgIHJldHVybiBuYW1lID09PSBDT0xPUiA/ICdsaW5lYXInIDogJ29yZGluYWwnO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVuY29kaW5nLnNjYWxlKG5hbWUpLnR5cGU7XG4gIH1cbn07XG5cbnNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uIChuYW1lLCBlbmNvZGluZywgc3RhdHMsIG9wdCkge1xuICB2YXIgZmllbGQgPSBlbmNvZGluZy5maWVsZChuYW1lKTtcblxuICBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFQpKSB7XG4gICAgdmFyIHJhbmdlID0gdGltZS5zY2FsZS5kb21haW4oZmllbGQudGltZVVuaXQsIG5hbWUpO1xuICAgIGlmKHJhbmdlKSByZXR1cm4gcmFuZ2U7XG4gIH1cblxuICBpZiAoZmllbGQuYmluKSB7XG4gICAgLy8gVE9ETyhrYW5pdHcpOiB0aGlzIG11c3QgYmUgY2hhbmdlZCBpbiB2ZzJcbiAgICB2YXIgZmllbGRTdGF0ID0gc3RhdHNbZmllbGQubmFtZV0sXG4gICAgICBiaW5zID0gdXRpbC5nZXRiaW5zKGZpZWxkU3RhdCwgZmllbGQuYmluLm1heGJpbnMgfHwgc2NoZW1hLk1BWEJJTlNfREVGQVVMVCksXG4gICAgICBudW1iaW5zID0gKGJpbnMuc3RvcCAtIGJpbnMuc3RhcnQpIC8gYmlucy5zdGVwO1xuICAgIHJldHVybiB1dGlsLnJhbmdlKG51bWJpbnMpLm1hcChmdW5jdGlvbihpKSB7XG4gICAgICByZXR1cm4gYmlucy5zdGFydCArIGJpbnMuc3RlcCAqIGk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAobmFtZSA9PSBvcHQuc3RhY2spIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogU1RBQ0tFRCxcbiAgICAgIGZpZWxkOiBlbmNvZGluZy5maWVsZFJlZihuYW1lLCB7XG4gICAgICAgIGRhdGE6ICFlbmNvZGluZy5fdmVnYTIsXG4gICAgICAgIHByZWZuOiAob3B0LmZhY2V0ID8gJ21heF8nIDogJycpICsgJ3N1bV8nXG4gICAgICB9KVxuICAgIH07XG4gIH1cbiAgdmFyIGFnZ3JlZ2F0ZSA9IGVuY29kaW5nLmFnZ3JlZ2F0ZShuYW1lKSxcbiAgICB0aW1lVW5pdCA9IGZpZWxkLnRpbWVVbml0LFxuICAgIHNjYWxlVXNlUmF3RG9tYWluID0gZW5jb2Rpbmcuc2NhbGUobmFtZSkudXNlUmF3RG9tYWluLFxuICAgIHVzZVJhd0RvbWFpbiA9IHNjYWxlVXNlUmF3RG9tYWluICE9PSB1bmRlZmluZWQgP1xuICAgICAgc2NhbGVVc2VSYXdEb21haW4gOiBlbmNvZGluZy5jb25maWcoJ3VzZVJhd0RvbWFpbicpLFxuICAgIG5vdENvdW50T3JTdW0gPSAhYWdncmVnYXRlIHx8IChhZ2dyZWdhdGUgIT09J2NvdW50JyAmJiBhZ2dyZWdhdGUgIT09ICdzdW0nKTtcblxuICAvLyBGSVhNRSByZXZpc2UgdGhpcyBwYXJ0XG5cbiAgaWYgKCB1c2VSYXdEb21haW4gJiYgbm90Q291bnRPclN1bSAmJiAoXG4gICAgICAvLyBRIGFsd2F5cyB1c2VzIG5vbi1vcmRpbmFsIHNjYWxlIGV4Y2VwdCB3aGVuIGl0J3MgYmlubmVkIGFuZCB0aHVzIHVzZXMgb3JkaW5hbCBzY2FsZS5cbiAgICAgIChlbmNvZGluZy5pc1R5cGUobmFtZSwgUSkgJiYgIWZpZWxkLmJpbikgfHxcbiAgICAgIC8vIFQgdXNlcyBub24tb3JkaW5hbCBzY2FsZSB3aGVuIHRoZXJlJ3Mgbm8gdW5pdCBvciB3aGVuIHRoZSB1bml0IGlzIG5vdCBvcmRpbmFsLlxuICAgICAgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSAmJiAoIXRpbWVVbml0IHx8ICF0aW1lLmlzT3JkaW5hbEZuKHRpbWVVbml0KSkpXG4gICAgKVxuICApIHtcbiAgICByZXR1cm4ge2RhdGE6IFJBVywgZmllbGQ6IGVuY29kaW5nLmZpZWxkUmVmKG5hbWUsIHtub2ZuOiAhdGltZVVuaXR9KX07XG4gIH1cblxuICB2YXIgZGF0YSA9IGVuY29kaW5nLnNvcnQobmFtZSwgc3RhdHMpLmxlbmd0aCA+IDAgP1xuICAgIHZsc29ydC5nZXREYXRhTmFtZShuYW1lKTpcbiAgICBlbmNvZGluZy5kYXRhVGFibGUoKTtcblxuICByZXR1cm4ge2RhdGE6IGRhdGEsIGZpZWxkOiBlbmNvZGluZy5maWVsZFJlZihuYW1lKX07XG59O1xuXG5cbnNjYWxlLnJhbmdlID0gZnVuY3Rpb24gKHMsIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSB7XG4gIHZhciBzcGVjID0gZW5jb2Rpbmcuc2NhbGUocy5uYW1lKSxcbiAgICBmaWVsZCA9IGVuY29kaW5nLmZpZWxkKHMubmFtZSksXG4gICAgdGltZVVuaXQgPSBmaWVsZC50aW1lVW5pdDtcblxuICBzd2l0Y2ggKHMubmFtZSkge1xuICAgIGNhc2UgWDpcbiAgICAgIHMucmFuZ2UgPSBsYXlvdXQuY2VsbFdpZHRoID8gWzAsIGxheW91dC5jZWxsV2lkdGhdIDogJ3dpZHRoJztcbiAgICAgIGlmIChzLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICBzLmJhbmRXaWR0aCA9IGVuY29kaW5nLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZW5jb2RpbmcuaXNUeXBlKHMubmFtZSxUKSAmJiB0aW1lVW5pdCA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgcy56ZXJvID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcy56ZXJvID0gc3BlYy56ZXJvID09PSB1bmRlZmluZWQgPyB0cnVlIDogc3BlYy56ZXJvO1xuICAgICAgICB9XG5cbiAgICAgICAgcy5yZXZlcnNlID0gc3BlYy5yZXZlcnNlO1xuICAgICAgfVxuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBpZiAocy50eXBlID09PSAndGltZScpIHtcbiAgICAgICAgcy5uaWNlID0gdGltZVVuaXQgfHwgZW5jb2RpbmcuY29uZmlnKCd0aW1lU2NhbGVOaWNlJyk7XG4gICAgICB9ZWxzZSB7XG4gICAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIFk6XG4gICAgICBpZiAocy50eXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgICAgcy5yYW5nZSA9IGxheW91dC5jZWxsSGVpZ2h0ID9cbiAgICAgICAgICAoZmllbGQuYmluID8gW2xheW91dC5jZWxsSGVpZ2h0LCAwXSA6IFswLCBsYXlvdXQuY2VsbEhlaWdodF0pIDpcbiAgICAgICAgICAnaGVpZ2h0JztcbiAgICAgICAgcy5iYW5kV2lkdGggPSBlbmNvZGluZy5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcy5yYW5nZSA9IGxheW91dC5jZWxsSGVpZ2h0ID8gW2xheW91dC5jZWxsSGVpZ2h0LCAwXSA6ICdoZWlnaHQnO1xuICAgICAgICBpZiAoZW5jb2RpbmcuaXNUeXBlKHMubmFtZSxUKSAmJiB0aW1lVW5pdCA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgcy56ZXJvID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcy56ZXJvID0gc3BlYy56ZXJvID09PSB1bmRlZmluZWQgPyB0cnVlIDogc3BlYy56ZXJvO1xuICAgICAgICB9XG5cbiAgICAgICAgcy5yZXZlcnNlID0gc3BlYy5yZXZlcnNlO1xuICAgICAgfVxuXG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcblxuICAgICAgaWYgKHMudHlwZSA9PT0gJ3RpbWUnKSB7XG4gICAgICAgIHMubmljZSA9IHRpbWVVbml0IHx8IGVuY29kaW5nLmNvbmZpZygndGltZVNjYWxlTmljZScpO1xuICAgICAgfWVsc2Uge1xuICAgICAgICBzLm5pY2UgPSB0cnVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBST1c6IC8vIHN1cHBvcnQgb25seSBvcmRpbmFsXG4gICAgICBzLmJhbmRXaWR0aCA9IGxheW91dC5jZWxsSGVpZ2h0O1xuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBzLm5pY2UgPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBDT0w6IC8vIHN1cHBvcnQgb25seSBvcmRpbmFsXG4gICAgICBzLmJhbmRXaWR0aCA9IGxheW91dC5jZWxsV2lkdGg7XG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcbiAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFNJWkU6XG4gICAgICBpZiAoZW5jb2RpbmcuaXMoJ2JhcicpKSB7XG4gICAgICAgIC8vIEZJWE1FIHRoaXMgaXMgZGVmaW5pdGVseSBpbmNvcnJlY3RcbiAgICAgICAgLy8gYnV0IGxldCdzIGZpeCBpdCBsYXRlciBzaW5jZSBiYXIgc2l6ZSBpcyBhIGJhZCBlbmNvZGluZyBhbnl3YXlcbiAgICAgICAgcy5yYW5nZSA9IFszLCBNYXRoLm1heChlbmNvZGluZy5iYW5kU2l6ZShYKSwgZW5jb2RpbmcuYmFuZFNpemUoWSkpXTtcbiAgICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXMoVEVYVCkpIHtcbiAgICAgICAgcy5yYW5nZSA9IFs4LCA0MF07XG4gICAgICB9IGVsc2UgeyAvL3BvaW50XG4gICAgICAgIHZhciBiYW5kU2l6ZSA9IE1hdGgubWluKGVuY29kaW5nLmJhbmRTaXplKFgpLCBlbmNvZGluZy5iYW5kU2l6ZShZKSkgLSAxO1xuICAgICAgICBzLnJhbmdlID0gWzEwLCAwLjggKiBiYW5kU2l6ZSpiYW5kU2l6ZV07XG4gICAgICB9XG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcbiAgICAgIHMuemVybyA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBTSEFQRTpcbiAgICAgIHMucmFuZ2UgPSAnc2hhcGVzJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQ09MT1I6XG4gICAgICBzLnJhbmdlID0gc2NhbGUuY29sb3IocywgZW5jb2RpbmcsIHN0YXRzKTtcbiAgICAgIGlmIChzLnR5cGUgIT09ICdvcmRpbmFsJykgcy56ZXJvID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nIG5hbWU6ICcrIHMubmFtZSk7XG4gIH1cblxuICAvLyBGSVhNRShrYW5pdHcpOiBKdWwgMjksIDIwMTUgLSBjb25zb2xpZGF0ZSB0aGlzIHdpdGggYWJvdmVcbiAgc3dpdGNoIChzLm5hbWUpIHtcbiAgICBjYXNlIFJPVzpcbiAgICBjYXNlIENPTDpcbiAgICAgIHMucGFkZGluZyA9IGVuY29kaW5nLmNvbmZpZygnY2VsbFBhZGRpbmcnKTtcbiAgICAgIHMub3V0ZXJQYWRkaW5nID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgWDpcbiAgICBjYXNlIFk6XG4gICAgICBpZiAocy50eXBlID09PSAnb3JkaW5hbCcpIHsgLy8mJiAhcy5iYW5kV2lkdGhcbiAgICAgICAgcy5wb2ludHMgPSB0cnVlO1xuICAgICAgICBzLnBhZGRpbmcgPSBlbmNvZGluZy5maWVsZChzLm5hbWUpLmJhbmQucGFkZGluZztcbiAgICAgIH1cbiAgfVxufTtcblxuc2NhbGUuY29sb3IgPSBmdW5jdGlvbihzLCBlbmNvZGluZywgc3RhdHMpIHtcbiAgdmFyIGNvbG9yU2NhbGUgPSBlbmNvZGluZy5zY2FsZShDT0xPUiksXG4gICAgcmFuZ2UgPSBjb2xvclNjYWxlLnJhbmdlLFxuICAgIGNhcmRpbmFsaXR5ID0gZW5jb2RpbmcuY2FyZGluYWxpdHkoQ09MT1IsIHN0YXRzKSxcbiAgICB0eXBlID0gZW5jb2RpbmcudHlwZShDT0xPUik7XG5cbiAgaWYgKHJhbmdlID09PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgb3JkaW5hbFBhbGV0dGUgPSBjb2xvclNjYWxlLm9yZGluYWxQYWxldHRlLFxuICAgICAgcXVhbnRpdGF0aXZlUmFuZ2UgPSBjb2xvclNjYWxlLnF1YW50aXRhdGl2ZVJhbmdlO1xuXG4gICAgaWYgKHMudHlwZSA9PT0gJ29yZGluYWwnKSB7XG4gICAgICBpZiAodHlwZSA9PT0gTikge1xuICAgICAgICAvLyB1c2UgY2F0ZWdvcmljYWwgY29sb3Igc2NhbGVcbiAgICAgICAgaWYgKGNhcmRpbmFsaXR5IDw9IDEwKSB7XG4gICAgICAgICAgcmFuZ2UgPSBjb2xvclNjYWxlLmMxMHBhbGV0dGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmFuZ2UgPSBjb2xvclNjYWxlLmMyMHBhbGV0dGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNjYWxlLmNvbG9yLnBhbGV0dGUocmFuZ2UsIGNhcmRpbmFsaXR5LCB0eXBlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChvcmRpbmFsUGFsZXR0ZSkge1xuICAgICAgICAgIHJldHVybiBzY2FsZS5jb2xvci5wYWxldHRlKG9yZGluYWxQYWxldHRlLCBjYXJkaW5hbGl0eSwgdHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNjYWxlLmNvbG9yLmludGVycG9sYXRlKHF1YW50aXRhdGl2ZVJhbmdlWzBdLCBxdWFudGl0YXRpdmVSYW5nZVsxXSwgY2FyZGluYWxpdHkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vdGltZSBvciBxdWFudGl0YXRpdmVcbiAgICAgIHJldHVybiBbcXVhbnRpdGF0aXZlUmFuZ2VbMF0sIHF1YW50aXRhdGl2ZVJhbmdlWzFdXTtcbiAgICB9XG4gIH1cbn07XG5cbnNjYWxlLmNvbG9yLnBhbGV0dGUgPSBmdW5jdGlvbihyYW5nZSwgY2FyZGluYWxpdHksIHR5cGUpIHtcbiAgLy8gRklYTUUoa2FuaXR3KTogSnVsIDI5LCAyMDE1IC0gY2hlY2sgcmFuZ2UgaXMgc3RyaW5nXG4gIHN3aXRjaCAocmFuZ2UpIHtcbiAgICBjYXNlICdjYXRlZ29yeTEwayc6XG4gICAgICAvLyB0YWJsZWF1J3MgY2F0ZWdvcnkgMTAsIG9yZGVyZWQgYnkgcGVyY2VwdHVhbCBrZXJuZWwgc3R1ZHkgcmVzdWx0c1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3V3ZGF0YS9wZXJjZXB0dWFsLWtlcm5lbHNcbiAgICAgIHJldHVybiBbJyMyY2EwMmMnLCAnI2UzNzdjMicsICcjN2Y3ZjdmJywgJyMxN2JlY2YnLCAnIzhjNTY0YicsICcjZDYyNzI4JywgJyNiY2JkMjInLCAnIzk0NjdiZCcsICcjZmY3ZjBlJywgJyMxZjc3YjQnXTtcblxuICAgIC8vIGQzL3RhYmxlYXUgY2F0ZWdvcnkxMC8yMC8yMGIvMjBjXG4gICAgY2FzZSAnY2F0ZWdvcnkxMCc6XG4gICAgICByZXR1cm4gWycjMWY3N2I0JywgJyNmZjdmMGUnLCAnIzJjYTAyYycsICcjZDYyNzI4JywgJyM5NDY3YmQnLCAnIzhjNTY0YicsICcjZTM3N2MyJywgJyM3ZjdmN2YnLCAnI2JjYmQyMicsICcjMTdiZWNmJ107XG5cbiAgICBjYXNlICdjYXRlZ29yeTIwJzpcbiAgICAgIHJldHVybiBbJyMxZjc3YjQnLCAnI2FlYzdlOCcsICcjZmY3ZjBlJywgJyNmZmJiNzgnLCAnIzJjYTAyYycsICcjOThkZjhhJywgJyNkNjI3MjgnLCAnI2ZmOTg5NicsICcjOTQ2N2JkJywgJyNjNWIwZDUnLCAnIzhjNTY0YicsICcjYzQ5Yzk0JywgJyNlMzc3YzInLCAnI2Y3YjZkMicsICcjN2Y3ZjdmJywgJyNjN2M3YzcnLCAnI2JjYmQyMicsICcjZGJkYjhkJywgJyMxN2JlY2YnLCAnIzllZGFlNSddO1xuXG4gICAgY2FzZSAnY2F0ZWdvcnkyMGInOlxuICAgICAgcmV0dXJuIFsnIzM5M2I3OScsICcjNTI1NGEzJywgJyM2YjZlY2YnLCAnIzljOWVkZScsICcjNjM3OTM5JywgJyM4Y2EyNTInLCAnI2I1Y2Y2YicsICcjY2VkYjljJywgJyM4YzZkMzEnLCAnI2JkOWUzOScsICcjZTdiYTUyJywgJyNlN2NiOTQnLCAnIzg0M2MzOScsICcjYWQ0OTRhJywgJyNkNjYxNmInLCAnI2U3OTY5YycsICcjN2I0MTczJywgJyNhNTUxOTQnLCAnI2NlNmRiZCcsICcjZGU5ZWQ2J107XG5cbiAgICBjYXNlICdjYXRlZ29yeTIwYyc6XG4gICAgICByZXR1cm4gWycjMzE4MmJkJywgJyM2YmFlZDYnLCAnIzllY2FlMScsICcjYzZkYmVmJywgJyNlNjU1MGQnLCAnI2ZkOGQzYycsICcjZmRhZTZiJywgJyNmZGQwYTInLCAnIzMxYTM1NCcsICcjNzRjNDc2JywgJyNhMWQ5OWInLCAnI2M3ZTljMCcsICcjNzU2YmIxJywgJyM5ZTlhYzgnLCAnI2JjYmRkYycsICcjZGFkYWViJywgJyM2MzYzNjMnLCAnIzk2OTY5NicsICcjYmRiZGJkJywgJyNkOWQ5ZDknXTtcbiAgfVxuXG4gIC8vIFRPRE8gYWRkIG91ciBvd24gc2V0IG9mIGN1c3RvbSBvcmRpbmFsIGNvbG9yIHBhbGV0dGVcblxuICBpZiAocmFuZ2UgaW4gY29sb3JicmV3ZXIpIHtcbiAgICB2YXIgcGFsZXR0ZSA9IGNvbG9yYnJld2VyW3JhbmdlXTtcblxuICAgIC8vIGlmIGNhcmRpbmFsaXR5IHByZS1kZWZpbmVkLCB1c2UgaXQuXG4gICAgaWYgKGNhcmRpbmFsaXR5IGluIHBhbGV0dGUpIHJldHVybiBwYWxldHRlW2NhcmRpbmFsaXR5XTtcblxuICAgIC8vIGlmIG5vdCwgdXNlIHRoZSBoaWdoZXN0IGNhcmRpbmFsaXR5IG9uZSBmb3Igbm9taW5hbFxuICAgIGlmICh0eXBlID09PSBOKSB7XG4gICAgICByZXR1cm4gcGFsZXR0ZVtNYXRoLm1heC5hcHBseShudWxsLCB1dGlsLmtleXMocGFsZXR0ZSkpXTtcbiAgICB9XG5cbiAgICAvLyBvdGhlcndpc2UsIGludGVycG9sYXRlXG4gICAgdmFyIHBzID0gY2FyZGluYWxpdHkgPCAzID8gMyA6IE1hdGgubWF4LmFwcGx5KG51bGwsIHV0aWwua2V5cyhwYWxldHRlKSksXG4gICAgICBmcm9tID0gMCAsIHRvID0gcHMgLSAxO1xuICAgIC8vIEZJWE1FIGFkZCBjb25maWcgZm9yIGZyb20gLyB0b1xuXG4gICAgcmV0dXJuIHNjYWxlLmNvbG9yLmludGVycG9sYXRlKHBhbGV0dGVbcHNdW2Zyb21dLCBwYWxldHRlW3BzXVt0b10sIGNhcmRpbmFsaXR5KTtcbiAgfVxuXG4gIHJldHVybiByYW5nZTtcbn07XG5cbnNjYWxlLmNvbG9yLmludGVycG9sYXRlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQsIGNhcmRpbmFsaXR5KSB7XG5cbiAgdmFyIGludGVycG9sYXRvciA9IGludGVycG9sYXRlKHN0YXJ0LCBlbmQpO1xuICByZXR1cm4gdXRpbC5yYW5nZShjYXJkaW5hbGl0eSkubWFwKGZ1bmN0aW9uKGkpIHsgcmV0dXJuIGludGVycG9sYXRvcihpKjEuMC8oY2FyZGluYWxpdHktMSkpOyB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHZsZmllbGQgPSByZXF1aXJlKCcuLi9maWVsZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNvcnQ7XG5cbi8vIGFkZHMgbmV3IHRyYW5zZm9ybXMgdGhhdCBwcm9kdWNlIHNvcnRlZCBmaWVsZHNcbmZ1bmN0aW9uIHNvcnQoZGF0YSwgZW5jb2RpbmcsIHN0YXRzLCBvcHQpIHtcbiAgLy8ganNoaW50IHVudXNlZDpmYWxzZVxuXG4gIHZhciBkYXRhc2V0TWFwcGluZyA9IHt9O1xuXG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICB2YXIgc29ydEJ5ID0gZW5jb2Rpbmcuc29ydChlbmNUeXBlLCBzdGF0cyk7XG4gICAgaWYgKHNvcnRCeS5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgZmllbGRzID0gc29ydEJ5Lm1hcChmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgb3A6IGQuYWdncmVnYXRlLFxuICAgICAgICAgIGZpZWxkOiB2bGZpZWxkLmZpZWxkUmVmKGQsIHtub2ZuOiB0cnVlLCBkYXRhOiAhZW5jb2RpbmcuX3ZlZ2EyfSlcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgYnlDbGF1c2UgPSBzb3J0QnkubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgdmFyIHJldmVyc2UgPSAoZC5yZXZlcnNlID8gJy0nIDogJycpO1xuICAgICAgICByZXR1cm4gcmV2ZXJzZSArIHZsZmllbGQuZmllbGRSZWYoZCwge2RhdGE6ICFlbmNvZGluZy5fdmVnYTJ9KTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgZGF0YU5hbWUgPSBzb3J0LmdldERhdGFOYW1lKGVuY1R5cGUpO1xuXG4gICAgICB2YXIgdHJhbnNmb3JtcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFsgZW5jb2RpbmcuZmllbGRSZWYoZW5jVHlwZSkgXSxcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ3NvcnQnLFxuICAgICAgICAgIGJ5OiBieUNsYXVzZVxuICAgICAgICB9XG4gICAgICBdO1xuXG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBuYW1lOiBkYXRhTmFtZSxcbiAgICAgICAgc291cmNlOiBSQVcsXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNmb3Jtc1xuICAgICAgfSk7XG5cbiAgICAgIGRhdGFzZXRNYXBwaW5nW2VuY1R5cGVdID0gZGF0YU5hbWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn1cblxuc29ydC5nZXREYXRhTmFtZSA9IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgcmV0dXJuICdzb3J0ZWQtJyArIGVuY1R5cGU7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyICBtYXJrcyA9IHJlcXVpcmUoJy4vbWFya3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja2luZztcblxuZnVuY3Rpb24gc3RhY2tpbmcoZGF0YSwgZW5jb2RpbmcsIG1kZWYpIHtcbiAgaWYgKCFtYXJrc1tlbmNvZGluZy5tYXJrdHlwZSgpXS5zdGFjaykgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIFRPRE86IGFkZCB8fCBlbmNvZGluZy5oYXMoTE9EKSBoZXJlIG9uY2UgTE9EIGlzIGltcGxlbWVudGVkXG4gIGlmICghZW5jb2RpbmcuaGFzKENPTE9SKSkgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBkaW09bnVsbCwgdmFsPW51bGwsIGlkeCA9bnVsbCxcbiAgICBpc1hNZWFzdXJlID0gZW5jb2RpbmcuaXNNZWFzdXJlKFgpLFxuICAgIGlzWU1lYXN1cmUgPSBlbmNvZGluZy5pc01lYXN1cmUoWSksXG4gICAgZmFjZXRzID0gZW5jb2RpbmcuZmFjZXRzKCk7XG5cbiAgaWYgKGlzWE1lYXN1cmUgJiYgIWlzWU1lYXN1cmUpIHtcbiAgICBkaW0gPSBZO1xuICAgIHZhbCA9IFg7XG4gICAgaWR4ID0gMDtcbiAgfSBlbHNlIGlmIChpc1lNZWFzdXJlICYmICFpc1hNZWFzdXJlKSB7XG4gICAgZGltID0gWDtcbiAgICB2YWwgPSBZO1xuICAgIGlkeCA9IDE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7IC8vIG5vIHN0YWNrIGVuY29kaW5nXG4gIH1cblxuICAvLyBhZGQgdHJhbnNmb3JtIHRvIGNvbXB1dGUgc3VtcyBmb3Igc2NhbGVcbiAgdmFyIHN0YWNrZWQgPSB7XG4gICAgbmFtZTogU1RBQ0tFRCxcbiAgICBzb3VyY2U6IGVuY29kaW5nLmRhdGFUYWJsZSgpLFxuICAgIHRyYW5zZm9ybTogW3tcbiAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgZ3JvdXBieTogW2VuY29kaW5nLmZpZWxkUmVmKGRpbSldLmNvbmNhdChmYWNldHMpLCAvLyBkaW0gYW5kIG90aGVyIGZhY2V0c1xuICAgICAgZmllbGRzOiBbe29wOiAnc3VtJywgZmllbGQ6IGVuY29kaW5nLmZpZWxkUmVmKHZhbCl9XSAvLyBUT0RPIGNoZWNrIGlmIGZpZWxkIHdpdGggYWdncmVnYXRlIGlzIGNvcnJlY3Q/XG4gICAgfV1cbiAgfTtcblxuICBpZiAoZmFjZXRzICYmIGZhY2V0cy5sZW5ndGggPiAwKSB7XG4gICAgc3RhY2tlZC50cmFuc2Zvcm0ucHVzaCh7IC8vY2FsY3VsYXRlIG1heCBmb3IgZWFjaCBmYWNldFxuICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICBncm91cGJ5OiBmYWNldHMsXG4gICAgICBmaWVsZHM6IFt7XG4gICAgICAgIG9wOiAnbWF4JyxcbiAgICAgICAgZmllbGQ6IGVuY29kaW5nLmZpZWxkTmFtZSh2YWwsIHtmbjogJ3N1bSd9KVxuICAgICAgfV1cbiAgICB9KTtcbiAgfVxuXG4gIGRhdGEucHVzaChzdGFja2VkKTtcblxuICAvLyBhZGQgc3RhY2sgdHJhbnNmb3JtIHRvIG1hcmtcbiAgbWRlZi5mcm9tLnRyYW5zZm9ybSA9IFt7XG4gICAgdHlwZTogJ3N0YWNrJyxcbiAgICBwb2ludDogZW5jb2RpbmcuZmllbGRSZWYoZGltKSxcbiAgICBoZWlnaHQ6IGVuY29kaW5nLmZpZWxkUmVmKHZhbCksXG4gICAgb3V0cHV0OiB7eTE6IHZhbCwgeTA6IHZhbCArICcyJ31cbiAgfV07XG5cbiAgLy8gVE9ETzogVGhpcyBpcyBzdXBlciBoYWNrLWlzaCAtLSBjb25zb2xpZGF0ZSBpbnRvIG1vZHVsYXIgbWFyayBwcm9wZXJ0aWVzP1xuICBtZGVmLnByb3BlcnRpZXMudXBkYXRlW3ZhbF0gPSBtZGVmLnByb3BlcnRpZXMuZW50ZXJbdmFsXSA9IHtzY2FsZTogdmFsLCBmaWVsZDogdmFsfTtcbiAgbWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZVt2YWwgKyAnMiddID0gbWRlZi5wcm9wZXJ0aWVzLmVudGVyW3ZhbCArICcyJ10gPSB7c2NhbGU6IHZhbCwgZmllbGQ6IHZhbCArICcyJ307XG5cbiAgcmV0dXJuIHZhbDsgLy9yZXR1cm4gc3RhY2sgZW5jb2Rpbmdcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgdmxmaWVsZCA9IHJlcXVpcmUoJy4uL2ZpZWxkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHJldHVybiB7XG4gICAgb3BhY2l0eTogZXN0aW1hdGVPcGFjaXR5KGVuY29kaW5nLCBzdGF0cyksXG4gIH07XG59O1xuXG5mdW5jdGlvbiBlc3RpbWF0ZU9wYWNpdHkoZW5jb2Rpbmcsc3RhdHMpIHtcbiAgaWYgKCFzdGF0cykge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgdmFyIG51bVBvaW50cyA9IDA7XG5cbiAgaWYgKGVuY29kaW5nLmlzQWdncmVnYXRlKCkpIHsgLy8gYWdncmVnYXRlIHBsb3RcbiAgICBudW1Qb2ludHMgPSAxO1xuXG4gICAgLy8gIGdldCBudW1iZXIgb2YgcG9pbnRzIGluIGVhY2ggXCJjZWxsXCJcbiAgICAvLyAgYnkgY2FsY3VsYXRpbmcgcHJvZHVjdCBvZiBjYXJkaW5hbGl0eVxuICAgIC8vICBmb3IgZWFjaCBub24gZmFjZXRpbmcgYW5kIG5vbi1vcmRpbmFsIFggLyBZIGZpZWxkc1xuICAgIC8vICBub3RlIHRoYXQgb3JkaW5hbCB4LHkgYXJlIG5vdCBpbmNsdWRlIHNpbmNlIHdlIGNhblxuICAgIC8vICBjb25zaWRlciB0aGF0IG9yZGluYWwgeCBhcmUgc3ViZGl2aWRpbmcgdGhlIGNlbGwgaW50byBzdWJjZWxscyBhbnl3YXlcbiAgICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG5cbiAgICAgIGlmIChlbmNUeXBlICE9PSBST1cgJiYgZW5jVHlwZSAhPT0gQ09MICYmXG4gICAgICAgICAgISgoZW5jVHlwZSA9PT0gWCB8fCBlbmNUeXBlID09PSBZKSAmJlxuICAgICAgICAgIHZsZmllbGQuaXNPcmRpbmFsU2NhbGUoZmllbGQpKVxuICAgICAgICApIHtcbiAgICAgICAgbnVtUG9pbnRzICo9IGVuY29kaW5nLmNhcmRpbmFsaXR5KGVuY1R5cGUsIHN0YXRzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9IGVsc2UgeyAvLyByYXcgcGxvdFxuXG4gICAgLy8gVE9ETzogZXJyb3IgaGFuZGxpbmdcbiAgICBpZiAoIXN0YXRzWycqJ10pXG4gICAgICByZXR1cm4gMTtcblxuICAgIG51bVBvaW50cyA9IHN0YXRzWycqJ10ubWF4OyAgLy8gY291bnRcblxuICAgIC8vIHNtYWxsIG11bHRpcGxlcyBkaXZpZGUgbnVtYmVyIG9mIHBvaW50c1xuICAgIHZhciBudW1NdWx0aXBsZXMgPSAxO1xuICAgIGlmIChlbmNvZGluZy5oYXMoUk9XKSkge1xuICAgICAgbnVtTXVsdGlwbGVzICo9IGVuY29kaW5nLmNhcmRpbmFsaXR5KFJPVywgc3RhdHMpO1xuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcuaGFzKENPTCkpIHtcbiAgICAgIG51bU11bHRpcGxlcyAqPSBlbmNvZGluZy5jYXJkaW5hbGl0eShDT0wsIHN0YXRzKTtcbiAgICB9XG4gICAgbnVtUG9pbnRzIC89IG51bU11bHRpcGxlcztcbiAgfVxuXG4gIHZhciBvcGFjaXR5ID0gMDtcbiAgaWYgKG51bVBvaW50cyA8PSAyNSkge1xuICAgIG9wYWNpdHkgPSAxO1xuICB9IGVsc2UgaWYgKG51bVBvaW50cyA8IDIwMCkge1xuICAgIG9wYWNpdHkgPSAwLjg7XG4gIH0gZWxzZSBpZiAobnVtUG9pbnRzIDwgMTAwMCB8fCBlbmNvZGluZy5pcygndGljaycpKSB7XG4gICAgb3BhY2l0eSA9IDAuNztcbiAgfSBlbHNlIHtcbiAgICBvcGFjaXR5ID0gMC4zO1xuICB9XG5cbiAgcmV0dXJuIG9wYWNpdHk7XG59XG5cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgZ3JvdXBkZWYgPSByZXF1aXJlKCcuL2dyb3VwJykuZGVmO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN1YmZhY2V0aW5nO1xuXG5mdW5jdGlvbiBzdWJmYWNldGluZyhncm91cCwgbWRlZiwgZGV0YWlscywgc3RhY2ssIGVuY29kaW5nKSB7XG4gIHZhciBtID0gZ3JvdXAubWFya3MsXG4gICAgZyA9IGdyb3VwZGVmKCdzdWJmYWNldCcsIHttYXJrczogbX0pO1xuXG4gIGdyb3VwLm1hcmtzID0gW2ddO1xuICBnLmZyb20gPSBtZGVmLmZyb207XG4gIGRlbGV0ZSBtZGVmLmZyb207XG5cbiAgLy9UT0RPIHRlc3QgTE9EIC0tIHdlIHNob3VsZCBzdXBwb3J0IHN0YWNrIC8gbGluZSB3aXRob3V0IGNvbG9yIChMT0QpIGZpZWxkXG4gIHZhciB0cmFucyA9IChnLmZyb20udHJhbnNmb3JtIHx8IChnLmZyb20udHJhbnNmb3JtID0gW10pKTtcbiAgdHJhbnMudW5zaGlmdCh7dHlwZTogJ2ZhY2V0Jywga2V5czogZGV0YWlsc30pO1xuXG4gIGlmIChzdGFjayAmJiBlbmNvZGluZy5oYXMoQ09MT1IpKSB7XG4gICAgdHJhbnMudW5zaGlmdCh7dHlwZTogJ3NvcnQnLCBieTogZW5jb2RpbmcuZmllbGRSZWYoQ09MT1IpfSk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIGQzX3RpbWVfZm9ybWF0ID0gcmVxdWlyZSgnZDMtdGltZS1mb3JtYXQnKTtcblxudmFyIHRpbWUgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG52YXIgTE9OR19EQVRFID0gbmV3IERhdGUoMjAxNCwgOCwgMTcpO1xuXG50aW1lLmNhcmRpbmFsaXR5ID0gZnVuY3Rpb24oZmllbGQsIHN0YXRzLCBmaWx0ZXJOdWxsLCB0eXBlKSB7XG4gIHZhciB0aW1lVW5pdCA9IGZpZWxkLnRpbWVVbml0O1xuICBzd2l0Y2ggKHRpbWVVbml0KSB7XG4gICAgY2FzZSAnc2Vjb25kcyc6IHJldHVybiA2MDtcbiAgICBjYXNlICdtaW51dGVzJzogcmV0dXJuIDYwO1xuICAgIGNhc2UgJ2hvdXJzJzogcmV0dXJuIDI0O1xuICAgIGNhc2UgJ2RheSc6IHJldHVybiA3O1xuICAgIGNhc2UgJ2RhdGUnOiByZXR1cm4gMzE7XG4gICAgY2FzZSAnbW9udGgnOiByZXR1cm4gMTI7XG4gICAgY2FzZSAneWVhcic6XG4gICAgICB2YXIgc3RhdCA9IHN0YXRzW2ZpZWxkLm5hbWVdLFxuICAgICAgICB5ZWFyc3RhdCA9IHN0YXRzWyd5ZWFyXycrZmllbGQubmFtZV07XG5cbiAgICAgIGlmICgheWVhcnN0YXQpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgICAgcmV0dXJuIHllYXJzdGF0LmRpc3RpbmN0IC1cbiAgICAgICAgKHN0YXQubnVsbHMgPiAwICYmIGZpbHRlck51bGxbdHlwZV0gPyAxIDogMCk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cbnRpbWUuZm9ybXVsYSA9IGZ1bmN0aW9uKHRpbWVVbml0LCBmaWVsZFJlZikge1xuICAvLyBUT0RPKGthbml0dyk6IGFkZCBmb3JtdWxhIHRvIG90aGVyIHRpbWUgZm9ybWF0XG4gIHZhciBmbiA9ICd1dGMnICsgdGltZVVuaXQ7XG4gIHJldHVybiBmbiArICcoJyArIGZpZWxkUmVmICsgJyknO1xufTtcblxudGltZS5tYXhMZW5ndGggPSBmdW5jdGlvbih0aW1lVW5pdCwgZW5jb2RpbmcpIHtcbiAgc3dpdGNoICh0aW1lVW5pdCkge1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ21pbnV0ZXMnOlxuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdkYXRlJzpcbiAgICAgIHJldHVybiAyO1xuICAgIGNhc2UgJ21vbnRoJzpcbiAgICBjYXNlICdkYXknOlxuICAgICAgdmFyIHJhbmdlID0gdGltZS5yYW5nZSh0aW1lVW5pdCwgZW5jb2RpbmcpO1xuICAgICAgaWYgKHJhbmdlKSB7XG4gICAgICAgIC8vIHJldHVybiB0aGUgbG9uZ2VzdCBuYW1lIGluIHRoZSByYW5nZVxuICAgICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgcmFuZ2UubWFwKGZ1bmN0aW9uKHIpIHtyZXR1cm4gci5sZW5ndGg7fSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDI7XG4gICAgY2FzZSAneWVhcic6XG4gICAgICByZXR1cm4gNDsgLy8nMTk5OCdcbiAgfVxuICAvLyBubyB0aW1lIHVuaXRcbiAgdmFyIHRpbWVGb3JtYXQgPSBlbmNvZGluZy5jb25maWcoJ3RpbWVGb3JtYXQnKTtcbiAgcmV0dXJuIGQzX3RpbWVfZm9ybWF0LnV0Y0Zvcm1hdCh0aW1lRm9ybWF0KShMT05HX0RBVEUpLmxlbmd0aDtcbn07XG5cbnRpbWUucmFuZ2UgPSBmdW5jdGlvbih0aW1lVW5pdCwgZW5jb2RpbmcpIHtcbiAgdmFyIGxhYmVsTGVuZ3RoID0gZW5jb2RpbmcuY29uZmlnKCd0aW1lU2NhbGVMYWJlbExlbmd0aCcpLFxuICAgIHNjYWxlTGFiZWw7XG4gIHN3aXRjaCAodGltZVVuaXQpIHtcbiAgICBjYXNlICdkYXknOlxuICAgICAgc2NhbGVMYWJlbCA9IGVuY29kaW5nLmNvbmZpZygnZGF5U2NhbGVMYWJlbCcpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbW9udGgnOlxuICAgICAgc2NhbGVMYWJlbCA9IGVuY29kaW5nLmNvbmZpZygnbW9udGhTY2FsZUxhYmVsJyk7XG4gICAgICBicmVhaztcbiAgfVxuICBpZiAoc2NhbGVMYWJlbCkge1xuICAgIHJldHVybiBsYWJlbExlbmd0aCA/IHNjYWxlTGFiZWwubWFwKFxuICAgICAgICBmdW5jdGlvbihzKSB7IHJldHVybiBzLnN1YnN0cigwLCBsYWJlbExlbmd0aCk7fVxuICAgICAgKSA6IHNjYWxlTGFiZWw7XG4gIH1cbiAgcmV0dXJuO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge09iamVjdH0gZW5jb2RpbmdcbiAqIEByZXR1cm4ge0FycmF5fSAgc2NhbGVzIGZvciB0aW1lIHVuaXQgbmFtZXNcbiAqL1xudGltZS5zY2FsZXMgPSBmdW5jdGlvbihlbmNvZGluZykge1xuICB2YXIgc2NhbGVzID0gZW5jb2RpbmcucmVkdWNlKGZ1bmN0aW9uKHNjYWxlcywgZmllbGQpIHtcbiAgICB2YXIgdGltZVVuaXQgPSBmaWVsZC50aW1lVW5pdDtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gVCAmJiB0aW1lVW5pdCAmJiAhc2NhbGVzW3RpbWVVbml0XSkge1xuICAgICAgdmFyIHNjYWxlID0gdGltZS5zY2FsZS5kZWYoZmllbGQudGltZVVuaXQsIGVuY29kaW5nKTtcbiAgICAgIGlmIChzY2FsZSkgc2NhbGVzW3RpbWVVbml0XSA9IHNjYWxlO1xuICAgIH1cbiAgICByZXR1cm4gc2NhbGVzO1xuICB9LCB7fSk7XG5cbiAgcmV0dXJuIHV0aWwudmFscyhzY2FsZXMpO1xufTtcblxuXG50aW1lLnNjYWxlID0ge307XG5cbi8qKiBhcHBlbmQgY3VzdG9tIHRpbWUgc2NhbGVzIGZvciBheGlzIGxhYmVsICovXG50aW1lLnNjYWxlLmRlZiA9IGZ1bmN0aW9uKHRpbWVVbml0LCBlbmNvZGluZykge1xuICB2YXIgcmFuZ2UgPSB0aW1lLnJhbmdlKHRpbWVVbml0LCBlbmNvZGluZyk7XG5cbiAgaWYgKHJhbmdlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICd0aW1lLScrdGltZVVuaXQsXG4gICAgICB0eXBlOiAnb3JkaW5hbCcsXG4gICAgICBkb21haW46IHRpbWUuc2NhbGUuZG9tYWluKHRpbWVVbml0KSxcbiAgICAgIHJhbmdlOiByYW5nZVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG50aW1lLmlzT3JkaW5hbEZuID0gZnVuY3Rpb24odGltZVVuaXQpIHtcbiAgc3dpdGNoICh0aW1lVW5pdCkge1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ21pbnV0ZXMnOlxuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2RhdGUnOlxuICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnRpbWUuc2NhbGUudHlwZSA9IGZ1bmN0aW9uKHRpbWVVbml0LCBuYW1lKSB7XG4gIGlmIChuYW1lID09PSBDT0xPUikge1xuICAgIHJldHVybiAnbGluZWFyJzsgLy8gdGltZSBoYXMgb3JkZXIsIHNvIHVzZSBpbnRlcnBvbGF0ZWQgb3JkaW5hbCBjb2xvciBzY2FsZS5cbiAgfVxuXG4gIHJldHVybiB0aW1lLmlzT3JkaW5hbEZuKHRpbWVVbml0KSB8fCBuYW1lID09PSBDT0wgfHwgbmFtZSA9PT0gUk9XID8gJ29yZGluYWwnIDogJ2xpbmVhcic7XG59O1xuXG50aW1lLnNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKHRpbWVVbml0LCBuYW1lKSB7XG4gIHZhciBpc0NvbG9yID0gbmFtZSA9PT0gQ09MT1I7XG4gIHN3aXRjaCAodGltZVVuaXQpIHtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdtaW51dGVzJzogcmV0dXJuIGlzQ29sb3IgPyBbMCw1OV0gOiB1dGlsLnJhbmdlKDAsIDYwKTtcbiAgICBjYXNlICdob3Vycyc6IHJldHVybiBpc0NvbG9yID8gWzAsMjNdIDogdXRpbC5yYW5nZSgwLCAyNCk7XG4gICAgY2FzZSAnZGF5JzogcmV0dXJuIGlzQ29sb3IgPyBbMCw2XSA6IHV0aWwucmFuZ2UoMCwgNyk7XG4gICAgY2FzZSAnZGF0ZSc6IHJldHVybiBpc0NvbG9yID8gWzEsMzFdIDogdXRpbC5yYW5nZSgxLCAzMik7XG4gICAgY2FzZSAnbW9udGgnOiByZXR1cm4gaXNDb2xvciA/IFswLDExXSA6IHV0aWwucmFuZ2UoMCwgMTIpO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLyoqIHdoZXRoZXIgYSBwYXJ0aWN1bGFyIHRpbWUgZnVuY3Rpb24gaGFzIGN1c3RvbSBzY2FsZSBmb3IgbGFiZWxzIGltcGxlbWVudGVkIGluIHRpbWUuc2NhbGUgKi9cbnRpbWUuaGFzU2NhbGUgPSBmdW5jdGlvbih0aW1lVW5pdCkge1xuICBzd2l0Y2ggKHRpbWVVbml0KSB7XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdtb250aCc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuL2dsb2JhbHMnKTtcblxudmFyIGNvbnN0cyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmNvbnN0cy5lbmNvZGluZ1R5cGVzID0gW1gsIFksIFJPVywgQ09MLCBTSVpFLCBTSEFQRSwgQ09MT1IsIFRFWFQsIERFVEFJTF07XG5cbmNvbnN0cy5zaG9ydGhhbmQgPSB7XG4gIGRlbGltOiAgJ3wnLFxuICBhc3NpZ246ICc9JyxcbiAgdHlwZTogICAnLCcsXG4gIGZ1bmM6ICAgJ18nXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuL2dsb2JhbHMnKTtcblxudmFyIHN0YXRzID0gcmVxdWlyZSgnZGF0YWxpYi9zcmMvc3RhdHMnKTtcblxudmFyIHZsZGF0YSA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8qKiBNYXBwaW5nIGZyb20gZGF0YWxpYidzIGluZmVycmVkIHR5cGUgdG8gVmVnYS1saXRlJ3MgdHlwZSAqL1xudmxkYXRhLnR5cGVzID0ge1xuICAnYm9vbGVhbic6IE4sXG4gICdudW1iZXInOiBRLFxuICAnaW50ZWdlcic6IFEsXG4gICdkYXRlJzogVCxcbiAgJ3N0cmluZyc6IE5cbn07XG5cbnZsZGF0YS5zdGF0cyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgdmFyIHN1bW1hcnkgPSBzdGF0cy5zdW1tYXJ5KGRhdGEpO1xuXG4gIHJldHVybiBzdW1tYXJ5LnJlZHVjZShmdW5jdGlvbihzLCBwcm9maWxlKSB7XG4gICAgc1twcm9maWxlLmZpZWxkXSA9IHByb2ZpbGU7XG4gICAgcmV0dXJuIHM7XG4gIH0sIHtcbiAgICAnKic6IHtcbiAgICAgIG1heDogZGF0YS5sZW5ndGgsXG4gICAgICBtaW46IDBcbiAgICB9XG4gIH0pO1xufTsiLCIvLyB1dGlsaXR5IGZvciBlbmNcblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKSxcbiAgYyA9IGNvbnN0cy5zaG9ydGhhbmQsXG4gIHZsZmllbGQgPSByZXF1aXJlKCcuL2ZpZWxkJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKSxcbiAgc2NoZW1hID0gcmVxdWlyZSgnLi9zY2hlbWEvc2NoZW1hJyksXG4gIGVuY1R5cGVzID0gc2NoZW1hLmVuY1R5cGVzO1xuXG52YXIgdmxlbmMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG52bGVuYy5jb3VudFJldGluYWwgPSBmdW5jdGlvbihlbmMpIHtcbiAgdmFyIGNvdW50ID0gMDtcbiAgaWYgKGVuYy5jb2xvcikgY291bnQrKztcbiAgaWYgKGVuYy5zaXplKSBjb3VudCsrO1xuICBpZiAoZW5jLnNoYXBlKSBjb3VudCsrO1xuICByZXR1cm4gY291bnQ7XG59O1xuXG52bGVuYy5oYXMgPSBmdW5jdGlvbihlbmMsIGVuY1R5cGUpIHtcbiAgdmFyIGZpZWxkRGVmID0gZW5jICYmIGVuY1tlbmNUeXBlXTtcbiAgcmV0dXJuIGZpZWxkRGVmICYmIGZpZWxkRGVmLm5hbWU7XG59O1xuXG52bGVuYy5pc0FnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKGVuYykge1xuICBmb3IgKHZhciBrIGluIGVuYykge1xuICAgIGlmICh2bGVuYy5oYXMoZW5jLCBrKSAmJiBlbmNba10uYWdncmVnYXRlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxudmxlbmMuZm9yRWFjaCA9IGZ1bmN0aW9uKGVuYywgZikge1xuICB2YXIgaSA9IDA7XG4gIGVuY1R5cGVzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgIGlmICh2bGVuYy5oYXMoZW5jLCBrKSkge1xuICAgICAgZihlbmNba10sIGssIGkrKyk7XG4gICAgfVxuICB9KTtcbn07XG5cbnZsZW5jLm1hcCA9IGZ1bmN0aW9uKGVuYywgZikge1xuICB2YXIgYXJyID0gW107XG4gIGVuY1R5cGVzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgIGlmICh2bGVuYy5oYXMoZW5jLCBrKSkge1xuICAgICAgYXJyLnB1c2goZihlbmNba10sIGssIGVuYykpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhcnI7XG59O1xuXG52bGVuYy5yZWR1Y2UgPSBmdW5jdGlvbihlbmMsIGYsIGluaXQpIHtcbiAgdmFyIHIgPSBpbml0O1xuICBlbmNUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykpIHtcbiAgICAgIHIgPSBmKHIsIGVuY1trXSwgaywgIGVuYyk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHI7XG59O1xuXG4vKlxuICogcmV0dXJuIGtleS12YWx1ZSBwYWlycyBvZiBmaWVsZCBuYW1lIGFuZCBsaXN0IG9mIGZpZWxkcyBvZiB0aGF0IGZpZWxkIG5hbWVcbiAqL1xudmxlbmMuZmllbGRzID0gZnVuY3Rpb24oZW5jKSB7XG4gIHJldHVybiB2bGVuYy5yZWR1Y2UoZW5jLCBmdW5jdGlvbiAobSwgZmllbGQpIHtcbiAgICB2YXIgZmllbGRMaXN0ID0gbVtmaWVsZC5uYW1lXSA9IG1bZmllbGQubmFtZV0gfHwgW10sXG4gICAgICBjb250YWluc1R5cGUgPSBmaWVsZExpc3QuY29udGFpbnNUeXBlID0gZmllbGRMaXN0LmNvbnRhaW5zVHlwZSB8fCB7fTtcblxuICAgIGlmIChmaWVsZExpc3QuaW5kZXhPZihmaWVsZCkgPT09IC0xKSB7XG4gICAgICBmaWVsZExpc3QucHVzaChmaWVsZCk7XG4gICAgICAvLyBhdWdtZW50IHRoZSBhcnJheSB3aXRoIGNvbnRhaW5zVHlwZS5RIC8gTyAvIE4gLyBUXG4gICAgICBjb250YWluc1R5cGVbZmllbGQudHlwZV0gPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gbTtcbiAgfSwge30pO1xufTtcblxudmxlbmMuc2hvcnRoYW5kID0gZnVuY3Rpb24oZW5jKSB7XG4gIHJldHVybiB2bGVuYy5tYXAoZW5jLCBmdW5jdGlvbihmaWVsZCwgZXQpIHtcbiAgICByZXR1cm4gZXQgKyBjLmFzc2lnbiArIHZsZmllbGQuc2hvcnRoYW5kKGZpZWxkKTtcbiAgfSkuam9pbihjLmRlbGltKTtcbn07XG5cbnZsZW5jLmZyb21TaG9ydGhhbmQgPSBmdW5jdGlvbihzaG9ydGhhbmQpIHtcbiAgdmFyIGVuYyA9IHV0aWwuaXNBcnJheShzaG9ydGhhbmQpID8gc2hvcnRoYW5kIDogc2hvcnRoYW5kLnNwbGl0KGMuZGVsaW0pO1xuICByZXR1cm4gZW5jLnJlZHVjZShmdW5jdGlvbihtLCBlKSB7XG4gICAgdmFyIHNwbGl0ID0gZS5zcGxpdChjLmFzc2lnbiksXG4gICAgICAgIGVuY3R5cGUgPSBzcGxpdFswXS50cmltKCksXG4gICAgICAgIGZpZWxkID0gc3BsaXRbMV07XG5cbiAgICBtW2VuY3R5cGVdID0gdmxmaWVsZC5mcm9tU2hvcnRoYW5kKGZpZWxkKTtcbiAgICByZXR1cm4gbTtcbiAgfSwge30pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8vIHV0aWxpdHkgZm9yIGZpZWxkXG5cbnJlcXVpcmUoJy4vZ2xvYmFscycpO1xuXG52YXIgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKSxcbiAgYyA9IGNvbnN0cy5zaG9ydGhhbmQsXG4gIHRpbWUgPSByZXF1aXJlKCcuL2NvbXBpbGVyL3RpbWUnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICBzY2hlbWEgPSByZXF1aXJlKCcuL3NjaGVtYS9zY2hlbWEnKTtcblxudmFyIHZsZmllbGQgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vKipcbiAqIEBwYXJhbSBmaWVsZFxuICogQHBhcmFtIG9wdFxuICogICBvcHQubm9mbiAtLSBleGNsdWRlIGJpbiwgYWdncmVnYXRlLCB0aW1lVW5pdFxuICogICBvcHQuZGF0YSAtIGluY2x1ZGUgJ2RhdGEuJ1xuICogICBvcHQuZCAtIGluY2x1ZGUgJ2QuJ1xuICogICBvcHQuZm4gLSByZXBsYWNlIGZuIHdpdGggY3VzdG9tIGZ1bmN0aW9uIHByZWZpeFxuICogICBvcHQucHJlZm4gLSBwcmVwZW5kIGZuIHdpdGggY3VzdG9tIGZ1bmN0aW9uIHByZWZpeFxuXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xudmxmaWVsZC5maWVsZFJlZiA9IGZ1bmN0aW9uKGZpZWxkLCBvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gIHZhciBmID0gKG9wdC5kID8gJ2QuJyA6ICcnKSArXG4gICAgICAgICAgKG9wdC5kYXRhID8gJ2RhdGEuJyA6ICcnKSArXG4gICAgICAgICAgKG9wdC5wcmVmbiB8fCAnJyksXG4gICAgbm9mbiA9IG9wdC5ub2ZuIHx8IG9wdC5mbixcbiAgICBuYW1lID0gZmllbGQubmFtZTtcblxuICBpZiAodmxmaWVsZC5pc0NvdW50KGZpZWxkKSkge1xuICAgIHJldHVybiBmICsgJ2NvdW50JztcbiAgfSBlbHNlIGlmICghbm9mbiAmJiBmaWVsZC5iaW4pIHtcbiAgICByZXR1cm4gZiArICdiaW5fJyArIG5hbWU7XG4gIH0gZWxzZSBpZiAoIW5vZm4gJiYgZmllbGQuYWdncmVnYXRlKSB7XG4gICAgcmV0dXJuIGYgKyBmaWVsZC5hZ2dyZWdhdGUgKyAnXycgKyBuYW1lO1xuICB9IGVsc2UgaWYgKCFub2ZuICYmIGZpZWxkLnRpbWVVbml0KSB7XG4gICAgcmV0dXJuIGYgKyBmaWVsZC50aW1lVW5pdCArICdfJyArIG5hbWU7XG4gIH0gZWxzZSBpZiAob3B0LmZuKSB7XG4gICAgcmV0dXJuIGYgKyBvcHQuZm4gKyAnXycgKyBuYW1lO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmICsgbmFtZTtcbiAgfVxufTtcblxudmxmaWVsZC5zaG9ydGhhbmQgPSBmdW5jdGlvbihmKSB7XG4gIHZhciBjID0gY29uc3RzLnNob3J0aGFuZDtcbiAgcmV0dXJuIChmLmFnZ3JlZ2F0ZSA/IGYuYWdncmVnYXRlICsgYy5mdW5jIDogJycpICtcbiAgICAoZi50aW1lVW5pdCA/IGYudGltZVVuaXQgKyBjLmZ1bmMgOiAnJykgK1xuICAgIChmLmJpbiA/ICdiaW4nICsgYy5mdW5jIDogJycpICtcbiAgICAoZi5uYW1lIHx8ICcnKSArIGMudHlwZSArIGYudHlwZTtcbn07XG5cbnZsZmllbGQuc2hvcnRoYW5kcyA9IGZ1bmN0aW9uKGZpZWxkcywgZGVsaW0pIHtcbiAgZGVsaW0gPSBkZWxpbSB8fCBjLmRlbGltO1xuICByZXR1cm4gZmllbGRzLm1hcCh2bGZpZWxkLnNob3J0aGFuZCkuam9pbihkZWxpbSk7XG59O1xuXG52bGZpZWxkLmZyb21TaG9ydGhhbmQgPSBmdW5jdGlvbihzaG9ydGhhbmQpIHtcbiAgdmFyIHNwbGl0ID0gc2hvcnRoYW5kLnNwbGl0KGMudHlwZSksIGk7XG4gIHZhciBvID0ge1xuICAgIG5hbWU6IHNwbGl0WzBdLnRyaW0oKSxcbiAgICB0eXBlOiBzcGxpdFsxXS50cmltKClcbiAgfTtcblxuICAvLyBjaGVjayBhZ2dyZWdhdGUgdHlwZVxuICBmb3IgKGkgaW4gc2NoZW1hLmFnZ3JlZ2F0ZS5lbnVtKSB7XG4gICAgdmFyIGEgPSBzY2hlbWEuYWdncmVnYXRlLmVudW1baV07XG4gICAgaWYgKG8ubmFtZS5pbmRleE9mKGEgKyAnXycpID09PSAwKSB7XG4gICAgICBvLm5hbWUgPSBvLm5hbWUuc3Vic3RyKGEubGVuZ3RoICsgMSk7XG4gICAgICBpZiAoYSA9PSAnY291bnQnICYmIG8ubmFtZS5sZW5ndGggPT09IDApIG8ubmFtZSA9ICcqJztcbiAgICAgIG8uYWdncmVnYXRlID0gYTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNoZWNrIHRpbWUgdGltZVVuaXRcbiAgZm9yIChpIGluIHNjaGVtYS50aW1lZm5zKSB7XG4gICAgdmFyIHR1ID0gc2NoZW1hLnRpbWVmbnNbaV07XG4gICAgaWYgKG8ubmFtZSAmJiBvLm5hbWUuaW5kZXhPZih0dSArICdfJykgPT09IDApIHtcbiAgICAgIG8ubmFtZSA9IG8ubmFtZS5zdWJzdHIoby5sZW5ndGggKyAxKTtcbiAgICAgIG8udGltZVVuaXQgPSB0dTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNoZWNrIGJpblxuICBpZiAoby5uYW1lICYmIG8ubmFtZS5pbmRleE9mKCdiaW5fJykgPT09IDApIHtcbiAgICBvLm5hbWUgPSBvLm5hbWUuc3Vic3RyKDQpO1xuICAgIG8uYmluID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBvO1xufTtcblxudmFyIGlzVHlwZSA9IHZsZmllbGQuaXNUeXBlID0gZnVuY3Rpb24gKGZpZWxkRGVmLCB0eXBlKSB7XG4gIHJldHVybiBmaWVsZERlZi50eXBlID09PSB0eXBlO1xufTtcblxudmFyIGlzVHlwZXMgPSB2bGZpZWxkLmlzVHlwZXMgPSBmdW5jdGlvbiAoZmllbGREZWYsIHR5cGVzKSB7XG4gIGZvciAodmFyIHQ9MDsgdDx0eXBlcy5sZW5ndGg7IHQrKykge1xuICAgIGlmKGZpZWxkRGVmLnR5cGUgPT09IHR5cGVzW3RdKSByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKlxuICogTW9zdCBmaWVsZHMgdGhhdCB1c2Ugb3JkaW5hbCBzY2FsZSBhcmUgZGltZW5zaW9ucy5cbiAqIEhvd2V2ZXIsIFlFQVIoVCksIFlFQVJNT05USChUKSB1c2UgdGltZSBzY2FsZSwgbm90IG9yZGluYWwgYnV0IGFyZSBkaW1lbnNpb25zIHRvby5cbiAqL1xudmxmaWVsZC5pc09yZGluYWxTY2FsZSA9IGZ1bmN0aW9uKGZpZWxkKSB7XG4gIHJldHVybiAgaXNUeXBlcyhmaWVsZCwgW04sIE9dKSB8fCBmaWVsZC5iaW4gfHxcbiAgICAoIGlzVHlwZShmaWVsZCwgVCkgJiYgZmllbGQudGltZVVuaXQgJiYgdGltZS5pc09yZGluYWxGbihmaWVsZC50aW1lVW5pdCkgKTtcbn07XG5cbmZ1bmN0aW9uIGlzRGltZW5zaW9uKGZpZWxkKSB7XG4gIHJldHVybiAgaXNUeXBlcyhmaWVsZCwgW04sIE9dKSB8fCAhIWZpZWxkLmJpbiB8fFxuICAgICggaXNUeXBlKGZpZWxkLCBUKSAmJiAhIWZpZWxkLnRpbWVVbml0ICk7XG59XG5cbi8qKlxuICogRm9yIGVuY29kaW5nLCB1c2UgZW5jb2RpbmcuaXNEaW1lbnNpb24oKSB0byBhdm9pZCBjb25mdXNpb24uXG4gKiBPciB1c2UgRW5jb2RpbmcuaXNUeXBlIGlmIHlvdXIgZmllbGQgaXMgZnJvbSBFbmNvZGluZyAoYW5kIHRodXMgaGF2ZSBudW1lcmljIGRhdGEgdHlwZSkuXG4gKiBvdGhlcndpc2UsIGRvIG5vdCBzcGVjaWZpYyBpc1R5cGUgc28gd2UgY2FuIHVzZSB0aGUgZGVmYXVsdCBpc1R5cGVOYW1lIGhlcmUuXG4gKi9cbnZsZmllbGQuaXNEaW1lbnNpb24gPSBmdW5jdGlvbihmaWVsZCkge1xuICByZXR1cm4gZmllbGQgJiYgaXNEaW1lbnNpb24oZmllbGQpO1xufTtcblxudmxmaWVsZC5pc01lYXN1cmUgPSBmdW5jdGlvbihmaWVsZCkge1xuICByZXR1cm4gZmllbGQgJiYgIWlzRGltZW5zaW9uKGZpZWxkKTtcbn07XG5cbnZsZmllbGQuY291bnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtuYW1lOicqJywgYWdncmVnYXRlOiAnY291bnQnLCB0eXBlOiBRLCBkaXNwbGF5TmFtZTogdmxmaWVsZC5jb3VudC5kaXNwbGF5TmFtZX07XG59O1xuXG52bGZpZWxkLmNvdW50LmRpc3BsYXlOYW1lID0gJ051bWJlciBvZiBSZWNvcmRzJztcblxudmxmaWVsZC5pc0NvdW50ID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIGZpZWxkLmFnZ3JlZ2F0ZSA9PT0gJ2NvdW50Jztcbn07XG5cbi8qKlxuICogRm9yIGVuY29kaW5nLCB1c2UgZW5jb2RpbmcuY2FyZGluYWxpdHkoKSB0byBhdm9pZCBjb25mdXNpb24uICBPciB1c2UgRW5jb2RpbmcuaXNUeXBlIGlmIHlvdXIgZmllbGQgaXMgZnJvbSBFbmNvZGluZyAoYW5kIHRodXMgaGF2ZSBudW1lcmljIGRhdGEgdHlwZSkuXG4gKiBvdGhlcndpc2UsIGRvIG5vdCBzcGVjaWZpYyBpc1R5cGUgc28gd2UgY2FuIHVzZSB0aGUgZGVmYXVsdCBpc1R5cGVOYW1lIGhlcmUuXG4gKi9cbnZsZmllbGQuY2FyZGluYWxpdHkgPSBmdW5jdGlvbihmaWVsZCwgc3RhdHMsIGZpbHRlck51bGwpIHtcbiAgLy8gRklYTUUgbmVlZCB0byB0YWtlIGZpbHRlciBpbnRvIGFjY291bnRcblxuICB2YXIgc3RhdCA9IHN0YXRzW2ZpZWxkLm5hbWVdO1xuICB2YXIgdHlwZSA9IGZpZWxkLnR5cGU7XG5cbiAgZmlsdGVyTnVsbCA9IGZpbHRlck51bGwgfHwge307XG5cbiAgaWYgKGZpZWxkLmJpbikge1xuICAgIHZhciBiaW5zID0gdXRpbC5nZXRiaW5zKHN0YXQsIGZpZWxkLmJpbi5tYXhiaW5zIHx8IHNjaGVtYS5NQVhCSU5TX0RFRkFVTFQpO1xuICAgIHJldHVybiAoYmlucy5zdG9wIC0gYmlucy5zdGFydCkgLyBiaW5zLnN0ZXA7XG4gIH1cbiAgaWYgKGlzVHlwZShmaWVsZCwgVCkpIHtcbiAgICB2YXIgY2FyZGluYWxpdHkgPSB0aW1lLmNhcmRpbmFsaXR5KGZpZWxkLCBzdGF0cywgZmlsdGVyTnVsbCwgdHlwZSk7XG4gICAgaWYoY2FyZGluYWxpdHkgIT09IG51bGwpIHJldHVybiBjYXJkaW5hbGl0eTtcbiAgICAvL290aGVyd2lzZSB1c2UgY2FsY3VsYXRpb24gYmVsb3dcbiAgfVxuICBpZiAoZmllbGQuYWdncmVnYXRlKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICAvLyByZW1vdmUgbnVsbFxuICByZXR1cm4gc3RhdC5kaXN0aW5jdCAtXG4gICAgKHN0YXQubnVsbHMgPiAwICYmIGZpbHRlck51bGxbdHlwZV0gPyAxIDogMCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBkZWNsYXJlIGdsb2JhbCBjb25zdGFudFxudmFyIGcgPSBnbG9iYWwgfHwgd2luZG93O1xuXG5nLkFHR1JFR0FURSA9ICdhZ2dyZWdhdGUnO1xuZy5SQVcgPSAncmF3JztcbmcuU1RBQ0tFRCA9ICdzdGFja2VkJztcbmcuSU5ERVggPSAnaW5kZXgnO1xuXG5nLlggPSAneCc7XG5nLlkgPSAneSc7XG5nLlJPVyA9ICdyb3cnO1xuZy5DT0wgPSAnY29sJztcbmcuU0laRSA9ICdzaXplJztcbmcuU0hBUEUgPSAnc2hhcGUnO1xuZy5DT0xPUiA9ICdjb2xvcic7XG5nLlRFWFQgPSAndGV4dCc7XG5nLkRFVEFJTCA9ICdkZXRhaWwnO1xuXG5nLk4gPSAnTic7XG5nLk8gPSAnTyc7XG5nLlEgPSAnUSc7XG5nLlQgPSAnVCc7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIFRPRE8oa2FuaXR3KTogY2hhdCB3aXRoIFZlZ2EgdGVhbSBhbmQgcG9zc2libHkgbW92ZSB0aGlzIHRvIHZlZ2EtbG9nZ2luZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgLy8gQm9ycm93ZWQgc29tZSBpZGVhcyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE1NjUzMjYwLzg2Njk4OVxuICAvLyBhbmQgaHR0cHM6Ly9naXRodWIuY29tL3BhdGlrL2NvbnNvbGUubG9nLXdyYXBwZXIvYmxvYi9tYXN0ZXIvY29uc29sZWxvZy5qc1xuICB2YXIgTUVUSE9EUyA9IFsnZXJyb3InLCAnaW5mbycsICdkZWJ1ZycsICd3YXJuJywgJ2xvZyddO1xuXG4gIHJldHVybiBNRVRIT0RTLnJlZHVjZShmdW5jdGlvbihsb2dnZXIsIGZuKSB7XG4gICAgdmFyIGNmbiA9IGNvbnNvbGVbZm5dID8gZm4gOiAnbG9nJztcbiAgICBpZiAoY29uc29sZVtjZm5dLmJpbmQgPT09ICd1bmRlZmluZWQnKSB7IC8vIElFIDwgMTBcbiAgICAgICAgbG9nZ2VyW2ZuXSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmNhbGwoY29uc29sZVtjZm5dLCBjb25zb2xlLCBwcmVmaXgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbG9nZ2VyW2ZuXSA9IGNvbnNvbGVbY2ZuXS5iaW5kKGNvbnNvbGUsIHByZWZpeCk7XG4gICAgfVxuICAgIHJldHVybiBsb2dnZXI7XG4gIH0sIHt9KTtcbn07IiwiLy8gUGFja2FnZSBvZiBkZWZpbmluZyBWZWdhLWxpdGUgU3BlY2lmaWNhdGlvbidzIGpzb24gc2NoZW1hXG4ndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHNjaGVtYSA9IG1vZHVsZS5leHBvcnRzID0ge30sXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHRvTWFwID0gdXRpbC50b01hcCxcbiAgY29sb3JicmV3ZXIgPSByZXF1aXJlKCdjb2xvcmJyZXdlcicpO1xuXG5zY2hlbWEudXRpbCA9IHJlcXVpcmUoJy4vc2NoZW1hdXRpbCcpO1xuXG5zY2hlbWEubWFya3R5cGUgPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICBlbnVtOiBbJ3BvaW50JywgJ3RpY2snLCAnYmFyJywgJ2xpbmUnLCAnYXJlYScsICdjaXJjbGUnLCAnc3F1YXJlJywgJ3RleHQnXVxufTtcblxuc2NoZW1hLmFnZ3JlZ2F0ZSA9IHtcbiAgdHlwZTogJ3N0cmluZycsXG4gIGVudW06IFsnYXZnJywgJ3N1bScsICdtZWRpYW4nLCAnbWluJywgJ21heCcsICdjb3VudCddLFxuICBzdXBwb3J0ZWRFbnVtczoge1xuICAgIFE6IFsnYXZnJywgJ21lZGlhbicsICdzdW0nLCAnbWluJywgJ21heCcsICdjb3VudCddLFxuICAgIE86IFsnbWVkaWFuJywnbWluJywnbWF4J10sXG4gICAgTjogW10sXG4gICAgVDogWydhdmcnLCAnbWVkaWFuJywgJ21pbicsICdtYXgnXSxcbiAgICAnJzogWydjb3VudCddXG4gIH0sXG4gIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUSwgTiwgTywgVCwgJyddKVxufTtcblxuc2NoZW1hLmdldFN1cHBvcnRlZFJvbGUgPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gIHJldHVybiBzY2hlbWEuc2NoZW1hLnByb3BlcnRpZXMuZW5jb2RpbmcucHJvcGVydGllc1tlbmNUeXBlXS5zdXBwb3J0ZWRSb2xlO1xufTtcblxuc2NoZW1hLnRpbWVVbml0cyA9IFsneWVhcicsICdtb250aCcsICdkYXknLCAnZGF0ZScsICdob3VycycsICdtaW51dGVzJywgJ3NlY29uZHMnXTtcblxuc2NoZW1hLmRlZmF1bHRUaW1lRm4gPSAnbW9udGgnO1xuXG5zY2hlbWEudGltZVVuaXQgPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICBlbnVtOiBzY2hlbWEudGltZVVuaXRzLFxuICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1RdKVxufTtcblxuc2NoZW1hLnNjYWxlX3R5cGUgPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICAvLyBUT0RPKGthbml0dykgcmVhZCB2ZWdhJ3Mgc2NoZW1hIGhlcmUsIGFkZCBkZXNjcmlwdGlvblxuICBlbnVtOiBbJ2xpbmVhcicsICdsb2cnLCAncG93JywgJ3NxcnQnLCAncXVhbnRpbGUnXSxcbiAgZGVmYXVsdDogJ2xpbmVhcicsXG4gIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUV0pXG59O1xuXG5zY2hlbWEuZmllbGQgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbmFtZToge1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICB9XG4gIH1cbn07XG5cbnZhciBjbG9uZSA9IHV0aWwuZHVwbGljYXRlO1xudmFyIG1lcmdlID0gc2NoZW1hLnV0aWwubWVyZ2U7XG5cbnNjaGVtYS5NQVhCSU5TX0RFRkFVTFQgPSAxNTtcblxudmFyIGJpbiA9IHtcbiAgdHlwZTogWydib29sZWFuJywgJ29iamVjdCddLFxuICBkZWZhdWx0OiBmYWxzZSxcbiAgcHJvcGVydGllczoge1xuICAgIG1heGJpbnM6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHNjaGVtYS5NQVhCSU5TX0RFRkFVTFQsXG4gICAgICBtaW5pbXVtOiAyLFxuICAgICAgZGVzY3JpcHRpb246ICdNYXhpbXVtIG51bWJlciBvZiBiaW5zLidcbiAgICB9XG4gIH0sXG4gIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUV0pIC8vIFRPRE86IGFkZCBPIGFmdGVyIGZpbmlzaGluZyAjODFcbn07XG5cbnZhciB0eXBpY2FsRmllbGQgPSBtZXJnZShjbG9uZShzY2hlbWEuZmllbGQpLCB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdHlwZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbTiwgTywgUSwgVF1cbiAgICB9LFxuICAgIGFnZ3JlZ2F0ZTogc2NoZW1hLmFnZ3JlZ2F0ZSxcbiAgICB0aW1lVW5pdDogc2NoZW1hLnRpbWVVbml0LFxuICAgIGJpbjogYmluLFxuICAgIHNjYWxlOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdHlwZTogc2NoZW1hLnNjYWxlX3R5cGUsXG4gICAgICAgIHJldmVyc2U6IHtcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRLCBUXSlcbiAgICAgICAgfSxcbiAgICAgICAgemVybzoge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0luY2x1ZGUgemVybycsXG4gICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1EsIFRdKVxuICAgICAgICB9LFxuICAgICAgICBuaWNlOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bTogWydzZWNvbmQnLCAnbWludXRlJywgJ2hvdXInLCAnZGF5JywgJ3dlZWsnLCAnbW9udGgnLCAneWVhciddLFxuICAgICAgICAgIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbVF0pXG4gICAgICAgIH0sXG4gICAgICAgIHVzZVJhd0RvbWFpbjoge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdVc2UgdGhlIHJhdyBkYXRhIHJhbmdlIGFzIHNjYWxlIGRvbWFpbiBpbnN0ZWFkIG9mICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAnYWdncmVnYXRlZCBkYXRhIGZvciBhZ2dyZWdhdGUgYXhpcy4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICdUaGlzIG9wdGlvbiBkb2VzIG5vdCB3b3JrIHdpdGggc3VtIG9yIGNvdW50IGFnZ3JlZ2F0ZScgK1xuICAgICAgICAgICAgICAgICAgICAgICAnYXMgdGhleSBtaWdodCBoYXZlIGEgc3Vic3RhbnRpYWxseSBsYXJnZXIgc2NhbGUgcmFuZ2UuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICdCeSBkZWZhdWx0LCB1c2UgdmFsdWUgZnJvbSBjb25maWcudXNlUmF3RG9tYWluLidcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbnZhciBvbmx5T3JkaW5hbEZpZWxkID0gbWVyZ2UoY2xvbmUoc2NoZW1hLmZpZWxkKSwge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkUm9sZToge1xuICAgIGRpbWVuc2lvbjogdHJ1ZVxuICB9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdHlwZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbTiwgTywgUSwgVF0gLy8gb3JkaW5hbC1vbmx5IGZpZWxkIHN1cHBvcnRzIFEgd2hlbiBiaW4gaXMgYXBwbGllZCBhbmQgVCB3aGVuIHRpbWUgdW5pdCBpcyBhcHBsaWVkLlxuICAgIH0sXG4gICAgdGltZVVuaXQ6IHNjaGVtYS50aW1lVW5pdCxcbiAgICBiaW46IGJpbixcbiAgICBhZ2dyZWdhdGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydjb3VudCddLFxuICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtOLCBPXSkgLy8gRklYTUUgdGhpcyBsb29rcyB3ZWlyZCB0byBtZVxuICAgIH1cbiAgfVxufSk7XG5cbnZhciBheGlzTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICBheGlzOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ3JpZDoge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSBmbGFnIGluZGljYXRlIGlmIGdyaWRsaW5lcyBzaG91bGQgYmUgY3JlYXRlZCBpbiBhZGRpdGlvbiB0byB0aWNrcy4nXG4gICAgICAgIH0sXG4gICAgICAgIGxheWVyOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogJ2JhY2snLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSBzdHJpbmcgaW5kaWNhdGluZyBpZiB0aGUgYXhpcyAoYW5kIGFueSBncmlkbGluZXMpIHNob3VsZCBiZSBwbGFjZWQgYWJvdmUgb3IgYmVsb3cgdGhlIGRhdGEgbWFya3MuJ1xuICAgICAgICB9LFxuICAgICAgICBvcmllbnQ6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgZW51bTogWyd0b3AnLCAncmlnaHQnLCAnbGVmdCcsICdib3R0b20nXSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBvcmllbnRhdGlvbiBvZiB0aGUgYXhpcy4gT25lIG9mIHRvcCwgYm90dG9tLCBsZWZ0IG9yIHJpZ2h0LiBUaGUgb3JpZW50YXRpb24gY2FuIGJlIHVzZWQgdG8gZnVydGhlciBzcGVjaWFsaXplIHRoZSBheGlzIHR5cGUgKGUuZy4sIGEgeSBheGlzIG9yaWVudGVkIGZvciB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgY2hhcnQpLidcbiAgICAgICAgfSxcbiAgICAgICAgdGlja3M6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogNSxcbiAgICAgICAgICBtaW5pbXVtOiAwLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSBkZXNpcmVkIG51bWJlciBvZiB0aWNrcywgZm9yIGF4ZXMgdmlzdWFsaXppbmcgcXVhbnRpdGF0aXZlIHNjYWxlcy4gVGhlIHJlc3VsdGluZyBudW1iZXIgbWF5IGJlIGRpZmZlcmVudCBzbyB0aGF0IHZhbHVlcyBhcmUgXCJuaWNlXCIgKG11bHRpcGxlcyBvZiAyLCA1LCAxMCkgYW5kIGxpZSB3aXRoaW4gdGhlIHVuZGVybHlpbmcgc2NhbGVcXCdzIHJhbmdlLidcbiAgICAgICAgfSxcbiAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBIHRpdGxlIGZvciB0aGUgYXhpcy4gKFNob3dzIGZpZWxkIG5hbWUgYW5kIGl0cyBmdW5jdGlvbiBieSBkZWZhdWx0LiknXG4gICAgICAgIH0sXG4gICAgICAgIHRpdGxlTWF4TGVuZ3RoOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICBtaW5pbXVtOiAwLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTWF4IGxlbmd0aCBmb3IgYXhpcyB0aXRsZSBpZiB0aGUgdGl0bGUgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGUgZmllbGRcXCdzIGRlc2NyaXB0aW9uJ1xuICAgICAgICB9LFxuICAgICAgICB0aXRsZU9mZnNldDoge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBIHRpdGxlIG9mZnNldCB2YWx1ZSBmb3IgdGhlIGF4aXMuJ1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgZm9ybWF0dGluZyBwYXR0ZXJuIGZvciBheGlzIGxhYmVscy4gJytcbiAgICAgICAgICAgICAgICAgICAgICAgJ0lmIG5vdCB1bmRlZmluZWQsIHRoaXMgd2lsbCBiZSBkZXRlcm1pbmVkIGJ5ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAnc21hbGwvbGFyZ2VOdW1iZXJGb3JtYXQgYW5kIHRoZSBtYXggdmFsdWUgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICdvZiB0aGUgZmllbGQuJ1xuICAgICAgICB9LFxuICAgICAgICBtYXhMYWJlbExlbmd0aDoge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiAyNSxcbiAgICAgICAgICBtaW5pbXVtOiAwLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVHJ1bmNhdGUgbGFiZWxzIHRoYXQgYXJlIHRvbyBsb25nLidcbiAgICAgICAgfSxcbiAgICAgICAgbGFiZWxBbmdsZToge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsIC8vIGF1dG9cbiAgICAgICAgICBtaW5pbXVtOiAwLFxuICAgICAgICAgIG1heGltdW06IDM2MCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZSBsYWJlbHMuIFNldCB0byAwIHRvIGZvcmNlIGhvcml6b250YWwuJ1xuICAgICAgICB9LFxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIHNvcnRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBzb3J0OiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogW10sXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtOLCBPXSksXG4gICAgICAgIHJlcXVpcmVkOiBbJ25hbWUnLCAnYWdncmVnYXRlJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWdncmVnYXRlOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGVudW06IFsnYXZnJywgJ3N1bScsICdtaW4nLCAnbWF4JywgJ2NvdW50J11cbiAgICAgICAgICB9LFxuICAgICAgICAgIHJldmVyc2U6IHtcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgYmFuZE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIGJhbmQ6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBzaXplOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIG1pbmltdW06IDAsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgICAgIH0sXG4gICAgICAgIHBhZGRpbmc6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICBkZWZhdWx0OiAxXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBsZWdlbmRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBsZWdlbmQ6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgZGVzY3JpcHRpb246ICdQcm9wZXJ0aWVzIG9mIGEgbGVnZW5kLicsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSB0aXRsZSBmb3IgdGhlIGxlZ2VuZC4gKFNob3dzIGZpZWxkIG5hbWUgYW5kIGl0cyBmdW5jdGlvbiBieSBkZWZhdWx0LiknXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciB0ZXh0TWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHsndGV4dCc6IHRydWV9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgYWxpZ246IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ3JpZ2h0J1xuICAgIH0sXG4gICAgYmFzZWxpbmU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ21pZGRsZSdcbiAgICB9LFxuICAgIGNvbG9yOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiAnIzAwMDAwMCdcbiAgICB9LFxuICAgIG1hcmdpbjoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogNCxcbiAgICAgIG1pbmltdW06IDBcbiAgICB9LFxuICAgIHBsYWNlaG9sZGVyOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdBYmMnXG4gICAgfSxcbiAgICBmb250OiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgd2VpZ2h0OiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bTogWydub3JtYWwnLCAnYm9sZCddLFxuICAgICAgICAgIGRlZmF1bHQ6ICdub3JtYWwnXG4gICAgICAgIH0sXG4gICAgICAgIHNpemU6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogMTAsXG4gICAgICAgICAgbWluaW11bTogMFxuICAgICAgICB9LFxuICAgICAgICBmYW1pbHk6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiAnSGVsdmV0aWNhIE5ldWUnXG4gICAgICAgIH0sXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogJ25vcm1hbCcsXG4gICAgICAgICAgZW51bTogWydub3JtYWwnLCAnaXRhbGljJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZm9ybWF0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZvcm1hdHRpbmcgcGF0dGVybiBmb3IgdGV4dCB2YWx1ZS4gJytcbiAgICAgICAgICAgICAgICAgICAnSWYgbm90IHVuZGVmaW5lZCwgdGhpcyB3aWxsIGJlIGRldGVybWluZWQgYnkgJyArXG4gICAgICAgICAgICAgICAgICAgJ3NtYWxsL2xhcmdlTnVtYmVyRm9ybWF0IGFuZCB0aGUgbWF4IHZhbHVlICcgK1xuICAgICAgICAgICAgICAgICAgICdvZiB0aGUgZmllbGQuJ1xuICAgIH0sXG4gIH1cbn07XG5cbnZhciBzaXplTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgYmFyOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSwgdGV4dDogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMzAsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVzY3JpcHRpb246ICdTaXplIG9mIG1hcmtzLidcbiAgICB9XG4gIH1cbn07XG5cbnZhciBjb2xvck1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIHRpY2s6IHRydWUsIGJhcjogdHJ1ZSwgbGluZTogdHJ1ZSwgYXJlYTogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWUsICd0ZXh0JzogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJyM0NjgyYjQnLFxuICAgICAgZGVzY3JpcHRpb246ICdDb2xvciB0byBiZSB1c2VkIGZvciBtYXJrcy4nXG4gICAgfSxcbiAgICBvcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxXG4gICAgfSxcbiAgICBzY2FsZToge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgdHlwZTogWydzdHJpbmcnLCAnYXJyYXknXSxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAnQ29sb3IgcGFsZXR0ZSwgaWYgdW5kZWZpbmVkIHZlZ2EtbGl0ZSB3aWxsIHVzZSBkYXRhIHByb3BlcnR5JyArXG4gICAgICAgICAgICAndG8gcGljayBvbmUgZnJvbSBjMTBwYWxldHRlLCBjMjBwYWxldHRlLCBvciBvcmRpbmFsUGFsZXR0ZS4nXG4gICAgICAgICAgICAvL0ZJWE1FXG4gICAgICAgIH0sXG4gICAgICAgIGMxMHBhbGV0dGU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiAnY2F0ZWdvcnkxMCcsXG4gICAgICAgICAgZW51bTogW1xuICAgICAgICAgICAgLy8gVGFibGVhdVxuICAgICAgICAgICAgJ2NhdGVnb3J5MTAnLCAnY2F0ZWdvcnkxMGsnLFxuICAgICAgICAgICAgLy8gQ29sb3IgQnJld2VyXG4gICAgICAgICAgICAnUGFzdGVsMScsICdQYXN0ZWwyJywgJ1NldDEnLCAnU2V0MicsICdTZXQzJ1xuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgYzIwcGFsZXR0ZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdjYXRlZ29yeTIwJyxcbiAgICAgICAgICBlbnVtOiBbJ2NhdGVnb3J5MjAnLCAnY2F0ZWdvcnkyMGInLCAnY2F0ZWdvcnkyMGMnXVxuICAgICAgICB9LFxuICAgICAgICBvcmRpbmFsUGFsZXR0ZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbG9yIHBhbGV0dGUgdG8gZW5jb2RlIG9yZGluYWwgdmFyaWFibGVzLicsXG4gICAgICAgICAgZW51bTogdXRpbC5rZXlzKGNvbG9yYnJld2VyKVxuICAgICAgICB9LFxuICAgICAgICBxdWFudGl0YXRpdmVSYW5nZToge1xuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgZGVmYXVsdDogWycjQUZDNkEzJywgJyMwOTYyMkEnXSwgLy8gdGFibGVhdSBncmVlbnNcbiAgICAgICAgICAvLyBkZWZhdWx0OiBbJyNjY2VjZTYnLCAnIzAwNDQxYiddLCAvLyBCdUduLjkgWzItOF1cbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbG9yIHJhbmdlIHRvIGVuY29kZSBxdWFudGl0YXRpdmUgdmFyaWFibGVzLicsXG4gICAgICAgICAgbWluSXRlbXM6IDIsXG4gICAgICAgICAgbWF4SXRlbXM6IDIsXG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgcm9sZTogJ2NvbG9yJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIHNoYXBlTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWV9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydjaXJjbGUnLCAnc3F1YXJlJywgJ2Nyb3NzJywgJ2RpYW1vbmQnLCAndHJpYW5nbGUtdXAnLCAndHJpYW5nbGUtZG93biddLFxuICAgICAgZGVmYXVsdDogJ2NpcmNsZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ01hcmsgdG8gYmUgdXNlZC4nXG4gICAgfSxcbiAgICBmaWxsZWQ6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIHRoZSBzaGFwZVxcJ3MgY29sb3Igc2hvdWxkIGJlIHVzZWQgYXMgZmlsbCBjb2xvciBpbnN0ZWFkIG9mIHN0cm9rZSBjb2xvci4nXG4gICAgfVxuICB9XG59O1xuXG52YXIgZGV0YWlsTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgbGluZTogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWV9XG59O1xuXG52YXIgcm93TWl4aW4gPSB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICBoZWlnaHQ6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlZmF1bHQ6IDE1MFxuICAgIH1cbiAgfVxufTtcblxudmFyIGNvbE1peGluID0ge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgd2lkdGg6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlZmF1bHQ6IDE1MFxuICAgIH0sXG4gICAgYXhpczoge1xuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBtYXhMYWJlbExlbmd0aDoge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiAxMixcbiAgICAgICAgICBtaW5pbXVtOiAwLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVHJ1bmNhdGUgbGFiZWxzIHRoYXQgYXJlIHRvbyBsb25nLidcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIGZhY2V0TWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSwgdGV4dDogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICBwYWRkaW5nOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxLFxuICAgICAgZGVmYXVsdDogMC4xXG4gICAgfVxuICB9XG59O1xuXG52YXIgcmVxdWlyZWROYW1lVHlwZSA9IHtcbiAgcmVxdWlyZWQ6IFsnbmFtZScsICd0eXBlJ11cbn07XG5cbnZhciBtdWx0aVJvbGVGaWVsZCA9IG1lcmdlKGNsb25lKHR5cGljYWxGaWVsZCksIHtcbiAgc3VwcG9ydGVkUm9sZToge1xuICAgIG1lYXN1cmU6IHRydWUsXG4gICAgZGltZW5zaW9uOiB0cnVlXG4gIH1cbn0pO1xuXG52YXIgcXVhbnRpdGF0aXZlRmllbGQgPSBtZXJnZShjbG9uZSh0eXBpY2FsRmllbGQpLCB7XG4gIHN1cHBvcnRlZFJvbGU6IHtcbiAgICBtZWFzdXJlOiB0cnVlLFxuICAgIGRpbWVuc2lvbjogJ29yZGluYWwtb25seScgLy8gdXNpbmcgc2l6ZSB0byBlbmNvZGluZyBjYXRlZ29yeSBsZWFkIHRvIG9yZGVyIGludGVycHJldGF0aW9uXG4gIH1cbn0pO1xuXG52YXIgb25seVF1YW50aXRhdGl2ZUZpZWxkID0gbWVyZ2UoY2xvbmUodHlwaWNhbEZpZWxkKSwge1xuICBzdXBwb3J0ZWRSb2xlOiB7XG4gICAgbWVhc3VyZTogdHJ1ZVxuICB9XG59KTtcblxudmFyIHggPSBtZXJnZShjbG9uZShtdWx0aVJvbGVGaWVsZCksIGF4aXNNaXhpbiwgYmFuZE1peGluLCByZXF1aXJlZE5hbWVUeXBlLCBzb3J0TWl4aW4pO1xudmFyIHkgPSBjbG9uZSh4KTtcblxudmFyIGZhY2V0ID0gbWVyZ2UoY2xvbmUob25seU9yZGluYWxGaWVsZCksIHJlcXVpcmVkTmFtZVR5cGUsIGZhY2V0TWl4aW4sIHNvcnRNaXhpbik7XG52YXIgcm93ID0gbWVyZ2UoY2xvbmUoZmFjZXQpLCBheGlzTWl4aW4sIHJvd01peGluKTtcbnZhciBjb2wgPSBtZXJnZShjbG9uZShmYWNldCksIGF4aXNNaXhpbiwgY29sTWl4aW4pO1xuXG52YXIgc2l6ZSA9IG1lcmdlKGNsb25lKHF1YW50aXRhdGl2ZUZpZWxkKSwgbGVnZW5kTWl4aW4sIHNpemVNaXhpbiwgc29ydE1peGluKTtcbnZhciBjb2xvciA9IG1lcmdlKGNsb25lKG11bHRpUm9sZUZpZWxkKSwgbGVnZW5kTWl4aW4sIGNvbG9yTWl4aW4sIHNvcnRNaXhpbik7XG5cbnZhciBzaGFwZSA9IG1lcmdlKGNsb25lKG9ubHlPcmRpbmFsRmllbGQpLCBsZWdlbmRNaXhpbiwgc2hhcGVNaXhpbiwgc29ydE1peGluKTtcbnZhciBkZXRhaWwgPSBtZXJnZShjbG9uZShvbmx5T3JkaW5hbEZpZWxkKSwgZGV0YWlsTWl4aW4sIHNvcnRNaXhpbik7XG5cbi8vIHdlIG9ubHkgcHV0IGFnZ3JlZ2F0ZWQgbWVhc3VyZSBpbiBwaXZvdCB0YWJsZVxudmFyIHRleHQgPSBtZXJnZShjbG9uZShvbmx5UXVhbnRpdGF0aXZlRmllbGQpLCB0ZXh0TWl4aW4sIHNvcnRNaXhpbik7XG5cbi8vIFRPRE8gYWRkIGxhYmVsXG5cbnZhciBmaWx0ZXIgPSB7XG4gIHR5cGU6ICdhcnJheScsXG4gIGl0ZW1zOiB7XG4gICAgdHlwZTogJ29iamVjdCcsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgb3BlcmFuZHM6IHtcbiAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICB0eXBlOiBbJ3N0cmluZycsICdib29sZWFuJywgJ2ludGVnZXInLCAnbnVtYmVyJ11cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9wZXJhdG9yOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBlbnVtOiBbJz4nLCAnPj0nLCAnPScsICchPScsICc8JywgJzw9JywgJ25vdE51bGwnXVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIGRhdGEgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgLy8gZGF0YSBzb3VyY2VcbiAgICBmb3JtYXRUeXBlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnanNvbicsICdjc3YnXSxcbiAgICAgIGRlZmF1bHQ6ICdqc29uJ1xuICAgIH0sXG4gICAgdXJsOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgdmFsdWVzOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdQYXNzIGFycmF5IG9mIG9iamVjdHMgaW5zdGVhZCBvZiBhIHVybCB0byBhIGZpbGUuJyxcbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIGNvbmZpZyA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICAvLyB0ZW1wbGF0ZVxuICAgIHdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIGhlaWdodDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICB2aWV3cG9ydDoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgfSxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgZ3JpZENvbG9yOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiAnIzAwMDAwMCdcbiAgICB9LFxuICAgIGdyaWRPcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxLFxuICAgICAgZGVmYXVsdDogMC4wOFxuICAgIH0sXG5cbiAgICAvLyBmaWx0ZXIgbnVsbFxuICAgIGZpbHRlck51bGw6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBPOiB7dHlwZTonYm9vbGVhbicsIGRlZmF1bHQ6IGZhbHNlfSxcbiAgICAgICAgUToge3R5cGU6J2Jvb2xlYW4nLCBkZWZhdWx0OiB0cnVlfSxcbiAgICAgICAgVDoge3R5cGU6J2Jvb2xlYW4nLCBkZWZhdWx0OiB0cnVlfVxuICAgICAgfVxuICAgIH0sXG4gICAgdG9nZ2xlU29ydDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiBPXG4gICAgfSxcbiAgICBhdXRvU29ydExpbmU6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuXG4gICAgLy8gc2luZ2xlIHBsb3RcbiAgICBzaW5nbGVIZWlnaHQ6IHtcbiAgICAgIC8vIHdpbGwgYmUgb3ZlcndyaXR0ZW4gYnkgYmFuZFdpZHRoICogKGNhcmRpbmFsaXR5ICsgcGFkZGluZylcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDIwMCxcbiAgICAgIG1pbmltdW06IDBcbiAgICB9LFxuICAgIHNpbmdsZVdpZHRoOiB7XG4gICAgICAvLyB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IGJhbmRXaWR0aCAqIChjYXJkaW5hbGl0eSArIHBhZGRpbmcpXG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyMDAsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICAvLyBiYW5kIHNpemVcbiAgICBsYXJnZUJhbmRTaXplOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyMSxcbiAgICAgIG1pbmltdW06IDBcbiAgICB9LFxuICAgIHNtYWxsQmFuZFNpemU6IHtcbiAgICAgIC8vc21hbGwgbXVsdGlwbGVzIG9yIHNpbmdsZSBwbG90IHdpdGggaGlnaCBjYXJkaW5hbGl0eVxuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMTIsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBsYXJnZUJhbmRNYXhDYXJkaW5hbGl0eToge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMTBcbiAgICB9LFxuICAgIC8vIHNtYWxsIG11bHRpcGxlc1xuICAgIGNlbGxQYWRkaW5nOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDAuMVxuICAgIH0sXG4gICAgY2VsbEdyaWRDb2xvcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJyMwMDAwMDAnXG4gICAgfSxcbiAgICBjZWxsR3JpZE9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIG1heGltdW06IDEsXG4gICAgICBkZWZhdWx0OiAwLjE1XG4gICAgfSxcbiAgICBjZWxsQmFja2dyb3VuZENvbG9yOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiAncmdiYSgwLDAsMCwwKSdcbiAgICB9LFxuICAgIHRleHRDZWxsV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDkwLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG5cbiAgICAvLyBtYXJrc1xuICAgIHN0cm9rZVdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgc2luZ2xlQmFyT2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiA1LFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgLy8gc2NhbGVzXG4gICAgdGltZVNjYWxlTGFiZWxMZW5ndGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDMsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVzY3JpcHRpb246ICdNYXggbGVuZ3RoIGZvciB2YWx1ZXMgaW4gZGF5U2NhbGVMYWJlbCBhbmQgbW9udGhTY2FsZUxhYmVsLiAgWmVybyBtZWFucyB1c2luZyBmdWxsIG5hbWVzIGluIGRheVNjYWxlTGFiZWwvbW9udGhTY2FsZUxhYmVsLidcbiAgICB9LFxuICAgIGRheVNjYWxlTGFiZWw6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGRlZmF1bHQ6IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXhpcyBsYWJlbHMgZm9yIGRheSBvZiB3ZWVrLCBzdGFydGluZyBmcm9tIFN1bmRheS4nICtcbiAgICAgICAgJyhDb25zaXN0ZW50IHdpdGggSmF2YXNjcmlwdCAtLSBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRGF0ZS9nZXREYXkuJ1xuICAgIH0sXG4gICAgbW9udGhTY2FsZUxhYmVsOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0OiBbJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXhpcyBsYWJlbHMgZm9yIG1vbnRoLidcbiAgICB9LFxuICAgIC8vIG90aGVyXG4gICAgY2hhcmFjdGVyV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDZcbiAgICB9LFxuICAgIG1heFNtYWxsTnVtYmVyOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDEwMDAwLFxuICAgICAgZGVzY3JpcHRpb246ICdtYXhpbXVtIG51bWJlciB0aGF0IGEgZmllbGQgd2lsbCBiZSBjb25zaWRlcmVkIHNtYWxsTnVtYmVyLicrXG4gICAgICAgICAgICAgICAgICAgJ1VzZWQgZm9yIGF4aXMgbGFiZWxsaW5nLidcbiAgICB9LFxuICAgIHNtYWxsTnVtYmVyRm9ybWF0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgZGVzY3JpcHRpb246ICdEMyBOdW1iZXIgZm9ybWF0IGZvciBheGlzIGxhYmVscyBhbmQgdGV4dCB0YWJsZXMgJytcbiAgICAgICAgICAgICAgICAgICAnZm9yIG51bWJlciA8PSBtYXhTbWFsbE51bWJlci4gVXNlZCBmb3IgYXhpcyBsYWJlbGxpbmcuJ1xuICAgIH0sXG4gICAgbGFyZ2VOdW1iZXJGb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJy4zcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0QzIE51bWJlciBmb3JtYXQgZm9yIGF4aXMgbGFiZWxzIGFuZCB0ZXh0IHRhYmxlcyAnICtcbiAgICAgICAgICAgICAgICAgICAnZm9yIG51bWJlciA+IG1heFNtYWxsTnVtYmVyLidcbiAgICB9LFxuICAgIHRpbWVGb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJyVZLSVtLSVkJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGF0ZSBmb3JtYXQgZm9yIGF4aXMgbGFiZWxzLidcbiAgICB9LFxuICAgIHVzZVJhd0RvbWFpbjoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ1VzZSB0aGUgcmF3IGRhdGEgcmFuZ2UgYXMgc2NhbGUgZG9tYWluIGluc3RlYWQgb2YgJyArXG4gICAgICAgICAgICAgICAgICAgJ2FnZ3JlZ2F0ZWQgZGF0YSBmb3IgYWdncmVnYXRlIGF4aXMuICcgK1xuICAgICAgICAgICAgICAgICAgICdUaGlzIG9wdGlvbiBkb2VzIG5vdCB3b3JrIHdpdGggc3VtIG9yIGNvdW50IGFnZ3JlZ2F0ZScgK1xuICAgICAgICAgICAgICAgICAgICdhcyB0aGV5IG1pZ2h0IGhhdmUgYSBzdWJzdGFudGlhbGx5IGxhcmdlciBzY2FsZSByYW5nZS4nICtcbiAgICAgICAgICAgICAgICAgICAnQnkgZGVmYXVsdCwgdXNlIHZhbHVlIGZyb20gY29uZmlnLnVzZVJhd0RvbWFpbi4nXG4gICAgfVxuICB9XG59O1xuXG4vKiogQHR5cGUgT2JqZWN0IFNjaGVtYSBvZiBhIHZlZ2EtbGl0ZSBzcGVjaWZpY2F0aW9uICovXG5zY2hlbWEuc2NoZW1hID0ge1xuICAkc2NoZW1hOiAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNC9zY2hlbWEjJyxcbiAgZGVzY3JpcHRpb246ICdTY2hlbWEgZm9yIFZlZ2EtbGl0ZSBzcGVjaWZpY2F0aW9uJyxcbiAgdHlwZTogJ29iamVjdCcsXG4gIHJlcXVpcmVkOiBbJ21hcmt0eXBlJywgJ2VuY29kaW5nJywgJ2RhdGEnXSxcbiAgcHJvcGVydGllczoge1xuICAgIGRhdGE6IGRhdGEsXG4gICAgbWFya3R5cGU6IHNjaGVtYS5tYXJrdHlwZSxcbiAgICBlbmNvZGluZzoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHksXG4gICAgICAgIHJvdzogcm93LFxuICAgICAgICBjb2w6IGNvbCxcbiAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBzaGFwZTogc2hhcGUsXG4gICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgIGRldGFpbDogZGV0YWlsXG4gICAgICB9XG4gICAgfSxcbiAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICBjb25maWc6IGNvbmZpZ1xuICB9XG59O1xuXG5zY2hlbWEuZW5jVHlwZXMgPSB1dGlsLmtleXMoc2NoZW1hLnNjaGVtYS5wcm9wZXJ0aWVzLmVuY29kaW5nLnByb3BlcnRpZXMpO1xuXG4vKiogSW5zdGFudGlhdGUgYSB2ZXJib3NlIHZsIHNwZWMgZnJvbSB0aGUgc2NoZW1hICovXG5zY2hlbWEuaW5zdGFudGlhdGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHNjaGVtYS51dGlsLmluc3RhbnRpYXRlKHNjaGVtYS5zY2hlbWEpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNjaGVtYXV0aWwgPSBtb2R1bGUuZXhwb3J0cyA9IHt9LFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59O1xuXG5zY2hlbWF1dGlsLmV4dGVuZCA9IGZ1bmN0aW9uKGluc3RhbmNlLCBzY2hlbWEpIHtcbiAgcmV0dXJuIHNjaGVtYXV0aWwubWVyZ2Uoc2NoZW1hdXRpbC5pbnN0YW50aWF0ZShzY2hlbWEpLCBpbnN0YW5jZSk7XG59O1xuXG4vLyBpbnN0YW50aWF0ZSBhIHNjaGVtYVxuc2NoZW1hdXRpbC5pbnN0YW50aWF0ZSA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgdmFsO1xuICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKCdkZWZhdWx0JyBpbiBzY2hlbWEpIHtcbiAgICB2YWwgPSBzY2hlbWEuZGVmYXVsdDtcbiAgICByZXR1cm4gdXRpbC5pc09iamVjdCh2YWwpID8gdXRpbC5kdXBsaWNhdGUodmFsKSA6IHZhbDtcbiAgfSBlbHNlIGlmIChzY2hlbWEudHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSB7fTtcbiAgICBmb3IgKHZhciBuYW1lIGluIHNjaGVtYS5wcm9wZXJ0aWVzKSB7XG4gICAgICB2YWwgPSBzY2hlbWF1dGlsLmluc3RhbnRpYXRlKHNjaGVtYS5wcm9wZXJ0aWVzW25hbWVdKTtcbiAgICAgIGlmICh2YWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpbnN0YW5jZVtuYW1lXSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2UgaWYgKHNjaGVtYS50eXBlID09PSAnYXJyYXknKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG4vLyByZW1vdmUgYWxsIGRlZmF1bHRzIGZyb20gYW4gaW5zdGFuY2VcbnNjaGVtYXV0aWwuc3VidHJhY3QgPSBmdW5jdGlvbihpbnN0YW5jZSwgZGVmYXVsdHMpIHtcbiAgdmFyIGNoYW5nZXMgPSB7fTtcbiAgZm9yICh2YXIgcHJvcCBpbiBpbnN0YW5jZSkge1xuICAgIHZhciBkZWYgPSBkZWZhdWx0c1twcm9wXTtcbiAgICB2YXIgaW5zID0gaW5zdGFuY2VbcHJvcF07XG4gICAgLy8gTm90ZTogZG9lcyBub3QgcHJvcGVybHkgc3VidHJhY3QgYXJyYXlzXG4gICAgaWYgKCFkZWZhdWx0cyB8fCBkZWYgIT09IGlucykge1xuICAgICAgaWYgKHR5cGVvZiBpbnMgPT09ICdvYmplY3QnICYmICF1dGlsLmlzQXJyYXkoaW5zKSAmJiBkZWYpIHtcbiAgICAgICAgdmFyIGMgPSBzY2hlbWF1dGlsLnN1YnRyYWN0KGlucywgZGVmKTtcbiAgICAgICAgaWYgKCFpc0VtcHR5KGMpKVxuICAgICAgICAgIGNoYW5nZXNbcHJvcF0gPSBjO1xuICAgICAgfSBlbHNlIGlmICghdXRpbC5pc0FycmF5KGlucykgfHwgaW5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2hhbmdlc1twcm9wXSA9IGlucztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNoYW5nZXM7XG59O1xuXG5zY2hlbWF1dGlsLm1lcmdlID0gZnVuY3Rpb24oLypkZXN0Kiwgc3JjMCwgc3JjMSwgLi4uKi8pe1xuICB2YXIgZGVzdCA9IGFyZ3VtZW50c1swXTtcbiAgZm9yICh2YXIgaT0xIDsgaTxhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBkZXN0ID0gbWVyZ2UoZGVzdCwgYXJndW1lbnRzW2ldKTtcbiAgfVxuICByZXR1cm4gZGVzdDtcbn07XG5cbi8vIHJlY3Vyc2l2ZWx5IG1lcmdlcyBzcmMgaW50byBkZXN0XG5mdW5jdGlvbiBtZXJnZShkZXN0LCBzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgIT09ICdvYmplY3QnIHx8IHNyYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBkZXN0O1xuICB9XG5cbiAgZm9yICh2YXIgcCBpbiBzcmMpIHtcbiAgICBpZiAoIXNyYy5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzcmNbcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc3JjW3BdICE9PSAnb2JqZWN0JyB8fCBzcmNbcF0gPT09IG51bGwpIHtcbiAgICAgIGRlc3RbcF0gPSBzcmNbcF07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVzdFtwXSAhPT0gJ29iamVjdCcgfHwgZGVzdFtwXSA9PT0gbnVsbCkge1xuICAgICAgZGVzdFtwXSA9IG1lcmdlKHNyY1twXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgPyBbXSA6IHt9LCBzcmNbcF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXJnZShkZXN0W3BdLCBzcmNbcF0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVzdDtcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdkYXRhbGliL3NyYy91dGlsJyk7XG5cbnV0aWwuZXh0ZW5kKHV0aWwsIHJlcXVpcmUoJ2RhdGFsaWIvc3JjL2dlbmVyYXRlJykpO1xudXRpbC5leHRlbmQodXRpbCwgcmVxdWlyZSgnZGF0YWxpYi9zcmMvc3RhdHMnKSk7XG51dGlsLmV4dGVuZCh1dGlsLCByZXF1aXJlKCcuL2xvZ2dlcicpKCdbVkwgRXJyb3JdJykpO1xudXRpbC5iaW4gPSByZXF1aXJlKCdkYXRhbGliL3NyYy9iaW5zL2JpbnMnKTtcblxudXRpbC5pc2luID0gZnVuY3Rpb24oaXRlbSwgYXJyYXkpIHtcbiAgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSkgIT09IC0xO1xufTtcblxudXRpbC5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBmLCB0aGlzQXJnKSB7XG4gIGlmIChvYmouZm9yRWFjaCkge1xuICAgIG9iai5mb3JFYWNoLmNhbGwodGhpc0FyZywgZik7XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgIGYuY2FsbCh0aGlzQXJnLCBvYmpba10sIGsgLCBvYmopO1xuICAgIH1cbiAgfVxufTtcblxudXRpbC5yZWR1Y2UgPSBmdW5jdGlvbihvYmosIGYsIGluaXQsIHRoaXNBcmcpIHtcbiAgaWYgKG9iai5yZWR1Y2UpIHtcbiAgICByZXR1cm4gb2JqLnJlZHVjZS5jYWxsKHRoaXNBcmcsIGYsIGluaXQpO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICBpbml0ID0gZi5jYWxsKHRoaXNBcmcsIGluaXQsIG9ialtrXSwgaywgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIGluaXQ7XG4gIH1cbn07XG5cbnV0aWwubWFwID0gZnVuY3Rpb24ob2JqLCBmLCB0aGlzQXJnKSB7XG4gIGlmIChvYmoubWFwKSB7XG4gICAgcmV0dXJuIG9iai5tYXAuY2FsbCh0aGlzQXJnLCBmKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgIG91dHB1dC5wdXNoKCBmLmNhbGwodGhpc0FyZywgb2JqW2tdLCBrLCBvYmopKTtcbiAgICB9XG4gIH1cbn07XG5cbnV0aWwuYW55ID0gZnVuY3Rpb24oYXJyLCBmKSB7XG4gIHZhciBpID0gMCwgaztcbiAgZm9yIChrIGluIGFycikge1xuICAgIGlmIChmKGFycltrXSwgaywgaSsrKSkgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxudXRpbC5hbGwgPSBmdW5jdGlvbihhcnIsIGYpIHtcbiAgdmFyIGkgPSAwLCBrO1xuICBmb3IgKGsgaW4gYXJyKSB7XG4gICAgaWYgKCFmKGFycltrXSwgaywgaSsrKSkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxudXRpbC5nZXRiaW5zID0gZnVuY3Rpb24oc3RhdHMsIG1heGJpbnMpIHtcbiAgcmV0dXJuIHV0aWwuYmluKHtcbiAgICBtaW46IHN0YXRzLm1pbixcbiAgICBtYXg6IHN0YXRzLm1heCxcbiAgICBtYXhiaW5zOiBtYXhiaW5zXG4gIH0pO1xufTtcblxuLyoqXG4gKiB4W3BbMF1dLi4uW3Bbbl1dID0gdmFsXG4gKiBAcGFyYW0gbm9hdWdtZW50IGRldGVybWluZSB3aGV0aGVyIG5ldyBvYmplY3Qgc2hvdWxkIGJlIGFkZGVkIGZcbiAqIG9yIG5vbi1leGlzdGluZyBwcm9wZXJ0aWVzIGFsb25nIHRoZSBwYXRoXG4gKi9cbnV0aWwuc2V0dGVyID0gZnVuY3Rpb24oeCwgcCwgdmFsLCBub2F1Z21lbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPHAubGVuZ3RoLTE7ICsraSkge1xuICAgIGlmICghbm9hdWdtZW50ICYmICEocFtpXSBpbiB4KSl7XG4gICAgICB4ID0geFtwW2ldXSA9IHt9O1xuICAgIH0gZWxzZSB7XG4gICAgICB4ID0geFtwW2ldXTtcbiAgICB9XG4gIH1cbiAgeFtwW2ldXSA9IHZhbDtcbn07XG5cblxuLyoqXG4gKiByZXR1cm5zIHhbcFswXV0uLi5bcFtuXV1cbiAqIEBwYXJhbSBhdWdtZW50IGRldGVybWluZSB3aGV0aGVyIG5ldyBvYmplY3Qgc2hvdWxkIGJlIGFkZGVkIGZcbiAqIG9yIG5vbi1leGlzdGluZyBwcm9wZXJ0aWVzIGFsb25nIHRoZSBwYXRoXG4gKi9cbnV0aWwuZ2V0dGVyID0gZnVuY3Rpb24oeCwgcCwgbm9hdWdtZW50KSB7XG4gIGZvciAodmFyIGk9MDsgaTxwLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCFub2F1Z21lbnQgJiYgIShwW2ldIGluIHgpKXtcbiAgICAgIHggPSB4W3BbaV1dID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSB4W3BbaV1dO1xuICAgIH1cbiAgfVxuICByZXR1cm4geDtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9nbG9iYWxzJyk7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gICAgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKTtcblxudmFyIHZsID0ge307XG5cbnV0aWwuZXh0ZW5kKHZsLCBjb25zdHMsIHV0aWwpO1xuXG52bC5FbmNvZGluZyA9IHJlcXVpcmUoJy4vRW5jb2RpbmcnKTtcbnZsLmNvbXBpbGVyID0gcmVxdWlyZSgnLi9jb21waWxlci9jb21waWxlcicpO1xudmwuY29tcGlsZSA9IHZsLmNvbXBpbGVyLmNvbXBpbGU7XG52bC5kYXRhID0gcmVxdWlyZSgnLi9kYXRhJyk7XG52bC5lbmMgPSByZXF1aXJlKCcuL2VuYycpO1xudmwuZmllbGQgPSByZXF1aXJlKCcuL2ZpZWxkJyk7XG52bC5zY2hlbWEgPSByZXF1aXJlKCcuL3NjaGVtYS9zY2hlbWEnKTtcbnZsLnRvU2hvcnRoYW5kID0gdmwuRW5jb2Rpbmcuc2hvcnRoYW5kO1xudmwuZm9ybWF0ID0gcmVxdWlyZSgnZDMtZm9ybWF0JykuZm9ybWF0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZsOyJdfQ==
