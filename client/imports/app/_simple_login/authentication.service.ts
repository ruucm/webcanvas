import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UsersDatabase } from '../../../../imports/api/users-database.js';
import { LoginComponent } from './login.component'

export class User {
  constructor(
    public email: string,
    public password: string) { }
}

@Injectable()
export class AuthenticationService {
	constructor(
		private _router: Router){}
	logout(navigateTo) {
		localStorage.removeItem("user");
		if (navigateTo == 'home')
			this._router.navigate(['home']);
		else
			this._router.navigate(['login']);
	}
	login(user){
		this.users = this.get_users();
		var authenticatedUser = this.users.find(u => u.email === user.email);
		if (authenticatedUser && authenticatedUser.password === user.password){
			localStorage.setItem("user", authenticatedUser);
			this._router.navigate(['home']);
			return true;
		}
		return false;
	}
	hideToPublic(){
		if (localStorage.getItem("user") === null){
		  return false;
		}
		return true;
	}
	checkCredentials(){
		if (localStorage.getItem("user") === null){
		  this._router.navigate(['login']);
		  return false;
		}
		return true;
	}
	get_users(): User[] {
		return UsersDatabase.find().map((messages: User[]) => { return messages; });
	}
}
