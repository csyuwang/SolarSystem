Orbit = function()
{
	Sim.Object.call(this);
}

Orbit.prototype = new Sim.Object();

Orbit.prototype.init = function(distance)
{
	var geometry = new THREE.Geometry();

	for (var step = 0; step <= Orbit.N_SEGMENTS; step++)
	{
        var rad = step / Orbit.N_SEGMENTS * 2 * Math.PI;
		var x = distance * Math.cos( rad  );
		var z = distance * Math.sin( rad );
		var vertex = new THREE.Vertex (new THREE.Vector3(x, 0, z));
		geometry.vertices.push(vertex);
	}
	
	var material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: .5, linewidth: 2 } );

	var line = new THREE.Line( geometry, material );

    this.setObject3D(line);
}

Orbit.N_SEGMENTS = 120;