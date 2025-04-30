import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';



export type MenuItems = {
  icon: string;
  label: string;
  route: string
};

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, RouterModule, MatListModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit{

  Role: string | null = null;

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.Role = localStorage.getItem('userRole');
  }
  menuItems = signal<MenuItems[]>([
    { icon: 'home', label: 'Home', route: '/admin/home/dashboard' },
    { icon: 'group', label: 'Users', route: '/admin/home/users' },
    { icon: 'pending_actions', label: 'Tasks', route: '/admin/home/tasks' },
    { icon: 'playlist_add_check', label: 'Check List', route: '/admin/home/checklist' },
    { icon: 'list', label: 'Resources', route: '/admin/home/resources' },
    { icon: 'settings', label: 'Settings', route: '/user/home/settings' }
  ]);
}
