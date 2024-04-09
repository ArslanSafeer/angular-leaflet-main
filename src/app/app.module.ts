import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from './services/auth.service';
import { UserLoginComponent } from './user-login/user-login.component';
import { SignupComponent } from './signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { ShapeService } from './shape.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';




@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UserLoginComponent,
    SignupComponent,

  
    
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxSliderModule,
    ReactiveFormsModule,
    CommonModule,
    RouterOutlet,
    HttpClientModule,
    CanvasJSAngularChartsModule


  ],
  
  providers: [
    AuthService,
    ShapeService
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
