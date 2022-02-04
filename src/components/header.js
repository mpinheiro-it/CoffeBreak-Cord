import React from 'react';
import { Box, Button, Text, Image } from '@skynexui/components';


export function Header(props) {    
    const firstName = props.personName.split(' ')[0]
    
    return (
        <>        
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                
                <Text variant='heading5' styleSheet={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Image
                        styleSheet={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '8px',
                        }}
                        src={`https://github.com/${props.usuarioLogado}.png`}
                    />

                    Bem Vindo {(props.personName == 'null') ? "" : firstName}!
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