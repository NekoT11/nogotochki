import { useEffect, useState } from "react";

export function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");

    let url = "http://localhost:3000/api/requests"; 

    if (role !== "2") {
      url = `http://localhost:3000/api/requests/user/${userId}`; 
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(() => alert("Ошибка загрузки заявок"));
  }, []);

  //      статус сменить 
  async function updateStatus(id, statusId) {
    try {
      await fetch(`http://localhost:3000/api/requests/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusId })
      });

      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("userRole");

      let url = "http://localhost:3000/api/requests";
      if (role !== "2") {
        url = `http://localhost:3000/api/requests/user/${userId}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setRequests(data);

    } catch {
      alert("Ошибка изменения статуса");
    }
  }

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
              {localStorage.getItem("userRole") === "2" && <th>Действие</th>}
            </tr>
          </thead>

          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{req.master_name}</td>
                <td>{req.booking_datetime}</td>
                <td>{req.status_name}</td>

                {localStorage.getItem("userRole") === "2" && (
                  <td>
                    <button onClick={() => updateStatus(req.id, 1)}>Новая</button>
                    <button onClick={() => updateStatus(req.id, 4)}>Подтвердить</button>
                    <button onClick={() => updateStatus(req.id, 3)}>Отменить</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
