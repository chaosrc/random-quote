let sinaURL="http://v.t.sina.com.cn/share/share.php?title=";
let twitterURL="http://twitter.com/share?text=";
let quoteAPI="http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=10";

let nextButton=document.getElementsByClassName('next-quote')[0];
let randomQuote;
(function init(){
  let local=new LocalQuote();
  let http=new HttpQuote(quoteAPI);
  randomQuote=new RandomQuote(http,local);
})();
window.onload=function(){
  let nextColor=getProperRandomColor();
  randomQuote.getQuote(function(q){
    updateView(q,nextColor);

  });
}
nextButton.addEventListener('click',function(e){
   e.preventDefault();
  let nextColor=getProperRandomColor();//generate random color
  // let nextQuote={quote:'<p>You are my lost piece,You are my lost piece</p>', title:'Ai YiLIang'};//TODO:getRandomQuote
  randomQuote.getQuote(function(q){
    updateView(q,nextColor);

  });
});
function getProperRandomColor(){
  let hue= Math.round(Math.random()*100)/100;
  let satu= 0.5+Math.random()*0.4;
  let light= 0.4+Math.random()*0.3;
  let rgb=hslToRGB(hue,satu,light);
  console.log(rgb);
  return rgbToString(rgb);
}
function hslToRGB(h,s,l){
  //TODO:convert hsl to rgb
  let chroma=s*2*(0.5-Math.abs(l-0.5));
  let r=0,g=0,b=0;

  if(h<1/6){
    r=chroma;
    g=h*chroma/6;
  }else if(h<2/6){
    r=(h-1/6)*chroma/6;
    g=chroma;
  }else if(h<3/6){
    g=chroma;
    b=(h-2/6)*chroma/6;
  }else if(h<4/6){
    b=chroma;
    g=(h-3/6)*chroma/6;
  }else if(h<5/6){
    b=chroma;
    r=(h-4/6)*chroma/6;
  }else{
    r=chroma;
    b=(h-5/6)*chroma/6;
  }

  let light=l-0.5*chroma;
  r+=light;
  g+=light;
  b+=light;

  return [Math.round(r*255),Math.round(g*255),Math.round(b*255)]
}
function rgbToString(rgb){
  return  '#'+rgb.map(function(a){
      let hex=a.toString(16);
      if(a<16) hex='0'+hex;
      return hex;
    }).reduce((a,b)=>a+b);
}

 function RandomQuote(httpQuote,localQuote){
   this.httpQuote=httpQuote;
   this.localQuote=localQuote;
 }
 RandomQuote.prototype.getQuote=function(cb){
   let local=this.localQuote;
   let quote=local.getQuote();
   if(quote){
     //if local storige have quote,get one
     cb(quote);
   }
   else{
     //if local storige haven't quote, then get from http
     let http=this.httpQuote;
     http.getQuote(function(json){
       local.setQuote(json);
       cb(local.getQuote());
     },function(error){
       //TODO:when error happen to do something to remind user
     });
   }
 }

 function LocalQuote(){
   this.quoteList=[];
 }
 LocalQuote.prototype.getQuote=function(){
   if(this.quoteList.length>0){
     let r=this.quoteList.shift();
     if(r){
       return {title:r.title,quote:r.content};
     }
    }
 }
 LocalQuote.prototype.setQuote=function(json){
   //get the Qoute according to json data
   this.quoteList=json;
 }
function HttpQuote(url){
  this.url=url;
}
HttpQuote.prototype.getQuote=function(success,error){
  //get quote from `this.url`
  JSONP({
    url:this.url,
    done:success,
    callbackName:'_jsonp'
  });

  // success({title:'http',quote:'I come from the internet'+' '+this.url});
}
function JSONP(option){
  let url=option.url;
  function cb(json){
    option.done(json);
  }
  window.jsonphander=cb;
  url+='&'+(option.callbackName||'callback')+'='+'jsonphander';
  let script=document.createElement('script');
  script.src=url;
  document.body.appendChild(script);
}
let decodeEntities=decodeHTML();
function updateView(quote,color){
  eachElement('body,.quote-actions>div',function(ele){
    ele.style.background=color;
  });
  $(".quote-content,.quote-author").animate({
    opacity:0
  },300,function(){
    $(".quote-content").css({"color":color}).html(quote.quote);
    $(".quote-author").css({"color":color}).html("--"+quote.title);
    $(this).animate({opacity:1},300);
  });
  // let quoteStr=quote.quote.slice(3,-5);
  let quoteStr=quote.quote.match(/<p>(.*)<\/p>/)[1];
  console.log('quote str',quoteStr);
  quoteStr=decodeEntities(quoteStr);
  console.log('quote str',quoteStr);
  let weibo=document.querySelectorAll(".share-weibo")[0];
  weibo.href=sinaURL+encodeURI(quoteStr+"\r\n"+"--"+quote.title);

  let twitter=document.querySelectorAll(".share-twitter")[0];
  twitter.href=twitterURL+encodeURI(quoteStr+"\r\n"+"--"+quote.title);
  // eachElement('.quote-content',function(ele){
  //   ele.innerHTML=quote.quote;
  //   ele.style.color=color;
  // });
  // eachElement('.quote-author>p',function(ele){
  //   ele.innerHTML='-- '+quote.title;
  //   ele.style.color=color;
  // });
}

function decodeHTML(){
  let holder=document.createElement('div');
  return function(str){
    holder.innerHTML=str;
    return holder.innerHTML;
  };
}

function eachElement(selector,cb){
  let eles=document.querySelectorAll(selector);
  if(!eles||eles.length<1) return;
  for(let i=0;i<eles.length;i++){
    cb(eles[i]);
  }
}
