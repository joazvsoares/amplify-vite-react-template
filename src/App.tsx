import { useCallback, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Button, Flex, Heading, Icon, Loader, Text, Theme, ThemeProvider, useTheme } from '@aws-amplify/ui-react';
import { MdCheckCircle, MdError } from 'react-icons/md';
import '@aws-amplify/ui-react/styles.css';
import awsexports from './aws-exports';

const dictionary: any = {
  // use default strings for english
  en: null,
  pt: {
    errorLabelText: "Erro",
    connectionTimeoutHeaderText: "Tempo limite de conexão",
    connectionTimeoutMessageText: "A conexão expirou.",
    timeoutHeaderText: "Tempo limite",
    "timeoutMessageText": "O rosto não coube completamente dentro do oval dentro do limite de tempo. Tente novamente e preencha completamente o oval com o rosto dentro dele.",
    "faceDistanceHeaderText": "Movimento para frente detectado",
    "faceDistanceMessageText": "Evite se mover mais perto ao conectar.",
    "multipleFacesHeaderText": "Múltiplos rostos detectados",
    "multipleFacesMessageText": "Certifique-se de que apenas um rosto esteja presente em frente à câmera ao conectar.",
    "clientHeaderText": "Erro do cliente",
    "clientMessageText": "Falha na verificação devido a um problema do cliente",
    "serverHeaderText": "Problema do servidor",
    "serverMessageText": "Não é possível concluir a verificação devido a um problema do servidor",
    "landscapeHeaderText": "Orientação paisagem não suportada",
    "landscapeMessageText": "Gire seu dispositivo para a orientação retrato (vertical).",
    "portraitMessageText": "Garanta que seu dispositivo permaneça na orientação retrato (vertical) durante a duração da verificação.",
    "tryAgainText": "Tentar novamente",
    "cameraMinSpecificationsHeadingText": "Câmera não atende às especificações mínimas",
    "cameraMinSpecificationsMessageText": "A câmera deve suportar uma resolução mínima de 320*240 e 15 quadros por segundo.",
    "cameraNotFoundHeadingText": "Câmera não está acessível.",
    "cameraNotFoundMessageText": "Verifique se uma câmera está conectada e se não há outro aplicativo usando a câmera. Você pode ter que ir para as configurações para conceder permissões de câmera e fechar todas as instâncias do seu navegador e tentar novamente.",
    "a11yVideoLabelText": "Webcam para verificação de autenticidade",
    "cancelLivenessCheckText": "Cancelar verificação de autenticidade",
    "goodFitCaptionText": "Ajuste perfeito",
    "goodFitAltText": "Ilustração do rosto de uma pessoa, encaixando perfeitamente dentro de um oval.",
    "hintCenterFaceText": "Centralize o seu rosto",
    "hintCenterFaceInstructionText": "Instrução: Antes de iniciar a verificação, certifique-se de que sua câmera está no centro do topo da tela e centralize seu rosto para a câmera. Quando a verificação começar, um oval aparecerá no centro. Você será solicitado a se mover para dentro do oval e depois solicitado a ficar parado. Após permanecer parado por alguns segundos, você deve ouvir a verificação completa.",
    "hintFaceOffCenterText": "O rosto não está no oval, centralize seu rosto para a câmera.",
    "hintMoveFaceFrontOfCameraText": "Mova o rosto na frente da câmera",
    "hintTooManyFacesText": "Garanta que apenas um rosto esteja na frente da câmera",
    "hintFaceDetectedText": "Rosto detectado",
    "hintCanNotIdentifyText": "Mova o rosto na frente da câmera",
    "hintTooCloseText": "Afaste-se",
    "hintTooFarText": "Aproxime-se",
    "hintConnectingText": "Conectando...",
    "hintVerifyingText": "Verificando...",
    "hintCheckCompleteText": "Verificação completa",
    "hintIlluminationTooBrightText": "Mova para uma área mais escura",
    "hintIlluminationTooDarkText": "Mova para uma área mais clara",
    "hintIlluminationNormalText": "Condições de iluminação normais",
    "hintHoldFaceForFreshnessText": "Fique parado",
    "hintMatchIndicatorText": "50% concluído. Continue se aproximando.",
    "photosensitivityWarningBodyText": "Esta verificação pisca com cores diferentes. Tenha cuidado se você for sensível à luz.",
    "photosensitivityWarningHeadingText": "Aviso de fotossensibilidade",
    "photosensitivityWarningInfoText": "Algumas pessoas podem ter convulsões epilépticas quando expostas a luzes coloridas. Tenha cuidado se você, ou alguém da sua família, tiver uma condição epiléptica.",
    "photosensitivityWarningLabelText": "Mais informações sobre fotossensibilidade",
    "photosensitivyWarningBodyText": "Esta verificação pisca com cores diferentes. Tenha cuidado se você for sensível à luz.",
    "photosensitivyWarningHeadingText": "Aviso de fotossensibilidade",
    "photosensitivyWarningInfoText": "Algumas pessoas podem ter convulsões epilépticas quando expostas a luzes coloridas. Tenha cuidado se você, ou alguém da sua família, tiver uma condição epiléptica.",
    "photosensitivyWarningLabelText": "Mais informações sobre fotossensibilidade",
    "retryCameraPermissionsText": "Tentar novamente",
    "recordingIndicatorText": "Gravando",
    "startScreenBeginCheckText": "Iniciar verificação de vídeo",
    "tooFarCaptionText": "Muito longe",
    "tooFarAltText": "Ilustração do rosto de uma pessoa dentro de um oval; há uma lacuna entre o perímetro do rosto e os limites do oval.",
    "waitingCameraPermissionText": "Esperando você permitir permissão de câmera."
  },
};

Amplify.configure(awsexports);

export default function App() {

  const { tokens } = useTheme();
  const theme: Theme = {
    name: 'CarteiraIA',
    tokens: {
      colors: {
        background: {
          primary: {
            // value: tokens.colors.neutral['90'].value,
            value: '#058078',
          },
          secondary: {
            // value: tokens.colors.neutral['100'].value,
            value: '#985699',
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
  const [successful, setSuccessful] = useState<boolean | null>(null);
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
          <Button
            colorTheme="error"
            onClick={() => () => window.location.reload()}>Tentar novamente?</Button>
        </Flex>
      </Flex>
    );
  }, [error]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.has('token'))
      setAccessToken(query.get('token') as string);
    else alert('Informe o accesstoken no parametro token');
  }, [])

  useEffect(() => {

    if (successful) {
      setTimeout(() => {
        sendMessageToApp('CLOSE');
      }, 3000);
    }

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

    setSuccessful(false);
  };

  const sendMessageToApp = (message: string) => {
    const ReactNativeWebView = (window as any).ReactNativeWebView;
    console.log('SEND', ReactNativeWebView);
    if (ReactNativeWebView)
      ReactNativeWebView.postMessage(message);
    else window.close();
  }

  return (
    <ThemeProvider theme={theme}>
      {
        successful === true && (
          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{
              backgroundColor: 'white',
              height: '100vh',
              width: '100vw'
            }}
          >
            <Icon height={150} width={150} color={'#058078'} as={MdCheckCircle} />
          </Flex>
        )
      }
      {
        successful === false && (
          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{
              backgroundColor: 'white',
              height: '100vh',
              width: '100vw'
            }}
          >
            <Icon height={150} width={150} color={'red'} as={MdError} />
            <Heading color={'red'}>Não foi possível analisar seu rosto!</Heading>
            <Flex
              gap={'1rem'}
              marginTop={20}
              direction="row">
              <Button
                colorTheme="info"
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </Button>
              <Button
                colorTheme="error"
                loadingText=""
                onClick={() => sendMessageToApp('CLOSE')}
              >
                Cancelar
              </Button>
            </Flex>
          </Flex>
        )
      }
      {
        successful === null && (
          loading ? (
            <Loader filledColor="white" />
          ) : (
            <FaceLivenessDetector
              disableStartScreen={true}
              sessionId={createLivenessApiData.sessionId}
              region="us-east-1"
              onAnalysisComplete={handleAnalysisComplete}
              displayText={dictionary['pt']}
              onUserCancel={() => sendMessageToApp('CLOSE')}
              onError={(error) => {
                console.log('ERR', error)
                setError(error);
              }}
              components={{
                ErrorView: CustomError,
              }}
            />

          )
        )
      }
    </ThemeProvider>
  );
}