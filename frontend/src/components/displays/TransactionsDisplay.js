import React, { useState } from 'react'
import { BsCaretUpFill, BsCaretDownFill } from 'react-icons/bs'

const TransactionDisplay = ({ data }) => {
    const [sortField, setSortField] = useState('date')
    const [sortOrder, setSortOrder] = useState('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const transactionsPerPage = 10

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('asc')
        }
    }

    const sortedData = data.sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]
        if (aValue === bValue) return 0
        return sortOrder === 'asc' ? (aValue < bValue ? -1 : 1) : aValue > bValue ? -1 : 1
    })

    const indexOfLastTransaction = currentPage * transactionsPerPage
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage
    const currentTransactions = sortedData.slice(indexOfFirstTransaction, indexOfLastTransaction)
    const totalPages = Math.ceil(sortedData.length / transactionsPerPage)

    const getSortIcon = (field) => {
        return (
            <span onClick={() => handleSort(field)} style={{ cursor: 'pointer' }}>
                {sortField === field && sortOrder === 'asc' ? (
                    <BsCaretUpFill style={{ marginBottom: '3px' }} />
                ) : (
                    <BsCaretDownFill style={{ marginBottom: '-3px' }} />
                )}
            </span>
        )
    }

    // console.log(data)
    return (
    //scrollable view

        <div>
            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-dark table-striped table-hover">
                    <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}>
                        <tr>
                            <th style={{ width: '20%' }} onClick={() => handleSort('date')}>Date {getSortIcon('date')}</th>
                            <th style={{ width: '20%' }} onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
                            <th style={{ width: '20%' }} onClick={() => handleSort('amount')}>Amount {getSortIcon('amount')}</th>
                            <th style={{ width: '20%' }} onClick={() => handleSort('category')}>Category {getSortIcon('category')}</th>
                            <th style={{ width: '20%' }} onClick={() => handleSort('merchant_name')}>Merchant Name {getSortIcon('merchant_name')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions.map((transaction) => (
                            <tr key={transaction.transaction_id}>
                                <td>{transaction.date}</td>
                                <td>{transaction.name}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.category.join(', ')}</td>
                                <td>{transaction.merchant_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <nav>
                <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(index + 1)}
                                style={{ cursor: 'pointer' }}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>

    // <div>
    //     <h1>Transaction History</h1>
    //     <div className="overflow-auto" style={{ maxHeight: '400px' }}>
    //         {data.map((transaction) => (
    //             <div key={transaction.transaction_id}>
    //                 <p>Date: {transaction.date}</p>
    //                 <p>Name: {transaction.name}</p>
    //                 <p>Amount: {transaction.amount}</p>
    //                 <p>Category: {transaction.category.join(', ')}</p>
    //                 <p>Merchant Name: {transaction.merchant_name}</p>
    //                 <hr />
    //             </div>
    //         ))}
    //     </div>
    // </div>
    )
}

const StartDateInput = ({ startDate, setStartDate }) => {
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value)
    }

    return (
        <div>
            <label htmlFor="start-date">Start Date:</label>
            <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={handleStartDateChange}
            />
        </div>
    )
}

const EndDateInput = ({ endDate, setEndDate }) => {
    const handleEndDateChange = (event) => {
        setEndDate(event.target.value)
    }

    return (
        <div>
            <label htmlFor="end-date">End Date:</label>
            <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={handleEndDateChange}
            />
        </div>
    )
}


export { TransactionDisplay, StartDateInput, EndDateInput }
