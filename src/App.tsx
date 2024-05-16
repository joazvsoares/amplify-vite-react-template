import React, { useCallback, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Button, Flex, Heading, Icon, Loader, Text, Theme, ThemeProvider, useTheme } from '@aws-amplify/ui-react';
import { MdCheckCircle } from 'react-icons/md';
import '@aws-amplify/ui-react/styles.css';
import awsexports from './aws-exports';

const dictionary: any = {
  // use default strings for english
  en: null,
  pt: {
    photosensitivyWarningHeadingText: 'Advertencia de fotosensibilidade',
    photosensitivyWarningBodyText:
      'Esta verificação mostra luzes coloridas. Tenha cuidado se você é fotossensível.',
    goodFitCaptionText: 'Bom encaixe',
    tooFarCaptionText: 'Longe demais',
    hintCenterFaceText: 'Centralize seu rosto',
    startScreenBeginCheckText: 'Começar a verificação',
  },
};

Amplify.configure(awsexports);

export default function App() {

  const { tokens } = useTheme();
  const theme: Theme = {
    name: 'Face Liveness Example Theme',
    tokens: {
      colors: {
        background: {
          primary: {
            value: tokens.colors.neutral['90'].value,
          },
          secondary: {
            value: tokens.colors.neutral['100'].value,
          },
        },
        font: {
          primary: {
            value: tokens.colors.white.value,
          },
        },
        brand: {
          primary: {
            '10': tokens.colors.teal['100'],
            '80': tokens.colors.teal['40'],
            '90': tokens.colors.teal['20'],
            '100': tokens.colors.teal['10'],
          },
        },
      },
    },
  };
  // const [/*sessionId,*/ setSessionId] = React.useState<string | null>(null);
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createLivenessApiData, setCreateLivenessApiData] = useState<any>(null);
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState<any>(undefined);
  const CustomError = useCallback(() => {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
      >
        <Flex
          backgroundColor="white"
          direction="column"
          justifyContent="center"
          padding="32px"
        >
          <Heading color="black">{error?.state}</Heading>
          <Text>{error?.error.message}</Text>
          <Button>Try again?</Button>
        </Flex>
      </Flex>
    );
  }, [error]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.has('token'))
      setAccessToken(query.get('token') as string);
    else alert('Informe o accesstoken no paramtro token');
  }, [])

  useEffect(() => {


  }, [successful])

  useEffect(() => {

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
    console.log('handleAnalysisComplete');
    // var rekognition = new Rekognition();
    // var params: any = {
    //   SessionId: sessionId
    // };
    // const resp = await rekognition.getFaceLivenessSessionResults(params).promise();
    // console.log('FaceLiveness data', resp);
    setSuccessful(true);
  };

  return (
    <ThemeProvider theme={theme}>

      {
        successful ? <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{
            backgroundColor: 'white',
            flex: 1
          }}
        >
          <Icon height={50} width={50} as={MdCheckCircle} />
        </Flex>
          : loading ? (
            <Loader />
          ) : (
            <FaceLivenessDetector
              disableStartScreen={true}
              sessionId={createLivenessApiData.sessionId}
              region="us-east-1"
              onAnalysisComplete={handleAnalysisComplete}
              displayText={dictionary['pt']}
              onError={setError}
              components={{
                ErrorView: CustomError,
              }}
            />
          )
      }
    </ThemeProvider>
  );
}