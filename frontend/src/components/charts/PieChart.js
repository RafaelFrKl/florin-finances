import { Chart } from 'react-google-charts'

const PieChart = ({ transactions }) => {
    if (!transactions || transactions.length === 0) {
        return <p>No data available.</p>
    } else{
        // example data
    // const data = [
    //     ['Task', 'Hours per Day'],
    //     ['Work', 11],
    //     ['Eat', 2],
    //     ['Commute', 2],
    //     ['Watch TV', 2],
    //     ['Sleep', 7],
    // ]

        const categoryMap = new Map()
        transactions.forEach((transaction) => {
            if (transaction.amount > 0) {
                const categories = transaction.category.join(', ') // Convert categories array to a string
                if (categoryMap.has(categories)) {
                    const currentAmount = categoryMap.get(categories)
                    categoryMap.set(categories, currentAmount + transaction.amount)
                } else {
                    categoryMap.set(categories, transaction.amount)
                }
            }
        })

        // Convert the categoryMap to the required format for the PieChart
        const data = [['Category', 'Amount']]
        categoryMap.forEach((amount, category) => {
            data.push([category, amount])
        })

        const options = {
            title: 'Distribution',
            backgroundColor: '#282828',
            legendTextStyle: { color: '#c9c9c9' },
            titleTextStyle: { color: '#c9c9c9' },
        }

        return (
            <Chart
                chartType="PieChart"
                data={data}
                options={options}
                width={'100%'}
                height={'400px'}
            />
        )
    }
}

export default PieChart