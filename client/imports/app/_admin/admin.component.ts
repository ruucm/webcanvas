import { Component } from '@angular/core';
import { AuthenticationService } from '../_simple_login/authentication.service'
import { CanvasContents } from '../../../../imports/api/canvas-contents.js';
import { ProjectContents } from '../../../../imports/api/project-contents.js';
import { WordContents } from '../../../../imports/api/word-contents.js';
import { Slide } from '../slide.ts';
import template from './admin.component.html'

@Component({
	selector: 'my-admin',
	providers: [AuthenticationService],
	template: template
})
export class AdminComponent {
	canvas_title = '';
	project_title = '';
	word_title = '';
	my_words;
	my_canvases;
	public editorContent: string = 'My Canvas\'s Contents'
	public editorContent2: string = 'My Project\'s Contents'
	public editorContent3: string = 'My Word\'s Contents'

	constructor(
		private _service:AuthenticationService){}
	ngOnInit(){
		this._service.checkCredentials();
		var refreshIntervalId = setInterval(() => this.updateData(), 100);
		Meteor.subscribe("wordcontents", {
			onReady: function () {
				setTimeout( () => {
					clearInterval(refreshIntervalId);
				},100)
			},
			onError: function () { console.log("onError", arguments); }
		});
		Meteor.subscribe("canvascontents", {
			onReady: function () {
				setTimeout( () => {
					clearInterval(refreshIntervalId);
				},100)
			},
			onError: function () { console.log("onError", arguments); }
		});
	}
	updateData() {
		this.my_words = this.get_words();
		this.my_canvases = this.get_canvases();
	}
	logout() {
		this._service.logout();
	}
	addCanvas(canvas_title) {
		var inital_value = [ { id: 1, text: canvas_title} ];
		var content_length = CanvasContents.find().map((messages: Canvas[]) => { return messages; }).length;
		CanvasContents.insert({
			contentid: content_length + 1,
			canvastitle: canvas_title,
			content: inital_value,
			createdAt: new Date,
		});
		this.canvas_title = '';
		this.my_canvases = this.get_canvases();
	}
	addCanvasContents(canvas, editorContent) {
		var value = canvas.content;
		value.push({ id: value.length + 1, text: editorContent, createdAt: new Date, });
		CanvasContents.update(canvas._id, {
			$set: {
				content: value
			},
		});
		this.editorContent = '';
	}
	get_canvases(): Canvas[] {
		return CanvasContents.find().map((messages: Canvas[]) => { return messages; });
	}
	removeCanvas(canvas) {
		CanvasContents.remove(canvas._id);
		this.my_canvases = this.get_canvases();
	}
	addProject(project_title) {
		var inital_value = [ { id: 1, text: project_title} ];
		var content_length = ProjectContents.find().map((messages: Canvas[]) => { return messages; }).length;
		ProjectContents.insert({
			contentid: content_length + 1,
			projecttitle: project_title,
			content: inital_value,
			createdAt: new Date,
		});
		this.project_title = '';
	}
	addWord(word_title) {
		var inital_value = [ { id: 1, text: word_title} ];
		var content_length = WordContents.find().map((messages: Canvas[]) => { return messages; }).length;
		WordContents.insert({
			contentid: content_length + 1,
			wordtitle: word_title,
			content: inital_value,
			createdAt: new Date,
		});
		this.word_title = '';
		this.my_words = this.get_words();
	}
	addWordContents(word, editorContent3) {
		console.log('canvas._id : ');
		console.log(word._id);
		var value = word.content;
		value.push({ id: value.length + 1, text: editorContent3, createdAt: new Date, });
		WordContents.update(word._id, {
			$set: {
				content: value
			},
		});
		this.editorContent3 = '';
	}
	get_words(): Canvas[] {
		return WordContents.find().map((messages: Canvas[]) => { return messages; });
	}
	removeWord(word) {
		WordContents.remove(word._id);
		this.my_words = this.get_words();
	}
}
