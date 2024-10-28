import { Component, OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PopupComponent } from './pop-up/popup/popup.component';
import { MapService } from './services/map-service.service';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PopupComponent, ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',],
})
export class AppComponent implements OnInit{
  title = 'air-level';

 
 
  constructor(private mapService: MapService) {}


    ngOnInit(): void {
      this.mapService.initializeMap();
      this.mapService.addControls();

    }

    
  }
    
  






