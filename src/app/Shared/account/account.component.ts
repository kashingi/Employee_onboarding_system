import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-account',
  imports: [CommonModule, MatCardModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit{

  user: any;
  profileImageUrl = ''; 

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser();
  }

  //get loggedIn user
  currentUser() {
    let userEmail = localStorage.getItem('loggedInEmail');
    this.userService.getLoggedInUser(userEmail).subscribe(
      (resp: any)=>{
        console.log(resp);
        if (resp.length > 0) {
          this.user = resp[0];
          // prepend the proper data URI header
          this.profileImageUrl = `data:image/jpeg;base64,${this.user.userProfile}`;
        }
      },
      (error: any)=>{
        console.log(error);
      }
    );
  }
}
