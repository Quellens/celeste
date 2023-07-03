let solids = []; // Array für die Kollisionsobjekte
let player; // Spielerobjekt
let playerSpeed = 1; // Geschwindigkeit des Spielers
let playercolor =  "#dc493a";
let isJumping = false;
let jumpForce = 10;
const jumpForceIncrement = 0.5;
let endpoint;

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


// Aktuelles Setup-Index
let currentSetupIndex = -1;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("p5Canvas");
  textFont('Renogare');
  const setups = [
    {
      solids: [new Solid(0, 500, 800, 20)],
      initialx: 150,
      initialy: 480,
      tech: "Level 1 – Dash hinein",
      endpoint: createVector(canvasWidth / 2, canvasHeight / 2 + 50),
    },

    {
      solids: [new Solid(0, 500, 200, 20), new Solid(500, 500, 800, 20)],
      initialx: 150,
      initialy: 480,
      tech: "Level 2 – Dash über den Abgrund",
      endpoint: createVector(600, 450),
    },
    {
      solids: [new Solid(0, 500, 200, 20), new Solid(500, 430, 800, 20)],
      initialx: 150,
      initialy: 480,
      tech: "Level 3 – Dash über den Abgrund 2 ",
      endpoint: createVector(600, 480),
    },
    {
      solids: [
        new Solid(200, 300, 150, 20),
        new Solid(350, 100, 20, 220),
        new Solid(350, 100, 500, 20),
        new Solid(200, 300, 20, 220),
        new Solid(0, 500, 200, 20),
      ],
      initialx: 50,
      initialy: 480,
      endpoint: createVector(550, 80),
      tech: "Level 4 – Walljump und Dash",
    },
    {
      solids: [
        new Solid(0, 500, 350, 20),
        new Solid(350, 0, 20, 520),
        new Solid(0, 320, 200, 20),
      ],
      initialx: 250,
      initialy: 480,
      endpoint: createVector(50, 280),
      tech: "Level 5 – Walljump und Dash 2",
    },
    {
      solids: [new Solid(0, 500, 200, 20),
      new Solid(350, 0, 20, 480),
      new Solid(500, 330, 20, 150),
      new Solid(500, 330, 150, 20),
      ],
      initialx: 150,
      initialy: 480,
      tech: "Level 6 – Dash und Walljumps",
      endpoint: createVector(600, 200),
    },
    {
      solids: [new Solid(0, 500, 200, 20),
      new Solid(350, 0, 20, 480),
      new Solid(500, 330, 20, 150),
      new Solid(500, 330, 150, 20),
      ],
      initialx: 600,
      initialy: 310,
      tech: "Level 7 – Wieder runter",
      endpoint: createVector(600, 480),
    },
    {
      solids: [
        new Solid(0, 400, 50, 20),
        new Solid(100, 400, 50, 20),
        new Solid(300, 450, 50, 20),
        new Solid(450, 400, 100, 20),
        new Solid(85, 0, 20, 500),
        new Solid(235, 0, 20, 500),
        new Solid(330, 0, 20, 450),
        new Solid(450, 400, 20, 300),
      ],
      initialx: 0,
      initialy: 380,
      endpoint: createVector(600, 280),
      tech: "Level 8 – Hindernde Wände",
    },
    {
      solids: [
        new Solid(200, 200, 200, 20),
        new Solid(200, 200, 20, 200),
        new Solid(400, 200, 20, 150),
        new Solid(200, 400, 200, 20),
      ],
      initialx: 250,
      initialy: 380,
      endpoint: createVector(295, 150),
      tech: "Level 9 – Kniffliges nach Oben kommen",
    },
    {
      solids: [
        new Solid(200, 500, 150, 20),
        new Solid(200, 100, 20, 400),
        new Solid(350, 100, 20, 420),
        new Solid(350, 100, 500, 20),
        new Solid(0, 100, 200, 20),
      ],
      initialx: 250,
      initialy: 480,
      endpoint: createVector(550, 80),
      tech: "Level 10 – Harte Walljumps",
    },
    {
      solids: [
        new Solid(100, 200, 200, 20),
        new Solid(100, 0, 20, 130),
        new Solid(100, 140, 20, 100),
        new Solid(0, 200, 10, 20),
        new Solid(40, 200, 80, 20),
        new Solid(100, 200, 20, 270),
        new Solid(100, 200, 20, 150),
        new Solid(100, 400, 200, 20),
        new Solid(100, 480, 20, 200),
        new Solid(300, 400, 20, 190),
        new Solid(300, 600, 20, 130),
        new Solid(400, 0, 20, 430),
        new Solid(550, 0, 20, 430),
        new Solid(400, 150, 70, 20),
        new Solid(320, 420, 100, 20),
        new Solid(320, 600, 400, 20),
        new Solid(500, 300, 50, 20),

      ],
      initialx: 220,
      initialy: 380,
      endpoint: createVector(455, 100),
      tech: "Level 11 – Entgegen dem Uhrzeigersinn",
    },
    {
      solids: [
        new Solid(0, 500, 800, 20),

        new Solid(100, 100, 20, 150),
        new Solid(100, 100, 170, 20),
        new Solid(100, 250, 150, 20),
        new Solid(175, 175, 75, 20),
        new Solid(250, 175, 20, 95),

        new Solid(350, 100, 20, 150),
        new Solid(350, 100, 170, 20),
        new Solid(350, 250, 150, 20),
        new Solid(425, 175, 75, 20),
        new Solid(500, 175, 20, 95),
      ],
      initialx: 150,
      initialy: 480,
      tech: "GG",
      endpoint: createVector(canvasWidth / 2, canvasHeight / 2 + 50),
    },
    // Weitere Setups hinzufügen...
  ];
  currentSetupIndex = (currentSetupIndex + 1) % setups.length;

  const currentSetup = setups[currentSetupIndex];
  solids = currentSetup.solids;
  initialx = currentSetup.initialx;
  initialy = currentSetup.initialy;
  document.getElementById("zuerlernendetechnik").innerText = currentSetup.tech;

  player = new Player(initialx, initialy, 20, initialHeight);

  endpoint = new Point(currentSetup.endpoint.x, currentSetup.endpoint.y);

}

const changeSetupButton = document.getElementById('change-setup-button');
changeSetupButton.addEventListener('click', setup);

function draw() {
  background(220);
  endpoint.display();

  const circleCenter = createVector(endpoint.position.x, endpoint.position.y);
  const playerPosition = createVector(player.position.x, player.position.y);
  const distance = p5.Vector.dist(playerPosition, circleCenter);
  if (distance <= endpoint.width / 2 * 1.5 && isDashing) {
    // Radius des Kreises
    setup();
  }

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
