import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Monitor, Thermometer } from 'lucide-react';
import banner2 from '../assets/Banner/Banner2.jpg';
import banner3 from '../assets/Banner/Banner3.jpg';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

// ── Helper: get next weekday date string (YYYY-MM-DD) ──────────────────────
function getWeekday(dayIndex) {
  // dayIndex: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri
  const today = new Date();
  const diff = dayIndex - today.getDay();
  const d = new Date(today);
  d.setDate(today.getDate() + diff);
  return d.toISOString().split('T')[0];
}

// ── Schedule Events Data ────────────────────────────────────────────────────
const scheduleEvents = [
  // Senin
  { title: 'SMKS BEST AGRO 1 (PRAKTIK)', start: `${getWeekday(1)}T11:45:00`, end: `${getWeekday(1)}T12:45:00`, color: '#27ae60' },
  { title: 'SMKS BEST AGRO 1 (PRAKTIK)', start: `${getWeekday(1)}T10:15:00`, end: `${getWeekday(1)}T11:45:00`, color: '#27ae60' },
  { title: 'SMKS BEST AGRO 1 (PRAKTIK)', start: `${getWeekday(1)}T08:45:00`, end: `${getWeekday(1)}T10:15:00`, color: '#27ae60' },
  { title: 'SMKS BEST AGRO 1 (PRAKTIK)', start: `${getWeekday(1)}T07:15:00`, end: `${getWeekday(1)}T08:45:00`, color: '#27ae60' },
  // Selasa
  { title: 'SMPS TASK (PRAKTIK)', start: `${getWeekday(2)}T07:15:00`, end: `${getWeekday(2)}T08:45:00`, color: '#27ae60' },
  { title: 'SDS 07 BEST AGRO (PRAKTIK)', start: `${getWeekday(2)}T08:45:00`, end: `${getWeekday(2)}T10:15:00`, color: '#27ae60' },
  { title: 'SDS TUNAS AGRO (PRATIK)', start: `${getWeekday(2)}T10:15:00`, end: `${getWeekday(2)}T11:45:00`, color: '#27ae60' },
  // Rabu
  { title: 'SMPS TASK (PRAKTIK)', start: `${getWeekday(3)}T07:15:00`, end: `${getWeekday(3)}T08:45:00`, color: '#27ae60' },
  { title: 'SDS 06 BEST AGRO (PRAKTIK)', start: `${getWeekday(3)}T08:45:00`, end: `${getWeekday(3)}T10:15:00`, color: '#27ae60' },
  { title: 'SDS TUNAS AGRO (PRATIK)', start: `${getWeekday(3)}T10:15:00`, end: `${getWeekday(3)}T11:45:00`, color: '#27ae60' },
  // Kamis
  { title: 'SDS 06 BEST AGRO (PRAKTIK)', start: `${getWeekday(4)}T07:15:00`, end: `${getWeekday(4)}T08:45:00`, color: '#27ae60' },
  { title: 'SDS 07 BEST AGRO (PRAKTIK)', start: `${getWeekday(4)}T08:45:00`, end: `${getWeekday(4)}T10:15:00`, color: '#27ae60' },
  { title: 'SDS TUNAS AGRO (PRATIK)', start: `${getWeekday(4)}T10:15:00`, end: `${getWeekday(4)}T11:45:00`, color: '#27ae60' },
  // Jumat
  { title: 'OPEN LAB (BEBAS SISWA)', start: `${getWeekday(5)}T07:15:00`, end: `${getWeekday(5)}T11:45:00`, color: '#2980b9' },
  // Sabtu
  { title: 'SMKS BEST AGRO 1 (PRAKTIK)', start: `${getWeekday(6)}T11:45:00`, end: `${getWeekday(6)}T12:45:00`, color: '#27ae60' },
  { title: 'SMKS BEST AGRO 1 (PRAKTIK)', start: `${getWeekday(6)}T10:15:00`, end: `${getWeekday(6)}T11:45:00`, color: '#27ae60' },
  { title: 'SMKS BEST AGRO 1 (PRAKTIK)', start: `${getWeekday(6)}T08:45:00`, end: `${getWeekday(6)}T10:15:00`, color: '#27ae60' },
  { title: 'SMKS BEST AGRO 1 (PRAKTIK)', start: `${getWeekday(6)}T07:15:00`, end: `${getWeekday(6)}T08:45:00`, color: '#27ae60' },
];

// ── Quick Stats ──────────────────────────────────────────────────────────────
function QuickStats() {
  return (
    <section style={{ padding: '32px 24px 0' }}>
      <h2 style={{
        fontSize: '22px',
        fontWeight: '800',
        letterSpacing: '1px',
        marginBottom: '16px',
        color: '#0d2137'
      }}>
        QUICK STATS
      </h2>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>

        {/* Status */}
        <div style={{
          flex: '1', minWidth: '180px',
          background: '#ffffff',
          border: '2px solid #27ae60', borderRadius: '12px',
          padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 2px 12px rgba(39,174,96,0.12)'
        }}>
          <span style={{
            width: '14px', height: '14px', borderRadius: '50%',
            background: '#27ae60', display: 'inline-block',
            boxShadow: '0 0 0 4px rgba(39,174,96,0.2)'
          }} />
          <div>
            <div style={{ fontSize: '11px', color: '#666', fontWeight: '700', letterSpacing: '0.5px' }}>
              STATUS SAAT INI:
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#27ae60' }}>TERSEDIA</div>
          </div>
        </div>

        {/* Unit PC */}
        <div style={{
          flex: '1', minWidth: '180px',
          background: '#ffffff',
          border: '2px solid #2980b9', borderRadius: '12px',
          padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 2px 12px rgba(41,128,185,0.12)'
        }}>
          <Monitor size={32} color="#2980b9" />
          <div>
            <div style={{ fontSize: '40px', fontWeight: '900', color: '#2980b9', lineHeight: 1 }}>43</div>
            <div style={{ fontSize: '12px', color: '#555', fontWeight: '700' }}>Unit Komputer&nbsp;<span style={{ color: '#2980b9' }}>AKTIF</span></div>
          </div>
        </div>

        {/* Suhu */}
        <div style={{
          flex: '1', minWidth: '180px',
          background: '#ffffff',
          border: '2px solid #f39c12', borderRadius: '12px',
          padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 2px 12px rgba(243,156,18,0.12)'
        }}>
          <Thermometer size={32} color="#f39c12" />
          <div>
            <div style={{ fontSize: '11px', color: '#666', fontWeight: '700', letterSpacing: '0.5px' }}>
              SUHU RUANGAN:
            </div>
            <div style={{ fontSize: '30px', fontWeight: '900', color: '#f39c12' }}>23°C</div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ── Fitur Utama Lab ──────────────────────────────────────────────────────────
function FiturUtama() {
  const fitur = [
    {
      icon: '🖥️',
      bg: '#2980b9',
      title: 'ANBK',
      sub: 'UJIAN BERBASIS KOMPUTER',
      desc: 'Fasilitas untuk ANBK dan ujian sekolah stabil.',
    },
    {
      icon: '🔍',
      bg: '#27ae60',
      title: 'SELF-LEARNING',
      sub: '',
      desc: 'Riset tugas dan pengembangan skill Komputer.',
    },
  ];

  return (
    <section style={{ padding: '32px 24px 0' }}>
      <h2 style={{
        fontSize: '22px', fontWeight: '800',
        letterSpacing: '1px', marginBottom: '20px', color: '#0d2137'
      }}>
        FITUR UTAMA LAB
      </h2>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {fitur.map((f, i) => (
          <div key={i} style={{
            flex: '1', minWidth: '200px', textAlign: 'center',
            background: '#ffffff', borderRadius: '14px',
            padding: '24px 16px',
            boxShadow: '0 2px 12px rgba(13,33,55,0.08)'
          }}>
            <div style={{
              width: '68px', height: '68px', borderRadius: '18px',
              background: f.bg, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '30px', margin: '0 auto 14px',
              boxShadow: `0 6px 18px ${f.bg}55`
            }}>
              {f.icon}
            </div>
            <div style={{ fontWeight: '900', fontSize: '15px', color: '#0d2137', lineHeight: 1.2 }}>
              {f.title}
            </div>
            {f.sub && (
              <div style={{ fontWeight: '700', fontSize: '12px', color: '#444', marginTop: '3px' }}>
                {f.sub}
              </div>
            )}
            <div style={{ fontSize: '13px', color: '#666', marginTop: '8px', lineHeight: '1.6' }}>
              {f.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Kategori warna ────────────────────────────────────────────────────────────
const KATEGORI = [
  { label: 'Kelas (Praktik)', color: '#27ae60' },
  { label: 'Open Lab / Bebas Siswa', color: '#2980b9' },
  { label: 'Ujian / ANBK', color: '#8e44ad' },
  { label: 'Lainnya', color: '#e74c3c' },
];

// ── ScheduleCalendar (FullCalendar) ─────────────────────────────────────────
function ScheduleCalendar() {
  const [events, setEvents] = useState(scheduleEvents);
  const [detailModal, setDetailModal] = useState(null);   // {id, title, start, end, color}
  const [showAddForm, setShowAddForm] = useState(false);
  const [prefillDate, setPrefillDate] = useState('');
  const [form, setForm] = useState({
    title: '',
    date: '',
    jamMulai: '09:00',
    jamSelesai: '11:00',
    kategori: KATEGORI[0].color,
  });
  const [formError, setFormError] = useState('');

  /* ── helpers ─────────────────────────────────── */
  const fmt = (dt) => dt
    ? dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : '-';

  const openAddForm = (dateStr = '') => {
    setPrefillDate(dateStr);
    setForm(prev => ({ ...prev, date: dateStr, title: '', jamMulai: '09:00', jamSelesai: '11:00', kategori: KATEGORI[0].color }));
    setFormError('');
    setShowAddForm(true);
  };

  const handleDateClick = (info) => openAddForm(info.dateStr);

  const handleEventClick = (info) => {
    setDetailModal({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      color: info.event.backgroundColor,
    });
  };

  const handleSubmit = () => {
    if (!form.title.trim()) { setFormError('Nama kegiatan wajib diisi.'); return; }
    if (!form.date) { setFormError('Tanggal wajib diisi.'); return; }
    if (form.jamMulai >= form.jamSelesai) { setFormError('Jam selesai harus setelah jam mulai.'); return; }

    const newEvent = {
      id: `custom-${Date.now()}`,
      title: form.title.trim(),
      start: `${form.date}T${form.jamMulai}:00`,
      end: `${form.date}T${form.jamSelesai}:00`,
      color: form.kategori,
    };
    setEvents(prev => [...prev, newEvent]);
    setShowAddForm(false);
  };

  const handleDelete = () => {
    setEvents(prev => prev.filter(e => e.id !== detailModal.id));
    setDetailModal(null);
  };

  /* ── input style ─────────────────────────────── */
  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '10px',
    border: '1.5px solid #d0dce9', fontSize: '14px', color: '#1a2340',
    outline: 'none', boxSizing: 'border-box', background: '#f7faff',
  };
  const labelStyle = { fontSize: '13px', fontWeight: '700', color: '#444', marginBottom: '4px', display: 'block' };

  /* ── render ──────────────────────────────────── */
  return (
    <section style={{ padding: '32px 24px 56px' }}>

      {/* ── Header row ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #2980b9, #1a5276)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontSize: '20px' }}>📅</span>
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#0d2137', margin: 0, letterSpacing: '1px' }}>
              SCHEDULE
            </h2>
            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Jadwal penggunaan Lab Komputer</p>
          </div>
        </div>

        {/* Tombol Tambah */}
        <button
          onClick={() => openAddForm()}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #27ae60, #1e8449)',
            color: '#fff', border: 'none', borderRadius: '12px',
            padding: '11px 22px', fontSize: '14px', fontWeight: '800',
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(39,174,96,0.35)',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>＋</span>
          Tambah Jadwal
        </button>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {KATEGORI.map((k) => (
          <div key={k.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: k.color, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#555', fontWeight: '600' }}>{k.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(13,33,55,0.1)' }}>
        <style>{`
          .fc .fc-toolbar-title { font-size: 17px; font-weight: 800; color: #0d2137; }
          .fc .fc-button { background: #2980b9 !important; border-color: #2980b9 !important; border-radius: 8px !important; font-size: 12px !important; padding: 5px 12px !important; }
          .fc .fc-button:hover { background: #1a5276 !important; border-color: #1a5276 !important; }
          .fc .fc-button-active { background: #1a5276 !important; border-color: #1a5276 !important; }
          .fc .fc-col-header-cell-cushion { font-weight: 800; color: #0d2137; font-size: 13px; text-decoration: none; }
          .fc .fc-timegrid-slot-label { font-size: 12px; color: #777; font-weight: 600; }
          .fc .fc-event { border-radius: 6px !important; border: none !important; font-size: 11px !important; font-weight: 700 !important; }
          .fc .fc-event:hover { opacity: 0.85; cursor: pointer; }
          .fc-day-today { background: #eef6ff !important; }
          .fc .fc-list-event:hover td { background: #f0f7ff !important; }
          .fc .fc-daygrid-day:hover, .fc .fc-timegrid-slot:hover { background: #f0f9ff; cursor: pointer; }
        `}</style>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          buttonText={{ today: 'Hari Ini', month: 'Bulan', week: 'Minggu', day: 'Hari', list: 'Daftar' }}
          locale="id"
          events={events}
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          height="auto"
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          weekends={true}
          hiddenDays={[0]}
          nowIndicator={true}
          selectable={true}
        />
      </div>
      <p style={{ fontSize: '12px', color: '#999', marginTop: '8px', textAlign: 'center' }}>
        💡 Klik pada tanggal/jam di kalender untuk menambah jadwal baru
      </p>

      {/* ═══════════════ MODAL TAMBAH JADWAL ═══════════════ */}
      {showAddForm && (
        <div
          onClick={() => setShowAddForm(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(13,33,55,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, backdropFilter: 'blur(4px)', padding: '16px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '20px', padding: '32px',
              width: '100%', maxWidth: '460px',
              boxShadow: '0 24px 72px rgba(13,33,55,0.28)',
              borderTop: '6px solid #27ae60', animation: 'slideUp 0.25s ease'
            }}
          >
            <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(24px);} to { opacity:1; transform:translateY(0);} }`}</style>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '24px' }}>📝</div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0d2137', margin: '4px 0 0' }}>
                  Tambah Jadwal
                </h3>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                style={{ background: '#f0f4f8', border: 'none', borderRadius: '8px', width: '34px', height: '34px', fontSize: '18px', cursor: 'pointer', color: '#555' }}
              >×</button>
            </div>

            {/* Form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Nama kegiatan */}
              <div>
                <label style={labelStyle}>Nama Kegiatan *</label>
                <input
                  type="text"
                  placeholder="contoh: Kelas XI RPL, ANBK, dst."
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* Tanggal */}
              <div>
                <label style={labelStyle}>Tanggal *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* Jam mulai & selesai */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Jam Mulai *</label>
                  <input
                    type="time"
                    value={form.jamMulai}
                    onChange={e => setForm(p => ({ ...p, jamMulai: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Jam Selesai *</label>
                  <input
                    type="time"
                    value={form.jamSelesai}
                    onChange={e => setForm(p => ({ ...p, jamSelesai: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label style={labelStyle}>Kategori</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {KATEGORI.map(k => (
                    <button
                      key={k.color}
                      onClick={() => setForm(p => ({ ...p, kategori: k.color }))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '7px 14px', borderRadius: '20px', cursor: 'pointer',
                        fontSize: '12px', fontWeight: '700',
                        border: form.kategori === k.color ? `2px solid ${k.color}` : '2px solid #e2e8f0',
                        background: form.kategori === k.color ? `${k.color}18` : '#f7faff',
                        color: form.kategori === k.color ? k.color : '#666',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: k.color, display: 'inline-block' }} />
                      {k.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {formError && (
                <div style={{ background: '#fff3f3', border: '1px solid #f5b7b1', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#c0392b', fontWeight: '600' }}>
                  ⚠️ {formError}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  border: '1.5px solid #d0dce9', background: '#f7faff',
                  fontSize: '14px', fontWeight: '700', color: '#555', cursor: 'pointer'
                }}
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 2, padding: '12px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #27ae60, #1e8449)',
                  fontSize: '14px', fontWeight: '800', color: '#fff', cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(39,174,96,0.35)'
                }}
              >
                ＋ Simpan Jadwal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ MODAL DETAIL EVENT ═══════════════ */}
      {detailModal && (
        <div
          onClick={() => setDetailModal(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(13,33,55,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, backdropFilter: 'blur(4px)', padding: '16px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '20px', padding: '32px',
              minWidth: '300px', maxWidth: '400px', width: '100%',
              boxShadow: '0 24px 72px rgba(0,0,0,0.25)',
              borderTop: `6px solid ${detailModal.color}`
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>📋</div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0d2137', margin: '0 0 18px' }}>
              {detailModal.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '14px', color: '#555' }}>
                📅 <strong>Tanggal:</strong> {detailModal.start?.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div style={{ fontSize: '14px', color: '#555' }}>
                🕒 <strong>Mulai:</strong> {fmt(detailModal.start)}
              </div>
              <div style={{ fontSize: '14px', color: '#555' }}>
                🕔 <strong>Selesai:</strong> {fmt(detailModal.end)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#555' }}>
                🎨 <strong>Kategori:</strong>
                <span style={{ background: detailModal.color, color: '#fff', borderRadius: '6px', padding: '2px 10px', fontSize: '12px', fontWeight: '700' }}>
                  {KATEGORI.find(k => k.color === detailModal.color)?.label ?? 'Lainnya'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              {/* Hapus hanya untuk event custom (bukan bawaan) */}
              {detailModal.id?.startsWith('custom-') && (
                <button
                  onClick={handleDelete}
                  style={{
                    flex: 1, padding: '11px', borderRadius: '10px', border: 'none',
                    background: '#fff0f0', color: '#c0392b',
                    fontSize: '13px', fontWeight: '800', cursor: 'pointer',
                    border: '1.5px solid #f5b7b1'
                  }}
                >
                  🗑 Hapus
                </button>
              )}
              <button
                onClick={() => setDetailModal(null)}
                style={{
                  flex: 2, padding: '11px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #2980b9, #1a5276)',
                  color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer'
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Main Component (Carousel tidak diubah) ───────────────────────────────────
export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      image: banner2,
      description: 'SMK'
    },
    {
      id: 2,
      image: banner3,
      description: 'Deskripsi untuk slide kedua'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop',
      title: 'Slide 3',
      description: 'Deskripsi untuk slide ketiga'
    }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full pt-24 mx-auto p-4" style={{ background: '#dce9f5', minHeight: '100vh' }}>
      {/* ── Carousel (tidak diubah) ── */}
      <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-2xl bg-gray-900">
        <div
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-8 left-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                  <p className="text-lg">{slide.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-200 shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-200 shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Konten Tambahan (di bawah carousel) ── */}
      <QuickStats />
      <FiturUtama />
      <ScheduleCalendar />
    </div>
  );
}