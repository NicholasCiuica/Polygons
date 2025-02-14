class Point {
  constructor(x, y, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
  }
}

class PointGrid {
  constructor(unitSize) {
      this.unitSize = unitSize;
      this.numRows = canvas.height / unitSize + 2;
      this.numCols = canvas.width / unitSize + 2;
      this.points = [];
      this.createGrid();
  }
  createGrid() {
      for(let r = 0; r < this.numRows; r++) {
          const row = [];
          for(let c = 0; c < this.numCols; c++) {
              let x = (c - 1) * this.unitSize + Math.random() * this.unitSize * 0.75;
              let y = (r - 1) * this.unitSize + Math.random() * this.unitSize * 0.75;
              let z = 25 * Math.sin(y / 200 * Math.PI) * Math.sin(x / 200 * Math.PI) + 25 * Math.random();
              let p = new Point(x, y, z);
              row.push(p);
          }
          this.points.push(row);
      }
  }
}