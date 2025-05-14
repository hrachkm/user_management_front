import { useState } from 'react';

import {
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

import { AddUser } from './AddUser';
import { UserItem } from './UserItem';

import { Users } from '../services/users';

const UserTable = ({children, headers}) => {
    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="Users list">
                <TableHead>
                    <TableRow>
                    {headers &&
                        headers.map((header) => (
                            <TableCell key={header}>{header}</TableCell>
                        ))
                    }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {children}
                </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export const UserList = ({users, setUsers}) => {
    const userServices = new Users();
    const [open, setOpen] = useState(false);
    const [watchUser, setWatchUser] = useState(false);
    const [userDeatils, setUserDetails] = useState({});
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState(null);
    const [userToEdit, setUserToEdit] = useState(null);

    const handleOpenAddUser = () => {
        setUserToEdit(null); // Asegurarse de que no haya usuario a editar al abrir para crear
        setOpen(true);
    }

    const handleOpenEditUser = (user) => {
        setUserToEdit(user);
        setOpen(true);
    };

    const watchUserDetails = (user) => {
        setWatchUser(true);
        setUserDetails(user);
    }

    const handleOpenConfirmDelete = (userId) => {
        setUserToDeleteId(userId);
        setOpenConfirmDelete(true);
    };

    const handleCloseConfirmDelete = () => {
        setOpenConfirmDelete(false);
        setUserToDeleteId(null);
        // Intenta devolver el foco al botón que abrió el modal
        document.querySelector('button[aria-label="Agregar usuario"]')?.focus();
    };

    const removeUser = async() => {
        const response = await userServices.removeUser(userToDeleteId);
        if(response.id){
            const localItems = JSON.parse(localStorage.getItem('users'));
            const userIndex = localItems.findIndex(item => item.id === response.id);
            localItems.splice(userIndex, 1);
            localStorage.setItem('users', JSON.stringify(localItems))
            setUsers(localItems);
            handleCloseConfirmDelete();
        }
    }

    const headers = [
        'Id',
        'Nombre',
        'Correo',
        'Acciones'
    ];
    return (
        <>
            <Button 
                size="small"
                variant='contained'
                color='primary'
                onClick={handleOpenAddUser}
            >
                Agregar usuario
            </Button>
            <UserTable headers={headers}>
                {users.map((user, index) => (
                    <TableRow key={index}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.nombre}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <Button size="small" color='info' onClick={ () => watchUserDetails(user) }>
                               <VisibilityIcon />
                            </Button>
                            <Button size="small" color='primary' onClick={() => handleOpenEditUser(user)}>
                                <EditIcon />
                            </Button>
                            <Button 
                                size="small" 
                                color='error' 
                                onClick={ () => handleOpenConfirmDelete(user.id) }
                            >
                                <DeleteIcon />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </UserTable>

            {/* Modal de confirmación de eliminación */}
            <Dialog
                open={openConfirmDelete}
                onClose={handleCloseConfirmDelete}
            >
                <DialogTitle id="alert-dialog-title">
                    <Typography color="error" display="flex" alignItems="center">
                        <WarningIcon sx={{ mr: 1 }} />
                        Confirmar Eliminación
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography id="alert-dialog-description">
                        ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDelete} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={removeUser} color="error" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
            <AddUser 
                open={open}
                setOpen={setOpen}
                setUsers={setUsers}
                userToEdit={userToEdit}
                setUserToEdit={setUserToEdit}
            />
            <UserItem 
                user={userDeatils}
                open={watchUser}
                setWatchUser={setWatchUser}
                setUserDetails={setUserDetails}
            />
        </>
    );
}