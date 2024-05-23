import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-daily-collection',
  templateUrl: './daily-collection.component.html',
  styleUrls: ['./daily-collection.component.css']
})
export class DailyCollectionComponent implements OnInit {

  public navBar: string[] = ['EMP 1', 'EMP 2', 'EMP 3'];
  public selectedTab: any;
  public empId = '';
  public requestedDate: Date = new Date();

  public displayColumns: string[] = ['slNo', 'custName', 'todayOrderTValue', 'balance', 'totalReceivedAmount', 'saveBtn','remark'];
  public transactionList: any = [];
  private cashTransactionlist: any = [];
  public dataSource: any = [];
  
  constructor(private ser : ServicesService,  private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.requestedDate = new Date();
  }

  printToConsole(data: any){
    console.log(data);
  }

  onTabClicked(data: string){
    this.selectedTab = data;
    this.empId = data.split('EMP ')[1];
  }

  getDailyCollectionList(){
    let dateEmpIdModel = {
      date: this.datePipe.transform(this.requestedDate, 'yyyy-MM-dd HH:mm:ss'),
      empId: this.empId
    }
    this.ser.getDailyCollectionList(dateEmpIdModel).subscribe({
      next: (resp: any) => this.dataSource = resp
    });
    this.transactionList = this.dataSource;
  }
  
  updateReceivedAmount(data: any, event: any){
    if(this.cashTransactionlist.length != 0) {
      this.cashTransactionlist.map((item: { custId: any; }) => {
        if(item.custId == data){
          
        }
      })
    }
    let record = {}
    data.receivedAmount = Number(event.target.value);
  }
  updateRemark(data: any, event: any){
    data.remark = event.target.value;
  }

  saveSingleCashTransaction(data: any){
    this.ser.saveCashTransaction(data).subscribe({
      next: (resp: any) => alert(resp)
    })
  }

  moveDateOneDayUp(){
    this.requestedDate.setDate(this.requestedDate.getDate() + 1)
  }
  moveDateOneDayDown(){
    this.requestedDate.setDate(this.requestedDate.getDate() - 1)
  }

}
