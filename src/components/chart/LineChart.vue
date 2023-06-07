<template>
    <div>
      <svg ref="chartRef"></svg>
    </div>
</template>
  
<script>
  import { ref, onMounted } from 'vue';
  import * as d3 from 'd3';
  
  export default {
    setup() {
      const chartRef = ref(null);
  
      onMounted(() => {
        drawChart(chartRef.value);
      });
  
      function drawChart(element) {
        const data = [
          { company: 'Company A', stars: 4, comments: 'good' },
          { company: 'Company A', stars: 2, comments: 'bad' },
          { company: 'Company B', stars: 3, comments: 'good' },
          { company: 'Company B', stars: 1, comments: 'bad' },
        ];
  
        const width = 400;
        const height = 300;
        const radius = Math.min(width, height) / 2;
  
        const svg = d3.select(element)
          .attr('width', width)
          .attr('height', height);
  
        const colorScale = d3.scaleOrdinal()
          .domain(['good', 'bad'])
          .range(['green', 'red']);
  
        const pie = d3.pie()
          .value(d => 1)
          .sort(null);
  
        const arc = d3.arc()
          .innerRadius(0)
          .outerRadius(radius);
  
        const arcs = svg.selectAll('arc')
          .data(pie(data))
          .enter()
          .append('g')
          .attr('class', 'arc')
          .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
        arcs.append('path')
          .attr('d', arc)
          .attr('fill', d => colorScale(d.data.comments))
          .on('mouseover', handleMouseOver)
          .on('mouseout', handleMouseOut);
  
        arcs.append('text')
          .attr('transform', d => `translate(${arc.centroid(d)})`)
          .attr('text-anchor', 'middle')
          .text(d => `${d.data.company}`);
  
        function handleMouseOver(event, d) {
          d3.select(event.target)
            .transition()
            .duration(200)
            .attr('opacity', 0.8);
        }
  
        function handleMouseOut(event, d) {
          d3.select(event.target)
            .transition()
            .duration(200)
            .attr('opacity', 1);
        }
      }
  
      return {
        chartRef,
      };
    },
  };
</script>
  