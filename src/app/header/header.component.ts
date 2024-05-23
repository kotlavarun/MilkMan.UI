import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output () currentTabSelected: EventEmitter<string> = new EventEmitter<string>();

  public mainMenuTabsList = ['Home', 'Orders', 'Daily Collection', 'Products', 'Customers', 'Invoice']
  public selectedTab = '';
  constructor() { }

  ngOnInit(): void {
    this.tabChangeHandler('Orders')
  }

  public tabChangeHandler(tabName: string){
    this.selectedTab = tabName;
    this.currentTabSelected.emit(tabName);
  }
}
