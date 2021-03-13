var dataArray
var analyser
var ctx
var bufferLength
var totalDados = []
var dadosExportar = []
window.onload = () => {
    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");

    file.onchange = function(value) {

    //Create audio source and connect it to the input file
    //You could potentially use microphone input.
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();

    //Create and initialize drawing space
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");


    //Connect audio node analyser and adjust settings
    src.connect(analyser);
    analyser.connect(context.destination);
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    draw()
    console.log('totalDados => ', totalDados)
    }
    function gettingData () {
        var drawVisual = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        totalDados.push(dataArray)
    }

    audio.addEventListener('pause', () => {
        grafico()
        console.log('dados exportar => ', dadosExportar)
    })

    function grafico () {
        ctx.fillStyle = 'rgb(200, 200, 200)';
        ctx.fillRect(0, 0, 400, 400);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.beginPath();
        var sliceWidth = 400 * 1.0 / bufferLength;
        var x = 0;

        for (var b = 0; b < totalDados.length; b++) {
            for(var i = 0; i < totalDados[b].length; i++) {

                var v = dataArray[i] / 128.0;
                var y = v * 400/2;
    
                if(i === 0) {
                    dadosExportar.push(JSON.stringify({ x: x, y: y }))
                ctx.moveTo(x, y);
                } else {
                    dadosExportar.push(JSON.stringify({ x: x, y: y }))
                ctx.lineTo(x, y);
                }
    
                x += sliceWidth;
            }
        }

        ctx.lineTo(canvas.width, canvas.height/2);
        ctx.stroke();
    }

}


