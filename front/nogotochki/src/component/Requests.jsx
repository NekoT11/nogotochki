import { useEffect, useState } from "react";

export function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/requests")
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(() => alert("Ошибка загрузки заявок"));
  }, []);

  return (
    <>
      <h1>Заявки</h1>

      {requests.length === 0 && <p>Заявок пока нет</p>}

      <ul>
        {requests.map(req => (
          <li key={req.id}>
            <b>Пользователь:</b> {req.user_name} <br />
            <b>Мастер:</b> {req.master_name} <br />
            <b>Статус:</b> {req.status_name} <br />
            <b>Дата:</b> {req.booking_datetime}
          </li>
        ))}
      </ul>
    </>
  );
}
