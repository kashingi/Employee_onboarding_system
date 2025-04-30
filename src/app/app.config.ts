import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
  BrowserModule,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxUiLoaderConfig, NgxUiLoaderModule, SPINNER } from 'ngx-ui-loader';
import { IEnvironment, ENVIRONMENT } from './tokens/environment';
import { environment } from '../environments/environment.development';



//Configure the ngx-ui-loader here
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: "Loading ...",
  textColor: "#FFFFFF",
  textPosition: "center-center",
  bgsColor: "#7b1fa2",
  fgsColor: "#7b1fa2",
  fgsType: SPINNER.fadingCircle,
  fgsSize: 100,
  hasProgressBar: false
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    MatNativeDateModule,
    provideClientHydration(withEventReplay()),
    provideClientHydration(withEventReplay()),
    provideNativeDateAdapter(),
    importProvidersFrom(NgxUiLoaderModule.forRoot(ngxUiLoaderConfig), MatStepperModule),
{
  provide: ENVIRONMENT,
  useValue: {
    baseUrl: environment.baseUrl
  } as IEnvironment
}
  ],
};
