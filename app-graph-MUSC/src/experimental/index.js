import { buildForceGraph } from "../packagesz/forcegraphz";

const data = {
    nodes: [ {id : 'A'}, { id: 'B'}],
    links: [{ source: 'A', target: 'B'}],
} 
    
var svg = d3.select("body").append("svg")
    .attr("width", 500)
    .attr("height", height) 

console.log('svg', svg)
