          const autocolors = window['chartjs-plugin-autocolors'];
          const chart1 = new Chart(document.getElementById('messages_in'), {
            type: 'bar',
            data: {
              labels: Object.keys(messages_in),
              datasets: [{
                label: '# of processed messages',
                data: Object.values(messages_in),
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              },
                plugins: {
                    autocolors: {
                        enabled: true,
                        mode: 'data'
                    },
                    legend: {
                    display: false
                    },
                }
            },
              plugins: [
                  autocolors
              ]
          });
          const chart2 = new Chart(document.getElementById('messages_out'), {
            type: 'bar',
            data: {
              labels: Object.keys(messages_out),
              datasets: [{
                label: '# of processed messages',
                data: Object.values(messages_out),
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              },
                plugins: {
                    autocolors: {
                        enabled: true,
                        mode: 'data'
                    },
                    legend: {
                    display: false
                    },
                }
            },
              plugins: [
                  autocolors
              ]
          });
          const chart3 = new Chart(document.getElementById('messages_delta'), {
            type: 'bar',
            data: {
              labels: Object.keys(messages_delta),
              datasets: [{
                label: 'avg message processing time',
                data: Object.values(messages_delta),
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              },
                plugins: {
                    autocolors: {
                        enabled: true,
                        mode: 'data'
                    },
                    legend: {
                    display: false
                    },
                }
            },
              plugins: [
                  autocolors
              ]
          });
          const chart4 = new Chart(document.getElementById('ocpp_delta'), {
            type: 'bar',
            data: {
              labels: Object.keys(ocpp_delta),
              datasets: [{
                label: 'avg ocpp processing time',
                data: Object.values(ocpp_delta),
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              },
                plugins: {
                    autocolors: {
                        enabled: true,
                        mode: 'data'
                    },
                    legend: {
                    display: false
                    },
                }
            },
              plugins: [
                  autocolors
              ]
          });
          const chart5 = new Chart(document.getElementById('ocpp_in'), {
            type: 'bar',
            data: {
              labels: Object.keys(ocpp_in),
              datasets: [{
                label: '# of processed messages',
                data: Object.values(ocpp_in),
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              },
                plugins: {
                    autocolors: {
                        enabled: true,
                        mode: 'data'
                    },
                    legend: {
                    display: false
                    },
                }
            },
              plugins: [
                  autocolors
              ]
          });
          const chart6 = new Chart(document.getElementById('ocpp_out'), {
            type: 'bar',
            data: {
              labels: Object.keys(ocpp_out),
              datasets: [{
                label: '# of processed messages',
                data: Object.values(ocpp_out),
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              },
                plugins: {
                    autocolors: {
                        enabled: true,
                        mode: 'data'
                    },
                    legend: {
                    display: false
                    },
                }
            },
              plugins: [
                  autocolors
              ]
          });

          function makeTrace (key, value) {
                var trace;
                trace = {
                    y: value,
                    name: key,
                    type: 'box'
                };
                return trace;
            };

          function createData(value_dict) {
              ys = [];
                var count = 0;
                for (const [key, value] of Object.entries(value_dict)) {
                    ys[count++] = makeTrace(key, value);
            };
                return ys;
          }

        Plotly.newPlot('ocpp_delta_raw', createData(ocpp_delta_raw));
        Plotly.newPlot('messages_delta_raw', createData(messages_delta_raw));