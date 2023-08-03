
const AccountsDisplay = ({ accounts }) => {
    //Plaid
    const getBalanceValue = (accountType, balance) => {
        if (accountType === 'depository') {
            return balance.available
        } else if (accountType === 'credit'){
            return balance.current
        } else {
            return 0
        }
    }

    // console.log(accounts)

    return (
        <div style={{ width:'100%' , height:'400px' }}>
            <h2>Bank Account Information</h2>
            {accounts.map((account, index) => (
                <div key={index} id = {account.account_id}>
                    {/* style={{ display: 'inline-flex', width:'100%', justifyContent: 'space-between', alignItems: 'center' }} */}
                    <h3>Account Name: {account.official_name}</h3>
                    <p>Account Type: {account.name} </p>
                    {/* <span>Balance: ${getBalanceValue(account.type, account.balances)}</span> */}
                    <p>Balance: ${getBalanceValue(account.type, account.balances)}</p>
                    {/* <hr style={{ width: '100%', margin: 0 }}/> */}
                </div>
            ))}
        </div>
    )
}

export default AccountsDisplay