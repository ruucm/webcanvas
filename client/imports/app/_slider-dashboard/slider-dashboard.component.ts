import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_simple_login/authentication.service'
import { ActivatedRoute, Params } from '@angular/router';
import { CanvasContents } from '../../../../imports/api/canvas-contents.js';
import { WordContents } from '../../../../imports/api/word-contents.js';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';
import { SectionService } from './section.service';
import { HighlightJsService } from 'angular2-highlight-js';
import template from './slider-dashboard.component.html';
import fullpagecss from 'fullpage.js/dist/jquery.fullpage.css';

@Component({
	selector: 'my-slider-dashboard',
	template: template,
	fullpagecss,
	providers: [ AuthenticationService ]
})
export class SliderDashboardComponent {
	hero;
	current_word;
	current_word_length = 0;
	current_word_order: number;
	current_word_url;
	word_list;
	word_list_length = 0;
	current_canvas;
	current_canvas_length = 0;
	current_canvas_order: number;
	current_canvas_url;
	canvas_list;
	canvas_list_length = 0;
	constructor(
		private sectionService: SectionService,
		private highlightJsService: HighlightJsService,
		private _service:AuthenticationService,
		private route: ActivatedRoute ) {
		$(".loading-screen-2").addClass("loading");
		setTimeout(() => {
			$(".loading-screen-1").addClass("loading_end");
		}, this.sectionService.loading_screen_1_duration );
	}
	ngOnInit() {
		this.route.params
			.switchMap((params: Params) => this.ready_contents(params['cat'], params['plink']))
			.subscribe(result => this.hero = result);
	}
	ready_contents(cat, plink) {
		console.log('cat : ' + cat);
		console.log('plink : ' + plink);
		if (cat != undefined)
			$(".loading-screen-1").addClass("loading_end");
		if (plink == undefined)
			plink = 'init';
		MeteorObservable.subscribe('canvascontents').subscribe(() => {
			MeteorObservable.autorun().subscribe(() => {
				this.load_words(cat, plink);
			});
		});
		return 'W';
	}
	HighlightUsingService() {
		var x = document.querySelectorAll('.typescript');
		x.forEach((item, index) => {
			this.highlightJsService.highlight(item);
		});
	}
	load_words(cat, plink): void {
		MeteorObservable.subscribe('wordcontents').subscribe(() => {
			MeteorObservable.autorun().subscribe(() => {
				this.updateDatas(cat, plink);
				$(".loading-screen-2").addClass("loading_end");
				setTimeout(() => { $(".loading-screen-2").addClass("loading-screen-2-hide"); this.HighlightUsingService(); this.sectionService.addMoveToclickEvent(); }, this.sectionService.loading_screen_2_duration );
				setTimeout(() => { $("#slider-dashboard-container").removeClass("loading_inner_data"); $("#slider-dashboard-container").addClass("loading_inner_data_end"); this.myproject_lazy_load(); }, 100);
			});
		});
	}
	myproject_lazy_load() {
		$(".myprojects").removeClass("loading_inner_data");
		$(".myprojects").addClass("loading_inner_data_end");
	}
	updateDatas(cat, opt) {
		var isfromPermalink = false;

		if (opt == 'init')
			opt = 1;
		else
			isfromPermalink = true;
		/* Handling ~/slider dashboar/* links */
		if (cat == 'slider-dashboard' || (cat == undefined && opt == 1)) {
			this.get_canvas(1);
			this.get_word(1);
		} else if (cat == 'canvas') {
			this.get_canvas(opt);
			this.get_word(1);
		} else if (cat == 'word') {
			this.get_canvas(1);
			this.get_word(opt)
		}
		this.updatefullpage(cat, isfromPermalink);
	}
	get_canvas(which_canvas): void {
		this.canvas_list = CanvasContents.find({}, { fields: {'content':0}, sort: { createdAt: -1 } }).map((messages: Canvas[]) => { return messages; });
		this.canvas_list_length = this.canvas_list.length;

		if (!isNaN(which_canvas)) {
			this.current_canvas_order = which_canvas;
			var res = CanvasContents.find({ contentid: +which_canvas }).map((messages: Canvas[]) => { return messages; })[0];
			this.current_canvas = res.content;
			this.current_canvas_length = this.current_canvas.length;
			this.make_permalink('canvas' , res._id);
		} else {
			var res = CanvasContents.find({ _id: which_canvas }).map((messages: Canvas[]) => { return messages; })[0];
			this.current_canvas = res.content;
			this.current_canvas_order = res.contentid;
			this.current_canvas_length = this.current_canvas.length;
			this.make_permalink('canvas' , which_canvas);
		}
	}
	get_word(which_word): void {
		this.word_list = WordContents.find({}, { fields: {'content':0}, sort: { createdAt: -1 } }).map((messages: Canvas[]) => { return messages; });
		this.word_list_length = this.word_list.length;

		if (!isNaN(which_word)) {
			this.current_word_order = which_word;
			var res = WordContents.find({ contentid: +which_word }).map((messages: Canvas[]) => { return messages; })[0];
			this.current_word = res.content;
			this.current_word_length = this.current_word.length;
			this.make_permalink('word' , res._id);
		} else {
			var res = WordContents.find({ _id: which_word }).map((messages: Canvas[]) => { return messages; })[0];
			this.current_word = res.content;
			this.current_word_order = res.contentid;
			this.current_word_length = this.current_word.length;
			this.make_permalink('word' , which_word);
		}
	}
	make_permalink(cat, _id) {
		var getUrl = window.location;
		var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[0];
		if (cat == 'canvas')
			this.current_canvas_url = baseUrl + cat + '/'+ _id;
		else if (cat == 'word')
			this.current_word_url = baseUrl + cat + '/'+ _id;
	}
	updatefullpage(cat, isfromPermalink) {
		var reloadfullpage = function() {
			$('#fullpage').fullpage({
				css3: false,
				menu: '#menu',
				lockAnchors: false,
				anchors:['CanvasPage', 'ProjectPage', 'WordPage'],
				navigation: true,
				navigationPosition: 'right',
				navigationTooltips: ['Canvas', 'Project', 'Word'],
				showActiveTooltip: false,
				slidesNavigation: false,
				sectionsColor: ['#FCBCB0', '#CEA1AC', '#EDA89C', '#F5E0E0', '#000'],
				controlArrows: false,
				scrollOverflow: true,
				scrollingSpeed: 550
			});
		}
		//Promise 선언
		var _promise = function (param) {
			return new Promise(function (resolve, reject) {
				// 비동기를 표현하기 위해 setTimeout 함수를 사용 
				window.setTimeout(function () {
					// 파라메터가 참이면, 
					if (param) {
						// 해결됨 
						resolve("해결 완료");
					}
					// 파라메터가 거짓이면, 
					else {
						// 실패 
						reject(Error("실패!!"));
					}
				}, 0);
			});
		};
		//Promise 실행
		_promise(this.destroyfullpage())
		.then(function (text) {
			// 성공시
			reloadfullpage();
			console.log(text);
			if (isfromPermalink) {
				if (cat == 'project')
					$.fn.fullpage.moveTo('ProjectPage');
				else if (cat == 'word') 
					setTimeout(function(){ $.fn.fullpage.moveTo('WordPage'); }, 100);
				else
					$.fn.fullpage.moveTo('CanvasPage');
			}
		}, function (error) {
			// 실패시 
			console.error(error);
		});
	}
	destroyfullpage() {
		if($('html').hasClass('fp-enabled')){
			$.fn.fullpage.destroy('all');
		}
		return true;
	}
	logout() {
		this._service.logout();
	}
	ngOnDestroy() {
		this.destroyfullpage();
	}
}
