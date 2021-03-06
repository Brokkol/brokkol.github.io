var bacterias = [];

var bacteriaCount = 0;

var white = {
  r: 255,
  g: 255,
  b: 255,
  a: 255,
};

var canvas = document.getElementById("canvas").getContext("2d");

canvas.fillStyle = "#ffffff";
canvas.fillRect(0, 0, 800, 800);

function setPixel(x, y, c) {
  canvas.fillStyle =
    "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a / 255 + ")";
  canvas.fillRect(x, y, 1, 1);
}

function getPixel(x, y) {
  var pixelData = canvas.getImageData(x, y, 1, 1).data;

  var color = {
    r: pixelData[0],
    g: pixelData[1],
    b: pixelData[2],
    a: 255,
  };

  return color;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isTaken(x, y, mycolor) {
  var color = getPixel(x, y);
  if (JSON.stringify(color) === JSON.stringify(mycolor)) {
    return true;
  } else {
    return false;
  }
}

function isDead(x, y, mycolor) {
  var color = getPixel(x, y);
  if (
    JSON.stringify(color) !== JSON.stringify(mycolor) &&
    JSON.stringify(color) !== JSON.stringify(white)
  ) {
    return true;
  } else {
    return false;
  }
}

function generateNewCoords(x, y) {
  var rand = getRandomInt(0, 7);
  var locX = x,
    locY = y;

  switch (rand) {
    case 0:
      locX = locX + 1;
      locY = locY - 1;
      break;
    case 1:
      locX = locX + 1;
      break;
    case 2:
      locX = locX + 1;
      locY = locY + 1;
      break;
    case 3:
      locY = locY + 1;
      break;
    case 4:
      locX = locX - 1;
      locY = locY + 1;
      break;
    case 5:
      locX = locX - 1;
      break;
    case 6:
      locX = locX - 1;
      locY = locY - 1;
      break;
    case 7:
      locY = locY - 1;
      break;
  }

  return { x: locX, y: locY };
}

function getNewCoords(x, y, color, intervalID, GF) {
  var newX = x,
    newY = y;
  var buff;

  if (!isDead(newX, newY, color)) {
    for (var i = 0; i < GF; i++) {
      while (isTaken(newX, newY, color)) {
        buff = generateNewCoords(newX, newY);

        newX = buff.x;
        newY = buff.y;
      }
      setPixel(newX, newY, color);
    }
  } else {
    clearInterval(intervalID);
    var span = document.getElementById(intervalID - 1);
    span.textContent = span.textContent + " DEAD";
  }
}

function bacteria(startX, startY, color, GF) {
  var interval = setInterval(function () {
    getNewCoords(startX, startY, color, interval, GF);
  }, 100 - GF);

  bacterias.push(interval);
}

var cnv = document.getElementById("canvas");

cnv.addEventListener("click", function (e) {
  if (bacteriaCount < 10) {
    console.log("X: " + e.offsetX, "Y: " + e.offsetY);
    console.log(getPixel(e.offsetX, e.offsetY));

    var color = {
      r: getRandomInt(0, 255),
      g: getRandomInt(0, 255),
      b: getRandomInt(0, 255),
      a: 255,
    };

    var growthFactor = getRandomInt(0, 90);

    bacteria(e.offsetX, e.offsetY, color, growthFactor);
    bacteriaCount++;

    var div = document.createElement("div");
    var span = document.createElement("span");
    var textcontent = "";

    textcontent += "Bacteria: " + bacteriaCount;
    textcontent += " X: " + e.offsetX;
    textcontent += " Y: " + e.offsetY;
    textcontent += " Growth Factor: " + growthFactor;
    span.style.color =
      "rgba(" + [color.r, color.g, color.b, color.a].join(",") + ")";

    span.textContent = textcontent;
    span.id = bacteriaCount;
    div.style.display = "block";
    div.append(span);
    document.getElementById("rightcol").append(div);
  }
});
