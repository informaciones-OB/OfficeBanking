/* eslint-disable @typescript-eslint/no-unused-vars */
// Get all the links inside the menu
document.querySelector('#dropdown-accesibilidad .dropdown-menu').addEventListener('click', function (event) {
  event.stopPropagation();
});

const changeFont = (actualFontSize, updater) => {
  return actualFontSize + (updater);
}

//const allEle = document.querySelectorAll('h1');
let updater = 2;
let _count = 0;
let _countUp = 0;
let _countDown = 0;

const incrementButton = document.getElementById('dropdown-acc-1');
const decreaseButton = document.getElementById('dropdown-acc-2');
const grayscaleActive = document.getElementById("dropdown-acc-3");
const resetButton = document.getElementById('dropdown-acc-4');


incrementButton.addEventListener('click', () => {
  const allEle = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a');
  if (_countUp < 3) {
    allEle.forEach(el => {
      const elFontSize = Math.round(Number(window.getComputedStyle(el).fontSize.split('px')[0]));
      const updatedFontSize = changeFont(elFontSize, updater);
      const prevElStyle = el.style.cssText;
      el.style.cssText = `${prevElStyle} font-size: ${updatedFontSize}px !important;`;
    })
    _count++;
    _countUp++;
    _countDown--;
    decreaseButton.classList.remove('disabled');
    decreaseButton.removeAttribute('disabled');
  }

  if (_countUp == 3) {
    incrementButton.classList.add('disabled');
    incrementButton.setAttribute('disabled', 'disabled');
  }

  //Envia identificador mas informacion a guardar
  var dataAccesibilidad = {
    _count: _count,
    _countUp: _countUp,
    _countDown: _countDown,
    flag: 'aumentar'
  };
  setStoreLocal("_d4t4_4cc3_f0nt", dataAccesibilidad);

})

decreaseButton.addEventListener('click', () => {
  const allEle = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a');
  if (_countDown < 3) {
    allEle.forEach(el => {
      const elFontSize = Math.round(Number(window.getComputedStyle(el).fontSize.split('px')[0]));
      const updatedFontSize = changeFont(elFontSize, -updater);
      const prevElStyle = el.style.cssText;
      el.style.cssText = `${prevElStyle} font-size: ${updatedFontSize}px !important;`;
    })
    _count--;
    _countUp--;
    _countDown++;
    incrementButton.classList.remove('disabled');
    incrementButton.removeAttribute('disabled');
  }

  if (_countDown == 3) {
    decreaseButton.classList.add('disabled');
    decreaseButton.setAttribute('disabled', 'disabled');
  }

  //Envia identificador mas informacion a guardar
  var dataAccesibilidad = {
    _count: _count,
    _countUp: _countUp,
    _countDown: _countDown,
    flag: 'disminuir'
  };
  setStoreLocal("_d4t4_4cc3_f0nt", dataAccesibilidad);

})

resetButton.addEventListener('click', () => {
  const allEle = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a');
  allEle.forEach(el => {
    const elFontSize = Math.round(Number(window.getComputedStyle(el).fontSize.split('px')[0]));
    const updatedFontSize = elFontSize - (updater * _count)
    const prevElStyle = el.style.cssText;

    el.style.cssText = `${prevElStyle} font-size: ${updatedFontSize}px !important;`;
  })

  _count = 0;
  _countUp = 0;
  _countDown = 0;

  incrementButton.classList.remove('disabled');
  incrementButton.removeAttribute('disabled');

  decreaseButton.classList.remove('disabled');
  decreaseButton.removeAttribute('disabled');

  grayscaleActive.classList.remove('disabled');
  grayscaleActive.removeAttribute('disabled');

  // Style grayscale
  document.querySelector("body").style.filter = "grayscale(0)";
  document.querySelector('.btn-primary').classList.remove('btn-accesibilidad');
  document.querySelector('.btn-secondary').classList.remove('btn-accesibilidad');

  //Envia identificador mas informacion a guardar
  var dataAccesibilidad = { infograyscale: '' };
  setStoreLocal("_d4t4_4cc3", dataAccesibilidad);
  //Envia identificador mas informacion a guardar
  var dataFont = {
    _count: 0,
    _countUp: 0,
    _countDown: 0,
    flag: '0'
  };
  setStoreLocal("_d4t4_4cc3_f0nt", dataFont);

});

grayscaleActive.addEventListener('click', () => {
  //document.getElementById("home").style.filter = "grayscale(1)";
  document.querySelector("body").style.filter = "grayscale(1)";
  document.querySelector('.btn-primary').classList.add('btn-accesibilidad');
  document.querySelector('.btn-secondary').classList.add('btn-accesibilidad');

  grayscaleActive.classList.add('disabled');
  grayscaleActive.setAttribute('disabled', 'disabled');

  //Envia identificador mas informacion a guardar
  var dataAccesibilidad = { infograyscale: 'activado' };
  setStoreLocal("_d4t4_4cc3", dataAccesibilidad);

});

//cargar funcion al terminar de cargar el dom
window.addEventListener("load", function (event) {
  //set desde localstorage
  var dataGet = getStoreLocal("_d4t4_4cc3"); //data desde el formulario anterior
  if (dataGet) {
    if (dataGet.infograyscale == 'activado') {
      //elementosGrayscale(1);
      document.querySelector("body").style.filter = "grayscale(1)";
      document.querySelector('.btn-primary').classList.add('btn-accesibilidad');
      document.querySelector('.btn-secondary').classList.add('btn-accesibilidad');
      grayscaleActive.classList.add('disabled');
      grayscaleActive.setAttribute('disabled', 'disabled');
    }
  }

  //set desde localstorage
  var dataGetFont = getStoreLocal("_d4t4_4cc3_f0nt"); //data desde el formulario anterior
  if (dataGetFont) {
    const allEle = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a');
    if (dataGetFont.flag == "aumentar") {
      console.log("_countUp data", dataGetFont.flag)

      for (var i = 0; i < dataGetFont._countUp; i++) {
        allEle.forEach(el => {
          const elFontSize = Math.round(Number(window.getComputedStyle(el).fontSize.split('px')[0]));
          const updatedFontSize = changeFont(elFontSize, updater);
          const prevElStyle = el.style.cssText;

          el.style.cssText = `${prevElStyle} font-size: ${updatedFontSize}px !important;`;
        })
      }

      if (dataGetFont._countUp < 3) {
        decreaseButton.classList.remove('disabled');
        decreaseButton.removeAttribute('disabled');
      }

      if (dataGetFont._countUp == 3) {
        incrementButton.classList.add('disabled');
        incrementButton.setAttribute('disabled', 'disabled');
      }

      _count = dataGetFont._count;
      _countUp = dataGetFont._countUp;
      _countDown = dataGetFont._countDown;

    }


    if (dataGetFont.flag == "disminuir") {
      console.log("_countDown data", dataGetFont.flag)

      for (var i = 0; i < dataGetFont._countDown; i++) {
        allEle.forEach(el => {
          const elFontSize = Math.round(Number(window.getComputedStyle(el).fontSize.split('px')[0]));
          const updatedFontSize = changeFont(elFontSize, -updater);
          const prevElStyle = el.style.cssText;

          el.style.cssText = `${prevElStyle} font-size: ${updatedFontSize}px !important;`;
        })
      }

      if (dataGetFont._countDown < 3) {
        incrementButton.classList.remove('disabled');
        incrementButton.removeAttribute('disabled');
      }

      if (dataGetFont._countDown == 3) {
        decreaseButton.classList.add('disabled');
        decreaseButton.setAttribute('disabled', 'disabled');
      }

      _count = dataGetFont._count;
      _countUp = dataGetFont._countUp;
      _countDown = dataGetFont._countDown;

    }
  }

});

//Envia identificador mas informacion a guardar
//setStoreLocal("_d4t4", dataAccesibilidad);

//Almacena datos en local Storage
//key identificador de la data almacenada
//data datos almacenados en este caso son objetos 
function setStoreLocal(key, data) { //stores items in the localStorage
  //localStorage.setItem('test', 1);
  //window.sessionStorage.setItem(key,JSON.stringify(data));
  localStorage.setItem(key, JSON.stringify(data));
}

function getStoreLocal(key) { //retrieves items in the localStorage
  //return JSON.parse(window.sessionStorage.getItem(key)); //searches for the key in localStorage
  return JSON.parse(localStorage.getItem(key)); //searches for the key in localStorage
}

function removeItemStoreLocal(key) { //deletes item from localStorage
  //sessionStorage.removeItem(key); //passes key to the removeItem method
  localStorage.removeItem(key); //passes key to the removeItem method
}
