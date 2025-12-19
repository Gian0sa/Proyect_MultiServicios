import { useEffect, useMemo, useState } from 'react';
import { paqueteService } from "../../api/paqueteService";
import { tourService } from "../../api/tourService";
import { transporteService } from "../../api/transporteService";
import { servicioService } from "../../api/servicioService";
import { ventaService } from "../../api/ventaService";
import { hospedajeService } from "../../api/hospedajeService";
import { destinoService } from "../../api/destinoService";
import PeruMap from "../../components/ui/PeruMap";

/* ===================== HELPERS ===================== */
function formatMoney(value) {
  const n = Number(value ?? 0);
  return `S/ ${Number.isFinite(n) ? n.toFixed(2) : '0.00'}`;
}

function dayKey(d) {
  const x = new Date(d);
  if (Number.isNaN(x.getTime())) return '—';
  return x.toISOString().slice(0, 10);
}

function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/* ===================== COMPONENTS ===================== */
function SparkBars({ values }) {
  const max = Math.max(1, ...values);

  return (
    <div style={styles.spark}>
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            ...styles.sparkBar,
            height: `${Math.max(10, Math.round((v / max) * 100))}%`,
          }}
          title={`${formatMoney(v)}`}
        />
      ))}
    </div>
  );
}

/* ===================== DASHBOARD ===================== */
export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [servicios, setServicios] = useState([]);
  const [tours, setTours] = useState([]);
  const [transportes, setTransportes] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [hospedajes, setHospedajes] = useState([]);
  const [destinos, setDestinos] = useState([]);

  const cargar = async () => {
    setLoading(true);
    setError('');

    try {
      const results = await Promise.allSettled([
        servicioService.getAll(),
        tourService.getAll(),
        transporteService.getAll(),
        paqueteService.getAll(),
        ventaService.getAll(),
        hospedajeService.getAll(),
        destinoService.getAll(),
      ]);

      const getDataOrEmpty = (r) => {
        if (r.status === 'fulfilled') return r.value?.data ?? [];
        const status = r.reason?.response?.status;
        if (status === 404 || status === 401 || status === 403) return [];
        return [];
      };

      setServicios(getDataOrEmpty(results[0]));
      setTours(getDataOrEmpty(results[1]));
      setTransportes(getDataOrEmpty(results[2]));
      setPaquetes(getDataOrEmpty(results[3]));
      setVentas(getDataOrEmpty(results[4]));
      setHospedajes(getDataOrEmpty(results[5]));
      setDestinos(getDataOrEmpty(results[6]));
    } catch (e) {
      console.error(e);
      setError('No se pudieron cargar los datos del dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  /* ===================== MEMOS ===================== */
  const serviciosByTipo = useMemo(() => {
    const base = { HOSPEDAJE: 0, TOUR: 0, TRANSPORTE: 0, OTRO: 0 };

    servicios.forEach((s) => {
      const t = (s?.tipoServicio ?? '').toUpperCase();
      if (base[t] !== undefined) base[t]++;
      else base.OTRO++;
    });

    return base;
  }, [servicios]);

  const ventasTotal = useMemo(
    () => ventas.reduce((acc, v) => acc + Number(v?.total ?? 0), 0),
    [ventas]
  );

  const ventasPorDia = useMemo(() => {
    const now = new Date();
    const keys = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      keys.push(dayKey(d));
    }

    const map = new Map(keys.map((k) => [k, 0]));

    ventas.forEach((v) => {
      const k = dayKey(v?.fechaVenta);
      if (map.has(k)) map.set(k, map.get(k) + Number(v?.total ?? 0));
    });

    return { keys, values: keys.map((k) => map.get(k)) };
  }, [ventas]);

  const ventasRecientes = useMemo(() => {
    return [...ventas]
      .sort((a, b) => new Date(b?.fechaVenta) - new Date(a?.fechaVenta))
      .slice(0, 5);
  }, [ventas]);

  // Calcular destinos más solicitados basado en ventas
  const destinosMasSolicitados = useMemo(() => {
    const destinoCounts = {};
    
    // Contar ventas por destino (basado en tours, hospedajes y transportes)
    ventas.forEach(venta => {
      venta.detalles?.forEach(detalle => {
        // Buscar el destino asociado al servicio
        if (detalle.tipoItem === 'SERVICIO' && detalle.idServicio) {
          // Buscar en tours
          const tour = tours.find(t => t.idServicio === detalle.idServicio);
          if (tour && tour.nombreDepartamento) {
            destinoCounts[tour.nombreDepartamento] = (destinoCounts[tour.nombreDepartamento] || 0) + detalle.cantidad;
          }
          
          // Buscar en hospedajes
          const hospedaje = hospedajes.find(h => h.idServicio === detalle.idServicio);
          if (hospedaje && hospedaje.nombreDepartamento) {
            destinoCounts[hospedaje.nombreDepartamento] = (destinoCounts[hospedaje.nombreDepartamento] || 0) + detalle.cantidad;
          }
          
          // Buscar en transportes
          const transporte = transportes.find(tr => tr.idServicio === detalle.idServicio);
          if (transporte && transporte.nombreDepartamento) {
            destinoCounts[transporte.nombreDepartamento] = (destinoCounts[transporte.nombreDepartamento] || 0) + detalle.cantidad;
          }
        }
      });
    });
    
    // Convertir a array y ordenar
    return Object.entries(destinoCounts)
      .map(([nombreDepartamento, count]) => ({
        nombreDepartamento,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [ventas, tours, hospedajes, transportes]);

  const topServiciosCaros = useMemo(() => {
    return [...servicios]
      .sort((a, b) => Number(b?.precioBase ?? 0) - Number(a?.precioBase ?? 0))
      .slice(0, 5);
  }, [servicios]);

  const ventasHoy = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return ventas.filter(v => {
      const fecha = new Date(v?.fechaVenta);
      fecha.setHours(0, 0, 0, 0);
      return fecha.getTime() === hoy.getTime();
    }).length;
  }, [ventas]);

  const totalVentasHoy = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return ventas
      .filter(v => {
        const fecha = new Date(v?.fechaVenta);
        fecha.setHours(0, 0, 0, 0);
        return fecha.getTime() === hoy.getTime();
      })
      .reduce((acc, v) => acc + Number(v?.total ?? 0), 0);
  }, [ventas]);

  const paquetesStats = useMemo(() => {
    let promos = 0;
    let normales = 0;
    paquetes.forEach((p) => {
      if (p.esPromocion) promos++;
      else normales++;
    });
    const total = paquetes.length || 1;
    return {
      promos,
      normales,
      total,
      promosPct: (promos / total) * 100,
      normalesPct: (normales / total) * 100,
    };
  }, [paquetes]);

  /* ===================== RENDER ===================== */
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.topRow}>
        <div>
          <div style={styles.kicker}>Panel Administrativo</div>
          <h1 style={styles.title}>Dashboard</h1>
          <div style={styles.subtitle}>Resumen operativo y estadísticas</div>
        </div>

        <button style={styles.refreshBtn} onClick={cargar} disabled={loading}>
          {loading ? '⏳ Actualizando…' : '🔄 Actualizar'}
        </button>
      </div>

      {error && <div style={styles.alertError}>{error}</div>}

      {/* KPIS */}
      <div style={styles.kpiGrid}>
        <KpiCard 
          label="Total Ventas" 
          value={formatMoney(ventasTotal)} 
          icon="💰"
          color="#059669"
          bgColor="#d1fae5"
        />
        <KpiCard 
          label="Ventas Hoy" 
          value={ventasHoy}
          subValue={formatMoney(totalVentasHoy)}
          icon="📊"
          color="#2563eb"
          bgColor="#dbeafe"
        />
        <KpiCard 
          label="Servicios" 
          value={servicios.length}
          icon="⚙️"
          color="#7c3aed"
          bgColor="#ede9fe"
        />
        <KpiCard 
          label="Hospedajes" 
          value={hospedajes.length}
          icon="🏨"
          color="#dc2626"
          bgColor="#fee2e2"
        />
        <KpiCard 
          label="Tours" 
          value={tours.length}
          icon="🗺️"
          color="#ea580c"
          bgColor="#fef3c7"
        />
        <KpiCard 
          label="Transportes" 
          value={transportes.length}
          icon="🚌"
          color="#0891b2"
          bgColor="#cffafe"
        />
        <KpiCard 
          label="Paquetes" 
          value={paquetes.length}
          icon="📦"
          color="#be185d"
          bgColor="#fce7f3"
        />
        <KpiCard 
          label="Total Items" 
          value={servicios.length + tours.length + transportes.length + paquetes.length}
          icon="📋"
          color="#475569"
          bgColor="#f1f5f9"
        />
      </div>

      {/* CHARTS GRID */}
      <div style={styles.chartsGrid}>
        {/* Ventas últimos 7 días */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>📈 Ventas últimos 7 días</h3>
          </div>
          <SparkBars values={ventasPorDia.values} />
          <div style={styles.cardFooter}>
            <strong style={styles.totalText}>Total: {formatMoney(ventasTotal)}</strong>
          </div>
        </div>

        {/* Distribución por tipo de servicio */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>📊 Servicios por Tipo</h3>
          </div>
          <div style={styles.pieChart}>
            <div style={styles.pieItem}>
              <div style={{...styles.pieBar, backgroundColor: '#3b82f6', width: `${(serviciosByTipo.HOSPEDAJE / Math.max(1, servicios.length)) * 100}%`}}></div>
              <span style={styles.pieLabel}>Hospedaje: {serviciosByTipo.HOSPEDAJE}</span>
            </div>
            <div style={styles.pieItem}>
              <div style={{...styles.pieBar, backgroundColor: '#f59e0b', width: `${(serviciosByTipo.TOUR / Math.max(1, servicios.length)) * 100}%`}}></div>
              <span style={styles.pieLabel}>Tour: {serviciosByTipo.TOUR}</span>
            </div>
            <div style={styles.pieItem}>
              <div style={{...styles.pieBar, backgroundColor: '#10b981', width: `${(serviciosByTipo.TRANSPORTE / Math.max(1, servicios.length)) * 100}%`}}></div>
              <span style={styles.pieLabel}>Transporte: {serviciosByTipo.TRANSPORTE}</span>
            </div>
          </div>
        </div>

        {/* Paquetes: Promos vs Regulares */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>🎁 Paquetes (Promos vs Regulares)</h3>
          </div>
          {paquetes.length === 0 ? (
            <div style={styles.emptyState}>No hay paquetes registrados</div>
          ) : (
            <div style={styles.paqueteChartContainer}>
              <div style={styles.paqueteRow}>
                <span style={styles.paqueteLabel}>Promos</span>
                <div style={styles.paqueteBarTrack}>
                  <div
                    style={{
                      ...styles.paqueteBarFillPromo,
                      width: `${Math.max(5, paquetesStats.promosPct)}%`,
                    }}
                  />
                </div>
                <span style={styles.paqueteValue}>
                  {paquetesStats.promos} ({paquetesStats.promosPct.toFixed(0)}%)
                </span>
              </div>
              <div style={styles.paqueteRow}>
                <span style={styles.paqueteLabel}>Regulares</span>
                <div style={styles.paqueteBarTrack}>
                  <div
                    style={{
                      ...styles.paqueteBarFillNormal,
                      width: `${Math.max(5, paquetesStats.normalesPct)}%`,
                    }}
                  />
                </div>
                <span style={styles.paqueteValue}>
                  {paquetesStats.normales} ({paquetesStats.normalesPct.toFixed(0)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TABLES GRID */}
      <div style={styles.tablesGrid}>
        {/* Ventas Recientes */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>🕐 Ventas Recientes</h3>
          </div>
          <div style={styles.tableContainer}>
            {ventasRecientes.length === 0 ? (
              <div style={styles.emptyState}>No hay ventas recientes</div>
            ) : (
              <table style={styles.miniTable}>
                <thead>
                  <tr>
                    <th style={styles.miniTh}>ID</th>
                    <th style={styles.miniTh}>Fecha</th>
                    <th style={styles.miniTh}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasRecientes.map((v) => (
                    <tr key={v.idVenta}>
                      <td style={styles.miniTd}>#{v.idVenta}</td>
                      <td style={styles.miniTd}>
                        {new Date(v.fechaVenta).toLocaleDateString('es-PE', { month: 'short', day: 'numeric' })}
                      </td>
                      <td style={{...styles.miniTd, fontWeight: '700', color: '#10b981'}}>
                        {formatMoney(v.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Servicios */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>⭐ Top Servicios</h3>
          </div>
          <div style={styles.tableContainer}>
            {topServiciosCaros.length === 0 ? (
              <div style={styles.emptyState}>No hay servicios</div>
            ) : (
              <table style={styles.miniTable}>
                <thead>
                  <tr>
                    <th style={styles.miniTh}>Nombre</th>
                    <th style={styles.miniTh}>Tipo</th>
                    <th style={styles.miniTh}>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {topServiciosCaros.map((s) => (
                    <tr key={s.idServicio}>
                      <td style={styles.miniTd}>{s.nombre}</td>
                      <td style={styles.miniTd}>
                        <span style={getTipoBadgeStyle(s.tipoServicio)}>
                          {s.tipoServicio}
                        </span>
                      </td>
                      <td style={{...styles.miniTd, fontWeight: '700', color: '#10b981'}}>
                        {formatMoney(s.precioBase)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* MAPA DEL PERÚ - DESTINOS MÁS SOLICITADOS */}
      <div style={styles.mapSection}>
        <div style={styles.mapCard}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>🗺️ Destinos Más Solicitados en el Perú</h3>
            <p style={styles.mapSubtitle}>
              Visualización de los destinos con mayor demanda según las ventas realizadas
            </p>
          </div>
          {destinosMasSolicitados.length === 0 ? (
            <div style={styles.emptyState}>
              No hay datos de destinos disponibles aún
            </div>
          ) : (
            <PeruMap destinosData={destinosMasSolicitados} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================== UI ===================== */
function KpiCard({ label, value, subValue, icon, color, bgColor }) {
  return (
    <div style={{...styles.kpiCard, borderTop: `4px solid ${color}`, backgroundColor: bgColor || '#ffffff'}}>
      <div style={styles.kpiHeader}>
        <span style={styles.kpiIcon}>{icon}</span>
        <div style={{...styles.kpiLabel, color: '#64748b'}}>{label}</div>
      </div>
      <div style={{...styles.kpiValue, color}}>{value}</div>
      {subValue && <div style={styles.kpiSubValue}>{subValue}</div>}
    </div>
  );
}

function getTipoBadgeStyle(tipo) {
  const base = {
    padding: '0.25rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
  };

  switch (tipo?.toUpperCase()) {
    case 'HOSPEDAJE':
      return { ...base, backgroundColor: '#dbeafe', color: '#1e40af' };
    case 'TOUR':
      return { ...base, backgroundColor: '#fef3c7', color: '#92400e' };
    case 'TRANSPORTE':
      return { ...base, backgroundColor: '#d1fae5', color: '#065f46' };
    default:
      return { ...base, backgroundColor: '#f1f5f9', color: '#475569' };
  }
}

/* ===================== STYLES ===================== */
const styles = {
  page: {
    padding: '2rem',
    background: 'linear-gradient(to bottom, #ffffff 0%, #f0f4ff 100%)',
    minHeight: '100vh',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  kicker: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '1rem',
  },
  refreshBtn: {
    padding: '0.75rem 1.5rem',
    background: '#3b82f6',
    color: '#fff',
    borderRadius: '10px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.2s',
  },
  alertError: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '1rem',
    borderRadius: '10px',
    marginBottom: '1.5rem',
    border: '1px solid #fecaca',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  kpiCard: {
    background: '#ffffff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  kpiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  kpiIcon: {
    fontSize: '1.75rem',
  },
  kpiLabel: {
    fontWeight: '600',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  kpiValue: {
    fontSize: '2rem',
    fontWeight: '800',
    lineHeight: 1,
  },
  kpiSubValue: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginTop: '0.5rem',
    fontWeight: '500',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  tablesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  card: {
    background: '#ffffff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.08)',
    border: '1px solid #e0e7ff',
  },
  cardHeader: {
    marginBottom: '1.25rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #f1f5f9',
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  cardFooter: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '2px solid #f1f5f9',
  },
  totalText: {
    fontSize: '1.1rem',
    color: '#10b981',
    fontWeight: '700',
  },
  pieChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  pieItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  pieBar: {
    height: '28px',
    borderRadius: '6px',
    minWidth: '4px',
    transition: 'width 0.3s',
  },
  pieLabel: {
    fontSize: '0.9rem',
    color: '#475569',
    fontWeight: '600',
    minWidth: '120px',
  },
  tableContainer: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  miniTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  miniTh: {
    padding: '0.75rem',
    textAlign: 'left',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    fontWeight: '700',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '2px solid #e2e8f0',
  },
  miniTd: {
    padding: '0.75rem',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
  },
  emptyState: {
    padding: '2.5rem',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '0.95rem',
  },
  spark: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7,1fr)',
    gap: '8px',
    height: '140px',
    marginBottom: '0.5rem',
    alignItems: 'flex-end',
  },
  sparkBar: {
    background: 'linear-gradient(to top, #2563eb, #3b82f6, #60a5fa)',
    borderRadius: '6px 6px 0 0',
    minHeight: '10px',
    transition: 'all 0.3s',
    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)',
  },
  paqueteChartContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  paqueteRow: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 120px',
    alignItems: 'center',
    gap: '0.75rem',
  },
  paqueteLabel: {
    fontSize: '0.85rem',
    color: '#475569',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  paqueteBarTrack: {
    height: '20px',
    borderRadius: '10px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  paqueteBarFillPromo: {
    height: '100%',
    background: 'linear-gradient(90deg, #ea580c, #f97316, #facc15)',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(234, 88, 12, 0.3)',
  },
  paqueteBarFillNormal: {
    height: '100%',
    background: 'linear-gradient(90deg, #2563eb, #3b82f6, #10b981)',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)',
  },
  paqueteValue: {
    fontSize: '0.9rem',
    color: '#0f172a',
    textAlign: 'right',
    fontWeight: '600',
  },
  // Mapa del Perú
  mapSection: {
    marginTop: '2rem',
  },
  mapCard: {
    background: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.08)',
    border: '1px solid #e0e7ff',
  },
  mapSubtitle: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: '0.5rem 0 0 0',
    fontWeight: '500',
  },
};
