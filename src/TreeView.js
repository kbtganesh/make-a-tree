import React, { Component } from 'react';
import * as d3 from "d3";

export default class TreeView extends Component {

    render() {
      /* get the pedigree tree data */
      const { treeData, containerWidth, containerHeight } = this.props;
  
      /* still use d3.js to calculate the tree layout and position of nodes, links */
      const treeLayout = d3.tree().size([containerWidth, containerHeight]);
      const nodesList = treeLayout.nodes(root).reverse();
      const linksList = treeLayout.links(nodesList);
      const diagonal = d3.svg.diagonal().projection((d) => [d.x, d.y]);
  
      /* render the nodes */
      const nodes = nodesList.map(node => {
        return (
          <g key={node.id} className="node"
             transform={`translate(${node.x}, ${node.y})`}>
            <circle r="10" style={{'fill': node._children ? 'lightsteelblue' : '#fff'}} />
            <text y="-19" dy=".35em" textAnchor="middle"
                  style={{'fillOpacity': 1}}>{node.fullName}</text>
            <image href={node.picture} x="-20" y="-68"
                   width="40px" height="40px"></image>
          </g>
        );
      });
  
      /* render the links */
      const links = linksList.map(link => {
        return (
          <path key={`${link.source.id}-${link.target.id}`} className="link"
                d={diagonal(link)} />
        );
      });
  
      return (
        <div className="tree-container">
          <svg height="1000" width={containerWidth}>
            <g>
              {links}
              {nodes}
            </g>
          </svg>
        </div>
      );
    }
  
  }