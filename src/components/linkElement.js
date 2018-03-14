import { default as linkElement } from '../common/links'
import { default as nodeElement } from '../common/nodes'
import * as THREE from 'three'


const LINES = new Map()
const propLineName = Symbol("line")
const propSourceName = Symbol('source')
const propTargetName = Symbol('target')

const createLine = (color = "0xAAAAAA", opacity = .8, point1 = new THREE.Vector3(0, 0, -1), point2 = new THREE.Vector3(0, 0, -1)) => {
	let line = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial({ color: Math.floor(color), opacity }))
	point1 = point1.isVector3 ? point1 : new THREE.Vector3(point1.x || 0, point1.y || 0, -2)
	point2 = point2.isVector3 ? point2 : new THREE.Vector3(point2.x || 0, point2.y || 0, -2)
	line.geometry.vertices.push(point1, point2)
	return line
}
export default class extends linkElement{
	static createLine(){ return createLine(...arguments) }
	static get Line(){ return LINES }
	static get LineArray(){ return Array.from(new Set(LINES.values())) }


	constructor(){
		super(...arguments)
		this[propLineName] = createLine()
		LINES.set(this.name,this[propLineName])
	}

	sourceUpdate(node){
		let line = this[propLineName]
		line.geometry.verticesNeedUpdate = true
    	line.geometry.vertices[0] = new THREE.Vector3(node.x, node.y, line.geometry.vertices[0].z)
	}
	targetUpdate(node){
		let line = this[propLineName]
		line.geometry.verticesNeedUpdate = true
    	line.geometry.vertices[1] = new THREE.Vector3(node.x, node.y, line.geometry.vertices[1].z)
	}
	sourceVisible(node){
		//单边节点被隐藏 则线条隐藏
		this.visible = this.source.visible && this.target.visible
	}
	targetVisible(node){
		//单边节点被隐藏 则线条隐藏
		this.visible = this.source.visible && this.target.visible
	}


	get source(){
		return this[propSourceName] || ''
	}
	set source(value){
		if(typeof value === "string"){ return this[propSourceName] = value }
		if(!(value instanceof nodeElement)){ return } 
		this[propSourceName] = value

		if(value.Event){
			value.Event
				.on('update',this.sourceUpdate.bind(this))
				.on('visible',this.sourceVisible.bind(this))
		}

		//互补
		if(!(this.target instanceof nodeElement)){ return }
		value.Children = this.target
	}

	get target(){
		return this[propTargetName] || ''
	}
	set target(value){
		if(typeof value === "string"){ return this[propTargetName] = value }
		if(!(value instanceof nodeElement)){ return } 
		this[propTargetName] = value

		if(value.Event){
			value.Event
				.on('update',this.targetUpdate.bind(this))
				.on('visible',this.targetVisible.bind(this))
		}

		//互补
		if(!(this.source instanceof nodeElement)){ return }
		value.Parents = this.target
	}

	get visible(){
		return this[propLineName].visible
	}
	set visible(value){
		this[propLineName].visible = value
	}
}