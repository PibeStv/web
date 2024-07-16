//#region Inicia la camara
Instascan.Camera.getCameras()
  .then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[0]);
    } else {
      alert("no cameras found");
    }
  })
  .catch(function (e) {
    console.error;
  });

let scanner = new Instascan.Scanner({
  video: document.getElementById("preview"),
});
//#endregion

//#region Carga sonido
const cargarSonido = function (fuente) {
  const sonido = document.createElement("audio");
  sonido.src = fuente;
  sonido.setAttribute("preload", "auto");
  sonido.setAttribute("controls", "none");
  sonido.style.display = "none"; // <-- oculto
  document.body.appendChild(sonido);
  return sonido;
};
//#endregion

//#region Evento al escanear el Codigo QR
scanner.addListener("scan", function (c) {
  document.getElementById("text").value = c; //guarda en el cuadro de texto con id = text, la informacion que posee el codigo qr escaneado.
  codigo = document.getElementById("text").value; //La informacion escaneada es guardada en una variable llamada codigo.
  const sonido = cargarSonido("Nextel.mp3"); //carga el sonido en una constante llamada sonido.
  sonido.play(); //reproduce el sonido
  QR(); // LLama a la funcion qr para q esta se ejecute.
});
//#endregion

//#region Funcion llamada por el evento ESCANEAR
function QR() {
  var today = new Date(); // crea un nuevo objeto `Date`
  var fechaHora = today.toLocaleString(); // obtener la fecha y la hora
  const aplicacion = document.querySelector(".container"); //dice que en este documento selecciona la region de codigo renombrada con la clase container para guardar su valor en la constante llamada aplicacion
  fetch("http://localhost:4000/personal1/") //se hace una peticion a la API
    .then((res) => res.json()) //convierte esta informacion en tipo "jeison"
    .then((data) => {
      data.forEach((personal1) => {
        //la inforacion que se revicio se hace un recorrido de cada elemento, de la tabla de la base de datos llamada "personal"
        const p = document.createElement("p"); //crea una etiqueta p
        const apli = document.querySelector(".imagen"); //selecciona el div con una clase llamada imagen donde se mostrara la imagen enviada de cloudinary
        //const nombre = document.createElement("p");
        //const cargo = document.createElement("p");
        if (personal1.Codigo == codigo) {
          //mientras hace el recorrido, se detiene en cada elemento y pregunta si el codigo de cada persona en la base de datos, es igual al codigo escaneado. si la respuesta es si. hace las siguientes lineas
          document.getElementById("name").value = personal1.Nombre; //en el cuadro de texto con id = name , coloca el nombre de la persona cuyo codigo concidio con el codigo de la base de datos
          document.getElementById("cargo").value = personal1.Cargo; //en el cuadro de texto con id = cargo , coloca el cargo de la persona cuyo codigo concidio con el codigo de la base de datos
          document.getElementById("code").value = personal1.Codigo; //en el cuadro de texto con id = code , coloca el codigo de la persona cuyo codigo concidio con el codigo de la base de datos
          document.getElementById("fecha").value = fechaHora; //en el cuadro de texto con id = fecha , coloca la fecha y hora actual.
          document.getElementById("url").value = personal1.Imagen; //en el cuadro de texto url se guarda la informacion del campo imagen de la base de datos

          url = document.getElementById("url").value; //la variable url guarda la url de la base de datos
          nombre = document.getElementById("name").value; //la variable nombre guarda el nombre de la BD
          cargo = document.getElementById("cargo").value; //la variable cargo guarda el cargo de la BD

          var img = new Image(300, 200); // se crea una imagen en la variable img
          img.src = url; //accede al atributo src de la imagen y se le envia la url
          apli.appendChild(img); //muestra en el frontend la imagen pedida
          apli.append(nombre, "          cargo:", cargo); //muestra en el frontend el nombre y cargo del empleado
        }
        aplicacion.appendChild(p); // como toda esta informacion se guardo en una constante p, ahora le indicamos a que parte del documento se ingresara, mas arriba se vio q es al container.
      });
    });
}
//#endregion

//#region Marcacion MANUAL
function QR_manual() {
  var today = new Date();
  var fechaHora = today.toLocaleString();
  manual = document.getElementById("text").value;
  const aplicacion = document.querySelector(".container");
  fetch("http://localhost:4000/personal1/")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((personal1) => {
        const p = document.createElement("p");
        const apli = document.querySelector(".imagen");
        if (personal1.Codigo == manual) {
          document.getElementById("name").value = personal1.Nombre;
          document.getElementById("cargo").value = personal1.Cargo;
          document.getElementById("code").value = personal1.Codigo;
          document.getElementById("fecha").value = fechaHora;
          document.getElementById("url").value = personal1.Imagen;
          url = document.getElementById("url").value;
          nombre = document.getElementById("name").value;
          cargo = document.getElementById("cargo").value;
          var img = new Image(300, 200);
          img.src = url;
          apli.appendChild(img);
          apli.appendChild(img);
          apli.append(nombre, "........", cargo);
        }
        aplicacion.appendChild(p);
      });
    });
}
//#endregion

//#region Boton para la Marcacion MANUAL
btnQr_manual.onclick = () => {
  const sonido = cargarSonido("Nextel.mp3"); //carga el sonido
  sonido.play(); //reproduce el sonido
  QR_manual(); //llama a la funcion
};
//#endregion

//#region Boton de prueba
btn_url.onclick = () => {
  async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  
  postData("http://localhost:4000/personal1", { 
    nombre: document.getElementById("name").value,
    cargo: document.getElementById("cargo").value,
    codigo: document.getElementById("code").value,
    imagen: document.getElementById("url").value.replace(/["']/g, "")

  }).then((data) => {
    console.log(data); // JSON data parsed by `data.json()` call
  });
}
//#endregion
