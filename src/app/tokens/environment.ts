import { InjectionToken } from '@angular/core'
export interface IEnvironment {
    baseUrl: string
}

export const ENVIRONMENT = new InjectionToken<IEnvironment>('app-environment')