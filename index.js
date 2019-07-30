const ap = new APlayer({
  container: document.getElementById('player'),
  mini: false,
  autoplay: false,
  theme: '#FADFA3',
  loop: 'all',
  order: 'random',
  preload: 'auto',
  volume: 0.7,
  mutex: true,
  listFolded: true,
  listMaxHeight: 90,
  lrcType: 3,
  audio: [
    {
      name: 'Marigold feat. Guriri',
      artist: 'M2U',
      url: 'https://github.com/yadPe/yadpe.github.io/raw/visualizer/src/assets/marigold.mp3',
      cover: 'https://github.com/yadPe/yadpe.github.io/blob/visualizer/src/assets/marigold.jpg?raw=true',
      lrc: '',
      theme: 'rgb(241, 228, 199)'
    },
    {
      name: 'Before My Body Is Dry (tomatomerde remix)',
      artist: 'tomatomerde',
      url: 'https://github.com/yadPe/yadpe.github.io/raw/visualizer/src/assets/Before_my_body_is_dry_(tomatomerde%20remix).mp3',
      cover: 'https://github.com/yadPe/yadpe.github.io/blob/visualizer/src/assets/Before_my_body_is_dry_(tomatomerde%20remix).jpg?raw=true',
      lrc: '',
      theme: 'rgb(233, 192, 215)'
    },
    {
      name: 'illanai-assorted',
      artist: 't+pazolite',
      url: 'https://github.com/yadPe/yadpe.github.io/raw/visualizer/src/assets/illanai-assorted.mp3',
      cover: 'https://github.com/yadPe/yadpe.github.io/blob/visualizer/src/assets/illanai-assorted.jpg?raw=true',
      lrc: '',
      theme: 'rgb(233, 192, 215)'
    },
    {
      name: 'Alexandrite',
      artist: 'onoken',
      url: 'https://github.com/yadPe/yadpe.github.io/raw/visualizer/src/assets/alexandrite.mp3',
      cover: 'https://github.com/yadPe/yadpe.github.io/blob/visualizer/src/assets/alexandrite.jpg?raw=true',
      lrc: '',
      theme: 'rgb(233, 192, 215)'
    },
    {
      name: "World Fragments III",
      artist: 'Xi',
      url: 'https://github.com/yadPe/yadpe.github.io/raw/visualizer/src/assets/world_fragments_III.mp3',
      cover: 'https://github.com/yadPe/yadpe.github.io/blob/visualizer/src/assets/world_fragments_III.jpg?raw=true',
      lrc: '',
      theme: 'rgb(233, 192, 215)'
    }
  ]
});

ap.on('play', () => init())

const randomNum = (min, max) => Math.random() * (max - min) + min;

const convertRange = (OldValue, OldMax, OldMin, NewMax, NewMin) => {
  return (OldValue - OldMin) * (NewMax - NewMin) / (OldMax - OldMin) + NewMin;
};

function overallLoudess(array) {
  var sum = 0;
  var start = array.length * 0;
  var stop = array.length * 1;
  for (var i = start; i < stop; i++) {
    sum += parseInt(array[i]);
  }
  return {
    low: lowFreq(array),
    mid: midFreq(array),
    high: highFreq(array),
    cursor: cursorFreq(array),
    overall: sum / array.length
  };
}

function cursorFreq(array) {
  var sum = 0;
  var start = array.length * 0;
  var stop = array.length * 0.390625;
  for (var i = start; i < stop; i++) {
    sum += parseInt(array[i]);
  }
  return sum / (stop - start);
}

function highFreq(array) {
  var sum = 0;
  var start = array.length * 0.5419921875;
  var stop = array.length * 0.9326171875;
  for (var i = start; i < stop; i++) {
    sum += parseInt(array[i]);
  }
  return sum / (stop - start);
}

function midFreq(array) {
  var sum = 0;
  var start = array.length * 0.140625;
  var stop = array.length * 0.3466796875;
  for (var i = start; i < stop; i++) {
    sum += parseInt(array[i]);
  }
  return sum / (stop - start);
}

function lowFreq(array) {
  var sum = 0;
  var start = array.length * 0;
  var stop = array.length * 0.107421875;
  for (var i = start; i < stop; i++) {
    sum += parseInt(array[i]);
  }
  return sum / (stop - start);
}


document.body.style.overflow = "hidden";
// This code is absolute trash and not meant to be reused.. Good luck

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback, element) {
      window.setTimeout(function () {
        callback(+performance.now());
      }, 1000 / 60);
    }
  );
})();

if (!window.MEDIA_ELEMENT_NODES) {
  window.MEDIA_ELEMENT_NODES = new WeakMap();
}

const particulesSize = { max: 7, min: 4 },
  //cursor = new Image(),
  clientPos = {},
  canvas = document.getElementById("visualizer"),
  ctx = canvas.getContext("2d"),
  particlesCanvas = document.getElementById("particles"),
  backgroundFilter = {
    blur: 3,
    brightness: 0.75,
    saturate: 0.75,
    scale: 1,
    borderOpacity: 0,
    bottomOpacity: 0
  };

let dataArray,
  bufferLength,
  barWidth,
  barHeight,
  running = true,
  frequency = {},
  canvasWidth,
  cursorSize = 112,
  canvasHeight,
  lastLog,
  lastRun,
  x = 0,
  lastMouseSum,
  startIdle,
  idle,
  h, //hue
  lastOverallLoudness, //loudness -100ms
  deltaLoudness,
  Yoffset = 50;

//SETUP cursor
const cursor = document.getElementById("cursorImg");

this.initCanvasWorker = () => {
  const blob = new Blob(
    Array.prototype.map.call(
      document.querySelectorAll('script[type="text/js-worker"]'),
      function (oScript) {
        return oScript.textContent;
      }
    ),
    { type: "text/javascript" }
  );

  // Create a new worker containing all "text/js-worker" scripts.
  this.worker = new Worker(window.URL.createObjectURL(blob));
  this.worker.onmessage = event => {
    if (event.data.msg === "render") {
      //particlesCtx.transferFromImageBitmap(event.data.bitmap);
    }
  };
  this.offscreenCanvas = particlesCanvas.transferControlToOffscreen();
  this.worker.postMessage(
    { msg: "ini", particulesSize, canvas: this.offscreenCanvas },
    [this.offscreenCanvas]
  );
};

this.getMousePos = event => {
  clientPos.x = event.x;
  clientPos.y = event.y - Yoffset;
};

const resizeWorker = (width, height) => {
  if (this.worker)
    this.worker.postMessage({ msg: "resize", newSize: { width, height } });
};

this.resizeEventHandler = () => {
  Yoffset = 0;
  const width = window.innerWidth;
  const height = window.innerHeight - Yoffset;
  canvas.width = canvasWidth = width;
  canvas.height = canvasHeight = height;
  barWidth = width / bufferLength;
  resizeWorker(width, height);
};

window.onload = () => this.resizeEventHandler();
window.onresize = () => this.resizeEventHandler();

//idle detect to hide controls
function mouseIdle(mouse) {
  if (!lastMouseSum) {
    lastMouseSum = mouse.x + mouse.y;
  }
  let sum = mouse.x + mouse.y;
  if (sum == lastMouseSum) {
    if (!idle) {
      startIdle = performance.now();
      idle = true;
    } else {
      const time = performance.now();
      if (idle && time - startIdle > 3000) {
        //document.getElementById("controls").style.display = "none";
        //console.log("none");
      }
    }
  } else {
    lastMouseSum = mouse.x + mouse.y;
    //document.getElementById("controls").style.display = "inline-block";
    idle = false;
  }
}

this.animate = () => {
  if (!lastRun) {
    lastRun = performance.now();
    this.req = window.requestAnimFrame(this.animate);
    return;
  }

  if (running) {
    this.req = window.requestAnimFrame(this.animate);
  }

  // Run every 0.1s - logs and idle handeling //
  if (!lastLog) {
    lastLog = performance.now();
  }
  const currentTime = performance.now();
  if (currentTime - lastLog > 100) {
    mouseIdle(clientPos);
    lastLog = performance.now();
    lastOverallLoudness = frequency.overall;
  }

  // analyse frequency and make average by range  //
  window.analyser.getByteFrequencyData(dataArray);
  frequency = overallLoudess(dataArray);
  // Animate css elements
  updateBackground();

  if (!lastOverallLoudness) {
    lastOverallLoudness = frequency.overall;
  }

  // Updates the bars color
  let sum = dataArray.reduce((previous, current) => (current += previous)),
    avg = sum / dataArray.length,
    s = avg * 100,
    l = 50;

  if (!h) {
    h = 0;
  }
  if (h <= 360) {
    h += frequency.overall * 2.4 / bufferLength;
  } else {
    h = 0;
  }

  // Detect high volume variations
  deltaLoudness = frequency.overall - lastOverallLoudness;
  if (frequency.overall > 101 || deltaLoudness > 38) {
    // update the hue theme
    h += 1;
    // Add a particle to the canvas
    this.worker.postMessage({ msg: "addParticles", amount: 1 });
  }

  // Update particles speed
  this.worker.postMessage({
    msg: "updateSpeedRatio",
    newRatio: convertRange(frequency.high, 255, 0, 25, 0.3)
  });

  // Begin rendering
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.beginPath();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle =
    "hsla(" +
    h +
    "," +
    s +
    "%," +
    25 +
    "%, " +
    convertRange(frequency.overall, 255, 0, 1, 0.5) +
    ")";
  ctx.lineCap = "round";
  ctx.fillStyle =
    "hsla(" +
    h +
    "," +
    s +
    "%," +
    50 +
    "%, " +
    convertRange(frequency.overall, 255, 0, 1, 0.2) +
    ")";

  // go back to the left of the screen
  x = 0;
  // Animate the points
  for (var i = 0; i < dataArray.length; i++) {
    //dataArray.length
    barHeight = dataArray[i] * 1.5;
    if (clientPos.y - canvasHeight / 2 > 0) {
      const deltaY = clientPos.y - canvasHeight / 2;
      let ratio = convertRange(
        clientPos.y - canvasHeight / 2,
        canvasHeight,
        0,
        2,
        1
      );

      //idk what ive done here but it works guys
      if (Math.abs(clientPos.x - x) <= 200) {
        var value = -Math.abs(clientPos.x - x);
        if (value == 0) {
          //ratio = 1;
        } else {
          const range = 150 - 1,
            newRange = 2.77 - 1;
          let epiic = (value - 0) * newRange / range + 2.77;
          if (epiic < 1) {
            epiic = 1;
          }
          const masterRoyal = epiic * (deltaY / canvasHeight) + 0.4;
          if (masterRoyal >= 1) {
            ratio *= masterRoyal;
          }
        }
      }
      ctx.lineTo(
        x,
        canvasHeight - barHeight * ratio > canvasHeight - Yoffset
          ? canvasHeight - Yoffset
          : canvasHeight - barHeight * ratio
      );
    } else {
      ctx.lineTo(
        x,
        canvasHeight - barHeight > canvasHeight - Yoffset
          ? canvasHeight - Yoffset
          : canvasHeight - barHeight
      );
    }
    x += barWidth + 1; // Move to the next point
  }
  ctx.lineTo(canvasWidth, canvasHeight);
  ctx.lineTo(0, canvasHeight);
  ctx.stroke();
  ctx.fill();
  //draw Cursor
  ctx.drawImage(
    cursor,
    clientPos.x - cursorSize / 2,
    clientPos.y - cursorSize / 2,
    cursorSize,
    cursorSize
  );

  // Apply audio effects
  window.biquadFilter.frequency.value =
    convertRange(clientPos.x, canvasWidth, 0, 15000, 50) || 500;
  window.biquadFilter.Q.value =
    convertRange(clientPos.y, canvasHeight, canvasHeight / 2.5, 1.45, 0) || 0;
};


//Animate all the css elements needed
const blurFilter = document.getElementById("blurFilter").style,
  brightnessFilterLeft = document.getElementById("brightnessFilterLeft").style,
  brightnessFilterRight = document.getElementById("brightnessFilterRight")
    .style,
  newBrightnessFilter = document.getElementById("newBrightnessFilter").style,
  saturateFilter = document.getElementById("saturateFilter").style,
  background = document.getElementById("background").style;

function updateBackground() {
  //backgroundFilter.scale = 1 + frequency.low / 2000;
  backgroundFilter.scale = 1;
  backgroundFilter.brightness = convertRange(frequency.high, 255, 0, 2.5, 0.5);
  backgroundFilter.borderOpacity = 0 + frequency.high / 100 * 0.2;
  backgroundFilter.bottomOpacity = 0 + ((frequency.overall / 100) * 1);
  backgroundFilter.blur = convertRange(frequency.high, 255, 0, 5, 0.22); //  0.2// + ((frequency.high / 100) * 1.5);

  cursorSize = 96 + frequency.cursor * 0.5;

  blurFilter.filter = "blur(" + backgroundFilter.blur + "px)";

  brightnessFilterLeft.opacity = backgroundFilter.borderOpacity;
  brightnessFilterRight.opacity = backgroundFilter.borderOpacity;

  newBrightnessFilter.filter =
    "brightness(" + backgroundFilter.brightness + ")";

  saturateFilter.filter = "saturate(" + backgroundFilter.saturate + ")";
  // saturateFilter.opacity = backgroundFilter.bottomOpacity;
  saturateFilter.background =
    "linear-gradient(to top, hsl(" +
    h +
    "," +
    55 +
    "%," +
    60 +
    "%) -65%, transparent 37%)";

  background.transform = "scale(" + backgroundFilter.scale + ")";
}
//const audio = new Audio('https://github.com/yadPe/yadpe.github.io/raw/visualizer/src/assets/marigold.mp3')

let isInit = false
const audio = ap.audio;
audio.crossOrigin = "anonymous"

// init
const init = () => {
  console.log('aa')
  if (isInit) return
  //ap.audio.crossOrigin = 'anonymous'
  if (!audio.paused) {
    if (window.audioCtx == undefined) {
      const audioContext =
        window.AudioContext || // Default
        window.webkitAudioContext || // Safari and old versions of Chrome
        false;
      window.audioCtx = new audioContext();
    }

    if (window.MEDIA_ELEMENT_NODES.has(audio)) {
      this.src = window.MEDIA_ELEMENT_NODES.get(audio);
    } else {
      this.src = window.audioCtx.createMediaElementSource(
        audio
      );
      window.MEDIA_ELEMENT_NODES.set(audio, this.src);
      window.analyser = window.audioCtx.createAnalyser();
      window.analyser.fftSize = 2048;
      window.gainNode = window.audioCtx.createGain();
      window.biquadFilter = window.audioCtx.createBiquadFilter();
    }

    window.analyser.connect(window.audioCtx.destination);
    window.gainNode.connect(window.analyser);
    window.biquadFilter.connect(window.gainNode);
    this.src.connect(window.biquadFilter);

    bufferLength = window.analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    barWidth = canvasWidth / bufferLength;
    document.getElementById("visu").style.cursor = "none";

    window.biquadFilter.type = "bandpass";
    window.biquadFilter.frequency.value = 100;
    window.biquadFilter.gain.value = -1;
    window.biquadFilter.detune.value = 5;
    window.biquadFilter.Q.value = 0;

    //Get cursor position
    window.addEventListener("mousemove", this.getMousePos, false);


    this.initCanvasWorker();
    this.resizeEventHandler();
    this.animate();
    isInit = true;
  }

}

// document.body.addEventListener('click', () => {
//   audio.play()
//   init()
// })
