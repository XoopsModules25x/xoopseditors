var oEditor			= window.parent.InnerDialogLoaded(); 
var FCK				  = oEditor.FCK; 
var FCKLang			= oEditor.FCKLang ;
var FCKConfig		= oEditor.FCKConfig ;

// <object><param><embed> alternative (not working properly for reasons only 
//                                     microsoft can know)
var embedInobject = false; 

// get the selected embedded movie and its container div (if available)
var oMovie = null;
var oContainerDiv = FCK.Selection.GetSelectedElement();
if (oContainerDiv)
{
	if(oContainerDiv.tagName == 'DIV' && 
		 oContainerDiv.childNodes.length > 0 &&
		 oContainerDiv.childNodes[0].tagName == (embedInobject ? 'object' : 'embed'))
	 oMovie = oContainerDiv.childNodes[0];
	else if (oContainerDiv.tagName == (embedInobject ? 'object' : 'embed') &&
	         oContainerDiv.parentNode.tagName == 'DIV')
	{
		oMovie = oContainerDiv;
		oContainerDiv  = oContainerDiv.parentNode;
	}
	else
		oContainerDiv = null;
}
 
function Getparam(e, pname, defvalue)
{
	if (!e) return defvalue;
	if (embedInobject)
	{
		for (var i = 0; i < e.childNodes.length; i++)
		{
			if (e.childNodes[i].tagName == 'param' && GetAttribute(e.childNodes[i], 'name') == pname)
			{
				var retval = GetAttribute(e.childNodes[i], 'value');
				if (retval == "false") return false;
				return retval;
			}
		}
		return defvalue;
	}
	else
	{
		var retval = GetAttribute(e, pname, defvalue);
		if (retval == "false") return false;
		return retval;
	}
}

window.onload = function ()	
{ 
	// First of all, translates the dialog box texts.
	oEditor.FCKLanguageManager.TranslatePage(document);
	
	// read settings from existing embedded movie or set to default		
	GetE('txtUrl').value = Getparam(oMovie, (embedInobject ? 'url' : 'src'), '');
	GetE('chkAutosize').checked      = Getparam(oMovie,  'autosize',     0 );
	GetE('txtWidth').value           = Getparam(oMovie,  'width',        250  );
	GetE('txtHeight').value          = Getparam(oMovie,  'height',       250  );
	GetE('chkAutostart').checked     = Getparam(oMovie, 'autostart',     1 );
	GetE('chkShowgotobar').checked   = Getparam(oMovie, 'showgotobar',   1 );
	GetE('chkShowstatusbar').checked = Getparam(oMovie, 'showstatusbar', 1 );
	GetE('chkShowcontrols').checked  = Getparam(oMovie, 'showcontrols',  1 );
	GetE('chkShowtracker').checked   = Getparam(oMovie, 'showtracker',   1 );
	GetE('chkShowaudiocontrols').checked    = Getparam(oMovie, 'showaudiocontrols',    1 );
	GetE('chkShowpositioncontrols').checked = Getparam(oMovie, 'showpositioncontrols', 1);

	// Show/Hide according to settings
	ShowE('divSize',  !GetE('chkAutosize').checked);
	ShowE('tdBrowse', FCKConfig.LinkBrowser);
	ShowE('divControlsettings', GetE('chkShowcontrols').checked)

	// Show Ok button
	window.parent.SetOkButton( true );
} 

function BrowseServer()
{
	var url;
	if (FCKConfig.MediaBrowserURL) 
		url = FCKConfig.MediaBrowserURL;
	else
		url = FCKConfig.ImageBrowserURL.replace(/(&|\?)Type=Image/i, "$1Type=Media");
	OpenFileBrowser(
		url,
		FCKConfig.ScreenWidth * 0.7 ,
		FCKConfig.ScreenHeight * 0.7);
}

function SetUrl( url )
{
	GetE('txtUrl').value = url;
}

function CreateembeddedMovie(e, url)
{
	var sType, pluginspace, codebase, classid;
	var sExt   = url.match(/\.(mpg|mpeg|avi|wmv|mov|asf)$/i);
	if (sExt.length && sExt.length > 0)
		sExt = sExt[0];
	else
		sExt = '';
	sType = (sExt=="mpg"||sExt=="mpeg")             ?"video/mpeg":
          (sExt=="avi"||sExt=="wmv"||sExt=="asf") ?"video/x-ms-asf-plugin":
				  (sExt=="mov") ?"video/quicktime" : "video/x-ms-asf-plugin";
	
	// window media player?
	var wmp = sExt != "mov";
	if (wmp)
	{
		pluginspace = "http://www.microsoft.com/Windows/MediaPlayer/";
		codebase    = "http://www.microsoft.com/netshow/download/en/nsasfinf.cab#Version=2,0,0,912";
		classid     = 'CLASSID="CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95"';
	}
	else
	{
		pluginspace = "http://www.apple.com/quicktime/download/";
		codebase    = "http://www.apple.com/qtactivex/qtplugin.cab";
		classid     = "";
	}


	var html;
	if (embedInobject)
	{
		html  = '<object '+ classid +'>';
		html += '<param name="ControlType" value="1">';
		html += '<param name="url" value="'+ url +'" />';
		html += '<param name="filename" value="'+ url +'" />';
		html += '<param name="autostart" value="'+ (GetE('chkAutostart').checked?"true":"false") +'" />';
		html += '<param name="showcontrols" value="'+ (GetE('chkShowcontrols').checked?"true":"false") +'" />';
		html += '<param name="showpositioncontrols" value="'+ (GetE('chkShowpositioncontrols').checked?"true":"false") +'" />';
		html += '<param name="showtracker" value="'+ (GetE('chkShowtracker').checked?"true":"false") +'" />';
		html += '<param name="showaudiocontrols" value="'+ (GetE('chkShowaudiocontrols').checked?"true":"false") +'" />';
		html += '<param name="showgotobar" value="'+ (GetE('chkShowgotobar').checked?"true":"false") +'" />';
		html += '<param name="showstatusbar" value="'+ (GetE('chkShowstatusbar').checked?"true":"false") +'" />';
		html += '<param name="standby" value="Loading Video..." />';
		html += '<param name="pluginspace" value="'+ pluginspace +'" />';
		html += '<param name="codebase" value="'+ codebase +'" />'; 
		html += '<embed type="'+ sType +'" pluginspace="'+ pluginspace +'" src="'+ url +'"></embed>';
		html += '<noembed>Download movie: <A HREF="'+ url +'">'+ url +'</A></noembed>';
		html += '</object>';
	}
	else
	{
		html = '<embed type="'+ sType +'" src="'+ url +'" controltype="1" '+
		       'autosize="'+ (GetE('chkAutosize').checked?"true":"false") +'" '+
		       'autostart="'+ (GetE('chkAutostart').checked?"true":"false") +'" '+
		       'showcontrols="'+ (GetE('chkShowcontrols').checked?"1":"0") +'" '+
		       'showpositioncontrols="'+ (GetE('chkShowpositioncontrols').checked?"1":"0") +'" '+
		       'showtracker="'+ (GetE('chkShowtracker').checked?"1":"0") +'" '+
		       'showaudiocontrols="'+ (GetE('chkShowaudiocontrols').checked?"1":"0") +'" '+
		       'showgotobar="'+ (GetE('chkShowgotobar').checked?"1":"0") +'" '+
		       'showstatusbar="'+ (GetE('chkShowstatusbar').checked?"1":"0") +'" '+
		       'pluginspace="'+ pluginspace +'" '+
		       'codebase="'+ codebase +'"';
		if (!GetE('chkAutosize').checked)	
			html += 'width="'+ GetE('txtWidth').value +'" height="'+ GetE('txtHeight').value +'"';
		html += '></embed>';
	}
			
	e.innerHTML = html;
}

function Ok() 
{
	if ( GetE('txtUrl').value.length == 0 )
	{
		window.parent.SetSelectedTab( 'Info' ) ;
		GetE('txtUrl').focus() ;

		alert( FCKLang.embedMoviesAlertUrl ) ;

		return false ;
	}

	if (!oContainerDiv)
		oContainerDiv = FCK.CreateElement('DIV');
	CreateembeddedMovie(oContainerDiv, GetE('txtUrl').value);
	
	oEditor.FCKUndo.SaveUndoStep();

	return true;
}
