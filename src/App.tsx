import React from 'react';
import { Amplify } from 'aws-amplify';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Loader, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import * as AWS from 'aws-sdk';
import awsexports from './aws-exports';

Amplify.configure(awsexports);

export default function App() {

  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [createLivenessApiData, setCreateLivenessApiData] =
    React.useState<any>(null);
  const [accessToken, setAccessToken] = React.useState('');

  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.has('token'))
      setAccessToken(query.get('token') as string);
    else alert('Informe o accesstoken no paramtro token');
  }, [])

  React.useEffect(() => {

    const fetchCreateLiveness = async () => {
      console.log('TOKEN', accessToken)
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
          // setSessionId(data.sessionId);
        })

    };

    if (accessToken)
      fetchCreateLiveness();
  }, [accessToken]);

  const handleAnalysisComplete = async () => {
    console.log('handleAnalysisComplete')
    var rekognition = new AWS.Rekognition();
    var params: any = {
      SessionId: sessionId
    };
    const resp = await rekognition.getFaceLivenessSessionResults(params).promise();
    console.log('FaceLiveness data', resp);
  };

  return (
    <ThemeProvider>
      {loading ? (
        <Loader />
      ) : (
        <FaceLivenessDetector
          disableStartScreen={true}
          sessionId={createLivenessApiData.sessionId}
          region="us-east-1"
          onAnalysisComplete={handleAnalysisComplete}
          onError={(error: any) => {
            console.error('ERROR', error);
          }}
        />
      )}
    </ThemeProvider>
  );
}