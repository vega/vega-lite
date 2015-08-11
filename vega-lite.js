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
  Map = function() {};
  Map.prototype = {
    set: function(k, v) { this["$" + k] = v; return this; },
    get: function(k) { return this["$" + k]; },
    has: function(k) { return "$" + k in this; }
  };
}

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.color = {}));
}(this, function (exports) { 'use strict';

  function Color() {}

  Color.prototype = {
    toString: function() {
      return this.rgb() + "";
    }
  };

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

  function Rgb(r, g, b) {
    this.r = Math.max(0, Math.min(255, Math.round(r)));
    this.g = Math.max(0, Math.min(255, Math.round(g)));
    this.b = Math.max(0, Math.min(255, Math.round(b)));
  }

  var _prototype = Rgb.prototype = new Color;

  var darker = .7;

  _prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k);
  };

  var brighter = 1 / darker;

  _prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k);
  };

  _prototype.rgb = function() {
    return this;
  };

  function format(r, g, b) {
    if (isNaN(r)) r = 0;
    if (isNaN(g)) g = 0;
    if (isNaN(b)) b = 0;
    return "#"
        + (r < 16 ? "0" + r.toString(16) : r.toString(16))
        + (g < 16 ? "0" + g.toString(16) : g.toString(16))
        + (b < 16 ? "0" + b.toString(16) : b.toString(16));
  }

  _prototype.toString = function() {
    return format(this.r, this.g, this.b);
  };

  var rgb = function(r, g, b) {
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

  function rgbn(n) {
    return rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff);
  }

  function Hsl(h, s, l) {
    this.h = +h;
    this.s = Math.max(0, Math.min(1, +s));
    this.l = Math.max(0, Math.min(1, +l));
  }

  var __prototype = Hsl.prototype = new Color;

  __prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k);
  };

  __prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k);
  };/* From FvD 13.37, CSS Color Module Level 3 */

  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  __prototype.rgb = function() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l <= .5 ? l * (1 + s) : l + s - l * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2)
    );
  };

  var hsl = function(h, s, l) {
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

  var reHex3 = /^#([0-9a-f]{3})$/,
      reHex6 = /^#([0-9a-f]{6})$/,
      reRgbInteger = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/,
      reRgbPercent = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/,
      reHslPercent = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;

  var color = function(format) {
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf))) // #f00
        : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
        : (m = reRgbInteger.exec(format)) ? rgb(m[1], m[2], m[3]) // rgb(255,0,0)
        : (m = reRgbPercent.exec(format)) ? rgb(m[1] * 2.55, m[2] * 2.55, m[3] * 2.55) // rgb(100%,0%,0%)
        : (m = reHslPercent.exec(format)) ? hsl(m[1], m[2] * .01, m[3] * .01) // hsl(120,50%,50%)
        : named.has(format) ? rgbn(named.get(format))
        : null;
  }// Done lazily to avoid circular dependency between Color, Rgb and Hsl.

  color.prototype = Color.prototype;
  rgb.prototype = Rgb.prototype;
  hsl.prototype = Hsl.prototype;

  function Lab(l, a, b) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
  }

  var ___prototype = Lab.prototype = new Color;

  var Kn = 18;

  ___prototype.brighter = function(k) {
    return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b);
  };

  ___prototype.darker = function(k) {
    return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b);
  };

  function xyz2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  var Xn = 0.950470, // D65 standard referent
      Yn = 1,
      Zn = 1.088830,
      t0 = 4 / 29,
      t1 = 6 / 29,
      t2 = 3 * t1 * t1,
      t3 = t1 * t1 * t1;

  function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
  }

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

  function rgb2xyz(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  var deg2rad = Math.PI / 180;

  function Hcl(h, c, l) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
  }

  var ____prototype = Hcl.prototype = new Color;

  ____prototype.brighter = function(k) {
    return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k));
  };

  ____prototype.darker = function(k) {
    return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k));
  };

  ____prototype.rgb = function() {
    return lab(this).rgb();
  };

  var lab = function(l, a, b) {
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
  lab.prototype = Lab.prototype;
  var rad2deg = 180 / Math.PI;

  var hcl = function(h, c, l) {
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
  hcl.prototype = Hcl.prototype;

  function Cubehelix(h, s, l) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
  }

  var prototype = Cubehelix.prototype = new Color;

  prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k);
  };

  prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Cubehelix(this.h, this.s, this.l * k);
  };

  var gamma = 1, // Default gamma. TODO Customize.
      A = -0.14861,
      B = +1.78277,
      C = -0.29227,
      D = -0.90649,
      E = +1.97294,
      ED = E * D,
      EB = E * B,
      BC_DA = B * C - D * A;

  var cubehelix = function(h, s, l) {
    if (arguments.length === 1) {
      if (h instanceof Cubehelix) {
        l = h.l;
        s = h.s;
        h = h.h;
      } else {
        if (!(h instanceof Rgb)) h = rgb(h);
        var r = h.r / 255, g = h.g / 255, b = h.b / 255;
        l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB);
        var bl = b - l, k = (E * (g - l) - C * bl) / D, lgamma = Math.pow(l, gamma);
        s = Math.sqrt(k * k + bl * bl) / (E * lgamma * (1 - lgamma)); // NaN if lgamma=0 or lgamma=1
        h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
        if (h < 0) h += 360;
      }
    }
    return new Cubehelix(h, s, l);
  }

  prototype.rgb = function() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
        l = Math.pow(this.l, gamma),
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new Rgb(
      255 * (l + a * (A * cosh + B * sinh)),
      255 * (l + a * (C * cosh + D * sinh)),
      255 * (l + a * (E * cosh))
    );
  };
  cubehelix.prototype = Cubehelix.prototype;

  var interpolateCubehelixLong = function(a, b) {
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
      a.l = al + bl * t;
      return a + "";
    };
  }
  var deltaHue = function(h, h0) {
    var delta = (h - h0) % 360;
    return delta + (delta > 180 ? -360 : delta < -180 ? 360 : 0);
  }

  var interpolateCubehelix = function(a, b) {
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
      a.l = al + bl * t;
      return a + "";
    };
  }

  var interpolateHclLong = function(a, b) {
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

  var interpolateHcl = function(a, b) {
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

  var interpolateLab = function(a, b) {
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

  var interpolateHslLong = function(a, b) {
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

  var interpolateHsl = function(a, b) {
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

  var interpolateRgb = function(a, b) {
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
  exports.interpolateCubehelix = interpolateCubehelix;
  exports.interpolateCubehelixLong = interpolateCubehelixLong;

}));
},{}],5:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.format = {}));
}(this, function (exports) { 'use strict';

  var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];


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

  function formatSpecifier(specifier) {
    return new FormatSpecifier(specifier);
  }

  function identity(x) {
    return x;
  }

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

  function localeFormat(locale) {
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

  var locale = localeFormat({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  });

  exports.format = locale.format;
  exports.formatPrefix = locale.formatPrefix;

  function precisionRound(step, max) {
    return Math.max(0, exponent(Math.abs(max)) - exponent(Math.abs(step))) + 1;
  }

  function precisionPrefix(step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
  }

  function precisionFixed(step) {
    return Math.max(0, -exponent(Math.abs(step)));
  }

  exports.formatSpecifier = formatSpecifier;
  exports.localeFormat = localeFormat;
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

  function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  function localDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  var pads = {"-": "", "_": " ", "0": "0"};

  function newYear(y) {
    return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
  }

  var percentRe = /^%/;

  function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function parseZone(d, string, i) {
    return /^[+-]\d{4}$/.test(string = string.slice(i, i + 5))
        ? (d.Z = -string, i + 5) // sign differs from getTimezoneOffset!
        : -1;
  }

  var numberRe = /^\s*\d+/;

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

  function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
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

  function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  }

  function formatLiteralPercent() {
    return "%";
  }

  function formatUTCZone() {
    return "+0000";
  }

  function pad(value, fill, width) {
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  function formatUTCFullYear(d, p) {
    return pad(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCYear(d, p) {
    return pad(d.getUTCFullYear() % 100, p, 2);
  }

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

  var utcYear = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCMonth(0, 1);
  }, function(date, offset) {
    date.setUTCFullYear(date.getUTCFullYear() + offset);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  });

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    }, function(date, offset) {
      date.setUTCDate(date.getUTCDate() + offset * 7);
    }, function(start, end) {
      return (end - start) / 6048e5;
    });
  }

  var utcMonday = utcWeekday(1);

  function formatUTCWeekNumberMonday(d, p) {
    return pad(utcMonday.count(utcYear(d), d), p, 2);
  }

  function formatUTCWeekdayNumber(d) {
    return d.getUTCDay();
  }

  var utcSunday = utcWeekday(0);

  function formatUTCWeekNumberSunday(d, p) {
    return pad(utcSunday.count(utcYear(d), d), p, 2);
  }

  function formatUTCSeconds(d, p) {
    return pad(d.getUTCSeconds(), p, 2);
  }

  function formatUTCMinutes(d, p) {
    return pad(d.getUTCMinutes(), p, 2);
  }

  function formatUTCMonthNumber(d, p) {
    return pad(d.getUTCMonth() + 1, p, 2);
  }

  function formatUTCMilliseconds(d, p) {
    return pad(d.getUTCMilliseconds(), p, 3);
  }

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, offset) {
    date.setUTCDate(date.getUTCDate() + offset);
  }, function(start, end) {
    return (end - start) / 864e5;
  });

  function formatUTCDayOfYear(d, p) {
    return pad(1 + utcDay.count(utcYear(d), d), p, 3);
  }

  function formatUTCHour12(d, p) {
    return pad(d.getUTCHours() % 12 || 12, p, 2);
  }

  function formatUTCHour24(d, p) {
    return pad(d.getUTCHours(), p, 2);
  }

  function formatUTCDayOfMonth(d, p) {
    return pad(d.getUTCDate(), p, 2);
  }

  function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+"))
        + pad(z / 60 | 0, "0", 2)
        + pad(z % 60, "0", 2);
  }

  function formatFullYear(d, p) {
    return pad(d.getFullYear() % 10000, p, 4);
  }

  function formatYear(d, p) {
    return pad(d.getFullYear() % 100, p, 2);
  }

  var year = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setMonth(0, 1);
  }, function(date, offset) {
    date.setFullYear(date.getFullYear() + offset);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  });

  function weekday(i) {
    return newInterval(function(date) {
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    }, function(date, offset) {
      date.setDate(date.getDate() + offset * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 6048e5;
    });
  }

  var monday = weekday(1);

  function formatWeekNumberMonday(d, p) {
    return pad(monday.count(year(d), d), p, 2);
  }

  function formatWeekdayNumber(d) {
    return d.getDay();
  }

  var sunday = weekday(0);

  function formatWeekNumberSunday(d, p) {
    return pad(sunday.count(year(d), d), p, 2);
  }

  function formatSeconds(d, p) {
    return pad(d.getSeconds(), p, 2);
  }

  function formatMinutes(d, p) {
    return pad(d.getMinutes(), p, 2);
  }

  function formatMonthNumber(d, p) {
    return pad(d.getMonth() + 1, p, 2);
  }

  function formatMilliseconds(d, p) {
    return pad(d.getMilliseconds(), p, 3);
  }

  var day = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
  }, function(date, offset) {
    date.setDate(date.getDate() + offset);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 864e5;
  });

  function formatDayOfYear(d, p) {
    return pad(1 + day.count(year(d), d), p, 3);
  }

  function formatHour12(d, p) {
    return pad(d.getHours() % 12 || 12, p, 2);
  }

  function formatHour24(d, p) {
    return pad(d.getHours(), p, 2);
  }

  function formatDayOfMonth(d, p) {
    return pad(d.getDate(), p, 2);
  }

  function formatLookup(names) {
    var map = new Map, i = -1, n = names.length;
    while (++i < n) map.set(names[i].toLowerCase(), i);
    return map;
  }

  var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

  function requote(s) {
    return s.replace(requoteRe, "\\$&");
  }

  function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }

  function localeFormat(locale) {
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

  var locale = localeFormat({
    dateTime: "%a %b %e %X %Y",
    date: "%m/%d/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  exports.format = locale.format;
  exports.utcFormat = locale.utcFormat;

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
      : locale.utcFormat(isoSpecifier);

  var isoFormat = formatIso;

  exports.isoFormat = isoFormat;
  exports.localeFormat = localeFormat;

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

u.field = function(f) {
  return String(f).split('\\.')
    .map(function(d) { return d.split('.'); })
    .reduce(function(a, b) {
      if (a.length) { a[a.length-1] += '.' + b.shift(); }
      a.push.apply(a, b);
      return a;
    }, []);
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
  if (!stats && encoding.hasValues()) {
    stats = summary(encoding.data().values).reduce(function(s, p) {
      s[p.field] = p;
      return s;
    }, {});
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
  //TODO(kanitw): have some config to turn off auto-sort for line (for line chart that encodes temporal information)
  if (lineType) {
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

  // TODO add "having" filter here ()

  // append non-zero filter at the end for the data table
  data.filterNonZeroForLog(def[def.length - 1], encoding);

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
    data.raw.transform.bin(encoding)
  ).concat(
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

data.filterNonZeroForLog = function(dataTable, encoding) {
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
      minimum: 0
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
      default: 'steelblue'
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
            'color palette, if undefined vega-lite will use data property' +
            'to pick one from c10palette, c20palette, or ordinalPalette'
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
          enum: util.keys(colorbrewer)
        },
        quantitativeRange: {
          type: 'array',
          default: ['#AFC6A3', '#09622A'], // tableau greens
          // default: ['#ccece6', '#00441b'], // BuGn.9 [2-8]
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
      default: 'circle'
    },
    filled: {
      type: 'boolean',
      default: false,
      description: 'whether the shape\'s color should be used as fill color instead of stroke color'
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
      default: 'black'
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
      default: 'black'
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
      default: 'transparent'
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2NvbG9yYnJld2VyL2NvbG9yYnJld2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvbG9yYnJld2VyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2QzLWNvbG9yL2J1aWxkL2NvbG9yLmpzIiwibm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9idWlsZC9mb3JtYXQuanMiLCJub2RlX21vZHVsZXMvZDMtdGltZS1mb3JtYXQvYnVpbGQvdGltZUZvcm1hdC5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL25vZGVfbW9kdWxlcy9kMy10aW1lL2J1aWxkL3RpbWUuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvYmlucy9iaW5zLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL2dlbmVyYXRlLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL2ltcG9ydC90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL3N0YXRzLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL3RpbWUuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvdXRpbC5qcyIsInNyYy9FbmNvZGluZy5qcyIsInNyYy9jb21waWxlci9heGlzLmpzIiwic3JjL2NvbXBpbGVyL2NvbXBpbGVyLmpzIiwic3JjL2NvbXBpbGVyL2RhdGEuanMiLCJzcmMvY29tcGlsZXIvZmFjZXQuanMiLCJzcmMvY29tcGlsZXIvZ3JvdXAuanMiLCJzcmMvY29tcGlsZXIvbGF5b3V0LmpzIiwic3JjL2NvbXBpbGVyL2xlZ2VuZC5qcyIsInNyYy9jb21waWxlci9tYXJrcy5qcyIsInNyYy9jb21waWxlci9zY2FsZS5qcyIsInNyYy9jb21waWxlci9zb3J0LmpzIiwic3JjL2NvbXBpbGVyL3N0YWNrLmpzIiwic3JjL2NvbXBpbGVyL3N0eWxlLmpzIiwic3JjL2NvbXBpbGVyL3N1YmZhY2V0LmpzIiwic3JjL2NvbXBpbGVyL3RpbWUuanMiLCJzcmMvY29uc3RzLmpzIiwic3JjL2RhdGEuanMiLCJzcmMvZW5jLmpzIiwic3JjL2ZpZWxkLmpzIiwic3JjL2dsb2JhbHMuanMiLCJzcmMvbG9nZ2VyLmpzIiwic3JjL3NjaGVtYS9zY2hlbWEuanMiLCJzcmMvc2NoZW1hL3NjaGVtYXV0aWwuanMiLCJzcmMvdXRpbC5qcyIsInNyYy92bCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNUQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25zQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsd0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsbnVsbCwiLy8gVGhpcyBwcm9kdWN0IGluY2x1ZGVzIGNvbG9yIHNwZWNpZmljYXRpb25zIGFuZCBkZXNpZ25zIGRldmVsb3BlZCBieSBDeW50aGlhIEJyZXdlciAoaHR0cDovL2NvbG9yYnJld2VyLm9yZy8pLlxuLy8gSmF2YVNjcmlwdCBzcGVjcyBhcyBwYWNrYWdlZCBpbiB0aGUgRDMgbGlicmFyeSAoZDNqcy5vcmcpLiBQbGVhc2Ugc2VlIGxpY2Vuc2UgYXQgaHR0cDovL2NvbG9yYnJld2VyLm9yZy9leHBvcnQvTElDRU5TRS50eHRcbiFmdW5jdGlvbigpIHtcblxudmFyIGNvbG9yYnJld2VyID0ge1lsR246IHtcbjM6IFtcIiNmN2ZjYjlcIixcIiNhZGRkOGVcIixcIiMzMWEzNTRcIl0sXG40OiBbXCIjZmZmZmNjXCIsXCIjYzJlNjk5XCIsXCIjNzhjNjc5XCIsXCIjMjM4NDQzXCJdLFxuNTogW1wiI2ZmZmZjY1wiLFwiI2MyZTY5OVwiLFwiIzc4YzY3OVwiLFwiIzMxYTM1NFwiLFwiIzAwNjgzN1wiXSxcbjY6IFtcIiNmZmZmY2NcIixcIiNkOWYwYTNcIixcIiNhZGRkOGVcIixcIiM3OGM2NzlcIixcIiMzMWEzNTRcIixcIiMwMDY4MzdcIl0sXG43OiBbXCIjZmZmZmNjXCIsXCIjZDlmMGEzXCIsXCIjYWRkZDhlXCIsXCIjNzhjNjc5XCIsXCIjNDFhYjVkXCIsXCIjMjM4NDQzXCIsXCIjMDA1YTMyXCJdLFxuODogW1wiI2ZmZmZlNVwiLFwiI2Y3ZmNiOVwiLFwiI2Q5ZjBhM1wiLFwiI2FkZGQ4ZVwiLFwiIzc4YzY3OVwiLFwiIzQxYWI1ZFwiLFwiIzIzODQ0M1wiLFwiIzAwNWEzMlwiXSxcbjk6IFtcIiNmZmZmZTVcIixcIiNmN2ZjYjlcIixcIiNkOWYwYTNcIixcIiNhZGRkOGVcIixcIiM3OGM2NzlcIixcIiM0MWFiNWRcIixcIiMyMzg0NDNcIixcIiMwMDY4MzdcIixcIiMwMDQ1MjlcIl1cbn0sWWxHbkJ1OiB7XG4zOiBbXCIjZWRmOGIxXCIsXCIjN2ZjZGJiXCIsXCIjMmM3ZmI4XCJdLFxuNDogW1wiI2ZmZmZjY1wiLFwiI2ExZGFiNFwiLFwiIzQxYjZjNFwiLFwiIzIyNWVhOFwiXSxcbjU6IFtcIiNmZmZmY2NcIixcIiNhMWRhYjRcIixcIiM0MWI2YzRcIixcIiMyYzdmYjhcIixcIiMyNTM0OTRcIl0sXG42OiBbXCIjZmZmZmNjXCIsXCIjYzdlOWI0XCIsXCIjN2ZjZGJiXCIsXCIjNDFiNmM0XCIsXCIjMmM3ZmI4XCIsXCIjMjUzNDk0XCJdLFxuNzogW1wiI2ZmZmZjY1wiLFwiI2M3ZTliNFwiLFwiIzdmY2RiYlwiLFwiIzQxYjZjNFwiLFwiIzFkOTFjMFwiLFwiIzIyNWVhOFwiLFwiIzBjMmM4NFwiXSxcbjg6IFtcIiNmZmZmZDlcIixcIiNlZGY4YjFcIixcIiNjN2U5YjRcIixcIiM3ZmNkYmJcIixcIiM0MWI2YzRcIixcIiMxZDkxYzBcIixcIiMyMjVlYThcIixcIiMwYzJjODRcIl0sXG45OiBbXCIjZmZmZmQ5XCIsXCIjZWRmOGIxXCIsXCIjYzdlOWI0XCIsXCIjN2ZjZGJiXCIsXCIjNDFiNmM0XCIsXCIjMWQ5MWMwXCIsXCIjMjI1ZWE4XCIsXCIjMjUzNDk0XCIsXCIjMDgxZDU4XCJdXG59LEduQnU6IHtcbjM6IFtcIiNlMGYzZGJcIixcIiNhOGRkYjVcIixcIiM0M2EyY2FcIl0sXG40OiBbXCIjZjBmOWU4XCIsXCIjYmFlNGJjXCIsXCIjN2JjY2M0XCIsXCIjMmI4Y2JlXCJdLFxuNTogW1wiI2YwZjllOFwiLFwiI2JhZTRiY1wiLFwiIzdiY2NjNFwiLFwiIzQzYTJjYVwiLFwiIzA4NjhhY1wiXSxcbjY6IFtcIiNmMGY5ZThcIixcIiNjY2ViYzVcIixcIiNhOGRkYjVcIixcIiM3YmNjYzRcIixcIiM0M2EyY2FcIixcIiMwODY4YWNcIl0sXG43OiBbXCIjZjBmOWU4XCIsXCIjY2NlYmM1XCIsXCIjYThkZGI1XCIsXCIjN2JjY2M0XCIsXCIjNGViM2QzXCIsXCIjMmI4Y2JlXCIsXCIjMDg1ODllXCJdLFxuODogW1wiI2Y3ZmNmMFwiLFwiI2UwZjNkYlwiLFwiI2NjZWJjNVwiLFwiI2E4ZGRiNVwiLFwiIzdiY2NjNFwiLFwiIzRlYjNkM1wiLFwiIzJiOGNiZVwiLFwiIzA4NTg5ZVwiXSxcbjk6IFtcIiNmN2ZjZjBcIixcIiNlMGYzZGJcIixcIiNjY2ViYzVcIixcIiNhOGRkYjVcIixcIiM3YmNjYzRcIixcIiM0ZWIzZDNcIixcIiMyYjhjYmVcIixcIiMwODY4YWNcIixcIiMwODQwODFcIl1cbn0sQnVHbjoge1xuMzogW1wiI2U1ZjVmOVwiLFwiIzk5ZDhjOVwiLFwiIzJjYTI1ZlwiXSxcbjQ6IFtcIiNlZGY4ZmJcIixcIiNiMmUyZTJcIixcIiM2NmMyYTRcIixcIiMyMzhiNDVcIl0sXG41OiBbXCIjZWRmOGZiXCIsXCIjYjJlMmUyXCIsXCIjNjZjMmE0XCIsXCIjMmNhMjVmXCIsXCIjMDA2ZDJjXCJdLFxuNjogW1wiI2VkZjhmYlwiLFwiI2NjZWNlNlwiLFwiIzk5ZDhjOVwiLFwiIzY2YzJhNFwiLFwiIzJjYTI1ZlwiLFwiIzAwNmQyY1wiXSxcbjc6IFtcIiNlZGY4ZmJcIixcIiNjY2VjZTZcIixcIiM5OWQ4YzlcIixcIiM2NmMyYTRcIixcIiM0MWFlNzZcIixcIiMyMzhiNDVcIixcIiMwMDU4MjRcIl0sXG44OiBbXCIjZjdmY2ZkXCIsXCIjZTVmNWY5XCIsXCIjY2NlY2U2XCIsXCIjOTlkOGM5XCIsXCIjNjZjMmE0XCIsXCIjNDFhZTc2XCIsXCIjMjM4YjQ1XCIsXCIjMDA1ODI0XCJdLFxuOTogW1wiI2Y3ZmNmZFwiLFwiI2U1ZjVmOVwiLFwiI2NjZWNlNlwiLFwiIzk5ZDhjOVwiLFwiIzY2YzJhNFwiLFwiIzQxYWU3NlwiLFwiIzIzOGI0NVwiLFwiIzAwNmQyY1wiLFwiIzAwNDQxYlwiXVxufSxQdUJ1R246IHtcbjM6IFtcIiNlY2UyZjBcIixcIiNhNmJkZGJcIixcIiMxYzkwOTlcIl0sXG40OiBbXCIjZjZlZmY3XCIsXCIjYmRjOWUxXCIsXCIjNjdhOWNmXCIsXCIjMDI4MThhXCJdLFxuNTogW1wiI2Y2ZWZmN1wiLFwiI2JkYzllMVwiLFwiIzY3YTljZlwiLFwiIzFjOTA5OVwiLFwiIzAxNmM1OVwiXSxcbjY6IFtcIiNmNmVmZjdcIixcIiNkMGQxZTZcIixcIiNhNmJkZGJcIixcIiM2N2E5Y2ZcIixcIiMxYzkwOTlcIixcIiMwMTZjNTlcIl0sXG43OiBbXCIjZjZlZmY3XCIsXCIjZDBkMWU2XCIsXCIjYTZiZGRiXCIsXCIjNjdhOWNmXCIsXCIjMzY5MGMwXCIsXCIjMDI4MThhXCIsXCIjMDE2NDUwXCJdLFxuODogW1wiI2ZmZjdmYlwiLFwiI2VjZTJmMFwiLFwiI2QwZDFlNlwiLFwiI2E2YmRkYlwiLFwiIzY3YTljZlwiLFwiIzM2OTBjMFwiLFwiIzAyODE4YVwiLFwiIzAxNjQ1MFwiXSxcbjk6IFtcIiNmZmY3ZmJcIixcIiNlY2UyZjBcIixcIiNkMGQxZTZcIixcIiNhNmJkZGJcIixcIiM2N2E5Y2ZcIixcIiMzNjkwYzBcIixcIiMwMjgxOGFcIixcIiMwMTZjNTlcIixcIiMwMTQ2MzZcIl1cbn0sUHVCdToge1xuMzogW1wiI2VjZTdmMlwiLFwiI2E2YmRkYlwiLFwiIzJiOGNiZVwiXSxcbjQ6IFtcIiNmMWVlZjZcIixcIiNiZGM5ZTFcIixcIiM3NGE5Y2ZcIixcIiMwNTcwYjBcIl0sXG41OiBbXCIjZjFlZWY2XCIsXCIjYmRjOWUxXCIsXCIjNzRhOWNmXCIsXCIjMmI4Y2JlXCIsXCIjMDQ1YThkXCJdLFxuNjogW1wiI2YxZWVmNlwiLFwiI2QwZDFlNlwiLFwiI2E2YmRkYlwiLFwiIzc0YTljZlwiLFwiIzJiOGNiZVwiLFwiIzA0NWE4ZFwiXSxcbjc6IFtcIiNmMWVlZjZcIixcIiNkMGQxZTZcIixcIiNhNmJkZGJcIixcIiM3NGE5Y2ZcIixcIiMzNjkwYzBcIixcIiMwNTcwYjBcIixcIiMwMzRlN2JcIl0sXG44OiBbXCIjZmZmN2ZiXCIsXCIjZWNlN2YyXCIsXCIjZDBkMWU2XCIsXCIjYTZiZGRiXCIsXCIjNzRhOWNmXCIsXCIjMzY5MGMwXCIsXCIjMDU3MGIwXCIsXCIjMDM0ZTdiXCJdLFxuOTogW1wiI2ZmZjdmYlwiLFwiI2VjZTdmMlwiLFwiI2QwZDFlNlwiLFwiI2E2YmRkYlwiLFwiIzc0YTljZlwiLFwiIzM2OTBjMFwiLFwiIzA1NzBiMFwiLFwiIzA0NWE4ZFwiLFwiIzAyMzg1OFwiXVxufSxCdVB1OiB7XG4zOiBbXCIjZTBlY2Y0XCIsXCIjOWViY2RhXCIsXCIjODg1NmE3XCJdLFxuNDogW1wiI2VkZjhmYlwiLFwiI2IzY2RlM1wiLFwiIzhjOTZjNlwiLFwiIzg4NDE5ZFwiXSxcbjU6IFtcIiNlZGY4ZmJcIixcIiNiM2NkZTNcIixcIiM4Yzk2YzZcIixcIiM4ODU2YTdcIixcIiM4MTBmN2NcIl0sXG42OiBbXCIjZWRmOGZiXCIsXCIjYmZkM2U2XCIsXCIjOWViY2RhXCIsXCIjOGM5NmM2XCIsXCIjODg1NmE3XCIsXCIjODEwZjdjXCJdLFxuNzogW1wiI2VkZjhmYlwiLFwiI2JmZDNlNlwiLFwiIzllYmNkYVwiLFwiIzhjOTZjNlwiLFwiIzhjNmJiMVwiLFwiIzg4NDE5ZFwiLFwiIzZlMDE2YlwiXSxcbjg6IFtcIiNmN2ZjZmRcIixcIiNlMGVjZjRcIixcIiNiZmQzZTZcIixcIiM5ZWJjZGFcIixcIiM4Yzk2YzZcIixcIiM4YzZiYjFcIixcIiM4ODQxOWRcIixcIiM2ZTAxNmJcIl0sXG45OiBbXCIjZjdmY2ZkXCIsXCIjZTBlY2Y0XCIsXCIjYmZkM2U2XCIsXCIjOWViY2RhXCIsXCIjOGM5NmM2XCIsXCIjOGM2YmIxXCIsXCIjODg0MTlkXCIsXCIjODEwZjdjXCIsXCIjNGQwMDRiXCJdXG59LFJkUHU6IHtcbjM6IFtcIiNmZGUwZGRcIixcIiNmYTlmYjVcIixcIiNjNTFiOGFcIl0sXG40OiBbXCIjZmVlYmUyXCIsXCIjZmJiNGI5XCIsXCIjZjc2OGExXCIsXCIjYWUwMTdlXCJdLFxuNTogW1wiI2ZlZWJlMlwiLFwiI2ZiYjRiOVwiLFwiI2Y3NjhhMVwiLFwiI2M1MWI4YVwiLFwiIzdhMDE3N1wiXSxcbjY6IFtcIiNmZWViZTJcIixcIiNmY2M1YzBcIixcIiNmYTlmYjVcIixcIiNmNzY4YTFcIixcIiNjNTFiOGFcIixcIiM3YTAxNzdcIl0sXG43OiBbXCIjZmVlYmUyXCIsXCIjZmNjNWMwXCIsXCIjZmE5ZmI1XCIsXCIjZjc2OGExXCIsXCIjZGQzNDk3XCIsXCIjYWUwMTdlXCIsXCIjN2EwMTc3XCJdLFxuODogW1wiI2ZmZjdmM1wiLFwiI2ZkZTBkZFwiLFwiI2ZjYzVjMFwiLFwiI2ZhOWZiNVwiLFwiI2Y3NjhhMVwiLFwiI2RkMzQ5N1wiLFwiI2FlMDE3ZVwiLFwiIzdhMDE3N1wiXSxcbjk6IFtcIiNmZmY3ZjNcIixcIiNmZGUwZGRcIixcIiNmY2M1YzBcIixcIiNmYTlmYjVcIixcIiNmNzY4YTFcIixcIiNkZDM0OTdcIixcIiNhZTAxN2VcIixcIiM3YTAxNzdcIixcIiM0OTAwNmFcIl1cbn0sUHVSZDoge1xuMzogW1wiI2U3ZTFlZlwiLFwiI2M5OTRjN1wiLFwiI2RkMWM3N1wiXSxcbjQ6IFtcIiNmMWVlZjZcIixcIiNkN2I1ZDhcIixcIiNkZjY1YjBcIixcIiNjZTEyNTZcIl0sXG41OiBbXCIjZjFlZWY2XCIsXCIjZDdiNWQ4XCIsXCIjZGY2NWIwXCIsXCIjZGQxYzc3XCIsXCIjOTgwMDQzXCJdLFxuNjogW1wiI2YxZWVmNlwiLFwiI2Q0YjlkYVwiLFwiI2M5OTRjN1wiLFwiI2RmNjViMFwiLFwiI2RkMWM3N1wiLFwiIzk4MDA0M1wiXSxcbjc6IFtcIiNmMWVlZjZcIixcIiNkNGI5ZGFcIixcIiNjOTk0YzdcIixcIiNkZjY1YjBcIixcIiNlNzI5OGFcIixcIiNjZTEyNTZcIixcIiM5MTAwM2ZcIl0sXG44OiBbXCIjZjdmNGY5XCIsXCIjZTdlMWVmXCIsXCIjZDRiOWRhXCIsXCIjYzk5NGM3XCIsXCIjZGY2NWIwXCIsXCIjZTcyOThhXCIsXCIjY2UxMjU2XCIsXCIjOTEwMDNmXCJdLFxuOTogW1wiI2Y3ZjRmOVwiLFwiI2U3ZTFlZlwiLFwiI2Q0YjlkYVwiLFwiI2M5OTRjN1wiLFwiI2RmNjViMFwiLFwiI2U3Mjk4YVwiLFwiI2NlMTI1NlwiLFwiIzk4MDA0M1wiLFwiIzY3MDAxZlwiXVxufSxPclJkOiB7XG4zOiBbXCIjZmVlOGM4XCIsXCIjZmRiYjg0XCIsXCIjZTM0YTMzXCJdLFxuNDogW1wiI2ZlZjBkOVwiLFwiI2ZkY2M4YVwiLFwiI2ZjOGQ1OVwiLFwiI2Q3MzAxZlwiXSxcbjU6IFtcIiNmZWYwZDlcIixcIiNmZGNjOGFcIixcIiNmYzhkNTlcIixcIiNlMzRhMzNcIixcIiNiMzAwMDBcIl0sXG42OiBbXCIjZmVmMGQ5XCIsXCIjZmRkNDllXCIsXCIjZmRiYjg0XCIsXCIjZmM4ZDU5XCIsXCIjZTM0YTMzXCIsXCIjYjMwMDAwXCJdLFxuNzogW1wiI2ZlZjBkOVwiLFwiI2ZkZDQ5ZVwiLFwiI2ZkYmI4NFwiLFwiI2ZjOGQ1OVwiLFwiI2VmNjU0OFwiLFwiI2Q3MzAxZlwiLFwiIzk5MDAwMFwiXSxcbjg6IFtcIiNmZmY3ZWNcIixcIiNmZWU4YzhcIixcIiNmZGQ0OWVcIixcIiNmZGJiODRcIixcIiNmYzhkNTlcIixcIiNlZjY1NDhcIixcIiNkNzMwMWZcIixcIiM5OTAwMDBcIl0sXG45OiBbXCIjZmZmN2VjXCIsXCIjZmVlOGM4XCIsXCIjZmRkNDllXCIsXCIjZmRiYjg0XCIsXCIjZmM4ZDU5XCIsXCIjZWY2NTQ4XCIsXCIjZDczMDFmXCIsXCIjYjMwMDAwXCIsXCIjN2YwMDAwXCJdXG59LFlsT3JSZDoge1xuMzogW1wiI2ZmZWRhMFwiLFwiI2ZlYjI0Y1wiLFwiI2YwM2IyMFwiXSxcbjQ6IFtcIiNmZmZmYjJcIixcIiNmZWNjNWNcIixcIiNmZDhkM2NcIixcIiNlMzFhMWNcIl0sXG41OiBbXCIjZmZmZmIyXCIsXCIjZmVjYzVjXCIsXCIjZmQ4ZDNjXCIsXCIjZjAzYjIwXCIsXCIjYmQwMDI2XCJdLFxuNjogW1wiI2ZmZmZiMlwiLFwiI2ZlZDk3NlwiLFwiI2ZlYjI0Y1wiLFwiI2ZkOGQzY1wiLFwiI2YwM2IyMFwiLFwiI2JkMDAyNlwiXSxcbjc6IFtcIiNmZmZmYjJcIixcIiNmZWQ5NzZcIixcIiNmZWIyNGNcIixcIiNmZDhkM2NcIixcIiNmYzRlMmFcIixcIiNlMzFhMWNcIixcIiNiMTAwMjZcIl0sXG44OiBbXCIjZmZmZmNjXCIsXCIjZmZlZGEwXCIsXCIjZmVkOTc2XCIsXCIjZmViMjRjXCIsXCIjZmQ4ZDNjXCIsXCIjZmM0ZTJhXCIsXCIjZTMxYTFjXCIsXCIjYjEwMDI2XCJdLFxuOTogW1wiI2ZmZmZjY1wiLFwiI2ZmZWRhMFwiLFwiI2ZlZDk3NlwiLFwiI2ZlYjI0Y1wiLFwiI2ZkOGQzY1wiLFwiI2ZjNGUyYVwiLFwiI2UzMWExY1wiLFwiI2JkMDAyNlwiLFwiIzgwMDAyNlwiXVxufSxZbE9yQnI6IHtcbjM6IFtcIiNmZmY3YmNcIixcIiNmZWM0NGZcIixcIiNkOTVmMGVcIl0sXG40OiBbXCIjZmZmZmQ0XCIsXCIjZmVkOThlXCIsXCIjZmU5OTI5XCIsXCIjY2M0YzAyXCJdLFxuNTogW1wiI2ZmZmZkNFwiLFwiI2ZlZDk4ZVwiLFwiI2ZlOTkyOVwiLFwiI2Q5NWYwZVwiLFwiIzk5MzQwNFwiXSxcbjY6IFtcIiNmZmZmZDRcIixcIiNmZWUzOTFcIixcIiNmZWM0NGZcIixcIiNmZTk5MjlcIixcIiNkOTVmMGVcIixcIiM5OTM0MDRcIl0sXG43OiBbXCIjZmZmZmQ0XCIsXCIjZmVlMzkxXCIsXCIjZmVjNDRmXCIsXCIjZmU5OTI5XCIsXCIjZWM3MDE0XCIsXCIjY2M0YzAyXCIsXCIjOGMyZDA0XCJdLFxuODogW1wiI2ZmZmZlNVwiLFwiI2ZmZjdiY1wiLFwiI2ZlZTM5MVwiLFwiI2ZlYzQ0ZlwiLFwiI2ZlOTkyOVwiLFwiI2VjNzAxNFwiLFwiI2NjNGMwMlwiLFwiIzhjMmQwNFwiXSxcbjk6IFtcIiNmZmZmZTVcIixcIiNmZmY3YmNcIixcIiNmZWUzOTFcIixcIiNmZWM0NGZcIixcIiNmZTk5MjlcIixcIiNlYzcwMTRcIixcIiNjYzRjMDJcIixcIiM5OTM0MDRcIixcIiM2NjI1MDZcIl1cbn0sUHVycGxlczoge1xuMzogW1wiI2VmZWRmNVwiLFwiI2JjYmRkY1wiLFwiIzc1NmJiMVwiXSxcbjQ6IFtcIiNmMmYwZjdcIixcIiNjYmM5ZTJcIixcIiM5ZTlhYzhcIixcIiM2YTUxYTNcIl0sXG41OiBbXCIjZjJmMGY3XCIsXCIjY2JjOWUyXCIsXCIjOWU5YWM4XCIsXCIjNzU2YmIxXCIsXCIjNTQyNzhmXCJdLFxuNjogW1wiI2YyZjBmN1wiLFwiI2RhZGFlYlwiLFwiI2JjYmRkY1wiLFwiIzllOWFjOFwiLFwiIzc1NmJiMVwiLFwiIzU0Mjc4ZlwiXSxcbjc6IFtcIiNmMmYwZjdcIixcIiNkYWRhZWJcIixcIiNiY2JkZGNcIixcIiM5ZTlhYzhcIixcIiM4MDdkYmFcIixcIiM2YTUxYTNcIixcIiM0YTE0ODZcIl0sXG44OiBbXCIjZmNmYmZkXCIsXCIjZWZlZGY1XCIsXCIjZGFkYWViXCIsXCIjYmNiZGRjXCIsXCIjOWU5YWM4XCIsXCIjODA3ZGJhXCIsXCIjNmE1MWEzXCIsXCIjNGExNDg2XCJdLFxuOTogW1wiI2ZjZmJmZFwiLFwiI2VmZWRmNVwiLFwiI2RhZGFlYlwiLFwiI2JjYmRkY1wiLFwiIzllOWFjOFwiLFwiIzgwN2RiYVwiLFwiIzZhNTFhM1wiLFwiIzU0Mjc4ZlwiLFwiIzNmMDA3ZFwiXVxufSxCbHVlczoge1xuMzogW1wiI2RlZWJmN1wiLFwiIzllY2FlMVwiLFwiIzMxODJiZFwiXSxcbjQ6IFtcIiNlZmYzZmZcIixcIiNiZGQ3ZTdcIixcIiM2YmFlZDZcIixcIiMyMTcxYjVcIl0sXG41OiBbXCIjZWZmM2ZmXCIsXCIjYmRkN2U3XCIsXCIjNmJhZWQ2XCIsXCIjMzE4MmJkXCIsXCIjMDg1MTljXCJdLFxuNjogW1wiI2VmZjNmZlwiLFwiI2M2ZGJlZlwiLFwiIzllY2FlMVwiLFwiIzZiYWVkNlwiLFwiIzMxODJiZFwiLFwiIzA4NTE5Y1wiXSxcbjc6IFtcIiNlZmYzZmZcIixcIiNjNmRiZWZcIixcIiM5ZWNhZTFcIixcIiM2YmFlZDZcIixcIiM0MjkyYzZcIixcIiMyMTcxYjVcIixcIiMwODQ1OTRcIl0sXG44OiBbXCIjZjdmYmZmXCIsXCIjZGVlYmY3XCIsXCIjYzZkYmVmXCIsXCIjOWVjYWUxXCIsXCIjNmJhZWQ2XCIsXCIjNDI5MmM2XCIsXCIjMjE3MWI1XCIsXCIjMDg0NTk0XCJdLFxuOTogW1wiI2Y3ZmJmZlwiLFwiI2RlZWJmN1wiLFwiI2M2ZGJlZlwiLFwiIzllY2FlMVwiLFwiIzZiYWVkNlwiLFwiIzQyOTJjNlwiLFwiIzIxNzFiNVwiLFwiIzA4NTE5Y1wiLFwiIzA4MzA2YlwiXVxufSxHcmVlbnM6IHtcbjM6IFtcIiNlNWY1ZTBcIixcIiNhMWQ5OWJcIixcIiMzMWEzNTRcIl0sXG40OiBbXCIjZWRmOGU5XCIsXCIjYmFlNGIzXCIsXCIjNzRjNDc2XCIsXCIjMjM4YjQ1XCJdLFxuNTogW1wiI2VkZjhlOVwiLFwiI2JhZTRiM1wiLFwiIzc0YzQ3NlwiLFwiIzMxYTM1NFwiLFwiIzAwNmQyY1wiXSxcbjY6IFtcIiNlZGY4ZTlcIixcIiNjN2U5YzBcIixcIiNhMWQ5OWJcIixcIiM3NGM0NzZcIixcIiMzMWEzNTRcIixcIiMwMDZkMmNcIl0sXG43OiBbXCIjZWRmOGU5XCIsXCIjYzdlOWMwXCIsXCIjYTFkOTliXCIsXCIjNzRjNDc2XCIsXCIjNDFhYjVkXCIsXCIjMjM4YjQ1XCIsXCIjMDA1YTMyXCJdLFxuODogW1wiI2Y3ZmNmNVwiLFwiI2U1ZjVlMFwiLFwiI2M3ZTljMFwiLFwiI2ExZDk5YlwiLFwiIzc0YzQ3NlwiLFwiIzQxYWI1ZFwiLFwiIzIzOGI0NVwiLFwiIzAwNWEzMlwiXSxcbjk6IFtcIiNmN2ZjZjVcIixcIiNlNWY1ZTBcIixcIiNjN2U5YzBcIixcIiNhMWQ5OWJcIixcIiM3NGM0NzZcIixcIiM0MWFiNWRcIixcIiMyMzhiNDVcIixcIiMwMDZkMmNcIixcIiMwMDQ0MWJcIl1cbn0sT3Jhbmdlczoge1xuMzogW1wiI2ZlZTZjZVwiLFwiI2ZkYWU2YlwiLFwiI2U2NTUwZFwiXSxcbjQ6IFtcIiNmZWVkZGVcIixcIiNmZGJlODVcIixcIiNmZDhkM2NcIixcIiNkOTQ3MDFcIl0sXG41OiBbXCIjZmVlZGRlXCIsXCIjZmRiZTg1XCIsXCIjZmQ4ZDNjXCIsXCIjZTY1NTBkXCIsXCIjYTYzNjAzXCJdLFxuNjogW1wiI2ZlZWRkZVwiLFwiI2ZkZDBhMlwiLFwiI2ZkYWU2YlwiLFwiI2ZkOGQzY1wiLFwiI2U2NTUwZFwiLFwiI2E2MzYwM1wiXSxcbjc6IFtcIiNmZWVkZGVcIixcIiNmZGQwYTJcIixcIiNmZGFlNmJcIixcIiNmZDhkM2NcIixcIiNmMTY5MTNcIixcIiNkOTQ4MDFcIixcIiM4YzJkMDRcIl0sXG44OiBbXCIjZmZmNWViXCIsXCIjZmVlNmNlXCIsXCIjZmRkMGEyXCIsXCIjZmRhZTZiXCIsXCIjZmQ4ZDNjXCIsXCIjZjE2OTEzXCIsXCIjZDk0ODAxXCIsXCIjOGMyZDA0XCJdLFxuOTogW1wiI2ZmZjVlYlwiLFwiI2ZlZTZjZVwiLFwiI2ZkZDBhMlwiLFwiI2ZkYWU2YlwiLFwiI2ZkOGQzY1wiLFwiI2YxNjkxM1wiLFwiI2Q5NDgwMVwiLFwiI2E2MzYwM1wiLFwiIzdmMjcwNFwiXVxufSxSZWRzOiB7XG4zOiBbXCIjZmVlMGQyXCIsXCIjZmM5MjcyXCIsXCIjZGUyZDI2XCJdLFxuNDogW1wiI2ZlZTVkOVwiLFwiI2ZjYWU5MVwiLFwiI2ZiNmE0YVwiLFwiI2NiMTgxZFwiXSxcbjU6IFtcIiNmZWU1ZDlcIixcIiNmY2FlOTFcIixcIiNmYjZhNGFcIixcIiNkZTJkMjZcIixcIiNhNTBmMTVcIl0sXG42OiBbXCIjZmVlNWQ5XCIsXCIjZmNiYmExXCIsXCIjZmM5MjcyXCIsXCIjZmI2YTRhXCIsXCIjZGUyZDI2XCIsXCIjYTUwZjE1XCJdLFxuNzogW1wiI2ZlZTVkOVwiLFwiI2ZjYmJhMVwiLFwiI2ZjOTI3MlwiLFwiI2ZiNmE0YVwiLFwiI2VmM2IyY1wiLFwiI2NiMTgxZFwiLFwiIzk5MDAwZFwiXSxcbjg6IFtcIiNmZmY1ZjBcIixcIiNmZWUwZDJcIixcIiNmY2JiYTFcIixcIiNmYzkyNzJcIixcIiNmYjZhNGFcIixcIiNlZjNiMmNcIixcIiNjYjE4MWRcIixcIiM5OTAwMGRcIl0sXG45OiBbXCIjZmZmNWYwXCIsXCIjZmVlMGQyXCIsXCIjZmNiYmExXCIsXCIjZmM5MjcyXCIsXCIjZmI2YTRhXCIsXCIjZWYzYjJjXCIsXCIjY2IxODFkXCIsXCIjYTUwZjE1XCIsXCIjNjcwMDBkXCJdXG59LEdyZXlzOiB7XG4zOiBbXCIjZjBmMGYwXCIsXCIjYmRiZGJkXCIsXCIjNjM2MzYzXCJdLFxuNDogW1wiI2Y3ZjdmN1wiLFwiI2NjY2NjY1wiLFwiIzk2OTY5NlwiLFwiIzUyNTI1MlwiXSxcbjU6IFtcIiNmN2Y3ZjdcIixcIiNjY2NjY2NcIixcIiM5Njk2OTZcIixcIiM2MzYzNjNcIixcIiMyNTI1MjVcIl0sXG42OiBbXCIjZjdmN2Y3XCIsXCIjZDlkOWQ5XCIsXCIjYmRiZGJkXCIsXCIjOTY5Njk2XCIsXCIjNjM2MzYzXCIsXCIjMjUyNTI1XCJdLFxuNzogW1wiI2Y3ZjdmN1wiLFwiI2Q5ZDlkOVwiLFwiI2JkYmRiZFwiLFwiIzk2OTY5NlwiLFwiIzczNzM3M1wiLFwiIzUyNTI1MlwiLFwiIzI1MjUyNVwiXSxcbjg6IFtcIiNmZmZmZmZcIixcIiNmMGYwZjBcIixcIiNkOWQ5ZDlcIixcIiNiZGJkYmRcIixcIiM5Njk2OTZcIixcIiM3MzczNzNcIixcIiM1MjUyNTJcIixcIiMyNTI1MjVcIl0sXG45OiBbXCIjZmZmZmZmXCIsXCIjZjBmMGYwXCIsXCIjZDlkOWQ5XCIsXCIjYmRiZGJkXCIsXCIjOTY5Njk2XCIsXCIjNzM3MzczXCIsXCIjNTI1MjUyXCIsXCIjMjUyNTI1XCIsXCIjMDAwMDAwXCJdXG59LFB1T3I6IHtcbjM6IFtcIiNmMWEzNDBcIixcIiNmN2Y3ZjdcIixcIiM5OThlYzNcIl0sXG40OiBbXCIjZTY2MTAxXCIsXCIjZmRiODYzXCIsXCIjYjJhYmQyXCIsXCIjNWUzYzk5XCJdLFxuNTogW1wiI2U2NjEwMVwiLFwiI2ZkYjg2M1wiLFwiI2Y3ZjdmN1wiLFwiI2IyYWJkMlwiLFwiIzVlM2M5OVwiXSxcbjY6IFtcIiNiMzU4MDZcIixcIiNmMWEzNDBcIixcIiNmZWUwYjZcIixcIiNkOGRhZWJcIixcIiM5OThlYzNcIixcIiM1NDI3ODhcIl0sXG43OiBbXCIjYjM1ODA2XCIsXCIjZjFhMzQwXCIsXCIjZmVlMGI2XCIsXCIjZjdmN2Y3XCIsXCIjZDhkYWViXCIsXCIjOTk4ZWMzXCIsXCIjNTQyNzg4XCJdLFxuODogW1wiI2IzNTgwNlwiLFwiI2UwODIxNFwiLFwiI2ZkYjg2M1wiLFwiI2ZlZTBiNlwiLFwiI2Q4ZGFlYlwiLFwiI2IyYWJkMlwiLFwiIzgwNzNhY1wiLFwiIzU0Mjc4OFwiXSxcbjk6IFtcIiNiMzU4MDZcIixcIiNlMDgyMTRcIixcIiNmZGI4NjNcIixcIiNmZWUwYjZcIixcIiNmN2Y3ZjdcIixcIiNkOGRhZWJcIixcIiNiMmFiZDJcIixcIiM4MDczYWNcIixcIiM1NDI3ODhcIl0sXG4xMDogW1wiIzdmM2IwOFwiLFwiI2IzNTgwNlwiLFwiI2UwODIxNFwiLFwiI2ZkYjg2M1wiLFwiI2ZlZTBiNlwiLFwiI2Q4ZGFlYlwiLFwiI2IyYWJkMlwiLFwiIzgwNzNhY1wiLFwiIzU0Mjc4OFwiLFwiIzJkMDA0YlwiXSxcbjExOiBbXCIjN2YzYjA4XCIsXCIjYjM1ODA2XCIsXCIjZTA4MjE0XCIsXCIjZmRiODYzXCIsXCIjZmVlMGI2XCIsXCIjZjdmN2Y3XCIsXCIjZDhkYWViXCIsXCIjYjJhYmQyXCIsXCIjODA3M2FjXCIsXCIjNTQyNzg4XCIsXCIjMmQwMDRiXCJdXG59LEJyQkc6IHtcbjM6IFtcIiNkOGIzNjVcIixcIiNmNWY1ZjVcIixcIiM1YWI0YWNcIl0sXG40OiBbXCIjYTY2MTFhXCIsXCIjZGZjMjdkXCIsXCIjODBjZGMxXCIsXCIjMDE4NTcxXCJdLFxuNTogW1wiI2E2NjExYVwiLFwiI2RmYzI3ZFwiLFwiI2Y1ZjVmNVwiLFwiIzgwY2RjMVwiLFwiIzAxODU3MVwiXSxcbjY6IFtcIiM4YzUxMGFcIixcIiNkOGIzNjVcIixcIiNmNmU4YzNcIixcIiNjN2VhZTVcIixcIiM1YWI0YWNcIixcIiMwMTY2NWVcIl0sXG43OiBbXCIjOGM1MTBhXCIsXCIjZDhiMzY1XCIsXCIjZjZlOGMzXCIsXCIjZjVmNWY1XCIsXCIjYzdlYWU1XCIsXCIjNWFiNGFjXCIsXCIjMDE2NjVlXCJdLFxuODogW1wiIzhjNTEwYVwiLFwiI2JmODEyZFwiLFwiI2RmYzI3ZFwiLFwiI2Y2ZThjM1wiLFwiI2M3ZWFlNVwiLFwiIzgwY2RjMVwiLFwiIzM1OTc4ZlwiLFwiIzAxNjY1ZVwiXSxcbjk6IFtcIiM4YzUxMGFcIixcIiNiZjgxMmRcIixcIiNkZmMyN2RcIixcIiNmNmU4YzNcIixcIiNmNWY1ZjVcIixcIiNjN2VhZTVcIixcIiM4MGNkYzFcIixcIiMzNTk3OGZcIixcIiMwMTY2NWVcIl0sXG4xMDogW1wiIzU0MzAwNVwiLFwiIzhjNTEwYVwiLFwiI2JmODEyZFwiLFwiI2RmYzI3ZFwiLFwiI2Y2ZThjM1wiLFwiI2M3ZWFlNVwiLFwiIzgwY2RjMVwiLFwiIzM1OTc4ZlwiLFwiIzAxNjY1ZVwiLFwiIzAwM2MzMFwiXSxcbjExOiBbXCIjNTQzMDA1XCIsXCIjOGM1MTBhXCIsXCIjYmY4MTJkXCIsXCIjZGZjMjdkXCIsXCIjZjZlOGMzXCIsXCIjZjVmNWY1XCIsXCIjYzdlYWU1XCIsXCIjODBjZGMxXCIsXCIjMzU5NzhmXCIsXCIjMDE2NjVlXCIsXCIjMDAzYzMwXCJdXG59LFBSR246IHtcbjM6IFtcIiNhZjhkYzNcIixcIiNmN2Y3ZjdcIixcIiM3ZmJmN2JcIl0sXG40OiBbXCIjN2IzMjk0XCIsXCIjYzJhNWNmXCIsXCIjYTZkYmEwXCIsXCIjMDA4ODM3XCJdLFxuNTogW1wiIzdiMzI5NFwiLFwiI2MyYTVjZlwiLFwiI2Y3ZjdmN1wiLFwiI2E2ZGJhMFwiLFwiIzAwODgzN1wiXSxcbjY6IFtcIiM3NjJhODNcIixcIiNhZjhkYzNcIixcIiNlN2Q0ZThcIixcIiNkOWYwZDNcIixcIiM3ZmJmN2JcIixcIiMxYjc4MzdcIl0sXG43OiBbXCIjNzYyYTgzXCIsXCIjYWY4ZGMzXCIsXCIjZTdkNGU4XCIsXCIjZjdmN2Y3XCIsXCIjZDlmMGQzXCIsXCIjN2ZiZjdiXCIsXCIjMWI3ODM3XCJdLFxuODogW1wiIzc2MmE4M1wiLFwiIzk5NzBhYlwiLFwiI2MyYTVjZlwiLFwiI2U3ZDRlOFwiLFwiI2Q5ZjBkM1wiLFwiI2E2ZGJhMFwiLFwiIzVhYWU2MVwiLFwiIzFiNzgzN1wiXSxcbjk6IFtcIiM3NjJhODNcIixcIiM5OTcwYWJcIixcIiNjMmE1Y2ZcIixcIiNlN2Q0ZThcIixcIiNmN2Y3ZjdcIixcIiNkOWYwZDNcIixcIiNhNmRiYTBcIixcIiM1YWFlNjFcIixcIiMxYjc4MzdcIl0sXG4xMDogW1wiIzQwMDA0YlwiLFwiIzc2MmE4M1wiLFwiIzk5NzBhYlwiLFwiI2MyYTVjZlwiLFwiI2U3ZDRlOFwiLFwiI2Q5ZjBkM1wiLFwiI2E2ZGJhMFwiLFwiIzVhYWU2MVwiLFwiIzFiNzgzN1wiLFwiIzAwNDQxYlwiXSxcbjExOiBbXCIjNDAwMDRiXCIsXCIjNzYyYTgzXCIsXCIjOTk3MGFiXCIsXCIjYzJhNWNmXCIsXCIjZTdkNGU4XCIsXCIjZjdmN2Y3XCIsXCIjZDlmMGQzXCIsXCIjYTZkYmEwXCIsXCIjNWFhZTYxXCIsXCIjMWI3ODM3XCIsXCIjMDA0NDFiXCJdXG59LFBpWUc6IHtcbjM6IFtcIiNlOWEzYzlcIixcIiNmN2Y3ZjdcIixcIiNhMWQ3NmFcIl0sXG40OiBbXCIjZDAxYzhiXCIsXCIjZjFiNmRhXCIsXCIjYjhlMTg2XCIsXCIjNGRhYzI2XCJdLFxuNTogW1wiI2QwMWM4YlwiLFwiI2YxYjZkYVwiLFwiI2Y3ZjdmN1wiLFwiI2I4ZTE4NlwiLFwiIzRkYWMyNlwiXSxcbjY6IFtcIiNjNTFiN2RcIixcIiNlOWEzYzlcIixcIiNmZGUwZWZcIixcIiNlNmY1ZDBcIixcIiNhMWQ3NmFcIixcIiM0ZDkyMjFcIl0sXG43OiBbXCIjYzUxYjdkXCIsXCIjZTlhM2M5XCIsXCIjZmRlMGVmXCIsXCIjZjdmN2Y3XCIsXCIjZTZmNWQwXCIsXCIjYTFkNzZhXCIsXCIjNGQ5MjIxXCJdLFxuODogW1wiI2M1MWI3ZFwiLFwiI2RlNzdhZVwiLFwiI2YxYjZkYVwiLFwiI2ZkZTBlZlwiLFwiI2U2ZjVkMFwiLFwiI2I4ZTE4NlwiLFwiIzdmYmM0MVwiLFwiIzRkOTIyMVwiXSxcbjk6IFtcIiNjNTFiN2RcIixcIiNkZTc3YWVcIixcIiNmMWI2ZGFcIixcIiNmZGUwZWZcIixcIiNmN2Y3ZjdcIixcIiNlNmY1ZDBcIixcIiNiOGUxODZcIixcIiM3ZmJjNDFcIixcIiM0ZDkyMjFcIl0sXG4xMDogW1wiIzhlMDE1MlwiLFwiI2M1MWI3ZFwiLFwiI2RlNzdhZVwiLFwiI2YxYjZkYVwiLFwiI2ZkZTBlZlwiLFwiI2U2ZjVkMFwiLFwiI2I4ZTE4NlwiLFwiIzdmYmM0MVwiLFwiIzRkOTIyMVwiLFwiIzI3NjQxOVwiXSxcbjExOiBbXCIjOGUwMTUyXCIsXCIjYzUxYjdkXCIsXCIjZGU3N2FlXCIsXCIjZjFiNmRhXCIsXCIjZmRlMGVmXCIsXCIjZjdmN2Y3XCIsXCIjZTZmNWQwXCIsXCIjYjhlMTg2XCIsXCIjN2ZiYzQxXCIsXCIjNGQ5MjIxXCIsXCIjMjc2NDE5XCJdXG59LFJkQnU6IHtcbjM6IFtcIiNlZjhhNjJcIixcIiNmN2Y3ZjdcIixcIiM2N2E5Y2ZcIl0sXG40OiBbXCIjY2EwMDIwXCIsXCIjZjRhNTgyXCIsXCIjOTJjNWRlXCIsXCIjMDU3MWIwXCJdLFxuNTogW1wiI2NhMDAyMFwiLFwiI2Y0YTU4MlwiLFwiI2Y3ZjdmN1wiLFwiIzkyYzVkZVwiLFwiIzA1NzFiMFwiXSxcbjY6IFtcIiNiMjE4MmJcIixcIiNlZjhhNjJcIixcIiNmZGRiYzdcIixcIiNkMWU1ZjBcIixcIiM2N2E5Y2ZcIixcIiMyMTY2YWNcIl0sXG43OiBbXCIjYjIxODJiXCIsXCIjZWY4YTYyXCIsXCIjZmRkYmM3XCIsXCIjZjdmN2Y3XCIsXCIjZDFlNWYwXCIsXCIjNjdhOWNmXCIsXCIjMjE2NmFjXCJdLFxuODogW1wiI2IyMTgyYlwiLFwiI2Q2NjA0ZFwiLFwiI2Y0YTU4MlwiLFwiI2ZkZGJjN1wiLFwiI2QxZTVmMFwiLFwiIzkyYzVkZVwiLFwiIzQzOTNjM1wiLFwiIzIxNjZhY1wiXSxcbjk6IFtcIiNiMjE4MmJcIixcIiNkNjYwNGRcIixcIiNmNGE1ODJcIixcIiNmZGRiYzdcIixcIiNmN2Y3ZjdcIixcIiNkMWU1ZjBcIixcIiM5MmM1ZGVcIixcIiM0MzkzYzNcIixcIiMyMTY2YWNcIl0sXG4xMDogW1wiIzY3MDAxZlwiLFwiI2IyMTgyYlwiLFwiI2Q2NjA0ZFwiLFwiI2Y0YTU4MlwiLFwiI2ZkZGJjN1wiLFwiI2QxZTVmMFwiLFwiIzkyYzVkZVwiLFwiIzQzOTNjM1wiLFwiIzIxNjZhY1wiLFwiIzA1MzA2MVwiXSxcbjExOiBbXCIjNjcwMDFmXCIsXCIjYjIxODJiXCIsXCIjZDY2MDRkXCIsXCIjZjRhNTgyXCIsXCIjZmRkYmM3XCIsXCIjZjdmN2Y3XCIsXCIjZDFlNWYwXCIsXCIjOTJjNWRlXCIsXCIjNDM5M2MzXCIsXCIjMjE2NmFjXCIsXCIjMDUzMDYxXCJdXG59LFJkR3k6IHtcbjM6IFtcIiNlZjhhNjJcIixcIiNmZmZmZmZcIixcIiM5OTk5OTlcIl0sXG40OiBbXCIjY2EwMDIwXCIsXCIjZjRhNTgyXCIsXCIjYmFiYWJhXCIsXCIjNDA0MDQwXCJdLFxuNTogW1wiI2NhMDAyMFwiLFwiI2Y0YTU4MlwiLFwiI2ZmZmZmZlwiLFwiI2JhYmFiYVwiLFwiIzQwNDA0MFwiXSxcbjY6IFtcIiNiMjE4MmJcIixcIiNlZjhhNjJcIixcIiNmZGRiYzdcIixcIiNlMGUwZTBcIixcIiM5OTk5OTlcIixcIiM0ZDRkNGRcIl0sXG43OiBbXCIjYjIxODJiXCIsXCIjZWY4YTYyXCIsXCIjZmRkYmM3XCIsXCIjZmZmZmZmXCIsXCIjZTBlMGUwXCIsXCIjOTk5OTk5XCIsXCIjNGQ0ZDRkXCJdLFxuODogW1wiI2IyMTgyYlwiLFwiI2Q2NjA0ZFwiLFwiI2Y0YTU4MlwiLFwiI2ZkZGJjN1wiLFwiI2UwZTBlMFwiLFwiI2JhYmFiYVwiLFwiIzg3ODc4N1wiLFwiIzRkNGQ0ZFwiXSxcbjk6IFtcIiNiMjE4MmJcIixcIiNkNjYwNGRcIixcIiNmNGE1ODJcIixcIiNmZGRiYzdcIixcIiNmZmZmZmZcIixcIiNlMGUwZTBcIixcIiNiYWJhYmFcIixcIiM4Nzg3ODdcIixcIiM0ZDRkNGRcIl0sXG4xMDogW1wiIzY3MDAxZlwiLFwiI2IyMTgyYlwiLFwiI2Q2NjA0ZFwiLFwiI2Y0YTU4MlwiLFwiI2ZkZGJjN1wiLFwiI2UwZTBlMFwiLFwiI2JhYmFiYVwiLFwiIzg3ODc4N1wiLFwiIzRkNGQ0ZFwiLFwiIzFhMWExYVwiXSxcbjExOiBbXCIjNjcwMDFmXCIsXCIjYjIxODJiXCIsXCIjZDY2MDRkXCIsXCIjZjRhNTgyXCIsXCIjZmRkYmM3XCIsXCIjZmZmZmZmXCIsXCIjZTBlMGUwXCIsXCIjYmFiYWJhXCIsXCIjODc4Nzg3XCIsXCIjNGQ0ZDRkXCIsXCIjMWExYTFhXCJdXG59LFJkWWxCdToge1xuMzogW1wiI2ZjOGQ1OVwiLFwiI2ZmZmZiZlwiLFwiIzkxYmZkYlwiXSxcbjQ6IFtcIiNkNzE5MWNcIixcIiNmZGFlNjFcIixcIiNhYmQ5ZTlcIixcIiMyYzdiYjZcIl0sXG41OiBbXCIjZDcxOTFjXCIsXCIjZmRhZTYxXCIsXCIjZmZmZmJmXCIsXCIjYWJkOWU5XCIsXCIjMmM3YmI2XCJdLFxuNjogW1wiI2Q3MzAyN1wiLFwiI2ZjOGQ1OVwiLFwiI2ZlZTA5MFwiLFwiI2UwZjNmOFwiLFwiIzkxYmZkYlwiLFwiIzQ1NzViNFwiXSxcbjc6IFtcIiNkNzMwMjdcIixcIiNmYzhkNTlcIixcIiNmZWUwOTBcIixcIiNmZmZmYmZcIixcIiNlMGYzZjhcIixcIiM5MWJmZGJcIixcIiM0NTc1YjRcIl0sXG44OiBbXCIjZDczMDI3XCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDkwXCIsXCIjZTBmM2Y4XCIsXCIjYWJkOWU5XCIsXCIjNzRhZGQxXCIsXCIjNDU3NWI0XCJdLFxuOTogW1wiI2Q3MzAyN1wiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA5MFwiLFwiI2ZmZmZiZlwiLFwiI2UwZjNmOFwiLFwiI2FiZDllOVwiLFwiIzc0YWRkMVwiLFwiIzQ1NzViNFwiXSxcbjEwOiBbXCIjYTUwMDI2XCIsXCIjZDczMDI3XCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDkwXCIsXCIjZTBmM2Y4XCIsXCIjYWJkOWU5XCIsXCIjNzRhZGQxXCIsXCIjNDU3NWI0XCIsXCIjMzEzNjk1XCJdLFxuMTE6IFtcIiNhNTAwMjZcIixcIiNkNzMwMjdcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOTBcIixcIiNmZmZmYmZcIixcIiNlMGYzZjhcIixcIiNhYmQ5ZTlcIixcIiM3NGFkZDFcIixcIiM0NTc1YjRcIixcIiMzMTM2OTVcIl1cbn0sU3BlY3RyYWw6IHtcbjM6IFtcIiNmYzhkNTlcIixcIiNmZmZmYmZcIixcIiM5OWQ1OTRcIl0sXG40OiBbXCIjZDcxOTFjXCIsXCIjZmRhZTYxXCIsXCIjYWJkZGE0XCIsXCIjMmI4M2JhXCJdLFxuNTogW1wiI2Q3MTkxY1wiLFwiI2ZkYWU2MVwiLFwiI2ZmZmZiZlwiLFwiI2FiZGRhNFwiLFwiIzJiODNiYVwiXSxcbjY6IFtcIiNkNTNlNGZcIixcIiNmYzhkNTlcIixcIiNmZWUwOGJcIixcIiNlNmY1OThcIixcIiM5OWQ1OTRcIixcIiMzMjg4YmRcIl0sXG43OiBbXCIjZDUzZTRmXCIsXCIjZmM4ZDU5XCIsXCIjZmVlMDhiXCIsXCIjZmZmZmJmXCIsXCIjZTZmNTk4XCIsXCIjOTlkNTk0XCIsXCIjMzI4OGJkXCJdLFxuODogW1wiI2Q1M2U0ZlwiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA4YlwiLFwiI2U2ZjU5OFwiLFwiI2FiZGRhNFwiLFwiIzY2YzJhNVwiLFwiIzMyODhiZFwiXSxcbjk6IFtcIiNkNTNlNGZcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOGJcIixcIiNmZmZmYmZcIixcIiNlNmY1OThcIixcIiNhYmRkYTRcIixcIiM2NmMyYTVcIixcIiMzMjg4YmRcIl0sXG4xMDogW1wiIzllMDE0MlwiLFwiI2Q1M2U0ZlwiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA4YlwiLFwiI2U2ZjU5OFwiLFwiI2FiZGRhNFwiLFwiIzY2YzJhNVwiLFwiIzMyODhiZFwiLFwiIzVlNGZhMlwiXSxcbjExOiBbXCIjOWUwMTQyXCIsXCIjZDUzZTRmXCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDhiXCIsXCIjZmZmZmJmXCIsXCIjZTZmNTk4XCIsXCIjYWJkZGE0XCIsXCIjNjZjMmE1XCIsXCIjMzI4OGJkXCIsXCIjNWU0ZmEyXCJdXG59LFJkWWxHbjoge1xuMzogW1wiI2ZjOGQ1OVwiLFwiI2ZmZmZiZlwiLFwiIzkxY2Y2MFwiXSxcbjQ6IFtcIiNkNzE5MWNcIixcIiNmZGFlNjFcIixcIiNhNmQ5NmFcIixcIiMxYTk2NDFcIl0sXG41OiBbXCIjZDcxOTFjXCIsXCIjZmRhZTYxXCIsXCIjZmZmZmJmXCIsXCIjYTZkOTZhXCIsXCIjMWE5NjQxXCJdLFxuNjogW1wiI2Q3MzAyN1wiLFwiI2ZjOGQ1OVwiLFwiI2ZlZTA4YlwiLFwiI2Q5ZWY4YlwiLFwiIzkxY2Y2MFwiLFwiIzFhOTg1MFwiXSxcbjc6IFtcIiNkNzMwMjdcIixcIiNmYzhkNTlcIixcIiNmZWUwOGJcIixcIiNmZmZmYmZcIixcIiNkOWVmOGJcIixcIiM5MWNmNjBcIixcIiMxYTk4NTBcIl0sXG44OiBbXCIjZDczMDI3XCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDhiXCIsXCIjZDllZjhiXCIsXCIjYTZkOTZhXCIsXCIjNjZiZDYzXCIsXCIjMWE5ODUwXCJdLFxuOTogW1wiI2Q3MzAyN1wiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA4YlwiLFwiI2ZmZmZiZlwiLFwiI2Q5ZWY4YlwiLFwiI2E2ZDk2YVwiLFwiIzY2YmQ2M1wiLFwiIzFhOTg1MFwiXSxcbjEwOiBbXCIjYTUwMDI2XCIsXCIjZDczMDI3XCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDhiXCIsXCIjZDllZjhiXCIsXCIjYTZkOTZhXCIsXCIjNjZiZDYzXCIsXCIjMWE5ODUwXCIsXCIjMDA2ODM3XCJdLFxuMTE6IFtcIiNhNTAwMjZcIixcIiNkNzMwMjdcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOGJcIixcIiNmZmZmYmZcIixcIiNkOWVmOGJcIixcIiNhNmQ5NmFcIixcIiM2NmJkNjNcIixcIiMxYTk4NTBcIixcIiMwMDY4MzdcIl1cbn0sQWNjZW50OiB7XG4zOiBbXCIjN2ZjOTdmXCIsXCIjYmVhZWQ0XCIsXCIjZmRjMDg2XCJdLFxuNDogW1wiIzdmYzk3ZlwiLFwiI2JlYWVkNFwiLFwiI2ZkYzA4NlwiLFwiI2ZmZmY5OVwiXSxcbjU6IFtcIiM3ZmM5N2ZcIixcIiNiZWFlZDRcIixcIiNmZGMwODZcIixcIiNmZmZmOTlcIixcIiMzODZjYjBcIl0sXG42OiBbXCIjN2ZjOTdmXCIsXCIjYmVhZWQ0XCIsXCIjZmRjMDg2XCIsXCIjZmZmZjk5XCIsXCIjMzg2Y2IwXCIsXCIjZjAwMjdmXCJdLFxuNzogW1wiIzdmYzk3ZlwiLFwiI2JlYWVkNFwiLFwiI2ZkYzA4NlwiLFwiI2ZmZmY5OVwiLFwiIzM4NmNiMFwiLFwiI2YwMDI3ZlwiLFwiI2JmNWIxN1wiXSxcbjg6IFtcIiM3ZmM5N2ZcIixcIiNiZWFlZDRcIixcIiNmZGMwODZcIixcIiNmZmZmOTlcIixcIiMzODZjYjBcIixcIiNmMDAyN2ZcIixcIiNiZjViMTdcIixcIiM2NjY2NjZcIl1cbn0sRGFyazI6IHtcbjM6IFtcIiMxYjllNzdcIixcIiNkOTVmMDJcIixcIiM3NTcwYjNcIl0sXG40OiBbXCIjMWI5ZTc3XCIsXCIjZDk1ZjAyXCIsXCIjNzU3MGIzXCIsXCIjZTcyOThhXCJdLFxuNTogW1wiIzFiOWU3N1wiLFwiI2Q5NWYwMlwiLFwiIzc1NzBiM1wiLFwiI2U3Mjk4YVwiLFwiIzY2YTYxZVwiXSxcbjY6IFtcIiMxYjllNzdcIixcIiNkOTVmMDJcIixcIiM3NTcwYjNcIixcIiNlNzI5OGFcIixcIiM2NmE2MWVcIixcIiNlNmFiMDJcIl0sXG43OiBbXCIjMWI5ZTc3XCIsXCIjZDk1ZjAyXCIsXCIjNzU3MGIzXCIsXCIjZTcyOThhXCIsXCIjNjZhNjFlXCIsXCIjZTZhYjAyXCIsXCIjYTY3NjFkXCJdLFxuODogW1wiIzFiOWU3N1wiLFwiI2Q5NWYwMlwiLFwiIzc1NzBiM1wiLFwiI2U3Mjk4YVwiLFwiIzY2YTYxZVwiLFwiI2U2YWIwMlwiLFwiI2E2NzYxZFwiLFwiIzY2NjY2NlwiXVxufSxQYWlyZWQ6IHtcbjM6IFtcIiNhNmNlZTNcIixcIiMxZjc4YjRcIixcIiNiMmRmOGFcIl0sXG40OiBbXCIjYTZjZWUzXCIsXCIjMWY3OGI0XCIsXCIjYjJkZjhhXCIsXCIjMzNhMDJjXCJdLFxuNTogW1wiI2E2Y2VlM1wiLFwiIzFmNzhiNFwiLFwiI2IyZGY4YVwiLFwiIzMzYTAyY1wiLFwiI2ZiOWE5OVwiXSxcbjY6IFtcIiNhNmNlZTNcIixcIiMxZjc4YjRcIixcIiNiMmRmOGFcIixcIiMzM2EwMmNcIixcIiNmYjlhOTlcIixcIiNlMzFhMWNcIl0sXG43OiBbXCIjYTZjZWUzXCIsXCIjMWY3OGI0XCIsXCIjYjJkZjhhXCIsXCIjMzNhMDJjXCIsXCIjZmI5YTk5XCIsXCIjZTMxYTFjXCIsXCIjZmRiZjZmXCJdLFxuODogW1wiI2E2Y2VlM1wiLFwiIzFmNzhiNFwiLFwiI2IyZGY4YVwiLFwiIzMzYTAyY1wiLFwiI2ZiOWE5OVwiLFwiI2UzMWExY1wiLFwiI2ZkYmY2ZlwiLFwiI2ZmN2YwMFwiXSxcbjk6IFtcIiNhNmNlZTNcIixcIiMxZjc4YjRcIixcIiNiMmRmOGFcIixcIiMzM2EwMmNcIixcIiNmYjlhOTlcIixcIiNlMzFhMWNcIixcIiNmZGJmNmZcIixcIiNmZjdmMDBcIixcIiNjYWIyZDZcIl0sXG4xMDogW1wiI2E2Y2VlM1wiLFwiIzFmNzhiNFwiLFwiI2IyZGY4YVwiLFwiIzMzYTAyY1wiLFwiI2ZiOWE5OVwiLFwiI2UzMWExY1wiLFwiI2ZkYmY2ZlwiLFwiI2ZmN2YwMFwiLFwiI2NhYjJkNlwiLFwiIzZhM2Q5YVwiXSxcbjExOiBbXCIjYTZjZWUzXCIsXCIjMWY3OGI0XCIsXCIjYjJkZjhhXCIsXCIjMzNhMDJjXCIsXCIjZmI5YTk5XCIsXCIjZTMxYTFjXCIsXCIjZmRiZjZmXCIsXCIjZmY3ZjAwXCIsXCIjY2FiMmQ2XCIsXCIjNmEzZDlhXCIsXCIjZmZmZjk5XCJdLFxuMTI6IFtcIiNhNmNlZTNcIixcIiMxZjc4YjRcIixcIiNiMmRmOGFcIixcIiMzM2EwMmNcIixcIiNmYjlhOTlcIixcIiNlMzFhMWNcIixcIiNmZGJmNmZcIixcIiNmZjdmMDBcIixcIiNjYWIyZDZcIixcIiM2YTNkOWFcIixcIiNmZmZmOTlcIixcIiNiMTU5MjhcIl1cbn0sUGFzdGVsMToge1xuMzogW1wiI2ZiYjRhZVwiLFwiI2IzY2RlM1wiLFwiI2NjZWJjNVwiXSxcbjQ6IFtcIiNmYmI0YWVcIixcIiNiM2NkZTNcIixcIiNjY2ViYzVcIixcIiNkZWNiZTRcIl0sXG41OiBbXCIjZmJiNGFlXCIsXCIjYjNjZGUzXCIsXCIjY2NlYmM1XCIsXCIjZGVjYmU0XCIsXCIjZmVkOWE2XCJdLFxuNjogW1wiI2ZiYjRhZVwiLFwiI2IzY2RlM1wiLFwiI2NjZWJjNVwiLFwiI2RlY2JlNFwiLFwiI2ZlZDlhNlwiLFwiI2ZmZmZjY1wiXSxcbjc6IFtcIiNmYmI0YWVcIixcIiNiM2NkZTNcIixcIiNjY2ViYzVcIixcIiNkZWNiZTRcIixcIiNmZWQ5YTZcIixcIiNmZmZmY2NcIixcIiNlNWQ4YmRcIl0sXG44OiBbXCIjZmJiNGFlXCIsXCIjYjNjZGUzXCIsXCIjY2NlYmM1XCIsXCIjZGVjYmU0XCIsXCIjZmVkOWE2XCIsXCIjZmZmZmNjXCIsXCIjZTVkOGJkXCIsXCIjZmRkYWVjXCJdLFxuOTogW1wiI2ZiYjRhZVwiLFwiI2IzY2RlM1wiLFwiI2NjZWJjNVwiLFwiI2RlY2JlNFwiLFwiI2ZlZDlhNlwiLFwiI2ZmZmZjY1wiLFwiI2U1ZDhiZFwiLFwiI2ZkZGFlY1wiLFwiI2YyZjJmMlwiXVxufSxQYXN0ZWwyOiB7XG4zOiBbXCIjYjNlMmNkXCIsXCIjZmRjZGFjXCIsXCIjY2JkNWU4XCJdLFxuNDogW1wiI2IzZTJjZFwiLFwiI2ZkY2RhY1wiLFwiI2NiZDVlOFwiLFwiI2Y0Y2FlNFwiXSxcbjU6IFtcIiNiM2UyY2RcIixcIiNmZGNkYWNcIixcIiNjYmQ1ZThcIixcIiNmNGNhZTRcIixcIiNlNmY1YzlcIl0sXG42OiBbXCIjYjNlMmNkXCIsXCIjZmRjZGFjXCIsXCIjY2JkNWU4XCIsXCIjZjRjYWU0XCIsXCIjZTZmNWM5XCIsXCIjZmZmMmFlXCJdLFxuNzogW1wiI2IzZTJjZFwiLFwiI2ZkY2RhY1wiLFwiI2NiZDVlOFwiLFwiI2Y0Y2FlNFwiLFwiI2U2ZjVjOVwiLFwiI2ZmZjJhZVwiLFwiI2YxZTJjY1wiXSxcbjg6IFtcIiNiM2UyY2RcIixcIiNmZGNkYWNcIixcIiNjYmQ1ZThcIixcIiNmNGNhZTRcIixcIiNlNmY1YzlcIixcIiNmZmYyYWVcIixcIiNmMWUyY2NcIixcIiNjY2NjY2NcIl1cbn0sU2V0MToge1xuMzogW1wiI2U0MWExY1wiLFwiIzM3N2ViOFwiLFwiIzRkYWY0YVwiXSxcbjQ6IFtcIiNlNDFhMWNcIixcIiMzNzdlYjhcIixcIiM0ZGFmNGFcIixcIiM5ODRlYTNcIl0sXG41OiBbXCIjZTQxYTFjXCIsXCIjMzc3ZWI4XCIsXCIjNGRhZjRhXCIsXCIjOTg0ZWEzXCIsXCIjZmY3ZjAwXCJdLFxuNjogW1wiI2U0MWExY1wiLFwiIzM3N2ViOFwiLFwiIzRkYWY0YVwiLFwiIzk4NGVhM1wiLFwiI2ZmN2YwMFwiLFwiI2ZmZmYzM1wiXSxcbjc6IFtcIiNlNDFhMWNcIixcIiMzNzdlYjhcIixcIiM0ZGFmNGFcIixcIiM5ODRlYTNcIixcIiNmZjdmMDBcIixcIiNmZmZmMzNcIixcIiNhNjU2MjhcIl0sXG44OiBbXCIjZTQxYTFjXCIsXCIjMzc3ZWI4XCIsXCIjNGRhZjRhXCIsXCIjOTg0ZWEzXCIsXCIjZmY3ZjAwXCIsXCIjZmZmZjMzXCIsXCIjYTY1NjI4XCIsXCIjZjc4MWJmXCJdLFxuOTogW1wiI2U0MWExY1wiLFwiIzM3N2ViOFwiLFwiIzRkYWY0YVwiLFwiIzk4NGVhM1wiLFwiI2ZmN2YwMFwiLFwiI2ZmZmYzM1wiLFwiI2E2NTYyOFwiLFwiI2Y3ODFiZlwiLFwiIzk5OTk5OVwiXVxufSxTZXQyOiB7XG4zOiBbXCIjNjZjMmE1XCIsXCIjZmM4ZDYyXCIsXCIjOGRhMGNiXCJdLFxuNDogW1wiIzY2YzJhNVwiLFwiI2ZjOGQ2MlwiLFwiIzhkYTBjYlwiLFwiI2U3OGFjM1wiXSxcbjU6IFtcIiM2NmMyYTVcIixcIiNmYzhkNjJcIixcIiM4ZGEwY2JcIixcIiNlNzhhYzNcIixcIiNhNmQ4NTRcIl0sXG42OiBbXCIjNjZjMmE1XCIsXCIjZmM4ZDYyXCIsXCIjOGRhMGNiXCIsXCIjZTc4YWMzXCIsXCIjYTZkODU0XCIsXCIjZmZkOTJmXCJdLFxuNzogW1wiIzY2YzJhNVwiLFwiI2ZjOGQ2MlwiLFwiIzhkYTBjYlwiLFwiI2U3OGFjM1wiLFwiI2E2ZDg1NFwiLFwiI2ZmZDkyZlwiLFwiI2U1YzQ5NFwiXSxcbjg6IFtcIiM2NmMyYTVcIixcIiNmYzhkNjJcIixcIiM4ZGEwY2JcIixcIiNlNzhhYzNcIixcIiNhNmQ4NTRcIixcIiNmZmQ5MmZcIixcIiNlNWM0OTRcIixcIiNiM2IzYjNcIl1cbn0sU2V0Mzoge1xuMzogW1wiIzhkZDNjN1wiLFwiI2ZmZmZiM1wiLFwiI2JlYmFkYVwiXSxcbjQ6IFtcIiM4ZGQzYzdcIixcIiNmZmZmYjNcIixcIiNiZWJhZGFcIixcIiNmYjgwNzJcIl0sXG41OiBbXCIjOGRkM2M3XCIsXCIjZmZmZmIzXCIsXCIjYmViYWRhXCIsXCIjZmI4MDcyXCIsXCIjODBiMWQzXCJdLFxuNjogW1wiIzhkZDNjN1wiLFwiI2ZmZmZiM1wiLFwiI2JlYmFkYVwiLFwiI2ZiODA3MlwiLFwiIzgwYjFkM1wiLFwiI2ZkYjQ2MlwiXSxcbjc6IFtcIiM4ZGQzYzdcIixcIiNmZmZmYjNcIixcIiNiZWJhZGFcIixcIiNmYjgwNzJcIixcIiM4MGIxZDNcIixcIiNmZGI0NjJcIixcIiNiM2RlNjlcIl0sXG44OiBbXCIjOGRkM2M3XCIsXCIjZmZmZmIzXCIsXCIjYmViYWRhXCIsXCIjZmI4MDcyXCIsXCIjODBiMWQzXCIsXCIjZmRiNDYyXCIsXCIjYjNkZTY5XCIsXCIjZmNjZGU1XCJdLFxuOTogW1wiIzhkZDNjN1wiLFwiI2ZmZmZiM1wiLFwiI2JlYmFkYVwiLFwiI2ZiODA3MlwiLFwiIzgwYjFkM1wiLFwiI2ZkYjQ2MlwiLFwiI2IzZGU2OVwiLFwiI2ZjY2RlNVwiLFwiI2Q5ZDlkOVwiXSxcbjEwOiBbXCIjOGRkM2M3XCIsXCIjZmZmZmIzXCIsXCIjYmViYWRhXCIsXCIjZmI4MDcyXCIsXCIjODBiMWQzXCIsXCIjZmRiNDYyXCIsXCIjYjNkZTY5XCIsXCIjZmNjZGU1XCIsXCIjZDlkOWQ5XCIsXCIjYmM4MGJkXCJdLFxuMTE6IFtcIiM4ZGQzYzdcIixcIiNmZmZmYjNcIixcIiNiZWJhZGFcIixcIiNmYjgwNzJcIixcIiM4MGIxZDNcIixcIiNmZGI0NjJcIixcIiNiM2RlNjlcIixcIiNmY2NkZTVcIixcIiNkOWQ5ZDlcIixcIiNiYzgwYmRcIixcIiNjY2ViYzVcIl0sXG4xMjogW1wiIzhkZDNjN1wiLFwiI2ZmZmZiM1wiLFwiI2JlYmFkYVwiLFwiI2ZiODA3MlwiLFwiIzgwYjFkM1wiLFwiI2ZkYjQ2MlwiLFwiI2IzZGU2OVwiLFwiI2ZjY2RlNVwiLFwiI2Q5ZDlkOVwiLFwiI2JjODBiZFwiLFwiI2NjZWJjNVwiLFwiI2ZmZWQ2ZlwiXVxufX07XG5cbmlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShjb2xvcmJyZXdlcik7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGNvbG9yYnJld2VyO1xufSBlbHNlIHtcbiAgICB0aGlzLmNvbG9yYnJld2VyID0gY29sb3JicmV3ZXI7XG59XG5cbn0oKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9jb2xvcmJyZXdlci5qcycpO1xuIiwiaWYgKHR5cGVvZiBNYXAgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgTWFwID0gZnVuY3Rpb24oKSB7fTtcbiAgTWFwLnByb3RvdHlwZSA9IHtcbiAgICBzZXQ6IGZ1bmN0aW9uKGssIHYpIHsgdGhpc1tcIiRcIiArIGtdID0gdjsgcmV0dXJuIHRoaXM7IH0sXG4gICAgZ2V0OiBmdW5jdGlvbihrKSB7IHJldHVybiB0aGlzW1wiJFwiICsga107IH0sXG4gICAgaGFzOiBmdW5jdGlvbihrKSB7IHJldHVybiBcIiRcIiArIGsgaW4gdGhpczsgfVxuICB9O1xufVxuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gIGZhY3RvcnkoKGdsb2JhbC5jb2xvciA9IHt9KSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICBmdW5jdGlvbiBDb2xvcigpIHt9XG5cbiAgQ29sb3IucHJvdG90eXBlID0ge1xuICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnJnYigpICsgXCJcIjtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG5hbWVkID0gKG5ldyBNYXApXG4gICAgICAuc2V0KFwiYWxpY2VibHVlXCIsIDB4ZjBmOGZmKVxuICAgICAgLnNldChcImFudGlxdWV3aGl0ZVwiLCAweGZhZWJkNylcbiAgICAgIC5zZXQoXCJhcXVhXCIsIDB4MDBmZmZmKVxuICAgICAgLnNldChcImFxdWFtYXJpbmVcIiwgMHg3ZmZmZDQpXG4gICAgICAuc2V0KFwiYXp1cmVcIiwgMHhmMGZmZmYpXG4gICAgICAuc2V0KFwiYmVpZ2VcIiwgMHhmNWY1ZGMpXG4gICAgICAuc2V0KFwiYmlzcXVlXCIsIDB4ZmZlNGM0KVxuICAgICAgLnNldChcImJsYWNrXCIsIDB4MDAwMDAwKVxuICAgICAgLnNldChcImJsYW5jaGVkYWxtb25kXCIsIDB4ZmZlYmNkKVxuICAgICAgLnNldChcImJsdWVcIiwgMHgwMDAwZmYpXG4gICAgICAuc2V0KFwiYmx1ZXZpb2xldFwiLCAweDhhMmJlMilcbiAgICAgIC5zZXQoXCJicm93blwiLCAweGE1MmEyYSlcbiAgICAgIC5zZXQoXCJidXJseXdvb2RcIiwgMHhkZWI4ODcpXG4gICAgICAuc2V0KFwiY2FkZXRibHVlXCIsIDB4NWY5ZWEwKVxuICAgICAgLnNldChcImNoYXJ0cmV1c2VcIiwgMHg3ZmZmMDApXG4gICAgICAuc2V0KFwiY2hvY29sYXRlXCIsIDB4ZDI2OTFlKVxuICAgICAgLnNldChcImNvcmFsXCIsIDB4ZmY3ZjUwKVxuICAgICAgLnNldChcImNvcm5mbG93ZXJibHVlXCIsIDB4NjQ5NWVkKVxuICAgICAgLnNldChcImNvcm5zaWxrXCIsIDB4ZmZmOGRjKVxuICAgICAgLnNldChcImNyaW1zb25cIiwgMHhkYzE0M2MpXG4gICAgICAuc2V0KFwiY3lhblwiLCAweDAwZmZmZilcbiAgICAgIC5zZXQoXCJkYXJrYmx1ZVwiLCAweDAwMDA4YilcbiAgICAgIC5zZXQoXCJkYXJrY3lhblwiLCAweDAwOGI4YilcbiAgICAgIC5zZXQoXCJkYXJrZ29sZGVucm9kXCIsIDB4Yjg4NjBiKVxuICAgICAgLnNldChcImRhcmtncmF5XCIsIDB4YTlhOWE5KVxuICAgICAgLnNldChcImRhcmtncmVlblwiLCAweDAwNjQwMClcbiAgICAgIC5zZXQoXCJkYXJrZ3JleVwiLCAweGE5YTlhOSlcbiAgICAgIC5zZXQoXCJkYXJra2hha2lcIiwgMHhiZGI3NmIpXG4gICAgICAuc2V0KFwiZGFya21hZ2VudGFcIiwgMHg4YjAwOGIpXG4gICAgICAuc2V0KFwiZGFya29saXZlZ3JlZW5cIiwgMHg1NTZiMmYpXG4gICAgICAuc2V0KFwiZGFya29yYW5nZVwiLCAweGZmOGMwMClcbiAgICAgIC5zZXQoXCJkYXJrb3JjaGlkXCIsIDB4OTkzMmNjKVxuICAgICAgLnNldChcImRhcmtyZWRcIiwgMHg4YjAwMDApXG4gICAgICAuc2V0KFwiZGFya3NhbG1vblwiLCAweGU5OTY3YSlcbiAgICAgIC5zZXQoXCJkYXJrc2VhZ3JlZW5cIiwgMHg4ZmJjOGYpXG4gICAgICAuc2V0KFwiZGFya3NsYXRlYmx1ZVwiLCAweDQ4M2Q4YilcbiAgICAgIC5zZXQoXCJkYXJrc2xhdGVncmF5XCIsIDB4MmY0ZjRmKVxuICAgICAgLnNldChcImRhcmtzbGF0ZWdyZXlcIiwgMHgyZjRmNGYpXG4gICAgICAuc2V0KFwiZGFya3R1cnF1b2lzZVwiLCAweDAwY2VkMSlcbiAgICAgIC5zZXQoXCJkYXJrdmlvbGV0XCIsIDB4OTQwMGQzKVxuICAgICAgLnNldChcImRlZXBwaW5rXCIsIDB4ZmYxNDkzKVxuICAgICAgLnNldChcImRlZXBza3libHVlXCIsIDB4MDBiZmZmKVxuICAgICAgLnNldChcImRpbWdyYXlcIiwgMHg2OTY5NjkpXG4gICAgICAuc2V0KFwiZGltZ3JleVwiLCAweDY5Njk2OSlcbiAgICAgIC5zZXQoXCJkb2RnZXJibHVlXCIsIDB4MWU5MGZmKVxuICAgICAgLnNldChcImZpcmVicmlja1wiLCAweGIyMjIyMilcbiAgICAgIC5zZXQoXCJmbG9yYWx3aGl0ZVwiLCAweGZmZmFmMClcbiAgICAgIC5zZXQoXCJmb3Jlc3RncmVlblwiLCAweDIyOGIyMilcbiAgICAgIC5zZXQoXCJmdWNoc2lhXCIsIDB4ZmYwMGZmKVxuICAgICAgLnNldChcImdhaW5zYm9yb1wiLCAweGRjZGNkYylcbiAgICAgIC5zZXQoXCJnaG9zdHdoaXRlXCIsIDB4ZjhmOGZmKVxuICAgICAgLnNldChcImdvbGRcIiwgMHhmZmQ3MDApXG4gICAgICAuc2V0KFwiZ29sZGVucm9kXCIsIDB4ZGFhNTIwKVxuICAgICAgLnNldChcImdyYXlcIiwgMHg4MDgwODApXG4gICAgICAuc2V0KFwiZ3JlZW5cIiwgMHgwMDgwMDApXG4gICAgICAuc2V0KFwiZ3JlZW55ZWxsb3dcIiwgMHhhZGZmMmYpXG4gICAgICAuc2V0KFwiZ3JleVwiLCAweDgwODA4MClcbiAgICAgIC5zZXQoXCJob25leWRld1wiLCAweGYwZmZmMClcbiAgICAgIC5zZXQoXCJob3RwaW5rXCIsIDB4ZmY2OWI0KVxuICAgICAgLnNldChcImluZGlhbnJlZFwiLCAweGNkNWM1YylcbiAgICAgIC5zZXQoXCJpbmRpZ29cIiwgMHg0YjAwODIpXG4gICAgICAuc2V0KFwiaXZvcnlcIiwgMHhmZmZmZjApXG4gICAgICAuc2V0KFwia2hha2lcIiwgMHhmMGU2OGMpXG4gICAgICAuc2V0KFwibGF2ZW5kZXJcIiwgMHhlNmU2ZmEpXG4gICAgICAuc2V0KFwibGF2ZW5kZXJibHVzaFwiLCAweGZmZjBmNSlcbiAgICAgIC5zZXQoXCJsYXduZ3JlZW5cIiwgMHg3Y2ZjMDApXG4gICAgICAuc2V0KFwibGVtb25jaGlmZm9uXCIsIDB4ZmZmYWNkKVxuICAgICAgLnNldChcImxpZ2h0Ymx1ZVwiLCAweGFkZDhlNilcbiAgICAgIC5zZXQoXCJsaWdodGNvcmFsXCIsIDB4ZjA4MDgwKVxuICAgICAgLnNldChcImxpZ2h0Y3lhblwiLCAweGUwZmZmZilcbiAgICAgIC5zZXQoXCJsaWdodGdvbGRlbnJvZHllbGxvd1wiLCAweGZhZmFkMilcbiAgICAgIC5zZXQoXCJsaWdodGdyYXlcIiwgMHhkM2QzZDMpXG4gICAgICAuc2V0KFwibGlnaHRncmVlblwiLCAweDkwZWU5MClcbiAgICAgIC5zZXQoXCJsaWdodGdyZXlcIiwgMHhkM2QzZDMpXG4gICAgICAuc2V0KFwibGlnaHRwaW5rXCIsIDB4ZmZiNmMxKVxuICAgICAgLnNldChcImxpZ2h0c2FsbW9uXCIsIDB4ZmZhMDdhKVxuICAgICAgLnNldChcImxpZ2h0c2VhZ3JlZW5cIiwgMHgyMGIyYWEpXG4gICAgICAuc2V0KFwibGlnaHRza3libHVlXCIsIDB4ODdjZWZhKVxuICAgICAgLnNldChcImxpZ2h0c2xhdGVncmF5XCIsIDB4Nzc4ODk5KVxuICAgICAgLnNldChcImxpZ2h0c2xhdGVncmV5XCIsIDB4Nzc4ODk5KVxuICAgICAgLnNldChcImxpZ2h0c3RlZWxibHVlXCIsIDB4YjBjNGRlKVxuICAgICAgLnNldChcImxpZ2h0eWVsbG93XCIsIDB4ZmZmZmUwKVxuICAgICAgLnNldChcImxpbWVcIiwgMHgwMGZmMDApXG4gICAgICAuc2V0KFwibGltZWdyZWVuXCIsIDB4MzJjZDMyKVxuICAgICAgLnNldChcImxpbmVuXCIsIDB4ZmFmMGU2KVxuICAgICAgLnNldChcIm1hZ2VudGFcIiwgMHhmZjAwZmYpXG4gICAgICAuc2V0KFwibWFyb29uXCIsIDB4ODAwMDAwKVxuICAgICAgLnNldChcIm1lZGl1bWFxdWFtYXJpbmVcIiwgMHg2NmNkYWEpXG4gICAgICAuc2V0KFwibWVkaXVtYmx1ZVwiLCAweDAwMDBjZClcbiAgICAgIC5zZXQoXCJtZWRpdW1vcmNoaWRcIiwgMHhiYTU1ZDMpXG4gICAgICAuc2V0KFwibWVkaXVtcHVycGxlXCIsIDB4OTM3MGRiKVxuICAgICAgLnNldChcIm1lZGl1bXNlYWdyZWVuXCIsIDB4M2NiMzcxKVxuICAgICAgLnNldChcIm1lZGl1bXNsYXRlYmx1ZVwiLCAweDdiNjhlZSlcbiAgICAgIC5zZXQoXCJtZWRpdW1zcHJpbmdncmVlblwiLCAweDAwZmE5YSlcbiAgICAgIC5zZXQoXCJtZWRpdW10dXJxdW9pc2VcIiwgMHg0OGQxY2MpXG4gICAgICAuc2V0KFwibWVkaXVtdmlvbGV0cmVkXCIsIDB4YzcxNTg1KVxuICAgICAgLnNldChcIm1pZG5pZ2h0Ymx1ZVwiLCAweDE5MTk3MClcbiAgICAgIC5zZXQoXCJtaW50Y3JlYW1cIiwgMHhmNWZmZmEpXG4gICAgICAuc2V0KFwibWlzdHlyb3NlXCIsIDB4ZmZlNGUxKVxuICAgICAgLnNldChcIm1vY2Nhc2luXCIsIDB4ZmZlNGI1KVxuICAgICAgLnNldChcIm5hdmFqb3doaXRlXCIsIDB4ZmZkZWFkKVxuICAgICAgLnNldChcIm5hdnlcIiwgMHgwMDAwODApXG4gICAgICAuc2V0KFwib2xkbGFjZVwiLCAweGZkZjVlNilcbiAgICAgIC5zZXQoXCJvbGl2ZVwiLCAweDgwODAwMClcbiAgICAgIC5zZXQoXCJvbGl2ZWRyYWJcIiwgMHg2YjhlMjMpXG4gICAgICAuc2V0KFwib3JhbmdlXCIsIDB4ZmZhNTAwKVxuICAgICAgLnNldChcIm9yYW5nZXJlZFwiLCAweGZmNDUwMClcbiAgICAgIC5zZXQoXCJvcmNoaWRcIiwgMHhkYTcwZDYpXG4gICAgICAuc2V0KFwicGFsZWdvbGRlbnJvZFwiLCAweGVlZThhYSlcbiAgICAgIC5zZXQoXCJwYWxlZ3JlZW5cIiwgMHg5OGZiOTgpXG4gICAgICAuc2V0KFwicGFsZXR1cnF1b2lzZVwiLCAweGFmZWVlZSlcbiAgICAgIC5zZXQoXCJwYWxldmlvbGV0cmVkXCIsIDB4ZGI3MDkzKVxuICAgICAgLnNldChcInBhcGF5YXdoaXBcIiwgMHhmZmVmZDUpXG4gICAgICAuc2V0KFwicGVhY2hwdWZmXCIsIDB4ZmZkYWI5KVxuICAgICAgLnNldChcInBlcnVcIiwgMHhjZDg1M2YpXG4gICAgICAuc2V0KFwicGlua1wiLCAweGZmYzBjYilcbiAgICAgIC5zZXQoXCJwbHVtXCIsIDB4ZGRhMGRkKVxuICAgICAgLnNldChcInBvd2RlcmJsdWVcIiwgMHhiMGUwZTYpXG4gICAgICAuc2V0KFwicHVycGxlXCIsIDB4ODAwMDgwKVxuICAgICAgLnNldChcInJlYmVjY2FwdXJwbGVcIiwgMHg2NjMzOTkpXG4gICAgICAuc2V0KFwicmVkXCIsIDB4ZmYwMDAwKVxuICAgICAgLnNldChcInJvc3licm93blwiLCAweGJjOGY4ZilcbiAgICAgIC5zZXQoXCJyb3lhbGJsdWVcIiwgMHg0MTY5ZTEpXG4gICAgICAuc2V0KFwic2FkZGxlYnJvd25cIiwgMHg4YjQ1MTMpXG4gICAgICAuc2V0KFwic2FsbW9uXCIsIDB4ZmE4MDcyKVxuICAgICAgLnNldChcInNhbmR5YnJvd25cIiwgMHhmNGE0NjApXG4gICAgICAuc2V0KFwic2VhZ3JlZW5cIiwgMHgyZThiNTcpXG4gICAgICAuc2V0KFwic2Vhc2hlbGxcIiwgMHhmZmY1ZWUpXG4gICAgICAuc2V0KFwic2llbm5hXCIsIDB4YTA1MjJkKVxuICAgICAgLnNldChcInNpbHZlclwiLCAweGMwYzBjMClcbiAgICAgIC5zZXQoXCJza3libHVlXCIsIDB4ODdjZWViKVxuICAgICAgLnNldChcInNsYXRlYmx1ZVwiLCAweDZhNWFjZClcbiAgICAgIC5zZXQoXCJzbGF0ZWdyYXlcIiwgMHg3MDgwOTApXG4gICAgICAuc2V0KFwic2xhdGVncmV5XCIsIDB4NzA4MDkwKVxuICAgICAgLnNldChcInNub3dcIiwgMHhmZmZhZmEpXG4gICAgICAuc2V0KFwic3ByaW5nZ3JlZW5cIiwgMHgwMGZmN2YpXG4gICAgICAuc2V0KFwic3RlZWxibHVlXCIsIDB4NDY4MmI0KVxuICAgICAgLnNldChcInRhblwiLCAweGQyYjQ4YylcbiAgICAgIC5zZXQoXCJ0ZWFsXCIsIDB4MDA4MDgwKVxuICAgICAgLnNldChcInRoaXN0bGVcIiwgMHhkOGJmZDgpXG4gICAgICAuc2V0KFwidG9tYXRvXCIsIDB4ZmY2MzQ3KVxuICAgICAgLnNldChcInR1cnF1b2lzZVwiLCAweDQwZTBkMClcbiAgICAgIC5zZXQoXCJ2aW9sZXRcIiwgMHhlZTgyZWUpXG4gICAgICAuc2V0KFwid2hlYXRcIiwgMHhmNWRlYjMpXG4gICAgICAuc2V0KFwid2hpdGVcIiwgMHhmZmZmZmYpXG4gICAgICAuc2V0KFwid2hpdGVzbW9rZVwiLCAweGY1ZjVmNSlcbiAgICAgIC5zZXQoXCJ5ZWxsb3dcIiwgMHhmZmZmMDApXG4gICAgICAuc2V0KFwieWVsbG93Z3JlZW5cIiwgMHg5YWNkMzIpO1xuXG4gIGZ1bmN0aW9uIFJnYihyLCBnLCBiKSB7XG4gICAgdGhpcy5yID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBNYXRoLnJvdW5kKHIpKSk7XG4gICAgdGhpcy5nID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBNYXRoLnJvdW5kKGcpKSk7XG4gICAgdGhpcy5iID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBNYXRoLnJvdW5kKGIpKSk7XG4gIH1cblxuICB2YXIgX3Byb3RvdHlwZSA9IFJnYi5wcm90b3R5cGUgPSBuZXcgQ29sb3I7XG5cbiAgdmFyIGRhcmtlciA9IC43O1xuXG4gIF9wcm90b3R5cGUuZGFya2VyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGspO1xuICB9O1xuXG4gIHZhciBicmlnaHRlciA9IDEgLyBkYXJrZXI7XG5cbiAgX3Byb3RvdHlwZS5icmlnaHRlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gYnJpZ2h0ZXIgOiBNYXRoLnBvdyhicmlnaHRlciwgayk7XG4gICAgcmV0dXJuIG5ldyBSZ2IodGhpcy5yICogaywgdGhpcy5nICogaywgdGhpcy5iICogayk7XG4gIH07XG5cbiAgX3Byb3RvdHlwZS5yZ2IgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBmdW5jdGlvbiBmb3JtYXQociwgZywgYikge1xuICAgIGlmIChpc05hTihyKSkgciA9IDA7XG4gICAgaWYgKGlzTmFOKGcpKSBnID0gMDtcbiAgICBpZiAoaXNOYU4oYikpIGIgPSAwO1xuICAgIHJldHVybiBcIiNcIlxuICAgICAgICArIChyIDwgMTYgPyBcIjBcIiArIHIudG9TdHJpbmcoMTYpIDogci50b1N0cmluZygxNikpXG4gICAgICAgICsgKGcgPCAxNiA/IFwiMFwiICsgZy50b1N0cmluZygxNikgOiBnLnRvU3RyaW5nKDE2KSlcbiAgICAgICAgKyAoYiA8IDE2ID8gXCIwXCIgKyBiLnRvU3RyaW5nKDE2KSA6IGIudG9TdHJpbmcoMTYpKTtcbiAgfVxuXG4gIF9wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZm9ybWF0KHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xuICB9O1xuXG4gIHZhciByZ2IgPSBmdW5jdGlvbihyLCBnLCBiKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmICghKHIgaW5zdGFuY2VvZiBDb2xvcikpIHIgPSBjb2xvcihyKTtcbiAgICAgIGlmIChyKSB7XG4gICAgICAgIHIgPSByLnJnYigpO1xuICAgICAgICBiID0gci5iO1xuICAgICAgICBnID0gci5nO1xuICAgICAgICByID0gci5yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgciA9IGcgPSBiID0gTmFOO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFJnYihyLCBnLCBiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJnYm4obikge1xuICAgIHJldHVybiByZ2IobiA+PiAxNiAmIDB4ZmYsIG4gPj4gOCAmIDB4ZmYsIG4gJiAweGZmKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEhzbChoLCBzLCBsKSB7XG4gICAgdGhpcy5oID0gK2g7XG4gICAgdGhpcy5zID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgK3MpKTtcbiAgICB0aGlzLmwgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCArbCkpO1xuICB9XG5cbiAgdmFyIF9fcHJvdG90eXBlID0gSHNsLnByb3RvdHlwZSA9IG5ldyBDb2xvcjtcblxuICBfX3Byb3RvdHlwZS5icmlnaHRlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gYnJpZ2h0ZXIgOiBNYXRoLnBvdyhicmlnaHRlciwgayk7XG4gICAgcmV0dXJuIG5ldyBIc2wodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGspO1xuICB9O1xuXG4gIF9fcHJvdG90eXBlLmRhcmtlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gZGFya2VyIDogTWF0aC5wb3coZGFya2VyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogayk7XG4gIH07LyogRnJvbSBGdkQgMTMuMzcsIENTUyBDb2xvciBNb2R1bGUgTGV2ZWwgMyAqL1xuXG4gIGZ1bmN0aW9uIGhzbDJyZ2IoaCwgbTEsIG0yKSB7XG4gICAgcmV0dXJuIChoIDwgNjAgPyBtMSArIChtMiAtIG0xKSAqIGggLyA2MFxuICAgICAgICA6IGggPCAxODAgPyBtMlxuICAgICAgICA6IGggPCAyNDAgPyBtMSArIChtMiAtIG0xKSAqICgyNDAgLSBoKSAvIDYwXG4gICAgICAgIDogbTEpICogMjU1O1xuICB9XG5cbiAgX19wcm90b3R5cGUucmdiID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGggPSB0aGlzLmggJSAzNjAgKyAodGhpcy5oIDwgMCkgKiAzNjAsXG4gICAgICAgIHMgPSBpc05hTihoKSB8fCBpc05hTih0aGlzLnMpID8gMCA6IHRoaXMucyxcbiAgICAgICAgbCA9IHRoaXMubCxcbiAgICAgICAgbTIgPSBsIDw9IC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzLFxuICAgICAgICBtMSA9IDIgKiBsIC0gbTI7XG4gICAgcmV0dXJuIG5ldyBSZ2IoXG4gICAgICBoc2wycmdiKGggPj0gMjQwID8gaCAtIDI0MCA6IGggKyAxMjAsIG0xLCBtMiksXG4gICAgICBoc2wycmdiKGgsIG0xLCBtMiksXG4gICAgICBoc2wycmdiKGggPCAxMjAgPyBoICsgMjQwIDogaCAtIDEyMCwgbTEsIG0yKVxuICAgICk7XG4gIH07XG5cbiAgdmFyIGhzbCA9IGZ1bmN0aW9uKGgsIHMsIGwpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKGggaW5zdGFuY2VvZiBIc2wpIHtcbiAgICAgICAgbCA9IGgubDtcbiAgICAgICAgcyA9IGgucztcbiAgICAgICAgaCA9IGguaDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghKGggaW5zdGFuY2VvZiBDb2xvcikpIGggPSBjb2xvcihoKTtcbiAgICAgICAgaWYgKGgpIHtcbiAgICAgICAgICBpZiAoaCBpbnN0YW5jZW9mIEhzbCkgcmV0dXJuIGg7XG4gICAgICAgICAgaCA9IGgucmdiKCk7XG4gICAgICAgICAgdmFyIHIgPSBoLnIgLyAyNTUsXG4gICAgICAgICAgICAgIGcgPSBoLmcgLyAyNTUsXG4gICAgICAgICAgICAgIGIgPSBoLmIgLyAyNTUsXG4gICAgICAgICAgICAgIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpLFxuICAgICAgICAgICAgICBtYXggPSBNYXRoLm1heChyLCBnLCBiKSxcbiAgICAgICAgICAgICAgcmFuZ2UgPSBtYXggLSBtaW47XG4gICAgICAgICAgbCA9IChtYXggKyBtaW4pIC8gMjtcbiAgICAgICAgICBpZiAocmFuZ2UpIHtcbiAgICAgICAgICAgIHMgPSBsIDwgLjUgPyByYW5nZSAvIChtYXggKyBtaW4pIDogcmFuZ2UgLyAoMiAtIG1heCAtIG1pbik7XG4gICAgICAgICAgICBpZiAociA9PT0gbWF4KSBoID0gKGcgLSBiKSAvIHJhbmdlICsgKGcgPCBiKSAqIDY7XG4gICAgICAgICAgICBlbHNlIGlmIChnID09PSBtYXgpIGggPSAoYiAtIHIpIC8gcmFuZ2UgKyAyO1xuICAgICAgICAgICAgZWxzZSBoID0gKHIgLSBnKSAvIHJhbmdlICsgNDtcbiAgICAgICAgICAgIGggKj0gNjA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGggPSBOYU47XG4gICAgICAgICAgICBzID0gbCA+IDAgJiYgbCA8IDEgPyAwIDogaDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaCA9IHMgPSBsID0gTmFOO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgSHNsKGgsIHMsIGwpO1xuICB9XG5cbiAgdmFyIHJlSGV4MyA9IC9eIyhbMC05YS1mXXszfSkkLyxcbiAgICAgIHJlSGV4NiA9IC9eIyhbMC05YS1mXXs2fSkkLyxcbiAgICAgIHJlUmdiSW50ZWdlciA9IC9ecmdiXFwoXFxzKihbLStdP1xcZCspXFxzKixcXHMqKFstK10/XFxkKylcXHMqLFxccyooWy0rXT9cXGQrKVxccypcXCkkLyxcbiAgICAgIHJlUmdiUGVyY2VudCA9IC9ecmdiXFwoXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccypcXCkkLyxcbiAgICAgIHJlSHNsUGVyY2VudCA9IC9eaHNsXFwoXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKlxcKSQvO1xuXG4gIHZhciBjb2xvciA9IGZ1bmN0aW9uKGZvcm1hdCkge1xuICAgIHZhciBtO1xuICAgIGZvcm1hdCA9IChmb3JtYXQgKyBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gKG0gPSByZUhleDMuZXhlYyhmb3JtYXQpKSA/IChtID0gcGFyc2VJbnQobVsxXSwgMTYpLCByZ2IoKG0gPj4gOCAmIDB4ZikgfCAobSA+PiA0ICYgMHgwZjApLCAobSA+PiA0ICYgMHhmKSB8IChtICYgMHhmMCksICgobSAmIDB4ZikgPDwgNCkgfCAobSAmIDB4ZikpKSAvLyAjZjAwXG4gICAgICAgIDogKG0gPSByZUhleDYuZXhlYyhmb3JtYXQpKSA/IHJnYm4ocGFyc2VJbnQobVsxXSwgMTYpKSAvLyAjZmYwMDAwXG4gICAgICAgIDogKG0gPSByZVJnYkludGVnZXIuZXhlYyhmb3JtYXQpKSA/IHJnYihtWzFdLCBtWzJdLCBtWzNdKSAvLyByZ2IoMjU1LDAsMClcbiAgICAgICAgOiAobSA9IHJlUmdiUGVyY2VudC5leGVjKGZvcm1hdCkpID8gcmdiKG1bMV0gKiAyLjU1LCBtWzJdICogMi41NSwgbVszXSAqIDIuNTUpIC8vIHJnYigxMDAlLDAlLDAlKVxuICAgICAgICA6IChtID0gcmVIc2xQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyBoc2wobVsxXSwgbVsyXSAqIC4wMSwgbVszXSAqIC4wMSkgLy8gaHNsKDEyMCw1MCUsNTAlKVxuICAgICAgICA6IG5hbWVkLmhhcyhmb3JtYXQpID8gcmdibihuYW1lZC5nZXQoZm9ybWF0KSlcbiAgICAgICAgOiBudWxsO1xuICB9Ly8gRG9uZSBsYXppbHkgdG8gYXZvaWQgY2lyY3VsYXIgZGVwZW5kZW5jeSBiZXR3ZWVuIENvbG9yLCBSZ2IgYW5kIEhzbC5cblxuICBjb2xvci5wcm90b3R5cGUgPSBDb2xvci5wcm90b3R5cGU7XG4gIHJnYi5wcm90b3R5cGUgPSBSZ2IucHJvdG90eXBlO1xuICBoc2wucHJvdG90eXBlID0gSHNsLnByb3RvdHlwZTtcblxuICBmdW5jdGlvbiBMYWIobCwgYSwgYikge1xuICAgIHRoaXMubCA9ICtsO1xuICAgIHRoaXMuYSA9ICthO1xuICAgIHRoaXMuYiA9ICtiO1xuICB9XG5cbiAgdmFyIF9fX3Byb3RvdHlwZSA9IExhYi5wcm90b3R5cGUgPSBuZXcgQ29sb3I7XG5cbiAgdmFyIEtuID0gMTg7XG5cbiAgX19fcHJvdG90eXBlLmJyaWdodGVyID0gZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgTGFiKHRoaXMubCArIEtuICogKGsgPT0gbnVsbCA/IDEgOiBrKSwgdGhpcy5hLCB0aGlzLmIpO1xuICB9O1xuXG4gIF9fX3Byb3RvdHlwZS5kYXJrZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIG5ldyBMYWIodGhpcy5sIC0gS24gKiAoayA9PSBudWxsID8gMSA6IGspLCB0aGlzLmEsIHRoaXMuYik7XG4gIH07XG5cbiAgZnVuY3Rpb24geHl6MnJnYih4KSB7XG4gICAgcmV0dXJuIDI1NSAqICh4IDw9IDAuMDAzMTMwOCA/IDEyLjkyICogeCA6IDEuMDU1ICogTWF0aC5wb3coeCwgMSAvIDIuNCkgLSAwLjA1NSk7XG4gIH1cblxuICB2YXIgWG4gPSAwLjk1MDQ3MCwgLy8gRDY1IHN0YW5kYXJkIHJlZmVyZW50XG4gICAgICBZbiA9IDEsXG4gICAgICBabiA9IDEuMDg4ODMwLFxuICAgICAgdDAgPSA0IC8gMjksXG4gICAgICB0MSA9IDYgLyAyOSxcbiAgICAgIHQyID0gMyAqIHQxICogdDEsXG4gICAgICB0MyA9IHQxICogdDEgKiB0MTtcblxuICBmdW5jdGlvbiBsYWIyeHl6KHQpIHtcbiAgICByZXR1cm4gdCA+IHQxID8gdCAqIHQgKiB0IDogdDIgKiAodCAtIHQwKTtcbiAgfVxuXG4gIF9fX3Byb3RvdHlwZS5yZ2IgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgeSA9ICh0aGlzLmwgKyAxNikgLyAxMTYsXG4gICAgICAgIHggPSBpc05hTih0aGlzLmEpID8geSA6IHkgKyB0aGlzLmEgLyA1MDAsXG4gICAgICAgIHogPSBpc05hTih0aGlzLmIpID8geSA6IHkgLSB0aGlzLmIgLyAyMDA7XG4gICAgeSA9IFluICogbGFiMnh5eih5KTtcbiAgICB4ID0gWG4gKiBsYWIyeHl6KHgpO1xuICAgIHogPSBabiAqIGxhYjJ4eXooeik7XG4gICAgcmV0dXJuIG5ldyBSZ2IoXG4gICAgICB4eXoycmdiKCAzLjI0MDQ1NDIgKiB4IC0gMS41MzcxMzg1ICogeSAtIDAuNDk4NTMxNCAqIHopLCAvLyBENjUgLT4gc1JHQlxuICAgICAgeHl6MnJnYigtMC45NjkyNjYwICogeCArIDEuODc2MDEwOCAqIHkgKyAwLjA0MTU1NjAgKiB6KSxcbiAgICAgIHh5ejJyZ2IoIDAuMDU1NjQzNCAqIHggLSAwLjIwNDAyNTkgKiB5ICsgMS4wNTcyMjUyICogeilcbiAgICApO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHh5ejJsYWIodCkge1xuICAgIHJldHVybiB0ID4gdDMgPyBNYXRoLnBvdyh0LCAxIC8gMykgOiB0IC8gdDIgKyB0MDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJnYjJ4eXooeCkge1xuICAgIHJldHVybiAoeCAvPSAyNTUpIDw9IDAuMDQwNDUgPyB4IC8gMTIuOTIgOiBNYXRoLnBvdygoeCArIDAuMDU1KSAvIDEuMDU1LCAyLjQpO1xuICB9XG5cbiAgdmFyIGRlZzJyYWQgPSBNYXRoLlBJIC8gMTgwO1xuXG4gIGZ1bmN0aW9uIEhjbChoLCBjLCBsKSB7XG4gICAgdGhpcy5oID0gK2g7XG4gICAgdGhpcy5jID0gK2M7XG4gICAgdGhpcy5sID0gK2w7XG4gIH1cblxuICB2YXIgX19fX3Byb3RvdHlwZSA9IEhjbC5wcm90b3R5cGUgPSBuZXcgQ29sb3I7XG5cbiAgX19fX3Byb3RvdHlwZS5icmlnaHRlciA9IGZ1bmN0aW9uKGspIHtcbiAgICByZXR1cm4gbmV3IEhjbCh0aGlzLmgsIHRoaXMuYywgdGhpcy5sICsgS24gKiAoayA9PSBudWxsID8gMSA6IGspKTtcbiAgfTtcblxuICBfX19fcHJvdG90eXBlLmRhcmtlciA9IGZ1bmN0aW9uKGspIHtcbiAgICByZXR1cm4gbmV3IEhjbCh0aGlzLmgsIHRoaXMuYywgdGhpcy5sIC0gS24gKiAoayA9PSBudWxsID8gMSA6IGspKTtcbiAgfTtcblxuICBfX19fcHJvdG90eXBlLnJnYiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBsYWIodGhpcykucmdiKCk7XG4gIH07XG5cbiAgdmFyIGxhYiA9IGZ1bmN0aW9uKGwsIGEsIGIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKGwgaW5zdGFuY2VvZiBMYWIpIHtcbiAgICAgICAgYiA9IGwuYjtcbiAgICAgICAgYSA9IGwuYTtcbiAgICAgICAgbCA9IGwubDtcbiAgICAgIH0gZWxzZSBpZiAobCBpbnN0YW5jZW9mIEhjbCkge1xuICAgICAgICB2YXIgaCA9IGwuaCAqIGRlZzJyYWQ7XG4gICAgICAgIGIgPSBNYXRoLnNpbihoKSAqIGwuYztcbiAgICAgICAgYSA9IE1hdGguY29zKGgpICogbC5jO1xuICAgICAgICBsID0gbC5sO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCEobCBpbnN0YW5jZW9mIFJnYikpIGwgPSByZ2IobCk7XG4gICAgICAgIHZhciByID0gcmdiMnh5eihsLnIpLFxuICAgICAgICAgICAgZyA9IHJnYjJ4eXoobC5nKSxcbiAgICAgICAgICAgIGIgPSByZ2IyeHl6KGwuYiksXG4gICAgICAgICAgICB4ID0geHl6MmxhYigoMC40MTI0NTY0ICogciArIDAuMzU3NTc2MSAqIGcgKyAwLjE4MDQzNzUgKiBiKSAvIFhuKSxcbiAgICAgICAgICAgIHkgPSB4eXoybGFiKCgwLjIxMjY3MjkgKiByICsgMC43MTUxNTIyICogZyArIDAuMDcyMTc1MCAqIGIpIC8gWW4pLFxuICAgICAgICAgICAgeiA9IHh5ejJsYWIoKDAuMDE5MzMzOSAqIHIgKyAwLjExOTE5MjAgKiBnICsgMC45NTAzMDQxICogYikgLyBabik7XG4gICAgICAgIGIgPSAyMDAgKiAoeSAtIHopO1xuICAgICAgICBhID0gNTAwICogKHggLSB5KTtcbiAgICAgICAgbCA9IDExNiAqIHkgLSAxNjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBMYWIobCwgYSwgYik7XG4gIH1cbiAgbGFiLnByb3RvdHlwZSA9IExhYi5wcm90b3R5cGU7XG4gIHZhciByYWQyZGVnID0gMTgwIC8gTWF0aC5QSTtcblxuICB2YXIgaGNsID0gZnVuY3Rpb24oaCwgYywgbCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoaCBpbnN0YW5jZW9mIEhjbCkge1xuICAgICAgICBsID0gaC5sO1xuICAgICAgICBjID0gaC5jO1xuICAgICAgICBoID0gaC5oO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCEoaCBpbnN0YW5jZW9mIExhYikpIGggPSBsYWIoaCk7XG4gICAgICAgIGwgPSBoLmw7XG4gICAgICAgIGMgPSBNYXRoLnNxcnQoaC5hICogaC5hICsgaC5iICogaC5iKTtcbiAgICAgICAgaCA9IE1hdGguYXRhbjIoaC5iLCBoLmEpICogcmFkMmRlZztcbiAgICAgICAgaWYgKGggPCAwKSBoICs9IDM2MDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBIY2woaCwgYywgbCk7XG4gIH1cbiAgaGNsLnByb3RvdHlwZSA9IEhjbC5wcm90b3R5cGU7XG5cbiAgZnVuY3Rpb24gQ3ViZWhlbGl4KGgsIHMsIGwpIHtcbiAgICB0aGlzLmggPSAraDtcbiAgICB0aGlzLnMgPSArcztcbiAgICB0aGlzLmwgPSArbDtcbiAgfVxuXG4gIHZhciBwcm90b3R5cGUgPSBDdWJlaGVsaXgucHJvdG90eXBlID0gbmV3IENvbG9yO1xuXG4gIHByb3RvdHlwZS5icmlnaHRlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gYnJpZ2h0ZXIgOiBNYXRoLnBvdyhicmlnaHRlciwgayk7XG4gICAgcmV0dXJuIG5ldyBDdWJlaGVsaXgodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGspO1xuICB9O1xuXG4gIHByb3RvdHlwZS5kYXJrZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBDdWJlaGVsaXgodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGspO1xuICB9O1xuXG4gIHZhciBnYW1tYSA9IDEsIC8vIERlZmF1bHQgZ2FtbWEuIFRPRE8gQ3VzdG9taXplLlxuICAgICAgQSA9IC0wLjE0ODYxLFxuICAgICAgQiA9ICsxLjc4Mjc3LFxuICAgICAgQyA9IC0wLjI5MjI3LFxuICAgICAgRCA9IC0wLjkwNjQ5LFxuICAgICAgRSA9ICsxLjk3Mjk0LFxuICAgICAgRUQgPSBFICogRCxcbiAgICAgIEVCID0gRSAqIEIsXG4gICAgICBCQ19EQSA9IEIgKiBDIC0gRCAqIEE7XG5cbiAgdmFyIGN1YmVoZWxpeCA9IGZ1bmN0aW9uKGgsIHMsIGwpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKGggaW5zdGFuY2VvZiBDdWJlaGVsaXgpIHtcbiAgICAgICAgbCA9IGgubDtcbiAgICAgICAgcyA9IGgucztcbiAgICAgICAgaCA9IGguaDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghKGggaW5zdGFuY2VvZiBSZ2IpKSBoID0gcmdiKGgpO1xuICAgICAgICB2YXIgciA9IGguciAvIDI1NSwgZyA9IGguZyAvIDI1NSwgYiA9IGguYiAvIDI1NTtcbiAgICAgICAgbCA9IChCQ19EQSAqIGIgKyBFRCAqIHIgLSBFQiAqIGcpIC8gKEJDX0RBICsgRUQgLSBFQik7XG4gICAgICAgIHZhciBibCA9IGIgLSBsLCBrID0gKEUgKiAoZyAtIGwpIC0gQyAqIGJsKSAvIEQsIGxnYW1tYSA9IE1hdGgucG93KGwsIGdhbW1hKTtcbiAgICAgICAgcyA9IE1hdGguc3FydChrICogayArIGJsICogYmwpIC8gKEUgKiBsZ2FtbWEgKiAoMSAtIGxnYW1tYSkpOyAvLyBOYU4gaWYgbGdhbW1hPTAgb3IgbGdhbW1hPTFcbiAgICAgICAgaCA9IHMgPyBNYXRoLmF0YW4yKGssIGJsKSAqIHJhZDJkZWcgLSAxMjAgOiBOYU47XG4gICAgICAgIGlmIChoIDwgMCkgaCArPSAzNjA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ3ViZWhlbGl4KGgsIHMsIGwpO1xuICB9XG5cbiAgcHJvdG90eXBlLnJnYiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBoID0gaXNOYU4odGhpcy5oKSA/IDAgOiAodGhpcy5oICsgMTIwKSAqIGRlZzJyYWQsXG4gICAgICAgIGwgPSBNYXRoLnBvdyh0aGlzLmwsIGdhbW1hKSxcbiAgICAgICAgYSA9IGlzTmFOKHRoaXMucykgPyAwIDogdGhpcy5zICogbCAqICgxIC0gbCksXG4gICAgICAgIGNvc2ggPSBNYXRoLmNvcyhoKSxcbiAgICAgICAgc2luaCA9IE1hdGguc2luKGgpO1xuICAgIHJldHVybiBuZXcgUmdiKFxuICAgICAgMjU1ICogKGwgKyBhICogKEEgKiBjb3NoICsgQiAqIHNpbmgpKSxcbiAgICAgIDI1NSAqIChsICsgYSAqIChDICogY29zaCArIEQgKiBzaW5oKSksXG4gICAgICAyNTUgKiAobCArIGEgKiAoRSAqIGNvc2gpKVxuICAgICk7XG4gIH07XG4gIGN1YmVoZWxpeC5wcm90b3R5cGUgPSBDdWJlaGVsaXgucHJvdG90eXBlO1xuXG4gIHZhciBpbnRlcnBvbGF0ZUN1YmVoZWxpeExvbmcgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgYSA9IGN1YmVoZWxpeChhKTtcbiAgICBiID0gY3ViZWhlbGl4KGIpO1xuICAgIHZhciBhaCA9IGlzTmFOKGEuaCkgPyBiLmggOiBhLmgsXG4gICAgICAgIGFzID0gaXNOYU4oYS5zKSA/IGIucyA6IGEucyxcbiAgICAgICAgYWwgPSBhLmwsXG4gICAgICAgIGJoID0gaXNOYU4oYi5oKSA/IDAgOiBiLmggLSBhaCxcbiAgICAgICAgYnMgPSBpc05hTihiLnMpID8gMCA6IGIucyAtIGFzLFxuICAgICAgICBibCA9IGIubCAtIGFsO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBhLmggPSBhaCArIGJoICogdDtcbiAgICAgIGEucyA9IGFzICsgYnMgKiB0O1xuICAgICAgYS5sID0gYWwgKyBibCAqIHQ7XG4gICAgICByZXR1cm4gYSArIFwiXCI7XG4gICAgfTtcbiAgfVxuICB2YXIgZGVsdGFIdWUgPSBmdW5jdGlvbihoLCBoMCkge1xuICAgIHZhciBkZWx0YSA9IChoIC0gaDApICUgMzYwO1xuICAgIHJldHVybiBkZWx0YSArIChkZWx0YSA+IDE4MCA/IC0zNjAgOiBkZWx0YSA8IC0xODAgPyAzNjAgOiAwKTtcbiAgfVxuXG4gIHZhciBpbnRlcnBvbGF0ZUN1YmVoZWxpeCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBhID0gY3ViZWhlbGl4KGEpO1xuICAgIGIgPSBjdWJlaGVsaXgoYik7XG4gICAgdmFyIGFoID0gaXNOYU4oYS5oKSA/IGIuaCA6IGEuaCxcbiAgICAgICAgYXMgPSBpc05hTihhLnMpID8gYi5zIDogYS5zLFxuICAgICAgICBhbCA9IGEubCxcbiAgICAgICAgYmggPSBpc05hTihiLmgpID8gMCA6IGRlbHRhSHVlKGIuaCwgYWgpLFxuICAgICAgICBicyA9IGlzTmFOKGIucykgPyAwIDogYi5zIC0gYXMsXG4gICAgICAgIGJsID0gYi5sIC0gYWw7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGEuaCA9IGFoICsgYmggKiB0O1xuICAgICAgYS5zID0gYXMgKyBicyAqIHQ7XG4gICAgICBhLmwgPSBhbCArIGJsICogdDtcbiAgICAgIHJldHVybiBhICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgdmFyIGludGVycG9sYXRlSGNsTG9uZyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBhID0gaGNsKGEpO1xuICAgIGIgPSBoY2woYik7XG4gICAgdmFyIGFoID0gaXNOYU4oYS5oKSA/IGIuaCA6IGEuaCxcbiAgICAgICAgYWMgPSBpc05hTihhLmMpID8gYi5jIDogYS5jLFxuICAgICAgICBhbCA9IGEubCxcbiAgICAgICAgYmggPSBpc05hTihiLmgpID8gMCA6IGIuaCAtIGFoLFxuICAgICAgICBiYyA9IGlzTmFOKGIuYykgPyAwIDogYi5jIC0gYWMsXG4gICAgICAgIGJsID0gYi5sIC0gYWw7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGEuaCA9IGFoICsgYmggKiB0O1xuICAgICAgYS5jID0gYWMgKyBiYyAqIHQ7XG4gICAgICBhLmwgPSBhbCArIGJsICogdDtcbiAgICAgIHJldHVybiBhICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgdmFyIGludGVycG9sYXRlSGNsID0gZnVuY3Rpb24oYSwgYikge1xuICAgIGEgPSBoY2woYSk7XG4gICAgYiA9IGhjbChiKTtcbiAgICB2YXIgYWggPSBpc05hTihhLmgpID8gYi5oIDogYS5oLFxuICAgICAgICBhYyA9IGlzTmFOKGEuYykgPyBiLmMgOiBhLmMsXG4gICAgICAgIGFsID0gYS5sLFxuICAgICAgICBiaCA9IGlzTmFOKGIuaCkgPyAwIDogZGVsdGFIdWUoYi5oLCBhaCksXG4gICAgICAgIGJjID0gaXNOYU4oYi5jKSA/IDAgOiBiLmMgLSBhYyxcbiAgICAgICAgYmwgPSBiLmwgLSBhbDtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgYS5oID0gYWggKyBiaCAqIHQ7XG4gICAgICBhLmMgPSBhYyArIGJjICogdDtcbiAgICAgIGEubCA9IGFsICsgYmwgKiB0O1xuICAgICAgcmV0dXJuIGEgKyBcIlwiO1xuICAgIH07XG4gIH1cblxuICB2YXIgaW50ZXJwb2xhdGVMYWIgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgYSA9IGxhYihhKTtcbiAgICBiID0gbGFiKGIpO1xuICAgIHZhciBhbCA9IGEubCxcbiAgICAgICAgYWEgPSBhLmEsXG4gICAgICAgIGFiID0gYS5iLFxuICAgICAgICBibCA9IGIubCAtIGFsLFxuICAgICAgICBiYSA9IGIuYSAtIGFhLFxuICAgICAgICBiYiA9IGIuYiAtIGFiO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBhLmwgPSBhbCArIGJsICogdDtcbiAgICAgIGEuYSA9IGFhICsgYmEgKiB0O1xuICAgICAgYS5iID0gYWIgKyBiYiAqIHQ7XG4gICAgICByZXR1cm4gYSArIFwiXCI7XG4gICAgfTtcbiAgfVxuXG4gIHZhciBpbnRlcnBvbGF0ZUhzbExvbmcgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgYSA9IGhzbChhKTtcbiAgICBiID0gaHNsKGIpO1xuICAgIHZhciBhaCA9IGlzTmFOKGEuaCkgPyBiLmggOiBhLmgsXG4gICAgICAgIGFzID0gaXNOYU4oYS5zKSA/IGIucyA6IGEucyxcbiAgICAgICAgYWwgPSBhLmwsXG4gICAgICAgIGJoID0gaXNOYU4oYi5oKSA/IDAgOiBiLmggLSBhaCxcbiAgICAgICAgYnMgPSBpc05hTihiLnMpID8gMCA6IGIucyAtIGFzLFxuICAgICAgICBibCA9IGIubCAtIGFsO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBhLmggPSBhaCArIGJoICogdDtcbiAgICAgIGEucyA9IGFzICsgYnMgKiB0O1xuICAgICAgYS5sID0gYWwgKyBibCAqIHQ7XG4gICAgICByZXR1cm4gYSArIFwiXCI7XG4gICAgfTtcbiAgfVxuXG4gIHZhciBpbnRlcnBvbGF0ZUhzbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBhID0gaHNsKGEpO1xuICAgIGIgPSBoc2woYik7XG4gICAgdmFyIGFoID0gaXNOYU4oYS5oKSA/IGIuaCA6IGEuaCxcbiAgICAgICAgYXMgPSBpc05hTihhLnMpID8gYi5zIDogYS5zLFxuICAgICAgICBhbCA9IGEubCxcbiAgICAgICAgYmggPSBpc05hTihiLmgpID8gMCA6IGRlbHRhSHVlKGIuaCwgYWgpLFxuICAgICAgICBicyA9IGlzTmFOKGIucykgPyAwIDogYi5zIC0gYXMsXG4gICAgICAgIGJsID0gYi5sIC0gYWw7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGEuaCA9IGFoICsgYmggKiB0O1xuICAgICAgYS5zID0gYXMgKyBicyAqIHQ7XG4gICAgICBhLmwgPSBhbCArIGJsICogdDtcbiAgICAgIHJldHVybiBhICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgdmFyIGludGVycG9sYXRlUmdiID0gZnVuY3Rpb24oYSwgYikge1xuICAgIGEgPSByZ2IoYSk7XG4gICAgYiA9IHJnYihiKTtcbiAgICB2YXIgYXIgPSBhLnIsXG4gICAgICAgIGFnID0gYS5nLFxuICAgICAgICBhYiA9IGEuYixcbiAgICAgICAgYnIgPSBiLnIgLSBhcixcbiAgICAgICAgYmcgPSBiLmcgLSBhZyxcbiAgICAgICAgYmIgPSBiLmIgLSBhYjtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgcmV0dXJuIGZvcm1hdChNYXRoLnJvdW5kKGFyICsgYnIgKiB0KSwgTWF0aC5yb3VuZChhZyArIGJnICogdCksIE1hdGgucm91bmQoYWIgKyBiYiAqIHQpKTtcbiAgICB9O1xuICB9XG5cbiAgZXhwb3J0cy5jb2xvciA9IGNvbG9yO1xuICBleHBvcnRzLnJnYiA9IHJnYjtcbiAgZXhwb3J0cy5oc2wgPSBoc2w7XG4gIGV4cG9ydHMubGFiID0gbGFiO1xuICBleHBvcnRzLmhjbCA9IGhjbDtcbiAgZXhwb3J0cy5jdWJlaGVsaXggPSBjdWJlaGVsaXg7XG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVSZ2IgPSBpbnRlcnBvbGF0ZVJnYjtcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUhzbCA9IGludGVycG9sYXRlSHNsO1xuICBleHBvcnRzLmludGVycG9sYXRlSHNsTG9uZyA9IGludGVycG9sYXRlSHNsTG9uZztcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUxhYiA9IGludGVycG9sYXRlTGFiO1xuICBleHBvcnRzLmludGVycG9sYXRlSGNsID0gaW50ZXJwb2xhdGVIY2w7XG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVIY2xMb25nID0gaW50ZXJwb2xhdGVIY2xMb25nO1xuICBleHBvcnRzLmludGVycG9sYXRlQ3ViZWhlbGl4ID0gaW50ZXJwb2xhdGVDdWJlaGVsaXg7XG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVDdWJlaGVsaXhMb25nID0gaW50ZXJwb2xhdGVDdWJlaGVsaXhMb25nO1xuXG59KSk7IiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICBmYWN0b3J5KChnbG9iYWwuZm9ybWF0ID0ge30pKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBwcmVmaXhlcyA9IFtcInlcIixcInpcIixcImFcIixcImZcIixcInBcIixcIm5cIixcIsK1XCIsXCJtXCIsXCJcIixcImtcIixcIk1cIixcIkdcIixcIlRcIixcIlBcIixcIkVcIixcIlpcIixcIllcIl07XG5cblxuICAvLyBDb21wdXRlcyB0aGUgZGVjaW1hbCBjb2VmZmljaWVudCBhbmQgZXhwb25lbnQgb2YgdGhlIHNwZWNpZmllZCBudW1iZXIgeCB3aXRoXG4gIC8vIHNpZ25pZmljYW50IGRpZ2l0cyBwLCB3aGVyZSB4IGlzIHBvc2l0aXZlIGFuZCBwIGlzIGluIFsxLCAyMV0gb3IgdW5kZWZpbmVkLlxuICAvLyBGb3IgZXhhbXBsZSwgZm9ybWF0RGVjaW1hbCgxLjIzKSByZXR1cm5zIFtcIjEyM1wiLCAwXS5cbiAgZnVuY3Rpb24gZm9ybWF0RGVjaW1hbCh4LCBwKSB7XG4gICAgaWYgKChpID0gKHggPSBwID8geC50b0V4cG9uZW50aWFsKHAgLSAxKSA6IHgudG9FeHBvbmVudGlhbCgpKS5pbmRleE9mKFwiZVwiKSkgPCAwKSByZXR1cm4gbnVsbDsgLy8gTmFOLCDCsUluZmluaXR5XG4gICAgdmFyIGksIGNvZWZmaWNpZW50ID0geC5zbGljZSgwLCBpKTtcblxuICAgIC8vIFRoZSBzdHJpbmcgcmV0dXJuZWQgYnkgdG9FeHBvbmVudGlhbCBlaXRoZXIgaGFzIHRoZSBmb3JtIFxcZFxcLlxcZCtlWy0rXVxcZCtcbiAgICAvLyAoZS5nLiwgMS4yZSszKSBvciB0aGUgZm9ybSBcXGRlWy0rXVxcZCsgKGUuZy4sIDFlKzMpLlxuICAgIHJldHVybiBbXG4gICAgICBjb2VmZmljaWVudC5sZW5ndGggPiAxID8gY29lZmZpY2llbnRbMF0gKyBjb2VmZmljaWVudC5zbGljZSgyKSA6IGNvZWZmaWNpZW50LFxuICAgICAgK3guc2xpY2UoaSArIDEpXG4gICAgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGV4cG9uZW50KHgpIHtcbiAgICByZXR1cm4geCA9IGZvcm1hdERlY2ltYWwoTWF0aC5hYnMoeCkpLCB4ID8geFsxXSA6IE5hTjtcbiAgfVxuXG4gIHZhciBwcmVmaXhFeHBvbmVudDtcblxuICBmdW5jdGlvbiBmb3JtYXRQcmVmaXhBdXRvKHgsIHApIHtcbiAgICB2YXIgZCA9IGZvcm1hdERlY2ltYWwoeCwgcCk7XG4gICAgaWYgKCFkKSByZXR1cm4geCArIFwiXCI7XG4gICAgdmFyIGNvZWZmaWNpZW50ID0gZFswXSxcbiAgICAgICAgZXhwb25lbnQgPSBkWzFdLFxuICAgICAgICBpID0gZXhwb25lbnQgLSAocHJlZml4RXhwb25lbnQgPSBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCAvIDMpKSkgKiAzKSArIDEsXG4gICAgICAgIG4gPSBjb2VmZmljaWVudC5sZW5ndGg7XG4gICAgcmV0dXJuIGkgPT09IG4gPyBjb2VmZmljaWVudFxuICAgICAgICA6IGkgPiBuID8gY29lZmZpY2llbnQgKyBuZXcgQXJyYXkoaSAtIG4gKyAxKS5qb2luKFwiMFwiKVxuICAgICAgICA6IGkgPiAwID8gY29lZmZpY2llbnQuc2xpY2UoMCwgaSkgKyBcIi5cIiArIGNvZWZmaWNpZW50LnNsaWNlKGkpXG4gICAgICAgIDogXCIwLlwiICsgbmV3IEFycmF5KDEgLSBpKS5qb2luKFwiMFwiKSArIGZvcm1hdERlY2ltYWwoeCwgcCArIGkgLSAxKVswXTsgLy8gbGVzcyB0aGFuIDF5IVxuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0Um91bmRlZCh4LCBwKSB7XG4gICAgdmFyIGQgPSBmb3JtYXREZWNpbWFsKHgsIHApO1xuICAgIGlmICghZCkgcmV0dXJuIHggKyBcIlwiO1xuICAgIHZhciBjb2VmZmljaWVudCA9IGRbMF0sXG4gICAgICAgIGV4cG9uZW50ID0gZFsxXTtcbiAgICByZXR1cm4gZXhwb25lbnQgPCAwID8gXCIwLlwiICsgbmV3IEFycmF5KC1leHBvbmVudCkuam9pbihcIjBcIikgKyBjb2VmZmljaWVudFxuICAgICAgICA6IGNvZWZmaWNpZW50Lmxlbmd0aCA+IGV4cG9uZW50ICsgMSA/IGNvZWZmaWNpZW50LnNsaWNlKDAsIGV4cG9uZW50ICsgMSkgKyBcIi5cIiArIGNvZWZmaWNpZW50LnNsaWNlKGV4cG9uZW50ICsgMSlcbiAgICAgICAgOiBjb2VmZmljaWVudCArIG5ldyBBcnJheShleHBvbmVudCAtIGNvZWZmaWNpZW50Lmxlbmd0aCArIDIpLmpvaW4oXCIwXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0RGVmYXVsdCh4LCBwKSB7XG4gICAgeCA9IHgudG9QcmVjaXNpb24ocCk7XG5cbiAgICBvdXQ6IGZvciAodmFyIG4gPSB4Lmxlbmd0aCwgaSA9IDEsIGkwID0gLTEsIGkxOyBpIDwgbjsgKytpKSB7XG4gICAgICBzd2l0Y2ggKHhbaV0pIHtcbiAgICAgICAgY2FzZSBcIi5cIjogaTAgPSBpMSA9IGk7IGJyZWFrO1xuICAgICAgICBjYXNlIFwiMFwiOiBpZiAoaTAgPT09IDApIGkwID0gaTsgaTEgPSBpOyBicmVhaztcbiAgICAgICAgY2FzZSBcImVcIjogYnJlYWsgb3V0O1xuICAgICAgICBkZWZhdWx0OiBpZiAoaTAgPiAwKSBpMCA9IDA7IGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpMCA+IDAgPyB4LnNsaWNlKDAsIGkwKSArIHguc2xpY2UoaTEgKyAxKSA6IHg7XG4gIH1cblxuICB2YXIgZm9ybWF0VHlwZXMgPSB7XG4gICAgXCJcIjogZm9ybWF0RGVmYXVsdCxcbiAgICBcIiVcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4gKHggKiAxMDApLnRvRml4ZWQocCk7IH0sXG4gICAgXCJiXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMik7IH0sXG4gICAgXCJjXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKyBcIlwiOyB9LFxuICAgIFwiZFwiOiBmdW5jdGlvbih4KSB7IHJldHVybiBNYXRoLnJvdW5kKHgpLnRvU3RyaW5nKDEwKTsgfSxcbiAgICBcImVcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4geC50b0V4cG9uZW50aWFsKHApOyB9LFxuICAgIFwiZlwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiB4LnRvRml4ZWQocCk7IH0sXG4gICAgXCJnXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuIHgudG9QcmVjaXNpb24ocCk7IH0sXG4gICAgXCJvXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoOCk7IH0sXG4gICAgXCJwXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuIGZvcm1hdFJvdW5kZWQoeCAqIDEwMCwgcCk7IH0sXG4gICAgXCJyXCI6IGZvcm1hdFJvdW5kZWQsXG4gICAgXCJzXCI6IGZvcm1hdFByZWZpeEF1dG8sXG4gICAgXCJYXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7IH0sXG4gICAgXCJ4XCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTYpOyB9XG4gIH07XG5cblxuICAvLyBbW2ZpbGxdYWxpZ25dW3NpZ25dW3N5bWJvbF1bMF1bd2lkdGhdWyxdWy5wcmVjaXNpb25dW3R5cGVdXG4gIHZhciByZSA9IC9eKD86KC4pPyhbPD49Xl0pKT8oWytcXC1cXCggXSk/KFskI10pPygwKT8oXFxkKyk/KCwpPyhcXC5cXGQrKT8oW2EteiVdKT8kL2k7XG5cbiAgZnVuY3Rpb24gRm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcikge1xuICAgIGlmICghKG1hdGNoID0gcmUuZXhlYyhzcGVjaWZpZXIpKSkgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBmb3JtYXQ6IFwiICsgc3BlY2lmaWVyKTtcblxuICAgIHZhciBtYXRjaCxcbiAgICAgICAgZmlsbCA9IG1hdGNoWzFdIHx8IFwiIFwiLFxuICAgICAgICBhbGlnbiA9IG1hdGNoWzJdIHx8IFwiPlwiLFxuICAgICAgICBzaWduID0gbWF0Y2hbM10gfHwgXCItXCIsXG4gICAgICAgIHN5bWJvbCA9IG1hdGNoWzRdIHx8IFwiXCIsXG4gICAgICAgIHplcm8gPSAhIW1hdGNoWzVdLFxuICAgICAgICB3aWR0aCA9IG1hdGNoWzZdICYmICttYXRjaFs2XSxcbiAgICAgICAgY29tbWEgPSAhIW1hdGNoWzddLFxuICAgICAgICBwcmVjaXNpb24gPSBtYXRjaFs4XSAmJiArbWF0Y2hbOF0uc2xpY2UoMSksXG4gICAgICAgIHR5cGUgPSBtYXRjaFs5XSB8fCBcIlwiO1xuXG4gICAgLy8gVGhlIFwiblwiIHR5cGUgaXMgYW4gYWxpYXMgZm9yIFwiLGdcIi5cbiAgICBpZiAodHlwZSA9PT0gXCJuXCIpIGNvbW1hID0gdHJ1ZSwgdHlwZSA9IFwiZ1wiO1xuXG4gICAgLy8gTWFwIGludmFsaWQgdHlwZXMgdG8gdGhlIGRlZmF1bHQgZm9ybWF0LlxuICAgIGVsc2UgaWYgKCFmb3JtYXRUeXBlc1t0eXBlXSkgdHlwZSA9IFwiXCI7XG5cbiAgICAvLyBJZiB6ZXJvIGZpbGwgaXMgc3BlY2lmaWVkLCBwYWRkaW5nIGdvZXMgYWZ0ZXIgc2lnbiBhbmQgYmVmb3JlIGRpZ2l0cy5cbiAgICBpZiAoemVybyB8fCAoZmlsbCA9PT0gXCIwXCIgJiYgYWxpZ24gPT09IFwiPVwiKSkgemVybyA9IHRydWUsIGZpbGwgPSBcIjBcIiwgYWxpZ24gPSBcIj1cIjtcblxuICAgIHRoaXMuZmlsbCA9IGZpbGw7XG4gICAgdGhpcy5hbGlnbiA9IGFsaWduO1xuICAgIHRoaXMuc2lnbiA9IHNpZ247XG4gICAgdGhpcy5zeW1ib2wgPSBzeW1ib2w7XG4gICAgdGhpcy56ZXJvID0gemVybztcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5jb21tYSA9IGNvbW1hO1xuICAgIHRoaXMucHJlY2lzaW9uID0gcHJlY2lzaW9uO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gIH1cblxuICBGb3JtYXRTcGVjaWZpZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsbFxuICAgICAgICArIHRoaXMuYWxpZ25cbiAgICAgICAgKyB0aGlzLnNpZ25cbiAgICAgICAgKyB0aGlzLnN5bWJvbFxuICAgICAgICArICh0aGlzLnplcm8gPyBcIjBcIiA6IFwiXCIpXG4gICAgICAgICsgKHRoaXMud2lkdGggPT0gbnVsbCA/IFwiXCIgOiBNYXRoLm1heCgxLCB0aGlzLndpZHRoIHwgMCkpXG4gICAgICAgICsgKHRoaXMuY29tbWEgPyBcIixcIiA6IFwiXCIpXG4gICAgICAgICsgKHRoaXMucHJlY2lzaW9uID09IG51bGwgPyBcIlwiIDogXCIuXCIgKyBNYXRoLm1heCgwLCB0aGlzLnByZWNpc2lvbiB8IDApKVxuICAgICAgICArIHRoaXMudHlwZTtcbiAgfTtcblxuICBmdW5jdGlvbiBmb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKSB7XG4gICAgcmV0dXJuIG5ldyBGb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlkZW50aXR5KHgpIHtcbiAgICByZXR1cm4geDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdEdyb3VwKGdyb3VwaW5nLCB0aG91c2FuZHMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUsIHdpZHRoKSB7XG4gICAgICB2YXIgaSA9IHZhbHVlLmxlbmd0aCxcbiAgICAgICAgICB0ID0gW10sXG4gICAgICAgICAgaiA9IDAsXG4gICAgICAgICAgZyA9IGdyb3VwaW5nWzBdLFxuICAgICAgICAgIGxlbmd0aCA9IDA7XG5cbiAgICAgIHdoaWxlIChpID4gMCAmJiBnID4gMCkge1xuICAgICAgICBpZiAobGVuZ3RoICsgZyArIDEgPiB3aWR0aCkgZyA9IE1hdGgubWF4KDEsIHdpZHRoIC0gbGVuZ3RoKTtcbiAgICAgICAgdC5wdXNoKHZhbHVlLnN1YnN0cmluZyhpIC09IGcsIGkgKyBnKSk7XG4gICAgICAgIGlmICgobGVuZ3RoICs9IGcgKyAxKSA+IHdpZHRoKSBicmVhaztcbiAgICAgICAgZyA9IGdyb3VwaW5nW2ogPSAoaiArIDEpICUgZ3JvdXBpbmcubGVuZ3RoXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHQucmV2ZXJzZSgpLmpvaW4odGhvdXNhbmRzKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gbG9jYWxlRm9ybWF0KGxvY2FsZSkge1xuICAgIHZhciBncm91cCA9IGxvY2FsZS5ncm91cGluZyAmJiBsb2NhbGUudGhvdXNhbmRzID8gZm9ybWF0R3JvdXAobG9jYWxlLmdyb3VwaW5nLCBsb2NhbGUudGhvdXNhbmRzKSA6IGlkZW50aXR5LFxuICAgICAgICBjdXJyZW5jeSA9IGxvY2FsZS5jdXJyZW5jeSxcbiAgICAgICAgZGVjaW1hbCA9IGxvY2FsZS5kZWNpbWFsO1xuXG4gICAgZnVuY3Rpb24gZm9ybWF0KHNwZWNpZmllcikge1xuICAgICAgc3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcik7XG5cbiAgICAgIHZhciBmaWxsID0gc3BlY2lmaWVyLmZpbGwsXG4gICAgICAgICAgYWxpZ24gPSBzcGVjaWZpZXIuYWxpZ24sXG4gICAgICAgICAgc2lnbiA9IHNwZWNpZmllci5zaWduLFxuICAgICAgICAgIHN5bWJvbCA9IHNwZWNpZmllci5zeW1ib2wsXG4gICAgICAgICAgemVybyA9IHNwZWNpZmllci56ZXJvLFxuICAgICAgICAgIHdpZHRoID0gc3BlY2lmaWVyLndpZHRoLFxuICAgICAgICAgIGNvbW1hID0gc3BlY2lmaWVyLmNvbW1hLFxuICAgICAgICAgIHByZWNpc2lvbiA9IHNwZWNpZmllci5wcmVjaXNpb24sXG4gICAgICAgICAgdHlwZSA9IHNwZWNpZmllci50eXBlO1xuXG4gICAgICAvLyBDb21wdXRlIHRoZSBwcmVmaXggYW5kIHN1ZmZpeC5cbiAgICAgIC8vIEZvciBTSS1wcmVmaXgsIHRoZSBzdWZmaXggaXMgbGF6aWx5IGNvbXB1dGVkLlxuICAgICAgdmFyIHByZWZpeCA9IHN5bWJvbCA9PT0gXCIkXCIgPyBjdXJyZW5jeVswXSA6IHN5bWJvbCA9PT0gXCIjXCIgJiYgL1tib3hYXS8udGVzdCh0eXBlKSA/IFwiMFwiICsgdHlwZS50b0xvd2VyQ2FzZSgpIDogXCJcIixcbiAgICAgICAgICBzdWZmaXggPSBzeW1ib2wgPT09IFwiJFwiID8gY3VycmVuY3lbMV0gOiAvWyVwXS8udGVzdCh0eXBlKSA/IFwiJVwiIDogXCJcIjtcblxuICAgICAgLy8gV2hhdCBmb3JtYXQgZnVuY3Rpb24gc2hvdWxkIHdlIHVzZT9cbiAgICAgIC8vIElzIHRoaXMgYW4gaW50ZWdlciB0eXBlP1xuICAgICAgLy8gQ2FuIHRoaXMgdHlwZSBnZW5lcmF0ZSBleHBvbmVudGlhbCBub3RhdGlvbj9cbiAgICAgIHZhciBmb3JtYXRUeXBlID0gZm9ybWF0VHlwZXNbdHlwZV0sXG4gICAgICAgICAgbWF5YmVTdWZmaXggPSAhdHlwZSB8fCAvW2RlZmdwcnMlXS8udGVzdCh0eXBlKTtcblxuICAgICAgLy8gU2V0IHRoZSBkZWZhdWx0IHByZWNpc2lvbiBpZiBub3Qgc3BlY2lmaWVkLFxuICAgICAgLy8gb3IgY2xhbXAgdGhlIHNwZWNpZmllZCBwcmVjaXNpb24gdG8gdGhlIHN1cHBvcnRlZCByYW5nZS5cbiAgICAgIC8vIEZvciBzaWduaWZpY2FudCBwcmVjaXNpb24sIGl0IG11c3QgYmUgaW4gWzEsIDIxXS5cbiAgICAgIC8vIEZvciBmaXhlZCBwcmVjaXNpb24sIGl0IG11c3QgYmUgaW4gWzAsIDIwXS5cbiAgICAgIHByZWNpc2lvbiA9IHByZWNpc2lvbiA9PSBudWxsID8gKHR5cGUgPyA2IDogMTIpXG4gICAgICAgICAgOiAvW2dwcnNdLy50ZXN0KHR5cGUpID8gTWF0aC5tYXgoMSwgTWF0aC5taW4oMjEsIHByZWNpc2lvbikpXG4gICAgICAgICAgOiBNYXRoLm1heCgwLCBNYXRoLm1pbigyMCwgcHJlY2lzaW9uKSk7XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICB2YXIgdmFsdWVQcmVmaXggPSBwcmVmaXgsXG4gICAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IHN1ZmZpeDtcblxuICAgICAgICBpZiAodHlwZSA9PT0gXCJjXCIpIHtcbiAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IGZvcm1hdFR5cGUodmFsdWUpICsgdmFsdWVTdWZmaXg7XG4gICAgICAgICAgdmFsdWUgPSBcIlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gK3ZhbHVlO1xuXG4gICAgICAgICAgLy8gQ29udmVydCBuZWdhdGl2ZSB0byBwb3NpdGl2ZSwgYW5kIGNvbXB1dGUgdGhlIHByZWZpeC5cbiAgICAgICAgICAvLyBOb3RlIHRoYXQgLTAgaXMgbm90IGxlc3MgdGhhbiAwLCBidXQgMSAvIC0wIGlzIVxuICAgICAgICAgIHZhciB2YWx1ZU5lZ2F0aXZlID0gKHZhbHVlIDwgMCB8fCAxIC8gdmFsdWUgPCAwKSAmJiAodmFsdWUgKj0gLTEsIHRydWUpO1xuXG4gICAgICAgICAgLy8gUGVyZm9ybSB0aGUgaW5pdGlhbCBmb3JtYXR0aW5nLlxuICAgICAgICAgIHZhbHVlID0gZm9ybWF0VHlwZSh2YWx1ZSwgcHJlY2lzaW9uKTtcblxuICAgICAgICAgIC8vIENvbXB1dGUgdGhlIHByZWZpeCBhbmQgc3VmZml4LlxuICAgICAgICAgIHZhbHVlUHJlZml4ID0gKHZhbHVlTmVnYXRpdmUgPyAoc2lnbiA9PT0gXCIoXCIgPyBzaWduIDogXCItXCIpIDogc2lnbiA9PT0gXCItXCIgfHwgc2lnbiA9PT0gXCIoXCIgPyBcIlwiIDogc2lnbikgKyB2YWx1ZVByZWZpeDtcbiAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IHZhbHVlU3VmZml4ICsgKHR5cGUgPT09IFwic1wiID8gcHJlZml4ZXNbOCArIHByZWZpeEV4cG9uZW50IC8gM10gOiBcIlwiKSArICh2YWx1ZU5lZ2F0aXZlICYmIHNpZ24gPT09IFwiKFwiID8gXCIpXCIgOiBcIlwiKTtcblxuICAgICAgICAgIC8vIEJyZWFrIHRoZSBmb3JtYXR0ZWQgdmFsdWUgaW50byB0aGUgaW50ZWdlciDigJx2YWx1ZeKAnSBwYXJ0IHRoYXQgY2FuIGJlXG4gICAgICAgICAgLy8gZ3JvdXBlZCwgYW5kIGZyYWN0aW9uYWwgb3IgZXhwb25lbnRpYWwg4oCcc3VmZml44oCdIHBhcnQgdGhhdCBpcyBub3QuXG4gICAgICAgICAgaWYgKG1heWJlU3VmZml4KSB7XG4gICAgICAgICAgICB2YXIgaSA9IC0xLCBuID0gdmFsdWUubGVuZ3RoLCBjO1xuICAgICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgICAgaWYgKGMgPSB2YWx1ZS5jaGFyQ29kZUF0KGkpLCA0OCA+IGMgfHwgYyA+IDU3KSB7XG4gICAgICAgICAgICAgICAgdmFsdWVTdWZmaXggPSAoYyA9PT0gNDYgPyBkZWNpbWFsICsgdmFsdWUuc2xpY2UoaSArIDEpIDogdmFsdWUuc2xpY2UoaSkpICsgdmFsdWVTdWZmaXg7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgwLCBpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSBmaWxsIGNoYXJhY3RlciBpcyBub3QgXCIwXCIsIGdyb3VwaW5nIGlzIGFwcGxpZWQgYmVmb3JlIHBhZGRpbmcuXG4gICAgICAgIGlmIChjb21tYSAmJiAhemVybykgdmFsdWUgPSBncm91cCh2YWx1ZSwgSW5maW5pdHkpO1xuXG4gICAgICAgIC8vIENvbXB1dGUgdGhlIHBhZGRpbmcuXG4gICAgICAgIHZhciBsZW5ndGggPSB2YWx1ZVByZWZpeC5sZW5ndGggKyB2YWx1ZS5sZW5ndGggKyB2YWx1ZVN1ZmZpeC5sZW5ndGgsXG4gICAgICAgICAgICBwYWRkaW5nID0gbGVuZ3RoIDwgd2lkdGggPyBuZXcgQXJyYXkod2lkdGggLSBsZW5ndGggKyAxKS5qb2luKGZpbGwpIDogXCJcIjtcblxuICAgICAgICAvLyBJZiB0aGUgZmlsbCBjaGFyYWN0ZXIgaXMgXCIwXCIsIGdyb3VwaW5nIGlzIGFwcGxpZWQgYWZ0ZXIgcGFkZGluZy5cbiAgICAgICAgaWYgKGNvbW1hICYmIHplcm8pIHZhbHVlID0gZ3JvdXAocGFkZGluZyArIHZhbHVlLCBwYWRkaW5nLmxlbmd0aCA/IHdpZHRoIC0gdmFsdWVTdWZmaXgubGVuZ3RoIDogSW5maW5pdHkpLCBwYWRkaW5nID0gXCJcIjtcblxuICAgICAgICAvLyBSZWNvbnN0cnVjdCB0aGUgZmluYWwgb3V0cHV0IGJhc2VkIG9uIHRoZSBkZXNpcmVkIGFsaWdubWVudC5cbiAgICAgICAgc3dpdGNoIChhbGlnbikge1xuICAgICAgICAgIGNhc2UgXCI8XCI6IHJldHVybiB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXggKyBwYWRkaW5nO1xuICAgICAgICAgIGNhc2UgXCI9XCI6IHJldHVybiB2YWx1ZVByZWZpeCArIHBhZGRpbmcgKyB2YWx1ZSArIHZhbHVlU3VmZml4O1xuICAgICAgICAgIGNhc2UgXCJeXCI6IHJldHVybiBwYWRkaW5nLnNsaWNlKDAsIGxlbmd0aCA9IHBhZGRpbmcubGVuZ3RoID4+IDEpICsgdmFsdWVQcmVmaXggKyB2YWx1ZSArIHZhbHVlU3VmZml4ICsgcGFkZGluZy5zbGljZShsZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYWRkaW5nICsgdmFsdWVQcmVmaXggKyB2YWx1ZSArIHZhbHVlU3VmZml4O1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRQcmVmaXgoc3BlY2lmaWVyLCB2YWx1ZSkge1xuICAgICAgdmFyIGYgPSBmb3JtYXQoKHNwZWNpZmllciA9IGZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpLCBzcGVjaWZpZXIudHlwZSA9IFwiZlwiLCBzcGVjaWZpZXIpKSxcbiAgICAgICAgICBlID0gTWF0aC5tYXgoLTgsIE1hdGgubWluKDgsIE1hdGguZmxvb3IoZXhwb25lbnQodmFsdWUpIC8gMykpKSAqIDMsXG4gICAgICAgICAgayA9IE1hdGgucG93KDEwLCAtZSksXG4gICAgICAgICAgcHJlZml4ID0gcHJlZml4ZXNbOCArIGUgLyAzXTtcbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZihrICogdmFsdWUpICsgcHJlZml4O1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZm9ybWF0OiBmb3JtYXQsXG4gICAgICBmb3JtYXRQcmVmaXg6IGZvcm1hdFByZWZpeFxuICAgIH07XG4gIH1cblxuICB2YXIgbG9jYWxlID0gbG9jYWxlRm9ybWF0KHtcbiAgICBkZWNpbWFsOiBcIi5cIixcbiAgICB0aG91c2FuZHM6IFwiLFwiLFxuICAgIGdyb3VwaW5nOiBbM10sXG4gICAgY3VycmVuY3k6IFtcIiRcIiwgXCJcIl1cbiAgfSk7XG5cbiAgZXhwb3J0cy5mb3JtYXQgPSBsb2NhbGUuZm9ybWF0O1xuICBleHBvcnRzLmZvcm1hdFByZWZpeCA9IGxvY2FsZS5mb3JtYXRQcmVmaXg7XG5cbiAgZnVuY3Rpb24gcHJlY2lzaW9uUm91bmQoc3RlcCwgbWF4KSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KDAsIGV4cG9uZW50KE1hdGguYWJzKG1heCkpIC0gZXhwb25lbnQoTWF0aC5hYnMoc3RlcCkpKSArIDE7XG4gIH1cblxuICBmdW5jdGlvbiBwcmVjaXNpb25QcmVmaXgoc3RlcCwgdmFsdWUpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5tYXgoLTgsIE1hdGgubWluKDgsIE1hdGguZmxvb3IoZXhwb25lbnQodmFsdWUpIC8gMykpKSAqIDMgLSBleHBvbmVudChNYXRoLmFicyhzdGVwKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJlY2lzaW9uRml4ZWQoc3RlcCkge1xuICAgIHJldHVybiBNYXRoLm1heCgwLCAtZXhwb25lbnQoTWF0aC5hYnMoc3RlcCkpKTtcbiAgfVxuXG4gIGV4cG9ydHMuZm9ybWF0U3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyO1xuICBleHBvcnRzLmxvY2FsZUZvcm1hdCA9IGxvY2FsZUZvcm1hdDtcbiAgZXhwb3J0cy5wcmVjaXNpb25GaXhlZCA9IHByZWNpc2lvbkZpeGVkO1xuICBleHBvcnRzLnByZWNpc2lvblByZWZpeCA9IHByZWNpc2lvblByZWZpeDtcbiAgZXhwb3J0cy5wcmVjaXNpb25Sb3VuZCA9IHByZWNpc2lvblJvdW5kO1xuXG59KSk7IiwiaWYgKHR5cGVvZiBNYXAgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgTWFwID0gZnVuY3Rpb24oKSB7IHRoaXMuY2xlYXIoKTsgfTtcbiAgTWFwLnByb3RvdHlwZSA9IHtcbiAgICBzZXQ6IGZ1bmN0aW9uKGssIHYpIHsgdGhpcy5fW2tdID0gdjsgcmV0dXJuIHRoaXM7IH0sXG4gICAgZ2V0OiBmdW5jdGlvbihrKSB7IHJldHVybiB0aGlzLl9ba107IH0sXG4gICAgaGFzOiBmdW5jdGlvbihrKSB7IHJldHVybiBrIGluIHRoaXMuXzsgfSxcbiAgICBkZWxldGU6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIGsgaW4gdGhpcy5fICYmIGRlbGV0ZSB0aGlzLl9ba107IH0sXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkgeyB0aGlzLl8gPSBPYmplY3QuY3JlYXRlKG51bGwpOyB9LFxuICAgIGdldCBzaXplKCkgeyB2YXIgbiA9IDA7IGZvciAodmFyIGsgaW4gdGhpcy5fKSArK247IHJldHVybiBuOyB9LFxuICAgIGZvckVhY2g6IGZ1bmN0aW9uKGMpIHsgZm9yICh2YXIgayBpbiB0aGlzLl8pIGModGhpcy5fW2tdLCBrLCB0aGlzKTsgfVxuICB9O1xufSBlbHNlIChmdW5jdGlvbigpIHtcbiAgdmFyIG0gPSBuZXcgTWFwO1xuICBpZiAobS5zZXQoMCwgMCkgIT09IG0pIHtcbiAgICBtID0gbS5zZXQ7XG4gICAgTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbigpIHsgbS5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyByZXR1cm4gdGhpczsgfTtcbiAgfVxufSkoKTtcblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICBmYWN0b3J5KChnbG9iYWwudGltZUZvcm1hdCA9IHt9KSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICBmdW5jdGlvbiB1dGNEYXRlKGQpIHtcbiAgICBpZiAoMCA8PSBkLnkgJiYgZC55IDwgMTAwKSB7XG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDKC0xLCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKSk7XG4gICAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKGQueSk7XG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKGQueSwgZC5tLCBkLmQsIGQuSCwgZC5NLCBkLlMsIGQuTCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gbG9jYWxEYXRlKGQpIHtcbiAgICBpZiAoMCA8PSBkLnkgJiYgZC55IDwgMTAwKSB7XG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKC0xLCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKTtcbiAgICAgIGRhdGUuc2V0RnVsbFllYXIoZC55KTtcbiAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IERhdGUoZC55LCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKTtcbiAgfVxuXG4gIHZhciBwYWRzID0ge1wiLVwiOiBcIlwiLCBcIl9cIjogXCIgXCIsIFwiMFwiOiBcIjBcIn07XG5cbiAgZnVuY3Rpb24gbmV3WWVhcih5KSB7XG4gICAgcmV0dXJuIHt5OiB5LCBtOiAwLCBkOiAxLCBIOiAwLCBNOiAwLCBTOiAwLCBMOiAwfTtcbiAgfVxuXG4gIHZhciBwZXJjZW50UmUgPSAvXiUvO1xuXG4gIGZ1bmN0aW9uIHBhcnNlTGl0ZXJhbFBlcmNlbnQoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBwZXJjZW50UmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDEpKTtcbiAgICByZXR1cm4gbiA/IGkgKyBuWzBdLmxlbmd0aCA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2Vab25lKGQsIHN0cmluZywgaSkge1xuICAgIHJldHVybiAvXlsrLV1cXGR7NH0kLy50ZXN0KHN0cmluZyA9IHN0cmluZy5zbGljZShpLCBpICsgNSkpXG4gICAgICAgID8gKGQuWiA9IC1zdHJpbmcsIGkgKyA1KSAvLyBzaWduIGRpZmZlcnMgZnJvbSBnZXRUaW1lem9uZU9mZnNldCFcbiAgICAgICAgOiAtMTtcbiAgfVxuXG4gIHZhciBudW1iZXJSZSA9IC9eXFxzKlxcZCsvO1xuXG4gIGZ1bmN0aW9uIHBhcnNlV2Vla2RheU51bWJlcihkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAxKSk7XG4gICAgcmV0dXJuIG4gPyAoZC53ID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlV2Vla051bWJlclN1bmRheShkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICByZXR1cm4gbiA/IChkLlUgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VXZWVrTnVtYmVyTW9uZGF5KGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgIHJldHVybiBuID8gKGQuVyA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVllYXIoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICAgIHJldHVybiBuID8gKGQueSA9ICtuWzBdICsgKCtuWzBdID4gNjggPyAxOTAwIDogMjAwMCksIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlTW9udGhOdW1iZXIoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICAgIHJldHVybiBuID8gKGQubSA9IG5bMF0gLSAxLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZURheU9mTW9udGgoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICAgIHJldHVybiBuID8gKGQuZCA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZURheU9mWWVhcihkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAzKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5tID0gMCwgZC5kID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlSG91cjI0KGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgICByZXR1cm4gbiA/IChkLkggPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VNaW51dGVzKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgICByZXR1cm4gbiA/IChkLk0gPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VTZWNvbmRzKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgICByZXR1cm4gbiA/IChkLlMgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VNaWxsaXNlY29uZHMoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMykpO1xuICAgIHJldHVybiBuID8gKGQuTCA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUZ1bGxZZWFyKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDQpKTtcbiAgICByZXR1cm4gbiA/IChkLnkgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0TGl0ZXJhbFBlcmNlbnQoKSB7XG4gICAgcmV0dXJuIFwiJVwiO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDWm9uZSgpIHtcbiAgICByZXR1cm4gXCIrMDAwMFwiO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFkKHZhbHVlLCBmaWxsLCB3aWR0aCkge1xuICAgIHZhciBzaWduID0gdmFsdWUgPCAwID8gXCItXCIgOiBcIlwiLFxuICAgICAgICBzdHJpbmcgPSAoc2lnbiA/IC12YWx1ZSA6IHZhbHVlKSArIFwiXCIsXG4gICAgICAgIGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gICAgcmV0dXJuIHNpZ24gKyAobGVuZ3RoIDwgd2lkdGggPyBuZXcgQXJyYXkod2lkdGggLSBsZW5ndGggKyAxKS5qb2luKGZpbGwpICsgc3RyaW5nIDogc3RyaW5nKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ0Z1bGxZZWFyKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0VVRDRnVsbFllYXIoKSAlIDEwMDAwLCBwLCA0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ1llYXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENGdWxsWWVhcigpICUgMTAwLCBwLCAyKTtcbiAgfVxuXG4gIHZhciB0MSA9IG5ldyBEYXRlO1xuXG4gIHZhciB0MCA9IG5ldyBEYXRlO1xuXG4gIGZ1bmN0aW9uIG5ld0ludGVydmFsKGZsb29yaSwgb2Zmc2V0aSwgY291bnQpIHtcblxuICAgIGZ1bmN0aW9uIGludGVydmFsKGRhdGUpIHtcbiAgICAgIHJldHVybiBmbG9vcmkoZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKSksIGRhdGU7XG4gICAgfVxuXG4gICAgaW50ZXJ2YWwuZmxvb3IgPSBpbnRlcnZhbDtcblxuICAgIGludGVydmFsLnJvdW5kID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgdmFyIGQwID0gbmV3IERhdGUoK2RhdGUpLFxuICAgICAgICAgIGQxID0gbmV3IERhdGUoZGF0ZSAtIDEpO1xuICAgICAgZmxvb3JpKGQwKSwgZmxvb3JpKGQxKSwgb2Zmc2V0aShkMSwgMSk7XG4gICAgICByZXR1cm4gZGF0ZSAtIGQwIDwgZDEgLSBkYXRlID8gZDAgOiBkMTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwuY2VpbCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIHJldHVybiBmbG9vcmkoZGF0ZSA9IG5ldyBEYXRlKGRhdGUgLSAxKSksIG9mZnNldGkoZGF0ZSwgMSksIGRhdGU7XG4gICAgfTtcblxuICAgIGludGVydmFsLm9mZnNldCA9IGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgIHJldHVybiBvZmZzZXRpKGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSksIHN0ZXAgPT0gbnVsbCA/IDEgOiBNYXRoLmZsb29yKHN0ZXApKSwgZGF0ZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgICAgdmFyIHJhbmdlID0gW107XG4gICAgICBzdGFydCA9IG5ldyBEYXRlKHN0YXJ0IC0gMSk7XG4gICAgICBzdG9wID0gbmV3IERhdGUoK3N0b3ApO1xuICAgICAgc3RlcCA9IHN0ZXAgPT0gbnVsbCA/IDEgOiBNYXRoLmZsb29yKHN0ZXApO1xuICAgICAgaWYgKCEoc3RhcnQgPCBzdG9wKSB8fCAhKHN0ZXAgPiAwKSkgcmV0dXJuIHJhbmdlOyAvLyBhbHNvIGhhbmRsZXMgSW52YWxpZCBEYXRlXG4gICAgICBvZmZzZXRpKHN0YXJ0LCAxKSwgZmxvb3JpKHN0YXJ0KTtcbiAgICAgIGlmIChzdGFydCA8IHN0b3ApIHJhbmdlLnB1c2gobmV3IERhdGUoK3N0YXJ0KSk7XG4gICAgICB3aGlsZSAob2Zmc2V0aShzdGFydCwgc3RlcCksIGZsb29yaShzdGFydCksIHN0YXJ0IDwgc3RvcCkgcmFuZ2UucHVzaChuZXcgRGF0ZSgrc3RhcnQpKTtcbiAgICAgIHJldHVybiByYW5nZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwuZmlsdGVyID0gZnVuY3Rpb24odGVzdCkge1xuICAgICAgcmV0dXJuIG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgd2hpbGUgKGZsb29yaShkYXRlKSwgIXRlc3QoZGF0ZSkpIGRhdGUuc2V0VGltZShkYXRlIC0gMSk7XG4gICAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICAgIHdoaWxlICgtLXN0ZXAgPj0gMCkgd2hpbGUgKG9mZnNldGkoZGF0ZSwgMSksICF0ZXN0KGRhdGUpKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBpZiAoY291bnQpIGludGVydmFsLmNvdW50ID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgdDAuc2V0VGltZSgrc3RhcnQpLCB0MS5zZXRUaW1lKCtlbmQpO1xuICAgICAgZmxvb3JpKHQwKSwgZmxvb3JpKHQxKTtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKGNvdW50KHQwLCB0MSkpO1xuICAgIH07XG5cbiAgICByZXR1cm4gaW50ZXJ2YWw7XG4gIH1cblxuICB2YXIgdXRjWWVhciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0VVRDTW9udGgoMCwgMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIG9mZnNldCkge1xuICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoZGF0ZS5nZXRVVENGdWxsWWVhcigpICsgb2Zmc2V0KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0VVRDRnVsbFllYXIoKSAtIHN0YXJ0LmdldFVUQ0Z1bGxZZWFyKCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHV0Y1dlZWtkYXkoaSkge1xuICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpIC0gKGRhdGUuZ2V0VVRDRGF5KCkgKyA3IC0gaSkgJSA3KTtcbiAgICB9LCBmdW5jdGlvbihkYXRlLCBvZmZzZXQpIHtcbiAgICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIG9mZnNldCAqIDcpO1xuICAgIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gNjA0OGU1O1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIHV0Y01vbmRheSA9IHV0Y1dlZWtkYXkoMSk7XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDV2Vla051bWJlck1vbmRheShkLCBwKSB7XG4gICAgcmV0dXJuIHBhZCh1dGNNb25kYXkuY291bnQodXRjWWVhcihkKSwgZCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDV2Vla2RheU51bWJlcihkKSB7XG4gICAgcmV0dXJuIGQuZ2V0VVRDRGF5KCk7XG4gIH1cblxuICB2YXIgdXRjU3VuZGF5ID0gdXRjV2Vla2RheSgwKTtcblxuICBmdW5jdGlvbiBmb3JtYXRVVENXZWVrTnVtYmVyU3VuZGF5KGQsIHApIHtcbiAgICByZXR1cm4gcGFkKHV0Y1N1bmRheS5jb3VudCh1dGNZZWFyKGQpLCBkKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENTZWNvbmRzKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0VVRDU2Vjb25kcygpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ01pbnV0ZXMoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENNaW51dGVzKCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDTW9udGhOdW1iZXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENNb250aCgpICsgMSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENNaWxsaXNlY29uZHMoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENNaWxsaXNlY29uZHMoKSwgcCwgMyk7XG4gIH1cblxuICB2YXIgdXRjRGF5ID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIG9mZnNldCkge1xuICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIG9mZnNldCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDg2NGU1O1xuICB9KTtcblxuICBmdW5jdGlvbiBmb3JtYXRVVENEYXlPZlllYXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoMSArIHV0Y0RheS5jb3VudCh1dGNZZWFyKGQpLCBkKSwgcCwgMyk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENIb3VyMTIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENIb3VycygpICUgMTIgfHwgMTIsIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDSG91cjI0KGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0VVRDSG91cnMoKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENEYXlPZk1vbnRoKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0VVRDRGF0ZSgpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFpvbmUoZCkge1xuICAgIHZhciB6ID0gZC5nZXRUaW1lem9uZU9mZnNldCgpO1xuICAgIHJldHVybiAoeiA+IDAgPyBcIi1cIiA6ICh6ICo9IC0xLCBcIitcIikpXG4gICAgICAgICsgcGFkKHogLyA2MCB8IDAsIFwiMFwiLCAyKVxuICAgICAgICArIHBhZCh6ICUgNjAsIFwiMFwiLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdEZ1bGxZZWFyKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0RnVsbFllYXIoKSAlIDEwMDAwLCBwLCA0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFllYXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRGdWxsWWVhcigpICUgMTAwLCBwLCAyKTtcbiAgfVxuXG4gIHZhciB5ZWFyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXRNb250aCgwLCAxKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgb2Zmc2V0KSB7XG4gICAgZGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCkgKyBvZmZzZXQpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRGdWxsWWVhcigpIC0gc3RhcnQuZ2V0RnVsbFllYXIoKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gd2Vla2RheShpKSB7XG4gICAgcmV0dXJuIG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAoZGF0ZS5nZXREYXkoKSArIDcgLSBpKSAlIDcpO1xuICAgIH0sIGZ1bmN0aW9uKGRhdGUsIG9mZnNldCkge1xuICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgb2Zmc2V0ICogNyk7XG4gICAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgcmV0dXJuIChlbmQgLSBzdGFydCAtIChlbmQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNmU0KSAvIDYwNDhlNTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBtb25kYXkgPSB3ZWVrZGF5KDEpO1xuXG4gIGZ1bmN0aW9uIGZvcm1hdFdlZWtOdW1iZXJNb25kYXkoZCwgcCkge1xuICAgIHJldHVybiBwYWQobW9uZGF5LmNvdW50KHllYXIoZCksIGQpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFdlZWtkYXlOdW1iZXIoZCkge1xuICAgIHJldHVybiBkLmdldERheSgpO1xuICB9XG5cbiAgdmFyIHN1bmRheSA9IHdlZWtkYXkoMCk7XG5cbiAgZnVuY3Rpb24gZm9ybWF0V2Vla051bWJlclN1bmRheShkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChzdW5kYXkuY291bnQoeWVhcihkKSwgZCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0U2Vjb25kcyhkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldFNlY29uZHMoKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRNaW51dGVzKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0TWludXRlcygpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdE1vbnRoTnVtYmVyKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0TW9udGgoKSArIDEsIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0TWlsbGlzZWNvbmRzKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0TWlsbGlzZWNvbmRzKCksIHAsIDMpO1xuICB9XG5cbiAgdmFyIGRheSA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBvZmZzZXQpIHtcbiAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyBvZmZzZXQpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCAtIChlbmQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNmU0KSAvIDg2NGU1O1xuICB9KTtcblxuICBmdW5jdGlvbiBmb3JtYXREYXlPZlllYXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoMSArIGRheS5jb3VudCh5ZWFyKGQpLCBkKSwgcCwgMyk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRIb3VyMTIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRIb3VycygpICUgMTIgfHwgMTIsIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0SG91cjI0KGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0SG91cnMoKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXREYXlPZk1vbnRoKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0RGF0ZSgpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdExvb2t1cChuYW1lcykge1xuICAgIHZhciBtYXAgPSBuZXcgTWFwLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIG1hcC5zZXQobmFtZXNbaV0udG9Mb3dlckNhc2UoKSwgaSk7XG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuXG4gIHZhciByZXF1b3RlUmUgPSAvW1xcXFxcXF5cXCRcXCpcXCtcXD9cXHxcXFtcXF1cXChcXClcXC5cXHtcXH1dL2c7XG5cbiAgZnVuY3Rpb24gcmVxdW90ZShzKSB7XG4gICAgcmV0dXJuIHMucmVwbGFjZShyZXF1b3RlUmUsIFwiXFxcXCQmXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0UmUobmFtZXMpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChcIl4oPzpcIiArIG5hbWVzLm1hcChyZXF1b3RlKS5qb2luKFwifFwiKSArIFwiKVwiLCBcImlcIik7XG4gIH1cblxuICBmdW5jdGlvbiBsb2NhbGVGb3JtYXQobG9jYWxlKSB7XG4gICAgdmFyIGxvY2FsZV9kYXRlVGltZSA9IGxvY2FsZS5kYXRlVGltZSxcbiAgICAgICAgbG9jYWxlX2RhdGUgPSBsb2NhbGUuZGF0ZSxcbiAgICAgICAgbG9jYWxlX3RpbWUgPSBsb2NhbGUudGltZSxcbiAgICAgICAgbG9jYWxlX3BlcmlvZHMgPSBsb2NhbGUucGVyaW9kcyxcbiAgICAgICAgbG9jYWxlX3dlZWtkYXlzID0gbG9jYWxlLmRheXMsXG4gICAgICAgIGxvY2FsZV9zaG9ydFdlZWtkYXlzID0gbG9jYWxlLnNob3J0RGF5cyxcbiAgICAgICAgbG9jYWxlX21vbnRocyA9IGxvY2FsZS5tb250aHMsXG4gICAgICAgIGxvY2FsZV9zaG9ydE1vbnRocyA9IGxvY2FsZS5zaG9ydE1vbnRocztcblxuICAgIHZhciBwZXJpb2RMb29rdXAgPSBmb3JtYXRMb29rdXAobG9jYWxlX3BlcmlvZHMpLFxuICAgICAgICB3ZWVrZGF5UmUgPSBmb3JtYXRSZShsb2NhbGVfd2Vla2RheXMpLFxuICAgICAgICB3ZWVrZGF5TG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV93ZWVrZGF5cyksXG4gICAgICAgIHNob3J0V2Vla2RheVJlID0gZm9ybWF0UmUobG9jYWxlX3Nob3J0V2Vla2RheXMpLFxuICAgICAgICBzaG9ydFdlZWtkYXlMb29rdXAgPSBmb3JtYXRMb29rdXAobG9jYWxlX3Nob3J0V2Vla2RheXMpLFxuICAgICAgICBtb250aFJlID0gZm9ybWF0UmUobG9jYWxlX21vbnRocyksXG4gICAgICAgIG1vbnRoTG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV9tb250aHMpLFxuICAgICAgICBzaG9ydE1vbnRoUmUgPSBmb3JtYXRSZShsb2NhbGVfc2hvcnRNb250aHMpLFxuICAgICAgICBzaG9ydE1vbnRoTG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV9zaG9ydE1vbnRocyk7XG5cbiAgICB2YXIgZm9ybWF0cyA9IHtcbiAgICAgIFwiYVwiOiBmb3JtYXRTaG9ydFdlZWtkYXksXG4gICAgICBcIkFcIjogZm9ybWF0V2Vla2RheSxcbiAgICAgIFwiYlwiOiBmb3JtYXRTaG9ydE1vbnRoLFxuICAgICAgXCJCXCI6IGZvcm1hdE1vbnRoLFxuICAgICAgXCJjXCI6IG51bGwsXG4gICAgICBcImRcIjogZm9ybWF0RGF5T2ZNb250aCxcbiAgICAgIFwiZVwiOiBmb3JtYXREYXlPZk1vbnRoLFxuICAgICAgXCJIXCI6IGZvcm1hdEhvdXIyNCxcbiAgICAgIFwiSVwiOiBmb3JtYXRIb3VyMTIsXG4gICAgICBcImpcIjogZm9ybWF0RGF5T2ZZZWFyLFxuICAgICAgXCJMXCI6IGZvcm1hdE1pbGxpc2Vjb25kcyxcbiAgICAgIFwibVwiOiBmb3JtYXRNb250aE51bWJlcixcbiAgICAgIFwiTVwiOiBmb3JtYXRNaW51dGVzLFxuICAgICAgXCJwXCI6IGZvcm1hdFBlcmlvZCxcbiAgICAgIFwiU1wiOiBmb3JtYXRTZWNvbmRzLFxuICAgICAgXCJVXCI6IGZvcm1hdFdlZWtOdW1iZXJTdW5kYXksXG4gICAgICBcIndcIjogZm9ybWF0V2Vla2RheU51bWJlcixcbiAgICAgIFwiV1wiOiBmb3JtYXRXZWVrTnVtYmVyTW9uZGF5LFxuICAgICAgXCJ4XCI6IG51bGwsXG4gICAgICBcIlhcIjogbnVsbCxcbiAgICAgIFwieVwiOiBmb3JtYXRZZWFyLFxuICAgICAgXCJZXCI6IGZvcm1hdEZ1bGxZZWFyLFxuICAgICAgXCJaXCI6IGZvcm1hdFpvbmUsXG4gICAgICBcIiVcIjogZm9ybWF0TGl0ZXJhbFBlcmNlbnRcbiAgICB9O1xuXG4gICAgdmFyIHV0Y0Zvcm1hdHMgPSB7XG4gICAgICBcImFcIjogZm9ybWF0VVRDU2hvcnRXZWVrZGF5LFxuICAgICAgXCJBXCI6IGZvcm1hdFVUQ1dlZWtkYXksXG4gICAgICBcImJcIjogZm9ybWF0VVRDU2hvcnRNb250aCxcbiAgICAgIFwiQlwiOiBmb3JtYXRVVENNb250aCxcbiAgICAgIFwiY1wiOiBudWxsLFxuICAgICAgXCJkXCI6IGZvcm1hdFVUQ0RheU9mTW9udGgsXG4gICAgICBcImVcIjogZm9ybWF0VVRDRGF5T2ZNb250aCxcbiAgICAgIFwiSFwiOiBmb3JtYXRVVENIb3VyMjQsXG4gICAgICBcIklcIjogZm9ybWF0VVRDSG91cjEyLFxuICAgICAgXCJqXCI6IGZvcm1hdFVUQ0RheU9mWWVhcixcbiAgICAgIFwiTFwiOiBmb3JtYXRVVENNaWxsaXNlY29uZHMsXG4gICAgICBcIm1cIjogZm9ybWF0VVRDTW9udGhOdW1iZXIsXG4gICAgICBcIk1cIjogZm9ybWF0VVRDTWludXRlcyxcbiAgICAgIFwicFwiOiBmb3JtYXRVVENQZXJpb2QsXG4gICAgICBcIlNcIjogZm9ybWF0VVRDU2Vjb25kcyxcbiAgICAgIFwiVVwiOiBmb3JtYXRVVENXZWVrTnVtYmVyU3VuZGF5LFxuICAgICAgXCJ3XCI6IGZvcm1hdFVUQ1dlZWtkYXlOdW1iZXIsXG4gICAgICBcIldcIjogZm9ybWF0VVRDV2Vla051bWJlck1vbmRheSxcbiAgICAgIFwieFwiOiBudWxsLFxuICAgICAgXCJYXCI6IG51bGwsXG4gICAgICBcInlcIjogZm9ybWF0VVRDWWVhcixcbiAgICAgIFwiWVwiOiBmb3JtYXRVVENGdWxsWWVhcixcbiAgICAgIFwiWlwiOiBmb3JtYXRVVENab25lLFxuICAgICAgXCIlXCI6IGZvcm1hdExpdGVyYWxQZXJjZW50XG4gICAgfTtcblxuICAgIHZhciBwYXJzZXMgPSB7XG4gICAgICBcImFcIjogcGFyc2VTaG9ydFdlZWtkYXksXG4gICAgICBcIkFcIjogcGFyc2VXZWVrZGF5LFxuICAgICAgXCJiXCI6IHBhcnNlU2hvcnRNb250aCxcbiAgICAgIFwiQlwiOiBwYXJzZU1vbnRoLFxuICAgICAgXCJjXCI6IHBhcnNlTG9jYWxlRGF0ZVRpbWUsXG4gICAgICBcImRcIjogcGFyc2VEYXlPZk1vbnRoLFxuICAgICAgXCJlXCI6IHBhcnNlRGF5T2ZNb250aCxcbiAgICAgIFwiSFwiOiBwYXJzZUhvdXIyNCxcbiAgICAgIFwiSVwiOiBwYXJzZUhvdXIyNCxcbiAgICAgIFwialwiOiBwYXJzZURheU9mWWVhcixcbiAgICAgIFwiTFwiOiBwYXJzZU1pbGxpc2Vjb25kcyxcbiAgICAgIFwibVwiOiBwYXJzZU1vbnRoTnVtYmVyLFxuICAgICAgXCJNXCI6IHBhcnNlTWludXRlcyxcbiAgICAgIFwicFwiOiBwYXJzZVBlcmlvZCxcbiAgICAgIFwiU1wiOiBwYXJzZVNlY29uZHMsXG4gICAgICBcIlVcIjogcGFyc2VXZWVrTnVtYmVyU3VuZGF5LFxuICAgICAgXCJ3XCI6IHBhcnNlV2Vla2RheU51bWJlcixcbiAgICAgIFwiV1wiOiBwYXJzZVdlZWtOdW1iZXJNb25kYXksXG4gICAgICBcInhcIjogcGFyc2VMb2NhbGVEYXRlLFxuICAgICAgXCJYXCI6IHBhcnNlTG9jYWxlVGltZSxcbiAgICAgIFwieVwiOiBwYXJzZVllYXIsXG4gICAgICBcIllcIjogcGFyc2VGdWxsWWVhcixcbiAgICAgIFwiWlwiOiBwYXJzZVpvbmUsXG4gICAgICBcIiVcIjogcGFyc2VMaXRlcmFsUGVyY2VudFxuICAgIH07XG5cbiAgICAvLyBUaGVzZSByZWN1cnNpdmUgZGlyZWN0aXZlIGRlZmluaXRpb25zIG11c3QgYmUgZGVmZXJyZWQuXG4gICAgZm9ybWF0cy54ID0gbmV3Rm9ybWF0KGxvY2FsZV9kYXRlLCBmb3JtYXRzKTtcbiAgICBmb3JtYXRzLlggPSBuZXdGb3JtYXQobG9jYWxlX3RpbWUsIGZvcm1hdHMpO1xuICAgIGZvcm1hdHMuYyA9IG5ld0Zvcm1hdChsb2NhbGVfZGF0ZVRpbWUsIGZvcm1hdHMpO1xuICAgIHV0Y0Zvcm1hdHMueCA9IG5ld0Zvcm1hdChsb2NhbGVfZGF0ZSwgdXRjRm9ybWF0cyk7XG4gICAgdXRjRm9ybWF0cy5YID0gbmV3Rm9ybWF0KGxvY2FsZV90aW1lLCB1dGNGb3JtYXRzKTtcbiAgICB1dGNGb3JtYXRzLmMgPSBuZXdGb3JtYXQobG9jYWxlX2RhdGVUaW1lLCB1dGNGb3JtYXRzKTtcblxuICAgIGZ1bmN0aW9uIG5ld0Zvcm1hdChzcGVjaWZpZXIsIGZvcm1hdHMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgIHZhciBzdHJpbmcgPSBbXSxcbiAgICAgICAgICAgIGkgPSAtMSxcbiAgICAgICAgICAgIGogPSAwLFxuICAgICAgICAgICAgbiA9IHNwZWNpZmllci5sZW5ndGgsXG4gICAgICAgICAgICBjLFxuICAgICAgICAgICAgcGFkLFxuICAgICAgICAgICAgZm9ybWF0O1xuXG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgaWYgKHNwZWNpZmllci5jaGFyQ29kZUF0KGkpID09PSAzNykge1xuICAgICAgICAgICAgc3RyaW5nLnB1c2goc3BlY2lmaWVyLnNsaWNlKGosIGkpKTtcbiAgICAgICAgICAgIGlmICgocGFkID0gcGFkc1tjID0gc3BlY2lmaWVyLmNoYXJBdCgrK2kpXSkgIT0gbnVsbCkgYyA9IHNwZWNpZmllci5jaGFyQXQoKytpKTtcbiAgICAgICAgICAgIGlmIChmb3JtYXQgPSBmb3JtYXRzW2NdKSBjID0gZm9ybWF0KGRhdGUsIHBhZCA9PSBudWxsID8gKGMgPT09IFwiZVwiID8gXCIgXCIgOiBcIjBcIikgOiBwYWQpO1xuICAgICAgICAgICAgc3RyaW5nLnB1c2goYyk7XG4gICAgICAgICAgICBqID0gaSArIDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RyaW5nLnB1c2goc3BlY2lmaWVyLnNsaWNlKGosIGkpKTtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5qb2luKFwiXCIpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBuZXdQYXJzZShzcGVjaWZpZXIsIG5ld0RhdGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgICAgdmFyIGQgPSBuZXdZZWFyKDE5MDApLFxuICAgICAgICAgICAgaSA9IHBhcnNlU3BlY2lmaWVyKGQsIHNwZWNpZmllciwgc3RyaW5nLCAwKTtcbiAgICAgICAgaWYgKGkgIT0gc3RyaW5nLmxlbmd0aCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgLy8gVGhlIGFtLXBtIGZsYWcgaXMgMCBmb3IgQU0sIGFuZCAxIGZvciBQTS5cbiAgICAgICAgaWYgKFwicFwiIGluIGQpIGQuSCA9IGQuSCAlIDEyICsgZC5wICogMTI7XG5cbiAgICAgICAgLy8gSWYgYSB0aW1lIHpvbmUgaXMgc3BlY2lmaWVkLCBhbGwgZmllbGRzIGFyZSBpbnRlcnByZXRlZCBhcyBVVEMgYW5kIHRoZW5cbiAgICAgICAgLy8gb2Zmc2V0IGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWVkIHRpbWUgem9uZS5cbiAgICAgICAgaWYgKFwiWlwiIGluIGQpIHtcbiAgICAgICAgICBpZiAoXCJ3XCIgaW4gZCAmJiAoXCJXXCIgaW4gZCB8fCBcIlVcIiBpbiBkKSkge1xuICAgICAgICAgICAgdmFyIGRheSA9IHV0Y0RhdGUobmV3WWVhcihkLnkpKS5nZXRVVENEYXkoKTtcbiAgICAgICAgICAgIGlmIChcIldcIiBpbiBkKSBkLlUgPSBkLlcsIGQudyA9IChkLncgKyA2KSAlIDcsIC0tZGF5O1xuICAgICAgICAgICAgZC5tID0gMDtcbiAgICAgICAgICAgIGQuZCA9IGQudyArIGQuVSAqIDcgLSAoZGF5ICsgNikgJSA3O1xuICAgICAgICAgIH1cbiAgICAgICAgICBkLkggKz0gZC5aIC8gMTAwIHwgMDtcbiAgICAgICAgICBkLk0gKz0gZC5aICUgMTAwO1xuICAgICAgICAgIHJldHVybiB1dGNEYXRlKGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBhbGwgZmllbGRzIGFyZSBpbiBsb2NhbCB0aW1lLlxuICAgICAgICBpZiAoXCJ3XCIgaW4gZCAmJiAoXCJXXCIgaW4gZCB8fCBcIlVcIiBpbiBkKSkge1xuICAgICAgICAgIHZhciBkYXkgPSBuZXdEYXRlKG5ld1llYXIoZC55KSkuZ2V0RGF5KCk7XG4gICAgICAgICAgaWYgKFwiV1wiIGluIGQpIGQuVSA9IGQuVywgZC53ID0gKGQudyArIDYpICUgNywgLS1kYXk7XG4gICAgICAgICAgZC5tID0gMDtcbiAgICAgICAgICBkLmQgPSBkLncgKyBkLlUgKiA3IC0gKGRheSArIDYpICUgNztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RGF0ZShkKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VTcGVjaWZpZXIoZCwgc3BlY2lmaWVyLCBzdHJpbmcsIGopIHtcbiAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICBuID0gc3BlY2lmaWVyLmxlbmd0aCxcbiAgICAgICAgICBtID0gc3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICBjLFxuICAgICAgICAgIHBhcnNlO1xuXG4gICAgICB3aGlsZSAoaSA8IG4pIHtcbiAgICAgICAgaWYgKGogPj0gbSkgcmV0dXJuIC0xO1xuICAgICAgICBjID0gc3BlY2lmaWVyLmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgaWYgKGMgPT09IDM3KSB7XG4gICAgICAgICAgYyA9IHNwZWNpZmllci5jaGFyQXQoaSsrKTtcbiAgICAgICAgICBwYXJzZSA9IHBhcnNlc1tjIGluIHBhZHMgPyBzcGVjaWZpZXIuY2hhckF0KGkrKykgOiBjXTtcbiAgICAgICAgICBpZiAoIXBhcnNlIHx8ICgoaiA9IHBhcnNlKGQsIHN0cmluZywgaikpIDwgMCkpIHJldHVybiAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChjICE9IHN0cmluZy5jaGFyQ29kZUF0KGorKykpIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGo7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VTaG9ydFdlZWtkYXkoZCwgc3RyaW5nLCBpKSB7XG4gICAgICB2YXIgbiA9IHNob3J0V2Vla2RheVJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICAgIHJldHVybiBuID8gKGQudyA9IHNob3J0V2Vla2RheUxvb2t1cC5nZXQoblswXS50b0xvd2VyQ2FzZSgpKSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlV2Vla2RheShkLCBzdHJpbmcsIGkpIHtcbiAgICAgIHZhciBuID0gd2Vla2RheVJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICAgIHJldHVybiBuID8gKGQudyA9IHdlZWtkYXlMb29rdXAuZ2V0KG5bMF0udG9Mb3dlckNhc2UoKSksIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVNob3J0TW9udGgoZCwgc3RyaW5nLCBpKSB7XG4gICAgICB2YXIgbiA9IHNob3J0TW9udGhSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgICByZXR1cm4gbiA/IChkLm0gPSBzaG9ydE1vbnRoTG9va3VwLmdldChuWzBdLnRvTG93ZXJDYXNlKCkpLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VNb250aChkLCBzdHJpbmcsIGkpIHtcbiAgICAgIHZhciBuID0gbW9udGhSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgICByZXR1cm4gbiA/IChkLm0gPSBtb250aExvb2t1cC5nZXQoblswXS50b0xvd2VyQ2FzZSgpKSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTG9jYWxlRGF0ZVRpbWUoZCwgc3RyaW5nLCBpKSB7XG4gICAgICByZXR1cm4gcGFyc2VTcGVjaWZpZXIoZCwgbG9jYWxlX2RhdGVUaW1lLCBzdHJpbmcsIGkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTG9jYWxlRGF0ZShkLCBzdHJpbmcsIGkpIHtcbiAgICAgIHJldHVybiBwYXJzZVNwZWNpZmllcihkLCBsb2NhbGVfZGF0ZSwgc3RyaW5nLCBpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZUxvY2FsZVRpbWUoZCwgc3RyaW5nLCBpKSB7XG4gICAgICByZXR1cm4gcGFyc2VTcGVjaWZpZXIoZCwgbG9jYWxlX3RpbWUsIHN0cmluZywgaSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VQZXJpb2QoZCwgc3RyaW5nLCBpKSB7XG4gICAgICB2YXIgbiA9IHBlcmlvZExvb2t1cC5nZXQoc3RyaW5nLnNsaWNlKGksIGkgKz0gMikudG9Mb3dlckNhc2UoKSk7XG4gICAgICByZXR1cm4gbiA9PSBudWxsID8gLTEgOiAoZC5wID0gbiwgaSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0U2hvcnRXZWVrZGF5KGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfc2hvcnRXZWVrZGF5c1tkLmdldERheSgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRXZWVrZGF5KGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfd2Vla2RheXNbZC5nZXREYXkoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0U2hvcnRNb250aChkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX3Nob3J0TW9udGhzW2QuZ2V0TW9udGgoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0TW9udGgoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV9tb250aHNbZC5nZXRNb250aCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRQZXJpb2QoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV9wZXJpb2RzWysoZC5nZXRIb3VycygpID49IDEyKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VVRDU2hvcnRXZWVrZGF5KGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfc2hvcnRXZWVrZGF5c1tkLmdldFVUQ0RheSgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRVVENXZWVrZGF5KGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfd2Vla2RheXNbZC5nZXRVVENEYXkoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VVRDU2hvcnRNb250aChkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX3Nob3J0TW9udGhzW2QuZ2V0VVRDTW9udGgoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VVRDTW9udGgoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV9tb250aHNbZC5nZXRVVENNb250aCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRVVENQZXJpb2QoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV9wZXJpb2RzWysoZC5nZXRVVENIb3VycygpID49IDEyKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGZvcm1hdDogZnVuY3Rpb24oc3BlY2lmaWVyKSB7XG4gICAgICAgIHZhciBmID0gbmV3Rm9ybWF0KHNwZWNpZmllciArPSBcIlwiLCBmb3JtYXRzKTtcbiAgICAgICAgZi5wYXJzZSA9IG5ld1BhcnNlKHNwZWNpZmllciwgbG9jYWxEYXRlKTtcbiAgICAgICAgZi50b1N0cmluZyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gc3BlY2lmaWVyOyB9O1xuICAgICAgICByZXR1cm4gZjtcbiAgICAgIH0sXG4gICAgICB1dGNGb3JtYXQ6IGZ1bmN0aW9uKHNwZWNpZmllcikge1xuICAgICAgICB2YXIgZiA9IG5ld0Zvcm1hdChzcGVjaWZpZXIgKz0gXCJcIiwgdXRjRm9ybWF0cyk7XG4gICAgICAgIGYucGFyc2UgPSBuZXdQYXJzZShzcGVjaWZpZXIsIHV0Y0RhdGUpO1xuICAgICAgICBmLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7IHJldHVybiBzcGVjaWZpZXI7IH07XG4gICAgICAgIHJldHVybiBmO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICB2YXIgbG9jYWxlID0gbG9jYWxlRm9ybWF0KHtcbiAgICBkYXRlVGltZTogXCIlYSAlYiAlZSAlWCAlWVwiLFxuICAgIGRhdGU6IFwiJW0vJWQvJVlcIixcbiAgICB0aW1lOiBcIiVIOiVNOiVTXCIsXG4gICAgcGVyaW9kczogW1wiQU1cIiwgXCJQTVwiXSxcbiAgICBkYXlzOiBbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiXSxcbiAgICBzaG9ydERheXM6IFtcIlN1blwiLCBcIk1vblwiLCBcIlR1ZVwiLCBcIldlZFwiLCBcIlRodVwiLCBcIkZyaVwiLCBcIlNhdFwiXSxcbiAgICBtb250aHM6IFtcIkphbnVhcnlcIiwgXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIiwgXCJNYXlcIiwgXCJKdW5lXCIsIFwiSnVseVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9jdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCJdLFxuICAgIHNob3J0TW9udGhzOiBbXCJKYW5cIiwgXCJGZWJcIiwgXCJNYXJcIiwgXCJBcHJcIiwgXCJNYXlcIiwgXCJKdW5cIiwgXCJKdWxcIiwgXCJBdWdcIiwgXCJTZXBcIiwgXCJPY3RcIiwgXCJOb3ZcIiwgXCJEZWNcIl1cbiAgfSk7XG5cbiAgZXhwb3J0cy5mb3JtYXQgPSBsb2NhbGUuZm9ybWF0O1xuICBleHBvcnRzLnV0Y0Zvcm1hdCA9IGxvY2FsZS51dGNGb3JtYXQ7XG5cbiAgdmFyIGlzb1NwZWNpZmllciA9IFwiJVktJW0tJWRUJUg6JU06JVMuJUxaXCI7XG5cbiAgZnVuY3Rpb24gZm9ybWF0SXNvTmF0aXZlKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS50b0lTT1N0cmluZygpO1xuICB9XG5cbiAgZm9ybWF0SXNvTmF0aXZlLnBhcnNlID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShzdHJpbmcpO1xuICAgIHJldHVybiBpc05hTihkYXRlKSA/IG51bGwgOiBkYXRlO1xuICB9O1xuXG4gIGZvcm1hdElzb05hdGl2ZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBpc29TcGVjaWZpZXI7XG4gIH07XG5cbiAgdmFyIGZvcm1hdElzbyA9IERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nICYmICtuZXcgRGF0ZShcIjIwMDAtMDEtMDFUMDA6MDA6MDAuMDAwWlwiKVxuICAgICAgPyBmb3JtYXRJc29OYXRpdmVcbiAgICAgIDogbG9jYWxlLnV0Y0Zvcm1hdChpc29TcGVjaWZpZXIpO1xuXG4gIHZhciBpc29Gb3JtYXQgPSBmb3JtYXRJc287XG5cbiAgZXhwb3J0cy5pc29Gb3JtYXQgPSBpc29Gb3JtYXQ7XG4gIGV4cG9ydHMubG9jYWxlRm9ybWF0ID0gbG9jYWxlRm9ybWF0O1xuXG59KSk7IiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICBmYWN0b3J5KChnbG9iYWwudGltZSA9IHt9KSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICB2YXIgdDEgPSBuZXcgRGF0ZTtcblxuICB2YXIgdDAgPSBuZXcgRGF0ZTtcblxuICBmdW5jdGlvbiBuZXdJbnRlcnZhbChmbG9vcmksIG9mZnNldGksIGNvdW50KSB7XG5cbiAgICBmdW5jdGlvbiBpbnRlcnZhbChkYXRlKSB7XG4gICAgICByZXR1cm4gZmxvb3JpKGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSkpLCBkYXRlO1xuICAgIH1cblxuICAgIGludGVydmFsLmZsb29yID0gaW50ZXJ2YWw7XG5cbiAgICBpbnRlcnZhbC5yb3VuZCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIHZhciBkMCA9IG5ldyBEYXRlKCtkYXRlKSxcbiAgICAgICAgICBkMSA9IG5ldyBEYXRlKGRhdGUgLSAxKTtcbiAgICAgIGZsb29yaShkMCksIGZsb29yaShkMSksIG9mZnNldGkoZDEsIDEpO1xuICAgICAgcmV0dXJuIGRhdGUgLSBkMCA8IGQxIC0gZGF0ZSA/IGQwIDogZDE7XG4gICAgfTtcblxuICAgIGludGVydmFsLmNlaWwgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICByZXR1cm4gZmxvb3JpKGRhdGUgPSBuZXcgRGF0ZShkYXRlIC0gMSkpLCBvZmZzZXRpKGRhdGUsIDEpLCBkYXRlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5vZmZzZXQgPSBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICByZXR1cm4gb2Zmc2V0aShkYXRlID0gbmV3IERhdGUoK2RhdGUpLCBzdGVwID09IG51bGwgPyAxIDogTWF0aC5mbG9vcihzdGVwKSksIGRhdGU7XG4gICAgfTtcblxuICAgIGludGVydmFsLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICAgIHZhciByYW5nZSA9IFtdO1xuICAgICAgc3RhcnQgPSBuZXcgRGF0ZShzdGFydCAtIDEpO1xuICAgICAgc3RvcCA9IG5ldyBEYXRlKCtzdG9wKTtcbiAgICAgIHN0ZXAgPSBzdGVwID09IG51bGwgPyAxIDogTWF0aC5mbG9vcihzdGVwKTtcbiAgICAgIGlmICghKHN0YXJ0IDwgc3RvcCkgfHwgIShzdGVwID4gMCkpIHJldHVybiByYW5nZTsgLy8gYWxzbyBoYW5kbGVzIEludmFsaWQgRGF0ZVxuICAgICAgb2Zmc2V0aShzdGFydCwgMSksIGZsb29yaShzdGFydCk7XG4gICAgICBpZiAoc3RhcnQgPCBzdG9wKSByYW5nZS5wdXNoKG5ldyBEYXRlKCtzdGFydCkpO1xuICAgICAgd2hpbGUgKG9mZnNldGkoc3RhcnQsIHN0ZXApLCBmbG9vcmkoc3RhcnQpLCBzdGFydCA8IHN0b3ApIHJhbmdlLnB1c2gobmV3IERhdGUoK3N0YXJ0KSk7XG4gICAgICByZXR1cm4gcmFuZ2U7XG4gICAgfTtcblxuICAgIGludGVydmFsLmZpbHRlciA9IGZ1bmN0aW9uKHRlc3QpIHtcbiAgICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgIHdoaWxlIChmbG9vcmkoZGF0ZSksICF0ZXN0KGRhdGUpKSBkYXRlLnNldFRpbWUoZGF0ZSAtIDEpO1xuICAgICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgICB3aGlsZSAoLS1zdGVwID49IDApIHdoaWxlIChvZmZzZXRpKGRhdGUsIDEpLCAhdGVzdChkYXRlKSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgaWYgKGNvdW50KSBpbnRlcnZhbC5jb3VudCA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHQwLnNldFRpbWUoK3N0YXJ0KSwgdDEuc2V0VGltZSgrZW5kKTtcbiAgICAgIGZsb29yaSh0MCksIGZsb29yaSh0MSk7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihjb3VudCh0MCwgdDEpKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGludGVydmFsO1xuICB9XG5cbiAgdmFyIHNlY29uZCA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldE1pbGxpc2Vjb25kcygwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiAxZTMpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyAxZTM7XG4gIH0pO1xuXG4gIGV4cG9ydHMuc2Vjb25kcyA9IHNlY29uZC5yYW5nZTtcblxuICB2YXIgbWludXRlID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0U2Vjb25kcygwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiA2ZTQpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA2ZTQ7XG4gIH0pO1xuXG4gIGV4cG9ydHMubWludXRlcyA9IG1pbnV0ZS5yYW5nZTtcblxuICB2YXIgaG91ciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldE1pbnV0ZXMoMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMzZlNSk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDM2ZTU7XG4gIH0pO1xuXG4gIGV4cG9ydHMuaG91cnMgPSBob3VyLnJhbmdlO1xuXG4gIHZhciBkYXkgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCAtIChlbmQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNmU0KSAvIDg2NGU1O1xuICB9KTtcblxuICBleHBvcnRzLmRheXMgPSBkYXkucmFuZ2U7XG5cbiAgZnVuY3Rpb24gd2Vla2RheShpKSB7XG4gICAgcmV0dXJuIG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAoZGF0ZS5nZXREYXkoKSArIDcgLSBpKSAlIDcpO1xuICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIHN0ZXAgKiA3KTtcbiAgICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICByZXR1cm4gKGVuZCAtIHN0YXJ0IC0gKGVuZC5nZXRUaW1lem9uZU9mZnNldCgpIC0gc3RhcnQuZ2V0VGltZXpvbmVPZmZzZXQoKSkgKiA2ZTQpIC8gNjA0OGU1O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5zdW5kYXkgPSB3ZWVrZGF5KDApO1xuXG4gIGV4cG9ydHMuc3VuZGF5cyA9IGV4cG9ydHMuc3VuZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMubW9uZGF5ID0gd2Vla2RheSgxKTtcblxuICBleHBvcnRzLm1vbmRheXMgPSBleHBvcnRzLm1vbmRheS5yYW5nZTtcblxuICBleHBvcnRzLnR1ZXNkYXkgPSB3ZWVrZGF5KDIpO1xuXG4gIGV4cG9ydHMudHVlc2RheXMgPSBleHBvcnRzLnR1ZXNkYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy53ZWRuZXNkYXkgPSB3ZWVrZGF5KDMpO1xuXG4gIGV4cG9ydHMud2VkbmVzZGF5cyA9IGV4cG9ydHMud2VkbmVzZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMudGh1cnNkYXkgPSB3ZWVrZGF5KDQpO1xuXG4gIGV4cG9ydHMudGh1cnNkYXlzID0gZXhwb3J0cy50aHVyc2RheS5yYW5nZTtcblxuICBleHBvcnRzLmZyaWRheSA9IHdlZWtkYXkoNSk7XG5cbiAgZXhwb3J0cy5mcmlkYXlzID0gZXhwb3J0cy5mcmlkYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy5zYXR1cmRheSA9IHdlZWtkYXkoNik7XG5cbiAgZXhwb3J0cy5zYXR1cmRheXMgPSBleHBvcnRzLnNhdHVyZGF5LnJhbmdlO1xuXG4gIHZhciB3ZWVrID0gZXhwb3J0cy5zdW5kYXk7XG5cbiAgZXhwb3J0cy53ZWVrcyA9IHdlZWsucmFuZ2U7XG5cbiAgdmFyIG1vbnRoID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXREYXRlKDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0TW9udGgoKSAtIHN0YXJ0LmdldE1vbnRoKCkgKyAoZW5kLmdldEZ1bGxZZWFyKCkgLSBzdGFydC5nZXRGdWxsWWVhcigpKSAqIDEyO1xuICB9KTtcblxuICBleHBvcnRzLm1vbnRocyA9IG1vbnRoLnJhbmdlO1xuXG4gIHZhciB5ZWFyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXRNb250aCgwLCAxKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZW5kLmdldEZ1bGxZZWFyKCkgLSBzdGFydC5nZXRGdWxsWWVhcigpO1xuICB9KTtcblxuICBleHBvcnRzLnllYXJzID0geWVhci5yYW5nZTtcblxuICB2YXIgdXRjU2Vjb25kID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDTWlsbGlzZWNvbmRzKDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDFlMyk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDFlMztcbiAgfSk7XG5cbiAgZXhwb3J0cy51dGNTZWNvbmRzID0gdXRjU2Vjb25kLnJhbmdlO1xuXG4gIHZhciB1dGNNaW51dGUgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENTZWNvbmRzKDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDZlNCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDZlNDtcbiAgfSk7XG5cbiAgZXhwb3J0cy51dGNNaW51dGVzID0gdXRjTWludXRlLnJhbmdlO1xuXG4gIHZhciB1dGNIb3VyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDTWludXRlcygwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiAzNmU1KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMzZlNTtcbiAgfSk7XG5cbiAgZXhwb3J0cy51dGNIb3VycyA9IHV0Y0hvdXIucmFuZ2U7XG5cbiAgdmFyIHV0Y0RheSA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDg2NGU1O1xuICB9KTtcblxuICBleHBvcnRzLnV0Y0RheXMgPSB1dGNEYXkucmFuZ2U7XG5cbiAgZnVuY3Rpb24gdXRjV2Vla2RheShpKSB7XG4gICAgcmV0dXJuIG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gICAgICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgLSAoZGF0ZS5nZXRVVENEYXkoKSArIDcgLSBpKSAlIDcpO1xuICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIHN0ZXAgKiA3KTtcbiAgICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDYwNDhlNTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMudXRjU3VuZGF5ID0gdXRjV2Vla2RheSgwKTtcblxuICBleHBvcnRzLnV0Y1N1bmRheXMgPSBleHBvcnRzLnV0Y1N1bmRheS5yYW5nZTtcblxuICBleHBvcnRzLnV0Y01vbmRheSA9IHV0Y1dlZWtkYXkoMSk7XG5cbiAgZXhwb3J0cy51dGNNb25kYXlzID0gZXhwb3J0cy51dGNNb25kYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy51dGNUdWVzZGF5ID0gdXRjV2Vla2RheSgyKTtcblxuICBleHBvcnRzLnV0Y1R1ZXNkYXlzID0gZXhwb3J0cy51dGNUdWVzZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMudXRjV2VkbmVzZGF5ID0gdXRjV2Vla2RheSgzKTtcblxuICBleHBvcnRzLnV0Y1dlZG5lc2RheXMgPSBleHBvcnRzLnV0Y1dlZG5lc2RheS5yYW5nZTtcblxuICBleHBvcnRzLnV0Y1RodXJzZGF5ID0gdXRjV2Vla2RheSg0KTtcblxuICBleHBvcnRzLnV0Y1RodXJzZGF5cyA9IGV4cG9ydHMudXRjVGh1cnNkYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy51dGNGcmlkYXkgPSB1dGNXZWVrZGF5KDUpO1xuXG4gIGV4cG9ydHMudXRjRnJpZGF5cyA9IGV4cG9ydHMudXRjRnJpZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMudXRjU2F0dXJkYXkgPSB1dGNXZWVrZGF5KDYpO1xuXG4gIGV4cG9ydHMudXRjU2F0dXJkYXlzID0gZXhwb3J0cy51dGNTYXR1cmRheS5yYW5nZTtcblxuICB2YXIgdXRjV2VlayA9IGV4cG9ydHMudXRjU3VuZGF5O1xuXG4gIGV4cG9ydHMudXRjV2Vla3MgPSB1dGNXZWVrLnJhbmdlO1xuXG4gIHZhciB1dGNNb250aCA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0VVRDRGF0ZSgxKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDTW9udGgoZGF0ZS5nZXRVVENNb250aCgpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZW5kLmdldFVUQ01vbnRoKCkgLSBzdGFydC5nZXRVVENNb250aCgpICsgKGVuZC5nZXRVVENGdWxsWWVhcigpIC0gc3RhcnQuZ2V0VVRDRnVsbFllYXIoKSkgKiAxMjtcbiAgfSk7XG5cbiAgZXhwb3J0cy51dGNNb250aHMgPSB1dGNNb250aC5yYW5nZTtcblxuICB2YXIgdXRjWWVhciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0VVRDTW9udGgoMCwgMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRVVENGdWxsWWVhcigpIC0gc3RhcnQuZ2V0VVRDRnVsbFllYXIoKTtcbiAgfSk7XG5cbiAgZXhwb3J0cy51dGNZZWFycyA9IHV0Y1llYXIucmFuZ2U7XG5cbiAgZXhwb3J0cy5pbnRlcnZhbCA9IG5ld0ludGVydmFsO1xuICBleHBvcnRzLnNlY29uZCA9IHNlY29uZDtcbiAgZXhwb3J0cy5taW51dGUgPSBtaW51dGU7XG4gIGV4cG9ydHMuaG91ciA9IGhvdXI7XG4gIGV4cG9ydHMuZGF5ID0gZGF5O1xuICBleHBvcnRzLndlZWsgPSB3ZWVrO1xuICBleHBvcnRzLm1vbnRoID0gbW9udGg7XG4gIGV4cG9ydHMueWVhciA9IHllYXI7XG4gIGV4cG9ydHMudXRjU2Vjb25kID0gdXRjU2Vjb25kO1xuICBleHBvcnRzLnV0Y01pbnV0ZSA9IHV0Y01pbnV0ZTtcbiAgZXhwb3J0cy51dGNIb3VyID0gdXRjSG91cjtcbiAgZXhwb3J0cy51dGNEYXkgPSB1dGNEYXk7XG4gIGV4cG9ydHMudXRjV2VlayA9IHV0Y1dlZWs7XG4gIGV4cG9ydHMudXRjTW9udGggPSB1dGNNb250aDtcbiAgZXhwb3J0cy51dGNZZWFyID0gdXRjWWVhcjtcblxufSkpOyIsInZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICAgIHRpbWUgPSByZXF1aXJlKCcuLi90aW1lJyksXG4gICAgRVBTSUxPTiA9IDFlLTE1O1xuXG5mdW5jdGlvbiBiaW5zKG9wdCkge1xuICBpZiAoIW9wdCkgeyB0aHJvdyBFcnJvcihcIk1pc3NpbmcgYmlubmluZyBvcHRpb25zLlwiKTsgfVxuXG4gIC8vIGRldGVybWluZSByYW5nZVxuICB2YXIgbWF4YiA9IG9wdC5tYXhiaW5zIHx8IDE1LFxuICAgICAgYmFzZSA9IG9wdC5iYXNlIHx8IDEwLFxuICAgICAgbG9nYiA9IE1hdGgubG9nKGJhc2UpLFxuICAgICAgZGl2ID0gb3B0LmRpdiB8fCBbNSwgMl0sICAgICAgXG4gICAgICBtaW4gPSBvcHQubWluLFxuICAgICAgbWF4ID0gb3B0Lm1heCxcbiAgICAgIHNwYW4gPSBtYXggLSBtaW4sXG4gICAgICBzdGVwLCBsZXZlbCwgbWluc3RlcCwgcHJlY2lzaW9uLCB2LCBpLCBlcHM7XG5cbiAgaWYgKG9wdC5zdGVwKSB7XG4gICAgLy8gaWYgc3RlcCBzaXplIGlzIGV4cGxpY2l0bHkgZ2l2ZW4sIHVzZSB0aGF0XG4gICAgc3RlcCA9IG9wdC5zdGVwO1xuICB9IGVsc2UgaWYgKG9wdC5zdGVwcykge1xuICAgIC8vIGlmIHByb3ZpZGVkLCBsaW1pdCBjaG9pY2UgdG8gYWNjZXB0YWJsZSBzdGVwIHNpemVzXG4gICAgc3RlcCA9IG9wdC5zdGVwc1tNYXRoLm1pbihcbiAgICAgIG9wdC5zdGVwcy5sZW5ndGggLSAxLFxuICAgICAgYmlzZWN0KG9wdC5zdGVwcywgc3Bhbi9tYXhiLCAwLCBvcHQuc3RlcHMubGVuZ3RoKVxuICAgICldO1xuICB9IGVsc2Uge1xuICAgIC8vIGVsc2UgdXNlIHNwYW4gdG8gZGV0ZXJtaW5lIHN0ZXAgc2l6ZVxuICAgIGxldmVsID0gTWF0aC5jZWlsKE1hdGgubG9nKG1heGIpIC8gbG9nYik7XG4gICAgbWluc3RlcCA9IG9wdC5taW5zdGVwIHx8IDA7XG4gICAgc3RlcCA9IE1hdGgubWF4KFxuICAgICAgbWluc3RlcCxcbiAgICAgIE1hdGgucG93KGJhc2UsIE1hdGgucm91bmQoTWF0aC5sb2coc3BhbikgLyBsb2diKSAtIGxldmVsKVxuICAgICk7XG4gICAgXG4gICAgLy8gaW5jcmVhc2Ugc3RlcCBzaXplIGlmIHRvbyBtYW55IGJpbnNcbiAgICBkbyB7IHN0ZXAgKj0gYmFzZTsgfSB3aGlsZSAoTWF0aC5jZWlsKHNwYW4vc3RlcCkgPiBtYXhiKTtcblxuICAgIC8vIGRlY3JlYXNlIHN0ZXAgc2l6ZSBpZiBhbGxvd2VkXG4gICAgZm9yIChpPTA7IGk8ZGl2Lmxlbmd0aDsgKytpKSB7XG4gICAgICB2ID0gc3RlcCAvIGRpdltpXTtcbiAgICAgIGlmICh2ID49IG1pbnN0ZXAgJiYgc3BhbiAvIHYgPD0gbWF4Yikgc3RlcCA9IHY7XG4gICAgfVxuICB9XG5cbiAgLy8gdXBkYXRlIHByZWNpc2lvbiwgbWluIGFuZCBtYXhcbiAgdiA9IE1hdGgubG9nKHN0ZXApO1xuICBwcmVjaXNpb24gPSB2ID49IDAgPyAwIDogfn4oLXYgLyBsb2diKSArIDE7XG4gIGVwcyA9IE1hdGgucG93KGJhc2UsIC1wcmVjaXNpb24gLSAxKTtcbiAgbWluID0gTWF0aC5taW4obWluLCBNYXRoLmZsb29yKG1pbiAvIHN0ZXAgKyBlcHMpICogc3RlcCk7XG4gIG1heCA9IE1hdGguY2VpbChtYXggLyBzdGVwKSAqIHN0ZXA7XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydDogbWluLFxuICAgIHN0b3A6ICBtYXgsXG4gICAgc3RlcDogIHN0ZXAsXG4gICAgdW5pdDogIHtwcmVjaXNpb246IHByZWNpc2lvbn0sXG4gICAgdmFsdWU6IHZhbHVlLFxuICAgIGluZGV4OiBpbmRleFxuICB9O1xufVxuXG5mdW5jdGlvbiBiaXNlY3QoYSwgeCwgbG8sIGhpKSB7XG4gIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgdmFyIG1pZCA9IGxvICsgaGkgPj4+IDE7XG4gICAgaWYgKHV0aWwuY21wKGFbbWlkXSwgeCkgPCAwKSB7IGxvID0gbWlkICsgMTsgfVxuICAgIGVsc2UgeyBoaSA9IG1pZDsgfVxuICB9XG4gIHJldHVybiBsbztcbn1cblxuZnVuY3Rpb24gdmFsdWUodikge1xuICByZXR1cm4gdGhpcy5zdGVwICogTWF0aC5mbG9vcih2IC8gdGhpcy5zdGVwICsgRVBTSUxPTik7XG59XG5cbmZ1bmN0aW9uIGluZGV4KHYpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoKHYgLSB0aGlzLnN0YXJ0KSAvIHRoaXMuc3RlcCArIEVQU0lMT04pO1xufVxuXG5mdW5jdGlvbiBkYXRlX3ZhbHVlKHYpIHtcbiAgcmV0dXJuIHRoaXMudW5pdC5kYXRlKHZhbHVlLmNhbGwodGhpcywgdikpO1xufVxuXG5mdW5jdGlvbiBkYXRlX2luZGV4KHYpIHtcbiAgcmV0dXJuIGluZGV4LmNhbGwodGhpcywgdGhpcy51bml0LnVuaXQodikpO1xufVxuXG5iaW5zLmRhdGUgPSBmdW5jdGlvbihvcHQpIHtcbiAgaWYgKCFvcHQpIHsgdGhyb3cgRXJyb3IoXCJNaXNzaW5nIGRhdGUgYmlubmluZyBvcHRpb25zLlwiKTsgfVxuXG4gIC8vIGZpbmQgdGltZSBzdGVwLCB0aGVuIGJpblxuICB2YXIgdW5pdHMgPSBvcHQudXRjID8gdGltZS51dGMgOiB0aW1lLFxuICAgICAgZG1pbiA9IG9wdC5taW4sXG4gICAgICBkbWF4ID0gb3B0Lm1heCxcbiAgICAgIG1heGIgPSBvcHQubWF4YmlucyB8fCAyMCxcbiAgICAgIG1pbmIgPSBvcHQubWluYmlucyB8fCA0LFxuICAgICAgc3BhbiA9ICgrZG1heCkgLSAoK2RtaW4pLFxuICAgICAgdW5pdCA9IG9wdC51bml0ID8gdW5pdHNbb3B0LnVuaXRdIDogdW5pdHMuZmluZChzcGFuLCBtaW5iLCBtYXhiKSxcbiAgICAgIHNwZWMgPSBiaW5zKHtcbiAgICAgICAgbWluOiAgICAgdW5pdC5taW4gIT0gbnVsbCA/IHVuaXQubWluIDogdW5pdC51bml0KGRtaW4pLFxuICAgICAgICBtYXg6ICAgICB1bml0Lm1heCAhPSBudWxsID8gdW5pdC5tYXggOiB1bml0LnVuaXQoZG1heCksXG4gICAgICAgIG1heGJpbnM6IG1heGIsXG4gICAgICAgIG1pbnN0ZXA6IHVuaXQubWluc3RlcCxcbiAgICAgICAgc3RlcHM6ICAgdW5pdC5zdGVwXG4gICAgICB9KTtcblxuICBzcGVjLnVuaXQgPSB1bml0O1xuICBzcGVjLmluZGV4ID0gZGF0ZV9pbmRleDtcbiAgaWYgKCFvcHQucmF3KSBzcGVjLnZhbHVlID0gZGF0ZV92YWx1ZTtcbiAgcmV0dXJuIHNwZWM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJpbnM7XG4iLCJ2YXIgZ2VuID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuZ2VuLnJlcGVhdCA9IGZ1bmN0aW9uKHZhbCwgbikge1xuICB2YXIgYSA9IEFycmF5KG4pLCBpO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIGFbaV0gPSB2YWw7XG4gIHJldHVybiBhO1xufTtcblxuZ2VuLnplcm9zID0gZnVuY3Rpb24obikge1xuICByZXR1cm4gZ2VuLnJlcGVhdCgwLCBuKTtcbn07XG5cbmdlbi5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgIHN0ZXAgPSAxO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgc3RvcCA9IHN0YXJ0O1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgfVxuICBpZiAoKHN0b3AgLSBzdGFydCkgLyBzdGVwID09IEluZmluaXR5KSB0aHJvdyBuZXcgRXJyb3IoJ0luZmluaXRlIHJhbmdlJyk7XG4gIHZhciByYW5nZSA9IFtdLCBpID0gLTEsIGo7XG4gIGlmIChzdGVwIDwgMCkgd2hpbGUgKChqID0gc3RhcnQgKyBzdGVwICogKytpKSA+IHN0b3ApIHJhbmdlLnB1c2goaik7XG4gIGVsc2Ugd2hpbGUgKChqID0gc3RhcnQgKyBzdGVwICogKytpKSA8IHN0b3ApIHJhbmdlLnB1c2goaik7XG4gIHJldHVybiByYW5nZTtcbn07XG5cbmdlbi5yYW5kb20gPSB7fTtcblxuZ2VuLnJhbmRvbS51bmlmb3JtID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgaWYgKG1heCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbWF4ID0gbWluID09PSB1bmRlZmluZWQgPyAxIDogbWluO1xuICAgIG1pbiA9IDA7XG4gIH1cbiAgdmFyIGQgPSBtYXggLSBtaW47XG4gIHZhciBmID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG1pbiArIGQgKiBNYXRoLnJhbmRvbSgpO1xuICB9O1xuICBmLnNhbXBsZXMgPSBmdW5jdGlvbihuKSB7IHJldHVybiBnZW4uemVyb3MobikubWFwKGYpOyB9O1xuICByZXR1cm4gZjtcbn07XG5cbmdlbi5yYW5kb20uaW50ZWdlciA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgaWYgKGIgPT09IHVuZGVmaW5lZCkge1xuICAgIGIgPSBhO1xuICAgIGEgPSAwO1xuICB9XG4gIHZhciBkID0gYiAtIGE7XG4gIHZhciBmID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGEgKyBNYXRoLmZsb29yKGQgKiBNYXRoLnJhbmRvbSgpKTtcbiAgfTtcbiAgZi5zYW1wbGVzID0gZnVuY3Rpb24obikgeyByZXR1cm4gZ2VuLnplcm9zKG4pLm1hcChmKTsgfTtcbiAgcmV0dXJuIGY7XG59O1xuXG5nZW4ucmFuZG9tLm5vcm1hbCA9IGZ1bmN0aW9uKG1lYW4sIHN0ZGV2KSB7XG4gIG1lYW4gPSBtZWFuIHx8IDA7XG4gIHN0ZGV2ID0gc3RkZXYgfHwgMTtcbiAgdmFyIG5leHQ7XG4gIHZhciBmID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHggPSAwLCB5ID0gMCwgcmRzLCBjO1xuICAgIGlmIChuZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHggPSBuZXh0O1xuICAgICAgbmV4dCA9IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgICBkbyB7XG4gICAgICB4ID0gTWF0aC5yYW5kb20oKSoyLTE7XG4gICAgICB5ID0gTWF0aC5yYW5kb20oKSoyLTE7XG4gICAgICByZHMgPSB4KnggKyB5Knk7XG4gICAgfSB3aGlsZSAocmRzID09PSAwIHx8IHJkcyA+IDEpO1xuICAgIGMgPSBNYXRoLnNxcnQoLTIqTWF0aC5sb2cocmRzKS9yZHMpOyAvLyBCb3gtTXVsbGVyIHRyYW5zZm9ybVxuICAgIG5leHQgPSBtZWFuICsgeSpjKnN0ZGV2O1xuICAgIHJldHVybiBtZWFuICsgeCpjKnN0ZGV2O1xuICB9O1xuICBmLnNhbXBsZXMgPSBmdW5jdGlvbihuKSB7IHJldHVybiBnZW4uemVyb3MobikubWFwKGYpOyB9O1xuICByZXR1cm4gZjtcbn07IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbnZhciBUWVBFUyA9ICdfX3R5cGVzX18nO1xuXG52YXIgUEFSU0VSUyA9IHtcbiAgYm9vbGVhbjogdXRpbC5ib29sZWFuLFxuICBpbnRlZ2VyOiB1dGlsLm51bWJlcixcbiAgbnVtYmVyOiAgdXRpbC5udW1iZXIsXG4gIGRhdGU6ICAgIHV0aWwuZGF0ZSxcbiAgc3RyaW5nOiAgZnVuY3Rpb24oeCkgeyByZXR1cm4geD09PScnID8gbnVsbCA6IHg7IH1cbn07XG5cbnZhciBURVNUUyA9IHtcbiAgYm9vbGVhbjogZnVuY3Rpb24oeCkgeyByZXR1cm4geD09PSd0cnVlJyB8fCB4PT09J2ZhbHNlJyB8fCB1dGlsLmlzQm9vbGVhbih4KTsgfSxcbiAgaW50ZWdlcjogZnVuY3Rpb24oeCkgeyByZXR1cm4gVEVTVFMubnVtYmVyKHgpICYmICh4PSt4KSA9PT0gfn54OyB9LFxuICBudW1iZXI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuICFpc05hTigreCkgJiYgIXV0aWwuaXNEYXRlKHgpOyB9LFxuICBkYXRlOiBmdW5jdGlvbih4KSB7IHJldHVybiAhaXNOYU4oRGF0ZS5wYXJzZSh4KSk7IH1cbn07XG5cbmZ1bmN0aW9uIGFubm90YXRpb24oZGF0YSwgdHlwZXMpIHtcbiAgaWYgKCF0eXBlcykgcmV0dXJuIGRhdGEgJiYgZGF0YVtUWVBFU10gfHwgbnVsbDtcbiAgZGF0YVtUWVBFU10gPSB0eXBlcztcbn1cblxuZnVuY3Rpb24gdHlwZSh2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIHYsIGksIG47XG5cbiAgLy8gaWYgZGF0YSBhcnJheSBoYXMgdHlwZSBhbm5vdGF0aW9ucywgdXNlIHRoZW1cbiAgaWYgKHZhbHVlc1tUWVBFU10pIHtcbiAgICB2ID0gZih2YWx1ZXNbVFlQRVNdKTtcbiAgICBpZiAodXRpbC5pc1N0cmluZyh2KSkgcmV0dXJuIHY7XG4gIH1cblxuICBmb3IgKGk9MCwgbj12YWx1ZXMubGVuZ3RoOyAhdXRpbC5pc1ZhbGlkKHYpICYmIGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gIH1cblxuICByZXR1cm4gdXRpbC5pc0RhdGUodikgPyAnZGF0ZScgOlxuICAgIHV0aWwuaXNOdW1iZXIodikgICAgPyAnbnVtYmVyJyA6XG4gICAgdXRpbC5pc0Jvb2xlYW4odikgICA/ICdib29sZWFuJyA6XG4gICAgdXRpbC5pc1N0cmluZyh2KSAgICA/ICdzdHJpbmcnIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gdHlwZUFsbChkYXRhLCBmaWVsZHMpIHtcbiAgaWYgKCFkYXRhLmxlbmd0aCkgcmV0dXJuO1xuICBmaWVsZHMgPSBmaWVsZHMgfHwgdXRpbC5rZXlzKGRhdGFbMF0pO1xuICByZXR1cm4gZmllbGRzLnJlZHVjZShmdW5jdGlvbih0eXBlcywgZikge1xuICAgIHJldHVybiAodHlwZXNbZl0gPSB0eXBlKGRhdGEsIGYpLCB0eXBlcyk7XG4gIH0sIHt9KTtcbn1cblxuZnVuY3Rpb24gaW5mZXIodmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciBpLCBqLCB2O1xuXG4gIC8vIHR5cGVzIHRvIHRlc3QgZm9yLCBpbiBwcmVjZWRlbmNlIG9yZGVyXG4gIHZhciB0eXBlcyA9IFsnYm9vbGVhbicsICdpbnRlZ2VyJywgJ251bWJlcicsICdkYXRlJ107XG5cbiAgZm9yIChpPTA7IGk8dmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgLy8gZ2V0IG5leHQgdmFsdWUgdG8gdGVzdFxuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIC8vIHRlc3QgdmFsdWUgYWdhaW5zdCByZW1haW5pbmcgdHlwZXNcbiAgICBmb3IgKGo9MDsgajx0eXBlcy5sZW5ndGg7ICsraikge1xuICAgICAgaWYgKHV0aWwuaXNWYWxpZCh2KSAmJiAhVEVTVFNbdHlwZXNbal1dKHYpKSB7XG4gICAgICAgIHR5cGVzLnNwbGljZShqLCAxKTtcbiAgICAgICAgaiAtPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBpZiBubyB0eXBlcyBsZWZ0LCByZXR1cm4gJ3N0cmluZydcbiAgICBpZiAodHlwZXMubGVuZ3RoID09PSAwKSByZXR1cm4gJ3N0cmluZyc7XG4gIH1cblxuICByZXR1cm4gdHlwZXNbMF07XG59XG5cbmZ1bmN0aW9uIGluZmVyQWxsKGRhdGEsIGZpZWxkcykge1xuICBmaWVsZHMgPSBmaWVsZHMgfHwgdXRpbC5rZXlzKGRhdGFbMF0pO1xuICByZXR1cm4gZmllbGRzLnJlZHVjZShmdW5jdGlvbih0eXBlcywgZikge1xuICAgIHR5cGVzW2ZdID0gaW5mZXIoZGF0YSwgZik7XG4gICAgcmV0dXJuIHR5cGVzO1xuICB9LCB7fSk7XG59XG5cbnR5cGUuYW5ub3RhdGlvbiA9IGFubm90YXRpb247XG50eXBlLmFsbCA9IHR5cGVBbGw7XG50eXBlLmluZmVyID0gaW5mZXI7XG50eXBlLmluZmVyQWxsID0gaW5mZXJBbGw7XG50eXBlLnBhcnNlcnMgPSBQQVJTRVJTO1xubW9kdWxlLmV4cG9ydHMgPSB0eXBlOyIsInZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgdHlwZSA9IHJlcXVpcmUoJy4vaW1wb3J0L3R5cGUnKTtcbnZhciBnZW4gPSByZXF1aXJlKCcuL2dlbmVyYXRlJyk7XG52YXIgc3RhdHMgPSB7fTtcblxuLy8gQ29sbGVjdCB1bmlxdWUgdmFsdWVzLlxuLy8gT3V0cHV0OiBhbiBhcnJheSBvZiB1bmlxdWUgdmFsdWVzLCBpbiBmaXJzdC1vYnNlcnZlZCBvcmRlclxuc3RhdHMudW5pcXVlID0gZnVuY3Rpb24odmFsdWVzLCBmLCByZXN1bHRzKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuICB2YXIgdSA9IHt9LCB2LCBpLCBuO1xuICBmb3IgKGk9MCwgbj12YWx1ZXMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh2IGluIHUpIGNvbnRpbnVlO1xuICAgIHVbdl0gPSAxO1xuICAgIHJlc3VsdHMucHVzaCh2KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbi8vIFJldHVybiB0aGUgbGVuZ3RoIG9mIHRoZSBpbnB1dCBhcnJheS5cbnN0YXRzLmNvdW50ID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gIHJldHVybiB2YWx1ZXMgJiYgdmFsdWVzLmxlbmd0aCB8fCAwO1xufTtcblxuLy8gQ291bnQgdGhlIG51bWJlciBvZiBub24tbnVsbCwgbm9uLXVuZGVmaW5lZCwgbm9uLU5hTiB2YWx1ZXMuXG5zdGF0cy5jb3VudC52YWxpZCA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgdiwgaSwgbiwgdmFsaWQgPSAwO1xuICBmb3IgKGk9MCwgbj12YWx1ZXMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzVmFsaWQodikpIHZhbGlkICs9IDE7XG4gIH1cbiAgcmV0dXJuIHZhbGlkO1xufTtcblxuLy8gQ291bnQgdGhlIG51bWJlciBvZiBudWxsIG9yIHVuZGVmaW5lZCB2YWx1ZXMuXG5zdGF0cy5jb3VudC5taXNzaW5nID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciB2LCBpLCBuLCBjb3VudCA9IDA7XG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHYgPT0gbnVsbCkgY291bnQgKz0gMTtcbiAgfVxuICByZXR1cm4gY291bnQ7XG59O1xuXG4vLyBDb3VudCB0aGUgbnVtYmVyIG9mIGRpc3RpbmN0IHZhbHVlcy5cbi8vIE51bGwsIHVuZGVmaW5lZCBhbmQgTmFOIGFyZSBlYWNoIGNvbnNpZGVyZWQgZGlzdGluY3QgdmFsdWVzLlxuc3RhdHMuY291bnQuZGlzdGluY3QgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIHUgPSB7fSwgdiwgaSwgbiwgY291bnQgPSAwO1xuICBmb3IgKGk9MCwgbj12YWx1ZXMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh2IGluIHUpIGNvbnRpbnVlO1xuICAgIHVbdl0gPSAxO1xuICAgIGNvdW50ICs9IDE7XG4gIH1cbiAgcmV0dXJuIGNvdW50O1xufTtcblxuLy8gQ29uc3RydWN0IGEgbWFwIGZyb20gZGlzdGluY3QgdmFsdWVzIHRvIG9jY3VycmVuY2UgY291bnRzLlxuc3RhdHMuY291bnQubWFwID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciBtYXAgPSB7fSwgdiwgaSwgbjtcbiAgZm9yIChpPTAsIG49dmFsdWVzLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBtYXBbdl0gPSAodiBpbiBtYXApID8gbWFwW3ZdICsgMSA6IDE7XG4gIH1cbiAgcmV0dXJuIG1hcDtcbn07XG5cbi8vIENvbXB1dGUgdGhlIG1lZGlhbiBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMubWVkaWFuID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGlmIChmKSB2YWx1ZXMgPSB2YWx1ZXMubWFwKHV0aWwuJChmKSk7XG4gIHZhbHVlcyA9IHZhbHVlcy5maWx0ZXIodXRpbC5pc1ZhbGlkKS5zb3J0KHV0aWwuY21wKTtcbiAgcmV0dXJuIHN0YXRzLnF1YW50aWxlKHZhbHVlcywgMC41KTtcbn07XG5cbi8vIENvbXB1dGVzIHRoZSBxdWFydGlsZSBib3VuZGFyaWVzIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5xdWFydGlsZSA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBpZiAoZikgdmFsdWVzID0gdmFsdWVzLm1hcCh1dGlsLiQoZikpO1xuICB2YWx1ZXMgPSB2YWx1ZXMuZmlsdGVyKHV0aWwuaXNWYWxpZCkuc29ydCh1dGlsLmNtcCk7XG4gIHZhciBxID0gc3RhdHMucXVhbnRpbGU7XG4gIHJldHVybiBbcSh2YWx1ZXMsIDAuMjUpLCBxKHZhbHVlcywgMC41MCksIHEodmFsdWVzLCAwLjc1KV07XG59O1xuXG4vLyBDb21wdXRlIHRoZSBxdWFudGlsZSBvZiBhIHNvcnRlZCBhcnJheSBvZiBudW1iZXJzLlxuLy8gQWRhcHRlZCBmcm9tIHRoZSBEMy5qcyBpbXBsZW1lbnRhdGlvbi5cbnN0YXRzLnF1YW50aWxlID0gZnVuY3Rpb24odmFsdWVzLCBmLCBwKSB7XG4gIGlmIChwID09PSB1bmRlZmluZWQpIHsgcCA9IGY7IGYgPSB1dGlsLmlkZW50aXR5OyB9XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciBIID0gKHZhbHVlcy5sZW5ndGggLSAxKSAqIHAgKyAxLFxuICAgICAgaCA9IE1hdGguZmxvb3IoSCksXG4gICAgICB2ID0gK2YodmFsdWVzW2ggLSAxXSksXG4gICAgICBlID0gSCAtIGg7XG4gIHJldHVybiBlID8gdiArIGUgKiAoZih2YWx1ZXNbaF0pIC0gdikgOiB2O1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgc3VtIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5zdW0gPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgZm9yICh2YXIgc3VtPTAsIGk9MCwgbj12YWx1ZXMubGVuZ3RoLCB2OyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzVmFsaWQodikpIHN1bSArPSB2O1xuICB9XG4gIHJldHVybiBzdW07XG59O1xuXG4vLyBDb21wdXRlIHRoZSBtZWFuIChhdmVyYWdlKSBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMubWVhbiA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgbWVhbiA9IDAsIGRlbHRhLCBpLCBuLCBjLCB2O1xuICBmb3IgKGk9MCwgYz0wLCBuPXZhbHVlcy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkge1xuICAgICAgZGVsdGEgPSB2IC0gbWVhbjtcbiAgICAgIG1lYW4gPSBtZWFuICsgZGVsdGEgLyAoKytjKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1lYW47XG59O1xuXG4vLyBDb21wdXRlIHRoZSBzYW1wbGUgdmFyaWFuY2Ugb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLnZhcmlhbmNlID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIGlmICghdXRpbC5pc0FycmF5KHZhbHVlcykgfHwgdmFsdWVzLmxlbmd0aCA8IDIpIHJldHVybiAwO1xuICB2YXIgbWVhbiA9IDAsIE0yID0gMCwgZGVsdGEsIGksIGMsIHY7XG4gIGZvciAoaT0wLCBjPTA7IGk8dmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkge1xuICAgICAgZGVsdGEgPSB2IC0gbWVhbjtcbiAgICAgIG1lYW4gPSBtZWFuICsgZGVsdGEgLyAoKytjKTtcbiAgICAgIE0yID0gTTIgKyBkZWx0YSAqICh2IC0gbWVhbik7XG4gICAgfVxuICB9XG4gIE0yID0gTTIgLyAoYyAtIDEpO1xuICByZXR1cm4gTTI7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBzYW1wbGUgc3RhbmRhcmQgZGV2aWF0aW9uIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5zdGRldiA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICByZXR1cm4gTWF0aC5zcXJ0KHN0YXRzLnZhcmlhbmNlKHZhbHVlcywgZikpO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgUGVhcnNvbiBtb2RlIHNrZXduZXNzICgobWVkaWFuLW1lYW4pL3N0ZGV2KSBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMubW9kZXNrZXcgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgdmFyIGF2ZyA9IHN0YXRzLm1lYW4odmFsdWVzLCBmKSxcbiAgICAgIG1lZCA9IHN0YXRzLm1lZGlhbih2YWx1ZXMsIGYpLFxuICAgICAgc3RkID0gc3RhdHMuc3RkZXYodmFsdWVzLCBmKTtcbiAgcmV0dXJuIHN0ZCA9PT0gMCA/IDAgOiAoYXZnIC0gbWVkKSAvIHN0ZDtcbn07XG5cbi8vIEZpbmQgdGhlIG1pbmltdW0gdmFsdWUgaW4gYW4gYXJyYXkuXG5zdGF0cy5taW4gPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgcmV0dXJuIHN0YXRzLmV4dGVudCh2YWx1ZXMsIGYpWzBdO1xufTtcblxuLy8gRmluZCB0aGUgbWF4aW11bSB2YWx1ZSBpbiBhbiBhcnJheS5cbnN0YXRzLm1heCA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICByZXR1cm4gc3RhdHMuZXh0ZW50KHZhbHVlcywgZilbMV07XG59O1xuXG4vLyBGaW5kIHRoZSBtaW5pbXVtIGFuZCBtYXhpbXVtIG9mIGFuIGFycmF5IG9mIHZhbHVlcy5cbnN0YXRzLmV4dGVudCA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgYSwgYiwgdiwgaSwgbiA9IHZhbHVlcy5sZW5ndGg7XG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzVmFsaWQodikpIHsgYSA9IGIgPSB2OyBicmVhazsgfVxuICB9XG4gIGZvciAoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzVmFsaWQodikpIHtcbiAgICAgIGlmICh2IDwgYSkgYSA9IHY7XG4gICAgICBpZiAodiA+IGIpIGIgPSB2O1xuICAgIH1cbiAgfVxuICByZXR1cm4gW2EsIGJdO1xufTtcblxuLy8gRmluZCB0aGUgaW50ZWdlciBpbmRpY2VzIG9mIHRoZSBtaW5pbXVtIGFuZCBtYXhpbXVtIHZhbHVlcy5cbnN0YXRzLmV4dGVudC5pbmRleCA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgeCA9IC0xLCB5ID0gLTEsIGEsIGIsIHYsIGksIG4gPSB2YWx1ZXMubGVuZ3RoO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodXRpbC5pc1ZhbGlkKHYpKSB7IGEgPSBiID0gdjsgeCA9IHkgPSBpOyBicmVhazsgfVxuICB9XG4gIGZvciAoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzVmFsaWQodikpIHtcbiAgICAgIGlmICh2IDwgYSkgeyBhID0gdjsgeCA9IGk7IH1cbiAgICAgIGlmICh2ID4gYikgeyBiID0gdjsgeSA9IGk7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIFt4LCB5XTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byBhcnJheXMgb2YgbnVtYmVycy5cbnN0YXRzLmRvdCA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYikge1xuICB2YXIgc3VtID0gMCwgaSwgdjtcbiAgaWYgKCFiKSB7XG4gICAgaWYgKHZhbHVlcy5sZW5ndGggIT09IGEubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcignQXJyYXkgbGVuZ3RocyBtdXN0IG1hdGNoLicpO1xuICAgIH1cbiAgICBmb3IgKGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHYgPSB2YWx1ZXNbaV0gKiBhW2ldO1xuICAgICAgaWYgKHYgPT09IHYpIHN1bSArPSB2O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBhID0gdXRpbC4kKGEpO1xuICAgIGIgPSB1dGlsLiQoYik7XG4gICAgZm9yIChpPTA7IGk8dmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2ID0gYSh2YWx1ZXNbaV0pICogYih2YWx1ZXNbaV0pO1xuICAgICAgaWYgKHYgPT09IHYpIHN1bSArPSB2O1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3VtO1xufTtcblxuLy8gQ29tcHV0ZSBhc2NlbmRpbmcgcmFuayBzY29yZXMgZm9yIGFuIGFycmF5IG9mIHZhbHVlcy5cbi8vIFRpZXMgYXJlIGFzc2lnbmVkIHRoZWlyIGNvbGxlY3RpdmUgbWVhbiByYW5rLlxuc3RhdHMucmFuayA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpIHx8IHV0aWwuaWRlbnRpdHk7XG4gIHZhciBhID0gdmFsdWVzLm1hcChmdW5jdGlvbih2LCBpKSB7XG4gICAgICByZXR1cm4ge2lkeDogaSwgdmFsOiBmKHYpfTtcbiAgICB9KVxuICAgIC5zb3J0KHV0aWwuY29tcGFyYXRvcigndmFsJykpO1xuXG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIHIgPSBBcnJheShuKSxcbiAgICAgIHRpZSA9IC0xLCBwID0ge30sIGksIHYsIG11O1xuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHYgPSBhW2ldLnZhbDtcbiAgICBpZiAodGllIDwgMCAmJiBwID09PSB2KSB7XG4gICAgICB0aWUgPSBpIC0gMTtcbiAgICB9IGVsc2UgaWYgKHRpZSA+IC0xICYmIHAgIT09IHYpIHtcbiAgICAgIG11ID0gMSArIChpLTEgKyB0aWUpIC8gMjtcbiAgICAgIGZvciAoOyB0aWU8aTsgKyt0aWUpIHJbYVt0aWVdLmlkeF0gPSBtdTtcbiAgICAgIHRpZSA9IC0xO1xuICAgIH1cbiAgICByW2FbaV0uaWR4XSA9IGkgKyAxO1xuICAgIHAgPSB2O1xuICB9XG5cbiAgaWYgKHRpZSA+IC0xKSB7XG4gICAgbXUgPSAxICsgKG4tMSArIHRpZSkgLyAyO1xuICAgIGZvciAoOyB0aWU8bjsgKyt0aWUpIHJbYVt0aWVdLmlkeF0gPSBtdTtcbiAgfVxuXG4gIHJldHVybiByO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgc2FtcGxlIFBlYXJzb24gcHJvZHVjdC1tb21lbnQgY29ycmVsYXRpb24gb2YgdHdvIGFycmF5cyBvZiBudW1iZXJzLlxuc3RhdHMuY29yID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiKSB7XG4gIHZhciBmbiA9IGI7XG4gIGIgPSBmbiA/IHZhbHVlcy5tYXAodXRpbC4kKGIpKSA6IGE7XG4gIGEgPSBmbiA/IHZhbHVlcy5tYXAodXRpbC4kKGEpKSA6IHZhbHVlcztcblxuICB2YXIgZG90ID0gc3RhdHMuZG90KGEsIGIpLFxuICAgICAgbXVhID0gc3RhdHMubWVhbihhKSxcbiAgICAgIG11YiA9IHN0YXRzLm1lYW4oYiksXG4gICAgICBzZGEgPSBzdGF0cy5zdGRldihhKSxcbiAgICAgIHNkYiA9IHN0YXRzLnN0ZGV2KGIpLFxuICAgICAgbiA9IHZhbHVlcy5sZW5ndGg7XG5cbiAgcmV0dXJuIChkb3QgLSBuKm11YSptdWIpIC8gKChuLTEpICogc2RhICogc2RiKTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIFNwZWFybWFuIHJhbmsgY29ycmVsYXRpb24gb2YgdHdvIGFycmF5cyBvZiB2YWx1ZXMuXG5zdGF0cy5jb3IucmFuayA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYikge1xuICB2YXIgcmEgPSBiID8gc3RhdHMucmFuayh2YWx1ZXMsIHV0aWwuJChhKSkgOiBzdGF0cy5yYW5rKHZhbHVlcyksXG4gICAgICByYiA9IGIgPyBzdGF0cy5yYW5rKHZhbHVlcywgdXRpbC4kKGIpKSA6IHN0YXRzLnJhbmsoYSksXG4gICAgICBuID0gdmFsdWVzLmxlbmd0aCwgaSwgcywgZDtcblxuICBmb3IgKGk9MCwgcz0wOyBpPG47ICsraSkge1xuICAgIGQgPSByYVtpXSAtIHJiW2ldO1xuICAgIHMgKz0gZCAqIGQ7XG4gIH1cblxuICByZXR1cm4gMSAtIDYqcyAvIChuICogKG4qbi0xKSk7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBkaXN0YW5jZSBjb3JyZWxhdGlvbiBvZiB0d28gYXJyYXlzIG9mIG51bWJlcnMuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Rpc3RhbmNlX2NvcnJlbGF0aW9uXG5zdGF0cy5jb3IuZGlzdCA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYikge1xuICB2YXIgWCA9IGIgPyB2YWx1ZXMubWFwKHV0aWwuJChhKSkgOiB2YWx1ZXMsXG4gICAgICBZID0gYiA/IHZhbHVlcy5tYXAodXRpbC4kKGIpKSA6IGE7XG5cbiAgdmFyIEEgPSBzdGF0cy5kaXN0Lm1hdChYKSxcbiAgICAgIEIgPSBzdGF0cy5kaXN0Lm1hdChZKSxcbiAgICAgIG4gPSBBLmxlbmd0aCxcbiAgICAgIGksIGFhLCBiYiwgYWI7XG5cbiAgZm9yIChpPTAsIGFhPTAsIGJiPTAsIGFiPTA7IGk8bjsgKytpKSB7XG4gICAgYWEgKz0gQVtpXSpBW2ldO1xuICAgIGJiICs9IEJbaV0qQltpXTtcbiAgICBhYiArPSBBW2ldKkJbaV07XG4gIH1cblxuICByZXR1cm4gTWF0aC5zcXJ0KGFiIC8gTWF0aC5zcXJ0KGFhKmJiKSk7XG59O1xuXG4vLyBDb21wdXRlIHRoZSB2ZWN0b3IgZGlzdGFuY2UgYmV0d2VlbiB0d28gYXJyYXlzIG9mIG51bWJlcnMuXG4vLyBEZWZhdWx0IGlzIEV1Y2xpZGVhbiAoZXhwPTIpIGRpc3RhbmNlLCBjb25maWd1cmFibGUgdmlhIGV4cCBhcmd1bWVudC5cbnN0YXRzLmRpc3QgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIsIGV4cCkge1xuICB2YXIgZiA9IHV0aWwuaXNGdW5jdGlvbihiKSB8fCB1dGlsLmlzU3RyaW5nKGIpLFxuICAgICAgWCA9IHZhbHVlcyxcbiAgICAgIFkgPSBmID8gdmFsdWVzIDogYSxcbiAgICAgIGUgPSBmID8gZXhwIDogYixcbiAgICAgIEwyID0gZSA9PT0gMiB8fCBlID09IG51bGwsXG4gICAgICBuID0gdmFsdWVzLmxlbmd0aCwgcyA9IDAsIGQsIGk7XG4gIGlmIChmKSB7XG4gICAgYSA9IHV0aWwuJChhKTtcbiAgICBiID0gdXRpbC4kKGIpO1xuICB9XG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIGQgPSBmID8gKGEoWFtpXSktYihZW2ldKSkgOiAoWFtpXS1ZW2ldKTtcbiAgICBzICs9IEwyID8gZCpkIDogTWF0aC5wb3coTWF0aC5hYnMoZCksIGUpO1xuICB9XG4gIHJldHVybiBMMiA/IE1hdGguc3FydChzKSA6IE1hdGgucG93KHMsIDEvZSk7XG59O1xuXG4vLyBDb25zdHJ1Y3QgYSBtZWFuLWNlbnRlcmVkIGRpc3RhbmNlIG1hdHJpeCBmb3IgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLmRpc3QubWF0ID0gZnVuY3Rpb24oWCkge1xuICB2YXIgbiA9IFgubGVuZ3RoLFxuICAgICAgbSA9IG4qbixcbiAgICAgIEEgPSBBcnJheShtKSxcbiAgICAgIFIgPSBnZW4uemVyb3MobiksXG4gICAgICBNID0gMCwgdiwgaSwgajtcblxuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBBW2kqbitpXSA9IDA7XG4gICAgZm9yIChqPWkrMTsgajxuOyArK2opIHtcbiAgICAgIEFbaSpuK2pdID0gKHYgPSBNYXRoLmFicyhYW2ldIC0gWFtqXSkpO1xuICAgICAgQVtqKm4raV0gPSB2O1xuICAgICAgUltpXSArPSB2O1xuICAgICAgUltqXSArPSB2O1xuICAgIH1cbiAgfVxuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIE0gKz0gUltpXTtcbiAgICBSW2ldIC89IG47XG4gIH1cbiAgTSAvPSBtO1xuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIGZvciAoaj1pOyBqPG47ICsraikge1xuICAgICAgQVtpKm4ral0gKz0gTSAtIFJbaV0gLSBSW2pdO1xuICAgICAgQVtqKm4raV0gPSBBW2kqbitqXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gQTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIFNoYW5ub24gZW50cm9weSAobG9nIGJhc2UgMikgb2YgYW4gYXJyYXkgb2YgY291bnRzLlxuc3RhdHMuZW50cm9weSA9IGZ1bmN0aW9uKGNvdW50cywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgaSwgcCwgcyA9IDAsIEggPSAwLCBuID0gY291bnRzLmxlbmd0aDtcbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgcyArPSAoZiA/IGYoY291bnRzW2ldKSA6IGNvdW50c1tpXSk7XG4gIH1cbiAgaWYgKHMgPT09IDApIHJldHVybiAwO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBwID0gKGYgPyBmKGNvdW50c1tpXSkgOiBjb3VudHNbaV0pIC8gcztcbiAgICBpZiAocCkgSCArPSBwICogTWF0aC5sb2cocCk7XG4gIH1cbiAgcmV0dXJuIC1IIC8gTWF0aC5MTjI7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBtdXR1YWwgaW5mb3JtYXRpb24gYmV0d2VlbiB0d28gZGlzY3JldGUgdmFyaWFibGVzLlxuLy8gUmV0dXJucyBhbiBhcnJheSBvZiB0aGUgZm9ybSBbTUksIE1JX2Rpc3RhbmNlXSBcbi8vIE1JX2Rpc3RhbmNlIGlzIGRlZmluZWQgYXMgMSAtIEkoYSxiKSAvIEgoYSxiKS5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTXV0dWFsX2luZm9ybWF0aW9uXG5zdGF0cy5tdXR1YWwgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIsIGNvdW50cykge1xuICB2YXIgeCA9IGNvdW50cyA/IHZhbHVlcy5tYXAodXRpbC4kKGEpKSA6IHZhbHVlcyxcbiAgICAgIHkgPSBjb3VudHMgPyB2YWx1ZXMubWFwKHV0aWwuJChiKSkgOiBhLFxuICAgICAgeiA9IGNvdW50cyA/IHZhbHVlcy5tYXAodXRpbC4kKGNvdW50cykpIDogYjtcblxuICB2YXIgcHggPSB7fSxcbiAgICAgIHB5ID0ge30sXG4gICAgICBuID0gei5sZW5ndGgsXG4gICAgICBzID0gMCwgSSA9IDAsIEggPSAwLCBwLCB0LCBpO1xuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHB4W3hbaV1dID0gMDtcbiAgICBweVt5W2ldXSA9IDA7XG4gIH1cblxuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBweFt4W2ldXSArPSB6W2ldO1xuICAgIHB5W3lbaV1dICs9IHpbaV07XG4gICAgcyArPSB6W2ldO1xuICB9XG5cbiAgdCA9IDEgLyAocyAqIE1hdGguTE4yKTtcbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgaWYgKHpbaV0gPT09IDApIGNvbnRpbnVlO1xuICAgIHAgPSAocyAqIHpbaV0pIC8gKHB4W3hbaV1dICogcHlbeVtpXV0pO1xuICAgIEkgKz0geltpXSAqIHQgKiBNYXRoLmxvZyhwKTtcbiAgICBIICs9IHpbaV0gKiB0ICogTWF0aC5sb2coeltpXS9zKTtcbiAgfVxuXG4gIHJldHVybiBbSSwgMSArIEkvSF07XG59O1xuXG4vLyBDb21wdXRlIHRoZSBtdXR1YWwgaW5mb3JtYXRpb24gYmV0d2VlbiB0d28gZGlzY3JldGUgdmFyaWFibGVzLlxuc3RhdHMubXV0dWFsLmluZm8gPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIsIGNvdW50cykge1xuICByZXR1cm4gc3RhdHMubXV0dWFsKHZhbHVlcywgYSwgYiwgY291bnRzKVswXTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIG11dHVhbCBpbmZvcm1hdGlvbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byBkaXNjcmV0ZSB2YXJpYWJsZXMuXG4vLyBNSV9kaXN0YW5jZSBpcyBkZWZpbmVkIGFzIDEgLSBJKGEsYikgLyBIKGEsYikuXG5zdGF0cy5tdXR1YWwuZGlzdCA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYiwgY291bnRzKSB7XG4gIHJldHVybiBzdGF0cy5tdXR1YWwodmFsdWVzLCBhLCBiLCBjb3VudHMpWzFdO1xufTtcblxuLy8gQ29tcHV0ZSBhIHByb2ZpbGUgb2Ygc3VtbWFyeSBzdGF0aXN0aWNzIGZvciBhIHZhcmlhYmxlLlxuc3RhdHMucHJvZmlsZSA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICB2YXIgbWVhbiA9IDAsXG4gICAgICB2YWxpZCA9IDAsXG4gICAgICBtaXNzaW5nID0gMCxcbiAgICAgIGRpc3RpbmN0ID0gMCxcbiAgICAgIG1pbiA9IG51bGwsXG4gICAgICBtYXggPSBudWxsLFxuICAgICAgTTIgPSAwLFxuICAgICAgdmFscyA9IFtdLFxuICAgICAgdSA9IHt9LCBkZWx0YSwgc2QsIGksIHYsIHg7XG5cbiAgLy8gY29tcHV0ZSBzdW1tYXJ5IHN0YXRzXG4gIGZvciAoaT0wOyBpPHZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuXG4gICAgLy8gdXBkYXRlIHVuaXF1ZSB2YWx1ZXNcbiAgICB1W3ZdID0gKHYgaW4gdSkgPyB1W3ZdICsgMSA6IChkaXN0aW5jdCArPSAxLCAxKTtcblxuICAgIGlmICh2ID09IG51bGwpIHtcbiAgICAgICsrbWlzc2luZztcbiAgICB9IGVsc2UgaWYgKHV0aWwuaXNWYWxpZCh2KSkge1xuICAgICAgLy8gdXBkYXRlIHN0YXRzXG4gICAgICB4ID0gKHR5cGVvZiB2ID09PSAnc3RyaW5nJykgPyB2Lmxlbmd0aCA6IHY7XG4gICAgICBpZiAobWluPT09bnVsbCB8fCB4IDwgbWluKSBtaW4gPSB4O1xuICAgICAgaWYgKG1heD09PW51bGwgfHwgeCA+IG1heCkgbWF4ID0geDtcbiAgICAgIGRlbHRhID0geCAtIG1lYW47XG4gICAgICBtZWFuID0gbWVhbiArIGRlbHRhIC8gKCsrdmFsaWQpO1xuICAgICAgTTIgPSBNMiArIGRlbHRhICogKHggLSBtZWFuKTtcbiAgICAgIHZhbHMucHVzaCh4KTtcbiAgICB9XG4gIH1cbiAgTTIgPSBNMiAvICh2YWxpZCAtIDEpO1xuICBzZCA9IE1hdGguc3FydChNMik7XG5cbiAgLy8gc29ydCB2YWx1ZXMgZm9yIG1lZGlhbiBhbmQgaXFyXG4gIHZhbHMuc29ydCh1dGlsLmNtcCk7XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAgICAgdHlwZSh2YWx1ZXMsIGYpLFxuICAgIHVuaXF1ZTogICB1LFxuICAgIGNvdW50OiAgICB2YWx1ZXMubGVuZ3RoLFxuICAgIHZhbGlkOiAgICB2YWxpZCxcbiAgICBtaXNzaW5nOiAgbWlzc2luZyxcbiAgICBkaXN0aW5jdDogZGlzdGluY3QsXG4gICAgbWluOiAgICAgIG1pbixcbiAgICBtYXg6ICAgICAgbWF4LFxuICAgIG1lYW46ICAgICBtZWFuLFxuICAgIHN0ZGV2OiAgICBzZCxcbiAgICBtZWRpYW46ICAgKHYgPSBzdGF0cy5xdWFudGlsZSh2YWxzLCAwLjUpKSxcbiAgICBxMTogICAgICAgc3RhdHMucXVhbnRpbGUodmFscywgMC4yNSksXG4gICAgcTM6ICAgICAgIHN0YXRzLnF1YW50aWxlKHZhbHMsIDAuNzUpLFxuICAgIG1vZGVza2V3OiBzZCA9PT0gMCA/IDAgOiAobWVhbiAtIHYpIC8gc2RcbiAgfTtcbn07XG5cbi8vIENvbXB1dGUgcHJvZmlsZXMgZm9yIGFsbCB2YXJpYWJsZXMgaW4gYSBkYXRhIHNldC5cbnN0YXRzLnN1bW1hcnkgPSBmdW5jdGlvbihkYXRhLCBmaWVsZHMpIHtcbiAgZmllbGRzID0gZmllbGRzIHx8IHV0aWwua2V5cyhkYXRhWzBdKTtcbiAgdmFyIHMgPSBmaWVsZHMubWFwKGZ1bmN0aW9uKGYpIHtcbiAgICB2YXIgcCA9IHN0YXRzLnByb2ZpbGUoZGF0YSwgdXRpbC4kKGYpKTtcbiAgICByZXR1cm4gKHAuZmllbGQgPSBmLCBwKTtcbiAgfSk7XG4gIHJldHVybiAocy5fX3N1bW1hcnlfXyA9IHRydWUsIHMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdGF0czsiLCJ2YXIgZDNfdGltZSA9IHJlcXVpcmUoJ2QzLXRpbWUnKTtcblxudmFyIHRlbXBEYXRlID0gbmV3IERhdGUoKSxcbiAgICBiYXNlRGF0ZSA9IG5ldyBEYXRlKDAsIDAsIDEpLnNldEZ1bGxZZWFyKDApLCAvLyBKYW4gMSwgMCBBRFxuICAgIHV0Y0Jhc2VEYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMoMCwgMCwgMSkpLnNldFVUQ0Z1bGxZZWFyKDApO1xuXG5mdW5jdGlvbiBkYXRlKGQpIHtcbiAgcmV0dXJuICh0ZW1wRGF0ZS5zZXRUaW1lKCtkKSwgdGVtcERhdGUpO1xufVxuXG4vLyBjcmVhdGUgYSB0aW1lIHVuaXQgZW50cnlcbmZ1bmN0aW9uIGVudHJ5KHR5cGUsIGRhdGUsIHVuaXQsIHN0ZXAsIG1pbiwgbWF4KSB7XG4gIHZhciBlID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0ZTogZGF0ZSxcbiAgICB1bml0OiB1bml0XG4gIH07XG4gIGlmIChzdGVwKSB7XG4gICAgZS5zdGVwID0gc3RlcDtcbiAgfSBlbHNlIHtcbiAgICBlLm1pbnN0ZXAgPSAxO1xuICB9XG4gIGlmIChtaW4gIT0gbnVsbCkgZS5taW4gPSBtaW47XG4gIGlmIChtYXggIT0gbnVsbCkgZS5tYXggPSBtYXg7XG4gIHJldHVybiBlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGUodHlwZSwgdW5pdCwgYmFzZSwgc3RlcCwgbWluLCBtYXgpIHtcbiAgcmV0dXJuIGVudHJ5KHR5cGUsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gdW5pdC5vZmZzZXQoYmFzZSwgZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gdW5pdC5jb3VudChiYXNlLCBkKTsgfSxcbiAgICBzdGVwLCBtaW4sIG1heCk7XG59XG5cbnZhciBsb2NhbGUgPSBbXG4gIGNyZWF0ZSgnc2Vjb25kJywgZDNfdGltZS5zZWNvbmQsIGJhc2VEYXRlKSxcbiAgY3JlYXRlKCdtaW51dGUnLCBkM190aW1lLm1pbnV0ZSwgYmFzZURhdGUpLFxuICBjcmVhdGUoJ2hvdXInLCAgIGQzX3RpbWUuaG91ciwgICBiYXNlRGF0ZSksXG4gIGNyZWF0ZSgnZGF5JywgICAgZDNfdGltZS5kYXksICAgIGJhc2VEYXRlLCBbMSwgN10pLFxuICBjcmVhdGUoJ21vbnRoJywgIGQzX3RpbWUubW9udGgsICBiYXNlRGF0ZSwgWzEsIDMsIDZdKSxcbiAgY3JlYXRlKCd5ZWFyJywgICBkM190aW1lLnllYXIsICAgYmFzZURhdGUpLFxuXG4gIC8vIHBlcmlvZGljIHVuaXRzXG4gIGVudHJ5KCdzZWNvbmRzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCAxLCAwLCAwLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFNlY29uZHMoKTsgfSxcbiAgICBudWxsLCAwLCA1OVxuICApLFxuICBlbnRyeSgnbWludXRlcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoMTk3MCwgMCwgMSwgMCwgZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRNaW51dGVzKCk7IH0sXG4gICAgbnVsbCwgMCwgNTlcbiAgKSxcbiAgZW50cnkoJ2hvdXJzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCAxLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldEhvdXJzKCk7IH0sXG4gICAgbnVsbCwgMCwgMjNcbiAgKSxcbiAgZW50cnkoJ3dlZWtkYXlzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCA0K2QpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0RGF5KCk7IH0sXG4gICAgWzFdLCAwLCA2XG4gICksXG4gIGVudHJ5KCdkYXRlcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoMTk3MCwgMCwgZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXREYXRlKCk7IH0sXG4gICAgWzFdLCAxLCAzMVxuICApLFxuICBlbnRyeSgnbW9udGhzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCBkICUgMTIsIDEpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0TW9udGgoKTsgfSxcbiAgICBbMV0sIDAsIDExXG4gIClcbl07XG5cbnZhciB1dGMgPSBbXG4gIGNyZWF0ZSgnc2Vjb25kJywgZDNfdGltZS51dGNTZWNvbmQsIHV0Y0Jhc2VEYXRlKSxcbiAgY3JlYXRlKCdtaW51dGUnLCBkM190aW1lLnV0Y01pbnV0ZSwgdXRjQmFzZURhdGUpLFxuICBjcmVhdGUoJ2hvdXInLCAgIGQzX3RpbWUudXRjSG91ciwgICB1dGNCYXNlRGF0ZSksXG4gIGNyZWF0ZSgnZGF5JywgICAgZDNfdGltZS51dGNEYXksICAgIHV0Y0Jhc2VEYXRlLCBbMSwgN10pLFxuICBjcmVhdGUoJ21vbnRoJywgIGQzX3RpbWUudXRjTW9udGgsICB1dGNCYXNlRGF0ZSwgWzEsIDMsIDZdKSxcbiAgY3JlYXRlKCd5ZWFyJywgICBkM190aW1lLnV0Y1llYXIsICAgdXRjQmFzZURhdGUpLFxuXG4gIC8vIHBlcmlvZGljIHVuaXRzXG4gIGVudHJ5KCdzZWNvbmRzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCAxLCAwLCAwLCBkKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENTZWNvbmRzKCk7IH0sXG4gICAgbnVsbCwgMCwgNTlcbiAgKSxcbiAgZW50cnkoJ21pbnV0ZXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDEsIDAsIGQpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ01pbnV0ZXMoKTsgfSxcbiAgICBudWxsLCAwLCA1OVxuICApLFxuICBlbnRyeSgnaG91cnMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDEsIGQpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ0hvdXJzKCk7IH0sXG4gICAgbnVsbCwgMCwgMjNcbiAgKSxcbiAgZW50cnkoJ3dlZWtkYXlzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCA0K2QpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ0RheSgpOyB9LFxuICAgIFsxXSwgMCwgNlxuICApLFxuICBlbnRyeSgnZGF0ZXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIGQpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ0RhdGUoKTsgfSxcbiAgICBbMV0sIDEsIDMxXG4gICksXG4gIGVudHJ5KCdtb250aHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIGQgJSAxMiwgMSkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDTW9udGgoKTsgfSxcbiAgICBbMV0sIDAsIDExXG4gIClcbl07XG5cbnZhciBTVEVQUyA9IFtcbiAgWzMxNTM2ZTYsIDVdLCAgLy8gMS15ZWFyXG4gIFs3Nzc2ZTYsIDRdLCAgIC8vIDMtbW9udGhcbiAgWzI1OTJlNiwgNF0sICAgLy8gMS1tb250aFxuICBbMTIwOTZlNSwgM10sICAvLyAyLXdlZWtcbiAgWzYwNDhlNSwgM10sICAgLy8gMS13ZWVrXG4gIFsxNzI4ZTUsIDNdLCAgIC8vIDItZGF5XG4gIFs4NjRlNSwgM10sICAgIC8vIDEtZGF5XG4gIFs0MzJlNSwgMl0sICAgIC8vIDEyLWhvdXJcbiAgWzIxNmU1LCAyXSwgICAgLy8gNi1ob3VyXG4gIFsxMDhlNSwgMl0sICAgIC8vIDMtaG91clxuICBbMzZlNSwgMl0sICAgICAvLyAxLWhvdXJcbiAgWzE4ZTUsIDFdLCAgICAgLy8gMzAtbWludXRlXG4gIFs5ZTUsIDFdLCAgICAgIC8vIDE1LW1pbnV0ZVxuICBbM2U1LCAxXSwgICAgICAvLyA1LW1pbnV0ZVxuICBbNmU0LCAxXSwgICAgICAvLyAxLW1pbnV0ZVxuICBbM2U0LCAwXSwgICAgICAvLyAzMC1zZWNvbmRcbiAgWzE1ZTMsIDBdLCAgICAgLy8gMTUtc2Vjb25kXG4gIFs1ZTMsIDBdLCAgICAgIC8vIDUtc2Vjb25kXG4gIFsxZTMsIDBdICAgICAgIC8vIDEtc2Vjb25kXG5dO1xuXG5mdW5jdGlvbiBmaW5kKHVuaXRzLCBzcGFuLCBtaW5iLCBtYXhiKSB7XG4gIHZhciBzdGVwID0gU1RFUFNbMF0sIGksIG4sIGJpbnM7XG5cbiAgZm9yIChpPTEsIG49U1RFUFMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHN0ZXAgPSBTVEVQU1tpXTtcbiAgICBpZiAoc3BhbiA+IHN0ZXBbMF0pIHtcbiAgICAgIGJpbnMgPSBzcGFuIC8gc3RlcFswXTtcbiAgICAgIGlmIChiaW5zID4gbWF4Yikge1xuICAgICAgICByZXR1cm4gdW5pdHNbU1RFUFNbaS0xXVsxXV07XG4gICAgICB9XG4gICAgICBpZiAoYmlucyA+PSBtaW5iKSB7XG4gICAgICAgIHJldHVybiB1bml0c1tzdGVwWzFdXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuaXRzW1NURVBTW24tMV1bMV1dO1xufVxuXG5mdW5jdGlvbiB0b1VuaXRNYXAodW5pdHMpIHtcbiAgdmFyIG1hcCA9IHt9LCBpLCBuO1xuICBmb3IgKGk9MCwgbj11bml0cy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgbWFwW3VuaXRzW2ldLnR5cGVdID0gdW5pdHNbaV07XG4gIH1cbiAgbWFwLmZpbmQgPSBmdW5jdGlvbihzcGFuLCBtaW5iLCBtYXhiKSB7XG4gICAgcmV0dXJuIGZpbmQodW5pdHMsIHNwYW4sIG1pbmIsIG1heGIpO1xuICB9O1xuICByZXR1cm4gbWFwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvVW5pdE1hcChsb2NhbGUpO1xubW9kdWxlLmV4cG9ydHMudXRjID0gdG9Vbml0TWFwKHV0Yyk7XG4iLCJ2YXIgYnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJyksXG4gICAgdGltZSA9IHJlcXVpcmUoJy4vdGltZScpLFxuICAgIHV0YyA9IHRpbWUudXRjO1xuXG52YXIgdSA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIHV0aWxpdHkgZnVuY3Rpb25zXG5cbnZhciBGTkFNRSA9ICdfX25hbWVfXyc7XG5cbnUubmFtZWRmdW5jID0gZnVuY3Rpb24obmFtZSwgZikgeyByZXR1cm4gKGZbRk5BTUVdID0gbmFtZSwgZik7IH07XG5cbnUubmFtZSA9IGZ1bmN0aW9uKGYpIHsgcmV0dXJuIGY9PW51bGwgPyBudWxsIDogZltGTkFNRV07IH07XG5cbnUuaWRlbnRpdHkgPSBmdW5jdGlvbih4KSB7IHJldHVybiB4OyB9O1xuXG51LnRydWUgPSB1Lm5hbWVkZnVuYygndHJ1ZScsIGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZTsgfSk7XG5cbnUuZmFsc2UgPSB1Lm5hbWVkZnVuYygnZmFsc2UnLCBmdW5jdGlvbigpIHsgcmV0dXJuIGZhbHNlOyB9KTtcblxudS5kdXBsaWNhdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG59O1xuXG51LmVxdWFsID0gZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYSkgPT09IEpTT04uc3RyaW5naWZ5KGIpO1xufTtcblxudS5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgZm9yICh2YXIgeCwgbmFtZSwgaT0xLCBsZW49YXJndW1lbnRzLmxlbmd0aDsgaTxsZW47ICsraSkge1xuICAgIHggPSBhcmd1bWVudHNbaV07XG4gICAgZm9yIChuYW1lIGluIHgpIHsgb2JqW25hbWVdID0geFtuYW1lXTsgfVxuICB9XG4gIHJldHVybiBvYmo7XG59O1xuXG51Lmxlbmd0aCA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHggIT0gbnVsbCAmJiB4Lmxlbmd0aCAhPSBudWxsID8geC5sZW5ndGggOiBudWxsO1xufTtcblxudS5rZXlzID0gZnVuY3Rpb24oeCkge1xuICB2YXIga2V5cyA9IFtdLCBrO1xuICBmb3IgKGsgaW4geCkga2V5cy5wdXNoKGspO1xuICByZXR1cm4ga2V5cztcbn07XG5cbnUudmFscyA9IGZ1bmN0aW9uKHgpIHtcbiAgdmFyIHZhbHMgPSBbXSwgaztcbiAgZm9yIChrIGluIHgpIHZhbHMucHVzaCh4W2tdKTtcbiAgcmV0dXJuIHZhbHM7XG59O1xuXG51LnRvTWFwID0gZnVuY3Rpb24obGlzdCwgZikge1xuICByZXR1cm4gKGYgPSB1LiQoZikpID9cbiAgICBsaXN0LnJlZHVjZShmdW5jdGlvbihvYmosIHgpIHsgcmV0dXJuIChvYmpbZih4KV0gPSAxLCBvYmopOyB9LCB7fSkgOlxuICAgIGxpc3QucmVkdWNlKGZ1bmN0aW9uKG9iaiwgeCkgeyByZXR1cm4gKG9ialt4XSA9IDEsIG9iaik7IH0sIHt9KTtcbn07XG5cbnUua2V5c3RyID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gIC8vIHVzZSB0byBlbnN1cmUgY29uc2lzdGVudCBrZXkgZ2VuZXJhdGlvbiBhY3Jvc3MgbW9kdWxlc1xuICB2YXIgbiA9IHZhbHVlcy5sZW5ndGg7XG4gIGlmICghbikgcmV0dXJuICcnO1xuICBmb3IgKHZhciBzPVN0cmluZyh2YWx1ZXNbMF0pLCBpPTE7IGk8bjsgKytpKSB7XG4gICAgcyArPSAnfCcgKyBTdHJpbmcodmFsdWVzW2ldKTtcbiAgfVxuICByZXR1cm4gcztcbn07XG5cbi8vIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbnUuaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG59O1xuXG51LmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn07XG5cbnUuaXNTdHJpbmcgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBTdHJpbmddJztcbn07XG5cbnUuaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG51LmlzTnVtYmVyID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqID09PSAnbnVtYmVyJyB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE51bWJlcl0nO1xufTtcblxudS5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBCb29sZWFuXSc7XG59O1xuXG51LmlzRGF0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBEYXRlXSc7XG59O1xuXG51LmlzVmFsaWQgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIG9iaiA9PT0gb2JqO1xufTtcblxudS5pc0J1ZmZlciA9IChidWZmZXIuQnVmZmVyICYmIGJ1ZmZlci5CdWZmZXIuaXNCdWZmZXIpIHx8IHUuZmFsc2U7XG5cbi8vIHR5cGUgY29lcmNpb24gZnVuY3Rpb25zXG5cbnUubnVtYmVyID0gZnVuY3Rpb24ocykge1xuICByZXR1cm4gcyA9PSBudWxsIHx8IHMgPT09ICcnID8gbnVsbCA6ICtzO1xufTtcblxudS5ib29sZWFuID0gZnVuY3Rpb24ocykge1xuICByZXR1cm4gcyA9PSBudWxsIHx8IHMgPT09ICcnID8gbnVsbCA6IHM9PT0nZmFsc2UnID8gZmFsc2UgOiAhIXM7XG59O1xuXG51LmRhdGUgPSBmdW5jdGlvbihzKSB7XG4gIHJldHVybiBzID09IG51bGwgfHwgcyA9PT0gJycgPyBudWxsIDogRGF0ZS5wYXJzZShzKTtcbn07XG5cbnUuYXJyYXkgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiB4ICE9IG51bGwgPyAodS5pc0FycmF5KHgpID8geCA6IFt4XSkgOiBbXTtcbn07XG5cbnUuc3RyID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gdS5pc0FycmF5KHgpID8gJ1snICsgeC5tYXAodS5zdHIpICsgJ10nXG4gICAgOiB1LmlzT2JqZWN0KHgpID8gSlNPTi5zdHJpbmdpZnkoeClcbiAgICA6IHUuaXNTdHJpbmcoeCkgPyAoJ1xcJycrdXRpbF9lc2NhcGVfc3RyKHgpKydcXCcnKSA6IHg7XG59O1xuXG52YXIgZXNjYXBlX3N0cl9yZSA9IC8oXnxbXlxcXFxdKScvZztcblxuZnVuY3Rpb24gdXRpbF9lc2NhcGVfc3RyKHgpIHtcbiAgcmV0dXJuIHgucmVwbGFjZShlc2NhcGVfc3RyX3JlLCAnJDFcXFxcXFwnJyk7XG59XG5cbi8vIGRhdGEgYWNjZXNzIGZ1bmN0aW9uc1xuXG51LmZpZWxkID0gZnVuY3Rpb24oZikge1xuICByZXR1cm4gU3RyaW5nKGYpLnNwbGl0KCdcXFxcLicpXG4gICAgLm1hcChmdW5jdGlvbihkKSB7IHJldHVybiBkLnNwbGl0KCcuJyk7IH0pXG4gICAgLnJlZHVjZShmdW5jdGlvbihhLCBiKSB7XG4gICAgICBpZiAoYS5sZW5ndGgpIHsgYVthLmxlbmd0aC0xXSArPSAnLicgKyBiLnNoaWZ0KCk7IH1cbiAgICAgIGEucHVzaC5hcHBseShhLCBiKTtcbiAgICAgIHJldHVybiBhO1xuICAgIH0sIFtdKTtcbn07XG5cbnUuYWNjZXNzb3IgPSBmdW5jdGlvbihmKSB7XG4gIHZhciBzO1xuICByZXR1cm4gZj09bnVsbCB8fCB1LmlzRnVuY3Rpb24oZikgPyBmIDpcbiAgICB1Lm5hbWVkZnVuYyhmLCAocyA9IHUuZmllbGQoZikpLmxlbmd0aCA+IDEgP1xuICAgICAgZnVuY3Rpb24oeCkgeyByZXR1cm4gcy5yZWR1Y2UoZnVuY3Rpb24oeCxmKSB7IHJldHVybiB4W2ZdOyB9LCB4KTsgfSA6XG4gICAgICBmdW5jdGlvbih4KSB7IHJldHVybiB4W2ZdOyB9XG4gICAgKTtcbn07XG5cbi8vIHNob3J0LWN1dCBmb3IgYWNjZXNzb3JcbnUuJCA9IHUuYWNjZXNzb3I7XG5cbnUubXV0YXRvciA9IGZ1bmN0aW9uKGYpIHtcbiAgdmFyIHM7XG4gIHJldHVybiB1LmlzU3RyaW5nKGYpICYmIChzPXUuZmllbGQoZikpLmxlbmd0aCA+IDEgP1xuICAgIGZ1bmN0aW9uKHgsIHYpIHtcbiAgICAgIGZvciAodmFyIGk9MDsgaTxzLmxlbmd0aC0xOyArK2kpIHggPSB4W3NbaV1dO1xuICAgICAgeFtzW2ldXSA9IHY7XG4gICAgfSA6XG4gICAgZnVuY3Rpb24oeCwgdikgeyB4W2ZdID0gdjsgfTtcbn07XG5cblxudS4kZnVuYyA9IGZ1bmN0aW9uKG5hbWUsIG9wKSB7XG4gIHJldHVybiBmdW5jdGlvbihmKSB7XG4gICAgZiA9IHUuJChmKSB8fCB1LmlkZW50aXR5O1xuICAgIHZhciBuID0gbmFtZSArICh1Lm5hbWUoZikgPyAnXycrdS5uYW1lKGYpIDogJycpO1xuICAgIHJldHVybiB1Lm5hbWVkZnVuYyhuLCBmdW5jdGlvbihkKSB7IHJldHVybiBvcChmKGQpKTsgfSk7XG4gIH07XG59O1xuXG51LiR2YWxpZCAgPSB1LiRmdW5jKCd2YWxpZCcsIHUuaXNWYWxpZCk7XG51LiRsZW5ndGggPSB1LiRmdW5jKCdsZW5ndGgnLCB1Lmxlbmd0aCk7XG5cbnUuJGluID0gZnVuY3Rpb24oZiwgdmFsdWVzKSB7XG4gIGYgPSB1LiQoZik7XG4gIHZhciBtYXAgPSB1LmlzQXJyYXkodmFsdWVzKSA/IHUudG9NYXAodmFsdWVzKSA6IHZhbHVlcztcbiAgcmV0dXJuIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICEhbWFwW2YoZCldOyB9O1xufTtcblxudS4keWVhciAgID0gdS4kZnVuYygneWVhcicsIHRpbWUueWVhci51bml0KTtcbnUuJG1vbnRoICA9IHUuJGZ1bmMoJ21vbnRoJywgdGltZS5tb250aHMudW5pdCk7XG51LiRkYXRlICAgPSB1LiRmdW5jKCdkYXRlJywgdGltZS5kYXRlcy51bml0KTtcbnUuJGRheSAgICA9IHUuJGZ1bmMoJ2RheScsIHRpbWUud2Vla2RheXMudW5pdCk7XG51LiRob3VyICAgPSB1LiRmdW5jKCdob3VyJywgdGltZS5ob3Vycy51bml0KTtcbnUuJG1pbnV0ZSA9IHUuJGZ1bmMoJ21pbnV0ZScsIHRpbWUubWludXRlcy51bml0KTtcbnUuJHNlY29uZCA9IHUuJGZ1bmMoJ3NlY29uZCcsIHRpbWUuc2Vjb25kcy51bml0KTtcblxudS4kdXRjWWVhciAgID0gdS4kZnVuYygndXRjWWVhcicsIHV0Yy55ZWFyLnVuaXQpO1xudS4kdXRjTW9udGggID0gdS4kZnVuYygndXRjTW9udGgnLCB1dGMubW9udGhzLnVuaXQpO1xudS4kdXRjRGF0ZSAgID0gdS4kZnVuYygndXRjRGF0ZScsIHV0Yy5kYXRlcy51bml0KTtcbnUuJHV0Y0RheSAgICA9IHUuJGZ1bmMoJ3V0Y0RheScsIHV0Yy53ZWVrZGF5cy51bml0KTtcbnUuJHV0Y0hvdXIgICA9IHUuJGZ1bmMoJ3V0Y0hvdXInLCB1dGMuaG91cnMudW5pdCk7XG51LiR1dGNNaW51dGUgPSB1LiRmdW5jKCd1dGNNaW51dGUnLCB1dGMubWludXRlcy51bml0KTtcbnUuJHV0Y1NlY29uZCA9IHUuJGZ1bmMoJ3V0Y1NlY29uZCcsIHV0Yy5zZWNvbmRzLnVuaXQpO1xuXG4vLyBjb21wYXJpc29uIC8gc29ydGluZyBmdW5jdGlvbnNcblxudS5jb21wYXJhdG9yID0gZnVuY3Rpb24oc29ydCkge1xuICB2YXIgc2lnbiA9IFtdO1xuICBpZiAoc29ydCA9PT0gdW5kZWZpbmVkKSBzb3J0ID0gW107XG4gIHNvcnQgPSB1LmFycmF5KHNvcnQpLm1hcChmdW5jdGlvbihmKSB7XG4gICAgdmFyIHMgPSAxO1xuICAgIGlmICAgICAgKGZbMF0gPT09ICctJykgeyBzID0gLTE7IGYgPSBmLnNsaWNlKDEpOyB9XG4gICAgZWxzZSBpZiAoZlswXSA9PT0gJysnKSB7IHMgPSArMTsgZiA9IGYuc2xpY2UoMSk7IH1cbiAgICBzaWduLnB1c2gocyk7XG4gICAgcmV0dXJuIHUuYWNjZXNzb3IoZik7XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24oYSxiKSB7XG4gICAgdmFyIGksIG4sIGYsIHgsIHk7XG4gICAgZm9yIChpPTAsIG49c29ydC5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgICBmID0gc29ydFtpXTsgeCA9IGYoYSk7IHkgPSBmKGIpO1xuICAgICAgaWYgKHggPCB5KSByZXR1cm4gLTEgKiBzaWduW2ldO1xuICAgICAgaWYgKHggPiB5KSByZXR1cm4gc2lnbltpXTtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH07XG59O1xuXG51LmNtcCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgaWYgKGEgPCBiKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKGEgPiBiKSB7XG4gICAgcmV0dXJuIDE7XG4gIH0gZWxzZSBpZiAoYSA+PSBiKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAoYSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAtMTtcbiAgfSBlbHNlIGlmIChiID09PSBudWxsKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcmV0dXJuIE5hTjtcbn07XG5cbnUubnVtY21wID0gZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYSAtIGI7IH07XG5cbnUuc3RhYmxlc29ydCA9IGZ1bmN0aW9uKGFycmF5LCBzb3J0QnksIGtleUZuKSB7XG4gIHZhciBpbmRpY2VzID0gYXJyYXkucmVkdWNlKGZ1bmN0aW9uKGlkeCwgdiwgaSkge1xuICAgIHJldHVybiAoaWR4W2tleUZuKHYpXSA9IGksIGlkeCk7XG4gIH0sIHt9KTtcblxuICBhcnJheS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgc2EgPSBzb3J0QnkoYSksXG4gICAgICAgIHNiID0gc29ydEJ5KGIpO1xuICAgIHJldHVybiBzYSA8IHNiID8gLTEgOiBzYSA+IHNiID8gMVxuICAgICAgICAgOiAoaW5kaWNlc1trZXlGbihhKV0gLSBpbmRpY2VzW2tleUZuKGIpXSk7XG4gIH0pO1xuXG4gIHJldHVybiBhcnJheTtcbn07XG5cblxuLy8gc3RyaW5nIGZ1bmN0aW9uc1xuXG51LnBhZCA9IGZ1bmN0aW9uKHMsIGxlbmd0aCwgcG9zLCBwYWRjaGFyKSB7XG4gIHBhZGNoYXIgPSBwYWRjaGFyIHx8IFwiIFwiO1xuICB2YXIgZCA9IGxlbmd0aCAtIHMubGVuZ3RoO1xuICBpZiAoZCA8PSAwKSByZXR1cm4gcztcbiAgc3dpdGNoIChwb3MpIHtcbiAgICBjYXNlICdsZWZ0JzpcbiAgICAgIHJldHVybiBzdHJyZXAoZCwgcGFkY2hhcikgKyBzO1xuICAgIGNhc2UgJ21pZGRsZSc6XG4gICAgY2FzZSAnY2VudGVyJzpcbiAgICAgIHJldHVybiBzdHJyZXAoTWF0aC5mbG9vcihkLzIpLCBwYWRjaGFyKSArXG4gICAgICAgICBzICsgc3RycmVwKE1hdGguY2VpbChkLzIpLCBwYWRjaGFyKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHMgKyBzdHJyZXAoZCwgcGFkY2hhcik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHN0cnJlcChuLCBzdHIpIHtcbiAgdmFyIHMgPSBcIlwiLCBpO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHMgKz0gc3RyO1xuICByZXR1cm4gcztcbn1cblxudS50cnVuY2F0ZSA9IGZ1bmN0aW9uKHMsIGxlbmd0aCwgcG9zLCB3b3JkLCBlbGxpcHNpcykge1xuICB2YXIgbGVuID0gcy5sZW5ndGg7XG4gIGlmIChsZW4gPD0gbGVuZ3RoKSByZXR1cm4gcztcbiAgZWxsaXBzaXMgPSBlbGxpcHNpcyAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKGVsbGlwc2lzKSA6ICdcXHUyMDI2JztcbiAgdmFyIGwgPSBNYXRoLm1heCgwLCBsZW5ndGggLSBlbGxpcHNpcy5sZW5ndGgpO1xuXG4gIHN3aXRjaCAocG9zKSB7XG4gICAgY2FzZSAnbGVmdCc6XG4gICAgICByZXR1cm4gZWxsaXBzaXMgKyAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbCwxKSA6IHMuc2xpY2UobGVuLWwpKTtcbiAgICBjYXNlICdtaWRkbGUnOlxuICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICB2YXIgbDEgPSBNYXRoLmNlaWwobC8yKSwgbDIgPSBNYXRoLmZsb29yKGwvMik7XG4gICAgICByZXR1cm4gKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwxKSA6IHMuc2xpY2UoMCxsMSkpICtcbiAgICAgICAgZWxsaXBzaXMgKyAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbDIsMSkgOiBzLnNsaWNlKGxlbi1sMikpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwpIDogcy5zbGljZSgwLGwpKSArIGVsbGlwc2lzO1xuICB9XG59O1xuXG5mdW5jdGlvbiB0cnVuY2F0ZU9uV29yZChzLCBsZW4sIHJldikge1xuICB2YXIgY250ID0gMCwgdG9rID0gcy5zcGxpdCh0cnVuY2F0ZV93b3JkX3JlKTtcbiAgaWYgKHJldikge1xuICAgIHMgPSAodG9rID0gdG9rLnJldmVyc2UoKSlcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24odykgeyBjbnQgKz0gdy5sZW5ndGg7IHJldHVybiBjbnQgPD0gbGVuOyB9KVxuICAgICAgLnJldmVyc2UoKTtcbiAgfSBlbHNlIHtcbiAgICBzID0gdG9rLmZpbHRlcihmdW5jdGlvbih3KSB7IGNudCArPSB3Lmxlbmd0aDsgcmV0dXJuIGNudCA8PSBsZW47IH0pO1xuICB9XG4gIHJldHVybiBzLmxlbmd0aCA/IHMuam9pbignJykudHJpbSgpIDogdG9rWzBdLnNsaWNlKDAsIGxlbik7XG59XG5cbnZhciB0cnVuY2F0ZV93b3JkX3JlID0gLyhbXFx1MDAwOVxcdTAwMEFcXHUwMDBCXFx1MDAwQ1xcdTAwMERcXHUwMDIwXFx1MDBBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTIwMjhcXHUyMDI5XFx1MzAwMFxcdUZFRkZdKS87XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vZ2xvYmFscycpO1xuXG52YXIgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICB2bGZpZWxkID0gcmVxdWlyZSgnLi9maWVsZCcpLFxuICB2bGVuYyA9IHJlcXVpcmUoJy4vZW5jJyksXG4gIHNjaGVtYSA9IHJlcXVpcmUoJy4vc2NoZW1hL3NjaGVtYScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gRW5jb2Rpbmcoc3BlYywgdGhlbWUpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSBzY2hlbWEuaW5zdGFudGlhdGUoKSxcbiAgICAgIHNwZWNFeHRlbmRlZCA9IHNjaGVtYS51dGlsLm1lcmdlKGRlZmF1bHRzLCB0aGVtZSB8fCB7fSwgc3BlYykgO1xuXG4gICAgdGhpcy5fZGF0YSA9IHNwZWNFeHRlbmRlZC5kYXRhO1xuICAgIHRoaXMuX21hcmt0eXBlID0gc3BlY0V4dGVuZGVkLm1hcmt0eXBlO1xuICAgIHRoaXMuX2VuYyA9IHNwZWNFeHRlbmRlZC5lbmNvZGluZztcbiAgICB0aGlzLl9jb25maWcgPSBzcGVjRXh0ZW5kZWQuY29uZmlnO1xuICAgIHRoaXMuX2ZpbHRlciA9IHNwZWNFeHRlbmRlZC5maWx0ZXI7XG4gICAgLy8gdGhpcy5fdmVnYTIgPSB0cnVlO1xuICB9XG5cbiAgdmFyIHByb3RvID0gRW5jb2RpbmcucHJvdG90eXBlO1xuXG4gIEVuY29kaW5nLmZyb21TaG9ydGhhbmQgPSBmdW5jdGlvbihzaG9ydGhhbmQsIGRhdGEsIGNvbmZpZywgdGhlbWUpIHtcbiAgICB2YXIgYyA9IGNvbnN0cy5zaG9ydGhhbmQsXG4gICAgICAgIHNwbGl0ID0gc2hvcnRoYW5kLnNwbGl0KGMuZGVsaW0pLFxuICAgICAgICBtYXJrdHlwZSA9IHNwbGl0LnNoaWZ0KCkuc3BsaXQoYy5hc3NpZ24pWzFdLnRyaW0oKSxcbiAgICAgICAgZW5jID0gdmxlbmMuZnJvbVNob3J0aGFuZChzcGxpdCk7XG5cbiAgICByZXR1cm4gbmV3IEVuY29kaW5nKHtcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBtYXJrdHlwZTogbWFya3R5cGUsXG4gICAgICBlbmNvZGluZzogZW5jLFxuICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICBmaWx0ZXI6IFtdXG4gICAgfSwgdGhlbWUpO1xuICB9O1xuXG4gIEVuY29kaW5nLmZyb21TcGVjID0gZnVuY3Rpb24oc3BlYywgdGhlbWUpIHtcbiAgICByZXR1cm4gbmV3IEVuY29kaW5nKHNwZWMsIHRoZW1lKTtcbiAgfTtcblxuICBwcm90by50b1Nob3J0aGFuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjID0gY29uc3RzLnNob3J0aGFuZDtcbiAgICByZXR1cm4gJ21hcmsnICsgYy5hc3NpZ24gKyB0aGlzLl9tYXJrdHlwZSArXG4gICAgICBjLmRlbGltICsgdmxlbmMuc2hvcnRoYW5kKHRoaXMuX2VuYyk7XG4gIH07XG5cbiAgRW5jb2Rpbmcuc2hvcnRoYW5kID0gZnVuY3Rpb24gKHNwZWMpIHtcbiAgICB2YXIgYyA9IGNvbnN0cy5zaG9ydGhhbmQ7XG4gICAgcmV0dXJuICdtYXJrJyArIGMuYXNzaWduICsgc3BlYy5tYXJrdHlwZSArXG4gICAgICBjLmRlbGltICsgdmxlbmMuc2hvcnRoYW5kKHNwZWMuZW5jb2RpbmcpO1xuICB9O1xuXG4gIEVuY29kaW5nLnNwZWNGcm9tU2hvcnRoYW5kID0gZnVuY3Rpb24oc2hvcnRoYW5kLCBkYXRhLCBjb25maWcsIGV4Y2x1ZGVDb25maWcpIHtcbiAgICByZXR1cm4gRW5jb2RpbmcuZnJvbVNob3J0aGFuZChzaG9ydGhhbmQsIGRhdGEsIGNvbmZpZykudG9TcGVjKGV4Y2x1ZGVDb25maWcpO1xuICB9O1xuXG4gIHByb3RvLnRvU3BlYyA9IGZ1bmN0aW9uKGV4Y2x1ZGVDb25maWcsIGV4Y2x1ZGVEYXRhKSB7XG4gICAgdmFyIGVuYyA9IHV0aWwuZHVwbGljYXRlKHRoaXMuX2VuYyksXG4gICAgICBzcGVjO1xuXG4gICAgc3BlYyA9IHtcbiAgICAgIG1hcmt0eXBlOiB0aGlzLl9tYXJrdHlwZSxcbiAgICAgIGVuY29kaW5nOiBlbmMsXG4gICAgICBmaWx0ZXI6IHRoaXMuX2ZpbHRlclxuICAgIH07XG5cbiAgICBpZiAoIWV4Y2x1ZGVDb25maWcpIHtcbiAgICAgIHNwZWMuY29uZmlnID0gdXRpbC5kdXBsaWNhdGUodGhpcy5fY29uZmlnKTtcbiAgICB9XG5cbiAgICBpZiAoIWV4Y2x1ZGVEYXRhKSB7XG4gICAgICBzcGVjLmRhdGEgPSB1dGlsLmR1cGxpY2F0ZSh0aGlzLl9kYXRhKTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgZGVmYXVsdHNcbiAgICB2YXIgZGVmYXVsdHMgPSBzY2hlbWEuaW5zdGFudGlhdGUoKTtcbiAgICByZXR1cm4gc2NoZW1hLnV0aWwuc3VidHJhY3Qoc3BlYywgZGVmYXVsdHMpO1xuICB9O1xuXG5cbiAgcHJvdG8ubWFya3R5cGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFya3R5cGU7XG4gIH07XG5cbiAgcHJvdG8uaXMgPSBmdW5jdGlvbihtKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcmt0eXBlID09PSBtO1xuICB9O1xuXG4gIHByb3RvLmhhcyA9IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgICAvLyBlcXVpdmFsZW50IHRvIGNhbGxpbmcgdmxlbmMuaGFzKHRoaXMuX2VuYywgZW5jVHlwZSlcbiAgICByZXR1cm4gdGhpcy5fZW5jW2VuY1R5cGVdLm5hbWUgIT09IHVuZGVmaW5lZDtcbiAgfTtcblxuICBwcm90by5maWVsZCA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF07XG4gIH07XG5cbiAgcHJvdG8uZmlsdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbHRlck51bGwgPSBbXSxcbiAgICAgIGZpZWxkcyA9IHRoaXMuZmllbGRzKCksXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIHV0aWwuZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkTGlzdCwgZmllbGROYW1lKSB7XG4gICAgICBpZiAoZmllbGROYW1lID09PSAnKicpIHJldHVybjsgLy9jb3VudFxuXG4gICAgICBpZiAoKHNlbGYuY29uZmlnKCdmaWx0ZXJOdWxsJykuUSAmJiBmaWVsZExpc3QuY29udGFpbnNUeXBlW1FdKSB8fFxuICAgICAgICAgIChzZWxmLmNvbmZpZygnZmlsdGVyTnVsbCcpLlQgJiYgZmllbGRMaXN0LmNvbnRhaW5zVHlwZVtUXSkgfHxcbiAgICAgICAgICAoc2VsZi5jb25maWcoJ2ZpbHRlck51bGwnKS5PICYmIGZpZWxkTGlzdC5jb250YWluc1R5cGVbT10pIHx8XG4gICAgICAgICAgKHNlbGYuY29uZmlnKCdmaWx0ZXJOdWxsJykuTiAmJiBmaWVsZExpc3QuY29udGFpbnNUeXBlW05dKSkge1xuICAgICAgICBmaWx0ZXJOdWxsLnB1c2goe1xuICAgICAgICAgIG9wZXJhbmRzOiBbZmllbGROYW1lXSxcbiAgICAgICAgICBvcGVyYXRvcjogJ25vdE51bGwnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZpbHRlck51bGwuY29uY2F0KHRoaXMuX2ZpbHRlcik7XG4gIH07XG5cbiAgLy8gZ2V0IFwiZmllbGRcIiByZWZlcmVuY2UgZm9yIHZlZ2FcbiAgcHJvdG8uZmllbGRSZWYgPSBmdW5jdGlvbihldCwgb3B0KSB7XG4gICAgb3B0ID0gb3B0IHx8IHt9O1xuICAgIG9wdC5kYXRhID0gIXRoaXMuX3ZlZ2EyICYmIChvcHQuZGF0YSAhPT0gZmFsc2UpO1xuICAgIHJldHVybiB2bGZpZWxkLmZpZWxkUmVmKHRoaXMuX2VuY1tldF0sIG9wdCk7XG4gIH07XG5cbiAgcHJvdG8uZmllbGROYW1lID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5uYW1lO1xuICB9O1xuXG4gIC8qXG4gICAqIHJldHVybiBrZXktdmFsdWUgcGFpcnMgb2YgZmllbGQgbmFtZSBhbmQgbGlzdCBvZiBmaWVsZHMgb2YgdGhhdCBmaWVsZCBuYW1lXG4gICAqL1xuICBwcm90by5maWVsZHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmxlbmMuZmllbGRzKHRoaXMuX2VuYyk7XG4gIH07XG5cbiAgcHJvdG8uZmllbGRUaXRsZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgaWYgKHZsZmllbGQuaXNDb3VudCh0aGlzLl9lbmNbZXRdKSkge1xuICAgICAgcmV0dXJuIHZsZmllbGQuY291bnQuZGlzcGxheU5hbWU7XG4gICAgfVxuICAgIHZhciBmbiA9IHRoaXMuX2VuY1tldF0uYWdncmVnYXRlIHx8IHRoaXMuX2VuY1tldF0udGltZVVuaXQgfHwgKHRoaXMuX2VuY1tldF0uYmluICYmICdiaW4nKTtcbiAgICBpZiAoZm4pIHtcbiAgICAgIHZhciB1cHBlcmNhc2UgPSBmbiA9PT0gJ2F2ZycgPyAnTUVBTicgOmZuLnRvVXBwZXJDYXNlKCk7XG4gICAgICByZXR1cm4gdXBwZXJjYXNlICsgJygnICsgdGhpcy5fZW5jW2V0XS5uYW1lICsgJyknO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5uYW1lO1xuICAgIH1cbiAgfTtcblxuICBwcm90by5zY2FsZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF0uc2NhbGUgfHwge307XG4gIH07XG5cbiAgcHJvdG8uYXhpcyA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF0uYXhpcyB8fCB7fTtcbiAgfTtcblxuICBwcm90by5iYW5kU2l6ZSA9IGZ1bmN0aW9uKGVuY1R5cGUsIHVzZVNtYWxsQmFuZCkge1xuICAgIHVzZVNtYWxsQmFuZCA9IHVzZVNtYWxsQmFuZCB8fFxuICAgICAgLy9pc0JhbmRJblNtYWxsTXVsdGlwbGVzXG4gICAgICAoZW5jVHlwZSA9PT0gWSAmJiB0aGlzLmhhcyhST1cpICYmIHRoaXMuaGFzKFkpKSB8fFxuICAgICAgKGVuY1R5cGUgPT09IFggJiYgdGhpcy5oYXMoQ09MKSAmJiB0aGlzLmhhcyhYKSk7XG5cbiAgICAvLyBpZiBiYW5kLnNpemUgaXMgZXhwbGljaXRseSBzcGVjaWZpZWQsIGZvbGxvdyB0aGUgc3BlY2lmaWNhdGlvbiwgb3RoZXJ3aXNlIGRyYXcgdmFsdWUgZnJvbSBjb25maWcuXG4gICAgcmV0dXJuIHRoaXMuZmllbGQoZW5jVHlwZSkuYmFuZC5zaXplIHx8XG4gICAgICB0aGlzLmNvbmZpZyh1c2VTbWFsbEJhbmQgPyAnc21hbGxCYW5kU2l6ZScgOiAnbGFyZ2VCYW5kU2l6ZScpO1xuICB9O1xuXG4gIHByb3RvLmFnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF0uYWdncmVnYXRlO1xuICB9O1xuXG4gIC8vIHJldHVybnMgZmFsc2UgaWYgYmlubmluZyBpcyBkaXNhYmxlZCwgb3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGJpbm5pbmcgcHJvcGVydGllc1xuICBwcm90by5iaW4gPSBmdW5jdGlvbihldCkge1xuICAgIHZhciBiaW4gPSB0aGlzLl9lbmNbZXRdLmJpbjtcbiAgICBpZiAoYmluID09PSB7fSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAoYmluID09PSB0cnVlKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWF4Ymluczogc2NoZW1hLk1BWEJJTlNfREVGQVVMVFxuICAgICAgfTtcbiAgICByZXR1cm4gYmluO1xuICB9O1xuXG4gIHByb3RvLnZhbHVlID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS52YWx1ZTtcbiAgfTtcblxuICBwcm90by5udW1iZXJGb3JtYXQgPSBmdW5jdGlvbihmaWVsZFN0YXRzKSB7XG4gICAgdmFyIGZvcm1hdENvbmZpZyA9IGZpZWxkU3RhdHMubWF4ID4gdGhpcy5jb25maWcoJ21heFNtYWxsTnVtYmVyJykgP1xuICAgICAgJ2xhcmdlTnVtYmVyRm9ybWF0JzogJ3NtYWxsTnVtYmVyRm9ybWF0JztcbiAgICByZXR1cm4gdGhpcy5jb25maWcoZm9ybWF0Q29uZmlnKTtcbiAgfTtcblxuICBwcm90by5zb3J0ID0gZnVuY3Rpb24oZXQsIHN0YXRzKSB7XG4gICAgdmFyIHNvcnQgPSB0aGlzLl9lbmNbZXRdLnNvcnQsXG4gICAgICBlbmMgPSB0aGlzLl9lbmMsXG4gICAgICBpc1R5cGVzID0gdmxmaWVsZC5pc1R5cGVzO1xuXG4gICAgaWYgKCghc29ydCB8fCBzb3J0Lmxlbmd0aD09PTApICYmXG4gICAgICAgIC8vIEZJWE1FXG4gICAgICAgIEVuY29kaW5nLnRvZ2dsZVNvcnQuc3VwcG9ydCh7ZW5jb2Rpbmc6dGhpcy5fZW5jfSwgc3RhdHMsIHRydWUpICYmIC8vSEFDS1xuICAgICAgICB0aGlzLmNvbmZpZygndG9nZ2xlU29ydCcpID09PSBRXG4gICAgICApIHtcbiAgICAgIHZhciBxRmllbGQgPSBpc1R5cGVzKGVuYy54LCBbTiwgT10pID8gZW5jLnkgOiBlbmMueDtcblxuICAgICAgaWYgKGlzVHlwZXMoZW5jW2V0XSwgW04sIE9dKSkge1xuICAgICAgICBzb3J0ID0gW3tcbiAgICAgICAgICBuYW1lOiBxRmllbGQubmFtZSxcbiAgICAgICAgICBhZ2dyZWdhdGU6IHFGaWVsZC5hZ2dyZWdhdGUsXG4gICAgICAgICAgdHlwZTogcUZpZWxkLnR5cGUsXG4gICAgICAgICAgcmV2ZXJzZTogdHJ1ZVxuICAgICAgICB9XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc29ydDtcbiAgfTtcblxuICBwcm90by5tYXAgPSBmdW5jdGlvbihmKSB7XG4gICAgcmV0dXJuIHZsZW5jLm1hcCh0aGlzLl9lbmMsIGYpO1xuICB9O1xuXG4gIHByb3RvLnJlZHVjZSA9IGZ1bmN0aW9uKGYsIGluaXQpIHtcbiAgICByZXR1cm4gdmxlbmMucmVkdWNlKHRoaXMuX2VuYywgZiwgaW5pdCk7XG4gIH07XG5cbiAgcHJvdG8uZm9yRWFjaCA9IGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gdmxlbmMuZm9yRWFjaCh0aGlzLl9lbmMsIGYpO1xuICB9O1xuXG4gIHByb3RvLnR5cGUgPSBmdW5jdGlvbihldCkge1xuICAgIHJldHVybiB0aGlzLmhhcyhldCkgPyB0aGlzLl9lbmNbZXRdLnR5cGUgOiBudWxsO1xuICB9O1xuXG4gIHByb3RvLmlzVHlwZSA9IGZ1bmN0aW9uKGV0LCB0eXBlKSB7XG4gICAgdmFyIGZpZWxkID0gdGhpcy5maWVsZChldCk7XG4gICAgcmV0dXJuIGZpZWxkICYmIHZsZmllbGQuaXNUeXBlKGZpZWxkLCB0eXBlKTtcbiAgfTtcblxuXG4gIHByb3RvLmlzVHlwZXMgPSBmdW5jdGlvbihldCwgdHlwZSkge1xuICAgIHZhciBmaWVsZCA9IHRoaXMuZmllbGQoZXQpO1xuICAgIHJldHVybiBmaWVsZCAmJiB2bGZpZWxkLmlzVHlwZXMoZmllbGQsIHR5cGUpO1xuICB9O1xuXG4gIEVuY29kaW5nLmlzT3JkaW5hbFNjYWxlID0gZnVuY3Rpb24oZW5jb2RpbmcsIGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdmxmaWVsZC5pc09yZGluYWxTY2FsZShlbmNvZGluZy5maWVsZChlbmNUeXBlKSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNEaW1lbnNpb24gPSBmdW5jdGlvbihlbmNvZGluZywgZW5jVHlwZSkge1xuICAgIHJldHVybiB2bGZpZWxkLmlzRGltZW5zaW9uKGVuY29kaW5nLmZpZWxkKGVuY1R5cGUpKTtcbiAgfTtcblxuICBFbmNvZGluZy5pc01lYXN1cmUgPSBmdW5jdGlvbihlbmNvZGluZywgZW5jVHlwZSkge1xuICAgIHJldHVybiB2bGZpZWxkLmlzTWVhc3VyZShlbmNvZGluZy5maWVsZChlbmNUeXBlKSk7XG4gIH07XG5cbiAgcHJvdG8uaXNPcmRpbmFsU2NhbGUgPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGVuY1R5cGUpICYmIEVuY29kaW5nLmlzT3JkaW5hbFNjYWxlKHRoaXMsIGVuY1R5cGUpO1xuICB9O1xuXG4gIHByb3RvLmlzRGltZW5zaW9uID0gZnVuY3Rpb24oZW5jVHlwZSkge1xuICAgIHJldHVybiB0aGlzLmhhcyhlbmNUeXBlKSAmJiBFbmNvZGluZy5pc0RpbWVuc2lvbih0aGlzLCBlbmNUeXBlKTtcbiAgfTtcblxuICBwcm90by5pc01lYXN1cmUgPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGVuY1R5cGUpICYmIEVuY29kaW5nLmlzTWVhc3VyZSh0aGlzLCBlbmNUeXBlKTtcbiAgfTtcblxuICBwcm90by5pc0FnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2bGVuYy5pc0FnZ3JlZ2F0ZSh0aGlzLl9lbmMpO1xuICB9O1xuXG4gIHByb3RvLmRhdGFUYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlzQWdncmVnYXRlKCkgPyBBR0dSRUdBVEUgOiBSQVc7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNBZ2dyZWdhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHZsZW5jLmlzQWdncmVnYXRlKHNwZWMuZW5jb2RpbmcpO1xuICB9O1xuXG4gIEVuY29kaW5nLmFsd2F5c05vT2NjbHVzaW9uID0gZnVuY3Rpb24oc3BlYykge1xuICAgIC8vIEZJWE1FIHJhdyBPeFEgd2l0aCAjIG9mIHJvd3MgPSAjIG9mIE9cbiAgICByZXR1cm4gdmxlbmMuaXNBZ2dyZWdhdGUoc3BlYy5lbmNvZGluZyk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNTdGFjayA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICAvLyBGSVhNRSB1cGRhdGUgdGhpcyBvbmNlIHdlIGhhdmUgY29udHJvbCBmb3Igc3RhY2sgLi4uXG4gICAgcmV0dXJuIChzcGVjLm1hcmt0eXBlID09PSAnYmFyJyB8fCBzcGVjLm1hcmt0eXBlID09PSAnYXJlYScpICYmXG4gICAgICBzcGVjLmVuY29kaW5nLmNvbG9yO1xuICB9O1xuXG4gIHByb3RvLmlzU3RhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBGSVhNRSB1cGRhdGUgdGhpcyBvbmNlIHdlIGhhdmUgY29udHJvbCBmb3Igc3RhY2sgLi4uXG4gICAgcmV0dXJuICh0aGlzLmlzKCdiYXInKSB8fCB0aGlzLmlzKCdhcmVhJykpICYmIHRoaXMuaGFzKCdjb2xvcicpO1xuICB9O1xuXG4gIHByb3RvLmRldGFpbHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZW5jb2RpbmcgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLnJlZHVjZShmdW5jdGlvbihyZWZzLCBmaWVsZCwgZW5jVHlwZSkge1xuICAgICAgaWYgKCFmaWVsZC5hZ2dyZWdhdGUgJiYgKGVuY1R5cGUgIT09IFggJiYgZW5jVHlwZSAhPT0gWSkpIHtcbiAgICAgICAgcmVmcy5wdXNoKGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZWZzO1xuICAgIH0sIFtdKTtcbiAgfTtcblxuICBwcm90by5mYWNldHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZW5jb2RpbmcgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLnJlZHVjZShmdW5jdGlvbihyZWZzLCBmaWVsZCwgZW5jVHlwZSkge1xuICAgICAgaWYgKCFmaWVsZC5hZ2dyZWdhdGUgJiYgKGVuY1R5cGUgPT0gUk9XIHx8IGVuY1R5cGUgPT0gQ09MKSkge1xuICAgICAgICByZWZzLnB1c2goZW5jb2RpbmcuZmllbGRSZWYoZW5jVHlwZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlZnM7XG4gICAgfSwgW10pO1xuICB9O1xuXG4gIHByb3RvLmNhcmRpbmFsaXR5ID0gZnVuY3Rpb24oZW5jVHlwZSwgc3RhdHMpIHtcbiAgICByZXR1cm4gdmxmaWVsZC5jYXJkaW5hbGl0eSh0aGlzLmZpZWxkKGVuY1R5cGUpLCBzdGF0cywgdGhpcy5jb25maWcoJ2ZpbHRlck51bGwnKSk7XG4gIH07XG5cbiAgcHJvdG8uaXNSYXcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNBZ2dyZWdhdGUoKTtcbiAgfTtcblxuICBwcm90by5kYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gIH07XG5cbiAgIC8vIHJldHVybnMgd2hldGhlciB0aGUgZW5jb2RpbmcgaGFzIHZhbHVlcyBlbWJlZGRlZFxuICBwcm90by5oYXNWYWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmFscyA9IHRoaXMuZGF0YSgpLnZhbHVlcztcbiAgICByZXR1cm4gdmFscyAmJiB2YWxzLmxlbmd0aDtcbiAgfTtcblxuICBwcm90by5jb25maWcgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbmZpZ1tuYW1lXTtcbiAgfTtcblxuICBFbmNvZGluZy50cmFuc3Bvc2UgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgdmFyIG9sZGVuYyA9IHNwZWMuZW5jb2RpbmcsXG4gICAgICBlbmMgPSB1dGlsLmR1cGxpY2F0ZShzcGVjLmVuY29kaW5nKTtcbiAgICBlbmMueCA9IG9sZGVuYy55O1xuICAgIGVuYy55ID0gb2xkZW5jLng7XG4gICAgZW5jLnJvdyA9IG9sZGVuYy5jb2w7XG4gICAgZW5jLmNvbCA9IG9sZGVuYy5yb3c7XG4gICAgc3BlYy5lbmNvZGluZyA9IGVuYztcbiAgICByZXR1cm4gc3BlYztcbiAgfTtcblxuICAvLyBGSVhNRTogUkVNT1ZFIGV2ZXJ5dGhpbmcgYmVsb3cgaGVyZVxuXG4gIEVuY29kaW5nLnRvZ2dsZVNvcnQgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgc3BlYy5jb25maWcgPSBzcGVjLmNvbmZpZyB8fCB7fTtcbiAgICBzcGVjLmNvbmZpZy50b2dnbGVTb3J0ID0gc3BlYy5jb25maWcudG9nZ2xlU29ydCA9PT0gUSA/IE4gOiBRO1xuICAgIHJldHVybiBzcGVjO1xuICB9O1xuXG5cbiAgRW5jb2RpbmcudG9nZ2xlU29ydC5kaXJlY3Rpb24gPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgaWYgKCFFbmNvZGluZy50b2dnbGVTb3J0LnN1cHBvcnQoc3BlYykpIHsgcmV0dXJuOyB9XG4gICAgdmFyIGVuYyA9IHNwZWMuZW5jb2Rpbmc7XG4gICAgcmV0dXJuIGVuYy54LnR5cGUgPT09IE4gPyAneCcgOiAneSc7XG4gIH07XG5cbiAgRW5jb2RpbmcudG9nZ2xlU29ydC5tb2RlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBzcGVjLmNvbmZpZy50b2dnbGVTb3J0O1xuICB9O1xuXG4gIEVuY29kaW5nLnRvZ2dsZVNvcnQuc3VwcG9ydCA9IGZ1bmN0aW9uKHNwZWMsIHN0YXRzKSB7XG4gICAgdmFyIGVuYyA9IHNwZWMuZW5jb2RpbmcsXG4gICAgICBpc1R5cGVzID0gdmxmaWVsZC5pc1R5cGVzO1xuXG4gICAgaWYgKHZsZW5jLmhhcyhlbmMsIFJPVykgfHwgdmxlbmMuaGFzKGVuYywgQ09MKSB8fFxuICAgICAgIXZsZW5jLmhhcyhlbmMsIFgpIHx8ICF2bGVuYy5oYXMoZW5jLCBZKSB8fFxuICAgICAgIUVuY29kaW5nLmFsd2F5c05vT2NjbHVzaW9uKHNwZWMsIHN0YXRzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiAoIGlzVHlwZXMoZW5jLngsIFtOLE9dKSAmJiB2bGZpZWxkLmlzTWVhc3VyZShlbmMueSkpID8gJ3gnIDpcbiAgICAgICggaXNUeXBlcyhlbmMueSwgW04sT10pICYmIHZsZmllbGQuaXNNZWFzdXJlKGVuYy54KSkgPyAneScgOiBmYWxzZTtcbiAgfTtcblxuICBFbmNvZGluZy50b2dnbGVGaWx0ZXJOdWxsTyA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICBzcGVjLmNvbmZpZyA9IHNwZWMuY29uZmlnIHx8IHt9O1xuICAgIHNwZWMuY29uZmlnLmZpbHRlck51bGwgPSBzcGVjLmNvbmZpZy5maWx0ZXJOdWxsIHx8IHsgLy9GSVhNRVxuICAgICAgVDogdHJ1ZSxcbiAgICAgIFE6IHRydWVcbiAgICB9O1xuICAgIHNwZWMuY29uZmlnLmZpbHRlck51bGwuTyA9ICFzcGVjLmNvbmZpZy5maWx0ZXJOdWxsLk87XG4gICAgcmV0dXJuIHNwZWM7XG4gIH07XG5cbiAgRW5jb2RpbmcudG9nZ2xlRmlsdGVyTnVsbE8uc3VwcG9ydCA9IGZ1bmN0aW9uKHNwZWMsIHN0YXRzKSB7XG4gICAgdmFyIGZpZWxkcyA9IHZsZW5jLmZpZWxkcyhzcGVjLmVuY29kaW5nKTtcbiAgICBmb3IgKHZhciBmaWVsZE5hbWUgaW4gZmllbGRzKSB7XG4gICAgICB2YXIgZmllbGRMaXN0ID0gZmllbGRzW2ZpZWxkTmFtZV07XG4gICAgICBpZiAoZmllbGRMaXN0LmNvbnRhaW5zVHlwZS5PICYmIGZpZWxkTmFtZSBpbiBzdGF0cyAmJiBzdGF0c1tmaWVsZE5hbWVdLm51bGxzID4gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIHJldHVybiBFbmNvZGluZztcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHNldHRlciA9IHV0aWwuc2V0dGVyLFxuICBnZXR0ZXIgPSB1dGlsLmdldHRlcixcbiAgdGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xuXG52YXIgYXhpcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmF4aXMuZGVmID0gZnVuY3Rpb24obmFtZSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMsIG9wdCkge1xuICB2YXIgaXNDb2wgPSBuYW1lID09IENPTCxcbiAgICBpc1JvdyA9IG5hbWUgPT0gUk9XLFxuICAgIHR5cGUgPSBpc0NvbCA/ICd4JyA6IGlzUm93ID8gJ3knIDogbmFtZTtcblxuICB2YXIgZGVmID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgc2NhbGU6IG5hbWUsXG4gICAgcHJvcGVydGllczoge30sXG4gICAgbGF5ZXI6IGVuY29kaW5nLmZpZWxkKG5hbWUpLmF4aXMubGF5ZXIsXG4gICAgb3JpZW50OiBheGlzLm9yaWVudChuYW1lLCBlbmNvZGluZywgc3RhdHMpXG4gIH07XG5cbiAgLy8gQWRkIGF4aXMgbGFiZWwgY3VzdG9tIHNjYWxlIChmb3IgYmluIC8gdGltZSlcbiAgZGVmID0gYXhpcy5sYWJlbHMuc2NhbGUoZGVmLCBlbmNvZGluZywgbmFtZSk7XG4gIGRlZiA9IGF4aXMubGFiZWxzLmZvcm1hdChkZWYsIG5hbWUsIGVuY29kaW5nLCBzdGF0cyk7XG4gIGRlZiA9IGF4aXMubGFiZWxzLmFuZ2xlKGRlZiwgZW5jb2RpbmcsIG5hbWUpO1xuXG4gIC8vIGZvciB4LWF4aXMsIHNldCB0aWNrcyBmb3IgUSBvciByb3RhdGUgc2NhbGUgZm9yIG9yZGluYWwgc2NhbGVcbiAgaWYgKG5hbWUgPT0gWCkge1xuICAgIGlmICgoZW5jb2RpbmcuaXNEaW1lbnNpb24oWCkgfHwgZW5jb2RpbmcuaXNUeXBlKFgsIFQpKSAmJlxuICAgICAgICAhKCdhbmdsZScgaW4gZ2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywgJ2xhYmVscyddKSkpIHtcbiAgICAgIC8vIFRPRE8oa2FuaXR3KTogSnVsIDE5LCAyMDE1IC0gIzUwNiBhZGQgY29uZGl0aW9uIGZvciByb3RhdGlvblxuICAgICAgZGVmID0gYXhpcy5sYWJlbHMucm90YXRlKGRlZik7XG4gICAgfSBlbHNlIHsgLy8gUVxuICAgICAgZGVmLnRpY2tzID0gZW5jb2RpbmcuZmllbGQobmFtZSkuYXhpcy50aWNrcztcbiAgICB9XG4gIH1cblxuICAvLyBUaXRsZU9mZnNldCBkZXBlbmRzIG9uIGxhYmVscyByb3RhdGlvblxuICBkZWYudGl0bGVPZmZzZXQgPSBheGlzLnRpdGxlT2Zmc2V0KGVuY29kaW5nLCBsYXlvdXQsIG5hbWUpO1xuXG4gIC8vZGVmLm9mZnNldCBpcyB1c2VkIGluIGF4aXMuZ3JpZFxuICBpZihpc1JvdykgZGVmLm9mZnNldCA9IGF4aXMudGl0bGVPZmZzZXQoZW5jb2RpbmcsIGxheW91dCwgWSkgKyAyMDtcbiAgLy8gRklYTUUoa2FuaXR3KTogSnVsIDE5LCAyMDE1IC0gb2Zmc2V0IGZvciBjb2x1bW4gd2hlbiB4IGlzIHB1dCBvbiB0b3BcblxuICBkZWYgPSBheGlzLmdyaWQoZGVmLCBuYW1lLCBlbmNvZGluZywgbGF5b3V0KTtcbiAgZGVmID0gYXhpcy50aXRsZShkZWYsIG5hbWUsIGVuY29kaW5nLCBsYXlvdXQsIG9wdCk7XG5cbiAgaWYgKGlzUm93IHx8IGlzQ29sKSBkZWYgPSBheGlzLmhpZGVUaWNrcyhkZWYpO1xuXG4gIHJldHVybiBkZWY7XG59O1xuXG5heGlzLm9yaWVudCA9IGZ1bmN0aW9uKG5hbWUsIGVuY29kaW5nLCBzdGF0cykge1xuICB2YXIgb3JpZW50ID0gZW5jb2RpbmcuZmllbGQobmFtZSkuYXhpcy5vcmllbnQ7XG4gIGlmIChvcmllbnQpIHJldHVybiBvcmllbnQ7XG5cbiAgaWYgKG5hbWU9PT1DT0wpIHJldHVybiAndG9wJztcblxuICAvLyB4LWF4aXMgZm9yIGxvbmcgeSAtIHB1dCBvbiB0b3BcbiAgaWYgKG5hbWU9PT1YICYmIGVuY29kaW5nLmhhcyhZKSAmJiBlbmNvZGluZy5pc09yZGluYWxTY2FsZShZKSAmJiBlbmNvZGluZy5jYXJkaW5hbGl0eShZLCBzdGF0cykgPiAzMCkge1xuICAgIHJldHVybiAndG9wJztcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5heGlzLmdyaWQgPSBmdW5jdGlvbihkZWYsIG5hbWUsIGVuY29kaW5nLCBsYXlvdXQpIHtcbiAgdmFyIGNlbGxQYWRkaW5nID0gbGF5b3V0LmNlbGxQYWRkaW5nLFxuICAgIGlzQ29sID0gbmFtZSA9PSBDT0wsXG4gICAgaXNSb3cgPSBuYW1lID09IFJPVztcblxuICBpZiAoZW5jb2RpbmcuYXhpcyhuYW1lKS5ncmlkKSB7XG4gICAgZGVmLmdyaWQgPSB0cnVlO1xuXG4gICAgaWYgKGlzQ29sKSB7XG4gICAgICAvLyBzZXQgZ3JpZCBwcm9wZXJ0eSAtLSBwdXQgdGhlIGxpbmVzIG9uIHRoZSByaWdodCB0aGUgY2VsbFxuICAgICAgZGVmLnByb3BlcnRpZXMuZ3JpZCA9IHtcbiAgICAgICAgeDoge1xuICAgICAgICAgIG9mZnNldDogbGF5b3V0LmNlbGxXaWR0aCAqICgxKyBjZWxsUGFkZGluZy8yLjApLFxuICAgICAgICAgIC8vIGRlZmF1bHQgdmFsdWUocykgLS0gdmVnYSBkb2Vzbid0IGRvIHJlY3Vyc2l2ZSBtZXJnZVxuICAgICAgICAgIHNjYWxlOiAnY29sJ1xuICAgICAgICB9LFxuICAgICAgICB5OiB7XG4gICAgICAgICAgdmFsdWU6IC1sYXlvdXQuY2VsbEhlaWdodCAqIChjZWxsUGFkZGluZy8yKSxcbiAgICAgICAgfSxcbiAgICAgICAgc3Ryb2tlOiB7IHZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2NlbGxHcmlkQ29sb3InKSB9LFxuICAgICAgICBvcGFjaXR5OiB7IHZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2NlbGxHcmlkT3BhY2l0eScpIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChpc1Jvdykge1xuICAgICAgLy8gc2V0IGdyaWQgcHJvcGVydHkgLS0gcHV0IHRoZSBsaW5lcyBvbiB0aGUgdG9wXG4gICAgICBkZWYucHJvcGVydGllcy5ncmlkID0ge1xuICAgICAgICB5OiB7XG4gICAgICAgICAgb2Zmc2V0OiAtbGF5b3V0LmNlbGxIZWlnaHQgKiAoY2VsbFBhZGRpbmcvMiksXG4gICAgICAgICAgLy8gZGVmYXVsdCB2YWx1ZShzKSAtLSB2ZWdhIGRvZXNuJ3QgZG8gcmVjdXJzaXZlIG1lcmdlXG4gICAgICAgICAgc2NhbGU6ICdyb3cnXG4gICAgICAgIH0sXG4gICAgICAgIHg6IHtcbiAgICAgICAgICB2YWx1ZTogZGVmLm9mZnNldFxuICAgICAgICB9LFxuICAgICAgICB4Mjoge1xuICAgICAgICAgIG9mZnNldDogZGVmLm9mZnNldCArIChsYXlvdXQuY2VsbFdpZHRoICogMC4wNSksXG4gICAgICAgICAgLy8gZGVmYXVsdCB2YWx1ZShzKSAtLSB2ZWdhIGRvZXNuJ3QgZG8gcmVjdXJzaXZlIG1lcmdlXG4gICAgICAgICAgZ3JvdXA6ICdtYXJrLmdyb3VwLndpZHRoJyxcbiAgICAgICAgICBtdWx0OiAxXG4gICAgICAgIH0sXG4gICAgICAgIHN0cm9rZTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsR3JpZENvbG9yJykgfSxcbiAgICAgICAgb3BhY2l0eTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsR3JpZE9wYWNpdHknKSB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWYucHJvcGVydGllcy5ncmlkID0ge1xuICAgICAgICBzdHJva2U6IHsgdmFsdWU6IGVuY29kaW5nLmNvbmZpZygnZ3JpZENvbG9yJykgfSxcbiAgICAgICAgb3BhY2l0eTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdncmlkT3BhY2l0eScpIH1cbiAgICAgIH07XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWY7XG59O1xuXG5heGlzLmhpZGVUaWNrcyA9IGZ1bmN0aW9uKGRlZikge1xuICBkZWYucHJvcGVydGllcy50aWNrcyA9IHtvcGFjaXR5OiB7dmFsdWU6IDB9fTtcbiAgZGVmLnByb3BlcnRpZXMubWFqb3JUaWNrcyA9IHtvcGFjaXR5OiB7dmFsdWU6IDB9fTtcbiAgZGVmLnByb3BlcnRpZXMuYXhpcyA9IHtvcGFjaXR5OiB7dmFsdWU6IDB9fTtcbiAgcmV0dXJuIGRlZjtcbn07XG5cbmF4aXMudGl0bGUgPSBmdW5jdGlvbiAoZGVmLCBuYW1lLCBlbmNvZGluZywgbGF5b3V0KSB7XG4gIHZhciBheCA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLmF4aXM7XG5cbiAgaWYgKGF4LnRpdGxlKSB7XG4gICAgZGVmLnRpdGxlID0gYXgudGl0bGU7XG4gIH0gZWxzZSB7XG4gICAgLy8gaWYgbm90IGRlZmluZWQsIGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lIGF4aXMgdGl0bGUgZnJvbSBmaWVsZCBkZWZcbiAgICB2YXIgZmllbGRUaXRsZSA9IGVuY29kaW5nLmZpZWxkVGl0bGUobmFtZSksXG4gICAgICBtYXhMZW5ndGg7XG5cbiAgICBpZiAoYXgudGl0bGVNYXhMZW5ndGgpIHtcbiAgICAgIG1heExlbmd0aCA9IGF4LnRpdGxlTWF4TGVuZ3RoO1xuICAgIH0gZWxzZSBpZiAobmFtZT09PVgpIHtcbiAgICAgIG1heExlbmd0aCA9IGxheW91dC5jZWxsV2lkdGggLyBlbmNvZGluZy5jb25maWcoJ2NoYXJhY3RlcldpZHRoJyk7XG4gICAgfSBlbHNlIGlmIChuYW1lID09PSBZKSB7XG4gICAgICBtYXhMZW5ndGggPSBsYXlvdXQuY2VsbEhlaWdodCAvIGVuY29kaW5nLmNvbmZpZygnY2hhcmFjdGVyV2lkdGgnKTtcbiAgICB9XG5cbiAgICBkZWYudGl0bGUgPSBtYXhMZW5ndGggPyB1dGlsLnRydW5jYXRlKGZpZWxkVGl0bGUsIG1heExlbmd0aCkgOiBmaWVsZFRpdGxlO1xuICB9XG5cbiAgaWYgKG5hbWUgPT09IFJPVykge1xuICAgIGRlZi5wcm9wZXJ0aWVzLnRpdGxlID0ge1xuICAgICAgYW5nbGU6IHt2YWx1ZTogMH0sXG4gICAgICBhbGlnbjoge3ZhbHVlOiAncmlnaHQnfSxcbiAgICAgIGJhc2VsaW5lOiB7dmFsdWU6ICdtaWRkbGUnfSxcbiAgICAgIGR5OiB7dmFsdWU6ICgtbGF5b3V0LmhlaWdodC8yKSAtMjB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBkZWY7XG59O1xuXG5heGlzLmxhYmVscyA9IHt9O1xuXG4vKiogYWRkIGN1c3RvbSBsYWJlbCBmb3IgdGltZSB0eXBlIGFuZCBiaW4gKi9cbmF4aXMubGFiZWxzLnNjYWxlID0gZnVuY3Rpb24oZGVmLCBlbmNvZGluZywgbmFtZSkge1xuICAvLyB0aW1lXG4gIHZhciB0aW1lVW5pdCA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLnRpbWVVbml0O1xuICBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFQpICYmIHRpbWVVbml0ICYmICh0aW1lLmhhc1NjYWxlKHRpbWVVbml0KSkpIHtcbiAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCdsYWJlbHMnLCd0ZXh0Jywnc2NhbGUnXSwgJ3RpbWUtJysgdGltZVVuaXQpO1xuICB9XG4gIC8vIEZJWE1FIGJpblxuICByZXR1cm4gZGVmO1xufTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgbnVtYmVyIGZvcm1hdCBvciB0cnVuY2F0ZSBpZiBtYXhMYWJlbCBsZW5ndGggaXMgcHJlc2VudGVkLlxuICovXG5heGlzLmxhYmVscy5mb3JtYXQgPSBmdW5jdGlvbiAoZGVmLCBuYW1lLCBlbmNvZGluZywgc3RhdHMpIHtcbiAgdmFyIGZpZWxkU3RhdHMgPSBzdGF0c1tlbmNvZGluZy5maWVsZChuYW1lKS5uYW1lXTtcblxuICBpZiAoZW5jb2RpbmcuYXhpcyhuYW1lKS5mb3JtYXQpIHtcbiAgICBkZWYuZm9ybWF0ID0gZW5jb2RpbmcuYXhpcyhuYW1lKS5mb3JtYXQ7XG4gIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFEpIHx8IGZpZWxkU3RhdHMudHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICBkZWYuZm9ybWF0ID0gZW5jb2RpbmcubnVtYmVyRm9ybWF0KGZpZWxkU3RhdHMpO1xuICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSkge1xuICAgIHZhciB0aW1lVW5pdCA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLnRpbWVVbml0O1xuICAgIGlmICghdGltZVVuaXQpIHtcbiAgICAgIGRlZi5mb3JtYXQgPSBlbmNvZGluZy5jb25maWcoJ3RpbWVGb3JtYXQnKTtcbiAgICB9IGVsc2UgaWYgKHRpbWVVbml0ID09PSAneWVhcicpIHtcbiAgICAgIGRlZi5mb3JtYXQgPSAnZCc7XG4gICAgfVxuICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZXMobmFtZSwgW04sIE9dKSAmJiBlbmNvZGluZy5heGlzKG5hbWUpLm1heExhYmVsTGVuZ3RoKSB7XG4gICAgc2V0dGVyKGRlZixcbiAgICAgIFsncHJvcGVydGllcycsJ2xhYmVscycsJ3RleHQnLCd0ZW1wbGF0ZSddLFxuICAgICAgJ3t7ZGF0YSB8IHRydW5jYXRlOicgKyBlbmNvZGluZy5heGlzKG5hbWUpLm1heExhYmVsTGVuZ3RoICsgJ319J1xuICAgICAgKTtcbiAgfVxuXG4gIHJldHVybiBkZWY7XG59O1xuXG5heGlzLmxhYmVscy5hbmdsZSA9IGZ1bmN0aW9uKGRlZiwgZW5jb2RpbmcsIG5hbWUpIHtcbiAgdmFyIGFuZ2xlID0gZW5jb2RpbmcuYXhpcyhuYW1lKS5sYWJlbEFuZ2xlO1xuICBpZiAodHlwZW9mIGFuZ2xlID09PSAndW5kZWZpbmVkJykgcmV0dXJuIGRlZjtcblxuICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCAnbGFiZWxzJywgJ2FuZ2xlJywgJ3ZhbHVlJ10sIGFuZ2xlKTtcbiAgcmV0dXJuIGRlZjtcbn07XG5cbmF4aXMubGFiZWxzLnJvdGF0ZSA9IGZ1bmN0aW9uKGRlZikge1xuIHZhciBhbGlnbiA9IGRlZi5vcmllbnQgPT09J3RvcCcgPyAnbGVmdCcgOiAncmlnaHQnO1xuIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsJ2xhYmVscycsICdhbmdsZScsICd2YWx1ZSddLCAyNzApO1xuIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsJ2xhYmVscycsICdhbGlnbicsICd2YWx1ZSddLCBhbGlnbik7XG4gc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywnbGFiZWxzJywgJ2Jhc2VsaW5lJywgJ3ZhbHVlJ10sICdtaWRkbGUnKTtcbiByZXR1cm4gZGVmO1xufTtcblxuYXhpcy50aXRsZU9mZnNldCA9IGZ1bmN0aW9uIChlbmNvZGluZywgbGF5b3V0LCBuYW1lKSB7XG4gIC8vIHJldHVybiBzcGVjaWZpZWQgdmFsdWUgaWYgc3BlY2lmaWVkXG4gIHZhciB2YWx1ZSA9IGVuY29kaW5nLmF4aXMobmFtZSkudGl0bGVPZmZzZXQ7XG4gIGlmICh2YWx1ZSkgIHJldHVybiB2YWx1ZTtcblxuICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAvL0ZJWE1FIG1ha2UgdGhpcyBhZGp1c3RhYmxlXG4gICAgY2FzZSBST1c6IHJldHVybiAwO1xuICAgIGNhc2UgQ09MOiByZXR1cm4gMzU7XG4gIH1cbiAgcmV0dXJuIGdldHRlcihsYXlvdXQsIFtuYW1lLCAnYXhpc1RpdGxlT2Zmc2V0J10pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN1bW1hcnkgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ2RhdGFsaWIvc3JjL3N0YXRzJykuc3VtbWFyeTtcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgY29tcGlsZXIgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG52YXIgRW5jb2RpbmcgPSByZXF1aXJlKCcuLi9FbmNvZGluZycpLFxuICBheGlzID0gY29tcGlsZXIuYXhpcyA9IHJlcXVpcmUoJy4vYXhpcycpLFxuICBsZWdlbmQgPSBjb21waWxlci5sZWdlbmQgPSByZXF1aXJlKCcuL2xlZ2VuZCcpLFxuICBtYXJrcyA9IGNvbXBpbGVyLm1hcmtzID0gcmVxdWlyZSgnLi9tYXJrcycpLFxuICBzY2FsZSA9IGNvbXBpbGVyLnNjYWxlID0gcmVxdWlyZSgnLi9zY2FsZScpO1xuXG5jb21waWxlci5kYXRhID0gcmVxdWlyZSgnLi9kYXRhJyk7XG5jb21waWxlci5mYWNldCA9IHJlcXVpcmUoJy4vZmFjZXQnKTtcbmNvbXBpbGVyLmdyb3VwID0gcmVxdWlyZSgnLi9ncm91cCcpO1xuY29tcGlsZXIubGF5b3V0ID0gcmVxdWlyZSgnLi9sYXlvdXQnKTtcbmNvbXBpbGVyLnNvcnQgPSByZXF1aXJlKCcuL3NvcnQnKTtcbmNvbXBpbGVyLnN0YWNrID0gcmVxdWlyZSgnLi9zdGFjaycpO1xuY29tcGlsZXIuc3R5bGUgPSByZXF1aXJlKCcuL3N0eWxlJyk7XG5jb21waWxlci5zdWJmYWNldCA9IHJlcXVpcmUoJy4vc3ViZmFjZXQnKTtcbmNvbXBpbGVyLnRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKTtcblxuY29tcGlsZXIuY29tcGlsZSA9IGZ1bmN0aW9uIChzcGVjLCBzdGF0cywgdGhlbWUpIHtcbiAgcmV0dXJuIGNvbXBpbGVyLmNvbXBpbGVFbmNvZGluZyhFbmNvZGluZy5mcm9tU3BlYyhzcGVjLCB0aGVtZSksIHN0YXRzKTtcbn07XG5cbmNvbXBpbGVyLnNob3J0aGFuZCA9IGZ1bmN0aW9uIChzaG9ydGhhbmQsIHN0YXRzLCBjb25maWcsIHRoZW1lKSB7XG4gIHJldHVybiBjb21waWxlci5jb21waWxlRW5jb2RpbmcoRW5jb2RpbmcuZnJvbVNob3J0aGFuZChzaG9ydGhhbmQsIGNvbmZpZywgdGhlbWUpLCBzdGF0cyk7XG59O1xuXG5cbmNvbXBpbGVyLmNvbXBpbGVFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhdHMpIHtcbiAgLy8gbm8gbmVlZCB0byBwYXNzIHN0YXRzIGlmIHlvdSBwYXNzIGluIHRoZSBkYXRhXG4gIGlmICghc3RhdHMgJiYgZW5jb2RpbmcuaGFzVmFsdWVzKCkpIHtcbiAgICBzdGF0cyA9IHN1bW1hcnkoZW5jb2RpbmcuZGF0YSgpLnZhbHVlcykucmVkdWNlKGZ1bmN0aW9uKHMsIHApIHtcbiAgICAgIHNbcC5maWVsZF0gPSBwO1xuICAgICAgcmV0dXJuIHM7XG4gICAgfSwge30pO1xuICB9XG5cbiAgdmFyIGxheW91dCA9IGNvbXBpbGVyLmxheW91dChlbmNvZGluZywgc3RhdHMpO1xuXG4gIHZhciBzcGVjID0ge1xuICAgICAgd2lkdGg6IGxheW91dC53aWR0aCxcbiAgICAgIGhlaWdodDogbGF5b3V0LmhlaWdodCxcbiAgICAgIHBhZGRpbmc6ICdhdXRvJyxcbiAgICAgIGRhdGE6IGNvbXBpbGVyLmRhdGEoZW5jb2RpbmcpLFxuICAgICAgLy8gZ2xvYmFsIHNjYWxlcyBjb250YWlucyBvbmx5IHRpbWUgdW5pdCBzY2FsZXNcbiAgICAgIHNjYWxlczogY29tcGlsZXIudGltZS5zY2FsZXMoZW5jb2RpbmcpXG4gICAgfTtcblxuICAvLyBGSVhNRSByZW1vdmUgY29tcGlsZXIuc29ydCBhZnRlciBtaWdyYXRpbmcgdG8gdmVnYSAyLlxuICBzcGVjLmRhdGEgPSBjb21waWxlci5zb3J0KHNwZWMuZGF0YSwgZW5jb2RpbmcsIHN0YXRzKTsgLy8gYXBwZW5kIG5ldyBkYXRhXG5cbiAgLy8gbWFya3NcblxuICAvLyBUT0RPIHRoaXMgbGluZSBpcyB0ZW1wb3JhcnkgYW5kIHNob3VsZCBiZSByZWZhY3RvcmVkXG4gIHNwZWMubWFya3MgPSBbY29tcGlsZXIuZ3JvdXAuZGVmKCdjZWxsJywge1xuICAgIHdpZHRoOiBsYXlvdXQuY2VsbFdpZHRoID8ge3ZhbHVlOiBsYXlvdXQuY2VsbFdpZHRofSA6IHVuZGVmaW5lZCxcbiAgICBoZWlnaHQ6IGxheW91dC5jZWxsSGVpZ2h0ID8ge3ZhbHVlOiBsYXlvdXQuY2VsbEhlaWdodH0gOiB1bmRlZmluZWRcbiAgfSldO1xuXG4gIHZhciBzdHlsZSA9IGNvbXBpbGVyLnN0eWxlKGVuY29kaW5nLCBzdGF0cyksXG4gICAgZ3JvdXAgPSBzcGVjLm1hcmtzWzBdLFxuICAgIG1kZWZzID0gbWFya3MuZGVmKGVuY29kaW5nLCBsYXlvdXQsIHN0eWxlLCBzdGF0cyksXG4gICAgbWRlZiA9IG1kZWZzW21kZWZzLmxlbmd0aCAtIDFdOyAgLy8gVE9ETzogcmVtb3ZlIHRoaXMgZGlydHkgaGFjayBieSByZWZhY3RvcmluZyB0aGUgd2hvbGUgZmxvd1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbWRlZnMubGVuZ3RoOyBpKyspIHtcbiAgICBncm91cC5tYXJrcy5wdXNoKG1kZWZzW2ldKTtcbiAgfVxuXG4gIHZhciBsaW5lVHlwZSA9IG1hcmtzW2VuY29kaW5nLm1hcmt0eXBlKCldLmxpbmU7XG5cbiAgLy8gaGFuZGxlIHN1YmZhY2V0c1xuXG4gIHZhciBkZXRhaWxzID0gZW5jb2RpbmcuZGV0YWlscygpLFxuICAgIHN0YWNrID0gZW5jb2RpbmcuaXNBZ2dyZWdhdGUoKSAmJiBkZXRhaWxzLmxlbmd0aCA+IDAgJiYgY29tcGlsZXIuc3RhY2soc3BlYy5kYXRhLCBlbmNvZGluZywgbWRlZik7IC8vIG1vZGlmeSBzcGVjLmRhdGEsIG1kZWYue2Zyb20scHJvcGVydGllc31cblxuICBpZiAoZGV0YWlscy5sZW5ndGggPiAwICYmIChzdGFjayB8fCBsaW5lVHlwZSkpIHtcbiAgICAvL3N1YmZhY2V0IHRvIGdyb3VwIHN0YWNrIC8gbGluZSB0b2dldGhlciBpbiBvbmUgZ3JvdXBcbiAgICBjb21waWxlci5zdWJmYWNldChncm91cCwgbWRlZiwgZGV0YWlscywgc3RhY2ssIGVuY29kaW5nKTtcbiAgfVxuXG4gIC8vIGF1dG8tc29ydCBsaW5lL2FyZWEgdmFsdWVzXG4gIC8vVE9ETyhrYW5pdHcpOiBoYXZlIHNvbWUgY29uZmlnIHRvIHR1cm4gb2ZmIGF1dG8tc29ydCBmb3IgbGluZSAoZm9yIGxpbmUgY2hhcnQgdGhhdCBlbmNvZGVzIHRlbXBvcmFsIGluZm9ybWF0aW9uKVxuICBpZiAobGluZVR5cGUpIHtcbiAgICB2YXIgZiA9IChlbmNvZGluZy5pc01lYXN1cmUoWCkgJiYgZW5jb2RpbmcuaXNEaW1lbnNpb24oWSkpID8gWSA6IFg7XG4gICAgaWYgKCFtZGVmLmZyb20pIG1kZWYuZnJvbSA9IHt9O1xuICAgIC8vIFRPRE86IHdoeSAtID9cbiAgICBtZGVmLmZyb20udHJhbnNmb3JtID0gW3t0eXBlOiAnc29ydCcsIGJ5OiAnLScgKyBlbmNvZGluZy5maWVsZFJlZihmKX1dO1xuICB9XG5cbiAgLy8gZ2V0IGEgZmxhdHRlbmVkIGxpc3Qgb2YgYWxsIHNjYWxlIG5hbWVzIHRoYXQgYXJlIHVzZWQgaW4gdGhlIHZsIHNwZWNcbiAgdmFyIHNpbmdsZVNjYWxlTmFtZXMgPSBbXS5jb25jYXQuYXBwbHkoW10sIG1kZWZzLm1hcChmdW5jdGlvbihtYXJrUHJvcHMpIHtcbiAgICByZXR1cm4gc2NhbGUubmFtZXMobWFya1Byb3BzLnByb3BlcnRpZXMudXBkYXRlKTtcbiAgfSkpO1xuXG4gIC8vIFNtYWxsIE11bHRpcGxlc1xuICBpZiAoZW5jb2RpbmcuaGFzKFJPVykgfHwgZW5jb2RpbmcuaGFzKENPTCkpIHtcbiAgICBzcGVjID0gY29tcGlsZXIuZmFjZXQoZ3JvdXAsIGVuY29kaW5nLCBsYXlvdXQsIHNwZWMsIHNpbmdsZVNjYWxlTmFtZXMsIHN0YWNrLCBzdGF0cyk7XG4gICAgc3BlYy5sZWdlbmRzID0gbGVnZW5kLmRlZnMoZW5jb2RpbmcsIHN0eWxlKTtcbiAgfSBlbHNlIHtcbiAgICBncm91cC5zY2FsZXMgPSBzY2FsZS5kZWZzKHNpbmdsZVNjYWxlTmFtZXMsIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzLCB7c3RhY2s6IHN0YWNrfSk7XG5cbiAgICBncm91cC5heGVzID0gW107XG4gICAgaWYgKGVuY29kaW5nLmhhcyhYKSkgZ3JvdXAuYXhlcy5wdXNoKGF4aXMuZGVmKFgsIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSk7XG4gICAgaWYgKGVuY29kaW5nLmhhcyhZKSkgZ3JvdXAuYXhlcy5wdXNoKGF4aXMuZGVmKFksIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSk7XG5cbiAgICBncm91cC5sZWdlbmRzID0gbGVnZW5kLmRlZnMoZW5jb2RpbmcsIHN0eWxlKTtcbiAgfVxuXG5cblxuICByZXR1cm4gc3BlYztcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGE7XG5cbnZhciB2bGZpZWxkID0gcmVxdWlyZSgnLi4vZmllbGQnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgdGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xuXG5mdW5jdGlvbiBkYXRhKGVuY29kaW5nKSB7XG4gIHZhciBkZWYgPSBbZGF0YS5yYXcoZW5jb2RpbmcpXTtcblxuICB2YXIgYWdncmVnYXRlID0gZGF0YS5hZ2dyZWdhdGUoZW5jb2RpbmcpO1xuICBpZiAoYWdncmVnYXRlKSBkZWYucHVzaChkYXRhLmFnZ3JlZ2F0ZShlbmNvZGluZykpO1xuXG4gIC8vIFRPRE8gYWRkIFwiaGF2aW5nXCIgZmlsdGVyIGhlcmUgKClcblxuICAvLyBhcHBlbmQgbm9uLXplcm8gZmlsdGVyIGF0IHRoZSBlbmQgZm9yIHRoZSBkYXRhIHRhYmxlXG4gIGRhdGEuZmlsdGVyTm9uWmVyb0ZvckxvZyhkZWZbZGVmLmxlbmd0aCAtIDFdLCBlbmNvZGluZyk7XG5cbiAgcmV0dXJuIGRlZjtcbn1cblxuZGF0YS5yYXcgPSBmdW5jdGlvbihlbmNvZGluZykge1xuICB2YXIgcmF3ID0ge25hbWU6IFJBV307XG5cbiAgLy8gRGF0YSBzb3VyY2UgKHVybCBvciBpbmxpbmUpXG4gIGlmIChlbmNvZGluZy5oYXNWYWx1ZXMoKSkge1xuICAgIHJhdy52YWx1ZXMgPSBlbmNvZGluZy5kYXRhKCkudmFsdWVzO1xuICB9IGVsc2Uge1xuICAgIHJhdy51cmwgPSBlbmNvZGluZy5kYXRhKCkudXJsO1xuICAgIHJhdy5mb3JtYXQgPSB7dHlwZTogZW5jb2RpbmcuZGF0YSgpLmZvcm1hdFR5cGV9O1xuICB9XG5cbiAgLy8gU2V0IGZvcm1hdC5wYXJzZSBpZiBuZWVkZWRcbiAgdmFyIHBhcnNlID0gZGF0YS5yYXcuZm9ybWF0UGFyc2UoZW5jb2RpbmcpO1xuICBpZiAocGFyc2UpIHtcbiAgICByYXcuZm9ybWF0ID0gcmF3LmZvcm1hdCB8fCB7fTtcbiAgICByYXcuZm9ybWF0LnBhcnNlID0gcGFyc2U7XG4gIH1cblxuICByYXcudHJhbnNmb3JtID0gZGF0YS5yYXcudHJhbnNmb3JtKGVuY29kaW5nKTtcbiAgcmV0dXJuIHJhdztcbn07XG5cbmRhdGEucmF3LmZvcm1hdFBhcnNlID0gZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgdmFyIHBhcnNlO1xuXG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQpIHtcbiAgICBpZiAoZmllbGQudHlwZSA9PSBUKSB7XG4gICAgICBwYXJzZSA9IHBhcnNlIHx8IHt9O1xuICAgICAgcGFyc2VbZmllbGQubmFtZV0gPSAnZGF0ZSc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09IFEpIHtcbiAgICAgIGlmICh2bGZpZWxkLmlzQ291bnQoZmllbGQpKSByZXR1cm47XG4gICAgICBwYXJzZSA9IHBhcnNlIHx8IHt9O1xuICAgICAgcGFyc2VbZmllbGQubmFtZV0gPSAnbnVtYmVyJztcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwYXJzZTtcbn07XG5cbmRhdGEucmF3LnRyYW5zZm9ybSA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gIC8vIHRpbWUgYW5kIGJpbiBzaG91bGQgY29tZSBiZWZvcmUgZmlsdGVyIHNvIHdlIGNhbiBmaWx0ZXIgYnkgdGltZSBhbmQgYmluXG4gIHJldHVybiBkYXRhLnJhdy50cmFuc2Zvcm0udGltZShlbmNvZGluZykuY29uY2F0KFxuICAgIGRhdGEucmF3LnRyYW5zZm9ybS5iaW4oZW5jb2RpbmcpXG4gICkuY29uY2F0KFxuICAgIGRhdGEucmF3LnRyYW5zZm9ybS5maWx0ZXIoZW5jb2RpbmcpXG4gICk7XG59O1xuXG52YXIgQklOQVJZID0ge1xuICAnPic6ICB0cnVlLFxuICAnPj0nOiB0cnVlLFxuICAnPSc6ICB0cnVlLFxuICAnIT0nOiB0cnVlLFxuICAnPCc6ICB0cnVlLFxuICAnPD0nOiB0cnVlXG59O1xuXG5kYXRhLnJhdy50cmFuc2Zvcm0udGltZSA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gIHJldHVybiBlbmNvZGluZy5yZWR1Y2UoZnVuY3Rpb24odHJhbnNmb3JtLCBmaWVsZCwgZW5jVHlwZSkge1xuICAgIGlmIChmaWVsZC50eXBlID09PSBUICYmIGZpZWxkLnRpbWVVbml0KSB7XG4gICAgICB0cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgZmllbGQ6IGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUpLFxuICAgICAgICBleHByOiB0aW1lLmZvcm11bGEoZmllbGQudGltZVVuaXQsIGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUsIHtub2ZuOiB0cnVlLCBkOiB0cnVlfSkpXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgfSwgW10pO1xufTtcblxuZGF0YS5yYXcudHJhbnNmb3JtLmJpbiA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gIHJldHVybiBlbmNvZGluZy5yZWR1Y2UoZnVuY3Rpb24odHJhbnNmb3JtLCBmaWVsZCwgZW5jVHlwZSkge1xuICAgIGlmIChlbmNvZGluZy5iaW4oZW5jVHlwZSkpIHtcbiAgICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2JpbicsXG4gICAgICAgIGZpZWxkOiBlbmNvZGluZy5maWVsZFJlZihlbmNUeXBlLCB7bm9mbjogdHJ1ZX0pLFxuICAgICAgICBvdXRwdXQ6IGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUpLFxuICAgICAgICBtYXhiaW5zOiBlbmNvZGluZy5iaW4oZW5jVHlwZSkubWF4Ymluc1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0cmFuc2Zvcm07XG4gIH0sIFtdKTtcbn07XG5cbmRhdGEucmF3LnRyYW5zZm9ybS5maWx0ZXIgPSBmdW5jdGlvbihlbmNvZGluZykge1xuICB2YXIgZmlsdGVycyA9IGVuY29kaW5nLmZpbHRlcigpLnJlZHVjZShmdW5jdGlvbihmLCBmaWx0ZXIpIHtcbiAgICB2YXIgY29uZGl0aW9uID0gJyc7XG4gICAgdmFyIG9wZXJhdG9yID0gZmlsdGVyLm9wZXJhdG9yO1xuICAgIHZhciBvcGVyYW5kcyA9IGZpbHRlci5vcGVyYW5kcztcblxuICAgIHZhciBkID0gJ2QuJyArIChlbmNvZGluZy5fdmVnYTIgPyAnJyA6ICdkYXRhLicpO1xuXG4gICAgaWYgKEJJTkFSWVtvcGVyYXRvcl0pIHtcbiAgICAgIC8vIGV4cGVjdHMgYSBmaWVsZCBhbmQgYSB2YWx1ZVxuICAgICAgaWYgKG9wZXJhdG9yID09PSAnPScpIHtcbiAgICAgICAgb3BlcmF0b3IgPSAnPT0nO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3AxID0gb3BlcmFuZHNbMF07XG4gICAgICB2YXIgb3AyID0gb3BlcmFuZHNbMV07XG4gICAgICBjb25kaXRpb24gPSBkICsgb3AxICsgJyAnICsgb3BlcmF0b3IgKyAnICcgKyBvcDI7XG4gICAgfSBlbHNlIGlmIChvcGVyYXRvciA9PT0gJ25vdE51bGwnKSB7XG4gICAgICAvLyBleHBlY3RzIGEgbnVtYmVyIG9mIGZpZWxkc1xuICAgICAgZm9yICh2YXIgaj0wOyBqPG9wZXJhbmRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbmRpdGlvbiArPSBkICsgb3BlcmFuZHNbal0gKyAnIT09bnVsbCc7XG4gICAgICAgIGlmIChqIDwgb3BlcmFuZHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGNvbmRpdGlvbiArPSAnICYmICc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdXRpbC53YXJuKCdVbnN1cHBvcnRlZCBvcGVyYXRvcjogJywgb3BlcmF0b3IpO1xuICAgICAgcmV0dXJuIGY7XG4gICAgfVxuICAgIGYucHVzaCgnKCcgKyBjb25kaXRpb24gKyAnKScpO1xuICAgIHJldHVybiBmO1xuICB9LCBbXSk7XG4gIGlmIChmaWx0ZXJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuXG4gIHJldHVybiBbe1xuICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICB0ZXN0OiBmaWx0ZXJzLmpvaW4oJyAmJiAnKVxuICB9XTtcbn07XG5cbmRhdGEuYWdncmVnYXRlID0gZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgdmFyIGRpbXMgPSB7fSwgbWVhcyA9IHt9O1xuXG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICBpZiAoZmllbGQuYWdncmVnYXRlKSB7XG4gICAgICBpZiAoZmllbGQuYWdncmVnYXRlID09PSAnY291bnQnKSB7XG4gICAgICAgIG1lYXMuY291bnQgPSB7b3A6ICdjb3VudCcsIGZpZWxkOiAnKid9O1xuICAgICAgfWVsc2Uge1xuICAgICAgICBtZWFzW2ZpZWxkLmFnZ3JlZ2F0ZSArICd8JyArIGZpZWxkLm5hbWVdID0ge1xuICAgICAgICAgIG9wOiBmaWVsZC5hZ2dyZWdhdGUsXG4gICAgICAgICAgZmllbGQ6IGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUsIHtub2ZuOiB0cnVlfSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGltc1tmaWVsZC5uYW1lXSA9IGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUpO1xuICAgIH1cbiAgfSk7XG5cbiAgZGltcyA9IHV0aWwudmFscyhkaW1zKTtcbiAgbWVhcyA9IHV0aWwudmFscyhtZWFzKTtcblxuICBpZiAobWVhcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IEFHR1JFR0FURSxcbiAgICAgIHNvdXJjZTogUkFXLFxuICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgICAgZ3JvdXBieTogZGltcyxcbiAgICAgICAgZmllbGRzOiBtZWFzXG4gICAgICB9XVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cbmRhdGEuZmlsdGVyTm9uWmVyb0ZvckxvZyA9IGZ1bmN0aW9uKGRhdGFUYWJsZSwgZW5jb2RpbmcpIHtcbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuICAgIGlmIChlbmNvZGluZy5zY2FsZShlbmNUeXBlKS50eXBlID09PSAnbG9nJykge1xuICAgICAgZGF0YVRhYmxlLnRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICAgIHRlc3Q6IGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUsIHtkOiAxfSkgKyAnID4gMCdcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgYXhpcyA9IHJlcXVpcmUoJy4vYXhpcycpLFxuICBncm91cGRlZiA9IHJlcXVpcmUoJy4vZ3JvdXAnKS5kZWYsXG4gIHNjYWxlID0gcmVxdWlyZSgnLi9zY2FsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY2V0aW5nO1xuXG5mdW5jdGlvbiBmYWNldGluZyhncm91cCwgZW5jb2RpbmcsIGxheW91dCwgc3BlYywgc2luZ2xlU2NhbGVOYW1lcywgc3RhY2ssIHN0YXRzKSB7XG4gIHZhciBlbnRlciA9IGdyb3VwLnByb3BlcnRpZXMuZW50ZXI7XG4gIHZhciBmYWNldEtleXMgPSBbXSwgY2VsbEF4ZXMgPSBbXSwgZnJvbSwgYXhlc0dycDtcblxuICB2YXIgaGFzUm93ID0gZW5jb2RpbmcuaGFzKFJPVyksIGhhc0NvbCA9IGVuY29kaW5nLmhhcyhDT0wpO1xuXG4gIGVudGVyLmZpbGwgPSB7dmFsdWU6IGVuY29kaW5nLmNvbmZpZygnY2VsbEJhY2tncm91bmRDb2xvcicpfTtcblxuICAvL21vdmUgXCJmcm9tXCIgdG8gY2VsbCBsZXZlbCBhbmQgYWRkIGZhY2V0IHRyYW5zZm9ybVxuICBncm91cC5mcm9tID0ge2RhdGE6IGdyb3VwLm1hcmtzWzBdLmZyb20uZGF0YX07XG5cbiAgLy8gSGFjaywgdGhpcyBuZWVkcyB0byBiZSByZWZhY3RvcmVkXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JvdXAubWFya3MubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbWFyayA9IGdyb3VwLm1hcmtzW2ldO1xuICAgIGlmIChtYXJrLmZyb20udHJhbnNmb3JtKSB7XG4gICAgICBkZWxldGUgbWFyay5mcm9tLmRhdGE7IC8vbmVlZCB0byBrZWVwIHRyYW5zZm9ybSBmb3Igc3ViZmFjZXR0aW5nIGNhc2VcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIG1hcmsuZnJvbTtcbiAgICB9XG4gIH1cblxuICBpZiAoaGFzUm93KSB7XG4gICAgaWYgKCFlbmNvZGluZy5pc0RpbWVuc2lvbihST1cpKSB7XG4gICAgICB1dGlsLmVycm9yKCdSb3cgZW5jb2Rpbmcgc2hvdWxkIGJlIG9yZGluYWwuJyk7XG4gICAgfVxuICAgIGVudGVyLnkgPSB7c2NhbGU6IFJPVywgZmllbGQ6ICdrZXlzLicgKyBmYWNldEtleXMubGVuZ3RofTtcbiAgICBlbnRlci5oZWlnaHQgPSB7J3ZhbHVlJzogbGF5b3V0LmNlbGxIZWlnaHR9OyAvLyBIQUNLXG5cbiAgICBmYWNldEtleXMucHVzaChlbmNvZGluZy5maWVsZFJlZihST1cpKTtcblxuICAgIGlmIChoYXNDb2wpIHtcbiAgICAgIGZyb20gPSB1dGlsLmR1cGxpY2F0ZShncm91cC5mcm9tKTtcbiAgICAgIGZyb20udHJhbnNmb3JtID0gZnJvbS50cmFuc2Zvcm0gfHwgW107XG4gICAgICBmcm9tLnRyYW5zZm9ybS51bnNoaWZ0KHt0eXBlOiAnZmFjZXQnLCBrZXlzOiBbZW5jb2RpbmcuZmllbGRSZWYoQ09MKV19KTtcbiAgICB9XG5cbiAgICBheGVzR3JwID0gZ3JvdXBkZWYoJ3gtYXhlcycsIHtcbiAgICAgICAgYXhlczogZW5jb2RpbmcuaGFzKFgpID8gW2F4aXMuZGVmKFgsIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKV0gOiB1bmRlZmluZWQsXG4gICAgICAgIHg6IGhhc0NvbCA/IHtzY2FsZTogQ09MLCBmaWVsZDogJ2tleXMuMCd9IDoge3ZhbHVlOiAwfSxcbiAgICAgICAgd2lkdGg6IGhhc0NvbCAmJiB7J3ZhbHVlJzogbGF5b3V0LmNlbGxXaWR0aH0sIC8vSEFDSz9cbiAgICAgICAgZnJvbTogZnJvbVxuICAgICAgfSk7XG5cbiAgICBzcGVjLm1hcmtzLnVuc2hpZnQoYXhlc0dycCk7IC8vIG5lZWQgdG8gcHJlcGVuZCBzbyBpdCBhcHBlYXJzIHVuZGVyIHRoZSBwbG90c1xuICAgIChzcGVjLmF4ZXMgPSBzcGVjLmF4ZXMgfHwgW10pO1xuICAgIHNwZWMuYXhlcy5wdXNoKGF4aXMuZGVmKFJPVywgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpKTtcbiAgfSBlbHNlIHsgLy8gZG9lc24ndCBoYXZlIHJvd1xuICAgIGlmIChlbmNvZGluZy5oYXMoWCkpIHtcbiAgICAgIC8va2VlcCB4IGF4aXMgaW4gdGhlIGNlbGxcbiAgICAgIGNlbGxBeGVzLnB1c2goYXhpcy5kZWYoWCwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpKTtcbiAgICB9XG4gIH1cblxuICBpZiAoaGFzQ29sKSB7XG4gICAgaWYgKCFlbmNvZGluZy5pc0RpbWVuc2lvbihDT0wpKSB7XG4gICAgICB1dGlsLmVycm9yKCdDb2wgZW5jb2Rpbmcgc2hvdWxkIGJlIG9yZGluYWwuJyk7XG4gICAgfVxuICAgIGVudGVyLnggPSB7c2NhbGU6IENPTCwgZmllbGQ6ICdrZXlzLicgKyBmYWNldEtleXMubGVuZ3RofTtcbiAgICBlbnRlci53aWR0aCA9IHsndmFsdWUnOiBsYXlvdXQuY2VsbFdpZHRofTsgLy8gSEFDS1xuXG4gICAgZmFjZXRLZXlzLnB1c2goZW5jb2RpbmcuZmllbGRSZWYoQ09MKSk7XG5cbiAgICBpZiAoaGFzUm93KSB7XG4gICAgICBmcm9tID0gdXRpbC5kdXBsaWNhdGUoZ3JvdXAuZnJvbSk7XG4gICAgICBmcm9tLnRyYW5zZm9ybSA9IGZyb20udHJhbnNmb3JtIHx8IFtdO1xuICAgICAgZnJvbS50cmFuc2Zvcm0udW5zaGlmdCh7dHlwZTogJ2ZhY2V0Jywga2V5czogW2VuY29kaW5nLmZpZWxkUmVmKFJPVyldfSk7XG4gICAgfVxuXG4gICAgYXhlc0dycCA9IGdyb3VwZGVmKCd5LWF4ZXMnLCB7XG4gICAgICBheGVzOiBlbmNvZGluZy5oYXMoWSkgPyBbYXhpcy5kZWYoWSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpXSA6IHVuZGVmaW5lZCxcbiAgICAgIHk6IGhhc1JvdyAmJiB7c2NhbGU6IFJPVywgZmllbGQ6ICdrZXlzLjAnfSxcbiAgICAgIHg6IGhhc1JvdyAmJiB7dmFsdWU6IDB9LFxuICAgICAgaGVpZ2h0OiBoYXNSb3cgJiYgeyd2YWx1ZSc6IGxheW91dC5jZWxsSGVpZ2h0fSwgLy9IQUNLP1xuICAgICAgZnJvbTogZnJvbVxuICAgIH0pO1xuXG4gICAgc3BlYy5tYXJrcy51bnNoaWZ0KGF4ZXNHcnApOyAvLyBuZWVkIHRvIHByZXBlbmQgc28gaXQgYXBwZWFycyB1bmRlciB0aGUgcGxvdHNcbiAgICAoc3BlYy5heGVzID0gc3BlYy5heGVzIHx8IFtdKTtcbiAgICBzcGVjLmF4ZXMucHVzaChheGlzLmRlZihDT0wsIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSk7XG4gIH0gZWxzZSB7IC8vIGRvZXNuJ3QgaGF2ZSBjb2xcbiAgICBpZiAoZW5jb2RpbmcuaGFzKFkpKSB7XG4gICAgICBjZWxsQXhlcy5wdXNoKGF4aXMuZGVmKFksIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gYXNzdW1pbmcgZXF1YWwgY2VsbFdpZHRoIGhlcmVcbiAgLy8gVE9ETzogc3VwcG9ydCBoZXRlcm9nZW5vdXMgY2VsbFdpZHRoIChtYXliZSBieSB1c2luZyBtdWx0aXBsZSBzY2FsZXM/KVxuICBzcGVjLnNjYWxlcyA9IChzcGVjLnNjYWxlcyB8fCBbXSkuY29uY2F0KHNjYWxlLmRlZnMoXG4gICAgc2NhbGUubmFtZXMoZW50ZXIpLmNvbmNhdChzaW5nbGVTY2FsZU5hbWVzKSxcbiAgICBlbmNvZGluZyxcbiAgICBsYXlvdXQsXG4gICAgc3RhdHMsXG4gICAge3N0YWNrOiBzdGFjaywgZmFjZXQ6IHRydWV9XG4gICkpOyAvLyByb3cvY29sIHNjYWxlcyArIGNlbGwgc2NhbGVzXG5cbiAgaWYgKGNlbGxBeGVzLmxlbmd0aCA+IDApIHtcbiAgICBncm91cC5heGVzID0gY2VsbEF4ZXM7XG4gIH1cblxuICAvLyBhZGQgZmFjZXQgdHJhbnNmb3JtXG4gIHZhciB0cmFucyA9IChncm91cC5mcm9tLnRyYW5zZm9ybSB8fCAoZ3JvdXAuZnJvbS50cmFuc2Zvcm0gPSBbXSkpO1xuICB0cmFucy51bnNoaWZ0KHt0eXBlOiAnZmFjZXQnLCBrZXlzOiBmYWNldEtleXN9KTtcblxuICByZXR1cm4gc3BlYztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRlZjogZ3JvdXBkZWZcbn07XG5cbmZ1bmN0aW9uIGdyb3VwZGVmKG5hbWUsIG9wdCkge1xuICBvcHQgPSBvcHQgfHwge307XG4gIHJldHVybiB7XG4gICAgX25hbWU6IG5hbWUgfHwgdW5kZWZpbmVkLFxuICAgIHR5cGU6ICdncm91cCcsXG4gICAgZnJvbTogb3B0LmZyb20sXG4gICAgcHJvcGVydGllczoge1xuICAgICAgZW50ZXI6IHtcbiAgICAgICAgeDogb3B0LnggfHwgdW5kZWZpbmVkLFxuICAgICAgICB5OiBvcHQueSB8fCB1bmRlZmluZWQsXG4gICAgICAgIHdpZHRoOiBvcHQud2lkdGggfHwge2dyb3VwOiAnd2lkdGgnfSxcbiAgICAgICAgaGVpZ2h0OiBvcHQuaGVpZ2h0IHx8IHtncm91cDogJ2hlaWdodCd9XG4gICAgICB9XG4gICAgfSxcbiAgICBzY2FsZXM6IG9wdC5zY2FsZXMgfHwgdW5kZWZpbmVkLFxuICAgIGF4ZXM6IG9wdC5heGVzIHx8IHVuZGVmaW5lZCxcbiAgICBtYXJrczogb3B0Lm1hcmtzIHx8IFtdXG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHNldHRlciA9IHV0aWwuc2V0dGVyLFxuICB0aW1lID0gcmVxdWlyZSgnLi90aW1lJyksXG4gIGQzX2Zvcm1hdCA9IHJlcXVpcmUoJ2QzLWZvcm1hdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZsbGF5b3V0O1xuXG5mdW5jdGlvbiB2bGxheW91dChlbmNvZGluZywgc3RhdHMpIHtcbiAgdmFyIGxheW91dCA9IGJveChlbmNvZGluZywgc3RhdHMpO1xuICBsYXlvdXQgPSBvZmZzZXQoZW5jb2RpbmcsIHN0YXRzLCBsYXlvdXQpO1xuICByZXR1cm4gbGF5b3V0O1xufVxuXG4vKlxuICBIQUNLIHRvIHNldCBjaGFydCBzaXplXG4gIE5PVEU6IHRoaXMgZmFpbHMgZm9yIHBsb3RzIGRyaXZlbiBieSBkZXJpdmVkIHZhbHVlcyAoZS5nLiwgYWdncmVnYXRlcylcbiAgT25lIHNvbHV0aW9uIGlzIHRvIHVwZGF0ZSBWZWdhIHRvIHN1cHBvcnQgYXV0by1zaXppbmdcbiAgSW4gdGhlIG1lYW50aW1lLCBhdXRvLXBhZGRpbmcgKG1vc3RseSkgZG9lcyB0aGUgdHJpY2tcbiAqL1xuZnVuY3Rpb24gYm94KGVuY29kaW5nLCBzdGF0cykge1xuICB2YXIgaGFzUm93ID0gZW5jb2RpbmcuaGFzKFJPVyksXG4gICAgICBoYXNDb2wgPSBlbmNvZGluZy5oYXMoQ09MKSxcbiAgICAgIGhhc1ggPSBlbmNvZGluZy5oYXMoWCksXG4gICAgICBoYXNZID0gZW5jb2RpbmcuaGFzKFkpLFxuICAgICAgbWFya3R5cGUgPSBlbmNvZGluZy5tYXJrdHlwZSgpO1xuXG4gIC8vIEZJWE1FL0hBQ0sgd2UgbmVlZCB0byB0YWtlIGZpbHRlciBpbnRvIGFjY291bnRcbiAgdmFyIHhDYXJkaW5hbGl0eSA9IGhhc1ggJiYgZW5jb2RpbmcuaXNEaW1lbnNpb24oWCkgPyBlbmNvZGluZy5jYXJkaW5hbGl0eShYLCBzdGF0cykgOiAxLFxuICAgIHlDYXJkaW5hbGl0eSA9IGhhc1kgJiYgZW5jb2RpbmcuaXNEaW1lbnNpb24oWSkgPyBlbmNvZGluZy5jYXJkaW5hbGl0eShZLCBzdGF0cykgOiAxO1xuXG4gIHZhciB1c2VTbWFsbEJhbmQgPSB4Q2FyZGluYWxpdHkgPiBlbmNvZGluZy5jb25maWcoJ2xhcmdlQmFuZE1heENhcmRpbmFsaXR5JykgfHxcbiAgICB5Q2FyZGluYWxpdHkgPiBlbmNvZGluZy5jb25maWcoJ2xhcmdlQmFuZE1heENhcmRpbmFsaXR5Jyk7XG5cbiAgdmFyIGNlbGxXaWR0aCwgY2VsbEhlaWdodCwgY2VsbFBhZGRpbmcgPSBlbmNvZGluZy5jb25maWcoJ2NlbGxQYWRkaW5nJyk7XG5cbiAgLy8gc2V0IGNlbGxXaWR0aFxuICBpZiAoaGFzWCkge1xuICAgIGlmIChlbmNvZGluZy5pc09yZGluYWxTY2FsZShYKSkge1xuICAgICAgLy8gZm9yIG9yZGluYWwsIGhhc0NvbCBvciBub3QgZG9lc24ndCBtYXR0ZXIgLS0gd2Ugc2NhbGUgYmFzZWQgb24gY2FyZGluYWxpdHlcbiAgICAgIGNlbGxXaWR0aCA9ICh4Q2FyZGluYWxpdHkgKyBlbmNvZGluZy5maWVsZChYKS5iYW5kLnBhZGRpbmcpICogZW5jb2RpbmcuYmFuZFNpemUoWCwgdXNlU21hbGxCYW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VsbFdpZHRoID0gaGFzQ29sIHx8IGhhc1JvdyA/IGVuY29kaW5nLmZpZWxkKENPTCkud2lkdGggOiAgZW5jb2RpbmcuY29uZmlnKCdzaW5nbGVXaWR0aCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAobWFya3R5cGUgPT09IFRFWFQpIHtcbiAgICAgIGNlbGxXaWR0aCA9IGVuY29kaW5nLmNvbmZpZygndGV4dENlbGxXaWR0aCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjZWxsV2lkdGggPSBlbmNvZGluZy5iYW5kU2l6ZShYKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZXQgY2VsbEhlaWdodFxuICBpZiAoaGFzWSkge1xuICAgIGlmIChlbmNvZGluZy5pc09yZGluYWxTY2FsZShZKSkge1xuICAgICAgLy8gZm9yIG9yZGluYWwsIGhhc0NvbCBvciBub3QgZG9lc24ndCBtYXR0ZXIgLS0gd2Ugc2NhbGUgYmFzZWQgb24gY2FyZGluYWxpdHlcbiAgICAgIGNlbGxIZWlnaHQgPSAoeUNhcmRpbmFsaXR5ICsgZW5jb2RpbmcuZmllbGQoWSkuYmFuZC5wYWRkaW5nKSAqIGVuY29kaW5nLmJhbmRTaXplKFksIHVzZVNtYWxsQmFuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNlbGxIZWlnaHQgPSBoYXNDb2wgfHwgaGFzUm93ID8gZW5jb2RpbmcuZmllbGQoUk9XKS5oZWlnaHQgOiAgZW5jb2RpbmcuY29uZmlnKCdzaW5nbGVIZWlnaHQnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY2VsbEhlaWdodCA9IGVuY29kaW5nLmJhbmRTaXplKFkpO1xuICB9XG5cbiAgLy8gQ2VsbCBiYW5kcyB1c2UgcmFuZ2VCYW5kcygpLiBUaGVyZSBhcmUgbi0xIHBhZGRpbmcuICBPdXRlcnBhZGRpbmcgPSAwIGZvciBjZWxsc1xuXG4gIHZhciB3aWR0aCA9IGNlbGxXaWR0aCwgaGVpZ2h0ID0gY2VsbEhlaWdodDtcbiAgaWYgKGhhc0NvbCkge1xuICAgIHZhciBjb2xDYXJkaW5hbGl0eSA9IGVuY29kaW5nLmNhcmRpbmFsaXR5KENPTCwgc3RhdHMpO1xuICAgIHdpZHRoID0gY2VsbFdpZHRoICogKCgxICsgY2VsbFBhZGRpbmcpICogKGNvbENhcmRpbmFsaXR5IC0gMSkgKyAxKTtcbiAgfVxuICBpZiAoaGFzUm93KSB7XG4gICAgdmFyIHJvd0NhcmRpbmFsaXR5ID0gIGVuY29kaW5nLmNhcmRpbmFsaXR5KFJPVywgc3RhdHMpO1xuICAgIGhlaWdodCA9IGNlbGxIZWlnaHQgKiAoKDEgKyBjZWxsUGFkZGluZykgKiAocm93Q2FyZGluYWxpdHkgLSAxKSArIDEpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSB3aG9sZSBjZWxsXG4gICAgY2VsbFdpZHRoOiBjZWxsV2lkdGgsXG4gICAgY2VsbEhlaWdodDogY2VsbEhlaWdodCxcbiAgICBjZWxsUGFkZGluZzogY2VsbFBhZGRpbmcsXG4gICAgLy8gd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgY2hhcnRcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgLy8gaW5mb3JtYXRpb24gYWJvdXQgeCBhbmQgeSwgc3VjaCBhcyBiYW5kIHNpemVcbiAgICB4OiB7dXNlU21hbGxCYW5kOiB1c2VTbWFsbEJhbmR9LFxuICAgIHk6IHt1c2VTbWFsbEJhbmQ6IHVzZVNtYWxsQmFuZH1cbiAgfTtcbn1cblxuXG4vLyBGSVhNRSBmaWVsZFN0YXRzLm1heCBpc24ndCBhbHdheXMgdGhlIGxvbmdlc3RcbmZ1bmN0aW9uIGdldE1heE51bWJlckxlbmd0aChlbmNvZGluZywgZXQsIGZpZWxkU3RhdHMpIHtcbiAgdmFyIGZvcm1hdCA9IGVuY29kaW5nLm51bWJlckZvcm1hdChldCwgZmllbGRTdGF0cyk7XG5cbiAgcmV0dXJuIGQzX2Zvcm1hdC5mb3JtYXQoZm9ybWF0KShmaWVsZFN0YXRzLm1heCkubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBnZXRNYXhMZW5ndGgoZW5jb2RpbmcsIHN0YXRzLCBldCkge1xuICB2YXIgZmllbGQgPSBlbmNvZGluZy5maWVsZChldCksXG4gICAgZmllbGRTdGF0cyA9IHN0YXRzW2ZpZWxkLm5hbWVdO1xuXG4gIGlmIChmaWVsZC5iaW4pIHtcbiAgICAvLyBUT0RPIG9uY2UgYmluIHN1cHBvcnQgcmFuZ2UsIG5lZWQgdG8gdXBkYXRlIHRoaXNcbiAgICByZXR1cm4gZ2V0TWF4TnVtYmVyTGVuZ3RoKGVuY29kaW5nLCBldCwgZmllbGRTdGF0cyk7XG4gIH0gaWYgKGVuY29kaW5nLmlzVHlwZShldCwgUSkpIHtcbiAgICByZXR1cm4gZ2V0TWF4TnVtYmVyTGVuZ3RoKGVuY29kaW5nLCBldCwgZmllbGRTdGF0cyk7XG4gIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXNUeXBlKGV0LCBUKSkge1xuICAgIHJldHVybiB0aW1lLm1heExlbmd0aChlbmNvZGluZy5maWVsZChldCkudGltZVVuaXQsIGVuY29kaW5nKTtcbiAgfSBlbHNlIGlmIChlbmNvZGluZy5pc1R5cGVzKGV0LCBbTiwgT10pKSB7XG4gICAgaWYoZmllbGRTdGF0cy50eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIGdldE1heE51bWJlckxlbmd0aChlbmNvZGluZywgZXQsIGZpZWxkU3RhdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTWF0aC5taW4oZmllbGRTdGF0cy5tYXgsIGVuY29kaW5nLmF4aXMoZXQpLm1heExhYmVsTGVuZ3RoIHx8IEluZmluaXR5KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gb2Zmc2V0KGVuY29kaW5nLCBzdGF0cywgbGF5b3V0KSB7XG4gIFtYLCBZXS5mb3JFYWNoKGZ1bmN0aW9uIChldCkge1xuICAgIC8vIFRPRE8oa2FuaXR3KTogSnVsIDE5LCAyMDE1IC0gY3JlYXRlIGEgc2V0IG9mIHZpc3VhbCB0ZXN0IGZvciBleHRyYU9mZnNldFxuICAgIHZhciBleHRyYU9mZnNldCA9IGV0ID09PSBYID8gMjAgOiAyMixcbiAgICAgIG1heExlbmd0aDtcbiAgICBpZiAoZW5jb2RpbmcuaXNEaW1lbnNpb24oZXQpIHx8IGVuY29kaW5nLmlzVHlwZShldCwgVCkpIHtcbiAgICAgIG1heExlbmd0aCA9IGdldE1heExlbmd0aChlbmNvZGluZywgc3RhdHMsIGV0KTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgLy8gVE9ETyBvbmNlIHdlIGhhdmUgIzUxMiAoYWxsb3cgdXNpbmcgaW5mZXJyZWQgdHlwZSlcbiAgICAgIC8vIE5lZWQgdG8gYWRqdXN0IGNvbmRpdGlvbiBoZXJlLlxuICAgICAgZW5jb2RpbmcuaXNUeXBlKGV0LCBRKSB8fFxuICAgICAgZW5jb2RpbmcuYWdncmVnYXRlKGV0KSA9PT0gJ2NvdW50J1xuICAgICkge1xuICAgICAgaWYgKFxuICAgICAgICBldD09PVlcbiAgICAgICAgLy8gfHwgKGV0PT09WCAmJiBmYWxzZSlcbiAgICAgICAgLy8gRklYTUUgZGV0ZXJtaW5lIHdoZW4gWCB3b3VsZCByb3RhdGUsIGJ1dCBzaG91bGQgbW92ZSB0aGlzIHRvIGF4aXMuanMgZmlyc3QgIzUwNlxuICAgICAgKSB7XG4gICAgICAgIG1heExlbmd0aCA9IGdldE1heExlbmd0aChlbmNvZGluZywgc3RhdHMsIGV0KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbm90aGluZ1xuICAgIH1cblxuICAgIGlmIChtYXhMZW5ndGgpIHtcbiAgICAgIHNldHRlcihsYXlvdXQsW2V0LCAnYXhpc1RpdGxlT2Zmc2V0J10sIGVuY29kaW5nLmNvbmZpZygnY2hhcmFjdGVyV2lkdGgnKSAqICBtYXhMZW5ndGggKyBleHRyYU9mZnNldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlmIG5vIG1heCBsZW5ndGggKG5vIHJvdGF0aW9uIGNhc2UpLCB1c2UgbWF4TGVuZ3RoID0gM1xuICAgICAgc2V0dGVyKGxheW91dCxbZXQsICdheGlzVGl0bGVPZmZzZXQnXSwgZW5jb2RpbmcuY29uZmlnKCdjaGFyYWN0ZXJXaWR0aCcpICogMyArIGV4dHJhT2Zmc2V0KTtcbiAgICB9XG5cbiAgfSk7XG4gIHJldHVybiBsYXlvdXQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgc2V0dGVyID0gdXRpbC5zZXR0ZXIsXG4gIGdldHRlciA9IHV0aWwuZ2V0dGVyO1xuXG52YXIgbGVnZW5kID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxubGVnZW5kLmRlZnMgPSBmdW5jdGlvbihlbmNvZGluZywgc3R5bGUpIHtcbiAgdmFyIGRlZnMgPSBbXTtcblxuICBpZiAoZW5jb2RpbmcuaGFzKENPTE9SKSAmJiBlbmNvZGluZy5maWVsZChDT0xPUikubGVnZW5kKSB7XG4gICAgZGVmcy5wdXNoKGxlZ2VuZC5kZWYoQ09MT1IsIGVuY29kaW5nLCB7XG4gICAgICBmaWxsOiBDT0xPUixcbiAgICAgIG9yaWVudDogJ3JpZ2h0J1xuICAgIH0sIHN0eWxlKSk7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuaGFzKFNJWkUpICYmIGVuY29kaW5nLmZpZWxkKFNJWkUpLmxlZ2VuZCkge1xuICAgIGRlZnMucHVzaChsZWdlbmQuZGVmKFNJWkUsIGVuY29kaW5nLCB7XG4gICAgICBzaXplOiBTSVpFLFxuICAgICAgb3JpZW50OiBkZWZzLmxlbmd0aCA9PT0gMSA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICB9LCBzdHlsZSkpO1xuICB9XG5cbiAgaWYgKGVuY29kaW5nLmhhcyhTSEFQRSkgJiYgZW5jb2RpbmcuZmllbGQoU0hBUEUpLmxlZ2VuZCkge1xuICAgIGlmIChkZWZzLmxlbmd0aCA9PT0gMikge1xuICAgICAgY29uc29sZS5lcnJvcignVmVnYS1saXRlIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIHR3byBsZWdlbmRzJyk7XG4gICAgfVxuICAgIGRlZnMucHVzaChsZWdlbmQuZGVmKFNIQVBFLCBlbmNvZGluZywge1xuICAgICAgc2hhcGU6IFNIQVBFLFxuICAgICAgb3JpZW50OiBkZWZzLmxlbmd0aCA9PT0gMSA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICB9LCBzdHlsZSkpO1xuICB9XG4gIHJldHVybiBkZWZzO1xufTtcblxubGVnZW5kLmRlZiA9IGZ1bmN0aW9uKG5hbWUsIGVuY29kaW5nLCBkZWYsIHN0eWxlKSB7XG4gIHZhciB0aW1lVW5pdCA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLnRpbWVVbml0O1xuXG4gIGRlZi50aXRsZSA9IGxlZ2VuZC50aXRsZShuYW1lLCBlbmNvZGluZyk7XG4gIGRlZiA9IGxlZ2VuZC5zdHlsZShuYW1lLCBlbmNvZGluZywgZGVmLCBzdHlsZSk7XG5cbiAgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSAmJlxuICAgIHRpbWVVbml0ICYmXG4gICAgdGltZS5oYXNTY2FsZSh0aW1lVW5pdClcbiAgKSB7XG4gICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywgJ2xhYmVscycsICd0ZXh0JywgJ3NjYWxlJ10sICd0aW1lLScrIHRpbWVVbml0KTtcbiAgfVxuXG4gIHJldHVybiBkZWY7XG59O1xuXG5sZWdlbmQuc3R5bGUgPSBmdW5jdGlvbihuYW1lLCBlLCBkZWYsIHN0eWxlKSB7XG4gIHZhciBzeW1ib2xzID0gZ2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywgJ3N5bWJvbHMnXSksXG4gICAgbWFya3R5cGUgPSBlLm1hcmt0eXBlKCk7XG5cbiAgc3dpdGNoIChtYXJrdHlwZSkge1xuICAgIGNhc2UgJ2Jhcic6XG4gICAgY2FzZSAndGljayc6XG4gICAgY2FzZSAndGV4dCc6XG4gICAgICBzeW1ib2xzLnN0cm9rZSA9IHt2YWx1ZTogJ3RyYW5zcGFyZW50J307XG4gICAgICBzeW1ib2xzLnNoYXBlID0ge3ZhbHVlOiAnc3F1YXJlJ307XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2NpcmNsZSc6XG4gICAgY2FzZSAnc3F1YXJlJzpcbiAgICAgIHN5bWJvbHMuc2hhcGUgPSB7dmFsdWU6IG1hcmt0eXBlfTtcbiAgICAgIC8qIGZhbGwgdGhyb3VnaCAqL1xuICAgIGNhc2UgJ3BvaW50JzpcbiAgICAgIC8vIGZpbGwgb3Igc3Ryb2tlXG4gICAgICBpZiAoZS5maWVsZChTSEFQRSkuZmlsbGVkKSB7XG4gICAgICAgIGlmIChlLmhhcyhDT0xPUikgJiYgbmFtZSA9PT0gQ09MT1IpIHtcbiAgICAgICAgICBzeW1ib2xzLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogJ2RhdGEnfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzeW1ib2xzLmZpbGwgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgICAgICAgfVxuICAgICAgICBzeW1ib2xzLnN0cm9rZSA9IHt2YWx1ZTogJ3RyYW5zcGFyZW50J307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZS5oYXMoQ09MT1IpICYmIG5hbWUgPT09IENPTE9SKSB7XG4gICAgICAgICAgc3ltYm9scy5zdHJva2UgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogJ2RhdGEnfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzeW1ib2xzLnN0cm9rZSA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICAgICAgICB9XG4gICAgICAgIHN5bWJvbHMuZmlsbCA9IHt2YWx1ZTogJ3RyYW5zcGFyZW50J307XG4gICAgICAgIHN5bWJvbHMuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IGUuY29uZmlnKCdzdHJva2VXaWR0aCcpfTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbGluZSc6XG4gICAgY2FzZSAnYXJlYSc6XG4gICAgICAvLyBUT0RPIHVzZSBzaGFwZSBoZXJlIGFmdGVyIGltcGxlbWVudGluZyAjNTA4XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBvcGFjaXR5ID0gZS5maWVsZChDT0xPUikub3BhY2l0eSB8fCBzdHlsZS5vcGFjaXR5O1xuICBpZiAob3BhY2l0eSkge1xuICAgIHN5bWJvbHMub3BhY2l0eSA9IHt2YWx1ZTogb3BhY2l0eX07XG4gIH1cbiAgcmV0dXJuIGRlZjtcbn07XG5cbmxlZ2VuZC50aXRsZSA9IGZ1bmN0aW9uKG5hbWUsIGVuY29kaW5nKSB7XG4gIHZhciBsZWcgPSBlbmNvZGluZy5maWVsZChuYW1lKS5sZWdlbmQ7XG5cbiAgaWYgKGxlZy50aXRsZSkgcmV0dXJuIGxlZy50aXRsZTtcblxuICByZXR1cm4gZW5jb2RpbmcuZmllbGRUaXRsZShuYW1lKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIG1hcmtzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxubWFya3MuZGVmID0gZnVuY3Rpb24oZW5jb2RpbmcsIGxheW91dCwgc3R5bGUsIHN0YXRzKSB7XG5cbiAgdmFyIGRlZnMgPSBbXSxcbiAgICBtYXJrID0gbWFya3NbZW5jb2RpbmcubWFya3R5cGUoKV0sXG4gICAgZnJvbSA9IGVuY29kaW5nLmRhdGFUYWJsZSgpO1xuXG4gIC8vIHRvIGFkZCBhIGJhY2tncm91bmQgdG8gdGV4dCwgd2UgbmVlZCB0byBhZGQgaXQgYmVmb3JlIHRoZSB0ZXh0XG4gIGlmIChlbmNvZGluZy5tYXJrdHlwZSgpID09PSBURVhUICYmIGVuY29kaW5nLmhhcyhDT0xPUikpIHtcbiAgICB2YXIgYmcgPSB7XG4gICAgICB4OiB7dmFsdWU6IDB9LFxuICAgICAgeToge3ZhbHVlOiAwfSxcbiAgICAgIHgyOiB7dmFsdWU6IGxheW91dC5jZWxsV2lkdGh9LFxuICAgICAgeTI6IHt2YWx1ZTogbGF5b3V0LmNlbGxIZWlnaHR9LFxuICAgICAgZmlsbDoge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGVuY29kaW5nLmZpZWxkUmVmKENPTE9SKX1cbiAgICB9O1xuICAgIGRlZnMucHVzaCh7XG4gICAgICB0eXBlOiAncmVjdCcsXG4gICAgICBmcm9tOiB7ZGF0YTogZnJvbX0sXG4gICAgICBwcm9wZXJ0aWVzOiB7ZW50ZXI6IGJnLCB1cGRhdGU6IGJnfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gYWRkIHRoZSBtYXJrIGRlZiBmb3IgdGhlIG1haW4gdGhpbmdcbiAgdmFyIHAgPSBtYXJrLnByb3AoZW5jb2RpbmcsIGxheW91dCwgc3R5bGUsIHN0YXRzKTtcbiAgZGVmcy5wdXNoKHtcbiAgICB0eXBlOiBtYXJrLnR5cGUsXG4gICAgZnJvbToge2RhdGE6IGZyb219LFxuICAgIHByb3BlcnRpZXM6IHtlbnRlcjogcCwgdXBkYXRlOiBwfVxuICB9KTtcblxuICByZXR1cm4gZGVmcztcbn07XG5cbm1hcmtzLmJhciA9IHtcbiAgdHlwZTogJ3JlY3QnLFxuICBzdGFjazogdHJ1ZSxcbiAgcHJvcDogYmFyX3Byb3BzLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBzaXplOiAxLCBjb2xvcjogMX1cbn07XG5cbm1hcmtzLmxpbmUgPSB7XG4gIHR5cGU6ICdsaW5lJyxcbiAgbGluZTogdHJ1ZSxcbiAgcHJvcDogbGluZV9wcm9wcyxcbiAgcmVxdWlyZWRFbmNvZGluZzogWyd4JywgJ3knXSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgY29sb3I6IDEsIGRldGFpbDoxfVxufTtcblxubWFya3MuYXJlYSA9IHtcbiAgdHlwZTogJ2FyZWEnLFxuICBzdGFjazogdHJ1ZSxcbiAgbGluZTogdHJ1ZSxcbiAgcmVxdWlyZWRFbmNvZGluZzogWyd4JywgJ3knXSxcbiAgcHJvcDogYXJlYV9wcm9wcyxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgY29sb3I6IDF9XG59O1xuXG5tYXJrcy50aWNrID0ge1xuICB0eXBlOiAncmVjdCcsXG4gIHByb3A6IHRpY2tfcHJvcHMsXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OiAxLCBjb2w6IDEsIHg6IDEsIHk6IDEsIGNvbG9yOiAxLCBkZXRhaWw6IDF9XG59O1xuXG5tYXJrcy5jaXJjbGUgPSB7XG4gIHR5cGU6ICdzeW1ib2wnLFxuICBwcm9wOiBmaWxsZWRfcG9pbnRfcHJvcHMoJ2NpcmNsZScpLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBzaXplOiAxLCBjb2xvcjogMSwgZGV0YWlsOiAxfVxufTtcblxubWFya3Muc3F1YXJlID0ge1xuICB0eXBlOiAnc3ltYm9sJyxcbiAgcHJvcDogZmlsbGVkX3BvaW50X3Byb3BzKCdzcXVhcmUnKSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IG1hcmtzLmNpcmNsZS5zdXBwb3J0ZWRFbmNvZGluZ1xufTtcblxubWFya3MucG9pbnQgPSB7XG4gIHR5cGU6ICdzeW1ib2wnLFxuICBwcm9wOiBwb2ludF9wcm9wcyxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgc2l6ZTogMSwgY29sb3I6IDEsIHNoYXBlOiAxLCBkZXRhaWw6IDF9XG59O1xuXG5tYXJrcy50ZXh0ID0ge1xuICB0eXBlOiAndGV4dCcsXG4gIHByb3A6IHRleHRfcHJvcHMsXG4gIHJlcXVpcmVkRW5jb2Rpbmc6IFsndGV4dCddLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCBzaXplOiAxLCBjb2xvcjogMSwgdGV4dDogMX1cbn07XG5cbmZ1bmN0aW9uIGJhcl9wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcblxuICB2YXIgcCA9IHt9O1xuXG4gIC8vIHgncyBhbmQgd2lkdGhcbiAgaWYgKGUuaXNNZWFzdXJlKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gICAgaWYgKCFlLmhhcyhZKSB8fCBlLmlzRGltZW5zaW9uKFkpKSB7XG4gICAgICBwLngyID0ge3ZhbHVlOiAwfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGUuaGFzKFgpKSB7IC8vIGlzIG9yZGluYWxcbiAgICAgICBwLnhjID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gICAgfSBlbHNlIHtcbiAgICAgICBwLnggPSB7dmFsdWU6IDAsIG9mZnNldDogZS5jb25maWcoJ3NpbmdsZUJhck9mZnNldCcpfTtcbiAgICB9XG4gIH1cblxuICAvLyB3aWR0aFxuICBpZiAoIXAueDIpIHtcbiAgICBpZiAoIWUuaGFzKFgpIHx8IGUuaXNPcmRpbmFsU2NhbGUoWCkpIHsgLy8gbm8gWCBvciBYIGlzIG9yZGluYWxcbiAgICAgIGlmIChlLmhhcyhTSVpFKSkge1xuICAgICAgICBwLndpZHRoID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZFJlZihTSVpFKX07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwLndpZHRoID0ge1xuICAgICAgICAgIHZhbHVlOiBlLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCksXG4gICAgICAgICAgb2Zmc2V0OiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIFggaXMgUXVhbnQgb3IgVGltZSBTY2FsZVxuICAgICAgcC53aWR0aCA9IHt2YWx1ZTogMn07XG4gICAgfVxuICB9XG5cbiAgLy8geSdzICYgaGVpZ2h0XG4gIGlmIChlLmlzTWVhc3VyZShZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICAgIHAueTIgPSB7Z3JvdXA6ICdoZWlnaHQnfTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoZS5oYXMoWSkpIHsgLy8gaXMgb3JkaW5hbFxuICAgICAgcC55YyA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnkyID0ge2dyb3VwOiAnaGVpZ2h0Jywgb2Zmc2V0OiAtZS5jb25maWcoJ3NpbmdsZUJhck9mZnNldCcpfTtcbiAgICB9XG5cbiAgICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICAgIHAuaGVpZ2h0ID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZFJlZihTSVpFKX07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAuaGVpZ2h0ID0ge1xuICAgICAgICB2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpLFxuICAgICAgICBvZmZzZXQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8vIGZpbGxcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkUmVmKENPTE9SKX07XG4gIH0gZWxzZSB7XG4gICAgcC5maWxsID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gIH1cblxuICAvLyBvcGFjaXR5XG4gIHZhciBvcGFjaXR5ID0gZS5maWVsZChDT0xPUikub3BhY2l0eTtcbiAgaWYgKG9wYWNpdHkpIHAub3BhY2l0eSA9IHt2YWx1ZTogb3BhY2l0eX07XG5cbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIHBvaW50X3Byb3BzKGUsIGxheW91dCwgc3R5bGUpIHtcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmhhcyhYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGRSZWYoWCl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgIHAueCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpIC8gMn07XG4gIH1cblxuICAvLyB5XG4gIGlmIChlLmhhcyhZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgIHAueSA9IHt2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMn07XG4gIH1cblxuICAvLyBzaXplXG4gIGlmIChlLmhhcyhTSVpFKSkge1xuICAgIHAuc2l6ZSA9IHtzY2FsZTogU0laRSwgZmllbGQ6IGUuZmllbGRSZWYoU0laRSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhTSVpFKSkge1xuICAgIHAuc2l6ZSA9IHt2YWx1ZTogZS52YWx1ZShTSVpFKX07XG4gIH1cblxuICAvLyBzaGFwZVxuICBpZiAoZS5oYXMoU0hBUEUpKSB7XG4gICAgcC5zaGFwZSA9IHtzY2FsZTogU0hBUEUsIGZpZWxkOiBlLmZpZWxkUmVmKFNIQVBFKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFNIQVBFKSkge1xuICAgIHAuc2hhcGUgPSB7dmFsdWU6IGUudmFsdWUoU0hBUEUpfTtcbiAgfVxuXG4gIC8vIGZpbGwgb3Igc3Ryb2tlXG4gIGlmIChlLmZpZWxkKFNIQVBFKS5maWxsZWQpIHtcbiAgICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZFJlZihDT0xPUil9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgICAgcC5maWxsID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICAgIHAuc3Ryb2tlID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGRSZWYoQ09MT1IpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICAgIHAuc3Ryb2tlID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gICAgfVxuICAgIHAuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IGUuY29uZmlnKCdzdHJva2VXaWR0aCcpfTtcbiAgfVxuXG4gIC8vIG9wYWNpdHlcbiAgdmFyIG9wYWNpdHkgPSBlLmZpZWxkKENPTE9SKS5vcGFjaXR5IHx8IHN0eWxlLm9wYWNpdHk7XG4gIGlmIChvcGFjaXR5KSBwLm9wYWNpdHkgPSB7dmFsdWU6IG9wYWNpdHl9O1xuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBsaW5lX3Byb3BzKGUsbGF5b3V0LCBzdHlsZSkge1xuICAvLyBqc2hpbnQgdW51c2VkOmZhbHNlXG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkUmVmKFgpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkUmVmKFkpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7Z3JvdXA6ICdoZWlnaHQnfTtcbiAgfVxuXG4gIC8vIHN0cm9rZVxuICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5zdHJva2UgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZFJlZihDT0xPUil9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICBwLnN0cm9rZSA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICB9XG5cbiAgdmFyIG9wYWNpdHkgPSBlLmZpZWxkKENPTE9SKS5vcGFjaXR5O1xuICBpZiAob3BhY2l0eSkgcC5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcblxuICBwLnN0cm9rZVdpZHRoID0ge3ZhbHVlOiBlLmNvbmZpZygnc3Ryb2tlV2lkdGgnKX07XG5cbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIGFyZWFfcHJvcHMoZSwgbGF5b3V0LCBzdHlsZSkge1xuICAvLyBqc2hpbnQgdW51c2VkOmZhbHNlXG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5pc01lYXN1cmUoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkUmVmKFgpfTtcbiAgICBpZiAoZS5pc0RpbWVuc2lvbihZKSkge1xuICAgICAgcC54MiA9IHtzY2FsZTogWCwgdmFsdWU6IDB9O1xuICAgICAgcC5vcmllbnQgPSB7dmFsdWU6ICdob3Jpem9udGFsJ307XG4gICAgfVxuICB9IGVsc2UgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gIH0gZWxzZSB7XG4gICAgcC54ID0ge3ZhbHVlOiAwfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaXNNZWFzdXJlKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZFJlZihZKX07XG4gICAgcC55MiA9IHtzY2FsZTogWSwgdmFsdWU6IDB9O1xuICB9IGVsc2UgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZFJlZihZKX07XG4gIH0gZWxzZSB7XG4gICAgcC55ID0ge2dyb3VwOiAnaGVpZ2h0J307XG4gIH1cblxuICAvLyBmaWxsXG4gIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZFJlZihDT0xPUil9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICBwLmZpbGwgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgfVxuXG4gIHZhciBvcGFjaXR5ID0gZS5maWVsZChDT0xPUikub3BhY2l0eTtcbiAgaWYgKG9wYWNpdHkpIHAub3BhY2l0eSA9IHt2YWx1ZTogb3BhY2l0eX07XG5cbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIHRpY2tfcHJvcHMoZSwgbGF5b3V0LCBzdHlsZSkge1xuICB2YXIgcCA9IHt9O1xuXG4gIC8vIHhcbiAgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gICAgaWYgKGUuaXNEaW1lbnNpb24oWCkpIHtcbiAgICAgIHAueC5vZmZzZXQgPSAtZS5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpIC8gMztcbiAgICB9XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3ZhbHVlOiAwfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZFJlZihZKX07XG4gICAgaWYgKGUuaXNEaW1lbnNpb24oWSkpIHtcbiAgICAgIHAueS5vZmZzZXQgPSAtZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMztcbiAgICB9XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3ZhbHVlOiAwfTtcbiAgfVxuXG4gIC8vIHdpZHRoXG4gIGlmICghZS5oYXMoWCkgfHwgZS5pc0RpbWVuc2lvbihYKSkge1xuICAgIHAud2lkdGggPSB7dmFsdWU6IGUuYmFuZFNpemUoWCwgbGF5b3V0LnkudXNlU21hbGxCYW5kKSAvIDEuNX07XG4gIH0gZWxzZSB7XG4gICAgcC53aWR0aCA9IHt2YWx1ZTogMX07XG4gIH1cblxuICAvLyBoZWlnaHRcbiAgaWYgKCFlLmhhcyhZKSB8fCBlLmlzRGltZW5zaW9uKFkpKSB7XG4gICAgcC5oZWlnaHQgPSB7dmFsdWU6IGUuYmFuZFNpemUoWSwgbGF5b3V0LnkudXNlU21hbGxCYW5kKSAvIDEuNX07XG4gIH0gZWxzZSB7XG4gICAgcC5oZWlnaHQgPSB7dmFsdWU6IDF9O1xuICB9XG5cbiAgLy8gZmlsbFxuICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5maWxsID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGRSZWYoQ09MT1IpfTtcbiAgfSBlbHNlIHtcbiAgICBwLmZpbGwgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgfVxuXG4gIHZhciBvcGFjaXR5ID0gZS5maWVsZChDT0xPUikub3BhY2l0eSAgfHwgc3R5bGUub3BhY2l0eTtcbiAgaWYob3BhY2l0eSkgcC5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gZmlsbGVkX3BvaW50X3Byb3BzKHNoYXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbihlLCBsYXlvdXQsIHN0eWxlKSB7XG4gICAgdmFyIHAgPSB7fTtcblxuICAgIC8vIHhcbiAgICBpZiAoZS5oYXMoWCkpIHtcbiAgICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGRSZWYoWCl9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgICBwLnggPSB7dmFsdWU6IGUuYmFuZFNpemUoWCwgbGF5b3V0LngudXNlU21hbGxCYW5kKSAvIDJ9O1xuICAgIH1cblxuICAgIC8vIHlcbiAgICBpZiAoZS5oYXMoWSkpIHtcbiAgICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKFkpKSB7XG4gICAgICBwLnkgPSB7dmFsdWU6IGUuYmFuZFNpemUoWSwgbGF5b3V0LnkudXNlU21hbGxCYW5kKSAvIDJ9O1xuICAgIH1cblxuICAgIC8vIHNpemVcbiAgICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICAgIHAuc2l6ZSA9IHtzY2FsZTogU0laRSwgZmllbGQ6IGUuZmllbGRSZWYoU0laRSl9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgICBwLnNpemUgPSB7dmFsdWU6IGUudmFsdWUoU0laRSl9O1xuICAgIH1cblxuICAgIC8vIHNoYXBlXG4gICAgcC5zaGFwZSA9IHt2YWx1ZTogc2hhcGV9O1xuXG4gICAgLy8gZmlsbFxuICAgIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICAgIHAuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkUmVmKENPTE9SKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLmZpbGwgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgICB9XG5cbiAgICB2YXIgb3BhY2l0eSA9IGUuZmllbGQoQ09MT1IpLm9wYWNpdHkgIHx8IHN0eWxlLm9wYWNpdHk7XG4gICAgaWYob3BhY2l0eSkgcC5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcblxuICAgIHJldHVybiBwO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0ZXh0X3Byb3BzKGUsIGxheW91dCwgc3R5bGUsIHN0YXRzKSB7XG4gIHZhciBwID0ge30sXG4gICAgZmllbGQgPSBlLmZpZWxkKFRFWFQpO1xuXG4gIC8vIHhcbiAgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgaWYgKGUuaGFzKFRFWFQpICYmIGUuaXNUeXBlKFRFWFQsIFEpKSB7XG4gICAgICBwLnggPSB7dmFsdWU6IGxheW91dC5jZWxsV2lkdGgtNX07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpIC8gMn07XG4gICAgfVxuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkUmVmKFkpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7dmFsdWU6IGUuYmFuZFNpemUoWSwgbGF5b3V0LnkudXNlU21hbGxCYW5kKSAvIDJ9O1xuICB9XG5cbiAgLy8gc2l6ZVxuICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICBwLmZvbnRTaXplID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZFJlZihTSVpFKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFNJWkUpKSB7XG4gICAgcC5mb250U2l6ZSA9IHt2YWx1ZTogZmllbGQuZm9udC5zaXplfTtcbiAgfVxuXG4gIC8vIGZpbGxcbiAgLy8gY29sb3Igc2hvdWxkIGJlIHNldCB0byBiYWNrZ3JvdW5kXG4gIHAuZmlsbCA9IHt2YWx1ZTogZmllbGQuY29sb3J9O1xuXG4gIHZhciBvcGFjaXR5ID0gZS5maWVsZChDT0xPUikub3BhY2l0eSAgfHwgc3R5bGUub3BhY2l0eTtcbiAgaWYob3BhY2l0eSkgcC5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcblxuICAvLyB0ZXh0XG4gIGlmIChlLmhhcyhURVhUKSkge1xuICAgIGlmIChlLmlzVHlwZShURVhULCBRKSkge1xuICAgICAgdmFyIGZpZWxkU3RhdHMgPSBzdGF0c1tlLmZpZWxkTmFtZShURVhUKV0sXG4gICAgICAgIG51bWJlckZvcm1hdCA9IGZpZWxkLmZvcm1hdCB8fCBlLm51bWJlckZvcm1hdChmaWVsZFN0YXRzKTtcblxuICAgICAgcC50ZXh0ID0ge3RlbXBsYXRlOiAne3snICsgZS5maWVsZFJlZihURVhUKSArICcgfCBudW1iZXI6XFwnJyArXG4gICAgICAgIG51bWJlckZvcm1hdCArJ1xcJ319J307XG4gICAgICBwLmFsaWduID0ge3ZhbHVlOiBmaWVsZC5hbGlnbn07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAudGV4dCA9IHtmaWVsZDogZS5maWVsZFJlZihURVhUKX07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHAudGV4dCA9IHt2YWx1ZTogZmllbGQucGxhY2Vob2xkZXJ9O1xuICB9XG5cbiAgcC5mb250ID0ge3ZhbHVlOiBmaWVsZC5mb250LmZhbWlseX07XG4gIHAuZm9udFdlaWdodCA9IHt2YWx1ZTogZmllbGQuZm9udC53ZWlnaHR9O1xuICBwLmZvbnRTdHlsZSA9IHt2YWx1ZTogZmllbGQuZm9udC5zdHlsZX07XG4gIHAuYmFzZWxpbmUgPSB7dmFsdWU6IGZpZWxkLmJhc2VsaW5lfTtcblxuICByZXR1cm4gcDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICB0aW1lID0gcmVxdWlyZSgnLi90aW1lJyksXG4gIGNvbG9yYnJld2VyID0gcmVxdWlyZSgnY29sb3JicmV3ZXInKSxcbiAgaW50ZXJwb2xhdGUgPSByZXF1aXJlKCdkMy1jb2xvcicpLmludGVycG9sYXRlSHNsLFxuICBzY2hlbWEgPSByZXF1aXJlKCcuLi9zY2hlbWEvc2NoZW1hJyksXG4gIHZsc29ydCA9IHJlcXVpcmUoJy4vc29ydCcpO1xuXG52YXIgc2NhbGUgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5zY2FsZS5uYW1lcyA9IGZ1bmN0aW9uKHByb3BzKSB7XG4gIHJldHVybiB1dGlsLmtleXModXRpbC5rZXlzKHByb3BzKS5yZWR1Y2UoZnVuY3Rpb24oYSwgeCkge1xuICAgIGlmIChwcm9wc1t4XSAmJiBwcm9wc1t4XS5zY2FsZSkgYVtwcm9wc1t4XS5zY2FsZV0gPSAxO1xuICAgIHJldHVybiBhO1xuICB9LCB7fSkpO1xufTtcblxuc2NhbGUuZGVmcyA9IGZ1bmN0aW9uKG5hbWVzLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cywgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcblxuICByZXR1cm4gbmFtZXMucmVkdWNlKGZ1bmN0aW9uKGEsIG5hbWUpIHtcbiAgICB2YXIgcyA9IHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB0eXBlOiBzY2FsZS50eXBlKG5hbWUsIGVuY29kaW5nKSxcbiAgICAgIGRvbWFpbjogc2NhbGUuZG9tYWluKG5hbWUsIGVuY29kaW5nLCBzdGF0cywgb3B0KVxuICAgIH07XG5cbiAgICBzLnNvcnQgPSBzY2FsZS5zb3J0KHMsIGVuY29kaW5nLCBuYW1lKSB8fCB1bmRlZmluZWQ7XG5cbiAgICBzY2FsZS5yYW5nZShzLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cywgb3B0KTtcblxuICAgIHJldHVybiAoYS5wdXNoKHMpLCBhKTtcbiAgfSwgW10pO1xufTtcblxuc2NhbGUuc29ydCA9IGZ1bmN0aW9uKHMsIGVuY29kaW5nLCBuYW1lKSB7XG4gIHJldHVybiBzLnR5cGUgPT09ICdvcmRpbmFsJyAmJiAoXG4gICAgISFlbmNvZGluZy5iaW4obmFtZSkgfHxcbiAgICBlbmNvZGluZy5zb3J0KG5hbWUpLmxlbmd0aCA9PT0gMFxuICApO1xufTtcblxuc2NhbGUudHlwZSA9IGZ1bmN0aW9uKG5hbWUsIGVuY29kaW5nKSB7XG5cbiAgc3dpdGNoIChlbmNvZGluZy50eXBlKG5hbWUpKSB7XG4gICAgY2FzZSBOOiAvL2ZhbGwgdGhyb3VnaFxuICAgIGNhc2UgTzogcmV0dXJuICdvcmRpbmFsJztcbiAgICBjYXNlIFQ6XG4gICAgICB2YXIgdGltZVVuaXQgPSBlbmNvZGluZy5maWVsZChuYW1lKS50aW1lVW5pdDtcbiAgICAgIHJldHVybiB0aW1lVW5pdCA/IHRpbWUuc2NhbGUudHlwZSh0aW1lVW5pdCwgbmFtZSkgOiAndGltZSc7XG4gICAgY2FzZSBROlxuICAgICAgaWYgKGVuY29kaW5nLmJpbihuYW1lKSkge1xuICAgICAgICByZXR1cm4gbmFtZSA9PT0gQ09MT1IgPyAnbGluZWFyJyA6ICdvcmRpbmFsJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbmNvZGluZy5zY2FsZShuYW1lKS50eXBlO1xuICB9XG59O1xuXG5zY2FsZS5kb21haW4gPSBmdW5jdGlvbiAobmFtZSwgZW5jb2RpbmcsIHN0YXRzLCBvcHQpIHtcbiAgdmFyIGZpZWxkID0gZW5jb2RpbmcuZmllbGQobmFtZSk7XG5cbiAgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSkge1xuICAgIHZhciByYW5nZSA9IHRpbWUuc2NhbGUuZG9tYWluKGZpZWxkLnRpbWVVbml0LCBuYW1lKTtcbiAgICBpZihyYW5nZSkgcmV0dXJuIHJhbmdlO1xuICB9XG5cbiAgaWYgKGZpZWxkLmJpbikge1xuICAgIC8vIFRPRE8oa2FuaXR3KTogdGhpcyBtdXN0IGJlIGNoYW5nZWQgaW4gdmcyXG4gICAgdmFyIGZpZWxkU3RhdCA9IHN0YXRzW2ZpZWxkLm5hbWVdLFxuICAgICAgYmlucyA9IHV0aWwuZ2V0YmlucyhmaWVsZFN0YXQsIGZpZWxkLmJpbi5tYXhiaW5zIHx8IHNjaGVtYS5NQVhCSU5TX0RFRkFVTFQpLFxuICAgICAgbnVtYmlucyA9IChiaW5zLnN0b3AgLSBiaW5zLnN0YXJ0KSAvIGJpbnMuc3RlcDtcbiAgICByZXR1cm4gdXRpbC5yYW5nZShudW1iaW5zKS5tYXAoZnVuY3Rpb24oaSkge1xuICAgICAgcmV0dXJuIGJpbnMuc3RhcnQgKyBiaW5zLnN0ZXAgKiBpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKG5hbWUgPT0gb3B0LnN0YWNrKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IFNUQUNLRUQsXG4gICAgICBmaWVsZDogZW5jb2RpbmcuZmllbGRSZWYobmFtZSwge1xuICAgICAgICBkYXRhOiAhZW5jb2RpbmcuX3ZlZ2EyLFxuICAgICAgICBwcmVmbjogKG9wdC5mYWNldCA/ICdtYXhfJyA6ICcnKSArICdzdW1fJ1xuICAgICAgfSlcbiAgICB9O1xuICB9XG4gIHZhciBhZ2dyZWdhdGUgPSBlbmNvZGluZy5hZ2dyZWdhdGUobmFtZSksXG4gICAgdGltZVVuaXQgPSBmaWVsZC50aW1lVW5pdCxcbiAgICBzY2FsZVVzZVJhd0RvbWFpbiA9IGVuY29kaW5nLnNjYWxlKG5hbWUpLnVzZVJhd0RvbWFpbixcbiAgICB1c2VSYXdEb21haW4gPSBzY2FsZVVzZVJhd0RvbWFpbiAhPT0gdW5kZWZpbmVkID9cbiAgICAgIHNjYWxlVXNlUmF3RG9tYWluIDogZW5jb2RpbmcuY29uZmlnKCd1c2VSYXdEb21haW4nKSxcbiAgICBub3RDb3VudE9yU3VtID0gIWFnZ3JlZ2F0ZSB8fCAoYWdncmVnYXRlICE9PSdjb3VudCcgJiYgYWdncmVnYXRlICE9PSAnc3VtJyk7XG5cbiAgLy8gRklYTUUgcmV2aXNlIHRoaXMgcGFydFxuXG4gIGlmICggdXNlUmF3RG9tYWluICYmIG5vdENvdW50T3JTdW0gJiYgKFxuICAgICAgLy8gUSBhbHdheXMgdXNlcyBub24tb3JkaW5hbCBzY2FsZSBleGNlcHQgd2hlbiBpdCdzIGJpbm5lZCBhbmQgdGh1cyB1c2VzIG9yZGluYWwgc2NhbGUuXG4gICAgICAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFEpICYmICFmaWVsZC5iaW4pIHx8XG4gICAgICAvLyBUIHVzZXMgbm9uLW9yZGluYWwgc2NhbGUgd2hlbiB0aGVyZSdzIG5vIHVuaXQgb3Igd2hlbiB0aGUgdW5pdCBpcyBub3Qgb3JkaW5hbC5cbiAgICAgIChlbmNvZGluZy5pc1R5cGUobmFtZSwgVCkgJiYgKCF0aW1lVW5pdCB8fCAhdGltZS5pc09yZGluYWxGbih0aW1lVW5pdCkpKVxuICAgIClcbiAgKSB7XG4gICAgcmV0dXJuIHtkYXRhOiBSQVcsIGZpZWxkOiBlbmNvZGluZy5maWVsZFJlZihuYW1lLCB7bm9mbjogIXRpbWVVbml0fSl9O1xuICB9XG5cbiAgdmFyIGRhdGEgPSBlbmNvZGluZy5zb3J0KG5hbWUsIHN0YXRzKS5sZW5ndGggPiAwID9cbiAgICB2bHNvcnQuZ2V0RGF0YU5hbWUobmFtZSk6XG4gICAgZW5jb2RpbmcuZGF0YVRhYmxlKCk7XG5cbiAgcmV0dXJuIHtkYXRhOiBkYXRhLCBmaWVsZDogZW5jb2RpbmcuZmllbGRSZWYobmFtZSl9O1xufTtcblxuXG5zY2FsZS5yYW5nZSA9IGZ1bmN0aW9uIChzLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykge1xuICB2YXIgc3BlYyA9IGVuY29kaW5nLnNjYWxlKHMubmFtZSksXG4gICAgZmllbGQgPSBlbmNvZGluZy5maWVsZChzLm5hbWUpLFxuICAgIHRpbWVVbml0ID0gZmllbGQudGltZVVuaXQ7XG5cbiAgc3dpdGNoIChzLm5hbWUpIHtcbiAgICBjYXNlIFg6XG4gICAgICBzLnJhbmdlID0gbGF5b3V0LmNlbGxXaWR0aCA/IFswLCBsYXlvdXQuY2VsbFdpZHRoXSA6ICd3aWR0aCc7XG4gICAgICBpZiAocy50eXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgICAgcy5iYW5kV2lkdGggPSBlbmNvZGluZy5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGVuY29kaW5nLmlzVHlwZShzLm5hbWUsVCkgJiYgdGltZVVuaXQgPT09ICd5ZWFyJykge1xuICAgICAgICAgIHMuemVybyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMuemVybyA9IHNwZWMuemVybyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHNwZWMuemVybztcbiAgICAgICAgfVxuXG4gICAgICAgIHMucmV2ZXJzZSA9IHNwZWMucmV2ZXJzZTtcbiAgICAgIH1cbiAgICAgIHMucm91bmQgPSB0cnVlO1xuICAgICAgaWYgKHMudHlwZSA9PT0gJ3RpbWUnKSB7XG4gICAgICAgIHMubmljZSA9IHRpbWVVbml0IHx8IGVuY29kaW5nLmNvbmZpZygndGltZVNjYWxlTmljZScpO1xuICAgICAgfWVsc2Uge1xuICAgICAgICBzLm5pY2UgPSB0cnVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBZOlxuICAgICAgaWYgKHMudHlwZSA9PT0gJ29yZGluYWwnKSB7XG4gICAgICAgIHMucmFuZ2UgPSBsYXlvdXQuY2VsbEhlaWdodCA/XG4gICAgICAgICAgKGZpZWxkLmJpbiA/IFtsYXlvdXQuY2VsbEhlaWdodCwgMF0gOiBbMCwgbGF5b3V0LmNlbGxIZWlnaHRdKSA6XG4gICAgICAgICAgJ2hlaWdodCc7XG4gICAgICAgIHMuYmFuZFdpZHRoID0gZW5jb2RpbmcuYmFuZFNpemUoWSwgbGF5b3V0LnkudXNlU21hbGxCYW5kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMucmFuZ2UgPSBsYXlvdXQuY2VsbEhlaWdodCA/IFtsYXlvdXQuY2VsbEhlaWdodCwgMF0gOiAnaGVpZ2h0JztcbiAgICAgICAgaWYgKGVuY29kaW5nLmlzVHlwZShzLm5hbWUsVCkgJiYgdGltZVVuaXQgPT09ICd5ZWFyJykge1xuICAgICAgICAgIHMuemVybyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMuemVybyA9IHNwZWMuemVybyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHNwZWMuemVybztcbiAgICAgICAgfVxuXG4gICAgICAgIHMucmV2ZXJzZSA9IHNwZWMucmV2ZXJzZTtcbiAgICAgIH1cblxuICAgICAgcy5yb3VuZCA9IHRydWU7XG5cbiAgICAgIGlmIChzLnR5cGUgPT09ICd0aW1lJykge1xuICAgICAgICBzLm5pY2UgPSB0aW1lVW5pdCB8fCBlbmNvZGluZy5jb25maWcoJ3RpbWVTY2FsZU5pY2UnKTtcbiAgICAgIH1lbHNlIHtcbiAgICAgICAgcy5uaWNlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgUk9XOiAvLyBzdXBwb3J0IG9ubHkgb3JkaW5hbFxuICAgICAgcy5iYW5kV2lkdGggPSBsYXlvdXQuY2VsbEhlaWdodDtcbiAgICAgIHMucm91bmQgPSB0cnVlO1xuICAgICAgcy5uaWNlID0gdHJ1ZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQ09MOiAvLyBzdXBwb3J0IG9ubHkgb3JkaW5hbFxuICAgICAgcy5iYW5kV2lkdGggPSBsYXlvdXQuY2VsbFdpZHRoO1xuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBzLm5pY2UgPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBTSVpFOlxuICAgICAgaWYgKGVuY29kaW5nLmlzKCdiYXInKSkge1xuICAgICAgICAvLyBGSVhNRSB0aGlzIGlzIGRlZmluaXRlbHkgaW5jb3JyZWN0XG4gICAgICAgIC8vIGJ1dCBsZXQncyBmaXggaXQgbGF0ZXIgc2luY2UgYmFyIHNpemUgaXMgYSBiYWQgZW5jb2RpbmcgYW55d2F5XG4gICAgICAgIHMucmFuZ2UgPSBbMywgTWF0aC5tYXgoZW5jb2RpbmcuYmFuZFNpemUoWCksIGVuY29kaW5nLmJhbmRTaXplKFkpKV07XG4gICAgICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzKFRFWFQpKSB7XG4gICAgICAgIHMucmFuZ2UgPSBbOCwgNDBdO1xuICAgICAgfSBlbHNlIHsgLy9wb2ludFxuICAgICAgICB2YXIgYmFuZFNpemUgPSBNYXRoLm1pbihlbmNvZGluZy5iYW5kU2l6ZShYKSwgZW5jb2RpbmcuYmFuZFNpemUoWSkpIC0gMTtcbiAgICAgICAgcy5yYW5nZSA9IFsxMCwgMC44ICogYmFuZFNpemUqYmFuZFNpemVdO1xuICAgICAgfVxuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBzLnplcm8gPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgU0hBUEU6XG4gICAgICBzLnJhbmdlID0gJ3NoYXBlcyc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIENPTE9SOlxuICAgICAgcy5yYW5nZSA9IHNjYWxlLmNvbG9yKHMsIGVuY29kaW5nLCBzdGF0cyk7XG4gICAgICBpZiAocy50eXBlICE9PSAnb3JkaW5hbCcpIHMuemVybyA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZyBuYW1lOiAnKyBzLm5hbWUpO1xuICB9XG5cbiAgLy8gRklYTUUoa2FuaXR3KTogSnVsIDI5LCAyMDE1IC0gY29uc29saWRhdGUgdGhpcyB3aXRoIGFib3ZlXG4gIHN3aXRjaCAocy5uYW1lKSB7XG4gICAgY2FzZSBST1c6XG4gICAgY2FzZSBDT0w6XG4gICAgICBzLnBhZGRpbmcgPSBlbmNvZGluZy5jb25maWcoJ2NlbGxQYWRkaW5nJyk7XG4gICAgICBzLm91dGVyUGFkZGluZyA9IDA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFg6XG4gICAgY2FzZSBZOlxuICAgICAgaWYgKHMudHlwZSA9PT0gJ29yZGluYWwnKSB7IC8vJiYgIXMuYmFuZFdpZHRoXG4gICAgICAgIHMucG9pbnRzID0gdHJ1ZTtcbiAgICAgICAgcy5wYWRkaW5nID0gZW5jb2RpbmcuZmllbGQocy5uYW1lKS5iYW5kLnBhZGRpbmc7XG4gICAgICB9XG4gIH1cbn07XG5cbnNjYWxlLmNvbG9yID0gZnVuY3Rpb24ocywgZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHZhciBjb2xvclNjYWxlID0gZW5jb2Rpbmcuc2NhbGUoQ09MT1IpLFxuICAgIHJhbmdlID0gY29sb3JTY2FsZS5yYW5nZSxcbiAgICBjYXJkaW5hbGl0eSA9IGVuY29kaW5nLmNhcmRpbmFsaXR5KENPTE9SLCBzdGF0cyksXG4gICAgdHlwZSA9IGVuY29kaW5nLnR5cGUoQ09MT1IpO1xuXG4gIGlmIChyYW5nZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIG9yZGluYWxQYWxldHRlID0gY29sb3JTY2FsZS5vcmRpbmFsUGFsZXR0ZSxcbiAgICAgIHF1YW50aXRhdGl2ZVJhbmdlID0gY29sb3JTY2FsZS5xdWFudGl0YXRpdmVSYW5nZTtcblxuICAgIGlmIChzLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgaWYgKHR5cGUgPT09IE4pIHtcbiAgICAgICAgLy8gdXNlIGNhdGVnb3JpY2FsIGNvbG9yIHNjYWxlXG4gICAgICAgIGlmIChjYXJkaW5hbGl0eSA8PSAxMCkge1xuICAgICAgICAgIHJhbmdlID0gY29sb3JTY2FsZS5jMTBwYWxldHRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJhbmdlID0gY29sb3JTY2FsZS5jMjBwYWxldHRlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzY2FsZS5jb2xvci5wYWxldHRlKHJhbmdlLCBjYXJkaW5hbGl0eSwgdHlwZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAob3JkaW5hbFBhbGV0dGUpIHtcbiAgICAgICAgICByZXR1cm4gc2NhbGUuY29sb3IucGFsZXR0ZShvcmRpbmFsUGFsZXR0ZSwgY2FyZGluYWxpdHksIHR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzY2FsZS5jb2xvci5pbnRlcnBvbGF0ZShxdWFudGl0YXRpdmVSYW5nZVswXSwgcXVhbnRpdGF0aXZlUmFuZ2VbMV0sIGNhcmRpbmFsaXR5KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvL3RpbWUgb3IgcXVhbnRpdGF0aXZlXG4gICAgICByZXR1cm4gW3F1YW50aXRhdGl2ZVJhbmdlWzBdLCBxdWFudGl0YXRpdmVSYW5nZVsxXV07XG4gICAgfVxuICB9XG59O1xuXG5zY2FsZS5jb2xvci5wYWxldHRlID0gZnVuY3Rpb24ocmFuZ2UsIGNhcmRpbmFsaXR5LCB0eXBlKSB7XG4gIC8vIEZJWE1FKGthbml0dyk6IEp1bCAyOSwgMjAxNSAtIGNoZWNrIHJhbmdlIGlzIHN0cmluZ1xuICBzd2l0Y2ggKHJhbmdlKSB7XG4gICAgY2FzZSAnY2F0ZWdvcnkxMGsnOlxuICAgICAgLy8gdGFibGVhdSdzIGNhdGVnb3J5IDEwLCBvcmRlcmVkIGJ5IHBlcmNlcHR1YWwga2VybmVsIHN0dWR5IHJlc3VsdHNcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS91d2RhdGEvcGVyY2VwdHVhbC1rZXJuZWxzXG4gICAgICByZXR1cm4gWycjMmNhMDJjJywgJyNlMzc3YzInLCAnIzdmN2Y3ZicsICcjMTdiZWNmJywgJyM4YzU2NGInLCAnI2Q2MjcyOCcsICcjYmNiZDIyJywgJyM5NDY3YmQnLCAnI2ZmN2YwZScsICcjMWY3N2I0J107XG5cbiAgICAvLyBkMy90YWJsZWF1IGNhdGVnb3J5MTAvMjAvMjBiLzIwY1xuICAgIGNhc2UgJ2NhdGVnb3J5MTAnOlxuICAgICAgcmV0dXJuIFsnIzFmNzdiNCcsICcjZmY3ZjBlJywgJyMyY2EwMmMnLCAnI2Q2MjcyOCcsICcjOTQ2N2JkJywgJyM4YzU2NGInLCAnI2UzNzdjMicsICcjN2Y3ZjdmJywgJyNiY2JkMjInLCAnIzE3YmVjZiddO1xuXG4gICAgY2FzZSAnY2F0ZWdvcnkyMCc6XG4gICAgICByZXR1cm4gWycjMWY3N2I0JywgJyNhZWM3ZTgnLCAnI2ZmN2YwZScsICcjZmZiYjc4JywgJyMyY2EwMmMnLCAnIzk4ZGY4YScsICcjZDYyNzI4JywgJyNmZjk4OTYnLCAnIzk0NjdiZCcsICcjYzViMGQ1JywgJyM4YzU2NGInLCAnI2M0OWM5NCcsICcjZTM3N2MyJywgJyNmN2I2ZDInLCAnIzdmN2Y3ZicsICcjYzdjN2M3JywgJyNiY2JkMjInLCAnI2RiZGI4ZCcsICcjMTdiZWNmJywgJyM5ZWRhZTUnXTtcblxuICAgIGNhc2UgJ2NhdGVnb3J5MjBiJzpcbiAgICAgIHJldHVybiBbJyMzOTNiNzknLCAnIzUyNTRhMycsICcjNmI2ZWNmJywgJyM5YzllZGUnLCAnIzYzNzkzOScsICcjOGNhMjUyJywgJyNiNWNmNmInLCAnI2NlZGI5YycsICcjOGM2ZDMxJywgJyNiZDllMzknLCAnI2U3YmE1MicsICcjZTdjYjk0JywgJyM4NDNjMzknLCAnI2FkNDk0YScsICcjZDY2MTZiJywgJyNlNzk2OWMnLCAnIzdiNDE3MycsICcjYTU1MTk0JywgJyNjZTZkYmQnLCAnI2RlOWVkNiddO1xuXG4gICAgY2FzZSAnY2F0ZWdvcnkyMGMnOlxuICAgICAgcmV0dXJuIFsnIzMxODJiZCcsICcjNmJhZWQ2JywgJyM5ZWNhZTEnLCAnI2M2ZGJlZicsICcjZTY1NTBkJywgJyNmZDhkM2MnLCAnI2ZkYWU2YicsICcjZmRkMGEyJywgJyMzMWEzNTQnLCAnIzc0YzQ3NicsICcjYTFkOTliJywgJyNjN2U5YzAnLCAnIzc1NmJiMScsICcjOWU5YWM4JywgJyNiY2JkZGMnLCAnI2RhZGFlYicsICcjNjM2MzYzJywgJyM5Njk2OTYnLCAnI2JkYmRiZCcsICcjZDlkOWQ5J107XG4gIH1cblxuICAvLyBUT0RPIGFkZCBvdXIgb3duIHNldCBvZiBjdXN0b20gb3JkaW5hbCBjb2xvciBwYWxldHRlXG5cbiAgaWYgKHJhbmdlIGluIGNvbG9yYnJld2VyKSB7XG4gICAgdmFyIHBhbGV0dGUgPSBjb2xvcmJyZXdlcltyYW5nZV07XG5cbiAgICAvLyBpZiBjYXJkaW5hbGl0eSBwcmUtZGVmaW5lZCwgdXNlIGl0LlxuICAgIGlmIChjYXJkaW5hbGl0eSBpbiBwYWxldHRlKSByZXR1cm4gcGFsZXR0ZVtjYXJkaW5hbGl0eV07XG5cbiAgICAvLyBpZiBub3QsIHVzZSB0aGUgaGlnaGVzdCBjYXJkaW5hbGl0eSBvbmUgZm9yIG5vbWluYWxcbiAgICBpZiAodHlwZSA9PT0gTikge1xuICAgICAgcmV0dXJuIHBhbGV0dGVbTWF0aC5tYXguYXBwbHkobnVsbCwgdXRpbC5rZXlzKHBhbGV0dGUpKV07XG4gICAgfVxuXG4gICAgLy8gb3RoZXJ3aXNlLCBpbnRlcnBvbGF0ZVxuICAgIHZhciBwcyA9IGNhcmRpbmFsaXR5IDwgMyA/IDMgOiBNYXRoLm1heC5hcHBseShudWxsLCB1dGlsLmtleXMocGFsZXR0ZSkpLFxuICAgICAgZnJvbSA9IDAgLCB0byA9IHBzIC0gMTtcbiAgICAvLyBGSVhNRSBhZGQgY29uZmlnIGZvciBmcm9tIC8gdG9cblxuICAgIHJldHVybiBzY2FsZS5jb2xvci5pbnRlcnBvbGF0ZShwYWxldHRlW3BzXVtmcm9tXSwgcGFsZXR0ZVtwc11bdG9dLCBjYXJkaW5hbGl0eSk7XG4gIH1cblxuICByZXR1cm4gcmFuZ2U7XG59O1xuXG5zY2FsZS5jb2xvci5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kLCBjYXJkaW5hbGl0eSkge1xuXG4gIHZhciBpbnRlcnBvbGF0b3IgPSBpbnRlcnBvbGF0ZShzdGFydCwgZW5kKTtcbiAgcmV0dXJuIHV0aWwucmFuZ2UoY2FyZGluYWxpdHkpLm1hcChmdW5jdGlvbihpKSB7IHJldHVybiBpbnRlcnBvbGF0b3IoaSoxLjAvKGNhcmRpbmFsaXR5LTEpKTsgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciB2bGZpZWxkID0gcmVxdWlyZSgnLi4vZmllbGQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzb3J0O1xuXG4vLyBhZGRzIG5ldyB0cmFuc2Zvcm1zIHRoYXQgcHJvZHVjZSBzb3J0ZWQgZmllbGRzXG5mdW5jdGlvbiBzb3J0KGRhdGEsIGVuY29kaW5nLCBzdGF0cywgb3B0KSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcblxuICB2YXIgZGF0YXNldE1hcHBpbmcgPSB7fTtcblxuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgdmFyIHNvcnRCeSA9IGVuY29kaW5nLnNvcnQoZW5jVHlwZSwgc3RhdHMpO1xuICAgIGlmIChzb3J0QnkubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGZpZWxkcyA9IHNvcnRCeS5tYXAoZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG9wOiBkLmFnZ3JlZ2F0ZSxcbiAgICAgICAgICBmaWVsZDogdmxmaWVsZC5maWVsZFJlZihkLCB7bm9mbjogdHJ1ZSwgZGF0YTogIWVuY29kaW5nLl92ZWdhMn0pXG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgICAgdmFyIGJ5Q2xhdXNlID0gc29ydEJ5Lm1hcChmdW5jdGlvbihkKSB7XG4gICAgICAgIHZhciByZXZlcnNlID0gKGQucmV2ZXJzZSA/ICctJyA6ICcnKTtcbiAgICAgICAgcmV0dXJuIHJldmVyc2UgKyB2bGZpZWxkLmZpZWxkUmVmKGQsIHtkYXRhOiAhZW5jb2RpbmcuX3ZlZ2EyfSk7XG4gICAgICB9KTtcblxuICAgICAgdmFyIGRhdGFOYW1lID0gc29ydC5nZXREYXRhTmFtZShlbmNUeXBlKTtcblxuICAgICAgdmFyIHRyYW5zZm9ybXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgICAgICBncm91cGJ5OiBbIGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUpIF0sXG4gICAgICAgICAgZmllbGRzOiBmaWVsZHNcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdzb3J0JyxcbiAgICAgICAgICBieTogYnlDbGF1c2VcbiAgICAgICAgfVxuICAgICAgXTtcblxuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgbmFtZTogZGF0YU5hbWUsXG4gICAgICAgIHNvdXJjZTogUkFXLFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybXNcbiAgICAgIH0pO1xuXG4gICAgICBkYXRhc2V0TWFwcGluZ1tlbmNUeXBlXSA9IGRhdGFOYW1lO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbnNvcnQuZ2V0RGF0YU5hbWUgPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gIHJldHVybiAnc29ydGVkLScgKyBlbmNUeXBlO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciAgbWFya3MgPSByZXF1aXJlKCcuL21hcmtzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tpbmc7XG5cbmZ1bmN0aW9uIHN0YWNraW5nKGRhdGEsIGVuY29kaW5nLCBtZGVmKSB7XG4gIGlmICghbWFya3NbZW5jb2RpbmcubWFya3R5cGUoKV0uc3RhY2spIHJldHVybiBmYWxzZTtcblxuICAvLyBUT0RPOiBhZGQgfHwgZW5jb2RpbmcuaGFzKExPRCkgaGVyZSBvbmNlIExPRCBpcyBpbXBsZW1lbnRlZFxuICBpZiAoIWVuY29kaW5nLmhhcyhDT0xPUikpIHJldHVybiBmYWxzZTtcblxuICB2YXIgZGltPW51bGwsIHZhbD1udWxsLCBpZHggPW51bGwsXG4gICAgaXNYTWVhc3VyZSA9IGVuY29kaW5nLmlzTWVhc3VyZShYKSxcbiAgICBpc1lNZWFzdXJlID0gZW5jb2RpbmcuaXNNZWFzdXJlKFkpLFxuICAgIGZhY2V0cyA9IGVuY29kaW5nLmZhY2V0cygpO1xuXG4gIGlmIChpc1hNZWFzdXJlICYmICFpc1lNZWFzdXJlKSB7XG4gICAgZGltID0gWTtcbiAgICB2YWwgPSBYO1xuICAgIGlkeCA9IDA7XG4gIH0gZWxzZSBpZiAoaXNZTWVhc3VyZSAmJiAhaXNYTWVhc3VyZSkge1xuICAgIGRpbSA9IFg7XG4gICAgdmFsID0gWTtcbiAgICBpZHggPSAxO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsOyAvLyBubyBzdGFjayBlbmNvZGluZ1xuICB9XG5cbiAgLy8gYWRkIHRyYW5zZm9ybSB0byBjb21wdXRlIHN1bXMgZm9yIHNjYWxlXG4gIHZhciBzdGFja2VkID0ge1xuICAgIG5hbWU6IFNUQUNLRUQsXG4gICAgc291cmNlOiBlbmNvZGluZy5kYXRhVGFibGUoKSxcbiAgICB0cmFuc2Zvcm06IFt7XG4gICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgIGdyb3VwYnk6IFtlbmNvZGluZy5maWVsZFJlZihkaW0pXS5jb25jYXQoZmFjZXRzKSwgLy8gZGltIGFuZCBvdGhlciBmYWNldHNcbiAgICAgIGZpZWxkczogW3tvcDogJ3N1bScsIGZpZWxkOiBlbmNvZGluZy5maWVsZFJlZih2YWwpfV0gLy8gVE9ETyBjaGVjayBpZiBmaWVsZCB3aXRoIGFnZ3JlZ2F0ZSBpcyBjb3JyZWN0P1xuICAgIH1dXG4gIH07XG5cbiAgaWYgKGZhY2V0cyAmJiBmYWNldHMubGVuZ3RoID4gMCkge1xuICAgIHN0YWNrZWQudHJhbnNmb3JtLnB1c2goeyAvL2NhbGN1bGF0ZSBtYXggZm9yIGVhY2ggZmFjZXRcbiAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgZ3JvdXBieTogZmFjZXRzLFxuICAgICAgZmllbGRzOiBbe1xuICAgICAgICBvcDogJ21heCcsXG4gICAgICAgIGZpZWxkOiBlbmNvZGluZy5maWVsZE5hbWUodmFsLCB7Zm46ICdzdW0nfSlcbiAgICAgIH1dXG4gICAgfSk7XG4gIH1cblxuICBkYXRhLnB1c2goc3RhY2tlZCk7XG5cbiAgLy8gYWRkIHN0YWNrIHRyYW5zZm9ybSB0byBtYXJrXG4gIG1kZWYuZnJvbS50cmFuc2Zvcm0gPSBbe1xuICAgIHR5cGU6ICdzdGFjaycsXG4gICAgcG9pbnQ6IGVuY29kaW5nLmZpZWxkUmVmKGRpbSksXG4gICAgaGVpZ2h0OiBlbmNvZGluZy5maWVsZFJlZih2YWwpLFxuICAgIG91dHB1dDoge3kxOiB2YWwsIHkwOiB2YWwgKyAnMid9XG4gIH1dO1xuXG4gIC8vIFRPRE86IFRoaXMgaXMgc3VwZXIgaGFjay1pc2ggLS0gY29uc29saWRhdGUgaW50byBtb2R1bGFyIG1hcmsgcHJvcGVydGllcz9cbiAgbWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZVt2YWxdID0gbWRlZi5wcm9wZXJ0aWVzLmVudGVyW3ZhbF0gPSB7c2NhbGU6IHZhbCwgZmllbGQ6IHZhbH07XG4gIG1kZWYucHJvcGVydGllcy51cGRhdGVbdmFsICsgJzInXSA9IG1kZWYucHJvcGVydGllcy5lbnRlclt2YWwgKyAnMiddID0ge3NjYWxlOiB2YWwsIGZpZWxkOiB2YWwgKyAnMid9O1xuXG4gIHJldHVybiB2YWw7IC8vcmV0dXJuIHN0YWNrIGVuY29kaW5nXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHZsZmllbGQgPSByZXF1aXJlKCcuLi9maWVsZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVuY29kaW5nLCBzdGF0cykge1xuICByZXR1cm4ge1xuICAgIG9wYWNpdHk6IGVzdGltYXRlT3BhY2l0eShlbmNvZGluZywgc3RhdHMpLFxuICB9O1xufTtcblxuZnVuY3Rpb24gZXN0aW1hdGVPcGFjaXR5KGVuY29kaW5nLHN0YXRzKSB7XG4gIGlmICghc3RhdHMpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIHZhciBudW1Qb2ludHMgPSAwO1xuXG4gIGlmIChlbmNvZGluZy5pc0FnZ3JlZ2F0ZSgpKSB7IC8vIGFnZ3JlZ2F0ZSBwbG90XG4gICAgbnVtUG9pbnRzID0gMTtcblxuICAgIC8vICBnZXQgbnVtYmVyIG9mIHBvaW50cyBpbiBlYWNoIFwiY2VsbFwiXG4gICAgLy8gIGJ5IGNhbGN1bGF0aW5nIHByb2R1Y3Qgb2YgY2FyZGluYWxpdHlcbiAgICAvLyAgZm9yIGVhY2ggbm9uIGZhY2V0aW5nIGFuZCBub24tb3JkaW5hbCBYIC8gWSBmaWVsZHNcbiAgICAvLyAgbm90ZSB0aGF0IG9yZGluYWwgeCx5IGFyZSBub3QgaW5jbHVkZSBzaW5jZSB3ZSBjYW5cbiAgICAvLyAgY29uc2lkZXIgdGhhdCBvcmRpbmFsIHggYXJlIHN1YmRpdmlkaW5nIHRoZSBjZWxsIGludG8gc3ViY2VsbHMgYW55d2F5XG4gICAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuXG4gICAgICBpZiAoZW5jVHlwZSAhPT0gUk9XICYmIGVuY1R5cGUgIT09IENPTCAmJlxuICAgICAgICAgICEoKGVuY1R5cGUgPT09IFggfHwgZW5jVHlwZSA9PT0gWSkgJiZcbiAgICAgICAgICB2bGZpZWxkLmlzT3JkaW5hbFNjYWxlKGZpZWxkKSlcbiAgICAgICAgKSB7XG4gICAgICAgIG51bVBvaW50cyAqPSBlbmNvZGluZy5jYXJkaW5hbGl0eShlbmNUeXBlLCBzdGF0cyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfSBlbHNlIHsgLy8gcmF3IHBsb3RcblxuICAgIC8vIFRPRE86IGVycm9yIGhhbmRsaW5nXG4gICAgaWYgKCFzdGF0c1snKiddKVxuICAgICAgcmV0dXJuIDE7XG5cbiAgICBudW1Qb2ludHMgPSBzdGF0c1snKiddLm1heDsgIC8vIGNvdW50XG5cbiAgICAvLyBzbWFsbCBtdWx0aXBsZXMgZGl2aWRlIG51bWJlciBvZiBwb2ludHNcbiAgICB2YXIgbnVtTXVsdGlwbGVzID0gMTtcbiAgICBpZiAoZW5jb2RpbmcuaGFzKFJPVykpIHtcbiAgICAgIG51bU11bHRpcGxlcyAqPSBlbmNvZGluZy5jYXJkaW5hbGl0eShST1csIHN0YXRzKTtcbiAgICB9XG4gICAgaWYgKGVuY29kaW5nLmhhcyhDT0wpKSB7XG4gICAgICBudW1NdWx0aXBsZXMgKj0gZW5jb2RpbmcuY2FyZGluYWxpdHkoQ09MLCBzdGF0cyk7XG4gICAgfVxuICAgIG51bVBvaW50cyAvPSBudW1NdWx0aXBsZXM7XG4gIH1cblxuICB2YXIgb3BhY2l0eSA9IDA7XG4gIGlmIChudW1Qb2ludHMgPD0gMjUpIHtcbiAgICBvcGFjaXR5ID0gMTtcbiAgfSBlbHNlIGlmIChudW1Qb2ludHMgPCAyMDApIHtcbiAgICBvcGFjaXR5ID0gMC44O1xuICB9IGVsc2UgaWYgKG51bVBvaW50cyA8IDEwMDAgfHwgZW5jb2RpbmcuaXMoJ3RpY2snKSkge1xuICAgIG9wYWNpdHkgPSAwLjc7XG4gIH0gZWxzZSB7XG4gICAgb3BhY2l0eSA9IDAuMztcbiAgfVxuXG4gIHJldHVybiBvcGFjaXR5O1xufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIGdyb3VwZGVmID0gcmVxdWlyZSgnLi9ncm91cCcpLmRlZjtcblxubW9kdWxlLmV4cG9ydHMgPSBzdWJmYWNldGluZztcblxuZnVuY3Rpb24gc3ViZmFjZXRpbmcoZ3JvdXAsIG1kZWYsIGRldGFpbHMsIHN0YWNrLCBlbmNvZGluZykge1xuICB2YXIgbSA9IGdyb3VwLm1hcmtzLFxuICAgIGcgPSBncm91cGRlZignc3ViZmFjZXQnLCB7bWFya3M6IG19KTtcblxuICBncm91cC5tYXJrcyA9IFtnXTtcbiAgZy5mcm9tID0gbWRlZi5mcm9tO1xuICBkZWxldGUgbWRlZi5mcm9tO1xuXG4gIC8vVE9ETyB0ZXN0IExPRCAtLSB3ZSBzaG91bGQgc3VwcG9ydCBzdGFjayAvIGxpbmUgd2l0aG91dCBjb2xvciAoTE9EKSBmaWVsZFxuICB2YXIgdHJhbnMgPSAoZy5mcm9tLnRyYW5zZm9ybSB8fCAoZy5mcm9tLnRyYW5zZm9ybSA9IFtdKSk7XG4gIHRyYW5zLnVuc2hpZnQoe3R5cGU6ICdmYWNldCcsIGtleXM6IGRldGFpbHN9KTtcblxuICBpZiAoc3RhY2sgJiYgZW5jb2RpbmcuaGFzKENPTE9SKSkge1xuICAgIHRyYW5zLnVuc2hpZnQoe3R5cGU6ICdzb3J0JywgYnk6IGVuY29kaW5nLmZpZWxkUmVmKENPTE9SKX0pO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICBkM190aW1lX2Zvcm1hdCA9IHJlcXVpcmUoJ2QzLXRpbWUtZm9ybWF0Jyk7XG5cbnZhciB0aW1lID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxudmFyIExPTkdfREFURSA9IG5ldyBEYXRlKDIwMTQsIDgsIDE3KTtcblxudGltZS5jYXJkaW5hbGl0eSA9IGZ1bmN0aW9uKGZpZWxkLCBzdGF0cywgZmlsdGVyTnVsbCwgdHlwZSkge1xuICB2YXIgdGltZVVuaXQgPSBmaWVsZC50aW1lVW5pdDtcbiAgc3dpdGNoICh0aW1lVW5pdCkge1xuICAgIGNhc2UgJ3NlY29uZHMnOiByZXR1cm4gNjA7XG4gICAgY2FzZSAnbWludXRlcyc6IHJldHVybiA2MDtcbiAgICBjYXNlICdob3Vycyc6IHJldHVybiAyNDtcbiAgICBjYXNlICdkYXknOiByZXR1cm4gNztcbiAgICBjYXNlICdkYXRlJzogcmV0dXJuIDMxO1xuICAgIGNhc2UgJ21vbnRoJzogcmV0dXJuIDEyO1xuICAgIGNhc2UgJ3llYXInOlxuICAgICAgdmFyIHN0YXQgPSBzdGF0c1tmaWVsZC5uYW1lXSxcbiAgICAgICAgeWVhcnN0YXQgPSBzdGF0c1sneWVhcl8nK2ZpZWxkLm5hbWVdO1xuXG4gICAgICBpZiAoIXllYXJzdGF0KSB7IHJldHVybiBudWxsOyB9XG5cbiAgICAgIHJldHVybiB5ZWFyc3RhdC5kaXN0aW5jdCAtXG4gICAgICAgIChzdGF0Lm51bGxzID4gMCAmJiBmaWx0ZXJOdWxsW3R5cGVdID8gMSA6IDApO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG50aW1lLmZvcm11bGEgPSBmdW5jdGlvbih0aW1lVW5pdCwgZmllbGRSZWYpIHtcbiAgLy8gVE9ETyhrYW5pdHcpOiBhZGQgZm9ybXVsYSB0byBvdGhlciB0aW1lIGZvcm1hdFxuICB2YXIgZm4gPSAndXRjJyArIHRpbWVVbml0O1xuICByZXR1cm4gZm4gKyAnKCcgKyBmaWVsZFJlZiArICcpJztcbn07XG5cbnRpbWUubWF4TGVuZ3RoID0gZnVuY3Rpb24odGltZVVuaXQsIGVuY29kaW5nKSB7XG4gIHN3aXRjaCAodGltZVVuaXQpIHtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnZGF0ZSc6XG4gICAgICByZXR1cm4gMjtcbiAgICBjYXNlICdtb250aCc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICAgIHZhciByYW5nZSA9IHRpbWUucmFuZ2UodGltZVVuaXQsIGVuY29kaW5nKTtcbiAgICAgIGlmIChyYW5nZSkge1xuICAgICAgICAvLyByZXR1cm4gdGhlIGxvbmdlc3QgbmFtZSBpbiB0aGUgcmFuZ2VcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIHJhbmdlLm1hcChmdW5jdGlvbihyKSB7cmV0dXJuIHIubGVuZ3RoO30pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAyO1xuICAgIGNhc2UgJ3llYXInOlxuICAgICAgcmV0dXJuIDQ7IC8vJzE5OTgnXG4gIH1cbiAgLy8gbm8gdGltZSB1bml0XG4gIHZhciB0aW1lRm9ybWF0ID0gZW5jb2RpbmcuY29uZmlnKCd0aW1lRm9ybWF0Jyk7XG4gIHJldHVybiBkM190aW1lX2Zvcm1hdC51dGNGb3JtYXQodGltZUZvcm1hdCkoTE9OR19EQVRFKS5sZW5ndGg7XG59O1xuXG50aW1lLnJhbmdlID0gZnVuY3Rpb24odGltZVVuaXQsIGVuY29kaW5nKSB7XG4gIHZhciBsYWJlbExlbmd0aCA9IGVuY29kaW5nLmNvbmZpZygndGltZVNjYWxlTGFiZWxMZW5ndGgnKSxcbiAgICBzY2FsZUxhYmVsO1xuICBzd2l0Y2ggKHRpbWVVbml0KSB7XG4gICAgY2FzZSAnZGF5JzpcbiAgICAgIHNjYWxlTGFiZWwgPSBlbmNvZGluZy5jb25maWcoJ2RheVNjYWxlTGFiZWwnKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgIHNjYWxlTGFiZWwgPSBlbmNvZGluZy5jb25maWcoJ21vbnRoU2NhbGVMYWJlbCcpO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgaWYgKHNjYWxlTGFiZWwpIHtcbiAgICByZXR1cm4gbGFiZWxMZW5ndGggPyBzY2FsZUxhYmVsLm1hcChcbiAgICAgICAgZnVuY3Rpb24ocykgeyByZXR1cm4gcy5zdWJzdHIoMCwgbGFiZWxMZW5ndGgpO31cbiAgICAgICkgOiBzY2FsZUxhYmVsO1xuICB9XG4gIHJldHVybjtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGVuY29kaW5nXG4gKiBAcmV0dXJuIHtBcnJheX0gIHNjYWxlcyBmb3IgdGltZSB1bml0IG5hbWVzXG4gKi9cbnRpbWUuc2NhbGVzID0gZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgdmFyIHNjYWxlcyA9IGVuY29kaW5nLnJlZHVjZShmdW5jdGlvbihzY2FsZXMsIGZpZWxkKSB7XG4gICAgdmFyIHRpbWVVbml0ID0gZmllbGQudGltZVVuaXQ7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT09IFQgJiYgdGltZVVuaXQgJiYgIXNjYWxlc1t0aW1lVW5pdF0pIHtcbiAgICAgIHZhciBzY2FsZSA9IHRpbWUuc2NhbGUuZGVmKGZpZWxkLnRpbWVVbml0LCBlbmNvZGluZyk7XG4gICAgICBpZiAoc2NhbGUpIHNjYWxlc1t0aW1lVW5pdF0gPSBzY2FsZTtcbiAgICB9XG4gICAgcmV0dXJuIHNjYWxlcztcbiAgfSwge30pO1xuXG4gIHJldHVybiB1dGlsLnZhbHMoc2NhbGVzKTtcbn07XG5cblxudGltZS5zY2FsZSA9IHt9O1xuXG4vKiogYXBwZW5kIGN1c3RvbSB0aW1lIHNjYWxlcyBmb3IgYXhpcyBsYWJlbCAqL1xudGltZS5zY2FsZS5kZWYgPSBmdW5jdGlvbih0aW1lVW5pdCwgZW5jb2RpbmcpIHtcbiAgdmFyIHJhbmdlID0gdGltZS5yYW5nZSh0aW1lVW5pdCwgZW5jb2RpbmcpO1xuXG4gIGlmIChyYW5nZSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAndGltZS0nK3RpbWVVbml0LFxuICAgICAgdHlwZTogJ29yZGluYWwnLFxuICAgICAgZG9tYWluOiB0aW1lLnNjYWxlLmRvbWFpbih0aW1lVW5pdCksXG4gICAgICByYW5nZTogcmFuZ2VcbiAgICB9O1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxudGltZS5pc09yZGluYWxGbiA9IGZ1bmN0aW9uKHRpbWVVbml0KSB7XG4gIHN3aXRjaCAodGltZVVuaXQpIHtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkYXRlJzpcbiAgICBjYXNlICdtb250aCc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG50aW1lLnNjYWxlLnR5cGUgPSBmdW5jdGlvbih0aW1lVW5pdCwgbmFtZSkge1xuICBpZiAobmFtZSA9PT0gQ09MT1IpIHtcbiAgICByZXR1cm4gJ2xpbmVhcic7IC8vIHRpbWUgaGFzIG9yZGVyLCBzbyB1c2UgaW50ZXJwb2xhdGVkIG9yZGluYWwgY29sb3Igc2NhbGUuXG4gIH1cblxuICByZXR1cm4gdGltZS5pc09yZGluYWxGbih0aW1lVW5pdCkgfHwgbmFtZSA9PT0gQ09MIHx8IG5hbWUgPT09IFJPVyA/ICdvcmRpbmFsJyA6ICdsaW5lYXInO1xufTtcblxudGltZS5zY2FsZS5kb21haW4gPSBmdW5jdGlvbih0aW1lVW5pdCwgbmFtZSkge1xuICB2YXIgaXNDb2xvciA9IG5hbWUgPT09IENPTE9SO1xuICBzd2l0Y2ggKHRpbWVVbml0KSB7XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnbWludXRlcyc6IHJldHVybiBpc0NvbG9yID8gWzAsNTldIDogdXRpbC5yYW5nZSgwLCA2MCk7XG4gICAgY2FzZSAnaG91cnMnOiByZXR1cm4gaXNDb2xvciA/IFswLDIzXSA6IHV0aWwucmFuZ2UoMCwgMjQpO1xuICAgIGNhc2UgJ2RheSc6IHJldHVybiBpc0NvbG9yID8gWzAsNl0gOiB1dGlsLnJhbmdlKDAsIDcpO1xuICAgIGNhc2UgJ2RhdGUnOiByZXR1cm4gaXNDb2xvciA/IFsxLDMxXSA6IHV0aWwucmFuZ2UoMSwgMzIpO1xuICAgIGNhc2UgJ21vbnRoJzogcmV0dXJuIGlzQ29sb3IgPyBbMCwxMV0gOiB1dGlsLnJhbmdlKDAsIDEyKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbi8qKiB3aGV0aGVyIGEgcGFydGljdWxhciB0aW1lIGZ1bmN0aW9uIGhhcyBjdXN0b20gc2NhbGUgZm9yIGxhYmVscyBpbXBsZW1lbnRlZCBpbiB0aW1lLnNjYWxlICovXG50aW1lLmhhc1NjYWxlID0gZnVuY3Rpb24odGltZVVuaXQpIHtcbiAgc3dpdGNoICh0aW1lVW5pdCkge1xuICAgIGNhc2UgJ2RheSc6XG4gICAgY2FzZSAnbW9udGgnOlxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9nbG9iYWxzJyk7XG5cbnZhciBjb25zdHMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5jb25zdHMuZW5jb2RpbmdUeXBlcyA9IFtYLCBZLCBST1csIENPTCwgU0laRSwgU0hBUEUsIENPTE9SLCBURVhULCBERVRBSUxdO1xuXG5jb25zdHMuc2hvcnRoYW5kID0ge1xuICBkZWxpbTogICd8JyxcbiAgYXNzaWduOiAnPScsXG4gIHR5cGU6ICAgJywnLFxuICBmdW5jOiAgICdfJ1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9nbG9iYWxzJyk7XG5cbnZhciBzdGF0cyA9IHJlcXVpcmUoJ2RhdGFsaWIvc3JjL3N0YXRzJyk7XG5cbnZhciB2bGRhdGEgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vKiogTWFwcGluZyBmcm9tIGRhdGFsaWIncyBpbmZlcnJlZCB0eXBlIHRvIFZlZ2EtbGl0ZSdzIHR5cGUgKi9cbnZsZGF0YS50eXBlcyA9IHtcbiAgJ2Jvb2xlYW4nOiBOLFxuICAnbnVtYmVyJzogUSxcbiAgJ2ludGVnZXInOiBRLFxuICAnZGF0ZSc6IFQsXG4gICdzdHJpbmcnOiBOXG59O1xuXG52bGRhdGEuc3RhdHMgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHZhciBzdW1tYXJ5ID0gc3RhdHMuc3VtbWFyeShkYXRhKTtcblxuICByZXR1cm4gc3VtbWFyeS5yZWR1Y2UoZnVuY3Rpb24ocywgcHJvZmlsZSkge1xuICAgIHNbcHJvZmlsZS5maWVsZF0gPSBwcm9maWxlO1xuICAgIHJldHVybiBzO1xuICB9LCB7XG4gICAgJyonOiB7XG4gICAgICBtYXg6IGRhdGEubGVuZ3RoLFxuICAgICAgbWluOiAwXG4gICAgfVxuICB9KTtcbn07IiwiLy8gdXRpbGl0eSBmb3IgZW5jXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGNvbnN0cyA9IHJlcXVpcmUoJy4vY29uc3RzJyksXG4gIGMgPSBjb25zdHMuc2hvcnRoYW5kLFxuICB2bGZpZWxkID0gcmVxdWlyZSgnLi9maWVsZCcpLFxuICB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gIHNjaGVtYSA9IHJlcXVpcmUoJy4vc2NoZW1hL3NjaGVtYScpLFxuICBlbmNUeXBlcyA9IHNjaGVtYS5lbmNUeXBlcztcblxudmFyIHZsZW5jID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxudmxlbmMuY291bnRSZXRpbmFsID0gZnVuY3Rpb24oZW5jKSB7XG4gIHZhciBjb3VudCA9IDA7XG4gIGlmIChlbmMuY29sb3IpIGNvdW50Kys7XG4gIGlmIChlbmMuc2l6ZSkgY291bnQrKztcbiAgaWYgKGVuYy5zaGFwZSkgY291bnQrKztcbiAgcmV0dXJuIGNvdW50O1xufTtcblxudmxlbmMuaGFzID0gZnVuY3Rpb24oZW5jLCBlbmNUeXBlKSB7XG4gIHZhciBmaWVsZERlZiA9IGVuYyAmJiBlbmNbZW5jVHlwZV07XG4gIHJldHVybiBmaWVsZERlZiAmJiBmaWVsZERlZi5uYW1lO1xufTtcblxudmxlbmMuaXNBZ2dyZWdhdGUgPSBmdW5jdGlvbihlbmMpIHtcbiAgZm9yICh2YXIgayBpbiBlbmMpIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykgJiYgZW5jW2tdLmFnZ3JlZ2F0ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnZsZW5jLmZvckVhY2ggPSBmdW5jdGlvbihlbmMsIGYpIHtcbiAgdmFyIGkgPSAwO1xuICBlbmNUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykpIHtcbiAgICAgIGYoZW5jW2tdLCBrLCBpKyspO1xuICAgIH1cbiAgfSk7XG59O1xuXG52bGVuYy5tYXAgPSBmdW5jdGlvbihlbmMsIGYpIHtcbiAgdmFyIGFyciA9IFtdO1xuICBlbmNUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykpIHtcbiAgICAgIGFyci5wdXNoKGYoZW5jW2tdLCBrLCBlbmMpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXJyO1xufTtcblxudmxlbmMucmVkdWNlID0gZnVuY3Rpb24oZW5jLCBmLCBpbml0KSB7XG4gIHZhciByID0gaW5pdDtcbiAgZW5jVHlwZXMuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgaWYgKHZsZW5jLmhhcyhlbmMsIGspKSB7XG4gICAgICByID0gZihyLCBlbmNba10sIGssICBlbmMpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByO1xufTtcblxuLypcbiAqIHJldHVybiBrZXktdmFsdWUgcGFpcnMgb2YgZmllbGQgbmFtZSBhbmQgbGlzdCBvZiBmaWVsZHMgb2YgdGhhdCBmaWVsZCBuYW1lXG4gKi9cbnZsZW5jLmZpZWxkcyA9IGZ1bmN0aW9uKGVuYykge1xuICByZXR1cm4gdmxlbmMucmVkdWNlKGVuYywgZnVuY3Rpb24gKG0sIGZpZWxkKSB7XG4gICAgdmFyIGZpZWxkTGlzdCA9IG1bZmllbGQubmFtZV0gPSBtW2ZpZWxkLm5hbWVdIHx8IFtdLFxuICAgICAgY29udGFpbnNUeXBlID0gZmllbGRMaXN0LmNvbnRhaW5zVHlwZSA9IGZpZWxkTGlzdC5jb250YWluc1R5cGUgfHwge307XG5cbiAgICBpZiAoZmllbGRMaXN0LmluZGV4T2YoZmllbGQpID09PSAtMSkge1xuICAgICAgZmllbGRMaXN0LnB1c2goZmllbGQpO1xuICAgICAgLy8gYXVnbWVudCB0aGUgYXJyYXkgd2l0aCBjb250YWluc1R5cGUuUSAvIE8gLyBOIC8gVFxuICAgICAgY29udGFpbnNUeXBlW2ZpZWxkLnR5cGVdID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG07XG4gIH0sIHt9KTtcbn07XG5cbnZsZW5jLnNob3J0aGFuZCA9IGZ1bmN0aW9uKGVuYykge1xuICByZXR1cm4gdmxlbmMubWFwKGVuYywgZnVuY3Rpb24oZmllbGQsIGV0KSB7XG4gICAgcmV0dXJuIGV0ICsgYy5hc3NpZ24gKyB2bGZpZWxkLnNob3J0aGFuZChmaWVsZCk7XG4gIH0pLmpvaW4oYy5kZWxpbSk7XG59O1xuXG52bGVuYy5mcm9tU2hvcnRoYW5kID0gZnVuY3Rpb24oc2hvcnRoYW5kKSB7XG4gIHZhciBlbmMgPSB1dGlsLmlzQXJyYXkoc2hvcnRoYW5kKSA/IHNob3J0aGFuZCA6IHNob3J0aGFuZC5zcGxpdChjLmRlbGltKTtcbiAgcmV0dXJuIGVuYy5yZWR1Y2UoZnVuY3Rpb24obSwgZSkge1xuICAgIHZhciBzcGxpdCA9IGUuc3BsaXQoYy5hc3NpZ24pLFxuICAgICAgICBlbmN0eXBlID0gc3BsaXRbMF0udHJpbSgpLFxuICAgICAgICBmaWVsZCA9IHNwbGl0WzFdO1xuXG4gICAgbVtlbmN0eXBlXSA9IHZsZmllbGQuZnJvbVNob3J0aGFuZChmaWVsZCk7XG4gICAgcmV0dXJuIG07XG4gIH0sIHt9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyB1dGlsaXR5IGZvciBmaWVsZFxuXG5yZXF1aXJlKCcuL2dsb2JhbHMnKTtcblxudmFyIGNvbnN0cyA9IHJlcXVpcmUoJy4vY29uc3RzJyksXG4gIGMgPSBjb25zdHMuc2hvcnRoYW5kLFxuICB0aW1lID0gcmVxdWlyZSgnLi9jb21waWxlci90aW1lJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKSxcbiAgc2NoZW1hID0gcmVxdWlyZSgnLi9zY2hlbWEvc2NoZW1hJyk7XG5cbnZhciB2bGZpZWxkID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLyoqXG4gKiBAcGFyYW0gZmllbGRcbiAqIEBwYXJhbSBvcHRcbiAqICAgb3B0Lm5vZm4gLS0gZXhjbHVkZSBiaW4sIGFnZ3JlZ2F0ZSwgdGltZVVuaXRcbiAqICAgb3B0LmRhdGEgLSBpbmNsdWRlICdkYXRhLidcbiAqICAgb3B0LmQgLSBpbmNsdWRlICdkLidcbiAqICAgb3B0LmZuIC0gcmVwbGFjZSBmbiB3aXRoIGN1c3RvbSBmdW5jdGlvbiBwcmVmaXhcbiAqICAgb3B0LnByZWZuIC0gcHJlcGVuZCBmbiB3aXRoIGN1c3RvbSBmdW5jdGlvbiBwcmVmaXhcblxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbnZsZmllbGQuZmllbGRSZWYgPSBmdW5jdGlvbihmaWVsZCwgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcblxuICB2YXIgZiA9IChvcHQuZCA/ICdkLicgOiAnJykgK1xuICAgICAgICAgIChvcHQuZGF0YSA/ICdkYXRhLicgOiAnJykgK1xuICAgICAgICAgIChvcHQucHJlZm4gfHwgJycpLFxuICAgIG5vZm4gPSBvcHQubm9mbiB8fCBvcHQuZm4sXG4gICAgbmFtZSA9IGZpZWxkLm5hbWU7XG5cbiAgaWYgKHZsZmllbGQuaXNDb3VudChmaWVsZCkpIHtcbiAgICByZXR1cm4gZiArICdjb3VudCc7XG4gIH0gZWxzZSBpZiAoIW5vZm4gJiYgZmllbGQuYmluKSB7XG4gICAgcmV0dXJuIGYgKyAnYmluXycgKyBuYW1lO1xuICB9IGVsc2UgaWYgKCFub2ZuICYmIGZpZWxkLmFnZ3JlZ2F0ZSkge1xuICAgIHJldHVybiBmICsgZmllbGQuYWdncmVnYXRlICsgJ18nICsgbmFtZTtcbiAgfSBlbHNlIGlmICghbm9mbiAmJiBmaWVsZC50aW1lVW5pdCkge1xuICAgIHJldHVybiBmICsgZmllbGQudGltZVVuaXQgKyAnXycgKyBuYW1lO1xuICB9IGVsc2UgaWYgKG9wdC5mbikge1xuICAgIHJldHVybiBmICsgb3B0LmZuICsgJ18nICsgbmFtZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZiArIG5hbWU7XG4gIH1cbn07XG5cbnZsZmllbGQuc2hvcnRoYW5kID0gZnVuY3Rpb24oZikge1xuICB2YXIgYyA9IGNvbnN0cy5zaG9ydGhhbmQ7XG4gIHJldHVybiAoZi5hZ2dyZWdhdGUgPyBmLmFnZ3JlZ2F0ZSArIGMuZnVuYyA6ICcnKSArXG4gICAgKGYudGltZVVuaXQgPyBmLnRpbWVVbml0ICsgYy5mdW5jIDogJycpICtcbiAgICAoZi5iaW4gPyAnYmluJyArIGMuZnVuYyA6ICcnKSArXG4gICAgKGYubmFtZSB8fCAnJykgKyBjLnR5cGUgKyBmLnR5cGU7XG59O1xuXG52bGZpZWxkLnNob3J0aGFuZHMgPSBmdW5jdGlvbihmaWVsZHMsIGRlbGltKSB7XG4gIGRlbGltID0gZGVsaW0gfHwgYy5kZWxpbTtcbiAgcmV0dXJuIGZpZWxkcy5tYXAodmxmaWVsZC5zaG9ydGhhbmQpLmpvaW4oZGVsaW0pO1xufTtcblxudmxmaWVsZC5mcm9tU2hvcnRoYW5kID0gZnVuY3Rpb24oc2hvcnRoYW5kKSB7XG4gIHZhciBzcGxpdCA9IHNob3J0aGFuZC5zcGxpdChjLnR5cGUpLCBpO1xuICB2YXIgbyA9IHtcbiAgICBuYW1lOiBzcGxpdFswXS50cmltKCksXG4gICAgdHlwZTogc3BsaXRbMV0udHJpbSgpXG4gIH07XG5cbiAgLy8gY2hlY2sgYWdncmVnYXRlIHR5cGVcbiAgZm9yIChpIGluIHNjaGVtYS5hZ2dyZWdhdGUuZW51bSkge1xuICAgIHZhciBhID0gc2NoZW1hLmFnZ3JlZ2F0ZS5lbnVtW2ldO1xuICAgIGlmIChvLm5hbWUuaW5kZXhPZihhICsgJ18nKSA9PT0gMCkge1xuICAgICAgby5uYW1lID0gby5uYW1lLnN1YnN0cihhLmxlbmd0aCArIDEpO1xuICAgICAgaWYgKGEgPT0gJ2NvdW50JyAmJiBvLm5hbWUubGVuZ3RoID09PSAwKSBvLm5hbWUgPSAnKic7XG4gICAgICBvLmFnZ3JlZ2F0ZSA9IGE7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBjaGVjayB0aW1lIHRpbWVVbml0XG4gIGZvciAoaSBpbiBzY2hlbWEudGltZWZucykge1xuICAgIHZhciB0dSA9IHNjaGVtYS50aW1lZm5zW2ldO1xuICAgIGlmIChvLm5hbWUgJiYgby5uYW1lLmluZGV4T2YodHUgKyAnXycpID09PSAwKSB7XG4gICAgICBvLm5hbWUgPSBvLm5hbWUuc3Vic3RyKG8ubGVuZ3RoICsgMSk7XG4gICAgICBvLnRpbWVVbml0ID0gdHU7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBjaGVjayBiaW5cbiAgaWYgKG8ubmFtZSAmJiBvLm5hbWUuaW5kZXhPZignYmluXycpID09PSAwKSB7XG4gICAgby5uYW1lID0gby5uYW1lLnN1YnN0cig0KTtcbiAgICBvLmJpbiA9IHRydWU7XG4gIH1cblxuICByZXR1cm4gbztcbn07XG5cbnZhciBpc1R5cGUgPSB2bGZpZWxkLmlzVHlwZSA9IGZ1bmN0aW9uIChmaWVsZERlZiwgdHlwZSkge1xuICByZXR1cm4gZmllbGREZWYudHlwZSA9PT0gdHlwZTtcbn07XG5cbnZhciBpc1R5cGVzID0gdmxmaWVsZC5pc1R5cGVzID0gZnVuY3Rpb24gKGZpZWxkRGVmLCB0eXBlcykge1xuICBmb3IgKHZhciB0PTA7IHQ8dHlwZXMubGVuZ3RoOyB0KyspIHtcbiAgICBpZihmaWVsZERlZi50eXBlID09PSB0eXBlc1t0XSkgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLypcbiAqIE1vc3QgZmllbGRzIHRoYXQgdXNlIG9yZGluYWwgc2NhbGUgYXJlIGRpbWVuc2lvbnMuXG4gKiBIb3dldmVyLCBZRUFSKFQpLCBZRUFSTU9OVEgoVCkgdXNlIHRpbWUgc2NhbGUsIG5vdCBvcmRpbmFsIGJ1dCBhcmUgZGltZW5zaW9ucyB0b28uXG4gKi9cbnZsZmllbGQuaXNPcmRpbmFsU2NhbGUgPSBmdW5jdGlvbihmaWVsZCkge1xuICByZXR1cm4gIGlzVHlwZXMoZmllbGQsIFtOLCBPXSkgfHwgZmllbGQuYmluIHx8XG4gICAgKCBpc1R5cGUoZmllbGQsIFQpICYmIGZpZWxkLnRpbWVVbml0ICYmIHRpbWUuaXNPcmRpbmFsRm4oZmllbGQudGltZVVuaXQpICk7XG59O1xuXG5mdW5jdGlvbiBpc0RpbWVuc2lvbihmaWVsZCkge1xuICByZXR1cm4gIGlzVHlwZXMoZmllbGQsIFtOLCBPXSkgfHwgISFmaWVsZC5iaW4gfHxcbiAgICAoIGlzVHlwZShmaWVsZCwgVCkgJiYgISFmaWVsZC50aW1lVW5pdCApO1xufVxuXG4vKipcbiAqIEZvciBlbmNvZGluZywgdXNlIGVuY29kaW5nLmlzRGltZW5zaW9uKCkgdG8gYXZvaWQgY29uZnVzaW9uLlxuICogT3IgdXNlIEVuY29kaW5nLmlzVHlwZSBpZiB5b3VyIGZpZWxkIGlzIGZyb20gRW5jb2RpbmcgKGFuZCB0aHVzIGhhdmUgbnVtZXJpYyBkYXRhIHR5cGUpLlxuICogb3RoZXJ3aXNlLCBkbyBub3Qgc3BlY2lmaWMgaXNUeXBlIHNvIHdlIGNhbiB1c2UgdGhlIGRlZmF1bHQgaXNUeXBlTmFtZSBoZXJlLlxuICovXG52bGZpZWxkLmlzRGltZW5zaW9uID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIGZpZWxkICYmIGlzRGltZW5zaW9uKGZpZWxkKTtcbn07XG5cbnZsZmllbGQuaXNNZWFzdXJlID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIGZpZWxkICYmICFpc0RpbWVuc2lvbihmaWVsZCk7XG59O1xuXG52bGZpZWxkLmNvdW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7bmFtZTonKicsIGFnZ3JlZ2F0ZTogJ2NvdW50JywgdHlwZTogUSwgZGlzcGxheU5hbWU6IHZsZmllbGQuY291bnQuZGlzcGxheU5hbWV9O1xufTtcblxudmxmaWVsZC5jb3VudC5kaXNwbGF5TmFtZSA9ICdOdW1iZXIgb2YgUmVjb3Jkcyc7XG5cbnZsZmllbGQuaXNDb3VudCA9IGZ1bmN0aW9uKGZpZWxkKSB7XG4gIHJldHVybiBmaWVsZC5hZ2dyZWdhdGUgPT09ICdjb3VudCc7XG59O1xuXG4vKipcbiAqIEZvciBlbmNvZGluZywgdXNlIGVuY29kaW5nLmNhcmRpbmFsaXR5KCkgdG8gYXZvaWQgY29uZnVzaW9uLiAgT3IgdXNlIEVuY29kaW5nLmlzVHlwZSBpZiB5b3VyIGZpZWxkIGlzIGZyb20gRW5jb2RpbmcgKGFuZCB0aHVzIGhhdmUgbnVtZXJpYyBkYXRhIHR5cGUpLlxuICogb3RoZXJ3aXNlLCBkbyBub3Qgc3BlY2lmaWMgaXNUeXBlIHNvIHdlIGNhbiB1c2UgdGhlIGRlZmF1bHQgaXNUeXBlTmFtZSBoZXJlLlxuICovXG52bGZpZWxkLmNhcmRpbmFsaXR5ID0gZnVuY3Rpb24oZmllbGQsIHN0YXRzLCBmaWx0ZXJOdWxsKSB7XG4gIC8vIEZJWE1FIG5lZWQgdG8gdGFrZSBmaWx0ZXIgaW50byBhY2NvdW50XG5cbiAgdmFyIHN0YXQgPSBzdGF0c1tmaWVsZC5uYW1lXTtcbiAgdmFyIHR5cGUgPSBmaWVsZC50eXBlO1xuXG4gIGZpbHRlck51bGwgPSBmaWx0ZXJOdWxsIHx8IHt9O1xuXG4gIGlmIChmaWVsZC5iaW4pIHtcbiAgICB2YXIgYmlucyA9IHV0aWwuZ2V0YmlucyhzdGF0LCBmaWVsZC5iaW4ubWF4YmlucyB8fCBzY2hlbWEuTUFYQklOU19ERUZBVUxUKTtcbiAgICByZXR1cm4gKGJpbnMuc3RvcCAtIGJpbnMuc3RhcnQpIC8gYmlucy5zdGVwO1xuICB9XG4gIGlmIChpc1R5cGUoZmllbGQsIFQpKSB7XG4gICAgdmFyIGNhcmRpbmFsaXR5ID0gdGltZS5jYXJkaW5hbGl0eShmaWVsZCwgc3RhdHMsIGZpbHRlck51bGwsIHR5cGUpO1xuICAgIGlmKGNhcmRpbmFsaXR5ICE9PSBudWxsKSByZXR1cm4gY2FyZGluYWxpdHk7XG4gICAgLy9vdGhlcndpc2UgdXNlIGNhbGN1bGF0aW9uIGJlbG93XG4gIH1cbiAgaWYgKGZpZWxkLmFnZ3JlZ2F0ZSkge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgLy8gcmVtb3ZlIG51bGxcbiAgcmV0dXJuIHN0YXQuZGlzdGluY3QgLVxuICAgIChzdGF0Lm51bGxzID4gMCAmJiBmaWx0ZXJOdWxsW3R5cGVdID8gMSA6IDApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gZGVjbGFyZSBnbG9iYWwgY29uc3RhbnRcbnZhciBnID0gZ2xvYmFsIHx8IHdpbmRvdztcblxuZy5BR0dSRUdBVEUgPSAnYWdncmVnYXRlJztcbmcuUkFXID0gJ3Jhdyc7XG5nLlNUQUNLRUQgPSAnc3RhY2tlZCc7XG5nLklOREVYID0gJ2luZGV4JztcblxuZy5YID0gJ3gnO1xuZy5ZID0gJ3knO1xuZy5ST1cgPSAncm93JztcbmcuQ09MID0gJ2NvbCc7XG5nLlNJWkUgPSAnc2l6ZSc7XG5nLlNIQVBFID0gJ3NoYXBlJztcbmcuQ09MT1IgPSAnY29sb3InO1xuZy5URVhUID0gJ3RleHQnO1xuZy5ERVRBSUwgPSAnZGV0YWlsJztcblxuZy5OID0gJ04nO1xuZy5PID0gJ08nO1xuZy5RID0gJ1EnO1xuZy5UID0gJ1QnO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBUT0RPKGthbml0dyk6IGNoYXQgd2l0aCBWZWdhIHRlYW0gYW5kIHBvc3NpYmx5IG1vdmUgdGhpcyB0byB2ZWdhLWxvZ2dpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gIC8vIEJvcnJvd2VkIHNvbWUgaWRlYXMgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNTY1MzI2MC84NjY5ODlcbiAgLy8gYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS9wYXRpay9jb25zb2xlLmxvZy13cmFwcGVyL2Jsb2IvbWFzdGVyL2NvbnNvbGVsb2cuanNcbiAgdmFyIE1FVEhPRFMgPSBbJ2Vycm9yJywgJ2luZm8nLCAnZGVidWcnLCAnd2FybicsICdsb2cnXTtcblxuICByZXR1cm4gTUVUSE9EUy5yZWR1Y2UoZnVuY3Rpb24obG9nZ2VyLCBmbikge1xuICAgIHZhciBjZm4gPSBjb25zb2xlW2ZuXSA/IGZuIDogJ2xvZyc7XG4gICAgaWYgKGNvbnNvbGVbY2ZuXS5iaW5kID09PSAndW5kZWZpbmVkJykgeyAvLyBJRSA8IDEwXG4gICAgICAgIGxvZ2dlcltmbl0gPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKGNvbnNvbGVbY2ZuXSwgY29uc29sZSwgcHJlZml4KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxvZ2dlcltmbl0gPSBjb25zb2xlW2Nmbl0uYmluZChjb25zb2xlLCBwcmVmaXgpO1xuICAgIH1cbiAgICByZXR1cm4gbG9nZ2VyO1xuICB9LCB7fSk7XG59OyIsIi8vIFBhY2thZ2Ugb2YgZGVmaW5pbmcgVmVnYS1saXRlIFNwZWNpZmljYXRpb24ncyBqc29uIHNjaGVtYVxuJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciBzY2hlbWEgPSBtb2R1bGUuZXhwb3J0cyA9IHt9LFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICB0b01hcCA9IHV0aWwudG9NYXAsXG4gIGNvbG9yYnJld2VyID0gcmVxdWlyZSgnY29sb3JicmV3ZXInKTtcblxuc2NoZW1hLnV0aWwgPSByZXF1aXJlKCcuL3NjaGVtYXV0aWwnKTtcblxuc2NoZW1hLm1hcmt0eXBlID0ge1xuICB0eXBlOiAnc3RyaW5nJyxcbiAgZW51bTogWydwb2ludCcsICd0aWNrJywgJ2JhcicsICdsaW5lJywgJ2FyZWEnLCAnY2lyY2xlJywgJ3NxdWFyZScsICd0ZXh0J11cbn07XG5cbnNjaGVtYS5hZ2dyZWdhdGUgPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICBlbnVtOiBbJ2F2ZycsICdzdW0nLCAnbWVkaWFuJywgJ21pbicsICdtYXgnLCAnY291bnQnXSxcbiAgc3VwcG9ydGVkRW51bXM6IHtcbiAgICBROiBbJ2F2ZycsICdtZWRpYW4nLCAnc3VtJywgJ21pbicsICdtYXgnLCAnY291bnQnXSxcbiAgICBPOiBbJ21lZGlhbicsJ21pbicsJ21heCddLFxuICAgIE46IFtdLFxuICAgIFQ6IFsnYXZnJywgJ21lZGlhbicsICdtaW4nLCAnbWF4J10sXG4gICAgJyc6IFsnY291bnQnXVxuICB9LFxuICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1EsIE4sIE8sIFQsICcnXSlcbn07XG5cbnNjaGVtYS5nZXRTdXBwb3J0ZWRSb2xlID0gZnVuY3Rpb24oZW5jVHlwZSkge1xuICByZXR1cm4gc2NoZW1hLnNjaGVtYS5wcm9wZXJ0aWVzLmVuY29kaW5nLnByb3BlcnRpZXNbZW5jVHlwZV0uc3VwcG9ydGVkUm9sZTtcbn07XG5cbnNjaGVtYS50aW1lVW5pdHMgPSBbJ3llYXInLCAnbW9udGgnLCAnZGF5JywgJ2RhdGUnLCAnaG91cnMnLCAnbWludXRlcycsICdzZWNvbmRzJ107XG5cbnNjaGVtYS5kZWZhdWx0VGltZUZuID0gJ21vbnRoJztcblxuc2NoZW1hLnRpbWVVbml0ID0ge1xuICB0eXBlOiAnc3RyaW5nJyxcbiAgZW51bTogc2NoZW1hLnRpbWVVbml0cyxcbiAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtUXSlcbn07XG5cbnNjaGVtYS5zY2FsZV90eXBlID0ge1xuICB0eXBlOiAnc3RyaW5nJyxcbiAgLy8gVE9ETyhrYW5pdHcpIHJlYWQgdmVnYSdzIHNjaGVtYSBoZXJlLCBhZGQgZGVzY3JpcHRpb25cbiAgZW51bTogWydsaW5lYXInLCAnbG9nJywgJ3BvdycsICdzcXJ0JywgJ3F1YW50aWxlJ10sXG4gIGRlZmF1bHQ6ICdsaW5lYXInLFxuICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1FdKVxufTtcblxuc2NoZW1hLmZpZWxkID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIG5hbWU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgfVxuICB9XG59O1xuXG52YXIgY2xvbmUgPSB1dGlsLmR1cGxpY2F0ZTtcbnZhciBtZXJnZSA9IHNjaGVtYS51dGlsLm1lcmdlO1xuXG5zY2hlbWEuTUFYQklOU19ERUZBVUxUID0gMTU7XG5cbnZhciBiaW4gPSB7XG4gIHR5cGU6IFsnYm9vbGVhbicsICdvYmplY3QnXSxcbiAgZGVmYXVsdDogZmFsc2UsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBtYXhiaW5zOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiBzY2hlbWEuTUFYQklOU19ERUZBVUxULFxuICAgICAgbWluaW11bTogMixcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWF4aW11bSBudW1iZXIgb2YgYmlucy4nXG4gICAgfVxuICB9LFxuICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1FdKSAvLyBUT0RPOiBhZGQgTyBhZnRlciBmaW5pc2hpbmcgIzgxXG59O1xuXG52YXIgdHlwaWNhbEZpZWxkID0gbWVyZ2UoY2xvbmUoc2NoZW1hLmZpZWxkKSwge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogW04sIE8sIFEsIFRdXG4gICAgfSxcbiAgICBhZ2dyZWdhdGU6IHNjaGVtYS5hZ2dyZWdhdGUsXG4gICAgdGltZVVuaXQ6IHNjaGVtYS50aW1lVW5pdCxcbiAgICBiaW46IGJpbixcbiAgICBzY2FsZToge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHR5cGU6IHNjaGVtYS5zY2FsZV90eXBlLFxuICAgICAgICByZXZlcnNlOiB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUSwgVF0pXG4gICAgICAgIH0sXG4gICAgICAgIHplcm86IHtcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdJbmNsdWRlIHplcm8nLFxuICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRLCBUXSlcbiAgICAgICAgfSxcbiAgICAgICAgbmljZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IFsnc2Vjb25kJywgJ21pbnV0ZScsICdob3VyJywgJ2RheScsICd3ZWVrJywgJ21vbnRoJywgJ3llYXInXSxcbiAgICAgICAgICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1RdKVxuICAgICAgICB9LFxuICAgICAgICB1c2VSYXdEb21haW46IHtcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVXNlIHRoZSByYXcgZGF0YSByYW5nZSBhcyBzY2FsZSBkb21haW4gaW5zdGVhZCBvZiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgJ2FnZ3JlZ2F0ZWQgZGF0YSBmb3IgYWdncmVnYXRlIGF4aXMuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAnVGhpcyBvcHRpb24gZG9lcyBub3Qgd29yayB3aXRoIHN1bSBvciBjb3VudCBhZ2dyZWdhdGUnICtcbiAgICAgICAgICAgICAgICAgICAgICAgJ2FzIHRoZXkgbWlnaHQgaGF2ZSBhIHN1YnN0YW50aWFsbHkgbGFyZ2VyIHNjYWxlIHJhbmdlLicgK1xuICAgICAgICAgICAgICAgICAgICAgICAnQnkgZGVmYXVsdCwgdXNlIHZhbHVlIGZyb20gY29uZmlnLnVzZVJhd0RvbWFpbi4nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG52YXIgb25seU9yZGluYWxGaWVsZCA9IG1lcmdlKGNsb25lKHNjaGVtYS5maWVsZCksIHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZFJvbGU6IHtcbiAgICBkaW1lbnNpb246IHRydWVcbiAgfSxcbiAgcHJvcGVydGllczoge1xuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogW04sIE8sIFEsIFRdIC8vIG9yZGluYWwtb25seSBmaWVsZCBzdXBwb3J0cyBRIHdoZW4gYmluIGlzIGFwcGxpZWQgYW5kIFQgd2hlbiB0aW1lIHVuaXQgaXMgYXBwbGllZC5cbiAgICB9LFxuICAgIHRpbWVVbml0OiBzY2hlbWEudGltZVVuaXQsXG4gICAgYmluOiBiaW4sXG4gICAgYWdncmVnYXRlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnY291bnQnXSxcbiAgICAgIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbTiwgT10pIC8vIEZJWE1FIHRoaXMgbG9va3Mgd2VpcmQgdG8gbWVcbiAgICB9XG4gIH1cbn0pO1xuXG52YXIgYXhpc01peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIHRpY2s6IHRydWUsIGJhcjogdHJ1ZSwgbGluZTogdHJ1ZSwgYXJlYTogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWV9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgYXhpczoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdyaWQ6IHtcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0EgZmxhZyBpbmRpY2F0ZSBpZiBncmlkbGluZXMgc2hvdWxkIGJlIGNyZWF0ZWQgaW4gYWRkaXRpb24gdG8gdGlja3MuJ1xuICAgICAgICB9LFxuICAgICAgICBsYXllcjoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdiYWNrJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Egc3RyaW5nIGluZGljYXRpbmcgaWYgdGhlIGF4aXMgKGFuZCBhbnkgZ3JpZGxpbmVzKSBzaG91bGQgYmUgcGxhY2VkIGFib3ZlIG9yIGJlbG93IHRoZSBkYXRhIG1hcmtzLidcbiAgICAgICAgfSxcbiAgICAgICAgb3JpZW50OiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgIGVudW06IFsndG9wJywgJ3JpZ2h0JywgJ2xlZnQnLCAnYm90dG9tJ10sXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgb3JpZW50YXRpb24gb2YgdGhlIGF4aXMuIE9uZSBvZiB0b3AsIGJvdHRvbSwgbGVmdCBvciByaWdodC4gVGhlIG9yaWVudGF0aW9uIGNhbiBiZSB1c2VkIHRvIGZ1cnRoZXIgc3BlY2lhbGl6ZSB0aGUgYXhpcyB0eXBlIChlLmcuLCBhIHkgYXhpcyBvcmllbnRlZCBmb3IgdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIGNoYXJ0KS4nXG4gICAgICAgIH0sXG4gICAgICAgIHRpY2tzOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IDUsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBIGRlc2lyZWQgbnVtYmVyIG9mIHRpY2tzLCBmb3IgYXhlcyB2aXN1YWxpemluZyBxdWFudGl0YXRpdmUgc2NhbGVzLiBUaGUgcmVzdWx0aW5nIG51bWJlciBtYXkgYmUgZGlmZmVyZW50IHNvIHRoYXQgdmFsdWVzIGFyZSBcIm5pY2VcIiAobXVsdGlwbGVzIG9mIDIsIDUsIDEwKSBhbmQgbGllIHdpdGhpbiB0aGUgdW5kZXJseWluZyBzY2FsZVxcJ3MgcmFuZ2UuJ1xuICAgICAgICB9LFxuICAgICAgICB0aXRsZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgZm9yIHRoZSBheGlzLiAoU2hvd3MgZmllbGQgbmFtZSBhbmQgaXRzIGZ1bmN0aW9uIGJ5IGRlZmF1bHQuKSdcbiAgICAgICAgfSxcbiAgICAgICAgdGl0bGVNYXhMZW5ndGg6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTWF4IGxlbmd0aCBmb3IgYXhpcyB0aXRsZSBpZiB0aGUgdGl0bGUgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGUgZmllbGRcXCdzIGRlc2NyaXB0aW9uJ1xuICAgICAgICB9LFxuICAgICAgICB0aXRsZU9mZnNldDoge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBIHRpdGxlIG9mZnNldCB2YWx1ZSBmb3IgdGhlIGF4aXMuJ1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgZm9ybWF0dGluZyBwYXR0ZXJuIGZvciBheGlzIGxhYmVscy4gJytcbiAgICAgICAgICAgICAgICAgICAgICAgJ0lmIG5vdCB1bmRlZmluZWQsIHRoaXMgd2lsbCBiZSBkZXRlcm1pbmVkIGJ5ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAnc21hbGwvbGFyZ2VOdW1iZXJGb3JtYXQgYW5kIHRoZSBtYXggdmFsdWUgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICdvZiB0aGUgZmllbGQuJ1xuICAgICAgICB9LFxuICAgICAgICBtYXhMYWJlbExlbmd0aDoge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiAyNSxcbiAgICAgICAgICBtaW5pbXVtOiAwLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVHJ1bmNhdGUgbGFiZWxzIHRoYXQgYXJlIHRvbyBsb25nLidcbiAgICAgICAgfSxcbiAgICAgICAgbGFiZWxBbmdsZToge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsIC8vIGF1dG9cbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZSBsYWJlbHMuIFNldCB0byAwIHRvIGZvcmNlIGhvcml6b250YWwuJ1xuICAgICAgICB9LFxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIHNvcnRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBzb3J0OiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogW10sXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtOLCBPXSksXG4gICAgICAgIHJlcXVpcmVkOiBbJ25hbWUnLCAnYWdncmVnYXRlJ10sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWdncmVnYXRlOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGVudW06IFsnYXZnJywgJ3N1bScsICdtaW4nLCAnbWF4JywgJ2NvdW50J11cbiAgICAgICAgICB9LFxuICAgICAgICAgIHJldmVyc2U6IHtcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgYmFuZE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIGJhbmQ6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBzaXplOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIG1pbmltdW06IDAsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgICAgIH0sXG4gICAgICAgIHBhZGRpbmc6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICBkZWZhdWx0OiAxXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBsZWdlbmRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBsZWdlbmQ6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB0aXRsZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgZm9yIHRoZSBsZWdlbmQuIChTaG93cyBmaWVsZCBuYW1lIGFuZCBpdHMgZnVuY3Rpb24gYnkgZGVmYXVsdC4pJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgdGV4dE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7J3RleHQnOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIGFsaWduOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdyaWdodCdcbiAgICB9LFxuICAgIGJhc2VsaW5lOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdtaWRkbGUnXG4gICAgfSxcbiAgICBjb2xvcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJyMwMDAwMDAnXG4gICAgfSxcbiAgICBtYXJnaW46IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDQsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBwbGFjZWhvbGRlcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnQWJjJ1xuICAgIH0sXG4gICAgZm9udDoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHdlaWdodDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IFsnbm9ybWFsJywgJ2JvbGQnXSxcbiAgICAgICAgICBkZWZhdWx0OiAnbm9ybWFsJ1xuICAgICAgICB9LFxuICAgICAgICBzaXplOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IDEwLFxuICAgICAgICAgIG1pbmltdW06IDBcbiAgICAgICAgfSxcbiAgICAgICAgZmFtaWx5OiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogJ0hlbHZldGljYSBOZXVlJ1xuICAgICAgICB9LFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdub3JtYWwnLFxuICAgICAgICAgIGVudW06IFsnbm9ybWFsJywgJ2l0YWxpYyddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGZvcm1hdDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmb3JtYXR0aW5nIHBhdHRlcm4gZm9yIHRleHQgdmFsdWUuICcrXG4gICAgICAgICAgICAgICAgICAgJ0lmIG5vdCB1bmRlZmluZWQsIHRoaXMgd2lsbCBiZSBkZXRlcm1pbmVkIGJ5ICcgK1xuICAgICAgICAgICAgICAgICAgICdzbWFsbC9sYXJnZU51bWJlckZvcm1hdCBhbmQgdGhlIG1heCB2YWx1ZSAnICtcbiAgICAgICAgICAgICAgICAgICAnb2YgdGhlIGZpZWxkLidcbiAgICB9LFxuICB9XG59O1xuXG52YXIgc2l6ZU1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIGJhcjogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWUsIHRleHQ6IHRydWV9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDMwLFxuICAgICAgbWluaW11bTogMFxuICAgIH1cbiAgfVxufTtcblxudmFyIGNvbG9yTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSwgJ3RleHQnOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiAnc3RlZWxibHVlJ1xuICAgIH0sXG4gICAgb3BhY2l0eToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgbWF4aW11bTogMVxuICAgIH0sXG4gICAgc2NhbGU6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICByYW5nZToge1xuICAgICAgICAgIHR5cGU6IFsnc3RyaW5nJywgJ2FycmF5J10sXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgJ2NvbG9yIHBhbGV0dGUsIGlmIHVuZGVmaW5lZCB2ZWdhLWxpdGUgd2lsbCB1c2UgZGF0YSBwcm9wZXJ0eScgK1xuICAgICAgICAgICAgJ3RvIHBpY2sgb25lIGZyb20gYzEwcGFsZXR0ZSwgYzIwcGFsZXR0ZSwgb3Igb3JkaW5hbFBhbGV0dGUnXG4gICAgICAgICAgICAvL0ZJWE1FXG4gICAgICAgIH0sXG4gICAgICAgIGMxMHBhbGV0dGU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiAnY2F0ZWdvcnkxMCcsXG4gICAgICAgICAgZW51bTogW1xuICAgICAgICAgICAgLy8gVGFibGVhdVxuICAgICAgICAgICAgJ2NhdGVnb3J5MTAnLCAnY2F0ZWdvcnkxMGsnLFxuICAgICAgICAgICAgLy8gQ29sb3IgQnJld2VyXG4gICAgICAgICAgICAnUGFzdGVsMScsICdQYXN0ZWwyJywgJ1NldDEnLCAnU2V0MicsICdTZXQzJ1xuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgYzIwcGFsZXR0ZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdjYXRlZ29yeTIwJyxcbiAgICAgICAgICBlbnVtOiBbJ2NhdGVnb3J5MjAnLCAnY2F0ZWdvcnkyMGInLCAnY2F0ZWdvcnkyMGMnXVxuICAgICAgICB9LFxuICAgICAgICBvcmRpbmFsUGFsZXR0ZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICBlbnVtOiB1dGlsLmtleXMoY29sb3JicmV3ZXIpXG4gICAgICAgIH0sXG4gICAgICAgIHF1YW50aXRhdGl2ZVJhbmdlOiB7XG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBkZWZhdWx0OiBbJyNBRkM2QTMnLCAnIzA5NjIyQSddLCAvLyB0YWJsZWF1IGdyZWVuc1xuICAgICAgICAgIC8vIGRlZmF1bHQ6IFsnI2NjZWNlNicsICcjMDA0NDFiJ10sIC8vIEJ1R24uOSBbMi04XVxuICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIHJvbGU6ICdjb2xvcidcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBzaGFwZU1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnY2lyY2xlJywgJ3NxdWFyZScsICdjcm9zcycsICdkaWFtb25kJywgJ3RyaWFuZ2xlLXVwJywgJ3RyaWFuZ2xlLWRvd24nXSxcbiAgICAgIGRlZmF1bHQ6ICdjaXJjbGUnXG4gICAgfSxcbiAgICBmaWxsZWQ6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246ICd3aGV0aGVyIHRoZSBzaGFwZVxcJ3MgY29sb3Igc2hvdWxkIGJlIHVzZWQgYXMgZmlsbCBjb2xvciBpbnN0ZWFkIG9mIHN0cm9rZSBjb2xvcidcbiAgICB9XG4gIH1cbn07XG5cbnZhciBkZXRhaWxNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBsaW5lOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZX1cbn07XG5cbnZhciByb3dNaXhpbiA9IHtcbiAgcHJvcGVydGllczoge1xuICAgIGhlaWdodDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVmYXVsdDogMTUwXG4gICAgfVxuICB9XG59O1xuXG52YXIgY29sTWl4aW4gPSB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICB3aWR0aDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVmYXVsdDogMTUwXG4gICAgfSxcbiAgICBheGlzOiB7XG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG1heExhYmVsTGVuZ3RoOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IDEyLFxuICAgICAgICAgIG1pbmltdW06IDAsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUcnVuY2F0ZSBsYWJlbHMgdGhhdCBhcmUgdG9vIGxvbmcuJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgZmFjZXRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBiYXI6IHRydWUsIGxpbmU6IHRydWUsIGFyZWE6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlLCB0ZXh0OiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHBhZGRpbmc6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIG1heGltdW06IDEsXG4gICAgICBkZWZhdWx0OiAwLjFcbiAgICB9XG4gIH1cbn07XG5cbnZhciByZXF1aXJlZE5hbWVUeXBlID0ge1xuICByZXF1aXJlZDogWyduYW1lJywgJ3R5cGUnXVxufTtcblxudmFyIG11bHRpUm9sZUZpZWxkID0gbWVyZ2UoY2xvbmUodHlwaWNhbEZpZWxkKSwge1xuICBzdXBwb3J0ZWRSb2xlOiB7XG4gICAgbWVhc3VyZTogdHJ1ZSxcbiAgICBkaW1lbnNpb246IHRydWVcbiAgfVxufSk7XG5cbnZhciBxdWFudGl0YXRpdmVGaWVsZCA9IG1lcmdlKGNsb25lKHR5cGljYWxGaWVsZCksIHtcbiAgc3VwcG9ydGVkUm9sZToge1xuICAgIG1lYXN1cmU6IHRydWUsXG4gICAgZGltZW5zaW9uOiAnb3JkaW5hbC1vbmx5JyAvLyB1c2luZyBzaXplIHRvIGVuY29kaW5nIGNhdGVnb3J5IGxlYWQgdG8gb3JkZXIgaW50ZXJwcmV0YXRpb25cbiAgfVxufSk7XG5cbnZhciBvbmx5UXVhbnRpdGF0aXZlRmllbGQgPSBtZXJnZShjbG9uZSh0eXBpY2FsRmllbGQpLCB7XG4gIHN1cHBvcnRlZFJvbGU6IHtcbiAgICBtZWFzdXJlOiB0cnVlXG4gIH1cbn0pO1xuXG52YXIgeCA9IG1lcmdlKGNsb25lKG11bHRpUm9sZUZpZWxkKSwgYXhpc01peGluLCBiYW5kTWl4aW4sIHJlcXVpcmVkTmFtZVR5cGUsIHNvcnRNaXhpbik7XG52YXIgeSA9IGNsb25lKHgpO1xuXG52YXIgZmFjZXQgPSBtZXJnZShjbG9uZShvbmx5T3JkaW5hbEZpZWxkKSwgcmVxdWlyZWROYW1lVHlwZSwgZmFjZXRNaXhpbiwgc29ydE1peGluKTtcbnZhciByb3cgPSBtZXJnZShjbG9uZShmYWNldCksIGF4aXNNaXhpbiwgcm93TWl4aW4pO1xudmFyIGNvbCA9IG1lcmdlKGNsb25lKGZhY2V0KSwgYXhpc01peGluLCBjb2xNaXhpbik7XG5cbnZhciBzaXplID0gbWVyZ2UoY2xvbmUocXVhbnRpdGF0aXZlRmllbGQpLCBsZWdlbmRNaXhpbiwgc2l6ZU1peGluLCBzb3J0TWl4aW4pO1xudmFyIGNvbG9yID0gbWVyZ2UoY2xvbmUobXVsdGlSb2xlRmllbGQpLCBsZWdlbmRNaXhpbiwgY29sb3JNaXhpbiwgc29ydE1peGluKTtcblxudmFyIHNoYXBlID0gbWVyZ2UoY2xvbmUob25seU9yZGluYWxGaWVsZCksIGxlZ2VuZE1peGluLCBzaGFwZU1peGluLCBzb3J0TWl4aW4pO1xudmFyIGRldGFpbCA9IG1lcmdlKGNsb25lKG9ubHlPcmRpbmFsRmllbGQpLCBkZXRhaWxNaXhpbiwgc29ydE1peGluKTtcblxuLy8gd2Ugb25seSBwdXQgYWdncmVnYXRlZCBtZWFzdXJlIGluIHBpdm90IHRhYmxlXG52YXIgdGV4dCA9IG1lcmdlKGNsb25lKG9ubHlRdWFudGl0YXRpdmVGaWVsZCksIHRleHRNaXhpbiwgc29ydE1peGluKTtcblxuLy8gVE9ETyBhZGQgbGFiZWxcblxudmFyIGZpbHRlciA9IHtcbiAgdHlwZTogJ2FycmF5JyxcbiAgaXRlbXM6IHtcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBvcGVyYW5kczoge1xuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBpdGVtczoge1xuICAgICAgICAgIHR5cGU6IFsnc3RyaW5nJywgJ2Jvb2xlYW4nLCAnaW50ZWdlcicsICdudW1iZXInXVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb3BlcmF0b3I6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGVudW06IFsnPicsICc+PScsICc9JywgJyE9JywgJzwnLCAnPD0nLCAnbm90TnVsbCddXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgZGF0YSA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICAvLyBkYXRhIHNvdXJjZVxuICAgIGZvcm1hdFR5cGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydqc29uJywgJ2NzdiddLFxuICAgICAgZGVmYXVsdDogJ2pzb24nXG4gICAgfSxcbiAgICB1cmw6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICB2YWx1ZXM6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1Bhc3MgYXJyYXkgb2Ygb2JqZWN0cyBpbnN0ZWFkIG9mIGEgdXJsIHRvIGEgZmlsZS4nLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgY29uZmlnID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIC8vIHRlbXBsYXRlXG4gICAgd2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgaGVpZ2h0OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIHZpZXdwb3J0OiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICB9LFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBncmlkQ29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICdibGFjaydcbiAgICB9LFxuICAgIGdyaWRPcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxLFxuICAgICAgZGVmYXVsdDogMC4wOFxuICAgIH0sXG5cbiAgICAvLyBmaWx0ZXIgbnVsbFxuICAgIGZpbHRlck51bGw6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBPOiB7dHlwZTonYm9vbGVhbicsIGRlZmF1bHQ6IGZhbHNlfSxcbiAgICAgICAgUToge3R5cGU6J2Jvb2xlYW4nLCBkZWZhdWx0OiB0cnVlfSxcbiAgICAgICAgVDoge3R5cGU6J2Jvb2xlYW4nLCBkZWZhdWx0OiB0cnVlfVxuICAgICAgfVxuICAgIH0sXG4gICAgdG9nZ2xlU29ydDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiBPXG4gICAgfSxcblxuICAgIC8vIHNpbmdsZSBwbG90XG4gICAgc2luZ2xlSGVpZ2h0OiB7XG4gICAgICAvLyB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IGJhbmRXaWR0aCAqIChjYXJkaW5hbGl0eSArIHBhZGRpbmcpXG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyMDAsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBzaW5nbGVXaWR0aDoge1xuICAgICAgLy8gd2lsbCBiZSBvdmVyd3JpdHRlbiBieSBiYW5kV2lkdGggKiAoY2FyZGluYWxpdHkgKyBwYWRkaW5nKVxuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjAwLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgLy8gYmFuZCBzaXplXG4gICAgbGFyZ2VCYW5kU2l6ZToge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjEsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBzbWFsbEJhbmRTaXplOiB7XG4gICAgICAvL3NtYWxsIG11bHRpcGxlcyBvciBzaW5nbGUgcGxvdCB3aXRoIGhpZ2ggY2FyZGluYWxpdHlcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDEyLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgbGFyZ2VCYW5kTWF4Q2FyZGluYWxpdHk6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDEwXG4gICAgfSxcbiAgICAvLyBzbWFsbCBtdWx0aXBsZXNcbiAgICBjZWxsUGFkZGluZzoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAwLjFcbiAgICB9LFxuICAgIGNlbGxHcmlkQ29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICdibGFjaydcbiAgICB9LFxuICAgIGNlbGxHcmlkT3BhY2l0eToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgbWF4aW11bTogMSxcbiAgICAgIGRlZmF1bHQ6IDAuMTVcbiAgICB9LFxuICAgIGNlbGxCYWNrZ3JvdW5kQ29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcbiAgICB9LFxuICAgIHRleHRDZWxsV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDkwLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG5cbiAgICAvLyBtYXJrc1xuICAgIHN0cm9rZVdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgc2luZ2xlQmFyT2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiA1LFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgLy8gc2NhbGVzXG4gICAgdGltZVNjYWxlTGFiZWxMZW5ndGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDMsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVzY3JpcHRpb246ICdNYXggbGVuZ3RoIGZvciB2YWx1ZXMgaW4gZGF5U2NhbGVMYWJlbCBhbmQgbW9udGhTY2FsZUxhYmVsLiAgWmVybyBtZWFucyB1c2luZyBmdWxsIG5hbWVzIGluIGRheVNjYWxlTGFiZWwvbW9udGhTY2FsZUxhYmVsLidcbiAgICB9LFxuICAgIGRheVNjYWxlTGFiZWw6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGRlZmF1bHQ6IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXhpcyBsYWJlbHMgZm9yIGRheSBvZiB3ZWVrLCBzdGFydGluZyBmcm9tIFN1bmRheS4nICtcbiAgICAgICAgJyhDb25zaXN0ZW50IHdpdGggSmF2YXNjcmlwdCAtLSBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRGF0ZS9nZXREYXkuJ1xuICAgIH0sXG4gICAgbW9udGhTY2FsZUxhYmVsOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0OiBbJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXhpcyBsYWJlbHMgZm9yIG1vbnRoLidcbiAgICB9LFxuICAgIC8vIG90aGVyXG4gICAgY2hhcmFjdGVyV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDZcbiAgICB9LFxuICAgIG1heFNtYWxsTnVtYmVyOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDEwMDAwLFxuICAgICAgZGVzY3JpcHRpb246ICdtYXhpbXVtIG51bWJlciB0aGF0IGEgZmllbGQgd2lsbCBiZSBjb25zaWRlcmVkIHNtYWxsTnVtYmVyLicrXG4gICAgICAgICAgICAgICAgICAgJ1VzZWQgZm9yIGF4aXMgbGFiZWxsaW5nLidcbiAgICB9LFxuICAgIHNtYWxsTnVtYmVyRm9ybWF0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgZGVzY3JpcHRpb246ICdEMyBOdW1iZXIgZm9ybWF0IGZvciBheGlzIGxhYmVscyBhbmQgdGV4dCB0YWJsZXMgJytcbiAgICAgICAgICAgICAgICAgICAnZm9yIG51bWJlciA8PSBtYXhTbWFsbE51bWJlci4gVXNlZCBmb3IgYXhpcyBsYWJlbGxpbmcuJ1xuICAgIH0sXG4gICAgbGFyZ2VOdW1iZXJGb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJy4zcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0QzIE51bWJlciBmb3JtYXQgZm9yIGF4aXMgbGFiZWxzIGFuZCB0ZXh0IHRhYmxlcyAnICtcbiAgICAgICAgICAgICAgICAgICAnZm9yIG51bWJlciA+IG1heFNtYWxsTnVtYmVyLidcbiAgICB9LFxuICAgIHRpbWVGb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJyVZLSVtLSVkJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGF0ZSBmb3JtYXQgZm9yIGF4aXMgbGFiZWxzLidcbiAgICB9LFxuICAgIHVzZVJhd0RvbWFpbjoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ1VzZSB0aGUgcmF3IGRhdGEgcmFuZ2UgYXMgc2NhbGUgZG9tYWluIGluc3RlYWQgb2YgJyArXG4gICAgICAgICAgICAgICAgICAgJ2FnZ3JlZ2F0ZWQgZGF0YSBmb3IgYWdncmVnYXRlIGF4aXMuICcgK1xuICAgICAgICAgICAgICAgICAgICdUaGlzIG9wdGlvbiBkb2VzIG5vdCB3b3JrIHdpdGggc3VtIG9yIGNvdW50IGFnZ3JlZ2F0ZScgK1xuICAgICAgICAgICAgICAgICAgICdhcyB0aGV5IG1pZ2h0IGhhdmUgYSBzdWJzdGFudGlhbGx5IGxhcmdlciBzY2FsZSByYW5nZS4nICtcbiAgICAgICAgICAgICAgICAgICAnQnkgZGVmYXVsdCwgdXNlIHZhbHVlIGZyb20gY29uZmlnLnVzZVJhd0RvbWFpbi4nXG4gICAgfVxuICB9XG59O1xuXG4vKiogQHR5cGUgT2JqZWN0IFNjaGVtYSBvZiBhIHZlZ2EtbGl0ZSBzcGVjaWZpY2F0aW9uICovXG5zY2hlbWEuc2NoZW1hID0ge1xuICAkc2NoZW1hOiAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNC9zY2hlbWEjJyxcbiAgZGVzY3JpcHRpb246ICdTY2hlbWEgZm9yIFZlZ2EtbGl0ZSBzcGVjaWZpY2F0aW9uJyxcbiAgdHlwZTogJ29iamVjdCcsXG4gIHJlcXVpcmVkOiBbJ21hcmt0eXBlJywgJ2VuY29kaW5nJywgJ2RhdGEnXSxcbiAgcHJvcGVydGllczoge1xuICAgIGRhdGE6IGRhdGEsXG4gICAgbWFya3R5cGU6IHNjaGVtYS5tYXJrdHlwZSxcbiAgICBlbmNvZGluZzoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHksXG4gICAgICAgIHJvdzogcm93LFxuICAgICAgICBjb2w6IGNvbCxcbiAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBzaGFwZTogc2hhcGUsXG4gICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgIGRldGFpbDogZGV0YWlsXG4gICAgICB9XG4gICAgfSxcbiAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICBjb25maWc6IGNvbmZpZ1xuICB9XG59O1xuXG5zY2hlbWEuZW5jVHlwZXMgPSB1dGlsLmtleXMoc2NoZW1hLnNjaGVtYS5wcm9wZXJ0aWVzLmVuY29kaW5nLnByb3BlcnRpZXMpO1xuXG4vKiogSW5zdGFudGlhdGUgYSB2ZXJib3NlIHZsIHNwZWMgZnJvbSB0aGUgc2NoZW1hICovXG5zY2hlbWEuaW5zdGFudGlhdGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHNjaGVtYS51dGlsLmluc3RhbnRpYXRlKHNjaGVtYS5zY2hlbWEpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNjaGVtYXV0aWwgPSBtb2R1bGUuZXhwb3J0cyA9IHt9LFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59O1xuXG5zY2hlbWF1dGlsLmV4dGVuZCA9IGZ1bmN0aW9uKGluc3RhbmNlLCBzY2hlbWEpIHtcbiAgcmV0dXJuIHNjaGVtYXV0aWwubWVyZ2Uoc2NoZW1hdXRpbC5pbnN0YW50aWF0ZShzY2hlbWEpLCBpbnN0YW5jZSk7XG59O1xuXG4vLyBpbnN0YW50aWF0ZSBhIHNjaGVtYVxuc2NoZW1hdXRpbC5pbnN0YW50aWF0ZSA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgdmFsO1xuICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKCdkZWZhdWx0JyBpbiBzY2hlbWEpIHtcbiAgICB2YWwgPSBzY2hlbWEuZGVmYXVsdDtcbiAgICByZXR1cm4gdXRpbC5pc09iamVjdCh2YWwpID8gdXRpbC5kdXBsaWNhdGUodmFsKSA6IHZhbDtcbiAgfSBlbHNlIGlmIChzY2hlbWEudHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSB7fTtcbiAgICBmb3IgKHZhciBuYW1lIGluIHNjaGVtYS5wcm9wZXJ0aWVzKSB7XG4gICAgICB2YWwgPSBzY2hlbWF1dGlsLmluc3RhbnRpYXRlKHNjaGVtYS5wcm9wZXJ0aWVzW25hbWVdKTtcbiAgICAgIGlmICh2YWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpbnN0YW5jZVtuYW1lXSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2UgaWYgKHNjaGVtYS50eXBlID09PSAnYXJyYXknKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG4vLyByZW1vdmUgYWxsIGRlZmF1bHRzIGZyb20gYW4gaW5zdGFuY2VcbnNjaGVtYXV0aWwuc3VidHJhY3QgPSBmdW5jdGlvbihpbnN0YW5jZSwgZGVmYXVsdHMpIHtcbiAgdmFyIGNoYW5nZXMgPSB7fTtcbiAgZm9yICh2YXIgcHJvcCBpbiBpbnN0YW5jZSkge1xuICAgIHZhciBkZWYgPSBkZWZhdWx0c1twcm9wXTtcbiAgICB2YXIgaW5zID0gaW5zdGFuY2VbcHJvcF07XG4gICAgLy8gTm90ZTogZG9lcyBub3QgcHJvcGVybHkgc3VidHJhY3QgYXJyYXlzXG4gICAgaWYgKCFkZWZhdWx0cyB8fCBkZWYgIT09IGlucykge1xuICAgICAgaWYgKHR5cGVvZiBpbnMgPT09ICdvYmplY3QnICYmICF1dGlsLmlzQXJyYXkoaW5zKSAmJiBkZWYpIHtcbiAgICAgICAgdmFyIGMgPSBzY2hlbWF1dGlsLnN1YnRyYWN0KGlucywgZGVmKTtcbiAgICAgICAgaWYgKCFpc0VtcHR5KGMpKVxuICAgICAgICAgIGNoYW5nZXNbcHJvcF0gPSBjO1xuICAgICAgfSBlbHNlIGlmICghdXRpbC5pc0FycmF5KGlucykgfHwgaW5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2hhbmdlc1twcm9wXSA9IGlucztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNoYW5nZXM7XG59O1xuXG5zY2hlbWF1dGlsLm1lcmdlID0gZnVuY3Rpb24oLypkZXN0Kiwgc3JjMCwgc3JjMSwgLi4uKi8pe1xuICB2YXIgZGVzdCA9IGFyZ3VtZW50c1swXTtcbiAgZm9yICh2YXIgaT0xIDsgaTxhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBkZXN0ID0gbWVyZ2UoZGVzdCwgYXJndW1lbnRzW2ldKTtcbiAgfVxuICByZXR1cm4gZGVzdDtcbn07XG5cbi8vIHJlY3Vyc2l2ZWx5IG1lcmdlcyBzcmMgaW50byBkZXN0XG5mdW5jdGlvbiBtZXJnZShkZXN0LCBzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgIT09ICdvYmplY3QnIHx8IHNyYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBkZXN0O1xuICB9XG5cbiAgZm9yICh2YXIgcCBpbiBzcmMpIHtcbiAgICBpZiAoIXNyYy5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzcmNbcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc3JjW3BdICE9PSAnb2JqZWN0JyB8fCBzcmNbcF0gPT09IG51bGwpIHtcbiAgICAgIGRlc3RbcF0gPSBzcmNbcF07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVzdFtwXSAhPT0gJ29iamVjdCcgfHwgZGVzdFtwXSA9PT0gbnVsbCkge1xuICAgICAgZGVzdFtwXSA9IG1lcmdlKHNyY1twXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgPyBbXSA6IHt9LCBzcmNbcF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXJnZShkZXN0W3BdLCBzcmNbcF0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVzdDtcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdkYXRhbGliL3NyYy91dGlsJyk7XG5cbnV0aWwuZXh0ZW5kKHV0aWwsIHJlcXVpcmUoJ2RhdGFsaWIvc3JjL2dlbmVyYXRlJykpO1xudXRpbC5leHRlbmQodXRpbCwgcmVxdWlyZSgnZGF0YWxpYi9zcmMvc3RhdHMnKSk7XG51dGlsLmV4dGVuZCh1dGlsLCByZXF1aXJlKCcuL2xvZ2dlcicpKCdbVkwgRXJyb3JdJykpO1xudXRpbC5iaW4gPSByZXF1aXJlKCdkYXRhbGliL3NyYy9iaW5zL2JpbnMnKTtcblxudXRpbC5pc2luID0gZnVuY3Rpb24oaXRlbSwgYXJyYXkpIHtcbiAgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSkgIT09IC0xO1xufTtcblxudXRpbC5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBmLCB0aGlzQXJnKSB7XG4gIGlmIChvYmouZm9yRWFjaCkge1xuICAgIG9iai5mb3JFYWNoLmNhbGwodGhpc0FyZywgZik7XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgIGYuY2FsbCh0aGlzQXJnLCBvYmpba10sIGsgLCBvYmopO1xuICAgIH1cbiAgfVxufTtcblxudXRpbC5yZWR1Y2UgPSBmdW5jdGlvbihvYmosIGYsIGluaXQsIHRoaXNBcmcpIHtcbiAgaWYgKG9iai5yZWR1Y2UpIHtcbiAgICByZXR1cm4gb2JqLnJlZHVjZS5jYWxsKHRoaXNBcmcsIGYsIGluaXQpO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICBpbml0ID0gZi5jYWxsKHRoaXNBcmcsIGluaXQsIG9ialtrXSwgaywgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIGluaXQ7XG4gIH1cbn07XG5cbnV0aWwubWFwID0gZnVuY3Rpb24ob2JqLCBmLCB0aGlzQXJnKSB7XG4gIGlmIChvYmoubWFwKSB7XG4gICAgcmV0dXJuIG9iai5tYXAuY2FsbCh0aGlzQXJnLCBmKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgIG91dHB1dC5wdXNoKCBmLmNhbGwodGhpc0FyZywgb2JqW2tdLCBrLCBvYmopKTtcbiAgICB9XG4gIH1cbn07XG5cbnV0aWwuYW55ID0gZnVuY3Rpb24oYXJyLCBmKSB7XG4gIHZhciBpID0gMCwgaztcbiAgZm9yIChrIGluIGFycikge1xuICAgIGlmIChmKGFycltrXSwgaywgaSsrKSkgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxudXRpbC5hbGwgPSBmdW5jdGlvbihhcnIsIGYpIHtcbiAgdmFyIGkgPSAwLCBrO1xuICBmb3IgKGsgaW4gYXJyKSB7XG4gICAgaWYgKCFmKGFycltrXSwgaywgaSsrKSkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxudXRpbC5nZXRiaW5zID0gZnVuY3Rpb24oc3RhdHMsIG1heGJpbnMpIHtcbiAgcmV0dXJuIHV0aWwuYmluKHtcbiAgICBtaW46IHN0YXRzLm1pbixcbiAgICBtYXg6IHN0YXRzLm1heCxcbiAgICBtYXhiaW5zOiBtYXhiaW5zXG4gIH0pO1xufTtcblxuLyoqXG4gKiB4W3BbMF1dLi4uW3Bbbl1dID0gdmFsXG4gKiBAcGFyYW0gbm9hdWdtZW50IGRldGVybWluZSB3aGV0aGVyIG5ldyBvYmplY3Qgc2hvdWxkIGJlIGFkZGVkIGZcbiAqIG9yIG5vbi1leGlzdGluZyBwcm9wZXJ0aWVzIGFsb25nIHRoZSBwYXRoXG4gKi9cbnV0aWwuc2V0dGVyID0gZnVuY3Rpb24oeCwgcCwgdmFsLCBub2F1Z21lbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPHAubGVuZ3RoLTE7ICsraSkge1xuICAgIGlmICghbm9hdWdtZW50ICYmICEocFtpXSBpbiB4KSl7XG4gICAgICB4ID0geFtwW2ldXSA9IHt9O1xuICAgIH0gZWxzZSB7XG4gICAgICB4ID0geFtwW2ldXTtcbiAgICB9XG4gIH1cbiAgeFtwW2ldXSA9IHZhbDtcbn07XG5cblxuLyoqXG4gKiByZXR1cm5zIHhbcFswXV0uLi5bcFtuXV1cbiAqIEBwYXJhbSBhdWdtZW50IGRldGVybWluZSB3aGV0aGVyIG5ldyBvYmplY3Qgc2hvdWxkIGJlIGFkZGVkIGZcbiAqIG9yIG5vbi1leGlzdGluZyBwcm9wZXJ0aWVzIGFsb25nIHRoZSBwYXRoXG4gKi9cbnV0aWwuZ2V0dGVyID0gZnVuY3Rpb24oeCwgcCwgbm9hdWdtZW50KSB7XG4gIGZvciAodmFyIGk9MDsgaTxwLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCFub2F1Z21lbnQgJiYgIShwW2ldIGluIHgpKXtcbiAgICAgIHggPSB4W3BbaV1dID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSB4W3BbaV1dO1xuICAgIH1cbiAgfVxuICByZXR1cm4geDtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9nbG9iYWxzJyk7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gICAgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKTtcblxudmFyIHZsID0ge307XG5cbnV0aWwuZXh0ZW5kKHZsLCBjb25zdHMsIHV0aWwpO1xuXG52bC5FbmNvZGluZyA9IHJlcXVpcmUoJy4vRW5jb2RpbmcnKTtcbnZsLmNvbXBpbGVyID0gcmVxdWlyZSgnLi9jb21waWxlci9jb21waWxlcicpO1xudmwuY29tcGlsZSA9IHZsLmNvbXBpbGVyLmNvbXBpbGU7XG52bC5kYXRhID0gcmVxdWlyZSgnLi9kYXRhJyk7XG52bC5lbmMgPSByZXF1aXJlKCcuL2VuYycpO1xudmwuZmllbGQgPSByZXF1aXJlKCcuL2ZpZWxkJyk7XG52bC5zY2hlbWEgPSByZXF1aXJlKCcuL3NjaGVtYS9zY2hlbWEnKTtcbnZsLnRvU2hvcnRoYW5kID0gdmwuRW5jb2Rpbmcuc2hvcnRoYW5kO1xudmwuZm9ybWF0ID0gcmVxdWlyZSgnZDMtZm9ybWF0JykuZm9ybWF0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZsOyJdfQ==
