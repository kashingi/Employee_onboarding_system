import { Routes } from '@angular/router';
import { LoginComponent } from './Authentication/login/login.component';
import { HomeComponent } from './Admin/home/home.component';
import { UsersComponent } from './Admin/users/users.component';
import { TasksComponent } from './Admin/tasks/tasks.component';
import { ResourcesComponent } from './Admin/resources/resources.component';
import { AccountComponent } from './Shared/account/account.component';
import { GuardService } from './services/guard.service';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { UserDashboardComponent } from './User/user-dashboard/user-dashboard.component';
import { UserHomeComponent } from './User/user-home/user-home.component';
import { MyResourcesComponent } from './User/my-resources/my-resources.component';
import { MyTasksComponent } from './User/my-tasks/my-tasks.component';
import { SettingComponent } from './Admin/setting/setting.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    {
        path: 'admin/home', component: HomeComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'users', component: UsersComponent, canActivate: [GuardService] },
            { path: 'tasks', component: TasksComponent, canActivate: [GuardService] },
            { path: 'resources', component: ResourcesComponent, canActivate: [GuardService] },
            { path: 'account', component: AccountComponent, canActivate: [GuardService] },
            { path: 'setting', component: SettingComponent, canActivate: [GuardService]}
        ]
    },

    //user routes
    {
        path: 'user/home', component: UserHomeComponent,
        children: [
            { path: 'dashboard', component: UserDashboardComponent, canActivate: [GuardService]},
            { path: 'account', component: AccountComponent, canActivate: [GuardService] },
            { path: 'my-resources', component: MyResourcesComponent, canActivate: [GuardService] },
            { path: 'my-tasks', component: MyTasksComponent, canActivate: [GuardService] },
            { path: 'setting', component: SettingComponent, canActivate: [GuardService]}
        ]
    }

];
