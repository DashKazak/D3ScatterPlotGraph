let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

let request = new XMLHttpRequest() 

let values = []

//placing elements horizontally
let xScale
//placing elements vertically
let yScale

//dimensions for the canvas
let width = 800
let height = 600
let padding = 40

//drawing items into svg
let svg = d3.select('svg')
let tooltip= d3.select('#tooltip')

//setting height and width of an svg area
let drawCanvas = () => {
    svg.attr('width',width)
    svg.attr('height',height)
}

let generateScales = () => {
    xScale = d3.scaleLinear()
                .range([padding, width - padding])
                .domain([d3.min(values,(item) => {
                    return item['Year'] 
                }) - 1, d3.max(values, (item) => {
                    return item['Year']
                }) + 1 ])
    
    yScale = d3.scaleTime()
                .range([padding ,height-padding])
                .domain([d3.min(values,(item)=> {
                    return new Date(item['Seconds'] * 1000)
                }), d3.max(values, (item) => {
                    return new Date(item['Seconds'] * 1000)
                })])

}

let drawPoints = () => {

    //associating circles with the data
    svg.selectAll('circle')
        //binding
        .data(values)
        .enter()
        .append('circle')
        .attr('class','dot')
        .attr('r', '5')
        .attr('data-xvalue',(item) => {
            return item['Year']
        })
        .attr('data-yvalue',(item) => {
            return new Date(item['Seconds']* 1000)
        })
        .attr('cx', (item) => {
            return xScale(item['Year'])
        })
        .attr('cy', (item) => {
            return yScale(new Date(item['Seconds'] * 1000))
        })
        .attr('fill', (item) => {
            if(item['Doping']!= ''){
                return 'orange'
            }else{
                return 'darkgreen'
            }
        })
        .on('mouseover',(e,item) => {
            tooltip.transition()
                    .style('visibility', 'visible')
            if(item['Doping'] != ''){
                tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Nationality'] + ' - '+ item['Time'] + ' - ' + item['Place'] + ' - ' + item['Doping'])
            }else{
                tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Nationality'] + ' - '+ item['Time'] + ' - ' + item['Place'])
            }

            tooltip.attr('data-year', item['Year'])
        })
        .on('mouseout', (e,item) => {
            tooltip.transition()
                    .style('visibility', 'hidden')
        })


}
let generateAxes = () => {
    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))
    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'))
    
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (height - padding) + ')')

    svg.append('g')
        .call(yAxis)
        .attr('id','y-axis')
        .attr('transform','translate(' + (padding) +',0)')

}

//fetching JSOn data
request.open('GET',url,true)
request.onload = () => {
    //console.log(request.responseText)
    //parsing JSON response into a JS array
    values = JSON.parse(request.responseText)
    console.log(values)
    //order
    drawCanvas()
    generateScales()
    drawPoints()
    generateAxes()

}
request.send()