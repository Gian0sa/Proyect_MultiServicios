import { useEffect, useMemo, useState } from 'react';
import { paqueteService } from "../../api/paqueteService";
import { tourService } from "../../api/tourService";
import { transporteService } from "../../api/transporteService";
import { servicioService } from "../../api/servicioService";
import { ventaService } from "../../api/ventaService";
import { hospedajeService } from "../../api/hospedajeService";



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
          title={`${v}`}
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
          <div style={styles.subtitle}>Resumen operativo</div>
        </div>

        <button style={styles.refreshBtn} onClick={cargar} disabled={loading}>
          {loading ? 'Actualizando…' : 'Actualizar'}
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
        />
        <KpiCard 
          label="Ventas Hoy" 
          value={ventasHoy}
          subValue={formatMoney(totalVentasHoy)}
          icon="📊"
          color="#2563eb"
        />
        <KpiCard 
          label="Servicios" 
          value={servicios.length}
          icon="⚙️"
          color="#7c3aed"
        />
        <KpiCard 
          label="Hospedajes" 
          value={hospedajes.length}
          icon="🏨"
          color="#dc2626"
        />
        <KpiCard 
          label="Tours" 
          value={tours.length}
          icon="🗺️"
          color="#ea580c"
        />
        <KpiCard 
          label="Transportes" 
          value={transportes.length}
          icon="🚌"
          color="#0891b2"
        />
        <KpiCard 
          label="Paquetes" 
          value={paquetes.length}
          icon="📦"
          color="#be185d"
        />
        <KpiCard 
          label="Total Items" 
          value={servicios.length + tours.length + transportes.length + paquetes.length}
          icon="📋"
          color="#64748b"
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
              <span>Hospedaje: {serviciosByTipo.HOSPEDAJE}</span>
            </div>
            <div style={styles.pieItem}>
              <div style={{...styles.pieBar, backgroundColor: '#f59e0b', width: `${(serviciosByTipo.TOUR / Math.max(1, servicios.length)) * 100}%`}}></div>
              <span>Tour: {serviciosByTipo.TOUR}</span>
            </div>
            <div style={styles.pieItem}>
              <div style={{...styles.pieBar, backgroundColor: '#10b981', width: `${(serviciosByTipo.TRANSPORTE / Math.max(1, servicios.length)) * 100}%`}}></div>
              <span>Transporte: {serviciosByTipo.TRANSPORTE}</span>
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
                      <td style={{...styles.miniTd, fontWeight: '700', color: '#059669'}}>
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
                      <td style={{...styles.miniTd, fontWeight: '700', color: '#059669'}}>
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
    </div>
  );
}

/* ===================== UI ===================== */
function KpiCard({ label, value, subValue, icon, color }) {
  return (
    <div style={{...styles.kpiCard, borderTop: `4px solid ${color}`}}>
      <div style={styles.kpiHeader}>
        <span style={styles.kpiIcon}>{icon}</span>
        <div style={styles.kpiLabel}>{label}</div>
      </div>
      <div style={{...styles.kpiValue, color}}>{value}</div>
      {subValue && <div style={styles.kpiSubValue}>{subValue}</div>}
    </div>
  );
}

function getTipoBadgeStyle(tipo) {
  const base = {
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '800',
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
    background:
      'radial-gradient(circle at top, #020617 0, #020617 45%, #0f172a 100%)',
    minHeight: '100vh',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  kicker: { fontSize: '0.8rem', color: '#9ca3af' },
  title: { fontSize: '2rem', fontWeight: 900, color: '#e5e7eb' },
  subtitle: { color: '#9ca3af' },
  refreshBtn: {
    padding: '0.7rem 1rem',
    background: '#2563eb',
    color: '#fff',
    borderRadius: '10px',
    border: 'none',
  },
  alertError: {
    background: '#fee2e2',
    padding: '1rem',
    borderRadius: '10px',
    marginBottom: '1rem',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  kpiCard: {
    background: '#020617',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  kpiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  kpiIcon: {
    fontSize: '1.5rem',
  },
  kpiLabel: { 
    color: '#9ca3af', 
    fontWeight: 600,
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  kpiValue: { 
    fontSize: '2rem', 
    fontWeight: 900,
    lineHeight: 1,
  },
  kpiSubValue: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    marginTop: '0.25rem',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  tablesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
  },
  cardHeader: {
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e2e8f0',
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#e5e7eb',
  },
  cardFooter: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e2e8f0',
  },
  totalText: {
    fontSize: '1.1rem',
    color: '#4ade80',
  },
  pieChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  pieItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  pieBar: {
    height: '24px',
    borderRadius: '4px',
    minWidth: '4px',
    transition: 'width 0.3s',
  },
  tableContainer: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  miniTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  miniTh: {
    padding: '0.75rem',
    textAlign: 'left',
    backgroundColor: '#020617',
    color: '#9ca3af',
    fontWeight: 700,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e2e8f0',
  },
  miniTd: {
    padding: '0.75rem',
    borderBottom: '1px solid #1f2933',
    color: '#e5e7eb',
  },
  emptyState: {
    padding: '2rem',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  card: {
    marginTop: '1rem',
    background: '#020617',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
  },
  spark: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7,1fr)',
    gap: '6px',
    height: '120px',
    marginBottom: '0.5rem',
  },
  sparkBar: {
    background: '#38bdf8',
    borderRadius: '6px',
  },
  paqueteChartContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  paqueteRow: {
    display: 'grid',
    gridTemplateColumns: '110px 1fr 90px',
    alignItems: 'center',
    gap: '0.5rem',
  },
  paqueteLabel: {
    fontSize: '0.8rem',
    color: '#cbd5f5',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  paqueteBarTrack: {
    height: '16px',
    borderRadius: '999px',
    backgroundColor: '#020617',
    border: '1px solid #1f2937',
    overflow: 'hidden',
  },
  paqueteBarFillPromo: {
    height: '100%',
    background:
      'linear-gradient(90deg, #f97316, #facc15)',
  },
  paqueteBarFillNormal: {
    height: '100%',
    background:
      'linear-gradient(90deg, #0ea5e9, #22c55e)',
  },
  paqueteValue: {
    fontSize: '0.85rem',
    color: '#e5e7eb',
    textAlign: 'right',
  },
};
