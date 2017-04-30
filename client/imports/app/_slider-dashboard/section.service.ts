import { Injectable } from '@angular/core';

@Injectable()
export class SectionService {
	loading_screen_1_duration = 2100;
	loading_screen_2_duration = 500;

	addMoveToclickEvent(): void {
		var classname = document.getElementsByClassName("post-title");
		for (var i = 0; i < classname.length; i++) {
			classname[i].addEventListener('click', function(){ $.fn.fullpage.moveSlideRight(); }, false);
		}
	}
}
