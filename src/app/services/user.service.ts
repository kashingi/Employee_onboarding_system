import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.baseUrl;
  apiUrl = environment.baseAPI;
  profileImageUrl = '';
  user: any;
  Role: any;

  constructor(private httpClient: HttpClient) { }

  //A public function to login
  public login(loginData: any): Observable<any> {
    const loginUrl = `${environment.baseAPI}/api/auth/login`;

    return this.httpClient.post<any>(loginUrl, loginData);
  }
  public loginUser(loginData: any): Observable<any> {
    const loginUserUlr = 'https://afbb-2c0f-fe38-2020-79ae-694d-eed7-6699-9ca.ngrok-free.app/api/auth/login';

    return this.httpClient.post<any>(loginUserUlr, loginData);
  }

  //Function to add user into the database
  public addUser(userData: any): Observable<any> {
    const userUrl =  `${this.url}users`;

    return this.httpClient.post<any>(userUrl, userData)
  }

  //Update user in the database
  public updateUser(userId: number, userData: any): Observable<any> {
    const updateUrl =  `${this.url}users/${userId}`;

    return this.httpClient.patch<any>(updateUrl, userData);
  }

  //get all ausers from the database
  public getUsers(): Observable<any[]> {
     const usersUrl = `${this.url}users`;

     return this.httpClient.get<any[]>(usersUrl);
  }

  //delete user from the database here
  public deleteUser(userId: any): Observable<any> {
    const deleteUrl = `${this.url}users/${userId}`;

    return this.httpClient.delete<any>(deleteUrl)
  }
  public getRoles(){
    const rolesUrl = `${this.url}roles`
    return this.httpClient.get<any[]>(rolesUrl);
  }

  //add tasks into the database
  public addTasks(taskData: any): Observable<any> {
    const taskUrl = `${this.url}tasks`;

    return this.httpClient.post<any>(taskUrl, taskData);
  }
  //get tasks from the database
  public getTasks(): Observable<any[]> {
    const taskUrl = `${this.url}tasks`;

    return this.httpClient.get<any[]>(taskUrl);
  }
  //Update taks in the database
  public updateTask(taskId: number, updateData: any): Observable<any> {
    const updateUrl = `${this.url}tasks/${taskId}`;

    return this.httpClient.patch<any>(updateUrl, updateData);
  }
 
  //Delete task from the database
  public deleteTask(taskId: any): Observable<any> {
    const deleteUrl = `${this.url}tasks/${taskId}`;

    return this.httpClient.delete<any>(deleteUrl);
  }
  
  //get loginIn user from the database
  getLoggedInUser(userEmail: any): Observable<any> {
    const userUrl = `${this.url}users?email=${userEmail}`;

    return this.httpClient.get<any[]>(userUrl);
  } 

  //Update user by email
  updateUserByEmail(userId: any, updateData: any): Observable<any> {
    const updateUrl = `${this.url}users/${userId}`;

    return this.httpClient.patch<any>(updateUrl, updateData);
  }

  //Update profile photo only
  updatePhoto(userId: any, userProfile: any): Observable<any> {
    const profileUrl = `${this.url}users/${userId}`;

    return this.httpClient.patch<any>(profileUrl, userProfile);
  }

  //get loggedIn user
  currentUser() {
    let userEmail = localStorage.getItem('loggedInEmail');
    // this.ngxService.start();
    this.getLoggedInUser(userEmail).subscribe(
      (resp: any) => {
        // this.ngxService.stop();
        if (resp.length > 0) {
          this.user = resp[0];
          this.Role = this.user.role;
          // prepend the proper data URI header
          this.profileImageUrl = `data:image/jpeg;base64,${this.user.userProfile}`;
          // this.profileImgUrl.set(`data:image/jpeg;base64,${this.user.userProfile}`);
        }
      },
      (error: any) => {
        // this.ngxService.stop();
        console.log(error);
      }
    );
  }
}
