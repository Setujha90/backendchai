import { useState ,useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios.get('/api/jokes')
      .then(response => {
        setJokes(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the jokes!", error);
      });
  },[])

  return (
    <>
      <h1>Jokes Section</h1>
      <p> JOKES:{jokes.length}</p>
      {
        jokes.map((joke, index) => (
          <div key={joke.id}>
            <h2>{joke.title}</h2>
            <p>{joke.content}</p>
          </div>
        ))  
      }
      
    </>
  )
}

export default App
