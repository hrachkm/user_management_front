import { useState, useEffect } from 'react';

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
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    styled
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

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

const MainTitle = styled('h1')(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    fontWeight: 'bolder',
    ...theme.typography.h4
}));

const UserListContainer = styled(Box)(({ theme }) => ({
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
}));

export const UserList = ({users, setUsers}) => {
    const userServices = new Users();
    const [open, setOpen] = useState(false);
    const [watchUser, setWatchUser] = useState(false);
    const [userDeatils, setUserDetails] = useState({});
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState(null);
    const [userToEdit, setUserToEdit] = useState(null);
    const [filter, setFilter] = useState('todos');
    const [filteredUsers, setFilteredUsers] = useState(users);

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

    const handleFilterChange = (event) => {
        const newFilter = event.target.value;
        setFilter(newFilter);
        applyFilter(users, newFilter);
    };

    const applyFilter = (allUsers, currentFilter) => {
        if (currentFilter === 'todos') {
            setFilteredUsers(allUsers);
        } else {
            setFilteredUsers(allUsers.filter(user => user.estado === currentFilter)); // Asume que tienes una propiedad 'activo'
        }
    };

    const updateUserStatus = async (userId, newStatus) => {
        const response = await userServices.updateUserActivation(userId, { estado: newStatus });
        if (response?.id) {
            const updatedUsers = users.map(user =>
                user.id === response.id ? { ...user, estado: response.estado } : user
            );
            setUsers(updatedUsers);
            const localItems = JSON.parse(localStorage.getItem('users')) || [];
            const updatedLocalItems = localItems.map(item =>
                item.id === response.id ? { ...item, estado: response.estado } : item
            );
            localStorage.setItem('users', JSON.stringify(updatedLocalItems));
        }
    };

    const headers = [
        'Id',
        'Nombre',
        'Correo',
        'Estado',
        'Acciones'
    ];

    useEffect(() => {
        applyFilter(users, filter);
    }, [users, filter]);

    return (
        <>
            <UserListContainer>
                <MainTitle>Administración de usuarios</MainTitle>
                <Button 
                    size="small"
                    variant='contained'
                    color='primary'
                    onClick={handleOpenAddUser}
                >
                    Agregar usuario
                </Button>

                <Box sx={{ mt: 2, mb: 2, width: 150 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="filter-label">Filtrar usuarios</InputLabel>
                        <Select
                            labelId="filter-label"
                            id="filter"
                            value={filter}
                            label="Filtrar usuarios"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="todos">Todos</MenuItem>
                            <MenuItem value="activo">Activos</MenuItem>
                            <MenuItem value="inactivo">Inactivos</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <UserTable headers={headers}>
                    {filteredUsers.map((user, index) => (
                        <TableRow key={index}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.nombre}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.estado}</TableCell>
                            <TableCell>
                                <Button size="small" color='info' title='Ver detalles' onClick={ () => watchUserDetails(user) }>
                                <VisibilityIcon />
                                </Button>
                                <Button size="small" color='primary' title='Editar Usuario' onClick={() => handleOpenEditUser(user)}>
                                    <EditIcon />
                                </Button>
                                {user.estado === 'inactivo' && (
                                    <Button
                                        size="small"
                                        color='success'
                                        onClick={() => updateUserStatus(user.id, 'activo')}
                                        title="Activar usuario"
                                    >
                                        <CheckCircleOutlineIcon />
                                    </Button>
                                )}
                                {user.estado === 'activo' && (
                                    <Button
                                        size="small"
                                        color='warning'
                                        onClick={() => updateUserStatus(user.id, 'inactivo')}
                                        title="Desactivar usuario"
                                    >
                                        <RemoveCircleOutlineIcon />
                                    </Button>
                                )}
                                <Button 
                                    size="small" 
                                    color='error'
                                    title='Borrar usuario'
                                    onClick={ () => handleOpenConfirmDelete(user.id) }
                                >
                                    <DeleteIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </UserTable>
            </UserListContainer>

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