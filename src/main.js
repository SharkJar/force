import { Screen } from './components/screen'
import { Raycaster } from './components/raycaster'
import { default as domEvent } from './components/domEvents'
import { default as nodeElement } from './components/nodeElement'
import { default as linkeElement } from './components/linkElement'
import { default as categoryElement } from './components/categoryElement'
import * as d3 from 'd3-force'
import json from './assets/data2.json'

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


const nodes = nodeElement.NodesArray
let distanceMax = ((nodes.length / 1000) >> 0) + 1, distanceMin = 0, distance = 50,
    width = window.innerWidth,height = window.innerHeight
const screen = new Screen(width,height)
const screenEvent = new domEvent()

//设置相机焦距
screen.setCamera({ zoom: 1.3 / distanceMax  })
distanceMax = distanceMax * 120



const simulation = d3.forceSimulation(nodes),
    simulationLink = d3.forceLink(linkeElement.LinksArray),
    simulationCollide = d3.forceCollide(1),
    simulationCenter = d3.forceCenter(width / 2, height / 2),
    simulationManyBody = d3.forceManyBody()

  simulation.force('link', simulationLink.id(d => d.name).distance(distance))
    .force('charge', simulationManyBody.distanceMax(distanceMax).distanceMin(distanceMin))
    .force("collision", simulationCollide.radius(8))
    .force('center', simulationCenter)



nodeElement.CircleArray.map(circle => {
    let node = nodeElement.CircleMap.get(circle)
    screen.scene.add(circle)
    node.visible = node.level <= 2
})
linkeElement.LineArray.map(line => screen.scene.add(line))
screen.force('domEvent',screenEvent)
//单击选中元素
screenEvent.on('tap',({ object,position }) => {
    console.log("tap",object,position,nodeElement.CircleMap.get(object))
})
//移动元素
.on('move',({ object,newPosition,oldPosition }) => {
    //线条不需要展示
    if(object.type === "Line"){ return }
    let node = nodeElement.CircleMap.get(object)

    let vx = newPosition.x - node.x,
        vy = newPosition.y - node.y
    node.x = newPosition.x,node.y = newPosition.y
    node.roundNodes.forEach(roundNode => {
        roundNode.x += vx,
        roundNode.y += vy
    })
})






