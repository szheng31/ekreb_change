import { useState, useEffect } from 'react';
import { Input, Button, notification } from 'antd';
import axios from 'axios';



function Game () {
    
    
    const [word, setWord] = useState("");
    const [score, setScore] = useState(0);
    const [guess, setGuess] = useState("");
    const [hint,setHint] = useState("N/A");
    const [scramWord, setScramWord] = useState("");
    const [sec, setSec] = useState(5);

    useEffect(() => { 
        
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/getWord',
            headers: { }
          };
        
        if (word == "") {
            
            axios.request(config)
            .then((response) => {
                console.log("here");
                setWord(response.data);
                getScrambled(response.data);
                saveWord(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
            
        }
        
        
    });

    useEffect(() => {
        const interval = setInterval(() => setSec(sec-1),1000);

        gameOver();
        return () => clearInterval(interval);
    })
    
    const gameOver = () => {
        var hide = document.getElementById("play");
        var stats = document.getElementById("stats");
        if (sec <= 0) {
            hide.style.display = "none";
            stats.style.display = "block";
        } 
        else {
            var hide = document.getElementById("play");
            hide.style.display = "block";
            stats.style.display = "none";
        }
    
    }
    
    const skipWord = () => {
        
        setWord("");
        
        setScramWord("");

        var x = document.getElementById("hints");
        if (x.style.display === "block") {
            x.style.display = "none";
        }
    }

    const restartGame = () => {

        setWord("");
        setScore(0);
        setGuess("");
        setHint("N/A");
        setScramWord("");
        setSec(60);

        console.log("restartGame")
    }
    
    const saveWord = (word) => {

        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/saveWord?word=' + word,
        headers: { }
        };

        axios.request(config)
            .then((response) => {
                
            })
            .catch((error) => {
                console.log(error);
        });
    }

    const getScrambled = (word) => {

        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/scrambleWord?word=' + word,
        headers: { }
        };

        axios.request(config)
            .then((response) => {
                setScramWord(response.data);
            })
            .catch((error) => {
                console.log(error);
        });
    }

    const getHint = () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/getHint',
            headers: { }
          };
          
          axios.request(config)
          .then((response) => {
            var x = document.getElementById("hints");
            if (x.style.display === "none") {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }


            
            
            
            setHint(response.data['definitions'][0]['definition']);
            console.log("data: " + response.data['definitions'][0]['definition']);
          })
          .catch((error) => {
            console.log(error);
          });
    }

    const handleSubmit = () => {
        let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `http://localhost:3000/guessWord?word=${guess}`,
        headers: { }
        };
        
        
        axios.request(config)
            .then((response) => {
                if(response.data === true) {
                    setScore(score + 1);
                    notification.success({
                        message: "Correct!",
                        description: "You guessed the word correctly!",
                        placement: "bottomRight",
                        duration: 2
                    });
                    setWord("");
                    setScramWord("");
                    setHint("N/A");
                    var x = document.getElementById("hints");
                    if (x.style.display === "block") {
                        x.style.display = "none";
                    }
                } else {
                    notification.error({
                        message: "Incorrect!",
                        description: "You guessed the word incorrectly!",
                        placement: "bottomRight",
                        duration: 2
                    });
                }
                setGuess("");
                
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const hints = {
        display: 'none'
    }
    

    return <div className="card" >

        <div id="play">
       <h1>{sec}</h1>
        <h2> Current Word: {word} </h2>
        <h2> Scrambled Word: {scramWord} </h2>
        <Input size="large" placeholder="Enter your guess"
            onChange={(input) => {setGuess(input.target.value); }}
            value={guess} />
        <br /> <br />


        <Button type="primary" size="large" onClick={handleSubmit}>Submit</Button>
        <Button type="primary" size="large" onClick={getHint}>Get Hint</Button>
        <Button type="primary" size="large" onClick={skipWord}>Skip Word</Button>
        <h4  style={hints} id="hints" >Definition: {hint}</h4>
        <p> Score: {score} </p>
    </div>

    <div id="stats">
        <h1>Final Score: {score} </h1>
        <Button type="primary" size="large" onClick={restartGame}> Start Over? </Button>
    </div>
    </div>
        
    
    
}

export default Game;