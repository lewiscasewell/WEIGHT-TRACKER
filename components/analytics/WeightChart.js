import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useRecoilValue } from 'recoil'
import { weightsState } from '../../atoms/userAtom'
import { format } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const WeightChart = () => {
  const weights = useRecoilValue(weightsState)
  console.log(
    weights.length >= 1
      ? weights[weights.length - 1].date.toDate()
      : 'loading...'
  )

  const dates = weights.map((i) => format(i.date.toDate(), 'MMM dd'))
  console.log(dates.reverse())

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  }

  const labels = [1, 2, 3, 4, 5]
  let data
  if (weights.length >= 1) {
    data = {
      dates,
      datasets: [
        {
          label: 'Weight (kg)',
          data: labels.map((i, idx) => i * 5),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    }
  }

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  )
}

export default WeightChart
