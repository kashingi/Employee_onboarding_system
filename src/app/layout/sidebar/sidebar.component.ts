import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';



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
export class SidebarComponent {
  menuItems = signal<MenuItems[]>([
    { icon: 'home', label: 'Home', route: '/admin/home/dashboard' },
    { icon: 'group', label: 'Employees', route: '/admin/home/users' },
    { icon: 'pending_actions', label: 'Tasks', route: '/admin/home/tasks' },
    { icon: 'list', label: 'Resources', route: '/admin/home/resources' },
  ]);
}
