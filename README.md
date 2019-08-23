
# Epic Audio Visualizer V2

### Audio visualization using the canvas API, a Web Worker, the AudioContext API, some sprite batching technics, CSS and APLayer for the player.

Two canvas tags are used to render the image, the first one is controlled by the main process that is in
charge of playing the audio and applying effect in real time on it, while animating the spectrum. The second
one is controlled by a web worker and only takes care of the particles effect, it can animate up to 3000
particles using sprite batching, limiting the amount of gpu calls per frame.