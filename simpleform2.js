
(function($){
    
    var SF2 = window.SF2 = {
        shadeElement: $('<div class="sf2Shade"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></div>'),
    
        showLoading: function(_blockJQObj){
			$(':focus').blur();
			var self = this;
			var lid = 'sf2Shade_'+this.getRandomInt(1,99999);
			var _f;
			var shade;

			if(_blockJQObj && _blockJQObj.length){
				var ids = [];
				_blockJQObj.each(function(index){
					var tmp = self.shadeElement.clone().appendTo('body').click();
					tmp.attr('id',lid+'_'+index);
					tmp.addClass(lid);
					ids.push(lid+'_'+index);
				});
				shade = $('#'+ids.join(',#'));
				shade.css('position','absolute');
				_f = function(){
					_blockJQObj.each(function(index){
						var $this = $(this);
						var offset = $this.offset();
						$('#'+lid+'_'+index).css({
							left: offset.left,
							top: offset.top,
							width: $this.width(),
							height: $this.height()
						});
					});
				};
				_f();
				window[lid] = setInterval(_f,200);
			}
			else{
				shade = this.shadeElement.clone().appendTo('body').click();
				shade.attr('id',lid);
				shade.addClass(lid);
				shade.css({
					left: 0,
					top: 0,
					width: '100%',
					height: '100%',
					position: 'fixed'
				});
			}
			shade.stop().css('opacity',0).animate({
				opacity: 1,
			},200);
			return lid;
		},
		
		hideLoading: function(lid){
			var shade = $('.'+lid);
			shade.stop().css('opacity',1).animate({
				opacity: 0,
			},200,function(){
				if(window[lid]){
					clearInterval(window[lid]);
					delete window[lid];
				}
				shade.remove();
			});
		},
		
		showSuccess: function(msg){
			this.showPopupMessage(msg,'success');
		},
		
		showError: function(msg){
			this.showPopupMessage(msg,'error');
		},
        
        showPopupMessage: function(msg,type){
			$(':focus').blur();
			var html = '<div class="sf2Shade sf2Message"><div class="sf2Win  '+type+'">';
			html+= '<div class="sf2Win-body">'+msg+'</div>';
			html+= '<div class="sf2Win-close">+</div>';
			html+= '</div></div>';
			var win = $(html).appendTo('body');
			var modal = win.find('.sf2Win');
			win.on('sf2Close',function(){
				win.animate({
					opacity: 0	
				},200,'swing',function(){
					win.remove();
				});
				modal.animate({
					'margin-top': -100	
				},200,'swing');
			});
			win.on('click',function(e){
				var target = $(e.target);
				if(target.is('.sf2Shade, .sf2Win-close') || target.parent().is('.sf2Win-close')){
					win.trigger('sf2Close');
				}
			});
			win.css({
				opacity: 0	
			});
			modal.css({
				'margin-top': -100
			});
			win.animate({
				opacity: 1	
			},300,'swing');
			modal.animate({
				'margin-top': 0	
			},300,'swing');
		},
        
        closePopup: function(){
			$('.sf2Win').closest('.sf2Shade').trigger('sf2Close');
		},
        
        getRandomInt: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
        
        Config: function(id){
            var cfg = window.SF2Config || {};
            this.cfg = {};
            if(cfg[id]){
                this.cfg = cfg[id];
            }
            return this;
        },
        
        Text: function(key){
            return window.SF2Lang[key];
        }
    }
    
    SF2.Config.prototype = {
        get: function(paramName){
            if(this.cfg[paramName]){
                return this.cfg[paramName];
            }
            return null;
        },
    };
    
    var SF2Window = function(_container,_id,_isModal){
		var html,
			win,
			modal,
			body,
            sendBtn,
			closeBtn;
		var winExists = false;
		var self = this;
        var form = _container.find('form');
		if(!_id){
			_id = 'sf2Win_'+SF2.getRandomInt(9999,99999);
		}
		if($('#'+_id).length>0){
			winExists = true;
			win = this.win = $('#'+_id).closest('.sf2Shade');
		}
		else{
			html = '<div class="sf2Shade"><div class="sf2Win" id="'+_id+'">';
			html+= '<div class="sf2Win-body"></div>';
			html+= '<div class="sf2Win-footer">';
            if(form.find('input,select,textarea').length>0){
                html+= '<button type="button" class="sf2SendBtn">'+SF2.Text('send')+'</button>';
            }
            html+= '<button type="button" class="sf2CloseBtn">'+SF2.Text('close')+'</button>';
            html+= '</div>';
			html+= '</div></div>';
			win = this.win = $(html).appendTo('body').click();
		}
		modal = this.modal = win.find('.sf2Win');
		body = this.body = win.find('.sf2Win-body');
        sendBtn = this.sendBtn = win.find('.sf2SendBtn');
		closeBtn = this.closeBtn = win.find('.sf2CloseBtn');

        body.append(form);
        win.on('sf2Close',function(){
            self.onClose();
            win.animate({
                opacity: 0	
            },200,'swing',function(){
                _container.append(form);
                win.remove();
            });
            modal.animate({
                'margin-top': -100	
            },200,'swing');
        });
        win.on('click',function(e){
            var target = $(e.target);
            if(target.is('.sf2CloseBtn') || (!_isModal && target.is('.sf2Shade'))){
                win.trigger('sf2Close');
            }
            else if(target.is('.sf2SendBtn')){
                form.submit();
            }
        });
        win.css({
            opacity: 0	
        });
        modal.css({
            'margin-top': -100
        });
        win.animate({
            opacity: 1	
        },300,'swing');
        modal.animate({
            'margin-top': 0	
        },300,'swing');
	};
	
	SF2Window.prototype = {
		close: function(){
			this.win.trigger('sf2Close');
		},
		onClose: function(){},
		getWin: function(){
			return this.win;
		},
		getModal: function(){
			return this.modal;
		},
		setContent: function(_html){
			this.body.html(_html);
		},
		getContentBlock: function(){
			return this.body;
		},
	};
    
    $(document).ready(function(){
        $('.sf2-callBtn').on('click',function(){
            var callerButton = $(this);
            var form = $('#'+callerButton.attr('data-formid'));
            var win = new SF2Window(form.parent());
            return false;
        });
        
        $('form.simpleForm2').each(function(){
            var form = $(this);
            var cfg = new SF2.Config(form.attr('id'));
            form.on('submit',function(){
                if(!cfg.get('onBeforeSend').call(form)){
                    return false;
                }
                var isPopup = form.closest('.sf2Win').length;
                var lid = SF2.showLoading((isPopup?null:form));
                form.ajaxSubmit({
                    'url': cfg.get('ajaxURI'),
                    'form' : form,
                    'method': 'POST',
                    'resetForm': false,
                    'dataType': 'json',
                    'success': function(responce,textStatus,jqXHR,$form){
                        SF2.hideLoading(lid);
                        $form.find('.sf2Captcha').click();
                        if(responce==null){
                            SF2.showError('AJAX server error.');
                            return;
                        }
                        if(!cfg.get('onAfterReceive').call(form,responce)){
                            return;
                        }
                        
                        $form.find('.sf2-element-state-error').removeClass('sf2-element-state-error');

                        if(responce.status=='success'){
                            $form.html(responce.html);
                            if(isPopup){
                                $('.sf2Win .sf2SendBtn').remove();
                            }
                            else{
                                SF2.showSuccess(responce.message);
                            }
                        }
                        else if(responce.status=='error'){
                            SF2.showError(responce.message);
                            var k;
                            while(k in responce.elements){
                                form.find('#'+k).addClass('sf2-element-state-error');
                            }
                        }
                        else{
                            SF2.showError('AJAX server error.');
                        }
                    },
                    'error': function(jqXHR, textStatus, errorThrown){
                        SF2.hideLoading(lid);
                        SF2.showError(errorThrown);
                    }
                });
                return false;
            });
        });
    });
    
})(jQuery);
