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

    // 创建纹理，材质，几何体，生成网格，设置Object3D
    var earthMap = "images/earth_surface_2048.jpg";
    var texture = new THREE.ImageUtils.loadTexture(earthMap);
    var material = new THREE.MeshPhongMaterial({map: texture});
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.z = Earth.TILT;

    this.setObject3D(mesh);
}

Earth.prototype.update = function () {
    // 旋转
    this.object3D.rotation.y += Earth.ROTATION_Y;
}
// 每次旋转弧度
Earth.ROTATION_Y = 0.0025;
// z轴初始倾斜
Earth.TILT = 0.41;

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

