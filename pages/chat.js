import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components';
import React from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import { Header } from '../src/components/header';
import swal from 'sweetalert';


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
    const personName = roteamento.query.personName;
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
                }}>

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
                    <Header usuarioLogado={usuarioLogado} personName={personName} />
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
                        }}>

                        <MessageList
                            mensagens={listaDeMensagens}
                            setListaDeMensagens={setListaDeMensagens}
                            supabaseClient={supabaseClient}
                            usuarioLogado={usuarioLogado} />


                        {/*Box com textfield e forms para enviar nova mensagem  */}
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

function MessageList(props) {    

        //Trazendo supabaseClient para realizar operacoes no DB
        const supabaseClient = props.supabaseClient
    
        //Acionada pelo click do button .DeleteMessage 
        //Invoca funções async abaixo
        function deletarMensagem(idExcluir, nomeUsuario) {
            selectMensagemBanco(idExcluir, nomeUsuario)
        }
    
    
        //Deleta mensagem do DB
        async function deletarMensagemBanco(idExcluir) {
            await supabaseClient
                .from('messages')
                .delete()
                .eq('id', idExcluir);
        }
    
        //Faz um SELECT no DB para verificar de quem eh a msg
        async function selectMensagemBanco(idExcluir, nomeUsuario) {
            //SELECT
            await supabaseClient
                .from('messages')
                .select('de')
                .eq('id', idExcluir)  
                .then(({ data }) => {                
                    if(data.length > 0) {
                        //exclui mensagem apenas se for do usuarioLogado
                        if(data[0].de === nomeUsuario) {
                            //DELETE no DB
                            deletarMensagemBanco(idExcluir) 
    
                            //Limpa a lista na tela
                            const novaListaDeMensagens = props.mensagens.filter((msg) => {
                                return msg.id !== idExcluir
                            })
                            props.setListaDeMensagens(novaListaDeMensagens)
                        } else {
                            //Se nao for do usuarioLogado, exibe erro do SWAL
                            swal({
                                title:'Oops!',
                                text: 'Você não pode deletar mensagens de outras pessoas',
                                icon: 'info',        
                                button: false         
                            })
                        }
                    } 
                })          
        } 
    
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
                                        hover: {
                                            transform: "scale(3)",
                                            margin: "20px",
                                            transition: "all 0.5s",                                       
                                          },                                   
                                    }}
                                    src={`https://github.com/${mensagem.de}.png`}                                                          
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
    
                                <Button
                                    className="DeleteMessage"
                                    key={mensagem.id}
                                    //disabled={props.estado}
                                    iconName="FaTrashAlt"                                                    
                                    // buttonColors={{
                                    //     contrastColor: appConfig.theme.colors.neutrals["500"],
                                    //     mainColor: appConfig.theme.colors.primary[500],
                                    //     mainColorLight: appConfig.theme.colors.primary[400],
                                    //     mainColorStrong: appConfig.theme.colors.primary[600],
                                    // }}
                                    styleSheet={{
                                        position: "relative",
                                        margin: "0 5px",
                                        float: "right",                         
                                        minWidth: '15px',
                                        minHeight: '15px',                           
                                        "hover": {
                                            transition: '500ms',
                                            backgroundColor: appConfig.theme.colors.primary["500"],
                                            color: appConfig.theme.colors.neutrals["300"],
                                        },
                                        backgroundColor: appConfig.theme.colors.neutrals["300"],
                                        color: appConfig.theme.colors.primary["000"],
                                    }}
                                    onClick={(e) => {                                    
                                        deletarMensagem(mensagem.id, props.usuarioLogado)
                                    }}
                            />
                                
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
    
}
