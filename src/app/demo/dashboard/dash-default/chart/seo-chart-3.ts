export class SeoChart3 {
  public static seoChartData = {
    chart: {
      type: 'area',
      height: 40,
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#ff5252'],
    fill: {
      type: 'solid',
      opacity: 0.3,
    },
    markers: {
      size: 2,
      opacity: 0.9,
      colors: '#ff5252',
      strokeColor: '#ff5252',
      strokeWidth: 2,
      hover: {
        size: 4,
      }
    },
    stroke: {
      curve: 'straight',
      width: 3,
    },
    series: [{
      name: 'series1',
      data: [100, 90, 250, 60, 10, 5,6, 4, 5, 20, 45, 10, 5]
    }],
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: (seriesName) => 'Added :'
        }
      },
      marker: {
        show: false
      }
    }
  };
}
