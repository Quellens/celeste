class Solid {
    constructor(x, y, w, h) {
      this.position = createVector(x, y);
      this.width = w;
      this.height = h;
    }
  
    display() {
      fill(0);
      strokeWeight(1);
      rect(this.position.x, this.position.y, this.width, this.height);
    }
  }