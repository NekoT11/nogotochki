import { useEffect, useState } from "react";

export function CreateRequest() {
  const [masters, setMasters] = useState([]);
  const [master, setMaster] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      window.location.href = "/auth";
    }

    fetch("http://localhost:3000/api/masters")
      .then(res => res.json())
      .then(data => setMasters(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!master || !date || !time) {
      alert("Заполни все поля");
      return;
    }

    const userId = localStorage.getItem("userId");
    const datetime = `${date} ${time}:00`;

    const res = await fetch("http://localhost:3000/api/requests/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_user: userId,
        id_master: master,
        booking_datetime: datetime
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Заявка создана!");
    window.location.href = "/requests";
  };

  return (
    <>
      <h1>Создать заявку</h1>

      <form onSubmit={handleSubmit}>

        <label>Мастер:</label>
        <select value={master} onChange={(e) => setMaster(e.target.value)}>
          <option value="">Выбери мастера</option>
          {masters.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <label>Дата:</label>
        <input 
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Время (08:00–18:00):</label>
        <input 
          type="time"
          min="08:00"
          max="18:00"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button type="submit">Создать</button>
      </form>
    </>
  );
}
