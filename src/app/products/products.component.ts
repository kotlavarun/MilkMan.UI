import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { FormArray, FormBuilder, FormControl,Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  dataSource = [];
  displayedColumns: string[] = ['slNo','productName', 'productMRP'];

  public newProductForm = this.formBuilder.group({
    productName: new FormControl('', [Validators.required]),
    productCode: new FormControl('', [Validators.required]),
    productDesc: new FormControl('', [Validators.required]),
    productMRP: new FormControl(0, [Validators.required]),
    boxQuantity: new FormControl(0, [Validators.required]),
    boxPrice: new FormControl(0.00, [Validators.required]),
  })

  constructor(private ser : ServicesService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getActiveProductList();
  }

  getActiveProductList(){
    this.ser.getActiveProductList().subscribe({
      next: (resp: any) => { this.dataSource = resp }
    })
  }

  addNewProduct(){
    console.log(this.newProductForm.value);
    if(this.newProductForm.valid){
      this.ser.addNewProduct(this.newProductForm.value).subscribe({
        next: (resp: any) => alert(resp)
      })
    }
  }
}
