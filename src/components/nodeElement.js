import { default as nodeElement } from '../common/nodes'
import * as THREE from 'three'


const CIRCLE = new Map()
const NODEMAP = new Map()
const propXName = Symbol("x")
const propYName = Symbol("y")
const propCircleName = Symbol("circle")

const createCircle = (size = 5,color = Math.floor("0x000000")) => new THREE.Mesh(new THREE.CircleBufferGeometry(size, 32), new THREE.MeshBasicMaterial({ color }))
export default class extends nodeElement{
	static createCircle(){ return createCircle(...arguments) }
	static get Circle(){ return CIRCLE }
	static get CircleMap(){ return NODEMAP }
	static get CircleArray(){ return Array.from(new Set(CIRCLE.values())) }


	constructor(){
		super(...arguments)
		CIRCLE.set(this.name,this[propCircleName] = createCircle())
		//反向映射
		NODEMAP.set(this[propCircleName],this)
	}

	update(){
		//不展示的时候 不消耗资源
		if(!this.visible){ return }
		let { x,y,z } = this[propCircleName].position
		this[propCircleName].position.set(this.x || x,this.y || y,z)
		this.Event.emit('update',this)
	}

	get Circle(){
		return this[propCircleName]
	}

	get x(){
		return this[propXName]
	}
	set x(value){
		if(isNaN(value)){ return }
		this[propXName] = Number(value)
		this.update()
	}

	get y(){
		return this[propYName]
	}
	set y(value){
		if(isNaN(value)){ return }
		this[propYName] = Number(value)
		this.update()
	}

	get visible(){
		return this.Circle.visible
	}
	set visible(value){
		this.Circle.visible = value
		//展示的时候 update 一次
		this.visible && this.update()
		this.Event.emit('visible',this)
	}
}