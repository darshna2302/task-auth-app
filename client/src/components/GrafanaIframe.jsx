import React from 'react'

function GrafanaIframe() {
  return (
    <div>
        <h1>Grafana with Iframe</h1>
        <iframe src="http://localhost:3000/d-solo/adckdth/new-dashboard?orgId=1&from=1775686737651&to=1775708337651&timezone=browser&panelId=panel-1&__feature.dashboardScene=true" width="450" height="200" ></iframe>
    </div>
  )
}

export default GrafanaIframe