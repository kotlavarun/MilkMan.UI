import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  baseUrl = `${environment.apiBaseURL}`;

  constructor(public httpClient: HttpClient) { }

  public getHeaders() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return httpOptions;
  }


  public getActiveCustomerDetails(){
    return this.httpClient.get(
      this.baseUrl+'/customer/listCustForSearchField',
      this.getHeaders()
    );
  }

  public getCustProductPList(custId: number){
    return this.httpClient.get(
      this.baseUrl+'/customer/cpPriceList/'+ custId,
      this.getHeaders()
    );
  }

  /**
   * to get product details for order
   */
  public getActiveProductList() {       
    return this.httpClient.get(
      this.baseUrl+'/product/productList',
      this.getHeaders()
    );
  }

  public addNewProduct(data: any) {
    return this.httpClient.post(
      this.baseUrl+'/product/newProduct',data,
      this.getHeaders()
    );
  }
  
  //Order tab services
  public getOrderTableHeaderData() {
    return this.httpClient.get(
      this.baseUrl+'/order/getROrderTableCol',
      this.getHeaders()
    );
  }
  public getCustDForROrder(model: any){
    return this.httpClient.post(
      this.baseUrl+'/order/getRegularOrder', model  
    );
  }
  public saveSingleCustROrder(model: any){
    return this.httpClient.post(
      this.baseUrl+'/order/saveRegularOrder', model
    );
  }

  public saveSOrder(newOrderRequest: any){
    return this.httpClient.post(
      this.baseUrl+'/order/saveSOrder', newOrderRequest,
      this.getHeaders()
    );
  }

  /* transaction related controller
  */
  public getDailyCollectionList(dateEmpIdModel: any){
    return this.httpClient.post(
      this.baseUrl+'/transaction/getByOrderBased', dateEmpIdModel,
      this.getHeaders()
    );
  }
  public saveCashTransaction(model: any){
    return this.httpClient.post(
      this.baseUrl+'/transaction/saveCashTrans', model,
      this.getHeaders()
    );
  }
}
