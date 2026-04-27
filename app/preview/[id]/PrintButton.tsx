'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#1a4a3a',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        fontWeight: 600,
        zIndex: 100,
      }}
      className="no-print"
    >
      🖨️ Imprimir / Salvar PDF
    </button>
  )
}
