import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { NgxUiLoaderModule } from 'ngx-ui-loader';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatCardModule, NgxUiLoaderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Employee_Onboarding';
}
