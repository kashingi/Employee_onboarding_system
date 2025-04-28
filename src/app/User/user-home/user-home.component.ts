import { Component, signal, computed } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../layout/header/header.component';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SideNavComponent } from "../../layout/side-nav/side-nav.component";

@Component({
  selector: 'app-user-home',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    HeaderComponent,
    RouterOutlet,
    MatButtonModule,
    SideNavComponent
],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.scss'
})
export class UserHomeComponent {

  collapsed = signal(false);

  sidenavWidth = computed(() => this.collapsed() ? '65px' : '15%');
}
