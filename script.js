// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
img.src = '//:0';
document.getElementById('voice-selection').disabled = false;

var canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');
ctx.width = 400;
ctx.height = 400;

let submitButton = document.querySelector("[type='submit']"); 
let clearButton = document.querySelector("[type='reset']"); 
let readTextButton = document.querySelector("[type='button']");

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  //populateVoiceList();
  ctx.clearRect(0, 0, ctx.width, ctx.height);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, ctx.width, ctx.height);

  let dim = getDimmensions(ctx.width, ctx.height, img.width, img.height);
  ctx.drawImage(img, dim['startX'], dim['startY'], dim['width'], dim['height']);

  submitButton.disabled = false;
  //clearButton.disabled = true;
  //readTextButton.disabled = true;

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

const imageInput = document.getElementById('image-input');
imageInput.addEventListener("change", function()
{
  img.src = URL.createObjectURL(document.getElementById("image-input").files[0]);
  img.alt = document.getElementById("image-input").files[0]['name'];
});

const submit = document.getElementById('generate-meme');
submit.addEventListener("submit", function(event)
{
  event.preventDefault();
  let text1 = document.getElementById('text-top').value;
  let text2 = document.getElementById('text-bottom').value;
  
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(text1, ctx.width / 2, 50);
  ctx.fillText(text2, ctx.width / 2, 375);

  populateVoiceList();

  submitButton.disabled = true;
  clearButton.disabled = false;
  readTextButton.disabled = false;
 
});

clearButton.addEventListener("click", function()
{
  ctx.clearRect(0, 0, ctx.width, ctx.height);

  submitButton.disabled = false;
  clearButton.disabled = true;
  readTextButton.disabled = true;
});

const slider = document.getElementById('volume-group');
let vol = document.querySelector("[type='range']");
slider.addEventListener("input", function()
{
  if(vol.value == 0) 
  {
    document.getElementsByTagName('img')[0].src = "icons/volume-level-0.svg";
    document.getElementsByTagName('img').alt = "Volume Level 0";
  } 
  else if(vol.value >= 1 && vol.value <= 33) 
  {
    document.getElementsByTagName('img')[0].src = "icons/volume-level-1.svg";
    document.getElementsByTagName('img').alt = "Volume Level 1";
  } 
  else if(vol.value >= 34 && vol.value <= 66) 
  {
    document.getElementsByTagName('img')[0].src = "icons/volume-level-2.svg";
    document.getElementsByTagName('img').alt = "Volume Level 2";
  } else 
  {
    document.getElementsByTagName('img')[0].src = "icons/volume-level-3.svg";
    document.getElementsByTagName('img').alt = "Volume Level 3";
  }
  //console.log(vol.value);
});

var synth = window.speechSynthesis;
var voiceSelect = document.getElementById('voice-selection');
var voices = [];

readTextButton.addEventListener("click", function()
{
  //
  //
  if (speechSynthesis.onvoiceschanged !== undefined) 
  {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }

  var utterThis = new SpeechSynthesisUtterance(document.getElementById('text-top').value);
  var utterThis2 = new SpeechSynthesisUtterance(document.getElementById('text-bottom').value);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) 
  {
    if(voices[i].name === selectedOption) 
    {
      utterThis.voice = voices[i];
      utterThis2.voice = voices[i];
    }
  }
  utterThis.volume = vol.value / 100;
  utterThis2.volume = vol.value / 100;
  
  synth.speak(utterThis);
  synth.speak(utterThis2);
});

function populateVoiceList() 
{
  voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) 
  {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default)  
    {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
