export class PowerCardChart2 {
  public static powerCardChartData = {
    chart: {
      type: 'line',
      height: 75,
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#ffba57'],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    series: [{
      name: 'series1',
      data: [2, 3, 7, 1, 1, 2]
    }],
    yaxis: {
      min: 0,
      max: 10,
    },
    tooltip: {
      theme: 'dark',
      fixed: {
        enabled: false
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: (seriesName) => 'Enrolled'
        }
      },
      marker: {
        show: false
      }
    }
  };
}
