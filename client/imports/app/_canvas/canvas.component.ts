import { Component, Input } from '@angular/core';
import { SectionService } from '../_slider-dashboard/section.service';
import { Location } from '@angular/common';
import { CanvasContents } from '../../../../imports/api/canvas-contents.js';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { SafeHtmlPipe } from '../_slider-dashboard/safe.html.pipe';
import template from './canvas.component.html';
import template_dialog from './dialog-show-canvas-list.html';

@Component({
	selector: 'my-canvases',
	template: template
})
export class CanvasComponent {
	newText = '';
	@Input('current_canvas') current_canvas;
	@Input('current_canvas_length') current_canvas_length;
	@Input('current_canvas_order') current_canvas_order;
	@Input('current_canvas_url') current_canvas_url;
	@Input('canvas_list') canvas_list;
	@Input('canvas_list_length') canvas_list_length;
	current_canvas_id;
	share_button_text = 'Share It!';
	isCopied: boolean = false;
	isCopied1: boolean = false;

	constructor(
		private sectionService: SectionService,
		private router: Router,
		public dialog: MdDialog,
		private location: Location ) {
		router.events.forEach((event) => {
			var splited_value = event.url.split('/');
			if (event.url == "/slider-dashboard" || splited_value[splited_value.length - 2] == "canvas" || (event.url).slice(-11) == "#CanvasPage") {
				this.sectionService.isCanvasTitleScene = true;
			} else 
				this.sectionService.isCanvasTitleScene = false; 
			if (event instanceof NavigationStart) {
				if ( (event.url).slice(-1) == this.current_canvas_length - 1)
					this.sectionService.isCanvasLastScene = true;
				else
					this.sectionService.isCanvasLastScene = false; 
			}
		});
	}
	share_text_change() {
		if (!this.isCopied) {
			this.share_button_text = "Now, Link Copied";
			this.isCopied = true;
		} else {
			this.share_button_text = "Share It!";
			this.isCopied = false;
		}
	}
	get_canvase(which_canvas): Canvas[] {
		console.log('get_canvase, which_canvas : ' + which_canvas);
		if (!isNaN(which_canvas)) {
			this.current_canvas_order = which_canvas;
			var res = CanvasContents.find({ contentid: which_canvas }).map((messages: Canvas[]) => { return messages; })[0];
			this.current_canvas_id = res._id;
			this.current_canvas_length = res.content.length;
			return res.content;
		} else if(which_canvas == 'older') {
			this.current_canvas_order -= 1;
			if (this.current_canvas_order - 1 < 1) {
				this.sectionService.openSnackBar('It is the Oldest fish, I\'ve ever Caught!', '👌');
				this.current_canvas_order += 1;
				return false;
			} else {
				this.current_canvas = this.get_canvase(this.current_canvas_order);
				$.fn.fullpage.moveTo('CanvasPage', 0);
				this.sectionService.isCanvasTitleScene = true;
				this.sectionService.isCanvasLastScene = false;
			}
		} else if(which_canvas == 'younger') {
			this.current_canvas_order += 1;
			if (this.current_canvas_order - 1 >= this.canvas_list_length) {
				this.sectionService.openSnackBar('It is the Youngest fish, I\'ve ever Caught!', '👌');
				this.current_canvas_order -= 1;
				return false;
			} else {
				this.current_canvas = this.get_canvase(this.current_canvas_order);
				$.fn.fullpage.moveTo('CanvasPage', 0);
				this.sectionService.isCanvasTitleScene = true;
				this.sectionService.isCanvasLastScene = false;
			}
		} else {
			var res = CanvasContents.find({ _id: which_canvas }).map((messages: Canvas[]) => { return messages; })[0].content;
			this.current_canvas_length = res.length;
			return res;
		}
		return true;
	}
	update_permalink(id) {
		var getUrl = window.location;
		var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[0];
		this.current_canvas_url = baseUrl + 'canvas/'+ id;
		this.isCopied = false;
		this.share_button_text = "Share It!";
	}
	get_recent_canvas() {
		console.log('get_recent_canvas');
		this.show_loading_cover();
		this.current_canvas = this.get_canvase(this.canvas_list_length);
		this.updatefullpage();
		this.hide_loading_cover();
	}
	openCanvasListDialog() {
		const config = new MdDialogConfig();
		config.data = this.canvas_list;
		let dialogRef = this.dialog.open(DialogShowCanvasList, config);
		dialogRef.afterClosed().subscribe(
			result => {
			if (result != undefined) {
				this.show_loading_cover();
				this.current_canvas = this.get_canvase(result)
				this.updatefullpage();
				this.hide_loading_cover();
			}
		});
	}
	older_from_current_canvase() {
		if ( this.get_canvase('older') ) {
			this.show_loading_cover();
			this.sectionService.fixurl_to_title_page();
			this.updatefullpage();
			this.hide_loading_cover();
		}
	}
	younger_from_current_canvase() {
		if ( this.get_canvase('younger') ) {
			this.show_loading_cover();
			this.sectionService.fixurl_to_title_page();
			this.updatefullpage();
			this.hide_loading_cover();
		}
	}
	updatefullpage() {
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
		}, function (error) {
			// 실패시 
			console.error(error);
		});
		this.update_permalink(this.current_canvas_id);
	}
	destroyfullpage() {
		if($('html').hasClass('fp-enabled')){
			$.fn.fullpage.destroy('all');
		}
		return true;
	}

	/* Inner Cover Load-Effect */
	show_loading_cover() {
		$("#slider-dashboard-container").removeClass("loading_inner_data_end");
		$("#slider-dashboard-container").addClass("loading_inner_data");
		$(".loading-screen-2").removeClass("loading_end");
		$(".loading-screen-2").removeClass("loading-screen-2-hide");
	}
	hide_loading_cover() {
		setTimeout(() => { $("#slider-dashboard-container").removeClass("loading_inner_data"); $("#slider-dashboard-container").addClass("loading_inner_data_end"); this.myproject_lazy_load() }, 100);
		$(".loading-screen-2").addClass("loading_end");
		setTimeout(() => { $(".loading-screen-2").addClass("loading-screen-2-hide"); this.sectionService.addMoveToclickEvent(); }, this.sectionService.loading_screen_2_duration);
	}
	myproject_lazy_load() {
		$(".myprojects").removeClass("loading_inner_data");
		$(".myprojects").addClass("loading_inner_data_end");
	}
}

@Component({
	selector: 'dialog-show-canvas-list',
	template: template_dialog
})
export class DialogShowCanvasList {
	private canvas_list;
	constructor(public dialogRef: MdDialogRef<DialogShowCanvasList>) {}
	ngOnInit() {
		this.canvas_list = this.dialogRef.config.data;
	}
}
