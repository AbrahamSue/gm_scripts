// ==UserScript==
// @name        NewSMTH
// @namespace   newsmth
// @include     http://m.newsmth.net/*
// @version     1
// @grant       none
// ==/UserScript==

//test which page we are
//
//
//
//

var request_pct = 0.30
var old_scrollY = 0;
var scroll_events = 0;
//window.addEventListener("scroll", onScroll, false);

function objShow(o, container){
	var s = "";
	if (typeof container == 'undefined') container = document.body;
	if(typeof o.length == 'undefined')
	  s = o;
	else for (i in o) {
		 s += "[ <font style='color:#2255FF'>" + i + "</font> ] = " + o[i] + "<br/>";
	}
	var d = document.createElement("DIV")
	d.innerHTML = "Objshow:<br/>";
	d.innerHTML += s;
	d.style = 'font-size: 8pt';
	container.insertBefore(d, container.firstChild)
}
function CONSOLE(container) {
  this.container = container || document.body;
  this.div = document.createElement("DIV");
  this.div.style = 'color:#1111FF; font-size: 7pt;';
  this.container.insertBefore(this.div, this.container.firstChild);
  this.log = function () {
	    var s = "";
		if(this.div == undefined) return -1;
		for(i = 0; i < arguments.length; i++ ){
                  var o = arguments[i];
                  if(typeof o == 'array') for (j=0; j<o.length; j++) 
                    s += o[j];
		  else if(typeof o == 'undefined' || o == null)
                    s += "<br/>";
                  else
                    s += arguments[i];
		}
		s += "<br/>";
		this.div.innerHTML += s;
        return 0;
  }
  return this;
}
var console = new CONSOLE();
var gOldOnError = window.onerror;
// Override previous handler.
window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
  alert(lineNumber);
  console.log( "ERROR@", url, ":", lineNumber, "&nbsp;&nbsp;", errorMsg);
  if (gOldOnError)
    // Call previous handler.
    return gOldOnError(errorMsg, url, lineNumber);

  // Just let default handler run.
  return false;
}

var rArticle = /m.newsmth.net\/article/;
var rBoard = /m.newsmth.net\/board/;
var rCommentInfo = />[^<>\(\)]*\([0-9]+\)/m
var rNumber = /[0-9]+/
//alert(document.URL);
//
appendNextPage();

if( document.URL == 'http://m.newsmth.net/' || rBoard.test(document.URL) ) {
  var tli = document.getElementsByTagName("LI");
  for ( i in tli ) {
	  var tdiv, res;
	  tdiv = tli[i].getElementsByTagName("DIV");
//    tli[i].innerHTML += "<br/>tdiv.length = " + tdiv.length;
//	  tli[i].innerHTML += "<br/>tdiv[0].innerHTML = " + tdiv[0].innerHTML;
//	  tli[i].innerHTML += "<br/>tdiv[0].lastChild = " + tdiv[0].lastChild.wholeText;
//	  objShow(tdiv[0].lastChild);
//	  res = ( tdiv.length == 0 )? "" : rCommentInfo.exec(tdiv[0].innerHTML);
//      tli[i].innerHTML += "<br/>res = " + res;
	  res = (tdiv.length == 0)?0:rNumber.exec (tdiv[0].lastChild.wholeText);
//        tli[i].innerHTML += "<br/>res = " + res;
      page = Math.floor(res / 10) + 1 - 1;
	  page_max = 30;
	  if(page > page_max){
		  step = Math.floor( page / page_max + 1 );
	  }else{
		  step = 1;
	  }
      s = "&nbsp;&nbsp;"; //"<div align=right width=*>"
	  for( j = 2; res > 10 ; j += step, res -= 10 * step ) {
          s += "<a href=\"" + tdiv[0].firstChild.href + "?p=" + j + "\">" + j + "</a>&nbsp;"
	  }
//	  s += "</div>"
      tdiv[0].innerHTML += s;
  }
}


if( rArticle.test(document.URL) ) {
    var rRef = /【.*<\/div>/mi ;
    var tdiv = document.getElementsByClassName("sp");
    var s;
    for ( i in tdiv ) {
      s = tdiv[i].innerHTML;
      if(typeof s == 'undefined') continue;
//		alert(s.search("【"));
//		Move all link to main site to m.newsmth.net
      s = s.replace(/http:\/\/www.newsmth.net\/nForum\/#!/g, "http://m.newsmth.net/");
//      Change to large image					
      s = s.replace(/\/middle"/g, "\"");
//      Image link to <img
      function fReplaceImgTag(s, g1, g2){
            return "<img src=\"" + g1 + "\"/>";
      };
      s = s.replace(/(http:\/\/[^"'<>]+\.(jpg|jpeg|gif|png))/g, fReplaceImgTag);
      s = s.replace("【", "<div style='color:#888888'>【");
      s += "</div>";
      tdiv[i].innerHTML = s;
   }

//expand louzhu's history
    tdiv = document.getElementsByClassName("nav hl");
//   objShow(tdiv);
    if( typeof tdiv.length !== 'undefined' ){
      var a = tdiv[0].getElementsByTagName("A");
      if(typeof a.length !== 'undefined' && a.length > 1){
//        console.log(a[1].href, a[1].text);
        getAuthorPictures(a[1].text, tdiv[0]);
      }
    }
}

function appendNextPage(){
  var link;
  var fs = document.getElementsByTagName("FORM");
  for( fk = 0; fk < fs.length; fk ++ ){
	var f = fs[fk];
//	console.log("fs[ ", fk, " ] = ", fs[fk]);
    var a = f.getElementsByTagName("A");
//	console.log("a.length = ", a.length);
    for(i = 0; i < a.length; i++){
	//  console.log(i, " ", a[i].text, " ", a[i].href);
      if(a[i].text == "下页") {
	    link = a[i].href;
        pn = link.match(/[0-9]+$/);
		pn ++;
		a[i].href = link.replace(/[0-9]+$/, pn);
//		console.log("i=", i, " link=", link, " pn=", pn);
      }
	  if(a[i].text == "上页") {
	    pn = a[i].href.match(/[0-9]+$/);
	    pn = (pn>1)?(pn-1):1;
	    a[i].href = a[i].href.replace(/[0-9]+$/, pn);
	  }
    }
  }
//  console.log(link);
//  objShow(GM_info);
//  objShow(XMLHttpRequest);
  var xmlhttp = new XMLHttpRequest();
//  xmlhttp.onreadystatechange=function(){ console.log(xmlhttp.readyState, xmlhttp.status); return 0;};
  xmlhttp.onload=function(res){
//	objShow(res);
	s = this.responseText.replace(/^.*<ul class="list sec">/m, "");
	s = s.replace(/<\/ul>.*$/m, "");
	var tul = document.getElementsByClassName("list sec");
	tul[0].innerHTML += s;
  }
  xmlhttp.open("GET", link, true);
  xmlhttp.send();
}

function getAuthorPictures(author, container){
	var today = new Date();
	var link = "http://ar.newsmth.net/searchArticle.do?subject=&boardname=&body=&start=19980101&sbyt=true&aonly=true&end=";
        link += today.getFullYear();
	link += (today.getMonth() < 9)?"0":"";
        link += (today.getMonth() + 1);
        link += ((today.getDate() < 10)?"0":"" + today.getDate());
        link += ( "&author=" + author);
        //console.log("link=", link, null, "container=", container);
	var xmlhttp = new XMLHttpRequest();
 //       xmlhttp.container = container;
//        xmlhttp.onreadystatechange=function(){ console.log(xmlhttp.readyState, xmlhttp.status); return 0;};
	xmlhttp.onload = function(res){
          alert(this.responseText);
	  images = this.responseText.match(/<img [^<>]+>/g);
          //console.log(images);
	};
	xmlhttp.open("GET", link, true);
	xmlhttp.send();
}

//document.body.onscroll = function() {  return true; }
//window.addEventListener("scroll", onScroll, false);

function onScroll(e) {
  var y = window.scrollY;
  // if (scroll_events === 0) old_scrollY = y; // stops only if scroll position was on 2. page
  document.innerHTML += "<br/>" + y + "<br/>"
  var delta = e.deltaY || y - old_scrollY; // NOTE: e.deltaY for "wheel" event
  if (delta > 0 && (window.innerHeight + y) >= (document.body.clientHeight - (window.innerHeight * request_pct))) {
	  alert(document.getElementByTagName("form"));
    window.removeEventListener("scroll", onScroll, false);
    try {
      requestNextPage(next_link || document.getElementByTagName("form")[1].firstChild.href);
    } catch (err) {
      console.error(err.name + ": " + err.message);
      // NOTE: recovery unnecessary, input event handles it with reset on new search
    }
  }
  old_scrollY = y;
  scroll_events += 1;
}

