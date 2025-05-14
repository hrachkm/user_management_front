import { useState, useEffect } from 'react'

import { UserList } from './components/UserList';
import { Users } from './services/users';


function App() {
  //const [count, setCount] = useState(0)
  const usersService = new Users();

  

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const localUsers = JSON.parse(localStorage.getItem('users'));
    if(!localUsers || localUsers.length === 0){
      async function getData(){
        const data = await usersService.getUserList();
        setUsers(data);
        localStorage.setItem('users', JSON.stringify(data));
      }
      getData();
    } else {
      setUsers(localUsers);
    }
  }, [])

  return (
    <div>
       <UserList users={users} setUsers={setUsers}/>
    </div>
  )
}

export default App
