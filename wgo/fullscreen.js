//--- Fullscreen mode ---------------------------------------------------------------------------------------------------

var FSCHANGE = document.onfullscreenchange !== undefined ? "onfullscreenchange" : (
			     document.onmozfullscreenchange !== undefined ? "onmozfullscreenchange" : (
			       document.onwebkitfullscreenchange !== undefined ? "onwebkitfullscreenchange" : (
			         document.onmsfullscreenchange !== undefined ? "onmsfullscreenchange" : false
			       )
				 )
			   );
var FSCLOSE = document.exitFullscreen ? "exitFullscreen" : (
			    document.mozCancelFullScreen ? "mozCancelFullScreen" : (
			      document.webkitCancelFullScreen ? "webkitCancelFullScreen" : (
			        document.msCancelFullScreene !== undefined ? "document.msCancelFullScreen" : false
			      )
			    )
			  );
var FSREQUEST = Element.prototype.requestFullscreen !== undefined ? "requestFullscreen" : (
			      Element.prototype.mozRequestFullScreen !== undefined ? "mozRequestFullScreen" : (
			        Element.prototype.webkitRequestFullScreen !== undefined ? "webkitRequestFullScreen" : (
			          Element.prototype.msRequestFullScreen !== undefined ? "msRequestFullScreen" : false
			        )
				  )
				);

var fullscreenChange = function() {
	if (document.fullscreenElement || document.mozFullScreen || document.webkitIsFullScreen || document.msFullScreen) {
		this.dispatchEvent({
			type: "fullscreenChange",
			target: this,
			on: true,
		});
	} 
	else {
		this.dispatchEvent({
			type: "fullscreenChange",
			target: this,
			on: false,
		});
		document[FSCHANGE] = "";
	}
}

var fullscreenProcess = function(elem) {
	if (document.fullscreenElement || document.mozFullScreen || document.webkitIsFullScreen || document.msFullScreen) {
		document[FSCLOSE]();
		return false;
	}
	else {
		elem[FSREQUEST]();
		return true;
	}
}

/**
 * Toggle fullscreen mode.
 */
	
Player.prototype.toggleFullscreen: function() {
	if(FSCHANGE) {
		document[FSCHANGE] = fullscreenChange.bind(this);
		fullscreenProcess.call(undefined, this.view.element);
	}
};

//--- /Fullscreen mode ---------------------------------------------------------------------------------------------------