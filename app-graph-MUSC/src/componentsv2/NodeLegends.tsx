import { useEffect, useRef } from "react";
import { GraphData } from "react-force-graph-2d";
import { build_legends } from "../packagesz/legendgraph";
import { Node } from "../data/forcegraph/types.forcegraph";
import * as d3 from "d3";

type NodeLegendsProps = {
    data:GraphData 
    onLabel?: (node:Node)=>string
}

export const NodeLegends = ({
        data,
        onLabel,
    }:NodeLegendsProps,
) => {
    // console.log('---->Debug: NodeLegends')
    const ref = useRef<SVGSVGElement>(null)

    useEffect (()=>{
        // console.log('---->Debug: NodeProperties.useEffect legend_ref', ref)
        const svg = d3.select(ref.current)
        // console.log('---->Debug: NodeProperties.useEffect svg', svg_1)
        build_legends(svg, data, onLabel)
    },[] )

    return (<>
        <svg 
            width={500}
            height={500}
            id="node-lengends"
            ref={ref}
        />
        
        
    </>)
}