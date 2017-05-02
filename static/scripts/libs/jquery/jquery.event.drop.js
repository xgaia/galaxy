!function(t){t.fn.drop=function(e,a,i){var n="string"==typeof e?e:"",o=t.isFunction(e)?e:t.isFunction(a)?a:null;return 0!==n.indexOf("drop")&&(n="drop"+n),i=(e==o?a:i)||{},o?this.bind(n,i,o):this.trigger(n)},t.drop=function(e){e=e||{},i.multi=!0===e.multi?1/0:!1===e.multi?1:isNaN(e.multi)?i.multi:e.multi,i.delay=e.delay||i.delay,i.tolerance=t.isFunction(e.tolerance)?e.tolerance:null===e.tolerance?null:i.tolerance,i.mode=e.mode||i.mode||"intersect"};var e=t.event,a=e.special,i=t.event.special.drop={multi:1,delay:20,mode:"overlap",targets:[],datakey:"dropdata",noBubble:!0,add:function(e){t.data(this,i.datakey).related+=1},remove:function(){t.data(this,i.datakey).related-=1},setup:function(){if(!t.data(this,i.datakey)){var e={related:0,active:[],anyactive:0,winner:0,location:{}};t.data(this,i.datakey,e),i.targets.push(this)}},teardown:function(){if(!(t.data(this,i.datakey)||{}).related){t.removeData(this,i.datakey);var e=this;i.targets=t.grep(i.targets,function(t){return t!==e})}},handler:function(e,n){var o;if(n)switch(e.type){case"mousedown":case"touchstart":o=t(i.targets),"string"==typeof n.drop&&(o=o.filter(n.drop)),o.each(function(){var e=t.data(this,i.datakey);e.active=[],e.anyactive=0,e.winner=0}),n.droppable=o,a.drag.hijack(e,"dropinit",n);break;case"mousemove":case"touchmove":i.event=e,i.timer||i.tolerate(n);break;case"mouseup":case"touchend":i.timer=clearTimeout(i.timer),n.propagates&&(a.drag.hijack(e,"drop",n),a.drag.hijack(e,"dropend",n))}},locate:function(e,a){var n=t.data(e,i.datakey),o=t(e),r=o.offset()||{},d=o.outerHeight(),l=o.outerWidth(),c={elem:e,width:l,height:d,top:r.top,left:r.left,right:r.left+l,bottom:r.top+d};return n&&(n.location=c,n.index=a,n.elem=e),c},contains:function(t,e){return(e[0]||e.left)>=t.left&&(e[0]||e.right)<=t.right&&(e[1]||e.top)>=t.top&&(e[1]||e.bottom)<=t.bottom},modes:{intersect:function(t,e,a){return this.contains(a,[t.pageX,t.pageY])?1e9:this.modes.overlap.apply(this,arguments)},overlap:function(t,e,a){return Math.max(0,Math.min(a.bottom,e.bottom)-Math.max(a.top,e.top))*Math.max(0,Math.min(a.right,e.right)-Math.max(a.left,e.left))},fit:function(t,e,a){return this.contains(a,e)?1:0},middle:function(t,e,a){return this.contains(a,[e.left+.5*e.width,e.top+.5*e.height])?1:0}},sort:function(t,e){return e.winner-t.winner||t.index-e.index},tolerate:function(e){var n,o,r,d,l,c,s,u,p=0,h=e.interactions.length,m=[i.event.pageX,i.event.pageY],f=i.tolerance||i.modes[i.mode];do{if(u=e.interactions[p]){if(!u)return;u.drop=[],l=[],c=u.droppable.length,f&&(r=i.locate(u.proxy)),n=0;do{if(s=u.droppable[n]){if(d=t.data(s,i.datakey),!(o=d.location))continue;d.winner=f?f.call(i,i.event,r,o):i.contains(o,m)?1:0,l.push(d)}}while(++n<c);l.sort(i.sort),n=0;do{(d=l[n])&&(d.winner&&u.drop.length<i.multi?(d.active[p]||d.anyactive||(!1!==a.drag.hijack(i.event,"dropstart",e,p,d.elem)[0]?(d.active[p]=1,d.anyactive+=1):d.winner=0),d.winner&&u.drop.push(d.elem)):d.active[p]&&1==d.anyactive&&(a.drag.hijack(i.event,"dropend",e,p,d.elem),d.active[p]=0,d.anyactive-=1))}while(++n<c)}}while(++p<h);i.last&&m[0]==i.last.pageX&&m[1]==i.last.pageY?delete i.timer:i.timer=setTimeout(function(){i.tolerate(e)},i.delay),i.last=i.event}};a.dropinit=a.dropstart=a.dropend=i}(jQuery);