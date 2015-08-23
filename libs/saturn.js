Saturn = function()
{
    Sim.Object.call(this);
}

Saturn.prototype = new Sim.Object();

Saturn.prototype.init = new function(param) {
    param = param || {};

    var planetOrbitGroup = new THREE.Object3D();
    this.setObject3D(planetOrbitGroup);

    var planetGroup = new THREE.Object3D();
    var distance = param.distance || 0;
    var distsquared = distance * distance;
    planetGroup.position.set(Math.sqrt(distsquared / 2), 0, -Math.sqrt(distsquared / 2));

    planetOrbitGroup.add(planetGroup);

    this.planetGroup = planetGroup;
    var size = param.size || 1;
    this.planetGroup.scale.set(size, size, size);

    this.planetGroup.rotation.x = Saturn.TILT;

    this.createGlobe();
    this.createRings();

    this.animateOrbit = param.animateOrbit;
    this.period = param.period;
    this.revolutionSpeed = param.revolutionSpeed ? param.revolutionSpeed : Saturn.REVOLUTION_Y;
}

Saturn.prototype.createGlobe = function(){
    var texture = THREE.ImageUtils.loadTexture("images/saturn_bjoernjonsson.jpg");
    var geometry = new THREE.SphereGeometry(1,32,32);
    var material = new THREE.MeshPhongMaterial({map:texture});
    var globeMesh = new THREE.Mesh(geometry,material);

    this.planetGroup.add(globeMesh);

    this.globeMesh = globeMesh;
}

Saturn.prototype.createRings = function(){
    var texture = THREE.ImageUtils.loadTexture(images/SatRing.png);
    var geometry = new Saturn.Rings(1.1, 1.867, 64);

    var material = new THREE.MeshLambertMaterial( {map: texture, transparent:true, ambient:0xffffff } );
    var ringsMesh = new THREE.Mesh( geometry, material );

    ringsMesh.doubleSided = true;
    ringsMesh.rotation.x = Math.PI / 2;

    this.planetGroup.add(ringsMesh);

    this.ringsMesh = ringsMesh;
}

Saturn.prototype.update = function(){
    if (this.animateOrbit)
    {
        this.object3D.rotation.y += this.revolutionSpeed / this.period;
    }

    Sim.Object.prototype.update.call(this);
}

Saturn.TILT = -0.466;
Saturn.REVOLUTION_Y = 0.003;

Saturn.Rings = function(innerRadius,outerRadius,nSegments){
    THREE.Geometry.call(this);

    var outerRadius = outerRadius || 1;
    var innerRadius = innerRadius || 0.5;
    var nSegments = nSegments || 10;

    var delta = 2 * Math.PI /nSegments;
    for(var step=0;step<nSegments;step++)
    {
        var rad1 = step * delta;
        var rad2 = (step+1) * delta;
        var x1 = innerRadius*Math.cos(rad1);
        var y1 = innerRadius*Math.sin(rad1);
        var x2 = outerRadius*Math.cos(rad1);
        var y2 = outerRadius*Math.sin(rad1);
        var x4 = innerRadius*Math.cos(rad2);
        var y4 = innerRadius*Math.sin(rad2);
        var x3 = outerRadius*Math.cos(rad2);
        var y3 = outerRadius*Math.sin(rad2);

        var v1 = new THREE.Vector3(x1,y1,0);
        var v2 = new THREE.Vector3(x2,y2,0);
        var v3 = new THREE.Vector3(x3,y3,0);
        var v4 = new THREE.Vector3(x4,y4,0);

        this.vertices.push(new THREE.Vertex(v1));
        this.vertices.push(new THREE.Vertex(v2));
        this.vertices.push(new THREE.Vertex(v3));
        this.vertices.push(new THREE.Vertex(v4));
    }

    for(var i=0;i<nSegments;i++)
    {
        this.faces.push(new THREE.Face3(i*4,i*4+1,i*4+2));
        this.faces.push(new THREE.Face3(i*4,i*4+2,i*4+3));

        this.faceVertexUvs[ 0 ].push( [
            new THREE.UV(0, 1),
            new THREE.UV(1, 1),
            new THREE.UV(1, 0) ] );
        this.faceVertexUvs[ 0 ].push( [
            new THREE.UV(0, 1),
            new THREE.UV(1, 0),
            new THREE.UV(0, 0) ] );
    }
    this.computeCentroids();
    this.computeFaceNormals();

    this.boundingSphere = { radius: outerRadius };
}

Saturn.Rings.prototype = new THREE.Geometry();
Saturn.Rings.prototype.constructor = Saturn.Rings;