// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";

// const client = generateClient<Schema>();

// function App() {
//   const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

//   useEffect(() => {
//     client.models.Todo.observeQuery().subscribe({
//       next: (data) => setTodos([...data.items]),
//     });
//   }, []);

//   function createTodo() {
//     client.models.Todo.create({ content: window.prompt("Todo content") });
//   }

//   return (
//     <main>
//       <h1>My todos</h1>
//       <button onClick={createTodo}>+ new</button>
//       <ul>
//         {todos.map((todo) => (
//           <li key={todo.id}>{todo.content}</li>
//         ))}
//       </ul>
//       <div>
//         🥳 App successfully hosted. Try creating a new todo.
//         <br />
//         <a href="https://next-release-dev.d1ywzrxfkb9wgg.amplifyapp.com/react/start/quickstart/vite-react-app/#step-2-add-delete-to-do-functionality">
//           Review next step of this tutorial.
//         </a>
//       </div>
//     </main>
//   );
// }

// export default App;

import React from 'react';
import { Amplify } from 'aws-amplify';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Loader, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsexports from './aws-exports';

Amplify.configure(awsexports);
const TOKEN: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJkMzc0ZjllOC0xNjliLTQxYjktYjYxYi0zN2I3MjA0OGYwYjkiLCJ1c2VySWQiOiJkMzc0ZjllOC0xNjliLTQxYjktYjYxYi0zN2I3MjA0OGYwYjkiLCJ0ZW5hbnRJZCI6IjA2Y2YyODJjLWNiMGYtNDAyMC1iMmZhLTI5YzE0Y2RmZjM4ZiIsImF1dGhUeXBlIjoibHVrYXMuZnJlaXJlMjAxMUBnbWFpbC5jb20iLCJpYXQiOjE3MTU2ODI1MDIsImV4cCI6MTcxNTc2ODkwMn0.QLcS9kobvwzkqZ6KRFTkjKWtAoO5P459cBh2won9uDY';

export default function App() {

  const [loading, setLoading] = React.useState(true);
  const [createLivenessApiData, setCreateLivenessApiData] =
    React.useState<any>(null);
  const [accessToken, setAccessToken] = React.useState('');

  React.useEffect(() => {
    setAccessToken(TOKEN);
    const fetchCreateLiveness = async () => {
      /*
       * This should be replaced with a real call to your own backend API
       */

      fetch(
        'https://backend-api-stage.carteiraia.com/api/liveness/session',
        {
          headers: {
            'Authorization': accessToken
          }
        })
        .then((response: any) => {

          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          return response.json();
        })
        .then((data: any) => {
          setCreateLivenessApiData(data);
          setLoading(false);
        })

    };

    fetchCreateLiveness();
  }, []);

  const handleAnalysisComplete = async () => {
    // const response = await fetch(
    //   `/api/get?sessionId=${createLivenessApiData.sessionId}`
    // );
    // const data = await response.json();

    // if (data.isLive) {
    //   console.log('User is live');
    // } else {
    //   console.log('User is not live');
    // }
    console.log('handleAnalysisComplete')
  };

  return (
    <ThemeProvider>
      {loading ? (
        <Loader />
      ) : (
        <FaceLivenessDetector
          sessionId={createLivenessApiData.sessionId}
          region="sa-east-1"
          onAnalysisComplete={handleAnalysisComplete}
          onError={(error: any) => {
            console.error('ERROR', error);
          }}
        />
      )}
    </ThemeProvider>
  );
}