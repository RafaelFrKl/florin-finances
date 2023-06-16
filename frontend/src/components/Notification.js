const Notification = ({ info }) => {
    if (!info.message) {
        return
    } else if (info.type === 'error') {
        return(
            <div className="alert alert-danger" role="alert">
                {info.message}
            </div>
        )
    } else{
        return (
            <div className="alert alert-success" role="alert">
                {info.message}
            </div>
        )
    }
}

export default Notification