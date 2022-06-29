export class Producto {
    constructor(codigo, precio, descripcion, cantidad) {
        this.codigo = codigo;
        this.precio = precio;
        this.descripcion = descripcion;
        this.cantidad = cantidad
        this.total = null;
        this._getTotal()
    }

    get Codigo() {return this.codigo};
    get Precio() { return this.precio };
    get Descripcion() { return this.descripcion };
    get Cantidad() {return this.cantidad };
    get Total() { return this.total };

    _getTotal() {
        this.total = this.precio * this.cantidad;
    }
}