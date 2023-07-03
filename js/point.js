class Point {
    constructor(x, y) {
      this.position = createVector(x, y);
      this.width = 25;
    }
  
    display() {
      stroke(128, 0, 128); // Lila
      strokeWeight(this.width);
      point(this.position.x, this.position.y); // Zeichne den Kreis
    }
  }