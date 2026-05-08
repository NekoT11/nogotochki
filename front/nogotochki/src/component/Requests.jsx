import { useEffect, useState } from "react";

export function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:3000/api/requests");
        const data = await res.json();
        setRequests(data);
      } catch {
        alert("Ошибка загрузки заявок");
      }
    }

    load();
  }, []);

  return (
    <>
      <h1>Заявки</h1>

      {requests.length === 0 && <p>Заявок пока нет</p>}

      {requests.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Мастер</th>
              <th>Дата и время</th>
              <th>Статус</th>
            </tr>
          </thead>

          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{req.master_name}</td>
                <td>{req.booking_datetime}</td>
                <td>{req.status_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
