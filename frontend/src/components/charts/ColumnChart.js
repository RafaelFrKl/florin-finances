import { Chart } from 'react-google-charts'

const ColumnChart = ({ transactions }) => {
    console.log(transactions)
    if (!transactions || transactions.length === 0) {
        return <p>No data available.</p>
    } else{
        // Create an object to store the accumulated amounts for each category
        const categoryAmounts = {}
        // Loop through the added transactions and accumulate amounts for each category
        transactions.forEach((transaction) => {
            if (transaction.amount > 0) {
                const category = transaction.category[0] // Assuming only one category per transaction
                if (!categoryAmounts[category]) {
                    categoryAmounts[category] = 0
                }
                categoryAmounts[category] += transaction.amount
            }
        })

        // Prepare the final data in the required format
        const data = [['Category', 'Amount', { role: 'annotation' }]]
        for (const category in categoryAmounts) {
            const amountFormatted = categoryAmounts[category].toFixed(2) // Format amount to two decimal points
            data.push([category, parseFloat(amountFormatted), amountFormatted])
        }

        console.log(data)
        /*const data = [
        ['Year', 'Sales', 'Expenses', 'Profit'],
        ['2014', 1000, 400, 200],
        ['2015', 1170, 460, 250],
        ['2016', 660, 1120, 300],
        ['2017', 1030, 540, 350],
    ]*/

        const options = {
            title: 'Monthly Total per Category',
            chartArea: { width: '50%' },
            hAxis: {
                textStyle: { color: '#c9c9c9' },
                minValue: 0,
            },
            vAxis: {
                format: '$#',
                textStyle: { color: '#c9c9c9' },
            },
            backgroundColor: '#282828',
            legendTextStyle: { color: '#c9c9c9' },
            titleTextStyle: { color: '#c9c9c9' },
            annotations: {
                alwaysOutside: true, // This will display labels outside the bars
                textStyle: {
                    fontSize: 12,
                    color: '#ffffff',
                    auraColor: 'none',
                },
            },
        }

        return (
            <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
            />
        )
    }
}

export default ColumnChart

