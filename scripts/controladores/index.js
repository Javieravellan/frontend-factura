import { Producto } from "../dtos/Producto.js";
import { PATH_API } from "../env.js"

//const btnAbrirModal = $("#abrirModal");
const btnEnviar = $("#enviar");
//const btnCancelar = $("#cancelar");
const cmbProductos = $("#cmbProductos");
const txtPrecio = $("#precio");
const txtCantidad = $("#cantidad");
const tBody = $("#tb_body");

/**
 * @type {HTMLOptionElement}
 */
var currentProductOption = null;

$(document).ready(async() => {
    // load product data in combobox
    loadCombobox(await loadProductos())
    // add event to cmbProductos
    $(cmbProductos).change(eventChangeCmb)
    // add event to btnEnviar
    $(btnEnviar).on('click', eventEnviarBtn)
    // add event when modal is closing
    $(".modal").on('hidden.bs.modal', hiddenModal)
})

const loadCombobox = (productos) => {
    let productItems = ``
    productos.forEach(p => productItems += `<option value='${p.codigo}' 
        data-precio='${p.precio}'>${p.descripcion}</option>`)
    $(cmbProductos).append(productItems);
}

const eventChangeCmb = (e) => {
    let target = e.target;
    let index = target.selectedIndex;
    currentProductOption = target.options[index];
    $(txtPrecio).val(Number(currentProductOption.getAttribute("data-precio")).toFixed(2))
}

const eventEnviarBtn = () => {
    if (currentProductOption != null && ($(txtPrecio).val() != 0 || $(txtPrecio).val() != '') 
        && $(txtCantidad).val() != '') {
            //console.debug(currentProductOption);return;
            let newProduct = new Producto(
                currentProductOption.value,
                $(txtPrecio).val(),
                currentProductOption.innerHTML,
                $(txtCantidad).val()
            );
        // add producto in table
        addProductInTable(newProduct);
        // sum total
        $("#total").html((Number($("#total").html()) + Number(newProduct.Total)).toFixed(2))
        // close a modal
        $(".modal").modal('hide');
        // reset currentOption
        currentProductOption = null
    }
}

/**
 * @param {Producto} producto 
 */
const addProductInTable = (producto) => {
    /**
     * @type {HTMLOptionElement}
     */
    let opcion = `<tr>
        <td>${producto.Codigo}</td>
        <td>${producto.Descripcion}</td>
        <td>${producto.Precio}</td>
        <td>${producto.Cantidad}</td>
        <td>${Number(producto.Total).toFixed(2)}</td>
    </tr>`
    opcion = $(opcion).wrap(opcion)
    $(tBody).append(opcion)
    $(opcion).on('click', function() {
        if (confirm("¿Seguro que desea eliminar este producto?")) {
            // reducir el total
            let totalHTML = Number($("#total").html())
            totalHTML = (totalHTML - Number(producto.Total)).toFixed(2)
            $(opcion).remove()
            $("#total").html(totalHTML);
        }
    })
    console.log(producto)
}

const hiddenModal = () => {
    document.getElementById("formu").reset()
}

const loadProductos = () => {
    try {
        var response = new Promise((resolve, reject) => {
            $.ajax({
                url: PATH_API,
                contentType: 'application/json',
                crossDomain: true,
                success: res => resolve(res),
                error: err => reject(err)
            });
        });
        return response;
    } catch(e) {
        console.debug(e)
    }
}