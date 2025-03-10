import { Box, Button, Text, TextField, Image, Icon } from '@skynexui/components';
import React from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';



  function Titulo(props) {
    const Tag = props.tag || 'h1';
    return (
      <>
        <Tag>{props.children}</Tag>

        <style jsx>{`
              ${Tag} {
                  color: ${appConfig.theme.colors.neutrals['300']};
                  font-size: 24px;
                  font-weight: 600;
              }
              `}</style>
      </>
    );
  }


  export default function PaginaInicial() {
    //const username = 'starbucks';
    const [username, setUsername] = React.useState('');
    const [caminhoFoto, setCaminhoFoto] = React.useState(`https://github.com/starbucks.png`);
    const [userRepos, setUserRepos] = React.useState();
    const [userFollowers, setUserFollowers] = React.useState();
    const [personName, setPersonName] = React.useState();
    const roteamento = useRouter();
    
    
    /* Para brincar com os dados da API do GitHub depois*/ 
 
    React.useEffect(() => {
      fetch(`https://api.github.com/users/${username}`)
        .then(async (respostaDoServidor) => {

            let userData = await respostaDoServidor.json();
            //console.log(userData);
            const userRepos = userData.public_repos;
            const userFollowers = userData.followers;
            const personName = userData.name;            
            setUserRepos(userRepos);
            setUserFollowers(userFollowers);
            setPersonName(personName);
        });
    });

    return (
      <>        
     
        <Box
          styleSheet={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',           
            backgroundImage: 'url(https://www.teahub.io/photos/full/234-2342897_starbucks-free-powerpoint-image-starbuck-background.jpg)',
            backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
          }}
        >
          <Box
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              width: '100%', maxWidth: '700px',
              borderRadius: '25px', padding: '32px', margin: '16px',
              boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
              backgroundColor: appConfig.theme.colors.neutrals[700],
            }}
          >
            {/* Formulário */}
            <Box
              as="form"
              onSubmit={
                function (infosDoEvento) {
                  infosDoEvento.preventDefault(); //nao deixa pagina recarregar

                  if(username.length > 2 && username.indexOf(" ") == -1 ){
                    roteamento.push(`/chat?username=${username}&personName=${personName}`); //usando useRouter do Next
                  }
                  // window.location.href = '/chat';
                }}
              styleSheet={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
              }}
            >
              <Titulo tag="h2">Grab A Coffe. Let's Chat.</Titulo>
              <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                {appConfig.name}
              </Text>
  
              <TextField
                placeholder='GitHub Account'
                value={username}
                onChange={function (event) {                  
                  // Onde ta o valor?
                  const valor = event.target.value;
                  
                  // Trocar o valor da variavel
                  // através do React e avise quem precisa
                  setUsername(valor);
                 
                  if (valor.length > 2 && valor.indexOf(" ") == -1) {                    
                    setCaminhoFoto(`https://github.com/${valor}.png`);                                          
                  } else {
                    setCaminhoFoto(`https://github.com/starbucks.png`);  
                  }                       
                }}
                fullWidth                
                textFieldColors={{
                  neutral: {
                    textColor: appConfig.theme.colors.neutrals[300],
                    mainColor: appConfig.theme.colors.neutrals[900],
                   mainColorHighlight: appConfig.theme.colors.primary[500],
                    backgroundColor: appConfig.theme.colors.neutrals[800],
                  },
                }}
              />
              <Button
                type='submit'
                label='Entrar'
                fullWidth
                buttonColors={{
                  contrastColor: appConfig.theme.colors.neutrals["000"],
                  mainColor: appConfig.theme.colors.primary[500],
                  mainColorLight: appConfig.theme.colors.primary[400],
                  mainColorStrong: appConfig.theme.colors.primary[600],
                }}
              />
            </Box>
            {/* Formulário */}
  
  
            {/* Photo Area */}
            <Box
              styleSheet={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '200px',
                padding: '16px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                border: '1px solid',
                borderColor: appConfig.theme.colors.neutrals[999],
                borderRadius: '10px',
                flex: 1,
                minHeight: '240px',
              }}
            >
              <Image
                styleSheet={{
                  borderRadius: '50%',
                  marginBottom: '16px',
                }}
                src={caminhoFoto}                   
                    
              />
              <Text
                variant="body4"
                styleSheet={{
                  color: appConfig.theme.colors.neutrals[200],
                  backgroundColor: appConfig.theme.colors.neutrals[900],
                  padding: '3px 10px',
                  borderRadius: '1000px'
                }}
              >
                
                  {(!username) //if ternario
                        ? (
                          "GitHub Account"
                        )
                        : (
                          (!personName) ? username : personName
                        )}
              </Text>

                           
              <Text
                variant="body4"
                styleSheet={{
                  color: appConfig.theme.colors.neutrals[200],
                  backgroundColor: appConfig.theme.colors.neutrals[900],
                  padding: '3px 10px',
                  borderRadius: '1000px',
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>

                <Icon
                  label="Icon Component"
                  name="FaUserFriends"
                  size={"2.5ch"}
                  styleSheet={{
                    display: 'inline-block',
                    marginRight: '5px'
                  
                  }}
                  />
                
                 <span>{userFollowers} &nbsp;</span>


                 <Icon
                  label="Icon Component"
                  name="FaCode"
                  size={"2.5ch"}
                  styleSheet={{
                    display: 'inline-block',
                    marginRight: '5px'}}
                  />
                 <span>{userRepos}</span>
              </Text>
              
            </Box>
            {/* Photo Area */}
          </Box>
        </Box>
      </>
    );
  }