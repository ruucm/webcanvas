import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanvasComponent } from './_canvas/canvas.component';
import { ProjectsComponent } from './_project/projects.component';
import { WordsComponent } from './_word/words.component';
import { HomeComponent } from './_home/home.component';
import { SliderDashboardComponent } from './_slider-dashboard/slider-dashboard.component';

import { LoginComponent } from './_simple_login/login.component';
import { PrivateComponent } from './_simple_login/private.component';
import { RegisterComponent } from './_simple_login/register.component';
import { AdminComponent } from './_admin/admin.component';
import { NotFoundComponent } from './notfound.component';
import { ImageCropperAppComponent } from './_img_cropper/imgcropper.component';

const routes: Routes = [
	{ path: 'home', component: HomeComponent, useAsDefault:true },
	{ path: 'slider-dashboard', component: SliderDashboardComponent },
	{ path: ':cat/:plink', component: SliderDashboardComponent },
	{ path: 'canvas', redirectTo: '/404' },
	{ path: 'projects', component: ProjectsComponent },
	{ path: 'word', redirectTo: '/404' },
	{	path: '', /*canActivate: [AuthGuard],*/
		redirectTo: '/home',
		pathMatch: 'full'
	},
	{ path: 'login', name: 'Login', component: LoginComponent },
	{ path: 'admin', component: AdminComponent },
	{ path: 'img-crp', component: ImageCropperAppComponent },
	{path: '404', component: NotFoundComponent},
	{path: '**', redirectTo: '/404'}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
