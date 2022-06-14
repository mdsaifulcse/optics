export class SeoChart2 {
  public static seoChartData = {
    chart: {
      type: 'bar',
      height: 40,
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#2ecc71'],
    plotOptions: {
      bar: {
        columnWidth: '60%'
      }
    },
    series: [{
      data: [50, 150, 20, 50, 80, 23, 30, 43, 33, 1, 54, 67, 66, 70, 50, 63]
    }],
    xaxis: {
      crosshairs: {
        width: 1
      },
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: (seriesName) => 'Enrolled :'
        }
      },
      marker: {
        show: false
      }
    }
  };
}
