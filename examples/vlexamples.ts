const VL_SPECS = {
  'Basic': [
    {
      "name": "bar",
      "title": "Simple Bar Chart"
    },
    {
      "name": "bar_filter_calc",
      "title": "Bar with filter and calculation"
    },
    {
      "name": "bar_aggregate",
      "title": "Aggregate Bar Chart"
    },
    {
      "name": "bar_grouped",
      "title": "Grouped bar chart."
    },
    {
      "name": "bar_log",
      title: "Bar chart with log scale and large numbers",
    },
    {
      "name": "scatter",
      "title": "A scatterplot"
    },
    // TODO: colored & shape scatter,
    // TOOD: bubble scatter,
    {
      "name": "scatter_binned",
      "title": "Binned Scatterplot"
    },
    {
      "name": "tick",
      title: "Tick marks"
    },
    {
      "name": "Line",
      "title": "Line chart"
    },
    {
      "name": "line_month",
      "title": "Line showing pattern between months"
    },
    {
      "name": "histogram",
      "title": "Histogram"
    },
    {
      "name": "area",
      "title": "Area Chart"
    }
    // Hide until we finalize heatmap
    // {
    //   "name": "tableheatmap",
    //   "title": "Table Heatmap."
    // }
  ],
  'stack': [
    {
      "name": "stacked_area",
      "title": "Stacked Area Chart"
    },
    {
      "name": "stacked_bar_h",
      "title": "Horizontal Stacked Bar Chart"
    },
    {
      "name": "stacked_bar_v",
      "title": "Vertical Stacked Bar Chart"
    },
    {
      "name": "stacked_bar_1d",
      title: '1D Stacked Bar Chart'
    }
  ],
  'Trellis': [
    {
      "name": "trellis_barley",
      "title": "Trellis Plot"
    },
    {
      "name": "trellis_area",
      title: 'Trellis Area chart'
    },
    {
      "name": "trellis_stacked_bar", title: 'Trellis Stacked Bar Chart'
    },
    {"name": "trellis_scatter"}
  ]
};

export const VL_EXAMPLES = VL_SPECS;
