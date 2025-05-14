import { useState } from 'react';

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

export const AddUser = ({open, setOpen, setUsers}) => {
    const usersService = new Users();
    const handleClose = () => {
        setOpen(false);
        setSubmissionStatus(null);
    } 

    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [submissionMsg, setSubmissionMsg] = useState('');

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const response = await usersService.addUser(values);
        setSubmitting(false);
        if(response.created_at){
            setSubmissionStatus('success');
            setSubmissionMsg('Usuario creado con éxito!');
            setUsers(currentUsers => [...currentUsers, response]);
            let usersLocal = JSON.parse(localStorage.getItem('users'));
            usersLocal.push(response);
            localStorage.setItem('users', JSON.stringify(usersLocal));
            resetForm();
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

    return(
        <>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography id="form-modal-title" variant="h6" component="h2" mb={2}>
                        Crear Nuevo Usuario
                    </Typography>
                    <Formik
                        initialValues={{ nombre: '', email: '' }}
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
                                        error={touched.name && !!errors.name}
                                    />
                                    <ErrorMessage name="name" component="div" style={{ color: 'red', fontSize: '0.8em' }} />
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
                                    <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.8em' }} />
                                </div>
                                <Button type="submit" variant="contained" disabled={isSubmitting}>
                                    {isSubmitting ? 'Enviando...' : 'Crear Usuario'}
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