class Player {

    constructor(x, y, w, h) {
      this.position = createVector(x, y);
      this.velocity = createVector(0, 0);
      this.width = w;
      this.height = h;
    }
  
  
    moveX(amount) {
      this.position.x += amount;
      this.velocity.x = 0.4 * amount;
    }
  
    moveY(amount) {
      this.position.y += amount;
      this.velocity.y = 0.4 * amount;
    }
    applyGravity() {
      if (isDashing) {
        return;
      }
      const gravity = 0.3; // Gravitationskraft
      const maxFallSpeed = 3; // Maximale Fallgeschwindigkeit
  
      // Schwerkraft auf die vertikale Geschwindigkeit anwenden
      this.velocity.y += gravity;
  
      // Maximale Fallgeschwindigkeit begrenzen
      if (this.velocity.y > maxFallSpeed) {
        this.velocity.y = maxFallSpeed;
      }
    }
  
    update() {
  
      if (isDashing) {
        return;
      }
      // Spielerposition basierend auf der Geschwindigkeit aktualisieren
      this.position.add(this.velocity);
  
      if (isWallJumping && walljumpVelocity) {
        // Graduell verringere die Wall Jump-Velocity, um das Gleiten zu simulieren
        walljumpVelocity.mult(1 - wallJumpDeceleration);
        // Aktualisiere die Position des Spielers mit der Dash-Velocity
        this.position.add(walljumpVelocity);
      }
  
        // Anhalten des Spielers, wenn keine Bewegungstasten gedrückt sind
      if (!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
        // Reduziere die Geschwindigkeit allmählich, bis sie auf Null abfällt
        player.velocity.x *= momentum; // Anpassen des Wertes für die gewünschte Abbremsrate
  
        // Prüfe, ob die Geschwindigkeit klein genug ist, um sie auf Null zu setzen
        if (abs(player.velocity.x) < 0.1) {
          player.velocity.x = 0; // Setze die x-Komponente auf Null
        }
      }
  
      for (let solid of solids) {
        if (this.isRiding(solid)) {
          // Spieler ist auf Solid, Geschwindigkeit auf 0 setzen
          this.velocity.y = 0;
  
        }
      }
      
  
    }
  
    isFalling() {
      return !isJumping && this.velocity.y > 0;
    }
  
    collideSolids() {
      for (let solid of solids) {
        if (this.position.x + this.width > solid.position.x &&
          this.position.x < solid.position.x + solid.width &&
          this.position.y + this.height > solid.position.y &&
          this.position.y < solid.position.y + solid.height) {
  
          // Kollision erkannt, Kollision behandeln
          if (this.isRiding(solid)) {
            // Kollision: Reiten
            dashcounter = 1;
            this.moveY(solid.position.y - (this.position.y + this.height));
  
          } else if ((!this.isRiding(solid)) && this.isAtWall(solid)) {
            // Kollision: An Wänden!
            handleWallJump(solid);
            //console.log("KOLLISION")
            if (solid.position.x < this.position.x) {
              this.position.x = solid.position.x + solid.width;
            } else {
              this.position.x = solid.position.x - this.width;
            }
  
          }
        }
      }
    }
  
    display() {
      fill(playercolor);
      stroke(0);
      strokeWeight(1);
      rect(this.position.x, this.position.y, this.width, this.height);
    }
  
    isRiding(solid) {
      const leadZone = 2; // Vorlaufzone über dem Solid
      return (
        this.position.y + this.height + leadZone >= solid.position.y &&
        this.position.y + this.height <= solid.position.y + leadZone &&
        this.position.x + this.width > solid.position.x &&
        this.position.x < solid.position.x + solid.width
      );
    }
  
    isInsideSolid(solid) {
      return (
        this.position.x > solid.position.x &&
        this.position.x + this.width < solid.position.x + solid.width &&
        this.position.y > solid.position.y &&
        this.position.y + this.height < solid.position.y + solid.height
      );
    }
  
    isAtWall(solid) {
      let bool = (this.position.x + this.width > solid.position.x &&
        this.position.x < solid.position.x + solid.width &&
        this.position.y + this.height > solid.position.y &&
        this.position.y < solid.position.y + solid.height);
  
      return bool && (
        (this.position.x <= solid.position.x + solid.width &&
          this.position.x + this.width >= solid.position.x + solid.width) || // Wand rechts
        (this.position.x + this.width >= solid.position.x &&
          this.position.x <= solid.position.x + this.width) // Wand links
      );
    }
  
    move() {
      if (keyIsDown(LEFT_ARROW)) {
        this.moveX(-2);
      } else if (keyIsDown(RIGHT_ARROW)) {
        this.moveX(2);
      }
    }
  }