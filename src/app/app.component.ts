import { AfterViewInit, Component } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { LabelType,Options,ChangeContext} from '@angular-slider/ngx-slider';
import * as L from 'leaflet';
import { ShapeService } from 'src/app/shape.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  calculations: any;
  ngOnInit() {
    this.shapeService.getpiechartdata().subscribe(calculations => {
      this.calculations = calculations;

    });
    
  }
  
 

  constructor(
    private shapeService: ShapeService

  ) {
  }

}
