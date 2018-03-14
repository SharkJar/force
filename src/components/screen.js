import * as THREE from 'three'
import OrbitControls from 'three-OrbitControls'
import { Stats } from 'three-stats'
import { EventEmitter } from 'events'
import { classAttribute } from '../decorator/classAttribute'
import { default as base } from '../common/element'

//添加screenWidth属性
@classAttribute('screenWidth',v => { return v && typeof v === "number" },100)
//添加screenHeight属性
@classAttribute('screenHeight','number',100)
//添加screenContainer属性
@classAttribute('screenContainer','object',document && document.body)
//事件
@classAttribute('emitter',null,new EventEmitter)
//屏幕
@classAttribute('scene',v => v && v.type === 'Scene',() => new THREE.Scene)
//renderer
@classAttribute('renderer','object',() => new THREE.WebGLRenderer({ antialias: true,precision: 'highp',alpha: true }))
//性能监控
@classAttribute('stats','object',new Stats)
//声明式
@classAttribute('camera','unknow',function (){
	return new THREE.OrthographicCamera(0, this.screenWidth, this.screenHeight, 0, 1, 10000)
})
//声明式
@classAttribute('controls','unknow',function (){
	return new OrbitControls(this.camera, this.renderer.domElement)
})
export class Screen extends base{
	constructor(width = window.innerWidth,height = window.innerHeight,container = document.body){
		super(...arguments)
		this.screenWidth = width,
		this.screenHeight = height,
		this.screenContainer = container

		// let circle = this.circle = new THREE.Mesh(new THREE.CircleBufferGeometry(8, 32), new THREE.MeshBasicMaterial({ color:new THREE.Color(Math.floor('0xAAAAAA')) }))
		// console.log(circle);
		// this.scene.add(circle)
		// this.domEvents.on('tap',({ object }) => { console.log(object,333) })
		// let position = this.domEvents.getPosition({ clientX:200,clientY:300 },this.circle)
		// console.log(position)
		// this.circle.position.set(position.x,position.y,2)

		this.setWindow()
		this.setPixelRatio()
		this.setCamera({ z:1000 })
		this.setControls()

		this.screenContainer.appendChild(this.renderer.domElement)
		this.screenContainer.appendChild(this.stats.domElement)

		this.animate()
	}
	/*
	 * 设置场景大小
	 */
	setCamera(
		{
			x = this.camera.position.x,
			y = this.camera.position.y,
			z = this.camera.position.z,
			zoom = 1.3
		} = {}
	){
		this.camera.position.x = x
		this.camera.position.y = y
		this.camera.position.z = z
		this.camera.zoom = zoom
		//立马生效
		this.camera.updateProjectionMatrix()
	}
	/*
	 * 设置场景大小
	 */
	setWindow(width = this.screenWidth,height = this.screenHeight){
		this.screenWidth = width
		this.screenHeight = height
		this.renderer.setSize(this.screenWidth,this.screenHeight)
	}
	/*
	 * 设置场景分辨率
	 */
	setPixelRatio(devicePixelRatio = window.devicePixelRatio){
		this.renderer.setPixelRatio(devicePixelRatio)
	}
	/*
	 * 设置视角控制器
	 */
	setControls(
		{
			//是否可以缩放
			enableZoom = false,
			//是否可以旋转
			enableRotate = false,
			//是否自动旋转
			autoRotate = false,
			//设置相机距离原点的最远距离
			minDistance = 10,
			//设置相机距离原点的最远距离
			maxDistance = -10,
			//是否开启右键拖拽
			enablePan = true,
			mouseButtons = {
				//mouseButtons
				//旋转鼠标设置 设置成鼠标右键
				ORBIT : THREE.MOUSE.RIGHT,
				//mouseButtons
				//平移鼠标设置 设置成鼠标左键
				PAN : THREE.MOUSE.LEFT
			}
		} = {}
	){
		let { ORBIT,PAN } = mouseButtons
		this.controls.enableZoom = enableZoom
		this.controls.enableRotate = enableRotate
		this.controls.autoRotate = autoRotate
		this.controls.minDistance = minDistance
		this.controls.maxDistance = maxDistance
		this.controls.enablePan = enablePan
		this.controls.mouseButtons.ORBIT = ORBIT
		this.controls.mouseButtons.PAN = PAN
	}



	animate(){
		this.stats.begin()
		this.controls.update()
		this.emitter.emit('tick')

		//绘制
      	this.renderer.render(this.scene, this.camera)
      	this.stats.end()
      	requestAnimationFrame(this.animate.bind(this))
	}
}

