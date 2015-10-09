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

  function Color() {}var reHex3 = /^#([0-9a-f]{3})$/;
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
        : named.hasOwnProperty(format) ? rgbn(named[format])
        : null;
  }function rgbn(n) {
    return rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff);
  }

  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

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
  }function Rgb(r, g, b) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
  }var ____prototype = rgb.prototype = Rgb.prototype = new Color;

  ____prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k);
  };

  ____prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k);
  };

  ____prototype.rgb = function() {
    return this;
  };

  ____prototype.displayable = function() {
    return (0 <= this.r && this.r <= 255)
        && (0 <= this.g && this.g <= 255)
        && (0 <= this.b && this.b <= 255);
  };

  ____prototype.toString = function() {
    return _format(this.r, this.g, this.b);
  };

  function _format(r, g, b) {
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
  }function Hsl(h, s, l) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
  }var ___prototype = hsl.prototype = Hsl.prototype = new Color;

  ___prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k);
  };

  ___prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k);
  };

  ___prototype.rgb = function() {
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

  ___prototype.displayable = function() {
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
  }function Lab(l, a, b) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
  }var __prototype = lab.prototype = Lab.prototype = new Color;

  __prototype.brighter = function(k) {
    return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b);
  };

  __prototype.darker = function(k) {
    return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b);
  };

  __prototype.rgb = function() {
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
  }function Hcl(h, c, l) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
  }var _prototype = hcl.prototype = Hcl.prototype = new Color;

  _prototype.brighter = function(k) {
    return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k));
  };

  _prototype.darker = function(k) {
    return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k));
  };

  _prototype.rgb = function() {
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
  }function Cubehelix(h, s, l) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
  }var prototype = cubehelix.prototype = Cubehelix.prototype = new Color;

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
      return _format(Math.round(ar + br * t), Math.round(ag + bg * t), Math.round(ab + bb * t));
    };
  }

  var interpolateCubehelix = interpolateCubehelixGamma(1);
  var interpolateCubehelixLong = interpolateCubehelixGammaLong(1);

  exports.interpolateCubehelix = interpolateCubehelix;
  exports.interpolateCubehelixLong = interpolateCubehelixLong;
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

  var jaJp = {
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["", "円"]
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
      .set("ja-JP", jaJp)
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

},{"./consts":21,"./enc":23,"./field":24,"./globals":25,"./schema/schema":27,"./util":29}],8:[function(require,module,exports){
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

  if (name === COL) return 'top';

  // x-axis for long y - put on top
  if (name === X && encoding.has(Y) && encoding.isOrdinalScale(Y) && encoding.cardinality(Y, stats) > 30) {
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

},{"../globals":25,"../util":29,"./time":20}],9:[function(require,module,exports){
'use strict';

var summary = module.exports = require('datalib/src/stats').summary;

require('../globals');

/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
var compiler = module.exports = {};

var Encoding = require('../Encoding'),
  axis = compiler.axis = require('./axis'),
  legend = compiler.legend = require('./legend'),
  marks = compiler.marks = require('./marks'),
  scale = compiler.scale = require('./scale');

compiler.data = require('./data');
compiler.facet = require('./facet');
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

/**
 * Create a Vega specification from a Vega-lite Encoding object.
 */
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
      scales: compiler.time.scales(encoding),
      marks: [{
        _name: 'cell',
        type: 'group',
        properties: {
          enter: {
            width: layout.cellWidth ? {value: layout.cellWidth} : {group: 'width'},
            height: layout.cellHeight ? {value: layout.cellHeight} : {group: 'height'}
          }
        }
      }]
    };

  var group = spec.marks[0];

  // FIXME remove compiler.sort after migrating to vega 2.
  spec.data = compiler.sort(spec.data, encoding, stats); // append new data

  // marks
  var style = compiler.style(encoding, stats),
    mdefs = group.marks = marks.def(encoding, layout, style, stats),
    mdef = mdefs[mdefs.length - 1];  // TODO: remove this dirty hack by refactoring the whole flow

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


},{"../Encoding":7,"../globals":25,"./axis":8,"./data":10,"./facet":11,"./layout":12,"./legend":13,"./marks":14,"./scale":15,"./sort":16,"./stack":17,"./style":18,"./subfacet":19,"./time":20,"datalib/src/stats":35}],10:[function(require,module,exports){
'use strict';

require('../globals');

module.exports = data;

var vlfield = require('../field'),
  util = require('../util'),
  time = require('./time');

/**
 * Create Vega's data array from a given encoding.
 *
 * @param  {Encoding} encoding
 * @return {Array} Array of Vega data.
 *                 This always includes a "raw" data table.
 *                 If the encoding contains aggregate value, this will also create
 *                 aggregate table as well.
 */
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

  // Set data's format.parse if needed
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

/**
 * Generate Vega transforms for the raw data table.  This can include
 * transforms for time unit, binning and filtering.
 */
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
        expr: time.formula(field.timeUnit,
                           encoding.fieldRef(encType, {nofn: true, d: true})
                          )
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

},{"../field":24,"../globals":25,"../util":29,"./time":20}],11:[function(require,module,exports){
'use strict';

require('../globals');

var util = require('../util');

var axis = require('./axis'),
  scale = require('./scale');

module.exports = faceting;

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

},{"../globals":25,"../util":29,"./axis":8,"./scale":15}],12:[function(require,module,exports){
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

// TODO(#600) revise this
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

},{"../globals":25,"../util":29,"./time":20,"d3-format":5}],13:[function(require,module,exports){
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

},{"../globals":25,"../util":29,"./time":20}],14:[function(require,module,exports){
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

},{"../globals":25}],15:[function(require,module,exports){
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

},{"../globals":25,"../schema/schema":27,"../util":29,"./sort":16,"./time":20,"colorbrewer":3,"d3-color":4}],16:[function(require,module,exports){
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


},{"../field":24,"../globals":25}],17:[function(require,module,exports){
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

},{"../globals":25,"./marks":14}],18:[function(require,module,exports){
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


},{"../field":24,"../globals":25}],19:[function(require,module,exports){
'use strict';

require('../globals');

module.exports = subfaceting;

function subfaceting(group, mdef, details, stack, encoding) {
  var m = group.marks;
  var g = {
    _name: 'subfacet',
    type: 'group',
    from: mdef.from,
    properties: {
      enter: {
        width: {group: 'width'},
        height: {group: 'height'}
      }
    },
    marks: m
  };

  group.marks = [g];
  delete mdef.from; // (move to the new g)

  //TODO test LOD -- we should support stack / line without color (LOD) field
  var trans = (g.from.transform || (g.from.transform = []));
  trans.unshift({type: 'facet', keys: details});

  if (stack && encoding.has(COLOR)) {
    trans.unshift({type: 'sort', by: encoding.fieldRef(COLOR)});
  }
}

},{"../globals":25}],20:[function(require,module,exports){
'use strict';

var util = require('../util'),
  d3_time_format = require('d3-time-format');

var time = module.exports = {};

// 'Wednesday September 17 04:00:00 2014'
// Wednesday is the longest date
// September is the longest month (8 in javascript as it is zero-indexed).
var LONG_DATE = new Date(Date.UTC(2014, 8, 17));

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
  // TODO(#600) revise this
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

},{"../util":29,"d3-time-format":6}],21:[function(require,module,exports){
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

},{"./globals":25}],22:[function(require,module,exports){
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
},{"./globals":25,"datalib/src/stats":35}],23:[function(require,module,exports){
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

},{"./consts":21,"./field":24,"./schema/schema":27,"./util":29}],24:[function(require,module,exports){
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

},{"./compiler/time":20,"./consts":21,"./globals":25,"./schema/schema":27,"./util":29}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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
        /* Common Scale Properties */
        type: schema.scale_type,
        reverse: {
          type: 'boolean',
          default: false,
          supportedTypes: toMap([Q, T])
        },

        /* Quantitative Scale Properties */
        nice: {
          type: 'string',
          enum: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'],
          supportedTypes: toMap([T])
        },
        zero: {
          type: 'boolean',
          description: 'Include zero',
          default: true,
          supportedTypes: toMap([Q, T])
        },

        /* Vega-lite only Properties */
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
        /* Vega Axis Properties */
        format: {
          type: 'string',
          default: undefined,  // auto
          description: 'The formatting pattern for axis labels. '+
                       'If not undefined, this will be determined by ' +
                       'small/largeNumberFormat and the max value ' +
                       'of the field.'
        },
        grid: {
          type: 'boolean',
          default: true,
          description: 'A flag indicate if gridlines should be created in addition to ticks.'
        },
        layer: {
          type: 'string',
          default: 'back',
          description: 'A string indicating if the axis (and any gridlines) should be placed above or below the data marks. One of "front" (default) or "back".'
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
        /* Vega Axis Properties that are automatically populated by Vega-lite */
        title: {
          type: 'string',
          default: undefined,
          description: 'A title for the axis. (Shows field name and its function by default.)'
        },
        /* Vega-lite only */
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
    // TODO(#597) revise this config
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

},{"../globals":25,"../util":29,"./schemautil":28,"colorbrewer":3}],28:[function(require,module,exports){
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
},{"../util":29}],29:[function(require,module,exports){
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


},{"./logger":26,"datalib/src/bins/bins":32,"datalib/src/generate":33,"datalib/src/stats":35,"datalib/src/util":37}],30:[function(require,module,exports){
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
},{"./Encoding":7,"./compiler/compiler":9,"./consts":21,"./data":22,"./enc":23,"./field":24,"./globals":25,"./schema/schema":27,"./util":29,"d3-format":5}],31:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
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

},{"../time":36,"../util":37}],33:[function(require,module,exports){
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
},{}],34:[function(require,module,exports){
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
},{"../util":37}],35:[function(require,module,exports){
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
},{"./generate":33,"./import/type":34,"./util":37}],36:[function(require,module,exports){
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

},{"d3-time":31}],37:[function(require,module,exports){
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

},{"./time":36,"buffer":1}]},{},[30])(30)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2NvbG9yYnJld2VyL2NvbG9yYnJld2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvbG9yYnJld2VyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2QzLWNvbG9yL2J1aWxkL2NvbG9yLmpzIiwibm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9idWlsZC9mb3JtYXQuanMiLCJub2RlX21vZHVsZXMvZDMtdGltZS1mb3JtYXQvYnVpbGQvdGltZUZvcm1hdC5qcyIsInNyYy9FbmNvZGluZy5qcyIsInNyYy9jb21waWxlci9heGlzLmpzIiwic3JjL2NvbXBpbGVyL2NvbXBpbGVyLmpzIiwic3JjL2NvbXBpbGVyL2RhdGEuanMiLCJzcmMvY29tcGlsZXIvZmFjZXQuanMiLCJzcmMvY29tcGlsZXIvbGF5b3V0LmpzIiwic3JjL2NvbXBpbGVyL2xlZ2VuZC5qcyIsInNyYy9jb21waWxlci9tYXJrcy5qcyIsInNyYy9jb21waWxlci9zY2FsZS5qcyIsInNyYy9jb21waWxlci9zb3J0LmpzIiwic3JjL2NvbXBpbGVyL3N0YWNrLmpzIiwic3JjL2NvbXBpbGVyL3N0eWxlLmpzIiwic3JjL2NvbXBpbGVyL3N1YmZhY2V0LmpzIiwic3JjL2NvbXBpbGVyL3RpbWUuanMiLCJzcmMvY29uc3RzLmpzIiwic3JjL2RhdGEuanMiLCJzcmMvZW5jLmpzIiwic3JjL2ZpZWxkLmpzIiwic3JjL2dsb2JhbHMuanMiLCJzcmMvbG9nZ2VyLmpzIiwic3JjL3NjaGVtYS9zY2hlbWEuanMiLCJzcmMvc2NoZW1hL3NjaGVtYXV0aWwuanMiLCJzcmMvdXRpbC5qcyIsInNyYy92bCIsIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2RhdGFsaWIvbm9kZV9tb2R1bGVzL2QzLXRpbWUvYnVpbGQvdGltZS5qcyIsIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL2JpbnMvYmlucy5qcyIsIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL2dlbmVyYXRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvaW1wb3J0L3R5cGUuanMiLCIuLi8uLi8uLi8uLi8uLi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy9zdGF0cy5qcyIsIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL3RpbWUuanMiLCIuLi8uLi8uLi8uLi8uLi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0b0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbGRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzE0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLG51bGwsIi8vIFRoaXMgcHJvZHVjdCBpbmNsdWRlcyBjb2xvciBzcGVjaWZpY2F0aW9ucyBhbmQgZGVzaWducyBkZXZlbG9wZWQgYnkgQ3ludGhpYSBCcmV3ZXIgKGh0dHA6Ly9jb2xvcmJyZXdlci5vcmcvKS5cbi8vIEphdmFTY3JpcHQgc3BlY3MgYXMgcGFja2FnZWQgaW4gdGhlIEQzIGxpYnJhcnkgKGQzanMub3JnKS4gUGxlYXNlIHNlZSBsaWNlbnNlIGF0IGh0dHA6Ly9jb2xvcmJyZXdlci5vcmcvZXhwb3J0L0xJQ0VOU0UudHh0XG4hZnVuY3Rpb24oKSB7XG5cbnZhciBjb2xvcmJyZXdlciA9IHtZbEduOiB7XG4zOiBbXCIjZjdmY2I5XCIsXCIjYWRkZDhlXCIsXCIjMzFhMzU0XCJdLFxuNDogW1wiI2ZmZmZjY1wiLFwiI2MyZTY5OVwiLFwiIzc4YzY3OVwiLFwiIzIzODQ0M1wiXSxcbjU6IFtcIiNmZmZmY2NcIixcIiNjMmU2OTlcIixcIiM3OGM2NzlcIixcIiMzMWEzNTRcIixcIiMwMDY4MzdcIl0sXG42OiBbXCIjZmZmZmNjXCIsXCIjZDlmMGEzXCIsXCIjYWRkZDhlXCIsXCIjNzhjNjc5XCIsXCIjMzFhMzU0XCIsXCIjMDA2ODM3XCJdLFxuNzogW1wiI2ZmZmZjY1wiLFwiI2Q5ZjBhM1wiLFwiI2FkZGQ4ZVwiLFwiIzc4YzY3OVwiLFwiIzQxYWI1ZFwiLFwiIzIzODQ0M1wiLFwiIzAwNWEzMlwiXSxcbjg6IFtcIiNmZmZmZTVcIixcIiNmN2ZjYjlcIixcIiNkOWYwYTNcIixcIiNhZGRkOGVcIixcIiM3OGM2NzlcIixcIiM0MWFiNWRcIixcIiMyMzg0NDNcIixcIiMwMDVhMzJcIl0sXG45OiBbXCIjZmZmZmU1XCIsXCIjZjdmY2I5XCIsXCIjZDlmMGEzXCIsXCIjYWRkZDhlXCIsXCIjNzhjNjc5XCIsXCIjNDFhYjVkXCIsXCIjMjM4NDQzXCIsXCIjMDA2ODM3XCIsXCIjMDA0NTI5XCJdXG59LFlsR25CdToge1xuMzogW1wiI2VkZjhiMVwiLFwiIzdmY2RiYlwiLFwiIzJjN2ZiOFwiXSxcbjQ6IFtcIiNmZmZmY2NcIixcIiNhMWRhYjRcIixcIiM0MWI2YzRcIixcIiMyMjVlYThcIl0sXG41OiBbXCIjZmZmZmNjXCIsXCIjYTFkYWI0XCIsXCIjNDFiNmM0XCIsXCIjMmM3ZmI4XCIsXCIjMjUzNDk0XCJdLFxuNjogW1wiI2ZmZmZjY1wiLFwiI2M3ZTliNFwiLFwiIzdmY2RiYlwiLFwiIzQxYjZjNFwiLFwiIzJjN2ZiOFwiLFwiIzI1MzQ5NFwiXSxcbjc6IFtcIiNmZmZmY2NcIixcIiNjN2U5YjRcIixcIiM3ZmNkYmJcIixcIiM0MWI2YzRcIixcIiMxZDkxYzBcIixcIiMyMjVlYThcIixcIiMwYzJjODRcIl0sXG44OiBbXCIjZmZmZmQ5XCIsXCIjZWRmOGIxXCIsXCIjYzdlOWI0XCIsXCIjN2ZjZGJiXCIsXCIjNDFiNmM0XCIsXCIjMWQ5MWMwXCIsXCIjMjI1ZWE4XCIsXCIjMGMyYzg0XCJdLFxuOTogW1wiI2ZmZmZkOVwiLFwiI2VkZjhiMVwiLFwiI2M3ZTliNFwiLFwiIzdmY2RiYlwiLFwiIzQxYjZjNFwiLFwiIzFkOTFjMFwiLFwiIzIyNWVhOFwiLFwiIzI1MzQ5NFwiLFwiIzA4MWQ1OFwiXVxufSxHbkJ1OiB7XG4zOiBbXCIjZTBmM2RiXCIsXCIjYThkZGI1XCIsXCIjNDNhMmNhXCJdLFxuNDogW1wiI2YwZjllOFwiLFwiI2JhZTRiY1wiLFwiIzdiY2NjNFwiLFwiIzJiOGNiZVwiXSxcbjU6IFtcIiNmMGY5ZThcIixcIiNiYWU0YmNcIixcIiM3YmNjYzRcIixcIiM0M2EyY2FcIixcIiMwODY4YWNcIl0sXG42OiBbXCIjZjBmOWU4XCIsXCIjY2NlYmM1XCIsXCIjYThkZGI1XCIsXCIjN2JjY2M0XCIsXCIjNDNhMmNhXCIsXCIjMDg2OGFjXCJdLFxuNzogW1wiI2YwZjllOFwiLFwiI2NjZWJjNVwiLFwiI2E4ZGRiNVwiLFwiIzdiY2NjNFwiLFwiIzRlYjNkM1wiLFwiIzJiOGNiZVwiLFwiIzA4NTg5ZVwiXSxcbjg6IFtcIiNmN2ZjZjBcIixcIiNlMGYzZGJcIixcIiNjY2ViYzVcIixcIiNhOGRkYjVcIixcIiM3YmNjYzRcIixcIiM0ZWIzZDNcIixcIiMyYjhjYmVcIixcIiMwODU4OWVcIl0sXG45OiBbXCIjZjdmY2YwXCIsXCIjZTBmM2RiXCIsXCIjY2NlYmM1XCIsXCIjYThkZGI1XCIsXCIjN2JjY2M0XCIsXCIjNGViM2QzXCIsXCIjMmI4Y2JlXCIsXCIjMDg2OGFjXCIsXCIjMDg0MDgxXCJdXG59LEJ1R246IHtcbjM6IFtcIiNlNWY1ZjlcIixcIiM5OWQ4YzlcIixcIiMyY2EyNWZcIl0sXG40OiBbXCIjZWRmOGZiXCIsXCIjYjJlMmUyXCIsXCIjNjZjMmE0XCIsXCIjMjM4YjQ1XCJdLFxuNTogW1wiI2VkZjhmYlwiLFwiI2IyZTJlMlwiLFwiIzY2YzJhNFwiLFwiIzJjYTI1ZlwiLFwiIzAwNmQyY1wiXSxcbjY6IFtcIiNlZGY4ZmJcIixcIiNjY2VjZTZcIixcIiM5OWQ4YzlcIixcIiM2NmMyYTRcIixcIiMyY2EyNWZcIixcIiMwMDZkMmNcIl0sXG43OiBbXCIjZWRmOGZiXCIsXCIjY2NlY2U2XCIsXCIjOTlkOGM5XCIsXCIjNjZjMmE0XCIsXCIjNDFhZTc2XCIsXCIjMjM4YjQ1XCIsXCIjMDA1ODI0XCJdLFxuODogW1wiI2Y3ZmNmZFwiLFwiI2U1ZjVmOVwiLFwiI2NjZWNlNlwiLFwiIzk5ZDhjOVwiLFwiIzY2YzJhNFwiLFwiIzQxYWU3NlwiLFwiIzIzOGI0NVwiLFwiIzAwNTgyNFwiXSxcbjk6IFtcIiNmN2ZjZmRcIixcIiNlNWY1ZjlcIixcIiNjY2VjZTZcIixcIiM5OWQ4YzlcIixcIiM2NmMyYTRcIixcIiM0MWFlNzZcIixcIiMyMzhiNDVcIixcIiMwMDZkMmNcIixcIiMwMDQ0MWJcIl1cbn0sUHVCdUduOiB7XG4zOiBbXCIjZWNlMmYwXCIsXCIjYTZiZGRiXCIsXCIjMWM5MDk5XCJdLFxuNDogW1wiI2Y2ZWZmN1wiLFwiI2JkYzllMVwiLFwiIzY3YTljZlwiLFwiIzAyODE4YVwiXSxcbjU6IFtcIiNmNmVmZjdcIixcIiNiZGM5ZTFcIixcIiM2N2E5Y2ZcIixcIiMxYzkwOTlcIixcIiMwMTZjNTlcIl0sXG42OiBbXCIjZjZlZmY3XCIsXCIjZDBkMWU2XCIsXCIjYTZiZGRiXCIsXCIjNjdhOWNmXCIsXCIjMWM5MDk5XCIsXCIjMDE2YzU5XCJdLFxuNzogW1wiI2Y2ZWZmN1wiLFwiI2QwZDFlNlwiLFwiI2E2YmRkYlwiLFwiIzY3YTljZlwiLFwiIzM2OTBjMFwiLFwiIzAyODE4YVwiLFwiIzAxNjQ1MFwiXSxcbjg6IFtcIiNmZmY3ZmJcIixcIiNlY2UyZjBcIixcIiNkMGQxZTZcIixcIiNhNmJkZGJcIixcIiM2N2E5Y2ZcIixcIiMzNjkwYzBcIixcIiMwMjgxOGFcIixcIiMwMTY0NTBcIl0sXG45OiBbXCIjZmZmN2ZiXCIsXCIjZWNlMmYwXCIsXCIjZDBkMWU2XCIsXCIjYTZiZGRiXCIsXCIjNjdhOWNmXCIsXCIjMzY5MGMwXCIsXCIjMDI4MThhXCIsXCIjMDE2YzU5XCIsXCIjMDE0NjM2XCJdXG59LFB1QnU6IHtcbjM6IFtcIiNlY2U3ZjJcIixcIiNhNmJkZGJcIixcIiMyYjhjYmVcIl0sXG40OiBbXCIjZjFlZWY2XCIsXCIjYmRjOWUxXCIsXCIjNzRhOWNmXCIsXCIjMDU3MGIwXCJdLFxuNTogW1wiI2YxZWVmNlwiLFwiI2JkYzllMVwiLFwiIzc0YTljZlwiLFwiIzJiOGNiZVwiLFwiIzA0NWE4ZFwiXSxcbjY6IFtcIiNmMWVlZjZcIixcIiNkMGQxZTZcIixcIiNhNmJkZGJcIixcIiM3NGE5Y2ZcIixcIiMyYjhjYmVcIixcIiMwNDVhOGRcIl0sXG43OiBbXCIjZjFlZWY2XCIsXCIjZDBkMWU2XCIsXCIjYTZiZGRiXCIsXCIjNzRhOWNmXCIsXCIjMzY5MGMwXCIsXCIjMDU3MGIwXCIsXCIjMDM0ZTdiXCJdLFxuODogW1wiI2ZmZjdmYlwiLFwiI2VjZTdmMlwiLFwiI2QwZDFlNlwiLFwiI2E2YmRkYlwiLFwiIzc0YTljZlwiLFwiIzM2OTBjMFwiLFwiIzA1NzBiMFwiLFwiIzAzNGU3YlwiXSxcbjk6IFtcIiNmZmY3ZmJcIixcIiNlY2U3ZjJcIixcIiNkMGQxZTZcIixcIiNhNmJkZGJcIixcIiM3NGE5Y2ZcIixcIiMzNjkwYzBcIixcIiMwNTcwYjBcIixcIiMwNDVhOGRcIixcIiMwMjM4NThcIl1cbn0sQnVQdToge1xuMzogW1wiI2UwZWNmNFwiLFwiIzllYmNkYVwiLFwiIzg4NTZhN1wiXSxcbjQ6IFtcIiNlZGY4ZmJcIixcIiNiM2NkZTNcIixcIiM4Yzk2YzZcIixcIiM4ODQxOWRcIl0sXG41OiBbXCIjZWRmOGZiXCIsXCIjYjNjZGUzXCIsXCIjOGM5NmM2XCIsXCIjODg1NmE3XCIsXCIjODEwZjdjXCJdLFxuNjogW1wiI2VkZjhmYlwiLFwiI2JmZDNlNlwiLFwiIzllYmNkYVwiLFwiIzhjOTZjNlwiLFwiIzg4NTZhN1wiLFwiIzgxMGY3Y1wiXSxcbjc6IFtcIiNlZGY4ZmJcIixcIiNiZmQzZTZcIixcIiM5ZWJjZGFcIixcIiM4Yzk2YzZcIixcIiM4YzZiYjFcIixcIiM4ODQxOWRcIixcIiM2ZTAxNmJcIl0sXG44OiBbXCIjZjdmY2ZkXCIsXCIjZTBlY2Y0XCIsXCIjYmZkM2U2XCIsXCIjOWViY2RhXCIsXCIjOGM5NmM2XCIsXCIjOGM2YmIxXCIsXCIjODg0MTlkXCIsXCIjNmUwMTZiXCJdLFxuOTogW1wiI2Y3ZmNmZFwiLFwiI2UwZWNmNFwiLFwiI2JmZDNlNlwiLFwiIzllYmNkYVwiLFwiIzhjOTZjNlwiLFwiIzhjNmJiMVwiLFwiIzg4NDE5ZFwiLFwiIzgxMGY3Y1wiLFwiIzRkMDA0YlwiXVxufSxSZFB1OiB7XG4zOiBbXCIjZmRlMGRkXCIsXCIjZmE5ZmI1XCIsXCIjYzUxYjhhXCJdLFxuNDogW1wiI2ZlZWJlMlwiLFwiI2ZiYjRiOVwiLFwiI2Y3NjhhMVwiLFwiI2FlMDE3ZVwiXSxcbjU6IFtcIiNmZWViZTJcIixcIiNmYmI0YjlcIixcIiNmNzY4YTFcIixcIiNjNTFiOGFcIixcIiM3YTAxNzdcIl0sXG42OiBbXCIjZmVlYmUyXCIsXCIjZmNjNWMwXCIsXCIjZmE5ZmI1XCIsXCIjZjc2OGExXCIsXCIjYzUxYjhhXCIsXCIjN2EwMTc3XCJdLFxuNzogW1wiI2ZlZWJlMlwiLFwiI2ZjYzVjMFwiLFwiI2ZhOWZiNVwiLFwiI2Y3NjhhMVwiLFwiI2RkMzQ5N1wiLFwiI2FlMDE3ZVwiLFwiIzdhMDE3N1wiXSxcbjg6IFtcIiNmZmY3ZjNcIixcIiNmZGUwZGRcIixcIiNmY2M1YzBcIixcIiNmYTlmYjVcIixcIiNmNzY4YTFcIixcIiNkZDM0OTdcIixcIiNhZTAxN2VcIixcIiM3YTAxNzdcIl0sXG45OiBbXCIjZmZmN2YzXCIsXCIjZmRlMGRkXCIsXCIjZmNjNWMwXCIsXCIjZmE5ZmI1XCIsXCIjZjc2OGExXCIsXCIjZGQzNDk3XCIsXCIjYWUwMTdlXCIsXCIjN2EwMTc3XCIsXCIjNDkwMDZhXCJdXG59LFB1UmQ6IHtcbjM6IFtcIiNlN2UxZWZcIixcIiNjOTk0YzdcIixcIiNkZDFjNzdcIl0sXG40OiBbXCIjZjFlZWY2XCIsXCIjZDdiNWQ4XCIsXCIjZGY2NWIwXCIsXCIjY2UxMjU2XCJdLFxuNTogW1wiI2YxZWVmNlwiLFwiI2Q3YjVkOFwiLFwiI2RmNjViMFwiLFwiI2RkMWM3N1wiLFwiIzk4MDA0M1wiXSxcbjY6IFtcIiNmMWVlZjZcIixcIiNkNGI5ZGFcIixcIiNjOTk0YzdcIixcIiNkZjY1YjBcIixcIiNkZDFjNzdcIixcIiM5ODAwNDNcIl0sXG43OiBbXCIjZjFlZWY2XCIsXCIjZDRiOWRhXCIsXCIjYzk5NGM3XCIsXCIjZGY2NWIwXCIsXCIjZTcyOThhXCIsXCIjY2UxMjU2XCIsXCIjOTEwMDNmXCJdLFxuODogW1wiI2Y3ZjRmOVwiLFwiI2U3ZTFlZlwiLFwiI2Q0YjlkYVwiLFwiI2M5OTRjN1wiLFwiI2RmNjViMFwiLFwiI2U3Mjk4YVwiLFwiI2NlMTI1NlwiLFwiIzkxMDAzZlwiXSxcbjk6IFtcIiNmN2Y0ZjlcIixcIiNlN2UxZWZcIixcIiNkNGI5ZGFcIixcIiNjOTk0YzdcIixcIiNkZjY1YjBcIixcIiNlNzI5OGFcIixcIiNjZTEyNTZcIixcIiM5ODAwNDNcIixcIiM2NzAwMWZcIl1cbn0sT3JSZDoge1xuMzogW1wiI2ZlZThjOFwiLFwiI2ZkYmI4NFwiLFwiI2UzNGEzM1wiXSxcbjQ6IFtcIiNmZWYwZDlcIixcIiNmZGNjOGFcIixcIiNmYzhkNTlcIixcIiNkNzMwMWZcIl0sXG41OiBbXCIjZmVmMGQ5XCIsXCIjZmRjYzhhXCIsXCIjZmM4ZDU5XCIsXCIjZTM0YTMzXCIsXCIjYjMwMDAwXCJdLFxuNjogW1wiI2ZlZjBkOVwiLFwiI2ZkZDQ5ZVwiLFwiI2ZkYmI4NFwiLFwiI2ZjOGQ1OVwiLFwiI2UzNGEzM1wiLFwiI2IzMDAwMFwiXSxcbjc6IFtcIiNmZWYwZDlcIixcIiNmZGQ0OWVcIixcIiNmZGJiODRcIixcIiNmYzhkNTlcIixcIiNlZjY1NDhcIixcIiNkNzMwMWZcIixcIiM5OTAwMDBcIl0sXG44OiBbXCIjZmZmN2VjXCIsXCIjZmVlOGM4XCIsXCIjZmRkNDllXCIsXCIjZmRiYjg0XCIsXCIjZmM4ZDU5XCIsXCIjZWY2NTQ4XCIsXCIjZDczMDFmXCIsXCIjOTkwMDAwXCJdLFxuOTogW1wiI2ZmZjdlY1wiLFwiI2ZlZThjOFwiLFwiI2ZkZDQ5ZVwiLFwiI2ZkYmI4NFwiLFwiI2ZjOGQ1OVwiLFwiI2VmNjU0OFwiLFwiI2Q3MzAxZlwiLFwiI2IzMDAwMFwiLFwiIzdmMDAwMFwiXVxufSxZbE9yUmQ6IHtcbjM6IFtcIiNmZmVkYTBcIixcIiNmZWIyNGNcIixcIiNmMDNiMjBcIl0sXG40OiBbXCIjZmZmZmIyXCIsXCIjZmVjYzVjXCIsXCIjZmQ4ZDNjXCIsXCIjZTMxYTFjXCJdLFxuNTogW1wiI2ZmZmZiMlwiLFwiI2ZlY2M1Y1wiLFwiI2ZkOGQzY1wiLFwiI2YwM2IyMFwiLFwiI2JkMDAyNlwiXSxcbjY6IFtcIiNmZmZmYjJcIixcIiNmZWQ5NzZcIixcIiNmZWIyNGNcIixcIiNmZDhkM2NcIixcIiNmMDNiMjBcIixcIiNiZDAwMjZcIl0sXG43OiBbXCIjZmZmZmIyXCIsXCIjZmVkOTc2XCIsXCIjZmViMjRjXCIsXCIjZmQ4ZDNjXCIsXCIjZmM0ZTJhXCIsXCIjZTMxYTFjXCIsXCIjYjEwMDI2XCJdLFxuODogW1wiI2ZmZmZjY1wiLFwiI2ZmZWRhMFwiLFwiI2ZlZDk3NlwiLFwiI2ZlYjI0Y1wiLFwiI2ZkOGQzY1wiLFwiI2ZjNGUyYVwiLFwiI2UzMWExY1wiLFwiI2IxMDAyNlwiXSxcbjk6IFtcIiNmZmZmY2NcIixcIiNmZmVkYTBcIixcIiNmZWQ5NzZcIixcIiNmZWIyNGNcIixcIiNmZDhkM2NcIixcIiNmYzRlMmFcIixcIiNlMzFhMWNcIixcIiNiZDAwMjZcIixcIiM4MDAwMjZcIl1cbn0sWWxPckJyOiB7XG4zOiBbXCIjZmZmN2JjXCIsXCIjZmVjNDRmXCIsXCIjZDk1ZjBlXCJdLFxuNDogW1wiI2ZmZmZkNFwiLFwiI2ZlZDk4ZVwiLFwiI2ZlOTkyOVwiLFwiI2NjNGMwMlwiXSxcbjU6IFtcIiNmZmZmZDRcIixcIiNmZWQ5OGVcIixcIiNmZTk5MjlcIixcIiNkOTVmMGVcIixcIiM5OTM0MDRcIl0sXG42OiBbXCIjZmZmZmQ0XCIsXCIjZmVlMzkxXCIsXCIjZmVjNDRmXCIsXCIjZmU5OTI5XCIsXCIjZDk1ZjBlXCIsXCIjOTkzNDA0XCJdLFxuNzogW1wiI2ZmZmZkNFwiLFwiI2ZlZTM5MVwiLFwiI2ZlYzQ0ZlwiLFwiI2ZlOTkyOVwiLFwiI2VjNzAxNFwiLFwiI2NjNGMwMlwiLFwiIzhjMmQwNFwiXSxcbjg6IFtcIiNmZmZmZTVcIixcIiNmZmY3YmNcIixcIiNmZWUzOTFcIixcIiNmZWM0NGZcIixcIiNmZTk5MjlcIixcIiNlYzcwMTRcIixcIiNjYzRjMDJcIixcIiM4YzJkMDRcIl0sXG45OiBbXCIjZmZmZmU1XCIsXCIjZmZmN2JjXCIsXCIjZmVlMzkxXCIsXCIjZmVjNDRmXCIsXCIjZmU5OTI5XCIsXCIjZWM3MDE0XCIsXCIjY2M0YzAyXCIsXCIjOTkzNDA0XCIsXCIjNjYyNTA2XCJdXG59LFB1cnBsZXM6IHtcbjM6IFtcIiNlZmVkZjVcIixcIiNiY2JkZGNcIixcIiM3NTZiYjFcIl0sXG40OiBbXCIjZjJmMGY3XCIsXCIjY2JjOWUyXCIsXCIjOWU5YWM4XCIsXCIjNmE1MWEzXCJdLFxuNTogW1wiI2YyZjBmN1wiLFwiI2NiYzllMlwiLFwiIzllOWFjOFwiLFwiIzc1NmJiMVwiLFwiIzU0Mjc4ZlwiXSxcbjY6IFtcIiNmMmYwZjdcIixcIiNkYWRhZWJcIixcIiNiY2JkZGNcIixcIiM5ZTlhYzhcIixcIiM3NTZiYjFcIixcIiM1NDI3OGZcIl0sXG43OiBbXCIjZjJmMGY3XCIsXCIjZGFkYWViXCIsXCIjYmNiZGRjXCIsXCIjOWU5YWM4XCIsXCIjODA3ZGJhXCIsXCIjNmE1MWEzXCIsXCIjNGExNDg2XCJdLFxuODogW1wiI2ZjZmJmZFwiLFwiI2VmZWRmNVwiLFwiI2RhZGFlYlwiLFwiI2JjYmRkY1wiLFwiIzllOWFjOFwiLFwiIzgwN2RiYVwiLFwiIzZhNTFhM1wiLFwiIzRhMTQ4NlwiXSxcbjk6IFtcIiNmY2ZiZmRcIixcIiNlZmVkZjVcIixcIiNkYWRhZWJcIixcIiNiY2JkZGNcIixcIiM5ZTlhYzhcIixcIiM4MDdkYmFcIixcIiM2YTUxYTNcIixcIiM1NDI3OGZcIixcIiMzZjAwN2RcIl1cbn0sQmx1ZXM6IHtcbjM6IFtcIiNkZWViZjdcIixcIiM5ZWNhZTFcIixcIiMzMTgyYmRcIl0sXG40OiBbXCIjZWZmM2ZmXCIsXCIjYmRkN2U3XCIsXCIjNmJhZWQ2XCIsXCIjMjE3MWI1XCJdLFxuNTogW1wiI2VmZjNmZlwiLFwiI2JkZDdlN1wiLFwiIzZiYWVkNlwiLFwiIzMxODJiZFwiLFwiIzA4NTE5Y1wiXSxcbjY6IFtcIiNlZmYzZmZcIixcIiNjNmRiZWZcIixcIiM5ZWNhZTFcIixcIiM2YmFlZDZcIixcIiMzMTgyYmRcIixcIiMwODUxOWNcIl0sXG43OiBbXCIjZWZmM2ZmXCIsXCIjYzZkYmVmXCIsXCIjOWVjYWUxXCIsXCIjNmJhZWQ2XCIsXCIjNDI5MmM2XCIsXCIjMjE3MWI1XCIsXCIjMDg0NTk0XCJdLFxuODogW1wiI2Y3ZmJmZlwiLFwiI2RlZWJmN1wiLFwiI2M2ZGJlZlwiLFwiIzllY2FlMVwiLFwiIzZiYWVkNlwiLFwiIzQyOTJjNlwiLFwiIzIxNzFiNVwiLFwiIzA4NDU5NFwiXSxcbjk6IFtcIiNmN2ZiZmZcIixcIiNkZWViZjdcIixcIiNjNmRiZWZcIixcIiM5ZWNhZTFcIixcIiM2YmFlZDZcIixcIiM0MjkyYzZcIixcIiMyMTcxYjVcIixcIiMwODUxOWNcIixcIiMwODMwNmJcIl1cbn0sR3JlZW5zOiB7XG4zOiBbXCIjZTVmNWUwXCIsXCIjYTFkOTliXCIsXCIjMzFhMzU0XCJdLFxuNDogW1wiI2VkZjhlOVwiLFwiI2JhZTRiM1wiLFwiIzc0YzQ3NlwiLFwiIzIzOGI0NVwiXSxcbjU6IFtcIiNlZGY4ZTlcIixcIiNiYWU0YjNcIixcIiM3NGM0NzZcIixcIiMzMWEzNTRcIixcIiMwMDZkMmNcIl0sXG42OiBbXCIjZWRmOGU5XCIsXCIjYzdlOWMwXCIsXCIjYTFkOTliXCIsXCIjNzRjNDc2XCIsXCIjMzFhMzU0XCIsXCIjMDA2ZDJjXCJdLFxuNzogW1wiI2VkZjhlOVwiLFwiI2M3ZTljMFwiLFwiI2ExZDk5YlwiLFwiIzc0YzQ3NlwiLFwiIzQxYWI1ZFwiLFwiIzIzOGI0NVwiLFwiIzAwNWEzMlwiXSxcbjg6IFtcIiNmN2ZjZjVcIixcIiNlNWY1ZTBcIixcIiNjN2U5YzBcIixcIiNhMWQ5OWJcIixcIiM3NGM0NzZcIixcIiM0MWFiNWRcIixcIiMyMzhiNDVcIixcIiMwMDVhMzJcIl0sXG45OiBbXCIjZjdmY2Y1XCIsXCIjZTVmNWUwXCIsXCIjYzdlOWMwXCIsXCIjYTFkOTliXCIsXCIjNzRjNDc2XCIsXCIjNDFhYjVkXCIsXCIjMjM4YjQ1XCIsXCIjMDA2ZDJjXCIsXCIjMDA0NDFiXCJdXG59LE9yYW5nZXM6IHtcbjM6IFtcIiNmZWU2Y2VcIixcIiNmZGFlNmJcIixcIiNlNjU1MGRcIl0sXG40OiBbXCIjZmVlZGRlXCIsXCIjZmRiZTg1XCIsXCIjZmQ4ZDNjXCIsXCIjZDk0NzAxXCJdLFxuNTogW1wiI2ZlZWRkZVwiLFwiI2ZkYmU4NVwiLFwiI2ZkOGQzY1wiLFwiI2U2NTUwZFwiLFwiI2E2MzYwM1wiXSxcbjY6IFtcIiNmZWVkZGVcIixcIiNmZGQwYTJcIixcIiNmZGFlNmJcIixcIiNmZDhkM2NcIixcIiNlNjU1MGRcIixcIiNhNjM2MDNcIl0sXG43OiBbXCIjZmVlZGRlXCIsXCIjZmRkMGEyXCIsXCIjZmRhZTZiXCIsXCIjZmQ4ZDNjXCIsXCIjZjE2OTEzXCIsXCIjZDk0ODAxXCIsXCIjOGMyZDA0XCJdLFxuODogW1wiI2ZmZjVlYlwiLFwiI2ZlZTZjZVwiLFwiI2ZkZDBhMlwiLFwiI2ZkYWU2YlwiLFwiI2ZkOGQzY1wiLFwiI2YxNjkxM1wiLFwiI2Q5NDgwMVwiLFwiIzhjMmQwNFwiXSxcbjk6IFtcIiNmZmY1ZWJcIixcIiNmZWU2Y2VcIixcIiNmZGQwYTJcIixcIiNmZGFlNmJcIixcIiNmZDhkM2NcIixcIiNmMTY5MTNcIixcIiNkOTQ4MDFcIixcIiNhNjM2MDNcIixcIiM3ZjI3MDRcIl1cbn0sUmVkczoge1xuMzogW1wiI2ZlZTBkMlwiLFwiI2ZjOTI3MlwiLFwiI2RlMmQyNlwiXSxcbjQ6IFtcIiNmZWU1ZDlcIixcIiNmY2FlOTFcIixcIiNmYjZhNGFcIixcIiNjYjE4MWRcIl0sXG41OiBbXCIjZmVlNWQ5XCIsXCIjZmNhZTkxXCIsXCIjZmI2YTRhXCIsXCIjZGUyZDI2XCIsXCIjYTUwZjE1XCJdLFxuNjogW1wiI2ZlZTVkOVwiLFwiI2ZjYmJhMVwiLFwiI2ZjOTI3MlwiLFwiI2ZiNmE0YVwiLFwiI2RlMmQyNlwiLFwiI2E1MGYxNVwiXSxcbjc6IFtcIiNmZWU1ZDlcIixcIiNmY2JiYTFcIixcIiNmYzkyNzJcIixcIiNmYjZhNGFcIixcIiNlZjNiMmNcIixcIiNjYjE4MWRcIixcIiM5OTAwMGRcIl0sXG44OiBbXCIjZmZmNWYwXCIsXCIjZmVlMGQyXCIsXCIjZmNiYmExXCIsXCIjZmM5MjcyXCIsXCIjZmI2YTRhXCIsXCIjZWYzYjJjXCIsXCIjY2IxODFkXCIsXCIjOTkwMDBkXCJdLFxuOTogW1wiI2ZmZjVmMFwiLFwiI2ZlZTBkMlwiLFwiI2ZjYmJhMVwiLFwiI2ZjOTI3MlwiLFwiI2ZiNmE0YVwiLFwiI2VmM2IyY1wiLFwiI2NiMTgxZFwiLFwiI2E1MGYxNVwiLFwiIzY3MDAwZFwiXVxufSxHcmV5czoge1xuMzogW1wiI2YwZjBmMFwiLFwiI2JkYmRiZFwiLFwiIzYzNjM2M1wiXSxcbjQ6IFtcIiNmN2Y3ZjdcIixcIiNjY2NjY2NcIixcIiM5Njk2OTZcIixcIiM1MjUyNTJcIl0sXG41OiBbXCIjZjdmN2Y3XCIsXCIjY2NjY2NjXCIsXCIjOTY5Njk2XCIsXCIjNjM2MzYzXCIsXCIjMjUyNTI1XCJdLFxuNjogW1wiI2Y3ZjdmN1wiLFwiI2Q5ZDlkOVwiLFwiI2JkYmRiZFwiLFwiIzk2OTY5NlwiLFwiIzYzNjM2M1wiLFwiIzI1MjUyNVwiXSxcbjc6IFtcIiNmN2Y3ZjdcIixcIiNkOWQ5ZDlcIixcIiNiZGJkYmRcIixcIiM5Njk2OTZcIixcIiM3MzczNzNcIixcIiM1MjUyNTJcIixcIiMyNTI1MjVcIl0sXG44OiBbXCIjZmZmZmZmXCIsXCIjZjBmMGYwXCIsXCIjZDlkOWQ5XCIsXCIjYmRiZGJkXCIsXCIjOTY5Njk2XCIsXCIjNzM3MzczXCIsXCIjNTI1MjUyXCIsXCIjMjUyNTI1XCJdLFxuOTogW1wiI2ZmZmZmZlwiLFwiI2YwZjBmMFwiLFwiI2Q5ZDlkOVwiLFwiI2JkYmRiZFwiLFwiIzk2OTY5NlwiLFwiIzczNzM3M1wiLFwiIzUyNTI1MlwiLFwiIzI1MjUyNVwiLFwiIzAwMDAwMFwiXVxufSxQdU9yOiB7XG4zOiBbXCIjZjFhMzQwXCIsXCIjZjdmN2Y3XCIsXCIjOTk4ZWMzXCJdLFxuNDogW1wiI2U2NjEwMVwiLFwiI2ZkYjg2M1wiLFwiI2IyYWJkMlwiLFwiIzVlM2M5OVwiXSxcbjU6IFtcIiNlNjYxMDFcIixcIiNmZGI4NjNcIixcIiNmN2Y3ZjdcIixcIiNiMmFiZDJcIixcIiM1ZTNjOTlcIl0sXG42OiBbXCIjYjM1ODA2XCIsXCIjZjFhMzQwXCIsXCIjZmVlMGI2XCIsXCIjZDhkYWViXCIsXCIjOTk4ZWMzXCIsXCIjNTQyNzg4XCJdLFxuNzogW1wiI2IzNTgwNlwiLFwiI2YxYTM0MFwiLFwiI2ZlZTBiNlwiLFwiI2Y3ZjdmN1wiLFwiI2Q4ZGFlYlwiLFwiIzk5OGVjM1wiLFwiIzU0Mjc4OFwiXSxcbjg6IFtcIiNiMzU4MDZcIixcIiNlMDgyMTRcIixcIiNmZGI4NjNcIixcIiNmZWUwYjZcIixcIiNkOGRhZWJcIixcIiNiMmFiZDJcIixcIiM4MDczYWNcIixcIiM1NDI3ODhcIl0sXG45OiBbXCIjYjM1ODA2XCIsXCIjZTA4MjE0XCIsXCIjZmRiODYzXCIsXCIjZmVlMGI2XCIsXCIjZjdmN2Y3XCIsXCIjZDhkYWViXCIsXCIjYjJhYmQyXCIsXCIjODA3M2FjXCIsXCIjNTQyNzg4XCJdLFxuMTA6IFtcIiM3ZjNiMDhcIixcIiNiMzU4MDZcIixcIiNlMDgyMTRcIixcIiNmZGI4NjNcIixcIiNmZWUwYjZcIixcIiNkOGRhZWJcIixcIiNiMmFiZDJcIixcIiM4MDczYWNcIixcIiM1NDI3ODhcIixcIiMyZDAwNGJcIl0sXG4xMTogW1wiIzdmM2IwOFwiLFwiI2IzNTgwNlwiLFwiI2UwODIxNFwiLFwiI2ZkYjg2M1wiLFwiI2ZlZTBiNlwiLFwiI2Y3ZjdmN1wiLFwiI2Q4ZGFlYlwiLFwiI2IyYWJkMlwiLFwiIzgwNzNhY1wiLFwiIzU0Mjc4OFwiLFwiIzJkMDA0YlwiXVxufSxCckJHOiB7XG4zOiBbXCIjZDhiMzY1XCIsXCIjZjVmNWY1XCIsXCIjNWFiNGFjXCJdLFxuNDogW1wiI2E2NjExYVwiLFwiI2RmYzI3ZFwiLFwiIzgwY2RjMVwiLFwiIzAxODU3MVwiXSxcbjU6IFtcIiNhNjYxMWFcIixcIiNkZmMyN2RcIixcIiNmNWY1ZjVcIixcIiM4MGNkYzFcIixcIiMwMTg1NzFcIl0sXG42OiBbXCIjOGM1MTBhXCIsXCIjZDhiMzY1XCIsXCIjZjZlOGMzXCIsXCIjYzdlYWU1XCIsXCIjNWFiNGFjXCIsXCIjMDE2NjVlXCJdLFxuNzogW1wiIzhjNTEwYVwiLFwiI2Q4YjM2NVwiLFwiI2Y2ZThjM1wiLFwiI2Y1ZjVmNVwiLFwiI2M3ZWFlNVwiLFwiIzVhYjRhY1wiLFwiIzAxNjY1ZVwiXSxcbjg6IFtcIiM4YzUxMGFcIixcIiNiZjgxMmRcIixcIiNkZmMyN2RcIixcIiNmNmU4YzNcIixcIiNjN2VhZTVcIixcIiM4MGNkYzFcIixcIiMzNTk3OGZcIixcIiMwMTY2NWVcIl0sXG45OiBbXCIjOGM1MTBhXCIsXCIjYmY4MTJkXCIsXCIjZGZjMjdkXCIsXCIjZjZlOGMzXCIsXCIjZjVmNWY1XCIsXCIjYzdlYWU1XCIsXCIjODBjZGMxXCIsXCIjMzU5NzhmXCIsXCIjMDE2NjVlXCJdLFxuMTA6IFtcIiM1NDMwMDVcIixcIiM4YzUxMGFcIixcIiNiZjgxMmRcIixcIiNkZmMyN2RcIixcIiNmNmU4YzNcIixcIiNjN2VhZTVcIixcIiM4MGNkYzFcIixcIiMzNTk3OGZcIixcIiMwMTY2NWVcIixcIiMwMDNjMzBcIl0sXG4xMTogW1wiIzU0MzAwNVwiLFwiIzhjNTEwYVwiLFwiI2JmODEyZFwiLFwiI2RmYzI3ZFwiLFwiI2Y2ZThjM1wiLFwiI2Y1ZjVmNVwiLFwiI2M3ZWFlNVwiLFwiIzgwY2RjMVwiLFwiIzM1OTc4ZlwiLFwiIzAxNjY1ZVwiLFwiIzAwM2MzMFwiXVxufSxQUkduOiB7XG4zOiBbXCIjYWY4ZGMzXCIsXCIjZjdmN2Y3XCIsXCIjN2ZiZjdiXCJdLFxuNDogW1wiIzdiMzI5NFwiLFwiI2MyYTVjZlwiLFwiI2E2ZGJhMFwiLFwiIzAwODgzN1wiXSxcbjU6IFtcIiM3YjMyOTRcIixcIiNjMmE1Y2ZcIixcIiNmN2Y3ZjdcIixcIiNhNmRiYTBcIixcIiMwMDg4MzdcIl0sXG42OiBbXCIjNzYyYTgzXCIsXCIjYWY4ZGMzXCIsXCIjZTdkNGU4XCIsXCIjZDlmMGQzXCIsXCIjN2ZiZjdiXCIsXCIjMWI3ODM3XCJdLFxuNzogW1wiIzc2MmE4M1wiLFwiI2FmOGRjM1wiLFwiI2U3ZDRlOFwiLFwiI2Y3ZjdmN1wiLFwiI2Q5ZjBkM1wiLFwiIzdmYmY3YlwiLFwiIzFiNzgzN1wiXSxcbjg6IFtcIiM3NjJhODNcIixcIiM5OTcwYWJcIixcIiNjMmE1Y2ZcIixcIiNlN2Q0ZThcIixcIiNkOWYwZDNcIixcIiNhNmRiYTBcIixcIiM1YWFlNjFcIixcIiMxYjc4MzdcIl0sXG45OiBbXCIjNzYyYTgzXCIsXCIjOTk3MGFiXCIsXCIjYzJhNWNmXCIsXCIjZTdkNGU4XCIsXCIjZjdmN2Y3XCIsXCIjZDlmMGQzXCIsXCIjYTZkYmEwXCIsXCIjNWFhZTYxXCIsXCIjMWI3ODM3XCJdLFxuMTA6IFtcIiM0MDAwNGJcIixcIiM3NjJhODNcIixcIiM5OTcwYWJcIixcIiNjMmE1Y2ZcIixcIiNlN2Q0ZThcIixcIiNkOWYwZDNcIixcIiNhNmRiYTBcIixcIiM1YWFlNjFcIixcIiMxYjc4MzdcIixcIiMwMDQ0MWJcIl0sXG4xMTogW1wiIzQwMDA0YlwiLFwiIzc2MmE4M1wiLFwiIzk5NzBhYlwiLFwiI2MyYTVjZlwiLFwiI2U3ZDRlOFwiLFwiI2Y3ZjdmN1wiLFwiI2Q5ZjBkM1wiLFwiI2E2ZGJhMFwiLFwiIzVhYWU2MVwiLFwiIzFiNzgzN1wiLFwiIzAwNDQxYlwiXVxufSxQaVlHOiB7XG4zOiBbXCIjZTlhM2M5XCIsXCIjZjdmN2Y3XCIsXCIjYTFkNzZhXCJdLFxuNDogW1wiI2QwMWM4YlwiLFwiI2YxYjZkYVwiLFwiI2I4ZTE4NlwiLFwiIzRkYWMyNlwiXSxcbjU6IFtcIiNkMDFjOGJcIixcIiNmMWI2ZGFcIixcIiNmN2Y3ZjdcIixcIiNiOGUxODZcIixcIiM0ZGFjMjZcIl0sXG42OiBbXCIjYzUxYjdkXCIsXCIjZTlhM2M5XCIsXCIjZmRlMGVmXCIsXCIjZTZmNWQwXCIsXCIjYTFkNzZhXCIsXCIjNGQ5MjIxXCJdLFxuNzogW1wiI2M1MWI3ZFwiLFwiI2U5YTNjOVwiLFwiI2ZkZTBlZlwiLFwiI2Y3ZjdmN1wiLFwiI2U2ZjVkMFwiLFwiI2ExZDc2YVwiLFwiIzRkOTIyMVwiXSxcbjg6IFtcIiNjNTFiN2RcIixcIiNkZTc3YWVcIixcIiNmMWI2ZGFcIixcIiNmZGUwZWZcIixcIiNlNmY1ZDBcIixcIiNiOGUxODZcIixcIiM3ZmJjNDFcIixcIiM0ZDkyMjFcIl0sXG45OiBbXCIjYzUxYjdkXCIsXCIjZGU3N2FlXCIsXCIjZjFiNmRhXCIsXCIjZmRlMGVmXCIsXCIjZjdmN2Y3XCIsXCIjZTZmNWQwXCIsXCIjYjhlMTg2XCIsXCIjN2ZiYzQxXCIsXCIjNGQ5MjIxXCJdLFxuMTA6IFtcIiM4ZTAxNTJcIixcIiNjNTFiN2RcIixcIiNkZTc3YWVcIixcIiNmMWI2ZGFcIixcIiNmZGUwZWZcIixcIiNlNmY1ZDBcIixcIiNiOGUxODZcIixcIiM3ZmJjNDFcIixcIiM0ZDkyMjFcIixcIiMyNzY0MTlcIl0sXG4xMTogW1wiIzhlMDE1MlwiLFwiI2M1MWI3ZFwiLFwiI2RlNzdhZVwiLFwiI2YxYjZkYVwiLFwiI2ZkZTBlZlwiLFwiI2Y3ZjdmN1wiLFwiI2U2ZjVkMFwiLFwiI2I4ZTE4NlwiLFwiIzdmYmM0MVwiLFwiIzRkOTIyMVwiLFwiIzI3NjQxOVwiXVxufSxSZEJ1OiB7XG4zOiBbXCIjZWY4YTYyXCIsXCIjZjdmN2Y3XCIsXCIjNjdhOWNmXCJdLFxuNDogW1wiI2NhMDAyMFwiLFwiI2Y0YTU4MlwiLFwiIzkyYzVkZVwiLFwiIzA1NzFiMFwiXSxcbjU6IFtcIiNjYTAwMjBcIixcIiNmNGE1ODJcIixcIiNmN2Y3ZjdcIixcIiM5MmM1ZGVcIixcIiMwNTcxYjBcIl0sXG42OiBbXCIjYjIxODJiXCIsXCIjZWY4YTYyXCIsXCIjZmRkYmM3XCIsXCIjZDFlNWYwXCIsXCIjNjdhOWNmXCIsXCIjMjE2NmFjXCJdLFxuNzogW1wiI2IyMTgyYlwiLFwiI2VmOGE2MlwiLFwiI2ZkZGJjN1wiLFwiI2Y3ZjdmN1wiLFwiI2QxZTVmMFwiLFwiIzY3YTljZlwiLFwiIzIxNjZhY1wiXSxcbjg6IFtcIiNiMjE4MmJcIixcIiNkNjYwNGRcIixcIiNmNGE1ODJcIixcIiNmZGRiYzdcIixcIiNkMWU1ZjBcIixcIiM5MmM1ZGVcIixcIiM0MzkzYzNcIixcIiMyMTY2YWNcIl0sXG45OiBbXCIjYjIxODJiXCIsXCIjZDY2MDRkXCIsXCIjZjRhNTgyXCIsXCIjZmRkYmM3XCIsXCIjZjdmN2Y3XCIsXCIjZDFlNWYwXCIsXCIjOTJjNWRlXCIsXCIjNDM5M2MzXCIsXCIjMjE2NmFjXCJdLFxuMTA6IFtcIiM2NzAwMWZcIixcIiNiMjE4MmJcIixcIiNkNjYwNGRcIixcIiNmNGE1ODJcIixcIiNmZGRiYzdcIixcIiNkMWU1ZjBcIixcIiM5MmM1ZGVcIixcIiM0MzkzYzNcIixcIiMyMTY2YWNcIixcIiMwNTMwNjFcIl0sXG4xMTogW1wiIzY3MDAxZlwiLFwiI2IyMTgyYlwiLFwiI2Q2NjA0ZFwiLFwiI2Y0YTU4MlwiLFwiI2ZkZGJjN1wiLFwiI2Y3ZjdmN1wiLFwiI2QxZTVmMFwiLFwiIzkyYzVkZVwiLFwiIzQzOTNjM1wiLFwiIzIxNjZhY1wiLFwiIzA1MzA2MVwiXVxufSxSZEd5OiB7XG4zOiBbXCIjZWY4YTYyXCIsXCIjZmZmZmZmXCIsXCIjOTk5OTk5XCJdLFxuNDogW1wiI2NhMDAyMFwiLFwiI2Y0YTU4MlwiLFwiI2JhYmFiYVwiLFwiIzQwNDA0MFwiXSxcbjU6IFtcIiNjYTAwMjBcIixcIiNmNGE1ODJcIixcIiNmZmZmZmZcIixcIiNiYWJhYmFcIixcIiM0MDQwNDBcIl0sXG42OiBbXCIjYjIxODJiXCIsXCIjZWY4YTYyXCIsXCIjZmRkYmM3XCIsXCIjZTBlMGUwXCIsXCIjOTk5OTk5XCIsXCIjNGQ0ZDRkXCJdLFxuNzogW1wiI2IyMTgyYlwiLFwiI2VmOGE2MlwiLFwiI2ZkZGJjN1wiLFwiI2ZmZmZmZlwiLFwiI2UwZTBlMFwiLFwiIzk5OTk5OVwiLFwiIzRkNGQ0ZFwiXSxcbjg6IFtcIiNiMjE4MmJcIixcIiNkNjYwNGRcIixcIiNmNGE1ODJcIixcIiNmZGRiYzdcIixcIiNlMGUwZTBcIixcIiNiYWJhYmFcIixcIiM4Nzg3ODdcIixcIiM0ZDRkNGRcIl0sXG45OiBbXCIjYjIxODJiXCIsXCIjZDY2MDRkXCIsXCIjZjRhNTgyXCIsXCIjZmRkYmM3XCIsXCIjZmZmZmZmXCIsXCIjZTBlMGUwXCIsXCIjYmFiYWJhXCIsXCIjODc4Nzg3XCIsXCIjNGQ0ZDRkXCJdLFxuMTA6IFtcIiM2NzAwMWZcIixcIiNiMjE4MmJcIixcIiNkNjYwNGRcIixcIiNmNGE1ODJcIixcIiNmZGRiYzdcIixcIiNlMGUwZTBcIixcIiNiYWJhYmFcIixcIiM4Nzg3ODdcIixcIiM0ZDRkNGRcIixcIiMxYTFhMWFcIl0sXG4xMTogW1wiIzY3MDAxZlwiLFwiI2IyMTgyYlwiLFwiI2Q2NjA0ZFwiLFwiI2Y0YTU4MlwiLFwiI2ZkZGJjN1wiLFwiI2ZmZmZmZlwiLFwiI2UwZTBlMFwiLFwiI2JhYmFiYVwiLFwiIzg3ODc4N1wiLFwiIzRkNGQ0ZFwiLFwiIzFhMWExYVwiXVxufSxSZFlsQnU6IHtcbjM6IFtcIiNmYzhkNTlcIixcIiNmZmZmYmZcIixcIiM5MWJmZGJcIl0sXG40OiBbXCIjZDcxOTFjXCIsXCIjZmRhZTYxXCIsXCIjYWJkOWU5XCIsXCIjMmM3YmI2XCJdLFxuNTogW1wiI2Q3MTkxY1wiLFwiI2ZkYWU2MVwiLFwiI2ZmZmZiZlwiLFwiI2FiZDllOVwiLFwiIzJjN2JiNlwiXSxcbjY6IFtcIiNkNzMwMjdcIixcIiNmYzhkNTlcIixcIiNmZWUwOTBcIixcIiNlMGYzZjhcIixcIiM5MWJmZGJcIixcIiM0NTc1YjRcIl0sXG43OiBbXCIjZDczMDI3XCIsXCIjZmM4ZDU5XCIsXCIjZmVlMDkwXCIsXCIjZmZmZmJmXCIsXCIjZTBmM2Y4XCIsXCIjOTFiZmRiXCIsXCIjNDU3NWI0XCJdLFxuODogW1wiI2Q3MzAyN1wiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA5MFwiLFwiI2UwZjNmOFwiLFwiI2FiZDllOVwiLFwiIzc0YWRkMVwiLFwiIzQ1NzViNFwiXSxcbjk6IFtcIiNkNzMwMjdcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOTBcIixcIiNmZmZmYmZcIixcIiNlMGYzZjhcIixcIiNhYmQ5ZTlcIixcIiM3NGFkZDFcIixcIiM0NTc1YjRcIl0sXG4xMDogW1wiI2E1MDAyNlwiLFwiI2Q3MzAyN1wiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA5MFwiLFwiI2UwZjNmOFwiLFwiI2FiZDllOVwiLFwiIzc0YWRkMVwiLFwiIzQ1NzViNFwiLFwiIzMxMzY5NVwiXSxcbjExOiBbXCIjYTUwMDI2XCIsXCIjZDczMDI3XCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDkwXCIsXCIjZmZmZmJmXCIsXCIjZTBmM2Y4XCIsXCIjYWJkOWU5XCIsXCIjNzRhZGQxXCIsXCIjNDU3NWI0XCIsXCIjMzEzNjk1XCJdXG59LFNwZWN0cmFsOiB7XG4zOiBbXCIjZmM4ZDU5XCIsXCIjZmZmZmJmXCIsXCIjOTlkNTk0XCJdLFxuNDogW1wiI2Q3MTkxY1wiLFwiI2ZkYWU2MVwiLFwiI2FiZGRhNFwiLFwiIzJiODNiYVwiXSxcbjU6IFtcIiNkNzE5MWNcIixcIiNmZGFlNjFcIixcIiNmZmZmYmZcIixcIiNhYmRkYTRcIixcIiMyYjgzYmFcIl0sXG42OiBbXCIjZDUzZTRmXCIsXCIjZmM4ZDU5XCIsXCIjZmVlMDhiXCIsXCIjZTZmNTk4XCIsXCIjOTlkNTk0XCIsXCIjMzI4OGJkXCJdLFxuNzogW1wiI2Q1M2U0ZlwiLFwiI2ZjOGQ1OVwiLFwiI2ZlZTA4YlwiLFwiI2ZmZmZiZlwiLFwiI2U2ZjU5OFwiLFwiIzk5ZDU5NFwiLFwiIzMyODhiZFwiXSxcbjg6IFtcIiNkNTNlNGZcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOGJcIixcIiNlNmY1OThcIixcIiNhYmRkYTRcIixcIiM2NmMyYTVcIixcIiMzMjg4YmRcIl0sXG45OiBbXCIjZDUzZTRmXCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDhiXCIsXCIjZmZmZmJmXCIsXCIjZTZmNTk4XCIsXCIjYWJkZGE0XCIsXCIjNjZjMmE1XCIsXCIjMzI4OGJkXCJdLFxuMTA6IFtcIiM5ZTAxNDJcIixcIiNkNTNlNGZcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOGJcIixcIiNlNmY1OThcIixcIiNhYmRkYTRcIixcIiM2NmMyYTVcIixcIiMzMjg4YmRcIixcIiM1ZTRmYTJcIl0sXG4xMTogW1wiIzllMDE0MlwiLFwiI2Q1M2U0ZlwiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA4YlwiLFwiI2ZmZmZiZlwiLFwiI2U2ZjU5OFwiLFwiI2FiZGRhNFwiLFwiIzY2YzJhNVwiLFwiIzMyODhiZFwiLFwiIzVlNGZhMlwiXVxufSxSZFlsR246IHtcbjM6IFtcIiNmYzhkNTlcIixcIiNmZmZmYmZcIixcIiM5MWNmNjBcIl0sXG40OiBbXCIjZDcxOTFjXCIsXCIjZmRhZTYxXCIsXCIjYTZkOTZhXCIsXCIjMWE5NjQxXCJdLFxuNTogW1wiI2Q3MTkxY1wiLFwiI2ZkYWU2MVwiLFwiI2ZmZmZiZlwiLFwiI2E2ZDk2YVwiLFwiIzFhOTY0MVwiXSxcbjY6IFtcIiNkNzMwMjdcIixcIiNmYzhkNTlcIixcIiNmZWUwOGJcIixcIiNkOWVmOGJcIixcIiM5MWNmNjBcIixcIiMxYTk4NTBcIl0sXG43OiBbXCIjZDczMDI3XCIsXCIjZmM4ZDU5XCIsXCIjZmVlMDhiXCIsXCIjZmZmZmJmXCIsXCIjZDllZjhiXCIsXCIjOTFjZjYwXCIsXCIjMWE5ODUwXCJdLFxuODogW1wiI2Q3MzAyN1wiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA4YlwiLFwiI2Q5ZWY4YlwiLFwiI2E2ZDk2YVwiLFwiIzY2YmQ2M1wiLFwiIzFhOTg1MFwiXSxcbjk6IFtcIiNkNzMwMjdcIixcIiNmNDZkNDNcIixcIiNmZGFlNjFcIixcIiNmZWUwOGJcIixcIiNmZmZmYmZcIixcIiNkOWVmOGJcIixcIiNhNmQ5NmFcIixcIiM2NmJkNjNcIixcIiMxYTk4NTBcIl0sXG4xMDogW1wiI2E1MDAyNlwiLFwiI2Q3MzAyN1wiLFwiI2Y0NmQ0M1wiLFwiI2ZkYWU2MVwiLFwiI2ZlZTA4YlwiLFwiI2Q5ZWY4YlwiLFwiI2E2ZDk2YVwiLFwiIzY2YmQ2M1wiLFwiIzFhOTg1MFwiLFwiIzAwNjgzN1wiXSxcbjExOiBbXCIjYTUwMDI2XCIsXCIjZDczMDI3XCIsXCIjZjQ2ZDQzXCIsXCIjZmRhZTYxXCIsXCIjZmVlMDhiXCIsXCIjZmZmZmJmXCIsXCIjZDllZjhiXCIsXCIjYTZkOTZhXCIsXCIjNjZiZDYzXCIsXCIjMWE5ODUwXCIsXCIjMDA2ODM3XCJdXG59LEFjY2VudDoge1xuMzogW1wiIzdmYzk3ZlwiLFwiI2JlYWVkNFwiLFwiI2ZkYzA4NlwiXSxcbjQ6IFtcIiM3ZmM5N2ZcIixcIiNiZWFlZDRcIixcIiNmZGMwODZcIixcIiNmZmZmOTlcIl0sXG41OiBbXCIjN2ZjOTdmXCIsXCIjYmVhZWQ0XCIsXCIjZmRjMDg2XCIsXCIjZmZmZjk5XCIsXCIjMzg2Y2IwXCJdLFxuNjogW1wiIzdmYzk3ZlwiLFwiI2JlYWVkNFwiLFwiI2ZkYzA4NlwiLFwiI2ZmZmY5OVwiLFwiIzM4NmNiMFwiLFwiI2YwMDI3ZlwiXSxcbjc6IFtcIiM3ZmM5N2ZcIixcIiNiZWFlZDRcIixcIiNmZGMwODZcIixcIiNmZmZmOTlcIixcIiMzODZjYjBcIixcIiNmMDAyN2ZcIixcIiNiZjViMTdcIl0sXG44OiBbXCIjN2ZjOTdmXCIsXCIjYmVhZWQ0XCIsXCIjZmRjMDg2XCIsXCIjZmZmZjk5XCIsXCIjMzg2Y2IwXCIsXCIjZjAwMjdmXCIsXCIjYmY1YjE3XCIsXCIjNjY2NjY2XCJdXG59LERhcmsyOiB7XG4zOiBbXCIjMWI5ZTc3XCIsXCIjZDk1ZjAyXCIsXCIjNzU3MGIzXCJdLFxuNDogW1wiIzFiOWU3N1wiLFwiI2Q5NWYwMlwiLFwiIzc1NzBiM1wiLFwiI2U3Mjk4YVwiXSxcbjU6IFtcIiMxYjllNzdcIixcIiNkOTVmMDJcIixcIiM3NTcwYjNcIixcIiNlNzI5OGFcIixcIiM2NmE2MWVcIl0sXG42OiBbXCIjMWI5ZTc3XCIsXCIjZDk1ZjAyXCIsXCIjNzU3MGIzXCIsXCIjZTcyOThhXCIsXCIjNjZhNjFlXCIsXCIjZTZhYjAyXCJdLFxuNzogW1wiIzFiOWU3N1wiLFwiI2Q5NWYwMlwiLFwiIzc1NzBiM1wiLFwiI2U3Mjk4YVwiLFwiIzY2YTYxZVwiLFwiI2U2YWIwMlwiLFwiI2E2NzYxZFwiXSxcbjg6IFtcIiMxYjllNzdcIixcIiNkOTVmMDJcIixcIiM3NTcwYjNcIixcIiNlNzI5OGFcIixcIiM2NmE2MWVcIixcIiNlNmFiMDJcIixcIiNhNjc2MWRcIixcIiM2NjY2NjZcIl1cbn0sUGFpcmVkOiB7XG4zOiBbXCIjYTZjZWUzXCIsXCIjMWY3OGI0XCIsXCIjYjJkZjhhXCJdLFxuNDogW1wiI2E2Y2VlM1wiLFwiIzFmNzhiNFwiLFwiI2IyZGY4YVwiLFwiIzMzYTAyY1wiXSxcbjU6IFtcIiNhNmNlZTNcIixcIiMxZjc4YjRcIixcIiNiMmRmOGFcIixcIiMzM2EwMmNcIixcIiNmYjlhOTlcIl0sXG42OiBbXCIjYTZjZWUzXCIsXCIjMWY3OGI0XCIsXCIjYjJkZjhhXCIsXCIjMzNhMDJjXCIsXCIjZmI5YTk5XCIsXCIjZTMxYTFjXCJdLFxuNzogW1wiI2E2Y2VlM1wiLFwiIzFmNzhiNFwiLFwiI2IyZGY4YVwiLFwiIzMzYTAyY1wiLFwiI2ZiOWE5OVwiLFwiI2UzMWExY1wiLFwiI2ZkYmY2ZlwiXSxcbjg6IFtcIiNhNmNlZTNcIixcIiMxZjc4YjRcIixcIiNiMmRmOGFcIixcIiMzM2EwMmNcIixcIiNmYjlhOTlcIixcIiNlMzFhMWNcIixcIiNmZGJmNmZcIixcIiNmZjdmMDBcIl0sXG45OiBbXCIjYTZjZWUzXCIsXCIjMWY3OGI0XCIsXCIjYjJkZjhhXCIsXCIjMzNhMDJjXCIsXCIjZmI5YTk5XCIsXCIjZTMxYTFjXCIsXCIjZmRiZjZmXCIsXCIjZmY3ZjAwXCIsXCIjY2FiMmQ2XCJdLFxuMTA6IFtcIiNhNmNlZTNcIixcIiMxZjc4YjRcIixcIiNiMmRmOGFcIixcIiMzM2EwMmNcIixcIiNmYjlhOTlcIixcIiNlMzFhMWNcIixcIiNmZGJmNmZcIixcIiNmZjdmMDBcIixcIiNjYWIyZDZcIixcIiM2YTNkOWFcIl0sXG4xMTogW1wiI2E2Y2VlM1wiLFwiIzFmNzhiNFwiLFwiI2IyZGY4YVwiLFwiIzMzYTAyY1wiLFwiI2ZiOWE5OVwiLFwiI2UzMWExY1wiLFwiI2ZkYmY2ZlwiLFwiI2ZmN2YwMFwiLFwiI2NhYjJkNlwiLFwiIzZhM2Q5YVwiLFwiI2ZmZmY5OVwiXSxcbjEyOiBbXCIjYTZjZWUzXCIsXCIjMWY3OGI0XCIsXCIjYjJkZjhhXCIsXCIjMzNhMDJjXCIsXCIjZmI5YTk5XCIsXCIjZTMxYTFjXCIsXCIjZmRiZjZmXCIsXCIjZmY3ZjAwXCIsXCIjY2FiMmQ2XCIsXCIjNmEzZDlhXCIsXCIjZmZmZjk5XCIsXCIjYjE1OTI4XCJdXG59LFBhc3RlbDE6IHtcbjM6IFtcIiNmYmI0YWVcIixcIiNiM2NkZTNcIixcIiNjY2ViYzVcIl0sXG40OiBbXCIjZmJiNGFlXCIsXCIjYjNjZGUzXCIsXCIjY2NlYmM1XCIsXCIjZGVjYmU0XCJdLFxuNTogW1wiI2ZiYjRhZVwiLFwiI2IzY2RlM1wiLFwiI2NjZWJjNVwiLFwiI2RlY2JlNFwiLFwiI2ZlZDlhNlwiXSxcbjY6IFtcIiNmYmI0YWVcIixcIiNiM2NkZTNcIixcIiNjY2ViYzVcIixcIiNkZWNiZTRcIixcIiNmZWQ5YTZcIixcIiNmZmZmY2NcIl0sXG43OiBbXCIjZmJiNGFlXCIsXCIjYjNjZGUzXCIsXCIjY2NlYmM1XCIsXCIjZGVjYmU0XCIsXCIjZmVkOWE2XCIsXCIjZmZmZmNjXCIsXCIjZTVkOGJkXCJdLFxuODogW1wiI2ZiYjRhZVwiLFwiI2IzY2RlM1wiLFwiI2NjZWJjNVwiLFwiI2RlY2JlNFwiLFwiI2ZlZDlhNlwiLFwiI2ZmZmZjY1wiLFwiI2U1ZDhiZFwiLFwiI2ZkZGFlY1wiXSxcbjk6IFtcIiNmYmI0YWVcIixcIiNiM2NkZTNcIixcIiNjY2ViYzVcIixcIiNkZWNiZTRcIixcIiNmZWQ5YTZcIixcIiNmZmZmY2NcIixcIiNlNWQ4YmRcIixcIiNmZGRhZWNcIixcIiNmMmYyZjJcIl1cbn0sUGFzdGVsMjoge1xuMzogW1wiI2IzZTJjZFwiLFwiI2ZkY2RhY1wiLFwiI2NiZDVlOFwiXSxcbjQ6IFtcIiNiM2UyY2RcIixcIiNmZGNkYWNcIixcIiNjYmQ1ZThcIixcIiNmNGNhZTRcIl0sXG41OiBbXCIjYjNlMmNkXCIsXCIjZmRjZGFjXCIsXCIjY2JkNWU4XCIsXCIjZjRjYWU0XCIsXCIjZTZmNWM5XCJdLFxuNjogW1wiI2IzZTJjZFwiLFwiI2ZkY2RhY1wiLFwiI2NiZDVlOFwiLFwiI2Y0Y2FlNFwiLFwiI2U2ZjVjOVwiLFwiI2ZmZjJhZVwiXSxcbjc6IFtcIiNiM2UyY2RcIixcIiNmZGNkYWNcIixcIiNjYmQ1ZThcIixcIiNmNGNhZTRcIixcIiNlNmY1YzlcIixcIiNmZmYyYWVcIixcIiNmMWUyY2NcIl0sXG44OiBbXCIjYjNlMmNkXCIsXCIjZmRjZGFjXCIsXCIjY2JkNWU4XCIsXCIjZjRjYWU0XCIsXCIjZTZmNWM5XCIsXCIjZmZmMmFlXCIsXCIjZjFlMmNjXCIsXCIjY2NjY2NjXCJdXG59LFNldDE6IHtcbjM6IFtcIiNlNDFhMWNcIixcIiMzNzdlYjhcIixcIiM0ZGFmNGFcIl0sXG40OiBbXCIjZTQxYTFjXCIsXCIjMzc3ZWI4XCIsXCIjNGRhZjRhXCIsXCIjOTg0ZWEzXCJdLFxuNTogW1wiI2U0MWExY1wiLFwiIzM3N2ViOFwiLFwiIzRkYWY0YVwiLFwiIzk4NGVhM1wiLFwiI2ZmN2YwMFwiXSxcbjY6IFtcIiNlNDFhMWNcIixcIiMzNzdlYjhcIixcIiM0ZGFmNGFcIixcIiM5ODRlYTNcIixcIiNmZjdmMDBcIixcIiNmZmZmMzNcIl0sXG43OiBbXCIjZTQxYTFjXCIsXCIjMzc3ZWI4XCIsXCIjNGRhZjRhXCIsXCIjOTg0ZWEzXCIsXCIjZmY3ZjAwXCIsXCIjZmZmZjMzXCIsXCIjYTY1NjI4XCJdLFxuODogW1wiI2U0MWExY1wiLFwiIzM3N2ViOFwiLFwiIzRkYWY0YVwiLFwiIzk4NGVhM1wiLFwiI2ZmN2YwMFwiLFwiI2ZmZmYzM1wiLFwiI2E2NTYyOFwiLFwiI2Y3ODFiZlwiXSxcbjk6IFtcIiNlNDFhMWNcIixcIiMzNzdlYjhcIixcIiM0ZGFmNGFcIixcIiM5ODRlYTNcIixcIiNmZjdmMDBcIixcIiNmZmZmMzNcIixcIiNhNjU2MjhcIixcIiNmNzgxYmZcIixcIiM5OTk5OTlcIl1cbn0sU2V0Mjoge1xuMzogW1wiIzY2YzJhNVwiLFwiI2ZjOGQ2MlwiLFwiIzhkYTBjYlwiXSxcbjQ6IFtcIiM2NmMyYTVcIixcIiNmYzhkNjJcIixcIiM4ZGEwY2JcIixcIiNlNzhhYzNcIl0sXG41OiBbXCIjNjZjMmE1XCIsXCIjZmM4ZDYyXCIsXCIjOGRhMGNiXCIsXCIjZTc4YWMzXCIsXCIjYTZkODU0XCJdLFxuNjogW1wiIzY2YzJhNVwiLFwiI2ZjOGQ2MlwiLFwiIzhkYTBjYlwiLFwiI2U3OGFjM1wiLFwiI2E2ZDg1NFwiLFwiI2ZmZDkyZlwiXSxcbjc6IFtcIiM2NmMyYTVcIixcIiNmYzhkNjJcIixcIiM4ZGEwY2JcIixcIiNlNzhhYzNcIixcIiNhNmQ4NTRcIixcIiNmZmQ5MmZcIixcIiNlNWM0OTRcIl0sXG44OiBbXCIjNjZjMmE1XCIsXCIjZmM4ZDYyXCIsXCIjOGRhMGNiXCIsXCIjZTc4YWMzXCIsXCIjYTZkODU0XCIsXCIjZmZkOTJmXCIsXCIjZTVjNDk0XCIsXCIjYjNiM2IzXCJdXG59LFNldDM6IHtcbjM6IFtcIiM4ZGQzYzdcIixcIiNmZmZmYjNcIixcIiNiZWJhZGFcIl0sXG40OiBbXCIjOGRkM2M3XCIsXCIjZmZmZmIzXCIsXCIjYmViYWRhXCIsXCIjZmI4MDcyXCJdLFxuNTogW1wiIzhkZDNjN1wiLFwiI2ZmZmZiM1wiLFwiI2JlYmFkYVwiLFwiI2ZiODA3MlwiLFwiIzgwYjFkM1wiXSxcbjY6IFtcIiM4ZGQzYzdcIixcIiNmZmZmYjNcIixcIiNiZWJhZGFcIixcIiNmYjgwNzJcIixcIiM4MGIxZDNcIixcIiNmZGI0NjJcIl0sXG43OiBbXCIjOGRkM2M3XCIsXCIjZmZmZmIzXCIsXCIjYmViYWRhXCIsXCIjZmI4MDcyXCIsXCIjODBiMWQzXCIsXCIjZmRiNDYyXCIsXCIjYjNkZTY5XCJdLFxuODogW1wiIzhkZDNjN1wiLFwiI2ZmZmZiM1wiLFwiI2JlYmFkYVwiLFwiI2ZiODA3MlwiLFwiIzgwYjFkM1wiLFwiI2ZkYjQ2MlwiLFwiI2IzZGU2OVwiLFwiI2ZjY2RlNVwiXSxcbjk6IFtcIiM4ZGQzYzdcIixcIiNmZmZmYjNcIixcIiNiZWJhZGFcIixcIiNmYjgwNzJcIixcIiM4MGIxZDNcIixcIiNmZGI0NjJcIixcIiNiM2RlNjlcIixcIiNmY2NkZTVcIixcIiNkOWQ5ZDlcIl0sXG4xMDogW1wiIzhkZDNjN1wiLFwiI2ZmZmZiM1wiLFwiI2JlYmFkYVwiLFwiI2ZiODA3MlwiLFwiIzgwYjFkM1wiLFwiI2ZkYjQ2MlwiLFwiI2IzZGU2OVwiLFwiI2ZjY2RlNVwiLFwiI2Q5ZDlkOVwiLFwiI2JjODBiZFwiXSxcbjExOiBbXCIjOGRkM2M3XCIsXCIjZmZmZmIzXCIsXCIjYmViYWRhXCIsXCIjZmI4MDcyXCIsXCIjODBiMWQzXCIsXCIjZmRiNDYyXCIsXCIjYjNkZTY5XCIsXCIjZmNjZGU1XCIsXCIjZDlkOWQ5XCIsXCIjYmM4MGJkXCIsXCIjY2NlYmM1XCJdLFxuMTI6IFtcIiM4ZGQzYzdcIixcIiNmZmZmYjNcIixcIiNiZWJhZGFcIixcIiNmYjgwNzJcIixcIiM4MGIxZDNcIixcIiNmZGI0NjJcIixcIiNiM2RlNjlcIixcIiNmY2NkZTVcIixcIiNkOWQ5ZDlcIixcIiNiYzgwYmRcIixcIiNjY2ViYzVcIixcIiNmZmVkNmZcIl1cbn19O1xuXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoY29sb3JicmV3ZXIpO1xufSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjb2xvcmJyZXdlcjtcbn0gZWxzZSB7XG4gICAgdGhpcy5jb2xvcmJyZXdlciA9IGNvbG9yYnJld2VyO1xufVxuXG59KCk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY29sb3JicmV3ZXIuanMnKTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgZmFjdG9yeSgoZ2xvYmFsLmNvbG9yID0ge30pKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIGRlbHRhSHVlKGgxLCBoMCkge1xuICAgIHZhciBkZWx0YSA9IGgxIC0gaDA7XG4gICAgcmV0dXJuIGRlbHRhID4gMTgwIHx8IGRlbHRhIDwgLTE4MFxuICAgICAgICA/IGRlbHRhIC0gMzYwICogTWF0aC5yb3VuZChkZWx0YSAvIDM2MClcbiAgICAgICAgOiBkZWx0YTtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbG9yKCkge312YXIgcmVIZXgzID0gL14jKFswLTlhLWZdezN9KSQvO1xuICB2YXIgcmVIZXg2ID0gL14jKFswLTlhLWZdezZ9KSQvO1xuICB2YXIgcmVSZ2JJbnRlZ2VyID0gL15yZ2JcXChcXHMqKFstK10/XFxkKylcXHMqLFxccyooWy0rXT9cXGQrKVxccyosXFxzKihbLStdP1xcZCspXFxzKlxcKSQvO1xuICB2YXIgcmVSZ2JQZXJjZW50ID0gL15yZ2JcXChcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKlxcKSQvO1xuICB2YXIgcmVIc2xQZXJjZW50ID0gL15oc2xcXChcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPylcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqXFwpJC87XG4gIGNvbG9yLnByb3RvdHlwZSA9IENvbG9yLnByb3RvdHlwZSA9IHtcbiAgICBkaXNwbGF5YWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZ2IoKS5kaXNwbGF5YWJsZSgpO1xuICAgIH0sXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmdiKCkgKyBcIlwiO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBjb2xvcihmb3JtYXQpIHtcbiAgICB2YXIgbTtcbiAgICBmb3JtYXQgPSAoZm9ybWF0ICsgXCJcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIChtID0gcmVIZXgzLmV4ZWMoZm9ybWF0KSkgPyAobSA9IHBhcnNlSW50KG1bMV0sIDE2KSwgcmdiKChtID4+IDggJiAweGYpIHwgKG0gPj4gNCAmIDB4MGYwKSwgKG0gPj4gNCAmIDB4ZikgfCAobSAmIDB4ZjApLCAoKG0gJiAweGYpIDw8IDQpIHwgKG0gJiAweGYpKSkgLy8gI2YwMFxuICAgICAgICA6IChtID0gcmVIZXg2LmV4ZWMoZm9ybWF0KSkgPyByZ2JuKHBhcnNlSW50KG1bMV0sIDE2KSkgLy8gI2ZmMDAwMFxuICAgICAgICA6IChtID0gcmVSZ2JJbnRlZ2VyLmV4ZWMoZm9ybWF0KSkgPyByZ2IobVsxXSwgbVsyXSwgbVszXSkgLy8gcmdiKDI1NSwwLDApXG4gICAgICAgIDogKG0gPSByZVJnYlBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IHJnYihtWzFdICogMi41NSwgbVsyXSAqIDIuNTUsIG1bM10gKiAyLjU1KSAvLyByZ2IoMTAwJSwwJSwwJSlcbiAgICAgICAgOiAobSA9IHJlSHNsUGVyY2VudC5leGVjKGZvcm1hdCkpID8gaHNsKG1bMV0sIG1bMl0gKiAuMDEsIG1bM10gKiAuMDEpIC8vIGhzbCgxMjAsNTAlLDUwJSlcbiAgICAgICAgOiBuYW1lZC5oYXNPd25Qcm9wZXJ0eShmb3JtYXQpID8gcmdibihuYW1lZFtmb3JtYXRdKVxuICAgICAgICA6IG51bGw7XG4gIH1mdW5jdGlvbiByZ2JuKG4pIHtcbiAgICByZXR1cm4gcmdiKG4gPj4gMTYgJiAweGZmLCBuID4+IDggJiAweGZmLCBuICYgMHhmZik7XG4gIH1cblxuICB2YXIgbmFtZWQgPSB7XG4gICAgYWxpY2VibHVlOiAweGYwZjhmZixcbiAgICBhbnRpcXVld2hpdGU6IDB4ZmFlYmQ3LFxuICAgIGFxdWE6IDB4MDBmZmZmLFxuICAgIGFxdWFtYXJpbmU6IDB4N2ZmZmQ0LFxuICAgIGF6dXJlOiAweGYwZmZmZixcbiAgICBiZWlnZTogMHhmNWY1ZGMsXG4gICAgYmlzcXVlOiAweGZmZTRjNCxcbiAgICBibGFjazogMHgwMDAwMDAsXG4gICAgYmxhbmNoZWRhbG1vbmQ6IDB4ZmZlYmNkLFxuICAgIGJsdWU6IDB4MDAwMGZmLFxuICAgIGJsdWV2aW9sZXQ6IDB4OGEyYmUyLFxuICAgIGJyb3duOiAweGE1MmEyYSxcbiAgICBidXJseXdvb2Q6IDB4ZGViODg3LFxuICAgIGNhZGV0Ymx1ZTogMHg1ZjllYTAsXG4gICAgY2hhcnRyZXVzZTogMHg3ZmZmMDAsXG4gICAgY2hvY29sYXRlOiAweGQyNjkxZSxcbiAgICBjb3JhbDogMHhmZjdmNTAsXG4gICAgY29ybmZsb3dlcmJsdWU6IDB4NjQ5NWVkLFxuICAgIGNvcm5zaWxrOiAweGZmZjhkYyxcbiAgICBjcmltc29uOiAweGRjMTQzYyxcbiAgICBjeWFuOiAweDAwZmZmZixcbiAgICBkYXJrYmx1ZTogMHgwMDAwOGIsXG4gICAgZGFya2N5YW46IDB4MDA4YjhiLFxuICAgIGRhcmtnb2xkZW5yb2Q6IDB4Yjg4NjBiLFxuICAgIGRhcmtncmF5OiAweGE5YTlhOSxcbiAgICBkYXJrZ3JlZW46IDB4MDA2NDAwLFxuICAgIGRhcmtncmV5OiAweGE5YTlhOSxcbiAgICBkYXJra2hha2k6IDB4YmRiNzZiLFxuICAgIGRhcmttYWdlbnRhOiAweDhiMDA4YixcbiAgICBkYXJrb2xpdmVncmVlbjogMHg1NTZiMmYsXG4gICAgZGFya29yYW5nZTogMHhmZjhjMDAsXG4gICAgZGFya29yY2hpZDogMHg5OTMyY2MsXG4gICAgZGFya3JlZDogMHg4YjAwMDAsXG4gICAgZGFya3NhbG1vbjogMHhlOTk2N2EsXG4gICAgZGFya3NlYWdyZWVuOiAweDhmYmM4ZixcbiAgICBkYXJrc2xhdGVibHVlOiAweDQ4M2Q4YixcbiAgICBkYXJrc2xhdGVncmF5OiAweDJmNGY0ZixcbiAgICBkYXJrc2xhdGVncmV5OiAweDJmNGY0ZixcbiAgICBkYXJrdHVycXVvaXNlOiAweDAwY2VkMSxcbiAgICBkYXJrdmlvbGV0OiAweDk0MDBkMyxcbiAgICBkZWVwcGluazogMHhmZjE0OTMsXG4gICAgZGVlcHNreWJsdWU6IDB4MDBiZmZmLFxuICAgIGRpbWdyYXk6IDB4Njk2OTY5LFxuICAgIGRpbWdyZXk6IDB4Njk2OTY5LFxuICAgIGRvZGdlcmJsdWU6IDB4MWU5MGZmLFxuICAgIGZpcmVicmljazogMHhiMjIyMjIsXG4gICAgZmxvcmFsd2hpdGU6IDB4ZmZmYWYwLFxuICAgIGZvcmVzdGdyZWVuOiAweDIyOGIyMixcbiAgICBmdWNoc2lhOiAweGZmMDBmZixcbiAgICBnYWluc2Jvcm86IDB4ZGNkY2RjLFxuICAgIGdob3N0d2hpdGU6IDB4ZjhmOGZmLFxuICAgIGdvbGQ6IDB4ZmZkNzAwLFxuICAgIGdvbGRlbnJvZDogMHhkYWE1MjAsXG4gICAgZ3JheTogMHg4MDgwODAsXG4gICAgZ3JlZW46IDB4MDA4MDAwLFxuICAgIGdyZWVueWVsbG93OiAweGFkZmYyZixcbiAgICBncmV5OiAweDgwODA4MCxcbiAgICBob25leWRldzogMHhmMGZmZjAsXG4gICAgaG90cGluazogMHhmZjY5YjQsXG4gICAgaW5kaWFucmVkOiAweGNkNWM1YyxcbiAgICBpbmRpZ286IDB4NGIwMDgyLFxuICAgIGl2b3J5OiAweGZmZmZmMCxcbiAgICBraGFraTogMHhmMGU2OGMsXG4gICAgbGF2ZW5kZXI6IDB4ZTZlNmZhLFxuICAgIGxhdmVuZGVyYmx1c2g6IDB4ZmZmMGY1LFxuICAgIGxhd25ncmVlbjogMHg3Y2ZjMDAsXG4gICAgbGVtb25jaGlmZm9uOiAweGZmZmFjZCxcbiAgICBsaWdodGJsdWU6IDB4YWRkOGU2LFxuICAgIGxpZ2h0Y29yYWw6IDB4ZjA4MDgwLFxuICAgIGxpZ2h0Y3lhbjogMHhlMGZmZmYsXG4gICAgbGlnaHRnb2xkZW5yb2R5ZWxsb3c6IDB4ZmFmYWQyLFxuICAgIGxpZ2h0Z3JheTogMHhkM2QzZDMsXG4gICAgbGlnaHRncmVlbjogMHg5MGVlOTAsXG4gICAgbGlnaHRncmV5OiAweGQzZDNkMyxcbiAgICBsaWdodHBpbms6IDB4ZmZiNmMxLFxuICAgIGxpZ2h0c2FsbW9uOiAweGZmYTA3YSxcbiAgICBsaWdodHNlYWdyZWVuOiAweDIwYjJhYSxcbiAgICBsaWdodHNreWJsdWU6IDB4ODdjZWZhLFxuICAgIGxpZ2h0c2xhdGVncmF5OiAweDc3ODg5OSxcbiAgICBsaWdodHNsYXRlZ3JleTogMHg3Nzg4OTksXG4gICAgbGlnaHRzdGVlbGJsdWU6IDB4YjBjNGRlLFxuICAgIGxpZ2h0eWVsbG93OiAweGZmZmZlMCxcbiAgICBsaW1lOiAweDAwZmYwMCxcbiAgICBsaW1lZ3JlZW46IDB4MzJjZDMyLFxuICAgIGxpbmVuOiAweGZhZjBlNixcbiAgICBtYWdlbnRhOiAweGZmMDBmZixcbiAgICBtYXJvb246IDB4ODAwMDAwLFxuICAgIG1lZGl1bWFxdWFtYXJpbmU6IDB4NjZjZGFhLFxuICAgIG1lZGl1bWJsdWU6IDB4MDAwMGNkLFxuICAgIG1lZGl1bW9yY2hpZDogMHhiYTU1ZDMsXG4gICAgbWVkaXVtcHVycGxlOiAweDkzNzBkYixcbiAgICBtZWRpdW1zZWFncmVlbjogMHgzY2IzNzEsXG4gICAgbWVkaXVtc2xhdGVibHVlOiAweDdiNjhlZSxcbiAgICBtZWRpdW1zcHJpbmdncmVlbjogMHgwMGZhOWEsXG4gICAgbWVkaXVtdHVycXVvaXNlOiAweDQ4ZDFjYyxcbiAgICBtZWRpdW12aW9sZXRyZWQ6IDB4YzcxNTg1LFxuICAgIG1pZG5pZ2h0Ymx1ZTogMHgxOTE5NzAsXG4gICAgbWludGNyZWFtOiAweGY1ZmZmYSxcbiAgICBtaXN0eXJvc2U6IDB4ZmZlNGUxLFxuICAgIG1vY2Nhc2luOiAweGZmZTRiNSxcbiAgICBuYXZham93aGl0ZTogMHhmZmRlYWQsXG4gICAgbmF2eTogMHgwMDAwODAsXG4gICAgb2xkbGFjZTogMHhmZGY1ZTYsXG4gICAgb2xpdmU6IDB4ODA4MDAwLFxuICAgIG9saXZlZHJhYjogMHg2YjhlMjMsXG4gICAgb3JhbmdlOiAweGZmYTUwMCxcbiAgICBvcmFuZ2VyZWQ6IDB4ZmY0NTAwLFxuICAgIG9yY2hpZDogMHhkYTcwZDYsXG4gICAgcGFsZWdvbGRlbnJvZDogMHhlZWU4YWEsXG4gICAgcGFsZWdyZWVuOiAweDk4ZmI5OCxcbiAgICBwYWxldHVycXVvaXNlOiAweGFmZWVlZSxcbiAgICBwYWxldmlvbGV0cmVkOiAweGRiNzA5MyxcbiAgICBwYXBheWF3aGlwOiAweGZmZWZkNSxcbiAgICBwZWFjaHB1ZmY6IDB4ZmZkYWI5LFxuICAgIHBlcnU6IDB4Y2Q4NTNmLFxuICAgIHBpbms6IDB4ZmZjMGNiLFxuICAgIHBsdW06IDB4ZGRhMGRkLFxuICAgIHBvd2RlcmJsdWU6IDB4YjBlMGU2LFxuICAgIHB1cnBsZTogMHg4MDAwODAsXG4gICAgcmViZWNjYXB1cnBsZTogMHg2NjMzOTksXG4gICAgcmVkOiAweGZmMDAwMCxcbiAgICByb3N5YnJvd246IDB4YmM4ZjhmLFxuICAgIHJveWFsYmx1ZTogMHg0MTY5ZTEsXG4gICAgc2FkZGxlYnJvd246IDB4OGI0NTEzLFxuICAgIHNhbG1vbjogMHhmYTgwNzIsXG4gICAgc2FuZHlicm93bjogMHhmNGE0NjAsXG4gICAgc2VhZ3JlZW46IDB4MmU4YjU3LFxuICAgIHNlYXNoZWxsOiAweGZmZjVlZSxcbiAgICBzaWVubmE6IDB4YTA1MjJkLFxuICAgIHNpbHZlcjogMHhjMGMwYzAsXG4gICAgc2t5Ymx1ZTogMHg4N2NlZWIsXG4gICAgc2xhdGVibHVlOiAweDZhNWFjZCxcbiAgICBzbGF0ZWdyYXk6IDB4NzA4MDkwLFxuICAgIHNsYXRlZ3JleTogMHg3MDgwOTAsXG4gICAgc25vdzogMHhmZmZhZmEsXG4gICAgc3ByaW5nZ3JlZW46IDB4MDBmZjdmLFxuICAgIHN0ZWVsYmx1ZTogMHg0NjgyYjQsXG4gICAgdGFuOiAweGQyYjQ4YyxcbiAgICB0ZWFsOiAweDAwODA4MCxcbiAgICB0aGlzdGxlOiAweGQ4YmZkOCxcbiAgICB0b21hdG86IDB4ZmY2MzQ3LFxuICAgIHR1cnF1b2lzZTogMHg0MGUwZDAsXG4gICAgdmlvbGV0OiAweGVlODJlZSxcbiAgICB3aGVhdDogMHhmNWRlYjMsXG4gICAgd2hpdGU6IDB4ZmZmZmZmLFxuICAgIHdoaXRlc21va2U6IDB4ZjVmNWY1LFxuICAgIHllbGxvdzogMHhmZmZmMDAsXG4gICAgeWVsbG93Z3JlZW46IDB4OWFjZDMyXG4gIH07XG5cbiAgdmFyIGRhcmtlciA9IC43O1xuICB2YXIgYnJpZ2h0ZXIgPSAxIC8gZGFya2VyO1xuXG4gIGZ1bmN0aW9uIHJnYihyLCBnLCBiKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmICghKHIgaW5zdGFuY2VvZiBDb2xvcikpIHIgPSBjb2xvcihyKTtcbiAgICAgIGlmIChyKSB7XG4gICAgICAgIHIgPSByLnJnYigpO1xuICAgICAgICBiID0gci5iO1xuICAgICAgICBnID0gci5nO1xuICAgICAgICByID0gci5yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgciA9IGcgPSBiID0gTmFOO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFJnYihyLCBnLCBiKTtcbiAgfWZ1bmN0aW9uIFJnYihyLCBnLCBiKSB7XG4gICAgdGhpcy5yID0gK3I7XG4gICAgdGhpcy5nID0gK2c7XG4gICAgdGhpcy5iID0gK2I7XG4gIH12YXIgX19fX3Byb3RvdHlwZSA9IHJnYi5wcm90b3R5cGUgPSBSZ2IucHJvdG90eXBlID0gbmV3IENvbG9yO1xuXG4gIF9fX19wcm90b3R5cGUuYnJpZ2h0ZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGspO1xuICB9O1xuXG4gIF9fX19wcm90b3R5cGUuZGFya2VyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGspO1xuICB9O1xuXG4gIF9fX19wcm90b3R5cGUucmdiID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgX19fX3Byb3RvdHlwZS5kaXNwbGF5YWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoMCA8PSB0aGlzLnIgJiYgdGhpcy5yIDw9IDI1NSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5nICYmIHRoaXMuZyA8PSAyNTUpXG4gICAgICAgICYmICgwIDw9IHRoaXMuYiAmJiB0aGlzLmIgPD0gMjU1KTtcbiAgfTtcblxuICBfX19fcHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF9mb3JtYXQodGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XG4gIH07XG5cbiAgZnVuY3Rpb24gX2Zvcm1hdChyLCBnLCBiKSB7XG4gICAgcmV0dXJuIFwiI1wiXG4gICAgICAgICsgKGlzTmFOKHIpID8gXCIwMFwiIDogKHIgPSBNYXRoLnJvdW5kKHIpKSA8IDE2ID8gXCIwXCIgKyBNYXRoLm1heCgwLCByKS50b1N0cmluZygxNikgOiBNYXRoLm1pbigyNTUsIHIpLnRvU3RyaW5nKDE2KSlcbiAgICAgICAgKyAoaXNOYU4oZykgPyBcIjAwXCIgOiAoZyA9IE1hdGgucm91bmQoZykpIDwgMTYgPyBcIjBcIiArIE1hdGgubWF4KDAsIGcpLnRvU3RyaW5nKDE2KSA6IE1hdGgubWluKDI1NSwgZykudG9TdHJpbmcoMTYpKVxuICAgICAgICArIChpc05hTihiKSA/IFwiMDBcIiA6IChiID0gTWF0aC5yb3VuZChiKSkgPCAxNiA/IFwiMFwiICsgTWF0aC5tYXgoMCwgYikudG9TdHJpbmcoMTYpIDogTWF0aC5taW4oMjU1LCBiKS50b1N0cmluZygxNikpO1xuICB9XG5cbiAgZnVuY3Rpb24gaHNsKGgsIHMsIGwpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKGggaW5zdGFuY2VvZiBIc2wpIHtcbiAgICAgICAgbCA9IGgubDtcbiAgICAgICAgcyA9IGgucztcbiAgICAgICAgaCA9IGguaDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghKGggaW5zdGFuY2VvZiBDb2xvcikpIGggPSBjb2xvcihoKTtcbiAgICAgICAgaWYgKGgpIHtcbiAgICAgICAgICBpZiAoaCBpbnN0YW5jZW9mIEhzbCkgcmV0dXJuIGg7XG4gICAgICAgICAgaCA9IGgucmdiKCk7XG4gICAgICAgICAgdmFyIHIgPSBoLnIgLyAyNTUsXG4gICAgICAgICAgICAgIGcgPSBoLmcgLyAyNTUsXG4gICAgICAgICAgICAgIGIgPSBoLmIgLyAyNTUsXG4gICAgICAgICAgICAgIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpLFxuICAgICAgICAgICAgICBtYXggPSBNYXRoLm1heChyLCBnLCBiKSxcbiAgICAgICAgICAgICAgcmFuZ2UgPSBtYXggLSBtaW47XG4gICAgICAgICAgbCA9IChtYXggKyBtaW4pIC8gMjtcbiAgICAgICAgICBpZiAocmFuZ2UpIHtcbiAgICAgICAgICAgIHMgPSBsIDwgLjUgPyByYW5nZSAvIChtYXggKyBtaW4pIDogcmFuZ2UgLyAoMiAtIG1heCAtIG1pbik7XG4gICAgICAgICAgICBpZiAociA9PT0gbWF4KSBoID0gKGcgLSBiKSAvIHJhbmdlICsgKGcgPCBiKSAqIDY7XG4gICAgICAgICAgICBlbHNlIGlmIChnID09PSBtYXgpIGggPSAoYiAtIHIpIC8gcmFuZ2UgKyAyO1xuICAgICAgICAgICAgZWxzZSBoID0gKHIgLSBnKSAvIHJhbmdlICsgNDtcbiAgICAgICAgICAgIGggKj0gNjA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGggPSBOYU47XG4gICAgICAgICAgICBzID0gbCA+IDAgJiYgbCA8IDEgPyAwIDogaDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaCA9IHMgPSBsID0gTmFOO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgSHNsKGgsIHMsIGwpO1xuICB9ZnVuY3Rpb24gSHNsKGgsIHMsIGwpIHtcbiAgICB0aGlzLmggPSAraDtcbiAgICB0aGlzLnMgPSArcztcbiAgICB0aGlzLmwgPSArbDtcbiAgfXZhciBfX19wcm90b3R5cGUgPSBoc2wucHJvdG90eXBlID0gSHNsLnByb3RvdHlwZSA9IG5ldyBDb2xvcjtcblxuICBfX19wcm90b3R5cGUuYnJpZ2h0ZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgSHNsKHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrKTtcbiAgfTtcblxuICBfX19wcm90b3R5cGUuZGFya2VyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgSHNsKHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrKTtcbiAgfTtcblxuICBfX19wcm90b3R5cGUucmdiID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGggPSB0aGlzLmggJSAzNjAgKyAodGhpcy5oIDwgMCkgKiAzNjAsXG4gICAgICAgIHMgPSBpc05hTihoKSB8fCBpc05hTih0aGlzLnMpID8gMCA6IHRoaXMucyxcbiAgICAgICAgbCA9IHRoaXMubCxcbiAgICAgICAgbTIgPSBsICsgKGwgPCAuNSA/IGwgOiAxIC0gbCkgKiBzLFxuICAgICAgICBtMSA9IDIgKiBsIC0gbTI7XG4gICAgcmV0dXJuIG5ldyBSZ2IoXG4gICAgICBoc2wycmdiKGggPj0gMjQwID8gaCAtIDI0MCA6IGggKyAxMjAsIG0xLCBtMiksXG4gICAgICBoc2wycmdiKGgsIG0xLCBtMiksXG4gICAgICBoc2wycmdiKGggPCAxMjAgPyBoICsgMjQwIDogaCAtIDEyMCwgbTEsIG0yKVxuICAgICk7XG4gIH07XG5cbiAgX19fcHJvdG90eXBlLmRpc3BsYXlhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICgwIDw9IHRoaXMucyAmJiB0aGlzLnMgPD0gMSB8fCBpc05hTih0aGlzLnMpKVxuICAgICAgICAmJiAoMCA8PSB0aGlzLmwgJiYgdGhpcy5sIDw9IDEpO1xuICB9O1xuXG4gIC8qIEZyb20gRnZEIDEzLjM3LCBDU1MgQ29sb3IgTW9kdWxlIExldmVsIDMgKi9cbiAgZnVuY3Rpb24gaHNsMnJnYihoLCBtMSwgbTIpIHtcbiAgICByZXR1cm4gKGggPCA2MCA/IG0xICsgKG0yIC0gbTEpICogaCAvIDYwXG4gICAgICAgIDogaCA8IDE4MCA/IG0yXG4gICAgICAgIDogaCA8IDI0MCA/IG0xICsgKG0yIC0gbTEpICogKDI0MCAtIGgpIC8gNjBcbiAgICAgICAgOiBtMSkgKiAyNTU7XG4gIH1cblxuICB2YXIgS24gPSAxODtcblxuICB2YXIgWG4gPSAwLjk1MDQ3MDtcbiAgdmFyIFluID0gMTtcbiAgdmFyIFpuID0gMS4wODg4MzA7XG4gIHZhciB0MCA9IDQgLyAyOTtcbiAgdmFyIHQxID0gNiAvIDI5O1xuICB2YXIgdDIgPSAzICogdDEgKiB0MTtcbiAgdmFyIHQzID0gdDEgKiB0MSAqIHQxO1xuICBmdW5jdGlvbiBsYWIobCwgYSwgYikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAobCBpbnN0YW5jZW9mIExhYikge1xuICAgICAgICBiID0gbC5iO1xuICAgICAgICBhID0gbC5hO1xuICAgICAgICBsID0gbC5sO1xuICAgICAgfSBlbHNlIGlmIChsIGluc3RhbmNlb2YgSGNsKSB7XG4gICAgICAgIHZhciBoID0gbC5oICogZGVnMnJhZDtcbiAgICAgICAgYiA9IE1hdGguc2luKGgpICogbC5jO1xuICAgICAgICBhID0gTWF0aC5jb3MoaCkgKiBsLmM7XG4gICAgICAgIGwgPSBsLmw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIShsIGluc3RhbmNlb2YgUmdiKSkgbCA9IHJnYihsKTtcbiAgICAgICAgdmFyIHIgPSByZ2IyeHl6KGwuciksXG4gICAgICAgICAgICBnID0gcmdiMnh5eihsLmcpLFxuICAgICAgICAgICAgYiA9IHJnYjJ4eXoobC5iKSxcbiAgICAgICAgICAgIHggPSB4eXoybGFiKCgwLjQxMjQ1NjQgKiByICsgMC4zNTc1NzYxICogZyArIDAuMTgwNDM3NSAqIGIpIC8gWG4pLFxuICAgICAgICAgICAgeSA9IHh5ejJsYWIoKDAuMjEyNjcyOSAqIHIgKyAwLjcxNTE1MjIgKiBnICsgMC4wNzIxNzUwICogYikgLyBZbiksXG4gICAgICAgICAgICB6ID0geHl6MmxhYigoMC4wMTkzMzM5ICogciArIDAuMTE5MTkyMCAqIGcgKyAwLjk1MDMwNDEgKiBiKSAvIFpuKTtcbiAgICAgICAgYiA9IDIwMCAqICh5IC0geik7XG4gICAgICAgIGEgPSA1MDAgKiAoeCAtIHkpO1xuICAgICAgICBsID0gMTE2ICogeSAtIDE2O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IExhYihsLCBhLCBiKTtcbiAgfWZ1bmN0aW9uIExhYihsLCBhLCBiKSB7XG4gICAgdGhpcy5sID0gK2w7XG4gICAgdGhpcy5hID0gK2E7XG4gICAgdGhpcy5iID0gK2I7XG4gIH12YXIgX19wcm90b3R5cGUgPSBsYWIucHJvdG90eXBlID0gTGFiLnByb3RvdHlwZSA9IG5ldyBDb2xvcjtcblxuICBfX3Byb3RvdHlwZS5icmlnaHRlciA9IGZ1bmN0aW9uKGspIHtcbiAgICByZXR1cm4gbmV3IExhYih0aGlzLmwgKyBLbiAqIChrID09IG51bGwgPyAxIDogayksIHRoaXMuYSwgdGhpcy5iKTtcbiAgfTtcblxuICBfX3Byb3RvdHlwZS5kYXJrZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIG5ldyBMYWIodGhpcy5sIC0gS24gKiAoayA9PSBudWxsID8gMSA6IGspLCB0aGlzLmEsIHRoaXMuYik7XG4gIH07XG5cbiAgX19wcm90b3R5cGUucmdiID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHkgPSAodGhpcy5sICsgMTYpIC8gMTE2LFxuICAgICAgICB4ID0gaXNOYU4odGhpcy5hKSA/IHkgOiB5ICsgdGhpcy5hIC8gNTAwLFxuICAgICAgICB6ID0gaXNOYU4odGhpcy5iKSA/IHkgOiB5IC0gdGhpcy5iIC8gMjAwO1xuICAgIHkgPSBZbiAqIGxhYjJ4eXooeSk7XG4gICAgeCA9IFhuICogbGFiMnh5eih4KTtcbiAgICB6ID0gWm4gKiBsYWIyeHl6KHopO1xuICAgIHJldHVybiBuZXcgUmdiKFxuICAgICAgeHl6MnJnYiggMy4yNDA0NTQyICogeCAtIDEuNTM3MTM4NSAqIHkgLSAwLjQ5ODUzMTQgKiB6KSwgLy8gRDY1IC0+IHNSR0JcbiAgICAgIHh5ejJyZ2IoLTAuOTY5MjY2MCAqIHggKyAxLjg3NjAxMDggKiB5ICsgMC4wNDE1NTYwICogeiksXG4gICAgICB4eXoycmdiKCAwLjA1NTY0MzQgKiB4IC0gMC4yMDQwMjU5ICogeSArIDEuMDU3MjI1MiAqIHopXG4gICAgKTtcbiAgfTtcblxuICBmdW5jdGlvbiB4eXoybGFiKHQpIHtcbiAgICByZXR1cm4gdCA+IHQzID8gTWF0aC5wb3codCwgMSAvIDMpIDogdCAvIHQyICsgdDA7XG4gIH1cblxuICBmdW5jdGlvbiBsYWIyeHl6KHQpIHtcbiAgICByZXR1cm4gdCA+IHQxID8gdCAqIHQgKiB0IDogdDIgKiAodCAtIHQwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHh5ejJyZ2IoeCkge1xuICAgIHJldHVybiAyNTUgKiAoeCA8PSAwLjAwMzEzMDggPyAxMi45MiAqIHggOiAxLjA1NSAqIE1hdGgucG93KHgsIDEgLyAyLjQpIC0gMC4wNTUpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmdiMnh5eih4KSB7XG4gICAgcmV0dXJuICh4IC89IDI1NSkgPD0gMC4wNDA0NSA/IHggLyAxMi45MiA6IE1hdGgucG93KCh4ICsgMC4wNTUpIC8gMS4wNTUsIDIuNCk7XG4gIH1cblxuICB2YXIgZGVnMnJhZCA9IE1hdGguUEkgLyAxODA7XG4gIHZhciByYWQyZGVnID0gMTgwIC8gTWF0aC5QSTtcblxuICBmdW5jdGlvbiBoY2woaCwgYywgbCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoaCBpbnN0YW5jZW9mIEhjbCkge1xuICAgICAgICBsID0gaC5sO1xuICAgICAgICBjID0gaC5jO1xuICAgICAgICBoID0gaC5oO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCEoaCBpbnN0YW5jZW9mIExhYikpIGggPSBsYWIoaCk7XG4gICAgICAgIGwgPSBoLmw7XG4gICAgICAgIGMgPSBNYXRoLnNxcnQoaC5hICogaC5hICsgaC5iICogaC5iKTtcbiAgICAgICAgaCA9IE1hdGguYXRhbjIoaC5iLCBoLmEpICogcmFkMmRlZztcbiAgICAgICAgaWYgKGggPCAwKSBoICs9IDM2MDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBIY2woaCwgYywgbCk7XG4gIH1mdW5jdGlvbiBIY2woaCwgYywgbCkge1xuICAgIHRoaXMuaCA9ICtoO1xuICAgIHRoaXMuYyA9ICtjO1xuICAgIHRoaXMubCA9ICtsO1xuICB9dmFyIF9wcm90b3R5cGUgPSBoY2wucHJvdG90eXBlID0gSGNsLnByb3RvdHlwZSA9IG5ldyBDb2xvcjtcblxuICBfcHJvdG90eXBlLmJyaWdodGVyID0gZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgSGNsKHRoaXMuaCwgdGhpcy5jLCB0aGlzLmwgKyBLbiAqIChrID09IG51bGwgPyAxIDogaykpO1xuICB9O1xuXG4gIF9wcm90b3R5cGUuZGFya2VyID0gZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgSGNsKHRoaXMuaCwgdGhpcy5jLCB0aGlzLmwgLSBLbiAqIChrID09IG51bGwgPyAxIDogaykpO1xuICB9O1xuXG4gIF9wcm90b3R5cGUucmdiID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGxhYih0aGlzKS5yZ2IoKTtcbiAgfTtcblxuICB2YXIgQSA9IC0wLjE0ODYxO1xuICB2YXIgQiA9ICsxLjc4Mjc3O1xuICB2YXIgQyA9IC0wLjI5MjI3O1xuICB2YXIgRCA9IC0wLjkwNjQ5O1xuICB2YXIgRSA9ICsxLjk3Mjk0O1xuICB2YXIgRUQgPSBFICogRDtcbiAgdmFyIEVCID0gRSAqIEI7XG4gIHZhciBCQ19EQSA9IEIgKiBDIC0gRCAqIEE7XG4gIGZ1bmN0aW9uIGN1YmVoZWxpeChoLCBzLCBsKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmIChoIGluc3RhbmNlb2YgQ3ViZWhlbGl4KSB7XG4gICAgICAgIGwgPSBoLmw7XG4gICAgICAgIHMgPSBoLnM7XG4gICAgICAgIGggPSBoLmg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIShoIGluc3RhbmNlb2YgUmdiKSkgaCA9IHJnYihoKTtcbiAgICAgICAgdmFyIHIgPSBoLnIgLyAyNTUsIGcgPSBoLmcgLyAyNTUsIGIgPSBoLmIgLyAyNTU7XG4gICAgICAgIGwgPSAoQkNfREEgKiBiICsgRUQgKiByIC0gRUIgKiBnKSAvIChCQ19EQSArIEVEIC0gRUIpO1xuICAgICAgICB2YXIgYmwgPSBiIC0gbCwgayA9IChFICogKGcgLSBsKSAtIEMgKiBibCkgLyBEO1xuICAgICAgICBzID0gTWF0aC5zcXJ0KGsgKiBrICsgYmwgKiBibCkgLyAoRSAqIGwgKiAoMSAtIGwpKTsgLy8gTmFOIGlmIGw9MCBvciBsPTFcbiAgICAgICAgaCA9IHMgPyBNYXRoLmF0YW4yKGssIGJsKSAqIHJhZDJkZWcgLSAxMjAgOiBOYU47XG4gICAgICAgIGlmIChoIDwgMCkgaCArPSAzNjA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ3ViZWhlbGl4KGgsIHMsIGwpO1xuICB9ZnVuY3Rpb24gQ3ViZWhlbGl4KGgsIHMsIGwpIHtcbiAgICB0aGlzLmggPSAraDtcbiAgICB0aGlzLnMgPSArcztcbiAgICB0aGlzLmwgPSArbDtcbiAgfXZhciBwcm90b3R5cGUgPSBjdWJlaGVsaXgucHJvdG90eXBlID0gQ3ViZWhlbGl4LnByb3RvdHlwZSA9IG5ldyBDb2xvcjtcblxuICBwcm90b3R5cGUuYnJpZ2h0ZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgQ3ViZWhlbGl4KHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrKTtcbiAgfTtcblxuICBwcm90b3R5cGUuZGFya2VyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgQ3ViZWhlbGl4KHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrKTtcbiAgfTtcblxuICBwcm90b3R5cGUucmdiID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGggPSBpc05hTih0aGlzLmgpID8gMCA6ICh0aGlzLmggKyAxMjApICogZGVnMnJhZCxcbiAgICAgICAgbCA9ICt0aGlzLmwsXG4gICAgICAgIGEgPSBpc05hTih0aGlzLnMpID8gMCA6IHRoaXMucyAqIGwgKiAoMSAtIGwpLFxuICAgICAgICBjb3NoID0gTWF0aC5jb3MoaCksXG4gICAgICAgIHNpbmggPSBNYXRoLnNpbihoKTtcbiAgICByZXR1cm4gbmV3IFJnYihcbiAgICAgIDI1NSAqIChsICsgYSAqIChBICogY29zaCArIEIgKiBzaW5oKSksXG4gICAgICAyNTUgKiAobCArIGEgKiAoQyAqIGNvc2ggKyBEICogc2luaCkpLFxuICAgICAgMjU1ICogKGwgKyBhICogKEUgKiBjb3NoKSlcbiAgICApO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlQ3ViZWhlbGl4R2FtbWEoZ2FtbWEpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYSwgYikge1xuICAgICAgYSA9IGN1YmVoZWxpeChhKTtcbiAgICAgIGIgPSBjdWJlaGVsaXgoYik7XG4gICAgICB2YXIgYWggPSBpc05hTihhLmgpID8gYi5oIDogYS5oLFxuICAgICAgICAgIGFzID0gaXNOYU4oYS5zKSA/IGIucyA6IGEucyxcbiAgICAgICAgICBhbCA9IGEubCxcbiAgICAgICAgICBiaCA9IGlzTmFOKGIuaCkgPyAwIDogZGVsdGFIdWUoYi5oLCBhaCksXG4gICAgICAgICAgYnMgPSBpc05hTihiLnMpID8gMCA6IGIucyAtIGFzLFxuICAgICAgICAgIGJsID0gYi5sIC0gYWw7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgICBhLmggPSBhaCArIGJoICogdDtcbiAgICAgICAgYS5zID0gYXMgKyBicyAqIHQ7XG4gICAgICAgIGEubCA9IGFsICsgYmwgKiBNYXRoLnBvdyh0LCBnYW1tYSk7XG4gICAgICAgIHJldHVybiBhICsgXCJcIjtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlQ3ViZWhlbGl4R2FtbWFMb25nKGdhbW1hKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIGEgPSBjdWJlaGVsaXgoYSk7XG4gICAgICBiID0gY3ViZWhlbGl4KGIpO1xuICAgICAgdmFyIGFoID0gaXNOYU4oYS5oKSA/IGIuaCA6IGEuaCxcbiAgICAgICAgICBhcyA9IGlzTmFOKGEucykgPyBiLnMgOiBhLnMsXG4gICAgICAgICAgYWwgPSBhLmwsXG4gICAgICAgICAgYmggPSBpc05hTihiLmgpID8gMCA6IGIuaCAtIGFoLFxuICAgICAgICAgIGJzID0gaXNOYU4oYi5zKSA/IDAgOiBiLnMgLSBhcyxcbiAgICAgICAgICBibCA9IGIubCAtIGFsO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgYS5oID0gYWggKyBiaCAqIHQ7XG4gICAgICAgIGEucyA9IGFzICsgYnMgKiB0O1xuICAgICAgICBhLmwgPSBhbCArIGJsICogTWF0aC5wb3codCwgZ2FtbWEpO1xuICAgICAgICByZXR1cm4gYSArIFwiXCI7XG4gICAgICB9O1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZUhjbExvbmcoYSwgYikge1xuICAgIGEgPSBoY2woYSk7XG4gICAgYiA9IGhjbChiKTtcbiAgICB2YXIgYWggPSBpc05hTihhLmgpID8gYi5oIDogYS5oLFxuICAgICAgICBhYyA9IGlzTmFOKGEuYykgPyBiLmMgOiBhLmMsXG4gICAgICAgIGFsID0gYS5sLFxuICAgICAgICBiaCA9IGlzTmFOKGIuaCkgPyAwIDogYi5oIC0gYWgsXG4gICAgICAgIGJjID0gaXNOYU4oYi5jKSA/IDAgOiBiLmMgLSBhYyxcbiAgICAgICAgYmwgPSBiLmwgLSBhbDtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgYS5oID0gYWggKyBiaCAqIHQ7XG4gICAgICBhLmMgPSBhYyArIGJjICogdDtcbiAgICAgIGEubCA9IGFsICsgYmwgKiB0O1xuICAgICAgcmV0dXJuIGEgKyBcIlwiO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZUhjbChhLCBiKSB7XG4gICAgYSA9IGhjbChhKTtcbiAgICBiID0gaGNsKGIpO1xuICAgIHZhciBhaCA9IGlzTmFOKGEuaCkgPyBiLmggOiBhLmgsXG4gICAgICAgIGFjID0gaXNOYU4oYS5jKSA/IGIuYyA6IGEuYyxcbiAgICAgICAgYWwgPSBhLmwsXG4gICAgICAgIGJoID0gaXNOYU4oYi5oKSA/IDAgOiBkZWx0YUh1ZShiLmgsIGFoKSxcbiAgICAgICAgYmMgPSBpc05hTihiLmMpID8gMCA6IGIuYyAtIGFjLFxuICAgICAgICBibCA9IGIubCAtIGFsO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBhLmggPSBhaCArIGJoICogdDtcbiAgICAgIGEuYyA9IGFjICsgYmMgKiB0O1xuICAgICAgYS5sID0gYWwgKyBibCAqIHQ7XG4gICAgICByZXR1cm4gYSArIFwiXCI7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlTGFiKGEsIGIpIHtcbiAgICBhID0gbGFiKGEpO1xuICAgIGIgPSBsYWIoYik7XG4gICAgdmFyIGFsID0gYS5sLFxuICAgICAgICBhYSA9IGEuYSxcbiAgICAgICAgYWIgPSBhLmIsXG4gICAgICAgIGJsID0gYi5sIC0gYWwsXG4gICAgICAgIGJhID0gYi5hIC0gYWEsXG4gICAgICAgIGJiID0gYi5iIC0gYWI7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGEubCA9IGFsICsgYmwgKiB0O1xuICAgICAgYS5hID0gYWEgKyBiYSAqIHQ7XG4gICAgICBhLmIgPSBhYiArIGJiICogdDtcbiAgICAgIHJldHVybiBhICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGVIc2xMb25nKGEsIGIpIHtcbiAgICBhID0gaHNsKGEpO1xuICAgIGIgPSBoc2woYik7XG4gICAgdmFyIGFoID0gaXNOYU4oYS5oKSA/IGIuaCA6IGEuaCxcbiAgICAgICAgYXMgPSBpc05hTihhLnMpID8gYi5zIDogYS5zLFxuICAgICAgICBhbCA9IGEubCxcbiAgICAgICAgYmggPSBpc05hTihiLmgpID8gMCA6IGIuaCAtIGFoLFxuICAgICAgICBicyA9IGlzTmFOKGIucykgPyAwIDogYi5zIC0gYXMsXG4gICAgICAgIGJsID0gYi5sIC0gYWw7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGEuaCA9IGFoICsgYmggKiB0O1xuICAgICAgYS5zID0gYXMgKyBicyAqIHQ7XG4gICAgICBhLmwgPSBhbCArIGJsICogdDtcbiAgICAgIHJldHVybiBhICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGVIc2woYSwgYikge1xuICAgIGEgPSBoc2woYSk7XG4gICAgYiA9IGhzbChiKTtcbiAgICB2YXIgYWggPSBpc05hTihhLmgpID8gYi5oIDogYS5oLFxuICAgICAgICBhcyA9IGlzTmFOKGEucykgPyBiLnMgOiBhLnMsXG4gICAgICAgIGFsID0gYS5sLFxuICAgICAgICBiaCA9IGlzTmFOKGIuaCkgPyAwIDogZGVsdGFIdWUoYi5oLCBhaCksXG4gICAgICAgIGJzID0gaXNOYU4oYi5zKSA/IDAgOiBiLnMgLSBhcyxcbiAgICAgICAgYmwgPSBiLmwgLSBhbDtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgYS5oID0gYWggKyBiaCAqIHQ7XG4gICAgICBhLnMgPSBhcyArIGJzICogdDtcbiAgICAgIGEubCA9IGFsICsgYmwgKiB0O1xuICAgICAgcmV0dXJuIGEgKyBcIlwiO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZVJnYihhLCBiKSB7XG4gICAgYSA9IHJnYihhKTtcbiAgICBiID0gcmdiKGIpO1xuICAgIHZhciBhciA9IGEucixcbiAgICAgICAgYWcgPSBhLmcsXG4gICAgICAgIGFiID0gYS5iLFxuICAgICAgICBiciA9IGIuciAtIGFyLFxuICAgICAgICBiZyA9IGIuZyAtIGFnLFxuICAgICAgICBiYiA9IGIuYiAtIGFiO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gX2Zvcm1hdChNYXRoLnJvdW5kKGFyICsgYnIgKiB0KSwgTWF0aC5yb3VuZChhZyArIGJnICogdCksIE1hdGgucm91bmQoYWIgKyBiYiAqIHQpKTtcbiAgICB9O1xuICB9XG5cbiAgdmFyIGludGVycG9sYXRlQ3ViZWhlbGl4ID0gaW50ZXJwb2xhdGVDdWJlaGVsaXhHYW1tYSgxKTtcbiAgdmFyIGludGVycG9sYXRlQ3ViZWhlbGl4TG9uZyA9IGludGVycG9sYXRlQ3ViZWhlbGl4R2FtbWFMb25nKDEpO1xuXG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVDdWJlaGVsaXggPSBpbnRlcnBvbGF0ZUN1YmVoZWxpeDtcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUN1YmVoZWxpeExvbmcgPSBpbnRlcnBvbGF0ZUN1YmVoZWxpeExvbmc7XG4gIGV4cG9ydHMuY29sb3IgPSBjb2xvcjtcbiAgZXhwb3J0cy5yZ2IgPSByZ2I7XG4gIGV4cG9ydHMuaHNsID0gaHNsO1xuICBleHBvcnRzLmxhYiA9IGxhYjtcbiAgZXhwb3J0cy5oY2wgPSBoY2w7XG4gIGV4cG9ydHMuY3ViZWhlbGl4ID0gY3ViZWhlbGl4O1xuICBleHBvcnRzLmludGVycG9sYXRlUmdiID0gaW50ZXJwb2xhdGVSZ2I7XG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVIc2wgPSBpbnRlcnBvbGF0ZUhzbDtcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUhzbExvbmcgPSBpbnRlcnBvbGF0ZUhzbExvbmc7XG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVMYWIgPSBpbnRlcnBvbGF0ZUxhYjtcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUhjbCA9IGludGVycG9sYXRlSGNsO1xuICBleHBvcnRzLmludGVycG9sYXRlSGNsTG9uZyA9IGludGVycG9sYXRlSGNsTG9uZztcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUN1YmVoZWxpeEdhbW1hID0gaW50ZXJwb2xhdGVDdWJlaGVsaXhHYW1tYTtcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUN1YmVoZWxpeEdhbW1hTG9uZyA9IGludGVycG9sYXRlQ3ViZWhlbGl4R2FtbWFMb25nO1xuXG59KSk7IiwiaWYgKHR5cGVvZiBNYXAgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgTWFwID0gZnVuY3Rpb24oKSB7IHRoaXMuY2xlYXIoKTsgfTtcbiAgTWFwLnByb3RvdHlwZSA9IHtcbiAgICBzZXQ6IGZ1bmN0aW9uKGssIHYpIHsgdGhpcy5fW2tdID0gdjsgcmV0dXJuIHRoaXM7IH0sXG4gICAgZ2V0OiBmdW5jdGlvbihrKSB7IHJldHVybiB0aGlzLl9ba107IH0sXG4gICAgaGFzOiBmdW5jdGlvbihrKSB7IHJldHVybiBrIGluIHRoaXMuXzsgfSxcbiAgICBkZWxldGU6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIGsgaW4gdGhpcy5fICYmIGRlbGV0ZSB0aGlzLl9ba107IH0sXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkgeyB0aGlzLl8gPSBPYmplY3QuY3JlYXRlKG51bGwpOyB9LFxuICAgIGdldCBzaXplKCkgeyB2YXIgbiA9IDA7IGZvciAodmFyIGsgaW4gdGhpcy5fKSArK247IHJldHVybiBuOyB9LFxuICAgIGZvckVhY2g6IGZ1bmN0aW9uKGMpIHsgZm9yICh2YXIgayBpbiB0aGlzLl8pIGModGhpcy5fW2tdLCBrLCB0aGlzKTsgfVxuICB9O1xufSBlbHNlIChmdW5jdGlvbigpIHtcbiAgdmFyIG0gPSBuZXcgTWFwO1xuICBpZiAobS5zZXQoMCwgMCkgIT09IG0pIHtcbiAgICBtID0gbS5zZXQ7XG4gICAgTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbigpIHsgbS5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyByZXR1cm4gdGhpczsgfTtcbiAgfVxufSkoKTtcblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICBmYWN0b3J5KChnbG9iYWwuZm9ybWF0ID0ge30pKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciB6aENuID0ge1xuICAgIGRlY2ltYWw6IFwiLlwiLFxuICAgIHRob3VzYW5kczogXCIsXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wiwqVcIiwgXCJcIl1cbiAgfTtcblxuICB2YXIgcnVSdSA9IHtcbiAgICBkZWNpbWFsOiBcIixcIixcbiAgICB0aG91c2FuZHM6IFwiXFx4YTBcIixcbiAgICBncm91cGluZzogWzNdLFxuICAgIGN1cnJlbmN5OiBbXCJcIiwgXCJcXHhhMNGA0YPQsS5cIl1cbiAgfTtcblxuICB2YXIgcHRCciA9IHtcbiAgICBkZWNpbWFsOiBcIixcIixcbiAgICB0aG91c2FuZHM6IFwiLlwiLFxuICAgIGdyb3VwaW5nOiBbM10sXG4gICAgY3VycmVuY3k6IFtcIlIkXCIsIFwiXCJdXG4gIH07XG5cbiAgdmFyIHBsUGwgPSB7XG4gICAgZGVjaW1hbDogXCIsXCIsXG4gICAgdGhvdXNhbmRzOiBcIi5cIixcbiAgICBncm91cGluZzogWzNdLFxuICAgIGN1cnJlbmN5OiBbXCJcIiwgXCJ6xYJcIl1cbiAgfTtcblxuICB2YXIgbmxObCA9IHtcbiAgICBkZWNpbWFsOiBcIixcIixcbiAgICB0aG91c2FuZHM6IFwiLlwiLFxuICAgIGdyb3VwaW5nOiBbM10sXG4gICAgY3VycmVuY3k6IFtcIuKCrFxceGEwXCIsIFwiXCJdXG4gIH07XG5cbiAgdmFyIG1rTWsgPSB7XG4gICAgZGVjaW1hbDogXCIsXCIsXG4gICAgdGhvdXNhbmRzOiBcIi5cIixcbiAgICBncm91cGluZzogWzNdLFxuICAgIGN1cnJlbmN5OiBbXCJcIiwgXCJcXHhhMNC00LXQvS5cIl1cbiAgfTtcblxuICB2YXIgamFKcCA9IHtcbiAgICBkZWNpbWFsOiBcIi5cIixcbiAgICB0aG91c2FuZHM6IFwiLFwiLFxuICAgIGdyb3VwaW5nOiBbM10sXG4gICAgY3VycmVuY3k6IFtcIlwiLCBcIuWGhlwiXVxuICB9O1xuXG4gIHZhciBpdEl0ID0ge1xuICAgIGRlY2ltYWw6IFwiLFwiLFxuICAgIHRob3VzYW5kczogXCIuXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wi4oKsXCIsIFwiXCJdXG4gIH07XG5cbiAgdmFyIGhlSWwgPSB7XG4gICAgZGVjaW1hbDogXCIuXCIsXG4gICAgdGhvdXNhbmRzOiBcIixcIixcbiAgICBncm91cGluZzogWzNdLFxuICAgIGN1cnJlbmN5OiBbXCLigqpcIiwgXCJcIl1cbiAgfTtcblxuICB2YXIgZnJGciA9IHtcbiAgICBkZWNpbWFsOiBcIixcIixcbiAgICB0aG91c2FuZHM6IFwiLlwiLFxuICAgIGdyb3VwaW5nOiBbM10sXG4gICAgY3VycmVuY3k6IFtcIlwiLCBcIlxceGEw4oKsXCJdXG4gIH07XG5cbiAgdmFyIGZyQ2EgPSB7XG4gICAgZGVjaW1hbDogXCIsXCIsXG4gICAgdGhvdXNhbmRzOiBcIlxceGEwXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wiXCIsIFwiJFwiXVxuICB9O1xuXG4gIHZhciBmaUZpID0ge1xuICAgIGRlY2ltYWw6IFwiLFwiLFxuICAgIHRob3VzYW5kczogXCJcXHhhMFwiLFxuICAgIGdyb3VwaW5nOiBbM10sXG4gICAgY3VycmVuY3k6IFtcIlwiLCBcIlxceGEw4oKsXCJdXG4gIH07XG5cbiAgdmFyIGVzRXMgPSB7XG4gICAgZGVjaW1hbDogXCIsXCIsXG4gICAgdGhvdXNhbmRzOiBcIi5cIixcbiAgICBncm91cGluZzogWzNdLFxuICAgIGN1cnJlbmN5OiBbXCJcIiwgXCJcXHhhMOKCrFwiXVxuICB9O1xuXG4gIHZhciBlblVzID0ge1xuICAgIGRlY2ltYWw6IFwiLlwiLFxuICAgIHRob3VzYW5kczogXCIsXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wiJFwiLCBcIlwiXVxuICB9O1xuXG4gIHZhciBlbkdiID0ge1xuICAgIGRlY2ltYWw6IFwiLlwiLFxuICAgIHRob3VzYW5kczogXCIsXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wiwqNcIiwgXCJcIl1cbiAgfTtcblxuICB2YXIgZW5DYSA9IHtcbiAgICBkZWNpbWFsOiBcIi5cIixcbiAgICB0aG91c2FuZHM6IFwiLFwiLFxuICAgIGdyb3VwaW5nOiBbM10sXG4gICAgY3VycmVuY3k6IFtcIiRcIiwgXCJcIl1cbiAgfTtcblxuICB2YXIgZGVEZSA9IHtcbiAgICBkZWNpbWFsOiBcIixcIixcbiAgICB0aG91c2FuZHM6IFwiLlwiLFxuICAgIGdyb3VwaW5nOiBbM10sXG4gICAgY3VycmVuY3k6IFtcIlwiLCBcIlxceGEw4oKsXCJdXG4gIH07XG5cbiAgdmFyIGNhRXMgPSB7XG4gICAgZGVjaW1hbDogXCIsXCIsXG4gICAgdGhvdXNhbmRzOiBcIi5cIixcbiAgICBncm91cGluZzogWzNdLFxuICAgIGN1cnJlbmN5OiBbXCJcIiwgXCJcXHhhMOKCrFwiXVxuICB9O1xuXG5cbiAgLy8gQ29tcHV0ZXMgdGhlIGRlY2ltYWwgY29lZmZpY2llbnQgYW5kIGV4cG9uZW50IG9mIHRoZSBzcGVjaWZpZWQgbnVtYmVyIHggd2l0aFxuICAvLyBzaWduaWZpY2FudCBkaWdpdHMgcCwgd2hlcmUgeCBpcyBwb3NpdGl2ZSBhbmQgcCBpcyBpbiBbMSwgMjFdIG9yIHVuZGVmaW5lZC5cbiAgLy8gRm9yIGV4YW1wbGUsIGZvcm1hdERlY2ltYWwoMS4yMykgcmV0dXJucyBbXCIxMjNcIiwgMF0uXG4gIGZ1bmN0aW9uIGZvcm1hdERlY2ltYWwoeCwgcCkge1xuICAgIGlmICgoaSA9ICh4ID0gcCA/IHgudG9FeHBvbmVudGlhbChwIC0gMSkgOiB4LnRvRXhwb25lbnRpYWwoKSkuaW5kZXhPZihcImVcIikpIDwgMCkgcmV0dXJuIG51bGw7IC8vIE5hTiwgwrFJbmZpbml0eVxuICAgIHZhciBpLCBjb2VmZmljaWVudCA9IHguc2xpY2UoMCwgaSk7XG5cbiAgICAvLyBUaGUgc3RyaW5nIHJldHVybmVkIGJ5IHRvRXhwb25lbnRpYWwgZWl0aGVyIGhhcyB0aGUgZm9ybSBcXGRcXC5cXGQrZVstK11cXGQrXG4gICAgLy8gKGUuZy4sIDEuMmUrMykgb3IgdGhlIGZvcm0gXFxkZVstK11cXGQrIChlLmcuLCAxZSszKS5cbiAgICByZXR1cm4gW1xuICAgICAgY29lZmZpY2llbnQubGVuZ3RoID4gMSA/IGNvZWZmaWNpZW50WzBdICsgY29lZmZpY2llbnQuc2xpY2UoMikgOiBjb2VmZmljaWVudCxcbiAgICAgICt4LnNsaWNlKGkgKyAxKVxuICAgIF07XG4gIH1cblxuICBmdW5jdGlvbiBleHBvbmVudCh4KSB7XG4gICAgcmV0dXJuIHggPSBmb3JtYXREZWNpbWFsKE1hdGguYWJzKHgpKSwgeCA/IHhbMV0gOiBOYU47XG4gIH1cblxuICB2YXIgcHJlZml4RXhwb25lbnQ7XG5cbiAgZnVuY3Rpb24gZm9ybWF0UHJlZml4QXV0byh4LCBwKSB7XG4gICAgdmFyIGQgPSBmb3JtYXREZWNpbWFsKHgsIHApO1xuICAgIGlmICghZCkgcmV0dXJuIHggKyBcIlwiO1xuICAgIHZhciBjb2VmZmljaWVudCA9IGRbMF0sXG4gICAgICAgIGV4cG9uZW50ID0gZFsxXSxcbiAgICAgICAgaSA9IGV4cG9uZW50IC0gKHByZWZpeEV4cG9uZW50ID0gTWF0aC5tYXgoLTgsIE1hdGgubWluKDgsIE1hdGguZmxvb3IoZXhwb25lbnQgLyAzKSkpICogMykgKyAxLFxuICAgICAgICBuID0gY29lZmZpY2llbnQubGVuZ3RoO1xuICAgIHJldHVybiBpID09PSBuID8gY29lZmZpY2llbnRcbiAgICAgICAgOiBpID4gbiA/IGNvZWZmaWNpZW50ICsgbmV3IEFycmF5KGkgLSBuICsgMSkuam9pbihcIjBcIilcbiAgICAgICAgOiBpID4gMCA/IGNvZWZmaWNpZW50LnNsaWNlKDAsIGkpICsgXCIuXCIgKyBjb2VmZmljaWVudC5zbGljZShpKVxuICAgICAgICA6IFwiMC5cIiArIG5ldyBBcnJheSgxIC0gaSkuam9pbihcIjBcIikgKyBmb3JtYXREZWNpbWFsKHgsIHAgKyBpIC0gMSlbMF07IC8vIGxlc3MgdGhhbiAxeSFcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFJvdW5kZWQoeCwgcCkge1xuICAgIHZhciBkID0gZm9ybWF0RGVjaW1hbCh4LCBwKTtcbiAgICBpZiAoIWQpIHJldHVybiB4ICsgXCJcIjtcbiAgICB2YXIgY29lZmZpY2llbnQgPSBkWzBdLFxuICAgICAgICBleHBvbmVudCA9IGRbMV07XG4gICAgcmV0dXJuIGV4cG9uZW50IDwgMCA/IFwiMC5cIiArIG5ldyBBcnJheSgtZXhwb25lbnQpLmpvaW4oXCIwXCIpICsgY29lZmZpY2llbnRcbiAgICAgICAgOiBjb2VmZmljaWVudC5sZW5ndGggPiBleHBvbmVudCArIDEgPyBjb2VmZmljaWVudC5zbGljZSgwLCBleHBvbmVudCArIDEpICsgXCIuXCIgKyBjb2VmZmljaWVudC5zbGljZShleHBvbmVudCArIDEpXG4gICAgICAgIDogY29lZmZpY2llbnQgKyBuZXcgQXJyYXkoZXhwb25lbnQgLSBjb2VmZmljaWVudC5sZW5ndGggKyAyKS5qb2luKFwiMFwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdERlZmF1bHQoeCwgcCkge1xuICAgIHggPSB4LnRvUHJlY2lzaW9uKHApO1xuXG4gICAgb3V0OiBmb3IgKHZhciBuID0geC5sZW5ndGgsIGkgPSAxLCBpMCA9IC0xLCBpMTsgaSA8IG47ICsraSkge1xuICAgICAgc3dpdGNoICh4W2ldKSB7XG4gICAgICAgIGNhc2UgXCIuXCI6IGkwID0gaTEgPSBpOyBicmVhaztcbiAgICAgICAgY2FzZSBcIjBcIjogaWYgKGkwID09PSAwKSBpMCA9IGk7IGkxID0gaTsgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJlXCI6IGJyZWFrIG91dDtcbiAgICAgICAgZGVmYXVsdDogaWYgKGkwID4gMCkgaTAgPSAwOyBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaTAgPiAwID8geC5zbGljZSgwLCBpMCkgKyB4LnNsaWNlKGkxICsgMSkgOiB4O1xuICB9XG5cbiAgdmFyIGZvcm1hdFR5cGVzID0ge1xuICAgIFwiXCI6IGZvcm1hdERlZmF1bHQsXG4gICAgXCIlXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuICh4ICogMTAwKS50b0ZpeGVkKHApOyB9LFxuICAgIFwiYlwiOiBmdW5jdGlvbih4KSB7IHJldHVybiBNYXRoLnJvdW5kKHgpLnRvU3RyaW5nKDIpOyB9LFxuICAgIFwiY1wiOiBmdW5jdGlvbih4KSB7IHJldHVybiB4ICsgXCJcIjsgfSxcbiAgICBcImRcIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZygxMCk7IH0sXG4gICAgXCJlXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuIHgudG9FeHBvbmVudGlhbChwKTsgfSxcbiAgICBcImZcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4geC50b0ZpeGVkKHApOyB9LFxuICAgIFwiZ1wiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiB4LnRvUHJlY2lzaW9uKHApOyB9LFxuICAgIFwib1wiOiBmdW5jdGlvbih4KSB7IHJldHVybiBNYXRoLnJvdW5kKHgpLnRvU3RyaW5nKDgpOyB9LFxuICAgIFwicFwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiBmb3JtYXRSb3VuZGVkKHggKiAxMDAsIHApOyB9LFxuICAgIFwiclwiOiBmb3JtYXRSb3VuZGVkLFxuICAgIFwic1wiOiBmb3JtYXRQcmVmaXhBdXRvLFxuICAgIFwiWFwiOiBmdW5jdGlvbih4KSB7IHJldHVybiBNYXRoLnJvdW5kKHgpLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpOyB9LFxuICAgIFwieFwiOiBmdW5jdGlvbih4KSB7IHJldHVybiBNYXRoLnJvdW5kKHgpLnRvU3RyaW5nKDE2KTsgfVxuICB9O1xuXG5cbiAgLy8gW1tmaWxsXWFsaWduXVtzaWduXVtzeW1ib2xdWzBdW3dpZHRoXVssXVsucHJlY2lzaW9uXVt0eXBlXVxuICB2YXIgcmUgPSAvXig/OiguKT8oWzw+PV5dKSk/KFsrXFwtXFwoIF0pPyhbJCNdKT8oMCk/KFxcZCspPygsKT8oXFwuXFxkKyk/KFthLXolXSk/JC9pO1xuXG4gIGZ1bmN0aW9uIGZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpIHtcbiAgICByZXR1cm4gbmV3IEZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gRm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcikge1xuICAgIGlmICghKG1hdGNoID0gcmUuZXhlYyhzcGVjaWZpZXIpKSkgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBmb3JtYXQ6IFwiICsgc3BlY2lmaWVyKTtcblxuICAgIHZhciBtYXRjaCxcbiAgICAgICAgZmlsbCA9IG1hdGNoWzFdIHx8IFwiIFwiLFxuICAgICAgICBhbGlnbiA9IG1hdGNoWzJdIHx8IFwiPlwiLFxuICAgICAgICBzaWduID0gbWF0Y2hbM10gfHwgXCItXCIsXG4gICAgICAgIHN5bWJvbCA9IG1hdGNoWzRdIHx8IFwiXCIsXG4gICAgICAgIHplcm8gPSAhIW1hdGNoWzVdLFxuICAgICAgICB3aWR0aCA9IG1hdGNoWzZdICYmICttYXRjaFs2XSxcbiAgICAgICAgY29tbWEgPSAhIW1hdGNoWzddLFxuICAgICAgICBwcmVjaXNpb24gPSBtYXRjaFs4XSAmJiArbWF0Y2hbOF0uc2xpY2UoMSksXG4gICAgICAgIHR5cGUgPSBtYXRjaFs5XSB8fCBcIlwiO1xuXG4gICAgLy8gVGhlIFwiblwiIHR5cGUgaXMgYW4gYWxpYXMgZm9yIFwiLGdcIi5cbiAgICBpZiAodHlwZSA9PT0gXCJuXCIpIGNvbW1hID0gdHJ1ZSwgdHlwZSA9IFwiZ1wiO1xuXG4gICAgLy8gTWFwIGludmFsaWQgdHlwZXMgdG8gdGhlIGRlZmF1bHQgZm9ybWF0LlxuICAgIGVsc2UgaWYgKCFmb3JtYXRUeXBlc1t0eXBlXSkgdHlwZSA9IFwiXCI7XG5cbiAgICAvLyBJZiB6ZXJvIGZpbGwgaXMgc3BlY2lmaWVkLCBwYWRkaW5nIGdvZXMgYWZ0ZXIgc2lnbiBhbmQgYmVmb3JlIGRpZ2l0cy5cbiAgICBpZiAoemVybyB8fCAoZmlsbCA9PT0gXCIwXCIgJiYgYWxpZ24gPT09IFwiPVwiKSkgemVybyA9IHRydWUsIGZpbGwgPSBcIjBcIiwgYWxpZ24gPSBcIj1cIjtcblxuICAgIHRoaXMuZmlsbCA9IGZpbGw7XG4gICAgdGhpcy5hbGlnbiA9IGFsaWduO1xuICAgIHRoaXMuc2lnbiA9IHNpZ247XG4gICAgdGhpcy5zeW1ib2wgPSBzeW1ib2w7XG4gICAgdGhpcy56ZXJvID0gemVybztcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5jb21tYSA9IGNvbW1hO1xuICAgIHRoaXMucHJlY2lzaW9uID0gcHJlY2lzaW9uO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gIH1cblxuICBGb3JtYXRTcGVjaWZpZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsbFxuICAgICAgICArIHRoaXMuYWxpZ25cbiAgICAgICAgKyB0aGlzLnNpZ25cbiAgICAgICAgKyB0aGlzLnN5bWJvbFxuICAgICAgICArICh0aGlzLnplcm8gPyBcIjBcIiA6IFwiXCIpXG4gICAgICAgICsgKHRoaXMud2lkdGggPT0gbnVsbCA/IFwiXCIgOiBNYXRoLm1heCgxLCB0aGlzLndpZHRoIHwgMCkpXG4gICAgICAgICsgKHRoaXMuY29tbWEgPyBcIixcIiA6IFwiXCIpXG4gICAgICAgICsgKHRoaXMucHJlY2lzaW9uID09IG51bGwgPyBcIlwiIDogXCIuXCIgKyBNYXRoLm1heCgwLCB0aGlzLnByZWNpc2lvbiB8IDApKVxuICAgICAgICArIHRoaXMudHlwZTtcbiAgfTtcblxuICBmdW5jdGlvbiBmb3JtYXRHcm91cChncm91cGluZywgdGhvdXNhbmRzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCB3aWR0aCkge1xuICAgICAgdmFyIGkgPSB2YWx1ZS5sZW5ndGgsXG4gICAgICAgICAgdCA9IFtdLFxuICAgICAgICAgIGogPSAwLFxuICAgICAgICAgIGcgPSBncm91cGluZ1swXSxcbiAgICAgICAgICBsZW5ndGggPSAwO1xuXG4gICAgICB3aGlsZSAoaSA+IDAgJiYgZyA+IDApIHtcbiAgICAgICAgaWYgKGxlbmd0aCArIGcgKyAxID4gd2lkdGgpIGcgPSBNYXRoLm1heCgxLCB3aWR0aCAtIGxlbmd0aCk7XG4gICAgICAgIHQucHVzaCh2YWx1ZS5zdWJzdHJpbmcoaSAtPSBnLCBpICsgZykpO1xuICAgICAgICBpZiAoKGxlbmd0aCArPSBnICsgMSkgPiB3aWR0aCkgYnJlYWs7XG4gICAgICAgIGcgPSBncm91cGluZ1tqID0gKGogKyAxKSAlIGdyb3VwaW5nLmxlbmd0aF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0LnJldmVyc2UoKS5qb2luKHRob3VzYW5kcyk7XG4gICAgfTtcbiAgfVxuXG4gIHZhciBwcmVmaXhlcyA9IFtcInlcIixcInpcIixcImFcIixcImZcIixcInBcIixcIm5cIixcIsK1XCIsXCJtXCIsXCJcIixcImtcIixcIk1cIixcIkdcIixcIlRcIixcIlBcIixcIkVcIixcIlpcIixcIllcIl07XG5cbiAgZnVuY3Rpb24gaWRlbnRpdHkoeCkge1xuICAgIHJldHVybiB4O1xuICB9XG5cbiAgZnVuY3Rpb24gbG9jYWxlKGxvY2FsZSkge1xuICAgIHZhciBncm91cCA9IGxvY2FsZS5ncm91cGluZyAmJiBsb2NhbGUudGhvdXNhbmRzID8gZm9ybWF0R3JvdXAobG9jYWxlLmdyb3VwaW5nLCBsb2NhbGUudGhvdXNhbmRzKSA6IGlkZW50aXR5LFxuICAgICAgICBjdXJyZW5jeSA9IGxvY2FsZS5jdXJyZW5jeSxcbiAgICAgICAgZGVjaW1hbCA9IGxvY2FsZS5kZWNpbWFsO1xuXG4gICAgZnVuY3Rpb24gZm9ybWF0KHNwZWNpZmllcikge1xuICAgICAgc3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcik7XG5cbiAgICAgIHZhciBmaWxsID0gc3BlY2lmaWVyLmZpbGwsXG4gICAgICAgICAgYWxpZ24gPSBzcGVjaWZpZXIuYWxpZ24sXG4gICAgICAgICAgc2lnbiA9IHNwZWNpZmllci5zaWduLFxuICAgICAgICAgIHN5bWJvbCA9IHNwZWNpZmllci5zeW1ib2wsXG4gICAgICAgICAgemVybyA9IHNwZWNpZmllci56ZXJvLFxuICAgICAgICAgIHdpZHRoID0gc3BlY2lmaWVyLndpZHRoLFxuICAgICAgICAgIGNvbW1hID0gc3BlY2lmaWVyLmNvbW1hLFxuICAgICAgICAgIHByZWNpc2lvbiA9IHNwZWNpZmllci5wcmVjaXNpb24sXG4gICAgICAgICAgdHlwZSA9IHNwZWNpZmllci50eXBlO1xuXG4gICAgICAvLyBDb21wdXRlIHRoZSBwcmVmaXggYW5kIHN1ZmZpeC5cbiAgICAgIC8vIEZvciBTSS1wcmVmaXgsIHRoZSBzdWZmaXggaXMgbGF6aWx5IGNvbXB1dGVkLlxuICAgICAgdmFyIHByZWZpeCA9IHN5bWJvbCA9PT0gXCIkXCIgPyBjdXJyZW5jeVswXSA6IHN5bWJvbCA9PT0gXCIjXCIgJiYgL1tib3hYXS8udGVzdCh0eXBlKSA/IFwiMFwiICsgdHlwZS50b0xvd2VyQ2FzZSgpIDogXCJcIixcbiAgICAgICAgICBzdWZmaXggPSBzeW1ib2wgPT09IFwiJFwiID8gY3VycmVuY3lbMV0gOiAvWyVwXS8udGVzdCh0eXBlKSA/IFwiJVwiIDogXCJcIjtcblxuICAgICAgLy8gV2hhdCBmb3JtYXQgZnVuY3Rpb24gc2hvdWxkIHdlIHVzZT9cbiAgICAgIC8vIElzIHRoaXMgYW4gaW50ZWdlciB0eXBlP1xuICAgICAgLy8gQ2FuIHRoaXMgdHlwZSBnZW5lcmF0ZSBleHBvbmVudGlhbCBub3RhdGlvbj9cbiAgICAgIHZhciBmb3JtYXRUeXBlID0gZm9ybWF0VHlwZXNbdHlwZV0sXG4gICAgICAgICAgbWF5YmVTdWZmaXggPSAhdHlwZSB8fCAvW2RlZmdwcnMlXS8udGVzdCh0eXBlKTtcblxuICAgICAgLy8gU2V0IHRoZSBkZWZhdWx0IHByZWNpc2lvbiBpZiBub3Qgc3BlY2lmaWVkLFxuICAgICAgLy8gb3IgY2xhbXAgdGhlIHNwZWNpZmllZCBwcmVjaXNpb24gdG8gdGhlIHN1cHBvcnRlZCByYW5nZS5cbiAgICAgIC8vIEZvciBzaWduaWZpY2FudCBwcmVjaXNpb24sIGl0IG11c3QgYmUgaW4gWzEsIDIxXS5cbiAgICAgIC8vIEZvciBmaXhlZCBwcmVjaXNpb24sIGl0IG11c3QgYmUgaW4gWzAsIDIwXS5cbiAgICAgIHByZWNpc2lvbiA9IHByZWNpc2lvbiA9PSBudWxsID8gKHR5cGUgPyA2IDogMTIpXG4gICAgICAgICAgOiAvW2dwcnNdLy50ZXN0KHR5cGUpID8gTWF0aC5tYXgoMSwgTWF0aC5taW4oMjEsIHByZWNpc2lvbikpXG4gICAgICAgICAgOiBNYXRoLm1heCgwLCBNYXRoLm1pbigyMCwgcHJlY2lzaW9uKSk7XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICB2YXIgdmFsdWVQcmVmaXggPSBwcmVmaXgsXG4gICAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IHN1ZmZpeDtcblxuICAgICAgICBpZiAodHlwZSA9PT0gXCJjXCIpIHtcbiAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IGZvcm1hdFR5cGUodmFsdWUpICsgdmFsdWVTdWZmaXg7XG4gICAgICAgICAgdmFsdWUgPSBcIlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gK3ZhbHVlO1xuXG4gICAgICAgICAgLy8gQ29udmVydCBuZWdhdGl2ZSB0byBwb3NpdGl2ZSwgYW5kIGNvbXB1dGUgdGhlIHByZWZpeC5cbiAgICAgICAgICAvLyBOb3RlIHRoYXQgLTAgaXMgbm90IGxlc3MgdGhhbiAwLCBidXQgMSAvIC0wIGlzIVxuICAgICAgICAgIHZhciB2YWx1ZU5lZ2F0aXZlID0gKHZhbHVlIDwgMCB8fCAxIC8gdmFsdWUgPCAwKSAmJiAodmFsdWUgKj0gLTEsIHRydWUpO1xuXG4gICAgICAgICAgLy8gUGVyZm9ybSB0aGUgaW5pdGlhbCBmb3JtYXR0aW5nLlxuICAgICAgICAgIHZhbHVlID0gZm9ybWF0VHlwZSh2YWx1ZSwgcHJlY2lzaW9uKTtcblxuICAgICAgICAgIC8vIENvbXB1dGUgdGhlIHByZWZpeCBhbmQgc3VmZml4LlxuICAgICAgICAgIHZhbHVlUHJlZml4ID0gKHZhbHVlTmVnYXRpdmUgPyAoc2lnbiA9PT0gXCIoXCIgPyBzaWduIDogXCItXCIpIDogc2lnbiA9PT0gXCItXCIgfHwgc2lnbiA9PT0gXCIoXCIgPyBcIlwiIDogc2lnbikgKyB2YWx1ZVByZWZpeDtcbiAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IHZhbHVlU3VmZml4ICsgKHR5cGUgPT09IFwic1wiID8gcHJlZml4ZXNbOCArIHByZWZpeEV4cG9uZW50IC8gM10gOiBcIlwiKSArICh2YWx1ZU5lZ2F0aXZlICYmIHNpZ24gPT09IFwiKFwiID8gXCIpXCIgOiBcIlwiKTtcblxuICAgICAgICAgIC8vIEJyZWFrIHRoZSBmb3JtYXR0ZWQgdmFsdWUgaW50byB0aGUgaW50ZWdlciDigJx2YWx1ZeKAnSBwYXJ0IHRoYXQgY2FuIGJlXG4gICAgICAgICAgLy8gZ3JvdXBlZCwgYW5kIGZyYWN0aW9uYWwgb3IgZXhwb25lbnRpYWwg4oCcc3VmZml44oCdIHBhcnQgdGhhdCBpcyBub3QuXG4gICAgICAgICAgaWYgKG1heWJlU3VmZml4KSB7XG4gICAgICAgICAgICB2YXIgaSA9IC0xLCBuID0gdmFsdWUubGVuZ3RoLCBjO1xuICAgICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgICAgaWYgKGMgPSB2YWx1ZS5jaGFyQ29kZUF0KGkpLCA0OCA+IGMgfHwgYyA+IDU3KSB7XG4gICAgICAgICAgICAgICAgdmFsdWVTdWZmaXggPSAoYyA9PT0gNDYgPyBkZWNpbWFsICsgdmFsdWUuc2xpY2UoaSArIDEpIDogdmFsdWUuc2xpY2UoaSkpICsgdmFsdWVTdWZmaXg7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgwLCBpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSBmaWxsIGNoYXJhY3RlciBpcyBub3QgXCIwXCIsIGdyb3VwaW5nIGlzIGFwcGxpZWQgYmVmb3JlIHBhZGRpbmcuXG4gICAgICAgIGlmIChjb21tYSAmJiAhemVybykgdmFsdWUgPSBncm91cCh2YWx1ZSwgSW5maW5pdHkpO1xuXG4gICAgICAgIC8vIENvbXB1dGUgdGhlIHBhZGRpbmcuXG4gICAgICAgIHZhciBsZW5ndGggPSB2YWx1ZVByZWZpeC5sZW5ndGggKyB2YWx1ZS5sZW5ndGggKyB2YWx1ZVN1ZmZpeC5sZW5ndGgsXG4gICAgICAgICAgICBwYWRkaW5nID0gbGVuZ3RoIDwgd2lkdGggPyBuZXcgQXJyYXkod2lkdGggLSBsZW5ndGggKyAxKS5qb2luKGZpbGwpIDogXCJcIjtcblxuICAgICAgICAvLyBJZiB0aGUgZmlsbCBjaGFyYWN0ZXIgaXMgXCIwXCIsIGdyb3VwaW5nIGlzIGFwcGxpZWQgYWZ0ZXIgcGFkZGluZy5cbiAgICAgICAgaWYgKGNvbW1hICYmIHplcm8pIHZhbHVlID0gZ3JvdXAocGFkZGluZyArIHZhbHVlLCBwYWRkaW5nLmxlbmd0aCA/IHdpZHRoIC0gdmFsdWVTdWZmaXgubGVuZ3RoIDogSW5maW5pdHkpLCBwYWRkaW5nID0gXCJcIjtcblxuICAgICAgICAvLyBSZWNvbnN0cnVjdCB0aGUgZmluYWwgb3V0cHV0IGJhc2VkIG9uIHRoZSBkZXNpcmVkIGFsaWdubWVudC5cbiAgICAgICAgc3dpdGNoIChhbGlnbikge1xuICAgICAgICAgIGNhc2UgXCI8XCI6IHJldHVybiB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXggKyBwYWRkaW5nO1xuICAgICAgICAgIGNhc2UgXCI9XCI6IHJldHVybiB2YWx1ZVByZWZpeCArIHBhZGRpbmcgKyB2YWx1ZSArIHZhbHVlU3VmZml4O1xuICAgICAgICAgIGNhc2UgXCJeXCI6IHJldHVybiBwYWRkaW5nLnNsaWNlKDAsIGxlbmd0aCA9IHBhZGRpbmcubGVuZ3RoID4+IDEpICsgdmFsdWVQcmVmaXggKyB2YWx1ZSArIHZhbHVlU3VmZml4ICsgcGFkZGluZy5zbGljZShsZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYWRkaW5nICsgdmFsdWVQcmVmaXggKyB2YWx1ZSArIHZhbHVlU3VmZml4O1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRQcmVmaXgoc3BlY2lmaWVyLCB2YWx1ZSkge1xuICAgICAgdmFyIGYgPSBmb3JtYXQoKHNwZWNpZmllciA9IGZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpLCBzcGVjaWZpZXIudHlwZSA9IFwiZlwiLCBzcGVjaWZpZXIpKSxcbiAgICAgICAgICBlID0gTWF0aC5tYXgoLTgsIE1hdGgubWluKDgsIE1hdGguZmxvb3IoZXhwb25lbnQodmFsdWUpIC8gMykpKSAqIDMsXG4gICAgICAgICAgayA9IE1hdGgucG93KDEwLCAtZSksXG4gICAgICAgICAgcHJlZml4ID0gcHJlZml4ZXNbOCArIGUgLyAzXTtcbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZihrICogdmFsdWUpICsgcHJlZml4O1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZm9ybWF0OiBmb3JtYXQsXG4gICAgICBmb3JtYXRQcmVmaXg6IGZvcm1hdFByZWZpeFxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBwcmVjaXNpb25Sb3VuZChzdGVwLCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgZXhwb25lbnQoTWF0aC5hYnMobWF4KSkgLSBleHBvbmVudChNYXRoLmFicyhzdGVwKSkpICsgMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZWNpc2lvblByZWZpeChzdGVwLCB2YWx1ZSkge1xuICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCh2YWx1ZSkgLyAzKSkpICogMyAtIGV4cG9uZW50KE1hdGguYWJzKHN0ZXApKSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcmVjaXNpb25GaXhlZChzdGVwKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KDAsIC1leHBvbmVudChNYXRoLmFicyhzdGVwKSkpO1xuICB9XG5cbiAgdmFyIGxvY2FsZURlZmluaXRpb25zID0gKG5ldyBNYXApXG4gICAgICAuc2V0KFwiY2EtRVNcIiwgY2FFcylcbiAgICAgIC5zZXQoXCJkZS1ERVwiLCBkZURlKVxuICAgICAgLnNldChcImVuLUNBXCIsIGVuQ2EpXG4gICAgICAuc2V0KFwiZW4tR0JcIiwgZW5HYilcbiAgICAgIC5zZXQoXCJlbi1VU1wiLCBlblVzKVxuICAgICAgLnNldChcImVzLUVTXCIsIGVzRXMpXG4gICAgICAuc2V0KFwiZmktRklcIiwgZmlGaSlcbiAgICAgIC5zZXQoXCJmci1DQVwiLCBmckNhKVxuICAgICAgLnNldChcImZyLUZSXCIsIGZyRnIpXG4gICAgICAuc2V0KFwiaGUtSUxcIiwgaGVJbClcbiAgICAgIC5zZXQoXCJpdC1JVFwiLCBpdEl0KVxuICAgICAgLnNldChcImphLUpQXCIsIGphSnApXG4gICAgICAuc2V0KFwibWstTUtcIiwgbWtNaylcbiAgICAgIC5zZXQoXCJubC1OTFwiLCBubE5sKVxuICAgICAgLnNldChcInBsLVBMXCIsIHBsUGwpXG4gICAgICAuc2V0KFwicHQtQlJcIiwgcHRCcilcbiAgICAgIC5zZXQoXCJydS1SVVwiLCBydVJ1KVxuICAgICAgLnNldChcInpoLUNOXCIsIHpoQ24pO1xuXG4gIHZhciBkZWZhdWx0TG9jYWxlID0gbG9jYWxlKGVuVXMpO1xuICBleHBvcnRzLmZvcm1hdCA9IGRlZmF1bHRMb2NhbGUuZm9ybWF0O1xuICBleHBvcnRzLmZvcm1hdFByZWZpeCA9IGRlZmF1bHRMb2NhbGUuZm9ybWF0UHJlZml4O1xuXG4gIGZ1bmN0aW9uIGxvY2FsZUZvcm1hdChkZWZpbml0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbml0aW9uID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBkZWZpbml0aW9uID0gbG9jYWxlRGVmaW5pdGlvbnMuZ2V0KGRlZmluaXRpb24pO1xuICAgICAgaWYgKCFkZWZpbml0aW9uKSByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGxvY2FsZShkZWZpbml0aW9uKTtcbiAgfVxuICA7XG5cbiAgZXhwb3J0cy5sb2NhbGVGb3JtYXQgPSBsb2NhbGVGb3JtYXQ7XG4gIGV4cG9ydHMuZm9ybWF0U3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyO1xuICBleHBvcnRzLnByZWNpc2lvbkZpeGVkID0gcHJlY2lzaW9uRml4ZWQ7XG4gIGV4cG9ydHMucHJlY2lzaW9uUHJlZml4ID0gcHJlY2lzaW9uUHJlZml4O1xuICBleHBvcnRzLnByZWNpc2lvblJvdW5kID0gcHJlY2lzaW9uUm91bmQ7XG5cbn0pKTsiLCJpZiAodHlwZW9mIE1hcCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICBNYXAgPSBmdW5jdGlvbigpIHsgdGhpcy5jbGVhcigpOyB9O1xuICBNYXAucHJvdG90eXBlID0ge1xuICAgIHNldDogZnVuY3Rpb24oaywgdikgeyB0aGlzLl9ba10gPSB2OyByZXR1cm4gdGhpczsgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIHRoaXMuX1trXTsgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIGsgaW4gdGhpcy5fOyB9LFxuICAgIGRlbGV0ZTogZnVuY3Rpb24oaykgeyByZXR1cm4gayBpbiB0aGlzLl8gJiYgZGVsZXRlIHRoaXMuX1trXTsgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7IHRoaXMuXyA9IE9iamVjdC5jcmVhdGUobnVsbCk7IH0sXG4gICAgZ2V0IHNpemUoKSB7IHZhciBuID0gMDsgZm9yICh2YXIgayBpbiB0aGlzLl8pICsrbjsgcmV0dXJuIG47IH0sXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oYykgeyBmb3IgKHZhciBrIGluIHRoaXMuXykgYyh0aGlzLl9ba10sIGssIHRoaXMpOyB9XG4gIH07XG59IGVsc2UgKGZ1bmN0aW9uKCkge1xuICB2YXIgbSA9IG5ldyBNYXA7XG4gIGlmIChtLnNldCgwLCAwKSAhPT0gbSkge1xuICAgIG0gPSBtLnNldDtcbiAgICBNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKCkgeyBtLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IHJldHVybiB0aGlzOyB9O1xuICB9XG59KSgpO1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gIGZhY3RvcnkoKGdsb2JhbC50aW1lRm9ybWF0ID0ge30pKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciB6aENuID0ge1xuICAgIGRhdGVUaW1lOiBcIiVhICViICVlICVYICVZXCIsXG4gICAgZGF0ZTogXCIlWS8lLW0vJS1kXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIuS4iuWNiFwiLCBcIuS4i+WNiFwiXSxcbiAgICBkYXlzOiBbXCLmmJ/mnJ/ml6VcIiwgXCLmmJ/mnJ/kuIBcIiwgXCLmmJ/mnJ/kuoxcIiwgXCLmmJ/mnJ/kuIlcIiwgXCLmmJ/mnJ/lm5tcIiwgXCLmmJ/mnJ/kupRcIiwgXCLmmJ/mnJ/lha1cIl0sXG4gICAgc2hvcnREYXlzOiBbXCLmmJ/mnJ/ml6VcIiwgXCLmmJ/mnJ/kuIBcIiwgXCLmmJ/mnJ/kuoxcIiwgXCLmmJ/mnJ/kuIlcIiwgXCLmmJ/mnJ/lm5tcIiwgXCLmmJ/mnJ/kupRcIiwgXCLmmJ/mnJ/lha1cIl0sXG4gICAgbW9udGhzOiBbXCLkuIDmnIhcIiwgXCLkuozmnIhcIiwgXCLkuInmnIhcIiwgXCLlm5vmnIhcIiwgXCLkupTmnIhcIiwgXCLlha3mnIhcIiwgXCLkuIPmnIhcIiwgXCLlhavmnIhcIiwgXCLkuZ3mnIhcIiwgXCLljYHmnIhcIiwgXCLljYHkuIDmnIhcIiwgXCLljYHkuozmnIhcIl0sXG4gICAgc2hvcnRNb250aHM6IFtcIuS4gOaciFwiLCBcIuS6jOaciFwiLCBcIuS4ieaciFwiLCBcIuWbm+aciFwiLCBcIuS6lOaciFwiLCBcIuWFreaciFwiLCBcIuS4g+aciFwiLCBcIuWFq+aciFwiLCBcIuS5neaciFwiLCBcIuWNgeaciFwiLCBcIuWNgeS4gOaciFwiLCBcIuWNgeS6jOaciFwiXVxuICB9O1xuXG4gIHZhciBydVJ1ID0ge1xuICAgIGRhdGVUaW1lOiBcIiVBLCAlZSAlQiAlWSDQsy4gJVhcIixcbiAgICBkYXRlOiBcIiVkLiVtLiVZXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gICAgZGF5czogW1wi0LLQvtGB0LrRgNC10YHQtdC90YzQtVwiLCBcItC/0L7QvdC10LTQtdC70YzQvdC40LpcIiwgXCLQstGC0L7RgNC90LjQulwiLCBcItGB0YDQtdC00LBcIiwgXCLRh9C10YLQstC10YDQs1wiLCBcItC/0Y/RgtC90LjRhtCwXCIsIFwi0YHRg9Cx0LHQvtGC0LBcIl0sXG4gICAgc2hvcnREYXlzOiBbXCLQstGBXCIsIFwi0L/QvVwiLCBcItCy0YJcIiwgXCLRgdGAXCIsIFwi0YfRglwiLCBcItC/0YJcIiwgXCLRgdCxXCJdLFxuICAgIG1vbnRoczogW1wi0Y/QvdCy0LDRgNGPXCIsIFwi0YTQtdCy0YDQsNC70Y9cIiwgXCLQvNCw0YDRgtCwXCIsIFwi0LDQv9GA0LXQu9GPXCIsIFwi0LzQsNGPXCIsIFwi0LjRjtC90Y9cIiwgXCLQuNGO0LvRj1wiLCBcItCw0LLQs9GD0YHRgtCwXCIsIFwi0YHQtdC90YLRj9Cx0YDRj1wiLCBcItC+0LrRgtGP0LHRgNGPXCIsIFwi0L3QvtGP0LHRgNGPXCIsIFwi0LTQtdC60LDQsdGA0Y9cIl0sXG4gICAgc2hvcnRNb250aHM6IFtcItGP0L3QslwiLCBcItGE0LXQslwiLCBcItC80LDRgFwiLCBcItCw0L/RgFwiLCBcItC80LDQuVwiLCBcItC40Y7QvVwiLCBcItC40Y7Qu1wiLCBcItCw0LLQs1wiLCBcItGB0LXQvVwiLCBcItC+0LrRglwiLCBcItC90L7Rj1wiLCBcItC00LXQulwiXVxuICB9O1xuXG4gIHZhciBwdEJyID0ge1xuICAgIGRhdGVUaW1lOiBcIiVBLCAlZSBkZSAlQiBkZSAlWS4gJVhcIixcbiAgICBkYXRlOiBcIiVkLyVtLyVZXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gICAgZGF5czogW1wiRG9taW5nb1wiLCBcIlNlZ3VuZGFcIiwgXCJUZXLDp2FcIiwgXCJRdWFydGFcIiwgXCJRdWludGFcIiwgXCJTZXh0YVwiLCBcIlPDoWJhZG9cIl0sXG4gICAgc2hvcnREYXlzOiBbXCJEb21cIiwgXCJTZWdcIiwgXCJUZXJcIiwgXCJRdWFcIiwgXCJRdWlcIiwgXCJTZXhcIiwgXCJTw6FiXCJdLFxuICAgIG1vbnRoczogW1wiSmFuZWlyb1wiLCBcIkZldmVyZWlyb1wiLCBcIk1hcsOnb1wiLCBcIkFicmlsXCIsIFwiTWFpb1wiLCBcIkp1bmhvXCIsIFwiSnVsaG9cIiwgXCJBZ29zdG9cIiwgXCJTZXRlbWJyb1wiLCBcIk91dHVicm9cIiwgXCJOb3ZlbWJyb1wiLCBcIkRlemVtYnJvXCJdLFxuICAgIHNob3J0TW9udGhzOiBbXCJKYW5cIiwgXCJGZXZcIiwgXCJNYXJcIiwgXCJBYnJcIiwgXCJNYWlcIiwgXCJKdW5cIiwgXCJKdWxcIiwgXCJBZ29cIiwgXCJTZXRcIiwgXCJPdXRcIiwgXCJOb3ZcIiwgXCJEZXpcIl1cbiAgfTtcblxuICB2YXIgcGxQbCA9IHtcbiAgICBkYXRlVGltZTogXCIlQSwgJWUgJUIgJVksICVYXCIsXG4gICAgZGF0ZTogXCIlZC8lbS8lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLCAvLyB1bnVzZWRcbiAgICBkYXlzOiBbXCJOaWVkemllbGFcIiwgXCJQb25pZWR6aWHFgmVrXCIsIFwiV3RvcmVrXCIsIFwixZpyb2RhXCIsIFwiQ3p3YXJ0ZWtcIiwgXCJQacSFdGVrXCIsIFwiU29ib3RhXCJdLFxuICAgIHNob3J0RGF5czogW1wiTmllZHouXCIsIFwiUG9uLlwiLCBcIld0LlwiLCBcIsWaci5cIiwgXCJDencuXCIsIFwiUHQuXCIsIFwiU29iLlwiXSxcbiAgICBtb250aHM6IFtcIlN0eWN6ZcWEXCIsIFwiTHV0eVwiLCBcIk1hcnplY1wiLCBcIkt3aWVjaWXFhFwiLCBcIk1halwiLCBcIkN6ZXJ3aWVjXCIsIFwiTGlwaWVjXCIsIFwiU2llcnBpZcWEXCIsIFwiV3J6ZXNpZcWEXCIsIFwiUGHFumR6aWVybmlrXCIsIFwiTGlzdG9wYWRcIiwgXCJHcnVkemllxYRcIl0sXG4gICAgc2hvcnRNb250aHM6IFtcIlN0eWN6LlwiLCBcIkx1dHlcIiwgXCJNYXJ6LlwiLCBcIkt3aWUuXCIsIFwiTWFqXCIsIFwiQ3plcncuXCIsIFwiTGlwYy5cIiwgXCJTaWVycC5cIiwgXCJXcnouXCIsIFwiUGHFumR6LlwiLCBcIkxpc3RvcC5cIiwgXCJHcnVkei5cIl0vKiBJbiBQb2xpc2ggbGFuZ3VhZ2UgYWJicmF2aWF0ZWQgbW9udGhzIGFyZSBub3QgY29tbW9ubHkgdXNlZCBzbyB0aGVyZSBpcyBhIGRpc3B1dGUgYWJvdXQgdGhlIHByb3BlciBhYmJyYXZpYXRpb25zLiAqL1xuICB9O1xuXG4gIHZhciBubE5sID0ge1xuICAgIGRhdGVUaW1lOiBcIiVhICVlICVCICVZICVUXCIsXG4gICAgZGF0ZTogXCIlZC0lbS0lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLCAvLyB1bnVzZWRcbiAgICBkYXlzOiBbXCJ6b25kYWdcIiwgXCJtYWFuZGFnXCIsIFwiZGluc2RhZ1wiLCBcIndvZW5zZGFnXCIsIFwiZG9uZGVyZGFnXCIsIFwidnJpamRhZ1wiLCBcInphdGVyZGFnXCJdLFxuICAgIHNob3J0RGF5czogW1wiem9cIiwgXCJtYVwiLCBcImRpXCIsIFwid29cIiwgXCJkb1wiLCBcInZyXCIsIFwiemFcIl0sXG4gICAgbW9udGhzOiBbXCJqYW51YXJpXCIsIFwiZmVicnVhcmlcIiwgXCJtYWFydFwiLCBcImFwcmlsXCIsIFwibWVpXCIsIFwianVuaVwiLCBcImp1bGlcIiwgXCJhdWd1c3R1c1wiLCBcInNlcHRlbWJlclwiLCBcIm9rdG9iZXJcIiwgXCJub3ZlbWJlclwiLCBcImRlY2VtYmVyXCJdLFxuICAgIHNob3J0TW9udGhzOiBbXCJqYW5cIiwgXCJmZWJcIiwgXCJtcnRcIiwgXCJhcHJcIiwgXCJtZWlcIiwgXCJqdW5cIiwgXCJqdWxcIiwgXCJhdWdcIiwgXCJzZXBcIiwgXCJva3RcIiwgXCJub3ZcIiwgXCJkZWNcIl1cbiAgfTtcblxuICB2YXIgbWtNayA9IHtcbiAgICBkYXRlVGltZTogXCIlQSwgJWUgJUIgJVkg0LMuICVYXCIsXG4gICAgZGF0ZTogXCIlZC4lbS4lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLFxuICAgIGRheXM6IFtcItC90LXQtNC10LvQsFwiLCBcItC/0L7QvdC10LTQtdC70L3QuNC6XCIsIFwi0LLRgtC+0YDQvdC40LpcIiwgXCLRgdGA0LXQtNCwXCIsIFwi0YfQtdGC0LLRgNGC0L7QulwiLCBcItC/0LXRgtC+0LpcIiwgXCLRgdCw0LHQvtGC0LBcIl0sXG4gICAgc2hvcnREYXlzOiBbXCLQvdC10LRcIiwgXCLQv9C+0L1cIiwgXCLQstGC0L5cIiwgXCLRgdGA0LVcIiwgXCLRh9C10YJcIiwgXCLQv9C10YJcIiwgXCLRgdCw0LFcIl0sXG4gICAgbW9udGhzOiBbXCLRmNCw0L3Rg9Cw0YDQuFwiLCBcItGE0LXQstGA0YPQsNGA0LhcIiwgXCLQvNCw0YDRglwiLCBcItCw0L/RgNC40LtcIiwgXCLQvNCw0ZhcIiwgXCLRmNGD0L3QuFwiLCBcItGY0YPQu9C4XCIsIFwi0LDQstCz0YPRgdGCXCIsIFwi0YHQtdC/0YLQtdC80LLRgNC4XCIsIFwi0L7QutGC0L7QvNCy0YDQuFwiLCBcItC90L7QtdC80LLRgNC4XCIsIFwi0LTQtdC60LXQvNCy0YDQuFwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wi0ZjQsNC9XCIsIFwi0YTQtdCyXCIsIFwi0LzQsNGAXCIsIFwi0LDQv9GAXCIsIFwi0LzQsNGYXCIsIFwi0ZjRg9C9XCIsIFwi0ZjRg9C7XCIsIFwi0LDQstCzXCIsIFwi0YHQtdC/XCIsIFwi0L7QutGCXCIsIFwi0L3QvtC1XCIsIFwi0LTQtdC6XCJdXG4gIH07XG5cbiAgdmFyIGl0SXQgPSB7XG4gICAgZGF0ZVRpbWU6IFwiJUEgJWUgJUIgJVksICVYXCIsXG4gICAgZGF0ZTogXCIlZC8lbS8lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLCAvLyB1bnVzZWRcbiAgICBkYXlzOiBbXCJEb21lbmljYVwiLCBcIkx1bmVkw6xcIiwgXCJNYXJ0ZWTDrFwiLCBcIk1lcmNvbGVkw6xcIiwgXCJHaW92ZWTDrFwiLCBcIlZlbmVyZMOsXCIsIFwiU2FiYXRvXCJdLFxuICAgIHNob3J0RGF5czogW1wiRG9tXCIsIFwiTHVuXCIsIFwiTWFyXCIsIFwiTWVyXCIsIFwiR2lvXCIsIFwiVmVuXCIsIFwiU2FiXCJdLFxuICAgIG1vbnRoczogW1wiR2VubmFpb1wiLCBcIkZlYmJyYWlvXCIsIFwiTWFyem9cIiwgXCJBcHJpbGVcIiwgXCJNYWdnaW9cIiwgXCJHaXVnbm9cIiwgXCJMdWdsaW9cIiwgXCJBZ29zdG9cIiwgXCJTZXR0ZW1icmVcIiwgXCJPdHRvYnJlXCIsIFwiTm92ZW1icmVcIiwgXCJEaWNlbWJyZVwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wiR2VuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWFnXCIsIFwiR2l1XCIsIFwiTHVnXCIsIFwiQWdvXCIsIFwiU2V0XCIsIFwiT3R0XCIsIFwiTm92XCIsIFwiRGljXCJdXG4gIH07XG5cbiAgdmFyIGhlSWwgPSB7XG4gICAgZGF0ZVRpbWU6IFwiJUEsICVlINeRJUIgJVkgJVhcIixcbiAgICBkYXRlOiBcIiVkLiVtLiVZXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gICAgZGF5czogW1wi16jXkNep15XXn1wiLCBcItep16DXmVwiLCBcItep15zXmdep15lcIiwgXCLXqNeR15nXoteZXCIsIFwi15fXnteZ16nXmVwiLCBcItep15nXqdeZXCIsIFwi16nXkdeqXCJdLFxuICAgIHNob3J0RGF5czogW1wi15DXs1wiLCBcIteR17NcIiwgXCLXktezXCIsIFwi15PXs1wiLCBcIteU17NcIiwgXCLXldezXCIsIFwi16nXs1wiXSxcbiAgICBtb250aHM6IFtcIteZ16DXldeQ16hcIiwgXCLXpNeR16jXldeQ16hcIiwgXCLXnteo16VcIiwgXCLXkNek16jXmdecXCIsIFwi157XkNeZXCIsIFwi15nXldeg15lcIiwgXCLXmdeV15zXmVwiLCBcIteQ15XXkteV16HXmFwiLCBcIteh16TXmNee15HXqFwiLCBcIteQ15XXp9eY15XXkdeoXCIsIFwi16DXldeR157XkdeoXCIsIFwi15PXptee15HXqFwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wi15nXoNeV17NcIiwgXCLXpNeR16jXs1wiLCBcItee16jXpVwiLCBcIteQ16TXqNezXCIsIFwi157XkNeZXCIsIFwi15nXldeg15lcIiwgXCLXmdeV15zXmVwiLCBcIteQ15XXktezXCIsIFwi16HXpNeY17NcIiwgXCLXkNeV16fXs1wiLCBcIteg15XXkdezXCIsIFwi15PXptee17NcIl1cbiAgfTtcblxuICB2YXIgZnJGciA9IHtcbiAgICBkYXRlVGltZTogXCIlQSwgbGUgJWUgJUIgJVksICVYXCIsXG4gICAgZGF0ZTogXCIlZC8lbS8lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLCAvLyB1bnVzZWRcbiAgICBkYXlzOiBbXCJkaW1hbmNoZVwiLCBcImx1bmRpXCIsIFwibWFyZGlcIiwgXCJtZXJjcmVkaVwiLCBcImpldWRpXCIsIFwidmVuZHJlZGlcIiwgXCJzYW1lZGlcIl0sXG4gICAgc2hvcnREYXlzOiBbXCJkaW0uXCIsIFwibHVuLlwiLCBcIm1hci5cIiwgXCJtZXIuXCIsIFwiamV1LlwiLCBcInZlbi5cIiwgXCJzYW0uXCJdLFxuICAgIG1vbnRoczogW1wiamFudmllclwiLCBcImbDqXZyaWVyXCIsIFwibWFyc1wiLCBcImF2cmlsXCIsIFwibWFpXCIsIFwianVpblwiLCBcImp1aWxsZXRcIiwgXCJhb8O7dFwiLCBcInNlcHRlbWJyZVwiLCBcIm9jdG9icmVcIiwgXCJub3ZlbWJyZVwiLCBcImTDqWNlbWJyZVwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wiamFudi5cIiwgXCJmw6l2ci5cIiwgXCJtYXJzXCIsIFwiYXZyLlwiLCBcIm1haVwiLCBcImp1aW5cIiwgXCJqdWlsLlwiLCBcImFvw7t0XCIsIFwic2VwdC5cIiwgXCJvY3QuXCIsIFwibm92LlwiLCBcImTDqWMuXCJdXG4gIH07XG5cbiAgdmFyIGZyQ2EgPSB7XG4gICAgZGF0ZVRpbWU6IFwiJWEgJWUgJWIgJVkgJVhcIixcbiAgICBkYXRlOiBcIiVZLSVtLSVkXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIlwiLCBcIlwiXSxcbiAgICBkYXlzOiBbXCJkaW1hbmNoZVwiLCBcImx1bmRpXCIsIFwibWFyZGlcIiwgXCJtZXJjcmVkaVwiLCBcImpldWRpXCIsIFwidmVuZHJlZGlcIiwgXCJzYW1lZGlcIl0sXG4gICAgc2hvcnREYXlzOiBbXCJkaW1cIiwgXCJsdW5cIiwgXCJtYXJcIiwgXCJtZXJcIiwgXCJqZXVcIiwgXCJ2ZW5cIiwgXCJzYW1cIl0sXG4gICAgbW9udGhzOiBbXCJqYW52aWVyXCIsIFwiZsOpdnJpZXJcIiwgXCJtYXJzXCIsIFwiYXZyaWxcIiwgXCJtYWlcIiwgXCJqdWluXCIsIFwianVpbGxldFwiLCBcImFvw7t0XCIsIFwic2VwdGVtYnJlXCIsIFwib2N0b2JyZVwiLCBcIm5vdmVtYnJlXCIsIFwiZMOpY2VtYnJlXCJdLFxuICAgIHNob3J0TW9udGhzOiBbXCJqYW5cIiwgXCJmw6l2XCIsIFwibWFyXCIsIFwiYXZyXCIsIFwibWFpXCIsIFwianVpXCIsIFwianVsXCIsIFwiYW/Du1wiLCBcInNlcFwiLCBcIm9jdFwiLCBcIm5vdlwiLCBcImTDqWNcIl1cbiAgfTtcblxuICB2YXIgZmlGaSA9IHtcbiAgICBkYXRlVGltZTogXCIlQSwgJS1kLiAlQnRhICVZIGtsbyAlWFwiLFxuICAgIGRhdGU6IFwiJS1kLiUtbS4lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJhLm0uXCIsIFwicC5tLlwiXSxcbiAgICBkYXlzOiBbXCJzdW5udW50YWlcIiwgXCJtYWFuYW50YWlcIiwgXCJ0aWlzdGFpXCIsIFwia2Vza2l2aWlra29cIiwgXCJ0b3JzdGFpXCIsIFwicGVyamFudGFpXCIsIFwibGF1YW50YWlcIl0sXG4gICAgc2hvcnREYXlzOiBbXCJTdVwiLCBcIk1hXCIsIFwiVGlcIiwgXCJLZVwiLCBcIlRvXCIsIFwiUGVcIiwgXCJMYVwiXSxcbiAgICBtb250aHM6IFtcInRhbW1pa3V1XCIsIFwiaGVsbWlrdXVcIiwgXCJtYWFsaXNrdXVcIiwgXCJodWh0aWt1dVwiLCBcInRvdWtva3V1XCIsIFwia2Vzw6RrdXVcIiwgXCJoZWluw6RrdXVcIiwgXCJlbG9rdXVcIiwgXCJzeXlza3V1XCIsIFwibG9rYWt1dVwiLCBcIm1hcnJhc2t1dVwiLCBcImpvdWx1a3V1XCJdLFxuICAgIHNob3J0TW9udGhzOiBbXCJUYW1taVwiLCBcIkhlbG1pXCIsIFwiTWFhbGlzXCIsIFwiSHVodGlcIiwgXCJUb3Vrb1wiLCBcIktlc8OkXCIsIFwiSGVpbsOkXCIsIFwiRWxvXCIsIFwiU3l5c1wiLCBcIkxva2FcIiwgXCJNYXJyYXNcIiwgXCJKb3VsdVwiXVxuICB9O1xuXG4gIHZhciBlc0VzID0ge1xuICAgIGRhdGVUaW1lOiBcIiVBLCAlZSBkZSAlQiBkZSAlWSwgJVhcIixcbiAgICBkYXRlOiBcIiVkLyVtLyVZXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gICAgZGF5czogW1wiZG9taW5nb1wiLCBcImx1bmVzXCIsIFwibWFydGVzXCIsIFwibWnDqXJjb2xlc1wiLCBcImp1ZXZlc1wiLCBcInZpZXJuZXNcIiwgXCJzw6FiYWRvXCJdLFxuICAgIHNob3J0RGF5czogW1wiZG9tXCIsIFwibHVuXCIsIFwibWFyXCIsIFwibWnDqVwiLCBcImp1ZVwiLCBcInZpZVwiLCBcInPDoWJcIl0sXG4gICAgbW9udGhzOiBbXCJlbmVyb1wiLCBcImZlYnJlcm9cIiwgXCJtYXJ6b1wiLCBcImFicmlsXCIsIFwibWF5b1wiLCBcImp1bmlvXCIsIFwianVsaW9cIiwgXCJhZ29zdG9cIiwgXCJzZXB0aWVtYnJlXCIsIFwib2N0dWJyZVwiLCBcIm5vdmllbWJyZVwiLCBcImRpY2llbWJyZVwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wiZW5lXCIsIFwiZmViXCIsIFwibWFyXCIsIFwiYWJyXCIsIFwibWF5XCIsIFwianVuXCIsIFwianVsXCIsIFwiYWdvXCIsIFwic2VwXCIsIFwib2N0XCIsIFwibm92XCIsIFwiZGljXCJdXG4gIH07XG5cbiAgdmFyIGVuVXMgPSB7XG4gICAgZGF0ZVRpbWU6IFwiJWEgJWIgJWUgJVggJVlcIixcbiAgICBkYXRlOiBcIiVtLyVkLyVZXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gICAgZGF5czogW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl0sXG4gICAgc2hvcnREYXlzOiBbXCJTdW5cIiwgXCJNb25cIiwgXCJUdWVcIiwgXCJXZWRcIiwgXCJUaHVcIiwgXCJGcmlcIiwgXCJTYXRcIl0sXG4gICAgbW9udGhzOiBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPY3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wiSmFuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWF5XCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCJdXG4gIH07XG5cbiAgdmFyIGVuR2IgPSB7XG4gICAgZGF0ZVRpbWU6IFwiJWEgJWUgJWIgJVggJVlcIixcbiAgICBkYXRlOiBcIiVkLyVtLyVZXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gICAgZGF5czogW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl0sXG4gICAgc2hvcnREYXlzOiBbXCJTdW5cIiwgXCJNb25cIiwgXCJUdWVcIiwgXCJXZWRcIiwgXCJUaHVcIiwgXCJGcmlcIiwgXCJTYXRcIl0sXG4gICAgbW9udGhzOiBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPY3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wiSmFuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWF5XCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCJdXG4gIH07XG5cbiAgdmFyIGVuQ2EgPSB7XG4gICAgZGF0ZVRpbWU6IFwiJWEgJWIgJWUgJVggJVlcIixcbiAgICBkYXRlOiBcIiVZLSVtLSVkXCIsXG4gICAgdGltZTogXCIlSDolTTolU1wiLFxuICAgIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gICAgZGF5czogW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl0sXG4gICAgc2hvcnREYXlzOiBbXCJTdW5cIiwgXCJNb25cIiwgXCJUdWVcIiwgXCJXZWRcIiwgXCJUaHVcIiwgXCJGcmlcIiwgXCJTYXRcIl0sXG4gICAgbW9udGhzOiBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPY3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXSxcbiAgICBzaG9ydE1vbnRoczogW1wiSmFuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWF5XCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCJdXG4gIH07XG5cbiAgdmFyIGRlRGUgPSB7XG4gICAgZGF0ZVRpbWU6IFwiJUEsIGRlciAlZS4gJUIgJVksICVYXCIsXG4gICAgZGF0ZTogXCIlZC4lbS4lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLCAvLyB1bnVzZWRcbiAgICBkYXlzOiBbXCJTb25udGFnXCIsIFwiTW9udGFnXCIsIFwiRGllbnN0YWdcIiwgXCJNaXR0d29jaFwiLCBcIkRvbm5lcnN0YWdcIiwgXCJGcmVpdGFnXCIsIFwiU2Ftc3RhZ1wiXSxcbiAgICBzaG9ydERheXM6IFtcIlNvXCIsIFwiTW9cIiwgXCJEaVwiLCBcIk1pXCIsIFwiRG9cIiwgXCJGclwiLCBcIlNhXCJdLFxuICAgIG1vbnRoczogW1wiSmFudWFyXCIsIFwiRmVicnVhclwiLCBcIk3DpHJ6XCIsIFwiQXByaWxcIiwgXCJNYWlcIiwgXCJKdW5pXCIsIFwiSnVsaVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9rdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlemVtYmVyXCJdLFxuICAgIHNob3J0TW9udGhzOiBbXCJKYW5cIiwgXCJGZWJcIiwgXCJNcnpcIiwgXCJBcHJcIiwgXCJNYWlcIiwgXCJKdW5cIiwgXCJKdWxcIiwgXCJBdWdcIiwgXCJTZXBcIiwgXCJPa3RcIiwgXCJOb3ZcIiwgXCJEZXpcIl1cbiAgfTtcblxuICB2YXIgY2FFcyA9IHtcbiAgICBkYXRlVGltZTogXCIlQSwgJWUgZGUgJUIgZGUgJVksICVYXCIsXG4gICAgZGF0ZTogXCIlZC8lbS8lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLFxuICAgIGRheXM6IFtcImRpdW1lbmdlXCIsIFwiZGlsbHVuc1wiLCBcImRpbWFydHNcIiwgXCJkaW1lY3Jlc1wiLCBcImRpam91c1wiLCBcImRpdmVuZHJlc1wiLCBcImRpc3NhYnRlXCJdLFxuICAgIHNob3J0RGF5czogW1wiZGcuXCIsIFwiZGwuXCIsIFwiZHQuXCIsIFwiZGMuXCIsIFwiZGouXCIsIFwiZHYuXCIsIFwiZHMuXCJdLFxuICAgIG1vbnRoczogW1wiZ2VuZXJcIiwgXCJmZWJyZXJcIiwgXCJtYXLDp1wiLCBcImFicmlsXCIsIFwibWFpZ1wiLCBcImp1bnlcIiwgXCJqdWxpb2xcIiwgXCJhZ29zdFwiLCBcInNldGVtYnJlXCIsIFwib2N0dWJyZVwiLCBcIm5vdmVtYnJlXCIsIFwiZGVzZW1icmVcIl0sXG4gICAgc2hvcnRNb250aHM6IFtcImdlbi5cIiwgXCJmZWJyLlwiLCBcIm1hcsOnXCIsIFwiYWJyLlwiLCBcIm1haWdcIiwgXCJqdW55XCIsIFwianVsLlwiLCBcImFnLlwiLCBcInNldC5cIiwgXCJvY3QuXCIsIFwibm92LlwiLCBcImRlcy5cIl1cbiAgfTtcblxuICB2YXIgdDAgPSBuZXcgRGF0ZTtcbiAgdmFyIHQxID0gbmV3IERhdGU7XG5cbiAgZnVuY3Rpb24gbmV3SW50ZXJ2YWwoZmxvb3JpLCBvZmZzZXRpLCBjb3VudCkge1xuXG4gICAgZnVuY3Rpb24gaW50ZXJ2YWwoZGF0ZSkge1xuICAgICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoK2RhdGUpKSwgZGF0ZTtcbiAgICB9XG5cbiAgICBpbnRlcnZhbC5mbG9vciA9IGludGVydmFsO1xuXG4gICAgaW50ZXJ2YWwucm91bmQgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICB2YXIgZDAgPSBuZXcgRGF0ZSgrZGF0ZSksXG4gICAgICAgICAgZDEgPSBuZXcgRGF0ZShkYXRlIC0gMSk7XG4gICAgICBmbG9vcmkoZDApLCBmbG9vcmkoZDEpLCBvZmZzZXRpKGQxLCAxKTtcbiAgICAgIHJldHVybiBkYXRlIC0gZDAgPCBkMSAtIGRhdGUgPyBkMCA6IGQxO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5jZWlsID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoZGF0ZSAtIDEpKSwgb2Zmc2V0aShkYXRlLCAxKSwgZGF0ZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwub2Zmc2V0ID0gZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgcmV0dXJuIG9mZnNldGkoZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKSwgc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCkpLCBkYXRlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgICB2YXIgcmFuZ2UgPSBbXTtcbiAgICAgIHN0YXJ0ID0gbmV3IERhdGUoc3RhcnQgLSAxKTtcbiAgICAgIHN0b3AgPSBuZXcgRGF0ZSgrc3RvcCk7XG4gICAgICBzdGVwID0gc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCk7XG4gICAgICBpZiAoIShzdGFydCA8IHN0b3ApIHx8ICEoc3RlcCA+IDApKSByZXR1cm4gcmFuZ2U7IC8vIGFsc28gaGFuZGxlcyBJbnZhbGlkIERhdGVcbiAgICAgIG9mZnNldGkoc3RhcnQsIDEpLCBmbG9vcmkoc3RhcnQpO1xuICAgICAgaWYgKHN0YXJ0IDwgc3RvcCkgcmFuZ2UucHVzaChuZXcgRGF0ZSgrc3RhcnQpKTtcbiAgICAgIHdoaWxlIChvZmZzZXRpKHN0YXJ0LCBzdGVwKSwgZmxvb3JpKHN0YXJ0KSwgc3RhcnQgPCBzdG9wKSByYW5nZS5wdXNoKG5ldyBEYXRlKCtzdGFydCkpO1xuICAgICAgcmV0dXJuIHJhbmdlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5maWx0ZXIgPSBmdW5jdGlvbih0ZXN0KSB7XG4gICAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICB3aGlsZSAoZmxvb3JpKGRhdGUpLCAhdGVzdChkYXRlKSkgZGF0ZS5zZXRUaW1lKGRhdGUgLSAxKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgICAgd2hpbGUgKC0tc3RlcCA+PSAwKSB3aGlsZSAob2Zmc2V0aShkYXRlLCAxKSwgIXRlc3QoZGF0ZSkpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmIChjb3VudCkgaW50ZXJ2YWwuY291bnQgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICB0MC5zZXRUaW1lKCtzdGFydCksIHQxLnNldFRpbWUoK2VuZCk7XG4gICAgICBmbG9vcmkodDApLCBmbG9vcmkodDEpO1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoY291bnQodDAsIHQxKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBpbnRlcnZhbDtcbiAgfVxuXG4gIHZhciBkYXkgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCAtIChlbmQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNmU0KSAvIDg2NGU1O1xuICB9KTtcblxuICBmdW5jdGlvbiB3ZWVrZGF5KGkpIHtcbiAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIChkYXRlLmdldERheSgpICsgNyAtIGkpICUgNyk7XG4gICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgc3RlcCAqIDcpO1xuICAgIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiAoZW5kIC0gc3RhcnQgLSAoZW5kLmdldFRpbWV6b25lT2Zmc2V0KCkgLSBzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpKSAqIDZlNCkgLyA2MDQ4ZTU7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgc3VuZGF5ID0gd2Vla2RheSgwKTtcbiAgdmFyIG1vbmRheSA9IHdlZWtkYXkoMSk7XG5cbiAgdmFyIHllYXIgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldE1vbnRoKDAsIDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCk7XG4gIH0pO1xuXG4gIHZhciB1dGNEYXkgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA4NjRlNTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gdXRjV2Vla2RheShpKSB7XG4gICAgcmV0dXJuIG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gICAgICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgLSAoZGF0ZS5nZXRVVENEYXkoKSArIDcgLSBpKSAlIDcpO1xuICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIHN0ZXAgKiA3KTtcbiAgICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDYwNDhlNTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciB1dGNTdW5kYXkgPSB1dGNXZWVrZGF5KDApO1xuICB2YXIgdXRjTW9uZGF5ID0gdXRjV2Vla2RheSgxKTtcblxuICB2YXIgdXRjWWVhciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0VVRDTW9udGgoMCwgMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRVVENGdWxsWWVhcigpIC0gc3RhcnQuZ2V0VVRDRnVsbFllYXIoKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gbG9jYWxEYXRlKGQpIHtcbiAgICBpZiAoMCA8PSBkLnkgJiYgZC55IDwgMTAwKSB7XG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKC0xLCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKTtcbiAgICAgIGRhdGUuc2V0RnVsbFllYXIoZC55KTtcbiAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IERhdGUoZC55LCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHV0Y0RhdGUoZCkge1xuICAgIGlmICgwIDw9IGQueSAmJiBkLnkgPCAxMDApIHtcbiAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMoLTEsIGQubSwgZC5kLCBkLkgsIGQuTSwgZC5TLCBkLkwpKTtcbiAgICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoZC55KTtcbiAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoZC55LCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKSk7XG4gIH1cblxuICBmdW5jdGlvbiBuZXdZZWFyKHkpIHtcbiAgICByZXR1cm4ge3k6IHksIG06IDAsIGQ6IDEsIEg6IDAsIE06IDAsIFM6IDAsIEw6IDB9O1xuICB9XG5cbiAgZnVuY3Rpb24gbG9jYWxlKGxvY2FsZSkge1xuICAgIHZhciBsb2NhbGVfZGF0ZVRpbWUgPSBsb2NhbGUuZGF0ZVRpbWUsXG4gICAgICAgIGxvY2FsZV9kYXRlID0gbG9jYWxlLmRhdGUsXG4gICAgICAgIGxvY2FsZV90aW1lID0gbG9jYWxlLnRpbWUsXG4gICAgICAgIGxvY2FsZV9wZXJpb2RzID0gbG9jYWxlLnBlcmlvZHMsXG4gICAgICAgIGxvY2FsZV93ZWVrZGF5cyA9IGxvY2FsZS5kYXlzLFxuICAgICAgICBsb2NhbGVfc2hvcnRXZWVrZGF5cyA9IGxvY2FsZS5zaG9ydERheXMsXG4gICAgICAgIGxvY2FsZV9tb250aHMgPSBsb2NhbGUubW9udGhzLFxuICAgICAgICBsb2NhbGVfc2hvcnRNb250aHMgPSBsb2NhbGUuc2hvcnRNb250aHM7XG5cbiAgICB2YXIgcGVyaW9kTG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV9wZXJpb2RzKSxcbiAgICAgICAgd2Vla2RheVJlID0gZm9ybWF0UmUobG9jYWxlX3dlZWtkYXlzKSxcbiAgICAgICAgd2Vla2RheUxvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfd2Vla2RheXMpLFxuICAgICAgICBzaG9ydFdlZWtkYXlSZSA9IGZvcm1hdFJlKGxvY2FsZV9zaG9ydFdlZWtkYXlzKSxcbiAgICAgICAgc2hvcnRXZWVrZGF5TG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV9zaG9ydFdlZWtkYXlzKSxcbiAgICAgICAgbW9udGhSZSA9IGZvcm1hdFJlKGxvY2FsZV9tb250aHMpLFxuICAgICAgICBtb250aExvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfbW9udGhzKSxcbiAgICAgICAgc2hvcnRNb250aFJlID0gZm9ybWF0UmUobG9jYWxlX3Nob3J0TW9udGhzKSxcbiAgICAgICAgc2hvcnRNb250aExvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfc2hvcnRNb250aHMpO1xuXG4gICAgdmFyIGZvcm1hdHMgPSB7XG4gICAgICBcImFcIjogZm9ybWF0U2hvcnRXZWVrZGF5LFxuICAgICAgXCJBXCI6IGZvcm1hdFdlZWtkYXksXG4gICAgICBcImJcIjogZm9ybWF0U2hvcnRNb250aCxcbiAgICAgIFwiQlwiOiBmb3JtYXRNb250aCxcbiAgICAgIFwiY1wiOiBudWxsLFxuICAgICAgXCJkXCI6IGZvcm1hdERheU9mTW9udGgsXG4gICAgICBcImVcIjogZm9ybWF0RGF5T2ZNb250aCxcbiAgICAgIFwiSFwiOiBmb3JtYXRIb3VyMjQsXG4gICAgICBcIklcIjogZm9ybWF0SG91cjEyLFxuICAgICAgXCJqXCI6IGZvcm1hdERheU9mWWVhcixcbiAgICAgIFwiTFwiOiBmb3JtYXRNaWxsaXNlY29uZHMsXG4gICAgICBcIm1cIjogZm9ybWF0TW9udGhOdW1iZXIsXG4gICAgICBcIk1cIjogZm9ybWF0TWludXRlcyxcbiAgICAgIFwicFwiOiBmb3JtYXRQZXJpb2QsXG4gICAgICBcIlNcIjogZm9ybWF0U2Vjb25kcyxcbiAgICAgIFwiVVwiOiBmb3JtYXRXZWVrTnVtYmVyU3VuZGF5LFxuICAgICAgXCJ3XCI6IGZvcm1hdFdlZWtkYXlOdW1iZXIsXG4gICAgICBcIldcIjogZm9ybWF0V2Vla051bWJlck1vbmRheSxcbiAgICAgIFwieFwiOiBudWxsLFxuICAgICAgXCJYXCI6IG51bGwsXG4gICAgICBcInlcIjogZm9ybWF0WWVhcixcbiAgICAgIFwiWVwiOiBmb3JtYXRGdWxsWWVhcixcbiAgICAgIFwiWlwiOiBmb3JtYXRab25lLFxuICAgICAgXCIlXCI6IGZvcm1hdExpdGVyYWxQZXJjZW50XG4gICAgfTtcblxuICAgIHZhciB1dGNGb3JtYXRzID0ge1xuICAgICAgXCJhXCI6IGZvcm1hdFVUQ1Nob3J0V2Vla2RheSxcbiAgICAgIFwiQVwiOiBmb3JtYXRVVENXZWVrZGF5LFxuICAgICAgXCJiXCI6IGZvcm1hdFVUQ1Nob3J0TW9udGgsXG4gICAgICBcIkJcIjogZm9ybWF0VVRDTW9udGgsXG4gICAgICBcImNcIjogbnVsbCxcbiAgICAgIFwiZFwiOiBmb3JtYXRVVENEYXlPZk1vbnRoLFxuICAgICAgXCJlXCI6IGZvcm1hdFVUQ0RheU9mTW9udGgsXG4gICAgICBcIkhcIjogZm9ybWF0VVRDSG91cjI0LFxuICAgICAgXCJJXCI6IGZvcm1hdFVUQ0hvdXIxMixcbiAgICAgIFwialwiOiBmb3JtYXRVVENEYXlPZlllYXIsXG4gICAgICBcIkxcIjogZm9ybWF0VVRDTWlsbGlzZWNvbmRzLFxuICAgICAgXCJtXCI6IGZvcm1hdFVUQ01vbnRoTnVtYmVyLFxuICAgICAgXCJNXCI6IGZvcm1hdFVUQ01pbnV0ZXMsXG4gICAgICBcInBcIjogZm9ybWF0VVRDUGVyaW9kLFxuICAgICAgXCJTXCI6IGZvcm1hdFVUQ1NlY29uZHMsXG4gICAgICBcIlVcIjogZm9ybWF0VVRDV2Vla051bWJlclN1bmRheSxcbiAgICAgIFwid1wiOiBmb3JtYXRVVENXZWVrZGF5TnVtYmVyLFxuICAgICAgXCJXXCI6IGZvcm1hdFVUQ1dlZWtOdW1iZXJNb25kYXksXG4gICAgICBcInhcIjogbnVsbCxcbiAgICAgIFwiWFwiOiBudWxsLFxuICAgICAgXCJ5XCI6IGZvcm1hdFVUQ1llYXIsXG4gICAgICBcIllcIjogZm9ybWF0VVRDRnVsbFllYXIsXG4gICAgICBcIlpcIjogZm9ybWF0VVRDWm9uZSxcbiAgICAgIFwiJVwiOiBmb3JtYXRMaXRlcmFsUGVyY2VudFxuICAgIH07XG5cbiAgICB2YXIgcGFyc2VzID0ge1xuICAgICAgXCJhXCI6IHBhcnNlU2hvcnRXZWVrZGF5LFxuICAgICAgXCJBXCI6IHBhcnNlV2Vla2RheSxcbiAgICAgIFwiYlwiOiBwYXJzZVNob3J0TW9udGgsXG4gICAgICBcIkJcIjogcGFyc2VNb250aCxcbiAgICAgIFwiY1wiOiBwYXJzZUxvY2FsZURhdGVUaW1lLFxuICAgICAgXCJkXCI6IHBhcnNlRGF5T2ZNb250aCxcbiAgICAgIFwiZVwiOiBwYXJzZURheU9mTW9udGgsXG4gICAgICBcIkhcIjogcGFyc2VIb3VyMjQsXG4gICAgICBcIklcIjogcGFyc2VIb3VyMjQsXG4gICAgICBcImpcIjogcGFyc2VEYXlPZlllYXIsXG4gICAgICBcIkxcIjogcGFyc2VNaWxsaXNlY29uZHMsXG4gICAgICBcIm1cIjogcGFyc2VNb250aE51bWJlcixcbiAgICAgIFwiTVwiOiBwYXJzZU1pbnV0ZXMsXG4gICAgICBcInBcIjogcGFyc2VQZXJpb2QsXG4gICAgICBcIlNcIjogcGFyc2VTZWNvbmRzLFxuICAgICAgXCJVXCI6IHBhcnNlV2Vla051bWJlclN1bmRheSxcbiAgICAgIFwid1wiOiBwYXJzZVdlZWtkYXlOdW1iZXIsXG4gICAgICBcIldcIjogcGFyc2VXZWVrTnVtYmVyTW9uZGF5LFxuICAgICAgXCJ4XCI6IHBhcnNlTG9jYWxlRGF0ZSxcbiAgICAgIFwiWFwiOiBwYXJzZUxvY2FsZVRpbWUsXG4gICAgICBcInlcIjogcGFyc2VZZWFyLFxuICAgICAgXCJZXCI6IHBhcnNlRnVsbFllYXIsXG4gICAgICBcIlpcIjogcGFyc2Vab25lLFxuICAgICAgXCIlXCI6IHBhcnNlTGl0ZXJhbFBlcmNlbnRcbiAgICB9O1xuXG4gICAgLy8gVGhlc2UgcmVjdXJzaXZlIGRpcmVjdGl2ZSBkZWZpbml0aW9ucyBtdXN0IGJlIGRlZmVycmVkLlxuICAgIGZvcm1hdHMueCA9IG5ld0Zvcm1hdChsb2NhbGVfZGF0ZSwgZm9ybWF0cyk7XG4gICAgZm9ybWF0cy5YID0gbmV3Rm9ybWF0KGxvY2FsZV90aW1lLCBmb3JtYXRzKTtcbiAgICBmb3JtYXRzLmMgPSBuZXdGb3JtYXQobG9jYWxlX2RhdGVUaW1lLCBmb3JtYXRzKTtcbiAgICB1dGNGb3JtYXRzLnggPSBuZXdGb3JtYXQobG9jYWxlX2RhdGUsIHV0Y0Zvcm1hdHMpO1xuICAgIHV0Y0Zvcm1hdHMuWCA9IG5ld0Zvcm1hdChsb2NhbGVfdGltZSwgdXRjRm9ybWF0cyk7XG4gICAgdXRjRm9ybWF0cy5jID0gbmV3Rm9ybWF0KGxvY2FsZV9kYXRlVGltZSwgdXRjRm9ybWF0cyk7XG5cbiAgICBmdW5jdGlvbiBuZXdGb3JtYXQoc3BlY2lmaWVyLCBmb3JtYXRzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICB2YXIgc3RyaW5nID0gW10sXG4gICAgICAgICAgICBpID0gLTEsXG4gICAgICAgICAgICBqID0gMCxcbiAgICAgICAgICAgIG4gPSBzcGVjaWZpZXIubGVuZ3RoLFxuICAgICAgICAgICAgYyxcbiAgICAgICAgICAgIHBhZCxcbiAgICAgICAgICAgIGZvcm1hdDtcblxuICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgIGlmIChzcGVjaWZpZXIuY2hhckNvZGVBdChpKSA9PT0gMzcpIHtcbiAgICAgICAgICAgIHN0cmluZy5wdXNoKHNwZWNpZmllci5zbGljZShqLCBpKSk7XG4gICAgICAgICAgICBpZiAoKHBhZCA9IHBhZHNbYyA9IHNwZWNpZmllci5jaGFyQXQoKytpKV0pICE9IG51bGwpIGMgPSBzcGVjaWZpZXIuY2hhckF0KCsraSk7XG4gICAgICAgICAgICBpZiAoZm9ybWF0ID0gZm9ybWF0c1tjXSkgYyA9IGZvcm1hdChkYXRlLCBwYWQgPT0gbnVsbCA/IChjID09PSBcImVcIiA/IFwiIFwiIDogXCIwXCIpIDogcGFkKTtcbiAgICAgICAgICAgIHN0cmluZy5wdXNoKGMpO1xuICAgICAgICAgICAgaiA9IGkgKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0cmluZy5wdXNoKHNwZWNpZmllci5zbGljZShqLCBpKSk7XG4gICAgICAgIHJldHVybiBzdHJpbmcuam9pbihcIlwiKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV3UGFyc2Uoc3BlY2lmaWVyLCBuZXdEYXRlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICAgIHZhciBkID0gbmV3WWVhcigxOTAwKSxcbiAgICAgICAgICAgIGkgPSBwYXJzZVNwZWNpZmllcihkLCBzcGVjaWZpZXIsIHN0cmluZywgMCk7XG4gICAgICAgIGlmIChpICE9IHN0cmluZy5sZW5ndGgpIHJldHVybiBudWxsO1xuXG4gICAgICAgIC8vIFRoZSBhbS1wbSBmbGFnIGlzIDAgZm9yIEFNLCBhbmQgMSBmb3IgUE0uXG4gICAgICAgIGlmIChcInBcIiBpbiBkKSBkLkggPSBkLkggJSAxMiArIGQucCAqIDEyO1xuXG4gICAgICAgIC8vIElmIGEgdGltZSB6b25lIGlzIHNwZWNpZmllZCwgYWxsIGZpZWxkcyBhcmUgaW50ZXJwcmV0ZWQgYXMgVVRDIGFuZCB0aGVuXG4gICAgICAgIC8vIG9mZnNldCBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmllZCB0aW1lIHpvbmUuXG4gICAgICAgIGlmIChcIlpcIiBpbiBkKSB7XG4gICAgICAgICAgaWYgKFwid1wiIGluIGQgJiYgKFwiV1wiIGluIGQgfHwgXCJVXCIgaW4gZCkpIHtcbiAgICAgICAgICAgIHZhciBkYXkgPSB1dGNEYXRlKG5ld1llYXIoZC55KSkuZ2V0VVRDRGF5KCk7XG4gICAgICAgICAgICBpZiAoXCJXXCIgaW4gZCkgZC5VID0gZC5XLCBkLncgPSAoZC53ICsgNikgJSA3LCAtLWRheTtcbiAgICAgICAgICAgIGQubSA9IDA7XG4gICAgICAgICAgICBkLmQgPSBkLncgKyBkLlUgKiA3IC0gKGRheSArIDYpICUgNztcbiAgICAgICAgICB9XG4gICAgICAgICAgZC5IICs9IGQuWiAvIDEwMCB8IDA7XG4gICAgICAgICAgZC5NICs9IGQuWiAlIDEwMDtcbiAgICAgICAgICByZXR1cm4gdXRjRGF0ZShkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgYWxsIGZpZWxkcyBhcmUgaW4gbG9jYWwgdGltZS5cbiAgICAgICAgaWYgKFwid1wiIGluIGQgJiYgKFwiV1wiIGluIGQgfHwgXCJVXCIgaW4gZCkpIHtcbiAgICAgICAgICB2YXIgZGF5ID0gbmV3RGF0ZShuZXdZZWFyKGQueSkpLmdldERheSgpO1xuICAgICAgICAgIGlmIChcIldcIiBpbiBkKSBkLlUgPSBkLlcsIGQudyA9IChkLncgKyA2KSAlIDcsIC0tZGF5O1xuICAgICAgICAgIGQubSA9IDA7XG4gICAgICAgICAgZC5kID0gZC53ICsgZC5VICogNyAtIChkYXkgKyA2KSAlIDc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RhdGUoZCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlU3BlY2lmaWVyKGQsIHNwZWNpZmllciwgc3RyaW5nLCBqKSB7XG4gICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgbiA9IHNwZWNpZmllci5sZW5ndGgsXG4gICAgICAgICAgbSA9IHN0cmluZy5sZW5ndGgsXG4gICAgICAgICAgYyxcbiAgICAgICAgICBwYXJzZTtcblxuICAgICAgd2hpbGUgKGkgPCBuKSB7XG4gICAgICAgIGlmIChqID49IG0pIHJldHVybiAtMTtcbiAgICAgICAgYyA9IHNwZWNpZmllci5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgIGlmIChjID09PSAzNykge1xuICAgICAgICAgIGMgPSBzcGVjaWZpZXIuY2hhckF0KGkrKyk7XG4gICAgICAgICAgcGFyc2UgPSBwYXJzZXNbYyBpbiBwYWRzID8gc3BlY2lmaWVyLmNoYXJBdChpKyspIDogY107XG4gICAgICAgICAgaWYgKCFwYXJzZSB8fCAoKGogPSBwYXJzZShkLCBzdHJpbmcsIGopKSA8IDApKSByZXR1cm4gLTE7XG4gICAgICAgIH0gZWxzZSBpZiAoYyAhPSBzdHJpbmcuY2hhckNvZGVBdChqKyspKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBqO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlU2hvcnRXZWVrZGF5KGQsIHN0cmluZywgaSkge1xuICAgICAgdmFyIG4gPSBzaG9ydFdlZWtkYXlSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgICByZXR1cm4gbiA/IChkLncgPSBzaG9ydFdlZWtkYXlMb29rdXAuZ2V0KG5bMF0udG9Mb3dlckNhc2UoKSksIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVdlZWtkYXkoZCwgc3RyaW5nLCBpKSB7XG4gICAgICB2YXIgbiA9IHdlZWtkYXlSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgICByZXR1cm4gbiA/IChkLncgPSB3ZWVrZGF5TG9va3VwLmdldChuWzBdLnRvTG93ZXJDYXNlKCkpLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VTaG9ydE1vbnRoKGQsIHN0cmluZywgaSkge1xuICAgICAgdmFyIG4gPSBzaG9ydE1vbnRoUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgICAgcmV0dXJuIG4gPyAoZC5tID0gc2hvcnRNb250aExvb2t1cC5nZXQoblswXS50b0xvd2VyQ2FzZSgpKSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTW9udGgoZCwgc3RyaW5nLCBpKSB7XG4gICAgICB2YXIgbiA9IG1vbnRoUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgICAgcmV0dXJuIG4gPyAoZC5tID0gbW9udGhMb29rdXAuZ2V0KG5bMF0udG9Mb3dlckNhc2UoKSksIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZUxvY2FsZURhdGVUaW1lKGQsIHN0cmluZywgaSkge1xuICAgICAgcmV0dXJuIHBhcnNlU3BlY2lmaWVyKGQsIGxvY2FsZV9kYXRlVGltZSwgc3RyaW5nLCBpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZUxvY2FsZURhdGUoZCwgc3RyaW5nLCBpKSB7XG4gICAgICByZXR1cm4gcGFyc2VTcGVjaWZpZXIoZCwgbG9jYWxlX2RhdGUsIHN0cmluZywgaSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VMb2NhbGVUaW1lKGQsIHN0cmluZywgaSkge1xuICAgICAgcmV0dXJuIHBhcnNlU3BlY2lmaWVyKGQsIGxvY2FsZV90aW1lLCBzdHJpbmcsIGkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlUGVyaW9kKGQsIHN0cmluZywgaSkge1xuICAgICAgdmFyIG4gPSBwZXJpb2RMb29rdXAuZ2V0KHN0cmluZy5zbGljZShpLCBpICs9IDIpLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgcmV0dXJuIG4gPT0gbnVsbCA/IC0xIDogKGQucCA9IG4sIGkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFNob3J0V2Vla2RheShkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX3Nob3J0V2Vla2RheXNbZC5nZXREYXkoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0V2Vla2RheShkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX3dlZWtkYXlzW2QuZ2V0RGF5KCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFNob3J0TW9udGgoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV9zaG9ydE1vbnRoc1tkLmdldE1vbnRoKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdE1vbnRoKGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfbW9udGhzW2QuZ2V0TW9udGgoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0UGVyaW9kKGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfcGVyaW9kc1srKGQuZ2V0SG91cnMoKSA+PSAxMildO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFVUQ1Nob3J0V2Vla2RheShkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX3Nob3J0V2Vla2RheXNbZC5nZXRVVENEYXkoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VVRDV2Vla2RheShkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX3dlZWtkYXlzW2QuZ2V0VVRDRGF5KCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFVUQ1Nob3J0TW9udGgoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV9zaG9ydE1vbnRoc1tkLmdldFVUQ01vbnRoKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFVUQ01vbnRoKGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfbW9udGhzW2QuZ2V0VVRDTW9udGgoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VVRDUGVyaW9kKGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfcGVyaW9kc1srKGQuZ2V0VVRDSG91cnMoKSA+PSAxMildO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBmb3JtYXQ6IGZ1bmN0aW9uKHNwZWNpZmllcikge1xuICAgICAgICB2YXIgZiA9IG5ld0Zvcm1hdChzcGVjaWZpZXIgKz0gXCJcIiwgZm9ybWF0cyk7XG4gICAgICAgIGYucGFyc2UgPSBuZXdQYXJzZShzcGVjaWZpZXIsIGxvY2FsRGF0ZSk7XG4gICAgICAgIGYudG9TdHJpbmcgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHNwZWNpZmllcjsgfTtcbiAgICAgICAgcmV0dXJuIGY7XG4gICAgICB9LFxuICAgICAgdXRjRm9ybWF0OiBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgICAgICAgdmFyIGYgPSBuZXdGb3JtYXQoc3BlY2lmaWVyICs9IFwiXCIsIHV0Y0Zvcm1hdHMpO1xuICAgICAgICBmLnBhcnNlID0gbmV3UGFyc2Uoc3BlY2lmaWVyLCB1dGNEYXRlKTtcbiAgICAgICAgZi50b1N0cmluZyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gc3BlY2lmaWVyOyB9O1xuICAgICAgICByZXR1cm4gZjtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgdmFyIHBhZHMgPSB7XCItXCI6IFwiXCIsIFwiX1wiOiBcIiBcIiwgXCIwXCI6IFwiMFwifTtcbiAgdmFyIG51bWJlclJlID0gL15cXHMqXFxkKy87XG4gIHZhciBwZXJjZW50UmUgPSAvXiUvO1xuICB2YXIgcmVxdW90ZVJlID0gL1tcXFxcXFxeXFwkXFwqXFwrXFw/XFx8XFxbXFxdXFwoXFwpXFwuXFx7XFx9XS9nO1xuXG4gIGZ1bmN0aW9uIHBhZCh2YWx1ZSwgZmlsbCwgd2lkdGgpIHtcbiAgICB2YXIgc2lnbiA9IHZhbHVlIDwgMCA/IFwiLVwiIDogXCJcIixcbiAgICAgICAgc3RyaW5nID0gKHNpZ24gPyAtdmFsdWUgOiB2YWx1ZSkgKyBcIlwiLFxuICAgICAgICBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHJldHVybiBzaWduICsgKGxlbmd0aCA8IHdpZHRoID8gbmV3IEFycmF5KHdpZHRoIC0gbGVuZ3RoICsgMSkuam9pbihmaWxsKSArIHN0cmluZyA6IHN0cmluZyk7XG4gIH1cblxuICBmdW5jdGlvbiByZXF1b3RlKHMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKHJlcXVvdGVSZSwgXCJcXFxcJCZcIik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRSZShuYW1lcykge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKFwiXig/OlwiICsgbmFtZXMubWFwKHJlcXVvdGUpLmpvaW4oXCJ8XCIpICsgXCIpXCIsIFwiaVwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdExvb2t1cChuYW1lcykge1xuICAgIHZhciBtYXAgPSBuZXcgTWFwLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIG1hcC5zZXQobmFtZXNbaV0udG9Mb3dlckNhc2UoKSwgaSk7XG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlV2Vla2RheU51bWJlcihkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAxKSk7XG4gICAgcmV0dXJuIG4gPyAoZC53ID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlV2Vla051bWJlclN1bmRheShkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICByZXR1cm4gbiA/IChkLlUgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VXZWVrTnVtYmVyTW9uZGF5KGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgIHJldHVybiBuID8gKGQuVyA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUZ1bGxZZWFyKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDQpKTtcbiAgICByZXR1cm4gbiA/IChkLnkgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VZZWFyKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgICByZXR1cm4gbiA/IChkLnkgPSArblswXSArICgrblswXSA+IDY4ID8gMTkwMCA6IDIwMDApLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVpvbmUoZCwgc3RyaW5nLCBpKSB7XG4gICAgcmV0dXJuIC9eWystXVxcZHs0fSQvLnRlc3Qoc3RyaW5nID0gc3RyaW5nLnNsaWNlKGksIGkgKyA1KSlcbiAgICAgICAgPyAoZC5aID0gLXN0cmluZywgaSArIDUpIC8vIHNpZ24gZGlmZmVycyBmcm9tIGdldFRpbWV6b25lT2Zmc2V0IVxuICAgICAgICA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VNb250aE51bWJlcihkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5tID0gblswXSAtIDEsIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlRGF5T2ZNb250aChkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5kID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlRGF5T2ZZZWFyKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDMpKTtcbiAgICByZXR1cm4gbiA/IChkLm0gPSAwLCBkLmQgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VIb3VyMjQoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICAgIHJldHVybiBuID8gKGQuSCA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZU1pbnV0ZXMoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICAgIHJldHVybiBuID8gKGQuTSA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVNlY29uZHMoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICAgIHJldHVybiBuID8gKGQuUyA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZU1pbGxpc2Vjb25kcyhkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAzKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5MID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlTGl0ZXJhbFBlcmNlbnQoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBwZXJjZW50UmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDEpKTtcbiAgICByZXR1cm4gbiA/IGkgKyBuWzBdLmxlbmd0aCA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0RGF5T2ZNb250aChkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldERhdGUoKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRIb3VyMjQoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRIb3VycygpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdEhvdXIxMihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldEhvdXJzKCkgJSAxMiB8fCAxMiwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXREYXlPZlllYXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoMSArIGRheS5jb3VudCh5ZWFyKGQpLCBkKSwgcCwgMyk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRNaWxsaXNlY29uZHMoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRNaWxsaXNlY29uZHMoKSwgcCwgMyk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRNb250aE51bWJlcihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldE1vbnRoKCkgKyAxLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdE1pbnV0ZXMoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRNaW51dGVzKCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0U2Vjb25kcyhkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldFNlY29uZHMoKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRXZWVrTnVtYmVyU3VuZGF5KGQsIHApIHtcbiAgICByZXR1cm4gcGFkKHN1bmRheS5jb3VudCh5ZWFyKGQpLCBkKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRXZWVrZGF5TnVtYmVyKGQpIHtcbiAgICByZXR1cm4gZC5nZXREYXkoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFdlZWtOdW1iZXJNb25kYXkoZCwgcCkge1xuICAgIHJldHVybiBwYWQobW9uZGF5LmNvdW50KHllYXIoZCksIGQpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFllYXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRGdWxsWWVhcigpICUgMTAwLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdEZ1bGxZZWFyKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0RnVsbFllYXIoKSAlIDEwMDAwLCBwLCA0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFpvbmUoZCkge1xuICAgIHZhciB6ID0gZC5nZXRUaW1lem9uZU9mZnNldCgpO1xuICAgIHJldHVybiAoeiA+IDAgPyBcIi1cIiA6ICh6ICo9IC0xLCBcIitcIikpXG4gICAgICAgICsgcGFkKHogLyA2MCB8IDAsIFwiMFwiLCAyKVxuICAgICAgICArIHBhZCh6ICUgNjAsIFwiMFwiLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ0RheU9mTW9udGgoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENEYXRlKCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDSG91cjI0KGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0VVRDSG91cnMoKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENIb3VyMTIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENIb3VycygpICUgMTIgfHwgMTIsIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDRGF5T2ZZZWFyKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKDEgKyB1dGNEYXkuY291bnQodXRjWWVhcihkKSwgZCksIHAsIDMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDTWlsbGlzZWNvbmRzKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0VVRDTWlsbGlzZWNvbmRzKCksIHAsIDMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDTW9udGhOdW1iZXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENNb250aCgpICsgMSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENNaW51dGVzKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0VVRDTWludXRlcygpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ1NlY29uZHMoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENTZWNvbmRzKCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDV2Vla051bWJlclN1bmRheShkLCBwKSB7XG4gICAgcmV0dXJuIHBhZCh1dGNTdW5kYXkuY291bnQodXRjWWVhcihkKSwgZCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDV2Vla2RheU51bWJlcihkKSB7XG4gICAgcmV0dXJuIGQuZ2V0VVRDRGF5KCk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENXZWVrTnVtYmVyTW9uZGF5KGQsIHApIHtcbiAgICByZXR1cm4gcGFkKHV0Y01vbmRheS5jb3VudCh1dGNZZWFyKGQpLCBkKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENZZWFyKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0VVRDRnVsbFllYXIoKSAlIDEwMCwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENGdWxsWWVhcihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldFVUQ0Z1bGxZZWFyKCkgJSAxMDAwMCwgcCwgNCk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENab25lKCkge1xuICAgIHJldHVybiBcIiswMDAwXCI7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRMaXRlcmFsUGVyY2VudCgpIHtcbiAgICByZXR1cm4gXCIlXCI7XG4gIH1cblxuICB2YXIgaXNvU3BlY2lmaWVyID0gXCIlWS0lbS0lZFQlSDolTTolUy4lTFpcIjtcblxuICBmdW5jdGlvbiBmb3JtYXRJc29OYXRpdmUoZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCk7XG4gIH1cblxuICBmb3JtYXRJc29OYXRpdmUucGFyc2UgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHN0cmluZyk7XG4gICAgcmV0dXJuIGlzTmFOKGRhdGUpID8gbnVsbCA6IGRhdGU7XG4gIH07XG5cbiAgZm9ybWF0SXNvTmF0aXZlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGlzb1NwZWNpZmllcjtcbiAgfTtcblxuICB2YXIgZm9ybWF0SXNvID0gRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcgJiYgK25ldyBEYXRlKFwiMjAwMC0wMS0wMVQwMDowMDowMC4wMDBaXCIpXG4gICAgICA/IGZvcm1hdElzb05hdGl2ZVxuICAgICAgOiBlblVzLnV0Y0Zvcm1hdChpc29TcGVjaWZpZXIpO1xuXG4gIHZhciBpc29Gb3JtYXQgPSBmb3JtYXRJc287XG5cbiAgdmFyIGxvY2FsZURlZmluaXRpb25zID0gKG5ldyBNYXApXG4gICAgICAuc2V0KFwiY2EtRVNcIiwgY2FFcylcbiAgICAgIC5zZXQoXCJkZS1ERVwiLCBkZURlKVxuICAgICAgLnNldChcImVuLUNBXCIsIGVuQ2EpXG4gICAgICAuc2V0KFwiZW4tR0JcIiwgZW5HYilcbiAgICAgIC5zZXQoXCJlbi1VU1wiLCBlblVzKVxuICAgICAgLnNldChcImVzLUVTXCIsIGVzRXMpXG4gICAgICAuc2V0KFwiZmktRklcIiwgZmlGaSlcbiAgICAgIC5zZXQoXCJmci1DQVwiLCBmckNhKVxuICAgICAgLnNldChcImZyLUZSXCIsIGZyRnIpXG4gICAgICAuc2V0KFwiaGUtSUxcIiwgaGVJbClcbiAgICAgIC5zZXQoXCJpdC1JVFwiLCBpdEl0KVxuICAgICAgLnNldChcIm1rLU1LXCIsIG1rTWspXG4gICAgICAuc2V0KFwibmwtTkxcIiwgbmxObClcbiAgICAgIC5zZXQoXCJwbC1QTFwiLCBwbFBsKVxuICAgICAgLnNldChcInB0LUJSXCIsIHB0QnIpXG4gICAgICAuc2V0KFwicnUtUlVcIiwgcnVSdSlcbiAgICAgIC5zZXQoXCJ6aC1DTlwiLCB6aENuKTtcblxuICB2YXIgZGVmYXVsdExvY2FsZSA9IGxvY2FsZShlblVzKTtcbiAgZXhwb3J0cy5mb3JtYXQgPSBkZWZhdWx0TG9jYWxlLmZvcm1hdDtcbiAgZXhwb3J0cy51dGNGb3JtYXQgPSBkZWZhdWx0TG9jYWxlLnV0Y0Zvcm1hdDtcblxuICBmdW5jdGlvbiBsb2NhbGVGb3JtYXQoZGVmaW5pdGlvbikge1xuICAgIGlmICh0eXBlb2YgZGVmaW5pdGlvbiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgZGVmaW5pdGlvbiA9IGxvY2FsZURlZmluaXRpb25zLmdldChkZWZpbml0aW9uKTtcbiAgICAgIGlmICghZGVmaW5pdGlvbikgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBsb2NhbGUoZGVmaW5pdGlvbik7XG4gIH1cbiAgO1xuXG4gIGV4cG9ydHMubG9jYWxlRm9ybWF0ID0gbG9jYWxlRm9ybWF0O1xuICBleHBvcnRzLmlzb0Zvcm1hdCA9IGlzb0Zvcm1hdDtcblxufSkpOyIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9nbG9iYWxzJyk7XG5cbnZhciBjb25zdHMgPSByZXF1aXJlKCcuL2NvbnN0cycpLFxuICB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gIHZsZmllbGQgPSByZXF1aXJlKCcuL2ZpZWxkJyksXG4gIHZsZW5jID0gcmVxdWlyZSgnLi9lbmMnKSxcbiAgc2NoZW1hID0gcmVxdWlyZSgnLi9zY2hlbWEvc2NoZW1hJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBFbmNvZGluZyhzcGVjLCB0aGVtZSkge1xuICAgIHZhciBkZWZhdWx0cyA9IHNjaGVtYS5pbnN0YW50aWF0ZSgpLFxuICAgICAgc3BlY0V4dGVuZGVkID0gc2NoZW1hLnV0aWwubWVyZ2UoZGVmYXVsdHMsIHRoZW1lIHx8IHt9LCBzcGVjKSA7XG5cbiAgICB0aGlzLl9kYXRhID0gc3BlY0V4dGVuZGVkLmRhdGE7XG4gICAgdGhpcy5fbWFya3R5cGUgPSBzcGVjRXh0ZW5kZWQubWFya3R5cGU7XG4gICAgdGhpcy5fZW5jID0gc3BlY0V4dGVuZGVkLmVuY29kaW5nO1xuICAgIHRoaXMuX2NvbmZpZyA9IHNwZWNFeHRlbmRlZC5jb25maWc7XG4gICAgdGhpcy5fZmlsdGVyID0gc3BlY0V4dGVuZGVkLmZpbHRlcjtcbiAgICAvLyB0aGlzLl92ZWdhMiA9IHRydWU7XG4gIH1cblxuICB2YXIgcHJvdG8gPSBFbmNvZGluZy5wcm90b3R5cGU7XG5cbiAgRW5jb2RpbmcuZnJvbVNob3J0aGFuZCA9IGZ1bmN0aW9uKHNob3J0aGFuZCwgZGF0YSwgY29uZmlnLCB0aGVtZSkge1xuICAgIHZhciBjID0gY29uc3RzLnNob3J0aGFuZCxcbiAgICAgICAgc3BsaXQgPSBzaG9ydGhhbmQuc3BsaXQoYy5kZWxpbSksXG4gICAgICAgIG1hcmt0eXBlID0gc3BsaXQuc2hpZnQoKS5zcGxpdChjLmFzc2lnbilbMV0udHJpbSgpLFxuICAgICAgICBlbmMgPSB2bGVuYy5mcm9tU2hvcnRoYW5kKHNwbGl0KTtcblxuICAgIHJldHVybiBuZXcgRW5jb2Rpbmcoe1xuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIG1hcmt0eXBlOiBtYXJrdHlwZSxcbiAgICAgIGVuY29kaW5nOiBlbmMsXG4gICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgIGZpbHRlcjogW11cbiAgICB9LCB0aGVtZSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuZnJvbVNwZWMgPSBmdW5jdGlvbihzcGVjLCB0aGVtZSkge1xuICAgIHJldHVybiBuZXcgRW5jb2Rpbmcoc3BlYywgdGhlbWUpO1xuICB9O1xuXG4gIHByb3RvLnRvU2hvcnRoYW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGMgPSBjb25zdHMuc2hvcnRoYW5kO1xuICAgIHJldHVybiAnbWFyaycgKyBjLmFzc2lnbiArIHRoaXMuX21hcmt0eXBlICtcbiAgICAgIGMuZGVsaW0gKyB2bGVuYy5zaG9ydGhhbmQodGhpcy5fZW5jKTtcbiAgfTtcblxuICBFbmNvZGluZy5zaG9ydGhhbmQgPSBmdW5jdGlvbiAoc3BlYykge1xuICAgIHZhciBjID0gY29uc3RzLnNob3J0aGFuZDtcbiAgICByZXR1cm4gJ21hcmsnICsgYy5hc3NpZ24gKyBzcGVjLm1hcmt0eXBlICtcbiAgICAgIGMuZGVsaW0gKyB2bGVuYy5zaG9ydGhhbmQoc3BlYy5lbmNvZGluZyk7XG4gIH07XG5cbiAgRW5jb2Rpbmcuc3BlY0Zyb21TaG9ydGhhbmQgPSBmdW5jdGlvbihzaG9ydGhhbmQsIGRhdGEsIGNvbmZpZywgZXhjbHVkZUNvbmZpZykge1xuICAgIHJldHVybiBFbmNvZGluZy5mcm9tU2hvcnRoYW5kKHNob3J0aGFuZCwgZGF0YSwgY29uZmlnKS50b1NwZWMoZXhjbHVkZUNvbmZpZyk7XG4gIH07XG5cbiAgcHJvdG8udG9TcGVjID0gZnVuY3Rpb24oZXhjbHVkZUNvbmZpZywgZXhjbHVkZURhdGEpIHtcbiAgICB2YXIgZW5jID0gdXRpbC5kdXBsaWNhdGUodGhpcy5fZW5jKSxcbiAgICAgIHNwZWM7XG5cbiAgICBzcGVjID0ge1xuICAgICAgbWFya3R5cGU6IHRoaXMuX21hcmt0eXBlLFxuICAgICAgZW5jb2Rpbmc6IGVuYyxcbiAgICAgIGZpbHRlcjogdGhpcy5fZmlsdGVyXG4gICAgfTtcblxuICAgIGlmICghZXhjbHVkZUNvbmZpZykge1xuICAgICAgc3BlYy5jb25maWcgPSB1dGlsLmR1cGxpY2F0ZSh0aGlzLl9jb25maWcpO1xuICAgIH1cblxuICAgIGlmICghZXhjbHVkZURhdGEpIHtcbiAgICAgIHNwZWMuZGF0YSA9IHV0aWwuZHVwbGljYXRlKHRoaXMuX2RhdGEpO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBkZWZhdWx0c1xuICAgIHZhciBkZWZhdWx0cyA9IHNjaGVtYS5pbnN0YW50aWF0ZSgpO1xuICAgIHJldHVybiBzY2hlbWEudXRpbC5zdWJ0cmFjdChzcGVjLCBkZWZhdWx0cyk7XG4gIH07XG5cblxuICBwcm90by5tYXJrdHlwZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXJrdHlwZTtcbiAgfTtcblxuICBwcm90by5pcyA9IGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gdGhpcy5fbWFya3R5cGUgPT09IG07XG4gIH07XG5cbiAgcHJvdG8uaGFzID0gZnVuY3Rpb24oZW5jVHlwZSkge1xuICAgIC8vIGVxdWl2YWxlbnQgdG8gY2FsbGluZyB2bGVuYy5oYXModGhpcy5fZW5jLCBlbmNUeXBlKVxuICAgIHJldHVybiB0aGlzLl9lbmNbZW5jVHlwZV0ubmFtZSAhPT0gdW5kZWZpbmVkO1xuICB9O1xuXG4gIHByb3RvLmZpZWxkID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XTtcbiAgfTtcblxuICBwcm90by5maWx0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZmlsdGVyTnVsbCA9IFtdLFxuICAgICAgZmllbGRzID0gdGhpcy5maWVsZHMoKSxcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgdXRpbC5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZmllbGRMaXN0LCBmaWVsZE5hbWUpIHtcbiAgICAgIGlmIChmaWVsZE5hbWUgPT09ICcqJykgcmV0dXJuOyAvL2NvdW50XG5cbiAgICAgIGlmICgoc2VsZi5jb25maWcoJ2ZpbHRlck51bGwnKS5RICYmIGZpZWxkTGlzdC5jb250YWluc1R5cGVbUV0pIHx8XG4gICAgICAgICAgKHNlbGYuY29uZmlnKCdmaWx0ZXJOdWxsJykuVCAmJiBmaWVsZExpc3QuY29udGFpbnNUeXBlW1RdKSB8fFxuICAgICAgICAgIChzZWxmLmNvbmZpZygnZmlsdGVyTnVsbCcpLk8gJiYgZmllbGRMaXN0LmNvbnRhaW5zVHlwZVtPXSkgfHxcbiAgICAgICAgICAoc2VsZi5jb25maWcoJ2ZpbHRlck51bGwnKS5OICYmIGZpZWxkTGlzdC5jb250YWluc1R5cGVbTl0pKSB7XG4gICAgICAgIGZpbHRlck51bGwucHVzaCh7XG4gICAgICAgICAgb3BlcmFuZHM6IFtmaWVsZE5hbWVdLFxuICAgICAgICAgIG9wZXJhdG9yOiAnbm90TnVsbCdcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmlsdGVyTnVsbC5jb25jYXQodGhpcy5fZmlsdGVyKTtcbiAgfTtcblxuICAvLyBnZXQgXCJmaWVsZFwiIHJlZmVyZW5jZSBmb3IgdmVnYVxuICBwcm90by5maWVsZFJlZiA9IGZ1bmN0aW9uKGV0LCBvcHQpIHtcbiAgICBvcHQgPSBvcHQgfHwge307XG4gICAgb3B0LmRhdGEgPSAhdGhpcy5fdmVnYTIgJiYgKG9wdC5kYXRhICE9PSBmYWxzZSk7XG4gICAgcmV0dXJuIHZsZmllbGQuZmllbGRSZWYodGhpcy5fZW5jW2V0XSwgb3B0KTtcbiAgfTtcblxuICBwcm90by5maWVsZE5hbWUgPSBmdW5jdGlvbihldCkge1xuICAgIHJldHVybiB0aGlzLl9lbmNbZXRdLm5hbWU7XG4gIH07XG5cbiAgLypcbiAgICogcmV0dXJuIGtleS12YWx1ZSBwYWlycyBvZiBmaWVsZCBuYW1lIGFuZCBsaXN0IG9mIGZpZWxkcyBvZiB0aGF0IGZpZWxkIG5hbWVcbiAgICovXG4gIHByb3RvLmZpZWxkcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2bGVuYy5maWVsZHModGhpcy5fZW5jKTtcbiAgfTtcblxuICBwcm90by5maWVsZFRpdGxlID0gZnVuY3Rpb24oZXQpIHtcbiAgICBpZiAodmxmaWVsZC5pc0NvdW50KHRoaXMuX2VuY1tldF0pKSB7XG4gICAgICByZXR1cm4gdmxmaWVsZC5jb3VudC5kaXNwbGF5TmFtZTtcbiAgICB9XG4gICAgdmFyIGZuID0gdGhpcy5fZW5jW2V0XS5hZ2dyZWdhdGUgfHwgdGhpcy5fZW5jW2V0XS50aW1lVW5pdCB8fCAodGhpcy5fZW5jW2V0XS5iaW4gJiYgJ2JpbicpO1xuICAgIGlmIChmbikge1xuICAgICAgdmFyIHVwcGVyY2FzZSA9IGZuID09PSAnYXZnJyA/ICdNRUFOJyA6Zm4udG9VcHBlckNhc2UoKTtcbiAgICAgIHJldHVybiB1cHBlcmNhc2UgKyAnKCcgKyB0aGlzLl9lbmNbZXRdLm5hbWUgKyAnKSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9lbmNbZXRdLm5hbWU7XG4gICAgfVxuICB9O1xuXG4gIHByb3RvLnNjYWxlID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5zY2FsZSB8fCB7fTtcbiAgfTtcblxuICBwcm90by5heGlzID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5heGlzIHx8IHt9O1xuICB9O1xuXG4gIHByb3RvLmJhbmRTaXplID0gZnVuY3Rpb24oZW5jVHlwZSwgdXNlU21hbGxCYW5kKSB7XG4gICAgdXNlU21hbGxCYW5kID0gdXNlU21hbGxCYW5kIHx8XG4gICAgICAvL2lzQmFuZEluU21hbGxNdWx0aXBsZXNcbiAgICAgIChlbmNUeXBlID09PSBZICYmIHRoaXMuaGFzKFJPVykgJiYgdGhpcy5oYXMoWSkpIHx8XG4gICAgICAoZW5jVHlwZSA9PT0gWCAmJiB0aGlzLmhhcyhDT0wpICYmIHRoaXMuaGFzKFgpKTtcblxuICAgIC8vIGlmIGJhbmQuc2l6ZSBpcyBleHBsaWNpdGx5IHNwZWNpZmllZCwgZm9sbG93IHRoZSBzcGVjaWZpY2F0aW9uLCBvdGhlcndpc2UgZHJhdyB2YWx1ZSBmcm9tIGNvbmZpZy5cbiAgICByZXR1cm4gdGhpcy5maWVsZChlbmNUeXBlKS5iYW5kLnNpemUgfHxcbiAgICAgIHRoaXMuY29uZmlnKHVzZVNtYWxsQmFuZCA/ICdzbWFsbEJhbmRTaXplJyA6ICdsYXJnZUJhbmRTaXplJyk7XG4gIH07XG5cbiAgcHJvdG8uYWdncmVnYXRlID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5hZ2dyZWdhdGU7XG4gIH07XG5cbiAgLy8gcmV0dXJucyBmYWxzZSBpZiBiaW5uaW5nIGlzIGRpc2FibGVkLCBvdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYmlubmluZyBwcm9wZXJ0aWVzXG4gIHByb3RvLmJpbiA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgdmFyIGJpbiA9IHRoaXMuX2VuY1tldF0uYmluO1xuICAgIGlmIChiaW4gPT09IHt9KVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChiaW4gPT09IHRydWUpXG4gICAgICByZXR1cm4ge1xuICAgICAgICBtYXhiaW5zOiBzY2hlbWEuTUFYQklOU19ERUZBVUxUXG4gICAgICB9O1xuICAgIHJldHVybiBiaW47XG4gIH07XG5cbiAgcHJvdG8udmFsdWUgPSBmdW5jdGlvbihldCkge1xuICAgIHJldHVybiB0aGlzLl9lbmNbZXRdLnZhbHVlO1xuICB9O1xuXG4gIHByb3RvLm51bWJlckZvcm1hdCA9IGZ1bmN0aW9uKGZpZWxkU3RhdHMpIHtcbiAgICB2YXIgZm9ybWF0Q29uZmlnID0gZmllbGRTdGF0cy5tYXggPiB0aGlzLmNvbmZpZygnbWF4U21hbGxOdW1iZXInKSA/XG4gICAgICAnbGFyZ2VOdW1iZXJGb3JtYXQnOiAnc21hbGxOdW1iZXJGb3JtYXQnO1xuICAgIHJldHVybiB0aGlzLmNvbmZpZyhmb3JtYXRDb25maWcpO1xuICB9O1xuXG4gIHByb3RvLnNvcnQgPSBmdW5jdGlvbihldCwgc3RhdHMpIHtcbiAgICB2YXIgc29ydCA9IHRoaXMuX2VuY1tldF0uc29ydCxcbiAgICAgIGVuYyA9IHRoaXMuX2VuYyxcbiAgICAgIGlzVHlwZXMgPSB2bGZpZWxkLmlzVHlwZXM7XG5cbiAgICBpZiAoKCFzb3J0IHx8IHNvcnQubGVuZ3RoPT09MCkgJiZcbiAgICAgICAgLy8gRklYTUVcbiAgICAgICAgRW5jb2RpbmcudG9nZ2xlU29ydC5zdXBwb3J0KHtlbmNvZGluZzp0aGlzLl9lbmN9LCBzdGF0cywgdHJ1ZSkgJiYgLy9IQUNLXG4gICAgICAgIHRoaXMuY29uZmlnKCd0b2dnbGVTb3J0JykgPT09IFFcbiAgICAgICkge1xuICAgICAgdmFyIHFGaWVsZCA9IGlzVHlwZXMoZW5jLngsIFtOLCBPXSkgPyBlbmMueSA6IGVuYy54O1xuXG4gICAgICBpZiAoaXNUeXBlcyhlbmNbZXRdLCBbTiwgT10pKSB7XG4gICAgICAgIHNvcnQgPSBbe1xuICAgICAgICAgIG5hbWU6IHFGaWVsZC5uYW1lLFxuICAgICAgICAgIGFnZ3JlZ2F0ZTogcUZpZWxkLmFnZ3JlZ2F0ZSxcbiAgICAgICAgICB0eXBlOiBxRmllbGQudHlwZSxcbiAgICAgICAgICByZXZlcnNlOiB0cnVlXG4gICAgICAgIH1dO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzb3J0O1xuICB9O1xuXG4gIHByb3RvLm1hcCA9IGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gdmxlbmMubWFwKHRoaXMuX2VuYywgZik7XG4gIH07XG5cbiAgcHJvdG8ucmVkdWNlID0gZnVuY3Rpb24oZiwgaW5pdCkge1xuICAgIHJldHVybiB2bGVuYy5yZWR1Y2UodGhpcy5fZW5jLCBmLCBpbml0KTtcbiAgfTtcblxuICBwcm90by5mb3JFYWNoID0gZnVuY3Rpb24oZikge1xuICAgIHJldHVybiB2bGVuYy5mb3JFYWNoKHRoaXMuX2VuYywgZik7XG4gIH07XG5cbiAgcHJvdG8udHlwZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGV0KSA/IHRoaXMuX2VuY1tldF0udHlwZSA6IG51bGw7XG4gIH07XG5cbiAgcHJvdG8uaXNUeXBlID0gZnVuY3Rpb24oZXQsIHR5cGUpIHtcbiAgICB2YXIgZmllbGQgPSB0aGlzLmZpZWxkKGV0KTtcbiAgICByZXR1cm4gZmllbGQgJiYgdmxmaWVsZC5pc1R5cGUoZmllbGQsIHR5cGUpO1xuICB9O1xuXG5cbiAgcHJvdG8uaXNUeXBlcyA9IGZ1bmN0aW9uKGV0LCB0eXBlKSB7XG4gICAgdmFyIGZpZWxkID0gdGhpcy5maWVsZChldCk7XG4gICAgcmV0dXJuIGZpZWxkICYmIHZsZmllbGQuaXNUeXBlcyhmaWVsZCwgdHlwZSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNPcmRpbmFsU2NhbGUgPSBmdW5jdGlvbihlbmNvZGluZywgZW5jVHlwZSkge1xuICAgIHJldHVybiB2bGZpZWxkLmlzT3JkaW5hbFNjYWxlKGVuY29kaW5nLmZpZWxkKGVuY1R5cGUpKTtcbiAgfTtcblxuICBFbmNvZGluZy5pc0RpbWVuc2lvbiA9IGZ1bmN0aW9uKGVuY29kaW5nLCBlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHZsZmllbGQuaXNEaW1lbnNpb24oZW5jb2RpbmcuZmllbGQoZW5jVHlwZSkpO1xuICB9O1xuXG4gIEVuY29kaW5nLmlzTWVhc3VyZSA9IGZ1bmN0aW9uKGVuY29kaW5nLCBlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHZsZmllbGQuaXNNZWFzdXJlKGVuY29kaW5nLmZpZWxkKGVuY1R5cGUpKTtcbiAgfTtcblxuICBwcm90by5pc09yZGluYWxTY2FsZSA9IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXMoZW5jVHlwZSkgJiYgRW5jb2RpbmcuaXNPcmRpbmFsU2NhbGUodGhpcywgZW5jVHlwZSk7XG4gIH07XG5cbiAgcHJvdG8uaXNEaW1lbnNpb24gPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGVuY1R5cGUpICYmIEVuY29kaW5nLmlzRGltZW5zaW9uKHRoaXMsIGVuY1R5cGUpO1xuICB9O1xuXG4gIHByb3RvLmlzTWVhc3VyZSA9IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXMoZW5jVHlwZSkgJiYgRW5jb2RpbmcuaXNNZWFzdXJlKHRoaXMsIGVuY1R5cGUpO1xuICB9O1xuXG4gIHByb3RvLmlzQWdncmVnYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZsZW5jLmlzQWdncmVnYXRlKHRoaXMuX2VuYyk7XG4gIH07XG5cbiAgcHJvdG8uZGF0YVRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBZ2dyZWdhdGUoKSA/IEFHR1JFR0FURSA6IFJBVztcbiAgfTtcblxuICBFbmNvZGluZy5pc0FnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICByZXR1cm4gdmxlbmMuaXNBZ2dyZWdhdGUoc3BlYy5lbmNvZGluZyk7XG4gIH07XG5cbiAgRW5jb2RpbmcuYWx3YXlzTm9PY2NsdXNpb24gPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgLy8gRklYTUUgcmF3IE94USB3aXRoICMgb2Ygcm93cyA9ICMgb2YgT1xuICAgIHJldHVybiB2bGVuYy5pc0FnZ3JlZ2F0ZShzcGVjLmVuY29kaW5nKTtcbiAgfTtcblxuICBFbmNvZGluZy5pc1N0YWNrID0gZnVuY3Rpb24oc3BlYykge1xuICAgIC8vIEZJWE1FIHVwZGF0ZSB0aGlzIG9uY2Ugd2UgaGF2ZSBjb250cm9sIGZvciBzdGFjayAuLi5cbiAgICByZXR1cm4gKHNwZWMubWFya3R5cGUgPT09ICdiYXInIHx8IHNwZWMubWFya3R5cGUgPT09ICdhcmVhJykgJiZcbiAgICAgIHNwZWMuZW5jb2RpbmcuY29sb3I7XG4gIH07XG5cbiAgcHJvdG8uaXNTdGFjayA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIEZJWE1FIHVwZGF0ZSB0aGlzIG9uY2Ugd2UgaGF2ZSBjb250cm9sIGZvciBzdGFjayAuLi5cbiAgICByZXR1cm4gKHRoaXMuaXMoJ2JhcicpIHx8IHRoaXMuaXMoJ2FyZWEnKSkgJiYgdGhpcy5oYXMoJ2NvbG9yJyk7XG4gIH07XG5cbiAgcHJvdG8uZGV0YWlscyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbmNvZGluZyA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMucmVkdWNlKGZ1bmN0aW9uKHJlZnMsIGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgICBpZiAoIWZpZWxkLmFnZ3JlZ2F0ZSAmJiAoZW5jVHlwZSAhPT0gWCAmJiBlbmNUeXBlICE9PSBZKSkge1xuICAgICAgICByZWZzLnB1c2goZW5jb2RpbmcuZmllbGRSZWYoZW5jVHlwZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlZnM7XG4gICAgfSwgW10pO1xuICB9O1xuXG4gIHByb3RvLmZhY2V0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbmNvZGluZyA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMucmVkdWNlKGZ1bmN0aW9uKHJlZnMsIGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgICBpZiAoIWZpZWxkLmFnZ3JlZ2F0ZSAmJiAoZW5jVHlwZSA9PSBST1cgfHwgZW5jVHlwZSA9PSBDT0wpKSB7XG4gICAgICAgIHJlZnMucHVzaChlbmNvZGluZy5maWVsZFJlZihlbmNUeXBlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVmcztcbiAgICB9LCBbXSk7XG4gIH07XG5cbiAgcHJvdG8uY2FyZGluYWxpdHkgPSBmdW5jdGlvbihlbmNUeXBlLCBzdGF0cykge1xuICAgIHJldHVybiB2bGZpZWxkLmNhcmRpbmFsaXR5KHRoaXMuZmllbGQoZW5jVHlwZSksIHN0YXRzLCB0aGlzLmNvbmZpZygnZmlsdGVyTnVsbCcpKTtcbiAgfTtcblxuICBwcm90by5pc1JhdyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0FnZ3JlZ2F0ZSgpO1xuICB9O1xuXG4gIHByb3RvLmRhdGEgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgfTtcblxuICAgLy8gcmV0dXJucyB3aGV0aGVyIHRoZSBlbmNvZGluZyBoYXMgdmFsdWVzIGVtYmVkZGVkXG4gIHByb3RvLmhhc1ZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWxzID0gdGhpcy5kYXRhKCkudmFsdWVzO1xuICAgIHJldHVybiB2YWxzICYmIHZhbHMubGVuZ3RoO1xuICB9O1xuXG4gIHByb3RvLmNvbmZpZyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY29uZmlnW25hbWVdO1xuICB9O1xuXG4gIEVuY29kaW5nLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICB2YXIgb2xkZW5jID0gc3BlYy5lbmNvZGluZyxcbiAgICAgIGVuYyA9IHV0aWwuZHVwbGljYXRlKHNwZWMuZW5jb2RpbmcpO1xuICAgIGVuYy54ID0gb2xkZW5jLnk7XG4gICAgZW5jLnkgPSBvbGRlbmMueDtcbiAgICBlbmMucm93ID0gb2xkZW5jLmNvbDtcbiAgICBlbmMuY29sID0gb2xkZW5jLnJvdztcbiAgICBzcGVjLmVuY29kaW5nID0gZW5jO1xuICAgIHJldHVybiBzcGVjO1xuICB9O1xuXG4gIC8vIEZJWE1FOiBSRU1PVkUgZXZlcnl0aGluZyBiZWxvdyBoZXJlXG5cbiAgRW5jb2RpbmcudG9nZ2xlU29ydCA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICBzcGVjLmNvbmZpZyA9IHNwZWMuY29uZmlnIHx8IHt9O1xuICAgIHNwZWMuY29uZmlnLnRvZ2dsZVNvcnQgPSBzcGVjLmNvbmZpZy50b2dnbGVTb3J0ID09PSBRID8gTiA6IFE7XG4gICAgcmV0dXJuIHNwZWM7XG4gIH07XG5cblxuICBFbmNvZGluZy50b2dnbGVTb3J0LmRpcmVjdGlvbiA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICBpZiAoIUVuY29kaW5nLnRvZ2dsZVNvcnQuc3VwcG9ydChzcGVjKSkgeyByZXR1cm47IH1cbiAgICB2YXIgZW5jID0gc3BlYy5lbmNvZGluZztcbiAgICByZXR1cm4gZW5jLngudHlwZSA9PT0gTiA/ICd4JyA6ICd5JztcbiAgfTtcblxuICBFbmNvZGluZy50b2dnbGVTb3J0Lm1vZGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHNwZWMuY29uZmlnLnRvZ2dsZVNvcnQ7XG4gIH07XG5cbiAgRW5jb2RpbmcudG9nZ2xlU29ydC5zdXBwb3J0ID0gZnVuY3Rpb24oc3BlYywgc3RhdHMpIHtcbiAgICB2YXIgZW5jID0gc3BlYy5lbmNvZGluZyxcbiAgICAgIGlzVHlwZXMgPSB2bGZpZWxkLmlzVHlwZXM7XG5cbiAgICBpZiAodmxlbmMuaGFzKGVuYywgUk9XKSB8fCB2bGVuYy5oYXMoZW5jLCBDT0wpIHx8XG4gICAgICAhdmxlbmMuaGFzKGVuYywgWCkgfHwgIXZsZW5jLmhhcyhlbmMsIFkpIHx8XG4gICAgICAhRW5jb2RpbmcuYWx3YXlzTm9PY2NsdXNpb24oc3BlYywgc3RhdHMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuICggaXNUeXBlcyhlbmMueCwgW04sT10pICYmIHZsZmllbGQuaXNNZWFzdXJlKGVuYy55KSkgPyAneCcgOlxuICAgICAgKCBpc1R5cGVzKGVuYy55LCBbTixPXSkgJiYgdmxmaWVsZC5pc01lYXN1cmUoZW5jLngpKSA/ICd5JyA6IGZhbHNlO1xuICB9O1xuXG4gIEVuY29kaW5nLnRvZ2dsZUZpbHRlck51bGxPID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHNwZWMuY29uZmlnID0gc3BlYy5jb25maWcgfHwge307XG4gICAgc3BlYy5jb25maWcuZmlsdGVyTnVsbCA9IHNwZWMuY29uZmlnLmZpbHRlck51bGwgfHwgeyAvL0ZJWE1FXG4gICAgICBUOiB0cnVlLFxuICAgICAgUTogdHJ1ZVxuICAgIH07XG4gICAgc3BlYy5jb25maWcuZmlsdGVyTnVsbC5PID0gIXNwZWMuY29uZmlnLmZpbHRlck51bGwuTztcbiAgICByZXR1cm4gc3BlYztcbiAgfTtcblxuICBFbmNvZGluZy50b2dnbGVGaWx0ZXJOdWxsTy5zdXBwb3J0ID0gZnVuY3Rpb24oc3BlYywgc3RhdHMpIHtcbiAgICB2YXIgZmllbGRzID0gdmxlbmMuZmllbGRzKHNwZWMuZW5jb2RpbmcpO1xuICAgIGZvciAodmFyIGZpZWxkTmFtZSBpbiBmaWVsZHMpIHtcbiAgICAgIHZhciBmaWVsZExpc3QgPSBmaWVsZHNbZmllbGROYW1lXTtcbiAgICAgIGlmIChmaWVsZExpc3QuY29udGFpbnNUeXBlLk8gJiYgZmllbGROYW1lIGluIHN0YXRzICYmIHN0YXRzW2ZpZWxkTmFtZV0ubnVsbHMgPiAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgcmV0dXJuIEVuY29kaW5nO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgc2V0dGVyID0gdXRpbC5zZXR0ZXIsXG4gIGdldHRlciA9IHV0aWwuZ2V0dGVyLFxuICB0aW1lID0gcmVxdWlyZSgnLi90aW1lJyk7XG5cbnZhciBheGlzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuYXhpcy5kZWYgPSBmdW5jdGlvbihuYW1lLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cywgb3B0KSB7XG4gIHZhciBpc0NvbCA9IG5hbWUgPT0gQ09MLFxuICAgIGlzUm93ID0gbmFtZSA9PSBST1csXG4gICAgdHlwZSA9IGlzQ29sID8gJ3gnIDogaXNSb3cgPyAneScgOiBuYW1lO1xuXG4gIHZhciBkZWYgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBzY2FsZTogbmFtZSxcbiAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICBsYXllcjogZW5jb2RpbmcuZmllbGQobmFtZSkuYXhpcy5sYXllcixcbiAgICBvcmllbnQ6IGF4aXMub3JpZW50KG5hbWUsIGVuY29kaW5nLCBzdGF0cylcbiAgfTtcblxuICAvLyBBZGQgYXhpcyBsYWJlbCBjdXN0b20gc2NhbGUgKGZvciBiaW4gLyB0aW1lKVxuICBkZWYgPSBheGlzLmxhYmVscy5zY2FsZShkZWYsIGVuY29kaW5nLCBuYW1lKTtcbiAgZGVmID0gYXhpcy5sYWJlbHMuZm9ybWF0KGRlZiwgbmFtZSwgZW5jb2RpbmcsIHN0YXRzKTtcbiAgZGVmID0gYXhpcy5sYWJlbHMuYW5nbGUoZGVmLCBlbmNvZGluZywgbmFtZSk7XG5cbiAgLy8gZm9yIHgtYXhpcywgc2V0IHRpY2tzIGZvciBRIG9yIHJvdGF0ZSBzY2FsZSBmb3Igb3JkaW5hbCBzY2FsZVxuICBpZiAobmFtZSA9PSBYKSB7XG4gICAgaWYgKChlbmNvZGluZy5pc0RpbWVuc2lvbihYKSB8fCBlbmNvZGluZy5pc1R5cGUoWCwgVCkpICYmXG4gICAgICAgICEoJ2FuZ2xlJyBpbiBnZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCAnbGFiZWxzJ10pKSkge1xuICAgICAgLy8gVE9ETyhrYW5pdHcpOiBKdWwgMTksIDIwMTUgLSAjNTA2IGFkZCBjb25kaXRpb24gZm9yIHJvdGF0aW9uXG4gICAgICBkZWYgPSBheGlzLmxhYmVscy5yb3RhdGUoZGVmKTtcbiAgICB9IGVsc2UgeyAvLyBRXG4gICAgICBkZWYudGlja3MgPSBlbmNvZGluZy5maWVsZChuYW1lKS5heGlzLnRpY2tzO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRpdGxlT2Zmc2V0IGRlcGVuZHMgb24gbGFiZWxzIHJvdGF0aW9uXG4gIGRlZi50aXRsZU9mZnNldCA9IGF4aXMudGl0bGVPZmZzZXQoZW5jb2RpbmcsIGxheW91dCwgbmFtZSk7XG5cbiAgLy9kZWYub2Zmc2V0IGlzIHVzZWQgaW4gYXhpcy5ncmlkXG4gIGlmKGlzUm93KSBkZWYub2Zmc2V0ID0gYXhpcy50aXRsZU9mZnNldChlbmNvZGluZywgbGF5b3V0LCBZKSArIDIwO1xuICAvLyBGSVhNRShrYW5pdHcpOiBKdWwgMTksIDIwMTUgLSBvZmZzZXQgZm9yIGNvbHVtbiB3aGVuIHggaXMgcHV0IG9uIHRvcFxuXG4gIGRlZiA9IGF4aXMuZ3JpZChkZWYsIG5hbWUsIGVuY29kaW5nLCBsYXlvdXQpO1xuICBkZWYgPSBheGlzLnRpdGxlKGRlZiwgbmFtZSwgZW5jb2RpbmcsIGxheW91dCwgb3B0KTtcblxuICBpZiAoaXNSb3cgfHwgaXNDb2wpIGRlZiA9IGF4aXMuaGlkZVRpY2tzKGRlZik7XG5cbiAgcmV0dXJuIGRlZjtcbn07XG5cbmF4aXMub3JpZW50ID0gZnVuY3Rpb24obmFtZSwgZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHZhciBvcmllbnQgPSBlbmNvZGluZy5maWVsZChuYW1lKS5heGlzLm9yaWVudDtcbiAgaWYgKG9yaWVudCkgcmV0dXJuIG9yaWVudDtcblxuICBpZiAobmFtZSA9PT0gQ09MKSByZXR1cm4gJ3RvcCc7XG5cbiAgLy8geC1heGlzIGZvciBsb25nIHkgLSBwdXQgb24gdG9wXG4gIGlmIChuYW1lID09PSBYICYmIGVuY29kaW5nLmhhcyhZKSAmJiBlbmNvZGluZy5pc09yZGluYWxTY2FsZShZKSAmJiBlbmNvZGluZy5jYXJkaW5hbGl0eShZLCBzdGF0cykgPiAzMCkge1xuICAgIHJldHVybiAndG9wJztcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5heGlzLmdyaWQgPSBmdW5jdGlvbihkZWYsIG5hbWUsIGVuY29kaW5nLCBsYXlvdXQpIHtcbiAgdmFyIGNlbGxQYWRkaW5nID0gbGF5b3V0LmNlbGxQYWRkaW5nLFxuICAgIGlzQ29sID0gbmFtZSA9PSBDT0wsXG4gICAgaXNSb3cgPSBuYW1lID09IFJPVztcblxuICBpZiAoZW5jb2RpbmcuYXhpcyhuYW1lKS5ncmlkKSB7XG4gICAgZGVmLmdyaWQgPSB0cnVlO1xuXG4gICAgaWYgKGlzQ29sKSB7XG4gICAgICAvLyBzZXQgZ3JpZCBwcm9wZXJ0eSAtLSBwdXQgdGhlIGxpbmVzIG9uIHRoZSByaWdodCB0aGUgY2VsbFxuICAgICAgZGVmLnByb3BlcnRpZXMuZ3JpZCA9IHtcbiAgICAgICAgeDoge1xuICAgICAgICAgIG9mZnNldDogbGF5b3V0LmNlbGxXaWR0aCAqICgxKyBjZWxsUGFkZGluZy8yLjApLFxuICAgICAgICAgIC8vIGRlZmF1bHQgdmFsdWUocykgLS0gdmVnYSBkb2Vzbid0IGRvIHJlY3Vyc2l2ZSBtZXJnZVxuICAgICAgICAgIHNjYWxlOiAnY29sJ1xuICAgICAgICB9LFxuICAgICAgICB5OiB7XG4gICAgICAgICAgdmFsdWU6IC1sYXlvdXQuY2VsbEhlaWdodCAqIChjZWxsUGFkZGluZy8yKSxcbiAgICAgICAgfSxcbiAgICAgICAgc3Ryb2tlOiB7IHZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2NlbGxHcmlkQ29sb3InKSB9LFxuICAgICAgICBvcGFjaXR5OiB7IHZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2NlbGxHcmlkT3BhY2l0eScpIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChpc1Jvdykge1xuICAgICAgLy8gc2V0IGdyaWQgcHJvcGVydHkgLS0gcHV0IHRoZSBsaW5lcyBvbiB0aGUgdG9wXG4gICAgICBkZWYucHJvcGVydGllcy5ncmlkID0ge1xuICAgICAgICB5OiB7XG4gICAgICAgICAgb2Zmc2V0OiAtbGF5b3V0LmNlbGxIZWlnaHQgKiAoY2VsbFBhZGRpbmcvMiksXG4gICAgICAgICAgLy8gZGVmYXVsdCB2YWx1ZShzKSAtLSB2ZWdhIGRvZXNuJ3QgZG8gcmVjdXJzaXZlIG1lcmdlXG4gICAgICAgICAgc2NhbGU6ICdyb3cnXG4gICAgICAgIH0sXG4gICAgICAgIHg6IHtcbiAgICAgICAgICB2YWx1ZTogZGVmLm9mZnNldFxuICAgICAgICB9LFxuICAgICAgICB4Mjoge1xuICAgICAgICAgIG9mZnNldDogZGVmLm9mZnNldCArIChsYXlvdXQuY2VsbFdpZHRoICogMC4wNSksXG4gICAgICAgICAgLy8gZGVmYXVsdCB2YWx1ZShzKSAtLSB2ZWdhIGRvZXNuJ3QgZG8gcmVjdXJzaXZlIG1lcmdlXG4gICAgICAgICAgZ3JvdXA6ICdtYXJrLmdyb3VwLndpZHRoJyxcbiAgICAgICAgICBtdWx0OiAxXG4gICAgICAgIH0sXG4gICAgICAgIHN0cm9rZTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsR3JpZENvbG9yJykgfSxcbiAgICAgICAgb3BhY2l0eTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsR3JpZE9wYWNpdHknKSB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWYucHJvcGVydGllcy5ncmlkID0ge1xuICAgICAgICBzdHJva2U6IHsgdmFsdWU6IGVuY29kaW5nLmNvbmZpZygnZ3JpZENvbG9yJykgfSxcbiAgICAgICAgb3BhY2l0eTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdncmlkT3BhY2l0eScpIH1cbiAgICAgIH07XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWY7XG59O1xuXG5heGlzLmhpZGVUaWNrcyA9IGZ1bmN0aW9uKGRlZikge1xuICBkZWYucHJvcGVydGllcy50aWNrcyA9IHtvcGFjaXR5OiB7dmFsdWU6IDB9fTtcbiAgZGVmLnByb3BlcnRpZXMubWFqb3JUaWNrcyA9IHtvcGFjaXR5OiB7dmFsdWU6IDB9fTtcbiAgZGVmLnByb3BlcnRpZXMuYXhpcyA9IHtvcGFjaXR5OiB7dmFsdWU6IDB9fTtcbiAgcmV0dXJuIGRlZjtcbn07XG5cbmF4aXMudGl0bGUgPSBmdW5jdGlvbiAoZGVmLCBuYW1lLCBlbmNvZGluZywgbGF5b3V0KSB7XG4gIHZhciBheCA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLmF4aXM7XG5cbiAgaWYgKGF4LnRpdGxlKSB7XG4gICAgZGVmLnRpdGxlID0gYXgudGl0bGU7XG4gIH0gZWxzZSB7XG4gICAgLy8gaWYgbm90IGRlZmluZWQsIGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lIGF4aXMgdGl0bGUgZnJvbSBmaWVsZCBkZWZcbiAgICB2YXIgZmllbGRUaXRsZSA9IGVuY29kaW5nLmZpZWxkVGl0bGUobmFtZSksXG4gICAgICBtYXhMZW5ndGg7XG5cbiAgICBpZiAoYXgudGl0bGVNYXhMZW5ndGgpIHtcbiAgICAgIG1heExlbmd0aCA9IGF4LnRpdGxlTWF4TGVuZ3RoO1xuICAgIH0gZWxzZSBpZiAobmFtZT09PVgpIHtcbiAgICAgIG1heExlbmd0aCA9IGxheW91dC5jZWxsV2lkdGggLyBlbmNvZGluZy5jb25maWcoJ2NoYXJhY3RlcldpZHRoJyk7XG4gICAgfSBlbHNlIGlmIChuYW1lID09PSBZKSB7XG4gICAgICBtYXhMZW5ndGggPSBsYXlvdXQuY2VsbEhlaWdodCAvIGVuY29kaW5nLmNvbmZpZygnY2hhcmFjdGVyV2lkdGgnKTtcbiAgICB9XG5cbiAgICBkZWYudGl0bGUgPSBtYXhMZW5ndGggPyB1dGlsLnRydW5jYXRlKGZpZWxkVGl0bGUsIG1heExlbmd0aCkgOiBmaWVsZFRpdGxlO1xuICB9XG5cbiAgaWYgKG5hbWUgPT09IFJPVykge1xuICAgIGRlZi5wcm9wZXJ0aWVzLnRpdGxlID0ge1xuICAgICAgYW5nbGU6IHt2YWx1ZTogMH0sXG4gICAgICBhbGlnbjoge3ZhbHVlOiAncmlnaHQnfSxcbiAgICAgIGJhc2VsaW5lOiB7dmFsdWU6ICdtaWRkbGUnfSxcbiAgICAgIGR5OiB7dmFsdWU6ICgtbGF5b3V0LmhlaWdodC8yKSAtMjB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBkZWY7XG59O1xuXG5heGlzLmxhYmVscyA9IHt9O1xuXG4vKiogYWRkIGN1c3RvbSBsYWJlbCBmb3IgdGltZSB0eXBlIGFuZCBiaW4gKi9cbmF4aXMubGFiZWxzLnNjYWxlID0gZnVuY3Rpb24oZGVmLCBlbmNvZGluZywgbmFtZSkge1xuICAvLyB0aW1lXG4gIHZhciB0aW1lVW5pdCA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLnRpbWVVbml0O1xuICBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFQpICYmIHRpbWVVbml0ICYmICh0aW1lLmhhc1NjYWxlKHRpbWVVbml0KSkpIHtcbiAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCdsYWJlbHMnLCd0ZXh0Jywnc2NhbGUnXSwgJ3RpbWUtJysgdGltZVVuaXQpO1xuICB9XG4gIC8vIEZJWE1FIGJpblxuICByZXR1cm4gZGVmO1xufTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgbnVtYmVyIGZvcm1hdCBvciB0cnVuY2F0ZSBpZiBtYXhMYWJlbCBsZW5ndGggaXMgcHJlc2VudGVkLlxuICovXG5heGlzLmxhYmVscy5mb3JtYXQgPSBmdW5jdGlvbiAoZGVmLCBuYW1lLCBlbmNvZGluZywgc3RhdHMpIHtcbiAgdmFyIGZpZWxkU3RhdHMgPSBzdGF0c1tlbmNvZGluZy5maWVsZChuYW1lKS5uYW1lXTtcblxuICBpZiAoZW5jb2RpbmcuYXhpcyhuYW1lKS5mb3JtYXQpIHtcbiAgICBkZWYuZm9ybWF0ID0gZW5jb2RpbmcuYXhpcyhuYW1lKS5mb3JtYXQ7XG4gIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFEpIHx8IGZpZWxkU3RhdHMudHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICBkZWYuZm9ybWF0ID0gZW5jb2RpbmcubnVtYmVyRm9ybWF0KGZpZWxkU3RhdHMpO1xuICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSkge1xuICAgIHZhciB0aW1lVW5pdCA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLnRpbWVVbml0O1xuICAgIGlmICghdGltZVVuaXQpIHtcbiAgICAgIGRlZi5mb3JtYXQgPSBlbmNvZGluZy5jb25maWcoJ3RpbWVGb3JtYXQnKTtcbiAgICB9IGVsc2UgaWYgKHRpbWVVbml0ID09PSAneWVhcicpIHtcbiAgICAgIGRlZi5mb3JtYXQgPSAnZCc7XG4gICAgfVxuICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZXMobmFtZSwgW04sIE9dKSAmJiBlbmNvZGluZy5heGlzKG5hbWUpLm1heExhYmVsTGVuZ3RoKSB7XG4gICAgc2V0dGVyKGRlZixcbiAgICAgIFsncHJvcGVydGllcycsJ2xhYmVscycsJ3RleHQnLCd0ZW1wbGF0ZSddLFxuICAgICAgJ3t7ZGF0YSB8IHRydW5jYXRlOicgKyBlbmNvZGluZy5heGlzKG5hbWUpLm1heExhYmVsTGVuZ3RoICsgJ319J1xuICAgICAgKTtcbiAgfVxuXG4gIHJldHVybiBkZWY7XG59O1xuXG5heGlzLmxhYmVscy5hbmdsZSA9IGZ1bmN0aW9uKGRlZiwgZW5jb2RpbmcsIG5hbWUpIHtcbiAgdmFyIGFuZ2xlID0gZW5jb2RpbmcuYXhpcyhuYW1lKS5sYWJlbEFuZ2xlO1xuICBpZiAodHlwZW9mIGFuZ2xlID09PSAndW5kZWZpbmVkJykgcmV0dXJuIGRlZjtcblxuICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCAnbGFiZWxzJywgJ2FuZ2xlJywgJ3ZhbHVlJ10sIGFuZ2xlKTtcbiAgcmV0dXJuIGRlZjtcbn07XG5cbmF4aXMubGFiZWxzLnJvdGF0ZSA9IGZ1bmN0aW9uKGRlZikge1xuIHZhciBhbGlnbiA9IGRlZi5vcmllbnQgPT09J3RvcCcgPyAnbGVmdCcgOiAncmlnaHQnO1xuIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsJ2xhYmVscycsICdhbmdsZScsICd2YWx1ZSddLCAyNzApO1xuIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsJ2xhYmVscycsICdhbGlnbicsICd2YWx1ZSddLCBhbGlnbik7XG4gc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywnbGFiZWxzJywgJ2Jhc2VsaW5lJywgJ3ZhbHVlJ10sICdtaWRkbGUnKTtcbiByZXR1cm4gZGVmO1xufTtcblxuYXhpcy50aXRsZU9mZnNldCA9IGZ1bmN0aW9uIChlbmNvZGluZywgbGF5b3V0LCBuYW1lKSB7XG4gIC8vIHJldHVybiBzcGVjaWZpZWQgdmFsdWUgaWYgc3BlY2lmaWVkXG4gIHZhciB2YWx1ZSA9IGVuY29kaW5nLmF4aXMobmFtZSkudGl0bGVPZmZzZXQ7XG4gIGlmICh2YWx1ZSkgIHJldHVybiB2YWx1ZTtcblxuICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAvL0ZJWE1FIG1ha2UgdGhpcyBhZGp1c3RhYmxlXG4gICAgY2FzZSBST1c6IHJldHVybiAwO1xuICAgIGNhc2UgQ09MOiByZXR1cm4gMzU7XG4gIH1cbiAgcmV0dXJuIGdldHRlcihsYXlvdXQsIFtuYW1lLCAnYXhpc1RpdGxlT2Zmc2V0J10pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN1bW1hcnkgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ2RhdGFsaWIvc3JjL3N0YXRzJykuc3VtbWFyeTtcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG4vKipcbiAqIE1vZHVsZSBmb3IgY29tcGlsaW5nIFZlZ2EtbGl0ZSBzcGVjIGludG8gVmVnYSBzcGVjLlxuICovXG52YXIgY29tcGlsZXIgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG52YXIgRW5jb2RpbmcgPSByZXF1aXJlKCcuLi9FbmNvZGluZycpLFxuICBheGlzID0gY29tcGlsZXIuYXhpcyA9IHJlcXVpcmUoJy4vYXhpcycpLFxuICBsZWdlbmQgPSBjb21waWxlci5sZWdlbmQgPSByZXF1aXJlKCcuL2xlZ2VuZCcpLFxuICBtYXJrcyA9IGNvbXBpbGVyLm1hcmtzID0gcmVxdWlyZSgnLi9tYXJrcycpLFxuICBzY2FsZSA9IGNvbXBpbGVyLnNjYWxlID0gcmVxdWlyZSgnLi9zY2FsZScpO1xuXG5jb21waWxlci5kYXRhID0gcmVxdWlyZSgnLi9kYXRhJyk7XG5jb21waWxlci5mYWNldCA9IHJlcXVpcmUoJy4vZmFjZXQnKTtcbmNvbXBpbGVyLmxheW91dCA9IHJlcXVpcmUoJy4vbGF5b3V0Jyk7XG5jb21waWxlci5zb3J0ID0gcmVxdWlyZSgnLi9zb3J0Jyk7XG5jb21waWxlci5zdGFjayA9IHJlcXVpcmUoJy4vc3RhY2snKTtcbmNvbXBpbGVyLnN0eWxlID0gcmVxdWlyZSgnLi9zdHlsZScpO1xuY29tcGlsZXIuc3ViZmFjZXQgPSByZXF1aXJlKCcuL3N1YmZhY2V0Jyk7XG5jb21waWxlci50aW1lID0gcmVxdWlyZSgnLi90aW1lJyk7XG5cbmNvbXBpbGVyLmNvbXBpbGUgPSBmdW5jdGlvbiAoc3BlYywgc3RhdHMsIHRoZW1lKSB7XG4gIHJldHVybiBjb21waWxlci5jb21waWxlRW5jb2RpbmcoRW5jb2RpbmcuZnJvbVNwZWMoc3BlYywgdGhlbWUpLCBzdGF0cyk7XG59O1xuXG5jb21waWxlci5zaG9ydGhhbmQgPSBmdW5jdGlvbiAoc2hvcnRoYW5kLCBzdGF0cywgY29uZmlnLCB0aGVtZSkge1xuICByZXR1cm4gY29tcGlsZXIuY29tcGlsZUVuY29kaW5nKEVuY29kaW5nLmZyb21TaG9ydGhhbmQoc2hvcnRoYW5kLCBjb25maWcsIHRoZW1lKSwgc3RhdHMpO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSBWZWdhIHNwZWNpZmljYXRpb24gZnJvbSBhIFZlZ2EtbGl0ZSBFbmNvZGluZyBvYmplY3QuXG4gKi9cbmNvbXBpbGVyLmNvbXBpbGVFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhdHMpIHtcbiAgLy8gbm8gbmVlZCB0byBwYXNzIHN0YXRzIGlmIHlvdSBwYXNzIGluIHRoZSBkYXRhXG4gIGlmICghc3RhdHMpIHtcbiAgICBpZiAoZW5jb2RpbmcuaGFzVmFsdWVzKCkpIHtcbiAgICAgICAgc3RhdHMgPSBzdW1tYXJ5KGVuY29kaW5nLmRhdGEoKS52YWx1ZXMpLnJlZHVjZShmdW5jdGlvbihzLCBwKSB7XG4gICAgICAgIHNbcC5maWVsZF0gPSBwO1xuICAgICAgICByZXR1cm4gcztcbiAgICAgIH0sIHt9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcignTm8gc3RhdHMgcHJvdmlkZWQgYW5kIGRhdGEgaXMgbm90IGVtYmVkZGVkLicpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBsYXlvdXQgPSBjb21waWxlci5sYXlvdXQoZW5jb2RpbmcsIHN0YXRzKTtcblxuICB2YXIgc3BlYyA9IHtcbiAgICAgIHdpZHRoOiBsYXlvdXQud2lkdGgsXG4gICAgICBoZWlnaHQ6IGxheW91dC5oZWlnaHQsXG4gICAgICBwYWRkaW5nOiAnYXV0bycsXG4gICAgICBkYXRhOiBjb21waWxlci5kYXRhKGVuY29kaW5nKSxcbiAgICAgIC8vIGdsb2JhbCBzY2FsZXMgY29udGFpbnMgb25seSB0aW1lIHVuaXQgc2NhbGVzXG4gICAgICBzY2FsZXM6IGNvbXBpbGVyLnRpbWUuc2NhbGVzKGVuY29kaW5nKSxcbiAgICAgIG1hcmtzOiBbe1xuICAgICAgICBfbmFtZTogJ2NlbGwnLFxuICAgICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgZW50ZXI6IHtcbiAgICAgICAgICAgIHdpZHRoOiBsYXlvdXQuY2VsbFdpZHRoID8ge3ZhbHVlOiBsYXlvdXQuY2VsbFdpZHRofSA6IHtncm91cDogJ3dpZHRoJ30sXG4gICAgICAgICAgICBoZWlnaHQ6IGxheW91dC5jZWxsSGVpZ2h0ID8ge3ZhbHVlOiBsYXlvdXQuY2VsbEhlaWdodH0gOiB7Z3JvdXA6ICdoZWlnaHQnfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfV1cbiAgICB9O1xuXG4gIHZhciBncm91cCA9IHNwZWMubWFya3NbMF07XG5cbiAgLy8gRklYTUUgcmVtb3ZlIGNvbXBpbGVyLnNvcnQgYWZ0ZXIgbWlncmF0aW5nIHRvIHZlZ2EgMi5cbiAgc3BlYy5kYXRhID0gY29tcGlsZXIuc29ydChzcGVjLmRhdGEsIGVuY29kaW5nLCBzdGF0cyk7IC8vIGFwcGVuZCBuZXcgZGF0YVxuXG4gIC8vIG1hcmtzXG4gIHZhciBzdHlsZSA9IGNvbXBpbGVyLnN0eWxlKGVuY29kaW5nLCBzdGF0cyksXG4gICAgbWRlZnMgPSBncm91cC5tYXJrcyA9IG1hcmtzLmRlZihlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgc3RhdHMpLFxuICAgIG1kZWYgPSBtZGVmc1ttZGVmcy5sZW5ndGggLSAxXTsgIC8vIFRPRE86IHJlbW92ZSB0aGlzIGRpcnR5IGhhY2sgYnkgcmVmYWN0b3JpbmcgdGhlIHdob2xlIGZsb3dcblxuICB2YXIgbGluZVR5cGUgPSBtYXJrc1tlbmNvZGluZy5tYXJrdHlwZSgpXS5saW5lO1xuXG4gIC8vIGhhbmRsZSBzdWJmYWNldHNcblxuICB2YXIgZGV0YWlscyA9IGVuY29kaW5nLmRldGFpbHMoKSxcbiAgICBzdGFjayA9IGVuY29kaW5nLmlzQWdncmVnYXRlKCkgJiYgZGV0YWlscy5sZW5ndGggPiAwICYmIGNvbXBpbGVyLnN0YWNrKHNwZWMuZGF0YSwgZW5jb2RpbmcsIG1kZWYpOyAvLyBtb2RpZnkgc3BlYy5kYXRhLCBtZGVmLntmcm9tLHByb3BlcnRpZXN9XG5cbiAgaWYgKGRldGFpbHMubGVuZ3RoID4gMCAmJiAoc3RhY2sgfHwgbGluZVR5cGUpKSB7XG4gICAgLy9zdWJmYWNldCB0byBncm91cCBzdGFjayAvIGxpbmUgdG9nZXRoZXIgaW4gb25lIGdyb3VwXG4gICAgY29tcGlsZXIuc3ViZmFjZXQoZ3JvdXAsIG1kZWYsIGRldGFpbHMsIHN0YWNrLCBlbmNvZGluZyk7XG4gIH1cblxuICAvLyBhdXRvLXNvcnQgbGluZS9hcmVhIHZhbHVlc1xuICBpZiAobGluZVR5cGUgJiYgZW5jb2RpbmcuY29uZmlnKCdhdXRvU29ydExpbmUnKSkge1xuICAgIHZhciBmID0gKGVuY29kaW5nLmlzTWVhc3VyZShYKSAmJiBlbmNvZGluZy5pc0RpbWVuc2lvbihZKSkgPyBZIDogWDtcbiAgICBpZiAoIW1kZWYuZnJvbSkgbWRlZi5mcm9tID0ge307XG4gICAgLy8gVE9ETzogd2h5IC0gP1xuICAgIG1kZWYuZnJvbS50cmFuc2Zvcm0gPSBbe3R5cGU6ICdzb3J0JywgYnk6ICctJyArIGVuY29kaW5nLmZpZWxkUmVmKGYpfV07XG4gIH1cblxuICAvLyBnZXQgYSBmbGF0dGVuZWQgbGlzdCBvZiBhbGwgc2NhbGUgbmFtZXMgdGhhdCBhcmUgdXNlZCBpbiB0aGUgdmwgc3BlY1xuICB2YXIgc2luZ2xlU2NhbGVOYW1lcyA9IFtdLmNvbmNhdC5hcHBseShbXSwgbWRlZnMubWFwKGZ1bmN0aW9uKG1hcmtQcm9wcykge1xuICAgIHJldHVybiBzY2FsZS5uYW1lcyhtYXJrUHJvcHMucHJvcGVydGllcy51cGRhdGUpO1xuICB9KSk7XG5cbiAgLy8gU21hbGwgTXVsdGlwbGVzXG4gIGlmIChlbmNvZGluZy5oYXMoUk9XKSB8fCBlbmNvZGluZy5oYXMoQ09MKSkge1xuICAgIHNwZWMgPSBjb21waWxlci5mYWNldChncm91cCwgZW5jb2RpbmcsIGxheW91dCwgc3BlYywgc2luZ2xlU2NhbGVOYW1lcywgc3RhY2ssIHN0YXRzKTtcbiAgICBzcGVjLmxlZ2VuZHMgPSBsZWdlbmQuZGVmcyhlbmNvZGluZywgc3R5bGUpO1xuICB9IGVsc2Uge1xuICAgIGdyb3VwLnNjYWxlcyA9IHNjYWxlLmRlZnMoc2luZ2xlU2NhbGVOYW1lcywgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMsIHtzdGFjazogc3RhY2t9KTtcblxuICAgIGdyb3VwLmF4ZXMgPSBbXTtcbiAgICBpZiAoZW5jb2RpbmcuaGFzKFgpKSBncm91cC5heGVzLnB1c2goYXhpcy5kZWYoWCwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpKTtcbiAgICBpZiAoZW5jb2RpbmcuaGFzKFkpKSBncm91cC5heGVzLnB1c2goYXhpcy5kZWYoWSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpKTtcblxuICAgIGdyb3VwLmxlZ2VuZHMgPSBsZWdlbmQuZGVmcyhlbmNvZGluZywgc3R5bGUpO1xuICB9XG5cbiAgcmV0dXJuIHNwZWM7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkYXRhO1xuXG52YXIgdmxmaWVsZCA9IHJlcXVpcmUoJy4uL2ZpZWxkJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKTtcblxuLyoqXG4gKiBDcmVhdGUgVmVnYSdzIGRhdGEgYXJyYXkgZnJvbSBhIGdpdmVuIGVuY29kaW5nLlxuICpcbiAqIEBwYXJhbSAge0VuY29kaW5nfSBlbmNvZGluZ1xuICogQHJldHVybiB7QXJyYXl9IEFycmF5IG9mIFZlZ2EgZGF0YS5cbiAqICAgICAgICAgICAgICAgICBUaGlzIGFsd2F5cyBpbmNsdWRlcyBhIFwicmF3XCIgZGF0YSB0YWJsZS5cbiAqICAgICAgICAgICAgICAgICBJZiB0aGUgZW5jb2RpbmcgY29udGFpbnMgYWdncmVnYXRlIHZhbHVlLCB0aGlzIHdpbGwgYWxzbyBjcmVhdGVcbiAqICAgICAgICAgICAgICAgICBhZ2dyZWdhdGUgdGFibGUgYXMgd2VsbC5cbiAqL1xuZnVuY3Rpb24gZGF0YShlbmNvZGluZykge1xuICB2YXIgZGVmID0gW2RhdGEucmF3KGVuY29kaW5nKV07XG5cbiAgdmFyIGFnZ3JlZ2F0ZSA9IGRhdGEuYWdncmVnYXRlKGVuY29kaW5nKTtcbiAgaWYgKGFnZ3JlZ2F0ZSkgZGVmLnB1c2goZGF0YS5hZ2dyZWdhdGUoZW5jb2RpbmcpKTtcblxuICAvLyBUT0RPIGFkZCBcImhhdmluZ1wiIGZpbHRlciBoZXJlXG5cbiAgLy8gYXBwZW5kIG5vbi1wb3NpdGl2ZSBmaWx0ZXIgYXQgdGhlIGVuZCBmb3IgdGhlIGRhdGEgdGFibGVcbiAgZGF0YS5maWx0ZXJOb25Qb3NpdGl2ZShkZWZbZGVmLmxlbmd0aCAtIDFdLCBlbmNvZGluZyk7XG5cbiAgcmV0dXJuIGRlZjtcbn1cblxuZGF0YS5yYXcgPSBmdW5jdGlvbihlbmNvZGluZykge1xuICB2YXIgcmF3ID0ge25hbWU6IFJBV307XG5cbiAgLy8gRGF0YSBzb3VyY2UgKHVybCBvciBpbmxpbmUpXG4gIGlmIChlbmNvZGluZy5oYXNWYWx1ZXMoKSkge1xuICAgIHJhdy52YWx1ZXMgPSBlbmNvZGluZy5kYXRhKCkudmFsdWVzO1xuICB9IGVsc2Uge1xuICAgIHJhdy51cmwgPSBlbmNvZGluZy5kYXRhKCkudXJsO1xuICAgIHJhdy5mb3JtYXQgPSB7dHlwZTogZW5jb2RpbmcuZGF0YSgpLmZvcm1hdFR5cGV9O1xuICB9XG5cbiAgLy8gU2V0IGRhdGEncyBmb3JtYXQucGFyc2UgaWYgbmVlZGVkXG4gIHZhciBwYXJzZSA9IGRhdGEucmF3LmZvcm1hdFBhcnNlKGVuY29kaW5nKTtcbiAgaWYgKHBhcnNlKSB7XG4gICAgcmF3LmZvcm1hdCA9IHJhdy5mb3JtYXQgfHwge307XG4gICAgcmF3LmZvcm1hdC5wYXJzZSA9IHBhcnNlO1xuICB9XG5cbiAgcmF3LnRyYW5zZm9ybSA9IGRhdGEucmF3LnRyYW5zZm9ybShlbmNvZGluZyk7XG4gIHJldHVybiByYXc7XG59O1xuXG5kYXRhLnJhdy5mb3JtYXRQYXJzZSA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gIHZhciBwYXJzZTtcblxuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT0gVCkge1xuICAgICAgcGFyc2UgPSBwYXJzZSB8fCB7fTtcbiAgICAgIHBhcnNlW2ZpZWxkLm5hbWVdID0gJ2RhdGUnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PSBRKSB7XG4gICAgICBpZiAodmxmaWVsZC5pc0NvdW50KGZpZWxkKSkgcmV0dXJuO1xuICAgICAgcGFyc2UgPSBwYXJzZSB8fCB7fTtcbiAgICAgIHBhcnNlW2ZpZWxkLm5hbWVdID0gJ251bWJlcic7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2U7XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlIFZlZ2EgdHJhbnNmb3JtcyBmb3IgdGhlIHJhdyBkYXRhIHRhYmxlLiAgVGhpcyBjYW4gaW5jbHVkZVxuICogdHJhbnNmb3JtcyBmb3IgdGltZSB1bml0LCBiaW5uaW5nIGFuZCBmaWx0ZXJpbmcuXG4gKi9cbmRhdGEucmF3LnRyYW5zZm9ybSA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gIC8vIHRpbWUgYW5kIGJpbiBzaG91bGQgY29tZSBiZWZvcmUgZmlsdGVyIHNvIHdlIGNhbiBmaWx0ZXIgYnkgdGltZSBhbmQgYmluXG4gIHJldHVybiBkYXRhLnJhdy50cmFuc2Zvcm0udGltZShlbmNvZGluZykuY29uY2F0KFxuICAgIGRhdGEucmF3LnRyYW5zZm9ybS5iaW4oZW5jb2RpbmcpLFxuICAgIGRhdGEucmF3LnRyYW5zZm9ybS5maWx0ZXIoZW5jb2RpbmcpXG4gICk7XG59O1xuXG52YXIgQklOQVJZID0ge1xuICAnPic6ICB0cnVlLFxuICAnPj0nOiB0cnVlLFxuICAnPSc6ICB0cnVlLFxuICAnIT0nOiB0cnVlLFxuICAnPCc6ICB0cnVlLFxuICAnPD0nOiB0cnVlXG59O1xuXG5kYXRhLnJhdy50cmFuc2Zvcm0udGltZSA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gIHJldHVybiBlbmNvZGluZy5yZWR1Y2UoZnVuY3Rpb24odHJhbnNmb3JtLCBmaWVsZCwgZW5jVHlwZSkge1xuICAgIGlmIChmaWVsZC50eXBlID09PSBUICYmIGZpZWxkLnRpbWVVbml0KSB7XG4gICAgICB0cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgZmllbGQ6IGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUpLFxuICAgICAgICBleHByOiB0aW1lLmZvcm11bGEoZmllbGQudGltZVVuaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBlbmNvZGluZy5maWVsZFJlZihlbmNUeXBlLCB7bm9mbjogdHJ1ZSwgZDogdHJ1ZX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJhbnNmb3JtO1xuICB9LCBbXSk7XG59O1xuXG5kYXRhLnJhdy50cmFuc2Zvcm0uYmluID0gZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGVuY29kaW5nLnJlZHVjZShmdW5jdGlvbih0cmFuc2Zvcm0sIGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgaWYgKGVuY29kaW5nLmJpbihlbmNUeXBlKSkge1xuICAgICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgICB0eXBlOiAnYmluJyxcbiAgICAgICAgZmllbGQ6IGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUsIHtub2ZuOiB0cnVlfSksXG4gICAgICAgIG91dHB1dDogZW5jb2RpbmcuZmllbGRSZWYoZW5jVHlwZSksXG4gICAgICAgIG1heGJpbnM6IGVuY29kaW5nLmJpbihlbmNUeXBlKS5tYXhiaW5zXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgfSwgW10pO1xufTtcblxuZGF0YS5yYXcudHJhbnNmb3JtLmZpbHRlciA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gIHZhciBmaWx0ZXJzID0gZW5jb2RpbmcuZmlsdGVyKCkucmVkdWNlKGZ1bmN0aW9uKGYsIGZpbHRlcikge1xuICAgIHZhciBjb25kaXRpb24gPSAnJztcbiAgICB2YXIgb3BlcmF0b3IgPSBmaWx0ZXIub3BlcmF0b3I7XG4gICAgdmFyIG9wZXJhbmRzID0gZmlsdGVyLm9wZXJhbmRzO1xuXG4gICAgdmFyIGQgPSAnZC4nICsgKGVuY29kaW5nLl92ZWdhMiA/ICcnIDogJ2RhdGEuJyk7XG5cbiAgICBpZiAoQklOQVJZW29wZXJhdG9yXSkge1xuICAgICAgLy8gZXhwZWN0cyBhIGZpZWxkIGFuZCBhIHZhbHVlXG4gICAgICBpZiAob3BlcmF0b3IgPT09ICc9Jykge1xuICAgICAgICBvcGVyYXRvciA9ICc9PSc7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcDEgPSBvcGVyYW5kc1swXTtcbiAgICAgIHZhciBvcDIgPSBvcGVyYW5kc1sxXTtcbiAgICAgIGNvbmRpdGlvbiA9IGQgKyBvcDEgKyAnICcgKyBvcGVyYXRvciArICcgJyArIG9wMjtcbiAgICB9IGVsc2UgaWYgKG9wZXJhdG9yID09PSAnbm90TnVsbCcpIHtcbiAgICAgIC8vIGV4cGVjdHMgYSBudW1iZXIgb2YgZmllbGRzXG4gICAgICBmb3IgKHZhciBqPTA7IGo8b3BlcmFuZHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgY29uZGl0aW9uICs9IGQgKyBvcGVyYW5kc1tqXSArICchPT1udWxsJztcbiAgICAgICAgaWYgKGogPCBvcGVyYW5kcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgY29uZGl0aW9uICs9ICcgJiYgJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1dGlsLndhcm4oJ1Vuc3VwcG9ydGVkIG9wZXJhdG9yOiAnLCBvcGVyYXRvcik7XG4gICAgICByZXR1cm4gZjtcbiAgICB9XG4gICAgZi5wdXNoKCcoJyArIGNvbmRpdGlvbiArICcpJyk7XG4gICAgcmV0dXJuIGY7XG4gIH0sIFtdKTtcbiAgaWYgKGZpbHRlcnMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG5cbiAgcmV0dXJuIFt7XG4gICAgICB0eXBlOiAnZmlsdGVyJyxcbiAgICAgIHRlc3Q6IGZpbHRlcnMuam9pbignICYmICcpXG4gIH1dO1xufTtcblxuZGF0YS5hZ2dyZWdhdGUgPSBmdW5jdGlvbihlbmNvZGluZykge1xuICB2YXIgZGltcyA9IHt9LCBtZWFzID0ge307XG5cbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuICAgIGlmIChmaWVsZC5hZ2dyZWdhdGUpIHtcbiAgICAgIGlmIChmaWVsZC5hZ2dyZWdhdGUgPT09ICdjb3VudCcpIHtcbiAgICAgICAgbWVhcy5jb3VudCA9IHtvcDogJ2NvdW50JywgZmllbGQ6ICcqJ307XG4gICAgICB9ZWxzZSB7XG4gICAgICAgIG1lYXNbZmllbGQuYWdncmVnYXRlICsgJ3wnICsgZmllbGQubmFtZV0gPSB7XG4gICAgICAgICAgb3A6IGZpZWxkLmFnZ3JlZ2F0ZSxcbiAgICAgICAgICBmaWVsZDogZW5jb2RpbmcuZmllbGRSZWYoZW5jVHlwZSwge25vZm46IHRydWV9KVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkaW1zW2ZpZWxkLm5hbWVdID0gZW5jb2RpbmcuZmllbGRSZWYoZW5jVHlwZSk7XG4gICAgfVxuICB9KTtcblxuICBkaW1zID0gdXRpbC52YWxzKGRpbXMpO1xuICBtZWFzID0gdXRpbC52YWxzKG1lYXMpO1xuXG4gIGlmIChtZWFzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogQUdHUkVHQVRFLFxuICAgICAgc291cmNlOiBSQVcsXG4gICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBncm91cGJ5OiBkaW1zLFxuICAgICAgICBmaWVsZHM6IG1lYXNcbiAgICAgIH1dXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxuZGF0YS5maWx0ZXJOb25Qb3NpdGl2ZSA9IGZ1bmN0aW9uKGRhdGFUYWJsZSwgZW5jb2RpbmcpIHtcbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuICAgIGlmIChlbmNvZGluZy5zY2FsZShlbmNUeXBlKS50eXBlID09PSAnbG9nJykge1xuICAgICAgZGF0YVRhYmxlLnRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICAgIHRlc3Q6IGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUsIHtkOiAxfSkgKyAnID4gMCdcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgYXhpcyA9IHJlcXVpcmUoJy4vYXhpcycpLFxuICBzY2FsZSA9IHJlcXVpcmUoJy4vc2NhbGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWNldGluZztcblxuZnVuY3Rpb24gZ3JvdXBkZWYobmFtZSwgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcbiAgcmV0dXJuIHtcbiAgICBfbmFtZTogbmFtZSB8fCB1bmRlZmluZWQsXG4gICAgdHlwZTogJ2dyb3VwJyxcbiAgICBmcm9tOiBvcHQuZnJvbSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBlbnRlcjoge1xuICAgICAgICB4OiBvcHQueCB8fCB1bmRlZmluZWQsXG4gICAgICAgIHk6IG9wdC55IHx8IHVuZGVmaW5lZCxcbiAgICAgICAgd2lkdGg6IG9wdC53aWR0aCB8fCB7Z3JvdXA6ICd3aWR0aCd9LFxuICAgICAgICBoZWlnaHQ6IG9wdC5oZWlnaHQgfHwge2dyb3VwOiAnaGVpZ2h0J31cbiAgICAgIH1cbiAgICB9LFxuICAgIHNjYWxlczogb3B0LnNjYWxlcyB8fCB1bmRlZmluZWQsXG4gICAgYXhlczogb3B0LmF4ZXMgfHwgdW5kZWZpbmVkLFxuICAgIG1hcmtzOiBvcHQubWFya3MgfHwgW11cbiAgfTtcbn1cblxuZnVuY3Rpb24gZmFjZXRpbmcoZ3JvdXAsIGVuY29kaW5nLCBsYXlvdXQsIHNwZWMsIHNpbmdsZVNjYWxlTmFtZXMsIHN0YWNrLCBzdGF0cykge1xuICB2YXIgZW50ZXIgPSBncm91cC5wcm9wZXJ0aWVzLmVudGVyO1xuICB2YXIgZmFjZXRLZXlzID0gW10sIGNlbGxBeGVzID0gW10sIGZyb20sIGF4ZXNHcnA7XG5cbiAgdmFyIGhhc1JvdyA9IGVuY29kaW5nLmhhcyhST1cpLCBoYXNDb2wgPSBlbmNvZGluZy5oYXMoQ09MKTtcblxuICBlbnRlci5maWxsID0ge3ZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2NlbGxCYWNrZ3JvdW5kQ29sb3InKX07XG5cbiAgLy9tb3ZlIFwiZnJvbVwiIHRvIGNlbGwgbGV2ZWwgYW5kIGFkZCBmYWNldCB0cmFuc2Zvcm1cbiAgZ3JvdXAuZnJvbSA9IHtkYXRhOiBncm91cC5tYXJrc1swXS5mcm9tLmRhdGF9O1xuXG4gIC8vIEhhY2ssIHRoaXMgbmVlZHMgdG8gYmUgcmVmYWN0b3JlZFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGdyb3VwLm1hcmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG1hcmsgPSBncm91cC5tYXJrc1tpXTtcbiAgICBpZiAobWFyay5mcm9tLnRyYW5zZm9ybSkge1xuICAgICAgZGVsZXRlIG1hcmsuZnJvbS5kYXRhOyAvL25lZWQgdG8ga2VlcCB0cmFuc2Zvcm0gZm9yIHN1YmZhY2V0dGluZyBjYXNlXG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBtYXJrLmZyb207XG4gICAgfVxuICB9XG5cbiAgaWYgKGhhc1Jvdykge1xuICAgIGlmICghZW5jb2RpbmcuaXNEaW1lbnNpb24oUk9XKSkge1xuICAgICAgdXRpbC5lcnJvcignUm93IGVuY29kaW5nIHNob3VsZCBiZSBvcmRpbmFsLicpO1xuICAgIH1cbiAgICBlbnRlci55ID0ge3NjYWxlOiBST1csIGZpZWxkOiAna2V5cy4nICsgZmFjZXRLZXlzLmxlbmd0aH07XG4gICAgZW50ZXIuaGVpZ2h0ID0geyd2YWx1ZSc6IGxheW91dC5jZWxsSGVpZ2h0fTsgLy8gSEFDS1xuXG4gICAgZmFjZXRLZXlzLnB1c2goZW5jb2RpbmcuZmllbGRSZWYoUk9XKSk7XG5cbiAgICBpZiAoaGFzQ29sKSB7XG4gICAgICBmcm9tID0gdXRpbC5kdXBsaWNhdGUoZ3JvdXAuZnJvbSk7XG4gICAgICBmcm9tLnRyYW5zZm9ybSA9IGZyb20udHJhbnNmb3JtIHx8IFtdO1xuICAgICAgZnJvbS50cmFuc2Zvcm0udW5zaGlmdCh7dHlwZTogJ2ZhY2V0Jywga2V5czogW2VuY29kaW5nLmZpZWxkUmVmKENPTCldfSk7XG4gICAgfVxuXG4gICAgYXhlc0dycCA9IGdyb3VwZGVmKCd4LWF4ZXMnLCB7XG4gICAgICAgIGF4ZXM6IGVuY29kaW5nLmhhcyhYKSA/IFtheGlzLmRlZihYLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cyldIDogdW5kZWZpbmVkLFxuICAgICAgICB4OiBoYXNDb2wgPyB7c2NhbGU6IENPTCwgZmllbGQ6ICdrZXlzLjAnfSA6IHt2YWx1ZTogMH0sXG4gICAgICAgIHdpZHRoOiBoYXNDb2wgJiYgeyd2YWx1ZSc6IGxheW91dC5jZWxsV2lkdGh9LCAvL0hBQ0s/XG4gICAgICAgIGZyb206IGZyb21cbiAgICAgIH0pO1xuXG4gICAgc3BlYy5tYXJrcy51bnNoaWZ0KGF4ZXNHcnApOyAvLyBuZWVkIHRvIHByZXBlbmQgc28gaXQgYXBwZWFycyB1bmRlciB0aGUgcGxvdHNcbiAgICAoc3BlYy5heGVzID0gc3BlYy5heGVzIHx8IFtdKTtcbiAgICBzcGVjLmF4ZXMucHVzaChheGlzLmRlZihST1csIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSk7XG4gIH0gZWxzZSB7IC8vIGRvZXNuJ3QgaGF2ZSByb3dcbiAgICBpZiAoZW5jb2RpbmcuaGFzKFgpKSB7XG4gICAgICAvL2tlZXAgeCBheGlzIGluIHRoZSBjZWxsXG4gICAgICBjZWxsQXhlcy5wdXNoKGF4aXMuZGVmKFgsIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGhhc0NvbCkge1xuICAgIGlmICghZW5jb2RpbmcuaXNEaW1lbnNpb24oQ09MKSkge1xuICAgICAgdXRpbC5lcnJvcignQ29sIGVuY29kaW5nIHNob3VsZCBiZSBvcmRpbmFsLicpO1xuICAgIH1cbiAgICBlbnRlci54ID0ge3NjYWxlOiBDT0wsIGZpZWxkOiAna2V5cy4nICsgZmFjZXRLZXlzLmxlbmd0aH07XG4gICAgZW50ZXIud2lkdGggPSB7J3ZhbHVlJzogbGF5b3V0LmNlbGxXaWR0aH07IC8vIEhBQ0tcblxuICAgIGZhY2V0S2V5cy5wdXNoKGVuY29kaW5nLmZpZWxkUmVmKENPTCkpO1xuXG4gICAgaWYgKGhhc1Jvdykge1xuICAgICAgZnJvbSA9IHV0aWwuZHVwbGljYXRlKGdyb3VwLmZyb20pO1xuICAgICAgZnJvbS50cmFuc2Zvcm0gPSBmcm9tLnRyYW5zZm9ybSB8fCBbXTtcbiAgICAgIGZyb20udHJhbnNmb3JtLnVuc2hpZnQoe3R5cGU6ICdmYWNldCcsIGtleXM6IFtlbmNvZGluZy5maWVsZFJlZihST1cpXX0pO1xuICAgIH1cblxuICAgIGF4ZXNHcnAgPSBncm91cGRlZigneS1heGVzJywge1xuICAgICAgYXhlczogZW5jb2RpbmcuaGFzKFkpID8gW2F4aXMuZGVmKFksIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKV0gOiB1bmRlZmluZWQsXG4gICAgICB5OiBoYXNSb3cgJiYge3NjYWxlOiBST1csIGZpZWxkOiAna2V5cy4wJ30sXG4gICAgICB4OiBoYXNSb3cgJiYge3ZhbHVlOiAwfSxcbiAgICAgIGhlaWdodDogaGFzUm93ICYmIHsndmFsdWUnOiBsYXlvdXQuY2VsbEhlaWdodH0sIC8vSEFDSz9cbiAgICAgIGZyb206IGZyb21cbiAgICB9KTtcblxuICAgIHNwZWMubWFya3MudW5zaGlmdChheGVzR3JwKTsgLy8gbmVlZCB0byBwcmVwZW5kIHNvIGl0IGFwcGVhcnMgdW5kZXIgdGhlIHBsb3RzXG4gICAgKHNwZWMuYXhlcyA9IHNwZWMuYXhlcyB8fCBbXSk7XG4gICAgc3BlYy5heGVzLnB1c2goYXhpcy5kZWYoQ09MLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykpO1xuICB9IGVsc2UgeyAvLyBkb2Vzbid0IGhhdmUgY29sXG4gICAgaWYgKGVuY29kaW5nLmhhcyhZKSkge1xuICAgICAgY2VsbEF4ZXMucHVzaChheGlzLmRlZihZLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGFzc3VtaW5nIGVxdWFsIGNlbGxXaWR0aCBoZXJlXG4gIC8vIFRPRE86IHN1cHBvcnQgaGV0ZXJvZ2Vub3VzIGNlbGxXaWR0aCAobWF5YmUgYnkgdXNpbmcgbXVsdGlwbGUgc2NhbGVzPylcbiAgc3BlYy5zY2FsZXMgPSAoc3BlYy5zY2FsZXMgfHwgW10pLmNvbmNhdChzY2FsZS5kZWZzKFxuICAgIHNjYWxlLm5hbWVzKGVudGVyKS5jb25jYXQoc2luZ2xlU2NhbGVOYW1lcyksXG4gICAgZW5jb2RpbmcsXG4gICAgbGF5b3V0LFxuICAgIHN0YXRzLFxuICAgIHtzdGFjazogc3RhY2ssIGZhY2V0OiB0cnVlfVxuICApKTsgLy8gcm93L2NvbCBzY2FsZXMgKyBjZWxsIHNjYWxlc1xuXG4gIGlmIChjZWxsQXhlcy5sZW5ndGggPiAwKSB7XG4gICAgZ3JvdXAuYXhlcyA9IGNlbGxBeGVzO1xuICB9XG5cbiAgLy8gYWRkIGZhY2V0IHRyYW5zZm9ybVxuICB2YXIgdHJhbnMgPSAoZ3JvdXAuZnJvbS50cmFuc2Zvcm0gfHwgKGdyb3VwLmZyb20udHJhbnNmb3JtID0gW10pKTtcbiAgdHJhbnMudW5zaGlmdCh7dHlwZTogJ2ZhY2V0Jywga2V5czogZmFjZXRLZXlzfSk7XG5cbiAgcmV0dXJuIHNwZWM7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHNldHRlciA9IHV0aWwuc2V0dGVyLFxuICB0aW1lID0gcmVxdWlyZSgnLi90aW1lJyksXG4gIGQzX2Zvcm1hdCA9IHJlcXVpcmUoJ2QzLWZvcm1hdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZsbGF5b3V0O1xuXG5mdW5jdGlvbiB2bGxheW91dChlbmNvZGluZywgc3RhdHMpIHtcbiAgdmFyIGxheW91dCA9IGJveChlbmNvZGluZywgc3RhdHMpO1xuICBsYXlvdXQgPSBvZmZzZXQoZW5jb2RpbmcsIHN0YXRzLCBsYXlvdXQpO1xuICByZXR1cm4gbGF5b3V0O1xufVxuXG4vKlxuICBIQUNLIHRvIHNldCBjaGFydCBzaXplXG4gIE5PVEU6IHRoaXMgZmFpbHMgZm9yIHBsb3RzIGRyaXZlbiBieSBkZXJpdmVkIHZhbHVlcyAoZS5nLiwgYWdncmVnYXRlcylcbiAgT25lIHNvbHV0aW9uIGlzIHRvIHVwZGF0ZSBWZWdhIHRvIHN1cHBvcnQgYXV0by1zaXppbmdcbiAgSW4gdGhlIG1lYW50aW1lLCBhdXRvLXBhZGRpbmcgKG1vc3RseSkgZG9lcyB0aGUgdHJpY2tcbiAqL1xuZnVuY3Rpb24gYm94KGVuY29kaW5nLCBzdGF0cykge1xuICB2YXIgaGFzUm93ID0gZW5jb2RpbmcuaGFzKFJPVyksXG4gICAgICBoYXNDb2wgPSBlbmNvZGluZy5oYXMoQ09MKSxcbiAgICAgIGhhc1ggPSBlbmNvZGluZy5oYXMoWCksXG4gICAgICBoYXNZID0gZW5jb2RpbmcuaGFzKFkpLFxuICAgICAgbWFya3R5cGUgPSBlbmNvZGluZy5tYXJrdHlwZSgpO1xuXG4gIC8vIEZJWE1FL0hBQ0sgd2UgbmVlZCB0byB0YWtlIGZpbHRlciBpbnRvIGFjY291bnRcbiAgdmFyIHhDYXJkaW5hbGl0eSA9IGhhc1ggJiYgZW5jb2RpbmcuaXNEaW1lbnNpb24oWCkgPyBlbmNvZGluZy5jYXJkaW5hbGl0eShYLCBzdGF0cykgOiAxLFxuICAgIHlDYXJkaW5hbGl0eSA9IGhhc1kgJiYgZW5jb2RpbmcuaXNEaW1lbnNpb24oWSkgPyBlbmNvZGluZy5jYXJkaW5hbGl0eShZLCBzdGF0cykgOiAxO1xuXG4gIHZhciB1c2VTbWFsbEJhbmQgPSB4Q2FyZGluYWxpdHkgPiBlbmNvZGluZy5jb25maWcoJ2xhcmdlQmFuZE1heENhcmRpbmFsaXR5JykgfHxcbiAgICB5Q2FyZGluYWxpdHkgPiBlbmNvZGluZy5jb25maWcoJ2xhcmdlQmFuZE1heENhcmRpbmFsaXR5Jyk7XG5cbiAgdmFyIGNlbGxXaWR0aCwgY2VsbEhlaWdodCwgY2VsbFBhZGRpbmcgPSBlbmNvZGluZy5jb25maWcoJ2NlbGxQYWRkaW5nJyk7XG5cbiAgLy8gc2V0IGNlbGxXaWR0aFxuICBpZiAoaGFzWCkge1xuICAgIGlmIChlbmNvZGluZy5pc09yZGluYWxTY2FsZShYKSkge1xuICAgICAgLy8gZm9yIG9yZGluYWwsIGhhc0NvbCBvciBub3QgZG9lc24ndCBtYXR0ZXIgLS0gd2Ugc2NhbGUgYmFzZWQgb24gY2FyZGluYWxpdHlcbiAgICAgIGNlbGxXaWR0aCA9ICh4Q2FyZGluYWxpdHkgKyBlbmNvZGluZy5maWVsZChYKS5iYW5kLnBhZGRpbmcpICogZW5jb2RpbmcuYmFuZFNpemUoWCwgdXNlU21hbGxCYW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VsbFdpZHRoID0gaGFzQ29sIHx8IGhhc1JvdyA/IGVuY29kaW5nLmZpZWxkKENPTCkud2lkdGggOiAgZW5jb2RpbmcuY29uZmlnKCdzaW5nbGVXaWR0aCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAobWFya3R5cGUgPT09IFRFWFQpIHtcbiAgICAgIGNlbGxXaWR0aCA9IGVuY29kaW5nLmNvbmZpZygndGV4dENlbGxXaWR0aCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjZWxsV2lkdGggPSBlbmNvZGluZy5iYW5kU2l6ZShYKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZXQgY2VsbEhlaWdodFxuICBpZiAoaGFzWSkge1xuICAgIGlmIChlbmNvZGluZy5pc09yZGluYWxTY2FsZShZKSkge1xuICAgICAgLy8gZm9yIG9yZGluYWwsIGhhc0NvbCBvciBub3QgZG9lc24ndCBtYXR0ZXIgLS0gd2Ugc2NhbGUgYmFzZWQgb24gY2FyZGluYWxpdHlcbiAgICAgIGNlbGxIZWlnaHQgPSAoeUNhcmRpbmFsaXR5ICsgZW5jb2RpbmcuZmllbGQoWSkuYmFuZC5wYWRkaW5nKSAqIGVuY29kaW5nLmJhbmRTaXplKFksIHVzZVNtYWxsQmFuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNlbGxIZWlnaHQgPSBoYXNDb2wgfHwgaGFzUm93ID8gZW5jb2RpbmcuZmllbGQoUk9XKS5oZWlnaHQgOiAgZW5jb2RpbmcuY29uZmlnKCdzaW5nbGVIZWlnaHQnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY2VsbEhlaWdodCA9IGVuY29kaW5nLmJhbmRTaXplKFkpO1xuICB9XG5cbiAgLy8gQ2VsbCBiYW5kcyB1c2UgcmFuZ2VCYW5kcygpLiBUaGVyZSBhcmUgbi0xIHBhZGRpbmcuICBPdXRlcnBhZGRpbmcgPSAwIGZvciBjZWxsc1xuXG4gIHZhciB3aWR0aCA9IGNlbGxXaWR0aCwgaGVpZ2h0ID0gY2VsbEhlaWdodDtcbiAgaWYgKGhhc0NvbCkge1xuICAgIHZhciBjb2xDYXJkaW5hbGl0eSA9IGVuY29kaW5nLmNhcmRpbmFsaXR5KENPTCwgc3RhdHMpO1xuICAgIHdpZHRoID0gY2VsbFdpZHRoICogKCgxICsgY2VsbFBhZGRpbmcpICogKGNvbENhcmRpbmFsaXR5IC0gMSkgKyAxKTtcbiAgfVxuICBpZiAoaGFzUm93KSB7XG4gICAgdmFyIHJvd0NhcmRpbmFsaXR5ID0gIGVuY29kaW5nLmNhcmRpbmFsaXR5KFJPVywgc3RhdHMpO1xuICAgIGhlaWdodCA9IGNlbGxIZWlnaHQgKiAoKDEgKyBjZWxsUGFkZGluZykgKiAocm93Q2FyZGluYWxpdHkgLSAxKSArIDEpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSB3aG9sZSBjZWxsXG4gICAgY2VsbFdpZHRoOiBjZWxsV2lkdGgsXG4gICAgY2VsbEhlaWdodDogY2VsbEhlaWdodCxcbiAgICBjZWxsUGFkZGluZzogY2VsbFBhZGRpbmcsXG4gICAgLy8gd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgY2hhcnRcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgLy8gaW5mb3JtYXRpb24gYWJvdXQgeCBhbmQgeSwgc3VjaCBhcyBiYW5kIHNpemVcbiAgICB4OiB7dXNlU21hbGxCYW5kOiB1c2VTbWFsbEJhbmR9LFxuICAgIHk6IHt1c2VTbWFsbEJhbmQ6IHVzZVNtYWxsQmFuZH1cbiAgfTtcbn1cblxuXG4vLyBGSVhNRSBmaWVsZFN0YXRzLm1heCBpc24ndCBhbHdheXMgdGhlIGxvbmdlc3RcbmZ1bmN0aW9uIGdldE1heE51bWJlckxlbmd0aChlbmNvZGluZywgZXQsIGZpZWxkU3RhdHMpIHtcbiAgdmFyIGZvcm1hdCA9IGVuY29kaW5nLm51bWJlckZvcm1hdChldCwgZmllbGRTdGF0cyk7XG5cbiAgcmV0dXJuIGQzX2Zvcm1hdC5mb3JtYXQoZm9ybWF0KShmaWVsZFN0YXRzLm1heCkubGVuZ3RoO1xufVxuXG4vLyBUT0RPKCM2MDApIHJldmlzZSB0aGlzXG5mdW5jdGlvbiBnZXRNYXhMZW5ndGgoZW5jb2RpbmcsIHN0YXRzLCBldCkge1xuICB2YXIgZmllbGQgPSBlbmNvZGluZy5maWVsZChldCksXG4gICAgZmllbGRTdGF0cyA9IHN0YXRzW2ZpZWxkLm5hbWVdO1xuXG4gIGlmIChmaWVsZC5iaW4pIHtcbiAgICAvLyBUT0RPIG9uY2UgYmluIHN1cHBvcnQgcmFuZ2UsIG5lZWQgdG8gdXBkYXRlIHRoaXNcbiAgICByZXR1cm4gZ2V0TWF4TnVtYmVyTGVuZ3RoKGVuY29kaW5nLCBldCwgZmllbGRTdGF0cyk7XG4gIH0gaWYgKGVuY29kaW5nLmlzVHlwZShldCwgUSkpIHtcbiAgICByZXR1cm4gZ2V0TWF4TnVtYmVyTGVuZ3RoKGVuY29kaW5nLCBldCwgZmllbGRTdGF0cyk7XG4gIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXNUeXBlKGV0LCBUKSkge1xuICAgIHJldHVybiB0aW1lLm1heExlbmd0aChlbmNvZGluZy5maWVsZChldCkudGltZVVuaXQsIGVuY29kaW5nKTtcbiAgfSBlbHNlIGlmIChlbmNvZGluZy5pc1R5cGVzKGV0LCBbTiwgT10pKSB7XG4gICAgaWYoZmllbGRTdGF0cy50eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIGdldE1heE51bWJlckxlbmd0aChlbmNvZGluZywgZXQsIGZpZWxkU3RhdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTWF0aC5taW4oZmllbGRTdGF0cy5tYXgsIGVuY29kaW5nLmF4aXMoZXQpLm1heExhYmVsTGVuZ3RoIHx8IEluZmluaXR5KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gb2Zmc2V0KGVuY29kaW5nLCBzdGF0cywgbGF5b3V0KSB7XG4gIFtYLCBZXS5mb3JFYWNoKGZ1bmN0aW9uIChldCkge1xuICAgIC8vIFRPRE8oa2FuaXR3KTogSnVsIDE5LCAyMDE1IC0gY3JlYXRlIGEgc2V0IG9mIHZpc3VhbCB0ZXN0IGZvciBleHRyYU9mZnNldFxuICAgIHZhciBleHRyYU9mZnNldCA9IGV0ID09PSBYID8gMjAgOiAyMixcbiAgICAgIG1heExlbmd0aDtcbiAgICBpZiAoZW5jb2RpbmcuaXNEaW1lbnNpb24oZXQpIHx8IGVuY29kaW5nLmlzVHlwZShldCwgVCkpIHtcbiAgICAgIG1heExlbmd0aCA9IGdldE1heExlbmd0aChlbmNvZGluZywgc3RhdHMsIGV0KTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgLy8gVE9ETyBvbmNlIHdlIGhhdmUgIzUxMiAoYWxsb3cgdXNpbmcgaW5mZXJyZWQgdHlwZSlcbiAgICAgIC8vIE5lZWQgdG8gYWRqdXN0IGNvbmRpdGlvbiBoZXJlLlxuICAgICAgZW5jb2RpbmcuaXNUeXBlKGV0LCBRKSB8fFxuICAgICAgZW5jb2RpbmcuYWdncmVnYXRlKGV0KSA9PT0gJ2NvdW50J1xuICAgICkge1xuICAgICAgaWYgKFxuICAgICAgICBldD09PVlcbiAgICAgICAgLy8gfHwgKGV0PT09WCAmJiBmYWxzZSlcbiAgICAgICAgLy8gRklYTUUgZGV0ZXJtaW5lIHdoZW4gWCB3b3VsZCByb3RhdGUsIGJ1dCBzaG91bGQgbW92ZSB0aGlzIHRvIGF4aXMuanMgZmlyc3QgIzUwNlxuICAgICAgKSB7XG4gICAgICAgIG1heExlbmd0aCA9IGdldE1heExlbmd0aChlbmNvZGluZywgc3RhdHMsIGV0KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbm90aGluZ1xuICAgIH1cblxuICAgIGlmIChtYXhMZW5ndGgpIHtcbiAgICAgIHNldHRlcihsYXlvdXQsW2V0LCAnYXhpc1RpdGxlT2Zmc2V0J10sIGVuY29kaW5nLmNvbmZpZygnY2hhcmFjdGVyV2lkdGgnKSAqICBtYXhMZW5ndGggKyBleHRyYU9mZnNldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlmIG5vIG1heCBsZW5ndGggKG5vIHJvdGF0aW9uIGNhc2UpLCB1c2UgbWF4TGVuZ3RoID0gM1xuICAgICAgc2V0dGVyKGxheW91dCxbZXQsICdheGlzVGl0bGVPZmZzZXQnXSwgZW5jb2RpbmcuY29uZmlnKCdjaGFyYWN0ZXJXaWR0aCcpICogMyArIGV4dHJhT2Zmc2V0KTtcbiAgICB9XG5cbiAgfSk7XG4gIHJldHVybiBsYXlvdXQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgc2V0dGVyID0gdXRpbC5zZXR0ZXIsXG4gIGdldHRlciA9IHV0aWwuZ2V0dGVyO1xuXG52YXIgbGVnZW5kID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxubGVnZW5kLmRlZnMgPSBmdW5jdGlvbihlbmNvZGluZywgc3R5bGUpIHtcbiAgdmFyIGRlZnMgPSBbXTtcblxuICBpZiAoZW5jb2RpbmcuaGFzKENPTE9SKSAmJiBlbmNvZGluZy5maWVsZChDT0xPUikubGVnZW5kKSB7XG4gICAgZGVmcy5wdXNoKGxlZ2VuZC5kZWYoQ09MT1IsIGVuY29kaW5nLCB7XG4gICAgICBmaWxsOiBDT0xPUixcbiAgICAgIG9yaWVudDogJ3JpZ2h0J1xuICAgIH0sIHN0eWxlKSk7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuaGFzKFNJWkUpICYmIGVuY29kaW5nLmZpZWxkKFNJWkUpLmxlZ2VuZCkge1xuICAgIGRlZnMucHVzaChsZWdlbmQuZGVmKFNJWkUsIGVuY29kaW5nLCB7XG4gICAgICBzaXplOiBTSVpFLFxuICAgICAgb3JpZW50OiBkZWZzLmxlbmd0aCA9PT0gMSA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICB9LCBzdHlsZSkpO1xuICB9XG5cbiAgaWYgKGVuY29kaW5nLmhhcyhTSEFQRSkgJiYgZW5jb2RpbmcuZmllbGQoU0hBUEUpLmxlZ2VuZCkge1xuICAgIGlmIChkZWZzLmxlbmd0aCA9PT0gMikge1xuICAgICAgY29uc29sZS5lcnJvcignVmVnYS1saXRlIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIHR3byBsZWdlbmRzJyk7XG4gICAgfVxuICAgIGRlZnMucHVzaChsZWdlbmQuZGVmKFNIQVBFLCBlbmNvZGluZywge1xuICAgICAgc2hhcGU6IFNIQVBFLFxuICAgICAgb3JpZW50OiBkZWZzLmxlbmd0aCA9PT0gMSA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICB9LCBzdHlsZSkpO1xuICB9XG4gIHJldHVybiBkZWZzO1xufTtcblxubGVnZW5kLmRlZiA9IGZ1bmN0aW9uKG5hbWUsIGVuY29kaW5nLCBkZWYsIHN0eWxlKSB7XG4gIHZhciB0aW1lVW5pdCA9IGVuY29kaW5nLmZpZWxkKG5hbWUpLnRpbWVVbml0O1xuXG4gIGRlZi50aXRsZSA9IGxlZ2VuZC50aXRsZShuYW1lLCBlbmNvZGluZyk7XG4gIGRlZiA9IGxlZ2VuZC5zdHlsZShuYW1lLCBlbmNvZGluZywgZGVmLCBzdHlsZSk7XG5cbiAgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSAmJlxuICAgIHRpbWVVbml0ICYmXG4gICAgdGltZS5oYXNTY2FsZSh0aW1lVW5pdClcbiAgKSB7XG4gICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywgJ2xhYmVscycsICd0ZXh0JywgJ3NjYWxlJ10sICd0aW1lLScrIHRpbWVVbml0KTtcbiAgfVxuXG4gIHJldHVybiBkZWY7XG59O1xuXG5sZWdlbmQuc3R5bGUgPSBmdW5jdGlvbihuYW1lLCBlLCBkZWYsIHN0eWxlKSB7XG4gIHZhciBzeW1ib2xzID0gZ2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywgJ3N5bWJvbHMnXSksXG4gICAgbWFya3R5cGUgPSBlLm1hcmt0eXBlKCk7XG5cbiAgc3dpdGNoIChtYXJrdHlwZSkge1xuICAgIGNhc2UgJ2Jhcic6XG4gICAgY2FzZSAndGljayc6XG4gICAgY2FzZSAndGV4dCc6XG4gICAgICBzeW1ib2xzLnN0cm9rZSA9IHt2YWx1ZTogJ3RyYW5zcGFyZW50J307XG4gICAgICBzeW1ib2xzLnNoYXBlID0ge3ZhbHVlOiAnc3F1YXJlJ307XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2NpcmNsZSc6XG4gICAgY2FzZSAnc3F1YXJlJzpcbiAgICAgIHN5bWJvbHMuc2hhcGUgPSB7dmFsdWU6IG1hcmt0eXBlfTtcbiAgICAgIC8qIGZhbGwgdGhyb3VnaCAqL1xuICAgIGNhc2UgJ3BvaW50JzpcbiAgICAgIC8vIGZpbGwgb3Igc3Ryb2tlXG4gICAgICBpZiAoZS5maWVsZChTSEFQRSkuZmlsbGVkKSB7XG4gICAgICAgIGlmIChlLmhhcyhDT0xPUikgJiYgbmFtZSA9PT0gQ09MT1IpIHtcbiAgICAgICAgICBzeW1ib2xzLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogJ2RhdGEnfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzeW1ib2xzLmZpbGwgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgICAgICAgfVxuICAgICAgICBzeW1ib2xzLnN0cm9rZSA9IHt2YWx1ZTogJ3RyYW5zcGFyZW50J307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZS5oYXMoQ09MT1IpICYmIG5hbWUgPT09IENPTE9SKSB7XG4gICAgICAgICAgc3ltYm9scy5zdHJva2UgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogJ2RhdGEnfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzeW1ib2xzLnN0cm9rZSA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICAgICAgICB9XG4gICAgICAgIHN5bWJvbHMuZmlsbCA9IHt2YWx1ZTogJ3RyYW5zcGFyZW50J307XG4gICAgICAgIHN5bWJvbHMuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IGUuY29uZmlnKCdzdHJva2VXaWR0aCcpfTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbGluZSc6XG4gICAgY2FzZSAnYXJlYSc6XG4gICAgICAvLyBUT0RPIHVzZSBzaGFwZSBoZXJlIGFmdGVyIGltcGxlbWVudGluZyAjNTA4XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBvcGFjaXR5ID0gZS5maWVsZChDT0xPUikub3BhY2l0eSB8fCBzdHlsZS5vcGFjaXR5O1xuICBpZiAob3BhY2l0eSkge1xuICAgIHN5bWJvbHMub3BhY2l0eSA9IHt2YWx1ZTogb3BhY2l0eX07XG4gIH1cbiAgcmV0dXJuIGRlZjtcbn07XG5cbmxlZ2VuZC50aXRsZSA9IGZ1bmN0aW9uKG5hbWUsIGVuY29kaW5nKSB7XG4gIHZhciBsZWcgPSBlbmNvZGluZy5maWVsZChuYW1lKS5sZWdlbmQ7XG5cbiAgaWYgKGxlZy50aXRsZSkgcmV0dXJuIGxlZy50aXRsZTtcblxuICByZXR1cm4gZW5jb2RpbmcuZmllbGRUaXRsZShuYW1lKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIG1hcmtzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxubWFya3MuZGVmID0gZnVuY3Rpb24oZW5jb2RpbmcsIGxheW91dCwgc3R5bGUsIHN0YXRzKSB7XG5cbiAgdmFyIGRlZnMgPSBbXSxcbiAgICBtYXJrID0gbWFya3NbZW5jb2RpbmcubWFya3R5cGUoKV0sXG4gICAgZnJvbSA9IGVuY29kaW5nLmRhdGFUYWJsZSgpO1xuXG4gIC8vIHRvIGFkZCBhIGJhY2tncm91bmQgdG8gdGV4dCwgd2UgbmVlZCB0byBhZGQgaXQgYmVmb3JlIHRoZSB0ZXh0XG4gIGlmIChlbmNvZGluZy5tYXJrdHlwZSgpID09PSBURVhUICYmIGVuY29kaW5nLmhhcyhDT0xPUikpIHtcbiAgICB2YXIgYmcgPSB7XG4gICAgICB4OiB7dmFsdWU6IDB9LFxuICAgICAgeToge3ZhbHVlOiAwfSxcbiAgICAgIHgyOiB7dmFsdWU6IGxheW91dC5jZWxsV2lkdGh9LFxuICAgICAgeTI6IHt2YWx1ZTogbGF5b3V0LmNlbGxIZWlnaHR9LFxuICAgICAgZmlsbDoge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGVuY29kaW5nLmZpZWxkUmVmKENPTE9SKX1cbiAgICB9O1xuICAgIGRlZnMucHVzaCh7XG4gICAgICB0eXBlOiAncmVjdCcsXG4gICAgICBmcm9tOiB7ZGF0YTogZnJvbX0sXG4gICAgICBwcm9wZXJ0aWVzOiB7ZW50ZXI6IGJnLCB1cGRhdGU6IGJnfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gYWRkIHRoZSBtYXJrIGRlZiBmb3IgdGhlIG1haW4gdGhpbmdcbiAgdmFyIHAgPSBtYXJrLnByb3AoZW5jb2RpbmcsIGxheW91dCwgc3R5bGUsIHN0YXRzKTtcbiAgZGVmcy5wdXNoKHtcbiAgICB0eXBlOiBtYXJrLnR5cGUsXG4gICAgZnJvbToge2RhdGE6IGZyb219LFxuICAgIHByb3BlcnRpZXM6IHtlbnRlcjogcCwgdXBkYXRlOiBwfVxuICB9KTtcblxuICByZXR1cm4gZGVmcztcbn07XG5cbm1hcmtzLmJhciA9IHtcbiAgdHlwZTogJ3JlY3QnLFxuICBzdGFjazogdHJ1ZSxcbiAgcHJvcDogYmFyX3Byb3BzLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBzaXplOiAxLCBjb2xvcjogMX1cbn07XG5cbm1hcmtzLmxpbmUgPSB7XG4gIHR5cGU6ICdsaW5lJyxcbiAgbGluZTogdHJ1ZSxcbiAgcHJvcDogbGluZV9wcm9wcyxcbiAgcmVxdWlyZWRFbmNvZGluZzogWyd4JywgJ3knXSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgY29sb3I6IDEsIGRldGFpbDoxfVxufTtcblxubWFya3MuYXJlYSA9IHtcbiAgdHlwZTogJ2FyZWEnLFxuICBzdGFjazogdHJ1ZSxcbiAgbGluZTogdHJ1ZSxcbiAgcmVxdWlyZWRFbmNvZGluZzogWyd4JywgJ3knXSxcbiAgcHJvcDogYXJlYV9wcm9wcyxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgY29sb3I6IDF9XG59O1xuXG5tYXJrcy50aWNrID0ge1xuICB0eXBlOiAncmVjdCcsXG4gIHByb3A6IHRpY2tfcHJvcHMsXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OiAxLCBjb2w6IDEsIHg6IDEsIHk6IDEsIGNvbG9yOiAxLCBkZXRhaWw6IDF9XG59O1xuXG5tYXJrcy5jaXJjbGUgPSB7XG4gIHR5cGU6ICdzeW1ib2wnLFxuICBwcm9wOiBmaWxsZWRfcG9pbnRfcHJvcHMoJ2NpcmNsZScpLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBzaXplOiAxLCBjb2xvcjogMSwgZGV0YWlsOiAxfVxufTtcblxubWFya3Muc3F1YXJlID0ge1xuICB0eXBlOiAnc3ltYm9sJyxcbiAgcHJvcDogZmlsbGVkX3BvaW50X3Byb3BzKCdzcXVhcmUnKSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IG1hcmtzLmNpcmNsZS5zdXBwb3J0ZWRFbmNvZGluZ1xufTtcblxubWFya3MucG9pbnQgPSB7XG4gIHR5cGU6ICdzeW1ib2wnLFxuICBwcm9wOiBwb2ludF9wcm9wcyxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgc2l6ZTogMSwgY29sb3I6IDEsIHNoYXBlOiAxLCBkZXRhaWw6IDF9XG59O1xuXG5tYXJrcy50ZXh0ID0ge1xuICB0eXBlOiAndGV4dCcsXG4gIHByb3A6IHRleHRfcHJvcHMsXG4gIHJlcXVpcmVkRW5jb2Rpbmc6IFsndGV4dCddLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCBzaXplOiAxLCBjb2xvcjogMSwgdGV4dDogMX1cbn07XG5cbmZ1bmN0aW9uIGJhcl9wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcblxuICB2YXIgcCA9IHt9O1xuXG4gIC8vIHgncyBhbmQgd2lkdGhcbiAgaWYgKGUuaXNNZWFzdXJlKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gICAgaWYgKCFlLmhhcyhZKSB8fCBlLmlzRGltZW5zaW9uKFkpKSB7XG4gICAgICBwLngyID0ge3ZhbHVlOiAwfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGUuaGFzKFgpKSB7IC8vIGlzIG9yZGluYWxcbiAgICAgICBwLnhjID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gICAgfSBlbHNlIHtcbiAgICAgICBwLnggPSB7dmFsdWU6IDAsIG9mZnNldDogZS5jb25maWcoJ3NpbmdsZUJhck9mZnNldCcpfTtcbiAgICB9XG4gIH1cblxuICAvLyB3aWR0aFxuICBpZiAoIXAueDIpIHtcbiAgICBpZiAoIWUuaGFzKFgpIHx8IGUuaXNPcmRpbmFsU2NhbGUoWCkpIHsgLy8gbm8gWCBvciBYIGlzIG9yZGluYWxcbiAgICAgIGlmIChlLmhhcyhTSVpFKSkge1xuICAgICAgICBwLndpZHRoID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZFJlZihTSVpFKX07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwLndpZHRoID0ge1xuICAgICAgICAgIHZhbHVlOiBlLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCksXG4gICAgICAgICAgb2Zmc2V0OiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIFggaXMgUXVhbnQgb3IgVGltZSBTY2FsZVxuICAgICAgcC53aWR0aCA9IHt2YWx1ZTogMn07XG4gICAgfVxuICB9XG5cbiAgLy8geSdzICYgaGVpZ2h0XG4gIGlmIChlLmlzTWVhc3VyZShZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICAgIHAueTIgPSB7Z3JvdXA6ICdoZWlnaHQnfTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoZS5oYXMoWSkpIHsgLy8gaXMgb3JkaW5hbFxuICAgICAgcC55YyA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnkyID0ge2dyb3VwOiAnaGVpZ2h0Jywgb2Zmc2V0OiAtZS5jb25maWcoJ3NpbmdsZUJhck9mZnNldCcpfTtcbiAgICB9XG5cbiAgICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICAgIHAuaGVpZ2h0ID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZFJlZihTSVpFKX07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAuaGVpZ2h0ID0ge1xuICAgICAgICB2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpLFxuICAgICAgICBvZmZzZXQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8vIGZpbGxcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkUmVmKENPTE9SKX07XG4gIH0gZWxzZSB7XG4gICAgcC5maWxsID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gIH1cblxuICAvLyBvcGFjaXR5XG4gIHZhciBvcGFjaXR5ID0gZS5maWVsZChDT0xPUikub3BhY2l0eTtcbiAgaWYgKG9wYWNpdHkpIHAub3BhY2l0eSA9IHt2YWx1ZTogb3BhY2l0eX07XG5cbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIHBvaW50X3Byb3BzKGUsIGxheW91dCwgc3R5bGUpIHtcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmhhcyhYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGRSZWYoWCl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgIHAueCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpIC8gMn07XG4gIH1cblxuICAvLyB5XG4gIGlmIChlLmhhcyhZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgIHAueSA9IHt2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMn07XG4gIH1cblxuICAvLyBzaXplXG4gIGlmIChlLmhhcyhTSVpFKSkge1xuICAgIHAuc2l6ZSA9IHtzY2FsZTogU0laRSwgZmllbGQ6IGUuZmllbGRSZWYoU0laRSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhTSVpFKSkge1xuICAgIHAuc2l6ZSA9IHt2YWx1ZTogZS52YWx1ZShTSVpFKX07XG4gIH1cblxuICAvLyBzaGFwZVxuICBpZiAoZS5oYXMoU0hBUEUpKSB7XG4gICAgcC5zaGFwZSA9IHtzY2FsZTogU0hBUEUsIGZpZWxkOiBlLmZpZWxkUmVmKFNIQVBFKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFNIQVBFKSkge1xuICAgIHAuc2hhcGUgPSB7dmFsdWU6IGUudmFsdWUoU0hBUEUpfTtcbiAgfVxuXG4gIC8vIGZpbGwgb3Igc3Ryb2tlXG4gIGlmIChlLmZpZWxkKFNIQVBFKS5maWxsZWQpIHtcbiAgICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZFJlZihDT0xPUil9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgICAgcC5maWxsID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICAgIHAuc3Ryb2tlID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGRSZWYoQ09MT1IpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICAgIHAuc3Ryb2tlID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gICAgfVxuICAgIHAuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IGUuY29uZmlnKCdzdHJva2VXaWR0aCcpfTtcbiAgfVxuXG4gIC8vIG9wYWNpdHlcbiAgdmFyIG9wYWNpdHkgPSBlLmZpZWxkKENPTE9SKS5vcGFjaXR5IHx8IHN0eWxlLm9wYWNpdHk7XG4gIGlmIChvcGFjaXR5KSBwLm9wYWNpdHkgPSB7dmFsdWU6IG9wYWNpdHl9O1xuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBsaW5lX3Byb3BzKGUsbGF5b3V0LCBzdHlsZSkge1xuICAvLyBqc2hpbnQgdW51c2VkOmZhbHNlXG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkUmVmKFgpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkUmVmKFkpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7Z3JvdXA6ICdoZWlnaHQnfTtcbiAgfVxuXG4gIC8vIHN0cm9rZVxuICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5zdHJva2UgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZFJlZihDT0xPUil9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICBwLnN0cm9rZSA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICB9XG5cbiAgdmFyIG9wYWNpdHkgPSBlLmZpZWxkKENPTE9SKS5vcGFjaXR5O1xuICBpZiAob3BhY2l0eSkgcC5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcblxuICBwLnN0cm9rZVdpZHRoID0ge3ZhbHVlOiBlLmNvbmZpZygnc3Ryb2tlV2lkdGgnKX07XG5cbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIGFyZWFfcHJvcHMoZSwgbGF5b3V0LCBzdHlsZSkge1xuICAvLyBqc2hpbnQgdW51c2VkOmZhbHNlXG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5pc01lYXN1cmUoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkUmVmKFgpfTtcbiAgICBpZiAoZS5pc0RpbWVuc2lvbihZKSkge1xuICAgICAgcC54MiA9IHtzY2FsZTogWCwgdmFsdWU6IDB9O1xuICAgICAgcC5vcmllbnQgPSB7dmFsdWU6ICdob3Jpem9udGFsJ307XG4gICAgfVxuICB9IGVsc2UgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gIH0gZWxzZSB7XG4gICAgcC54ID0ge3ZhbHVlOiAwfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaXNNZWFzdXJlKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZFJlZihZKX07XG4gICAgcC55MiA9IHtzY2FsZTogWSwgdmFsdWU6IDB9O1xuICB9IGVsc2UgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZFJlZihZKX07XG4gIH0gZWxzZSB7XG4gICAgcC55ID0ge2dyb3VwOiAnaGVpZ2h0J307XG4gIH1cblxuICAvLyBmaWxsXG4gIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZFJlZihDT0xPUil9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICBwLmZpbGwgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgfVxuXG4gIHZhciBvcGFjaXR5ID0gZS5maWVsZChDT0xPUikub3BhY2l0eTtcbiAgaWYgKG9wYWNpdHkpIHAub3BhY2l0eSA9IHt2YWx1ZTogb3BhY2l0eX07XG5cbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIHRpY2tfcHJvcHMoZSwgbGF5b3V0LCBzdHlsZSkge1xuICB2YXIgcCA9IHt9O1xuXG4gIC8vIHhcbiAgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gICAgaWYgKGUuaXNEaW1lbnNpb24oWCkpIHtcbiAgICAgIHAueC5vZmZzZXQgPSAtZS5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpIC8gMztcbiAgICB9XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3ZhbHVlOiAwfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZFJlZihZKX07XG4gICAgaWYgKGUuaXNEaW1lbnNpb24oWSkpIHtcbiAgICAgIHAueS5vZmZzZXQgPSAtZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMztcbiAgICB9XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3ZhbHVlOiAwfTtcbiAgfVxuXG4gIC8vIHdpZHRoXG4gIGlmICghZS5oYXMoWCkgfHwgZS5pc0RpbWVuc2lvbihYKSkge1xuICAgIHAud2lkdGggPSB7dmFsdWU6IGUuYmFuZFNpemUoWCwgbGF5b3V0LnkudXNlU21hbGxCYW5kKSAvIDEuNX07XG4gIH0gZWxzZSB7XG4gICAgcC53aWR0aCA9IHt2YWx1ZTogMX07XG4gIH1cblxuICAvLyBoZWlnaHRcbiAgaWYgKCFlLmhhcyhZKSB8fCBlLmlzRGltZW5zaW9uKFkpKSB7XG4gICAgcC5oZWlnaHQgPSB7dmFsdWU6IGUuYmFuZFNpemUoWSwgbGF5b3V0LnkudXNlU21hbGxCYW5kKSAvIDEuNX07XG4gIH0gZWxzZSB7XG4gICAgcC5oZWlnaHQgPSB7dmFsdWU6IDF9O1xuICB9XG5cbiAgLy8gZmlsbFxuICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5maWxsID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGRSZWYoQ09MT1IpfTtcbiAgfSBlbHNlIHtcbiAgICBwLmZpbGwgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgfVxuXG4gIHZhciBvcGFjaXR5ID0gZS5maWVsZChDT0xPUikub3BhY2l0eSAgfHwgc3R5bGUub3BhY2l0eTtcbiAgaWYob3BhY2l0eSkgcC5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gZmlsbGVkX3BvaW50X3Byb3BzKHNoYXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbihlLCBsYXlvdXQsIHN0eWxlKSB7XG4gICAgdmFyIHAgPSB7fTtcblxuICAgIC8vIHhcbiAgICBpZiAoZS5oYXMoWCkpIHtcbiAgICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGRSZWYoWCl9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgICBwLnggPSB7dmFsdWU6IGUuYmFuZFNpemUoWCwgbGF5b3V0LngudXNlU21hbGxCYW5kKSAvIDJ9O1xuICAgIH1cblxuICAgIC8vIHlcbiAgICBpZiAoZS5oYXMoWSkpIHtcbiAgICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGRSZWYoWSl9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKFkpKSB7XG4gICAgICBwLnkgPSB7dmFsdWU6IGUuYmFuZFNpemUoWSwgbGF5b3V0LnkudXNlU21hbGxCYW5kKSAvIDJ9O1xuICAgIH1cblxuICAgIC8vIHNpemVcbiAgICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICAgIHAuc2l6ZSA9IHtzY2FsZTogU0laRSwgZmllbGQ6IGUuZmllbGRSZWYoU0laRSl9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgICBwLnNpemUgPSB7dmFsdWU6IGUudmFsdWUoU0laRSl9O1xuICAgIH1cblxuICAgIC8vIHNoYXBlXG4gICAgcC5zaGFwZSA9IHt2YWx1ZTogc2hhcGV9O1xuXG4gICAgLy8gZmlsbFxuICAgIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICAgIHAuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkUmVmKENPTE9SKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLmZpbGwgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgICB9XG5cbiAgICB2YXIgb3BhY2l0eSA9IGUuZmllbGQoQ09MT1IpLm9wYWNpdHkgIHx8IHN0eWxlLm9wYWNpdHk7XG4gICAgaWYob3BhY2l0eSkgcC5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcblxuICAgIHJldHVybiBwO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0ZXh0X3Byb3BzKGUsIGxheW91dCwgc3R5bGUsIHN0YXRzKSB7XG4gIHZhciBwID0ge30sXG4gICAgZmllbGQgPSBlLmZpZWxkKFRFWFQpO1xuXG4gIC8vIHhcbiAgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZFJlZihYKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgaWYgKGUuaGFzKFRFWFQpICYmIGUuaXNUeXBlKFRFWFQsIFEpKSB7XG4gICAgICBwLnggPSB7dmFsdWU6IGxheW91dC5jZWxsV2lkdGgtNX07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpIC8gMn07XG4gICAgfVxuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkUmVmKFkpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7dmFsdWU6IGUuYmFuZFNpemUoWSwgbGF5b3V0LnkudXNlU21hbGxCYW5kKSAvIDJ9O1xuICB9XG5cbiAgLy8gc2l6ZVxuICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICBwLmZvbnRTaXplID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZFJlZihTSVpFKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFNJWkUpKSB7XG4gICAgcC5mb250U2l6ZSA9IHt2YWx1ZTogZmllbGQuZm9udC5zaXplfTtcbiAgfVxuXG4gIC8vIGZpbGxcbiAgLy8gY29sb3Igc2hvdWxkIGJlIHNldCB0byBiYWNrZ3JvdW5kXG4gIHAuZmlsbCA9IHt2YWx1ZTogZmllbGQuY29sb3J9O1xuXG4gIHZhciBvcGFjaXR5ID0gZS5maWVsZChDT0xPUikub3BhY2l0eSAgfHwgc3R5bGUub3BhY2l0eTtcbiAgaWYob3BhY2l0eSkgcC5vcGFjaXR5ID0ge3ZhbHVlOiBvcGFjaXR5fTtcblxuICAvLyB0ZXh0XG4gIGlmIChlLmhhcyhURVhUKSkge1xuICAgIGlmIChlLmlzVHlwZShURVhULCBRKSkge1xuICAgICAgdmFyIGZpZWxkU3RhdHMgPSBzdGF0c1tlLmZpZWxkTmFtZShURVhUKV0sXG4gICAgICAgIG51bWJlckZvcm1hdCA9IGZpZWxkLmZvcm1hdCB8fCBlLm51bWJlckZvcm1hdChmaWVsZFN0YXRzKTtcblxuICAgICAgcC50ZXh0ID0ge3RlbXBsYXRlOiAne3snICsgZS5maWVsZFJlZihURVhUKSArICcgfCBudW1iZXI6XFwnJyArXG4gICAgICAgIG51bWJlckZvcm1hdCArJ1xcJ319J307XG4gICAgICBwLmFsaWduID0ge3ZhbHVlOiBmaWVsZC5hbGlnbn07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAudGV4dCA9IHtmaWVsZDogZS5maWVsZFJlZihURVhUKX07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHAudGV4dCA9IHt2YWx1ZTogZmllbGQucGxhY2Vob2xkZXJ9O1xuICB9XG5cbiAgcC5mb250ID0ge3ZhbHVlOiBmaWVsZC5mb250LmZhbWlseX07XG4gIHAuZm9udFdlaWdodCA9IHt2YWx1ZTogZmllbGQuZm9udC53ZWlnaHR9O1xuICBwLmZvbnRTdHlsZSA9IHt2YWx1ZTogZmllbGQuZm9udC5zdHlsZX07XG4gIHAuYmFzZWxpbmUgPSB7dmFsdWU6IGZpZWxkLmJhc2VsaW5lfTtcblxuICByZXR1cm4gcDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICB0aW1lID0gcmVxdWlyZSgnLi90aW1lJyksXG4gIGNvbG9yYnJld2VyID0gcmVxdWlyZSgnY29sb3JicmV3ZXInKSxcbiAgaW50ZXJwb2xhdGUgPSByZXF1aXJlKCdkMy1jb2xvcicpLmludGVycG9sYXRlSHNsLFxuICBzY2hlbWEgPSByZXF1aXJlKCcuLi9zY2hlbWEvc2NoZW1hJyksXG4gIHZsc29ydCA9IHJlcXVpcmUoJy4vc29ydCcpO1xuXG52YXIgc2NhbGUgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5zY2FsZS5uYW1lcyA9IGZ1bmN0aW9uKHByb3BzKSB7XG4gIHJldHVybiB1dGlsLmtleXModXRpbC5rZXlzKHByb3BzKS5yZWR1Y2UoZnVuY3Rpb24oYSwgeCkge1xuICAgIGlmIChwcm9wc1t4XSAmJiBwcm9wc1t4XS5zY2FsZSkgYVtwcm9wc1t4XS5zY2FsZV0gPSAxO1xuICAgIHJldHVybiBhO1xuICB9LCB7fSkpO1xufTtcblxuc2NhbGUuZGVmcyA9IGZ1bmN0aW9uKG5hbWVzLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cywgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcblxuICByZXR1cm4gbmFtZXMucmVkdWNlKGZ1bmN0aW9uKGEsIG5hbWUpIHtcbiAgICB2YXIgcyA9IHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB0eXBlOiBzY2FsZS50eXBlKG5hbWUsIGVuY29kaW5nKSxcbiAgICAgIGRvbWFpbjogc2NhbGUuZG9tYWluKG5hbWUsIGVuY29kaW5nLCBzdGF0cywgb3B0KVxuICAgIH07XG5cbiAgICBzLnNvcnQgPSBzY2FsZS5zb3J0KHMsIGVuY29kaW5nLCBuYW1lKSB8fCB1bmRlZmluZWQ7XG5cbiAgICBzY2FsZS5yYW5nZShzLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cywgb3B0KTtcblxuICAgIHJldHVybiAoYS5wdXNoKHMpLCBhKTtcbiAgfSwgW10pO1xufTtcblxuc2NhbGUuc29ydCA9IGZ1bmN0aW9uKHMsIGVuY29kaW5nLCBuYW1lKSB7XG4gIHJldHVybiBzLnR5cGUgPT09ICdvcmRpbmFsJyAmJiAoXG4gICAgISFlbmNvZGluZy5iaW4obmFtZSkgfHxcbiAgICBlbmNvZGluZy5zb3J0KG5hbWUpLmxlbmd0aCA9PT0gMFxuICApO1xufTtcblxuc2NhbGUudHlwZSA9IGZ1bmN0aW9uKG5hbWUsIGVuY29kaW5nKSB7XG5cbiAgc3dpdGNoIChlbmNvZGluZy50eXBlKG5hbWUpKSB7XG4gICAgY2FzZSBOOiAvL2ZhbGwgdGhyb3VnaFxuICAgIGNhc2UgTzogcmV0dXJuICdvcmRpbmFsJztcbiAgICBjYXNlIFQ6XG4gICAgICB2YXIgdGltZVVuaXQgPSBlbmNvZGluZy5maWVsZChuYW1lKS50aW1lVW5pdDtcbiAgICAgIHJldHVybiB0aW1lVW5pdCA/IHRpbWUuc2NhbGUudHlwZSh0aW1lVW5pdCwgbmFtZSkgOiAndGltZSc7XG4gICAgY2FzZSBROlxuICAgICAgaWYgKGVuY29kaW5nLmJpbihuYW1lKSkge1xuICAgICAgICByZXR1cm4gbmFtZSA9PT0gQ09MT1IgPyAnbGluZWFyJyA6ICdvcmRpbmFsJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbmNvZGluZy5zY2FsZShuYW1lKS50eXBlO1xuICB9XG59O1xuXG5zY2FsZS5kb21haW4gPSBmdW5jdGlvbiAobmFtZSwgZW5jb2RpbmcsIHN0YXRzLCBvcHQpIHtcbiAgdmFyIGZpZWxkID0gZW5jb2RpbmcuZmllbGQobmFtZSk7XG5cbiAgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSkge1xuICAgIHZhciByYW5nZSA9IHRpbWUuc2NhbGUuZG9tYWluKGZpZWxkLnRpbWVVbml0LCBuYW1lKTtcbiAgICBpZihyYW5nZSkgcmV0dXJuIHJhbmdlO1xuICB9XG5cbiAgaWYgKGZpZWxkLmJpbikge1xuICAgIC8vIFRPRE8oa2FuaXR3KTogdGhpcyBtdXN0IGJlIGNoYW5nZWQgaW4gdmcyXG4gICAgdmFyIGZpZWxkU3RhdCA9IHN0YXRzW2ZpZWxkLm5hbWVdLFxuICAgICAgYmlucyA9IHV0aWwuZ2V0YmlucyhmaWVsZFN0YXQsIGZpZWxkLmJpbi5tYXhiaW5zIHx8IHNjaGVtYS5NQVhCSU5TX0RFRkFVTFQpLFxuICAgICAgbnVtYmlucyA9IChiaW5zLnN0b3AgLSBiaW5zLnN0YXJ0KSAvIGJpbnMuc3RlcDtcbiAgICByZXR1cm4gdXRpbC5yYW5nZShudW1iaW5zKS5tYXAoZnVuY3Rpb24oaSkge1xuICAgICAgcmV0dXJuIGJpbnMuc3RhcnQgKyBiaW5zLnN0ZXAgKiBpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKG5hbWUgPT0gb3B0LnN0YWNrKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IFNUQUNLRUQsXG4gICAgICBmaWVsZDogZW5jb2RpbmcuZmllbGRSZWYobmFtZSwge1xuICAgICAgICBkYXRhOiAhZW5jb2RpbmcuX3ZlZ2EyLFxuICAgICAgICBwcmVmbjogKG9wdC5mYWNldCA/ICdtYXhfJyA6ICcnKSArICdzdW1fJ1xuICAgICAgfSlcbiAgICB9O1xuICB9XG4gIHZhciBhZ2dyZWdhdGUgPSBlbmNvZGluZy5hZ2dyZWdhdGUobmFtZSksXG4gICAgdGltZVVuaXQgPSBmaWVsZC50aW1lVW5pdCxcbiAgICBzY2FsZVVzZVJhd0RvbWFpbiA9IGVuY29kaW5nLnNjYWxlKG5hbWUpLnVzZVJhd0RvbWFpbixcbiAgICB1c2VSYXdEb21haW4gPSBzY2FsZVVzZVJhd0RvbWFpbiAhPT0gdW5kZWZpbmVkID9cbiAgICAgIHNjYWxlVXNlUmF3RG9tYWluIDogZW5jb2RpbmcuY29uZmlnKCd1c2VSYXdEb21haW4nKSxcbiAgICBub3RDb3VudE9yU3VtID0gIWFnZ3JlZ2F0ZSB8fCAoYWdncmVnYXRlICE9PSdjb3VudCcgJiYgYWdncmVnYXRlICE9PSAnc3VtJyk7XG5cbiAgLy8gRklYTUUgcmV2aXNlIHRoaXMgcGFydFxuXG4gIGlmICggdXNlUmF3RG9tYWluICYmIG5vdENvdW50T3JTdW0gJiYgKFxuICAgICAgLy8gUSBhbHdheXMgdXNlcyBub24tb3JkaW5hbCBzY2FsZSBleGNlcHQgd2hlbiBpdCdzIGJpbm5lZCBhbmQgdGh1cyB1c2VzIG9yZGluYWwgc2NhbGUuXG4gICAgICAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFEpICYmICFmaWVsZC5iaW4pIHx8XG4gICAgICAvLyBUIHVzZXMgbm9uLW9yZGluYWwgc2NhbGUgd2hlbiB0aGVyZSdzIG5vIHVuaXQgb3Igd2hlbiB0aGUgdW5pdCBpcyBub3Qgb3JkaW5hbC5cbiAgICAgIChlbmNvZGluZy5pc1R5cGUobmFtZSwgVCkgJiYgKCF0aW1lVW5pdCB8fCAhdGltZS5pc09yZGluYWxGbih0aW1lVW5pdCkpKVxuICAgIClcbiAgKSB7XG4gICAgcmV0dXJuIHtkYXRhOiBSQVcsIGZpZWxkOiBlbmNvZGluZy5maWVsZFJlZihuYW1lLCB7bm9mbjogIXRpbWVVbml0fSl9O1xuICB9XG5cbiAgdmFyIGRhdGEgPSBlbmNvZGluZy5zb3J0KG5hbWUsIHN0YXRzKS5sZW5ndGggPiAwID9cbiAgICB2bHNvcnQuZ2V0RGF0YU5hbWUobmFtZSk6XG4gICAgZW5jb2RpbmcuZGF0YVRhYmxlKCk7XG5cbiAgcmV0dXJuIHtkYXRhOiBkYXRhLCBmaWVsZDogZW5jb2RpbmcuZmllbGRSZWYobmFtZSl9O1xufTtcblxuXG5zY2FsZS5yYW5nZSA9IGZ1bmN0aW9uIChzLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykge1xuICB2YXIgc3BlYyA9IGVuY29kaW5nLnNjYWxlKHMubmFtZSksXG4gICAgZmllbGQgPSBlbmNvZGluZy5maWVsZChzLm5hbWUpLFxuICAgIHRpbWVVbml0ID0gZmllbGQudGltZVVuaXQ7XG5cbiAgc3dpdGNoIChzLm5hbWUpIHtcbiAgICBjYXNlIFg6XG4gICAgICBzLnJhbmdlID0gbGF5b3V0LmNlbGxXaWR0aCA/IFswLCBsYXlvdXQuY2VsbFdpZHRoXSA6ICd3aWR0aCc7XG4gICAgICBpZiAocy50eXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgICAgcy5iYW5kV2lkdGggPSBlbmNvZGluZy5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGVuY29kaW5nLmlzVHlwZShzLm5hbWUsVCkgJiYgdGltZVVuaXQgPT09ICd5ZWFyJykge1xuICAgICAgICAgIHMuemVybyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMuemVybyA9IHNwZWMuemVybyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHNwZWMuemVybztcbiAgICAgICAgfVxuXG4gICAgICAgIHMucmV2ZXJzZSA9IHNwZWMucmV2ZXJzZTtcbiAgICAgIH1cbiAgICAgIHMucm91bmQgPSB0cnVlO1xuICAgICAgaWYgKHMudHlwZSA9PT0gJ3RpbWUnKSB7XG4gICAgICAgIHMubmljZSA9IHRpbWVVbml0IHx8IGVuY29kaW5nLmNvbmZpZygndGltZVNjYWxlTmljZScpO1xuICAgICAgfWVsc2Uge1xuICAgICAgICBzLm5pY2UgPSB0cnVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBZOlxuICAgICAgaWYgKHMudHlwZSA9PT0gJ29yZGluYWwnKSB7XG4gICAgICAgIHMucmFuZ2UgPSBsYXlvdXQuY2VsbEhlaWdodCA/XG4gICAgICAgICAgKGZpZWxkLmJpbiA/IFtsYXlvdXQuY2VsbEhlaWdodCwgMF0gOiBbMCwgbGF5b3V0LmNlbGxIZWlnaHRdKSA6XG4gICAgICAgICAgJ2hlaWdodCc7XG4gICAgICAgIHMuYmFuZFdpZHRoID0gZW5jb2RpbmcuYmFuZFNpemUoWSwgbGF5b3V0LnkudXNlU21hbGxCYW5kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMucmFuZ2UgPSBsYXlvdXQuY2VsbEhlaWdodCA/IFtsYXlvdXQuY2VsbEhlaWdodCwgMF0gOiAnaGVpZ2h0JztcbiAgICAgICAgaWYgKGVuY29kaW5nLmlzVHlwZShzLm5hbWUsVCkgJiYgdGltZVVuaXQgPT09ICd5ZWFyJykge1xuICAgICAgICAgIHMuemVybyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMuemVybyA9IHNwZWMuemVybyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHNwZWMuemVybztcbiAgICAgICAgfVxuXG4gICAgICAgIHMucmV2ZXJzZSA9IHNwZWMucmV2ZXJzZTtcbiAgICAgIH1cblxuICAgICAgcy5yb3VuZCA9IHRydWU7XG5cbiAgICAgIGlmIChzLnR5cGUgPT09ICd0aW1lJykge1xuICAgICAgICBzLm5pY2UgPSB0aW1lVW5pdCB8fCBlbmNvZGluZy5jb25maWcoJ3RpbWVTY2FsZU5pY2UnKTtcbiAgICAgIH1lbHNlIHtcbiAgICAgICAgcy5uaWNlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgUk9XOiAvLyBzdXBwb3J0IG9ubHkgb3JkaW5hbFxuICAgICAgcy5iYW5kV2lkdGggPSBsYXlvdXQuY2VsbEhlaWdodDtcbiAgICAgIHMucm91bmQgPSB0cnVlO1xuICAgICAgcy5uaWNlID0gdHJ1ZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQ09MOiAvLyBzdXBwb3J0IG9ubHkgb3JkaW5hbFxuICAgICAgcy5iYW5kV2lkdGggPSBsYXlvdXQuY2VsbFdpZHRoO1xuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBzLm5pY2UgPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBTSVpFOlxuICAgICAgaWYgKGVuY29kaW5nLmlzKCdiYXInKSkge1xuICAgICAgICAvLyBGSVhNRSB0aGlzIGlzIGRlZmluaXRlbHkgaW5jb3JyZWN0XG4gICAgICAgIC8vIGJ1dCBsZXQncyBmaXggaXQgbGF0ZXIgc2luY2UgYmFyIHNpemUgaXMgYSBiYWQgZW5jb2RpbmcgYW55d2F5XG4gICAgICAgIHMucmFuZ2UgPSBbMywgTWF0aC5tYXgoZW5jb2RpbmcuYmFuZFNpemUoWCksIGVuY29kaW5nLmJhbmRTaXplKFkpKV07XG4gICAgICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzKFRFWFQpKSB7XG4gICAgICAgIHMucmFuZ2UgPSBbOCwgNDBdO1xuICAgICAgfSBlbHNlIHsgLy9wb2ludFxuICAgICAgICB2YXIgYmFuZFNpemUgPSBNYXRoLm1pbihlbmNvZGluZy5iYW5kU2l6ZShYKSwgZW5jb2RpbmcuYmFuZFNpemUoWSkpIC0gMTtcbiAgICAgICAgcy5yYW5nZSA9IFsxMCwgMC44ICogYmFuZFNpemUqYmFuZFNpemVdO1xuICAgICAgfVxuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBzLnplcm8gPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgU0hBUEU6XG4gICAgICBzLnJhbmdlID0gJ3NoYXBlcyc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIENPTE9SOlxuICAgICAgcy5yYW5nZSA9IHNjYWxlLmNvbG9yKHMsIGVuY29kaW5nLCBzdGF0cyk7XG4gICAgICBpZiAocy50eXBlICE9PSAnb3JkaW5hbCcpIHMuemVybyA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZyBuYW1lOiAnKyBzLm5hbWUpO1xuICB9XG5cbiAgLy8gRklYTUUoa2FuaXR3KTogSnVsIDI5LCAyMDE1IC0gY29uc29saWRhdGUgdGhpcyB3aXRoIGFib3ZlXG4gIHN3aXRjaCAocy5uYW1lKSB7XG4gICAgY2FzZSBST1c6XG4gICAgY2FzZSBDT0w6XG4gICAgICBzLnBhZGRpbmcgPSBlbmNvZGluZy5jb25maWcoJ2NlbGxQYWRkaW5nJyk7XG4gICAgICBzLm91dGVyUGFkZGluZyA9IDA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFg6XG4gICAgY2FzZSBZOlxuICAgICAgaWYgKHMudHlwZSA9PT0gJ29yZGluYWwnKSB7IC8vJiYgIXMuYmFuZFdpZHRoXG4gICAgICAgIHMucG9pbnRzID0gdHJ1ZTtcbiAgICAgICAgcy5wYWRkaW5nID0gZW5jb2RpbmcuZmllbGQocy5uYW1lKS5iYW5kLnBhZGRpbmc7XG4gICAgICB9XG4gIH1cbn07XG5cbnNjYWxlLmNvbG9yID0gZnVuY3Rpb24ocywgZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHZhciBjb2xvclNjYWxlID0gZW5jb2Rpbmcuc2NhbGUoQ09MT1IpLFxuICAgIHJhbmdlID0gY29sb3JTY2FsZS5yYW5nZSxcbiAgICBjYXJkaW5hbGl0eSA9IGVuY29kaW5nLmNhcmRpbmFsaXR5KENPTE9SLCBzdGF0cyksXG4gICAgdHlwZSA9IGVuY29kaW5nLnR5cGUoQ09MT1IpO1xuXG4gIGlmIChyYW5nZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIG9yZGluYWxQYWxldHRlID0gY29sb3JTY2FsZS5vcmRpbmFsUGFsZXR0ZSxcbiAgICAgIHF1YW50aXRhdGl2ZVJhbmdlID0gY29sb3JTY2FsZS5xdWFudGl0YXRpdmVSYW5nZTtcblxuICAgIGlmIChzLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgaWYgKHR5cGUgPT09IE4pIHtcbiAgICAgICAgLy8gdXNlIGNhdGVnb3JpY2FsIGNvbG9yIHNjYWxlXG4gICAgICAgIGlmIChjYXJkaW5hbGl0eSA8PSAxMCkge1xuICAgICAgICAgIHJhbmdlID0gY29sb3JTY2FsZS5jMTBwYWxldHRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJhbmdlID0gY29sb3JTY2FsZS5jMjBwYWxldHRlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzY2FsZS5jb2xvci5wYWxldHRlKHJhbmdlLCBjYXJkaW5hbGl0eSwgdHlwZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAob3JkaW5hbFBhbGV0dGUpIHtcbiAgICAgICAgICByZXR1cm4gc2NhbGUuY29sb3IucGFsZXR0ZShvcmRpbmFsUGFsZXR0ZSwgY2FyZGluYWxpdHksIHR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzY2FsZS5jb2xvci5pbnRlcnBvbGF0ZShxdWFudGl0YXRpdmVSYW5nZVswXSwgcXVhbnRpdGF0aXZlUmFuZ2VbMV0sIGNhcmRpbmFsaXR5KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvL3RpbWUgb3IgcXVhbnRpdGF0aXZlXG4gICAgICByZXR1cm4gW3F1YW50aXRhdGl2ZVJhbmdlWzBdLCBxdWFudGl0YXRpdmVSYW5nZVsxXV07XG4gICAgfVxuICB9XG59O1xuXG5zY2FsZS5jb2xvci5wYWxldHRlID0gZnVuY3Rpb24ocmFuZ2UsIGNhcmRpbmFsaXR5LCB0eXBlKSB7XG4gIC8vIEZJWE1FKGthbml0dyk6IEp1bCAyOSwgMjAxNSAtIGNoZWNrIHJhbmdlIGlzIHN0cmluZ1xuICBzd2l0Y2ggKHJhbmdlKSB7XG4gICAgY2FzZSAnY2F0ZWdvcnkxMGsnOlxuICAgICAgLy8gdGFibGVhdSdzIGNhdGVnb3J5IDEwLCBvcmRlcmVkIGJ5IHBlcmNlcHR1YWwga2VybmVsIHN0dWR5IHJlc3VsdHNcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS91d2RhdGEvcGVyY2VwdHVhbC1rZXJuZWxzXG4gICAgICByZXR1cm4gWycjMmNhMDJjJywgJyNlMzc3YzInLCAnIzdmN2Y3ZicsICcjMTdiZWNmJywgJyM4YzU2NGInLCAnI2Q2MjcyOCcsICcjYmNiZDIyJywgJyM5NDY3YmQnLCAnI2ZmN2YwZScsICcjMWY3N2I0J107XG5cbiAgICAvLyBkMy90YWJsZWF1IGNhdGVnb3J5MTAvMjAvMjBiLzIwY1xuICAgIGNhc2UgJ2NhdGVnb3J5MTAnOlxuICAgICAgcmV0dXJuIFsnIzFmNzdiNCcsICcjZmY3ZjBlJywgJyMyY2EwMmMnLCAnI2Q2MjcyOCcsICcjOTQ2N2JkJywgJyM4YzU2NGInLCAnI2UzNzdjMicsICcjN2Y3ZjdmJywgJyNiY2JkMjInLCAnIzE3YmVjZiddO1xuXG4gICAgY2FzZSAnY2F0ZWdvcnkyMCc6XG4gICAgICByZXR1cm4gWycjMWY3N2I0JywgJyNhZWM3ZTgnLCAnI2ZmN2YwZScsICcjZmZiYjc4JywgJyMyY2EwMmMnLCAnIzk4ZGY4YScsICcjZDYyNzI4JywgJyNmZjk4OTYnLCAnIzk0NjdiZCcsICcjYzViMGQ1JywgJyM4YzU2NGInLCAnI2M0OWM5NCcsICcjZTM3N2MyJywgJyNmN2I2ZDInLCAnIzdmN2Y3ZicsICcjYzdjN2M3JywgJyNiY2JkMjInLCAnI2RiZGI4ZCcsICcjMTdiZWNmJywgJyM5ZWRhZTUnXTtcblxuICAgIGNhc2UgJ2NhdGVnb3J5MjBiJzpcbiAgICAgIHJldHVybiBbJyMzOTNiNzknLCAnIzUyNTRhMycsICcjNmI2ZWNmJywgJyM5YzllZGUnLCAnIzYzNzkzOScsICcjOGNhMjUyJywgJyNiNWNmNmInLCAnI2NlZGI5YycsICcjOGM2ZDMxJywgJyNiZDllMzknLCAnI2U3YmE1MicsICcjZTdjYjk0JywgJyM4NDNjMzknLCAnI2FkNDk0YScsICcjZDY2MTZiJywgJyNlNzk2OWMnLCAnIzdiNDE3MycsICcjYTU1MTk0JywgJyNjZTZkYmQnLCAnI2RlOWVkNiddO1xuXG4gICAgY2FzZSAnY2F0ZWdvcnkyMGMnOlxuICAgICAgcmV0dXJuIFsnIzMxODJiZCcsICcjNmJhZWQ2JywgJyM5ZWNhZTEnLCAnI2M2ZGJlZicsICcjZTY1NTBkJywgJyNmZDhkM2MnLCAnI2ZkYWU2YicsICcjZmRkMGEyJywgJyMzMWEzNTQnLCAnIzc0YzQ3NicsICcjYTFkOTliJywgJyNjN2U5YzAnLCAnIzc1NmJiMScsICcjOWU5YWM4JywgJyNiY2JkZGMnLCAnI2RhZGFlYicsICcjNjM2MzYzJywgJyM5Njk2OTYnLCAnI2JkYmRiZCcsICcjZDlkOWQ5J107XG4gIH1cblxuICAvLyBUT0RPIGFkZCBvdXIgb3duIHNldCBvZiBjdXN0b20gb3JkaW5hbCBjb2xvciBwYWxldHRlXG5cbiAgaWYgKHJhbmdlIGluIGNvbG9yYnJld2VyKSB7XG4gICAgdmFyIHBhbGV0dGUgPSBjb2xvcmJyZXdlcltyYW5nZV07XG5cbiAgICAvLyBpZiBjYXJkaW5hbGl0eSBwcmUtZGVmaW5lZCwgdXNlIGl0LlxuICAgIGlmIChjYXJkaW5hbGl0eSBpbiBwYWxldHRlKSByZXR1cm4gcGFsZXR0ZVtjYXJkaW5hbGl0eV07XG5cbiAgICAvLyBpZiBub3QsIHVzZSB0aGUgaGlnaGVzdCBjYXJkaW5hbGl0eSBvbmUgZm9yIG5vbWluYWxcbiAgICBpZiAodHlwZSA9PT0gTikge1xuICAgICAgcmV0dXJuIHBhbGV0dGVbTWF0aC5tYXguYXBwbHkobnVsbCwgdXRpbC5rZXlzKHBhbGV0dGUpKV07XG4gICAgfVxuXG4gICAgLy8gb3RoZXJ3aXNlLCBpbnRlcnBvbGF0ZVxuICAgIHZhciBwcyA9IGNhcmRpbmFsaXR5IDwgMyA/IDMgOiBNYXRoLm1heC5hcHBseShudWxsLCB1dGlsLmtleXMocGFsZXR0ZSkpLFxuICAgICAgZnJvbSA9IDAgLCB0byA9IHBzIC0gMTtcbiAgICAvLyBGSVhNRSBhZGQgY29uZmlnIGZvciBmcm9tIC8gdG9cblxuICAgIHJldHVybiBzY2FsZS5jb2xvci5pbnRlcnBvbGF0ZShwYWxldHRlW3BzXVtmcm9tXSwgcGFsZXR0ZVtwc11bdG9dLCBjYXJkaW5hbGl0eSk7XG4gIH1cblxuICByZXR1cm4gcmFuZ2U7XG59O1xuXG5zY2FsZS5jb2xvci5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kLCBjYXJkaW5hbGl0eSkge1xuXG4gIHZhciBpbnRlcnBvbGF0b3IgPSBpbnRlcnBvbGF0ZShzdGFydCwgZW5kKTtcbiAgcmV0dXJuIHV0aWwucmFuZ2UoY2FyZGluYWxpdHkpLm1hcChmdW5jdGlvbihpKSB7IHJldHVybiBpbnRlcnBvbGF0b3IoaSoxLjAvKGNhcmRpbmFsaXR5LTEpKTsgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciB2bGZpZWxkID0gcmVxdWlyZSgnLi4vZmllbGQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzb3J0O1xuXG4vLyBhZGRzIG5ldyB0cmFuc2Zvcm1zIHRoYXQgcHJvZHVjZSBzb3J0ZWQgZmllbGRzXG5mdW5jdGlvbiBzb3J0KGRhdGEsIGVuY29kaW5nLCBzdGF0cywgb3B0KSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcblxuICB2YXIgZGF0YXNldE1hcHBpbmcgPSB7fTtcblxuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgdmFyIHNvcnRCeSA9IGVuY29kaW5nLnNvcnQoZW5jVHlwZSwgc3RhdHMpO1xuICAgIGlmIChzb3J0QnkubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGZpZWxkcyA9IHNvcnRCeS5tYXAoZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG9wOiBkLmFnZ3JlZ2F0ZSxcbiAgICAgICAgICBmaWVsZDogdmxmaWVsZC5maWVsZFJlZihkLCB7bm9mbjogdHJ1ZSwgZGF0YTogIWVuY29kaW5nLl92ZWdhMn0pXG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgICAgdmFyIGJ5Q2xhdXNlID0gc29ydEJ5Lm1hcChmdW5jdGlvbihkKSB7XG4gICAgICAgIHZhciByZXZlcnNlID0gKGQucmV2ZXJzZSA/ICctJyA6ICcnKTtcbiAgICAgICAgcmV0dXJuIHJldmVyc2UgKyB2bGZpZWxkLmZpZWxkUmVmKGQsIHtkYXRhOiAhZW5jb2RpbmcuX3ZlZ2EyfSk7XG4gICAgICB9KTtcblxuICAgICAgdmFyIGRhdGFOYW1lID0gc29ydC5nZXREYXRhTmFtZShlbmNUeXBlKTtcblxuICAgICAgdmFyIHRyYW5zZm9ybXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgICAgICBncm91cGJ5OiBbIGVuY29kaW5nLmZpZWxkUmVmKGVuY1R5cGUpIF0sXG4gICAgICAgICAgZmllbGRzOiBmaWVsZHNcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdzb3J0JyxcbiAgICAgICAgICBieTogYnlDbGF1c2VcbiAgICAgICAgfVxuICAgICAgXTtcblxuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgbmFtZTogZGF0YU5hbWUsXG4gICAgICAgIHNvdXJjZTogUkFXLFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybXNcbiAgICAgIH0pO1xuXG4gICAgICBkYXRhc2V0TWFwcGluZ1tlbmNUeXBlXSA9IGRhdGFOYW1lO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbnNvcnQuZ2V0RGF0YU5hbWUgPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gIHJldHVybiAnc29ydGVkLScgKyBlbmNUeXBlO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciAgbWFya3MgPSByZXF1aXJlKCcuL21hcmtzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tpbmc7XG5cbmZ1bmN0aW9uIHN0YWNraW5nKGRhdGEsIGVuY29kaW5nLCBtZGVmKSB7XG4gIGlmICghbWFya3NbZW5jb2RpbmcubWFya3R5cGUoKV0uc3RhY2spIHJldHVybiBmYWxzZTtcblxuICAvLyBUT0RPOiBhZGQgfHwgZW5jb2RpbmcuaGFzKExPRCkgaGVyZSBvbmNlIExPRCBpcyBpbXBsZW1lbnRlZFxuICBpZiAoIWVuY29kaW5nLmhhcyhDT0xPUikpIHJldHVybiBmYWxzZTtcblxuICB2YXIgZGltPW51bGwsIHZhbD1udWxsLCBpZHggPW51bGwsXG4gICAgaXNYTWVhc3VyZSA9IGVuY29kaW5nLmlzTWVhc3VyZShYKSxcbiAgICBpc1lNZWFzdXJlID0gZW5jb2RpbmcuaXNNZWFzdXJlKFkpLFxuICAgIGZhY2V0cyA9IGVuY29kaW5nLmZhY2V0cygpO1xuXG4gIGlmIChpc1hNZWFzdXJlICYmICFpc1lNZWFzdXJlKSB7XG4gICAgZGltID0gWTtcbiAgICB2YWwgPSBYO1xuICAgIGlkeCA9IDA7XG4gIH0gZWxzZSBpZiAoaXNZTWVhc3VyZSAmJiAhaXNYTWVhc3VyZSkge1xuICAgIGRpbSA9IFg7XG4gICAgdmFsID0gWTtcbiAgICBpZHggPSAxO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsOyAvLyBubyBzdGFjayBlbmNvZGluZ1xuICB9XG5cbiAgLy8gYWRkIHRyYW5zZm9ybSB0byBjb21wdXRlIHN1bXMgZm9yIHNjYWxlXG4gIHZhciBzdGFja2VkID0ge1xuICAgIG5hbWU6IFNUQUNLRUQsXG4gICAgc291cmNlOiBlbmNvZGluZy5kYXRhVGFibGUoKSxcbiAgICB0cmFuc2Zvcm06IFt7XG4gICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgIGdyb3VwYnk6IFtlbmNvZGluZy5maWVsZFJlZihkaW0pXS5jb25jYXQoZmFjZXRzKSwgLy8gZGltIGFuZCBvdGhlciBmYWNldHNcbiAgICAgIGZpZWxkczogW3tvcDogJ3N1bScsIGZpZWxkOiBlbmNvZGluZy5maWVsZFJlZih2YWwpfV0gLy8gVE9ETyBjaGVjayBpZiBmaWVsZCB3aXRoIGFnZ3JlZ2F0ZSBpcyBjb3JyZWN0P1xuICAgIH1dXG4gIH07XG5cbiAgaWYgKGZhY2V0cyAmJiBmYWNldHMubGVuZ3RoID4gMCkge1xuICAgIHN0YWNrZWQudHJhbnNmb3JtLnB1c2goeyAvL2NhbGN1bGF0ZSBtYXggZm9yIGVhY2ggZmFjZXRcbiAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgZ3JvdXBieTogZmFjZXRzLFxuICAgICAgZmllbGRzOiBbe1xuICAgICAgICBvcDogJ21heCcsXG4gICAgICAgIGZpZWxkOiBlbmNvZGluZy5maWVsZE5hbWUodmFsLCB7Zm46ICdzdW0nfSlcbiAgICAgIH1dXG4gICAgfSk7XG4gIH1cblxuICBkYXRhLnB1c2goc3RhY2tlZCk7XG5cbiAgLy8gYWRkIHN0YWNrIHRyYW5zZm9ybSB0byBtYXJrXG4gIG1kZWYuZnJvbS50cmFuc2Zvcm0gPSBbe1xuICAgIHR5cGU6ICdzdGFjaycsXG4gICAgcG9pbnQ6IGVuY29kaW5nLmZpZWxkUmVmKGRpbSksXG4gICAgaGVpZ2h0OiBlbmNvZGluZy5maWVsZFJlZih2YWwpLFxuICAgIG91dHB1dDoge3kxOiB2YWwsIHkwOiB2YWwgKyAnMid9XG4gIH1dO1xuXG4gIC8vIFRPRE86IFRoaXMgaXMgc3VwZXIgaGFjay1pc2ggLS0gY29uc29saWRhdGUgaW50byBtb2R1bGFyIG1hcmsgcHJvcGVydGllcz9cbiAgbWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZVt2YWxdID0gbWRlZi5wcm9wZXJ0aWVzLmVudGVyW3ZhbF0gPSB7c2NhbGU6IHZhbCwgZmllbGQ6IHZhbH07XG4gIG1kZWYucHJvcGVydGllcy51cGRhdGVbdmFsICsgJzInXSA9IG1kZWYucHJvcGVydGllcy5lbnRlclt2YWwgKyAnMiddID0ge3NjYWxlOiB2YWwsIGZpZWxkOiB2YWwgKyAnMid9O1xuXG4gIHJldHVybiB2YWw7IC8vcmV0dXJuIHN0YWNrIGVuY29kaW5nXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHZsZmllbGQgPSByZXF1aXJlKCcuLi9maWVsZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVuY29kaW5nLCBzdGF0cykge1xuICByZXR1cm4ge1xuICAgIG9wYWNpdHk6IGVzdGltYXRlT3BhY2l0eShlbmNvZGluZywgc3RhdHMpLFxuICB9O1xufTtcblxuZnVuY3Rpb24gZXN0aW1hdGVPcGFjaXR5KGVuY29kaW5nLHN0YXRzKSB7XG4gIGlmICghc3RhdHMpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIHZhciBudW1Qb2ludHMgPSAwO1xuXG4gIGlmIChlbmNvZGluZy5pc0FnZ3JlZ2F0ZSgpKSB7IC8vIGFnZ3JlZ2F0ZSBwbG90XG4gICAgbnVtUG9pbnRzID0gMTtcblxuICAgIC8vICBnZXQgbnVtYmVyIG9mIHBvaW50cyBpbiBlYWNoIFwiY2VsbFwiXG4gICAgLy8gIGJ5IGNhbGN1bGF0aW5nIHByb2R1Y3Qgb2YgY2FyZGluYWxpdHlcbiAgICAvLyAgZm9yIGVhY2ggbm9uIGZhY2V0aW5nIGFuZCBub24tb3JkaW5hbCBYIC8gWSBmaWVsZHNcbiAgICAvLyAgbm90ZSB0aGF0IG9yZGluYWwgeCx5IGFyZSBub3QgaW5jbHVkZSBzaW5jZSB3ZSBjYW5cbiAgICAvLyAgY29uc2lkZXIgdGhhdCBvcmRpbmFsIHggYXJlIHN1YmRpdmlkaW5nIHRoZSBjZWxsIGludG8gc3ViY2VsbHMgYW55d2F5XG4gICAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuXG4gICAgICBpZiAoZW5jVHlwZSAhPT0gUk9XICYmIGVuY1R5cGUgIT09IENPTCAmJlxuICAgICAgICAgICEoKGVuY1R5cGUgPT09IFggfHwgZW5jVHlwZSA9PT0gWSkgJiZcbiAgICAgICAgICB2bGZpZWxkLmlzT3JkaW5hbFNjYWxlKGZpZWxkKSlcbiAgICAgICAgKSB7XG4gICAgICAgIG51bVBvaW50cyAqPSBlbmNvZGluZy5jYXJkaW5hbGl0eShlbmNUeXBlLCBzdGF0cyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfSBlbHNlIHsgLy8gcmF3IHBsb3RcblxuICAgIC8vIFRPRE86IGVycm9yIGhhbmRsaW5nXG4gICAgaWYgKCFzdGF0c1snKiddKVxuICAgICAgcmV0dXJuIDE7XG5cbiAgICBudW1Qb2ludHMgPSBzdGF0c1snKiddLm1heDsgIC8vIGNvdW50XG5cbiAgICAvLyBzbWFsbCBtdWx0aXBsZXMgZGl2aWRlIG51bWJlciBvZiBwb2ludHNcbiAgICB2YXIgbnVtTXVsdGlwbGVzID0gMTtcbiAgICBpZiAoZW5jb2RpbmcuaGFzKFJPVykpIHtcbiAgICAgIG51bU11bHRpcGxlcyAqPSBlbmNvZGluZy5jYXJkaW5hbGl0eShST1csIHN0YXRzKTtcbiAgICB9XG4gICAgaWYgKGVuY29kaW5nLmhhcyhDT0wpKSB7XG4gICAgICBudW1NdWx0aXBsZXMgKj0gZW5jb2RpbmcuY2FyZGluYWxpdHkoQ09MLCBzdGF0cyk7XG4gICAgfVxuICAgIG51bVBvaW50cyAvPSBudW1NdWx0aXBsZXM7XG4gIH1cblxuICB2YXIgb3BhY2l0eSA9IDA7XG4gIGlmIChudW1Qb2ludHMgPD0gMjUpIHtcbiAgICBvcGFjaXR5ID0gMTtcbiAgfSBlbHNlIGlmIChudW1Qb2ludHMgPCAyMDApIHtcbiAgICBvcGFjaXR5ID0gMC44O1xuICB9IGVsc2UgaWYgKG51bVBvaW50cyA8IDEwMDAgfHwgZW5jb2RpbmcuaXMoJ3RpY2snKSkge1xuICAgIG9wYWNpdHkgPSAwLjc7XG4gIH0gZWxzZSB7XG4gICAgb3BhY2l0eSA9IDAuMztcbiAgfVxuXG4gIHJldHVybiBvcGFjaXR5O1xufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdWJmYWNldGluZztcblxuZnVuY3Rpb24gc3ViZmFjZXRpbmcoZ3JvdXAsIG1kZWYsIGRldGFpbHMsIHN0YWNrLCBlbmNvZGluZykge1xuICB2YXIgbSA9IGdyb3VwLm1hcmtzO1xuICB2YXIgZyA9IHtcbiAgICBfbmFtZTogJ3N1YmZhY2V0JyxcbiAgICB0eXBlOiAnZ3JvdXAnLFxuICAgIGZyb206IG1kZWYuZnJvbSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBlbnRlcjoge1xuICAgICAgICB3aWR0aDoge2dyb3VwOiAnd2lkdGgnfSxcbiAgICAgICAgaGVpZ2h0OiB7Z3JvdXA6ICdoZWlnaHQnfVxuICAgICAgfVxuICAgIH0sXG4gICAgbWFya3M6IG1cbiAgfTtcblxuICBncm91cC5tYXJrcyA9IFtnXTtcbiAgZGVsZXRlIG1kZWYuZnJvbTsgLy8gKG1vdmUgdG8gdGhlIG5ldyBnKVxuXG4gIC8vVE9ETyB0ZXN0IExPRCAtLSB3ZSBzaG91bGQgc3VwcG9ydCBzdGFjayAvIGxpbmUgd2l0aG91dCBjb2xvciAoTE9EKSBmaWVsZFxuICB2YXIgdHJhbnMgPSAoZy5mcm9tLnRyYW5zZm9ybSB8fCAoZy5mcm9tLnRyYW5zZm9ybSA9IFtdKSk7XG4gIHRyYW5zLnVuc2hpZnQoe3R5cGU6ICdmYWNldCcsIGtleXM6IGRldGFpbHN9KTtcblxuICBpZiAoc3RhY2sgJiYgZW5jb2RpbmcuaGFzKENPTE9SKSkge1xuICAgIHRyYW5zLnVuc2hpZnQoe3R5cGU6ICdzb3J0JywgYnk6IGVuY29kaW5nLmZpZWxkUmVmKENPTE9SKX0pO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICBkM190aW1lX2Zvcm1hdCA9IHJlcXVpcmUoJ2QzLXRpbWUtZm9ybWF0Jyk7XG5cbnZhciB0aW1lID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gJ1dlZG5lc2RheSBTZXB0ZW1iZXIgMTcgMDQ6MDA6MDAgMjAxNCdcbi8vIFdlZG5lc2RheSBpcyB0aGUgbG9uZ2VzdCBkYXRlXG4vLyBTZXB0ZW1iZXIgaXMgdGhlIGxvbmdlc3QgbW9udGggKDggaW4gamF2YXNjcmlwdCBhcyBpdCBpcyB6ZXJvLWluZGV4ZWQpLlxudmFyIExPTkdfREFURSA9IG5ldyBEYXRlKERhdGUuVVRDKDIwMTQsIDgsIDE3KSk7XG5cbnRpbWUuY2FyZGluYWxpdHkgPSBmdW5jdGlvbihmaWVsZCwgc3RhdHMsIGZpbHRlck51bGwsIHR5cGUpIHtcbiAgdmFyIHRpbWVVbml0ID0gZmllbGQudGltZVVuaXQ7XG4gIHN3aXRjaCAodGltZVVuaXQpIHtcbiAgICBjYXNlICdzZWNvbmRzJzogcmV0dXJuIDYwO1xuICAgIGNhc2UgJ21pbnV0ZXMnOiByZXR1cm4gNjA7XG4gICAgY2FzZSAnaG91cnMnOiByZXR1cm4gMjQ7XG4gICAgY2FzZSAnZGF5JzogcmV0dXJuIDc7XG4gICAgY2FzZSAnZGF0ZSc6IHJldHVybiAzMTtcbiAgICBjYXNlICdtb250aCc6IHJldHVybiAxMjtcbiAgICBjYXNlICd5ZWFyJzpcbiAgICAgIHZhciBzdGF0ID0gc3RhdHNbZmllbGQubmFtZV0sXG4gICAgICAgIHllYXJzdGF0ID0gc3RhdHNbJ3llYXJfJytmaWVsZC5uYW1lXTtcblxuICAgICAgaWYgKCF5ZWFyc3RhdCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgICByZXR1cm4geWVhcnN0YXQuZGlzdGluY3QgLVxuICAgICAgICAoc3RhdC5udWxscyA+IDAgJiYgZmlsdGVyTnVsbFt0eXBlXSA/IDEgOiAwKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxudGltZS5mb3JtdWxhID0gZnVuY3Rpb24odGltZVVuaXQsIGZpZWxkUmVmKSB7XG4gIC8vIFRPRE8oa2FuaXR3KTogYWRkIGZvcm11bGEgdG8gb3RoZXIgdGltZSBmb3JtYXRcbiAgdmFyIGZuID0gJ3V0YycgKyB0aW1lVW5pdDtcbiAgcmV0dXJuIGZuICsgJygnICsgZmllbGRSZWYgKyAnKSc7XG59O1xuXG50aW1lLm1heExlbmd0aCA9IGZ1bmN0aW9uKHRpbWVVbml0LCBlbmNvZGluZykge1xuICBzd2l0Y2ggKHRpbWVVbml0KSB7XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnbWludXRlcyc6XG4gICAgY2FzZSAnaG91cnMnOlxuICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgcmV0dXJuIDI7XG4gICAgY2FzZSAnbW9udGgnOlxuICAgIGNhc2UgJ2RheSc6XG4gICAgICB2YXIgcmFuZ2UgPSB0aW1lLnJhbmdlKHRpbWVVbml0LCBlbmNvZGluZyk7XG4gICAgICBpZiAocmFuZ2UpIHtcbiAgICAgICAgLy8gcmV0dXJuIHRoZSBsb25nZXN0IG5hbWUgaW4gdGhlIHJhbmdlXG4gICAgICAgIHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCByYW5nZS5tYXAoZnVuY3Rpb24ocikge3JldHVybiByLmxlbmd0aDt9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gMjtcbiAgICBjYXNlICd5ZWFyJzpcbiAgICAgIHJldHVybiA0OyAvLycxOTk4J1xuICB9XG4gIC8vIFRPRE8oIzYwMCkgcmV2aXNlIHRoaXNcbiAgLy8gbm8gdGltZSB1bml0XG4gIHZhciB0aW1lRm9ybWF0ID0gZW5jb2RpbmcuY29uZmlnKCd0aW1lRm9ybWF0Jyk7XG4gIHJldHVybiBkM190aW1lX2Zvcm1hdC51dGNGb3JtYXQodGltZUZvcm1hdCkoTE9OR19EQVRFKS5sZW5ndGg7XG59O1xuXG50aW1lLnJhbmdlID0gZnVuY3Rpb24odGltZVVuaXQsIGVuY29kaW5nKSB7XG4gIHZhciBsYWJlbExlbmd0aCA9IGVuY29kaW5nLmNvbmZpZygndGltZVNjYWxlTGFiZWxMZW5ndGgnKSxcbiAgICBzY2FsZUxhYmVsO1xuICBzd2l0Y2ggKHRpbWVVbml0KSB7XG4gICAgY2FzZSAnZGF5JzpcbiAgICAgIHNjYWxlTGFiZWwgPSBlbmNvZGluZy5jb25maWcoJ2RheVNjYWxlTGFiZWwnKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgIHNjYWxlTGFiZWwgPSBlbmNvZGluZy5jb25maWcoJ21vbnRoU2NhbGVMYWJlbCcpO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgaWYgKHNjYWxlTGFiZWwpIHtcbiAgICByZXR1cm4gbGFiZWxMZW5ndGggPyBzY2FsZUxhYmVsLm1hcChcbiAgICAgICAgZnVuY3Rpb24ocykgeyByZXR1cm4gcy5zdWJzdHIoMCwgbGFiZWxMZW5ndGgpO31cbiAgICAgICkgOiBzY2FsZUxhYmVsO1xuICB9XG4gIHJldHVybjtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGVuY29kaW5nXG4gKiBAcmV0dXJuIHtBcnJheX0gIHNjYWxlcyBmb3IgdGltZSB1bml0IG5hbWVzXG4gKi9cbnRpbWUuc2NhbGVzID0gZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgdmFyIHNjYWxlcyA9IGVuY29kaW5nLnJlZHVjZShmdW5jdGlvbihzY2FsZXMsIGZpZWxkKSB7XG4gICAgdmFyIHRpbWVVbml0ID0gZmllbGQudGltZVVuaXQ7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT09IFQgJiYgdGltZVVuaXQgJiYgIXNjYWxlc1t0aW1lVW5pdF0pIHtcbiAgICAgIHZhciBzY2FsZSA9IHRpbWUuc2NhbGUuZGVmKGZpZWxkLnRpbWVVbml0LCBlbmNvZGluZyk7XG4gICAgICBpZiAoc2NhbGUpIHNjYWxlc1t0aW1lVW5pdF0gPSBzY2FsZTtcbiAgICB9XG4gICAgcmV0dXJuIHNjYWxlcztcbiAgfSwge30pO1xuXG4gIHJldHVybiB1dGlsLnZhbHMoc2NhbGVzKTtcbn07XG5cblxudGltZS5zY2FsZSA9IHt9O1xuXG4vKiogYXBwZW5kIGN1c3RvbSB0aW1lIHNjYWxlcyBmb3IgYXhpcyBsYWJlbCAqL1xudGltZS5zY2FsZS5kZWYgPSBmdW5jdGlvbih0aW1lVW5pdCwgZW5jb2RpbmcpIHtcbiAgdmFyIHJhbmdlID0gdGltZS5yYW5nZSh0aW1lVW5pdCwgZW5jb2RpbmcpO1xuXG4gIGlmIChyYW5nZSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAndGltZS0nK3RpbWVVbml0LFxuICAgICAgdHlwZTogJ29yZGluYWwnLFxuICAgICAgZG9tYWluOiB0aW1lLnNjYWxlLmRvbWFpbih0aW1lVW5pdCksXG4gICAgICByYW5nZTogcmFuZ2VcbiAgICB9O1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxudGltZS5pc09yZGluYWxGbiA9IGZ1bmN0aW9uKHRpbWVVbml0KSB7XG4gIHN3aXRjaCAodGltZVVuaXQpIHtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkYXRlJzpcbiAgICBjYXNlICdtb250aCc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG50aW1lLnNjYWxlLnR5cGUgPSBmdW5jdGlvbih0aW1lVW5pdCwgbmFtZSkge1xuICBpZiAobmFtZSA9PT0gQ09MT1IpIHtcbiAgICByZXR1cm4gJ2xpbmVhcic7IC8vIHRpbWUgaGFzIG9yZGVyLCBzbyB1c2UgaW50ZXJwb2xhdGVkIG9yZGluYWwgY29sb3Igc2NhbGUuXG4gIH1cblxuICByZXR1cm4gdGltZS5pc09yZGluYWxGbih0aW1lVW5pdCkgfHwgbmFtZSA9PT0gQ09MIHx8IG5hbWUgPT09IFJPVyA/ICdvcmRpbmFsJyA6ICdsaW5lYXInO1xufTtcblxudGltZS5zY2FsZS5kb21haW4gPSBmdW5jdGlvbih0aW1lVW5pdCwgbmFtZSkge1xuICB2YXIgaXNDb2xvciA9IG5hbWUgPT09IENPTE9SO1xuICBzd2l0Y2ggKHRpbWVVbml0KSB7XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnbWludXRlcyc6IHJldHVybiBpc0NvbG9yID8gWzAsNTldIDogdXRpbC5yYW5nZSgwLCA2MCk7XG4gICAgY2FzZSAnaG91cnMnOiByZXR1cm4gaXNDb2xvciA/IFswLDIzXSA6IHV0aWwucmFuZ2UoMCwgMjQpO1xuICAgIGNhc2UgJ2RheSc6IHJldHVybiBpc0NvbG9yID8gWzAsNl0gOiB1dGlsLnJhbmdlKDAsIDcpO1xuICAgIGNhc2UgJ2RhdGUnOiByZXR1cm4gaXNDb2xvciA/IFsxLDMxXSA6IHV0aWwucmFuZ2UoMSwgMzIpO1xuICAgIGNhc2UgJ21vbnRoJzogcmV0dXJuIGlzQ29sb3IgPyBbMCwxMV0gOiB1dGlsLnJhbmdlKDAsIDEyKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbi8qKiB3aGV0aGVyIGEgcGFydGljdWxhciB0aW1lIGZ1bmN0aW9uIGhhcyBjdXN0b20gc2NhbGUgZm9yIGxhYmVscyBpbXBsZW1lbnRlZCBpbiB0aW1lLnNjYWxlICovXG50aW1lLmhhc1NjYWxlID0gZnVuY3Rpb24odGltZVVuaXQpIHtcbiAgc3dpdGNoICh0aW1lVW5pdCkge1xuICAgIGNhc2UgJ2RheSc6XG4gICAgY2FzZSAnbW9udGgnOlxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9nbG9iYWxzJyk7XG5cbnZhciBjb25zdHMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5jb25zdHMuZW5jb2RpbmdUeXBlcyA9IFtYLCBZLCBST1csIENPTCwgU0laRSwgU0hBUEUsIENPTE9SLCBURVhULCBERVRBSUxdO1xuXG5jb25zdHMuc2hvcnRoYW5kID0ge1xuICBkZWxpbTogICd8JyxcbiAgYXNzaWduOiAnPScsXG4gIHR5cGU6ICAgJywnLFxuICBmdW5jOiAgICdfJ1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9nbG9iYWxzJyk7XG5cbnZhciBzdGF0cyA9IHJlcXVpcmUoJ2RhdGFsaWIvc3JjL3N0YXRzJyk7XG5cbnZhciB2bGRhdGEgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vKiogTWFwcGluZyBmcm9tIGRhdGFsaWIncyBpbmZlcnJlZCB0eXBlIHRvIFZlZ2EtbGl0ZSdzIHR5cGUgKi9cbnZsZGF0YS50eXBlcyA9IHtcbiAgJ2Jvb2xlYW4nOiBOLFxuICAnbnVtYmVyJzogUSxcbiAgJ2ludGVnZXInOiBRLFxuICAnZGF0ZSc6IFQsXG4gICdzdHJpbmcnOiBOXG59O1xuXG52bGRhdGEuc3RhdHMgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHZhciBzdW1tYXJ5ID0gc3RhdHMuc3VtbWFyeShkYXRhKTtcblxuICByZXR1cm4gc3VtbWFyeS5yZWR1Y2UoZnVuY3Rpb24ocywgcHJvZmlsZSkge1xuICAgIHNbcHJvZmlsZS5maWVsZF0gPSBwcm9maWxlO1xuICAgIHJldHVybiBzO1xuICB9LCB7XG4gICAgJyonOiB7XG4gICAgICBtYXg6IGRhdGEubGVuZ3RoLFxuICAgICAgbWluOiAwXG4gICAgfVxuICB9KTtcbn07IiwiLy8gdXRpbGl0eSBmb3IgZW5jXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGNvbnN0cyA9IHJlcXVpcmUoJy4vY29uc3RzJyksXG4gIGMgPSBjb25zdHMuc2hvcnRoYW5kLFxuICB2bGZpZWxkID0gcmVxdWlyZSgnLi9maWVsZCcpLFxuICB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gIHNjaGVtYSA9IHJlcXVpcmUoJy4vc2NoZW1hL3NjaGVtYScpLFxuICBlbmNUeXBlcyA9IHNjaGVtYS5lbmNUeXBlcztcblxudmFyIHZsZW5jID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxudmxlbmMuY291bnRSZXRpbmFsID0gZnVuY3Rpb24oZW5jKSB7XG4gIHZhciBjb3VudCA9IDA7XG4gIGlmIChlbmMuY29sb3IpIGNvdW50Kys7XG4gIGlmIChlbmMuc2l6ZSkgY291bnQrKztcbiAgaWYgKGVuYy5zaGFwZSkgY291bnQrKztcbiAgcmV0dXJuIGNvdW50O1xufTtcblxudmxlbmMuaGFzID0gZnVuY3Rpb24oZW5jLCBlbmNUeXBlKSB7XG4gIHZhciBmaWVsZERlZiA9IGVuYyAmJiBlbmNbZW5jVHlwZV07XG4gIHJldHVybiBmaWVsZERlZiAmJiBmaWVsZERlZi5uYW1lO1xufTtcblxudmxlbmMuaXNBZ2dyZWdhdGUgPSBmdW5jdGlvbihlbmMpIHtcbiAgZm9yICh2YXIgayBpbiBlbmMpIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykgJiYgZW5jW2tdLmFnZ3JlZ2F0ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnZsZW5jLmZvckVhY2ggPSBmdW5jdGlvbihlbmMsIGYpIHtcbiAgdmFyIGkgPSAwO1xuICBlbmNUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykpIHtcbiAgICAgIGYoZW5jW2tdLCBrLCBpKyspO1xuICAgIH1cbiAgfSk7XG59O1xuXG52bGVuYy5tYXAgPSBmdW5jdGlvbihlbmMsIGYpIHtcbiAgdmFyIGFyciA9IFtdO1xuICBlbmNUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykpIHtcbiAgICAgIGFyci5wdXNoKGYoZW5jW2tdLCBrLCBlbmMpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXJyO1xufTtcblxudmxlbmMucmVkdWNlID0gZnVuY3Rpb24oZW5jLCBmLCBpbml0KSB7XG4gIHZhciByID0gaW5pdDtcbiAgZW5jVHlwZXMuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgaWYgKHZsZW5jLmhhcyhlbmMsIGspKSB7XG4gICAgICByID0gZihyLCBlbmNba10sIGssICBlbmMpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByO1xufTtcblxuLypcbiAqIHJldHVybiBrZXktdmFsdWUgcGFpcnMgb2YgZmllbGQgbmFtZSBhbmQgbGlzdCBvZiBmaWVsZHMgb2YgdGhhdCBmaWVsZCBuYW1lXG4gKi9cbnZsZW5jLmZpZWxkcyA9IGZ1bmN0aW9uKGVuYykge1xuICByZXR1cm4gdmxlbmMucmVkdWNlKGVuYywgZnVuY3Rpb24gKG0sIGZpZWxkKSB7XG4gICAgdmFyIGZpZWxkTGlzdCA9IG1bZmllbGQubmFtZV0gPSBtW2ZpZWxkLm5hbWVdIHx8IFtdLFxuICAgICAgY29udGFpbnNUeXBlID0gZmllbGRMaXN0LmNvbnRhaW5zVHlwZSA9IGZpZWxkTGlzdC5jb250YWluc1R5cGUgfHwge307XG5cbiAgICBpZiAoZmllbGRMaXN0LmluZGV4T2YoZmllbGQpID09PSAtMSkge1xuICAgICAgZmllbGRMaXN0LnB1c2goZmllbGQpO1xuICAgICAgLy8gYXVnbWVudCB0aGUgYXJyYXkgd2l0aCBjb250YWluc1R5cGUuUSAvIE8gLyBOIC8gVFxuICAgICAgY29udGFpbnNUeXBlW2ZpZWxkLnR5cGVdID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG07XG4gIH0sIHt9KTtcbn07XG5cbnZsZW5jLnNob3J0aGFuZCA9IGZ1bmN0aW9uKGVuYykge1xuICByZXR1cm4gdmxlbmMubWFwKGVuYywgZnVuY3Rpb24oZmllbGQsIGV0KSB7XG4gICAgcmV0dXJuIGV0ICsgYy5hc3NpZ24gKyB2bGZpZWxkLnNob3J0aGFuZChmaWVsZCk7XG4gIH0pLmpvaW4oYy5kZWxpbSk7XG59O1xuXG52bGVuYy5mcm9tU2hvcnRoYW5kID0gZnVuY3Rpb24oc2hvcnRoYW5kKSB7XG4gIHZhciBlbmMgPSB1dGlsLmlzQXJyYXkoc2hvcnRoYW5kKSA/IHNob3J0aGFuZCA6IHNob3J0aGFuZC5zcGxpdChjLmRlbGltKTtcbiAgcmV0dXJuIGVuYy5yZWR1Y2UoZnVuY3Rpb24obSwgZSkge1xuICAgIHZhciBzcGxpdCA9IGUuc3BsaXQoYy5hc3NpZ24pLFxuICAgICAgICBlbmN0eXBlID0gc3BsaXRbMF0udHJpbSgpLFxuICAgICAgICBmaWVsZCA9IHNwbGl0WzFdO1xuXG4gICAgbVtlbmN0eXBlXSA9IHZsZmllbGQuZnJvbVNob3J0aGFuZChmaWVsZCk7XG4gICAgcmV0dXJuIG07XG4gIH0sIHt9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIHV0aWxpdHkgZm9yIGZpZWxkXG5cbnJlcXVpcmUoJy4vZ2xvYmFscycpO1xuXG52YXIgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKSxcbiAgYyA9IGNvbnN0cy5zaG9ydGhhbmQsXG4gIHRpbWUgPSByZXF1aXJlKCcuL2NvbXBpbGVyL3RpbWUnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICBzY2hlbWEgPSByZXF1aXJlKCcuL3NjaGVtYS9zY2hlbWEnKTtcblxudmFyIHZsZmllbGQgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vKipcbiAqIEBwYXJhbSBmaWVsZFxuICogQHBhcmFtIG9wdFxuICogICBvcHQubm9mbiAtLSBleGNsdWRlIGJpbiwgYWdncmVnYXRlLCB0aW1lVW5pdFxuICogICBvcHQuZGF0YSAtIGluY2x1ZGUgJ2RhdGEuJ1xuICogICBvcHQuZCAtIGluY2x1ZGUgJ2QuJ1xuICogICBvcHQuZm4gLSByZXBsYWNlIGZuIHdpdGggY3VzdG9tIGZ1bmN0aW9uIHByZWZpeFxuICogICBvcHQucHJlZm4gLSBwcmVwZW5kIGZuIHdpdGggY3VzdG9tIGZ1bmN0aW9uIHByZWZpeFxuXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xudmxmaWVsZC5maWVsZFJlZiA9IGZ1bmN0aW9uKGZpZWxkLCBvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gIHZhciBmID0gKG9wdC5kID8gJ2QuJyA6ICcnKSArXG4gICAgICAgICAgKG9wdC5kYXRhID8gJ2RhdGEuJyA6ICcnKSArXG4gICAgICAgICAgKG9wdC5wcmVmbiB8fCAnJyksXG4gICAgbm9mbiA9IG9wdC5ub2ZuIHx8IG9wdC5mbixcbiAgICBuYW1lID0gZmllbGQubmFtZTtcblxuICBpZiAodmxmaWVsZC5pc0NvdW50KGZpZWxkKSkge1xuICAgIHJldHVybiBmICsgJ2NvdW50JztcbiAgfSBlbHNlIGlmICghbm9mbiAmJiBmaWVsZC5iaW4pIHtcbiAgICByZXR1cm4gZiArICdiaW5fJyArIG5hbWU7XG4gIH0gZWxzZSBpZiAoIW5vZm4gJiYgZmllbGQuYWdncmVnYXRlKSB7XG4gICAgcmV0dXJuIGYgKyBmaWVsZC5hZ2dyZWdhdGUgKyAnXycgKyBuYW1lO1xuICB9IGVsc2UgaWYgKCFub2ZuICYmIGZpZWxkLnRpbWVVbml0KSB7XG4gICAgcmV0dXJuIGYgKyBmaWVsZC50aW1lVW5pdCArICdfJyArIG5hbWU7XG4gIH0gZWxzZSBpZiAob3B0LmZuKSB7XG4gICAgcmV0dXJuIGYgKyBvcHQuZm4gKyAnXycgKyBuYW1lO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmICsgbmFtZTtcbiAgfVxufTtcblxudmxmaWVsZC5zaG9ydGhhbmQgPSBmdW5jdGlvbihmKSB7XG4gIHZhciBjID0gY29uc3RzLnNob3J0aGFuZDtcbiAgcmV0dXJuIChmLmFnZ3JlZ2F0ZSA/IGYuYWdncmVnYXRlICsgYy5mdW5jIDogJycpICtcbiAgICAoZi50aW1lVW5pdCA/IGYudGltZVVuaXQgKyBjLmZ1bmMgOiAnJykgK1xuICAgIChmLmJpbiA/ICdiaW4nICsgYy5mdW5jIDogJycpICtcbiAgICAoZi5uYW1lIHx8ICcnKSArIGMudHlwZSArIGYudHlwZTtcbn07XG5cbnZsZmllbGQuc2hvcnRoYW5kcyA9IGZ1bmN0aW9uKGZpZWxkcywgZGVsaW0pIHtcbiAgZGVsaW0gPSBkZWxpbSB8fCBjLmRlbGltO1xuICByZXR1cm4gZmllbGRzLm1hcCh2bGZpZWxkLnNob3J0aGFuZCkuam9pbihkZWxpbSk7XG59O1xuXG52bGZpZWxkLmZyb21TaG9ydGhhbmQgPSBmdW5jdGlvbihzaG9ydGhhbmQpIHtcbiAgdmFyIHNwbGl0ID0gc2hvcnRoYW5kLnNwbGl0KGMudHlwZSksIGk7XG4gIHZhciBvID0ge1xuICAgIG5hbWU6IHNwbGl0WzBdLnRyaW0oKSxcbiAgICB0eXBlOiBzcGxpdFsxXS50cmltKClcbiAgfTtcblxuICAvLyBjaGVjayBhZ2dyZWdhdGUgdHlwZVxuICBmb3IgKGkgaW4gc2NoZW1hLmFnZ3JlZ2F0ZS5lbnVtKSB7XG4gICAgdmFyIGEgPSBzY2hlbWEuYWdncmVnYXRlLmVudW1baV07XG4gICAgaWYgKG8ubmFtZS5pbmRleE9mKGEgKyAnXycpID09PSAwKSB7XG4gICAgICBvLm5hbWUgPSBvLm5hbWUuc3Vic3RyKGEubGVuZ3RoICsgMSk7XG4gICAgICBpZiAoYSA9PSAnY291bnQnICYmIG8ubmFtZS5sZW5ndGggPT09IDApIG8ubmFtZSA9ICcqJztcbiAgICAgIG8uYWdncmVnYXRlID0gYTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNoZWNrIHRpbWUgdGltZVVuaXRcbiAgZm9yIChpIGluIHNjaGVtYS50aW1lZm5zKSB7XG4gICAgdmFyIHR1ID0gc2NoZW1hLnRpbWVmbnNbaV07XG4gICAgaWYgKG8ubmFtZSAmJiBvLm5hbWUuaW5kZXhPZih0dSArICdfJykgPT09IDApIHtcbiAgICAgIG8ubmFtZSA9IG8ubmFtZS5zdWJzdHIoby5sZW5ndGggKyAxKTtcbiAgICAgIG8udGltZVVuaXQgPSB0dTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNoZWNrIGJpblxuICBpZiAoby5uYW1lICYmIG8ubmFtZS5pbmRleE9mKCdiaW5fJykgPT09IDApIHtcbiAgICBvLm5hbWUgPSBvLm5hbWUuc3Vic3RyKDQpO1xuICAgIG8uYmluID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBvO1xufTtcblxudmFyIGlzVHlwZSA9IHZsZmllbGQuaXNUeXBlID0gZnVuY3Rpb24gKGZpZWxkRGVmLCB0eXBlKSB7XG4gIHJldHVybiBmaWVsZERlZi50eXBlID09PSB0eXBlO1xufTtcblxudmFyIGlzVHlwZXMgPSB2bGZpZWxkLmlzVHlwZXMgPSBmdW5jdGlvbiAoZmllbGREZWYsIHR5cGVzKSB7XG4gIGZvciAodmFyIHQ9MDsgdDx0eXBlcy5sZW5ndGg7IHQrKykge1xuICAgIGlmKGZpZWxkRGVmLnR5cGUgPT09IHR5cGVzW3RdKSByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKlxuICogTW9zdCBmaWVsZHMgdGhhdCB1c2Ugb3JkaW5hbCBzY2FsZSBhcmUgZGltZW5zaW9ucy5cbiAqIEhvd2V2ZXIsIFlFQVIoVCksIFlFQVJNT05USChUKSB1c2UgdGltZSBzY2FsZSwgbm90IG9yZGluYWwgYnV0IGFyZSBkaW1lbnNpb25zIHRvby5cbiAqL1xudmxmaWVsZC5pc09yZGluYWxTY2FsZSA9IGZ1bmN0aW9uKGZpZWxkKSB7XG4gIHJldHVybiAgaXNUeXBlcyhmaWVsZCwgW04sIE9dKSB8fCBmaWVsZC5iaW4gfHxcbiAgICAoIGlzVHlwZShmaWVsZCwgVCkgJiYgZmllbGQudGltZVVuaXQgJiYgdGltZS5pc09yZGluYWxGbihmaWVsZC50aW1lVW5pdCkgKTtcbn07XG5cbmZ1bmN0aW9uIGlzRGltZW5zaW9uKGZpZWxkKSB7XG4gIHJldHVybiAgaXNUeXBlcyhmaWVsZCwgW04sIE9dKSB8fCAhIWZpZWxkLmJpbiB8fFxuICAgICggaXNUeXBlKGZpZWxkLCBUKSAmJiAhIWZpZWxkLnRpbWVVbml0ICk7XG59XG5cbi8qKlxuICogRm9yIGVuY29kaW5nLCB1c2UgZW5jb2RpbmcuaXNEaW1lbnNpb24oKSB0byBhdm9pZCBjb25mdXNpb24uXG4gKiBPciB1c2UgRW5jb2RpbmcuaXNUeXBlIGlmIHlvdXIgZmllbGQgaXMgZnJvbSBFbmNvZGluZyAoYW5kIHRodXMgaGF2ZSBudW1lcmljIGRhdGEgdHlwZSkuXG4gKiBvdGhlcndpc2UsIGRvIG5vdCBzcGVjaWZpYyBpc1R5cGUgc28gd2UgY2FuIHVzZSB0aGUgZGVmYXVsdCBpc1R5cGVOYW1lIGhlcmUuXG4gKi9cbnZsZmllbGQuaXNEaW1lbnNpb24gPSBmdW5jdGlvbihmaWVsZCkge1xuICByZXR1cm4gZmllbGQgJiYgaXNEaW1lbnNpb24oZmllbGQpO1xufTtcblxudmxmaWVsZC5pc01lYXN1cmUgPSBmdW5jdGlvbihmaWVsZCkge1xuICByZXR1cm4gZmllbGQgJiYgIWlzRGltZW5zaW9uKGZpZWxkKTtcbn07XG5cbnZsZmllbGQuY291bnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtuYW1lOicqJywgYWdncmVnYXRlOiAnY291bnQnLCB0eXBlOiBRLCBkaXNwbGF5TmFtZTogdmxmaWVsZC5jb3VudC5kaXNwbGF5TmFtZX07XG59O1xuXG52bGZpZWxkLmNvdW50LmRpc3BsYXlOYW1lID0gJ051bWJlciBvZiBSZWNvcmRzJztcblxudmxmaWVsZC5pc0NvdW50ID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIGZpZWxkLmFnZ3JlZ2F0ZSA9PT0gJ2NvdW50Jztcbn07XG5cbi8qKlxuICogRm9yIGVuY29kaW5nLCB1c2UgZW5jb2RpbmcuY2FyZGluYWxpdHkoKSB0byBhdm9pZCBjb25mdXNpb24uICBPciB1c2UgRW5jb2RpbmcuaXNUeXBlIGlmIHlvdXIgZmllbGQgaXMgZnJvbSBFbmNvZGluZyAoYW5kIHRodXMgaGF2ZSBudW1lcmljIGRhdGEgdHlwZSkuXG4gKiBvdGhlcndpc2UsIGRvIG5vdCBzcGVjaWZpYyBpc1R5cGUgc28gd2UgY2FuIHVzZSB0aGUgZGVmYXVsdCBpc1R5cGVOYW1lIGhlcmUuXG4gKi9cbnZsZmllbGQuY2FyZGluYWxpdHkgPSBmdW5jdGlvbihmaWVsZCwgc3RhdHMsIGZpbHRlck51bGwpIHtcbiAgLy8gRklYTUUgbmVlZCB0byB0YWtlIGZpbHRlciBpbnRvIGFjY291bnRcblxuICB2YXIgc3RhdCA9IHN0YXRzW2ZpZWxkLm5hbWVdO1xuICB2YXIgdHlwZSA9IGZpZWxkLnR5cGU7XG5cbiAgZmlsdGVyTnVsbCA9IGZpbHRlck51bGwgfHwge307XG5cbiAgaWYgKGZpZWxkLmJpbikge1xuICAgIHZhciBiaW5zID0gdXRpbC5nZXRiaW5zKHN0YXQsIGZpZWxkLmJpbi5tYXhiaW5zIHx8IHNjaGVtYS5NQVhCSU5TX0RFRkFVTFQpO1xuICAgIHJldHVybiAoYmlucy5zdG9wIC0gYmlucy5zdGFydCkgLyBiaW5zLnN0ZXA7XG4gIH1cbiAgaWYgKGlzVHlwZShmaWVsZCwgVCkpIHtcbiAgICB2YXIgY2FyZGluYWxpdHkgPSB0aW1lLmNhcmRpbmFsaXR5KGZpZWxkLCBzdGF0cywgZmlsdGVyTnVsbCwgdHlwZSk7XG4gICAgaWYoY2FyZGluYWxpdHkgIT09IG51bGwpIHJldHVybiBjYXJkaW5hbGl0eTtcbiAgICAvL290aGVyd2lzZSB1c2UgY2FsY3VsYXRpb24gYmVsb3dcbiAgfVxuICBpZiAoZmllbGQuYWdncmVnYXRlKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICAvLyByZW1vdmUgbnVsbFxuICByZXR1cm4gc3RhdC5kaXN0aW5jdCAtXG4gICAgKHN0YXQubnVsbHMgPiAwICYmIGZpbHRlck51bGxbdHlwZV0gPyAxIDogMCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBkZWNsYXJlIGdsb2JhbCBjb25zdGFudFxudmFyIGcgPSBnbG9iYWwgfHwgd2luZG93O1xuXG5nLkFHR1JFR0FURSA9ICdhZ2dyZWdhdGUnO1xuZy5SQVcgPSAncmF3JztcbmcuU1RBQ0tFRCA9ICdzdGFja2VkJztcbmcuSU5ERVggPSAnaW5kZXgnO1xuXG5nLlggPSAneCc7XG5nLlkgPSAneSc7XG5nLlJPVyA9ICdyb3cnO1xuZy5DT0wgPSAnY29sJztcbmcuU0laRSA9ICdzaXplJztcbmcuU0hBUEUgPSAnc2hhcGUnO1xuZy5DT0xPUiA9ICdjb2xvcic7XG5nLlRFWFQgPSAndGV4dCc7XG5nLkRFVEFJTCA9ICdkZXRhaWwnO1xuXG5nLk4gPSAnTic7XG5nLk8gPSAnTyc7XG5nLlEgPSAnUSc7XG5nLlQgPSAnVCc7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIFRPRE8oa2FuaXR3KTogY2hhdCB3aXRoIFZlZ2EgdGVhbSBhbmQgcG9zc2libHkgbW92ZSB0aGlzIHRvIHZlZ2EtbG9nZ2luZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgLy8gQm9ycm93ZWQgc29tZSBpZGVhcyBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE1NjUzMjYwLzg2Njk4OVxuICAvLyBhbmQgaHR0cHM6Ly9naXRodWIuY29tL3BhdGlrL2NvbnNvbGUubG9nLXdyYXBwZXIvYmxvYi9tYXN0ZXIvY29uc29sZWxvZy5qc1xuICB2YXIgTUVUSE9EUyA9IFsnZXJyb3InLCAnaW5mbycsICdkZWJ1ZycsICd3YXJuJywgJ2xvZyddO1xuXG4gIHJldHVybiBNRVRIT0RTLnJlZHVjZShmdW5jdGlvbihsb2dnZXIsIGZuKSB7XG4gICAgdmFyIGNmbiA9IGNvbnNvbGVbZm5dID8gZm4gOiAnbG9nJztcbiAgICBpZiAoY29uc29sZVtjZm5dLmJpbmQgPT09ICd1bmRlZmluZWQnKSB7IC8vIElFIDwgMTBcbiAgICAgICAgbG9nZ2VyW2ZuXSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmNhbGwoY29uc29sZVtjZm5dLCBjb25zb2xlLCBwcmVmaXgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbG9nZ2VyW2ZuXSA9IGNvbnNvbGVbY2ZuXS5iaW5kKGNvbnNvbGUsIHByZWZpeCk7XG4gICAgfVxuICAgIHJldHVybiBsb2dnZXI7XG4gIH0sIHt9KTtcbn07IiwiLy8gUGFja2FnZSBvZiBkZWZpbmluZyBWZWdhLWxpdGUgU3BlY2lmaWNhdGlvbidzIGpzb24gc2NoZW1hXG4ndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHNjaGVtYSA9IG1vZHVsZS5leHBvcnRzID0ge30sXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHRvTWFwID0gdXRpbC50b01hcCxcbiAgY29sb3JicmV3ZXIgPSByZXF1aXJlKCdjb2xvcmJyZXdlcicpO1xuXG5zY2hlbWEudXRpbCA9IHJlcXVpcmUoJy4vc2NoZW1hdXRpbCcpO1xuXG5zY2hlbWEubWFya3R5cGUgPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICBlbnVtOiBbJ3BvaW50JywgJ3RpY2snLCAnYmFyJywgJ2xpbmUnLCAnYXJlYScsICdjaXJjbGUnLCAnc3F1YXJlJywgJ3RleHQnXVxufTtcblxuc2NoZW1hLmFnZ3JlZ2F0ZSA9IHtcbiAgdHlwZTogJ3N0cmluZycsXG4gIGVudW06IFsnYXZnJywgJ3N1bScsICdtZWRpYW4nLCAnbWluJywgJ21heCcsICdjb3VudCddLFxuICBzdXBwb3J0ZWRFbnVtczoge1xuICAgIFE6IFsnYXZnJywgJ21lZGlhbicsICdzdW0nLCAnbWluJywgJ21heCcsICdjb3VudCddLFxuICAgIE86IFsnbWVkaWFuJywnbWluJywnbWF4J10sXG4gICAgTjogW10sXG4gICAgVDogWydhdmcnLCAnbWVkaWFuJywgJ21pbicsICdtYXgnXSxcbiAgICAnJzogWydjb3VudCddXG4gIH0sXG4gIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUSwgTiwgTywgVCwgJyddKVxufTtcblxuc2NoZW1hLmdldFN1cHBvcnRlZFJvbGUgPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gIHJldHVybiBzY2hlbWEuc2NoZW1hLnByb3BlcnRpZXMuZW5jb2RpbmcucHJvcGVydGllc1tlbmNUeXBlXS5zdXBwb3J0ZWRSb2xlO1xufTtcblxuc2NoZW1hLnRpbWVVbml0cyA9IFsneWVhcicsICdtb250aCcsICdkYXknLCAnZGF0ZScsICdob3VycycsICdtaW51dGVzJywgJ3NlY29uZHMnXTtcblxuc2NoZW1hLmRlZmF1bHRUaW1lRm4gPSAnbW9udGgnO1xuXG5zY2hlbWEudGltZVVuaXQgPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICBlbnVtOiBzY2hlbWEudGltZVVuaXRzLFxuICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1RdKVxufTtcblxuc2NoZW1hLnNjYWxlX3R5cGUgPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICAvLyBUT0RPKGthbml0dykgcmVhZCB2ZWdhJ3Mgc2NoZW1hIGhlcmUsIGFkZCBkZXNjcmlwdGlvblxuICBlbnVtOiBbJ2xpbmVhcicsICdsb2cnLCAncG93JywgJ3NxcnQnLCAncXVhbnRpbGUnXSxcbiAgZGVmYXVsdDogJ2xpbmVhcicsXG4gIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUV0pXG59O1xuXG5zY2hlbWEuZmllbGQgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbmFtZToge1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICB9XG4gIH1cbn07XG5cbnZhciBjbG9uZSA9IHV0aWwuZHVwbGljYXRlO1xudmFyIG1lcmdlID0gc2NoZW1hLnV0aWwubWVyZ2U7XG5cbnNjaGVtYS5NQVhCSU5TX0RFRkFVTFQgPSAxNTtcblxudmFyIGJpbiA9IHtcbiAgdHlwZTogWydib29sZWFuJywgJ29iamVjdCddLFxuICBkZWZhdWx0OiBmYWxzZSxcbiAgcHJvcGVydGllczoge1xuICAgIG1heGJpbnM6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHNjaGVtYS5NQVhCSU5TX0RFRkFVTFQsXG4gICAgICBtaW5pbXVtOiAyLFxuICAgICAgZGVzY3JpcHRpb246ICdNYXhpbXVtIG51bWJlciBvZiBiaW5zLidcbiAgICB9XG4gIH0sXG4gIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUV0pIC8vIFRPRE86IGFkZCBPIGFmdGVyIGZpbmlzaGluZyAjODFcbn07XG5cbnZhciB0eXBpY2FsRmllbGQgPSBtZXJnZShjbG9uZShzY2hlbWEuZmllbGQpLCB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdHlwZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbTiwgTywgUSwgVF1cbiAgICB9LFxuICAgIGFnZ3JlZ2F0ZTogc2NoZW1hLmFnZ3JlZ2F0ZSxcbiAgICB0aW1lVW5pdDogc2NoZW1hLnRpbWVVbml0LFxuICAgIGJpbjogYmluLFxuICAgIHNjYWxlOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyogQ29tbW9uIFNjYWxlIFByb3BlcnRpZXMgKi9cbiAgICAgICAgdHlwZTogc2NoZW1hLnNjYWxlX3R5cGUsXG4gICAgICAgIHJldmVyc2U6IHtcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRLCBUXSlcbiAgICAgICAgfSxcblxuICAgICAgICAvKiBRdWFudGl0YXRpdmUgU2NhbGUgUHJvcGVydGllcyAqL1xuICAgICAgICBuaWNlOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bTogWydzZWNvbmQnLCAnbWludXRlJywgJ2hvdXInLCAnZGF5JywgJ3dlZWsnLCAnbW9udGgnLCAneWVhciddLFxuICAgICAgICAgIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbVF0pXG4gICAgICAgIH0sXG4gICAgICAgIHplcm86IHtcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdJbmNsdWRlIHplcm8nLFxuICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRLCBUXSlcbiAgICAgICAgfSxcblxuICAgICAgICAvKiBWZWdhLWxpdGUgb25seSBQcm9wZXJ0aWVzICovXG4gICAgICAgIHVzZVJhd0RvbWFpbjoge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdVc2UgdGhlIHJhdyBkYXRhIHJhbmdlIGFzIHNjYWxlIGRvbWFpbiBpbnN0ZWFkIG9mICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAnYWdncmVnYXRlZCBkYXRhIGZvciBhZ2dyZWdhdGUgYXhpcy4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICdUaGlzIG9wdGlvbiBkb2VzIG5vdCB3b3JrIHdpdGggc3VtIG9yIGNvdW50IGFnZ3JlZ2F0ZScgK1xuICAgICAgICAgICAgICAgICAgICAgICAnYXMgdGhleSBtaWdodCBoYXZlIGEgc3Vic3RhbnRpYWxseSBsYXJnZXIgc2NhbGUgcmFuZ2UuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICdCeSBkZWZhdWx0LCB1c2UgdmFsdWUgZnJvbSBjb25maWcudXNlUmF3RG9tYWluLidcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbnZhciBvbmx5T3JkaW5hbEZpZWxkID0gbWVyZ2UoY2xvbmUoc2NoZW1hLmZpZWxkKSwge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkUm9sZToge1xuICAgIGRpbWVuc2lvbjogdHJ1ZVxuICB9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdHlwZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbTiwgTywgUSwgVF0gLy8gb3JkaW5hbC1vbmx5IGZpZWxkIHN1cHBvcnRzIFEgd2hlbiBiaW4gaXMgYXBwbGllZCBhbmQgVCB3aGVuIHRpbWUgdW5pdCBpcyBhcHBsaWVkLlxuICAgIH0sXG4gICAgdGltZVVuaXQ6IHNjaGVtYS50aW1lVW5pdCxcbiAgICBiaW46IGJpbixcbiAgICBhZ2dyZWdhdGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydjb3VudCddLFxuICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtOLCBPXSkgLy8gRklYTUUgdGhpcyBsb29rcyB3ZWlyZCB0byBtZVxuICAgIH1cbiAgfVxufSk7XG5cbnZhciBheGlzTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICBheGlzOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyogVmVnYSBBeGlzIFByb3BlcnRpZXMgKi9cbiAgICAgICAgZm9ybWF0OiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZvcm1hdHRpbmcgcGF0dGVybiBmb3IgYXhpcyBsYWJlbHMuICcrXG4gICAgICAgICAgICAgICAgICAgICAgICdJZiBub3QgdW5kZWZpbmVkLCB0aGlzIHdpbGwgYmUgZGV0ZXJtaW5lZCBieSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgJ3NtYWxsL2xhcmdlTnVtYmVyRm9ybWF0IGFuZCB0aGUgbWF4IHZhbHVlICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAnb2YgdGhlIGZpZWxkLidcbiAgICAgICAgfSxcbiAgICAgICAgZ3JpZDoge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSBmbGFnIGluZGljYXRlIGlmIGdyaWRsaW5lcyBzaG91bGQgYmUgY3JlYXRlZCBpbiBhZGRpdGlvbiB0byB0aWNrcy4nXG4gICAgICAgIH0sXG4gICAgICAgIGxheWVyOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogJ2JhY2snLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSBzdHJpbmcgaW5kaWNhdGluZyBpZiB0aGUgYXhpcyAoYW5kIGFueSBncmlkbGluZXMpIHNob3VsZCBiZSBwbGFjZWQgYWJvdmUgb3IgYmVsb3cgdGhlIGRhdGEgbWFya3MuIE9uZSBvZiBcImZyb250XCIgKGRlZmF1bHQpIG9yIFwiYmFja1wiLidcbiAgICAgICAgfSxcbiAgICAgICAgb3JpZW50OiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgIGVudW06IFsndG9wJywgJ3JpZ2h0JywgJ2xlZnQnLCAnYm90dG9tJ10sXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgb3JpZW50YXRpb24gb2YgdGhlIGF4aXMuIE9uZSBvZiB0b3AsIGJvdHRvbSwgbGVmdCBvciByaWdodC4gVGhlIG9yaWVudGF0aW9uIGNhbiBiZSB1c2VkIHRvIGZ1cnRoZXIgc3BlY2lhbGl6ZSB0aGUgYXhpcyB0eXBlIChlLmcuLCBhIHkgYXhpcyBvcmllbnRlZCBmb3IgdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIGNoYXJ0KS4nXG4gICAgICAgIH0sXG4gICAgICAgIHRpY2tzOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IDUsXG4gICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0EgZGVzaXJlZCBudW1iZXIgb2YgdGlja3MsIGZvciBheGVzIHZpc3VhbGl6aW5nIHF1YW50aXRhdGl2ZSBzY2FsZXMuIFRoZSByZXN1bHRpbmcgbnVtYmVyIG1heSBiZSBkaWZmZXJlbnQgc28gdGhhdCB2YWx1ZXMgYXJlIFwibmljZVwiIChtdWx0aXBsZXMgb2YgMiwgNSwgMTApIGFuZCBsaWUgd2l0aGluIHRoZSB1bmRlcmx5aW5nIHNjYWxlXFwncyByYW5nZS4nXG4gICAgICAgIH0sXG4gICAgICAgIC8qIFZlZ2EgQXhpcyBQcm9wZXJ0aWVzIHRoYXQgYXJlIGF1dG9tYXRpY2FsbHkgcG9wdWxhdGVkIGJ5IFZlZ2EtbGl0ZSAqL1xuICAgICAgICB0aXRsZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgZm9yIHRoZSBheGlzLiAoU2hvd3MgZmllbGQgbmFtZSBhbmQgaXRzIGZ1bmN0aW9uIGJ5IGRlZmF1bHQuKSdcbiAgICAgICAgfSxcbiAgICAgICAgLyogVmVnYS1saXRlIG9ubHkgKi9cbiAgICAgICAgbWF4TGFiZWxMZW5ndGg6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogMjUsXG4gICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RydW5jYXRlIGxhYmVscyB0aGF0IGFyZSB0b28gbG9uZy4nXG4gICAgICAgIH0sXG4gICAgICAgIGxhYmVsQW5nbGU6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAvLyBhdXRvXG4gICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICBtYXhpbXVtOiAzNjAsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBbmdsZSBieSB3aGljaCB0byByb3RhdGUgbGFiZWxzLiBTZXQgdG8gMCB0byBmb3JjZSBob3Jpem9udGFsLidcbiAgICAgICAgfSxcbiAgICAgICAgdGl0bGVNYXhMZW5ndGg6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgIG1pbmltdW06IDAsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdNYXggbGVuZ3RoIGZvciBheGlzIHRpdGxlIGlmIHRoZSB0aXRsZSBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBmcm9tIHRoZSBmaWVsZFxcJ3MgZGVzY3JpcHRpb24nXG4gICAgICAgIH0sXG4gICAgICAgIHRpdGxlT2Zmc2V0OiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgb2Zmc2V0IHZhbHVlIGZvciB0aGUgYXhpcy4nXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgc29ydE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIHNvcnQ6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiBbXSxcbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW04sIE9dKSxcbiAgICAgICAgcmVxdWlyZWQ6IFsnbmFtZScsICdhZ2dyZWdhdGUnXSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZ2dyZWdhdGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgZW51bTogWydhdmcnLCAnc3VtJywgJ21pbicsICdtYXgnLCAnY291bnQnXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmV2ZXJzZToge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBiYW5kTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgYmFuZDoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNpemU6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICAgICAgfSxcbiAgICAgICAgcGFkZGluZzoge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBtaW5pbXVtOiAwLFxuICAgICAgICAgIGRlZmF1bHQ6IDFcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIGxlZ2VuZE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIGxlZ2VuZDoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1Byb3BlcnRpZXMgb2YgYSBsZWdlbmQuJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBIHRpdGxlIGZvciB0aGUgbGVnZW5kLiAoU2hvd3MgZmllbGQgbmFtZSBhbmQgaXRzIGZ1bmN0aW9uIGJ5IGRlZmF1bHQuKSdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIHRleHRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczogeyd0ZXh0JzogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICBhbGlnbjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAncmlnaHQnXG4gICAgfSxcbiAgICBiYXNlbGluZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnbWlkZGxlJ1xuICAgIH0sXG4gICAgY29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICcjMDAwMDAwJ1xuICAgIH0sXG4gICAgbWFyZ2luOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiA0LFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgcGxhY2Vob2xkZXI6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ0FiYydcbiAgICB9LFxuICAgIGZvbnQ6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB3ZWlnaHQ6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBlbnVtOiBbJ25vcm1hbCcsICdib2xkJ10sXG4gICAgICAgICAgZGVmYXVsdDogJ25vcm1hbCdcbiAgICAgICAgfSxcbiAgICAgICAgc2l6ZToge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiAxMCxcbiAgICAgICAgICBtaW5pbXVtOiAwXG4gICAgICAgIH0sXG4gICAgICAgIGZhbWlseToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdIZWx2ZXRpY2EgTmV1ZSdcbiAgICAgICAgfSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiAnbm9ybWFsJyxcbiAgICAgICAgICBlbnVtOiBbJ25vcm1hbCcsICdpdGFsaWMnXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBmb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgZGVzY3JpcHRpb246ICdUaGUgZm9ybWF0dGluZyBwYXR0ZXJuIGZvciB0ZXh0IHZhbHVlLiAnK1xuICAgICAgICAgICAgICAgICAgICdJZiBub3QgdW5kZWZpbmVkLCB0aGlzIHdpbGwgYmUgZGV0ZXJtaW5lZCBieSAnICtcbiAgICAgICAgICAgICAgICAgICAnc21hbGwvbGFyZ2VOdW1iZXJGb3JtYXQgYW5kIHRoZSBtYXggdmFsdWUgJyArXG4gICAgICAgICAgICAgICAgICAgJ29mIHRoZSBmaWVsZC4nXG4gICAgfSxcbiAgfVxufTtcblxudmFyIHNpemVNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCBiYXI6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlLCB0ZXh0OiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAzMCxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZXNjcmlwdGlvbjogJ1NpemUgb2YgbWFya3MuJ1xuICAgIH1cbiAgfVxufTtcblxudmFyIGNvbG9yTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSwgJ3RleHQnOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiAnIzQ2ODJiNCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0NvbG9yIHRvIGJlIHVzZWQgZm9yIG1hcmtzLidcbiAgICB9LFxuICAgIG9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgbWluaW11bTogMCxcbiAgICAgIG1heGltdW06IDFcbiAgICB9LFxuICAgIHNjYWxlOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICB0eXBlOiBbJ3N0cmluZycsICdhcnJheSddLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICdDb2xvciBwYWxldHRlLCBpZiB1bmRlZmluZWQgdmVnYS1saXRlIHdpbGwgdXNlIGRhdGEgcHJvcGVydHknICtcbiAgICAgICAgICAgICd0byBwaWNrIG9uZSBmcm9tIGMxMHBhbGV0dGUsIGMyMHBhbGV0dGUsIG9yIG9yZGluYWxQYWxldHRlLidcbiAgICAgICAgICAgIC8vRklYTUVcbiAgICAgICAgfSxcbiAgICAgICAgYzEwcGFsZXR0ZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdjYXRlZ29yeTEwJyxcbiAgICAgICAgICBlbnVtOiBbXG4gICAgICAgICAgICAvLyBUYWJsZWF1XG4gICAgICAgICAgICAnY2F0ZWdvcnkxMCcsICdjYXRlZ29yeTEwaycsXG4gICAgICAgICAgICAvLyBDb2xvciBCcmV3ZXJcbiAgICAgICAgICAgICdQYXN0ZWwxJywgJ1Bhc3RlbDInLCAnU2V0MScsICdTZXQyJywgJ1NldDMnXG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICBjMjBwYWxldHRlOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogJ2NhdGVnb3J5MjAnLFxuICAgICAgICAgIGVudW06IFsnY2F0ZWdvcnkyMCcsICdjYXRlZ29yeTIwYicsICdjYXRlZ29yeTIwYyddXG4gICAgICAgIH0sXG4gICAgICAgIG9yZGluYWxQYWxldHRlOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ29sb3IgcGFsZXR0ZSB0byBlbmNvZGUgb3JkaW5hbCB2YXJpYWJsZXMuJyxcbiAgICAgICAgICBlbnVtOiB1dGlsLmtleXMoY29sb3JicmV3ZXIpXG4gICAgICAgIH0sXG4gICAgICAgIHF1YW50aXRhdGl2ZVJhbmdlOiB7XG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBkZWZhdWx0OiBbJyNBRkM2QTMnLCAnIzA5NjIyQSddLCAvLyB0YWJsZWF1IGdyZWVuc1xuICAgICAgICAgIC8vIGRlZmF1bHQ6IFsnI2NjZWNlNicsICcjMDA0NDFiJ10sIC8vIEJ1R24uOSBbMi04XVxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ29sb3IgcmFuZ2UgdG8gZW5jb2RlIHF1YW50aXRhdGl2ZSB2YXJpYWJsZXMuJyxcbiAgICAgICAgICBtaW5JdGVtczogMixcbiAgICAgICAgICBtYXhJdGVtczogMixcbiAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICByb2xlOiAnY29sb3InXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgc2hhcGVNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ2NpcmNsZScsICdzcXVhcmUnLCAnY3Jvc3MnLCAnZGlhbW9uZCcsICd0cmlhbmdsZS11cCcsICd0cmlhbmdsZS1kb3duJ10sXG4gICAgICBkZWZhdWx0OiAnY2lyY2xlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWFyayB0byBiZSB1c2VkLidcbiAgICB9LFxuICAgIGZpbGxlZDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgdGhlIHNoYXBlXFwncyBjb2xvciBzaG91bGQgYmUgdXNlZCBhcyBmaWxsIGNvbG9yIGluc3RlYWQgb2Ygc3Ryb2tlIGNvbG9yLidcbiAgICB9XG4gIH1cbn07XG5cbnZhciBkZXRhaWxNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBsaW5lOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZX1cbn07XG5cbnZhciByb3dNaXhpbiA9IHtcbiAgcHJvcGVydGllczoge1xuICAgIGhlaWdodDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVmYXVsdDogMTUwXG4gICAgfVxuICB9XG59O1xuXG52YXIgY29sTWl4aW4gPSB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICB3aWR0aDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVmYXVsdDogMTUwXG4gICAgfSxcbiAgICBheGlzOiB7XG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG1heExhYmVsTGVuZ3RoOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IDEyLFxuICAgICAgICAgIG1pbmltdW06IDAsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUcnVuY2F0ZSBsYWJlbHMgdGhhdCBhcmUgdG9vIGxvbmcuJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgZmFjZXRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBiYXI6IHRydWUsIGxpbmU6IHRydWUsIGFyZWE6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlLCB0ZXh0OiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHBhZGRpbmc6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIG1heGltdW06IDEsXG4gICAgICBkZWZhdWx0OiAwLjFcbiAgICB9XG4gIH1cbn07XG5cbnZhciByZXF1aXJlZE5hbWVUeXBlID0ge1xuICByZXF1aXJlZDogWyduYW1lJywgJ3R5cGUnXVxufTtcblxudmFyIG11bHRpUm9sZUZpZWxkID0gbWVyZ2UoY2xvbmUodHlwaWNhbEZpZWxkKSwge1xuICBzdXBwb3J0ZWRSb2xlOiB7XG4gICAgbWVhc3VyZTogdHJ1ZSxcbiAgICBkaW1lbnNpb246IHRydWVcbiAgfVxufSk7XG5cbnZhciBxdWFudGl0YXRpdmVGaWVsZCA9IG1lcmdlKGNsb25lKHR5cGljYWxGaWVsZCksIHtcbiAgc3VwcG9ydGVkUm9sZToge1xuICAgIG1lYXN1cmU6IHRydWUsXG4gICAgZGltZW5zaW9uOiAnb3JkaW5hbC1vbmx5JyAvLyB1c2luZyBzaXplIHRvIGVuY29kaW5nIGNhdGVnb3J5IGxlYWQgdG8gb3JkZXIgaW50ZXJwcmV0YXRpb25cbiAgfVxufSk7XG5cbnZhciBvbmx5UXVhbnRpdGF0aXZlRmllbGQgPSBtZXJnZShjbG9uZSh0eXBpY2FsRmllbGQpLCB7XG4gIHN1cHBvcnRlZFJvbGU6IHtcbiAgICBtZWFzdXJlOiB0cnVlXG4gIH1cbn0pO1xuXG52YXIgeCA9IG1lcmdlKGNsb25lKG11bHRpUm9sZUZpZWxkKSwgYXhpc01peGluLCBiYW5kTWl4aW4sIHJlcXVpcmVkTmFtZVR5cGUsIHNvcnRNaXhpbik7XG52YXIgeSA9IGNsb25lKHgpO1xuXG52YXIgZmFjZXQgPSBtZXJnZShjbG9uZShvbmx5T3JkaW5hbEZpZWxkKSwgcmVxdWlyZWROYW1lVHlwZSwgZmFjZXRNaXhpbiwgc29ydE1peGluKTtcbnZhciByb3cgPSBtZXJnZShjbG9uZShmYWNldCksIGF4aXNNaXhpbiwgcm93TWl4aW4pO1xudmFyIGNvbCA9IG1lcmdlKGNsb25lKGZhY2V0KSwgYXhpc01peGluLCBjb2xNaXhpbik7XG5cbnZhciBzaXplID0gbWVyZ2UoY2xvbmUocXVhbnRpdGF0aXZlRmllbGQpLCBsZWdlbmRNaXhpbiwgc2l6ZU1peGluLCBzb3J0TWl4aW4pO1xudmFyIGNvbG9yID0gbWVyZ2UoY2xvbmUobXVsdGlSb2xlRmllbGQpLCBsZWdlbmRNaXhpbiwgY29sb3JNaXhpbiwgc29ydE1peGluKTtcblxudmFyIHNoYXBlID0gbWVyZ2UoY2xvbmUob25seU9yZGluYWxGaWVsZCksIGxlZ2VuZE1peGluLCBzaGFwZU1peGluLCBzb3J0TWl4aW4pO1xudmFyIGRldGFpbCA9IG1lcmdlKGNsb25lKG9ubHlPcmRpbmFsRmllbGQpLCBkZXRhaWxNaXhpbiwgc29ydE1peGluKTtcblxuLy8gd2Ugb25seSBwdXQgYWdncmVnYXRlZCBtZWFzdXJlIGluIHBpdm90IHRhYmxlXG52YXIgdGV4dCA9IG1lcmdlKGNsb25lKG9ubHlRdWFudGl0YXRpdmVGaWVsZCksIHRleHRNaXhpbiwgc29ydE1peGluKTtcblxuLy8gVE9ETyBhZGQgbGFiZWxcblxudmFyIGZpbHRlciA9IHtcbiAgdHlwZTogJ2FycmF5JyxcbiAgaXRlbXM6IHtcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBvcGVyYW5kczoge1xuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBpdGVtczoge1xuICAgICAgICAgIHR5cGU6IFsnc3RyaW5nJywgJ2Jvb2xlYW4nLCAnaW50ZWdlcicsICdudW1iZXInXVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb3BlcmF0b3I6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGVudW06IFsnPicsICc+PScsICc9JywgJyE9JywgJzwnLCAnPD0nLCAnbm90TnVsbCddXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgZGF0YSA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICAvLyBkYXRhIHNvdXJjZVxuICAgIGZvcm1hdFR5cGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydqc29uJywgJ2NzdiddLFxuICAgICAgZGVmYXVsdDogJ2pzb24nXG4gICAgfSxcbiAgICB1cmw6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICB2YWx1ZXM6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1Bhc3MgYXJyYXkgb2Ygb2JqZWN0cyBpbnN0ZWFkIG9mIGEgdXJsIHRvIGEgZmlsZS4nLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgY29uZmlnID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIC8vIHRlbXBsYXRlXG4gICAgd2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgaGVpZ2h0OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIHZpZXdwb3J0OiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICB9LFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBncmlkQ29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICcjMDAwMDAwJ1xuICAgIH0sXG4gICAgZ3JpZE9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIG1heGltdW06IDEsXG4gICAgICBkZWZhdWx0OiAwLjA4XG4gICAgfSxcblxuICAgIC8vIGZpbHRlciBudWxsXG4gICAgLy8gVE9ETygjNTk3KSByZXZpc2UgdGhpcyBjb25maWdcbiAgICBmaWx0ZXJOdWxsOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgTzoge3R5cGU6J2Jvb2xlYW4nLCBkZWZhdWx0OiBmYWxzZX0sXG4gICAgICAgIFE6IHt0eXBlOidib29sZWFuJywgZGVmYXVsdDogdHJ1ZX0sXG4gICAgICAgIFQ6IHt0eXBlOidib29sZWFuJywgZGVmYXVsdDogdHJ1ZX1cbiAgICAgIH1cbiAgICB9LFxuICAgIHRvZ2dsZVNvcnQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogT1xuICAgIH0sXG4gICAgYXV0b1NvcnRMaW5lOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcblxuICAgIC8vIHNpbmdsZSBwbG90XG4gICAgc2luZ2xlSGVpZ2h0OiB7XG4gICAgICAvLyB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IGJhbmRXaWR0aCAqIChjYXJkaW5hbGl0eSArIHBhZGRpbmcpXG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyMDAsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBzaW5nbGVXaWR0aDoge1xuICAgICAgLy8gd2lsbCBiZSBvdmVyd3JpdHRlbiBieSBiYW5kV2lkdGggKiAoY2FyZGluYWxpdHkgKyBwYWRkaW5nKVxuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjAwLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgLy8gYmFuZCBzaXplXG4gICAgbGFyZ2VCYW5kU2l6ZToge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjEsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBzbWFsbEJhbmRTaXplOiB7XG4gICAgICAvL3NtYWxsIG11bHRpcGxlcyBvciBzaW5nbGUgcGxvdCB3aXRoIGhpZ2ggY2FyZGluYWxpdHlcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDEyLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgbGFyZ2VCYW5kTWF4Q2FyZGluYWxpdHk6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDEwXG4gICAgfSxcbiAgICAvLyBzbWFsbCBtdWx0aXBsZXNcbiAgICBjZWxsUGFkZGluZzoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAwLjFcbiAgICB9LFxuICAgIGNlbGxHcmlkQ29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICcjMDAwMDAwJ1xuICAgIH0sXG4gICAgY2VsbEdyaWRPcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxLFxuICAgICAgZGVmYXVsdDogMC4xNVxuICAgIH0sXG4gICAgY2VsbEJhY2tncm91bmRDb2xvcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJ3JnYmEoMCwwLDAsMCknXG4gICAgfSxcbiAgICB0ZXh0Q2VsbFdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiA5MCxcbiAgICAgIG1pbmltdW06IDBcbiAgICB9LFxuXG4gICAgLy8gbWFya3NcbiAgICBzdHJva2VXaWR0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMixcbiAgICAgIG1pbmltdW06IDBcbiAgICB9LFxuICAgIHNpbmdsZUJhck9mZnNldDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogNSxcbiAgICAgIG1pbmltdW06IDBcbiAgICB9LFxuICAgIC8vIHNjYWxlc1xuICAgIHRpbWVTY2FsZUxhYmVsTGVuZ3RoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAzLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWF4IGxlbmd0aCBmb3IgdmFsdWVzIGluIGRheVNjYWxlTGFiZWwgYW5kIG1vbnRoU2NhbGVMYWJlbC4gIFplcm8gbWVhbnMgdXNpbmcgZnVsbCBuYW1lcyBpbiBkYXlTY2FsZUxhYmVsL21vbnRoU2NhbGVMYWJlbC4nXG4gICAgfSxcbiAgICBkYXlTY2FsZUxhYmVsOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0OiBbJ1N1bmRheScsICdNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5J10sXG4gICAgICBkZXNjcmlwdGlvbjogJ0F4aXMgbGFiZWxzIGZvciBkYXkgb2Ygd2Vlaywgc3RhcnRpbmcgZnJvbSBTdW5kYXkuJyArXG4gICAgICAgICcoQ29uc2lzdGVudCB3aXRoIEphdmFzY3JpcHQgLS0gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0RhdGUvZ2V0RGF5LidcbiAgICB9LFxuICAgIG1vbnRoU2NhbGVMYWJlbDoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgZGVmYXVsdDogWydKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJywgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ10sXG4gICAgICBkZXNjcmlwdGlvbjogJ0F4aXMgbGFiZWxzIGZvciBtb250aC4nXG4gICAgfSxcbiAgICAvLyBvdGhlclxuICAgIGNoYXJhY3RlcldpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiA2XG4gICAgfSxcbiAgICBtYXhTbWFsbE51bWJlcjoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAxMDAwMCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnbWF4aW11bSBudW1iZXIgdGhhdCBhIGZpZWxkIHdpbGwgYmUgY29uc2lkZXJlZCBzbWFsbE51bWJlci4nK1xuICAgICAgICAgICAgICAgICAgICdVc2VkIGZvciBheGlzIGxhYmVsbGluZy4nXG4gICAgfSxcbiAgICBzbWFsbE51bWJlckZvcm1hdDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRDMgTnVtYmVyIGZvcm1hdCBmb3IgYXhpcyBsYWJlbHMgYW5kIHRleHQgdGFibGVzICcrXG4gICAgICAgICAgICAgICAgICAgJ2ZvciBudW1iZXIgPD0gbWF4U21hbGxOdW1iZXIuIFVzZWQgZm9yIGF4aXMgbGFiZWxsaW5nLidcbiAgICB9LFxuICAgIGxhcmdlTnVtYmVyRm9ybWF0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICcuM3MnLFxuICAgICAgZGVzY3JpcHRpb246ICdEMyBOdW1iZXIgZm9ybWF0IGZvciBheGlzIGxhYmVscyBhbmQgdGV4dCB0YWJsZXMgJyArXG4gICAgICAgICAgICAgICAgICAgJ2ZvciBudW1iZXIgPiBtYXhTbWFsbE51bWJlci4nXG4gICAgfSxcbiAgICB0aW1lRm9ybWF0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICclWS0lbS0lZCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0RhdGUgZm9ybWF0IGZvciBheGlzIGxhYmVscy4nXG4gICAgfSxcbiAgICB1c2VSYXdEb21haW46IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246ICdVc2UgdGhlIHJhdyBkYXRhIHJhbmdlIGFzIHNjYWxlIGRvbWFpbiBpbnN0ZWFkIG9mICcgK1xuICAgICAgICAgICAgICAgICAgICdhZ2dyZWdhdGVkIGRhdGEgZm9yIGFnZ3JlZ2F0ZSBheGlzLiAnICtcbiAgICAgICAgICAgICAgICAgICAnVGhpcyBvcHRpb24gZG9lcyBub3Qgd29yayB3aXRoIHN1bSBvciBjb3VudCBhZ2dyZWdhdGUnICtcbiAgICAgICAgICAgICAgICAgICAnYXMgdGhleSBtaWdodCBoYXZlIGEgc3Vic3RhbnRpYWxseSBsYXJnZXIgc2NhbGUgcmFuZ2UuJyArXG4gICAgICAgICAgICAgICAgICAgJ0J5IGRlZmF1bHQsIHVzZSB2YWx1ZSBmcm9tIGNvbmZpZy51c2VSYXdEb21haW4uJ1xuICAgIH1cbiAgfVxufTtcblxuLyoqIEB0eXBlIE9iamVjdCBTY2hlbWEgb2YgYSB2ZWdhLWxpdGUgc3BlY2lmaWNhdGlvbiAqL1xuc2NoZW1hLnNjaGVtYSA9IHtcbiAgJHNjaGVtYTogJ2h0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDQvc2NoZW1hIycsXG4gIGRlc2NyaXB0aW9uOiAnU2NoZW1hIGZvciBWZWdhLWxpdGUgc3BlY2lmaWNhdGlvbicsXG4gIHR5cGU6ICdvYmplY3QnLFxuICByZXF1aXJlZDogWydtYXJrdHlwZScsICdlbmNvZGluZycsICdkYXRhJ10sXG4gIHByb3BlcnRpZXM6IHtcbiAgICBkYXRhOiBkYXRhLFxuICAgIG1hcmt0eXBlOiBzY2hlbWEubWFya3R5cGUsXG4gICAgZW5jb2Rpbmc6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5LFxuICAgICAgICByb3c6IHJvdyxcbiAgICAgICAgY29sOiBjb2wsXG4gICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgc2hhcGU6IHNoYXBlLFxuICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICBkZXRhaWw6IGRldGFpbFxuICAgICAgfVxuICAgIH0sXG4gICAgZmlsdGVyOiBmaWx0ZXIsXG4gICAgY29uZmlnOiBjb25maWdcbiAgfVxufTtcblxuc2NoZW1hLmVuY1R5cGVzID0gdXRpbC5rZXlzKHNjaGVtYS5zY2hlbWEucHJvcGVydGllcy5lbmNvZGluZy5wcm9wZXJ0aWVzKTtcblxuLyoqIEluc3RhbnRpYXRlIGEgdmVyYm9zZSB2bCBzcGVjIGZyb20gdGhlIHNjaGVtYSAqL1xuc2NoZW1hLmluc3RhbnRpYXRlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBzY2hlbWEudXRpbC5pbnN0YW50aWF0ZShzY2hlbWEuc2NoZW1hKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzY2hlbWF1dGlsID0gbW9kdWxlLmV4cG9ydHMgPSB7fSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIGlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xufTtcblxuc2NoZW1hdXRpbC5leHRlbmQgPSBmdW5jdGlvbihpbnN0YW5jZSwgc2NoZW1hKSB7XG4gIHJldHVybiBzY2hlbWF1dGlsLm1lcmdlKHNjaGVtYXV0aWwuaW5zdGFudGlhdGUoc2NoZW1hKSwgaW5zdGFuY2UpO1xufTtcblxuLy8gaW5zdGFudGlhdGUgYSBzY2hlbWFcbnNjaGVtYXV0aWwuaW5zdGFudGlhdGUgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIHZhbDtcbiAgaWYgKHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmICgnZGVmYXVsdCcgaW4gc2NoZW1hKSB7XG4gICAgdmFsID0gc2NoZW1hLmRlZmF1bHQ7XG4gICAgcmV0dXJuIHV0aWwuaXNPYmplY3QodmFsKSA/IHV0aWwuZHVwbGljYXRlKHZhbCkgOiB2YWw7XG4gIH0gZWxzZSBpZiAoc2NoZW1hLnR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgdmFyIGluc3RhbmNlID0ge307XG4gICAgZm9yICh2YXIgbmFtZSBpbiBzY2hlbWEucHJvcGVydGllcykge1xuICAgICAgdmFsID0gc2NoZW1hdXRpbC5pbnN0YW50aWF0ZShzY2hlbWEucHJvcGVydGllc1tuYW1lXSk7XG4gICAgICBpZiAodmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaW5zdGFuY2VbbmFtZV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSBlbHNlIGlmIChzY2hlbWEudHlwZSA9PT0gJ2FycmF5Jykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuLy8gcmVtb3ZlIGFsbCBkZWZhdWx0cyBmcm9tIGFuIGluc3RhbmNlXG5zY2hlbWF1dGlsLnN1YnRyYWN0ID0gZnVuY3Rpb24oaW5zdGFuY2UsIGRlZmF1bHRzKSB7XG4gIHZhciBjaGFuZ2VzID0ge307XG4gIGZvciAodmFyIHByb3AgaW4gaW5zdGFuY2UpIHtcbiAgICB2YXIgZGVmID0gZGVmYXVsdHNbcHJvcF07XG4gICAgdmFyIGlucyA9IGluc3RhbmNlW3Byb3BdO1xuICAgIC8vIE5vdGU6IGRvZXMgbm90IHByb3Blcmx5IHN1YnRyYWN0IGFycmF5c1xuICAgIGlmICghZGVmYXVsdHMgfHwgZGVmICE9PSBpbnMpIHtcbiAgICAgIGlmICh0eXBlb2YgaW5zID09PSAnb2JqZWN0JyAmJiAhdXRpbC5pc0FycmF5KGlucykgJiYgZGVmKSB7XG4gICAgICAgIHZhciBjID0gc2NoZW1hdXRpbC5zdWJ0cmFjdChpbnMsIGRlZik7XG4gICAgICAgIGlmICghaXNFbXB0eShjKSlcbiAgICAgICAgICBjaGFuZ2VzW3Byb3BdID0gYztcbiAgICAgIH0gZWxzZSBpZiAoIXV0aWwuaXNBcnJheShpbnMpIHx8IGlucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNoYW5nZXNbcHJvcF0gPSBpbnM7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjaGFuZ2VzO1xufTtcblxuc2NoZW1hdXRpbC5tZXJnZSA9IGZ1bmN0aW9uKC8qZGVzdCosIHNyYzAsIHNyYzEsIC4uLiovKXtcbiAgdmFyIGRlc3QgPSBhcmd1bWVudHNbMF07XG4gIGZvciAodmFyIGk9MSA7IGk8YXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgZGVzdCA9IG1lcmdlKGRlc3QsIGFyZ3VtZW50c1tpXSk7XG4gIH1cbiAgcmV0dXJuIGRlc3Q7XG59O1xuXG4vLyByZWN1cnNpdmVseSBtZXJnZXMgc3JjIGludG8gZGVzdFxuZnVuY3Rpb24gbWVyZ2UoZGVzdCwgc3JjKSB7XG4gIGlmICh0eXBlb2Ygc3JjICE9PSAnb2JqZWN0JyB8fCBzcmMgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZGVzdDtcbiAgfVxuXG4gIGZvciAodmFyIHAgaW4gc3JjKSB7XG4gICAgaWYgKCFzcmMuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoc3JjW3BdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHNyY1twXSAhPT0gJ29iamVjdCcgfHwgc3JjW3BdID09PSBudWxsKSB7XG4gICAgICBkZXN0W3BdID0gc3JjW3BdO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlc3RbcF0gIT09ICdvYmplY3QnIHx8IGRlc3RbcF0gPT09IG51bGwpIHtcbiAgICAgIGRlc3RbcF0gPSBtZXJnZShzcmNbcF0uY29uc3RydWN0b3IgPT09IEFycmF5ID8gW10gOiB7fSwgc3JjW3BdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVyZ2UoZGVzdFtwXSwgc3JjW3BdKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlc3Q7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnZGF0YWxpYi9zcmMvdXRpbCcpO1xuXG51dGlsLmV4dGVuZCh1dGlsLCByZXF1aXJlKCdkYXRhbGliL3NyYy9nZW5lcmF0ZScpKTtcbnV0aWwuZXh0ZW5kKHV0aWwsIHJlcXVpcmUoJ2RhdGFsaWIvc3JjL3N0YXRzJykpO1xudXRpbC5leHRlbmQodXRpbCwgcmVxdWlyZSgnLi9sb2dnZXInKSgnW1ZMIEVycm9yXScpKTtcbnV0aWwuYmluID0gcmVxdWlyZSgnZGF0YWxpYi9zcmMvYmlucy9iaW5zJyk7XG5cbnV0aWwuaXNpbiA9IGZ1bmN0aW9uKGl0ZW0sIGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pICE9PSAtMTtcbn07XG5cbnV0aWwuZm9yRWFjaCA9IGZ1bmN0aW9uKG9iaiwgZiwgdGhpc0FyZykge1xuICBpZiAob2JqLmZvckVhY2gpIHtcbiAgICBvYmouZm9yRWFjaC5jYWxsKHRoaXNBcmcsIGYpO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICBmLmNhbGwodGhpc0FyZywgb2JqW2tdLCBrICwgb2JqKTtcbiAgICB9XG4gIH1cbn07XG5cbnV0aWwucmVkdWNlID0gZnVuY3Rpb24ob2JqLCBmLCBpbml0LCB0aGlzQXJnKSB7XG4gIGlmIChvYmoucmVkdWNlKSB7XG4gICAgcmV0dXJuIG9iai5yZWR1Y2UuY2FsbCh0aGlzQXJnLCBmLCBpbml0KTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgICAgaW5pdCA9IGYuY2FsbCh0aGlzQXJnLCBpbml0LCBvYmpba10sIGssIG9iaik7XG4gICAgfVxuICAgIHJldHVybiBpbml0O1xuICB9XG59O1xuXG51dGlsLm1hcCA9IGZ1bmN0aW9uKG9iaiwgZiwgdGhpc0FyZykge1xuICBpZiAob2JqLm1hcCkge1xuICAgIHJldHVybiBvYmoubWFwLmNhbGwodGhpc0FyZywgZik7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG91dHB1dCA9IFtdO1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICBvdXRwdXQucHVzaCggZi5jYWxsKHRoaXNBcmcsIG9ialtrXSwgaywgb2JqKSk7XG4gICAgfVxuICB9XG59O1xuXG51dGlsLmFueSA9IGZ1bmN0aW9uKGFyciwgZikge1xuICB2YXIgaSA9IDAsIGs7XG4gIGZvciAoayBpbiBhcnIpIHtcbiAgICBpZiAoZihhcnJba10sIGssIGkrKykpIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnV0aWwuYWxsID0gZnVuY3Rpb24oYXJyLCBmKSB7XG4gIHZhciBpID0gMCwgaztcbiAgZm9yIChrIGluIGFycikge1xuICAgIGlmICghZihhcnJba10sIGssIGkrKykpIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnV0aWwuZ2V0YmlucyA9IGZ1bmN0aW9uKHN0YXRzLCBtYXhiaW5zKSB7XG4gIHJldHVybiB1dGlsLmJpbih7XG4gICAgbWluOiBzdGF0cy5taW4sXG4gICAgbWF4OiBzdGF0cy5tYXgsXG4gICAgbWF4YmluczogbWF4Ymluc1xuICB9KTtcbn07XG5cbi8qKlxuICogeFtwWzBdXS4uLltwW25dXSA9IHZhbFxuICogQHBhcmFtIG5vYXVnbWVudCBkZXRlcm1pbmUgd2hldGhlciBuZXcgb2JqZWN0IHNob3VsZCBiZSBhZGRlZCBmXG4gKiBvciBub24tZXhpc3RpbmcgcHJvcGVydGllcyBhbG9uZyB0aGUgcGF0aFxuICovXG51dGlsLnNldHRlciA9IGZ1bmN0aW9uKHgsIHAsIHZhbCwgbm9hdWdtZW50KSB7XG4gIGZvciAodmFyIGk9MDsgaTxwLmxlbmd0aC0xOyArK2kpIHtcbiAgICBpZiAoIW5vYXVnbWVudCAmJiAhKHBbaV0gaW4geCkpe1xuICAgICAgeCA9IHhbcFtpXV0gPSB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgeCA9IHhbcFtpXV07XG4gICAgfVxuICB9XG4gIHhbcFtpXV0gPSB2YWw7XG59O1xuXG5cbi8qKlxuICogcmV0dXJucyB4W3BbMF1dLi4uW3Bbbl1dXG4gKiBAcGFyYW0gYXVnbWVudCBkZXRlcm1pbmUgd2hldGhlciBuZXcgb2JqZWN0IHNob3VsZCBiZSBhZGRlZCBmXG4gKiBvciBub24tZXhpc3RpbmcgcHJvcGVydGllcyBhbG9uZyB0aGUgcGF0aFxuICovXG51dGlsLmdldHRlciA9IGZ1bmN0aW9uKHgsIHAsIG5vYXVnbWVudCkge1xuICBmb3IgKHZhciBpPTA7IGk8cC5sZW5ndGg7ICsraSkge1xuICAgIGlmICghbm9hdWdtZW50ICYmICEocFtpXSBpbiB4KSl7XG4gICAgICB4ID0geFtwW2ldXSA9IHt9O1xuICAgIH0gZWxzZSB7XG4gICAgICB4ID0geFtwW2ldXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHg7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vZ2xvYmFscycpO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICAgIGNvbnN0cyA9IHJlcXVpcmUoJy4vY29uc3RzJyk7XG5cbnZhciB2bCA9IHt9O1xuXG51dGlsLmV4dGVuZCh2bCwgY29uc3RzLCB1dGlsKTtcblxudmwuRW5jb2RpbmcgPSByZXF1aXJlKCcuL0VuY29kaW5nJyk7XG52bC5jb21waWxlciA9IHJlcXVpcmUoJy4vY29tcGlsZXIvY29tcGlsZXInKTtcbnZsLmNvbXBpbGUgPSB2bC5jb21waWxlci5jb21waWxlO1xudmwuZGF0YSA9IHJlcXVpcmUoJy4vZGF0YScpO1xudmwuZW5jID0gcmVxdWlyZSgnLi9lbmMnKTtcbnZsLmZpZWxkID0gcmVxdWlyZSgnLi9maWVsZCcpO1xudmwuc2NoZW1hID0gcmVxdWlyZSgnLi9zY2hlbWEvc2NoZW1hJyk7XG52bC50b1Nob3J0aGFuZCA9IHZsLkVuY29kaW5nLnNob3J0aGFuZDtcbnZsLmZvcm1hdCA9IHJlcXVpcmUoJ2QzLWZvcm1hdCcpLmZvcm1hdDtcblxubW9kdWxlLmV4cG9ydHMgPSB2bDsiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gIGZhY3RvcnkoKGdsb2JhbC50aW1lID0ge30pKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciB0MSA9IG5ldyBEYXRlO1xuXG4gIHZhciB0MCA9IG5ldyBEYXRlO1xuXG4gIGZ1bmN0aW9uIG5ld0ludGVydmFsKGZsb29yaSwgb2Zmc2V0aSwgY291bnQpIHtcblxuICAgIGZ1bmN0aW9uIGludGVydmFsKGRhdGUpIHtcbiAgICAgIHJldHVybiBmbG9vcmkoZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKSksIGRhdGU7XG4gICAgfVxuXG4gICAgaW50ZXJ2YWwuZmxvb3IgPSBpbnRlcnZhbDtcblxuICAgIGludGVydmFsLnJvdW5kID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgdmFyIGQwID0gbmV3IERhdGUoK2RhdGUpLFxuICAgICAgICAgIGQxID0gbmV3IERhdGUoZGF0ZSAtIDEpO1xuICAgICAgZmxvb3JpKGQwKSwgZmxvb3JpKGQxKSwgb2Zmc2V0aShkMSwgMSk7XG4gICAgICByZXR1cm4gZGF0ZSAtIGQwIDwgZDEgLSBkYXRlID8gZDAgOiBkMTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwuY2VpbCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIHJldHVybiBmbG9vcmkoZGF0ZSA9IG5ldyBEYXRlKGRhdGUgLSAxKSksIG9mZnNldGkoZGF0ZSwgMSksIGRhdGU7XG4gICAgfTtcblxuICAgIGludGVydmFsLm9mZnNldCA9IGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgIHJldHVybiBvZmZzZXRpKGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSksIHN0ZXAgPT0gbnVsbCA/IDEgOiBNYXRoLmZsb29yKHN0ZXApKSwgZGF0ZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgICAgdmFyIHJhbmdlID0gW107XG4gICAgICBzdGFydCA9IG5ldyBEYXRlKHN0YXJ0IC0gMSk7XG4gICAgICBzdG9wID0gbmV3IERhdGUoK3N0b3ApO1xuICAgICAgc3RlcCA9IHN0ZXAgPT0gbnVsbCA/IDEgOiBNYXRoLmZsb29yKHN0ZXApO1xuICAgICAgaWYgKCEoc3RhcnQgPCBzdG9wKSB8fCAhKHN0ZXAgPiAwKSkgcmV0dXJuIHJhbmdlOyAvLyBhbHNvIGhhbmRsZXMgSW52YWxpZCBEYXRlXG4gICAgICBvZmZzZXRpKHN0YXJ0LCAxKSwgZmxvb3JpKHN0YXJ0KTtcbiAgICAgIGlmIChzdGFydCA8IHN0b3ApIHJhbmdlLnB1c2gobmV3IERhdGUoK3N0YXJ0KSk7XG4gICAgICB3aGlsZSAob2Zmc2V0aShzdGFydCwgc3RlcCksIGZsb29yaShzdGFydCksIHN0YXJ0IDwgc3RvcCkgcmFuZ2UucHVzaChuZXcgRGF0ZSgrc3RhcnQpKTtcbiAgICAgIHJldHVybiByYW5nZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwuZmlsdGVyID0gZnVuY3Rpb24odGVzdCkge1xuICAgICAgcmV0dXJuIG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgd2hpbGUgKGZsb29yaShkYXRlKSwgIXRlc3QoZGF0ZSkpIGRhdGUuc2V0VGltZShkYXRlIC0gMSk7XG4gICAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICAgIHdoaWxlICgtLXN0ZXAgPj0gMCkgd2hpbGUgKG9mZnNldGkoZGF0ZSwgMSksICF0ZXN0KGRhdGUpKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBpZiAoY291bnQpIGludGVydmFsLmNvdW50ID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgdDAuc2V0VGltZSgrc3RhcnQpLCB0MS5zZXRUaW1lKCtlbmQpO1xuICAgICAgZmxvb3JpKHQwKSwgZmxvb3JpKHQxKTtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKGNvdW50KHQwLCB0MSkpO1xuICAgIH07XG5cbiAgICByZXR1cm4gaW50ZXJ2YWw7XG4gIH1cblxuICB2YXIgc2Vjb25kID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0TWlsbGlzZWNvbmRzKDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDFlMyk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDFlMztcbiAgfSk7XG5cbiAgZXhwb3J0cy5zZWNvbmRzID0gc2Vjb25kLnJhbmdlO1xuXG4gIHZhciBtaW51dGUgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRTZWNvbmRzKDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDZlNCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDZlNDtcbiAgfSk7XG5cbiAgZXhwb3J0cy5taW51dGVzID0gbWludXRlLnJhbmdlO1xuXG4gIHZhciBob3VyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0TWludXRlcygwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiAzNmU1KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMzZlNTtcbiAgfSk7XG5cbiAgZXhwb3J0cy5ob3VycyA9IGhvdXIucmFuZ2U7XG5cbiAgdmFyIGRheSA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0IC0gKGVuZC5nZXRUaW1lem9uZU9mZnNldCgpIC0gc3RhcnQuZ2V0VGltZXpvbmVPZmZzZXQoKSkgKiA2ZTQpIC8gODY0ZTU7XG4gIH0pO1xuXG4gIGV4cG9ydHMuZGF5cyA9IGRheS5yYW5nZTtcblxuICBmdW5jdGlvbiB3ZWVrZGF5KGkpIHtcbiAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIChkYXRlLmdldERheSgpICsgNyAtIGkpICUgNyk7XG4gICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgc3RlcCAqIDcpO1xuICAgIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiAoZW5kIC0gc3RhcnQgLSAoZW5kLmdldFRpbWV6b25lT2Zmc2V0KCkgLSBzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpKSAqIDZlNCkgLyA2MDQ4ZTU7XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLnN1bmRheSA9IHdlZWtkYXkoMCk7XG5cbiAgZXhwb3J0cy5zdW5kYXlzID0gZXhwb3J0cy5zdW5kYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy5tb25kYXkgPSB3ZWVrZGF5KDEpO1xuXG4gIGV4cG9ydHMubW9uZGF5cyA9IGV4cG9ydHMubW9uZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMudHVlc2RheSA9IHdlZWtkYXkoMik7XG5cbiAgZXhwb3J0cy50dWVzZGF5cyA9IGV4cG9ydHMudHVlc2RheS5yYW5nZTtcblxuICBleHBvcnRzLndlZG5lc2RheSA9IHdlZWtkYXkoMyk7XG5cbiAgZXhwb3J0cy53ZWRuZXNkYXlzID0gZXhwb3J0cy53ZWRuZXNkYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy50aHVyc2RheSA9IHdlZWtkYXkoNCk7XG5cbiAgZXhwb3J0cy50aHVyc2RheXMgPSBleHBvcnRzLnRodXJzZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMuZnJpZGF5ID0gd2Vla2RheSg1KTtcblxuICBleHBvcnRzLmZyaWRheXMgPSBleHBvcnRzLmZyaWRheS5yYW5nZTtcblxuICBleHBvcnRzLnNhdHVyZGF5ID0gd2Vla2RheSg2KTtcblxuICBleHBvcnRzLnNhdHVyZGF5cyA9IGV4cG9ydHMuc2F0dXJkYXkucmFuZ2U7XG5cbiAgdmFyIHdlZWsgPSBleHBvcnRzLnN1bmRheTtcblxuICBleHBvcnRzLndlZWtzID0gd2Vlay5yYW5nZTtcblxuICB2YXIgbW9udGggPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldERhdGUoMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRNb250aCgpIC0gc3RhcnQuZ2V0TW9udGgoKSArIChlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCkpICogMTI7XG4gIH0pO1xuXG4gIGV4cG9ydHMubW9udGhzID0gbW9udGgucmFuZ2U7XG5cbiAgdmFyIHllYXIgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldE1vbnRoKDAsIDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCk7XG4gIH0pO1xuXG4gIGV4cG9ydHMueWVhcnMgPSB5ZWFyLnJhbmdlO1xuXG4gIHZhciB1dGNTZWNvbmQgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENNaWxsaXNlY29uZHMoMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMWUzKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMWUzO1xuICB9KTtcblxuICBleHBvcnRzLnV0Y1NlY29uZHMgPSB1dGNTZWNvbmQucmFuZ2U7XG5cbiAgdmFyIHV0Y01pbnV0ZSA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ1NlY29uZHMoMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogNmU0KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gNmU0O1xuICB9KTtcblxuICBleHBvcnRzLnV0Y01pbnV0ZXMgPSB1dGNNaW51dGUucmFuZ2U7XG5cbiAgdmFyIHV0Y0hvdXIgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENNaW51dGVzKDAsIDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDM2ZTUpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyAzNmU1O1xuICB9KTtcblxuICBleHBvcnRzLnV0Y0hvdXJzID0gdXRjSG91ci5yYW5nZTtcblxuICB2YXIgdXRjRGF5ID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gODY0ZTU7XG4gIH0pO1xuXG4gIGV4cG9ydHMudXRjRGF5cyA9IHV0Y0RheS5yYW5nZTtcblxuICBmdW5jdGlvbiB1dGNXZWVrZGF5KGkpIHtcbiAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSAtIChkYXRlLmdldFVUQ0RheSgpICsgNyAtIGkpICUgNyk7XG4gICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpICsgc3RlcCAqIDcpO1xuICAgIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gNjA0OGU1O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy51dGNTdW5kYXkgPSB1dGNXZWVrZGF5KDApO1xuXG4gIGV4cG9ydHMudXRjU3VuZGF5cyA9IGV4cG9ydHMudXRjU3VuZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMudXRjTW9uZGF5ID0gdXRjV2Vla2RheSgxKTtcblxuICBleHBvcnRzLnV0Y01vbmRheXMgPSBleHBvcnRzLnV0Y01vbmRheS5yYW5nZTtcblxuICBleHBvcnRzLnV0Y1R1ZXNkYXkgPSB1dGNXZWVrZGF5KDIpO1xuXG4gIGV4cG9ydHMudXRjVHVlc2RheXMgPSBleHBvcnRzLnV0Y1R1ZXNkYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy51dGNXZWRuZXNkYXkgPSB1dGNXZWVrZGF5KDMpO1xuXG4gIGV4cG9ydHMudXRjV2VkbmVzZGF5cyA9IGV4cG9ydHMudXRjV2VkbmVzZGF5LnJhbmdlO1xuXG4gIGV4cG9ydHMudXRjVGh1cnNkYXkgPSB1dGNXZWVrZGF5KDQpO1xuXG4gIGV4cG9ydHMudXRjVGh1cnNkYXlzID0gZXhwb3J0cy51dGNUaHVyc2RheS5yYW5nZTtcblxuICBleHBvcnRzLnV0Y0ZyaWRheSA9IHV0Y1dlZWtkYXkoNSk7XG5cbiAgZXhwb3J0cy51dGNGcmlkYXlzID0gZXhwb3J0cy51dGNGcmlkYXkucmFuZ2U7XG5cbiAgZXhwb3J0cy51dGNTYXR1cmRheSA9IHV0Y1dlZWtkYXkoNik7XG5cbiAgZXhwb3J0cy51dGNTYXR1cmRheXMgPSBleHBvcnRzLnV0Y1NhdHVyZGF5LnJhbmdlO1xuXG4gIHZhciB1dGNXZWVrID0gZXhwb3J0cy51dGNTdW5kYXk7XG5cbiAgZXhwb3J0cy51dGNXZWVrcyA9IHV0Y1dlZWsucmFuZ2U7XG5cbiAgdmFyIHV0Y01vbnRoID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXRVVENEYXRlKDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRVVENNb250aChkYXRlLmdldFVUQ01vbnRoKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0VVRDTW9udGgoKSAtIHN0YXJ0LmdldFVUQ01vbnRoKCkgKyAoZW5kLmdldFVUQ0Z1bGxZZWFyKCkgLSBzdGFydC5nZXRVVENGdWxsWWVhcigpKSAqIDEyO1xuICB9KTtcblxuICBleHBvcnRzLnV0Y01vbnRocyA9IHV0Y01vbnRoLnJhbmdlO1xuXG4gIHZhciB1dGNZZWFyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXRVVENNb250aCgwLCAxKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoZGF0ZS5nZXRVVENGdWxsWWVhcigpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZW5kLmdldFVUQ0Z1bGxZZWFyKCkgLSBzdGFydC5nZXRVVENGdWxsWWVhcigpO1xuICB9KTtcblxuICBleHBvcnRzLnV0Y1llYXJzID0gdXRjWWVhci5yYW5nZTtcblxuICBleHBvcnRzLmludGVydmFsID0gbmV3SW50ZXJ2YWw7XG4gIGV4cG9ydHMuc2Vjb25kID0gc2Vjb25kO1xuICBleHBvcnRzLm1pbnV0ZSA9IG1pbnV0ZTtcbiAgZXhwb3J0cy5ob3VyID0gaG91cjtcbiAgZXhwb3J0cy5kYXkgPSBkYXk7XG4gIGV4cG9ydHMud2VlayA9IHdlZWs7XG4gIGV4cG9ydHMubW9udGggPSBtb250aDtcbiAgZXhwb3J0cy55ZWFyID0geWVhcjtcbiAgZXhwb3J0cy51dGNTZWNvbmQgPSB1dGNTZWNvbmQ7XG4gIGV4cG9ydHMudXRjTWludXRlID0gdXRjTWludXRlO1xuICBleHBvcnRzLnV0Y0hvdXIgPSB1dGNIb3VyO1xuICBleHBvcnRzLnV0Y0RheSA9IHV0Y0RheTtcbiAgZXhwb3J0cy51dGNXZWVrID0gdXRjV2VlaztcbiAgZXhwb3J0cy51dGNNb250aCA9IHV0Y01vbnRoO1xuICBleHBvcnRzLnV0Y1llYXIgPSB1dGNZZWFyO1xuXG59KSk7IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gICAgdGltZSA9IHJlcXVpcmUoJy4uL3RpbWUnKSxcbiAgICBFUFNJTE9OID0gMWUtMTU7XG5cbmZ1bmN0aW9uIGJpbnMob3B0KSB7XG4gIGlmICghb3B0KSB7IHRocm93IEVycm9yKFwiTWlzc2luZyBiaW5uaW5nIG9wdGlvbnMuXCIpOyB9XG5cbiAgLy8gZGV0ZXJtaW5lIHJhbmdlXG4gIHZhciBtYXhiID0gb3B0Lm1heGJpbnMgfHwgMTUsXG4gICAgICBiYXNlID0gb3B0LmJhc2UgfHwgMTAsXG4gICAgICBsb2diID0gTWF0aC5sb2coYmFzZSksXG4gICAgICBkaXYgPSBvcHQuZGl2IHx8IFs1LCAyXSwgICAgICBcbiAgICAgIG1pbiA9IG9wdC5taW4sXG4gICAgICBtYXggPSBvcHQubWF4LFxuICAgICAgc3BhbiA9IG1heCAtIG1pbixcbiAgICAgIHN0ZXAsIGxldmVsLCBtaW5zdGVwLCBwcmVjaXNpb24sIHYsIGksIGVwcztcblxuICBpZiAob3B0LnN0ZXApIHtcbiAgICAvLyBpZiBzdGVwIHNpemUgaXMgZXhwbGljaXRseSBnaXZlbiwgdXNlIHRoYXRcbiAgICBzdGVwID0gb3B0LnN0ZXA7XG4gIH0gZWxzZSBpZiAob3B0LnN0ZXBzKSB7XG4gICAgLy8gaWYgcHJvdmlkZWQsIGxpbWl0IGNob2ljZSB0byBhY2NlcHRhYmxlIHN0ZXAgc2l6ZXNcbiAgICBzdGVwID0gb3B0LnN0ZXBzW01hdGgubWluKFxuICAgICAgb3B0LnN0ZXBzLmxlbmd0aCAtIDEsXG4gICAgICBiaXNlY3Qob3B0LnN0ZXBzLCBzcGFuL21heGIsIDAsIG9wdC5zdGVwcy5sZW5ndGgpXG4gICAgKV07XG4gIH0gZWxzZSB7XG4gICAgLy8gZWxzZSB1c2Ugc3BhbiB0byBkZXRlcm1pbmUgc3RlcCBzaXplXG4gICAgbGV2ZWwgPSBNYXRoLmNlaWwoTWF0aC5sb2cobWF4YikgLyBsb2diKTtcbiAgICBtaW5zdGVwID0gb3B0Lm1pbnN0ZXAgfHwgMDtcbiAgICBzdGVwID0gTWF0aC5tYXgoXG4gICAgICBtaW5zdGVwLFxuICAgICAgTWF0aC5wb3coYmFzZSwgTWF0aC5yb3VuZChNYXRoLmxvZyhzcGFuKSAvIGxvZ2IpIC0gbGV2ZWwpXG4gICAgKTtcbiAgICBcbiAgICAvLyBpbmNyZWFzZSBzdGVwIHNpemUgaWYgdG9vIG1hbnkgYmluc1xuICAgIGRvIHsgc3RlcCAqPSBiYXNlOyB9IHdoaWxlIChNYXRoLmNlaWwoc3Bhbi9zdGVwKSA+IG1heGIpO1xuXG4gICAgLy8gZGVjcmVhc2Ugc3RlcCBzaXplIGlmIGFsbG93ZWRcbiAgICBmb3IgKGk9MDsgaTxkaXYubGVuZ3RoOyArK2kpIHtcbiAgICAgIHYgPSBzdGVwIC8gZGl2W2ldO1xuICAgICAgaWYgKHYgPj0gbWluc3RlcCAmJiBzcGFuIC8gdiA8PSBtYXhiKSBzdGVwID0gdjtcbiAgICB9XG4gIH1cblxuICAvLyB1cGRhdGUgcHJlY2lzaW9uLCBtaW4gYW5kIG1heFxuICB2ID0gTWF0aC5sb2coc3RlcCk7XG4gIHByZWNpc2lvbiA9IHYgPj0gMCA/IDAgOiB+figtdiAvIGxvZ2IpICsgMTtcbiAgZXBzID0gTWF0aC5wb3coYmFzZSwgLXByZWNpc2lvbiAtIDEpO1xuICBtaW4gPSBNYXRoLm1pbihtaW4sIE1hdGguZmxvb3IobWluIC8gc3RlcCArIGVwcykgKiBzdGVwKTtcbiAgbWF4ID0gTWF0aC5jZWlsKG1heCAvIHN0ZXApICogc3RlcDtcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBtaW4sXG4gICAgc3RvcDogIG1heCxcbiAgICBzdGVwOiAgc3RlcCxcbiAgICB1bml0OiAge3ByZWNpc2lvbjogcHJlY2lzaW9ufSxcbiAgICB2YWx1ZTogdmFsdWUsXG4gICAgaW5kZXg6IGluZGV4XG4gIH07XG59XG5cbmZ1bmN0aW9uIGJpc2VjdChhLCB4LCBsbywgaGkpIHtcbiAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICB2YXIgbWlkID0gbG8gKyBoaSA+Pj4gMTtcbiAgICBpZiAodXRpbC5jbXAoYVttaWRdLCB4KSA8IDApIHsgbG8gPSBtaWQgKyAxOyB9XG4gICAgZWxzZSB7IGhpID0gbWlkOyB9XG4gIH1cbiAgcmV0dXJuIGxvO1xufVxuXG5mdW5jdGlvbiB2YWx1ZSh2KSB7XG4gIHJldHVybiB0aGlzLnN0ZXAgKiBNYXRoLmZsb29yKHYgLyB0aGlzLnN0ZXAgKyBFUFNJTE9OKTtcbn1cblxuZnVuY3Rpb24gaW5kZXgodikge1xuICByZXR1cm4gTWF0aC5mbG9vcigodiAtIHRoaXMuc3RhcnQpIC8gdGhpcy5zdGVwICsgRVBTSUxPTik7XG59XG5cbmZ1bmN0aW9uIGRhdGVfdmFsdWUodikge1xuICByZXR1cm4gdGhpcy51bml0LmRhdGUodmFsdWUuY2FsbCh0aGlzLCB2KSk7XG59XG5cbmZ1bmN0aW9uIGRhdGVfaW5kZXgodikge1xuICByZXR1cm4gaW5kZXguY2FsbCh0aGlzLCB0aGlzLnVuaXQudW5pdCh2KSk7XG59XG5cbmJpbnMuZGF0ZSA9IGZ1bmN0aW9uKG9wdCkge1xuICBpZiAoIW9wdCkgeyB0aHJvdyBFcnJvcihcIk1pc3NpbmcgZGF0ZSBiaW5uaW5nIG9wdGlvbnMuXCIpOyB9XG5cbiAgLy8gZmluZCB0aW1lIHN0ZXAsIHRoZW4gYmluXG4gIHZhciB1bml0cyA9IG9wdC51dGMgPyB0aW1lLnV0YyA6IHRpbWUsXG4gICAgICBkbWluID0gb3B0Lm1pbixcbiAgICAgIGRtYXggPSBvcHQubWF4LFxuICAgICAgbWF4YiA9IG9wdC5tYXhiaW5zIHx8IDIwLFxuICAgICAgbWluYiA9IG9wdC5taW5iaW5zIHx8IDQsXG4gICAgICBzcGFuID0gKCtkbWF4KSAtICgrZG1pbiksXG4gICAgICB1bml0ID0gb3B0LnVuaXQgPyB1bml0c1tvcHQudW5pdF0gOiB1bml0cy5maW5kKHNwYW4sIG1pbmIsIG1heGIpLFxuICAgICAgc3BlYyA9IGJpbnMoe1xuICAgICAgICBtaW46ICAgICB1bml0Lm1pbiAhPSBudWxsID8gdW5pdC5taW4gOiB1bml0LnVuaXQoZG1pbiksXG4gICAgICAgIG1heDogICAgIHVuaXQubWF4ICE9IG51bGwgPyB1bml0Lm1heCA6IHVuaXQudW5pdChkbWF4KSxcbiAgICAgICAgbWF4YmluczogbWF4YixcbiAgICAgICAgbWluc3RlcDogdW5pdC5taW5zdGVwLFxuICAgICAgICBzdGVwczogICB1bml0LnN0ZXBcbiAgICAgIH0pO1xuXG4gIHNwZWMudW5pdCA9IHVuaXQ7XG4gIHNwZWMuaW5kZXggPSBkYXRlX2luZGV4O1xuICBpZiAoIW9wdC5yYXcpIHNwZWMudmFsdWUgPSBkYXRlX3ZhbHVlO1xuICByZXR1cm4gc3BlYztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmlucztcbiIsInZhciBnZW4gPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5nZW4ucmVwZWF0ID0gZnVuY3Rpb24odmFsLCBuKSB7XG4gIHZhciBhID0gQXJyYXkobiksIGk7XG4gIGZvciAoaT0wOyBpPG47ICsraSkgYVtpXSA9IHZhbDtcbiAgcmV0dXJuIGE7XG59O1xuXG5nZW4uemVyb3MgPSBmdW5jdGlvbihuKSB7XG4gIHJldHVybiBnZW4ucmVwZWF0KDAsIG4pO1xufTtcblxuZ2VuLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgc3RlcCA9IDE7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBzdG9wID0gc3RhcnQ7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICB9XG4gIGlmICgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXAgPT0gSW5maW5pdHkpIHRocm93IG5ldyBFcnJvcignSW5maW5pdGUgcmFuZ2UnKTtcbiAgdmFyIHJhbmdlID0gW10sIGkgPSAtMSwgajtcbiAgaWYgKHN0ZXAgPCAwKSB3aGlsZSAoKGogPSBzdGFydCArIHN0ZXAgKiArK2kpID4gc3RvcCkgcmFuZ2UucHVzaChqKTtcbiAgZWxzZSB3aGlsZSAoKGogPSBzdGFydCArIHN0ZXAgKiArK2kpIDwgc3RvcCkgcmFuZ2UucHVzaChqKTtcbiAgcmV0dXJuIHJhbmdlO1xufTtcblxuZ2VuLnJhbmRvbSA9IHt9O1xuXG5nZW4ucmFuZG9tLnVuaWZvcm0gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICBpZiAobWF4ID09PSB1bmRlZmluZWQpIHtcbiAgICBtYXggPSBtaW4gPT09IHVuZGVmaW5lZCA/IDEgOiBtaW47XG4gICAgbWluID0gMDtcbiAgfVxuICB2YXIgZCA9IG1heCAtIG1pbjtcbiAgdmFyIGYgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbWluICsgZCAqIE1hdGgucmFuZG9tKCk7XG4gIH07XG4gIGYuc2FtcGxlcyA9IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIGdlbi56ZXJvcyhuKS5tYXAoZik7IH07XG4gIHJldHVybiBmO1xufTtcblxuZ2VuLnJhbmRvbS5pbnRlZ2VyID0gZnVuY3Rpb24oYSwgYikge1xuICBpZiAoYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYiA9IGE7XG4gICAgYSA9IDA7XG4gIH1cbiAgdmFyIGQgPSBiIC0gYTtcbiAgdmFyIGYgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYSArIE1hdGguZmxvb3IoZCAqIE1hdGgucmFuZG9tKCkpO1xuICB9O1xuICBmLnNhbXBsZXMgPSBmdW5jdGlvbihuKSB7IHJldHVybiBnZW4uemVyb3MobikubWFwKGYpOyB9O1xuICByZXR1cm4gZjtcbn07XG5cbmdlbi5yYW5kb20ubm9ybWFsID0gZnVuY3Rpb24obWVhbiwgc3RkZXYpIHtcbiAgbWVhbiA9IG1lYW4gfHwgMDtcbiAgc3RkZXYgPSBzdGRldiB8fCAxO1xuICB2YXIgbmV4dDtcbiAgdmFyIGYgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IDAsIHkgPSAwLCByZHMsIGM7XG4gICAgaWYgKG5leHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgeCA9IG5leHQ7XG4gICAgICBuZXh0ID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICAgIGRvIHtcbiAgICAgIHggPSBNYXRoLnJhbmRvbSgpKjItMTtcbiAgICAgIHkgPSBNYXRoLnJhbmRvbSgpKjItMTtcbiAgICAgIHJkcyA9IHgqeCArIHkqeTtcbiAgICB9IHdoaWxlIChyZHMgPT09IDAgfHwgcmRzID4gMSk7XG4gICAgYyA9IE1hdGguc3FydCgtMipNYXRoLmxvZyhyZHMpL3Jkcyk7IC8vIEJveC1NdWxsZXIgdHJhbnNmb3JtXG4gICAgbmV4dCA9IG1lYW4gKyB5KmMqc3RkZXY7XG4gICAgcmV0dXJuIG1lYW4gKyB4KmMqc3RkZXY7XG4gIH07XG4gIGYuc2FtcGxlcyA9IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIGdlbi56ZXJvcyhuKS5tYXAoZik7IH07XG4gIHJldHVybiBmO1xufTsiLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIFRZUEVTID0gJ19fdHlwZXNfXyc7XG5cbnZhciBQQVJTRVJTID0ge1xuICBib29sZWFuOiB1dGlsLmJvb2xlYW4sXG4gIGludGVnZXI6IHV0aWwubnVtYmVyLFxuICBudW1iZXI6ICB1dGlsLm51bWJlcixcbiAgZGF0ZTogICAgdXRpbC5kYXRlLFxuICBzdHJpbmc6ICBmdW5jdGlvbih4KSB7IHJldHVybiB4PT09JycgPyBudWxsIDogeDsgfVxufTtcblxudmFyIFRFU1RTID0ge1xuICBib29sZWFuOiBmdW5jdGlvbih4KSB7IHJldHVybiB4PT09J3RydWUnIHx8IHg9PT0nZmFsc2UnIHx8IHV0aWwuaXNCb29sZWFuKHgpOyB9LFxuICBpbnRlZ2VyOiBmdW5jdGlvbih4KSB7IHJldHVybiBURVNUUy5udW1iZXIoeCkgJiYgKHg9K3gpID09PSB+fng7IH0sXG4gIG51bWJlcjogZnVuY3Rpb24oeCkgeyByZXR1cm4gIWlzTmFOKCt4KSAmJiAhdXRpbC5pc0RhdGUoeCk7IH0sXG4gIGRhdGU6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuICFpc05hTihEYXRlLnBhcnNlKHgpKTsgfVxufTtcblxuZnVuY3Rpb24gYW5ub3RhdGlvbihkYXRhLCB0eXBlcykge1xuICBpZiAoIXR5cGVzKSByZXR1cm4gZGF0YSAmJiBkYXRhW1RZUEVTXSB8fCBudWxsO1xuICBkYXRhW1RZUEVTXSA9IHR5cGVzO1xufVxuXG5mdW5jdGlvbiB0eXBlKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgdiwgaSwgbjtcblxuICAvLyBpZiBkYXRhIGFycmF5IGhhcyB0eXBlIGFubm90YXRpb25zLCB1c2UgdGhlbVxuICBpZiAodmFsdWVzW1RZUEVTXSkge1xuICAgIHYgPSBmKHZhbHVlc1tUWVBFU10pO1xuICAgIGlmICh1dGlsLmlzU3RyaW5nKHYpKSByZXR1cm4gdjtcbiAgfVxuXG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7ICF1dGlsLmlzVmFsaWQodikgJiYgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgfVxuXG4gIHJldHVybiB1dGlsLmlzRGF0ZSh2KSA/ICdkYXRlJyA6XG4gICAgdXRpbC5pc051bWJlcih2KSAgICA/ICdudW1iZXInIDpcbiAgICB1dGlsLmlzQm9vbGVhbih2KSAgID8gJ2Jvb2xlYW4nIDpcbiAgICB1dGlsLmlzU3RyaW5nKHYpICAgID8gJ3N0cmluZycgOiBudWxsO1xufVxuXG5mdW5jdGlvbiB0eXBlQWxsKGRhdGEsIGZpZWxkcykge1xuICBpZiAoIWRhdGEubGVuZ3RoKSByZXR1cm47XG4gIGZpZWxkcyA9IGZpZWxkcyB8fCB1dGlsLmtleXMoZGF0YVswXSk7XG4gIHJldHVybiBmaWVsZHMucmVkdWNlKGZ1bmN0aW9uKHR5cGVzLCBmKSB7XG4gICAgcmV0dXJuICh0eXBlc1tmXSA9IHR5cGUoZGF0YSwgZiksIHR5cGVzKTtcbiAgfSwge30pO1xufVxuXG5mdW5jdGlvbiBpbmZlcih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIGksIGosIHY7XG5cbiAgLy8gdHlwZXMgdG8gdGVzdCBmb3IsIGluIHByZWNlZGVuY2Ugb3JkZXJcbiAgdmFyIHR5cGVzID0gWydib29sZWFuJywgJ2ludGVnZXInLCAnbnVtYmVyJywgJ2RhdGUnXTtcblxuICBmb3IgKGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBnZXQgbmV4dCB2YWx1ZSB0byB0ZXN0XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgLy8gdGVzdCB2YWx1ZSBhZ2FpbnN0IHJlbWFpbmluZyB0eXBlc1xuICAgIGZvciAoaj0wOyBqPHR5cGVzLmxlbmd0aDsgKytqKSB7XG4gICAgICBpZiAodXRpbC5pc1ZhbGlkKHYpICYmICFURVNUU1t0eXBlc1tqXV0odikpIHtcbiAgICAgICAgdHlwZXMuc3BsaWNlKGosIDEpO1xuICAgICAgICBqIC09IDE7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlmIG5vIHR5cGVzIGxlZnQsIHJldHVybiAnc3RyaW5nJ1xuICAgIGlmICh0eXBlcy5sZW5ndGggPT09IDApIHJldHVybiAnc3RyaW5nJztcbiAgfVxuXG4gIHJldHVybiB0eXBlc1swXTtcbn1cblxuZnVuY3Rpb24gaW5mZXJBbGwoZGF0YSwgZmllbGRzKSB7XG4gIGZpZWxkcyA9IGZpZWxkcyB8fCB1dGlsLmtleXMoZGF0YVswXSk7XG4gIHJldHVybiBmaWVsZHMucmVkdWNlKGZ1bmN0aW9uKHR5cGVzLCBmKSB7XG4gICAgdHlwZXNbZl0gPSBpbmZlcihkYXRhLCBmKTtcbiAgICByZXR1cm4gdHlwZXM7XG4gIH0sIHt9KTtcbn1cblxudHlwZS5hbm5vdGF0aW9uID0gYW5ub3RhdGlvbjtcbnR5cGUuYWxsID0gdHlwZUFsbDtcbnR5cGUuaW5mZXIgPSBpbmZlcjtcbnR5cGUuaW5mZXJBbGwgPSBpbmZlckFsbDtcbnR5cGUucGFyc2VycyA9IFBBUlNFUlM7XG5tb2R1bGUuZXhwb3J0cyA9IHR5cGU7IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciB0eXBlID0gcmVxdWlyZSgnLi9pbXBvcnQvdHlwZScpO1xudmFyIGdlbiA9IHJlcXVpcmUoJy4vZ2VuZXJhdGUnKTtcbnZhciBzdGF0cyA9IHt9O1xuXG4vLyBDb2xsZWN0IHVuaXF1ZSB2YWx1ZXMuXG4vLyBPdXRwdXQ6IGFuIGFycmF5IG9mIHVuaXF1ZSB2YWx1ZXMsIGluIGZpcnN0LW9ic2VydmVkIG9yZGVyXG5zdGF0cy51bmlxdWUgPSBmdW5jdGlvbih2YWx1ZXMsIGYsIHJlc3VsdHMpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XG4gIHZhciB1ID0ge30sIHYsIGksIG47XG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHYgaW4gdSkgY29udGludWU7XG4gICAgdVt2XSA9IDE7XG4gICAgcmVzdWx0cy5wdXNoKHYpO1xuICB9XG4gIHJldHVybiByZXN1bHRzO1xufTtcblxuLy8gUmV0dXJuIHRoZSBsZW5ndGggb2YgdGhlIGlucHV0IGFycmF5Llxuc3RhdHMuY291bnQgPSBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgcmV0dXJuIHZhbHVlcyAmJiB2YWx1ZXMubGVuZ3RoIHx8IDA7XG59O1xuXG4vLyBDb3VudCB0aGUgbnVtYmVyIG9mIG5vbi1udWxsLCBub24tdW5kZWZpbmVkLCBub24tTmFOIHZhbHVlcy5cbnN0YXRzLmNvdW50LnZhbGlkID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciB2LCBpLCBuLCB2YWxpZCA9IDA7XG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkgdmFsaWQgKz0gMTtcbiAgfVxuICByZXR1cm4gdmFsaWQ7XG59O1xuXG4vLyBDb3VudCB0aGUgbnVtYmVyIG9mIG51bGwgb3IgdW5kZWZpbmVkIHZhbHVlcy5cbnN0YXRzLmNvdW50Lm1pc3NpbmcgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIHYsIGksIG4sIGNvdW50ID0gMDtcbiAgZm9yIChpPTAsIG49dmFsdWVzLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodiA9PSBudWxsKSBjb3VudCArPSAxO1xuICB9XG4gIHJldHVybiBjb3VudDtcbn07XG5cbi8vIENvdW50IHRoZSBudW1iZXIgb2YgZGlzdGluY3QgdmFsdWVzLlxuLy8gTnVsbCwgdW5kZWZpbmVkIGFuZCBOYU4gYXJlIGVhY2ggY29uc2lkZXJlZCBkaXN0aW5jdCB2YWx1ZXMuXG5zdGF0cy5jb3VudC5kaXN0aW5jdCA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICB2YXIgdSA9IHt9LCB2LCBpLCBuLCBjb3VudCA9IDA7XG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHYgaW4gdSkgY29udGludWU7XG4gICAgdVt2XSA9IDE7XG4gICAgY291bnQgKz0gMTtcbiAgfVxuICByZXR1cm4gY291bnQ7XG59O1xuXG4vLyBDb25zdHJ1Y3QgYSBtYXAgZnJvbSBkaXN0aW5jdCB2YWx1ZXMgdG8gb2NjdXJyZW5jZSBjb3VudHMuXG5zdGF0cy5jb3VudC5tYXAgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIG1hcCA9IHt9LCB2LCBpLCBuO1xuICBmb3IgKGk9MCwgbj12YWx1ZXMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIG1hcFt2XSA9ICh2IGluIG1hcCkgPyBtYXBbdl0gKyAxIDogMTtcbiAgfVxuICByZXR1cm4gbWFwO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgbWVkaWFuIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5tZWRpYW4gPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgaWYgKGYpIHZhbHVlcyA9IHZhbHVlcy5tYXAodXRpbC4kKGYpKTtcbiAgdmFsdWVzID0gdmFsdWVzLmZpbHRlcih1dGlsLmlzVmFsaWQpLnNvcnQodXRpbC5jbXApO1xuICByZXR1cm4gc3RhdHMucXVhbnRpbGUodmFsdWVzLCAwLjUpO1xufTtcblxuLy8gQ29tcHV0ZXMgdGhlIHF1YXJ0aWxlIGJvdW5kYXJpZXMgb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLnF1YXJ0aWxlID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGlmIChmKSB2YWx1ZXMgPSB2YWx1ZXMubWFwKHV0aWwuJChmKSk7XG4gIHZhbHVlcyA9IHZhbHVlcy5maWx0ZXIodXRpbC5pc1ZhbGlkKS5zb3J0KHV0aWwuY21wKTtcbiAgdmFyIHEgPSBzdGF0cy5xdWFudGlsZTtcbiAgcmV0dXJuIFtxKHZhbHVlcywgMC4yNSksIHEodmFsdWVzLCAwLjUwKSwgcSh2YWx1ZXMsIDAuNzUpXTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIHF1YW50aWxlIG9mIGEgc29ydGVkIGFycmF5IG9mIG51bWJlcnMuXG4vLyBBZGFwdGVkIGZyb20gdGhlIEQzLmpzIGltcGxlbWVudGF0aW9uLlxuc3RhdHMucXVhbnRpbGUgPSBmdW5jdGlvbih2YWx1ZXMsIGYsIHApIHtcbiAgaWYgKHAgPT09IHVuZGVmaW5lZCkgeyBwID0gZjsgZiA9IHV0aWwuaWRlbnRpdHk7IH1cbiAgZiA9IHV0aWwuJChmKTtcbiAgdmFyIEggPSAodmFsdWVzLmxlbmd0aCAtIDEpICogcCArIDEsXG4gICAgICBoID0gTWF0aC5mbG9vcihIKSxcbiAgICAgIHYgPSArZih2YWx1ZXNbaCAtIDFdKSxcbiAgICAgIGUgPSBIIC0gaDtcbiAgcmV0dXJuIGUgPyB2ICsgZSAqIChmKHZhbHVlc1toXSkgLSB2KSA6IHY7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBzdW0gb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLnN1bSA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBmID0gdXRpbC4kKGYpO1xuICBmb3IgKHZhciBzdW09MCwgaT0wLCBuPXZhbHVlcy5sZW5ndGgsIHY7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkgc3VtICs9IHY7XG4gIH1cbiAgcmV0dXJuIHN1bTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIG1lYW4gKGF2ZXJhZ2UpIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5tZWFuID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciBtZWFuID0gMCwgZGVsdGEsIGksIG4sIGMsIHY7XG4gIGZvciAoaT0wLCBjPTAsIG49dmFsdWVzLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodXRpbC5pc1ZhbGlkKHYpKSB7XG4gICAgICBkZWx0YSA9IHYgLSBtZWFuO1xuICAgICAgbWVhbiA9IG1lYW4gKyBkZWx0YSAvICgrK2MpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbWVhbjtcbn07XG5cbi8vIENvbXB1dGUgdGhlIHNhbXBsZSB2YXJpYW5jZSBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMudmFyaWFuY2UgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgZiA9IHV0aWwuJChmKTtcbiAgaWYgKCF1dGlsLmlzQXJyYXkodmFsdWVzKSB8fCB2YWx1ZXMubGVuZ3RoIDwgMikgcmV0dXJuIDA7XG4gIHZhciBtZWFuID0gMCwgTTIgPSAwLCBkZWx0YSwgaSwgYywgdjtcbiAgZm9yIChpPTAsIGM9MDsgaTx2YWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodXRpbC5pc1ZhbGlkKHYpKSB7XG4gICAgICBkZWx0YSA9IHYgLSBtZWFuO1xuICAgICAgbWVhbiA9IG1lYW4gKyBkZWx0YSAvICgrK2MpO1xuICAgICAgTTIgPSBNMiArIGRlbHRhICogKHYgLSBtZWFuKTtcbiAgICB9XG4gIH1cbiAgTTIgPSBNMiAvIChjIC0gMSk7XG4gIHJldHVybiBNMjtcbn07XG5cbi8vIENvbXB1dGUgdGhlIHNhbXBsZSBzdGFuZGFyZCBkZXZpYXRpb24gb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLnN0ZGV2ID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIHJldHVybiBNYXRoLnNxcnQoc3RhdHMudmFyaWFuY2UodmFsdWVzLCBmKSk7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBQZWFyc29uIG1vZGUgc2tld25lc3MgKChtZWRpYW4tbWVhbikvc3RkZXYpIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5tb2Rlc2tldyA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICB2YXIgYXZnID0gc3RhdHMubWVhbih2YWx1ZXMsIGYpLFxuICAgICAgbWVkID0gc3RhdHMubWVkaWFuKHZhbHVlcywgZiksXG4gICAgICBzdGQgPSBzdGF0cy5zdGRldih2YWx1ZXMsIGYpO1xuICByZXR1cm4gc3RkID09PSAwID8gMCA6IChhdmcgLSBtZWQpIC8gc3RkO1xufTtcblxuLy8gRmluZCB0aGUgbWluaW11bSB2YWx1ZSBpbiBhbiBhcnJheS5cbnN0YXRzLm1pbiA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICByZXR1cm4gc3RhdHMuZXh0ZW50KHZhbHVlcywgZilbMF07XG59O1xuXG4vLyBGaW5kIHRoZSBtYXhpbXVtIHZhbHVlIGluIGFuIGFycmF5Llxuc3RhdHMubWF4ID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIHJldHVybiBzdGF0cy5leHRlbnQodmFsdWVzLCBmKVsxXTtcbn07XG5cbi8vIEZpbmQgdGhlIG1pbmltdW0gYW5kIG1heGltdW0gb2YgYW4gYXJyYXkgb2YgdmFsdWVzLlxuc3RhdHMuZXh0ZW50ID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciBhLCBiLCB2LCBpLCBuID0gdmFsdWVzLmxlbmd0aDtcbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkgeyBhID0gYiA9IHY7IGJyZWFrOyB9XG4gIH1cbiAgZm9yICg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkge1xuICAgICAgaWYgKHYgPCBhKSBhID0gdjtcbiAgICAgIGlmICh2ID4gYikgYiA9IHY7XG4gICAgfVxuICB9XG4gIHJldHVybiBbYSwgYl07XG59O1xuXG4vLyBGaW5kIHRoZSBpbnRlZ2VyIGluZGljZXMgb2YgdGhlIG1pbmltdW0gYW5kIG1heGltdW0gdmFsdWVzLlxuc3RhdHMuZXh0ZW50LmluZGV4ID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciB4ID0gLTEsIHkgPSAtMSwgYSwgYiwgdiwgaSwgbiA9IHZhbHVlcy5sZW5ndGg7XG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzVmFsaWQodikpIHsgYSA9IGIgPSB2OyB4ID0geSA9IGk7IGJyZWFrOyB9XG4gIH1cbiAgZm9yICg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNWYWxpZCh2KSkge1xuICAgICAgaWYgKHYgPCBhKSB7IGEgPSB2OyB4ID0gaTsgfVxuICAgICAgaWYgKHYgPiBiKSB7IGIgPSB2OyB5ID0gaTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gW3gsIHldO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIGFycmF5cyBvZiBudW1iZXJzLlxuc3RhdHMuZG90ID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiKSB7XG4gIHZhciBzdW0gPSAwLCBpLCB2O1xuICBpZiAoIWIpIHtcbiAgICBpZiAodmFsdWVzLmxlbmd0aCAhPT0gYS5sZW5ndGgpIHtcbiAgICAgIHRocm93IEVycm9yKCdBcnJheSBsZW5ndGhzIG11c3QgbWF0Y2guJyk7XG4gICAgfVxuICAgIGZvciAoaT0wOyBpPHZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgICAgdiA9IHZhbHVlc1tpXSAqIGFbaV07XG4gICAgICBpZiAodiA9PT0gdikgc3VtICs9IHY7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGEgPSB1dGlsLiQoYSk7XG4gICAgYiA9IHV0aWwuJChiKTtcbiAgICBmb3IgKGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHYgPSBhKHZhbHVlc1tpXSkgKiBiKHZhbHVlc1tpXSk7XG4gICAgICBpZiAodiA9PT0gdikgc3VtICs9IHY7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdW07XG59O1xuXG4vLyBDb21wdXRlIGFzY2VuZGluZyByYW5rIHNjb3JlcyBmb3IgYW4gYXJyYXkgb2YgdmFsdWVzLlxuLy8gVGllcyBhcmUgYXNzaWduZWQgdGhlaXIgY29sbGVjdGl2ZSBtZWFuIHJhbmsuXG5zdGF0cy5yYW5rID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZikgfHwgdXRpbC5pZGVudGl0eTtcbiAgdmFyIGEgPSB2YWx1ZXMubWFwKGZ1bmN0aW9uKHYsIGkpIHtcbiAgICAgIHJldHVybiB7aWR4OiBpLCB2YWw6IGYodil9O1xuICAgIH0pXG4gICAgLnNvcnQodXRpbC5jb21wYXJhdG9yKCd2YWwnKSk7XG5cbiAgdmFyIG4gPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgciA9IEFycmF5KG4pLFxuICAgICAgdGllID0gLTEsIHAgPSB7fSwgaSwgdiwgbXU7XG5cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgdiA9IGFbaV0udmFsO1xuICAgIGlmICh0aWUgPCAwICYmIHAgPT09IHYpIHtcbiAgICAgIHRpZSA9IGkgLSAxO1xuICAgIH0gZWxzZSBpZiAodGllID4gLTEgJiYgcCAhPT0gdikge1xuICAgICAgbXUgPSAxICsgKGktMSArIHRpZSkgLyAyO1xuICAgICAgZm9yICg7IHRpZTxpOyArK3RpZSkgclthW3RpZV0uaWR4XSA9IG11O1xuICAgICAgdGllID0gLTE7XG4gICAgfVxuICAgIHJbYVtpXS5pZHhdID0gaSArIDE7XG4gICAgcCA9IHY7XG4gIH1cblxuICBpZiAodGllID4gLTEpIHtcbiAgICBtdSA9IDEgKyAobi0xICsgdGllKSAvIDI7XG4gICAgZm9yICg7IHRpZTxuOyArK3RpZSkgclthW3RpZV0uaWR4XSA9IG11O1xuICB9XG5cbiAgcmV0dXJuIHI7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBzYW1wbGUgUGVhcnNvbiBwcm9kdWN0LW1vbWVudCBjb3JyZWxhdGlvbiBvZiB0d28gYXJyYXlzIG9mIG51bWJlcnMuXG5zdGF0cy5jb3IgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIpIHtcbiAgdmFyIGZuID0gYjtcbiAgYiA9IGZuID8gdmFsdWVzLm1hcCh1dGlsLiQoYikpIDogYTtcbiAgYSA9IGZuID8gdmFsdWVzLm1hcCh1dGlsLiQoYSkpIDogdmFsdWVzO1xuXG4gIHZhciBkb3QgPSBzdGF0cy5kb3QoYSwgYiksXG4gICAgICBtdWEgPSBzdGF0cy5tZWFuKGEpLFxuICAgICAgbXViID0gc3RhdHMubWVhbihiKSxcbiAgICAgIHNkYSA9IHN0YXRzLnN0ZGV2KGEpLFxuICAgICAgc2RiID0gc3RhdHMuc3RkZXYoYiksXG4gICAgICBuID0gdmFsdWVzLmxlbmd0aDtcblxuICByZXR1cm4gKGRvdCAtIG4qbXVhKm11YikgLyAoKG4tMSkgKiBzZGEgKiBzZGIpO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgU3BlYXJtYW4gcmFuayBjb3JyZWxhdGlvbiBvZiB0d28gYXJyYXlzIG9mIHZhbHVlcy5cbnN0YXRzLmNvci5yYW5rID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiKSB7XG4gIHZhciByYSA9IGIgPyBzdGF0cy5yYW5rKHZhbHVlcywgdXRpbC4kKGEpKSA6IHN0YXRzLnJhbmsodmFsdWVzKSxcbiAgICAgIHJiID0gYiA/IHN0YXRzLnJhbmsodmFsdWVzLCB1dGlsLiQoYikpIDogc3RhdHMucmFuayhhKSxcbiAgICAgIG4gPSB2YWx1ZXMubGVuZ3RoLCBpLCBzLCBkO1xuXG4gIGZvciAoaT0wLCBzPTA7IGk8bjsgKytpKSB7XG4gICAgZCA9IHJhW2ldIC0gcmJbaV07XG4gICAgcyArPSBkICogZDtcbiAgfVxuXG4gIHJldHVybiAxIC0gNipzIC8gKG4gKiAobipuLTEpKTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIGRpc3RhbmNlIGNvcnJlbGF0aW9uIG9mIHR3byBhcnJheXMgb2YgbnVtYmVycy5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRGlzdGFuY2VfY29ycmVsYXRpb25cbnN0YXRzLmNvci5kaXN0ID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiKSB7XG4gIHZhciBYID0gYiA/IHZhbHVlcy5tYXAodXRpbC4kKGEpKSA6IHZhbHVlcyxcbiAgICAgIFkgPSBiID8gdmFsdWVzLm1hcCh1dGlsLiQoYikpIDogYTtcblxuICB2YXIgQSA9IHN0YXRzLmRpc3QubWF0KFgpLFxuICAgICAgQiA9IHN0YXRzLmRpc3QubWF0KFkpLFxuICAgICAgbiA9IEEubGVuZ3RoLFxuICAgICAgaSwgYWEsIGJiLCBhYjtcblxuICBmb3IgKGk9MCwgYWE9MCwgYmI9MCwgYWI9MDsgaTxuOyArK2kpIHtcbiAgICBhYSArPSBBW2ldKkFbaV07XG4gICAgYmIgKz0gQltpXSpCW2ldO1xuICAgIGFiICs9IEFbaV0qQltpXTtcbiAgfVxuXG4gIHJldHVybiBNYXRoLnNxcnQoYWIgLyBNYXRoLnNxcnQoYWEqYmIpKTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIHZlY3RvciBkaXN0YW5jZSBiZXR3ZWVuIHR3byBhcnJheXMgb2YgbnVtYmVycy5cbi8vIERlZmF1bHQgaXMgRXVjbGlkZWFuIChleHA9MikgZGlzdGFuY2UsIGNvbmZpZ3VyYWJsZSB2aWEgZXhwIGFyZ3VtZW50Llxuc3RhdHMuZGlzdCA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYiwgZXhwKSB7XG4gIHZhciBmID0gdXRpbC5pc0Z1bmN0aW9uKGIpIHx8IHV0aWwuaXNTdHJpbmcoYiksXG4gICAgICBYID0gdmFsdWVzLFxuICAgICAgWSA9IGYgPyB2YWx1ZXMgOiBhLFxuICAgICAgZSA9IGYgPyBleHAgOiBiLFxuICAgICAgTDIgPSBlID09PSAyIHx8IGUgPT0gbnVsbCxcbiAgICAgIG4gPSB2YWx1ZXMubGVuZ3RoLCBzID0gMCwgZCwgaTtcbiAgaWYgKGYpIHtcbiAgICBhID0gdXRpbC4kKGEpO1xuICAgIGIgPSB1dGlsLiQoYik7XG4gIH1cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgZCA9IGYgPyAoYShYW2ldKS1iKFlbaV0pKSA6IChYW2ldLVlbaV0pO1xuICAgIHMgKz0gTDIgPyBkKmQgOiBNYXRoLnBvdyhNYXRoLmFicyhkKSwgZSk7XG4gIH1cbiAgcmV0dXJuIEwyID8gTWF0aC5zcXJ0KHMpIDogTWF0aC5wb3cocywgMS9lKTtcbn07XG5cbi8vIENvbnN0cnVjdCBhIG1lYW4tY2VudGVyZWQgZGlzdGFuY2UgbWF0cml4IGZvciBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMuZGlzdC5tYXQgPSBmdW5jdGlvbihYKSB7XG4gIHZhciBuID0gWC5sZW5ndGgsXG4gICAgICBtID0gbipuLFxuICAgICAgQSA9IEFycmF5KG0pLFxuICAgICAgUiA9IGdlbi56ZXJvcyhuKSxcbiAgICAgIE0gPSAwLCB2LCBpLCBqO1xuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIEFbaSpuK2ldID0gMDtcbiAgICBmb3IgKGo9aSsxOyBqPG47ICsraikge1xuICAgICAgQVtpKm4ral0gPSAodiA9IE1hdGguYWJzKFhbaV0gLSBYW2pdKSk7XG4gICAgICBBW2oqbitpXSA9IHY7XG4gICAgICBSW2ldICs9IHY7XG4gICAgICBSW2pdICs9IHY7XG4gICAgfVxuICB9XG5cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgTSArPSBSW2ldO1xuICAgIFJbaV0gLz0gbjtcbiAgfVxuICBNIC89IG07XG5cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgZm9yIChqPWk7IGo8bjsgKytqKSB7XG4gICAgICBBW2kqbitqXSArPSBNIC0gUltpXSAtIFJbal07XG4gICAgICBBW2oqbitpXSA9IEFbaSpuK2pdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBBO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgU2hhbm5vbiBlbnRyb3B5IChsb2cgYmFzZSAyKSBvZiBhbiBhcnJheSBvZiBjb3VudHMuXG5zdGF0cy5lbnRyb3B5ID0gZnVuY3Rpb24oY291bnRzLCBmKSB7XG4gIGYgPSB1dGlsLiQoZik7XG4gIHZhciBpLCBwLCBzID0gMCwgSCA9IDAsIG4gPSBjb3VudHMubGVuZ3RoO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBzICs9IChmID8gZihjb3VudHNbaV0pIDogY291bnRzW2ldKTtcbiAgfVxuICBpZiAocyA9PT0gMCkgcmV0dXJuIDA7XG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHAgPSAoZiA/IGYoY291bnRzW2ldKSA6IGNvdW50c1tpXSkgLyBzO1xuICAgIGlmIChwKSBIICs9IHAgKiBNYXRoLmxvZyhwKTtcbiAgfVxuICByZXR1cm4gLUggLyBNYXRoLkxOMjtcbn07XG5cbi8vIENvbXB1dGUgdGhlIG11dHVhbCBpbmZvcm1hdGlvbiBiZXR3ZWVuIHR3byBkaXNjcmV0ZSB2YXJpYWJsZXMuXG4vLyBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBmb3JtIFtNSSwgTUlfZGlzdGFuY2VdIFxuLy8gTUlfZGlzdGFuY2UgaXMgZGVmaW5lZCBhcyAxIC0gSShhLGIpIC8gSChhLGIpLlxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NdXR1YWxfaW5mb3JtYXRpb25cbnN0YXRzLm11dHVhbCA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYiwgY291bnRzKSB7XG4gIHZhciB4ID0gY291bnRzID8gdmFsdWVzLm1hcCh1dGlsLiQoYSkpIDogdmFsdWVzLFxuICAgICAgeSA9IGNvdW50cyA/IHZhbHVlcy5tYXAodXRpbC4kKGIpKSA6IGEsXG4gICAgICB6ID0gY291bnRzID8gdmFsdWVzLm1hcCh1dGlsLiQoY291bnRzKSkgOiBiO1xuXG4gIHZhciBweCA9IHt9LFxuICAgICAgcHkgPSB7fSxcbiAgICAgIG4gPSB6Lmxlbmd0aCxcbiAgICAgIHMgPSAwLCBJID0gMCwgSCA9IDAsIHAsIHQsIGk7XG5cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgcHhbeFtpXV0gPSAwO1xuICAgIHB5W3lbaV1dID0gMDtcbiAgfVxuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHB4W3hbaV1dICs9IHpbaV07XG4gICAgcHlbeVtpXV0gKz0geltpXTtcbiAgICBzICs9IHpbaV07XG4gIH1cblxuICB0ID0gMSAvIChzICogTWF0aC5MTjIpO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBpZiAoeltpXSA9PT0gMCkgY29udGludWU7XG4gICAgcCA9IChzICogeltpXSkgLyAocHhbeFtpXV0gKiBweVt5W2ldXSk7XG4gICAgSSArPSB6W2ldICogdCAqIE1hdGgubG9nKHApO1xuICAgIEggKz0geltpXSAqIHQgKiBNYXRoLmxvZyh6W2ldL3MpO1xuICB9XG5cbiAgcmV0dXJuIFtJLCAxICsgSS9IXTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIG11dHVhbCBpbmZvcm1hdGlvbiBiZXR3ZWVuIHR3byBkaXNjcmV0ZSB2YXJpYWJsZXMuXG5zdGF0cy5tdXR1YWwuaW5mbyA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYiwgY291bnRzKSB7XG4gIHJldHVybiBzdGF0cy5tdXR1YWwodmFsdWVzLCBhLCBiLCBjb3VudHMpWzBdO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgbXV0dWFsIGluZm9ybWF0aW9uIGRpc3RhbmNlIGJldHdlZW4gdHdvIGRpc2NyZXRlIHZhcmlhYmxlcy5cbi8vIE1JX2Rpc3RhbmNlIGlzIGRlZmluZWQgYXMgMSAtIEkoYSxiKSAvIEgoYSxiKS5cbnN0YXRzLm11dHVhbC5kaXN0ID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiLCBjb3VudHMpIHtcbiAgcmV0dXJuIHN0YXRzLm11dHVhbCh2YWx1ZXMsIGEsIGIsIGNvdW50cylbMV07XG59O1xuXG4vLyBDb21wdXRlIGEgcHJvZmlsZSBvZiBzdW1tYXJ5IHN0YXRpc3RpY3MgZm9yIGEgdmFyaWFibGUuXG5zdGF0cy5wcm9maWxlID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIHZhciBtZWFuID0gMCxcbiAgICAgIHZhbGlkID0gMCxcbiAgICAgIG1pc3NpbmcgPSAwLFxuICAgICAgZGlzdGluY3QgPSAwLFxuICAgICAgbWluID0gbnVsbCxcbiAgICAgIG1heCA9IG51bGwsXG4gICAgICBNMiA9IDAsXG4gICAgICB2YWxzID0gW10sXG4gICAgICB1ID0ge30sIGRlbHRhLCBzZCwgaSwgdiwgeDtcblxuICAvLyBjb21wdXRlIHN1bW1hcnkgc3RhdHNcbiAgZm9yIChpPTA7IGk8dmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG5cbiAgICAvLyB1cGRhdGUgdW5pcXVlIHZhbHVlc1xuICAgIHVbdl0gPSAodiBpbiB1KSA/IHVbdl0gKyAxIDogKGRpc3RpbmN0ICs9IDEsIDEpO1xuXG4gICAgaWYgKHYgPT0gbnVsbCkge1xuICAgICAgKyttaXNzaW5nO1xuICAgIH0gZWxzZSBpZiAodXRpbC5pc1ZhbGlkKHYpKSB7XG4gICAgICAvLyB1cGRhdGUgc3RhdHNcbiAgICAgIHggPSAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSA/IHYubGVuZ3RoIDogdjtcbiAgICAgIGlmIChtaW49PT1udWxsIHx8IHggPCBtaW4pIG1pbiA9IHg7XG4gICAgICBpZiAobWF4PT09bnVsbCB8fCB4ID4gbWF4KSBtYXggPSB4O1xuICAgICAgZGVsdGEgPSB4IC0gbWVhbjtcbiAgICAgIG1lYW4gPSBtZWFuICsgZGVsdGEgLyAoKyt2YWxpZCk7XG4gICAgICBNMiA9IE0yICsgZGVsdGEgKiAoeCAtIG1lYW4pO1xuICAgICAgdmFscy5wdXNoKHgpO1xuICAgIH1cbiAgfVxuICBNMiA9IE0yIC8gKHZhbGlkIC0gMSk7XG4gIHNkID0gTWF0aC5zcXJ0KE0yKTtcblxuICAvLyBzb3J0IHZhbHVlcyBmb3IgbWVkaWFuIGFuZCBpcXJcbiAgdmFscy5zb3J0KHV0aWwuY21wKTtcblxuICByZXR1cm4ge1xuICAgIHR5cGU6ICAgICB0eXBlKHZhbHVlcywgZiksXG4gICAgdW5pcXVlOiAgIHUsXG4gICAgY291bnQ6ICAgIHZhbHVlcy5sZW5ndGgsXG4gICAgdmFsaWQ6ICAgIHZhbGlkLFxuICAgIG1pc3Npbmc6ICBtaXNzaW5nLFxuICAgIGRpc3RpbmN0OiBkaXN0aW5jdCxcbiAgICBtaW46ICAgICAgbWluLFxuICAgIG1heDogICAgICBtYXgsXG4gICAgbWVhbjogICAgIG1lYW4sXG4gICAgc3RkZXY6ICAgIHNkLFxuICAgIG1lZGlhbjogICAodiA9IHN0YXRzLnF1YW50aWxlKHZhbHMsIDAuNSkpLFxuICAgIHExOiAgICAgICBzdGF0cy5xdWFudGlsZSh2YWxzLCAwLjI1KSxcbiAgICBxMzogICAgICAgc3RhdHMucXVhbnRpbGUodmFscywgMC43NSksXG4gICAgbW9kZXNrZXc6IHNkID09PSAwID8gMCA6IChtZWFuIC0gdikgLyBzZFxuICB9O1xufTtcblxuLy8gQ29tcHV0ZSBwcm9maWxlcyBmb3IgYWxsIHZhcmlhYmxlcyBpbiBhIGRhdGEgc2V0Llxuc3RhdHMuc3VtbWFyeSA9IGZ1bmN0aW9uKGRhdGEsIGZpZWxkcykge1xuICBmaWVsZHMgPSBmaWVsZHMgfHwgdXRpbC5rZXlzKGRhdGFbMF0pO1xuICB2YXIgcyA9IGZpZWxkcy5tYXAoZnVuY3Rpb24oZikge1xuICAgIHZhciBwID0gc3RhdHMucHJvZmlsZShkYXRhLCB1dGlsLiQoZikpO1xuICAgIHJldHVybiAocC5maWVsZCA9IGYsIHApO1xuICB9KTtcbiAgcmV0dXJuIChzLl9fc3VtbWFyeV9fID0gdHJ1ZSwgcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXRzOyIsInZhciBkM190aW1lID0gcmVxdWlyZSgnZDMtdGltZScpO1xuXG52YXIgdGVtcERhdGUgPSBuZXcgRGF0ZSgpLFxuICAgIGJhc2VEYXRlID0gbmV3IERhdGUoMCwgMCwgMSkuc2V0RnVsbFllYXIoMCksIC8vIEphbiAxLCAwIEFEXG4gICAgdXRjQmFzZURhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQygwLCAwLCAxKSkuc2V0VVRDRnVsbFllYXIoMCk7XG5cbmZ1bmN0aW9uIGRhdGUoZCkge1xuICByZXR1cm4gKHRlbXBEYXRlLnNldFRpbWUoK2QpLCB0ZW1wRGF0ZSk7XG59XG5cbi8vIGNyZWF0ZSBhIHRpbWUgdW5pdCBlbnRyeVxuZnVuY3Rpb24gZW50cnkodHlwZSwgZGF0ZSwgdW5pdCwgc3RlcCwgbWluLCBtYXgpIHtcbiAgdmFyIGUgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRlOiBkYXRlLFxuICAgIHVuaXQ6IHVuaXRcbiAgfTtcbiAgaWYgKHN0ZXApIHtcbiAgICBlLnN0ZXAgPSBzdGVwO1xuICB9IGVsc2Uge1xuICAgIGUubWluc3RlcCA9IDE7XG4gIH1cbiAgaWYgKG1pbiAhPSBudWxsKSBlLm1pbiA9IG1pbjtcbiAgaWYgKG1heCAhPSBudWxsKSBlLm1heCA9IG1heDtcbiAgcmV0dXJuIGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZSh0eXBlLCB1bml0LCBiYXNlLCBzdGVwLCBtaW4sIG1heCkge1xuICByZXR1cm4gZW50cnkodHlwZSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiB1bml0Lm9mZnNldChiYXNlLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiB1bml0LmNvdW50KGJhc2UsIGQpOyB9LFxuICAgIHN0ZXAsIG1pbiwgbWF4KTtcbn1cblxudmFyIGxvY2FsZSA9IFtcbiAgY3JlYXRlKCdzZWNvbmQnLCBkM190aW1lLnNlY29uZCwgYmFzZURhdGUpLFxuICBjcmVhdGUoJ21pbnV0ZScsIGQzX3RpbWUubWludXRlLCBiYXNlRGF0ZSksXG4gIGNyZWF0ZSgnaG91cicsICAgZDNfdGltZS5ob3VyLCAgIGJhc2VEYXRlKSxcbiAgY3JlYXRlKCdkYXknLCAgICBkM190aW1lLmRheSwgICAgYmFzZURhdGUsIFsxLCA3XSksXG4gIGNyZWF0ZSgnbW9udGgnLCAgZDNfdGltZS5tb250aCwgIGJhc2VEYXRlLCBbMSwgMywgNl0pLFxuICBjcmVhdGUoJ3llYXInLCAgIGQzX3RpbWUueWVhciwgICBiYXNlRGF0ZSksXG5cbiAgLy8gcGVyaW9kaWMgdW5pdHNcbiAgZW50cnkoJ3NlY29uZHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIDEsIDAsIDAsIGQpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0U2Vjb25kcygpOyB9LFxuICAgIG51bGwsIDAsIDU5XG4gICksXG4gIGVudHJ5KCdtaW51dGVzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCAxLCAwLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldE1pbnV0ZXMoKTsgfSxcbiAgICBudWxsLCAwLCA1OVxuICApLFxuICBlbnRyeSgnaG91cnMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIDEsIGQpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0SG91cnMoKTsgfSxcbiAgICBudWxsLCAwLCAyM1xuICApLFxuICBlbnRyeSgnd2Vla2RheXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIDQrZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXREYXkoKTsgfSxcbiAgICBbMV0sIDAsIDZcbiAgKSxcbiAgZW50cnkoJ2RhdGVzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldERhdGUoKTsgfSxcbiAgICBbMV0sIDEsIDMxXG4gICksXG4gIGVudHJ5KCdtb250aHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIGQgJSAxMiwgMSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRNb250aCgpOyB9LFxuICAgIFsxXSwgMCwgMTFcbiAgKVxuXTtcblxudmFyIHV0YyA9IFtcbiAgY3JlYXRlKCdzZWNvbmQnLCBkM190aW1lLnV0Y1NlY29uZCwgdXRjQmFzZURhdGUpLFxuICBjcmVhdGUoJ21pbnV0ZScsIGQzX3RpbWUudXRjTWludXRlLCB1dGNCYXNlRGF0ZSksXG4gIGNyZWF0ZSgnaG91cicsICAgZDNfdGltZS51dGNIb3VyLCAgIHV0Y0Jhc2VEYXRlKSxcbiAgY3JlYXRlKCdkYXknLCAgICBkM190aW1lLnV0Y0RheSwgICAgdXRjQmFzZURhdGUsIFsxLCA3XSksXG4gIGNyZWF0ZSgnbW9udGgnLCAgZDNfdGltZS51dGNNb250aCwgIHV0Y0Jhc2VEYXRlLCBbMSwgMywgNl0pLFxuICBjcmVhdGUoJ3llYXInLCAgIGQzX3RpbWUudXRjWWVhciwgICB1dGNCYXNlRGF0ZSksXG5cbiAgLy8gcGVyaW9kaWMgdW5pdHNcbiAgZW50cnkoJ3NlY29uZHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDEsIDAsIDAsIGQpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ1NlY29uZHMoKTsgfSxcbiAgICBudWxsLCAwLCA1OVxuICApLFxuICBlbnRyeSgnbWludXRlcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgMSwgMCwgZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDTWludXRlcygpOyB9LFxuICAgIG51bGwsIDAsIDU5XG4gICksXG4gIGVudHJ5KCdob3VycycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgMSwgZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDSG91cnMoKTsgfSxcbiAgICBudWxsLCAwLCAyM1xuICApLFxuICBlbnRyeSgnd2Vla2RheXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDQrZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDRGF5KCk7IH0sXG4gICAgWzFdLCAwLCA2XG4gICksXG4gIGVudHJ5KCdkYXRlcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDRGF0ZSgpOyB9LFxuICAgIFsxXSwgMSwgMzFcbiAgKSxcbiAgZW50cnkoJ21vbnRocycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgZCAlIDEyLCAxKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENNb250aCgpOyB9LFxuICAgIFsxXSwgMCwgMTFcbiAgKVxuXTtcblxudmFyIFNURVBTID0gW1xuICBbMzE1MzZlNiwgNV0sICAvLyAxLXllYXJcbiAgWzc3NzZlNiwgNF0sICAgLy8gMy1tb250aFxuICBbMjU5MmU2LCA0XSwgICAvLyAxLW1vbnRoXG4gIFsxMjA5NmU1LCAzXSwgIC8vIDItd2Vla1xuICBbNjA0OGU1LCAzXSwgICAvLyAxLXdlZWtcbiAgWzE3MjhlNSwgM10sICAgLy8gMi1kYXlcbiAgWzg2NGU1LCAzXSwgICAgLy8gMS1kYXlcbiAgWzQzMmU1LCAyXSwgICAgLy8gMTItaG91clxuICBbMjE2ZTUsIDJdLCAgICAvLyA2LWhvdXJcbiAgWzEwOGU1LCAyXSwgICAgLy8gMy1ob3VyXG4gIFszNmU1LCAyXSwgICAgIC8vIDEtaG91clxuICBbMThlNSwgMV0sICAgICAvLyAzMC1taW51dGVcbiAgWzllNSwgMV0sICAgICAgLy8gMTUtbWludXRlXG4gIFszZTUsIDFdLCAgICAgIC8vIDUtbWludXRlXG4gIFs2ZTQsIDFdLCAgICAgIC8vIDEtbWludXRlXG4gIFszZTQsIDBdLCAgICAgIC8vIDMwLXNlY29uZFxuICBbMTVlMywgMF0sICAgICAvLyAxNS1zZWNvbmRcbiAgWzVlMywgMF0sICAgICAgLy8gNS1zZWNvbmRcbiAgWzFlMywgMF0gICAgICAgLy8gMS1zZWNvbmRcbl07XG5cbmZ1bmN0aW9uIGZpbmQodW5pdHMsIHNwYW4sIG1pbmIsIG1heGIpIHtcbiAgdmFyIHN0ZXAgPSBTVEVQU1swXSwgaSwgbiwgYmlucztcblxuICBmb3IgKGk9MSwgbj1TVEVQUy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgc3RlcCA9IFNURVBTW2ldO1xuICAgIGlmIChzcGFuID4gc3RlcFswXSkge1xuICAgICAgYmlucyA9IHNwYW4gLyBzdGVwWzBdO1xuICAgICAgaWYgKGJpbnMgPiBtYXhiKSB7XG4gICAgICAgIHJldHVybiB1bml0c1tTVEVQU1tpLTFdWzFdXTtcbiAgICAgIH1cbiAgICAgIGlmIChiaW5zID49IG1pbmIpIHtcbiAgICAgICAgcmV0dXJuIHVuaXRzW3N0ZXBbMV1dO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdW5pdHNbU1RFUFNbbi0xXVsxXV07XG59XG5cbmZ1bmN0aW9uIHRvVW5pdE1hcCh1bml0cykge1xuICB2YXIgbWFwID0ge30sIGksIG47XG4gIGZvciAoaT0wLCBuPXVuaXRzLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICBtYXBbdW5pdHNbaV0udHlwZV0gPSB1bml0c1tpXTtcbiAgfVxuICBtYXAuZmluZCA9IGZ1bmN0aW9uKHNwYW4sIG1pbmIsIG1heGIpIHtcbiAgICByZXR1cm4gZmluZCh1bml0cywgc3BhbiwgbWluYiwgbWF4Yik7XG4gIH07XG4gIHJldHVybiBtYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9Vbml0TWFwKGxvY2FsZSk7XG5tb2R1bGUuZXhwb3J0cy51dGMgPSB0b1VuaXRNYXAodXRjKTtcbiIsInZhciBidWZmZXIgPSByZXF1aXJlKCdidWZmZXInKSxcbiAgICB0aW1lID0gcmVxdWlyZSgnLi90aW1lJyksXG4gICAgdXRjID0gdGltZS51dGM7XG5cbnZhciB1ID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gdXRpbGl0eSBmdW5jdGlvbnNcblxudmFyIEZOQU1FID0gJ19fbmFtZV9fJztcblxudS5uYW1lZGZ1bmMgPSBmdW5jdGlvbihuYW1lLCBmKSB7IHJldHVybiAoZltGTkFNRV0gPSBuYW1lLCBmKTsgfTtcblxudS5uYW1lID0gZnVuY3Rpb24oZikgeyByZXR1cm4gZj09bnVsbCA/IG51bGwgOiBmW0ZOQU1FXTsgfTtcblxudS5pZGVudGl0eSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHg7IH07XG5cbnUudHJ1ZSA9IHUubmFtZWRmdW5jKCd0cnVlJywgZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlOyB9KTtcblxudS5mYWxzZSA9IHUubmFtZWRmdW5jKCdmYWxzZScsIGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2U7IH0pO1xuXG51LmR1cGxpY2F0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn07XG5cbnUuZXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShhKSA9PT0gSlNPTi5zdHJpbmdpZnkoYik7XG59O1xuXG51LmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICBmb3IgKHZhciB4LCBuYW1lLCBpPTEsIGxlbj1hcmd1bWVudHMubGVuZ3RoOyBpPGxlbjsgKytpKSB7XG4gICAgeCA9IGFyZ3VtZW50c1tpXTtcbiAgICBmb3IgKG5hbWUgaW4geCkgeyBvYmpbbmFtZV0gPSB4W25hbWVdOyB9XG4gIH1cbiAgcmV0dXJuIG9iajtcbn07XG5cbnUubGVuZ3RoID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4geCAhPSBudWxsICYmIHgubGVuZ3RoICE9IG51bGwgPyB4Lmxlbmd0aCA6IG51bGw7XG59O1xuXG51LmtleXMgPSBmdW5jdGlvbih4KSB7XG4gIHZhciBrZXlzID0gW10sIGs7XG4gIGZvciAoayBpbiB4KSBrZXlzLnB1c2goayk7XG4gIHJldHVybiBrZXlzO1xufTtcblxudS52YWxzID0gZnVuY3Rpb24oeCkge1xuICB2YXIgdmFscyA9IFtdLCBrO1xuICBmb3IgKGsgaW4geCkgdmFscy5wdXNoKHhba10pO1xuICByZXR1cm4gdmFscztcbn07XG5cbnUudG9NYXAgPSBmdW5jdGlvbihsaXN0LCBmKSB7XG4gIHJldHVybiAoZiA9IHUuJChmKSkgP1xuICAgIGxpc3QucmVkdWNlKGZ1bmN0aW9uKG9iaiwgeCkgeyByZXR1cm4gKG9ialtmKHgpXSA9IDEsIG9iaik7IH0sIHt9KSA6XG4gICAgbGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCB4KSB7IHJldHVybiAob2JqW3hdID0gMSwgb2JqKTsgfSwge30pO1xufTtcblxudS5rZXlzdHIgPSBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgLy8gdXNlIHRvIGVuc3VyZSBjb25zaXN0ZW50IGtleSBnZW5lcmF0aW9uIGFjcm9zcyBtb2R1bGVzXG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aDtcbiAgaWYgKCFuKSByZXR1cm4gJyc7XG4gIGZvciAodmFyIHM9U3RyaW5nKHZhbHVlc1swXSksIGk9MTsgaTxuOyArK2kpIHtcbiAgICBzICs9ICd8JyArIFN0cmluZyh2YWx1ZXNbaV0pO1xuICB9XG4gIHJldHVybiBzO1xufTtcblxuLy8gdHlwZSBjaGVja2luZyBmdW5jdGlvbnNcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudS5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn07XG5cbnUuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufTtcblxudS5pc1N0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufTtcblxudS5pc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbnUuaXNOdW1iZXIgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdudW1iZXInIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgTnVtYmVyXSc7XG59O1xuXG51LmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEJvb2xlYW5dJztcbn07XG5cbnUuaXNEYXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IERhdGVdJztcbn07XG5cbnUuaXNWYWxpZCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqID09PSBvYmo7XG59O1xuXG51LmlzQnVmZmVyID0gKGJ1ZmZlci5CdWZmZXIgJiYgYnVmZmVyLkJ1ZmZlci5pc0J1ZmZlcikgfHwgdS5mYWxzZTtcblxuLy8gdHlwZSBjb2VyY2lvbiBmdW5jdGlvbnNcblxudS5udW1iZXIgPSBmdW5jdGlvbihzKSB7XG4gIHJldHVybiBzID09IG51bGwgfHwgcyA9PT0gJycgPyBudWxsIDogK3M7XG59O1xuXG51LmJvb2xlYW4gPSBmdW5jdGlvbihzKSB7XG4gIHJldHVybiBzID09IG51bGwgfHwgcyA9PT0gJycgPyBudWxsIDogcz09PSdmYWxzZScgPyBmYWxzZSA6ICEhcztcbn07XG5cbnUuZGF0ZSA9IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMgPT0gbnVsbCB8fCBzID09PSAnJyA/IG51bGwgOiBEYXRlLnBhcnNlKHMpO1xufTtcblxudS5hcnJheSA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHggIT0gbnVsbCA/ICh1LmlzQXJyYXkoeCkgPyB4IDogW3hdKSA6IFtdO1xufTtcblxudS5zdHIgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiB1LmlzQXJyYXkoeCkgPyAnWycgKyB4Lm1hcCh1LnN0cikgKyAnXSdcbiAgICA6IHUuaXNPYmplY3QoeCkgPyBKU09OLnN0cmluZ2lmeSh4KVxuICAgIDogdS5pc1N0cmluZyh4KSA/ICgnXFwnJyt1dGlsX2VzY2FwZV9zdHIoeCkrJ1xcJycpIDogeDtcbn07XG5cbnZhciBlc2NhcGVfc3RyX3JlID0gLyhefFteXFxcXF0pJy9nO1xuXG5mdW5jdGlvbiB1dGlsX2VzY2FwZV9zdHIoeCkge1xuICByZXR1cm4geC5yZXBsYWNlKGVzY2FwZV9zdHJfcmUsICckMVxcXFxcXCcnKTtcbn1cblxuLy8gZGF0YSBhY2Nlc3MgZnVuY3Rpb25zXG5cbnUuZmllbGQgPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiBTdHJpbmcoZikuc3BsaXQoJ1xcXFwuJylcbiAgICAubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuc3BsaXQoJy4nKTsgfSlcbiAgICAucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIGlmIChhLmxlbmd0aCkgeyBhW2EubGVuZ3RoLTFdICs9ICcuJyArIGIuc2hpZnQoKTsgfVxuICAgICAgYS5wdXNoLmFwcGx5KGEsIGIpO1xuICAgICAgcmV0dXJuIGE7XG4gICAgfSwgW10pO1xufTtcblxudS5hY2Nlc3NvciA9IGZ1bmN0aW9uKGYpIHtcbiAgdmFyIHM7XG4gIHJldHVybiBmPT1udWxsIHx8IHUuaXNGdW5jdGlvbihmKSA/IGYgOlxuICAgIHUubmFtZWRmdW5jKGYsIChzID0gdS5maWVsZChmKSkubGVuZ3RoID4gMSA/XG4gICAgICBmdW5jdGlvbih4KSB7IHJldHVybiBzLnJlZHVjZShmdW5jdGlvbih4LGYpIHsgcmV0dXJuIHhbZl07IH0sIHgpOyB9IDpcbiAgICAgIGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHhbZl07IH1cbiAgICApO1xufTtcblxuLy8gc2hvcnQtY3V0IGZvciBhY2Nlc3NvclxudS4kID0gdS5hY2Nlc3NvcjtcblxudS5tdXRhdG9yID0gZnVuY3Rpb24oZikge1xuICB2YXIgcztcbiAgcmV0dXJuIHUuaXNTdHJpbmcoZikgJiYgKHM9dS5maWVsZChmKSkubGVuZ3RoID4gMSA/XG4gICAgZnVuY3Rpb24oeCwgdikge1xuICAgICAgZm9yICh2YXIgaT0wOyBpPHMubGVuZ3RoLTE7ICsraSkgeCA9IHhbc1tpXV07XG4gICAgICB4W3NbaV1dID0gdjtcbiAgICB9IDpcbiAgICBmdW5jdGlvbih4LCB2KSB7IHhbZl0gPSB2OyB9O1xufTtcblxuXG51LiRmdW5jID0gZnVuY3Rpb24obmFtZSwgb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGYpIHtcbiAgICBmID0gdS4kKGYpIHx8IHUuaWRlbnRpdHk7XG4gICAgdmFyIG4gPSBuYW1lICsgKHUubmFtZShmKSA/ICdfJyt1Lm5hbWUoZikgOiAnJyk7XG4gICAgcmV0dXJuIHUubmFtZWRmdW5jKG4sIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG9wKGYoZCkpOyB9KTtcbiAgfTtcbn07XG5cbnUuJHZhbGlkICA9IHUuJGZ1bmMoJ3ZhbGlkJywgdS5pc1ZhbGlkKTtcbnUuJGxlbmd0aCA9IHUuJGZ1bmMoJ2xlbmd0aCcsIHUubGVuZ3RoKTtcblxudS4kaW4gPSBmdW5jdGlvbihmLCB2YWx1ZXMpIHtcbiAgZiA9IHUuJChmKTtcbiAgdmFyIG1hcCA9IHUuaXNBcnJheSh2YWx1ZXMpID8gdS50b01hcCh2YWx1ZXMpIDogdmFsdWVzO1xuICByZXR1cm4gZnVuY3Rpb24oZCkgeyByZXR1cm4gISFtYXBbZihkKV07IH07XG59O1xuXG51LiR5ZWFyICAgPSB1LiRmdW5jKCd5ZWFyJywgdGltZS55ZWFyLnVuaXQpO1xudS4kbW9udGggID0gdS4kZnVuYygnbW9udGgnLCB0aW1lLm1vbnRocy51bml0KTtcbnUuJGRhdGUgICA9IHUuJGZ1bmMoJ2RhdGUnLCB0aW1lLmRhdGVzLnVuaXQpO1xudS4kZGF5ICAgID0gdS4kZnVuYygnZGF5JywgdGltZS53ZWVrZGF5cy51bml0KTtcbnUuJGhvdXIgICA9IHUuJGZ1bmMoJ2hvdXInLCB0aW1lLmhvdXJzLnVuaXQpO1xudS4kbWludXRlID0gdS4kZnVuYygnbWludXRlJywgdGltZS5taW51dGVzLnVuaXQpO1xudS4kc2Vjb25kID0gdS4kZnVuYygnc2Vjb25kJywgdGltZS5zZWNvbmRzLnVuaXQpO1xuXG51LiR1dGNZZWFyICAgPSB1LiRmdW5jKCd1dGNZZWFyJywgdXRjLnllYXIudW5pdCk7XG51LiR1dGNNb250aCAgPSB1LiRmdW5jKCd1dGNNb250aCcsIHV0Yy5tb250aHMudW5pdCk7XG51LiR1dGNEYXRlICAgPSB1LiRmdW5jKCd1dGNEYXRlJywgdXRjLmRhdGVzLnVuaXQpO1xudS4kdXRjRGF5ICAgID0gdS4kZnVuYygndXRjRGF5JywgdXRjLndlZWtkYXlzLnVuaXQpO1xudS4kdXRjSG91ciAgID0gdS4kZnVuYygndXRjSG91cicsIHV0Yy5ob3Vycy51bml0KTtcbnUuJHV0Y01pbnV0ZSA9IHUuJGZ1bmMoJ3V0Y01pbnV0ZScsIHV0Yy5taW51dGVzLnVuaXQpO1xudS4kdXRjU2Vjb25kID0gdS4kZnVuYygndXRjU2Vjb25kJywgdXRjLnNlY29uZHMudW5pdCk7XG5cbi8vIGNvbXBhcmlzb24gLyBzb3J0aW5nIGZ1bmN0aW9uc1xuXG51LmNvbXBhcmF0b3IgPSBmdW5jdGlvbihzb3J0KSB7XG4gIHZhciBzaWduID0gW107XG4gIGlmIChzb3J0ID09PSB1bmRlZmluZWQpIHNvcnQgPSBbXTtcbiAgc29ydCA9IHUuYXJyYXkoc29ydCkubWFwKGZ1bmN0aW9uKGYpIHtcbiAgICB2YXIgcyA9IDE7XG4gICAgaWYgICAgICAoZlswXSA9PT0gJy0nKSB7IHMgPSAtMTsgZiA9IGYuc2xpY2UoMSk7IH1cbiAgICBlbHNlIGlmIChmWzBdID09PSAnKycpIHsgcyA9ICsxOyBmID0gZi5zbGljZSgxKTsgfVxuICAgIHNpZ24ucHVzaChzKTtcbiAgICByZXR1cm4gdS5hY2Nlc3NvcihmKTtcbiAgfSk7XG4gIHJldHVybiBmdW5jdGlvbihhLGIpIHtcbiAgICB2YXIgaSwgbiwgZiwgeCwgeTtcbiAgICBmb3IgKGk9MCwgbj1zb3J0Lmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICAgIGYgPSBzb3J0W2ldOyB4ID0gZihhKTsgeSA9IGYoYik7XG4gICAgICBpZiAoeCA8IHkpIHJldHVybiAtMSAqIHNpZ25baV07XG4gICAgICBpZiAoeCA+IHkpIHJldHVybiBzaWduW2ldO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfTtcbn07XG5cbnUuY21wID0gZnVuY3Rpb24oYSwgYikge1xuICBpZiAoYSA8IGIpIHtcbiAgICByZXR1cm4gLTE7XG4gIH0gZWxzZSBpZiAoYSA+IGIpIHtcbiAgICByZXR1cm4gMTtcbiAgfSBlbHNlIGlmIChhID49IGIpIHtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIGlmIChhID09PSBudWxsKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKGIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gTmFOO1xufTtcblxudS5udW1jbXAgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhIC0gYjsgfTtcblxudS5zdGFibGVzb3J0ID0gZnVuY3Rpb24oYXJyYXksIHNvcnRCeSwga2V5Rm4pIHtcbiAgdmFyIGluZGljZXMgPSBhcnJheS5yZWR1Y2UoZnVuY3Rpb24oaWR4LCB2LCBpKSB7XG4gICAgcmV0dXJuIChpZHhba2V5Rm4odildID0gaSwgaWR4KTtcbiAgfSwge30pO1xuXG4gIGFycmF5LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHZhciBzYSA9IHNvcnRCeShhKSxcbiAgICAgICAgc2IgPSBzb3J0QnkoYik7XG4gICAgcmV0dXJuIHNhIDwgc2IgPyAtMSA6IHNhID4gc2IgPyAxXG4gICAgICAgICA6IChpbmRpY2VzW2tleUZuKGEpXSAtIGluZGljZXNba2V5Rm4oYildKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFycmF5O1xufTtcblxuXG4vLyBzdHJpbmcgZnVuY3Rpb25zXG5cbnUucGFkID0gZnVuY3Rpb24ocywgbGVuZ3RoLCBwb3MsIHBhZGNoYXIpIHtcbiAgcGFkY2hhciA9IHBhZGNoYXIgfHwgXCIgXCI7XG4gIHZhciBkID0gbGVuZ3RoIC0gcy5sZW5ndGg7XG4gIGlmIChkIDw9IDApIHJldHVybiBzO1xuICBzd2l0Y2ggKHBvcykge1xuICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgcmV0dXJuIHN0cnJlcChkLCBwYWRjaGFyKSArIHM7XG4gICAgY2FzZSAnbWlkZGxlJzpcbiAgICBjYXNlICdjZW50ZXInOlxuICAgICAgcmV0dXJuIHN0cnJlcChNYXRoLmZsb29yKGQvMiksIHBhZGNoYXIpICtcbiAgICAgICAgIHMgKyBzdHJyZXAoTWF0aC5jZWlsKGQvMiksIHBhZGNoYXIpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gcyArIHN0cnJlcChkLCBwYWRjaGFyKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gc3RycmVwKG4sIHN0cikge1xuICB2YXIgcyA9IFwiXCIsIGk7XG4gIGZvciAoaT0wOyBpPG47ICsraSkgcyArPSBzdHI7XG4gIHJldHVybiBzO1xufVxuXG51LnRydW5jYXRlID0gZnVuY3Rpb24ocywgbGVuZ3RoLCBwb3MsIHdvcmQsIGVsbGlwc2lzKSB7XG4gIHZhciBsZW4gPSBzLmxlbmd0aDtcbiAgaWYgKGxlbiA8PSBsZW5ndGgpIHJldHVybiBzO1xuICBlbGxpcHNpcyA9IGVsbGlwc2lzICE9PSB1bmRlZmluZWQgPyBTdHJpbmcoZWxsaXBzaXMpIDogJ1xcdTIwMjYnO1xuICB2YXIgbCA9IE1hdGgubWF4KDAsIGxlbmd0aCAtIGVsbGlwc2lzLmxlbmd0aCk7XG5cbiAgc3dpdGNoIChwb3MpIHtcbiAgICBjYXNlICdsZWZ0JzpcbiAgICAgIHJldHVybiBlbGxpcHNpcyArICh3b3JkID8gdHJ1bmNhdGVPbldvcmQocyxsLDEpIDogcy5zbGljZShsZW4tbCkpO1xuICAgIGNhc2UgJ21pZGRsZSc6XG4gICAgY2FzZSAnY2VudGVyJzpcbiAgICAgIHZhciBsMSA9IE1hdGguY2VpbChsLzIpLCBsMiA9IE1hdGguZmxvb3IobC8yKTtcbiAgICAgIHJldHVybiAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbDEpIDogcy5zbGljZSgwLGwxKSkgK1xuICAgICAgICBlbGxpcHNpcyArICh3b3JkID8gdHJ1bmNhdGVPbldvcmQocyxsMiwxKSA6IHMuc2xpY2UobGVuLWwyKSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbCkgOiBzLnNsaWNlKDAsbCkpICsgZWxsaXBzaXM7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHRydW5jYXRlT25Xb3JkKHMsIGxlbiwgcmV2KSB7XG4gIHZhciBjbnQgPSAwLCB0b2sgPSBzLnNwbGl0KHRydW5jYXRlX3dvcmRfcmUpO1xuICBpZiAocmV2KSB7XG4gICAgcyA9ICh0b2sgPSB0b2sucmV2ZXJzZSgpKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbih3KSB7IGNudCArPSB3Lmxlbmd0aDsgcmV0dXJuIGNudCA8PSBsZW47IH0pXG4gICAgICAucmV2ZXJzZSgpO1xuICB9IGVsc2Uge1xuICAgIHMgPSB0b2suZmlsdGVyKGZ1bmN0aW9uKHcpIHsgY250ICs9IHcubGVuZ3RoOyByZXR1cm4gY250IDw9IGxlbjsgfSk7XG4gIH1cbiAgcmV0dXJuIHMubGVuZ3RoID8gcy5qb2luKCcnKS50cmltKCkgOiB0b2tbMF0uc2xpY2UoMCwgbGVuKTtcbn1cblxudmFyIHRydW5jYXRlX3dvcmRfcmUgPSAvKFtcXHUwMDA5XFx1MDAwQVxcdTAwMEJcXHUwMDBDXFx1MDAwRFxcdTAwMjBcXHUwMEEwXFx1MTY4MFxcdTE4MEVcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwQVxcdTIwMkZcXHUyMDVGXFx1MjAyOFxcdTIwMjlcXHUzMDAwXFx1RkVGRl0pLztcbiJdfQ==
