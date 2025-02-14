class Effect {
  constructor(unitSize) {
      this.pointGrid = new PointGrid(unitSize);
      this.polygons = [];
      this.createPolygons();
  }

  createPolygons() {
      let g = this.pointGrid.points;
      for(let r = 0; r < this.pointGrid.numRows - 1; r++) {
          for(let c = 0; c < this.pointGrid.numCols - 1; c++) {
              let u, v;
              if((r + c) % 2 == 0) {
                  u = [{r: 0, c: 0}, {r: 1, c: 0}, {r: 0, c: 1}];
                  v = [{r: 1, c: 1}, {r: 1, c: 0}, {r: 0, c: 1}];
              } else {
                  u = [{r: 0, c: 1}, {r: 0, c: 0}, {r: 1, c: 1}];
                  v = [{r: 1, c: 0}, {r: 0, c: 0}, {r: 1, c: 1}];
              }
              let points = [];
              points.push(g[r + u[0].r][c + u[0].c]);
              points.push(g[r + u[1].r][c + u[1].c]);
              points.push(g[r + u[2].r][c + u[2].c]);
              this.polygons.push(new Polygon(points, "orange"));
              points = [];
              points.push(g[r + v[0].r][c + v[0].c]);
              points.push(g[r + v[1].r][c + v[1].c]);
              points.push(g[r + v[2].r][c + v[2].c]);
              this.polygons.push(new Polygon(points, "orange"));
          }   
      }
  }
  
  update() {
      let radius = 200;
      for(let polygon of this.polygons) {
          const dotProduct = vectorDotProduct(polygon.forwardUnitNormal, polygon.unitVectorTo(pointLight));
          const reflectionMagnitude = Math.max(dotProduct, 0);
          const distanceMagnitude = Math.max(radius - polygon.distanceFrom(pointLight), 0) / radius;
          const hueMagnitude = 0.2 * reflectionMagnitude + 0.8 * distanceMagnitude;
          const lightnessMagnitude = 0.8 * reflectionMagnitude + 0.2 * distanceMagnitude;
  
          const baseHue = 280 + 60 * noise.perlin3(polygon.getCenter().x / 1000 * 2, polygon.getCenter().y / 1000 * 2, Date.now() / 1000 / 2);
          const hue = baseHue + hueMagnitude * 75;
          const lightness = 50 + lightnessMagnitude * 50;
          const color = `hsla(${hue}, 100%, ${lightness}%, 1)`;
          polygon.color = color;
          polygon.draw(ctx);
      }
  }
}