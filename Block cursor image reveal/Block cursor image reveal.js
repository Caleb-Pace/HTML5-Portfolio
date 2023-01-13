document.body.addEventListener("mousemove", mouseMove);

var mouseObject = document.querySelector("#mouse-object");
var mouseCover = getCover("#mouse-object");
var mouseX = 0;
var mouseY = 0;
function mouseMove(args) {
  // Get mouseObject data
  let halfWidth = (mouseObject.clientWidth / 2);
  let halfHeight = (mouseObject.clientHeight / 2);

  // X
  let docWidth = document.documentElement.clientWidth - halfWidth;
  if (!(args.clientX < halfWidth || args.clientX > docWidth)) {
    mouseX = args.clientX - halfWidth;
    mouseObject.style.left = mouseX + "px";
  }

  // Y
  let docHeight = document.documentElement.clientHeight - halfHeight;
  if (!(args.clientY < halfWidth || args.clientY > docHeight)) {
    mouseY = args.clientY - halfHeight;
    mouseObject.style.top = mouseY + "px";
  }

  // Overlap checks
  interaction("#image");
}

function interaction(objectID) {
  let objectData = getObjectData(objectID);

  // Reveal contents
  if (isOverlapping(
    objectData[0], // Left
    objectData[1], // Top
    objectData[2], // Width
    objectData[3], // Height
    mouseX,
    mouseY,
    mouseObject.clientWidth,
    mouseObject.clientHeight)) {
    // Object cover
    objectData[4].style.left = (mouseX - objectData[0]) + "px";
    objectData[4].style.top = (mouseY - objectData[1]) + "px";

    // Mouse cover
    mouseCover.style.left = (objectData[0] - mouseX) + "px";
    mouseCover.style.top = (objectData[1] - mouseY) + "px";

    return;
  }

  // Visual correction
  let x = parseInt(objectData[4].style.left);
  let y = parseInt(objectData[4].style.top);
  if (x < objectData[2] && x > (-1 * objectData[2])) {
    if ((objectData[0] - parseInt(mouseCover.style.left)) == (x + objectData[0])) mouseCover.style.left = mouseCover.clientWidth + "px";

    objectData[4].style.left = objectData[2] + "px";
  }
  if (y < objectData[3] && y > (-1 * objectData[3])) {
    if ((objectData[0] - parseInt(mouseCover.style.top)) == (y + objectData[0])) mouseCover.style.top = mouseCover.clientHeight + "px";

    objectData[4].style.top = objectData[3] + "px";
  }
}

function getObjectData(id) {
  let object = document.querySelector(id).getBoundingClientRect();

  return [
    Math.round(object.left),
    Math.round(object.top),
    object.width,
    object.height,
    getCover(id)
  ];
}

function getCover(id) {
  return document.querySelector(id).getElementsByClassName("cover")[0];
}

function isOverlapping(x1, y1, w1, h1, x2, y2, w2, h2) {
  // x interception
  let xMax = x1 + w1;
  let wMax = x2 + w2;
  let xContainsStart = (x2 >= x1 && x2 <= xMax);
  let xContainsEnd = (wMax >= x1 && wMax <= xMax);
  let xOverlap = (xContainsStart || xContainsEnd);

  // y interception
  let yMax = y1 + h1;
  let hMax = y2 + h2;
  let yContainsStart = (y2 >= y1 && y2 <= yMax);
  let yContainsEnd = (hMax >= y1 && hMax <= yMax);
  let yOverlap = (yContainsStart || yContainsEnd);

  return (xOverlap && yOverlap);
}
