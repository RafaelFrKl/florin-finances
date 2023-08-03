import { Chart } from 'react-google-charts'

const BarChart = ({ transactions }) => {
    console.log(transactions)
    if (!transactions || transactions.length === 0) {
        return <p>No data available.</p>
    } else{
        // Define a helper function to get the month name from a date string
        const getMonthName = (dateString) => {
            const date = new Date(dateString)
            const options = { month: 'long' }
            return new Intl.DateTimeFormat('en-US', options).format(date)
        }

        // Create an object to store the accumulated amounts for each category and month
        const categoryMonthlyAmounts = {}
        // Loop through the added transactions and accumulate amounts for each category and month
        transactions.forEach((transaction) => {
            if (transaction.amount > 0) {
                const month = getMonthName(transaction.date)
                const category = transaction.category[0] // Assuming only one category per transaction
                if (!categoryMonthlyAmounts[category]) {
                    categoryMonthlyAmounts[category] = {}
                }
                if (!categoryMonthlyAmounts[category][month]) {
                    categoryMonthlyAmounts[category][month] = 0
                }
                categoryMonthlyAmounts[category][month] += transaction.amount
            }
        })

        // Prepare the final data in the required format
        const data = [['Category', ...Object.keys(categoryMonthlyAmounts)]]
        const months = Object.keys(categoryMonthlyAmounts[Object.keys(categoryMonthlyAmounts)[0]])
        months.forEach((month) => {
            const row = [month]
            Object.keys(categoryMonthlyAmounts).forEach((category) => {
                row.push(categoryMonthlyAmounts[category][month] || 0)
            })
            data.push(row)
        })

        console.log(data)

        /*const data = [
        ['City', '2010 Population', '2000 Population'],
        ['New York City, NY', 8175000, 8008000],
        ['Los Angeles, CA', 3792000, 3694000],
        ['Chicago, IL', 2695000, 2896000],
        ['Houston, TX', 2099000, 1953000],
        ['Philadelphia, PA', 1526000, 1517000],
    ]*/

        const options = {
            title: 'Monthly Total',
            chartArea: { width: '50%' },
            isStacked: true,
            hAxis: {
                format: '$#',
                textStyle:{ color: '#c9c9c9' },
                minValue: 0
            },
            vAxis: {
                textStyle:{ color: '#c9c9c9' }
            },
            backgroundColor: '#282828',
            legendTextStyle: { color: '#c9c9c9' },
            titleTextStyle: { color: '#c9c9c9' },
            annotations: {
                alwaysOutside: true, // This will display labels outside the columns
                textStyle: {
                    fontSize: 12,
                    color: '#ffffff',
                    auraColor: 'none',
                },
            },
        }

        return (
            <Chart
                chartType="BarChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
            />
        )
    }
}

export default BarChart