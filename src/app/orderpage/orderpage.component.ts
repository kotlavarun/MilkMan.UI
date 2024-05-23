import { Component, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ServicesService } from '../services.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-orderpage',
  templateUrl: './orderpage.component.html',
  styleUrls: ['./orderpage.component.css']
})
export class OrderpageComponent implements OnInit {

  //private orderTabsList = ['Single Order', 'Dairly Order']
  public navBar1Tab: string = 'Multiple Orders';
  public navBar2Tab: string = 'Route 1';
  public navbar1 = ['Single Order', 'Regular Orders']
  public navBarForMOrder = ['Route 1', 'Route 2', 'Route 3' ]

  public customerSearchValue = '';
  public customerList: any = [];
  public customerSearchList: any = [];

  public customerProductPList: any = [];

  public productList: any = [];  
  
 // public orderTableHeaderName: any;
 // displayedColumns: string[] = ['GM500'];
  dataSource = [];
  displayedColumns: string[] = [];
  public rOrderDate = new Date();

  
  public singleCustOrderForm = this.formBuilder.group({
    custId: new FormControl('', [Validators.required]),
    custName: new FormControl(''),
    orderDate: new FormControl(this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss")),
    isRegularOrder: new FormControl(0),
    orderTValue: new FormControl(''),
    remark: new FormControl(''),
    productList: this.formBuilder.array([])
  })

  constructor(private ser: ServicesService, private formBuilder: FormBuilder, private datePipe: DatePipe) {

  }
  

  ngOnInit(): void {
   this.getAllActiveProductDetails();
  }

  tabClickEvent(tabName: string, tabType: string) {
    if(tabType == 'navBar1'){
      this.navBar1Tab = tabName;
      if(tabName == 'Single Order'){
        this.getCustDetails();
      } else {
        //this.getTableHeaderData();
      }   
    } 
    if(tabType == 'navBar2'){
      this.navBar2Tab = tabName;
    }
  };

  getAllActiveProductDetails(){
    this.ser.getActiveProductList().subscribe(resp => {
      if(resp){
        this.productList = resp;
      }
    },error => {
      alert(error.error.message);
   })
  }

  // single order function
  getCustDetails() {
    this.ser.getActiveCustomerDetails().subscribe(resp => {
      if(resp){
        this.customerList = resp;
      }
    },error => {
      alert(error.error.message);
   })
  }

  get orderTValue(){
    return this.singleCustOrderForm.get('orderTValue');
  }

  get productListForms() {
    return this.singleCustOrderForm.get('productList') as FormArray;
  }

  get getcustIdfromForm(){
    return this.singleCustOrderForm.get('custId')
  }

  deleteProduct(index: number) {
    this.productListForms.removeAt(index);
  }

  onSelectingCutsomerForSOrder(){

  }

  printToConsole(data: any){
    console.log(data);
  }

  onCustomerClick(custId: number, custName: string, phone: number){
    this.singleCustOrderForm.patchValue({ custId: Number(custId), custName: custName});
    this.getProductPListForCustomer(custId);
  }

  getProductPListForCustomer(custId: any){
    this.customerProductPList = [];
    this.ser.getCustProductPList(custId).subscribe(resp => {
      if(resp){
        this.customerProductPList = resp;
      }
    });
  }

  addProductDetailsToOrderList(event: any, index: any){    
    let productId = event?.target.value;
    let productPrice = this.getPriceFromCustProductPlist(productId);
    let productMRP = this.getProductMRPPrice(productId);
    if(productPrice == null){
      productPrice = productMRP
    }
    this.productListForms.controls[index].patchValue({  productId: Number(productId), productUnitValue: productPrice , productMRP: productMRP });
  };

  getPriceFromCustProductPlist(productId: number){
    let product = this.customerProductPList.filter((item: any) => item?.productId == Number(productId))
    return product[0]?.price
  }

  getProductMRPPrice(productId: number){
    let product = this.productList.filter((item: any) => item?.productId == Number(productId));
    return product[0]?.productMRP;
  }

  calculateProductPrice(index: number, event: any, productPrice: number){
    let pQuantity = event?.target?.value;
    let productValue = this.calculatePrice(productPrice, pQuantity);
    this.productListForms.controls[index].patchValue({orderValue: productValue, productQuantity: Number(pQuantity)});
    this.calculateTOrderPrice();
  }

  calculatePrice(productPrice: number, pQuantity: number){
    return Number(productPrice) * Number(pQuantity);
  }

  calculateTOrderPrice(){
    this.orderTValue?.setValue(this.productListForms.value.reduce((total: any, product: { orderValue: any; }) => total + product.orderValue, 0))
  }

  addNewProductLine() {
    const productFormGroup = this.formBuilder.group({
      productId: ['', Validators.required],
      productMRP: ['', Validators.required],
      productUnitValue:['', Validators.required],
      productQuantity: ['', Validators.required],
      orderValue: ['', Validators.required]
    });
    this.productListForms.push(productFormGroup);
  }

  onSearch() {
    if(this.customerSearchValue.trim() != ''){
      this.customerSearchList =  this.customerList.filter((cust: any) =>
        cust.custName.toLowerCase().includes(this.customerSearchValue.toLowerCase())
      )      
    } else {
      this.customerSearchList = [];
    }
  }

  onSubmitSOrder(){   
    if(this.singleCustOrderForm.valid){
      this.ser.saveSOrder(this.singleCustOrderForm.value).subscribe((resp: any) => {
        if(resp){
          alert(resp?.message);
          this.singleCustOrderForm.reset();
          this.productListForms.clear()
        }
      },error => {
        alert(error.error.message);
     })
    }
  }

  // multiple order function
  // getTableHeaderData() {
  //   this.ser.getOrderTableHeaderData().subscribe(resp => {
  //     this.orderTableHeaderName = resp;
  //   },error => {
  //     alert(error.error.message);
  //  })
  // }

  /**
   * methods to handle regular orders
   */

  getRegularOrderTHeader(){
    // this.dataSource.forEach((order: any) => {
    //   order?.productList.forEach((product: any) => {
    //     if (!this.displayedColumns.includes(product.productCode)) {
    //       this.displayedColumns.push(product.productCode);
    //     }
    //   });
    // });
    this.ser.getOrderTableHeaderData().subscribe({next: (resp: any) => {
      this.displayedColumns = resp;
    }})   
  }
  /**
   * regular order table
   */
  getCustDForROrder(){
    let model = {
      orderDate: this.datePipe.transform(this.rOrderDate, "yyyy-MM-dd HH:mm:ss"),
      routeId: this.navBar2Tab.split("Route ")[1]
    }
    this.ser.getCustDForROrder(model).subscribe({next: (resp: any) => {
     this.dataSource = resp;
    }});
  }

  getProductQuantity(order: any, productCode: string): number {    
    const product = order.productList.find((product: any) => product.productCode === productCode);
    return product ? product.productQuantity : 0;
  }
  
  calculateOrderTValue(order: any){
    order.orderTValue = 0;
    order.productList.forEach((product: any) =>{
      order.orderTValue += product.orderValue
    })
  }

  calculateProductValue(order: any, productCode: String, event: any){
    order.productList.find((product: any) => {
      if (product.productCode === productCode){
        product.productQuantity = Number (event.target.value);
        product.orderValue = product.productQuantity * product.productValue
      }
    });
    this.calculateOrderTValue(order);
  }
  
  saveSingleCustROrder(data: any){
    data.orderDate = this.datePipe.transform(new Date, "yyyy-MM-dd HH:mm:ss");
    if(data.custOldBal == null){
      data.custOldBal = 0;
      data.custOldBal += data.orderTValue;
    } else {
      data.custOldBal += data.orderTValue;
    }
    this.ser.saveSingleCustROrder(data).subscribe({
      next: (resp: any) => alert(resp as string),
      error: (err: any) => alert(err as string)
    })
  }

  saveAllROrders(){
    let model = {
      orderDate: this.datePipe.transform(new Date, "yyyy-MM-dd HH:mm:ss"),
      mROrderRequestList: this.dataSource
    };
    console.log(model)
  }

}
