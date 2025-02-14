class Polygon {
  constructor(points, color) {
      if(points.length < 3) {
          throw new Error('Tried to make a polygon with only ' + points.length + ' vertices');
      }
      this.points = points;
      this.color = color;
      this.forwardUnitNormal = this.calculateForwardUnitNormal();
  }

  draw(ctx) {
      drawPolygon(ctx, this.points, this.color);
  }

  calculateForwardUnitNormal() {
      const p = this.points;
      const v1 = vectorSubtract(p[1], p[0]);
      const v2 = vectorSubtract(p[2], p[0]);
      const normal = vectorCrossProduct(v1, v2);
      let unitNormal = vectorNormalize(normal);
      if(unitNormal.z < 0) {
          unitNormal = vectorScalarMultiply(unitNormal, -1);
      }
      return unitNormal;
  }

  getCenter() {
      const center = {x: 0, y: 0, z: 0};
      for(let point of this.points) {
          center.x += point.x;
          center.y += point.y;
          center.z += point.z;
      }
      center.x /= this.points.length;
      center.y /= this.points.length;
      center.z /= this.points.length;
      return center;
  }

  distanceFrom(point) {
      const center = this.getCenter();
      const deltaX = point.x - center.x;
      const deltaY = point.y - center.y;
      const deltaZ = point.z - center.z;
      return Math.sqrt(deltaX ** 2 + deltaY ** 2 + deltaZ ** 2);
  }
  
  unitVectorTo(point) {
      const center = this.getCenter();
      const v = vectorSubtract(point, center);
      return vectorNormalize(v);
  }
}
