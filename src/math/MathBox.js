/**
 * @author anhr / https://github.com/anhr/
*/

//Attenttion!!! Save this file as UTF-8 for localization
//https://threejs.org/docs/#manual/en/introduction/Import-via-modules

import {

	Vector2,
	Vector3,
//	PerspectiveCamera,
//	Scene,
	Color,
//	Fog,
//	WebGLRenderer,
//	PointLight,
	Group,
//	AxesHelper,
	Raycaster,
	SpriteText,
	BufferGeometry,
	Points,
	PointsMaterial,
	LineSegments,
	LineDashedMaterial,
	VertexColors,
	Line,
	LineBasicMaterial,

} from '../../build/three.module.js';//'http://localhost/threejs/three.js/build/three.module.js';

import { getLanguageCode } from '../../../commonNodeJS/master/lang.js';
import { LineGeometry } from '../../examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from '../../examples/jsm/lines/LineMaterial.js';
import { Line2 } from '../../examples/jsm/lines/Line2.js';

//local version
//import loadScript from '../loadScriptNodeJS/master/loadScript.js';

//import loadScript from '../../loadScriptNodeJS/master/loadScript.js';
import loadScript from 'https://raw.githack.com/anhr/loadScriptNodeJS/master/loadScript.js';

//collection of interactive mathematical visualizations
//options: default is undefined.
//{
//	axesHelper: THREE.AxesHelper object. Default is undefined.
//	scale: scale of object. Default is 1
//	scales: scales of the axes. Default is undefined.
//	{
//		x: X axis options. Default is undefined.
//		{
//			min: Minimum range of the x axis. Default is -1.
//			max: Maximum range of the x axis. Default is 1.
//			name: name of the x axis. Default is 'x'.
//		}
//		y: Y axis options. Default is undefined.
//		{
//			min: Minimum range of the x axis. Default is -1.
//			max: Maximum range of the x axis. Default is 1.
//			name: name of the y axis. Default is 'y'.
//		}
//		z: Z axis options. Default is undefined.
//		{
//			min: Minimum range of the x axis. Default is -1.
//			max: Maximum range of the x axis. Default is 1.
//			name: name of the z axis. Default is 'z'.
//		}
//	}
//	color: color of the mathematical visualizations. Default is 0xffffff - white color
//	colorsHelper: intensity of the gray color of the dashed lines from selected point to appropriate axis.
//		Available values from 0x00 - dark to 0xff - white. Default is 0x80.
//}
export function MathBox( options ) {

	options = options || {};
	var scene = options.scene;
	options.color = options.color || 0xffffff;
	options.colorsHelper = options.colorsHelper || 0x80;

	options.scale = options.scale || 1;
	options.scales = options.scales || options.axesHelper === undefined ? {} : options.axesHelper.options.scales;

	options.scales.x = options.scales.x || {};
	options.scales.x.min = options.scales.x.min || - 1;
	options.scales.x.max = options.scales.x.max || 1;
	options.scales.x.name = options.scales.x.name || 'x';


	options.scales.y = options.scales.y || {};
	options.scales.y.min = options.scales.y.min || - 1;
	options.scales.y.max = options.scales.y.max || 1;
	options.scales.y.name = options.scales.y.name || 'y';

	options.scales.z = options.scales.z || {};
	options.scales.z.min = options.scales.z.min || - 1;
	options.scales.z.max = options.scales.z.max || 1;
	options.scales.z.name = options.scales.z.name || 'z';

	var mathBox = this;
	var threshold = 0.05 * options.scale;


	//raycaster
	//working out what points in the 3d space the mouse is over. https://threejs.org/docs/index.html#api/en/core/Raycaster

	var MyRaycaster = function ( scale ) {

		scale = scale || 1;
		this.positionDif = null; // Vector3 is difference between position of the raycaster.particles object and position of the axes
		this.setPositionDif = function ( particles ) {

			particles = particles || this.particles;
			if ( Array.isArray( particles ) ) {

				console.error( 'THREE.MathBox.raycaster.setPositionDif: Invalid particles' );
				return;

			}
			this.positionDif = new Vector3  ( 0, 0, 0 );
			scaleObject.positionVector3( this.positionDif, particles.scale );//position of the axes
			this.positionDif.sub( particles.position );
			this.positionDif.negate();
			this.positionDif.divide( particles.scale );

		}
		var spriteTextIntersection,
			INTERSECTED,
			raycaster = new Raycaster();
		this.addParticles = function ( point ) {
			if ( raycaster.stereo !== undefined )
				raycaster.stereo.addParticles( point );
			this.setPositionDif( point );
		}
		this.removeParticles = function () {
			if ( raycaster.stereo !== undefined )
				raycaster.stereo.removeParticles();
		}
		this.onDocumentMouseMove = function ( event ) {

			if ( raycaster.stereo !== undefined )
				raycaster.stereo.onDocumentMouseMove( event );

		};
		this.onDocumentMouseDown = function ( event ) {

			if ( raycaster.stereo !== undefined )
				raycaster.stereo.onDocumentMouseDown( event );

		};
		raycaster.params.Points.threshold = 0.02 * scale;
		raycaster.setStereoEffect( {

			camera: options.camera,
			renderer: options.renderer,
			onIntersection: function ( intersects ) {

				//console.log( 'onIntersection' );
				var intersection = intersects[0];
				switch ( intersection.object.type ) {

					case "Points":
						if ( spriteTextIntersection !== undefined )
							return;
						var textColor = 'rgb( ' + options.colorsHelper + ', ' + options.colorsHelper + ', ' + options.colorsHelper + ' )',
							position = new Vector3  ( 0, 0, 0 );
						position.fromArray( intersection.object.geometry.attributes.position.array, intersection.index * 3 );
						position.add( myRaycaster.positionDif );

						spriteTextIntersection = new SpriteText(
								options.scales[mathBox.axesEnum.getName( mathBox.axesEnum.x )].name + ': ' + position.x +
								' ' + options.scales[mathBox.axesEnum.getName( mathBox.axesEnum.y )].name + ': ' + position.y +
								' ' + options.scales[mathBox.axesEnum.getName( mathBox.axesEnum.z )].name + ': ' + position.z, {

									textHeight: 0.06 * options.scale,
									fontColor: textColor,
									rect: {

										displayRect: true,
										borderThickness: 3,
										borderRadius: 10,
										borderColor: textColor,
										backgroundColor: 'rgba( 0, 0, 0, 1 )',

									},
									position: raycaster.stereo.getPosition( intersection ),
									center: new Vector2( 0.5, 0 ),

								} );
						scene.add( spriteTextIntersection );
						INTERSECTED = intersection.object;
						break;
					default: console.error( 'Unknown object type: ' + intersection.object.type );

				}

			},
			onIntersectionOut: function ( intersects ) {

				//console.log( 'onIntersectionOut' );
				if ( INTERSECTED === undefined )
					return;
				switch ( INTERSECTED.type ) {

					case "Points":

						if ( spriteTextIntersection === undefined )
							return;
						scene.remove( spriteTextIntersection );
						//delete spriteTextIntersection;
						spriteTextIntersection = undefined;

						break;
					default: console.error( 'Unknown object type: ' + INTERSECTED.type );

				}
				INTERSECTED = undefined;

			},
			onMouseDown: function ( intersects ) {

				//console.log( 'onMouseDown' );
				var intersection = intersects[0],
					position = raycaster.stereo.getPosition( intersection ),
					object = intersection.object;
				if ( raycaster.pointSelected !== undefined ) {

					//find selected line
					for ( var iz = 0; iz < raycaster.particles.length; iz++ ) {

						if ( raycaster.particles[iz].geometry.uuid === object.geometry.uuid ) {

							raycaster.pointSelected( iz, raycaster.intersects[0].index );
							break;

						}

					}

				}

				if ( object.userData.owner !== undefined )
					object.userData.owner.userData.onDocumentMouseDown();

				//select an object in selectObject3D controller
				//create object.userData.controllerSelectPoint if is not exists
				if ( object.userData.onDocumentMouseDown !== undefined )
					object.userData.onDocumentMouseDown( object.userData.index );

				guiSelectPoint.setValue( intersection.index + 1 );

			}

		} );

	}
	var myRaycaster = new MyRaycaster();
	this.onDocumentMouseMove = function ( event ) {

		myRaycaster.onDocumentMouseMove( event );

	};
	this.onDocumentMouseDown = function ( event ) {

		myRaycaster.onDocumentMouseDown( event );

	};

	//

	this.axesEnum = {

		x: 0, y: 1, z: 2,
		getName: function ( axesId ) {

			if ( options.axesHelper !== undefined )
				return options.axesHelper.axesEnum.getName( axesId );
			switch ( axesId ) {

				case mathBox.axesEnum.x: return 'x';
				case mathBox.axesEnum.y: return 'y';
				case mathBox.axesEnum.z: return 'z';
				default: console.error( 'THREE.MathBox.axesEnum.getName: invalid id = ' + axesId );

			}

		}

	};

	function removeChildrenGroup( group ) {

		group.children.forEach( function ( groupItem ) {

			if ( groupItem.userData.remove !== undefined )
				groupItem.userData.remove();
			removeChildrenGroup( groupItem );

		} );
	}
	this.removeGroup = function ( group ) {

		guiSelectPoint.remove();
//		guiSelectObject3D.remove();
		myRaycaster.removeParticles();
		if ( group !== undefined ) {

			controller4DObjectPlayer.remove();
			removeChildrenGroup( group );
			group.remove(  );
			group.children.length = 0;
			scene.remove( group );
			//delete group;//Parsing error: Deleting local variable in strict mode

		}
		dotLines.remove();
//		boldLine.remove();
		pointLight.remove();

	};

	function getAxesPosition( axesId ) {

		if ( options.axesHelper !== undefined )
			return options.axesHelper.getAxesPosition( axesId );
		var axes = mathBox.axesEnum.getName( axesId );
		return {

			min: {
				position: new Vector3  ( 0, 0, 0 ),
				scale: options.scales[ axes ].min,
			},
			max: {

				position: new Vector3  ( 0, 0, 0 ),
				scale: options.scales[ axes ].max,

			}

		};

	}

	//Localization
	var lang;
	if ( getLanguageCode !== undefined )
		switch ( getLanguageCode() ) {

			case 'ru'://Russian language
				lang = {

					zero: 'Ноль',
					zeroTitle: 'Переместить точку в ноль',
					zeroTitlePosition: 'Переместить позицию примера в ноль',

					selectPoint: 'Выберите точку',
					noSelect: 'не выбрана',
					noSelectObject3D: 'не выбрано',
					point: 'Точка',

					selectLine: 'Выберите линию',
					selectObject3D: 'Выберите объект',
					selectObjects3D: 'Выб. объекты',
					selectPoints3D: 'Выберите точки',
					selectLine3D: 'Выберите линию',
					selectSurface3D: 'Поверхность',

					playRateTitle: 'Скорость смены 3D-объектов в секунду.',

					tMinTitle: 'Минимальные значения параметра "t" формул',
					tMaxTitle: 'Максимальные значения параметра "t" формул',

					pointsCount: 'Точек',
					pointsCountTitle: 'Количество точек кривой',

					restore: 'Восстановить',
					restoreTitle: 'Восстановить формулы',
					restoreLightTitle: 'Восстановить положение источника света',

					fourmulas: 'Формулы',
					position: 'Позиция',

					light: 'Свет',
					displayLight: 'Показать',
					displayLightTitle: 'Показать или скрыть источник света.',

					//4D
					play4D: 'Анимация 4D объекта',
					pause4D: 'Пауза',
					stop4D: 'Остановить воспроизведение',
					repeatOn: 'Повторять воспроизведение',
					repeatOff: 'Возпроизвести один раз',
					prevObject3D: 'Перейти к предыдущему 3D объекту',
					nextObject3D: 'Перейти к следующему 3D объекту',
					ocject3DNames: {

						points: 'точки',
						line: 'линия',
						surface: 'поверхность',

					}

				};
				break;
			default://Custom language
				lang = {

					zero: 'Zero',
					zeroTitle: 'Move point to zero',
					zeroTitlePosition: "Move example's position to zero",

					selectPoint: 'Select Point',
					noSelect: 'no select',
					noSelectObject3D: 'no select',
					point: 'Point',

					selectLine: 'Select Line',
					selectObject3D: 'Select Object',
					selectObjects3D: 'Select Objects',
					selectPoints3D: 'Select Points',
					selectLine3D: 'Select Line',
					selectSurface3D: 'Select Surface',

					playRateTitle: 'Rate of changing of 3D obects per second.',

					tMinTitle: 'Minimum value of the "t" parameter of the formulas',
					tMaxTitle: 'Maximum value of the "t" parameter of the formulas',

					pointsCount: 'Points Count',
					pointsCountTitle: 'Count of curve points',

					restore: 'Restore',
					restoreTitle: 'Restore formulas',
					restoreLightTitle: 'Restore position of the light source',

					fourmulas: 'Fourmulas',
					position: 'Position',

					light: 'Light',
					displayLight: 'Display',
					displayLightTitle: 'Display or hide the light source.',

					//4D
					play4D: 'Animate of 4D object',
					pause4D: 'Pause',
					stop4D: 'Stop playing',
					repeatOn: 'Turn repeat on',
					repeatOff: 'Turn repeat off',
					prevObject3D: 'Go to previous 3D object',
					nextObject3D: 'Go to next 3D object',

					ocject3DNames: {

						points: 'points',
						line: 'line',
						surface: 'surface',

					}

				};

		}

	var scaleObject = {

		a: function ( max, min ) {

			return Math.abs( ( 2 * options.scale ) / ( max - min ) );

		},
		axis: function ( axis ) {

			return this.a( axis.max, axis.min );

		},
		vector3: function ( scale, scales ) {

			scales = scales || options.scales;
			scale.x = this.axis( scales.x );
			scale.y = this.axis( scales.y );
			scale.z = this.axis( scales.z );

		},
		positionAxis: function ( axis, scale ) {

			return - ( ( axis.max + axis.min ) / 2 ) * scale;

		},
		positionVector3: function ( position, scale, scales ) {

			scales = scales || options.scales;
			position.x = this.positionAxis( scales.x, scale.x );
			position.y = this.positionAxis( scales.y, scale.y );
			position.z = this.positionAxis( scales.z, scale.z );

		},
		getRealPositionVector3: function ( position, scale ) {

			return new Vector3  (
				- position.x / scale.x,
				- position.y / scale.y,
				- position.z / scale.z
			);

		},
		getRealPosition: function ( object3D ) {

			return this.getRealPositionVector3( object3D.position, object3D.scale );

		},
		setPositionAxis: function ( object3D, axesId, value ) {

			var axesName = mathBox.axesEnum.getName( axesId );
			object3D.position[axesName] = -value * object3D.scale[axesName];
			myRaycaster.setPositionDif( object3D );

		},
		setPosition: function ( object3D, position ) {

			function setPositionAxis( axesId, value ) {

				var axesName = mathBox.axesEnum.getName( axesId );
				object3D.position[ axesName ] += value * object3D.scale[ axesName ];

			}
			setPositionAxis( mathBox.axesEnum.x, position.x );
			setPositionAxis( mathBox.axesEnum.y, position.y );
			setPositionAxis( mathBox.axesEnum.z, position.z );

		},
		object3D: function ( object3D, scales ) {

			scales = scales || options.scales;
			this.vector3( object3D.scale, scales );
			this.positionVector3( object3D.position, object3D.scale, scales );

		},
		getPositionVector3: function ( position, scale ) {

			var positionZero = new Vector3  ( 0, 0, 0 );
			scaleObject.positionVector3( positionZero, scale, options.scales );
			positionZero = scaleObject.getRealPositionVector3( positionZero, scale );
			return new Vector3  (
				( position.x - positionZero.x ) * scale.x,
				( position.y - positionZero.y ) * scale.y,
				( position.z - positionZero.z ) * scale.z
			);

		},

	};

	//dotted lines
	function dotLines() {

		var lineX, lineY, lineZ;
		var groupDotLines;
		this.remove = function () {

			if ( groupDotLines === undefined )
				return;
			scene.remove( groupDotLines );
			groupDotLines = undefined;
			lineX = undefined;
			lineY = undefined;
			lineZ = undefined;

		};
		function createGroup() {

			dotLines.remove();
			groupDotLines = new Group();;
			scene.add( groupDotLines );

		}
		this.dottedLines = function ( pointVertice ) {


			if ( options.axesHelper === undefined )
				return;
			var axesHelper = options.axesHelper;

			createGroup();

			function dottedLine( axesId ) {

				var lineVertices = [
					pointVertice,
					new Vector3  ( 0, 0, 0 ),
				];
				var scal = new Vector3  ( 0, 0, 0 );
				scaleObject.vector3( scal, axesHelper.options.scales );
				lineVertices[ 1 ].x = axesId === axesHelper.axesEnum.x ? lineVertices[ 0 ].x :
					- scaleObject.positionAxis( axesHelper.options.scales.x, scal.x ) / scal.x;
				lineVertices[ 1 ].y = axesId === axesHelper.axesEnum.y ? lineVertices[ 0 ].y :
					- scaleObject.positionAxis( axesHelper.options.scales.y, scal.y ) / scal.y;
				lineVertices[ 1 ].z = axesId === axesHelper.axesEnum.z ? lineVertices[ 0 ].z :
					- scaleObject.positionAxis( axesHelper.options.scales.z, scal.z ) / scal.z;

				var colorsHelper = options.colorsHelper;
				var line = new LineSegments( new BufferGeometry().setFromPoints( lineVertices ),
					new LineDashedMaterial( {
						color: 'rgb(' + colorsHelper + ', ' + colorsHelper + ', ' + colorsHelper + ')',
						dashSize: 0.1, gapSize: 0.1
					} ) );
				line.computeLineDistances();
				scaleObject.object3D( line, axesHelper.options.scales );
				groupDotLines.add( line );
				return line;

			}
			lineX = dottedLine( axesHelper.axesEnum.x );
			lineY = dottedLine( axesHelper.axesEnum.y );
			lineZ = dottedLine( axesHelper.axesEnum.z );

		};
		this.movePointAxes = function ( axesId, value ) {

			var line;
			switch ( axesId ) {

				case mathBox.axesEnum.x:
					line = lineX;
					break;
				case mathBox.axesEnum.y:
					line = lineY;
					break;
				case mathBox.axesEnum.z:
					line = lineZ;
					break;
				default: console.error( 'point.userData.movePointAxes: invalid axesId: ' + axesId );
					return;

			}
			if ( line === undefined )
				return;
			line.geometry.attributes.position.array[ axesId + 3 ] = value;

			lineX.geometry.attributes.position.array[ axesId ] = value;
			lineY.geometry.attributes.position.array[ axesId ] = value;
			lineZ.geometry.attributes.position.array[ axesId ] = value;

			lineX.geometry.attributes.position.needsUpdate = true;
			lineY.geometry.attributes.position.needsUpdate = true;
			lineZ.geometry.attributes.position.needsUpdate = true;

		};

	}
	var dotLines = new dotLines();

	//bold line See https://github.com/mrdoob/three.js/blob/master/examples/webgl_lines_fat.html for details
	function boldLineProc() {

		var group;
		this.load = function ( onLoad ) {

			onLoad();
/*
			loadScript.async( [
				"../examples/js/lines/LineSegmentsGeometry.js",
				"../examples/js/lines/LineGeometry.js",
				"../examples/js/lines/LineMaterial.js",
				"../examples/js/lines/LineSegments2.js",
				"../examples/js/lines/Line2.js",
			],
			{
				onload: function () {

					onLoad();

				},
				onerror: function ( str, e ) {

					console.error( str );

				},

			} );
*/

		}
		this.create = function ( object3D, optionsBoldLine ) {

			optionsBoldLine = optionsBoldLine || {};
			var groupParent = optionsBoldLine.groupParent || scene;

			this.remove();

			var color = optionsBoldLine.color || new THREE.Color( 1, 0, 0 ); //red
			group = new Group();;
			groupParent.add( group );
			var colors = [];
			for ( var i = 0; i < object3D.geometry.attributes.position.array.length / 3; i++ ) {

				colors.push( color.r, color.g, color.b );

			}

			this.load( function () {

				var geometry = new LineGeometry();
				geometry.setPositions( object3D.geometry.attributes.position.array );
				geometry.setColors( colors );

				if ( LineMaterial !== undefined ) {

					var matLine = new LineMaterial( {

						color: 0xffffff,
						linewidth: 0.005, // in pixels
						vertexColors: VertexColors,
						//resolution:  // to be set by renderer, eventually
						dashed: false

					} );
					var line = new Line2( geometry, matLine );
					line.computeLineDistances();
					line.scale.set( 1, 1, 1 );
					scaleObject.object3D( line, options.scales );
					group.add( line );
					line.position.copy( object3D.position );
					line.userData.setPosition = function ( position ) {

						line.position.copy( position );

					};

				} else {

					//issue of Internet Explorer - load of the LineMaterial.js file is impossible.
					//Instead I see "Invalid character" error message in the LineMaterial.js (34,3) line.

					function arrayToPositions( array ) {

						var positions = [];
						for ( var i = 0; i < array.length; i += 3 )
							positions.push( new Vector3  ( array[0 + i], array[1 + i], array[2 + i] ) );
						return positions;

					}

					mathBox.line( {

						vertices: arrayToPositions( positions ),
						groupParent: group,
						color: 0xFF00FF,

					} );

				}

			} );

		};
		this.remove = function () {

			if ( group === undefined )
				return;
			group.parent.remove( group );
			group = undefined;

		};
		this.setPosition = function ( position ) {

			if ( ( group === undefined ) || ( group.children.length === 0 ) )
				return;
			group.children[0].position.copy( position );

		};
		this.setPositions = function ( positions ) {

			if ( ( group === undefined ) || ( group.children.length === 0 ) )
				return;
			group.children[0].geometry.setPositions( positions );

		};
		this.visible = function ( visible ) {

			if ( group === undefined )
				return;
			group.visible = visible;

		};

	}
//	boldLine = new boldLineProc();

	function getPoints( pointVerticesSrc, color ) {

		var geometry = Array.isArray( pointVerticesSrc ) ?
			new BufferGeometry().setFromPoints( pointVerticesSrc ) : pointVerticesSrc;
		return new Points( geometry,
			new PointsMaterial( {

				color: color === undefined ? options.color : color, //map: texture,
				size: threshold, alphaTest: 0.5

			} ) );

	}

	function guiSelectPoint() {

		var controller, points, fPoint;
			
		function emptySelectController() {

			controller.setValue( 0 );
			for ( i = controller.__select.options.length - 1; i >= 0; i-- )
				controller.__select.remove( i );

		}
		this.add = function ( folder, pointsIndexes, onChangeSelectedPoint, pointsNew ) {

			points = pointsNew;
			if ( controller === undefined ) {

				//Points position folder

				var fPosition = folder.__folders[lang.position];
				if ( fPosition === undefined )
					fPosition = folder.addFolder( lang.position );

				var realPosition = scaleObject.getRealPosition( points );
				function controllerPosition( axesId ) {

					var axesPosition = getAxesPosition( axesId ),
						axesName = mathBox.axesEnum.getName( axesId ),
						object = { position: realPosition[axesName], },
						controller = dat.getControllerByName( fPosition, options.scales[axesName].name );
					function onChangePosition( value ) {

						scaleObject.setPositionAxis( points, axesId, value );
						if ( points.userData.setPosition !== undefined )
							points.userData.setPosition( points.position );
						else if ( ( points.userData.owner !== undefined ) && ( points.userData.owner.userData.setPosition !== undefined ) )
							points.userData.owner.userData.setPosition( points.position );

						if ( points.userData.controllers !== undefined ) {

							var controller = points.userData.controllers[axesName];
							var positionDif = myRaycaster.positionDif;
							var array = points.geometry.getAttribute( 'position' ).array,
								index = points.userData.controllers.pointId * 3,
								pointVertice = new Vector3  (
									array[index + 0] + positionDif.x,
									array[index + 1] + positionDif.y,
									array[index + 2] + positionDif.z
								);

							var val = pointVertice[axesName];
							if ( controller.__min > val )
								controller.min( val );
							if ( controller.__max < val )
								controller.max( val );
							controller.setValue( val );

						}

					}
					if ( controller === undefined )
						controller = fPosition.add( object, 'position',
							object.scale < axesPosition.min.scale ? object.scale : axesPosition.min.scale,
							object.scale > axesPosition.max.scale ? object.scale : axesPosition.max.scale,
							( axesPosition.max.scale - axesPosition.min.scale ) / 100 ).
							onChange( onChangePosition );
					else controller.__onChange = onChangePosition;
					dat.controllerNameAndTitle( controller, options.scales[axesName].name );

				}
				controllerPosition( mathBox.axesEnum.x );
				controllerPosition( mathBox.axesEnum.y );
				controllerPosition( mathBox.axesEnum.z );

				//Select point controler

				var object = { point: 0 };//lang.noSelect };
				controller = folder.add( object, 'point', pointsIndexes ).onChange( function ( value ) {

					if ( value === undefined ) {

						//for testing
						//	Select Сurve in the Example drop down menu in the webgl_math.html page.
						//	Change Points Count.
						//	Change "a"
						selectPoint.setValue( 0 );
						return;

					}

					var pointId = parseInt( value ) - 1;

					if ( fPoint !== undefined ) {

						fPoint.domElement.style.display = pointId === -1 ? 'none' : 'block';

						//remove previous point gui
						if ( fPoint.__controllers.length > 0 ) {

							for ( var i = fPoint.__controllers.length - 1; i >= 0; i-- ) {

								fPoint.remove( fPoint.__controllers[i] );

							}

						}

					}

					//remove previous dotted lines
					dotLines.remove();

					if ( pointId < 0 )
						return;//point is not selected

					var pointVertice = new Vector3  ( 0, 0, 0 );
					pointVertice.fromArray( points.geometry.attributes.position.array, pointId * 3 );
					pointVertice.add( myRaycaster.positionDif );
					dotLines.dottedLines( pointVertice );

					if ( folder === undefined )
						return;

					//Point folder

					fPoint = folder.__folders[lang.point];
					if ( fPoint === undefined ) {

						fPoint = folder.addFolder( lang.point );
//						fPoint.domElement.style.display = 'none';
						fPoint.open();

					}

					//Point's axes controllers

					function axesGui( axesId, onChange ) {

						function setScale( scale ) {

							axesPosition.min.scale = scale.min;
							axesPosition.max.scale = scale.max;

						}
						var axesPosition = getAxesPosition( axesId ),
							axesName = mathBox.axesEnum.getName( axesId ),
							object = {

								scale: pointVertice[axesName],

							},
							controller = fPoint.add( object, 'scale',
								object.scale < axesPosition.min.scale ? object.scale : axesPosition.min.scale,
								object.scale > axesPosition.max.scale ? object.scale : axesPosition.max.scale,
								( axesPosition.max.scale - axesPosition.min.scale ) / 100 ).
								onChange( function ( value ) {

									function movePointAxes( axesId, value, index ) {

										points.geometry.attributes.position.array[axesId + ( index === undefined ? pointId : index ) * 3] =
											value - myRaycaster.positionDif[mathBox.axesEnum.getName( axesId )];
										points.geometry.attributes.position.needsUpdate = true;
										dotLines.movePointAxes( axesId, value );

									}
									movePointAxes( axesId, value );
									if ( onChange !== undefined )
										onChange( value );
									if ( ( points.userData.owner !== undefined ) && ( points.userData.owner.userData.setPoints !== undefined ) )
										points.userData.owner.userData.setPoints( pointId );

								} );
						dat.controllerNameAndTitle( controller, options.scales[axesName].name );
						controller.setScale = function ( scale ) {

							var value = this.getValue();
							this.min( scale.min );
							this.max( scale.max );
							this.step(( scale.max - scale.min ) / 100 );
							this.setValue( value );
							setScale( scale );

						};
						return controller;

					}
					var optionsGui = onChangeSelectedPoint( pointId, points );
					var controllerX,
						controllerY,
						controllerZ;
					controllerX = axesGui( mathBox.axesEnum.x, optionsGui.onChangeX );
					controllerY = axesGui( mathBox.axesEnum.y, optionsGui.onChangeY );
					controllerZ = axesGui( mathBox.axesEnum.z, optionsGui.onChangeZ );
					points.userData.controllers = {

						x: controllerX,
						y: controllerY,
						z: controllerZ,
						pointId: pointId,

					};

					//button of moving point to zero

					var zeroParams = {

						zero: function ( value ) {

							function zeroAxes( axesId, controller ) {

								if ( controller === undefined )
									return;
								var axesPosition = getAxesPosition( axesId );
								controller.setValue(( axesPosition.max.scale + axesPosition.min.scale ) / 2 );

							}
							zeroAxes( mathBox.axesEnum.x, controllerX );
							zeroAxes( mathBox.axesEnum.y, controllerY );
							zeroAxes( mathBox.axesEnum.z, controllerZ );

						},

					};
					dat.controllerNameAndTitle( fPoint.add( zeroParams, 'zero' ), lang.zero,
						optionsGui.zeroTitle === undefined ? lang.zeroTitle : optionsGui.zeroTitle );

				} );
				dat.controllerNameAndTitle( controller, lang.selectPoint );
				return;

			}

			function appendSelectPoint() {

				Object.keys( pointsIndexes ).forEach( function ( index ) {

					var i = pointsIndexes[ index ],
						opt = document.createElement( 'option' );
					opt.value = i;
					opt.innerHTML = index;
					controller.__select.appendChild( opt );

				} );

			}
			appendSelectPoint( emptySelectController() );
			controller.setValue( 0 );

		}
		this.remove = function () {

			controller = undefined;
			points = undefined;

		}
		this.setValue = function ( value ) {

			controller.setValue( value );

		}

	}
	guiSelectPoint = new guiSelectPoint();

	function guiSelect3DObject() {

		var controller, object4D;

		this.add = function ( folder, vertices, object4DNew, controllerName ) {

			object4D = object4DNew;
			if ( controller === undefined ) {
				var object3DsIndexes = {};
				object3DsIndexes[lang.noSelectObject3D] = -1;
				for ( var i = 0; i < vertices.length; i++ )
					object3DsIndexes[i + 1] = i;
				controller = folder.add( { Object3D: -1 }, 'Object3D', object3DsIndexes )
				.onChange( function ( value ) {

					var elSelect = controller.domElement.querySelector( 'select' );
					elSelect.style.backgroundColor = parseInt(value) === -1 ? "white" : elSelect[value].style.backgroundColor;
					object4D.onChangeSelectObject3D( parseInt( value ), {

						folder: folder,

					} );

				} );
				dat.controllerNameAndTitle( controller, controllerName === undefined ? lang.selectObject3D : controllerName );
				return controller;

			}
			function emptySelectController() {

				controller.setValue( controller.initialValue );
				for ( i = controller.__select.options.length - 1; i >= 0; i-- )
					controller.__select.remove( i );

			}
			emptySelectController();
			function appendSelectedObject3D() {

				var object3DsIndexes = {};
				object3DsIndexes[lang.noSelectObject3D] = -1;
				for ( var i = 0; i < vertices.length; i++ )
					object3DsIndexes[i + 1] = i;
				Object.keys( object3DsIndexes ).forEach( function ( index ) {

					var i = object3DsIndexes[index],
						opt = document.createElement( 'option' );
					opt.value = i;
					opt.innerHTML = index;
					controller.__select.appendChild( opt );

				} );
				controller.setValue( controller.initialValue );

			}
			appendSelectedObject3D();
			return controller;

		}
		this.remove = function () {

			if ( controller === undefined )
				return;
			if ( parseInt( controller.getValue() ) !== controller.initialValue )
				controller.setValue( controller.initialValue );
			controller.remove();
			controller = undefined;

		}
		this.setValue = function ( value ) {

			controller.setValue( value );

		}

	}
//	var guiSelectObject3D = new guiSelect3DObject();

	//displaying points
	//optionsPoints
	//{
	//	vertices: array of Vector3   positions of the points for displaying. Defauit is [ new Vector3  ( 0, 0, 0 ) ]
	//	functions: formulas for calculating of points positions. Use instead optionsPoints.vertices
	//	{
	//		x: formula for calculating of the x coordinate of the points positions. Default formula is '((t+10)/10-1)*a+b'
	//		y: formula for calculating of the y coordinate of the points positions. Default formula is '((t+10)/10-1)*a+b'
	//		z: formula for calculating of the z coordinate of the points positions. Default formula is '((t+10)/10-1)*a+b'
	//	}
	//	params: parameters for calculating of points positions
	//	{
	//		pointsCount: count of the curve points. Default is 50
	//		t: Minimum and maximum values of the t parameter of the formulas
	//		{
	//			min: Default is -10
	//			max: Default is 10
	//		}
	//		For example if t.min = -1, t.max = 1 and pointsCount = 3. Then
	//		point	t
	//		0		-1
	//		1		0
	//		2		1
	//
	//		a: first parameter, you can use in your formula. For example 't*a+1'. Default is 1
	//		b: second parameter, you can use in your formula. For example 't+b'. Default is 0
	//
	//		onChangePoint
	//		{
	//			onChangeX: callback function is called if user has changed the x position of the point. Default is undefined.
	//			onChangeY: callback function is called if user has changed the y position of the point. Default is undefined.
	//			onChangeZ: callback function is called if user has changed the z position of the point. Default is undefined.
	//		}
	//
	//	}
	//	position: A Vector3   representing the points local position. Default is (0, 0, 0).
	//	groupParent: THREE.Group parent group for adding of the group of the points. Default is scene
	//	folder: gui folder. Default is undefined - no user gui
	//	color: color of the points. Default is undefined is options.color
	//}
	this.addPoints = function ( optionsPoints ) {

		optionsPoints = optionsPoints || {};

		var pointVerticesSrc = optionsPoints.vertices || [];
		if ( Array.isArray( pointVerticesSrc ) ) {

			while ( pointVerticesSrc.length < 1 )
				pointVerticesSrc.push( new Vector3  ( pointVerticesSrc.length, pointVerticesSrc.length, pointVerticesSrc.length ) );

		}

		if ( optionsPoints.functions !== undefined ) {

			var functions = optionsPoints.functions || {},
				f = '((t+10)/10-1)*a+b';
			functions.x = functions.x || f;
			functions.y = functions.y || f;
			functions.z = functions.z || f;

			var params = optionsPoints.params || {};
			params.a = params.a || 1;
			params.b = params.b || 0;
			params.t = params.t || {};
			params.t.min = params.t.min || - 10;
			params.t.max = params.t.max || 10;
			params.pointsCount = params.pointsCount || 50;
			var paramsRestore = Object.assign( {}, params );
			paramsRestore.t = Object.assign( {}, params.t );

			groupParent = optionsPoints.groupParent || scene;

			var functionsDefault = Object.assign( {}, functions );
			funcs = {};
			function setFuncs() {

				funcs.x = new Function( 't', 'a', 'b', 'return ' + functions.x ),
				funcs.y = new Function( 't', 'a', 'b', 'return ' + functions.y ),
				funcs.z = new Function( 't', 'a', 'b', 'return ' + functions.z );

			}
			function pushLineVertices() {

				pointVerticesSrc.length = 0;
				for ( var i = 0; i < params.pointsCount; i += 1 ) {

					var t = params.t.min + i * ( params.t.max - params.t.min ) / params.pointsCount;
					pointVerticesSrc.push( new Vector3  (
						funcs.x( t, params.a, params.b ),
						funcs.y( t, params.a, params.b ),
						funcs.z( t, params.a, params.b )
					) );

				}

			}

			setFuncs();
			pushLineVertices();

		}

		var group = new Group();;
		var groupParent = optionsPoints.groupParent || scene;
		groupParent.add( group );


		function drawPoints( color ) {

			var scales = axesHelper === undefined ? options.scales : axesHelper.options.scales,
				points = getPoints( pointVerticesSrc, color );
			scaleObject.object3D( points, scales );
			group.add( points );
			return points;

		}
		var axesHelper = options.axesHelper,
			colorsHelper = options.colorsHelper,
			point = drawPoints( optionsPoints.color );
		if ( optionsPoints.position !== undefined )
			scaleObject.setPosition( point, optionsPoints.position );
		myRaycaster.addParticles( point );
		point.userData.group = group;
		if ( optionsPoints.index !== undefined )
			point.userData.index = optionsPoints.index;

		//Points Settings

		//Point's gui
		//pointVerticesSrc: array of Vector3   Point's positions
		//folder: gui folder.
		//optionsGui: default is undefined.
		//{
		//	onChangeX: callback function is called if user has changed the x position of the point. Default is undefined.
		//	onChangeY: callback function is called if user has changed the y position of the point. Default is undefined.
		//	onChangeZ: callback function is called if user has changed the z position of the point. Default is undefined.
		//	zeroTitle: Title of Zero buttin. Default is undefined.
		//	group: THREE.Group group of the points. Default is undefined
		//	points: Points. Default is undefined
		//}
		function guiPoint( pointVerticesSrc, folder, optionsGui ) {

			if ( dat.controllerNameAndTitle === undefined ) {

				console.error( 'THREE.MathBox.guiPoint: dat.controllerNameAndTitle is undefined. Plese include StereoEffect.js into your project.' );
				return;

			}

			var axesHelper = options.axesHelper;

			optionsGui = optionsGui || {};
			var points = optionsGui.points || point;

			//formulas
			if ( optionsGui.functions !== undefined ) {

				var points = optionsGui.points,
					functions = optionsGui.functions,
					params = optionsGui.params;
				function onChangeFunction() {

					try {

						setFuncs();
						var array = points.geometry.attributes.position.array,
							j = 0;
						for ( var i = 0; i < params.pointsCount * 2; i ++ ) {

							var t = params.t.min + i * ( ( params.t.max - params.t.min ) / 2 ) / params.pointsCount;
							array[ j ] = funcs.x( t, params.a * options.scale, params.b * options.scale );
							j ++;
							array[ j ] = funcs.y( t, params.a * options.scale, params.b * options.scale );
							j ++;
							array[ j ] = funcs.z( t, params.a * options.scale, params.b * options.scale );
							j ++;

						}
						points.geometry.attributes.position.needsUpdate = true;
						selectPoint.setValue( selectPoint.getValue() );

					} catch ( e ) {

						console.error( e.message );

					}

				}

				if ( folder !== undefined ) {

					var f = '=f(t)=',
						fFourmulas = folder.addFolder( lang.fourmulas );
					fFourmulas.open();

					//x
					var controllerFX = fFourmulas.add( functions, 'x' ).onChange( function ( value ) {

						functions.x = value; onChangeFunction();

					} );
					dat.controllerNameAndTitle( controllerFX, options.scales.x.name + f );

					//y
					var controllerFY = fFourmulas.add( functions, 'y' ).onChange( function ( value ) {

						functions.y = value; onChangeFunction();

					} );
					dat.controllerNameAndTitle( controllerFY, options.scales.y.name + f );

					//z
					var controllerFZ = fFourmulas.add( functions, 'z' ).onChange( function ( value ) {

						functions.z = value; onChangeFunction();

					} );
					dat.controllerNameAndTitle( controllerFZ, options.scales.z.name + f );

					//a
					var controllerA = fFourmulas.add( params, 'a', 0.1, 3 ).onChange( function ( value ) {

							params.a = value; onChangeFunction();

						} ),
						//b
						controllerB = fFourmulas.add( params, 'b', - 3, 3 ).onChange( function ( value ) {

							params.b = value; onChangeFunction();

						} ),
						mid = ( params.t.max + params.t.min ) / 2,
						//t min
						controllerTMin = fFourmulas.add( params.t, 'min', 2 * params.t.min - params.t.max, mid ).onChange( function ( value ) {

							params.t.min = value; onChangeFunction();

						} );
					dat.controllerNameAndTitle( controllerTMin, 't min', lang.tMinTitle );
					//t max
					var controllerTMax = fFourmulas.add( params.t, 'max', mid, 2 * params.t.max - params.t.min ).onChange( function ( value ) {

						params.t.max = value; onChangeFunction();

					} );
					dat.controllerNameAndTitle( controllerTMax, 't max', lang.tMaxTitle );
					//Points Count
					var controllerPC = fFourmulas.add( params, 'pointsCount', 0, params.pointsCount * 2, 1 ).onChange( function ( value ) {

						params.pointsCount = value;
						points.parent.remove( points );
						var isOwner = false;
						if ( points.userData.owner !== undefined ) {

							points.userData.owner.parent.remove( points.userData.owner );
							delete points.userData.owner;
							isOwner = true;

						}
						pushLineVertices();
						points = drawPoints();
						raycaster.setParticles( points );
						if ( isOwner )
							points.userData.owner = drawLine( groupParent, { points: points } );
						appendSelectPoint( emptySelectController( selectPoint ), pointVerticesSrc.length );

					} );
					dat.controllerNameAndTitle( controllerPC, lang.pointsCount, lang.pointsCountTitle );

					//restore
					var restore = {

						restore: function () {

							functions = Object.assign( {}, functionsDefault );
							controllerFX.setValue( functions.x );
							controllerFY.setValue( functions.y );
							controllerFZ.setValue( functions.z );
							controllerA.setValue( paramsRestore.a );
							controllerB.setValue( paramsRestore.b );
							controllerTMin.setValue( paramsRestore.t.min );
							controllerTMax.setValue( paramsRestore.t.max );
							controllerPC.setValue( paramsRestore.pointsCount );

						}

					};
					dat.controllerNameAndTitle( fFourmulas.add( restore, 'restore' ), lang.restore, lang.restoreTitle );

				}

			}

			//select point

			//points indexes

			var pointsIndexes = {},
				pointId;
			pointsIndexes[ lang.noSelect ] = 0;

			var length = Array.isArray( pointVerticesSrc ) ? pointVerticesSrc.length :
				pointVerticesSrc.constructor.name === "Vector3" ? 1 : pointVerticesSrc.attributes.position.array.length / 3;
			for ( var i = 0; i < length; i ++ ) {

				pointsIndexes[ i + 1 ] = i + 1;

			}
			if ( folder === undefined ) {
/*
				if ( points !== undefined ) {

				}
*/
				return;

			}

			function onChangeSelectedPoint( pointId, points ) {

				return optionsGui;

			}

			guiSelectPoint.add( folder, pointsIndexes, onChangeSelectedPoint, points );

		}

		point.userData.guiPoint = guiPoint;

		guiPoint( pointVerticesSrc, optionsPoints.folder, {

			group: group,
			points: point,
			functions: optionsPoints.functions,
			params: optionsPoints.params,

			onChangeX: optionsPoints.onChangePoint === undefined ? undefined : optionsPoints.onChangePoint.onChangeX,
			onChangeY: optionsPoints.onChangePoint === undefined ? undefined : optionsPoints.onChangePoint.onChangeY,
			onChangeZ: optionsPoints.onChangePoint === undefined ? undefined : optionsPoints.onChangePoint.onChangeZ,

		} );
		return point;

	};

	function drawLine( group, optionsDrawLine ) {

		optionsDrawLine = optionsDrawLine || {};
		optionsDrawLine.color = optionsDrawLine.color || options.color;
		var lineVertices = optionsDrawLine.lineVertices || [];
		var optionsMaterial = Object.assign( {}, optionsDrawLine );
		delete optionsMaterial.folder;
		delete optionsMaterial.vertices;
		delete optionsMaterial.groupParent;
		var points = optionsMaterial.points;
		delete optionsMaterial.points;
		delete optionsMaterial.position;
		delete optionsMaterial.lineVertices;
		var owner = optionsMaterial.owner;
		delete optionsMaterial.owner;
		var line = new Line(
			( lineVertices.length === 0 ) && ( points !== undefined ) ?
				points.geometry
				: new BufferGeometry().setFromPoints( lineVertices ),
			new LineBasicMaterial( optionsMaterial ) );
		group.userData.object3D = line;
		scaleObject.object3D( line, options.scales );

		group.add( line );

		line.userData.setPosition = function ( position ) {

			line.position.copy( position );
			if ( ( owner !== undefined ) && ( owner.userData.setPosition !== undefined ) )
				owner.userData.setPosition( position, line );

		};
		line.userData.setPoints = function ( pointId ) {

			if ( ( owner !== undefined ) && ( owner.userData.setPoints !== undefined ) )
				owner.userData.setPoints( pointId, line );

		};
		line.userData.onChangeSelectedPoint = function () {

			if ( owner === undefined )
				return line.userData.owner.userData.onChangeSelectedPoint();
			return owner.onLineSelected( line.uuid );

		};
		line.userData.onDocumentMouseDown = function () {

/*
			if ( owner === undefined )
				return;
*/

		};
		if ( points !== undefined )
			line.userData.points = points;

		return line;

	}

	//displaying line
	//optionsLine
	//{
	//	points: Points Points of the vertices of the line
	//	vertices: array of Vector3   vertices of the line for displaying.
	//		Defauit is [ new Vector3  ( 0, 0, 0 ), new Vector3  ( 1, 1, 1 ) ] or optionsLine.points.geomerty
	//	position: A Vector3   representing the points local position. Default is (0, 0, 0) or optionsLine.points.position.
	//	groupParent: THREE.Group parent group for adding of the group of the line. Default is scene or optionsLine.points.parent
	//	color: line color. Default is options.color
	//}
	this.line = function ( optionsLine ) {

		optionsLine = optionsLine || {};

		if ( optionsLine.points === undefined )
			raycaster.particles = null;
		var lineVerticesSrc = optionsLine.vertices || [];
		if ( ( lineVerticesSrc.length === 0 ) && ( optionsLine.points !== undefined ) ) {} else while ( lineVerticesSrc.length < 2 )
			lineVerticesSrc.push( new Vector3  ( lineVerticesSrc.length, lineVerticesSrc.length, lineVerticesSrc.length ) );

		var group;
		if ( optionsLine.points === undefined ) {

			group = new Group();;
			groupParent = optionsLine.groupParent || scene;
			groupParent.add( group );

		} else group = optionsLine.points.parent;
		optionsLine.lineVertices = lineVerticesSrc;
		var line = drawLine( group, optionsLine );
		if ( optionsLine.position !== undefined )
			scaleObject.setPosition( line, optionsLine.position );
		else if ( optionsLine.points !== undefined ) {

			line.position.copy( optionsLine.points.position );
			optionsLine.points.userData.owner = line;

		}

		return line;

	};

	//displaying surface
	//optionsSurface
	//{
	//	vertices: Vertices of the surface. It is two dimensional array of Vector3  .
	//		First dimention is array of Vector3   vertices of lines
	//		Second dimention is array of Vector3   vertices of each line
	//		For example surface have three lines. Each line have four vertices
	//			vertices: [

	//				[
	//					new Vector3  ( -10, -3, -102 ),
	//					new Vector3  ( -5, 0, -102 ),
	//					new Vector3  ( 5, 1, -102 ),
	//					new Vector3  ( 10, -2, -102 )
	//				],
	//				[
	//					new Vector3  ( -10, 1, -104 ),
	//					new Vector3  ( -5, 0, -104 ),
	//					new Vector3  ( 5, -1, -104 ),
	//					new Vector3  ( 10, -2, -104 )
	//				],
	//				[
	//					new Vector3  ( -10, -2, -108 ),
	//					new Vector3  ( -5, -1, -108 ),
	//					new Vector3  ( 5, 0, -108 ),
	//					new Vector3  ( 10, 1, -108 )
	//				],

	//			],
	//		Default vertices is [
	//				[Vector3 {x: 0, y: 0, z: 0}, Vector3 {x: 0, y: 0, z: 0}],
	//				[Vector3 {x: 0, y: 0, z: 0}, Vector3 {x: 0, y: 0, z: 0}],
	//			]
	//	position: A Vector3   representing the surface local position. Default is (0, 0, 0) or optionsSurface.points.position.
	//	groupParent: THREE.Group parent group for adding of the group of the surface. Default is scene or optionsSurface.points.parent
	//	folder: gui folder. Default is undefined - no user gui
	//	color: surface color. Default is options.color
	//	light: THREE.PointLight object. Default is undefined - no light
	//}
	this.surface = function ( optionsSurface ) {

		optionsSurface = optionsSurface || {};
		if ( optionsSurface.vertices === undefined ) {

			var ymid = options.scales.y.min + ( options.scales.y.max - options.scales.y.min ) / 2;
			optionsSurface.vertices = [
				[
					new Vector3  ( options.scales.x.min, ymid, options.scales.z.min ),
					new Vector3  ( options.scales.x.max, ymid, options.scales.z.min ),
				],
				[
					new Vector3  ( options.scales.x.min, ymid, options.scales.z.max ),
					new Vector3  ( options.scales.x.max, ymid, options.scales.z.max ),
				],
			];

		}
		var vertices = optionsSurface.vertices;

//		var pointLight = mathBox.pointLight();
//		if ( ! pointLight.isLight() )
		pointLight.add();

		//surface

		var mesh, group;
		function surfaceMesh() {

			group = new Group();;
			groupParent = optionsSurface.groupParent || scene;
			groupParent.add( group );

			var geometry = new BufferGeometry();

			var indices = [];

			var vertices = [];

			// build surface

			// indices

			var iPoint1 = 0;
			for ( var iLine = 0; iLine < optionsSurface.vertices.length - 1; iLine++ ) {

				var line1 = optionsSurface.vertices[iLine],
					line2 = optionsSurface.vertices[iLine + 1],
					line1Length = line1.length,
					line2Length = line2.length,
					iPoint2 = iPoint1 + line1Length,
					indiceNextLine;
				for ( var iVertice = 0; iVertice < ( line1Length < line2Length ? line2Length : line1Length ) - 1; iVertice++ ) {

					var shortLine1 = iVertice >= line1Length - 1,
						indice1 = iPoint1 + ( shortLine1 ? line1Length - 1 : iVertice ),
						shortLine2 = iVertice >= line2Length - 1,
						indice2 = iPoint2 + ( shortLine2 ? line2Length - 2 : iVertice );
					if ( iVertice === 0 )
						indiceNextLine = indice2;

					var a = indice1;
					var b = indice2;
					var c = indice2 + 1;
					var d = indice1 + 1;

					// faces

					if ( !shortLine2 ) {

						indices.push( a, c, b );

					}
					if ( !shortLine1 ) {

						indices.push( a, c, d );

					}

				}
				iPoint1 += indiceNextLine;

			}

			//

			geometry.setIndex( indices );

			optionsSurface.vertices.forEach( function ( line ) {

				line.forEach( function ( point ) {

					vertices.push( point.x, point.y, point.z );

				} );

			} );

			geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
			mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( {

				color: 0x156289,
				transparent: true,
				opacity: 0.8,
				emissive: 0x072534,
				side: THREE.DoubleSide,
				flatShading: true

			} ) );
			function moveSurfaceLine( line, linePositionIndex ) {

				linePositionIndex = linePositionIndex || 0;
				var linePositionArray = line.geometry.attributes.position.array,
					meshPositionIndex = linePositionIndex,
					positionDiff = new Vector3  ();

				positionDiff.x = ( line.position.x - mesh.position.x ) / mesh.scale.x;
				positionDiff.y = ( line.position.y - mesh.position.y ) / mesh.scale.y;
				positionDiff.z = ( line.position.z - mesh.position.z ) / mesh.scale.z;

				for ( var i = 0; i < line.userData.points.userData.index; i++ )
					meshPositionIndex += optionsSurface.vertices[i].length * 3;
				var meshPositionArray = mesh.geometry.attributes.position.array;

				while ( linePositionIndex < linePositionArray.length ) {

					meshPositionArray[meshPositionIndex] = linePositionArray[linePositionIndex] + positionDiff.x;
					meshPositionIndex++;
					linePositionIndex++;
					meshPositionArray[meshPositionIndex] = linePositionArray[linePositionIndex] + positionDiff.y;
					meshPositionIndex++;
					linePositionIndex++;
					meshPositionArray[meshPositionIndex] = linePositionArray[linePositionIndex] + positionDiff.z;
					meshPositionIndex++;
					linePositionIndex++;

				}

				mesh.geometry.attributes.position.needsUpdate = true;

			}
			mesh.userData.setPoints = function ( pointId, line ) {

				moveSurfaceLine( line, pointId * 3 );

			}
			mesh.userData.setPosition = function ( position, line ) {

				moveSurfaceLine( line );
				if ( optionsSurface.setPosition !== undefined )
					optionsSurface.setPosition( position );

			}
			scaleObject.object3D( mesh );
			group.add( mesh );

			// light

			pointLight.controls( group, optionsSurface.folder );

		}
		surfaceMesh();

		optionsSurface.object4D = false;
		new object4D( {

			add: function ( vertices, group, onChangePoint, index, color, optionsAdd ) {

				var points = mathBox.addPoints( {

					vertices: vertices,
					groupParent: group,
					onChangePoint: onChangePoint,
					index: index,
					color: optionsSurface.color,

				} );
				mathBox.line( {

					points: points,
					owner: mesh,
					color: optionsSurface.color,

				} );
				mesh.userData.play = optionsAdd.play;
				return points;

			},
			selectObject3D: lang.selectLine3D,
			onChangeSelectObject3D: function ( value ) {

				removeChildrenGroup( group.parent.parent );
				return false;

			},
			name: 'surface',//for debugging

		}, vertices, optionsSurface );
		return mesh;

	}
	//displaying 3d function
	//optionsFunction3D
	//{
	//	functions: formulas for calculating of curve points positions
	//	{
	//		x: formula for calculating of the x coordinate of the curve points positions. Default formula is '((t+10)/10-1)*a+b'
	//		y: formula for calculating of the y coordinate of the curve points positions. Default formula is '((t+10)/10-1)*a+b'
	//		z: formula for calculating of the z coordinate of the curve points positions. Default formula is '((t+10)/10-1)*a+b'
	//	}
	//	limits: minimum and maximum values of x and z axes
	//	{
	//		x: minimum and maximum values of x axis
	//		{
	//			min: minimum value of x axis. Default is options.scales.x.min
	//			max: maximum value of x axis. Default is options.scales.x.max
	//		}
	//		z: minimum and maximum values of z axis
	//		{
	//			min: minimum value of z axis. Default is options.scales.z.min
	//			max: maximum value of z axis. Default is options.scales.z.max
	//		}
	//	}
	//	points: two dimensional array of y axis values.
	//		First dimention is y array for z axis
	//		Second dimention is y array for x axis
	//		For example
	//			points = [
	//				[-1, 0, 1, 2],
	//				[0, 0, -4, 0],
	//				[1, 1, 1, 1],
	//			]
	//		y value for z = 1 and z = 2 is points[1][2] = -4
	//		Default points is [
	//				[0, 0],
	//				[0, 0],
	//			]
	//	groupParent: THREE.Group parent group for adding of the group of the 3d Matrix. Default is scene
	//	folder: gui folder. Default is undefined - no user gui
	//	light: THREE.PointLight object. Default is undefined - no light
	//}
	this.function3D = function ( optionsFunction3D ) {

		optionsFunction3D = optionsFunction3D || {};
		console.log( 'THREE.MathBox.function3D' );

	};

	//A light that gets emitted from a single point in all directions.
	function pointLight() {

		var strLight = 'mathBoxLight',
			light = scene.getObjectByName( strLight ),
			position = new Vector3  ( 0.5 * options.scale, 0.5 * options.scale, 0.5 * options.scale );

		function isLight() {

			return light !== undefined;

		}
		this.add = function () {

			if ( ! isLight() ) {

				light = new THREE.PointLight( 0xffffff, 1 );
				light.position.copy( position );
				light.name = strLight;
				scene.add( light );

			}// else console.error( 'duplicate ' + strLight );
			return light;

		};
		this.remove = function () {

			if ( light == undefined )
				return;
			scene.remove( light );
			//delete light;//Parsing error: Deleting local variable in strict mode
			light = undefined;

		};
		this.controls = function ( group, folder ) {

			if ( folder === undefined )
				return;

			var fLight = folder.addFolder( lang.light ),
				lightSource;

			//displayLight
			dat.controllerNameAndTitle( fLight.add( { display: false }, 'display' ).onChange( function ( value ) {

				if ( value ) {

					lightSource = getPoints( [ light.position ] );
					group.add( lightSource );

				} else {

					group.remove( lightSource );
					//delete lightSource;//Parsing error: Deleting local variable in strict mode
					lightSource = undefined;

				}

			} ), lang.displayLight, lang.displayLightTitle );

			//move light
			var min = - 2 * options.scale, max = 2 * options.scale,
				controllers = {};
			function guiLightAxis( axesId ) {

				var axesPosition = getAxesPosition( axesId ),
					axesName = mathBox.axesEnum.getName( axesId );
				controllers[ axesId ] = fLight.add( light.position, axesName, min, max )
					.onChange( function ( value ) {

						if ( lightSource === undefined )
							return;

						lightSource.geometry.attributes.position.array[ axesId ] = value;
						lightSource.geometry.attributes.position.needsUpdate = true;

					} );
				dat.controllerNameAndTitle( controllers[ axesId ], options.scales[ axesName ].name );

			}
			guiLightAxis( mathBox.axesEnum.x );
			guiLightAxis( mathBox.axesEnum.y );
			guiLightAxis( mathBox.axesEnum.z );

			var restore = {

				restore: function () {

					controllers[ mathBox.axesEnum.x ].setValue( position.x );
					controllers[ mathBox.axesEnum.y ].setValue( position.y );
					controllers[ mathBox.axesEnum.z ].setValue( position.z );

				}
			};
			dat.controllerNameAndTitle( fLight.add( restore, 'restore' ), lang.restore, lang.restoreLightTitle );

		};
		return this;

	};
	var pointLight = new pointLight();

	function controller4DObjectPlayer() {

		function play() {

			//white color of selected object3D and hide others
			var selectObject3DIndex = parseInt( object4D.controllerSelectObject3D.getValue() );
			if ( selectObject3DIndex === -1 ) {

				selectObject3DIndex = 0;
				object4D.controllerSelectObject3D.setValue( selectObject3DIndex );

			}
			objects3D.forEach( function ( objects3DItem ) {

				var colorWhite = new Color( 0xffffff );
				if ( objects3DItem.object4D !== undefined ) {

					objects3DItem.object4D.eachObject3D( function ( objects3DItem ) {

						setColor( objects3DItem );

					} );
					return;

				}
				function setColor( objects3DItem ) {
					if ( !objects3DItem.material.color.equals( colorWhite ) ) {

						var owner = objects3DItem.userData.owner;
						while ( owner ) {

							owner.userData.color = owner.material.color;
							owner = owner.userData.owner;

						}
						objects3DItem.userData.color = objects3DItem.material.color;

					}
					if ( selectObject3DIndex === objects3DItem.userData.index ) {

						var owner = objects3DItem.userData.owner;
						while ( owner ) {

							owner.material.color = colorWhite;
							owner.visible = true;
							owner = owner.userData.owner;

						}
						objects3DItem.material.color = colorWhite;
						objects3DItem.visible = true;
						if ( objects3DItem.userData.play !== undefined )
							objects3DItem.userData.play( true, colorWhite );

					} else {

						var owner = objects3DItem.userData.owner;
						while ( owner ) {

							owner.visible = false;
							owner = owner.userData.owner;

						}
						objects3DItem.visible = false;//hide object3D
						if ( objects3DItem.userData.play !== undefined )
							objects3DItem.userData.play( false );

					}

				}
				setColor( objects3DItem );

			} );
			buttons.buttonPlay.innerHTML = pauseSymbol;
			buttons.buttonPlay.title = lang.pause4D;

		}
		function pause() {

			//display bold line
//			boldLine.visible( true );
			objects3D.forEach( function ( objects3DItem ) {

				//restore color
				if ( objects3DItem.object4D !== undefined ) {

					if ( objects3DItem.object4D.boldLine !== undefined )
						objects3DItem.object4D.boldLine.remove();
					objects3DItem.object4D.eachObject3D( function ( objects3DItem ) {

						restoreColor( objects3DItem );

					} );
					return;

				}
				function restoreColor( objects3DItem ) {

					var owner = objects3DItem.userData.owner;
					while ( owner ) {

						owner.material.color = owner.userData.color;
						owner.visible = true;
						owner = owner.userData.owner;

					}
					objects3DItem.material.color = objects3DItem.userData.color;

					objects3DItem.visible = true;
					if ( objects3DItem.userData.play !== undefined )
						objects3DItem.userData.play( true );

				}
				restoreColor( objects3DItem );

			} );
			buttons.buttonPlay.innerHTML = playSymbol;
			buttons.buttonPlay.title = lang.play4D;

			clearInterval( timerId );
			timerId = undefined;

			object4D.controllerSelectObject3D.setValue( object4D.controllerSelectObject3D.initialValue );

		}
		function isRepeat() {

			return buttons.buttonRepeat.title !== lang.repeatOn;

		}
		function playNext() {

			var selectObject3DIndex = parseInt( object4D.controllerSelectObject3D.getValue() );
			selectObject3DIndex++;
			if ( selectObject3DIndex >= vertices.length ) {

				if ( isRepeat() )
					selectObject3DIndex = 0;
				else {

					pause();
					return;

				}

			}
			object4D.controllerSelectObject3D.setValue( selectObject3DIndex );
			play();

		}
/*
		if ( group !== undefined )
			group.userData.timerId;
*/
		var timerId,
//			customController,
			playSymbol = '►', pauseSymbol = '❚❚',
			buttons = {},
//			buttonPlay, buttonRepeat, buttonPrev, buttonNext,
			controllerPlayRate,
			object4D, vertices, objects3D;
		this.create = function ( folder, object4Dcur, verticesCur, objects3DCur ) {

			if ( controllerPlayRate !== undefined ) {

				console.error( 'Duplicate controller4DObjectPlayer' );

			}
			object4D = object4Dcur;
			vertices = verticesCur;
			objects3D = objects3DCur;

			controllerPlayRate = folder.add( new dat.controllers.CustomController( {

				playRate: 1,
				property: function () {
/*
					controllerPlay( buttons1 );
					return buttons1;
*/
//					customController = controller;

					function addButton( innerHTML, title, onclick ) {

						var button = document.createElement( 'span' );
						button.innerHTML = innerHTML;
						button.title = title;
						button.style.cursor = 'pointer';
						button.style.margin = '0px 2px';
						button.onclick = onclick;
//						customController.domElement.appendChild( button );
						return button;

					}

					//Go to previous object 3D button
					buttons.buttonPrev = addButton( '←', lang.prevObject3D, function ( value ) {

						var selectObject3DIndex = parseInt( object4D.controllerSelectObject3D.getValue() );
						if ( selectObject3DIndex === -1 )
							selectObject3DIndex = vertices.length;
						selectObject3DIndex--;
						if ( selectObject3DIndex < 0 )
							selectObject3DIndex = vertices.length - 1;
						object4D.controllerSelectObject3D.setValue( selectObject3DIndex );

					} );
					//Play/Pause button
					buttons.buttonPlay = addButton( playSymbol, lang.play4D, function ( value ) {

						if ( buttons.buttonPlay.innerHTML === playSymbol ) {

							timerId = -1;
							play();
							timerId = setInterval( playNext, 1000 / controllerPlayRate.getValue() );

						} else pause();

					} );
					//Go to next object 3D button
					buttons.buttonNext = addButton( '→', lang.nextObject3D, function ( value ) {

						var selectObject3DIndex = parseInt( object4D.controllerSelectObject3D.getValue() );
						if ( selectObject3DIndex === -1 )
							selectObject3DIndex = 0;
						else selectObject3DIndex++;
						if ( selectObject3DIndex >= vertices.length )
							selectObject3DIndex = 0;
						object4D.controllerSelectObject3D.setValue( selectObject3DIndex );

					} );
					//Repeat button
					var colorGray = 'rgb(200,200,200)';
					buttons.buttonRepeat = addButton( '⥀', lang.repeatOn, function ( value ) {

						if ( buttons.buttonRepeat.title === lang.repeatOn ) {

							buttons.buttonRepeat.title = lang.repeatOff;//'Turn repeat off',
							buttons.buttonRepeat.style.color = 'rgb(255,255,255)';

						} else {

							buttons.buttonRepeat.title = lang.repeatOn;//'Turn repeat on'
							buttons.buttonRepeat.style.color = colorGray;

						}

					} );
					buttons.buttonRepeat.style.color = colorGray;
					return buttons;

				},

			}, 'playRate', 1, 25, 1 ) ).onChange( function ( value ) {

				if ( timerId === undefined )
					return;
				clearInterval( timerId );
				timerId = setInterval( playNext, 1000 / controllerPlayRate.getValue() );

			} );
			controllerPlayRate.domElement.title = lang.playRateTitle;

		}
		this.remove = function ( folder, object4Dcur, verticesCur, objects3DCur ) {

			clearInterval( timerId );
			if ( controllerPlayRate !== undefined ) {

				controllerPlayRate.remove();
				controllerPlayRate = undefined;

			}

		}

	}
	controller4DObjectPlayer = new controller4DObjectPlayer();

	function object4D( object3D, vertices, options4D ) {

		var object4Dcur = this;

		if ( object3D.name !== undefined )
			this.name = object3D.name;//for debugging

		this.selectObject = function ( index, index2 ) {

			if ( options4D.owner !== undefined ) {

				options4D.owner.selectObject( index2, options4D.index );
				return;

			}
			this.controllerSelectObject3D.setValue( index2 );


		}

		options4D = options4D || {};
		var group;
		if ( options4D.groupParent !== undefined ) {

			group = new Group();
			group.userData.remove = function () {

				if ( object4Dcur.boldLine !== undefined )
					object4Dcur.boldLine.remove();
				if ( object4Dcur.controllerSelectObject3D !== undefined ) {

					object4Dcur.controllerSelectObject3D = undefined;

				}

			}
			var groupParent = options4D.groupParent || scene;
			groupParent.add( group );

		}

		var objects3D = [];

		function redrawLine() {

			object4Dcur.boldLine.setPositions( objects3D[
				parseInt( object4Dcur.controllerSelectObject3D === undefined ? object4Dcur.getIndex() : object4Dcur.controllerSelectObject3D.getValue() )
			].geometry.attributes.position.array );

		}

		var onChangePoint = {

			onChangeX: function ( value ) {

				redrawLine();

			},
			onChangeY: function ( value ) {

				redrawLine();

			},
			onChangeZ: function ( value ) {

				redrawLine();

			},

		};
		for ( var i = 0; i < vertices.length; i++ ) {

			function setPosition( position ) {

				if ( object4Dcur.boldLine !== undefined )
					object4Dcur.boldLine.setPosition( position );
				if ( ( this.owner !== undefined ) && ( this.owner.userData !== undefined ) )
					this.owner.userData.setPosition( position );

			}
			var objects3DItem = object3D.add( vertices[i], group, onChangePoint, i, itemColor( i, vertices.length, options4D.object4D === false ), {

				owner: this,
				setPosition: setPosition,
				play: function ( visible, color ) {

					//playing of 4D object

					//visibility and color of each 3D object
					objects3D.forEach( function ( objects3DItem ) {

						if ( objects3DItem.userData.color === undefined ) {

							objects3DItem.userData.color = objects3DItem.material.color;
							var owner = objects3DItem.userData.owner;
							while ( owner ) {

								if ( owner.userData.color === undefined )
									owner.userData.color = owner.material.color;
								owner = owner.userData.owner;

							}

						}
						if ( color !== undefined ) {

							objects3DItem.material.color = color;
							var owner = objects3DItem.userData.owner;
							while ( owner ) {

								owner.material.color = color;
								owner = owner.userData.owner;

							}

						}
						else if ( visible ) {

							objects3DItem.material.color = objects3DItem.userData.color;
							var owner = objects3DItem.userData.owner;
							while ( owner ) {

								owner.material.color = owner.userData.color;
								owner = owner.userData.owner;

							}

						}
						objects3DItem.visible = visible;
						var owner = objects3DItem.userData.owner;
						while ( owner ) {

							owner.visible = visible;
							owner = owner.userData.owner;

						}

					} );

				}

			} );
			objects3DItem.userData.index = i;
			objects3DItem.userData.onDocumentMouseDown = function (i) {

				if ( object4Dcur.controllerSelectObject3D === undefined )
					object4Dcur.onDocumentMouseDown( i );
//				if ( parseInt( object4Dcur.controllerSelectObject3D.getValue() ) !== i )
				if ( ( object4Dcur.controllerSelectObject3D !== undefined ) && ( parseInt( object4Dcur.controllerSelectObject3D.getValue() ) !== i ) ) {

					object4Dcur.controllerSelectObject3D.setValue( i );

				}

			};
			if ( objects3DItem.userData.setPosition === undefined )
				objects3DItem.userData.setPosition = setPosition;
			objects3D.push( objects3DItem );

		}

		var folder = options4D.folder;

		function object4DSettings( folder, guiSelectObject3D ) {

			object4Dcur.controllerSelectObject3D = guiSelectObject3D.add( folder, vertices, object4Dcur,
				object3D.selectObject3D === undefined ? lang.selectObject3D : object3D.selectObject3D );
			return object4Dcur.controllerSelectObject3D;

		}
		this.setOwner = function ( owner, index ) {

			options4D.owner = owner;
			options4D.index = index;

		}
		this.getIndex = function () {

			return index;

		}
		this.onDocumentMouseDown = function ( object3DIndex ) {

			if ( options4D.owner.selectObject !== undefined)
				options4D.owner.selectObject( object3DIndex, options4D.index );
			else options4D.owner.controllerSelectObject3D.setValue( options4D.index );

		}
		this.eachObject3D = function ( callBack ) {

			objects3D.forEach( function ( object3D ) {

				callBack( object3D );

			} );

		}
		this.guiSelectObject = function ( object, folder ) {

			object.controllerSelectObject3D = new guiSelect3DObject().add( folder, vertices, this,
				options4D.selectObject3D === undefined ? lang.selectPoints3D : options4D.selectObject3D );
			object.controllerSelectObject3D.setValue( index );

		}
		var index;
		this.onChangeSelectObject3D = function ( value, optionsSelect ) {

			optionsSelect = optionsSelect || {};
			folder = folder || optionsSelect.folder;
			optionsSelect.createGui = optionsSelect.createGui === false ? false : true;
			if ( optionsSelect.createGui === false )
				folder = undefined;

			index = value;

			if ( object3D.onChangeSelectObject3D !== undefined ) {

				if ( object3D.onChangeSelectObject3D( value, folder ) !== false )
					return;


			}

			if ( !isObject3dSelected( value, folder ) ) {

				if ( this.boldLine !== undefined )
					this.boldLine.remove();
				return;

			}


			if ( group.children.length <= value ) {

				this.boldLine.remove();
				return;

			}

			var points = group.children[value].getObjectByProperty( 'type', "Points" );

			myRaycaster.setPositionDif( points );

			//select point gui
			var verticesPoints = vertices[value];
			points.userData.guiPoint( verticesPoints, folder, {

				onChangeX: onChangePoint.onChangeX,
				onChangeY: onChangePoint.onChangeY,
				onChangeZ: onChangePoint.onChangeZ,

			} );

			var optionsBoldLine = {

				color: new Color( 1, 0, 1 ),

			}
			if ( this.boldLine === undefined )
				this.boldLine = new boldLineProc();
			this.boldLine.create( objects3D[value], optionsBoldLine );

			if ( folder === undefined )
				return;

			//position gui
			var fPosition = folder.__folders[lang.position];
			if ( fPosition !== undefined ) {

				var position = scaleObject.getRealPosition( points );
				fPosition.__controllers[0].setValue( position.x );
				fPosition.__controllers[1].setValue( position.y );
				fPosition.__controllers[2].setValue( position.z );

			}

		}
		if ( options4D.folder === undefined ) {

			if ( group !== undefined )
				group.userData.object4DSettings = object4DSettings;
			return;

		}


		//4D object Settings

		function isObject3dSelected( value, folder ) {

			if ( value !== -1 )
				return true;

			//no select


			myRaycaster.positionDif.set( 0, 0, 0 );

			if ( object3D.onChangeSelectObject3D !== undefined )
				object3D.onChangeSelectObject3D( value );

			if ( folder === undefined )
				return;

			//remove Select Point controller
			folder.__controllers.forEach( function ( controller ) {

				if ( controller.property === "point" ) {

					folder.remove( controller );
					return;

				}

			} );

			//remove Position folder
			var fPosition = folder.__folders[lang.position];
			if ( fPosition !== undefined )
				folder.removeFolder( fPosition );

			//remove previous dotted lines
			dotLines.remove();

			//remove Point folder
			if ( folder.__folders[lang.point] !== undefined )
				folder.removeFolder( folder.__folders[lang.point] );

			guiSelectPoint.remove();

			return false ;

		}
		var guiSelectObject = new guiSelect3DObject();
		this.controllerSelectObject3D = guiSelectObject.add( folder, vertices, this,
				object3D.selectObject3D === undefined ? lang.selectObject3D : object3D.selectObject3D );

		elSelectColor( this.controllerSelectObject3D, options4D.object4D === false );

		//playing of 4D object
		if ( options4D.object4D !== false ) {

			controller4DObjectPlayer.create( folder, object4Dcur, vertices, objects3D );

		}
		this.remove = function () {

			console.warn( 'object4D.remove' );

		}

	}
	//displaying of 4D points
	//vertices: Vertices of array of points. It is two dimensional array of Vector3  .
	//	First dimention is array of Vector3   vertices of points
	//	Second dimention is array of Vector3   vertices of each points
	//	For example 4D points have three 3D points. Each 3D points have four vertices
	//		vertices: [

	//			[
	//				new Vector3  ( -10, -3, -102 ),
	//				new Vector3  ( -5, 0, -102 ),
	//				new Vector3  ( 5, 1, -102 ),
	//				new Vector3  ( 10, -2, -102 )
	//			],
	//			[
	//				new Vector3  ( -10, 1, -104 ),
	//				new Vector3  ( -5, 0, -104 ),
	//				new Vector3  ( 5, -1, -104 ),
	//				new Vector3  ( 10, -2, -104 )
	//			],
	//			[
	//				new Vector3  ( -10, -2, -108 ),
	//				new Vector3  ( -5, -1, -108 ),
	//				new Vector3  ( 5, 0, -108 ),
	//				new Vector3  ( 10, 1, -108 )
	//			],

	//		]
	//
	//optionsPoints4D:
	//{
	//	groupParent: THREE.Group parent group for adding of the group of the 4D points. Default is scene.
	//	folder: gui folder. Default is undefined - no user gui
	//}
	this.points4D = function ( vertices, optionsPoints4D ) {

		this.object4D = new object4D( {

			add: function ( vertices, group, onChangePoint, index, color ) {

				return mathBox.addPoints( {

					vertices: vertices,
					groupParent: group,
					onChangePoint: onChangePoint,
					index: index,
					color: color,

				} );

			},
			selectObject3D: lang.selectPoints3D,
			name: 'points4D',//for debugging

		}, vertices, optionsPoints4D );
		this.objects3DCount = function () {

			return vertices.length;

		}
		this.getName = function () {

			return lang.ocject3DNames.points;

		}

	}
	//displaying of 4D lines
	//vertices: Vertices of array of lines. It is two dimensional array of Vector3  .
	//	First dimention is array of Vector3   vertices of lines
	//	Second dimention is array of Vector3   vertices of each line
	//	For example 4D lines have three 3D lines. Each 3D line have four vertices
	//		vertices: [

	//			[
	//				new Vector3  ( -10, -3, -102 ),
	//				new Vector3  ( -5, 0, -102 ),
	//				new Vector3  ( 5, 1, -102 ),
	//				new Vector3  ( 10, -2, -102 )
	//			],
	//			[
	//				new Vector3  ( -10, 1, -104 ),
	//				new Vector3  ( -5, 0, -104 ),
	//				new Vector3  ( 5, -1, -104 ),
	//				new Vector3  ( 10, -2, -104 )
	//			],
	//			[
	//				new Vector3  ( -10, -2, -108 ),
	//				new Vector3  ( -5, -1, -108 ),
	//				new Vector3  ( 5, 0, -108 ),
	//				new Vector3  ( 10, 1, -108 )
	//			],

	//		]
	//
	//optionsLines4D:
	//{
	//	groupParent: THREE.Group parent group for adding of the group of the 4D lines. Default is scene.
	//	folder: gui folder. Default is undefined - no user gui
	//}
	this.lines4D = function ( vertices, optionsLines4D ) {

		this.object4D = new object4D( {

			add: function ( vertices, group, onChangePoint, index, color ) {

				var points = mathBox.addPoints( {

					vertices: vertices,
					groupParent: group,
					onChangePoint: onChangePoint,
					index: index,
					color: color,

				} );
				mathBox.line( {

					points: points,
					color: color,

				} );
				return points;

			},
			selectObject3D: lang.selectLine3D,
			name: 'lines4D',//for debugging

		}, vertices, optionsLines4D );
		this.objects3DCount = function () {

			return vertices.length;

		}
		this.getName = function () {

			return lang.ocject3DNames.line;

		}

	}
	//displaying of 4D surfaces
	//vertices: Vertices of array of surfaces. It is two dimensional array of Vector3  .
	//	First dimention is array of Vector3   vertices of lines
	//	Second dimention is array of Vector3   vertices of each line
	//	For example 4D surfaces have three 3D surfaces. Each 3D surface have four vertices
	//		vertices: [

	//			[
	//				new Vector3  ( -10, -3, -102 ),
	//				new Vector3  ( -5, 0, -102 ),
	//				new Vector3  ( 5, 1, -102 ),
	//				new Vector3  ( 10, -2, -102 )
	//			],
	//			[
	//				new Vector3  ( -10, 1, -104 ),
	//				new Vector3  ( -5, 0, -104 ),
	//				new Vector3  ( 5, -1, -104 ),
	//				new Vector3  ( 10, -2, -104 )
	//			],
	//			[
	//				new Vector3  ( -10, -2, -108 ),
	//				new Vector3  ( -5, -1, -108 ),
	//				new Vector3  ( 5, 0, -108 ),
	//				new Vector3  ( 10, 1, -108 )
	//			],

	//		]
	//
	//optionsSurfaces4D:
	//{
	//	groupParent: THREE.Group parent group for adding of the group of the 4D surfaces. Default is scene.
	//	folder: gui folder. Default is undefined - no user gui
	//}
	this.surfaces4D = function ( vertices, optionsSurfaces4D ) {

		var group = optionsSurfaces4D.groupParent || scene,
			groupSurfaces4D = new Group(),
			selectedObject3D,
			guiSelectLine = new guiSelect3DObject(),
			surfaces4D = this;
		group.add( groupSurfaces4D );
		optionsSurfaces4D.groupParent = undefined;
		optionsSurfaces4D.selectObject3D = lang.selectSurface3D;

		this.object4D = new object4D( {

			add: function ( vertices, group, onChangePoint, index, color, optionsAdd ) {

				var group = new Group();;
				group.userData.onChangeSelectObject3D = function ( groupSurfaces4D, indexSelected, folder ) {

					if ( indexSelected !== index )
						return false;

					selectedObject3D = group.children[1];
					if ( folder === undefined )
						folder = optionsSurfaces4D.folder;
					if ( folder !== undefined )
						selectedObject3D.userData.object4DSettings( folder, guiSelectLine );

					//Visibility of surfaces
					groupSurfaces4D.children.forEach( function ( groupItem ) {

						groupItem.children[0]//surface, points and lines
							.children[0]//surface
							.material.visible = groupItem.uuid === group.uuid ? true: false;

					} );
					return true;

				}
				groupSurfaces4D.add( group );

				return mathBox.surface( {

					vertices: vertices,
					groupParent: group,
					index: index,
					color: color,
					setPosition: optionsAdd.setPosition,
					owner: optionsAdd.owner,

				} );

			},
			selectObject3D: lang.selectSurface3D,
			onChangeSelectObject3D: function ( value, folder )
				{

				for ( var i = 0; i < groupSurfaces4D.children.length; i++ ) {

					var groupSelected = groupSurfaces4D.children[i];
					if ( ( groupSelected.userData.onChangeSelectObject3D !== undefined ) &&
							groupSelected.userData.onChangeSelectObject3D( groupSurfaces4D, value, folder ) ) {

						return;

					}

				}

				//No selected any Object3D

				//Visibility of surfaces
				groupSurfaces4D.children.forEach( function ( groupItem ) {

					groupItem.children[0]//surface, points and lines
						.children[0]//surface
						.material.visible = true;

				} );

				guiSelectLine.remove();
				surfaces4D.remove();

			},
			name: 'surfaces4D',//for debugging

		}, vertices, optionsSurfaces4D );
		this.remove = function () {

			selectedObject3D.userData.remove();

		}
		this.objects3DCount = function () {

			return vertices.length;

		}
		this.getName = function () {

			return lang.ocject3DNames.surface;//'surface'

		}
		pointLight.controls( groupSurfaces4D, optionsSurfaces4D.folder );

	}
	//displaying of 4D objects
	//objects3D: array of 3D objects.
	//	For example 4D object have one 4D points and one 4D lines
	//		objects3D: [

	//			new mathBox.points4D( [

	//				//points 1
	//				[
	//					new Vector3  ( 8, 1 - y, -102 ),
	//					new Vector3  ( 5, -3 - y, -106 ),
	//					new Vector3  ( -6, 0 - y, -101 ),
	//				],
	//				//points 2
	//				[
	//					new Vector3  ( 9, 1.1 - y, -103 ),
	//					new Vector3  ( 6, -3.1 - y, -107 ),
	//					new Vector3  ( -7, 0.1 - y, -102 ),
	//				],
	//				//points 3
	//				[
	//					new Vector3  ( 10, 1.2 - y, -104 ),
	//					new Vector3  ( 7, -3.2 - y, -108 ),
	//					new Vector3  ( -8, 0.2 - y, -103 ),
	//				],

	//			],
	//			{

	//				groupParent: groupExample,

	//			} ),
	//			new mathBox.lines4D( [

	//				//line 1
	//				[
	//					new Vector3  ( 8, 1, -102 ),
	//					new Vector3  ( 5, -3, -106 ),
	//					new Vector3  ( -6, 0, -101 ),
	//				],
	//				//line 2
	//				[
	//					new Vector3  ( 9, 1.1, -103 ),
	//					new Vector3  ( 6, -3.1, -107 ),
	//					new Vector3  ( -7, 0.1, -102 ),
	//				],
	//				//line 3
	//				[
	//					new Vector3  ( 10, 1.2, -104 ),
	//					new Vector3  ( 7, -3.2, -108 ),
	//					new Vector3  ( -8, 0.2, -103 ),
	//				],
	//			],
	//			{

	//				groupParent: groupExample,

	//			} ),

	//		]
	//
	//optionsObjects4D:
	//{
	//	groupParent: THREE.Group parent group for adding of the group of the 4D objects. Default is scene.
	//	folder: gui folder. Default is undefined - no user gui
	//}
	this.objects4D = function ( objects3D, optionsObjects4D ) {

		function objects4D() {

			var groupObjects4D = optionsObjects4D.groupParent || scene,
				selectedObject3D,
				folder = optionsObjects4D.folder,
				guiSelectObject3D = new guiSelect3DObject(),
				object4D = this;

			if ( folder === undefined )
				return;//no user gui

			function controllerSelect3DObject() {

				var controller, controllerSelectObject3D = {

					controllerSelectObject3D: null

				};

				this.add = function () {

					if ( controller === undefined ) {

						var object3DsIndexes = {};
						for ( var i = 0; i < objects3D.length; i++ )
							object3DsIndexes[i + 1 + ' ' + objects3D[i].getName()] = i;
						object3DsIndexes[lang.noSelectObject3D] = -1;

						controller = folder.add( { Object3D: -1 }, 'Object3D', object3DsIndexes )
						.onChange( function ( value ) {

							if ( controllerSelectObject3D.controllerSelectObject3D !== null ) {

								controllerSelectObject3D.controllerSelectObject3D.setValue( -1 );
								controllerSelectObject3D.controllerSelectObject3D.remove();
								controllerSelectObject3D.controllerSelectObject3D = null;

								//restore bold lines
								changeSelectObject3D( parseInt( object4D.controllerSelectObject3D.getValue() ), false );

							}

							var object3D = objects3D[parseInt( value )];
							if ( object3D === undefined )
								return;
							object3D.object4D.guiSelectObject( controllerSelectObject3D, folder );
						} );
						dat.controllerNameAndTitle( controller, lang.selectObject3D );

					}

				}
				this.remove = function () {

					if ( controller === undefined )
						return;
					controller.setValue( controller.initialValue );
					controller.remove();
					controller = undefined;

				}
				this.setValue = function ( value ) {

					if ( controller.getValue() !== value )
						controller.setValue( value );

				}

			}
			var controllerSelectObject3D = new controllerSelect3DObject();

			function changeSelectObject3D( value, createGui ) {

				objects3D.forEach( function ( object3D ) {

					object3D.object4D.onChangeSelectObject3D( value, {

						createGui: createGui,

					} );

				} );

			}

			this.onChangeSelectObject3D = function ( value ) {

				controllerSelectObject3D.remove();
				if ( value !== -1 )
					controllerSelectObject3D.add();
				changeSelectObject3D( value );

			}

			var objects3DCount = 0;
			for ( var i = 0; i < objects3D.length; i++ ) {

				var object3D = objects3D[ i ];
				object3D.object4D.setOwner( this, i );
				var objects3DCountCur = object3D.objects3DCount();
				if ( objects3DCount < objects3DCountCur )
					objects3DCount = objects3DCountCur;

			}
			var arrayObjects3DCount = [];
			for ( var i = 0; i < objects3DCount; i++ )
				arrayObjects3DCount.push( i );

			this.selectObject = function ( index, index2 ) {

				this.controllerSelectObject3D.setValue( index );
				controllerSelectObject3D.setValue( index2 );

			}

			this.controllerSelectObject3D = guiSelectObject3D.add( folder, arrayObjects3DCount, this, lang.selectObjects3D );
			elSelectColor( this.controllerSelectObject3D );

			//playing of 4D object
			controller4DObjectPlayer.create( folder, this, arrayObjects3DCount, objects3D );

			pointLight.controls( groupObjects4D, optionsObjects4D.folder );
		}
		new boldLineProc().load( function () {

			new objects4D();

		} );

	}
	function itemColor( i, length, no4Dobject ) {

		if (
				( i === -1 )//no select
				|| no4Dobject
			) {

			return 'rgb(255,255,255)';

		}
		length--;
		var scale = 255,
			percent = ( i * scale ) / length,
			r = parseInt( percent > scale / 2 ? 0 : scale - percent * 2 ),
			g = parseInt( percent > scale / 2 ? ( scale - percent ) * 2 : percent * 2 ),
			b = parseInt( percent < scale / 2 ? 0 : ( percent - scale / 2 ) * 2 );
		return 'rgb(' + r + ',' + g + ',' + b + ')'

	}
	function elSelectColor( controllerSelect, no4Dobject ) {

		var elSelect = controllerSelect.domElement.querySelector( 'select' );
		for ( var i = 0; i < elSelect.length - 1; i++ )
			elSelect[i].style.backgroundColor = itemColor( i, elSelect.length - 1, no4Dobject );

	}

};

if ( typeof dat !== 'undefined' ) {

	//dat.GUI is included into current project
	//See https://github.com/dataarts/dat.gui/blob/master/API.md about dat.GUI API.

	if ( dat.getControllerByProperty === undefined ) {

		dat.getControllerByProperty = function ( folder, property ) {

			for ( var i = 0; i < folder.__controllers.length; i ++ ) {

				if ( folder.__controllers[ i ].property === property )
					return folder.__controllers[ i ];

			}

		};

	} else console.error( 'Duplicate dat.getControllerByProperty method.' );

	if ( dat.getControllerByName === undefined ) {

		dat.getControllerByName = function ( folder, name ) {

			for ( var i = 0; i < folder.__controllers.length; i ++ ) {

				if ( folder.__controllers[ i ].__li.querySelector( ".property-name" ).innerHTML === name )
					return folder.__controllers[ i ];

			}

		};

	} else console.error( 'Duplicate dat.getControllerByName method.' );

}
