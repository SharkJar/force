import { Screen } from './components/screen'
import { Raycaster } from './components/raycaster'
import { default as domEvent } from './components/domEvents'
import { default as nodeElement } from './components/nodeElement'
import { default as linkeElement } from './components/linkElement'
import { default as categoryElement } from './common/category'
import * as d3 from 'd3-force'
import json from './assets/data3.json'

//const json = require('./assets/data.json')
json.legend.map(category => {
	new categoryElement(name = category)
})

json.nodes.map(node => {
	let { category,name } = node
	new nodeElement(node)
})

json.links.map(link => {
	new linkeElement(link)
})

const distanceMax = 120, distanceMin = 0, distance = 50,width = window.innerWidth,height = window.innerHeight
const simulation = d3.forceSimulation(nodeElement.NodesArray),
    simulationLink = d3.forceLink(linkeElement.LinksArray),
    simulationCollide = d3.forceCollide(1),
    simulationCenter = d3.forceCenter(width / 2, height / 2),
    simulationManyBody = d3.forceManyBody()

  simulation.force('link', simulationLink.id(d => d.name).distance(distance))
    .force('charge', simulationManyBody.distanceMax(distanceMax).distanceMin(distanceMin))
    .force("collision", simulationCollide.radius(8))
    .force('center', simulationCenter)


const screen = new Screen(width,height)
const screenEvent = new domEvent()
nodeElement.CircleArray.map(circle => {
    let node = nodeElement.CircleMap.get(circle)
    screen.scene.add(circle)
    node.visible = node.level == 1
})
linkeElement.LineArray.map(line => screen.scene.add(line))
screen.force('domEvent',screenEvent)
//单击选中元素
screenEvent.on('tap',({ object,position }) => {
    console.log("tap",object,position,nodeElement.CircleMap.get(object))
})
.on('move',({ object,newPosition,oldPosition }) => {
    console.log("move",object,newPosition,oldPosition,nodeElement.CircleMap.get(object))
})
window.c = nodeElement




