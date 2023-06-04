import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-show-breakfast',
  templateUrl: './show-breakfast.component.html',
  styleUrls: ['./show-breakfast.component.scss']
})
export class ShowBreakfastComponent {

    constructor(private service : ApiService) { }
}
