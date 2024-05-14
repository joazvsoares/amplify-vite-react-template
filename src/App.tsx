import React from 'react';
import { Amplify } from 'aws-amplify';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Loader, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsexports from './aws-exports';

Amplify.configure(awsexports);
const TOKEN: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJkMzc0ZjllOC0xNjliLTQxYjktYjYxYi0zN2I3MjA0OGYwYjkiLCJ1c2VySWQiOiJkMzc0ZjllOC0xNjliLTQxYjktYjYxYi0zN2I3MjA0OGYwYjkiLCJ0ZW5hbnRJZCI6IjA2Y2YyODJjLWNiMGYtNDAyMC1iMmZhLTI5YzE0Y2RmZjM4ZiIsImF1dGhUeXBlIjoibHVrYXMuZnJlaXJlMjAxMUBnbWFpbC5jb20iLCJpYXQiOjE3MTU2OTY3ODQsImV4cCI6MTcxNTc4MzE4NH0.npsqXMHGaIdvVo8ZlNT1kdKHW5A2iT9gRxy6RAGj2FE';

export default function App() {

  const [loading, setLoading] = React.useState(true);
  const [createLivenessApiData, setCreateLivenessApiData] =
    React.useState<any>(null);
  const [accessToken, setAccessToken] = React.useState('');

  React.useEffect(() => {
    setAccessToken(TOKEN);
  }, [])

  React.useEffect(() => {
    console.log('TOKEN 1', accessToken)
    const fetchCreateLiveness = async (accessToken: string) => {
      console.log('TOKEN 2', accessToken)
      fetch(
        'https://backend-api-stage.carteiraia.com/api/liveness/session',
        {
          method: 'GET',
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

    if (accessToken)
      fetchCreateLiveness(accessToken);
  }, [accessToken]);

  const handleAnalysisComplete = async () => {
    console.log('handleAnalysisComplete')
  };

  return (
    <ThemeProvider>
      {loading ? (
        <Loader />
      ) : (
        <FaceLivenessDetector
          disableStartScreen={true}
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