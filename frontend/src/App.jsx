import React, { useState, useEffect } from 'react';
import './App.css'; // Mantenemos la importación de CSS si la necesitas

function App() {
  const [mensaje, setMensaje] = useState('Intentando conectar al Backend...');
  
  const API_ENDPOINT = '/api/Test/test'; 

  useEffect(() => {
    fetch(API_ENDPOINT) 
      .then(response => {
          if (response.ok) {
              return response.text(); 
          }
          throw new Error(`Error HTTP: ${response.status}`);
      })
      .then(data => {
        setMensaje(`✅ Backend Respondió: ${data}`);
      })
      .catch(error => {
        console.error('Error de conexión o configuración:', error);
        setMensaje('❌ ERROR DE CONEXIÓN. Revisa la terminal del backend, el proxy de Vite o las reglas CORS.');
      });
  }, []); 

  return (
    <div className="card">
      <h1>Prueba de Conexión Full Stack</h1>
      <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
        {mensaje}
      </p>
      <p>
        Si ves el mensaje de éxito, ¡tu Backend y Frontend se comunican!
      </p>
    </div>
  );
}

export default App;