"use strict";
let botonInicio = document.querySelector("#anchor-inicio")
let botonTienda = document.querySelector("#anchor-tienda");
let botonContacto = document.querySelector("#anchor-contacto");

let main = document.querySelector("#use-ajax");
botonInicio.addEventListener("click", function (e) {
    e.preventDefault();
    inicioLoad();
});
botonTienda.addEventListener("click", function (e) {
    e.preventDefault();
    tiendaLoad();
});
botonContacto.addEventListener("click", function (e) {
    e.preventDefault();
    contactoLoad();
});


inicioLoad();

async function inicioLoad() {
    try {
        let res = await fetch("partial/inicio.html");
        let html = await res.text()

        main.innerHTML = html;

    } catch (error) {
        console.log(error)
    }

}

async function tiendaLoad() {
    try {
        let res = await fetch("partial/tienda.html");
        let html = await res.text()

        main.innerHTML = html;

    } catch (error) {
        console.log(error)
    }
    cargarTabla();
}

async function contactoLoad() {
    try {
        let res = await fetch("partial/contacto.html");
        let html = await res.text()

        main.innerHTML = html;

    } catch (error) {
        console.log(error)
    }
    cargarCaptcha();
}

//function para cargar tabla
function cargarTabla() {
    let botonAgregar = document.querySelector("#btn-agregar");
    let botonAgregarTres = document.querySelector("#btn-agregar-tres");
    let botonsiguente = document.querySelector("#btn-siguiente");
    let botonanterior = document.querySelector("#btn-anterior");
    let botonBuscar = document.querySelector("#btn-buscar");

    botonAgregar.addEventListener("click", function (e) {
        agregar(1);
    });
    botonAgregarTres.addEventListener("click", function (e) {
        agregar(3);
    });

    let pageNum = 1;
    const url = "https://631fea4be3bdd81d8eef261e.mockapi.io/juegos";
    let id = 0;
    let pageNumview = document.querySelector("#pageNum");


    mostrarDatosTabla();


    botonsiguente.addEventListener("click", function (e) {
        e.preventDefault

        pageNum = pageNum + 1

        pageNumview.innerHTML = pageNum; // esto es para que el usuario sepa en que pagina esta 

        mostrarDatosTabla();
    });

    //boton de busqueda

    botonBuscar.addEventListener("click", async function (e) {
        e.preventDefault();

        let formTable = document.querySelector("#form-insertar-tabla");
        let form = new FormData(formTable);
        let input = form.get("buscador");
        let tbody = document.querySelector("#insertarTabla");
        tbody.innerHTML = "";

        try {
            let res = await fetch(url);

            let json = await res.json();

            for (const juegos of json) {
                if (juegos.titulo == input) {
                    tbody.innerHTML += `<tr>          
                <td> ${juegos.titulo}</td>
                <td> ${juegos.cantidad}</td>
                <td> ${juegos.precio}</td>
                <td><button data-id ="${juegos.id}" class="btn-eliminar">Eliminar</button></td>
                <td><button data-id ="${juegos.id}" class="btn-editar">Editar</button></td>
                </tr>`;
                }
            }
        } catch (error) {
            console.log(error);
        }
    })



    botonanterior.addEventListener("click", function (e) {
        e.preventDefault
        if (pageNum > 1) {

            pageNum = pageNum - 1;
            pageNumview.innerHTML = pageNum;

            mostrarDatosTabla();
        }
    });


    /*Funcion asicronica de carga de datos*/
    async function mostrarDatosTabla() {
        const tabla = document.getElementById("insertarTabla");
        tabla.innerHTML = "";

        pageNumview.innerHTML = pageNum;
        try {
            /*Hago fetch mediante la variable "res" para llamar al api,
            y aplico los parametros necesarios para la paginacion*/
            let res = await fetch(`${url}/?page=${pageNum}&limit=5`);
            /*Mediante la variable "json" tomo los datos del url (que seria "res") y los convierto a formato json*/
            let json = await res.json();
            /*Hago un forof para recorrer todos los datos del api e imprimirlos en la tabla dinamica*/
            for (const juegos of json) {
                if (juegos.precio < 500) {
                    tabla.innerHTML += `<tr>          
                                        <td> ${juegos.titulo}</td>
                                        <td> ${juegos.cantidad}</td>
                                        <td id ="resaltado-naranja"> ${juegos.precio}</td>
                                        <td><button data-id ="${juegos.id}" class="btn-eliminar">Eliminar</button></td>
                                        <td><button data-id ="${juegos.id}" class="btn-editar">Editar</button></td>
                                    </tr>`;
                } else if (juegos.precio >= 500) {
                    tabla.innerHTML += `<tr>          
                                        <td> ${juegos.titulo}</td>
                                        <td> ${juegos.cantidad}</td>
                                        <td id ="resaltado-verde"> ${juegos.precio}</td>
                                        <td><button data-id ="${juegos.id}" class="btn-eliminar">Eliminar</button></td>
                                        <td><button data-id ="${juegos.id}" class="btn-editar">Editar</button></td>
                                    </tr>`;
                }
                /*Creo dos botones "Eliminar" y "Editar"*/
            }
            document.querySelectorAll(".btn-eliminar").forEach((boton) => {
                boton.addEventListener("click", eliminar);
            });
            document.querySelectorAll(".btn-editar").forEach((boton) => {
                boton.addEventListener("click", editar);
            });
        } catch (error) {

        }
    }
    /*Funcion para eliminar una fila seleccionada por el usuario*/
    async function eliminar(e) {
        e.preventDefault();
        let borrarId = this.dataset.id;
        let msj = document.querySelector("#msj");
        try {
            let res = await fetch(`${url}/${borrarId}`, {
                method: "DELETE",
            });
            /* forma de verificar si el metodo se ejecuta correctamenten*/
            if (res.status == 200) {
                msj.innerHTML = `Eliminado correctamente!`;
            }
        } catch (error) {

        }
        /*Llamo a la función para mostrar la tabla ya actualizada con el json que se haya borrado*/
        mostrarDatosTabla();
    }

    async function agregar(numero) {
        let formTable = document.querySelector("#form-insertar-tabla");
        /*Creo la variable form para enviarle los datos del formulario
        usando la variable formTable como parametro de envio de dichos datos*/
        let form = new FormData(formTable);

        let msj = document.querySelector("#msj");

        let titulo = form.get("titulo");
        let cantidad = form.get("cantidad");
        let precio = form.get("precio");

        /*Se agregan los datos en formato JSON ingresados por el usuario en el api, y a su vez en la tabla*/
        let juegos = {
            titulo: titulo,
            cantidad: cantidad,
            precio: precio,
        };

        for (let i = 0; i < numero; i++) {
            try {
                /*Se agrega el JSON, avisandole al servidor que es un JSON, y finalmente se lo convierte en string para agregarse en la API*/
                let res = await fetch(url, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(juegos),
                });
                if (res.status == 201) {
                    msj.innerHTML = `${juegos.titulo} fue creado correctamente!`;
                }
            } catch (error) {
                console.log(error);
            }
        }
        mostrarDatosTabla();
    }

    async function editar(e) {
        e.preventDefault();

        let msj = document.querySelector("#msj");
        let formTable = document.querySelector("#form-insertar-tabla");
        let form = new FormData(formTable);

        let titulo = form.get("titulo");
        let cantidad = form.get("cantidad");
        let precio = form.get("precio");

        /*Si los inputs del formulario estan vacios al momento de apretar el boton "Editar",
        mediante la variable "msj" se le dice al usuario que ingrese sus nuevos datos
        en dichos inputs y vuelva a presionar el boton "Editar"
        de la fila correspondiente a editar*/
        if (titulo == "" || cantidad == "" || precio == "") {
            msj.innerHTML = `Ingrese los datos nuevos aqui y vuelva a presionar el boton editar!`;
        }
        else {
            let juegos = {
                titulo: titulo,
                cantidad: cantidad,
                precio: precio,
            };
            let editarId = this.dataset.id;

            try {
                let res = await fetch(`${url}/${editarId}`, {
                    method: "PUT",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(juegos),
                });
                if (res.status === 200) {
                    msj.innerHTML = `${juegos.nombre} editado correctamente!`;
                }
            } catch (error) {
                console.log(error);
            }
            mostrarDatosTabla();
        }
    }
}

function cargarCaptcha() {

    let valorCaptcha = document.getElementById('codigo');
    let formulario = document.getElementById('respuesta');
    let submitButton = document.getElementById('enviar');
    let refreshButton = document.getElementById('reset');

    //se llama la funcion que genera el codigo captcha
    generateCaptchaCode();

    submitButton.addEventListener('click', testear);
    refreshButton.addEventListener('click', generateCaptchaCode);

    function generateCaptchaCode() {
        //se vacía el parrafo del html para que no quede superpuesto con el anterior al resetear
        document.getElementById('resultado').innerHTML = " ";

        let captchaRandom = Math.floor(Math.random() * 60000) + 10000;

        let captchaCode = captchaRandom;
        valorCaptcha.innerHTML = captchaCode;

    }

    function testear(e) {
        e.preventDefault();
        if (formulario.value == valorCaptcha.textContent) {
            let parrafo = document.getElementById('resultado');
            parrafo.innerHTML = "Captcha VALIDO";
            document.getElementById('email').value = "";
            document.getElementById('tel').value = "";
        }
        else {
            let parrafo = document.getElementById('resultado');
            parrafo.innerHTML = "Captcha INVALIDO";
        }
    }


}