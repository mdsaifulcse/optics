export class PowerCardChart1 {
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
    colors: ['#ff5252'],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    series: [{
      name: 'series1',
      data: [35, 65, 100, 50, 80, 100, 20]
    }],
    yaxis: {
      min: 10,
      max: 100,
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
          formatter: (seriesName) => '% Complete'
        }
      },
      marker: {
        show: false
      }
    }
  };
}
