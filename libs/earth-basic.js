// 继承自Sim.App的地球应用EarthApp
EarthApp = function () {
    Sim.App.call(this);
}
// 子类EarthApp
EarthApp.prototype = new Sim.App();

EarthApp.prototype.init = function (param) {
    //调用父类Sim.App的初始化方法，设置场景，渲染器，和默认相机
    Sim.App.prototype.init.call(this, param);
    // 初始化地球物体并添加到EarthApp中
    var earth = new Earth();
    earth.init();

    this.addObject(earth);

    var sun = new Sun();
    sun.init();
    this.addObject(sun);

}

// 地球物体
Earth = function () {
    Sim.Object.call(this);
}

Earth.prototype = new Sim.Object();

Earth.prototype.init = function () {

    var group = new THREE.Object3D;

    this.setObject3D(group);

    this.createGlobe();
    this.createClouds();
}
Earth.prototype.createGlobe = function () {
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

    var globeGeometry = new THREE.SphereGeometry(1, 128, 128);
    // 为着色器计算切线
    globeGeometry.computeTangents();
    var globeMesh = new THREE.Mesh(globeGeometry, shaderMaterial);
    globeMesh.rotation.z = Earth.TILT;
    // 添加到群组
    this.object3D.add(globeMesh);
    // 设置globeMesh
    this.globeMesh = globeMesh;
}

Earth.prototype.createClouds = function () {
    // 创建云层
    // 导入纹理
    var cloudsMap = new THREE.ImageUtils.loadTexture("images/earth_clouds_1024.png");
    // 透明材质
    var cloudsMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: cloudsMap, transparent: true});
    var cloudsGeometry = new THREE.SphereGeometry(Earth.CLOUDS_SCALE, 128, 128);
    var cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    cloudsMesh.rotation.z = Earth.TILT;
    // 添加到群组
    this.object3D.add(cloudsMesh);
    // 设置globeMesh
    this.cloudsMesh = cloudsMesh;
}


Earth.prototype.update = function () {

    // 地球旋转
    this.globeMesh.rotation.y += Earth.ROTATION_Y;
    // 云层旋转
    this.cloudsMesh.rotation.y += Earth.CLOUDS_ROTATION_Y;

    Sim.Object.prototype.update.call(this);

}

// 地球每次的旋转弧度
Earth.ROTATION_Y = 0.001;
// z轴初始倾斜
Earth.TILT = 0.41;
// 云层放大比例
Earth.CLOUDS_SCALE = 1.005;
// 云层每次的旋转弧度
Earth.CLOUDS_ROTATION_Y = Earth.ROTATION_Y * 0.9;


// 创建太阳
Sun = function () {
    Sim.Object.call(this);
}

Sun.prototype = new Sim.Object();

Sun.prototype.init = function () {
    var light = new THREE.PointLight(0xffffff, 2, 100);
    light.position.set(-10, 0, 20);
    this.setObject3D(light);
}

