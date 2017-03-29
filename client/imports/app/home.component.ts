import template from './home.component.html';
import { Component } from '@angular/core';
import { routerTransition } from './router.animations';
import { AuthenticationService } from './_simple_login/authentication.service'
import { TranslateService } from '@ngx-translate/core';
import myGlobals = require('../globals');
import { WordContents } from '../../../imports/api/word-contents.js';
import { Meteor } from 'meteor/meteor';

@Component({
	selector: 'my-home',
	template: template,
	animations: [routerTransition('left')],
	host: {'[@routerTransition]': ''},
	providers: [ AuthenticationService ]
})
export class HomeComponent {
	home_words;
	constructor(
		private _service:AuthenticationService,
		private translate: TranslateService
	) { }
	logout() {
		this._service.logout('home');
	}
	trackByFn(index, item) {
		return index;
	}
	ngOnInit() {
		var refreshIntervalId = setInterval(() => this.updateData(), 100);
		Meteor.subscribe("wordcontents", {
			onReady: function () {
				console.log("onReady And the Items actually Arrive");
				setTimeout( () => {
					clearInterval(refreshIntervalId);
					console.log("STOP!!");
				},100)
			},
			onError: function () { console.log("onError", arguments); }
		});
	}
	updateData() {
		console.log('updateDate!');
		this.home_words = WordContents.find().map((messages: Canvas[]) => { return messages; });
	}
	change_lang(value) {
		this.translate.use(value);
	}
}
