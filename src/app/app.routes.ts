import { Routes } from '@angular/router';
import { LoginComponent } from './Authentication/login/login.component';
import { HomeComponent } from './Admin/home/home.component';
import { UsersComponent } from './Admin/users/users.component';
import { TasksComponent } from './Admin/tasks/tasks.component';
import { ResourcesComponent } from './Admin/resources/resources.component';
import { DashboardComponent } from './User/dashboard/dashboard.component';
import { AccountComponent } from './Shared/account/account.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    {
        path: 'admin/home', component: HomeComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'users', component: UsersComponent },
            { path: 'tasks', component: TasksComponent },
            { path: 'resources', component: ResourcesComponent },
            { path: 'account', component: AccountComponent }
        ]
    },

];
