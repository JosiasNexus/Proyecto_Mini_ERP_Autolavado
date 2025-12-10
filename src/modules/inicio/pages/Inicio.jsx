import React from 'react'
import LogoERP from '../../../assets/logo_mini_erp_autolavado.png'
import '../../../App.css'

export default function Inicio() {

  return (
    <>
      <h1>Dashboard de Administradores</h1>
      <img src={ LogoERP } alt="logo" className='logo-erp' />
    </>
  )
}