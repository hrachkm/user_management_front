import { useState, useEffect } from 'react';

import {
    Box,
    Modal,
    Button,
    Typography,
    Stack,
    TextField,
    Alert
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Users } from '../services/users';

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

export const AddUser = ({open, setOpen, setUsers, userToEdit, setUserToEdit}) => {
    const usersService = new Users();

     useEffect(() => {
        setSubmissionStatus(null); // Limpiar el estado al abrir para crear o editar
    }, [open, userToEdit]);
    const handleClose = () => {
        setOpen(false);
        setSubmissionStatus(null);
        setUserToEdit(null);
    } 

    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [submissionMsg, setSubmissionMsg] = useState('');

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        let response;
        if (userToEdit?.id) {
            // Editar usuario existente
            response = await usersService.updateUser(userToEdit.id, values);
        } else {
            // Crear nuevo usuario
            response = await usersService.addUser(values);
        }
        setSubmitting(false);
        if(response.created_at){
            setSubmissionStatus('success');
            setSubmissionMsg(`Usuario ${userToEdit?.id ? 'actualizado' : 'creado'} con éxito!`);

            if (userToEdit?.id) {
                // Actualizar en la lista local
                setUsers(currentUsers =>
                    currentUsers.map(user =>
                        user.id === response.id ? response : user
                    )
                );

                //Actualizar en local storage
                const localItems = JSON.parse(localStorage.getItem('users')) || [];
                const updatedLocalItems = localItems.map(item =>
                    item.id === response.id ? response : item
                );
                localStorage.setItem('users', JSON.stringify(updatedLocalItems));
            } else {
                setUsers(currentUsers => [...currentUsers, response]);
                let usersLocal = JSON.parse(localStorage.getItem('users'));
                usersLocal.push(response);
                localStorage.setItem('users', JSON.stringify(usersLocal));
                resetForm();
            }

        } else {
            setSubmissionStatus('error');
            setSubmissionMsg('Hubo un error al crear el usuario: ' + response.msg);
        }
        // Opcional: Cerrar el modal automáticamente después de un tiempo
        //setTimeout(handleClose, 1500);
        // Simulación de error (para probar el mensaje de error, comenta lo anterior y descomenta esto)
        // setSubmissionStatus('error');
        // setSubmitting(false);
    }


    const validate = (values) => {
        const errors = {};
        if (!values.nombre) {
            errors.nombre = 'El nombre es requerido';
        } else if (values.nombre.length < 2) {
            errors.nombre = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!values.email) {
            errors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = 'Introduce un email válido';
        }

        return errors;
    };

    const initialValues = userToEdit ? { nombre: userToEdit.nombre, email: userToEdit.email } : { nombre: '', email: '' };
    const modalTitle = userToEdit ? 'Editar Usuario' : 'Crear Nuevo Usuario';
    const submitButtonText = userToEdit ? 'Guardar Cambios' : 'Crear Usuario';

    return(
        <>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography id="form-modal-title" variant="h6" component="h2" mb={2}>
                        { modalTitle }
                    </Typography>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validate={validate}
                    >
                        {({ isSubmitting, errors, touched }) => (
                        <Form>
                            <Stack spacing={2}>
                                <div>
                                    <Field 
                                        as={TextField} 
                                        fullWidth 
                                        id="nombre" 
                                        name="nombre" 
                                        label="Nombre" 
                                        variant="outlined"
                                        error={touched.nombre && !!errors.nombre}
                                    />
                                    <ErrorMessage name="nombre" component="div" style={{ color: '#F44336', fontSize: '0.8em', paddingTop: '0.5rem' }} />
                                </div>
                                <div>
                                    <Field 
                                        as={TextField} 
                                        fullWidth 
                                        id="email" 
                                        name="email" 
                                        label="Email" 
                                        variant="outlined"
                                        error={touched.email && !!errors.email}
                                    />
                                    <ErrorMessage name="email" component="div" style={{ color: '#F44336', fontSize: '0.8em', paddingTop: '0.5rem' }} />
                                </div>
                                <Button type="submit" variant="contained" disabled={isSubmitting}>
                                    {isSubmitting ? 'Enviando...' : submitButtonText}
                                </Button>
                                <Button onClick={handleClose}>Cancelar</Button>
                                {submissionStatus === 'success' && (
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        { submissionMsg }
                                    </Alert>
                                )}
                                {submissionStatus === 'error' && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        { submissionMsg }
                                    </Alert>
                                )}
                            </Stack>
                        </Form>
                        )}
                    </Formik>
                </Box>
            </Modal>
        </>
    );
}