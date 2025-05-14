import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { UserList } from '../components/UserList';

const AppRoutes = () => {
    return (
        <Routes>
            <Route exact path="/users" element={<UserList />}/>
        </Routes>
    )
}

export default AppRoutes;