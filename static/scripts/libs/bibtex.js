function BibtexParser(g){function r(g){t.push(g)}if("string"==typeof g){var e={},t=[],c=BibtexParser.call(e,r);return c.parse(g),{entries:t,errors:c.getErrors()}}if("function"!=typeof g)throw"Invalid parser construction.";return this.STATES_={ENTRY_OR_JUNK:0,OBJECT_TYPE:1,ENTRY_KEY:2,KV_KEY:3,EQUALS:4,KV_VALUE:5},this.DATA_={},this.CALLBACK_=g,this.CHAR_=0,this.LINE_=1,this.CHAR_IN_LINE_=0,this.SKIPWS_=!0,this.SKIPCOMMENT_=!0,this.PARSETMP_={},this.SKIPTILLEOL_=!1,this.VALBRACES_=null,this.BRACETYPE_=null,this.BRACECOUNT_=0,this.STATE_=this.STATES_.ENTRY_OR_JUNK,this.ERRORS_=[],this.ENTRY_TYPES_={inproceedings:1,proceedings:2,article:3,techreport:4,misc:5,mastersthesis:6,book:7,phdthesis:8,incollection:9,unpublished:10,inbook:11,manual:12,periodical:13,booklet:14,masterthesis:15,conference:16,online:998,data:999},this.MACROS_={jan:"January",feb:"February",mar:"March",apr:"April",may:"May",jun:"June",jul:"July",aug:"August",sep:"September",oct:"October",nov:"November",dec:"December",Jan:"January",Feb:"February",Mar:"March",Apr:"April",May:"May",Jun:"June",Jul:"July",Aug:"August",Sep:"September",Oct:"October",Nov:"November",Dec:"December"},this.getErrors=function(){return this.ERRORS_},this.parse=function(g){for(var r=0;r<g.length;r++)this.processCharacter_(g[r])},this.error_=function(g){this.ERRORS_.push([this.LINE_,this.CHAR_IN_LINE_,this.CHAR_,g])},this.processEntry_=function(){var g=this.DATA_;if(g.Fields)for(var r in g.Fields){for(var e=g.Fields[r],t=0;t<this.CHARCONV_.length;t++){var c=this.CHARCONV_[t][0],i=this.CHARCONV_[t][1];e=e.replace(c,i)}e=e.replace(/[\n\r\t]/g," ").replace(/\s\s+/g," ").replace(/^\s+|\s+$/g,"");for(var a=e.length,h="",t=0;t<a;t++){var s=e[t],n=!1;"\\"==s&&t<a-1?s=e[++t]:"{"!=s&&"}"!=s||(n=!0),n||(h+=s)}g.Fields[r]=h}if("string"==g.ObjectType)for(var r in g.Fields)this.MACROS_[r]=g.Fields[r];else this.CALLBACK_(g)},this.processCharacter_=function(g){if(this.CHAR_++,this.CHAR_IN_LINE_++,"\n"==g&&(this.LINE_++,this.CHAR_IN_LINE_=1),this.SKIPTILLEOL_)return void("\n"==g&&(this.SKIPTILLEOL_=!1));if(this.SKIPCOMMENT_&&"%"==g)return void(this.SKIPTILLEOL_=!0);if(!this.SKIPWS_||!/\s/.test(g)){this.SKIPWS_=!1,this.SKIPCOMMENT_=!1,this.SKIPTILLEOL_=!1;for(var r=!0;r;)switch(r=!1,this.STATE_){case this.STATES_.ENTRY_OR_JUNK:"@"==g&&(this.STATE_=this.STATES_.OBJECT_TYPE,this.DATA_={ObjectType:""}),this.BRACETYPE_=null,this.SKIPWS_=!0,this.SKIPCOMMENT_=!0;break;case this.STATES_.OBJECT_TYPE:if(/[A-Za-z]/.test(g))this.DATA_.ObjectType+=g.toLowerCase(),this.SKIPWS_=!0,this.SKIPCOMMENT_=!0;else{var e=this.DATA_.ObjectType;"comment"==e?this.STATE_=this.STATES_.ENTRY_OR_JUNK:"string"==e?(this.DATA_.ObjectType=e,this.DATA_.Fields={},this.BRACETYPE_=g,this.BRACECOUNT_=1,this.STATE_=this.STATES_.KV_KEY,this.SKIPWS_=!0,this.SKIPCOMMENT_=!0,this.PARSETMP_={Key:""}):"preamble"==e?this.STATE_=this.STATES_.ENTRY_OR_JUNK:e in this.ENTRY_TYPES_?(this.DATA_.ObjectType="entry",this.DATA_.EntryType=e,this.DATA_.EntryKey="",this.STATE_=this.STATES_.ENTRY_KEY,r=!0):(this.error_('Unrecognized object type: "'+this.DATA_.ObjectType+'"'),this.STATE_=this.STATES_.ENTRY_OR_JUNK)}break;case this.STATES_.ENTRY_KEY:if(("{"===g||"("===g)&&null==this.BRACETYPE_){this.BRACETYPE_=g,this.BRACECOUNT_=1,this.SKIPWS_=!0,this.SKIPCOMMENT_=!0;break}/[,%\s]/.test(g)?this.DATA_.EntryKey.length<1?(this.SKIPWS_=!0,this.SKIPCOMMENT_=!0):null==this.BRACETYPE_?(this.error_("No opening brace for object."),this.STATE_=this.STATES_.ENTRY_OR_JUNK):(this.SKIPWS_=!0,this.SKIPCOMMENT_=!0,r=!0,this.STATE_=this.STATES_.KV_KEY,this.PARSETMP_.Key="",this.DATA_.Fields={}):(this.DATA_.EntryKey+=g,this.SKIPWS_=!1,this.SKIPCOMMENT_=!1);break;case this.STATES_.KV_KEY:if("}"==g&&"{"==this.BRACETYPE_||")"==g&&"("==this.BRACETYPE_){this.processEntry_(),this.SKIPWS_=!0,this.SKIPCOMMENT_=!0,this.STATE_=this.STATES_.ENTRY_OR_JUNK;break}/[\-A-Za-z:]/.test(g)?(this.PARSETMP_.Key+=g,this.SKIPWS_=!1,this.SKIPCOMMENT_=!1):this.PARSETMP_.Key.length<1?(this.SKIPWS_=!0,this.SKIPCOMMENT_=!0):(this.SKIPWS_=!0,this.SKIPCOMMENT_=!0,this.STATE_=this.STATES_.EQUALS,r=!0);break;case this.STATES_.EQUALS:if("}"==g&&"{"==this.BRACETYPE_||")"==g&&"("==this.BRACETYPE_){this.error_('Key-value pair has key "'+this.PARSETMP_.Key+'", but no value.'),this.processEntry_(),this.SKIPWS_=!0,this.SKIPCOMMENT_=!0,this.STATE_=this.STATES_.ENTRY_OR_JUNK;break}"="==g&&(this.SKIPWS_=!0,this.SKIPCOMMENT_=!0,this.STATE_=this.STATES_.KV_VALUE,this.PARSETMP_.Value="",this.VALBRACES_={'"':[],"{":[]});break;case this.STATES_.KV_VALUE:var t=this.VALBRACES_,c=this.PARSETMP_.Value,i=!1;if('"'==g||"{"==g||"}"==g||","==g){if(","==g&&0===t['"'].length+t["{"].length){var a=this.PARSETMP_.Value.trim();a in this.MACROS_?this.PARSETMP_.Value=this.MACROS_[a]:this.error_("Reference to an undefined macro: "+a),i=!0}if('"'==g){if(0===t['"'].length+t["{"].length){t['"'].push(this.CHAR_),this.SKIPWS_=!1,this.SKIPCOMMENT_=!1;break}1!=t['"'].length||0!=t["{"].length||0!=c.length&&"\\"==c[c.length-1]||(i=!0)}if("{"==g&&(0!=c.length&&"\\"==c[c.length-1]||(t["{"].push(this.CHAR_),this.SKIPWS_=!1,this.SKIPCOMMENT_=!1)),"}"==g)if(0===t['"'].length+t["{"].length){var a=this.PARSETMP_.Value.trim();a in this.MACROS_?this.PARSETMP_.Value=this.MACROS_[a]:this.error_("Reference to an undefined macro: "+a),r=!0,i=!0}else 0!=c.length&&"\\"==c[c.length-1]||t["{"].length>0&&(t["{"].splice(t["{"].length-1,1),0==t["{"].length+t['"'].length&&(i=!0))}i?(this.SKIPWS_=!0,this.SKIPCOMMENT_=!0,this.STATE_=this.STATES_.KV_KEY,this.DATA_.Fields[this.PARSETMP_.Key]=this.PARSETMP_.Value,this.PARSETMP_={Key:""},this.VALBRACES_=null):this.PARSETMP_.Value+=g}}},
this.CHARCONV_=[[/\\space /g," "],[/\\textdollar /g,"$"],[/\\textquotesingle /g,"'"],[/\\ast /g,"*"],[/\\textbackslash /g,"\\"],[/\\\^\{\}/g,"^"],[/\\textasciigrave /g,"`"],[/\\lbrace /g,"{"],[/\\vert /g,"|"],[/\\rbrace /g,"}"],[/\\textasciitilde /g,"~"],[/\\textexclamdown /g,"¡"],[/\\textcent /g,"¢"],[/\\textsterling /g,"£"],[/\\textcurrency /g,"¤"],[/\\textyen /g,"¥"],[/\\textbrokenbar /g,"¦"],[/\\textsection /g,"§"],[/\\textasciidieresis /g,"¨"],[/\\textcopyright /g,"©"],[/\\textordfeminine /g,"ª"],[/\\guillemotleft /g,"«"],[/\\lnot /g,"¬"],[/\\textregistered /g,"®"],[/\\textasciimacron /g,"¯"],[/\\textdegree /g,"°"],[/\\pm /g,"±"],[/\\textasciiacute /g,"´"],[/\\mathrm\{\\mu\}/g,"µ"],[/\\textparagraph /g,"¶"],[/\\cdot /g,"·"],[/\\c\{\}/g,"¸"],[/\\textordmasculine /g,"º"],[/\\guillemotright /g,"»"],[/\\textonequarter /g,"¼"],[/\\textonehalf /g,"½"],[/\\textthreequarters /g,"¾"],[/\\textquestiondown /g,"¿"],[/\\`\{A\}/g,"À"],[/\\'\{A\}/g,"Á"],[/\\\^\{A\}/g,"Â"],[/\\~\{A\}/g,"Ã"],[/\\"\{A\}/g,"Ä"],[/\\AA /g,"Å"],[/\\AE /g,"Æ"],[/\\c\{C\}/g,"Ç"],[/\\`\{E\}/g,"È"],[/\\'\{E\}/g,"É"],[/\\\^\{E\}/g,"Ê"],[/\\"\{E\}/g,"Ë"],[/\\`\{I\}/g,"Ì"],[/\\'\{I\}/g,"Í"],[/\\\^\{I\}/g,"Î"],[/\\"\{I\}/g,"Ï"],[/\\DH /g,"Ð"],[/\\~\{N\}/g,"Ñ"],[/\\`\{O\}/g,"Ò"],[/\\'\{O\}/g,"Ó"],[/\\\^\{O\}/g,"Ô"],[/\\~\{O\}/g,"Õ"],[/\\"\{O\}/g,"Ö"],[/\\texttimes /g,"×"],[/\\O /g,"Ø"],[/\\`\{U\}/g,"Ù"],[/\\'\{U\}/g,"Ú"],[/\\\^\{U\}/g,"Û"],[/\\"\{U\}/g,"Ü"],[/\\'\{Y\}/g,"Ý"],[/\\TH /g,"Þ"],[/\\ss /g,"ß"],[/\\`\{a\}/g,"à"],[/\\'\{a\}/g,"á"],[/\\\^\{a\}/g,"â"],[/\\~\{a\}/g,"ã"],[/\\"\{a\}/g,"ä"],[/\\aa /g,"å"],[/\\ae /g,"æ"],[/\\c\{c\}/g,"ç"],[/\\`\{e\}/g,"è"],[/\\'\{e\}/g,"é"],[/\\\^\{e\}/g,"ê"],[/\\"\{e\}/g,"ë"],[/\\`\{\\i\}/g,"ì"],[/\\'\{\\i\}/g,"í"],[/\\\^\{\\i\}/g,"î"],[/\\"\{\\i\}/g,"ï"],[/\\dh /g,"ð"],[/\\~\{n\}/g,"ñ"],[/\\`\{o\}/g,"ò"],[/\\'\{o\}/g,"ó"],[/\\\^\{o\}/g,"ô"],[/\\~\{o\}/g,"õ"],[/\\"\{o\}/g,"ö"],[/\\div /g,"÷"],[/\\o /g,"ø"],[/\\`\{u\}/g,"ù"],[/\\'\{u\}/g,"ú"],[/\\\^\{u\}/g,"û"],[/\\"\{u\}/g,"ü"],[/\\'\{y\}/g,"ý"],[/\\th /g,"þ"],[/\\"\{y\}/g,"ÿ"],[/\\=\{A\}/g,"Ā"],[/\\=\{a\}/g,"ā"],[/\\u\{A\}/g,"Ă"],[/\\u\{a\}/g,"ă"],[/\\k\{A\}/g,"Ą"],[/\\k\{a\}/g,"ą"],[/\\'\{C\}/g,"Ć"],[/\\'\{c\}/g,"ć"],[/\\\^\{C\}/g,"Ĉ"],[/\\\^\{c\}/g,"ĉ"],[/\\.\{C\}/g,"Ċ"],[/\\.\{c\}/g,"ċ"],[/\\v\{C\}/g,"Č"],[/\\v\{c\}/g,"č"],[/\\v\{D\}/g,"Ď"],[/\\v\{d\}/g,"ď"],[/\\DJ /g,"Đ"],[/\\dj /g,"đ"],[/\\=\{E\}/g,"Ē"],[/\\=\{e\}/g,"ē"],[/\\u\{E\}/g,"Ĕ"],[/\\u\{e\}/g,"ĕ"],[/\\.\{E\}/g,"Ė"],[/\\.\{e\}/g,"ė"],[/\\k\{E\}/g,"Ę"],[/\\k\{e\}/g,"ę"],[/\\v\{E\}/g,"Ě"],[/\\v\{e\}/g,"ě"],[/\\\^\{G\}/g,"Ĝ"],[/\\\^\{g\}/g,"ĝ"],[/\\u\{G\}/g,"Ğ"],[/\\u\{g\}/g,"ğ"],[/\\.\{G\}/g,"Ġ"],[/\\.\{g\}/g,"ġ"],[/\\c\{G\}/g,"Ģ"],[/\\c\{g\}/g,"ģ"],[/\\\^\{H\}/g,"Ĥ"],[/\\\^\{h\}/g,"ĥ"],[/\\Elzxh /g,"ħ"],[/\\~\{I\}/g,"Ĩ"],[/\\~\{\\i\}/g,"ĩ"],[/\\=\{I\}/g,"Ī"],[/\\=\{\\i\}/g,"ī"],[/\\u\{I\}/g,"Ĭ"],[/\\u\{\\i\}/g,"ĭ"],[/\\k\{I\}/g,"Į"],[/\\k\{i\}/g,"į"],[/\\.\{I\}/g,"İ"],[/\\i /g,"ı"],[/\\\^\{J\}/g,"Ĵ"],[/\\\^\{\\j\}/g,"ĵ"],[/\\c\{K\}/g,"Ķ"],[/\\c\{k\}/g,"ķ"],[/\\'\{L\}/g,"Ĺ"],[/\\'\{l\}/g,"ĺ"],[/\\c\{L\}/g,"Ļ"],[/\\c\{l\}/g,"ļ"],[/\\v\{L\}/g,"Ľ"],[/\\v\{l\}/g,"ľ"],[/\\L /g,"Ł"],[/\\l /g,"ł"],[/\\'\{N\}/g,"Ń"],[/\\'\{n\}/g,"ń"],[/\\c\{N\}/g,"Ņ"],[/\\c\{n\}/g,"ņ"],[/\\v\{N\}/g,"Ň"],[/\\v\{n\}/g,"ň"],[/\\NG /g,"Ŋ"],[/\\ng /g,"ŋ"],[/\\=\{O\}/g,"Ō"],[/\\=\{o\}/g,"ō"],[/\\u\{O\}/g,"Ŏ"],[/\\u\{o\}/g,"ŏ"],[/\\H\{O\}/g,"Ő"],[/\\H\{o\}/g,"ő"],[/\\OE /g,"Œ"],[/\\oe /g,"œ"],[/\\'\{R\}/g,"Ŕ"],[/\\'\{r\}/g,"ŕ"],[/\\c\{R\}/g,"Ŗ"],[/\\c\{r\}/g,"ŗ"],[/\\v\{R\}/g,"Ř"],[/\\v\{r\}/g,"ř"],[/\\'\{S\}/g,"Ś"],[/\\'\{s\}/g,"ś"],[/\\\^\{S\}/g,"Ŝ"],[/\\\^\{s\}/g,"ŝ"],[/\\c\{S\}/g,"Ş"],[/\\c\{s\}/g,"ş"],[/\\v\{S\}/g,"Š"],[/\\v\{s\}/g,"š"],[/\\c\{T\}/g,"Ţ"],[/\\c\{t\}/g,"ţ"],[/\\v\{T\}/g,"Ť"],[/\\v\{t\}/g,"ť"],[/\\~\{U\}/g,"Ũ"],[/\\~\{u\}/g,"ũ"],[/\\=\{U\}/g,"Ū"],[/\\=\{u\}/g,"ū"],[/\\u\{U\}/g,"Ŭ"],[/\\u\{u\}/g,"ŭ"],[/\\r\{U\}/g,"Ů"],[/\\r\{u\}/g,"ů"],[/\\H\{U\}/g,"Ű"],[/\\H\{u\}/g,"ű"],[/\\k\{U\}/g,"Ų"],[/\\k\{u\}/g,"ų"],[/\\\^\{W\}/g,"Ŵ"],[/\\\^\{w\}/g,"ŵ"],[/\\\^\{Y\}/g,"Ŷ"],[/\\\^\{y\}/g,"ŷ"],[/\\"\{Y\}/g,"Ÿ"],[/\\'\{Z\}/g,"Ź"],[/\\'\{z\}/g,"ź"],[/\\.\{Z\}/g,"Ż"],[/\\.\{z\}/g,"ż"],[/\\v\{Z\}/g,"Ž"],[/\\v\{z\}/g,"ž"],[/\\texthvlig /g,"ƕ"],[/\\textnrleg /g,"ƞ"],[/\\eth /g,"ƪ"],[/\\textdoublepipe /g,"ǂ"],[/\\'\{g\}/g,"ǵ"],[/\\Elztrna /g,"ɐ"],[/\\Elztrnsa /g,"ɒ"],[/\\Elzopeno /g,"ɔ"],[/\\Elzrtld /g,"ɖ"],[/\\Elzschwa /g,"ə"],[/\\varepsilon /g,"ɛ"],[/\\Elzpgamma /g,"ɣ"],[/\\Elzpbgam /g,"ɤ"],[/\\Elztrnh /g,"ɥ"],[/\\Elzbtdl /g,"ɬ"],[/\\Elzrtll /g,"ɭ"],[/\\Elztrnm /g,"ɯ"],[/\\Elztrnmlr /g,"ɰ"],[/\\Elzltlmr /g,"ɱ"],[/\\Elzltln /g,"ɲ"],[/\\Elzrtln /g,"ɳ"],[/\\Elzclomeg /g,"ɷ"],[/\\textphi /g,"ɸ"],[/\\Elztrnr /g,"ɹ"],[/\\Elztrnrl /g,"ɺ"],[/\\Elzrttrnr /g,"ɻ"],[/\\Elzrl /g,"ɼ"],[/\\Elzrtlr /g,"ɽ"],[/\\Elzfhr /g,"ɾ"],[/\\Elzrtls /g,"ʂ"],[/\\Elzesh /g,"ʃ"],[/\\Elztrnt /g,"ʇ"],[/\\Elzrtlt /g,"ʈ"],[/\\Elzpupsil /g,"ʊ"],[/\\Elzpscrv /g,"ʋ"],[/\\Elzinvv /g,"ʌ"],[/\\Elzinvw /g,"ʍ"],[/\\Elztrny /g,"ʎ"],[/\\Elzrtlz /g,"ʐ"],[/\\Elzyogh /g,"ʒ"],[/\\Elzglst /g,"ʔ"],[/\\Elzreglst /g,"ʕ"],[/\\Elzinglst /g,"ʖ"],[/\\textturnk /g,"ʞ"],[/\\Elzdyogh /g,"ʤ"],[/\\Elztesh /g,"ʧ"],[/\\textasciicaron /g,"ˇ"],[/\\Elzverts /g,"ˈ"],[/\\Elzverti /g,"ˌ"],[/\\Elzlmrk /g,"ː"],[/\\Elzhlmrk /g,"ˑ"],[/\\Elzsbrhr /g,"˒"],[/\\Elzsblhr /g,"˓"],[/\\Elzrais /g,"˔"],[/\\Elzlow /g,"˕"],[/\\textasciibreve /g,"˘"],[/\\textperiodcentered /g,"˙"],[/\\r\{\}/g,"˚"],[/\\k\{\}/g,"˛"],[/\\texttildelow /g,"˜"],[/\\H\{\}/g,"˝"],[/\\tone\{55\}/g,"˥"],[/\\tone\{44\}/g,"˦"],[/\\tone\{33\}/g,"˧"],[/\\tone\{22\}/g,"˨"],[/\\tone\{11\}/g,"˩"],[/\\cyrchar\\C/g,"̏"],[/\\Elzpalh /g,"̡"],[/\\Elzrh /g,"̢"],[/\\Elzsbbrg /g,"̪"],[/\\Elzxl /g,"̵"],[/\\Elzbar /g,"̶"],[/\\'\{A\}/g,"Ά"],[/\\'\{E\}/g,"Έ"],[/\\'\{H\}/g,"Ή"],[/\\'\{\}\{I\}/g,"Ί"],[/\\'\{\}O/g,"Ό"],[/\\mathrm\{'Y\}/g,"Ύ"],[/\\mathrm\{'\\Omega\}/g,"Ώ"],[/\\acute\{\\ddot\{\\iota\}\}/g,"ΐ"],[/\\Alpha /g,"Α"],[/\\Beta /g,"Β"],[/\\Gamma /g,"Γ"],[/\\Delta /g,"Δ"],[/\\Epsilon /g,"Ε"],[/\\Zeta /g,"Ζ"],[/\\Eta /g,"Η"],[/\\Theta /g,"Θ"],[/\\Iota /g,"Ι"],[/\\Kappa /g,"Κ"],[/\\Lambda /g,"Λ"],[/\\Xi /g,"Ξ"],[/\\Pi /g,"Π"],[/\\Rho /g,"Ρ"],[/\\Sigma /g,"Σ"],[/\\Tau /g,"Τ"],[/\\Upsilon /g,"Υ"],[/\\Phi /g,"Φ"],[/\\Chi /g,"Χ"],[/\\Psi /g,"Ψ"],[/\\Omega /g,"Ω"],[/\\mathrm\{\\ddot\{I\}\}/g,"Ϊ"],[/\\mathrm\{\\ddot\{Y\}\}/g,"Ϋ"],[/\\'\{\$\\alpha\$\}/g,"ά"],[/\\acute\{\\epsilon\}/g,"έ"],[/\\acute\{\\eta\}/g,"ή"],[/\\acute\{\\iota\}/g,"ί"],[/\\acute\{\\ddot\{\\upsilon\}\}/g,"ΰ"],[/\\alpha /g,"α"],[/\\beta /g,"β"],[/\\gamma /g,"γ"],[/\\delta /g,"δ"],[/\\epsilon /g,"ε"],[/\\zeta /g,"ζ"],[/\\eta /g,"η"],[/\\texttheta /g,"θ"],[/\\iota /g,"ι"],[/\\kappa /g,"κ"],[/\\lambda /g,"λ"],[/\\mu /g,"μ"],[/\\nu /g,"ν"],[/\\xi /g,"ξ"],[/\\pi /g,"π"],[/\\rho /g,"ρ"],[/\\varsigma /g,"ς"],[/\\sigma /g,"σ"],[/\\tau /g,"τ"],[/\\upsilon /g,"υ"],[/\\varphi /g,"φ"],[/\\chi /g,"χ"],[/\\psi /g,"ψ"],[/\\omega /g,"ω"],[/\\ddot\{\\iota\}/g,"ϊ"],[/\\ddot\{\\upsilon\}/g,"ϋ"],[/\\'\{o\}/g,"ό"],[/\\acute\{\\upsilon\}/g,"ύ"],[/\\acute\{\\omega\}/g,"ώ"],[/\\Pisymbol\{ppi022\}\{87\}/g,"ϐ"],[/\\textvartheta /g,"ϑ"],[/\\Upsilon /g,"ϒ"],[/\\phi /g,"ϕ"],[/\\varpi /g,"ϖ"],[/\\Stigma /g,"Ϛ"],[/\\Digamma /g,"Ϝ"],[/\\digamma /g,"ϝ"],[/\\Koppa /g,"Ϟ"],[/\\Sampi /g,"Ϡ"],[/\\varkappa /g,"ϰ"],[/\\varrho /g,"ϱ"],[/\\textTheta /g,"ϴ"],[/\\backepsilon /g,"϶"],[/\\cyrchar\\CYRYO /g,"Ё"],[/\\cyrchar\\CYRDJE /g,"Ђ"],[/\\cyrchar\{\\'\\CYRG\}/g,"Ѓ"],[/\\cyrchar\\CYRIE /g,"Є"],[/\\cyrchar\\CYRDZE /g,"Ѕ"],[/\\cyrchar\\CYRII /g,"І"],[/\\cyrchar\\CYRYI /g,"Ї"],[/\\cyrchar\\CYRJE /g,"Ј"],[/\\cyrchar\\CYRLJE /g,"Љ"],[/\\cyrchar\\CYRNJE /g,"Њ"],[/\\cyrchar\\CYRTSHE /g,"Ћ"],[/\\cyrchar\{\\'\\CYRK\}/g,"Ќ"],[/\\cyrchar\\CYRUSHRT /g,"Ў"],[/\\cyrchar\\CYRDZHE /g,"Џ"],[/\\cyrchar\\CYRA /g,"А"],[/\\cyrchar\\CYRB /g,"Б"],[/\\cyrchar\\CYRV /g,"В"],[/\\cyrchar\\CYRG /g,"Г"],[/\\cyrchar\\CYRD /g,"Д"],[/\\cyrchar\\CYRE /g,"Е"],[/\\cyrchar\\CYRZH /g,"Ж"],[/\\cyrchar\\CYRZ /g,"З"],[/\\cyrchar\\CYRI /g,"И"],[/\\cyrchar\\CYRISHRT /g,"Й"],[/\\cyrchar\\CYRK /g,"К"],[/\\cyrchar\\CYRL /g,"Л"],[/\\cyrchar\\CYRM /g,"М"],[/\\cyrchar\\CYRN /g,"Н"],[/\\cyrchar\\CYRO /g,"О"],[/\\cyrchar\\CYRP /g,"П"],[/\\cyrchar\\CYRR /g,"Р"],[/\\cyrchar\\CYRS /g,"С"],[/\\cyrchar\\CYRT /g,"Т"],[/\\cyrchar\\CYRU /g,"У"],[/\\cyrchar\\CYRF /g,"Ф"],[/\\cyrchar\\CYRH /g,"Х"],[/\\cyrchar\\CYRC /g,"Ц"],[/\\cyrchar\\CYRCH /g,"Ч"],[/\\cyrchar\\CYRSH /g,"Ш"],[/\\cyrchar\\CYRSHCH /g,"Щ"],[/\\cyrchar\\CYRHRDSN /g,"Ъ"],[/\\cyrchar\\CYRERY /g,"Ы"],[/\\cyrchar\\CYRSFTSN /g,"Ь"],[/\\cyrchar\\CYREREV /g,"Э"],[/\\cyrchar\\CYRYU /g,"Ю"],[/\\cyrchar\\CYRYA /g,"Я"],[/\\cyrchar\\cyra /g,"а"],[/\\cyrchar\\cyrb /g,"б"],[/\\cyrchar\\cyrv /g,"в"],[/\\cyrchar\\cyrg /g,"г"],[/\\cyrchar\\cyrd /g,"д"],[/\\cyrchar\\cyre /g,"е"],[/\\cyrchar\\cyrzh /g,"ж"],[/\\cyrchar\\cyrz /g,"з"],[/\\cyrchar\\cyri /g,"и"],[/\\cyrchar\\cyrishrt /g,"й"],[/\\cyrchar\\cyrk /g,"к"],[/\\cyrchar\\cyrl /g,"л"],[/\\cyrchar\\cyrm /g,"м"],[/\\cyrchar\\cyrn /g,"н"],[/\\cyrchar\\cyro /g,"о"],[/\\cyrchar\\cyrp /g,"п"],[/\\cyrchar\\cyrr /g,"р"],[/\\cyrchar\\cyrs /g,"с"],[/\\cyrchar\\cyrt /g,"т"],[/\\cyrchar\\cyru /g,"у"],[/\\cyrchar\\cyrf /g,"ф"],[/\\cyrchar\\cyrh /g,"х"],[/\\cyrchar\\cyrc /g,"ц"],[/\\cyrchar\\cyrch /g,"ч"],[/\\cyrchar\\cyrsh /g,"ш"],[/\\cyrchar\\cyrshch /g,"щ"],[/\\cyrchar\\cyrhrdsn /g,"ъ"],[/\\cyrchar\\cyrery /g,"ы"],[/\\cyrchar\\cyrsftsn /g,"ь"],[/\\cyrchar\\cyrerev /g,"э"],[/\\cyrchar\\cyryu /g,"ю"],[/\\cyrchar\\cyrya /g,"я"],[/\\cyrchar\\cyryo /g,"ё"],[/\\cyrchar\\cyrdje /g,"ђ"],[/\\cyrchar\{\\'\\cyrg\}/g,"ѓ"],[/\\cyrchar\\cyrie /g,"є"],[/\\cyrchar\\cyrdze /g,"ѕ"],[/\\cyrchar\\cyrii /g,"і"],[/\\cyrchar\\cyryi /g,"ї"],[/\\cyrchar\\cyrje /g,"ј"],[/\\cyrchar\\cyrlje /g,"љ"],[/\\cyrchar\\cyrnje /g,"њ"],[/\\cyrchar\\cyrtshe /g,"ћ"],[/\\cyrchar\{\\'\\cyrk\}/g,"ќ"],[/\\cyrchar\\cyrushrt /g,"ў"],[/\\cyrchar\\cyrdzhe /g,"џ"],[/\\cyrchar\\CYROMEGA /g,"Ѡ"],[/\\cyrchar\\cyromega /g,"ѡ"],[/\\cyrchar\\CYRYAT /g,"Ѣ"],[/\\cyrchar\\CYRIOTE /g,"Ѥ"],[/\\cyrchar\\cyriote /g,"ѥ"],[/\\cyrchar\\CYRLYUS /g,"Ѧ"],[/\\cyrchar\\cyrlyus /g,"ѧ"],[/\\cyrchar\\CYRIOTLYUS /g,"Ѩ"],[/\\cyrchar\\cyriotlyus /g,"ѩ"],[/\\cyrchar\\CYRBYUS /g,"Ѫ"],[/\\cyrchar\\CYRIOTBYUS /g,"Ѭ"],[/\\cyrchar\\cyriotbyus /g,"ѭ"],[/\\cyrchar\\CYRKSI /g,"Ѯ"],[/\\cyrchar\\cyrksi /g,"ѯ"],[/\\cyrchar\\CYRPSI /g,"Ѱ"],[/\\cyrchar\\cyrpsi /g,"ѱ"],[/\\cyrchar\\CYRFITA /g,"Ѳ"],[/\\cyrchar\\CYRIZH /g,"Ѵ"],[/\\cyrchar\\CYRUK /g,"Ѹ"],[/\\cyrchar\\cyruk /g,"ѹ"],[/\\cyrchar\\CYROMEGARND /g,"Ѻ"],[/\\cyrchar\\cyromegarnd /g,"ѻ"],[/\\cyrchar\\CYROMEGATITLO /g,"Ѽ"],[/\\cyrchar\\cyromegatitlo /g,"ѽ"],[/\\cyrchar\\CYROT /g,"Ѿ"],[/\\cyrchar\\cyrot /g,"ѿ"],[/\\cyrchar\\CYRKOPPA /g,"Ҁ"],[/\\cyrchar\\cyrkoppa /g,"ҁ"],[/\\cyrchar\\cyrthousands /g,"҂"],[/\\cyrchar\\cyrhundredthousands /g,"҈"],[/\\cyrchar\\cyrmillions /g,"҉"],[/\\cyrchar\\CYRSEMISFTSN /g,"Ҍ"],[/\\cyrchar\\cyrsemisftsn /g,"ҍ"],[/\\cyrchar\\CYRRTICK /g,"Ҏ"],[/\\cyrchar\\cyrrtick /g,"ҏ"],[/\\cyrchar\\CYRGUP /g,"Ґ"],[/\\cyrchar\\cyrgup /g,"ґ"],[/\\cyrchar\\CYRGHCRS /g,"Ғ"],[/\\cyrchar\\cyrghcrs /g,"ғ"],[/\\cyrchar\\CYRGHK /g,"Ҕ"],[/\\cyrchar\\cyrghk /g,"ҕ"],[/\\cyrchar\\CYRZHDSC /g,"Җ"],[/\\cyrchar\\cyrzhdsc /g,"җ"],[/\\cyrchar\\CYRZDSC /g,"Ҙ"],[/\\cyrchar\\cyrzdsc /g,"ҙ"],[/\\cyrchar\\CYRKDSC /g,"Қ"],[/\\cyrchar\\cyrkdsc /g,"қ"],[/\\cyrchar\\CYRKVCRS /g,"Ҝ"],[/\\cyrchar\\cyrkvcrs /g,"ҝ"],[/\\cyrchar\\CYRKHCRS /g,"Ҟ"],[/\\cyrchar\\cyrkhcrs /g,"ҟ"],[/\\cyrchar\\CYRKBEAK /g,"Ҡ"],[/\\cyrchar\\cyrkbeak /g,"ҡ"],[/\\cyrchar\\CYRNDSC /g,"Ң"],[/\\cyrchar\\cyrndsc /g,"ң"],[/\\cyrchar\\CYRNG /g,"Ҥ"],[/\\cyrchar\\cyrng /g,"ҥ"],[/\\cyrchar\\CYRPHK /g,"Ҧ"],[/\\cyrchar\\cyrphk /g,"ҧ"],[/\\cyrchar\\CYRABHHA /g,"Ҩ"],[/\\cyrchar\\cyrabhha /g,"ҩ"],[/\\cyrchar\\CYRSDSC /g,"Ҫ"],[/\\cyrchar\\cyrsdsc /g,"ҫ"],[/\\cyrchar\\CYRTDSC /g,"Ҭ"],[/\\cyrchar\\cyrtdsc /g,"ҭ"],[/\\cyrchar\\CYRY /g,"Ү"],[/\\cyrchar\\cyry /g,"ү"],[/\\cyrchar\\CYRYHCRS /g,"Ұ"],[/\\cyrchar\\cyryhcrs /g,"ұ"],[/\\cyrchar\\CYRHDSC /g,"Ҳ"],[/\\cyrchar\\cyrhdsc /g,"ҳ"],[/\\cyrchar\\CYRTETSE /g,"Ҵ"],[/\\cyrchar\\cyrtetse /g,"ҵ"],[/\\cyrchar\\CYRCHRDSC /g,"Ҷ"],[/\\cyrchar\\cyrchrdsc /g,"ҷ"],[/\\cyrchar\\CYRCHVCRS /g,"Ҹ"],[/\\cyrchar\\cyrchvcrs /g,"ҹ"],[/\\cyrchar\\CYRSHHA /g,"Һ"],[/\\cyrchar\\cyrshha /g,"һ"],[/\\cyrchar\\CYRABHCH /g,"Ҽ"],[/\\cyrchar\\cyrabhch /g,"ҽ"],[/\\cyrchar\\CYRABHCHDSC /g,"Ҿ"],[/\\cyrchar\\cyrabhchdsc /g,"ҿ"],[/\\cyrchar\\CYRpalochka /g,"Ӏ"],[/\\cyrchar\\CYRKHK /g,"Ӄ"],[/\\cyrchar\\cyrkhk /g,"ӄ"],[/\\cyrchar\\CYRNHK /g,"Ӈ"],[/\\cyrchar\\cyrnhk /g,"ӈ"],[/\\cyrchar\\CYRCHLDSC /g,"Ӌ"],[/\\cyrchar\\cyrchldsc /g,"ӌ"],[/\\cyrchar\\CYRAE /g,"Ӕ"],[/\\cyrchar\\cyrae /g,"ӕ"],[/\\cyrchar\\CYRSCHWA /g,"Ә"],[/\\cyrchar\\cyrschwa /g,"ә"],[/\\cyrchar\\CYRABHDZE /g,"Ӡ"],[/\\cyrchar\\cyrabhdze /g,"ӡ"],[/\\cyrchar\\CYROTLD /g,"Ө"],[/\\cyrchar\\cyrotld /g,"ө"],[/\\hspace\{0.6em\}/g," "],[/\\hspace\{1em\}/g," "],[/\\hspace\{0.33em\}/g," "],[/\\hspace\{0.25em\}/g," "],[/\\hspace\{0.166em\}/g," "],[/\\hphantom\{0\}/g," "],[/\\hphantom\{,\}/g," "],[/\\hspace\{0.167em\}/g," "],[/\\mkern1mu /g," "],[/\\textendash /g,"–"],[/\\textemdash /g,"—"],[/\\rule\{1em\}\{1pt\}/g,"―"],[/\\Vert /g,"‖"],[/\\Elzreapos /g,"‛"],[/\\textquotedblleft /g,"“"],[/\\textquotedblright /g,"”"],[/\\textdagger /g,"†"],[/\\textdaggerdbl /g,"‡"],[/\\textbullet /g,"•"],[/\\ldots /g,"…"],[/\\textperthousand /g,"‰"],[/\\textpertenthousand /g,"‱"],[/\\backprime /g,"‵"],[/\\guilsinglleft /g,"‹"],[/\\guilsinglright /g,"›"],[/\\mkern4mu /g," "],[/\\nolinebreak /g,"⁠"],[/\\ensuremath\{\\Elzpes\}/g,"₧"],[/\\mbox\{\\texteuro\} /g,"€"],[/\\dddot /g,"⃛"],[/\\ddddot /g,"⃜"],[/\\mathbb\{C\}/g,"ℂ"],[/\\mathscr\{g\}/g,"ℊ"],[/\\mathscr\{H\}/g,"ℋ"],[/\\mathfrak\{H\}/g,"ℌ"],[/\\mathbb\{H\}/g,"ℍ"],[/\\hslash /g,"ℏ"],[/\\mathscr\{I\}/g,"ℐ"],[/\\mathfrak\{I\}/g,"ℑ"],[/\\mathscr\{L\}/g,"ℒ"],[/\\mathscr\{l\}/g,"ℓ"],[/\\mathbb\{N\}/g,"ℕ"],[/\\cyrchar\\textnumero /g,"№"],[/\\wp /g,"℘"],[/\\mathbb\{P\}/g,"ℙ"],[/\\mathbb\{Q\}/g,"ℚ"],[/\\mathscr\{R\}/g,"ℛ"],[/\\mathfrak\{R\}/g,"ℜ"],[/\\mathbb\{R\}/g,"ℝ"],[/\\Elzxrat /g,"℞"],[/\\texttrademark /g,"™"],[/\\mathbb\{Z\}/g,"ℤ"],[/\\Omega /g,"Ω"],[/\\mho /g,"℧"],[/\\mathfrak\{Z\}/g,"ℨ"],[/\\ElsevierGlyph\{2129\}/g,"℩"],[/\\AA /g,"Å"],[/\\mathscr\{B\}/g,"ℬ"],[/\\mathfrak\{C\}/g,"ℭ"],[/\\mathscr\{e\}/g,"ℯ"],[/\\mathscr\{E\}/g,"ℰ"],[/\\mathscr\{F\}/g,"ℱ"],[/\\mathscr\{M\}/g,"ℳ"],[/\\mathscr\{o\}/g,"ℴ"],[/\\aleph /g,"ℵ"],[/\\beth /g,"ℶ"],[/\\gimel /g,"ℷ"],[/\\daleth /g,"ℸ"],[/\\textfrac\{1\}\{3\}/g,"⅓"],[/\\textfrac\{2\}\{3\}/g,"⅔"],[/\\textfrac\{1\}\{5\}/g,"⅕"],[/\\textfrac\{2\}\{5\}/g,"⅖"],[/\\textfrac\{3\}\{5\}/g,"⅗"],[/\\textfrac\{4\}\{5\}/g,"⅘"],[/\\textfrac\{1\}\{6\}/g,"⅙"],[/\\textfrac\{5\}\{6\}/g,"⅚"],[/\\textfrac\{1\}\{8\}/g,"⅛"],[/\\textfrac\{3\}\{8\}/g,"⅜"],[/\\textfrac\{5\}\{8\}/g,"⅝"],[/\\textfrac\{7\}\{8\}/g,"⅞"],[/\\leftarrow /g,"←"],[/\\uparrow /g,"↑"],[/\\rightarrow /g,"→"],[/\\downarrow /g,"↓"],[/\\leftrightarrow /g,"↔"],[/\\updownarrow /g,"↕"],[/\\nwarrow /g,"↖"],[/\\nearrow /g,"↗"],[/\\searrow /g,"↘"],[/\\swarrow /g,"↙"],[/\\nleftarrow /g,"↚"],[/\\nrightarrow /g,"↛"],[/\\arrowwaveright /g,"↜"],[/\\arrowwaveright /g,"↝"],[/\\twoheadleftarrow /g,"↞"],[/\\twoheadrightarrow /g,"↠"],[/\\leftarrowtail /g,"↢"],[/\\rightarrowtail /g,"↣"],[/\\mapsto /g,"↦"],[/\\hookleftarrow /g,"↩"],[/\\hookrightarrow /g,"↪"],[/\\looparrowleft /g,"↫"],[/\\looparrowright /g,"↬"],[/\\leftrightsquigarrow /g,"↭"],[/\\nleftrightarrow /g,"↮"],[/\\Lsh /g,"↰"],[/\\Rsh /g,"↱"],[/\\ElsevierGlyph\{21B3\}/g,"↳"],[/\\curvearrowleft /g,"↶"],[/\\curvearrowright /g,"↷"],[/\\circlearrowleft /g,"↺"],[/\\circlearrowright /g,"↻"],[/\\leftharpoonup /g,"↼"],[/\\leftharpoondown /g,"↽"],[/\\upharpoonright /g,"↾"],[/\\upharpoonleft /g,"↿"],[/\\rightharpoonup /g,"⇀"],[/\\rightharpoondown /g,"⇁"],[/\\downharpoonright /g,"⇂"],[/\\downharpoonleft /g,"⇃"],[/\\rightleftarrows /g,"⇄"],[/\\dblarrowupdown /g,"⇅"],[/\\leftrightarrows /g,"⇆"],[/\\leftleftarrows /g,"⇇"],[/\\upuparrows /g,"⇈"],[/\\rightrightarrows /g,"⇉"],[/\\downdownarrows /g,"⇊"],[/\\leftrightharpoons /g,"⇋"],[/\\rightleftharpoons /g,"⇌"],[/\\nLeftarrow /g,"⇍"],[/\\nLeftrightarrow /g,"⇎"],[/\\nRightarrow /g,"⇏"],[/\\Leftarrow /g,"⇐"],[/\\Uparrow /g,"⇑"],[/\\Rightarrow /g,"⇒"],[/\\Downarrow /g,"⇓"],[/\\Leftrightarrow /g,"⇔"],[/\\Updownarrow /g,"⇕"],[/\\Lleftarrow /g,"⇚"],[/\\Rrightarrow /g,"⇛"],[/\\rightsquigarrow /g,"⇝"],[/\\DownArrowUpArrow /g,"⇵"],[/\\forall /g,"∀"],[/\\complement /g,"∁"],[/\\partial /g,"∂"],[/\\exists /g,"∃"],[/\\nexists /g,"∄"],[/\\varnothing /g,"∅"],[/\\nabla /g,"∇"],[/\\in /g,"∈"],[/\\not\\in /g,"∉"],[/\\ni /g,"∋"],[/\\not\\ni /g,"∌"],[/\\prod /g,"∏"],[/\\coprod /g,"∐"],[/\\sum /g,"∑"],[/\\mp /g,"∓"],[/\\dotplus /g,"∔"],[/\\setminus /g,"∖"],[/\\circ /g,"∘"],[/\\bullet /g,"∙"],[/\\surd /g,"√"],[/\\propto /g,"∝"],[/\\infty /g,"∞"],[/\\rightangle /g,"∟"],[/\\angle /g,"∠"],[/\\measuredangle /g,"∡"],[/\\sphericalangle /g,"∢"],[/\\mid /g,"∣"],[/\\nmid /g,"∤"],[/\\parallel /g,"∥"],[/\\nparallel /g,"∦"],[/\\wedge /g,"∧"],[/\\vee /g,"∨"],[/\\cap /g,"∩"],[/\\cup /g,"∪"],[/\\int /g,"∫"],[/\\int\\!\\int /g,"∬"],[/\\int\\!\\int\\!\\int /g,"∭"],[/\\oint /g,"∮"],[/\\surfintegral /g,"∯"],[/\\volintegral /g,"∰"],[/\\clwintegral /g,"∱"],[/\\ElsevierGlyph\{2232\}/g,"∲"],[/\\ElsevierGlyph\{2233\}/g,"∳"],[/\\therefore /g,"∴"],[/\\because /g,"∵"],[/\\Colon /g,"∷"],[/\\ElsevierGlyph\{2238\}/g,"∸"],[/\\mathbin\{\{:\}\\!\\!\{\-\}\\!\\!\{:\}\}/g,"∺"],[/\\homothetic /g,"∻"],[/\\sim /g,"∼"],[/\\backsim /g,"∽"],[/\\lazysinv /g,"∾"],[/\\wr /g,"≀"],[/\\not\\sim /g,"≁"],[/\\ElsevierGlyph\{2242\}/g,"≂"],[/\\NotEqualTilde /g,"≂-00338"],[/\\simeq /g,"≃"],[/\\not\\simeq /g,"≄"],[/\\cong /g,"≅"],[/\\approxnotequal /g,"≆"],[/\\not\\cong /g,"≇"],[/\\approx /g,"≈"],[/\\not\\approx /g,"≉"],[/\\approxeq /g,"≊"],[/\\tildetrpl /g,"≋"],[/\\not\\apid /g,"≋-00338"],[/\\allequal /g,"≌"],[/\\asymp /g,"≍"],[/\\Bumpeq /g,"≎"],[/\\NotHumpDownHump /g,"≎-00338"],[/\\bumpeq /g,"≏"],[/\\NotHumpEqual /g,"≏-00338"],[/\\doteq /g,"≐"],[/\\not\\doteq/g,"≐-00338"],[/\\doteqdot /g,"≑"],[/\\fallingdotseq /g,"≒"],[/\\risingdotseq /g,"≓"],[/\\eqcirc /g,"≖"],[/\\circeq /g,"≗"],[/\\estimates /g,"≙"],[/\\ElsevierGlyph\{225A\}/g,"≚"],[/\\starequal /g,"≛"],[/\\triangleq /g,"≜"],[/\\ElsevierGlyph\{225F\}/g,"≟"],[/\\not =/g,"≠"],[/\\equiv /g,"≡"],[/\\not\\equiv /g,"≢"],[/\\leq /g,"≤"],[/\\geq /g,"≥"],[/\\leqq /g,"≦"],[/\\geqq /g,"≧"],[/\\lneqq /g,"≨"],[/\\lvertneqq /g,"≨-0FE00"],[/\\gneqq /g,"≩"],[/\\gvertneqq /g,"≩-0FE00"],[/\\ll /g,"≪"],[/\\NotLessLess /g,"≪-00338"],[/\\gg /g,"≫"],[/\\NotGreaterGreater /g,"≫-00338"],[/\\between /g,"≬"],[/\\not\\kern\-0.3em\\times /g,"≭"],[/\\not</g,"≮"],[/\\not>/g,"≯"],[/\\not\\leq /g,"≰"],[/\\not\\geq /g,"≱"],[/\\lessequivlnt /g,"≲"],[/\\greaterequivlnt /g,"≳"],[/\\ElsevierGlyph\{2274\}/g,"≴"],[/\\ElsevierGlyph\{2275\}/g,"≵"],[/\\lessgtr /g,"≶"],[/\\gtrless /g,"≷"],[/\\notlessgreater /g,"≸"],[/\\notgreaterless /g,"≹"],[/\\prec /g,"≺"],[/\\succ /g,"≻"],[/\\preccurlyeq /g,"≼"],[/\\succcurlyeq /g,"≽"],[/\\precapprox /g,"≾"],[/\\NotPrecedesTilde /g,"≾-00338"],[/\\succapprox /g,"≿"],[/\\NotSucceedsTilde /g,"≿-00338"],[/\\not\\prec /g,"⊀"],[/\\not\\succ /g,"⊁"],[/\\subset /g,"⊂"],[/\\supset /g,"⊃"],[/\\not\\subset /g,"⊄"],[/\\not\\supset /g,"⊅"],[/\\subseteq /g,"⊆"],[/\\supseteq /g,"⊇"],[/\\not\\subseteq /g,"⊈"],[/\\not\\supseteq /g,"⊉"],[/\\subsetneq /g,"⊊"],[/\\varsubsetneqq /g,"⊊-0FE00"],[/\\supsetneq /g,"⊋"],[/\\varsupsetneq /g,"⊋-0FE00"],[/\\uplus /g,"⊎"],[/\\sqsubset /g,"⊏"],[/\\NotSquareSubset /g,"⊏-00338"],[/\\sqsupset /g,"⊐"],[/\\NotSquareSuperset /g,"⊐-00338"],[/\\sqsubseteq /g,"⊑"],[/\\sqsupseteq /g,"⊒"],[/\\sqcap /g,"⊓"],[/\\sqcup /g,"⊔"],[/\\oplus /g,"⊕"],[/\\ominus /g,"⊖"],[/\\otimes /g,"⊗"],[/\\oslash /g,"⊘"],[/\\odot /g,"⊙"],[/\\circledcirc /g,"⊚"],[/\\circledast /g,"⊛"],[/\\circleddash /g,"⊝"],[/\\boxplus /g,"⊞"],[/\\boxminus /g,"⊟"],[/\\boxtimes /g,"⊠"],[/\\boxdot /g,"⊡"],[/\\vdash /g,"⊢"],[/\\dashv /g,"⊣"],[/\\top /g,"⊤"],[/\\perp /g,"⊥"],[/\\truestate /g,"⊧"],[/\\forcesextra /g,"⊨"],[/\\Vdash /g,"⊩"],[/\\Vvdash /g,"⊪"],[/\\VDash /g,"⊫"],[/\\nvdash /g,"⊬"],[/\\nvDash /g,"⊭"],[/\\nVdash /g,"⊮"],[/\\nVDash /g,"⊯"],[/\\vartriangleleft /g,"⊲"],[/\\vartriangleright /g,"⊳"],[/\\trianglelefteq /g,"⊴"],[/\\trianglerighteq /g,"⊵"],[/\\original /g,"⊶"],[/\\image /g,"⊷"],[/\\multimap /g,"⊸"],[/\\hermitconjmatrix /g,"⊹"],[/\\intercal /g,"⊺"],[/\\veebar /g,"⊻"],[/\\rightanglearc /g,"⊾"],[/\\ElsevierGlyph\{22C0\}/g,"⋀"],[/\\ElsevierGlyph\{22C1\}/g,"⋁"],[/\\bigcap /g,"⋂"],[/\\bigcup /g,"⋃"],[/\\diamond /g,"⋄"],[/\\cdot /g,"⋅"],[/\\star /g,"⋆"],[/\\divideontimes /g,"⋇"],[/\\bowtie /g,"⋈"],[/\\ltimes /g,"⋉"],[/\\rtimes /g,"⋊"],[/\\leftthreetimes /g,"⋋"],[/\\rightthreetimes /g,"⋌"],[/\\backsimeq /g,"⋍"],[/\\curlyvee /g,"⋎"],[/\\curlywedge /g,"⋏"],[/\\Subset /g,"⋐"],[/\\Supset /g,"⋑"],[/\\Cap /g,"⋒"],[/\\Cup /g,"⋓"],[/\\pitchfork /g,"⋔"],[/\\lessdot /g,"⋖"],[/\\gtrdot /g,"⋗"],[/\\verymuchless /g,"⋘"],[/\\verymuchgreater /g,"⋙"],[/\\lesseqgtr /g,"⋚"],[/\\gtreqless /g,"⋛"],[/\\curlyeqprec /g,"⋞"],[/\\curlyeqsucc /g,"⋟"],[/\\not\\sqsubseteq /g,"⋢"],[/\\not\\sqsupseteq /g,"⋣"],[/\\Elzsqspne /g,"⋥"],[/\\lnsim /g,"⋦"],[/\\gnsim /g,"⋧"],[/\\precedesnotsimilar /g,"⋨"],[/\\succnsim /g,"⋩"],[/\\ntriangleleft /g,"⋪"],[/\\ntriangleright /g,"⋫"],[/\\ntrianglelefteq /g,"⋬"],[/\\ntrianglerighteq /g,"⋭"],[/\\vdots /g,"⋮"],[/\\cdots /g,"⋯"],[/\\upslopeellipsis /g,"⋰"],[/\\downslopeellipsis /g,"⋱"],[/\\barwedge /g,"⌅"],[/\\perspcorrespond /g,"⌆"],[/\\lceil /g,"⌈"],[/\\rceil /g,"⌉"],[/\\lfloor /g,"⌊"],[/\\rfloor /g,"⌋"],[/\\recorder /g,"⌕"],[/\\mathchar"2208/g,"⌖"],[/\\ulcorner /g,"⌜"],[/\\urcorner /g,"⌝"],[/\\llcorner /g,"⌞"],[/\\lrcorner /g,"⌟"],[/\\frown /g,"⌢"],[/\\smile /g,"⌣"],[/\\langle /g,"〈"],[/\\rangle /g,"〉"],[/\\ElsevierGlyph\{E838\}/g,"⌽"],[/\\Elzdlcorn /g,"⎣"],[/\\lmoustache /g,"⎰"],[/\\rmoustache /g,"⎱"],[/\\textvisiblespace /g,"␣"],[/\\ding\{172\}/g,"①"],[/\\ding\{173\}/g,"②"],[/\\ding\{174\}/g,"③"],[/\\ding\{175\}/g,"④"],[/\\ding\{176\}/g,"⑤"],[/\\ding\{177\}/g,"⑥"],[/\\ding\{178\}/g,"⑦"],[/\\ding\{179\}/g,"⑧"],[/\\ding\{180\}/g,"⑨"],[/\\ding\{181\}/g,"⑩"],[/\\circledS /g,"Ⓢ"],[/\\Elzdshfnc /g,"┆"],[/\\Elzsqfnw /g,"┙"],[/\\diagup /g,"╱"],[/\\ding\{110\}/g,"■"],[/\\square /g,"□"],[/\\blacksquare /g,"▪"],[/\\fbox\{~~\}/g,"▭"],[/\\Elzvrecto /g,"▯"],[/\\ElsevierGlyph\{E381\}/g,"▱"],[/\\ding\{115\}/g,"▲"],[/\\bigtriangleup /g,"△"],[/\\blacktriangle /g,"▴"],[/\\vartriangle /g,"▵"],[/\\blacktriangleright /g,"▸"],[/\\triangleright /g,"▹"],[/\\ding\{116\}/g,"▼"],[/\\bigtriangledown /g,"▽"],[/\\blacktriangledown /g,"▾"],[/\\triangledown /g,"▿"],[/\\blacktriangleleft /g,"◂"],[/\\triangleleft /g,"◃"],[/\\ding\{117\}/g,"◆"],[/\\lozenge /g,"◊"],[/\\bigcirc /g,"○"],[/\\ding\{108\}/g,"●"],[/\\Elzcirfl /g,"◐"],[/\\Elzcirfr /g,"◑"],[/\\Elzcirfb /g,"◒"],[/\\ding\{119\}/g,"◗"],[/\\Elzrvbull /g,"◘"],[/\\Elzsqfl /g,"◧"],[/\\Elzsqfr /g,"◨"],[/\\Elzsqfse /g,"◪"],[/\\bigcirc /g,"◯"],[/\\ding\{72\}/g,"★"],[/\\ding\{73\}/g,"☆"],[/\\ding\{37\}/g,"☎"],[/\\ding\{42\}/g,"☛"],[/\\ding\{43\}/g,"☞"],[/\\rightmoon /g,"☾"],[/\\mercury /g,"☿"],[/\\venus /g,"♀"],[/\\male /g,"♂"],[/\\jupiter /g,"♃"],[/\\saturn /g,"♄"],[/\\uranus /g,"♅"],[/\\neptune /g,"♆"],[/\\pluto /g,"♇"],[/\\aries /g,"♈"],[/\\taurus /g,"♉"],[/\\gemini /g,"♊"],[/\\cancer /g,"♋"],[/\\leo /g,"♌"],[/\\virgo /g,"♍"],[/\\libra /g,"♎"],[/\\scorpio /g,"♏"],[/\\sagittarius /g,"♐"],[/\\capricornus /g,"♑"],[/\\aquarius /g,"♒"],[/\\pisces /g,"♓"],[/\\ding\{171\}/g,"♠"],[/\\diamond /g,"♢"],[/\\ding\{168\}/g,"♣"],[/\\ding\{170\}/g,"♥"],[/\\ding\{169\}/g,"♦"],[/\\quarternote /g,"♩"],[/\\eighthnote /g,"♪"],[/\\flat /g,"♭"],[/\\natural /g,"♮"],[/\\sharp /g,"♯"],[/\\ding\{33\}/g,"✁"],[/\\ding\{34\}/g,"✂"],[/\\ding\{35\}/g,"✃"],[/\\ding\{36\}/g,"✄"],[/\\ding\{38\}/g,"✆"],[/\\ding\{39\}/g,"✇"],[/\\ding\{40\}/g,"✈"],[/\\ding\{41\}/g,"✉"],[/\\ding\{44\}/g,"✌"],[/\\ding\{45\}/g,"✍"],[/\\ding\{46\}/g,"✎"],[/\\ding\{47\}/g,"✏"],[/\\ding\{48\}/g,"✐"],[/\\ding\{49\}/g,"✑"],[/\\ding\{50\}/g,"✒"],[/\\ding\{51\}/g,"✓"],[/\\ding\{52\}/g,"✔"],[/\\ding\{53\}/g,"✕"],[/\\ding\{54\}/g,"✖"],[/\\ding\{55\}/g,"✗"],[/\\ding\{56\}/g,"✘"],[/\\ding\{57\}/g,"✙"],[/\\ding\{58\}/g,"✚"],[/\\ding\{59\}/g,"✛"],[/\\ding\{60\}/g,"✜"],[/\\ding\{61\}/g,"✝"],[/\\ding\{62\}/g,"✞"],[/\\ding\{63\}/g,"✟"],[/\\ding\{64\}/g,"✠"],[/\\ding\{65\}/g,"✡"],[/\\ding\{66\}/g,"✢"],[/\\ding\{67\}/g,"✣"],[/\\ding\{68\}/g,"✤"],[/\\ding\{69\}/g,"✥"],[/\\ding\{70\}/g,"✦"],[/\\ding\{71\}/g,"✧"],[/\\ding\{73\}/g,"✩"],[/\\ding\{74\}/g,"✪"],[/\\ding\{75\}/g,"✫"],[/\\ding\{76\}/g,"✬"],[/\\ding\{77\}/g,"✭"],[/\\ding\{78\}/g,"✮"],[/\\ding\{79\}/g,"✯"],[/\\ding\{80\}/g,"✰"],[/\\ding\{81\}/g,"✱"],[/\\ding\{82\}/g,"✲"],[/\\ding\{83\}/g,"✳"],[/\\ding\{84\}/g,"✴"],[/\\ding\{85\}/g,"✵"],[/\\ding\{86\}/g,"✶"],[/\\ding\{87\}/g,"✷"],[/\\ding\{88\}/g,"✸"],[/\\ding\{89\}/g,"✹"],[/\\ding\{90\}/g,"✺"],[/\\ding\{91\}/g,"✻"],[/\\ding\{92\}/g,"✼"],[/\\ding\{93\}/g,"✽"],[/\\ding\{94\}/g,"✾"],[/\\ding\{95\}/g,"✿"],[/\\ding\{96\}/g,"❀"],[/\\ding\{97\}/g,"❁"],[/\\ding\{98\}/g,"❂"],[/\\ding\{99\}/g,"❃"],[/\\ding\{100\}/g,"❄"],[/\\ding\{101\}/g,"❅"],[/\\ding\{102\}/g,"❆"],[/\\ding\{103\}/g,"❇"],[/\\ding\{104\}/g,"❈"],[/\\ding\{105\}/g,"❉"],[/\\ding\{106\}/g,"❊"],[/\\ding\{107\}/g,"❋"],[/\\ding\{109\}/g,"❍"],[/\\ding\{111\}/g,"❏"],[/\\ding\{112\}/g,"❐"],[/\\ding\{113\}/g,"❑"],[/\\ding\{114\}/g,"❒"],[/\\ding\{118\}/g,"❖"],[/\\ding\{120\}/g,"❘"],[/\\ding\{121\}/g,"❙"],[/\\ding\{122\}/g,"❚"],[/\\ding\{123\}/g,"❛"],[/\\ding\{124\}/g,"❜"],[/\\ding\{125\}/g,"❝"],[/\\ding\{126\}/g,"❞"],[/\\ding\{161\}/g,"❡"],[/\\ding\{162\}/g,"❢"],[/\\ding\{163\}/g,"❣"],[/\\ding\{164\}/g,"❤"],[/\\ding\{165\}/g,"❥"],[/\\ding\{166\}/g,"❦"],[/\\ding\{167\}/g,"❧"],[/\\ding\{182\}/g,"❶"],[/\\ding\{183\}/g,"❷"],[/\\ding\{184\}/g,"❸"],[/\\ding\{185\}/g,"❹"],[/\\ding\{186\}/g,"❺"],[/\\ding\{187\}/g,"❻"],[/\\ding\{188\}/g,"❼"],[/\\ding\{189\}/g,"❽"],[/\\ding\{190\}/g,"❾"],[/\\ding\{191\}/g,"❿"],[/\\ding\{192\}/g,"➀"],[/\\ding\{193\}/g,"➁"],[/\\ding\{194\}/g,"➂"],[/\\ding\{195\}/g,"➃"],[/\\ding\{196\}/g,"➄"],[/\\ding\{197\}/g,"➅"],[/\\ding\{198\}/g,"➆"],[/\\ding\{199\}/g,"➇"],[/\\ding\{200\}/g,"➈"],[/\\ding\{201\}/g,"➉"],[/\\ding\{202\}/g,"➊"],[/\\ding\{203\}/g,"➋"],[/\\ding\{204\}/g,"➌"],[/\\ding\{205\}/g,"➍"],[/\\ding\{206\}/g,"➎"],[/\\ding\{207\}/g,"➏"],[/\\ding\{208\}/g,"➐"],[/\\ding\{209\}/g,"➑"],[/\\ding\{210\}/g,"➒"],[/\\ding\{211\}/g,"➓"],[/\\ding\{212\}/g,"➔"],[/\\ding\{216\}/g,"➘"],[/\\ding\{217\}/g,"➙"],[/\\ding\{218\}/g,"➚"],[/\\ding\{219\}/g,"➛"],[/\\ding\{220\}/g,"➜"],[/\\ding\{221\}/g,"➝"],[/\\ding\{222\}/g,"➞"],[/\\ding\{223\}/g,"➟"],[/\\ding\{224\}/g,"➠"],[/\\ding\{225\}/g,"➡"],[/\\ding\{226\}/g,"➢"],[/\\ding\{227\}/g,"➣"],[/\\ding\{228\}/g,"➤"],[/\\ding\{229\}/g,"➥"],[/\\ding\{230\}/g,"➦"],[/\\ding\{231\}/g,"➧"],[/\\ding\{232\}/g,"➨"],[/\\ding\{233\}/g,"➩"],[/\\ding\{234\}/g,"➪"],[/\\ding\{235\}/g,"➫"],[/\\ding\{236\}/g,"➬"],[/\\ding\{237\}/g,"➭"],[/\\ding\{238\}/g,"➮"],[/\\ding\{239\}/g,"➯"],[/\\ding\{241\}/g,"➱"],[/\\ding\{242\}/g,"➲"],[/\\ding\{243\}/g,"➳"],[/\\ding\{244\}/g,"➴"],[/\\ding\{245\}/g,"➵"],[/\\ding\{246\}/g,"➶"],[/\\ding\{247\}/g,"➷"],[/\\ding\{248\}/g,"➸"],[/\\ding\{249\}/g,"➹"],[/\\ding\{250\}/g,"➺"],[/\\ding\{251\}/g,"➻"],[/\\ding\{252\}/g,"➼"],[/\\ding\{253\}/g,"➽"],[/\\ding\{254\}/g,"➾"],[/\\longleftarrow /g,"⟵"],[/\\longrightarrow /g,"⟶"],[/\\longleftrightarrow /g,"⟷"],[/\\Longleftarrow /g,"⟸"],[/\\Longrightarrow /g,"⟹"],[/\\Longleftrightarrow /g,"⟺"],[/\\longmapsto /g,"⟼"],[/\\sim\\joinrel\\leadsto/g,"⟿"],[/\\ElsevierGlyph\{E212\}/g,"⤅"],[/\\UpArrowBar /g,"⤒"],[/\\DownArrowBar /g,"⤓"],[/\\ElsevierGlyph\{E20C\}/g,"⤣"],[/\\ElsevierGlyph\{E20D\}/g,"⤤"],[/\\ElsevierGlyph\{E20B\}/g,"⤥"],[/\\ElsevierGlyph\{E20A\}/g,"⤦"],[/\\ElsevierGlyph\{E211\}/g,"⤧"],[/\\ElsevierGlyph\{E20E\}/g,"⤨"],[/\\ElsevierGlyph\{E20F\}/g,"⤩"],[/\\ElsevierGlyph\{E210\}/g,"⤪"],[/\\ElsevierGlyph\{E21C\}/g,"⤳"],[/\\ElsevierGlyph\{E21D\}/g,"⤳-00338"],[/\\ElsevierGlyph\{E21A\}/g,"⤶"],[/\\ElsevierGlyph\{E219\}/g,"⤷"],[/\\Elolarr /g,"⥀"],[/\\Elorarr /g,"⥁"],[/\\ElzRlarr /g,"⥂"],[/\\ElzrLarr /g,"⥄"],[/\\Elzrarrx /g,"⥇"],[/\\LeftRightVector /g,"⥎"],[/\\RightUpDownVector /g,"⥏"],[/\\DownLeftRightVector /g,"⥐"],[/\\LeftUpDownVector /g,"⥑"],[/\\LeftVectorBar /g,"⥒"],[/\\RightVectorBar /g,"⥓"],[/\\RightUpVectorBar /g,"⥔"],[/\\RightDownVectorBar /g,"⥕"],[/\\DownLeftVectorBar /g,"⥖"],[/\\DownRightVectorBar /g,"⥗"],[/\\LeftUpVectorBar /g,"⥘"],[/\\LeftDownVectorBar /g,"⥙"],[/\\LeftTeeVector /g,"⥚"],[/\\RightTeeVector /g,"⥛"],[/\\RightUpTeeVector /g,"⥜"],[/\\RightDownTeeVector /g,"⥝"],[/\\DownLeftTeeVector /g,"⥞"],[/\\DownRightTeeVector /g,"⥟"],[/\\LeftUpTeeVector /g,"⥠"],[/\\LeftDownTeeVector /g,"⥡"],[/\\UpEquilibrium /g,"⥮"],[/\\ReverseUpEquilibrium /g,"⥯"],[/\\RoundImplies /g,"⥰"],[/\\ElsevierGlyph\{E214\}/g,"⥼"],[/\\ElsevierGlyph\{E215\}/g,"⥽"],[/\\Elztfnc /g,"⦀"],[/\\ElsevierGlyph\{3018\}/g,"⦅"],[/\\Elroang /g,"⦆"],[/\\ElsevierGlyph\{E291\}/g,"⦔"],[/\\Elzddfnc /g,"⦙"],[/\\Angle /g,"⦜"],[/\\Elzlpargt /g,"⦠"],[/\\ElsevierGlyph\{E260\}/g,"⦵"],[/\\ElsevierGlyph\{E61B\}/g,"⦶"],[/\\ElzLap /g,"⧊"],[/\\Elzdefas /g,"⧋"],[/\\LeftTriangleBar /g,"⧏"],[/\\NotLeftTriangleBar /g,"⧏-00338"],[/\\RightTriangleBar /g,"⧐"],[/\\NotRightTriangleBar /g,"⧐-00338"],[/\\ElsevierGlyph\{E372\}/g,"⧜"],[/\\blacklozenge /g,"⧫"],[/\\RuleDelayed /g,"⧴"],[/\\Elxuplus /g,"⨄"],[/\\ElzThr /g,"⨅"],[/\\Elxsqcup /g,"⨆"],[/\\ElzInf /g,"⨇"],[/\\ElzSup /g,"⨈"],[/\\ElzCint /g,"⨍"],[/\\clockoint /g,"⨏"],[/\\ElsevierGlyph\{E395\}/g,"⨐"],[/\\sqrint /g,"⨖"],[/\\ElsevierGlyph\{E25A\}/g,"⨥"],[/\\ElsevierGlyph\{E25B\}/g,"⨪"],[/\\ElsevierGlyph\{E25C\}/g,"⨭"],[/\\ElsevierGlyph\{E25D\}/g,"⨮"],[/\\ElzTimes /g,"⨯"],[/\\ElsevierGlyph\{E25E\}/g,"⨴"],[/\\ElsevierGlyph\{E25E\}/g,"⨵"],[/\\ElsevierGlyph\{E259\}/g,"⨼"],[/\\amalg /g,"⨿"],[/\\ElzAnd /g,"⩓"],[/\\ElzOr /g,"⩔"],[/\\ElsevierGlyph\{E36E\}/g,"⩕"],[/\\ElOr /g,"⩖"],[/\\perspcorrespond /g,"⩞"],[/\\Elzminhat /g,"⩟"],[/\\ElsevierGlyph\{225A\}/g,"⩣"],[/\\stackrel\{*\}\{=\}/g,"⩮"],[/\\Equal /g,"⩵"],[/\\leqslant /g,"⩽"],[/\\nleqslant /g,"⩽-00338"],[/\\geqslant /g,"⩾"],[/\\ngeqslant /g,"⩾-00338"],[/\\lessapprox /g,"⪅"],[/\\gtrapprox /g,"⪆"],[/\\lneq /g,"⪇"],[/\\gneq /g,"⪈"],[/\\lnapprox /g,"⪉"],[/\\gnapprox /g,"⪊"],[/\\lesseqqgtr /g,"⪋"],[/\\gtreqqless /g,"⪌"],[/\\eqslantless /g,"⪕"],[/\\eqslantgtr /g,"⪖"],[/\\Pisymbol\{ppi020\}\{117\}/g,"⪝"],[/\\Pisymbol\{ppi020\}\{105\}/g,"⪞"],[/\\NestedLessLess /g,"⪡"],[/\\NotNestedLessLess /g,"⪡-00338"],[/\\NestedGreaterGreater /g,"⪢"],[/\\NotNestedGreaterGreater /g,"⪢-00338"],[/\\preceq /g,"⪯"],[/\\not\\preceq /g,"⪯-00338"],[/\\succeq /g,"⪰"],[/\\not\\succeq /g,"⪰-00338"],[/\\precneqq /g,"⪵"],[/\\succneqq /g,"⪶"],[/\\precapprox /g,"⪷"],[/\\succapprox /g,"⪸"],[/\\precnapprox /g,"⪹"],[/\\succnapprox /g,"⪺"],[/\\subseteqq /g,"⫅"],[/\\nsubseteqq /g,"⫅-00338"],[/\\supseteqq /g,"⫆"],[/\\nsupseteqq/g,"⫆-00338"],[/\\subsetneqq /g,"⫋"],[/\\supsetneqq /g,"⫌"],[/\\ElsevierGlyph\{E30D\}/g,"⫫"],[/\\Elztdcol /g,"⫶"],[/\\ElsevierGlyph\{300A\}/g,"《"],[/\\ElsevierGlyph\{300B\}/g,"》"],[/\\ElsevierGlyph\{3018\}/g,"〘"],[/\\ElsevierGlyph\{3019\}/g,"〙"],[/\\openbracketleft /g,"〚"],[/\\openbracketright /g,"〛"]],this}"undefined"!=typeof module&&module.exports&&(module.exports=BibtexParser);