import React from 'react'

function Home(){
   useEfferct(()=>{
      axios.get('http://localhost:3000/')
      .then(res => console.log(res))
      .catch(err => console.log(err));
   }, [])
}

export default Home