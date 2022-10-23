"use strict";
exports.__esModule = true;
console.log('Testing interfaces and dynamic allocaitons');
var customNode1 = {
    id: 1,
    someType: 'class1',
    stuff: 'Stuff'
};
var node = customNode1;
console.log(node);
console.log(typeof node);
if (node.someType === 'class1') {
    console.log(node.stuff);
}
