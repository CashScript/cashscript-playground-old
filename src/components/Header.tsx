import React from 'react'

interface Props {}

const Header: React.FC<Props> = () => {
  return (
    <header style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#012335',
      color: '#fff',
      padding: '24px 32px',
      boxShadow: '0px -2px 8px #000',
      fontSize: '16px'
    }}>
      <div className="header-title">
        CashScript Playground
      </div>
    </header>
  )
}

export default Header;
