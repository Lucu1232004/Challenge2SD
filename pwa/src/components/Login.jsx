import { useState } from 'react'
import { login, registerUser } from '../lib/auth.js'
import Logo from './Logo.jsx'

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  )
}
function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}
function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

export default function Login({ onLogged }) {
  const [mode, setMode] = useState('login') // login | register
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [regPass, setRegPass] = useState('')
  const [error, setError] = useState('')
  const [okMsg, setOkMsg] = useState('')

  function handleLogin(e) {
    e.preventDefault()
    setError('')
    setOkMsg('')
    const res = login(identifier, password)
    if (!res.ok) {
      setError(res.error) // mensaje en pantalla (exige el parcial)
      return
    }
    onLogged(res.session)
  }

  function handleRegister(e) {
    e.preventDefault()
    setError('')
    setOkMsg('')
    const res = registerUser({ name, username, email, password: regPass })
    if (!res.ok) {
      setError(res.error)
      return
    }
    setOkMsg('Usuario registrado. Ahora inicia sesión con tu usuario o correo.')
    setMode('login')
    setIdentifier(username || email)
    setPassword('')
    setName('')
    setUsername('')
    setEmail('')
    setRegPass('')
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <Logo />
        <p className="muted">Gestión de pacientes · acceso clínico seguro</p>

        <div className="tabs">
          <button className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => { setMode('login'); setError(''); setOkMsg('') }}>
            Entrar
          </button>
          <button className={mode === 'register' ? 'tab active' : 'tab'} onClick={() => { setMode('register'); setError(''); setOkMsg('') }}>
            Registrarse
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="form">
            <label>
              Usuario o correo
              <div className="input">
                <span className="ico"><IconUser /></span>
                <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="" autoComplete="username" />
              </div>
            </label>
            <label>
              Contraseña
              <div className="input">
                <span className="ico"><IconLock /></span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="" autoComplete="current-password" />
              </div>
            </label>
            {error && <div className="alert error">{error}</div>}
            {okMsg && <div className="alert ok">{okMsg}</div>}
            <button className="btn primary" type="submit">Iniciar sesión</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="form">
            <label>
              Nombre completo
              <div className="input">
                <span className="ico"><IconUser /></span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
              </div>
            </label>
            <label>
              Usuario
              <div className="input">
                <span className="ico"><IconUser /></span>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ej: samuel_01" />
              </div>
            </label>
            <label>
              Correo
              <div className="input">
                <span className="ico"><IconMail /></span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@mail.com" />
              </div>
            </label>
            <label>
              Contraseña
              <div className="input">
                <span className="ico"><IconLock /></span>
                <input type="password" value={regPass} onChange={(e) => setRegPass(e.target.value)} placeholder="Mínimo 6 caracteres" />
              </div>
            </label>
            {error && <div className="alert error">{error}</div>}
            {okMsg && <div className="alert ok">{okMsg}</div>}
            <button className="btn primary" type="submit">Crear cuenta</button>
          </form>
        )}
      </div>
    </div>
  )
}
