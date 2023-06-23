const Button = ({ handleClick, text }) => {
    return (
        <button className="btn btn-primary" onClick={handleClick}>
            {text}
        </button>
    )
}

export default Button