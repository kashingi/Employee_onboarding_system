import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor( 
    private router: Router,
    private snackbar: SnackbarService
  ) { }


  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.isAuthenticated()) {
        return true;
      
    }else {
      this.snackbar.warning("Kindly log in to access this page.", "X");
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }

  public isAuthenticated(): boolean{
    const token = localStorage.getItem('loggedInEmail');
    if (!token) {
      this.router.navigate(['/']);
      return false;
    }else{
      return true;
    }
  }
}
