import express from 'express';

const app=express()

// app.get('/',(req,res)=>{
//     res.send("Connected to the server")
// })

app.get('/api/jokes',(req,res)=>{
  //  const jokes="My name is Setu"
    const jokes=[
        {
         id:1,
         title:'First Joke',
         content: 'Why did the chicken cross the road? To get to the other side!'   
        },
        {
         id:2,
         title:'Second Joke',
         content: 'Why don’t scientists trust atoms? Because they make up everything!'
        },
        {
         id:3,
         title:'Third Joke',
         content: 'Why did the scarecrow win an award? Because he was outstanding in his field!'
        }
    ]
    res.send(jokes);
});

const port=process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})