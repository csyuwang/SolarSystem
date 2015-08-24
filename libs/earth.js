// 地球物体
Earth = function () {
    Sim.Object.call(this);
}

Earth.prototype = new Sim.Object();

Earth.prototype.init = function (param) {

    // 配置参数
    param = param || {};

    this.animateOrbit = param.animateOrbit || false;
    this.animateRotation = param.animateRotation || false;
    this.period = param.period;
    this.revolutionSpeed = param.revolutionSpeed ? param.revolutionSpeed : Earth.ROTATION_Y;
    this.rotationSpeed = this.revolutionSpeed * 365 / 2;
    this.cloudsRotationSpeed = this.rotationSpeed * Earth.CLOUDS_ROTATION_FACTOR;

    // 创建顶层地球轨道群组
    var earthOrbitGroup = new THREE.Object3D();

    this.setObject3D(earthOrbitGroup);

    // 创建地球群组
    var earthGroup = new THREE.Object3D();
    var distance = param.distance || 0;
    var distSquared = distance * distance;
    earthGroup.position.set(Math.sqrt(distSquared/2), 0, -Math.sqrt(distSquared/2));
    // 添加地球群组到顶层群组
    earthOrbitGroup.add(earthGroup);

    this.earthGroup = earthGroup;
    var size = param.size || 1;
    this.earthGroup.scale.set(size, size, size);

    // 添加球体和云层
    if (param.hires)
    {
        this.createShaderGlobe();
        this.createClouds();
    }
    else
    {
        this.createLitGlobe();
    }

}
Earth.prototype.createShaderGlobe = function () {
    // 创建多重纹理，包括法线贴图和高光贴图
    var surfaceMap = new THREE.ImageUtils.loadTexture("images/earth_surface_2048.jpg");
    var normalMap = new THREE.ImageUtils.loadTexture("images/earth_normal_2048.jpg");
    var specularMap = new THREE.ImageUtils.loadTexture("images/earth_specular_2048.jpg");

    // 法线贴图着色器
    var shader = THREE.ShaderUtils.lib["normal"];
    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms.tNormal.texture = normalMap;
    uniforms.tDiffuse.texture = surfaceMap;
    uniforms.tSpecular.texture = specularMap;
    uniforms.enableDiffuse.value = true;
    uniforms.enableSpecular.value = true;


    var shaderMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: uniforms,
        lights: true
    });

    var globeGeometry = new THREE.SphereGeometry(1, 32, 32);
    // 为着色器计算切线
    globeGeometry.computeTangents();
    var globeMesh = new THREE.Mesh(globeGeometry, shaderMaterial);
    globeMesh.rotation.x = Earth.TILT;
    // 添加到群组
    this.earthGroup.add(globeMesh);
    // 设置globeMesh
    this.globeMesh = globeMesh;
}

Earth.prototype.createLitGlobe = function () {

    var texture = THREE.ImageUtils.loadTexture("images/earth_surface_2048.jpg");
    var material = new THREE.MeshPhongMaterial( { map: texture } );
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var globeMesh = new THREE.Mesh( geometry, material );

    globeMesh.rotation.x = Earth.TILT;

    this.earthGroup.add(globeMesh);

    this.globeMesh = globeMesh;
}

Earth.prototype.createClouds = function () {
    // 创建云层
    // 导入纹理
    var cloudsMap = new THREE.ImageUtils.loadTexture("images/earth_clouds_1024.png");
    // 透明材质
    var cloudsMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: cloudsMap, transparent: true});
    var cloudsGeometry = new THREE.SphereGeometry(Earth.CLOUDS_SCALE, 32, 32);
    var cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    cloudsMesh.rotation.x = Earth.TILT;
    // 添加到群组
    this.earthGroup.add(cloudsMesh);
    // 设置globeMesh
    this.cloudsMesh = cloudsMesh;
}

Earth.prototype.createMoon = function () {
    var moon = new Moon();
    moon.init();
    this.addChild(moon);
}

Earth.prototype.update = function () {

    // 地球旋转
    this.globeMesh.rotation.y += Earth.ROTATION_Y;
    // 云层旋转
    this.cloudsMesh.rotation.y += Earth.CLOUDS_ROTATION_Y;

    Sim.Object.prototype.update.call(this);

}

// 地球每次的旋转弧度
Earth.ROTATION_Y = 0.003;
Earth.TILT = 0.41;
// 地球半径
Earth.RADIUS = 6371;
// 云层放大比例
Earth.CLOUDS_SCALE = 1.005;
// 云层旋转比例
Earth.CLOUDS_ROTATION_FACTOR = 0.95;
// 云层每次的旋转弧度
Earth.CLOUDS_ROTATION_Y = Earth.ROTATION_Y * Earth.CLOUDS_ROTATION_FACTOR;

// 创建月球
Moon = function(){
    Sim.Object.call(this);
}

Moon.prototype = new Sim.Object();

Moon.prototype.init = function () {
    var moonMap = new THREE.ImageUtils.loadTexture("images/moon_1024.jpg");
    var material = new THREE.MeshPhongMaterial( { map: moonMap,ambient:0x888888 } );
    var moonGeometry = new THREE.SphereGeometry(Moon.SIZE_IN_EARTHS, 32, 32);
    var moonMesh = new THREE.Mesh( moonGeometry, material );

    var distance = Moon.DISTANCE_FROM_EARTH / Earth.RADIUS;
    moonMesh.position.set(Math.sqrt(distance / 2), 0, -Math.sqrt(distance / 2));

    moonMesh.rotation.y = Math.PI;

    var group = new THREE.Object3D();
    group.add(moonMesh);

    group.rotation.x = Moon.INCLINATION;

    this.setObject3D(group);

    this.moonMesh = moonMesh;
}

Moon.prototype.update = function()
{
    // Moon orbit
    this.object3D.rotation.y += (Earth.ROTATION_Y / Moon.PERIOD);
    Sim.Object.prototype.update.call(this);
}

Moon.DISTANCE_FROM_EARTH = 356400;
Moon.PERIOD = 28;
Moon.EXAGGERATE_FACTOR = 1.2;
Moon.INCLINATION = 0.089;
Moon.SIZE_IN_EARTHS = 1 / 3.7 * Moon.EXAGGERATE_FACTOR;

