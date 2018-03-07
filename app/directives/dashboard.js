app.directive('linechart', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            var element = elem.attr('id');
            var createLineChart = function (element, data, xkey, ykeys, labels, opacity, Pfillcolor, Pstockcolor, lineColors) {
                Morris.Line({
                    element: element,
                    data: data,
                    xkey: xkey,
                    ykeys: ykeys,
                    labels: labels,
                    fillOpacity: opacity,
                    pointFillColors: Pfillcolor,
                    pointStrokeColors: Pstockcolor,
                    behaveLikeLine: true,
                    gridLineColor: '#eef0f2',
                    hideHover: 'auto',
                    lineWidth: '3px',
                    pointSize: 0,
                    preUnits: '$',
                    resize: true, //defaulted to true
                    lineColors: lineColors
                });
            };
            var data = [
                {y: '2008', a: 50, b: 0},
                {y: '2009', a: 75, b: 50},
                {y: '2010', a: 30, b: 80},
                {y: '2011', a: 50, b: 50},
                {y: '2012', a: 75, b: 10},
                {y: '2013', a: 50, b: 40},
                {y: '2014', a: 75, b: 50},
                {y: '2015', a: 100, b: 70}
            ];
            createLineChart(element, data, 'y', ['a', 'b'], ['Mobiles', 'Tablets'], ['0.1'], ['#ffffff'], ['#999999'], ['#458bc4', '#23b195']);
        }
    }
});
app.directive('barchart', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            var element = elem.attr('id');
            var createBarChart = function (element, data, xkey, ykeys, labels, lineColors) {
                Morris.Bar({
                    element: element,
                    data: data,
                    xkey: xkey,
                    ykeys: ykeys,
                    stacked: true,
                    labels: labels,
                    hideHover: 'auto',
                    resize: true, //defaulted to true
                    gridLineColor: '#eeeeee',
                    barColors: lineColors
                });
            };
            var stackedData = [
                {y: '2005', a: 45, b: 180},
                {y: '2006', a: 75, b: 65},
                {y: '2007', a: 100, b: 90},
                {y: '2008', a: 75, b: 65},
                {y: '2009', a: 100, b: 90},
                {y: '2010', a: 75, b: 65},
                {y: '2011', a: 50, b: 40},
                {y: '2012', a: 75, b: 65},
                {y: '2013', a: 50, b: 40},
                {y: '2014', a: 75, b: 65},
                {y: '2015', a: 100, b: 90}
            ];
            createBarChart(element, stackedData, 'y', ['a', 'b'], ['Series A', 'Series B'], ['#458bc4', '#ebeff2']);
        }
    }
});