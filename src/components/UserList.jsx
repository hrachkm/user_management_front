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
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { AddUser } from './AddUser';

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
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
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
                onClick={handleOpen}
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
                            <Button size="small" color='info'>
                               <VisibilityIcon />
                            </Button>
                            <Button size="small" color='primary'>
                                <EditIcon />
                            </Button>
                            <Button size="small" color='error'>
                                <DeleteIcon />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </UserTable>
            <AddUser open={open} setOpen={setOpen} setUsers={setUsers}/>
        </>
    );
}