// ApiKey
var APIKEY = "Z2xU3p3HPPxR77IHkcSDYIfuvbF3Ydao"

// constantes
const ARROW_DROPDOWN = document.querySelector(".arrow")
const BUTTON_SAILOR_NIGTH = document.querySelector(".sailorNight")
const BUTTON_SAILOR_DAY = document.querySelector(".sailorDay")
const THEME_SAILOR_NIGHT = document.querySelector("#themeDay")
const THEME_SAILOR_DAY = document.querySelector("#themeDay")
const CONTAINER_SAILORS_VISIBLE = document.querySelector(".containerSailors")
const CONTAINER_SAILORS_HIDDEN = document.querySelector(".containerSailors")
const UNDERLINE_TEXT_SAILOR_DAY = document.querySelector(".underline1")
const CONTAINER_TRENDING = document.querySelector(".imagesTrend")
const TEXT_SEARCH = document.querySelector(".text-search")
const SEARCH_BUTTON = document.querySelector(".searchButton")
const BLOCK_AUTOCOMPLETE = document.querySelector(".searchBack")
const TEXT_BUTTON_AUTOCOMPLETE = document.querySelector(".textButton")
const IMAGE_BUTTON_SEARCH = document.querySelector(".lupa1")
const IMAGE_BUTTON_SEARCH_STYLE = document.querySelector(".imageButtonSearchStyle")
const blockSuggestion = document.querySelector(".suggestionBlock")
const TREND_BLOCK = document.querySelector(".trendBlock")
const TAGS_BLOCKS = document.querySelector(".tagsBlocks")
const TEXT_TREND = document.querySelector(".text-trend")
const BUTTON_CREATEGIF = document.querySelector(".button1")
const BUTTON_MIS_GIFOS = document.querySelector(".button3")
const BUTTON_VER_MAS = document.querySelector(".buttonVerMas1")
const ICONO = document.querySelector("#icono")

// contadores
let counterTextAutocomplete = 0
let counterButtonTags = 0
let gifCounter = 0;
let counterSpan = 0;

// variables
var arrayTags = []

// menu
let mouseClickArrow = true;
ARROW_DROPDOWN.addEventListener("click", () => {
    if (mouseClickArrow) {
        CONTAINER_SAILORS_VISIBLE.style.visibility = "visible"
    } else {
        CONTAINER_SAILORS_HIDDEN.style.visibility = "hidden"
    }
    ARROW_DROPDOWN.addEventListener('mouseup', () => {
        !mouseClickArrow ? mouseClickArrow = true : mouseClickArrow = false;
    })
    mouseClickArrow = true
})

// cambio de Theme
function changeTheme(theme) {
    localStorage.setItem("chooseTheme", theme)
    if (theme === "themeNigth") {
        THEME_SAILOR_NIGHT.href = "/css/themeNigth.css"
        document.querySelector(".logo1").src = "/assets/gifOF_logo_dark.png"
        IMAGE_BUTTON_SEARCH.src = "/assets/CombinedShape.svg"
        IMAGE_BUTTON_SEARCH_STYLE.src = "/assets/lupa_light.svg"
        IMAGE_BUTTON_SEARCH_STYLE.style.color = "white"
        UNDERLINE_TEXT_SAILOR_DAY.style.textDecoration = "none"
        ICONO.href = "/assets/sailorDark.ico"
    } else {
        THEME_SAILOR_DAY.href = "/css/themeDay.css"
        document.querySelector(".logo1").src = "/assets/gifOF_logo.png"
        IMAGE_BUTTON_SEARCH.src = "/assets/lupa_inactive.svg"
        IMAGE_BUTTON_SEARCH_STYLE.src = "/assets/lupa.svg"
        IMAGE_BUTTON_SEARCH_STYLE.style.color = "black"
        UNDERLINE_TEXT_SAILOR_DAY.style.textDecoration = "underline"
        ICONO.href = "/assets/sailorDay.ico"
    }
}
//   esto va a dejar por defecto el ThemeDay
if (localStorage.getItem("chooseTheme") === "themeNigth") {
    changeTheme("themeNigth");
} else {
    changeTheme("themeDay");
}
//click en botones para cambiar de Tema
BUTTON_SAILOR_NIGTH.addEventListener("click", () => {
    changeTheme("themeNigth");
});

BUTTON_SAILOR_DAY.addEventListener("click", () => {
    changeTheme("themeDay");

});

// addEventListener button Search
SEARCH_BUTTON.addEventListener("click", () => {

    var contentSearch = TEXT_SEARCH.value.toUpperCase();
    searchGif(contentSearch)
    TEXT_TREND.innerText = `Resultados de : ${contentSearch}`
    CleanTrending()
    CleanWordAutocomplete()

})

// addEvenlistener para cuando tipeas en la barra de busqueda
let input = true
TEXT_SEARCH.addEventListener("input", () => {
    if (input) {
        searchAutocompleteGif()
    } else {
        CleanWordAutocomplete()
        searchAutocompleteGif()
    }
    changeColorButtonSearch()

})

// funcion que borra el autocomplete
function CleanWordAutocomplete() {
    const removeWordAutocomplete = document.querySelectorAll(".blockAutocomplete");
    removeWordAutocomplete.forEach(element => element.remove());
}
// funcion que cambia el color del boton de busqueda cuando esta escribiendo el input
function changeColorButtonSearch() {
    var inputContent = TEXT_SEARCH.value
    if (inputContent === "") {
        SEARCH_BUTTON.className = "searchButton"
        TEXT_BUTTON_AUTOCOMPLETE.className = "textButton"
        IMAGE_BUTTON_SEARCH.className = "lupa1"
        IMAGE_BUTTON_SEARCH.style.display = "inline-block"
        IMAGE_BUTTON_SEARCH_STYLE.style.display = "none"
    } else {
        SEARCH_BUTTON.className = "searchButtonAutocomplete"
        TEXT_BUTTON_AUTOCOMPLETE.className = "textButtonAutocomplete"
        IMAGE_BUTTON_SEARCH.style.display = "none"
        IMAGE_BUTTON_SEARCH_STYLE.style.display = "inline-block"
    }

}

// Funcion de endopoint de la busqueda
function searchGif(search) {
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&q=${search}&limit=25&offset=0&rating=G&lang=en`)
        .then(response => {
            return response.json()
        })
        .then(result => {
            gridGif(result)
            redirect()
            localStorage.setItem("palabra buscada", `${search}`)
            arrayTags.push(localStorage.getItem('palabra buscada'))
            createTags()
        })
}
// funcion que borra las tendencias cuando se realiza una nueva busqueda
function CleanTrending() {
    const removeTrendingGrilla = document.querySelectorAll(".imageTrend");
    removeTrendingGrilla.forEach(element => element.remove());
}
// funcion que traer Endpoint para autocompletar en la busqueda
function searchAutocompleteGif() {
    var autocomplete = TEXT_SEARCH.value;
    fetch(`https://api.giphy.com/v1/gifs/search/tags?api_key=${APIKEY}&q=${autocomplete}&limit=3`)
        .then(resolve => {
            return resolve.json()
        })
        .then(resolve => {
            createBlockAutocomplete(resolve)
        })

}
// funcion que crea block de busqueda
function createBlockAutocomplete(resolveAutocomplete) {
    var blockWordAutocomplete = document.createElement("div")
    blockWordAutocomplete.className = "blockAutocomplete"
    for (let i = 0; i < resolveAutocomplete.data.length; i++) {
        counterTextAutocomplete++
        const elementAutocomplete = resolveAutocomplete.data[i];
        const wordAutocomplet = elementAutocomplete.name.toUpperCase()
        var buttonAutocomplete = document.createElement("button")
        buttonAutocomplete.className = "buttonAutocomplete"
        var textAutocomplete = document.createElement("span")
        textAutocomplete.className = `textAutocomplete`
        textAutocomplete.setAttribute = ("id", `textAutocompleteApi ${counterTextAutocomplete}`)
        textAutocomplete.innerText = `${wordAutocomplet}`
        buttonAutocomplete.appendChild(textAutocomplete)
        blockWordAutocomplete.appendChild(buttonAutocomplete)
        BLOCK_AUTOCOMPLETE.appendChild(blockWordAutocomplete)
        buttonAutocomplete.addEventListener("click", () => {
            searchGif(wordAutocomplet)
            CleanTrending()
            CleanWordAutocomplete()
            TEXT_TREND.innerText = `Resultados de : ${wordAutocomplet}`
        })
    }

    return input = false

}

// funcion que scrollea hasta la seccion tendencias
function redirect() {
    TREND_BLOCK.scrollIntoView({ behavior: "smooth" })
}

// funcion que crea Tags para la busqueda
function createTags() {
    for (let i = 0; i < arrayTags.length; i++) {
        const element = arrayTags[i].toUpperCase();
        counterButtonTags++
        noRepeatButtonsTags(arrayTags)
        const buttonTags = document.createElement("button")
        buttonTags.className = "buttonTags"
        const textTags = document.createElement("span")
        textTags.className = "textTags"
        textTags.setAttribute = ("id", `textTags ${counterButtonTags}`)
        textTags.innerText = `#${element}`
        buttonTags.appendChild(textTags)
        TAGS_BLOCKS.appendChild(buttonTags)
        buttonTags.addEventListener("click", () => {
            searchGif(element)
            CleanTrending()
            TEXT_TREND.innerText = `Resultados de : ${element}`
        })
    }

}
// funcion que hace que los tags no se repitan
function noRepeatButtonsTags(tags) {
    if (tags.length > 0) {
        tags.shift()
    }
}

// GET GIFOS
// Funcion que me trae el enpoint de las cuatro primeras sugerencias y crea sus contenedores
async function suggestion() {
    let api = await fetch(`https://api.giphy.com/v1/gifs/trending?&api_key=${APIKEY}&limit=4`)
    let traer = await api.json()
    return traer
}
suggestion().then(resultado => {
    createSuggestion(resultado)

})

// funcion que crea todos los gif de suggestion
function createSuggestion(resultado) {
    for (let i = 0; i < resultado.data.length; i++) {
        const element = resultado.data[i];
        var usuario = element.title
        var img = element.images.original.url
        let searchtextSuggestion = usuario.indexOf("GIF")
        var newName = usuario.substring(0, searchtextSuggestion)
        let imageSuggestion = document.createElement("div")
        imageSuggestion.className = "imageSuggestion1"
        let hashtag1 = document.createElement("div")
        hashtag1.className = "hashtag1"
        let textHashtag = document.createElement("p")
        textHashtag.className = "text-hashtag1"
        textHashtag.textContent = `#${newName}`
        let buttonCloseHastag = document.createElement("img")
        buttonCloseHastag.className = "buttonCloseHashtag1"
        buttonCloseHastag.src = "/assets/buttonClose.svg"
        imageSuggestion.appendChild(hashtag1)
        hashtag1.appendChild(textHashtag)
        hashtag1.appendChild(buttonCloseHastag)
        let contenedorImageButton = document.createElement("div")
        contenedorImageButton.className = "contenedorImageButton1"
        let buttonVerMas1 = document.createElement("button")
        buttonVerMas1.className = "buttonVerMas1"
        buttonVerMas1.textContent = "Ver mas..."
        buttonVerMas1.setAttribute("name", newName)
        let imageHashtag1 = document.createElement("img")
        imageHashtag1.className = "imageHashtag1"
        imageHashtag1.src = `${img}`
        contenedorImageButton.appendChild(imageHashtag1)
        contenedorImageButton.appendChild(buttonVerMas1)
        var contenedor = document.querySelector(".images")
        imageSuggestion.appendChild(hashtag1)
        imageSuggestion.appendChild(contenedorImageButton)
        contenedor.appendChild(imageSuggestion)
        buttonVerMas1.addEventListener("click", () => {
            searchGif(buttonVerMas1.name)
            CleanTrending()
        })
    }
}
suggestion()

// funcion que me trae la data de la API para la grilla tendencias
async function trending() {
    let apiTrending = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${APIKEY}&limit=25&rating=G`)
    let trendingjson = await apiTrending.json()
    return trendingjson
}

trending().then((response) => {
    gridGif(response)
});

// Esta es la funcion que crea la grilla de Tendencias
function gridGif(trendingjson) {
    for (let i = 3; i < trendingjson.data.length; i++) {
        const element = trendingjson.data[i];
        gifCounter++
        var gifosTrendding = element.images.original.url
        var width = element.images.original.width
        const titleGifos = element.title.toLowerCase()
        var containerImageTrend = document.createElement("div")
        const imageGif = document.createElement("img")
        containerImageTrend.className = "imageTrend"
        containerImageTrend.setAttribute("id", `imageTrending ${gifCounter}`)
        imageGif.src = `${gifosTrendding}`
        containerImageTrend.appendChild(imageGif)
        CONTAINER_TRENDING.appendChild(containerImageTrend)
        const containerHashtagImage = document.getElementById(`imageTrending ${gifCounter}`)
        hashtagImageTrending(titleGifos, containerHashtagImage)
        if (counterSpan <= 4 && width >= 500) {
            containerImageTrend.classList.add("big-gif")
            counterSpan++

        }
    }
}
// funcion que crea los hashtag de las imagenes de tendencias
function hashtagImageTrending(titleGifos, containerHashtagImage) {
    const hashtagImage = document.createElement("span")
    hashtagImage.className = "hashtagImage"
    let gifName = `${titleGifos}`.replace(/ /g, " #");
    let searchtext = gifName.indexOf("#gif")
    let newGif = gifName.substring(0, searchtext)
    hashtagImage.textContent = `#${newGif}`;
    containerHashtagImage.appendChild(hashtagImage)
}


// localStorage que permite la seccion de Mis gifos

BUTTON_CREATEGIF.addEventListener("click", () => {
    visibleSectionMyGifos("invisible")
})
BUTTON_MIS_GIFOS.addEventListener("click", () => {
    visibleSectionMyGifos("visible")
})

function visibleSectionMyGifos(visibility) {
    localStorage.setItem("myGifos", visibility)
}