export class Factura {

    constructor(
            public id: Number,
            public valorTotal: Number,
            public ivaTotal: Number,
            public pagada: Boolean,
            public productos: any[]  
    ){}

}