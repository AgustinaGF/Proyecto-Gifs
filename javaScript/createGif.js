// apikey
const APIKEY = "Z2xU3p3HPPxR77IHkcSDYIfuvbF3Ydao"

// Constantes
const BUTTON_START_CREATE_GIF = document.querySelector(".startCreateGif")
const HIDDEN = document.querySelectorAll(".hidden")
const NO_HIDDEN = document.querySelectorAll(".noHidden")
const BUTTONS_RECORD = document.querySelector('#capture')
const IMAGE_CAPTURE = document.querySelector("#imageCapture")
const BUTTON_CAPTURE = document.querySelector("#buttonCapture")
const BLOCK_CREATE_GIF = document.querySelector(".blockCreateGif")
const LOGO_CREATE_GIF = document.querySelector(".logoCreateGif")
const BUTTON_STOP_RECORD = document.querySelector("#buttonStopRecord")
const ELEMENT_STOP = document.querySelectorAll(".stop")
const ELEMENT_TIMER = document.querySelectorAll(".timer")
const ELEMENTS_HIDDEN = document.querySelectorAll(".secondHidden")
const SECOND_TITLE = document.querySelector("#secondTitle")
const CONTAINER_TIMER = document.querySelector("#containerTimer")
const VIDEO = document.querySelector("#video")
const IMAGE_GIF_PREVIEW = document.querySelector(".imageGif")
const BUTTON_UPLOAD_GIF = document.querySelector("#buttonUpload")
const THIRD_HIDDEN = document.querySelectorAll(".thirdHidden")
const WINDOW_SUCCESS_UPLOAD = document.querySelector("#windowSuccessUpload")
const IMAGE_NEW_GIF = document.querySelector("#newGif")
const BUTTON_DOWNLOAD_GIF = document.querySelector("#buttonDownload")
const BUTTON_COPY_URL = document.querySelector("#buttonURL")
const SECTION_MIS_GIFOS = document.querySelector('#misGifos')
const CONTAINER_CREATE_GIF = document.querySelector(".containerCreateGif")
const ARROW_DROPDOWN = document.querySelector(".arrow")
const BUTTON_SAILOR_NIGTH = document.querySelector(".sailorNight")
const BUTTON_SAILOR_DAY = document.querySelector(".sailorDay")
const LOGO_MIS_GIFOS = document.querySelector(".logo1")
const THEME_SAILOR_NIGTH_CREATE_GIF = document.querySelector("#themeDay")
const THEME_SAILOR_DAY_CREATE_GIF = document.querySelector("#themeDay")
const CONTAINER_IMAGE_MY_GIFS = document.querySelector("#containerImageMyGifs")
const MY_BAR = document.querySelector("#myBar")
const BUTTON_REPEAT = document.querySelector("#buttonRepeat")
const CANCEL_UPLOAD = document.querySelector("#cancelUpload")
const TWO_MY_BAR = document.querySelector("#twoMyBar")
const LAST_BUTTON_READ = document.querySelector(".lastButtonReady")
const BUTTON_CREATE_GIF = document.querySelector(".button1")
const ICONO = document.querySelector("#icono")
const CONTAINER_MY_GIFS = document.querySelector(".containerMyGuifos")
const TEXT_MIS_GIF = document.querySelector(".textMisGif")




// variables
var timer = document.querySelector("#captureTimer")
var recorder = null;
var containerStream = null;
var blobGif = null;
var gifId = null;
var jsonGif = []
var controller = new AbortController();
var signal = controller.signal;
var progress = 0;
var twoProgressBar = 0;


// funcion que mantiene el estilo segun lo elegido 
function changeTheme(theme) {
    localStorage.setItem("chooseTheme", theme)
    if (theme === "themeNigth") {
        THEME_SAILOR_NIGTH_CREATE_GIF.href = "/css/themeNigth.css"
        LOGO_CREATE_GIF.src = "/assets/gifOF_logo_dark.png"
        LOGO_MIS_GIFOS.src = "/assets/gifOF_logo_dark.png"
        ICONO.href = "/assets/sailorDark.ico"
    } else {
        THEME_SAILOR_DAY_CREATE_GIF.href = "/css/themeDay.css"
        LOGO_MIS_GIFOS.src = "/assets/gifOF_logo.png"
        ICONO.href = "/assets/sailorDay.ico"

    }
}
if (localStorage.getItem("chooseTheme") === "themeNigth") {
    changeTheme("themeNigth");
} else {
    changeTheme("themeDay");
}

// funcion que permite el cambio de tema desde la seccion Mis Gifos
let mouseClickArrow = true;
ARROW_DROPDOWN.addEventListener("click", () => {
    if (mouseClickArrow) {
        let containerSailorsVisible = document.querySelector(".containerSailors").style.visibility = "visible"
    } else {
        let containerSailorsHidden = document.querySelector(".containerSailors").style.visibility = "hidden"
    }
    ARROW_DROPDOWN.addEventListener('mouseup', () => {
        !mouseClickArrow ? mouseClickArrow = true : mouseClickArrow = false;
    })
    mouseClickArrow = true
})

// addEventListener de los botones sailorDay y SailoNigth de la seccion Mis Gifos
BUTTON_SAILOR_NIGTH.addEventListener("click", () => {
    changeTheme("themeNigth");


});
BUTTON_SAILOR_DAY.addEventListener("click", () => {
    changeTheme("themeDay");

});


// addEventListener de boton  comenzar a crear Gifos
BUTTON_START_CREATE_GIF.addEventListener("click", () => {
    noHiddenElements()
    hiddenElements()
    allow()
})

// funcion que hace visible la 2da ventana de crear gifos
function hiddenElements() {
    for (let i = 0; i < HIDDEN.length; i++) {
        HIDDEN[i].style.display = "block"
    }
    BUTTONS_RECORD.style.display = "flex"
    IMAGE_CAPTURE.style.display = "inline-block"
    BUTTON_CAPTURE.style.display = "inline-block"
    BLOCK_CREATE_GIF.className = "blockCreateGifNew"

}

// funcion que oculta los elementos de la primer ventana de crear gifos
function noHiddenElements() {
    for (let i = 0; i < NO_HIDDEN.length; i++) {
        NO_HIDDEN[i].style.display = "none"
    }
}

// // funcion de permiso para grabar gifos

function allow() {
    navigator.mediaDevices.getUserMedia(

        {
            audio: false,
            video: true,
        }
    ).then(function(mediaStream) {
        let video = document.getElementById("video")
        containerStream = mediaStream
        video.srcObject = mediaStream
        video.play()

    }).catch(function(error) {
        alert("You haven't allowed the use of the camera")
        console.log(error)
    })
}

// funcion que cambia el boton de la tercera solapa
function changeBotton() {
    BUTTONS_RECORD.style.display = "none"
    for (let i = 0; i < ELEMENT_STOP.length; i++) {
        ELEMENT_STOP[i].style.display = "inline-block"
    }
}
// funcion que cambia el primer titulo
function firstChangeTitle() {
    SECOND_TITLE.innerText = "Capturando Tu Guifo"
}

// funcion que hace visible el timer

function timerVisible() {
    for (let i = 0; i < ELEMENT_TIMER.length; i++) {
        ELEMENT_TIMER[i].style.display = "flex"
    }
}
// addEventListener del boton capturar
BUTTON_CAPTURE.addEventListener("click", () => {
    changeBotton()
    timerVisible()
    initTimer()
    startRecord(containerStream)
    firstChangeTitle()

})

// funcion donde comienza a grabar
function startRecord(stream) {
    recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        higth: 240,
        timeSlice: 1000,
        onGifRecordingStarted: function() {
            console.log("Your Gif start record");
        },
    });
    recorder.startRecording();
    recorder.camera = stream

}
// funcion de stop de grabacion 
function stopRecord() {
    blobGif = recorder.getBlob();
    recorder.camera.stop();
    console.log('Gif recording stopped: ' + bytesToSize(recorder.getBlob().size));
}

// addEventListener del boton "Listo" captura 
BUTTON_STOP_RECORD.addEventListener("click", () => {
    recorder.stopRecording(stopRecord)
    stopTimer()
    hiddenElementPreview()
    previewImageGif()
    showElementPreview()
    secondChangeTitle()
    initTwoProgressBar(bytesToSize(recorder.getBlob().size))
})

// addEventListener del boton Repetir captura
BUTTON_REPEAT.addEventListener("click", () => {
    hiddenElementsUpload()
    hiddenElements()
    IMAGE_GIF_PREVIEW.src = "";
    allow()
})


// funcion que me permite ver la imagen del preview
function previewImageGif() {
    recorder.getDataURL((dataURL) => {
        IMAGE_GIF_PREVIEW.src = dataURL
    })
}
// funciones que hacen visibles y esconden elementos en el preview
function hiddenElementPreview() {
    for (let i = 0; i < ELEMENT_STOP.length; i++) {
        ELEMENT_STOP[i].style.display = "none"
    }
    VIDEO.style.display = "none"
}

function showElementPreview() {
    for (let i = 0; i < ELEMENTS_HIDDEN.length; i++) {
        ELEMENTS_HIDDEN[i].style.display = "flex"
    }
    IMAGE_GIF_PREVIEW.style.display = "block"

}
// funcion que cambia el segundo titulo
function secondChangeTitle() {
    SECOND_TITLE.innerText = "Vista Previa"
}
// funcion que cambia el tercer titulo
function thirdChangeTitle() {
    SECOND_TITLE.innerText = "Subiendo GiF"
}
// timer
let interval;
const timeInterval = 30;

function initTimer() {
    let dateInitial = Date.now();
    interval = setInterval(() => {
        let newDate = Date.now();
        let trueDate = newDate - dateInitial;
        calculateTimeDuration(trueDate)
    }, timeInterval);
}

function calculateTimeDuration(milliseconds) {
    const milliSeconds = Math.floor((milliseconds % 1000) / 10)
    const seconds = Math.floor((milliseconds / 1000) % 60)
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60)
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24)
    trueTime(hours, minutes, seconds, milliSeconds)
}

function trueTime(hours, minutes, seconds, milliSeconds) {
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds ? '0' + seconds : seconds;
    milliSeconds = milliSeconds ? '0' + milliSeconds : milliSeconds;
    timer.innerText = `${hours}:${minutes}:${seconds}:${milliSeconds}`
}

function stopTimer() {
    clearInterval(interval);
}
// funcion que hace visibles los elementos de uploag Gif
function showElementUpload() {
    for (let i = 0; i < THIRD_HIDDEN.length; i++) {
        THIRD_HIDDEN[i].style.display = "flex"
    }
}

function hiddenElementsUpload() {
    for (let i = 0; i < ELEMENTS_HIDDEN.length; i++) {
        ELEMENTS_HIDDEN[i].style.display = "none"
    }
    IMAGE_GIF_PREVIEW.style.display = "none"
    CONTAINER_TIMER.style.display = "none"
}
// addEventListener del button subir
BUTTON_UPLOAD_GIF.addEventListener("click", () => {
    hiddenElementsUpload()
    showElementUpload()
    thirdChangeTitle()
    initProgressBar(bytesToSize(recorder.getBlob().size))
    uploadGif(blobGif)
})

// funcion que permite la carga del Gif a la URL
function uploadGif(blobGif) {
    console.log("Your Gif is uploading")
    var form = new FormData();
    form.append('file', blobGif, 'myGif.gif');
    fetch(`https://upload.giphy.com/v1/gifs?api_key=${APIKEY}&tags=myGif`, {
            method: 'POST',
            body: form,
            json: true,
            signal: signal
        })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log('The Load Finished');
            gifId = result.data.id;
            saveGifId(gifId);
            IMAGE_NEW_GIF.src = `https://media1.giphy.com/media/${gifId}/giphy.gif`
            showWindowSuccessUpload()
        })
        .catch((error) => {
            if (error.name == "AbortError") {
                alert('You have canceled the GIF upload')
                console.log(error)
            } else {
                alert('An error occurred when uploading your gif, in the console you can see more information');
                console.error(error);
            }

        })
}
// funcion que aborta el post del gif
function abortUploadGif() {
    console.log('Now aborting');
    controller.abort()
    location.reload()

}
// addEventListener del boton cancelar subir gif
CANCEL_UPLOAD.addEventListener("click", () => {
    abortUploadGif()
})

function hiddenUpload() {
    for (let i = 0; i < THIRD_HIDDEN.length; i++) {
        THIRD_HIDDEN[i].style.display = "none"
    }
}
// funcion que guarda en el localStorage los gifs creados por mi
function saveGifId(gif) {
    let jsonGifId = JSON.parse(localStorage.getItem("MyGif")) || [];
    jsonGifId.push(gif)
    localStorage.setItem("MyGif", JSON.stringify(jsonGifId))

    showMyGifs()

}
// funcion que me permite recorrer los gif almacenado en mi localStorage y mostrarlos
function showMyGifs() {

    let myGifos = JSON.parse(localStorage.getItem("MyGif")) || [];
    if (myGifos) {
        myGifos.forEach((element) => {
            fetch(`https://api.giphy.com/v1/gifs/${element}?api_key=${APIKEY}`)
                .then((response) => {
                    return response.json();
                })
                .then((gifs) => {
                    TEXT_MIS_GIF.style.display = "none"
                    const gif = gifs.data.images.original.url;
                    const title = gifs.data.title || '#MyGif';
                    createSpaceMyGifs(gif, title);
                })
                .catch((error) => {
                    console.error(`Your gif could not be created in the console you will see the error, ${error}`);
                });
        });
    }
}


// funcion que crea el lugar para poner mis gif (ojo cuando la probe lo tenia mas arriba volver a probar)
function createSpaceMyGifs(ourGif, tags) {
    const blockMyGif = document.createElement('div');
    blockMyGif.className = 'myGif';

    const imageMyGif = document.createElement('img');
    imageMyGif.className = 'imageMyGif';
    imageMyGif.src = ourGif;

    const tagMyGif = document.createElement('div');
    tagMyGif.className = 'textMyGif';

    const paragraph = document.createElement('p');
    paragraph.textContent = tags;

    tagMyGif.appendChild(paragraph);
    blockMyGif.appendChild(imageMyGif);
    blockMyGif.appendChild(tagMyGif);
    CONTAINER_IMAGE_MY_GIFS.appendChild(blockMyGif);
}

// funcion que hace visible la ventana de sus Gif se subio con Exito
function showWindowSuccessUpload() {
    WINDOW_SUCCESS_UPLOAD.style.display = "flex"
    BLOCK_CREATE_GIF.style.display = "none"
}
// funcion que permite copia url del gif
function copyUrl() {
    const createInputUrl = document.createElement("input")
    createInputUrl.value = `https://giphy.com/gifs/${gifId}`
    document.body.appendChild(createInputUrl);
    createInputUrl.select();
    document.execCommand("copy");
    document.body.removeChild(createInputUrl)
    alert(`The Url of your gif is ${createInputUrl.value} with "command v" or "control v" you can paste it in the search `)
}
//  addEventListener que permite descarcargar el gif
BUTTON_DOWNLOAD_GIF.addEventListener("click", () => {
    invokeSaveAsDialog(blobGif, 'myGif.gif');
});
// addEventListener que permite copiar url
BUTTON_COPY_URL.addEventListener("click", () => {
    copyUrl()
});
// funcion para que si se apreto el boton Mis MisGifos, se haga visible la section mis gifos y se oculte la otra seccion
function visibleSectionMisGifos() {
    if (localStorage.getItem("myGifos") === "visible") {
        CONTAINER_CREATE_GIF.style.display = "none"
        SECTION_MIS_GIFOS.style.display = "block"
        showMyGifs()

    } else {
        CONTAINER_CREATE_GIF.style.display = "block"
        SECTION_MIS_GIFOS.style.display = "none"
        showMyGifs()
    }
}
visibleSectionMisGifos()
BUTTON_CREATE_GIF.addEventListener("click", () => {
    CONTAINER_CREATE_GIF.style.display = "block"
    SECTION_MIS_GIFOS.style.display = "none"
})

// addEventListener del ultimo boton Listo, oculta bloque y muestra mis Gifs
LAST_BUTTON_READ.addEventListener("click", () => {
    hiddenLastElements()
})

function hiddenLastElements() {
    CONTAINER_CREATE_GIF.style.display = "none"
    SECTION_MIS_GIFOS.style.display = "block"
}

// progressBar


function initProgressBar(size) {
    const realSize = size.replace(/\D/g, "");
    if (progress == 0) {
        progress = 1;
        var width = 1;
        var id = setInterval(frame, realSize);

        function frame() {
            if (width >= 100) {
                clearInterval(id);
                progress = 0;
            } else {
                width++;
                MY_BAR.style.width = width + "%"
            }
        }
    }
}

function initTwoProgressBar(size) {
    const realSize = size.replace(/\D/g, "");
    if (twoProgressBar == 0) {
        twoProgressBar = 1;
        var widthTwo = 1;
        var idGif = setInterval(frame, realSize);

        function frame() {
            if (widthTwo >= 100) {
                clearInterval(idGif);
                twoProgressBar = 0;
            } else {
                widthTwo++;
                TWO_MY_BAR.style.width = widthTwo + "%"
            }
        }
    }
}