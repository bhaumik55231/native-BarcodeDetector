const init = () => {
    const width = 320;
    let height = 0;
    let streaming = false;
    let video = null;
    let canvas = null;
    let photo = null;
    let startbutton = null;
  
    const startup = () => {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');
    
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });
    
        video.addEventListener('canplay', function(ev){
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth/width);
                
                if (isNaN(height)) {
                    height = width / (4/3);
                }
                
                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);
    
        startbutton.addEventListener('click', function(ev){
            takepicture();
            ev.preventDefault();
        }, false);
        
        clearphoto();
    }
  
    const clearphoto = () => {
        const context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        const data = canvas.toDataURL('image/png');
        
        photo.setAttribute('src', data);
    }
  
    const takepicture = () => {
        const context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);
            const data = canvas.toDataURL('image/png');
            const barcodeDetector = new BarcodeDetector({formats: ['code_128']});
            barcodeDetector.detect(canvas)
                .then(barcodes => {
                    console.log(barcodes)
                    barcodes.forEach(barcode => console.log(barcode.rawData));
                })
                .catch(err => {
                    console.log(err);
                })
            photo.setAttribute('src', data);
        } else {
            clearphoto();
        }
    }
    window.addEventListener('load', startup, false);
};
init();