import {
	BufferGeometry,
	DynamicDrawUsage,
	Float32BufferAttribute,
	MathUtils,
	Uint32BufferAttribute,
	Vector3
} from 'three';


/*
rayParameters = {
	sourceOffset : Vector3,
	destOffset : Vector3,
	timeScale : float (0 ~ 1),
	roughness : float (0 ~ 1),
	straighness : float (0 ~ 1),
	up0 : Vector3 [0, 1 ,0],
	up1 : Vector3 [0, 1, 0]
	radius0 : float,
	radius1 : float,
	radius0Factor : float (0 ~ 1),
	radius1Factor : float (0 ~ 1),
	minRadius : float (0 ~ 1),
	isEternal : bool,
	birthTime : int,
	deathTime : int,
	propagationTimeFactor : float (0 ~ 1)
	vanishingTimeFactor : float (0 ~ 1),
	subrayPeriod : int,
	subrayDutyCycle : float (0 ~ 1),



}


*/



export default class LightningStrike extends BufferGeometry {





	update (time ){


		this.updateMesh();
	}



	updateMesh(){

	}


}




LightningStrike.RAY_INITIALIZED = 0;
LightningStrike.RAY_UNBORN = 1;
LightningStrike.RAY_PROPAGATING = 2;
LightningStrike.RAY_STEADY = 3;
LightningStrike.RAY_VANISHING = 4;
LightningStrike.RAY_EXTINGUISHED = 5;

LightningStrike.COS30DEG = Math.cos( 30 * Math.PI / 180 );
LightningStrike.SIN30DEG = Math.sin( 30 * Math.PI / 180 );



