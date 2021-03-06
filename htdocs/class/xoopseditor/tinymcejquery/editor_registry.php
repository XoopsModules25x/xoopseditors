<?php
/**
 *  TinyMCE jQuery adapter for XOOPS
 *
 * @copyright       The XOOPS Project http://sourceforge.net/projects/xoops/
 * @license         http://www.fsf.org/copyleft/gpl.html GNU public license
 * @package         class
 * @subpackage      editor
 * @since           2.3.0
 * @author          Taiwen Jiang <phppp@users.sourceforge.net>
 * @version         $Id: editor_registry.php 6514 2011-04-01 22:07:23Z kris_fr $
 */

return $config = array(
        "name"      =>  "tinymcejquery",
        "class"     =>  "XoopsFormTinymceJQ",
        "file"      =>  XOOPS_ROOT_PATH . "/class/xoopseditor/tinymcejquery/formtinymcejquery.php",
        "title"     =>  _XOOPS_EDITOR_TINYMCEJQ,
        "order"     =>  24,
        "nohtml"    =>  0
    );
?>
