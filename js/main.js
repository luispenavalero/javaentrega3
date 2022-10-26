let agregarCarrito = document.getElementsByClassName("item__button");

const productos = [
    { id: "item01", titulo: "Hell He Lie", precio: 3.80, conteo: 0 },
    { id: "item02", titulo: "Lorem Ipsum", precio: 2.30, conteo: 0 },
    { id: "item03", titulo: "Norma", precio: 1.50, conteo: 0 },
    { id: "item04", titulo: "Los NO santos", precio: 2.50, conteo: 0 },
    { id: "item05", titulo: "Hachede", precio: 3.00, conteo: 0 },    
];

for(let i = 0; i < agregarCarrito.length; i++) {
    agregarCarrito[i].addEventListener("click", () => {
        conteoCarritoNav(productos[i]);
        costo(productos[i]);
    });
}

function productosCargados() {
    let cantidadProductos = localStorage.getItem("conteoCarrito");
    if( cantidadProductos ) {
        document.querySelector(".numberItemsCarrito").textContent = cantidadProductos;
    }
}

function conteoCarritoNav(producto, ejecutar) {
    let cantidadProductos = localStorage.getItem("conteoCarrito");
    cantidadProductos = parseInt(cantidadProductos);

    let items = localStorage.getItem("agregadosCarrito");
    items = JSON.parse(items);

    if( ejecutar ) {
        localStorage.setItem("conteoCarrito", cantidadProductos - 1);
        document.querySelector('.numberItemsCarrito').textContent = cantidadProductos - 1;
    } else if(cantidadProductos) {
        localStorage.setItem("conteoCarrito", cantidadProductos + 1);
        document.querySelector('.numberItemsCarrito').textContent = cantidadProductos + 1;
    } else {
        localStorage.setItem("conteoCarrito", 1);
        document.querySelector('.numberItemsCarrito').textContent = 1;
    }
    conteoCarrito(producto);
}

function conteoCarrito(producto) {

    let agregadosCarrito = localStorage.getItem('productosCarrito');
    agregadosCarrito = JSON.parse(agregadosCarrito);

    if(agregadosCarrito != null) {
        let productosActuales = producto.titulo;
    
        if( agregadosCarrito[productosActuales] == undefined ) {
            agregadosCarrito = {
                ...agregadosCarrito,
                [productosActuales]: producto
            }
        } 
        agregadosCarrito[productosActuales].conteo += 1;

    } else {
        producto.conteo = 1;
        agregadosCarrito = { 
            [producto.titulo]: producto
        };
    }

    localStorage.setItem('productosCarrito', JSON.stringify(agregadosCarrito));
}

function costo(producto, ejecutar) {
    let carritoCosto = localStorage.getItem("costo");

    if(ejecutar) {
        carritoCosto = parseInt(carritoCosto);
        localStorage.setItem("costo", carritoCosto - producto.precio);

    } else if(carritoCosto != null) {
        
        carritoCosto = parseInt(carritoCosto);
        localStorage.setItem("costo", carritoCosto + producto.precio);
    
    } else {
        localStorage.setItem("costo", producto.precio);

    }
}

function llamarItem() {
    let agregadosCarrito = localStorage.getItem('productosCarrito');
    agregadosCarrito = JSON.parse(agregadosCarrito);

    let carritoCosto = localStorage.getItem("costo");
    carritoCosto = parseInt(carritoCosto);

    let carritoDiv = document.querySelector('.tag__items');
    
    if( agregadosCarrito && carritoDiv ) {
        carritoDiv.innerHTML = '';
        Object.values(agregadosCarrito).map( (item, index) => {
            carritoDiv.innerHTML += 
            `<div class="itemProducto">
            <img src="../img/${item.titulo}.jpg"</img>
            <span class="sm-hide">${item.titulo}</span>
            <p class="precio">$${item.precio},00</p>
            <div class="cantidad">
                <span>${item.conteo}</span> 
            </div>
            <p class="total">$${item.conteo * item.precio},00</p>
            </div>
            `;
        });

        carritoDiv.innerHTML += `
            <div class="totalContenedor">
                <h4 class="carritoTotal">costo total</h4>
                <h4 class="total__price">$${carritoCosto},00</h4>
            </div>`

        eliminarItem();
        modificarCantidad();
    }
}

function modificarCantidad() {
    let disminuir = document.querySelectorAll('.decrease');
    let aumentar = document.querySelectorAll('.increase');
    let cantidadBase = 0;
    let productosActuales = '';
    let agregadosCarrito = localStorage.getItem('productosCarrito');
    agregadosCarrito = JSON.parse(agregadosCarrito);

    for(let i=0; i < aumentar.length; i++) {
        disminuir[i].addEventListener('click', () => {
            cantidadBase = disminuir[i].parentElement.querySelector('span').textContent;
            productosActuales = aumentar[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'').trim();

            if( agregadosCarrito[productosActuales].conteo > 1 ) {
                agregadosCarrito[productosActuales].conteo -= 1;
                conteoCarritoNav(agregadosCarrito[productosActuales], "disminuir");
                costo(agregadosCarrito[productosActuales], "disminuir");
                localStorage.setItem('productosCarrito', JSON.stringify(agregadosCarrito));
                llamarItem();
            }
        });

        aumentar[i].addEventListener('click', () => {
            cantidadBase = aumentar[i].parentElement.querySelector('span').textContent;
            productosActuales = aumentar[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'').trim();

            agregadosCarrito[productosActuales].conteo += 1;
            cartNumbers(agregadosCarrito[productosActuales]);
            costo(agregadosCarrito[productosActuales]);
            localStorage.setItem('productosCarrito', JSON.stringify(agregadosCarrito));
            llamarItem();
        });
    }
}

function eliminarItem() {
    let eliminarItem = document.querySelectorAll('.product ion-icon');
    let cantidadProductos = localStorage.getItem('conteoCarritoNav');
    let costoTotal = localStorage.getItem("costo");
    let agregadosCarrito = localStorage.getItem('productosCarrito');
    agregadosCarrito = JSON.parse(agregadosCarrito);
    let productoTitulo;
    console.log(agregadosCarrito);

    for(let i=0; i < eliminarItem.length; i++) {
        eliminarItem[i].addEventListener('click', () => {
            productoTitulo =  eliminarItem[i].parentElement.textContent.toLocaleLowerCase().replace(/ /g,'').trim();
           
            localStorage.setItem('conteoCarritoNav', cantidadProductos - agregadosCarrito[productoTitulo].conteo);
            localStorage.setItem('costo', costoTotal - (agregadosCarrito[productoTitulo].precio * agregadosCarrito[productoTitulo].conteo));

            delete agregadosCarrito[productoTitulo];
            localStorage.setItem('productosCarrito', JSON.stringify(agregadosCarrito));

            llamarItem();
            productosCargados();
        })
    }
}

productosCargados();
llamarItem();




/* let seleccion = prompt("ingresa si o no");

while(seleccion != "si" && seleccion != "no"){
    alert("porfavor ingresa si o no");
    seleccion = prompt("Desea comprar algo si o no")
}

if(seleccion == "si") {
    alert("a continuación los productos");
    let AllProducts = productos.map((producto) => producto.titulo + " " + producto.precio);
    alert(AllProducts.join(" - "));
}
else if (seleccion != "no"){
    alert("gracias por venir");
}

while(seleccion != "no"){
    let producto = prompt("agrega un producto al carrito");
    let precio = 0

    if(producto == "Hell He Lie" || producto == "Lorem Ipsum" || producto == "Norma" || producto == "Los NO santos" || producto == "Hachedé" ){
        switch (producto) {
            case "Hell He Lie":
                precio = 3.80;
                break;
            case "Lorem Ipsum":
                precio = 2.30;
                break;
            case "Norma":
                precio = 1.50;
                break; 
            case "Los NO santos":
                precio = 2.50
                break;
            case "Hachedé":
                precio = 3.00;
                break;  
            default:
                break;
        }

    let cantidad = parseInt(prompt("cuantas unidades quiere?"));

    carrito.push({producto, precio, cantidad});
    }

    else {
        alert("no tenemos ese producto");
    }

    seleccion = prompt("desea seguir comprando?")

    while(seleccion === "no") {
        alert("gracias por su compra");
        carrito.forEach((carritoTotal) => {
            console.log(`producto: ${carritoTotal.producto}, unidades: ${carritoTotal.cantidad}, 
            total a pagar de los productos ${carritoTotal.cantidad * carritoTotal.precio}`);
        })
    break;
    }
}

const totalSumatoria = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
console.log(`el total a pagar por su compra es: ${totalSumatoria}`)

*/
