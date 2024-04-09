import { AfterViewInit, Component } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { LabelType, Options, ChangeContext } from '@angular-slider/ngx-slider';
import * as L from 'leaflet';
import { ShapeService } from 'src/app/shape.service';
import { environment } from 'src/environments/environment';
import { Classified } from 'src/app/classified';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

  map: any;
  selectedLocation: string = '';

  originalimagery = "http://localhost:8080/geoserver/adampurasf/wms?service=WMS";
  originalimagery1 = "http://localhost:8080/geoserver/ambalaasf/wms?service=WMS";
  originalimagery2 = "http://localhost:8080/geoserver/amritsarasf/wms?service=WMS";
  originalimagery3 = "http://localhost:8080/geoserver/awantipurasf/wms?service=WMS";
  originalimagery4 = "http://localhost:8080/geoserver/bathindaasf/wms?service=WMS";
  originalimagery5 = "http://localhost:8080/geoserver/chandigarhasf/wms?service=WMS";
  originalimagery6 = "http://localhost:8080/geoserver/halwaraasf/wms?service=WMS";
  originalimagery7 = "http://localhost:8080/geoserver/hindonasf/wms?service=WMS";
  originalimagery8 = "http://localhost:8080/geoserver/gurugramasf/wms?service=WMS";
  originalimagery9 = "http://localhost:8080/geoserver/lehasf/wms?service=WMS";
  originalimagery10 = "http://localhost:8080/geoserver/pathankotasf/wms?service=WMS";
  originalimagery11 = "http://localhost:8080/geoserver/sarsawaasf/wms?service=WMS";
  originalimagery12 = "http://localhost:8080/geoserver/sirsaasf/wms?service=WMS";
  originalimagery13 = "http://localhost:8080/geoserver/udhampurasf/wms?service=WMS";

  originalimagetile: any = "-";
  currentLayer: any; // Store the current layer
  value: number = 2000; // Initial year value
  slider: any;
  imagery = "http://localhost:8080/geoserver/small_obj_detection/wms?service=WMS";
  originaltile: any = "-";
  currentlocation: string = ''; // Default location
  year: number = 2013;
  selectedYear: number = 2013;

  chartOptions: any;
  chart: any;
  chartArray: any[] = [];
 


  constructor(
    private shapeService: ShapeService

  ) {
  }
  ngAfterViewInit(): void {
    // Add your initialization code here
  }

  // ngAfterViewInit(): void {
  //   console.log("ngAfterViewInit called");
  //   this.chart = new CanvasJS.Chart('chartContainer', this.chartOptions);
  //   this.updatePieChart();
  // }


  ngOnInit(): void {
    this.loadMap();

    this.chartOptions = {
      animationEnabled: true,
      title: {
      },
      data: [{
        type: "pie",
        startAngle: 45,
        indexLabel: "{name}: {y}",
        indexLabelPlacement: "inside",
        dataPoints: [
          { y: 1, name: "Fighter" },
          { y: 1, name: "Hanger" },
          { y: 1, name: "nonCombatAircraft" },
          { y: 1, name: "Rotorcraft" },
        ]
      }]
    }

    // console.log("Fetching data from shape service...");
    this.shapeService.getpiechartdata().subscribe({
      next: (data: any) => {
        // console.log("Received data from shape service:", data);
        this.chartArray = data;
        this.updatePieChart();
      },
      error: (error: any) => {
        console.error('Error fetching Pie chart data:', error);
      }
    });
  }

  updatePieChart(selectedYear?: string) {
    const classNames = ['Fighter', 'Hanger', 'nonCombatAircraft', 'Rotorcraft']; // Update class names to match the data
    const seriesColors = ["#79f450", "#1c6612", "#FF0000", "#ffddb7"];
  
    if (selectedYear) {
      let numbers = [0, 0, 0, 0];
      let x = this.selectedLocation + "_" + selectedYear + ".csv";
      const filePath = `assets/${x}`;
  
      fetch(filePath)
        .then(response => {
          if (!response.ok) {
            throw new Error('File not found');
          }
          return response.text();
        })
        .then(csv => {
          // Parse the CSV content
          const lines = csv.split('\n');
          for (const line of lines) {
            const values = line.split(',').map(parseFloat);
            if (values.length > 0) {
              const index = Math.floor(values[0]);
              if (index >= 0 && index < 4) {
                numbers[index] += 1; // Increment the count for the corresponding category
              }
            }
          }
  
          // Update the chart data
          const datapoints = [];
          for (let i = 0; i < 4; i++) {
            datapoints.push({ y: numbers[i], name: `${classNames[i]}` });
          }
          this.chartOptions.data[0].dataPoints = datapoints;
  
          // Render the chart
          if (this.chart) {
            this.chartOptions.animationEnabled = true; // Enable animation
            this.chart.render();
          }
        })
        .catch(error => {
          console.error('Error reading file:', error);
          // Display a message to inform the user that data for the selected year is not available
          console.log("Data for the selected year is not available.");
          // Optionally, you can keep the chart visible with default data or clear the chart
          // and display a message indicating no data available
        });
    } else {
      console.log("No year selected.");
      return;
    }
  }
  

  getChartInstance(chart: any) {
    this.chart = chart;
    console.log("this is chart: ",chart);
}



  options: Options = {
    showTicksValues: true,
    floor: 2013,
    vertical: true,

    ceil: 2022,
    translate: (value: number, label: LabelType): string => {
      switch (value) {
        case 8:
          return "2014";
        case 9:
          return "2016";
        case 10:
          return "2018";
        case 11:
          return "2020";
        case 12:
          return "2022";
        case 13:
          return "2024";
        case 14:
          return "2026";
        case 15:
          return "2028";
        case 16:
          return "2030";

        default:
          return value.toString();
      }
    }
  };

  private getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }
  onDropdownChange(selectedLocation: string, event: MouseEvent): void {
    event.preventDefault();
    console.log('Dropdown change function called.');
    console.log('Selected location:', selectedLocation);
    this.currentlocation = selectedLocation.split(' ')[0].toLowerCase();
    this.selectedLocation = selectedLocation; // Set the selected location
    // Add cases for western Air Command
    switch (selectedLocation) {
      case 'Adampur AFS':
        this.map.flyTo([31.434879, 75.757256], 13);
        break;
      case 'Ambala AFS':
        this.map.flyTo([30.3706, 76.8178], 13);
        break;
      case 'Amritsar AFS':
        this.map.flyTo([31.7078, 74.7992], 13);
        break;
      case 'Awantipur AFS':
        this.map.flyTo([33.8766278, 74.9756806], 13);
        break;
      case 'Bathinda AFS':
        this.map.flyTo([30.268848, 74.757430], 13);
        break;
      case 'Chandigarh AFS':
        this.map.flyTo([30.676290, 76.788535], 13);
        break;
      case 'Gurugram AFS':
        this.map.flyTo([28.437098, 77.028544], 13);
        break;
      case 'Faridabad AFS':
        this.map.flyTo([28.371888, 77.276432], 13);
        break;
      case 'Halwara AFS':
        this.map.flyTo([30.748041, 75.633209], 13);
        break;
      case 'Hindon AFS':
        this.map.flyTo([28.707647, 77.359340], 13);
        break;
      case 'Vadsar AFS':
        this.map.flyTo([23.146200, 72.481270], 13);
        break;
      case 'Leh AFS':
        this.map.flyTo([34.137216, 77.546614], 13);
        break;
      case 'Palam AFS':
        this.map.flyTo([28.573736, 77.114610], 13);
        break;
      case 'Pathankot AFS':
        this.map.flyTo([32.236929, 75.633227], 13);
        break;
      case 'Sarsawa AFS':
        this.map.flyTo([29.993718, 77.430671], 13);
        break;
      case 'Sirsa AFS':
        this.map.flyTo([29.5627778, 75.0052778], 13);
        break;
      case 'Srinagar AFS':
        this.map.flyTo([33.994374, 74.765299], 13);
        break;
      case 'Udhampur AFS':
        this.map.flyTo([32.911503, 75.154410], 13);
        break;

      // Add cases for Eastern Air Command
      case 'Purnea AFS':
        this.map.flyTo([26.6811111, 88.3286111], 13);
        break;
      case 'Bagdogra AFS':
        this.map.flyTo([26.6811111, 88.3286111], 13);
        break;
      case 'Barapani AFS':
        this.map.flyTo([25.7036111, 91.9786111], 13);
        break;
      case 'Barrackpore AFS':
        this.map.flyTo([22.7819444, 88.3591667], 13);
        break;
      case 'Chabua AFS':
        this.map.flyTo([27.4622222, 95.1180556], 13);
        break;
      case 'Hasimara AFS':
        this.map.flyTo([26.6980556, 89.3688889], 13);
        break;
      case 'Jorhat AFS':
        this.map.flyTo([26.7316667, 94.1755556], 13);
        break;
      case 'Kalaikunda AFS':
        this.map.flyTo([22.3394167, 87.2145472], 13);
        break;
      case 'Kumbhigram AFS':
        this.map.flyTo([24.9130556, 92.9786111], 13);
        break;
      case 'Mohanbari AFS':
        this.map.flyTo([27.4805556, 95.0216667], 13);
        break;
      case 'Mountain Shadow AFS':
        this.map.flyTo([26.1061111, 91.5858333], 13);
        break;
      case 'Panagarh AFS':
        this.map.flyTo([23.4744444, 87.4275], 13);
        break;
      case 'Tawang AFS':
        this.map.flyTo([27.5886111, 91.8777778], 13);
        break;
      case 'Tezpur AFS':
        this.map.flyTo([26.7122222, 92.7872222], 13);
        break;

      // Add cases for central Air Command
      case 'Agra AFS':
        this.map.flyTo([27.1575, 77.9608333], 13);
        break;
      case 'Bakshi Ka Talab AFS':
        this.map.flyTo([26.9886111, 80.8913889], 13);
        break;
      case 'Bamrauli AFS':
        this.map.flyTo([25.4408333, 81.7338889], 13);
        break;
      case 'Bareilly AFS':
        this.map.flyTo([28.4225, 79.4469444], 13);
        break;
      case 'Bihta AFS':
        this.map.flyTo([25.5908333, 84.8833333], 13);
        break;
      case 'Chakeri AFS':
        this.map.flyTo([26.4027778, 80.4122222], 13);
        break;
      case 'Darbhanga AFS':
        this.map.flyTo([26.1947222, 85.9175], 13);
        break;
      case 'Gorakhpur AFS':
        this.map.flyTo([26.7394444, 83.4494444], 13);
        break;
      case 'Maharajpur AFS':
        this.map.flyTo([26.2933333, 78.2277778], 13);
        break;

      // Add cases for southern Air Command
      case 'Car Nicobar AFS':
        this.map.flyTo([9.1525, 92.8197222], 13);
        break;
      case 'Sulur AFS':
        this.map.flyTo([11.0136111, 77.1597222], 13);
        break;
      case 'Port Blair AFS':
        this.map.flyTo([11.6411111, 92.7297222], 13);
        break;
      case 'Tambaram AFS':
        this.map.flyTo([12.9069444, 80.1211111], 13);
        break;
      case 'Thanjavur AFS':
        this.map.flyTo([10.7222222, 79.1013889], 13);
        break;
      case 'Thiruvananthapuram AFS':
        this.map.flyTo([8.48, 76.92], 13);
        break;

      // Add cases for South Western Air Command
      case 'Suratgarh AFS':
        this.map.flyTo([29.3877778, 73.9038889], 13);
        break;
      case 'Bhuj AFS':
        this.map.flyTo([23.2877778, 69.6700000], 13);
        break;
      case 'Deesa AFS':
        this.map.flyTo([24.2680556, 72.2044444], 13);
        break;
      case 'Jaisalmer AFS':
        this.map.flyTo([26.8891667, 70.8644444], 13);
        break;
      case 'Jamnagar AFS':
        this.map.flyTo([22.4663889, 70.0113889], 13);
        break;
      case 'Jodhpur AFS':
        this.map.flyTo([26.2513889, 73.0480556], 13);
        break;
      case 'Lohegaon AFS':
        this.map.flyTo([18.5819444, 73.9194444], 13);
        break;
      case 'Nal-Bikaner AFS':
        this.map.flyTo([28.0725, 73.2066667], 13);
        break;
      case 'Naliya AFS':
        this.map.flyTo([23.2200000, 68.9000000], 13);
        break;
      case 'Phalodi AFS':
        this.map.flyTo([27.1127778, 72.3888889], 13);
        break;
      case 'Uttarlai AFS':
        this.map.flyTo([25.8127778, 71.4822222], 13);
        break;
      case 'Makarpura AFS':
        this.map.flyTo([22.3294444, 73.2194444], 13);
        break;

      // Add cases for Training Command
      case 'Begumpet AFS':
        this.map.flyTo([17.4522222, 78.4611111], 13);
        break;
      case 'Bidar AFS':
        this.map.flyTo([17.9077778, 77.4858333], 13);
        break;
      case 'Dundigal AFS':
        this.map.flyTo([17.6291667, 78.4033333], 13);
        break;
      case 'Hakimpet AFS':
        this.map.flyTo([17.5533333, 78.5247222], 13);
        break;
      case 'Yelahanka AFS':
        this.map.flyTo([13.1358333, 77.6055556], 13);
        break;
      case 'Admin Training Inst, sambra Belgaum':
        this.map.flyTo([15.8500000, 74.5000000], 13);
        break;

      // Add cases for  Maintenance Command
      case 'Nagpur AFS':
        this.map.flyTo([21.0919444, 79.0469444], 13);
        break;
      case 'Ojhar AFS':
        this.map.flyTo([20.1194444, 73.9136111], 13);
        break;
      case 'Devlali AFS':
        this.map.flyTo([19.8551, 73.80375], 13);
        break;
    }

    // Add the new tile layer
    this.originalimagetile = L.tileLayer.wms(this.originalimagery, {
      layers: 'adampurasf:Mask',
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);

    this.originalimagetile = L.tileLayer.wms(this.originalimagery1, {
      layers: 'ambalaasf:mask',
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);

    this.originalimagetile = L.tileLayer.wms(this.originalimagery2, {
      layers: 'amritsarasf:Mask',
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);

    this.originalimagetile = L.tileLayer.wms(this.originalimagery3, {
      layers: 'awantipurasf:Mask',
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);

    this.originalimagetile = L.tileLayer.wms(this.originalimagery4, {
      layers: 'bathindaasf:Mask',
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);

    this.originalimagetile = L.tileLayer.wms(this.originalimagery5, {
      layers: 'chandigarhasf:mask',
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);

    this.originalimagetile = L.tileLayer.wms(this.originalimagery6, {
      layers: 'halwaraasf:mask',
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);

    this.originalimagetile = L.tileLayer.wms(this.originalimagery7, {
      layers: 'hindonasf:Mask',
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);

    this.originalimagetile = L.tileLayer.wms(this.originalimagery8, {
      layers: 'gurugramasf:Mask',
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);

    this.originalimagetile = L.tileLayer.wms(this.originalimagery9, {
      layers: 'lehasf:Mask',
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);

    this.originalimagetile = L.tileLayer.wms(this.originalimagery10, {
      layers: 'pathankotasf:Mask',
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);

    this.originalimagetile = L.tileLayer.wms(this.originalimagery11, {
      layers: 'sarsawaasf:Mask',
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);

    this.originalimagetile = L.tileLayer.wms(this.originalimagery12, {
      layers: 'sirsaasf:Mask',
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);

    this.originalimagetile = L.tileLayer.wms(this.originalimagery13, {
      layers: 'udhampurasf:Mask',
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);




  }

  onLocationChange(selectedLocation: string) {
    console.log('Selected Location:', selectedLocation);
    this.currentlocation = selectedLocation;
    console.log('Current Location:', this.currentlocation);
    this.setLayerForYear(this.selectedYear);
    // Now, you can call setLayerForYear or any other logic that depends on the location.
    // For example: this.setLayerForYear(this.selectedYear);
  }


  setLayerForYear(selectedYear: number) {
    // Remove existing layer

    if (this.originaltile !== '-') {
      this.map.removeLayer(this.originaltile);
    }

    // Update the layer based on the selected year and current location
    const layerName = `${this.currentlocation}_${selectedYear}`;
    const wmsUrl = 'http://localhost:8080/geoserver/small_obj_detection/wms?service=WMS';

    this.originaltile = L.tileLayer.wms(wmsUrl, {
      layers: layerName,
      crossOrigin: true,
      maxZoom: 20,
      format: 'image/png',
      transparent: true,
      attribution: 'mylayer',
    }).addTo(this.map);
  }

  onYearChange(event: ChangeContext) {
    // Update the layer when the year changes
    console.log('Selected Year:', event.value);
    this.setLayerForYear(event.value);
    this.selectedYear=event.value;
    this.updatePieChart(""+this.selectedYear);
  }



  // setLayerForYear(selectedYear: number) {
  //   // Remove existing layer
  //   if (this.currentLayer) {
  //     this.map.removeLayer(this.currentLayer);

  //   }

  //     // Update the layer based on the selected year

  // const serviceUrlAmbala =
  //       selectedYear === 2016
  //         ? 'http://localhost:8080/geoserver/Mask_ambala2016/wms?service=WMS'
  //         : selectedYear === 2017
  //         ? 'http://localhost:8080/geoserver/Mask_ambala2017/wms?service=WMS'
  //         : selectedYear === 2018
  //         ? 'http://localhost:8080/geoserver/Mask_ambala2018/wms?service=WMS'
  //         : selectedYear === 2019
  //         ? 'http://localhost:8080/geoserver/Mask_ambala2019/wms?service=WMS'
  //         : selectedYear === 2020
  //         ? 'http://localhost:8080/geoserver/Mask_ambala2020/wms?service=WMS'
  //         : selectedYear === 2021
  //         ? 'http://localhost:8080/geoserver/Mask_ambala2021/wms?service=WMS'
  //         : selectedYear === 2022
  //         ? 'http://localhost:8080/geoserver/Mask_ambala2022/wms?service=WMS'
  //         : '';
  //     const layerNameAmbala = `Mask_ambala${selectedYear}:ambalamask_${selectedYear}`;


  //     const serviceUrlAmritsar =
  //       selectedYear === 2013
  //         ? 'http://localhost:8080/geoserver/Mask_amritsar2013/wms?service=WMS'
  //         : selectedYear === 2014
  //         ? 'http://localhost:8080/geoserver/Mask_amritsar2014/wms?service=WMS'
  //         : selectedYear === 2015
  //         ? 'http://localhost:8080/geoserver/Mask_amritsar2015/wms?service=WMS'
  //         : selectedYear === 2016
  //         ? 'http://localhost:8080/geoserver/Mask_amritsar2016/wms?service=WMS'
  //         : selectedYear === 2017
  //         ? 'http://localhost:8080/geoserver/Mask_amritsar2017/wms?service=WMS'
  //         : selectedYear === 2018
  //         ? 'http://localhost:8080/geoserver/Mask_amritsar2018/wms?service=WMS'
  //         : selectedYear === 2019
  //         ? 'http://localhost:8080/geoserver/Mask_amritsar2019/wms?service=WMS'
  //         : selectedYear === 2020
  //         ? 'http://localhost:8080/geoserver/Mask_amritsar2020/wms?service=WMS'
  //         : selectedYear === 2021
  //         ? 'http://localhost:8080/geoserver/Mask_amritsar2021/wms?service=WMS'
  //         : selectedYear === 2022
  //         ? 'http://localhost:8080/geoserver/Mask_amritsar2022/wms?service=WMS'
  //         : '';
  //     const layerNameAmritsar = `Mask_amritsar${selectedYear}:amritsarmask_${selectedYear}`;
  //     const serviceUrlAdampur =
  //     selectedYear === 2013
  //       ? 'http://localhost:8080/geoserver/Mask_adampur2013/wms?service=WMS'
  //       : selectedYear === 2015
  //       ? 'http://localhost:8080/geoserver/Mask_adampur2015/wms?service=WMS'
  //       : selectedYear === 2016
  //       ? 'http://localhost:8080/geoserver/Mask_adampur2016/wms?service=WMS'
  //       : selectedYear === 2017
  //       ? 'http://localhost:8080/geoserver/Mask_adampur2017/wms?service=WMS'
  //       : selectedYear === 2018
  //       ? 'http://localhost:8080/geoserver/Mask_adampur2018/wms?service=WMS'
  //       : selectedYear === 2019
  //       ? 'http://localhost:8080/geoserver/Mask_adampur2019/wms?service=WMS'
  //       : selectedYear === 2020
  //       ? 'http://localhost:8080/geoserver/Mask_adampur2020/wms?service=WMS'
  //       : selectedYear === 2021
  //       ? 'http://localhost:8080/geoserver/Mask_adampur2021/wms?service=WMS'
  //       : selectedYear === 2022
  //       ? 'http://localhost:8080/geoserver/Mask_adampur2022/wms?service=WMS'
  //       : '';
  //   const layerNameAdampur = `Mask_adampur${selectedYear}:adampurmask_${selectedYear}`;


  // // Similar adjustments for serviceUrlAmbala, layerNameAmbala, serviceUrlAmritsar, and layerNameAmritsar

  // if (this.currentLayer) {
  //   this.map.removeLayer(this.currentLayer);
  // }

  // const serviceUrl = this.selectedLocation === 'Adampur' ? serviceUrlAdampur : (this.selectedLocation === 'Ambala' ? serviceUrlAmbala : serviceUrlAmritsar);
  // const layerName = this.selectedLocation === 'Adampur' ? layerNameAdampur : (this.selectedLocation === 'Ambala' ? layerNameAmbala : layerNameAmritsar);

  // this.currentLayer = L.tileLayer.wms(serviceUrl, {
  //   layers: layerName,
  //   crossOrigin: true,
  //   maxZoom: 15,
  //   format: 'image/png',
  //   transparent: true,
  //   attribution: 'mylayer',
  // }).addTo(this.map);

  //   }

  // onYearChange(event: ChangeContext) {
  //   // Update the layer when the year changes
  //   console.log('Selected Year:', event.value);
  //   this.setLayerForYear(event.value);
  // }



  private loadMap(): void {
    this.map = L.map('map').setView([25.122318,55.132433], 14);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: environment.mapbox.accessToken,
    }).addTo(this.map);

    this.getCurrentPosition()
      .subscribe((position: any) => {
        this.map.flyTo([position.latitude, position.longitude], 13);

        const icon = L.icon({
          iconUrl: 'assets/images/marker-icon.png',
          shadowUrl: 'assets/images/marker-shadow.png',
          popupAnchor: [13, 0],
        });

        const marker = L.marker([position.latitude, position.longitude], { icon }).bindPopup('Angular Leaflet');
        marker.addTo(this.map);
      });
  }


}
