import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components';
import React from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

// Como fazer AJAX: https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQzMzMzNDc4LCJleHAiOjE5NTg5MDk0Nzh9.NqE_SOxfGXuhPuc8_0ZgbzcHpcJURKXUdWuLQBTz6rA';
const SUPABASE_URL = 'https://ggnrubnjgjjbfgjxolxw.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


//listening to real time changes on Supabase DB
//https://supabase.com/docs/reference/javascript/subscribe
function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
      .from('messages')
      .on('INSERT', (respostaLive) => {
        adicionaMensagem(respostaLive.new);
      })
      .subscribe();
  }
   

  export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    const [isLoaded, setIsLoaded] = React.useState(false);
    

    // const dadosGitHub = fetch(`https://api.github.com/users/${usuarioLogado}`)
    // .then(async (respostaDoServidor) => {
    //   const respostaEsperada = await respostaDoServidor.json();
    //   console.log(respostaEsperada)
    // })     

    React.useEffect(() => {

        supabaseClient
            .from('messages')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
            //console.log('Dados da consulta:', data);
            // console.log('Dados da consulta:', data);
            setListaDeMensagens(data);
            setIsLoaded(true);
            });
    
        const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
            //console.log('Nova mensagem:', novaMensagem);
            // console.log('listaDeMensagens:', listaDeMensagens);
        
            setListaDeMensagens((valorAtualDaLista) => {
            console.log('valorAtualDaLista:', valorAtualDaLista);
            return [
                novaMensagem,
                ...valorAtualDaLista,
            ]
            });
        });
    
        return () => {
            subscription.unsubscribe();
        }
    }, []);

    function handleNovaMensagem(novaMensagem) {
        
        if (novaMensagem !== ''){

            const mensagem = {
                //id: listaDeMensagens.length + 1,
                de: usuarioLogado,
                texto: novaMensagem,
            };
            //insere no DB mas nao atualiza mais a lista de mensagens em exibicao
            supabaseClient
                .from('messages')
                .insert([
                // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
                mensagem
            ])
                .then( ({ data }) => {
                    //console.log('Criando mensagem: ', data);                     
            });
    
            setMensagem('');
        }
        


    }


    if(!isLoaded) {
        return (

                <>
                <style global jsx>{`
                    .loading-image {
                        max-width: 400px;
                        max-height: 400px;                        
                    }                  
                    
                `}</style>

                <Box
                    styleSheet={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundImage: `url(https://www.teahub.io/photos/full/234-2342897_starbucks-free-powerpoint-image-starbuck-background.jpg)`,
                        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                        color: appConfig.theme.colors.neutrals['000']
                        
                    }}

                    
                >

                <Image src="https://i.pinimg.com/originals/72/62/1b/72621b891df2ca6a247ce630797797aa.jpg" className='loading-image' />

                </Box>
        </>
        )
    }


    if (isLoaded){
        
        return (      
        
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundImage: `url(https://www.teahub.io/photos/full/234-2342897_starbucks-free-powerpoint-image-starbuck-background.jpg)`,
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                    color: appConfig.theme.colors.neutrals['000']
                }}        >
                
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                            borderRadius: '5px',
                            backgroundColor: appConfig.theme.colors.neutrals[700],
                            height: '100%',
                            maxWidth: '95%',
                            maxHeight: '95vh',
                            padding: '32px',
                        }}
                    >
                        <Header />
                        <Box
                            styleSheet={{
                                position: 'relative',
                                display: 'flex',
                                flex: 1,
                                height: '80%',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                flexDirection: 'column',
                                borderRadius: '5px',
                                padding: '16px',
                                maxWidth: '95vw'
                            }}               >
                            
                            <MessageList mensagens={listaDeMensagens} 
                            
                            />
                                {/* {listaDeMensagens.map((mensagemAtual) => {
                                return (
                                    <li key={mensagemAtual.id}>
                                        {mensagemAtual.de}: {mensagemAtual.texto}
                                    </li>
                                )
                            })} */}
                            <Box
                                as="form"
                                styleSheet={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <TextField
                                    value={mensagem}
                                    onChange={(event) => {
                                        const valor = event.target.value;
                                        setMensagem(valor);
                                    } }
                                    onKeyPress={(event) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                            handleNovaMensagem(mensagem);
                                        }
                                    } }
                                    placeholder="Insira sua mensagem aqui..."
                                    type="textarea"
                                    styleSheet={{
                                        width: '100%',
                                        border: '0',
                                        resize: 'none',
                                        borderRadius: '5px',
                                        padding: '6px 8px',
                                        backgroundColor: appConfig.theme.colors.neutrals[300],
                                        marginRight: '12px',
                                        color: appConfig.theme.colors.primary["000"],
                                    }} />
    
                                <Button
                                    iconName="FaRegArrowAltCircleUp"
                                    //    buttonColors={{
                                    //       //contrastColor: appConfig.theme.colors.neutrals["000"],
                                    //        //mainColor: appConfig.theme.colors.primary[500],
                                    //        //mainColorLight: appConfig.theme.colors.primary[500],
                                    //        //mainColorStrong: appConfig.theme.colors.primary[500], 
                                    //    }}                                                                                            
                                    styleSheet={{
                                        borderRadius: '50%',
                                        padding: '0 3px 0 0',
                                        minWidth: '50px',
                                        minHeight: '50px',
                                        fontSize: '20px',
                                        marginBottom: '8px',
                                        marginRight: '8px',
                                        lineHeight: '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'black',
                                        backgroundColor: appConfig.theme.colors.primary[500],
                                        color: appConfig.theme.colors.neutrals[300],
                                        hover: {
                                            filter: 'grayscale(0)',
                                        }
                                    }}
                                    onClick={() => handleNovaMensagem(mensagem)} />
                                <ButtonSendSticker
                                    onStickerClick={(sticker) => {
                                        // console.log('[USANDO O COMPONENTE] Salva esse sticker no banco', sticker);
                                        handleNovaMensagem(':sticker: ' + sticker);
                                    } } />
                            </Box>
                        </Box>
                    </Box>
                </Box>
        )

    }

    
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    //console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{   
                overflow: 'auto',             
                display: 'flex',
                flexDirection: 'column-reverse',                 
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',   
                maxWidth: '100%'          
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',                            
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                                //onMouseOver={e => e.target}
                                //Hover na imagem:
                                //https://stackoverflow.com/questions/49169253/how-to-transform-image-on-hover-in-react/49169292
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}                                     
                               
                            </Text>

                            {/* Esta box vai conter o botao de deletar mensagem */}
                            {/* <Box
                                tag='div'
                                styleSheet={{   
                                //   backgroundColor: 'lightblue',                               
                                //    width: '100%',
                                //    height: '100%',
                                   display: 'flex',
                                   justifyContent: 'flex-end',                                   
                                   marginTop: '0px'
                                }}
                                >
                                <Icon
                                    label="Icon Component"
                                    name="FaRegWindowClose"
                                    styleSheet={{
                                        color: '#fffcfc'                          

                                    }}
                                    />
                                    </Box>                                              
                            */}
                            
                        </Box>

                        {/* [Declarativo] */}
                        {/* Condicional: {mensagem.texto.startsWith(':sticker:').toString()} */}
                       
                        {mensagem.texto.startsWith(':sticker:') //if ternario
                        ? (
                            <Image src={mensagem.texto.replace(':sticker:', '')}
                                styleSheet={{
                                    width: '15vw',
                                    maxWidth: '15vw',       
                                }} />
                        )
                        : (
                            mensagem.texto
                        )}
                       
                    </Text>
                );
            })}
        </Box>
    )
}