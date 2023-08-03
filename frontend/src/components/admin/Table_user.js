const Table_user = ({ user, del }) => {
    return(
        <tr>
            <th>{ user.name }</th>
            <th>{ user.username }</th>
            <th><button className='btn btn-primary' onClick={() => del(user.id)}>Delete</button></th>
        </tr>
    )
}

export default Table_user