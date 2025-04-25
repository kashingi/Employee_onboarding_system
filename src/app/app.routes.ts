import { Routes } from '@angular/router';
import { LoginComponent } from './Authentication/login/login.component';
import { HomeComponent } from './Admin/home/home.component';
import { UsersComponent } from './Admin/users/users.component';
import { TasksComponent } from './Admin/tasks/tasks.component';
import { ResourcesComponent } from './Admin/resources/resources.component';
import { DashboardComponent } from './User/dashboard/dashboard.component';
import { AccountComponent } from './Shared/account/account.component';
import { GuardService } from './services/guard.service';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    {
        path: 'admin/home', component: HomeComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'users', component: UsersComponent, canActivate: [GuardService] },
            { path: 'tasks', component: TasksComponent, canActivate: [GuardService]},
            { path: 'resources', component: ResourcesComponent, canActivate: [GuardService]},
            { path: 'account', component: AccountComponent, canActivate: [GuardService]}
        ]
    },
    { path: 'user/dashboard', component: DashboardComponent}

];
