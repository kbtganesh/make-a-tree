class Tree extends React.Component {
	constructor() {
		super()
		this.state = {nodes: this.defaultValues()}
		this.updateTree = this.updateTree.bind(this)
		this.handleOnCollapse = this.handleOnCollapse.bind(this)
	} // constructor

	defaultValues() {
		return [
	  {
	    "name": "Top Level",
	    "parent": "null",
	    "children": [
	      {
	        "name": "Level 2: A",
	        "parent": "Top Level",
	        "children": [
	          {
	            "name": "Son of A",
	            "parent": "Level 2: A"
	          },
	          {
	            "name": "Daughter of A",
	            "parent": "Level 2: A"
	          }
	        ]
	      },
	      {
	        "name": "Level 2: B",
	        "parent": "Top Level"
	      }
	    ]
	  }]
	}

	componentDidMount() {
		var margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = 960 - margin.left - margin.right,
    height = 7200 - margin.top - margin.bottom;


		d3.select(ReactDOM.findDOMNode(this))
		.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

		var zoom = d3.behavior.zoom()
			.scaleExtent([1, 10])
			.on("zoom", () => {
				d3.select(this.refs.container)
						.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
			})

		d3.select(this.refs.container).call(zoom)
	}

	updateTree(nodes, name) {
		return nodes.map((node) => {
			if(node.name === name) {
		    if (node.children) {
					node._children = node.children;
					node.children = null;
			  } else {
					node.children = node._children;
					node._children = null;
			  }
			  return node
			} else if(!node.children) {
				return node
			}   
			return this.updateTree(node.children, name)
		})
	}

	handleOnCollapse(nodeName) {
		let newTree = _.cloneDeep(this.state.nodes)
		this.updateTree(newTree, nodeName)
		this.setState({nodes: newTree})
	}

	render() {		
	let tree = d3.layout.tree().size([400, 400]),
		root = this.state.nodes[0],
		nodes = tree.nodes(root),
		links = tree.links(nodes),
		diagonal = d3.svg.diagonal().projection((node) => { return [node.y, node.x] }),
		nodeComponents = nodes.map((node, i) => {
			return <TreeNode key={i} data={node} onCollapse={this.handleOnCollapse}/>
		}),
		linkComponents = links.map((link, i) => {
			return <Link key={i} diagonal={diagonal(link)}/>
		})

		return (
			<svg width="1000" height="1000">	
				<g ref="container">
					{linkComponents}
					{nodeComponents}
				</g>
			</svg>
		)
	}
}

class Circle extends React.Component {
	constructor() {
		super()
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick() {
		this.props.onClick();
	}

	render() {
		return (
			<g className="node" 
					transform={this.props.transform}
					onClick={this.handleClick}>
				<circle r="10" fill="steelblue"></circle>
				<text>{this.props.name}</text>
			</g>
		)
	}
}

class TreeNode extends React.Component {
	constructor(props) {
		super(props)
		this.state = { data: props.data }
		this.handleClick = this.handleClick.bind(this)
	}

	componentDidMount() {
		this.d3Node = d3.select(ReactDOM.findDOMNode(this))
		this.d3Node.datum(this.props.data).attr("transform", (d) => {
			return `translate(${d.parent.y}, ${d.parent.x})`
		}).transition()
			.duration(750)
			.attr("transform", (d) => { 
				return `translate(${d.y}, ${d.x})`
			})
	}

	handleClick() {
		this.props.onCollapse(this.state.data.name);
	}

	render() {
		let {x, y} = this.props.data
		return (
			<Circle key={this.props.key} 
				name={this.props.data.name} 
				onClick={this.handleClick}/>
		)
	}
}

class Path extends React.Component {
	render() {
		return (
			<path className={this.props.cssClass} d={this.props.d}></path>
		)
	}
}


class Link extends React.Component {
	render() {
		return (
			<Path cssClass="link" d={this.props.diagonal}/>
		)
	}
}

ReactDOM.render(<Tree/> , document.getElementById('app-container'))