function LocalQuote(){
  this.quoteList=[{quote:'<p>You are my lost piece,You are my lost piece1</p>', title:'Ai YiLIang'},
                  {quote:'<p>You are my lost piece,You are my lost piece2</p>', title:'Ai YiLIang'},
                  {quote:'<p>You are my lost piece,You are my lost piece3</p>', title:'Ai YiLIang'}
                 ];
}
LocalQuote.prototype.getQuote=function(){
  if(this.quoteList.length>0){
    let r=this.quoteList.shift()
     console.log(this.quoteList[0])
    return r;
   }
}
LocalQuote.prototype.setQuote=function(json){
  //get the Qoute according to json data
  this.quoteList.push(json);
}

function RandomQuote(httpQuote,localQuote){
  this.httpQuote=httpQuote;
  this.localQuote=localQuote;
}
RandomQuote.prototype.getQuote=function(cb){
  cb(this.localQuote.getQuote());
}


function Test(local){
  this.local=local;
}
Test.prototype.get=function(cb){
  cb(this.local.getQuote());
}

let t=new RandomQuote('',new LocalQuote());
t.getQuote(()=>{});
t.getQuote(()=>{});
