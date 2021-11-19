import { Component, OnInit } from '@angular/core';
import { FacturaService } from "../../services/factura.service";
import { Factura } from "../../models/factura.model";
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { environment } from "../../../environments/environment";
import { UsuarioService } from 'src/app/services/usuario.service';

const iva = environment.iva;

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
})
export class FacturaComponent implements OnInit {

  msgError: string;
  facturas: Factura[] = [];
  busquedaFacturas: Factura[] = [];
  factura: Factura;

  accion: string = '';
  msgSuccess: string = '';
  admin: boolean = false;

  crearFacturaForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    valorTotal: new FormControl('', [Validators.required]),
    ivaTotal: new FormControl('', [Validators.required]),
    pagada: new FormControl('', [Validators.required]),
    productos: new FormArray([], Validators.required),
  });

  busquedaForm = new FormGroup({
    busquedaId: new FormControl(''),
    busquedaValor: new FormControl(''),
    busquedaIva: new FormControl(''),
    busquedaPaga: new FormControl(''),
  })

  constructor(private facturaService: FacturaService
            , private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.validarRole().subscribe( resp => this.admin = resp);
    this.getFacturas();
  }

  get productos() {
    return this.crearFacturaForm.get('productos') as FormArray;
  }

  getFacturas(){
    this.facturaService.getFacturas()
      .subscribe(res => {
        this.facturas = res.facturas;
        this.busquedaFacturas =  res.facturas;
      }, (err) => {
        this.msgError = err.error.msg;
      }
    );
  }

  nuevoProducto() {
    this.productos.push(new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      valor: new FormControl('', [Validators.required]),
      iva: new FormControl('', [Validators.required]),
    }));
  }

  eliminarProducto( index ) {
    this.productos.removeAt( index );
    this.calcularValorTotal();
  }

  calcularIvaProducto(index){
    this.productos.controls[index].get('iva').setValue(this.calcularIva(this.productos.controls[index].get('valor').value));
    this.calcularValorTotal()
  }

  calcularIvaTotal(){
    this.crearFacturaForm.get('ivaTotal').setValue(this.calcularIva(this.crearFacturaForm.get('valorTotal').value))
  }

  calcularValorTotal() {

    var valorTotal = 0;

    this.productos.controls.forEach(producto => {
      valorTotal += Number(producto.get('valor').value)
    });

    this.crearFacturaForm.get('valorTotal').setValue(valorTotal);

  }


  calcularIva( valor ) {
    return valor * (iva/100);
  }

  crearFactura(){

    console.log('asdsas', this.crearFacturaForm.value);
    this.facturaService.crearFactura(this.crearFacturaForm.value)
                       .subscribe(res => {
                        if(res.ok){ 
                          this.msgSuccess = 'Factura Creada Correctamente'
                          this.getFacturas();
                        } else{
                          this.msgError = res.error.msg;
                        }
                       });
  }

  mapFactura(factura : Factura){ 

    this.productos.clear() ;

    this.crearFacturaForm.get('id').setValue(factura.id);
    this.crearFacturaForm.get('valorTotal').setValue(factura.valorTotal);
    this.crearFacturaForm.get('ivaTotal').setValue(factura.ivaTotal);
    this.crearFacturaForm.get('pagada').setValue(factura.pagada);

    factura.productos.forEach(producto => {
      this.productos.push(new FormGroup({
        nombre: new FormControl(producto.nombre , [Validators.required]),
        valor: new FormControl(producto.valor , [Validators.required]),
        iva: new FormControl(producto.iva , [Validators.required]),
      }));
    });

  }

  accionFactura(accion: string, factura? : Factura, ) {
    this.accion = accion;
    this.msgError = '';
    this.msgSuccess = '';
    if(factura) {
      this.mapFactura(factura);
    }
    
  }

  editarFactura() {

    this.facturaService.editarFactura(this.crearFacturaForm.value)
                       .subscribe((res:any) => {
                          if(res.ok){ 
                            this.msgSuccess = 'Factura Editada Correctamente'
                            this.getFacturas();
                          } else{
                            this.msgError = res.error.msg;
                          }
                        });

  }

  eliminarFactura(factura: Factura){
    if(window.confirm('Esta seguro que desea eliminar la Factura '+ factura.id)){
      this.facturaService.eliminarFactura(factura).subscribe(res => console.log(res));
    }
  }

  buscar() {

    this.busquedaFacturas = [];

    if(this.busquedaForm.get('busquedaId').value) {
      this.busquedaFacturas.push(this.facturas.find((x:Factura) => x.id == this.busquedaForm.get('busquedaId').value));
    }

    if(this.busquedaForm.get('busquedaValor').value) {
      this.busquedaFacturas.push(this.facturas.find((x:Factura) => x.valorTotal == this.busquedaForm.get('busquedaValor').value));
    }

    if(this.busquedaForm.get('busquedaIva').value) {
      this.busquedaFacturas.push(this.facturas.find((x:Factura) => x.ivaTotal == this.busquedaForm.get('busquedaIva').value));
    }

    console.log(this.busquedaForm.get('busquedaPaga').value);

    if(this.busquedaForm.get('busquedaPaga').value) {
      this.busquedaFacturas.push(this.facturas.find((x:Factura) => x.pagada === this.busquedaForm.get('busquedaPaga').value));
    }

    this.busquedaFacturas = this.busquedaFacturas.filter((item,index)=>{
      return this.busquedaFacturas.indexOf(item) === index;
    })

  }

  


}
