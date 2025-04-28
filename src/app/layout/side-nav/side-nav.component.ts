import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';


export type MenuItems = {
  icon: string;
  label: string;
  route: string
};

@Component({
  selector: 'app-side-nav',
  imports: [MatIconModule, RouterModule, MatListModule, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})

export class SideNavComponent implements OnInit {

  Role: string | null = null;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.Role = localStorage.getItem('userRole');
  }
  menuItems = signal<MenuItems[]>([
    { icon: 'home', label: 'Home', route: '/user/home/dashboard' },

    { icon: 'playlist_add_check', label: 'My Tasks', route: '/user/home/my-tasks' },
    { icon: 'list', label: 'Resources', route: '/user/home/my-resources' },
    { icon: 'settings', label: 'Settings', route: '/user/home/setting' }
  ]);
}

