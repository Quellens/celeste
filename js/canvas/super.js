let solids = []; // Array für die Kollisionsobjekte
let player; // Spielerobjekt
let playerSpeed = 1; // Geschwindigkeit des Spielers
let playercolor =  "#dc493a";
let isJumping = false;
let jumpForce = 10;
const jumpForceIncrement = 0.5;

const initialHeight = 20; // Ausgangshöhe des Rechtecks
const duckedHeight = initialHeight / 2; // Verkleinerte Höhe des Rechtecks

let dashSpeed = 12; // Geschwindigkeit des Dashs
let dashDuration = 150; // Dauer des Dashs in Millisekunden
let dashAcceleration = 0.9;// Beschleunigung des Dashs
let dashDeceleration = 0.1; // Verzögerung des Dashs
let isDashing = false; // Flag, um den Dash-Status zu verfolgen
let dashcounter = 1;

let dashDirection;
let dashVelocity;
let saveddashDirectionx;

let isDucked = false;

let wallJumpSpeed = 8.5; // Geschwindigkeit des Wandsprungs
let wallJumpDuration = 250; // Dauer des Wandsprungs in Millisekunden
let isWallJumping = false; // Flag, um den Wandsprung-Status zu verfolgen
let walljumpVelocity; // Velocity für den Wandsprung
let wallJumpDeceleration = 0.085; // Verzögerung des Gleitens nach dem Wandsprung


let momentum = 0.9;
let keysPressed = []; // Array für gedrückte Tasten


let initialx = 100;
let initialy = 90;

const canvasWidth = 650;
const canvasHeight = 650;

let count = 0;
let imgs;

function preload() {
  imgs = [

    loadImage('https://raw.githubusercontent.com/Quellens/celeste/master/imgs/mydesign/madeline_sad.png'),
    loadImage('https://raw.githubusercontent.com/Quellens/celeste/master/imgs/mydesign/madeline_happy.png'),
    loadImage('https://raw.githubusercontent.com/Quellens/celeste/master/imgs/mydesign/madeline_SURPRISED.png')];
}

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("p5Canvas");
  textFont('Renogare');
  imageMode(CENTER);

  const setup =  {
    solids: [
        new Solid(0, 500, 200, 20),
        new Solid(470, 500, 200, 20),
    ],
    initialx: 30,
    initialy: 480,
  };
  solids = setup.solids;
  initialx = setup.initialx;
  initialy = setup.initialy;

  player = new Player(initialx, initialy, 20, initialHeight);

}


function draw() {
  background(220);


  // Überprüfen, ob der Spieler außerhalb des Canvas ist
  if (player.position.x < 0 || player.position.x + player.width > canvasWidth ||
    player.position.y < 0 || player.position.y + player.height > canvasHeight) {
    // Teleportiere den Spieler zur Startposition
    player.position.x = initialx;
    player.position.y = initialy;
    player.velocity.set(0, 0);
  }

  // Spieler steuern
  if (!isDashing && !isWallJumping) {

    if (keyIsDown(LEFT_ARROW)) {
      player.moveX(-playerSpeed);
    } else if (keyIsDown(RIGHT_ARROW)) {
      player.moveX(playerSpeed);
    }
  }

    // Counter anzeigen
    textSize(20);
    fill(0);
    text(`Anzahl Super: ${count}`, 10, 30);

    if(count == 0) {
        image(imgs[0], 100, 100, 75, 75);
        text(`Den Super schaffst du, wenn du \nauf dem Boden dashst und direkt \ndanach springst!`, 170, 85);
    } else if(count < 10 && count != 0) {
        image(imgs[1], 100, 100, 75, 75);
        text(`Das war Super! \nWortwörtlich sogar! \nSchaffst du auch 10?`, 170, 85);
    } else if(count >= 10) {
        image(imgs[2], 100, 100, 75, 75);
        text(`Du hast den Super gemeißtert! \nHerzlichen Glückwunsch! 🎉🎉 \nAls Nächstes den Wavedash..`, 170, 85);
    }

  // Spieler bewegen und Kollisionen überprüfen
  player.move();
  player.collideSolids();

  handleJump();
  handleDash();


  // Schwerkraft auf den Spieler anwenden
  player.applyGravity();

  // Spieler aktualisieren
  player.update();
  updateTrail();
  // Spieler zeichnen
  if (dashcounter == 0) {
    playercolor = "#5e7ce2";
  } else {
    playercolor = "#dc493a";
  }
  player.display(playercolor);

  // Kollisionsobjekte zeichnen
  for (let solid of solids) {
    solid.display();
  }





}

function handleJump() {
  if (isJumping) {

    for (let solid of solids) {
      if (isDashing && dashDirection.y == 0 && player.isRiding(solid)) {
        dashVelocity.mult(1.7);
        console.log("SUPER");
        count++;
      }

      if (isDashing && !player.isRiding(solid) && player.isFalling()) {
        isJumping = false;
        return;
      }
    }

    // Sprungkraft verlangsamen, solange die Eingabetaste gedrückt wird
    jumpForce -= jumpForceIncrement;

    player.position.y -= jumpForce;


    // Überprüfen, ob der höchste Punkt erreicht ist
    if (jumpForce <= 0) {
      isJumping = false; // Sprung beenden
    }
  } else {
    jumpForce = 10; // Zurücksetzen der Sprungkraft
  }

}

function handleWallJump(solid) {
  if (keyIsDown(32) && player.isFalling() && !isDashing) {
    isWallJumping = true;
    let wallJumpDirection;
    console.log("WALLJUMP");
    if (solid.position.x < player.position.x) {
      // Wand ist links
      wallJumpDirection = createVector(1, -1);
    } else {
      // Wand ist rechts
      wallJumpDirection = createVector(-1, -1); // Richtung des Wandsprungs diagonal weg von der rechten Wand
    }

    walljumpVelocity = wallJumpDirection.mult(wallJumpSpeed); // Setze die Dash-Veloc

    setTimeout(() => {
      isWallJumping = false;
      walljumpVelocity = null; // Stelle die vorherige Velocity wieder her
    }, wallJumpDuration);

  }
}

function handleDash() {
  for (let solid of solids) {
    if (isDashing && dashDirection) {
      if ((player.isInsideSolid(solid) || player.isRiding(solid)) && dashDirection.y > 0) {

        savedSpeed = dashVelocity.x * dashDirection.x; // speed speichern
        isDashing = false; // Dash beenden
        player.position.y = solid.position.y - player.height; // Spielerposition anpassen
        dashVelocity = null; // Dash-Geschwindigkeit zurücksetzen

        handleWavedash(); // Rufe die Funktion handleWavedash auf, um den Wavedash auszuführen

        if (player.velocity) {
          player.velocity.y = 1;
        }
        return;
      }
    }
  }





  if (isDashing && dashDirection) {

    addTrailPoint(player.position.x, player.position.y);
    dashcounter = 0;


    // Apply acceleration to the dash velocity
    dashVelocity.mult(dashAcceleration);
    // Update player's position using dash velocity
    player.position.add(dashVelocity);

  } else if (!isDashing && dashVelocity) {

    addTrailPoint(player.position.x, player.position.y);

    // Gradually slow down the dash velocity until reaching normal speed
    dashVelocity.mult(1 - dashDeceleration);
    // Update player's position using dash velocity
    player.position.add(dashVelocity);
    // Check if the dash velocity falls below the normal speed threshold
    if (dashVelocity.magSq() < playerSpeed * playerSpeed) {
      dashVelocity = null; // Stop applying the dash velocity
    }

  }
}

function handleWavedash() {
  if (player.isFalling() || isJumping) {

    let timer = 0; // Timer für die Überprüfung der Sprungdauer
    const checkInterval = 1; // Überprüfungsintervall in Millisekunden
    const jumpDuration = 200; // Dauer des Sprungs in Millisekunden

    const checkJumpDuration = setInterval(() => {
      timer += checkInterval; // Inkrementiere den Timer
      if (timer >= jumpDuration) {
        // Wenn die Sprungdauer erreicht wurde, führe den horizontalen Sprung (Wavedash) aus
        clearInterval(checkJumpDuration); // Stoppe die Überprüfung der Sprungdauer
        return;
      } else if (isJumping) {
        console.log("WAVEDASH");
        player.velocity.x = player.velocity.x + savedSpeed / 4;
      }
    }, checkInterval);


  }
}

function keyPressed() {

  if (!keysPressed.includes(key)) {
    keysPressed.push(key);
  }

  if (keyCode === 32) {
    let isRiding = solids.map(solid => player.isRiding(solid)).some(bool => bool);
    if (!(isRiding && jumpForce == 10)) {
      isJumping = false;
      return false;
    }

    isJumping = true;
    return false;
  }

  if (keyCode === DOWN_ARROW) {
    isDucked = true; // Das Rechteck ist geduckt, wenn die Pfeiltaste nach unten gedrückt wird
    player.height = duckedHeight; // Die Höhe des Rechtecks auf die verkleinerte Höhe setzen
    player.position.y += player.height;
    return false;
  }

  if (keyCode === UP_ARROW) {
    return false;
  }


  if ((key === 'd' || key === 'D') && !isDashing && dashcounter) {
    dashcounter--;
    isDashing = true;

    switch (true) {
      case keysPressed.includes('ArrowUp') && keysPressed.includes('ArrowRight'):
        dashDirection = createVector(1, -1); // Rechts oben
        break;
      case keysPressed.includes('ArrowUp') && keysPressed.includes('ArrowLeft'):
        dashDirection = createVector(-1, -1); // Links oben
        break;
      case keysPressed.includes('ArrowDown') && keysPressed.includes('ArrowLeft'):
        dashDirection = createVector(-1, 1); // Links unten
        break;
      case keysPressed.includes('ArrowDown') && keysPressed.includes('ArrowRight'):

        dashDirection = createVector(1, 1); // Rechts unten
        break;

      case keysPressed.includes('ArrowLeft'):
        dashDirection = createVector(-1, 0); // Links
        break;
      case keysPressed.includes('ArrowRight'):
        dashDirection = createVector(1, 0); // Rechts
        break;
      case keysPressed.includes('ArrowUp'):
        dashDirection = createVector(0, -1); // Hoch
        break;
      case keysPressed.includes('ArrowDown'):
        dashDirection = createVector(0, 1); // Runter
        break;
      default:
        dashDirection = createVector(1, 0); // Standard: Rechts
    }

    dashVelocity = dashDirection.copy().mult(dashSpeed);

    setTimeout(() => {
      isDashing = false;
      dashDirection = null;
    }, dashDuration);

  }

}

function keyReleased() {

  let index = keysPressed.indexOf(key);
  if (index !== -1) {
    keysPressed.splice(index, 1);
  }

  if (keyCode === 32) {
    isJumping = false;
  }

  if (keyCode === DOWN_ARROW) {
    isDucked = false; // Das Rechteck ist nicht mehr geduckt, wenn die Pfeiltaste losgelassen wird
    player.height = initialHeight; // Die Höhe des Rechtecks auf die Ausgangshöhe zurücksetzen
    player.position.y -= player.height / 2;
  }
}

// Array für die Punkte der Spur
let trail = [];

// Funktion zum Hinzufügen eines Punktes zur Spur
function addTrailPoint(x, y) {
  // Füge den Punkt zur Spur hinzu
  trail.push({ x, y, opacity: 1.0 });

}

// Funktion zum Aktualisieren und Zeichnen der Spur
function updateTrail() {
  // Aktualisiere die Opazität aller Punkte
  for (let i = 0; i < trail.length; i++) {
    trail[i].opacity -= 0.05; // Hier kannst du die Geschwindigkeit einstellen, mit der die Punkte verblassen
    if (trail[i].opacity <= 0) {
      trail.splice(i, 1); // Entferne den Punkt, wenn die Opazität auf 0 oder kleiner fällt
      i--;
    }
  }

  // Zeichne die Punkte der Spur
  for (let point of trail) {
    fill(104, 154, 236, point.opacity * 255); // Setze die Füllfarbe mit der entsprechenden Opazität
    noStroke();
    rect(point.x, point.y, player.width, player.height); // Zeichne das Rechteck als Spur (gleiche Größe wie der Spieler)
  }
}
