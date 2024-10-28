import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Map from 'ol/Map';
import { MapService } from '../../services/map-service.service';
import Overlay from 'ol/Overlay';
import { toLonLat } from 'ol/proj';
import { apiResponse, listItem, TempoService } from '../../services/tempo.service';





@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css',
 
})
export class PopupComponent implements OnInit{

  map!:Map;
  popup!: Overlay;

  @Input()
  clima:string="";
  cityName:string="";
  level:number =0;
  carbonMonoxide:number | undefined =0;
  nitrogenMonoxide:number | undefined =0;
  nitrogenDioxide:number | undefined =0;
  ozone:number | undefined =0;
  sulphurDioxide:number | undefined=0;
  PM10:number | undefined=0;
  PM2_5:number | undefined=0;

  cityAir!:listItem

  
  @ViewChild('popup', { static: true }) popupElement!: ElementRef;


  constructor(private mapService: MapService, private tempService:TempoService) {}


  ngOnInit(): void {
    this.map = this.mapService.getMap(); 
    this.setupPopup();

  }
    
  setupPopup(): void {
      
      this.popup = new Overlay({
        element: this.popupElement.nativeElement,
        positioning: 'bottom-center',
        stopEvent: false,
      });
      
      this.map.addOverlay(this.popup);
      this.popupElement.nativeElement.style.display = 'none'; 
  
      this.map.on('click', async (event) => { this.HandleMapClick(event) });

  }


    private async HandleMapClick(event:any):Promise<void>
    {
    
        const coord = event.coordinate;
        const lonLat = toLonLat(coord);
        this.popup.setPosition(coord);

        this.tempService.getClima(lonLat[1], lonLat[0]).subscribe((dados:apiResponse) =>{
          if(dados.list.length  > 0 ){
              this.cityAir = dados.list[0]
          }
          const { components, main} = this.cityAir;

          this.carbonMonoxide = components.co
          this.nitrogenMonoxide = components.no;
          this.nitrogenDioxide = components.no2;
          this.ozone = components.o3;
          this.sulphurDioxide= components.so2;
          this.PM10 = components.pm10;
          this.PM2_5 = components.pm2_5;
          this.level = main.aqi

          this.tempService.getCity(lonLat[1], lonLat[0]).subscribe((cidade) =>{
            this.cityName = cidade.name
            this.showPopup()
          })

        })
        
  }

  private showPopup(): void {
    const element = this.popup.getElement();
    if (element) {
      element.style.display = 'flex';
      this.updatePopupStyle(this.level, element);
    }
  }

  private updatePopupStyle(nivel:number | undefined, element:HTMLElement){
    const classes = ['popup-otimo', 'popup-bom', 'popup-moderado', 'popup-poluido', 'popup-superpoluido']

    element.classList.remove(...classes);
    let className = '';
    switch (nivel) {
      case 1:
        className = 'popup-otimo';
        this.clima = 'Otimo';
        break;
      case 2:
        className = 'popup-bom';
        this.clima = 'Bom';
        break;
      case 3:
        className = 'popup-moderado';
        this.clima = 'Aceitavel';
        break;
      case 4:
        className = 'popup-poluido';
        this.clima = 'Poluido';
        break;
      case 5:
        className = 'popup-superpoluido';
        this.clima = 'SuperPoluido';
        break;
    }
    element.classList.add(className);
    
  }


       


}
