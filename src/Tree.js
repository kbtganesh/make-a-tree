import React from 'react';
import * as d3 from "d3";
// function diagonal(s, d) {

//   path = `M ${s.y} ${s.x}
//           C ${(s.y + d.y) / 2} ${s.x},
//             ${(s.y + d.y) / 2} ${d.x},
//             ${d.y} ${d.x}`

//   return path
// }
export default class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { "name": "ProjectA", "parent": "" },
        { "name": "ApplicationA", "parent": "ProjectA" },
        { "name": "EnvironmentB", "parent": "ProjectA" },

        { "name": "TierC", "parent": "ApplicationA" },
        { "name": "TierD", "parent": "ApplicationA" },
        { "name": "TierE", "parent": "ApplicationA" },

        { "name": "ServiceF", "parent": "EnvironmentB" },

        { "name": "ContainerG", "parent": "EnvironmentB" },
        { "name": "ContainerH", "parent": "TierE" },
        { "name": "ContainerH", "parent": "TierE" },
        { "name": "ContainerH", "parent": "TierE" },
        { "name": "ContainerH", "parent": "TierE" },
        { "name": "ContainerH", "parent": "TierE" },
        { "name": "ContainerH", "parent": "TierE" }
      ]
    };
  }

  componentDidMount() {
    const width = 800,
      height = 800;

    // const chart = d3.select(this.chartRef)
    //   .attr('width', width + 100)
    //   .attr('height', height + 100)
    //   .append('g')
    //   .attr('transform', 'translate(20, 20)');

    this.tree = d3.tree()
      .size([height, width - 160]);


    const stratify = d3.stratify()
      .id((d) => {
        return d.name;
      })
      .parentId((d) => {
        return d.parent;
      });

    this.root = stratify(this.state.data)
      .sort((a, b) => {
        return (a.height - b.height) || a.id.localeCompare(b.id);
      });

    console.log('d3', d3)
    // const link = chart.selectAll('.link')
    //   .data(this.tree(this.root).links())
    //   .enter()
    //   .append('path')
    //   .attr('class', 'link')
    //   .attr("d", d3
    //     .linkVertical()
    //     .x((d) => {
    //       console.log('kbtd : ', d);
    //       return d.x;
    //     })
    //     .y((d) => {
    //       return d.y;
    //     })  
    //   );



    this.setState({ pathkbt: this.tree(this.root).links() });

    // this.node = chart.selectAll('.node')
    //   .data(this.root.descendants())
    // .enter()
    // .append('g')
    // .attr("class", (d) => {
    //   return "node" + (d.children ? " node--internal" : " node--leaf");
    // })
    // .attr("transform", (d) => {
    //   return `translate(${d.x},${d.y})`;
    // })

    // node.append('text')
    // .text((d) => {
    //   return d.id;
    // });


    // this.node.append("text")
    //   .attr("dy", 3)
    //   .attr("x", (d) => {
    //     return d.children ? -8 : 8;
    //   })
    //   .style("text-anchor", (d) => {
    //     return d.children ? "end" : "start";
    //   })
    //   .text((d) => {
    //     return d.id;
    //   });

    // this.node.append('circle')
    //   .attr('cx', 0)
    //   .attr('cy', 0)
    //   .attr('r', '10px')
    //   .style('fill', (d) => d.children ? 'blue' : 'red')
    //   .on('click', (data) => {
    //     console.log('data',data.children);
    //     if(data.children){
    //       data._children = data.children;
    //       data.children = null;
    //     }else{
    //       data.children = data._children;
    //       data._children = null;
    //     }
    //   });

    let kbt = this.root.descendants();
    this.setState({ kbt })
    // .style('fill', 'red');

    console.log('root data:', this.kbt);
  }

  render() {
    let pathkbt = this.state.pathkbt && this.state.pathkbt.map((item, i) => {
      console.log('item path : ', item);
      let d = d3
        .linkVertical()
        .x((d) => {
          console.log('kbtd : ', d);
          return d.x;
        })
        .y((d) => {
          return d.y;
        });
      console.log('ddddd', d(item));
      return <path key={'path-'+i} className='link' d={d(item)} fill="none" stroke="red" strokeWidth="2px" style={{}} />
    })
    console.log('pathkbt', pathkbt);
    let kbt = this.state.kbt && this.state.kbt.map((node, i) => {
      console.log('node insi', node);
      return <g key={node.id+'-'+Math.random()} className={"node" + node.children ? " node--internal" : " node--leaf"}
        transform={`translate(${node.x}, ${node.y})`}>
        <circle r="10" style={{ 'fill': node.children ? 'lightsteelblue' : 'black' }}
          onClick={() => {
            alert(node.data.name)
            console.log('node.children', node);
            if (node.children) {
              node._children = node.children;
              node.children = null;
            } else {
              node.children = node._children; node._children = null;
            }

            let arr = this.state.kbt;
            arr[i] = node;
            console.log('state', this.state.kbt);
            console.log('arr', arr);
            this.setState({ kbt: arr })

          }} />
        {/* <text x="8" dy="3" textAnchor="middle"
                style={{'fillOpacity': 1}}>{node.data.name}</text>

              <foreignObject>
                <div> Info </div>
                </foreignObject> */}
      </g>
    })
    return (
      <svg className="tree-chart-basic" ref={(r) => this.chartRf = r} style={{ width: '800px', height: '800px' }}>
        {console.table('state kbt', this.state.kbt)}
        {console.table('kbt', kbt)}
        <g transform='translate(20,50)'>
          {kbt ? kbt : <div> otha </div>}
          {pathkbt ? pathkbt : <div> please </div>}
        </g>
      </svg>
    );
  }
}