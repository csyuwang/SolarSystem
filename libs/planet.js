// 星球类
Planet = function () {
    Sim.Object.call(this);
}

Planet.prototype = new Sim.Object();

Planet.prototype.init = function (param) {

    param = param || {};

    var planetOrbitGroup = new THREE.Object3D();

    this.setObject3D(planetOrbitGroup);

    var planetGroup = new THREE.Object3D();

    var distance = param.distance || 0;
    var distSquared = distance * distance;
    planetGroup.position.set(Math.sqrt(distSquared / 2), 0, -Math.sqrt(distSquared / 2));

    planetOrbitGroup.add(planetGroup);
    this.planetGroup = planetGroup;
    var size = param.size || 1;
    this.planetGroup.scale.set(size, size, size);

    this.createGlobe(param.map);

    this.animateOrbit = param.animateOrbit;
    this.period = param.period;
    this.revolutionSpeed = param.revolutionSpeed ? param.revolutionSpeed : Saturn.REVOLUTION_Y;

}

Planet.prototype.createGlobe = function (mapUrl) {
    var texture = THREE.ImageUtils.loadTexture(mapUrl);
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshPhongMaterial({map: texture, ambient: 0x333333});
    var globeMesh = new THREE.Mesh(geometry, material);

    this.planetGroup.add(globeMesh);

    this.globeMesh = globeMesh;
}

Planet.prototype.update = function () {
    if (this.animateOrbit) {
        this.object3D.rotation.y += this.revolutionSpeed / this.period;
    }
    Sim.Object.prototype.update.call(this);
}

Planet.REVOLUTION_Y = 0.003;