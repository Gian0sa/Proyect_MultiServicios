import { Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import AdminHeader from '../components/ui/AdminHeader';

export default function AdminLayout() {
  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.main}>
        <AdminHeader />
        <div style={styles.content}>
          <Outlet /> {/* 👈 aquí cambia el contenido */}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f4f6f8',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    padding: '2rem',
  },
};
