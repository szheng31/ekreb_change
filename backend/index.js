
const axios = require('axios')
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000; // May need to change PORT to something else if 3000 is already in use

app.use(cors());

let score = 0;
let counter = 0;
let word = "";

async function getWord(word) {
    let request = "";
    await axios.get("https://random-word-api.herokuapp.com/word")
    .then((response) => request = response.data[0])
    .catch((err) => console.log(err));
    return request;
}

async function getHint(word) {
    const options = {
        method: 'GET',
        url: `https://wordsapiv1.p.rapidapi.com/words/${word}/definitions`,
        headers: {
          'X-RapidAPI-Key': 'efb99507e2msh407efe5f14c5ce9p140be1jsn91d4caa7a5bc',
          'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
        }
      };
      
      try {
          const response = await axios.request(options); return response.data;
          
      } catch (error) {
          console.error(error);
      }
      
}
app.get('/hello', (req, res) => {
    res.send('hello world!');
});

app.get('/score', (req, res) => {
    res.send(`${score}`);
});

app.patch('/score', (req, res) => {
    score += parseInt(req.query.val);
    res.status(200).send(`${score}`);
})

app.get('/getWord', async (req, res) => {
    const request = await getWord();
        
    
    console.log("request: " + request);

    res.send(request);
    
    
})


app.get('/saveWord', (req,res) => {
    
    let q = req.query.word;
    console.log("recieved saveWord: " + q);
    word = q;
})

app.get('/word', (req,res) => {
    res.send(word);
})

app.get('/getHint', async (req,res) => {
    console.log("word: " + word);
    const requestHint = await getHint(word);

    res.send(requestHint);
})

app.get('/scrambleWord', (req,res) => {
    let q = req.query.word;
    
    let letters = q.split("");
    let scrambledWord = "";
    while (letters.length > 0) {
        randIndex = Math.floor(Math.random() * (letters.length));
        scrambledWord += letters[randIndex];
        letters.splice(randIndex,1);
    }
    
    console.log("scrambleword:" + word);
    res.send(scrambledWord);
 })


app.patch('/guessWord', (req, res) => {
    console.log(req.query.word);
    console.log("currentWord: " + word);
    if(req.query.word === word) {
        res.status(200).send('true');
    } else {
        res.status(200).send('false');
    }
})

app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});