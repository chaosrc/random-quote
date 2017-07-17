const express=require('express');
const app=express();

let path='/home/chao/fcc-app/RandomQuote/';

// app.get('/',(req,res)=>{
//   res.sendFile(path+'index.html');
// });
app.use(express.static('.'));

let server=app.listen(3000,function(){
  console.log(`server start at http://${server.address().address}:${server.address().port}`);
});
