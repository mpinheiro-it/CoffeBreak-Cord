import React from 'react';
import { Box, Button, Text, Image } from '@skynexui/components';


export function Header(props) {
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

                    Bem Vindo {props.usuarioLogado}!
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