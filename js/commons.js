$(function() {

	/* dropdown menu effects */

	$('.dropdown')
		.mouseover(function(e) {
			$(this).children('.sub-menu').css('display', 'block');
			return false;
		})
		.mouseout(function(e) {
			$(this).children('.sub-menu').css('display', 'none');
			return false;
		});

	$('.dropdown-inner').hover(
		function() {
			$(this).children('.sub-menu').css('display', 'block');
		},
		function() {
			$(this).children('.sub-menu').css('display', 'none');
		}
	);

	$('.menu-item').hover(
		function() {
			$(this).children('.sub-menu').css('display', 'block');
		},
		function() {
			$(this).children('.sub-menu').css('display', 'none');
		}
	);

	/* Inner pages accordion menu */

	if($('.inner-page-accordion ul .page_item').hasClass('page_item_has_children')) {
		$('.page_item_has_children>ul.children').before('<span class="fa fa-arrow-circle-o-down"></span>');
	}

	$(".inner-page-accordion ul .page_item_has_children > a ~ span").click(function(){
		if(false == $(this).next().is(':visible')) {
			$('.inner-page-accordion ul ul').slideUp(300);
		}
		$(this).next().slideToggle(300);
	});

})


/* Old code, needed to be reviewed */

$( document ).ready(function() {
	$(".menu-search i").on('click', function (e) {
		$(".menu-search").toggleClass('focus');
		$(".change-locale").toggleClass('disabled');
		$(".user-login").toggleClass('disabled');
	});
	/* навигация по меню */
	$('.drop-menu > span').on('click', function (e) {
		e.preventDefault();
		var parent = $(this).parent();
		if (!parent.hasClass('focus')) {
			parent.addClass('focus');
			parent.find('.sub-menu').show(0);
		} else {
			parent.removeClass('focus');
			parent.find('.sub-menu').hide(0);
		}
	});
	/* Скрытие навигация по меню */
	$(document).mouseup(function (e) {
		var subMenu = $('.sub-menu');
		if (subMenu.has(e.target).length === 0 && $('.drop-menu').has(e.target).length === 0 ) {
			$('.drop-menu').removeClass('focus');
			subMenu.fadeOut(200);
		}
		/* Скрытие поиска */
		var search = $(".menu-search i");
		if (search.has(e.target).length === 0 && $('.menu-search').has(e.target).length === 0 ) {
			$('.menu-search').removeClass('focus');
			$(".change-locale").removeClass('disabled');
			$(".user-login").removeClass('disabled');
		}
	});
	$(".sidebar-menue-toggle").click(function(){
		$(this).toggleClass('active');
		$(".menu-main_menu-container").toggleClass('active');
	});
});

/*Mobile menu && swipe effect */

jQuery(document).ready(function($) {	

	$.fn.responsiveMenu = function( options ) {

		//vars (=
		var useMobileMenue = false;
		var menu_content = $('.menu-content');
		var menu_element = $('.mob-menu li');
		var submenu_element = $('.menu__sub-menu');
		var body = $('body');
		var menuWrapper = $('.mobile-menu-wrap');
		var menuChildtoggler = $('.mob-menu .menu__item .menu__link');
		var hamburger = $('#nav-icon');
        // Default options
        var settings = $.extend({
			breakpoint: 300
        }, options );
					
		$.each($('.mob-menu li'), function (index, value) {
			if ($(this).children('ul').length > 0 || $(this).children('div').length > 0) {
				$(this).children('a').append($('<span class="arrow"></span>'));
			}
		});
		
		// add to-left class tu parent ul
		if( $('.mob-menu li').hasClass('to-left') ){ $('.mob-menu li.to-left').parent('ul').addClass("to-left-ul"); }
		  		
		  		
		// hamburger btn
		hamburger.on('click', function(e) {
		    e.preventDefault();
		    e.stopPropagation();

		    menuChildtoggler.removeClass('active-parent');
		    hamburger.toggleClass('is-active');
			menu_content.toggleClass('open');
			body.toggleClass('menu_open');
			menuWrapper.toggleClass('menu_open');
		    submenu_element.hide().removeClass('open');
		    $('.menu__item span.arrow').removeClass('open');
		});

		//wrapper close menu
		menuWrapper.on('click', function(e) {
		    e.preventDefault();
		    e.stopPropagation();

		    menuChildtoggler.removeClass('active-parent');
		    menu_content.removeClass('open');		    
		    hamburger.removeClass('is-active');
		    body.removeClass('menu_open');
		    menuWrapper.removeClass('menu_open');
		    submenu_element.hide().removeClass('open');
		    $('.menu__item span.arrow').removeClass('open');
		});

		// init responsive
		menuStuff();

		$(window).resize(function () {
			menuStuff();
		});

		function menuStuff() {
		
			var $browserWidth = window.innerWidth || document.documentElement.clientWidth;
	
			// desktop size 
			if ( $browserWidth > settings.breakpoint ) {

				useMobileMenue = false;
				hideMobileMenuStuff();
	
			// mobile size
			} else {

				useMobileMenue = true;

					document.addEventListener('touchstart', handleTouchStart, false);
					document.addEventListener('touchmove', handleTouchMove, false);

					var xDown = null;
					var yDown = null;

					function handleTouchStart(evt) {
							xDown = evt.touches[0].clientX;
							yDown = evt.touches[0].clientY;
					};

					function handleTouchMove(evt) {
							if ( ! xDown || ! yDown ) {
									return;
							}

						 var xUp = evt.touches[0].clientX;
						 var yUp = evt.touches[0].clientY;

							var xDiff = xDown - xUp;
							var yDiff = yDown - yUp;

							if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
									if ( xDiff > 5 ) {
										hideMobileMenuStuff();
									}
							}
							xDown = null;
							yDown = null;
					};
			}			
		}

		function hideMobileMenuStuff() {
			menuChildtoggler.removeClass('active-parent');				
			menu_content.removeClass('open').removeClass('close');
			$('.menu__item span.arrow').removeClass('open');
			hamburger.removeClass('is-active');
			body.removeClass('menu_open');
			menuWrapper .removeClass('menu_open');				
			submenu_element.hide().removeClass('open');
		}

		menuChildtoggler.bind('click',function (e) {

			if (useMobileMenue === true) {	

				submenu_element.slideUp(250).removeClass('open');
				$('.menu__item span.arrow').removeClass('open');				
				$(this).toggleClass('active-parent');

				if ($(this).hasClass('active-parent')) {
					$(this).closest('li').children('.menu__sub-menu').slideDown(250).addClass("open");
					$(this).children('.menu__item span.arrow').addClass('open');
				}
			}

		});   
	}	

	// init menu
	 $('.mob-menu').responsiveMenu({
      breakpoint: '992'
    });
});

/* Password strength ckech in the account form */

function passwordStrength(password) {
	var desc = ["Пароль не введено", "Дуже слабкий", "Слабкий", "Краще", "Середній", "Надійний", "Сильний"];
	var score   = 0;
	if (password.length > 6) {
		score++;
	};
	if ( ( password.match(/[a-z]/) ) ) {
		score++;
	};
	if ( ( password.match(/[A-Z]/) ) ) {
		score++;
	}
	if (password.match(/\d+/)) {
		score++;
	};
	if ( password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/) ) {
		score++;
	};
	if (password.length >= 2) {
		score++;
	};
	document.getElementById("passwordDescription").innerHTML = desc[score];
	document.getElementById("passwordStrength").className = "strength" + score;
}

$(window).load(function(){
	$('.form-toggle').on('click', function() {
		var target = $(this).attr('rel');
		$("#"+target).show().siblings(".form-block").hide();
	});
})

$('#individual').change(function(e) {
	e.preventDefault();
	if($(this).is(":checked")) {
		$(this).parent().css('background-position', '15px -19px');
	} else {
		$(this).parent().css('background-position', '15px 0px');
	}
});

$('.contact .checkbox label input[type="checkbox"]').change(function(e) {
	e.preventDefault();
	if($(this).is(":checked")) {
		$(this).parent().css('background-position', '15px -19px');
	} else {
		$(this).parent().css('background-position', '15px 0px');
	}
});


function showall() {
	if($('.tabs_class').css('display') == 'none') {
		$('.tabs_class').show(1000);
	} else {
		$('.tabs_class').hide(100);
	}
}

function openTab(e, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	e.currentTarget.className += " active";
}

/* Scroll top functions */

$(window).scroll(function(){
	scrollFunction();
});

function scrollFunction() {
	var gap = $(window).outerHeight();
	if ($(window).scrollTop() > gap) {
		$('#scrollTopBtn').fadeIn(200);
	}	else {
		$('#scrollTopBtn').fadeOut(200);
	}
}

$('#scrollTopBtn').click(function() {
	$('html, body').animate(
		{scrollTop: 0},
		'slow'
	);
});