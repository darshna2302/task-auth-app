import React from 'react'

const GetGrafana = () => {
    useEffect(() => {
    fetch("http://localhost:3000/api/dashboards/uid/abcd1234", {
      headers: {
        Authorization: "Bearer YOUR_API_KEY"
      }
    })
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);
  return (
    <div>
        get grafana dashboard
    </div>
  )
}

export default GetGrafana