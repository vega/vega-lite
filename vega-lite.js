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
      return fn.toUpperCase() + '(' + this._enc[et].name + ')';
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

  proto.cardinality = function(encType, stats) {
    return vlfield.cardinality(this.field(encType), stats, this.config('filterNull'));
  };

  proto.isRaw = function() {
    return !this.isAggregate();
  };

  proto.data = function(name) {
    return name ? this._data[name] : this._data;
  };

   // returns whether the encoding has values embedded
  proto.hasValues = function() {
    var vals = this.data('values');
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

},{"./consts":32,"./enc":34,"./field":35,"./globals":36,"./schema/schema":37,"./util":39}],15:[function(require,module,exports){
'use strict';

require('../globals');

var util = require('../util');

module.exports = aggregates;

function aggregates(dataTable, encoding, opt) {
  opt = opt || {};

  var dims = {}, meas = {}, detail = {}, facets = {};

  encoding.forEach(function(field, encType) {
    if (field.aggregate) {
      if (field.aggregate === 'count') {
        meas.count = {op: 'count', field: '*'};
      }else {
        meas[field.aggregate + '|'+ field.name] = {
          op: field.aggregate,
          field: encoding.fieldRef(encType, {nofn: true})
        };
      }
    } else {
      dims[field.name] = encoding.fieldRef(encType);
      if (encType == ROW || encType == COL) {
        facets[field.name] = dims[field.name];
      }else if (encType !== X && encType !== Y) {
        detail[field.name] = dims[field.name];
      }
    }
  });
  dims = util.vals(dims);
  meas = util.vals(meas);

  if (meas.length > 0) {
    if (!dataTable.transform) dataTable.transform = [];
    dataTable.transform.push({
      type: 'aggregate',
      groupby: dims,
      fields: meas
    });
  }
  return {
    details: util.vals(detail),
    dims: dims,
    facets: util.vals(facets),
    aggregated: meas.length > 0
  };
}

},{"../globals":36,"../util":39}],16:[function(require,module,exports){
'use strict';

require('../globals');

var util = require('../util'),
  setter = util.setter,
  getter = util.getter,
  time = require('./time');

var axis = module.exports = {};

axis.names = function(props) {
  return util.keys(util.keys(props).reduce(function(a, x) {
    var s = props[x].scale;
    if (s === X || s === Y) a[props[x].scale] = 1;
    return a;
  }, {}));
};

axis.defs = function(names, encoding, layout, stats, opt) {
  return names.reduce(function(a, name) {
    a.push(axis.def(name, encoding, layout, stats, opt));
    return a;
  }, []);
};

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

  // for x-axis, set ticks for Q or rotate scale for ordinal scale
  if (name == X) {
    if (encoding.isDimension(X) || encoding.isType(X, T)) {
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

},{"../globals":36,"../util":39,"./time":31}],17:[function(require,module,exports){
'use strict';

require('../globals');

module.exports = binning;

function binning(dataTable, encoding, opt) {
  opt = opt || {};

  if (!dataTable.transform) dataTable.transform = [];

  encoding.forEach(function(field, encType) {
    if (encoding.bin(encType)) {
      dataTable.transform.push({
        type: 'bin',
        field: encoding.fieldRef(encType, {nofn: true}),
        output: encoding.fieldRef(encType),
        maxbins: encoding.bin(encType).maxbins
      });
    }
  });

  return dataTable;
}

},{"../globals":36}],18:[function(require,module,exports){
'use strict';

var summary = module.exports = require('datalib/src/stats').summary;

require('../globals');

var compiler = module.exports = {};

var Encoding = require('../Encoding'),
  axis = compiler.axis = require('./axis'),
  filter = compiler.filter = require('./filter'),
  legend = compiler.legend = require('./legend'),
  marks = compiler.marks = require('./marks'),
  scale = compiler.scale = require('./scale');

compiler.aggregate = require('./aggregate');
compiler.bin = require('./bin');
compiler.facet = require('./facet');
compiler.group = require('./group');
compiler.layout = require('./layout');
compiler.sort = require('./sort');
compiler.stack = require('./stack');
compiler.style = require('./style');
compiler.subfacet = require('./subfacet');
compiler.template = require('./template');
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
    stats = summary(encoding.data('values')).reduce(function(s, p) {
      s[p.field] = p;
      return s;
    }, {});
  }

  var layout = compiler.layout(encoding, stats),
    spec = compiler.template(encoding, layout, stats);

  // .data related stuff
  var rawTable = spec.data[0],
    dataTable = spec.data[1];

  rawTable = filter.addFilters(rawTable, encoding); // modify rawTable
  spec = compiler.time(spec, encoding);              // modify rawTable, add scales
  dataTable = compiler.bin(dataTable, encoding);     // modify dataTable
  var aggResult = compiler.aggregate(dataTable, encoding); // modify dataTable
  var sorting = compiler.sort(spec.data, encoding, stats); // append new data

  // marks
  var style = compiler.style(encoding, stats),
    group = spec.marks[0],
    mark = marks[encoding.marktype()],
    mdefs = marks.def(mark, encoding, layout, style, stats),
    mdef = mdefs[0];  // TODO: remove this dirty hack by refactoring the whole flow

  for (var i = 0; i < mdefs.length; i++) {
    group.marks.push(mdefs[i]);
  }

  var lineType = marks[encoding.marktype()].line;

  // handle subfacets

  var details = aggResult.details,
    hasDetails = details && details.length > 0,
    stack = hasDetails && compiler.stack(spec.data, encoding, mdef, aggResult.facets); // modify spec.data, mdef.{from,properties}

  if (hasDetails && (stack || lineType)) {
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

  // Small Multiples
  if (encoding.has(ROW) || encoding.has(COL)) {
    spec = compiler.facet(group, encoding, layout, style, sorting, spec, mdef, stack, stats);
    spec.legends = legend.defs(encoding);
  } else {
    group.scales = scale.defs(scale.names(mdef.properties.update), encoding, layout, stats, style, sorting, {stack: stack});
    group.axes = axis.defs(axis.names(mdef.properties.update), encoding, layout, stats);
    group.legends = legend.defs(encoding);
  }

  filter.filterLessThanZero(dataTable, encoding);

  return spec;
};


},{"../Encoding":14,"../globals":36,"./aggregate":15,"./axis":16,"./bin":17,"./facet":19,"./filter":20,"./group":21,"./layout":22,"./legend":23,"./marks":24,"./scale":25,"./sort":26,"./stack":27,"./style":28,"./subfacet":29,"./template":30,"./time":31,"datalib/src/stats":11}],19:[function(require,module,exports){
'use strict';

require('../globals');

var util = require('../util');

var axis = require('./axis'),
  groupdef = require('./group').def,
  scale = require('./scale');

module.exports = faceting;

function faceting(group, encoding, layout, style, sorting, spec, mdef, stack, stats) {
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
        axes: encoding.has(X) ? axis.defs(['x'], encoding, layout, stats) : undefined,
        x: hasCol ? {scale: COL, field: 'keys.0'} : {value: 0},
        width: hasCol && {'value': layout.cellWidth}, //HACK?
        from: from
      });

    spec.marks.unshift(axesGrp); // need to prepend so it appears under the plots
    (spec.axes = spec.axes || []);
    spec.axes.push.apply(spec.axes, axis.defs(['row'], encoding, layout, stats));
  } else { // doesn't have row
    if (encoding.has(X)) {
      //keep x axis in the cell
      cellAxes.push.apply(cellAxes, axis.defs(['x'], encoding, layout, stats));
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
      axes: encoding.has(Y) ? axis.defs(['y'], encoding, layout, stats) : undefined,
      y: hasRow && {scale: ROW, field: 'keys.0'},
      x: hasRow && {value: 0},
      height: hasRow && {'value': layout.cellHeight}, //HACK?
      from: from
    });

    spec.marks.unshift(axesGrp); // need to prepend so it appears under the plots
    (spec.axes = spec.axes || []);
    spec.axes.push.apply(spec.axes, axis.defs(['col'], encoding, layout, stats));
  } else { // doesn't have col
    if (encoding.has(Y)) {
      cellAxes.push.apply(cellAxes, axis.defs(['y'], encoding, layout, stats));
    }
  }

  // assuming equal cellWidth here
  // TODO: support heterogenous cellWidth (maybe by using multiple scales?)
  spec.scales = (spec.scales || []).concat(scale.defs(
    scale.names(enter).concat(scale.names(mdef.properties.update)),
    encoding,
    layout,
    stats,
    style,
    sorting,
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

},{"../globals":36,"../util":39,"./axis":16,"./group":21,"./scale":25}],20:[function(require,module,exports){
'use strict';

require('../globals');

var filter = module.exports = {};

var BINARY = {
  '>':  true,
  '>=': true,
  '=':  true,
  '!=': true,
  '<':  true,
  '<=': true
};

filter.addFilters = function(rawTable, encoding) {
  var filters = encoding.filter();  // apply filters to raw data before aggregation

  if (!rawTable.transform)
    rawTable.transform = [];

  // add custom filters
  for (var i=0, l=filters.length; i<l; i++) {
    var filter = filters[i];

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
      condition = d + op1 + operator + op2;
    } else if (operator === 'notNull') {
      // expects a number of fields
      for (var j=0; j<operands.length; j++) {
        condition += d + operands[j] + '!==null';
        if (j < operands.length - 1) {
          condition += ' && ';
        }
      }
    } else {
      console.warn('Unsupported operator: ', operator);
    }

    rawTable.transform.push({
      type: 'filter',
      test: condition
    });
  }

  return rawTable;
};

// remove less than 0 values if we use log function
filter.filterLessThanZero = function(dataTable, encoding) {
  encoding.forEach(function(field, encType) {
    if (encoding.scale(encType).type === 'log') {
      dataTable.transform.push({
        type: 'filter',
        test: 'd.' + encoding.fieldRef(encType) + '>0'
      });
    }
  });
};

},{"../globals":36}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{"../globals":36,"../util":39,"./time":31,"d3-format":5}],23:[function(require,module,exports){
'use strict';

require('../globals');

var time = require('./time');

var legend = module.exports = {};

legend.defs = function(encoding) {
  var defs = [];
  // TODO: support alpha

  if (encoding.has(COLOR) && encoding.field(COLOR).legend) {
    defs.push(legend.def(COLOR, encoding, {
      fill: COLOR,
      orient: 'right'
    }));
  }

  if (encoding.has(SIZE) && encoding.field(SIZE).legend) {
    defs.push(legend.def(SIZE, encoding, {
      size: SIZE,
      orient: defs.length === 1 ? 'left' : 'right'
    }));
  }

  if (encoding.has(SHAPE) && encoding.field(SHAPE).legend) {
    if (defs.length === 2) {
      // TODO: fix this
      console.error('Vega-lite currently only supports two legends');
      return defs;
    }
    defs.push(legend.def(SHAPE, encoding, {
      shape: SHAPE,
      orient: defs.length === 1 ? 'left' : 'right'
    }));
  }

  return defs;
};

legend.def = function(name, encoding, props) {
  var def = props,
    timeUnit = encoding.field(name).timeUnit;

  def.title = encoding.fieldTitle(name);

  if (encoding.isType(name, T) &&
    timeUnit &&
    time.hasScale(timeUnit)
  ) {
    var properties = def.properties = def.properties || {},
      labels = properties.labels = properties.labels || {},
      text = labels.text = labels.text || {};

    text.scale = 'time-'+ timeUnit;
  }

  return def;
};

},{"../globals":36,"./time":31}],24:[function(require,module,exports){
'use strict';

require('../globals');

var marks = module.exports = {};

marks.def = function(mark, encoding, layout, style, stats) {
  var defs = [];

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
      from: {data: TABLE},
      properties: {enter: bg, update: bg}
    });
  }

  // add the mark def for the main thing
  var p = mark.prop(encoding, layout, style, stats);
  defs.push({
    type: mark.type,
    from: {data: TABLE},
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

  // stroke
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
  var opacity = e.field(COLOR).opacity  || style.opacity;
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
  p.fill = {value: field.text.color};

  var opacity = e.field(COLOR).opacity  || style.opacity;
  if(opacity) p.opacity = {value: opacity};

  // text
  if (e.has(TEXT)) {
    if (e.isType(TEXT, Q)) {
      var fieldStats = stats[e.fieldName(name)],
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

},{"../globals":36}],25:[function(require,module,exports){
'use strict';
require('../globals');
var util = require('../util'),
  time = require('./time'),
  colorbrewer = require('colorbrewer'),
  interpolateLab = require('d3-color').interpolateLab,
  schema = require('../schema/schema');

var scale = module.exports = {};

scale.names = function(props) {
  return util.keys(util.keys(props).reduce(function(a, x) {
    if (props[x] && props[x].scale) a[props[x].scale] = 1;
    return a;
  }, {}));
};

scale.defs = function(names, encoding, layout, stats, style, sorting, opt) {
  opt = opt || {};

  return names.reduce(function(a, name) {
    var s = {
      name: name,
      type: scale.type(name, encoding),
      domain: scale.domain(name, encoding, stats, sorting, opt)
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

scale.domain = function (name, encoding, stats, sorting, opt) {
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

  if ( useRawDomain && notCountOrSum && (
      // Q always uses non-ordinal scale except when it's binned and thus uses ordinal scale.
      (encoding.isType(name, Q) && !field.bin) ||
      // T uses non-ordinal scale when there's no unit or when the unit is not ordinal.
      (encoding.isType(name, T) && (!timeUnit || !time.isOrdinalFn(timeUnit)))
    )
  ) {
    return {data: RAW, field: encoding.fieldRef(name, {nofn: !timeUnit})};
  }

  return {data: sorting.getDataset(name), field: encoding.fieldRef(name)};
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
      break;
    default:
      throw new Error('Unknown encoding name: '+ s.name);
  }

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
    var ordinalPalette = colorScale.ordinalPalette;
    if (s.type === 'ordinal') {
      if (type === N) {
        // use categorical color scale
        if (cardinality <= 10) {
          range = colorScale.c10palette;
        } else {
          range = colorScale.c20palette;
        }
      } else {
        if (cardinality <= 2) {
          range = [colorbrewer[ordinalPalette][3][0], colorbrewer[ordinalPalette][3][2]];
        } else {
          range = ordinalPalette;
        }
      }
    } else { //time or quantitative
      var palette = colorbrewer[ordinalPalette][9];
      range = [palette[0], palette[8]];
      s.zero = false;
    }
  }
  return scale.color.palette(range, cardinality, type);
};

scale.color.palette = function(range, cardinality, type) {
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

  if (range in colorbrewer) {
    var palette = colorbrewer[range],
      ps = 5;

    // if cardinality pre-defined, use it.
    if (cardinality in palette) return palette[cardinality];

    // if not, use the highest cardinality one for nominal
    if (type === N) {
      return palette[Math.max.apply(null, util.keys(palette))];
    }

    // otherwise, interpolate
    return scale.color.interpolate(palette[ps][0], palette[ps][ps-1], cardinality);
  }

  return range;
};

scale.color.interpolate = function (start, end, cardinality) {
  var interpolator = interpolateLab(start, end);
  return util.range(cardinality).map(function(i) { return interpolator(i*1.0/(cardinality-1)); });
};

},{"../globals":36,"../schema/schema":37,"../util":39,"./time":31,"colorbrewer":3,"d3-color":4}],26:[function(require,module,exports){
'use strict';

require('../globals');

var vlfield = require('../field');

module.exports = addSortTransforms;

// adds new transforms that produce sorted fields
function addSortTransforms(data, encoding, stats, opt) {
  // jshint unused:false

  var datasetMapping = {};
  var counter = 0;

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

      var dataName = 'sorted' + counter++;

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

  return {
    getDataset: function(encType) {
      var data = datasetMapping[encType];
      if (!data) {
        return TABLE;
      }
      return data;
    }
  };
}


},{"../field":35,"../globals":36}],27:[function(require,module,exports){
'use strict';

require('../globals');

var  marks = require('./marks');

module.exports = stacking;

function stacking(data, encoding, mdef, facets) {
  if (!marks[encoding.marktype()].stack) return false;

  // TODO: add || encoding.has(LOD) here once LOD is implemented
  if (!encoding.has(COLOR)) return false;

  var dim=null, val=null, idx =null,
    isXMeasure = encoding.isMeasure(X),
    isYMeasure = encoding.isMeasure(Y);

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
    source: TABLE,
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

},{"../globals":36,"./marks":24}],28:[function(require,module,exports){
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


},{"../field":35,"../globals":36}],29:[function(require,module,exports){
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

},{"../globals":36,"./group":21}],30:[function(require,module,exports){
'use strict';

require('../globals');

var groupdef = require('./group').def,
  vlfield = require('../field');

module.exports = template;

function template(encoding, layout, stats) {
  // jshint unused:false

  var data = {name: RAW, format: {}},
    table = {name: TABLE, source: RAW},
    dataUrl = encoding.data('url'),
    dataType = encoding.data('formatType'),
    values = encoding.data('values');

  if (encoding.hasValues()) {
    data.values = values;
  } else {
    data.url = dataUrl;
    data.format.type = dataType;
  }

  encoding.forEach(function(field, encType) {
    var name;
    if (field.type == T) {
      data.format.parse = data.format.parse || {};
      data.format.parse[field.name] = 'date';
    } else if (field.type == Q) {
      data.format.parse = data.format.parse || {};
      if (vlfield.isCount(field)) {
        name = 'count';
      } else {
        name = field.name;
      }
      data.format.parse[name] = 'number';
    }
  });

  return {
    width: layout.width,
    height: layout.height,
    padding: 'auto',
    data: [data, table],
    marks: [groupdef('cell', {
      width: layout.cellWidth ? {value: layout.cellWidth} : undefined,
      height: layout.cellHeight ? {value: layout.cellHeight} : undefined
    })]
  };
}

},{"../field":35,"../globals":36,"./group":21}],31:[function(require,module,exports){
'use strict';

var util = require('../util'),
  d3_time_format = require('d3-time-format');

module.exports = time;

var LONG_DATE = new Date(2014, 8, 17);

function time(spec, encoding) { // FIXME refactor to reduce side effect #276
  // jshint unused:false
  var timeFields = {}, timeUnits = {};

  // find unique formula transformation and bin function
  encoding.forEach(function(field, encType) {
    if (field.type === T && field.timeUnit) {
      timeFields[encoding.fieldRef(encType)] = {
        field: field,
        encType: encType
      };
      timeUnits[field.timeUnit] = true;
    }
  });

  // add formula transform
  var data = spec.data[0],
    transform = data.transform = data.transform || [];

  for (var f in timeFields) {
    var tf = timeFields[f];
    time.transform(transform, encoding, tf.encType, tf.field);
  }

  // add scales
  var scales = spec.scales = spec.scales || [];
  for (var timeUnit in timeUnits) {
    var scale = time.scale.def(timeUnit, encoding);
    if (scale) scales.push(scale);
  }
  return spec;
}

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

function fieldFn(func, field) {
  return 'utc' + func + '(d.data.'+ field.name +')';
}

/**
 * @return {String} date binning formula of the given field
 */
time.formula = function(field) {
  return fieldFn(field.timeUnit, field);
};

/** add formula transforms to data */
time.transform = function(transform, encoding, encType, field) {
  transform.push({
    type: 'formula',
    field: encoding.fieldRef(encType),
    expr: time.formula(field)
  });
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

},{"../util":39,"d3-time-format":6}],32:[function(require,module,exports){
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

},{"./globals":36}],33:[function(require,module,exports){
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
},{"./globals":36,"datalib/src/stats":11}],34:[function(require,module,exports){
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
},{"./consts":32,"./field":35,"./schema/schema":37,"./util":39}],35:[function(require,module,exports){
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
 *   opt.fn - replace fn with custom function prefix
 *   opt.prefn - prepend fn with custom function prefix

 * @return {[type]}       [description]
 */
vlfield.fieldRef = function(field, opt) {
  opt = opt || {};

  var f = (opt.data ? 'data.' : '') + (opt.prefn || ''),
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

},{"./compiler/time":31,"./consts":32,"./globals":36,"./schema/schema":37,"./util":39}],36:[function(require,module,exports){
(function (global){
'use strict';

// declare global constant
var g = global || window;

g.TABLE = 'table';
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

},{}],37:[function(require,module,exports){
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
        ticks :{
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
        }
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
      type: 'boolean',
      default: true
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
          default: 'BuGn',
          enum: util.keys(colorbrewer)
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

},{"../globals":36,"../util":39,"./schemautil":38,"colorbrewer":3}],38:[function(require,module,exports){
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
},{"../util":39}],39:[function(require,module,exports){
'use strict';

var util = module.exports = require('datalib/src/util');

util.extend(util, require('datalib/src/generate'));
util.extend(util, require('datalib/src/stats'));
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

util.error = function(msg) {
  console.error('[VL Error]', msg);
};


},{"datalib/src/bins/bins":8,"datalib/src/generate":9,"datalib/src/stats":11,"datalib/src/util":13}],40:[function(require,module,exports){
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

module.exports = vl;
},{"./Encoding":14,"./compiler/compiler":18,"./consts":32,"./data":33,"./enc":34,"./field":35,"./globals":36,"./schema/schema":37,"./util":39}]},{},[40])(40)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2NvbG9yYnJld2VyL2NvbG9yYnJld2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvbG9yYnJld2VyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2QzLWNvbG9yL2J1aWxkL2NvbG9yLmpzIiwibm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9idWlsZC9mb3JtYXQuanMiLCJub2RlX21vZHVsZXMvZDMtdGltZS1mb3JtYXQvYnVpbGQvdGltZUZvcm1hdC5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL25vZGVfbW9kdWxlcy9kMy10aW1lL2J1aWxkL3RpbWUuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvYmlucy9iaW5zLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL2dlbmVyYXRlLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL2ltcG9ydC90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL3N0YXRzLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL3RpbWUuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvdXRpbC5qcyIsInNyYy9FbmNvZGluZy5qcyIsInNyYy9jb21waWxlci9hZ2dyZWdhdGUuanMiLCJzcmMvY29tcGlsZXIvYXhpcy5qcyIsInNyYy9jb21waWxlci9iaW4uanMiLCJzcmMvY29tcGlsZXIvY29tcGlsZXIuanMiLCJzcmMvY29tcGlsZXIvZmFjZXQuanMiLCJzcmMvY29tcGlsZXIvZmlsdGVyLmpzIiwic3JjL2NvbXBpbGVyL2dyb3VwLmpzIiwic3JjL2NvbXBpbGVyL2xheW91dC5qcyIsInNyYy9jb21waWxlci9sZWdlbmQuanMiLCJzcmMvY29tcGlsZXIvbWFya3MuanMiLCJzcmMvY29tcGlsZXIvc2NhbGUuanMiLCJzcmMvY29tcGlsZXIvc29ydC5qcyIsInNyYy9jb21waWxlci9zdGFjay5qcyIsInNyYy9jb21waWxlci9zdHlsZS5qcyIsInNyYy9jb21waWxlci9zdWJmYWNldC5qcyIsInNyYy9jb21waWxlci90ZW1wbGF0ZS5qcyIsInNyYy9jb21waWxlci90aW1lLmpzIiwic3JjL2NvbnN0cy5qcyIsInNyYy9kYXRhLmpzIiwic3JjL2VuYy5qcyIsInNyYy9maWVsZC5qcyIsInNyYy9nbG9iYWxzLmpzIiwic3JjL3NjaGVtYS9zY2hlbWEuanMiLCJzcmMvc2NoZW1hL3NjaGVtYXV0aWwuanMiLCJzcmMvdXRpbC5qcyIsInNyYy92bCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNUQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25zQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN3VCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIixudWxsLCIvLyBUaGlzIHByb2R1Y3QgaW5jbHVkZXMgY29sb3Igc3BlY2lmaWNhdGlvbnMgYW5kIGRlc2lnbnMgZGV2ZWxvcGVkIGJ5IEN5bnRoaWEgQnJld2VyIChodHRwOi8vY29sb3JicmV3ZXIub3JnLykuXG4vLyBKYXZhU2NyaXB0IHNwZWNzIGFzIHBhY2thZ2VkIGluIHRoZSBEMyBsaWJyYXJ5IChkM2pzLm9yZykuIFBsZWFzZSBzZWUgbGljZW5zZSBhdCBodHRwOi8vY29sb3JicmV3ZXIub3JnL2V4cG9ydC9MSUNFTlNFLnR4dFxuIWZ1bmN0aW9uKCkge1xuXG52YXIgY29sb3JicmV3ZXIgPSB7WWxHbjoge1xuMzogW1wiI2Y3ZmNiOVwiLFwiI2FkZGQ4ZVwiLFwiIzMxYTM1NFwiXSxcbjQ6IFtcIiNmZmZmY2NcIixcIiNjMmU2OTlcIixcIiM3OGM2NzlcIixcIiMyMzg0NDNcIl0sXG41OiBbXCIjZmZmZmNjXCIsXCIjYzJlNjk5XCIsXCIjNzhjNjc5XCIsXCIjMzFhMzU0XCIsXCIjMDA2ODM3XCJdLFxuNjogW1wiI2ZmZmZjY1wiLFwiI2Q5ZjBhM1wiLFwiI2FkZGQ4ZVwiLFwiIzc4YzY3OVwiLFwiIzMxYTM1NFwiLFwiIzAwNjgzN1wiXSxcbjc6IFtcIiNmZmZmY2NcIixcIiNkOWYwYTNcIixcIiNhZGRkOGVcIixcIiM3OGM2NzlcIixcIiM0MWFiNWRcIixcIiMyMzg0NDNcIixcIiMwMDVhMzJcIl0sXG44OiBbXCIjZmZmZmU1XCIsXCIjZjdmY2I5XCIsXCIjZDlmMGEzXCIsXCIjYWRkZDhlXCIsXCIjNzhjNjc5XCIsXCIjNDFhYjVkXCIsXCIjMjM4NDQzXCIsXCIjMDA1YTMyXCJdLFxuOTogW1wiI2ZmZmZlNVwiLFwiI2Y3ZmNiOVwiLFwiI2Q5ZjBhM1wiLFwiI2FkZGQ4ZVwiLFwiIzc4YzY3OVwiLFwiIzQxYWI1ZFwiLFwiIzIzODQ0M1wiLFwiIzAwNjgzN1wiLFwiIzAwNDUyOVwiXVxufSxZbEduQnU6IHtcbjM6IFtcIiNlZGY4YjFcIixcIiM3ZmNkYmJcIixcIiMyYzdmYjhcIl0sXG40OiBbXCIjZmZmZmNjXCIsXCIjYTFkYWI0XCIsXCIjNDFiNmM0XCIsXCIjMjI1ZWE4XCJdLFxuNTogW1wiI2ZmZmZjY1wiLFwiI2ExZGFiNFwiLFwiIzQxYjZjNFwiLFwiIzJjN2ZiOFwiLFwiIzI1MzQ5NFwiXSxcbjY6IFtcIiNmZmZmY2NcIixcIiNjN2U5YjRcIixcIiM3ZmNkYmJcIixcIiM0MWI2YzRcIixcIiMyYzdmYjhcIixcIiMyNTM0OTRcIl0sXG43OiBbXCIjZmZmZmNjXCIsXCIjYzdlOWI0XCIsXCIjN2ZjZGJiXCIsXCIjNDFiNmM0XCIsXCIjMWQ5MWMwXCIsXCIjMjI1ZWE4XCIsXCIjMGMyYzg0XCJdLFxuODogW1wiI2ZmZmZkOVwiLFwiI2VkZjhiMVwiLFwiI2M3ZTliNFwiLFwiIzdmY2RiYlwiLFwiIzQxYjZjNFwiLFwiIzFkOTFjMFwiLFwiIzIyNWVhOFwiLFwiIzBjMmM4NFwiXSxcbjk6IFtcIiNmZmZmZDlcIixcIiNlZGY4YjFcIixcIiNjN2U5YjRcIixcIiM3ZmNkYmJcIixcIiM0MWI2YzRcIixcIiMxZDkxYzBcIixcIiMyMjVlYThcIixcIiMyNTM0OTRcIixcIiMwODFkNThcIl1cbn0sR25CdToge1xuMzogW1wiI2UwZjNkYlwiLFwiI2E4ZGRiNVwiLFwiIzQzYTJjYVwiXSxcbjQ6IFtcIiNmMGY5ZThcIixcIiNiYWU0YmNcIixcIiM3YmNjYzRcIixcIiMyYjhjYmVcIl0sXG41OiBbXCIjZjBmOWU4XCIsXCIjYmFlNGJjXCIsXCIjN2JjY2M0XCIsXCIjNDNhMmNhXCIsXCIjMDg2OGFjXCJdLFxuNjogW1wiI2YwZjllOFwiLFwiI2NjZWJjNVwiLFwiI2E4ZGRiNVwiLFwiIzdiY2NjNFwiLFwiIzQzYTJjYVwiLFwiIzA4NjhhY1wiXSxcbjc6IFtcIiNmMGY5ZThcIixcIiNjY2ViYzVcIixcIiNhOGRkYjVcIixcIiM3YmNjYzRcIixcIiM0ZWIzZDNcIixcIiMyYjhjYmVcIixcIiMwODU4OWVcIl0sXG44OiBbXCIjZjdmY2YwXCIsXCIjZTBmM2RiXCIsXCIjY2NlYmM1XCIsXCIjYThkZGI1XCIsXCIjN2JjY2M0XCIsXCIjNGViM2QzXCIsXCIjMmI4Y2JlXCIsXCIjMDg1ODllXCJdLFxuOTogW1wiI2Y3ZmNmMFwiLFwiI2UwZjNkYlwiLFwiI2NjZWJjNVwiLFwiI2E4ZGRiNVwiLFwiIzdiY2NjNFwiLFwiIzRlYjNkM1wiLFwiIzJiOGNiZVwiLFwiIzA4NjhhY1wiLFwiIzA4NDA4MVwiXVxufSxCdUduOiB7XG4zOiBbXCIjZTVmNWY5XCIsXCIjOTlkOGM5XCIsXCIjMmNhMjVmXCJdLFxuNDogW1wiI2VkZjhmYlwiLFwiI2IyZTJlMlwiLFwiIzY2YzJhNFwiLFwiIzIzOGI0NVwiXSxcbjU6IFtcIiNlZGY4ZmJcIixcIiNiMmUyZTJcIixcIiM2NmMyYTRcIixcIiMyY2EyNWZcIixcIiMwMDZkMmNcIl0sXG42OiBbXCIjZWRmOGZiXCIsXCIjY2NlY2U2XCIsXCIjOTlkOGM5XCIsXCIjNjZjMmE0XCIsXCIjMmNhMjVmXCIsXCIjMDA2ZDJjXCJdLFxuNzogW1wiI2VkZjhmYlwiLFwiI2NjZWNlNlwiLFwiIzk5ZDhjOVwiLFwiIzY2YzJhNFwiLFwiIzQxYWU3NlwiLFwiIzIzOGI0NVwiLFwiIzAwNTgyNFwiXSxcbjg6IFtcIiNmN2ZjZmRcIixcIiNlNWY1ZjlcIixcIiNjY2VjZTZcIixcIiM5OWQ4YzlcIixcIiM2NmMyYTRcIixcIiM0MWFlNzZcIixcIiMyMzhiNDVcIixcIiMwMDU4MjRcIl0sXG45OiBbXCIjZjdmY2ZkXCIsXCIjZTVmNWY5XCIsXCIjY2NlY2U2XCIsXCIjOTlkOGM5XCIsXCIjNjZjMmE0XCIsXCIjNDFhZTc2XCIsXCIjMjM4YjQ1XCIsXCIjMDA2ZDJjXCIsXCIjMDA0NDFiXCJdXG59LFB1QnVHbjoge1xuMzogW1wiI2VjZTJmMFwiLFwiI2E2YmRkYlwiLFwiIzFjOTA5OVwiXSxcbjQ6IFtcIiNmNmVmZjdcIixcIiNiZGM5ZTFcIixcIiM2N2E5Y2ZcIixcIiMwMjgxOGFcIl0sXG41OiBbXCIjZjZlZmY3XCIsXCIjYmRjOWUxXCIsXCIjNjdhOWNmXCIsXCIjMWM5MDk5XCIsXCIjMDE2YzU5XCJdLFxuNjogW1wiI2Y2ZWZmN1wiLFwiI2QwZDFlNlwiLFwiI2E2YmRkYlwiLFwiIzY3YTljZlwiLFwiIzFjOTA5OVwiLFwiIzAxNmM1OVwiXSxcbjc6IFtcIiNmNmVmZjdcIixcIiNkMGQxZTZcIixcIiNhNmJkZGJcIixcIiM2N2E5Y2ZcIixcIiMzNjkwYzBcIixcIiMwMjgxOGFcIixcIiMwMTY0NTBcIl0sXG44OiBbXCIjZmZmN2ZiXCIsXCIjZWNlMmYwXCIsXCIjZDBkMWU2XCIsXCIjYTZiZGRiXCIsXCIjNjdhOWNmXCIsXCIjMzY5MGMwXCIsXCIjMDI4MThhXCIsXCIjMDE2NDUwXCJdLFxuOTogW1wiI2ZmZjdmYlwiLFwiI2VjZTJmMFwiLFwiI2QwZDFlNlwiLFwiI2E2YmRkYlwiLFwiIzY3YTljZlwiLFwiIzM2OTBjMFwiLFwiIzAyODE4YVwiLFwiIzAxNmM1OVwiLFwiIzAxNDYzNlwiXVxufSxQdUJ1OiB7XG4zOiBbXCIjZWNlN2YyXCIsXCIjYTZiZGRiXCIsXCIjMmI4Y2JlXCJdLFxuNDogW1wiI2YxZWVmNlwiLFwiI2JkYzllMVwiLFwiIzc0YTljZlwiLFwiIzA1NzBiMFwiXSxcbjU6IFtcIiNmMWVlZjZcIixcIiNiZGM5ZTFcIixcIiM3NGE5Y2ZcIixcIiMyYjhjYmVcIixcIiMwNDVhOGRcIl0sXG42OiBbXCIjZjFlZWY2XCIsXCIjZDBkMWU2XCIsXCIjYTZiZGRiXCIsXCIjNzRhOWNmXCIsXCIjMmI4Y2JlXCIsXCIjMDQ1YThkXCJdLFxuNzogW1wiI2YxZWVmNlwiLFwiI2QwZDFlNlwiLFwiI2E2YmRkYlwiLFwiIzc0YTljZlwiLFwiIzM2OTBjMFwiLFwiIzA1NzBiMFwiLFwiIzAzNGU3YlwiXSxcbjg6IFtcIiNmZmY3ZmJcIixcIiNlY2U3ZjJcIixcIiNkMGQxZTZcIixcIiNhNmJkZGJcIixcIiM3NGE5Y2ZcIixcIiMzNjkwYzBcIixcIiMwNTcwYjBcIixcIiMwMzRlN2JcIl0sXG45OiBbXCIjZmZmN2ZiXCIsXCIjZWNlN2YyXCIsXCIjZDBkMWU2XCIsXCIjYTZiZGRiXCIsXCIjNzRhOWNmXCIsXCIjMzY5MGMwXCIsXCIjMDU3MGIwXCIsXCIjMDQ1YThkXCIsXCIjMDIzODU4XCJdXG59LEJ1UHU6IHtcbjM6IFtcIiNlMGVjZjRcIixcIiM5ZWJjZGFcIixcIiM4ODU2YTdcIl0sXG40OiBbXCIjZWRmOGZiXCIsXCIjYjNjZGUzXCIsXCIjOGM5NmM2XCIsXCIjODg0MTlkXCJdLFxuNTogW1wiI2VkZjhmYlwiLFwiI2IzY2RlM1wiLFwiIzhjOTZjNlwiLFwiIzg4NTZhN1wiLFwiIzgxMGY3Y1wiXSxcbjY6IFtcIiNlZGY4ZmJcIixcIiNiZmQzZTZcIixcIiM5ZWJjZGFcIixcIiM4Yzk2YzZcIixcIiM4ODU2YTdcIixcIiM4MTBmN2NcIl0sXG43OiBbXCIjZWRmOGZiXCIsXCIjYmZkM2U2XCIsXCIjOWViY2RhXCIsXCIjOGM5NmM2XCIsXCIjOGM2YmIxXCIsXCIjODg0MTlkXCIsXCIjNmUwMTZiXCJdLFxuODogW1wiI2Y3ZmNmZFwiLFwiI2UwZWNmNFwiLFwiI2JmZDNlNlwiLFwiIzllYmNkYVwiLFwiIzhjOTZjNlwiLFwiIzhjNmJiMVwiLFwiIzg4NDE5ZFwiLFwiIzZlMDE2YlwiXSxcbjk6IFtcIiNmN2ZjZmRcIixcIiNlMGVjZjRcIixcIiNiZmQzZTZcIixcIiM5ZWJjZGFcIixcIiM4Yzk2YzZcIixcIiM4YzZiYjFcIixcIiM4ODQxOWRcIixcIiM4MTBmN2NcIixcIiM0ZDAwNGJcIl1cbn0sUmRQdToge1xuMzogW1wiI2ZkZTBkZFwiLFwiI2ZhOWZiNVwiLFwiI2M1MWI4YVwiXSxcbjQ6IFtcIiNmZWViZTJcIixcIiNmYmI0YjlcIixcIiNmNzY4YTFcIixcIiNhZTAxN2VcIl0sXG41OiBbXCIjZmVlYmUyXCIsXCIjZmJiNGI5XCIsXCIjZjc2OGExXCIsXCIjYzUxYjhhXCIsXCIjN2EwMTc3XCJdLFxuNjogW1wiI2ZlZWJlMlwiLFwiI2ZjYzVjMFwiLFwiI2ZhOWZiNVwiLFwiI2Y3NjhhMVwiLFwiI2M1MWI4YVwiLFwiIzdhMDE3N1wiXSxcbjc6IFtcIiNmZWViZTJcIixcIiNmY2M1YzBcIixcIiNmYTlmYjVcIixcIiNmNzY4YTFcIixcIiNkZDM0OTdcIixcIiNhZTAxN2VcIixcIiM3YTAxNzdcIl0sXG44OiBbXCIjZmZmN2YzXCIsXCIjZmRlMGRkXCIsXCIjZmNjNWMwXCIsXCIjZmE5ZmI1XCIsXCIjZjc2OGExXCIsXCIjZGQzNDk3XCIsXCIjYWUwMTdlXCIsXCIjN2EwMTc3XCJdLFxuOTogW1wiI2ZmZjdmM1wiLFwiI2ZkZTBkZFwiLFwiI2ZjYzVjMFwiLFwiI2ZhOWZiNVwiLFwiI2Y3NjhhMVwiLFwiI2RkMzQ5N1wiLFwiI2FlMDE3ZVwiLFwiIzdhMDE3N1wiLFwiIzQ5MDA2YVwiXVxufSxQdVJkOiB7XG4zOiBbXCIjZTdlMWVmXCIsXCIjYzk5NGM3XCIsXCIjZGQxYzc3XCJdLFxuNDogW1wiI2YxZWVmNlwiLFwiI2Q3YjVkOFwiLFwiI2RmNjViMFwiLFwiI2NlMTI1NlwiXSxcbjU6IFtcIiNmMWVlZjZcIixcIiNkN2I1ZDhcIixcIiNkZjY1YjBcIixcIiNkZDFjNzdcIixcIiM5ODAwNDNcIl0sXG42OiBbXCIjZjFlZWY2XCIsXCIjZDRiOWRhXCIsXCIjYzk5NGM3XCIsXCIjZGY2NWIwXCIsXCIjZGQxYzc3XCIsXCIjOTgwMDQzXCJdLFxuNzogW1wiI2YxZWVmNlwiLFwiI2Q0YjlkYVwiLFwiI2M5OTRjN1wiLFwiI2RmNjViMFwiLFwiI2U3Mjk4YVwiLFwiI2NlMTI1NlwiLFwiIzkxMDAzZlwiXSxcbjg6IFtcIiNmN2Y0ZjlcIixcIiNlN2UxZWZcIixcIiNkNGI5ZGFcIixcIiNjOTk0YzdcIixcIiNkZjY1YjBcIixcIiNlNzI5OGFcIixcIiNjZTEyNTZcIixcIiM5MTAwM2ZcIl0sXG45OiBbXCIjZjdmNGY5XCIsXCIjZTdlMWVmXCIsXCIjZDRiOWRhXCIsXCIjYzk5NGM3XCIsXCIjZGY2NWIwXCIsXCIjZTcyOThhXCIsXCIjY2UxMjU2XCIsXCIjOTgwMDQzXCIsXCIjNjcwMDFmXCJdXG59LE9yUmQ6IHtcbjM6IFtcIiNmZWU4YzhcIixcIiNmZGJiODRcIixcIiNlMzRhMzNcIl0sXG40OiBbXCIjZmVmMGQ5XCIsXCIjZmRjYzhhXCIsXCIjZmM4ZDU5XCIsXCIjZDczMDFmXCJdLFxuNTogW1wiI2ZlZjBkOVwiLFwiI2ZkY2M4YVwiLFwiI2ZjOGQ1OVwiLFwiI2UzNGEzM1wiLFwiI2IzMDAwMFwiXSxcbjY6IFtcIiNmZWYwZDlcIixcIiNmZGQ0OWVcIixcIiNmZGJiODRcIixcIiNmYzhkNTlcIixcIiNlMzRhMzNcIixcIiNiMzAwMDBcIl0sXG43OiBbXCIjZmVmMGQ5XCIsXCIjZmRkNDllXCIsXCIjZmRiYjg0XCIsXCIjZmM4ZDU5XCIsXCIjZWY2NTQ4XCIsXCIjZDczMDFmXCIsXCIjOTkwMDAwXCJdLFxuODogW1wiI2ZmZjdlY1wiLFwiI2ZlZThjOFwiLFwiI2ZkZDQ5ZVwiLFwiI2ZkYmI4NFwiLFwiI2ZjOGQ1OVwiLFwiI2VmNjU0OFwiLFwiI2Q3MzAxZlwiLFwiIzk5MDAwMFwiXSxcbjk6IFtcIiNmZmY3ZWNcIixcIiNmZWU4YzhcIixcIiNmZGQ0OWVcIixcIiNmZGJiODRcIixcIiNmYzhkNTlcIixcIiNlZjY1NDhcIixcIiNkNzMwMWZcIixcIiNiMzAwMDBcIixcIiM3ZjAwMDBcIl1cbn0sWWxPclJkOiB7XG4zOiBbXCIjZmZlZGEwXCIsXCIjZmViMjRjXCIsXCIjZjAzYjIwXCJdLFxuNDogW1wiI2ZmZmZiMlwiLFwiI2ZlY2M1Y1wiLFwiI2ZkOGQzY1wiLFwiI2UzMWExY1wiXSxcbjU6IFtcIiNmZmZmYjJcIixcIiNmZWNjNWNcIixcIiNmZDhkM2NcIixcIiNmMDNiMjBcIixcIiNiZDAwMjZcIl0sXG42OiBbXCIjZmZmZmIyXCIsXCIjZmVkOTc2XCIsXCIjZmViMjRjXCIsXCIjZmQ4ZDNjXCIsXCIjZjAzYjIwXCIsXCIjYmQwMDI2XCJdLFxuNzogW1wiI2ZmZmZiMlwiLFwiI2ZlZDk3NlwiLFwiI2ZlYjI0Y1wiLFwiI2ZkOGQzY1wiLFwiI2ZjNGUyYVwiLFwiI2UzMWExY1wiLFwiI2IxMDAyNlwiXSxcbjg6IFtcIiNmZmZmY2NcIixcIiNmZmVkYTBcIixcIiNmZWQ5NzZcIixcIiNmZWIyNGNcIixcIiNmZDhkM2NcIixcIiNmYzRlMmFcIixcIiNlMzFhMWNcIixcIiNiMTAwMjZcIl0sXG45OiBbXCIjZmZmZmNjXCIsXCIjZmZlZGEwXCIsXCIjZmVkOTc2XCIsXCIjZmViMjRjXCIsXCIjZmQ4ZDNjXCIsXCIjZmM0ZTJhXCIsXCIjZTMxYTFjXCIsXCIjYmQwMDI2XCIsXCIjODAwMDI2XCJdXG59LFlsT3JCcjoge1xuMzogW1wiI2ZmZjdiY1wiLFwiI2ZlYzQ0ZlwiLFwiI2Q5NWYwZVwiXSxcbjQ6IFtcIiNmZmZmZDRcIixcIiNmZWQ5OGVcIixcIiNmZTk5MjlcIixcIiNjYzRjMDJcIl0sXG41OiBbXCIjZmZmZmQ0XCIsXCIjZmVkOThlXCIsXCIjZmU5OTI5XCIsXCIjZDk1ZjBlXCIsXCIjOTkzNDA0XCJdLFxuNjogW1wiI2ZmZmZkNFwiLFwiI2ZlZTM5MVwiLFwiI2ZlYzQ0ZlwiLFwiI2ZlOTkyOVwiLFwiI2Q5NWYwZVwiLFwiIzk5MzQwNFwiXSxcbjc6IFtcIiNmZmZmZDRcIixcIiNmZWUzOTFcIixcIiNmZWM0NGZcIixcIiNmZTk5MjlcIixcIiNlYzcwMTRcIixcIiNjYzRjMDJcIixcIiM4YzJkMDRcIl0sXG44OiBbXCIjZmZmZmU1XCIsXCIjZmZmN2JjXCIsXCIjZmVlMzkxXCIsXCIjZmVjNDRmXCIsXCIjZmU5OTI5XCIsXCIjZWM3MDE0XCIsXCIjY2M0YzAyXCIsXCIjOGMyZDA0XCJdLFxuOTogW1wiI2ZmZmZlNVwiLFwiI2ZmZjdiY1wiLFwiI2ZlZTM5MVwiLFwiI2ZlYzQ0ZlwiLFwiI2ZlOTkyOVwiLFwiI2VjNzAxNFwiLFwiI2NjNGMwMlwiLFwiIzk5MzQwNFwiLFwiIzY2MjUwNlwiXVxufSxQdXJwbGVzOiB7XG4zOiBbXCIjZWZlZGY1XCIsXCIjYmNiZGRjXCIsXCIjNzU2YmIxXCJdLFxuNDogW1wiI2YyZjBmN1wiLFwiI2NiYzllMlwiLFwiIzllOWFjOFwiLFwiIzZhNTFhM1wiXSxcbjU6IFtcIiNmMmYwZjdcIixcIiNjYmM5ZTJcIixcIiM5ZTlhYzhcIixcIiM3NTZiYjFcIixcIiM1NDI3OGZcIl0sXG42OiBbXCIjZjJmMGY3XCIsXCIjZGFkYWViXCIsXCIjYmNiZGRjXCIsXCIjOWU5YWM4XCIsXCIjNzU2YmIxXCIsXCIjNTQyNzhmXCJdLFxuNzogW1wiI2YyZjBmN1wiLFwiI2RhZGFlYlwiLFwiI2JjYmRkY1wiLFwiIzllOWFjOFwiLFwiIzgwN2RiYVwiLFwiIzZhNTFhM1wiLFwiIzRhMTQ4NlwiXSxcbjg6IFtcIiNmY2ZiZmRcIixcIiNlZmVkZjVcIixcIiNkYWRhZWJcIixcIiNiY2JkZGNcIixcIiM5ZTlhYzhcIixcIiM4MDdkYmFcIixcIiM2YTUxYTNcIixcIiM0YTE0ODZcIl0sXG45OiBbXCIjZmNmYmZkXCIsXCIjZWZlZGY1XCIsXCIjZGFkYWViXCIsXCIjYmNiZGRjXCIsXCIjOWU5YWM4XCIsXCIjODA3ZGJhXCIsXCIjNmE1MWEzXCIsXCIjNTQyNzhmXCIsXCIjM2YwMDdkXCJdXG59LEJsdWVzOiB7XG4zOiBbXCIjZGVlYmY3XCIsXCIjOWVjYWUxXCIsXCIjMzE4MmJkXCJdLFxuNDogW1wiI2VmZjNmZlwiLFwiI2JkZDdlN1wiLFwiIzZiYWVkNlwiLFwiIzIxNzFiNVwiXSxcbjU6IFtcIiNlZmYzZmZcIixcIiNiZGQ3ZTdcIixcIiM2YmFlZDZcIixcIiMzMTgyYmRcIixcIiMwODUxOWNcIl0sXG42OiBbXCIjZWZmM2ZmXCIsXCIjYzZkYmVmXCIsXCIjOWVjYWUxXCIsXCIjNmJhZWQ2XCIsXCIjMzE4MmJkXCIsXCIjMDg1MTljXCJdLFxuNzogW1wiI2VmZjNmZlwiLFwiI2M2ZGJlZlwiLFwiIzllY2FlMVwiLFwiIzZiYWVkNlwiLFwiIzQyOTJjNlwiLFwiIzIxNzFiNVwiLFwiIzA4NDU5NFwiXSxcbjg6IFtcIiNmN2ZiZmZcIixcIiNkZWViZjdcIixcIiNjNmRiZWZcIixcIiM5ZWNhZTFcIixcIiM2YmFlZDZcIixcIiM0MjkyYzZcIixcIiMyMTcxYjVcIixcIiMwODQ1OTRcIl0sXG45OiBbXCIjZjdmYmZmXCIsXCIjZGVlYmY3XCIsXCIjYzZkYmVmXCIsXCIjOWVjYWUxXCIsXCIjNmJhZWQ2XCIsXCIjNDI5MmM2XCIsXCIjMjE3MWI1XCIsXCIjMDg1MTljXCIsXCIjMDgzMDZiXCJdXG59LEdyZWVuczoge1xuMzogW1wiI2U1ZjVlMFwiLFwiI2ExZDk5YlwiLFwiIzMxYTM1NFwiXSxcbjQ6IFtcIiNlZGY4ZTlcIixcIiNiYWU0YjNcIixcIiM3NGM0NzZcIixcIiMyMzhiNDVcIl0sXG41OiBbXCIjZWRmOGU5XCIsXCIjYmFlNGIzXCIsXCIjNzRjNDc2XCIsXCIjMzFhMzU0XCIsXCIjMDA2ZDJjXCJdLFxuNjogW1wiI2VkZjhlOVwiLFwiI2M3ZTljMFwiLFwiI2ExZDk5YlwiLFwiIzc0YzQ3NlwiLFwiIzMxYTM1NFwiLFwiIzAwNmQyY1wiXSxcbjc6IFtcIiNlZGY4ZTlcIixcIiNjN2U5YzBcIixcIiNhMWQ5OWJcIixcIiM3NGM0NzZcIixcIiM0MWFiNWRcIixcIiMyMzhiNDVcIixcIiMwMDVhMzJcIl0sXG44OiBbXCIjZjdmY2Y1XCIsXCIjZTVmNWUwXCIsXCIjYzdlOWMwXCIsXCIjYTFkOTliXCIsXCIjNzRjNDc2XCIsXCIjNDFhYjVkXCIsXCIjMjM4YjQ1XCIsXCIjMDA1YTMyXCJdLFxuOTogW1wiI2Y3ZmNmNVwiLFwiI2U1ZjVlMFwiLFwiI2M3ZTljMFwiLFwiI2ExZDk5YlwiLFwiIzc0YzQ3NlwiLFwiIzQxYWI1ZFwiLFwiIzIzOGI0NVwiLFwiIzAwNmQyY1wiLFwiIzAwNDQxYlwiXVxufSxPcmFuZ2VzOiB7XG4zOiBbXCIjZmVlNmNlXCIsXCIjZmRhZTZiXCIsXCIjZTY1NTBkXCJdLFxuNDogW1wiI2ZlZWRkZVwiLFwiI2ZkYmU4NVwiLFwiI2ZkOGQzY1wiLFwiI2Q5NDcwMVwiXSxcbjU6IFtcIiNmZWVkZGVcIixcIiNmZGJlODVcIixcIiNmZDhkM2NcIixcIiNlNjU1MGRcIixcIiNhNjM2MDNcIl0sXG42OiBbXCIjZmVlZGRlXCIsXCIjZmRkMGEyXCIsXCIjZmRhZTZiXCIsXCIjZmQ4ZDNjXCIsXCIjZTY1NTBkXCIsXCIjYTYzNjAzXCJdLFxuNzogW1wiI2ZlZWRkZVwiLFwiI2ZkZDBhMlwiLFwiI2ZkYWU2YlwiLFwiI2ZkOGQzY1wiLFwiI2YxNjkxM1wiLFwiI2Q5NDgwMVwiLFwiIzhjMmQwNFwiXSxcbjg6IFtcIiNmZmY1ZWJcIixcIiNmZWU2Y2VcIixcIiNmZGQwYTJcIixcIiNmZGFlNmJcIixcIiNmZDhkM2NcIixcIiNmMTY5MTNcIixcIiNkOTQ4MDFcIixcIiM4YzJkMDRcIl0sXG45OiBbXCIjZmZmNWViXCIsXCIjZmVlNmNlXCIsXCIjZmRkMGEyXCIsXCIjZmRhZTZiXCIsXCIjZmQ4ZDNjXCIsXCIjZjE2OTEzXCIsXCIjZDk0ODAxXCIsXCIjYTYzNjAzXCIsXCIjN2YyNzA0XCJdXG59LFJlZHM6IHtcbjM6IFtcIiNmZWUwZDJcIixcIiNmYzkyNzJcIixcIiNkZTJkMjZcIl0sXG40OiBbXCIjZmVlNWQ5XCIsXCIjZmNhZTkxXCIsXCIjZmI2YTRhXCIsXCIjY2IxODFkXCJdLFxuNTogW1wiI2ZlZTVkOVwiLFwiI2ZjYWU5MVwiLFwiI2ZiNmE0YVwiLFwiI2RlMmQyNlwiLFwiI2E1MGYxNVwiXSxcbjY6IFtcIiNmZWU1ZDlcIixcIiNmY2JiYTFcIixcIiNmYzkyNzJcIixcIiNmYjZhNGFcIixcIiNkZTJkMjZcIixcIiNhNTBmMTVcIl0sXG43OiBbXCIjZmVlNWQ5XCIsXCIjZmNiYmExXCIsXCIjZmM5MjcyXCIsXCIjZmI2YTRhXCIsXCIjZWYzYjJjXCIsXCIjY2IxODFkXCIsXCIjOTkwMDBkXCJdLFxuODogW1wiI2ZmZjVmMFwiLFwiI2ZlZTBkMlwiLFwiI2ZjYmJhMVwiLFwiI2ZjOTI3MlwiLFwiI2ZiNmE0YVwiLFwiI2VmM2IyY1wiLFwiI2NiMTgxZFwiLFwiIzk5MDAwZFwiXSxcbjk6IFtcIiNmZmY1ZjBcIixcIiNmZWUwZDJcIixcIiNmY2JiYTFcIixcIiNmYzkyNzJcIixcIiNmYjZhNGFcIixcIiNlZjNiMmNcIixcIiNjYjE4MWRcIixcIiNhNTBmMTVcIixcIiM2NzAwMGRcIl1cbn0sR3JleXM6IHtcbjM6IFtcIiNmMGYwZjBcIixcIiNiZGJkYmRcIixcIiM2MzYzNjNcIl0sXG40OiBbXCIjZjdmN2Y3XCIsXCIjY2NjY2NjXCIsXCIjOTY5Njk2XCIsXCIjNTI1MjUyXCJdLFxuNTogW1wiI2Y3ZjdmN1wiLFwiI2NjY2NjY1wiLFwiIzk2OTY5NlwiLFwiIzYzNjM2M1wiLFwiIzI1MjUyNVwiXSxcbjY6IFtcIiNmN2Y3ZjdcIixcIiNkOWQ5ZDlcIixcIiNiZGJkYmRcIixcIiM5Njk2OTZcIixcIiM2MzYzNjNcIixcIiMyNTI1MjVcIl0sXG43OiBbXCIjZjdmN2Y3XCIsXCIjZDlkOWQ5XCIsXCIjYmRiZGJkXCIsXCIjOTY5Njk2XCIsXCIjNzM3MzczXCIsXCIjNTI1MjUyXCIsXCIjMjUyNTI1XCJdLFxuODogW1wiI2ZmZmZmZlwiLFwiI2YwZjBmMFwiLFwiI2Q5ZDlkOVwiLFwiI2JkYmRiZFwiLFwiIzk2OTY5NlwiLFwiIzczNzM3M1wiLFwiIzUyNTI1MlwiLFwiIzI1MjUyNVwiXSxcbjk6IFtcIiNmZmZmZmZcIixcIiNmMGYwZjBcIixcIiNkOWQ5ZDlcIixcIiNiZGJkYmRcIixcIiM5Njk2OTZcIixcIiM3MzczNzNcIixcIiM1MjUyNTJcIixcIiMyNTI1MjVcIixcIiMwMDAwMDBcIl1cbn0sUHVPcjoge1xuMzogW1wiI2YxYTM0MFwiLFwiI2Y3ZjdmN1wiLFwiIzk5OGVjM1wiXSxcbjQ6IFtcIiNlNjYxMDFcIixcIiNmZGI4NjNcIixcIiNiMmFiZDJcIixcIiM1ZTNjOTlcIl0sXG41OiBbXCIjZTY2MTAxXCIsXCIjZmRiODYzXCIsXCIjZjdmN2Y3XCIsXCIjYjJhYmQyXCIsXCIjNWUzYzk5XCJdLFxuNjogW1wiI2IzNTgwNlwiLFwiI2YxYTM0MFwiLFwiI2ZlZTBiNlwiLFwiI2Q4ZGFlYlwiLFwiIzk5OGVjM1wiLFwiIzU0Mjc4OFwiXSxcbjc6IFtcIiNiMzU4MDZcIixcIiNmMWEzNDBcIixcIiNmZWUwYjZcIixcIiNmN2Y3ZjdcIixcIiNkOGRhZWJcIixcIiM5OThlYzNcIixcIiM1NDI3ODhcIl0sXG44OiBbXCIjYjM1ODA2XCIsXCIjZTA4MjE0XCIsXCIjZmRiODYzXCIsXCIjZmVlMGI2XCIsXCIjZDhkYWViXCIsXCIjYjJhYmQyXCIsXCIjODA3M2FjXCIsXCIjNTQyNzg4XCJdLFxuOTogW1wiI2IzNTgwNlwiLFwiI2UwODIxNFwiLFwiI2ZkYjg2M1wiLFwiI2ZlZTBiNlwiLFwiI2Y3ZjdmN1wiLFwiI2Q4ZGFlYlwiLFwiI2IyYWJkMlwiLFwiIzgwNzNhY1wiLFwiIzU0Mjc4OFwiXSxcbjEwOiBbXCIjN2YzYjA4XCIsXCIjYjM1ODA2XCIsXCIjZTA4MjE0XCIsXCIjZmRiODYzXCIsXCIjZmVlMGI2XCIsXCIjZDhkYWViXCIsXCIjYjJhYmQyXCIsXCIjODA3M2FjXCIsXCIjNTQyNzg4XCIsXCIjMmQwMDRiXCJdLFxuMTE6IFtcIiM3ZjNiMDhcIixcIiNiMzU4MDZcIixcIiNlMDgyMTRcIixcIiNmZGI4NjNcIixcIiNmZWUwYjZcIixcIiNmN2Y3ZjdcIixcIiNkOGRhZWJcIixcIiNiMmFiZDJcIixcIiM4MDczYWNcIixcIiM1NDI3ODhcIixcIiMyZDAwNGJcIl1cbn0sQnJCRzoge1xuMzogW1wiI2Q4YjM2NVwiLFwiI2Y1ZjVmNVwiLFwiIzVhYjRhY1wiXSxcbjQ6IFtcIiNhNjYxMWFcIixcIiNkZmMyN2RcIixcIiM4MGNkYzFcIixcIiMwMTg1NzFcIl0sXG41OiBbXCIjYTY2MTFhXCIsXCIjZGZjMjdkXCIsXCIjZjVmNWY1XCIsXCIjODBjZGMxXCIsXCIjMDE4NTcxXCJdLFxuNjogW1wiIzhjNTEwYVwiLFwiI2Q4YjM2NVwiLFwiI2Y2ZThjM1wiLFwiI2M3ZWFlNVwiLFwiIzVhYjRhY1wiLFwiIzAxNjY1ZVwiXSxcbjc6IFtcIiM4YzUxMGFcIixcIiNkOGIzNjVcIixcIiNmNmU4YzNcIixcIiNmNWY1ZjVcIixcIiNjN2VhZTVcIixcIiM1YWI0YWNcIixcIiMwMTY2NWVcIl0sXG44OiBbXCIjOGM1MTBhXCIsXCIjYmY4MTJkXCIsXCIjZGZjMjdkXCIsXCIjZjZlOGMzXCIsXCIjYzdlYWU1XCIsXCIjODBjZGMxXCIsXCIjMzU5NzhmXCIsXCIjMDE2NjVlXCJdLFxuOTogW1wiIzhjNTEwYVwiLFwiI2JmODEyZFwiLFwiI2RmYzI3ZFwiLFwiI2Y2ZThjM1wiLFwiI2Y1ZjVmNVwiLFwiI2M3ZWFlNVwiLFwiIzgwY2RjMVwiLFwiIzM1OTc4ZlwiLFwiIzAxNjY1ZVwiXSxcbjEwOiBbXCIjNTQzMDA1XCIsXCIjOGM1MTBhXCIsXCIjYmY4MTJkXCIsXCIjZGZjMjdkXCIsXCIjZjZlOGMzXCIsXCIjYzdlYWU1XCIsXCIjODBjZGMxXCIsXCIjMzU5NzhmXCIsXCIjMDE2NjVlXCIsXCIjMDAzYzMwXCJdLFxuMTE6IFtcIiM1NDMwMDVcIixcIiM4YzUxMGFcIixcIiNiZjgxMmRcIixcIiNkZmMyN2RcIixcIiNmNmU4YzNcIixcIiNmNWY1ZjVcIixcIiNjN2VhZTVcIixcIiM4MGNkYzFcIixcIiMzNTk3OGZcIixcIiMwMTY2NWVcIixcIiMwMDNjMzBcIl1cbn0sUFJHbjoge1xuMzogW1wiI2FmOGRjM1wiLFwiI2Y3ZjdmN1wiLFwiIzdmYmY3YlwiXSxcbjQ6IFtcIiM3YjMyOTRcIixcIiNjMmE1Y2ZcIixcIiNhNmRiYTBcIixcIiMwMDg4MzdcIl0sXG41OiBbXCIjN2IzMjk0XCIsXCIjYzJhNWNmXCIsXCIjZjdmN2Y3XCIsXCIjYTZkYmEwXCIsXCIjMDA4ODM3XCJdLFxuNjogW1wiIzc2MmE4M1wiLFwiI2FmOGRjM1wiLFwiI2U3ZDRlOFwiLFwiI2Q5ZjBkM1wiLFwiIzdmYmY3YlwiLFwiIzFiNzgzN1wiXSxcbjc6IFtcIiM3NjJhODNcIixcIiNhZjhkYzNcIixcIiNlN2Q0ZThcIixcIiNmN2Y3ZjdcIixcIiNkOWYwZDNcIixcIiM3ZmJmN2JcIixcIiMxYjc4MzdcIl0sXG44OiBbXCIjNzYyYTgzXCIsXCIjOTk3MGFiXCIsXCIjYzJhNWNmXCIsXCIjZTdkNGU4XCIsXCIjZDlmMGQzXCIsXCIjYTZkYmEwXCIsXCIjNWFhZTYxXCIsXCIjMWI3ODM3XCJdLFxuOTogW1wiIzc2MmE4M1wiLFwiIzk5NzBhYlwiLFwiI2MyYTVjZlwiLFwiI2U3ZDRlOFwiLFwiI2Y3ZjdmN1wiLFwiI2Q5ZjBkM1wiLFwiI2E2ZGJhMFwiLFwiIzVhYWU2MVwiLFwiIzFiNzgzN1wiXSxcbjEwOiBbXCIjNDAwMDRiXCIsXCIjNzYyYTgzXCIsXCIjOTk3MGFiXCIsXCIjYzJhNWNmXCIsXCIjZTdkNGU4XCIsXCIjZDlmMGQzXCIsXCIjYTZkYmEwXCIsXCIjNWFhZTYxXCIsXCIjMWI3ODM3XCIsXCIjMDA0NDFiXCJdLFxuMTE6IFtcIiM0MDAwNGJcIixcIiM3NjJhODNcIixcIiM5OTcwYWJcIixcIiNjMmE1Y2ZcIixcIiNlN2Q0ZThcIixcIiNmN2Y3ZjdcIixcIiNkOWYwZDNcIixcIiNhNmRiYTBcIixcIiM1YWFlNjFcIixcIiMxYjc4MzdcIixcIiMwMDQ0MWJcIl1cbn0sUGlZRzoge1xuMzogW1wiI2U5YTNjOVwiLFwiI2Y3ZjdmN1wiLFwiI2ExZDc2YVwiXSxcbjQ6IFtcIiNkMDFjOGJcIixcIiNmMWI2ZGFcIixcIiNiOGUxODZcIixcIiM0ZGFjMjZcIl0sXG41OiBbXCIjZDAxYzhiXCIsXCIjZjFiNmRhXCIsXCIjZjdmN2Y3XCIsXCIjYjhlMTg2XCIsXCIjNGRhYzI2XCJdLFxuNjogW1wiI2M1MWI3ZFwiLFwiI2U5YTNjOVwiLFwiI2ZkZTBlZlwiLFwiI2U2ZjVkMFwiLFwiI2ExZDc2YVwiLFwiIzRkOTIyMVwiXSxcbjc6IFtcIiNjNTFiN2RcIixcIiNlOWEzYzlcIixcIiNmZGUwZWZcIixcIiNmN2Y3ZjdcIixcIiNlNmY1ZDBcIixcIiNhMWQ3NmFcIixcIiM0ZDkyMjFcIl0sXG44OiBbXCIjYzUxYjdkXCIsXCIjZGU3N2FlXCIsXCIjZjFiNmRhXCIsXCIjZmRlMGVmXCIsXCIjZTZmNWQwXCIsXCIjYjhlMTg2XCIsXCIjN2ZiYzQxXCIsXCIjNGQ5MjIxXCJdLFxuOTogW1wiI2M1MWI3ZFwiLFwiI2RlNzdhZVwiLFwiI2YxYjZkYVwiLFwiI2ZkZTBlZlwiLFwiI2Y3ZjdmN1wiLFwiI2U2ZjVkMFwiLFwiI2I4ZTE4NlwiLFwiIzdmYmM0MVwiLFwiIzRkOTIyMVwiXSxcbjEwOiBbXCIjOGUwMTUyXCIsXCIjYzUxYjdkXCIsXCIjZGU3N2FlXCIsXCIjZjFiNmRhXCIsXCIjZmRlMGVmXCIsXCIjZTZmNWQwXCIsXCIjYjhlMTg2XCIsXCIjN2ZiYzQxXCIsXCIjNGQ5MjIxXCIsXCIjMjc2NDE5XCJdLFxuMTE6IFtcIiM4ZTAxNTJcIixcIiNjNTFiN2RcIixcIiNkZTc3YWVcIixcIiNmMWI2ZGFcIixcIiNmZGUwZWZcIixcIiNmN2Y3ZjdcIixcIiNlNmY1ZDBcIixcIiNiOGUxODZcIixcIiM3ZmJjNDFcIixcIiM0ZDkyMjFcIixcIiMyNzY0MTlcIl1cbn0sUmRCdToge1xuMzogW1wiI2VmOGE2MlwiLFwiI2Y3ZjdmN1wiLFwiIzY3YTljZlwiXSxcbjQ6IFtcIiNjYTAwMjBcIixcIiNmNGE1ODJcIixcIiM5MmM1ZGVcIixcIiMwNTcxYjBcIl0sXG41OiBbXCIjY2EwMDIwXCIsXCIjZjRhNTgyXCIsXCIjZjdmN2Y3XCIsXCIjOTJjNWRlXCIsXCIjMDU3MWIwXCJdLFxuNjogW1wiI2IyMTgyYlwiLFwiI2VmOGE2MlwiLFwiI2ZkZGJjN1wiLFwiI2QxZTVmMFwiLFwiIzY3YTljZlwiLFwiIzIxNjZhY1wiXSxcbjc6IFtcIiNiMjE4MmJcIixcIiNlZjhhNjJcIixcIiNmZGRiYzdcIixcIiNmN2Y3ZjdcIixcIiNkMWU1ZjBcIixcIiM2N2E5Y2ZcIixcIiMyMTY2YWNcIl0sXG44OiBbXCIjYjIxODJiXCIsXCIjZDY2MDRkXCIsXCIjZjRhNTgyXCIsXCIjZmRkYmM3XCIsXCIjZDFlNWYwXCIsXCIjOTJjNWRlXCIsXCIjNDM5M2MzXCIsXCIjMjE2NmFjXCJdLFxuOTogW1wiI2IyMTgyYlwiLFwiI2Q2NjA0ZFwiLFwiI2Y0YTU4MlwiLFwiI2ZkZGJjN1wiLFwiI2Y3ZjdmN1wiLFwiI2QxZTVmMFwiLFwiIzkyYzVkZVwiLFwiIzQzOTNjM1wiLFwiIzIxNjZhY1wiXSxcbjEwOiBbXCIjNjcwMDFmXCIsXCIjYjIxODJiXCIsXCIjZDY2MDRkXCIsXCIjZjRhNTgyXCIsXCIjZmRkYmM3XCIsXCIjZDFlNWYwXCIsXCIjOTJjNWRlXCIsXCIjNDM5M2MzXCIsXCIjMjE2NmFjXCIsXCIjMDUzMDYxXCJdLFxuMTE6IFtcIiM2NzAwMWZcIixcIiNiMjE4MmJcIixcIiNkNjYwNGRcIixcIiNmNGE1ODJcIixcIiNmZGRiYzdcIixcIiNmN2Y3ZjdcIixcIiNkMWU1ZjBcIixcIiM5MmM1ZGVcIixcIiM0MzkzYzNcIixcIiMyMTY2YWNcIixcIiMwNTMwNjFcIl1cbn0sUmRHeToge1xuMzogW1wiI2VmOGE2MlwiLFwiI2ZmZmZmZlwiLFwiIzk5OTk5OVwiXSxcbjQ6IFtcIiNjYTAwMjBcIixcIiNmNGE1ODJcIixcIiNiYWJhYmFcIixcIiM0MDQwNDBcIl0sXG41OiBbXCIjY2EwMDIwXCIsXCIjZjRhNTgyXCIsXCIjZmZmZmZmXCIsXCIjYmFiYWJhXCIsXCIjNDA0MDQwXCJdLFxuNjogW1wiI2IyMTgyYlwiLFwiI2VmOGE2MlwiLFwiI2ZkZGJjN1wiLFwiI2UwZTBlMFwiLFwiIzk5OTk5OVwiLFwiIzRkNGQ0ZFwiXSxcbjc6IFtcIiNiMjE4MmJcIixcIiNlZjhhNjJcIixcIiNmZGRiYzdcIixcIiNmZmZmZmZcIixcIiNlMGUwZTBcIixcIiM5OTk5OTlcIixcIiM0ZDRkNGRcIl0sXG44OiBbXCIjYjIxODJiXCIsXCIjZDY2MDRkXCIsXCIjZjRhNTgyXCIsXCIjZmRkYmM3XCIsXCIjZTBlMGUwXCIsXCIjYmFiYWJhXCIsXCIjODc4Nzg3XCIsXCIjNGQ0ZDRkXCJdLFxuOTogW1wiI2IyMTgyYlwiLFwiI2Q2NjA0ZFwiLFwiI2Y0YTU4MlwiLFwiI2ZkZGJjN1wiLFwiI2ZmZmZmZlwiLFwiI2UwZTBlMFwiLFwiI2JhYmFiYVwiLFwiIzg3ODc4N1wiLFwiIzRkNGQ0ZFwiXSxcbjEwOiBbXCIjNjcwMDFmXCIsXCIjYjIxODJiXCIsXCIjZDY2MDRkXCIsXCIjZjRhNTgyXCIsXCIjZmRkYmM3XCIsXCIjZTBlMGUwXCIsXCIjYmFiYWJhXCIsXCIjODc4Nzg3XCIsXCIjNGQ0ZDRkXCIsXCIjMWExYTFhXCJdLFxuMTE6IFtcIiM2NzAwMWZcIixcIiNiMjE4MmJcIixcIiNkNjYwNGRcIixcIiNmNGE1ODJcIixcIiNmZGRiYzdcIixcIiNmZmZmZmZcIixcIiNlMGUwZTBcIixcIiNiYWJhYmFcIixcIiM4Nzg3ODdcIixcIiM0ZDRkNGRcIixcIiMxYTFhMWFcIl1cbn0sUmRZbEJ1OiB7XG4zOiBbXCIjZmM4ZDU5XCIsXCIjZmZmZmJmXCIsXCIjOTFiZmRiXCJdLFxuNDogW1wiI2Q3MTkxY1wiLFwiI2ZkYWU2MVwiLFwiI2FiZDllOVwiLFwiIzJjN2JiNlwiXSxcbjU6IFtcIiNkNzE5MWNcIixcIiNmZGFlNjFcIixcIiNmZmZmYmZcIixcIiNhYmQ5ZTlcIixcIiMyYzdiYjZcIl0sXG42OiBbXCIjZDczMDI3XCIsXCIjZmM4ZDU5XCIsXCIjZmVlMDkwXCIsXCIjZTBmM2Y4XCIsXCIjOTFiZmRiXCIsXCIjNDU3NWI0XCJdLFxuNzogW1wiI2Q3MzAyN1wiLFwiI2ZjOGQ1OVwiLFwiI2ZlZTA5MFwiLFwiI2ZmZmZiZlwiLFwiI2UwZjNmOFwiLFwiIzkxYmZkYlwiLFwiIzQ1NzViNFwiXSxcbjg6IFtcIiNkNzMwMjdcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOTBcIixcIiNlMGYzZjhcIixcIiNhYmQ5ZTlcIixcIiM3NGFkZDFcIixcIiM0NTc1YjRcIl0sXG45OiBbXCIjZDczMDI3XCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDkwXCIsXCIjZmZmZmJmXCIsXCIjZTBmM2Y4XCIsXCIjYWJkOWU5XCIsXCIjNzRhZGQxXCIsXCIjNDU3NWI0XCJdLFxuMTA6IFtcIiNhNTAwMjZcIixcIiNkNzMwMjdcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOTBcIixcIiNlMGYzZjhcIixcIiNhYmQ5ZTlcIixcIiM3NGFkZDFcIixcIiM0NTc1YjRcIixcIiMzMTM2OTVcIl0sXG4xMTogW1wiI2E1MDAyNlwiLFwiI2Q3MzAyN1wiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA5MFwiLFwiI2ZmZmZiZlwiLFwiI2UwZjNmOFwiLFwiI2FiZDllOVwiLFwiIzc0YWRkMVwiLFwiIzQ1NzViNFwiLFwiIzMxMzY5NVwiXVxufSxTcGVjdHJhbDoge1xuMzogW1wiI2ZjOGQ1OVwiLFwiI2ZmZmZiZlwiLFwiIzk5ZDU5NFwiXSxcbjQ6IFtcIiNkNzE5MWNcIixcIiNmZGFlNjFcIixcIiNhYmRkYTRcIixcIiMyYjgzYmFcIl0sXG41OiBbXCIjZDcxOTFjXCIsXCIjZmRhZTYxXCIsXCIjZmZmZmJmXCIsXCIjYWJkZGE0XCIsXCIjMmI4M2JhXCJdLFxuNjogW1wiI2Q1M2U0ZlwiLFwiI2ZjOGQ1OVwiLFwiI2ZlZTA4YlwiLFwiI2U2ZjU5OFwiLFwiIzk5ZDU5NFwiLFwiIzMyODhiZFwiXSxcbjc6IFtcIiNkNTNlNGZcIixcIiNmYzhkNTlcIixcIiNmZWUwOGJcIixcIiNmZmZmYmZcIixcIiNlNmY1OThcIixcIiM5OWQ1OTRcIixcIiMzMjg4YmRcIl0sXG44OiBbXCIjZDUzZTRmXCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDhiXCIsXCIjZTZmNTk4XCIsXCIjYWJkZGE0XCIsXCIjNjZjMmE1XCIsXCIjMzI4OGJkXCJdLFxuOTogW1wiI2Q1M2U0ZlwiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA4YlwiLFwiI2ZmZmZiZlwiLFwiI2U2ZjU5OFwiLFwiI2FiZGRhNFwiLFwiIzY2YzJhNVwiLFwiIzMyODhiZFwiXSxcbjEwOiBbXCIjOWUwMTQyXCIsXCIjZDUzZTRmXCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDhiXCIsXCIjZTZmNTk4XCIsXCIjYWJkZGE0XCIsXCIjNjZjMmE1XCIsXCIjMzI4OGJkXCIsXCIjNWU0ZmEyXCJdLFxuMTE6IFtcIiM5ZTAxNDJcIixcIiNkNTNlNGZcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOGJcIixcIiNmZmZmYmZcIixcIiNlNmY1OThcIixcIiNhYmRkYTRcIixcIiM2NmMyYTVcIixcIiMzMjg4YmRcIixcIiM1ZTRmYTJcIl1cbn0sUmRZbEduOiB7XG4zOiBbXCIjZmM4ZDU5XCIsXCIjZmZmZmJmXCIsXCIjOTFjZjYwXCJdLFxuNDogW1wiI2Q3MTkxY1wiLFwiI2ZkYWU2MVwiLFwiI2E2ZDk2YVwiLFwiIzFhOTY0MVwiXSxcbjU6IFtcIiNkNzE5MWNcIixcIiNmZGFlNjFcIixcIiNmZmZmYmZcIixcIiNhNmQ5NmFcIixcIiMxYTk2NDFcIl0sXG42OiBbXCIjZDczMDI3XCIsXCIjZmM4ZDU5XCIsXCIjZmVlMDhiXCIsXCIjZDllZjhiXCIsXCIjOTFjZjYwXCIsXCIjMWE5ODUwXCJdLFxuNzogW1wiI2Q3MzAyN1wiLFwiI2ZjOGQ1OVwiLFwiI2ZlZTA4YlwiLFwiI2ZmZmZiZlwiLFwiI2Q5ZWY4YlwiLFwiIzkxY2Y2MFwiLFwiIzFhOTg1MFwiXSxcbjg6IFtcIiNkNzMwMjdcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOGJcIixcIiNkOWVmOGJcIixcIiNhNmQ5NmFcIixcIiM2NmJkNjNcIixcIiMxYTk4NTBcIl0sXG45OiBbXCIjZDczMDI3XCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDhiXCIsXCIjZmZmZmJmXCIsXCIjZDllZjhiXCIsXCIjYTZkOTZhXCIsXCIjNjZiZDYzXCIsXCIjMWE5ODUwXCJdLFxuMTA6IFtcIiNhNTAwMjZcIixcIiNkNzMwMjdcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOGJcIixcIiNkOWVmOGJcIixcIiNhNmQ5NmFcIixcIiM2NmJkNjNcIixcIiMxYTk4NTBcIixcIiMwMDY4MzdcIl0sXG4xMTogW1wiI2E1MDAyNlwiLFwiI2Q3MzAyN1wiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA4YlwiLFwiI2ZmZmZiZlwiLFwiI2Q5ZWY4YlwiLFwiI2E2ZDk2YVwiLFwiIzY2YmQ2M1wiLFwiIzFhOTg1MFwiLFwiIzAwNjgzN1wiXVxufSxBY2NlbnQ6IHtcbjM6IFtcIiM3ZmM5N2ZcIixcIiNiZWFlZDRcIixcIiNmZGMwODZcIl0sXG40OiBbXCIjN2ZjOTdmXCIsXCIjYmVhZWQ0XCIsXCIjZmRjMDg2XCIsXCIjZmZmZjk5XCJdLFxuNTogW1wiIzdmYzk3ZlwiLFwiI2JlYWVkNFwiLFwiI2ZkYzA4NlwiLFwiI2ZmZmY5OVwiLFwiIzM4NmNiMFwiXSxcbjY6IFtcIiM3ZmM5N2ZcIixcIiNiZWFlZDRcIixcIiNmZGMwODZcIixcIiNmZmZmOTlcIixcIiMzODZjYjBcIixcIiNmMDAyN2ZcIl0sXG43OiBbXCIjN2ZjOTdmXCIsXCIjYmVhZWQ0XCIsXCIjZmRjMDg2XCIsXCIjZmZmZjk5XCIsXCIjMzg2Y2IwXCIsXCIjZjAwMjdmXCIsXCIjYmY1YjE3XCJdLFxuODogW1wiIzdmYzk3ZlwiLFwiI2JlYWVkNFwiLFwiI2ZkYzA4NlwiLFwiI2ZmZmY5OVwiLFwiIzM4NmNiMFwiLFwiI2YwMDI3ZlwiLFwiI2JmNWIxN1wiLFwiIzY2NjY2NlwiXVxufSxEYXJrMjoge1xuMzogW1wiIzFiOWU3N1wiLFwiI2Q5NWYwMlwiLFwiIzc1NzBiM1wiXSxcbjQ6IFtcIiMxYjllNzdcIixcIiNkOTVmMDJcIixcIiM3NTcwYjNcIixcIiNlNzI5OGFcIl0sXG41OiBbXCIjMWI5ZTc3XCIsXCIjZDk1ZjAyXCIsXCIjNzU3MGIzXCIsXCIjZTcyOThhXCIsXCIjNjZhNjFlXCJdLFxuNjogW1wiIzFiOWU3N1wiLFwiI2Q5NWYwMlwiLFwiIzc1NzBiM1wiLFwiI2U3Mjk4YVwiLFwiIzY2YTYxZVwiLFwiI2U2YWIwMlwiXSxcbjc6IFtcIiMxYjllNzdcIixcIiNkOTVmMDJcIixcIiM3NTcwYjNcIixcIiNlNzI5OGFcIixcIiM2NmE2MWVcIixcIiNlNmFiMDJcIixcIiNhNjc2MWRcIl0sXG44OiBbXCIjMWI5ZTc3XCIsXCIjZDk1ZjAyXCIsXCIjNzU3MGIzXCIsXCIjZTcyOThhXCIsXCIjNjZhNjFlXCIsXCIjZTZhYjAyXCIsXCIjYTY3NjFkXCIsXCIjNjY2NjY2XCJdXG59LFBhaXJlZDoge1xuMzogW1wiI2E2Y2VlM1wiLFwiIzFmNzhiNFwiLFwiI2IyZGY4YVwiXSxcbjQ6IFtcIiNhNmNlZTNcIixcIiMxZjc4YjRcIixcIiNiMmRmOGFcIixcIiMzM2EwMmNcIl0sXG41OiBbXCIjYTZjZWUzXCIsXCIjMWY3OGI0XCIsXCIjYjJkZjhhXCIsXCIjMzNhMDJjXCIsXCIjZmI5YTk5XCJdLFxuNjogW1wiI2E2Y2VlM1wiLFwiIzFmNzhiNFwiLFwiI2IyZGY4YVwiLFwiIzMzYTAyY1wiLFwiI2ZiOWE5OVwiLFwiI2UzMWExY1wiXSxcbjc6IFtcIiNhNmNlZTNcIixcIiMxZjc4YjRcIixcIiNiMmRmOGFcIixcIiMzM2EwMmNcIixcIiNmYjlhOTlcIixcIiNlMzFhMWNcIixcIiNmZGJmNmZcIl0sXG44OiBbXCIjYTZjZWUzXCIsXCIjMWY3OGI0XCIsXCIjYjJkZjhhXCIsXCIjMzNhMDJjXCIsXCIjZmI5YTk5XCIsXCIjZTMxYTFjXCIsXCIjZmRiZjZmXCIsXCIjZmY3ZjAwXCJdLFxuOTogW1wiI2E2Y2VlM1wiLFwiIzFmNzhiNFwiLFwiI2IyZGY4YVwiLFwiIzMzYTAyY1wiLFwiI2ZiOWE5OVwiLFwiI2UzMWExY1wiLFwiI2ZkYmY2ZlwiLFwiI2ZmN2YwMFwiLFwiI2NhYjJkNlwiXSxcbjEwOiBbXCIjYTZjZWUzXCIsXCIjMWY3OGI0XCIsXCIjYjJkZjhhXCIsXCIjMzNhMDJjXCIsXCIjZmI5YTk5XCIsXCIjZTMxYTFjXCIsXCIjZmRiZjZmXCIsXCIjZmY3ZjAwXCIsXCIjY2FiMmQ2XCIsXCIjNmEzZDlhXCJdLFxuMTE6IFtcIiNhNmNlZTNcIixcIiMxZjc4YjRcIixcIiNiMmRmOGFcIixcIiMzM2EwMmNcIixcIiNmYjlhOTlcIixcIiNlMzFhMWNcIixcIiNmZGJmNmZcIixcIiNmZjdmMDBcIixcIiNjYWIyZDZcIixcIiM2YTNkOWFcIixcIiNmZmZmOTlcIl0sXG4xMjogW1wiI2E2Y2VlM1wiLFwiIzFmNzhiNFwiLFwiI2IyZGY4YVwiLFwiIzMzYTAyY1wiLFwiI2ZiOWE5OVwiLFwiI2UzMWExY1wiLFwiI2ZkYmY2ZlwiLFwiI2ZmN2YwMFwiLFwiI2NhYjJkNlwiLFwiIzZhM2Q5YVwiLFwiI2ZmZmY5OVwiLFwiI2IxNTkyOFwiXVxufSxQYXN0ZWwxOiB7XG4zOiBbXCIjZmJiNGFlXCIsXCIjYjNjZGUzXCIsXCIjY2NlYmM1XCJdLFxuNDogW1wiI2ZiYjRhZVwiLFwiI2IzY2RlM1wiLFwiI2NjZWJjNVwiLFwiI2RlY2JlNFwiXSxcbjU6IFtcIiNmYmI0YWVcIixcIiNiM2NkZTNcIixcIiNjY2ViYzVcIixcIiNkZWNiZTRcIixcIiNmZWQ5YTZcIl0sXG42OiBbXCIjZmJiNGFlXCIsXCIjYjNjZGUzXCIsXCIjY2NlYmM1XCIsXCIjZGVjYmU0XCIsXCIjZmVkOWE2XCIsXCIjZmZmZmNjXCJdLFxuNzogW1wiI2ZiYjRhZVwiLFwiI2IzY2RlM1wiLFwiI2NjZWJjNVwiLFwiI2RlY2JlNFwiLFwiI2ZlZDlhNlwiLFwiI2ZmZmZjY1wiLFwiI2U1ZDhiZFwiXSxcbjg6IFtcIiNmYmI0YWVcIixcIiNiM2NkZTNcIixcIiNjY2ViYzVcIixcIiNkZWNiZTRcIixcIiNmZWQ5YTZcIixcIiNmZmZmY2NcIixcIiNlNWQ4YmRcIixcIiNmZGRhZWNcIl0sXG45OiBbXCIjZmJiNGFlXCIsXCIjYjNjZGUzXCIsXCIjY2NlYmM1XCIsXCIjZGVjYmU0XCIsXCIjZmVkOWE2XCIsXCIjZmZmZmNjXCIsXCIjZTVkOGJkXCIsXCIjZmRkYWVjXCIsXCIjZjJmMmYyXCJdXG59LFBhc3RlbDI6IHtcbjM6IFtcIiNiM2UyY2RcIixcIiNmZGNkYWNcIixcIiNjYmQ1ZThcIl0sXG40OiBbXCIjYjNlMmNkXCIsXCIjZmRjZGFjXCIsXCIjY2JkNWU4XCIsXCIjZjRjYWU0XCJdLFxuNTogW1wiI2IzZTJjZFwiLFwiI2ZkY2RhY1wiLFwiI2NiZDVlOFwiLFwiI2Y0Y2FlNFwiLFwiI2U2ZjVjOVwiXSxcbjY6IFtcIiNiM2UyY2RcIixcIiNmZGNkYWNcIixcIiNjYmQ1ZThcIixcIiNmNGNhZTRcIixcIiNlNmY1YzlcIixcIiNmZmYyYWVcIl0sXG43OiBbXCIjYjNlMmNkXCIsXCIjZmRjZGFjXCIsXCIjY2JkNWU4XCIsXCIjZjRjYWU0XCIsXCIjZTZmNWM5XCIsXCIjZmZmMmFlXCIsXCIjZjFlMmNjXCJdLFxuODogW1wiI2IzZTJjZFwiLFwiI2ZkY2RhY1wiLFwiI2NiZDVlOFwiLFwiI2Y0Y2FlNFwiLFwiI2U2ZjVjOVwiLFwiI2ZmZjJhZVwiLFwiI2YxZTJjY1wiLFwiI2NjY2NjY1wiXVxufSxTZXQxOiB7XG4zOiBbXCIjZTQxYTFjXCIsXCIjMzc3ZWI4XCIsXCIjNGRhZjRhXCJdLFxuNDogW1wiI2U0MWExY1wiLFwiIzM3N2ViOFwiLFwiIzRkYWY0YVwiLFwiIzk4NGVhM1wiXSxcbjU6IFtcIiNlNDFhMWNcIixcIiMzNzdlYjhcIixcIiM0ZGFmNGFcIixcIiM5ODRlYTNcIixcIiNmZjdmMDBcIl0sXG42OiBbXCIjZTQxYTFjXCIsXCIjMzc3ZWI4XCIsXCIjNGRhZjRhXCIsXCIjOTg0ZWEzXCIsXCIjZmY3ZjAwXCIsXCIjZmZmZjMzXCJdLFxuNzogW1wiI2U0MWExY1wiLFwiIzM3N2ViOFwiLFwiIzRkYWY0YVwiLFwiIzk4NGVhM1wiLFwiI2ZmN2YwMFwiLFwiI2ZmZmYzM1wiLFwiI2E2NTYyOFwiXSxcbjg6IFtcIiNlNDFhMWNcIixcIiMzNzdlYjhcIixcIiM0ZGFmNGFcIixcIiM5ODRlYTNcIixcIiNmZjdmMDBcIixcIiNmZmZmMzNcIixcIiNhNjU2MjhcIixcIiNmNzgxYmZcIl0sXG45OiBbXCIjZTQxYTFjXCIsXCIjMzc3ZWI4XCIsXCIjNGRhZjRhXCIsXCIjOTg0ZWEzXCIsXCIjZmY3ZjAwXCIsXCIjZmZmZjMzXCIsXCIjYTY1NjI4XCIsXCIjZjc4MWJmXCIsXCIjOTk5OTk5XCJdXG59LFNldDI6IHtcbjM6IFtcIiM2NmMyYTVcIixcIiNmYzhkNjJcIixcIiM4ZGEwY2JcIl0sXG40OiBbXCIjNjZjMmE1XCIsXCIjZmM4ZDYyXCIsXCIjOGRhMGNiXCIsXCIjZTc4YWMzXCJdLFxuNTogW1wiIzY2YzJhNVwiLFwiI2ZjOGQ2MlwiLFwiIzhkYTBjYlwiLFwiI2U3OGFjM1wiLFwiI2E2ZDg1NFwiXSxcbjY6IFtcIiM2NmMyYTVcIixcIiNmYzhkNjJcIixcIiM4ZGEwY2JcIixcIiNlNzhhYzNcIixcIiNhNmQ4NTRcIixcIiNmZmQ5MmZcIl0sXG43OiBbXCIjNjZjMmE1XCIsXCIjZmM4ZDYyXCIsXCIjOGRhMGNiXCIsXCIjZTc4YWMzXCIsXCIjYTZkODU0XCIsXCIjZmZkOTJmXCIsXCIjZTVjNDk0XCJdLFxuODogW1wiIzY2YzJhNVwiLFwiI2ZjOGQ2MlwiLFwiIzhkYTBjYlwiLFwiI2U3OGFjM1wiLFwiI2E2ZDg1NFwiLFwiI2ZmZDkyZlwiLFwiI2U1YzQ5NFwiLFwiI2IzYjNiM1wiXVxufSxTZXQzOiB7XG4zOiBbXCIjOGRkM2M3XCIsXCIjZmZmZmIzXCIsXCIjYmViYWRhXCJdLFxuNDogW1wiIzhkZDNjN1wiLFwiI2ZmZmZiM1wiLFwiI2JlYmFkYVwiLFwiI2ZiODA3MlwiXSxcbjU6IFtcIiM4ZGQzYzdcIixcIiNmZmZmYjNcIixcIiNiZWJhZGFcIixcIiNmYjgwNzJcIixcIiM4MGIxZDNcIl0sXG42OiBbXCIjOGRkM2M3XCIsXCIjZmZmZmIzXCIsXCIjYmViYWRhXCIsXCIjZmI4MDcyXCIsXCIjODBiMWQzXCIsXCIjZmRiNDYyXCJdLFxuNzogW1wiIzhkZDNjN1wiLFwiI2ZmZmZiM1wiLFwiI2JlYmFkYVwiLFwiI2ZiODA3MlwiLFwiIzgwYjFkM1wiLFwiI2ZkYjQ2MlwiLFwiI2IzZGU2OVwiXSxcbjg6IFtcIiM4ZGQzYzdcIixcIiNmZmZmYjNcIixcIiNiZWJhZGFcIixcIiNmYjgwNzJcIixcIiM4MGIxZDNcIixcIiNmZGI0NjJcIixcIiNiM2RlNjlcIixcIiNmY2NkZTVcIl0sXG45OiBbXCIjOGRkM2M3XCIsXCIjZmZmZmIzXCIsXCIjYmViYWRhXCIsXCIjZmI4MDcyXCIsXCIjODBiMWQzXCIsXCIjZmRiNDYyXCIsXCIjYjNkZTY5XCIsXCIjZmNjZGU1XCIsXCIjZDlkOWQ5XCJdLFxuMTA6IFtcIiM4ZGQzYzdcIixcIiNmZmZmYjNcIixcIiNiZWJhZGFcIixcIiNmYjgwNzJcIixcIiM4MGIxZDNcIixcIiNmZGI0NjJcIixcIiNiM2RlNjlcIixcIiNmY2NkZTVcIixcIiNkOWQ5ZDlcIixcIiNiYzgwYmRcIl0sXG4xMTogW1wiIzhkZDNjN1wiLFwiI2ZmZmZiM1wiLFwiI2JlYmFkYVwiLFwiI2ZiODA3MlwiLFwiIzgwYjFkM1wiLFwiI2ZkYjQ2MlwiLFwiI2IzZGU2OVwiLFwiI2ZjY2RlNVwiLFwiI2Q5ZDlkOVwiLFwiI2JjODBiZFwiLFwiI2NjZWJjNVwiXSxcbjEyOiBbXCIjOGRkM2M3XCIsXCIjZmZmZmIzXCIsXCIjYmViYWRhXCIsXCIjZmI4MDcyXCIsXCIjODBiMWQzXCIsXCIjZmRiNDYyXCIsXCIjYjNkZTY5XCIsXCIjZmNjZGU1XCIsXCIjZDlkOWQ5XCIsXCIjYmM4MGJkXCIsXCIjY2NlYmM1XCIsXCIjZmZlZDZmXCJdXG59fTtcblxuaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGNvbG9yYnJld2VyKTtcbn0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gY29sb3JicmV3ZXI7XG59IGVsc2Uge1xuICAgIHRoaXMuY29sb3JicmV3ZXIgPSBjb2xvcmJyZXdlcjtcbn1cblxufSgpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvbG9yYnJld2VyLmpzJyk7XG4iLCJpZiAodHlwZW9mIE1hcCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICBNYXAgPSBmdW5jdGlvbigpIHt9O1xuICBNYXAucHJvdG90eXBlID0ge1xuICAgIHNldDogZnVuY3Rpb24oaywgdikgeyB0aGlzW1wiJFwiICsga10gPSB2OyByZXR1cm4gdGhpczsgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIHRoaXNbXCIkXCIgKyBrXTsgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIFwiJFwiICsgayBpbiB0aGlzOyB9XG4gIH07XG59XG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgZmFjdG9yeSgoZ2xvYmFsLmNvbG9yID0ge30pKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIENvbG9yKCkge31cblxuICBDb2xvci5wcm90b3R5cGUgPSB7XG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmdiKCkgKyBcIlwiO1xuICAgIH1cbiAgfTtcblxuICB2YXIgbmFtZWQgPSAobmV3IE1hcClcbiAgICAgIC5zZXQoXCJhbGljZWJsdWVcIiwgMHhmMGY4ZmYpXG4gICAgICAuc2V0KFwiYW50aXF1ZXdoaXRlXCIsIDB4ZmFlYmQ3KVxuICAgICAgLnNldChcImFxdWFcIiwgMHgwMGZmZmYpXG4gICAgICAuc2V0KFwiYXF1YW1hcmluZVwiLCAweDdmZmZkNClcbiAgICAgIC5zZXQoXCJhenVyZVwiLCAweGYwZmZmZilcbiAgICAgIC5zZXQoXCJiZWlnZVwiLCAweGY1ZjVkYylcbiAgICAgIC5zZXQoXCJiaXNxdWVcIiwgMHhmZmU0YzQpXG4gICAgICAuc2V0KFwiYmxhY2tcIiwgMHgwMDAwMDApXG4gICAgICAuc2V0KFwiYmxhbmNoZWRhbG1vbmRcIiwgMHhmZmViY2QpXG4gICAgICAuc2V0KFwiYmx1ZVwiLCAweDAwMDBmZilcbiAgICAgIC5zZXQoXCJibHVldmlvbGV0XCIsIDB4OGEyYmUyKVxuICAgICAgLnNldChcImJyb3duXCIsIDB4YTUyYTJhKVxuICAgICAgLnNldChcImJ1cmx5d29vZFwiLCAweGRlYjg4NylcbiAgICAgIC5zZXQoXCJjYWRldGJsdWVcIiwgMHg1ZjllYTApXG4gICAgICAuc2V0KFwiY2hhcnRyZXVzZVwiLCAweDdmZmYwMClcbiAgICAgIC5zZXQoXCJjaG9jb2xhdGVcIiwgMHhkMjY5MWUpXG4gICAgICAuc2V0KFwiY29yYWxcIiwgMHhmZjdmNTApXG4gICAgICAuc2V0KFwiY29ybmZsb3dlcmJsdWVcIiwgMHg2NDk1ZWQpXG4gICAgICAuc2V0KFwiY29ybnNpbGtcIiwgMHhmZmY4ZGMpXG4gICAgICAuc2V0KFwiY3JpbXNvblwiLCAweGRjMTQzYylcbiAgICAgIC5zZXQoXCJjeWFuXCIsIDB4MDBmZmZmKVxuICAgICAgLnNldChcImRhcmtibHVlXCIsIDB4MDAwMDhiKVxuICAgICAgLnNldChcImRhcmtjeWFuXCIsIDB4MDA4YjhiKVxuICAgICAgLnNldChcImRhcmtnb2xkZW5yb2RcIiwgMHhiODg2MGIpXG4gICAgICAuc2V0KFwiZGFya2dyYXlcIiwgMHhhOWE5YTkpXG4gICAgICAuc2V0KFwiZGFya2dyZWVuXCIsIDB4MDA2NDAwKVxuICAgICAgLnNldChcImRhcmtncmV5XCIsIDB4YTlhOWE5KVxuICAgICAgLnNldChcImRhcmtraGFraVwiLCAweGJkYjc2YilcbiAgICAgIC5zZXQoXCJkYXJrbWFnZW50YVwiLCAweDhiMDA4YilcbiAgICAgIC5zZXQoXCJkYXJrb2xpdmVncmVlblwiLCAweDU1NmIyZilcbiAgICAgIC5zZXQoXCJkYXJrb3JhbmdlXCIsIDB4ZmY4YzAwKVxuICAgICAgLnNldChcImRhcmtvcmNoaWRcIiwgMHg5OTMyY2MpXG4gICAgICAuc2V0KFwiZGFya3JlZFwiLCAweDhiMDAwMClcbiAgICAgIC5zZXQoXCJkYXJrc2FsbW9uXCIsIDB4ZTk5NjdhKVxuICAgICAgLnNldChcImRhcmtzZWFncmVlblwiLCAweDhmYmM4ZilcbiAgICAgIC5zZXQoXCJkYXJrc2xhdGVibHVlXCIsIDB4NDgzZDhiKVxuICAgICAgLnNldChcImRhcmtzbGF0ZWdyYXlcIiwgMHgyZjRmNGYpXG4gICAgICAuc2V0KFwiZGFya3NsYXRlZ3JleVwiLCAweDJmNGY0ZilcbiAgICAgIC5zZXQoXCJkYXJrdHVycXVvaXNlXCIsIDB4MDBjZWQxKVxuICAgICAgLnNldChcImRhcmt2aW9sZXRcIiwgMHg5NDAwZDMpXG4gICAgICAuc2V0KFwiZGVlcHBpbmtcIiwgMHhmZjE0OTMpXG4gICAgICAuc2V0KFwiZGVlcHNreWJsdWVcIiwgMHgwMGJmZmYpXG4gICAgICAuc2V0KFwiZGltZ3JheVwiLCAweDY5Njk2OSlcbiAgICAgIC5zZXQoXCJkaW1ncmV5XCIsIDB4Njk2OTY5KVxuICAgICAgLnNldChcImRvZGdlcmJsdWVcIiwgMHgxZTkwZmYpXG4gICAgICAuc2V0KFwiZmlyZWJyaWNrXCIsIDB4YjIyMjIyKVxuICAgICAgLnNldChcImZsb3JhbHdoaXRlXCIsIDB4ZmZmYWYwKVxuICAgICAgLnNldChcImZvcmVzdGdyZWVuXCIsIDB4MjI4YjIyKVxuICAgICAgLnNldChcImZ1Y2hzaWFcIiwgMHhmZjAwZmYpXG4gICAgICAuc2V0KFwiZ2FpbnNib3JvXCIsIDB4ZGNkY2RjKVxuICAgICAgLnNldChcImdob3N0d2hpdGVcIiwgMHhmOGY4ZmYpXG4gICAgICAuc2V0KFwiZ29sZFwiLCAweGZmZDcwMClcbiAgICAgIC5zZXQoXCJnb2xkZW5yb2RcIiwgMHhkYWE1MjApXG4gICAgICAuc2V0KFwiZ3JheVwiLCAweDgwODA4MClcbiAgICAgIC5zZXQoXCJncmVlblwiLCAweDAwODAwMClcbiAgICAgIC5zZXQoXCJncmVlbnllbGxvd1wiLCAweGFkZmYyZilcbiAgICAgIC5zZXQoXCJncmV5XCIsIDB4ODA4MDgwKVxuICAgICAgLnNldChcImhvbmV5ZGV3XCIsIDB4ZjBmZmYwKVxuICAgICAgLnNldChcImhvdHBpbmtcIiwgMHhmZjY5YjQpXG4gICAgICAuc2V0KFwiaW5kaWFucmVkXCIsIDB4Y2Q1YzVjKVxuICAgICAgLnNldChcImluZGlnb1wiLCAweDRiMDA4MilcbiAgICAgIC5zZXQoXCJpdm9yeVwiLCAweGZmZmZmMClcbiAgICAgIC5zZXQoXCJraGFraVwiLCAweGYwZTY4YylcbiAgICAgIC5zZXQoXCJsYXZlbmRlclwiLCAweGU2ZTZmYSlcbiAgICAgIC5zZXQoXCJsYXZlbmRlcmJsdXNoXCIsIDB4ZmZmMGY1KVxuICAgICAgLnNldChcImxhd25ncmVlblwiLCAweDdjZmMwMClcbiAgICAgIC5zZXQoXCJsZW1vbmNoaWZmb25cIiwgMHhmZmZhY2QpXG4gICAgICAuc2V0KFwibGlnaHRibHVlXCIsIDB4YWRkOGU2KVxuICAgICAgLnNldChcImxpZ2h0Y29yYWxcIiwgMHhmMDgwODApXG4gICAgICAuc2V0KFwibGlnaHRjeWFuXCIsIDB4ZTBmZmZmKVxuICAgICAgLnNldChcImxpZ2h0Z29sZGVucm9keWVsbG93XCIsIDB4ZmFmYWQyKVxuICAgICAgLnNldChcImxpZ2h0Z3JheVwiLCAweGQzZDNkMylcbiAgICAgIC5zZXQoXCJsaWdodGdyZWVuXCIsIDB4OTBlZTkwKVxuICAgICAgLnNldChcImxpZ2h0Z3JleVwiLCAweGQzZDNkMylcbiAgICAgIC5zZXQoXCJsaWdodHBpbmtcIiwgMHhmZmI2YzEpXG4gICAgICAuc2V0KFwibGlnaHRzYWxtb25cIiwgMHhmZmEwN2EpXG4gICAgICAuc2V0KFwibGlnaHRzZWFncmVlblwiLCAweDIwYjJhYSlcbiAgICAgIC5zZXQoXCJsaWdodHNreWJsdWVcIiwgMHg4N2NlZmEpXG4gICAgICAuc2V0KFwibGlnaHRzbGF0ZWdyYXlcIiwgMHg3Nzg4OTkpXG4gICAgICAuc2V0KFwibGlnaHRzbGF0ZWdyZXlcIiwgMHg3Nzg4OTkpXG4gICAgICAuc2V0KFwibGlnaHRzdGVlbGJsdWVcIiwgMHhiMGM0ZGUpXG4gICAgICAuc2V0KFwibGlnaHR5ZWxsb3dcIiwgMHhmZmZmZTApXG4gICAgICAuc2V0KFwibGltZVwiLCAweDAwZmYwMClcbiAgICAgIC5zZXQoXCJsaW1lZ3JlZW5cIiwgMHgzMmNkMzIpXG4gICAgICAuc2V0KFwibGluZW5cIiwgMHhmYWYwZTYpXG4gICAgICAuc2V0KFwibWFnZW50YVwiLCAweGZmMDBmZilcbiAgICAgIC5zZXQoXCJtYXJvb25cIiwgMHg4MDAwMDApXG4gICAgICAuc2V0KFwibWVkaXVtYXF1YW1hcmluZVwiLCAweDY2Y2RhYSlcbiAgICAgIC5zZXQoXCJtZWRpdW1ibHVlXCIsIDB4MDAwMGNkKVxuICAgICAgLnNldChcIm1lZGl1bW9yY2hpZFwiLCAweGJhNTVkMylcbiAgICAgIC5zZXQoXCJtZWRpdW1wdXJwbGVcIiwgMHg5MzcwZGIpXG4gICAgICAuc2V0KFwibWVkaXVtc2VhZ3JlZW5cIiwgMHgzY2IzNzEpXG4gICAgICAuc2V0KFwibWVkaXVtc2xhdGVibHVlXCIsIDB4N2I2OGVlKVxuICAgICAgLnNldChcIm1lZGl1bXNwcmluZ2dyZWVuXCIsIDB4MDBmYTlhKVxuICAgICAgLnNldChcIm1lZGl1bXR1cnF1b2lzZVwiLCAweDQ4ZDFjYylcbiAgICAgIC5zZXQoXCJtZWRpdW12aW9sZXRyZWRcIiwgMHhjNzE1ODUpXG4gICAgICAuc2V0KFwibWlkbmlnaHRibHVlXCIsIDB4MTkxOTcwKVxuICAgICAgLnNldChcIm1pbnRjcmVhbVwiLCAweGY1ZmZmYSlcbiAgICAgIC5zZXQoXCJtaXN0eXJvc2VcIiwgMHhmZmU0ZTEpXG4gICAgICAuc2V0KFwibW9jY2FzaW5cIiwgMHhmZmU0YjUpXG4gICAgICAuc2V0KFwibmF2YWpvd2hpdGVcIiwgMHhmZmRlYWQpXG4gICAgICAuc2V0KFwibmF2eVwiLCAweDAwMDA4MClcbiAgICAgIC5zZXQoXCJvbGRsYWNlXCIsIDB4ZmRmNWU2KVxuICAgICAgLnNldChcIm9saXZlXCIsIDB4ODA4MDAwKVxuICAgICAgLnNldChcIm9saXZlZHJhYlwiLCAweDZiOGUyMylcbiAgICAgIC5zZXQoXCJvcmFuZ2VcIiwgMHhmZmE1MDApXG4gICAgICAuc2V0KFwib3JhbmdlcmVkXCIsIDB4ZmY0NTAwKVxuICAgICAgLnNldChcIm9yY2hpZFwiLCAweGRhNzBkNilcbiAgICAgIC5zZXQoXCJwYWxlZ29sZGVucm9kXCIsIDB4ZWVlOGFhKVxuICAgICAgLnNldChcInBhbGVncmVlblwiLCAweDk4ZmI5OClcbiAgICAgIC5zZXQoXCJwYWxldHVycXVvaXNlXCIsIDB4YWZlZWVlKVxuICAgICAgLnNldChcInBhbGV2aW9sZXRyZWRcIiwgMHhkYjcwOTMpXG4gICAgICAuc2V0KFwicGFwYXlhd2hpcFwiLCAweGZmZWZkNSlcbiAgICAgIC5zZXQoXCJwZWFjaHB1ZmZcIiwgMHhmZmRhYjkpXG4gICAgICAuc2V0KFwicGVydVwiLCAweGNkODUzZilcbiAgICAgIC5zZXQoXCJwaW5rXCIsIDB4ZmZjMGNiKVxuICAgICAgLnNldChcInBsdW1cIiwgMHhkZGEwZGQpXG4gICAgICAuc2V0KFwicG93ZGVyYmx1ZVwiLCAweGIwZTBlNilcbiAgICAgIC5zZXQoXCJwdXJwbGVcIiwgMHg4MDAwODApXG4gICAgICAuc2V0KFwicmViZWNjYXB1cnBsZVwiLCAweDY2MzM5OSlcbiAgICAgIC5zZXQoXCJyZWRcIiwgMHhmZjAwMDApXG4gICAgICAuc2V0KFwicm9zeWJyb3duXCIsIDB4YmM4ZjhmKVxuICAgICAgLnNldChcInJveWFsYmx1ZVwiLCAweDQxNjllMSlcbiAgICAgIC5zZXQoXCJzYWRkbGVicm93blwiLCAweDhiNDUxMylcbiAgICAgIC5zZXQoXCJzYWxtb25cIiwgMHhmYTgwNzIpXG4gICAgICAuc2V0KFwic2FuZHlicm93blwiLCAweGY0YTQ2MClcbiAgICAgIC5zZXQoXCJzZWFncmVlblwiLCAweDJlOGI1NylcbiAgICAgIC5zZXQoXCJzZWFzaGVsbFwiLCAweGZmZjVlZSlcbiAgICAgIC5zZXQoXCJzaWVubmFcIiwgMHhhMDUyMmQpXG4gICAgICAuc2V0KFwic2lsdmVyXCIsIDB4YzBjMGMwKVxuICAgICAgLnNldChcInNreWJsdWVcIiwgMHg4N2NlZWIpXG4gICAgICAuc2V0KFwic2xhdGVibHVlXCIsIDB4NmE1YWNkKVxuICAgICAgLnNldChcInNsYXRlZ3JheVwiLCAweDcwODA5MClcbiAgICAgIC5zZXQoXCJzbGF0ZWdyZXlcIiwgMHg3MDgwOTApXG4gICAgICAuc2V0KFwic25vd1wiLCAweGZmZmFmYSlcbiAgICAgIC5zZXQoXCJzcHJpbmdncmVlblwiLCAweDAwZmY3ZilcbiAgICAgIC5zZXQoXCJzdGVlbGJsdWVcIiwgMHg0NjgyYjQpXG4gICAgICAuc2V0KFwidGFuXCIsIDB4ZDJiNDhjKVxuICAgICAgLnNldChcInRlYWxcIiwgMHgwMDgwODApXG4gICAgICAuc2V0KFwidGhpc3RsZVwiLCAweGQ4YmZkOClcbiAgICAgIC5zZXQoXCJ0b21hdG9cIiwgMHhmZjYzNDcpXG4gICAgICAuc2V0KFwidHVycXVvaXNlXCIsIDB4NDBlMGQwKVxuICAgICAgLnNldChcInZpb2xldFwiLCAweGVlODJlZSlcbiAgICAgIC5zZXQoXCJ3aGVhdFwiLCAweGY1ZGViMylcbiAgICAgIC5zZXQoXCJ3aGl0ZVwiLCAweGZmZmZmZilcbiAgICAgIC5zZXQoXCJ3aGl0ZXNtb2tlXCIsIDB4ZjVmNWY1KVxuICAgICAgLnNldChcInllbGxvd1wiLCAweGZmZmYwMClcbiAgICAgIC5zZXQoXCJ5ZWxsb3dncmVlblwiLCAweDlhY2QzMik7XG5cbiAgZnVuY3Rpb24gUmdiKHIsIGcsIGIpIHtcbiAgICB0aGlzLnIgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQocikpKTtcbiAgICB0aGlzLmcgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQoZykpKTtcbiAgICB0aGlzLmIgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQoYikpKTtcbiAgfVxuXG4gIHZhciBfcHJvdG90eXBlID0gUmdiLnByb3RvdHlwZSA9IG5ldyBDb2xvcjtcblxuICB2YXIgZGFya2VyID0gLjc7XG5cbiAgX3Byb3RvdHlwZS5kYXJrZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBSZ2IodGhpcy5yICogaywgdGhpcy5nICogaywgdGhpcy5iICogayk7XG4gIH07XG5cbiAgdmFyIGJyaWdodGVyID0gMSAvIGRhcmtlcjtcblxuICBfcHJvdG90eXBlLmJyaWdodGVyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IFJnYih0aGlzLnIgKiBrLCB0aGlzLmcgKiBrLCB0aGlzLmIgKiBrKTtcbiAgfTtcblxuICBfcHJvdG90eXBlLnJnYiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGZvcm1hdChyLCBnLCBiKSB7XG4gICAgaWYgKGlzTmFOKHIpKSByID0gMDtcbiAgICBpZiAoaXNOYU4oZykpIGcgPSAwO1xuICAgIGlmIChpc05hTihiKSkgYiA9IDA7XG4gICAgcmV0dXJuIFwiI1wiXG4gICAgICAgICsgKHIgPCAxNiA/IFwiMFwiICsgci50b1N0cmluZygxNikgOiByLnRvU3RyaW5nKDE2KSlcbiAgICAgICAgKyAoZyA8IDE2ID8gXCIwXCIgKyBnLnRvU3RyaW5nKDE2KSA6IGcudG9TdHJpbmcoMTYpKVxuICAgICAgICArIChiIDwgMTYgPyBcIjBcIiArIGIudG9TdHJpbmcoMTYpIDogYi50b1N0cmluZygxNikpO1xuICB9XG5cbiAgX3Byb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmb3JtYXQodGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XG4gIH07XG5cbiAgdmFyIHJnYiA9IGZ1bmN0aW9uKHIsIGcsIGIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKCEociBpbnN0YW5jZW9mIENvbG9yKSkgciA9IGNvbG9yKHIpO1xuICAgICAgaWYgKHIpIHtcbiAgICAgICAgciA9IHIucmdiKCk7XG4gICAgICAgIGIgPSByLmI7XG4gICAgICAgIGcgPSByLmc7XG4gICAgICAgIHIgPSByLnI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByID0gZyA9IGIgPSBOYU47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgUmdiKHIsIGcsIGIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmdibihuKSB7XG4gICAgcmV0dXJuIHJnYihuID4+IDE2ICYgMHhmZiwgbiA+PiA4ICYgMHhmZiwgbiAmIDB4ZmYpO1xuICB9XG5cbiAgZnVuY3Rpb24gSHNsKGgsIHMsIGwpIHtcbiAgICB0aGlzLmggPSAraDtcbiAgICB0aGlzLnMgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCArcykpO1xuICAgIHRoaXMubCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsICtsKSk7XG4gIH1cblxuICB2YXIgX19wcm90b3R5cGUgPSBIc2wucHJvdG90eXBlID0gbmV3IENvbG9yO1xuXG4gIF9fcHJvdG90eXBlLmJyaWdodGVyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogayk7XG4gIH07XG5cbiAgX19wcm90b3R5cGUuZGFya2VyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgSHNsKHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrKTtcbiAgfTsvKiBGcm9tIEZ2RCAxMy4zNywgQ1NTIENvbG9yIE1vZHVsZSBMZXZlbCAzICovXG5cbiAgZnVuY3Rpb24gaHNsMnJnYihoLCBtMSwgbTIpIHtcbiAgICByZXR1cm4gKGggPCA2MCA/IG0xICsgKG0yIC0gbTEpICogaCAvIDYwXG4gICAgICAgIDogaCA8IDE4MCA/IG0yXG4gICAgICAgIDogaCA8IDI0MCA/IG0xICsgKG0yIC0gbTEpICogKDI0MCAtIGgpIC8gNjBcbiAgICAgICAgOiBtMSkgKiAyNTU7XG4gIH1cblxuICBfX3Byb3RvdHlwZS5yZ2IgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaCA9IHRoaXMuaCAlIDM2MCArICh0aGlzLmggPCAwKSAqIDM2MCxcbiAgICAgICAgcyA9IGlzTmFOKGgpIHx8IGlzTmFOKHRoaXMucykgPyAwIDogdGhpcy5zLFxuICAgICAgICBsID0gdGhpcy5sLFxuICAgICAgICBtMiA9IGwgPD0gLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHMsXG4gICAgICAgIG0xID0gMiAqIGwgLSBtMjtcbiAgICByZXR1cm4gbmV3IFJnYihcbiAgICAgIGhzbDJyZ2IoaCA+PSAyNDAgPyBoIC0gMjQwIDogaCArIDEyMCwgbTEsIG0yKSxcbiAgICAgIGhzbDJyZ2IoaCwgbTEsIG0yKSxcbiAgICAgIGhzbDJyZ2IoaCA8IDEyMCA/IGggKyAyNDAgOiBoIC0gMTIwLCBtMSwgbTIpXG4gICAgKTtcbiAgfTtcblxuICB2YXIgaHNsID0gZnVuY3Rpb24oaCwgcywgbCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoaCBpbnN0YW5jZW9mIEhzbCkge1xuICAgICAgICBsID0gaC5sO1xuICAgICAgICBzID0gaC5zO1xuICAgICAgICBoID0gaC5oO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCEoaCBpbnN0YW5jZW9mIENvbG9yKSkgaCA9IGNvbG9yKGgpO1xuICAgICAgICBpZiAoaCkge1xuICAgICAgICAgIGlmIChoIGluc3RhbmNlb2YgSHNsKSByZXR1cm4gaDtcbiAgICAgICAgICBoID0gaC5yZ2IoKTtcbiAgICAgICAgICB2YXIgciA9IGguciAvIDI1NSxcbiAgICAgICAgICAgICAgZyA9IGguZyAvIDI1NSxcbiAgICAgICAgICAgICAgYiA9IGguYiAvIDI1NSxcbiAgICAgICAgICAgICAgbWluID0gTWF0aC5taW4ociwgZywgYiksXG4gICAgICAgICAgICAgIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLFxuICAgICAgICAgICAgICByYW5nZSA9IG1heCAtIG1pbjtcbiAgICAgICAgICBsID0gKG1heCArIG1pbikgLyAyO1xuICAgICAgICAgIGlmIChyYW5nZSkge1xuICAgICAgICAgICAgcyA9IGwgPCAuNSA/IHJhbmdlIC8gKG1heCArIG1pbikgOiByYW5nZSAvICgyIC0gbWF4IC0gbWluKTtcbiAgICAgICAgICAgIGlmIChyID09PSBtYXgpIGggPSAoZyAtIGIpIC8gcmFuZ2UgKyAoZyA8IGIpICogNjtcbiAgICAgICAgICAgIGVsc2UgaWYgKGcgPT09IG1heCkgaCA9IChiIC0gcikgLyByYW5nZSArIDI7XG4gICAgICAgICAgICBlbHNlIGggPSAociAtIGcpIC8gcmFuZ2UgKyA0O1xuICAgICAgICAgICAgaCAqPSA2MDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaCA9IE5hTjtcbiAgICAgICAgICAgIHMgPSBsID4gMCAmJiBsIDwgMSA/IDAgOiBoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoID0gcyA9IGwgPSBOYU47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBIc2woaCwgcywgbCk7XG4gIH1cblxuICB2YXIgcmVIZXgzID0gL14jKFswLTlhLWZdezN9KSQvLFxuICAgICAgcmVIZXg2ID0gL14jKFswLTlhLWZdezZ9KSQvLFxuICAgICAgcmVSZ2JJbnRlZ2VyID0gL15yZ2JcXChcXHMqKFstK10/XFxkKylcXHMqLFxccyooWy0rXT9cXGQrKVxccyosXFxzKihbLStdP1xcZCspXFxzKlxcKSQvLFxuICAgICAgcmVSZ2JQZXJjZW50ID0gL15yZ2JcXChcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKlxcKSQvLFxuICAgICAgcmVIc2xQZXJjZW50ID0gL15oc2xcXChcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPylcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqXFwpJC87XG5cbiAgdmFyIGNvbG9yID0gZnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgdmFyIG07XG4gICAgZm9ybWF0ID0gKGZvcm1hdCArIFwiXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiAobSA9IHJlSGV4My5leGVjKGZvcm1hdCkpID8gKG0gPSBwYXJzZUludChtWzFdLCAxNiksIHJnYigobSA+PiA4ICYgMHhmKSB8IChtID4+IDQgJiAweDBmMCksIChtID4+IDQgJiAweGYpIHwgKG0gJiAweGYwKSwgKChtICYgMHhmKSA8PCA0KSB8IChtICYgMHhmKSkpIC8vICNmMDBcbiAgICAgICAgOiAobSA9IHJlSGV4Ni5leGVjKGZvcm1hdCkpID8gcmdibihwYXJzZUludChtWzFdLCAxNikpIC8vICNmZjAwMDBcbiAgICAgICAgOiAobSA9IHJlUmdiSW50ZWdlci5leGVjKGZvcm1hdCkpID8gcmdiKG1bMV0sIG1bMl0sIG1bM10pIC8vIHJnYigyNTUsMCwwKVxuICAgICAgICA6IChtID0gcmVSZ2JQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyByZ2IobVsxXSAqIDIuNTUsIG1bMl0gKiAyLjU1LCBtWzNdICogMi41NSkgLy8gcmdiKDEwMCUsMCUsMCUpXG4gICAgICAgIDogKG0gPSByZUhzbFBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IGhzbChtWzFdLCBtWzJdICogLjAxLCBtWzNdICogLjAxKSAvLyBoc2woMTIwLDUwJSw1MCUpXG4gICAgICAgIDogbmFtZWQuaGFzKGZvcm1hdCkgPyByZ2JuKG5hbWVkLmdldChmb3JtYXQpKVxuICAgICAgICA6IG51bGw7XG4gIH0vLyBEb25lIGxhemlseSB0byBhdm9pZCBjaXJjdWxhciBkZXBlbmRlbmN5IGJldHdlZW4gQ29sb3IsIFJnYiBhbmQgSHNsLlxuXG4gIGNvbG9yLnByb3RvdHlwZSA9IENvbG9yLnByb3RvdHlwZTtcbiAgcmdiLnByb3RvdHlwZSA9IFJnYi5wcm90b3R5cGU7XG4gIGhzbC5wcm90b3R5cGUgPSBIc2wucHJvdG90eXBlO1xuXG4gIGZ1bmN0aW9uIExhYihsLCBhLCBiKSB7XG4gICAgdGhpcy5sID0gK2w7XG4gICAgdGhpcy5hID0gK2E7XG4gICAgdGhpcy5iID0gK2I7XG4gIH1cblxuICB2YXIgX19fcHJvdG90eXBlID0gTGFiLnByb3RvdHlwZSA9IG5ldyBDb2xvcjtcblxuICB2YXIgS24gPSAxODtcblxuICBfX19wcm90b3R5cGUuYnJpZ2h0ZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIG5ldyBMYWIodGhpcy5sICsgS24gKiAoayA9PSBudWxsID8gMSA6IGspLCB0aGlzLmEsIHRoaXMuYik7XG4gIH07XG5cbiAgX19fcHJvdG90eXBlLmRhcmtlciA9IGZ1bmN0aW9uKGspIHtcbiAgICByZXR1cm4gbmV3IExhYih0aGlzLmwgLSBLbiAqIChrID09IG51bGwgPyAxIDogayksIHRoaXMuYSwgdGhpcy5iKTtcbiAgfTtcblxuICBmdW5jdGlvbiB4eXoycmdiKHgpIHtcbiAgICByZXR1cm4gMjU1ICogKHggPD0gMC4wMDMxMzA4ID8gMTIuOTIgKiB4IDogMS4wNTUgKiBNYXRoLnBvdyh4LCAxIC8gMi40KSAtIDAuMDU1KTtcbiAgfVxuXG4gIHZhciBYbiA9IDAuOTUwNDcwLCAvLyBENjUgc3RhbmRhcmQgcmVmZXJlbnRcbiAgICAgIFluID0gMSxcbiAgICAgIFpuID0gMS4wODg4MzAsXG4gICAgICB0MCA9IDQgLyAyOSxcbiAgICAgIHQxID0gNiAvIDI5LFxuICAgICAgdDIgPSAzICogdDEgKiB0MSxcbiAgICAgIHQzID0gdDEgKiB0MSAqIHQxO1xuXG4gIGZ1bmN0aW9uIGxhYjJ4eXoodCkge1xuICAgIHJldHVybiB0ID4gdDEgPyB0ICogdCAqIHQgOiB0MiAqICh0IC0gdDApO1xuICB9XG5cbiAgX19fcHJvdG90eXBlLnJnYiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB5ID0gKHRoaXMubCArIDE2KSAvIDExNixcbiAgICAgICAgeCA9IGlzTmFOKHRoaXMuYSkgPyB5IDogeSArIHRoaXMuYSAvIDUwMCxcbiAgICAgICAgeiA9IGlzTmFOKHRoaXMuYikgPyB5IDogeSAtIHRoaXMuYiAvIDIwMDtcbiAgICB5ID0gWW4gKiBsYWIyeHl6KHkpO1xuICAgIHggPSBYbiAqIGxhYjJ4eXooeCk7XG4gICAgeiA9IFpuICogbGFiMnh5eih6KTtcbiAgICByZXR1cm4gbmV3IFJnYihcbiAgICAgIHh5ejJyZ2IoIDMuMjQwNDU0MiAqIHggLSAxLjUzNzEzODUgKiB5IC0gMC40OTg1MzE0ICogeiksIC8vIEQ2NSAtPiBzUkdCXG4gICAgICB4eXoycmdiKC0wLjk2OTI2NjAgKiB4ICsgMS44NzYwMTA4ICogeSArIDAuMDQxNTU2MCAqIHopLFxuICAgICAgeHl6MnJnYiggMC4wNTU2NDM0ICogeCAtIDAuMjA0MDI1OSAqIHkgKyAxLjA1NzIyNTIgKiB6KVxuICAgICk7XG4gIH07XG5cbiAgZnVuY3Rpb24geHl6MmxhYih0KSB7XG4gICAgcmV0dXJuIHQgPiB0MyA/IE1hdGgucG93KHQsIDEgLyAzKSA6IHQgLyB0MiArIHQwO1xuICB9XG5cbiAgZnVuY3Rpb24gcmdiMnh5eih4KSB7XG4gICAgcmV0dXJuICh4IC89IDI1NSkgPD0gMC4wNDA0NSA/IHggLyAxMi45MiA6IE1hdGgucG93KCh4ICsgMC4wNTUpIC8gMS4wNTUsIDIuNCk7XG4gIH1cblxuICB2YXIgZGVnMnJhZCA9IE1hdGguUEkgLyAxODA7XG5cbiAgZnVuY3Rpb24gSGNsKGgsIGMsIGwpIHtcbiAgICB0aGlzLmggPSAraDtcbiAgICB0aGlzLmMgPSArYztcbiAgICB0aGlzLmwgPSArbDtcbiAgfVxuXG4gIHZhciBfX19fcHJvdG90eXBlID0gSGNsLnByb3RvdHlwZSA9IG5ldyBDb2xvcjtcblxuICBfX19fcHJvdG90eXBlLmJyaWdodGVyID0gZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgSGNsKHRoaXMuaCwgdGhpcy5jLCB0aGlzLmwgKyBLbiAqIChrID09IG51bGwgPyAxIDogaykpO1xuICB9O1xuXG4gIF9fX19wcm90b3R5cGUuZGFya2VyID0gZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgSGNsKHRoaXMuaCwgdGhpcy5jLCB0aGlzLmwgLSBLbiAqIChrID09IG51bGwgPyAxIDogaykpO1xuICB9O1xuXG4gIF9fX19wcm90b3R5cGUucmdiID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGxhYih0aGlzKS5yZ2IoKTtcbiAgfTtcblxuICB2YXIgbGFiID0gZnVuY3Rpb24obCwgYSwgYikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAobCBpbnN0YW5jZW9mIExhYikge1xuICAgICAgICBiID0gbC5iO1xuICAgICAgICBhID0gbC5hO1xuICAgICAgICBsID0gbC5sO1xuICAgICAgfSBlbHNlIGlmIChsIGluc3RhbmNlb2YgSGNsKSB7XG4gICAgICAgIHZhciBoID0gbC5oICogZGVnMnJhZDtcbiAgICAgICAgYiA9IE1hdGguc2luKGgpICogbC5jO1xuICAgICAgICBhID0gTWF0aC5jb3MoaCkgKiBsLmM7XG4gICAgICAgIGwgPSBsLmw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIShsIGluc3RhbmNlb2YgUmdiKSkgbCA9IHJnYihsKTtcbiAgICAgICAgdmFyIHIgPSByZ2IyeHl6KGwuciksXG4gICAgICAgICAgICBnID0gcmdiMnh5eihsLmcpLFxuICAgICAgICAgICAgYiA9IHJnYjJ4eXoobC5iKSxcbiAgICAgICAgICAgIHggPSB4eXoybGFiKCgwLjQxMjQ1NjQgKiByICsgMC4zNTc1NzYxICogZyArIDAuMTgwNDM3NSAqIGIpIC8gWG4pLFxuICAgICAgICAgICAgeSA9IHh5ejJsYWIoKDAuMjEyNjcyOSAqIHIgKyAwLjcxNTE1MjIgKiBnICsgMC4wNzIxNzUwICogYikgLyBZbiksXG4gICAgICAgICAgICB6ID0geHl6MmxhYigoMC4wMTkzMzM5ICogciArIDAuMTE5MTkyMCAqIGcgKyAwLjk1MDMwNDEgKiBiKSAvIFpuKTtcbiAgICAgICAgYiA9IDIwMCAqICh5IC0geik7XG4gICAgICAgIGEgPSA1MDAgKiAoeCAtIHkpO1xuICAgICAgICBsID0gMTE2ICogeSAtIDE2O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IExhYihsLCBhLCBiKTtcbiAgfVxuICBsYWIucHJvdG90eXBlID0gTGFiLnByb3RvdHlwZTtcbiAgdmFyIHJhZDJkZWcgPSAxODAgLyBNYXRoLlBJO1xuXG4gIHZhciBoY2wgPSBmdW5jdGlvbihoLCBjLCBsKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmIChoIGluc3RhbmNlb2YgSGNsKSB7XG4gICAgICAgIGwgPSBoLmw7XG4gICAgICAgIGMgPSBoLmM7XG4gICAgICAgIGggPSBoLmg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIShoIGluc3RhbmNlb2YgTGFiKSkgaCA9IGxhYihoKTtcbiAgICAgICAgbCA9IGgubDtcbiAgICAgICAgYyA9IE1hdGguc3FydChoLmEgKiBoLmEgKyBoLmIgKiBoLmIpO1xuICAgICAgICBoID0gTWF0aC5hdGFuMihoLmIsIGguYSkgKiByYWQyZGVnO1xuICAgICAgICBpZiAoaCA8IDApIGggKz0gMzYwO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEhjbChoLCBjLCBsKTtcbiAgfVxuICBoY2wucHJvdG90eXBlID0gSGNsLnByb3RvdHlwZTtcblxuICBmdW5jdGlvbiBDdWJlaGVsaXgoaCwgcywgbCkge1xuICAgIHRoaXMuaCA9ICtoO1xuICAgIHRoaXMucyA9ICtzO1xuICAgIHRoaXMubCA9ICtsO1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZSA9IEN1YmVoZWxpeC5wcm90b3R5cGUgPSBuZXcgQ29sb3I7XG5cbiAgcHJvdG90eXBlLmJyaWdodGVyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IEN1YmVoZWxpeCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogayk7XG4gIH07XG5cbiAgcHJvdG90eXBlLmRhcmtlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gZGFya2VyIDogTWF0aC5wb3coZGFya2VyLCBrKTtcbiAgICByZXR1cm4gbmV3IEN1YmVoZWxpeCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogayk7XG4gIH07XG5cbiAgdmFyIGdhbW1hID0gMSwgLy8gRGVmYXVsdCBnYW1tYS4gVE9ETyBDdXN0b21pemUuXG4gICAgICBBID0gLTAuMTQ4NjEsXG4gICAgICBCID0gKzEuNzgyNzcsXG4gICAgICBDID0gLTAuMjkyMjcsXG4gICAgICBEID0gLTAuOTA2NDksXG4gICAgICBFID0gKzEuOTcyOTQsXG4gICAgICBFRCA9IEUgKiBELFxuICAgICAgRUIgPSBFICogQixcbiAgICAgIEJDX0RBID0gQiAqIEMgLSBEICogQTtcblxuICB2YXIgY3ViZWhlbGl4ID0gZnVuY3Rpb24oaCwgcywgbCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoaCBpbnN0YW5jZW9mIEN1YmVoZWxpeCkge1xuICAgICAgICBsID0gaC5sO1xuICAgICAgICBzID0gaC5zO1xuICAgICAgICBoID0gaC5oO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCEoaCBpbnN0YW5jZW9mIFJnYikpIGggPSByZ2IoaCk7XG4gICAgICAgIHZhciByID0gaC5yIC8gMjU1LCBnID0gaC5nIC8gMjU1LCBiID0gaC5iIC8gMjU1O1xuICAgICAgICBsID0gKEJDX0RBICogYiArIEVEICogciAtIEVCICogZykgLyAoQkNfREEgKyBFRCAtIEVCKTtcbiAgICAgICAgdmFyIGJsID0gYiAtIGwsIGsgPSAoRSAqIChnIC0gbCkgLSBDICogYmwpIC8gRCwgbGdhbW1hID0gTWF0aC5wb3cobCwgZ2FtbWEpO1xuICAgICAgICBzID0gTWF0aC5zcXJ0KGsgKiBrICsgYmwgKiBibCkgLyAoRSAqIGxnYW1tYSAqICgxIC0gbGdhbW1hKSk7IC8vIE5hTiBpZiBsZ2FtbWE9MCBvciBsZ2FtbWE9MVxuICAgICAgICBoID0gcyA/IE1hdGguYXRhbjIoaywgYmwpICogcmFkMmRlZyAtIDEyMCA6IE5hTjtcbiAgICAgICAgaWYgKGggPCAwKSBoICs9IDM2MDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDdWJlaGVsaXgoaCwgcywgbCk7XG4gIH1cblxuICBwcm90b3R5cGUucmdiID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGggPSBpc05hTih0aGlzLmgpID8gMCA6ICh0aGlzLmggKyAxMjApICogZGVnMnJhZCxcbiAgICAgICAgbCA9IE1hdGgucG93KHRoaXMubCwgZ2FtbWEpLFxuICAgICAgICBhID0gaXNOYU4odGhpcy5zKSA/IDAgOiB0aGlzLnMgKiBsICogKDEgLSBsKSxcbiAgICAgICAgY29zaCA9IE1hdGguY29zKGgpLFxuICAgICAgICBzaW5oID0gTWF0aC5zaW4oaCk7XG4gICAgcmV0dXJuIG5ldyBSZ2IoXG4gICAgICAyNTUgKiAobCArIGEgKiAoQSAqIGNvc2ggKyBCICogc2luaCkpLFxuICAgICAgMjU1ICogKGwgKyBhICogKEMgKiBjb3NoICsgRCAqIHNpbmgpKSxcbiAgICAgIDI1NSAqIChsICsgYSAqIChFICogY29zaCkpXG4gICAgKTtcbiAgfTtcbiAgY3ViZWhlbGl4LnByb3RvdHlwZSA9IEN1YmVoZWxpeC5wcm90b3R5cGU7XG5cbiAgdmFyIGludGVycG9sYXRlQ3ViZWhlbGl4TG9uZyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBhID0gY3ViZWhlbGl4KGEpO1xuICAgIGIgPSBjdWJlaGVsaXgoYik7XG4gICAgdmFyIGFoID0gaXNOYU4oYS5oKSA/IGIuaCA6IGEuaCxcbiAgICAgICAgYXMgPSBpc05hTihhLnMpID8gYi5zIDogYS5zLFxuICAgICAgICBhbCA9IGEubCxcbiAgICAgICAgYmggPSBpc05hTihiLmgpID8gMCA6IGIuaCAtIGFoLFxuICAgICAgICBicyA9IGlzTmFOKGIucykgPyAwIDogYi5zIC0gYXMsXG4gICAgICAgIGJsID0gYi5sIC0gYWw7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGEuaCA9IGFoICsgYmggKiB0O1xuICAgICAgYS5zID0gYXMgKyBicyAqIHQ7XG4gICAgICBhLmwgPSBhbCArIGJsICogdDtcbiAgICAgIHJldHVybiBhICsgXCJcIjtcbiAgICB9O1xuICB9XG4gIHZhciBkZWx0YUh1ZSA9IGZ1bmN0aW9uKGgsIGgwKSB7XG4gICAgdmFyIGRlbHRhID0gKGggLSBoMCkgJSAzNjA7XG4gICAgcmV0dXJuIGRlbHRhICsgKGRlbHRhID4gMTgwID8gLTM2MCA6IGRlbHRhIDwgLTE4MCA/IDM2MCA6IDApO1xuICB9XG5cbiAgdmFyIGludGVycG9sYXRlQ3ViZWhlbGl4ID0gZnVuY3Rpb24oYSwgYikge1xuICAgIGEgPSBjdWJlaGVsaXgoYSk7XG4gICAgYiA9IGN1YmVoZWxpeChiKTtcbiAgICB2YXIgYWggPSBpc05hTihhLmgpID8gYi5oIDogYS5oLFxuICAgICAgICBhcyA9IGlzTmFOKGEucykgPyBiLnMgOiBhLnMsXG4gICAgICAgIGFsID0gYS5sLFxuICAgICAgICBiaCA9IGlzTmFOKGIuaCkgPyAwIDogZGVsdGFIdWUoYi5oLCBhaCksXG4gICAgICAgIGJzID0gaXNOYU4oYi5zKSA/IDAgOiBiLnMgLSBhcyxcbiAgICAgICAgYmwgPSBiLmwgLSBhbDtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgYS5oID0gYWggKyBiaCAqIHQ7XG4gICAgICBhLnMgPSBhcyArIGJzICogdDtcbiAgICAgIGEubCA9IGFsICsgYmwgKiB0O1xuICAgICAgcmV0dXJuIGEgKyBcIlwiO1xuICAgIH07XG4gIH1cblxuICB2YXIgaW50ZXJwb2xhdGVIY2xMb25nID0gZnVuY3Rpb24oYSwgYikge1xuICAgIGEgPSBoY2woYSk7XG4gICAgYiA9IGhjbChiKTtcbiAgICB2YXIgYWggPSBpc05hTihhLmgpID8gYi5oIDogYS5oLFxuICAgICAgICBhYyA9IGlzTmFOKGEuYykgPyBiLmMgOiBhLmMsXG4gICAgICAgIGFsID0gYS5sLFxuICAgICAgICBiaCA9IGlzTmFOKGIuaCkgPyAwIDogYi5oIC0gYWgsXG4gICAgICAgIGJjID0gaXNOYU4oYi5jKSA/IDAgOiBiLmMgLSBhYyxcbiAgICAgICAgYmwgPSBiLmwgLSBhbDtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgYS5oID0gYWggKyBiaCAqIHQ7XG4gICAgICBhLmMgPSBhYyArIGJjICogdDtcbiAgICAgIGEubCA9IGFsICsgYmwgKiB0O1xuICAgICAgcmV0dXJuIGEgKyBcIlwiO1xuICAgIH07XG4gIH1cblxuICB2YXIgaW50ZXJwb2xhdGVIY2wgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgYSA9IGhjbChhKTtcbiAgICBiID0gaGNsKGIpO1xuICAgIHZhciBhaCA9IGlzTmFOKGEuaCkgPyBiLmggOiBhLmgsXG4gICAgICAgIGFjID0gaXNOYU4oYS5jKSA/IGIuYyA6IGEuYyxcbiAgICAgICAgYWwgPSBhLmwsXG4gICAgICAgIGJoID0gaXNOYU4oYi5oKSA/IDAgOiBkZWx0YUh1ZShiLmgsIGFoKSxcbiAgICAgICAgYmMgPSBpc05hTihiLmMpID8gMCA6IGIuYyAtIGFjLFxuICAgICAgICBibCA9IGIubCAtIGFsO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBhLmggPSBhaCArIGJoICogdDtcbiAgICAgIGEuYyA9IGFjICsgYmMgKiB0O1xuICAgICAgYS5sID0gYWwgKyBibCAqIHQ7XG4gICAgICByZXR1cm4gYSArIFwiXCI7XG4gICAgfTtcbiAgfVxuXG4gIHZhciBpbnRlcnBvbGF0ZUxhYiA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBhID0gbGFiKGEpO1xuICAgIGIgPSBsYWIoYik7XG4gICAgdmFyIGFsID0gYS5sLFxuICAgICAgICBhYSA9IGEuYSxcbiAgICAgICAgYWIgPSBhLmIsXG4gICAgICAgIGJsID0gYi5sIC0gYWwsXG4gICAgICAgIGJhID0gYi5hIC0gYWEsXG4gICAgICAgIGJiID0gYi5iIC0gYWI7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGEubCA9IGFsICsgYmwgKiB0O1xuICAgICAgYS5hID0gYWEgKyBiYSAqIHQ7XG4gICAgICBhLmIgPSBhYiArIGJiICogdDtcbiAgICAgIHJldHVybiBhICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgdmFyIGludGVycG9sYXRlSHNsTG9uZyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBhID0gaHNsKGEpO1xuICAgIGIgPSBoc2woYik7XG4gICAgdmFyIGFoID0gaXNOYU4oYS5oKSA/IGIuaCA6IGEuaCxcbiAgICAgICAgYXMgPSBpc05hTihhLnMpID8gYi5zIDogYS5zLFxuICAgICAgICBhbCA9IGEubCxcbiAgICAgICAgYmggPSBpc05hTihiLmgpID8gMCA6IGIuaCAtIGFoLFxuICAgICAgICBicyA9IGlzTmFOKGIucykgPyAwIDogYi5zIC0gYXMsXG4gICAgICAgIGJsID0gYi5sIC0gYWw7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGEuaCA9IGFoICsgYmggKiB0O1xuICAgICAgYS5zID0gYXMgKyBicyAqIHQ7XG4gICAgICBhLmwgPSBhbCArIGJsICogdDtcbiAgICAgIHJldHVybiBhICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgdmFyIGludGVycG9sYXRlSHNsID0gZnVuY3Rpb24oYSwgYikge1xuICAgIGEgPSBoc2woYSk7XG4gICAgYiA9IGhzbChiKTtcbiAgICB2YXIgYWggPSBpc05hTihhLmgpID8gYi5oIDogYS5oLFxuICAgICAgICBhcyA9IGlzTmFOKGEucykgPyBiLnMgOiBhLnMsXG4gICAgICAgIGFsID0gYS5sLFxuICAgICAgICBiaCA9IGlzTmFOKGIuaCkgPyAwIDogZGVsdGFIdWUoYi5oLCBhaCksXG4gICAgICAgIGJzID0gaXNOYU4oYi5zKSA/IDAgOiBiLnMgLSBhcyxcbiAgICAgICAgYmwgPSBiLmwgLSBhbDtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgYS5oID0gYWggKyBiaCAqIHQ7XG4gICAgICBhLnMgPSBhcyArIGJzICogdDtcbiAgICAgIGEubCA9IGFsICsgYmwgKiB0O1xuICAgICAgcmV0dXJuIGEgKyBcIlwiO1xuICAgIH07XG4gIH1cblxuICB2YXIgaW50ZXJwb2xhdGVSZ2IgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgYSA9IHJnYihhKTtcbiAgICBiID0gcmdiKGIpO1xuICAgIHZhciBhciA9IGEucixcbiAgICAgICAgYWcgPSBhLmcsXG4gICAgICAgIGFiID0gYS5iLFxuICAgICAgICBiciA9IGIuciAtIGFyLFxuICAgICAgICBiZyA9IGIuZyAtIGFnLFxuICAgICAgICBiYiA9IGIuYiAtIGFiO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gZm9ybWF0KE1hdGgucm91bmQoYXIgKyBiciAqIHQpLCBNYXRoLnJvdW5kKGFnICsgYmcgKiB0KSwgTWF0aC5yb3VuZChhYiArIGJiICogdCkpO1xuICAgIH07XG4gIH1cblxuICBleHBvcnRzLmNvbG9yID0gY29sb3I7XG4gIGV4cG9ydHMucmdiID0gcmdiO1xuICBleHBvcnRzLmhzbCA9IGhzbDtcbiAgZXhwb3J0cy5sYWIgPSBsYWI7XG4gIGV4cG9ydHMuaGNsID0gaGNsO1xuICBleHBvcnRzLmN1YmVoZWxpeCA9IGN1YmVoZWxpeDtcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZVJnYiA9IGludGVycG9sYXRlUmdiO1xuICBleHBvcnRzLmludGVycG9sYXRlSHNsID0gaW50ZXJwb2xhdGVIc2w7XG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVIc2xMb25nID0gaW50ZXJwb2xhdGVIc2xMb25nO1xuICBleHBvcnRzLmludGVycG9sYXRlTGFiID0gaW50ZXJwb2xhdGVMYWI7XG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVIY2wgPSBpbnRlcnBvbGF0ZUhjbDtcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUhjbExvbmcgPSBpbnRlcnBvbGF0ZUhjbExvbmc7XG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVDdWJlaGVsaXggPSBpbnRlcnBvbGF0ZUN1YmVoZWxpeDtcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUN1YmVoZWxpeExvbmcgPSBpbnRlcnBvbGF0ZUN1YmVoZWxpeExvbmc7XG5cbn0pKTsiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gIGZhY3RvcnkoKGdsb2JhbC5mb3JtYXQgPSB7fSkpO1xufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgdmFyIHByZWZpeGVzID0gW1wieVwiLFwielwiLFwiYVwiLFwiZlwiLFwicFwiLFwiblwiLFwiwrVcIixcIm1cIixcIlwiLFwia1wiLFwiTVwiLFwiR1wiLFwiVFwiLFwiUFwiLFwiRVwiLFwiWlwiLFwiWVwiXTtcblxuXG4gIC8vIENvbXB1dGVzIHRoZSBkZWNpbWFsIGNvZWZmaWNpZW50IGFuZCBleHBvbmVudCBvZiB0aGUgc3BlY2lmaWVkIG51bWJlciB4IHdpdGhcbiAgLy8gc2lnbmlmaWNhbnQgZGlnaXRzIHAsIHdoZXJlIHggaXMgcG9zaXRpdmUgYW5kIHAgaXMgaW4gWzEsIDIxXSBvciB1bmRlZmluZWQuXG4gIC8vIEZvciBleGFtcGxlLCBmb3JtYXREZWNpbWFsKDEuMjMpIHJldHVybnMgW1wiMTIzXCIsIDBdLlxuICBmdW5jdGlvbiBmb3JtYXREZWNpbWFsKHgsIHApIHtcbiAgICBpZiAoKGkgPSAoeCA9IHAgPyB4LnRvRXhwb25lbnRpYWwocCAtIDEpIDogeC50b0V4cG9uZW50aWFsKCkpLmluZGV4T2YoXCJlXCIpKSA8IDApIHJldHVybiBudWxsOyAvLyBOYU4sIMKxSW5maW5pdHlcbiAgICB2YXIgaSwgY29lZmZpY2llbnQgPSB4LnNsaWNlKDAsIGkpO1xuXG4gICAgLy8gVGhlIHN0cmluZyByZXR1cm5lZCBieSB0b0V4cG9uZW50aWFsIGVpdGhlciBoYXMgdGhlIGZvcm0gXFxkXFwuXFxkK2VbLStdXFxkK1xuICAgIC8vIChlLmcuLCAxLjJlKzMpIG9yIHRoZSBmb3JtIFxcZGVbLStdXFxkKyAoZS5nLiwgMWUrMykuXG4gICAgcmV0dXJuIFtcbiAgICAgIGNvZWZmaWNpZW50Lmxlbmd0aCA+IDEgPyBjb2VmZmljaWVudFswXSArIGNvZWZmaWNpZW50LnNsaWNlKDIpIDogY29lZmZpY2llbnQsXG4gICAgICAreC5zbGljZShpICsgMSlcbiAgICBdO1xuICB9XG5cbiAgZnVuY3Rpb24gZXhwb25lbnQoeCkge1xuICAgIHJldHVybiB4ID0gZm9ybWF0RGVjaW1hbChNYXRoLmFicyh4KSksIHggPyB4WzFdIDogTmFOO1xuICB9XG5cbiAgdmFyIHByZWZpeEV4cG9uZW50O1xuXG4gIGZ1bmN0aW9uIGZvcm1hdFByZWZpeEF1dG8oeCwgcCkge1xuICAgIHZhciBkID0gZm9ybWF0RGVjaW1hbCh4LCBwKTtcbiAgICBpZiAoIWQpIHJldHVybiB4ICsgXCJcIjtcbiAgICB2YXIgY29lZmZpY2llbnQgPSBkWzBdLFxuICAgICAgICBleHBvbmVudCA9IGRbMV0sXG4gICAgICAgIGkgPSBleHBvbmVudCAtIChwcmVmaXhFeHBvbmVudCA9IE1hdGgubWF4KC04LCBNYXRoLm1pbig4LCBNYXRoLmZsb29yKGV4cG9uZW50IC8gMykpKSAqIDMpICsgMSxcbiAgICAgICAgbiA9IGNvZWZmaWNpZW50Lmxlbmd0aDtcbiAgICByZXR1cm4gaSA9PT0gbiA/IGNvZWZmaWNpZW50XG4gICAgICAgIDogaSA+IG4gPyBjb2VmZmljaWVudCArIG5ldyBBcnJheShpIC0gbiArIDEpLmpvaW4oXCIwXCIpXG4gICAgICAgIDogaSA+IDAgPyBjb2VmZmljaWVudC5zbGljZSgwLCBpKSArIFwiLlwiICsgY29lZmZpY2llbnQuc2xpY2UoaSlcbiAgICAgICAgOiBcIjAuXCIgKyBuZXcgQXJyYXkoMSAtIGkpLmpvaW4oXCIwXCIpICsgZm9ybWF0RGVjaW1hbCh4LCBwICsgaSAtIDEpWzBdOyAvLyBsZXNzIHRoYW4gMXkhXG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRSb3VuZGVkKHgsIHApIHtcbiAgICB2YXIgZCA9IGZvcm1hdERlY2ltYWwoeCwgcCk7XG4gICAgaWYgKCFkKSByZXR1cm4geCArIFwiXCI7XG4gICAgdmFyIGNvZWZmaWNpZW50ID0gZFswXSxcbiAgICAgICAgZXhwb25lbnQgPSBkWzFdO1xuICAgIHJldHVybiBleHBvbmVudCA8IDAgPyBcIjAuXCIgKyBuZXcgQXJyYXkoLWV4cG9uZW50KS5qb2luKFwiMFwiKSArIGNvZWZmaWNpZW50XG4gICAgICAgIDogY29lZmZpY2llbnQubGVuZ3RoID4gZXhwb25lbnQgKyAxID8gY29lZmZpY2llbnQuc2xpY2UoMCwgZXhwb25lbnQgKyAxKSArIFwiLlwiICsgY29lZmZpY2llbnQuc2xpY2UoZXhwb25lbnQgKyAxKVxuICAgICAgICA6IGNvZWZmaWNpZW50ICsgbmV3IEFycmF5KGV4cG9uZW50IC0gY29lZmZpY2llbnQubGVuZ3RoICsgMikuam9pbihcIjBcIik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXREZWZhdWx0KHgsIHApIHtcbiAgICB4ID0geC50b1ByZWNpc2lvbihwKTtcblxuICAgIG91dDogZm9yICh2YXIgbiA9IHgubGVuZ3RoLCBpID0gMSwgaTAgPSAtMSwgaTE7IGkgPCBuOyArK2kpIHtcbiAgICAgIHN3aXRjaCAoeFtpXSkge1xuICAgICAgICBjYXNlIFwiLlwiOiBpMCA9IGkxID0gaTsgYnJlYWs7XG4gICAgICAgIGNhc2UgXCIwXCI6IGlmIChpMCA9PT0gMCkgaTAgPSBpOyBpMSA9IGk7IGJyZWFrO1xuICAgICAgICBjYXNlIFwiZVwiOiBicmVhayBvdXQ7XG4gICAgICAgIGRlZmF1bHQ6IGlmIChpMCA+IDApIGkwID0gMDsgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGkwID4gMCA/IHguc2xpY2UoMCwgaTApICsgeC5zbGljZShpMSArIDEpIDogeDtcbiAgfVxuXG4gIHZhciBmb3JtYXRUeXBlcyA9IHtcbiAgICBcIlwiOiBmb3JtYXREZWZhdWx0LFxuICAgIFwiJVwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiAoeCAqIDEwMCkudG9GaXhlZChwKTsgfSxcbiAgICBcImJcIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZygyKTsgfSxcbiAgICBcImNcIjogZnVuY3Rpb24oeCkgeyByZXR1cm4geCArIFwiXCI7IH0sXG4gICAgXCJkXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTApOyB9LFxuICAgIFwiZVwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiB4LnRvRXhwb25lbnRpYWwocCk7IH0sXG4gICAgXCJmXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuIHgudG9GaXhlZChwKTsgfSxcbiAgICBcImdcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4geC50b1ByZWNpc2lvbihwKTsgfSxcbiAgICBcIm9cIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZyg4KTsgfSxcbiAgICBcInBcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4gZm9ybWF0Um91bmRlZCh4ICogMTAwLCBwKTsgfSxcbiAgICBcInJcIjogZm9ybWF0Um91bmRlZCxcbiAgICBcInNcIjogZm9ybWF0UHJlZml4QXV0byxcbiAgICBcIlhcIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTsgfSxcbiAgICBcInhcIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZygxNik7IH1cbiAgfTtcblxuXG4gIC8vIFtbZmlsbF1hbGlnbl1bc2lnbl1bc3ltYm9sXVswXVt3aWR0aF1bLF1bLnByZWNpc2lvbl1bdHlwZV1cbiAgdmFyIHJlID0gL14oPzooLik/KFs8Pj1eXSkpPyhbK1xcLVxcKCBdKT8oWyQjXSk/KDApPyhcXGQrKT8oLCk/KFxcLlxcZCspPyhbYS16JV0pPyQvaTtcblxuICBmdW5jdGlvbiBGb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKSB7XG4gICAgaWYgKCEobWF0Y2ggPSByZS5leGVjKHNwZWNpZmllcikpKSB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIGZvcm1hdDogXCIgKyBzcGVjaWZpZXIpO1xuXG4gICAgdmFyIG1hdGNoLFxuICAgICAgICBmaWxsID0gbWF0Y2hbMV0gfHwgXCIgXCIsXG4gICAgICAgIGFsaWduID0gbWF0Y2hbMl0gfHwgXCI+XCIsXG4gICAgICAgIHNpZ24gPSBtYXRjaFszXSB8fCBcIi1cIixcbiAgICAgICAgc3ltYm9sID0gbWF0Y2hbNF0gfHwgXCJcIixcbiAgICAgICAgemVybyA9ICEhbWF0Y2hbNV0sXG4gICAgICAgIHdpZHRoID0gbWF0Y2hbNl0gJiYgK21hdGNoWzZdLFxuICAgICAgICBjb21tYSA9ICEhbWF0Y2hbN10sXG4gICAgICAgIHByZWNpc2lvbiA9IG1hdGNoWzhdICYmICttYXRjaFs4XS5zbGljZSgxKSxcbiAgICAgICAgdHlwZSA9IG1hdGNoWzldIHx8IFwiXCI7XG5cbiAgICAvLyBUaGUgXCJuXCIgdHlwZSBpcyBhbiBhbGlhcyBmb3IgXCIsZ1wiLlxuICAgIGlmICh0eXBlID09PSBcIm5cIikgY29tbWEgPSB0cnVlLCB0eXBlID0gXCJnXCI7XG5cbiAgICAvLyBNYXAgaW52YWxpZCB0eXBlcyB0byB0aGUgZGVmYXVsdCBmb3JtYXQuXG4gICAgZWxzZSBpZiAoIWZvcm1hdFR5cGVzW3R5cGVdKSB0eXBlID0gXCJcIjtcblxuICAgIC8vIElmIHplcm8gZmlsbCBpcyBzcGVjaWZpZWQsIHBhZGRpbmcgZ29lcyBhZnRlciBzaWduIGFuZCBiZWZvcmUgZGlnaXRzLlxuICAgIGlmICh6ZXJvIHx8IChmaWxsID09PSBcIjBcIiAmJiBhbGlnbiA9PT0gXCI9XCIpKSB6ZXJvID0gdHJ1ZSwgZmlsbCA9IFwiMFwiLCBhbGlnbiA9IFwiPVwiO1xuXG4gICAgdGhpcy5maWxsID0gZmlsbDtcbiAgICB0aGlzLmFsaWduID0gYWxpZ247XG4gICAgdGhpcy5zaWduID0gc2lnbjtcbiAgICB0aGlzLnN5bWJvbCA9IHN5bWJvbDtcbiAgICB0aGlzLnplcm8gPSB6ZXJvO1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmNvbW1hID0gY29tbWE7XG4gICAgdGhpcy5wcmVjaXNpb24gPSBwcmVjaXNpb247XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgfVxuXG4gIEZvcm1hdFNwZWNpZmllci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5maWxsXG4gICAgICAgICsgdGhpcy5hbGlnblxuICAgICAgICArIHRoaXMuc2lnblxuICAgICAgICArIHRoaXMuc3ltYm9sXG4gICAgICAgICsgKHRoaXMuemVybyA/IFwiMFwiIDogXCJcIilcbiAgICAgICAgKyAodGhpcy53aWR0aCA9PSBudWxsID8gXCJcIiA6IE1hdGgubWF4KDEsIHRoaXMud2lkdGggfCAwKSlcbiAgICAgICAgKyAodGhpcy5jb21tYSA/IFwiLFwiIDogXCJcIilcbiAgICAgICAgKyAodGhpcy5wcmVjaXNpb24gPT0gbnVsbCA/IFwiXCIgOiBcIi5cIiArIE1hdGgubWF4KDAsIHRoaXMucHJlY2lzaW9uIHwgMCkpXG4gICAgICAgICsgdGhpcy50eXBlO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpIHtcbiAgICByZXR1cm4gbmV3IEZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gaWRlbnRpdHkoeCkge1xuICAgIHJldHVybiB4O1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0R3JvdXAoZ3JvdXBpbmcsIHRob3VzYW5kcykge1xuICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSwgd2lkdGgpIHtcbiAgICAgIHZhciBpID0gdmFsdWUubGVuZ3RoLFxuICAgICAgICAgIHQgPSBbXSxcbiAgICAgICAgICBqID0gMCxcbiAgICAgICAgICBnID0gZ3JvdXBpbmdbMF0sXG4gICAgICAgICAgbGVuZ3RoID0gMDtcblxuICAgICAgd2hpbGUgKGkgPiAwICYmIGcgPiAwKSB7XG4gICAgICAgIGlmIChsZW5ndGggKyBnICsgMSA+IHdpZHRoKSBnID0gTWF0aC5tYXgoMSwgd2lkdGggLSBsZW5ndGgpO1xuICAgICAgICB0LnB1c2godmFsdWUuc3Vic3RyaW5nKGkgLT0gZywgaSArIGcpKTtcbiAgICAgICAgaWYgKChsZW5ndGggKz0gZyArIDEpID4gd2lkdGgpIGJyZWFrO1xuICAgICAgICBnID0gZ3JvdXBpbmdbaiA9IChqICsgMSkgJSBncm91cGluZy5sZW5ndGhdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdC5yZXZlcnNlKCkuam9pbih0aG91c2FuZHMpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBsb2NhbGVGb3JtYXQobG9jYWxlKSB7XG4gICAgdmFyIGdyb3VwID0gbG9jYWxlLmdyb3VwaW5nICYmIGxvY2FsZS50aG91c2FuZHMgPyBmb3JtYXRHcm91cChsb2NhbGUuZ3JvdXBpbmcsIGxvY2FsZS50aG91c2FuZHMpIDogaWRlbnRpdHksXG4gICAgICAgIGN1cnJlbmN5ID0gbG9jYWxlLmN1cnJlbmN5LFxuICAgICAgICBkZWNpbWFsID0gbG9jYWxlLmRlY2ltYWw7XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQoc3BlY2lmaWVyKSB7XG4gICAgICBzcGVjaWZpZXIgPSBmb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKTtcblxuICAgICAgdmFyIGZpbGwgPSBzcGVjaWZpZXIuZmlsbCxcbiAgICAgICAgICBhbGlnbiA9IHNwZWNpZmllci5hbGlnbixcbiAgICAgICAgICBzaWduID0gc3BlY2lmaWVyLnNpZ24sXG4gICAgICAgICAgc3ltYm9sID0gc3BlY2lmaWVyLnN5bWJvbCxcbiAgICAgICAgICB6ZXJvID0gc3BlY2lmaWVyLnplcm8sXG4gICAgICAgICAgd2lkdGggPSBzcGVjaWZpZXIud2lkdGgsXG4gICAgICAgICAgY29tbWEgPSBzcGVjaWZpZXIuY29tbWEsXG4gICAgICAgICAgcHJlY2lzaW9uID0gc3BlY2lmaWVyLnByZWNpc2lvbixcbiAgICAgICAgICB0eXBlID0gc3BlY2lmaWVyLnR5cGU7XG5cbiAgICAgIC8vIENvbXB1dGUgdGhlIHByZWZpeCBhbmQgc3VmZml4LlxuICAgICAgLy8gRm9yIFNJLXByZWZpeCwgdGhlIHN1ZmZpeCBpcyBsYXppbHkgY29tcHV0ZWQuXG4gICAgICB2YXIgcHJlZml4ID0gc3ltYm9sID09PSBcIiRcIiA/IGN1cnJlbmN5WzBdIDogc3ltYm9sID09PSBcIiNcIiAmJiAvW2JveFhdLy50ZXN0KHR5cGUpID8gXCIwXCIgKyB0eXBlLnRvTG93ZXJDYXNlKCkgOiBcIlwiLFxuICAgICAgICAgIHN1ZmZpeCA9IHN5bWJvbCA9PT0gXCIkXCIgPyBjdXJyZW5jeVsxXSA6IC9bJXBdLy50ZXN0KHR5cGUpID8gXCIlXCIgOiBcIlwiO1xuXG4gICAgICAvLyBXaGF0IGZvcm1hdCBmdW5jdGlvbiBzaG91bGQgd2UgdXNlP1xuICAgICAgLy8gSXMgdGhpcyBhbiBpbnRlZ2VyIHR5cGU/XG4gICAgICAvLyBDYW4gdGhpcyB0eXBlIGdlbmVyYXRlIGV4cG9uZW50aWFsIG5vdGF0aW9uP1xuICAgICAgdmFyIGZvcm1hdFR5cGUgPSBmb3JtYXRUeXBlc1t0eXBlXSxcbiAgICAgICAgICBtYXliZVN1ZmZpeCA9ICF0eXBlIHx8IC9bZGVmZ3BycyVdLy50ZXN0KHR5cGUpO1xuXG4gICAgICAvLyBTZXQgdGhlIGRlZmF1bHQgcHJlY2lzaW9uIGlmIG5vdCBzcGVjaWZpZWQsXG4gICAgICAvLyBvciBjbGFtcCB0aGUgc3BlY2lmaWVkIHByZWNpc2lvbiB0byB0aGUgc3VwcG9ydGVkIHJhbmdlLlxuICAgICAgLy8gRm9yIHNpZ25pZmljYW50IHByZWNpc2lvbiwgaXQgbXVzdCBiZSBpbiBbMSwgMjFdLlxuICAgICAgLy8gRm9yIGZpeGVkIHByZWNpc2lvbiwgaXQgbXVzdCBiZSBpbiBbMCwgMjBdLlxuICAgICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uID09IG51bGwgPyAodHlwZSA/IDYgOiAxMilcbiAgICAgICAgICA6IC9bZ3Byc10vLnRlc3QodHlwZSkgPyBNYXRoLm1heCgxLCBNYXRoLm1pbigyMSwgcHJlY2lzaW9uKSlcbiAgICAgICAgICA6IE1hdGgubWF4KDAsIE1hdGgubWluKDIwLCBwcmVjaXNpb24pKTtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhciB2YWx1ZVByZWZpeCA9IHByZWZpeCxcbiAgICAgICAgICAgIHZhbHVlU3VmZml4ID0gc3VmZml4O1xuXG4gICAgICAgIGlmICh0eXBlID09PSBcImNcIikge1xuICAgICAgICAgIHZhbHVlU3VmZml4ID0gZm9ybWF0VHlwZSh2YWx1ZSkgKyB2YWx1ZVN1ZmZpeDtcbiAgICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSArdmFsdWU7XG5cbiAgICAgICAgICAvLyBDb252ZXJ0IG5lZ2F0aXZlIHRvIHBvc2l0aXZlLCBhbmQgY29tcHV0ZSB0aGUgcHJlZml4LlxuICAgICAgICAgIC8vIE5vdGUgdGhhdCAtMCBpcyBub3QgbGVzcyB0aGFuIDAsIGJ1dCAxIC8gLTAgaXMhXG4gICAgICAgICAgdmFyIHZhbHVlTmVnYXRpdmUgPSAodmFsdWUgPCAwIHx8IDEgLyB2YWx1ZSA8IDApICYmICh2YWx1ZSAqPSAtMSwgdHJ1ZSk7XG5cbiAgICAgICAgICAvLyBQZXJmb3JtIHRoZSBpbml0aWFsIGZvcm1hdHRpbmcuXG4gICAgICAgICAgdmFsdWUgPSBmb3JtYXRUeXBlKHZhbHVlLCBwcmVjaXNpb24pO1xuXG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgcHJlZml4IGFuZCBzdWZmaXguXG4gICAgICAgICAgdmFsdWVQcmVmaXggPSAodmFsdWVOZWdhdGl2ZSA/IChzaWduID09PSBcIihcIiA/IHNpZ24gOiBcIi1cIikgOiBzaWduID09PSBcIi1cIiB8fCBzaWduID09PSBcIihcIiA/IFwiXCIgOiBzaWduKSArIHZhbHVlUHJlZml4O1xuICAgICAgICAgIHZhbHVlU3VmZml4ID0gdmFsdWVTdWZmaXggKyAodHlwZSA9PT0gXCJzXCIgPyBwcmVmaXhlc1s4ICsgcHJlZml4RXhwb25lbnQgLyAzXSA6IFwiXCIpICsgKHZhbHVlTmVnYXRpdmUgJiYgc2lnbiA9PT0gXCIoXCIgPyBcIilcIiA6IFwiXCIpO1xuXG4gICAgICAgICAgLy8gQnJlYWsgdGhlIGZvcm1hdHRlZCB2YWx1ZSBpbnRvIHRoZSBpbnRlZ2VyIOKAnHZhbHVl4oCdIHBhcnQgdGhhdCBjYW4gYmVcbiAgICAgICAgICAvLyBncm91cGVkLCBhbmQgZnJhY3Rpb25hbCBvciBleHBvbmVudGlhbCDigJxzdWZmaXjigJ0gcGFydCB0aGF0IGlzIG5vdC5cbiAgICAgICAgICBpZiAobWF5YmVTdWZmaXgpIHtcbiAgICAgICAgICAgIHZhciBpID0gLTEsIG4gPSB2YWx1ZS5sZW5ndGgsIGM7XG4gICAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgICBpZiAoYyA9IHZhbHVlLmNoYXJDb2RlQXQoaSksIDQ4ID4gYyB8fCBjID4gNTcpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IChjID09PSA0NiA/IGRlY2ltYWwgKyB2YWx1ZS5zbGljZShpICsgMSkgOiB2YWx1ZS5zbGljZShpKSkgKyB2YWx1ZVN1ZmZpeDtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIGkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIGZpbGwgY2hhcmFjdGVyIGlzIG5vdCBcIjBcIiwgZ3JvdXBpbmcgaXMgYXBwbGllZCBiZWZvcmUgcGFkZGluZy5cbiAgICAgICAgaWYgKGNvbW1hICYmICF6ZXJvKSB2YWx1ZSA9IGdyb3VwKHZhbHVlLCBJbmZpbml0eSk7XG5cbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUgcGFkZGluZy5cbiAgICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlUHJlZml4Lmxlbmd0aCArIHZhbHVlLmxlbmd0aCArIHZhbHVlU3VmZml4Lmxlbmd0aCxcbiAgICAgICAgICAgIHBhZGRpbmcgPSBsZW5ndGggPCB3aWR0aCA/IG5ldyBBcnJheSh3aWR0aCAtIGxlbmd0aCArIDEpLmpvaW4oZmlsbCkgOiBcIlwiO1xuXG4gICAgICAgIC8vIElmIHRoZSBmaWxsIGNoYXJhY3RlciBpcyBcIjBcIiwgZ3JvdXBpbmcgaXMgYXBwbGllZCBhZnRlciBwYWRkaW5nLlxuICAgICAgICBpZiAoY29tbWEgJiYgemVybykgdmFsdWUgPSBncm91cChwYWRkaW5nICsgdmFsdWUsIHBhZGRpbmcubGVuZ3RoID8gd2lkdGggLSB2YWx1ZVN1ZmZpeC5sZW5ndGggOiBJbmZpbml0eSksIHBhZGRpbmcgPSBcIlwiO1xuXG4gICAgICAgIC8vIFJlY29uc3RydWN0IHRoZSBmaW5hbCBvdXRwdXQgYmFzZWQgb24gdGhlIGRlc2lyZWQgYWxpZ25tZW50LlxuICAgICAgICBzd2l0Y2ggKGFsaWduKSB7XG4gICAgICAgICAgY2FzZSBcIjxcIjogcmV0dXJuIHZhbHVlUHJlZml4ICsgdmFsdWUgKyB2YWx1ZVN1ZmZpeCArIHBhZGRpbmc7XG4gICAgICAgICAgY2FzZSBcIj1cIjogcmV0dXJuIHZhbHVlUHJlZml4ICsgcGFkZGluZyArIHZhbHVlICsgdmFsdWVTdWZmaXg7XG4gICAgICAgICAgY2FzZSBcIl5cIjogcmV0dXJuIHBhZGRpbmcuc2xpY2UoMCwgbGVuZ3RoID0gcGFkZGluZy5sZW5ndGggPj4gMSkgKyB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXggKyBwYWRkaW5nLnNsaWNlKGxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZGRpbmcgKyB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXg7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFByZWZpeChzcGVjaWZpZXIsIHZhbHVlKSB7XG4gICAgICB2YXIgZiA9IGZvcm1hdCgoc3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllciksIHNwZWNpZmllci50eXBlID0gXCJmXCIsIHNwZWNpZmllcikpLFxuICAgICAgICAgIGUgPSBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCh2YWx1ZSkgLyAzKSkpICogMyxcbiAgICAgICAgICBrID0gTWF0aC5wb3coMTAsIC1lKSxcbiAgICAgICAgICBwcmVmaXggPSBwcmVmaXhlc1s4ICsgZSAvIDNdO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmKGsgKiB2YWx1ZSkgKyBwcmVmaXg7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBmb3JtYXQ6IGZvcm1hdCxcbiAgICAgIGZvcm1hdFByZWZpeDogZm9ybWF0UHJlZml4XG4gICAgfTtcbiAgfVxuXG4gIHZhciBsb2NhbGUgPSBsb2NhbGVGb3JtYXQoe1xuICAgIGRlY2ltYWw6IFwiLlwiLFxuICAgIHRob3VzYW5kczogXCIsXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wiJFwiLCBcIlwiXVxuICB9KTtcblxuICBleHBvcnRzLmZvcm1hdCA9IGxvY2FsZS5mb3JtYXQ7XG4gIGV4cG9ydHMuZm9ybWF0UHJlZml4ID0gbG9jYWxlLmZvcm1hdFByZWZpeDtcblxuICBmdW5jdGlvbiBwcmVjaXNpb25Sb3VuZChzdGVwLCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgZXhwb25lbnQoTWF0aC5hYnMobWF4KSkgLSBleHBvbmVudChNYXRoLmFicyhzdGVwKSkpICsgMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZWNpc2lvblByZWZpeChzdGVwLCB2YWx1ZSkge1xuICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCh2YWx1ZSkgLyAzKSkpICogMyAtIGV4cG9uZW50KE1hdGguYWJzKHN0ZXApKSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcmVjaXNpb25GaXhlZChzdGVwKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KDAsIC1leHBvbmVudChNYXRoLmFicyhzdGVwKSkpO1xuICB9XG5cbiAgZXhwb3J0cy5mb3JtYXRTcGVjaWZpZXIgPSBmb3JtYXRTcGVjaWZpZXI7XG4gIGV4cG9ydHMubG9jYWxlRm9ybWF0ID0gbG9jYWxlRm9ybWF0O1xuICBleHBvcnRzLnByZWNpc2lvbkZpeGVkID0gcHJlY2lzaW9uRml4ZWQ7XG4gIGV4cG9ydHMucHJlY2lzaW9uUHJlZml4ID0gcHJlY2lzaW9uUHJlZml4O1xuICBleHBvcnRzLnByZWNpc2lvblJvdW5kID0gcHJlY2lzaW9uUm91bmQ7XG5cbn0pKTsiLCJpZiAodHlwZW9mIE1hcCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICBNYXAgPSBmdW5jdGlvbigpIHsgdGhpcy5jbGVhcigpOyB9O1xuICBNYXAucHJvdG90eXBlID0ge1xuICAgIHNldDogZnVuY3Rpb24oaywgdikgeyB0aGlzLl9ba10gPSB2OyByZXR1cm4gdGhpczsgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIHRoaXMuX1trXTsgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIGsgaW4gdGhpcy5fOyB9LFxuICAgIGRlbGV0ZTogZnVuY3Rpb24oaykgeyByZXR1cm4gayBpbiB0aGlzLl8gJiYgZGVsZXRlIHRoaXMuX1trXTsgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7IHRoaXMuXyA9IE9iamVjdC5jcmVhdGUobnVsbCk7IH0sXG4gICAgZ2V0IHNpemUoKSB7IHZhciBuID0gMDsgZm9yICh2YXIgayBpbiB0aGlzLl8pICsrbjsgcmV0dXJuIG47IH0sXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oYykgeyBmb3IgKHZhciBrIGluIHRoaXMuXykgYyh0aGlzLl9ba10sIGssIHRoaXMpOyB9XG4gIH07XG59IGVsc2UgKGZ1bmN0aW9uKCkge1xuICB2YXIgbSA9IG5ldyBNYXA7XG4gIGlmIChtLnNldCgwLCAwKSAhPT0gbSkge1xuICAgIG0gPSBtLnNldDtcbiAgICBNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKCkgeyBtLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IHJldHVybiB0aGlzOyB9O1xuICB9XG59KSgpO1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gIGZhY3RvcnkoKGdsb2JhbC50aW1lRm9ybWF0ID0ge30pKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIHV0Y0RhdGUoZCkge1xuICAgIGlmICgwIDw9IGQueSAmJiBkLnkgPCAxMDApIHtcbiAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMoLTEsIGQubSwgZC5kLCBkLkgsIGQuTSwgZC5TLCBkLkwpKTtcbiAgICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoZC55KTtcbiAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoZC55LCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKSk7XG4gIH1cblxuICBmdW5jdGlvbiBsb2NhbERhdGUoZCkge1xuICAgIGlmICgwIDw9IGQueSAmJiBkLnkgPCAxMDApIHtcbiAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoLTEsIGQubSwgZC5kLCBkLkgsIGQuTSwgZC5TLCBkLkwpO1xuICAgICAgZGF0ZS5zZXRGdWxsWWVhcihkLnkpO1xuICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRGF0ZShkLnksIGQubSwgZC5kLCBkLkgsIGQuTSwgZC5TLCBkLkwpO1xuICB9XG5cbiAgdmFyIHBhZHMgPSB7XCItXCI6IFwiXCIsIFwiX1wiOiBcIiBcIiwgXCIwXCI6IFwiMFwifTtcblxuICBmdW5jdGlvbiBuZXdZZWFyKHkpIHtcbiAgICByZXR1cm4ge3k6IHksIG06IDAsIGQ6IDEsIEg6IDAsIE06IDAsIFM6IDAsIEw6IDB9O1xuICB9XG5cbiAgdmFyIHBlcmNlbnRSZSA9IC9eJS87XG5cbiAgZnVuY3Rpb24gcGFyc2VMaXRlcmFsUGVyY2VudChkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IHBlcmNlbnRSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMSkpO1xuICAgIHJldHVybiBuID8gaSArIG5bMF0ubGVuZ3RoIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVpvbmUoZCwgc3RyaW5nLCBpKSB7XG4gICAgcmV0dXJuIC9eWystXVxcZHs0fSQvLnRlc3Qoc3RyaW5nID0gc3RyaW5nLnNsaWNlKGksIGkgKyA1KSlcbiAgICAgICAgPyAoZC5aID0gLXN0cmluZywgaSArIDUpIC8vIHNpZ24gZGlmZmVycyBmcm9tIGdldFRpbWV6b25lT2Zmc2V0IVxuICAgICAgICA6IC0xO1xuICB9XG5cbiAgdmFyIG51bWJlclJlID0gL15cXHMqXFxkKy87XG5cbiAgZnVuY3Rpb24gcGFyc2VXZWVrZGF5TnVtYmVyKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDEpKTtcbiAgICByZXR1cm4gbiA/IChkLncgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VXZWVrTnVtYmVyU3VuZGF5KGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgIHJldHVybiBuID8gKGQuVSA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVdlZWtOdW1iZXJNb25kYXkoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5XID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlWWVhcihkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gICAgcmV0dXJuIG4gPyAoZC55ID0gK25bMF0gKyAoK25bMF0gPiA2OCA/IDE5MDAgOiAyMDAwKSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VNb250aE51bWJlcihkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5tID0gblswXSAtIDEsIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlRGF5T2ZNb250aChkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5kID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlRGF5T2ZZZWFyKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDMpKTtcbiAgICByZXR1cm4gbiA/IChkLm0gPSAwLCBkLmQgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VIb3VyMjQoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICAgIHJldHVybiBuID8gKGQuSCA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZU1pbnV0ZXMoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICAgIHJldHVybiBuID8gKGQuTSA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVNlY29uZHMoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICAgIHJldHVybiBuID8gKGQuUyA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZU1pbGxpc2Vjb25kcyhkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAzKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5MID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlRnVsbFllYXIoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgNCkpO1xuICAgIHJldHVybiBuID8gKGQueSA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRMaXRlcmFsUGVyY2VudCgpIHtcbiAgICByZXR1cm4gXCIlXCI7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENab25lKCkge1xuICAgIHJldHVybiBcIiswMDAwXCI7XG4gIH1cblxuICBmdW5jdGlvbiBwYWQodmFsdWUsIGZpbGwsIHdpZHRoKSB7XG4gICAgdmFyIHNpZ24gPSB2YWx1ZSA8IDAgPyBcIi1cIiA6IFwiXCIsXG4gICAgICAgIHN0cmluZyA9IChzaWduID8gLXZhbHVlIDogdmFsdWUpICsgXCJcIixcbiAgICAgICAgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICByZXR1cm4gc2lnbiArIChsZW5ndGggPCB3aWR0aCA/IG5ldyBBcnJheSh3aWR0aCAtIGxlbmd0aCArIDEpLmpvaW4oZmlsbCkgKyBzdHJpbmcgOiBzdHJpbmcpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDRnVsbFllYXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENGdWxsWWVhcigpICUgMTAwMDAsIHAsIDQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDWWVhcihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldFVUQ0Z1bGxZZWFyKCkgJSAxMDAsIHAsIDIpO1xuICB9XG5cbiAgdmFyIHQxID0gbmV3IERhdGU7XG5cbiAgdmFyIHQwID0gbmV3IERhdGU7XG5cbiAgZnVuY3Rpb24gbmV3SW50ZXJ2YWwoZmxvb3JpLCBvZmZzZXRpLCBjb3VudCkge1xuXG4gICAgZnVuY3Rpb24gaW50ZXJ2YWwoZGF0ZSkge1xuICAgICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoK2RhdGUpKSwgZGF0ZTtcbiAgICB9XG5cbiAgICBpbnRlcnZhbC5mbG9vciA9IGludGVydmFsO1xuXG4gICAgaW50ZXJ2YWwucm91bmQgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICB2YXIgZDAgPSBuZXcgRGF0ZSgrZGF0ZSksXG4gICAgICAgICAgZDEgPSBuZXcgRGF0ZShkYXRlIC0gMSk7XG4gICAgICBmbG9vcmkoZDApLCBmbG9vcmkoZDEpLCBvZmZzZXRpKGQxLCAxKTtcbiAgICAgIHJldHVybiBkYXRlIC0gZDAgPCBkMSAtIGRhdGUgPyBkMCA6IGQxO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5jZWlsID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoZGF0ZSAtIDEpKSwgb2Zmc2V0aShkYXRlLCAxKSwgZGF0ZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwub2Zmc2V0ID0gZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgcmV0dXJuIG9mZnNldGkoZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKSwgc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCkpLCBkYXRlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgICB2YXIgcmFuZ2UgPSBbXTtcbiAgICAgIHN0YXJ0ID0gbmV3IERhdGUoc3RhcnQgLSAxKTtcbiAgICAgIHN0b3AgPSBuZXcgRGF0ZSgrc3RvcCk7XG4gICAgICBzdGVwID0gc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCk7XG4gICAgICBpZiAoIShzdGFydCA8IHN0b3ApIHx8ICEoc3RlcCA+IDApKSByZXR1cm4gcmFuZ2U7IC8vIGFsc28gaGFuZGxlcyBJbnZhbGlkIERhdGVcbiAgICAgIG9mZnNldGkoc3RhcnQsIDEpLCBmbG9vcmkoc3RhcnQpO1xuICAgICAgaWYgKHN0YXJ0IDwgc3RvcCkgcmFuZ2UucHVzaChuZXcgRGF0ZSgrc3RhcnQpKTtcbiAgICAgIHdoaWxlIChvZmZzZXRpKHN0YXJ0LCBzdGVwKSwgZmxvb3JpKHN0YXJ0KSwgc3RhcnQgPCBzdG9wKSByYW5nZS5wdXNoKG5ldyBEYXRlKCtzdGFydCkpO1xuICAgICAgcmV0dXJuIHJhbmdlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5maWx0ZXIgPSBmdW5jdGlvbih0ZXN0KSB7XG4gICAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICB3aGlsZSAoZmxvb3JpKGRhdGUpLCAhdGVzdChkYXRlKSkgZGF0ZS5zZXRUaW1lKGRhdGUgLSAxKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgICAgd2hpbGUgKC0tc3RlcCA+PSAwKSB3aGlsZSAob2Zmc2V0aShkYXRlLCAxKSwgIXRlc3QoZGF0ZSkpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmIChjb3VudCkgaW50ZXJ2YWwuY291bnQgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICB0MC5zZXRUaW1lKCtzdGFydCksIHQxLnNldFRpbWUoK2VuZCk7XG4gICAgICBmbG9vcmkodDApLCBmbG9vcmkodDEpO1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoY291bnQodDAsIHQxKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBpbnRlcnZhbDtcbiAgfVxuXG4gIHZhciB1dGNZZWFyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXRVVENNb250aCgwLCAxKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgb2Zmc2V0KSB7XG4gICAgZGF0ZS5zZXRVVENGdWxsWWVhcihkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgKyBvZmZzZXQpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRVVENGdWxsWWVhcigpIC0gc3RhcnQuZ2V0VVRDRnVsbFllYXIoKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gdXRjV2Vla2RheShpKSB7XG4gICAgcmV0dXJuIG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gICAgICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgLSAoZGF0ZS5nZXRVVENEYXkoKSArIDcgLSBpKSAlIDcpO1xuICAgIH0sIGZ1bmN0aW9uKGRhdGUsIG9mZnNldCkge1xuICAgICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpICsgb2Zmc2V0ICogNyk7XG4gICAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA2MDQ4ZTU7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgdXRjTW9uZGF5ID0gdXRjV2Vla2RheSgxKTtcblxuICBmdW5jdGlvbiBmb3JtYXRVVENXZWVrTnVtYmVyTW9uZGF5KGQsIHApIHtcbiAgICByZXR1cm4gcGFkKHV0Y01vbmRheS5jb3VudCh1dGNZZWFyKGQpLCBkKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENXZWVrZGF5TnVtYmVyKGQpIHtcbiAgICByZXR1cm4gZC5nZXRVVENEYXkoKTtcbiAgfVxuXG4gIHZhciB1dGNTdW5kYXkgPSB1dGNXZWVrZGF5KDApO1xuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ1dlZWtOdW1iZXJTdW5kYXkoZCwgcCkge1xuICAgIHJldHVybiBwYWQodXRjU3VuZGF5LmNvdW50KHV0Y1llYXIoZCksIGQpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ1NlY29uZHMoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENTZWNvbmRzKCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDTWludXRlcyhkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldFVUQ01pbnV0ZXMoKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENNb250aE51bWJlcihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldFVUQ01vbnRoKCkgKyAxLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ01pbGxpc2Vjb25kcyhkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldFVUQ01pbGxpc2Vjb25kcygpLCBwLCAzKTtcbiAgfVxuXG4gIHZhciB1dGNEYXkgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgb2Zmc2V0KSB7XG4gICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpICsgb2Zmc2V0KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gODY0ZTU7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ0RheU9mWWVhcihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZCgxICsgdXRjRGF5LmNvdW50KHV0Y1llYXIoZCksIGQpLCBwLCAzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ0hvdXIxMihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldFVUQ0hvdXJzKCkgJSAxMiB8fCAxMiwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENIb3VyMjQoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENIb3VycygpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ0RheU9mTW9udGgoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENEYXRlKCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0Wm9uZShkKSB7XG4gICAgdmFyIHogPSBkLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgcmV0dXJuICh6ID4gMCA/IFwiLVwiIDogKHogKj0gLTEsIFwiK1wiKSlcbiAgICAgICAgKyBwYWQoeiAvIDYwIHwgMCwgXCIwXCIsIDIpXG4gICAgICAgICsgcGFkKHogJSA2MCwgXCIwXCIsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0RnVsbFllYXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRGdWxsWWVhcigpICUgMTAwMDAsIHAsIDQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0WWVhcihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldEZ1bGxZZWFyKCkgJSAxMDAsIHAsIDIpO1xuICB9XG5cbiAgdmFyIHllYXIgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldE1vbnRoKDAsIDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBvZmZzZXQpIHtcbiAgICBkYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSArIG9mZnNldCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZW5kLmdldEZ1bGxZZWFyKCkgLSBzdGFydC5nZXRGdWxsWWVhcigpO1xuICB9KTtcblxuICBmdW5jdGlvbiB3ZWVrZGF5KGkpIHtcbiAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIChkYXRlLmdldERheSgpICsgNyAtIGkpICUgNyk7XG4gICAgfSwgZnVuY3Rpb24oZGF0ZSwgb2Zmc2V0KSB7XG4gICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyBvZmZzZXQgKiA3KTtcbiAgICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICByZXR1cm4gKGVuZCAtIHN0YXJ0IC0gKGVuZC5nZXRUaW1lem9uZU9mZnNldCgpIC0gc3RhcnQuZ2V0VGltZXpvbmVPZmZzZXQoKSkgKiA2ZTQpIC8gNjA0OGU1O1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIG1vbmRheSA9IHdlZWtkYXkoMSk7XG5cbiAgZnVuY3Rpb24gZm9ybWF0V2Vla051bWJlck1vbmRheShkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChtb25kYXkuY291bnQoeWVhcihkKSwgZCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0V2Vla2RheU51bWJlcihkKSB7XG4gICAgcmV0dXJuIGQuZ2V0RGF5KCk7XG4gIH1cblxuICB2YXIgc3VuZGF5ID0gd2Vla2RheSgwKTtcblxuICBmdW5jdGlvbiBmb3JtYXRXZWVrTnVtYmVyU3VuZGF5KGQsIHApIHtcbiAgICByZXR1cm4gcGFkKHN1bmRheS5jb3VudCh5ZWFyKGQpLCBkKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRTZWNvbmRzKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0U2Vjb25kcygpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdE1pbnV0ZXMoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRNaW51dGVzKCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0TW9udGhOdW1iZXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRNb250aCgpICsgMSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRNaWxsaXNlY29uZHMoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRNaWxsaXNlY29uZHMoKSwgcCwgMyk7XG4gIH1cblxuICB2YXIgZGF5ID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIG9mZnNldCkge1xuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIG9mZnNldCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0IC0gKGVuZC5nZXRUaW1lem9uZU9mZnNldCgpIC0gc3RhcnQuZ2V0VGltZXpvbmVPZmZzZXQoKSkgKiA2ZTQpIC8gODY0ZTU7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGZvcm1hdERheU9mWWVhcihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZCgxICsgZGF5LmNvdW50KHllYXIoZCksIGQpLCBwLCAzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdEhvdXIxMihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldEhvdXJzKCkgJSAxMiB8fCAxMiwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRIb3VyMjQoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRIb3VycygpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdERheU9mTW9udGgoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXREYXRlKCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0TG9va3VwKG5hbWVzKSB7XG4gICAgdmFyIG1hcCA9IG5ldyBNYXAsIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgbWFwLnNldChuYW1lc1tpXS50b0xvd2VyQ2FzZSgpLCBpKTtcbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgdmFyIHJlcXVvdGVSZSA9IC9bXFxcXFxcXlxcJFxcKlxcK1xcP1xcfFxcW1xcXVxcKFxcKVxcLlxce1xcfV0vZztcblxuICBmdW5jdGlvbiByZXF1b3RlKHMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKHJlcXVvdGVSZSwgXCJcXFxcJCZcIik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRSZShuYW1lcykge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKFwiXig/OlwiICsgbmFtZXMubWFwKHJlcXVvdGUpLmpvaW4oXCJ8XCIpICsgXCIpXCIsIFwiaVwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvY2FsZUZvcm1hdChsb2NhbGUpIHtcbiAgICB2YXIgbG9jYWxlX2RhdGVUaW1lID0gbG9jYWxlLmRhdGVUaW1lLFxuICAgICAgICBsb2NhbGVfZGF0ZSA9IGxvY2FsZS5kYXRlLFxuICAgICAgICBsb2NhbGVfdGltZSA9IGxvY2FsZS50aW1lLFxuICAgICAgICBsb2NhbGVfcGVyaW9kcyA9IGxvY2FsZS5wZXJpb2RzLFxuICAgICAgICBsb2NhbGVfd2Vla2RheXMgPSBsb2NhbGUuZGF5cyxcbiAgICAgICAgbG9jYWxlX3Nob3J0V2Vla2RheXMgPSBsb2NhbGUuc2hvcnREYXlzLFxuICAgICAgICBsb2NhbGVfbW9udGhzID0gbG9jYWxlLm1vbnRocyxcbiAgICAgICAgbG9jYWxlX3Nob3J0TW9udGhzID0gbG9jYWxlLnNob3J0TW9udGhzO1xuXG4gICAgdmFyIHBlcmlvZExvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfcGVyaW9kcyksXG4gICAgICAgIHdlZWtkYXlSZSA9IGZvcm1hdFJlKGxvY2FsZV93ZWVrZGF5cyksXG4gICAgICAgIHdlZWtkYXlMb29rdXAgPSBmb3JtYXRMb29rdXAobG9jYWxlX3dlZWtkYXlzKSxcbiAgICAgICAgc2hvcnRXZWVrZGF5UmUgPSBmb3JtYXRSZShsb2NhbGVfc2hvcnRXZWVrZGF5cyksXG4gICAgICAgIHNob3J0V2Vla2RheUxvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfc2hvcnRXZWVrZGF5cyksXG4gICAgICAgIG1vbnRoUmUgPSBmb3JtYXRSZShsb2NhbGVfbW9udGhzKSxcbiAgICAgICAgbW9udGhMb29rdXAgPSBmb3JtYXRMb29rdXAobG9jYWxlX21vbnRocyksXG4gICAgICAgIHNob3J0TW9udGhSZSA9IGZvcm1hdFJlKGxvY2FsZV9zaG9ydE1vbnRocyksXG4gICAgICAgIHNob3J0TW9udGhMb29rdXAgPSBmb3JtYXRMb29rdXAobG9jYWxlX3Nob3J0TW9udGhzKTtcblxuICAgIHZhciBmb3JtYXRzID0ge1xuICAgICAgXCJhXCI6IGZvcm1hdFNob3J0V2Vla2RheSxcbiAgICAgIFwiQVwiOiBmb3JtYXRXZWVrZGF5LFxuICAgICAgXCJiXCI6IGZvcm1hdFNob3J0TW9udGgsXG4gICAgICBcIkJcIjogZm9ybWF0TW9udGgsXG4gICAgICBcImNcIjogbnVsbCxcbiAgICAgIFwiZFwiOiBmb3JtYXREYXlPZk1vbnRoLFxuICAgICAgXCJlXCI6IGZvcm1hdERheU9mTW9udGgsXG4gICAgICBcIkhcIjogZm9ybWF0SG91cjI0LFxuICAgICAgXCJJXCI6IGZvcm1hdEhvdXIxMixcbiAgICAgIFwialwiOiBmb3JtYXREYXlPZlllYXIsXG4gICAgICBcIkxcIjogZm9ybWF0TWlsbGlzZWNvbmRzLFxuICAgICAgXCJtXCI6IGZvcm1hdE1vbnRoTnVtYmVyLFxuICAgICAgXCJNXCI6IGZvcm1hdE1pbnV0ZXMsXG4gICAgICBcInBcIjogZm9ybWF0UGVyaW9kLFxuICAgICAgXCJTXCI6IGZvcm1hdFNlY29uZHMsXG4gICAgICBcIlVcIjogZm9ybWF0V2Vla051bWJlclN1bmRheSxcbiAgICAgIFwid1wiOiBmb3JtYXRXZWVrZGF5TnVtYmVyLFxuICAgICAgXCJXXCI6IGZvcm1hdFdlZWtOdW1iZXJNb25kYXksXG4gICAgICBcInhcIjogbnVsbCxcbiAgICAgIFwiWFwiOiBudWxsLFxuICAgICAgXCJ5XCI6IGZvcm1hdFllYXIsXG4gICAgICBcIllcIjogZm9ybWF0RnVsbFllYXIsXG4gICAgICBcIlpcIjogZm9ybWF0Wm9uZSxcbiAgICAgIFwiJVwiOiBmb3JtYXRMaXRlcmFsUGVyY2VudFxuICAgIH07XG5cbiAgICB2YXIgdXRjRm9ybWF0cyA9IHtcbiAgICAgIFwiYVwiOiBmb3JtYXRVVENTaG9ydFdlZWtkYXksXG4gICAgICBcIkFcIjogZm9ybWF0VVRDV2Vla2RheSxcbiAgICAgIFwiYlwiOiBmb3JtYXRVVENTaG9ydE1vbnRoLFxuICAgICAgXCJCXCI6IGZvcm1hdFVUQ01vbnRoLFxuICAgICAgXCJjXCI6IG51bGwsXG4gICAgICBcImRcIjogZm9ybWF0VVRDRGF5T2ZNb250aCxcbiAgICAgIFwiZVwiOiBmb3JtYXRVVENEYXlPZk1vbnRoLFxuICAgICAgXCJIXCI6IGZvcm1hdFVUQ0hvdXIyNCxcbiAgICAgIFwiSVwiOiBmb3JtYXRVVENIb3VyMTIsXG4gICAgICBcImpcIjogZm9ybWF0VVRDRGF5T2ZZZWFyLFxuICAgICAgXCJMXCI6IGZvcm1hdFVUQ01pbGxpc2Vjb25kcyxcbiAgICAgIFwibVwiOiBmb3JtYXRVVENNb250aE51bWJlcixcbiAgICAgIFwiTVwiOiBmb3JtYXRVVENNaW51dGVzLFxuICAgICAgXCJwXCI6IGZvcm1hdFVUQ1BlcmlvZCxcbiAgICAgIFwiU1wiOiBmb3JtYXRVVENTZWNvbmRzLFxuICAgICAgXCJVXCI6IGZvcm1hdFVUQ1dlZWtOdW1iZXJTdW5kYXksXG4gICAgICBcIndcIjogZm9ybWF0VVRDV2Vla2RheU51bWJlcixcbiAgICAgIFwiV1wiOiBmb3JtYXRVVENXZWVrTnVtYmVyTW9uZGF5LFxuICAgICAgXCJ4XCI6IG51bGwsXG4gICAgICBcIlhcIjogbnVsbCxcbiAgICAgIFwieVwiOiBmb3JtYXRVVENZZWFyLFxuICAgICAgXCJZXCI6IGZvcm1hdFVUQ0Z1bGxZZWFyLFxuICAgICAgXCJaXCI6IGZvcm1hdFVUQ1pvbmUsXG4gICAgICBcIiVcIjogZm9ybWF0TGl0ZXJhbFBlcmNlbnRcbiAgICB9O1xuXG4gICAgdmFyIHBhcnNlcyA9IHtcbiAgICAgIFwiYVwiOiBwYXJzZVNob3J0V2Vla2RheSxcbiAgICAgIFwiQVwiOiBwYXJzZVdlZWtkYXksXG4gICAgICBcImJcIjogcGFyc2VTaG9ydE1vbnRoLFxuICAgICAgXCJCXCI6IHBhcnNlTW9udGgsXG4gICAgICBcImNcIjogcGFyc2VMb2NhbGVEYXRlVGltZSxcbiAgICAgIFwiZFwiOiBwYXJzZURheU9mTW9udGgsXG4gICAgICBcImVcIjogcGFyc2VEYXlPZk1vbnRoLFxuICAgICAgXCJIXCI6IHBhcnNlSG91cjI0LFxuICAgICAgXCJJXCI6IHBhcnNlSG91cjI0LFxuICAgICAgXCJqXCI6IHBhcnNlRGF5T2ZZZWFyLFxuICAgICAgXCJMXCI6IHBhcnNlTWlsbGlzZWNvbmRzLFxuICAgICAgXCJtXCI6IHBhcnNlTW9udGhOdW1iZXIsXG4gICAgICBcIk1cIjogcGFyc2VNaW51dGVzLFxuICAgICAgXCJwXCI6IHBhcnNlUGVyaW9kLFxuICAgICAgXCJTXCI6IHBhcnNlU2Vjb25kcyxcbiAgICAgIFwiVVwiOiBwYXJzZVdlZWtOdW1iZXJTdW5kYXksXG4gICAgICBcIndcIjogcGFyc2VXZWVrZGF5TnVtYmVyLFxuICAgICAgXCJXXCI6IHBhcnNlV2Vla051bWJlck1vbmRheSxcbiAgICAgIFwieFwiOiBwYXJzZUxvY2FsZURhdGUsXG4gICAgICBcIlhcIjogcGFyc2VMb2NhbGVUaW1lLFxuICAgICAgXCJ5XCI6IHBhcnNlWWVhcixcbiAgICAgIFwiWVwiOiBwYXJzZUZ1bGxZZWFyLFxuICAgICAgXCJaXCI6IHBhcnNlWm9uZSxcbiAgICAgIFwiJVwiOiBwYXJzZUxpdGVyYWxQZXJjZW50XG4gICAgfTtcblxuICAgIC8vIFRoZXNlIHJlY3Vyc2l2ZSBkaXJlY3RpdmUgZGVmaW5pdGlvbnMgbXVzdCBiZSBkZWZlcnJlZC5cbiAgICBmb3JtYXRzLnggPSBuZXdGb3JtYXQobG9jYWxlX2RhdGUsIGZvcm1hdHMpO1xuICAgIGZvcm1hdHMuWCA9IG5ld0Zvcm1hdChsb2NhbGVfdGltZSwgZm9ybWF0cyk7XG4gICAgZm9ybWF0cy5jID0gbmV3Rm9ybWF0KGxvY2FsZV9kYXRlVGltZSwgZm9ybWF0cyk7XG4gICAgdXRjRm9ybWF0cy54ID0gbmV3Rm9ybWF0KGxvY2FsZV9kYXRlLCB1dGNGb3JtYXRzKTtcbiAgICB1dGNGb3JtYXRzLlggPSBuZXdGb3JtYXQobG9jYWxlX3RpbWUsIHV0Y0Zvcm1hdHMpO1xuICAgIHV0Y0Zvcm1hdHMuYyA9IG5ld0Zvcm1hdChsb2NhbGVfZGF0ZVRpbWUsIHV0Y0Zvcm1hdHMpO1xuXG4gICAgZnVuY3Rpb24gbmV3Rm9ybWF0KHNwZWNpZmllciwgZm9ybWF0cykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgdmFyIHN0cmluZyA9IFtdLFxuICAgICAgICAgICAgaSA9IC0xLFxuICAgICAgICAgICAgaiA9IDAsXG4gICAgICAgICAgICBuID0gc3BlY2lmaWVyLmxlbmd0aCxcbiAgICAgICAgICAgIGMsXG4gICAgICAgICAgICBwYWQsXG4gICAgICAgICAgICBmb3JtYXQ7XG5cbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICBpZiAoc3BlY2lmaWVyLmNoYXJDb2RlQXQoaSkgPT09IDM3KSB7XG4gICAgICAgICAgICBzdHJpbmcucHVzaChzcGVjaWZpZXIuc2xpY2UoaiwgaSkpO1xuICAgICAgICAgICAgaWYgKChwYWQgPSBwYWRzW2MgPSBzcGVjaWZpZXIuY2hhckF0KCsraSldKSAhPSBudWxsKSBjID0gc3BlY2lmaWVyLmNoYXJBdCgrK2kpO1xuICAgICAgICAgICAgaWYgKGZvcm1hdCA9IGZvcm1hdHNbY10pIGMgPSBmb3JtYXQoZGF0ZSwgcGFkID09IG51bGwgPyAoYyA9PT0gXCJlXCIgPyBcIiBcIiA6IFwiMFwiKSA6IHBhZCk7XG4gICAgICAgICAgICBzdHJpbmcucHVzaChjKTtcbiAgICAgICAgICAgIGogPSBpICsgMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdHJpbmcucHVzaChzcGVjaWZpZXIuc2xpY2UoaiwgaSkpO1xuICAgICAgICByZXR1cm4gc3RyaW5nLmpvaW4oXCJcIik7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5ld1BhcnNlKHNwZWNpZmllciwgbmV3RGF0ZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgICB2YXIgZCA9IG5ld1llYXIoMTkwMCksXG4gICAgICAgICAgICBpID0gcGFyc2VTcGVjaWZpZXIoZCwgc3BlY2lmaWVyLCBzdHJpbmcsIDApO1xuICAgICAgICBpZiAoaSAhPSBzdHJpbmcubGVuZ3RoKSByZXR1cm4gbnVsbDtcblxuICAgICAgICAvLyBUaGUgYW0tcG0gZmxhZyBpcyAwIGZvciBBTSwgYW5kIDEgZm9yIFBNLlxuICAgICAgICBpZiAoXCJwXCIgaW4gZCkgZC5IID0gZC5IICUgMTIgKyBkLnAgKiAxMjtcblxuICAgICAgICAvLyBJZiBhIHRpbWUgem9uZSBpcyBzcGVjaWZpZWQsIGFsbCBmaWVsZHMgYXJlIGludGVycHJldGVkIGFzIFVUQyBhbmQgdGhlblxuICAgICAgICAvLyBvZmZzZXQgYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpZWQgdGltZSB6b25lLlxuICAgICAgICBpZiAoXCJaXCIgaW4gZCkge1xuICAgICAgICAgIGlmIChcIndcIiBpbiBkICYmIChcIldcIiBpbiBkIHx8IFwiVVwiIGluIGQpKSB7XG4gICAgICAgICAgICB2YXIgZGF5ID0gdXRjRGF0ZShuZXdZZWFyKGQueSkpLmdldFVUQ0RheSgpO1xuICAgICAgICAgICAgaWYgKFwiV1wiIGluIGQpIGQuVSA9IGQuVywgZC53ID0gKGQudyArIDYpICUgNywgLS1kYXk7XG4gICAgICAgICAgICBkLm0gPSAwO1xuICAgICAgICAgICAgZC5kID0gZC53ICsgZC5VICogNyAtIChkYXkgKyA2KSAlIDc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGQuSCArPSBkLlogLyAxMDAgfCAwO1xuICAgICAgICAgIGQuTSArPSBkLlogJSAxMDA7XG4gICAgICAgICAgcmV0dXJuIHV0Y0RhdGUoZCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPdGhlcndpc2UsIGFsbCBmaWVsZHMgYXJlIGluIGxvY2FsIHRpbWUuXG4gICAgICAgIGlmIChcIndcIiBpbiBkICYmIChcIldcIiBpbiBkIHx8IFwiVVwiIGluIGQpKSB7XG4gICAgICAgICAgdmFyIGRheSA9IG5ld0RhdGUobmV3WWVhcihkLnkpKS5nZXREYXkoKTtcbiAgICAgICAgICBpZiAoXCJXXCIgaW4gZCkgZC5VID0gZC5XLCBkLncgPSAoZC53ICsgNikgJSA3LCAtLWRheTtcbiAgICAgICAgICBkLm0gPSAwO1xuICAgICAgICAgIGQuZCA9IGQudyArIGQuVSAqIDcgLSAoZGF5ICsgNikgJSA3O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEYXRlKGQpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVNwZWNpZmllcihkLCBzcGVjaWZpZXIsIHN0cmluZywgaikge1xuICAgICAgdmFyIGkgPSAwLFxuICAgICAgICAgIG4gPSBzcGVjaWZpZXIubGVuZ3RoLFxuICAgICAgICAgIG0gPSBzdHJpbmcubGVuZ3RoLFxuICAgICAgICAgIGMsXG4gICAgICAgICAgcGFyc2U7XG5cbiAgICAgIHdoaWxlIChpIDwgbikge1xuICAgICAgICBpZiAoaiA+PSBtKSByZXR1cm4gLTE7XG4gICAgICAgIGMgPSBzcGVjaWZpZXIuY2hhckNvZGVBdChpKyspO1xuICAgICAgICBpZiAoYyA9PT0gMzcpIHtcbiAgICAgICAgICBjID0gc3BlY2lmaWVyLmNoYXJBdChpKyspO1xuICAgICAgICAgIHBhcnNlID0gcGFyc2VzW2MgaW4gcGFkcyA/IHNwZWNpZmllci5jaGFyQXQoaSsrKSA6IGNdO1xuICAgICAgICAgIGlmICghcGFyc2UgfHwgKChqID0gcGFyc2UoZCwgc3RyaW5nLCBqKSkgPCAwKSkgcmV0dXJuIC0xO1xuICAgICAgICB9IGVsc2UgaWYgKGMgIT0gc3RyaW5nLmNoYXJDb2RlQXQoaisrKSkge1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gajtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVNob3J0V2Vla2RheShkLCBzdHJpbmcsIGkpIHtcbiAgICAgIHZhciBuID0gc2hvcnRXZWVrZGF5UmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgICAgcmV0dXJuIG4gPyAoZC53ID0gc2hvcnRXZWVrZGF5TG9va3VwLmdldChuWzBdLnRvTG93ZXJDYXNlKCkpLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VXZWVrZGF5KGQsIHN0cmluZywgaSkge1xuICAgICAgdmFyIG4gPSB3ZWVrZGF5UmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgICAgcmV0dXJuIG4gPyAoZC53ID0gd2Vla2RheUxvb2t1cC5nZXQoblswXS50b0xvd2VyQ2FzZSgpKSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlU2hvcnRNb250aChkLCBzdHJpbmcsIGkpIHtcbiAgICAgIHZhciBuID0gc2hvcnRNb250aFJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICAgIHJldHVybiBuID8gKGQubSA9IHNob3J0TW9udGhMb29rdXAuZ2V0KG5bMF0udG9Mb3dlckNhc2UoKSksIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU1vbnRoKGQsIHN0cmluZywgaSkge1xuICAgICAgdmFyIG4gPSBtb250aFJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICAgIHJldHVybiBuID8gKGQubSA9IG1vbnRoTG9va3VwLmdldChuWzBdLnRvTG93ZXJDYXNlKCkpLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VMb2NhbGVEYXRlVGltZShkLCBzdHJpbmcsIGkpIHtcbiAgICAgIHJldHVybiBwYXJzZVNwZWNpZmllcihkLCBsb2NhbGVfZGF0ZVRpbWUsIHN0cmluZywgaSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VMb2NhbGVEYXRlKGQsIHN0cmluZywgaSkge1xuICAgICAgcmV0dXJuIHBhcnNlU3BlY2lmaWVyKGQsIGxvY2FsZV9kYXRlLCBzdHJpbmcsIGkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTG9jYWxlVGltZShkLCBzdHJpbmcsIGkpIHtcbiAgICAgIHJldHVybiBwYXJzZVNwZWNpZmllcihkLCBsb2NhbGVfdGltZSwgc3RyaW5nLCBpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVBlcmlvZChkLCBzdHJpbmcsIGkpIHtcbiAgICAgIHZhciBuID0gcGVyaW9kTG9va3VwLmdldChzdHJpbmcuc2xpY2UoaSwgaSArPSAyKS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIHJldHVybiBuID09IG51bGwgPyAtMSA6IChkLnAgPSBuLCBpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRTaG9ydFdlZWtkYXkoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV9zaG9ydFdlZWtkYXlzW2QuZ2V0RGF5KCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFdlZWtkYXkoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV93ZWVrZGF5c1tkLmdldERheSgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRTaG9ydE1vbnRoKGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfc2hvcnRNb250aHNbZC5nZXRNb250aCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRNb250aChkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX21vbnRoc1tkLmdldE1vbnRoKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFBlcmlvZChkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX3BlcmlvZHNbKyhkLmdldEhvdXJzKCkgPj0gMTIpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRVVENTaG9ydFdlZWtkYXkoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV9zaG9ydFdlZWtkYXlzW2QuZ2V0VVRDRGF5KCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFVUQ1dlZWtkYXkoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV93ZWVrZGF5c1tkLmdldFVUQ0RheSgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRVVENTaG9ydE1vbnRoKGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfc2hvcnRNb250aHNbZC5nZXRVVENNb250aCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRVVENNb250aChkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX21vbnRoc1tkLmdldFVUQ01vbnRoKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFVUQ1BlcmlvZChkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX3BlcmlvZHNbKyhkLmdldFVUQ0hvdXJzKCkgPj0gMTIpXTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZm9ybWF0OiBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgICAgICAgdmFyIGYgPSBuZXdGb3JtYXQoc3BlY2lmaWVyICs9IFwiXCIsIGZvcm1hdHMpO1xuICAgICAgICBmLnBhcnNlID0gbmV3UGFyc2Uoc3BlY2lmaWVyLCBsb2NhbERhdGUpO1xuICAgICAgICBmLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7IHJldHVybiBzcGVjaWZpZXI7IH07XG4gICAgICAgIHJldHVybiBmO1xuICAgICAgfSxcbiAgICAgIHV0Y0Zvcm1hdDogZnVuY3Rpb24oc3BlY2lmaWVyKSB7XG4gICAgICAgIHZhciBmID0gbmV3Rm9ybWF0KHNwZWNpZmllciArPSBcIlwiLCB1dGNGb3JtYXRzKTtcbiAgICAgICAgZi5wYXJzZSA9IG5ld1BhcnNlKHNwZWNpZmllciwgdXRjRGF0ZSk7XG4gICAgICAgIGYudG9TdHJpbmcgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHNwZWNpZmllcjsgfTtcbiAgICAgICAgcmV0dXJuIGY7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHZhciBsb2NhbGUgPSBsb2NhbGVGb3JtYXQoe1xuICAgIGRhdGVUaW1lOiBcIiVhICViICVlICVYICVZXCIsXG4gICAgZGF0ZTogXCIlbS8lZC8lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLFxuICAgIGRheXM6IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdLFxuICAgIHNob3J0RGF5czogW1wiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCJdLFxuICAgIG1vbnRoczogW1wiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIiwgXCJKdWx5XCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2N0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIl0sXG4gICAgc2hvcnRNb250aHM6IFtcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLCBcIk9jdFwiLCBcIk5vdlwiLCBcIkRlY1wiXVxuICB9KTtcblxuICBleHBvcnRzLmZvcm1hdCA9IGxvY2FsZS5mb3JtYXQ7XG4gIGV4cG9ydHMudXRjRm9ybWF0ID0gbG9jYWxlLnV0Y0Zvcm1hdDtcblxuICB2YXIgaXNvU3BlY2lmaWVyID0gXCIlWS0lbS0lZFQlSDolTTolUy4lTFpcIjtcblxuICBmdW5jdGlvbiBmb3JtYXRJc29OYXRpdmUoZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCk7XG4gIH1cblxuICBmb3JtYXRJc29OYXRpdmUucGFyc2UgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHN0cmluZyk7XG4gICAgcmV0dXJuIGlzTmFOKGRhdGUpID8gbnVsbCA6IGRhdGU7XG4gIH07XG5cbiAgZm9ybWF0SXNvTmF0aXZlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGlzb1NwZWNpZmllcjtcbiAgfTtcblxuICB2YXIgZm9ybWF0SXNvID0gRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcgJiYgK25ldyBEYXRlKFwiMjAwMC0wMS0wMVQwMDowMDowMC4wMDBaXCIpXG4gICAgICA/IGZvcm1hdElzb05hdGl2ZVxuICAgICAgOiBsb2NhbGUudXRjRm9ybWF0KGlzb1NwZWNpZmllcik7XG5cbiAgdmFyIGlzb0Zvcm1hdCA9IGZvcm1hdElzbztcblxuICBleHBvcnRzLmlzb0Zvcm1hdCA9IGlzb0Zvcm1hdDtcbiAgZXhwb3J0cy5sb2NhbGVGb3JtYXQgPSBsb2NhbGVGb3JtYXQ7XG5cbn0pKTsiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gIGZhY3RvcnkoKGdsb2JhbC50aW1lID0ge30pKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciB0MSA9IG5ldyBEYXRlO1xuXG4gIHZhciB0MCA9IG5ldyBEYXRlO1xuXG4gIGZ1bmN0aW9uIG5ld0ludGVydmFsKGZsb29yaSwgb2Zmc2V0aSwgY291bnQpIHtcblxuICAgIGZ1bmN0aW9uIGludGVydmFsKGRhdGUpIHtcbiAgICAgIHJldHVybiBmbG9vcmkoZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKSksIGRhdGU7XG4gICAgfVxuXG4gICAgaW50ZXJ2YWwuZmxvb3IgPSBpbnRlcnZhbDtcblxuICAgIGludGVydmFsLnJvdW5kID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgdmFyIGQwID0gbmV3IERhdGUoK2RhdGUpLFxuICAgICAgICAgIGQxID0gbmV3IERhdGUoZGF0ZSAtIDEpO1xuICAgICAgZmxvb3JpKGQwKSwgZmxvb3JpKGQxKSwgb2Zmc2V0aShkMSwgMSk7XG4gICAgICByZXR1cm4gZGF0ZSAtIGQwIDwgZDEgLSBkYXRlID8gZDAgOiBkMTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwuY2VpbCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIHJldHVybiBmbG9vcmkoZGF0ZSA9IG5ldyBEYXRlKGRhdGUgLSAxKSksIG9mZnNldGkoZGF0ZSwgMSksIGRhdGU7XG4gICAgfTtcblxuICAgIGludGVydmFsLm9mZnNldCA9IGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgIHJldHVybiBvZmZzZXRpKGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSksIHN0ZXAgPT0gbnVsbCA/IDEgOiBNYXRoLmZsb29yKHN0ZXApKSwgZGF0ZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgICAgdmFyIHJhbmdlID0gW107XG4gICAgICBzdGFydCA9IG5ldyBEYXRlKHN0YXJ0IC0gMSk7XG4gICAgICBzdG9wID0gbmV3IERhdGUoK3N0b3ApO1xuICAgICAgc3RlcCA9IHN0ZXAgPT0gbnVsbCA/IDEgOiBNYXRoLmZsb29yKHN0ZXApO1xuICAgICAgaWYgKCEoc3RhcnQgPCBzdG9wKSB8fCAhKHN0ZXAgPiAwKSkgcmV0dXJuIHJhbmdlOyAvLyBhbHNvIGhhbmRsZXMgSW52YWxpZCBEYXRlXG4gICAgICBvZmZzZXRpKHN0YXJ0LCAxKSwgZmxvb3JpKHN0YXJ0KTtcbiAgICAgIGlmIChzdGFydCA8IHN0b3ApIHJhbmdlLnB1c2gobmV3IERhdGUoK3N0YXJ0KSk7XG4gICAgICB3aGlsZSAob2Zmc2V0aShzdGFydCwgc3RlcCksIGZsb29yaShzdGFydCksIHN0YXJ0IDwgc3RvcCkgcmFuZ2UucHVzaChuZXcgRGF0ZSgrc3RhcnQpKTtcbiAgICAgIHJldHVybiByYW5nZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwuZmlsdGVyID0gZnVuY3Rpb24odGVzdCkge1xuICAgICAgcmV0dXJuIG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgd2hpbGUgKGZsb29yaShkYXRlKSwgIXRlc3QoZGF0ZSkpIGRhdGUuc2V0VGltZShkYXRlIC0gMSk7XG4gICAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICAgIHdoaWxlICgtLXN0ZXAgPj0gMCkgd2hpbGUgKG9mZnNldGkoZGF0ZSwgMSksICF0ZXN0KGRhdGUpKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBpZiAoY291bnQpIGludGVydmFsLmNvdW50ID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgdDAuc2V0VGltZSgrc3RhcnQpLCB0MS5zZXRUaW1lKCtlbmQpO1xuICAgICAgZmxvb3JpKHQwKSwgZmxvb3JpKHQxKTtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKGNvdW50KHQwLCB0MSkpO1xuICAgIH07XG5cbiAgICByZXR1cm4gaW50ZXJ2YWw7XG4gIH1cblxuICB2YXIgc2Vjb25kID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0TWlsbGlzZWNvbmRzKDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDFlMyk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDFlMztcbiAgfSk7XG5cbiAgZXhwb3J0cy5zZWNvbmRzID0gc2Vjb25kLnJhbmdlO1xuXG4gIHZhciBtaW51dGUgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRTZWNvbmRzKDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDZlNCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDZlNDtcbiAgfSk7XG5cbiAgZXhwb3J0cy5taW51dGVzID0gbWludXRlLnJhbmdlO1xuXG4gIHZhciBob3VyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0TWludXRlcygwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiAzNmU1KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMzZlNTtcbiAgfSk7XG5cbiAgZXhwb3J0cy5ob3VycyA9IGhvdXIucmFuZ2U7XG5cbiAgdmFyIGRheSA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0IC0gKGVuZC5nZXRUaW1lem9uZU9mZnNldCgpIC0gc3RhcnQuZ2V0VGltZXpvbmVPZmZzZXQoKSkgKiA2ZTQpIC8gODY0ZTU7XG4gIH0pO1xuXG4gIGV4cG9ydHMuZGF5cyA9IGRheS5yYW5nZTtcblxuICBmdW5jdGlvbiB3ZWVrZGF5KGkpIHtcbiAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIChkYXRlLmdldERheSgpICsgNyAtIGkpICUgNyk7XG4gICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgc3RlcCAqIDcpO1xuICAgIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiAoZW5kIC0gc3RhcnQgLSAoZW5kLmdldFRpbWV6b25lT2Zmc2V0KCkgLSBzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpKSAqIDZlNCkgLyA2MDQ4ZTU7XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLnN1bmRheSA9IHdlZWtkYXkoMCk7XG5cbiAgZXhwb3J0cy5zdW5kYXlzID0gZXhwb3J0cy5zdW5kYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy5tb25kYXkgPSB3ZWVrZGF5KDEpO1xuXG4gIGV4cG9ydHMubW9uZGF5cyA9IGV4cG9ydHMubW9uZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMudHVlc2RheSA9IHdlZWtkYXkoMik7XG5cbiAgZXhwb3J0cy50dWVzZGF5cyA9IGV4cG9ydHMudHVlc2RheS5yYW5nZTtcblxuICBleHBvcnRzLndlZG5lc2RheSA9IHdlZWtkYXkoMyk7XG5cbiAgZXhwb3J0cy53ZWRuZXNkYXlzID0gZXhwb3J0cy53ZWRuZXNkYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy50aHVyc2RheSA9IHdlZWtkYXkoNCk7XG5cbiAgZXhwb3J0cy50aHVyc2RheXMgPSBleHBvcnRzLnRodXJzZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMuZnJpZGF5ID0gd2Vla2RheSg1KTtcblxuICBleHBvcnRzLmZyaWRheXMgPSBleHBvcnRzLmZyaWRheS5yYW5nZTtcblxuICBleHBvcnRzLnNhdHVyZGF5ID0gd2Vla2RheSg2KTtcblxuICBleHBvcnRzLnNhdHVyZGF5cyA9IGV4cG9ydHMuc2F0dXJkYXkucmFuZ2U7XG5cbiAgdmFyIHdlZWsgPSBleHBvcnRzLnN1bmRheTtcblxuICBleHBvcnRzLndlZWtzID0gd2Vlay5yYW5nZTtcblxuICB2YXIgbW9udGggPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldERhdGUoMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRNb250aCgpIC0gc3RhcnQuZ2V0TW9udGgoKSArIChlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCkpICogMTI7XG4gIH0pO1xuXG4gIGV4cG9ydHMubW9udGhzID0gbW9udGgucmFuZ2U7XG5cbiAgdmFyIHllYXIgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldE1vbnRoKDAsIDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCk7XG4gIH0pO1xuXG4gIGV4cG9ydHMueWVhcnMgPSB5ZWFyLnJhbmdlO1xuXG4gIHZhciB1dGNTZWNvbmQgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENNaWxsaXNlY29uZHMoMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMWUzKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMWUzO1xuICB9KTtcblxuICBleHBvcnRzLnV0Y1NlY29uZHMgPSB1dGNTZWNvbmQucmFuZ2U7XG5cbiAgdmFyIHV0Y01pbnV0ZSA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ1NlY29uZHMoMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogNmU0KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gNmU0O1xuICB9KTtcblxuICBleHBvcnRzLnV0Y01pbnV0ZXMgPSB1dGNNaW51dGUucmFuZ2U7XG5cbiAgdmFyIHV0Y0hvdXIgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENNaW51dGVzKDAsIDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDM2ZTUpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyAzNmU1O1xuICB9KTtcblxuICBleHBvcnRzLnV0Y0hvdXJzID0gdXRjSG91ci5yYW5nZTtcblxuICB2YXIgdXRjRGF5ID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gODY0ZTU7XG4gIH0pO1xuXG4gIGV4cG9ydHMudXRjRGF5cyA9IHV0Y0RheS5yYW5nZTtcblxuICBmdW5jdGlvbiB1dGNXZWVrZGF5KGkpIHtcbiAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSAtIChkYXRlLmdldFVUQ0RheSgpICsgNyAtIGkpICUgNyk7XG4gICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpICsgc3RlcCAqIDcpO1xuICAgIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gNjA0OGU1O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy51dGNTdW5kYXkgPSB1dGNXZWVrZGF5KDApO1xuXG4gIGV4cG9ydHMudXRjU3VuZGF5cyA9IGV4cG9ydHMudXRjU3VuZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMudXRjTW9uZGF5ID0gdXRjV2Vla2RheSgxKTtcblxuICBleHBvcnRzLnV0Y01vbmRheXMgPSBleHBvcnRzLnV0Y01vbmRheS5yYW5nZTtcblxuICBleHBvcnRzLnV0Y1R1ZXNkYXkgPSB1dGNXZWVrZGF5KDIpO1xuXG4gIGV4cG9ydHMudXRjVHVlc2RheXMgPSBleHBvcnRzLnV0Y1R1ZXNkYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy51dGNXZWRuZXNkYXkgPSB1dGNXZWVrZGF5KDMpO1xuXG4gIGV4cG9ydHMudXRjV2VkbmVzZGF5cyA9IGV4cG9ydHMudXRjV2VkbmVzZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMudXRjVGh1cnNkYXkgPSB1dGNXZWVrZGF5KDQpO1xuXG4gIGV4cG9ydHMudXRjVGh1cnNkYXlzID0gZXhwb3J0cy51dGNUaHVyc2RheS5yYW5nZTtcblxuICBleHBvcnRzLnV0Y0ZyaWRheSA9IHV0Y1dlZWtkYXkoNSk7XG5cbiAgZXhwb3J0cy51dGNGcmlkYXlzID0gZXhwb3J0cy51dGNGcmlkYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy51dGNTYXR1cmRheSA9IHV0Y1dlZWtkYXkoNik7XG5cbiAgZXhwb3J0cy51dGNTYXR1cmRheXMgPSBleHBvcnRzLnV0Y1NhdHVyZGF5LnJhbmdlO1xuXG4gIHZhciB1dGNXZWVrID0gZXhwb3J0cy51dGNTdW5kYXk7XG5cbiAgZXhwb3J0cy51dGNXZWVrcyA9IHV0Y1dlZWsucmFuZ2U7XG5cbiAgdmFyIHV0Y01vbnRoID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXRVVENEYXRlKDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRVVENNb250aChkYXRlLmdldFVUQ01vbnRoKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0VVRDTW9udGgoKSAtIHN0YXJ0LmdldFVUQ01vbnRoKCkgKyAoZW5kLmdldFVUQ0Z1bGxZZWFyKCkgLSBzdGFydC5nZXRVVENGdWxsWWVhcigpKSAqIDEyO1xuICB9KTtcblxuICBleHBvcnRzLnV0Y01vbnRocyA9IHV0Y01vbnRoLnJhbmdlO1xuXG4gIHZhciB1dGNZZWFyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXRVVENNb250aCgwLCAxKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoZGF0ZS5nZXRVVENGdWxsWWVhcigpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZW5kLmdldFVUQ0Z1bGxZZWFyKCkgLSBzdGFydC5nZXRVVENGdWxsWWVhcigpO1xuICB9KTtcblxuICBleHBvcnRzLnV0Y1llYXJzID0gdXRjWWVhci5yYW5nZTtcblxuICBleHBvcnRzLmludGVydmFsID0gbmV3SW50ZXJ2YWw7XG4gIGV4cG9ydHMuc2Vjb25kID0gc2Vjb25kO1xuICBleHBvcnRzLm1pbnV0ZSA9IG1pbnV0ZTtcbiAgZXhwb3J0cy5ob3VyID0gaG91cjtcbiAgZXhwb3J0cy5kYXkgPSBkYXk7XG4gIGV4cG9ydHMud2VlayA9IHdlZWs7XG4gIGV4cG9ydHMubW9udGggPSBtb250aDtcbiAgZXhwb3J0cy55ZWFyID0geWVhcjtcbiAgZXhwb3J0cy51dGNTZWNvbmQgPSB1dGNTZWNvbmQ7XG4gIGV4cG9ydHMudXRjTWludXRlID0gdXRjTWludXRlO1xuICBleHBvcnRzLnV0Y0hvdXIgPSB1dGNIb3VyO1xuICBleHBvcnRzLnV0Y0RheSA9IHV0Y0RheTtcbiAgZXhwb3J0cy51dGNXZWVrID0gdXRjV2VlaztcbiAgZXhwb3J0cy51dGNNb250aCA9IHV0Y01vbnRoO1xuICBleHBvcnRzLnV0Y1llYXIgPSB1dGNZZWFyO1xuXG59KSk7IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gICAgdGltZSA9IHJlcXVpcmUoJy4uL3RpbWUnKSxcbiAgICBFUFNJTE9OID0gMWUtMTU7XG5cbmZ1bmN0aW9uIGJpbnMob3B0KSB7XG4gIGlmICghb3B0KSB7IHRocm93IEVycm9yKFwiTWlzc2luZyBiaW5uaW5nIG9wdGlvbnMuXCIpOyB9XG5cbiAgLy8gZGV0ZXJtaW5lIHJhbmdlXG4gIHZhciBtYXhiID0gb3B0Lm1heGJpbnMgfHwgMTUsXG4gICAgICBiYXNlID0gb3B0LmJhc2UgfHwgMTAsXG4gICAgICBsb2diID0gTWF0aC5sb2coYmFzZSksXG4gICAgICBkaXYgPSBvcHQuZGl2IHx8IFs1LCAyXSwgICAgICBcbiAgICAgIG1pbiA9IG9wdC5taW4sXG4gICAgICBtYXggPSBvcHQubWF4LFxuICAgICAgc3BhbiA9IG1heCAtIG1pbixcbiAgICAgIHN0ZXAsIGxldmVsLCBtaW5zdGVwLCBwcmVjaXNpb24sIHYsIGksIGVwcztcblxuICBpZiAob3B0LnN0ZXApIHtcbiAgICAvLyBpZiBzdGVwIHNpemUgaXMgZXhwbGljaXRseSBnaXZlbiwgdXNlIHRoYXRcbiAgICBzdGVwID0gb3B0LnN0ZXA7XG4gIH0gZWxzZSBpZiAob3B0LnN0ZXBzKSB7XG4gICAgLy8gaWYgcHJvdmlkZWQsIGxpbWl0IGNob2ljZSB0byBhY2NlcHRhYmxlIHN0ZXAgc2l6ZXNcbiAgICBzdGVwID0gb3B0LnN0ZXBzW01hdGgubWluKFxuICAgICAgb3B0LnN0ZXBzLmxlbmd0aCAtIDEsXG4gICAgICBiaXNlY3Qob3B0LnN0ZXBzLCBzcGFuL21heGIsIDAsIG9wdC5zdGVwcy5sZW5ndGgpXG4gICAgKV07XG4gIH0gZWxzZSB7XG4gICAgLy8gZWxzZSB1c2Ugc3BhbiB0byBkZXRlcm1pbmUgc3RlcCBzaXplXG4gICAgbGV2ZWwgPSBNYXRoLmNlaWwoTWF0aC5sb2cobWF4YikgLyBsb2diKTtcbiAgICBtaW5zdGVwID0gb3B0Lm1pbnN0ZXAgfHwgMDtcbiAgICBzdGVwID0gTWF0aC5tYXgoXG4gICAgICBtaW5zdGVwLFxuICAgICAgTWF0aC5wb3coYmFzZSwgTWF0aC5yb3VuZChNYXRoLmxvZyhzcGFuKSAvIGxvZ2IpIC0gbGV2ZWwpXG4gICAgKTtcbiAgICBcbiAgICAvLyBpbmNyZWFzZSBzdGVwIHNpemUgaWYgdG9vIG1hbnkgYmluc1xuICAgIGRvIHsgc3RlcCAqPSBiYXNlOyB9IHdoaWxlIChNYXRoLmNlaWwoc3Bhbi9zdGVwKSA+IG1heGIpO1xuXG4gICAgLy8gZGVjcmVhc2Ugc3RlcCBzaXplIGlmIGFsbG93ZWRcbiAgICBmb3IgKGk9MDsgaTxkaXYubGVuZ3RoOyArK2kpIHtcbiAgICAgIHYgPSBzdGVwIC8gZGl2W2ldO1xuICAgICAgaWYgKHYgPj0gbWluc3RlcCAmJiBzcGFuIC8gdiA8PSBtYXhiKSBzdGVwID0gdjtcbiAgICB9XG4gIH1cblxuICAvLyB1cGRhdGUgcHJlY2lzaW9uLCBtaW4gYW5kIG1heFxuICB2ID0gTWF0aC5sb2coc3RlcCk7XG4gIHByZWNpc2lvbiA9IHYgPj0gMCA/IDAgOiB+figtdiAvIGxvZ2IpICsgMTtcbiAgZXBzID0gTWF0aC5wb3coYmFzZSwgLXByZWNpc2lvbiAtIDEpO1xuICBtaW4gPSBNYXRoLm1pbihtaW4sIE1hdGguZmxvb3IobWluIC8gc3RlcCArIGVwcykgKiBzdGVwKTtcbiAgbWF4ID0gTWF0aC5jZWlsKG1heCAvIHN0ZXApICogc3RlcDtcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBtaW4sXG4gICAgc3RvcDogIG1heCxcbiAgICBzdGVwOiAgc3RlcCxcbiAgICB1bml0OiAge3ByZWNpc2lvbjogcHJlY2lzaW9ufSxcbiAgICB2YWx1ZTogdmFsdWUsXG4gICAgaW5kZXg6IGluZGV4XG4gIH07XG59XG5cbmZ1bmN0aW9uIGJpc2VjdChhLCB4LCBsbywgaGkpIHtcbiAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICB2YXIgbWlkID0gbG8gKyBoaSA+Pj4gMTtcbiAgICBpZiAodXRpbC5jbXAoYVttaWRdLCB4KSA8IDApIHsgbG8gPSBtaWQgKyAxOyB9XG4gICAgZWxzZSB7IGhpID0gbWlkOyB9XG4gIH1cbiAgcmV0dXJuIGxvO1xufVxuXG5mdW5jdGlvbiB2YWx1ZSh2KSB7XG4gIHJldHVybiB0aGlzLnN0ZXAgKiBNYXRoLmZsb29yKHYgLyB0aGlzLnN0ZXAgKyBFUFNJTE9OKTtcbn1cblxuZnVuY3Rpb24gaW5kZXgodikge1xuICByZXR1cm4gTWF0aC5mbG9vcigodiAtIHRoaXMuc3RhcnQpIC8gdGhpcy5zdGVwICsgRVBTSUxPTik7XG59XG5cbmZ1bmN0aW9uIGRhdGVfdmFsdWUodikge1xuICByZXR1cm4gdGhpcy51bml0LmRhdGUodmFsdWUuY2FsbCh0aGlzLCB2KSk7XG59XG5cbmZ1bmN0aW9uIGRhdGVfaW5kZXgodikge1xuICByZXR1cm4gaW5kZXguY2FsbCh0aGlzLCB0aGlzLnVuaXQudW5pdCh2KSk7XG59XG5cbmJpbnMuZGF0ZSA9IGZ1bmN0aW9uKG9wdCkge1xuICBpZiAoIW9wdCkgeyB0aHJvdyBFcnJvcihcIk1pc3NpbmcgZGF0ZSBiaW5uaW5nIG9wdGlvbnMuXCIpOyB9XG5cbiAgLy8gZmluZCB0aW1lIHN0ZXAsIHRoZW4gYmluXG4gIHZhciB1bml0cyA9IG9wdC51dGMgPyB0aW1lLnV0YyA6IHRpbWUsXG4gICAgICBkbWluID0gb3B0Lm1pbixcbiAgICAgIGRtYXggPSBvcHQubWF4LFxuICAgICAgbWF4YiA9IG9wdC5tYXhiaW5zIHx8IDIwLFxuICAgICAgbWluYiA9IG9wdC5taW5iaW5zIHx8IDQsXG4gICAgICBzcGFuID0gKCtkbWF4KSAtICgrZG1pbiksXG4gICAgICB1bml0ID0gb3B0LnVuaXQgPyB1bml0c1tvcHQudW5pdF0gOiB1bml0cy5maW5kKHNwYW4sIG1pbmIsIG1heGIpLFxuICAgICAgc3BlYyA9IGJpbnMoe1xuICAgICAgICBtaW46ICAgICB1bml0Lm1pbiAhPSBudWxsID8gdW5pdC5taW4gOiB1bml0LnVuaXQoZG1pbiksXG4gICAgICAgIG1heDogICAgIHVuaXQubWF4ICE9IG51bGwgPyB1bml0Lm1heCA6IHVuaXQudW5pdChkbWF4KSxcbiAgICAgICAgbWF4YmluczogbWF4YixcbiAgICAgICAgbWluc3RlcDogdW5pdC5taW5zdGVwLFxuICAgICAgICBzdGVwczogICB1bml0LnN0ZXBcbiAgICAgIH0pO1xuXG4gIHNwZWMudW5pdCA9IHVuaXQ7XG4gIHNwZWMuaW5kZXggPSBkYXRlX2luZGV4O1xuICBpZiAoIW9wdC5yYXcpIHNwZWMudmFsdWUgPSBkYXRlX3ZhbHVlO1xuICByZXR1cm4gc3BlYztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmlucztcbiIsInZhciBnZW4gPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5nZW4ucmVwZWF0ID0gZnVuY3Rpb24odmFsLCBuKSB7XG4gIHZhciBhID0gQXJyYXkobiksIGk7XG4gIGZvciAoaT0wOyBpPG47ICsraSkgYVtpXSA9IHZhbDtcbiAgcmV0dXJuIGE7XG59O1xuXG5nZW4uemVyb3MgPSBmdW5jdGlvbihuKSB7XG4gIHJldHVybiBnZW4ucmVwZWF0KDAsIG4pO1xufTtcblxuZ2VuLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgc3RlcCA9IDE7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBzdG9wID0gc3RhcnQ7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICB9XG4gIGlmICgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXAgPT0gSW5maW5pdHkpIHRocm93IG5ldyBFcnJvcignSW5maW5pdGUgcmFuZ2UnKTtcbiAgdmFyIHJhbmdlID0gW10sIGkgPSAtMSwgajtcbiAgaWYgKHN0ZXAgPCAwKSB3aGlsZSAoKGogPSBzdGFydCArIHN0ZXAgKiArK2kpID4gc3RvcCkgcmFuZ2UucHVzaChqKTtcbiAgZWxzZSB3aGlsZSAoKGogPSBzdGFydCArIHN0ZXAgKiArK2kpIDwgc3RvcCkgcmFuZ2UucHVzaChqKTtcbiAgcmV0dXJuIHJhbmdlO1xufTtcblxuZ2VuLnJhbmRvbSA9IHt9O1xuXG5nZW4ucmFuZG9tLnVuaWZvcm0gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICBpZiAobWF4ID09PSB1bmRlZmluZWQpIHtcbiAgICBtYXggPSBtaW4gPT09IHVuZGVmaW5lZCA/IDEgOiBtaW47XG4gICAgbWluID0gMDtcbiAgfVxuICB2YXIgZCA9IG1heCAtIG1pbjtcbiAgdmFyIGYgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbWluICsgZCAqIE1hdGgucmFuZG9tKCk7XG4gIH07XG4gIGYuc2FtcGxlcyA9IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIGdlbi56ZXJvcyhuKS5tYXAoZik7IH07XG4gIHJldHVybiBmO1xufTtcblxuZ2VuLnJhbmRvbS5pbnRlZ2VyID0gZnVuY3Rpb24oYSwgYikge1xuICBpZiAoYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYiA9IGE7XG4gICAgYSA9IDA7XG4gIH1cbiAgdmFyIGQgPSBiIC0gYTtcbiAgdmFyIGYgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYSArIE1hdGguZmxvb3IoZCAqIE1hdGgucmFuZG9tKCkpO1xuICB9O1xuICBmLnNhbXBsZXMgPSBmdW5jdGlvbihuKSB7IHJldHVybiBnZW4uemVyb3MobikubWFwKGYpOyB9O1xuICByZXR1cm4gZjtcbn07XG5cbmdlbi5yYW5kb20ubm9ybWFsID0gZnVuY3Rpb24obWVhbiwgc3RkZXYpIHtcbiAgbWVhbiA9IG1lYW4gfHwgMDtcbiAgc3RkZXYgPSBzdGRldiB8fCAxO1xuICB2YXIgbmV4dDtcbiAgdmFyIGYgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IDAsIHkgPSAwLCByZHMsIGM7XG4gICAgaWYgKG5leHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgeCA9IG5leHQ7XG4gICAgICBuZXh0ID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICAgIGRvIHtcbiAgICAgIHggPSBNYXRoLnJhbmRvbSgpKjItMTtcbiAgICAgIHkgPSBNYXRoLnJhbmRvbSgpKjItMTtcbiAgICAgIHJkcyA9IHgqeCArIHkqeTtcbiAgICB9IHdoaWxlIChyZHMgPT09IDAgfHwgcmRzID4gMSk7XG4gICAgYyA9IE1hdGguc3FydCgtMipNYXRoLmxvZyhyZHMpL3Jkcyk7IC8vIEJveC1NdWxsZXIgdHJhbnNmb3JtXG4gICAgbmV4dCA9IG1lYW4gKyB5KmMqc3RkZXY7XG4gICAgcmV0dXJuIG1lYW4gKyB4KmMqc3RkZXY7XG4gIH07XG4gIGYuc2FtcGxlcyA9IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIGdlbi56ZXJvcyhuKS5tYXAoZik7IH07XG4gIHJldHVybiBmO1xufTsiLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIFRZUEVTID0gJ19fdHlwZXNfXyc7XG5cbnZhciBQQVJTRVJTID0ge1xuICBib29sZWFuOiB1dGlsLmJvb2xlYW4sXG4gIGludGVnZXI6IHV0aWwubnVtYmVyLFxuICBudW1iZXI6ICB1dGlsLm51bWJlcixcbiAgZGF0ZTogICAgdXRpbC5kYXRlLFxuICBzdHJpbmc6ICBmdW5jdGlvbih4KSB7IHJldHVybiB4PT09JycgPyBudWxsIDogeDsgfVxufTtcblxudmFyIFRFU1RTID0ge1xuICBib29sZWFuOiBmdW5jdGlvbih4KSB7IHJldHVybiB4PT09J3RydWUnIHx8IHg9PT0nZmFsc2UnIHx8IHV0aWwuaXNCb29sZWFuKHgpOyB9LFxuICBpbnRlZ2VyOiBmdW5jdGlvbih4KSB7IHJldHVybiBURVNUUy5udW1iZXIoeCkgJiYgKHg9K3gpID09PSB+fng7IH0sXG4gIG51bWJlcjogZnVuY3Rpb24oeCkgeyByZXR1cm4gIWlzTmFOKCt4KSAmJiAhdXRpbC5pc0RhdGUoeCk7IH0sXG4gIGRhdGU6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuICFpc05hTihEYXRlLnBhcnNlKHgpKTsgfVxufTtcblxuZnVuY3Rpb24gYW5ub3RhdGlvbihkYXRhLCB0eXBlcykge1xuICBpZiAoIXR5cGVzKSByZXR1cm4gZGF0YSAmJiBkYXRhW1RZUEVTXSB8fCBudWxsO1xuICBkYXRhW1RZUEVTXSA9IHR5cGVzO1xufVxuXG5mdW5jdGlvbiB0eXBlKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgdiwgaSwgbjtcblxuICAvLyBpZiBkYXRhIGFycmF5IGhhcyB0eXBlIGFubm90YXRpb25zLCB1c2UgdGhlbVxuICBpZiAodmFsdWVzW1RZUEVTXSkge1xuICAgIHYgPSBmKHZhbHVlc1tUWVBFU10pO1xuICAgIGlmICh1dGlsLmlzU3RyaW5nKHYpKSByZXR1cm4gdjtcbiAgfVxuXG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7ICF1dGlsLmlzVmFsaWQodikgJiYgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgfVxuXG4gIHJldHVybiB1dGlsLmlzRGF0ZSh2KSA/ICdkYXRlJyA6XG4gICAgdXRpbC5pc051bWJlcih2KSAgICA/ICdudW1iZXInIDpcbiAgICB1dGlsLmlzQm9vbGVhbih2KSAgID8gJ2Jvb2xlYW4nIDpcbiAgICB1dGlsLmlzU3RyaW5nKHYpICAgID8gJ3N0cmluZycgOiBudWxsO1xufVxuXG5mdW5jdGlvbiB0eXBlQWxsKGRhdGEsIGZpZWxkcykge1xuICBpZiAoIWRhdGEubGVuZ3RoKSByZXR1cm47XG4gIGZpZWxkcyA9IGZpZWxkcyB8fCB1dGlsLmtleXMoZGF0YVswXSk7XG4gIHJldHVybiBmaWVsZHMucmVkdWNlKGZ1bmN0aW9uKHR5cGVzLCBmKSB7XG4gICAgcmV0dXJuICh0eXBlc1tmXSA9IHR5cGUoZGF0YSwgZiksIHR5cGVzKTtcbiAgfSwge30pO1xufVxuXG5mdW5jdGlvbiBpbmZlcih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIGksIGosIHY7XG5cbiAgLy8gdHlwZXMgdG8gdGVzdCBmb3IsIGluIHByZWNlZGVuY2Ugb3JkZXJcbiAgdmFyIHR5cGVzID0gWydib29sZWFuJywgJ2ludGVnZXInLCAnbnVtYmVyJywgJ2RhdGUnXTtcblxuICBmb3IgKGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBnZXQgbmV4dCB2YWx1ZSB0byB0ZXN0XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgLy8gdGVzdCB2YWx1ZSBhZ2FpbnN0IHJlbWFpbmluZyB0eXBlc1xuICAgIGZvciAoaj0wOyBqPHR5cGVzLmxlbmd0aDsgKytqKSB7XG4gICAgICBpZiAodXRpbC5pc1ZhbGlkKHYpICYmICFURVNUU1t0eXBlc1tqXV0odikpIHtcbiAgICAgICAgdHlwZXMuc3BsaWNlKGosIDEpO1xuICAgICAgICBqIC09IDE7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlmIG5vIHR5cGVzIGxlZnQsIHJldHVybiAnc3RyaW5nJ1xuICAgIGlmICh0eXBlcy5sZW5ndGggPT09IDApIHJldHVybiAnc3RyaW5nJztcbiAgfVxuXG4gIHJldHVybiB0eXBlc1swXTtcbn1cblxuZnVuY3Rpb24gaW5mZXJBbGwoZGF0YSwgZmllbGRzKSB7XG4gIGZpZWxkcyA9IGZpZWxkcyB8fCB1dGlsLmtleXMoZGF0YVswXSk7XG4gIHJldHVybiBmaWVsZHMucmVkdWNlKGZ1bmN0aW9uKHR5cGVzLCBmKSB7XG4gICAgdHlwZXNbZl0gPSBpbmZlcihkYXRhLCBmKTtcbiAgICByZXR1cm4gdHlwZXM7XG4gIH0sIHt9KTtcbn1cblxudHlwZS5hbm5vdGF0aW9uID0gYW5ub3RhdGlvbjtcbnR5cGUuYWxsID0gdHlwZUFsbDtcbnR5cGUuaW5mZXIgPSBpbmZlcjtcbnR5cGUuaW5mZXJBbGwgPSBpbmZlckFsbDtcbnR5cGUucGFyc2VycyA9IFBBUlNFUlM7XG5tb2R1bGUuZXhwb3J0cyA9IHR5cGU7IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciB0eXBlID0gcmVxdWlyZSgnLi9pbXBvcnQvdHlwZScpO1xudmFyIGdlbiA9IHJlcXVpcmUoJy4vZ2VuZXJhdGUnKTtcbnZhciBzdGF0cyA9IHt9O1xuXG4vLyBDb2xsZWN0IHVuaXF1ZSB2YWx1ZXMuXG4vLyBPdXRwdXQ6IGFuIGFycmF5IG9mIHVuaXF1ZSB2YWx1ZXMsIGluIGZpcnN0LW9ic2VydmVkIG9yZGVyXG5zdGF0cy51bmlxdWUgPSBmdW5jdGlvbih2YWx1ZXMsIGYsIHJlc3VsdHMpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XG4gIHZhciB1ID0ge30sIHYsIGksIG47XG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHYgaW4gdSkgY29udGludWU7XG4gICAgdVt2XSA9IDE7XG4gICAgcmVzdWx0cy5wdXNoKHYpO1xuICB9XG4gIHJldHVybiByZXN1bHRzO1xufTtcblxuLy8gUmV0dXJuIHRoZSBsZW5ndGggb2YgdGhlIGlucHV0IGFycmF5Llxuc3RhdHMuY291bnQgPSBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgcmV0dXJuIHZhbHVlcyAmJiB2YWx1ZXMubGVuZ3RoIHx8IDA7XG59O1xuXG4vLyBDb3VudCB0aGUgbnVtYmVyIG9mIG5vbi1udWxsLCBub24tdW5kZWZpbmVkLCBub24tTmFOIHZhbHVlcy5cbnN0YXRzLmNvdW50LnZhbGlkID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciB2LCBpLCBuLCB2YWxpZCA9IDA7XG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkgdmFsaWQgKz0gMTtcbiAgfVxuICByZXR1cm4gdmFsaWQ7XG59O1xuXG4vLyBDb3VudCB0aGUgbnVtYmVyIG9mIG51bGwgb3IgdW5kZWZpbmVkIHZhbHVlcy5cbnN0YXRzLmNvdW50Lm1pc3NpbmcgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIHYsIGksIG4sIGNvdW50ID0gMDtcbiAgZm9yIChpPTAsIG49dmFsdWVzLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodiA9PSBudWxsKSBjb3VudCArPSAxO1xuICB9XG4gIHJldHVybiBjb3VudDtcbn07XG5cbi8vIENvdW50IHRoZSBudW1iZXIgb2YgZGlzdGluY3QgdmFsdWVzLlxuLy8gTnVsbCwgdW5kZWZpbmVkIGFuZCBOYU4gYXJlIGVhY2ggY29uc2lkZXJlZCBkaXN0aW5jdCB2YWx1ZXMuXG5zdGF0cy5jb3VudC5kaXN0aW5jdCA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgdSA9IHt9LCB2LCBpLCBuLCBjb3VudCA9IDA7XG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHYgaW4gdSkgY29udGludWU7XG4gICAgdVt2XSA9IDE7XG4gICAgY291bnQgKz0gMTtcbiAgfVxuICByZXR1cm4gY291bnQ7XG59O1xuXG4vLyBDb25zdHJ1Y3QgYSBtYXAgZnJvbSBkaXN0aW5jdCB2YWx1ZXMgdG8gb2NjdXJyZW5jZSBjb3VudHMuXG5zdGF0cy5jb3VudC5tYXAgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIG1hcCA9IHt9LCB2LCBpLCBuO1xuICBmb3IgKGk9MCwgbj12YWx1ZXMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIG1hcFt2XSA9ICh2IGluIG1hcCkgPyBtYXBbdl0gKyAxIDogMTtcbiAgfVxuICByZXR1cm4gbWFwO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgbWVkaWFuIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5tZWRpYW4gPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgaWYgKGYpIHZhbHVlcyA9IHZhbHVlcy5tYXAodXRpbC4kKGYpKTtcbiAgdmFsdWVzID0gdmFsdWVzLmZpbHRlcih1dGlsLmlzVmFsaWQpLnNvcnQodXRpbC5jbXApO1xuICByZXR1cm4gc3RhdHMucXVhbnRpbGUodmFsdWVzLCAwLjUpO1xufTtcblxuLy8gQ29tcHV0ZXMgdGhlIHF1YXJ0aWxlIGJvdW5kYXJpZXMgb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLnF1YXJ0aWxlID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGlmIChmKSB2YWx1ZXMgPSB2YWx1ZXMubWFwKHV0aWwuJChmKSk7XG4gIHZhbHVlcyA9IHZhbHVlcy5maWx0ZXIodXRpbC5pc1ZhbGlkKS5zb3J0KHV0aWwuY21wKTtcbiAgdmFyIHEgPSBzdGF0cy5xdWFudGlsZTtcbiAgcmV0dXJuIFtxKHZhbHVlcywgMC4yNSksIHEodmFsdWVzLCAwLjUwKSwgcSh2YWx1ZXMsIDAuNzUpXTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIHF1YW50aWxlIG9mIGEgc29ydGVkIGFycmF5IG9mIG51bWJlcnMuXG4vLyBBZGFwdGVkIGZyb20gdGhlIEQzLmpzIGltcGxlbWVudGF0aW9uLlxuc3RhdHMucXVhbnRpbGUgPSBmdW5jdGlvbih2YWx1ZXMsIGYsIHApIHtcbiAgaWYgKHAgPT09IHVuZGVmaW5lZCkgeyBwID0gZjsgZiA9IHV0aWwuaWRlbnRpdHk7IH1cbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIEggPSAodmFsdWVzLmxlbmd0aCAtIDEpICogcCArIDEsXG4gICAgICBoID0gTWF0aC5mbG9vcihIKSxcbiAgICAgIHYgPSArZih2YWx1ZXNbaCAtIDFdKSxcbiAgICAgIGUgPSBIIC0gaDtcbiAgcmV0dXJuIGUgPyB2ICsgZSAqIChmKHZhbHVlc1toXSkgLSB2KSA6IHY7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBzdW0gb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLnN1bSA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICBmb3IgKHZhciBzdW09MCwgaT0wLCBuPXZhbHVlcy5sZW5ndGgsIHY7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkgc3VtICs9IHY7XG4gIH1cbiAgcmV0dXJuIHN1bTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIG1lYW4gKGF2ZXJhZ2UpIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5tZWFuID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciBtZWFuID0gMCwgZGVsdGEsIGksIG4sIGMsIHY7XG4gIGZvciAoaT0wLCBjPTAsIG49dmFsdWVzLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodXRpbC5pc1ZhbGlkKHYpKSB7XG4gICAgICBkZWx0YSA9IHYgLSBtZWFuO1xuICAgICAgbWVhbiA9IG1lYW4gKyBkZWx0YSAvICgrK2MpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbWVhbjtcbn07XG5cbi8vIENvbXB1dGUgdGhlIHNhbXBsZSB2YXJpYW5jZSBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMudmFyaWFuY2UgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgaWYgKCF1dGlsLmlzQXJyYXkodmFsdWVzKSB8fCB2YWx1ZXMubGVuZ3RoIDwgMikgcmV0dXJuIDA7XG4gIHZhciBtZWFuID0gMCwgTTIgPSAwLCBkZWx0YSwgaSwgYywgdjtcbiAgZm9yIChpPTAsIGM9MDsgaTx2YWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodXRpbC5pc1ZhbGlkKHYpKSB7XG4gICAgICBkZWx0YSA9IHYgLSBtZWFuO1xuICAgICAgbWVhbiA9IG1lYW4gKyBkZWx0YSAvICgrK2MpO1xuICAgICAgTTIgPSBNMiArIGRlbHRhICogKHYgLSBtZWFuKTtcbiAgICB9XG4gIH1cbiAgTTIgPSBNMiAvIChjIC0gMSk7XG4gIHJldHVybiBNMjtcbn07XG5cbi8vIENvbXB1dGUgdGhlIHNhbXBsZSBzdGFuZGFyZCBkZXZpYXRpb24gb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLnN0ZGV2ID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIHJldHVybiBNYXRoLnNxcnQoc3RhdHMudmFyaWFuY2UodmFsdWVzLCBmKSk7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBQZWFyc29uIG1vZGUgc2tld25lc3MgKChtZWRpYW4tbWVhbikvc3RkZXYpIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5tb2Rlc2tldyA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICB2YXIgYXZnID0gc3RhdHMubWVhbih2YWx1ZXMsIGYpLFxuICAgICAgbWVkID0gc3RhdHMubWVkaWFuKHZhbHVlcywgZiksXG4gICAgICBzdGQgPSBzdGF0cy5zdGRldih2YWx1ZXMsIGYpO1xuICByZXR1cm4gc3RkID09PSAwID8gMCA6IChhdmcgLSBtZWQpIC8gc3RkO1xufTtcblxuLy8gRmluZCB0aGUgbWluaW11bSB2YWx1ZSBpbiBhbiBhcnJheS5cbnN0YXRzLm1pbiA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICByZXR1cm4gc3RhdHMuZXh0ZW50KHZhbHVlcywgZilbMF07XG59O1xuXG4vLyBGaW5kIHRoZSBtYXhpbXVtIHZhbHVlIGluIGFuIGFycmF5Llxuc3RhdHMubWF4ID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIHJldHVybiBzdGF0cy5leHRlbnQodmFsdWVzLCBmKVsxXTtcbn07XG5cbi8vIEZpbmQgdGhlIG1pbmltdW0gYW5kIG1heGltdW0gb2YgYW4gYXJyYXkgb2YgdmFsdWVzLlxuc3RhdHMuZXh0ZW50ID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciBhLCBiLCB2LCBpLCBuID0gdmFsdWVzLmxlbmd0aDtcbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkgeyBhID0gYiA9IHY7IGJyZWFrOyB9XG4gIH1cbiAgZm9yICg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkge1xuICAgICAgaWYgKHYgPCBhKSBhID0gdjtcbiAgICAgIGlmICh2ID4gYikgYiA9IHY7XG4gICAgfVxuICB9XG4gIHJldHVybiBbYSwgYl07XG59O1xuXG4vLyBGaW5kIHRoZSBpbnRlZ2VyIGluZGljZXMgb2YgdGhlIG1pbmltdW0gYW5kIG1heGltdW0gdmFsdWVzLlxuc3RhdHMuZXh0ZW50LmluZGV4ID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciB4ID0gLTEsIHkgPSAtMSwgYSwgYiwgdiwgaSwgbiA9IHZhbHVlcy5sZW5ndGg7XG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzVmFsaWQodikpIHsgYSA9IGIgPSB2OyB4ID0geSA9IGk7IGJyZWFrOyB9XG4gIH1cbiAgZm9yICg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkge1xuICAgICAgaWYgKHYgPCBhKSB7IGEgPSB2OyB4ID0gaTsgfVxuICAgICAgaWYgKHYgPiBiKSB7IGIgPSB2OyB5ID0gaTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gW3gsIHldO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIGFycmF5cyBvZiBudW1iZXJzLlxuc3RhdHMuZG90ID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiKSB7XG4gIHZhciBzdW0gPSAwLCBpLCB2O1xuICBpZiAoIWIpIHtcbiAgICBpZiAodmFsdWVzLmxlbmd0aCAhPT0gYS5sZW5ndGgpIHtcbiAgICAgIHRocm93IEVycm9yKCdBcnJheSBsZW5ndGhzIG11c3QgbWF0Y2guJyk7XG4gICAgfVxuICAgIGZvciAoaT0wOyBpPHZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgICAgdiA9IHZhbHVlc1tpXSAqIGFbaV07XG4gICAgICBpZiAodiA9PT0gdikgc3VtICs9IHY7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGEgPSB1dGlsLiQoYSk7XG4gICAgYiA9IHV0aWwuJChiKTtcbiAgICBmb3IgKGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHYgPSBhKHZhbHVlc1tpXSkgKiBiKHZhbHVlc1tpXSk7XG4gICAgICBpZiAodiA9PT0gdikgc3VtICs9IHY7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdW07XG59O1xuXG4vLyBDb21wdXRlIGFzY2VuZGluZyByYW5rIHNjb3JlcyBmb3IgYW4gYXJyYXkgb2YgdmFsdWVzLlxuLy8gVGllcyBhcmUgYXNzaWduZWQgdGhlaXIgY29sbGVjdGl2ZSBtZWFuIHJhbmsuXG5zdGF0cy5yYW5rID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZikgfHwgdXRpbC5pZGVudGl0eTtcbiAgdmFyIGEgPSB2YWx1ZXMubWFwKGZ1bmN0aW9uKHYsIGkpIHtcbiAgICAgIHJldHVybiB7aWR4OiBpLCB2YWw6IGYodil9O1xuICAgIH0pXG4gICAgLnNvcnQodXRpbC5jb21wYXJhdG9yKCd2YWwnKSk7XG5cbiAgdmFyIG4gPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgciA9IEFycmF5KG4pLFxuICAgICAgdGllID0gLTEsIHAgPSB7fSwgaSwgdiwgbXU7XG5cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgdiA9IGFbaV0udmFsO1xuICAgIGlmICh0aWUgPCAwICYmIHAgPT09IHYpIHtcbiAgICAgIHRpZSA9IGkgLSAxO1xuICAgIH0gZWxzZSBpZiAodGllID4gLTEgJiYgcCAhPT0gdikge1xuICAgICAgbXUgPSAxICsgKGktMSArIHRpZSkgLyAyO1xuICAgICAgZm9yICg7IHRpZTxpOyArK3RpZSkgclthW3RpZV0uaWR4XSA9IG11O1xuICAgICAgdGllID0gLTE7XG4gICAgfVxuICAgIHJbYVtpXS5pZHhdID0gaSArIDE7XG4gICAgcCA9IHY7XG4gIH1cblxuICBpZiAodGllID4gLTEpIHtcbiAgICBtdSA9IDEgKyAobi0xICsgdGllKSAvIDI7XG4gICAgZm9yICg7IHRpZTxuOyArK3RpZSkgclthW3RpZV0uaWR4XSA9IG11O1xuICB9XG5cbiAgcmV0dXJuIHI7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBzYW1wbGUgUGVhcnNvbiBwcm9kdWN0LW1vbWVudCBjb3JyZWxhdGlvbiBvZiB0d28gYXJyYXlzIG9mIG51bWJlcnMuXG5zdGF0cy5jb3IgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIpIHtcbiAgdmFyIGZuID0gYjtcbiAgYiA9IGZuID8gdmFsdWVzLm1hcCh1dGlsLiQoYikpIDogYTtcbiAgYSA9IGZuID8gdmFsdWVzLm1hcCh1dGlsLiQoYSkpIDogdmFsdWVzO1xuXG4gIHZhciBkb3QgPSBzdGF0cy5kb3QoYSwgYiksXG4gICAgICBtdWEgPSBzdGF0cy5tZWFuKGEpLFxuICAgICAgbXViID0gc3RhdHMubWVhbihiKSxcbiAgICAgIHNkYSA9IHN0YXRzLnN0ZGV2KGEpLFxuICAgICAgc2RiID0gc3RhdHMuc3RkZXYoYiksXG4gICAgICBuID0gdmFsdWVzLmxlbmd0aDtcblxuICByZXR1cm4gKGRvdCAtIG4qbXVhKm11YikgLyAoKG4tMSkgKiBzZGEgKiBzZGIpO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgU3BlYXJtYW4gcmFuayBjb3JyZWxhdGlvbiBvZiB0d28gYXJyYXlzIG9mIHZhbHVlcy5cbnN0YXRzLmNvci5yYW5rID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiKSB7XG4gIHZhciByYSA9IGIgPyBzdGF0cy5yYW5rKHZhbHVlcywgdXRpbC4kKGEpKSA6IHN0YXRzLnJhbmsodmFsdWVzKSxcbiAgICAgIHJiID0gYiA/IHN0YXRzLnJhbmsodmFsdWVzLCB1dGlsLiQoYikpIDogc3RhdHMucmFuayhhKSxcbiAgICAgIG4gPSB2YWx1ZXMubGVuZ3RoLCBpLCBzLCBkO1xuXG4gIGZvciAoaT0wLCBzPTA7IGk8bjsgKytpKSB7XG4gICAgZCA9IHJhW2ldIC0gcmJbaV07XG4gICAgcyArPSBkICogZDtcbiAgfVxuXG4gIHJldHVybiAxIC0gNipzIC8gKG4gKiAobipuLTEpKTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIGRpc3RhbmNlIGNvcnJlbGF0aW9uIG9mIHR3byBhcnJheXMgb2YgbnVtYmVycy5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRGlzdGFuY2VfY29ycmVsYXRpb25cbnN0YXRzLmNvci5kaXN0ID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiKSB7XG4gIHZhciBYID0gYiA/IHZhbHVlcy5tYXAodXRpbC4kKGEpKSA6IHZhbHVlcyxcbiAgICAgIFkgPSBiID8gdmFsdWVzLm1hcCh1dGlsLiQoYikpIDogYTtcblxuICB2YXIgQSA9IHN0YXRzLmRpc3QubWF0KFgpLFxuICAgICAgQiA9IHN0YXRzLmRpc3QubWF0KFkpLFxuICAgICAgbiA9IEEubGVuZ3RoLFxuICAgICAgaSwgYWEsIGJiLCBhYjtcblxuICBmb3IgKGk9MCwgYWE9MCwgYmI9MCwgYWI9MDsgaTxuOyArK2kpIHtcbiAgICBhYSArPSBBW2ldKkFbaV07XG4gICAgYmIgKz0gQltpXSpCW2ldO1xuICAgIGFiICs9IEFbaV0qQltpXTtcbiAgfVxuXG4gIHJldHVybiBNYXRoLnNxcnQoYWIgLyBNYXRoLnNxcnQoYWEqYmIpKTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIHZlY3RvciBkaXN0YW5jZSBiZXR3ZWVuIHR3byBhcnJheXMgb2YgbnVtYmVycy5cbi8vIERlZmF1bHQgaXMgRXVjbGlkZWFuIChleHA9MikgZGlzdGFuY2UsIGNvbmZpZ3VyYWJsZSB2aWEgZXhwIGFyZ3VtZW50Llxuc3RhdHMuZGlzdCA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYiwgZXhwKSB7XG4gIHZhciBmID0gdXRpbC5pc0Z1bmN0aW9uKGIpIHx8IHV0aWwuaXNTdHJpbmcoYiksXG4gICAgICBYID0gdmFsdWVzLFxuICAgICAgWSA9IGYgPyB2YWx1ZXMgOiBhLFxuICAgICAgZSA9IGYgPyBleHAgOiBiLFxuICAgICAgTDIgPSBlID09PSAyIHx8IGUgPT0gbnVsbCxcbiAgICAgIG4gPSB2YWx1ZXMubGVuZ3RoLCBzID0gMCwgZCwgaTtcbiAgaWYgKGYpIHtcbiAgICBhID0gdXRpbC4kKGEpO1xuICAgIGIgPSB1dGlsLiQoYik7XG4gIH1cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgZCA9IGYgPyAoYShYW2ldKS1iKFlbaV0pKSA6IChYW2ldLVlbaV0pO1xuICAgIHMgKz0gTDIgPyBkKmQgOiBNYXRoLnBvdyhNYXRoLmFicyhkKSwgZSk7XG4gIH1cbiAgcmV0dXJuIEwyID8gTWF0aC5zcXJ0KHMpIDogTWF0aC5wb3cocywgMS9lKTtcbn07XG5cbi8vIENvbnN0cnVjdCBhIG1lYW4tY2VudGVyZWQgZGlzdGFuY2UgbWF0cml4IGZvciBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMuZGlzdC5tYXQgPSBmdW5jdGlvbihYKSB7XG4gIHZhciBuID0gWC5sZW5ndGgsXG4gICAgICBtID0gbipuLFxuICAgICAgQSA9IEFycmF5KG0pLFxuICAgICAgUiA9IGdlbi56ZXJvcyhuKSxcbiAgICAgIE0gPSAwLCB2LCBpLCBqO1xuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIEFbaSpuK2ldID0gMDtcbiAgICBmb3IgKGo9aSsxOyBqPG47ICsraikge1xuICAgICAgQVtpKm4ral0gPSAodiA9IE1hdGguYWJzKFhbaV0gLSBYW2pdKSk7XG4gICAgICBBW2oqbitpXSA9IHY7XG4gICAgICBSW2ldICs9IHY7XG4gICAgICBSW2pdICs9IHY7XG4gICAgfVxuICB9XG5cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgTSArPSBSW2ldO1xuICAgIFJbaV0gLz0gbjtcbiAgfVxuICBNIC89IG07XG5cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgZm9yIChqPWk7IGo8bjsgKytqKSB7XG4gICAgICBBW2kqbitqXSArPSBNIC0gUltpXSAtIFJbal07XG4gICAgICBBW2oqbitpXSA9IEFbaSpuK2pdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBBO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgU2hhbm5vbiBlbnRyb3B5IChsb2cgYmFzZSAyKSBvZiBhbiBhcnJheSBvZiBjb3VudHMuXG5zdGF0cy5lbnRyb3B5ID0gZnVuY3Rpb24oY291bnRzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciBpLCBwLCBzID0gMCwgSCA9IDAsIG4gPSBjb3VudHMubGVuZ3RoO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBzICs9IChmID8gZihjb3VudHNbaV0pIDogY291bnRzW2ldKTtcbiAgfVxuICBpZiAocyA9PT0gMCkgcmV0dXJuIDA7XG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHAgPSAoZiA/IGYoY291bnRzW2ldKSA6IGNvdW50c1tpXSkgLyBzO1xuICAgIGlmIChwKSBIICs9IHAgKiBNYXRoLmxvZyhwKTtcbiAgfVxuICByZXR1cm4gLUggLyBNYXRoLkxOMjtcbn07XG5cbi8vIENvbXB1dGUgdGhlIG11dHVhbCBpbmZvcm1hdGlvbiBiZXR3ZWVuIHR3byBkaXNjcmV0ZSB2YXJpYWJsZXMuXG4vLyBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBmb3JtIFtNSSwgTUlfZGlzdGFuY2VdIFxuLy8gTUlfZGlzdGFuY2UgaXMgZGVmaW5lZCBhcyAxIC0gSShhLGIpIC8gSChhLGIpLlxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NdXR1YWxfaW5mb3JtYXRpb25cbnN0YXRzLm11dHVhbCA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYiwgY291bnRzKSB7XG4gIHZhciB4ID0gY291bnRzID8gdmFsdWVzLm1hcCh1dGlsLiQoYSkpIDogdmFsdWVzLFxuICAgICAgeSA9IGNvdW50cyA/IHZhbHVlcy5tYXAodXRpbC4kKGIpKSA6IGEsXG4gICAgICB6ID0gY291bnRzID8gdmFsdWVzLm1hcCh1dGlsLiQoY291bnRzKSkgOiBiO1xuXG4gIHZhciBweCA9IHt9LFxuICAgICAgcHkgPSB7fSxcbiAgICAgIG4gPSB6Lmxlbmd0aCxcbiAgICAgIHMgPSAwLCBJID0gMCwgSCA9IDAsIHAsIHQsIGk7XG5cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgcHhbeFtpXV0gPSAwO1xuICAgIHB5W3lbaV1dID0gMDtcbiAgfVxuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHB4W3hbaV1dICs9IHpbaV07XG4gICAgcHlbeVtpXV0gKz0geltpXTtcbiAgICBzICs9IHpbaV07XG4gIH1cblxuICB0ID0gMSAvIChzICogTWF0aC5MTjIpO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBpZiAoeltpXSA9PT0gMCkgY29udGludWU7XG4gICAgcCA9IChzICogeltpXSkgLyAocHhbeFtpXV0gKiBweVt5W2ldXSk7XG4gICAgSSArPSB6W2ldICogdCAqIE1hdGgubG9nKHApO1xuICAgIEggKz0geltpXSAqIHQgKiBNYXRoLmxvZyh6W2ldL3MpO1xuICB9XG5cbiAgcmV0dXJuIFtJLCAxICsgSS9IXTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIG11dHVhbCBpbmZvcm1hdGlvbiBiZXR3ZWVuIHR3byBkaXNjcmV0ZSB2YXJpYWJsZXMuXG5zdGF0cy5tdXR1YWwuaW5mbyA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYiwgY291bnRzKSB7XG4gIHJldHVybiBzdGF0cy5tdXR1YWwodmFsdWVzLCBhLCBiLCBjb3VudHMpWzBdO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgbXV0dWFsIGluZm9ybWF0aW9uIGRpc3RhbmNlIGJldHdlZW4gdHdvIGRpc2NyZXRlIHZhcmlhYmxlcy5cbi8vIE1JX2Rpc3RhbmNlIGlzIGRlZmluZWQgYXMgMSAtIEkoYSxiKSAvIEgoYSxiKS5cbnN0YXRzLm11dHVhbC5kaXN0ID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiLCBjb3VudHMpIHtcbiAgcmV0dXJuIHN0YXRzLm11dHVhbCh2YWx1ZXMsIGEsIGIsIGNvdW50cylbMV07XG59O1xuXG4vLyBDb21wdXRlIGEgcHJvZmlsZSBvZiBzdW1tYXJ5IHN0YXRpc3RpY3MgZm9yIGEgdmFyaWFibGUuXG5zdGF0cy5wcm9maWxlID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIHZhciBtZWFuID0gMCxcbiAgICAgIHZhbGlkID0gMCxcbiAgICAgIG1pc3NpbmcgPSAwLFxuICAgICAgZGlzdGluY3QgPSAwLFxuICAgICAgbWluID0gbnVsbCxcbiAgICAgIG1heCA9IG51bGwsXG4gICAgICBNMiA9IDAsXG4gICAgICB2YWxzID0gW10sXG4gICAgICB1ID0ge30sIGRlbHRhLCBzZCwgaSwgdiwgeDtcblxuICAvLyBjb21wdXRlIHN1bW1hcnkgc3RhdHNcbiAgZm9yIChpPTA7IGk8dmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG5cbiAgICAvLyB1cGRhdGUgdW5pcXVlIHZhbHVlc1xuICAgIHVbdl0gPSAodiBpbiB1KSA/IHVbdl0gKyAxIDogKGRpc3RpbmN0ICs9IDEsIDEpO1xuXG4gICAgaWYgKHYgPT0gbnVsbCkge1xuICAgICAgKyttaXNzaW5nO1xuICAgIH0gZWxzZSBpZiAodXRpbC5pc1ZhbGlkKHYpKSB7XG4gICAgICAvLyB1cGRhdGUgc3RhdHNcbiAgICAgIHggPSAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSA/IHYubGVuZ3RoIDogdjtcbiAgICAgIGlmIChtaW49PT1udWxsIHx8IHggPCBtaW4pIG1pbiA9IHg7XG4gICAgICBpZiAobWF4PT09bnVsbCB8fCB4ID4gbWF4KSBtYXggPSB4O1xuICAgICAgZGVsdGEgPSB4IC0gbWVhbjtcbiAgICAgIG1lYW4gPSBtZWFuICsgZGVsdGEgLyAoKyt2YWxpZCk7XG4gICAgICBNMiA9IE0yICsgZGVsdGEgKiAoeCAtIG1lYW4pO1xuICAgICAgdmFscy5wdXNoKHgpO1xuICAgIH1cbiAgfVxuICBNMiA9IE0yIC8gKHZhbGlkIC0gMSk7XG4gIHNkID0gTWF0aC5zcXJ0KE0yKTtcblxuICAvLyBzb3J0IHZhbHVlcyBmb3IgbWVkaWFuIGFuZCBpcXJcbiAgdmFscy5zb3J0KHV0aWwuY21wKTtcblxuICByZXR1cm4ge1xuICAgIHR5cGU6ICAgICB0eXBlKHZhbHVlcywgZiksXG4gICAgdW5pcXVlOiAgIHUsXG4gICAgY291bnQ6ICAgIHZhbHVlcy5sZW5ndGgsXG4gICAgdmFsaWQ6ICAgIHZhbGlkLFxuICAgIG1pc3Npbmc6ICBtaXNzaW5nLFxuICAgIGRpc3RpbmN0OiBkaXN0aW5jdCxcbiAgICBtaW46ICAgICAgbWluLFxuICAgIG1heDogICAgICBtYXgsXG4gICAgbWVhbjogICAgIG1lYW4sXG4gICAgc3RkZXY6ICAgIHNkLFxuICAgIG1lZGlhbjogICAodiA9IHN0YXRzLnF1YW50aWxlKHZhbHMsIDAuNSkpLFxuICAgIHExOiAgICAgICBzdGF0cy5xdWFudGlsZSh2YWxzLCAwLjI1KSxcbiAgICBxMzogICAgICAgc3RhdHMucXVhbnRpbGUodmFscywgMC43NSksXG4gICAgbW9kZXNrZXc6IHNkID09PSAwID8gMCA6IChtZWFuIC0gdikgLyBzZFxuICB9O1xufTtcblxuLy8gQ29tcHV0ZSBwcm9maWxlcyBmb3IgYWxsIHZhcmlhYmxlcyBpbiBhIGRhdGEgc2V0Llxuc3RhdHMuc3VtbWFyeSA9IGZ1bmN0aW9uKGRhdGEsIGZpZWxkcykge1xuICBmaWVsZHMgPSBmaWVsZHMgfHwgdXRpbC5rZXlzKGRhdGFbMF0pO1xuICB2YXIgcyA9IGZpZWxkcy5tYXAoZnVuY3Rpb24oZikge1xuICAgIHZhciBwID0gc3RhdHMucHJvZmlsZShkYXRhLCB1dGlsLiQoZikpO1xuICAgIHJldHVybiAocC5maWVsZCA9IGYsIHApO1xuICB9KTtcbiAgcmV0dXJuIChzLl9fc3VtbWFyeV9fID0gdHJ1ZSwgcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXRzOyIsInZhciBkM190aW1lID0gcmVxdWlyZSgnZDMtdGltZScpO1xuXG52YXIgdGVtcERhdGUgPSBuZXcgRGF0ZSgpLFxuICAgIGJhc2VEYXRlID0gbmV3IERhdGUoMCwgMCwgMSkuc2V0RnVsbFllYXIoMCksIC8vIEphbiAxLCAwIEFEXG4gICAgdXRjQmFzZURhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQygwLCAwLCAxKSkuc2V0VVRDRnVsbFllYXIoMCk7XG5cbmZ1bmN0aW9uIGRhdGUoZCkge1xuICByZXR1cm4gKHRlbXBEYXRlLnNldFRpbWUoK2QpLCB0ZW1wRGF0ZSk7XG59XG5cbi8vIGNyZWF0ZSBhIHRpbWUgdW5pdCBlbnRyeVxuZnVuY3Rpb24gZW50cnkodHlwZSwgZGF0ZSwgdW5pdCwgc3RlcCwgbWluLCBtYXgpIHtcbiAgdmFyIGUgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRlOiBkYXRlLFxuICAgIHVuaXQ6IHVuaXRcbiAgfTtcbiAgaWYgKHN0ZXApIHtcbiAgICBlLnN0ZXAgPSBzdGVwO1xuICB9IGVsc2Uge1xuICAgIGUubWluc3RlcCA9IDE7XG4gIH1cbiAgaWYgKG1pbiAhPSBudWxsKSBlLm1pbiA9IG1pbjtcbiAgaWYgKG1heCAhPSBudWxsKSBlLm1heCA9IG1heDtcbiAgcmV0dXJuIGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZSh0eXBlLCB1bml0LCBiYXNlLCBzdGVwLCBtaW4sIG1heCkge1xuICByZXR1cm4gZW50cnkodHlwZSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiB1bml0Lm9mZnNldChiYXNlLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiB1bml0LmNvdW50KGJhc2UsIGQpOyB9LFxuICAgIHN0ZXAsIG1pbiwgbWF4KTtcbn1cblxudmFyIGxvY2FsZSA9IFtcbiAgY3JlYXRlKCdzZWNvbmQnLCBkM190aW1lLnNlY29uZCwgYmFzZURhdGUpLFxuICBjcmVhdGUoJ21pbnV0ZScsIGQzX3RpbWUubWludXRlLCBiYXNlRGF0ZSksXG4gIGNyZWF0ZSgnaG91cicsICAgZDNfdGltZS5ob3VyLCAgIGJhc2VEYXRlKSxcbiAgY3JlYXRlKCdkYXknLCAgICBkM190aW1lLmRheSwgICAgYmFzZURhdGUsIFsxLCA3XSksXG4gIGNyZWF0ZSgnbW9udGgnLCAgZDNfdGltZS5tb250aCwgIGJhc2VEYXRlLCBbMSwgMywgNl0pLFxuICBjcmVhdGUoJ3llYXInLCAgIGQzX3RpbWUueWVhciwgICBiYXNlRGF0ZSksXG5cbiAgLy8gcGVyaW9kaWMgdW5pdHNcbiAgZW50cnkoJ3NlY29uZHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIDEsIDAsIDAsIGQpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0U2Vjb25kcygpOyB9LFxuICAgIG51bGwsIDAsIDU5XG4gICksXG4gIGVudHJ5KCdtaW51dGVzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCAxLCAwLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldE1pbnV0ZXMoKTsgfSxcbiAgICBudWxsLCAwLCA1OVxuICApLFxuICBlbnRyeSgnaG91cnMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIDEsIGQpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0SG91cnMoKTsgfSxcbiAgICBudWxsLCAwLCAyM1xuICApLFxuICBlbnRyeSgnd2Vla2RheXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIDQrZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXREYXkoKTsgfSxcbiAgICBbMV0sIDAsIDZcbiAgKSxcbiAgZW50cnkoJ2RhdGVzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldERhdGUoKTsgfSxcbiAgICBbMV0sIDEsIDMxXG4gICksXG4gIGVudHJ5KCdtb250aHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIGQgJSAxMiwgMSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRNb250aCgpOyB9LFxuICAgIFsxXSwgMCwgMTFcbiAgKVxuXTtcblxudmFyIHV0YyA9IFtcbiAgY3JlYXRlKCdzZWNvbmQnLCBkM190aW1lLnV0Y1NlY29uZCwgdXRjQmFzZURhdGUpLFxuICBjcmVhdGUoJ21pbnV0ZScsIGQzX3RpbWUudXRjTWludXRlLCB1dGNCYXNlRGF0ZSksXG4gIGNyZWF0ZSgnaG91cicsICAgZDNfdGltZS51dGNIb3VyLCAgIHV0Y0Jhc2VEYXRlKSxcbiAgY3JlYXRlKCdkYXknLCAgICBkM190aW1lLnV0Y0RheSwgICAgdXRjQmFzZURhdGUsIFsxLCA3XSksXG4gIGNyZWF0ZSgnbW9udGgnLCAgZDNfdGltZS51dGNNb250aCwgIHV0Y0Jhc2VEYXRlLCBbMSwgMywgNl0pLFxuICBjcmVhdGUoJ3llYXInLCAgIGQzX3RpbWUudXRjWWVhciwgICB1dGNCYXNlRGF0ZSksXG5cbiAgLy8gcGVyaW9kaWMgdW5pdHNcbiAgZW50cnkoJ3NlY29uZHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDEsIDAsIDAsIGQpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ1NlY29uZHMoKTsgfSxcbiAgICBudWxsLCAwLCA1OVxuICApLFxuICBlbnRyeSgnbWludXRlcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgMSwgMCwgZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDTWludXRlcygpOyB9LFxuICAgIG51bGwsIDAsIDU5XG4gICksXG4gIGVudHJ5KCdob3VycycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgMSwgZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDSG91cnMoKTsgfSxcbiAgICBudWxsLCAwLCAyM1xuICApLFxuICBlbnRyeSgnd2Vla2RheXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDQrZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDRGF5KCk7IH0sXG4gICAgWzFdLCAwLCA2XG4gICksXG4gIGVudHJ5KCdkYXRlcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDRGF0ZSgpOyB9LFxuICAgIFsxXSwgMSwgMzFcbiAgKSxcbiAgZW50cnkoJ21vbnRocycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgZCAlIDEyLCAxKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENNb250aCgpOyB9LFxuICAgIFsxXSwgMCwgMTFcbiAgKVxuXTtcblxudmFyIFNURVBTID0gW1xuICBbMzE1MzZlNiwgNV0sICAvLyAxLXllYXJcbiAgWzc3NzZlNiwgNF0sICAgLy8gMy1tb250aFxuICBbMjU5MmU2LCA0XSwgICAvLyAxLW1vbnRoXG4gIFsxMjA5NmU1LCAzXSwgIC8vIDItd2Vla1xuICBbNjA0OGU1LCAzXSwgICAvLyAxLXdlZWtcbiAgWzE3MjhlNSwgM10sICAgLy8gMi1kYXlcbiAgWzg2NGU1LCAzXSwgICAgLy8gMS1kYXlcbiAgWzQzMmU1LCAyXSwgICAgLy8gMTItaG91clxuICBbMjE2ZTUsIDJdLCAgICAvLyA2LWhvdXJcbiAgWzEwOGU1LCAyXSwgICAgLy8gMy1ob3VyXG4gIFszNmU1LCAyXSwgICAgIC8vIDEtaG91clxuICBbMThlNSwgMV0sICAgICAvLyAzMC1taW51dGVcbiAgWzllNSwgMV0sICAgICAgLy8gMTUtbWludXRlXG4gIFszZTUsIDFdLCAgICAgIC8vIDUtbWludXRlXG4gIFs2ZTQsIDFdLCAgICAgIC8vIDEtbWludXRlXG4gIFszZTQsIDBdLCAgICAgIC8vIDMwLXNlY29uZFxuICBbMTVlMywgMF0sICAgICAvLyAxNS1zZWNvbmRcbiAgWzVlMywgMF0sICAgICAgLy8gNS1zZWNvbmRcbiAgWzFlMywgMF0gICAgICAgLy8gMS1zZWNvbmRcbl07XG5cbmZ1bmN0aW9uIGZpbmQodW5pdHMsIHNwYW4sIG1pbmIsIG1heGIpIHtcbiAgdmFyIHN0ZXAgPSBTVEVQU1swXSwgaSwgbiwgYmlucztcblxuICBmb3IgKGk9MSwgbj1TVEVQUy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgc3RlcCA9IFNURVBTW2ldO1xuICAgIGlmIChzcGFuID4gc3RlcFswXSkge1xuICAgICAgYmlucyA9IHNwYW4gLyBzdGVwWzBdO1xuICAgICAgaWYgKGJpbnMgPiBtYXhiKSB7XG4gICAgICAgIHJldHVybiB1bml0c1tTVEVQU1tpLTFdWzFdXTtcbiAgICAgIH1cbiAgICAgIGlmIChiaW5zID49IG1pbmIpIHtcbiAgICAgICAgcmV0dXJuIHVuaXRzW3N0ZXBbMV1dO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdW5pdHNbU1RFUFNbbi0xXVsxXV07XG59XG5cbmZ1bmN0aW9uIHRvVW5pdE1hcCh1bml0cykge1xuICB2YXIgbWFwID0ge30sIGksIG47XG4gIGZvciAoaT0wLCBuPXVuaXRzLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICBtYXBbdW5pdHNbaV0udHlwZV0gPSB1bml0c1tpXTtcbiAgfVxuICBtYXAuZmluZCA9IGZ1bmN0aW9uKHNwYW4sIG1pbmIsIG1heGIpIHtcbiAgICByZXR1cm4gZmluZCh1bml0cywgc3BhbiwgbWluYiwgbWF4Yik7XG4gIH07XG4gIHJldHVybiBtYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9Vbml0TWFwKGxvY2FsZSk7XG5tb2R1bGUuZXhwb3J0cy51dGMgPSB0b1VuaXRNYXAodXRjKTtcbiIsInZhciBidWZmZXIgPSByZXF1aXJlKCdidWZmZXInKSxcbiAgICB0aW1lID0gcmVxdWlyZSgnLi90aW1lJyksXG4gICAgdXRjID0gdGltZS51dGM7XG5cbnZhciB1ID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gdXRpbGl0eSBmdW5jdGlvbnNcblxudmFyIEZOQU1FID0gJ19fbmFtZV9fJztcblxudS5uYW1lZGZ1bmMgPSBmdW5jdGlvbihuYW1lLCBmKSB7IHJldHVybiAoZltGTkFNRV0gPSBuYW1lLCBmKTsgfTtcblxudS5uYW1lID0gZnVuY3Rpb24oZikgeyByZXR1cm4gZj09bnVsbCA/IG51bGwgOiBmW0ZOQU1FXTsgfTtcblxudS5pZGVudGl0eSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHg7IH07XG5cbnUudHJ1ZSA9IHUubmFtZWRmdW5jKCd0cnVlJywgZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlOyB9KTtcblxudS5mYWxzZSA9IHUubmFtZWRmdW5jKCdmYWxzZScsIGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2U7IH0pO1xuXG51LmR1cGxpY2F0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn07XG5cbnUuZXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShhKSA9PT0gSlNPTi5zdHJpbmdpZnkoYik7XG59O1xuXG51LmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICBmb3IgKHZhciB4LCBuYW1lLCBpPTEsIGxlbj1hcmd1bWVudHMubGVuZ3RoOyBpPGxlbjsgKytpKSB7XG4gICAgeCA9IGFyZ3VtZW50c1tpXTtcbiAgICBmb3IgKG5hbWUgaW4geCkgeyBvYmpbbmFtZV0gPSB4W25hbWVdOyB9XG4gIH1cbiAgcmV0dXJuIG9iajtcbn07XG5cbnUubGVuZ3RoID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4geCAhPSBudWxsICYmIHgubGVuZ3RoICE9IG51bGwgPyB4Lmxlbmd0aCA6IG51bGw7XG59O1xuXG51LmtleXMgPSBmdW5jdGlvbih4KSB7XG4gIHZhciBrZXlzID0gW10sIGs7XG4gIGZvciAoayBpbiB4KSBrZXlzLnB1c2goayk7XG4gIHJldHVybiBrZXlzO1xufTtcblxudS52YWxzID0gZnVuY3Rpb24oeCkge1xuICB2YXIgdmFscyA9IFtdLCBrO1xuICBmb3IgKGsgaW4geCkgdmFscy5wdXNoKHhba10pO1xuICByZXR1cm4gdmFscztcbn07XG5cbnUudG9NYXAgPSBmdW5jdGlvbihsaXN0LCBmKSB7XG4gIHJldHVybiAoZiA9IHUuJChmKSkgP1xuICAgIGxpc3QucmVkdWNlKGZ1bmN0aW9uKG9iaiwgeCkgeyByZXR1cm4gKG9ialtmKHgpXSA9IDEsIG9iaik7IH0sIHt9KSA6XG4gICAgbGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCB4KSB7IHJldHVybiAob2JqW3hdID0gMSwgb2JqKTsgfSwge30pO1xufTtcblxudS5rZXlzdHIgPSBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgLy8gdXNlIHRvIGVuc3VyZSBjb25zaXN0ZW50IGtleSBnZW5lcmF0aW9uIGFjcm9zcyBtb2R1bGVzXG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aDtcbiAgaWYgKCFuKSByZXR1cm4gJyc7XG4gIGZvciAodmFyIHM9U3RyaW5nKHZhbHVlc1swXSksIGk9MTsgaTxuOyArK2kpIHtcbiAgICBzICs9ICd8JyArIFN0cmluZyh2YWx1ZXNbaV0pO1xuICB9XG4gIHJldHVybiBzO1xufTtcblxuLy8gdHlwZSBjaGVja2luZyBmdW5jdGlvbnNcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudS5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn07XG5cbnUuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufTtcblxudS5pc1N0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufTtcblxudS5pc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbnUuaXNOdW1iZXIgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdudW1iZXInIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgTnVtYmVyXSc7XG59O1xuXG51LmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEJvb2xlYW5dJztcbn07XG5cbnUuaXNEYXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IERhdGVdJztcbn07XG5cbnUuaXNWYWxpZCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqID09PSBvYmo7XG59O1xuXG51LmlzQnVmZmVyID0gKGJ1ZmZlci5CdWZmZXIgJiYgYnVmZmVyLkJ1ZmZlci5pc0J1ZmZlcikgfHwgdS5mYWxzZTtcblxuLy8gdHlwZSBjb2VyY2lvbiBmdW5jdGlvbnNcblxudS5udW1iZXIgPSBmdW5jdGlvbihzKSB7XG4gIHJldHVybiBzID09IG51bGwgfHwgcyA9PT0gJycgPyBudWxsIDogK3M7XG59O1xuXG51LmJvb2xlYW4gPSBmdW5jdGlvbihzKSB7XG4gIHJldHVybiBzID09IG51bGwgfHwgcyA9PT0gJycgPyBudWxsIDogcz09PSdmYWxzZScgPyBmYWxzZSA6ICEhcztcbn07XG5cbnUuZGF0ZSA9IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMgPT0gbnVsbCB8fCBzID09PSAnJyA/IG51bGwgOiBEYXRlLnBhcnNlKHMpO1xufTtcblxudS5hcnJheSA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHggIT0gbnVsbCA/ICh1LmlzQXJyYXkoeCkgPyB4IDogW3hdKSA6IFtdO1xufTtcblxudS5zdHIgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiB1LmlzQXJyYXkoeCkgPyAnWycgKyB4Lm1hcCh1LnN0cikgKyAnXSdcbiAgICA6IHUuaXNPYmplY3QoeCkgPyBKU09OLnN0cmluZ2lmeSh4KVxuICAgIDogdS5pc1N0cmluZyh4KSA/ICgnXFwnJyt1dGlsX2VzY2FwZV9zdHIoeCkrJ1xcJycpIDogeDtcbn07XG5cbnZhciBlc2NhcGVfc3RyX3JlID0gLyhefFteXFxcXF0pJy9nO1xuXG5mdW5jdGlvbiB1dGlsX2VzY2FwZV9zdHIoeCkge1xuICByZXR1cm4geC5yZXBsYWNlKGVzY2FwZV9zdHJfcmUsICckMVxcXFxcXCcnKTtcbn1cblxuLy8gZGF0YSBhY2Nlc3MgZnVuY3Rpb25zXG5cbnUuZmllbGQgPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiBTdHJpbmcoZikuc3BsaXQoJ1xcXFwuJylcbiAgICAubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuc3BsaXQoJy4nKTsgfSlcbiAgICAucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIGlmIChhLmxlbmd0aCkgeyBhW2EubGVuZ3RoLTFdICs9ICcuJyArIGIuc2hpZnQoKTsgfVxuICAgICAgYS5wdXNoLmFwcGx5KGEsIGIpO1xuICAgICAgcmV0dXJuIGE7XG4gICAgfSwgW10pO1xufTtcblxudS5hY2Nlc3NvciA9IGZ1bmN0aW9uKGYpIHtcbiAgdmFyIHM7XG4gIHJldHVybiBmPT1udWxsIHx8IHUuaXNGdW5jdGlvbihmKSA/IGYgOlxuICAgIHUubmFtZWRmdW5jKGYsIChzID0gdS5maWVsZChmKSkubGVuZ3RoID4gMSA/XG4gICAgICBmdW5jdGlvbih4KSB7IHJldHVybiBzLnJlZHVjZShmdW5jdGlvbih4LGYpIHsgcmV0dXJuIHhbZl07IH0sIHgpOyB9IDpcbiAgICAgIGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHhbZl07IH1cbiAgICApO1xufTtcblxuLy8gc2hvcnQtY3V0IGZvciBhY2Nlc3NvclxudS4kID0gdS5hY2Nlc3NvcjtcblxudS5tdXRhdG9yID0gZnVuY3Rpb24oZikge1xuICB2YXIgcztcbiAgcmV0dXJuIHUuaXNTdHJpbmcoZikgJiYgKHM9dS5maWVsZChmKSkubGVuZ3RoID4gMSA/XG4gICAgZnVuY3Rpb24oeCwgdikge1xuICAgICAgZm9yICh2YXIgaT0wOyBpPHMubGVuZ3RoLTE7ICsraSkgeCA9IHhbc1tpXV07XG4gICAgICB4W3NbaV1dID0gdjtcbiAgICB9IDpcbiAgICBmdW5jdGlvbih4LCB2KSB7IHhbZl0gPSB2OyB9O1xufTtcblxuXG51LiRmdW5jID0gZnVuY3Rpb24obmFtZSwgb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGYpIHtcbiAgICBmID0gdS4kKGYpIHx8IHUuaWRlbnRpdHk7XG4gICAgdmFyIG4gPSBuYW1lICsgKHUubmFtZShmKSA/ICdfJyt1Lm5hbWUoZikgOiAnJyk7XG4gICAgcmV0dXJuIHUubmFtZWRmdW5jKG4sIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG9wKGYoZCkpOyB9KTtcbiAgfTtcbn07XG5cbnUuJHZhbGlkICA9IHUuJGZ1bmMoJ3ZhbGlkJywgdS5pc1ZhbGlkKTtcbnUuJGxlbmd0aCA9IHUuJGZ1bmMoJ2xlbmd0aCcsIHUubGVuZ3RoKTtcblxudS4kaW4gPSBmdW5jdGlvbihmLCB2YWx1ZXMpIHtcbiAgZiA9IHUuJChmKTtcbiAgdmFyIG1hcCA9IHUuaXNBcnJheSh2YWx1ZXMpID8gdS50b01hcCh2YWx1ZXMpIDogdmFsdWVzO1xuICByZXR1cm4gZnVuY3Rpb24oZCkgeyByZXR1cm4gISFtYXBbZihkKV07IH07XG59O1xuXG51LiR5ZWFyICAgPSB1LiRmdW5jKCd5ZWFyJywgdGltZS55ZWFyLnVuaXQpO1xudS4kbW9udGggID0gdS4kZnVuYygnbW9udGgnLCB0aW1lLm1vbnRocy51bml0KTtcbnUuJGRhdGUgICA9IHUuJGZ1bmMoJ2RhdGUnLCB0aW1lLmRhdGVzLnVuaXQpO1xudS4kZGF5ICAgID0gdS4kZnVuYygnZGF5JywgdGltZS53ZWVrZGF5cy51bml0KTtcbnUuJGhvdXIgICA9IHUuJGZ1bmMoJ2hvdXInLCB0aW1lLmhvdXJzLnVuaXQpO1xudS4kbWludXRlID0gdS4kZnVuYygnbWludXRlJywgdGltZS5taW51dGVzLnVuaXQpO1xudS4kc2Vjb25kID0gdS4kZnVuYygnc2Vjb25kJywgdGltZS5zZWNvbmRzLnVuaXQpO1xuXG51LiR1dGNZZWFyICAgPSB1LiRmdW5jKCd1dGNZZWFyJywgdXRjLnllYXIudW5pdCk7XG51LiR1dGNNb250aCAgPSB1LiRmdW5jKCd1dGNNb250aCcsIHV0Yy5tb250aHMudW5pdCk7XG51LiR1dGNEYXRlICAgPSB1LiRmdW5jKCd1dGNEYXRlJywgdXRjLmRhdGVzLnVuaXQpO1xudS4kdXRjRGF5ICAgID0gdS4kZnVuYygndXRjRGF5JywgdXRjLndlZWtkYXlzLnVuaXQpO1xudS4kdXRjSG91ciAgID0gdS4kZnVuYygndXRjSG91cicsIHV0Yy5ob3Vycy51bml0KTtcbnUuJHV0Y01pbnV0ZSA9IHUuJGZ1bmMoJ3V0Y01pbnV0ZScsIHV0Yy5taW51dGVzLnVuaXQpO1xudS4kdXRjU2Vjb25kID0gdS4kZnVuYygndXRjU2Vjb25kJywgdXRjLnNlY29uZHMudW5pdCk7XG5cbi8vIGNvbXBhcmlzb24gLyBzb3J0aW5nIGZ1bmN0aW9uc1xuXG51LmNvbXBhcmF0b3IgPSBmdW5jdGlvbihzb3J0KSB7XG4gIHZhciBzaWduID0gW107XG4gIGlmIChzb3J0ID09PSB1bmRlZmluZWQpIHNvcnQgPSBbXTtcbiAgc29ydCA9IHUuYXJyYXkoc29ydCkubWFwKGZ1bmN0aW9uKGYpIHtcbiAgICB2YXIgcyA9IDE7XG4gICAgaWYgICAgICAoZlswXSA9PT0gJy0nKSB7IHMgPSAtMTsgZiA9IGYuc2xpY2UoMSk7IH1cbiAgICBlbHNlIGlmIChmWzBdID09PSAnKycpIHsgcyA9ICsxOyBmID0gZi5zbGljZSgxKTsgfVxuICAgIHNpZ24ucHVzaChzKTtcbiAgICByZXR1cm4gdS5hY2Nlc3NvcihmKTtcbiAgfSk7XG4gIHJldHVybiBmdW5jdGlvbihhLGIpIHtcbiAgICB2YXIgaSwgbiwgZiwgeCwgeTtcbiAgICBmb3IgKGk9MCwgbj1zb3J0Lmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICAgIGYgPSBzb3J0W2ldOyB4ID0gZihhKTsgeSA9IGYoYik7XG4gICAgICBpZiAoeCA8IHkpIHJldHVybiAtMSAqIHNpZ25baV07XG4gICAgICBpZiAoeCA+IHkpIHJldHVybiBzaWduW2ldO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfTtcbn07XG5cbnUuY21wID0gZnVuY3Rpb24oYSwgYikge1xuICBpZiAoYSA8IGIpIHtcbiAgICByZXR1cm4gLTE7XG4gIH0gZWxzZSBpZiAoYSA+IGIpIHtcbiAgICByZXR1cm4gMTtcbiAgfSBlbHNlIGlmIChhID49IGIpIHtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIGlmIChhID09PSBudWxsKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKGIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gTmFOO1xufTtcblxudS5udW1jbXAgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhIC0gYjsgfTtcblxudS5zdGFibGVzb3J0ID0gZnVuY3Rpb24oYXJyYXksIHNvcnRCeSwga2V5Rm4pIHtcbiAgdmFyIGluZGljZXMgPSBhcnJheS5yZWR1Y2UoZnVuY3Rpb24oaWR4LCB2LCBpKSB7XG4gICAgcmV0dXJuIChpZHhba2V5Rm4odildID0gaSwgaWR4KTtcbiAgfSwge30pO1xuXG4gIGFycmF5LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHZhciBzYSA9IHNvcnRCeShhKSxcbiAgICAgICAgc2IgPSBzb3J0QnkoYik7XG4gICAgcmV0dXJuIHNhIDwgc2IgPyAtMSA6IHNhID4gc2IgPyAxXG4gICAgICAgICA6IChpbmRpY2VzW2tleUZuKGEpXSAtIGluZGljZXNba2V5Rm4oYildKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFycmF5O1xufTtcblxuXG4vLyBzdHJpbmcgZnVuY3Rpb25zXG5cbnUucGFkID0gZnVuY3Rpb24ocywgbGVuZ3RoLCBwb3MsIHBhZGNoYXIpIHtcbiAgcGFkY2hhciA9IHBhZGNoYXIgfHwgXCIgXCI7XG4gIHZhciBkID0gbGVuZ3RoIC0gcy5sZW5ndGg7XG4gIGlmIChkIDw9IDApIHJldHVybiBzO1xuICBzd2l0Y2ggKHBvcykge1xuICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgcmV0dXJuIHN0cnJlcChkLCBwYWRjaGFyKSArIHM7XG4gICAgY2FzZSAnbWlkZGxlJzpcbiAgICBjYXNlICdjZW50ZXInOlxuICAgICAgcmV0dXJuIHN0cnJlcChNYXRoLmZsb29yKGQvMiksIHBhZGNoYXIpICtcbiAgICAgICAgIHMgKyBzdHJyZXAoTWF0aC5jZWlsKGQvMiksIHBhZGNoYXIpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gcyArIHN0cnJlcChkLCBwYWRjaGFyKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gc3RycmVwKG4sIHN0cikge1xuICB2YXIgcyA9IFwiXCIsIGk7XG4gIGZvciAoaT0wOyBpPG47ICsraSkgcyArPSBzdHI7XG4gIHJldHVybiBzO1xufVxuXG51LnRydW5jYXRlID0gZnVuY3Rpb24ocywgbGVuZ3RoLCBwb3MsIHdvcmQsIGVsbGlwc2lzKSB7XG4gIHZhciBsZW4gPSBzLmxlbmd0aDtcbiAgaWYgKGxlbiA8PSBsZW5ndGgpIHJldHVybiBzO1xuICBlbGxpcHNpcyA9IGVsbGlwc2lzICE9PSB1bmRlZmluZWQgPyBTdHJpbmcoZWxsaXBzaXMpIDogJ1xcdTIwMjYnO1xuICB2YXIgbCA9IE1hdGgubWF4KDAsIGxlbmd0aCAtIGVsbGlwc2lzLmxlbmd0aCk7XG5cbiAgc3dpdGNoIChwb3MpIHtcbiAgICBjYXNlICdsZWZ0JzpcbiAgICAgIHJldHVybiBlbGxpcHNpcyArICh3b3JkID8gdHJ1bmNhdGVPbldvcmQocyxsLDEpIDogcy5zbGljZShsZW4tbCkpO1xuICAgIGNhc2UgJ21pZGRsZSc6XG4gICAgY2FzZSAnY2VudGVyJzpcbiAgICAgIHZhciBsMSA9IE1hdGguY2VpbChsLzIpLCBsMiA9IE1hdGguZmxvb3IobC8yKTtcbiAgICAgIHJldHVybiAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbDEpIDogcy5zbGljZSgwLGwxKSkgK1xuICAgICAgICBlbGxpcHNpcyArICh3b3JkID8gdHJ1bmNhdGVPbldvcmQocyxsMiwxKSA6IHMuc2xpY2UobGVuLWwyKSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbCkgOiBzLnNsaWNlKDAsbCkpICsgZWxsaXBzaXM7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHRydW5jYXRlT25Xb3JkKHMsIGxlbiwgcmV2KSB7XG4gIHZhciBjbnQgPSAwLCB0b2sgPSBzLnNwbGl0KHRydW5jYXRlX3dvcmRfcmUpO1xuICBpZiAocmV2KSB7XG4gICAgcyA9ICh0b2sgPSB0b2sucmV2ZXJzZSgpKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbih3KSB7IGNudCArPSB3Lmxlbmd0aDsgcmV0dXJuIGNudCA8PSBsZW47IH0pXG4gICAgICAucmV2ZXJzZSgpO1xuICB9IGVsc2Uge1xuICAgIHMgPSB0b2suZmlsdGVyKGZ1bmN0aW9uKHcpIHsgY250ICs9IHcubGVuZ3RoOyByZXR1cm4gY250IDw9IGxlbjsgfSk7XG4gIH1cbiAgcmV0dXJuIHMubGVuZ3RoID8gcy5qb2luKCcnKS50cmltKCkgOiB0b2tbMF0uc2xpY2UoMCwgbGVuKTtcbn1cblxudmFyIHRydW5jYXRlX3dvcmRfcmUgPSAvKFtcXHUwMDA5XFx1MDAwQVxcdTAwMEJcXHUwMDBDXFx1MDAwRFxcdTAwMjBcXHUwMEEwXFx1MTY4MFxcdTE4MEVcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwQVxcdTIwMkZcXHUyMDVGXFx1MjAyOFxcdTIwMjlcXHUzMDAwXFx1RkVGRl0pLztcbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9nbG9iYWxzJyk7XG5cbnZhciBjb25zdHMgPSByZXF1aXJlKCcuL2NvbnN0cycpLFxuICB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gIHZsZmllbGQgPSByZXF1aXJlKCcuL2ZpZWxkJyksXG4gIHZsZW5jID0gcmVxdWlyZSgnLi9lbmMnKSxcbiAgc2NoZW1hID0gcmVxdWlyZSgnLi9zY2hlbWEvc2NoZW1hJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBFbmNvZGluZyhzcGVjLCB0aGVtZSkge1xuICAgIHZhciBkZWZhdWx0cyA9IHNjaGVtYS5pbnN0YW50aWF0ZSgpLFxuICAgICAgc3BlY0V4dGVuZGVkID0gc2NoZW1hLnV0aWwubWVyZ2UoZGVmYXVsdHMsIHRoZW1lIHx8IHt9LCBzcGVjKSA7XG5cbiAgICB0aGlzLl9kYXRhID0gc3BlY0V4dGVuZGVkLmRhdGE7XG4gICAgdGhpcy5fbWFya3R5cGUgPSBzcGVjRXh0ZW5kZWQubWFya3R5cGU7XG4gICAgdGhpcy5fZW5jID0gc3BlY0V4dGVuZGVkLmVuY29kaW5nO1xuICAgIHRoaXMuX2NvbmZpZyA9IHNwZWNFeHRlbmRlZC5jb25maWc7XG4gICAgdGhpcy5fZmlsdGVyID0gc3BlY0V4dGVuZGVkLmZpbHRlcjtcbiAgICAvLyB0aGlzLl92ZWdhMiA9IHRydWU7XG4gIH1cblxuICB2YXIgcHJvdG8gPSBFbmNvZGluZy5wcm90b3R5cGU7XG5cbiAgRW5jb2RpbmcuZnJvbVNob3J0aGFuZCA9IGZ1bmN0aW9uKHNob3J0aGFuZCwgZGF0YSwgY29uZmlnLCB0aGVtZSkge1xuICAgIHZhciBjID0gY29uc3RzLnNob3J0aGFuZCxcbiAgICAgICAgc3BsaXQgPSBzaG9ydGhhbmQuc3BsaXQoYy5kZWxpbSksXG4gICAgICAgIG1hcmt0eXBlID0gc3BsaXQuc2hpZnQoKS5zcGxpdChjLmFzc2lnbilbMV0udHJpbSgpLFxuICAgICAgICBlbmMgPSB2bGVuYy5mcm9tU2hvcnRoYW5kKHNwbGl0KTtcblxuICAgIHJldHVybiBuZXcgRW5jb2Rpbmcoe1xuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIG1hcmt0eXBlOiBtYXJrdHlwZSxcbiAgICAgIGVuY29kaW5nOiBlbmMsXG4gICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgIGZpbHRlcjogW11cbiAgICB9LCB0aGVtZSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuZnJvbVNwZWMgPSBmdW5jdGlvbihzcGVjLCB0aGVtZSkge1xuICAgIHJldHVybiBuZXcgRW5jb2Rpbmcoc3BlYywgdGhlbWUpO1xuICB9O1xuXG4gIHByb3RvLnRvU2hvcnRoYW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGMgPSBjb25zdHMuc2hvcnRoYW5kO1xuICAgIHJldHVybiAnbWFyaycgKyBjLmFzc2lnbiArIHRoaXMuX21hcmt0eXBlICtcbiAgICAgIGMuZGVsaW0gKyB2bGVuYy5zaG9ydGhhbmQodGhpcy5fZW5jKTtcbiAgfTtcblxuICBFbmNvZGluZy5zaG9ydGhhbmQgPSBmdW5jdGlvbiAoc3BlYykge1xuICAgIHZhciBjID0gY29uc3RzLnNob3J0aGFuZDtcbiAgICByZXR1cm4gJ21hcmsnICsgYy5hc3NpZ24gKyBzcGVjLm1hcmt0eXBlICtcbiAgICAgIGMuZGVsaW0gKyB2bGVuYy5zaG9ydGhhbmQoc3BlYy5lbmNvZGluZyk7XG4gIH07XG5cbiAgRW5jb2Rpbmcuc3BlY0Zyb21TaG9ydGhhbmQgPSBmdW5jdGlvbihzaG9ydGhhbmQsIGRhdGEsIGNvbmZpZywgZXhjbHVkZUNvbmZpZykge1xuICAgIHJldHVybiBFbmNvZGluZy5mcm9tU2hvcnRoYW5kKHNob3J0aGFuZCwgZGF0YSwgY29uZmlnKS50b1NwZWMoZXhjbHVkZUNvbmZpZyk7XG4gIH07XG5cbiAgcHJvdG8udG9TcGVjID0gZnVuY3Rpb24oZXhjbHVkZUNvbmZpZywgZXhjbHVkZURhdGEpIHtcbiAgICB2YXIgZW5jID0gdXRpbC5kdXBsaWNhdGUodGhpcy5fZW5jKSxcbiAgICAgIHNwZWM7XG5cbiAgICBzcGVjID0ge1xuICAgICAgbWFya3R5cGU6IHRoaXMuX21hcmt0eXBlLFxuICAgICAgZW5jb2Rpbmc6IGVuYyxcbiAgICAgIGZpbHRlcjogdGhpcy5fZmlsdGVyXG4gICAgfTtcblxuICAgIGlmICghZXhjbHVkZUNvbmZpZykge1xuICAgICAgc3BlYy5jb25maWcgPSB1dGlsLmR1cGxpY2F0ZSh0aGlzLl9jb25maWcpO1xuICAgIH1cblxuICAgIGlmICghZXhjbHVkZURhdGEpIHtcbiAgICAgIHNwZWMuZGF0YSA9IHV0aWwuZHVwbGljYXRlKHRoaXMuX2RhdGEpO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBkZWZhdWx0c1xuICAgIHZhciBkZWZhdWx0cyA9IHNjaGVtYS5pbnN0YW50aWF0ZSgpO1xuICAgIHJldHVybiBzY2hlbWEudXRpbC5zdWJ0cmFjdChzcGVjLCBkZWZhdWx0cyk7XG4gIH07XG5cblxuICBwcm90by5tYXJrdHlwZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXJrdHlwZTtcbiAgfTtcblxuICBwcm90by5pcyA9IGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gdGhpcy5fbWFya3R5cGUgPT09IG07XG4gIH07XG5cbiAgcHJvdG8uaGFzID0gZnVuY3Rpb24oZW5jVHlwZSkge1xuICAgIC8vIGVxdWl2YWxlbnQgdG8gY2FsbGluZyB2bGVuYy5oYXModGhpcy5fZW5jLCBlbmNUeXBlKVxuICAgIHJldHVybiB0aGlzLl9lbmNbZW5jVHlwZV0ubmFtZSAhPT0gdW5kZWZpbmVkO1xuICB9O1xuXG4gIHByb3RvLmZpZWxkID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XTtcbiAgfTtcblxuICBwcm90by5maWx0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZmlsdGVyTnVsbCA9IFtdLFxuICAgICAgZmllbGRzID0gdGhpcy5maWVsZHMoKSxcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgdXRpbC5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZmllbGRMaXN0LCBmaWVsZE5hbWUpIHtcbiAgICAgIGlmIChmaWVsZE5hbWUgPT09ICcqJykgcmV0dXJuOyAvL2NvdW50XG5cbiAgICAgIGlmICgoc2VsZi5jb25maWcoJ2ZpbHRlck51bGwnKS5RICYmIGZpZWxkTGlzdC5jb250YWluc1R5cGVbUV0pIHx8XG4gICAgICAgICAgKHNlbGYuY29uZmlnKCdmaWx0ZXJOdWxsJykuVCAmJiBmaWVsZExpc3QuY29udGFpbnNUeXBlW1RdKSB8fFxuICAgICAgICAgIChzZWxmLmNvbmZpZygnZmlsdGVyTnVsbCcpLk8gJiYgZmllbGRMaXN0LmNvbnRhaW5zVHlwZVtPXSkgfHxcbiAgICAgICAgICAoc2VsZi5jb25maWcoJ2ZpbHRlck51bGwnKS5OICYmIGZpZWxkTGlzdC5jb250YWluc1R5cGVbTl0pKSB7XG4gICAgICAgIGZpbHRlck51bGwucHVzaCh7XG4gICAgICAgICAgb3BlcmFuZHM6IFtmaWVsZE5hbWVdLFxuICAgICAgICAgIG9wZXJhdG9yOiAnbm90TnVsbCdcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmlsdGVyTnVsbC5jb25jYXQodGhpcy5fZmlsdGVyKTtcbiAgfTtcblxuICAvLyBnZXQgXCJmaWVsZFwiIHJlZmVyZW5jZSBmb3IgdmVnYVxuICBwcm90by5maWVsZFJlZiA9IGZ1bmN0aW9uKGV0LCBvcHQpIHtcbiAgICBvcHQgPSBvcHQgfHwge307XG4gICAgb3B0LmRhdGEgPSAhdGhpcy5fdmVnYTIgJiYgKG9wdC5kYXRhICE9PSBmYWxzZSk7XG4gICAgcmV0dXJuIHZsZmllbGQuZmllbGRSZWYodGhpcy5fZW5jW2V0XSwgb3B0KTtcbiAgfTtcblxuICBwcm90by5maWVsZE5hbWUgPSBmdW5jdGlvbihldCkge1xuICAgIHJldHVybiB0aGlzLl9lbmNbZXRdLm5hbWU7XG4gIH07XG5cbiAgLypcbiAgICogcmV0dXJuIGtleS12YWx1ZSBwYWlycyBvZiBmaWVsZCBuYW1lIGFuZCBsaXN0IG9mIGZpZWxkcyBvZiB0aGF0IGZpZWxkIG5hbWVcbiAgICovXG4gIHByb3RvLmZpZWxkcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2bGVuYy5maWVsZHModGhpcy5fZW5jKTtcbiAgfTtcblxuICBwcm90by5maWVsZFRpdGxlID0gZnVuY3Rpb24oZXQpIHtcbiAgICBpZiAodmxmaWVsZC5pc0NvdW50KHRoaXMuX2VuY1tldF0pKSB7XG4gICAgICByZXR1cm4gdmxmaWVsZC5jb3VudC5kaXNwbGF5TmFtZTtcbiAgICB9XG4gICAgdmFyIGZuID0gdGhpcy5fZW5jW2V0XS5hZ2dyZWdhdGUgfHwgdGhpcy5fZW5jW2V0XS50aW1lVW5pdCB8fCAodGhpcy5fZW5jW2V0XS5iaW4gJiYgJ2JpbicpO1xuICAgIGlmIChmbikge1xuICAgICAgcmV0dXJuIGZuLnRvVXBwZXJDYXNlKCkgKyAnKCcgKyB0aGlzLl9lbmNbZXRdLm5hbWUgKyAnKSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9lbmNbZXRdLm5hbWU7XG4gICAgfVxuICB9O1xuXG4gIHByb3RvLnNjYWxlID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5zY2FsZSB8fCB7fTtcbiAgfTtcblxuICBwcm90by5heGlzID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5heGlzIHx8IHt9O1xuICB9O1xuXG4gIHByb3RvLmJhbmRTaXplID0gZnVuY3Rpb24oZW5jVHlwZSwgdXNlU21hbGxCYW5kKSB7XG4gICAgdXNlU21hbGxCYW5kID0gdXNlU21hbGxCYW5kIHx8XG4gICAgICAvL2lzQmFuZEluU21hbGxNdWx0aXBsZXNcbiAgICAgIChlbmNUeXBlID09PSBZICYmIHRoaXMuaGFzKFJPVykgJiYgdGhpcy5oYXMoWSkpIHx8XG4gICAgICAoZW5jVHlwZSA9PT0gWCAmJiB0aGlzLmhhcyhDT0wpICYmIHRoaXMuaGFzKFgpKTtcblxuICAgIC8vIGlmIGJhbmQuc2l6ZSBpcyBleHBsaWNpdGx5IHNwZWNpZmllZCwgZm9sbG93IHRoZSBzcGVjaWZpY2F0aW9uLCBvdGhlcndpc2UgZHJhdyB2YWx1ZSBmcm9tIGNvbmZpZy5cbiAgICByZXR1cm4gdGhpcy5maWVsZChlbmNUeXBlKS5iYW5kLnNpemUgfHxcbiAgICAgIHRoaXMuY29uZmlnKHVzZVNtYWxsQmFuZCA/ICdzbWFsbEJhbmRTaXplJyA6ICdsYXJnZUJhbmRTaXplJyk7XG4gIH07XG5cbiAgcHJvdG8uYWdncmVnYXRlID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5hZ2dyZWdhdGU7XG4gIH07XG5cbiAgLy8gcmV0dXJucyBmYWxzZSBpZiBiaW5uaW5nIGlzIGRpc2FibGVkLCBvdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYmlubmluZyBwcm9wZXJ0aWVzXG4gIHByb3RvLmJpbiA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgdmFyIGJpbiA9IHRoaXMuX2VuY1tldF0uYmluO1xuICAgIGlmIChiaW4gPT09IHt9KVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChiaW4gPT09IHRydWUpXG4gICAgICByZXR1cm4ge1xuICAgICAgICBtYXhiaW5zOiBzY2hlbWEuTUFYQklOU19ERUZBVUxUXG4gICAgICB9O1xuICAgIHJldHVybiBiaW47XG4gIH07XG5cbiAgcHJvdG8udmFsdWUgPSBmdW5jdGlvbihldCkge1xuICAgIHJldHVybiB0aGlzLl9lbmNbZXRdLnZhbHVlO1xuICB9O1xuXG4gIHByb3RvLm51bWJlckZvcm1hdCA9IGZ1bmN0aW9uKGZpZWxkU3RhdHMpIHtcbiAgICB2YXIgZm9ybWF0Q29uZmlnID0gZmllbGRTdGF0cy5tYXggPiB0aGlzLmNvbmZpZygnbWF4U21hbGxOdW1iZXInKSA/XG4gICAgICAnbGFyZ2VOdW1iZXJGb3JtYXQnOiAnc21hbGxOdW1iZXJGb3JtYXQnO1xuICAgIHJldHVybiB0aGlzLmNvbmZpZyhmb3JtYXRDb25maWcpO1xuICB9O1xuXG4gIHByb3RvLnNvcnQgPSBmdW5jdGlvbihldCwgc3RhdHMpIHtcbiAgICB2YXIgc29ydCA9IHRoaXMuX2VuY1tldF0uc29ydCxcbiAgICAgIGVuYyA9IHRoaXMuX2VuYyxcbiAgICAgIGlzVHlwZXMgPSB2bGZpZWxkLmlzVHlwZXM7XG5cbiAgICBpZiAoKCFzb3J0IHx8IHNvcnQubGVuZ3RoPT09MCkgJiZcbiAgICAgICAgLy8gRklYTUVcbiAgICAgICAgRW5jb2RpbmcudG9nZ2xlU29ydC5zdXBwb3J0KHtlbmNvZGluZzp0aGlzLl9lbmN9LCBzdGF0cywgdHJ1ZSkgJiYgLy9IQUNLXG4gICAgICAgIHRoaXMuY29uZmlnKCd0b2dnbGVTb3J0JykgPT09IFFcbiAgICAgICkge1xuICAgICAgdmFyIHFGaWVsZCA9IGlzVHlwZXMoZW5jLngsIFtOLCBPXSkgPyBlbmMueSA6IGVuYy54O1xuXG4gICAgICBpZiAoaXNUeXBlcyhlbmNbZXRdLCBbTiwgT10pKSB7XG4gICAgICAgIHNvcnQgPSBbe1xuICAgICAgICAgIG5hbWU6IHFGaWVsZC5uYW1lLFxuICAgICAgICAgIGFnZ3JlZ2F0ZTogcUZpZWxkLmFnZ3JlZ2F0ZSxcbiAgICAgICAgICB0eXBlOiBxRmllbGQudHlwZSxcbiAgICAgICAgICByZXZlcnNlOiB0cnVlXG4gICAgICAgIH1dO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzb3J0O1xuICB9O1xuXG4gIHByb3RvLm1hcCA9IGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gdmxlbmMubWFwKHRoaXMuX2VuYywgZik7XG4gIH07XG5cbiAgcHJvdG8ucmVkdWNlID0gZnVuY3Rpb24oZiwgaW5pdCkge1xuICAgIHJldHVybiB2bGVuYy5yZWR1Y2UodGhpcy5fZW5jLCBmLCBpbml0KTtcbiAgfTtcblxuICBwcm90by5mb3JFYWNoID0gZnVuY3Rpb24oZikge1xuICAgIHJldHVybiB2bGVuYy5mb3JFYWNoKHRoaXMuX2VuYywgZik7XG4gIH07XG5cbiAgcHJvdG8udHlwZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGV0KSA/IHRoaXMuX2VuY1tldF0udHlwZSA6IG51bGw7XG4gIH07XG5cbiAgcHJvdG8uaXNUeXBlID0gZnVuY3Rpb24oZXQsIHR5cGUpIHtcbiAgICB2YXIgZmllbGQgPSB0aGlzLmZpZWxkKGV0KTtcbiAgICByZXR1cm4gZmllbGQgJiYgdmxmaWVsZC5pc1R5cGUoZmllbGQsIHR5cGUpO1xuICB9O1xuXG4gIHByb3RvLmlzVHlwZXMgPSBmdW5jdGlvbihldCwgdHlwZSkge1xuICAgIHZhciBmaWVsZCA9IHRoaXMuZmllbGQoZXQpO1xuICAgIHJldHVybiBmaWVsZCAmJiB2bGZpZWxkLmlzVHlwZXMoZmllbGQsIHR5cGUpO1xuICB9O1xuXG4gIEVuY29kaW5nLmlzT3JkaW5hbFNjYWxlID0gZnVuY3Rpb24oZW5jb2RpbmcsIGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdmxmaWVsZC5pc09yZGluYWxTY2FsZShlbmNvZGluZy5maWVsZChlbmNUeXBlKSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNEaW1lbnNpb24gPSBmdW5jdGlvbihlbmNvZGluZywgZW5jVHlwZSkge1xuICAgIHJldHVybiB2bGZpZWxkLmlzRGltZW5zaW9uKGVuY29kaW5nLmZpZWxkKGVuY1R5cGUpKTtcbiAgfTtcblxuICBFbmNvZGluZy5pc01lYXN1cmUgPSBmdW5jdGlvbihlbmNvZGluZywgZW5jVHlwZSkge1xuICAgIHJldHVybiB2bGZpZWxkLmlzTWVhc3VyZShlbmNvZGluZy5maWVsZChlbmNUeXBlKSk7XG4gIH07XG5cbiAgcHJvdG8uaXNPcmRpbmFsU2NhbGUgPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGVuY1R5cGUpICYmIEVuY29kaW5nLmlzT3JkaW5hbFNjYWxlKHRoaXMsIGVuY1R5cGUpO1xuICB9O1xuXG4gIHByb3RvLmlzRGltZW5zaW9uID0gZnVuY3Rpb24oZW5jVHlwZSkge1xuICAgIHJldHVybiB0aGlzLmhhcyhlbmNUeXBlKSAmJiBFbmNvZGluZy5pc0RpbWVuc2lvbih0aGlzLCBlbmNUeXBlKTtcbiAgfTtcblxuICBwcm90by5pc01lYXN1cmUgPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGVuY1R5cGUpICYmIEVuY29kaW5nLmlzTWVhc3VyZSh0aGlzLCBlbmNUeXBlKTtcbiAgfTtcblxuICBwcm90by5pc0FnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2bGVuYy5pc0FnZ3JlZ2F0ZSh0aGlzLl9lbmMpO1xuICB9O1xuXG4gIEVuY29kaW5nLmlzQWdncmVnYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiB2bGVuYy5pc0FnZ3JlZ2F0ZShzcGVjLmVuY29kaW5nKTtcbiAgfTtcblxuICBFbmNvZGluZy5hbHdheXNOb09jY2x1c2lvbiA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICAvLyBGSVhNRSByYXcgT3hRIHdpdGggIyBvZiByb3dzID0gIyBvZiBPXG4gICAgcmV0dXJuIHZsZW5jLmlzQWdncmVnYXRlKHNwZWMuZW5jb2RpbmcpO1xuICB9O1xuXG4gIEVuY29kaW5nLmlzU3RhY2sgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgLy8gRklYTUUgdXBkYXRlIHRoaXMgb25jZSB3ZSBoYXZlIGNvbnRyb2wgZm9yIHN0YWNrIC4uLlxuICAgIHJldHVybiAoc3BlYy5tYXJrdHlwZSA9PT0gJ2JhcicgfHwgc3BlYy5tYXJrdHlwZSA9PT0gJ2FyZWEnKSAmJlxuICAgICAgc3BlYy5lbmNvZGluZy5jb2xvcjtcbiAgfTtcblxuICBwcm90by5pc1N0YWNrID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gRklYTUUgdXBkYXRlIHRoaXMgb25jZSB3ZSBoYXZlIGNvbnRyb2wgZm9yIHN0YWNrIC4uLlxuICAgIHJldHVybiAodGhpcy5pcygnYmFyJykgfHwgdGhpcy5pcygnYXJlYScpKSAmJiB0aGlzLmhhcygnY29sb3InKTtcbiAgfTtcblxuICBwcm90by5jYXJkaW5hbGl0eSA9IGZ1bmN0aW9uKGVuY1R5cGUsIHN0YXRzKSB7XG4gICAgcmV0dXJuIHZsZmllbGQuY2FyZGluYWxpdHkodGhpcy5maWVsZChlbmNUeXBlKSwgc3RhdHMsIHRoaXMuY29uZmlnKCdmaWx0ZXJOdWxsJykpO1xuICB9O1xuXG4gIHByb3RvLmlzUmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzQWdncmVnYXRlKCk7XG4gIH07XG5cbiAgcHJvdG8uZGF0YSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gbmFtZSA/IHRoaXMuX2RhdGFbbmFtZV0gOiB0aGlzLl9kYXRhO1xuICB9O1xuXG4gICAvLyByZXR1cm5zIHdoZXRoZXIgdGhlIGVuY29kaW5nIGhhcyB2YWx1ZXMgZW1iZWRkZWRcbiAgcHJvdG8uaGFzVmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHMgPSB0aGlzLmRhdGEoJ3ZhbHVlcycpO1xuICAgIHJldHVybiB2YWxzICYmIHZhbHMubGVuZ3RoO1xuICB9O1xuXG4gIHByb3RvLmNvbmZpZyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY29uZmlnW25hbWVdO1xuICB9O1xuXG4gIEVuY29kaW5nLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICB2YXIgb2xkZW5jID0gc3BlYy5lbmNvZGluZyxcbiAgICAgIGVuYyA9IHV0aWwuZHVwbGljYXRlKHNwZWMuZW5jb2RpbmcpO1xuICAgIGVuYy54ID0gb2xkZW5jLnk7XG4gICAgZW5jLnkgPSBvbGRlbmMueDtcbiAgICBlbmMucm93ID0gb2xkZW5jLmNvbDtcbiAgICBlbmMuY29sID0gb2xkZW5jLnJvdztcbiAgICBzcGVjLmVuY29kaW5nID0gZW5jO1xuICAgIHJldHVybiBzcGVjO1xuICB9O1xuXG4gIC8vIEZJWE1FOiBSRU1PVkUgZXZlcnl0aGluZyBiZWxvdyBoZXJlXG5cbiAgRW5jb2RpbmcudG9nZ2xlU29ydCA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICBzcGVjLmNvbmZpZyA9IHNwZWMuY29uZmlnIHx8IHt9O1xuICAgIHNwZWMuY29uZmlnLnRvZ2dsZVNvcnQgPSBzcGVjLmNvbmZpZy50b2dnbGVTb3J0ID09PSBRID8gTiA6IFE7XG4gICAgcmV0dXJuIHNwZWM7XG4gIH07XG5cblxuICBFbmNvZGluZy50b2dnbGVTb3J0LmRpcmVjdGlvbiA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICBpZiAoIUVuY29kaW5nLnRvZ2dsZVNvcnQuc3VwcG9ydChzcGVjKSkgeyByZXR1cm47IH1cbiAgICB2YXIgZW5jID0gc3BlYy5lbmNvZGluZztcbiAgICByZXR1cm4gZW5jLngudHlwZSA9PT0gTiA/ICd4JyA6ICd5JztcbiAgfTtcblxuICBFbmNvZGluZy50b2dnbGVTb3J0Lm1vZGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHNwZWMuY29uZmlnLnRvZ2dsZVNvcnQ7XG4gIH07XG5cbiAgRW5jb2RpbmcudG9nZ2xlU29ydC5zdXBwb3J0ID0gZnVuY3Rpb24oc3BlYywgc3RhdHMpIHtcbiAgICB2YXIgZW5jID0gc3BlYy5lbmNvZGluZyxcbiAgICAgIGlzVHlwZXMgPSB2bGZpZWxkLmlzVHlwZXM7XG5cbiAgICBpZiAodmxlbmMuaGFzKGVuYywgUk9XKSB8fCB2bGVuYy5oYXMoZW5jLCBDT0wpIHx8XG4gICAgICAhdmxlbmMuaGFzKGVuYywgWCkgfHwgIXZsZW5jLmhhcyhlbmMsIFkpIHx8XG4gICAgICAhRW5jb2RpbmcuYWx3YXlzTm9PY2NsdXNpb24oc3BlYywgc3RhdHMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuICggaXNUeXBlcyhlbmMueCwgW04sT10pICYmIHZsZmllbGQuaXNNZWFzdXJlKGVuYy55KSkgPyAneCcgOlxuICAgICAgKCBpc1R5cGVzKGVuYy55LCBbTixPXSkgJiYgdmxmaWVsZC5pc01lYXN1cmUoZW5jLngpKSA/ICd5JyA6IGZhbHNlO1xuICB9O1xuXG4gIEVuY29kaW5nLnRvZ2dsZUZpbHRlck51bGxPID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHNwZWMuY29uZmlnID0gc3BlYy5jb25maWcgfHwge307XG4gICAgc3BlYy5jb25maWcuZmlsdGVyTnVsbCA9IHNwZWMuY29uZmlnLmZpbHRlck51bGwgfHwgeyAvL0ZJWE1FXG4gICAgICBUOiB0cnVlLFxuICAgICAgUTogdHJ1ZVxuICAgIH07XG4gICAgc3BlYy5jb25maWcuZmlsdGVyTnVsbC5PID0gIXNwZWMuY29uZmlnLmZpbHRlck51bGwuTztcbiAgICByZXR1cm4gc3BlYztcbiAgfTtcblxuICBFbmNvZGluZy50b2dnbGVGaWx0ZXJOdWxsTy5zdXBwb3J0ID0gZnVuY3Rpb24oc3BlYywgc3RhdHMpIHtcbiAgICB2YXIgZmllbGRzID0gdmxlbmMuZmllbGRzKHNwZWMuZW5jb2RpbmcpO1xuICAgIGZvciAodmFyIGZpZWxkTmFtZSBpbiBmaWVsZHMpIHtcbiAgICAgIHZhciBmaWVsZExpc3QgPSBmaWVsZHNbZmllbGROYW1lXTtcbiAgICAgIGlmIChmaWVsZExpc3QuY29udGFpbnNUeXBlLk8gJiYgZmllbGROYW1lIGluIHN0YXRzICYmIHN0YXRzW2ZpZWxkTmFtZV0ubnVsbHMgPiAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgcmV0dXJuIEVuY29kaW5nO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBhZ2dyZWdhdGVzO1xuXG5mdW5jdGlvbiBhZ2dyZWdhdGVzKGRhdGFUYWJsZSwgZW5jb2RpbmcsIG9wdCkge1xuICBvcHQgPSBvcHQgfHwge307XG5cbiAgdmFyIGRpbXMgPSB7fSwgbWVhcyA9IHt9LCBkZXRhaWwgPSB7fSwgZmFjZXRzID0ge307XG5cbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuICAgIGlmIChmaWVsZC5hZ2dyZWdhdGUpIHtcbiAgICAgIGlmIChmaWVsZC5hZ2dyZWdhdGUgPT09ICdjb3VudCcpIHtcbiAgICAgICAgbWVhcy5jb3VudCA9IHtvcDogJ2NvdW50JywgZmllbGQ6ICcqJ307XG4gICAgICB9ZWxzZSB7XG4gICAgICAgIG1lYXNbZmllbGQuYWdncmVnYXRlICsgJ3wnKyBmaWVsZC5uYW1lXSA9IHtcbiAgICAgICAgICBvcDogZmllbGQuYWdncmVnYXRlLFxuICAgICAgICAgIGZpZWxkOiBlbmNvZGluZy5maWVsZFJlZihlbmNUeXBlLCB7bm9mbjogdHJ1ZX0pXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpbXNbZmllbGQubmFtZV0gPSBlbmNvZGluZy5maWVsZFJlZihlbmNUeXBlKTtcbiAgICAgIGlmIChlbmNUeXBlID09IFJPVyB8fCBlbmNUeXBlID09IENPTCkge1xuICAgICAgICBmYWNldHNbZmllbGQubmFtZV0gPSBkaW1zW2ZpZWxkLm5hbWVdO1xuICAgICAgfWVsc2UgaWYgKGVuY1R5cGUgIT09IFggJiYgZW5jVHlwZSAhPT0gWSkge1xuICAgICAgICBkZXRhaWxbZmllbGQubmFtZV0gPSBkaW1zW2ZpZWxkLm5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGRpbXMgPSB1dGlsLnZhbHMoZGltcyk7XG4gIG1lYXMgPSB1dGlsLnZhbHMobWVhcyk7XG5cbiAgaWYgKG1lYXMubGVuZ3RoID4gMCkge1xuICAgIGlmICghZGF0YVRhYmxlLnRyYW5zZm9ybSkgZGF0YVRhYmxlLnRyYW5zZm9ybSA9IFtdO1xuICAgIGRhdGFUYWJsZS50cmFuc2Zvcm0ucHVzaCh7XG4gICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgIGdyb3VwYnk6IGRpbXMsXG4gICAgICBmaWVsZHM6IG1lYXNcbiAgICB9KTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGRldGFpbHM6IHV0aWwudmFscyhkZXRhaWwpLFxuICAgIGRpbXM6IGRpbXMsXG4gICAgZmFjZXRzOiB1dGlsLnZhbHMoZmFjZXRzKSxcbiAgICBhZ2dyZWdhdGVkOiBtZWFzLmxlbmd0aCA+IDBcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgc2V0dGVyID0gdXRpbC5zZXR0ZXIsXG4gIGdldHRlciA9IHV0aWwuZ2V0dGVyLFxuICB0aW1lID0gcmVxdWlyZSgnLi90aW1lJyk7XG5cbnZhciBheGlzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuYXhpcy5uYW1lcyA9IGZ1bmN0aW9uKHByb3BzKSB7XG4gIHJldHVybiB1dGlsLmtleXModXRpbC5rZXlzKHByb3BzKS5yZWR1Y2UoZnVuY3Rpb24oYSwgeCkge1xuICAgIHZhciBzID0gcHJvcHNbeF0uc2NhbGU7XG4gICAgaWYgKHMgPT09IFggfHwgcyA9PT0gWSkgYVtwcm9wc1t4XS5zY2FsZV0gPSAxO1xuICAgIHJldHVybiBhO1xuICB9LCB7fSkpO1xufTtcblxuYXhpcy5kZWZzID0gZnVuY3Rpb24obmFtZXMsIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzLCBvcHQpIHtcbiAgcmV0dXJuIG5hbWVzLnJlZHVjZShmdW5jdGlvbihhLCBuYW1lKSB7XG4gICAgYS5wdXNoKGF4aXMuZGVmKG5hbWUsIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzLCBvcHQpKTtcbiAgICByZXR1cm4gYTtcbiAgfSwgW10pO1xufTtcblxuYXhpcy5kZWYgPSBmdW5jdGlvbihuYW1lLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cywgb3B0KSB7XG4gIHZhciBpc0NvbCA9IG5hbWUgPT0gQ09MLFxuICAgIGlzUm93ID0gbmFtZSA9PSBST1csXG4gICAgdHlwZSA9IGlzQ29sID8gJ3gnIDogaXNSb3cgPyAneScgOiBuYW1lO1xuXG4gIHZhciBkZWYgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBzY2FsZTogbmFtZSxcbiAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICBsYXllcjogZW5jb2RpbmcuZmllbGQobmFtZSkuYXhpcy5sYXllcixcbiAgICBvcmllbnQ6IGF4aXMub3JpZW50KG5hbWUsIGVuY29kaW5nLCBzdGF0cylcbiAgfTtcblxuICAvLyBBZGQgYXhpcyBsYWJlbCBjdXN0b20gc2NhbGUgKGZvciBiaW4gLyB0aW1lKVxuICBkZWYgPSBheGlzLmxhYmVscy5zY2FsZShkZWYsIGVuY29kaW5nLCBuYW1lKTtcbiAgZGVmID0gYXhpcy5sYWJlbHMuZm9ybWF0KGRlZiwgbmFtZSwgZW5jb2RpbmcsIHN0YXRzKTtcblxuICAvLyBmb3IgeC1heGlzLCBzZXQgdGlja3MgZm9yIFEgb3Igcm90YXRlIHNjYWxlIGZvciBvcmRpbmFsIHNjYWxlXG4gIGlmIChuYW1lID09IFgpIHtcbiAgICBpZiAoZW5jb2RpbmcuaXNEaW1lbnNpb24oWCkgfHwgZW5jb2RpbmcuaXNUeXBlKFgsIFQpKSB7XG4gICAgICAvLyBUT0RPKGthbml0dyk6IEp1bCAxOSwgMjAxNSAtICM1MDYgYWRkIGNvbmRpdGlvbiBmb3Igcm90YXRpb25cbiAgICAgIGRlZiA9IGF4aXMubGFiZWxzLnJvdGF0ZShkZWYpO1xuICAgIH0gZWxzZSB7IC8vIFFcbiAgICAgIGRlZi50aWNrcyA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLmF4aXMudGlja3M7XG4gICAgfVxuICB9XG5cbiAgLy8gVGl0bGVPZmZzZXQgZGVwZW5kcyBvbiBsYWJlbHMgcm90YXRpb25cbiAgZGVmLnRpdGxlT2Zmc2V0ID0gYXhpcy50aXRsZU9mZnNldChlbmNvZGluZywgbGF5b3V0LCBuYW1lKTtcblxuICAvL2RlZi5vZmZzZXQgaXMgdXNlZCBpbiBheGlzLmdyaWRcbiAgaWYoaXNSb3cpIGRlZi5vZmZzZXQgPSBheGlzLnRpdGxlT2Zmc2V0KGVuY29kaW5nLCBsYXlvdXQsIFkpICsgMjA7XG4gIC8vIEZJWE1FKGthbml0dyk6IEp1bCAxOSwgMjAxNSAtIG9mZnNldCBmb3IgY29sdW1uIHdoZW4geCBpcyBwdXQgb24gdG9wXG5cbiAgZGVmID0gYXhpcy5ncmlkKGRlZiwgbmFtZSwgZW5jb2RpbmcsIGxheW91dCk7XG4gIGRlZiA9IGF4aXMudGl0bGUoZGVmLCBuYW1lLCBlbmNvZGluZywgbGF5b3V0LCBvcHQpO1xuXG4gIGlmIChpc1JvdyB8fCBpc0NvbCkgZGVmID0gYXhpcy5oaWRlVGlja3MoZGVmKTtcblxuICByZXR1cm4gZGVmO1xufTtcblxuYXhpcy5vcmllbnQgPSBmdW5jdGlvbihuYW1lLCBlbmNvZGluZywgc3RhdHMpIHtcbiAgdmFyIG9yaWVudCA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLmF4aXMub3JpZW50O1xuICBpZiAob3JpZW50KSByZXR1cm4gb3JpZW50O1xuXG4gIGlmIChuYW1lPT09Q09MKSByZXR1cm4gJ3RvcCc7XG5cbiAgLy8geC1heGlzIGZvciBsb25nIHkgLSBwdXQgb24gdG9wXG4gIGlmIChuYW1lPT09WCAmJiBlbmNvZGluZy5oYXMoWSkgJiYgZW5jb2RpbmcuaXNPcmRpbmFsU2NhbGUoWSkgJiYgZW5jb2RpbmcuY2FyZGluYWxpdHkoWSwgc3RhdHMpID4gMzApIHtcbiAgICByZXR1cm4gJ3RvcCc7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuYXhpcy5ncmlkID0gZnVuY3Rpb24oZGVmLCBuYW1lLCBlbmNvZGluZywgbGF5b3V0KSB7XG4gIHZhciBjZWxsUGFkZGluZyA9IGxheW91dC5jZWxsUGFkZGluZyxcbiAgICBpc0NvbCA9IG5hbWUgPT0gQ09MLFxuICAgIGlzUm93ID0gbmFtZSA9PSBST1c7XG5cbiAgaWYgKGVuY29kaW5nLmF4aXMobmFtZSkuZ3JpZCkge1xuICAgIGRlZi5ncmlkID0gdHJ1ZTtcblxuICAgIGlmIChpc0NvbCkge1xuICAgICAgLy8gc2V0IGdyaWQgcHJvcGVydHkgLS0gcHV0IHRoZSBsaW5lcyBvbiB0aGUgcmlnaHQgdGhlIGNlbGxcbiAgICAgIGRlZi5wcm9wZXJ0aWVzLmdyaWQgPSB7XG4gICAgICAgIHg6IHtcbiAgICAgICAgICBvZmZzZXQ6IGxheW91dC5jZWxsV2lkdGggKiAoMSsgY2VsbFBhZGRpbmcvMi4wKSxcbiAgICAgICAgICAvLyBkZWZhdWx0IHZhbHVlKHMpIC0tIHZlZ2EgZG9lc24ndCBkbyByZWN1cnNpdmUgbWVyZ2VcbiAgICAgICAgICBzY2FsZTogJ2NvbCdcbiAgICAgICAgfSxcbiAgICAgICAgeToge1xuICAgICAgICAgIHZhbHVlOiAtbGF5b3V0LmNlbGxIZWlnaHQgKiAoY2VsbFBhZGRpbmcvMiksXG4gICAgICAgIH0sXG4gICAgICAgIHN0cm9rZTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsR3JpZENvbG9yJykgfSxcbiAgICAgICAgb3BhY2l0eTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsR3JpZE9wYWNpdHknKSB9XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoaXNSb3cpIHtcbiAgICAgIC8vIHNldCBncmlkIHByb3BlcnR5IC0tIHB1dCB0aGUgbGluZXMgb24gdGhlIHRvcFxuICAgICAgZGVmLnByb3BlcnRpZXMuZ3JpZCA9IHtcbiAgICAgICAgeToge1xuICAgICAgICAgIG9mZnNldDogLWxheW91dC5jZWxsSGVpZ2h0ICogKGNlbGxQYWRkaW5nLzIpLFxuICAgICAgICAgIC8vIGRlZmF1bHQgdmFsdWUocykgLS0gdmVnYSBkb2Vzbid0IGRvIHJlY3Vyc2l2ZSBtZXJnZVxuICAgICAgICAgIHNjYWxlOiAncm93J1xuICAgICAgICB9LFxuICAgICAgICB4OiB7XG4gICAgICAgICAgdmFsdWU6IGRlZi5vZmZzZXRcbiAgICAgICAgfSxcbiAgICAgICAgeDI6IHtcbiAgICAgICAgICBvZmZzZXQ6IGRlZi5vZmZzZXQgKyAobGF5b3V0LmNlbGxXaWR0aCAqIDAuMDUpLFxuICAgICAgICAgIC8vIGRlZmF1bHQgdmFsdWUocykgLS0gdmVnYSBkb2Vzbid0IGRvIHJlY3Vyc2l2ZSBtZXJnZVxuICAgICAgICAgIGdyb3VwOiAnbWFyay5ncm91cC53aWR0aCcsXG4gICAgICAgICAgbXVsdDogMVxuICAgICAgICB9LFxuICAgICAgICBzdHJva2U6IHsgdmFsdWU6IGVuY29kaW5nLmNvbmZpZygnY2VsbEdyaWRDb2xvcicpIH0sXG4gICAgICAgIG9wYWNpdHk6IHsgdmFsdWU6IGVuY29kaW5nLmNvbmZpZygnY2VsbEdyaWRPcGFjaXR5JykgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmLnByb3BlcnRpZXMuZ3JpZCA9IHtcbiAgICAgICAgc3Ryb2tlOiB7IHZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2dyaWRDb2xvcicpIH0sXG4gICAgICAgIG9wYWNpdHk6IHsgdmFsdWU6IGVuY29kaW5nLmNvbmZpZygnZ3JpZE9wYWNpdHknKSB9XG4gICAgICB9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVmO1xufTtcblxuYXhpcy5oaWRlVGlja3MgPSBmdW5jdGlvbihkZWYpIHtcbiAgZGVmLnByb3BlcnRpZXMudGlja3MgPSB7b3BhY2l0eToge3ZhbHVlOiAwfX07XG4gIGRlZi5wcm9wZXJ0aWVzLm1ham9yVGlja3MgPSB7b3BhY2l0eToge3ZhbHVlOiAwfX07XG4gIGRlZi5wcm9wZXJ0aWVzLmF4aXMgPSB7b3BhY2l0eToge3ZhbHVlOiAwfX07XG4gIHJldHVybiBkZWY7XG59O1xuXG5heGlzLnRpdGxlID0gZnVuY3Rpb24gKGRlZiwgbmFtZSwgZW5jb2RpbmcsIGxheW91dCkge1xuICB2YXIgYXggPSBlbmNvZGluZy5maWVsZChuYW1lKS5heGlzO1xuXG4gIGlmIChheC50aXRsZSkge1xuICAgIGRlZi50aXRsZSA9IGF4LnRpdGxlO1xuICB9IGVsc2Uge1xuICAgIC8vIGlmIG5vdCBkZWZpbmVkLCBhdXRvbWF0aWNhbGx5IGRldGVybWluZSBheGlzIHRpdGxlIGZyb20gZmllbGQgZGVmXG4gICAgdmFyIGZpZWxkVGl0bGUgPSBlbmNvZGluZy5maWVsZFRpdGxlKG5hbWUpLFxuICAgICAgbWF4TGVuZ3RoO1xuXG4gICAgaWYgKGF4LnRpdGxlTWF4TGVuZ3RoKSB7XG4gICAgICBtYXhMZW5ndGggPSBheC50aXRsZU1heExlbmd0aDtcbiAgICB9IGVsc2UgaWYgKG5hbWU9PT1YKSB7XG4gICAgICBtYXhMZW5ndGggPSBsYXlvdXQuY2VsbFdpZHRoIC8gZW5jb2RpbmcuY29uZmlnKCdjaGFyYWN0ZXJXaWR0aCcpO1xuICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gWSkge1xuICAgICAgbWF4TGVuZ3RoID0gbGF5b3V0LmNlbGxIZWlnaHQgLyBlbmNvZGluZy5jb25maWcoJ2NoYXJhY3RlcldpZHRoJyk7XG4gICAgfVxuXG4gICAgZGVmLnRpdGxlID0gbWF4TGVuZ3RoID8gdXRpbC50cnVuY2F0ZShmaWVsZFRpdGxlLCBtYXhMZW5ndGgpIDogZmllbGRUaXRsZTtcbiAgfVxuXG4gIGlmIChuYW1lID09PSBST1cpIHtcbiAgICBkZWYucHJvcGVydGllcy50aXRsZSA9IHtcbiAgICAgIGFuZ2xlOiB7dmFsdWU6IDB9LFxuICAgICAgYWxpZ246IHt2YWx1ZTogJ3JpZ2h0J30sXG4gICAgICBiYXNlbGluZToge3ZhbHVlOiAnbWlkZGxlJ30sXG4gICAgICBkeToge3ZhbHVlOiAoLWxheW91dC5oZWlnaHQvMikgLTIwfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gZGVmO1xufTtcblxuYXhpcy5sYWJlbHMgPSB7fTtcblxuLyoqIGFkZCBjdXN0b20gbGFiZWwgZm9yIHRpbWUgdHlwZSBhbmQgYmluICovXG5heGlzLmxhYmVscy5zY2FsZSA9IGZ1bmN0aW9uKGRlZiwgZW5jb2RpbmcsIG5hbWUpIHtcbiAgLy8gdGltZVxuICB2YXIgdGltZVVuaXQgPSBlbmNvZGluZy5maWVsZChuYW1lKS50aW1lVW5pdDtcbiAgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSAmJiB0aW1lVW5pdCAmJiAodGltZS5oYXNTY2FsZSh0aW1lVW5pdCkpKSB7XG4gICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywnbGFiZWxzJywndGV4dCcsJ3NjYWxlJ10sICd0aW1lLScrIHRpbWVVbml0KTtcbiAgfVxuICAvLyBGSVhNRSBiaW5cbiAgcmV0dXJuIGRlZjtcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lIG51bWJlciBmb3JtYXQgb3IgdHJ1bmNhdGUgaWYgbWF4TGFiZWwgbGVuZ3RoIGlzIHByZXNlbnRlZC5cbiAqL1xuYXhpcy5sYWJlbHMuZm9ybWF0ID0gZnVuY3Rpb24gKGRlZiwgbmFtZSwgZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHZhciBmaWVsZFN0YXRzID0gc3RhdHNbZW5jb2RpbmcuZmllbGQobmFtZSkubmFtZV07XG5cbiAgaWYgKGVuY29kaW5nLmF4aXMobmFtZSkuZm9ybWF0KSB7XG4gICAgZGVmLmZvcm1hdCA9IGVuY29kaW5nLmF4aXMobmFtZSkuZm9ybWF0O1xuICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBRKSB8fCBmaWVsZFN0YXRzLnR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgZGVmLmZvcm1hdCA9IGVuY29kaW5nLm51bWJlckZvcm1hdChmaWVsZFN0YXRzKTtcbiAgfSBlbHNlIGlmIChlbmNvZGluZy5pc1R5cGUobmFtZSwgVCkpIHtcbiAgICB2YXIgdGltZVVuaXQgPSBlbmNvZGluZy5maWVsZChuYW1lKS50aW1lVW5pdDtcbiAgICBpZiAoIXRpbWVVbml0KSB7XG4gICAgICBkZWYuZm9ybWF0ID0gZW5jb2RpbmcuY29uZmlnKCd0aW1lRm9ybWF0Jyk7XG4gICAgfSBlbHNlIGlmICh0aW1lVW5pdCA9PT0gJ3llYXInKSB7XG4gICAgICBkZWYuZm9ybWF0ID0gJ2QnO1xuICAgIH1cbiAgfSBlbHNlIGlmIChlbmNvZGluZy5pc1R5cGVzKG5hbWUsIFtOLCBPXSkgJiYgZW5jb2RpbmcuYXhpcyhuYW1lKS5tYXhMYWJlbExlbmd0aCkge1xuICAgIHNldHRlcihkZWYsXG4gICAgICBbJ3Byb3BlcnRpZXMnLCdsYWJlbHMnLCd0ZXh0JywndGVtcGxhdGUnXSxcbiAgICAgICd7e2RhdGEgfCB0cnVuY2F0ZTonICsgZW5jb2RpbmcuYXhpcyhuYW1lKS5tYXhMYWJlbExlbmd0aCArICd9fSdcbiAgICAgICk7XG4gIH1cblxuICByZXR1cm4gZGVmO1xufTtcblxuYXhpcy5sYWJlbHMucm90YXRlID0gZnVuY3Rpb24oZGVmKSB7XG4gdmFyIGFsaWduID0gZGVmLm9yaWVudCA9PT0ndG9wJyA/ICdsZWZ0JyA6ICdyaWdodCc7XG4gc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywnbGFiZWxzJywgJ2FuZ2xlJywgJ3ZhbHVlJ10sIDI3MCk7XG4gc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywnbGFiZWxzJywgJ2FsaWduJywgJ3ZhbHVlJ10sIGFsaWduKTtcbiBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCdsYWJlbHMnLCAnYmFzZWxpbmUnLCAndmFsdWUnXSwgJ21pZGRsZScpO1xuIHJldHVybiBkZWY7XG59O1xuXG5heGlzLnRpdGxlT2Zmc2V0ID0gZnVuY3Rpb24gKGVuY29kaW5nLCBsYXlvdXQsIG5hbWUpIHtcbiAgLy8gcmV0dXJuIHNwZWNpZmllZCB2YWx1ZSBpZiBzcGVjaWZpZWRcbiAgdmFyIHZhbHVlID0gZW5jb2RpbmcuYXhpcyhuYW1lKS50aXRsZU9mZnNldDtcbiAgaWYgKHZhbHVlKSAgcmV0dXJuIHZhbHVlO1xuXG4gIHN3aXRjaCAobmFtZSkge1xuICAgIC8vRklYTUUgbWFrZSB0aGlzIGFkanVzdGFibGVcbiAgICBjYXNlIFJPVzogcmV0dXJuIDA7XG4gICAgY2FzZSBDT0w6IHJldHVybiAzNTtcbiAgfVxuICByZXR1cm4gZ2V0dGVyKGxheW91dCwgW25hbWUsICdheGlzVGl0bGVPZmZzZXQnXSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmlubmluZztcblxuZnVuY3Rpb24gYmlubmluZyhkYXRhVGFibGUsIGVuY29kaW5nLCBvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gIGlmICghZGF0YVRhYmxlLnRyYW5zZm9ybSkgZGF0YVRhYmxlLnRyYW5zZm9ybSA9IFtdO1xuXG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICBpZiAoZW5jb2RpbmcuYmluKGVuY1R5cGUpKSB7XG4gICAgICBkYXRhVGFibGUudHJhbnNmb3JtLnB1c2goe1xuICAgICAgICB0eXBlOiAnYmluJyxcbiAgICAgICAgZmllbGQ6IGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUsIHtub2ZuOiB0cnVlfSksXG4gICAgICAgIG91dHB1dDogZW5jb2RpbmcuZmllbGRSZWYoZW5jVHlwZSksXG4gICAgICAgIG1heGJpbnM6IGVuY29kaW5nLmJpbihlbmNUeXBlKS5tYXhiaW5zXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhVGFibGU7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdW1tYXJ5ID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdkYXRhbGliL3NyYy9zdGF0cycpLnN1bW1hcnk7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIGNvbXBpbGVyID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxudmFyIEVuY29kaW5nID0gcmVxdWlyZSgnLi4vRW5jb2RpbmcnKSxcbiAgYXhpcyA9IGNvbXBpbGVyLmF4aXMgPSByZXF1aXJlKCcuL2F4aXMnKSxcbiAgZmlsdGVyID0gY29tcGlsZXIuZmlsdGVyID0gcmVxdWlyZSgnLi9maWx0ZXInKSxcbiAgbGVnZW5kID0gY29tcGlsZXIubGVnZW5kID0gcmVxdWlyZSgnLi9sZWdlbmQnKSxcbiAgbWFya3MgPSBjb21waWxlci5tYXJrcyA9IHJlcXVpcmUoJy4vbWFya3MnKSxcbiAgc2NhbGUgPSBjb21waWxlci5zY2FsZSA9IHJlcXVpcmUoJy4vc2NhbGUnKTtcblxuY29tcGlsZXIuYWdncmVnYXRlID0gcmVxdWlyZSgnLi9hZ2dyZWdhdGUnKTtcbmNvbXBpbGVyLmJpbiA9IHJlcXVpcmUoJy4vYmluJyk7XG5jb21waWxlci5mYWNldCA9IHJlcXVpcmUoJy4vZmFjZXQnKTtcbmNvbXBpbGVyLmdyb3VwID0gcmVxdWlyZSgnLi9ncm91cCcpO1xuY29tcGlsZXIubGF5b3V0ID0gcmVxdWlyZSgnLi9sYXlvdXQnKTtcbmNvbXBpbGVyLnNvcnQgPSByZXF1aXJlKCcuL3NvcnQnKTtcbmNvbXBpbGVyLnN0YWNrID0gcmVxdWlyZSgnLi9zdGFjaycpO1xuY29tcGlsZXIuc3R5bGUgPSByZXF1aXJlKCcuL3N0eWxlJyk7XG5jb21waWxlci5zdWJmYWNldCA9IHJlcXVpcmUoJy4vc3ViZmFjZXQnKTtcbmNvbXBpbGVyLnRlbXBsYXRlID0gcmVxdWlyZSgnLi90ZW1wbGF0ZScpO1xuY29tcGlsZXIudGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xuXG5jb21waWxlci5jb21waWxlID0gZnVuY3Rpb24gKHNwZWMsIHN0YXRzLCB0aGVtZSkge1xuICByZXR1cm4gY29tcGlsZXIuY29tcGlsZUVuY29kaW5nKEVuY29kaW5nLmZyb21TcGVjKHNwZWMsIHRoZW1lKSwgc3RhdHMpO1xufTtcblxuY29tcGlsZXIuc2hvcnRoYW5kID0gZnVuY3Rpb24gKHNob3J0aGFuZCwgc3RhdHMsIGNvbmZpZywgdGhlbWUpIHtcbiAgcmV0dXJuIGNvbXBpbGVyLmNvbXBpbGVFbmNvZGluZyhFbmNvZGluZy5mcm9tU2hvcnRoYW5kKHNob3J0aGFuZCwgY29uZmlnLCB0aGVtZSksIHN0YXRzKTtcbn07XG5cbmNvbXBpbGVyLmNvbXBpbGVFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhdHMpIHtcbiAgLy8gbm8gbmVlZCB0byBwYXNzIHN0YXRzIGlmIHlvdSBwYXNzIGluIHRoZSBkYXRhXG4gIGlmICghc3RhdHMgJiYgZW5jb2RpbmcuaGFzVmFsdWVzKCkpIHtcbiAgICBzdGF0cyA9IHN1bW1hcnkoZW5jb2RpbmcuZGF0YSgndmFsdWVzJykpLnJlZHVjZShmdW5jdGlvbihzLCBwKSB7XG4gICAgICBzW3AuZmllbGRdID0gcDtcbiAgICAgIHJldHVybiBzO1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIHZhciBsYXlvdXQgPSBjb21waWxlci5sYXlvdXQoZW5jb2RpbmcsIHN0YXRzKSxcbiAgICBzcGVjID0gY29tcGlsZXIudGVtcGxhdGUoZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpO1xuXG4gIC8vIC5kYXRhIHJlbGF0ZWQgc3R1ZmZcbiAgdmFyIHJhd1RhYmxlID0gc3BlYy5kYXRhWzBdLFxuICAgIGRhdGFUYWJsZSA9IHNwZWMuZGF0YVsxXTtcblxuICByYXdUYWJsZSA9IGZpbHRlci5hZGRGaWx0ZXJzKHJhd1RhYmxlLCBlbmNvZGluZyk7IC8vIG1vZGlmeSByYXdUYWJsZVxuICBzcGVjID0gY29tcGlsZXIudGltZShzcGVjLCBlbmNvZGluZyk7ICAgICAgICAgICAgICAvLyBtb2RpZnkgcmF3VGFibGUsIGFkZCBzY2FsZXNcbiAgZGF0YVRhYmxlID0gY29tcGlsZXIuYmluKGRhdGFUYWJsZSwgZW5jb2RpbmcpOyAgICAgLy8gbW9kaWZ5IGRhdGFUYWJsZVxuICB2YXIgYWdnUmVzdWx0ID0gY29tcGlsZXIuYWdncmVnYXRlKGRhdGFUYWJsZSwgZW5jb2RpbmcpOyAvLyBtb2RpZnkgZGF0YVRhYmxlXG4gIHZhciBzb3J0aW5nID0gY29tcGlsZXIuc29ydChzcGVjLmRhdGEsIGVuY29kaW5nLCBzdGF0cyk7IC8vIGFwcGVuZCBuZXcgZGF0YVxuXG4gIC8vIG1hcmtzXG4gIHZhciBzdHlsZSA9IGNvbXBpbGVyLnN0eWxlKGVuY29kaW5nLCBzdGF0cyksXG4gICAgZ3JvdXAgPSBzcGVjLm1hcmtzWzBdLFxuICAgIG1hcmsgPSBtYXJrc1tlbmNvZGluZy5tYXJrdHlwZSgpXSxcbiAgICBtZGVmcyA9IG1hcmtzLmRlZihtYXJrLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgc3RhdHMpLFxuICAgIG1kZWYgPSBtZGVmc1swXTsgIC8vIFRPRE86IHJlbW92ZSB0aGlzIGRpcnR5IGhhY2sgYnkgcmVmYWN0b3JpbmcgdGhlIHdob2xlIGZsb3dcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG1kZWZzLmxlbmd0aDsgaSsrKSB7XG4gICAgZ3JvdXAubWFya3MucHVzaChtZGVmc1tpXSk7XG4gIH1cblxuICB2YXIgbGluZVR5cGUgPSBtYXJrc1tlbmNvZGluZy5tYXJrdHlwZSgpXS5saW5lO1xuXG4gIC8vIGhhbmRsZSBzdWJmYWNldHNcblxuICB2YXIgZGV0YWlscyA9IGFnZ1Jlc3VsdC5kZXRhaWxzLFxuICAgIGhhc0RldGFpbHMgPSBkZXRhaWxzICYmIGRldGFpbHMubGVuZ3RoID4gMCxcbiAgICBzdGFjayA9IGhhc0RldGFpbHMgJiYgY29tcGlsZXIuc3RhY2soc3BlYy5kYXRhLCBlbmNvZGluZywgbWRlZiwgYWdnUmVzdWx0LmZhY2V0cyk7IC8vIG1vZGlmeSBzcGVjLmRhdGEsIG1kZWYue2Zyb20scHJvcGVydGllc31cblxuICBpZiAoaGFzRGV0YWlscyAmJiAoc3RhY2sgfHwgbGluZVR5cGUpKSB7XG4gICAgLy9zdWJmYWNldCB0byBncm91cCBzdGFjayAvIGxpbmUgdG9nZXRoZXIgaW4gb25lIGdyb3VwXG4gICAgY29tcGlsZXIuc3ViZmFjZXQoZ3JvdXAsIG1kZWYsIGRldGFpbHMsIHN0YWNrLCBlbmNvZGluZyk7XG4gIH1cblxuICAvLyBhdXRvLXNvcnQgbGluZS9hcmVhIHZhbHVlc1xuICAvL1RPRE8oa2FuaXR3KTogaGF2ZSBzb21lIGNvbmZpZyB0byB0dXJuIG9mZiBhdXRvLXNvcnQgZm9yIGxpbmUgKGZvciBsaW5lIGNoYXJ0IHRoYXQgZW5jb2RlcyB0ZW1wb3JhbCBpbmZvcm1hdGlvbilcbiAgaWYgKGxpbmVUeXBlKSB7XG4gICAgdmFyIGYgPSAoZW5jb2RpbmcuaXNNZWFzdXJlKFgpICYmIGVuY29kaW5nLmlzRGltZW5zaW9uKFkpKSA/IFkgOiBYO1xuICAgIGlmICghbWRlZi5mcm9tKSBtZGVmLmZyb20gPSB7fTtcbiAgICAvLyBUT0RPOiB3aHkgLSA/XG4gICAgbWRlZi5mcm9tLnRyYW5zZm9ybSA9IFt7dHlwZTogJ3NvcnQnLCBieTogJy0nICsgZW5jb2RpbmcuZmllbGRSZWYoZil9XTtcbiAgfVxuXG4gIC8vIFNtYWxsIE11bHRpcGxlc1xuICBpZiAoZW5jb2RpbmcuaGFzKFJPVykgfHwgZW5jb2RpbmcuaGFzKENPTCkpIHtcbiAgICBzcGVjID0gY29tcGlsZXIuZmFjZXQoZ3JvdXAsIGVuY29kaW5nLCBsYXlvdXQsIHN0eWxlLCBzb3J0aW5nLCBzcGVjLCBtZGVmLCBzdGFjaywgc3RhdHMpO1xuICAgIHNwZWMubGVnZW5kcyA9IGxlZ2VuZC5kZWZzKGVuY29kaW5nKTtcbiAgfSBlbHNlIHtcbiAgICBncm91cC5zY2FsZXMgPSBzY2FsZS5kZWZzKHNjYWxlLm5hbWVzKG1kZWYucHJvcGVydGllcy51cGRhdGUpLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cywgc3R5bGUsIHNvcnRpbmcsIHtzdGFjazogc3RhY2t9KTtcbiAgICBncm91cC5heGVzID0gYXhpcy5kZWZzKGF4aXMubmFtZXMobWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZSksIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKTtcbiAgICBncm91cC5sZWdlbmRzID0gbGVnZW5kLmRlZnMoZW5jb2RpbmcpO1xuICB9XG5cbiAgZmlsdGVyLmZpbHRlckxlc3NUaGFuWmVybyhkYXRhVGFibGUsIGVuY29kaW5nKTtcblxuICByZXR1cm4gc3BlYztcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIGF4aXMgPSByZXF1aXJlKCcuL2F4aXMnKSxcbiAgZ3JvdXBkZWYgPSByZXF1aXJlKCcuL2dyb3VwJykuZGVmLFxuICBzY2FsZSA9IHJlcXVpcmUoJy4vc2NhbGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWNldGluZztcblxuZnVuY3Rpb24gZmFjZXRpbmcoZ3JvdXAsIGVuY29kaW5nLCBsYXlvdXQsIHN0eWxlLCBzb3J0aW5nLCBzcGVjLCBtZGVmLCBzdGFjaywgc3RhdHMpIHtcbiAgdmFyIGVudGVyID0gZ3JvdXAucHJvcGVydGllcy5lbnRlcjtcbiAgdmFyIGZhY2V0S2V5cyA9IFtdLCBjZWxsQXhlcyA9IFtdLCBmcm9tLCBheGVzR3JwO1xuXG4gIHZhciBoYXNSb3cgPSBlbmNvZGluZy5oYXMoUk9XKSwgaGFzQ29sID0gZW5jb2RpbmcuaGFzKENPTCk7XG5cbiAgZW50ZXIuZmlsbCA9IHt2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsQmFja2dyb3VuZENvbG9yJyl9O1xuXG4gIC8vbW92ZSBcImZyb21cIiB0byBjZWxsIGxldmVsIGFuZCBhZGQgZmFjZXQgdHJhbnNmb3JtXG4gIGdyb3VwLmZyb20gPSB7ZGF0YTogZ3JvdXAubWFya3NbMF0uZnJvbS5kYXRhfTtcblxuICAvLyBIYWNrLCB0aGlzIG5lZWRzIHRvIGJlIHJlZmFjdG9yZWRcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBncm91cC5tYXJrcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBtYXJrID0gZ3JvdXAubWFya3NbaV07XG4gICAgaWYgKG1hcmsuZnJvbS50cmFuc2Zvcm0pIHtcbiAgICAgIGRlbGV0ZSBtYXJrLmZyb20uZGF0YTsgLy9uZWVkIHRvIGtlZXAgdHJhbnNmb3JtIGZvciBzdWJmYWNldHRpbmcgY2FzZVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgbWFyay5mcm9tO1xuICAgIH1cbiAgfVxuXG4gIGlmIChoYXNSb3cpIHtcbiAgICBpZiAoIWVuY29kaW5nLmlzRGltZW5zaW9uKFJPVykpIHtcbiAgICAgIHV0aWwuZXJyb3IoJ1JvdyBlbmNvZGluZyBzaG91bGQgYmUgb3JkaW5hbC4nKTtcbiAgICB9XG4gICAgZW50ZXIueSA9IHtzY2FsZTogUk9XLCBmaWVsZDogJ2tleXMuJyArIGZhY2V0S2V5cy5sZW5ndGh9O1xuICAgIGVudGVyLmhlaWdodCA9IHsndmFsdWUnOiBsYXlvdXQuY2VsbEhlaWdodH07IC8vIEhBQ0tcblxuICAgIGZhY2V0S2V5cy5wdXNoKGVuY29kaW5nLmZpZWxkUmVmKFJPVykpO1xuXG4gICAgaWYgKGhhc0NvbCkge1xuICAgICAgZnJvbSA9IHV0aWwuZHVwbGljYXRlKGdyb3VwLmZyb20pO1xuICAgICAgZnJvbS50cmFuc2Zvcm0gPSBmcm9tLnRyYW5zZm9ybSB8fCBbXTtcbiAgICAgIGZyb20udHJhbnNmb3JtLnVuc2hpZnQoe3R5cGU6ICdmYWNldCcsIGtleXM6IFtlbmNvZGluZy5maWVsZFJlZihDT0wpXX0pO1xuICAgIH1cblxuICAgIGF4ZXNHcnAgPSBncm91cGRlZigneC1heGVzJywge1xuICAgICAgICBheGVzOiBlbmNvZGluZy5oYXMoWCkgPyBheGlzLmRlZnMoWyd4J10sIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgeDogaGFzQ29sID8ge3NjYWxlOiBDT0wsIGZpZWxkOiAna2V5cy4wJ30gOiB7dmFsdWU6IDB9LFxuICAgICAgICB3aWR0aDogaGFzQ29sICYmIHsndmFsdWUnOiBsYXlvdXQuY2VsbFdpZHRofSwgLy9IQUNLP1xuICAgICAgICBmcm9tOiBmcm9tXG4gICAgICB9KTtcblxuICAgIHNwZWMubWFya3MudW5zaGlmdChheGVzR3JwKTsgLy8gbmVlZCB0byBwcmVwZW5kIHNvIGl0IGFwcGVhcnMgdW5kZXIgdGhlIHBsb3RzXG4gICAgKHNwZWMuYXhlcyA9IHNwZWMuYXhlcyB8fCBbXSk7XG4gICAgc3BlYy5heGVzLnB1c2guYXBwbHkoc3BlYy5heGVzLCBheGlzLmRlZnMoWydyb3cnXSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpKTtcbiAgfSBlbHNlIHsgLy8gZG9lc24ndCBoYXZlIHJvd1xuICAgIGlmIChlbmNvZGluZy5oYXMoWCkpIHtcbiAgICAgIC8va2VlcCB4IGF4aXMgaW4gdGhlIGNlbGxcbiAgICAgIGNlbGxBeGVzLnB1c2guYXBwbHkoY2VsbEF4ZXMsIGF4aXMuZGVmcyhbJ3gnXSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpKTtcbiAgICB9XG4gIH1cblxuICBpZiAoaGFzQ29sKSB7XG4gICAgaWYgKCFlbmNvZGluZy5pc0RpbWVuc2lvbihDT0wpKSB7XG4gICAgICB1dGlsLmVycm9yKCdDb2wgZW5jb2Rpbmcgc2hvdWxkIGJlIG9yZGluYWwuJyk7XG4gICAgfVxuICAgIGVudGVyLnggPSB7c2NhbGU6IENPTCwgZmllbGQ6ICdrZXlzLicgKyBmYWNldEtleXMubGVuZ3RofTtcbiAgICBlbnRlci53aWR0aCA9IHsndmFsdWUnOiBsYXlvdXQuY2VsbFdpZHRofTsgLy8gSEFDS1xuXG4gICAgZmFjZXRLZXlzLnB1c2goZW5jb2RpbmcuZmllbGRSZWYoQ09MKSk7XG5cbiAgICBpZiAoaGFzUm93KSB7XG4gICAgICBmcm9tID0gdXRpbC5kdXBsaWNhdGUoZ3JvdXAuZnJvbSk7XG4gICAgICBmcm9tLnRyYW5zZm9ybSA9IGZyb20udHJhbnNmb3JtIHx8IFtdO1xuICAgICAgZnJvbS50cmFuc2Zvcm0udW5zaGlmdCh7dHlwZTogJ2ZhY2V0Jywga2V5czogW2VuY29kaW5nLmZpZWxkUmVmKFJPVyldfSk7XG4gICAgfVxuXG4gICAgYXhlc0dycCA9IGdyb3VwZGVmKCd5LWF4ZXMnLCB7XG4gICAgICBheGVzOiBlbmNvZGluZy5oYXMoWSkgPyBheGlzLmRlZnMoWyd5J10sIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSA6IHVuZGVmaW5lZCxcbiAgICAgIHk6IGhhc1JvdyAmJiB7c2NhbGU6IFJPVywgZmllbGQ6ICdrZXlzLjAnfSxcbiAgICAgIHg6IGhhc1JvdyAmJiB7dmFsdWU6IDB9LFxuICAgICAgaGVpZ2h0OiBoYXNSb3cgJiYgeyd2YWx1ZSc6IGxheW91dC5jZWxsSGVpZ2h0fSwgLy9IQUNLP1xuICAgICAgZnJvbTogZnJvbVxuICAgIH0pO1xuXG4gICAgc3BlYy5tYXJrcy51bnNoaWZ0KGF4ZXNHcnApOyAvLyBuZWVkIHRvIHByZXBlbmQgc28gaXQgYXBwZWFycyB1bmRlciB0aGUgcGxvdHNcbiAgICAoc3BlYy5heGVzID0gc3BlYy5heGVzIHx8IFtdKTtcbiAgICBzcGVjLmF4ZXMucHVzaC5hcHBseShzcGVjLmF4ZXMsIGF4aXMuZGVmcyhbJ2NvbCddLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykpO1xuICB9IGVsc2UgeyAvLyBkb2Vzbid0IGhhdmUgY29sXG4gICAgaWYgKGVuY29kaW5nLmhhcyhZKSkge1xuICAgICAgY2VsbEF4ZXMucHVzaC5hcHBseShjZWxsQXhlcywgYXhpcy5kZWZzKFsneSddLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGFzc3VtaW5nIGVxdWFsIGNlbGxXaWR0aCBoZXJlXG4gIC8vIFRPRE86IHN1cHBvcnQgaGV0ZXJvZ2Vub3VzIGNlbGxXaWR0aCAobWF5YmUgYnkgdXNpbmcgbXVsdGlwbGUgc2NhbGVzPylcbiAgc3BlYy5zY2FsZXMgPSAoc3BlYy5zY2FsZXMgfHwgW10pLmNvbmNhdChzY2FsZS5kZWZzKFxuICAgIHNjYWxlLm5hbWVzKGVudGVyKS5jb25jYXQoc2NhbGUubmFtZXMobWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZSkpLFxuICAgIGVuY29kaW5nLFxuICAgIGxheW91dCxcbiAgICBzdGF0cyxcbiAgICBzdHlsZSxcbiAgICBzb3J0aW5nLFxuICAgIHtzdGFjazogc3RhY2ssIGZhY2V0OiB0cnVlfVxuICApKTsgLy8gcm93L2NvbCBzY2FsZXMgKyBjZWxsIHNjYWxlc1xuXG4gIGlmIChjZWxsQXhlcy5sZW5ndGggPiAwKSB7XG4gICAgZ3JvdXAuYXhlcyA9IGNlbGxBeGVzO1xuICB9XG5cbiAgLy8gYWRkIGZhY2V0IHRyYW5zZm9ybVxuICB2YXIgdHJhbnMgPSAoZ3JvdXAuZnJvbS50cmFuc2Zvcm0gfHwgKGdyb3VwLmZyb20udHJhbnNmb3JtID0gW10pKTtcbiAgdHJhbnMudW5zaGlmdCh7dHlwZTogJ2ZhY2V0Jywga2V5czogZmFjZXRLZXlzfSk7XG5cbiAgcmV0dXJuIHNwZWM7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIGZpbHRlciA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnZhciBCSU5BUlkgPSB7XG4gICc+JzogIHRydWUsXG4gICc+PSc6IHRydWUsXG4gICc9JzogIHRydWUsXG4gICchPSc6IHRydWUsXG4gICc8JzogIHRydWUsXG4gICc8PSc6IHRydWVcbn07XG5cbmZpbHRlci5hZGRGaWx0ZXJzID0gZnVuY3Rpb24ocmF3VGFibGUsIGVuY29kaW5nKSB7XG4gIHZhciBmaWx0ZXJzID0gZW5jb2RpbmcuZmlsdGVyKCk7ICAvLyBhcHBseSBmaWx0ZXJzIHRvIHJhdyBkYXRhIGJlZm9yZSBhZ2dyZWdhdGlvblxuXG4gIGlmICghcmF3VGFibGUudHJhbnNmb3JtKVxuICAgIHJhd1RhYmxlLnRyYW5zZm9ybSA9IFtdO1xuXG4gIC8vIGFkZCBjdXN0b20gZmlsdGVyc1xuICBmb3IgKHZhciBpPTAsIGw9ZmlsdGVycy5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgdmFyIGZpbHRlciA9IGZpbHRlcnNbaV07XG5cbiAgICB2YXIgY29uZGl0aW9uID0gJyc7XG4gICAgdmFyIG9wZXJhdG9yID0gZmlsdGVyLm9wZXJhdG9yO1xuICAgIHZhciBvcGVyYW5kcyA9IGZpbHRlci5vcGVyYW5kcztcblxuICAgIHZhciBkID0gJ2QuJyArIChlbmNvZGluZy5fdmVnYTIgPyAnJyA6ICdkYXRhLicpO1xuXG4gICAgaWYgKEJJTkFSWVtvcGVyYXRvcl0pIHtcbiAgICAgIC8vIGV4cGVjdHMgYSBmaWVsZCBhbmQgYSB2YWx1ZVxuICAgICAgaWYgKG9wZXJhdG9yID09PSAnPScpIHtcbiAgICAgICAgb3BlcmF0b3IgPSAnPT0nO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3AxID0gb3BlcmFuZHNbMF07XG4gICAgICB2YXIgb3AyID0gb3BlcmFuZHNbMV07XG4gICAgICBjb25kaXRpb24gPSBkICsgb3AxICsgb3BlcmF0b3IgKyBvcDI7XG4gICAgfSBlbHNlIGlmIChvcGVyYXRvciA9PT0gJ25vdE51bGwnKSB7XG4gICAgICAvLyBleHBlY3RzIGEgbnVtYmVyIG9mIGZpZWxkc1xuICAgICAgZm9yICh2YXIgaj0wOyBqPG9wZXJhbmRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbmRpdGlvbiArPSBkICsgb3BlcmFuZHNbal0gKyAnIT09bnVsbCc7XG4gICAgICAgIGlmIChqIDwgb3BlcmFuZHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGNvbmRpdGlvbiArPSAnICYmICc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdVbnN1cHBvcnRlZCBvcGVyYXRvcjogJywgb3BlcmF0b3IpO1xuICAgIH1cblxuICAgIHJhd1RhYmxlLnRyYW5zZm9ybS5wdXNoKHtcbiAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgdGVzdDogY29uZGl0aW9uXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmF3VGFibGU7XG59O1xuXG4vLyByZW1vdmUgbGVzcyB0aGFuIDAgdmFsdWVzIGlmIHdlIHVzZSBsb2cgZnVuY3Rpb25cbmZpbHRlci5maWx0ZXJMZXNzVGhhblplcm8gPSBmdW5jdGlvbihkYXRhVGFibGUsIGVuY29kaW5nKSB7XG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICBpZiAoZW5jb2Rpbmcuc2NhbGUoZW5jVHlwZSkudHlwZSA9PT0gJ2xvZycpIHtcbiAgICAgIGRhdGFUYWJsZS50cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgICB0ZXN0OiAnZC4nICsgZW5jb2RpbmcuZmllbGRSZWYoZW5jVHlwZSkgKyAnPjAnXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRlZjogZ3JvdXBkZWZcbn07XG5cbmZ1bmN0aW9uIGdyb3VwZGVmKG5hbWUsIG9wdCkge1xuICBvcHQgPSBvcHQgfHwge307XG4gIHJldHVybiB7XG4gICAgX25hbWU6IG5hbWUgfHwgdW5kZWZpbmVkLFxuICAgIHR5cGU6ICdncm91cCcsXG4gICAgZnJvbTogb3B0LmZyb20sXG4gICAgcHJvcGVydGllczoge1xuICAgICAgZW50ZXI6IHtcbiAgICAgICAgeDogb3B0LnggfHwgdW5kZWZpbmVkLFxuICAgICAgICB5OiBvcHQueSB8fCB1bmRlZmluZWQsXG4gICAgICAgIHdpZHRoOiBvcHQud2lkdGggfHwge2dyb3VwOiAnd2lkdGgnfSxcbiAgICAgICAgaGVpZ2h0OiBvcHQuaGVpZ2h0IHx8IHtncm91cDogJ2hlaWdodCd9XG4gICAgICB9XG4gICAgfSxcbiAgICBzY2FsZXM6IG9wdC5zY2FsZXMgfHwgdW5kZWZpbmVkLFxuICAgIGF4ZXM6IG9wdC5heGVzIHx8IHVuZGVmaW5lZCxcbiAgICBtYXJrczogb3B0Lm1hcmtzIHx8IFtdXG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHNldHRlciA9IHV0aWwuc2V0dGVyLFxuICB0aW1lID0gcmVxdWlyZSgnLi90aW1lJyksXG4gIGQzX2Zvcm1hdCA9IHJlcXVpcmUoJ2QzLWZvcm1hdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZsbGF5b3V0O1xuXG5mdW5jdGlvbiB2bGxheW91dChlbmNvZGluZywgc3RhdHMpIHtcbiAgdmFyIGxheW91dCA9IGJveChlbmNvZGluZywgc3RhdHMpO1xuICBsYXlvdXQgPSBvZmZzZXQoZW5jb2RpbmcsIHN0YXRzLCBsYXlvdXQpO1xuICByZXR1cm4gbGF5b3V0O1xufVxuXG4vKlxuICBIQUNLIHRvIHNldCBjaGFydCBzaXplXG4gIE5PVEU6IHRoaXMgZmFpbHMgZm9yIHBsb3RzIGRyaXZlbiBieSBkZXJpdmVkIHZhbHVlcyAoZS5nLiwgYWdncmVnYXRlcylcbiAgT25lIHNvbHV0aW9uIGlzIHRvIHVwZGF0ZSBWZWdhIHRvIHN1cHBvcnQgYXV0by1zaXppbmdcbiAgSW4gdGhlIG1lYW50aW1lLCBhdXRvLXBhZGRpbmcgKG1vc3RseSkgZG9lcyB0aGUgdHJpY2tcbiAqL1xuZnVuY3Rpb24gYm94KGVuY29kaW5nLCBzdGF0cykge1xuICB2YXIgaGFzUm93ID0gZW5jb2RpbmcuaGFzKFJPVyksXG4gICAgICBoYXNDb2wgPSBlbmNvZGluZy5oYXMoQ09MKSxcbiAgICAgIGhhc1ggPSBlbmNvZGluZy5oYXMoWCksXG4gICAgICBoYXNZID0gZW5jb2RpbmcuaGFzKFkpLFxuICAgICAgbWFya3R5cGUgPSBlbmNvZGluZy5tYXJrdHlwZSgpO1xuXG4gIC8vIEZJWE1FL0hBQ0sgd2UgbmVlZCB0byB0YWtlIGZpbHRlciBpbnRvIGFjY291bnRcbiAgdmFyIHhDYXJkaW5hbGl0eSA9IGhhc1ggJiYgZW5jb2RpbmcuaXNEaW1lbnNpb24oWCkgPyBlbmNvZGluZy5jYXJkaW5hbGl0eShYLCBzdGF0cykgOiAxLFxuICAgIHlDYXJkaW5hbGl0eSA9IGhhc1kgJiYgZW5jb2RpbmcuaXNEaW1lbnNpb24oWSkgPyBlbmNvZGluZy5jYXJkaW5hbGl0eShZLCBzdGF0cykgOiAxO1xuXG4gIHZhciB1c2VTbWFsbEJhbmQgPSB4Q2FyZGluYWxpdHkgPiBlbmNvZGluZy5jb25maWcoJ2xhcmdlQmFuZE1heENhcmRpbmFsaXR5JykgfHxcbiAgICB5Q2FyZGluYWxpdHkgPiBlbmNvZGluZy5jb25maWcoJ2xhcmdlQmFuZE1heENhcmRpbmFsaXR5Jyk7XG5cbiAgdmFyIGNlbGxXaWR0aCwgY2VsbEhlaWdodCwgY2VsbFBhZGRpbmcgPSBlbmNvZGluZy5jb25maWcoJ2NlbGxQYWRkaW5nJyk7XG5cbiAgLy8gc2V0IGNlbGxXaWR0aFxuICBpZiAoaGFzWCkge1xuICAgIGlmIChlbmNvZGluZy5pc09yZGluYWxTY2FsZShYKSkge1xuICAgICAgLy8gZm9yIG9yZGluYWwsIGhhc0NvbCBvciBub3QgZG9lc24ndCBtYXR0ZXIgLS0gd2Ugc2NhbGUgYmFzZWQgb24gY2FyZGluYWxpdHlcbiAgICAgIGNlbGxXaWR0aCA9ICh4Q2FyZGluYWxpdHkgKyBlbmNvZGluZy5maWVsZChYKS5iYW5kLnBhZGRpbmcpICogZW5jb2RpbmcuYmFuZFNpemUoWCwgdXNlU21hbGxCYW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VsbFdpZHRoID0gaGFzQ29sIHx8IGhhc1JvdyA/IGVuY29kaW5nLmZpZWxkKENPTCkud2lkdGggOiAgZW5jb2RpbmcuY29uZmlnKCdzaW5nbGVXaWR0aCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAobWFya3R5cGUgPT09IFRFWFQpIHtcbiAgICAgIGNlbGxXaWR0aCA9IGVuY29kaW5nLmNvbmZpZygndGV4dENlbGxXaWR0aCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjZWxsV2lkdGggPSBlbmNvZGluZy5iYW5kU2l6ZShYKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZXQgY2VsbEhlaWdodFxuICBpZiAoaGFzWSkge1xuICAgIGlmIChlbmNvZGluZy5pc09yZGluYWxTY2FsZShZKSkge1xuICAgICAgLy8gZm9yIG9yZGluYWwsIGhhc0NvbCBvciBub3QgZG9lc24ndCBtYXR0ZXIgLS0gd2Ugc2NhbGUgYmFzZWQgb24gY2FyZGluYWxpdHlcbiAgICAgIGNlbGxIZWlnaHQgPSAoeUNhcmRpbmFsaXR5ICsgZW5jb2RpbmcuZmllbGQoWSkuYmFuZC5wYWRkaW5nKSAqIGVuY29kaW5nLmJhbmRTaXplKFksIHVzZVNtYWxsQmFuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNlbGxIZWlnaHQgPSBoYXNDb2wgfHwgaGFzUm93ID8gZW5jb2RpbmcuZmllbGQoUk9XKS5oZWlnaHQgOiAgZW5jb2RpbmcuY29uZmlnKCdzaW5nbGVIZWlnaHQnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY2VsbEhlaWdodCA9IGVuY29kaW5nLmJhbmRTaXplKFkpO1xuICB9XG5cbiAgLy8gQ2VsbCBiYW5kcyB1c2UgcmFuZ2VCYW5kcygpLiBUaGVyZSBhcmUgbi0xIHBhZGRpbmcuICBPdXRlcnBhZGRpbmcgPSAwIGZvciBjZWxsc1xuXG4gIHZhciB3aWR0aCA9IGNlbGxXaWR0aCwgaGVpZ2h0ID0gY2VsbEhlaWdodDtcbiAgaWYgKGhhc0NvbCkge1xuICAgIHZhciBjb2xDYXJkaW5hbGl0eSA9IGVuY29kaW5nLmNhcmRpbmFsaXR5KENPTCwgc3RhdHMpO1xuICAgIHdpZHRoID0gY2VsbFdpZHRoICogKCgxICsgY2VsbFBhZGRpbmcpICogKGNvbENhcmRpbmFsaXR5IC0gMSkgKyAxKTtcbiAgfVxuICBpZiAoaGFzUm93KSB7XG4gICAgdmFyIHJvd0NhcmRpbmFsaXR5ID0gIGVuY29kaW5nLmNhcmRpbmFsaXR5KFJPVywgc3RhdHMpO1xuICAgIGhlaWdodCA9IGNlbGxIZWlnaHQgKiAoKDEgKyBjZWxsUGFkZGluZykgKiAocm93Q2FyZGluYWxpdHkgLSAxKSArIDEpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSB3aG9sZSBjZWxsXG4gICAgY2VsbFdpZHRoOiBjZWxsV2lkdGgsXG4gICAgY2VsbEhlaWdodDogY2VsbEhlaWdodCxcbiAgICBjZWxsUGFkZGluZzogY2VsbFBhZGRpbmcsXG4gICAgLy8gd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgY2hhcnRcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgLy8gaW5mb3JtYXRpb24gYWJvdXQgeCBhbmQgeSwgc3VjaCBhcyBiYW5kIHNpemVcbiAgICB4OiB7dXNlU21hbGxCYW5kOiB1c2VTbWFsbEJhbmR9LFxuICAgIHk6IHt1c2VTbWFsbEJhbmQ6IHVzZVNtYWxsQmFuZH1cbiAgfTtcbn1cblxuXG4vLyBGSVhNRSBmaWVsZFN0YXRzLm1heCBpc24ndCBhbHdheXMgdGhlIGxvbmdlc3RcbmZ1bmN0aW9uIGdldE1heE51bWJlckxlbmd0aChlbmNvZGluZywgZXQsIGZpZWxkU3RhdHMpIHtcbiAgdmFyIGZvcm1hdCA9IGVuY29kaW5nLm51bWJlckZvcm1hdChldCwgZmllbGRTdGF0cyk7XG5cbiAgcmV0dXJuIGQzX2Zvcm1hdC5mb3JtYXQoZm9ybWF0KShmaWVsZFN0YXRzLm1heCkubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBnZXRNYXhMZW5ndGgoZW5jb2RpbmcsIHN0YXRzLCBldCkge1xuICB2YXIgZmllbGQgPSBlbmNvZGluZy5maWVsZChldCksXG4gICAgZmllbGRTdGF0cyA9IHN0YXRzW2ZpZWxkLm5hbWVdO1xuXG4gIGlmIChmaWVsZC5iaW4pIHtcbiAgICAvLyBUT0RPIG9uY2UgYmluIHN1cHBvcnQgcmFuZ2UsIG5lZWQgdG8gdXBkYXRlIHRoaXNcbiAgICByZXR1cm4gZ2V0TWF4TnVtYmVyTGVuZ3RoKGVuY29kaW5nLCBldCwgZmllbGRTdGF0cyk7XG4gIH0gaWYgKGVuY29kaW5nLmlzVHlwZShldCwgUSkpIHtcbiAgICByZXR1cm4gZ2V0TWF4TnVtYmVyTGVuZ3RoKGVuY29kaW5nLCBldCwgZmllbGRTdGF0cyk7XG4gIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXNUeXBlKGV0LCBUKSkge1xuICAgIHJldHVybiB0aW1lLm1heExlbmd0aChlbmNvZGluZy5maWVsZChldCkudGltZVVuaXQsIGVuY29kaW5nKTtcbiAgfSBlbHNlIGlmIChlbmNvZGluZy5pc1R5cGVzKGV0LCBbTiwgT10pKSB7XG4gICAgaWYoZmllbGRTdGF0cy50eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIGdldE1heE51bWJlckxlbmd0aChlbmNvZGluZywgZXQsIGZpZWxkU3RhdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTWF0aC5taW4oZmllbGRTdGF0cy5tYXgsIGVuY29kaW5nLmF4aXMoZXQpLm1heExhYmVsTGVuZ3RoIHx8IEluZmluaXR5KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gb2Zmc2V0KGVuY29kaW5nLCBzdGF0cywgbGF5b3V0KSB7XG4gIFtYLCBZXS5mb3JFYWNoKGZ1bmN0aW9uIChldCkge1xuICAgIC8vIFRPRE8oa2FuaXR3KTogSnVsIDE5LCAyMDE1IC0gY3JlYXRlIGEgc2V0IG9mIHZpc3VhbCB0ZXN0IGZvciBleHRyYU9mZnNldFxuICAgIHZhciBleHRyYU9mZnNldCA9IGV0ID09PSBYID8gMjAgOiAyMixcbiAgICAgIG1heExlbmd0aDtcbiAgICBpZiAoZW5jb2RpbmcuaXNEaW1lbnNpb24oZXQpIHx8IGVuY29kaW5nLmlzVHlwZShldCwgVCkpIHtcbiAgICAgIG1heExlbmd0aCA9IGdldE1heExlbmd0aChlbmNvZGluZywgc3RhdHMsIGV0KTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgLy8gVE9ETyBvbmNlIHdlIGhhdmUgIzUxMiAoYWxsb3cgdXNpbmcgaW5mZXJyZWQgdHlwZSlcbiAgICAgIC8vIE5lZWQgdG8gYWRqdXN0IGNvbmRpdGlvbiBoZXJlLlxuICAgICAgZW5jb2RpbmcuaXNUeXBlKGV0LCBRKSB8fFxuICAgICAgZW5jb2RpbmcuYWdncmVnYXRlKGV0KSA9PT0gJ2NvdW50J1xuICAgICkge1xuICAgICAgaWYgKFxuICAgICAgICBldD09PVlcbiAgICAgICAgLy8gfHwgKGV0PT09WCAmJiBmYWxzZSlcbiAgICAgICAgLy8gRklYTUUgZGV0ZXJtaW5lIHdoZW4gWCB3b3VsZCByb3RhdGUsIGJ1dCBzaG91bGQgbW92ZSB0aGlzIHRvIGF4aXMuanMgZmlyc3QgIzUwNlxuICAgICAgKSB7XG4gICAgICAgIG1heExlbmd0aCA9IGdldE1heExlbmd0aChlbmNvZGluZywgc3RhdHMsIGV0KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbm90aGluZ1xuICAgIH1cblxuICAgIGlmIChtYXhMZW5ndGgpIHtcbiAgICAgIHNldHRlcihsYXlvdXQsW2V0LCAnYXhpc1RpdGxlT2Zmc2V0J10sIGVuY29kaW5nLmNvbmZpZygnY2hhcmFjdGVyV2lkdGgnKSAqICBtYXhMZW5ndGggKyBleHRyYU9mZnNldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlmIG5vIG1heCBsZW5ndGggKG5vIHJvdGF0aW9uIGNhc2UpLCB1c2UgbWF4TGVuZ3RoID0gM1xuICAgICAgc2V0dGVyKGxheW91dCxbZXQsICdheGlzVGl0bGVPZmZzZXQnXSwgZW5jb2RpbmcuY29uZmlnKCdjaGFyYWN0ZXJXaWR0aCcpICogMyArIGV4dHJhT2Zmc2V0KTtcbiAgICB9XG5cbiAgfSk7XG4gIHJldHVybiBsYXlvdXQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKTtcblxudmFyIGxlZ2VuZCA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmxlZ2VuZC5kZWZzID0gZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgdmFyIGRlZnMgPSBbXTtcbiAgLy8gVE9ETzogc3VwcG9ydCBhbHBoYVxuXG4gIGlmIChlbmNvZGluZy5oYXMoQ09MT1IpICYmIGVuY29kaW5nLmZpZWxkKENPTE9SKS5sZWdlbmQpIHtcbiAgICBkZWZzLnB1c2gobGVnZW5kLmRlZihDT0xPUiwgZW5jb2RpbmcsIHtcbiAgICAgIGZpbGw6IENPTE9SLFxuICAgICAgb3JpZW50OiAncmlnaHQnXG4gICAgfSkpO1xuICB9XG5cbiAgaWYgKGVuY29kaW5nLmhhcyhTSVpFKSAmJiBlbmNvZGluZy5maWVsZChTSVpFKS5sZWdlbmQpIHtcbiAgICBkZWZzLnB1c2gobGVnZW5kLmRlZihTSVpFLCBlbmNvZGluZywge1xuICAgICAgc2l6ZTogU0laRSxcbiAgICAgIG9yaWVudDogZGVmcy5sZW5ndGggPT09IDEgPyAnbGVmdCcgOiAncmlnaHQnXG4gICAgfSkpO1xuICB9XG5cbiAgaWYgKGVuY29kaW5nLmhhcyhTSEFQRSkgJiYgZW5jb2RpbmcuZmllbGQoU0hBUEUpLmxlZ2VuZCkge1xuICAgIGlmIChkZWZzLmxlbmd0aCA9PT0gMikge1xuICAgICAgLy8gVE9ETzogZml4IHRoaXNcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1ZlZ2EtbGl0ZSBjdXJyZW50bHkgb25seSBzdXBwb3J0cyB0d28gbGVnZW5kcycpO1xuICAgICAgcmV0dXJuIGRlZnM7XG4gICAgfVxuICAgIGRlZnMucHVzaChsZWdlbmQuZGVmKFNIQVBFLCBlbmNvZGluZywge1xuICAgICAgc2hhcGU6IFNIQVBFLFxuICAgICAgb3JpZW50OiBkZWZzLmxlbmd0aCA9PT0gMSA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICB9KSk7XG4gIH1cblxuICByZXR1cm4gZGVmcztcbn07XG5cbmxlZ2VuZC5kZWYgPSBmdW5jdGlvbihuYW1lLCBlbmNvZGluZywgcHJvcHMpIHtcbiAgdmFyIGRlZiA9IHByb3BzLFxuICAgIHRpbWVVbml0ID0gZW5jb2RpbmcuZmllbGQobmFtZSkudGltZVVuaXQ7XG5cbiAgZGVmLnRpdGxlID0gZW5jb2RpbmcuZmllbGRUaXRsZShuYW1lKTtcblxuICBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFQpICYmXG4gICAgdGltZVVuaXQgJiZcbiAgICB0aW1lLmhhc1NjYWxlKHRpbWVVbml0KVxuICApIHtcbiAgICB2YXIgcHJvcGVydGllcyA9IGRlZi5wcm9wZXJ0aWVzID0gZGVmLnByb3BlcnRpZXMgfHwge30sXG4gICAgICBsYWJlbHMgPSBwcm9wZXJ0aWVzLmxhYmVscyA9IHByb3BlcnRpZXMubGFiZWxzIHx8IHt9LFxuICAgICAgdGV4dCA9IGxhYmVscy50ZXh0ID0gbGFiZWxzLnRleHQgfHwge307XG5cbiAgICB0ZXh0LnNjYWxlID0gJ3RpbWUtJysgdGltZVVuaXQ7XG4gIH1cblxuICByZXR1cm4gZGVmO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgbWFya3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5tYXJrcy5kZWYgPSBmdW5jdGlvbihtYXJrLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgc3RhdHMpIHtcbiAgdmFyIGRlZnMgPSBbXTtcblxuICAvLyB0byBhZGQgYSBiYWNrZ3JvdW5kIHRvIHRleHQsIHdlIG5lZWQgdG8gYWRkIGl0IGJlZm9yZSB0aGUgdGV4dFxuICBpZiAoZW5jb2RpbmcubWFya3R5cGUoKSA9PT0gVEVYVCAmJiBlbmNvZGluZy5oYXMoQ09MT1IpKSB7XG4gICAgdmFyIGJnID0ge1xuICAgICAgeDoge3ZhbHVlOiAwfSxcbiAgICAgIHk6IHt2YWx1ZTogMH0sXG4gICAgICB4Mjoge3ZhbHVlOiBsYXlvdXQuY2VsbFdpZHRofSxcbiAgICAgIHkyOiB7dmFsdWU6IGxheW91dC5jZWxsSGVpZ2h0fSxcbiAgICAgIGZpbGw6IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlbmNvZGluZy5maWVsZFJlZihDT0xPUil9XG4gICAgfTtcbiAgICBkZWZzLnB1c2goe1xuICAgICAgdHlwZTogJ3JlY3QnLFxuICAgICAgZnJvbToge2RhdGE6IFRBQkxFfSxcbiAgICAgIHByb3BlcnRpZXM6IHtlbnRlcjogYmcsIHVwZGF0ZTogYmd9XG4gICAgfSk7XG4gIH1cblxuICAvLyBhZGQgdGhlIG1hcmsgZGVmIGZvciB0aGUgbWFpbiB0aGluZ1xuICB2YXIgcCA9IG1hcmsucHJvcChlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgc3RhdHMpO1xuICBkZWZzLnB1c2goe1xuICAgIHR5cGU6IG1hcmsudHlwZSxcbiAgICBmcm9tOiB7ZGF0YTogVEFCTEV9LFxuICAgIHByb3BlcnRpZXM6IHtlbnRlcjogcCwgdXBkYXRlOiBwfVxuICB9KTtcblxuICByZXR1cm4gZGVmcztcbn07XG5cbm1hcmtzLmJhciA9IHtcbiAgdHlwZTogJ3JlY3QnLFxuICBzdGFjazogdHJ1ZSxcbiAgcHJvcDogYmFyX3Byb3BzLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBzaXplOiAxLCBjb2xvcjogMX1cbn07XG5cbm1hcmtzLmxpbmUgPSB7XG4gIHR5cGU6ICdsaW5lJyxcbiAgbGluZTogdHJ1ZSxcbiAgcHJvcDogbGluZV9wcm9wcyxcbiAgcmVxdWlyZWRFbmNvZGluZzogWyd4JywgJ3knXSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgY29sb3I6IDEsIGRldGFpbDoxfVxufTtcblxubWFya3MuYXJlYSA9IHtcbiAgdHlwZTogJ2FyZWEnLFxuICBzdGFjazogdHJ1ZSxcbiAgbGluZTogdHJ1ZSxcbiAgcmVxdWlyZWRFbmNvZGluZzogWyd4JywgJ3knXSxcbiAgcHJvcDogYXJlYV9wcm9wcyxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgY29sb3I6IDF9XG59O1xuXG5tYXJrcy50aWNrID0ge1xuICB0eXBlOiAncmVjdCcsXG4gIHByb3A6IHRpY2tfcHJvcHMsXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OiAxLCBjb2w6IDEsIHg6IDEsIHk6IDEsIGNvbG9yOiAxLCBkZXRhaWw6IDF9XG59O1xuXG5tYXJrcy5jaXJjbGUgPSB7XG4gIHR5cGU6ICdzeW1ib2wnLFxuICBwcm9wOiBmaWxsZWRfcG9pbnRfcHJvcHMoJ2NpcmNsZScpLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBzaXplOiAxLCBjb2xvcjogMSwgZGV0YWlsOiAxfVxufTtcblxubWFya3Muc3F1YXJlID0ge1xuICB0eXBlOiAnc3ltYm9sJyxcbiAgcHJvcDogZmlsbGVkX3BvaW50X3Byb3BzKCdzcXVhcmUnKSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IG1hcmtzLmNpcmNsZS5zdXBwb3J0ZWRFbmNvZGluZ1xufTtcblxubWFya3MucG9pbnQgPSB7XG4gIHR5cGU6ICdzeW1ib2wnLFxuICBwcm9wOiBwb2ludF9wcm9wcyxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgc2l6ZTogMSwgY29sb3I6IDEsIHNoYXBlOiAxLCBkZXRhaWw6IDF9XG59O1xuXG5tYXJrcy50ZXh0ID0ge1xuICB0eXBlOiAndGV4dCcsXG4gIHByb3A6IHRleHRfcHJvcHMsXG4gIHJlcXVpcmVkRW5jb2Rpbmc6IFsndGV4dCddLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCBzaXplOiAxLCBjb2xvcjogMSwgdGV4dDogMX1cbn07XG5cbmZ1bmN0aW9uIGJhcl9wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcblxuICB2YXIgcCA9IHt9O1xuXG4gIC8vIHgncyBhbmQgd2lkdGhcbiAgaWYgKGUuaXNNZWFzdXJlKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gICAgaWYgKCFlLmhhcyhZKSB8fCBlLmlzRGltZW5zaW9uKFkpKSB7XG4gICAgICBwLngyID0ge3ZhbHVlOiAwfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGUuaGFzKFgpKSB7IC8vIGlzIG9yZGluYWxcbiAgICAgICBwLnhjID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gICAgfSBlbHNlIHtcbiAgICAgICBwLnggPSB7dmFsdWU6IDAsIG9mZnNldDogZS5jb25maWcoJ3NpbmdsZUJhck9mZnNldCcpfTtcbiAgICB9XG4gIH1cblxuICAvLyB3aWR0aFxuICBpZiAoIXAueDIpIHtcbiAgICBpZiAoIWUuaGFzKFgpIHx8IGUuaXNPcmRpbmFsU2NhbGUoWCkpIHsgLy8gbm8gWCBvciBYIGlzIG9yZGluYWxcbiAgICAgIGlmIChlLmhhcyhTSVpFKSkge1xuICAgICAgICBwLndpZHRoID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZFJlZihTSVpFKX07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwLndpZHRoID0ge1xuICAgICAgICAgIHZhbHVlOiBlLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCksXG4gICAgICAgICAgb2Zmc2V0OiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIFggaXMgUXVhbnQgb3IgVGltZSBTY2FsZVxuICAgICAgcC53aWR0aCA9IHt2YWx1ZTogMn07XG4gICAgfVxuICB9XG5cbiAgLy8geSdzICYgaGVpZ2h0XG4gIGlmIChlLmlzTWVhc3VyZShZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICAgIHAueTIgPSB7Z3JvdXA6ICdoZWlnaHQnfTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoZS5oYXMoWSkpIHsgLy8gaXMgb3JkaW5hbFxuICAgICAgcC55YyA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnkyID0ge2dyb3VwOiAnaGVpZ2h0Jywgb2Zmc2V0OiAtZS5jb25maWcoJ3NpbmdsZUJhck9mZnNldCcpfTtcbiAgICB9XG5cbiAgICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICAgIHAuaGVpZ2h0ID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZFJlZihTSVpFKX07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAuaGVpZ2h0ID0ge1xuICAgICAgICB2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpLFxuICAgICAgICBvZmZzZXQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8vIGZpbGxcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkUmVmKENPTE9SKX07XG4gIH0gZWxzZSB7XG4gICAgcC5maWxsID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gIH1cblxuICAvLyBvcGFjaXR5XG4gIHZhciBvcGFjaXR5ID0gZS5maWVsZChDT0xPUikub3BhY2l0eTtcbiAgaWYgKG9wYWNpdHkpIHAub3BhY2l0eSA9IHt2YWx1ZTogb3BhY2l0eX07XG5cbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIHBvaW50X3Byb3BzKGUsIGxheW91dCwgc3R5bGUpIHtcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmhhcyhYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGRSZWYoWCl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgIHAueCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpIC8gMn07XG4gIH1cblxuICAvLyB5XG4gIGlmIChlLmhhcyhZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgIHAueSA9IHt2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMn07XG4gIH1cblxuICAvLyBzaXplXG4gIGlmIChlLmhhcyhTSVpFKSkge1xuICAgIHAuc2l6ZSA9IHtzY2FsZTogU0laRSwgZmllbGQ6IGUuZmllbGRSZWYoU0laRSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhTSVpFKSkge1xuICAgIHAuc2l6ZSA9IHt2YWx1ZTogZS52YWx1ZShTSVpFKX07XG4gIH1cblxuICAvLyBzaGFwZVxuICBpZiAoZS5oYXMoU0hBUEUpKSB7XG4gICAgcC5zaGFwZSA9IHtzY2FsZTogU0hBUEUsIGZpZWxkOiBlLmZpZWxkUmVmKFNIQVBFKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFNIQVBFKSkge1xuICAgIHAuc2hhcGUgPSB7dmFsdWU6IGUudmFsdWUoU0hBUEUpfTtcbiAgfVxuXG4gIC8vIHN0cm9rZVxuICBpZiAoZS5maWVsZChTSEFQRSkuZmlsbGVkKSB7XG4gICAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgICAgcC5maWxsID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGRSZWYoQ09MT1IpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICAgIHAuZmlsbCA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLnN0cm9rZSA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkUmVmKENPTE9SKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLnN0cm9rZSA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICAgIH1cbiAgICBwLnN0cm9rZVdpZHRoID0ge3ZhbHVlOiBlLmNvbmZpZygnc3Ryb2tlV2lkdGgnKX07XG4gIH1cblxuICAvLyBvcGFjaXR5XG4gIHZhciBvcGFjaXR5ID0gZS5maWVsZChDT0xPUikub3BhY2l0eSAgfHwgc3R5bGUub3BhY2l0eTtcbiAgaWYgKG9wYWNpdHkpIHAub3BhY2l0eSA9IHt2YWx1ZTogb3BhY2l0eX07XG5cbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIGxpbmVfcHJvcHMoZSxsYXlvdXQsIHN0eWxlKSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmhhcyhYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGRSZWYoWCl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgIHAueCA9IHt2YWx1ZTogMH07XG4gIH1cblxuICAvLyB5XG4gIGlmIChlLmhhcyhZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgIHAueSA9IHtncm91cDogJ2hlaWdodCd9O1xuICB9XG5cbiAgLy8gc3Ryb2tlXG4gIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICBwLnN0cm9rZSA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkUmVmKENPTE9SKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgIHAuc3Ryb2tlID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gIH1cblxuICB2YXIgb3BhY2l0eSA9IGUuZmllbGQoQ09MT1IpLm9wYWNpdHk7XG4gIGlmIChvcGFjaXR5KSBwLm9wYWNpdHkgPSB7dmFsdWU6IG9wYWNpdHl9O1xuXG4gIHAuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IGUuY29uZmlnKCdzdHJva2VXaWR0aCcpfTtcblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gYXJlYV9wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmlzTWVhc3VyZShYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGRSZWYoWCl9O1xuICAgIGlmIChlLmlzRGltZW5zaW9uKFkpKSB7XG4gICAgICBwLngyID0ge3NjYWxlOiBYLCB2YWx1ZTogMH07XG4gICAgICBwLm9yaWVudCA9IHt2YWx1ZTogJ2hvcml6b250YWwnfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkUmVmKFgpfTtcbiAgfSBlbHNlIHtcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5pc01lYXN1cmUoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkUmVmKFkpfTtcbiAgICBwLnkyID0ge3NjYWxlOiBZLCB2YWx1ZTogMH07XG4gIH0gZWxzZSBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkUmVmKFkpfTtcbiAgfSBlbHNlIHtcbiAgICBwLnkgPSB7Z3JvdXA6ICdoZWlnaHQnfTtcbiAgfVxuXG4gIC8vIGZpbGxcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkUmVmKENPTE9SKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICB9XG5cbiAgdmFyIG9wYWNpdHkgPSBlLmZpZWxkKENPTE9SKS5vcGFjaXR5O1xuICBpZiAob3BhY2l0eSkgcC5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gdGlja19wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkUmVmKFgpfTtcbiAgICBpZiAoZS5pc0RpbWVuc2lvbihYKSkge1xuICAgICAgcC54Lm9mZnNldCA9IC1lLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCkgLyAzO1xuICAgIH1cbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkUmVmKFkpfTtcbiAgICBpZiAoZS5pc0RpbWVuc2lvbihZKSkge1xuICAgICAgcC55Lm9mZnNldCA9IC1lLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCkgLyAzO1xuICAgIH1cbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8gd2lkdGhcbiAgaWYgKCFlLmhhcyhYKSB8fCBlLmlzRGltZW5zaW9uKFgpKSB7XG4gICAgcC53aWR0aCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShYLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMS41fTtcbiAgfSBlbHNlIHtcbiAgICBwLndpZHRoID0ge3ZhbHVlOiAxfTtcbiAgfVxuXG4gIC8vIGhlaWdodFxuICBpZiAoIWUuaGFzKFkpIHx8IGUuaXNEaW1lbnNpb24oWSkpIHtcbiAgICBwLmhlaWdodCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMS41fTtcbiAgfSBlbHNlIHtcbiAgICBwLmhlaWdodCA9IHt2YWx1ZTogMX07XG4gIH1cblxuICAvLyBmaWxsXG4gIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZFJlZihDT0xPUil9O1xuICB9IGVsc2Uge1xuICAgIHAuZmlsbCA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICB9XG5cbiAgdmFyIG9wYWNpdHkgPSBlLmZpZWxkKENPTE9SKS5vcGFjaXR5ICB8fCBzdHlsZS5vcGFjaXR5O1xuICBpZihvcGFjaXR5KSBwLm9wYWNpdHkgPSB7dmFsdWU6IG9wYWNpdHl9O1xuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBmaWxsZWRfcG9pbnRfcHJvcHMoc2hhcGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUsIGxheW91dCwgc3R5bGUpIHtcbiAgICB2YXIgcCA9IHt9O1xuXG4gICAgLy8geFxuICAgIGlmIChlLmhhcyhYKSkge1xuICAgICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICAgIHAueCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpIC8gMn07XG4gICAgfVxuXG4gICAgLy8geVxuICAgIGlmIChlLmhhcyhZKSkge1xuICAgICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZFJlZihZKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICAgIHAueSA9IHt2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMn07XG4gICAgfVxuXG4gICAgLy8gc2l6ZVxuICAgIGlmIChlLmhhcyhTSVpFKSkge1xuICAgICAgcC5zaXplID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZFJlZihTSVpFKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICAgIHAuc2l6ZSA9IHt2YWx1ZTogZS52YWx1ZShTSVpFKX07XG4gICAgfVxuXG4gICAgLy8gc2hhcGVcbiAgICBwLnNoYXBlID0ge3ZhbHVlOiBzaGFwZX07XG5cbiAgICAvLyBmaWxsXG4gICAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgICAgcC5maWxsID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGRSZWYoQ09MT1IpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICAgIHAuZmlsbCA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICAgIH1cblxuICAgIHZhciBvcGFjaXR5ID0gZS5maWVsZChDT0xPUikub3BhY2l0eSAgfHwgc3R5bGUub3BhY2l0eTtcbiAgICBpZihvcGFjaXR5KSBwLm9wYWNpdHkgPSB7dmFsdWU6IG9wYWNpdHl9O1xuXG4gICAgcmV0dXJuIHA7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRleHRfcHJvcHMoZSwgbGF5b3V0LCBzdHlsZSwgc3RhdHMpIHtcbiAgdmFyIHAgPSB7fSxcbiAgICBmaWVsZCA9IGUuZmllbGQoVEVYVCk7XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkUmVmKFgpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBpZiAoZS5oYXMoVEVYVCkgJiYgZS5pc1R5cGUoVEVYVCwgUSkpIHtcbiAgICAgIHAueCA9IHt2YWx1ZTogbGF5b3V0LmNlbGxXaWR0aC01fTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC54ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgICB9XG4gIH1cblxuICAvLyB5XG4gIGlmIChlLmhhcyhZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgIHAueSA9IHt2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMn07XG4gIH1cblxuICAvLyBzaXplXG4gIGlmIChlLmhhcyhTSVpFKSkge1xuICAgIHAuZm9udFNpemUgPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkUmVmKFNJWkUpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoU0laRSkpIHtcbiAgICBwLmZvbnRTaXplID0ge3ZhbHVlOiBmaWVsZC5mb250LnNpemV9O1xuICB9XG5cbiAgLy8gZmlsbFxuICAvLyBjb2xvciBzaG91bGQgYmUgc2V0IHRvIGJhY2tncm91bmRcbiAgcC5maWxsID0ge3ZhbHVlOiBmaWVsZC50ZXh0LmNvbG9yfTtcblxuICB2YXIgb3BhY2l0eSA9IGUuZmllbGQoQ09MT1IpLm9wYWNpdHkgIHx8IHN0eWxlLm9wYWNpdHk7XG4gIGlmKG9wYWNpdHkpIHAub3BhY2l0eSA9IHt2YWx1ZTogb3BhY2l0eX07XG5cbiAgLy8gdGV4dFxuICBpZiAoZS5oYXMoVEVYVCkpIHtcbiAgICBpZiAoZS5pc1R5cGUoVEVYVCwgUSkpIHtcbiAgICAgIHZhciBmaWVsZFN0YXRzID0gc3RhdHNbZS5maWVsZE5hbWUobmFtZSldLFxuICAgICAgICBudW1iZXJGb3JtYXQgPSBmaWVsZC5mb3JtYXQgfHwgZS5udW1iZXJGb3JtYXQoZmllbGRTdGF0cyk7XG5cbiAgICAgIHAudGV4dCA9IHt0ZW1wbGF0ZTogJ3t7JyArIGUuZmllbGRSZWYoVEVYVCkgKyAnIHwgbnVtYmVyOlxcJycgK1xuICAgICAgICBudW1iZXJGb3JtYXQgKydcXCd9fSd9O1xuICAgICAgcC5hbGlnbiA9IHt2YWx1ZTogZmllbGQuYWxpZ259O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnRleHQgPSB7ZmllbGQ6IGUuZmllbGRSZWYoVEVYVCl9O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwLnRleHQgPSB7dmFsdWU6IGZpZWxkLnBsYWNlaG9sZGVyfTtcbiAgfVxuXG4gIHAuZm9udCA9IHt2YWx1ZTogZmllbGQuZm9udC5mYW1pbHl9O1xuICBwLmZvbnRXZWlnaHQgPSB7dmFsdWU6IGZpZWxkLmZvbnQud2VpZ2h0fTtcbiAgcC5mb250U3R5bGUgPSB7dmFsdWU6IGZpZWxkLmZvbnQuc3R5bGV9O1xuICBwLmJhc2VsaW5lID0ge3ZhbHVlOiBmaWVsZC5iYXNlbGluZX07XG5cbiAgcmV0dXJuIHA7XG59XG4iLCIndXNlIHN0cmljdCc7XG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgdGltZSA9IHJlcXVpcmUoJy4vdGltZScpLFxuICBjb2xvcmJyZXdlciA9IHJlcXVpcmUoJ2NvbG9yYnJld2VyJyksXG4gIGludGVycG9sYXRlTGFiID0gcmVxdWlyZSgnZDMtY29sb3InKS5pbnRlcnBvbGF0ZUxhYixcbiAgc2NoZW1hID0gcmVxdWlyZSgnLi4vc2NoZW1hL3NjaGVtYScpO1xuXG52YXIgc2NhbGUgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5zY2FsZS5uYW1lcyA9IGZ1bmN0aW9uKHByb3BzKSB7XG4gIHJldHVybiB1dGlsLmtleXModXRpbC5rZXlzKHByb3BzKS5yZWR1Y2UoZnVuY3Rpb24oYSwgeCkge1xuICAgIGlmIChwcm9wc1t4XSAmJiBwcm9wc1t4XS5zY2FsZSkgYVtwcm9wc1t4XS5zY2FsZV0gPSAxO1xuICAgIHJldHVybiBhO1xuICB9LCB7fSkpO1xufTtcblxuc2NhbGUuZGVmcyA9IGZ1bmN0aW9uKG5hbWVzLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cywgc3R5bGUsIHNvcnRpbmcsIG9wdCkge1xuICBvcHQgPSBvcHQgfHwge307XG5cbiAgcmV0dXJuIG5hbWVzLnJlZHVjZShmdW5jdGlvbihhLCBuYW1lKSB7XG4gICAgdmFyIHMgPSB7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgdHlwZTogc2NhbGUudHlwZShuYW1lLCBlbmNvZGluZyksXG4gICAgICBkb21haW46IHNjYWxlLmRvbWFpbihuYW1lLCBlbmNvZGluZywgc3RhdHMsIHNvcnRpbmcsIG9wdClcbiAgICB9O1xuXG4gICAgcy5zb3J0ID0gc2NhbGUuc29ydChzLCBlbmNvZGluZywgbmFtZSkgfHwgdW5kZWZpbmVkO1xuXG4gICAgc2NhbGUucmFuZ2UocywgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMsIG9wdCk7XG5cbiAgICByZXR1cm4gKGEucHVzaChzKSwgYSk7XG4gIH0sIFtdKTtcbn07XG5cbnNjYWxlLnNvcnQgPSBmdW5jdGlvbihzLCBlbmNvZGluZywgbmFtZSkge1xuICByZXR1cm4gcy50eXBlID09PSAnb3JkaW5hbCcgJiYgKFxuICAgICEhZW5jb2RpbmcuYmluKG5hbWUpIHx8XG4gICAgZW5jb2Rpbmcuc29ydChuYW1lKS5sZW5ndGggPT09IDBcbiAgKTtcbn07XG5cbnNjYWxlLnR5cGUgPSBmdW5jdGlvbihuYW1lLCBlbmNvZGluZykge1xuXG4gIHN3aXRjaCAoZW5jb2RpbmcudHlwZShuYW1lKSkge1xuICAgIGNhc2UgTjogLy9mYWxsIHRocm91Z2hcbiAgICBjYXNlIE86IHJldHVybiAnb3JkaW5hbCc7XG4gICAgY2FzZSBUOlxuICAgICAgdmFyIHRpbWVVbml0ID0gZW5jb2RpbmcuZmllbGQobmFtZSkudGltZVVuaXQ7XG4gICAgICByZXR1cm4gdGltZVVuaXQgPyB0aW1lLnNjYWxlLnR5cGUodGltZVVuaXQsIG5hbWUpIDogJ3RpbWUnO1xuICAgIGNhc2UgUTpcbiAgICAgIGlmIChlbmNvZGluZy5iaW4obmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIG5hbWUgPT09IENPTE9SID8gJ2xpbmVhcicgOiAnb3JkaW5hbCc7XG4gICAgICB9XG4gICAgICByZXR1cm4gZW5jb2Rpbmcuc2NhbGUobmFtZSkudHlwZTtcbiAgfVxufTtcblxuc2NhbGUuZG9tYWluID0gZnVuY3Rpb24gKG5hbWUsIGVuY29kaW5nLCBzdGF0cywgc29ydGluZywgb3B0KSB7XG4gIHZhciBmaWVsZCA9IGVuY29kaW5nLmZpZWxkKG5hbWUpO1xuXG4gIGlmIChlbmNvZGluZy5pc1R5cGUobmFtZSwgVCkpIHtcbiAgICB2YXIgcmFuZ2UgPSB0aW1lLnNjYWxlLmRvbWFpbihmaWVsZC50aW1lVW5pdCwgbmFtZSk7XG4gICAgaWYocmFuZ2UpIHJldHVybiByYW5nZTtcbiAgfVxuXG4gIGlmIChmaWVsZC5iaW4pIHtcbiAgICAvLyBUT0RPKGthbml0dyk6IHRoaXMgbXVzdCBiZSBjaGFuZ2VkIGluIHZnMlxuICAgIHZhciBmaWVsZFN0YXQgPSBzdGF0c1tmaWVsZC5uYW1lXSxcbiAgICAgIGJpbnMgPSB1dGlsLmdldGJpbnMoZmllbGRTdGF0LCBmaWVsZC5iaW4ubWF4YmlucyB8fCBzY2hlbWEuTUFYQklOU19ERUZBVUxUKSxcbiAgICAgIG51bWJpbnMgPSAoYmlucy5zdG9wIC0gYmlucy5zdGFydCkgLyBiaW5zLnN0ZXA7XG4gICAgcmV0dXJuIHV0aWwucmFuZ2UobnVtYmlucykubWFwKGZ1bmN0aW9uKGkpIHtcbiAgICAgIHJldHVybiBiaW5zLnN0YXJ0ICsgYmlucy5zdGVwICogaTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChuYW1lID09IG9wdC5zdGFjaykge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBTVEFDS0VELFxuICAgICAgZmllbGQ6IGVuY29kaW5nLmZpZWxkUmVmKG5hbWUsIHtcbiAgICAgICAgZGF0YTogIWVuY29kaW5nLl92ZWdhMixcbiAgICAgICAgcHJlZm46IChvcHQuZmFjZXQgPyAnbWF4XycgOiAnJykgKyAnc3VtXydcbiAgICAgIH0pXG4gICAgfTtcbiAgfVxuICB2YXIgYWdncmVnYXRlID0gZW5jb2RpbmcuYWdncmVnYXRlKG5hbWUpLFxuICAgIHRpbWVVbml0ID0gZmllbGQudGltZVVuaXQsXG4gICAgc2NhbGVVc2VSYXdEb21haW4gPSBlbmNvZGluZy5zY2FsZShuYW1lKS51c2VSYXdEb21haW4sXG4gICAgdXNlUmF3RG9tYWluID0gc2NhbGVVc2VSYXdEb21haW4gIT09IHVuZGVmaW5lZCA/XG4gICAgICBzY2FsZVVzZVJhd0RvbWFpbiA6IGVuY29kaW5nLmNvbmZpZygndXNlUmF3RG9tYWluJyksXG4gICAgbm90Q291bnRPclN1bSA9ICFhZ2dyZWdhdGUgfHwgKGFnZ3JlZ2F0ZSAhPT0nY291bnQnICYmIGFnZ3JlZ2F0ZSAhPT0gJ3N1bScpO1xuXG4gIGlmICggdXNlUmF3RG9tYWluICYmIG5vdENvdW50T3JTdW0gJiYgKFxuICAgICAgLy8gUSBhbHdheXMgdXNlcyBub24tb3JkaW5hbCBzY2FsZSBleGNlcHQgd2hlbiBpdCdzIGJpbm5lZCBhbmQgdGh1cyB1c2VzIG9yZGluYWwgc2NhbGUuXG4gICAgICAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFEpICYmICFmaWVsZC5iaW4pIHx8XG4gICAgICAvLyBUIHVzZXMgbm9uLW9yZGluYWwgc2NhbGUgd2hlbiB0aGVyZSdzIG5vIHVuaXQgb3Igd2hlbiB0aGUgdW5pdCBpcyBub3Qgb3JkaW5hbC5cbiAgICAgIChlbmNvZGluZy5pc1R5cGUobmFtZSwgVCkgJiYgKCF0aW1lVW5pdCB8fCAhdGltZS5pc09yZGluYWxGbih0aW1lVW5pdCkpKVxuICAgIClcbiAgKSB7XG4gICAgcmV0dXJuIHtkYXRhOiBSQVcsIGZpZWxkOiBlbmNvZGluZy5maWVsZFJlZihuYW1lLCB7bm9mbjogIXRpbWVVbml0fSl9O1xuICB9XG5cbiAgcmV0dXJuIHtkYXRhOiBzb3J0aW5nLmdldERhdGFzZXQobmFtZSksIGZpZWxkOiBlbmNvZGluZy5maWVsZFJlZihuYW1lKX07XG59O1xuXG5cbnNjYWxlLnJhbmdlID0gZnVuY3Rpb24gKHMsIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSB7XG4gIHZhciBzcGVjID0gZW5jb2Rpbmcuc2NhbGUocy5uYW1lKSxcbiAgICBmaWVsZCA9IGVuY29kaW5nLmZpZWxkKHMubmFtZSksXG4gICAgdGltZVVuaXQgPSBmaWVsZC50aW1lVW5pdDtcblxuICBzd2l0Y2ggKHMubmFtZSkge1xuICAgIGNhc2UgWDpcbiAgICAgIHMucmFuZ2UgPSBsYXlvdXQuY2VsbFdpZHRoID8gWzAsIGxheW91dC5jZWxsV2lkdGhdIDogJ3dpZHRoJztcbiAgICAgIGlmIChzLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICBzLmJhbmRXaWR0aCA9IGVuY29kaW5nLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZW5jb2RpbmcuaXNUeXBlKHMubmFtZSxUKSAmJiB0aW1lVW5pdCA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgcy56ZXJvID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcy56ZXJvID0gc3BlYy56ZXJvID09PSB1bmRlZmluZWQgPyB0cnVlIDogc3BlYy56ZXJvO1xuICAgICAgICB9XG5cbiAgICAgICAgcy5yZXZlcnNlID0gc3BlYy5yZXZlcnNlO1xuICAgICAgfVxuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBpZiAocy50eXBlID09PSAndGltZScpIHtcbiAgICAgICAgcy5uaWNlID0gdGltZVVuaXQgfHwgZW5jb2RpbmcuY29uZmlnKCd0aW1lU2NhbGVOaWNlJyk7XG4gICAgICB9ZWxzZSB7XG4gICAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIFk6XG4gICAgICBpZiAocy50eXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgICAgcy5yYW5nZSA9IGxheW91dC5jZWxsSGVpZ2h0ID9cbiAgICAgICAgICAoZmllbGQuYmluID8gW2xheW91dC5jZWxsSGVpZ2h0LCAwXSA6IFswLCBsYXlvdXQuY2VsbEhlaWdodF0pIDpcbiAgICAgICAgICAnaGVpZ2h0JztcbiAgICAgICAgcy5iYW5kV2lkdGggPSBlbmNvZGluZy5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcy5yYW5nZSA9IGxheW91dC5jZWxsSGVpZ2h0ID8gW2xheW91dC5jZWxsSGVpZ2h0LCAwXSA6ICdoZWlnaHQnO1xuICAgICAgICBpZiAoZW5jb2RpbmcuaXNUeXBlKHMubmFtZSxUKSAmJiB0aW1lVW5pdCA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgcy56ZXJvID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcy56ZXJvID0gc3BlYy56ZXJvID09PSB1bmRlZmluZWQgPyB0cnVlIDogc3BlYy56ZXJvO1xuICAgICAgICB9XG5cbiAgICAgICAgcy5yZXZlcnNlID0gc3BlYy5yZXZlcnNlO1xuICAgICAgfVxuXG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcblxuICAgICAgaWYgKHMudHlwZSA9PT0gJ3RpbWUnKSB7XG4gICAgICAgIHMubmljZSA9IHRpbWVVbml0IHx8IGVuY29kaW5nLmNvbmZpZygndGltZVNjYWxlTmljZScpO1xuICAgICAgfWVsc2Uge1xuICAgICAgICBzLm5pY2UgPSB0cnVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBST1c6IC8vIHN1cHBvcnQgb25seSBvcmRpbmFsXG4gICAgICBzLmJhbmRXaWR0aCA9IGxheW91dC5jZWxsSGVpZ2h0O1xuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBzLm5pY2UgPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBDT0w6IC8vIHN1cHBvcnQgb25seSBvcmRpbmFsXG4gICAgICBzLmJhbmRXaWR0aCA9IGxheW91dC5jZWxsV2lkdGg7XG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcbiAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFNJWkU6XG4gICAgICBpZiAoZW5jb2RpbmcuaXMoJ2JhcicpKSB7XG4gICAgICAgIC8vIEZJWE1FIHRoaXMgaXMgZGVmaW5pdGVseSBpbmNvcnJlY3RcbiAgICAgICAgLy8gYnV0IGxldCdzIGZpeCBpdCBsYXRlciBzaW5jZSBiYXIgc2l6ZSBpcyBhIGJhZCBlbmNvZGluZyBhbnl3YXlcbiAgICAgICAgcy5yYW5nZSA9IFszLCBNYXRoLm1heChlbmNvZGluZy5iYW5kU2l6ZShYKSwgZW5jb2RpbmcuYmFuZFNpemUoWSkpXTtcbiAgICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXMoVEVYVCkpIHtcbiAgICAgICAgcy5yYW5nZSA9IFs4LCA0MF07XG4gICAgICB9IGVsc2UgeyAvL3BvaW50XG4gICAgICAgIHZhciBiYW5kU2l6ZSA9IE1hdGgubWluKGVuY29kaW5nLmJhbmRTaXplKFgpLCBlbmNvZGluZy5iYW5kU2l6ZShZKSkgLSAxO1xuICAgICAgICBzLnJhbmdlID0gWzEwLCAwLjggKiBiYW5kU2l6ZSpiYW5kU2l6ZV07XG4gICAgICB9XG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcbiAgICAgIHMuemVybyA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBTSEFQRTpcbiAgICAgIHMucmFuZ2UgPSAnc2hhcGVzJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQ09MT1I6XG4gICAgICBzLnJhbmdlID0gc2NhbGUuY29sb3IocywgZW5jb2RpbmcsIHN0YXRzKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcgbmFtZTogJysgcy5uYW1lKTtcbiAgfVxuXG4gIHN3aXRjaCAocy5uYW1lKSB7XG4gICAgY2FzZSBST1c6XG4gICAgY2FzZSBDT0w6XG4gICAgICBzLnBhZGRpbmcgPSBlbmNvZGluZy5jb25maWcoJ2NlbGxQYWRkaW5nJyk7XG4gICAgICBzLm91dGVyUGFkZGluZyA9IDA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFg6XG4gICAgY2FzZSBZOlxuICAgICAgaWYgKHMudHlwZSA9PT0gJ29yZGluYWwnKSB7IC8vJiYgIXMuYmFuZFdpZHRoXG4gICAgICAgIHMucG9pbnRzID0gdHJ1ZTtcbiAgICAgICAgcy5wYWRkaW5nID0gZW5jb2RpbmcuZmllbGQocy5uYW1lKS5iYW5kLnBhZGRpbmc7XG4gICAgICB9XG4gIH1cbn07XG5cbnNjYWxlLmNvbG9yID0gZnVuY3Rpb24ocywgZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHZhciBjb2xvclNjYWxlID0gZW5jb2Rpbmcuc2NhbGUoQ09MT1IpLFxuICAgIHJhbmdlID0gY29sb3JTY2FsZS5yYW5nZSxcbiAgICBjYXJkaW5hbGl0eSA9IGVuY29kaW5nLmNhcmRpbmFsaXR5KENPTE9SLCBzdGF0cyksXG4gICAgdHlwZSA9IGVuY29kaW5nLnR5cGUoQ09MT1IpO1xuXG4gIGlmIChyYW5nZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIG9yZGluYWxQYWxldHRlID0gY29sb3JTY2FsZS5vcmRpbmFsUGFsZXR0ZTtcbiAgICBpZiAocy50eXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgIGlmICh0eXBlID09PSBOKSB7XG4gICAgICAgIC8vIHVzZSBjYXRlZ29yaWNhbCBjb2xvciBzY2FsZVxuICAgICAgICBpZiAoY2FyZGluYWxpdHkgPD0gMTApIHtcbiAgICAgICAgICByYW5nZSA9IGNvbG9yU2NhbGUuYzEwcGFsZXR0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByYW5nZSA9IGNvbG9yU2NhbGUuYzIwcGFsZXR0ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNhcmRpbmFsaXR5IDw9IDIpIHtcbiAgICAgICAgICByYW5nZSA9IFtjb2xvcmJyZXdlcltvcmRpbmFsUGFsZXR0ZV1bM11bMF0sIGNvbG9yYnJld2VyW29yZGluYWxQYWxldHRlXVszXVsyXV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmFuZ2UgPSBvcmRpbmFsUGFsZXR0ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vdGltZSBvciBxdWFudGl0YXRpdmVcbiAgICAgIHZhciBwYWxldHRlID0gY29sb3JicmV3ZXJbb3JkaW5hbFBhbGV0dGVdWzldO1xuICAgICAgcmFuZ2UgPSBbcGFsZXR0ZVswXSwgcGFsZXR0ZVs4XV07XG4gICAgICBzLnplcm8gPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNjYWxlLmNvbG9yLnBhbGV0dGUocmFuZ2UsIGNhcmRpbmFsaXR5LCB0eXBlKTtcbn07XG5cbnNjYWxlLmNvbG9yLnBhbGV0dGUgPSBmdW5jdGlvbihyYW5nZSwgY2FyZGluYWxpdHksIHR5cGUpIHtcbiAgc3dpdGNoIChyYW5nZSkge1xuICAgIGNhc2UgJ2NhdGVnb3J5MTBrJzpcbiAgICAgIC8vIHRhYmxlYXUncyBjYXRlZ29yeSAxMCwgb3JkZXJlZCBieSBwZXJjZXB0dWFsIGtlcm5lbCBzdHVkeSByZXN1bHRzXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdXdkYXRhL3BlcmNlcHR1YWwta2VybmVsc1xuICAgICAgcmV0dXJuIFsnIzJjYTAyYycsICcjZTM3N2MyJywgJyM3ZjdmN2YnLCAnIzE3YmVjZicsICcjOGM1NjRiJywgJyNkNjI3MjgnLCAnI2JjYmQyMicsICcjOTQ2N2JkJywgJyNmZjdmMGUnLCAnIzFmNzdiNCddO1xuXG4gICAgLy8gZDMvdGFibGVhdSBjYXRlZ29yeTEwLzIwLzIwYi8yMGNcbiAgICBjYXNlICdjYXRlZ29yeTEwJzpcbiAgICAgIHJldHVybiBbJyMxZjc3YjQnLCAnI2ZmN2YwZScsICcjMmNhMDJjJywgJyNkNjI3MjgnLCAnIzk0NjdiZCcsICcjOGM1NjRiJywgJyNlMzc3YzInLCAnIzdmN2Y3ZicsICcjYmNiZDIyJywgJyMxN2JlY2YnXTtcblxuICAgIGNhc2UgJ2NhdGVnb3J5MjAnOlxuICAgICAgcmV0dXJuIFsnIzFmNzdiNCcsICcjYWVjN2U4JywgJyNmZjdmMGUnLCAnI2ZmYmI3OCcsICcjMmNhMDJjJywgJyM5OGRmOGEnLCAnI2Q2MjcyOCcsICcjZmY5ODk2JywgJyM5NDY3YmQnLCAnI2M1YjBkNScsICcjOGM1NjRiJywgJyNjNDljOTQnLCAnI2UzNzdjMicsICcjZjdiNmQyJywgJyM3ZjdmN2YnLCAnI2M3YzdjNycsICcjYmNiZDIyJywgJyNkYmRiOGQnLCAnIzE3YmVjZicsICcjOWVkYWU1J107XG5cbiAgICBjYXNlICdjYXRlZ29yeTIwYic6XG4gICAgICByZXR1cm4gWycjMzkzYjc5JywgJyM1MjU0YTMnLCAnIzZiNmVjZicsICcjOWM5ZWRlJywgJyM2Mzc5MzknLCAnIzhjYTI1MicsICcjYjVjZjZiJywgJyNjZWRiOWMnLCAnIzhjNmQzMScsICcjYmQ5ZTM5JywgJyNlN2JhNTInLCAnI2U3Y2I5NCcsICcjODQzYzM5JywgJyNhZDQ5NGEnLCAnI2Q2NjE2YicsICcjZTc5NjljJywgJyM3YjQxNzMnLCAnI2E1NTE5NCcsICcjY2U2ZGJkJywgJyNkZTllZDYnXTtcblxuICAgIGNhc2UgJ2NhdGVnb3J5MjBjJzpcbiAgICAgIHJldHVybiBbJyMzMTgyYmQnLCAnIzZiYWVkNicsICcjOWVjYWUxJywgJyNjNmRiZWYnLCAnI2U2NTUwZCcsICcjZmQ4ZDNjJywgJyNmZGFlNmInLCAnI2ZkZDBhMicsICcjMzFhMzU0JywgJyM3NGM0NzYnLCAnI2ExZDk5YicsICcjYzdlOWMwJywgJyM3NTZiYjEnLCAnIzllOWFjOCcsICcjYmNiZGRjJywgJyNkYWRhZWInLCAnIzYzNjM2MycsICcjOTY5Njk2JywgJyNiZGJkYmQnLCAnI2Q5ZDlkOSddO1xuICB9XG5cbiAgaWYgKHJhbmdlIGluIGNvbG9yYnJld2VyKSB7XG4gICAgdmFyIHBhbGV0dGUgPSBjb2xvcmJyZXdlcltyYW5nZV0sXG4gICAgICBwcyA9IDU7XG5cbiAgICAvLyBpZiBjYXJkaW5hbGl0eSBwcmUtZGVmaW5lZCwgdXNlIGl0LlxuICAgIGlmIChjYXJkaW5hbGl0eSBpbiBwYWxldHRlKSByZXR1cm4gcGFsZXR0ZVtjYXJkaW5hbGl0eV07XG5cbiAgICAvLyBpZiBub3QsIHVzZSB0aGUgaGlnaGVzdCBjYXJkaW5hbGl0eSBvbmUgZm9yIG5vbWluYWxcbiAgICBpZiAodHlwZSA9PT0gTikge1xuICAgICAgcmV0dXJuIHBhbGV0dGVbTWF0aC5tYXguYXBwbHkobnVsbCwgdXRpbC5rZXlzKHBhbGV0dGUpKV07XG4gICAgfVxuXG4gICAgLy8gb3RoZXJ3aXNlLCBpbnRlcnBvbGF0ZVxuICAgIHJldHVybiBzY2FsZS5jb2xvci5pbnRlcnBvbGF0ZShwYWxldHRlW3BzXVswXSwgcGFsZXR0ZVtwc11bcHMtMV0sIGNhcmRpbmFsaXR5KTtcbiAgfVxuXG4gIHJldHVybiByYW5nZTtcbn07XG5cbnNjYWxlLmNvbG9yLmludGVycG9sYXRlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQsIGNhcmRpbmFsaXR5KSB7XG4gIHZhciBpbnRlcnBvbGF0b3IgPSBpbnRlcnBvbGF0ZUxhYihzdGFydCwgZW5kKTtcbiAgcmV0dXJuIHV0aWwucmFuZ2UoY2FyZGluYWxpdHkpLm1hcChmdW5jdGlvbihpKSB7IHJldHVybiBpbnRlcnBvbGF0b3IoaSoxLjAvKGNhcmRpbmFsaXR5LTEpKTsgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciB2bGZpZWxkID0gcmVxdWlyZSgnLi4vZmllbGQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBhZGRTb3J0VHJhbnNmb3JtcztcblxuLy8gYWRkcyBuZXcgdHJhbnNmb3JtcyB0aGF0IHByb2R1Y2Ugc29ydGVkIGZpZWxkc1xuZnVuY3Rpb24gYWRkU29ydFRyYW5zZm9ybXMoZGF0YSwgZW5jb2RpbmcsIHN0YXRzLCBvcHQpIHtcbiAgLy8ganNoaW50IHVudXNlZDpmYWxzZVxuXG4gIHZhciBkYXRhc2V0TWFwcGluZyA9IHt9O1xuICB2YXIgY291bnRlciA9IDA7XG5cbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuICAgIHZhciBzb3J0QnkgPSBlbmNvZGluZy5zb3J0KGVuY1R5cGUsIHN0YXRzKTtcbiAgICBpZiAoc29ydEJ5Lmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBmaWVsZHMgPSBzb3J0QnkubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBvcDogZC5hZ2dyZWdhdGUsXG4gICAgICAgICAgZmllbGQ6IHZsZmllbGQuZmllbGRSZWYoZCwge25vZm46IHRydWUsIGRhdGE6ICFlbmNvZGluZy5fdmVnYTJ9KVxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBieUNsYXVzZSA9IHNvcnRCeS5tYXAoZnVuY3Rpb24oZCkge1xuICAgICAgICB2YXIgcmV2ZXJzZSA9IChkLnJldmVyc2UgPyAnLScgOiAnJyk7XG4gICAgICAgIHJldHVybiByZXZlcnNlICsgdmxmaWVsZC5maWVsZFJlZihkLCB7ZGF0YTogIWVuY29kaW5nLl92ZWdhMn0pO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBkYXRhTmFtZSA9ICdzb3J0ZWQnICsgY291bnRlcisrO1xuXG4gICAgICB2YXIgdHJhbnNmb3JtcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFsgZW5jb2RpbmcuZmllbGRSZWYoZW5jVHlwZSkgXSxcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ3NvcnQnLFxuICAgICAgICAgIGJ5OiBieUNsYXVzZVxuICAgICAgICB9XG4gICAgICBdO1xuXG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBuYW1lOiBkYXRhTmFtZSxcbiAgICAgICAgc291cmNlOiBSQVcsXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNmb3Jtc1xuICAgICAgfSk7XG5cbiAgICAgIGRhdGFzZXRNYXBwaW5nW2VuY1R5cGVdID0gZGF0YU5hbWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIGdldERhdGFzZXQ6IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgICAgIHZhciBkYXRhID0gZGF0YXNldE1hcHBpbmdbZW5jVHlwZV07XG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgcmV0dXJuIFRBQkxFO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICB9O1xufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyICBtYXJrcyA9IHJlcXVpcmUoJy4vbWFya3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja2luZztcblxuZnVuY3Rpb24gc3RhY2tpbmcoZGF0YSwgZW5jb2RpbmcsIG1kZWYsIGZhY2V0cykge1xuICBpZiAoIW1hcmtzW2VuY29kaW5nLm1hcmt0eXBlKCldLnN0YWNrKSByZXR1cm4gZmFsc2U7XG5cbiAgLy8gVE9ETzogYWRkIHx8IGVuY29kaW5nLmhhcyhMT0QpIGhlcmUgb25jZSBMT0QgaXMgaW1wbGVtZW50ZWRcbiAgaWYgKCFlbmNvZGluZy5oYXMoQ09MT1IpKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIGRpbT1udWxsLCB2YWw9bnVsbCwgaWR4ID1udWxsLFxuICAgIGlzWE1lYXN1cmUgPSBlbmNvZGluZy5pc01lYXN1cmUoWCksXG4gICAgaXNZTWVhc3VyZSA9IGVuY29kaW5nLmlzTWVhc3VyZShZKTtcblxuICBpZiAoaXNYTWVhc3VyZSAmJiAhaXNZTWVhc3VyZSkge1xuICAgIGRpbSA9IFk7XG4gICAgdmFsID0gWDtcbiAgICBpZHggPSAwO1xuICB9IGVsc2UgaWYgKGlzWU1lYXN1cmUgJiYgIWlzWE1lYXN1cmUpIHtcbiAgICBkaW0gPSBYO1xuICAgIHZhbCA9IFk7XG4gICAgaWR4ID0gMTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDsgLy8gbm8gc3RhY2sgZW5jb2RpbmdcbiAgfVxuXG4gIC8vIGFkZCB0cmFuc2Zvcm0gdG8gY29tcHV0ZSBzdW1zIGZvciBzY2FsZVxuICB2YXIgc3RhY2tlZCA9IHtcbiAgICBuYW1lOiBTVEFDS0VELFxuICAgIHNvdXJjZTogVEFCTEUsXG4gICAgdHJhbnNmb3JtOiBbe1xuICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICBncm91cGJ5OiBbZW5jb2RpbmcuZmllbGRSZWYoZGltKV0uY29uY2F0KGZhY2V0cyksIC8vIGRpbSBhbmQgb3RoZXIgZmFjZXRzXG4gICAgICBmaWVsZHM6IFt7b3A6ICdzdW0nLCBmaWVsZDogZW5jb2RpbmcuZmllbGRSZWYodmFsKX1dIC8vIFRPRE8gY2hlY2sgaWYgZmllbGQgd2l0aCBhZ2dyZWdhdGUgaXMgY29ycmVjdD9cbiAgICB9XVxuICB9O1xuXG4gIGlmIChmYWNldHMgJiYgZmFjZXRzLmxlbmd0aCA+IDApIHtcbiAgICBzdGFja2VkLnRyYW5zZm9ybS5wdXNoKHsgLy9jYWxjdWxhdGUgbWF4IGZvciBlYWNoIGZhY2V0XG4gICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgIGdyb3VwYnk6IGZhY2V0cyxcbiAgICAgIGZpZWxkczogW3tcbiAgICAgICAgb3A6ICdtYXgnLFxuICAgICAgICBmaWVsZDogZW5jb2RpbmcuZmllbGROYW1lKHZhbCwge2ZuOiAnc3VtJ30pXG4gICAgICB9XVxuICAgIH0pO1xuICB9XG5cbiAgZGF0YS5wdXNoKHN0YWNrZWQpO1xuXG4gIC8vIGFkZCBzdGFjayB0cmFuc2Zvcm0gdG8gbWFya1xuICBtZGVmLmZyb20udHJhbnNmb3JtID0gW3tcbiAgICB0eXBlOiAnc3RhY2snLFxuICAgIHBvaW50OiBlbmNvZGluZy5maWVsZFJlZihkaW0pLFxuICAgIGhlaWdodDogZW5jb2RpbmcuZmllbGRSZWYodmFsKSxcbiAgICBvdXRwdXQ6IHt5MTogdmFsLCB5MDogdmFsICsgJzInfVxuICB9XTtcblxuICAvLyBUT0RPOiBUaGlzIGlzIHN1cGVyIGhhY2staXNoIC0tIGNvbnNvbGlkYXRlIGludG8gbW9kdWxhciBtYXJrIHByb3BlcnRpZXM/XG4gIG1kZWYucHJvcGVydGllcy51cGRhdGVbdmFsXSA9IG1kZWYucHJvcGVydGllcy5lbnRlclt2YWxdID0ge3NjYWxlOiB2YWwsIGZpZWxkOiB2YWx9O1xuICBtZGVmLnByb3BlcnRpZXMudXBkYXRlW3ZhbCArICcyJ10gPSBtZGVmLnByb3BlcnRpZXMuZW50ZXJbdmFsICsgJzInXSA9IHtzY2FsZTogdmFsLCBmaWVsZDogdmFsICsgJzInfTtcblxuICByZXR1cm4gdmFsOyAvL3JldHVybiBzdGFjayBlbmNvZGluZ1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciB2bGZpZWxkID0gcmVxdWlyZSgnLi4vZmllbGQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbmNvZGluZywgc3RhdHMpIHtcbiAgcmV0dXJuIHtcbiAgICBvcGFjaXR5OiBlc3RpbWF0ZU9wYWNpdHkoZW5jb2RpbmcsIHN0YXRzKSxcbiAgfTtcbn07XG5cbmZ1bmN0aW9uIGVzdGltYXRlT3BhY2l0eShlbmNvZGluZyxzdGF0cykge1xuICBpZiAoIXN0YXRzKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICB2YXIgbnVtUG9pbnRzID0gMDtcblxuICBpZiAoZW5jb2RpbmcuaXNBZ2dyZWdhdGUoKSkgeyAvLyBhZ2dyZWdhdGUgcGxvdFxuICAgIG51bVBvaW50cyA9IDE7XG5cbiAgICAvLyAgZ2V0IG51bWJlciBvZiBwb2ludHMgaW4gZWFjaCBcImNlbGxcIlxuICAgIC8vICBieSBjYWxjdWxhdGluZyBwcm9kdWN0IG9mIGNhcmRpbmFsaXR5XG4gICAgLy8gIGZvciBlYWNoIG5vbiBmYWNldGluZyBhbmQgbm9uLW9yZGluYWwgWCAvIFkgZmllbGRzXG4gICAgLy8gIG5vdGUgdGhhdCBvcmRpbmFsIHgseSBhcmUgbm90IGluY2x1ZGUgc2luY2Ugd2UgY2FuXG4gICAgLy8gIGNvbnNpZGVyIHRoYXQgb3JkaW5hbCB4IGFyZSBzdWJkaXZpZGluZyB0aGUgY2VsbCBpbnRvIHN1YmNlbGxzIGFueXdheVxuICAgIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcblxuICAgICAgaWYgKGVuY1R5cGUgIT09IFJPVyAmJiBlbmNUeXBlICE9PSBDT0wgJiZcbiAgICAgICAgICAhKChlbmNUeXBlID09PSBYIHx8IGVuY1R5cGUgPT09IFkpICYmXG4gICAgICAgICAgdmxmaWVsZC5pc09yZGluYWxTY2FsZShmaWVsZCkpXG4gICAgICAgICkge1xuICAgICAgICBudW1Qb2ludHMgKj0gZW5jb2RpbmcuY2FyZGluYWxpdHkoZW5jVHlwZSwgc3RhdHMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH0gZWxzZSB7IC8vIHJhdyBwbG90XG5cbiAgICAvLyBUT0RPOiBlcnJvciBoYW5kbGluZ1xuICAgIGlmICghc3RhdHNbJyonXSlcbiAgICAgIHJldHVybiAxO1xuXG4gICAgbnVtUG9pbnRzID0gc3RhdHNbJyonXS5tYXg7ICAvLyBjb3VudFxuXG4gICAgLy8gc21hbGwgbXVsdGlwbGVzIGRpdmlkZSBudW1iZXIgb2YgcG9pbnRzXG4gICAgdmFyIG51bU11bHRpcGxlcyA9IDE7XG4gICAgaWYgKGVuY29kaW5nLmhhcyhST1cpKSB7XG4gICAgICBudW1NdWx0aXBsZXMgKj0gZW5jb2RpbmcuY2FyZGluYWxpdHkoUk9XLCBzdGF0cyk7XG4gICAgfVxuICAgIGlmIChlbmNvZGluZy5oYXMoQ09MKSkge1xuICAgICAgbnVtTXVsdGlwbGVzICo9IGVuY29kaW5nLmNhcmRpbmFsaXR5KENPTCwgc3RhdHMpO1xuICAgIH1cbiAgICBudW1Qb2ludHMgLz0gbnVtTXVsdGlwbGVzO1xuICB9XG5cbiAgdmFyIG9wYWNpdHkgPSAwO1xuICBpZiAobnVtUG9pbnRzIDw9IDI1KSB7XG4gICAgb3BhY2l0eSA9IDE7XG4gIH0gZWxzZSBpZiAobnVtUG9pbnRzIDwgMjAwKSB7XG4gICAgb3BhY2l0eSA9IDAuODtcbiAgfSBlbHNlIGlmIChudW1Qb2ludHMgPCAxMDAwIHx8IGVuY29kaW5nLmlzKCd0aWNrJykpIHtcbiAgICBvcGFjaXR5ID0gMC43O1xuICB9IGVsc2Uge1xuICAgIG9wYWNpdHkgPSAwLjM7XG4gIH1cblxuICByZXR1cm4gb3BhY2l0eTtcbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciBncm91cGRlZiA9IHJlcXVpcmUoJy4vZ3JvdXAnKS5kZWY7XG5cbm1vZHVsZS5leHBvcnRzID0gc3ViZmFjZXRpbmc7XG5cbmZ1bmN0aW9uIHN1YmZhY2V0aW5nKGdyb3VwLCBtZGVmLCBkZXRhaWxzLCBzdGFjaywgZW5jb2RpbmcpIHtcbiAgdmFyIG0gPSBncm91cC5tYXJrcyxcbiAgICBnID0gZ3JvdXBkZWYoJ3N1YmZhY2V0Jywge21hcmtzOiBtfSk7XG5cbiAgZ3JvdXAubWFya3MgPSBbZ107XG4gIGcuZnJvbSA9IG1kZWYuZnJvbTtcbiAgZGVsZXRlIG1kZWYuZnJvbTtcblxuICAvL1RPRE8gdGVzdCBMT0QgLS0gd2Ugc2hvdWxkIHN1cHBvcnQgc3RhY2sgLyBsaW5lIHdpdGhvdXQgY29sb3IgKExPRCkgZmllbGRcbiAgdmFyIHRyYW5zID0gKGcuZnJvbS50cmFuc2Zvcm0gfHwgKGcuZnJvbS50cmFuc2Zvcm0gPSBbXSkpO1xuICB0cmFucy51bnNoaWZ0KHt0eXBlOiAnZmFjZXQnLCBrZXlzOiBkZXRhaWxzfSk7XG5cbiAgaWYgKHN0YWNrICYmIGVuY29kaW5nLmhhcyhDT0xPUikpIHtcbiAgICB0cmFucy51bnNoaWZ0KHt0eXBlOiAnc29ydCcsIGJ5OiBlbmNvZGluZy5maWVsZFJlZihDT0xPUil9KTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciBncm91cGRlZiA9IHJlcXVpcmUoJy4vZ3JvdXAnKS5kZWYsXG4gIHZsZmllbGQgPSByZXF1aXJlKCcuLi9maWVsZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShlbmNvZGluZywgbGF5b3V0LCBzdGF0cykge1xuICAvLyBqc2hpbnQgdW51c2VkOmZhbHNlXG5cbiAgdmFyIGRhdGEgPSB7bmFtZTogUkFXLCBmb3JtYXQ6IHt9fSxcbiAgICB0YWJsZSA9IHtuYW1lOiBUQUJMRSwgc291cmNlOiBSQVd9LFxuICAgIGRhdGFVcmwgPSBlbmNvZGluZy5kYXRhKCd1cmwnKSxcbiAgICBkYXRhVHlwZSA9IGVuY29kaW5nLmRhdGEoJ2Zvcm1hdFR5cGUnKSxcbiAgICB2YWx1ZXMgPSBlbmNvZGluZy5kYXRhKCd2YWx1ZXMnKTtcblxuICBpZiAoZW5jb2RpbmcuaGFzVmFsdWVzKCkpIHtcbiAgICBkYXRhLnZhbHVlcyA9IHZhbHVlcztcbiAgfSBlbHNlIHtcbiAgICBkYXRhLnVybCA9IGRhdGFVcmw7XG4gICAgZGF0YS5mb3JtYXQudHlwZSA9IGRhdGFUeXBlO1xuICB9XG5cbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuICAgIHZhciBuYW1lO1xuICAgIGlmIChmaWVsZC50eXBlID09IFQpIHtcbiAgICAgIGRhdGEuZm9ybWF0LnBhcnNlID0gZGF0YS5mb3JtYXQucGFyc2UgfHwge307XG4gICAgICBkYXRhLmZvcm1hdC5wYXJzZVtmaWVsZC5uYW1lXSA9ICdkYXRlJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT0gUSkge1xuICAgICAgZGF0YS5mb3JtYXQucGFyc2UgPSBkYXRhLmZvcm1hdC5wYXJzZSB8fCB7fTtcbiAgICAgIGlmICh2bGZpZWxkLmlzQ291bnQoZmllbGQpKSB7XG4gICAgICAgIG5hbWUgPSAnY291bnQnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmFtZSA9IGZpZWxkLm5hbWU7XG4gICAgICB9XG4gICAgICBkYXRhLmZvcm1hdC5wYXJzZVtuYW1lXSA9ICdudW1iZXInO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogbGF5b3V0LndpZHRoLFxuICAgIGhlaWdodDogbGF5b3V0LmhlaWdodCxcbiAgICBwYWRkaW5nOiAnYXV0bycsXG4gICAgZGF0YTogW2RhdGEsIHRhYmxlXSxcbiAgICBtYXJrczogW2dyb3VwZGVmKCdjZWxsJywge1xuICAgICAgd2lkdGg6IGxheW91dC5jZWxsV2lkdGggPyB7dmFsdWU6IGxheW91dC5jZWxsV2lkdGh9IDogdW5kZWZpbmVkLFxuICAgICAgaGVpZ2h0OiBsYXlvdXQuY2VsbEhlaWdodCA/IHt2YWx1ZTogbGF5b3V0LmNlbGxIZWlnaHR9IDogdW5kZWZpbmVkXG4gICAgfSldXG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICBkM190aW1lX2Zvcm1hdCA9IHJlcXVpcmUoJ2QzLXRpbWUtZm9ybWF0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGltZTtcblxudmFyIExPTkdfREFURSA9IG5ldyBEYXRlKDIwMTQsIDgsIDE3KTtcblxuZnVuY3Rpb24gdGltZShzcGVjLCBlbmNvZGluZykgeyAvLyBGSVhNRSByZWZhY3RvciB0byByZWR1Y2Ugc2lkZSBlZmZlY3QgIzI3NlxuICAvLyBqc2hpbnQgdW51c2VkOmZhbHNlXG4gIHZhciB0aW1lRmllbGRzID0ge30sIHRpbWVVbml0cyA9IHt9O1xuXG4gIC8vIGZpbmQgdW5pcXVlIGZvcm11bGEgdHJhbnNmb3JtYXRpb24gYW5kIGJpbiBmdW5jdGlvblxuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT09IFQgJiYgZmllbGQudGltZVVuaXQpIHtcbiAgICAgIHRpbWVGaWVsZHNbZW5jb2RpbmcuZmllbGRSZWYoZW5jVHlwZSldID0ge1xuICAgICAgICBmaWVsZDogZmllbGQsXG4gICAgICAgIGVuY1R5cGU6IGVuY1R5cGVcbiAgICAgIH07XG4gICAgICB0aW1lVW5pdHNbZmllbGQudGltZVVuaXRdID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIGFkZCBmb3JtdWxhIHRyYW5zZm9ybVxuICB2YXIgZGF0YSA9IHNwZWMuZGF0YVswXSxcbiAgICB0cmFuc2Zvcm0gPSBkYXRhLnRyYW5zZm9ybSA9IGRhdGEudHJhbnNmb3JtIHx8IFtdO1xuXG4gIGZvciAodmFyIGYgaW4gdGltZUZpZWxkcykge1xuICAgIHZhciB0ZiA9IHRpbWVGaWVsZHNbZl07XG4gICAgdGltZS50cmFuc2Zvcm0odHJhbnNmb3JtLCBlbmNvZGluZywgdGYuZW5jVHlwZSwgdGYuZmllbGQpO1xuICB9XG5cbiAgLy8gYWRkIHNjYWxlc1xuICB2YXIgc2NhbGVzID0gc3BlYy5zY2FsZXMgPSBzcGVjLnNjYWxlcyB8fCBbXTtcbiAgZm9yICh2YXIgdGltZVVuaXQgaW4gdGltZVVuaXRzKSB7XG4gICAgdmFyIHNjYWxlID0gdGltZS5zY2FsZS5kZWYodGltZVVuaXQsIGVuY29kaW5nKTtcbiAgICBpZiAoc2NhbGUpIHNjYWxlcy5wdXNoKHNjYWxlKTtcbiAgfVxuICByZXR1cm4gc3BlYztcbn1cblxudGltZS5jYXJkaW5hbGl0eSA9IGZ1bmN0aW9uKGZpZWxkLCBzdGF0cywgZmlsdGVyTnVsbCwgdHlwZSkge1xuICB2YXIgdGltZVVuaXQgPSBmaWVsZC50aW1lVW5pdDtcbiAgc3dpdGNoICh0aW1lVW5pdCkge1xuICAgIGNhc2UgJ3NlY29uZHMnOiByZXR1cm4gNjA7XG4gICAgY2FzZSAnbWludXRlcyc6IHJldHVybiA2MDtcbiAgICBjYXNlICdob3Vycyc6IHJldHVybiAyNDtcbiAgICBjYXNlICdkYXknOiByZXR1cm4gNztcbiAgICBjYXNlICdkYXRlJzogcmV0dXJuIDMxO1xuICAgIGNhc2UgJ21vbnRoJzogcmV0dXJuIDEyO1xuICAgIGNhc2UgJ3llYXInOlxuICAgICAgdmFyIHN0YXQgPSBzdGF0c1tmaWVsZC5uYW1lXSxcbiAgICAgICAgeWVhcnN0YXQgPSBzdGF0c1sneWVhcl8nK2ZpZWxkLm5hbWVdO1xuXG4gICAgICBpZiAoIXllYXJzdGF0KSB7IHJldHVybiBudWxsOyB9XG5cbiAgICAgIHJldHVybiB5ZWFyc3RhdC5kaXN0aW5jdCAtXG4gICAgICAgIChzdGF0Lm51bGxzID4gMCAmJiBmaWx0ZXJOdWxsW3R5cGVdID8gMSA6IDApO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG50aW1lLm1heExlbmd0aCA9IGZ1bmN0aW9uKHRpbWVVbml0LCBlbmNvZGluZykge1xuICBzd2l0Y2ggKHRpbWVVbml0KSB7XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnbWludXRlcyc6XG4gICAgY2FzZSAnaG91cnMnOlxuICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgcmV0dXJuIDI7XG4gICAgY2FzZSAnbW9udGgnOlxuICAgIGNhc2UgJ2RheSc6XG4gICAgICB2YXIgcmFuZ2UgPSB0aW1lLnJhbmdlKHRpbWVVbml0LCBlbmNvZGluZyk7XG4gICAgICBpZiAocmFuZ2UpIHtcbiAgICAgICAgLy8gcmV0dXJuIHRoZSBsb25nZXN0IG5hbWUgaW4gdGhlIHJhbmdlXG4gICAgICAgIHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCByYW5nZS5tYXAoZnVuY3Rpb24ocikge3JldHVybiByLmxlbmd0aDt9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gMjtcbiAgICBjYXNlICd5ZWFyJzpcbiAgICAgIHJldHVybiA0OyAvLycxOTk4J1xuICB9XG4gIC8vIG5vIHRpbWUgdW5pdFxuICB2YXIgdGltZUZvcm1hdCA9IGVuY29kaW5nLmNvbmZpZygndGltZUZvcm1hdCcpO1xuICByZXR1cm4gZDNfdGltZV9mb3JtYXQudXRjRm9ybWF0KHRpbWVGb3JtYXQpKExPTkdfREFURSkubGVuZ3RoO1xufTtcblxuZnVuY3Rpb24gZmllbGRGbihmdW5jLCBmaWVsZCkge1xuICByZXR1cm4gJ3V0YycgKyBmdW5jICsgJyhkLmRhdGEuJysgZmllbGQubmFtZSArJyknO1xufVxuXG4vKipcbiAqIEByZXR1cm4ge1N0cmluZ30gZGF0ZSBiaW5uaW5nIGZvcm11bGEgb2YgdGhlIGdpdmVuIGZpZWxkXG4gKi9cbnRpbWUuZm9ybXVsYSA9IGZ1bmN0aW9uKGZpZWxkKSB7XG4gIHJldHVybiBmaWVsZEZuKGZpZWxkLnRpbWVVbml0LCBmaWVsZCk7XG59O1xuXG4vKiogYWRkIGZvcm11bGEgdHJhbnNmb3JtcyB0byBkYXRhICovXG50aW1lLnRyYW5zZm9ybSA9IGZ1bmN0aW9uKHRyYW5zZm9ybSwgZW5jb2RpbmcsIGVuY1R5cGUsIGZpZWxkKSB7XG4gIHRyYW5zZm9ybS5wdXNoKHtcbiAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgZmllbGQ6IGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUpLFxuICAgIGV4cHI6IHRpbWUuZm9ybXVsYShmaWVsZClcbiAgfSk7XG59O1xuXG50aW1lLnJhbmdlID0gZnVuY3Rpb24odGltZVVuaXQsIGVuY29kaW5nKSB7XG4gIHZhciBsYWJlbExlbmd0aCA9IGVuY29kaW5nLmNvbmZpZygndGltZVNjYWxlTGFiZWxMZW5ndGgnKSxcbiAgICBzY2FsZUxhYmVsO1xuICBzd2l0Y2ggKHRpbWVVbml0KSB7XG4gICAgY2FzZSAnZGF5JzpcbiAgICAgIHNjYWxlTGFiZWwgPSBlbmNvZGluZy5jb25maWcoJ2RheVNjYWxlTGFiZWwnKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgIHNjYWxlTGFiZWwgPSBlbmNvZGluZy5jb25maWcoJ21vbnRoU2NhbGVMYWJlbCcpO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgaWYgKHNjYWxlTGFiZWwpIHtcbiAgICByZXR1cm4gbGFiZWxMZW5ndGggPyBzY2FsZUxhYmVsLm1hcChcbiAgICAgICAgZnVuY3Rpb24ocykgeyByZXR1cm4gcy5zdWJzdHIoMCwgbGFiZWxMZW5ndGgpO31cbiAgICAgICkgOiBzY2FsZUxhYmVsO1xuICB9XG4gIHJldHVybjtcbn07XG5cblxudGltZS5zY2FsZSA9IHt9O1xuXG4vKiogYXBwZW5kIGN1c3RvbSB0aW1lIHNjYWxlcyBmb3IgYXhpcyBsYWJlbCAqL1xudGltZS5zY2FsZS5kZWYgPSBmdW5jdGlvbih0aW1lVW5pdCwgZW5jb2RpbmcpIHtcbiAgdmFyIHJhbmdlID0gdGltZS5yYW5nZSh0aW1lVW5pdCwgZW5jb2RpbmcpO1xuXG4gIGlmIChyYW5nZSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAndGltZS0nK3RpbWVVbml0LFxuICAgICAgdHlwZTogJ29yZGluYWwnLFxuICAgICAgZG9tYWluOiB0aW1lLnNjYWxlLmRvbWFpbih0aW1lVW5pdCksXG4gICAgICByYW5nZTogcmFuZ2VcbiAgICB9O1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxudGltZS5pc09yZGluYWxGbiA9IGZ1bmN0aW9uKHRpbWVVbml0KSB7XG4gIHN3aXRjaCAodGltZVVuaXQpIHtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkYXRlJzpcbiAgICBjYXNlICdtb250aCc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG50aW1lLnNjYWxlLnR5cGUgPSBmdW5jdGlvbih0aW1lVW5pdCwgbmFtZSkge1xuICBpZiAobmFtZSA9PT0gQ09MT1IpIHtcbiAgICByZXR1cm4gJ2xpbmVhcic7IC8vIHRpbWUgaGFzIG9yZGVyLCBzbyB1c2UgaW50ZXJwb2xhdGVkIG9yZGluYWwgY29sb3Igc2NhbGUuXG4gIH1cblxuICByZXR1cm4gdGltZS5pc09yZGluYWxGbih0aW1lVW5pdCkgfHwgbmFtZSA9PT0gQ09MIHx8IG5hbWUgPT09IFJPVyA/ICdvcmRpbmFsJyA6ICdsaW5lYXInO1xufTtcblxudGltZS5zY2FsZS5kb21haW4gPSBmdW5jdGlvbih0aW1lVW5pdCwgbmFtZSkge1xuICB2YXIgaXNDb2xvciA9IG5hbWUgPT09IENPTE9SO1xuICBzd2l0Y2ggKHRpbWVVbml0KSB7XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnbWludXRlcyc6IHJldHVybiBpc0NvbG9yID8gWzAsNTldIDogdXRpbC5yYW5nZSgwLCA2MCk7XG4gICAgY2FzZSAnaG91cnMnOiByZXR1cm4gaXNDb2xvciA/IFswLDIzXSA6IHV0aWwucmFuZ2UoMCwgMjQpO1xuICAgIGNhc2UgJ2RheSc6IHJldHVybiBpc0NvbG9yID8gWzAsNl0gOiB1dGlsLnJhbmdlKDAsIDcpO1xuICAgIGNhc2UgJ2RhdGUnOiByZXR1cm4gaXNDb2xvciA/IFsxLDMxXSA6IHV0aWwucmFuZ2UoMSwgMzIpO1xuICAgIGNhc2UgJ21vbnRoJzogcmV0dXJuIGlzQ29sb3IgPyBbMCwxMV0gOiB1dGlsLnJhbmdlKDAsIDEyKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbi8qKiB3aGV0aGVyIGEgcGFydGljdWxhciB0aW1lIGZ1bmN0aW9uIGhhcyBjdXN0b20gc2NhbGUgZm9yIGxhYmVscyBpbXBsZW1lbnRlZCBpbiB0aW1lLnNjYWxlICovXG50aW1lLmhhc1NjYWxlID0gZnVuY3Rpb24odGltZVVuaXQpIHtcbiAgc3dpdGNoICh0aW1lVW5pdCkge1xuICAgIGNhc2UgJ2RheSc6XG4gICAgY2FzZSAnbW9udGgnOlxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9nbG9iYWxzJyk7XG5cbnZhciBjb25zdHMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5jb25zdHMuZW5jb2RpbmdUeXBlcyA9IFtYLCBZLCBST1csIENPTCwgU0laRSwgU0hBUEUsIENPTE9SLCBURVhULCBERVRBSUxdO1xuXG5jb25zdHMuc2hvcnRoYW5kID0ge1xuICBkZWxpbTogICd8JyxcbiAgYXNzaWduOiAnPScsXG4gIHR5cGU6ICAgJywnLFxuICBmdW5jOiAgICdfJ1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9nbG9iYWxzJyk7XG5cbnZhciBzdGF0cyA9IHJlcXVpcmUoJ2RhdGFsaWIvc3JjL3N0YXRzJyk7XG5cbnZhciB2bGRhdGEgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vKiogTWFwcGluZyBmcm9tIGRhdGFsaWIncyBpbmZlcnJlZCB0eXBlIHRvIFZlZ2EtbGl0ZSdzIHR5cGUgKi9cbnZsZGF0YS50eXBlcyA9IHtcbiAgJ2Jvb2xlYW4nOiBOLFxuICAnbnVtYmVyJzogUSxcbiAgJ2ludGVnZXInOiBRLFxuICAnZGF0ZSc6IFQsXG4gICdzdHJpbmcnOiBOXG59O1xuXG52bGRhdGEuc3RhdHMgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHZhciBzdW1tYXJ5ID0gc3RhdHMuc3VtbWFyeShkYXRhKTtcblxuICByZXR1cm4gc3VtbWFyeS5yZWR1Y2UoZnVuY3Rpb24ocywgcHJvZmlsZSkge1xuICAgIHNbcHJvZmlsZS5maWVsZF0gPSBwcm9maWxlO1xuICAgIHJldHVybiBzO1xuICB9LCB7XG4gICAgJyonOiB7XG4gICAgICBtYXg6IGRhdGEubGVuZ3RoLFxuICAgICAgbWluOiAwXG4gICAgfVxuICB9KTtcbn07IiwiLy8gdXRpbGl0eSBmb3IgZW5jXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGNvbnN0cyA9IHJlcXVpcmUoJy4vY29uc3RzJyksXG4gIGMgPSBjb25zdHMuc2hvcnRoYW5kLFxuICB2bGZpZWxkID0gcmVxdWlyZSgnLi9maWVsZCcpLFxuICB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gIHNjaGVtYSA9IHJlcXVpcmUoJy4vc2NoZW1hL3NjaGVtYScpLFxuICBlbmNUeXBlcyA9IHNjaGVtYS5lbmNUeXBlcztcblxudmFyIHZsZW5jID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxudmxlbmMuY291bnRSZXRpbmFsID0gZnVuY3Rpb24oZW5jKSB7XG4gIHZhciBjb3VudCA9IDA7XG4gIGlmIChlbmMuY29sb3IpIGNvdW50Kys7XG4gIGlmIChlbmMuc2l6ZSkgY291bnQrKztcbiAgaWYgKGVuYy5zaGFwZSkgY291bnQrKztcbiAgcmV0dXJuIGNvdW50O1xufTtcblxudmxlbmMuaGFzID0gZnVuY3Rpb24oZW5jLCBlbmNUeXBlKSB7XG4gIHZhciBmaWVsZERlZiA9IGVuYyAmJiBlbmNbZW5jVHlwZV07XG4gIHJldHVybiBmaWVsZERlZiAmJiBmaWVsZERlZi5uYW1lO1xufTtcblxudmxlbmMuaXNBZ2dyZWdhdGUgPSBmdW5jdGlvbihlbmMpIHtcbiAgZm9yICh2YXIgayBpbiBlbmMpIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykgJiYgZW5jW2tdLmFnZ3JlZ2F0ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnZsZW5jLmZvckVhY2ggPSBmdW5jdGlvbihlbmMsIGYpIHtcbiAgdmFyIGkgPSAwO1xuICBlbmNUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykpIHtcbiAgICAgIGYoZW5jW2tdLCBrLCBpKyspO1xuICAgIH1cbiAgfSk7XG59O1xuXG52bGVuYy5tYXAgPSBmdW5jdGlvbihlbmMsIGYpIHtcbiAgdmFyIGFyciA9IFtdO1xuICBlbmNUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykpIHtcbiAgICAgIGFyci5wdXNoKGYoZW5jW2tdLCBrLCBlbmMpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXJyO1xufTtcblxudmxlbmMucmVkdWNlID0gZnVuY3Rpb24oZW5jLCBmLCBpbml0KSB7XG4gIHZhciByID0gaW5pdDtcbiAgZW5jVHlwZXMuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgaWYgKHZsZW5jLmhhcyhlbmMsIGspKSB7XG4gICAgICByID0gZihyLCBlbmNba10sIGssICBlbmMpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByO1xufTtcblxuLypcbiAqIHJldHVybiBrZXktdmFsdWUgcGFpcnMgb2YgZmllbGQgbmFtZSBhbmQgbGlzdCBvZiBmaWVsZHMgb2YgdGhhdCBmaWVsZCBuYW1lXG4gKi9cbnZsZW5jLmZpZWxkcyA9IGZ1bmN0aW9uKGVuYykge1xuICByZXR1cm4gdmxlbmMucmVkdWNlKGVuYywgZnVuY3Rpb24gKG0sIGZpZWxkKSB7XG4gICAgdmFyIGZpZWxkTGlzdCA9IG1bZmllbGQubmFtZV0gPSBtW2ZpZWxkLm5hbWVdIHx8IFtdLFxuICAgICAgY29udGFpbnNUeXBlID0gZmllbGRMaXN0LmNvbnRhaW5zVHlwZSA9IGZpZWxkTGlzdC5jb250YWluc1R5cGUgfHwge307XG5cbiAgICBpZiAoZmllbGRMaXN0LmluZGV4T2YoZmllbGQpID09PSAtMSkge1xuICAgICAgZmllbGRMaXN0LnB1c2goZmllbGQpO1xuICAgICAgLy8gYXVnbWVudCB0aGUgYXJyYXkgd2l0aCBjb250YWluc1R5cGUuUSAvIE8gLyBOIC8gVFxuICAgICAgY29udGFpbnNUeXBlW2ZpZWxkLnR5cGVdID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG07XG4gIH0sIHt9KTtcbn07XG5cbnZsZW5jLnNob3J0aGFuZCA9IGZ1bmN0aW9uKGVuYykge1xuICByZXR1cm4gdmxlbmMubWFwKGVuYywgZnVuY3Rpb24oZmllbGQsIGV0KSB7XG4gICAgcmV0dXJuIGV0ICsgYy5hc3NpZ24gKyB2bGZpZWxkLnNob3J0aGFuZChmaWVsZCk7XG4gIH0pLmpvaW4oYy5kZWxpbSk7XG59O1xuXG52bGVuYy5mcm9tU2hvcnRoYW5kID0gZnVuY3Rpb24oc2hvcnRoYW5kKSB7XG4gIHZhciBlbmMgPSB1dGlsLmlzQXJyYXkoc2hvcnRoYW5kKSA/IHNob3J0aGFuZCA6IHNob3J0aGFuZC5zcGxpdChjLmRlbGltKTtcbiAgcmV0dXJuIGVuYy5yZWR1Y2UoZnVuY3Rpb24obSwgZSkge1xuICAgIHZhciBzcGxpdCA9IGUuc3BsaXQoYy5hc3NpZ24pLFxuICAgICAgICBlbmN0eXBlID0gc3BsaXRbMF0udHJpbSgpLFxuICAgICAgICBmaWVsZCA9IHNwbGl0WzFdO1xuXG4gICAgbVtlbmN0eXBlXSA9IHZsZmllbGQuZnJvbVNob3J0aGFuZChmaWVsZCk7XG4gICAgcmV0dXJuIG07XG4gIH0sIHt9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyB1dGlsaXR5IGZvciBmaWVsZFxuXG5yZXF1aXJlKCcuL2dsb2JhbHMnKTtcblxudmFyIGNvbnN0cyA9IHJlcXVpcmUoJy4vY29uc3RzJyksXG4gIGMgPSBjb25zdHMuc2hvcnRoYW5kLFxuICB0aW1lID0gcmVxdWlyZSgnLi9jb21waWxlci90aW1lJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKSxcbiAgc2NoZW1hID0gcmVxdWlyZSgnLi9zY2hlbWEvc2NoZW1hJyk7XG5cbnZhciB2bGZpZWxkID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLyoqXG4gKiBAcGFyYW0gZmllbGRcbiAqIEBwYXJhbSBvcHRcbiAqICAgb3B0Lm5vZm4gLS0gZXhjbHVkZSBiaW4sIGFnZ3JlZ2F0ZSwgdGltZVVuaXRcbiAqICAgb3B0LmRhdGEgLSBpbmNsdWRlICdkYXRhLidcbiAqICAgb3B0LmZuIC0gcmVwbGFjZSBmbiB3aXRoIGN1c3RvbSBmdW5jdGlvbiBwcmVmaXhcbiAqICAgb3B0LnByZWZuIC0gcHJlcGVuZCBmbiB3aXRoIGN1c3RvbSBmdW5jdGlvbiBwcmVmaXhcblxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbnZsZmllbGQuZmllbGRSZWYgPSBmdW5jdGlvbihmaWVsZCwgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcblxuICB2YXIgZiA9IChvcHQuZGF0YSA/ICdkYXRhLicgOiAnJykgKyAob3B0LnByZWZuIHx8ICcnKSxcbiAgICBub2ZuID0gb3B0Lm5vZm4gfHwgb3B0LmZuLFxuICAgIG5hbWUgPSBmaWVsZC5uYW1lO1xuXG4gIGlmICh2bGZpZWxkLmlzQ291bnQoZmllbGQpKSB7XG4gICAgcmV0dXJuIGYgKyAnY291bnQnO1xuICB9IGVsc2UgaWYgKCFub2ZuICYmIGZpZWxkLmJpbikge1xuICAgIHJldHVybiBmICsgJ2Jpbl8nICsgbmFtZTtcbiAgfSBlbHNlIGlmICghbm9mbiAmJiBmaWVsZC5hZ2dyZWdhdGUpIHtcbiAgICByZXR1cm4gZiArIGZpZWxkLmFnZ3JlZ2F0ZSArICdfJyArIG5hbWU7XG4gIH0gZWxzZSBpZiAoIW5vZm4gJiYgZmllbGQudGltZVVuaXQpIHtcbiAgICByZXR1cm4gZiArIGZpZWxkLnRpbWVVbml0ICsgJ18nICsgbmFtZTtcbiAgfSBlbHNlIGlmIChvcHQuZm4pIHtcbiAgICByZXR1cm4gZiArIG9wdC5mbiArICdfJyArIG5hbWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGYgKyBuYW1lO1xuICB9XG59O1xuXG52bGZpZWxkLnNob3J0aGFuZCA9IGZ1bmN0aW9uKGYpIHtcbiAgdmFyIGMgPSBjb25zdHMuc2hvcnRoYW5kO1xuICByZXR1cm4gKGYuYWdncmVnYXRlID8gZi5hZ2dyZWdhdGUgKyBjLmZ1bmMgOiAnJykgK1xuICAgIChmLnRpbWVVbml0ID8gZi50aW1lVW5pdCArIGMuZnVuYyA6ICcnKSArXG4gICAgKGYuYmluID8gJ2JpbicgKyBjLmZ1bmMgOiAnJykgK1xuICAgIChmLm5hbWUgfHwgJycpICsgYy50eXBlICsgZi50eXBlO1xufTtcblxudmxmaWVsZC5zaG9ydGhhbmRzID0gZnVuY3Rpb24oZmllbGRzLCBkZWxpbSkge1xuICBkZWxpbSA9IGRlbGltIHx8IGMuZGVsaW07XG4gIHJldHVybiBmaWVsZHMubWFwKHZsZmllbGQuc2hvcnRoYW5kKS5qb2luKGRlbGltKTtcbn07XG5cbnZsZmllbGQuZnJvbVNob3J0aGFuZCA9IGZ1bmN0aW9uKHNob3J0aGFuZCkge1xuICB2YXIgc3BsaXQgPSBzaG9ydGhhbmQuc3BsaXQoYy50eXBlKSwgaTtcbiAgdmFyIG8gPSB7XG4gICAgbmFtZTogc3BsaXRbMF0udHJpbSgpLFxuICAgIHR5cGU6IHNwbGl0WzFdLnRyaW0oKVxuICB9O1xuXG4gIC8vIGNoZWNrIGFnZ3JlZ2F0ZSB0eXBlXG4gIGZvciAoaSBpbiBzY2hlbWEuYWdncmVnYXRlLmVudW0pIHtcbiAgICB2YXIgYSA9IHNjaGVtYS5hZ2dyZWdhdGUuZW51bVtpXTtcbiAgICBpZiAoby5uYW1lLmluZGV4T2YoYSArICdfJykgPT09IDApIHtcbiAgICAgIG8ubmFtZSA9IG8ubmFtZS5zdWJzdHIoYS5sZW5ndGggKyAxKTtcbiAgICAgIGlmIChhID09ICdjb3VudCcgJiYgby5uYW1lLmxlbmd0aCA9PT0gMCkgby5uYW1lID0gJyonO1xuICAgICAgby5hZ2dyZWdhdGUgPSBhO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gY2hlY2sgdGltZSB0aW1lVW5pdFxuICBmb3IgKGkgaW4gc2NoZW1hLnRpbWVmbnMpIHtcbiAgICB2YXIgdHUgPSBzY2hlbWEudGltZWZuc1tpXTtcbiAgICBpZiAoby5uYW1lICYmIG8ubmFtZS5pbmRleE9mKHR1ICsgJ18nKSA9PT0gMCkge1xuICAgICAgby5uYW1lID0gby5uYW1lLnN1YnN0cihvLmxlbmd0aCArIDEpO1xuICAgICAgby50aW1lVW5pdCA9IHR1O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gY2hlY2sgYmluXG4gIGlmIChvLm5hbWUgJiYgby5uYW1lLmluZGV4T2YoJ2Jpbl8nKSA9PT0gMCkge1xuICAgIG8ubmFtZSA9IG8ubmFtZS5zdWJzdHIoNCk7XG4gICAgby5iaW4gPSB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIG87XG59O1xuXG52YXIgaXNUeXBlID0gdmxmaWVsZC5pc1R5cGUgPSBmdW5jdGlvbiAoZmllbGREZWYsIHR5cGUpIHtcbiAgcmV0dXJuIGZpZWxkRGVmLnR5cGUgPT09IHR5cGU7XG59O1xuXG52YXIgaXNUeXBlcyA9IHZsZmllbGQuaXNUeXBlcyA9IGZ1bmN0aW9uIChmaWVsZERlZiwgdHlwZXMpIHtcbiAgZm9yICh2YXIgdD0wOyB0PHR5cGVzLmxlbmd0aDsgdCsrKSB7XG4gICAgaWYoZmllbGREZWYudHlwZSA9PT0gdHlwZXNbdF0pIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qXG4gKiBNb3N0IGZpZWxkcyB0aGF0IHVzZSBvcmRpbmFsIHNjYWxlIGFyZSBkaW1lbnNpb25zLlxuICogSG93ZXZlciwgWUVBUihUKSwgWUVBUk1PTlRIKFQpIHVzZSB0aW1lIHNjYWxlLCBub3Qgb3JkaW5hbCBidXQgYXJlIGRpbWVuc2lvbnMgdG9vLlxuICovXG52bGZpZWxkLmlzT3JkaW5hbFNjYWxlID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuICBpc1R5cGVzKGZpZWxkLCBbTiwgT10pIHx8IGZpZWxkLmJpbiB8fFxuICAgICggaXNUeXBlKGZpZWxkLCBUKSAmJiBmaWVsZC50aW1lVW5pdCAmJiB0aW1lLmlzT3JkaW5hbEZuKGZpZWxkLnRpbWVVbml0KSApO1xufTtcblxuZnVuY3Rpb24gaXNEaW1lbnNpb24oZmllbGQpIHtcbiAgcmV0dXJuICBpc1R5cGVzKGZpZWxkLCBbTiwgT10pIHx8ICEhZmllbGQuYmluIHx8XG4gICAgKCBpc1R5cGUoZmllbGQsIFQpICYmICEhZmllbGQudGltZVVuaXQgKTtcbn1cblxuLyoqXG4gKiBGb3IgZW5jb2RpbmcsIHVzZSBlbmNvZGluZy5pc0RpbWVuc2lvbigpIHRvIGF2b2lkIGNvbmZ1c2lvbi5cbiAqIE9yIHVzZSBFbmNvZGluZy5pc1R5cGUgaWYgeW91ciBmaWVsZCBpcyBmcm9tIEVuY29kaW5nIChhbmQgdGh1cyBoYXZlIG51bWVyaWMgZGF0YSB0eXBlKS5cbiAqIG90aGVyd2lzZSwgZG8gbm90IHNwZWNpZmljIGlzVHlwZSBzbyB3ZSBjYW4gdXNlIHRoZSBkZWZhdWx0IGlzVHlwZU5hbWUgaGVyZS5cbiAqL1xudmxmaWVsZC5pc0RpbWVuc2lvbiA9IGZ1bmN0aW9uKGZpZWxkKSB7XG4gIHJldHVybiBmaWVsZCAmJiBpc0RpbWVuc2lvbihmaWVsZCk7XG59O1xuXG52bGZpZWxkLmlzTWVhc3VyZSA9IGZ1bmN0aW9uKGZpZWxkKSB7XG4gIHJldHVybiBmaWVsZCAmJiAhaXNEaW1lbnNpb24oZmllbGQpO1xufTtcblxudmxmaWVsZC5jb3VudCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge25hbWU6JyonLCBhZ2dyZWdhdGU6ICdjb3VudCcsIHR5cGU6IFEsIGRpc3BsYXlOYW1lOiB2bGZpZWxkLmNvdW50LmRpc3BsYXlOYW1lfTtcbn07XG5cbnZsZmllbGQuY291bnQuZGlzcGxheU5hbWUgPSAnTnVtYmVyIG9mIFJlY29yZHMnO1xuXG52bGZpZWxkLmlzQ291bnQgPSBmdW5jdGlvbihmaWVsZCkge1xuICByZXR1cm4gZmllbGQuYWdncmVnYXRlID09PSAnY291bnQnO1xufTtcblxuLyoqXG4gKiBGb3IgZW5jb2RpbmcsIHVzZSBlbmNvZGluZy5jYXJkaW5hbGl0eSgpIHRvIGF2b2lkIGNvbmZ1c2lvbi4gIE9yIHVzZSBFbmNvZGluZy5pc1R5cGUgaWYgeW91ciBmaWVsZCBpcyBmcm9tIEVuY29kaW5nIChhbmQgdGh1cyBoYXZlIG51bWVyaWMgZGF0YSB0eXBlKS5cbiAqIG90aGVyd2lzZSwgZG8gbm90IHNwZWNpZmljIGlzVHlwZSBzbyB3ZSBjYW4gdXNlIHRoZSBkZWZhdWx0IGlzVHlwZU5hbWUgaGVyZS5cbiAqL1xudmxmaWVsZC5jYXJkaW5hbGl0eSA9IGZ1bmN0aW9uKGZpZWxkLCBzdGF0cywgZmlsdGVyTnVsbCkge1xuICAvLyBGSVhNRSBuZWVkIHRvIHRha2UgZmlsdGVyIGludG8gYWNjb3VudFxuXG4gIHZhciBzdGF0ID0gc3RhdHNbZmllbGQubmFtZV07XG4gIHZhciB0eXBlID0gZmllbGQudHlwZTtcblxuICBmaWx0ZXJOdWxsID0gZmlsdGVyTnVsbCB8fCB7fTtcblxuICBpZiAoZmllbGQuYmluKSB7XG4gICAgdmFyIGJpbnMgPSB1dGlsLmdldGJpbnMoc3RhdCwgZmllbGQuYmluLm1heGJpbnMgfHwgc2NoZW1hLk1BWEJJTlNfREVGQVVMVCk7XG4gICAgcmV0dXJuIChiaW5zLnN0b3AgLSBiaW5zLnN0YXJ0KSAvIGJpbnMuc3RlcDtcbiAgfVxuICBpZiAoaXNUeXBlKGZpZWxkLCBUKSkge1xuICAgIHZhciBjYXJkaW5hbGl0eSA9IHRpbWUuY2FyZGluYWxpdHkoZmllbGQsIHN0YXRzLCBmaWx0ZXJOdWxsLCB0eXBlKTtcbiAgICBpZihjYXJkaW5hbGl0eSAhPT0gbnVsbCkgcmV0dXJuIGNhcmRpbmFsaXR5O1xuICAgIC8vb3RoZXJ3aXNlIHVzZSBjYWxjdWxhdGlvbiBiZWxvd1xuICB9XG4gIGlmIChmaWVsZC5hZ2dyZWdhdGUpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIC8vIHJlbW92ZSBudWxsXG4gIHJldHVybiBzdGF0LmRpc3RpbmN0IC1cbiAgICAoc3RhdC5udWxscyA+IDAgJiYgZmlsdGVyTnVsbFt0eXBlXSA/IDEgOiAwKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIGRlY2xhcmUgZ2xvYmFsIGNvbnN0YW50XG52YXIgZyA9IGdsb2JhbCB8fCB3aW5kb3c7XG5cbmcuVEFCTEUgPSAndGFibGUnO1xuZy5SQVcgPSAncmF3JztcbmcuU1RBQ0tFRCA9ICdzdGFja2VkJztcbmcuSU5ERVggPSAnaW5kZXgnO1xuXG5nLlggPSAneCc7XG5nLlkgPSAneSc7XG5nLlJPVyA9ICdyb3cnO1xuZy5DT0wgPSAnY29sJztcbmcuU0laRSA9ICdzaXplJztcbmcuU0hBUEUgPSAnc2hhcGUnO1xuZy5DT0xPUiA9ICdjb2xvcic7XG5nLlRFWFQgPSAndGV4dCc7XG5nLkRFVEFJTCA9ICdkZXRhaWwnO1xuXG5nLk4gPSAnTic7XG5nLk8gPSAnTyc7XG5nLlEgPSAnUSc7XG5nLlQgPSAnVCc7XG4iLCIvLyBQYWNrYWdlIG9mIGRlZmluaW5nIFZlZ2EtbGl0ZSBTcGVjaWZpY2F0aW9uJ3MganNvbiBzY2hlbWFcbid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgc2NoZW1hID0gbW9kdWxlLmV4cG9ydHMgPSB7fSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgdG9NYXAgPSB1dGlsLnRvTWFwLFxuICBjb2xvcmJyZXdlciA9IHJlcXVpcmUoJ2NvbG9yYnJld2VyJyk7XG5cbnNjaGVtYS51dGlsID0gcmVxdWlyZSgnLi9zY2hlbWF1dGlsJyk7XG5cbnNjaGVtYS5tYXJrdHlwZSA9IHtcbiAgdHlwZTogJ3N0cmluZycsXG4gIGVudW06IFsncG9pbnQnLCAndGljaycsICdiYXInLCAnbGluZScsICdhcmVhJywgJ2NpcmNsZScsICdzcXVhcmUnLCAndGV4dCddXG59O1xuXG5zY2hlbWEuYWdncmVnYXRlID0ge1xuICB0eXBlOiAnc3RyaW5nJyxcbiAgZW51bTogWydhdmcnLCAnc3VtJywgJ21lZGlhbicsICdtaW4nLCAnbWF4JywgJ2NvdW50J10sXG4gIHN1cHBvcnRlZEVudW1zOiB7XG4gICAgUTogWydhdmcnLCAnbWVkaWFuJywgJ3N1bScsICdtaW4nLCAnbWF4JywgJ2NvdW50J10sXG4gICAgTzogWydtZWRpYW4nLCdtaW4nLCdtYXgnXSxcbiAgICBOOiBbXSxcbiAgICBUOiBbJ2F2ZycsICdtZWRpYW4nLCAnbWluJywgJ21heCddLFxuICAgICcnOiBbJ2NvdW50J11cbiAgfSxcbiAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRLCBOLCBPLCBULCAnJ10pXG59O1xuXG5zY2hlbWEuZ2V0U3VwcG9ydGVkUm9sZSA9IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgcmV0dXJuIHNjaGVtYS5zY2hlbWEucHJvcGVydGllcy5lbmNvZGluZy5wcm9wZXJ0aWVzW2VuY1R5cGVdLnN1cHBvcnRlZFJvbGU7XG59O1xuXG5zY2hlbWEudGltZVVuaXRzID0gWyd5ZWFyJywgJ21vbnRoJywgJ2RheScsICdkYXRlJywgJ2hvdXJzJywgJ21pbnV0ZXMnLCAnc2Vjb25kcyddO1xuXG5zY2hlbWEuZGVmYXVsdFRpbWVGbiA9ICdtb250aCc7XG5cbnNjaGVtYS50aW1lVW5pdCA9IHtcbiAgdHlwZTogJ3N0cmluZycsXG4gIGVudW06IHNjaGVtYS50aW1lVW5pdHMsXG4gIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbVF0pXG59O1xuXG5zY2hlbWEuc2NhbGVfdHlwZSA9IHtcbiAgdHlwZTogJ3N0cmluZycsXG4gIC8vIFRPRE8oa2FuaXR3KSByZWFkIHZlZ2EncyBzY2hlbWEgaGVyZSwgYWRkIGRlc2NyaXB0aW9uXG4gIGVudW06IFsnbGluZWFyJywgJ2xvZycsICdwb3cnLCAnc3FydCcsICdxdWFudGlsZSddLFxuICBkZWZhdWx0OiAnbGluZWFyJyxcbiAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRXSlcbn07XG5cbnNjaGVtYS5maWVsZCA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBuYW1lOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIH1cbiAgfVxufTtcblxudmFyIGNsb25lID0gdXRpbC5kdXBsaWNhdGU7XG52YXIgbWVyZ2UgPSBzY2hlbWEudXRpbC5tZXJnZTtcblxuc2NoZW1hLk1BWEJJTlNfREVGQVVMVCA9IDE1O1xuXG52YXIgYmluID0ge1xuICB0eXBlOiBbJ2Jvb2xlYW4nLCAnb2JqZWN0J10sXG4gIGRlZmF1bHQ6IGZhbHNlLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbWF4Ymluczoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogc2NoZW1hLk1BWEJJTlNfREVGQVVMVCxcbiAgICAgIG1pbmltdW06IDIsXG4gICAgICBkZXNjcmlwdGlvbjogJ01heGltdW0gbnVtYmVyIG9mIGJpbnMuJ1xuICAgIH1cbiAgfSxcbiAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRXSkgLy8gVE9ETzogYWRkIE8gYWZ0ZXIgZmluaXNoaW5nICM4MVxufTtcblxudmFyIHR5cGljYWxGaWVsZCA9IG1lcmdlKGNsb25lKHNjaGVtYS5maWVsZCksIHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICB0eXBlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFtOLCBPLCBRLCBUXVxuICAgIH0sXG4gICAgYWdncmVnYXRlOiBzY2hlbWEuYWdncmVnYXRlLFxuICAgIHRpbWVVbml0OiBzY2hlbWEudGltZVVuaXQsXG4gICAgYmluOiBiaW4sXG4gICAgc2NhbGU6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB0eXBlOiBzY2hlbWEuc2NhbGVfdHlwZSxcbiAgICAgICAgcmV2ZXJzZToge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1EsIFRdKVxuICAgICAgICB9LFxuICAgICAgICB6ZXJvOiB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSW5jbHVkZSB6ZXJvJyxcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUSwgVF0pXG4gICAgICAgIH0sXG4gICAgICAgIG5pY2U6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBlbnVtOiBbJ3NlY29uZCcsICdtaW51dGUnLCAnaG91cicsICdkYXknLCAnd2VlaycsICdtb250aCcsICd5ZWFyJ10sXG4gICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtUXSlcbiAgICAgICAgfSxcbiAgICAgICAgdXNlUmF3RG9tYWluOiB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1VzZSB0aGUgcmF3IGRhdGEgcmFuZ2UgYXMgc2NhbGUgZG9tYWluIGluc3RlYWQgb2YgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICdhZ2dyZWdhdGVkIGRhdGEgZm9yIGFnZ3JlZ2F0ZSBheGlzLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgJ1RoaXMgb3B0aW9uIGRvZXMgbm90IHdvcmsgd2l0aCBzdW0gb3IgY291bnQgYWdncmVnYXRlJyArXG4gICAgICAgICAgICAgICAgICAgICAgICdhcyB0aGV5IG1pZ2h0IGhhdmUgYSBzdWJzdGFudGlhbGx5IGxhcmdlciBzY2FsZSByYW5nZS4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgJ0J5IGRlZmF1bHQsIHVzZSB2YWx1ZSBmcm9tIGNvbmZpZy51c2VSYXdEb21haW4uJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxudmFyIG9ubHlPcmRpbmFsRmllbGQgPSBtZXJnZShjbG9uZShzY2hlbWEuZmllbGQpLCB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRSb2xlOiB7XG4gICAgZGltZW5zaW9uOiB0cnVlXG4gIH0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB0eXBlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFtOLCBPLCBRLCBUXSAvLyBvcmRpbmFsLW9ubHkgZmllbGQgc3VwcG9ydHMgUSB3aGVuIGJpbiBpcyBhcHBsaWVkIGFuZCBUIHdoZW4gdGltZSB1bml0IGlzIGFwcGxpZWQuXG4gICAgfSxcbiAgICB0aW1lVW5pdDogc2NoZW1hLnRpbWVVbml0LFxuICAgIGJpbjogYmluLFxuICAgIGFnZ3JlZ2F0ZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ2NvdW50J10sXG4gICAgICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW04sIE9dKSAvLyBGSVhNRSB0aGlzIGxvb2tzIHdlaXJkIHRvIG1lXG4gICAgfVxuICB9XG59KTtcblxudmFyIGF4aXNNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBiYXI6IHRydWUsIGxpbmU6IHRydWUsIGFyZWE6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIGF4aXM6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBncmlkOiB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBIGZsYWcgaW5kaWNhdGUgaWYgZ3JpZGxpbmVzIHNob3VsZCBiZSBjcmVhdGVkIGluIGFkZGl0aW9uIHRvIHRpY2tzLidcbiAgICAgICAgfSxcbiAgICAgICAgbGF5ZXI6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiAnYmFjaycsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBIHN0cmluZyBpbmRpY2F0aW5nIGlmIHRoZSBheGlzIChhbmQgYW55IGdyaWRsaW5lcykgc2hvdWxkIGJlIHBsYWNlZCBhYm92ZSBvciBiZWxvdyB0aGUgZGF0YSBtYXJrcy4nXG4gICAgICAgIH0sXG4gICAgICAgIG9yaWVudDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICBlbnVtOiBbJ3RvcCcsICdyaWdodCcsICdsZWZ0JywgJ2JvdHRvbSddLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBheGlzLiBPbmUgb2YgdG9wLCBib3R0b20sIGxlZnQgb3IgcmlnaHQuIFRoZSBvcmllbnRhdGlvbiBjYW4gYmUgdXNlZCB0byBmdXJ0aGVyIHNwZWNpYWxpemUgdGhlIGF4aXMgdHlwZSAoZS5nLiwgYSB5IGF4aXMgb3JpZW50ZWQgZm9yIHRoZSByaWdodCBlZGdlIG9mIHRoZSBjaGFydCkuJ1xuICAgICAgICB9LFxuICAgICAgICB0aWNrcyA6e1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiA1LFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSBkZXNpcmVkIG51bWJlciBvZiB0aWNrcywgZm9yIGF4ZXMgdmlzdWFsaXppbmcgcXVhbnRpdGF0aXZlIHNjYWxlcy4gVGhlIHJlc3VsdGluZyBudW1iZXIgbWF5IGJlIGRpZmZlcmVudCBzbyB0aGF0IHZhbHVlcyBhcmUgXCJuaWNlXCIgKG11bHRpcGxlcyBvZiAyLCA1LCAxMCkgYW5kIGxpZSB3aXRoaW4gdGhlIHVuZGVybHlpbmcgc2NhbGVcXCdzIHJhbmdlLidcbiAgICAgICAgfSxcbiAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBIHRpdGxlIGZvciB0aGUgYXhpcy4gKFNob3dzIGZpZWxkIG5hbWUgYW5kIGl0cyBmdW5jdGlvbiBieSBkZWZhdWx0LiknXG4gICAgICAgIH0sXG4gICAgICAgIHRpdGxlTWF4TGVuZ3RoOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ01heCBsZW5ndGggZm9yIGF4aXMgdGl0bGUgaWYgdGhlIHRpdGxlIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGZyb20gdGhlIGZpZWxkXFwncyBkZXNjcmlwdGlvbidcbiAgICAgICAgfSxcbiAgICAgICAgdGl0bGVPZmZzZXQ6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSB0aXRsZSBvZmZzZXQgdmFsdWUgZm9yIHRoZSBheGlzLidcbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0OiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZvcm1hdHRpbmcgcGF0dGVybiBmb3IgYXhpcyBsYWJlbHMuICcrXG4gICAgICAgICAgICAgICAgICAgICAgICdJZiBub3QgdW5kZWZpbmVkLCB0aGlzIHdpbGwgYmUgZGV0ZXJtaW5lZCBieSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgJ3NtYWxsL2xhcmdlTnVtYmVyRm9ybWF0IGFuZCB0aGUgbWF4IHZhbHVlICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAnb2YgdGhlIGZpZWxkLidcbiAgICAgICAgfSxcbiAgICAgICAgbWF4TGFiZWxMZW5ndGg6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogMjUsXG4gICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RydW5jYXRlIGxhYmVscyB0aGF0IGFyZSB0b28gbG9uZy4nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBzb3J0TWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgc29ydDoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbTiwgT10pLFxuICAgICAgICByZXF1aXJlZDogWyduYW1lJywgJ2FnZ3JlZ2F0ZSddLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgbmFtZToge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFnZ3JlZ2F0ZToge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICBlbnVtOiBbJ2F2ZycsICdzdW0nLCAnbWluJywgJ21heCcsICdjb3VudCddXG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXZlcnNlOiB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIGJhbmRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBiYW5kOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc2l6ZToge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBtaW5pbXVtOiAwLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgICAgICB9LFxuICAgICAgICBwYWRkaW5nOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIG1pbmltdW06IDAsXG4gICAgICAgICAgZGVmYXVsdDogMVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgbGVnZW5kTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbGVnZW5kOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfVxuICB9XG59O1xuXG52YXIgdGV4dE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7J3RleHQnOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIGFsaWduOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdyaWdodCdcbiAgICB9LFxuICAgIGJhc2VsaW5lOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdtaWRkbGUnXG4gICAgfSxcbiAgICBjb2xvcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJyMwMDAwMDAnXG4gICAgfSxcbiAgICBtYXJnaW46IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDQsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBwbGFjZWhvbGRlcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnQWJjJ1xuICAgIH0sXG4gICAgZm9udDoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHdlaWdodDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IFsnbm9ybWFsJywgJ2JvbGQnXSxcbiAgICAgICAgICBkZWZhdWx0OiAnbm9ybWFsJ1xuICAgICAgICB9LFxuICAgICAgICBzaXplOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IDEwLFxuICAgICAgICAgIG1pbmltdW06IDBcbiAgICAgICAgfSxcbiAgICAgICAgZmFtaWx5OiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogJ0hlbHZldGljYSBOZXVlJ1xuICAgICAgICB9LFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdub3JtYWwnLFxuICAgICAgICAgIGVudW06IFsnbm9ybWFsJywgJ2l0YWxpYyddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGZvcm1hdDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmb3JtYXR0aW5nIHBhdHRlcm4gZm9yIHRleHQgdmFsdWUuICcrXG4gICAgICAgICAgICAgICAgICAgJ0lmIG5vdCB1bmRlZmluZWQsIHRoaXMgd2lsbCBiZSBkZXRlcm1pbmVkIGJ5ICcgK1xuICAgICAgICAgICAgICAgICAgICdzbWFsbC9sYXJnZU51bWJlckZvcm1hdCBhbmQgdGhlIG1heCB2YWx1ZSAnICtcbiAgICAgICAgICAgICAgICAgICAnb2YgdGhlIGZpZWxkLidcbiAgICB9LFxuICB9XG59O1xuXG52YXIgc2l6ZU1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIGJhcjogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWUsIHRleHQ6IHRydWV9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDMwLFxuICAgICAgbWluaW11bTogMFxuICAgIH1cbiAgfVxufTtcblxudmFyIGNvbG9yTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSwgJ3RleHQnOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiAnc3RlZWxibHVlJ1xuICAgIH0sXG4gICAgb3BhY2l0eToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgbWF4aW11bTogMVxuICAgIH0sXG4gICAgc2NhbGU6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICByYW5nZToge1xuICAgICAgICAgIHR5cGU6IFsnc3RyaW5nJywgJ2FycmF5J10sXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgJ2NvbG9yIHBhbGV0dGUsIGlmIHVuZGVmaW5lZCB2ZWdhLWxpdGUgd2lsbCB1c2UgZGF0YSBwcm9wZXJ0eScgK1xuICAgICAgICAgICAgJ3RvIHBpY2sgb25lIGZyb20gYzEwcGFsZXR0ZSwgYzIwcGFsZXR0ZSwgb3Igb3JkaW5hbFBhbGV0dGUnXG4gICAgICAgIH0sXG4gICAgICAgIGMxMHBhbGV0dGU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiAnY2F0ZWdvcnkxMCcsXG4gICAgICAgICAgZW51bTogW1xuICAgICAgICAgICAgLy8gVGFibGVhdVxuICAgICAgICAgICAgJ2NhdGVnb3J5MTAnLCAnY2F0ZWdvcnkxMGsnLFxuICAgICAgICAgICAgLy8gQ29sb3IgQnJld2VyXG4gICAgICAgICAgICAnUGFzdGVsMScsICdQYXN0ZWwyJywgJ1NldDEnLCAnU2V0MicsICdTZXQzJ1xuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgYzIwcGFsZXR0ZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdjYXRlZ29yeTIwJyxcbiAgICAgICAgICBlbnVtOiBbJ2NhdGVnb3J5MjAnLCAnY2F0ZWdvcnkyMGInLCAnY2F0ZWdvcnkyMGMnXVxuICAgICAgICB9LFxuICAgICAgICBvcmRpbmFsUGFsZXR0ZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdCdUduJyxcbiAgICAgICAgICBlbnVtOiB1dGlsLmtleXMoY29sb3JicmV3ZXIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBzaGFwZU1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnY2lyY2xlJywgJ3NxdWFyZScsICdjcm9zcycsICdkaWFtb25kJywgJ3RyaWFuZ2xlLXVwJywgJ3RyaWFuZ2xlLWRvd24nXSxcbiAgICAgIGRlZmF1bHQ6ICdjaXJjbGUnXG4gICAgfSxcbiAgICBmaWxsZWQ6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246ICd3aGV0aGVyIHRoZSBzaGFwZVxcJ3MgY29sb3Igc2hvdWxkIGJlIHVzZWQgYXMgZmlsbCBjb2xvciBpbnN0ZWFkIG9mIHN0cm9rZSBjb2xvcidcbiAgICB9XG4gIH1cbn07XG5cbnZhciBkZXRhaWxNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBsaW5lOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZX1cbn07XG5cbnZhciByb3dNaXhpbiA9IHtcbiAgcHJvcGVydGllczoge1xuICAgIGhlaWdodDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVmYXVsdDogMTUwXG4gICAgfVxuICB9XG59O1xuXG52YXIgY29sTWl4aW4gPSB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICB3aWR0aDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVmYXVsdDogMTUwXG4gICAgfSxcbiAgICBheGlzOiB7XG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG1heExhYmVsTGVuZ3RoOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IDEyLFxuICAgICAgICAgIG1pbmltdW06IDAsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUcnVuY2F0ZSBsYWJlbHMgdGhhdCBhcmUgdG9vIGxvbmcuJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgZmFjZXRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBiYXI6IHRydWUsIGxpbmU6IHRydWUsIGFyZWE6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlLCB0ZXh0OiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHBhZGRpbmc6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIG1heGltdW06IDEsXG4gICAgICBkZWZhdWx0OiAwLjFcbiAgICB9XG4gIH1cbn07XG5cbnZhciByZXF1aXJlZE5hbWVUeXBlID0ge1xuICByZXF1aXJlZDogWyduYW1lJywgJ3R5cGUnXVxufTtcblxudmFyIG11bHRpUm9sZUZpZWxkID0gbWVyZ2UoY2xvbmUodHlwaWNhbEZpZWxkKSwge1xuICBzdXBwb3J0ZWRSb2xlOiB7XG4gICAgbWVhc3VyZTogdHJ1ZSxcbiAgICBkaW1lbnNpb246IHRydWVcbiAgfVxufSk7XG5cbnZhciBxdWFudGl0YXRpdmVGaWVsZCA9IG1lcmdlKGNsb25lKHR5cGljYWxGaWVsZCksIHtcbiAgc3VwcG9ydGVkUm9sZToge1xuICAgIG1lYXN1cmU6IHRydWUsXG4gICAgZGltZW5zaW9uOiAnb3JkaW5hbC1vbmx5JyAvLyB1c2luZyBzaXplIHRvIGVuY29kaW5nIGNhdGVnb3J5IGxlYWQgdG8gb3JkZXIgaW50ZXJwcmV0YXRpb25cbiAgfVxufSk7XG5cbnZhciBvbmx5UXVhbnRpdGF0aXZlRmllbGQgPSBtZXJnZShjbG9uZSh0eXBpY2FsRmllbGQpLCB7XG4gIHN1cHBvcnRlZFJvbGU6IHtcbiAgICBtZWFzdXJlOiB0cnVlXG4gIH1cbn0pO1xuXG52YXIgeCA9IG1lcmdlKGNsb25lKG11bHRpUm9sZUZpZWxkKSwgYXhpc01peGluLCBiYW5kTWl4aW4sIHJlcXVpcmVkTmFtZVR5cGUsIHNvcnRNaXhpbik7XG52YXIgeSA9IGNsb25lKHgpO1xuXG52YXIgZmFjZXQgPSBtZXJnZShjbG9uZShvbmx5T3JkaW5hbEZpZWxkKSwgcmVxdWlyZWROYW1lVHlwZSwgZmFjZXRNaXhpbiwgc29ydE1peGluKTtcbnZhciByb3cgPSBtZXJnZShjbG9uZShmYWNldCksIGF4aXNNaXhpbiwgcm93TWl4aW4pO1xudmFyIGNvbCA9IG1lcmdlKGNsb25lKGZhY2V0KSwgYXhpc01peGluLCBjb2xNaXhpbik7XG5cbnZhciBzaXplID0gbWVyZ2UoY2xvbmUocXVhbnRpdGF0aXZlRmllbGQpLCBsZWdlbmRNaXhpbiwgc2l6ZU1peGluLCBzb3J0TWl4aW4pO1xudmFyIGNvbG9yID0gbWVyZ2UoY2xvbmUobXVsdGlSb2xlRmllbGQpLCBsZWdlbmRNaXhpbiwgY29sb3JNaXhpbiwgc29ydE1peGluKTtcblxudmFyIHNoYXBlID0gbWVyZ2UoY2xvbmUob25seU9yZGluYWxGaWVsZCksIGxlZ2VuZE1peGluLCBzaGFwZU1peGluLCBzb3J0TWl4aW4pO1xudmFyIGRldGFpbCA9IG1lcmdlKGNsb25lKG9ubHlPcmRpbmFsRmllbGQpLCBkZXRhaWxNaXhpbiwgc29ydE1peGluKTtcblxuLy8gd2Ugb25seSBwdXQgYWdncmVnYXRlZCBtZWFzdXJlIGluIHBpdm90IHRhYmxlXG52YXIgdGV4dCA9IG1lcmdlKGNsb25lKG9ubHlRdWFudGl0YXRpdmVGaWVsZCksIHRleHRNaXhpbiwgc29ydE1peGluKTtcblxuLy8gVE9ETyBhZGQgbGFiZWxcblxudmFyIGZpbHRlciA9IHtcbiAgdHlwZTogJ2FycmF5JyxcbiAgaXRlbXM6IHtcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBvcGVyYW5kczoge1xuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBpdGVtczoge1xuICAgICAgICAgIHR5cGU6IFsnc3RyaW5nJywgJ2Jvb2xlYW4nLCAnaW50ZWdlcicsICdudW1iZXInXVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb3BlcmF0b3I6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGVudW06IFsnPicsICc+PScsICc9JywgJyE9JywgJzwnLCAnPD0nLCAnbm90TnVsbCddXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgZGF0YSA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICAvLyBkYXRhIHNvdXJjZVxuICAgIGZvcm1hdFR5cGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydqc29uJywgJ2NzdiddLFxuICAgICAgZGVmYXVsdDogJ2pzb24nXG4gICAgfSxcbiAgICB1cmw6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICB2YWx1ZXM6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1Bhc3MgYXJyYXkgb2Ygb2JqZWN0cyBpbnN0ZWFkIG9mIGEgdXJsIHRvIGEgZmlsZS4nLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgY29uZmlnID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIC8vIHRlbXBsYXRlXG4gICAgd2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgaGVpZ2h0OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIHZpZXdwb3J0OiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICB9LFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBncmlkQ29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICdibGFjaydcbiAgICB9LFxuICAgIGdyaWRPcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxLFxuICAgICAgZGVmYXVsdDogMC4wOFxuICAgIH0sXG5cbiAgICAvLyBmaWx0ZXIgbnVsbFxuICAgIGZpbHRlck51bGw6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBPOiB7dHlwZTonYm9vbGVhbicsIGRlZmF1bHQ6IGZhbHNlfSxcbiAgICAgICAgUToge3R5cGU6J2Jvb2xlYW4nLCBkZWZhdWx0OiB0cnVlfSxcbiAgICAgICAgVDoge3R5cGU6J2Jvb2xlYW4nLCBkZWZhdWx0OiB0cnVlfVxuICAgICAgfVxuICAgIH0sXG4gICAgdG9nZ2xlU29ydDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiBPXG4gICAgfSxcblxuICAgIC8vIHNpbmdsZSBwbG90XG4gICAgc2luZ2xlSGVpZ2h0OiB7XG4gICAgICAvLyB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IGJhbmRXaWR0aCAqIChjYXJkaW5hbGl0eSArIHBhZGRpbmcpXG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyMDAsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBzaW5nbGVXaWR0aDoge1xuICAgICAgLy8gd2lsbCBiZSBvdmVyd3JpdHRlbiBieSBiYW5kV2lkdGggKiAoY2FyZGluYWxpdHkgKyBwYWRkaW5nKVxuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjAwLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgLy8gYmFuZCBzaXplXG4gICAgbGFyZ2VCYW5kU2l6ZToge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjEsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBzbWFsbEJhbmRTaXplOiB7XG4gICAgICAvL3NtYWxsIG11bHRpcGxlcyBvciBzaW5nbGUgcGxvdCB3aXRoIGhpZ2ggY2FyZGluYWxpdHlcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDEyLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgbGFyZ2VCYW5kTWF4Q2FyZGluYWxpdHk6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDEwXG4gICAgfSxcbiAgICAvLyBzbWFsbCBtdWx0aXBsZXNcbiAgICBjZWxsUGFkZGluZzoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAwLjFcbiAgICB9LFxuICAgIGNlbGxHcmlkQ29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICdibGFjaydcbiAgICB9LFxuICAgIGNlbGxHcmlkT3BhY2l0eToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgbWF4aW11bTogMSxcbiAgICAgIGRlZmF1bHQ6IDAuMTVcbiAgICB9LFxuICAgIGNlbGxCYWNrZ3JvdW5kQ29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcbiAgICB9LFxuICAgIHRleHRDZWxsV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDkwLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG5cbiAgICAvLyBtYXJrc1xuICAgIHN0cm9rZVdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgc2luZ2xlQmFyT2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiA1LFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgLy8gc2NhbGVzXG4gICAgdGltZVNjYWxlTGFiZWxMZW5ndGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDMsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVzY3JpcHRpb246ICdNYXggbGVuZ3RoIGZvciB2YWx1ZXMgaW4gZGF5U2NhbGVMYWJlbCBhbmQgbW9udGhTY2FsZUxhYmVsLiAgWmVybyBtZWFucyB1c2luZyBmdWxsIG5hbWVzIGluIGRheVNjYWxlTGFiZWwvbW9udGhTY2FsZUxhYmVsLidcbiAgICB9LFxuICAgIGRheVNjYWxlTGFiZWw6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGRlZmF1bHQ6IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXhpcyBsYWJlbHMgZm9yIGRheSBvZiB3ZWVrLCBzdGFydGluZyBmcm9tIFN1bmRheS4nICtcbiAgICAgICAgJyhDb25zaXN0ZW50IHdpdGggSmF2YXNjcmlwdCAtLSBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRGF0ZS9nZXREYXkuJ1xuICAgIH0sXG4gICAgbW9udGhTY2FsZUxhYmVsOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0OiBbJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXhpcyBsYWJlbHMgZm9yIG1vbnRoLidcbiAgICB9LFxuICAgIC8vIG90aGVyXG4gICAgY2hhcmFjdGVyV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDZcbiAgICB9LFxuICAgIG1heFNtYWxsTnVtYmVyOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDEwMDAwLFxuICAgICAgZGVzY3JpcHRpb246ICdtYXhpbXVtIG51bWJlciB0aGF0IGEgZmllbGQgd2lsbCBiZSBjb25zaWRlcmVkIHNtYWxsTnVtYmVyLicrXG4gICAgICAgICAgICAgICAgICAgJ1VzZWQgZm9yIGF4aXMgbGFiZWxsaW5nLidcbiAgICB9LFxuICAgIHNtYWxsTnVtYmVyRm9ybWF0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgZGVzY3JpcHRpb246ICdEMyBOdW1iZXIgZm9ybWF0IGZvciBheGlzIGxhYmVscyBhbmQgdGV4dCB0YWJsZXMgJytcbiAgICAgICAgICAgICAgICAgICAnZm9yIG51bWJlciA8PSBtYXhTbWFsbE51bWJlci4gVXNlZCBmb3IgYXhpcyBsYWJlbGxpbmcuJ1xuICAgIH0sXG4gICAgbGFyZ2VOdW1iZXJGb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJy4zcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0QzIE51bWJlciBmb3JtYXQgZm9yIGF4aXMgbGFiZWxzIGFuZCB0ZXh0IHRhYmxlcyAnICtcbiAgICAgICAgICAgICAgICAgICAnZm9yIG51bWJlciA+IG1heFNtYWxsTnVtYmVyLidcbiAgICB9LFxuICAgIHRpbWVGb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJyVZLSVtLSVkJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGF0ZSBmb3JtYXQgZm9yIGF4aXMgbGFiZWxzLidcbiAgICB9LFxuICAgIHVzZVJhd0RvbWFpbjoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ1VzZSB0aGUgcmF3IGRhdGEgcmFuZ2UgYXMgc2NhbGUgZG9tYWluIGluc3RlYWQgb2YgJyArXG4gICAgICAgICAgICAgICAgICAgJ2FnZ3JlZ2F0ZWQgZGF0YSBmb3IgYWdncmVnYXRlIGF4aXMuICcgK1xuICAgICAgICAgICAgICAgICAgICdUaGlzIG9wdGlvbiBkb2VzIG5vdCB3b3JrIHdpdGggc3VtIG9yIGNvdW50IGFnZ3JlZ2F0ZScgK1xuICAgICAgICAgICAgICAgICAgICdhcyB0aGV5IG1pZ2h0IGhhdmUgYSBzdWJzdGFudGlhbGx5IGxhcmdlciBzY2FsZSByYW5nZS4nICtcbiAgICAgICAgICAgICAgICAgICAnQnkgZGVmYXVsdCwgdXNlIHZhbHVlIGZyb20gY29uZmlnLnVzZVJhd0RvbWFpbi4nXG4gICAgfVxuICB9XG59O1xuXG4vKiogQHR5cGUgT2JqZWN0IFNjaGVtYSBvZiBhIHZlZ2EtbGl0ZSBzcGVjaWZpY2F0aW9uICovXG5zY2hlbWEuc2NoZW1hID0ge1xuICAkc2NoZW1hOiAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNC9zY2hlbWEjJyxcbiAgZGVzY3JpcHRpb246ICdTY2hlbWEgZm9yIFZlZ2EtbGl0ZSBzcGVjaWZpY2F0aW9uJyxcbiAgdHlwZTogJ29iamVjdCcsXG4gIHJlcXVpcmVkOiBbJ21hcmt0eXBlJywgJ2VuY29kaW5nJywgJ2RhdGEnXSxcbiAgcHJvcGVydGllczoge1xuICAgIGRhdGE6IGRhdGEsXG4gICAgbWFya3R5cGU6IHNjaGVtYS5tYXJrdHlwZSxcbiAgICBlbmNvZGluZzoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHksXG4gICAgICAgIHJvdzogcm93LFxuICAgICAgICBjb2w6IGNvbCxcbiAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBzaGFwZTogc2hhcGUsXG4gICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgIGRldGFpbDogZGV0YWlsXG4gICAgICB9XG4gICAgfSxcbiAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICBjb25maWc6IGNvbmZpZ1xuICB9XG59O1xuXG5zY2hlbWEuZW5jVHlwZXMgPSB1dGlsLmtleXMoc2NoZW1hLnNjaGVtYS5wcm9wZXJ0aWVzLmVuY29kaW5nLnByb3BlcnRpZXMpO1xuXG4vKiogSW5zdGFudGlhdGUgYSB2ZXJib3NlIHZsIHNwZWMgZnJvbSB0aGUgc2NoZW1hICovXG5zY2hlbWEuaW5zdGFudGlhdGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHNjaGVtYS51dGlsLmluc3RhbnRpYXRlKHNjaGVtYS5zY2hlbWEpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNjaGVtYXV0aWwgPSBtb2R1bGUuZXhwb3J0cyA9IHt9LFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59O1xuXG5zY2hlbWF1dGlsLmV4dGVuZCA9IGZ1bmN0aW9uKGluc3RhbmNlLCBzY2hlbWEpIHtcbiAgcmV0dXJuIHNjaGVtYXV0aWwubWVyZ2Uoc2NoZW1hdXRpbC5pbnN0YW50aWF0ZShzY2hlbWEpLCBpbnN0YW5jZSk7XG59O1xuXG4vLyBpbnN0YW50aWF0ZSBhIHNjaGVtYVxuc2NoZW1hdXRpbC5pbnN0YW50aWF0ZSA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgdmFsO1xuICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKCdkZWZhdWx0JyBpbiBzY2hlbWEpIHtcbiAgICB2YWwgPSBzY2hlbWEuZGVmYXVsdDtcbiAgICByZXR1cm4gdXRpbC5pc09iamVjdCh2YWwpID8gdXRpbC5kdXBsaWNhdGUodmFsKSA6IHZhbDtcbiAgfSBlbHNlIGlmIChzY2hlbWEudHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSB7fTtcbiAgICBmb3IgKHZhciBuYW1lIGluIHNjaGVtYS5wcm9wZXJ0aWVzKSB7XG4gICAgICB2YWwgPSBzY2hlbWF1dGlsLmluc3RhbnRpYXRlKHNjaGVtYS5wcm9wZXJ0aWVzW25hbWVdKTtcbiAgICAgIGlmICh2YWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpbnN0YW5jZVtuYW1lXSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2UgaWYgKHNjaGVtYS50eXBlID09PSAnYXJyYXknKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG4vLyByZW1vdmUgYWxsIGRlZmF1bHRzIGZyb20gYW4gaW5zdGFuY2VcbnNjaGVtYXV0aWwuc3VidHJhY3QgPSBmdW5jdGlvbihpbnN0YW5jZSwgZGVmYXVsdHMpIHtcbiAgdmFyIGNoYW5nZXMgPSB7fTtcbiAgZm9yICh2YXIgcHJvcCBpbiBpbnN0YW5jZSkge1xuICAgIHZhciBkZWYgPSBkZWZhdWx0c1twcm9wXTtcbiAgICB2YXIgaW5zID0gaW5zdGFuY2VbcHJvcF07XG4gICAgLy8gTm90ZTogZG9lcyBub3QgcHJvcGVybHkgc3VidHJhY3QgYXJyYXlzXG4gICAgaWYgKCFkZWZhdWx0cyB8fCBkZWYgIT09IGlucykge1xuICAgICAgaWYgKHR5cGVvZiBpbnMgPT09ICdvYmplY3QnICYmICF1dGlsLmlzQXJyYXkoaW5zKSAmJiBkZWYpIHtcbiAgICAgICAgdmFyIGMgPSBzY2hlbWF1dGlsLnN1YnRyYWN0KGlucywgZGVmKTtcbiAgICAgICAgaWYgKCFpc0VtcHR5KGMpKVxuICAgICAgICAgIGNoYW5nZXNbcHJvcF0gPSBjO1xuICAgICAgfSBlbHNlIGlmICghdXRpbC5pc0FycmF5KGlucykgfHwgaW5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2hhbmdlc1twcm9wXSA9IGlucztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNoYW5nZXM7XG59O1xuXG5zY2hlbWF1dGlsLm1lcmdlID0gZnVuY3Rpb24oLypkZXN0Kiwgc3JjMCwgc3JjMSwgLi4uKi8pe1xuICB2YXIgZGVzdCA9IGFyZ3VtZW50c1swXTtcbiAgZm9yICh2YXIgaT0xIDsgaTxhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBkZXN0ID0gbWVyZ2UoZGVzdCwgYXJndW1lbnRzW2ldKTtcbiAgfVxuICByZXR1cm4gZGVzdDtcbn07XG5cbi8vIHJlY3Vyc2l2ZWx5IG1lcmdlcyBzcmMgaW50byBkZXN0XG5mdW5jdGlvbiBtZXJnZShkZXN0LCBzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgIT09ICdvYmplY3QnIHx8IHNyYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBkZXN0O1xuICB9XG5cbiAgZm9yICh2YXIgcCBpbiBzcmMpIHtcbiAgICBpZiAoIXNyYy5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzcmNbcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc3JjW3BdICE9PSAnb2JqZWN0JyB8fCBzcmNbcF0gPT09IG51bGwpIHtcbiAgICAgIGRlc3RbcF0gPSBzcmNbcF07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVzdFtwXSAhPT0gJ29iamVjdCcgfHwgZGVzdFtwXSA9PT0gbnVsbCkge1xuICAgICAgZGVzdFtwXSA9IG1lcmdlKHNyY1twXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgPyBbXSA6IHt9LCBzcmNbcF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXJnZShkZXN0W3BdLCBzcmNbcF0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVzdDtcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdkYXRhbGliL3NyYy91dGlsJyk7XG5cbnV0aWwuZXh0ZW5kKHV0aWwsIHJlcXVpcmUoJ2RhdGFsaWIvc3JjL2dlbmVyYXRlJykpO1xudXRpbC5leHRlbmQodXRpbCwgcmVxdWlyZSgnZGF0YWxpYi9zcmMvc3RhdHMnKSk7XG51dGlsLmJpbiA9IHJlcXVpcmUoJ2RhdGFsaWIvc3JjL2JpbnMvYmlucycpO1xuXG51dGlsLmlzaW4gPSBmdW5jdGlvbihpdGVtLCBhcnJheSkge1xuICByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtKSAhPT0gLTE7XG59O1xuXG51dGlsLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGYsIHRoaXNBcmcpIHtcbiAgaWYgKG9iai5mb3JFYWNoKSB7XG4gICAgb2JqLmZvckVhY2guY2FsbCh0aGlzQXJnLCBmKTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgICAgZi5jYWxsKHRoaXNBcmcsIG9ialtrXSwgayAsIG9iaik7XG4gICAgfVxuICB9XG59O1xuXG51dGlsLnJlZHVjZSA9IGZ1bmN0aW9uKG9iaiwgZiwgaW5pdCwgdGhpc0FyZykge1xuICBpZiAob2JqLnJlZHVjZSkge1xuICAgIHJldHVybiBvYmoucmVkdWNlLmNhbGwodGhpc0FyZywgZiwgaW5pdCk7XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgIGluaXQgPSBmLmNhbGwodGhpc0FyZywgaW5pdCwgb2JqW2tdLCBrLCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gaW5pdDtcbiAgfVxufTtcblxudXRpbC5tYXAgPSBmdW5jdGlvbihvYmosIGYsIHRoaXNBcmcpIHtcbiAgaWYgKG9iai5tYXApIHtcbiAgICByZXR1cm4gb2JqLm1hcC5jYWxsKHRoaXNBcmcsIGYpO1xuICB9IGVsc2Uge1xuICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgICAgb3V0cHV0LnB1c2goIGYuY2FsbCh0aGlzQXJnLCBvYmpba10sIGssIG9iaikpO1xuICAgIH1cbiAgfVxufTtcblxudXRpbC5hbnkgPSBmdW5jdGlvbihhcnIsIGYpIHtcbiAgdmFyIGkgPSAwLCBrO1xuICBmb3IgKGsgaW4gYXJyKSB7XG4gICAgaWYgKGYoYXJyW2tdLCBrLCBpKyspKSByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG51dGlsLmFsbCA9IGZ1bmN0aW9uKGFyciwgZikge1xuICB2YXIgaSA9IDAsIGs7XG4gIGZvciAoayBpbiBhcnIpIHtcbiAgICBpZiAoIWYoYXJyW2tdLCBrLCBpKyspKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG51dGlsLmdldGJpbnMgPSBmdW5jdGlvbihzdGF0cywgbWF4Ymlucykge1xuICByZXR1cm4gdXRpbC5iaW4oe1xuICAgIG1pbjogc3RhdHMubWluLFxuICAgIG1heDogc3RhdHMubWF4LFxuICAgIG1heGJpbnM6IG1heGJpbnNcbiAgfSk7XG59O1xuXG4vKipcbiAqIHhbcFswXV0uLi5bcFtuXV0gPSB2YWxcbiAqIEBwYXJhbSBub2F1Z21lbnQgZGV0ZXJtaW5lIHdoZXRoZXIgbmV3IG9iamVjdCBzaG91bGQgYmUgYWRkZWQgZlxuICogb3Igbm9uLWV4aXN0aW5nIHByb3BlcnRpZXMgYWxvbmcgdGhlIHBhdGhcbiAqL1xudXRpbC5zZXR0ZXIgPSBmdW5jdGlvbih4LCBwLCB2YWwsIG5vYXVnbWVudCkge1xuICBmb3IgKHZhciBpPTA7IGk8cC5sZW5ndGgtMTsgKytpKSB7XG4gICAgaWYgKCFub2F1Z21lbnQgJiYgIShwW2ldIGluIHgpKXtcbiAgICAgIHggPSB4W3BbaV1dID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSB4W3BbaV1dO1xuICAgIH1cbiAgfVxuICB4W3BbaV1dID0gdmFsO1xufTtcblxuXG4vKipcbiAqIHJldHVybnMgeFtwWzBdXS4uLltwW25dXVxuICogQHBhcmFtIGF1Z21lbnQgZGV0ZXJtaW5lIHdoZXRoZXIgbmV3IG9iamVjdCBzaG91bGQgYmUgYWRkZWQgZlxuICogb3Igbm9uLWV4aXN0aW5nIHByb3BlcnRpZXMgYWxvbmcgdGhlIHBhdGhcbiAqL1xudXRpbC5nZXR0ZXIgPSBmdW5jdGlvbih4LCBwLCBub2F1Z21lbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPHAubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoIW5vYXVnbWVudCAmJiAhKHBbaV0gaW4geCkpe1xuICAgICAgeCA9IHhbcFtpXV0gPSB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgeCA9IHhbcFtpXV07XG4gICAgfVxuICB9XG4gIHJldHVybiB4O1xufTtcblxudXRpbC5lcnJvciA9IGZ1bmN0aW9uKG1zZykge1xuICBjb25zb2xlLmVycm9yKCdbVkwgRXJyb3JdJywgbXNnKTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9nbG9iYWxzJyk7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gICAgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKTtcblxudmFyIHZsID0ge307XG5cbnV0aWwuZXh0ZW5kKHZsLCBjb25zdHMsIHV0aWwpO1xuXG52bC5FbmNvZGluZyA9IHJlcXVpcmUoJy4vRW5jb2RpbmcnKTtcbnZsLmNvbXBpbGVyID0gcmVxdWlyZSgnLi9jb21waWxlci9jb21waWxlcicpO1xudmwuY29tcGlsZSA9IHZsLmNvbXBpbGVyLmNvbXBpbGU7XG52bC5kYXRhID0gcmVxdWlyZSgnLi9kYXRhJyk7XG52bC5lbmMgPSByZXF1aXJlKCcuL2VuYycpO1xudmwuZmllbGQgPSByZXF1aXJlKCcuL2ZpZWxkJyk7XG52bC5zY2hlbWEgPSByZXF1aXJlKCcuL3NjaGVtYS9zY2hlbWEnKTtcbnZsLnRvU2hvcnRoYW5kID0gdmwuRW5jb2Rpbmcuc2hvcnRoYW5kO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZsOyJdfQ==
