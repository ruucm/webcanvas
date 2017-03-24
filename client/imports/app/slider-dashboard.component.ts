import template from './slider-dashboard.component.html';
import fullpagecss from 'fullpage.js/dist/jquery.fullpage.css';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';
import { routerTransition } from './router.animations';
import { AuthenticationService } from './_simple_login/authentication.service'
import { Canvas0218Service } from './_mojs_services/canvas0218.service';
import myGlobals = require('./globals');

@Component({
	selector: 'my-slider-dashboard',
	template: template,
	styles: [ `` ],
	fullpagecss,
	animations: [routerTransition()],
	host: {'[@routerTransition]': ''},
	providers: [ AuthenticationService, Canvas0218Service ]
})
export class SliderDashboardComponent implements OnInit, OnDestory, OnChanges {
	constructor(
		private _service:AuthenticationService,
		private _service2:Canvas0218Service,
		private router: Router ) {
		this._service2.anim_init();
		console.log('End of anim_init()');
		router.events.forEach((event) => {
			console.log('router event!');
			console.log('event : ' + event);
			console.log('event.url : ' + event.url);
			if (event.url == "/slider-dashboard" || event.url == "/slider-dashboard#firstPage") {
				this.stop_other_anims();
				console.log('I am in but,');
				myGlobals.scene03_timeline.play();
			}
			if (event instanceof NavigationStart) {
				this.stop_other_anims();
				if (event.url == "/slider-dashboard#firstPage/2")
					myGlobals.global_timeline.play();
				if (event.url == "/slider-dashboard#firstPage/1")
					myGlobals.burst_timeline.play();
			}
		});
	}
	stop_other_anims() {
		myGlobals.global_timeline.stop();
		myGlobals.burst_timeline.stop();
		myGlobals.scene03_timeline.stop();
	}
	ngOnInit() {
		$( document ).ready(function() {
			if($('html').hasClass('fp-enabled')){
			    $.fn.fullpage.destroy('all');
			}
			$('#fullpage').fullpage({
			 	//Navigation
				menu: '#menu',
				lockAnchors: false,
				anchors:['firstPage', 'secondPage'],
				navigation: true,
				navigationPosition: 'right',
				navigationTooltips: ['firstSlide', 'secondSlide'],
				showActiveTooltip: true,
				slidesNavigation: true,
				slidesNavPosition: 'top',
				sectionsColor: ['#f2f2f2', '#4BBFC3', '#7BAABE', '#F5E0E0', '#000'],
			});
		});
	}
	logout() {
		this._service.logout();
	}
	ngOnDestroy() {
		console.log('On Destory Slider Dashboard');
		if($('html').hasClass('fp-enabled')){
			$.fn.fullpage.destroy('all');
		}
	}
}
