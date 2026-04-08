import React from 'react'

function GrafanaIframe() {
  return (
    <div>
        <h1>Grafana with Iframe</h1>
        <iframe src="http://localhost:3000/d-solo/adfsmdd/demo-dashboard?orgId=1&from=1772541266000&to=1772541866000&timezone=browser&panelId=panel-1&__feature.dashboardScene=true" width="450" height="200" frameborder="0"></iframe>
    </div>
  )
}

export default GrafanaIframe