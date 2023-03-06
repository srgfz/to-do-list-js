//Selecciono los elementos por el id:
const container = document.querySelector("#container")
const texttask = document.querySelector("#texttask")
const errortext = document.querySelector("#errortext")
const datetask = document.querySelector("#datetask")
const errordate = document.querySelector("#errordate")
const buttons = document.querySelector("#buttons")
const buttonRed = document.querySelector("#red")
const buttonOrange = document.querySelector("#orange")
const buttonGreen = document.querySelector("#green")
const btnaniadir = document.querySelector("#btnaniadir")
const errorcolor = document.querySelector("#errorcolor")
const tasks = document.querySelector("#tasks")
const buttons__task = Array.from(document.querySelectorAll(".buttons__task"))
let cronometros = []//Array para ir guardando todas las cuentas atrás

//*FUNCIONES:
const comprobarDescripcionLongitud = (tecla) => {//*Función para comprobar que la descripción no supera los 50 caracteres
    if (texttask.value.length > 50) {//Si la tarea supera los 50 caracteres
        errortext.textContent = "La descripción de la tarea no puede superar los 50 caracteres"
        texttask.classList.add("errorinput")
    } else {//Si la tarea no supera los 50 caracteres
        errortext.textContent = ""
        texttask.classList.remove("errorinput")
    }
}

const comprobarDescripciónVacío = () => {//*Función para comprobar que si el input está vacío
    if (texttask.value.trim() === "") {//Compruebo si el input de la descripción de la terea está vacío
        errortext.textContent = "La descripción de la tarea está vacía"
        texttask.classList.add("errorinput")
    } else {//Si no está vacío
        errortext.textContent = ""
        texttask.classList.remove("errorinput")
    }
}

const validarFecha = () => {//*Función para comprobar la fecha seleccionada
    let fechaTarea = new Date(datetask.value)//Guardo la fecha seleccionada para la tarea en un objeto Date
    let now = new Date()//Guardo la fecha actual
    if (datetask.value.trim() === "") {//Si el input de la fecha está vacío
        errordate.textContent = "Para crear una tarea debe introducir una fecha y una hora"
        datetask.classList.add("errorinput")
    } else if (now >= fechaTarea) {//Si la fecha de la Tarea es anterior a la fecha actual
        errordate.textContent = "La fecha indicada para la tarea no puede ser anterior a la fecha actual"
        datetask.classList.add("errorinput")
    } else {//Si está bien
        errordate.textContent = ""
        datetask.classList.remove("errorinput")
    }
}

const marcarPrioridad = (prioridad) => {//*Función para marcar la prioridad que tendrá la tarea
    buttons__task.forEach(element => {
        if (element !== prioridad) {//Borro la clase del borde en todos los elementos menos en el seleccionado
            element.classList.remove("border")
        }
    })
    errorcolor.textContent = ""
    prioridad.classList.toggle("border")//Añado la clase en el elemento seleccionado
}

const validarPrioridad = () => {//*Función para comprobar que se ha seleccionado la prioridad de la tarea
    if (buttons__task.some(element => element.classList.contains("border"))) {//Si ha seleccionado la prioridad
        errorcolor.textContent = ""
    } else {//Si no ha seleccionado la prioridad
        errorcolor.textContent = "Debe seleccionar la prioridad de la tarea"
    }
}

const addTarea = () => {//*Función para añadir la tarea
    //Guardo los elementos que tendrá la tarea
    let descripcionTarea = texttask.value.trim()
    let fechaTarea = new Date(datetask.value)
    let prioridad = buttons__task[buttons__task.findIndex(element => element.classList.contains("border"))]
    let fragment = document.createDocumentFragment()//Fragment donde añadiré los elementos de la tarea
    //Creo el contenedor de la tarea
    let nuevaTarea = document.createElement("DIV")
    nuevaTarea.classList.add(prioridad.getAttribute("id"), "containertask")
    //Creo los elementos (los children) de la tarea y les doy atributos
    let checkboxTarea = document.createElement("INPUT")
    checkboxTarea.setAttribute("type", "checkbox")
    checkboxTarea.classList.add("containertask__checkbox")
    let pDescripcionTarea = document.createElement("SPAN")
    pDescripcionTarea.textContent = descripcionTarea
    pDescripcionTarea.classList.add("containertask__text", "containertask__text--description")
    let pFechaTarea = document.createElement("SPAN")
    pFechaTarea.classList.add("containertask__text", "containertask__text--crono")
    let botonCerrarTarea = document.createElement("IMG")
    botonCerrarTarea.setAttribute("src", "./images/cerrar.svg")
    botonCerrarTarea.classList.add("containertask__img")

    //*Función del cronometro de la tarea. **Esta función debe ser una función local dentro de la tarea que se va a añadir para que cada cronometro tenga su propio controlador y poder pararlo luego haciendo referencia a dicho controlador en el clearInterval()
    const cronometroTarea = (pfechaTarea, fechaTarea) => {//*Función para calcular el tiempo de vida que le queda a la tarea
        //Guardo las unidades de tiempo en su equivalente en milisegundos
        const milliseconds_second = 1000//1000 milisegundos es un segundo
        const milliseconds_minute = 60 * milliseconds_second
        const milliseconds_hour = 60 * milliseconds_minute
        const milliseconds_day = 24 * milliseconds_hour
        let now = new Date()
        let tiempoRestanteTarea = fechaTarea - now//Voy actualizando el tiempo restante respecto a la fecha actual a cada segundo que se llama a la función
        //Variables donde guardaré el tiempo que queda:
        let segundosRestantes = 0
        let minutosRestantes = 0
        let horasRestantes = 0
        let diasRestantes = 0
        //Transformo las milesimas a las distintas medidas:
        if (tiempoRestanteTarea >= 0 || isNaN(tiempoRestanteTarea)) {//Si queda tiempo hasta el vencimiento de la tarea
            //Empiezo de más a menos:
            //Primero hago la división normal para los días y luego voy dividiendo el resto de cada unidad de medida superior entre la unidad de medida que quiero sacar
            diasRestantes = Math.floor(tiempoRestanteTarea / milliseconds_day)
            horasRestantes = Math.floor((tiempoRestanteTarea % milliseconds_day) / milliseconds_hour)
            minutosRestantes = Math.floor((tiempoRestanteTarea % milliseconds_hour) / milliseconds_minute)
            segundosRestantes = Math.floor((tiempoRestanteTarea % milliseconds_minute) / milliseconds_second)
        } else {//Si la tarea ya ha expirado detengo el crono
            clearInterval(cronometro)
        }
        //Doy el valor del tiempo restante formateado
        console.log(diasRestantes + "D:" + horasRestantes + "H:" + minutosRestantes + "M:" + segundosRestantes)//Para comprobar si los contadores paran
        pfechaTarea.textContent = diasRestantes + "D:" + horasRestantes + "H:" + minutosRestantes + "M:" + segundosRestantes
    }
    //Llamo a las funciones para iniciar y controlar el cronometro de la tarea
    cronometroTarea(pFechaTarea, fechaTarea)//Primera llamada para añadir el cronometro desde el segundo cero
    let cronometro = (setInterval(() => { cronometroTarea(pFechaTarea, fechaTarea) }, 1000))//Función que se repetirá cada segundo
    cronometros.push(cronometro)//Añado el controlador al array de cronometros

    //Añado los elementos al fragment
    fragment.appendChild(checkboxTarea)
    fragment.appendChild(pDescripcionTarea)
    fragment.appendChild(pFechaTarea)
    fragment.appendChild(botonCerrarTarea)
    //Añado el fragment a sus padres
    nuevaTarea.appendChild(fragment)
    tasks.appendChild(nuevaTarea)
}

const toDoList = (ev) => {//*Función general de toDoList
    let boton = ev.target
    let tareas = Array.from(boton.parentElement.parentElement.children)
    if (boton.parentElement.id.toLowerCase() === "btnaniadir" || boton.id.toLowerCase() === "btnaniadir") {//Botón de añadir tarea
        comprobarDescripciónVacío()//Compruebo que el input de la tarea no esté vacío
        validarFecha()// Compruebo la fecha
        validarPrioridad()//Compruebo que haya marcado la prioridad de la tarea
        if (errortext.textContent === "" && errordate.textContent === "" && errorcolor.textContent === "") {//Si no hay mensajes de error estará todo correcto para añadir la tarea
            addTarea()//Añado la tarea
            //Reseteo los input y la prioridad
            texttask.value = ""
            datetask.value = ""
            buttons__task.forEach(botonPrioridad => botonPrioridad.classList.remove("border"))
        }
    } else if (boton.className.includes("buttons__task")) {//Botones de prioridad
        marcarPrioridad(boton)
    } else if (boton.classList.contains("containertask__checkbox")) {//Checkbox de la tarea
        cronometros.slice(tareas.findIndex(tarea => tarea.firstChild === boton) - 2, 1)//Borro el controlador del cronometro del array
        clearInterval(cronometros[tareas.findIndex(tarea => tarea.firstChild === boton) - 2])//paro el crono
        boton.parentElement.lastElementChild.previousElementSibling.remove()//Borro el contador
        boton.disabled = true //Deshabilito el checkbox
    } else if (boton.classList.contains("containertask__img")) {//Botón de eliminar la tarea
        //boton.parentElement.remove() 
        //*En vez de borrar la tarea la oculto para llevar siempre el array de cronometros siempre a la par que el número de hijos de tareas
        boton.parentElement.classList.add("display__none")
        if (!boton.parentElement.firstElementChild.getAttribute("disabled")) {//Si el crono no se ha borrado antes con el checkbox lo paro ahora
            clearInterval(cronometros[tareas.findIndex(tarea => tarea.lastElementChild === boton) - 2])//paro el crono
        }
    }
}

//*LISTENERS:
texttask.addEventListener("keyup", comprobarDescripcionLongitud)
container.addEventListener("click", toDoList)