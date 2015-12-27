
(function($) {
	
	// Браузеры
	var browserMozilla = $.browser.mozilla;
	var browserMsie = $.browser.msie;
	var browserOpera = $.browser.opera;
	var browserWebkit = $.browser.webkit;

  // XoopsCode only supports a small subset of HTML, so remove
  // any toolbar buttons that are not currently supported.
  $.rheditor.defaultOptions.controls =
    "bold italic underline strikethrough | font size color removeformat | bullets numbering | " +
    "undo redo | image link unlink | cut copy paste pastetext | source";

  // Save the previously assigned callback handlers
  var oldAreaCallback = $.rheditor.defaultOptions.updateTextArea;
  var oldFrameCallback = $.rheditor.defaultOptions.updateFrame;

  // Wireup the updateTextArea callback handler
  $.rheditor.defaultOptions.updateTextArea = function(html) {

    // Fire the previously assigned callback handler
    if (oldAreaCallback)
      html = oldAreaCallback(html);

    // Convert the HTML to XoopsCode
    return $.rheditor.convertHTMLtoXoopsCode(html);

  }

  // Wireup the updateFrame callback handler
  $.rheditor.defaultOptions.updateFrame = function(code) {

    // Fire the previously assigned callback handler
    if (oldFrameCallback)
      code = oldFrameCallback(code);

    // Convert the XoopsCode to HTML
    return $.rheditor.convertXoopsCodeToHTML(code);

  }

  // Expose the convertHTMLtoXoopsCode method
  $.rheditor.convertHTMLtoXoopsCode = function(html) {
	
	// Переводы строк
	html = html.replace( /[\r|\n]/g, "" );
	
	// Списки
	html = html.replace( /<ul>/gi, "[ul]" );
	html = html.replace( /<\/ul>/gi, "[/ul]" );
	html = html.replace( /<ol>/gi, "[ol]" );
	html = html.replace( /<\/ol>/gi, "[/ol]" );
	html = html.replace( /<li>/gi, "[li]" );
	html = html.replace( /<\/li>/gi, "[/li]" );
	
	// Картинка
	//  С шириной
	html = html.replace( /<img style=\"?width: ?([0-9]+px|auto);? ?height: ?([0-9]+px|auto);?\"? [^<>]*?src=\"([^<>\"]*?)\"(\s[^<>]*)?\/?>/gi, "[img width=$1]$3[/img]" );
	// <img src="http://localhost.radio-hobby.org/themes/rh/img/logo-ng2012.png" height="100" width="422"> Мазила
	// <img src="http://localhost.radio-hobby.org/themes/rh/img/logo-ng2012.png" width="373" height="100"> IE9
	// <IMG height=100 src="http://localhost.radio-hobby.org/themes/rh/img/logo-ng2012.png" width=397> IE6
	html = html.replace( /<img\s[^<>]*?src=\"([^<>\"]*?)\"[^<>]*?width=\"?([0-9]+)\"?[^<>]*?\/?>/gi, "[img width=$2]$1[/img]" ); // IE9 IE6 в первый раз так изменяет размеры
	//  Остальные картинки
	html = html.replace( /<img\s[^<>]*?src=\"([^<>\"]*?)\"(\s[^<>]*)?\/?>/gi, "[img]$1[/img]" );
	//   Очищаем ТЕГ [img]
	html = html.replace( /\[img width=([0-9]+)px\]/gi, "[img width=$1]" );
	html = html.replace( /\[img width=auto\]/gi, "[img]" );
	// Ссылки
	html = html.replace( /<a\s[^<>]*?href=\"([^<>\"]*?)\"(\s[^<>]*)?>([^<>]*?)<\/a>/gi, "[url=$1]$3[/url]" );
	// Цвет
	//html = html.replace( /<font\s[^<>]*?color=\"\#([0-9a-f]+)\"(\s[^<>]*)?>([^<>]*?)<\/font>/gi, "[color=$1]$3[/color]" );
	//
	html = html.replace( /<(u|ins)(\s[^<>]*)?>/gi, "[u]" );
	html = html.replace( /<\/(u|ins)>/gi, "[/u]" );
	html = html.replace( /<(strike|del)(\s[^<>]*)?>/gi, "[d]" );
	html = html.replace( /<\/(strike|del)>/gi, "[/d]" );
	html = html.replace( /<(strong|b)(\s[^<>]*)?>/gi, "[b]" );
	html = html.replace( /<\/(strong|b)>/gi, "[/b]" );
	html = html.replace( /<(em|i)(\s[^<>]*)?>/gi, "[i]" );
	html = html.replace( /<\/(em|i)>/gi, "[/i]" );
	
	// Переводы строк
	html = html.replace( /<br(\s[^<>]*)?>/gi, "\n" );
	html = html.replace( /<p(\s[^<>]*)?>/gi, "" );
	html = html.replace( /<\/p>/gi, "\n" );
	//  DIV заменяем на SPAN
	html = html.replace( /<div><br(\s[^<>]*)?>/gi, "<div>" ); //chrome-safari fix to prevent double linefeeds
	html = html.replace( /<\/div>\s*<div([^<>]*)>/gi, "</span>\n<span$1>" ); //chrome-safari fix to prevent double linefeeds
	html = html.replace( /<div([^<>]*)>/gi, "\n<span$1>" );
	html = html.replace( /<\/div>/gi, "</span>\n" );
	
	// HTML мнемоника
	html = html.replace( /&nbsp;/gi, " " );
	html = html.replace( /&quot;/gi, "\"" );
	html = html.replace( /&amp;/gi, "&" );
	
	var sc;
	// Цикл обработки SPAN
	do {
		sc = html;
		// Обработка тега FONT
		//  Цвет
		html = html.replace( /<font\s([^<>]*?)color=\"?\#([0-9a-f]+)\"?([^<]*?)<\/font>/gi, "[color=$2]<font $1$3</font>[/color]" );
		//  Шрифт
		html = html.replace( /<font\s([^<>]*?)face=\"'?([^<>\"]*?)'?\"([^<]*?)<\/font>/gi, "[font=$2]<font $1$3</font>[/font]" ); // Сафари и Хром в face добавляют одинарные ковычки
		//  Размер шрифта
		html = html.replace( /<font\s([^<>]*?)size=\"?([1-7]+)\"?([^<]*?)<\/font>/gi, "[size=$2]<font $1$3</font>[/size]" );
		// Удаляем пустой FONT
		html = html.replace( /<font\s*>([^<>]*?)<\/font>/gi, "$1" );
		// Удаляем неизвестный FONT
		if( sc == html ){
			html = html.replace( /<font[^<>]*>([^<>]*?)<\/font>/gi, "$1" );
		}
		
	//
	} while( sc != html );
	// Преобразуем HTML размеры шрифта в CSS
	html = html.replace( /\[size=1\]/gi, "[size=xx-small]" );
	html = html.replace( /\[size=2\]/gi, "[size=small]" );
	html = html.replace( /\[size=3\]/gi, "[size=medium]" );
	html = html.replace( /\[size=4\]/gi, "[size=large]" );
	html = html.replace( /\[size=5\]/gi, "[size=x-large]" );
	html = html.replace( /\[size=6\]/gi, "[size=xx-large]" );
	html = html.replace( /\[size=7\]/gi, "[size=xx-large]" );
	// ===================
	
	// Удаляем HTML теги
	html = html.replace( /<[^<>]*>/gi, "" );
	html = html.replace( /&lt;/gi, "<" );
	html = html.replace( /&gt;/gi, ">" );
	
	// Упорядочиваем BB теги
	// =====================
	
	// Удаляем пустые BB теги
	do {
		sc = html;
		html = html.replace( /\[b\]\n*\[\/b\]/gi, "" );
		html = html.replace( /\[i\]\n*\[\/i\]/gi, "" );
		html = html.replace( /\[u\]\n*\[\/u\]/gi, "" );
		html = html.replace( /\[quote[^\]]*\]\n*\[\/quote\]/gi, "" );
		html = html.replace( /\[code\]\n*\[\/code\]/gi, "" );
		html = html.replace( /\[url=([^\]]+)\]\n*\[\/url\]/gi, "" );
		html = html.replace( /\[img( align=(left|center|right))?( width=[0-9]+)?\]\n*\[\/img\]/gi, "" );
		html = html.replace( /\[color=\#?[0-9a-f]+\]\n*\[\/color\]/gi, "" );
		html = html.replace( /\[font=[^\]]*\]\n*\[\/font\]/gi, "" );
	//	
	}while( sc != html );

    return html;

  }

  // Expose the convertXoopsCodeToHTML method
  $.rheditor.convertXoopsCodeToHTML = function(code) {
	
	// Удаляем HTML теги
	code = code.replace( /\</gi, "&lt;" );
	code = code.replace( /\>/gi, "&gt;" );
	
	// Переводы строк
	code = code.replace( /\r/g, "" );
	code = code.replace( /\n/g, "<br />" );
	// Списки
	code = code.replace( /\[ul\]/gi, "<ul>" );
	code = code.replace( /\[\/ul\]/gi, "</ul>" );
	code = code.replace( /\[ol\]/gi, "<ol>" );
	code = code.replace( /\[\/ol\]/gi, "</ol>" );
	code = code.replace( /\[li\]/gi, "<li>" );
	code = code.replace( /\[\/li\]/gi, "</li>" );
	// Картинки
	code = code.replace( /\[img align=(left|center|right) width=([0-9]+)\]([^\"\(\)\?\&'<>]*?)\[\/img\]/gi, "<img style=\"width: $2px; height: auto;\" src=\"$3\">" );
	code = code.replace( /\[img align=(left|center|right)\]([^\"\(\)\?\&'<>]*?)\[\/img\]/gi, "<img style=\"width: auto; height: auto;\" src=\"$2\">" );
	code = code.replace( /\[img width=([0-9]+)\]([^\"\(\)\?\&'<>]*?)\[\/img\]/gi, "<img style=\"width: $1px; height: auto;\" src=\"$2\">" );
	code = code.replace( /\[img\]([^\"\(\)\?\&'<>]*?)\[\/img\]/gi, "<img style=\"width: auto; height: auto;\" src=\"$1\">" );
	// Ссылки
	code = code.replace( /\[url=([^'\"<>]*?)\](.*?)\[\/url\]/gi, "<a href=\"$1\">$2</a>" );
	// Цвета
	code = code.replace( /\[color=\#?([0-9a-f]+)\](.*?)\[\/color\]/gi, "<font color=\"#$1\">$2</font>" );
	// Шрифт
	code = code.replace( /\[font=([^;<>\*\(\)\"']*?)\](.*?)\[\/font\]/gi, "<font face=\"$1\">$2</font>" );
	// Размер шрифта
	//  Преобразуем CSS размер в HTML
	code = code.replace( /\[size=xx\-small\]/gi, "[size=1]" );
	code = code.replace( /\[size=small\]/gi, "[size=2]" );
	code = code.replace( /\[size=medium\]/gi, "[size=3]" );
	code = code.replace( /\[size=large\]/gi, "[size=4]" );
	code = code.replace( /\[size=x\-large\]/gi, "[size=5]" );
	code = code.replace( /\[size=xx\-large\]/gi, "[size=6]" );
	//  Переводим BB тег в HTML
	code = code.replace( /\[size=([1-7]+)\](.*?)\[\/size\]/gi, "<font size=\"$1\">$2</font>" );
	//
	code = code.replace( /\[u\]/gi, "<u>" );
	code = code.replace( /\[\/u\]/gi, "</u>" );
	code = code.replace( /\[(d|s)\]/gi, "<strike>" );
	code = code.replace( /\[\/(d|s)\]/gi, "</strike>" );
	// Опера и IE отличаются умом и производительностью...
	if( browserOpera || browserMsie ) {
		code = code.replace( /\[b\]/gi, "<strong>" );
		code = code.replace( /\[\/b\]/gi, "</strong>" );
		code = code.replace( /\[i\]/gi, "<em>" );
		code = code.replace( /\[\/i\]/gi, "</em>" );
	// Остальные браузеры
	} else {
		code = code.replace( /\[b\]/gi, "<b>" );
		code = code.replace( /\[\/b\]/gi, "</b>" );
		code = code.replace( /\[i\]/gi, "<i>" );
		code = code.replace( /\[\/i\]/gi, "</i>" );
	}
	
    return code;

  }

})(jQuery);