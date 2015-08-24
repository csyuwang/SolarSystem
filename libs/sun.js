// 太阳类
Sun = function () {
    Sim.Object.call(this);
}

Sun.prototype = new Sim.Object();

Sun.prototype.init = function () {

    var sunGroup = new THREE.Object3D();

    var texture = THREE.ImageUtils.loadTexture("images/sun_surface.jpg");
    var material = new THREE.MeshLambertMaterial( { map: texture, ambient : 0xffff00 } );

    var geometry = new THREE.SphereGeometry(Sun.SIZE_IN_EARTHS, 64, 64);
    var sunMesh = new THREE.Mesh( geometry, material );

    var light = new THREE.PointLight( 0xffffff, 1.2, 1000 );

    sunGroup.add(sunMesh);
    sunGroup.add(light);

    this.setObject3D(sunGroup);
}

Sun.SIZE_IN_EARTHS = 10;