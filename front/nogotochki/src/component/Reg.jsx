import { useState } from 'react'

export function Reg() {
  const [formData, setFormData] = useState({
    full_name: '',
    login: '',
    phone: '',
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

    
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    
    const data = await response.json()

if (!response.ok) {
  alert(data.error)
  return
}

alert("Регистрация успешна")
window.location.href = "/requests"

  }
  
  return (
    <>
    <div className="auth-container">
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="full_name" 
          placeholder="ФИО" 
          value={formData.full_name}
          onChange={handleChange}
        />
        <input 
          type="text" 
          name="login" 
          placeholder="Логин" 
          value={formData.login}
          onChange={handleChange}
        />
        <input 
          type="text" 
          name="phone" 
          placeholder="Телефон" 
          value={formData.phone}
          onChange={handleChange}
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Пароль" 
          value={formData.password}
          onChange={handleChange}
        />    
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>Есть аккаунт?</p>
      <button onClick={() =>   window.location.href = "/auth"}>Войти</button>
      </div>
    </>
  )
}