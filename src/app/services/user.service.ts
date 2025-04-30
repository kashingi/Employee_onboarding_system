import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT } from '../tokens/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = inject(ENVIRONMENT).baseUrl
  profileImageUrl = '';
  user: any;
  Role: any;

  #platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.#platformId)

  constructor(private httpClient: HttpClient) { }

  //A public function to login
  public login(loginData: any): Observable<any> {
    const loginUrl = `${this.baseUrl}/api/auth/login`;

    return this.httpClient.post<any>(loginUrl, loginData);
  }
  public loginUser(loginData: any): Observable<any> {
    const loginUserUlr = `${this.baseUrl}/api/account/auth/token`;


    return this.httpClient.post<any>(loginUserUlr, loginData);
  }

  //Function to add user into the database
  public addUser(userData: any): Observable<any> {
    const userUrl = `${this.baseUrl}users`;

    return this.httpClient.post<any>(userUrl, userData)
  }

  //Update user in the database
  public updateUser(userId: number, userData: any): Observable<any> {
    const updateUrl = `${this.baseUrl}users/${userId}`;

    return this.httpClient.patch<any>(updateUrl, userData);
  }

  //get all ausers from the database
  public getUsers(): Observable<any[]> {
    const usersUrl = `${this.baseUrl}users`;

    return this.httpClient.get<any[]>(usersUrl);
  }

  //delete user from the database here
  public deleteUser(userId: any): Observable<any> {
    const deleteUrl = `${this.baseUrl}users/${userId}`;

    return this.httpClient.delete<any>(deleteUrl)
  }
  public getRoles() {
    const rolesUrl = `${this.baseUrl}roles`
    return this.httpClient.get<any[]>(rolesUrl);
  }

  //add tasks into the database
  public addTasks(taskData: any): Observable<any> {
    const taskUrl = `${this.baseUrl}tasks`;

    return this.httpClient.post<any>(taskUrl, taskData);
  }
  //get tasks from the database
  public getTasks(): Observable<any[]> {
    const taskUrl = `${this.baseUrl}tasks`;

    return this.httpClient.get<any[]>(taskUrl);
  }
  //Update taks in the database
  public updateTask(taskId: number, updateData: any): Observable<any> {
    const updateUrl = `${this.baseUrl}tasks/${taskId}`;

    return this.httpClient.patch<any>(updateUrl, updateData);
  }

  //Delete task from the database
  public deleteTask(taskId: any): Observable<any> {
    const deleteUrl = `${this.baseUrl}tasks/${taskId}`;

    return this.httpClient.delete<any>(deleteUrl);
  }

  //get loginIn user from the database
  public getLoggedInUser(userEmail: any): Observable<any> {
    const userUrl = `${this.baseUrl}users?email=${userEmail}`;

    return this.httpClient.get<any[]>(userUrl);
  }

  //Update user by email
  public updateUserByEmail(userId: any, updateData: any): Observable<any> {
    const updateUrl = `${this.baseUrl}users/${userId}`;

    return this.httpClient.patch<any>(updateUrl, updateData);
  }

  //Update profile photo only
  public updatePhoto(userId: any, userProfile: any): Observable<any> {
    const profileUrl = `${this.baseUrl}users/${userId}`;

    return this.httpClient.patch<any>(profileUrl, userProfile);
  }

  //get loggedIn user
  public currentUser() {

    if (!this.isBrowser) return;

    let userEmail = localStorage.getItem('loggedInEmail');
    // this.ngxService.start();
    this.getLoggedInUser(userEmail).subscribe(
      {
        next: (resp: any) => {
          // this.ngxService.stop();
          if (resp.length > 0) {
            this.user = resp[0];
            this.Role = this.user.role;

            this.profileImageUrl = `data:image/jpeg;base64,${this.user.userProfile}`;
            // this.profileImgUrl.set(`data:image/jpeg;base64,${this.user.userProfile}`);
          }
        },
        error: (error: any) => {
          // this.ngxService.stop();
          console.log(error);
        }
      }
    );
  }

  //add common requirement into the database
  public addAdminRequirements(reqData: any): Observable<any> {
    const reqUrl = `${this.baseUrl}adminRequirements`;

    return this.httpClient.post<any>(reqUrl, reqData);
  }
  //get common user onboarding requiremnts
  public getAdminRequirements(): Observable<any[]> {
    const adminRequirements = `${this.baseUrl}adminRequirements`;

    return this.httpClient.get<any[]>(adminRequirements);
  }

  //add developer requirement into the database
  public addDeveloperRequirements(reqData: any): Observable<any> {
    const reqUrl = `${this.baseUrl}developerRequirements`;

    return this.httpClient.post<any>(reqUrl, reqData);
  }
  //get developer onboarding requiremnts
  public getDeveloperRequirements(): Observable<any[]> {
    const developerRequirements = `${this.baseUrl}developerRequirements`;

    return this.httpClient.get<any[]>(developerRequirements);
  }

  public addDesignerRequirements(reqData: any): Observable<any> {
    const reqUrl = `${this.baseUrl}designerRequirements`;

    return this.httpClient.post<any>(reqUrl, reqData);
  }
  //get common user onboarding requiremnts
  public getDesignerRequirements(): Observable<any[]> {
    const commonRequirements = `${this.baseUrl}designerRequirements`;

    return this.httpClient.get<any[]>(commonRequirements);
  }

  //Add HR onboarding requirements
  public addHRRequirements(reqData: any): Observable<any> {
    const reqUrl = `${this.baseUrl}hrRequirements`;

    return this.httpClient.post<any>(reqUrl, reqData);
  }
  //get common user onboarding requiremnts
  public getHRRequirements(): Observable<any[]> {
    const hrRequirements = `${this.baseUrl}hrRequirements`;

    return this.httpClient.get<any[]>(hrRequirements);
  }
}
