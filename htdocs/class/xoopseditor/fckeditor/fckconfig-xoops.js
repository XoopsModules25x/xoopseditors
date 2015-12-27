/*
 * XOOPS custom configuration for FCKeditor
 */
 
FCKConfig.StylesXmlPath    = FCKConfig.EditorPath + '../fckstyles-xoops.xml' ; // add by kris
FCKConfig.TemplatesXmlPath = FCKConfig.EditorPath + '../fcktemplates-xoops.xml' ; // add by kris

// Add for ImageManager plugin
FCKConfig.Plugins.Add('ImageManager');

FCKConfig.AutoDetectLanguage = false;
FCKConfig.ToolbarSets["Xoops"] = [
        ['Source','-','NewPage','Templates','-','Preview'],
        ['Cut','Copy','Paste','PasteText','PasteWord','-','SpellCheck'],
        ['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
        ['FitWindow','About'],
        '/',
        ['Bold','Italic','Underline','StrikeThrough','-','Subscript','Superscript'],
        ['OrderedList','UnorderedList','-','Outdent','Indent'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
        ['Link','Unlink','Anchor'],
        ['Image','ImageManager','Flash','Table','Rule','SpecialChar','EmbedMovies','YouTube','flvPlayer'], // modif by kris
        '/',
        ['Style','FontFormat','FontName','FontSize'],
        ['TextColor','BGColor']
];

FCKConfig.EMailProtection = 'encode' ; // none | encode | function
FCKConfig.SpellChecker = 'ieSpell' ; // 'ieSpell' | 'SpellerPages'

FCKConfig.ProtectedSource.Add( /<\?[\s\S]*?\?>/g ) // add by kris