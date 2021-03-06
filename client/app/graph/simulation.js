import {
    forceSimulation,
    forceX,
    forceY,
    forceManyBody,
    forceLink,
    forceCenter
} from 'd3-force'
import { NODE_RADIUS, WIDTH, HEIGHT } from './constants'

export default (WIDTH, HEIGHT) => (
    forceSimulation()
        // .alphaTarget(0.01)
        .alphaDecay(1 - Math.pow(0.001, 1/400))
        .velocityDecay(0.2)
        .force("charge", forceManyBody().strength(-300))
        .force("link", 
            forceLink()
                .id(d => d.id)
                .distance(100)
                .strength(0.1)
        )
        .force("x", forceX().strength(0.05))
        .force("y", forceY().strength(0.05))
        .force("center", forceCenter(WIDTH / 2, HEIGHT / 2))
)



function linkArc(d, curved=false) {
    /*
     * only arc if there is a two-way link
    */
    // TODO: check adjacencyMap for whether there is an edge the otherway as well - 2017-01-22
    const dx = d.target.x - d.source.x;
    const dy = d.target.y - d.source.y;
    const lineDistance = Math.sqrt(dx * dx + dy * dy);
    const dr = curved ? lineDistance : 0;

    // distance from source node to edge of target node
    // const nodeDistance = lineDistance - d.target.r

    const sourceRadius = d.source.radius || NODE_RADIUS
    const targetRadius = d.target.radius || NODE_RADIUS

    const ox = (dx * targetRadius) / lineDistance
    const oy = (dy * targetRadius) / lineDistance

        // TODO: get node radius here - 2017-01-22
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + (d.target.x - ox) + "," + (d.target.y - oy);
}

function drawPath(d) {
    const s = d.source
    const t = d.target
    const path = [
        'M', s.x, s.y,
        'L', t.x, t.y,

        // 'L', endShaft, shaftRadius,
        // 'L', endShaft, headRadius,
        // 'L', endArrow, 0,
        // 'L', endShaft, -headRadius,
        // 'L', endShaft, -shaftRadius,
        // 'L', startArrow, -shaftRadius,
        'Z'
    ].join(' ')

    return path
}


export const transformNode = (selection) => {
    return selection
        // .attr("cx", d => d.x)
        // .attr("cy", d => d.y)
            .attr("transform", (d) => {
                return "translate(" 
                    // + Math.max(minNodeXPos, Math.min(maxNodeXPos, d.x))
                    // + ","
                    // + Math.max(minNodeYPos, Math.min(maxNodeYPos, d.y))
                    + d.x
                    + ","
                    + d.y
                    + ")"
            });
};


export const transformLink = (selection) => {
    // TODO: proper selection here for tick - 2016-06-13
    return selection
        .attr('d', (d) => linkArc(d, d.curved))
    // return selection
    //     .attr("x1", (d) => d.source.x)
    //     .attr("y1", (d) => d.source.y)
    //     .attr("x2", (d) => d.target.x)
    //     .attr("y2", (d) => d.target.y);

};
