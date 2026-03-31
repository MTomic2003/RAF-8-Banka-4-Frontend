import { useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useFetch } from '../../hooks/useFetch';
import { clientsApi } from '../../api/endpoints/clients';
import { clientApi } from '../../api/endpoints/client';
import Navbar from '../../components/layout/Navbar';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import styles from './LoansPortal.module.css';

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ width: 180, fontSize: 12, fontWeight: 600, color: 'var(--tx-3)', textTransform: 'uppercase', flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: 14, color: 'var(--tx-1)' }}>{value ?? '—'}</span>
    </div>
  );
}

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const { data: client, loading, error } = useFetch(() => clientsApi.getById(id), [id]);
  const { data: accountsRes } = useFetch(() => clientApi.getAccounts(id), [id]);
  const accounts = Array.isArray(accountsRes) ? accountsRes : accountsRes?.data ?? [];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.page-anim', { opacity: 0, y: 20, duration: 0.45, stagger: 0.07, ease: 'power2.out' });
    }, pageRef);
    return () => ctx.revert();
  }, [loading]);

  return (
    <div ref={pageRef} className={styles.stranica}>
      <Navbar />
      <main className={styles.sadrzaj}>

        <div className="page-anim">
          <div className={styles.breadcrumb}>
            <span
              style={{ cursor: 'pointer', color: 'var(--blue)' }}
              onClick={() => navigate('/clients')}
            >
              Klijenti
            </span>
            <span className={styles.sep}>›</span>
            <span className={styles.current}>Profil klijenta</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
            <button
              onClick={() => navigate('/clients')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx-2)', fontSize: 14 }}
            >
              ← Nazad
            </button>
          </div>
          <h1 className={styles.title}>Profil klijenta</h1>
        </div>

        {loading && <Spinner />}
        {error && <Alert tip="greska" poruka="Greška pri učitavanju podataka klijenta." />}

        {!loading && !error && client && (
          <>
            <section className="page-anim" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <div className={styles.sectionHeader} style={{ marginBottom: 16 }}>
                Lični podaci
              </div>
              <InfoRow label="Ime" value={client.first_name} />
              <InfoRow label="Prezime" value={client.last_name} />
              <InfoRow label="Email" value={client.email} />
              <InfoRow label="Telefon" value={client.phone} />
              <InfoRow label="Adresa" value={client.address} />
              <InfoRow label="JMBG" value={client.jmbg} />
              <InfoRow label="Status" value={client.active ? 'Aktivan' : 'Neaktivan'} />
            </section>

            <section className="page-anim" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <div className={styles.sectionHeader} style={{ marginBottom: 16 }}>
                Računi ({accounts.length})
              </div>
              {accounts.length === 0 ? (
                <p style={{ fontSize: 14, color: 'var(--tx-3)' }}>Klijent nema otvorenih računa.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr>
                      {['Broj računa', 'Naziv', 'Valuta', 'Stanje', 'Status'].map(h => (
                        <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--tx-3)', padding: '8px 12px', borderBottom: '1.5px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map(acc => {
                      const num = acc.account_number ?? acc.number;
                      const balance = acc.balance ?? acc.available_balance ?? 0;
                      return (
                        <tr key={num}>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--mono)', fontSize: 12 }}>{num}</td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>{acc.name ?? '—'}</td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>{acc.currency ?? '—'}</td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
                            {balance.toLocaleString('sr-RS', { minimumFractionDigits: 2 })} {acc.currency}
                          </td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                              background: acc.status === 'Active' || acc.active ? 'var(--green-bg)' : 'var(--red-bg)',
                              color: acc.status === 'Active' || acc.active ? 'var(--green)' : 'var(--red)',
                            }}>
                              {acc.status ?? (acc.active ? 'Aktivan' : 'Neaktivan')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
