import { useState } from 'react'

export function Auth() {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    localStorage.clear();


    if (!formData.login || !formData.password) {
      alert('Заполни все поля')
      return
    }

    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      console.log(data)

    if (!res.ok) {
  alert(data.error)
  return
}


      alert('Успешный вход')
   localStorage.setItem("userId", data.user.id)
  localStorage.setItem("userRole", data.user.role)
  window.location.href = "/requests"



    } catch (err) {
      console.error(err)
      alert('Ошибка соединения с сервером')
    }
  }

  return (
    <>
      <h1>Войти</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="login"
          placeholder="Логин"
          value={formData.login}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Войти</button>
      </form>
      <p>Нет аккаунта?</p>
      <button onClick={() =>   window.location.href = "/reg"}>Зарегистрироваться</button>
    </>
  )
}