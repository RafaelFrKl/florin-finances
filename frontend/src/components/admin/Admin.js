import './Admin.css'
import { useState } from 'react'
import AdminService from '../../services/admin'
import Table_user from './Table_user'
const Admin = () => {
    const [users, setUsers] = useState('')

    const get_users = async () => {
        try {
            const all_users = await AdminService.getAll()
            setUsers(all_users)
        } catch(e) {
            console.log(e)
        }
    }

    const delete_user = async (id) => {
        try {
            await AdminService.deleteUser(id)
            get_users()
        } catch(e) {
            console.log(e)
        }
    }
    if (users.length > 0) {
        return (
            <div>
                <table className="table">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Delete</th>
                        </tr>
                        {
                            users.map((user) => (
                                <Table_user key={user.id} user={user} del={delete_user}/>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        )
    }else{
        get_users()
        return (
            <div>
                <p>There is no user in the system. Please register some.</p>
            </div>
        )
    }
}

export default Admin