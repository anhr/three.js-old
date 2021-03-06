/**
 * @author alteredq / http://alteredqualia.com/
 * @authod mrdoob / http://mrdoob.com/
 * @authod arodic / http://aleksandarrodic.com/
 * @authod fonserbc / http://fonserbc.github.io/
 * @authod anhr / https://github.com/anhr/
*/

import * as THREE from "../../../build/three.module.js";
import PositionController from '../../../../../commonNodeJS/master/PositionController.js';

import cookie from '../../../../../cookieNodeJS/master/cookie.js';
//import cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';

//Attenttion!!! Save this file as UTF-8 for localization.

//spatialMultiplex
//https://en.wikipedia.org/wiki/DVB_3D-TV
var spatialMultiplexsIndexs = {
	Mono: 0,
	SbS: 1, //https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side
	TaB: 2, //https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom
}

/**
 * @callback onFullScreen
 * @param {boolean} fullScreen true - go to full screen mode. false - restore from full screen mode.
 */

/**
 * StereoEffect
 * Uses dual PerspectiveCameras for Parallax Barrier https://en.wikipedia.org/wiki/Parallax_barrier effects
 * @param {Object} renderer THREE.WebGLRenderer
 * @param {Object} [options] the following options are available. Optional.
 * @param {Object} [options.spatialMultiplex] spatial multiplex
 * See https://en.wikipedia.org/wiki/DVB_3D-TV for details
 * 	Available values
 *
 * 		spatialMultiplexsIndexs.Mono - no stereo effacts
 *
 * 		spatialMultiplexsIndexs.SbS - 'Side by side' format just put the left and right images one next to the other.
 * 			See https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side for dretails
 *
 * 		spatialMultiplexsIndexs.TaB - 'Top and bottom' format put left and right images one above the other.
 * 			See //https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom for details
 *
 * 	Example - spatialMultiplex: spatialMultiplexsIndexs.Mono
 * 	Default is spatialMultiplexsIndexs.SbS
 * @param {Object} [options.camera] THREE.PerspectiveCamera. Use the camera key if you want control cameras focus.
 * @param {Object} [options.far] Camera frustum far plane. The far key uses for correct calculation default values of Eye separation. Default is 10.
 * @param {Object} [options.cookie] Your custom cookie function for saving and loading of the StereoEffects settings. Default cookie is not saving settings.
 * @param {cookie} [options.cookieName] Name of the cookie is "StereoEffect" + options.cookieName. Default is undefined.
 * @param {Object} [options.stereoAspect] THREE.StereoCamera.aspect. Camera frustum aspect ratio. Default is 0.5 for compatibility with previous version.
 * @param {boolean} [options.rememberSize] true - remember default size of the canvas. Default is undefined.
 * @param {onFullScreen} [options.onFullScreen] Full screen event
 * @param {HTMLElement} [options.elParent] parent of the canvas.
 *  Use only if you use THREE.Raycaster (working out what objects in the 3d space the mouse is over) https://threejs.org/docs/index.html#api/en/core/Raycaster
 *  and your canvas is not full screen.
 */
var StereoEffect = function ( renderer, options ) {

	var stereoEffect = 'StereoEffect' + ( options.cookieName || '' );

	options = options || {};
	this.options = options;

	options.stereo = new THREE.StereoCamera();
	options.stereo.aspect = options.stereoAspect || 0.5;
	if ( options.far === undefined )
		options.far = new PerspectiveCamera().focus;
	options.focus = options.camera === undefined ? new PerspectiveCamera().focus : new THREE.Vector3().distanceTo( options.camera.position );
	options.zeroParallax = 0;
	options.cookie = options.cookie || new cookie.defaultCookie();
	var optionsDefault = {

		spatialMultiplex: options.spatialMultiplex !== undefined ? options.spatialMultiplex : spatialMultiplexsIndexs.SbS, //Use default as 'Side by side' for compability with previous version of THREE.StereoEffect
		eyeSep: ( new THREE.StereoCamera().eyeSep / 10 ) * options.far,
		focus: options.focus,
		zeroParallax: 0,

	}
	options.cookie.getObject( stereoEffect, options, optionsDefault );
	if ( options.camera !== undefined )
		options.camera.focus = options.focus;

	this.setEyeSeparation = function ( eyeSep ) {

		options.stereo.eyeSep = eyeSep;

	};

	this.setEyeSeparation( options.eyeSep );

	this.setSize = function ( width, height ) {

		renderer.setSize( width, height );

	};

	this.getRendererSize = function () {

		var el = options.elParent || renderer.domElement,
			style = {

				position: el.style.position,
				left: el.style.left,
				top: el.style.top,
				width: el.style.width,
				height: el.style.height,

			},
			rect = el.getBoundingClientRect(),
			left = Math.round( rect.left ),
			top = Math.round( rect.top ),
			size = new THREE.Vector2();
		renderer.getSize( size );
		return {

			fullScreen: function () {

				var size = new THREE.Vector2();
				renderer.getSize( size );
				if ( ( size.x === window.innerWidth ) && ( size.y === window.innerHeight ) )
					return;
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.domElement.style.position = 'fixed';
				renderer.domElement.style.left = 0;
				renderer.domElement.style.top = 0;
				renderer.domElement.style.width = '100%';
				renderer.domElement.style.height = '100%';

				var camera = options.camera;
				camera.aspect = size.x / size.y;
				camera.updateProjectionMatrix();

			},
			restore: function () {

				var sizeCur = new THREE.Vector2();
				renderer.getSize( sizeCur );
				if ( ( sizeCur.x === size.x ) && ( sizeCur.y === size.y ) )
					return;
				renderer.setSize( size.x, size.y );
				renderer.domElement.style.position = style.position;
				renderer.domElement.style.left = style.left;
				renderer.domElement.style.top = style.top;
				renderer.domElement.style.width = style.width;
				renderer.domElement.style.height = style.height;

				camera.aspect = size.x / size.y;
				camera.updateProjectionMatrix();

			},
			getMousePosition: function( mouse, event ) {

				mouse.x = ( event.clientX / size.x ) * 2 - 1 - ( left / size.x ) * 2;
				mouse.y = - ( event.clientY / size.y ) * 2 + 1 + ( top / size.y ) * 2;

			},

		};

	};

	var rendererSizeDefault = options.rememberSize ? this.getRendererSize() : undefined,
		fullScreen = false;
	this.setFullScreen = function () {

		fullScreen = ! fullScreen;
		if ( fullScreen )
			rendererSizeDefault.fullScreen();
		else rendererSizeDefault.restore();

	}
	this.isFullScreen = function () {

		return fullScreen;

	}

	this.render = function ( scene, camera ) {

		scene.updateMatrixWorld();

		if ( camera.parent === null ) camera.updateMatrixWorld();

		var size = new THREE.Vector2();
		renderer.getSize( size );

		if ( renderer.autoClear ) renderer.clear();
		renderer.setScissorTest( true );

		var xL, yL, widthL, heightL,
			xR, yR, widthR, heightR,
			parallax = options.zeroParallax,
			spatialMultiplex = parseInt( options.spatialMultiplex );

		switch ( spatialMultiplex ) {

			case spatialMultiplexsIndexs.Mono://Mono

				if ( ! fullScreen && ( rendererSizeDefault !== undefined ) )
					rendererSizeDefault.restore();

				renderer.setScissor( 0, 0, size.width, size.height );
				renderer.setViewport( 0, 0, size.width, size.height );
				renderer.render( scene, camera );
				renderer.setScissorTest( false );
				return;

			case spatialMultiplexsIndexs.SbS://'Side by side'

				if ( rendererSizeDefault !== undefined )
					rendererSizeDefault.fullScreen();

				var _width = size.width / 2;

				xL = 0 + parallax;		yL = 0; widthL = _width; heightL = size.height;
				xR = _width - parallax;	yR = 0; widthR = _width; heightR = size.height;

				break;

			case spatialMultiplexsIndexs.TaB://'Top and bottom'

				if ( rendererSizeDefault !== undefined )
					rendererSizeDefault.fullScreen();

				xL = 0 + parallax; yL = 0; widthL = size.width; heightL = size.height / 2;
				xR = 0 - parallax; yR = size.height / 2;	widthR = size.width; heightR = size.height / 2;

				break;
			default: console.error( 'THREE.StereoEffect.render: Invalid "Spatial  multiplex" parameter: ' + spatialMultiplex );

		}

		options.stereo.update( camera );

		renderer.setScissor( xL, yL, widthL, heightL );
		renderer.setViewport( xL, yL, widthL, heightL );
		renderer.render( scene, options.stereo.cameraL );

		renderer.setScissor( xR, yR, widthR, heightR );
		renderer.setViewport( xR, yR, widthR, heightR );
		renderer.render( scene, options.stereo.cameraR );

		renderer.setScissorTest( false );

	};

	/**
	 * Adds StereoEffects folder into dat.GUI.
	 * See https://github.com/dataarts/dat.gui/blob/master/API.md about dat.GUI API.
	 * @param {GUI} gui dat.GUI object.
	 * @param {Object} options See options of StereoEffect above for details.
	 * @param {Object} [guiParams] the following params are available. Optional.
	 * @param {Function} [guiParams.getLanguageCode] Your custom getLanguageCode() function.
	 * returns the "primary language" subtag of the language version of the browser.
	 * Examples: "en" - English language, "ru" Russian.
	 * See the "Syntax" paragraph of RFC 4646 https://tools.ietf.org/html/rfc4646#section-2.1 for details.
	 * Default returns the 'en' is English language.
	 * @param {Object} [guiParams.lang] Object with localized language values.
	 * @param {number} [guiParams.scale] scale of allowed values. Default is 1.
	 */
	this.gui = function ( gui, guiParams ) {

		if ( gui === undefined )
			return;

		if ( guiParams === undefined ) guiParams = {};
		guiParams.scale = guiParams.scale || 1;

		//Localization

		var _lang = {
			stereoEffects: 'Stereo effects',

			spatialMultiplexName: 'Spatial  multiplex',
			spatialMultiplexTitle: 'Choose a way to do spatial multiplex.',

			spatialMultiplexs: {
				'Mono': spatialMultiplexsIndexs.Mono,
				'Side by side': spatialMultiplexsIndexs.SbS, //https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side
				'Top and bottom': spatialMultiplexsIndexs.TaB, //https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom
			},

			eyeSeparationName: 'Eye separation',
			eyeSeparationTitle: 'The distance between left and right cameras.',

			focus: 'Focus',
			focusTitle: 'Object distance.',

			zeroParallaxName: 'Zero parallax',
			zeroParallaxTitle: 'Distance to objects with zero parallax.',

			defaultButton: 'Default',
			defaultTitle: 'Restore default stereo effects settings.',

		};

		var _languageCode = guiParams.getLanguageCode === undefined ? 'en'//Default language is English
			: guiParams.getLanguageCode();
		switch ( _languageCode ) {

			case 'ru'://Russian language
				_lang.stereoEffects = 'Стерео эффекты';//'Stereo effects'

				_lang.spatialMultiplexName = 'Мультиплекс';//'Spatial  multiplex'
				_lang.spatialMultiplexTitle = 'Выберите способ создания пространственного мультиплексирования.';

				_lang.spatialMultiplexs = {
					'Моно': spatialMultiplexsIndexs.Mono, //Mono
					'Слева направо': spatialMultiplexsIndexs.SbS, //https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side
					'Сверху вниз': spatialMultiplexsIndexs.TaB, //https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom
				};

				_lang.eyeSeparationName = 'Развод камер';
				_lang.eyeSeparationTitle = 'Расстояние между левой и правой камерами.';

				_lang.focus = 'Фокус';
				_lang.focusTitle = 'Расстояние до объекта.';

				_lang.zeroParallaxName = 'Параллакс 0';
				_lang.zeroParallaxTitle = 'Расстояние до объектов с нулевым параллаксом.';

				_lang.defaultButton = 'Восстановить';
				_lang.defaultTitle = 'Восстановить настройки стерео эффектов по умолчанию.';
				break;
			default://Custom language
				if ( ( guiParams.lang === undefined ) || ( guiParams.lang._languageCode != _languageCode ) )
					break;

				Object.keys( guiParams.lang ).forEach( function ( key ) {

					if ( _lang[ key ] === undefined )
						return;
					_lang[ key ] = guiParams.lang[ key ];

				} );

		}

		//

		if ( guiParams.gui !== undefined )
			guiParams.gui.remember( options );

		function displayControllers( value ) {

			var display = value == spatialMultiplexsIndexs.Mono ? 'none' : 'block';
			_fEyeSeparation.domElement.style.display = display;
			if ( _controllerCameraFocus !== undefined )
				_controllerCameraFocus.__li.style.display = display;
			_controllerDefaultF.__li.style.display = display;
			_controllerZeroParallax.__li.style.display = display;

		}

		var _fStereoEffects = gui.addFolder( _lang.stereoEffects );//Stero effects folder

		//Spatial multiplex
		var _controllerSpatialMultiplex = _fStereoEffects.add( options, 'spatialMultiplex',
			_lang.spatialMultiplexs ).onChange( function ( value ) {

				value = parseInt( value );
				displayControllers( value );
				setObject( stereoEffect );
				if ( guiParams.onChangeMode )
					guiParams.onChangeMode( value );

			} );
		dat.controllerNameAndTitle( _controllerSpatialMultiplex, _lang.spatialMultiplexName, _lang.spatialMultiplexTitle );
		if ( guiParams.stereoEffect )
			guiParams.stereoEffect.setSpatialMultiplex = function ( index ) {

				_controllerSpatialMultiplex.setValue( index );

			}

		//eyeSeparation
		//http://paulbourke.net/papers/vsmm2007/stereoscopy_workshop.pdf
		var _fEyeSeparation = _fStereoEffects.addFolder( _lang.eyeSeparationName );//Eye Separation
		dat.folderNameAndTitle( _fEyeSeparation, _lang.eyeSeparationName, _lang.eyeSeparationTitle );
		var _controllerEyeSepOffset = _fEyeSeparation.add( new PositionController( function ( shift ) {

			options.eyeSep += shift;
			_controllerEyeSep.setValue( options.eyeSep );

		}, { settings: { offset: 0.01 }, min: 0.0001, max: 0.01, step: 0.0001 }
		) );
		var _controllerEyeSep = dat.controllerZeroStep( _fEyeSeparation, options.stereo, 'eyeSep', function ( value ) {

			options.eyeSep = value;
			setObject( stereoEffect );

		} );
		dat.controllerNameAndTitle( _controllerEyeSep, _lang.eyeSeparationName, _lang.eyeSeparationTitle );

		//camera.focus
		var _controllerCameraFocus;
		if ( options.camera ) {

			_controllerCameraFocus = _fStereoEffects.add( options.camera, 'focus',
				optionsDefault.focus / 10, optionsDefault.focus * 2, optionsDefault.focus / 1000 )
				.onChange( function ( value ) {

					options.focus = value;
					setObject( stereoEffect );

				} );
			dat.controllerNameAndTitle( _controllerCameraFocus, _lang.focus, _lang.focusTitle );

		}

		//Zero parallax
		//http://paulbourke.net/papers/vsmm2007/stereoscopy_workshop.pdf
		var _minMax = ( 60 - ( 400 / 9 ) ) * guiParams.scale + 400 / 9;
		var _controllerZeroParallax = _fStereoEffects.add( options, 'zeroParallax', - _minMax, _minMax )
			.onChange( function ( value ) {

				options.zeroParallax = value;
				setObject( stereoEffect );

			} );
		dat.controllerNameAndTitle( _controllerZeroParallax, _lang.zeroParallaxName, _lang.zeroParallaxTitle );

		//default button
		var _controllerDefaultF = _fStereoEffects.add( {
			defaultF: function ( value ) {

				options.stereo.eyeSep = optionsDefault.eyeSep;
				_controllerEyeSep.setValue( options.stereo.eyeSep );

				if ( options.camera ) {

					options.camera.focus = optionsDefault.focus;
					_controllerCameraFocus.setValue( options.camera.focus );

					options.zeroParallax = optionsDefault.zeroParallax;
					_controllerZeroParallax.setValue( options.zeroParallax );

				}

			},

		}, 'defaultF' );
		dat.controllerNameAndTitle( _controllerDefaultF, _lang.defaultButton, _lang.defaultTitle );

		displayControllers( options.spatialMultiplex );

	};

	/**
	 * sets an object into cookie.
	 * @param {string} name cookie name.
	 */
	function setObject( name ) {

		var object = {};
		//Object.keys( options.optionsDefault ).forEach( function ( key )
		Object.keys( optionsDefault ).forEach( function ( key ){
		
			object[key] = options[key];
		
		} );
		options.cookie.setObject( name, object );

	};

};

export { StereoEffect, spatialMultiplexsIndexs };

//Modifying of THREE.Raycaster for StereoEffect
Object.assign( THREE.Raycaster.prototype, {

	//options: followed options is available
	//{
	//	stereoEffect: THREE.StereoEffect, Default is effectundefined - no stereo effects
	//	onIntersection: The onIntersection event occurs when user has moved mouse over any particle.
	//	onIntersectionOut: The onIntersectionOut event occurs when user has moved mouse out any particle.
	//	onMouseDown: The onMouseDown event occurs when user has cliced any particle.
	//	renderer: THREE.WebGLRenderer The WebGL renderer displays your beautifully crafted scenes using WebGL.
	//	Default is renderer parameter of THREE.StereoEffect or renderer global variable.
	//}
	setStereoEffect: function ( options ) {

		options = options || {};
		var camera = options.camera, renderer = options.renderer;

		var stereoEffect = options.stereoEffect !== undefined ? options.stereoEffect : typeof effect !== 'undefined' ? effect :
			new StereoEffect( renderer, {

				spatialMultiplex: spatialMultiplexsIndexs.Mono, //.SbS,
				far: camera.far,
				camera: camera,
				stereoAspect: 1,

			} ),
			raycaster = this,
			particles, //The object or array of objects to check for intersection with the ray. See THREE.Raycaster.intersectObject for details.
			intersects, //An array of intersections is returned by THREE.Raycaster.intersectObject or THREE.Raycaster.intersectObjects.
			mouse, //Attention!!! Do not assign new THREE.Vector2() here
			//for prevention of invalid detection of intersection with zero point ( THREE.Vector3( 0, 0, 0 ) )
			//after opening of the web page and before user has moved mouse.

			mouseL = new THREE.Vector2(),
			mouseR = new THREE.Vector2(),
			cursor = renderer.domElement.style.cursor;

		function getMousePosition() {

			stereoEffect.getRendererSize().getMousePosition( mouse, event );

			function mousePosition( vectorName, b ) {

				mouseL.copy( mouse );
				mouseR.copy( mouse );
				var a = 0.5;

				mouseL[vectorName] += a;
				mouseL[vectorName] *= 2;

				mouseR[vectorName] -= a;
				mouseR[vectorName] *= 2;

				//zeroParallax
				var size = new THREE.Vector2();
				renderer.getSize( size );
				var zeroParallax = ( stereoEffect.options.zeroParallax / size.x ) * b;
				mouseL.x -= zeroParallax;
				mouseR.x += zeroParallax;

			}
			switch ( parseInt( stereoEffect.options.spatialMultiplex ) ) {

				case spatialMultiplexsIndexs.Mono:
					return;
				case spatialMultiplexsIndexs.SbS:
					mousePosition( 'x', 4 );
					break;
				case spatialMultiplexsIndexs.TaB:
					mousePosition( 'y', 2 );
					break;
				default: console.error( 'THREE.Raycaster.setStereoEffect.getMousePosition: Invalid effect.options.spatialMultiplex = ' + effect.options.spatialMultiplex );
					return;

			}

		}
		function getIntersects() {

			if ( particles === undefined )
				return;
			intersects = Array.isArray( particles ) ? raycaster.intersectObjects( particles ) : raycaster.intersectObject( particles );

		}
		function intersection( optionsIntersection ) {

			if ( mouse === undefined )
				return;//User has not moved mouse

			optionsIntersection = optionsIntersection || options;
			function isIntersection() {

				getIntersects();
				if ( intersects.length <= 0 ) {

					if ( optionsIntersection.onIntersectionOut !== undefined )
						optionsIntersection.onIntersectionOut( intersects );
					renderer.domElement.style.cursor = renderer.cursor === undefined ? cursor : renderer.cursor;
					return false;

				}

				//sometimes frustum point is not displayed any info
				var userData = intersects[0].object.userData;
				if ( userData.isInfo === undefined || userData.isInfo() )
					renderer.domElement.style.cursor = renderer.cursor === undefined ? 'pointer' : renderer.cursor;

				if ( optionsIntersection.onIntersection !== undefined )
					optionsIntersection.onIntersection( intersects, mouse );
				return true;

			}
			if ( parseInt( stereoEffect.options.spatialMultiplex ) !== spatialMultiplexsIndexs.Mono ) {

				var mouseCur = mouse;
				mouse = mouseL;
				raycaster.setFromCamera( mouseL, camera );
				if ( !isIntersection() ) {

					mouse = mouseR;
					raycaster.setFromCamera( mouseR, camera );
					isIntersection();

				}
				mouse = mouseCur;
				return;

			}
			raycaster.setFromCamera( mouse, camera );
			isIntersection();

		}

		this.stereo = {

			onDocumentMouseMove: function ( event ) {

				if ( particles === undefined )
					return;//The object or array of objects to check for intersection with the ray is not defined. See THREE.Raycaster.intersectObject for details.
				event.preventDefault();
				if ( mouse === undefined )
					mouse = new THREE.Vector2();
				getMousePosition();
				intersection();

			},
			onDocumentMouseDown: function ( event ) {

				intersection( {

					onIntersection: options.onMouseDown,

				} );

			},
			addParticle: function ( particle ) {

				if ( particles === undefined )
					particles = [];
				if ( particles.includes(particle) ) {

					console.error( 'Duplicate particle "' + particle.name + '"' );
					return;

				}
				particles.push( particle );

			},
			addParticles: function ( newParticles ) {

				if ( particles !== undefined ) {

					if ( !Array.isArray( particles ) ) {

						var particlesCur = particles;
						particles = [];
						particles.push( particlesCur );

					}
					particles.push( newParticles );
					return;

				}
				particles = newParticles;

			},
			removeParticle: function ( particle ) {

				for ( var i = 0; i < particles.length; i++ ) {

					if ( Object.is(particle, particles[i]) ) {

						particles.splice( i, 1 );
						break;

					}

				}

			},
			removeParticles: function () { particles = undefined; },
			//get position of intersected object
			//intersection: fi(rst item of array of intersections. See THREE.Raycaster.intersectObject for details
			getPosition: function ( intersection/*, noscale*/ ) {

				var attributesPosition = intersection.object.geometry.attributes.position,
					position = attributesPosition.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();
				if ( intersection.index !== undefined ) {

					position.fromArray( attributesPosition.array, intersection.index * attributesPosition.itemSize );

					position.multiply( intersection.object.scale );

					position.add( intersection.object.position );

				} else position = intersection.object.position;
				return position;

			}

		};
		var stereo = this.stereo;

	}

} );
