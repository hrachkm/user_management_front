import React from 'react';
import dayjs from 'dayjs';

import {
    Modal,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const UserItem = ({user, open, setWatchUser, setUserDetails}) => {

    const handleClose = () => {
        setWatchUser(false);
        setUserDetails({});
    }
    
    const formatDate = (dateString) => {
        if (!dateString) {
            return 'No hay información disponible';
        }
        const date = dayjs(dateString);
        if (!date.isValid()) {
          return 'Fecha inválida'; // Retornar un mensaje de error si la fecha no es válida
        }
        return date.format('DD/MM/YYYY, h:mm A'); // Formato: 24 de marzo, 2024 10:20 AM
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Detalles de usuario
                </Typography>
                <List sx={{ mt: 2 }}>
                    <ListItem>
                        <ListItemText
                            primary={'ID: ' + user.id}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={'Nombre: ' + user.nombre}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={'Correo: ' + user.email}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={'Fecha de creación: ' + formatDate(user.created_at)}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={'Ultima actualización: ' + formatDate(user.updated_at) }
                        />
                    </ListItem>
                    <Divider />
                </List>
                <Button onClick={handleClose} sx={{ mt: 2 }}>
                    Cerrar
                </Button>
            </Box>
        </Modal>
    );
}