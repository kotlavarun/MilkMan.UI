import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  public currentTabSelected: string = '';

  constructor(private ser: ServicesService) { }

  ngOnInit(): void {
  }

  public tabChangeHandler(data: any){
    this.currentTabSelected = data;
  }

}
