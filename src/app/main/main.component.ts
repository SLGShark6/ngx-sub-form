import { Component } from '@angular/core';
import { SellService } from '../services/sell.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  public sells$ = this.sellService.getSells();

  constructor(private sellService: SellService) {}
}